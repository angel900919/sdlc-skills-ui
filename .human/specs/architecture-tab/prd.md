# Architecture tab — what we're building (plain-English)

> Derived from `.ai/specs/architecture-tab/prd.md`. If the two disagree, the `.ai` file wins.
> Tier: mvp · Verdict: **READY-FOR-DESIGN**

## In one sentence
A new **Architecture** tab in the Command Center that shows the project you're in as a live,
status-colored map of its components — click any box to see what it does, what it connects to,
its files, and the feature/issues behind it — kept in sync with the code, not stale docs.

## Why
The architecture already exists as a component + edge table the chain maintains
(`.ai/architecture/`), and build-progress already exists in the project state — but nothing
renders them together. To understand a system or decide what to touch, you read prose or source.

## What you'll be able to do
- Open the tab and **see the components and how they connect**, as a graph.
- Tell **what's built vs in-flight** at a glance (done / building / planned / blocked colors).
- **Click a component** → its role, inputs, outputs, dependencies, files, owner, and the
  feature + slices + issues it maps to.
- See the graph **refresh on its own** when the architecture changes (after `/architect` or a
  slice merges).
- Switch to an **SDLC progress** view of where the current feature sits in the chain.

## Deliberately NOT in this version
- The **orchestrator** (next-move recommendations / run-on-confirm) — that's a separate feature.
- The **portfolio switcher** / multiple projects — separate.
- Extra views (Agent Activity, Data Flow, Dependency Matrix) and the animated / C4 modes — later.
- **Drift detection** (flagging dependencies in code that the diagram doesn't know about) — the
  strongest "living, not stale" feature, but held as a fast-follow to keep the first slice thin.

## How we'll know it worked
Within 14 days of shipping, the Architecture tab is the thing you open to orient — opened in
**≥60%** of sessions where you edit code (measured from the app's own activity log).
*This number is provisional — to confirm at design.* If it's under 20%, we stop.

## Biggest risks we're testing first
- Can we reliably turn the markdown component table into a structured model? (parser round-trip)
- Does the component → feature → slice → issue link produce useful results for most components?
- Does auto-refresh feel "live enough" without drift detection?

## First real slice
A thin end-to-end path: the server reads the architecture file → a small `/api/architecture`
feed → the tab draws the 7 boxes and 10 connections with status colors. Everything else builds
inside that proven spine.

## Where this is heading (vision, not v1)
This tab is slice 1 of a **living software digital twin** — eventually one model linking
requirements → features → tasks → components → code → tests → deployments → issues → agents,
with extra views (agent activity, data flow, dependency analysis, traceability, deployment) and
**drift detection** (catching when code diverges from the diagram). Two rules keep it honest and
are locked in now: build it on **one unified graph** (every view is a query over it), and
**derive, don't duplicate** — it links to git/beads/CI/the activity log, it never re-stores them
(that's what stops it becoming stale docs). Full roadmap: `.ai/specs/architecture-tab/vision.md`.
None of this expands the first slice; it just shapes the data model. The graph model itself is an
architecture call → worth an ADR via `/architect` first.

## Open question for you
1. Is "I open this tab to orient in ≥60% of coding sessions" the right success measure, or should
   it be **accuracy/freshness** of the model (never more than a commit behind)?
2. Drift detection in v1, or fast-follow? (recommend fast-follow)
3. For the first slice, parse the existing markdown server-side (fastest, recommended) or first
   make the chain emit a structured `model.yaml`?
