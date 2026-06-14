---
slug: sdlc-command-center
feature: system-map
stage: plan
status: complete
tier: mvp
verdict: READY-FOR-ISSUES
verdict_overridden: false
slice_count: 4
tracer_slice: 1
source_design: .ai/specs/system-map/design.md
source_prd: .ai/specs/system-map/prd.md
source_anchor: .ai/anchor.md
consumed_by: [build, to-issues, qa]
created: 2026-06-13
---

# Plan — system-map

<!-- mvp (cap 185); slices 3–5; Slice 1 = tracer; numbering stable across update-mode runs.
     Slices 2/3/4 each depend only on Slice 1 → parallelizable (three PRs off the tracer). -->

## Slice 1 — Render the declared component graph, status-colored (TRACER BULLET)
`Status: pending`
- **Depends on:** nothing.
- **Goal:** Open a new **Architecture** tab and see the project's 7 components + 10 edges as a status-colored `@xyflow/react` graph, sourced live from `02-components.md` — every layer wired for real (types → parse → derive → serve → fetch → render → nav).
- **Files:**
  - `packages/shared/src/architectureModel.ts` — new (types `ArchitectureModel`/`ComponentNode`/`ArchEdge`/`ArchNodeStatus` + pure `rollupStatus` helper)
  - `packages/shared/src/architectureModel.test.ts` — new
  - `apps/server/src/state/parseComponentsModel.ts` — new (markdown-table parse, idiom from `project-state.py:203-233`)
  - `apps/server/src/state/parseComponentsModel.test.ts` — new
  - `apps/server/src/state/deriveComponentStatus.ts` — new (minimal: coarse as-built status)
  - `apps/server/src/routes/api.ts` — modify (`GET /api/projects/:id/architecture`)
  - `apps/server/src/routes/architecture.test.ts` — new
  - `apps/web/src/api/hooks.ts` — modify (`useArchitecture`, fetch-only)
  - `apps/web/src/pages/ArchitecturePage.tsx` — new (graph, static node positions like PipelinePage)
  - `apps/web/src/App.tsx` · `apps/web/src/components/Shell.tsx` — modify (route + nav entry)
- **Satisfies:** `US-1` (see components + connections) · `US-2` (colored by status) · `NFR-3` (accuracy) · `NFR-4` (non-interference).
- **New dependencies:** none (all in anchor allowlist; `@xyflow/react` already shipped).
- **Acceptance:**
  - Tests pass: `parseComponentsModel.test.ts` round-trips the real `02-components.md` → 7 components / 10 edges, parse→serialize→diff = 0 dropped/invented (**NFR-3**); `architecture.test.ts` → 200 model + 404 unknown project; `architectureModel.test.ts` rollup unit.
  - **NFR-1:** not owned here — the p95 gate + `architecture.serve` instrumentation land in Slice 4; this slice must not regress serve latency (route returns from the per-TTL cache on warm hits; parse never blocks the observed session — NFR-4).
  - **NFR-4:** parse is off the request path (lazy-cached, projectState TTL idiom) — confirmed by the route test not re-parsing per call.
  - Smoke: tab renders 7 nodes / 10 edges status-colored (no E2E spec — system-map maps to none in `test-strategy.md`; manual smoke per the named-but-unmaterialized suite).

## Slice 2 — Component inspector with the work join
`Status: pending`
- **Depends on:** Slice 1.
- **Goal:** Click a component → a side panel shows role, inputs, outputs, dependencies, files, owner, and the linked feature + slices + issue refs; status now reflects real `ProjectState`, not the as-built default.
- **Files:**
  - `apps/server/src/state/deriveComponentStatus.ts` — modify (full component→feature→slice→issue join + real status)
  - `apps/server/src/state/deriveComponentStatus.test.ts` — new
  - `apps/web/src/components/ComponentInspector.tsx` — new (StageDetail panel pattern)
  - `apps/web/src/pages/ArchitecturePage.tsx` — modify (node click → inspector)
- **Satisfies:** `US-3` (click → inputs/outputs/deps/files/owner/linked refs) · `NFR-4` (join derived off the request path).
- **New dependencies:** none.
- **Acceptance:**
  - Tests pass: `deriveComponentStatus.test.ts` over a `makeState` fixture — the join resolves a feature/slice/issue for the majority of the 7 components (**R-2**); status maps real `FeatureState`/`SliceState` (any-blocked→blocked, any-in-progress→in-progress, all-merged→done, no-feature→done as-built).
  - **NFR-1:** not owned here — measurement lands in Slice 4; this slice must not regress it (the join is derived off the request path — NFR-4).
  - Smoke: clicking each node opens the inspector with non-empty role/files/deps; owner + linked refs render or show an honest "unlinked".

## Slice 3 — SDLC progress view
`Status: pending`
- **Depends on:** Slice 1.
- **Goal:** Toggle to an SDLC view inside the tab showing chain stages grouped by phase, colored by status, with the current "next" stage marked — over the existing `stageModel` + project state.
- **Files:**
  - `apps/web/src/components/SdlcProgress.tsx` — new (renders over `stageModel` + `useProjectState`)
  - `apps/web/src/pages/ArchitecturePage.tsx` — modify (System ⇄ SDLC view switch)
- **Satisfies:** `US-5` (chain stages by phase, status-colored, "next" marked) · `NFR-4` (pure render over existing state — adds no observation load).
- **New dependencies:** none.
- **Acceptance:**
  - Tests pass: existing `stageModel` unit coverage (`foundationStageStatus`/`featureStageStatus`) is reused — no new derivation logic; the view is render-only.
  - Smoke: SDLC view renders all chain stages grouped by phase, status-colored, exactly one "next" marked, matching the Pipeline view's stage statuses.

## Slice 4 — Live auto-refresh + adoption metric
`Status: pending`
- **Depends on:** Slice 1.
- **Goal:** When the model regenerates (after `/architect` or a slice merge) the tab refreshes itself within ~2 s; opening the tab records a `nav` adoption event.
- **Files:**
  - `apps/server/src/state/watcher.ts` — modify (on a debounced `.ai/architecture/` change: recompute + `bus.broadcast(architecture-changed)`)
  - `packages/shared/src/types.ts` — modify (`ServerEvent` += `architecture-changed`)
  - `apps/server/src/ws.ts` — modify (`topicsFor(architecture-changed)`)
  - `apps/server/src/routes/api.ts` — modify (`POST /api/projects/:id/events` — nav ingest)
  - `apps/server/src/routes/architecture.test.ts` — modify (add `POST …/events` case)
  - `apps/web/src/api/hooks.ts` · `apps/web/src/App.tsx` — modify (WsBridge listener → `invalidateQueries`)
  - `apps/web/src/pages/ArchitecturePage.tsx` — modify (emit `nav` on mount)
- **Satisfies:** `US-4` (refresh on model regen) · `NFR-1` (serve latency — instruments the `architecture.serve` log + span) · `NFR-2` (freshness ≤ 2 s) · `NFR-4` (nav POST fire-and-forget, watch debounced — never blocks).
- **New dependencies:** none.
- **Acceptance:**
  - Tests pass: `architecture.test.ts` → `POST …/events` writes a `nav` `audit_events` row (`source:'user'`, `detail.path:'/architecture'`) + 400 on a bad kind; watcher emits `architecture-changed` on an `.ai/architecture/` change (integration).
  - **NFR-1:** `GET …/architecture` emits an `architecture.serve {project_id, cache_hit, duration_ms, trace_id}` log + reuses the existing OTel tracer for an `architecture.serve` span (no new infra); p95 ≤ 300 ms for a model ≤ 50 components.
  - **NFR-2:** touch `02-components.md` → re-rendered graph ≤ 2 s, timestamped (800 ms debounce + refetch).
  - Smoke: merge a slice (or edit `02-components.md`) → tab updates with no manual refresh; the metric denominator is the existing `hook_events` PostToolUse Edit/Write.

## Notes
- placement: `DeriveProjectState` (+ `ServeApiAndWs`, `RenderFlightDeck`, `ShareDomainModel`) — ADR-0008/0009 spread, no new component.
- invariants honored (mvp cross-check): *observation never interferes* (parse cached off-path S1; nav fire-and-forget + debounced watch S4); *app never observes its own output* (model is the declared file, excludes `dashboard/`+`prototypes/`); *pipeline never shows false progress* (status from real `ProjectState`; as-built `done` is real, never synthesized; absent → `unknown`); *twin derives never duplicates* (no store, recomputed on watch); *work leaves only via human gate* (read-only — untouched).
- research_open_questions_resolved: n/a (greenfield-of-feature; design resolved Q1–Q4).
- refactors_deferred: none. supersedes: none.
- `beyond_roster: true` — register `system-map` via `/feature-map` (P0, mvp) before `/build`.

## Verdict
**READY-FOR-ISSUES** — 4 vertical, dependency-ordered, independently-mergeable slices, each one PR. Slice 1 is the tracer bullet: the thinnest real path (shared types → markdown parse → status derive → project-scoped serve → react-query fetch → `@xyflow/react` render → nav route) that ships US-1/US-2 and proves NFR-3/4 (the NFR-1 latency gate + `architecture.serve` instrumentation are deferred to Slice 4). Slices 2 (inspector + join), 3 (SDLC view), 4 (auto-refresh + adoption metric) each depend only on Slice 1 and are parallelizable. Every slice traces to ≥1 user story + ≥1 NFR with mechanical, measured acceptance; no new dependencies (LikeC4 deferred per design `adr/0001`). All five architecture invariants cross-checked — no slice violates one. Next: `/to-issues system-map` expands the slices into canonical issue files; `/publish-issues` mints a bead per slice and opens the build loop. The builder uses the exact (zero) new packages named here — no substitutions.
