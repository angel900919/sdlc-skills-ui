# INDEPENDENCE — The Four Supports

Source: *Clean Code 2nd Ed.*, Chapter 24 "Independence" (Robert C. Martin).

## Core claim

A good architecture simultaneously supports four concerns. Each one is a different axis of independence the system must preserve as it grows.

1. **Use cases** — the architecture must make the system's *intent* visible. A reader should be able to find a use case and read it without wading through framework noise.
2. **Operation** — the architecture must let the system meet its throughput, latency, and availability targets. Where the load lives drives where the execution-model boundaries go (single process → multi-process → multi-service).
3. **Development** — the architecture must let multiple teams work in parallel without colliding. This is Conway's law expressed structurally: independent components for independent teams.
4. **Deployment** — the architecture must let the system go to production fast and often, ideally "immediate deployment" after a green build. Hand-installs, manual config, multi-day deploys are signals of failure here.

The architect's job is to partition the system into components whose **options stay open as long as possible** along each axis.

## Smell IDs

- **IND1 — Use cases invisible.** Reading the doc, you cannot find or name the system's use cases. They are buried in CRUD endpoints, services named for tables, or framework controllers.
- **IND2 — Operation assumption hidden.** The doc never states what execution model the system uses, or the chosen model is incompatible with the stated load (e.g., single-process design for "millions of QPS").
- **IND3 — Team-shape mismatch.** Component boundaries do not match team boundaries. Multiple teams own the same component, or one team owns half of two components.
- **IND4 — Deployment ignored.** The doc has no deployment story. No mention of build, ship, rollback, or environment promotion. Or: deployment requires multi-step manual installs.
- **IND5 — Premature execution-model commitment.** The doc commits to microservices, monolith, or serverless without naming the load profile that motivates the choice.

## The execution-model spectrum

The book ranges from "single process with threads" to "fully distributed services." The point is that the **right** position on this spectrum is a function of the operation requirements, not a default. A clean architecture lets the team **slide along the spectrum** without rewriting the use cases.

| Position           | What it buys                                       | What it costs                       |
| ------------------ | -------------------------------------------------- | ----------------------------------- |
| Single process     | Cheapest, simplest                                 | Limited throughput; SPOF            |
| Multi-process      | Process isolation, restart safety                  | IPC complexity                      |
| Multi-service      | Independent deploy, language choice                | Network failure modes, distrib data |
| Fully distributed  | Horizontal scale, regional failover                | Eventual consistency tax            |

If the doc names the position but not the trade, that is **IND2 Major**.

## Audit checklist

- [ ] Use cases are named explicitly somewhere in the doc.
- [ ] The execution model is stated and matched to a stated load profile.
- [ ] The team-to-component mapping is named (or it is explicit there is one team).
- [ ] The deployment story is described end-to-end: build → artifact → environment → cutover → rollback.
- [ ] At least one of the four supports is identified as "the dominant force" — what the architecture is optimized for first.

## Common evidence patterns

- Doc lists 27 REST endpoints but no use cases → **IND1 Major**.
- Doc says "we'll use Kafka" without naming the throughput or latency target that requires it → **IND2 Minor + TV1 Minor**.
- Doc has a single component owned by three teams → **IND3 Major**.
- "Deployment will be handled by ops" with no further detail → **IND4 Minor or Major** depending on cadence.

## Fix vocabulary

- *"Name the use cases in their own list before the API surface."*
- *"State the throughput target and pick the smallest execution model that supports it."*
- *"Draw component boundaries along team boundaries — one component, one team."*
- *"Write a one-paragraph deployment story: how does a green build reach production?"*

## Cross-references

- Use case visibility is enforced by the Dependency Rule (see `DEPENDENCY_RULE.md`).
- Execution-model independence is achieved by drawing the right boundaries (see `BOUNDARIES.md`).
