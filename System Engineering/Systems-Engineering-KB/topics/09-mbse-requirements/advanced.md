# Requirements in Model-Based Systems Engineering (MBSE) — Advanced concepts

Terse, for readers who already hold the schema from [fundamentals.md](fundamentals.md).

## Advanced concepts

- **Extensibility lineage of stereotypes.** The SysML stereotype comes from UML and is **one of three UML extensibility mechanisms**. A stereotype is more than a label: it can carry its own **properties**, so a single tag can define a typed, queryable dimension across the model (source: m2-mbse).
- **Modeling-strategy spectrum.** Three valid postures: (1) everything as **generic** requirements; (2) use **all** offered types plus **custom** types for a sophisticated model; (3) a **middle course** — business requirements + generic requirements with stereotypes + other types as needed. There are no strict rules dictating which (source: m2-mbse).
- **Diagram granularity by level.** High-level requirement diagrams can show only decomposition plus traceability to source documents and the SRD; system-level diagrams can carry more elements and several requirements at once — but risk becoming too busy. The discipline is to relate elements (so any view can be regenerated) rather than co-locate them in one diagram (source: m2-mbse).
- **Matrices as bidirectional, negatable verification tools.** All dependency matrices can show a relationship in **one or both directions** *and* the **negative space**, and they **auto-update** when the underlying relationship changes — making them live verification instruments, not static reports (source: m2-mbse).
- **Coverage as a time series.** Each coverage metric records a **timestamp**; the analytical value is in re-measuring the same metric periodically to monitor an aspect of the model over time, not in any single value (source: m2-mbse).
- **Dependency map as impact-analysis instrument.** A top-of-tree dependency map shows *all* relationship types involving the root requirement, across multiple levels, and how it reaches other domains (testing, security, documentation, behavior) — enabling impact projection for a change at the top or middle of the tree (source: m2-mbse).

## Edge cases & gotchas

- **Empty column ≠ orphan.** A business requirement's "Derived From" is *expected* empty (rule, not error); an orphaned business requirement is one mapped to nothing (no outgoing derive). The negative matrix lists both — apply the type rules to separate expected empties from real orphans (source: m2-mbse).
- **Wrong-direction errors pass syntax checks.** A backwards relationship is structurally valid SysML; only the *type-hierarchy* rules (business high-level, system low-level) expose it, which is why the table/matrix views matter (source: m2-mbse).
- **Depth creep.** Adding package layers to express new dimensions silently degrades navigation; the fix is stereotypes plus a wider/flatter redesign once you pass ~3 layers (source: m2-mbse).
- **One-diagram-fits-all.** A combined high-level + system-level diagram with many requirements becomes hard to understand; split by level (source: m2-mbse).

## Performance, production & security considerations

- **Secure by design (SEI CERT).** SEI CERT researches MBSE to mitigate security risks **early** so systems are secure by design, versus the common practice of adding security features later. Security requirements are modeled as non-functional "ilities" (security, etc.) (source: m2-mbse).
- **Security control element (forward pointer).** The source's requirement diagram (Figure 6) includes a special **security control** element type, but the article explicitly **defers** discussing security controls and their connection to security requirements to a future post — treat this as a pointer, not as content to reproduce (source: m2-mbse).
- **Capabilities in MBSE (forward pointer).** The article forward-references a future post on **capabilities**: a system's capabilities appear when product/project managers view the system at the level of vision and development roadmap; focusing on capabilities gives an implementation-independent view, and capabilities — like requirements — are elements of the problem description, tightly connected to and refining requirements, and can be associated with **business requirements**. Detail is deferred to that future post (source: m2-mbse).

## Where to go deeper

- **m2-mbse** itself — the SEI CERT blog-style article; re-read the Analytical Tools section for the matrix/metric/map distinctions (source: m2-mbse).
- The author's prior post *An Introduction to Model-Based Systems Engineering (MBSE)*, referenced for "language as one of four instruments used by modeling," which motivates the choice of SysML (source: m2-mbse).
- SysML relationship grammar (derive/refine/satisfy/verify and the rest): [08-sysml-modeling](../08-sysml-modeling/advanced.md).
- Traceability practice and tooling: [07-requirements-management](../07-requirements-management/advanced.md).
- Glossary: [references.md#glossary](../../references.md#glossary).
