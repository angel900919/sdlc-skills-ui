---
name: ddd-strategy
description: |-
  Pre-phase for /architect on DDD-shaped domains. Produces .ai/architecture/strategic-design.md — subdomain classification (core/supporting/generic), bounded-context map, ubiquitous-language seams, and integration patterns (ACL, OHS, Conformist, Customer-Supplier, Shared Kernel, Partnership, Separate Ways) — plus a .human context-map diagram. Runs BEFORE /architect; non-DDD projects skip it. Use when the user says "/ddd-strategy", "design my system using DDD", "decompose my domain into bounded contexts", "draw a context map", "what bounded contexts do I need", "how should these services talk to each other", or when /architect or /event-storm emits NEEDS-STRATEGIC-DESIGN. Do NOT use for: high-level architecture or components (/architect), tactical event modeling (/event-storm), domain glossary or invariants (/understand), per-feature scope (/prd), or code scaffolding (the build phase).
---

<what-to-do>

You design the **strategic** layer of a Domain-Driven Design domain — *which* bounded contexts exist, how they map to subdomains (core / supporting / generic), where the ubiquitous language drifts, and how each pair of contexts integrates. This is the structural decision that frames `/architect`: it runs **once, before** `/architect`, as the DDD pre-phase. You write structure to `.ai/architecture/strategic-design.md`; the context-map picture goes to `.human/` as a validated diagram. You diagnose and prescribe — you do not write code.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/architecture/strategic-design.md` schema) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a draft to react to, adapt to `technical_user` from `.ai/intake.md`. The jargon (bounded context, subdomain, anti-corruption layer, conformist) lives in the `.ai/` artifact, never in a question. Ask "which parts of the business is your real edge — the thing competitors can't easily copy?" not "classify your core subdomains."
2. **Classify with evidence — default to supporting.** Core requires evidence (competitive advantage, intricate rules, failure threatens the business); if you can buy it, it's generic; everything else is supporting. A "core" subdomain with no intricate rules is misclassified — re-grade it. Heuristics: [references/heuristics.md](references/heuristics.md).
3. **A bounded context is as wide as the ubiquitous language stays consistent.** One context per subdomain is the lower bound — never decompose further. Split only when the same term demonstrably means different things; merge only when the language is consistent. Start wider, split on language drift.
4. **Every context pair that exchanges data gets an explicit integration pattern.** Label upstream/downstream and pick from the seven patterns (Partnership, Shared Kernel, Conformist, ACL, Open-Host Service, Separate Ways, Customer-Supplier framing). An implicit shared-table integration with no pattern named will rot. Picker + quick-pick table: [references/integration-patterns.md](references/integration-patterns.md).
5. **No diagrams in `.ai/`.** The context map is generated via the **[mermaid skill](../mermaid/SKILL.md)** into `.human/summaries/strategic-design.md` only. The `.ai/` artifact holds the subdomain table, the bounded-context list, and the integration matrix as structured tables.
6. **Glossary ownership.** The per-context ubiquitous-language notes live inside `strategic-design.md`, scoped to their context. They do NOT replace the root `.ai/context.md` (owned by `/understand`); per-context terms may refine root terms but must not contradict them — surface a contradiction, don't silently override.
7. **Shared ADR counter.** ADR numbering is shared with `/architect`. Before allocating, scan `.ai/architecture/adr/` for the highest existing `NNNN` and continue from there — never restart at 0001 if ADRs already exist. Write an ADR only when all three triggers fire (hard-to-reverse + surprising-without-context + real trade-off); a bounded-context boundary or an integration pick usually qualifies. Format: [`../architect/references/adr.md`](../architect/references/adr.md).
8. **The gate is advisory.** Run the full analysis and issue the real verdict with reasons; the user may override on the record (`verdict_overridden: true` + reason).
9. **Tier note.** Strategic design is **tier-agnostic in shape** — *which* bounded contexts exist has the same answer at prototype, mvp, and production. It is gated by *need* (DDD-shaped multi-context domain), not tier; in practice only `mvp`+ projects invoke it. Read `.ai/anchor.md` for stack/domain context only — it does not change what is produced. Honor the artifact line cap (≤200 lines, matching an architecture bundle file).

**Backstopped by** the heuristics' "when NOT to apply DDD" section — if the domain is a single context with no language drift, say so and route on rather than manufacturing contexts.

## Procedure

Copy this checklist:

```
ddd-strategy progress:
- [ ] Phase 0: Load understanding/<slug>.md + context.md (warn) + domain-model.md (warn) + anchor + intake + tracker top 5; update mode?
- [ ] Phase 1: Restate the domain in one sentence; confirm scope (whole business / one product line / one process)
- [ ] Phase 2: Classify subdomains — core / supporting / generic, each with evidence
- [ ] Phase 3: Extract ubiquitous-language seams — terms that drift between areas
- [ ] Phase 4: Propose bounded contexts (default 1 per subdomain; split on language drift)
- [ ] Phase 5: Pick integration patterns per context pair; label upstream/downstream
- [ ] Phase 6: ADR scan — 3-trigger test; shared NNNN counter
- [ ] Phase 7: Read back; write strategic-design.md + .human context-map diagram
- [ ] Phase 8: Append tracker; issue verdict
```

### Phase 0 — Load inputs + mode
Read frontmatter first, then the sections you consume:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/understanding/<slug>.md` | the domain, entities, invariants to anchor classification | **BLOCKED-ON-UNDERSTANDING → /understand** if too thin to classify |
| `.ai/context.md` | the root glossary (per-context terms refine, don't contradict it) | warn |
| `.ai/architecture/domain-model.md` | aggregates/contexts from `/event-storm`, if it ran | optional |
| `.ai/anchor.md` | stack + domain background (contextual only) | warn |
| `.ai/intake.md` | `technical_user` (question depth) | warn |

Read tracker top 5 (expect an `understand landed`, `event-storm landed`, or `architect landed` entry as the upstream signal). If `.ai/architecture/strategic-design.md` already exists, announce **update mode** (refresh only the named sections; preserve the rest, including the integration matrix rows the user didn't touch).

### Phase 1 — Restate + scope
Restate the domain in one sentence and confirm the **scope**: whole business, one product line, or one process? Don't proceed until confirmed — the scope sets how many subdomains you'll find.

### Phases 2–5 — The strategic model
Walk these one at a time, proposing a draft for each:

2. **Subdomains** (rule 2) — apply the core/supporting/generic test to each business activity; record the evidence for every "core."
3. **Ubiquitous-language seams** (rule 3) — list the load-bearing terms; flag any that mean different things in different areas. Those flags are bounded-context seams.
4. **Bounded contexts** (rule 3) — default one per subdomain; merge only on consistent language, split only on demonstrated drift. Give each context a one-sentence responsibility and (optionally) a suggested business-logic + architectural pattern from [references/heuristics.md](references/heuristics.md).
5. **Integration patterns** (rule 4) — for each context pair that exchanges data, apply the quick-pick table in [references/integration-patterns.md](references/integration-patterns.md); label upstream/downstream and the pattern. This matrix is the structure the `.human` context map renders.

### Phase 6 — ADR scan
For each decision that crystallized in Phases 4–5 (a boundary affecting multiple teams, an integration pick under compliance scrutiny, a subdomain classification that locks org structure), apply the 3-trigger test. Allocate numbers from the **shared counter** (rule 7). Write one ADR per decision with ≥2 reasonable options; skip trivial choices.

### Phase 7 — Read back, then write both registers
Read the model back in plain English (subdomains, contexts, integration edges, ADR titles); ask *"where did I miscut the boundaries?"* before materializing. Then:
1. **Write `.ai/architecture/strategic-design.md`** from [references/template.md](references/template.md) — subdomain table, per-context list, ubiquitous-language seams, integration matrix, ADR links, open questions. Create the `.ai/architecture/` folder if it doesn't exist yet; `/architect` consumes this file and fills in the rest of the bundle. **Hard cap: 200 lines.**
2. **Generate `.human/summaries/strategic-design.md`** via the **[mermaid skill](../mermaid/SKILL.md)**: a one-line summary, 3–6 plain bullets, and **one** validated **context-map diagram** rendered FROM the integration matrix — a `flowchart` with each context as a node and each integration as a labeled edge (pattern + U/D direction). Link back to the `.ai/` artifact. Diagrams live in `.human/` only.

### Phase 8 — Tracker + verdict
Append a tracker entry on a success verdict (skip on refusals — the artifact's `status` records the blocker). Issue exactly one:

- **`READY-FOR-ARCHITECT → /architect`** — strategic design written; bounded contexts, integration patterns, and per-context language all present. Hand off: *"Strategic design is set in `.ai/architecture/strategic-design.md`. Next: `/architect` consumes the context map and produces the rest of the bundle (style, C4, components, ADRs) — its components must respect the bounded-context boundaries you drew."*
- **`NEEDS-EVENT-STORM → /event-storm`** — a context has non-trivial event flows or cross-aggregate consistency questions the strategic pass couldn't answer. Run `/event-storm` for the affected context(s), then re-run this skill to finalize the map.
- **`BLOCKED-ON-UNDERSTANDING → /understand`** — the domain is too thin to classify subdomains or extract language seams. Route back to `/understand` (or `/discovery` if even fuzzier); save partial work as `status: draft`.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/architecture/strategic-design.md`** — MACHINE-facing structure: subdomain classification, bounded-context list, per-context ubiquitous-language notes, integration matrix, ADR links. Consumed by `/architect` verbatim. Sits next to `domain-model.md` (from `/event-storm`) in the architecture bundle. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams.**
- **`.human/summaries/strategic-design.md`** — HUMAN-facing: one-line summary + plain bullets + one validated context-map diagram via the mermaid skill. Diagrams live here only.
- **ADRs** — `.ai/architecture/adr/NNNN-*.md`, shared counter with `/architect`.

Tactical counterpart: `/event-storm` (events, aggregates, policies **within** a context); this skill is strategic (bounded contexts, integration patterns **across** contexts).

## References
- Subdomain classifier + business-logic/architectural/testing pattern pickers: [references/heuristics.md](references/heuristics.md)
- The seven integration patterns, the quick-pick table, context-map conventions, anti-patterns: [references/integration-patterns.md](references/integration-patterns.md)
- The `strategic-design.md` skeleton: [references/template.md](references/template.md)
- Nygard ADR format + the shared NNNN counter: [`../architect/references/adr.md`](../architect/references/adr.md)

Grounded in *Learning Domain-Driven Design* by Vlad Khononov (subdomains chs 1 & 10, bounded contexts ch 3, integration ch 4, ubiquitous language ch 2). Reference the source chapters in the artifact; do not duplicate the book's content.

</supporting-info>
