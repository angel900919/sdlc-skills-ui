---
name: comprehend
disable-model-invocation: true
description: |-
  Brownfield-only domain recovery — the /understand twin for an existing codebase. Reads the code-derived draft in .ai/recon.md (glossary candidates, code-enforced invariants, inferred journeys, mystery zones) and confirms and corrects it with the user in plain English instead of modeling from scratch. Triages code-enforced rules into real domain invariants vs implementation detail, and flags unenforced rules as gaps. Writes the same artifacts as /understand (.ai/understanding/, the shared .ai/context.md, a human summary with diagrams), then routes to /architect. Use when the user says "/comprehend", "recover the domain from the code", "build the domain model from this repo", or after /explore on a brownfield project. Do NOT use for: greenfield idea modeling (/understand), whole-repo recon (/explore), stack lock (/anchor), architecture (/architect), feature scope (/prd), or a code health audit (/health-audit).
---

<what-to-do>

You recover the **what** — the domain language, the entities and how they relate, the rules that must always hold, the key journeys, the boundaries — from an **existing codebase**. You do not generate it from scratch: `/explore` already drafted it from the code into `.ai/recon.md`. Your job is to **confirm and correct that draft with the human**, resolve the mystery zones the code couldn't explain, and write the same machine artifacts `/understand` writes — so everything downstream is identical.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/understanding/<slug>.md` and `.ai/context.md` schemas) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a draft to react to, adapt to `technical_user` from `.ai/intake.md`. The jargon (glossary, invariant, entity, aggregate) goes in the `.ai/` artifact, never in a question.
2. **Confirm, don't re-derive.** `recon.md` Section C already drafted the glossary, code-enforced invariants, and inferred journeys — every claim cited `file:line`. Propose each to the user and confirm or correct it; do **not** regenerate the domain from scratch. This is the brownfield efficiency win — the code wrote the first draft.
3. **No recon → no session.** Require `.ai/recon.md`; missing → `BLOCKED-ON-RECON → /explore`. Don't improvise a recon. If `project_type: greenfield` → `GREENFIELD → /understand` (wrong door).
4. **Code questions are allowed — translated.** Unlike `/understand`, you reason about real code. But ask the human in product terms: not "is this invariant correct?" — instead *"the system only lets one person own an account — is that a rule you want, or just how it happens to work?"* Keep the `file:line` provenance in the artifact, not in the question.
5. **Triage code-enforced constraints (the signature step).** Recon's "invariants enforced in code" are raw — sort each into: (a) **genuine domain invariant** → keep, note it's code-backed, carry the cite; (b) **implementation detail** ("the DB column is NOT NULL", "API returns 200ms") → drop from Invariants; (c) **domain rule the code does NOT enforce** (the user says it must hold, no code defends it) → record as a **gap** in Open assumptions (a future fitness-function candidate).
6. **Invariants are domain rules, not code constraints** — same bar as `/understand`. Accept "An Order has at most one Cancellation"; reject "the email column is unique" (that's evidence, not the rule).
7. **Glossary + entities live in `.ai/context.md`.** Use the repo's own terms from recon Section C — don't invent synonyms. When a term/entity resolves, write it to `.ai/context.md` immediately (don't batch). Surface conflicts against any existing context.md (conflict probe).
8. **Mystery zones are the human's to answer.** Walk each `recon.md` Section E item — the code couldn't classify it. Resolve it to a fact, or log it as an Open assumption. Don't guess.
9. **ADRs only when all three triggers fire** — hard-to-reverse + surprising-without-context + real trade-off. Otherwise skip. Never tech-stack ADRs (that's `/architect`).
10. **The gate is advisory.** Issue `READY-FOR-ARCHITECT | NEEDS-EVENT-STORM | BLOCKED-ON-RECON | GREENFIELD` with reasons; an override sets `verdict_overridden: true` + recorded reason.
11. **Tier dial.** Read `predicted_tier` from `.ai/intake.md`. At `prototype`, condense — confirm the entities + the top journey, write a minimal context.md, route on. At `mvp`/`production`, run the full confirmation pass.
12. **Three artifacts, two registers.** `.ai/understanding/<slug>.md` + `.ai/context.md` are structured. `.human/summaries/understanding.md` is plain English + **validated diagrams via the mermaid skill**. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before writing.

## Procedure

Copy this checklist:

```
comprehend progress:
- [ ] Phase 0: Load recon.md (REQUIRED) + intake/idea (product purpose) + anchor + context.md + tracker top 5; brownfield gate; update mode
- [ ] Phase 1: Restate what the app does (from /onboard) in one sentence; confirm
- [ ] Phase 2: Glossary + entities — confirm/correct recon Section C candidates; write to context.md inline
- [ ] Phase 3: Invariants — triage recon's code-enforced rules (keep / drop / gap)
- [ ] Phase 4: Behaviors — confirm recon's inferred journeys; correct to the user's voice
- [ ] Phase 5: Boundaries — in / out (dated) / never (from intake scope + code reality)
- [ ] Phase 6: Mystery zones — walk Section E; resolve or log as Open assumption
- [ ] Phase 7: Open assumptions (incl. unenforced rules) + ADR scan
- [ ] Phase 8: Read back; scan anti-patterns; collect corrections
- [ ] Phase 9: Write understanding.md + finalize context.md + .human summary (diagrams via mermaid)
- [ ] Phase 10: Append tracker; issue verdict
```

### Phase 0 — Load + brownfield gate
Load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/recon.md` | Section C (glossary/invariants/journeys), Section E (mystery zones), `slug` | **BLOCKED-ON-RECON → /explore** |
| `.ai/intake.md` | `project_type` (gate), `technical_user` (question depth), `predicted_tier` | warn |
| `.human/intake/idea.md` | the product purpose `/onboard` captured (what the app does, who uses it) | warn |
| `.ai/anchor.md` | stack context, confirm `project_type: brownfield` | warn |
| `.ai/context.md` | existing glossary/entities (conflict-check) | warn |

`project_type: greenfield` → `GREENFIELD → /understand`. Then look for `.ai/understanding/<slug>.md`; if present, announce **update mode** (refresh only named sections, preserve the rest).

### Phase 1 — Restate
Restate what the app does in one sentence (from `idea.md`/`intake.md`); ask "did I capture it?" Don't proceed until confirmed. This frames the domain — the code tells you *how*, the user tells you *what it's for*.

### Phase 2 — Glossary + entities (confirm the draft)
Walk recon Section C's glossary candidates. For each, propose the code-derived definition and confirm or correct it (probes: [references/probes.md](references/probes.md) — conflict, overload, scenario, **code-vs-intent**). When a term/entity resolves, write it to `.ai/context.md` **immediately** per [`../_shared/ai-schema.md`](../_shared/ai-schema.md) — glossary line, entity block (definition, key_attributes, states, invariants), relationships row.

### Phases 3–7 — Invariants, behaviors, boundaries, mystery zones, assumptions
- **Invariants** (rule 5 triage): keep genuine domain rules (code-backed, cited), drop implementation details, record unenforced rules as gaps.
- **Behaviors**: confirm recon's inferred journeys; rewrite each in the user's voice (trigger → steps → outcome → failure mode). A cross-aggregate flow you can't model cleanly → `NEEDS-EVENT-STORM`.
- **Boundaries**: in / out (dated) / never — from the intake scope cross-checked against what the code actually does. Surface contradictions.
- **Mystery zones**: walk Section E; resolve each with the user or log as an Open assumption.
- **Open assumptions** (3–7): specific belief + source + cheapest falsification test — including every unenforced domain rule from the Phase 3 triage.
- **ADR scan**: 3-trigger test; write only survivors.

### Phase 8 — Read back
Assemble the draft. Scan against [references/anti-patterns.md](references/anti-patterns.md). Read back: *"Where did I misread what this app is or does?"* Edit for fidelity.

### Phase 9 — Write the artifacts
1. **`.ai/context.md`** — finalize glossary + entity models + relationships (set `source_recon` provenance for code-derived entries).
2. **`.ai/understanding/<slug>.md`** — structured per the schema: invariants (note code-backed ones), behaviors, boundaries, assumptions, decisions; frontmatter index with `source_recon: .ai/recon.md`. References context.md for definitions.
3. **`.human/summaries/understanding.md`** — plain English + **validated diagrams** via the **mermaid skill**: a `journey`/`flowchart` for the main behavior, an `erDiagram` mirroring context.md entities, a `stateDiagram-v2` for any entity with a lifecycle. Link back to the `.ai` artifacts.

### Phase 10 — Verdict
Append a tracker entry on `READY-FOR-ARCHITECT` (skip on blocked verdicts). Issue exactly one:

- **`READY-FOR-ARCHITECT → /architect`** — glossary confirmed, invariants triaged, journeys in the user's voice, mystery zones resolved. *"Next: `/architect` — paste recon Sections A + B + D; it reverse-engineers the as-is architecture against this domain model."*
- **`NEEDS-EVENT-STORM → /event-storm`** — cross-aggregate flows the format can't hold. Name the aggregates. Still write the artifact (`status` notes the block).
- **`BLOCKED-ON-RECON → /explore`** — no `recon.md` to confirm. Run `/explore` first.
- **`GREENFIELD → /understand`** — `project_type` is greenfield; use the greenfield door.

If the user overrides, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/context.md`** — shared glossary + entity models + relationships. Read by nearly every downstream skill. Same schema as `/understand`'s; schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md).
- **`.ai/understanding/<slug>.md`** — invariants, behaviors, boundaries, assumptions. Frontmatter is the index; `source_recon` instead of `source_discovery`.
- **`.human/summaries/understanding.md`** — plain-English + validated journey / ER / state diagrams.

## How `/comprehend` differs from `/understand`
| | `/understand` (greenfield) | `/comprehend` (brownfield) |
| :-- | :-- | :-- |
| Precondition | `.ai/discovery/<slug>.md` | `.ai/recon.md` |
| Stance | generate by interview | confirm/correct a code-derived draft |
| Code questions | banned | allowed (translated to product terms) |
| Invariants | elicited from the user | triaged from code (keep / drop / gap) |
| Next skill | `/feature-map` | `/architect` |

Both write the **same artifacts and schema**, so `/feature-map`, `/architect`, `/prd` never know which produced them.

## Probes & rejection references
- Confirm-the-draft probes (conflict, overload, scenario, code-vs-intent, lift/drop, mystery-zone): [references/probes.md](references/probes.md)
- Anti-patterns to scan against: [references/anti-patterns.md](references/anti-patterns.md)

## Slugging
Reuse the `slug` from `recon.md` (set upstream by `/onboard`). Never re-slug.

</supporting-info>
