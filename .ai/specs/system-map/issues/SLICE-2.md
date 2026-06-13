---
slug: sdlc-command-center
feature: system-map
slice: 2
stage: issue
title: Component inspector with the work join
status: published
category: enhancement
type: afk
priority: P2
tier: mvp
tests: required
language: typescript
depends_on: [1]
satisfies_f_ids: []
satisfies_user_stories: [US-3]
satisfies_nfrs: [NFR-1, NFR-4]
satisfies_unwanted: []
files:
  - { path: apps/server/src/state/deriveComponentStatus.ts, op: modify }
  - { path: apps/server/src/state/deriveComponentStatus.test.ts, op: new }
  - { path: apps/web/src/components/ComponentInspector.tsx, op: new }
  - { path: apps/web/src/pages/ArchitecturePage.tsx, op: modify }
hitl_reason: ""
skip_tests_reason: ""
backend_refs:
  beads: "scc-byg"
  jira: null
  md: null
source_plan: .ai/specs/system-map/plan.md
source_prd: .ai/specs/system-map/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
Click a component in the graph and a side panel opens showing its role, inputs, outputs,
dependencies, files, responsible owner, and the linked feature + slices + issue refs it maps to —
the jump from "this box" to the actual work. The component's status now reflects real
`ProjectState` (from the feature/slice it maps to), not the coarse as-built default of Slice 1.
The work join walks component → feature → slice → issue refs; a component with no resolvable
feature renders an honest "unlinked" rather than a synthesized link, and its status falls back to
`done` as-built (never fabricated progress).

## Acceptance criteria
- [ ] `deriveComponentStatus.test.ts` over a `makeState` fixture: the join resolves a feature/slice/issue for the majority of the 7 components (R-2)
- [ ] Status maps real `FeatureState`/`SliceState`: any-blocked → blocked, any-in-progress → in-progress, all-merged → done, no-feature → done as-built
- [ ] NFR-1 (latency): the enriched route stays non-blocking — the join is derived off the request path (see NFR-4); no standalone p95/OTel-span gate at tracer scope (route OTel instrumentation is out of MVP boundary)
- [ ] NFR-4: the join is derived off the request path (no per-call recompute)
- [ ] Smoke: clicking each node opens the inspector with non-empty role/files/deps; owner + linked refs render, or show an honest "unlinked"
- [ ] typecheck passes
- [ ] tests pass

## Traceability
- PRD: US-3 — click a component → inputs, outputs, dependencies, files, owner, linked feature + slices + issue refs
- PRD: NFR-1 (latency: enriched response still p95 ≤ 300 ms, server OTel)
- PRD: NFR-4 (non-interference: join derived off the request path)
- Plan: Slice 2 — Component inspector with the work join
- Architecture: `DeriveProjectState` (component→feature→slice→issue join) · `RenderFlightDeck` (inspector) — `.ai/architecture/02-components.md`

## Blocked by
- Slice 1
