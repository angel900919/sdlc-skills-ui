# Component naming — reject the Entity Trap

Source: Ford & Richards, *Fundamentals of Software Architecture 2e*, ch08. A component is named for **what it DOES**, not **what it IS**. Enforce in both the `.ai` component table and the `.human` diagram labels.

## The Entity Trap

Naming a component after a domain entity (a bucket) instead of an action. The symptom is an entity noun + a generic suffix. Such names hide cohesion problems — they accrete unrelated responsibilities because anything "about orders" can be dropped into `OrderManager`.

## Banned suffixes

Reject any component whose name ends in:

- `Manager` · `Handler` · `Service` · `Engine` · `Processor` · `Controller` · `Helper` · `Util` · `System` · `Module`

These describe a category, not a responsibility. Also reject **noun-only** names (`AuthSystem`, `BillingModule`) — no verb, no action.

## Rename pattern → verb-noun

State the action the component performs, present tense:

| Banned | Verb-noun |
| :-- | :-- |
| `AuthService` | `AuthenticateUser` |
| `OrderManager` | `PlaceOrder` (+ `CancelOrder`, `FulfillOrder` if separate concerns) |
| `PaymentHandler` | `ChargePaymentMethod` |
| `NotificationService` | `NotifyOrderPlaced` |
| `UserController` | `RegisterUser` / `UpdateProfile` (split by action) |
| `InventoryEngine` | `ReserveInventory` |

## The rescue probe (when a user proposes a trapped name)

Ask, one question at a time:

1. *"What does this component DO — place orders? cancel? fulfill? notify?"*
2. **One job** → rename to that verb-noun (`PlaceOrder`).
3. **Multiple jobs** → split into separate components, one per action.

A second tell: the role/responsibility statement needs `and` / `also` / `in addition`. That's a cohesion break — split the component until each has a single present-tense responsibility with no conjunction.

## Role/responsibility statement rules

- One sentence, present tense, single responsibility, no `and`/`also`.
- Name what it does NOT do when a sibling owns it: *"Accepts a validated cart and emits `OrderPlaced`. Does NOT charge payment (that's `ChargePaymentMethod`)."*
- Bad: *"Manages order-related stuff."* (vague) · *"Handles orders and notifies users and updates inventory."* (4 responsibilities via `and`).
