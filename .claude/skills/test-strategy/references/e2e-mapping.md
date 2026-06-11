# Cross-feature E2E journey suite — mapping template

Consulted by Phase 6 (mvp+). The point: journeys are **system-level** assets — they outlive
any single feature — so the suite is mapped once here and only *extended* downstream.

## The mapping table

One row per `journey:` block in `.ai/understanding/<slug>.md § Behaviors`:

| journey (understanding behavior) | spec file | owning feature(s) |
| :-- | :-- | :-- |
| book-a-run | e2e/journeys/book-a-run.spec.ts | run-listing, run-rsvp |
| cancel-registration | e2e/journeys/cancel-registration.spec.ts | run-rsvp |

Column rules:
- **journey** — the behavior's `journey:` name verbatim (kebab-cased). Don't rename; downstream skills grep for it.
- **spec file** — exactly **one named file per journey**, under one canonical folder (`e2e/journeys/` default; match the E2E tool's convention). The file may not exist yet — the first owning feature's tracer bullet creates it.
- **owning feature(s)** — every `.ai/features.md` row whose `satisfies` names this behavior. Multiple owners are normal (a journey crossing two features is *why* this suite is system-level).

Cross-checks before writing:
- Every understanding behavior has a row (a journey with no row is a coverage hole — fix or record in Notes).
- Every feature in `features.md` whose `satisfies` is non-empty appears in ≥1 row (a feature touching no journey row is worth a question, not necessarily an error).

## The extension rule (record verbatim in the artifact)

> A feature's tracer-bullet slice **extends** the journey spec file mapped to its behavior —
> adding/strengthening steps in that file — and never creates a parallel journey suite.
> New spec files appear only when a new journey lands in understanding and gets a row here
> (via `/test-strategy` update mode). Enforced downstream: `/plan` puts the extension in the
> tracer bullet's acceptance; `/qa`'s regression check runs the mapped specs.

What "extend" means concretely: the tracer bullet makes the journey pass *through its
feature's thinnest path*; later features that share the journey deepen the same file
(new assertions, new branches), guarded by the owning-feature comments at the top of the spec.

## Naming + tooling

- Spec naming: `<journey>.spec.<ext>` — the journey name, not the feature name (features come and go; journeys persist).
- The E2E tool is a governed dependency (Playwright, Cypress, pytest-playwright, …): reuse from `anchor.approved_dependencies` if present, else trust-judge + `dep_adds[]`. Prototype writing the minimal artifact names no E2E tool.
- E2E specs obtain data the same canonical way as every other test — through the seed dataset and/or factories from the fixture strategy, never bespoke setup SQL inside the spec.
