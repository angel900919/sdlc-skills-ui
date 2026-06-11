#!/bin/sh
# clean-tree-guard.sh — PreToolUse hook for mtdd-implement (git-only, no Node).
#
# Refuses to start a branch on a DIRTY inherited tree when running autonomously.
# Wired in mtdd-implement frontmatter as a PreToolUse hook on `git checkout` /
# `git switch` (the `if:` matcher already guarantees the command is a
# checkout/switch, so this script does not re-parse it).
#
# Blocks ONLY inside a sub-agent (autonomous /mtdd-cycle run): the hook's
# stdin JSON carries an `agent_id` only there. Interactive /mtdd-implement is
# never gated — step 2's prose handles a dirty tree and the human can clean it.
#
# Mechanism: a PreToolUse hook that exits 2 denies the tool call and feeds stderr
# back to the agent. Any git/parse problem fails OPEN (exit 0) — a guard must
# never wedge a run.

input=$(cat 2>/dev/null)

# Sub-agent only: an `agent_id` string must be present. Absent or null (`"agent_id":null`)
# means an interactive run → allow.
printf '%s' "$input" | grep -q '"agent_id"[[:space:]]*:[[:space:]]*"[^"]' || exit 0

status=$(git status --porcelain 2>/dev/null) || exit 0   # not a git repo → fail open
[ -z "$status" ] && exit 0                                # clean tree → allow

count=$(printf '%s\n' "$status" | grep -c .)
sample=$(printf '%s\n' "$status" | head -8)

{
    echo "BLOCKED: working tree has $count uncommitted change(s) and you are about to switch branches."
    echo "Autonomous implement must START from a clean tree: 'git checkout -b' carries these changes"
    echo "onto the feature branch, where a broad 'git add' sweeps them into your commit — this is how"
    echo "an unrelated mass deletion ends up in a slice. Do NOT 'git stash' / 'reset' / 'checkout --'"
    echo "them (that destroys the user's work). STOP and report BLOCKED to the orchestrator — the"
    echo "inherited changes must be committed or cleaned by a human first."
    echo "Pending:"
    printf '%s\n' "$sample"
} >&2
exit 2
