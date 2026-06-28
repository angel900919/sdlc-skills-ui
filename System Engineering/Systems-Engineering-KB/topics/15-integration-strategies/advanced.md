# Integration Strategies & Managing Interfaces — Advanced concepts

Terse, for someone who already holds the schema. No re-teaching.

## Advanced concepts

- **Incremental is orthogonal, not a third direction.** It can follow a top-down, bottom-up, *or* functional-flow order — so its stubs/drivers column is "maybe": you only mock whichever neighbour the current increment lacks (source: m4-integration). This is why its risk is "Low" and fault isolation "Easy" while the other two are "Moderate"/"Medium" (source: m4-integration).
- **Dependency-weight ordering as the master rule.** Across all strategies the source's strongest sequencing heuristic is "integrate components with the most dependencies earlier" — it surfaces the riskiest interactions while there is slack to fix them, and is what the 787 violated by deferring cross-supplier integration (source: m4-integration).
- **Interface contract as the unit of automation.** "Define clear interface contracts" (inputs, outputs, formats, error handling) is what makes "automate interface tests" possible — the contract is the test oracle; without it there is nothing precise to assert (source: m4-integration).
- **Continuous validation of dependencies/interfaces.** The source pushes automated testing to "validate dependencies and interfaces *continuously*", aligning integration with iterative/Agile flows (see [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md)) (source: m4-integration).

## Edge cases & gotchas

- **Dependency-order vs. buildability deadlock.** "Most-dependent first" assumes its prerequisites exist. When they don't, you must simulate missing components (stubs/drivers) to honour the order — otherwise readiness silently overrides the strategy (source: m4-integration).
- **Bottom-up's late system visibility is a safety trap.** "System-level behaviours aren't visible until late" is benign for utilities but dangerous for emergent, safety-critical behaviour — exactly the 787 all-electric power case, where system-level surges/fires appeared only under integration test (source: m4-integration).
- **Version skew creates phantom interface failures.** "Unsynchronized updates" produce interface mismatches that look like component bugs; configuration version control is the named guard (source: m4-integration).
- **Standards-less interfaces breed ambiguity.** The 787 avionics failures came from mismatched data communication standards across independently built subsystems — using interface standards "where possible" is the cited ambiguity-reducer (source: m4-integration).
- **Resource dependencies are silent.** Two components sharing memory or a database (resource dependency) may pass in isolation and fail only when co-resident — invisible to single-module tests (source: m4-integration).

## Performance, production & security considerations

The source frames production reliability through process, not runtime tuning: incomplete/incompatible supplier deliveries and incorrect software integration caused real production-scale failures (onboard fires, battery overheating) on the 787 — mitigated by earlier subsystem testing, ICDs, and bringing development in-house (source: m4-integration). The source does not cover security of interfaces specifically; treat interface-contract validation and version control as the available reliability levers.

## Where to go deeper

- **m4-integration** — the strategy-selection table and the full Boeing 787 case (the source's own primary treatment).
- **m4-review** — condensed pros/cons restatement, useful for self-quizzing.
- **Tools named for hands-on practice:** ReqView, IBM DOORS, Enterprise Architect, Cameo Systems Modeler, Postman/Swagger (source: m4-integration) — pick one to model a dependency matrix or test an API interface.
- **Adjacent topics:** ICD anatomy → [14-documenting-architecture](../14-documenting-architecture/README.md); SysML IBDs for data/control modelling → [08-sysml-modeling](../08-sysml-modeling/README.md); the V&V that *follows* integration → [16-verification-validation-methods](../16-verification-validation-methods/README.md).
