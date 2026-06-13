---
slug: sdlc-command-center
stage: features
status: complete
tier: mvp
project_type: brownfield
verdict: READY-FOR-PRD
verdict_overridden: false
trace_status: complete
shipped_count: 17
planned_count: 1
p1: oldest-record-age
source_recon: .ai/recon.md
source_understanding: .ai/understanding/sdlc-command-center.md
source_context: .ai/context.md
human_summary: .human/summaries/features.md
consumed_by: [prd, design, plan, build, status, next, ship]
created: 2026-06-13
---

# Features — sdlc-command-center

## In scope

| id | title | priority | status | tier | depends_on | satisfies |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| live-terminal-sessions | Drive real Claude terminals from the browser (incl. permission-mode choice + persistence) | — | shipped | mvp | — | RunClaudeSessions, RenderFlightDeck · behavior: launch-a-chain-step |
| session-resume | Resume interrupted sessions exactly where they stopped | — | shipped | mvp | live-terminal-sessions | RunClaudeSessions · behavior: pick-up-where-i-left-off |
| session-observability | Live hook/transcript/chat stream per session | — | shipped | mvp | live-terminal-sessions | IngestObservability · behavior: launch-a-chain-step |
| usage-telemetry | Per-session token/cost/context-window readouts | — | shipped | mvp | session-observability | IngestObservability, ShareDomainModel |
| attention-notifications | "Blocked on you" badges + notifications | — | shipped | mvp | session-observability | DeriveProjectState |
| verdict-pipeline-advance | Detect chain verdicts; board offers one-click next step | — | shipped | mvp | session-observability | DeriveProjectState, ShareDomainModel · behavior: advance-by-verdict |
| chain-state-board | Pipeline/board views over the chain's project state | — | shipped | mvp | — | DeriveProjectState, RenderFlightDeck |
| transcript-search | Full-text search across all transcripts | — | shipped | mvp | session-observability | PersistAndBroadcast (FTS5) |
| subagent-tree-view | Subagent tree with token rollups | — | shipped | mvp | usage-telemetry | IngestObservability |
| diff-review-panel | Branch diff review; comments sent as terminal input | — | shipped | mvp | live-terminal-sessions | ServeApiAndWs |
| worktree-isolation | Per-session git worktrees for parallel work | — | shipped | mvp | live-terminal-sessions | RunClaudeSessions |
| analytics-dashboards | Skills leaderboard, heatmap, per-commit stats | — | shipped | mvp | usage-telemetry | DeriveProjectState |
| transcript-export | Transcript → Markdown export | — | shipped | mvp | session-observability | ShareDomainModel |
| recap-badges | Structural "what happened while unfocused" recaps | — | shipped | mvp | session-observability | DeriveProjectState |
| pr-handoff | Human-gated PR creation from a session branch | — | shipped | mvp | worktree-isolation | ServeApiAndWs · behavior: ship-as-pr (gh unverified end-to-end — gh CLI absent) |
| docs-and-skills-browser | Rendered project docs/artifacts + skills catalog | — | shipped | mvp | — | DeriveProjectState, RenderFlightDeck |
| observability-data-pruning | Prune old observability data (audit events, usage samples, transcript copies) by age, from the UI | P0 | shipped | mvp | session-observability | PersistAndBroadcast, ServeApiAndWs, RenderFlightDeck · data-management retention follow-up |
| oldest-record-age | Show each prunable kind's oldest record as a relative age ("63 days ago") beside the date in the Storage panel | P1 | qa-approved | mvp | observability-data-pruning | RenderFlightDeck · storage-panel legibility |

<!-- status flip planned → building by /to-issues 2026-06-13 (3 canonical slices written) -->
<!-- status flip building → qa-approved by /qa 2026-06-13 (7 PASS / 0 FAIL / 2 WARN; approved on the record) -->
<!-- status flip qa-approved → shipped by /ship 2026-06-13 (local-first: shipped = merged to develop + runs from source; no remote deploy/tag; smoke human-deferred; approved on the record) -->
<!-- status flip planned → building by /to-issues 2026-06-13 (oldest-record-age: 1 canonical slice written) -->
<!-- status flip building → qa-approved by /qa 2026-06-13 (oldest-record-age: 6 PASS / 0 FAIL / 2 WARN [security+a11y, mvp-accepted] / 3 SKIP; verifier delegation fired; approved as-is on the record) -->

<!-- priority: P0 | P1 | P2 · applies to planned rows only -->
<!-- status: planned | building | qa-approved | shipped | deprecated | removed | blocked | cut -->

## Deferred
- none — no planned work deferred with dates.

## Never
- mobile/remote access — conflicts with the loopback security posture (owner re-rejected 2026-06-12).
- cloud SaaS of transcripts; API-credit (SDK) execution path (understanding § boundaries).

## Priority key
- P0 = build next. Single planned row; cap (mvp 5–8) not in tension.

## Trace status
- status: complete — every shipped row traces to ≥1 architecture component; behaviors cited where understanding models them (3 journeys cover 5 rows; the rest trace to components + roadmap provenance).

## Notes
- Inventory provenance: recon §B6 components × understanding behaviors × the built
  roadmap record (all tiers built as of 2026-06-12, commits 2b1769c/9998476/4694337/d1a424f).
- Pure-infra components (PersistAndBroadcast, ShareDomainModel) carry no feature row of
  their own — they appear in traces only.
- New planned work sourced from this dogfood run's own findings: the SQLite observability
  store grows unboundedly (db.ts tables have no pruning path; data-management.md names
  retention as the missing lifecycle).
