# System Design vs Architecture — Examples

Every example below classifies decisions as **architecture** (blocks + rules) or **design** (details inside/between blocks), the core skill of this topic.

## Simple example — classify one decision pair (fully worked)

**Task:** For the autonomous vehicle, label each decision A (architecture) or D (design).

1. "The system has a perception subsystem, a planning subsystem, and a control subsystem." — **A.** *Reason:* it names the major building blocks and their split — that is what architecture defines (source: m3-intro).
2. "Perception will use LiDAR rather than stereo-vision." — **D.** *Reason:* it chooses an implementation inside one block; choosing LiDAR vs. stereo-vision is the course's canonical design decision (source: m3-intro).
3. "Subsystems exchange timing-sensitive data over a shared bus." — **A.** *Reason:* it defines a relationship/guiding rule between blocks, captured as an interface (source: m3-intro).
4. "The LiDAR data-processing algorithm runs at a fixed compute budget on a specific board." — **D.** *Reason:* it allocates computational resources and defines component behavior inside the block (source: m3-intro).

**Heuristic used:** if the decision changes *which blocks exist or how they relate*, it's architecture; if it changes *how one block is built*, it's design.

## Intermediate example — completion problem

A delivery-drone team is making decisions. Classify each and name the matching framework element where asked.

1. "Split the drone into navigation, communication, and payload-handling subsystems." → **A** (defines building blocks) (source: master-notes §3).
2. "Balance battery life against payload capacity to pick a battery." → **D** (a technical trade-off) (source: m3-intro; master-notes §3).
3. "Adopt the principle 'Security is everyone's responsibility' for the whole product." → this is an **architecture _____**; and "Use RESTful APIs between services" is a **design _____**. — *(fill the two blanks; solution below)*
4. "Produce one view for executives (ROI) and another for engineers (latency)." → which framework element is this? — *(fill in; solution below)*

## Advanced example — fresh case, strategy hint only

**System:** a smart-home security platform (the course's recurring trade-off example). Produce, from scratch:

- two **architecture-level** decisions (blocks or guiding rules),
- two **design-level** decisions (details inside a block),
- and list two **stakeholder viewpoints** that apply.

*Strategy hint:* start from the big blocks (cameras, server, alerting), then drop one level into each. For viewpoints, recall the five named views and pick the two most relevant to a security product. Compare your answer to the solution below (source: m3-frameworks; master-notes §3).

## Real-world case study — Drones For Us

**Situation:** the start-up "Drones For Us" wanted the most efficient autonomous delivery drone for urban last-mile delivery (source: master-notes §3).

**Approach (first, wrong):** the team jumped straight into development — no blueprint phase (source: master-notes §3).

**Outcome (of skipping it):** batteries drained too quickly, the navigation system struggled with real-world obstacles, communication between components was unreliable, and the deadline slipped (source: master-notes §3).

**Approach (corrected):** a senior systems engineer introduced a structured system-design-and-architecture approach — clear requirements, a modular architecture, SysML diagrams to visualize interactions, and systematic trade-off evaluation (e.g., battery life vs. payload capacity) to optimize the design *before* building expensive prototypes (source: master-notes §3).

**Outcome:** a working drone plus a well-documented, scalable architecture that secured investment for future enhancements (source: master-notes §3).

**Lesson:** the blueprint phase is not overhead — it turns chaos into innovation, and skipping it surfaces the same dependencies later, more expensively (source: master-notes §3; m3-intro risk-mitigation point).

## Guided walkthrough — narrating one full classification

Take the autonomous vehicle and walk requirements ➔ architecture ➔ design (source: m3-intro):

1. **Start from requirements** (from [05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/fundamentals.md)): "the vehicle shall detect obstacles and stop safely."
2. **Architecture:** allocate that to a **perception** subsystem (detect) feeding a **planning** subsystem (decide) feeding a **control** subsystem (act), with a guiding rule that they exchange timing-sensitive data (source: m3-intro). These are blocks + a relationship.
3. **Design:** inside perception, the trade-off is **LiDAR vs. stereo-vision**; then specify sensor mounting geometry, the data-processing algorithm, and the compute budget (source: m3-intro). Define the interface (signal definitions, message schemas, data rates, error handling) between perception and planning, and write the early test strategy (test points, simulation, acceptance criteria) (source: m3-intro).
4. **Implementation:** build it — and because the lineage is intact, any later change traces straight back to the requirement for impact analysis (source: m3-intro).

---

## Solutions

**Intermediate #3:** "Security is everyone's responsibility" is an architecture **principle** (high-level, stable rule); "Use RESTful APIs between services" is a design **guideline** (an actionable rule that translates principles into practice) (source: m3-frameworks).

**Intermediate #4:** This is **Stakeholder Viewpoints / Architectural Views & Perspectives** — frameworks describe the architecture from multiple perspectives because business leaders care about ROI while engineers care about data flow and latency (source: m3-frameworks).

**Advanced (one acceptable answer):**
- Architecture: (a) split into camera, server/analytics, and alerting subsystems; (b) guiding rule "modular design so features can be added without affecting existing functionality" (source: master-notes §3).
- Design: (a) choose camera response-time vs. cost for the camera block; (b) specify the video-stream data rate and error handling on the camera-to-server interface (source: m3-intro interface-spec point; master-notes §3).
- Viewpoints: **Security/Risk View** (threats, controls, mitigations) and **Operational View** (behavior in real-world scenarios) are the two most relevant; Technical/Infrastructure View is also defensible (source: m3-frameworks).
