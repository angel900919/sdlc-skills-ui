# Product-Led Growth + Growth Loops

**Product-Led Growth (PLG):** the product itself is the primary engine of acquisition, conversion, and expansion (minimize time-to-value; let users experience value before paying). **Growth Loops:** self-reinforcing systems where the output of one cycle feeds the next input — compounding, unlike linear funnels that leak. **Primary sources:** PLG — OpenView; Growth Loops — Reforge / Brian Balfour (canon: [`../05_Conventions.md` §8](../05_Conventions.md)).

## What it's for / when to use
- Products where users can self-serve to value (low-friction signup, fast aha moment).
- Replacing funnel thinking — funnels silo acquisition/product/monetization and treat growth as one-directional; loops connect them and compound.
- When **retention/NRR** (not raw acquisition) must drive growth — a flattening retention curve is real PMF.
- Note: **hybrid PLG + SLG** now dominates (~67% above $10M ARR; PQLs convert ~25–30% vs ~5–10% MQLs) — pure PLG dogma is outdated.

## The steps
1. **Define the growth model:** `Growth = (Acquisition + Retention + Monetization) × Defensibility`. Pick the loop type that fits (content, viral/output-sharing, paid, sales-assisted).
2. **Nail activation:** identify the **aha moment** (the felt value) and the measurable **activation event**; minimize **time-to-value**.
3. **Design the loop:** map input → action → output → re-input. Example: user creates value → shares output → recipient signs up → creates value → shares again.
4. **Instrument everything** (event-based analytics); track activation, retention curve, and NRR — not vanity signups.
5. **Prove causality with experiments**, not correlation; remove the loop's current bottleneck (AI changes *which* step bottlenecks, not the fundamentals).
6. **Match monetization** to traffic/TTV (freemium, free trial, reverse trial, usage-based) and layer **product-led sales** (PQLs) where it lifts conversion.

## Worked micro-example
A design tool's **output-sharing loop**: a user exports a deck with a subtle "Made with Acme" link → a viewer clicks → signs up → makes their own deck → exports → shares again. The team measures activation as "published first deck within 7 days" (currently 28% — below the ~25–40% healthy band only at the low end), finds onboarding friction is the bottleneck, and replaces the product tour with **one action toward the aha moment**, lifting activation and feeding the loop faster.

## When NOT to use it
- High-touch, complex, high-ACV enterprise sales where the product can't self-demonstrate value (lead with SLG; layer PLG later).
- Products with no natural self-serve path to value or a long, irreducible time-to-value.
- As a reason to skip sales entirely ("pure PLG, no sales ever" is a discredited dogma).

## Common mistakes / anti-patterns
- **Funnel-only thinking** and acquisition-first / "build it and they will come."
- **Vanity metrics** (signups, pageviews, downloads); the measurement gap — 58% use PLG but only 34% track activation.
- Product/channel/monetization **silos**; generic one-size onboarding **tours** instead of one action to the aha moment.
- Defaulting to freemium with no value model; growth "hacking" as a bag of tricks; **manipulative engagement / dark patterns** dressed up as "retention."

## Used in phases
- **Primary:** [pm-phase-15-growth](../../.claude/skills/pm-phase-15-growth/)
- **Also:** [pm-phase-11-launch-gtm](../../.claude/skills/pm-phase-11-launch-gtm/), [pm-phase-12-analytics](../../.claude/skills/pm-phase-12-analytics/)

## Source
- https://www.reforge.com/blog/growth-loops
- https://www.reforge.com/blog/product-led-growth
- https://www.statsig.com/perspectives/plg-metrics-activation-retention
