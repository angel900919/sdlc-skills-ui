---
Document: SentinelEdge — Validation (Test Plan + TC-VAL Cases)
Document ID: TP-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 29119-3:2021
Status: Draft
Owner: Test Lead (with Safety/RAMS Lead STK-06 and Fleet/Data-Science Lead STK-05)
---

# Phase 08 — Validation: SentinelEdge

> This single Validation file consolidates the two Phase-08 artifacts (`Test_Plan.md` + `Test_Cases.md`) for this worked example, matching how Phases 01/02 are consolidated. It proves **"did we build the right thing?"** — that the integrated SentinelEdge system (node edge-AI + gateway + cloud fleet backend + signed OTA) meets reliability-manager, technician, operator, OT/security, data-science, EHS/safety, and regulator needs in real plant conditions — by evidencing the SysRS at system level against the **MOE/MOP/TPM** targets. It conforms to `../../../05_Conventions.md` for every ID, gate, method (T/I/A/D), severity (S1–S4), baseline/status string, and citation, and never re-defines them. Exit gate: **PRR** (per Conventions §3).
>
> **Inputs read:** Concept `../Phase_01_Concept/Concept.md` (STK · SN · SCN · MOE · RSK/OPP); SysRS `../Phase_02_Requirements/SysRS.md` (REQ · MOP · TPM · modes). Phase 06 `Integration_Plan.md`, Phase 07 `Verification_Matrix.md`, and the `_cross_cutting/` Hazard Log / Threat Model are **TODO (owed by their phases)** — TC-VER IDs, the `INC-*` schedule, and `HAZ-01`/`THR-*` detail are referenced as `TC-VER-TBD` / `INC-TBD` until those phases land. We never invent their content.
>
> **Validation ≠ verification.** TC-VER-* (Phase 07, SysRS §11) already prove the spec is met on instrumented measurements (inference latency in ms, model footprint in KB, signed-boot negative test, TLS 1.3). A 100%-verified matrix is **necessary but not sufficient** (per Conventions §4 note: acceptance/UAT is a validation activity, not a 5th method). The cases below add the **reliability-manager / technician / operator / OT-security / EHS / data-science / regulator** perspective in a real environment, on real rotating machinery, with a real adversary.

---

## Part A — Test Plan (TP-SENTINELEDGE-01)

**Plan ID:** TP-SENTINELEDGE-01 · **Standard:** ISO/IEC/IEEE 29119-3:2021 (supersedes IEEE 829 — per Conventions §9) · **V&V governance:** IEEE 1012-2016 · traced to `../Phase_02_Requirements/SysRS.md`.

### 1. Objective

Validate that the integrated SentinelEdge system meets the needs of its primary stakeholders — **Reliability/Maintenance Manager (STK-01)**, **Maintenance Technician (STK-02)**, **Machine/Process Operator (STK-03)**, **OT/Plant IT & Security (STK-04)**, **Fleet/Data-Science Team (STK-05)**, **EHS/Safety Officer (STK-06)**, **Sustainability/Compliance (STK-07)**, and **Regulators/Certification Bodies (STK-09)** — in real conditions, evidencing the SysRS at system level against the Concept §8 MOE set and the SysRS §10 MOP/TPM set. The headline validation claim: **SentinelEdge warns early enough to schedule work (MOE-01) with few enough false alarms to stay trusted (MOE-02), detecting on-device with no live uplink (MOE-04), updating and rolling back the fleet without truck rolls (MOE-06), and inducing zero unsafe events on rotating machinery (MOE-07 = 0)** — proven on a live multi-asset plant pilot with real machinery and an independent OT-security red-team, not in a lab.

### 2. Scope

| In scope | Out of scope |
|---|---|
| On-device edge-AI detection + TTF on real machinery (REQ-F-01, REQ-F-02; REQ-P-01) | The monitored machine's own control / PLC / safety-instrumented system (Concept §3 out-of-scope — interfaced read-only/advisory) |
| Edge-first alerting with **no live uplink** (REQ-F-02; REQ-O-02; SCN-02) | Automatic actuation that stops/controls the machine (Concept §3 — explicitly excluded; SentinelEdge **advises**) |
| Offline buffering + ordered sync on reconnect (REQ-F-03; SCN-02) | Cellular WAN at the node (gateway owns the WAN uplink — Concept §3) |
| Signed OTA firmware **and** model rollout, canary, automatic rollback (REQ-F-06; REQ-O-03; SCN-03) | Non-rotating asset classes / general building-HVAC monitoring (Concept §3, initial release) |
| Alert → dashboard → CMMS work-order routing (REQ-F-05; REQ-INT-02) | On-prem private-cloud hosting variant — *tailored out: `TODO: deployment variant` (Concept §3), validate in a later release* |
| Explanation + model-version + training-data lineage retention (REQ-F-07; REQ-O-04) | The CMMS itself (system of record — STK-01's tool; we validate the integration seam only) |
| Advisory-only / fail-passive behaviour around rotating machinery (REQ-F-04; REQ-SAF-01) | The training-data labelling pipeline's internal correctness (validated upstream by STK-05; here we validate the deployed model's field outcome) |
| Technician install/commission + identity attestation on operating machinery (REQ-U-01; REQ-SAF-02; SCN-04) | Penetration-test *tooling* development (uses commodity OT-security tooling) |
| Device identity, signed/verified boot, SBOM provenance (REQ-SEC-01, -02, -03) | The LLM/cloud provider's internal infrastructure beyond the contracted seam |
| Multi-year battery life under real plant duty (REQ-O-01) | — |
| Drift detection + drift alarm to the fleet team (REQ-P-04) | — |
| Secure field decommissioning: identity revoke + NIST 800-88 sanitization + RoHS/WEEE disposal (REQ-SEC-04; REQ-D-02; SCN-05) | — |
| IEC 61508 advisory-only safety case + EMC/radio conformity (REQ-D-01; REQ-D-03) | — |

Anything deferred is marked `TODO: <owed>`. Cardinal carve-out: **SentinelEdge validates that it *advises* the maintenance team accurately and safely — it never validates a closed-loop control action on the machine, because by design (REQ-SAF-01) no such path exists.**

### 3. Test Approach

| Layer | Manual | Automated | Tool |
|---|---|---|---|
| Unit (firmware / cloud) | — | 100% | Ceedling/Unity (firmware), PyTest (cloud) |
| Integration — node↔gateway↔cloud | 10% | 90% | Postman + Newman; gateway/cloud mocks; message-schema conformance (REQ-INT-01/-02) — `INC-TBD`, Phase 06 |
| **HIL — fault-signature replay** | 40% | 60% | HIL rig: shaker/bearing-defect rig + recorded fault-signature library injected into the sensor front-end — gates MOP-01/-03 / **TPM-01/-03** |
| **Edge-AI eval — recall / FPR** | 20% (spot-grade) | 80% | Held-out labelled validation dataset + confusion-matrix harness; per-asset-class breakdown — gates MOP-01/-02 / **TPM-01/-02** |
| **Edge-AI eval — drift** | 30% | 70% | Drift-injection harness (synthetically aged distribution) + drift-alarm assertion — gates MOP-09 |
| **On-target footprint/latency** *(reuses TC-VER)* | 20% | 80% | On-target profiler (flash/RAM/ms); validation reuses the Phase-07 measurement, does not re-take it — TPM-03/-05 |
| **Power / battery-life** | 30% | 70% | Power-budget analysis + accelerated duty-cycle bench + thermal chamber (−20 °C…+70 °C) — gates MOP-10 / **TPM-04** |
| **OTA / rollback** | 30% | 70% | HIL fleet (≥ N nodes) + canary-cohort harness + forced-failure rollback drill — gates MOP-07 |
| **OT-security red-team** | 50% | 50% | Spoofed-device + unsigned/tampered-image corpus; identity/boot pen-test (REQ-SEC-01/-02) — gates `THR-*` mitigations |
| Comms / interface | 30% | 70% | mTLS + schema fuzzing on node↔gateway and gateway↔cloud (REQ-INT-01/-02) |
| **Chaos / fault injection** | 20% | 80% | Connectivity-drop + sensor-fault injection (SCN-02; REQ-O-02; REQ-SAF-01 fail-passive) |
| **FAT** — factory acceptance | 70% | 30% | Witnessed factory functional + EMC/radio pre-screen + identity-provisioning audit (REQ-SEC-01; REQ-D-03) |
| **SAT** — site acceptance | 90% | 10% | On-site commissioning checklist + witnessed install-to-attestation on the host machine (REQ-U-01; REQ-SAF-02) |
| **UAT / pilot** | 100% | — | Reliability-manager workflow survey; nuisance-alert + lead-time analytics on real assets (MOE-01/-02) |
| **OAT (ops)** | 80% | 20% | Fleet-console runbook drill + drift-alarm dry-run + decommission rehearsal (REQ-P-04; REQ-SEC-04) |
| **Regulatory** | 100% | — | IEC 61508 safety-case assessment; CE/FCC EMC/radio test house; RoHS/WEEE + battery-transport conformity review |

> CI/CD + HIL + eval-harness rows are owed by Phase 06 (`Integration_Plan.md`, `INC-TBD`); the edge-AI eval suite (recall/FPR · drift · footprint/latency · OTA/rollback) runs in CI and **gates every model/firmware release** (SCN-03). Reuse — do not re-invent — those rows once Phase 06 lands.

### 4. Test Environment

| Env | Composition |
|---|---|
| **HIL bench / fault rig** | Bearing-defect + imbalance + misalignment rig; recorded fault-signature library replayed into the node sensor front-end; deterministic for eval & regression. *Integration env — not validation by itself.* |
| **Edge-AI eval harness** | Versioned held-out labelled validation dataset spanning the qualified target fault classes (pumps, motors, fans, compressors, gearboxes); confusion-matrix + drift-injection sets; agent pinned to the CM-baseline firmware+model build (product baseline). `TODO: dataset owed` — gates REQ-P-01 (SysRS §14). |
| **Thermal / power bench** | Climate chamber (−20 °C…+70 °C `TODO: confirm per site`, Concept §6) + accelerated duty-cycle profile + calibrated power analyzer, for battery-life validation. |
| **HIL fleet** | ≥ N nodes (N = `TODO`, ≥ 20) + ≥ 1 gateway + a cloud staging tenant, for OTA canary/rollback and concurrency. *Staging cloud run = integration, not validation by itself.* |
| **OT-security red-team window** | Independent OT-security testers (STK-04 sign-off) against the HIL fleet + a node with secure element, attempting device spoof, unsigned/tampered image, and identity-attestation bypass. |
| **FAT rig (manufacturer site)** | Production-line functional + EMC/radio pre-screen + per-device identity-provisioning station — **before delivery**. |
| **Pilot plant (real machinery)** | One real plant; **≥ 10 monitored rotating assets** (mixed pumps/motors/fans), real duty cycles, intermittent plant WAN, technician-installed nodes; **≥ 60-day pilot** (long enough to observe lead-time on at least some real incipient faults); EHS-cleared, LOTO-compatible. *Real machinery + real environment = validation.* |

### 5. Acceptance Types

| Type | Applies? | How it appears here |
|---|---|---|
| **UAT** — User Acceptance | **Yes** | Reliability managers (STK-01) confirm alerts are early, trustworthy, and actionable in their CMMS workflow on real assets (TC-VAL-01, -02, -10). Sign-off: STK-01. |
| **OAT** — Operational Acceptance | **Yes** | OT/Security + Data-Science run, monitor, update, and decommission the fleet in the final environment: drift-alarm dry-run, OTA/rollback drill, decommission rehearsal (TC-VAL-05, -07, -09). Sign-off: STK-04, STK-05. |
| **FAT** — Factory Acceptance | **Yes** | Witnessed at the **manufacturer's site BEFORE delivery** — production functional, EMC/radio pre-screen, per-device identity provisioning (TC-VAL-11). Catches build/provisioning defects early. Sign-off: Test Lead + STK-04. |
| **SAT** — Site Acceptance | **Yes** | At the **customer plant AFTER installation** — witnessed install-to-attestation on the host machine, LOTO-compatible mounting clear of rotating parts (TC-VAL-04). Catches install/environment defects. Sign-off: STK-02 + STK-06. |
| **Regulatory / Compliance** | **Yes** | IEC 61508 advisory-only safety-case assessment (STK-06/STK-09); CE/FCC EMC & radio conformity; RoHS/WEEE + battery-transport conformity (TC-VAL-06, -12). External: IEC 61508 assessor + notified body / test house. |
| **OT-security red-team (OAT-security)** | **Yes** | Independent device-spoof + signed-image + identity pen-test as the security facet of OAT (TC-VAL-08). Sign-off: STK-04. |
| **Pilot / Beta** | **Yes** | The ≥ 60-day real-machinery plant pilot is the spine of validation (TC-VAL-10). |
| **Simulation / Prototyping** | **Yes (partial)** | The HIL fault rig replays incipient-fault signatures too rare/dangerous to recreate on a live production machine on demand; the OTA forced-failure drill simulates a bad model reaching the fleet (TC-VAL-03, -07). |
| **A/B testing** | **Tailored out: deferred to Phase 10 continuous validation** (threshold/sensitivity tuning across the fleet), not a PRR gate. |

### 6. Risk Assessment (test-specific)

Scored `Likelihood × Impact`, each 1–5 (per Conventions §5.3). Seeded from Concept §9 (RSK-*).

| Risk | L×I | Band | Mitigation | Links |
|---|---|---|---|---|
| The held-out validation dataset under-represents real plant fault diversity → recall/FPR look better than production. | 4×5 | **Critical** | Validation pass criteria are measured on the **real-machinery pilot**, not only the held-out set; pilot must observe ≥ 1 real incipient fault per target asset class before PRR sign-off (`TODO: confirm fault yield`); held-out set used for regression determinism only. | RSK-01, REQ-P-01, TC-VAL-01/-10 |
| Pilot too short to catch a real bearing-failure lead-time (slow-developing faults) → MOE-01 unproven. | 4×4 | **High** | ≥ 60-day pilot + HIL fault-rig replay (TC-VAL-03) supplies controllable lead-time evidence; seeded-fault assets on the rig give deterministic lead-time numbers to complement pilot observation. | RSK-01, MOE-01, TC-VAL-03 |
| Alert-fatigue (false-positive) only surfaces at fleet scale; a 10-asset pilot under-samples nuisance alerts. | 4×5 | **Critical** | Track MOP-02 as alerts/device-month over the full pilot window; confidence-gated alerts + per-asset baselining; HIL rig runs no-fault "clean" assets in parallel to count false alarms deterministically. | RSK-02, REQ-P-01, TC-VAL-01 |
| Drift telemetry mis-calibrated → drift either alarms constantly (noise) or never (silent decay). | 4×4 | **High** | Drift-injection harness validates alarm at the configured `drift_target`; both false-alarm and missed-drift directions tested; data-science (STK-05) calibrates against labelled aged data. | RSK-03, REQ-P-04, TC-VAL-09 |
| A bad OTA model/firmware bricks or degrades fielded nodes faster than rollback fires. | 3×5 | **High** | Forced-failure canary drill on the HIL fleet (TC-VAL-07) proves automatic rollback ≤ `rollback_target` with **no node left non-functional** (REQ-O-03); canary cohort small before fleet expansion. | RSK-06, REQ-F-06/REQ-O-03, TC-VAL-07 |
| A prediction is (mis)wired to actuate the machine during integration → functional-safety hazard. | 2×5 | **High** | Design-inspection + FMEA confirm **no actuation path exists** (REQ-SAF-01); fail-passive chaos test (sensor/compute fault) asserts the node never actuates and never asserts a control signal (TC-VAL-02). Any actuation observed = **S1**. | RSK-04, HAZ-01, TC-VAL-02 |
| Battery-life accelerated bench ≠ real harsh-plant duty (temperature, oil mist, vibration) → MOE-05 optimistic. | 3×4 | **High** | Thermal-chamber sweep across the −20…+70 °C band + accelerated duty cycle; one pilot site runs in a genuinely cold/hot zone; power-budget **analysis** (A) cross-checks bench **test** (T). | RSK-05, REQ-O-01, TC-VAL-03 |
| Spoofed/cloned device or unsigned image slips into the fleet during the red-team window. | 3×5 | **High** | Independent OT-security pen-test (TC-VAL-08) attempts spoof + unsigned/tampered image + attestation bypass; any accepted unsigned/tampered image or accepted clone = **S1**; SBOM provenance reviewed. | RSK-06, REQ-SEC-01/-02, TC-VAL-08 |
| Recoverable data or live identity left on a retired node → compliance breach. | 3×3 | **Medium** | Decommission rehearsal (TC-VAL-05) verifies identity revocation + NIST 800-88 sanitization (keys, buffered data, model) + RoHS/WEEE routing; post-wipe forensic read confirms unrecoverable. | RSK-07, REQ-SEC-04/REQ-D-02, TC-VAL-05 |

### 7. Pass / Fail Criteria

Numeric, set **in advance**, derived from SentinelEdge's own MOE/MOP/TPM set (no copied numbers; targets held as named `TODO` thresholds per SysRS §10 — never invented). The gate floor is the **PRR** (per Conventions §3): validation ≥ targets, **zero S1**, FCA/PCA done. Defect severity uses the single `S1`–`S4` taxonomy (Conventions §5.1) — cross-referenced, not redefined; for SentinelEdge, **any system-induced unsafe event on the machine, any accepted unsigned/tampered image, any actuation path, or recoverable data on a sanitized node is S1**.

| # | Criterion | Source target | Floor (threshold) |
|---|---|---|---|
| PF-1 | **System-induced unsafe events on monitored machinery = 0** across pilot + chaos/fail-passive tests. | MOE-07 | **0** (no waiver — any occurrence is S1, blocks PRR) |
| PF-2 | **Recall on target fault classes ≥ `recall_target`** on the held-out set **and** sustained on the pilot. | MOE-03 / MOP-01 / **TPM-01** | ≥ `recall_target` (value = `TODO: pilot-measured`, SysRS §10) |
| PF-3 | **False-positive / nuisance-alert rate ≤ `fpr_target`** (alerts/device-month) over the pilot. | MOE-02 / MOP-02 / **TPM-02** | ≤ `fpr_target` (value = `TODO: pilot-measured`) |
| PF-4 | **Mean prediction lead time ≥ the planning window** for corrective work (HIL-seeded + any pilot fault). | MOE-01 / MOP-01-adjacent | ≥ corrective-planning window (value = `TODO`, SysRS §10) |
| PF-5 | **Edge autonomy ≥ `MOP-05` target** — % detections raised with no live uplink (near 100%). | MOE-04 / MOP-05 | ≥ `TODO` (near 100%) |
| PF-6 | **On-device inference latency ≤ `lat_target` ms** and **footprint ≤ `mem_target`/`ram_target`** on the target node. | MOP-03/-04 / **TPM-03/-05** | ≤ `TODO` (reuses Phase-07 TC-VER measurement) |
| PF-7 | **Service-free battery life ≥ `life_target` years** projected from bench + thermal sweep. | MOE-05 / MOP-10 / **TPM-04** | ≥ `TODO: life_target` years (SysRS §10) |
| PF-8 | **Fleet OTA reach ≥ `MOP-07` target within the window, incl. automatic rollback** with **no node left non-functional**. | MOE-06 / MOP-07 | ≥ `TODO`; rollback ≤ `rollback_target`; 0 bricked nodes |
| PF-9 | **Drift alarm fires at the configured `drift_target`** (no missed-drift, no nuisance-drift storm). | MOP-09 | per `drift_target` (value = `TODO`) |
| PF-10 | **Independent OT-security pen-test passed with zero S1/S2 open at PRR** — no accepted clone/unsigned/tampered image. | REQ-SEC-01/-02 (`THR-*`) | 0 S1/S2 open (S2 only with recorded CCB waiver `CR-TBD`) |
| PF-11 | **Decommission verified:** identity revoked + keys/data/model irrecoverable (NIST 800-88) + RoHS/WEEE routed. | REQ-SEC-04 / REQ-D-02 | 100% of sanitized nodes forensically unrecoverable |
| PF-12 | **Regulatory acceptance:** IEC 61508 advisory-only safety case accepted; CE/FCC EMC/radio passed; RoHS/WEEE conformity retained. | REQ-D-01/-03; REQ-SAF-01 | Safety case accepted; EMC/radio pass; conformity evidence retained |
| PF-13 | **≥ 95% of TC-VAL cases Pass** on the targeted release; **zero S1 defects**; FCA/PCA done. | Conventions §3 PRR | ≥ 95% pass; 0 S1 |

A failed safety TC-VAL (TC-VAL-02 fail-passive, TC-VAL-04 LOTO-safe install) is **S1** by definition (HAZ-01 behavioural mitigation failed) and blocks PRR.

### 8. Roles & Responsibilities

| Role | Responsibility | STK |
|---|---|---|
| Test Lead | Owns TP-SENTINELEDGE-01; chairs TRR/PRR; approves release. | — |
| Safety/RAMS Lead | Owns IEC 61508 safety case + fail-passive/LOTO validation; signs off PF-1, PF-12 safety. | STK-06 |
| Fleet / Data-Science Lead | Owns edge-AI eval (recall/FPR/drift), OTA/rollback drill; signs off PF-2/-3/-8/-9 / TPM-01/-02. | STK-05 |
| OT / Security | Commissions independent device-spoof + signed-image pen-test; signs off PF-10; SBOM/identity governance. | STK-04 |
| Reliability Manager | Owns UAT — lead-time, nuisance-alert, CMMS-workflow acceptance; signs off PF-4 (pilot facet). | STK-01 |
| Maintenance Technician | Runs SAT install/commission + decommission; signs off install-to-attestation (TC-VAL-04). | STK-02 |
| Sustainability / Compliance | Owns RoHS/WEEE + battery-transport + NIST 800-88 sanitization sign-off (PF-11). | STK-07 |
| Hardware/Power QA | Owns battery-life + thermal + EMC pre-screen evidence (PF-7). | — |
| Regulatory Liaison | Coordinates IEC 61508 assessor + CE/FCC test house + notified body (PF-12). | STK-09 |

### 9. Schedule (anchored to Phase 06 increments + gate ladder)

Anchored TRR → FAT → SAT/pilot/red-team → PRR (per Conventions §3). Phase 06 increment (`INC-TBD`) dates are owed — markers only; no invented dates.

| Period | Activity | Gate |
|---|---|---|
| After Phase 06 increments complete (`INC-TBD`) | Node↔gateway↔cloud integrated; edge-AI eval suite green in CI; HIL fault rig + fleet stood up; 100% method coverage. | **TRR** (Phase 07) |
| TRR + ~1 sprint | **FAT** at manufacturer site — production functional, EMC/radio pre-screen, per-device identity provisioning (TC-VAL-11). | — |
| Following | HIL fault-replay + battery/thermal + OTA forced-failure rollback drill (TC-VAL-03, -07); independent OT-security red-team (TC-VAL-08); IEC 61508 safety-case assessment (TC-VAL-02, -12). | — |
| On delivery to plant | **SAT** install-to-attestation on host machinery (TC-VAL-04); ≥ 60-day real-machinery pilot (TC-VAL-01, -10); OAT drift + decommission drills (TC-VAL-05, -09). | — |
| Pilot close + triage | All TC-VAL executed & evidenced; defects triaged S1–S4; FCA/PCA; CE/FCC + RoHS/WEEE conformity letters in hand (TC-VAL-06). | **PRR** |
| PRR pass | → Phase 10 Operations (ORR → GA), continuous validation (drift, fleet SLOs). | ORR → GA |

> **TODO:** bind concrete dates once Phase 06 `Integration_Plan.md` sets `INC-*` timing. Buffer ≥ 1 sprint between pilot close and PRR for defect rework. FAT precedes delivery; SAT follows installation (per Conventions §3 / skill — Factory-first, then Site).

### 10. Test-Case Inventory

| Suite | Count | Maps to |
|---|---|---|
| **Verification (TC-VER-*)** | `TC-VER-TBD` — full set in `../Phase_07_Verification/Verification_Matrix.md` (owed by Phase 07); seeds in SysRS §11. | 1:1 to REQ on instrumented measurement (latency ms, footprint KB, signed-boot negative test). |
| **Validation (TC-VAL-*)** | **12** (Part B) | Reliability/technician/operator/OT-security/data-science/EHS/regulator journeys: edge detection, fail-passive safety, HIL lead-time, SAT install, decommission, regulatory, OTA/rollback, identity red-team, drift, pilot, FAT, EMC/radio. |
| **Pilot acceptance** | Continuous (TC-VAL-10 + analytics across the ≥ 60-day pilot) | MOE-01, MOE-02, MOE-04. |

---

## Part B — Validation Test Cases (TC-VAL-*)

> Each case is **independent and re-runnable** — all needed state is established in Preconditions (no case reuses another's output, per the skill's independence rule). Every step carries an inline `*Expected:*`. **Actual Result** and **Pass/Fail Status** are intentionally left blank until executed (per Conventions §6 / 29119-3 pre- vs post-execution split). Defect refs use the `S1`–`S4` taxonomy (Conventions §5.1). Priority per Conventions §5.2. Evidence is archived per case under `validation-evidence/TC-VAL-NN/`.

---

### TC-VAL-01 — Edge detection of an incipient bearing fault routes to a work order (UAT)

| Field | Value |
|---|---|
| Objective | A reliability manager receives an early, trustworthy, explained alert on a real asset and it becomes a CMMS work order with enough lead time to schedule corrective work — validating the marquee predictive-maintenance outcome (SCN-01). |
| Linked REQs / SN | REQ-F-01, REQ-F-02, REQ-F-05, REQ-F-07, REQ-P-01, REQ-INT-02; SN-01, SN-02, SN-03, SN-09, SN-11 |
| Priority | High |
| Type | Validation (UAT) |
| Preconditions | Pilot plant live; a node commissioned and baselined on a real pump-motor asset with a known developing bearing condition (or a controlled seeded-defect asset on the pilot line); CMMS integration configured for STK-01's account; reliability manager (STK-01) with no prior knowledge of this case's expected alert. (Self-contained — node and CMMS state established here, not borrowed.) |
| Steps | 1. Run the asset on its normal duty cycle and let the node sample/score on its duty cycle (REQ-F-01). *Expected:* node produces an anomaly score + predicted TTF each evaluation window; telemetry visible on the fleet console. <br> 2. As the bearing signature drifts toward the defect pattern, observe the threshold crossing. *Expected:* node raises a maintenance alert **on-device** with an anomaly score + predicted TTF (REQ-F-02); alert carries the contributing signal-feature explanation + model-version + lineage ID (REQ-F-07). <br> 3. Observe routing. *Expected:* cloud routes the alert to STK-01's dashboard **and** creates/proposes a CMMS work order within `TODO: t_route` s (REQ-F-05); work order references the asset and predicted TTF. <br> 4. STK-01 reviews the alert and explanation unaided. *Expected:* the explanation is comprehensible to a reliability engineer without data-science training (REQ-U-02); STK-01 can decide and schedule. <br> 5. Record the lead time from alert to the predicted failure window and confirm the work order schedules corrective work **before** failure. *Expected:* mean prediction lead time ≥ the corrective-planning window (MOE-01). |
| Final Expected Outcome | The asset's incipient fault is detected on-device and surfaces as an explained CMMS work order with lead time ≥ the corrective-planning window (MOE-01 / MOP-01); the alert is grounded in retained explanation + lineage (REQ-F-07); STK-01 accepts it as trustworthy and actionable. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed: Pass / Fail / Blocked)_ |
| Defect refs | _(S1–S4 link if Fail; a missed real fault that develops to failure unwarned = S1)_ |
| Evidence path | validation-evidence/TC-VAL-01/ |
| Tools | Fleet console export; CMMS work-order export; alert-explanation + lineage export; stopwatch; STK-01 acceptance survey |

---

### TC-VAL-02 — Fail-passive under sensor/compute fault: node never actuates the machine (SAT-safety / simulation)

| Field | Value |
|---|---|
| Objective | Loss, fault, or compromise of the node leaves the monitored machine's own control and safety systems unaffected and the node asserts **no** control/actuation signal — validating advisory-only / fail-passive safety (SCN-02 off-nominal; HAZ-01). |
| Linked REQs / SN | REQ-F-04, REQ-SAF-01, REQ-D-01; SN-06 |
| Priority | High |
| Type | Validation (Simulation) — fail-passive safety, EHS (STK-06) sign-off |
| Preconditions | HIL bench with a node mounted to a representative machine emulator whose control/safety I/O is instrumented; node firmware at the CM-baseline build; fault-injection harness able to force sensor open/short, ADC fault, compute hang/reset, and link loss; design FMEA + interface inspection record available (REQ-SAF-01). EHS officer (STK-06) present. (Self-contained.) |
| Steps | 1. Inspect the node's external interface inventory against the design. *Expected:* no interface exists that can command, trip, or control the machine (REQ-F-04); inspection record confirms no actuation path (REQ-SAF-01). <br> 2. Inject a sensor fault (open/short) mid-monitoring. *Expected:* node enters **Fault** mode, degrades safely, flags the fault, and asserts no control signal on the instrumented machine I/O (SysRS §9 Fault state). <br> 3. Force a compute hang then watchdog reset. *Expected:* on reset the node re-enters verified boot → Monitoring; at no point does it emit an actuation/control signal; machine control/safety I/O remains untouched. <br> 4. Sever the node↔gateway link during an active alert. *Expected:* node continues safe local detection/buffering (REQ-O-02); still no actuation; machine unaffected. <br> 5. Census the instrumented machine control/safety I/O for the whole run. *Expected:* zero assertions originating from the node across all fault modes. |
| Final Expected Outcome | Across all injected fault and compromise modes, the node induces **zero** control/actuation events on the machine and the machine's own control/safety systems are unaffected (MOE-07 = 0; REQ-SAF-01 fail-passive); inspection confirms no actuation path exists (REQ-F-04). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(any node-originated actuation/control assertion = S1; missing fail-passive degrade = S1)_ |
| Evidence path | validation-evidence/TC-VAL-02/ |
| Tools | Fault-injection harness; machine-I/O logic analyzer/oscilloscope; FMEA + interface-inspection record; EHS sign-off sheet |

---

### TC-VAL-03 — HIL fault-signature replay: lead time + recall/FPR on seeded faults (simulation)

| Field | Value |
|---|---|
| Objective | On a deterministic library of seeded fault signatures across the target asset classes, the edge model detects the fault early enough and with low enough false alarms to meet the recall/FPR/lead-time targets — supplying controllable evidence for faults too slow/rare to source from the pilot alone. |
| Linked REQs / SN | REQ-F-01, REQ-F-02, REQ-P-01; SN-01, SN-02, SN-03 |
| Priority | High |
| Type | Validation (Simulation) — HIL fault rig, Data-Science (STK-05) sign-off |
| Preconditions | HIL fault rig configured for bearing-defect, imbalance, and misalignment across ≥ K seeded cases (K = `TODO`, ≥ 30) plus parallel "clean" no-fault assets for false-alarm counting; recorded fault-signature library spanning the qualified target fault classes; node at CM-baseline firmware+model; held-out labelling withheld from the node. (Self-contained.) |
| Steps | 1. Replay each seeded fault signature from baseline through to the defect pattern at controlled progression. *Expected:* node samples/scores on duty cycle (REQ-F-01) and raises an on-device alert before the modelled failure point (REQ-F-02). <br> 2. Record, per case, the lead time from first alert to the modelled failure window. *Expected:* mean lead time ≥ the corrective-planning window (MOE-01). <br> 3. Tally true positives / false negatives across the seeded set. *Expected:* recall ≥ `recall_target` on the target fault classes (REQ-P-01 / MOP-01). <br> 4. Run the parallel clean assets for an equivalent device-month exposure. *Expected:* false-positive rate ≤ `fpr_target` (MOP-02). <br> 5. Break results down per asset class. *Expected:* no class collapses below the floor; any weak class flagged to STK-05 for retraining. |
| Final Expected Outcome | On the seeded HIL set, recall ≥ `recall_target` (TPM-01) and FPR ≤ `fpr_target` (TPM-02) with mean lead time ≥ the corrective-planning window (MOE-01), per asset class — giving deterministic accuracy/lead-time evidence to complement the pilot. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(recall < floor or FPR > floor on a qualified class = S2; a class with zero detections = S1 for that class)_ |
| Evidence path | validation-evidence/TC-VAL-03/ |
| Tools | HIL fault rig; fault-signature library; confusion-matrix harness; per-class report |

---

### TC-VAL-04 — Technician install & commission on operating machinery (SAT)

| Field | Value |
|---|---|
| Objective | A technician mounts, powers, pairs, and commissions a node to identity attestation quickly and **safely on/near operating machinery**, clear of rotating parts and LOTO-compatible — validating SCN-04 install at the customer site after delivery. |
| Linked REQs / SN | REQ-U-01, REQ-SEC-01, REQ-SAF-02; SN-06, SN-07, SN-08 |
| Priority | High |
| Type | Validation (SAT) — site acceptance, STK-02 + STK-06 sign-off |
| Preconditions | Delivered (FAT-passed) nodes on customer site; a host rotating asset with safe mounting points clear of rotating parts and a documented LOTO procedure; technician (STK-02) with the guided mobile/handheld commissioning flow and no specialist tools; EHS observer (STK-06) present. (Self-contained — uses delivered hardware, not a prior case's node.) |
| Steps | 1. Technician follows the guided flow to select a mounting point. *Expected:* the procedure directs mounting clear of rotating parts and compatible with the host machine's LOTO (REQ-SAF-02); EHS observer confirms no contact-with-rotating-parts risk. <br> 2. Technician mounts, powers, and pairs the node without specialist tools. *Expected:* pairing succeeds via the guided flow (REQ-U-01). <br> 3. Node performs verified boot and attests its cryptographic identity. *Expected:* node identity attests against the trusted key before enrolment (REQ-SEC-01); cloud accepts only an attested device. <br> 4. Cloud enrols the node, assigns the asset profile + baseline model, and starts the baseline-learning window. *Expected:* node transitions to Commissioning → baselining (SysRS §9). <br> 5. Measure wall-clock from physical mount to identity attestation. *Expected:* ≤ `TODO: t_commission` min (REQ-U-01 / MOP-08). |
| Final Expected Outcome | Technician commissions the node to attested identity in ≤ `t_commission` min (MOP-08), unaided and without specialist tools, with mounting/service clear of rotating parts and LOTO-compatible (REQ-SAF-02) — EHS confirms a safe install; only an attested device enrols (REQ-SEC-01). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(install requiring contact with rotating parts or LOTO-incompatible = S1; un-attested device enrolled = S1; over-time commission = S3)_ |
| Evidence path | validation-evidence/TC-VAL-04/ |
| Tools | Stopwatch; commissioning-flow capture; identity-attestation log; LOTO checklist; EHS sign-off sheet |

---

### TC-VAL-05 — End-of-life decommissioning: identity revoke + sanitization + WEEE routing (OAT / regulatory)

| Field | Value |
|---|---|
| Objective | A retired node has its identity revoked and its keys, buffered data, and on-device model rendered irrecoverable, with the battery and e-waste routed for compliant disposal — validating SCN-05. |
| Linked REQs / SN | REQ-SEC-04, REQ-D-02; SN-07, SN-12 |
| Priority | High |
| Type | Validation (OAT / Regulatory) — OT/Security (STK-04) + Sustainability (STK-07) sign-off |
| Preconditions | A fielded node at end of life holding a provisioned identity, ≥ 1 week of buffered alerts/evidence, and a deployed model; cloud fleet registry with that device active; technician (STK-02), OT/Security (STK-04), and Sustainability (STK-07) present; forensic read tooling available. (Self-contained.) |
| Steps | 1. Cloud revokes the device identity in the registry. *Expected:* the device's identity is revoked; any subsequent attestation or enrolment attempt is rejected (REQ-SEC-04). <br> 2. Technician triggers the secure wipe on the node. *Expected:* keys, buffered data, and the on-device model are sanitized per NIST SP 800-88 Rev. 1 (REQ-SEC-04); node enters Decommissioning state (SysRS §9). <br> 3. Forensically read the node's storage/secure element post-wipe. *Expected:* no recoverable keys, alert data, or model artifacts. <br> 4. Remove the battery and route the node + battery to the RoHS/WEEE e-waste stream per the battery transport/disposal procedure. *Expected:* disposal route followed; conformity evidence retained (REQ-D-02). <br> 5. Confirm the decommission is recorded for audit. *Expected:* an audit record exists with revocation + sanitization + disposal status. |
| Final Expected Outcome | Device identity revoked and re-enrolment denied; keys/data/model forensically unrecoverable (NIST 800-88; REQ-SEC-04); battery + e-waste routed in RoHS/WEEE compliance with retained evidence (REQ-D-02); complete audit record (PF-11). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(any recoverable key/data/model after wipe = S1; revoked identity still enrolls = S1; missing disposal evidence = S2)_ |
| Evidence path | validation-evidence/TC-VAL-05/ |
| Tools | Fleet registry console; secure-wipe procedure; forensic read tool; WEEE/battery disposal manifest; audit-log export |

---

### TC-VAL-06 — Regulatory: IEC 61508 advisory-only safety case + CE/FCC EMC/radio + RoHS/WEEE (regulatory)

| Field | Value |
|---|---|
| Objective | External assessors accept that SentinelEdge is an advisory-only function safe to the determined IEC 61508 SIL, meets CE/FCC EMC & radio conformity, and conforms to RoHS/WEEE + battery regulation — validating the domain/safety requirements for the regulators. |
| Linked REQs / SN | REQ-D-01, REQ-D-02, REQ-D-03, REQ-SAF-01, REQ-C-02; SN-06, SN-07, SN-12 |
| Priority | High |
| Type | Validation (Regulatory) — IEC 61508 assessor + notified body / test house, STK-09 sign-off |
| Preconditions | Frozen product-baseline node + gateway on certified DUTs; the hazard analysis (HAZ-01) and its determined SIL target available (`TODO: SIL_target`, SysRS §14 — owed by the Safety/RAMS thread); IEC 61508 safety-case dossier, EMC/radio test reports, and RoHS/WEEE + battery-transport conformity file assembled. External IEC 61508 assessor and accredited EMC/radio test house engaged. (Self-contained.) |
| Steps | 1. IEC 61508 assessor reviews the safety case that SentinelEdge is advisory-only and fail-passive (REQ-SAF-01) with no actuation path (REQ-F-04). *Expected:* the advisory-only argument and the determined SIL allocation are accepted for the function (REQ-D-01). <br> 2. Test house runs CE/FCC EMC + radio-emissions tests on the wireless node and gateway. *Expected:* emissions/immunity within the limits for the target markets (REQ-D-03); node↔gateway link operates within license-exempt bands needing no site licence (REQ-C-02). <br> 3. Compliance reviews the RoHS/WEEE + battery transport/disposal conformity file. *Expected:* materials + battery handling conform; evidence retained (REQ-D-02). <br> 4. Collect the assessor/notified-body letters. *Expected:* conformity letters issued and archived. |
| Final Expected Outcome | IEC 61508 advisory-only safety case accepted at the determined SIL (REQ-D-01); CE/FCC EMC + radio conformity passed on certified DUTs (REQ-D-03, REQ-C-02); RoHS/WEEE + battery conformity evidence retained (REQ-D-02) — all external letters archived (PF-12). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(EMC/radio fail = S1/S2; safety case rejected = S1; missing conformity evidence = S2)_ |
| Evidence path | validation-evidence/TC-VAL-06/ |
| Tools | IEC 61508 safety-case dossier; accredited EMC/radio test reports; RoHS/WEEE conformity file; notified-body/assessor letters |

---

### TC-VAL-07 — OTA model rollout: canary expands, forced-failure auto-rolls-back, no node bricked (OAT / simulation)

| Field | Value |
|---|---|
| Objective | A signed model/firmware OTA rolls out to a canary cohort, expands when healthy, and **automatically rolls a cohort back to the last known-good version** on a forced health-check failure, with no node left non-functional — validating SCN-03 and SN-10. |
| Linked REQs / SN | REQ-F-06, REQ-O-03, REQ-SEC-02; SN-04, SN-07, SN-10 |
| Priority | High |
| Type | Validation (OAT) — SRE/Fleet release drill (STK-05) + OT/Security (STK-04) sign-off |
| Preconditions | HIL fleet of ≥ N nodes (N = `TODO`, ≥ 20) + gateway + cloud staging, all on a known-good baseline image; a **signed** improved model package and a **deliberately health-failing** package both prepared; canary cohort + cohort health-check + rollback path configured; signing PKI live (REQ-SEC-02). (Self-contained.) |
| Steps | 1. Submit the signed improved model to a canary cohort. *Expected:* nodes verify the signature and apply it (REQ-SEC-02); cohort health check runs (REQ-F-06). <br> 2. With the canary healthy, expand the rollout to the rest of the fleet. *Expected:* fleet update reach ≥ `MOP-07` target within the update window. <br> 3. Now stage the deliberately health-failing package to a fresh canary cohort. *Expected:* the cohort health check fails. <br> 4. Observe the response. *Expected:* the cohort **automatically rolls back** to the last known-good image within `TODO: rollback_target` (REQ-O-03); rollout halts; no node is left non-functional. <br> 5. Attempt to push an **unsigned/tampered** package. *Expected:* every node rejects it at verified boot/loader (REQ-SEC-02); no node applies it. <br> 6. Census every node's running image post-drill. *Expected:* healthy nodes on the new good image; failed-cohort nodes on the last known-good; zero bricked. |
| Final Expected Outcome | Fleet OTA reach ≥ `MOP-07` within the window for a healthy update; a forced-failure cohort auto-rolls-back ≤ `rollback_target` with **0 nodes bricked** (REQ-O-03 / MOP-07); unsigned/tampered images are rejected fleet-wide (REQ-SEC-02) — PF-8. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(any bricked/non-functional node = S1; failed rollback = S1; accepted unsigned/tampered image = S1; over-window reach = S2)_ |
| Evidence path | validation-evidence/TC-VAL-07/ |
| Tools | HIL fleet harness; OTA canary console; rollback runbook (`RB-TBD`, Phase 10); image-census tool; signing PKI |

---

### TC-VAL-08 — Independent OT-security red-team: device spoof + unsigned image + attestation bypass (OAT-security)

| Field | Value |
|---|---|
| Objective | A compromised or spoofed device, and unsigned/tampered firmware/model, cannot enter or run in the fleet, and identity attestation cannot be bypassed — validating SN-07 against an **independent** OT-security red-team. |
| Linked REQs / SN | REQ-SEC-01, REQ-SEC-02, REQ-SEC-03, REQ-INT-01; SN-07, SN-10 |
| Priority | High |
| Type | Validation (Simulation) — independent OT-security pen-test (OAT-security facet), STK-04 sign-off |
| Preconditions | HIL fleet + a target node with secure element on the CM-baseline build; independent OT-security testers (not the build team) provisioned; an attack corpus covering device cloning/spoofing, unsigned-image injection, tampered (bit-flipped) signed-image, downgrade, and attestation-bypass attempts; SBOM for the released images available; audit/registry live. (Self-contained.) |
| Steps | 1. Attempt to enrol a **cloned/spoofed** device using copied identifiers. *Expected:* attestation fails — the private key is held in the secure element and cannot be cloned (REQ-SEC-01); enrolment denied and logged. <br> 2. Push an **unsigned** firmware/model image. *Expected:* loader rejects it (REQ-SEC-02); node stays on the trusted image. <br> 3. Push a **tampered** (bit-flipped) but previously-signed image. *Expected:* signature verification fails; rejected (REQ-SEC-02). <br> 4. Attempt an attestation **bypass** / replay on the node↔gateway link. *Expected:* the mutually-authenticated link rejects the unauthenticated/replayed peer (REQ-INT-01). <br> 5. Cross-check the released image against its SBOM + build provenance. *Expected:* SBOM (SPDX/CycloneDX) matches the shipped components and is traceable to build provenance (REQ-SEC-03). <br> 6. Tally neutralized / total; route any acceptance to defect triage. |
| Final Expected Outcome | **Zero** accepted clones, unsigned, or tampered images; attestation cannot be bypassed; SBOM provenance verified (REQ-SEC-01/-02/-03; REQ-INT-01) — pen-test closes with no S1/S2 open (PF-10). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(any accepted clone/unsigned/tampered image or attestation bypass = S1; SBOM mismatch = S2)_ |
| Evidence path | validation-evidence/TC-VAL-08/ |
| Tools | OT-security pen-test toolkit; image-signing/tamper harness; mTLS replay tool; SBOM diff; registry/audit export; red-team report |

---

### TC-VAL-09 — Model drift detection raises a fleet drift alarm (OAT)

| Field | Value |
|---|---|
| Objective | When fielded model accuracy decays relative to the deployment baseline, the model-management subsystem detects it and raises a drift alarm to the fleet team — neither missing real drift nor flooding false drift alarms — validating SN-09 / RSK-03. |
| Linked REQs / SN | REQ-P-04, REQ-O-04; SN-09 |
| Priority | High |
| Type | Validation (OAT) — Data-Science (STK-05) sign-off |
| Preconditions | Staging fleet + cloud model-management subsystem with a recorded deployment baseline accuracy; a drift-injection harness that can synthetically age the input distribution to a controlled accuracy delta; a parallel stable stream as a negative control; STK-05 fleet team on the alert channel. (Self-contained.) |
| Steps | 1. Run the stable negative-control stream. *Expected:* no drift alarm fires (no nuisance-drift storm). <br> 2. Inject drift below `drift_target`. *Expected:* still no alarm (sub-threshold). <br> 3. Inject drift exceeding `drift_target` relative to the deployment baseline. *Expected:* the subsystem detects the exceedance and raises a drift alarm to the fleet team (REQ-P-04 / MOP-09). <br> 4. Confirm the alarm carries the affected model version + lineage reference (REQ-O-04). *Expected:* STK-05 can identify which deployed model + lineage drifted. <br> 5. Measure detection latency from threshold crossing to alarm. *Expected:* within `MOP-09` latency target. |
| Final Expected Outcome | Drift exceeding `drift_target` is detected and alarmed to the fleet team within the MOP-09 latency, with no sub-threshold or negative-control false alarms, carrying model-version + lineage (REQ-P-04 / REQ-O-04) — PF-9. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(missed real drift = S2; nuisance-drift storm on stable stream = S3)_ |
| Evidence path | validation-evidence/TC-VAL-09/ |
| Tools | Drift-injection harness; baseline-accuracy record; alarm-channel capture; lineage export |

---

### TC-VAL-10 — Multi-asset pilot: concurrent detections, connectivity loss mid-detection, ordered resync (UAT / pilot, multi-actor failure)

| Field | Value |
|---|---|
| Objective | **Multi-actor concurrency + mid-operation failure:** across ≥ 10 real assets monitored simultaneously, multiple nodes detect/alert concurrently while the gateway/WAN drops mid-detection, and on reconnection every buffered alert resyncs in order with nothing lost and no unsafe behaviour offline — validating SCN-02 at pilot scale and the edge-autonomy claim. |
| Linked REQs / SN | REQ-F-02, REQ-F-03, REQ-O-02, REQ-SAF-01, REQ-INT-02; SN-01, SN-02, SN-03, SN-06, SN-09 |
| Priority | High |
| Type | Validation (UAT / Pilot) — reliability manager (STK-01) + OT (STK-04) sign-off |
| Preconditions | Pilot plant with ≥ 10 nodes commissioned on real rotating assets; ≥ 3 of those assets armed to develop a detectable condition (or seeded-defect assets) within the test window; the plant WAN/gateway uplink controllable for an injected outage; CMMS + dashboard live; pilot running on intermittent-by-design connectivity. (Self-contained — ≥ 10 nodes + 3 armed sources + outage control established here.) |
| Steps | 1. With all ≥ 10 nodes monitoring, drive ≥ 3 assets toward their detectable condition **simultaneously** (≥ 3 concurrent detection sources). *Expected:* each node independently raises an on-device alert (REQ-F-02) without contending for a shared resource. <br> 2. **Mid-detection, sever the gateway/WAN uplink** for an extended period. *Expected:* nodes keep sampling/scoring and **buffer** all alerts + evidence locally (REQ-F-03, REQ-O-02); no detection is lost; no unsafe behaviour offline (REQ-SAF-01). <br> 3. While offline, drive a 4th asset to a detection. *Expected:* the new alert is also detected on-device and buffered (edge autonomy — MOE-04). <br> 4. Restore connectivity. *Expected:* each node syncs its buffered alerts/evidence in **chronological order** within `TODO: t_sync` s (REQ-F-03); CMMS receives all alerts; none duplicated, none dropped. <br> 5. Census detections raised vs uplink state across the pilot window. *Expected:* % of detections raised with no live uplink ≥ `MOP-05` (near 100%); ordered, complete resync. |
| Final Expected Outcome | Across ≥ 10 concurrent assets with ≥ 3 simultaneous detections and a mid-detection outage, every alert is raised on-device offline and resyncs in order on reconnect with **none lost or duplicated** (REQ-F-03 / REQ-O-02); edge autonomy ≥ `MOP-05` (MOE-04); zero unsafe offline behaviour (REQ-SAF-01) — PF-5. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(any lost/dropped detection = S1; out-of-order or duplicated resync = S2; unsafe offline behaviour = S1)_ |
| Evidence path | validation-evidence/TC-VAL-10/ |
| Tools | Uplink outage controller; per-node buffer + sync logs; CMMS export; detection-vs-uplink census; STK-01 acceptance survey |

---

### TC-VAL-11 — Factory acceptance: production functional + identity provisioning + EMC pre-screen (FAT)

| Field | Value |
|---|---|
| Objective | Each node leaving the manufacturer's line is functionally sound, provisioned with a unique attested identity, and passes an EMC/radio pre-screen — catching build/provisioning defects **before delivery** — validating production readiness. |
| Linked REQs / SN | REQ-SEC-01, REQ-SEC-03, REQ-D-03, REQ-F-01; SN-07 |
| Priority | High |
| Type | Validation (FAT) — manufacturer site before delivery, Test Lead + OT/Security (STK-04) sign-off |
| Preconditions | Production line with the identity-provisioning station, EMC/radio pre-screen fixture, and functional-test fixture; a production lot of nodes at the released firmware+model build; SBOM for the build available; witness present. (Self-contained — uses freshly produced units, not a prior case's node.) |
| Steps | 1. Run the production functional test on each unit (sense → score → alert path). *Expected:* each node samples all three channels and executes the embedded model end-to-end (REQ-F-01). <br> 2. Provision each unit's unique cryptographic identity into its secure element and attest. *Expected:* each node holds a unique key in its secure element and attests successfully (REQ-SEC-01); no duplicate identities across the lot. <br> 3. Run the EMC/radio pre-screen on a sampled subset. *Expected:* emissions within the pre-screen limits (REQ-D-03) — flags marginal units before they ship. <br> 4. Bind each shipped image to its SBOM + build provenance. *Expected:* SBOM (SPDX/CycloneDX) accompanies the build and is traceable (REQ-SEC-03). <br> 5. Witness records pass/fail per unit and per lot. *Expected:* a signed FAT record per lot. |
| Final Expected Outcome | Every delivered node is functionally sound (REQ-F-01), carries a unique attested identity in its secure element (REQ-SEC-01), passes the EMC/radio pre-screen (REQ-D-03), and ships with a traceable SBOM (REQ-SEC-03) — signed FAT record per lot, before delivery. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(duplicate/missing identity = S1; functional-path fail = S1; EMC pre-screen fail = S2; missing SBOM = S2)_ |
| Evidence path | validation-evidence/TC-VAL-11/ |
| Tools | Production functional fixture; identity-provisioning station; EMC pre-screen fixture; SBOM register; FAT witness sheet |

---

### TC-VAL-12 — Battery-life validation across the plant temperature band (OAT)

| Field | Value |
|---|---|
| Objective | A battery-powered node achieves the multi-year service-free life target under the nominal plant duty cycle across the full temperature band — validating SN-05, combining accelerated-bench test with power-budget analysis. |
| Linked REQs / SN | REQ-O-01, REQ-P-03; SN-05 |
| Priority | High |
| Type | Validation (OAT) — Hardware/Power QA, with STK-01 acceptance |
| Preconditions | Climate chamber across −20 °C…+70 °C (`TODO: confirm per site`, Concept §6); calibrated power analyzer; a node at CM-baseline firmware+model running the nominal plant duty-cycle profile (wake-on-event sensing + low-power conserve, SysRS §9); the power-budget analysis model available for cross-check. (Self-contained.) |
| Steps | 1. Run the node on the nominal duty-cycle profile at room temperature and measure energy per cycle with the power analyzer. *Expected:* measured per-cycle energy within the power budget; model footprint fits within `mem_target`/`ram_target` so low-power modes engage (REQ-P-03). <br> 2. Sweep the chamber across the temperature band and repeat. *Expected:* energy/cycle characterized across temperature; low-power conserve engages as designed at extremes. <br> 3. Project service-free life from measured energy/cycle + battery capacity, cross-checked against the power-budget analysis (A + T). *Expected:* projected life ≥ `life_target` years (REQ-O-01 / MOP-10). <br> 4. Run one accelerated-duty soak at the worst-case temperature. *Expected:* no premature shutdown; projection holds at worst case. |
| Final Expected Outcome | Projected service-free battery life ≥ `life_target` years (MOE-05 / MOP-10 / TPM-04) across the −20…+70 °C band under nominal duty, with test and analysis agreeing within tolerance (PF-7). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(projected life < target = S2; premature shutdown at temperature = S2)_ |
| Evidence path | validation-evidence/TC-VAL-12/ |
| Tools | Climate chamber; calibrated power analyzer; duty-cycle profile; power-budget analysis model |

---

## Part C — Coverage & PRR Readiness

### C.1 TC-VAL → REQ / SN / SCN / MOE-MOP coverage

| TC-VAL | Primary REQ(s) | SN | SCN | MOE/MOP/TPM | Acceptance type | Stakeholder sign-off |
|---|---|---|---|---|---|---|
| TC-VAL-01 | F-01, F-02, F-05, F-07, P-01, INT-02 | SN-01,-02,-03,-09,-11 | SCN-01 | MOE-01,-02,-03 / MOP-01/-02 / TPM-01/-02 | UAT | STK-01 |
| TC-VAL-02 | F-04, SAF-01, D-01 | SN-06 | SCN-02 | MOE-07 | Simulation (fail-passive safety) | STK-06 |
| TC-VAL-03 | F-01, F-02, P-01 | SN-01,-02,-03 | SCN-01 | MOP-01/-02 / **TPM-01/-02** | Simulation (HIL fault rig) | STK-05 |
| TC-VAL-04 | U-01, SEC-01, SAF-02 | SN-06,-07,-08 | SCN-04 | MOP-08 | SAT | STK-02, STK-06 |
| TC-VAL-05 | SEC-04, D-02 | SN-07,-12 | SCN-05 | — | OAT / Regulatory | STK-04, STK-07 |
| TC-VAL-06 | D-01, D-02, D-03, SAF-01, C-02 | SN-06,-07,-12 | — | — | Regulatory | STK-09 |
| TC-VAL-07 | F-06, O-03, SEC-02 | SN-04,-07,-10 | SCN-03 | MOP-07 | OAT / Simulation | STK-05, STK-04 |
| TC-VAL-08 | SEC-01, SEC-02, SEC-03, INT-01 | SN-07,-10 | SCN-03/-04 | — (`THR-*`) | Simulation (OT-security red-team) | STK-04 |
| TC-VAL-09 | P-04, O-04 | SN-09 | SCN-03 | MOP-09 | OAT | STK-05 |
| TC-VAL-10 | F-02, F-03, O-02, SAF-01, INT-02 | SN-01,-02,-03,-06,-09 | SCN-02 | MOE-04 / MOP-05/-06 | UAT/Pilot (multi-actor failure) | STK-01, STK-04 |
| TC-VAL-11 | SEC-01, SEC-03, D-03, F-01 | SN-07 | SCN-04 | — | FAT | STK-04 |
| TC-VAL-12 | O-01, P-03 | SN-05 | — | MOE-05 / MOP-10 / **TPM-04** | OAT | STK-01 |

**REQ-U coverage (skill mandate — every REQ-U → ≥ 1 TC-VAL):** REQ-U-01 (guided commission ≤ t_commission) → TC-VAL-04; REQ-U-02 (dashboard alert comprehensible without data-science training) → TC-VAL-01 *(reliability-manager acceptance of the explanation surface; **TODO:** add a dedicated usability-review session if a notified human-factors audit is required)*.

**Primary scenario coverage (every SCN → ≥ 1 TC-VAL):** SCN-01 → TC-VAL-01, -03; SCN-02 → TC-VAL-02, -10; SCN-03 → TC-VAL-07, -08, -09; SCN-04 → TC-VAL-04, -08, -11; SCN-05 → TC-VAL-05. All five OpsCon scenarios validated.

**Behavioural hazard coverage (every HAZ with a behavioural mitigation → validating TC-VAL):** HAZ-01 (unsafe condition on/around rotating machinery, mitigated by advisory-only/fail-passive REQ-SAF-01 and LOTO-safe install REQ-SAF-02) → TC-VAL-02 (fail-passive, **S1** if it fails), TC-VAL-04 (LOTO-safe install, **S1** if it fails), and TC-VAL-06 (IEC 61508 safety-case acceptance). `HAZ-01` detail is owed by the Safety/RAMS thread (`_cross_cutting/Hazard_Log.md`, TODO) — referenced per SysRS §8 REQ-SAF-01/-02.

**Multi-actor + mid-operation-failure case present:** TC-VAL-10 (≥ 10 concurrent assets, ≥ 3 simultaneous detection sources, mid-detection uplink outage with ordered resync).

### C.2 Validation vs Verification boundary (no duplication)

These belong to **Phase 07** (TC-VER-TBD, SysRS §11), not here — they prove *spec measurements*, which the TC-VAL above **reuse rather than re-take**: on-device inference latency ≤ `lat_target` ms on an instrumented timestamp (REQ-P-02), model footprint ≤ `mem_target`/`ram_target` KB measured on target (REQ-P-03), buffered-sync latency ≤ `t_sync` s instrumented (REQ-F-03), signed-boot negative test + identity-attestation conformance (REQ-SEC-01/-02), SBOM schema review (REQ-SEC-03), mTLS/TLS-1.3 channel conformance (REQ-INT-01/-02), and the power-budget analysis figure (REQ-O-01). The TC-VAL above prove the *outcome* — a reliability manager schedules work in time (TC-VAL-01), a node never actuates the machine (TC-VAL-02), an OT auditor cannot inject a clone (TC-VAL-08), a regulator signs off (TC-VAL-06) — reusing those measurements, not duplicating them.

### C.3 PRR exit-gate checklist (Conventions §3 floor)

| Exit-gate item | Status |
|---|---|
| Test Plan complete (10 sections, 29119-3); Standard set | Met (Part A) |
| ≥ 8 TC-VAL with per-step `*Expected:*` + blank Actual Result + Pass/Fail Status | Met (12 cases, Part B) |
| Acceptance catalog covers UAT/OAT/**FAT**/**SAT**/regulatory/pilot/simulation; A/B tailored-out with reason | Met (Part A §5) |
| Every TC-VAL independent (state re-established in Preconditions) | Met (no case reuses another's output) |
| Every REQ-U-* and every primary SCN → ≥ 1 TC-VAL; every behavioural HAZ validated | Met, with 1 TODO flagged (notified human-factors audit for REQ-U-02) — §C.1 |
| Pass criteria numeric, from SentinelEdge's own MOE/MOP/TPM, set in advance | Met (Part A §7; PF-1…PF-13; numeric values held as named `TODO` thresholds per SysRS §10 — never invented) |
| Multi-actor concurrency + mid-operation failure case | Met (TC-VAL-10) |
| **Validation ≥ targets · zero S1 · FCA/PCA done** | **TODO — pending execution** (cases authored; run after Phase 06/07 land; FCA/PCA at PRR) |
| Independent OT-security pen-test, zero S1/S2 open at PRR | TODO — pending red-team window (TC-VAL-08) |
| IEC 61508 safety case + CE/FCC + RoHS/WEEE accepted before GA | TODO — regulatory window (TC-VAL-06); FAT (TC-VAL-11) precedes delivery, SAT (TC-VAL-04) follows install |
| Evidence archived per case; V&V trace report (REQ → TC → result) | Folders created (`validation-evidence/TC-VAL-NN/`); results filled on execution |

**PRR recommendation:** **Conditional** — the test plan and an independent, traced 12-case TC-VAL suite are complete and ready to execute; PRR sign-off is owed on **execution evidence** after Phase 06 increments (`INC-TBD`) and the Phase 07 TRR, with the **zero-S1 / zero-unsafe-event** floor (PF-1), the **advisory-only fail-passive** safety case (PF-12), and the **recall (TPM-01) + FPR (TPM-02) + battery (TPM-04) + OTA-rollback (MOP-07) + identity-security (PF-10)** thresholds as the non-waivable conditions. Any deferred S2 requires an explicit CCB waiver recorded as `CR-TBD` (Phase 09). Next phase: `se-phase-09-change-config` — stand up the CCB/CR loop (firmware/model change control + baseline governance) before GA.
