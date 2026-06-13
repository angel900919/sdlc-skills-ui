---
slug: sdlc-command-center
feature: system-map
slice: 3
stage: issue
title: SDLC progress view
status: published
category: enhancement
type: afk
priority: P2
tier: mvp
tests: skip-tests
language: typescript
depends_on: [1]
satisfies_f_ids: []
satisfies_user_stories: [US-5]
satisfies_nfrs: [NFR-4]
satisfies_unwanted: []
files:
  - { path: apps/web/src/components/SdlcProgress.tsx, op: new }
  - { path: apps/web/src/pages/ArchitecturePage.tsx, op: modify }
hitl_reason: ""
skip_tests_reason: "Render-only view over the already-tested stageModel (foundationStageStatus/featureStageStatus); no new derivation logic. The plan authors no new test file — verified by the reused stageModel unit coverage + manual smoke (test-strategy maps system-map to no E2E spec). UI scaffolding is TDD-exempt per CLAUDE.md. AFK."
backend_refs:
  beads: "scc-lv3"
  jira: null
  md: null
source_plan: .ai/specs/system-map/plan.md
source_prd: .ai/specs/system-map/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
Add a second view inside the Architecture tab: toggle from the System graph to an **SDLC progress**
view that shows the chain stages grouped by phase, colored by status, with the current "next"
stage marked. It renders over the existing `stageModel` plus project state — no new derivation
logic, the view is render-only. The stage statuses it shows match the Pipeline view exactly (same
source of truth, different projection).

## Acceptance criteria
- [ ] The view reuses the existing `stageModel` unit coverage (`foundationStageStatus`/`featureStageStatus`) — no new derivation logic is added; the view is render-only
- [ ] Smoke: the SDLC view renders all chain stages grouped by phase, status-colored, with exactly one "next" marked, matching the Pipeline view's stage statuses
- [ ] NFR-4: pure render over existing state — adds no observation load
- [ ] The existing test suite (incl. `stageModel` units) stays green
- [ ] typecheck passes

## Traceability
- PRD: US-5 — an SDLC progress view of the chain stages grouped by phase, status-colored, "next" marked
- PRD: NFR-4 (non-interference: pure render over existing state, no added observation load)
- Plan: Slice 3 — SDLC progress view
- Architecture: `RenderFlightDeck` (the view) over `DeriveProjectState` (existing stage model + project state) — `.ai/architecture/02-components.md`

## Blocked by
- Slice 1
