# Scrum / Kanban / Dual-Track Agile

Three complementary delivery models. **Scrum** = time-boxed sprints with fixed ceremonies (empirical: transparency/inspection/adaptation). **Kanban** = continuous pull-based flow with WIP limits, optimizing flow not utilization. **Dual-track agile** = discovery and delivery run as parallel, continuous tracks (one team, the "product trio"). **Primary sources:** Scrum — Ken Schwaber & Jeff Sutherland; Kanban — David J. Anderson; Dual-track — Marty Cagan / Jeff Patton (canon: [`../05_Conventions.md` §8](../05_Conventions.md)).

## What it's for / when to use
- **Scrum:** feature/project work that benefits from a cadence, planning, and a regular review/retro loop.
- **Kanban:** continuous, interrupt-driven, or variable-arrival work (support, ops, maintenance, flow-heavy teams).
- **Dual-track:** any empowered product team — keep discovery (de-risking what to build) feeding delivery (building it) continuously, so you never hand off discovery→delivery between separate teams.
- **Scrumban:** a pragmatic blend when you want a cadence but flow-based pull.

## The steps
1. **Pick the model to fit the work** — cadence-driven (Scrum), flow-driven (Kanban), or blend (Scrumban).
2. **Scrum loop:** refine backlog just-in-time (top ~10–20 items) → sprint planning → daily standup → build → review → retrospective.
3. **Kanban loop:** visualize the workflow → set **WIP limits** per column → pull work only when capacity frees → measure flow (Cycle Time, Work Item Age, Throughput, WIP) → manage bottlenecks via Little's Law (cycle time = WIP / throughput → start less, finish more).
4. **Dual-track overlay:** the trio runs a continuous **discovery track** (interviews, prototypes, assumption tests) feeding a prioritized, de-risked **delivery track**; ideas graduate only when the riskiest assumptions are tested.
5. **Measure delivery health** with DORA + flow metrics (lead time, deploy freq, change-fail rate, recovery time) — to *learn*, never to rank people.

## Worked micro-example
A 6-person team runs **dual-track**: two members spend ~30% of the week in discovery (5 customer interviews, a prototype test on `ASM-03`), the rest deliver on a **Kanban** board with WIP limit 3 in "In Progress." When an assumption fails in discovery, the related delivery story is pulled before any code is written — saving a wasted sprint. Flow metrics show cycle time rising → they lower WIP rather than push harder.

## When NOT to use it
- **Scrum** for pure flow/unplannable interrupt work (sprints thrash) → use Kanban.
- **Kanban** when a team needs the forcing function of a cadence to ship and reflect.
- **Dual-track** misread as two separate teams handing off — that recreates the discovery→delivery wall it exists to remove.

## Common mistakes / anti-patterns
- **Velocity as a productivity or cross-team comparison metric / target**, and story points treated as a commitment (use flow metrics + Monte Carlo forecasting).
- **Agile theater / zombie Scrum / rote SAFe** — ceremonies without the empowerment and feedback they exist to enable (cargo-cult).
- **Feature factory / output roadmaps** — measuring features shipped, not outcomes.
- Planning to ~100% capacity; refining the entire backlog up front; "empowered teams" as a slogan.
- Defaulting to heavyweight SAFe everywhere (criticism mainstream; ~74% shifting to hybrid/homegrown scaling).

## Used in phases
- **Primary:** [pm-phase-10-delivery](../../.claude/skills/pm-phase-10-delivery/)
- **Also:** [pm-phase-09-stories](../../.claude/skills/pm-phase-09-stories/), [pm-phase-14-feedback](../../.claude/skills/pm-phase-14-feedback/) (Kanban support flow); dual-track threads through [pm-phase-03-discovery](../../.claude/skills/pm-phase-03-discovery/) → [pm-phase-07-solution-design](../../.claude/skills/pm-phase-07-solution-design/)

## Source
- https://blog.logrocket.com/product-management/dual-track-agile-continuous-discovery/
- https://www.atlassian.com/agile/kanban/wip-limits
- https://www.prokanban.org/blog/https-prokanban-org-blog-the-kanban-pocket-guide-chapter-6-the-basic-metrics-of-flow
