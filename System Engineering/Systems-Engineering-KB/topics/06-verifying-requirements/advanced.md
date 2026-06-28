# Verifying Requirements — Advanced concepts

## Advanced concepts

- **The two SMART variants are not interchangeable in intent.** m2-verify's **Testable** makes verifiability the explicit final gate (inspection/test/analysis/demonstration); master-notes' **Time-bound** instead forces a deadline or performance time frame into the statement (e.g., "within two seconds") (source: m2-verify, master-notes). A rigorous requirement often satisfies *both* — measurable + a method to test it + a time frame — even though no single source lists six letters.
- **IEEE 830-1998 carries verification and traceability fields by design.** Beyond clarity, the template specifies a *verification method* (so the requirement is testable) and a *source* field that tracks stakeholder input (improving traceability) — these two fields are what make a templated requirement reviewable and traceable, not just readable (source: master-notes).
- **Templates and models are complementary, not alternatives.** Standardized text templates give consistent structure; system modeling then *translates the textual requirement into a visual representation to identify gaps, inconsistencies, and conflicts before development* and lets engineers and stakeholders validate behavior early (source: master-notes). Use text for the contract, model for the relationships.

## Edge cases & gotchas

- **Measurable but not testable.** A quantity without an operating condition can still be impossible to verify reproducibly; the template's `[under defined conditions or context]` slot is the fix (source: m2-verify).
- **Clear ≠ verifiable.** Robot requirement #5 ("sleek and modern design") is a grammatical, clear sentence yet fails because aesthetic terms are subjective and untestable (source: m2-ex-verify).
- **Walkthrough vs peer review formality.** They are easy to conflate; the distinction is structure — peer review is the structured activity, the walkthrough is author-led and informal (source: m2-verify).
- **Verification vs validation drift.** "V&V" said as one phrase hides that requirement-quality verification is an *early* gate, separate from validating the delivered system later — see [16-verification-validation-methods](../16-verification-validation-methods/fundamentals.md) (source: m2-verify).

## Performance, production & security considerations

The source material frames the production payoff as cost and risk timing, not runtime performance: verifying (and getting feedback on) requirements *before* development is far cheaper than changing them mid-project, and only-defined, incomplete, or unrealistic requirements lead to costly failures, delays, and stakeholder dissatisfaction (source: master-notes, m2-verify). Beyond that framing, the sources do not cover security or runtime-performance aspects of requirement verification.

## Where to go deeper

- **SysML requirement diagrams** (derive / satisfy / verify / refine relationships and traceability to tests) → [08-sysml-modeling](../08-sysml-modeling/README.md) — the home topic for the modeling aid referenced here (source: m2-verify, m2-sysml).
- **Requirement management standards & tools** (ISO/IEC/IEEE 29148, DOORS, Jama, ReqView) → [07-requirements-management](../07-requirements-management/README.md) — where verified requirements are traced and maintained (source: master-notes).
- **System verification & validation methods** (testing the built system) → [16-verification-validation-methods](../16-verification-validation-methods/README.md) — the downstream counterpart to verifying statements (source: m2-verify).
- **IEEE 830-1998 / ISO/IEC/IEEE 29148** — the requirement-specification standards named by the sources; consult for full template fields (source: master-notes).
