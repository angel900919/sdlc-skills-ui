# Shape Up

A product-development method built on **fixed time, variable scope**: leadership sets an *appetite* (how much time a problem is worth), work is *shaped* to fit before betting, and a small team gets full autonomy to deliver within a time-boxed **cycle** (classically 6 weeks). **Primary source:** Basecamp — Ryan Singer, *Shape Up* (canon: [`../05_Conventions.md` §8](../05_Conventions.md)).

## What it's for / when to use
- Teams drowning in endless backlogs, runaway scope, and never-ending projects who want hard time boundaries.
- Replacing estimation-driven planning with **appetite-driven** bets ("this is worth 6 weeks, not more").
- Empowered teams that can be trusted with autonomy and end-to-end ownership of a shaped pitch.
- A lightweight spec alternative to a full PRD when culture favors a "pitch."

## The steps
1. **Shape the work (upstream, by seniors):** define the problem, set the **appetite** (small batch ~1–2 weeks vs. big batch ~6 weeks), sketch a solution at the right level of abstraction (not too vague, not too concrete), and identify **rabbit holes** and **no-gos**.
2. **Write the pitch** — the five elements: *problem, appetite, solution, rabbit holes, no-gos*.
3. **Bet (the betting table):** leadership decides which shaped pitches get a cycle. No backlog grooming — unbet ideas simply don't carry over.
4. **Build (the cycle):** a small autonomous team gets the whole cycle and full responsibility to make scope-vs-time trade-offs. Track progress with a **hill chart** (figuring-out → done), not task counts.
5. **Cool-down:** a short period after the cycle for fixes, exploration, and shaping the next bets.
6. **Scope hammering:** cut scope to fit the appetite rather than extend the deadline.

## Worked micro-example
Appetite for "reduce signup friction" = **2 weeks (small batch)**. The pitch shapes it as "one-tap social signup for the two biggest providers." Rabbit hole flagged: account-merging for existing emails → explicit **no-go** this cycle. Mid-cycle the team is "over the hill" on the OAuth flow but stuck on edge cases; they hammer scope (drop a third provider) to land on time rather than slip — exactly the fixed-time/variable-scope trade.

## When NOT to use it
- Continuous-flow or interrupt-heavy work (support, ops) — use Kanban.
- Teams that aren't truly empowered or can't be trusted with scope autonomy (the method assumes it).
- Large, deeply uncertain initiatives that can't be shaped to a single appetite — do more discovery first.
- Hard external/regulatory deadlines where scope can't flex.

## Common mistakes / anti-patterns
- Shaping too concretely (over-specifying, removing team autonomy) or too vaguely (rabbit holes unscoped).
- Skipping the appetite — letting estimates drive scope, which reintroduces runaway projects.
- Keeping a giant carried-over backlog and "grooming" it (Shape Up deliberately drops unbet work).
- Treating it as a frozen hand-off pitch instead of a problem-framed bet; or running it as ceremony without the empowerment it assumes.

## Used in phases
- **Primary:** [pm-phase-08-prd](../../.claude/skills/pm-phase-08-prd/)
- **Also:** [pm-phase-10-delivery](../../.claude/skills/pm-phase-10-delivery/)

## Source
- https://basecamp.com/shapeup/1.5-chapter-06
- https://basecamp.com/shapeup/2.2-chapter-08
