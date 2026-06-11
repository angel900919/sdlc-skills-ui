# EARS format

The clause syntax for production-tier functional requirements. **Cross-skill:** `/prd` writes EARS clauses + invariant defenses; `/design`, `/plan`, `/to-fitness`, and `/qa` read them. This is the canonical definition — those skills link here (one hop); do not duplicate the syntax elsewhere.

Used at **production tier only**. Every functional requirement uses one of the five templates. One behavior per clause. No free prose.

## The five templates

1. **Ubiquitous (always-on)** — *The system shall `<response>`.*
   - The system shall encrypt all data at rest using AES-256.
2. **Event-driven (When)** — *When `<trigger>`, the system shall `<response>` within `<time/threshold>`.*
   - When a freelancer taps `Bill now` on a closed session, the system shall create an invoice in Stripe and email it to the linked client within 30 seconds.
3. **State-driven (While)** — *While `<state>`, the system shall `<continuous behavior>`.*
   - While the system is in maintenance mode, the system shall return HTTP 503 to all client requests.
4. **Optional feature (Where)** — *Where `<feature>` is included, the system shall `<response>`.*
   - Where multi-factor auth is enabled, the system shall require a TOTP code on every login.
5. **Unwanted behavior (If/Then)** — *If `<unwanted condition>`, then the system shall `<recovery>`.*
   - If a Stripe webhook signature fails verification, then the system shall reject the request with HTTP 401 and log the event within 1 second.

## Which template? (decision tree)

```
Always on?                       → Ubiquitous
A specific event triggers it?    → Event-driven (When)
Holds during a specific state?   → State-driven (While)
Gated by a feature flag/option?  → Optional (Where)
Recovery from an error?          → Unwanted (If/Then)
```
None fits cleanly → the requirement is compound; split it.

Combinations (keep rare — each adds reader load): *While the user is authenticated, when the user uploads a file, the system shall scan it for malware before storing it.*

## Anti-patterns to reject

| Anti-pattern | Fix |
| :-- | :-- |
| "The system should be fast." | An NFR (number + measurement), not a functional req. |
| "Users will be able to send invoices." | User-hope, not system behavior → "When the user submits an invoice, the system shall `<do X within Y>`." |
| "When X, the system shall do A AND B." | Compound — split into one behavior per clause. |
| Implementation in the clause ("…via Redis"). | Drop it. EARS describes *what*, not *how*. |
| Free-prose paragraph. | One EARS clause per behavior; no exceptions at production. |

## SMART pairing

Every clause must also pass SMART (see [smart.md](smart.md)): **S**pecific (one behavior), **M**easurable (observable outcome — status code, latency, event, state change), **A**chievable (realistic for the `anchor.md` stack), **R**elevant (traces to a Scope capability), **T**ime-bound (the `within <time/threshold>` is filled in for event/unwanted clauses). A clause that passes EARS syntax but fails SMART is still rejected.

## Verification method (T/I/A/D)

Tag every production functional req: **T**est (executed test) · **I**nspection (review/audit) · **A**nalysis (math/proof) · **D**emonstration (walkthrough). Default: T for measurable behavior, I for compliance/docs, A for math, D for unautomatable demos.

## Invariant coverage (production only)

Every project invariant from `.ai/architecture[.md|/]` that touches the feature's scope must be **defended** by ≥1 Unwanted-behavior clause. Honoring an invariant in design is necessary but not sufficient — the PRD must commit to *actively catching* the violation so the test plan can execute it.

| Invariant (from architecture) | Defending Unwanted-behavior clause |
| :-- | :-- |
| "PII never leaves Postgres." | If a request would send a `users.email` field to a third-party API, then the system shall reject with HTTP 451 and emit `policy.pii_egress_blocked{endpoint}` within 100 ms. |
| "OrderPlaced events are immutable." | If a write attempts to amend an existing `OrderPlaced` event, then the system shall reject with HTTP 409, emit `policy.event_amend_rejected{stream}`, and not modify storage. |
| "Auth at the boundary; no in-component auth." | If an inbound request reaches a domain component without an upstream auth claim, then the system shall reject with HTTP 401 and emit `policy.boundary_auth_missing{component}` within 50 ms. |

**Tier behavior:** prototype/mvp — not enforced. production — **block file write** if any in-scope invariant lacks a defending Unwanted-behavior clause.
