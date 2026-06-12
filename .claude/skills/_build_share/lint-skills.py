#!/usr/bin/env python3
"""Strict frontmatter lint for every skill in the chain.

Unlike write-a-skill/validate_frontmatter.py (a lenient regex parser that
cannot see YAML structure), this gate does a REAL YAML parse so it catches
structural bugs the lenient one misses — notably an unquoted scalar containing
a colon-space (`key: value` text), which strict parsers reject as an accidental
mapping. That class of bug previously shipped silently (see manual-tdd-7zs).

Invocation policy (the audit question is "who starts this?"):
- User types the slash command → `disable-model-invocation: true`. The
  description never enters model context, so it may run long as documentation.
- Another skill chains into it by name, or it answers a natural-language ask
  (mermaid, the mtdd-* atoms, using-beads, write-a-skill, research-report) →
  stays model-invocable, but its description sits in EVERY session's context,
  so it gets a 200-char budget.

Usage:
    python3 lint-skills.py [SKILL.md ...]

With no arguments it auto-discovers every `*/SKILL.md` next to this file's
parent (the .claude/skills/ bundle root), skipping `_*` support dirs.

Exit: 0 = all pass · 1 = at least one failure · 2 = usage error.

PyYAML gives the strict check. If PyYAML isn't installed the lint DEGRADES
LOUDLY: it prints a warning and runs a targeted stdlib check for the
colon-space failure mode rather than silently passing.
"""
import glob
import os
import re
import sys

MAX_DESCRIPTION_CHARS = 1024
# Model-invocable skills (no disable-model-invocation: true) keep their
# description in every session's context — hold them to a tight budget.
MAX_INVOCABLE_DESCRIPTION_CHARS = 200
MAX_NAME_CHARS = 64
RESERVED_NAME_WORDS = ("claude", "anthropic")

try:
    import yaml  # PyYAML — the strict path
    HAVE_YAML = True
except ImportError:
    HAVE_YAML = False


def split_frontmatter(text):
    """Return the raw frontmatter block (between the first two '---'), or None."""
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i])
    return None


def check_strict(fm_text, errors):
    """Real YAML parse — the authoritative structural check."""
    try:
        data = yaml.safe_load(fm_text)
    except yaml.YAMLError as e:
        errors.append(f"frontmatter is not valid YAML: {e}")
        return None
    if not isinstance(data, dict):
        errors.append("frontmatter did not parse to a mapping.")
        return None
    return data


def check_degraded(fm_text, errors, warnings):
    """Stdlib fallback when PyYAML is absent — still catches the colon-space bug."""
    warnings.append(
        "PyYAML not installed — running degraded checks only "
        "(install pyyaml for full strict validation: pip install pyyaml)."
    )
    data = {}
    key = None
    for line in fm_text.split("\n"):
        m = re.match(r"^([A-Za-z0-9_-]+):\s?(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            # Block scalar indicator — value continues on indented lines; safe.
            if val in ("|", "|-", "|+", ">", ">-", ">+"):
                data[key] = "(block scalar)"
                continue
            # Unquoted, single-line value containing ': ' would mis-parse as a
            # nested mapping under strict YAML — the manual-tdd-7zs failure mode.
            quoted = len(val) >= 2 and val[0] == val[-1] and val[0] in "\"'"
            if val and not quoted and re.search(r":\s", val):
                errors.append(
                    f"{key}: unquoted value contains a colon-space and would fail "
                    f"strict YAML — wrap it in quotes or a block scalar (|-)."
                )
            data[key] = val
    return data


def validate(path):
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read()
    except OSError as e:
        print(f"[{path}] ERROR: cannot read: {e}")
        return 1

    errors, warnings = [], []
    fm_text = split_frontmatter(text)
    if fm_text is None:
        print(f"[{path}] FAIL: no frontmatter block (file must start with '---').")
        return 1

    data = check_strict(fm_text, errors) if HAVE_YAML else check_degraded(fm_text, errors, warnings)

    if data:
        name = data.get("name")
        desc = data.get("description")
        if not name:
            errors.append("name: missing or empty.")
        elif isinstance(name, str):
            if "<" in name or ">" in name:
                errors.append("name: contains angle brackets (< or >).")
            if len(name) > MAX_NAME_CHARS:
                errors.append(f"name: {len(name)} chars exceeds max {MAX_NAME_CHARS}.")
            if not re.fullmatch(r"[a-z0-9-]+", name):
                errors.append("name: must be lowercase letters, numbers, hyphens only.")
            for w in RESERVED_NAME_WORDS:
                if w in name.lower():
                    errors.append(f"name: contains reserved word '{w}'.")
        dmi = data.get("disable-model-invocation")
        if not HAVE_YAML and dmi == "true":
            dmi = True  # degraded parser yields strings, not YAML booleans
        if dmi is not None and dmi is not True:
            errors.append(
                "disable-model-invocation: must be the YAML boolean true when present."
            )
        if not desc:
            errors.append("description: missing or empty.")
        elif isinstance(desc, str):
            # On the strict path desc is the PARSED value, so angle-bracket and
            # length checks are accurate (not fooled by a block-scalar indicator).
            if "<" in desc or ">" in desc:
                errors.append("description: contains angle brackets (< or >) in the parsed value.")
            if len(desc) > MAX_DESCRIPTION_CHARS:
                errors.append(f"description: {len(desc)} chars exceeds max {MAX_DESCRIPTION_CHARS}.")
            elif dmi is not True and len(desc) > MAX_INVOCABLE_DESCRIPTION_CHARS:
                errors.append(
                    f"description: {len(desc)} chars exceeds the "
                    f"{MAX_INVOCABLE_DESCRIPTION_CHARS}-char budget for model-invocable "
                    f"skills — shrink it, or set disable-model-invocation: true if "
                    f"only the user starts this skill."
                )

    label = os.path.relpath(path)
    for w in warnings:
        print(f"[{label}] WARN: {w}")
    for e in errors:
        print(f"[{label}] FAIL: {e}")
    if not errors:
        print(f"[{label}] PASS{' (degraded)' if not HAVE_YAML else ''}")
    return 1 if errors else 0


def discover():
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)  # .claude/skills/
    return sorted(
        p for p in glob.glob(os.path.join(root, "*", "SKILL.md"))
        if not os.path.basename(os.path.dirname(p)).startswith("_")
    )


def main(argv):
    paths = argv[1:] or discover()
    if not paths:
        print("Usage: python3 lint-skills.py [SKILL.md ...]  (none found to lint)")
        return 2
    if not HAVE_YAML:
        print("NOTE: PyYAML not found — strict YAML validation degraded. "
              "Install with `pip install pyyaml` for the full gate.\n")
    rc = 0
    for p in paths:
        rc |= validate(p)
    print(f"\n{'FAIL' if rc else 'PASS'}: linted {len(paths)} skill(s).")
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv))
