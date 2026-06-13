---
slug: sdlc-command-center
feature: observability-data-pruning
slice: 1
stage: issue
title: Show storage stats end-to-end (tracer bullet)
status: published
category: enhancement
type: afk
priority: P0
tier: mvp
tests: required
language: typescript
depends_on: []
satisfies_f_ids: []
satisfies_user_stories: [story-1]
satisfies_nfrs: [N2]
satisfies_unwanted: []
files:
  - { path: apps/server/src/state/storageStats.ts, op: new }
  - { path: apps/server/src/state/storageStats.test.ts, op: new }
  - { path: apps/server/src/routes/api.ts, op: modify }
  - { path: apps/web/src/components/StoragePanel.tsx, op: new }
  - { path: apps/web/src/pages/DashboardPage.tsx, op: modify }
hitl_reason: ""
skip_tests_reason: ""
backend_refs:
  beads: "scc-m7w"
  jira: null
  md: null
source_plan: .ai/specs/observability-data-pruning/plan.md
source_prd: .ai/specs/observability-data-pruning/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
The Storage panel renders real per-kind record counts (Audit events, Hook events,
Transcript copies, Usage samples), each kind's oldest-record date, and the database file
size, served by a live stats endpoint — the thinnest end-to-end path through every layer
the feature crosses. The cutoff picker renders but stays inert (Slice 2 wires it).
Loading, empty, and error states per ux.md S1.

## Acceptance criteria
- [ ] Integration test (tmp-dir SQLite per test-strategy): seeded rows of all four kinds → exact counts + oldestAt; empty DB → empty shape
- [ ] Stats respond <500ms on the seeded store (N2 measured in test)
- [ ] Panel renders real data in the dev app (manual smoke)
- [ ] typecheck passes
- [ ] tests pass

## Traceability
- PRD: story 1 ("see how much space each kind of record takes")
- PRD: N2 (stats <500ms on a 1GB database)
- Plan: Slice 1 — Show storage stats end-to-end (TRACER BULLET)
- Architecture: PersistAndBroadcast · ServeApiAndWs · RenderFlightDeck (.ai/architecture/02-components.md)

## Blocked by
- None — can start immediately
