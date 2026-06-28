---
name: se-phase-04-architecture
description: Runs Phase 04 (Architecture & Design) of the systems-engineering workflow. It builds an ISO/IEC/IEEE 42010 architecture description (stakeholders -> concerns -> viewpoints -> views), states architecture principles, selects and combines architecture frameworks (TOGAF ADM, Zachman, NIST EA, C4, arc42 — complementary, not single-select), allocates requirements to building blocks, freezes every component-to-component seam in an Interface Control Document (ICD.md, Draft at PDR / frozen at CDR), and justifies the technology stack including an explicit "what we are NOT using and why". Produces Architecture_Description.md, ICD.md, Tech_Stack_Rationale.md, plus Architecture diagrams. Use when the user wants to write the system architecture, draft or baseline an ICD, define interfaces/protocols/trust boundaries between subsystems, set architecture principles, pick or combine frameworks (TOGAF/Zachman/NIST/C4/arc42), choose and justify a tech stack, allocate requirements to blocks, or prep for a PDR. Triggers on phrasings like "write the architecture", "architecture description", "draft the ICD", "ISO 42010 views", "architecture principles", "tech stack rationale", "pick a framework", "TOGAF ADM", "C4 model", "trust boundaries", "prep for PDR", "phase 4 architecture".
disable-model-invocation: true
user-invocable: true
---

# Phase 04 — Architecture & Design

<what-to-do>

Turn the baselined requirements and the MBSE model into an agreed, view-based **architecture description** (ISO/IEC/IEEE 42010), freeze every interface in an **ICD**, and justify the technology stack — then clear the exit gate: **PDR (Preliminary Design Review)**, which sets the **allocated baseline**. This phase conforms to [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) for all IDs, gates, baselines, T/I/A/D, severities, status strings, diagrams, and standard citations — cite that file, never redefine it.

## Inputs (from prior phases)
- **Phase 01 Concept** — `Stakeholder_Mission.md` (`STK-*`), `OpsCon.md` (`SCN-*`), `Feasibility_Study.md`, lifecycle model. Reuse stakeholders + scenarios as the 42010 *stakeholders* and as drivers of *concerns*. *Fallback:* if absent, elicit the stakeholder/concern list inline and mark `TODO: backfill STK-* in Phase 01`.
- **Phase 02 Requirements** — `SysRS.md` (especially `REQ-INT-*`, `REQ-SEC-*`, `REQ-P-*`, `REQ-SAF-*`, `REQ-C-*`, `REQ-D-*`), `Traceability_Matrix.md`, MOE/MOP/TPM set. These drive principles, view content, ICD latency budgets, and the allocation matrix. *Fallback:* if a needed REQ is missing, do not invent it — mark `TODO: define REQ-… in Phase 02` and loop back.
- **Phase 03 Modeling** — BDD/IBD blocks, State Machine, Activity/FFBD sequencing, `Requirements_Diagram.puml`, coverage matrices. Every architecture block must trace to a BDD block. *Fallback:* if the model is thin, capture blocks inline and mark `TODO: add to BDD`.
- **Cross-cutting** — open `RSK-*` (Risk), `THR-*` (Threat Model / Security), `HAZ-*` (Hazard Log / Safety) registers if they exist; this phase feeds and consumes them.

## Step-by-step
> **Interview one topic at a time.** Ask the questions for the current step, convert the answers into the deliverable, then move on. Use `AskUserQuestion` for finite choices. Never dump a wall of questions; never re-ask a fact already in Phases 01–03.

1. **Read prior artifacts & confirm output path.** Load the inputs above. Default output: `<output-dir>/<slug>/Phase_04_Architecture/`. Summarise back the stakeholders, key REQ classes, and BDD blocks you found so the user can correct before you build on them.

2. **Set the 42010 scaffold — stakeholders → concerns.** This is the backbone of the architecture description. Reuse `STK-*` from Phase 01. For each stakeholder, ask (one stakeholder group at a time) *what must this architecture answer for you?* — capture **concerns** (e.g. "Will it meet 99.99% uptime?", "Is the attack surface acceptable?", "Can we afford the stack?"). Tie each concern to a REQ/MOE where one exists. Output the **Stakeholders & Concerns** table.

3. **State architecture PRINCIPLES.** Before any boxes, agree 5–10 high-level, stable rules that every later decision is checked against (e.g. "Reuse before buy, buy before build", "Local-first / degrade gracefully offline", "Security is everyone's responsibility — zero-trust across boundaries", "Loose coupling between services", "Standards-based interfaces only"). Ask the user to confirm/extend a starter set; each principle gets a one-line **rationale** and, where possible, a derived **design guideline**. Principles are the yardstick for Phase 05 trade-offs.

4. **Choose viewpoints, then build views.** Concerns are *framed by* viewpoints; each viewpoint yields one **view** (a concern-specific model). Offer the canonical viewpoint set with `AskUserQuestion` (multi-select — pick what the concerns demand): **Business/Context · Logical/Functional · Physical/Deployment · Information/Data · Operational/Behavioural · Security/Trust-boundary · Technology**. For each chosen viewpoint, produce a view: a PlantUML diagram + a short prose model that *answers its stakeholders' concerns*. The **Logical view** groups every BDD block; the **Physical/Deployment view** places blocks in zones (Edge / Cloud / Client / External) and **draws trust boundaries** as `package`s (this seeds the Security thread). Name files `Architecture_<viewpoint>.puml`.

5. **Select & COMBINE frameworks (complementary, not single-select).** Frameworks answer different questions and are layered together — see the decision aid below. Use `AskUserQuestion` (multi-select). Typical combination: **C4 or arc42** for the software view + **TOGAF ADM** as the governing process (Preliminary → A–H + central Requirements Management) + **Zachman** as a coverage *checklist* + **NIST EA** layering for regulated programs. Record in 2–4 sentences *which framework you use for what* and why. If TOGAF is in play, map your work onto its 9 phases and note that Requirements Management is the central process tying them together.

6. **Allocate requirements to blocks.** Build the allocation matrix `REQ-<id> → block(s)` — the heart of the **allocated baseline** PDR sets. Every functional/performance/interface/safety/security REQ must land on at least one block; every block must carry at least one REQ (orphan blocks and unallocated REQs both fail the gate). Where the model already has `satisfy` links (Phase 03), reuse them; do not re-derive.

7. **Build the ICD inventory.** Enumerate every **seam** where two independently developed components meet (each cross-boundary edge in step 4's deployment view is one). Assign `ICD-<nn>`. For each row: **Sender → Receiver**, **Layer** (Physical / Protocol / Application / Network), **Standard** (named — e.g. OCPP 2.0.1, ISO 15118-2, REST+JSON/OpenAPI, CAN-FD, MQTT, gRPC), **Direction** (Bi / In / Out).

8. **Detail each ICD entry (one sub-section per `ICD-<nn>`).** Capture the contract: transport/physical layer; subprotocol/message set; **authentication** (mTLS / OAuth 2.1 / API key / cert / RFID / EMV); message format (OpenAPI path / Protobuf / JSON Schema / ASN.1); cadence (heartbeat / polling / event-driven); **latency budget sourced from a Performance REQ** (mark `TODO: define latency budget for ICD-<nn> in Phase 02` if none exists — never invent a number); failure modes (timeout/retry, offline buffering, fallback); versioning (semver / capability negotiation); linked REQs. Flag whether the seam crosses a **trust boundary** (→ Security thread) or is **safety-relevant** (→ Safety thread).

9. **Write the ICD with the correct status.** Per Conventions §3, the ICD is **`Draft`** in the allocated baseline at **PDR**, and is **frozen → `Baseline (CDR-approved …)`** as part of the product baseline at **CDR (Phase 06)** — do not mark it baselined now. Frontmatter `Status: Draft`. (This resolves the old skill's Draft-vs-Baseline contradiction.)

10. **Technology stack rationale.** For each major tier (Hardware / Firmware / Edge OS / Backend / Database / Mobile / Web / Infra / Observability / Auth / Payment / Standards as applicable), capture **Choice · Alternatives considered (≥ 2) · Why this (link a REQ/principle/constraint)**. Then the load-bearing section: **§ What we are NOT using and why** — 4–8 tempting alternatives each with a specific rejection reason tied to a REQ or principle (e.g. "Not using OCPP 1.6 — no ISO 15118 Plug-and-Charge, blocks `REQ-F-02`"). Respect mandated-tech `REQ-C-*`/`REQ-D-*`.

11. **Stakeholder-tailored views (optional).** Ask whether to emit an Executive 1-pager, Engineering spec pack, or Regulator audit pack into `Phase_04_Architecture/views/<audience>.md`. Match detail to audience (KB topic 14): managers get scope/trade-offs, engineers get interfaces, regulators get the controls/compliance trace.

12. **PDR exit-gate check.** Run the Exit-gate checklist below. Surface any open `RSK-*` of severity High/Critical that block PDR. Recommend a gate decision (Proceed · Proceed-with-actions · Hold · Re-baseline · Stop), then print all output paths and recommend **`se-phase-05-tradeoff`** to make every framework/stack/interface decision auditable via weighted decision matrices (and COCOMO if software-heavy).

## Decision points
- **Which viewpoints to instantiate?** Decision aid: produce a view only if at least one *concern* (step 2) demands it. Always do Logical + Physical/Deployment; add Security view whenever any trust boundary or `REQ-SEC-*` exists; add Information view when data residency/PII/retention matters; add Operational/Behavioural for modes-rich or safety systems.
- **Which frameworks to combine?** See the decision aid table. Default for mixed hardware/software: C4/arc42 (software) + TOGAF ADM (governance) + Zachman as a coverage check. Don't force one framework to do all four jobs (method / coverage / layering / software-detail).
- **Is a given decision architecture or design?** Architecture = which blocks exist + how they relate + guiding rules; design = how one block is implemented (KB topic 10). Test: "does it change which blocks exist or how they connect?" If yes → architecture (decide now, record as `DEC-*` candidate for Phase 05); if no → it is detailed design, defer.
- **Where does the ICD seam sit?** If two *independently developed/owned* components meet → it is an ICD row. Internal couplings inside one block belong to the IBD, not the ICD.

## Rules
- **Conform to Conventions for everything shared.** IDs (`ICD-<nn>`, `DEC-<nn>` placeholders, `REQ-*`), gates, baselines, T/I/A/D, severity `S1`–`S4`, status strings, PlantUML conventions, and standard citations all come from [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md). Cross-reference other phases; never restate their conventions here.
- **One topic at a time.** Interview-drive each step; convert answers to deliverables before moving on; never re-ask Phase 01–03 facts.
- **Do not copy the worked example's numbers.** Latency budgets, protocols, and zones are project-specific — drive them from *this* project's REQs. The EV-charging worked example is a shape to imitate, not values to paste.
- **No phantom blocks.** Every architecture block traces to a Phase 03 BDD block (or note `TODO: add to BDD`). Every cross-boundary edge becomes an ICD row.
- **No vague ICD rows.** Every interface names a standard or an in-house spec with a link — never "JSON over HTTP" without an OpenAPI/JSON-Schema reference.
- **Numbers come from REQs.** Latency, throughput, uptime budgets are sourced from `REQ-P-*`/`REQ-O-*`; if absent, mark `TODO:` and loop back to Phase 02. Never invent.
- **ICD is Draft now, frozen at CDR.** Do not mark it `Baseline` in Phase 04.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../../se-workflow/templates/`](../../../se-workflow/templates/). Compact skeletons:

### `Architecture_Description.md` (ISO/IEC/IEEE 42010:2022)
```markdown
---
Document: <Project> Architecture Description
Document ID: AD-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 42010:2022
Status: Draft
Owner: System Architect
---
## 1. Scope & context
## 2. Architecture principles            # 5–10, each: rule · rationale · derived guideline
## 3. Stakeholders & concerns            # table: STK-id | stakeholder | concern | linked REQ/MOE
## 4. Frameworks used                    # which framework does what, and why (complementary)
## 5. Viewpoints & views                 # per viewpoint: addressed concerns + diagram link + prose
##    5.x <Viewpoint> view  ->  Architecture_<viewpoint>.puml
## 6. Requirement-to-block allocation    # matrix: REQ-id -> block(s)   (the allocated baseline)
## 7. Architecture decisions (candidates)# DEC-TBD seeds handed to Phase 05
## 8. Open risks / TODOs                 # RSK-* affecting PDR; unresolved TODOs
```

### `ICD.md`
```markdown
---
Document: <Project> Interface Control Document
Document ID: ICD-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 42010:2022 (interface views); ISO/IEC/IEEE 15288:2023 (Architecture/Design Definition)
Status: Draft            # frozen -> Baseline (CDR-approved YYYY-MM-DD) in Phase 06
Owner: System Architect
---
## 1. Scope
## 2. Interface inventory                # the ICD-row table below
## 3. Detailed interface specs           # one sub-section per ICD-nn (template below)
## 4. Cross-cutting concerns             # security/trust boundaries, observability, error handling
## 5. Change control                     # link to Phase 09; freeze at CDR
```

ICD inventory row (§2):

| ICD-ID | Sender | Receiver | Layer | Standard | Direction | Trust-boundary? | Safety-relevant? |
|---|---|---|---|---|---|---|---|
| ICD-01 | `<sender>` | `<receiver>` | Physical/Protocol/App/Network | `<named standard>` | Bi/In/Out | Y/N | Y/N |

ICD detailed spec (§3, per entry):

```markdown
### ICD-NN — <Sender> ↔ <Receiver> (<short label>)
| Attribute | Value |
|---|---|
| Physical / Transport | <connector, bus, network> |
| Subprotocol / message set | <e.g. ocpp2.0.1> |
| Auth | <mTLS / OAuth 2.1 / API key / cert / RFID / EMV> |
| Message format | <OpenAPI path / Protobuf / JSON Schema / ASN.1> |
| Cadence | <event-driven / 30 s / 1 Hz> |
| Latency budget | <≤ X ms from REQ-P-YY  | TODO if none> |
| Failure mode | <timeout/retry / offline buffering / fallback> |
| Versioning | <semver / capability negotiation> |
| Crosses trust boundary | <Y → THR-*?> |   | Safety-relevant | <Y → HAZ-*?> |
| Linked REQs | REQ-INT-NN, REQ-SEC-NN, REQ-P-NN |
```

### `Tech_Stack_Rationale.md`
```markdown
## <Tier>
| Choice | Alternatives considered (≥2) | Why this (link REQ/principle/constraint) |
|---|---|---|
| <e.g. Go 1.22 + Fiber> | Java/Spring, Node/Express, Rust/Axum | 5k RPS throughput + GC predictability (REQ-P-05); team skill. |

### What we are NOT using and why     # 4–8 rows, each a specific rejection tied to a REQ/principle
- **<rejected option>** — <specific reason linking REQ-… or a principle>.
```

### Diagram skeleton (PlantUML — Conventions §7)
```plantuml
@startuml <slug>_Architecture_Deployment
title <Project> — Physical / Deployment view
package "Edge (trust boundary: field)" {
  [Controller]
  [Sensors]
}
package "Cloud (trust boundary: backend)" {
  [App Server]
  [Identity / OAuth]
}
package "Clients (external)" { [Mobile App] }
[Controller] --> [App Server]      : "ICD-01: <protocol> / TLS 1.3"
[Mobile App] --> [Identity / OAuth]: "ICD-02: OAuth 2.1 / TLS 1.3"
@enduml
```

## AI prompt pack
- **ELICIT (concerns → viewpoints):** "Here are our stakeholders `STK-*` and their roles from Phase 01. For each, list 2–3 architecture *concerns* phrased as questions, tie each to a REQ/MOE if one exists, and recommend which 42010 viewpoint (Logical/Physical/Information/Operational/Security/Technology) frames it. Ask me to confirm before drafting."
- **ELICIT (principles):** "Propose 6–8 architecture principles for a <domain> system given these constraints `REQ-C-*`/`REQ-D-*` and these quality goals (MOEs). Each as: principle · rationale · one derived design guideline. Mark any that conflict with each other."
- **GENERATE (architecture description):** "Using the confirmed stakeholders, concerns, principles, BDD blocks, and `REQ-*`, draft `Architecture_Description.md` in the 42010 skeleton: stakeholders→concerns table, the chosen views (with PlantUML), and the REQ-to-block allocation matrix. Leave `TODO:` for any missing input; do not invent numbers."
- **GENERATE (ICD):** "From this deployment view, enumerate every cross-boundary seam as `ICD-01..` rows (Sender, Receiver, Layer, named Standard, Direction, trust-boundary?, safety-relevant?), then draft the detailed spec per entry. Pull latency budgets only from `REQ-P-*`; mark `TODO:` where absent."
- **CRITIQUE / RED-TEAM:** "Act as a PDR review board. Challenge this architecture: which concerns have no view? which REQ is unallocated and which block is an orphan? which ICD row lacks a named standard, an auth mechanism, or a REQ-sourced latency budget? which trust boundary lacks a `THR-*`? Is any 'design' decision masquerading as architecture, or vice versa? List gaps as blocking vs non-blocking for PDR."
- **CRITIQUE (stack):** "Stress-test `Tech_Stack_Rationale.md`: for each tier, is the 'why' tied to a REQ or principle? Is the 'NOT using' list specific (names, not 'considered others')? Flag any mandated-tech `REQ-C-*` we silently overrode."

## Research & specialised-agent triggers
- **WEB RESEARCH when:** pinning a **named interface/protocol standard** and its current version (e.g. OCPP, ISO 15118, OpenADR, MQTT 5, gRPC, CAN-FD) — verify the latest revision rather than trusting memory; checking **domain regulations** that constrain the architecture (`REQ-D-*`: UL/IEC/DO/PCI-DSS/HIPAA/GDPR data-residency); surveying **comparable reference architectures** (well-architected pillars, vendor reference designs); confirming **framework specifics** (TOGAF ADM phase deliverables, NIST EA layers). Use the Context7 MCP for any concrete library/SDK/framework/protocol-library docs and CLI/config syntax.
- **SPECIALISED AGENT when:** the **Security** view warrants a threat-modeling sub-task (STRIDE per trust boundary → `THR-*`); the **Safety** view warrants a hazard pass on safety-relevant interfaces (FHA/PHA → `HAZ-*`); a **standards-research agent** is needed to compile a protocol/standard comparison; a **diagram-generation agent** to render and lint the PlantUML view set.

## Cross-cutting hooks
This phase feeds and consumes these threads (link each in [`../../../se-workflow/cross-cutting/`](../../../se-workflow/cross-cutting/)):
- **Security** — the Physical/Security view's **trust boundaries** are the inputs to threat modeling; every boundary-crossing ICD row should map to a `THR-*` and an auth mechanism. → [`../../../se-workflow/cross-cutting/Security_Engineering.md`](../../../se-workflow/cross-cutting/Security_Engineering.md).
- **Safety / RAMS** — safety-relevant interfaces and blocks feed the hazard log; allocate reliability/availability budgets to blocks here. → [`../../../se-workflow/cross-cutting/Safety_RAMS_Engineering.md`](../../../se-workflow/cross-cutting/Safety_RAMS_Engineering.md).
- **Risk & Opportunity** — architectural dependencies and single points of failure raise `RSK-*`; High/Critical risks block PDR. → [`../../../se-workflow/cross-cutting/Risk_and_Opportunity_Management.md`](../../../se-workflow/cross-cutting/Risk_and_Opportunity_Management.md).
- **Configuration Mgmt** — the architecture + ICD set + allocation matrix *are* the **allocated baseline** established at PDR (frozen for change control in Phase 09). → [`../../../se-workflow/cross-cutting/Configuration_Management.md`](../../../se-workflow/cross-cutting/Configuration_Management.md).
- **Measurement (MOE/MOP/TPM)** — concerns trace to MOEs; performance budgets in the ICD trace to MOPs/TPMs tracked through Phases 06–10. → [`../../../se-workflow/cross-cutting/Measurement_MOE_MOP_TPM.md`](../../../se-workflow/cross-cutting/Measurement_MOE_MOP_TPM.md).
- **HSI** — Operational/Business views surface human-facing interfaces; tie to Usability `REQ-U-*`.

## Standards anchor
Realises the **15288:2023 Architecture Definition** and **Design Definition** technical processes (Workflow Overview §3). It invokes, with the canonical Conventions §9 citations: **ISO/IEC/IEEE 42010:2022** (architecture description — stakeholders, concerns, viewpoints, views — the backbone of `Architecture_Description.md`); **ISO/IEC/IEEE 15288:2023** (the process frame); **TOGAF ADM** (9 phases Preliminary→H + central Requirements Management), **Zachman** (6×6 coverage taxonomy), **NIST EA** (5 layers), **C4 / arc42** (software views) as *complementary* methods; PDR criteria per **INCOSE SE Handbook v5 (2023)** and **NASA/SP-2016-6105 Rev 2**. Security/Safety hooks invoke **ISO/IEC 27001:2022 / NIST SP 800-53 Rev 5 / NIST SP 800-160** and the named safety standards (DO-178C / ISO 26262 / IEC 62304 / IEC 61508) where a thread exists.

## Exit-gate checklist
Clears **PDR** (allocated baseline) when:
- [ ] **42010 description complete** — every stakeholder concern is addressed by at least one view.
- [ ] **Architecture principles** stated (5–10), each with rationale.
- [ ] **Frameworks** chosen and their complementary roles justified.
- [ ] **Every Phase 03 BDD block** appears in the Logical/Physical views (no phantom blocks).
- [ ] **Allocation matrix complete** — every relevant `REQ-*` allocated to ≥1 block; no orphan blocks.
- [ ] **Every `REQ-INT-*`** and every external dependency has an `ICD-<nn>` entry.
- [ ] **Every ICD row** names a standard, an auth mechanism, and a REQ-sourced (or `TODO:`-marked) latency budget; trust-boundary and safety flags set.
- [ ] **ICD status = `Draft`** (not baselined — frozen at CDR).
- [ ] **Tech_Stack_Rationale** references ≥1 REQ/principle per major choice; "NOT using" list has ≥4 specific rejections.
- [ ] **Trust boundaries drawn**; each crossing seam linked to a `THR-*` (or `TODO:`).
- [ ] **No open `RSK-*` of High/Critical severity** blocking PDR.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| ICD marked `Baseline` at PDR. | Confused PDR (allocated) with CDR (product) baseline. | Keep ICD `Draft` now; freeze → `Baseline (CDR-approved …)` in Phase 06 (Conventions §3). |
| TOGAF drawn as 8 sequential phases. | Old "Vision→Change" walk missing Preliminary + central Req-Mgmt. | Use all 9 phases (Preliminary, A–H) with **Requirements Management at the centre**, not a 10th step. |
| One framework forced to do everything. | Single-select picker. | Combine: C4/arc42 (software) + TOGAF (process) + Zachman (coverage) + NIST (layering) per the decision aid. |
| Views with no owner. | Drew diagrams before listing concerns. | Start from stakeholders→concerns; instantiate a view only to answer a concern. |
| ICD says "TBD"/"JSON over HTTP". | Generic `REQ-INT-*`. | Loop to Phase 02 for a specific interface REQ; name a standard + schema link. |
| Latency budgets contradict the SysRS. | Invented numbers. | Drive latencies *from* `REQ-P-*`; mark `TODO:` if none — never guess. |
| Architecture diagram has blocks not in the BDD. | Skipped/shallow Phase 03. | Add the block to the BDD or remove it; no phantom components. |
| Trust boundaries undrawn. | Security view skipped. | Draw boundaries as `package`s; hand each crossing seam to the Security thread (`THR-*`). |

### Framework decision aid (complementary — combine by the question each answers)
| Framework | Kind | Answers | Use it for |
|---|---|---|---|
| **TOGAF ADM** | Process / method (9 phases + central Req-Mgmt) | *How do we build & govern the architecture?* | The governing lifecycle for enterprise/multi-stakeholder/regulated systems. |
| **Zachman** | 6×6 classification taxonomy | *What must be documented, from whose viewpoint?* | A **coverage checklist** over your artifacts (no order/process). |
| **NIST EA** | 5-layer model | *Which layer does this concern live in?* | Slicing federal/regulated programs into Business→Tech layers. |
| **C4** | Software view model (Context→Container→Component→Code) | *What is the software structure?* | Fast software-only/software-dominant views; pairs with PlantUML. |
| **arc42** | Lightweight doc template | *How do we structure the architecture document?* | A pragmatic doc spine for software/hybrid systems. |
| **Cloud Well-Architected** | Quality pillars | *Is the cloud tier sound?* | Operational excellence/security/reliability/perf/cost/sustainability on cloud tiers. |
> FFBD (Functional Flow Block Diagram) — use for the **Operational/Behavioural view** to model function sequencing/control flow (KB topic 14); pairs with the Phase 03 Activity diagrams.

## References
- [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) — IDs, gates (PDR/CDR), baselines, T/I/A/D, severity, status strings, diagrams, standard citations (the contract).
- [`../../../se-workflow/01_Workflow_Overview.md`](../../../se-workflow/01_Workflow_Overview.md) — the 12-stage spine, V-model, 15288 process map, 8 threads.
- KB: [`10-design-architecture-fundamentals`](../../../Systems-Engineering-KB/topics/10-design-architecture-fundamentals/fundamentals.md) (architecture vs design; framework's 5 elements; principles vs guidelines; 42010), [`11-architecture-frameworks`](../../../Systems-Engineering-KB/topics/11-architecture-frameworks/fundamentals.md) (TOGAF 9-phase ADM + central Req-Mgmt; Zachman 6×6; NIST 5 layers; complementary use), [`14-documenting-architecture`](../../../Systems-Engineering-KB/topics/14-documenting-architecture/fundamentals.md) (BDD/IBD/ICD/FFBD; ICD's 6 sections; stakeholder-tailored views).
- [`../../worked_example/Phase_04_Architecture/`](../../worked_example/Phase_04_Architecture/) — worked EV-charging architecture description, ICD, tech-stack rationale (shape to imitate; do not copy its numbers).
- Related phases: `../se-phase-03-modeling/` (BDD/IBD blocks in), `../se-phase-05-tradeoff/` (framework/stack/interface decisions made auditable, out), `../se-phase-06-integration/` (ICD frozen at CDR).

</supporting-info>
