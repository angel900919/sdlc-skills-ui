# Product Strategy Stack

A top-to-bottom cascade where each layer derives its mandate from the layer above and feeds insight back up: **Mission → Company Strategy → Product Strategy → Roadmap → Goals**. Primary source: **Ravi Mehta** (Reforge). Canon: [Conventions §8](../05_Conventions.md).

## What it's for / when to use
- Setting or auditing product direction in **P01** so every artifact connects: a roadmap item should trace up to product strategy, company strategy, and mission.
- Diagnosing a "disconnected" org where teams ship features that don't ladder up to anything.
- Use when you already have (or are writing) a company strategy and need the product layer to be coherent with it.

## The steps
1. **Mission** — state the enduring purpose (why the company exists). Stable for years.
2. **Company strategy** — the set of choices for how the company wins (markets, moat, focus).
3. **Product strategy** — how the product advances the company strategy: the focused choices about who you serve and what value you create. Derives from the layer above.
4. **Roadmap** — the sequence of problems/bets that execute the product strategy (Now/Next/Later, not dated features).
5. **Goals** — measurable targets ([OKRs](okrs.md) / [North Star](north-star-metric-tree.md)) that tell you whether the roadmap is working.
6. **Close the loop** — push context down; pull evidence/insight back up. Each layer must stay consistent with its neighbours; if a goal can't be traced to the mission, a layer is broken.

## Worked micro-example
- **Mission:** "Help small merchants thrive online."
- **Company strategy:** win SMB commerce via the easiest all-in-one stack.
- **Product strategy:** become the *first* tool a new merchant adopts (onboarding speed as the wedge).
- **Roadmap (Now):** cut time-to-first-sale; (Next) payments; (Later) marketplace.
- **Goal:** median time-to-first-sale < 48h; activation rate +15pp this quarter.

## When NOT to use it
- There is no company strategy yet — fix that first (use [Good Strategy / Bad Strategy](good-strategy-bad-strategy.md) to forge the core choice); the stack *organises* strategy, it doesn't *generate* it.
- Tiny pre-PMF teams where the whole "stack" fits on one page — don't add ceremony for its own sake.

## Common mistakes / anti-patterns
- **Word-soup at the top.** Vision/values prose passed off as "strategy" with no real choices (Rumelt's "fluff").
- **Skipped layers.** A roadmap with no product strategy above it = feature factory.
- **Disconnected layers.** Goals that don't trace up to the mission; OKRs treated *as* the strategy.
- **Date-locked Gantt roadmap** in the roadmap layer instead of outcome-based Now/Next/Later.
- **Static stack.** Set once and never revisited; the feedback loop *up* the stack is the point.

## Used in phases
- **Primary:** [pm-phase-01-strategy](../../.claude/skills/pm-phase-01-strategy/) — Product Strategy & Vision.
- **Also:** [pm-phase-05-roadmap](../../.claude/skills/pm-phase-05-roadmap/) — the roadmap layer.

## Source
- https://www.ravi-mehta.com/product-strategy-stack/
- https://www.reforge.com/blog/the-product-strategy-stack
- https://www.lennysnewsletter.com/p/building-your-product-strategy-stack
