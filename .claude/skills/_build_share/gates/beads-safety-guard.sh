#!/bin/sh
# beads-safety-guard.sh — PreToolUse warning hook (git-only, no Node, NON-blocking).
#
# Warns (never blocks) when beads state is in the EXPOSED config that lets a
# closed ticket silently revert after a `git checkout`: the bug needs git-TRACKED
# beads state (the JSONL export and/or the embedded Dolt DB), so a branch switch
# restores a stale copy and the re-import hook rebuilds the DB from it. Keeping
# that state gitignored is the lever the operator controls.
#
# Wired as a `once: true` PreToolUse hook on `bd` commands, so it surfaces at most
# once per session. Always exits 0 (non-blocking — this is a one-time setup
# decision a skill cannot fix at runtime). Fails OPEN on any git error.
# The warning goes to stderr (advisory hook feedback); see _build_share/BEADS-SETUP.md.

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

tracked=""
for p in ".beads/issues.jsonl" ".beads/embeddeddolt"; do
    [ -e "$p" ] || continue
    git check-ignore -q "$p" 2>/dev/null && continue   # gitignored → safe
    tracked="$tracked $p"
done
[ -z "$tracked" ] && exit 0

{
    echo "⚠ beads is in the exposed config — beads state is git-tracked ($tracked )."
    echo "A closed bead can silently revert to open after a routine 'git checkout': the switch"
    echo "restores a stale copy and the re-import hook rebuilds the DB from it, wiping any close"
    echo "that wasn't committed. Fix (keep beads state gitignored — the lever you control):"
    echo "'git rm --cached -r .beads' then add '.beads/' to .gitignore and commit."
    echo "See _build_share/BEADS-SETUP.md."
} >&2
exit 0
