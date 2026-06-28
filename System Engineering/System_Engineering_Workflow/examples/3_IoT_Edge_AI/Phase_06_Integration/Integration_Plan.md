---
Document: Integration Plan — SentinelEdge
Document ID: INTPLAN-SENTINELEDGE-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Implementation, Integration); IEEE 828 (interface/configuration mgmt); IEC 61508 (functional safety of the advisory-only function — safety-relevant integration & HIL)
Status: Draft
Owner: Integration Lead
---

# SentinelEdge — Phase 06 Integration Plan

Plans how the implemented SentinelEdge components — node firmware, the embedded edge-AI model, the gateway, and the cloud fleet backend — are combined and proven into a working whole, so any break is traceable to the piece just added, and **freezes the interfaces**. Realises the ISO/IEC/IEEE 15288:2023 **Implementation** and **Integration** processes. Exit gate: **CDR** (per Conventions §3) — ICDs frozen, **product baseline** set.

Conforms in all IDs (`INC-*`/`ICD-*`/`REQ-*`/`TC-VER-*`/`RSK-*`/`HAZ-*`/`DEC-*`/`TPM-*`), the gate ladder, T/I/A/D methods, S1–S4 severity, and frontmatter to the Conventions (`../../../05_Conventions.md`); cross-referenced, never restated. Source of truth for what is integrated: [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) (REQ-*, intended blocks §13, decisions §13, modes §9) and [`../Phase_01_Concept/Concept.md`](../Phase_01_Concept/Concept.md) (SN-*, SCN-*, RSK-*, MOE-*).

> **Domain tailoring (per README + SysRS §1.2).** SentinelEdge is a **hybrid hardware / firmware / edge-AI / cloud** system with safety-relevant, battery-bound, physically-measured behaviour. Therefore **HIL is non-optional** (Conventions §1 tailoring note + skill step 8): every `REQ-P-*` (accuracy, latency, footprint, drift), `REQ-O-*` (battery life, offline, rollback), and `REQ-SAF-*` (advisory-only/fail-passive) needs a *physical* measurement on real node hardware, not analysis alone. The integration strategy is therefore **Hybrid** (top-down for cloud/OTA software, bottom-up for the node firmware/sensor/power hardware — skill strategy aid), and HIL rigs stand up in Increment 1. The heaviest integration threads — matching the Concept §9 risk register — are the **accuracy↔footprint↔latency↔battery quadrilemma** (RSK-01, RSK-05), **false-positive rate / alert fatigue** (RSK-02), **OTA rollout/rollback governance** (RSK-03, RSK-06), and the **advisory-only safety case** (RSK-04, HAZ-01).

> **Upstream-artifact status (skill input check — Phase 04/05 not yet authored).** Phase 04 `ICD.md`, `Architecture_Description.md`, `Tech_Stack_Rationale.md` and Phase 05 `Decision_Register.md` are **not yet authored** (`TODO: owed by Phase 04 / Phase 05`). This plan therefore **defines the ICD-NN interface inventory** (§5) from the SysRS interface seams (`REQ-INT-01`, `REQ-INT-02`, §6) plus the on-device/OTA seams implied by the SysRS §13 blocks, each traced to a `REQ-INT-*`/`REQ-SEC-*`/`REQ-F-*`. These ICD-NN IDs are **proposed here and adopted by Phase 04**; they are the seams frozen at this CDR (§9). The five strategic decisions are referenced by their SysRS §13 names (`DEC-01..DEC-05` / `DM-01..DM-05`); where a decision drives real-vs-stub (e.g. DEC-01 compute platform, DEC-02 model family, DEC-03 link tech, DEC-05 safety partitioning) it is flagged `TODO: confirm at Phase 05`. Quantitative thresholds remain named `TODO:` per SysRS §10 — no numbers are invented here.

---

## 1. Strategy

**Chosen: Hybrid — Incremental + CI/CD, top-down for cloud/OTA software, bottom-up for the node hardware/firmware, with HIL from Increment 1** (skill strategy aid; Conventions §1). One component group is brought online end-to-end at a time, automated on every commit against contract-test and HIL harnesses, with **selective top-down stubs** for the cloud-side counterparts a node-firmware increment needs before the cloud is real, and **bottom-up drivers** for the firmware/sensor/power layers the cloud and OTA logic depend on before real silicon is available.

**Rationale (decided on the dominant risk — skill step 2).** SentinelEdge has *both* a control-logic/software thread (cloud fleet backend, OTA governance, model lifecycle — top-down) *and* a hardware/long-pole thread (sensor front-end, MCU/NPU compute budget, battery/power, radio link — bottom-up). The dominant risks are split accordingly: the **edge-AI compute/accuracy/footprint quadrilemma** and **battery life** (RSK-01, RSK-05) are *hardware-and-firmware* risks that surface only on real silicon → **bottom-up + HIL early**; the **OTA rollout/rollback and drift governance** (RSK-03, RSK-06) and **advisory-only safety partitioning** (RSK-04) are *control-flow* risks that surface in software-state logic → **top-down with stubs**. Hybrid integration lets each surface the moment its component is added with a machine-decidable gate. **Big Bang is rejected** — it destroys fault isolation (the Boeing-787 late-integration failure mode; §8) and would hide whether an accuracy regression came from the model, the sensor front-end, or the power duty-cycle. **Pure Top-Down** is rejected (hardware/power is a genuine long pole; can't be stubbed forever). **Pure Bottom-Up** is rejected (the OTA/safety/drift control logic must be exercised early, not after all hardware lands).

**Lifecycle alignment (Concept §4).** Hybrid V-Model + Agile: the node-firmware/sensor/power/safety increments follow the **V-Model (Formal on safety/RAMS)** — each design level pairs with a HIL/bench test and carries IEC 61508 evidence and bidirectional traceability; the cloud backend, OTA pipeline, dashboards, and **edge-AI model lifecycle (train→eval→package→OTA)** follow **Agile (Formal V&V)** in 2-week sprints. The safety increments (advisory-only/fail-passive — INC-07) and edge-AI V&V increments (accuracy/drift/rollback — INC-04, INC-09) carry mandatory independent-V&V evidence and a two-reviewer merge rule. Increment durations below are anchored to the sprint/HIL cadence; the absolute schedule horizon is `TODO: owed by Phase 00 Agreement / Phase 01 Project_Development_Plan` (Concept §4).

**Tiers integrated** (from the SysRS §2 three-tier overview; full stack list `TODO: owed by Phase 04 Tech_Stack_Rationale`): **(a) Node firmware/edge** (sensor front-end, edge-AI inference runtime, power/duty-cycle, secure element/boot, link adapter), **(b) Edge-AI model lifecycle** (train/eval/quantize/package — produces the OTA model artifact), **(c) Gateway** (aggregation, buffering, WAN bridge), **(d) Cloud fleet backend** (device & model registry, analytics, alert routing, CMMS integration, OTA service). Each tier has its own CI/CD cadence (§6) — firmware ships `.bin`/OTA images on a slower V-cadence; cloud/model ship containers/OTA model packages on an Agile cadence (Conventions: do not force the worked example's tiers).

---

## 2. Increment Order — Dependency-Weight Ranking

Out-degree = how many other component groups depend on this one (skill step 3). **Most-depended-upon integrated earliest** so the highest-risk interactions surface while schedule remains to fix them. Blocks are the *intended top-level system blocks* named in SysRS §13.

| Component group (SysRS §13 block) | # dependents (out-degree) | Rank | Integrated in |
|---|---|---|---|
| **Secure Element + Identity/Boot** (REQ-SEC-01/02) | 8 — verified boot + attested identity gate every node function, every link, every OTA apply | 1 | INC-01 |
| **Sensor Front-End** (REQ-F-01) | 6 — edge-AI, power scheduler, safety supervisor, link, drift telemetry feed off raw signal | 2 | INC-02 |
| **Power Mgmt + Duty-Cycle Scheduler** (REQ-O-01) | 5 — gates *when* sensing/inference/link run; every node activity draws its energy budget | 3 | INC-02 |
| **Edge-AI Inference Engine** (REQ-F-01/02, REQ-P-01/02/03) | 5 — alerting, buffering, explainability, drift, OTA-model-apply all depend on the on-device model | 4 | INC-04 |
| **Safety Supervisor** (REQ-SAF-01/02, REQ-F-04; HAZ-01) | 4 — fail-passive/advisory-only constraint wraps every node state incl. Fault/Updating/Rollback | 5 | INC-03 |
| **Node Comms / Link Adapter** (REQ-INT-01) | 4 — gateway, OTA download, alert/evidence sync, telemetry all cross this seam | 6 | INC-05 |
| **Gateway** (REQ-INT-02) | 3 — cloud uplink, OTA relay, buffered-sync bridge | 7 | INC-05 |
| **OTA Update Manager** (REQ-F-06, REQ-O-03) | 3 — firmware *and* model rollout/canary/rollback into the fleet | 8 | INC-09 |
| **Cloud Fleet Backend + Model Registry** (REQ-F-05/07, REQ-INT-02) | 2 — alert routing/CMMS, registry feeds OTA + lineage | 9 | INC-06 |
| **Model Lifecycle / Drift + Lineage** (REQ-F-07, REQ-P-04, REQ-O-04) | 1 — consumes registry; produces drift alarms + lineage | 10 | INC-08 |

**Order rationale.** The **Secure Element + Identity/Boot** (RSK-06, supply-chain/spoofing) has the highest out-degree and the highest blast radius — nothing on the node may run, link, or accept an OTA without verified boot and attested identity — so it integrates **first** (INC-01), never last. The **Sensor Front-End + Power scheduler** integrate next because the Edge-AI Inference Engine cannot be exercised or its accuracy/footprint/latency/battery quadrilemma (RSK-01, RSK-05) measured without a real signal source and a real energy budget. UI/analytics-leaf consumers (drift/lineage) integrate last (lowest out-degree).

**Constraint-driven overrides (recorded per skill step 3 — two):**
1. The **Safety Supervisor (INC-03)** is integrated *before* the Edge-AI Inference Engine (INC-04) despite a lower out-degree, because the advisory-only/fail-passive constraint (REQ-SAF-01, HAZ-01) must be provably in place *before* any inference output exists that could be (mis)used to actuate the machine (RSK-04). Safety partitioning is a precondition for, not a consequence of, the model going live.
2. The **edge-AI model artifact** (tier b) has a **vendor/data lead-time dependency** — a labelled, representative fault dataset is owed (`TODO: dataset owed`, SysRS §14) and gates REQ-P-01. The Inference Engine integrates with a **placeholder baseline model** (driver) in INC-04 and is re-exercised with the qualified model when the dataset lands; this override is the only schedule-driven deferral and does not weaken fault isolation (the runtime/sensor/power seams are proven independently of model accuracy).

---

## 3. Increments (INC-NN)

Ten increments, derived from *this* project's component graph (Conventions: count is project-specific — not forced to the worked example's 9). Each exit criterion is machine-decidable (CI job, dashboard, or HIL rig). Verifying test cases are `TC-VER-TBD` until Phase 07 assigns IDs (SysRS §11) — referenced here by the REQ they will prove. "Zero S1" uses Conventions §5.1 severity. Numeric thresholds are the named `TODO:` targets from SysRS §10 (never invented).

### INC-01 — Secure boot + device-identity baseline (root of trust — RSK-06)
| Field | Value |
|---|---|
| Goal | A node powers on, performs verified/secure boot, attests a unique cryptographic identity from its secure element, and **refuses** an unsigned/tampered firmware image — the trust root every later seam depends on. |
| Components added | Secure Element + Identity/Boot (SysRS §13). |
| Entry criteria | Target MCU/NPU dev board available (DEC-01 — `TODO: confirm at Phase 05`); secure-element keys provisioned at manufacture; `ICD-05` (node↔gateway mTLS handshake) + `ICD-06` (OTA image signature/manifest) contracts agreed; HIL-1 rig stood up. |
| Exit criteria | REQ-SEC-01 verified (unique identity provisioned, key in secure element, attested before enrolment); REQ-SEC-02 verified (signed image boots; **unsigned/tampered image rejected** — signed-boot negative test); **zero S1**; two-reviewer merge (Formal). |
| Pass/Fail signal | Signed-boot negative-test suite = 100% reject + identity-attestation handshake green on HIL-1. |
| Duration | 2 sprints / HIL cycles (`TODO: absolute dates — Phase 00`). |
| Tools | HIL-1 (node bring-up rig), secure-boot negative-test harness, SBOM/provenance check (REQ-SEC-03). |

### INC-02 — Sensing + power/duty-cycle baseline (signal + energy substrate — RSK-05)
| Field | Value |
|---|---|
| Goal | The node samples vibration, acoustic, and temperature on a configurable duty cycle and the power scheduler holds the node within its energy budget across Monitoring / Low-Power Conserve modes (SysRS §9) — the physical substrate the model is measured against. |
| Components added | Sensor Front-End; Power Mgmt + Duty-Cycle Scheduler. |
| Entry criteria | INC-01 passed (booted, trusted node); `ICD-01` (Sensor Front-End → Edge-AI runtime, on-device) + `ICD-04` (Power/duty-cycle control) agreed; sensor signal-injection source on HIL-2; battery chemistry/link per DEC-03 (`TODO: confirm at Phase 05`). |
| Exit criteria | REQ-F-01 (sampling on configured duty cycle) demonstrated against injected signatures on HIL-2; REQ-O-01 service-free battery life on track — power-budget **analysis** + accelerated duty-cycle bench measures draw vs budget (MOP-10 → TPM-04, target `TODO: life_target`); REQ-O-02 offline sensing sustained ≥ `TODO: offline_target` h; **zero S1**. |
| Pass/Fail signal | Measured average current ≤ power budget on HIL-2 (TPM-04 margin ≥ 0) + duty-cycle waveform matches spec. |
| Duration | 3 sprints / HIL cycles. |
| Tools | HIL-2 (sensor-injection + power-profiling rig), calibrated source-meter, accelerated-life bench. |

### INC-03 — Safety Supervisor (advisory-only / fail-passive — RSK-04, HAZ-01)
| Field | Value |
|---|---|
| Goal | The node exposes **no** actuation path to the monitored machine, and loss/fault/compromise of SentinelEdge leaves the machine's own control/safety systems unaffected — fail-passive across every node state (Monitoring/Offline/Updating/Rollback/Fault, SysRS §9). |
| Components added | Safety Supervisor (SysRS §13; DEC-05 safety partitioning — `TODO: confirm at Phase 05`). |
| Entry criteria | INC-01 + INC-02 passed; HAZ-01 hazard analysis yields the IEC 61508 SIL target (`TODO: SIL_target`, SysRS §14); design + FMEA available; safety partitioning approach (DEC-05) decided. |
| Exit criteria | REQ-F-04 + REQ-SAF-01 verified by **design inspection + FMEA**: no actuation interface exists; fault injection (sensor/compute fault, comms loss) drives the node to **Fault → never actuate** (SysRS §9); REQ-SAF-02 mounting/LOTO procedure inspected/demonstrated (HAZ-01); IEC 61508 safety-case inspection record green; **zero S1**; independent-V&V sign-off (Formal). |
| Pass/Fail signal | FMEA shows no actuation path + fault-injection campaign on HIL-2 = 0 actuation events (MOE-07 = zero) + safety-case inspection accepted. |
| Duration | 3 sprints / HIL cycles. |
| Tools | HIL-2 (fault-injection), FMEA/safety-case toolset, LOTO procedure walkthrough, IEC 61508 inspection checklist. |

### INC-04 — Edge-AI Inference Engine + on-device alerting (core detect-and-warn — RSK-01, RSK-02; SCN-01)
| Field | Value |
|---|---|
| Goal | The node runs the embedded model over each evaluation window on real silicon, raises a maintenance alert **on-device with no live uplink** when anomaly score + predicted TTF cross thresholds, and holds the accuracy/latency/footprint budget. |
| Components added | Edge-AI Inference Engine (DEC-01 runtime + DEC-02 model family — `TODO: confirm at Phase 05`); on-device alert logic. |
| Entry criteria | INC-02 + INC-03 passed (real signal, energy budget, safety constraint in place); `ICD-01` (Sensor→runtime) frozen-candidate; **placeholder baseline model** loaded as a driver pending qualified dataset (`TODO: dataset owed`, override §2.2); held-out labelled validation set for scoring. |
| Exit criteria | REQ-F-01/F-02 verified — injected recorded fault signatures produce an on-device alert **with the uplink severed** (MOP-05 % detections with no live uplink); REQ-P-01 recall ≥ `TODO: recall_target` and FPR ≤ `TODO: fpr_target` on the validation set (MOP-01/02 → TPM-01/02); REQ-P-02 inference latency ≤ `TODO: lat_target` ms on target (MOP-03 → TPM-03); REQ-P-03 footprint ≤ `TODO: mem_target` flash / `TODO: ram_target` RAM (MOP-04 → TPM-05); **zero S1**; edge-AI V&V evidence recorded (Formal). |
| Pass/Fail signal | Confusion-matrix recall/FPR within threshold **and** on-target latency + footprint within budget on HIL-2 (TPM-01/02/03/05 margins ≥ 0), with uplink severed. |
| Duration | 4 sprints / HIL cycles (re-run on qualified model when dataset lands). |
| Tools | HIL-2 (signal injection + on-target latency/footprint profiling), model-scoring harness, on-device memory/latency profiler. |

### INC-05 — Node↔Gateway link + offline buffering (the edge-to-bridge seam — SCN-02)
| Field | Value |
|---|---|
| Goal | A node and gateway establish a mutually-authenticated, encrypted link; alerts/evidence/telemetry cross it; and when the uplink drops the node buffers locally and **syncs in chronological order** on reconnection with no detection lost. |
| Components added | Node Comms / Link Adapter; Gateway (aggregation, buffering, WAN bridge). |
| Entry criteria | INC-01 passed (mTLS identity exists); INC-04 passed (alerts exist to ship); `ICD-05` (node↔gateway mTLS + message schema) + `ICD-02` (gateway↔cloud) frozen-candidate; link technology per DEC-03 (`TODO: confirm at Phase 05`); network-attenuation injector on HIL-3. |
| Exit criteria | REQ-INT-01 verified (mutual-auth + encryption; published schema for alerts/evidence/telemetry/OTA); REQ-F-03 verified (uplink severed → buffer → ordered sync within `TODO: t_sync` s of restoration, MOP-06); REQ-O-02 offline operation ≥ `TODO: offline_target` h with no lost detection; **zero S1**. |
| Pass/Fail signal | Chaos: drop uplink for the offline window → 0 lost alerts + chronological-order sync verified + MOP-06 within threshold on HIL-3. |
| Duration | 3 sprints / HIL cycles. |
| Tools | HIL-3 (network-attenuation/outage injection), mTLS contract tests, schema-conformance (CBOR/Protobuf) validator. |

### INC-06 — Cloud Fleet Backend: alert routing + CMMS (SCN-01 end-to-end; top-down)
| Field | Value |
|---|---|
| Goal | The cloud receives an alert via the gateway, routes it to the operator dashboard and the configured CMMS creating/proposing a work order, and registers the device + assigned model in the registry. |
| Components added | Cloud Fleet Backend (device & model registry, alert routing, dashboard, CMMS integration). |
| Entry criteria | INC-05 passed (alerts reach the cloud); `ICD-02` (gateway↔cloud) + `ICD-03` (cloud↔CMMS) agreed; CMMS sandbox available. |
| Exit criteria | REQ-F-05 verified (alert routed to dashboard + CMMS, work order created/proposed within `TODO: t_route` s of receipt); REQ-INT-02 verified (authenticated TLS 1.3 channel; alert/telemetry/registry-sync/OTA endpoints; documented CMMS interface); REQ-U-02 dashboard usability-review inspected (alert shows asset/severity/TTF/confidence/explanation); **zero S1**. |
| Pass/Fail signal | End-to-end SCN-01 green (injected fault on HIL → work order in CMMS sandbox) within MOP route latency. |
| Duration | 3 sprints. |
| Tools | Cloud staging env, CMMS sandbox + Pact contract tests, dashboard a11y/usability review. |

### INC-07 — Explainability + lineage retention (audit/trust — SN-09)
| Field | Value |
|---|---|
| Goal | Each raised alert retains an explanation of contributing signal features plus the model-version and training-data lineage identifier that produced it, retrievable for audit. |
| Components added | Explainability + lineage capture (node-side reference + cloud-side store, per SysRS §15 conflict resolution: heavy lineage stored cloud-side, node keeps only a reference). |
| Entry criteria | INC-04 + INC-06 passed; `ICD-07` (alert→explanation/lineage record) agreed; model registry holds version + dataset-lineage IDs. |
| Exit criteria | REQ-F-07 verified (explanation + model-version + lineage ID retained per alert — **inspection**); REQ-O-04 verified (records retained ≥ `TODO: retention_target` years, retrievable); REQ-U-02 explanation comprehensible to a reliability engineer (usability review); **zero S1**. |
| Pass/Fail signal | 100% of sampled alerts carry a resolvable explanation + model-version + lineage ID; retention/retrieval check pass. |
| Duration | 2 sprints. |
| Tools | Lineage-store contract tests, explanation-presence audit job, retention-retrieval verifier. |

### INC-08 — Model Lifecycle: drift detection + lineage pipeline (RSK-03; STK-05)
| Field | Value |
|---|---|
| Goal | The model-management subsystem detects field accuracy drift beyond the baseline and raises a drift alarm to the fleet team, with the train→eval→package pipeline producing a signed, lineage-stamped model artifact. |
| Components added | Model Lifecycle / Drift + Lineage (train/eval/quantize/package → OTA model artifact). |
| Entry criteria | INC-06 + INC-07 passed (registry + lineage exist); `ICD-08` (drift-telemetry → model-management) agreed; drift baseline established from INC-04 deployment. |
| Exit criteria | REQ-P-04 verified (drift exceeding `TODO: drift_target` vs baseline → drift alarm to STK-05, MOP-09 sensitivity/latency); model-package pipeline emits a **signed** artifact with lineage stamp (feeds INC-09); **zero S1**; edge-AI V&V evidence (Formal). |
| Pass/Fail signal | Seeded drift scenario → alarm raised within MOP-09 latency; produced model artifact signature + lineage verify. |
| Duration | 3 sprints. |
| Tools | Drift-injection dataset harness, model-training/eval CI, signing pipeline (PKI), SBOM emit. |

### INC-09 — OTA Update Manager: signed rollout + canary + automatic rollback (RSK-03, RSK-06; SCN-03)
| Field | Value |
|---|---|
| Goal | A signed OTA update of firmware **and/or** the embedded model is delivered to a targeted cohort, staged through a canary, monitored on live accuracy/FPR telemetry, and **automatically rolled back** to the last known-good version on a failed cohort health check — with no node left non-functional. |
| Components added | OTA Update Manager (signing, cohort targeting, canary health-check, rollback orchestration). |
| Entry criteria | INC-01 (signed-boot/verify), INC-05 (link/relay), INC-06 (registry/telemetry), INC-08 (signed artifact) passed; `ICD-06` (OTA image signature/manifest) + `ICD-09` (canary health/telemetry feedback) frozen-candidate; OTA governance per DEC-04 (`TODO: confirm at Phase 05`); HIL-4 fleet emulator (multiple nodes). |
| Exit criteria | REQ-F-06 + REQ-O-03 verified — staged cohort rollout; **forced-failure** of the canary health check triggers automatic rollback to last known-good within `TODO: rollback_target`, **0 bricked/non-functional nodes** (MOP-07 fleet reach incl. rollback); REQ-SEC-02 re-verified (only signed images apply); **zero S1**; two-reviewer merge (Formal). |
| Pass/Fail signal | On HIL-4 fleet: canary forced to fail → 100% of cohort rolled back to known-good, 0 bricked nodes, within rollback target (MOP-07). |
| Duration | 4 sprints / HIL cycles. |
| Tools | HIL-4 (multi-node fleet emulator), OTA canary harness, signed-image negative test, telemetry-driven rollback automation. |

### INC-10 — Install/commission + decommission lifecycle hardening (SCN-04, SCN-05; SN-08, SN-12)
| Field | Value |
|---|---|
| Goal | A technician installs and commissions a node safely to identity attestation via a guided flow, and at end of life the node's identity is revoked and keys/buffered data/model are irrecoverably sanitized — the Commissioning and Decommissioning modes (SysRS §9) proven end-to-end. |
| Components added | Commissioning flow (guided handheld), Decommissioning/sanitization path; cross-cutting hardening across INC-01..INC-09. |
| Entry criteria | INC-01..INC-09 passed; `ICD-10` (commissioning/handheld → node pairing) agreed; LOTO procedure (REQ-SAF-02) validated in INC-03. |
| Exit criteria | REQ-U-01 verified (mount/power/pair/commission to attestation ≤ `TODO: t_commission` min via guided flow, MOP-08 — **demonstration**); REQ-SAF-02 install/service clear of rotating parts + LOTO-compatible; REQ-SEC-04 verified (identity revoked + keys/buffered data/model sanitized per NIST SP 800-88 Rev. 1, irrecoverable); REQ-D-02 RoHS/WEEE + battery disposal conformity evidence retained; **zero S1**. |
| Pass/Fail signal | Commission demo ≤ MOP-08 time + post-sanitization forensic read = 0 recoverable keys/data/model + disposal record complete. |
| Duration | 2 sprints / HIL cycles. |
| Tools | HIL-1 (commission/attestation), sanitization-verification forensic harness, guided-flow usability demo. |

> **Per-increment exit invariant (all INC-NN):** entry = all dependent increments passed + the increment's `ICD-NN` agreed (frozen-candidate); exit = its REQ verified to the stated MOP/TPM threshold, **zero open S1** (Conventions §5.1), and for the Formal increments (INC-01, INC-03, INC-04, INC-08, INC-09 — safety/RAMS + edge-AI V&V) the independent-V&V/safety-case evidence and two-reviewer merge recorded (Concept §4, Conventions §8 bidirectional traceability).

---

## 4. Dependency Map (Data / Control / Temporal / Resource)

Out-degree drives §2 ordering; here each **edge** is classified by the four reliance types (skill step 5). This is distinct from the **interface taxonomy** in §5 — a dependency is a reliance between *components*; an interface is a *boundary contract*. The node is the most coupled tier: signal flows **Data**, the safety supervisor and power scheduler gate behaviour **Control**, boot ordering is **Temporal**, and the MCU/NPU/radio/battery are shared finite **Resources**.

```
                 INC-01 Secure Boot + Identity (root of trust)
                       │ (Temporal: must boot+attest before anything runs)
          ┌────────────┼─────────────────────────────┐
          ▼            ▼                               ▼
   INC-02 Sensor    INC-03 Safety Supervisor      (every link + OTA apply
   + Power            (Control: fail-passive         is gated by verified
          │            wraps every state)            boot — INC-01)
          │ (Data: raw signal; Resource: energy budget)
          ▼
   INC-04 Edge-AI Inference Engine ──────────────┐
          │ (Data: anomaly score + TTF)          │ (Control: Safety Supervisor
          ▼                                       │  gates any output use)
   INC-05 Link Adapter + Gateway                  │
          │ (Data: alerts/evidence/telemetry;     │
          │  Resource: shared radio bandwidth)    │
          ▼                                       │
   INC-06 Cloud Fleet Backend + Registry          │
     ┌────┼───────────────┬──────────────┐        │
     ▼    ▼               ▼              ▼         │
  INC-07 INC-08 Drift   INC-09 OTA    (CMMS/      │
 Explain/  + Lineage    Mgr (canary/   dashboard) │
 Lineage   (Data)       rollback)                 │
     │       │ (Data: signed model artifact)      │
     │       ▼                                     │
     │   INC-09 OTA ◀── signed artifact            │
     └───────┴─────────────┬───────────────────────┘
                           ▼
        INC-10 Commission / Decommission (Temporal + Control)
```

| Edge (depends-on) | Type | Why |
|---|---|---|
| Everything on the node → **Secure Boot + Identity** (INC-01) | **Temporal** | Verified boot + identity attestation must complete before any sensing, inference, link, or OTA-apply runs (REQ-SEC-01/02). |
| Edge-AI / Link / OTA-apply → **Safety Supervisor** (INC-03) | **Control** | The fail-passive/advisory-only constraint gates whether any model output may leave the node toward anything machine-facing (REQ-SAF-01, REQ-F-04; HAZ-01). |
| Edge-AI Inference Engine ← **Sensor Front-End** (INC-02) | **Data** | The model consumes the sampled vibration/acoustic/temperature window (REQ-F-01). |
| Sensor / Inference / Link → **Power + Duty-Cycle Scheduler** (INC-02) | **Control + Resource** | The scheduler gates *when* each runs (Control) and they all draw the shared, finite battery energy budget (Resource) — RSK-05 (REQ-O-01). |
| Sensor / Inference / Link / Compute → **MCU/NPU + radio + battery** | **Resource** | Shared finite compute, memory footprint, radio bandwidth, and power rail — the heart of the accuracy↔footprint↔latency↔battery quadrilemma (RSK-01; REQ-P-01/02/03, REQ-O-01). |
| Gateway / Cloud ← **Link Adapter** (INC-05) | **Data** | Alerts, evidence, telemetry, and OTA payloads cross this seam (REQ-INT-01, REQ-F-03). |
| Cloud routing/CMMS ← **alerts** from node via gateway | **Data** | Alert payloads consumed and routed to dashboard + CMMS (REQ-F-05, REQ-INT-02). |
| OTA Update Manager ← **signed model artifact** (INC-08) | **Data** | The OTA cohort rollout consumes the signed, lineage-stamped model package (REQ-F-06). |
| OTA apply (INC-09) → **verified-boot signature check** (INC-01) | **Control** | Only a signature-verifying image may apply; health-check state gates apply-vs-rollback (REQ-SEC-02, REQ-O-03). |
| Drift detection ← **field accuracy telemetry** | **Data** | Drift subsystem consumes live accuracy telemetry vs deployment baseline to alarm (REQ-P-04, RSK-03). |
| Offline buffer → **reconnection event** | **Temporal** | Buffered alerts may only sync in order *after* connectivity restoration (REQ-F-03; SCN-02). |
| Decommission (INC-10) → **identity revocation before sanitize** | **Temporal + Control** | Identity must be revoked, then keys/data/model sanitized; order matters (REQ-SEC-04; SCN-05). |

---

## 5. Interfaces & Stubs / Drivers / Mocks Coverage

**Every interface seam mapped once** (skill step 6, no-skipped-seams rule). Each row is tagged by **interface type** — **HW** (connectors, voltage levels, signal types — node sensor/power/MCU boundaries), **SW-API** (APIs, data formats, protocols), or **HMI** (human-facing — handheld commissioning, operator dashboard). The placeholder is a **stub** (top-down, simulates what's *below/external*: cloud/CMMS for a node-side increment), a **driver** (bottom-up, simulates what's *above*: firmware/sensor/model for a cloud/OTA increment), or a **mock** (peer-to-peer), with the tool and the increment that replaces it with the real counterpart. Mocks/contracts are **generated from / contract-tested against** the ICD where a schema exists (Protobuf/CBOR/OpenAPI, OTA manifest, SCIM-free) and run in CI.

> **ICD provenance.** These `ICD-NN` are **defined here** and adopted by Phase 04 `ICD.md` (`TODO: Phase 04 to author and freeze`). They align with the seams the README names (node↔gateway mTLS, gateway↔cloud, OTA channel) and the SysRS §6 interface requirements (REQ-INT-01/02). Each traces to a SysRS REQ and an SN. They are the seams frozen at this CDR (§9).

| ICD-NN | Type | Seam (A ↔ B) | Traces to | Placeholder | Tool | Replaced in |
|---|---|---|---|---|---|---|
| **ICD-01** | SW-API (on-device) | Sensor Front-End ↔ Edge-AI Inference runtime (sample-window buffer API) | REQ-F-01, REQ-P-02, SN-03 | **Mock** (peer) | Recorded-signature injector + contract test | INC-04 (real sensor→runtime) |
| **ICD-02** | SW-API | Gateway ↔ Cloud Fleet Backend (TLS 1.3: alert/telemetry/registry-sync/OTA endpoints) | REQ-INT-02, SN-07, SN-11 | **Stub** (cloud) then **Driver** (gateway) | Mock cloud endpoint (Prism/WireMock) + Pact | INC-06 (real cloud); gateway real in INC-05 |
| **ICD-03** | SW-API | Cloud Fleet Backend ↔ CMMS (work-order create/propose) | REQ-F-05, REQ-INT-02, SN-11 | **Stub** (CMMS) | CMMS sandbox + WireMock | INC-06 → prod CMMS |
| **ICD-04** | HW | Power Mgmt/Duty-Cycle ↔ Sensor + MCU/NPU (power rail, wake-on-event, clock gating) | REQ-O-01, REQ-F-01, SN-05 | **Driver** (load/power emulation) | HIL-2 power-profiling rig + source-meter | INC-02 (real silicon) |
| **ICD-05** | SW-API + HW | Node Comms/Link Adapter ↔ Gateway (mutually-authenticated encrypted short-range/wired link + message schema) | REQ-INT-01, SN-07 | **Mock** (peer) then **Driver** (node) | Link emulator + mTLS contract test + schema validator | INC-05 (real link); node driver from INC-01 |
| **ICD-06** | SW-API | OTA Update Manager ↔ Node loader (signed firmware+model image: signature/manifest) | REQ-F-06, REQ-SEC-02, SN-04, SN-10 | **Driver** (node loader) then real | Signed-image negative-test harness + manifest validator | INC-01 (verify), INC-09 (full rollout) |
| **ICD-07** | SW-API | Edge-AI alert ↔ Explainability/Lineage record (explanation + model-version + lineage ID) | REQ-F-07, REQ-O-04, SN-09 | **Mock** (peer) | Lineage-store contract test + explanation-presence audit | INC-07 (real lineage store) |
| **ICD-08** | SW-API | Field accuracy telemetry ↔ Model Lifecycle/Drift subsystem (drift-baseline + alarm) | REQ-P-04, SN-09 | **Stub** (telemetry feed) | Drift-injection dataset harness | INC-08 (real telemetry pipeline) |
| **ICD-09** | SW-API | OTA canary health/telemetry ↔ OTA rollback orchestration (cohort health feedback) | REQ-O-03, REQ-F-06, SN-10 | **Driver** (fleet telemetry) | HIL-4 fleet emulator + canary harness | INC-09 (real cohort telemetry) |
| **ICD-10** | HMI | Commissioning handheld/mobile ↔ Node (guided pairing + identity attestation) | REQ-U-01, REQ-SEC-01, SN-08 | **Stub** (node attestation) then real | Handheld guided-flow simulator + attestation stub | INC-10 (real node pairing) |

**Coverage self-check.** 10 seams defined ⇒ 10 rows; every row tags type (HW / SW-API / HMI), names a stub/driver/mock + tool, and a replacement increment. No seam unmapped. The three README-named seams are covered: **node↔gateway mTLS → ICD-05**, **gateway↔cloud → ICD-02**, **OTA channel → ICD-06** (+ ICD-09 canary feedback). *When Phase 04 authors `ICD.md`, re-run the skill's coverage-check prompt against the frozen inventory and reconcile any added/removed seam via a `CR-NN` (Phase 09).*

---

## 6. CI/CD Pipelines (per tier)

Split **per tier** — firmware ships on a slower V-Model/HIL cadence; the edge-AI model, cloud, and OTA artifacts ship on an Agile cadence (not one mega-pipeline; avoids the "everything blocked on the slowest pipeline" pitfall). Every tier pins **categories** from the canonical CI/CD + static-scan tool table owned by the Phase 06 stage skill (`se-phase-06-integration/SKILL.md` → "Canonical CI/CD + static-scan tool table"); specific tools confirmed below. Phase 07 references that table rather than re-listing it. Trunk-based with protected `main`; green checks required; **two reviewers on the Formal paths** (Secure boot/identity, Safety Supervisor, edge-AI V&V, OTA/rollback — INC-01/03/04/08/09).

| Tier | Source / branch | Artifact | Ordered stages (gate at each) | Deploy target | Rollout / rollback |
|---|---|---|---|---|---|
| **Node firmware** | trunk / `main` | signed `.bin` / OTA firmware image | build (cross-compile) → unit (Unity/Ceedling/GoogleTest) → static analysis (**clang-tidy + cppcheck/Coverity**, MISRA where DEC-05 requires) → **HIL smoke** (CI agent tagged `hil-*` driving HIL-1/2) → SAST/secret scan → **SCA/SBOM** (`syft` SBOM, Grype CVE) → sign + publish OTA image | lab/HIL → staging fleet → pilot cohort → prod fleet | Staged OTA cohort + **automatic rollback** to last known-good (REQ-O-03; canary on HIL-4) |
| **Edge-AI model** | trunk / `main` | signed, lineage-stamped model package | data-version check → train → **eval on held-out set** (recall/FPR gate, REQ-P-01) → quantize/prune → **on-target footprint+latency gate** (REQ-P-02/03 on HIL-2) → drift-baseline stamp → sign + lineage → publish model package | model registry → canary cohort → fleet (via OTA) | Canary accuracy/FPR telemetry → expand or **rollback** (SCN-03; INC-09) |
| **Cloud fleet backend** | trunk / `main` | container image | build → unit (PyTest/JUnit) → integration+contract (Testcontainers, Pact, Schemathesis vs CMMS) → **SAST** (Semgrep + CodeQL) → **SCA/SBOM** (Trivy + Grype, `syft`) → publish | dev → staging → pre-prod → prod | Argo CD staged cohorts; auto-rollback on metric regression |
| **Gateway** | trunk / `main` | `.deb` / container image | build → unit → integration (link↔cloud bridge, Testcontainers) → SAST → SCA/SBOM → publish | lab → staging gateway → pilot → prod | Staged per-site; health-check auto-revert |

**Cross-tier scheduled gates:**

| Gate | Trigger | Tool | Failure action |
|---|---|---|---|
| **Edge-AI accuracy/footprint regression** | every model commit + nightly | Eval harness (recall/FPR → TPM-01/02) + on-target profiler (latency/footprint → TPM-03/05) on HIL-2 | Block model publish if any TPM regressed below threshold. |
| **HIL smoke (node bring-up + sensing)** | per firmware increment | CI agent tagged `hil-*` driving HIL-1/HIL-2 | Block firmware merge on boot/identity/sensing regression. |
| **OTA canary + forced-rollback** | pre-release (model/firmware) | HIL-4 fleet emulator + canary harness (MOP-07; REQ-O-03) | Block fleet rollout if rollback fails or any node bricks. |
| **Signed-boot / signed-OTA negative test** | every firmware/OTA commit | Signed-image negative-test harness (REQ-SEC-02) | Block on any unsigned/tampered image accepted. |
| **Battery/power-budget** | pre-release | HIL-2 power-profiling vs budget (MOP-10 → TPM-04) | Block firmware release if battery-life margin negative. |
| **SBOM / supply-chain** | every commit (all tiers) | `syft` (SBOM, SPDX/CycloneDX) + Grype/Trivy (CVE) | Block on critical CVE; emit SBOM (REQ-SEC-03; feeds Security thread, ISO 27001 / NIST 800-53). |
| **Safety-case / FMEA inspection** | per safety-relevant change | IEC 61508 inspection checklist + FMEA review (REQ-SAF-01) | Block merge on any new actuation path or open S1 hazard (HAZ-01). |

> **Static-scan stack (SAST + SCA + secrets), pinned:** Semgrep + CodeQL (cloud/gateway SAST); **clang-tidy + cppcheck (+ Coverity / MISRA checker where DEC-05's SIL target requires)** for firmware C/C++; `syft` (SBOM, SPDX/CycloneDX) + Grype + Trivy (SCA/CVE across all tiers); gitleaks (secret scanning). Critical findings **block the PR/merge** (Conventions: SAST/SCA stages mandatory at CDR). The SBOM stage is the supply-chain evidence for REQ-SEC-03.

---

## 7. HIL Rigs

**HIL is required, not tailored out** — SentinelEdge has hardware, a battery, sensors, an on-device model, and safety-relevant behaviour, so the physically-measured REQs cannot be proven by analysis alone (skill step 8; SysRS §11). Four rigs cover the measurement-bearing `REQ-P-*` / `REQ-O-*` / `REQ-SAF-*`. Each runs on a CI agent tagged `hil-*` so pipeline jobs (§6) target it. **Stood up in INC-01/INC-02, not near launch** (avoids the "HIL only used near launch" pitfall). Safety-relevant rigor is anchored to **IEC 61508** at the SIL determined by HAZ-01 (`TODO: SIL_target`).

### HIL-1 — Node Bring-up & Secure-Identity Rig (RSK-06)
| Field | Value |
|---|---|
| DUT | Target MCU/NPU node board + secure element. |
| Stimuli | Power cycling; crafted signed/unsigned/tampered firmware images; identity-attestation challenges. |
| Measurement | Boot-verify pass/fail; signed-boot negative-test reject rate (target 100%); attestation handshake success. |
| Automation | Python rig + JTAG/SWD debugger + signed-image harness, gated in CI (`hil-*`). |
| REQs covered | REQ-SEC-01, REQ-SEC-02; supports REQ-SEC-04 (sanitization verify, INC-10). |
| Safety rigor | IEC 61508 SIL `TODO: SIL_target` (security-of-safety supply chain). |
| Target coverage | 100% of secure-boot/identity REQs. |
| Stood up in | INC-01 (regressed every firmware increment). |

### HIL-2 — Sensor-Injection, Inference & Power-Profiling Rig (RSK-01, RSK-05, RSK-04)
| Field | Value |
|---|---|
| DUT | Node board running sensor front-end + edge-AI runtime + power scheduler + safety supervisor. |
| Stimuli | Recorded/replayed vibration/acoustic/temperature fault signatures; fault-injection (sensor/compute fault, comms loss); duty-cycle profiles. |
| Measurement | On-target recall/FPR (→ TPM-01/02); inference latency (→ TPM-03); flash+RAM footprint (→ TPM-05); average current vs power budget (→ TPM-04); **actuation-event count (target 0 — MOE-07)**. |
| Automation | Python rig + signal generator/replayer + calibrated source-meter + on-target profiler + accelerated-life bench. |
| REQs covered | REQ-F-01, REQ-P-01, REQ-P-02, REQ-P-03, REQ-O-01, REQ-O-02, REQ-F-04, REQ-SAF-01. |
| Safety rigor | IEC 61508 SIL `TODO: SIL_target` (fail-passive fault-injection campaign for REQ-SAF-01). |
| Target coverage | 100% of on-device performance + battery + advisory-only-safety REQs. |
| Stood up in | INC-02 (sensing/power), extended in INC-03 (safety fault-injection) + INC-04 (model). |

### HIL-3 — Link & Offline-Resilience Rig (SCN-02)
| Field | Value |
|---|---|
| DUT | Node Link Adapter ↔ Gateway over the real radio/wired link. |
| Stimuli | Network attenuation/outage injection; uplink severance for the offline window; reconnection events. |
| Measurement | mTLS handshake success; 0 lost alerts; chronological-order sync; buffered-sync latency (MOP-06); offline endurance (REQ-O-02). |
| Automation | Network-attenuation injector + link emulator + schema-conformance validator (`hil-*`). |
| REQs covered | REQ-INT-01, REQ-F-03, REQ-O-02. |
| Safety rigor | n-a (no actuation path; advisory-only). |
| Target coverage | 100% of link + offline-buffering REQs. |
| Stood up in | INC-05. |

### HIL-4 — Fleet/OTA Canary & Rollback Rig (RSK-03, RSK-06; SCN-03)
| Field | Value |
|---|---|
| DUT | Multi-node fleet emulator (≥ `TODO: cohort_size` nodes) + OTA Update Manager + gateway + cloud staging. |
| Stimuli | Signed OTA firmware/model packages; **forced canary health-check failure**; tampered/unsigned image injection. |
| Measurement | Fleet update reach incl. rollback (MOP-07); rollback latency vs `TODO: rollback_target`; **0 bricked/non-functional nodes**; tampered-image reject rate (REQ-SEC-02). |
| Automation | Fleet emulator + canary harness + telemetry-driven rollback automation (`hil-*`). |
| REQs covered | REQ-F-06, REQ-O-03, REQ-SEC-02 (apply-time). |
| Safety rigor | IEC 61508 SIL `TODO: SIL_target` (a bad update must never persist or brick — RSK-06). |
| Target coverage | 100% of OTA rollout/rollback REQs. |
| Stood up in | INC-09. |

**Coverage target:** every `REQ-P-*`, `REQ-O-*`, and `REQ-SAF-*` requiring physical measurement is bound to a HIL rig (REQ-P-01/02/03 + REQ-O-01/02 → HIL-2; REQ-F-03/REQ-O-02 → HIL-3; REQ-F-06/REQ-O-03 → HIL-4; REQ-SAF-01 → HIL-2; REQ-SEC-01/02 → HIL-1/HIL-4). Target = 100% of measurement-bearing performance/reliability/safety REQs covered by a rig (`TODO: confirm % once Phase 07 finalises T/I/A/D methods — SysRS §11`).

---

## 8. Integration Risks & Mitigations

Pre-empting the **Boeing-787 late-integration failure mode** (skill §8; mismatched data standard at an interface, a vendor component that won't meet its ICD, a big-bang seam, a HIL rig deferred to launch) and carrying the Concept §9 risks into integration. Logged/reviewed at CDR; full register `TODO: owed by _cross_cutting/Risk_Opportunity_Register.md`.

| Risk | Integration failure it would cause | Pre-emptive action | ICD/INC |
|---|---|---|---|
| **RSK-01** Accuracy vs node compute/memory budget | Model meets accuracy in the lab but blows the footprint/latency budget on real silicon, found late | On-target footprint+latency gate on **HIL-2 every model commit** (TPM-03/05); two-stage fallback (edge screen + gateway confirm) held as a DEC-02 option; measure before INC-04 exit. | ICD-01 / INC-04 |
| **RSK-02** False-positive rate / alert fatigue | Field FPR drifts above trust threshold; users stop acting | FPR gated on HIL-2 eval (TPM-02); confidence-gated alerts; per-asset baselining in commissioning (INC-10); drift alarm (INC-08). | ICD-01/ICD-08 / INC-04/INC-08 |
| **RSK-03** Silent model drift | Accuracy degrades in the field unnoticed → late OTA scramble | Drift telemetry + alarm gated in INC-08 (MOP-09); scheduled retraining via OTA (SCN-03); canary catches regressions before fleet-wide (INC-09). | ICD-08/ICD-09 / INC-08/INC-09 |
| **RSK-04** Prediction (mis)used to actuate the machine | A late-added output path creates a functional-safety hazard | Safety Supervisor integrated **before** the model (override §2.1); FMEA proves **no actuation path** (INC-03); fail-passive fault-injection on HIL-2; IEC 61508 safety case gates merge. | (no actuation ICD by design) / INC-03 |
| **RSK-05** Battery-life shortfall | Real duty cycle + harsh temperature drains battery below multi-year target, found at pilot | Power-budget gate on **HIL-2** (TPM-04) from INC-02; accelerated duty-cycle bench; aggressive duty-cycling + wake-on-event in the scheduler. | ICD-04 / INC-02 |
| **RSK-06** Spoofed device / unsigned OTA | A tampered image or rogue node enters the fleet | Verified boot + attested identity as the **first** increment (INC-01); signed-image negative test every commit; OTA applies only signed images + automatic rollback on HIL-4 (INC-09). | ICD-05/ICD-06 / INC-01/INC-09 |
| **RSK-07** Recoverable data on retired devices | Decommissioned node leaks keys/data/model or non-compliant battery disposal | NIST SP 800-88 sanitization + identity revocation verified forensically (INC-10); RoHS/WEEE disposal route + retained conformity evidence (REQ-D-02). | ICD-10 / INC-10 |
| **INT-mismatch** (generic Boeing-787) | Two tiers agree on incompatible message/manifest formats | **Single ICD baseline frozen at CDR** (§9); post-CDR changes only via `CR-NN`; mocks generated from the ICD schema (Protobuf/CBOR/OTA manifest) and contract-tested in CI — no hand-rolled drift. | all ICD-NN |
| **HIL-deferred** | Hardware/power/safety bugs surface only at pilot | HIL-1/HIL-2 stood up in INC-01/INC-02, not near launch; every firmware/model increment regresses on HIL. | §7 |

> Upside carried (Concept §9): **OPP-01** — the fleet-wide training data + the proven edge-detection rigs become a defensible analytics/benchmarking product for STK-08.

---

## 9. CDR Readiness

Freezing the ICDs here establishes the **product baseline** (Conventions §3). After CDR, any interface change routes through a `CR-NN` (Phase 09; IEEE 828).

### 9.1 ICDs to freeze at this CDR
All 10 seams from §5, each set to `Status: Baseline (CDR-approved YYYY-MM-DD)` in Phase 04 `ICD.md`:

`ICD-01` (Sensor↔Edge-AI runtime) · `ICD-02` (Gateway↔Cloud) · `ICD-03` (Cloud↔CMMS) · `ICD-04` (Power↔Sensor/MCU, HW) · `ICD-05` (Node↔Gateway mTLS link) · `ICD-06` (OTA image signature/manifest) · `ICD-07` (Alert↔Explanation/Lineage) · `ICD-08` (Drift telemetry↔Model Lifecycle) · `ICD-09` (OTA canary health↔Rollback) · `ICD-10` (Commissioning handheld↔Node, HMI).

> **CDR blocker (must clear first):** Phase 04 `ICD.md` / `Architecture_Description.md` / `Tech_Stack_Rationale.md` and Phase 05 `Decision_Register.md` are not yet authored. `TODO:` Phase 04 must author + freeze these 10 ICDs; Phase 05 must close `DEC-01..DEC-05` — especially **DEC-01** (compute platform/runtime) and **DEC-02** (model family) which gate INC-04's footprint/accuracy, **DEC-03** (power/link) which gates INC-02/INC-05, **DEC-04** (OTA governance) which gates INC-09, and **DEC-05** (safety partitioning) which gates INC-03 — **before CDR can pass**.

### 9.2 HIL coverage vs target

| Rig | Target | Status |
|---|---|---|
| HIL-1 (boot/identity) | 100% of secure-boot/identity REQs | `TODO: measure` |
| HIL-2 (sensing/inference/power/safety) | TPM-01/02/03/04/05 within threshold; MOE-07 actuation = 0 | `TODO: targets owed (recall/FPR/latency/footprint/battery — SysRS §10)` |
| HIL-3 (link/offline) | 0 lost alerts + MOP-06 within threshold | `TODO: measure` |
| HIL-4 (OTA canary/rollback) | MOP-07 reach incl. rollback; 0 bricked nodes | `TODO: cohort_size + rollback_target owed` |

### 9.3 Open risks / TPM margins / hazards at CDR

| Item | At CDR |
|---|---|
| Critical/High open RSK | RSK-01, RSK-02 must be **mitigation-in-place + evidence green on HIL-2** (TPM-01/02/03/05 margins ≥ 0); RSK-05 green on HIL-2 power budget (TPM-04); RSK-03/06 gated by HIL-4 OTA/rollback; RSK-04 cleared by INC-03 safety case before CDR. |
| Open S1 defects | Must be **zero** (Conventions §5.1) — each increment's exit enforces it. |
| Hazards (HAZ-01) | **Advisory-only/fail-passive must be evidenced** (FMEA = no actuation path; HIL-2 fault-injection = 0 actuation events; IEC 61508 safety-case inspection accepted) before CDR clears. `TODO: SIL_target` from HAZ-01 must be set (SysRS §14). |
| TPM margins | TPM-01 (accuracy), TPM-02 (FPR), TPM-03 (latency), TPM-04 (battery), TPM-05 (footprint) — current values `TODO` (SysRS §10); margins reported at CDR from HIL-2 results. |

### 9.4 CDR exit-gate checklist (Conventions §3; skill exit gate)

- [x] Integration strategy chosen and justified against the dominant risk (Hybrid: incremental+CI, top-down cloud/OTA + bottom-up node, HIL early; §1).
- [x] Increments ordered by **dependency weight** (ranking recorded; two overrides explained — §2).
- [x] Increments (`INC-01..INC-10`) defined — count derived from this project — each with observable entry/exit, Pass/Fail signal, duration (§3).
- [x] Every dependency edge classified **Data / Control / Temporal / Resource** (§4).
- [x] **Every `ICD-NN` (10) appears exactly once** in the stubs/drivers/mocks table, tagged **HW / SW-API / HMI**, with a replacement increment (§5).
- [x] CI/CD defined **per tier** (firmware / edge-AI model / cloud / gateway), referencing the canonical tool table; **SAST + SCA/SBOM** stages present (§6).
- [x] **HIL rig exists for every `REQ-P/O/SAF-*`** needing physical measurement; safety rigor anchored to IEC 61508 (§7).
- [ ] All 10 `ICD-NN` frozen → `Baseline (CDR-approved <date>)`; **product baseline** set — **TODO: blocked on Phase 04 `ICD.md`** (§9.1).
- [ ] `DEC-01..DEC-05` closed (DEC-01/02 gate INC-04; DEC-03 INC-02/05; DEC-04 INC-09; DEC-05 INC-03) — **TODO: blocked on Phase 05 `Decision_Register.md`**.
- [ ] No open **S1**, critical `RSK-NN`, or critical `HAZ-01`; `TPM-*` margins reported — **TODO: measure on HIL rigs** (§9.2–9.3).

**CDR recommendation:** **Proceed-with-actions** — the integration strategy, dependency-weight order, dependency classification, full ICD inventory, per-tier CI/CD, and HIL rig design are complete and convention-compliant. CDR sign-off is **held** on three named upstream actions: (1) Phase 04 authors and freezes the 10 `ICD-NN` and the architecture/tech-stack; (2) Phase 05 closes `DEC-01..DEC-05` (esp. DEC-01/02 model platform/family, DEC-05 safety partitioning); (3) HIL-1/HIL-2 evidence is green — TPM-01/02/03/04/05 margins ≥ 0, MOE-07 actuation = 0, zero open S1, HAZ-01 advisory-only safety case accepted. Once those land, the product baseline is freezable.

---

## 10. Cross-cutting hooks

This phase **consumes and feeds** these threads (Conventions §10 `_cross_cutting/`):

- **Configuration Mgmt** *(feeds)* — freezing the 10 ICDs at CDR sets the product baseline; post-CDR interface changes route through `CR-NN` (Phase 09; IEEE 828, ISO 10007:2017).
- **Safety / RAMS** *(consumes)* — HAZ-01 sets the rigor (IEC 61508 SIL `TODO: SIL_target`) and coverage of HIL-1/HIL-2 safety fault-injection; the open hazard blocks CDR until the advisory-only safety case is accepted (INC-03).
- **Security** *(feeds)* — the SAST + SCA/SBOM stages (§6, all tiers) and the signed-boot/signed-OTA negative tests feed the STRIDE threat model / supply-chain controls (ISO 27001 / NIST 800-53; REQ-SEC-02/03).
- **Risk & Opportunity** *(feeds/consumes)* — RSK-01..RSK-07 reviewed at CDR (§8); OPP-01 (fleet data + proven rigs as a product) evidenced by HIL-2/HIL-4 results.
- **Measurement (MOE/MOP/TPM)** *(feeds)* — increment exit criteria and HIL results update TPM-01..TPM-05 margins (and MOE-07 actuation) reported at CDR.
- **Cost/Schedule** *(consumes)* — increment durations and **HIL rig lead-times (HIL-1..HIL-4 are budget lines)** feed the schedule/EVM.
- **Quality** *(feeds)* — CI pass-rate, static-scan, contract-test, and HIL-smoke results are the quality evidence reviewed at CDR (ISO 9001:2015).

> Next phase: `se-phase-07-verification` — turn each REQ into a T/I/A/D verification (assign `TC-VER-NN` to the `TC-VER-TBD` placeholders, SysRS §11), referencing the CI/CD + static-scan tool table owned by this phase and the HIL rigs stood up here.
