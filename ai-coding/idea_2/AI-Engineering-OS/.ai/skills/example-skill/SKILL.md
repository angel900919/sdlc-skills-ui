---
name: running-migrations
description: >-
  Creates and applies database migrations safely in this repo.
  Use when the user changes a model, adds a table/column, or mentions migrations or schema changes.
---

# Running Migrations

<!-- Example skill (delete). Demonstrates the Guide 03 skeleton: third-person description router,
     must-not-miss rules in the BODY, deterministic work pushed to a script, references one level deep. -->

## ⚠️ Must-not-miss (stays in the body — agents skip reference files)
- NEVER edit a migration that has already shipped — add a new one. (Shipped migrations are immutable.)
- ALWAYS run the advisor before applying: it catches missing indexes and unsafe locks.

## Workflow (in this order)
1. Generate the migration with the repo script (don't hand-write the header):
   !`scripts/new_migration.sh "<short_name>"`
2. Edit the generated `up`/`down`; both must be filled — a migration with no `down` is rejected.
3. Run the advisor, then apply to the shadow DB:
   !`scripts/migrate.sh --check && scripts/migrate.sh --shadow`
4. Only when green, apply to dev.

## Deeper material (loaded only when needed)
- Backfilling large tables without locks → `references/backfills.md`
