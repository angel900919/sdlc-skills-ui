# mtdd-implement — reference (background & contingencies)

Deep background and edge-case recovery for `mtdd-implement`. The main procedure
lives in `SKILL.md`; this file holds the "why" and the contingencies you only
need when something goes sideways. Read it when the SKILL.md body points here.

## Recovery from a previous failed cycle

If the user is re-invoking this skill after a failed review or verify phase,
they'll typically paste the rejection context or test output. Read it first.
Address each concrete concern; don't restart from scratch unless the previous
commits were structurally wrong.

If the previous attempt's TDD commit order was wrong (e.g., `green:` before any
`red:`), the cleanest recovery is:

```
git reset --soft <target-branch-sha>
```

This drops the bad-prefix commits but keeps your file changes staged. Then
re-commit in proper order: a `red:` commit first (with the failing test), then
`green:` (with the impl).

## Releasing a stuck bead claim (beads mode)

On crash / restart with a stuck claim, the user clears it with
`bd update <bead-id> --status open` before re-invoking this skill. Current `bd`
has no `--unclaim` flag; reverting to `open` releases the assignee implicitly.

## Why the autonomous Stop hook exists

When `/mtdd-cycle` runs implement as a sub-agent, a `SubagentStop` hook
(`_build_share/gates/stop-guard.sh`, wired in this skill's frontmatter) runs the
TDD-order gate as the run finishes and **blocks the hand-off** on a mis-ordered
branch (impl committed before the first test, or a `red:` with no `green:`) — so
a bad cycle never reaches the review sub-agent. Interactive runs are not gated:
the pause and mid-cycle stops make the self-check yours to run.

## Branch-naming rationale

The beads-mode double-dash (`feature/<bead-id>--<slug>`) separates the bead ID
from the title slug, matching `ralph-loop-afk`'s convention so existing tooling
recognizes the branch.
