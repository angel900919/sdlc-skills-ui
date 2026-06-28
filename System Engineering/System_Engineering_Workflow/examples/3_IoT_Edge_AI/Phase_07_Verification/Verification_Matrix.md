---
Document: Verification Matrix — SentinelEdge
Document ID: VM-SENTINELEDGE-v1.0
Standard: IEEE 1012-2016 (V&V) · ISO/IEC/IEEE 29119-3:2021 (test docs) · ISO/IEC/IEEE 15288:2023 (Verification process)
Status: Draft
Owner: Verification & Validation Lead
---

# Phase 07 — Verification Matrix: SentinelEdge

**Verification question — "did we build it _right_?"** This matrix proves the built SentinelEdge system conforms to the baselined `SyRS-SENTINELEDGE-v1.0` spec. It is the **authoritative** T/I/A/D method-assignment step (Phase 02 only *seeded* the methods — Conventions §4); where a method here differs from the SysRS seed, the override is noted. Gate owned by this phase: **TRR** (Conventions §3).

> **Necessary-but-not-sufficient caveat.** 100% method coverage means every REQ has a finalised method and a `TC-VER-<nn>` — it proves the spec is *covered*, **not** that the spec was *right* (that is Phase 08 Validation), and **not** that every test has *passed*. **Coverage ≠ correctness ≠ validity.** A row in §1 being present says nothing about its measured result; results live per-TC under `verification-evidence/` (§6).

**Method legend (Conventions §4):** **T** = Test (exercise, measure vs threshold) · **I** = Inspection (examine artifact/doc/code, incl. structured Review) · **A** = Analysis (calculation/model/simulation/similarity) · **D** = Demonstration (operate-and-observe, no instrumentation). Combinations (`I + T`, `T / A`) are allowed where two genuinely apply.

**Scope:** all **30** REQs from `../Phase_02_Requirements/SysRS.md` across classes **F (7) · U (2) · P (4) · INT (2) · O (4) · SEC (4) · C (2) · D (3) · SAF (2)**. Numeric thresholds are named `TODO` tokens carried verbatim from the SysRS (e.g. `recall_target`, `lat_target`) — they are pilot-measured, not invented here.

---

## 1. Per-Requirement Verification (5 columns)

`Req ID | Statement (abbrev.) | Method | Verifying Test/Activity (TC-VER) | Tool`

### Functional (F)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-F-01** | Duty-cycle sample vib/acoustic/temp; run embedded model → anomaly score + TTF each window. | T | TC-VER-01 — bench-inject recorded fault-signature streams; confirm per-window score + TTF emitted on the node duty cycle. | Saleae Logic Pro 16 (channel/ADC capture) + node debug-trace harness (`TODO: rig name`) |
| **REQ-F-02** | Raise maintenance alert **on-device** with no live uplink when score + TTF cross thresholds. | T | TC-VER-02 — uplink physically severed; drive signal past threshold; confirm local alert raised (no gateway/cloud). Verifies MOP-05. | Faraday/RF-isolation enclosure + node alert-bus probe + `pytest` harness |
| **REQ-F-03** | Buffer alerts+evidence offline; transmit in chronological order within `t_sync` s of reconnect. | T | TC-VER-03 — buffer N alerts offline, restore link, assert ordered delivery within `TODO: t_sync`. Verifies MOP-06. | Link-impairment fixture (`tc`/netem on gateway) + gateway packet capture (Wireshark) |
| **REQ-F-04** | Advisory-only — node exposes **no** interface able to command/trip/control the machine. | I + A | TC-VER-04 — design + interface inspection against ICD; FMEA confirms **no actuation path** exists. Shared with REQ-SAF-01. | Manual + SentinelEdge Advisory-Only Interface Review Checklist + FMEA worksheet (`Phase_04_Architecture/ICD.md`) |
| **REQ-F-05** | Cloud routes each alert to dashboard + CMMS, creating/proposing work order, within `t_route` s. | T | TC-VER-05 — emit synthetic alert; assert dashboard + CMMS work-order created within `TODO: t_route`. | k6 (load/emit) + CMMS sandbox API + dashboard E2E (Playwright) |
| **REQ-F-06** | Signed OTA of firmware and/or model to a cohort; staged rollout + auto-rollback on health-check fail. | T | TC-VER-06 — HIL-fleet canary rollout; force cohort health-check failure; assert automatic rollback to last known-good. Verifies MOP-07; shared with REQ-O-03. | HIL node fleet rig (`TODO: rig name`) + OTA control plane test client + fault-injection script |
| **REQ-F-07** | Retain per-alert feature explanation + model version + training-data lineage id. | I | TC-VER-07 — inspect retained alert record schema/store; confirm explanation, model-version, lineage-id present and linkable. | Manual + Lineage/Explainability Record Inspection Checklist + Model Registry query (`TODO: registry name`) |

### Usability (U)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-U-01** | Technician mounts/powers/pairs/commissions to identity attestation in ≤ `t_commission` min, guided flow, no special tools. | D | TC-VER-08 — timed commissioning demonstration on a representative asset mock-up; observe to attestation within `TODO: t_commission`. Verifies MOP-08. | Stopwatch + guided commissioning mobile app (build under test) + witnessed demo record |
| **REQ-U-02** | Dashboard shows asset/severity/TTF/confidence/explanation, comprehensible without DS training (usability review). | I | TC-VER-09 — structured usability review/walkthrough with reliability engineers against the comprehension checklist. | Manual + Dashboard Usability Review Protocol + moderated-review session record |

### Performance (P)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-P-01** | Embedded model recall ≥ `recall_target`, FPR ≤ `fpr_target` on qualified fault classes vs labelled validation set. | T / A | TC-VER-10 — score model on held-out labelled validation dataset; confusion matrix + CI on recall/FPR. Verifies MOP-01/02 → TPM-01/02. | scikit-learn / TFLite eval harness + `TODO: labelled validation dataset` + Jupyter report |
| **REQ-P-02** | One inference over an evaluation window completes within `lat_target` ms on target MCU/NPU at nominal clock. | T | TC-VER-11 — on-target latency profiling over N windows; report p50/p95/p99 vs `TODO: lat_target`. Verifies MOP-03 → TPM-03. | On-target cycle-counter/profiler (e.g. SEGGER SystemView) + target dev board at nominal clock |
| **REQ-P-03** | Deployed model ≤ `mem_target` flash and ≤ `ram_target` RAM at inference on target node. | A / T | TC-VER-12 — static footprint analysis (map file) + on-target peak-RAM measurement at inference. Verifies MOP-04 → TPM-05. | Toolchain `size`/map-file analyzer (`arm-none-eabi-size`) + RAM high-water-mark instrumentation |
| **REQ-P-04** | Model-mgmt detects accuracy drift > `drift_target` vs deployment baseline; raises drift alarm to fleet team. | T / A | TC-VER-13 — replay a drifting data stream; confirm drift metric crosses `TODO: drift_target` and alarm fires to STK-05. Verifies MOP-09. | Drift-replay harness + cloud model-monitoring service + alert sink (test mailbox/queue) |

### Interface (INT)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-INT-01** | Node↔gateway link mutually-authenticated + encrypted; published schema for alerts/evidence/telemetry/OTA. | I + T | TC-VER-14 — inspect ICD message schema + mTLS config; test mutual-auth enforcement (reject untrusted peer) + on-wire encryption. Verifies ICD (node↔gateway). | Manual + ICD/schema review + mutual-auth negative-test client + Wireshark (cipher/handshake) |
| **REQ-INT-02** | Gateway↔cloud TLS 1.3, authenticated; exposes alert/telemetry/registry-sync/OTA + documented CMMS interface. | I + T | TC-VER-15 — inspect endpoint contracts + CMMS interface doc; test TLS 1.3 negotiation + auth on each endpoint. Verifies ICD (gateway↔cloud). | Manual + API contract review + `testssl.sh` (TLS 1.3) + Postman/REST contract tests |

### Operational / Reliability (O)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-O-01** | Battery node ≥ `life_target` years service-free under nominal duty cycle + temperature profile. | A / T | TC-VER-16 — power-budget analysis from measured per-mode current × duty cycle; corroborate with accelerated duty-cycle bench draw. Verifies MOP-10 → TPM-04. | Keysight N6705C source/measure + power-budget spreadsheet/model + thermal chamber (`TODO: chamber`) |
| **REQ-O-02** | Continue safe sensing + on-device detection + local buffering ≥ `offline_target` h with no connectivity. | T | TC-VER-17 — sustain disconnected operation ≥ `TODO: offline_target` h; confirm detection continues + buffer integrity preserved. | Link-isolation fixture + long-duration soak harness + buffer-integrity assertion script |
| **REQ-O-03** | OTA staged per cohort; auto-rollback to last known-good within `rollback_target` of failed health check; no device bricked. | T | TC-VER-06 (shared with REQ-F-06) — measure rollback time vs `TODO: rollback_target`; assert zero non-functional devices post-rollback. Verifies MOP-07. | HIL node fleet rig + OTA control plane test client + fault-injection script |
| **REQ-O-04** | Retain alert records + model-version + lineage refs ≥ `retention_target` years for audit. | I | TC-VER-18 — inspect retention policy/config + storage lifecycle rules against `TODO: retention_target`; sample-record retrieval. | Manual + Data-Retention Policy Inspection Checklist + storage lifecycle config review |

### Security (SEC)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-SEC-01** | Unique crypto device identity provisioned at manufacture; private keys in secure element; attested pre-enrolment. | I + T | TC-VER-19 — inspect provisioning/secure-element config; test identity attestation on enrolment + key non-extractability (negative test). | Manual + Secure-Element Provisioning Review + attestation test client + `TODO: SE vendor tool` |
| **REQ-SEC-02** | Execute only signature-verified firmware/model; loader rejects unsigned/tampered images (verified/secure boot). | T | TC-VER-20 — load valid image (accept) then unsigned + bit-flipped images (reject); confirm verified-boot enforcement. Supports SN-10 rollback chain. | Custom signed/tampered image set + JTAG/SWD boot harness + serial boot-log capture |
| **REQ-SEC-03** | Every firmware/model image ships an SBOM (SPDX/CycloneDX); traceable to build provenance. | I | TC-VER-21 — inspect release artifact for valid SBOM + provenance attestation; validate SBOM against schema. | Manual + SBOM Review Checklist + CycloneDX/SPDX validator + provenance (in-toto/SLSA) check |
| **REQ-SEC-04** | On decommission, revoke identity + irrecoverably sanitize keys/buffered data/model per NIST SP 800-88 Rev. 1. | T + I | TC-VER-22 — execute decommission flow; verify identity revoked cloud-side + post-wipe forensic read shows no recoverable key/data/model. | Manual + NIST SP 800-88 Sanitization Verification Checklist + flash forensic reader + revocation-list query |

### Constraint (C)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-C-01** | Node hardware BOM ≤ `bom_ceiling` per unit at target production volume. | A | TC-VER-23 — costed-BOM rollup at target volume vs `TODO: bom_ceiling`; supplier-quote analysis. | Manual + BOM cost model (spreadsheet) + supplier quotations (`TODO: quotes owed`) |
| **REQ-C-02** | Node↔gateway link in license-exempt bands at target regions; no site radio licence required. | A / I | TC-VER-24 — regulatory-band analysis vs target-region allocations; inspect radio module declarations/datasheet conformance. | Manual + Radio Band Allocation Analysis + module regulatory datasheet review |

### Domain (D)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-D-01** | Developed + assessed for functional safety to IEC 61508 SIL from HAZ-01 (`SIL_target`). | I / A | TC-VER-25 — IEC 61508 safety-case inspection + SIL-verification analysis (allocation, techniques) against `TODO: SIL_target` (HAZ-01). **IV&V-witnessed.** | Manual + IEC 61508 Safety Case Review + SIL allocation/technique analysis + independent assessor sign-off |
| **REQ-D-02** | Node + battery conform to RoHS/WEEE + battery transport/disposal regs; conformity evidence retained. | I | TC-VER-26 — inspect RoHS/WEEE declarations of conformity + battery transport/disposal evidence pack. | Manual + RoHS/WEEE Conformity Review Checklist + declarations + lab test reports (`TODO: lab reports`) |
| **REQ-D-03** | Wireless node + gateway meet applicable EMC + radio-emissions conformity (CE/FCC) for target markets. | T / I | TC-VER-27 — accredited-lab EMC/radio emissions test campaign + inspect resulting CE/FCC conformity reports. | Accredited EMC chamber + spectrum analyzer (`TODO: accredited lab`) + conformity report review |

### Safety (SAF) — Safety/RAMS thread, linked HAZ-01

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| **REQ-SAF-01** | No actuation path to machine; loss/fault/compromise leaves machine control + safety systems unaffected (fail-passive). | I / A | TC-VER-04 (shared with REQ-F-04) — interface/partitioning inspection + FMEA proving fail-passive, no actuation path. **IV&V-witnessed.** | Manual + Advisory-Only Interface Review Checklist + FMEA worksheet + independent safety review |
| **REQ-SAF-02** | Mount + battery-service procedure enables install/service without contact with rotating parts; LOTO-compatible. | I / D | TC-VER-28 — inspect mounting/service procedure vs clearance spec; demonstrate install/battery-swap respecting host LOTO on a rig. | Manual + LOTO/Clearance Procedure Inspection + witnessed install/service demonstration on machine rig |

---

## 2. Verification Levels (Unit → Integration → System) + the validation hinge

Verification *level* is tracked here and in the V&V Plan, **not** as a 6th matrix column. Hardware/safety REQs typically land at **System** with HIL; software-heavy classes (F, P, SEC, INT) ladder up from Unit.

| Class | Unit | Integration | System | Acceptance |
|---|---|---|---|---|
| **F** (functional) | Model-scoring + alert-logic units (TC-VER-01/02) | Node↔gateway↔cloud alert + OTA path (TC-VER-03/05/06) | End-to-end SCN-01/02/03 on HIL fleet | **→ Phase 08 (validation hinge)** — FAT/SAT/UAT |
| **P** (performance) | Inference latency + footprint on target (TC-VER-11/12) | Drift pipeline (TC-VER-13) | Accuracy on full validation set (TC-VER-10) | **→ Phase 08** |
| **SEC** (security) | Verified-boot + key-store units (TC-VER-19/20) | mTLS + SBOM-gated release (TC-VER-14/21) | Decommission/sanitization end-to-end (TC-VER-22) | **→ Phase 08** |
| **INT** (interface) | Schema/contract unit checks | mTLS/TLS-1.3 enforcement (TC-VER-14/15) | Cross-tier interop on HIL | **→ Phase 08** |
| **O** (operational) | Buffer-integrity unit (TC-VER-17) | OTA rollback path (TC-VER-06) | Long-duration soak + power bench (TC-VER-16/17) | **→ Phase 08** |
| **U** (usability) | — | Guided-flow integration | Timed commissioning + dashboard review (TC-VER-08/09) | **→ Phase 08** |
| **C / D / SAF** | — | — | Safety case, EMC/radio lab, BOM/regulatory analysis (TC-VER-23..28) at System | **→ Phase 08** |

> **Acceptance is the verification→validation HINGE** (Conventions §4): FAT/SAT/UAT reuse T/D mechanics but are **validation** activities owned by **`../Phase_08_Validation/`** — named here, **not** assigned a TC-VER, **not** counted toward this phase's coverage.

---

## 3. Continuous Scans (pointer — Phase 06 owns the table)

The static/dynamic conformance scan stack (SAST, DAST, dependency/SCA, secrets, IaC, SBOM/license, on-target conformance) is **owned by `../Phase_06_Integration/Integration_Plan.md`** and runs in its CI/CD + HIL pipeline. Phase 07 does **not** re-author that table; it states the **verification pass-criteria** each scan must meet to count as standing verification evidence:

| Scan (defined in Phase 06) | Verification pass-criterion | Backs |
|---|---|---|
| SAST (firmware + cloud) | Zero **S1/S2** (Critical/Major) findings open at TRR. | REQ-SEC-02, code-quality of F/P classes |
| DAST (cloud APIs) | Zero Critical on alert/telemetry/registry/OTA endpoints. | REQ-INT-02, REQ-F-05 |
| Dependency / SCA + SBOM | No known Critical CVE in shipped components; valid SBOM per release. | REQ-SEC-03 |
| Secrets scan | Zero committed secrets/keys. | REQ-SEC-01 |
| Signed-image / supply-chain (verified boot, provenance) | 100% of release images signed + provenance-attested. | REQ-SEC-02, REQ-SEC-03 |
| TLS/mTLS config conformance | TLS 1.3 only on gateway↔cloud; mTLS enforced node↔gateway. | REQ-INT-01, REQ-INT-02 |

> A scan finding that is not waived raises/updates a `RSK-<nn>` (Risk thread) and, if it changes a baselined CI, a `CR-<nn>` (Phase 09). Scan criteria are **necessary, not sufficient** — they back the TC-VER rows above, they do not replace them.

---

## 4. Reviews & Inspections — gate ladder (criteria cited, not restated)

Gate criteria are defined once in **Conventions §3** and are cited, not duplicated here.

| Gate | Owning phase | This phase's relationship | Date |
|---|---|---|---|
| **SRR** | 02 | Requirements baseline this matrix verifies against (Conventions §3). | `TODO` (held — SysRS baseline pending peer review) |
| **PDR** | 04 | Allocated baseline / architecture the interface + safety REQs verify against. | `TODO` |
| **CDR** | 06 | **Product baseline** (frozen ICDs, design, build recipe) — verification runs against *this* baseline. | `TODO` |
| **TRR** | **07 (this phase)** | 100% method coverage + env/data ready (Conventions §3). See §7. | `TODO: schedule TRR` |
| **PRR** | 08 | Validation ≥ targets, zero S1 — the hinge this matrix hands off to. | `TODO` |

Inspection-method TC-VERs (TC-VER-04/07/09/18/21/24/25/26 and the I-legs of 14/15/19/22) are structured **Reviews** (a form of Inspection, Conventions §4) — review minutes / signed checklists are their evidence. There is **no** 5th "R" method.

---

## 5. Coverage Summary (the TRR rollup)

| Metric | Count | Must |
|---|---|---|
| **REQs total** | **30** | — |
| Verified by **T** (incl. combinations) | 13 — F-01/02/03/05, P-02, P-04(T/A), O-02, O-03, SEC-04(T+I), D-03(T/I); +T-legs of P-01, P-03, INT-01, INT-02, SEC-01, SEC-02 | — |
| Verified by **I** (incl. combinations) | 14 — F-04, F-07, U-02, O-04, SEC-03, D-01, D-02, SAF-01, SAF-02; +I-legs of INT-01/02, SEC-01, SEC-04, C-02 | — |
| Verified by **A** (incl. combinations) | 7 — P-01(T/A), P-03(A/T), O-01(A/T), C-01, C-02(A/I), D-01(I/A), SAF-01(I/A), F-04(I+A) | — |
| Verified by **D** | 2 — U-01, SAF-02(I/D) | — |
| **REQs with NO method** | **0** | **= 0 (stop-the-line if not)** |
| **REQs with NO TC-VER (TC-VER-TBD surviving)** | **0** | **= 0 (stop-the-line if not)** |
| REQs whose Tool is `TODO` (named rig/lab/dataset pending) | 9 (F-01/06, P-01, O-01, C-01/02, D-01/02/03) | allowed but **flagged** for TRR |

**TC-VER inventory:** TC-VER-01 … TC-VER-28, **28 cases for 30 REQs** — two intentional shares: **TC-VER-04** covers REQ-F-04 **and** REQ-SAF-01 (one advisory-only interface inspection + FMEA), and **TC-VER-06** covers REQ-F-06 **and** REQ-O-03 (one OTA canary-rollback test). Every REQ maps to ≥ 1 TC-VER; **no `TC-VER-TBD` survives** (all SysRS §11/§12 placeholders resolved here).

> **Coverage is 100% by method — necessary, not sufficient.** It does not assert any test has *passed* (results per-TC in §6) nor that the spec is *right* (Phase 08).

---

## 6. Evidence Archive

```
Phase_07_Verification/
├── Verification_Matrix.md          (this file)
├── VnV_Plan.md                     (IEEE 1012-2016 — integrity level, IV&V, task scaling)  TODO: author
└── verification-evidence/
    ├── TC-VER-01/  ├─ <capture/log/report files>  └─ result.md
    ├── TC-VER-02/  └─ ...
    └── TC-VER-28/  └─ result.md
```

Each `verification-evidence/TC-VER-<nn>/result.md` is a 1-pager: setup, observation, **measured value vs threshold** (the `TODO:*_target` token resolved to a number), pass/fail, evidence-file list, executor sign-off. **Status is NOT a matrix column** — it lives here and in the §5 rollup (Conventions / SKILL Phase-07 rule: the matrix is exactly 5 columns).

---

## 7. TRR Readiness (exit-gate checklist)

Gate **TRR** (Conventions §3) — "100% requirement coverage by method; test env & data ready."

- [x] **100%** of REQs (30/30) have a finalised T/I/A/D method — zero unassigned (§5).
- [x] **100%** of REQs have ≥ 1 `TC-VER-<nn>` — zero `TC-VER-TBD` surviving (§5).
- [x] Every method justified by *verifiability*; Phase-02 seed overrides noted (see §8 below).
- [x] Every tool named (no bare "Manual" — each Inspection cites its checklist/standard); 9 rig/lab/dataset tools flagged `TODO` (§5).
- [ ] `VnV_Plan.md` authored; integrity level set (IEC 61508 SIL from HAZ-01 + IEEE 1012 level); **IV&V decision recorded** — `TODO` (safety/edge-AI = high-criticality → IV&V expected for REQ-D-01, REQ-SAF-01/02; see §8).
- [ ] Test environment + data ready (Phase 06 CI/CD + HIL): `TODO: labelled validation dataset` (gates TC-VER-10), `TODO: HIL fleet rig`, `TODO: accredited EMC lab` — tool dry-runs owed, not just naming.
- [ ] Continuous scans (Phase 06 stack) configured + passing stated criteria (§3) — `TODO: confirm CI green at TRR`.
- [ ] `verification-evidence/` structure created; per-TC `result.md` stubbed — `TODO`.
- [x] Acceptance/UAT/FAT/SAT explicitly deferred to Phase 08 (validation hinge, §2) — not counted here.
- [ ] All blocking defects fixed; test team trained — `TODO`.
- [x] Necessary-but-not-sufficient caveat stated (banner + §5).

**Gate decision:** **Hold (proceed-with-actions to TRR).** Method + TC coverage is complete (100%), but TRR cannot pass until the `VnV_Plan.md` (with IV&V decision), the labelled validation dataset, the HIL fleet rig, and the accredited-lab bookings are in place and CI scans are green. Resolve the listed `TODO`s, then convene TRR → on pass, hand off to **`../Phase_08_Validation/`** (Test_Plan.md / TC-VAL-*, PRR gate).

---

## 8. Method overrides vs the SysRS seed (Phase 02 → Phase 07 authoritative)

Phase 07 *settles* what Phase 02 *seeded* (Conventions §4). Most seeds held; the recorded changes/clarifications:

| Req ID | Seed (SysRS §3–8) | Finalised | Why |
|---|---|---|---|
| **REQ-F-04** | I | **I + A** | Inspection alone shows the *documented* interface; an FMEA (**A**) is needed to assert **no latent actuation path** — pairs with REQ-SAF-01, both IV&V-witnessed. |
| **REQ-C-02** | A / I | **A / I** (kept) | Confirmed: band-allocation is **Analysis**; module-declaration check is **Inspection**. No radio emissions test here (that is REQ-D-03). |
| **REQ-O-03** | T | **T** (kept; folded into TC-VER-06) | Same forced-failure rollback test as REQ-F-06 — one HIL run verifies both; avoids a duplicate TC. |
| **REQ-SEC-04** | T / I | **T + I** | Sanitization is *tested* (forensic read-back) **and** the NIST SP 800-88 procedure is *inspected* — both legs required for audit evidence. |
| **REQ-D-01 / REQ-SAF-01/02** | I/A, I/A, I/D | kept | Safety thread: safety-case + SIL analysis are I/A; LOTO procedure adds a witnessed **D**. Flagged for **Independent V&V** (high-criticality — IEEE 1012; SIL per HAZ-01). Detail in `VnV_Plan.md`. |

> **IV&V note:** SentinelEdge carries a safety/RAMS thread (HAZ-01, IEC 61508) and a formal edge-AI V&V thread (accuracy/drift/rollback) → **high-criticality**. Per IEEE 1012-2016 and the SKILL's IV&V trigger, **Independent V&V** is required for the safety REQs (REQ-D-01, REQ-SAF-01/02) and the edge-AI accuracy/rollback REQs (REQ-P-01, REQ-F-06/REQ-O-03), with an organisationally independent verifier and a separate evidence trail. The full integrity-level mapping and IV&V scope are recorded in `VnV_Plan.md` (this phase — `TODO: author`).

---

*Conforms to `../../05_Conventions.md` for all IDs (§2), gates incl. TRR (§3), T/I/A/D methods (§4), severity (§5), baselines (§3), and standard citations (§9). Verifies against the SysRS baseline `SyRS-SENTINELEDGE-v1.0`. Companion: `VnV_Plan.md` (IEEE 1012-2016). Hands off to `../Phase_08_Validation/`.*
