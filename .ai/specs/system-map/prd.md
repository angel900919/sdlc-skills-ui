---
slug: sdlc-command-center
feature: system-map
stage: prd
status: complete
tier: mvp
verdict: READY-FOR-DESIGN
verdict_overridden: false
placement: DeriveProjectState        # + RenderFlightDeck (tab) + ShareDomainModel (types); see Notes
satisfies: orient-on-system-shape    # new behavior — not yet in understanding (beyond_roster)
beyond_roster: true
nfr_count: 4
ai_card: false
sources: [.ai/anchor.md, .ai/architecture, .ai/understanding/sdlc-command-center.md, .ai/features.md]
human_summary: .human/specs/system-map/prd.md
consumed_by: [design, plan, to-fitness]
created: 2026-06-13
---

# PRD — system-map

## Status
`Draft`

## Problem
Today the system's architecture lives in `.ai/architecture/02-components.md` (a markdown
component + edge table) and the SDLC progress lives in `ProjectState`/the Pipeline view, but
there is no single surface that shows the **live architecture of the project you're in** —
what each component is, how it connects, and how far it's been built — that stays in sync with
the code instead of going stale. To answer "what does this system look like and what's the
state of each piece?" you read prose docs or the source. The architecture model is already
maintained by the chain (`/architect`, `/as-built`); nothing renders it.

## Target user
The repo owner — a solo, technical developer running the SDLC chain inside one project at a
time from the Command Center (intake.md: `technical_user: technical`). They already live in the
dashboard; they want to orient on a system's shape and build-state without leaving it.

## Job to be Done
> When I'm working inside a project, I want to see its real components, how they connect, and
> how far each has been built, so I can understand the system and decide what to touch next —
> without trusting stale documentation.

## Scope
**In:** a new **Architecture** tab; a **System** view rendering the project's components + edges
as a live status-colored graph (sourced from `.ai/architecture/`); a **component inspector**
(role, inputs, outputs, dependencies, files, responsible owner, linked feature + slices +
issue refs); an **SDLC progress** view (chain stages grouped by phase, colored by status, "next"
marked — over the existing stage model); **auto-refresh** when the architecture model or project
state changes.
**Out:** the orchestrator conductor / run-on-confirm (→ `cross-project-orchestrator`); the
portfolio switcher / multi-project (→ separate feature); Agent-Activity, Data-Flow and
Dependency-Matrix views (system-map v2); **code↔model drift detection** (fast-follow —
see Open questions); the animated "Living Blueprint" and C4 modes (later toggles).

## Success metric
| field | value |
| :-- | :-- |
| metric | Architecture tab opened in code-touching working sessions (self-adoption) |
| baseline | 0 — the tab does not exist (source: `audit_events` has no `nav:/architecture`) |
| target | viewed in ≥ 60% of sessions that edit ≥1 file, within 14 days of ship |
| timeframe | 14 days after ship |
| source | the app's own `audit_events` (nav events) ÷ sessions with a PostToolUse Edit/Write |
<!-- PROVISIONAL — confirm at /design triage; "model accuracy/staleness" is the alternative north star -->

## Kill criteria
- If, 14 days after ship, the tab is opened in < 20% of code-touching sessions (I keep using
  Docs/Pipeline to orient), stop investing — the live graph isn't earning its place.

## User stories
1. As the developer, I want to open an Architecture tab and see my project's components and how
   they connect, so I can grasp the system shape without reading source.
2. As the developer, I want each component colored by status (done / building / planned /
   blocked), so I see at a glance what's built versus in flight.
3. As the developer, I want to click a component and see its inputs, outputs, dependencies,
   files, responsible owner, and the feature + slices + issue refs it maps to, so I can jump
   from "this box" to the actual work.
4. As the developer, I want the graph to refresh when the architecture model regenerates (after
   `/architect` or a slice merge), so it reflects the current system, not stale docs.
5. As the developer, I want an SDLC progress view of the chain stages by status, so I can see
   how far the current feature has moved.

## Risks / Assumptions
| id | assumption | falsifying test (≤1 week) |
| :-- | :-- | :-- |
| R-1 | `02-components.md`'s component + edge tables parse reliably into a structured model | write the parser; confirm 7 components / 10 edges round-trip from the real file (½ day) |
| R-2 | the component→feature→slice→bead join yields useful "linked issues" for most components | compute the join for the 7 real components; confirm a resolvable feature/slice for the majority (1 day) |
| R-3 | auto-refresh on model regeneration feels "live enough" without drift detection in v1 | dogfood: merge a slice, confirm the tab updates via the existing watch+debounce; judge staleness (½ day) |
| R-4 | React Flow (already in Pipeline) lays out the component graph acceptably | render the 7-node graph with a layered layout; eyeball legibility (½ day) |

## Non-functional requirements
| id | category | target | measurement |
| :-- | :-- | :-- | :-- |
| NFR-1 | Latency | `GET /api/architecture` p95 ≤ 300 ms for a model ≤ 50 components | server OTel spans, local, 7-day rolling (under anchor's 1000 ms ceiling) |
| NFR-2 | Freshness | tab reflects a model-file change within ≤ 2 s | timestamp: file-change → `architecture-changed` → render (watcher debounce is 800 ms) |
| NFR-3 | Accuracy | rendered model matches `.ai/architecture/` exactly — 0 components/edges dropped or invented | round-trip test: parse → serialize → diff against source |
| NFR-4 | Non-interference | building/serving the model never blocks an observed session | confirm parse is off the request path (cached on watch); honors the observation-non-blocking invariant |

## Functional requirements
- When I open the Architecture tab, I see the current project's components as a graph with their
  edges within ~1 s of the tab loading.
- When a component's status is done / building / planned / blocked, its node is colored to match,
  and a building component shows a live indicator.
- When I click a component, I see its role, inputs, outputs, dependencies, files, responsible
  owner, and linked feature + slices + issue refs.
- When the architecture model regenerates (after `/architect` or a slice merge), the tab updates
  without a manual refresh.
- When I switch to the SDLC view, I see chain stages grouped by phase, colored by status, with
  the current "next" stage marked.

## Open questions
1. **Success metric** — confirm self-adoption (≥60% of code-touching sessions) as the winning
   number, or switch the north star to model accuracy / staleness (drift = 0).
2. **Drift detection in v1?** — code↔declared-edge diff is the strongest "living, not stale"
   differentiator but adds scope. Recommend: **fast-follow**, keep slice 1 thin.
3. **Model source for the tracer** — parse the existing `02-components.md` markdown server-side
   (zero chain change, fastest), then add a structured `model.yaml` emit from `/architect` +
   `/as-built` as hardening. Recommend the markdown-parser path for slice 1.

## Vision & forward design constraint
Slice 1 renders the *declared* model, but it is the first slice of a **living software digital
twin**, not a one-off diagram. Two constraints bind `/design`:
1. **Unified graph domain model** — model the data as a strict *subset* of one typed graph:
   nodes {requirement, feature, slice/task, component, api, datastore, workflow, source-file,
   test, deployment, issue, agent-session, person}; edges {depends-on, maps-to, implements,
   traces-to, calls, emits, owns}. Every future view is then a *projection* over the one graph,
   never a bespoke shape. MVP ships only {component, edge, feature, slice, issue, stage}; the
   schema must not preclude the rest.
2. **Derive, don't duplicate** — the twin is a unified *index/projection* that **references**
   authoritative sources (git = code/PRs, beads = issues, audit DB = agent activity, `.ai/` =
   reqs/architecture, CI = deploys). It is SoT for the *architecture model* and a single *pane
   of glass* over the rest — never a second store that drifts (mirrors `DeriveProjectState`:
   derive, never own). This IS the living-twin property.

Deferred (own PRDs; schema-reserved, not built now): code↔model **drift detection** (the primary
v1.1 — the differentiator vs static-doc tools); **Agent Activity / Data Flow / Dependency
Analysis / Requirements Traceability (req→feature→task→component→code→test→deploy) / Deployment**
views; cross-project portfolio. Full roadmap → `.ai/specs/system-map/vision.md`. The
unified-graph model is an **architecture decision** → ratify via `/architect` (ADR); this feature
is its first *consumer*, not its definition.

## Notes
- **Architectural placement:** `DeriveProjectState` (parse the model + `/api/architecture` +
  `architecture-changed` event + extend the `.ai/` watcher to `.ai/architecture/`),
  `RenderFlightDeck` (the new tab: System view via the already-installed `@xyflow/react`, SDLC
  view over the existing `stageModel`, the inspector), `ShareDomainModel` (new types:
  `ArchitectureModel`, `ComponentNode`, `ArchEdge`). Finalized by `/design`.
- **First slice (tracer bullet):** thin end-to-end — server parses `02-components.md` →
  `/api/architecture` JSON → web Architecture tab renders the 7 nodes + 10 edges status-colored.
  Proves the pipeline; the inspector richness, SDLC view, auto-refresh and drift flesh out inside
  it. (`/plan` cuts the formal slices; this names the spine.)
- **Linked-issues join (story 3):** component ← `maps_to_component` (design.md) → feature →
  `SLICE-N.md` → `backend_refs.beads` (label `feature-<slug>`, AFK/HITL) → session/git author.
- Glossary terms used: Project, Stage, Feature, Slice, Verdict token — from `.ai/context.md` /
  understanding; no drift.
- Invariants honored (`02-components.md`): observation never interferes (NFR-4); the app never
  observes its own output (model describes app source — must exclude `dashboard/` + `prototypes/`,
  no feedback loop); the pipeline never shows false progress (status derives from real
  artifacts/verdicts, never synthesized).
- `beyond_roster: true` — `system-map` is not yet a row in `features.md`; add it via
  `/feature-map` (P0, mvp) before `/build`. Tech leakage captured for `/design`: `/api/architecture`
  shape, `architecture-changed` WS event, the markdown-vs-yaml model-source decision.
- **Build-vs-buy input for `/design` (LikeC4):** [LikeC4](https://github.com/likec4/likec4) (MIT,
  architecture-as-code, renders on the same `@xyflow/react` we ship) offers a `<LikeC4Diagram>`
  React component, a model-query API (`@likec4/core`: `elementsWhere`, `incoming/outgoing`, tags,
  multi-view) and a DSL/codegen. It models **declared architecture only** (no status/progress/
  links/drift — our living layer). Evaluate at `/design` (or a `/research system-map` spike) as
  the System/C4 renderer + a candidate structured model format (Q3); its model API is also a
  reference for ADR-0008's graph projections. New dep → needs an `anchor.md` approved-deps add.

## Verdict
**READY-FOR-DESIGN** — The contract: a project-scoped Architecture tab whose System graph and
component inspector render the **declared** architecture model from `.ai/architecture/`
(status-colored, with the component→feature→slice→issue join), plus an SDLC progress view over
the existing stage model, kept fresh by auto-refresh on model/state change — within the four
NFRs (latency, freshness, accuracy, non-interference) and the three honored invariants. Scope is
deliberately the *declared-model renderer*; the orchestrator, portfolio, extra views, and drift
detection are out. Next: `/design system-map` — its design must trace to `DeriveProjectState`
+ `RenderFlightDeck` in `02-components.md`; the three Open questions get triaged at the top of
`/design`. Provisional success metric to confirm there. **Forward note (Vision §):** the
unified-graph domain model is an architecture decision — recommend ratifying it via `/architect`
(ADR) so `/design` consumes it rather than inventing it; the MVP schema must be a strict subset.
Slice 1 is unchanged.
