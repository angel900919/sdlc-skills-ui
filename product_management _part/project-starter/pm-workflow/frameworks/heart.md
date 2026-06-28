# HEART

A UX-quality measurement framework — **H**appiness, **E**ngagement, **A**doption, **R**etention, **T**ask success — operationalized through the **Goals → Signals → Metrics** process.

**Primary source / attribution:** Kerry Rodden, Hilary Hutchinson, Xin Fu — Google (2010). Canon: [`05_Conventions.md` §8](../05_Conventions.md), pinned in [`03_Frameworks_Map.md`](../03_Frameworks_Map.md).

## What it's for / when to use
- Measuring the *quality* of a user experience, not just business-funnel volume.
- Turning a fuzzy "is this good UX?" question into concrete signals and metrics.
- Evaluating a specific feature or flow — you don't need all five categories every time.

## The steps
1. Pick the HEART dimensions that matter for this feature (often 2-3, not all 5).
2. For each, state the **Goal** — what success means for the user and product.
3. Derive **Signals** — observable behaviors that indicate progress toward the goal.
4. Choose **Metrics** — specific ratios you can track over time from those signals.
5. Instrument, baseline, and review against the goal.

## Worked micro-example
A search feature. Goal = users find the right result fast. Signal = clicks a top-3 result without re-querying. Metric = % of searches with a top-3 click and no reformulation. Task-success metric = task completion rate; Happiness = post-task CSAT. If completion is high but CSAT is low, results are right but the experience still feels bad.

## When NOT to use it
- For lifecycle/business-funnel diagnosis (use AARRR) or the headline value metric (use North Star).
- A "Happiness" survey score as the *primary* KPI without behavioral grounding.
- Mandatory / forced-use software: Engagement and Adoption can mislead — apply the **honesty patch** (more usage isn't "better" when users have no choice).

## Common mistakes / anti-patterns
- Tracking all five dimensions reflexively instead of the few that fit the question.
- Skipping Goals→Signals and jumping straight to convenient metrics.
- Treating a satisfaction survey as the whole picture — be **data-informed, not survey-driven**.
- Reading Engagement as inherently good in mandatory software (the honesty caveat).

## Used in phases
- [pm-phase-12-analytics](../../.claude/skills/pm-phase-12-analytics/) (primary)
- [pm-phase-07-solution-design](../../.claude/skills/pm-phase-07-solution-design/) (usability)
- [pm-phase-03-discovery](../../.claude/skills/pm-phase-03-discovery/)

## Source
- https://www.productplan.com/glossary/heart-framework
- https://www.hyperact.co.uk/blog/product-metrics-frameworks
- https://www.statsig.com/perspectives/leading-vs-lagging-indicators-in-product-metrics
