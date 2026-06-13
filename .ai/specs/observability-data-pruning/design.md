---
slug: sdlc-command-center
feature: observability-data-pruning
stage: design
status: complete
tier: mvp
verdict: READY-FOR-PLAN
verdict_overridden: false
maps_to_component: PersistAndBroadcast + ServeApiAndWs + RenderFlightDeck
module_count: 4
dep_adds: []
schema_deltas: "no DDL — one-time PRAGMA auto_vacuum conversion (boot, idempotent)"
api_endpoints: 3
sources: [.ai/specs/observability-data-pruning/prd.md, .ai/specs/observability-data-pruning/ux.md, .ai/architecture/02-components.md, .ai/architecture/api-governance.md, .ai/anchor.md, .ai/test-strategy.md, .ai/data-management.md]
human_summary: .human/specs/observability-data-pruning/design.md
consumed_by: [plan, to-fitness, qa]
created: 2026-06-13
---

# Design — observability-data-pruning

## Placement
Spans three components, justified: a vertical feature in a layered monolith touches the
persistence layer (PersistAndBroadcast — the store being pruned), the API surface
(ServeApiAndWs), and the UI (RenderFlightDeck). Same shape as every shipped feature; no
new component needed.

## PRD Open questions (triage)
1. One cutoff for all four kinds? → **design-resolved (a): yes** — one `cutoffDays`
  applies to audit events, hook events, transcript copies (incl. FTS), and usage
  samples. Per-kind cutoffs are YAGNI until real use demands them.

## Modules (additive)
| Module | Kind | Role (present tense) | File | LoC ceiling |
| :-- | :-- | :-- | :-- | :-- |
| ReportStorageStats | NEW | Answers per-kind row counts, oldest-record dates, and database file size. | apps/server/src/state/storageStats.ts | 120 |
| PruneObservabilityRecords | NEW | Counts (dry-run) and transactionally deletes records older than a cutoff, excluding live sessions; reclaims pages in bounded chunks; reports rows + bytes. | apps/server/src/state/storagePrune.ts | 250 |
| ShowStoragePanel | NEW | Renders S1 (stats + cutoff picker) and S3 (result readout); owns the React Query hooks. | apps/web/src/components/StoragePanel.tsx | 250 |
| ConfirmPrune | NEW | Renders S2 — the focus-trapped confirm dialog with live counts and the two promises. | apps/web/src/components/PruneConfirmDialog.tsx | 150 |
| (wire-up) | MODIFIED | Three routes in the API surface; panel mounted on the Dashboard page. | apps/server/src/routes/api.ts · apps/web/src/pages/DashboardPage.tsx | +60 |

CQS split on the server: stats answers, prune acts — never one module doing both.

## External dependencies
No new external deps — all in the anchor allowlist (better-sqlite3, fastify,
@tanstack/react-query, @mui/material). `dep_adds: []`.

## Schema deltas
- **No DDL.** One-time storage-mode conversion at boot: if `PRAGMA auto_vacuum` ≠
  INCREMENTAL → set it + one full `VACUUM` (required for the mode to take effect),
  gated to run before the server starts serving (boot, not request time). Idempotent
  (the pragma check), follows data-management's boot-migration pattern; rollback: none
  needed — the mode is benign and reversible by the same path.

## API contracts (conform to api-governance.md: {error} envelope, camelCase, no auth, no versioning)
| Method + path | Request | 200 response | Errors |
| :-- | :-- | :-- | :-- |
| GET /api/storage/stats | — | `{ fileSizeBytes, kinds: [{ kind, rows, oldestAt }] }` | 500 `{error}` |
| GET /api/storage/prune-preview | `?cutoffDays=30` | `{ cutoffDate, totalRows, kinds: [{ kind, rows }] }` | 400 `{error: "cutoffDays must be a positive integer"}` |
| POST /api/storage/prune | `{ cutoffDays }` | `{ totalRows, deleted: [{ kind, rows }], bytesReclaimed, fileSizeBefore, fileSizeAfter }` | 400 `{error}` · 500 `{error}` (tx rolled back — DB unchanged) |

Idempotency (state-changing POST): repeat with the same cutoff deletes only records that
aged into range since — no idempotency key needed for the single local user; harmless by
construction.

## Call flow (the .human sequenceDiagram renders from this)
1. Owner opens the Storage panel → RenderFlightDeck fetches `GET /api/storage/stats` (sync).
2. ServeApiAndWs → ReportStorageStats → per-table `COUNT(*)` + `page_count × page_size` → 200.
3. Owner sets cutoff, clicks "Preview cleanup…" → `GET /api/storage/prune-preview` (sync) → S2 dialog.
4. Owner confirms → `POST /api/storage/prune`.
5. PruneObservabilityRecords: one transaction — per-kind `DELETE … WHERE older-than-cutoff AND session not live` (live = sessions.status IN starting,running; NULL-session rows prune by age alone); FTS rows follow their transcript rows; COMMIT.
6. Chunked reclaim: `PRAGMA incremental_vacuum(N pages)` in a loop, yielding to the event loop between chunks (bounded stall — see ADR-0001).
7. Emit audit event `storage.prune` `{cutoffDays, deleted, bytesReclaimed}` → PersistAndBroadcast → WS fan-out (async). **This event is the PRD success-metric source.**
8. 200 result → S3 readout; React Query invalidates the stats query.

## Failure modes
| Hop | Breaks | Detection | Response | User sees |
| :-- | :-- | :-- | :-- | :-- |
| 5 | delete tx fails (locked/IO) | better-sqlite3 throws | rollback; 500 | S3 error copy: "nothing was deleted… unchanged" (honest — tx atomicity) |
| 6 | vacuum chunk fails | pragma throws | stop chunking; keep deletions; report partial bytes | success readout + "space reclaim incomplete — will continue on next prune" |
| 2/3 | stats/preview query slow on huge DB | >2s timer | none (read-only) | S1/S2 loading state persists; N2/N4 budgets in tests |
| 7 | audit emit fails | bus throws | log error; don't fail the prune | result still shown; audit gap logged |

## Observability
- Structured log per prune: `{event: "storage.prune", cutoffDays, totalRows, bytesReclaimed, durationMs}` (pino, no PII — record kinds and counts only).
- Audit event `storage.prune` (step 7) — doubles as the success-metric source for `/measure`.
- No new config vars; no environments.md update needed.

## Test plan (cites .ai/test-strategy.md)
- **unit** — `apps/server/src/state/storagePrune.test.ts`: cutoff-date math, live-session
  exclusion predicate building, chunk planning (pure seams). Builders: `makeSession`
  `(new — on first need)` per the strategy's growth rule.
- **integration** — same file + `storageStats.test.ts`: tmp-dir SQLite via `SDLC_DATA_DIR`
  (the strategy's test-db rule): seed aged rows across all four kinds + one live session →
  prune → assert per-kind deletions, live rows survive, FTS rows gone with their
  transcripts, audit row written, re-run deletes 0, 400 on bad cutoff.
- **e2e** — none: this feature maps to no journey in the strategy's table (the three
  journeys predate it); coverage is the `/qa` manual walk of ux.md S1–S3 states. Adding a
  storage journey is a deliberate strategy update, not a silent parallel suite.

## Per-feature ADR
- [adr/0001-chunked-incremental-vacuum.md](adr/0001-chunked-incremental-vacuum.md) — why
  not a monolithic VACUUM (better-sqlite3 is synchronous: a full VACUUM stalls the event
  loop, freezing WS frames and losing >3s hook POSTs — a direct invariant-1 violation).

## Verdict
**READY-FOR-PLAN** — placement valid (3-component span justified), 4 modules + wire-up,
zero new deps, contracts governance-conformant, call flow emits the success metric,
test plan cites the locked strategy. Next: `/plan observability-data-pruning`.
