# Stages of the SE Process — Advanced concepts

## Advanced concepts

- **Iteration lives inside the stages.** Although the five stages run concept-to-disposal, the source explicitly notes development "often includes iterative design cycles" where testing feedback and stakeholder input drive refinement (source: m1-stages). So the linear stage list is the *phase* structure; the amount of looping/overlap is set by the chosen lifecycle model ([03-lifecycle-models](../03-lifecycle-models/fundamentals.md)) (source: m1-lifecycle).
- **V&V appears in two stages.** Validation against performance requirements is a development-stage goal (on prototypes — e.g. the satellite's thermal-vacuum and vibration tests), and verification/validation testing is also a production-stage activity (on the manufactured system) (source: m1-stages). The same words, different objects under test (prototype vs final article).
- **Constellation production differs from single-unit production.** For a multi-unit satellite constellation, the production stage adds mass production, integration, and staging of launch-ready systems — a qualitatively different production problem from a one-off build (source: m1-stages).

## Edge cases & gotchas

- **Disposal method is selected, not fixed.** A satellite's end of life is *either* a graveyard orbit *or* a controlled re-entry to burn up, depending on mission class and orbit (source: m1-stages). Picking the wrong one for the orbit violates space-debris mitigation guidelines.
- **O&M in space inverts normal maintenance.** Preventive maintenance is often limited in space, so the satellite O&M stage emphasizes careful operation and risk management rather than routine hands-on servicing — the opposite of, say, IT-infrastructure O&M, which leans on frequent patches and scaling (source: m1-stages).
- **"Testing" is not one stage.** Wind-tunnel/prototype testing = development; crash tests of prototype vehicles before full-scale production = production; stress tests on manufactured medical devices = production (source: m1-stages). The same verb maps to different stages depending on what is being tested and when.

## Performance, production & security considerations

- **Production reliability** comes from quality control plus verification/validation applied *throughout* production (and, for regulated products like medical devices, compliance with stringent regulatory standards and stress testing) (source: m1-stages).
- **Security** appears as an O&M activity: cybersecurity updates and software patches for live IT infrastructure (source: m1-stages).
- The source does not give performance benchmarks or numeric production metrics for the stages themselves.

> The source material does not cover formal stage-gate review criteria, cost models per stage, or standards (e.g. ISO/IEC 15288) by name.

## Where to go deeper

- [03-lifecycle-models](../03-lifecycle-models/fundamentals.md) — how Waterfall/V/Spiral/Agile sequence and iterate the work across these stages; the natural next topic (source: m1-lifecycle).
- [01-se-fundamentals](../01-se-fundamentals/fundamentals.md) — the definition of systems engineering and whole-life-cycle thinking that frames the stages (source: m1-stages).
- `master-notes` Section 1 — the lesson narrative positioning the stages within the introduction to systems engineering.
