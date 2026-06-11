# BOUNDARIES — Architectural Boundaries

Source: *Clean Code 2nd Ed.*, Chapter 25 "Architectural Boundaries" (Robert C. Martin).

## Core claim

Architecture is the act of **drawing boundaries** between components. A boundary is a line across which:

1. **An interface is defined**, owned by the higher-level side.
2. **Dependencies cross in one direction only** — from lower-level (detail) toward higher-level (policy).
3. **The lower-level side is a plug-in** — it can be swapped without disturbing the policy side.

A well-placed boundary lets a decision behind it be **deferred** (Two Values) and **swapped** (Independence). A misplaced or missing boundary hard-locks the system.

## Smell IDs

- **B1 — Missing boundary.** Two components clearly differ in volatility or technology but share a single module with no interface between them.
- **B2 — Boundary in the wrong place.** A boundary splits a single use case (a use case half-lives on each side), or a boundary fails to split where volatility actually differs (e.g., DB and use case in the same component).
- **B3 — Wrong ownership.** The interface across the boundary is defined by the lower-level (detail) side, not the policy side. The arrow points outward.
- **B4 — Missing plug-in shape.** The lower-level side cannot be swapped; the policy side imports a concrete class rather than depending on an abstraction.
- **B5 — Premature boundary.** A boundary exists where there is no real volatility seam — splitting a cohesive unit for ceremony.

## "Business owns the interface"

The single most common architectural mistake: the database team or the UI team defines the contract, and the use cases conform to it. The fix is **inversion** — the use cases declare the interface they need, in their own terminology, and the database/UI side implements it.

```
WRONG:  UseCase  --depends-on-->  DatabaseDriver
RIGHT:  UseCase  --owns-->  DatabaseGateway (interface)
                          ^
                          | implements
        DatabaseDriverImpl
```

The arrows must point inward toward the higher-level policy. This is the **Dependency Rule** at the boundary level (see `DEPENDENCY_RULE.md`).

## The Download-and-Go test

A useful boundary sanity check: can a developer download the policy side, run its tests, and develop new features **without** the lower-level side present (no DB, no UI, no third-party service)? If yes, the boundary is real. If no, the boundary is decorative.

In-memory stubs / fakes implementing the policy-side interface are how this works in practice.

## Audit checklist

- [ ] Every component-to-component connection in the diagram has an explicit interface.
- [ ] Each interface is owned by the higher-level (policy) side.
- [ ] Arrows on the diagram all point toward policy.
- [ ] The lower-level side could be replaced by an in-memory stub for development.
- [ ] Boundaries exist *only* where the doc identifies a volatility difference. No ceremony boundaries.

## Common evidence patterns

- Diagram shows `UseCase --> PostgresAdapter` → arrow direction violates B3. Should be `PostgresAdapter ..> UseCaseGateway` with the gateway in the use case package.
- Doc says "the controller calls into the DB layer" with no interface mentioned → **B1 Major**.
- Doc has separate "models" and "DTOs" with no behavior difference, just different field names → likely **B5 Nit**.

## Fix vocabulary

- *"Define a gateway interface in the use case package; have the adapter implement it."*
- *"Flip the dependency: the lower-level component should import the higher-level package, not the other way around."*
- *"Add an in-memory stub of this gateway so the use case can be developed without the DB."*
- *"Collapse this boundary — there is no volatility difference between the two sides."*

## Cross-references

- The Dependency Rule (see `DEPENDENCY_RULE.md`) is the absolute rule for arrow direction.
- The wrapping discipline at third-party seams is in `CLEAN_BOUNDARIES.md`.
- The motivation for keeping boundaries swappable is in `TWO_VALUES.md`.
