# System Design vs Architecture — Exercises

## Warm-up (Tier 1 — production recall)

1. From memory, define **system architecture** in one sentence.
2. From memory, define **system design** in one sentence.
3. List the three guiding-rule (architectural style) examples the course names.
4. List the three reasons design and architecture matter.
5. List the five elements an architectural framework provides.

## Core exercises (Tier 2 — apply at Understand level)

**C1 — Classify (autonomous vehicle).** Label each as architecture (A) or design (D):
(a) "There is a planning subsystem for route computation and maneuver logic."
(b) "Perception uses stereo-vision."
(c) "Subsystems exchange timing-sensitive data."
(d) "Allocate a fixed compute budget to the perception algorithm."

**C2 — Principle vs guideline (guidance-fading pair).**
- *Worked:* "Data is a shared asset" → **principle** (high-level, stable). (source: m3-frameworks)
- *Your turn:* classify "Maintain loose coupling between services" and "Reuse before buy, buy before build" as principle or guideline.

**C3 — Match the view to the stakeholder.** Connect each stakeholder to the view that answers their main concern: business leader / engineer → {Business View, Technical/Infrastructure View}. Justify in one line each.

**C4 — Feynman / explain it back.** In 4–6 sentences, explain to a non-engineer why a team should do architecture and design *before* building, using the requirements ➔ architecture ➔ design ➔ implementation chain.
*Self-check rubric:* full credit if you (1) name the blueprint/partition idea, (2) mention risk being exposed early, (3) mention traceability for change-impact, and (4) give a concrete consequence of skipping it.

## Challenge exercises (Tier 3 — analyze)

**X1 — Interleaved set (decide which concept applies first).** For each item, first decide whether it belongs to *this* topic (architecture-vs-design or framework anatomy), to **[12-design-tradeoffs](../12-design-tradeoffs/README.md)**, or to **[11-architecture-frameworks](../11-architecture-frameworks/README.md)**; then answer it.
(a) "Score three battery options on weight, capacity, and cost."
(b) "Is choosing LiDAR over stereo-vision architecture or design?"
(c) "Which TOGAF phase defines business processes and roles?"
(d) "Name the five elements every architectural framework provides."

**X2 — Build the map yourself.** Given these nodes — *Requirements, Architecture, Design, Implementation, ICD/BDD, IBD/sequence/state* — draw the directed edges (with labels) showing the traceability chain and which artifacts attach to architecture vs. design. Compare to the diagram in [fundamentals.md](fundamentals.md).

**X3 — Diagnose the failure.** The Drones-For-Us team hit drained batteries, a failing navigation system, and unreliable communication. For each failure, state whether a missing *architecture* decision or a missing *design* decision is the more likely root cause, and name the framework element (principle, view, process, etc.) that would have caught it.

---

## Solutions & explanations

**Warm-up 1.** Architecture defines the major building blocks (subsystems/components), their relationships, and the guiding rules (e.g., layered, service-oriented, event-driven) (source: m3-intro).
**Warm-up 2.** Design is the process of fleshing out the architectural blueprint into detailed, implementable solutions — trade-offs, interface specs, component behavior, and an early test strategy (source: m3-intro).
**Warm-up 3.** Layered, service-oriented, event-driven (source: m3-intro).
**Warm-up 4.** Clarity & Control, Risk Mitigation, Traceability (source: m3-intro).
**Warm-up 5.** Views & perspectives; principles & guidelines; processes & methodologies; concerns & roles; standards & best practices (source: m3-frameworks).

**C1.** (a) A — names a building block; (b) D — implementation choice inside a block; (c) A — a guiding rule/relationship between blocks; (d) D — resource allocation / component behavior (source: m3-intro). *Common wrong answer:* marking (c) as design — interfaces and inter-block rules are architectural.

**C2.** "Maintain loose coupling between services" = **guideline** (actionable rule); "Reuse before buy, buy before build" = **principle** (high-level, stable) (source: m3-frameworks).

**C3.** Business leader → **Business View** (goals, processes, value chains; they care about ROI and risk); engineer → **Technical/Infrastructure View** (hardware, networks, platforms; they care about data flow and latency) (source: m3-frameworks).

**C4.** Model answer: Architecture partitions the problem into blocks so the big picture stays controllable; design then turns each partition into real, testable modules. Doing it first exposes critical dependencies and implementation challenges before any expensive coding or fabrication. Keeping the requirements ➔ architecture ➔ design ➔ implementation lineage means any later change can be traced and its impact assessed. Skipping it — as Drones-For-Us did — surfaces the same problems later as drained batteries, bad navigation, and a blown deadline (source: m3-intro; master-notes §3).

**X1.** (a) **[12-design-tradeoffs](../12-design-tradeoffs/README.md)** — scoring/ranking alternatives is the decision-matrix toolkit, not this topic. (b) *This topic* — it's a **design** decision (implementation inside the perception block) (source: m3-intro). (c) **[11-architecture-frameworks](../11-architecture-frameworks/README.md)** — TOGAF phase detail. (d) *This topic* — views & perspectives, principles & guidelines, processes & methodologies, concerns & roles, standards & best practices (source: m3-frameworks).

**X2.** Edges: Requirements —*allocated to*→ Architecture —*fleshed out into*→ Design —*realized as*→ Implementation; Implementation —*change-impact traces back to*→ Requirements. Artifacts: Architecture —*interfaces captured in*→ ICD/BDD; Design —*behavior captured in*→ IBD/sequence/state (source: m3-intro). Matches [fundamentals.md](fundamentals.md).

**X3.** *Drained batteries* — design (a missing battery-life vs. payload trade-off; the **processes/trade-off** discipline would have caught it) (source: master-notes §3; m3-intro). *Failing navigation in real obstacles* — could be both, but most directly a missing design-level algorithm/sensor decision and an absent early test/simulation strategy (source: m3-intro). *Unreliable communication* — architecture: a missing inter-block interface/guiding rule (captured in an ICD); the **System/Logical View** of data flow would have surfaced it (source: m3-intro; m3-frameworks).
