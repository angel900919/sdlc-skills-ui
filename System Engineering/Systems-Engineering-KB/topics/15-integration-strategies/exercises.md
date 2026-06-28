# Integration Strategies & Managing Interfaces — Exercises

Attempt each before checking the Solutions. Grounded in (source: m4-integration).

## Warm-up (Tier 1 — production recall)

1. From memory, define an **integration strategy** and state the three things choosing it well buys you.
2. List the **three** integration strategies.
3. From memory, state which strategy needs **stubs** and which needs **drivers**, and what each placeholder simulates.
4. List the **four** types of dependency.
5. List the **three** types of interface.

## Core exercises (Tier 2 — apply to scenario)

**C1 — Pick a strategy.** A flight-control system's top-level decision logic is finished but the low-level actuator modules are not. Which strategy, and what placeholder do you write? Justify in one sentence.

**C2 — Place the placeholder (guidance-fading pair, part 1 — worked).** A team finished its hardware drivers; the application logic above them is missing. Strategy = bottom-up (low level ready). Missing modules are *above*, so the placeholder = **driver** (simulates higher-level behaviour). *(This one is solved for you.)*

**C3 — Place the placeholder (guidance-fading pair, part 2 — you do it).** A team finished its UI/control layer; the data-access layer below is missing. State the strategy and the placeholder, with the one-line reason.

**C4 — Classify the dependency.** Label each as data, control, timing/temporal, or resource:
- (a) The encryption module must finish key-generation before the transmitter may send.
- (b) Two services both write to the same database.
- (c) The dashboard needs the parsed sensor readings from the parser.
- (d) The retry handler only runs when the network monitor reports "offline".

**C5 — Classify the interface.** Label each hardware, software, or human-machine: (a) a REST API returning JSON; (b) a 5V signal pin between two boards; (c) a touchscreen menu.

**C6 — Order the integration.** Three modules: A depends on nothing; B depends on A and C; C depends on A. Using the dependency-ordering rule, which module should you integrate earliest, and why?

**C7 — Explain it back (Feynman).** In 4–5 sentences, explain to a teammate why incremental integration gives "easy" fault isolation while big-bang integration does not. *Self-check rubric:* (i) ties fault isolation to adding one piece at a time; (ii) names what "the suspect" is when a build breaks; (iii) mentions the cost — a test harness / automation; (iv) no swapped stub/driver claims.

## Challenge exercises (Tier 3 — analyze / evaluate)

**X1 — Interleaved set (decide which concept applies first).** For each item, first decide whether it is an **integration-strategy** choice, a **dependency** issue, an **interface** issue, or a **V&V** activity (→ [16-verification-validation-methods](../16-verification-validation-methods/README.md)) — then answer:
- (a) "Two subsystems disagree on the timestamp format and the merge fails." Which concept? What fix?
- (b) "We must decide whether to start integrating from control logic or from utilities." Which concept? What decides it?
- (c) "Supplier B's component arrived incomplete, blocking the test." Which concept? What practice prevents it?
- (d) "We run a user-acceptance test to confirm the product meets user needs." Which concept? Which topic owns it?

**X2 — Diagnose the 787.** From the Boeing 787 case, give one **dependency** failure and one **interface** failure in the all-electric power system, and map each to the matching lesson learned.

**X3 — Evaluate a choice.** A startup chose bottom-up integration for a product whose biggest risk is whether the overall control architecture works at all. Critique the choice and recommend a better strategy with justification from the selection table.

**X4 — Build the map yourself.** Nodes: `Top-down`, `Bottom-up`, `Incremental`, `Stubs`, `Drivers`, `Test harness`, `Easy fault isolation`. Draw the edges (who needs what / who yields what) as a small diagram or edge list, labelling each edge.

---

## Solutions & explanations

**Warm-up 1.** The order and method in which components/subsystems are combined and tested; choosing well reduces integration complexity, improves fault isolation, and helps find defects earlier (source: m4-integration).

**Warm-up 2.** Top-down, bottom-up, incremental (source: m4-integration).

**Warm-up 3.** Top-down needs **stubs** (simulate lower-level behaviour); bottom-up needs **drivers** (simulate higher-level behaviour) (source: m4-integration).

**Warm-up 4.** Data, control, timing/temporal, resource (source: m4-integration).

**Warm-up 5.** Hardware, software, human-machine (source: m4-integration).

**C1.** **Top-down** + a **stub** for the actuator modules. The top-level control logic is ready, so start there and validate control flow early; the missing lower modules are simulated by stubs (source: m4-integration).

**C3.** **Top-down** + a **stub** for the data-access layer. The upper/control layer is ready (top-down starts at the top), and the missing module is *below*, so the placeholder simulating lower behaviour is a stub (source: m4-integration). *Common wrong answer:* "driver" — drivers belong to bottom-up.

**C4.** (a) timing/temporal — must execute in a specific order; (b) resource — shared database; (c) data — needs data from another module; (d) control — behaviour depends on another module's control flow (source: m4-integration).

**C5.** (a) software (API/data format/protocol); (b) hardware (signal type/voltage); (c) human-machine (UI control) (source: m4-integration).

**C6.** Integrate **A earliest** — but note the rule is to integrate the *most-dependent* component early to surface high-risk interactions (source: m4-integration). Here B has the most dependencies, so once its prerequisites (A, then C) exist, B should be integrated and tested as early as those allow; A is the unavoidable starting point because everything else depends on it. Accept either emphasis if the reasoning cites "integrate most-dependent earlier" and respects A→C→B order.

**C7 (model).** Incremental integration adds and tests one component (or small group) at a time. So when a build that worked yesterday breaks today, the suspect is the single piece you just added — that is easy fault isolation. Big-bang integration combines everything at once, so a failure could be anywhere and the suspect set is the whole system. The price of incremental is a well-planned test harness, and it can be slow without automation (source: m4-integration).

**X1.** (a) **interface** issue (mismatched data format/boundary); fix: define the interface in an ICD with a standard format and validate it independently / automate the test (source: m4-integration). (b) **integration-strategy** choice; decided by which end is ready and what matters most — control logic early → top-down; critical infrastructure → bottom-up (source: m4-integration). (c) **dependency** issue (incomplete component); prevented by identifying/documenting dependencies early, integrating most-dependent first, and simulating missing components (source: m4-integration). (d) **V&V** activity — user-acceptance testing, owned by [16-verification-validation-methods](../16-verification-validation-methods/README.md) (source: m4-intro).

**X2.** Dependency failure: the power system relied on software-controlled generators but incorrect software integration caused unexpected power losses → lesson: bring more development in-house / earlier subsystem testing. Interface failure: the battery management system did not properly communicate with other systems, overheating lithium-ion batteries → lesson: improve interface documentation with ICDs (source: m4-integration).

**X3.** Bottom-up validates high-level logic *late* and leaves system-level behaviour invisible until late in the process — the worst fit when the chief risk is whether the overall control architecture works (source: m4-integration). Recommend **top-down**: it tests high-level logic and control flow early and is "useful for validating system architecture early" — directly addressing their top risk (source: m4-integration).

**X4 (model edges).** `Top-down` --requires--> `Stubs`; `Bottom-up` --requires--> `Drivers`; `Incremental` --needs--> `Test harness`; `Incremental` --yields--> `Easy fault isolation`; `Stubs`/`Drivers` --enable--> early testing before neighbours exist (source: m4-integration).
