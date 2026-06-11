# Brownfield RECOVERY scan — detect the existing data setup, never invent it

Run this BEFORE asking the user anything (Phase 2). The repo already votes; the
job is to read its vote and confirm it. Same citation discipline as `/explore`
and `/comprehend`: **every recovered claim carries a `file:line`; an uncited
guess becomes an Open question, never a policy line.**

Start from `.ai/recon.md` if it exists (Section A names datastores/deploy surface,
Section D names decisions already made) — harvest its citations first, then fill
gaps from disk.

## 1. Migration tool

Look for the tool's anchor file or dependency entry — cite it:

| Signal | Tool family |
| :-- | :-- |
| `alembic.ini`, `migrations/env.py` | Alembic (Python) |
| `prisma/schema.prisma` + `prisma/migrations/` | Prisma Migrate (TS/JS) |
| `knexfile.*`, `migrations/*.js` with `exports.up/down` | Knex (JS) |
| `db/migrate/*.rb`, `schema.rb`/`structure.sql` | Active Record (Rails) |
| `*/migrations/0001_*.py` + Django in deps | Django migrations |
| `migrations/*.sql` + `golang-migrate`/`goose`/`atlas` in go.mod or CI | Go SQL migrators |
| `flyway.conf`, `src/main/resources/db/migration/V*__*.sql` | Flyway (JVM) |
| `liquibase.properties`, `changelog*.xml/yaml` | Liquibase (JVM) |
| `drizzle.config.*` + `drizzle/` | Drizzle (TS) |
| `supabase/migrations/` | Supabase CLI |
| migration deps in `package.json` / `pyproject.toml` / `Gemfile` / `go.mod` | confirm against the dirs above |

Two tools detected (e.g. an old SQL dir + a new ORM dir) → surface it as a direct
question, not a silent pick. Tool found but absent from
`anchor.approved_dependencies` → it is the incumbent: propose adding it via
`dep_adds[]` rather than proposing a replacement.

## 2. Directory + naming pattern

List the migration directory and read 3–5 filenames; derive the pattern from what
is actually there (timestamps vs sequential IDs, separator style, verb-noun vs
free text). Cite the directory plus one exemplar filename. Mixed patterns →
report the split ("14 timestamped, 3 sequential — which is the rule going
forward?") as a question.

## 3. Reversibility evidence

- Down/rollback present? Paired `*.down.sql` files, `down()`/`def downgrade()`
  bodies, or rollback sections — sample 3 migrations and cite one.
- Empty or `raise NotImplementedError` downs are a FINDING ("downs exist but are
  stubs — `migrations/versions/20240301_x.py:18`"), not a confirmation.

## 4. Data migrations + seeds

- Backfill/data-migration files (a separate dir like `data_migrations/`, or schema
  migrations containing `UPDATE`/`INSERT` bulk statements — cite an example of the
  mixing if found; it informs the schema-vs-data rule).
- Seed scripts: `scripts/seed*`, `prisma/seed.*`, `db/seeds.rb`, `fixtures/`,
  `manage.py loaddata` targets, or a CI/compose step invoking one. Distinguish
  dev/test seeds (point `/test-strategy` at them — not this artifact's property)
  from production/reference seeding (lookup tables, default rows).

## 5. Ordering + review wiring

- CI checks on the migrations dir (a workflow step running `migrate`, a lint for
  out-of-order versions, a required review on `migrations/**` in CODEOWNERS) —
  cite the workflow/CODEOWNERS line; this seeds the ordering + review rules.

## 6. Backup / retention wiring (production)

- Backup jobs: cron entries, CI scheduled workflows, IaC resources
  (`aws_db_instance.backup_retention_period`, snapshot policies), `pg_dump` in
  scripts — cite or mark "no wiring found" as an Open question.
- Restore runbooks under `docs/`, `runbooks/`, `ops/`.
- Purge/retention jobs: scheduled tasks deleting old rows, TTL indexes, partition
  drops — these seed the retention table's `deletion_mechanism` column.

## Read-back shape

Present the whole recovered picture in one cited proposal, then confirm per item:

> "Here's what the repo says: migrations via Alembic (`alembic.ini:1`), 23 files in
> `migrations/versions/` named `<timestamp>_<slug>.py` (`…/20250114_add_invoice.py`),
> downs present but two are stubs (`…/20240301_x.py:18`), prod seed at
> `scripts/seed_prod.py:1`, nightly `pg_dump` in `.github/workflows/backup.yml:12`,
> no restore runbook found. Confirm each, or correct me."

The user's corrections win. Anything the scan could not find and the user does not
know → `## Open questions`, never a guess.
