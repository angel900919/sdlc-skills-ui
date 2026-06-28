---
Document: <Project> Architecture Description
Document ID: AD-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 42010:2022
Status: Draft
Owner: <System Architect>
---

<!--
HOW TO USE THIS TEMPLATE
- This is the Phase 04 (Architecture & Design) ISO/IEC/IEEE 42010 architecture description.
- Replace every <ANGLE-BRACKET placeholder>. Resolve or remove every TODO before PDR.
- Rows tagged "(example — delete)" are illustrative shapes only — delete them and write your own.
- All IDs, gates, baselines, T/I/A/D, severities, status strings, diagram names, and standard
  citations come from ../05_Conventions.md — cite that file, never redefine it here.
- The 42010 backbone is: stakeholders -> concerns -> viewpoints -> views. Build it in that order.
- Numbers (latency, uptime, throughput) come from REQ-P-*/REQ-O-*; if absent, mark TODO and
  loop back to Phase 02 — never invent a value.
-->

# <Project> — Architecture Description

## 1. Scope & context

- **System under description:** <one-line description of the system>
- **In scope:** <what this architecture covers>
- **Out of scope:** <what is deliberately excluded; reference where it is handled>
- **Lifecycle model:** <Waterfall | V-Model | Spiral | Agile | Hybrid — from Phase 01 Project Development Plan>
- **Inputs consumed:** Phase 01 `Stakeholder_Mission.md` (STK-*), `OpsCon.md` (SCN-*); Phase 02 `SysRS.md` (REQ-*), `Traceability_Matrix.md`, MOE/MOP/TPM set; Phase 03 BDD/IBD blocks, `Requirements_Diagram.puml`.
- **Gate this clears:** **PDR (Preliminary Design Review)** — establishes the **allocated baseline** (§3 / §3-baselines of Conventions).
- TODO: confirm output path `<output-dir>/<slug>/Phase_04_Architecture/`.

## 2. Architecture principles

> 5–10 high-level, stable rules every later decision is checked against. Each row: the rule, a one-line rationale, and one derived design guideline. Principles are the yardstick for Phase 05 trade-offs.

| # | Principle (rule) | Rationale | Derived design guideline |
|---|---|---|---|
| AP-01 | <e.g. Reuse before buy, buy before build> | <why this rule holds for this project> | <a concrete, checkable guideline> |
| AP-02 | <e.g. Local-first / degrade gracefully offline> | <rationale, tie to a REQ-O-* if one exists> | <guideline> |
| AP-03 | <e.g. Zero-trust across every boundary> | <rationale> | <guideline> |
| AP-04 | Loose coupling between services (example — delete) | Limits blast radius and enables independent deploys | Every cross-service call goes through a versioned ICD interface |
| ... | <add up to ~10; mark any that conflict with each other> | | |

## 3. Stakeholders & concerns

> Reuse `STK-*` from Phase 01. For each stakeholder, capture the architecture *concerns* (phrased as questions) and tie each to a REQ/MOE where one exists. This table is the backbone — every concern must later be answered by at least one view (§5).

| STK-ID | Stakeholder | Concern (as a question) | Linked REQ / MOE | Framed by viewpoint (§5) |
|---|---|---|---|---|
| STK-01 | <stakeholder/role> | <"Will it meet the uptime target?"> | <REQ-O-NN / MOE-NN / TODO> | <Physical/Deployment> |
| STK-02 | <stakeholder/role> | <"Is the attack surface acceptable?"> | <REQ-SEC-NN / TODO> | <Security/Trust-boundary> |
| STK-03 | Operations lead (example — delete) | "Can we diagnose a failed node in < 5 min?" | REQ-O-02, MOE-03 | Operational/Behavioural |
| ... | <add a row per stakeholder concern> | | | |

## 4. Frameworks used

> Frameworks are **complementary, not single-select** — each answers a different question. State in 2–4 sentences which framework you use for what, and why. See the framework decision aid in the Phase 04 skill.

| Framework | Role here (the question it answers) | Why chosen for this project |
|---|---|---|
| <TOGAF ADM> | Governing process/method (9 phases Preliminary→H + central Requirements Management) | <e.g. multi-stakeholder/regulated program needs a governed lifecycle> |
| <C4 or arc42> | Software structure / document spine | <e.g. software-dominant cloud tier> |
| <Zachman> | Coverage checklist (6×6 — what must be documented, from whose viewpoint) | <e.g. audit completeness check> |
| <NIST EA> | Layering (Business → Tech) for regulated slices | <only if regulated; else delete> |

> If TOGAF is in play, map this work onto its 9 phases with Requirements Management at the centre (not a 10th step). TODO: add the TOGAF phase mapping if applicable.

## 5. Viewpoints & views

> Instantiate a view only if at least one *concern* (§3) demands it. Always produce Logical + Physical/Deployment. Add Security view whenever a trust boundary or `REQ-SEC-*` exists; Information view when data residency/PII/retention matters; Operational/Behavioural for modes-rich or safety systems. Name diagram files `Architecture_<viewpoint>.puml` (Conventions §7).

### 5.1 <Logical / Functional> view  →  `Architecture_Logical.puml`

- **Addressed concerns:** <STK-01, STK-04 …>
- **Diagram:** `Architecture_Logical.puml`  — TODO: create
- **Model (prose):** <Group every Phase 03 BDD block; describe responsibilities and relationships. No phantom blocks — every block traces to a BDD block or is marked `TODO: add to BDD`.>

### 5.2 <Physical / Deployment> view  →  `Architecture_Deployment.puml`

- **Addressed concerns:** <STK-02, STK-03 …>
- **Diagram:** `Architecture_Deployment.puml`  — TODO: create
- **Model (prose):** <Place blocks in zones (Edge / Cloud / Client / External). Draw trust boundaries as PlantUML `package`s — these seed the Security thread. Each cross-boundary edge becomes an ICD row (see ICD.md §2).>

### 5.3 <Security / Trust-boundary> view  →  `Architecture_Security.puml`  *(if any trust boundary or REQ-SEC-* exists)*

- **Addressed concerns:** <STK-02 …>
- **Diagram:** `Architecture_Security.puml`  — TODO: create or mark "tailored out: <reason>"
- **Model (prose):** <Trust boundaries, data-in-transit/at-rest, auth mechanisms per crossing. Hand each crossing seam to the Security thread as a `THR-*`.>

### 5.4 <Information / Data> view  →  `Architecture_Information.puml`  *(if data residency/PII/retention matters)*

- **Addressed concerns:** <…>
- **Diagram:** `Architecture_Information.puml`  — TODO: create or tailor out
- **Model (prose):** <Key data entities, ownership, residency, retention, classification.>

### 5.5 <Operational / Behavioural> view  →  `Architecture_Operational.puml`  *(modes-rich / safety systems)*

- **Addressed concerns:** <…>
- **Diagram:** `Architecture_Operational.puml`  — TODO: create or tailor out
- **Model (prose):** <Operating modes, function sequencing/control flow (FFBD; pairs with Phase 03 Activity diagrams).>

> Example viewpoint coverage row (example — delete): "Technology view — addresses STK-05's 'is the stack supportable?' — deferred to Tech_Stack_Rationale.md."

## 6. Requirement-to-block allocation

> The heart of the **allocated baseline** PDR sets. Every functional/performance/interface/safety/security REQ must land on ≥ 1 block; every block must carry ≥ 1 REQ. Orphan blocks **and** unallocated REQs both fail the gate. Reuse Phase 03 `satisfy` links where they exist — do not re-derive.

| REQ-ID | Requirement (short) | Allocated to block(s) | Trace source (BDD `satisfy` / new) |
|---|---|---|---|
| REQ-F-01 | <what the system does> | <Block-A, Block-B> | <Phase 03 satisfy / TODO> |
| REQ-P-01 | <performance threshold> | <Block-C> | <Phase 03 satisfy / TODO> |
| REQ-SEC-01 | <security control> | <Block-D> | <Phase 03 satisfy / TODO> |
| REQ-INT-01 | <external interface> | <Block-E> (→ ICD-NN) | (example — delete) |
| ... | <one row per relevant REQ> | | |

- TODO: confirm no orphan blocks (every block above appears in §5 views).
- TODO: confirm no unallocated REQ (cross-check against `SysRS.md`).

## 7. Architecture decisions (candidates for Phase 05)

> Seeds for Phase 05 trade-off. Each strategic, expensive-to-reverse choice gets a `DEC-TBD` placeholder here, handed to `se-phase-05-tradeoff` to be made auditable via a `DM-NN` matrix.

| DEC-TBD | Decision to be made | Open alternatives (≥ 2) | Drives REQ / MOE |
|---|---|---|---|
| DEC-TBD | <e.g. hosting topology> | <cloud / on-prem / hybrid-edge> | <REQ-O-NN> |
| DEC-TBD | <e.g. comms protocol> | <protocol A / protocol B / proprietary> | <REQ-INT-NN> |
| DEC-TBD | Persistence engine (example — delete) | relational / document / distributed-SQL | REQ-P-03, REQ-O-01 |

## 8. Open risks / TODOs (PDR readiness)

> Surface any open `RSK-*` of severity High/Critical that block PDR, plus every unresolved TODO above.

| RSK-ID / TODO | Description | Severity (S1–S4) / band | Blocks PDR? | Owner / action |
|---|---|---|---|---|
| RSK-NN | <architectural single point of failure> | <High/Critical> | <Y/N> | <action> |
| TODO | <e.g. backfill STK-* in Phase 01> | — | <Y/N> | <action> |
| RSK-07 | Single-vendor dependency on <X> (example — delete) | High | Y | Raise mitigation in Phase 05 DM-NN |

---

### PDR exit-gate self-check (delete once green)

- [ ] Every stakeholder concern (§3) is addressed by ≥ 1 view (§5).
- [ ] 5–10 architecture principles stated (§2), each with a rationale.
- [ ] Frameworks chosen and their complementary roles justified (§4).
- [ ] Every Phase 03 BDD block appears in the Logical/Physical views (no phantom blocks).
- [ ] Allocation matrix complete (§6) — every relevant REQ allocated; no orphan blocks.
- [ ] Every `REQ-INT-*` / external dependency has an `ICD-NN` entry in `ICD.md`.
- [ ] Trust boundaries drawn; each crossing seam linked to a `THR-*` (or TODO).
- [ ] No open `RSK-*` of High/Critical severity blocking PDR.
- [ ] `ICD.md` status = `Draft` (frozen at CDR, not now).
