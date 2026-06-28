---
Document: System Requirements Specification — SentinelEdge
Document ID: SyRS-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (SyRS)
Status: Draft
Owner: Lead Systems Engineer
---

# System Requirements Specification — SentinelEdge

**This is the source of truth for all later phases.** Every REQ ID here is stable for the life of the project and never renumbered (Conventions §2). Downstream phases (03 modeling, 04 architecture/ICD, 05 decisions, 06 integration, 07–08 V&V) reference these IDs. T/I/A/D methods are **seeds** — Phase 07 is authoritative (Conventions §4). `TC-VER-TBD` placeholders are resolved in Phase 07.

---

## 1. Introduction

### 1.1 Purpose
Specify the system-level requirements for **SentinelEdge** — an industrial predictive-maintenance IoT system: a vibration/acoustic/temperature sensor node carrying an **embedded on-device AI model**, a local gateway, and a cloud fleet-management + analytics backend with signed OTA firmware and model updates and governed rollback.

### 1.2 Scope
Covers the sensor node (sensing, edge-AI inference, power), the gateway, the cloud backend (device/model registry, analytics, OTA, dashboards, CMMS integration), the external interfaces, and the device lifecycle (commissioning → operation → OTA → decommissioning). The monitored machine's own control/safety system is **out of scope**; SentinelEdge is **advisory-only**.

### 1.3 Definitions
- **Edge AI / on-device model** — the anomaly-detection + failure-prediction model executing on the node itself.
- **TTF** — predicted time-to-failure.
- **FPR / FNR** — false-positive / false-negative rate.
- **Drift** — degradation of model accuracy in the field as machine/data distribution changes.
- **OTA** — over-the-air update (firmware **and** model).
- **SBOM** — software bill of materials (SPDX / CycloneDX).
- **Lineage** — the traceable record of which training data + model version produced a prediction.

### 1.4 References (canonical forms — Conventions §9)
ISO/IEC/IEEE 29148:2018 · ISO/IEC/IEEE 15288:2023 · IEC 61508 (functional safety) · ISO/IEC 27001:2022 · NIST SP 800-53 Rev. 5 · NIST SP 800-160 · NIST SP 800-88 Rev. 1 · RoHS / WEEE · IEEE 1012-2016 · ISO/IEC/IEEE 29119-3:2021.

---

## 2. System Overview

Three tiers:
1. **Node (edge)** — tri-axial vibration + acoustic + temperature sensing, an MCU/NPU running the embedded AI model, power management, secure element, and a short-range/wired link.
2. **Gateway** — aggregates nodes, buffers, and bridges to the cloud over the plant WAN.
3. **Cloud** — device & model registry, fleet analytics, alert routing, CMMS integration, and the signed OTA pipeline with rollback.

The node operates **edge-first**: detection and alerting occur on-device and do **not** require a live uplink (SCN-02). Connectivity is used for fleet management, OTA, and analytics — not as a dependency for the core detect-and-warn function.

---

## 3. Functional Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-F-01** | The node shall sample vibration, acoustic, and temperature channels on a configurable duty cycle and, on each evaluation window, execute the embedded AI model to produce an anomaly score and a predicted time-to-failure. | STK-01 / SN-01 | SN-01, SN-03 | High | T | — |
| **REQ-F-02** | The node shall raise a maintenance alert **on-device** (without a live gateway/cloud uplink) when the anomaly score and predicted TTF cross their configured thresholds. | STK-01 / SN-03 | SN-03 | High | T | MOP-05 |
| **REQ-F-03** | When no uplink is available, the node shall buffer all generated alerts and supporting evidence locally and transmit them in chronological order within `TODO: t_sync` seconds of connectivity restoration. | STK-01 / SN-03 | SN-03 | High | T | MOP-06 |
| **REQ-F-04** | The node shall operate as an **advisory** device only and shall expose no interface capable of commanding, tripping, or controlling the monitored machine. | STK-06 / SN-06 | SN-06 | High | I | — |
| **REQ-F-05** | The cloud shall route each alert to the operator dashboard and to the configured CMMS, creating or proposing a work order, within `TODO: t_route` seconds of receipt. | STK-01 / SN-11 | SN-11 | Medium | T | — |
| **REQ-F-06** | The system shall deliver a signed OTA update of node firmware **and/or** the embedded model to a targeted device cohort, with staged rollout and automatic rollback to the last known-good version on failure of the cohort health check. | STK-05 / SN-04, SN-10 | SN-04, SN-10 | High | T | MOP-07 |
| **REQ-F-07** | The system shall retain, for each raised alert, an explanation of the contributing signal features together with the model version and training-data lineage identifier that produced it. | STK-09 / SN-09 | SN-09 | Medium | I | — |

---

## 4. Usability Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-U-01** | A technician shall be able to physically mount, power, pair, and commission a node to the point of identity attestation in ≤ `TODO: t_commission` minutes, using a guided mobile/handheld flow, without specialist tools. | STK-02 / SN-08 | SN-08 | Medium | D | MOP-08 |
| **REQ-U-02** | The operator dashboard shall present each alert with its asset, severity, predicted TTF, confidence, and the retained explanation, comprehensible to a reliability engineer without data-science training (validated by usability review). | STK-01 / SN-09, SN-11 | SN-09, SN-11 | Medium | I | — |

---

## 5. Performance Requirements

| ID | Statement | Source | SN | Priority | Method | MOP / TPM |
|---|---|---|---|---|---|---|
| **REQ-P-01** | The embedded model shall achieve a true-positive (recall) rate ≥ `TODO: recall_target` and a false-positive rate ≤ `TODO: fpr_target` on the qualified target fault classes, measured against the labelled validation dataset. | STK-01 / SN-01, SN-02 | SN-01, SN-02 | High | T / A | MOP-01, MOP-02 → TPM-01, TPM-02 |
| **REQ-P-02** | The node shall complete one embedded-model inference over an evaluation window within `TODO: lat_target` ms on the target MCU/NPU at nominal clock. | STK-05 / SN-03 | SN-03 | High | T | MOP-03 → TPM-03 |
| **REQ-P-03** | The deployed embedded model shall occupy ≤ `TODO: mem_target` of on-device program/flash and ≤ `TODO: ram_target` of RAM at inference on the target node. | STK-05 / SN-03 | SN-03 | High | A / T | MOP-04 → TPM-05 |
| **REQ-P-04** | The model-management subsystem shall detect accuracy drift exceeding `TODO: drift_target` relative to the deployment baseline and raise a drift alarm to the fleet team. | STK-05 / SN-09 | SN-09 | High | T / A | MOP-09 |

---

## 6. System Interfaces

High-level here; full ICD in `Phase_04_Architecture/ICD.md` (Conventions §10).

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-INT-01** | The node↔gateway interface shall use a mutually-authenticated, encrypted short-range or wired link, with a published message schema for alerts, evidence, telemetry, and OTA payloads. | STK-04 / SN-07 | SN-07 | High | I / T | — |
| **REQ-INT-02** | The gateway↔cloud interface shall use an authenticated, encrypted (TLS 1.3) channel and shall expose alert, telemetry, registry-sync, and OTA endpoints; the cloud shall expose a documented CMMS integration interface. | STK-04 / SN-07, SN-11 | SN-07, SN-11 | High | I / T | — |

---

## 7. System Operations

### 7.1 Operational / Reliability Requirements

| ID | Statement | Source | SN | Priority | Method | MOP / TPM |
|---|---|---|---|---|---|---|
| **REQ-O-01** | A battery-powered node shall operate ≥ `TODO: life_target` years of service-free life under the nominal plant duty cycle and temperature profile. | STK-01 / SN-05 | SN-05 | High | A / T | MOP-10 → TPM-04 |
| **REQ-O-02** | The node shall continue safe sensing, on-device detection, and local alert buffering for ≥ `TODO: offline_target` hours with no gateway/cloud connectivity. | STK-01 / SN-03 | SN-03 | High | T | — |
| **REQ-O-03** | An OTA firmware/model update shall support staged rollout per cohort and shall automatically roll a cohort back to the last known-good image within `TODO: rollback_target` of a failed health check, with no device left non-functional. | STK-05 / SN-10 | SN-10 | High | T | MOP-07 |
| **REQ-O-04** | Alert records, model-version, and training-data lineage references shall be retained for ≥ `TODO: retention_target` years for audit. | STK-09 / SN-09 | SN-09 | Medium | I | — |

### 7.2 Security Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-SEC-01** | Each node shall hold a unique cryptographic device identity provisioned at manufacture, with private keys held in a secure element and attested before fleet enrolment. | STK-04 / SN-07 | SN-07 | High | I / T | — |
| **REQ-SEC-02** | The node shall execute only firmware and model images whose signatures verify against a trusted key; the bootloader/loader shall reject unsigned or tampered images (verified/secure boot). | STK-04 / SN-07, SN-10 | SN-07, SN-10 | High | T | — |
| **REQ-SEC-03** | Every released firmware and model image shall ship with a software bill of materials (SBOM, SPDX or CycloneDX) and shall be traceable to its build provenance. | STK-04 / SN-07 | SN-07 | High | I | — |
| **REQ-SEC-04** | On decommissioning, the system shall revoke the device identity and irrecoverably sanitize keys, buffered data, and the on-device model per NIST SP 800-88 Rev. 1. | STK-04 / SN-12 | SN-12 | High | T / I | — |

---

## 8. Constraints & Domain Requirements

| ID | Statement | Source | SN | Priority | Method |
|---|---|---|---|---|---|
| **REQ-C-01** | The node hardware BOM cost shall not exceed `TODO: bom_ceiling` per unit at the target production volume. | STK-08 / Feasibility (economic) | SN-01 | Medium | A |
| **REQ-C-02** | The node↔gateway wireless link shall operate within license-exempt radio bands permitted at the target deployment regions and shall not require a site radio licence. | STK-04 / Feasibility (regulatory) | SN-07 | High | A / I |
| **REQ-D-01** | The system, as an advisory-only function, shall be developed and assessed for functional safety to the IEC 61508 SIL level determined by hazard analysis (`TODO: SIL_target` from HAZ-01). | STK-06, STK-09 / SN-06 | SN-06 | High | I / A |
| **REQ-D-02** | The node and its battery shall conform to RoHS and WEEE obligations and to applicable battery transport/disposal regulations, with conformity evidence retained. | STK-07, STK-09 / SN-12 | SN-12 | High | I |
| **REQ-D-03** | The wireless node and gateway shall meet applicable EMC and radio-emissions conformity (e.g. CE/FCC) for the target markets. | STK-09 / SN-07 | SN-07 | High | T / I |

### Safety Requirements (Safety/RAMS thread — linked to HAZ-01)

| ID | Statement | Source | SN | Priority | Method |
|---|---|---|---|---|---|
| **REQ-SAF-01** | The system shall not contain any actuation path to the monitored machine; loss, fault, or compromise of SentinelEdge shall leave the machine's own control and safety systems unaffected (advisory-only, fail-passive). | STK-06 / SN-06 (HAZ-01) | SN-06 | High | I / A |
| **REQ-SAF-02** | The node mounting and service procedure shall enable installation and battery service without contact with rotating parts and shall be compatible with the host machine's lockout/tagout procedure. | STK-02, STK-06 / SN-08 (HAZ-01) | SN-06, SN-08 | High | I / D |

---

## 9. Modes & States

Seeds the Phase-03 State Machine. Reuses OpsCon modes (Concept §7).

| Mode / State | Description | Entered from |
|---|---|---|
| **Off** | Unpowered / shipped. | — |
| **Boot** | Verified/secure boot; signature & identity attestation (REQ-SEC-01/02). | Off |
| **Commissioning** | Pairing, asset-profile assignment, baseline-learning window (SCN-04). | Boot |
| **Monitoring (Nominal)** | Duty-cycle sampling + on-device inference + alerting; uplink available (SCN-01). | Commissioning, Updating |
| **Monitoring (Offline)** | Detect + buffer locally; no uplink (SCN-02). | Monitoring |
| **Low-Power Conserve** | Reduced duty cycle to protect battery life (REQ-O-01). | Monitoring |
| **Updating** | Receiving/validating/applying signed OTA; canary health check (SCN-03). | Monitoring |
| **Rollback** | Reverting to last known-good firmware/model after failed health check (REQ-O-03). | Updating |
| **Fault** | Self-detected sensor/compute fault; degrade safely, flag, **never actuate** (REQ-SAF-01). | any |
| **Decommissioning** | Identity revoked, secure sanitization, battery removal (SCN-05, REQ-SEC-04). | Monitoring, Fault |

Transition table is elaborated in `Phase_03_Modeling/State_Machine.puml`.

---

## 10. Measures of Effectiveness & Performance

MOEs derive from needs (solution-independent, Concept §8); MOPs derive from REQs (solution-dependent); selected MOPs are promoted to TPMs and tracked to every gate (Conventions §2.2). Targets are `TODO: pilot-measured` — no invented numbers.

### MOE (from SN — carried from Concept §8)
MOE-01…MOE-07 as defined in `../Phase_01_Concept/Concept.md` §8.

### MOP (from REQ)

| ID | Derived from | System-level metric | Target | Threshold | Unit |
|---|---|---|---|---|---|
| **MOP-01** | REQ-P-01 | Recall on target fault classes | `TODO` | `TODO` | fraction |
| **MOP-02** | REQ-P-01 | False-positive rate | `TODO` | `TODO` | alerts/device-month |
| **MOP-03** | REQ-P-02 | On-device inference latency | `TODO` | `TODO` | ms |
| **MOP-04** | REQ-P-03 | Model footprint (flash + RAM) | `TODO` | `TODO` | KB |
| **MOP-05** | REQ-F-02 | % detections raised with no live uplink | `TODO` | `TODO` | % |
| **MOP-06** | REQ-F-03 | Buffered-alert sync latency on reconnect | `TODO` | `TODO` | s |
| **MOP-07** | REQ-F-06 / REQ-O-03 | Fleet update reach within window incl. rollback | `TODO` | `TODO` | % |
| **MOP-08** | REQ-U-01 | Install-to-commission time | `TODO` | `TODO` | min |
| **MOP-09** | REQ-P-04 | Drift detection sensitivity / latency | `TODO` | `TODO` | Δacc / days |
| **MOP-10** | REQ-O-01 | Service-free battery life | `TODO` | `TODO` | years |

### TPM (promoted MOPs — carry technical/schedule risk; tracked Phases 06–10)

| ID | Promoted from | Why a TPM (risk) | Current | Target | Threshold | Margin |
|---|---|---|---|---|---|---|
| **TPM-01** | MOP-01 | Accuracy vs. footprint quadrilemma (RSK-01). | `TODO` | `TODO` | `TODO` | `TODO` |
| **TPM-02** | MOP-02 | Alert fatigue / adoption (RSK-02). | `TODO` | `TODO` | `TODO` | `TODO` |
| **TPM-03** | MOP-03 | On-device latency budget (RSK-01). | `TODO` | `TODO` | `TODO` | `TODO` |
| **TPM-04** | MOP-10 | Battery-life shortfall (RSK-05). | `TODO` | `TODO` | `TODO` | `TODO` |
| **TPM-05** | MOP-04 | Memory budget vs. accuracy (RSK-01). | `TODO` | `TODO` | `TODO` | `TODO` |

---

## 11. Verification (seed — Phase 07 authoritative)

| Req ID | Method (seed) | Verifying activity (placeholder) |
|---|---|---|
| REQ-F-01, REQ-F-02 | T | TC-VER-TBD — bench: inject recorded fault signatures, confirm on-device alert with no uplink. |
| REQ-F-03 | T | TC-VER-TBD — sever uplink, confirm buffering + ordered sync on reconnect. |
| REQ-F-04, REQ-SAF-01 | I / A | TC-VER-TBD — design inspection + FMEA: no actuation path exists. |
| REQ-F-06, REQ-O-03 | T | TC-VER-TBD — OTA canary rollout + forced-failure rollback on a HIL fleet. |
| REQ-P-01 | T / A | TC-VER-TBD — score model on held-out labelled dataset; confusion matrix. |
| REQ-P-02, REQ-P-03 | T / A | TC-VER-TBD — on-target latency profiling + footprint measurement. |
| REQ-O-01 | A / T | TC-VER-TBD — power-budget analysis + accelerated duty-cycle bench. |
| REQ-SEC-01..04 | T / I | TC-VER-TBD — identity attestation, signed-boot negative test, SBOM review, sanitization verification. |
| REQ-D-01, REQ-SAF-01/02 | I / A | TC-VER-TBD — IEC 61508 safety-case inspection; HIL rig + LOTO procedure review. |

Full matrix in `Phase_07_Verification/Verification_Matrix.md`.

---

## 12. Traceability (SN → REQ → TC-VER-TBD)

Forward and backward; **bidirectional** (safety/RAMS + edge-AI = formal — Conventions §8). Full matrix in `Traceability_Matrix.md` (this phase).

| SN | REQ ID(s) | Class | Priority | MOP/TPM | Method (seed) | Verifying activity |
|---|---|---|---|---|---|---|
| SN-01 | REQ-F-01, REQ-P-01 | F, P | High | MOP-01/02→TPM-01/02 | T/A | TC-VER-TBD |
| SN-02 | REQ-P-01 | P | High | MOP-02→TPM-02 | T/A | TC-VER-TBD |
| SN-03 | REQ-F-01, REQ-F-02, REQ-F-03, REQ-P-02, REQ-P-03, REQ-O-02 | F, P, O | High | MOP-03/04/05/06→TPM-03/05 | T/A | TC-VER-TBD |
| SN-04 | REQ-F-06 | F | High | MOP-07 | T | TC-VER-TBD |
| SN-05 | REQ-O-01 | O | High | MOP-10→TPM-04 | A/T | TC-VER-TBD |
| SN-06 | REQ-F-04, REQ-D-01, REQ-SAF-01, REQ-SAF-02 | F, D, SAF | High | — | I/A/D | TC-VER-TBD |
| SN-07 | REQ-INT-01, REQ-INT-02, REQ-SEC-01, REQ-SEC-02, REQ-SEC-03, REQ-C-02, REQ-D-03 | INT, SEC, C, D | High | — | T/I/A | TC-VER-TBD |
| SN-08 | REQ-U-01, REQ-SAF-02 | U, SAF | Medium | MOP-08 | D/I | TC-VER-TBD |
| SN-09 | REQ-F-07, REQ-U-02, REQ-P-04, REQ-O-04 | F, U, P, O | Medium/High | MOP-09 | I/T/A | TC-VER-TBD |
| SN-10 | REQ-F-06, REQ-O-03, REQ-SEC-02 | F, O, SEC | High | MOP-07 | T | TC-VER-TBD |
| SN-11 | REQ-F-05, REQ-INT-02, REQ-U-02 | F, INT, U | Medium | — | T/I | TC-VER-TBD |
| SN-12 | REQ-SEC-04, REQ-D-02 | SEC, D | Medium/High | — | T/I | TC-VER-TBD |

**Coverage check:** all 12 `SN-*` covered by ≥ 1 REQ; all 30 REQs trace to ≥ 1 SN — no orphans. SMART pass and conflict resolution recorded in §15.

---

## 13. Design preview — top-level blocks & strategic decisions

Forward markers so Phases 03–05 align. Blocks are *intended* (allocated in Phase 04); decisions are named here and made in Phase 05.

### Intended top-level system blocks
- **Sensor Front-End** — vibration (MEMS), acoustic (MEMS/ultrasonic), temperature; conditioning + ADC.
- **Edge-AI Inference Engine** — embedded model runtime on the node MCU/NPU (satisfies REQ-F-01/02, REQ-P-01/02/03).
- **Power Management + Duty-Cycle Scheduler** — wake-on-event, low-power modes (satisfies REQ-O-01).
- **Secure Element + Identity/Boot** — keys, attestation, verified boot (satisfies REQ-SEC-01/02).
- **Node Comms / Link Adapter** — node↔gateway interface (satisfies REQ-INT-01).
- **Gateway** — aggregation, buffering, WAN bridge (satisfies REQ-INT-02).
- **Cloud Fleet Backend** — device & **Model Registry**, analytics, alert routing, CMMS integration (satisfies REQ-F-05/07).
- **OTA Update Manager** — signed firmware+model rollout, canary health check, rollback (satisfies REQ-F-06, REQ-O-03).
- **Model Lifecycle / Drift + Lineage** — training-data lineage, drift detection, explainability (satisfies REQ-F-07, REQ-P-04, REQ-O-04).
- **Safety Supervisor** — enforces advisory-only/fail-passive behaviour (satisfies REQ-SAF-01, linked HAZ-01).

### Strategic decisions (named here; made in Phase 05)
- **DEC-01 / DM-01** — Node compute platform & ML runtime (MCU-only vs. MCU+NPU; TFLite-Micro vs. alternative) — drives RSK-01.
- **DEC-02 / DM-02** — Embedded model family (classical signal-feature classifier vs. tiny neural net) trading accuracy ↔ footprint ↔ explainability.
- **DEC-03 / DM-03** — Node power strategy & node↔gateway link technology (battery chemistry, radio vs. wired) — drives RSK-05.
- **DEC-04 / DM-04** — OTA + model-governance architecture (signing, canary, rollback, lineage store) — drives RSK-03/RSK-06.
- **DEC-05 / DM-05** — Safety partitioning approach to guarantee advisory-only/fail-passive per IEC 61508 — drives RSK-04.

---

## 14. Assumptions & Dependencies

- Labelled, representative fault datasets for the target machine classes are obtainable for training/validation (`TODO: dataset owed` — gates REQ-P-01).
- Secure-element-capable MCU/NPU is available within BOM ceiling (REQ-C-01) and memory budget (REQ-P-03).
- A signing PKI and SBOM tooling (SPDX/CycloneDX) are operated by the vendor for OTA (REQ-SEC-02/03).
- The host machine exposes safe mounting points clear of rotating parts and supports LOTO (REQ-SAF-02).
- Hazard analysis (HAZ-01) yields the IEC 61508 SIL target for REQ-D-01 (`TODO: SIL_target`).
- Plant WAN/connectivity at the gateway is intermittent-by-design, not guaranteed (drives REQ-O-02).

---

## 15. Requirements Engineering Record

- **Elicitation methods:** stakeholder workshop (STK-01/03/06), interviews (STK-04/05/08), and document review (IEC 61508, RoHS/WEEE, NIST 800-53) to surface implicit/domain requirements (security, drift, disposal). `TODO: dates`.
- **Implicit requirements surfaced:** offline detection (REQ-F-02/REQ-O-02), drift (REQ-P-04), lineage/explainability (REQ-F-07), secure decommissioning (REQ-SEC-04), advisory-only safety (REQ-F-04/REQ-SAF-01).
- **Conflicts flagged & resolved (priority tie-break):**
  - *Accuracy ↔ footprint/battery* (REQ-P-01 vs REQ-P-03/REQ-O-01): resolved as a tracked trade (TPM-01/03/04/05) and decision DEC-02 — not auto-resolved; carries RSK-01/05.
  - *Security/signed-OTA ↔ install simplicity* (REQ-SEC-01/02 vs REQ-U-01): security is High and wins; UX mitigated by guided commissioning flow.
  - *Explainability/lineage retention ↔ node memory/cost* (REQ-F-07/REQ-O-04 vs REQ-C-01): heavy lineage stored cloud-side; node keeps only a reference.
- **Peer review / walkthrough:** `TODO: schedule pre-SRR walkthrough` with firmware, ML, safety, security, and test leads; record reviewers + date here (Inspection evidence for SRR).
- **SMART pass:** every REQ is a single behaviour with a measurable/observable criterion (numbers held as named `TODO` thresholds, never invented) and a verification seed — no double-barrelled REQs.

---

## 16. SRR exit gate

Gate **SRR** (Conventions §3). On sign-off, status → `Baseline (SRR-approved <date>)` and the **Functional/Requirements baseline** is established (StRS, SyRS, MOE/MOP set).

- [x] 30 REQs across F/U/P/O/SEC/INT/C/D/SAF, each a stable `REQ-<class>-<nn>` ID.
- [x] Every REQ traces to ≥ 1 `SN-*`; every `SN-*` covered — no orphans (§12).
- [x] Every REQ has priority + seeded T/I/A/D + `TC-VER-TBD`.
- [x] MOE (from SN) / MOP (from REQ) / TPM (promoted) set defined (§10).
- [x] Conflicts flagged & resolved with rationale (§15).
- [x] `C`/`D`/`SAF` captured; each `D` cites a verified standard (§8).
- [x] Bidirectional traceability present (§12).
- [ ] Peer review completed + SRR board sign-off — `TODO` (§15).

**Handoff:** `Traceability_Matrix.md` (this phase) → `se-phase-03-modeling` to draw the SysML diagrams that *satisfy*/*verify* each REQ.
