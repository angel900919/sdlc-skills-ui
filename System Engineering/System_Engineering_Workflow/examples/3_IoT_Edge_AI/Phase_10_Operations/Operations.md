---
Document: Operations & Continuous Validation — SentinelEdge
Document ID: OPS-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Transition/Operation/Maintenance) · IEEE 1012-2016 (continuous V&V)
Status: Draft
Owner: SRE / Fleet Operations Lead
---

# Phase 10 — Operations & Continuous Validation: SentinelEdge

This phase fields SentinelEdge and keeps it meeting the baselined SyRS (`../Phase_02_Requirements/SysRS.md`) over the fleet's operational life. It owns the **Operational Readiness Review (ORR)** and **General Availability (GA)** gates (per Conventions §3), then runs the continuous loop: SLOs + error budgets derived from the Performance/Operational REQs, observability, the continuous-testing / continuous-regression pipeline (the shift-left half deferred by Phase 09), chaos game days, security/compliance cadences, OTA/release governance with auto-rollback, runbooks (`RB-*`), and incident management — closing every SyRS-affecting finding back through a Phase-09 `CR-*`. It conforms to `../../../05_Conventions.md` — cited, never forked.

> **OUTSIDE-MATERIAL marker (Google SRE).** The **SLO · SLI · error-budget · burn-rate** model in §3 (and the burn-rate alert table) is from Google SRE practice (Beyer et al., *Site Reliability Engineering*, 2016; *The SRE Workbook*, 2018) — **not** course KB material. It is industry-standard and complements IEEE 1012-2016 continuous V&V, but it is treated here as an optional, tailored convention, not course canon. The IEEE 1012 / ISO/IEC/IEEE 15288 Transition-Operation-Maintenance spine in §2, §5, and §11 **is** course material.

> **Disposal is Phase 11, not here.** End-of-life, identity revocation at retirement, battery/WEEE handling, and NIST SP 800-88 sanitization (REQ-SEC-04, REQ-D-02, SCN-05) are authored in `../Phase_11_Disposal/Disposal_Plan.md`. This phase only references that hand-off (§12). In-service secure-erase of a *replaced* node during RMA is covered by `RB-09` here as an operations action, but the EoL programme itself is Phase 11.

---

## 1. Purpose & Scope

Keep the deployed SentinelEdge fleet — sensor nodes (edge AI), gateways, and the cloud fleet backend — meeting the SyRS in service: detection accuracy/false-positive budgets (REQ-P-01), on-device latency (REQ-P-02), edge autonomy and offline survival (REQ-F-02, REQ-O-02), battery life (REQ-O-01), drift detection (REQ-P-04), governed OTA with rollback (REQ-F-06, REQ-O-03), and security/identity (REQ-SEC-01..03). The unit of "service" is **the fleet**, not a single web app: many of the SLIs below are computed across devices/cohorts, and the "error budget" is a fleet-level statistic.

**Edge-first reality (carried from SyRS §2 / SCN-02):** detection and alerting happen on-device and do **not** depend on a live uplink. Connectivity is for fleet management, OTA, and analytics. Therefore some SLOs are **node-local** (must hold even when the device is offline — verified from buffered telemetry on reconnect) and some are **cloud-side** (alert routing, OTA pipeline). Each SLO in §3 is tagged with where it is measured.

In scope: transition/cutover, SLOs, observability, continuous regression, chaos, security cadence, OTA governance, runbooks, incident management, loop-back. Out of scope (cross-referenced): change governance/CCB → Phase 09; disposal/EoL → Phase 11; the IEC 61508 safety case itself → Phase 04/07 safety thread (this phase only *operates* the advisory-only guarantee, REQ-SAF-01).

---

## 2. Transition & ORR Readiness

Realises the ISO/IEC/IEEE 15288:2023 **Transition** process.

### 2.1 Deployment / fielding strategy

| Tier | Mechanism | Strategy | Cutover | Back-out |
|---|---|---|---|---|
| **Cloud backend** | IaC (containers, env-as-code per KB-18) | **Blue-green** per region; canary on the alert-routing + OTA services | DNS/endpoint switch after smoke-gate | Re-point to blue; CR-filed retrospectively |
| **Gateway** | Signed gateway-firmware OTA | **Phased per site** (canary site → wave) | Per-site, off-shift window | Roll gateway image back; nodes keep buffering offline (REQ-O-02) |
| **Node firmware + edge model** | Signed OTA cohort rollout (REQ-F-06) | **Canary cohort → waves** (see §8) | Per-cohort, bake-timed | **Auto-rollback** to last known-good (REQ-O-03) |
| **New node install** | Technician guided flow (REQ-U-01, SCN-04) | **Phased install per asset**; baseline-learning window before alerts count | Identity attest → enroll → baseline | Decommission/replace node; no plant impact |

Node and gateway firmware are **field-updatable in place** — there is no "big-bang" fleet cutover; the fleet migrates cohort-by-cohort under OTA governance (§8). Data migration is cloud-side only (registry/lineage store); nodes hold only a *reference* to lineage (per SyRS §15 conflict resolution), so there is no on-device migration burden.

### 2.2 Operator handover (HSI)

- **Operators:** STK-01 Reliability/Maintenance Manager (consumes alerts via dashboard + CMMS), STK-02 Technician (install/service, RB-driven), STK-05 Fleet/Data-Science team (model lifecycle, drift, OTA), STK-04 OT/Security (identity, network). On-call is staffed by Fleet Operations + a Data-Science secondary for model/drift incidents.
- **Handover artifacts:** runbook index (§9), dashboard tour, OTA-governance briefing, incident/severity card (S1–S4), and the install/commission guided flow (REQ-U-01). Acceptance-into-operations sign-off by STK-01 + STK-08 + Fleet Ops Lead. `TODO: schedule operator training + sign-off date`.

### 2.3 ORR decision

ORR is a gate decision (Proceed · Proceed-with-actions · Hold · Stop). The five ORR pillars — deployment, runbooks, SLOs, on-call, rollback — are checked in §11. **Current recommendation: Proceed-with-actions** (SLO targets are `TODO: pilot-measured`, traced to the same SyRS `TODO` thresholds; do not invent them). GA is **not** declared until ORR passes and the GA continuous conditions in §11 hold.

---

## 3. SLOs & Error Budgets  *(OUTSIDE-MATERIAL / Google-SRE — tailor; targets read from REQ thresholds, never gut-feel)*

Every Performance (`REQ-P-*`) and Operational (`REQ-O-*`) requirement maps to ≥ 1 `SLO-*`. SLO targets are read from each REQ's threshold; because the SyRS holds those as named `TODO` thresholds (no invented numbers), the SLO targets inherit the **same** `TODO` token — they are not gut-felt. Window defaults to 28 d for rate/quality SLIs and the REQ's own horizon for life/retention SLIs. **Measured at** column marks node-local vs cloud-side (the edge-first split from §1).

| SLO | SLI (Service Level Indicator) | Target | Window | Measured at | Linked REQ | TPM |
|---|---|---|---|---|---|---|
| **SLO-01** | Recall on qualified target fault classes = TP / (TP+FN), scored on confirmed-outcome labels fed back from CMMS work-order closure | ≥ `TODO: recall_target` (= REQ-P-01) | 90 d rolling | cloud (labels) | REQ-P-01 | TPM-01 |
| **SLO-02** | False-positive (nuisance-alert) rate = nuisance alerts / device-month | ≤ `TODO: fpr_target` (= REQ-P-01) | 28 d | cloud (labels) | REQ-P-01 | TPM-02 |
| **SLO-03** | On-device inference latency p95 per evaluation window | ≤ `TODO: lat_target` ms (= REQ-P-02) | 28 d | node-local | REQ-P-02 | TPM-03 |
| **SLO-04** | Deployed model footprint within budget = devices whose flash+RAM at inference ≤ budget / total | 100% (= REQ-P-03; binary per device) | per-release | node-local | REQ-P-03 | TPM-05 |
| **SLO-05** | Drift-detection latency = time from accuracy crossing `drift_target` to drift alarm raised | ≤ `TODO: drift_latency` (= REQ-P-04) | 90 d | cloud | REQ-P-04 | — |
| **SLO-06** | Service-free battery life = fielded nodes meeting life target under nominal duty / total (survival-curve estimate) | ≥ `TODO: life_target` yr (= REQ-O-01) | trailing life-table | node-local | REQ-O-01 | TPM-04 |
| **SLO-07** | Offline survival = nodes sustaining safe sense+detect+buffer for the offline horizon with no uplink / total exposed | ≥ `TODO: offline_target` h (= REQ-O-02) | per offline event | node-local | REQ-O-02 | — |
| **SLO-08** | Edge autonomy = detections raised with no live uplink / total detections (proves REQ-F-02) | ≥ `TODO` (near 100%, MOP-05) | 28 d | node-local | REQ-F-02 | — |
| **SLO-09** | Buffered-alert sync latency p95 on reconnect | ≤ `TODO: t_sync` s (= REQ-F-03) | 28 d | node→cloud | REQ-F-03 | — |
| **SLO-10** | OTA fleet-update reach within the update window incl. successful rollback / targeted cohort | ≥ `TODO` % (MOP-07, = REQ-F-06/REQ-O-03) | per release | cloud | REQ-F-06, REQ-O-03 | — |
| **SLO-11** | OTA auto-rollback completion = cohorts rolled back to last known-good within budget on failed health check / failed cohorts | ≥ `TODO` within `TODO: rollback_target` (= REQ-O-03) | per release | cloud | REQ-O-03 | — |
| **SLO-12** | Alert-to-CMMS routing latency p95 (cloud receipt → work order created/proposed) | ≤ `TODO: t_route` s (= REQ-F-05) | 28 d | cloud | REQ-F-05 | — |
| **SLO-13** | Fleet identity health = enrolled nodes with a verified secure-element identity + current SBOM / total (proves REQ-SEC-01/03 in service) | 100% (binary; any drop pages OT/Security) | continuous | cloud | REQ-SEC-01, REQ-SEC-03 | — |

> **Coverage assertion.** All four `REQ-P-*` (P-01..04) and all four `REQ-O-*` (O-01..04) are covered: REQ-P-01→SLO-01/02, REQ-P-02→SLO-03, REQ-P-03→SLO-04, REQ-P-04→SLO-05, REQ-O-01→SLO-06, REQ-O-02→SLO-07, REQ-O-03→SLO-10/11, **REQ-O-04** (audit retention ≥ `TODO: retention_target` yr) → **SLO-RET** below. No uncovered Performance/Operational REQ.

| SLO | SLI | Target | Window | Measured at | Linked REQ |
|---|---|---|---|---|---|
| **SLO-RET** | Lineage/alert-record retention = records present + readable at audit horizon / sampled records | 100% (binary) | `TODO: retention_target` yr | cloud | REQ-O-04 |

### 3.1 Error budgets & burn policy  *(OUTSIDE-MATERIAL / Google-SRE — tailor)*

Error budget per SLO = `1 − target` over the window. The budget-burn policy ties burn-rate alerts to a **change-freeze that routes through the Phase-09 CCB** — it is **not** an independent ops decision (per Conventions §3, Phase-09 owns the CCB).

```
0–50% budget used .... ship freely (OTA waves proceed)
50–100% used ......... ship with caution; non-critical model/firmware OTA needs Fleet-Ops + DS sign-off
>100% (exhausted) .... freeze non-critical OTA via the Phase-09 CCB; S1/S2 fixes only; daily review
Burn-rate alerts:  2%/1h → page on-call · 5%/6h → page + manager · 10%/3d → CCB-gated change-freeze
```

- **SLO-02 (false-positive) breach** is the adoption killer (RSK-02): a sustained FPR-budget burn pages STK-05 *and* freezes model OTA promotion (a "fix" model could be making it worse).
- **SLO-06 / SLO-07 (battery / offline)** are node-local survival SLOs — a burn signals a duty-cycle/firmware regression (RSK-05); it freezes firmware OTA and opens RB-04.
- **SLO-13 (identity)** is a security SLO — any non-100% reading is treated as a potential RSK-06 event and pages OT/Security (RB-06), not just a budget burn.
- **Safety note:** SLOs measure service quality, **not** safety. REQ-SAF-01 (advisory-only, fail-passive) is **not** traded against an error budget — there is no actuation path to degrade, and a safety-supervisor anomaly is an immediate S1 (RB-05), never a budget decision.

---

## 4. Observability

Four pillars. Defaults below; teams may swap tools (KB-18: "no single tool fits all"). For request-driven cloud services instrument **RED** (Rate, Errors, Duration p50/p95/p99); for resources and **for the node fleet as a resource pool** instrument **USE** (Utilization, Saturation, Errors). Fleet/device telemetry is a first-class observable here, not just cloud APM.

| Pillar | What is instrumented | Default tool | Retention | Dashboard owner | Alert route |
|---|---|---|---|---|---|
| **Metrics** | Cloud RED (alert routing, OTA service); fleet USE (battery %, duty-cycle, inference-latency histogram per node, drift score, FPR per cohort); SLO/SLI recording rules | Prometheus + Grafana | `TODO` (hot) / `TODO` (cold) | Fleet Ops | on-call pager |
| **Logs** | Structured cloud logs + per-node event log synced on reconnect; OTA audit log (CR ref, signed hash, cohort outcome — §8); correlation by `device_id`/`model_version`/`lineage_id` | Loki + Grafana | `TODO` (≥ REQ-O-04 horizon for audit-class logs) | Fleet Ops + OT/Security | sec channel for SEC-tagged |
| **Traces** | Cloud request flow (gateway→cloud→CMMS, REQ-F-05); OTA rollout spans (cohort→bake→promote/rollback) | OpenTelemetry + Tempo | `TODO` | Fleet Ops | linked from SLO-12 alerts |
| **Fleet/Device** (RUM-analog) | Per-device health beacons: battery, temperature exposure, sensor-fault flags, model/firmware version, identity status, offline-buffer depth; survival/life-table feed for SLO-06 | Fleet telemetry pipeline → Grafana | `TODO` | Fleet Ops + Data Science | drift→DS; identity→OT/Sec |

- **Edge-first caveat:** node-local SLIs (SLO-03/04/06/07/08) are computed **on-device** and shipped in summarized telemetry; when a node is offline (SCN-02) its SLIs are backfilled in time order on reconnect (SLO-09). Dashboards must show "last-seen" age so an offline node is never silently counted as healthy.
- **Lineage/explainability (REQ-F-07):** every alert carries `model_version` + `lineage_id`; these are the join keys across metrics/logs/traces and the evidence trail for audits (REQ-O-04) and for PIRs.
- **TPM live wiring:** SLO-01/02/03/04/06 feed the **Measurement (TPM) thread** margins for TPM-01/02/03/05/04 respectively — an SLO breach updates the corresponding TPM margin (TPM definitions in SyRS §10).

---

## 5. Continuous-Testing Pipeline (shift-left half — owned here)

The KB-18 continuous-validation loop Phase 09 defers to this phase. Two layers.

### 5.1 Per-commit / CI (shift-left, fail-fast)

The 5 KB-18 principles applied to SentinelEdge's hybrid stack:

- **Shift-left / BDD-first** — tests defined alongside code; acceptance criteria from the SyRS REQs drive the suite.
- **Test automation in CI/CD** — runs on every commit/PR and nightly, on the Phase-06 pipeline + HIL rigs.
- **Fail-fast feedback** — unit/model-eval gates block merge before the slow on-target jobs run.
- **Environment consistency** — cloud as-code containers; node firmware built and flashed to a pinned target board image; model packaged reproducibly (same toolchain → same hash for signing, REQ-SEC-02).
- **Service virtualization** — reuse Phase-06 stubs/drivers: a **simulated machine-signature injector** (recorded vibration/acoustic fault traces) feeds the edge model when real rotating-machinery rigs aren't available; a **gateway/cloud mock** stands in for the WAN so node firmware CI doesn't need live cloud.

Test-type ladder (KB-18, smallest→largest scope), automated by layer:

| Layer | Scope | Examples (SentinelEdge) | Speed |
|---|---|---|---|
| **Unit** | Function | DSP feature extraction, threshold logic, buffer/queue, signing-verify path | very fast |
| **Model-eval** | The edge model as a unit | Recall/FPR on held-out labelled set (REQ-P-01); footprint + on-target latency profiling (REQ-P-02/03) — fails the build if accuracy regresses or footprint exceeds budget | fast |
| **Integration** | Module seams | Node↔gateway message schema + mTLS (REQ-INT-01); gateway↔cloud TLS 1.3 endpoints (REQ-INT-02); OTA package verify | medium |
| **System / HIL** | End-to-end on hardware | Inject fault signature on HIL rig → confirm on-device alert with **no uplink** (REQ-F-02); sever uplink → buffering + ordered sync (REQ-F-03/O-02); OTA canary + **forced-failure rollback** on HIL fleet (REQ-F-06/O-03) | slower |
| **Regression** | Guard against backslide | Full re-run of the above on every release candidate; advisory-only/no-actuation FMEA re-inspection (REQ-SAF-01/REQ-F-04) | varies |
| **UAT** | Acceptance | STK-01 dashboard/CMMS acceptance (REQ-U-02, REQ-F-05); STK-02 guided-install timing (REQ-U-01) | manual |

> The **model-eval layer is the edge-AI V&V gate**: a model OTA package cannot be signed/promoted unless it passes recall/FPR + footprint + latency gates against the qualified dataset (closes RSK-01). This is the in-pipeline complement to the live SLO-01/02/03/04.

### 5.2 Post-GA continuous regression (runs after release, not just in CI)

| Cadence | Activity | Catches | Linked |
|---|---|---|---|
| Per-deploy | Smoke gate before cohort promotion | Broken release | SLO-10/11, §8 |
| Hourly | Synthetic cloud probes (k6/Playwright) on alert-routing + OTA endpoints | Cloud-side SLO miss | SLO-12, RB-07 |
| Nightly | Conformance suite re-run; replay recorded fault signatures through current production model | Silent accuracy/FPR drift | SLO-01/02, RB-02 |
| Continuous | Drift telemetry vs deployment baseline | Field model drift (RSK-03) | SLO-05, REQ-P-04, RB-03 |
| Weekly | Re-run Phase-08 load/perf baseline against staging | Cloud perf drift | SLO-12 |
| Quarterly | Chaos game day (§6) | Resilience regressions | §6 |
| Annual | External pen test (§7) | Security regressions | §7, RB-06 |

---

## 6. Chaos Engineering

≥ 4 game days; first within **30 days of GA**. Each states a hypothesis, the injected failure, a **blast-radius limit**, abort criteria, linked REQ, and the runbook it feeds. Tooling: `TODO: choose` (Litmus / Chaos Toolkit cloud-side; in-house HIL fault-injection for nodes/gateways — chaos here includes the *physical/edge* layer, not just cloud).

| GD | Hypothesis | Injected failure | Blast radius | Abort | Linked REQ | Feeds |
|---|---|---|---|---|---|---|
| **GD-01** | Fleet keeps detecting & buffering when the uplink dies | Kill gateway/WAN to a test site | 1 non-critical site | Any node enters Fault or stops detecting | REQ-O-02, REQ-F-02/F-03 | RB-01 |
| **GD-02** | A bad model OTA is caught by canary health-check and auto-rolls-back | Push a deliberately-regressed model to a canary cohort | Canary 1–5% only | Rollback not complete within `rollback_target` | REQ-F-06, REQ-O-03 | RB-08 |
| **GD-03** | Signed-boot rejects a tampered/unsigned image | Attempt to load an unsigned firmware/model on a HIL node | 1 HIL node | Node accepts the image (critical) | REQ-SEC-02 | RB-06 |
| **GD-04** | Cloud region failover preserves alert routing & OTA control | Fail the primary cloud region/AZ | Staging fleet shadow | Alert routing lost > `TODO` | REQ-F-05, REQ-INT-02 | RB-07 |
| **GD-05** | Drift alarm fires before accuracy quietly crosses the floor | Feed a drifting signature distribution to a canary cohort | Canary cohort | No drift alarm after threshold crossed | REQ-P-04 | RB-03 |
| **GD-06** | Identity/cert expiry is detected and rotated without losing the fleet | Expire a node/gateway cert in a test site | 1 test site | Fleet identity health (SLO-13) drops silently | REQ-SEC-01 | RB-06 |

> Safety constraint on chaos: **no game day may attempt to induce machine actuation** — there is no actuation path (REQ-SAF-01/REQ-F-04), and game days run on test sites / HIL rigs / canary cohorts, never on a critical production asset without LOTO context.

---

## 7. Security & Compliance Cadence

| Activity | Cadence | Maps to |
|---|---|---|
| External penetration test | Annual | REQ-SEC-01/02, threat model `THR-*` (Security thread) |
| Internal pen test / red-team (OTA, identity, node↔gateway) | Quarterly | REQ-SEC-02, REQ-INT-01 |
| SBOM re-scan for new CVEs in shipped firmware/model images | Continuous + per-release | REQ-SEC-03 |
| Crypto-suite review (signing keys, mTLS suites, TLS 1.3 config) | Quarterly | REQ-SEC-02, REQ-INT-02 |
| EMC/radio conformity check on hardware revisions | Per hardware change | REQ-D-03, REQ-C-02 |
| IEC 61508 advisory-only safety-case surveillance (in-service evidence that no actuation path was introduced) | Per release + annual | REQ-D-01, REQ-SAF-01, HAZ-01 |
| Privacy/compliance review (lineage retention, RoHS/WEEE posture) | Per significant change | REQ-O-04, REQ-D-02 |

**Vulnerability-response SLA** (map CVSS → `S1–S4`, Conventions §5.1): S1 Critical (CVSS ≥ 9.0) < 7 d · S2 Major (7.0–8.9) < 30 d · S3 Minor (4.0–6.9) < 90 d · S4 (< 4.0) next planned release. A critical CVE in a shipped image triggers an emergency signed OTA (§8) and a loop-back `CR-*` (§10). New regulation / vendor crypto deprecation → loop-back `CR-*`.

---

## 8. OTA / Deployment Governance

Every production push (firmware, model, gateway, cloud) is a **Phase-09 `CR-*`** against a baselined `CI-*` — no out-of-band pushes. Architecture for signing/canary/rollback/lineage is **DEC-04 / DM-04** (named in SyRS §13). This realises SCN-03.

**Cohorts (defaults — tailor):** Canary 1–5% (24 h bake) → Wave 1 10–25% (48 h) → Wave 2 50% (72 h) → Full 100%. Bake times are `TODO: tune to duty cycle` — note SentinelEdge's slow duty cycle means a node may take longer than a web service to surface a regression, so bakes are likely **longer** than the SaaS defaults.

**Gating metrics per cohort** (promote only if none breach): SLO-01/02 (accuracy/FPR) not regressed vs the cohort baseline · SLO-03 latency in budget · no node Fault-state spike · no battery-drain spike (SLO-06 leading indicator) · no identity/boot failures (SLO-13).

**Auto-rollback (REQ-O-03):** automatic to the last known-good firmware/model within `TODO: rollback_target` on any **hard** gate breach (accuracy floor, crash/Fault spike, signed-boot failure). Ambiguous/partial signals → manual rollback via RB-08. **Mandatory-auto** on the safety-relevant path: any anomaly in the Safety Supervisor (REQ-SAF-01) forces rollback regardless of other signals. No device is ever left non-functional (REQ-O-03).

**Audit log (per push):** `CR-*` ref · signed artifact hash · SBOM ref (REQ-SEC-03) · `model_version`/`lineage_id` (REQ-F-07) · cohort progression log · outcome (promoted / rolled-back). Retained per REQ-O-04. A rollback that happened without a pre-filed CR (e.g. emergency CVE) files a `CR-*` **retrospectively**.

---

## 9. Runbooks (RB-*) — index

Seeded real files under `runbooks/`. Required structure (Conventions §2.4 + skill): **Symptom → Triage → Mitigation → Resolution → Post-incident trigger**, with linked `SLO-*` / `REQ-*` / `CR-*`. ≥ 1 runbook per SLO alert exists before ORR.

| RB | Title | Triggered by | Linked SLO | Linked REQ |
|---|---|---|---|---|
| **RB-01** | Fleet/site uplink loss — offline buffering | SLO-07/SLO-08 burn; GD-01 | SLO-07, SLO-08, SLO-09 | REQ-O-02, REQ-F-02/F-03 |
| **RB-02** | False-positive (nuisance-alert) surge | SLO-02 burn | SLO-02 | REQ-P-01 |
| **RB-03** | Model drift alarm | SLO-05; GD-05 | SLO-05 | REQ-P-04 |
| **RB-04** | Battery-life / power-budget regression | SLO-06 burn | SLO-06, SLO-07 | REQ-O-01 |
| **RB-05** | Safety-supervisor anomaly (advisory-only breach suspicion) | Safety-supervisor flag | — (safety, not budgeted) | REQ-SAF-01, REQ-F-04 |
| **RB-06** | Device identity / signed-boot / cert failure | SLO-13 drop; GD-03/GD-06 | SLO-13 | REQ-SEC-01/02/03 |
| **RB-07** | Cloud alert-routing degradation | SLO-12 burn; GD-04 | SLO-12 | REQ-F-05, REQ-INT-02 |
| **RB-08** | Bad OTA push — rollback | SLO-10/11; GD-02 | SLO-10, SLO-11 | REQ-F-06, REQ-O-03 |
| **RB-09** | Node replacement / in-service secure-erase (RMA) | Field fault / replacement | — | REQ-SEC-04 (in-service; EoL → Phase 11) |

Seed files written: `runbooks/RB-02-false-positive-surge.md`, `runbooks/RB-03-model-drift.md`, `runbooks/RB-08-bad-ota-rollback.md` (the three highest-risk SLO alerts — RSK-02, RSK-03, RSK-06/OTA). Remaining RB-01/04/05/06/07/09 are `TODO: author before ORR sign-off` — listed here so the gate is honest about the folder not being empty but not yet complete.

---

## 10. Incident Management & Loop-back to the SyRS

- **Severity:** reuse the Phase-08 defect taxonomy `S1–S4` (Conventions §5.1; `SEV-n` is the accepted alias — this doc uses **S1–S4** throughout). S1 = safety-relevant (e.g. any suspicion REQ-SAF-01/REQ-F-04 advisory-only guarantee is breached), total loss of fleet detection, or unsigned-image acceptance; S2 = major degradation (sustained FPR breach causing adoption loss, region-wide routing loss, OTA stuck with no rollback).
- **On-call:** Fleet Operations primary + Data-Science secondary (model/drift) + OT/Security secondary (identity/CVE). **Incident commander** role per the skill.
- **PIR template:** date/duration · severity · incident commander · summary · timeline · 5-whys root cause · what worked/didn't · action items (owner/due/linked CR) · **SyRS impact (REQs to revisit + `CR-*` filed)**.
- **Loop-back (non-optional):** any **S1/S2** incident exposing a missing or weak REQ files a **`CR-*` via `../Phase_09_Change_Config/` (`se-phase-09-change-config`)** to update the SyRS — the only path that re-baselines a `REQ-*` (Conventions §6). Examples already anticipated: a real-world false-positive pattern not in REQ-P-01's qualified fault classes → CR to extend the class set; a drift mode REQ-P-04 misses → CR to tighten `drift_target`; an OTA failure mode REQ-O-03 doesn't cover → CR. Chaos and drift findings also feed the living risk register (RSK-02/03/06).

---

## 11. Gates — ORR (one-time) then GA (continuous)

### ORR checklist (owned by this phase — Conventions §3)

- [x] Transition/deployment + cutover + back-out defined per tier (§2.1); operator handover defined, sign-off `TODO` (§2.2).
- [x] Every `REQ-P-*` (P-01..04) and `REQ-O-*` (O-01..04) maps to an `SLO-*` — coverage asserted in §3 (incl. SLO-RET for REQ-O-04). No uncovered Performance/Operational REQ.
- [x] Observability stack chosen; dashboard owners + alert routes assigned; RED (cloud) + USE (fleet) instrumented (§4).
- [x] On-call rotation + incident-commander role defined (§10).
- [x] Rollback defined — auto on hard breach, manual RB-08 for ambiguous, mandatory-auto on the safety path (§8).
- [~] ≥ 1 real `RB-*` file per SLO alert — **3 seeded** (RB-02/03/08); RB-01/04/05/06/07/09 `TODO: author before ORR sign-off` (§9). **This item gates ORR sign-off.**

**ORR recommendation: Proceed-with-actions** — blocking actions: (a) finish the remaining seed runbooks; (b) operator-training sign-off; (c) replace SLO `TODO` targets once the pilot retires RSK-01/02/05 and supplies the SyRS thresholds. Do not invent the targets here.

### GA continuous condition (after ORR)

- [x] Error budget per SLO defined with a burn policy that routes a freeze through the **Phase-09 CCB** (§3.1).
- [x] Continuous-testing pipeline documented — per-commit shift-left/fail-fast/env-as-code/service-virtualization/test-type ladder **and** post-GA regression cadence (§5).
- [x] ≥ 4 chaos game days defined (6); first scheduled within 30 days of GA (§6).
- [x] Vulnerability-response SLA mapped to `S1–S4` (§7).
- [x] OTA cohorts + gating metrics + auto-rollback + `CR-*` audit log defined (§8).
- [x] PIR template + S1/S2 → loop-back `CR-*` rule stated (§10).
- [x] Disposal explicitly handed to **Phase 11** (§12); SRE core marked OUTSIDE-MATERIAL (header + §3).
- [ ] **GA is honoured continuously** thereafter: error budgets held, first quarterly SLO/observability review scheduled, first chaos game day within 30 days — `TODO: GA date`.

---

## 12. Cross-references

- **Change governance / CCB / CR loop / CI register** → `../Phase_09_Change_Config/` (`se-phase-09-change-config`). Every OTA push and every loop-back is a `CR-*` there. *Phase 09 folder is a forward marker in this backbone (`TODO: author`).*
- **Disposal / end-of-life** → `../Phase_11_Disposal/Disposal_Plan.md` (`se-phase-11-disposal`): DRR, identity revocation at retirement (REQ-SEC-04, SCN-05), battery/WEEE (REQ-D-02), NIST SP 800-88 Rev. 1 sanitization. **Not authored here.**
- **SLO source of truth** → `../Phase_02_Requirements/SysRS.md` §3/§5/§7/§10 (REQ-P-*/REQ-O-*, MOP-*, TPM-*). **No SLO target is invented; each inherits its REQ's `TODO` threshold.**
- **Measurement (TPM) thread** — SLO-01/02/03/04/06 feed TPM-01/02/03/05/04 margins (TPM definitions in SyRS §10; cross-cutting TPM tracker per Conventions §10).
- **Risk thread** — chaos/drift/incident outcomes raise/retire RSK-01/02/03/05/06 (seed register in Concept §9).
- **Verification/Validation baselines** → `../Phase_07_Verification/` (TC-VER-* regression seed) and `../Phase_08_Validation/` (TC-VAL-*, load baseline re-run weekly). *Forward markers in this backbone.*
