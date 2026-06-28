# System Modeling with SysML — Exercises

Attempt every item from memory first. Solutions, with the "why," are at the bottom under the rule.

## Warm-up (Tier 1 — production recall)

W1. From memory, name the **four categories** of SysML diagrams.
W2. List the **nine** SysML diagram types and the category each belongs to.
W3. State the one-line **purpose** of a BDD and of an IBD.
W4. List the **seven** requirement relationships.
W5. Name the eight SysML **requirement types**.

## Core exercises (Tier 2 — apply to scenario)

C1. **Diagram selection (apply).** For each need, name the single best SysML diagram:
   (a) show the order of messages exchanged when "Trigger Alarm" fires;
   (b) group all sensor elements and all UI elements separately;
   (c) model how a `MotionSensor` moves between Idle, Armed, Triggered, Reset;
   (d) relate `BatteryLife`, `PowerConsumption`, and `UsageTime` by an equation;
   (e) capture the actors "Homeowner" / "Maintenance Technician" and their goals.

C2. **Build a BDD (apply, guidance-fading pair — part 1 of 2).** A home security system has `ControlUnit`, `MotionSensor`, `Camera`, `Alarm`. Write the block list, the relationship type connecting parts to the system, and at least one attribute and one operation for `MotionSensor`.

C3. **Build a BDD (apply, guidance-fading pair — part 2 of 2, less scaffolding).** A drone has `FlightController`, `Battery`, `Camera`, `GPSModule`, `MotorAssembly`. Produce the full BDD plan: blocks, relationships to the drone system, and one plausible attribute or operation per block. *(No relationship table is given — choose and justify.)*

C4. **Pick the relationship (apply).** Choose the correct requirement relationship for each:
   (a) a vehicle acceleration requirement analyzed to produce an engine-power requirement;
   (b) an activity diagram that clarifies a text functional requirement;
   (c) the `Alarm` block is allocated to meet the "sound within 2 s" requirement;
   (d) a lab test case confirms the "detect at 10 m" requirement;
   (e) a regulatory requirement reused, read-only, in another project.

C5. **Explain it back (Feynman).** In 4–6 sentences, explain to a teammate why a `satisfy` link does **not** prove a requirement is met, and what does. Self-check rubric: (1) names that a satisfy link only *allocates/asserts*; (2) states assertion ≠ proof; (3) says proof comes from **test cases**; (4) ties to the `verify` relationship and its methods (inspection/analysis/demonstration/test).

## Challenge exercises (Tier 3 — analyze / evaluate / interleave)

X1. **Interleaved set — which concept applies?** For each, first decide whether the item is a *diagram-selection* problem, a *requirement-relationship* problem, or a *requirement-type* classification, then answer. (Mixes this topic's two halves and touches the requirement-types idea from [05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/README.md).)
   (a) "Show how parts inside the `ControlUnit` are wired to each other." 
   (b) "Link the detailed hardware-team requirement back to the system-team requirement it came from." 
   (c) "The thermostat must be at most 86 × 86 mm." (classify the requirement type) 
   (d) "Use a test case to confirm a requirement." 
   (e) "Model the workflow that branches on a false-positive check." 

X2. **Diagnose the modeling mistake (analyze).** A learner drew a `derive` arrow from the "detect motion in under 2 s" requirement to the `MotionSensor` *block*. Explain what is wrong and give the correct relationship(s).

X3. **Compare (analyze).** In a short paragraph each, contrast: (a) BDD vs IBD — *what exists* vs *how parts interact*; (b) `derive` vs `refine` — legal endpoints and intent.

X4. **Build the map yourself.** Nodes (do not redraw the answer here — produce the edges): `MR (main requirement)`, `R1 temperature setting`, `Comfort`, `Speed`, `Power`, `Accuracy`, `User interface`, `Size`, `Ease of use`. Draw each node's relationship to `MR` and label every edge with the correct relationship name. *(Compare against the guided walkthrough in [examples.md](examples.md).)*

X5. **Evaluate the tool choice.** A team wants a free way to try SysML before committing budget. Justify in two sentences which tool from the material fits and one limitation to expect.

---

## Solutions & explanations

**W1.** Structure, Behavior, Parametrics, Requirements (source: m2-models).

**W2.** Structure: BDD, IBD, Package. Behavior: Use Case, Activity, Sequence, State Machine. Parametrics: Parametric. Requirements: Requirements diagram (source: m2-models).

**W3.** BDD — define system blocks (components) and their relationships. IBD — show internal parts and connections of a block (source: m2-models).

**W4.** Composite (containment), derive, refine, satisfy, verify, copy, trace (source: m2-models).

**W5.** Business, design constraint, extended, functional, interface, performance, physical, usability (source: m2-models).

**C1.** (a) **Sequence diagram** — messages over time, the "Trigger Alarm" example; (b) **Package diagram** — group related elements like folders; (c) **State machine diagram** — states and transitions; (d) **Parametric diagram** — constraints/equations linking parameters; (e) **Use case diagram** — actors and goals (source: m2-models).

**C2.** Blocks: `ControlUnit`, `MotionSensor`, `Camera`, `Alarm`. Connect each part to the system block with **composition** (whole-part). `MotionSensor`: attribute `sensitivity`, operation `activate` (source: m2-models). *Common wrong answer:* using association instead of composition — association is weaker and does not express that the parts are integral to the system.

**C3.** A correct plan: top block `DroneSystem` (or similar); `FlightController`, `Battery`, `Camera`, `GPSModule`, `MotorAssembly` each connected by **composition** (they are integral parts). Plausible members: `Battery.capacity` (attribute), `GPSModule.getLocation()` (operation), `Camera.resolution`, `MotorAssembly.spin()`, `FlightController.stabilize()`. Generalization is optional (e.g., camera subtypes). Justification mirrors the vending-machine pattern where every essential module is composed into the system (source: m2-ex-vending, m2-models).

**C4.** (a) **Derive** — between requirements, imposes constraints from analysis (the vehicle-acceleration → engine-power case); (b) **Refine** — a model element clarifies a requirement; (c) **Satisfy** — a design element allocated to a requirement; (d) **Verify** — a test case confirms a requirement; (e) **Copy** — read-only reuse with a new id (source: m2-models).

**C5.** Model answer: A `satisfy` link only **allocates** a requirement to a design structure — it asserts that the block is *intended* to meet the requirement. An assertion is not proof. Real proof that the requirement is met comes from **test cases**. That is the job of the `verify` relationship, where a test case or named element represents inspection, analysis, demonstration, or test (source: m2-models).

**X1.** (a) diagram-selection → **IBD** (internal connections via ports); (b) requirement-relationship → **derive** (requirement-to-requirement, hardware team's detailed version from analysis); (c) requirement-type → **design constraint** (a constraint on the design); (d) requirement-relationship → **verify**; (e) diagram-selection → **Activity diagram** (workflow with a decision branch) (source: m2-models; type classification echoes m2-models requirement types).

**X2.** `derive` can **only** exist between requirements, and it imposes additional constraints from analysis — a block is not a requirement, so the arrow is illegal. Correct: use **satisfy** (the `MotionSensor` design element satisfies/allocates the requirement) and back it with **verify** to a test case for proof (source: m2-models).

**X3.** (a) A **BDD** catalogues *what blocks exist* and their relationships (associations, generalizations, composition); an **IBD** zooms inside one block to show *how its parts connect* via ports — wiring, not catalogue (source: m2-models). (b) **Derive** is requirement→requirement only and imposes constraints based on analysis; **refine** can link a requirement to *any* model element and exists to clarify the requirement's meaning or context (source: m2-models).

**X4.** Expected edges (per the walkthrough): R1, Comfort, Speed, Power, Accuracy, User interface, Size → **refine** → MR; Ease of use → **satisfy** → MR. (master-notes states the supporting requirements "are refined, and this satisfy"; the exact split of which single one is satisfy vs refine is the model author's choice — what matters is correct, labelled edges.) (source: master-notes).

**X5.** **Visual Paradigm** — it offers a *free online version* and supports SysML, so the team can build BDDs and requirements diagrams at no cost; expect the free version to be **limited** in features compared with the paid platform (source: m2-sysml).
