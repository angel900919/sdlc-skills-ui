# RICE

Score and compare initiatives by **(Reach × Impact × Confidence) ÷ Effort** so bets are ranked on expected value-per-effort rather than opinion.
**Primary source / attribution:** Intercom (Sean McBride), 2016. Canon: [`../05_Conventions.md`](../05_Conventions.md) §8 — *"RICE (Intercom)"*.

## What it's for / when to use
- General-purpose ranking of **many comparable initiatives** against a clear outcome.
- You have (or can estimate) **reach data** and roughly comparable effort sizes.
- Best when you want one transparent, auditable number to *structure a debate* — not to win it.

## The steps
1. Define the outcome/objective you're prioritizing *toward* (RICE ranks against a goal, not in a vacuum).
2. **Reach** — how many people/events per time period (e.g. users/quarter). Use real numbers.
3. **Impact** — per-person effect, on a fixed scale (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal).
4. **Confidence** — % certainty in your Reach/Impact estimates (100 / 80 / 50%). Penalises hand-waving.
5. **Effort** — total person-time (e.g. person-weeks), all functions.
6. Score = **(Reach × Impact × Confidence) ÷ Effort**. Sort, then sanity-check against strategy.

## Worked micro-example
- Feature A: Reach 2,000 users/qtr × Impact 2 × Confidence 0.8 ÷ Effort 4 pw = **800**.
- Feature B: Reach 500 × Impact 3 × Confidence 1.0 ÷ Effort 1 pw = **1,500**.
- B wins despite one-quarter the reach — high impact, certain, cheap. The score surfaces it; you still confirm it fits strategy.

## When NOT to use it
- **Time-sensitive sequencing** where delay has a rising cost — use [WSJF / Cost of Delay](wsjf-cost-of-delay.md).
- Very early/low-data teams who can't estimate reach — use [ICE](ice.md) for fast triage.
- Prioritizing the **solution backlog before the problem space** — prioritize opportunities first.

## Common mistakes / anti-patterns
- **False precision** — treating a 1,503 vs 1,498 gap as a real difference. Garbage in, garbage out: invest in the estimates, not the formula.
- **Dropping Confidence** — RICE's whole point is taxing uncertain bets; skipping it re-inflates wishful scores.
- **Framework theatre / "the spreadsheet decided"** — Intercom: *"RICE scores shouldn't be used as a hard and fast rule."* If you'll ignore the score, don't compute it.
- **Treating an AI-proposed score as objective truth** — AI can draft Reach/Impact; the PM validates the inputs aren't hallucinated.

## Used in phases
- **Phase 06 — Prioritization** (`../skills/pm-phase-06-prioritization/`) — primary.
- **Phase 05 — Roadmap** (`../skills/pm-phase-05-roadmap/`) — evidence-based bet ranking.
- **Phase 15 — Growth** (`../skills/pm-phase-15-growth/`) — ranking growth initiatives.

## Source
- https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
- https://www.productplan.com/glossary/rice-scoring-model
- https://productschool.com/blog/product-fundamentals/ultimate-guide-product-prioritization
