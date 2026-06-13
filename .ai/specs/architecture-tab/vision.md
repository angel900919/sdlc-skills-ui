---
slug: sdlc-command-center
feature: architecture-tab
stage: vision
status: roadmap-only
binds: [design]                 # the "design stance" section is binding; the rest is non-binding roadmap
relation: companion to .ai/specs/architecture-tab/prd.md
created: 2026-06-13
---

# Vision — Architecture tab → Living Software Digital Twin

> Non-binding roadmap captured from owner feedback (2026-06-13). The **Design stance** section
> is the only binding part (also in the PRD's "Vision & forward design constraint"). Everything
> else is deferred work, each its own future PRD. Recorded here so the contract (`prd.md`) stays
> a tight mvp scope while the long-term intent isn't lost.

## North star
The Architecture tab evolves into a **living software digital twin**: a continuously-derived
model that reflects the *actual* state of the project — architecture, implementation, progress,
and operational state — and is the single **pane of glass** across them. It is the single
*source of truth* for the **declared architecture model**; for everything else it is an
**index/projection over authoritative sources**, not a second store.

## Design stance (BINDING on /design — the part that matters now)
1. **One unified, graph-based domain model.** All views are projections/queries over a single
   typed graph, never bespoke shapes.
   - **Node types:** requirement · feature · task/slice · component · api · datastore · workflow
     · source-file · test · deployment · issue · agent-session · person.
   - **Edge types:** depends-on · maps-to · implements · traces-to · calls · emits · owns · touches.
2. **Derive, don't duplicate.** The twin *references* authoritative sources and is materialized
   by derivation; it never re-stores what they own:
   - git → source-files, branches, PRs, authorship   · beads → issues/tasks
   - audit DB (`audit_events`/`hook_events`) → agent-session activity   · CI → deployments
   - `.ai/` → requirements, features, the declared architecture model
   This is the property that keeps it *living* instead of a copy that drifts.
3. **MVP is a strict subset.** v1 materializes only {component, edge, feature, slice, issue,
   stage}. The schema and the `/api/architecture` shape must be designed so the remaining node
   and edge types slot in without a rewrite.
4. **The graph model is an architecture decision** → ratify via `/architect` (new ADR). The
   architecture-tab feature is its first *consumer*, not its definition.

## Deferred capabilities (each a future PRD; schema-reserved, not built in v1)

### Code synchronisation & drift detection — the PRIMARY v1.1
Analyse source code and compare it against the declared architecture model to detect:
missing components · missing dependencies · undocumented services · architecture drift.
This is the differentiator versus static-doc tools (Structurizr/LikeC4/CodeSee) — the model
notices when code added a dependency the diagram doesn't know about.

### Additional views (all projections over the one graph)
- **Agent Activity View** — what each AI agent / developer is working on: current task ·
  current component · current branch · current PR · current status · recent activity. A
  real-time view of execution. (Source: audit DB + git, already streamed over the WS.)
- **Data Flow View** — how data moves through the system: inputs/outputs · service interactions
  · event flows · processing pipelines · external integrations.
- **Dependency Analysis View** — critical dependencies · blocked components · bottlenecks ·
  circular dependencies · high-risk areas.
- **Requirements Traceability View** — navigate the full delivery chain:
  requirement → feature → task → component → code → test → deployment (business intent →
  implementation). The join backbone already partly exists (component ← maps_to_component →
  feature → slice → bead → session/author).
- **Deployment View** — environments and what's running where. (Source: CI / release records.)

### Cross-project portfolio
The per-project twin rolls up into the portfolio switcher (see the v2 prototypes / the
`cross-project-orchestrator` feature) — per-project conductors + a ranking dispatcher, no global
brain.

## Pushback recorded (owner invited it)
- "Single source of truth for implementation/operational state" → corrected to **single pane of
  glass; derive-don't-duplicate**. The twin owns the *architecture model* only; it references
  git/beads/CI/audit for the rest, or it becomes the stale duplicate it set out to replace.
- The vision shapes the **schema**, not the **first slice**. Slice 1 (the tracer) is unchanged;
  the graph model is what we design carefully now.

## Provenance
Owner feedback on `prd.md` (2026-06-13), during the v2 UI-prototype exploration
(branch `v2-prototype-architecture-tab`, `prototypes/v2-architecture-tab/`).
