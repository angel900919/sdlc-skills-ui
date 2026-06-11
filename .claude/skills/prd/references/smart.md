# SMART check + invariant check

Two gates run in Phase 4, in this order. Both are tier-gated; at production both can **block the file write**.

## 1. Invariant check (run first — skip only if no architecture loaded)

For every functional req, NFR, and AI-card field, verify it does not violate a project invariant from `.ai/architecture[.md|/]`. Common violations:

- Invariant *"PII never leaves Postgres"* → AI card violates if it ships contact emails to a third-party model.
- Invariant *"OrderPlaced events are immutable"* → a req violates if it amends the original event on edit.
- Invariant *"Auth at the boundary; no in-component auth"* → a req violates if it embeds an auth check inside a domain component.

At **production**, additionally verify every in-scope invariant is *defended* by ≥1 Unwanted-behavior EARS clause (see [ears.md](ears.md)). A missing defense is a strict failure, not a warning.

**Characteristics check (production):** each NFR should trace to or extend one of architect's top-3 characteristics. If a feature needs a 4th characteristic not in architect's list, write a per-feature ADR or surface it as a candidate for the project's top-3.

**Tier behavior:**
- **prototype** — warn; user decides (override + note, or revise the req).
- **mvp** — warn; user must revise or explicitly accept the violation in `Notes`.
- **production** — **block file write**. Either revise the req, or run `/architect` in update mode to change the invariant (a load-bearing decision, not a PRD-level edit).

## 2. SMART check (run on every requirement)

Apply to every functional req, NFR, success metric, and kill criterion:

| Letter | Question |
| :-- | :-- |
| **S**pecific | Exactly one behavior described? |
| **M**easurable | Can you write a test with a clear pass/fail? |
| **A**chievable | Physically and economically feasible on the `anchor.md` stack? |
| **R**elevant | Traces to the JTBD or a real user concern? |
| **T**ime-bound / Testable | Time/condition explicit, or a test method named? |

**Tier behavior:**
- **prototype** — skip entirely.
- **mvp** — soft: print failing items as warnings, proceed.
- **production** — strict: **block file write** if any req fails; loop back to Phase 3 to rewrite the failing reqs.
