# DEPENDENCY_RULE — The Single Most Load-Bearing Rule

Source: *Clean Code 2nd Ed.*, Chapter 27 "The Clean Architecture" (Robert C. Martin).

## Core claim

**Source-code dependencies must point inward** toward higher-level policy. The Clean Architecture is the schematic four-ring drawing — Entities, Use Cases, Interface Adapters, Frameworks & Drivers — but the schematic is illustrative; the **rule** is what matters.

When control needs to flow outward (a use case needs to write to the DB), invert the dependency with an interface owned by the inner ring. The control flows out at runtime; the source code dependencies still point in.

The Hexagonal Architecture (Cockburn), DCI (Coplien & Bjørnvig), and BCE (Jacobson) all converge on this same rule. The Clean Architecture is one labeling of the rule, not the rule itself.

## The four rings

| Ring | Contains | Knows about            |
| ---- | -------- | ---------------------- |
| **Entities**         | Enterprise-wide business rules. The most stable code. | Nothing else.                                  |
| **Use Cases**        | Application-specific business rules.                  | Entities.                                      |
| **Interface Adapters** | Controllers, presenters, gateways. Translate.       | Entities, Use Cases.                           |
| **Frameworks & Drivers** | Web framework, DB driver, devices, UI.            | Everything outside (this is where details live). |

The rule: **no source code in an inner ring may reference anything in an outer ring**.

## Smell IDs

- **DR1 — Outward dependency in source.** An Entity or Use Case imports an Interface Adapter or Framework. Blocker.
- **DR2 — Row structure crossing inward.** A struct/class shaped like a DB row (or a JSON wire format, or a UI form) is passed into a Use Case. The inner ring now depends on the outer ring's data shape.
- **DR3 — Framework leakage.** A Use Case has a framework annotation, base class, decorator, or import (e.g., `@Controller`, `extends ActiveRecord`, `import flask`).
- **DR4 — DIP missing at boundary.** Control needs to flow outward (Use Case writes to DB), but no interface owned by the Use Case exists. The Use Case directly calls the adapter.
- **DR5 — Wrong ring placement.** Code in the wrong ring: business rules living in a controller; framework code living in an entity; presentation logic living in a use case.
- **DR6 — Pattern inconsistency.** The doc mixes hexagonal vocabulary (ports/adapters) with Clean Architecture vocabulary (entities/use cases) without picking one — or worse, places the boundaries inconsistently between the two schemes.

## How to invert when control flows outward

```
Inner ring needs to call outer ring:

WRONG (source dependency outward):
  UseCase  --imports-->  PostgresOrderRepository

RIGHT (source dependency inward, runtime control still outward):
  UseCase  --imports-->  OrderRepository (interface, in UseCase ring)
                          ^
                          | implements
  PostgresOrderRepository  (in Frameworks ring)
```

The implementation arrow points inward in source code (Postgres → interface). At runtime, control flows outward (Use Case → interface → Postgres). This is DIP applied at the boundary.

## "No row structures crossing inward"

The single most common Clean Architecture violation: a DB row class (or ORM model) is passed directly into a Use Case. Now any DB schema change ripples into the Use Case. The inner ring depends on the outer ring's data shape, even if the source-code arrow appears correct.

The fix: Use Cases work with **input/output models** that they own. The Interface Adapter ring translates between row structures and these models.

## Audit checklist

- [ ] The doc names the four rings (or equivalent — ports/hexagons/BCE) explicitly.
- [ ] All arrows on the diagram point inward.
- [ ] No inner-ring module imports anything from an outer ring.
- [ ] No outer-ring data shape (row, DTO, form, JSON) is referenced by name inside a Use Case or Entity.
- [ ] Where control must flow outward, an inverted interface is defined and the dependency direction is inverted.
- [ ] One architectural pattern is named and used consistently throughout the doc.

## Common evidence patterns

- Use case named `CreateOrderUseCase` imports `OrderEntity` from the ORM layer → **DR2 Blocker**.
- Use case has `@Transactional` or `@RequestMapping` annotations → **DR3 Blocker**.
- Diagram has an arrow from `UserService` to `MySQLAdapter` → **DR1 Blocker** + **DR4 Major**.
- Doc says "we use hexagonal architecture with controllers and DTOs" — uses words from three different schemes → **DR6 Minor**.

## Fix vocabulary

- *"Define this gateway interface in the Use Case package; have the adapter implement it."*
- *"Add input and output models for this use case so it doesn't see the DB row shape."*
- *"Move this framework annotation out to a controller; the use case is pure application logic."*
- *"Pick one of {Clean, Hexagonal, BCE} and use its vocabulary throughout the doc."*

## Cross-references

- The motivation for inward arrows is to keep the system soft (see `TWO_VALUES.md`).
- The Dependency Rule is the absolute form of "business owns the interface" (see `BOUNDARIES.md`).
- Wrapping third-party deps (see `CLEAN_BOUNDARIES.md`) is how the Dependency Rule is preserved at the framework ring.
