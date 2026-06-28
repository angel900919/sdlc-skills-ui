# WSJF / Cost of Delay

Sequence work to maximise economic value of *time*: **WSJF = Cost of Delay ÷ Job Size**, so the shortest, most time-critical, highest-value jobs go first.
**Primary source / attribution:** Cost of Delay — Don Reinertsen (*Principles of Product Development Flow*, 2009); WSJF formula formalised by **SAFe (Scaled Agile)**. Canon: [`../05_Conventions.md`](../05_Conventions.md) §8 — *"WSJF / Cost of Delay (SAFe / Don Reinertsen)"*.

## What it's for / when to use
- When **timing dominates** — value erodes (or risk grows) the longer you wait.
- Sequencing a queue of comparable jobs where you want flow/throughput, not just expected value.
- Surfacing the economic case for doing small, high-urgency items before big slow ones.

## The steps
1. List the jobs (features, enablers) competing for the same capacity.
2. Estimate **Cost of Delay** as the sum of three relative scores (Fibonacci 1,2,3,5,8,13,20):
   - **User/business value**, **Time criticality**, **Risk reduction / opportunity enablement**.
3. Estimate **Job Size** (a duration/effort proxy), also on the relative scale.
4. **WSJF = Cost of Delay ÷ Job Size.**
5. Sort descending; do the highest WSJF first, re-score as new jobs arrive.

## Worked micro-example
- Job A: CoD = value 8 + time-crit 5 + risk/opp 3 = **16**; Size 3 → WSJF **5.3**.
- Job B: CoD = 5 + 2 + 8 = **15**; Size 8 → WSJF **1.9**.
- A ships first: nearly the same delay cost but a fraction of the size — more value unlocked per unit time.

## When NOT to use it
- When timing *isn't* the dominant axis — a plain expected-value rank ([RICE](rice.md)) or [ICE](ice.md) is simpler.
- Non-comparable or one-off strategic bets where relative Fibonacci scoring is noise.
- Teams without the discipline to keep scores honest — see anti-patterns.

## Common mistakes / anti-patterns
- **Gaming the scores** — inflating Time Criticality so a pet job wins. WSJF is only as honest as the inputs.
- **Bias against platform / enabler work** — there's a growing 2026 backlash that SAFe-style WSJF systematically under-ranks infrastructure; correct via the risk-reduction/opportunity-enablement term.
- **Dogmatic WSJF making everything "urgent"** — if all Time Criticality scores are high, the lever is broken.
- **False precision** — relative Fibonacci scores aren't dollars; don't treat ratios as exact economics.

## Used in phases
- **Phase 06 — Prioritization** (`../skills/pm-phase-06-prioritization/`) — primary.
- **Phase 05 — Roadmap** (`../skills/pm-phase-05-roadmap/`) — sequencing time-sensitive bets.
- **Phase 10 — Delivery** (`../skills/pm-phase-10-delivery/`) — ordering the delivery queue.

## Source
- https://framework.scaledagile.com/wsjf
- https://www.productplan.com/glossary/weighted-shortest-job-first
- https://roadmap.one/blog/posts/blog8-4-wsjf-prioritisation/
