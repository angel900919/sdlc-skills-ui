# System Modeling with SysML — Advanced concepts

Terse, for readers who already hold the schema (the 9 diagrams, the 7 relationships).

## Advanced concepts

- **The UML/SysML overlap is partial in both directions.** SysML reuses a *subset* of UML ("UML reused by SysML" in the Venn intersection), *adds* constructs with no UML counterpart or that replace UML ones, and leaves part of UML *not required* to be implemented in SysML. So "SysML = UML + extras" is too simple — there is UML that SysML drops (source: master-notes).
- **Relationship semantics are deliberately under-specified.** SysML does not formally define the meaning of the requirement relationships; they are "subject to interpretation." Consistent models therefore depend on team-defined heuristics, guidelines, and practices, not on the language alone (source: m2-models).
- **The requirements diagram is the primary traceability medium.** It conveys traceability among requirements *and* from requirements to the system's structures and behaviors. As new model elements are added, you create relationships from them back to the requirements that drove their creation — traceability is built incrementally, not bolted on (source: m2-models, master-notes).
- **Requirements can appear on other diagrams.** A requirement is not confined to the requirements diagram; it can appear elsewhere to show its relationship to other modeling elements (source: m2-models).
- **Composite requirements use namespace containment**, not a special arrow — the hierarchy is structural. Decomposition is what enables piecewise derivation, satisfaction, and verification (source: m2-models).

## Edge cases & gotchas

- **`copy` is read-only and re-identified.** A copied requirement's text is a read-only copy of the source's text, but it gets a *different id* and can live in a *different namespace*. Edit the source, not the copy; expecting the copy to be independently editable is a trap (source: m2-models).
- **`trace` is intentionally weak.** Its semantics carry "no real constraints," so it adds little analytic value — the material recommends preferring a more meaningful relationship and reserving trace for source-document or specification-tree links (source: m2-models).
- **`refine` is bidirectional in spirit.** A model element can refine a requirement, *or* a more elaborated text requirement can refine a less fine-grained model element — direction depends on which side clarifies the other (source: m2-models).
- **`derive` spans levels *and* abstractions.** It typically links a requirement to the next level of the system hierarchy, but it also links same-level requirements at *different levels of abstraction* (system-team requirement → hardware/software-team's more detailed version) (source: m2-models).
- **Satisfy ≠ verified.** A model can be fully satisfy-linked and still unproven — only test cases (via verify) close the gap. A "complete" satisfy mesh can give false confidence (source: m2-models).
- **Category count varies by source.** m2-models groups the nine into *four* categories (parametrics separate); master-notes groups them into *three* families (parametrics folded under structure-style analysis). Same nine diagrams, different top-level partition (source: m2-models, master-notes).

## Performance, production & security considerations

> The source material does not cover performance, production, or security aspects of SysML modeling itself. (SysML's parametric diagrams *model* performance constraints of the target system — e.g., battery-life/power equations — but that is modeling the system, not tooling performance.) (source: m2-models)

## Where to go deeper

- m2-models — the full requirement-relationship semantics and the per-diagram smart-home examples; the canonical reference for this KB's diagram and relationship definitions.
- master-notes §2 — the UML/SysML Venn description and the thermostat walkthrough.
- [09-mbse-requirements](../09-mbse-requirements/README.md) — MBSE methodology, matrices, and coverage metrics that build on these relationships.
- [14-documenting-architecture](../14-documenting-architecture/README.md) — applying BDD/IBD for architecture documentation specifically.
- [06-verifying-requirements](../06-verifying-requirements/fundamentals.md) — SMART criteria behind testable requirements that `verify` links point to.
- Visual Paradigm online docs (linked from m2-sysml) — hands-on tutorials for the free tool.
