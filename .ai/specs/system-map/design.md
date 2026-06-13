---
slug: sdlc-command-center
feature: system-map
stage: design
status: complete
tier: mvp
verdict: READY-FOR-PLAN
verdict_overridden: false
maps_to_component: DeriveProjectState        # spreads to ServeApiAndWs + RenderFlightDeck + ShareDomainModel (ADR-0008/0009); see Placement
surface: composite                           # backend-service (parse/serve/watch) + web-ui (the tab)
dep_adds: []                                 # no new deps — LikeC4 evaluated + DEFERRED (adr/0001)
adr_count: 1
human_summary: .human/specs/system-map/design.md
sources: [.ai/specs/system-map/prd.md, .ai/architecture, .ai/anchor.md, .ai/understanding/sdlc-command-center.md]
consumed_by: [plan, to-fitness, qa]
created: 2026-06-13
---

# Design — system-map

## Status
`Draft`

## Architectural placement
- **Lives in component:** `DeriveProjectState` (materialize) — spreads to `ServeApiAndWs` (serve), `RenderFlightDeck` (the tab), `ShareDomainModel` (the graph types). **Not a new component** — ADR-0008/0009 already ratified this exact spread (`02-components.md § Forward structure`).
- **Cross-component coupling:** the 4-component spread is architecture-sanctioned (ADR-0008 unified graph; ADR-0009 derive-don't-duplicate). No new cross-component contract beyond the existing REST+WS edge (RenderFlightDeck→ServeApiAndWs, edges 1–2).
- **Invariants honored:**
  - *Observation never interferes* (NFR-4): parse + status-derivation are cached on watch, off the request path; the nav-telemetry POST is fire-and-forget.
  - *The app never observes its own output*: the model is the **declared** architecture (`02-components.md`, which already excludes `dashboard/`+`prototypes/` by construction); the deferred code-scan (drift) inherits the watcher's exclusion (`watcher.ts:18`).
  - *The pipeline never shows false progress*: component status derives from real `ProjectState`/verdicts; absent data → `unknown`, never a synthesized `done`.
  - *The twin derives, never duplicates* (ADR-0009): no architecture store — recomputed on watch + cached.
  - *Work leaves only through a human gate*: untouched — system-map is read-only.

## Surface
- **Surface(s):** `composite` — `backend-service` (parse/serve/watch in DeriveProjectState+ServeApiAndWs) + `web-ui` (the Architecture tab in RenderFlightDeck).
- **Checklist applied:** web-ui (component tree, state/fetching, navigation, a11y, loading/empty/error) + backend-service base rounds. Bias: web-ui is the JTBD surface; the server side is a thin derive+serve.
- **Cross-surface contracts produced:** `GET /api/projects/:id/architecture` + `POST /api/projects/:id/events` + the `architecture-changed` WS event (owned by backend-service; referenced, not redeclared, by web-ui).

## Module decomposition
| module | new/mod | role (one present-tense sentence) | ~LoC | inbound | outbound |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `architectureModel.ts` | new | Defines the graph types `ArchitectureModel`/`ComponentNode`/`ArchEdge`/`ArchNodeStatus` — the {component,edge} subset of ADR-0008. | 70 | both apps | (pure) |
| `ParseArchitectureModel` | new | Parses `02-components.md`'s two tables into the declared `ArchitectureModel`, cached on watch. | 120 | ServeApiAndWs, watcher | fs read |
| `DeriveComponentStatus` | new | Derives each component's status + linked feature/slice/issue refs from `ProjectState`. | 110 | ServeApiAndWs | getProjectState |
| `RenderSystemMap` | new | Renders the Architecture tab's status-colored component graph via `@xyflow/react`. | 180 | nav route | useArchitecture |
| `InspectComponent` | new | Renders the selected component's inspector (role/files/deps/owner/linked refs). | 120 | RenderSystemMap | (props) |
| `RenderSdlcProgress` | new | Renders chain stages grouped by phase, status-colored, "next" marked, over `stageModel`. | 100 | Architecture tab | useProjectState |
| `watcher.ts` | mod | On a debounced change under `.ai/architecture/`, recompute the model + broadcast `architecture-changed`. | +20 | (chokidar) | bus.broadcast |
| `api.ts` | mod | Add `GET …/architecture` (serve) + `POST …/events` (nav-adoption ingest). | +35 | RenderFlightDeck | DeriveProjectState |
| `ws.ts` + `types.ts` | mod | Add `architecture-changed` to the `ServerEvent` union + `topicsFor` routing. | +8 | bus | WS subscribers |
| `App.tsx` + `Shell.tsx` | mod | Register the `/architecture` route + nav entry; refetch on `architecture-changed`. | +12 | router | useArchitecture |

> 6 new modules reflects the composite 3-view feature (graph · inspector · SDLC progress) across 2 surfaces; `/plan` slices it (tracer = parse→serve→render graph). Under the 185-line cap; not split.

## File / folder layout
```
packages/shared/src/architectureModel.ts              # architectureModel.ts (new) — + export in index.ts
packages/shared/src/types.ts                           # ServerEvent union += architecture-changed (mod)
apps/server/src/state/parseComponentsModel.ts          # ParseArchitectureModel (new; markdown-table parse helper local)
apps/server/src/state/deriveComponentStatus.ts         # DeriveComponentStatus (new)
apps/server/src/state/watcher.ts                       # architecture-changed emit on .ai/architecture/ change (mod)
apps/server/src/routes/api.ts                          # GET …/architecture + POST …/events (mod)
apps/server/src/ws.ts                                  # topicsFor(architecture-changed) (mod)
apps/web/src/pages/ArchitecturePage.tsx                # RenderSystemMap (new)
apps/web/src/components/ComponentInspector.tsx         # InspectComponent (new) — StageDetail panel pattern
apps/web/src/components/SdlcProgress.tsx               # RenderSdlcProgress (new)
apps/web/src/api/hooks.ts                              # useArchitecture(projectId) (mod)
apps/web/src/App.tsx + components/Shell.tsx            # /architecture route + nav entry (mod)
apps/server/src/state/parseComponentsModel.test.ts     # round-trip parse (NFR-3, R-1)
apps/server/src/state/deriveComponentStatus.test.ts    # status + join derivation (R-2)
apps/server/src/routes/architecture.test.ts            # route contract (200/404 + nav ingest)
packages/shared/src/architectureModel.test.ts          # pure status-rollup unit
```

## External dependencies
_No new external deps — all in `anchor.approved_dependencies`._ The graph renders on `@xyflow/react` (already shipped in PipelinePage), MUI/`@tanstack/react-query`/`zustand` for state, and a local pipe-table parser ported from `project-state.py:203-233` (no `gray-matter` — `02-components.md` has no frontmatter). **LikeC4 evaluated and DEFERRED** as the renderer (see `adr/0001`); its metadata convention is adopted for forward-compat. No dependency added.

## Schema deltas
**None** — the model is derived + cached, never stored (ADR-0009). Nav-adoption telemetry reuses the **existing** `audit_events` table (`source:'user'`, `kind:'nav'`, `detail:{ path }`; columns already present, `db.ts:56-67`) — no DDL, no migration.

## API contracts
### `GET /api/projects/:id/architecture`
| attribute | value |
| :-- | :-- |
| auth | none — loopback boundary (api-governance / ADR-0005) |
| request | path param `id`; no body |
| response 200 | `ArchitectureModel` `{ projectName, generatedAt, components: ComponentNode[], edges: ArchEdge[] }` — empty arrays when `/architect` hasn't run (drives the empty state) |
| response 404 | `{ error: "not found" }` — unknown project id |
| response 500 | `{ error: <message> }` — parse/IO failure; `trace_id` in the structured log, not the envelope (api-governance: single-key error) |
| idempotency | n/a — read-only |
| versioning | none — unversioned `/api/*` (api-governance) |

### `POST /api/projects/:id/events`
| attribute | value |
| :-- | :-- |
| auth | none — loopback boundary |
| request | `{ kind: "nav", path: string }` (mvp: `kind` validated to `nav`) |
| response 202 | `{ recorded: true }` |
| response 400 | `{ error: "invalid event" }` — missing/unknown `kind` or `path` |
| response 404 | `{ error: "not found" }` — unknown project id |
| idempotency | **read-idempotent by construction** — the success metric counts *distinct* code-touching sessions, so a duplicate nav write is absorbed by query-time `DISTINCT session_id`; no write-time key needed |

## Call flow — A: open the tab (render + record adoption)
| # | from | to | message | sync/async |
| :-- | :-- | :-- | :-- | :-- |
| 1 | User | RenderSystemMap | navigate to /architecture | sync |
| 2 | RenderSystemMap | ServeApiAndWs | GET /api/projects/:id/architecture | sync |
| 3 | ServeApiAndWs | ParseArchitectureModel | getModel(rootPath) — cached on watch | sync |
| 4 | ServeApiAndWs | DeriveComponentStatus | deriveStatus(model, projectState) | sync |
| 5 | DeriveComponentStatus | ServeApiAndWs | ArchitectureModel (status + linked refs) | sync |
| 6 | ServeApiAndWs | RenderSystemMap | 200 ArchitectureModel | sync |
| 7 | RenderSystemMap | User | status-colored graph (7 nodes / 10 edges) | sync |
| 8 | RenderSystemMap | ServeApiAndWs | POST /api/projects/:id/events {kind:nav} | async |
| 9 | ServeApiAndWs | PersistAndBroadcast | audit(nav event) | async |
| 10 | User | InspectComponent | click a component node | sync |
| 11 | InspectComponent | User | inspector (role/files/deps/owner/linked refs) | sync |

## Call flow — B: auto-refresh on model change (the living property)
| # | from | to | message | sync/async |
| :-- | :-- | :-- | :-- | :-- |
| 1 | /architect or slice-merge | 02-components.md | write | async |
| 2 | watcher | ParseArchitectureModel | recompute + cache (debounce 800ms) | async |
| 3 | watcher | PersistAndBroadcast | broadcast architecture-changed {projectId} | async |
| 4 | PersistAndBroadcast | RenderSystemMap | architecture-changed (WS) | async |
| 5 | RenderSystemMap | ServeApiAndWs | refetch (invalidateQueries) | sync |
| 6 | RenderSystemMap | User | re-rendered graph | sync |

## Failure modes & resilience
| hop / boundary | what breaks | detection | response | user-visible effect |
| :-- | :-- | :-- | :-- | :-- |
| `ParseArchitectureModel` ← fs | `02-components.md` missing/malformed | parse → empty + warn log | serve 200 empty model | empty state: "No model yet — run /architect" |
| `DeriveComponentStatus` ← projectState | state stale/unavailable | 15s cache miss/timeout | render declared model, status `unknown` | graph shows structure, status muted |
| `watcher` → WS | client disconnected | socket closed | react-query refetch on reconnect | staleness ≤ reconnect (existing socket retry) |
| `POST /events` ← web | server unreachable | fetch rejects | fire-and-forget; swallow | none (metric undercounts; never blocks the tab — NFR-4) |

## Observability hooks
- **logs:** `architecture.parse {component_count, edge_count, parse_ms, ok|warn}`, `architecture.serve {project_id, cache_hit, duration_ms, trace_id}`. No PII (paths only).
- **metric source (PRD success metric — app-emitted):** the **nav adoption event** — `audit_events {source:'user', kind:'nav', project_id, session_id?, detail:{path:'/architecture'}}`, emitted at **Flow A step 8** (tab mount). Denominator (sessions with ≥1 Edit/Write) derives from existing `hook_events` PostToolUse (`api.ts:519`). `/measure` reads: distinct code-touching sessions emitting a `nav /architecture` ÷ distinct code-touching sessions, 14-day window.
- **spans:** reuse existing OTel — `architecture.serve` span; no new infra.
- **freshness (NFR-2):** change→`architecture-changed`→refetch under the 2s target (800ms debounce + refetch ≈ ≤1.2s).

## Test plan
- **unit** — `packages/shared/src/architectureModel.test.ts` — pure status-rollup (all-merged→done · any-in-progress→in-progress · any-blocked→blocked · no-feature→done as-built). First of its kind — establishes the graph-types pattern.
- **unit** — `apps/server/src/state/parseComponentsModel.test.ts` — round-trip the real `02-components.md` → 7 components / 10 edges; parse→serialize→diff = 0 dropped/invented (NFR-3, R-1). Prior art: `docsTree.test.ts` hermetic read.
- **integration** — `apps/server/src/state/deriveComponentStatus.test.ts` — component→feature/slice/issue join over a `makeState` fixture; linked refs resolve for the majority (R-2). Prior art: `stageModel.test.ts` `makeState/makeFeature/makeSlice` builders (test-strategy canonical acquisition).
- **integration** — `apps/server/src/routes/architecture.test.ts` — `GET …/architecture` 200 model + 404 unknown project; `POST …/events` writes a nav `audit_events` row. Prior art: existing server route tests + `SDLC_DATA_DIR` tmp-dir rule.
- **e2e** — deferred: the Playwright suite is named-but-unmaterialized (test-strategy); manual smoke (open tab → eyeball graph → click node → merge a slice → watch refresh) until a feature adopts `@playwright/test`.

## Per-feature ADRs
- `adr/0001-defer-likec4-render-our-own.md` — defer LikeC4 as the slice-1 renderer (use our `@xyflow/react`+MUI), adopt its metadata convention for forward-compat. 3-trigger: hard-to-reverse model shape + surprising (why not the purpose-built tool?) + real build-vs-buy trade-off.

## Notes
- **Glossary terms:** Project, Stage, Feature, Slice, Verdict token (from context.md, no drift) + new graph terms ComponentNode/ArchEdge/ArchitectureModel.
- **Open questions resolved here:** Q1 self-adoption + nav source → §Observability; Q2 drift OUT, schema-reserved (`ArchEdge.type`) → §Schema/§Placement; Q3 markdown parse → §ParseArchitectureModel/§External deps; Q4 LikeC4 defer → `adr/0001`.
- **PRD corrections baked in:** endpoint is project-scoped `GET /api/projects/:id/architecture` (not bare `/api/architecture`); `architecture-changed` reuses the existing `.ai/` watch (`watcher.ts:18`) — no new watch path.
- **ADR-0008/0009 honored:** parse = declared SoT; status = derived (never stored); model is the {component,edge,feature,slice,issue,stage} subset; `ArchEdge.type` + `ComponentNode` reserve the full graph + drift for the fast-follow.
- **No `ux.md`:** at mvp the UI reference is `prototypes/v2-architecture-tab/command-deck.html`; `/ux-spec system-map` is optional — recommend before the inspector/SDLC slices if the layout needs pinning.

## Verdict
**READY-FOR-PLAN** — A composite feature placed in `DeriveProjectState`+`ServeApiAndWs`+`RenderFlightDeck`+`ShareDomainModel` (ADR-0008/0009-sanctioned spread, no new component). The builder must satisfy: parse `02-components.md` → `ArchitectureModel` (NFR-3 round-trip), derive component status from real `ProjectState` (never synthesized), serve it project-scoped, render a status-colored `@xyflow/react` graph + inspector + SDLC-progress view in a new `/architecture` tab, refresh live via the existing watch + `architecture-changed`, and emit the `nav` adoption event — all within the four invariants honored above. No new dependencies (LikeC4 deferred, `adr/0001`). Tracer slice = parse→serve→render the graph; `/plan` cuts the rest. Next: `/plan system-map` — it inherits the External dependencies (none) and file paths verbatim.
