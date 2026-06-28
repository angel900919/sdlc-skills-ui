---
name: strategy
disable-model-invocation: true
description: |-
  Sets a product's direction before validation: an outcome-driven vision, a Rumelt-kernel strategy (diagnosis, guiding policy, coherent actions, explicit non-goals), and one value-exchange North Star with 1-3 OKRs. Opt-in Stage-1 product step that writes a structured .ai/strategy artifact plus a plain-English .human summary, tier-scaled, with an advisory verdict the user can override on the record. Use when the user says "/strategy", "set the product strategy", "write the vision", "what's our strategy", "pick a North Star metric", "set OKRs", or "what are we NOT doing". Do NOT use to validate the problem with users (/discovery), size the market (/market-research), make the build go/no-go call (/opportunity), or choose the stack (/anchor).
---

<what-to-do>

You decide **where this product is going and why it will win** — and prove the strategy is a *real choice* (a diagnosis, a guiding policy, coherent actions), not a list of goals or vision word-soup. You interview the user about the **direction, not the implementation**, optionally research the space with sub-agents, write a structured machine artifact plus a plain-English human summary, and issue an advisory verdict the user can override on the record.

This is an **opt-in Stage-1 step** that sits at the very top of the product stage, before `/discovery`. Its job is to give every downstream skill a **frozen strategic context** so problem validation, the roadmap, and the build all derive from the same north. It is optional: a user with an obvious utility, or one whose product is already approved, can skip straight to `/discovery` (or to engineering).

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory-gate rule, tier dial, talking-to-the-human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/strategy/<slug>.md` schema) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one or two questions at a time, propose a recommended answer, no jargon (say "the one obstacle that decides whether you win", not "the Rumelt diagnosis"; "the one number that means it's working", not "the North Star"). Adapt to `technical_user` from `.ai/intake.md`. The framework terms live in the *artifact*, not the questions.
2. **Direction, not problem or build.** No domain modeling (`/understand`), no stack/architecture (`/anchor`/`/architect`), no problem validation with users (`/discovery`). If the user volunteers those, capture them under References/Notes and steer back to the direction.
3. **North Star + at least one OKR are mandatory at every tier.** A strategy with no measurable outcome is theatre. Solo/prototype may collapse vision + strategy into one page, but the measurable outcome is never tailored out.
4. **Strategy is choice — force explicit non-goals.** Keep probing until the user names at least one segment, problem, channel, or model they decline. An empty non-goals list means no real strategy was made.
5. **Real diagnosis, not goals (the fluff test).** Name the single most important obstacle or insight — the crux that, if cracked, makes winning possible. Where it rests on a guess, log it as an assumption and flag it for `/market-research` or `/discovery`; never assert it as fact.
6. **Value-exchange North Star, not vanity.** Reject DAU, sign-ups, raw revenue. Force a metric that rises **only when a customer got real value** and that leads revenue, paired with a guardrail so growth isn't bought with harm.
7. **Never invent.** Every missing market size, metric baseline, or customer claim is a `TODO:` or a flagged assumption with an owner — never a fabricated number. A blank with an owner is honest; a made-up figure propagates into every downstream gate.
8. **The gate is advisory.** Run the full analysis and issue `STRATEGY-SET | NEEDS-EVIDENCE | RECONSIDER` with reasons. The user may continue past a negative verdict — set `verdict_overridden: true`, record their reason in the Decision section, and still write both artifacts. Gatekeep by being honest, never by blocking.
9. **Tier dial.** Read `predicted_tier` from `.ai/intake.md`. At `prototype`, run a condensed pass (a one-page vision+strategy, one North Star, one OKR, one non-goal) and lean toward `STRATEGY-SET` unless the strategy is clearly fluff. At `mvp`/`production`, run the full kernel.
10. **Responsible-product floor — always on, even at prototype.** Re-check the privacy / accessibility / safety / ethics floor against this strategy's scope, and set the North Star guardrails so growth isn't bought with harm. This is never tailored out.
11. **Two artifacts, two registers.** `.ai/strategy/<slug>.md` is structured (frontmatter index + fixed sections, per the schema). `.human/summaries/strategy.md` is plain-English: the direction in one sentence, the why in 3–6 bullets, and one validated diagram (strategy-on-a-page or the metric tree) via the **mermaid skill**. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — the rejection list (goals-as-strategy, vanity North Star, no non-goals, invented market numbers, output-counting OKRs). Scan the draft against it before writing.

## Procedure

Copy this checklist:

```
strategy progress:
- [ ] Phase 0: Load .ai/intake.md (slug, tier, technical_user) + .human/intake/idea.md + progress-tracker top 5
- [ ] Phase 1: Vision — the customer's better future, work backwards (outcome, not features)
- [ ] Phase 2: Diagnosis — the single most important obstacle/insight (Rumelt part 1)
- [ ] Phase 3: Guiding policy + coherent actions (Rumelt parts 2–3)
- [ ] Phase 4: Non-goals — the explicit trade-offs (≥1)
- [ ] Phase 5: North Star — one value-exchange metric + 2–4 input metrics + guardrails
- [ ] Phase 6: OKRs — 1–3 objectives with measurable, outcome-shaped key results
- [ ] Phase 7: Responsible-product floor + strategic risks/assumptions
- [ ] Phase 8: Read back; scan against anti-patterns; collect corrections
- [ ] Phase 9: Write .ai/strategy/<slug>.md + .human/summaries/strategy.md (validated diagram)
- [ ] Phase 10: Append progress-tracker; issue verdict + hand off
```

### Phase 0 — Load context
Read `.ai/intake.md` for `slug`, `predicted_tier`, `technical_user`. Read `.human/intake/idea.md` for the captured idea. Read `.ai/progress-tracker.md` top 5 (create from the stub in [`../_shared/conventions.md`](../_shared/conventions.md) if absent). If no intake exists, ask the user for the idea directly and slug it yourself (kebab-case, ≤30 chars, describes the idea).

### Phase 1 — Vision
Work backwards from the customer's better life. Elicit a 3–10yr, outcome-driven future for the *customer* — not a feature list. Steel-man it: would a customer recognise their life as better? At `prototype`, keep it to two sentences. Reflect back; confirm.

### Phases 2–6 — The kernel + measures
Ask one or two plain questions at a time; pull from [references/question-bank.md](references/question-bank.md) when stuck. Enforce rules 4–6. For each round, restate the answer in your own words and confirm. The diagnosis (Phase 2) is load-bearing: where it rests on an unproven market or customer claim, log an assumption and flag it. Derive the North Star and OKRs *after* the kernel — they measure the strategy, they are not the strategy.

### Phase 7 — Floor + risks
Run the responsible-product floor check (rule 10) and log strategic risks and load-bearing bets as assumptions, naming where each gets tested (`/market-research` for market facts, `/discovery` for customer/problem facts).

### Phase 8 — Read back
Assemble the draft. Scan against [references/anti-patterns.md](references/anti-patterns.md); strip rejection-class symptoms. Read it back: *"Where did I get your direction wrong, and is anything missing?"* Edit for fidelity — the user's intent is the source of truth.

### Phase 9 — Write both artifacts
1. **`.ai/strategy/<slug>.md`** — structured, per [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Fill the frontmatter index (`verdict`, `north_star`, `okr_count`, `non_goal_count`) and the fixed sections.
2. **`.human/summaries/strategy.md`** — plain-English mirror: the direction in one sentence, the *why* in 3–6 bullets, and **one validated diagram** via the **mermaid skill** (a strategy-on-a-page mindmap or the North-Star metric tree). Link back to the `.ai` artifact.

### Phase 10 — Verdict
Append a progress-tracker entry on a success/refine verdict. Then issue exactly one:

- **STRATEGY-SET** — diagnosis real, North Star is value-exchange, ≥1 measurable OKR, ≥1 explicit non-goal. Hand off: when the diagnosis or distribution thesis rests on market facts, *"Next: `/market-research <slug>` to ground it"*; otherwise *"Next: `/discovery <slug>` to validate the problem."*
- **NEEDS-EVIDENCE: \<specific claim\>** — a load-bearing market or customer claim is unvalidated. Name it and the skill that settles it (`/market-research` or `/discovery`). Still write the artifact with the claim flagged as an assumption.
- **RECONSIDER: \<rationale\>** — no real diagnosis, or no measurable outcome; the strategy is theatre as written. Still write the artifact (the reasoning has value); set `status` accordingly.

If the user overrides a negative verdict, set `verdict_overridden: true`, record their reason, and route onward anyway.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). The North Star and OKRs written to `.ai/strategy/<slug>.md` are not theater: `/measure` can evaluate them against real post-ship actuals, and `/opportunity` checks strategy-fit against them. Read by: `/discovery` (the problem should serve the diagnosis; the success metric should ladder to the North Star), `/market-research` (grounds the diagnosis), `/opportunity` (strategy-fit), `/measure` (North Star + OKRs).

## Elicitation & rejection references
- Question bank (per-phase prompts, accept/reject examples): [references/question-bank.md](references/question-bank.md)
- Anti-patterns (rejection list to scan against before writing): [references/anti-patterns.md](references/anti-patterns.md)

## Slugging
Reuse the slug from `.ai/intake.md`. If none, kebab-case the idea (≤30 chars), describing the idea not the user: `freelancer-invoicing`, `ci-slack-alerts`, `running-club-rsvp`.

</supporting-info>
