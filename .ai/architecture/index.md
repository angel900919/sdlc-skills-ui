---
slug: sdlc-command-center
stage: architecture
status: complete
tier: mvp
project_type: brownfield
style: modular-monolith-with-event-bus
component_count: 7
edge_count: 10
adr_count: 6
api_governance: .ai/architecture/api-governance.md
verdict: READY-FOR-PRD
verdict_overridden: false
source_anchor: .ai/anchor.md
source_understanding: .ai/understanding/sdlc-command-center.md
source_recon: .ai/recon.md
source_context: .ai/context.md
human_summary: .human/summaries/architecture.md
consumed_by: [prd, design, plan, threat-model, to-fitness, pipeline]
created: 2026-06-13
---

# Architecture bundle — sdlc-command-center

As-is HLD recovered over the existing code (brownfield): recon §A/§B/§D are the
evidence base; nothing here redesigns the system.

## Bundle map
| File | Holds |
| :-- | :-- |
| `characteristics.yaml` | top-3 -ilities + one fitness function each (mvp light) |
| `01-style.md` | style decision + the three determinations |
| `02-components.md` | component definitions + THE dependency-edge table (source of truth) |
| `api-governance.md` | cross-feature API conventions (detected, cited) |
| `adr/0004…0009` | recovered as-is decisions (0004–0007) + the forward digital-twin decisions: 0008 unified graph domain model, 0009 twin-derives-never-duplicates |

## Components (defined in 02-components.md)
RunClaudeSessions · IngestObservability · ServeApiAndWs · DeriveProjectState ·
PersistAndBroadcast · RenderFlightDeck · ShareDomainModel

## Notes
- ADR numbering continues from the repo's existing `docs/adr/0001–0003` (respected as-is;
  one shared sequence for the whole repo, so no two ADR-0001s exist).
- Feature trace (Phase 4) is deferred to `/feature-census` — the canonical brownfield
  order runs it after `/architect`; census cross-traces its inventory to these components.
- API-bearing component: ServeApiAndWs → `api-governance.md` written.
- Forward (ADR-0008/0009): the unified project-graph domain model — every view projects over one
  typed graph; the twin derives from authoritative sources, never duplicates them. First consumer
  is the `architecture-tab` feature; it spreads across existing components (no new component). See
  `02-components.md` § Forward structure.
