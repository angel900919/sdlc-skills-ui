# 0001 · <decision title>  _(example — delete)_

- **Date:** 2026-07-05   **Status:** accepted   **Decider:** <name>   **Reversibility:** one-way / reversible

## Context
> The forces at play — what made this a real decision, and why now.
<e.g. We need a datastore; access patterns are relational with strong consistency needs.>

## Options considered
| Option | Pro | Con |
|---|---|---|
| _(example)_ Postgres | relational, ACID, team knows it | ops overhead |
| _(example)_ Mongo | flexible schema | weak multi-doc txns |

## Decision
<what we chose, in one sentence.> **We chose Postgres.**

## Why (the trace — this is the load-bearing part)
> Capture the reasoning a future agent/human needs to *decide from precedent*, not just the outcome.
<the reasoning; the numbers; the constraint that tipped it.>

## Runner-up wins if…
<the condition that would reverse this — e.g. "if per-tenant schema isolation becomes a hard requirement.">

## Consequences / invariants created
- Adds invariant: <e.g. "money is integer cents"> → recorded in `../architecture.md`.
