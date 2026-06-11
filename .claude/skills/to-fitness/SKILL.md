---
name: to-fitness
description: |-
  Production-tier-only code generator that mechanizes a project's architectural invariants and characteristics (project scope) and a feature's PRD NFRs and Unwanted-behavior EARS defenses (feature scope) into one runnable, CI-executable assertion file per rule under fitness/. Picks the ArchUnit-family library from the anchor language (tsarch, pytest-arch, ArchUnit, ArchGo, ArchUnit.NET), cites the source file and line in every header, enforces red-first discipline, marks fitness/ human-owned in CODEOWNERS, and is idempotent on re-run (orphans listed, never auto-deleted). Generator, not executor — it writes files and emits the test command but never runs it. Use when the user says "/to-fitness", "generate fitness functions", "lock in the architectural rules", after /architect, or at production tier between /design and /plan. Do NOT use for: defining invariants or characteristics (/architect), authoring NFRs (/prd), running the test suite or the gate (/qa), or slicing the build (/plan).
---

<what-to-do>

You are a **pure code generator**. You read architectural rules and write one runnable,
CI-executable assertion file per rule under `fitness/` — each fails the build when a rule is
violated.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (advisory gates, tier dial,
tracker, Talking to the human) before writing. Don't restate it — reference it.

## Critical rules

1. **Production tier only → else `SKIPPED-NON-PRODUCTION`.** Feature mode (`/to-fitness <feature>`): read `tier:` from `.ai/specs/<feature>/prd.md` frontmatter. Project mode (`/to-fitness`, no arg): read `project_tier:` from `.ai/anchor.md` frontmatter. Below `production` → refuse, no tracker append.
2. **Anchor required → `BLOCKED-ON-ANCHOR`.** Library selection depends on `language:`; the security gate carries `codebase_legibility_rules`.
3. **Architecture required → `BLOCKED-ON-ARCHITECT`.** With neither `.ai/architecture/02-components.md § Invariants` nor `.ai/architecture/characteristics.yaml` there is no project-scope input.
4. **PRD required in feature mode → `BLOCKED-ON-PRD`.** `/to-fitness <feature>` with no `.ai/specs/<feature>/prd.md` has no per-feature input; the project-level pass still runs, but say so.
5. **Cite `file:line` in every generated header** — the source artifact + the rule line verbatim. If that source line later disappears, the file is an orphan (rule 9).
6. **Red-first discipline.** Every file carries a `FAILS WHEN:` comment naming a concrete code change that should break the assertion. Can't name one → the rule is vacuous → route it to `## Cannot mechanise` (rule 8), don't write a passing-no-matter-what test.
7. **`CODEOWNERS` protects `fitness/`.** Append `fitness/ @<team>` if not covered (create `CODEOWNERS` if missing). The agent CI runs as a non-human owner — this keeps it out of the rules it is meant to obey. Team from `anchor` (`team:`/`owner:`), else `@<TODO-set-team>` + warn.
8. **`Cannot mechanise` escape valve.** Subjective rules ("API is consistent", "UI feels responsive") have no mechanical form — list them, never fake one. Bounce to `/prd` or `/architect` to rephrase, or accept as a manual review item. Never silently edit an upstream file to make a rule mechanizable.
9. **Idempotent + orphan-safe on re-run.** Existing file whose source citation still matches → leave alone. Citation changed → rewrite cleanly (no backward-compat shim). Source rule deleted → **list as an orphan in the verdict; never auto-delete** — a stale fitness function is often the only surviving record of a removed invariant.
10. **One file per rule; stable, intent-derived names.** Filename = kebab-case of the rule's verb + subject (`no-llm-in-api-handlers.ts`, `p95-latency-invoice-send.py`) — derived from the rule text, not its line number, so source re-orderings don't churn paths. Scopes: project rules → `fitness/<name>`; feature rules → `fitness/<feature>/<name>`; Unwanted-behavior defenses → `fitness/<feature>/<name>-defense`.
11. **Generator, not executor** — write files + emit the test command; never run it. A fitness function that can't fail on known-bad code proves nothing — tell the user to verify red-first before merging.
12. **Author nothing upstream.** You transform existing invariants / characteristics / NFRs into code; you never invent a new rule. A rule that needs rephrasing bounces upstream (rule 8).
13. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer, wait. Adapt to `technical_user` from `.ai/intake.md`. Keep the jargon (fitness function, ArchUnit, invariant, EARS) out of the question.
14. **Advisory gate + tracker.** Issue the real verdict with reasons; an override sets `verdict_overridden: true` + a recorded reason. Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on a success verdict per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
to-fitness progress:
- [ ] Phase 0: Load tracker top 5; detect existing fitness/ (update mode); PRODUCTION tier gate
- [ ] Phase 1: Load anchor + architecture + (feature mode) prd/design
- [ ] Phase 2: Pick the ArchUnit-family library from anchor.language
- [ ] Phase 3: Enumerate rules (per references/rule-sources.md input-source map)
- [ ] Phase 4: Classify each rule (structural / numeric / Cannot mechanise) + red-first sanity
- [ ] Phase 5: Quiz the user — confirm rule→file mapping + FAILS-WHEN clauses
- [ ] Phase 6: Write fitness/ files (idempotent; orphans listed) + update CODEOWNERS + emit test command
- [ ] Phase 7: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker, mode, tier gate
Read `.ai/progress-tracker.md` top 5 (expect `architect landed` for project mode, `design landed (<feature>)` for feature mode). Determine mode: no arg → **project mode** (read `project_tier` from `anchor.md`); `<feature>` arg → **feature mode** (read `tier` from `prd.md`, falling back to `project_tier`). If tier ≠ `production` → `SKIPPED-NON-PRODUCTION` (explain: `/qa` only runs fitness functions at production, so generating them now would be unenforced; if a feature has uplifted, pass that feature). Then detect `fitness/`: if it has files, announce **update mode** (matching citations left alone, changed rewritten, orphans listed).

### Phase 1 — Load inputs
Frontmatter-first, in order:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `language` (+ `framework`), `codebase_legibility_rules`, `team`/`owner` | **BLOCKED-ON-ANCHOR** |
| `.ai/architecture/02-components.md § Invariants` | one fitness function per invariant | (with characteristics also absent) **BLOCKED-ON-ARCHITECT** |
| `.ai/architecture/characteristics.yaml` | `top_3[].fitness_fn` + `measurement` per characteristic | (with invariants also absent) **BLOCKED-ON-ARCHITECT** |
| `.ai/specs/<feature>/prd.md` *(feature mode)* | EARS `verify` tags (T/A mechanizable) + Unwanted-behavior (If/Then) defenses + NFR table | **BLOCKED-ON-PRD** |
| `.ai/specs/<feature>/design.md` *(feature mode)* | measurement source paths (metric names) for numeric NFRs | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

The exact field-by-field input-source map is in [references/rule-sources.md](references/rule-sources.md).

### Phase 2 — Pick the library
Map `anchor.language` → the ArchUnit-family library + default test command + idiom via [references/library-mapping.md](references/library-mapping.md) (tsarch · pytest-arch · ArchUnit · ArchGo · ArchUnit.NET). Prefer a test runner anchor already names. Unrecognized language → ask once; if genuinely none exists, route all rules to `## Cannot mechanise` → `NEEDS-MECHANIZATION`.

### Phase 3 — Enumerate rules
Build one table: `source_path:line` | `kind` (invariant / characteristic / nfr / unwanted / legibility) | `text` (verbatim) | `proposed_filename`. Pull each kind from its source per [references/rule-sources.md](references/rule-sources.md). Reuse the Characteristic→fitness-function→mechanism mappings already in [`../architect/references/characteristics.md` § Fitness function library](../architect/references/characteristics.md) rather than re-deriving them. EARS verification tags (T/I/A/D) are defined in [`../prd/references/ears.md`](../prd/references/ears.md).

### Phase 4 — Classify + red-first sanity
Per rule: **structural** (ArchUnit-style dependency/naming/layering rule, or a legibility grep) · **numeric** (read a measurement artifact and assert against a threshold) · **Cannot mechanise** (needs human judgment). For each mechanizable rule, draft the one-sentence `FAILS WHEN:` (rule 6) — if you can't, demote it to `Cannot mechanise`. Classification detail: [references/rule-sources.md](references/rule-sources.md).

### Phase 5 — Quiz the user
Present the rules-to-mechanize list (filename · source · rule · FAILS-WHEN) and the `Cannot mechanise` list. Ask: filenames OK? FAILS-WHEN clauses sound (or vacuous)? `Cannot mechanise` items — rephrase upstream or accept as manual review? Iterate to approval. If the user rephrases an upstream line, do **not** silently edit it — bounce (rule 8, 12).

### Phase 6 — Write files + CODEOWNERS + command
Create `fitness/` if missing. Write one file per approved rule using the header + idiom from [references/library-mapping.md](references/library-mapping.md) (source citation + FAILS-WHEN + CODEOWNERS note). Idempotent per rule 9; list orphans, never delete. Update `CODEOWNERS` (rule 7). Then emit the test command for the user to run (rule 11) — and, if anchor names a CI workflow path, suggest wiring it there. Do not run it.

### Phase 7 — Tracker + verdict
Append a tracker entry on a success verdict only. Issue exactly one:

- **`READY-FOR-PLAN`** *(feature mode)* — all per-feature NFRs/defenses mechanized or routed to `Cannot mechanise`; project-scope files present or written. Hand off: *"Fitness functions written for `<feature>`. Run `<test command>` to confirm baseline. Next: `/plan <feature>` — slice acceptance can now name `fitness/<feature>/<file>` directly."*
- **`READY-FOR-PRD`** *(project mode)* — all invariants + characteristics mechanized. Hand off: *"Project-scope fitness functions written. Run `<test command>` to confirm baseline. Start the per-feature loop: `/prd <feature>`. The per-feature pass runs on a later `/to-fitness <feature>` at production tier."*
- **`NEEDS-MECHANIZATION`** — `## Cannot mechanise` is non-empty. Name each rule + source; route to `/prd` or `/architect` to rephrase, or accept as manual review.
- **`NEEDS-ORPHAN-CLEANUP`** — files written, but orphans found (source citation no longer matches). Name them; the user confirms deletion (this skill does not auto-delete).
- **`SKIPPED-NON-PRODUCTION`** — tier gate refused.
- **`BLOCKED-ON-ANCHOR → /anchor`** · **`BLOCKED-ON-ARCHITECT → /architect`** · **`BLOCKED-ON-PRD → /prd`** *(feature mode)* — the matching required input is missing.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`fitness/<name>.<ext>`** (project scope) and **`fitness/<feature>/<name>.<ext>`** (feature scope) — runnable ArchUnit-family assertion files, one per rule, each with a `file:line` source citation + a `FAILS WHEN:` comment. **Generated code, not a `.ai/` artifact** — no `ai-schema.md` schema, no `.human` mirror.
- **`CODEOWNERS`** — appended (or created) with `fitness/ @<team>` so `fitness/` is human-owned.

## References
- The input-source map (where each rule kind comes from) + classification + filename derivation + red-first discipline: [references/rule-sources.md](references/rule-sources.md)
- ArchUnit-family library table (language → library → test command → idiom) + generated file-header template + per-language examples: [references/library-mapping.md](references/library-mapping.md)
- Rejection list (vacuous functions, faked mechanization, auto-deletion, upstream edits): [references/anti-patterns.md](references/anti-patterns.md)
- Characteristic → fitness-function → mechanism library to reuse (one-hop): [`../architect/references/characteristics.md`](../architect/references/characteristics.md)
- EARS clauses + T/I/A/D verification tags the feature-mode pass reads (one-hop): [`../prd/references/ears.md`](../prd/references/ears.md)

</supporting-info>
