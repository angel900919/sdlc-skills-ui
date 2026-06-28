# Story Mapping

A two-dimensional map that arranges user stories along the **user's journey** (horizontal "backbone" of activities/steps) and by **priority** (vertical), so you can see the whole product and slice coherent, end-to-end releases. **Primary source:** Jeff Patton, *User Story Mapping* (canon: [`../05_Conventions.md` §8](../05_Conventions.md)).

## What it's for / when to use
- Turning a flat backlog (which loses the big picture) back into a shared visual narrative.
- Finding a **coherent thin slice** — a walking skeleton that delivers value end-to-end, not a half-built feature.
- Building shared understanding across the trio/stakeholders before committing scope (P08→P09).
- Bridging strategy to releasable increments (see [Roadmap, §6 of the pack](../reference/2026_Research_Pack.md)).

## The steps
1. **Frame the goal** — who the user is and the outcome they're after.
2. **Map the backbone** — the big user activities, left→right in narrative/time order.
3. **Break activities into tasks/steps** — the things users do under each activity.
4. **Add detail stories** vertically under each step (variations, alternatives, exceptions).
5. **Prioritize vertically** — most-essential stories rise to the top of each column.
6. **Slice horizontally** — draw a line across the map for Release 1 (the thinnest walking skeleton), then Release 2, etc. Each slice must span the whole backbone.

## Worked micro-example
Backbone for a recipe app: *Find recipe → Plan meal → Shop → Cook*.
Under **Shop**: "see ingredient list", "tick off items", "export to grocery service", "auto-build cart".
Release 1 slice spans all four activities minimally: find by keyword → save to a plan → see a plain ingredient list → step-by-step view. "Auto-build cart" and "export" drop below the line into Release 2. The slice is shippable and usable end-to-end — not "the entire Shop activity and nothing else."

## When NOT to use it
- Tiny, single-feature changes where the journey is trivial (a story map is overhead).
- Pure flow/maintenance work with no user journey (use Kanban).
- As a substitute for discovery — a map of unvalidated stories just organizes guesses.

## Common mistakes / anti-patterns
- **Horizontal slicing** (a frontend-only or backend-only release) instead of vertical end-to-end value.
- Treating the map as a one-time workshop artifact rather than a **living** reference that evolves.
- Mapping at uniform depth — over-detailing "Later" steps as if they were "Now."
- Mapping solutions before the underlying job/opportunity is validated.

## Used in phases
- **Primary:** [pm-phase-09-stories](../../.claude/skills/pm-phase-09-stories/)
- **Also:** [pm-phase-05-roadmap](../../.claude/skills/pm-phase-05-roadmap/), [pm-phase-08-prd](../../.claude/skills/pm-phase-08-prd/)

## Source
- https://jpattonassociates.com/story-mapping/
- https://www.nngroup.com/articles/user-story-mapping/
- https://storiesonboard.com/blog/jeff-patton-user-story-mapping
