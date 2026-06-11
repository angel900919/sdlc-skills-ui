#!/bin/sh
# tdd-check.sh — git-only TDD commit-order gate for the standalone MTDD bundle.
# No Node/tsx required: needs only `git`, `sh`, and `awk` (present on macOS/Linux).
# This file is the source of truth for cycle order (replaces the old tddCheck.ts + cli.ts).
#
# usage: sh tdd-check.sh <targetRef> [<branchRef>] [--skip-tests]
#   branchRef defaults to HEAD.
#
# exit codes:
#   0  PASS  — cycle order OK (or --skip-tests)
#   1  FAIL  — discipline violation: impl before first test, or red: with no green: (reason on stderr)
#   2  SETUP — usage error or git could not be read (gate could not run; NOT a discipline verdict)
#   3  FAIL  — no recognised cycle commits on the branch (reason on stderr)
#
# Rules (only when not --skip-tests), mirroring the original tddCheck.ts:
#   1. At least one commit must carry a cycle prefix (red:/green:/refactor:).
#   2. The FIRST cycle commit must be `red:` (a failing test landed first).
#   3. At least one `green:` must exist when any `red:` exists.
# The legacy `RALPH:` brand prefix is accepted as optional. Tag match is
# case-insensitive; the separator may be `:` or `-`.

skip=0
pos=""
for a in "$@"; do
    case "$a" in
        --skip-tests) skip=1 ;;
        --*) ;;  # ignore unknown flags
        *) pos="$pos $a" ;;
    esac
done
# shellcheck disable=SC2086
set -- $pos
target="$1"
branch="${2:-HEAD}"

if [ -z "$target" ]; then
    echo "usage: sh tdd-check.sh <targetRef> [<branchRef>] [--skip-tests]" >&2
    exit 2
fi

if [ "$skip" -eq 1 ]; then
    echo "PASS: TDD commit order OK (skip-tests)"
    exit 0
fi

log=$(git log --reverse --oneline "$target..$branch" 2>/dev/null) || {
    echo "SETUP: could not read 'git log $target..$branch' (bad ref or not a git repo)" >&2
    exit 2
}

verdict=$(printf '%s\n' "$log" | awk '
{
    line = $0
    sub(/^[^ ]+ /, "", line)        # drop the short SHA, keep the subject
    s = tolower(line)
    sub(/^ralph:[ \t]*/, "", s)     # strip optional legacy RALPH: prefix
    kind = "other"
    if      (s ~ /^red[ \t]*[:-]/)      kind = "red"
    else if (s ~ /^green[ \t]*[:-]/)    kind = "green"
    else if (s ~ /^refactor[ \t]*[:-]/) kind = "refactor"
    if (kind == "red" || kind == "green" || kind == "refactor") {
        cycle++
        if (cycle == 1) first = kind
        if (kind == "red")   red++
        if (kind == "green") green++
    }
}
END {
    if (cycle == 0)             { print "NOCYCLE"; exit }
    if (first != "red")         { print "FIRST " first; exit }
    if (red > 0 && green == 0)  { print "NOGREEN " red; exit }
    print "PASS"
}')

# shellcheck disable=SC2086
set -- $verdict
case "$1" in
    PASS)
        echo "PASS: TDD commit order OK"
        exit 0 ;;
    NOCYCLE)
        echo "FAIL: No TDD cycle commits found on the branch. The implement prompt requires red:/green:/(optional) refactor: prefixes so the cycle order is visible in 'git log'. Every commit on this branch lacks a recognised cycle prefix — the agent either ignored the convention or wrote everything in one batch." >&2
        exit 3 ;;
    FIRST)
        echo "FAIL: First TDD cycle commit must be 'red:' (a failing test landed first), but the first cycle commit is '$2:'. Impl or refactor ran before any test — implementation was written first and labelled retroactively, which defeats TDD." >&2
        exit 1 ;;
    NOGREEN)
        echo "FAIL: Found $2 'red:' commit(s) but no 'green:' commit. Every red test should be followed by a 'green:' commit that makes it pass. Either the implementation is missing or the prefix on the impl commit is wrong." >&2
        exit 1 ;;
    *)
        echo "SETUP: gate could not classify the commit log" >&2
        exit 2 ;;
esac
