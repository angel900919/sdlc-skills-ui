---
slug: sdlc-command-center
feature: oldest-record-age
slice: 1
stage: issue
title: Show oldest record as a relative age (tracer bullet)
status: published
category: enhancement
type: afk
priority: P1
tier: mvp
tests: required
language: typescript
depends_on: []
satisfies_f_ids: []
satisfies_user_stories: [story-1, story-2, story-3]
satisfies_nfrs: [N1, N2, N3]
satisfies_unwanted: []
files:
  - { path: packages/shared/src/relativeAge.ts, op: new }
  - { path: packages/shared/src/relativeAge.test.ts, op: new }
  - { path: packages/shared/src/index.ts, op: modify }
  - { path: apps/web/src/components/StoragePanel.tsx, op: modify }
hitl_reason: ""
skip_tests_reason: ""
backend_refs:
  beads: "scc-sa4"
  jira: null
  md: null
source_plan: .ai/specs/oldest-record-age/plan.md
source_prd: .ai/specs/oldest-record-age/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
A pure `formatRelativeAge(iso, nowMs)` formatter in `@sdlc/shared` that turns an ISO
timestamp into a whole-day relative age — `today` / `1 day ago` / `N days ago` — clamped
at zero so clock skew never yields a negative, with `NaN`/unparseable input falling back
to `today`. Wire it into the Storage panel's Oldest column: each non-empty kind shows the
age as the cell's primary text, with the exact date kept reachable via the cell `title`.
The thinnest end-to-end path — shared formatter exported from index, consumed by the panel.

## Acceptance criteria
- [ ] Unit (`relativeAge.test.ts`): `today` at 0-day and sub-day diffs · `1 day ago` (singular boundary) · `N days ago` (plural) · future `oldestAt` clamps to `today` (N3) · malformed/`NaN` input falls back to `today`
- [ ] N1 (no new I/O) by inspection: `formatRelativeAge` signature is `(iso, nowMs)` — no fetch/db import; StoragePanel adds no new query
- [ ] Oldest cell shows the age string with the exact date in the cell hover `title` (manual smoke)
- [ ] typecheck passes
- [ ] tests pass (full suite green — regression)

## Traceability
- PRD: story 1 (age in whole days, no mental math), story 2 (today/1-day/N-days phrasing), story 3 (exact date stays reachable)
- PRD: N1 (no new I/O), N2 (whole-day rounding), N3 (never negative)
- Plan: Slice 1 — Show oldest record as a relative age (TRACER BULLET)
- Architecture: ShareDomainModel · RenderFlightDeck (.ai/architecture/02-components.md)

## Blocked by
- None — can start immediately
