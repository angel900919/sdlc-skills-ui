---
name: understand
disable-model-invocation: true
description: |-
  Builds shared understanding of WHAT will be built — domain glossary, entity models, invariants, user journeys, and boundaries — never the HOW. Grills one question at a time until terms are pinned down, writes the structured understanding artifact plus the shared context/entity model, and mirrors journeys and entities as validated diagrams for humans. Writes a structured understanding artifact under .ai/understanding/, the shared .ai/context.md, and .human/summaries/understanding.md. Use when the user says "/understand", "go deeper on this idea", "domain model this", "define the requirements", or after /discovery. Do NOT use for: idea validation (/discovery), stack selection (/anchor, /architect), PRD writing (/prd), or full event storming (/event-storm).
---

<what-to-do>

You sharpen the **what** — the domain language, the entities and how they relate, the rules that must always hold, the key journeys, the boundaries, the untested assumptions — without leaking into the **how** (stack, framework, database, hosting; those are `/anchor` and `/architect`). You write a structured machine artifact, update the shared domain context, and mirror the key models as validated diagrams for the human.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/understanding/<slug>.md` and `.ai/context.md` schemas) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, wait for the answer, propose a draft to react to, adapt to `technical_user` from `.ai/intake.md`. **This skill's concepts are the most jargon-prone** (glossary, invariant, entity, aggregate) — never use those words in a question. Ask "what must always be true here?" not "name the invariants"; ask "what are the main things in this world?" not "list the entities." The terminology goes in the `.ai/` artifact only.
2. **No technical questions.** No stack, framework, database, API, hosting, schema, auth scheme, scaling. Those belong to `/anchor` / `/architect`. Capture any tech the user volunteers under References and steer back.
3. **No seed → no session.** If there is no `.ai/discovery/<slug>.md` and no concrete brief, refuse and route to `/discovery`. Don't improvise a discovery.
4. **Propose, don't just ask.** For each term/rule/journey, offer a recommended draft the user reacts to — don't make them generate from scratch.
5. **Reach mutual understanding.** Keep probing a fuzzy term until it's pinned down or you can name it as a `NEEDS-EVENT-STORM` signal. This is where "as many questions as it takes" earns its keep.
6. **Glossary + entities live in `.ai/context.md`.** When a term or entity resolves, write it there immediately (don't batch — batching loses terms). The understanding artifact references context.md by name.
7. **Invariants are domain rules, not code constraints.** Reject "API responds in <200ms" / "validate the email" / "DB must be consistent". Accept "An Order has at most one Cancellation" / "A Session belongs to exactly one Client at close-time".
8. **ADRs only when all three triggers fire** — hard-to-reverse + surprising-without-context + real trade-off. If any one is missing, skip.
9. **The gate is advisory.** Issue `READY-FOR-FEATURE-MAP | NEEDS-EVENT-STORM | BLOCKED-ON-DISCOVERY` with reasons; the user may override on the record (`verdict_overridden: true` + reason).
10. **Tier dial.** Read `predicted_tier` from `.ai/intake.md`. At `prototype`, this stage is often skippable — if the discovery scope is tiny and clear, write a minimal context.md (just the entities) and route to `/feature-map`, noting it. At `mvp`/`production`, run the full grill.
11. **Three artifacts, two registers.** `.ai/understanding/<slug>.md` + `.ai/context.md` are structured (YAML, tables, fixed sections). `.human/summaries/understanding.md` is plain English + validated diagrams. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before writing.

## Procedure

Copy this checklist:

```
understand progress:
- [ ] Phase 0: Load .ai/discovery/<slug>.md + .ai/intake.md + .ai/context.md + tracker top 5; detect seed
- [ ] Phase 1: Restate the JTBD in one sentence; confirm
- [ ] Phase 2: Glossary + entities — pin 5–15 terms; write to .ai/context.md inline
- [ ] Phase 3: Invariants — domain rules that must always hold
- [ ] Phase 4: Behaviors — top 1–3 journeys (trigger → steps → outcome → failure mode)
- [ ] Phase 5: Boundaries — in / out (dated) / never; cross-check discovery scope
- [ ] Phase 6: Open assumptions — unverified beliefs + cheapest falsification test
- [ ] Phase 7: ADR scan — 3-trigger test; write only survivors
- [ ] Phase 8: Read back; scan anti-patterns; collect corrections
- [ ] Phase 9: Write .ai/understanding/<slug>.md + finalize .ai/context.md + .human/summaries/understanding.md
- [ ] Phase 10: Append progress-tracker; issue verdict
```

### Phase 0 — Detect the seed
Load `.ai/discovery/<slug>.md` (JTBD, target user, metric, scope, the `entities` list — all inputs; don't re-grill them). Load `.ai/intake.md` for `predicted_tier` (depth) and `technical_user` (how plainly to phrase questions). Load `.ai/context.md` if it exists (current glossary/entities). Read tracker top 5. If no discovery file and no brief → refuse, route to `/discovery`.

### Phase 1 — Restate
Restate the JTBD in one sentence; ask "did I capture it?" Don't proceed until confirmed.

### Phase 2 — Glossary + entities (the most important phase)
Start from the `entities` list in the discovery artifact. For each load-bearing term, propose a one-line definition and confirm. Apply probes from [references/probes.md](references/probes.md): conflict (already defined differently?), overload (one word, two jobs?), scenario (stress the boundary with an edge case). When a term or entity resolves, write it to `.ai/context.md` **immediately** per [`../_shared/ai-schema.md`](../_shared/ai-schema.md) — glossary line for terms, an entity block (definition, key_attributes, states, invariants) for entities, and a row in the relationships table.

### Phases 3–6 — Invariants, behaviors, boundaries, assumptions
- **Invariants** (3–8): domain rules that must always hold (rule 7). Each becomes a guardrail downstream.
- **Behaviors** (top 1–3 journeys): trigger → steps (user's voice, not UI labels) → outcome → failure mode. A cross-aggregate flow you can't model cleanly is a `NEEDS-EVENT-STORM` signal.
- **Boundaries**: in / out (inherit revisit dates from discovery's Deferred) / never (= discovery's hard non-goals). Cross-check discovery scope; surface contradictions.
- **Open assumptions** (3–7): specific belief + source + cheapest falsification test. Each becomes a Risk downstream.

### Phase 7 — ADR scan
For each decision that crystallized, apply the 3-trigger test (rule 8). Write only survivors. Typical: choosing one ubiquitous term over another; modeling X as an entity vs an attribute. Never tech-stack ADRs (that's `/architect`).

### Phase 8 — Read back
Assemble the draft. Scan against [references/anti-patterns.md](references/anti-patterns.md). Read back: *"Where did I misrepresent you?"* Edit for fidelity.

### Phase 9 — Write the artifacts
1. **`.ai/context.md`** — finalize glossary + entity models + relationships (YAML/table), per the schema. This is the cross-skill reuse hotspot.
2. **`.ai/understanding/<slug>.md`** — structured, per the schema: invariants, behaviors, boundaries, assumptions, decisions; frontmatter index (verdict, entities, invariant_count, links). It references context.md for definitions rather than duplicating them.
3. **`.human/summaries/understanding.md`** — plain English + **validated diagrams** via the **mermaid skill**: a `journey` or `flowchart` for the main behavior, an `erDiagram` mirroring context.md entities, and a `stateDiagram-v2` for any entity with a lifecycle. Plain-English statement of the invariants and boundaries. Link back to the `.ai` artifacts.

### Phase 10 — Verdict
Append a tracker entry on `READY-FOR-FEATURE-MAP` (skip on the blocked verdicts — the artifact's status records the blocker). Issue exactly one:

- **READY-FOR-FEATURE-MAP** — glossary sharp, invariants named, journeys clear, boundaries explicit, assumptions surfaced. Hand off: *"Next: `/feature-map` to decompose into prioritized atomic features."*
- **NEEDS-EVENT-STORM → /event-storm** — non-trivial event flows / cross-aggregate consistency the format can't hold. Name the aggregates. Still write the artifact (`status` notes the block).
- **BLOCKED-ON-DISCOVERY → /discovery** — the JTBD/user/metric is too fuzzy to model. Name which. Write the artifact with `status` blocked.

If the user overrides, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). `.ai/context.md` (shared glossary + entity models + relationships) is read by nearly every downstream skill; `.ai/understanding/<slug>.md` (invariants, behaviors, boundaries, assumptions) is read by `/feature-map` (behaviors), `/prd`, and `/event-storm`.

## Probes & rejection references
- Probes (glossary, invariant, journey, assumption elicitation + accept/reject examples): [references/probes.md](references/probes.md)
- Anti-patterns to scan against: [references/anti-patterns.md](references/anti-patterns.md)

## Slugging
Reuse the discovery slug. For a brief with no prior slug, kebab-case the core noun phrase (≤30 chars).

</supporting-info>
