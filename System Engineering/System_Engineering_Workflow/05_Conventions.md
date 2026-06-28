# Conventions — the single source of truth

> **This file is the contract.** Every stage guide, template, prompt, checklist, and worked‑example artifact in this workflow conforms to the identifiers, gates, methods, severities, and naming defined here. When anything elsewhere disagrees with this file, **this file wins** — fix the other place. Centralising these conventions is the direct fix for the audit finding that they were previously restated (and drifting) in 2–9 places.

---

## 1. The 12 stages at a glance

| # | Stage | Purpose (one line) | Primary deliverables | Exit gate |
|---|---|---|---|---|
| 00 | **Agreement & Enablement** | Establish the deal and the means to execute it. | `Agreement_Register.md`, `SEMP.md` (SE Management Plan), `Project_Enablement_Plan.md` | ATP (Authority to Proceed) |
| 01 | **Concept** | Decide *what*, *for whom*, *why* — and whether it's feasible. | `Stakeholder_Mission.md`, `StRS.md`, `OpsCon.md`, `Feasibility_Study.md`, `Project_Development_Plan.md` | MCR / SRR‑entry |
| 02 | **Requirements** | Turn needs into a baselined, testable system spec. | `SysRS.md` (ISO/IEC/IEEE 29148), `Traceability_Matrix.md`, MOE/MOP set | **SRR** |
| 03 | **Modeling (MBSE)** | Build the SysML single source of truth. | 7 PlantUML diagrams + `Requirements_Diagram.puml`, coverage matrices | Model coverage gate |
| 04 | **Architecture & Design** | Choose framework, freeze interfaces, justify the stack. | `Architecture_Description.md` (ISO 42010), `ICD.md`, `Tech_Stack_Rationale.md` | **PDR** |
| 05 | **Trade‑off & Decision** | Make every strategic decision auditable. | `Decision_Matrices.md` (+ sensitivity), `Decision_Register.md`, optional `COCOMO_Estimate.md` | Decisions traced |
| 06 | **Integration** | Plan how parts come together without late surprises. | `Integration_Plan.md` (increments, dependencies, CI/CD, HIL) | **CDR** |
| 07 | **Verification** | Prove the system meets the spec ("built it right"). | `Verification_Matrix.md`, V&V Plan, evidence | **TRR** |
| 08 | **Validation** | Prove the system meets needs ("built the right thing"). | `Test_Plan.md`, `Test_Cases.md` (TC‑VAL‑*) | **PRR** |
| 09 | **Change & Configuration Mgmt** | Evolve the system without losing coherence. | `Change_Management_Plan.md`, `Configuration_Management_Plan.md`, CR log | Baselines current |
| 10 | **Operations & Continuous Validation** | Keep the deployed system meeting the spec over its life. | `Operations_Continuous_Validation.md`, SLOs, runbooks | **ORR** → GA (continuous) |
| 11 | **Disposal & Retirement** | Retire the system safely and capture knowledge. | `Disposal_Plan.md` (decommission, sanitization, environmental, archival) | **DRR** |

> **Tailoring note.** Not every project produces every artifact. The [Tailoring Guide](04_Tailoring_Guide.md) defines *Minimum‑Viable* vs *Formal* artifact sets by project size and criticality. Stages are never skipped silently — a tailored‑out artifact is recorded as "tailored out: \<reason\>".

---

## 2. Identifier grammar

All IDs are uppercase, hyphen‑separated, with a **zero‑padded two‑digit** sequence (`-01`, not `-1`). They are **stable for the life of the project** — never renumber; retire with a `(deprecated)` note instead.

### 2.1 Requirements — `REQ-<class>-<nn>`

| Class | Code | Covers | Space |
|---|---|---|---|
| Functional | `F` | What the system *does* — actions, decisions, outputs. | Solution |
| Usability | `U` | UX targets — task time, accessibility, language, learnability. | Solution |
| Performance | `P` | Latency, throughput, capacity, accuracy, energy. | Solution |
| Operational / Reliability | `O` | Uptime, MTBF/MTTR, availability, OTA, offline, retention. | Solution |
| Security | `SEC` | AuthN/AuthZ, crypto, audit, supply‑chain, compliance. | Solution |
| Interface | `INT` | External I/O — protocols, ports, ICD seams. | Solution |
| Constraint | `C` | Imposed limits — budget ceiling, mandated tech, regulation. | Both |
| Domain | `D` | Industry‑specific compliance/standards (UL, IEC, DO, ISO). | Both |
| Safety | `SAF` | Hazard‑mitigating behaviour (use when a safety thread exists). | Solution |

> **Quality‑attribute requirements** (the "‑ilities": scalability, maintainability, portability, etc.) are written under the closest class (usually `P` or `O`) and tagged with the attribute in the statement. Don't invent new class letters for each "‑ility".

### 2.2 Stakeholder / needs / problem‑space IDs

| Artifact | ID form | Owner stage |
|---|---|---|
| Stakeholder | `STK-<nn>` | 01 |
| Stakeholder need (StRS) | `SN-<nn>` | 01 |
| Operational scenario (OpsCon) | `SCN-<nn>` | 01 |
| Measure of Effectiveness | `MOE-<nn>` | 02 |
| Measure of Performance | `MOP-<nn>` | 02 |
| Technical Performance Measure | `TPM-<nn>` | 02 → tracked 06–10 |

The needs‑to‑requirements thread is: `SN → (derive) → REQ`, `SN → MOE`, `REQ → MOP`, selected MOPs promoted to `TPM`.

### 2.3 Design, decision & interface IDs

| Artifact | ID form | Owner |
|---|---|---|
| Architecture decision / trade study | `DEC-<nn>` (a.k.a. ADR) | 05 |
| Decision matrix | `DM-<nn>` | 05 |
| Interface (ICD row) | `ICD-<nn>` | 04 |
| Integration increment | `INC-<nn>` | 06 |
| Configuration item | `CI-<nn>` | 09 |

### 2.4 V&V, change, risk & ops IDs

| Artifact | ID form | Owner |
|---|---|---|
| Verification test case | `TC-VER-<nn>` | 07 |
| Validation test case | `TC-VAL-<nn>` | 08 |
| Change request | `CR-<nn>` | 09 |
| Risk | `RSK-<nn>` | Risk thread |
| Opportunity | `OPP-<nn>` | Risk thread |
| Hazard (safety log) | `HAZ-<nn>` | Safety/RAMS thread |
| Threat (threat model) | `THR-<nn>` | Security thread |
| Service Level Objective | `SLO-<nn>` | 10 |
| Runbook | `RB-<nn>` | 10 |

Placeholder convention: a not‑yet‑assigned link is `TC-VER-TBD` / `DEC-TBD` etc. — never a blank cell. Placeholders are resolved in their owning stage.

---

## 3. Review gates (the milestone ladder)

The canonical gate ladder, each gate owned by exactly one stage. Gate criteria live in the owning stage and in [`checklists/gate-reviews.md`](checklists/) — nowhere else.

```
ATP ─ MCR ─ SRR ─ PDR ─ CDR ─ TRR ─ PRR ─ ORR ─ GA ┄┄(operations loop)┄┄ DRR
00    01    02    04    06    07    08    10   10            10            11
```

| Gate | Name | Owning stage | "Passes when…" |
|---|---|---|---|
| **ATP** | Authority to Proceed | 00 | Agreement signed; SEMP approved; funding & team authorised. |
| **MCR** | Mission Concept Review | 01 | Mission, ConOps, feasibility accepted; lifecycle model chosen. |
| **SRR** | System Requirements Review | 02 | Every REQ passes SMART; StRS→SyRS traced; requirements baselined. |
| **PDR** | Preliminary Design Review | 04 | Architecture approved; framework chosen; no critical open risks; allocated baseline set. |
| **CDR** | Critical Design Review | 06 | Detailed design complete; **ICDs frozen**; integration plan ready; product baseline set. |
| **TRR** | Test Readiness Review | 07 | 100% requirement coverage by method; test env & data ready. |
| **PRR** | Production Readiness Review | 08 | Validation ≥ targets; zero sev‑1; FCA/PCA done; ready to produce/release. |
| **ORR** | Operational Readiness Review | 10 | Deployment, runbooks, SLOs, on‑call, rollback all in place. |
| **GA** | General Availability | 10 | Live to all users; error budgets honoured (continuous thereafter). |
| **DRR** | Decommissioning Readiness Review | 11 | Retirement plan, data sanitization, environmental & archival approved. |

**Baselines** are established at gates and frozen thereafter (changes only via Stage 09):

| Baseline | Established at | Contains |
|---|---|---|
| Functional / Requirements baseline | SRR | StRS, SysRS, MOE/MOP set |
| Allocated baseline | PDR | Architecture, requirement‑to‑block allocation, ICD draft |
| Product baseline | CDR | Frozen ICDs, detailed design, build/config recipe |

---

## 4. Verification methods — T / I / A / D

Assigned per REQ. A **default** is *seeded* in Stage 02 and *finalised* (authoritative) in Stage 07.

| Code | Method | Use it when… | Evidence |
|---|---|---|---|
| **T** | **Test** | The requirement has a measurable threshold provable by exercising the system. | Test report, logs, measured value vs. threshold. |
| **I** | **Inspection** | Provable by examining the artifact/design/document/code without executing it (includes structured **review**/walkthrough). | Inspection record, review minutes, checklist. |
| **A** | **Analysis** | Provable by calculation, modelling, simulation, or similarity rather than direct test. | Analysis report, model output, calculation. |
| **D** | **Demonstration** | Provable by operating the system and observing behaviour (no instrumentation/measurement needed). | Demo record, witness sign‑off, recording. |

> "Review" is not a fifth code — it is a structured form of **Inspection** (peer review, design review). Acceptance/UAT is a **validation** activity (Stage 08), not a verification method, even though it often reuses T/D.

---

## 5. Severity & priority

### 5.1 Defect / incident severity — `S1`–`S4`

One taxonomy for defects (Stage 08), change priority (Stage 09), and incidents (Stage 10). `SEV‑n` is an accepted **operations alias** for `Sn`.

| Severity | Name | Meaning |
|---|---|---|
| **S1** | Critical | Safety impact, data loss, or total loss of primary function; no workaround. |
| **S2** | Major | Major function impaired or degraded; awkward workaround only. |
| **S3** | Minor | Minor function affected; easy workaround. |
| **S4** | Cosmetic | Trivial / cosmetic; no functional impact. |

### 5.2 Priority / importance — High / Medium / Low / N‑A

Used for requirement prioritisation, risk response, and CR scheduling. (MoSCoW — Must/Should/Could/Won't — is an accepted alias; map Must→High, Should/Could→Medium, Won't→N‑A.)

### 5.3 Risk & opportunity scoring

`Likelihood × Impact`, each on a 1–5 scale → a 5×5 matrix giving Low / Medium / High / Critical bands. See the [Risk & Opportunity thread](cross-cutting/Risk_and_Opportunity_Management.md) for the band definitions and response strategies.

---

## 6. Document status & versioning

Every deliverable carries frontmatter:

```markdown
---
Document: <Title>
Document ID: <TYPE>-<PROJECT_SLUG>-vX.Y
Standard: <e.g. ISO/IEC/IEEE 29148:2018>
Status: <Draft | In Review | Baseline (<GATE>-approved YYYY-MM-DD) | Superseded by vX.Y>
Owner: <role>
---
```

- **Status strings** are exactly: `Draft` → `In Review` → `Baseline (<GATE>-approved <date>)` → `Superseded`. A baselined artifact changes **only** through a `CR-<nn>` (Stage 09).
- **Doc version** is `vMAJOR.MINOR`: minor bump for tracked edits, major bump at each re‑baseline. The build/config recipe uses **semver** `MAJOR.MINOR.PATCH` (breaking / feature / fix) — do **not** key semver to change‑class letters.

---

## 7. Diagrams

- **Notation:** PlantUML (`.puml`) — text‑as‑diagram, diffs cleanly in git, renders via `plantuml *.puml` or the VS Code PlantUML extension. Escalate to a true MBSE tool (Cameo, Capella, Sparx) when a live model/digital‑thread is required — see [Stage 03](skills/se-phase-03-modeling/) and the SysML‑v2 note there.
- **The 7‑diagram working set** is a deliberate subset of SysML's **9** diagram types. The 7 produced here: **Use Case · Block Definition (BDD) · Internal Block (IBD) · State Machine · Activity · Sequence · Requirements**. The two omitted by default — **Package** and **Parametric** — are added when model size (Package) or physical/parametric constraints (Parametric) warrant. *Always state "7 of 9" so readers cross‑referencing SysML aren't confused.*
- **File names:** `Use_Case_Diagram.puml`, `BDD.puml`, `IBD.puml`, `State_Machine.puml`, `Activity_<scenario>.puml`, `Sequence_<scenario>.puml`, `Requirements_Diagram.puml`.

### SysML relationship vocabulary (all 7)

| Relationship | Meaning |
|---|---|
| **derive** | A lower‑level requirement extracted from a higher‑level one (adds constraints from analysis). |
| **refine** | Clarifies a requirement via any model element (e.g. a use case refining a need). |
| **satisfy** | A design/block element fulfils a requirement (an **assertion**, not proof). |
| **verify** | A test case (or I/A/D activity) proves a requirement. |
| **copy** | A reused requirement referencing a master (read‑only mirror). |
| **containment** (composite) | A requirement decomposed into sub‑requirements via namespace nesting. |
| **trace** | A general dependency when none of the above fits (use sparingly). |

---

## 8. The traceability spine

The single golden thread that every stage extends and never breaks:

```
Stakeholder need (SN) ──derive──▶ Requirement (REQ) ──satisfy──▶ Design block (BDD/IBD)
        │                              │                                 │
       MOE                            MOP/TPM                       Interface (ICD)
        │                              │                                 │
        └────────────── verify ◀── Test case (TC-VER / TC-VAL) ◀── Increment (INC)
                                       │
                              Change request (CR) ──▶ re-baseline ──▶ SLO (operations)
```

Forward (`SN→REQ→design→code→test`) **and** backward (`test→…→SN`) traceability are maintained continuously. **Bidirectional** traceability is mandatory for safety‑critical / regulated work (DO‑178C, ISO 26262, IEC 62304).

---

## 9. Canonical standard citations

Use these exact forms (the audit found drifting/superseded citations):

| Domain | Canonical citation |
|---|---|
| SE lifecycle processes | **ISO/IEC/IEEE 15288:2023** |
| Requirements engineering | **ISO/IEC/IEEE 29148:2018** — document set BRS · StRS · **SyRS** · SRS · OpsCon |
| Architecture description | **ISO/IEC/IEEE 42010:2022** |
| V&V | **IEEE 1012‑2016** |
| Software test documentation | **ISO/IEC/IEEE 29119‑3:2021** (supersedes IEEE 829 — mark 829 *superseded*) |
| Risk management | **ISO 31000:2018** |
| Configuration management | **ISO 10007:2017** (+ EIA‑649 / IEEE 828) |
| Quality management | **ISO 9001:2015** |
| Secure media sanitization | **NIST SP 800‑88 Rev. 1** |
| Security controls | **ISO/IEC 27001:2022**, **NIST SP 800‑53 Rev. 5**, **NIST SP 800‑160** |
| Practitioner handbooks | **INCOSE SE Handbook v5 (2023)**, **NASA/SP‑2016‑6105 Rev 2** |
| Safety‑critical (domain) | DO‑178C (airborne sw), ISO 26262 (automotive), IEC 62304 (medical sw), IEC 61508 (functional safety) |

> Note: **IEEE 830‑1998** (SRS) was rolled into ISO/IEC/IEEE 29148 — cite 29148, mention 830 only as historical context.

---

## 10. Project folder layout (per instance)

When this workflow is *applied* to a real project, it produces:

```
<project-slug>/
├── README.md
├── Phase_00_Agreement/        Agreement_Register.md · SEMP.md · Project_Enablement_Plan.md
├── Phase_01_Concept/          Stakeholder_Mission.md · StRS.md · OpsCon.md · Feasibility_Study.md · Project_Development_Plan.md
├── Phase_02_Requirements/     SysRS.md · Traceability_Matrix.md
├── Phase_03_Modeling/         *.puml (7 diagrams) · coverage matrices
├── Phase_04_Architecture/     Architecture_Description.md · ICD.md · Tech_Stack_Rationale.md
├── Phase_05_Tradeoff/         Decision_Matrices.md · Decision_Register.md · COCOMO_Estimate.md?
├── Phase_06_Integration/      Integration_Plan.md
├── Phase_07_Verification/     Verification_Matrix.md · VnV_Plan.md
├── Phase_08_Validation/       Test_Plan.md · Test_Cases.md
├── Phase_09_Change_Config/    Change_Management_Plan.md · Configuration_Management_Plan.md · CR_Log.md
├── Phase_10_Operations/       Operations_Continuous_Validation.md · runbooks/
├── Phase_11_Disposal/         Disposal_Plan.md
└── _cross_cutting/            Risk_Opportunity_Register.md · Hazard_Log.md · Threat_Model.md · TPM_Tracker.md · QA_Plan.md
```

Blank, fill‑in versions of every file above live in [`templates/`](templates/).
