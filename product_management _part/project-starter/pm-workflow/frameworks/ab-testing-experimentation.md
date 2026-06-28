# A/B Testing & Online Controlled Experiments

Randomized controlled experiments that establish the *causal* impact of a change on a chosen metric by splitting traffic between variants and comparing outcomes.

**Primary source / attribution:** randomized-experiment lineage from R.A. Fisher; the modern online-controlled-experiment canon is Ron Kohavi, Diane Tang & Ya Xu, *Trustworthy Online Controlled Experiments* (Cambridge, 2020), incl. the OEC (Overall Evaluation Criterion). Experimentation is pinned to [pm-phase-13-experimentation](../../.claude/skills/pm-phase-13-experimentation/) in [`03_Frameworks_Map.md`](../03_Frameworks_Map.md).

## What it's for / when to use
- Proving a change *causes* a metric move, not just correlates with one.
- High-traffic, reversible decisions with a clean metric and enough statistical power.
- Comparing concrete variants at the margin (copy, flow, model, price, layout).

## The steps
1. Write a **falsifiable hypothesis**: "We believe [change] causes [effect] for [segment], measured by [metric], because [insight]."
2. Pre-register the design: primary metric (**OEC**) + 2-3 guardrails, MDE, alpha, power.
3. Run a **power analysis** up front for required sample size and duration (full business cycles).
4. Randomize; verify trustworthiness with **A/A and SRM checks**.
5. Don't peek naively in fixed-horizon tests (or use sequential / always-valid methods).
6. Decision rule: ship only if **primary wins AND no guardrail is breached**.

## Worked micro-example
Hypothesis: one-click checkout raises purchase conversion for returning users. Power analysis → 40k users/arm over 2 weeks. The variant lifts conversion +4% (p<0.05, sequential) but the refund-rate guardrail rises 2% (not significant). Primary wins, no guardrail breached → ship. Without the guardrail you'd have shipped blind to refund risk.

## When NOT to use it
- Low traffic / underpowered — no clean metric or can't reach significance.
- Irreversible or strategic ("one-way door") decisions, and compliance/legal changes.
- Obvious changes where experiment cost outweighs the learning.
- Some AI features: dynamic variants and self-contaminating loops break classic A/B — use permanent holdouts or interleaving instead.

## Common mistakes / anti-patterns
- **Peeking**: stopping at the first p<0.05 with no sequential correction.
- Significance on tiny samples with no power analysis.
- Conflating **statistical** with **business** significance.
- Uncorrected multiple comparisons / cherry-picking; "Bayesian = a license to peek."
- Dropping guardrails for velocity; A/B-testing everything.

## Used in phases
- [pm-phase-13-experimentation](../../.claude/skills/pm-phase-13-experimentation/) (primary)
- [pm-phase-15-growth](../../.claude/skills/pm-phase-15-growth/)
- [pm-phase-12-analytics](../../.claude/skills/pm-phase-12-analytics/)

## Source
- https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59
- https://www.geteppo.com/blog/comparing-frequentist-vs-bayesian-approaches
- https://www.statsig.com/perspectives/power-analysis-ab-testing
