# AARRR "Pirate Metrics"

A lifecycle funnel that maps the customer journey into five measurable stages — **A**cquisition, **A**ctivation, **R**etention, **R**eferral, **R**evenue — so you can locate and fix the leakiest stage.

**Primary source / attribution:** Dave McClure, 500 Startups (2007). Canon: [`05_Conventions.md` §8](../05_Conventions.md), pinned in [`03_Frameworks_Map.md`](../03_Frameworks_Map.md).

## What it's for / when to use
- Diagnosing where users drop off across the *whole* lifecycle, not just signup.
- Giving product, growth, and marketing a shared funnel vocabulary.
- Best as a *diagnostic lens* paired with a North Star + metric tree: use it to find the leak, then go deep on that one stage. AARRR / HEART / North Star are complementary, not competing.

## The steps
1. Define the event for each stage in *your* product (what counts as Acquisition? Activation? etc.).
2. Instrument one clear metric per stage — a rate, not a cumulative count.
3. Build the funnel with **cohorts** so you compare like-for-like.
4. Find the stage with the worst conversion / biggest drop — the leak.
5. Form a hypothesis and experiment on that single stage; re-measure.

## Worked micro-example
A note-taking app: Acquisition 10,000 visitors → Activation (created first note) 2,000 (20%) → Retention (active in week 4) 600 → Referral (invited a teammate) 90 → Revenue (paid) 120. Activation is the leak — 80% never create a note — so the next experiment targets onboarding, not more ad spend.

## When NOT to use it
- As your *only* metric system: a funnel implies linear, one-way flow; compounding products are better modeled as Growth Loops.
- For deep UX-quality questions (use HEART) or causal proof (use experimentation).
- When you'd report cumulative totals instead of cohorted rates.

## Common mistakes / anti-patterns
- **Funnel-only thinking** that ignores self-reinforcing loops (Reforge critique).
- **Vanity-stage metrics** (signups, pageviews, downloads) treated as success.
- Reporting **retention without cohorts**.
- The "measurement gap": ~58% adopt the funnel but only ~34% actually instrument activation.

## Used in phases
- [pm-phase-12-analytics](../../.claude/skills/pm-phase-12-analytics/) (primary)
- [pm-phase-15-growth](../../.claude/skills/pm-phase-15-growth/) (as vocabulary, paired with growth loops)
- [pm-phase-11-launch-gtm](../../.claude/skills/pm-phase-11-launch-gtm/)

## Source
- https://www.productplan.com/glossary/aarrr-framework
- https://www.reforge.com/blog/growth-loops
- https://amplitude.com/blog/vanity-metrics
