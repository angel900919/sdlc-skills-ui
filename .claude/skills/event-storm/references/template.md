# `domain-model.md` template

The skeleton for `.ai/architecture/domain-model.md`. **Structure only — no diagrams** (the event-flow picture is the `.human/summaries/domain-model.md` mirror). Hard cap **200 lines**. Multi-bounded-context projects keep each context as a `##` section in this one file, not as per-service files. Frontmatter is the index; fill only the sections the model needs.

```markdown
---
slug: <project-or-context-slug>
stage: domain-model
status: draft | complete
origin: greenfield | brownfield          # from understanding.md source field; branches the verdict
aggregate_count: <N>
event_count: <N>
hot_spot_count: <N>
verdict: READY-FOR-FEATURE-MAP | READY-FOR-ARCHITECT | NEEDS-STRATEGIC-DESIGN | NEEDS-MORE-MODELING | BLOCKED-ON-UNDERSTANDING | BLOCKED-ON-CONTEXT
verdict_overridden: false
source_understanding: .ai/understanding/<slug>.md
source_strategic: .ai/architecture/strategic-design.md   # or: none
context_file: .ai/context.md
human_summary: .human/summaries/domain-model.md
consumed_by: [ddd-strategy, architect, feature-map]
created: YYYY-MM-DD
---

# Domain model — <project-or-context>

## Aggregates
Consistency boundaries — what entity is responsible for a cluster of events.
### <AggregateName>
- identity: <field>
- invariants: <rules that must hold WITHIN this aggregate at all times>
- commands: [<PlaceX>, <CancelX>]
- events_emitted: [<XPlaced>, <XCancelled>]

## Domain events (time-ordered)
Past-tense facts. Each maps 1:1 to a downstream EARS `When` clause (see `prd/references/ears.md`).
1. <OrderPlaced> — emitted by <Order> when <PlaceOrder> succeeds
2. <InventoryReserved> — emitted by <Inventory> via policy on <OrderPlaced>

## Commands
| command | actor | aggregate | pre-conditions |
| :-- | :-- | :-- | :-- |
| <PlaceOrder> | <Customer> | <Order> | <cart non-empty, payment method valid> |

## Policies (event → command)
Reaction rules. A policy whose command lands in a different aggregate/context is a coupling decision.
- <OrderPlaced> ⇒ <ReserveInventory>   (cross-context: Order → Inventory)
- <InventoryReserveFailed> ⇒ <CancelOrder>   (compensating)

## Read models
- <OrderHistoryProjection> — denormalised UI view; built from {OrderPlaced, OrderShipped, OrderCancelled}
- <InventoryAvailability> — caches reservations for the product-list page

## Bounded-context relationships
Only the cross-boundary policies. Pattern picker: `ddd-strategy/references/integration-patterns.md`.
| other context | relationship | direction | ACL needed? |
| :-- | :-- | :-- | :-- |
| <inventory> | Customer-Supplier | we are downstream | yes |
| <billing> | Partnership | peer | no |

## Hot spots / open questions
- <ambiguous part of the model>
- <consistency claim that needs scrutiny>
```

## Field notes

- **`origin`** is read from `understanding.md` (`source_discovery` = greenfield, `source_recon` = brownfield) and decides the success verdict: greenfield → `READY-FOR-FEATURE-MAP`, brownfield → `READY-FOR-ARCHITECT`.
- **Events are past-tense; commands are imperative.** "OrderProcessed" (event) vs "ProcessOrder" (command).
- **Aggregates are consistency boundaries** — if two facts must be transactionally consistent, they share an aggregate.
- **Don't prematurely consolidate** — 20 specific events beat 5 vague ones.
- **`consumed_by`** lists `ddd-strategy` because a `NEEDS-STRATEGIC-DESIGN` round feeds this model's contexts into the strategic map; `architect` consumes it verbatim; `feature-map` turns events into behaviors.
