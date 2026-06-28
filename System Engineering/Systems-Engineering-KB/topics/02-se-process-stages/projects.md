# Stages of the SE Process — Projects

## Guided project — Map the five stages to a system of your choice

**Goal:** demonstrate (Understand) that you can apply the five SE stages to a real system by naming, for each stage, its goal and concrete activities for *your* chosen system (source: m1-stages).

**Scenario:** pick one system you know well — e.g. a smartphone, a home solar installation, a city bus, or one of the source's domains (EV, medical device, automotive, satellite, nuclear plant, consumer electronics) (source: m1-stages).

**Requirements / deliverable:** a one-page table or note with one row per stage.

**Suggested steps & "done" criteria per checkpoint:**

1. **Concept** — write the stakeholder need, the objectives, one feasibility question, and the planned output (a system concept). *Done when:* you have a need, an objective, and a feasibility question specific to your system (source: m1-stages).
2. **Development** — list the main subsystems and one validation activity (prototype/simulation/test). *Done when:* you name at least two subsystems and one V&V activity (source: m1-stages).
3. **Production** — state how it is manufactured and one quality/verification activity. *Done when:* you name a manufacturing step and a QC or V&V check (source: m1-stages).
4. **Operations & maintenance** — list two O&M activities (monitoring, updates, troubleshooting, optimization). *Done when:* two distinct O&M activities are listed (source: m1-stages).
5. **Disposal** — state how the system is retired (dismantle/recycle/decommission) and one environmental or regulatory consideration. *Done when:* a retirement method and one sustainability/compliance point are named (source: m1-stages).

**Overall "done":** all five rows filled, each with a goal and at least one activity, and each activity plausibly belonging to its stage (use the [exercises](exercises.md) classification check on yourself).

## Independent (challenge) project — Cross-stage trade-off note

**Goal:** show you understand that decisions in early stages shape later ones.

**Brief (constraints only):** choose any complex system. Pick *one* decision made in the concept or development stage (e.g. orbital type for a satellite, battery chemistry for an EV) and trace its consequences forward into at least *two* later stages (production, O&M, or disposal). Constraints: stay grounded in the stage definitions; cite which stage each consequence lands in; keep it under one page.

## Build notes & solution sketch

- **Architecture of the deliverable:** the satellite worked example in [examples.md](examples.md) is the reference template — copy its five-stage structure and swap in your system (source: m1-stages).
- **Key decision — which system:** pick something whose disposal is non-trivial (satellite, nuclear plant, EV battery), because the disposal stage is the one learners most often leave thin (source: m1-stages).
- **The hard part — keeping activities in the right stage:** the frequent error is putting prototyping/testing under production. Rule of thumb: *design and prove* = development; *manufacture the proven design* = production (source: m1-stages).
- **For the challenge note:** a strong trace is "satellite orbital-type choice (concept) → drives the imaging payload and attitude-control design (development) → fixes the launch-interface prep (production) → determines whether disposal is graveyard orbit vs controlled re-entry (disposal)" (source: m1-stages).
- **Scope:** this is an Understand-level applied task — a clear, correctly-classified mapping is the goal, not a real build.
