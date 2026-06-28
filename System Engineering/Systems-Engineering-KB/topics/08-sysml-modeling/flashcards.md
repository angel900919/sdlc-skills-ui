# Flashcards — System Modeling with SysML

| ID | Front | Back | Tags |
|---|---|---|---|
| q-08-001 | SysML extends which language, and what does it add? | It extends {{c1::UML}}, adding constructs tailored for {{c2::systems engineering}} — hardware, software, electrical, and mechanical components.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, cloze |
| q-08-002 | How many SysML diagram types, in how many categories? | {{c1::9}} diagram types in {{c2::4}} categories.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, cloze |
| q-08-003 | Name the four SysML diagram categories. | Structure, Behavior, Parametrics, Requirements.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-004 | Which diagrams are in the Structure category? | BDD (Block Definition Diagram), IBD (Internal Block Diagram), Package diagram.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-005 | Which diagrams are in the Behavior category? | Use Case, Activity, Sequence, State Machine.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-006 | Purpose of a Block Definition Diagram (BDD)? | Define system blocks (components) and their relationships (association, generalization, composition).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-007 | Purpose of an Internal Block Diagram (IBD)? | Show the internal parts of a block and their connections via ports.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-008 | BDD vs IBD in one line. | BDD = *what blocks exist* and their relationships; IBD = *how the parts inside one block connect*.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, compare |
| q-08-009 | Which SysML diagram models states and transitions of a component? | State Machine diagram (e.g., MotionSensor: Idle, Armed, Triggered, Reset).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, apply |
| q-08-010 | Which diagram shows messages exchanged between elements over time? | Sequence diagram (e.g., the "Trigger Alarm" sequence).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, apply |
| q-08-011 | Which diagram models a workflow with decisions, parallel ops, and loops? | Activity diagram (advanced flowchart).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, apply |
| q-08-012 | Which diagram models mathematical constraints/equations via constraint blocks? | Parametric diagram (e.g., BatteryLife vs PowerConsumption vs UsageTime).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, apply |
| q-08-013 | Which diagram captures actors and their goals (use cases)? | Use Case diagram (e.g., Homeowner → "Arm Night Mode").<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, apply |
| q-08-014 | List the seven requirement relationships. | Composite (containment), derive, refine, satisfy, verify, copy, trace.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-015 | The {{c1::derive}} relationship can only exist between {{c2::requirements}} and imposes additional constraints based on {{c3::analysis}}. | derive / requirements / analysis<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, cloze |
| q-08-016 | How does refine differ from derive? | refine can link a requirement to *any* model element and clarifies meaning; derive links requirement→requirement only and imposes analysis-based constraints.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, compare |
| q-08-017 | Does a satisfy relationship prove a requirement is met? | No — it only allocates a requirement to a structure. {{c1::An assertion does not constitute proof}}; proof comes from {{c2::test cases}}.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, cloze |
| q-08-018 | A verify relationship can represent which verification methods? | Inspection, analysis, demonstration, or test.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-019 | What is special about a copied requirement's text and id? | Text is a read-only copy of the source; the copy has a different id and may live in a different namespace.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-020 | Why prefer other relationships over trace? | trace's semantics have no real constraints (weak); use a more meaningful relationship and reserve trace for source-document / spec-tree links.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, apply |
| q-08-021 | What does a composite requirement use to contain sub-requirements? | The namespace containment mechanism, forming a requirements hierarchy ("shall do A and B" → children A, B).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-022 | Name the eight SysML requirement types. | Business, design constraint, extended, functional, interface, performance, physical, usability.<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-023 | Minimum properties of a standard SysML requirement? | A unique identifier and the requirement text (verification status, priority, etc. optional).<br><sub>(source: m2-models)</sub> | topic::sysml-modeling, recall |
| q-08-024 | In a vending-machine BDD, what relationship connects VendingMachineSystem to PaymentModule? | Composition (whole-part) — every machine has one payment system.<br><sub>(source: m2-ex-vending)</sub> | topic::sysml-modeling, apply |
| q-08-025 | Which free tool does the material use to build SysML diagrams, and what's the catch? | Visual Paradigm online (online.visual-paradigm.com); the free version has limitations.<br><sub>(source: m2-sysml)</sub> | topic::sysml-modeling, recall |
| q-08-026 | In the UML/SysML Venn, what does the overlap region mean? | "UML reused by SysML" — UML constructs SysML adopts; SysML also adds new constructs, and part of UML is not required in SysML.<br><sub>(source: master-notes)</sub> | topic::sysml-modeling, recall |
