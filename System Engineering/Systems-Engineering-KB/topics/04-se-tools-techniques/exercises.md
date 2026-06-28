# Common SE Tools & Techniques — Exercises

Attempt each from memory first. Solutions and explanations are below the rule.

## Warm-up (Tier 1 — recall)

1. From memory, list the four requirement-management tools named in the course.
2. List the five ISO/IEC/IEEE 29148 document templates by their acronyms.
3. From memory, name the four MBSE tools (one is a language).
4. Name the four SE techniques.
5. Name the two risk-management tools given as examples.

## Core exercises (Tier 2 — apply / Understand)

**C1 — Classify.** For each, say whether it is a *requirement-management tool*, an *MBSE tool*, a *technique*, or a *29148 document*: Jama Connect; FMEA; OpsCon; Cameo Systems Modeler; ReqView; interface management; SyRS; draw.io.

**C2 — 29148 purpose match.** Match each document to its *purpose*: BRS / StRS / SyRS / SRS / OpsCon → (a) define how the system will operate; (b) capture business vision; (c) software-specific requirements; (d) define stakeholder requirements; (e) technical requirements / what the system must do.

**C3 — Guidance-fading pair (trade-off).**
- C3a (worked frame given): In the satellite trade-off, the criteria were cost, performance, complexity, power consumption, and risk; the high-gain antenna won on *performance* but lost overall. State the single reason it was rejected.
- C3b (do it yourself): A team chooses between two batteries for the wearable tracker: Battery X has longer life but is heavier and pricier; Battery Y is lighter and cheaper but shorter-lived. Pick a decision rule and name the criteria you would compare. (No single right answer — be explicit about criteria and constraints.)

**C4 — Verification vs. validation.** For the satellite antenna, label each activity V (verification) or Val (validation): (i) lab-test signal strength against the spec; (ii) test mission with ground stations to confirm real-world data transmission; (iii) simulate attitude-control pointing under orbital conditions; (iv) confirm it meets the stakeholder's need for fast, reliable data.

**C5 — Explain it back (Feynman).** In 4–6 sentences, explain to a non-engineer why the satellite team chose the *omnidirectional* antenna even though the high-gain one performed better. Self-check rubric: (a) you mention trade-off across cost/complexity/risk, not just performance; (b) you mention that high-gain exceeded the project's constraints; (c) you mention the residual risk staying high; (d) you mention reliability of basic communication.

## Challenge exercises (Tier 3 — analyze / evaluate)

**X1 — Interleaved set (decide which concept applies).** For each situation, first decide which *technique* (trade-off, risk mgmt, V&V, or interface mgmt) is primary, then justify:
- (a) Two subsystems use mismatched voltage levels and could fail when connected.
- (b) Engineers weigh a faster but pricier processor against a cheaper, slower one.
- (c) A prototype passes every lab spec but the team is unsure it works in real conditions.
- (d) A component needs precise orientation, and misalignment could lose all communication.

**X2 — Build the map yourself.** Nodes: `Tools`, `Techniques`, `Goal: manage complexity / meet needs`, `Requirement mgmt tools`, `ISO 29148`, `MBSE tools`, `Trade-off`, `Risk mgmt`, `V&V`, `Interface mgmt`. Draw the edges (which nodes connect to which, and with what relationship). Compare against the diagram in [fundamentals.md](fundamentals.md).

**X3 — Map tools to a new system's lifecycle (mirrors m1-exercise).** Pick any system (e.g. a smart doorbell). For each of the five stages — Concept, Development, Production, Operations & Maintenance, Disposal — name one tool/technique and say why, in the style of the wearable-tracker table.

## Solutions & explanations

---

**Warm-up**
1. IBM DOORS, Jama Connect, Helix RM, ReqView (source: m1-tools).
2. BRS, StRS, SyRS, SRS, OpsCon (source: m1-tools).
3. SysML (the language), Cameo Systems Modeler, Enterprise Architect, Diagrams.net/draw.io (source: m1-tools).
4. Trade-off analysis, risk management, verification & validation (V&V), interface management (source: m1-tools).
5. FMEA (Failure Modes and Effects Analysis) and FTA (Fault Tree Analysis) (source: m1-tools).

**C1.** Jama Connect = requirement-management tool; FMEA = technique (risk mgmt tool); OpsCon = 29148 document; Cameo Systems Modeler = MBSE tool; ReqView = requirement-management tool; interface management = technique; SyRS = 29148 document; draw.io = MBSE tool (source: m1-tools).

**C2.** BRS→(b); StRS→(d); SyRS→(e); SRS→(c); OpsCon→(a) (source: m1-tools).

**C3a.** Its **cost and control complexity exceeded the project's constraints**, so despite meeting the performance goal it was rejected in favour of the cheaper, lower-risk omnidirectional antenna (source: m1-tools). *Common wrong answer:* "it had worse performance" — false; it had *better* performance but lost on cost/complexity.
**C3b.** Acceptable answers compare criteria such as battery life, weight, cost (and risk) and apply a constraint (e.g. "must fit comfort/weight budget"). The method matters more than the choice; this mirrors the source's balance-not-maximise logic (source: m1-tools).

**C4.** (i) V; (ii) Val; (iii) V; (iv) Val. Verification checks against specs/design; validation checks against the stakeholder's operational need (source: m1-tools).

**C5.** A strong answer says: the high-gain antenna performed better but was more expensive and mechanically complex, exceeding the project's budget/complexity constraints; its risks (misalignment, deployment failure, possible total loss of communication) stayed high even after mitigations; the omnidirectional antenna gave sufficient capability with lower cost and more reliable basic communication, so it was the better *balanced* choice (source: m1-tools).

**X1.** (a) Interface management — mismatched voltages are an interface compatibility issue, handled with ICDs (source: m1-tools). (b) Trade-off analysis — balancing cost vs. performance (source: m1-tools). (c) V&V — specifically *validation*, confirming real-world fitness beyond lab specs (source: m1-tools). (d) Risk management — orientation/misalignment risk that could lose communication (source: m1-tools).

**X2.** Expected edges: `Tools` →includes→ `Requirement mgmt tools`, `MBSE tools`; `Tools` →structured by→ `ISO 29148`; `Techniques` →includes→ `Trade-off`, `Risk mgmt`, `V&V`, `Interface mgmt`; both `Tools` and `Techniques` →serve→ `Goal: manage complexity / meet needs` (source: m1-tools).

**X3.** Any sensible mapping in the source's style is correct, e.g.: Concept → Stakeholder Needs Analysis (gather expectations); Development → SysML Modeling (model structure); Production → ICD (define hardware/software interaction); Operations & Maintenance → Risk Management Matrix (monitor field risks); Disposal → Configuration Management (archive firmware, handle retired units) (source: m1-exercise).
