# ARCH_SMELLS — Architecture Anti-Pattern Catalog

A flat catalog of named architecture smells. Use as the pass-6 sweep after the chapter-specific passes. Each smell has an ID; reference the ID in findings.

## How to use

Run after the other passes. Catch named anti-patterns that the per-chapter passes might have missed because the smell spans multiple chapters.

| ID    | Smell                            | Severity default | Chapter root      |
| ----- | -------------------------------- | ---------------- | ----------------- |
| AS1   | Framework-coupled entities       | Blocker          | DEPENDENCY_RULE   |
| AS2   | Leaking row structures           | Blocker          | DEPENDENCY_RULE   |
| AS3   | Naked third-party in core        | Blocker          | CLEAN_BOUNDARIES  |
| AS4   | Premature DB/UI commitment       | Major            | TWO_VALUES        |
| AS5   | Anemic boundary (no interface)   | Major            | BOUNDARIES        |
| AS6   | Vendor-shaped wrapper            | Major            | CLEAN_BOUNDARIES  |
| AS7   | Mixed architecture vocabulary    | Minor            | DEPENDENCY_RULE   |
| AS8   | Single component owned by many teams | Major        | INDEPENDENCE      |
| AS9   | No deployment story              | Minor or Major   | INDEPENDENCE      |
| AS10  | Use cases hidden in CRUD endpoints | Major          | INDEPENDENCE      |
| AS11  | Cyclic component dependency      | Blocker          | DEPENDENCY_RULE   |
| AS12  | Decorative boundary              | Nit              | BOUNDARIES        |
| AS13  | Layered diagram with no Dependency Rule check | Major | DEPENDENCY_RULE   |
| AS14  | "We'll add a wrapper later"      | Major            | CLEAN_BOUNDARIES  |
| AS15  | God service / God component      | Blocker          | INDEPENDENCE      |
| AS16  | Asymmetric volatility ignored    | Major            | TWO_VALUES        |

## Detailed descriptions

### AS1 — Framework-coupled entities
The Entity ring (innermost) imports or inherits from framework code: ORM base classes, web framework decorators, DI annotations. Reason: a framework upgrade will break the most stable code in the system.

### AS2 — Leaking row structures
DB row shapes (or wire formats) cross into the Use Case ring. The Use Case now silently depends on the DB schema. Look for: ORM models passed to use case methods; JSON request bodies named in use case signatures.

### AS3 — Naked third-party in core
A vendor SDK (payments, email, storage, observability) is imported directly from the Use Case or Entity ring. The system cannot run without the vendor available, and cannot swap vendors without rewriting core code.

### AS4 — Premature DB/UI commitment
The doc names a specific DB/UI/framework/cloud without naming the load or volatility profile that requires it. Smells like Two Values violation, but ranked here because it spans multiple chapters.

### AS5 — Anemic boundary
A boundary exists in the diagram but no interface is defined. Two components are just side-by-side with arrows. Reason: without an interface, the boundary is decorative — the components are de facto coupled.

### AS6 — Vendor-shaped wrapper
A wrapper class exists but its interface mirrors the vendor's API (same method names, same parameters). The wrapper translates nothing; replacing the vendor still requires changing every caller.

### AS7 — Mixed architecture vocabulary
Doc uses "controllers" and "services" alongside "use cases" and "gateways" alongside "ports" and "adapters" — three or more schemes mixed. Reason: readers cannot tell which ring a component belongs to.

### AS8 — Single component owned by many teams
A component listed in the doc has no owning team named, or has 3+ teams jointly owning it. Reason: Conway's law inverted — changes will collide.

### AS9 — No deployment story
The doc never describes how the system reaches production. Severity scales with cadence: monthly deploys → Minor; daily or hourly → Major.

### AS10 — Use cases hidden in CRUD endpoints
The doc lists REST endpoints (`GET /orders`, `POST /orders`) but never names the use cases. Reason: the system's intent is invisible; readers can only learn it by reverse-engineering controllers.

### AS11 — Cyclic component dependency
Component A imports component B, B imports C, C imports A. Reason: the components must be built and deployed as a single unit; ADP (Acyclic Dependencies Principle) is violated.

### AS12 — Decorative boundary
A boundary is drawn where there is no volatility difference. Splitting a cohesive unit for ceremony. Reason: extra interface to maintain, no real benefit.

### AS13 — Layered diagram with no Dependency Rule check
The doc shows layered boxes (Presentation → Application → Domain → Infrastructure) but never says which way the arrows go. Without arrow direction, the diagram is a vibe, not an architecture.

### AS14 — "We'll add a wrapper later"
The doc explicitly defers wrapping a third-party API. Reason: wrappers added later are vendor-shaped (AS6) because the codebase has already adapted to the vendor's shape.

### AS15 — God service / God component
A single component owns 5+ use cases that have nothing in common. Reason: CCP violation; the component will be modified for many independent reasons.

### AS16 — Asymmetric volatility ignored
Two pieces of functionality with very different volatility profiles (e.g., "regulatory rules that change yearly" vs "branding that changes monthly") are placed in the same component. Reason: changes to one will force redeploys of the other.

## Report format

Cite the smell ID in the finding header:

```
[Blocker] AS2 — Order row passed into CreateOrderUseCase
  Location: §4.3 "Order creation flow"
  Chapter: Clean Architecture § The Dependency Rule
  Evidence:
      "The controller passes the OrderRow ORM model directly to CreateOrderUseCase.execute()."
  Why it bites:
      Any schema change to the orders table will require modifying the use case.
  Fix:
      Define a CreateOrderInput model owned by the use case; have the controller translate.
```
