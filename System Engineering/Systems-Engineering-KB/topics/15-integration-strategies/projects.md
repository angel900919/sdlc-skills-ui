# Integration Strategies & Managing Interfaces — Projects

Both projects ask you to produce an **integration strategy plus a dependency/interface management plan** for a chosen system. Ground every decision in the strategy-selection table and the dependency/interface practices (source: m4-integration).

## Guided project — Integration plan for a smart-home hub

**Goal.** Produce a one-page integration plan for a smart-home hub with five components: `sensor-driver` (low-level), `device-driver` (low-level), `automation-engine` (mid, control logic), `mobile-app` (high-level UI), and `cloud-sync` (high-level service). Some are not yet built (you decide which, realistically).

**Requirements.**
- Choose ONE primary strategy (top-down / bottom-up / incremental) and justify it from the selection table (source: m4-integration).
- Build a **dependency table**: for each component list what it depends on and the dependency type (data / control / timing / resource) (source: m4-integration).
- State the **integration order**, applying "integrate most-dependent components earlier" (source: m4-integration).
- For each not-yet-built neighbour, specify whether you write a **stub** or a **driver** and why (source: m4-integration).
- List the **interfaces** (hardware / software / human-machine) and, per interface, the management practice you apply: define early via ICD, use a standard, validate independently, automate the test, monitor version compatibility (source: m4-integration).

**Suggested steps & "done" criteria per checkpoint.**
1. *Inventory.* List the 5 components, mark built vs. not. **Done:** readiness table complete.
2. *Dependencies.* Fill the dependency table; classify each. **Done:** every dependency has a type.
3. *Strategy.* Choose and justify against the table (testing-start, stubs/drivers, fault isolation, risk). **Done:** one paragraph naming the column(s) that decided it.
4. *Order + placeholders.* Sequence the integration; assign a stub/driver to each missing neighbour. **Done:** ordered list, each step naming any placeholder.
5. *Interfaces.* Tabulate interfaces with one management practice each. **Done:** every interface has a type and a practice.

## Independent (challenge) project — Integration & risk plan for a complex, outsourced system

**Goal.** Pick a genuinely complex, multi-supplier system (e.g., an electric vehicle, a delivery drone, or — mirroring the source — an aircraft subsystem) and write an integration strategy plus dependency/interface management plan that would have avoided Boeing-787-style failures (source: m4-integration).

**Constraints (only):**
- At least 6 components from at least 2 notional suppliers, with at least one all-electric / safety-critical subsystem.
- Identify at least one **dependency risk** (incomplete/incompatible delivery) and one **interface risk** (mismatched communication standard) and the practice that mitigates each (source: m4-integration).
- Justify the strategy *and* defend an explicit decision about in-house vs. outsourced development, citing the 787 lesson (source: m4-integration).
- Specify which tools/techniques you'd use to manage it (ReqView, IBM DOORS, Enterprise Architect, Cameo, Postman/Swagger; dependency matrices, SysML IBDs, automated testing) (source: m4-integration).
- Cumulative: reference an ICD ([14-documenting-architecture](../14-documenting-architecture/README.md)) and a SysML IBD ([08-sysml-modeling](../08-sysml-modeling/README.md)) for at least one interface.

## Build notes & solution sketch

- **Architecture of the plan.** Three artifacts: a dependency matrix (who-needs-whom), an ordered integration sequence with placeholders, and an interface register with one management practice per interface (source: m4-integration).
- **Key decision — strategy.** Let the dominant risk pick it: control-architecture risk → top-down (early architecture validation); critical-infrastructure risk → bottom-up; continuous delivery / fault-isolation priority → incremental (source: m4-integration). Don't default to one out of habit.
- **Key decision — placeholders.** Direction is mechanical: missing *below* → stub; missing *above* → driver (source: m4-integration).
- **The hard part — dependency ordering vs. readiness.** "Integrate most-dependent first" can clash with "you can't integrate what isn't built." Resolve by simulating missing components (stubs/drivers) so the high-dependency component can still be exercised early (source: m4-integration).
- **787 mapping (challenge project).** Each lesson is a control: earlier subsystem testing → schedule increment tests before final assembly; ICDs → interface register entries; in-house → fewer uncontrolled cross-supplier dependencies (source: m4-integration). Stop at a defensible plan — the goal is justified decisions, not a perfect schedule.
