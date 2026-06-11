---
name: data-management
description: |-
  Writes .ai/data-management.md — the project-level data policy: the migration tool and conventions, the reversibility rule, and (at production) backup/restore, retention/PII lifecycle, and the zero-downtime rule. Runs once after /architect when the architecture names a datastore; brownfield runs in recovery mode (detects the existing setup with file:line citations, never inventing). Use when the user says "/data-management", "migration policy", "data management", "backup strategy", "data retention", "how do migrations work here", or "rollback a migration". Do NOT use for: per-feature schema deltas (/design), writing or running migrations (the build phase), choosing the database (/anchor), or dev/test fixtures and seeds (/test-strategy).
---

# Data management — the migration policy + data lifecycle lock

<what-to-do>

You lock the **project data policy** — the migration policy (tool, directory, naming,
reversibility, schema-vs-data distinction, ordering, review rule), the
production/reference seed boundary, and at production the backup/restore procedure,
the per-entity retention + PII lifecycle, and the zero-downtime rule — into
`.ai/data-management.md`, which `/design`, `/to-issues`, and `/ship` read.
You write policy; you never write, run, or revert a migration, and you never
perform a backup or restore.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory
gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md)
(the `.ai/data-management.md` schema) before writing. Don't restate them — reference them.

## Critical rules (read before starting)

1. **Policy, never execution.** No migration files, no `migrate up/down` runs (build
   phase / mtdd loop), no backups or restores (ops/human), no feature schema deltas
   (`/design`), no database choice (`/anchor`). This skill's only side effects are the
   artifact file(s) and a tracker append.
2. **Anchor required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`. It supplies
   `project_tier` (INHERIT — never recompute), `project_type`, `db`,
   `uplift_signals`, and `approved_dependencies`.
3. **Architecture required + datastore gate.** No `.ai/architecture[.md|/]` →
   `BLOCKED-ON-ARCHITECT → /architect`. If the architecture's components and
   "where data lives" determination name **no datastore** (and anchor has no `db`)
   → `SKIPPED-NO-DATASTORE`, write nothing — there is no data to manage.
4. **Brownfield = RECOVERY mode: detect, cite, confirm — never invent.** Scan the
   repo per [references/brownfield-recovery.md](references/brownfield-recovery.md)
   for the existing migration tool, directory, naming pattern, seed scripts, and any
   backup wiring; propose every detected fact with a `file:line` citation and let the
   user confirm or correct. An uncited guess becomes an Open question, never a policy line.
5. **The migration tool is governed.** Bias toward what `anchor.approved_dependencies`
   (or the detected repo) already carries. A new tool is flagged in `dep_adds[]` for
   anchor to adopt — **never silently added** (same contract as `/design`).
6. **Reversibility rule.** Every schema migration ships a down/rollback, OR carries an
   explicitly argued irreversible flag (the argument recorded in the artifact — e.g.
   a destructive column drop after the expand-migrate-contract window). Silence is
   not an option; this is the rule `/design`'s "rollback (always)" and `/ship`'s
   reversible-migrations check read.
7. **Schema migrations ≠ data migrations.** Data migrations (backfills, transforms)
   are separate files, idempotent, and replayable; they never hide inside a schema
   migration. Record the ordering/concurrency rule (sequential IDs vs timestamps +
   the merge-conflict policy) and the review rule (who/what gates a migration before
   merge — this is what `/to-issues`' DB-migration HITL classification enforces).
8. **Seed-data boundary.** Dev/test seeds belong to `/test-strategy`. If
   `.ai/test-strategy.md` exists, the Seed data section is ONE pointer line to its
   `## Seed data` — no duplication. This artifact owns only production/reference
   data seeding (lookup tables, default rows), if any.
9. **Never give legal advice.** Retention periods, deletion mechanisms, and
   legal-basis notes record the **user's decision** and are flagged for human legal
   review — the skill proposes common practice as a draft, never as an interpretation
   of law. The Retention & PII lifecycle section is **mandatory** when `pii` or
   `regulatory` is in `anchor.uplift_signals` (production tier).
10. **Tier dial + hard line caps 90 / 185 / 250.** prototype: offer
    `SKIPPED-PROTOTYPE`; if the user insists, a ≤90-line minimal policy (tool +
    naming + reversibility only). mvp: migration policy + seed pointer. production:
    full — adds backup & restore, retention & PII lifecycle, zero-downtime rule, and
    the `.human` mirror. Over cap → prune detail, never drop a required section.
11. **Update mode.** If `.ai/data-management.md` exists, restate it (tool, naming,
    retention rows), ask which sections to refresh, change only those, preserve the
    rest — e.g. a new entity adds one retention row, a backup test updates one date.
12. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking
    to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions)
    — one question at a time, always with a proposed answer, adapted to
    `technical_user` from `.ai/intake.md`. Say "a script that changes the database's
    shape, plus its undo," not "DDL migration with a down," to a non-technical user.
13. **Two registers.** `.ai/data-management.md` is structured (frontmatter index +
    fixed-order sections, no diagrams). At **production only**, also write
    `.human/summaries/data-management.md` — 3–6 plain bullets + ONE validated Mermaid
    diagram (the migration lifecycle flowchart) via the **mermaid skill**.
14. **Advisory gate + tracker + one verdict.** Issue the real verdict with reasons; an
    override sets `verdict_overridden: true` + the recorded reason. Read
    `.ai/progress-tracker.md` top 5 at Phase 0; append one entry **only** on
    `DATA-MANAGEMENT-LOCKED`. Exactly one verdict per run.

## Procedure

Copy this checklist:

```
data-management progress:
- [ ] Phase 0: Tracker top 5; detect existing data-management.md (update mode if present)
- [ ] Phase 1: Load anchor (REQUIRED) + architecture (REQUIRED) + context/recon/test-strategy/intake; gates incl. datastore check; announce tier + mode
- [ ] Phase 2: Prototype offer (SKIPPED-PROTOTYPE) / brownfield RECOVERY scan (cited proposal)
- [ ] Phase 3: Migration policy (tool governed · dir + naming · reversibility · schema-vs-data · ordering · review rule)
- [ ] Phase 4: Seed data (pointer to test-strategy; production/reference seeds only)
- [ ] Phase 5: Backup & restore + Retention & PII lifecycle + zero-downtime rule [production]
- [ ] Phase 6: Read back; confirm no invented brownfield fact and no legal interpretation
- [ ] Phase 7: Write .ai/data-management.md (tier cap) + .human mirror at production (mermaid skill)
- [ ] Phase 8: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker + mode
Read `.ai/progress-tracker.md` top 5 (expect `architect landed`; maybe `bootstrap` or
`explore`). If `.ai/data-management.md` exists → **update mode** (rule 11): restate,
ask what changed (usually "new entity needs a retention row," "we tested the backup,"
or "the migration tool changed"), touch only that.

### Phase 1 — Load inputs + gates
Frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (INHERIT), `project_type`, `db`, `uplift_signals`, `approved_dependencies` | **BLOCKED-ON-ANCHOR** |
| `.ai/architecture[.md\|/]` | components + "where data lives" determination → the datastore gate (rule 3) | **BLOCKED-ON-ARCHITECT** |
| `.ai/context.md` | entities → the retention-table rows (production) | warn |
| `.ai/recon.md` | brownfield: repo shape + decisions seed the RECOVERY scan | warn (brownfield) |
| `.ai/test-strategy.md` | `## Seed data` → the pointer (rule 8) | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

No datastore in the architecture's components and no `db` in anchor →
`SKIPPED-NO-DATASTORE`; write nothing, stop. **Announce:** *"Anchor: tier `mvp`,
brownfield, db Postgres. Running mvp-tier data-management: migration policy + seed
pointer, ≤185 lines, recovery mode (I'll scan the repo first). Proceed?"*

### Phase 2 — Tier offer / RECOVERY scan
- **prototype:** offer the skip — *"At prototype tier I'd skip the data policy: the
  migration tool's defaults are enough until real data exists. Skip, or write the
  minimal version (tool + naming + reversibility, under 90 lines)?"* Skip →
  `SKIPPED-PROTOTYPE` (nothing written). Insist → Phases 3 + 6–8 only, ≤90 lines.
- **brownfield (any tier):** run the RECOVERY scan per
  [references/brownfield-recovery.md](references/brownfield-recovery.md) before
  asking anything. Present the detected picture as a cited proposal (*"You migrate
  with Alembic — `alembic.ini:1`; 23 migrations in `migrations/versions/`, timestamp-
  named; `scripts/seed_prod.py:1` seeds the lookup tables — confirm?"*) and let the
  user correct per item. Unfindable facts (e.g. whether backups exist at all) become
  direct questions; still-unknown → Open questions, never guesses.
- **greenfield:** propose the conventional setup for anchor's `db` + framework
  (the migration tool the locked framework ships with, its default directory) —
  staying inside `approved_dependencies` per rule 5.

### Phase 3 — Migration policy
Settle, one question at a time, each with a proposed answer:
- **Tool** — governed per rule 5; a tool outside `approved_dependencies` → `dep_adds[]`, flagged loudly.
- **Directory + naming convention** — the exact path and filename pattern
  (e.g. `migrations/` + `YYYYMMDDHHMMSS_verb_noun`).
- **Reversibility rule** — per rule 6: down required, or the argued-irreversible escape
  hatch and what an argument must contain.
- **Schema vs data migrations** — per rule 7: separate, idempotent, replayable; where
  data migrations live.
- **Ordering/concurrency** — sequential IDs vs timestamps; what happens when two
  branches both add a migration (the merge-conflict policy).
- **Review rule** — who/what gates a migration before merge (e.g. "any slice touching
  the migrations dir is HITL; a human reviews the down before merge") — the rule
  `/to-issues`' DB-migration HITL classification cites.

### Phase 4 — Seed data
If `.ai/test-strategy.md` exists: write the ONE pointer line (rule 8) and move on.
Then ask once: *"Does production need rows to exist before the app works — lookup
tables, default settings, an admin account?"* If yes, record what, where the seed
lives, and when it runs (e.g. "after migrations on deploy, idempotent"). If no:
`production_seeds: none`.

### Phase 5 — Backup & restore · Retention · Zero-downtime [production]
- **Backup & restore:** what is backed up · frequency · where it lands · the restore
  procedure pointer (a runbook path or "provider console — documented at X") · the
  `last_tested:` date field (never tested → `never` + an Open question, not silence).
- **Retention & PII lifecycle** — mandatory when `pii`/`regulatory` fired (rule 9):
  one row per entity from `.ai/context.md` — entity · retention period · deletion
  mechanism · legal-basis note (the user's recorded decision, flagged
  `confirm with legal counsel`). Plus the data-export / right-to-erasure note: how a
  user's data gets exported or erased on request, or an Open question if undecided.
- **Zero-downtime rule:** the expand-migrate-contract expectation for breaking schema
  changes (add the new shape → migrate data → contract the old shape in a later
  release; never a destructive change in one step while the old code runs).

### Phase 6 — Read back
Assemble from [references/template.md](references/template.md). Check: every
brownfield claim cited; no legal interpretation stated as fact (rule 9); the seed
section is a pointer, not a copy. Paste; ask: *"Is this how migrations should work
here? Any retention period wrong? Where did I misrepresent you?"* Their corrections win.

### Phase 7 — Write the artifacts
1. **`.ai/data-management.md`** — per the schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md);
   enforce the tier line cap (90/185/250). Update mode preserves untouched sections.
2. **`.human/summaries/data-management.md`** (production only) — one plain sentence
   ("here is how this project's data changes shape, gets backed up, and gets
   deleted"), 3–6 jargon-free bullets, ONE validated Mermaid migration-lifecycle
   flowchart via the **mermaid skill**, link back to the `.ai` file.

### Phase 8 — Tracker + verdict
Append a tracker entry on `DATA-MANAGEMENT-LOCKED` only (per
[`../_shared/conventions.md`](../_shared/conventions.md); update-mode runs note which
sections changed). Issue exactly one verdict:

| Verdict | When | Hand-off |
|---|---|---|
| `DATA-MANAGEMENT-LOCKED` | artifact written (first run or update) | *"Data policy locked: tool X, downs required, N retention rows. Next: `/prd` for the next feature — or the next unrun foundation skill (`/test-strategy`, `/environments`) first. Re-run `/data-management` when an entity, a backup test, or the tool changes."* |
| `SKIPPED-NO-DATASTORE` | architecture names no datastore and anchor has no db | nothing written; *"Re-run after `/architect` adds a datastore component."* |
| `SKIPPED-PROTOTYPE` | prototype tier, user took the skip | nothing written; *"Re-run when real data exists — or after `/promote`."* |
| `BLOCKED-ON-ARCHITECT → /architect` | `.ai/architecture[.md\|/]` missing | nothing written |
| `BLOCKED-ON-ANCHOR → /anchor` | `.ai/anchor.md` missing | nothing written |

If the user overrides a negative verdict, set `verdict_overridden: true`, record the
reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/data-management.md`** — MACHINE-facing data policy (schema in
  [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). No diagrams. Read by `/design`,
  `/to-issues`, and `/ship`.
- **`.human/summaries/data-management.md`** (production only) — plain-English mirror +
  ONE validated migration-lifecycle flowchart via the mermaid skill.

## References
- Skeleton + retention-table + human-mirror shape: [references/template.md](references/template.md)
- Brownfield RECOVERY scan checklist: [references/brownfield-recovery.md](references/brownfield-recovery.md)

</supporting-info>
