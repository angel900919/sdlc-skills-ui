---
name: to-issues
description: |-
  Decomposes a per-feature plan into one canonical, tracker-agnostic issue file per slice under .ai/specs (one issues folder per feature), enriching each terse plan slice into a self-contained work contract — file boundary, AFK/HITL classification, tests vs skip-tests, category, target branch, and tier-scaled traceability to PRD functional requirements, user stories, NFRs, and Unwanted-behavior clauses. A pure content generator: writes files only, no tracker side effects (publish-issues pushes to beads, Jira, or markdown). Flips the feature status planned to building. Faithful transformer — never re-authors the plan; thin or untraceable slices bounce back. Use when the user says "/to-issues", "convert plan to issues", "draft tickets", "break the plan into issues", or after /plan. Do NOT use for: publishing to a tracker (/publish-issues), re-slicing (/plan), feature scope (/prd), implementation design (/design), prioritization (/triage), or build execution.
---

<what-to-do>

You decompose `.ai/specs/<feature>/plan.md` into **one canonical issue file per slice** at `.ai/specs/<feature>/issues/SLICE-N.md` — each a self-contained, implementer-ready work contract. You are the **seam between planning and execution**: a pure content generator that writes files only and makes **no tracker writes**. The downstream `/publish-issues` fans the one canonical file out to the backends (**beads** for the machine build loop; **Jira + markdown** for human visibility). You also flip the feature's `status: planned → building` — the commitment moment.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the SLICE-N.md canonical issue schema) before writing. Don't restate them — reference them.

## Critical rules

1. **Plan required → `BLOCKED-ON-PLAN → /plan <feature>`.** No `.ai/specs/<feature>/plan.md` → nothing to convert.
2. **PRD required → `BLOCKED-ON-PRD → /prd <feature>`.** Traceability targets (F-IDs, user stories, NFRs, Unwanted clauses) and the effective `tier:` live there.
3. **Anchor required → `BLOCKED-ON-ANCHOR → /anchor`.** Supplies the default per-slice `language:` and the file-path conventions the AFK-eligibility rules test against.
4. **One issue per slice; stable numbering.** Slice N in `plan.md` → `SLICE-N.md`. Slice 3 stays Slice 3 across update-mode runs (zero-pad to `SLICE-01.md` if > 9 slices).
5. **No tracker writes.** Disk only. If the user says "publish these to Jira/beads", route to `/publish-issues --backend=<beads|jira|md>`.
6. **Tier inherited from `prd.md` frontmatter**, never recomputed. Match traceability depth (user stories at mvp, F-IDs at production) and the per-file line cap to it.
7. **AFK is the default; mark HITL only when an eligibility rule fires** (Phase 2 below) and name the firing rule in `hitl_reason`. **`category: enhancement` is the default**; override to `bug` only for a slice that exists to fix a defect (e.g. spawned by a `/diagnose` verdict).
8. **Tests required by default.** Mark `tests: skip-tests` only when the slice is genuinely trivial (config / docs / one-line glue / dep bump) AND has no branching logic AND is AFK — name the reason in `skip_tests_reason`. HITL slices always run tests.
9. **Schema is the contract.** Frontmatter shape is fixed ([references/template.md](references/template.md) + [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). Tracker-specific fields live only in `backend_refs` (written later by `/publish-issues`) — never leak `jira_epic`/`bd_label`/`assignee` into the canonical frontmatter.
10. **Update mode in-place.** Re-running on an updated plan updates existing files in place — never duplicates, never renumbers. **Preserve `backend_refs` verbatim** (adapters wrote those). A slice dropped from the plan gets `status: removed` + a one-line trailer — **never delete the file** (downstream tracker refs may exist).
11. **Faithful transformer — no re-authoring.** Every acceptance line in an issue appears verbatim in `plan.md`'s slice. Thin acceptance or missing traceability is a plan defect → bounce (`NEEDS-RESLICE` / `BLOCKED-ON-PLAN`); never invent acceptance or traceability here.
12. **Per-file line cap: 80 (60 prototype).** Over → the slice is too big; bounce to `/plan` to split. Don't summarize-to-fit.
13. **No `.human` mirror.** The issue files are machine artifacts; the human view of issues is the Jira ticket / materialized markdown `/publish-issues` produces. The features.md status flip is the only side effect outside the issues folder.
14. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer, wait. Adapt to `technical_user` from `.ai/intake.md`. Keep the jargon (AFK, traceability, EARS, idempotent) out of the question.
15. **Advisory gate + tracker.** Real verdict with reasons; an override sets `verdict_overridden: true` + a recorded reason. Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on `READY-TO-PUBLISH`. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
to-issues progress:
- [ ] Phase 0: Load tracker top 5; detect existing issue files (update mode if present)
- [ ] Phase 1: Load plan (REQUIRED) + prd (REQUIRED → tier + traceability) + anchor (REQUIRED → language, AFK paths); architecture/design warn; inherit tier; announce
- [ ] Phase 2: Per slice — AFK vs HITL (eligibility rules) + category
- [ ] Phase 2.5: Per slice — language (anchor default; override on cross-language slices)
- [ ] Phase 3: Per slice — tests vs skip-tests
- [ ] Phase 4: Per slice — traceability (tier-scaled)
- [ ] Phase 5: Quiz the user (AFK/HITL, language, skip-tests, dependency order)
- [ ] Phase 6: Write SLICE-N.md files (canonical schema, line cap, update-mode in-place)
- [ ] Phase 6.5: Sync features.md status (planned → building)
- [ ] Phase 7: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker + existing files
Read `.ai/progress-tracker.md` top 5 (expect a `plan landed (<feature>)` entry). Look in `.ai/specs/<feature>/issues/`. If files exist, announce **update mode**: existing files updated in place, missing slices added, dropped slices → `status: removed`, numbering preserved, `backend_refs` preserved.

### Phase 1 — Inputs + tier + announce
Load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/specs/<feature>/plan.md` | every slice's name, `depends_on`, files, signatures (prod), satisfies, acceptance | **BLOCKED-ON-PLAN** |
| `.ai/specs/<feature>/prd.md` | effective `tier:`, F-IDs, user stories (mvp+), NFR table (mvp+), Unwanted-EARS (prod, via [`../prd/references/ears.md`](../prd/references/ears.md)) | **BLOCKED-ON-PRD** |
| `.ai/anchor.md` | default `language:`, DB-migration / dependency / human-owned paths for AFK rules, uplift signals ([`../anchor/references/defaults.md`](../anchor/references/defaults.md)) | **BLOCKED-ON-ANCHOR** |
| `.ai/architecture[.md\|/]` | invariants for AFK eligibility (`## Invariants` inline at prototype, `02-components.md` at mvp+) | warn |
| `.ai/specs/<feature>/design.md` | observability / failure modes — HITL signals (auth/secrets/PII paths) | warn |
| `.ai/data-management.md` | `migrations_dir` + review rule for the DB-migration HITL rule | warn |
| `.ai/environments.md` | secret-flagged vars + production-only env paths for the HITL rule | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Inherit the PRD's `tier:`. **Announce:** *"Plan: `invoice-send` (mvp, 4 slices). PRD has 3 user stories, 4 NFRs. Generating canonical issue files at `.ai/specs/invoice-send/issues/SLICE-{1..4}.md` — tracker-agnostic; run `/publish-issues` next. Proceed?"*

### Phase 2 — AFK vs HITL (+ category)
Default **AFK**. Mark **HITL** when ANY fires (name it in `hitl_reason`):

<afk-eligibility-rules>
- **DB migrations / DDL** — slice `files` include migration paths (`.ai/data-management.md`'s `migrations_dir` when that artifact exists, else anchor's DB convention). The HITL gate implements that artifact's `## Migration policy` review rule — cite it in `hitl_reason`.
- **Auth / permissions / secrets / payment** — any PRD tier-uplift trigger path (money / PII / regulated data).
- **A new external dependency** — slice introduces a package not in `anchor.approved_dependencies`.
- **Human-owned paths** — `files` match review-required patterns (`tests/security/**`, `evals/**`, `fitness/**`, or anchor-listed).
- **Secret-bearing config / prod-only env paths** — the slice adds or touches a `secret: yes` var, or a production-only environment path, per `.ai/environments.md` (cite the row in `hitl_reason`).
- **Invariant-touching** — slice behavior directly touches an invariant from architecture.
- **Cross-component wiring** (production) — `files` span multiple components in `02-components.md`.
- **Unwanted-behavior defense slice** (production) — the defense IS the invariant; HITL by default.

Everything else → AFK. **When in doubt, HITL.**
</afk-eligibility-rules>

Set `category: bug` only for a defect-fix slice (rule 7); else `enhancement`.

### Phase 2.5 — Language
Default = anchor's `language:`, stamped on every slice. Override per slice only when its `files[]` target a different language than the project's primary; a mixed-extension slice is a smell → bounce to `/plan` to split. `typescript`/`python` are first-class; other values are accepted with a warning.

### Phase 3 — Tests vs skip-tests
Default `tests: required`. `skip-tests` only when the slice has no branching logic AND is pure config/docs/glue/dep-bump AND is AFK (rule 8). Name the reason.

### Phase 4 — Traceability (tier-scaled)
Pull from PRD/plan — never invent (rule 11):

| Field | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| `satisfies_f_ids` | — | — | ≥1 |
| `satisfies_user_stories` | — | ≥1 | — |
| `satisfies_nfrs` | — | ≥1 | ≥1 |
| `satisfies_unwanted` | — | — | on defense slices |
| `depends_on` | always | always | always |

A slice with no traceability anchor at mvp+ → the plan is broken → bounce to `/plan`.

### Phase 5 — Quiz the user
Present a per-slice list (name · category · AFK/HITL + rule · language · tests · depends_on · satisfies · acceptance count). Ask: AFK/HITL right? language right (any cross-language slice missed/needing split)? skip-tests right? dependency order matches plan? Iterate to approval. Good/bad pairs: [references/examples.md](references/examples.md).

### Phase 6 — Write issue files
Create `.ai/specs/<feature>/issues/` if missing. Write each `SLICE-N.md` from [references/template.md](references/template.md) (full canonical schema). Enforce the line cap; over → bounce (rule 12). **Update mode**: read existing → preserve `backend_refs` → overwrite the rest; removed slices → `status: removed` + trailer, keep the file. No backward-compat shims — change a schema field everywhere.

### Phase 6.5 — Sync features.md status
After all files write successfully, flip the feature's `status` in `.ai/features.md`:
- `planned` → `building` (the commitment moment; append a one-line audit trailer).
- `building` → no-op (update-mode runs).
- `qa-approved` / `shipped` / `deferred` / `never` → **refuse the flip but still write the files** → `NEEDS-STATUS-RESOLUTION → /feature-map`.
- Row missing / no features.md → **warn, continue** (recommend `/feature-map` to add the row).

This is the single side effect outside the issues folder. Lifecycle: `/feature-map` writes `planned`; `/to-issues` flips `planned → building`; `/qa` flips `building → qa-approved`; `/ship` flips `qa-approved → shipped`.

### Phase 7 — Tracker + verdict
Append a tracker entry on `READY-TO-PUBLISH` only. Issue exactly one (prose: [references/verdict-handoff.md](references/verdict-handoff.md)):

- **`READY-TO-PUBLISH → /publish-issues`** — all slices have files, traceability complete, AFK/HITL classified with reasons, schema valid, none over cap, features.md status synced. Hand off: *"Issue files at `.ai/specs/<feature>/issues/`; status `building`. Next: `/publish-issues <feature> --backend=beads` to mint beads for the build loop (or `--backend=jira|md` for human visibility)."*
- **`NEEDS-STATUS-RESOLUTION → /feature-map`** — files valid but the status flip was refused (qa-approved/shipped/deferred/never). Name the conflict + resolution path.
- **`NEEDS-RESLICE`** — a slice is over the line cap, missing traceability, or HITL-eligible with an acceptance so narrow the human's decision is unclear. Name which + fix.
- **`BLOCKED-ON-PLAN → /plan`** — plan missing or not at a build-ready verdict.
- **`BLOCKED-ON-PRD → /prd`** — PRD missing or blocked.
- **`BLOCKED-ON-ANCHOR → /anchor`** — anchor missing.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/issues/SLICE-N.md`** — MACHINE-facing canonical issue files, one per slice, tracker-agnostic. Frontmatter index + `## What to build` / `## Acceptance criteria` / `## Traceability` / `## Blocked by`. Read by `/publish-issues`, the four `mtdd-*` skills, and `/qa`. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **The `.ai` file is the immutable source** — runtime status (`## Status log` / `## Completion`) is written to the bead (`bd note`) or the published md copy by the loop, never back here. **No diagrams, no `.human` mirror.**
- **`.ai/features.md`** — the `planned → building` status flip (the only side effect outside the issues folder).

## References
- Canonical SLICE-N.md schema (frontmatter + body): [references/template.md](references/template.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- AFK/HITL · traceability · faithful-transform good/bad pairs: [references/examples.md](references/examples.md)
- Verdict-specific hand-off prose + recovery paths: [references/verdict-handoff.md](references/verdict-handoff.md)
- EARS clauses the production traceability points at (one-hop): [`../prd/references/ears.md`](../prd/references/ears.md)
- Tier-uplift signal list for AFK eligibility (one-hop): [`../anchor/references/defaults.md`](../anchor/references/defaults.md)

</supporting-info>
