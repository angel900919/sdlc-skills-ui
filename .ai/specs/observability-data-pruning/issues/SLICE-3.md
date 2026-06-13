---
slug: sdlc-command-center
feature: observability-data-pruning
slice: 3
stage: issue
title: Confirm dialog and result readout (the no-accidents UX)
status: open
category: enhancement
type: afk
priority: P0
tier: mvp
tests: required
language: typescript
depends_on: [2]
satisfies_f_ids: []
satisfies_user_stories: [story-3, story-4]
satisfies_nfrs: [N4]
satisfies_unwanted: []
files:
  - { path: apps/web/src/components/PruneConfirmDialog.tsx, op: new }
  - { path: apps/web/src/components/StoragePanel.tsx, op: modify }
  - { path: apps/web/src/api/hooks.ts, op: modify }
hitl_reason: ""
skip_tests_reason: ""
backend_refs:
  beads: null
  jira: null
  md: null
source_plan: .ai/specs/observability-data-pruning/plan.md
source_prd: .ai/specs/observability-data-pruning/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
The full ux.md flow in the browser: "Preview cleanup…" opens the focus-trapped confirm
dialog (S2 — live per-kind counts, the two promises verbatim, all four states), a
confirmed prune shows the S3 result readout (rows deleted, bytes reclaimed, before→after
file size), stats refresh, and a failure shows the database-unchanged copy. Escape
cancels; confirm is never default-focused.

## Acceptance criteria
- [ ] Server tests stay green
- [ ] ux.md S1–S3 states walk clean in the dev app: happy F1, nothing-to-delete F2, abandon F4 (manual)
- [ ] Failure F3 shows the database-unchanged copy (verified by killing the server mid-flow, manual)
- [ ] Dialog is focus-trapped, Escape cancels, confirm not default-focused (a11y)
- [ ] typecheck passes
- [ ] tests pass

## Traceability
- PRD: stories 3, 4 · N4 (user-facing)
- Plan: Slice 3 — Confirm dialog + result readout (the no-accidents UX)
- Architecture: RenderFlightDeck · ux.md S1–S3

## Blocked by
- Slice 2
