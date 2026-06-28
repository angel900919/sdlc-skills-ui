# Lean Startup

Build businesses under extreme uncertainty by maximizing **validated learning per dollar** through a fast **Build–Measure–Learn** loop and explicit **pivot-or-persevere** decisions. Primary source: **Eric Ries, *The Lean Startup* (2011)**. (Canon: [`05_Conventions.md` §8](../05_Conventions.md); phase map: [`03_Frameworks_Map.md`](../03_Frameworks_Map.md).)

## What it's for / when to use
- New products/features where it's genuinely uncertain whether anyone wants the thing.
- When building the wrong thing is expensive and you want cheap learning before you scale.
- It supplies this workflow's gate vocabulary: every gate is a pivot / persevere / kill call.

## The steps
1. State the **leap-of-faith assumptions** — the value hypothesis (will they want it?) and the growth hypothesis (will it spread?).
2. **Build** the smallest experiment / MVP that tests the *riskiest* assumption (concierge, Wizard-of-Oz, landing page, fake door).
3. **Measure** with *actionable* metrics and cohort analysis — not vanity metrics.
4. **Learn** — did the data validate or falsify the hypothesis?
5. **Decide:** persevere (keep the strategy, optimize) or pivot (new fundamental hypothesis). Minimize total time through the loop, then repeat.

## Worked micro-example
A B2B invoicing tool believes SMBs will pay to auto-chase late payers. Instead of building automation, the team runs a **concierge MVP**: they manually send chasing emails for 10 paying pilots. Cohort result: 6/10 renew and 4 ask to expand → **persevere** and build the automation. Had only 1/10 renewed → **pivot**.

## When NOT to use it
- Known problem + known solution + low uncertainty — just build it; the loop is pure overhead.
- One-way-door, regulated, or safety-critical decisions where "ship to learn" is irresponsible.
- As a substitute for strategy — BML tells you to *iterate*, never *which bet to make*.

## Common mistakes / anti-patterns
- **Vanity metrics** (registered users, raw revenue) instead of actionable cohort metrics.
- An "MVP" that is really a small v1 — no hypothesis attached, so nothing is learned.
- Confusing **build-to-learn with build-to-earn** (Cagan): AI makes building cheap, so undisciplined "iterating" can look productive while shipping the wrong things.
- Pivoting on noise (no power) — or never pivoting because of sunk cost.
- Not pre-registering the decision rule before running the experiment.

## Used in phases
- Primary: [`pm-phase-04-opportunity`](../skills/pm-phase-04-opportunity/), [`pm-phase-07-solution-design`](../skills/pm-phase-07-solution-design/).
- Also: the whole measure→grow loop, [`pm-phase-12-analytics`](../skills/pm-phase-12-analytics/) → [`pm-phase-15-growth`](../skills/pm-phase-15-growth/), and every gate decision (pivot/persevere/kill).

## Source
- http://theleanstartup.com/principles
- https://en.wikipedia.org/wiki/Lean_startup
- https://prepvector.substack.com/p/experimentation-in-the-age-of-ai
