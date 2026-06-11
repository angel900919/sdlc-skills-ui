# TWO_VALUES — Behavior vs Structure

Source: *Clean Code 2nd Ed.*, Chapter 23 "The Two Values of Software" (Robert C. Martin).

## Core claim

Software has two values:

1. **Behavior** — what the system does today. Visible, urgent, easy to measure.
2. **Structure** — how easy it is to change what the system does. Invisible, important, easy to defer.

Structure is the greater value because hard-locked behavior with brittle structure becomes useless the moment the requirements shift. A good architecture **keeps the system soft** — that is, *cheap to change*.

## Smell IDs

- **TV1 — Premature commitment.** The doc commits to a specific DB, framework, UI, or cloud vendor without justifying why that decision is needed *now*.
- **TV2 — Behavior over structure trade.** Doc explicitly trades structural decisions ("we'll keep them coupled for now") for short-term behavior delivery, without naming the cost or a date to re-soften.
- **TV3 — Policy and detail tangled.** Business rules (policy) live in the same module/file/component as I/O, framework code, or vendor SDKs (detail).
- **TV4 — Missing rationale.** A technology choice is stated but no "what does this lock us out of?" question appears anywhere in the doc.

## What "softness" means concretely

- A decision is **kept soft** when it remains reversible: the system can swap the choice with bounded effort, ideally just touching one module.
- A decision is **hardened** when reversing it touches many modules, requires migrations, or breaks behavior contracts.

The architect's job is to **maximize the number of decisions not yet made** when the design is shipped.

## Audit checklist

- [ ] Every technology choice in the doc has a one-line rationale answering "why now?"
- [ ] Reversible decisions are explicitly listed as reversible.
- [ ] Hardened decisions are explicitly listed with the cost of reversal.
- [ ] Policy modules (use cases, entities, business rules) do not import detail modules (drivers, vendor SDKs, frameworks).
- [ ] If the doc says "MVP" or "for now," it names a specific re-softening point.

## Common evidence patterns

- The doc says: "We will use PostgreSQL." → ask: is the persistence interface defined? Could we swap to DynamoDB later? If not stated → **TV1 Blocker**.
- The doc says: "The use case will use Stripe's SDK directly." → policy depends on a vendor. **TV3 Blocker**.
- The doc says: "We'll worry about deployment later." → may be fine if deployment is genuinely deferrable, but check that core decisions don't presume a deployment model. If they do → **TV2 Major**.

## Fix vocabulary

- *"Defer this decision behind an interface owned by the policy side."*
- *"Move the SDK call into a wrapper at the boundary; have the use case depend on the wrapper's interface, not the SDK."*
- *"Name this decision as Hardened in the doc and write down what reversing it costs."*

## Cross-references

- The Dependency Rule (see `DEPENDENCY_RULE.md`) is the operational form of "policy must not depend on detail."
- Boundary placement (see `BOUNDARIES.md`) is how you actually keep things soft once you've decided what to defer.
