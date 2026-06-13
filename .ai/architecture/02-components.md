# Components — sdlc-command-center (as-is, verb-noun)

Architecture-level names; file paths cite where each lives today. Recon §B6's
Entity-Trap names (sessionManager, TranscriptTailer) are renamed here only — no
code renames implied.

## Definitions
| Component | Role (one sentence) | Lives at | API-bearing |
| :-- | :-- | :-- | :-- |
| RunClaudeSessions | Spawns, resumes, and supervises interactive Claude CLI processes in PTYs with safe env + worktree isolation. | apps/server/src/claude/ | no |
| IngestObservability | Turns hook POSTs, tailed transcripts, and usage samples into domain events without ever blocking the observed session. | apps/server/src/routes/hooks.ts + claude/transcriptTailer.ts | yes (hook ingest endpoint) |
| ServeApiAndWs | Exposes the REST surface and the single multiplexed WS, translating client intent into component calls. | apps/server/src/routes/api.ts + ws.ts | yes |
| DeriveProjectState | Computes chain/project state (via the chain's project-state.py), watches artifacts, detects verdicts, raises attention, builds recaps. | apps/server/src/state/ | no |
| PersistAndBroadcast | Persists every observable event to the SQLite audit trail and fans it out to WS subscribers. | apps/server/src/bus.ts + db.ts | no |
| RenderFlightDeck | Renders the dashboard, terminals, board, and docs views over the API/WS. | apps/web/src/ | no |
| ShareDomainModel | Defines the domain types, stage graph, verdict vocabulary, and pure transforms both apps consume. | packages/shared/src/ | no |

## Dependency edges (THE source of truth — the .human C4 renders from this)
| # | From | To | Mode | Evidence |
| :-- | :-- | :-- | :-- | :-- |
| 1 | RenderFlightDeck | ServeApiAndWs | sync (fetch) | apps/web/src/api/client.ts:3-7 |
| 2 | RenderFlightDeck | ServeApiAndWs | async (WS subscribe) | apps/web/src/ws/socket.ts:26 |
| 3 | ServeApiAndWs | RunClaudeSessions | sync | apps/server/src/routes/api.ts:16-22 |
| 4 | ServeApiAndWs | DeriveProjectState | sync | api.ts route handlers → state/* |
| 5 | RunClaudeSessions | IngestObservability | async (PTY output, tailed files) | claude/transcriptTailer.ts:32-57 |
| 6 | claude CLI (external) | IngestObservability | async (hook POSTs via curl) | claude/hookSettings.ts:44-46 |
| 7 | IngestObservability | PersistAndBroadcast | sync write → async fan-out | transcriptTailer.ts:8-10, bus.ts:6-9 |
| 8 | DeriveProjectState | PersistAndBroadcast | async (events) | state/watcher.ts:3 |
| 9 | DeriveProjectState | project-state.py (external) | sync (exec) | state/projectState.ts:39 |
| 10 | all server components + web | ShareDomainModel | compile-time | api.ts:2, appStore.ts:3 |

## Architecture-level invariants (carried from understanding, code-backed)
- Observation never interferes (IngestObservability must stay non-blocking end-to-end).
- The pipeline never shows false progress (ShareDomainModel's verdict matching is the guard).
- Work leaves the machine only through a human gate (ServeApiAndWs owns the PR gate).
- Self-hosting never recurses (RunClaudeSessions strips nested CLAUDE_* env).
- The app never observes its own output (DeriveProjectState excludes dashboard/).

## Uplift look-ahead
anchor.uplift_signals = [] — no placeholder boundaries reserved.
