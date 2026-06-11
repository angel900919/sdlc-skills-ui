# DDD decision heuristics

Distilled from Chapter 10 "Design Heuristics" of *Learning Domain-Driven Design* by Vlad Khononov. Heuristics are starting points that work in most cases — they identify the questions to ask when they don't apply, not laws to follow blindly.

## Subdomain classification

| Type | Signals |
|---|---|
| **Core** | Source of competitive advantage; intricate; evolves often; competitors don't have it; failure threatens the business |
| **Supporting** | Necessary but not differentiating; simpler than core; could be built in-house cheaply; failure is painful but survivable |
| **Generic** | Solved problem; commercial/OSS software exists; no competitive value; failure is annoying |

**Rule of thumb:** if you can buy it, it's generic. If you must build it *and* the business depends on it being better than competitors', it's core. Everything else is supporting. Default to supporting when unsure; require evidence for core. A "core" subdomain with no intricate rules isn't really core — re-classify it.

## Bounded-context size

- A bounded context is **as wide as the ubiquitous language stays consistent**.
- The fine-grained lower bound is one context per subdomain — never decompose further.
- Decompose when the language drifts (the same term means different things), not when a service "feels large."
- Wider contexts are easier to evolve; narrower ones are easier to scale teams around. **Start wider, split on language drift.**

## Business-logic pattern picker

```
Generic subdomain                            → Buy / adopt OSS
Supporting + essentially CRUD                → Transaction script
Supporting + data shape dominates            → Active record
Core + intricate rules, invariants matter    → Domain model
Core + history / audit / temporal queries    → Event-sourced domain model
```

If a "core" subdomain has no intricate rules, it isn't really core — re-classify it.

## Architectural pattern picker

```
Transaction script / active record   → Layered architecture
Domain model                         → Ports & adapters (hexagonal)
Event-sourced domain model           → CQRS (read models derived from event stream)
Many integration points / heavy I/O  → Ports & adapters regardless of logic pattern
```

These are *suggestions* recorded per context in `strategic-design.md`. The binding architecture-style decision for the whole system is `/architect`'s — this skill proposes, `/architect` decides and reconciles.

## Testing strategy by pattern

| Business-logic pattern | Test emphasis |
|---|---|
| Transaction script | Integration tests through the script + DB |
| Active record | Tests against records with seeded data |
| Domain model | Pure unit tests on aggregates; thin integration suite for repositories |
| Event-sourced | Given/When/Then over events; replay-based tests |

## When NOT to apply DDD

- Skip strategic patterns on generic subdomains entirely.
- Skip the domain model on simple CRUD even if the subdomain feels "important."
- A heuristic loses to a stronger constraint (regulation, performance, team capability).
- A single bounded context with no language drift needs **no** context map — say so and route to `/architect` rather than manufacturing contexts.

## Apply by chaining

Subdomain type → business-logic pattern → architectural pattern → testing strategy → integration pattern with neighbors. Each downstream choice is constrained by the upstream one; re-derive the chain when the upstream changes (ch 11 "Evolving Design Decisions").
