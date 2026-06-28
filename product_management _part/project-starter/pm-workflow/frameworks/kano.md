# Kano model

Classify features by how their *presence/absence* drives customer satisfaction — **Basic (must-be), Performance, Delighter (attractive), Indifferent, Reverse** — so you fund the right *mix*, not just the top of a list.
**Primary source / attribution:** Noriaki Kano, 1984. Canon: [`../05_Conventions.md`](../05_Conventions.md) §8 — *"Kano model (Noriaki Kano)"*.

## What it's for / when to use
- Shaping a **satisfaction strategy**: balancing table-stakes you *must* cover against delighters that differentiate.
- When a flat value/effort rank hides that some "low-value" items are actually non-negotiable basics.
- Pairs well with a value/effort or [RICE](rice.md) pass (Kano tells you *category*, not *cost*).

## The steps
1. Pick candidate features and write a **functional** + **dysfunctional** question pair for each ("How do you feel if it's present? / if it's absent?").
2. Offer the 5-point scale (Like / Expect / Neutral / Live-with / Dislike) to real customers.
3. Map each answer pair to a category via the Kano table: Must-be, Performance, Attractive, Indifferent, Reverse, Questionable.
4. Plot categories; ensure all **Must-be** items are covered, invest in **Performance** along the linear line, sprinkle a few **Attractive** delighters, drop **Indifferent**.
5. **Re-run every ~12–18 months** — delighters decay into expectations over time.

## Worked micro-example
- "Page loads under 1s" → most users *expect* it / *dislike* its absence ⇒ **Must-be** (no upside, big downside if missing).
- "In-app dark mode" → many *like* it present / are *neutral* if absent ⇒ **Attractive/delighter** today.
- Decision: fund fast load (basic) before dark mode, but ship dark mode as a cheap differentiator.

## When NOT to use it
- When you need to **sequence or estimate effort** — Kano is silent on cost; pair it, don't rely on it alone.
- Tiny samples or made-up survey answers — Kano is only as good as real customer responses.
- Fast experiment triage — use [ICE](ice.md); Kano is a deliberate, periodic study.

## Common mistakes / anti-patterns
- **One-and-done Kano** — treating a category as permanent. Today's delighter is tomorrow's table-stake (drift must be tracked).
- **No effort/cost dimension** — Kano alone over-invests in expensive delighters; combine with value-vs-effort.
- **Survey fatigue / weak data** — surveys are losing credibility (response rates collapsing); keep the instrument short and the sample real.
- **Misreading the table** — Reverse and Questionable answers signal a bad question or a segment split, not "ignore."

## Used in phases
- **Phase 06 — Prioritization** (`../skills/pm-phase-06-prioritization/`) — primary.
- **Phase 03 — Discovery** (`../skills/pm-phase-03-discovery/`) — surfacing what customers expect vs. delight in.
- **Phase 08 — PRD** (`../skills/pm-phase-08-prd/`) — scoping the must-have/delighter mix for a release.

## Source
- https://productschool.com/blog/product-fundamentals/kano-model
- https://www.surveymonkey.com/learn/market-research/kano-model-prioritize-features/
- https://www.productlift.dev/blog/product-prioritization-framework/
