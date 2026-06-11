#!/usr/bin/env python3
"""Validate Mermaid diagrams before they ship into an artifact.

Usage:
    python validate_mermaid.py FILE.mmd          # validate a single .mmd file
    python validate_mermaid.py FILE.md           # validate every ```mermaid block in a markdown file
    python validate_mermaid.py -                 # read one diagram from stdin
    python validate_mermaid.py --string "graph TD; A-->B"

Exit code 0 = all diagrams valid. Non-zero = at least one failed (details on stderr).

Validation backends, tried in order (mirrors the reference skills' validate-first design):
  1. mmdc        — local Mermaid CLI (@mermaid-js/mermaid-cli). Authoritative.
  2. npx mmdc    — same engine via npx if a node_modules copy exists (no network install).
  3. Kroki API   — POST to a hosted renderer. Authoritative, needs network.
  4. structural  — offline best-effort lint. NOT authoritative; clearly flagged as such.

The first backend that can actually run wins; we do not silently downgrade without saying so.
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

KROKI_URL = "https://kroki.io/mermaid/svg"

# Diagram-type keywords a valid Mermaid source may start with (after %% comments / directives).
DIAGRAM_KEYWORDS = (
    "graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram",
    "stateDiagram-v2", "erDiagram", "journey", "gantt", "pie", "quadrantChart",
    "requirementDiagram", "gitGraph", "mindmap", "timeline", "C4Context",
    "C4Container", "C4Component", "sankey-beta", "xychart-beta", "block-beta",
)


def extract_diagrams(text: str, is_markdown: bool) -> list[str]:
    """Return the list of diagram sources. Markdown -> every ```mermaid fence; else one diagram."""
    if not is_markdown:
        return [text.strip()] if text.strip() else []
    blocks = re.findall(r"```mermaid[ \t]*\r?\n(.*?)\r?\n```", text, re.DOTALL | re.IGNORECASE)
    return [b.strip() for b in blocks if b.strip()]


def _first_meaningful_line(src: str) -> str:
    for line in src.splitlines():
        s = line.strip()
        if not s or s.startswith("%%"):
            continue
        return s
    return ""


# --- Backend 1/2: Mermaid CLI -------------------------------------------------

def _mmdc_cmd() -> list[str] | None:
    if shutil.which("mmdc"):
        return ["mmdc"]
    # Use an already-installed local copy via npx without triggering a network install.
    if shutil.which("npx"):
        return ["npx", "--no-install", "mmdc"]
    return None


def validate_with_mmdc(src: str, cmd: list[str]) -> tuple[bool, str]:
    with tempfile.TemporaryDirectory() as d:
        inp = Path(d) / "in.mmd"
        out = Path(d) / "out.svg"
        inp.write_text(src, encoding="utf-8")
        try:
            proc = subprocess.run(
                cmd + ["-i", str(inp), "-o", str(out)],
                capture_output=True, text=True, timeout=60,
            )
        except subprocess.TimeoutExpired:
            return False, "mmdc timed out after 60s"
        except FileNotFoundError:
            return False, "__BACKEND_UNAVAILABLE__"
        if proc.returncode == 0 and out.exists():
            return True, "ok (mmdc)"
        err = (proc.stderr or proc.stdout or "").strip()
        # npx --no-install prints this when the package isn't present -> treat as unavailable.
        if "could not determine executable" in err.lower() or "not found" in err.lower():
            return False, "__BACKEND_UNAVAILABLE__"
        return False, err or "mmdc reported an error"


# --- Backend 3: Kroki ---------------------------------------------------------

def validate_with_kroki(src: str) -> tuple[bool, str]:
    req = urllib.request.Request(
        KROKI_URL, data=src.encode("utf-8"),
        headers={
            "Content-Type": "text/plain",
            # Kroki sits behind Cloudflare, which rejects the default urllib UA (error 1010).
            "User-Agent": "Mozilla/5.0 (compatible; mermaid-skill-validator/1.0)",
            "Accept": "image/svg+xml",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return (resp.status == 200), "ok (kroki)" if resp.status == 200 else f"kroki status {resp.status}"
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", "replace")
        except Exception:
            pass
        # Kroki returns the parse error as text inside an SVG; pull the readable lines out.
        if "<tspan" in detail:
            spans = re.findall(r"<tspan[^>]*>(.*?)</tspan>", detail, re.DOTALL)
            cleaned = [
                s.replace("&gt;", ">").replace("&lt;", "<")
                 .replace("&apos;", "'").replace("&amp;", "&").strip()
                for s in spans
            ]
            cleaned = [c for c in cleaned if c and "worker.js" not in c and "index.js" not in c]
            detail = " | ".join(cleaned[:4])
        return False, f"kroki rejected the diagram: {detail.strip() or e}"
    except (urllib.error.URLError, TimeoutError, OSError):
        return False, "__BACKEND_UNAVAILABLE__"


# --- Backend 4: offline structural lint (best-effort) -------------------------

def validate_structural(src: str) -> tuple[bool, str]:
    head = _first_meaningful_line(src)
    if not head:
        return False, "empty diagram"
    if not any(head == k or head.startswith(k + " ") or head.startswith(k) for k in DIAGRAM_KEYWORDS):
        return False, (f"first line {head!r} does not start with a known diagram type "
                       f"(graph/flowchart/sequenceDiagram/classDiagram/erDiagram/stateDiagram-v2/...)")
    pairs = {")": "(", "]": "[", "}": "{"}
    stack: list[str] = []
    in_quote = False
    for ch in src:
        if ch == '"':
            in_quote = not in_quote
            continue
        if in_quote:
            continue
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack[-1] != pairs[ch]:
                return False, f"unbalanced bracket near {ch!r}"
            stack.pop()
    if in_quote:
        return False, 'odd number of double-quotes (unterminated label)'
    if stack:
        return False, f"unclosed bracket {stack[-1]!r}"
    return True, "ok (structural lint — best-effort, not authoritative)"


def validate_one(src: str) -> tuple[bool, str, str]:
    """Return (ok, message, backend_name)."""
    cmd = _mmdc_cmd()
    if cmd:
        ok, msg = validate_with_mmdc(src, cmd)
        if msg != "__BACKEND_UNAVAILABLE__":
            return ok, msg, "mmdc"
    ok, msg = validate_with_kroki(src)
    if msg != "__BACKEND_UNAVAILABLE__":
        return ok, msg, "kroki"
    ok, msg = validate_structural(src)
    return ok, msg, "structural"


def main() -> int:
    ap = argparse.ArgumentParser(description="Validate Mermaid diagrams.")
    ap.add_argument("path", nargs="?", help="FILE.mmd, FILE.md, or - for stdin")
    ap.add_argument("--string", help="validate this diagram string directly")
    args = ap.parse_args()

    if args.string is not None:
        text, is_md = args.string, False
    elif args.path in (None, "-"):
        text, is_md = sys.stdin.read(), False
    else:
        p = Path(args.path)
        if not p.exists():
            print(f"FAIL: file not found: {p}", file=sys.stderr)
            return 2
        text = p.read_text(encoding="utf-8")
        is_md = p.suffix.lower() in (".md", ".markdown")

    diagrams = extract_diagrams(text, is_md)
    if not diagrams:
        print("FAIL: no mermaid diagram found "
              "(markdown needs a ```mermaid fenced block)", file=sys.stderr)
        return 2

    failures = 0
    used_structural = False
    for i, src in enumerate(diagrams, 1):
        ok, msg, backend = validate_one(src)
        label = f"diagram {i}/{len(diagrams)}"
        if ok:
            print(f"PASS  {label}: {msg}")
            if backend == "structural":
                used_structural = True
        else:
            failures += 1
            print(f"FAIL  {label} [{backend}]: {msg}", file=sys.stderr)

    if used_structural:
        print("\nNOTE: only the offline structural lint was available — install "
              "@mermaid-js/mermaid-cli (npm i -g @mermaid-js/mermaid-cli) or allow "
              "network access to kroki.io for an authoritative check.", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
