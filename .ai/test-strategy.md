---
slug: sdlc-command-center
stage: test-strategy
status: complete
tier: mvp
project_type: brownfield
test_framework: vitest 3 (workspace projects)
fixture_style: factory
fixture_library: built-in (hand-rolled make<Entity> builders)
e2e_tool: "@playwright/test (proposed — not yet adopted)"
dep_adds: ["@playwright/test"]
recovered_from_repo: true
entity_count: 6
e2e_journey_count: 3
verdict: TEST-STRATEGY-LOCKED
verdict_overridden: false
source_anchor: .ai/anchor.md
source_architecture: .ai/architecture/index.md
source_understanding: .ai/understanding/sdlc-command-center.md
source_recon: .ai/recon.md
context_file: .ai/context.md
human_summary: .human/summaries/test-strategy.md
consumed_by: [design, plan, to-issues, mtdd-implement, qa, bootstrap, pipeline]
created: 2026-06-13
---

# Test strategy — sdlc-command-center

> Tier: `mvp` · Locked 2026-06-13 · RECOVERED from the repo (citations per claim); items marked `(new)` fill genuine gaps.

## Test pyramid
- **unit** — pure logic: every `@sdlc/shared` transform and any pure server module
  (claudeArgs, hookSettings shapes). The bulk of the suite (10 of 16 files are shared
  unit tests). Naming/location: co-located `src/**/*.test.ts` (vitest.config.ts:7).
- **integration** — anything crossing a dependency edge in `02-components.md`
  (db writes, bus fan-out, fs watching, route handlers). Today: 6 server test files
  (attention, docsTree, search, claudeArgs, globalHooks, hookSettings). Same naming,
  node environment only (vitest.config.ts:9-27).
- **e2e** — none exists today `(new)`: journey specs live at `e2e/journeys/*.spec.ts`
  via Playwright once adopted (see E2E table; dep_adds flags `@playwright/test` for anchor).
- Runner: one root `npm test` → vitest workspace projects `shared` + `server`
  (vitest.config.ts:9-27); web project added the day a component test exists.

## Fixture & factory strategy
- Style: **factory — hand-rolled `make<Entity>(overrides: Partial<T>)` builders**,
  the recovered idiom (makeState/makeFeature/makeSlice, stageModel.test.ts:7,38,52).
  No factory library; none needed at this scale.
- Growth rule `(new)`: a builder starts test-file-local; the moment a second file needs
  it, promote it to `packages/shared/src/testing/builders.ts` — never copy-paste a builder.
- Fs-touching tests use hermetic tmp-dir fixtures (docsTree.test.ts:9).
- Canonical entity acquisition (one way per entity):

| Entity | Acquire via | Lives | Override convention |
| :-- | :-- | :-- | :-- |
| Feature | makeFeature(overrides) | stageModel.test.ts (promote on 2nd use) | Partial<FeatureState> |
| Slice | makeSlice(overrides) | stageModel.test.ts (promote on 2nd use) | Partial<FeatureSliceState> |
| ProjectState/Foundation | makeState(overrides) | stageModel.test.ts (promote on 2nd use) | Partial<Foundation> |
| Session | makeSession(overrides) `(new — on first need)` | test-file-local | Partial<ClaudeSession> |
| Hook event | makeHookEvent(overrides) `(new — on first need)` | test-file-local | Partial<HookEvent> |
| Audit event | makeAuditEvent(overrides) `(new — on first need)` | test-file-local | Partial<AuditEvent> |

## Seed data
- none — no seed scripts exist and none are needed: dev data accrues organically from
  real sessions; the one boot default is code-owned self-registration
  (data-management.md § Seed data). `n/a` stands until a real dataset need appears.

## Test database / services
- `(new)` — convention for db-touching integration tests: point `SDLC_DATA_DIR` at a
  fresh tmp dir per test file (the env override exists — config.ts:14; hookSettings.test.ts
  already manipulates SDLC_DATA_DIR) so each suite gets a disposable SQLite. Never the
  real `data/` dir. External processes (claude CLI, python3, gh) are **never** spawned
  in tests — fake at the boundary (claudeArgs and hookSettings test the pure seams).

## Brownfield data rule
- n/a — no `pii`/`regulatory` uplift; the only real data is the owner's own local
  observability store, and tests never read it (tmp-dir rule above).

## E2E journey suite (append-only across features)
| Journey (understanding § Behaviors) | Spec file | Owning feature(s) |
| :-- | :-- | :-- |
| Launch a chain step from the browser | e2e/journeys/launch-a-chain-step.spec.ts | live-terminal-sessions |
| Pick up where I left off | e2e/journeys/pick-up-where-i-left-off.spec.ts | session-resume |
| Advance the pipeline by verdict | e2e/journeys/advance-by-verdict.spec.ts | verdict-pipeline-advance |

- Standing extension rule: *a feature's tracer-bullet slice extends the mapped journey
  spec; new parallel journey suites are rejected at `/plan` and `/qa`.*
- Status: the suite is **named but not materialized** — adopting `@playwright/test`
  (dep_adds) and writing the first spec is an ordinary slice when a feature next touches
  one of these journeys. Until then, journey coverage is manual smoke (run + click).

## Verdict

**`TEST-STRATEGY-LOCKED`** — conventions recovered and cited (framework, co-location,
builder idiom, tmp-dir hermeticity); gaps filled with three `(new)` conventions
(test-db tmp-dir rule, builder growth rule, named-but-unmaterialized Playwright journey
suite). Next per canonical order: `/pipeline` (RECOVERY), then `/prd observability-data-pruning`.
