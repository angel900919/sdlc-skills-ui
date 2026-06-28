# Stages of the SE Process — Examples

The core procedure here is: take a system and walk it through all five stages, naming the goal and key activities of each. Examples fade from fully worked to independent.

## Simple example — Electric vehicle, two stages worked

**Task:** name the concept-stage work for a new electric vehicle, and state the stage's output.

**Worked:**
1. Identify stakeholder needs → market research to understand what consumers want. *Reason:* the concept stage starts from real needs (source: m1-stages).
2. Check compliance → regulatory assessments. *Reason:* the system must be legal to operate (source: m1-stages).
3. Check buildability → preliminary technical evaluation of battery technology and charging-infrastructure feasibility. *Reason:* this is the feasibility study (source: m1-stages).
4. Output → a well-defined system concept that is the roadmap for later stages. *Reason:* that is the concept stage's defined outcome (source: m1-stages).

## Intermediate example — Medical device, production stage (completion problem)

A medical device has a validated design and now enters the production stage. The first steps are filled in; complete the last two (answers in Solutions).

1. Manufacture components in compliance with stringent regulatory standards. (source: m1-stages)
2. Conduct ____________ to confirm the delivered system meets specifications. **(blank A)**
3. Perform ____________ to ensure reliability. **(blank B)**

## Advanced example — Automotive, full five-stage map (mostly blanked)

For an automotive program, fill the goal/activity for each stage. Strategy hint: ask each stage's question (worth building? designed right? built right? running well? retired well?). Answers in Solutions.

| Stage | Automotive activity |
|---|---|
| Concept | ____________ |
| Development | ____________ |
| Production | ____________ (the source gives a specific automotive example here) |
| Operations & maintenance | ____________ |
| Disposal | ____________ |

## Real-world case study — Satellite system (source-described)

**Situation:** a government agency needs a satellite to monitor environmental changes such as deforestation and ocean pollution (source: m1-stages).

**Approach:** the team runs the system through all five stages —
- *Concept:* explore mission feasibility, objectives, and high-level requirements; run trade-off analyses on orbital type, imaging capabilities, and data-relay options; draft a concept of operations (source: m1-stages).
- *Development:* define detailed requirements; engineer and integrate subsystems (imaging payload, power supply, communication systems, attitude control); build prototypes/test units; perform V&V via simulation, thermal-vacuum testing, and vibration testing (source: m1-stages).
- *Production:* manufacture the final satellite with qualified parts and processes under continuous quality control; for a constellation, mass-produce, integrate, and stage launch-ready units; finalize documentation, assembly procedures, and launch-interface preparations (source: m1-stages).
- *O&M:* ground control monitors health and performance, schedules imaging, handles data download; maintenance covers software updates, anomaly management, and instrument recalibration; preventive maintenance is limited in space, so the emphasis is careful operation and risk management (source: m1-stages).
- *Disposal:* safely decommission — move to a graveyard orbit or plan a controlled re-entry (by mission class and orbit); archive data, deactivate/repurpose ground systems, document lessons learned (source: m1-stages).

**Outcome:** the system lifecycle is concluded responsibly, in compliance with space-debris mitigation guidelines (source: m1-stages).

**Lesson:** the *same* five stages apply to a complex space system; only the activities change. Note how disposal is constrained by physics (limited preventive maintenance in space → careful operation; debris rules → graveyard orbit or re-entry) (source: m1-stages).

## Guided walkthrough — Satellite, narrated start to finish

Imagine you are the systems engineer on the environmental-monitoring satellite (source: m1-stages).

You begin in the **concept stage**. The need is concrete: monitor deforestation and ocean pollution. You don't draw any hardware yet — first you ask whether the mission is feasible, fix the objectives and high-level requirements, and run trade-offs to choose the orbital type, imaging capability, and data-relay scheme. You write the concept of operations so everyone agrees how the satellite will be used and what it will deliver. That document is your hand-off.

The concept is approved, so you move into the **development stage**. Now you turn the concept into detailed requirements and a system architecture, then engineer and integrate the subsystems — imaging payload, power supply, communications, attitude control. You build prototypes and test units and put them through V&V: simulation, thermal-vacuum, and vibration testing. You are not building the flight article yet; you are proving the *design* meets every functional and performance requirement.

With a validated design, you enter the **production stage**. You manufacture the final satellite using qualified parts and processes, with quality control and testing applied throughout. If it's a constellation, you mass-produce and stage launch-ready units. You finalize documentation, assembly procedures, and launch-interface preparations.

After launch the satellite is in the **operations & maintenance stage**. Ground control watches its health and performance, schedules imaging, and downloads data. You handle anomalies, push software updates, and recalibrate instruments — knowing preventive maintenance is limited in orbit, so you operate carefully and manage risk to maximize lifespan.

Finally, at end of life, the **disposal stage**: you move the satellite to a graveyard orbit or plan a controlled re-entry, archive the data, deactivate or repurpose ground systems, and document lessons learned — closing out the lifecycle in line with space-debris mitigation guidelines (source: m1-stages).

---

## Solutions

**Intermediate — medical device production stage:**
- **Blank A:** system verification and validation testing (source: m1-stages).
- **Blank B:** stress tests, to ensure reliability (source: m1-stages).

**Advanced — automotive five-stage map** (filled using the source's pattern; the source's explicit automotive content is in the Production row):
| Stage | Automotive activity |
|---|---|
| Concept | Identify stakeholder needs, define objectives, run feasibility study and risk/constraint assessment (general stage purpose) (source: m1-stages) |
| Development | Detailed specs, architecture, prototypes; iterative design cycles with testing feedback (general stage purpose) (source: m1-stages) |
| Production | Assemble prototype vehicles, perform crash tests, evaluate manufacturing efficiency before full-scale production (source: m1-stages — explicit automotive example) |
| Operations & maintenance | Active use with monitoring, routine maintenance, updates, troubleshooting, optimization (general stage purpose) (source: m1-stages) |
| Disposal | Decommission/retire; assess environmental impact, dismantle, recycle materials (general stage purpose) (source: m1-stages) |

*Note:* only the Production row is given explicitly for automotive in the source (crash tests, prototype assembly, manufacturing-efficiency evaluation); the other rows apply the general stage definitions to the automotive case (source: m1-stages).
