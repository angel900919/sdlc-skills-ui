# CLEAN_BOUNDARIES — Wrapping Third-Party Dependencies

Source: *Clean Code 2nd Ed.*, Chapter 26 "Clean Boundaries" (James Grenning, in Martin's edited collection).

## Core claim

Every third-party dependency you do not control — vendor SDK, framework, library, external API — is a future surprise. The way to absorb the surprise is to **wrap it behind an application-shaped interface** that the policy side owns, then back the wrapper with **learning tests** and **boundary tests**.

The application-shaped interface is the key idea: the interface is shaped to **what the application wants**, not what the vendor offers. The wrapper translates.

## Smell IDs

- **CB1 — Naked third-party.** A vendor SDK type, class, or function name appears in more than one module across the codebase, with no wrapper.
- **CB2 — Vendor-shaped interface.** A wrapper exists, but its interface mirrors the vendor's API (same method names, same parameter shapes). The wrapper is decorative, not application-shaped.
- **CB3 — Missing learning tests.** The doc adopts a third-party API but has no plan for *learning tests* — small tests that pin down the vendor's actual behavior.
- **CB4 — Missing boundary tests.** No tests exist that exercise the wrapper interface against both the real vendor and a stub/fake. Without these, swapping the vendor is theoretical.
- **CB5 — Wrapper bypass.** The wrapper exists but some module imports the vendor directly anyway. The boundary leaks.

## "Application-shaped" — what it means

Imagine the application wishes the third-party API existed. **What signatures would it want?** Write that interface first, as if the wrapper were already there. Then write the wrapper to translate.

Example: a payment SDK exposes `client.charges.create(amount, currency, source, idempotency_key, metadata, ...)` with 15 fields. The application only ever needs `charge(amount_cents, customer_id, reference)`. The application-shaped interface is the three-argument form. The wrapper adapts.

## Learning tests vs boundary tests

| Test type        | Purpose                                                                         | When written                                |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------- |
| **Learning**     | Pin down what the vendor *actually does*, not what its docs claim.              | First contact with the API. Update on upgrades. |
| **Boundary**     | Verify the wrapper translates correctly between application interface and vendor. | Whenever the wrapper changes.               |

Learning tests catch silent behavior changes when the vendor releases a new version. Boundary tests catch translation bugs in the wrapper.

## Audit checklist

- [ ] Every third-party SDK/API named in the doc has exactly one wrapper module.
- [ ] The wrapper's interface uses application terminology, not vendor terminology.
- [ ] Learning tests are mentioned for each third-party API.
- [ ] Boundary tests are mentioned for each wrapper.
- [ ] No code outside the wrapper imports the vendor's types.

## Common evidence patterns

- Doc says: "We'll use the AWS SDK directly from the order service and the inventory service." → **CB1 Blocker** (no wrapper) + **B1 Major** (no boundary).
- Doc shows a wrapper `S3Client` with methods `putObject`, `getObject`, `listObjects` (literal AWS names) → **CB2 Major**.
- Doc adopts Stripe but never mentions testing strategy for the Stripe integration → **CB3 + CB4 Major**.

## Fix vocabulary

- *"Write the wrapper interface as if the vendor didn't exist yet — name the operations in your application's terms."*
- *"Centralize all imports of this SDK to a single wrapper module; the rest of the code talks to the wrapper."*
- *"Add learning tests now that pin down the vendor's behavior in the cases you actually exercise."*
- *"Add boundary tests that run the wrapper against an in-memory fake; reuse them against the real vendor in a separate test environment."*

## Cross-references

- The wrapper's interface is owned by the policy side (see `BOUNDARIES.md`).
- The wrapper is the plug-in shape (see `DEPENDENCY_RULE.md`).
- The motivation is to keep the system soft (see `TWO_VALUES.md`).
