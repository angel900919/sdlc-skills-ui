---
name: anchor
disable-model-invocation: true
description: |-
  Locks a project's foundation — the stack, tier, and lifecycle stage every downstream skill reads first. Reads intake's predicted tier as the default and confirms it (never asks the tier cold), honors intake's uplift signals instead of re-scanning, adapts depth to the user's technical level, scans the repo on brownfield, and accepts "I don't know" with safe tentative defaults. Writes the machine foundation to .ai/anchor.md plus a plain-English mirror to .human/summaries/anchor.md, and seeds the progress tracker and root CLAUDE.md. Use when the user says "/anchor", "anchor this project", "lock the stack", "pick the stack and tier", "create anchor.md", or when .ai/anchor.md does not exist after /feature-map. Do NOT use for: per-feature decisions (/prd, /design), domain modeling (/understand), idea validation (/discovery), high-level architecture (/architect), or advancing the tier (/promote).
---

<what-to-do>

You lock the **project foundation** — the immovable stack decisions plus the tier — that every downstream skill (`/architect`, `/prd`, `/design`, `/bootstrap`) reads before it does anything. Intake *predicted* the tier; you *confirm and lock* it. You ask only what the tier requires, accept "I don't know" with safe defaults, scan the repo first on brownfield, and write a machine artifact plus a plain-English mirror the human signs off on.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/anchor.md` schema) before writing. Don't restate them — reference them.

## The locking model (read this first)

Anchor is **decide-and-lock**, not deliberate-and-compare. Each input is the source of truth for one thing:

- **`.ai/intake.md` = the orchestration index — read it first.** `predicted_tier` is the **default** for the tier confirmation (never ask the tier cold). `technical_user` sets question depth and jargon. `uplift_signals` are **honored as given** — do NOT re-scan the description for uplift. `project_type` decides whether you scan the repo.
- **`.ai/features.md` = the roster** — sizes tier-relevant choices (how broad `approved_dependencies` is, whether AI is genuinely in the core path, whether the stack must carry N features).
- **`.ai/anchor.md` (if it exists) = update mode** — re-elicit only the fields the user names; preserve the rest, and never move `lifecycle_stage`/`project_tier` (that's `/promote`'s job).

If `.ai/intake.md` is missing, the project isn't defined enough to anchor → `BLOCKED-ON-DISCOVERY → /discovery`. Nothing written.

## Critical rules

1. **Intake predicts the tier; anchor locks it.** Read `predicted_tier` as the default, confirm with the user in plain words, then write the locked `project_tier`. Never ask the tier cold. An `/anchor` re-run never bumps the tier.
2. **`lifecycle_stage` mirrors `project_tier`; only `/promote` advances it.** Seed `lifecycle_stage == project_tier` plus the first `stage_history` entry. Advancing prototype→mvp→production is a gated decision owned by `/promote` — never a manual edit or an anchor re-run. If the user asks to "bump to production" here, tell them to run `/promote` first, then re-run `/anchor` to fill the new tier's fields. (`stage: anchor` is the unrelated producer marker — leave it.)
3. **Honor intake's uplift signals — don't re-scan.** Carry `uplift_signals` from `.ai/intake.md` verbatim into the frontmatter and the look-ahead. If a *new* signal genuinely surfaces in conversation, add it and tell the user. Canonical signal list + bump rules: [references/defaults.md](references/defaults.md).
4. **Adapt to `technical_user`.** Non-technical → pick stack defaults, mark them tentative, and don't ask stack questions; confirm the *outcome* in plain English. Technical → invite the real stack choices. Never use jargon the user hasn't used.
5. **Tier dial.** Ask only the fields the tier requires (prototype ≈ 5 → mvp ≈ 13 → production full set). See [references/tier-matrix.md](references/tier-matrix.md). Never ask production-grade questions (judge≠drafter, eval framework, security gate) below production. Hard line caps: 40 / 100 / 200.
6. **"I don't know" is a first-class answer.** Pick the default from [references/defaults.md](references/defaults.md), set `<field>_tentative: yes` in frontmatter, annotate the `why:` line `(tentative)`, and add a TODO. All three paths, every time.
7. **Brownfield: scan first, propose, ask second.** If `project_type=brownfield`, read what's on disk and propose the detected stack as defaults — don't re-ask what's already there. Detection signals: [references/defaults.md](references/defaults.md). At mvp+, seed `approved_dependencies` from direct deps (exclude transitive).
8. **AI block only if LLMs are in the core path.** Devtools don't count. If unclear, ask once: *"Do users see LLM output, or does the system make decisions with an LLM in production?"* No → skip the block at every tier.
9. **`approved_dependencies` allowlist at mvp+.** Seed from the locked stack (greenfield) or direct deps (brownfield). Read by `/design` to bias toward reuse over hallucinated packages. Growing it is a deliberate act.
10. **Never overwrite without asking.** For `.ai/anchor.md`: if present, restate it and ask which fields to update (update mode). For root `CLAUDE.md`: if present, write `CLAUDE.md.suggested` — never clobber.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommendation, wait for the answer, no wall of questions. Stack terms (framework, ORM, auth provider, NFR) are fine *only* with a technical user; for everyone else, confirm the outcome in plain words (rule 4).
12. **Read back before writing.** Paste the assembled frontmatter + body; ask *"where did I misrepresent you? Anything to flip from tentative to locked?"* Edit for fidelity.
13. **Two registers.** `.ai/anchor.md` is structured (YAML index + `key: value` body, no diagrams). `.human/summaries/anchor.md` is the plain-English sign-off mirror (optional simple diagram via the **mermaid skill**). Diagrams live in `.human/` only.
14. **The gate is advisory.** Issue the real verdict with reasons; the user may override on the record (`verdict_overridden: true` + reason). Never block silently.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before writing.

## Procedure

Copy this checklist:

```
anchor progress:
- [ ] Phase 0: Load intake (tier+technical_user+uplift+type) + features + tracker top 5; detect existing anchor.md (update mode if present)
- [ ] Phase 1: Confirm the tier (intake predicted_tier = default) → lock project_tier; seed lifecycle_stage + stage_history; confirm AI-in-core-path
- [ ] Phase 2: Brownfield scan (if brownfield) — propose detected stack
- [ ] Phase 3: Tier-gated stack elicitation incl. release_policy (adapt depth to technical_user; "I don't know" → default + tentative)
- [ ] Phase 4: AI block (only if AI=yes), tier-gated
- [ ] Phase 5: Uplift look-ahead from intake.uplift_signals (no re-scan)
- [ ] Phase 6: Read back; scan anti-patterns; collect corrections
- [ ] Phase 7: Enforce tier line cap; write .ai/anchor.md + .human/summaries/anchor.md
- [ ] Phase 8: Seed root CLAUDE.md (or CLAUDE.md.suggested); seed/append progress-tracker; issue verdict
```

### Phase 0 — Session context + mode
Read `.ai/intake.md` frontmatter first: `slug`, `predicted_tier`, `technical_user`, `project_type`, `uplift_signals`. Missing → `BLOCKED-ON-DISCOVERY → /discovery`; stop. Read `.ai/features.md` frontmatter for the roster (tier, in-scope count, P0). Read `.ai/progress-tracker.md` top 5; seed from the [`../_shared/conventions.md`](../_shared/conventions.md) stub if absent. Read `.ai/anchor.md` — if present, restate the stack in 3–5 lines, ask which fields to update, and switch to **update mode** (rule 10): preserve everything not named, and never touch `lifecycle_stage`/`project_tier`/`stage_history`.

### Phase 1 — Confirm + lock the tier
State intake's prediction and confirm it (rule 1): *"Intake predicted `<predicted_tier>` because [reason]. Lock that, or adjust?"* Write the result as `project_tier`. Seed `lifecycle_stage` to the same value (the frontmatter `lifecycle_stage` is the single source of truth for the current stage; the body `current:` line only restates it) and the first `stage_history` entry in the canonical one-shape form: `{ from: none, to: <tier>, date: <today>, by: /anchor, rationale: initial stage set by /anchor, overridden: false }`. Then confirm AI-in-core-path (rule 8) → `ai_in_core_path`.

### Phase 2 — Brownfield scan (skip for greenfield)
Read what's on disk and propose the detected stack as defaults (rule 7). Signals table: [references/defaults.md](references/defaults.md). Restate: *"I see [stack]. Lock these in?"* — let the user override per field. At mvp+, seed `approved_dependencies` from direct deps and restate the count. Also propose `release_policy.branching` from what the repo suggests (`.mtdd/config` `mtdd_target_branch`, the branch listing) and `release_policy.versioning` from existing `v*` tags — detection rows in [references/defaults.md](references/defaults.md).

### Phase 3 — Tier-gated stack elicitation
Ask only the fields the tier requires ([references/tier-matrix.md](references/tier-matrix.md)), adapting depth to `technical_user` (rule 4). For each "I don't know", use the default and mark tentative (rule 6). Pull phrasing from [references/probes.md](references/probes.md) when stuck.

The **`release_policy` group** (versioning scheme, tag pattern, branching model, hotfix path) rides this pass: at prototype, default it silently (versioning `none`, branching from the Phase-2 detection or `trunk`) — ask nothing; at mvp+, **one or two questions max** (versioning — the tag pattern follows from it; confirm the proposed `hotfix_path` for a P0 production defect). "I don't know" gets the usual default + tentative treatment. Defaults + the hotfix-path default text: [references/defaults.md](references/defaults.md).

### Phase 4 — AI block (only if AI=yes)
Tier-gated (rule 5). prototype: provider + model. mvp: + cost ceiling. production: + drafter / classifier / judge (**judge MUST differ from drafter**), eval framework, trials, transparency policy. Defaults + judge-≠-drafter rule: [references/defaults.md](references/defaults.md).

### Phase 5 — Uplift look-ahead
Carry `uplift_signals` from intake into the frontmatter and the `## Uplift look-ahead` body (rule 3) — **no re-scan**. Note what `/architect` should pre-size for. If a new signal surfaces in conversation, add it and say so. This never auto-bumps `project_tier` (that's `/promote`); it's a heads-up for `/architect` and per-feature `/prd` uplift.

### Phase 6 — Read back
Assemble the draft using the schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md) and the worked shapes in [references/examples.md](references/examples.md). Scan against [references/anti-patterns.md](references/anti-patterns.md) and strip any symptoms. Paste; ask *"where did I misrepresent you? Anything to flip from tentative to locked?"* Edit for fidelity.

### Phase 7 — Write the artifacts
Enforce the **tier line cap** first (40 / 100 / 200); over cap → cut non-required fields or route to `/promote` for a real tier bump. Then write both:
1. **`.ai/anchor.md`** — structured per [`../_shared/ai-schema.md`](../_shared/ai-schema.md): frontmatter index (slug, stage, status, project_type, project_tier, lifecycle_stage, ai_in_core_path, uplift_signals, approved_dependencies, tentative_fields, verdict, links, `consumed_by`) + Lifecycle / Stack / AI / Approved dependencies / Release policy / Security gate / Observability / Uplift look-ahead / TODO. No diagrams.
2. **`.human/summaries/anchor.md`** — one-sentence "here's the stack we locked"; 3–6 plain bullets (stack + why, what's tentative, the lifecycle line); an OPTIONAL simple stack/context diagram via the **mermaid skill** only if it genuinely helps; link back to `.ai/anchor.md`. See [references/examples.md](references/examples.md).

### Phase 8 — CLAUDE.md, tracker, verdict
**Seed root `CLAUDE.md`** from [references/project-claude-template.md](references/project-claude-template.md) (substitute `{{PROJECT_NAME}}` / `{{ONE_LINE_DESCRIPTION}}` — see that file). No `CLAUDE.md` → write it. Exists → write `CLAUDE.md.suggested` instead (rule 10). Update mode with a `CLAUDE.md` already from anchor → skip silently. Note the outcome (`seeded`/`suggested`/`skipped`) in the tracker entry.

**Tracker:** append on success per the [`../_shared/conventions.md`](../_shared/conventions.md) format. On an update-mode re-run, append an `anchor re-run` entry naming which fields changed (skip if nothing changed).

**Verdict:** issue exactly one (extended hand-off prose: [references/hand-off.md](references/hand-off.md)):

- **READY-FOR-ARCHITECT** — anchor written. If ≥1 required field is tentative, the verdict is **still** READY-FOR-ARCHITECT — list the tentatives explicitly in the hand-off and tell the user to revisit before a tier bump. Always add the lifecycle line: *"This project is at stage `<tier>`; run `/promote` to advance — don't bump the tier by hand."* Hand-off branches on `project_type` (greenfield → `/architect` → `/bootstrap` → per-feature loop; brownfield → `/explore` → `/comprehend` → `/architect`), with the uplift-signals append when signals fired.
- **BLOCKED-ON-DISCOVERY → /discovery** — no `.ai/intake.md`, or the project is too fuzzy to answer Phase 1. Nothing written; state why.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason in the artifact, and route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/anchor.md`** — MACHINE-facing foundation. Frontmatter index + structured body; the highest-fan-out artifact in the chain (`/architect`, `/prd`, `/design`, `/bootstrap`, `/promote` all read it). Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). No diagrams.
- **`.human/summaries/anchor.md`** — HUMAN-facing sign-off mirror. Plain-English stack + why + tentatives + the lifecycle line; optional simple diagram via the mermaid skill.
- **seeds** `.ai/progress-tracker.md` (append-only log) and root **`CLAUDE.md`** (or `CLAUDE.md.suggested`).

## References
- Field-by-tier matrix + line caps: [references/tier-matrix.md](references/tier-matrix.md)
- Defaults map, per-language overrides, brownfield detection, uplift signals, "I don't know" pattern: [references/defaults.md](references/defaults.md)
- Elicitation question bank (one at a time): [references/probes.md](references/probes.md)
- Anti-patterns to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Good-vs-bad shapes + a full worked `anchor.md` + the human mirror: [references/examples.md](references/examples.md)
- Verdict hand-off prose (greenfield/brownfield/uplift/blocked): [references/hand-off.md](references/hand-off.md)
- Root `CLAUDE.md` seed template: [references/project-claude-template.md](references/project-claude-template.md)

## Update mode — backfilling a legacy anchor
A legacy `.ai/anchor.md` missing `lifecycle_stage` (seed it to equal `project_tier` + a backfilled `stage_history` note) or `release_policy` (e.g. when `/diagnose` or `/ship` asks for the hotfix path) is backfilled from [references/defaults.md](references/defaults.md) — add just that group, touch nothing else. (General update-mode preservation is rule 10 + Phase 0.)

## Slugging
Reuse the upstream `slug` from `.ai/intake.md` for the artifact — never re-slug. Anchor writes a single `.ai/anchor.md` at the repo root (not per-feature).

</supporting-info>
