#!/usr/bin/env python3
"""Validate the YAML frontmatter of a SKILL.md against the blocking rules.

Usage:
    python scripts/validate_frontmatter.py path/to/SKILL.md

Exit code 0 = all hard rules pass. Exit code 1 = at least one hard rule failed.
Warnings (heuristic checks) are reported but never change the exit code on
their own — natural-language matching is fuzzy, so they prompt review rather
than block.
"""
import re
import sys

# Platform-enforced limits from the Skills runtime (see reference.md,
# "YAML frontmatter requirements"). These are the exact values the loader
# itself rejects on, so they are hard failures here too.
MAX_DESCRIPTION_CHARS = 1024
MAX_NAME_CHARS = 64

# Reserved words the loader forbids anywhere in the skill name.
RESERVED_NAME_WORDS = ("claude", "anthropic")

# Claude Code truncates the combined description + when_to_use text at this
# many characters in the skill listing; trigger keywords past the cap are
# invisible to discovery. Heuristic -> warning (the loader still accepts it).
MAX_COMBINED_LISTING_CHARS = 1536

# Frontmatter keys recognized by Claude Code / the agentskills.io standard.
# The loader silently ignores anything else, so an unknown key is usually a
# typo (e.g. disable_model_invocation with underscores). Heuristic -> warning.
KNOWN_FIELDS = {
    "name", "description", "when_to_use", "argument-hint", "arguments",
    "disable-model-invocation", "user-invocable", "allowed-tools",
    "disallowed-tools", "model", "effort", "context", "agent", "hooks",
    "paths", "shell", "license", "metadata", "version",
}

# First/second-person openers that break the third-person rule. Heuristic
# only -> warning, because matching natural language exactly is impossible.
NON_THIRD_PERSON = (
    r"\bI can\b", r"\bI'll\b", r"\bI will\b", r"\bI help\b",
    r"\byou can\b", r"\byou'll\b", r"\byou will\b", r"\byou should\b",
    r"\bwe can\b", r"\bwe'll\b", r"\blet's\b",
)

# Phrases that signal a WHEN/trigger clause is present. Heuristic -> warning.
TRIGGER_HINTS = (
    "use when", "use this when", "when the user", "when working",
    "when you", "for when", "triggers", "use for",
)


def parse_frontmatter(text):
    """Return a dict of top-level frontmatter keys, or None if no block found.

    Handles the flat single-line `key: value` shape used by SKILL.md
    frontmatter, including quoted values and simple wrapped continuation
    lines. It deliberately does not implement full YAML — the frontmatter
    contract is intentionally flat, so a focused parser avoids a PyYAML
    dependency that may not be installed.
    """
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return None
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        return None

    fields = {}
    key = None
    for line in lines[1:end]:
        m = re.match(r"^([A-Za-z0-9_-]+):\s?(.*)$", line)
        if m:
            key = m.group(1)
            val = m.group(2).strip()
            # Strip a single layer of matching surrounding quotes.
            if len(val) >= 2 and val[0] == val[-1] and val[0] in "\"'":
                val = val[1:-1]
            fields[key] = val
        elif key is not None and line.strip():
            # Continuation of a wrapped multi-line scalar; join with a space.
            fields[key] = (fields[key] + " " + line.strip()).strip()
    return fields


def validate(path):
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print(f"ERROR: file not found: {path}")
        return 1
    except OSError as e:
        print(f"ERROR: cannot read {path}: {e}")
        return 1

    fm = parse_frontmatter(text)
    if fm is None:
        print("FAIL: no YAML frontmatter block found (file must start with '---').")
        return 1

    errors = []    # hard failures -> exit 1
    warnings = []  # heuristic flags -> reported, do not fail on their own

    name = fm.get("name")
    desc = fm.get("description")

    # --- name checks ---
    if not name:
        errors.append("name: missing or empty.")
    else:
        if "<" in name or ">" in name:
            errors.append("name: contains angle brackets (< or >) — forbidden in frontmatter.")
        if len(name) > MAX_NAME_CHARS:
            errors.append(f"name: {len(name)} chars exceeds max {MAX_NAME_CHARS}.")
        if not re.fullmatch(r"[a-z0-9-]+", name):
            errors.append("name: must be lowercase letters, numbers, and hyphens only.")
        lowered = name.lower()
        for word in RESERVED_NAME_WORDS:
            if word in lowered:
                errors.append(f"name: contains reserved word '{word}'.")

    # --- description checks ---
    if not desc:
        errors.append("description: missing or empty.")
    else:
        if "<" in desc or ">" in desc:
            errors.append("description: contains angle brackets (< or >) — forbidden in frontmatter.")
        if len(desc) > MAX_DESCRIPTION_CHARS:
            errors.append(f"description: {len(desc)} chars exceeds max {MAX_DESCRIPTION_CHARS}.")
        for pat in NON_THIRD_PERSON:
            if re.search(pat, desc, re.IGNORECASE):
                warnings.append(f"description: possible non-third-person phrasing matched /{pat}/.")
        if not any(hint in desc.lower() for hint in TRIGGER_HINTS):
            warnings.append("description: no obvious trigger/WHEN clause (e.g. 'Use when ...') — may undertrigger.")

    # --- combined listing length (description + when_to_use) ---
    combined = len(desc or "") + len(fm.get("when_to_use", ""))
    if combined > MAX_COMBINED_LISTING_CHARS:
        warnings.append(
            f"description + when_to_use: {combined} chars exceeds the "
            f"{MAX_COMBINED_LISTING_CHARS}-char listing cap — trailing trigger text will be truncated."
        )

    # --- unknown keys (typo catch) ---
    for key in fm:
        if key not in KNOWN_FIELDS:
            warnings.append(
                f"unknown frontmatter key '{key}' — Claude Code silently ignores unrecognized fields; possible typo."
            )

    # --- report ---
    for w in warnings:
        print(f"WARN: {w}")
    for e in errors:
        print(f"FAIL: {e}")

    if errors:
        print(f"\n{len(errors)} hard rule(s) failed.")
        return 1
    if warnings:
        print(f"\nPASS (with {len(warnings)} warning(s) to review).")
    else:
        print("\nPASS: all frontmatter rules satisfied.")
    return 0


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/validate_frontmatter.py path/to/SKILL.md")
        return 2
    return validate(sys.argv[1])


if __name__ == "__main__":
    sys.exit(main())
