---
Document: Concept Package (Stakeholder & Mission · StRS · OpsCon · Feasibility) — SentinelEdge
Document ID: CONCEPT-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (StRS, OpsCon) · ISO/IEC/IEEE 15288:2023 (Mission Analysis)
Status: Draft
Owner: Lead Systems Engineer
---

# Phase 01 — Concept: SentinelEdge

Problem space only. This package decides **what** SentinelEdge is, **for whom**, **why**, and **whether it is feasible** — and ends at **MCR** (Conventions §3). It produces solution-free needs (`SN-*`), operational scenarios (`SCN-*`), measures of effectiveness (`MOE-*`), feasibility verdicts, and the seed risk register (`RSK-*`). The `SN → derive → REQ` step is Phase 02's job (`../Phase_02_Requirements/SysRS.md`).

---

## 1. Mission

> Cut unplanned downtime on rotating industrial machinery by detecting incipient faults **on the device, at the edge** — early and reliably enough to schedule maintenance before failure — across a managed fleet, on battery, under harsh plant conditions, securely and auditably over the asset's whole life.

Realises ISO/IEC/IEEE 15288:2023 **Business/Mission Analysis** and the ISO/IEC/IEEE 29148:2018 **BRS** intent: the business outcome is fewer catastrophic failures and lower maintenance cost on pumps, motors, fans, compressors, and gearboxes, without dependence on continuous cloud connectivity.

---

## 2. Stakeholders

Six-column shape per the Phase-01 convention (`STK-ID | Stakeholder | Role | Primary Concerns | Influence | Interest`).

| STK-ID | Stakeholder | Role | Primary Concerns | Influence | Interest |
|---|---|---|---|---|---|
| **STK-01** | Plant Reliability / Maintenance Manager | Primary buyer & operator; consumes alerts, schedules work. | Fewer false alarms, true early warning, ROI, fits existing CMMS workflow. | High | High |
| **STK-02** | Maintenance Technician | Installs nodes, acts on predictions, replaces batteries. | Easy mount, clear/actionable alerts, safe install on live machinery, battery swaps. | Low | High |
| **STK-03** | Machine / Process Operator | Runs the monitored line; affected by stops. | No nuisance trips, no production interruption, trustworthy warnings. | Medium | Medium |
| **STK-04** | OT / Plant IT & Security | Owns the plant network, device identity, segmentation. | Device identity, signed updates, network segmentation, no new attack surface. | High | High |
| **STK-05** | Fleet / Data Science Team (vendor) | Owns the embedded AI model lifecycle, drift, retraining. | Model accuracy & drift, training-data lineage, safe OTA model rollout/rollback. | High | High |
| **STK-06** | EHS / Safety Officer | Functional safety & worker safety around rotating machinery. | No unsafe actuation, hazard mitigation, IEC 61508 evidence, lockout/tagout. | High | Medium |
| **STK-07** | Sustainability / Compliance Officer | Battery, e-waste, and disposal compliance. | RoHS/WEEE, battery transport/disposal, secure decommissioning, audit trail. | Medium | Low |
| **STK-08** | Product / Commercial Owner (CPO) | Business owner of SentinelEdge. | Margin, time-to-market, fleet scale, subscription analytics revenue. | High | High |
| **STK-09** | Regulators / Certification Bodies | UL/CE/FCC, IEC 61508 assessor, radio & battery authorities. | Functional-safety case, EMC/radio compliance, battery & RoHS conformity. | High | Low |

### Influence / Interest matrix (built from captured levels)

```
            High Interest
                |
   STK-01 R&M   |   STK-02 Technician
   STK-04 OT    |   STK-03 Operator (M/M)
   STK-05 DS    |
   STK-08 CPO   |
   STK-06 EHS*  |
----------------+----------------
   STK-09 Reg   |   STK-07 Sustainability
                |
            Low Interest
   High Influence ←————————→ Low Influence
```
\* STK-06 EHS interest is Medium — plotted upper-left for influence; engaged as a key player on the safety thread.

---

## 3. Scope

### In scope
- Battery-powered **and** wired-powered sensor node: tri-axial vibration (MEMS accelerometer), acoustic (MEMS mic / ultrasonic), and temperature.
- **Embedded on-device AI** anomaly-detection + failure-prediction model running on the node MCU/NPU (no cloud round-trip required to raise an alert).
- Local **gateway** aggregating nodes and bridging to cloud.
- **Cloud fleet-management + analytics backend**: device/model registry, dashboards, alert routing, CMMS integration, fleet-wide retraining.
- **OTA firmware AND model updates**, signed, staged, with governed rollback and training-data lineage.
- Device identity, supply-chain security (SBOM), and secure field **decommissioning** (battery/e-waste/RoHS-WEEE).

### Out of scope
- Automatic actuation that stops/controls the monitored machine (SentinelEdge **advises**; it does not trip the machine — closing the loop is a separate safety-rated control project).
- The machine's own control system, PLC, or safety instrumented system (interfaces to them only as read-only/advisory).
- General building/HVAC monitoring; non-rotating asset classes (initial release).
- Cellular WAN at the node (node↔gateway is short-range; gateway owns the WAN uplink).
- On-prem private cloud hosting variant (initial release is vendor-managed cloud; flagged as `TODO: deployment variant`).

---

## 4. Lifecycle model & rationale

| Track | Model | Rationale |
|---|---|---|
| Node firmware, power, sensing | **V-Model** | Stable, hardware-coupled, safety-relevant; costly late change; every design level needs a paired HIL/bench test. |
| Safety / RAMS functions | **V-Model (Formal)** | Rotating-machinery hazard mitigation + reliability allocation under IEC 61508; bidirectional traceability and independent V&V required. |
| Cloud backend, dashboards, CMMS integration | **Agile** | Rapidly evolving, user-visible, frequent feedback; 2-week sprints. |
| Edge-AI model lifecycle (train→eval→package→OTA) | **Agile (Formal V&V)** | Data-driven and iterative, but accuracy/drift/rollback demand formal, gated edge-AI V&V evidence. |

**Chosen:** **Hybrid V-Model + Agile**, with **Formal** rigour on the safety/RAMS and edge-AI V&V threads. *SAFe* is noted only as the scaling option inside Hybrid if the org grows — not a peer base model (Conventions / Overview §7). Tracks integrate at frozen seams (node↔gateway, gateway↔cloud, OTA channel) governed by ICDs in Phase 04.

---

## 5. Feasibility study (the gate of this phase)

| Dimension | Verdict | Evidence / basis |
|---|---|---|
| **Technical** | **Conditional-Go** | Tri-axial MEMS + acoustic sensing and TinyML anomaly detection on Cortex-M/NPU class MCUs are demonstrated in industry. Risk: hitting target accuracy/false-positive rate **and** multi-year battery life **and** on-device memory budget simultaneously (see RSK-01, RSK-02, RSK-05). Quantified targets are `TODO: pilot-measured` — no fabricated numbers. |
| **Market / operational** | **Go** | Predictive maintenance addresses well-evidenced unplanned-downtime cost on rotating assets; edge-first (no continuous connectivity, data stays on plant) is a differentiator for OT-conservative buyers. Adoption hinges on low false-alarm rate (RSK-02). |
| **Regulatory / legal** | **Conditional-Go** | Applicable: IEC 61508 (functional safety of advisory function), UL/CE/FCC (product, EMC, radio), RoHS/WEEE + battery transport/disposal, security (ISO 27001 / NIST 800-53). Conditional on a credible safety case that SentinelEdge is **advisory-only** (no unsafe actuation) — seeds candidate `D`/`SAF` requirements for Phase 02. |
| **Economic** | **Conditional-Go** | ROM only (full estimate is Phase 05): hardware BOM + cloud OPEX vs. avoided-downtime value per asset. Per-asset payback is `TODO: ROM owed`; subscription analytics is the recurring-revenue lever. |

### Overall recommendation — **Conditional-Go**

Proceed to Phase 02 **on condition** that the accuracy / false-positive / battery / memory quadrilemma (RSK-01, RSK-02, RSK-05) is retired by a measured pilot, and the advisory-only safety case (RSK-04) is accepted by EHS/regulators. No non-waivable No-Go exists → **MCR may proceed with actions**.

---

## 6. Stakeholder needs — StRS (PROBLEM space, solution-free)

ISO/IEC/IEEE 29148:2018 StRS. Each `SN-*` is an outcome, not a design. Candidate MOE noted; numbered in Phase 02 §10. Any technology a stakeholder named is recorded as a candidate constraint, not baked into the need.

| ID | Need (outcome, solution-free) | Originating STK | Priority | Candidate MOE |
|---|---|---|---|---|
| **SN-01** | The system shall give maintenance teams enough lead time before a failure to schedule corrective work without unplanned stoppage. | STK-01, STK-08 | High | Mean prediction lead time before failure |
| **SN-02** | The system shall keep false alarms low enough that operators continue to trust and act on its warnings. | STK-01, STK-03 | High | False-positive (nuisance-alert) rate |
| **SN-03** | The system shall detect incipient faults **on the device itself**, without depending on continuous connectivity to a gateway or cloud. | STK-01, STK-04 | High | % of detections raised with no live uplink |
| **SN-04** | The system shall let the fleet improve and correct the on-device detection capability of fielded devices without sending a technician to each one. | STK-05, STK-08 | High | % fleet updated within an update window |
| **SN-05** | The battery-powered device shall operate for years between service visits in normal plant duty. | STK-01, STK-02 | High | Service-free operating life |
| **SN-06** | The system shall never induce an unsafe condition on the monitored rotating machinery and shall stay clear of the machine's own safety functions. | STK-06, STK-09 | High | Count of system-induced unsafe events (target zero) |
| **SN-07** | The system shall ensure only trusted, authentic devices and software run in the fleet, with a known and auditable software supply chain. | STK-04, STK-09 | High | % devices with verified identity & SBOM |
| **SN-08** | A technician shall be able to install, commission, and service a node quickly and safely on or near operating machinery. | STK-02 | Medium | Mean install-to-commission time |
| **SN-09** | The system shall make each prediction explainable and traceable to the data and model version behind it, for audit and trust. | STK-01, STK-05, STK-09 | Medium | % alerts with retained explanation + lineage |
| **SN-10** | A degraded or wrong model update shall be recoverable across the fleet without bricking or unsafe behaviour. | STK-05, STK-04 | High | Time to roll the fleet back to a known-good model |
| **SN-11** | The system shall integrate predictions into the team's existing maintenance workflow so action is taken, not just data shown. | STK-01 | Medium | % alerts converted to a work order |
| **SN-12** | At end of life, devices and batteries shall be retired safely and their data and identity rendered unrecoverable, in environmental compliance. | STK-07, STK-04 | Medium | % retired units with verified sanitization & disposal |

### Candidate constraints / assumptions (feed Phase 02 `C`/`D`)
- Functional-safety expectation under **IEC 61508**; SentinelEdge is **advisory-only** (no machine actuation) → candidate `SAF`/`D`.
- **RoHS/WEEE** + battery transport/disposal regulations → candidate `D`.
- **EMC/radio** (CE/FCC) for the wireless node↔gateway link → candidate `D`.
- Security baseline **ISO 27001 / NIST 800-53**, signed updates, SBOM (SPDX/CycloneDX) → candidate `SEC`/`C`.
- Node↔gateway is **short-range wireless or wired**; gateway owns WAN uplink (assumption).
- Plant environment: dust, vibration, oil mist, −20 °C…+70 °C ambient `TODO: confirm per site` → candidate `D`/`C`.

---

## 7. Operational scenarios — OpsCon (`SCN-*` as flows)

ISO/IEC/IEEE 29148:2018 OpsCon. Each scenario lists actors, trigger, main flow, success outcome, and the `SN-*` it exercises.

### SCN-01 — Nominal: edge detection of an incipient bearing fault
- **Actors:** Sensor node (edge AI), gateway, cloud, STK-01 Reliability Manager.
- **Trigger:** Vibration/acoustic signature on a pump motor drifts toward a bearing-defect pattern.
- **Main flow:** Node samples on its duty cycle → embedded model scores the window on-device → anomaly + predicted time-to-failure crosses threshold → node raises an alert locally and forwards it via gateway → cloud routes to CMMS and dashboard with the explanation.
- **Success outcome:** A work order is scheduled with lead time before failure; no unplanned stop.
- **Exercises:** SN-01, SN-02, SN-03, SN-09, SN-11.

### SCN-02 — Degraded: connectivity loss to gateway/cloud
- **Actors:** Node, gateway, cloud.
- **Trigger:** Gateway or WAN uplink is down for an extended period.
- **Main flow:** Node continues sampling and scoring on-device → buffers alerts and evidence locally → keeps detecting and storing → on reconnection, syncs buffered alerts/evidence in time order.
- **Success outcome:** No detection is lost; alerts surface (delayed) once connectivity returns; no unsafe behaviour offline.
- **Exercises:** SN-03, SN-06, SN-09.

### SCN-03 — Maintenance/update: OTA model rollout with rollback
- **Actors:** STK-05 Data Science team, cloud OTA service, gateway, node fleet.
- **Trigger:** A retrained model (improved accuracy / drift correction) is approved for release.
- **Main flow:** Cloud signs the model package → stages rollout to a canary cohort → monitors live accuracy/false-positive telemetry → if healthy, expands to the fleet; if a regression is detected, **automatically rolls the cohort back** to the last known-good model.
- **Success outcome:** Fleet detection capability improves with no truck rolls; a bad update never persists or bricks a node.
- **Exercises:** SN-04, SN-07, SN-10.

### SCN-04 — Install & commission on operating machinery
- **Actors:** STK-02 Technician, node, gateway, cloud.
- **Trigger:** New asset enrolled for monitoring.
- **Main flow:** Technician mounts the node safely (clear of rotating parts, lockout/tagout respected) → powers/pairs it → node attests its identity → cloud enrolls it, assigns the asset profile and baseline model → node begins a learning/baseline window.
- **Success outcome:** Node commissioned quickly and safely; identity verified; baselining started.
- **Exercises:** SN-06, SN-07, SN-08.

### SCN-05 — End-of-life decommissioning of a fielded device
- **Actors:** STK-02 Technician, STK-07 Sustainability, STK-04 OT/Security, cloud.
- **Trigger:** Device reaches end of life or asset is retired.
- **Main flow:** Cloud revokes the device identity → technician triggers secure wipe (keys, buffered data, model) on the node → removes the battery for compliant disposal/recycling → node and battery routed to RoHS/WEEE e-waste stream → disposal recorded.
- **Success outcome:** Data and identity unrecoverable; battery and e-waste handled in compliance; audit record complete.
- **Exercises:** SN-07, SN-12.

### Modes & conditions (seed for Phase 02 §9)
- **Nominal:** node sampling/scoring on duty cycle, uplink available.
- **Degraded:** offline buffering (SCN-02), low-battery conservation, sensor partially faulted.
- **Maintenance:** install/commission (SCN-04), OTA update/rollback (SCN-03), decommission (SCN-05).
- **Operational environment:** in-plant on/near rotating machinery; dust/oil-mist/vibration; wide temperature band; intermittent connectivity is normal, not exceptional.

---

## 8. Measures of Effectiveness (`MOE-*`)

Mission-level, solution-independent (Conventions §2.2). Numbered here; Phase 02 derives MOPs/TPMs from the REQs. Targets are `TODO: pilot-measured` — no invented numbers.

| ID | MOE (from SN) | What it measures | Target |
|---|---|---|---|
| **MOE-01** | Mean prediction lead time before failure (SN-01) | How far ahead the system warns. | `TODO` (≥ planning window for corrective work) |
| **MOE-02** | False-positive / nuisance-alert rate (SN-02) | Trust: how often it cries wolf. | `TODO` (low enough to sustain trust) |
| **MOE-03** | Detection effectiveness — true-positive / recall (SN-01, SN-03) | How many real faults it catches early. | `TODO` (high recall on target fault classes) |
| **MOE-04** | Edge autonomy — % detections raised with no live uplink (SN-03) | Independence from connectivity. | `TODO` (near 100%) |
| **MOE-05** | Service-free operating life (SN-05) | Battery/maintenance interval. | `TODO` (multi-year target) |
| **MOE-06** | Fleet update reach within an update window (SN-04, SN-10) | OTA effectiveness incl. rollback. | `TODO` (high % within window) |
| **MOE-07** | System-induced unsafe events (SN-06) | Safety effectiveness. | **Zero** |

---

## 9. Top risks (`RSK-*`) — seeds the living register

Likelihood × Impact on 1–5 → band (Conventions §5.3). Reviewed at every gate by the Risk thread.

| ID | Description | L | I | Band | Mitigation |
|---|---|---|---|---|---|
| **RSK-01** | Embedded model cannot meet target accuracy within node compute/memory budget. | 4 | 5 | **Critical** | Early TinyML feasibility spike; quantization/pruning; pilot-measure accuracy vs. footprint before SRR; fallback to two-stage (edge screen + gateway confirm). |
| **RSK-02** | False-positive rate too high → alert fatigue → users stop trusting/acting. | 4 | 5 | **Critical** | Tune for precision on target fault classes; confidence-gated alerts; per-asset baselining; track MOE-02 as a TPM. |
| **RSK-03** | Model drift in the field degrades accuracy over time silently. | 4 | 4 | **High** | Drift telemetry + periodic re-baselining; scheduled retraining via OTA (SCN-03); drift alarms to STK-05. |
| **RSK-04** | A prediction is (mis)used to actuate the machine, creating a functional-safety hazard. | 3 | 5 | **High** | Architect advisory-only (scope §3); IEC 61508 safety case; SAF requirements; isolate from machine control. |
| **RSK-05** | Battery life falls short of multi-year target under real duty cycle and harsh temperature. | 4 | 4 | **High** | Aggressive duty-cycling; on-device wake-on-event sensing; power-budget analysis; pilot battery measurement. |
| **RSK-06** | Compromised/spoofed device or unsigned OTA injects malicious firmware/model. | 3 | 5 | **High** | Per-device secure identity; signed firmware+model with verified boot; SBOM; mutual-auth links; rollback (SN-10). |
| **RSK-07** | Improper battery/e-waste disposal or recoverable data on retired devices → compliance breach. | 3 | 3 | **Medium** | NIST SP 800-88 sanitization + identity revocation; RoHS/WEEE disposal route; audited decommission (SCN-05). |

Upside: **OPP-01** — fleet-wide training data becomes a defensible analytics/benchmarking product (recurring revenue for STK-08).

---

## 10. MCR gate — Mission Concept Review

Gate **MCR → SRR-entry** (Conventions §3). Exit checklist:

- [x] Mission reviewed (§1).
- [x] ≥ 5 stakeholders captured with influence/interest (§2 — 9 captured).
- [x] StRS complete; every `SN-*` solution-free, prioritised, traced to an originating STK (§6).
- [x] OpsCon complete; every high-priority `SN-*` exercised by ≥ 1 `SCN-*`; off-nominal + maintenance threads covered (§7).
- [x] Feasibility all four dimensions verdicted; **no non-waivable No-Go** (§5 — overall Conditional-Go).
- [x] Lifecycle model chosen and justified per track (§4).
- [x] ≥ 4 risks logged with L/I/band, handed to the Risk thread (§9 — 7 + 1 opportunity).
- [ ] MCR board sign-off — `TODO: schedule MCR` (proceed-with-actions: retire RSK-01/02/05 by pilot; accept advisory-only safety case for RSK-04).

**MCR recommendation:** **Proceed-with-actions** → enter Phase 02 (`../Phase_02_Requirements/SysRS.md`), which derives `SN → REQ`, numbers MOPs/TPMs from the REQs, and baselines the SyRS at SRR.
