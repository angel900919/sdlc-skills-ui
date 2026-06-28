# System Design vs Architecture — Advanced concepts

For someone who already holds the architecture-vs-design schema. Terse; no re-teaching.

## Advanced concepts

- **Framework = methodology + meta-model + viewpoints/views + best practices.** Beyond the five "elements" table, the source explicitly defines a framework as bundling a *methodology* (step-by-step processes), a *meta-model* (standardized concepts and relationships), *viewpoints/views*, and *best practices* — the meta-model is the part most learners miss, and it is what lets different teams' models interoperate (source: m3-frameworks).
- **Principles are stable, guidelines are volatile.** Principles ("Data is a shared asset") are intended to outlive any project; guidelines ("Use RESTful APIs") change with technology. Treat them as different governance objects with different change cadences (source: m3-frameworks).
- **Concerns map to views, and that mapping is the framework's real product.** A good framework doesn't just list views — it *maps* stakeholder concerns to specific views and ensures each voice is represented; Zachman is "especially strong here," organizing by roles × aspects (source: m3-frameworks). Detail in [11-architecture-frameworks](../11-architecture-frameworks/advanced.md).

## Edge cases & gotchas

- **The architecture/design line is project-relative.** "Perception subsystem exists" is architecture and "LiDAR vs. stereo-vision" is design (source: m3-intro) — but if a sensor choice forces a new subsystem or changes inter-block timing, a nominally "design" decision becomes architectural. The test is *effect on blocks/relationships*, not the decision's apparent size.
- **Interfaces straddle both.** Architecture *captures* interfaces (ICDs/BDDs) at the block level; design *specifies* them down to signal definitions, message schemas, data rates, and error handling (source: m3-intro). The same interface appears at two resolutions — don't treat "we wrote an ICD" as finishing interface work.
- **A framework is not its diagrams.** It is "a shared language, process, and structure," so a project can have beautiful BDDs and still lack the governance, principles, and concern-mapping that make it a framework (source: m3-frameworks).

## Performance, production & security considerations

- The source ties framework best practices to non-functional outcomes: layered architecture, microservices, DevSecOps integration, and version-control strategies are cited as ensuring compatibility, reducing vendor lock-in, and supporting auditability and scalability (source: m3-frameworks). A **Security/Risk View** (threats, controls, vulnerabilities, mitigations) is a first-class viewpoint, not an add-on (source: m3-frameworks).
- Quantitative performance/cost/scalability analysis (benchmarking, load testing, LCA/TCO/ROI, capacity planning) is design-time trade-off work owned by [12-design-tradeoffs](../12-design-tradeoffs/advanced.md) — not duplicated here.

## Where to go deeper

- **[11-architecture-frameworks](../11-architecture-frameworks/README.md)** — TOGAF's ADM phases, Zachman's 6×6 roles × interrogatives matrix, NIST EA layers (the named frameworks this topic only references) (source: m3-frameworks).
- **[12-design-tradeoffs](../12-design-tradeoffs/README.md)** — the methods behind design's "technical trade-offs" step.
- **[14-documenting-architecture](../14-documenting-architecture/README.md)** and **[08-sysml-modeling](../08-sysml-modeling/README.md)** — the BDD/IBD/ICD artifacts and SysML notation named here.
- **ISO/IEC 42010** — the documentation standard for describing architecture and architecture frameworks; the canonical reference behind the "standards" element (source: m3-frameworks).
