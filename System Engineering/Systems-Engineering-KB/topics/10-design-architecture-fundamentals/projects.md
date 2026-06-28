# System Design vs Architecture — Projects

This is an Understand-level topic, so the work is a short *applied classification* task, not a full build.

## Guided project — "Architecture vs design memo" for a chosen system

**Goal:** for one system of your choice (or reuse the autonomous vehicle / delivery drone / smart-home security platform from the course), produce a one-page memo that cleanly separates architecture decisions from design decisions and lists the stakeholder viewpoints that apply.

**Requirements:**
- At least **3 architecture-level decisions** (building blocks and/or guiding rules) (source: m3-intro).
- At least **3 design-level decisions** (details inside or between blocks: a trade-off, an interface spec, and a component-behavior choice) (source: m3-intro).
- A one-line traceability statement linking a requirement ➔ architecture ➔ design ➔ implementation (source: m3-intro).
- A list of **2–3 stakeholder viewpoints** that apply, each with the concern it answers (source: m3-frameworks).

**Suggested steps & "done" criteria:**
1. **Pick the system and pull 1–2 requirements** (reuse from [05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/README.md)). *Done:* requirements written as "the system shall…".
2. **List the big blocks + one guiding rule.** *Done:* 3+ architecture decisions, each clearly about *which blocks exist / how they relate*.
3. **Drop one level into each block.** *Done:* 3+ design decisions, including at least one trade-off (e.g., LiDAR vs. stereo-vision style) and one interface spec.
4. **Write the traceability line.** *Done:* one requirement traced across all four stages.
5. **Select viewpoints.** *Done:* 2–3 of {Business, System/Logical, Technical/Infrastructure, Security/Risk, Operational}, each paired with its stakeholder concern (source: m3-frameworks).

## Independent (challenge) project — framework anatomy applied

**Brief:** choose a complex multi-component system and write a short "framework starter" for it. Without using a named framework's full process, populate each of the five framework elements with one concrete item for your system: one **view**, one **principle** plus a derived **guideline**, one **process/checkpoint**, one **stakeholder concern → role**, and one **standard** you'd adopt (source: m3-frameworks).

**Constraints:** every item must be specific to your system (no generic restatements); the principle and guideline must be linked (the guideline operationalizes the principle); name a real standard such as SysML/UML or ISO/IEC 42010 (source: m3-frameworks). Cumulative tie-in: reuse the requirement and block structure from the guided project so the framework starter sits on top of the same system.

## Build notes & solution sketch

- **Decision-classification heuristic (the hard part):** "does this change which blocks exist or how they relate?" → architecture; "does this change only how one block is built?" → design (source: m3-intro). When stuck, the LiDAR-vs-stereo-vision example is the reference design decision and "perception/planning/control exist" is the reference architecture decision.
- **Don't smuggle trade-off scoring in here.** Naming a trade-off (battery life vs. payload) is a design decision; *scoring* the alternatives is the decision-matrix method in [12-design-tradeoffs](../12-design-tradeoffs/README.md) — link to it rather than reproduce it.
- **Principle vs guideline pitfall:** if your "principle" is concrete enough to put in a coding standard, it's actually a guideline; principles are high-level and stable (source: m3-frameworks).
- **Viewpoint selection:** match the view to who will read the memo — Business View for owners (ROI), Technical View for engineers (data flow, latency) (source: m3-frameworks).
- **Standards to name:** SysML/UML/BPMN for modeling, ISO/IEC 42010 for describing the architecture itself (source: m3-frameworks).
