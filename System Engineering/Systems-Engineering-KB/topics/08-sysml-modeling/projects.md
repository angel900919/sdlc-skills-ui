# System Modeling with SysML — Projects

Build real diagrams. Visual Paradigm online is free (with limitations) at `online.visual-paradigm.com` (source: m2-sysml).

## Guided project — model a small system with a BDD + a requirements diagram

**Scenario (choose one, all grounded in the source domains):** an automated vending machine (source: m2-ex-vending), a smart-home security system (source: m2-models), or a thermostat (source: master-notes). Pick the one you did *not* see fully worked.

**Goal:** produce two connected SysML diagrams for your system — a Block Definition Diagram (structure) and a Requirements diagram (requirements) — with correctly chosen relationships.

**Requirements:**
- At least **one BDD** with a top-level system block and **≥4 part blocks** joined by composition.
- At least **two blocks** carrying attributes and/or operations.
- At least **one requirements diagram** with a **main requirement** and **≥4 supporting requirements**.
- Use at least **three different** requirement relationships across the model (e.g., refine, satisfy, verify) (source: m2-models).

**Milestones & "done" criteria:**

1. **Structure (BDD).** *Done when:* the system block composes its parts (whole-part), and at least two blocks have attributes/operations — like the vending-machine BDD's `UserInterface.screenSize` / `InventoryManager.checkStock()` (source: m2-ex-vending).
2. **Requirements list.** *Done when:* you have a main requirement plus ≥4 supporting ones, each tagged with a SysML requirement **type** (functional, performance, design constraint, usability, etc.) (source: m2-models, master-notes).
3. **Requirements diagram.** *Done when:* supporting requirements connect to the main one with `refine`/`satisfy` arrows, mirroring the thermostat model (source: master-notes).
4. **Traceability + proof.** *Done when:* at least one requirement is `satisfy`-linked to a BDD block **and** `verify`-linked to a test case — because a satisfy assertion alone is not proof (source: m2-models).

## Independent (challenge) project — a multi-diagram model

**Goal:** model a system of your choice spanning **all four diagram categories**, demonstrating you can pick the right diagram for each need.

**Constraints only:**
- One **structure** diagram (BDD or IBD), one **behavior** diagram (use case, activity, sequence, or state machine), one **parametric** diagram, and one **requirements** diagram (source: m2-models).
- The parametric diagram must model a real constraint/equation for your system (e.g., a power/usage relationship like `BatteryLife` vs `PowerConsumption` vs `UsageTime`) (source: m2-models).
- The requirements diagram must include a `verify` link to a test case representing one of: inspection, analysis, demonstration, or test (source: m2-models).
- Bonus (cumulative): connect this model to the MBSE idea of model-as-single-source-of-truth — see [09-mbse-requirements](../09-mbse-requirements/README.md).

## Build notes & solution sketch

**Architecture:** start structure-first. A BDD gives you the block vocabulary (`VendingMachineSystem` → `PaymentModule`, etc.); behavior and requirements then *refer back* to those blocks, which is what makes the model traceable (source: m2-models).

**Key decisions & why:**
- **Composition vs association** for parts — use composition when a part is integral to the whole (every vending machine *has one* payment module); it expresses whole-part, association merely "related" (source: m2-ex-vending, m2-models).
- **Which behavior diagram** — match the *question*: order of messages → sequence; states/events → state machine; workflow with branches → activity; user goals → use case (source: m2-models).
- **satisfy + verify together** — `satisfy` allocates a requirement to a block; only a `verify` link to a test case provides proof. Do not stop at satisfy (source: m2-models).

**Hard parts:**
- Resisting `derive` between a requirement and a block — derive is requirement-to-requirement only; reach for `refine` or `satisfy` instead (source: m2-models).
- Keeping the requirements diagram readable as it grows — group with packages, and decompose composite requirements into children for full traceability (source: m2-models).
- A parametric diagram needs an actual equation/constraint block, not just parameters listed — link the parameters through a constraint (source: m2-models).
