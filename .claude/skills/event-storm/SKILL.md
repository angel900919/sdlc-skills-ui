---
name: event-storm
disable-model-invocation: true
description: |-
  Optional tactical domain-modeling session between domain understanding and the next phase — for domains with non-trivial event flows, cross-aggregate consistency, or aggregates the user can't yet name. Produces .ai/architecture/domain-model.md (events, commands, aggregates, policies, read models, bounded-context relationships) plus a .human diagram. Most projects skip it. Use when the user says "/event-storm", "event storming", "model the domain events", "what are the aggregates", "I can't name the aggregates yet", or when /understand or /comprehend emits NEEDS-EVENT-STORM. Do NOT use for: high-level architecture or components (/architect), strategic DDD bounded contexts (/ddd-strategy), per-feature scope (/prd), implementation design (/design), or idea validation (/discovery).
---

<what-to-do>

You run a brief **event-storming session in chat** to model the **tactical** layer of a domain — the past-tense events, the commands that cause them, the aggregates that own them, the policies that chain them, and the read models the UI needs — for a domain that `/understand` (or `/comprehend`) flagged as too event-heavy to model in prose. The output is the artifact a senior architect would draw on stickies: `.ai/architecture/domain-model.md`. You write structure to `.ai/`; the event-flow picture goes to `.human/` as a validated diagram.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/architecture/domain-model.md` schema) before writing.

## Critical rules

1. **`.ai/context.md` is required.** No shared glossary → `BLOCKED-ON-CONTEXT → /understand` and stop. Without the project's ubiquitous-language anchor the events you elicit have no defined terms. (Brownfield: `/comprehend` writes the same `.ai/context.md`.)
2. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one step at a time, propose a draft to react to, adapt to `technical_user` from `.ai/intake.md`. The jargon (event, aggregate, policy, read model) lives in the `.ai/` artifact, never in a question. Ask "what happened, in the past tense?" not "name the domain events"; ask "what group of facts always has to stay consistent together?" not "name the aggregate."
3. **One step at a time — you are a facilitator, not an oracle.** Don't dump the checklist on the user. Walk each phase, capture their input, summarise back, then advance. Event storming is amber-zone work; the whole value is the human's domain knowledge.
4. **Events are past-tense facts.** "ProcessOrder" is a command; "OrderProcessed" is an event. Reject present/imperative tense in the event list.
5. **Aggregates are consistency boundaries.** If two things must be transactionally consistent, they belong in the same aggregate. One mega-aggregate that owns everything means the model isn't done.
6. **Cross-aggregate / cross-service policies are red flags — make them explicit.** Each "when X, then Y" that crosses a boundary is a coupling decision; name the bounded-context relationship and decide whether an anti-corruption layer is needed. Don't paper over hot spots — flag them.
7. **Update `.ai/context.md` inline.** Every new ubiquitous-language term surfaced during the session is written to `.ai/context.md` immediately (don't batch — batching loses terms), per the [`../_shared/ai-schema.md`](../_shared/ai-schema.md) context schema. The domain-model artifact references context.md by name; it never re-defines its terms.
8. **No diagrams in `.ai/`.** The event-flow / aggregate picture is generated via the **[mermaid skill](../mermaid/SKILL.md)** into `.human/summaries/domain-model.md` only. The `.ai/` artifact holds structured tables and lists.
9. **The gate is advisory.** Run the full session and issue the real verdict with reasons; the user may override on the record (`verdict_overridden: true` + reason).
10. **Tier note.** Gated by *need*, not tier — only event-heavy domains invoke it, which in practice means `mvp`+; at `prototype` it is almost always skipped. Honor the artifact line cap (≤200 lines, matching an architecture bundle file). Read `predicted_tier` from `.ai/intake.md` only to size question depth.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before writing.

## Procedure

Copy this checklist:

```
event-storm progress:
- [ ] Phase 0: Load context.md (REQUIRED) + understanding/<slug>.md + strategic-design.md (warn) + intake + tracker top 5; detect origin
- [ ] Phase 1: Big-picture pass — name domain events (past-tense), time-ordered
- [ ] Phase 2: Group events into aggregates (consistency boundaries)
- [ ] Phase 3: Commands — the action that triggers each event
- [ ] Phase 4: Actors — who/what issues each command
- [ ] Phase 5: Policies — event → command chains (flag cross-boundary ones)
- [ ] Phase 6: Read models — views the UI / downstream agent needs
- [ ] Phase 7: Bounded-context relationships — classify each cross-boundary policy
- [ ] Phase 8: Hot spots — unclear model, contested data, unrealistic consistency
- [ ] Phase 9: Read back; scan anti-patterns; update context.md; write domain-model.md + .human diagram
- [ ] Phase 10: Append tracker; issue origin-branched verdict
```

### Phase 0 — Load inputs + detect origin
Read frontmatter first, then the sections you consume:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/context.md` | the glossary/entities the events anchor to | **BLOCKED-ON-CONTEXT → /understand** |
| `.ai/understanding/<slug>.md` | behaviors (→ convert to events), the NEEDS-EVENT-STORM signal, **`source_discovery` vs `source_recon`** | warn |
| `.ai/architecture/strategic-design.md` | bounded contexts from `/ddd-strategy`, if it ran | optional |
| `.ai/intake.md` | `technical_user` (question depth), `predicted_tier` | warn |

**Detect origin** (this branches the success verdict, Phase 10): if `understanding.md` carries `source_recon` (or `intake.md` is `project_type: brownfield`) the origin is **brownfield** → next is `/architect`; if it carries `source_discovery` (greenfield) → next is `/feature-map`. Read tracker top 5; expect an `understand landed` or `comprehend landed` entry as the upstream signal. If `.ai/architecture/domain-model.md` already exists, announce **update mode** (refresh only the named sections; preserve the rest).

### Phases 1–8 — The storming session
Walk the eight steps one at a time, using the facilitation script + sticky-color mental model in [references/protocol.md](references/protocol.md). Capture each phase's output and summarise it back before advancing:

1. **Events** (Phase 1) — past-tense facts, time-ordered. Don't filter; capture everything, accept duplicates, merge later.
2. **Aggregates** (Phase 2) — cluster events that share a consistency boundary; name each cluster's owning aggregate (rule 5).
3. **Commands** (Phase 3) — the imperative action that triggers each event ("PlaceOrder" → "OrderPlaced").
4. **Actors** (Phase 4) — who/what issues each command (user, agent, scheduler, external system).
5. **Policies** (Phase 5) — "when this event, then that command." The cross-boundary ones are coupling decisions (rule 6).
6. **Read models** (Phase 6) — the views/projections the UI or a downstream agent needs.
7. **Bounded-context relationships** (Phase 7) — for each policy that crosses a context line, classify the relationship (Partnership / Customer-Supplier / Conformist / ACL / Open-Host Service); if `strategic-design.md` exists, reconcile against its context map rather than re-deriving.
8. **Hot spots** (Phase 8) — places the model is unclear, two aggregates fight for the same data, or a consistency requirement is unrealistic. Flag, don't resolve by fiat.

### Phase 9 — Read back, then write both registers
Read the assembled model back in plain English; ask *"where did I mismodel this?"* Scan against [references/anti-patterns.md](references/anti-patterns.md). Then:
1. **Update `.ai/context.md`** with any new ubiquitous-language terms (rule 7).
2. **Write `.ai/architecture/domain-model.md`** from [references/template.md](references/template.md) — aggregates, time-ordered events, commands table, policies, read models, bounded-context relationships, hot spots. Create the `.ai/architecture/` folder if it doesn't exist yet (`/architect` fills in the rest later; multi-context projects keep each context as a `##` section in this one file, not per-service files). **Hard cap: 200 lines.**
3. **Generate `.human/summaries/domain-model.md`** via the **[mermaid skill](../mermaid/SKILL.md)**: a one-line verdict, 3–6 plain bullets, and **one** validated diagram rendered FROM the `.ai/` structure — a `flowchart` of the event→policy→command flow (or an aggregate/event map). Link back to the `.ai/` artifact. Diagrams live in `.human/` only.

### Phase 10 — Tracker + origin-branched verdict
Append a tracker entry on a success verdict (skip on refusals — the artifact's `status` records the blocker). Issue exactly one:

- **`READY-FOR-FEATURE-MAP → /feature-map`** *(greenfield origin)* — model coherent (aggregates named, events past-tense, no unexamined cross-aggregate transactional-consistency claim, ≤2 hot spots left), no strategic pre-phase needed. Hand off: *"Domain model written to `.ai/architecture/domain-model.md`. Next: `/feature-map` to decompose into a ranked feature roster — each domain event becomes a downstream EARS `When` clause."*
- **`READY-FOR-ARCHITECT → /architect`** *(brownfield origin)* — same coherence bar, but the chain came through `/comprehend`. Hand off: *"Domain model written. Next: `/architect` to produce the architecture bundle — its components must respect the aggregates and bounded-context relationships you named."*
- **`NEEDS-STRATEGIC-DESIGN → /ddd-strategy`** — the session surfaced multiple bounded contexts whose integration patterns weren't pre-decided, or ubiquitous-language drift between contexts worse than expected. STOP; run `/ddd-strategy` to draw the context map, then re-run `/event-storm` per context (one `##` section each).
- **`NEEDS-MORE-MODELING`** — too many open questions to commit (≥3 unresolved aggregate boundaries, ≥3 contested invariants, or a policy graph with no obvious aggregate ownership). Name what to resolve; save the artifact `status: draft` so the work isn't lost.
- **`BLOCKED-ON-UNDERSTANDING → /understand`** — terminology/behavior questions this skill can't resolve from `context.md` + `understanding.md` (e.g. the user can't name the actor for half the commands, or "the domain" turned out to be two disjoint domains). Route back; re-run after.
- **`BLOCKED-ON-CONTEXT → /understand`** — no `.ai/context.md` at all. Refusal at the input check, before any modeling.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/architecture/domain-model.md`** — MACHINE-facing structure: aggregates, events, commands, policies, read models, bounded-context relationships, hot spots. Read by `/architect` (verbatim) and `/feature-map` (events → behaviors). Sits next to `strategic-design.md` in the architecture bundle. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams.**
- **`.ai/context.md`** — updated inline with new ubiquitous-language terms (owned by `/understand`; this skill only appends terms it surfaces).
- **`.human/summaries/domain-model.md`** — HUMAN-facing: one-line verdict + plain bullets + one validated event-flow/aggregate diagram via the mermaid skill. Diagrams live here only.

Strategic counterpart: `/ddd-strategy` (bounded contexts, integration patterns **across** contexts); this skill is tactical (events, aggregates, policies **within** a context).

## References
- Facilitation script, sticky-color legend, the 8-step protocol, pitfalls: [references/protocol.md](references/protocol.md)
- The `domain-model.md` skeleton: [references/template.md](references/template.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Subdomain heuristics + integration patterns (when `NEEDS-STRATEGIC-DESIGN` fires): [`../ddd-strategy/references/integration-patterns.md`](../ddd-strategy/references/integration-patterns.md)

</supporting-info>
