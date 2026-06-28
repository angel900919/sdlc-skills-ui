# Common SE Tools & Techniques — Projects

These are short applied tasks (Bloom: Understand). The aim is to *map* tools and techniques to a real system, mirroring the wearable-fitness-tracker table in the source (source: m1-exercise).

## Guided project — tools/techniques map for a smart home security system

**Goal:** Produce a one-page table that assigns at least one tool or technique to each of the five lifecycle stages for a chosen system, with a one-line justification each — in the exact style of the source exercise (source: m1-exercise).

**Scenario:** Choose a **smart home security system** (or any system you know well).

**Requirements:**
- Cover all five stages: Concept, Development, Production, Operations & Maintenance, Disposal.
- Use only tools/techniques named in this topic (requirement-management tools; ISO 29148 documents; SysML/MBSE tools; trade-off analysis; risk management incl. FMEA/FTA; V&V; interface management/ICDs; configuration management; stakeholder needs analysis) (source: m1-tools; m1-exercise).
- Each row: Stage | Tool/Technique | Why it's used.

**Suggested steps & checkpoints (each with a "done" test):**
1. **Concept** — assign a needs/requirements activity. *Done when:* the row names a way to capture stakeholder expectations (e.g. Stakeholder Needs Analysis or a 29148 StRS/BRS) and says why (source: m1-exercise; m1-tools).
2. **Development** — assign a modelling tool. *Done when:* the row names SysML modelling (or an MBSE tool) and explains it models system structure (source: m1-exercise).
3. **Production** — assign an interface artefact. *Done when:* the row names an ICD and says it defines hardware/software interaction (source: m1-exercise).
4. **Operations & Maintenance** — assign a risk activity. *Done when:* the row names a risk-management matrix/technique and names a real field risk it monitors (source: m1-exercise).
5. **Disposal** — assign a control activity. *Done when:* the row names configuration management and explains archiving/handling of retired units (source: m1-exercise).
6. **Review** — *Done when:* every stage has a justification that distinguishes *what* the tool does from *why* this stage needs it.

## Independent (challenge) project — full technique pass on one design decision

**Goal:** Take a single non-trivial design decision in *your* chosen system and run all four techniques on it, ending in a justified recommendation — cumulatively reusing the catalogue.

**Constraints only (no steps given):**
- Pick one binary design choice (e.g. wired vs. wireless sensor link; high-capacity vs. lightweight battery).
- Apply **trade-off analysis** (state criteria and constraints), **risk management** (identify ≥2 risks and at least one mitigation each, note residual risk), **V&V** (state one verification and one validation activity), and **interface management** (name the subsystems that must connect and the artefact that manages them).
- End with a recommendation that, like the satellite example, may reject the higher-performance option if constraints/risk demand it (source: m1-tools).

## Build notes & solution sketch

- **Architecture of the deliverable:** a five-row stage table (guided) plus a four-section technique memo (independent). Keep it one page each — this is an Understand-level mapping task, not a build.
- **Key decision & why:** the hard part is justification quality. Borrow the satellite logic — name the criteria, check them against the project's constraints, and let constraints/risk override raw performance (source: m1-tools).
- **Where people get stuck:** confusing verification with validation (verify = meets specs; validate = meets the operational need) and leaving interfaces vague (an ICD must name mechanical, electrical, data, and control connections) (source: m1-tools).
- **Reference model:** the wearable-tracker table is the gold-standard format to imitate (source: m1-exercise). For deeper trade-off scoring see [12-design-tradeoffs](../12-design-tradeoffs/README.md) and the [13-decision-matrix](../13-decision-matrix/README.md).
