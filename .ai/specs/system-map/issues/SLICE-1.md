---
slug: sdlc-command-center
feature: system-map
slice: 1
stage: issue
title: Render the declared component graph, status-colored (tracer bullet)
status: published
category: enhancement
type: afk
priority: P1
tier: mvp
tests: required
language: typescript
depends_on: []
satisfies_f_ids: []
satisfies_user_stories: [US-1, US-2]
satisfies_nfrs: [NFR-1, NFR-3, NFR-4]
satisfies_unwanted: []
files:
  - { path: packages/shared/src/architectureModel.ts, op: new }
  - { path: packages/shared/src/architectureModel.test.ts, op: new }
  - { path: apps/server/src/state/parseComponentsModel.ts, op: new }
  - { path: apps/server/src/state/parseComponentsModel.test.ts, op: new }
  - { path: apps/server/src/state/deriveComponentStatus.ts, op: new }
  - { path: apps/server/src/routes/api.ts, op: modify }
  - { path: apps/server/src/routes/architecture.test.ts, op: new }
  - { path: apps/web/src/api/hooks.ts, op: modify }
  - { path: apps/web/src/pages/ArchitecturePage.tsx, op: new }
  - { path: apps/web/src/App.tsx, op: modify }
  - { path: apps/web/src/components/Shell.tsx, op: modify }
hitl_reason: ""
skip_tests_reason: ""
backend_refs:
  beads: "scc-57s"
  jira: null
  md: null
source_plan: .ai/specs/system-map/plan.md
source_prd: .ai/specs/system-map/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
The thinnest real end-to-end path for the Architecture tab. Open a new **Architecture** tab and
see the project's components and the edges between them as a status-colored graph, sourced live
from the declared architecture model — every layer wired for real: shared types → markdown parse
of the components model → a minimal as-built status derivation → a project-scoped serve → a
fetch-only client hook → the graph render → the route and nav entry. This is the tracer; the
inspector, SDLC view, and auto-refresh flesh out inside it. Status is the coarse as-built default
here (real ProjectState status arrives in Slice 2). The model excludes the app's own non-source
dirs so the twin never describes its own output.

## Acceptance criteria
- [ ] `parseComponentsModel.test.ts` round-trips the real components model → 7 components / 10 edges; parse→serialize→diff = 0 dropped or invented (NFR-3)
- [ ] `architecture.test.ts` → 200 with the model for a known project, 404 for an unknown project
- [ ] `architectureModel.test.ts` covers the `rollupStatus` helper as a unit
- [ ] NFR-1: `GET /api/projects/:id/architecture` p95 ≤ 300 ms (server OTel span, local) — parse cached after first load
- [ ] NFR-4: parse is off the request path (lazy-cached, projectState TTL idiom) — the route test confirms it does not re-parse per call
- [ ] Smoke: the tab renders 7 nodes / 10 edges status-colored (no E2E spec — system-map maps to none in test-strategy; manual smoke)
- [ ] typecheck passes
- [ ] tests pass

## Traceability
- PRD: US-1 — open the Architecture tab and see components + how they connect
- PRD: US-2 — each component colored by status (done / building / planned / blocked)
- PRD: NFR-1 (latency: `GET …/architecture` p95 ≤ 300 ms for a model ≤ 50 components, server OTel)
- PRD: NFR-3 (accuracy: rendered model matches `.ai/architecture/` exactly — 0 dropped/invented)
- PRD: NFR-4 (non-interference: building/serving the model never blocks an observed session)
- Plan: Slice 1 — Render the declared component graph, status-colored (tracer bullet)
- Architecture: `ShareDomainModel` (new types) · `DeriveProjectState` (parse + derive) · `ServeApiAndWs` (route) · `RenderFlightDeck` (tab) — `.ai/architecture/02-components.md`

## Blocked by
- None — can start immediately
