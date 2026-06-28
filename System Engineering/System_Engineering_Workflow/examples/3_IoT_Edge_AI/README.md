---
Document: SentinelEdge — System at a Glance
Document ID: README-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

# SentinelEdge — Industrial Predictive-Maintenance IoT (Edge-AI)

A worked example applying the reusable SE workflow (all 12 phases) to **SentinelEdge**: a wired/battery sensor node (vibration + acoustic + temperature) carrying an **embedded, on-device AI model** that detects machine anomalies and predicts failures on rotating machinery, plus a **local gateway** and a **cloud fleet-management + analytics backend** with signed **OTA firmware and model updates** and governed rollback. Hybrid hardware / firmware / edge-AI / cloud.

> **The embedded AI model is a first-class engineered component** — it has its own requirements, measures, and V&V (detection accuracy, false-positive/false-negative rates, model drift, on-device compute/memory/power budgets, explainability, training-data lineage, and OTA model-update governance with rollback).

This folder is the canonical backbone. Every downstream phase references the IDs established in `Phase_01_Concept/` and `Phase_02_Requirements/`. IDs follow the grammar in `../../05_Conventions.md` (§2) and never renumber (Conventions §2).

---

## Mission

> Cut unplanned downtime on rotating industrial machinery by detecting incipient faults **on the device, at the edge**, early and reliably enough to schedule maintenance before failure — across a managed fleet, on battery, under harsh plant conditions, securely and auditably over the asset's life.

## Standards it must meet (canonical forms — Conventions §9)

- **SE lifecycle:** ISO/IEC/IEEE 15288:2023 · **Requirements:** ISO/IEC/IEEE 29148:2018 (StRS · SyRS · OpsCon)
- **Architecture:** ISO/IEC/IEEE 42010:2022 · **V&V:** IEEE 1012-2016 · **Test docs:** ISO/IEC/IEEE 29119-3:2021
- **Functional safety (machinery):** IEC 61508 (SIL-rated functions) — rotating-machinery hazard mitigation
- **Security:** ISO/IEC 27001:2022 · NIST SP 800-53 Rev. 5 · NIST SP 800-160 · SBOM (SPDX/CycloneDX) · STRIDE threat model
- **Decommissioning:** NIST SP 800-88 Rev. 1 (secure sanitization) · RoHS / WEEE (battery & e-waste) · EU/UN battery transport
- **Risk:** ISO 31000:2018 · **CM:** ISO 10007:2017 · **Quality:** ISO 9001:2015
- **Handbooks:** INCOSE SE Handbook v5 (2023) · NASA/SP-2016-6105 Rev 2

## Lifecycle model — Hybrid V-Model + Agile, Formal on safety/RAMS + edge-AI V&V

- **V-Model** governs firmware, power, and **safety/RAMS** (rotating-machinery functions, reliability allocation, HIL rigs) — every design level pairs with a right-side test.
- **Agile** governs the cloud fleet backend, analytics, dashboards, and the **edge-AI model lifecycle** (train → evaluate → package → OTA), iterated in sprints.
- **Formal** rigour (bidirectional traceability, independent V&V) is applied to the safety/RAMS thread and to edge-AI V&V (accuracy, drift, rollback).
- Tracks integrate at frozen seams (node↔gateway, gateway↔cloud, OTA channel) governed by ICDs in Phase 04.

---

## Phase index (00–11)

| Phase | Folder | Key deliverables | Gate |
|---|---|---|---|
| 00 — Agreement & Enablement | `Phase_00_Agreement/` | Agreement_Register, SEMP, Project_Enablement_Plan | **ATP** |
| 01 — Concept | `Phase_01_Concept/` | **Concept.md** (Stakeholder/Mission · StRS · OpsCon · Feasibility) | **MCR** |
| 02 — Requirements | `Phase_02_Requirements/` | **SysRS.md** (SMART REQ, MOE/MOP/TPM, traceability) | **SRR** |
| 03 — Modeling (MBSE) | `Phase_03_Modeling/` | 7-of-9 SysML PlantUML + Requirements diagram | Model coverage |
| 04 — Architecture & Design | `Phase_04_Architecture/` | Architecture_Description, ICD, Tech_Stack_Rationale | **PDR** |
| 05 — Trade-off & Decision | `Phase_05_Tradeoff/` | Decision_Matrices (DM-*), Decision_Register (DEC-*) | Decisions traced |
| 06 — Integration | `Phase_06_Integration/` | Integration_Plan (INC-*, CI/CD, HIL) | **CDR** |
| 07 — Verification | `Phase_07_Verification/` | Verification_Matrix, V&V Plan (TC-VER-*) | **TRR** |
| 08 — Validation | `Phase_08_Validation/` | Test_Plan, Test_Cases (TC-VAL-*) | **PRR** |
| 09 — Change & Config Mgmt | `Phase_09_Change_Config/` | Change/Config Plans, CR log (CR-*, CI-*) | Baselines current |
| 10 — Operations & Cont. Validation | `Phase_10_Operations/` | Ops & Continuous Validation, SLOs (SLO-*), runbooks (RB-*) | **ORR** → GA |
| 11 — Disposal & Retirement | `Phase_11_Disposal/` | Disposal_Plan (sanitization, battery/WEEE, archival) | **DRR** |

> Gate ladder: ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA → DRR (Conventions §3). Only Phases 01–02 are authored in this example backbone; 03–11 are forward markers populated by downstream phases.

---

## Traceability spine — sample threads

Forward `SN → REQ → design block → ICD → TC` and backward, maintained continuously and **bidirectionally** (safety/RAMS + edge-AI are regulated/safety-relevant — Conventions §8). Design blocks and TCs below are forward placeholders resolved in Phases 03–08.

| Stakeholder need | Requirement(s) | Design block (P04) | Interface (ICD) | Verification (TC-VER) |
|---|---|---|---|---|
| **SN-03** Early, trustworthy fault detection on-device | REQ-F-02, REQ-P-01, REQ-P-02 | Edge-AI Inference Engine | — | TC-VER-TBD |
| **SN-04** Updatable model without truck rolls | REQ-F-06, REQ-O-03, REQ-SEC-04 | OTA Update Manager | ICD (OTA channel) | TC-VER-TBD |
| **SN-05** Multi-year battery life | REQ-O-01, REQ-P-03 | Power Mgmt + Duty-Cycle Scheduler | — | TC-VER-TBD |
| **SN-06** Safe behaviour around rotating machinery | REQ-SAF-01, REQ-SAF-02, REQ-F-04 | Safety Supervisor (HAZ-01) | — | TC-VER-TBD |
| **SN-07** Trusted device identity & supply chain | REQ-SEC-01, REQ-SEC-02, REQ-SEC-03 | Secure Element + SBOM pipeline | ICD (node↔gateway mTLS) | TC-VER-TBD |
| **SN-09** Auditable model decisions & lineage | REQ-F-07, REQ-O-04, REQ-P-04 | Model Registry + Explainability | ICD (gateway↔cloud) | TC-VER-TBD |

**Top TPMs tracked to every gate (Conventions §2.2):** TPM-01 detection accuracy/F-beta · TPM-02 false-positive rate · TPM-03 on-device inference latency · TPM-04 battery life · TPM-05 model size/RAM footprint. Full definitions in `Phase_02_Requirements/SysRS.md` §10.

## Conventions

- All IDs, gates, T/I/A/D methods, S1–S4 severity, baselines, frontmatter, and citations come from `../../05_Conventions.md` — this example cites it, never forks it.
- Diagrams are PlantUML (`.puml`), 7-of-9 SysML working set (Conventions §7).
- Internal links within this folder are relative; external standards are cited by name, not linked.
