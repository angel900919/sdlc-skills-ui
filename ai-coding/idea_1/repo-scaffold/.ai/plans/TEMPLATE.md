# NNN — [Feature / change title]

- **Status:** draft | approved | in progress | done
- **Owner:** [name/agent]  ·  **Branch:** `[branch]`  ·  **Links:** `project-state.md`, [issue]

## Goal (done-state, 1–2 sentences)
[What "done" looks like from the outside.]

## Current state → desired state
- Now: [how it works today]
- After: [how it should work]

## Design decisions
- [Decision + one-line why. Link `.ai/decisions/NNNN` if it warrants a record.]

## Acceptance criteria (EARS-style, each testable)
- WHEN [event/condition] THE SYSTEM SHALL [behavior].
- IF [error condition] THEN THE SYSTEM SHALL [response].

## Implementation — vertical slices (each ends with a test)
1. [Slice: thin end-to-end path] — TEST: [what proves it]
2. [Slice] — TEST: [...]

## Explicitly out of scope
- [Thing we are deliberately NOT doing now.]

## Verification checklist
- [ ] All acceptance criteria have a passing test
- [ ] `scripts/check` green
- [ ] No protected paths touched without approval
- [ ] `project-state.md` updated
