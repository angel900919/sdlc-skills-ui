# How the cleanup will be built — the walkthrough

Two small server modules (one that *answers* — counts and file size — and one that *acts* — the careful delete), a Storage panel with its confirm dialog in the web app, and three API routes wiring them together. No new libraries anywhere.

The one genuinely tricky decision: **giving disk space back without freezing the app**. The database library is synchronous — compacting a big file in one go would freeze every live terminal for seconds and silently lose hook events. So the design converts the database once (at boot, before anything is running) to a mode that lets space be reclaimed **in small chunks between other work** — the terminals never stutter, and the space really is returned. If anything fails mid-delete, the whole delete is rolled back — which is what lets the UI promise "nothing was deleted, the database is unchanged" and mean it.

Live sessions are protected at the query level: the delete simply cannot match records belonging to a running session, whatever cutoff you pick. And the cleanup writes its own audit-trail entry — the numbers in that entry are exactly how we'll measure the feature's success later.

```mermaid
sequenceDiagram
  actor Owner
  participant Web as Storage panel (web)
  participant Api as API surface
  participant Stats as ReportStorageStats
  participant Prune as PruneObservabilityRecords
  participant Db as SQLite
  Owner->>Web: open panel
  Web->>Api: GET /api/storage/stats
  Api->>Stats: counts + file size
  Stats->>Db: COUNT(*) x4, page math
  Db-->>Web: stats (S1)
  Owner->>Web: pick cutoff, Preview cleanup
  Web->>Api: GET prune-preview
  Api-->>Web: per-kind counts (S2 dialog)
  Owner->>Web: Delete N records
  Web->>Api: POST /api/storage/prune
  Api->>Prune: one transaction, live sessions excluded
  Prune->>Db: DELETE x4 + FTS, COMMIT
  loop bounded chunks, yielding
    Prune->>Db: incremental_vacuum(N)
  end
  Prune--)Api: audit event storage.prune (async)
  Api-->>Web: rows deleted + bytes reclaimed (S3)
```

Machine contract: [.ai/specs/observability-data-pruning/design.md](../../../.ai/specs/observability-data-pruning/design.md) · the vacuum decision: [ADR-0001](../../../.ai/specs/observability-data-pruning/adr/0001-chunked-incremental-vacuum.md)
