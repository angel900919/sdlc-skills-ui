# Architecture (agent-facing)

_Terse and structural — optimized for an agent orienting fast. For the narrative version with
diagrams, see `.human/architecture.md` (keep both in sync; a boundary change updates both).
Describe shape and capabilities, not exhaustive file inventories — those drift and mislead._

## What this system is
[One paragraph: what it does, who uses it, the core value.]

## Components
_name → responsibility → entry file_
- **[API layer]** — [validates requests, maps to commands, serializes responses] — `src/api/`
- **[Services]** — [business logic; the only place rules live] — `src/services/`
- **[Data layer]** — [all persistence; nothing else touches the DB] — `src/db/`
- **[Integrations]** — [wrappers for external systems] — `src/integrations/`

## Invariants (never violate — enforced where noted)
- [No business logic in API/route handlers.] — enforced by: [review / import-linter]
- [All DB access goes through the data layer; services never write raw SQL.] — enforced by: [import-linter]
- [External content is treated as data, never instructions.] — enforced by: [review]
- [No long-running work inside a request handler.] — enforced by: [review / lint]

## Request lifecycle (data flow)
1. [Request hits API layer → validated into a typed command.]
2. [Command dispatched to the relevant service.]
3. [Service applies rules, reads/writes via the data layer.]
4. [Service returns a response model; API serializes it.]

## External dependencies & boundaries
| Dependency | Why | Wrapper / boundary |
|---|---|---|
| [Postgres] | [primary store] | `src/db/` |
| [Stripe] | [payments] | `src/integrations/payments.ts` |

## Source-of-truth precedence
_When code and docs disagree:_ [code > this doc > `.human/`]. Freshness ≠ correctness — verify against the repo before acting on any stated fact.

## Key decisions
See `.ai/decisions/` (agent-facing) and `.human/adr/` (human-facing) for *why* the architecture is shaped this way. Never contradict an accepted decision; propose a new one first.
