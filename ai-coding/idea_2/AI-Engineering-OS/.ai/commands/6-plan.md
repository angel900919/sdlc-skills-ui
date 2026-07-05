---
description: Write the file-by-file tactical plan for one slice — the level of detail where the human reviews the CODE, not the plan. Writes .ai/plans/<slug>/plan.md. Then implement one slice per turn.
argument-hint: "[slug] [phase]"
arguments: slug phase
---

# Plan — the file-by-file tactical plan for one slice

Read `.ai/plans/$slug/outline.md`. Plan the phase named **`$phase`** (default: the first unblocked phase in the DAG).

For that slice only:
- List each file to **add or change**, and for each: the exact function/seam, and the existing **pattern it follows** (`file:line`). **Name the seam; forbid premature abstraction** — do not extract shared components "because it looks repetitive" unless the slice needs it.
- Restate the phase's **`TEST:`** as the acceptance gate. No step is done until `verify.sh` is green **and** that test passes.
- Keep every implementation step a **vertical, ≤~150-line diff**. No `TODO` / `FIXME` / `console.log` in committed code.
- Do not touch protected paths (`auth`, `payments`, migrations, `.env*`) unless the phase explicitly says so.

Write `.ai/plans/$slug/plan.md`. Then: implement **one slice per turn**, run `verify.sh` after each step, and only when **green** update `.ai/project-state.md`. Before merge, review in a fresh context with `/7-review $slug`.

*Implements the CRISPY `/5-plan` stage. See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md).*
