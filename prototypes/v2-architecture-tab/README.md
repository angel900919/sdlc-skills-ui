# v2.0 — Architecture & Progress tab + Orchestrator (UI exploration)

Throwaway **mockups** (spike code, mock data) exploring two v2.0 concepts:
1. A living **Architecture & Progress** tab for the dashboard.
2. An **orchestrator** that knows cross-project status and recommends/runs the next move.

> Branch: `v2-prototype-architecture-tab`. Not wired to the server — open the HTML directly.

## View them

```bash
open prototypes/v2-architecture-tab/index.html      # gallery of all four
```

Or open any file under `file://…/prototypes/v2-architecture-tab/`.

## The four directions

| | File | Thesis |
|---|---|---|
| **A** | `command-deck.html` | **Recommended.** The integrated tab that ships: 6 sub-views (System · Feature · Agents · Data Flow · Dependencies · SDLC) + a component inspector + a docked orchestrator conductor. |
| **B** | `living-blueprint.html` | Motion-first — particles flow along live edges, building components breathe, telemetry ticker streams. Sells "synchronized & alive, not stale docs." |
| **C** | `portfolio-conductor.html` | Multi-project. The orchestrator is the star — one screen, every project, the next move surfaced. Answers "manage ALL my projects." |
| **D** | `blueprint-as-code.html` | C4 drill-down (Context→Container→Component) + diagram⟷source split + drift badge. The Structurizr / LikeC4 positioning. |

These are not mutually exclusive: **A is the tab, C is the home screen, B is A's "System" view turned up, D is A's "System" view in C4 mode.** A shipping v2.0 can absorb all four.

## Shared foundation (don't re-theme per file)

- `_shared.css` — the Flight Deck palette (verbatim from `apps/web/src/theme.ts`) as CSS vars + ready-made classes.
- `mock-data.js` — `window.MOCK` with the **real** 7 components + 10 edges (`02-components.md`), the SDLC stage graph (`stageModel.ts`), real features/slices/beads, plus a few planned items and sibling projects so planned/building/blocked and the portfolio have content.

## Why these are buildable for real (not just pretty)

Everything the mockups show already has a data source in the app:

- **Component + edge model** → `.ai/architecture/02-components.md` (7 components, 10 edges, each with `file:line` evidence). ~60% machine-ready; needs a structured YAML/JSON emit + an `/api/architecture` endpoint.
- **Status / SDLC progress** → `ProjectState` + `stageModel.ts` (`foundationStageStatus`/`featureStageStatus`) — already typed and computed, already rendered by the Pipeline page (React Flow is installed).
- **Linked requirements / tasks / issues / owner** → the join already exists: component (`maps_to_component` in `design.md`) → feature → slice (`SLICE-N.md`) → bead (`backend_refs.beads`, `feature-<slug>` label, AFK/HITL) → session / git author.
- **Real-time updates** → the WS already broadcasts `state-changed`, `fs-changed`, `verdict`, `audit-event`. A new `architecture-changed` event + extending the file-watcher to `.ai/architecture/` closes the loop.
- **Orchestrator** → `/next` is already a read-only router; `verdictWatcher` already detects `{token, nextSkill}`. v2 elevates this to an always-on, cross-project, gated conductor.

## The orchestrator stance baked into these mockups

The chain's #1 rule (`/next`): *"suggest only; never invoke; the user keeps agency."* So every mockup shows the orchestrator as **advisor + run-on-confirm**, with an explicit **Suggest ↔ Autopilot** toggle and hard stops (AFK-only · stop-at-HITL · stop-at-PR). It never silently advances a stage.
