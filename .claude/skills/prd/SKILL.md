---
name: prd
disable-model-invocation: true
description: |-
  Writes the per-feature PRD — the contract that /design, /plan, and /to-fitness consume — to .ai/specs (one folder per feature). Reads the locked project_tier from anchor and computes the effective tier as the max of the project tier and any feature uplift, scaling a prototype one-pager up to a production EARS contract with strict SMART checks and invariant defenses. Stays implementation-agnostic: the stack lives in anchor, components and invariants in architecture; it references both and decides neither. At mvp and above it also writes a derived plain-English mirror under .human/specs for sign-off. Use when the user says "/prd", "write the PRD for X", "draft requirements for X", "feature brief for X", or "spec out a feature", or after /architect names a feature. Do NOT use for: high-level architecture or components (/architect), stack and tier lock (/anchor), per-feature implementation, schemas, or API contracts (/design), idea validation (/discovery), or domain modeling (/understand).
---

<what-to-do>

You write the **per-feature PRD** — the WHAT a single feature must deliver — to `.ai/specs/<feature>/prd.md`. It is the contract `/design` (HOW), `/plan` (slices), and `/to-fitness` (NFR→fitness functions) all read. You are the entry point to the per-feature loop, run once per feature after `/architect`.

PRDs are **implementation-agnostic**. The stack is locked in `.ai/anchor.md`; the architecture (components, style, ADRs, invariants, characteristics) is in `.ai/architecture[.md|/]`. You reference both and re-decide neither — if a feature needs a decision in neither, the verdict is `BLOCKED-ON-ARCHITECTURE`.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human, the derived-mirror rule) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/specs/<feature>/prd.md` schema) before writing. Don't restate them — reference them.

## The two-register model (read this first)

- **`.ai/specs/<feature>/prd.md` holds the CONTRACT** — frontmatter index + fixed-order sections + structured requirements (user stories, NFR tables, EARS clauses). This is what `/design`, `/plan`, and `/to-fitness` read. No diagrams.
- **`.human/specs/<feature>/prd.md` is a DERIVED mirror, written at mvp+ only** — a lossy plain-English projection (scope + success + top risks + verdict + an optional journey diagram via the mermaid skill) for human sign-off, especially non-technical stakeholders. It is **rendered from the `.ai` file, never hand-authored**; if the two disagree, `.ai` wins. Per [`../_shared/conventions.md` § Human summaries](../_shared/conventions.md). At **prototype** the PRD is a one-pager — read the `.ai` file directly and the read-back conversation is the sign-off gate; **no mirror**.

## Critical rules

1. **`anchor.md` is required for the tier; architecture is required at mvp+.** No `anchor.md` or no `project_tier` → `BLOCKED-ON-ANCHOR → /anchor`; nothing written. The chain is `architect → prd`, so at **mvp/production** `.ai/architecture[.md|/]` must exist → `BLOCKED-ON-ARCHITECTURE → /architect` if missing. At **prototype** architecture may be a thin single file or skipped → warn and proceed (the PRD won't honor invariants/characteristics; `/design` catches placement). This keeps the reads table and the verdict consistent.
2. **No new architecture decisions.** Stack/framework/db/hosting are in `anchor.md`; components/style/ADRs/invariants are in `architecture`. If the feature needs a decision in neither → `BLOCKED-ON-ARCHITECTURE`; don't improvise.
3. **Tier is computed, never asked.** `tier = max(project_tier, feature_uplift)`. Read `project_tier` from `anchor.md` (LOCKED) and the feature's row in `.ai/features.md` (feature-map may already have uplifted it); re-scan the description for uplift signals using **[`../anchor/references/defaults.md`](../anchor/references/defaults.md)** (define-once — anchor owns the canonical list; do not duplicate it). Announce the computed tier and what fired before proceeding. The user may override in plain language; downgrades warn loudly.
4. **Honor architectural invariants and characteristics.** When architecture is loaded, every functional req respects the invariants, and (production) every NFR aligns with the top-3 characteristics. Surface conflicts explicitly; never silently violate. At **production**, every in-scope invariant must be *actively defended* by ≥1 EARS Unwanted-behavior clause — see [references/ears.md](references/ears.md).
5. **Implementation belongs in `/design`.** No file paths, class names, schemas, or wire-level API contracts — capabilities and behaviors only. Narrow exception — **prototype-snippet inlining**: a snippet from a *tested* prototype that encodes a decision more precisely than prose (state machine, reducer, schema type, prompt template) may be inlined inside the relevant requirement, trimmed to the decision-rich lines, tagged `(from prototype)`. Never invent code to inline.
6. **NFRs are numbers with measurements.** Reject "fast", "secure", "scalable" — require metric + threshold + how-measured. Shapes: [references/examples.md](references/examples.md).
7. **Production functional reqs use EARS; SMART check is tier-gated.** Production = EARS syntax (no free prose) + strict SMART (blocks the write on failure). mvp = prose reqs + soft SMART (warn, proceed). prototype = skip SMART. EARS templates + decision tree: [references/ears.md](references/ears.md); SMART procedure: [references/smart.md](references/smart.md).
8. **Tier line caps (hard): 90 / 185 / 250.** Over cap → the feature is two features; cut to the JTBD-critical, split, and run `/prd` again for the second slice. Per-tier section matrix: [references/tier-matrix.md](references/tier-matrix.md).
9. **Mirror at mvp+ only, derived.** prototype → no `.human` mirror. mvp/production → write a derived `.human/specs/<feature>/prd.md` (rule above). Set `human_summary` in the `.ai` frontmatter only when the mirror is written.
10. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer, wait. Adapt to `technical_user` from `.ai/intake.md`. Capture the user's plain words; render them as the structured req only in the `.ai` artifact — never push EARS/NFR jargon back into the question.
11. **Feature must be on the roster — don't invent one.** Confirm `<feature>` is a row in `.ai/features.md`. If it isn't, surface it (*"`<feature>` isn't on the feature roster — want me to write the PRD anyway and flag it?"*) and record `beyond_roster: true` in frontmatter rather than silently proceeding. Suggest `/feature-map` to add it properly.
12. **Read back before writing.** Assemble the draft, scan it against [references/anti-patterns.md](references/anti-patterns.md), strip symptoms, then read it back: *"where did I misrepresent you?"* Edit for fidelity.
13. **The gate is advisory.** Issue the real verdict with reasons; the user may override a negative verdict → `verdict_overridden: true` + recorded reason, still write the artifact. Never water down.
14. **Tracker.** Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on `READY-FOR-DESIGN` per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
prd progress:
- [ ] Phase 0: Load tracker top 5; load anchor (REQUIRED) + features + intake + architecture (REQUIRED at mvp+) + understanding/discovery/context; detect existing prd (update mode)
- [ ] Phase 1: Confirm feature is on the roster + slug; compute tier (max project_tier, uplift); announce
- [ ] Phase 2: Seed interview — 5 questions (skip if grill-notes exist)
- [ ] Phase 3: Tier-specific elicitation (user stories / risks / NFRs / functional reqs / AI card / open questions)  [M][Pr]
- [ ] Phase 4: Invariant check + SMART check (skip / soft / strict per tier)
- [ ] Phase 5: Read back; scan anti-patterns; collect fidelity corrections
- [ ] Phase 6: Enforce line cap; write .ai/specs/<feature>/prd.md (+ derived .human mirror at mvp+)
- [ ] Phase 7: Append tracker (success only); issue verdict
```

### Phase 0 — Session context + inputs + mode
Read `.ai/progress-tracker.md` top 5 (expect an `architect landed` entry upstream). Then load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (LOCKED), `project_type`, `ai_in_core_path`, approved deps, security gate, `uplift_signals` | **BLOCKED-ON-ANCHOR** |
| `.ai/features.md` | the feature's row — slug, per-feature `tier`, priority, `satisfies` (behavior), `depends_on` | warn (+ `beyond_roster`) |
| `.ai/intake.md` | `technical_user` → question depth | warn |
| `.ai/architecture[.md\|/]` | `02-components` (placement), invariants, top-3 characteristics (prod), ADRs | **BLOCKED-ON-ARCHITECTURE at mvp+**; warn at prototype |
| `.ai/architecture/threat-model.md` | Routed candidates (kind: unwanted-ears) targeting this feature → production Unwanted-EARS seeds; open T-N context | warn at production ("no threat model — Unwanted clauses defend invariants only") |
| `.ai/understanding/<slug>.md` | glossary + invariants + boundaries (use terms verbatim) | warn |
| `.ai/discovery/<slug>.md` | JTBD / target user / success-metric framing as defaults | warn |
| `.ai/context.md` | entity terms (name honesty) | warn |
| `.ai/specs/<feature>/grill-notes.md` | optional interview seed (skip Phase 2) | optional |

If `.ai/specs/<feature>/prd.md` already exists, restate it and ask which sections to update (**update mode** — preserve the rest).

### Phase 1 — Confirm feature, compute tier, announce
Confirm `<feature>` is a row in `.ai/features.md` (rule 11; `beyond_roster: true` if not). Echo the slug (kebab-case, ≤30 chars). Compute `tier = max(project_tier, feature_uplift)` (rule 3) and announce: *"`anchor` says `project_tier=mvp`, but this feature touches payments — computing **production** tier (cap 250, EARS, strict SMART). Architecture has [N] invariants + characteristics [list]; this PRD must honor them. Say 'keep it mvp' to override."* Then propose **component placement** from `02-components.md` (captured in Notes; `/design` finalizes), or note `none — likely needs architect update`.

### Phase 2 — Seed interview (skip if grill-notes exist)
Five questions, one at a time, each with a recommended answer pulled from discovery where possible: whose problem · JTBD · success metric (one number + timeframe + the `source` the number will be read from — an app-emitted source is later implemented via `/design`'s observability hooks) · kill criterion (falsifiable + date) · out-of-scope (3 things). Full bank: [references/questions.md](references/questions.md). If grill-notes exist, restate their answers and confirm in one round.

### Phase 3 — Tier-specific elicitation [M][Pr]
Run only the blocks the tier requires ([references/tier-matrix.md](references/tier-matrix.md)). **mvp** adds: user stories (3–10, full `As a … I want … so that …`), risks/assumptions (each with a ≤1-week falsifying test), lightweight NFRs (3–5, number+measurement), AI transparency card (if the feature ships AI to users — [references/ai-transparency-card.md](references/ai-transparency-card.md)). **production** adds: extensive user stories, functional reqs in **EARS** + verification method (T/I/A/D), invariant→Unwanted-behavior clauses, full NFR table, open questions. At production, also read `.ai/architecture/threat-model.md § Routed candidates` for `unwanted-ears` entries naming this feature — adopt, adapt, or decline each on the record (an adopted clause gets a U-id here; the threat model flips its RC to adopted on its next refresh). Section shapes: [references/examples.md](references/examples.md).

### Phase 4 — Invariant check + SMART check
**Invariant check first** (if architecture loaded): every functional req / NFR / AI-card field must not violate a project invariant; at production, every in-scope invariant must be *defended* by ≥1 Unwanted-behavior clause. Tier behavior: prototype warn · mvp warn+accept-in-Notes · production **block write**. Then **SMART** on every requirement: prototype skip · mvp soft (warn) · production strict (**block write**). Both: [references/smart.md](references/smart.md).

### Phase 5 — Read back
Assemble the draft from [references/template.md](references/template.md), filling only the tier's sections. Scan against [references/anti-patterns.md](references/anti-patterns.md); strip symptoms. Read back; ask *"where did I misrepresent you?"* Edit for fidelity.

### Phase 6 — Write
Enforce the tier line cap (90 / 185 / 250); over → split (rule 8). Write **`.ai/specs/<feature>/prd.md`** (structured, per the [`../_shared/ai-schema.md`](../_shared/ai-schema.md) schema; create the folder). At **mvp+**, also write the derived **`.human/specs/<feature>/prd.md`** mirror (rule 9) and set `human_summary` in frontmatter. Update mode: rewrite only named sections; regenerate the mirror from the updated `.ai` file.

### Phase 7 — Tracker + verdict
Append a tracker entry on `READY-FOR-DESIGN` (skip on refusals). Issue exactly one verdict:

- **`READY-FOR-DESIGN → /design <feature>`** — passes the tier's SMART bar, scope is sharp, NFRs measurable. Hand off: *"PRD is the contract. Next: `/design <feature>` — its design must trace to a component in `02-components.md`. Open questions get triaged at the top of `/design`."*
- **`NEEDS-MORE-CLARITY → <item>`** — one section couldn't be made SMART (usually success metric or kill criterion). Name the blocker + what unblocks it. (Brownfield edge: if the gap is codebase-shape — a baseline, an integration surface — and `project_type: brownfield`, route to `/research <feature>` first.)
- **`BLOCKED-ON-ARCHITECTURE → /architect`** — feature needs an architectural decision not in `anchor.md`/`architecture` (name it), or architecture is missing at mvp+. Save partial as `Status: Blocked`.
- **`BLOCKED-ON-DISCOVERY → /discovery`** — JTBD or target user too fuzzy to PRD against. Save partial as `Status: Blocked`.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no `anchor.md`/`project_tier`; nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, and route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/prd.md`** — MACHINE-facing per-feature contract. Frontmatter index + structured sections; read by `/design`, `/plan`, `/to-fitness`. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). No diagrams.
- **`.human/specs/<feature>/prd.md`** *(mvp+ only)* — HUMAN-facing derived sign-off mirror; plain-English scope + success + risks + verdict + optional journey diagram via the mermaid skill. Rendered from the `.ai` file, never hand-authored. Skipped at prototype.

## References
- Per-tier section matrix + line caps 90/185/250 + uplift signals: [references/tier-matrix.md](references/tier-matrix.md)
- EARS 5 clause templates, decision tree, invariant-defense coverage (cross-linked one-hop by `/design` + `/to-fitness`): [references/ears.md](references/ears.md)
- SMART check + tier behavior (skip / soft / strict): [references/smart.md](references/smart.md)
- AI transparency card — when-to-include, fields, tier behavior: [references/ai-transparency-card.md](references/ai-transparency-card.md)
- Seed interview + per-tier question bank (one at a time): [references/questions.md](references/questions.md)
- Section shapes (success metric · NFR · EARS req · user story · AI card · snippet): [references/examples.md](references/examples.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Per-tier PRD skeleton: [references/template.md](references/template.md)

</supporting-info>
