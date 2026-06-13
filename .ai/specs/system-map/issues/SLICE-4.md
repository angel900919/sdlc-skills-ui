---
slug: sdlc-command-center
feature: system-map
slice: 4
stage: issue
title: Live auto-refresh + adoption metric
status: published
category: enhancement
type: afk
priority: P2
tier: mvp
tests: required
language: typescript
depends_on: [1]
satisfies_f_ids: []
satisfies_user_stories: [US-4]
satisfies_nfrs: [NFR-2, NFR-4]
satisfies_unwanted: []
files:
  - { path: apps/server/src/state/watcher.ts, op: modify }
  - { path: packages/shared/src/types.ts, op: modify }
  - { path: apps/server/src/ws.ts, op: modify }
  - { path: apps/server/src/routes/api.ts, op: modify }
  - { path: apps/server/src/routes/architecture.test.ts, op: modify }
  - { path: apps/web/src/api/hooks.ts, op: modify }
  - { path: apps/web/src/App.tsx, op: modify }
  - { path: apps/web/src/pages/ArchitecturePage.tsx, op: modify }
hitl_reason: ""
skip_tests_reason: ""
backend_refs:
  beads: "scc-4ra"
  jira: null
  md: null
source_plan: .ai/specs/system-map/plan.md
source_prd: .ai/specs/system-map/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
Make the tab live and start measuring its adoption. When the architecture model regenerates
(after `/architect` or a slice merge), the watcher reacts to the debounced model-file change,
recomputes, and broadcasts an `architecture-changed` event; the web client listens and refetches,
so the tab refreshes itself within ~2 s with no manual reload. Separately, opening the tab records
a `nav` adoption event via a fire-and-forget `POST /api/projects/:id/events` — the numerator for
the self-adoption metric (denominator = existing `hook_events` PostToolUse Edit/Write). The watch
is debounced and the nav POST never blocks, honoring observation non-interference.

## Acceptance criteria
- [ ] `architecture.test.ts`: `POST /api/projects/:id/events` writes a `nav` `audit_events` row (`source:'user'`, `detail.path:'/architecture'`), and returns 400 on a bad event kind
- [ ] The watcher emits `architecture-changed` on an `.ai/architecture/` change (integration test)
- [ ] NFR-2: touching the components model → re-rendered graph within ≤ 2 s, timestamped (800 ms watch debounce + refetch)
- [ ] NFR-4: the `nav` POST is fire-and-forget and the watch is debounced — neither blocks an observed session
- [ ] Smoke: merge a slice (or edit the components model) → the tab updates with no manual refresh
- [ ] typecheck passes
- [ ] tests pass

## Traceability
- PRD: US-4 — the graph refreshes when the architecture model regenerates (after `/architect` or a slice merge)
- PRD: NFR-2 (freshness: tab reflects a model-file change within ≤ 2 s; file-change → `architecture-changed` → render)
- PRD: NFR-4 (non-interference: `nav` POST fire-and-forget, watch debounced — never blocks)
- Plan: Slice 4 — Live auto-refresh + adoption metric
- Architecture: `DeriveProjectState` (watch + recompute) · `ServeApiAndWs` (`architecture-changed`, nav ingest) · `ShareDomainModel` (`ServerEvent` += `architecture-changed`) — `.ai/architecture/02-components.md`

## Blocked by
- Slice 1
