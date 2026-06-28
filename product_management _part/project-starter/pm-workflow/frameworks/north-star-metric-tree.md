# North Star Metric + Metric Tree

A single headline metric that best captures the **core value your product delivers to customers**, decomposed into 3-5 movable **input metrics** and protected by **guardrails** — a tree linking team work → customer value → business results. Primary source: **Amplitude** North Star Framework; the metric concept popularised by **Sean Ellis**. Canon: [Conventions §8](../05_Conventions.md).

## What it's for / when to use
- Defining the product's measurement system in **P01** and operationalising it in **P12** (and growth, **P15**).
- Giving many teams one shared definition of value plus the levers each can move.
- When you need a *leading* indicator of revenue that the team can actually influence.

## The steps
1. **Define the North Star** — the metric that expresses realised customer value; a leading indicator of revenue, inside your sphere of influence (a value-exchange event, not a vanity count).
2. **Find 3-5 inputs** — the levers that drive it, typically across **breadth / depth / frequency / efficiency**.
3. **Build the metric tree** — decompose each input into team-movable sub-metrics (component or influence links).
4. **Add 2-3 guardrails** — metrics that must *not* degrade (e.g. churn, latency, support load) so the star can't be gamed.
5. **Instrument & review** — act on the *inputs*; never "optimise the North Star directly." Report with cohorts and context.

## Worked micro-example
- **North Star:** weekly active teams completing ≥3 projects.
- **Inputs:** breadth = teams activated; depth = projects per team; frequency = active days/week; efficiency = time-to-first-project.
- **Guardrails:** support tickets per team; week-4 retention.
- A campaign that spikes signups but *not* completed projects is rejected — it moves a vanity number, not the star.

## When NOT to use it
- Very early pre-PMF, where you're still learning what "value" even is — use qualitative discovery first.
- As your *only* metric — pair with [AARRR](../03_Frameworks_Map.md) to find the leaky funnel stage and [HEART](../03_Frameworks_Map.md) for UX quality.

## Common mistakes / anti-patterns
- **Vanity North Star.** A star that rises while customers churn (DAU, registered users, raw revenue) — the wrong star.
- **Lone star, no inputs.** No tree means no levers, so teams try to "optimise the North Star directly."
- **No guardrails**, so the metric gets gamed at the expense of trust/quality.
- **Lagging-only** choice (e.g. raw revenue) you can't act on early.
- **Reporting without cohorts** — masks retention decay under a rising total.

## Used in phases
- **Primary:** [pm-phase-01-strategy](../../.claude/skills/pm-phase-01-strategy/) — Product Strategy & Vision; [pm-phase-12-analytics](../../.claude/skills/pm-phase-12-analytics/) — Analytics, KPIs & Instrumentation.
- **Also:** [pm-phase-15-growth](../../.claude/skills/pm-phase-15-growth/) — Product Growth & Optimization.

## Source
- https://amplitude.com/books/north-star/about-north-star-framework
- https://amplitude.com/blog/good-bad-north-star-metric
- https://mixpanel.com/blog/metric-tree/
