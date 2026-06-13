---
slug: sdlc-command-center
stage: data-management
status: complete
tier: mvp
project_type: brownfield
verdict: DATA-MANAGEMENT-LOCKED
verdict_overridden: false
db: sqlite (better-sqlite3)
migration_tool: "none — inline DDL at boot (CREATE TABLE IF NOT EXISTS + ensureColumn), no ORM"
migrations_dir: "n/a — single schema module apps/server/src/db.ts"
naming: "n/a — code-reviewed edits to db.ts, no migration files"
reversibility: argued-irreversible-allowed
ordering: n-a-single-module
retention_entity_count: 0
backup_last_tested: n-a
production_seeds: none
dep_adds: []
source_anchor: .ai/anchor.md
source_architecture: none
source_recon: .ai/recon.md
source_test_strategy: none
source_context: none
consumed_by: [design, to-issues, pipeline, ship]
created: 2026-06-13
---

# Data management — sdlc-command-center

> Tier: `mvp` · Locked 2026-06-13 · RECOVERY mode — every fact detected and cited; nothing invented.

## Migration policy
- **Tool: none (detected).** Schema lives as inline DDL run at boot — `CREATE TABLE IF
  NOT EXISTS` for 7 tables + the FTS5 index (apps/server/src/db.ts:12-101); columns added
  later ship as idempotent `ensureColumn()` additive ALTERs (db.ts:104-113). No migration
  files, no ORM (recon §A4; ADR-0003). `dep_adds: []` — no new tooling proposed.
- **Reversibility: argued-irreversible-allowed.** No down migrations exist or are required.
  The argument, on the record: the DB is a local, gitignored, single-user observability
  store (`data/command-center.sqlite`); every table is re-derivable from source data
  (transcripts on disk, hook re-ingest) or is append-only telemetry; "rollback" = delete
  `data/` and let boot recreate the schema. A future **destructive** change (dropping or
  re-typing a column with data worth keeping) must carry its own argued-irreversible note
  in the slice — additive-only is the standing rule.
- **Schema vs data migrations (detected pattern):** schema = boot DDL in db.ts; data =
  idempotent boot-time backfills (`backfillSearchIndex`, `backfillUsageSamples` —
  apps/server/src/index.ts:46-49), each safe to re-run (`INSERT OR IGNORE` dedupe,
  usageTracker.ts:15-21). New data transforms follow the same shape: idempotent,
  code-owned, run at boot — never hidden inside a schema statement.
- **Ordering / merge conflicts:** single schema module, git-ordered — two branches
  touching db.ts conflict in git and are resolved by hand; `IF NOT EXISTS`/`ensureColumn`
  make replay order-safe.
- **Review rule:** any slice touching the db.ts schema block or adding a backfill is
  HITL — it goes through /mtdd-review like all code, and /to-issues classifies
  DB-migration work as human-gated. No schema change lands unreviewed.

## Seed data
- Dev/test seeds: `.ai/test-strategy.md` not yet written (it runs later in the brownfield
  order) — when it lands, its `## Seed data` owns dev/test seeding; this file will then
  carry only the pointer.
- Production/reference seeds: **none.** The only default-row behavior is code-owned boot
  self-registration — an empty projects table gets the host repo registered as
  "SDLC Command Center" (apps/server/src/index.ts:50-52), idempotent by the
  `listProjects().length === 0` guard.

## Open questions
- none — the scan covered db.ts, boot sequence, and recon §A4; no backup wiring exists
  (acceptable at mvp for a re-derivable local store; becomes a real section at production).

## Verdict

**`DATA-MANAGEMENT-LOCKED`**

Tool none (boot DDL + additive ensureColumn), additive-only with argued-irreversible
rollback story, data transforms as idempotent boot backfills, seeds none. Next per the
canonical brownfield order: `/comprehend` (recon §C/§E in hand), then `/architect`.
