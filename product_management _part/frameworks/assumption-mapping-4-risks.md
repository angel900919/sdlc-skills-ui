# Assumption Mapping / The Four Big Risks

Surface the beliefs a product idea depends on, plot them by **importance × evidence**, and test the riskiest first — framed against the **four big risks: Value, Usability, Feasibility, (Business) Viability**.
**Primary source / attribution:** The Four Big Risks — Marty Cagan / SVPG (*INSPIRED*); Assumptions Mapping + Test Cards — Strategyzer (David J. Bland & Alexander Osterwalder, *Testing Business Ideas*). Canon: [`../05_Conventions.md`](../05_Conventions.md) §8.

## What it's for / when to use
- **Before building**, to decide *what to validate first* instead of validating everything (or nothing).
- Turning a vague "is this a good idea?" into concrete, testable assumptions tied to risk type.
- Focusing a solution-validation / prototyping plan on the **leap-of-faith** assumptions.

## The steps
1. Brainstorm the assumptions the idea must be true to succeed.
2. Tag each by **risk type**: **Value** (will they want it?), **Usability** (can they figure it out?), **Feasibility** (can we build it?), **Viability** (does it work for the business/legal/ethics?).
3. Plot each on a 2×2: **Importance** (how fatal if wrong) × **Evidence** (how much we already know).
4. The top-right quadrant — high importance, low evidence — are **leap-of-faith** assumptions: test these first.
5. Write a **test card** per leap-of-faith assumption (hypothesis → cheapest test → metric → pass/fail), run it, update the map.

## Worked micro-example
New "AI meeting summarizer":
- *"Users trust AI summaries enough to send them unedited"* — **Value**, high importance, low evidence ⇒ leap-of-faith → fake-door / concierge test first.
- *"We can generate a summary within the latency budget at acceptable cost"* — **Feasibility + Viability** ⇒ technical spike + cost-per-summary check.
- *"Users can find the summarize action"* — **Usability**, lower stakes ⇒ test later in a prototype.

## When NOT to use it
- After launch when you have real usage data — measure, don't hypothesise.
- For trivial, reversible "two-way-door" decisions — just try it.
- As a one-time artifact — a frozen map stops reflecting what you've since learned.

## Common mistakes / anti-patterns
- **Only four risks** — ignoring **ethics** (Torres's 5th assumption type / responsible-product risk); add it explicitly.
- **Mapping but not testing** — a colourful 2×2 with no experiments is discovery theatre; the map exists to drive test cards.
- **Testing the easy assumptions** — comfort-testing what you already believe instead of the riskiest unknown.
- **Synthetic confidence from AI** — AI can populate the assumption space, but humans own which to bet on and guard against fabricated certainty.

## Used in phases
- **Phase 07 — Solution Design** (`../skills/pm-phase-07-solution-design/`) — primary.
- **Phase 04 — Opportunity** (`../skills/pm-phase-04-opportunity/`) — de-risking an opportunity before committing.

## Source
- https://www.svpg.com/four-big-risks/
- https://www.strategyzer.com/library/how-assumptions-mapping-can-focus-your-teams-on-running-experiments-that-matter
- https://www.producttalk.org/2023/10/five-types-of-assumptions/
