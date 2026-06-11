#!/bin/sh
# stop-guard.sh — Stop/SubagentStop hook for mtdd-implement (git-only, no Node).
#
# When /mtdd-cycle runs implement as an autonomous sub-agent, nothing forces
# the TDD-order self-check, so a wrong commit order would only surface one
# expensive review sub-agent later. This hook runs the same gate as review
# (tdd-check.sh) the moment the autonomous run finishes, and blocks the hand-off
# on a genuinely mis-ordered branch.
#
# Narrow, to avoid false positives:
#   - Only inside a sub-agent (agent_id present in stdin JSON). Interactive
#     /mtdd-implement is never gated — Stop also fires on the briefing pause and
#     mid-cycle, where a lone red: (no green: yet) is a valid state.
#   - Only on a feature/* branch.
#   - Only on a real mis-ordering (tdd-check exit 1). "No cycle commits" (exit 3,
#     a legit skip-tests/chore branch) and any setup error fail OPEN.
#
# Mechanism: a Stop hook that exits 2 blocks the stop and feeds stderr back to the
# agent.
#
# Target resolution (single source of truth): mtdd-implement STAMPS the resolved
# target on the branch at creation — `git config branch.<branch>.mtdd-target`.
# This hook reads that stamp, so it checks against the SAME branch implement (or
# the user, who confirmed it) chose — no hardcoded `develop`. Fallbacks: the
# TARGET_BRANCH env override, then `develop`. The stamp is why this gate no longer
# silently no-ops on a repo that integrates on `main` or any other branch.

input=$(cat 2>/dev/null)

# Sub-agent only.
printf '%s' "$input" | grep -q '"agent_id"[[:space:]]*:[[:space:]]*"[^"]' || exit 0

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || exit 0
case "$branch" in
    feature/*) ;;
    *) exit 0 ;;
esac

# Prefer the branch's stamped target (set by mtdd-implement), then env, then develop.
target=$(git config "branch.$branch.mtdd-target" 2>/dev/null)
[ -z "$target" ] && target="${TARGET_BRANCH:-develop}"

dir=$(CDPATH= cd "$(dirname "$0")" 2>/dev/null && pwd) || exit 0
reason=$(sh "$dir/tdd-check.sh" "$target" HEAD 2>&1)
code=$?

# Only a genuine mis-ordering (exit 1) blocks. PASS (0), no-cycle (3), setup (2) → allow.
[ "$code" -eq 1 ] || exit 0

{
    echo "TDD-order gate blocked the autonomous hand-off:"
    printf '%s\n' "$reason" | sed 's/^FAIL: //'
    echo "Recover with 'git reset --soft $target' then recommit the failing test as red:"
    echo "before the green: implementation (see /mtdd-implement step 5). Do not hand off"
    echo "to review until the gate passes."
} >&2
exit 2
