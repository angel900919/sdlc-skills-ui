---
Document: SentinelEdge — Change Management & Configuration Management Plan
Document ID: CMP-SENTINELEDGE-v1.0
Standard: ISO 10007:2017 (+ IEEE 828) · ISO/IEC/IEEE 15288:2023 · ISO 31000:2018
Status: Draft
Owner: Configuration Manager (CM) — chairs the CCB with the Lead Systems Engineer
---

# Phase 09 — Change & Configuration Management: SentinelEdge

> Two plans in one file (per the example layout): **Part A — Change Management** (the governance loop that lets a baselined SentinelEdge evolve) and **Part B — Configuration Management** (the four ISO 10007 functions that keep every baseline identified, accounted, and audited). All shared conventions — IDs, gates, T/I/A/D, severity, baselines, status strings, semver, citations — come from **Conventions** and are cited (per Conventions §1–§9), never redefined. Exit gate: **Baselines current** (per Conventions §1). Continuous testing / shift-left / SLO-regression / fleet drift monitoring lives in **Phase 10** — this phase references it and stays on governance + CM.

This phase is the **home of the Configuration Management thread** and the change-governance engine the other threads route through. SentinelEdge's tailoring is **Hybrid V-Model + Agile, Formal on the safety/RAMS and edge-AI V&V threads** ([Concept §4](../Phase_01_Concept/Concept.md)): V-Model governs node firmware/power/safety with paired HIL tests, Agile governs the cloud backend and the edge-AI model lifecycle, and **Formal** rigour (bidirectional traceability, independent V&V) is applied to the IEC 61508 safety thread (HAZ-01) and to edge-AI V&V (accuracy, drift, rollback). That Formal overlay — plus the fact that **the embedded AI model, its training data, and the OTA channel are first-class engineered configuration items** — is the reason this phase exists. A silent change to a model image, its training-data lineage, the signing keys, or the rollback logic can regress detection accuracy, false-positive rate, or the advisory-only safety property as surely as a firmware code change.

---

# Part A — Change Management Plan

## A.1 Purpose & Scope

Define a controlled, auditable process to evaluate, approve, implement, and verify changes to the **SentinelEdge baseline** without letting detection accuracy, false-positive rate, on-device latency/footprint, battery life, the advisory-only safety property, or the OTA/rollback integrity regress.

**A change is anything that alters a baselined CI** (Part B §B.2). Edits to never-baselined drafts are ordinary V-Model / sprint work, not CRs (per Conventions §6: a `Baseline (...)`-status artifact changes *only* through a `CR-NN`).

**In scope — a CR is required when the change touches:**
- A baselined requirement in [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) (any `REQ-*`, `MOE-*`, `MOP-*`, `TPM-*`).
- The allocated/product baseline — any of the ten top-level blocks of [SysRS §13](../Phase_02_Requirements/SysRS.md#13-design-preview--top-level-blocks--strategic-decisions) or any interface ICD seam (node↔gateway mTLS link `REQ-INT-01`, gateway↔cloud TLS 1.3 + CMMS `REQ-INT-02`, the signed OTA channel).
- **The embedded AI model image** — the deployed model that satisfies `REQ-F-01/02` and `REQ-P-01/02/03`, its **quantization/footprint** (REQ-P-03 → TPM-05), its inference latency (REQ-P-02 → TPM-03), or its detection thresholds. *In SentinelEdge the model is not "just a file" — it is the engineered component carrying the accuracy↔footprint↔battery quadrilemma (RSK-01), and a swap can move TPM-01/-02/-03/-05 at once.*
- **The training-data lineage + model registry** — the dataset version, the lineage identifier retained with each alert (REQ-F-07), or the drift baseline against which REQ-P-04 alarms.
- **The OTA + signing/rollback surface** — the signed firmware/model rollout, canary cohort logic, automatic rollback to last-known-good (REQ-F-06, REQ-O-03), or the verified-boot trust chain (REQ-SEC-02).
- **The safety surface** — anything bearing on the advisory-only / fail-passive property (REQ-F-04, REQ-SAF-01, REQ-SAF-02), the IEC 61508 SIL determination (REQ-D-01), or the `Hazard_Log.md` (HAZ-01).
- The security posture (`Threat_Model.md` `THR-*`), device identity/secure element (REQ-SEC-01), SBOM/build provenance (REQ-SEC-03), secure decommissioning/sanitization (REQ-SEC-04), or any `D`-class conformity (IEC 61508 / RoHS-WEEE / EMC-radio — REQ-D-01/02/03).

**Out of scope (normal V-Model bench / Agile sprint flow, no CCB):** dashboard cosmetic/copy work, isolated cloud-backend bug fixes, and analytics tweaks that touch **no** baselined CI and **none** of the model / OTA / safety / security surface above. *Decision aid (per the skill's "is this a change at all?"): if losing track of the item's version would cause a defect, a detection/safety regression, a bricked node, or an audit finding, it is a CI and its change needs a CR.*

## A.2 Change Classes (A/B/C/D — calibrated to SentinelEdge)

The class label is a **governance routing** label, not a version key. Priority maps to the `S1–S4` severity and High/Med/Low/N-A priority of Conventions §5 (S1 ≈ class-A driver). **When torn between two classes, take the higher.**

| Class | Sev | SentinelEdge examples | CCB review / quorum | SLA (calibrated to SentinelEdge) |
|---|---|---|---|---|
| **A — Critical** | S1 | Any change to the **advisory-only / fail-passive** property (REQ-F-04, REQ-SAF-01, mitigating RSK-04) or the IEC 61508 SIL basis (REQ-D-01, HAZ-01); a change to the **OTA signing / verified-boot / rollback** trust chain (REQ-SEC-02, REQ-F-06, REQ-O-03, mitigating RSK-06); a **model image swap that moves a TPM toward threshold** (TPM-01 accuracy / TPM-02 FPR / TPM-03 latency / TPM-05 footprint — RSK-01); a **breaking** ICD change (node↔gateway `REQ-INT-01`, gateway↔cloud `REQ-INT-02`); a live security incident (`THR-*`) or a fielded safety concern. | **Full CCB + Safety/EHS (STK-06) + Security (STK-04) mandatory**; Data-Science lead (STK-05) mandatory for any model/OTA change. | **Decision within 5 business days.** |
| **B — Major** | S2 | New feature; new external interface/connector; **node compute-platform or ML-runtime change** (re-decide `DM-01`); **embedded model-family change** (`DM-02`, accuracy↔footprint↔explainability); **power-strategy or node↔gateway link change** (`DM-03`); **OTA/model-governance architecture change** (`DM-04`); a routine retrained-model rollout that does **not** move a TPM toward threshold and keeps the same model family. | Standing CCB; Data-Science (STK-05) consulted for model rollouts. | **Decision within 10 business days.** |
| **C — Minor** | S3 | Isolated cloud-backend bug fix; dashboard copy/UI (subject to REQ-U-02 usability review); a non-breaking, backward-compatible cloud API addition; a threshold/config tweak proven by regression **not** to move a TPM margin and **not** on the safety/OTA surface. | Engineering-lead approval; CCB **notified**, batched weekly. | **CR-batched weekly.** |
| **D — Emergency** | S1/S2 live | Production-outage hotfix; **urgent firmware/model OTA to halt a fielded false-positive storm or a missed-detection regression** (RSK-02/RSK-03); urgent dependency/SBOM **CVE** patch (RSK-06); emergency device-identity/key revocation; **emergency fleet rollback to last-known-good model** (SCN-03, REQ-O-03). | **Async CCB-chair + Security (STK-04) + Safety (STK-06, if safety-bearing) approval**; **post-hoc full CCB minutes within 5 business days.** | **Act within hours; CR filed retroactively.** |

> **D-class is a real path, not a CCB bypass.** If it can wait for the next standing CCB, it is not D. All D-class CRs are audited quarterly (Part B §B.5). *Note: an emergency **rollback** is itself the governed recovery path (REQ-O-03 / SCN-03) — it executes within hours under D-class, with the post-hoc CR documenting why the forward image failed its cohort health check.*
> **SentinelEdge-specific class-A triggers (by definition, regardless of code/diff size):**
> 1. Any change that could create or expose an **actuation path** to the monitored machine, or weaken fail-passive behaviour, puts **MOE-07** (system-induced unsafe events, target **0**) and REQ-SAF-01 at risk → class A.
> 2. Any **model image** whose validation does not hold `TPM-01` recall and `TPM-02` FPR at/above their thresholds (RSK-01/RSK-02 — alert fatigue) → class A.
> 3. Any change to the **signing keys, verified-boot, or rollback logic** (RSK-06 — spoofed/unsigned image; SN-10 — recoverable bad update) → class A.

## A.3 The 6-Step Change-Control Process

Per ISO 10007. Step 2 — the **Initial-Review feasibility gate** — is the cheap "is this even possible / in scope / not a duplicate?" screen that kills non-starters before any analyst effort.

```
1. Submit (CR-NN)
        │
2. Initial Review (feasibility gate) ──[infeasible/dup/out-of-scope]──▶ Return/Close (no IA spent)
        │ feasible
3. Impact Analysis (IA-NN, the 5 questions) → assign class A/B/C/D
        │
4. CCB Decision ── Approve / Reject / Defer / Rework  (logged in minutes; no lone approver)
        │ approved
5. Implement & V&V ── update every affected CI; regenerate regression evidence (TC-VER-* / TC-VAL-*)
        │
6. Document & Communicate ── re-baseline affected CIs; record in status accounting; notify stakeholders
```

1. **Submit.** Requester opens `CR-NN` in the CR tool (Part A §A.7) with: title, problem/driver, proposed change (which CI/layer — firmware, model image, OTA config, cloud), requester, priority hint, acceptance criteria, linked `REQ-*`/ICD seam/`DM-*`/CIs.
2. **Initial Review (feasibility gate).** The CM (change owner) screens for gross feasibility — possible within the node compute/memory/power budget (REQ-P-02/03, REQ-O-01)? in scope per §A.1? not a duplicate? Infeasible/duplicate CRs are returned or closed here, **no impact analysis spent**.
3. **Impact Analysis.** The analyst answers the 5 questions (§A.4), produces `IA-NN`, and proposes class A/B/C/D plus a version bump (breaking/feature/fix).
4. **CCB Decision.** The board makes the **final** Approve / Reject / Defer / Rework call, logged in CCB minutes. Class A requires the §A.5 quorum (Safety + Security; Data-Science for model/OTA changes).
5. **Implement & V&V.** The implementer codes the change and updates **every** affected CI — `SysRS.md` REQ history, the ICD version, the model image + lineage record, OTA/signing config, the safety case — then regenerates regression evidence. **No SentinelEdge change closes until the relevant regression suites re-run on the HIL fleet** (per Phases 07/08/10): for a **model change**, the held-out labelled validation set must hold `MOP-01` recall ≥ target and `MOP-02` FPR ≤ target (TPM-01/-02) and on-target latency/footprint (TPM-03/-05); for an **OTA/rollback change**, the forced-failure canary→rollback test (REQ-F-06, REQ-O-03) must leave **no node non-functional**; for a **safety-surface change**, the FMEA / design inspection re-confirms **no actuation path exists** (REQ-F-04, REQ-SAF-01). The candidate must **meet or beat the current baseline** — MOE-07 induced-unsafe-events must stay **0**.
6. **Document & Communicate.** Re-baseline the affected CIs (§A.6), record the change in status accounting (Part B §B.4), and notify stakeholders per the IA's stakeholder list. **Safety-bearing changes additionally notify EHS (STK-06) and, where the IEC 61508 safety case is touched, the certification body (STK-09); model/OTA changes notify Data-Science (STK-05) and update the model registry lineage record (REQ-F-07).**

## A.4 Impact Analysis — the 5 questions (IA-NN template)

Risk is scored `Likelihood × Impact` per Conventions §5.3 and ISO 31000; new risks feed the living `Risk_Opportunity_Register.md`.

1. **Scope** — Which CIs, blocks ([SysRS §13](../Phase_02_Requirements/SysRS.md#13-design-preview--top-level-blocks--strategic-decisions)), `REQ-*`, ICD seams, `DM-*`, and baselines are affected? *Walk the Phase-02 trace links ([SysRS §12](../Phase_02_Requirements/SysRS.md#12-traceability-sn--req--tc-ver-tbd)) forward **and** backward* — e.g. a touch on REQ-P-01 (recall/FPR) pulls in SN-01, SN-02, REQ-P-02, REQ-P-03, MOP-01/-02 → TPM-01/-02, DEC-02/DM-02, SCN-01, and the model-validation regression set.
2. **Risk & dependencies** — Regression risks (score a new/updated `RSK-NN`), coupled CRs, and **TPM-margin erosion** against `TPM-01` (recall threshold), `TPM-02` (FPR threshold), `TPM-03` (inference-latency threshold), `TPM-04` (battery-life threshold), `TPM-05` (model-footprint threshold). Does the change move any TPM toward its threshold? *The model quadrilemma (RSK-01) means a single model swap routinely moves TPM-01/-03/-05 together — IA must report all of them, not just the one the change "intended" to improve.* Consult `Threat_Model.md` (`THR-*`) for OTA/identity/security-surface changes.
3. **Cost & schedule** — Delta in engineer-effort and weeks/sprints; re-test scope (which `TC-VER-*`/`TC-VAL-*` re-run — `TC-VER-TBD` until Phase 07 assigns IDs); on-target re-profiling cost (HIL rig time for latency/footprint/power); BOM impact if hardware-touching (REQ-C-01).
4. **Compliance & safety** — Does it trigger a **hazard re-analysis** (`Hazard_Log.md` HAZ-01) and/or an **IEC 61508 safety-case re-assessment** (REQ-D-01, REQ-SAF-01/02)? a **threat-model review** (`THR-*`, for OTA/identity/signing changes)? an **EMC/radio re-test** (REQ-D-03, if RF-touching) or a **RoHS/WEEE/battery re-conformity** (REQ-D-02, if hardware/battery-touching)? *Unlike the SaaS sibling, SentinelEdge has a LIVE safety thread — any change on the advisory-only / fail-passive surface forces the HAZ-01 + IEC 61508 re-analysis, and Safety/EHS (STK-06) is mandatory class-A quorum.* A model change additionally re-checks REQ-F-07 lineage/explainability retention.
5. **Stakeholders** — Who must **approve** vs. be **notified**? Map to: Engineering (firmware/cloud), **Safety/EHS (STK-06)**, **Security & OT (STK-04)**, **Data-Science/Fleet (STK-05)**, Reliability/Maintenance Manager (STK-01), Product/CPO (STK-08), Sustainability (STK-07, for battery/e-waste-affecting changes), Certification Body/Regulator (STK-09, for safety-case / EMC / battery evidence-affecting changes).

**IA-NN closes with a recommendation:** proposed class, decision (Approve/Reject/Defer/Rework), version bump (breaking/feature/fix), and any conditions.

## A.5 CCB — composition, quorum, cadence

| Role | Member (SentinelEdge stakeholder) | Standing? |
|---|---|---|
| **Chair** | Configuration Manager (with Lead Systems Engineer) | Yes |
| Safety / EHS Officer | STK-06 | Yes |
| Security / OT & Plant IT | STK-04 | Yes |
| Data-Science / Fleet lead (model lifecycle, drift, OTA) | STK-05 | Yes |
| Firmware / Hardware Engineering Lead | Engineering | Yes |
| Cloud / Backend Engineering Lead | Engineering | Standing |
| Product / Commercial Owner (CPO) | STK-08 | Standing (decision authority on B-feature scope) |
| Reliability / Maintenance Manager liaison | STK-01 | Consulted for alert-behaviour / threshold / CMMS changes |
| Sustainability liaison | STK-07 | Consulted for battery / e-waste / disposal-affecting changes |
| Certification / Regulator liaison | STK-09 | Consulted for safety-case / EMC / battery-conformity-affecting changes |

- **Quorum (general):** Chair + Engineering + 3 of {Safety/EHS, Security/OT, Data-Science, Product}.
- **Class-A quorum (hard-wired):** Chair **+ Safety/EHS (STK-06) + Security/OT (STK-04) present, with Engineering**; **Data-Science (STK-05) additionally mandatory for any model-image or OTA-trust-chain change**. No class-A decision without Safety and Security — SentinelEdge's advisory-only safety property and its signed-OTA trust chain are its non-negotiable surfaces (here a real EHS/safety officer sits in quorum, *not* a privacy substitute — contrast the SaaS sibling, which has no safety thread).
- **Cadence:** tie to the Phase-01 governance rhythm — the cloud/edge-AI tracks run **Agile 2-week sprints** (Concept §4), so the **standing CCB convenes once per sprint**; the **V-Model firmware/safety track** additionally brings changes to the CCB at each design-level/HIL milestone. An **async emergency channel** handles class D. (Specific recurring dates are owed by Phase-00 `SEMP.md` — `TODO: confirm CCB cadence + day with PMO`.)
- **Minutes** live at `Phase_09_Change_Config/ccb-minutes/YYYY-MM-DD.md` (chair, attendees, quorum y/n, CRs-reviewed table, decisions, conditions, action items, next meeting).

## A.6 Re-baselining rules (semver — fixed by ISO 10007, **not** keyed to class)

Bump by the **nature** of the change, never by class letter (per Conventions §6 and the skill's hard rule):

- **Documents `vMAJOR.MINOR`** (SysRS, this CMP, ICD, Architecture, the safety case): **MINOR** for tracked edits/additions; **MAJOR** at each re-baseline (breaking removal/restructure). A re-baselined doc's status becomes exactly `Baseline (<GATE>-approved YYYY-MM-DD)`.
- **Firmware / build-config recipe semver `MAJOR.MINOR.PATCH`:** **MAJOR = breaking** (an existing node↔gateway message-schema, OTA-image-format, or external API contract breaks), **MINOR = backward-compatible feature**, **PATCH = fix**. A class-B feature is *usually* a MINOR bump and a class-A breaking ICD change a MAJOR bump — but it is the **breaking-ness**, not the class, that decides.
- **Embedded model image semver `MAJOR.MINOR.PATCH`** (its own CI, separate from firmware): **MAJOR = breaking** (input-feature contract or runtime-ABI change requiring a matching firmware version — the OTA must enforce the firmware↔model compatibility pair), **MINOR = retrain with same architecture/IO that improves accuracy**, **PATCH = threshold/calibration-only adjustment. *A model re-baseline records the training-dataset version and lineage ID (REQ-F-07) so every fielded prediction remains traceable.*
- **Version-bump is a CCB exit criterion** — no approved change closes until every affected CI's version is bumped, the firmware↔model compatibility pair is recorded, and the change is logged in status accounting (Part B §B.4). No silent baseline drift.

## A.7 Tooling

| Tool | Purpose |
|---|---|
| **Jira (project `SE-CR`)** | CR lifecycle, IA records, audit trail, class/severity fields; safety-CR sub-workflow gated by EHS sign-off. |
| **Git + signed tags (`baseline-vX.Y`)** | Firmware, IaC, cloud services, OTA/signing config, and the safety case under version control; protected `main`; **signed commits** (provenance feeds REQ-SEC-03 SBOM). |
| **Model registry + MLOps store** | Versioned model images, training-dataset versions, and **training-data lineage** (REQ-F-07); promotes a model image through eval → canary → fleet; the registry is the system of record for the firmware↔model compatibility pair and the drift baseline (REQ-P-04). |
| **OTA service + signing PKI / HSM** | Signs firmware + model packages, stages canary cohorts, executes automatic rollback (REQ-F-06, REQ-O-03); keys held in HSM (REQ-SEC-02). The OTA campaign config is a controlled CI. |
| **SBOM pipeline (SPDX/CycloneDX)** | Every released firmware/model image ships an SBOM traceable to build provenance (REQ-SEC-03); feeds CVE-driven D-class CRs (RSK-06). |
| **HIL regression fleet + CI gate (Phases 07/10)** | The release gate every class-A/B firmware/model/OTA CR must pass: model recall/FPR (TPM-01/-02), on-target latency/footprint (TPM-03/-05), forced-failure canary→rollback (REQ-O-03), and FMEA "no actuation path" (REQ-SAF-01); immutable test exports retained with the CR. |

"We'll decide later" means no record — the tools above are selected now so the first CR can be filed today.

## A.8 Worked Example — `CR-01`: OTA a retrained, re-quantized embedded model to suppress a fielded false-positive storm — end-to-end

> One realistic mid-life CR walked through all six steps. **Numbers here are illustrative for this example — calibrate to real measurement before adopting.**

**1 — Submit.** `CR-01` "Roll out **model image v2.0.0** — retrained on three new months of fleet data and re-quantized (INT8) — to suppress a false-positive storm on variable-speed-drive pumps, where seasonal load swings are being misread as incipient bearing faults." Requester: Data-Science/Fleet lead (STK-05), endorsed by the Reliability Manager (STK-01) who is seeing alert fatigue in the field. Priority hint: High. Driver: the fielded false-positive rate has crept above the `MOP-02`/`TPM-02` threshold — the top adoption risk **RSK-02** (alert fatigue) — and Phase-10 drift telemetry has flagged accuracy drift (RSK-03) on this asset class.

**2 — Initial Review (feasibility gate).** CM screens: feasible (the new image is INT8-quantized and pre-checked to fit the node flash/RAM budget per REQ-P-03 — it must, or it is returned here), in scope (it changes the embedded model image — a baselined edge-AI surface), not a duplicate. **But** it changes a model image whose validation must hold TPM-01/-02 *and* it re-quantizes (touching TPM-03/-05) — flag forward to IA as a **class-A model change by the §A.2 trigger**. Passes the gate.

**3 — Impact Analysis (`IA-01`).**

| # | Question | Finding |
|---|---|---|
| 1 | **Scope** | Changes the embedded model image ⇒ touches **REQ-F-01/02** (the model that scores windows + raises on-device alerts), **REQ-P-01** (recall/FPR), **REQ-P-02** (latency), **REQ-P-03** (flash/RAM footprint), **REQ-F-07** (new lineage ID + explanation features), **REQ-P-04** (drift baseline reset), and **REQ-F-06/REQ-O-03** (delivered via signed OTA + rollback). Blocks: **Edge-AI Inference Engine**, **Model Lifecycle/Drift+Lineage**, **OTA Update Manager** ([SysRS §13](../Phase_02_Requirements/SysRS.md#13-design-preview--top-level-blocks--strategic-decisions)). CIs: model image (CI-06), training-dataset+lineage (CI-07), OTA campaign config (CI-08). Resolves the open trade in decision **`DM-02`** (model family/footprint) for this asset class. Trace pulls in **SN-01, SN-02** (early, trustworthy detection), **SN-03** (on-device), **SN-04** (updatable without truck rolls), **SN-09** (lineage), **SCN-01** (nominal detection), **SCN-03** (OTA rollout with rollback), and the model-validation + canary regression sets. |
| 2 | **Risk & dependencies** | Directly attacks **RSK-02** (false-positive/alert fatigue) and **RSK-03** (field drift). **TPM check (all five, per the quadrilemma RSK-01):** **TPM-02 FPR improves** (the point of the change); **TPM-01 recall** must be re-confirmed not to regress on the held-out set; **TPM-03 latency** and **TPM-05 footprint** are re-profiled because of the INT8 re-quantization; **TPM-04 battery** is checked since inference-cost-per-window changes duty-cycle energy. New `RSK-08` "re-quantization to INT8 silently drops recall on a rare fault class not represented in the new training data," L3×I4 = **High**. Coupled to no other open CR; depends on the signing PKI and rollback path (RSK-06 mitigations) already in place. |
| 3 | **Cost & schedule** | ~1.5 engineer-weeks (retrain + INT8 quantization + on-target profiling + canary campaign authoring + evals). Re-test scope: **TC-VER-TBD** model-validation suite (confusion matrix on held-out labelled set), **TC-VER-TBD** on-target latency+footprint profiling, **TC-VER-TBD** forced-failure canary→rollback on the HIL fleet, **TC-VAL-TBD** field-acceptance with STK-01 on the canary cohort. HIL rig time booked. No BOM impact (software-only OTA). |
| 4 | **Compliance & safety** | **No new actuation path and no change to fail-passive behaviour** — the model only scores and advises; REQ-F-04 / REQ-SAF-01 are **re-inspected (FMEA) and confirmed unaffected**, so **HAZ-01 / IEC 61508 re-assessment is screening-only, not full re-certification** (recorded in `Hazard_Log.md`). **Threat-model review (`THR-*`)** confirms the image is delivered only via the existing signed-OTA + verified-boot trust chain (REQ-SEC-02) and ships a fresh **SBOM** (REQ-SEC-03). REQ-F-07 lineage retained (new dataset version + lineage ID recorded). No EMC/radio (REQ-D-03) or RoHS/WEEE (REQ-D-02) impact (software-only). |
| 5 | **Stakeholders** | **Approve:** Safety/EHS (STK-06, screening sign-off that advisory-only is intact), Security/OT (STK-04, OTA trust chain), Data-Science (STK-05, model owner). **Notify:** Reliability Manager (STK-01, behaviour change on his assets), Product/CPO (STK-08), Certification liaison (STK-09, safety-case screening note on file). |

**Recommendation:** **Class A** (a model image whose validation gates TPM-01/-02 and that re-quantizes TPM-03/-05 — class-A by SentinelEdge's §A.2 trigger #2; delivered through the class-A OTA trust chain). Version bump: **model image MINOR → v2.0.0** is recorded as a **MAJOR model-image bump** *only because the INT8 re-quantization changes the runtime ABI and therefore requires a matching firmware floor* — the firmware↔model compatibility pair is pinned in the OTA campaign so older firmware will not accept v2.0.0. **Doc MINOR** to SysRS (REQ-P-01/-04 history note: new validated FPR + reset drift baseline). No firmware code change beyond the recorded compatibility-floor metadata.

**4 — CCB Decision.** Class-A quorum present (Chair + Safety/EHS STK-06 + Security/OT STK-04 + Data-Science STK-05 + Engineering). **Approved with conditions:**
1. **Canary first.** Stage to a small canary cohort of the affected pump asset class (SCN-03); monitor live `MOP-01` recall and `MOP-02` FPR telemetry for one full duty cycle before any fleet expansion — **no big-bang rollout**.
2. **Rollback armed.** The OTA campaign must hold the previous **model v1.x as last-known-good**; a forced-failure canary→rollback dry-run (REQ-O-03) must pass on the HIL fleet before the live canary, proving **no node is left non-functional**.
3. **Recall floor.** Mitigate the new `RSK-08` (rare-fault recall drop) — the held-out validation set **must include the under-represented rare-fault class**, and the candidate must hold **MOP-01 recall ≥ target (TPM-01)** *and* **MOP-02 FPR ≤ target (TPM-02)** simultaneously, with **TPM-03 latency / TPM-04 battery / TPM-05 footprint** within threshold, before fleet expansion.
4. **Lineage + safety record.** Record the new training-dataset version and lineage ID (REQ-F-07) in the model registry, and file the EHS screening note (advisory-only re-confirmed) in `Hazard_Log.md` before GA.

**5 — Implement & V&V.** Model v2.0.0 retrained, INT8-quantized, and signed; OTA campaign authored with the firmware-floor compatibility pair and v1.x pinned as last-known-good. Regression re-run on the HIL fleet: held-out validation shows **MOP-02 FPR back below threshold** and **MOP-01 recall held at/above baseline including the rare-fault class** (TPM-01/-02 met); on-target profiling shows **TPM-03 latency and TPM-05 footprint within budget** after INT8 (in fact improved footprint); **TPM-04 battery** energy-per-window unchanged-to-improved; forced-failure canary→rollback leaves **no node non-functional** (REQ-O-03 met); FMEA re-inspection confirms **no actuation path** (REQ-SAF-01, MOE-07 held at **0**). Evidence linked to the new `TC-VER-TBD`/`TC-VAL-TBD` (IDs resolved by Phases 07/08). Live canary on the pump cohort confirms field FPR improvement before fleet expansion.

**6 — Document & Communicate.** Re-baseline: **model image CI-06 → v2.0.0** (MAJOR, runtime-ABI/quantization change with firmware-floor pin); **training-dataset+lineage CI-07** bumped (new dataset version recorded); **OTA campaign config CI-08** bumped; **`SyRS-SENTINELEDGE` v1.0 → v1.1** (REQ-P-01 validated-FPR history note + REQ-P-04 drift-baseline reset). `DM-02` recorded as **decided for this asset class** (feeds the Phase-05 Decision Register). Status-accounting ledger (Part B §B.4) updated; STK-01/STK-08/STK-09 notified; EHS screening note filed in `Hazard_Log.md`; CCB minutes filed. **`CR-01` → Closed.**

**CR-01 ledger row** (see CR Log below):

| CR | Title | Class | Sev | IA | CCB | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| **CR-01** | OTA retrained INT8 model v2.0.0 to suppress VSD-pump FP storm (resolves DM-02 for this asset class) | A | S2-driver | IA-01 | Approved (w/ conditions) | CI-01 (SysRS), CI-06 (model image), CI-07 (dataset+lineage), CI-08 (OTA campaign), CI-12 (Threat model), CI-13 (Hazard log/safety case) | model image v2.0.0 (MAJOR); SysRS v1.1; OTA campaign + dataset bumped | Closed |

## A.9 Cross-reference — continuous validation → Phase 10

The **HIL regression gate** every class-A/B CR must pass, post-deploy **fleet drift/anomaly monitoring** (REQ-P-04, RSK-03), false-positive-rate observability (TPM-02), battery-telemetry, staged canary rollout and automatic rollback (SCN-03), and the SLOs/`SLO-*` and runbooks (`RB-*`) are owned by **Phase 10** (Operations & Continuous Validation). This phase **invokes** that gate (Step 5) but does not re-author the CI/CD, MLOps, or shift-left pipeline. SCN-02 (connectivity loss), SCN-03 (OTA rollout/rollback), and SCN-04 (commissioning) are the operational instances those SLOs protect.

---

# Part B — Configuration Management Plan (the 4 ISO 10007 functions)

## B.1 Purpose & Scope

Establish CM discipline so every SentinelEdge baseline is **identified, controlled, status-accounted, and audited** (ISO 10007:2017 + IEEE 828; realising the ISO/IEC/IEEE 15288:2023 Configuration & Information Management processes). CM authority is held by the **Configuration Manager**, chartered by Phase-00 `SEMP.md` (`TODO: confirm CM authority + document-control rules — owed by Phase 00`). SentinelEdge's Formal overlay (safety/RAMS + edge-AI V&V) means the model image, its training data, the signing keys, and the OTA campaign config are first-class CIs, not loose files.

## B.2 Configuration Identification (CM function 1) — the CI register

The controlled units. Naming: documents use `vMAJOR.MINOR`; firmware/build recipe, model images, and config CIs use **semver `MAJOR.MINOR.PATCH`** (per Conventions §6). CR series: `CR-NN`. CI series: `CI-NN`.

| CI | Item | Type | Owner | Controlling baseline | Version |
|---|---|---|---|---|---|
| **CI-01** | `SysRS.md` — System Requirements Spec (REQ-*, MOE/MOP/TPM) | doc | Lead Systems Engineer | Functional @ SRR | v1.0 |
| **CI-02** | `Concept.md` — Mission/StRS/OpsCon (STK-*, SN-*, SCN-*) | doc | Lead Systems Engineer | Functional @ SRR | v1.0 |
| **CI-03** | `Architecture_Description.md` — 10 blocks (SysRS §13), node/gateway/cloud tiers | doc | Architect | Allocated @ PDR | `TODO` (owed Phase 04) |
| **CI-04** | `ICD.md` — node↔gateway mTLS (REQ-INT-01), gateway↔cloud TLS 1.3 + CMMS (REQ-INT-02), OTA channel seam | doc | Architect | Allocated @ PDR → frozen @ CDR | `TODO` (owed Phase 04) |
| **CI-05** | **Node firmware / build recipe** (sensing, edge-AI runtime, power, secure boot — REQ-F-01, REQ-P-02, REQ-O-01, REQ-SEC-02) | sw build | Firmware Eng | Product @ CDR | semver `TODO` (owed Phase 06) |
| **CI-06** | **Embedded AI model image** (deployed model — REQ-F-01/02, REQ-P-01/02/03; carries the accuracy↔footprint quadrilemma RSK-01) | model | Data-Science (STK-05) | Product @ CDR | semver `TODO` |
| **CI-07** | **Training dataset + model-data lineage** (dataset version, lineage IDs retained with alerts — REQ-F-07; drift baseline — REQ-P-04) | dataset | Data-Science (STK-05) | Functional → maintained | `TODO` |
| **CI-08** | **OTA campaign + signing config** (signed firmware/model rollout, canary cohort, automatic rollback, firmware↔model compatibility pair — REQ-F-06, REQ-O-03, REQ-SEC-02) | config | Data-Science (STK-05) + Security (STK-04) | Product @ CDR | semver `TODO` |
| **CI-09** | **Device-identity / secure-element provisioning config** (unique per-device keys, attestation — REQ-SEC-01) | config | Security/OT (STK-04) | Product @ CDR | semver `TODO` |
| **CI-10** | **Cloud fleet backend** (device & model registry, alert routing, CMMS integration, dashboards — REQ-F-05/07, REQ-INT-02) | sw build | Cloud Eng | Product @ CDR | semver `TODO` (owed Phase 06) |
| **CI-11** | **SBOM set** (SPDX/CycloneDX per released firmware + model image — REQ-SEC-03) | doc | Security/OT (STK-04) | Product @ CDR | per-release `TODO` |
| **CI-12** | `Threat_Model.md` (THR-*, STRIDE) | doc | Security/OT (STK-04) | Functional → maintained | `TODO` |
| **CI-13** | `Hazard_Log.md` + IEC 61508 safety case (HAZ-01, SIL determination — REQ-D-01, REQ-SAF-01/02) | doc | Safety/EHS (STK-06) | Functional → maintained (Formal) | `TODO` |
| **CI-14** | This `Change_Config_Mgmt.md` plan | doc | Configuration Manager | n/a (governance) | v1.0 |

> *Why model, dataset, OTA, identity, SBOM, and the safety case are first-class CIs?* These are exactly the artifacts whose **silent drift causes a detection regression, a bricked/spoofed node, an unsafe-behaviour exposure, a supply-chain compromise, or a failed audit** (skill's CI test). Putting them under `CI-NN` control is the direct mitigation for **RSK-01** (model footprint/accuracy), **RSK-03** (field drift), **RSK-04** (safety/actuation), and **RSK-06** (spoofed/unsigned image). The model image (CI-06) and its training data (CI-07) are versioned **separately** so a prediction's lineage (REQ-F-07) is always reconstructable, and the OTA campaign (CI-08) records the firmware↔model compatibility pair so a model is never delivered to incompatible firmware.

## B.3 Baseline Management (CM function 2)

SentinelEdge reuses the three canonical baselines (Conventions §3); a baselined artifact's status string is exactly `Baseline (<GATE>-approved YYYY-MM-DD)`. Changes only via a `CR-NN`.

| Baseline | Established at | Contains | Current status |
|---|---|---|---|
| **Functional / Requirements** | **SRR** | `Concept.md` (CI-02), `SysRS.md` (CI-01) — REQ-*, MOE/MOP/TPM set; `Threat_Model.md` (CI-12) and `Hazard_Log.md`/safety case (CI-13) maintained alongside (Formal) | `Draft` — SysRS pending peer-review walkthrough + MCR-condition retirement ([SysRS §15, §16](../Phase_02_Requirements/SysRS.md#16-srr-exit-gate)). On sign-off → `Baseline (SRR-approved <date>)`. |
| **Allocated** | **PDR** | `Architecture_Description.md` (CI-03), `ICD.md` draft (CI-04) — 10 blocks + requirement-to-block allocation + ICD draft | `TODO` — owed by Phase 04 (PDR). PDR also clears the Concept §5 Conditional-Go conditions (RSK-01 model feasibility, RSK-02 FPR, RSK-04 advisory-only safety case, RSK-05 battery). |
| **Product** | **CDR** | **Frozen ICDs** (CI-04), detailed design, node firmware (CI-05), embedded model image (CI-06), OTA/signing config (CI-08), device-identity config (CI-09), cloud backend (CI-10), SBOM set (CI-11) | `TODO` — owed by Phase 06 (CDR). ICDs **freeze at CDR**. |

> SentinelEdge's Formal overlay means CI-06 (model image), CI-08 (OTA/signing), CI-09 (device identity), and the firmware (CI-05) roll into the **Product baseline at CDR** and thereafter move **only** through a CR — this is what stops the model accuracy/footprint, the OTA trust chain, and the device-identity posture from regressing between iterations (Concept §4). The safety case (CI-13) and threat model (CI-12) are maintained continuously under the Formal/independent-V&V discipline from the Functional baseline onward.

## B.4 Configuration Status Accounting (CM function 3)

The **CM ledger** answers "which version of every CI is current, and what changed since SRR?" Maintained at `Phase_09_Change_Config/status-accounting.md`.

Per-CI columns: **CI · current version · controlling baseline · open CRs · closed CRs · status (`Draft`/`In Review`/`Baseline (...)`/`Superseded`)**. Example rows after `CR-01`:

| CI | Version | Baseline | Open CRs | Closed CRs | Status |
|---|---|---|---|---|---|
| CI-01 SysRS | v1.1 | Functional @ SRR | — | CR-01 | Baseline (SRR-approved `TODO`) |
| CI-06 Model image | semver v2.0.0 (MAJOR) | Product @ CDR | — | CR-01 | `TODO` (pre-CDR) |
| CI-07 Dataset + lineage | next-version (new dataset) | Functional → maintained | — | CR-01 | `TODO` |
| CI-08 OTA campaign/signing | semver MINOR | Product @ CDR | — | CR-01 | `TODO` (pre-CDR) |
| CI-12 Threat model | next-MINOR | Functional → maintained | — | CR-01 | `TODO` |
| CI-13 Hazard log/safety case | next-MINOR (screening note) | Functional → maintained | — | CR-01 | `TODO` |

- **Cadence:** ledger updated at **each CCB** (Step 6 exit) and snapshotted **once per sprint** (and at each V-Model design-level/HIL milestone for firmware/safety CIs).
- **Owner:** Configuration Manager.
- **Report:** a per-sprint "baseline status" summary to STK-01/STK-04/STK-05/STK-06/STK-08 — current versions (including the **firmware↔model compatibility pair**), CRs opened/closed, and any **TPM-margin movement** (TPM-01 recall / TPM-02 FPR / TPM-03 latency / TPM-04 battery / TPM-05 footprint) flagged from IA question 2 (feeds the cross-cutting `TPM_Tracker.md`).

## B.5 Configuration Audits — FCA & PCA (CM function 4)

Both audits run at **PRR** (Conventions §3). Owner: Configuration Manager + QA (with independent-V&V witness on the Formal safety/edge-AI threads). Entry criterion: all in-flight CRs closed and re-baselined. Every discrepancy becomes a new `CR-NN`.

- **FCA (Functional Configuration Audit) — *did we build it to spec?*** Verifies SentinelEdge's *achieved* performance meets the functional baseline: **every `REQ-*` has closed V&V evidence** (the [SysRS §11/§12](../Phase_02_Requirements/SysRS.md#11-verification-seed--phase-07-authoritative) seed matured into Phase-07 `TC-VER-*` / Phase-08 `TC-VAL-*`), and the trust-critical measures are met — **MOP-01 recall ≥ target / MOP-02 FPR ≤ target** (REQ-P-01, TPM-01/-02), **MOP-03 latency** and **MOP-04 footprint** within budget (REQ-P-02/03, TPM-03/-05), **MOP-10 battery life ≥ target** (REQ-O-01, TPM-04), **MOP-07 fleet update + rollback reach** (REQ-F-06/REQ-O-03), **MOE-07 system-induced unsafe events = 0** (REQ-SAF-01), and the **IEC 61508 safety case + FMEA show no actuation path and zero open S1/S2 safety findings** (HAZ-01, RSK-04 — a PRR exit per Conventions §3), plus a clean independent edge-AI V&V (accuracy/drift/rollback).
- **PCA (Physical Configuration Audit) — *does the as-built match the as-documented?*** Verifies the as-built/as-deployed product matches the product-baseline docs: the released **node firmware (CI-05)** matches the tagged baseline; the fielded **embedded model image (CI-06)** version and its **firmware↔model compatibility pair** match what the Product baseline + OTA campaign (CI-08) record; the **device-identity provisioning config (CI-09)** matches; the **cloud backend (CI-10)** deploy matches its tag; the **SBOM set (CI-11)** matches the actual shipped components (no undeclared dependency — RSK-06); and the live **ICDs (CI-04)** match the frozen-at-CDR versions. *An undocumented model image fielded on the wrong firmware, or a node running an SBOM-undeclared component, is a PCA finding* — the most likely SentinelEdge PCA failure modes (RSK-01 footprint mismatch, RSK-06 supply-chain), which is why CI-05/CI-06/CI-08/CI-11 are first-class CIs.

| Finding type | Goes to |
|---|---|
| A `REQ-*` lacks closed V&V evidence / a trust-measure misses target / a safety finding is open | **FCA** → new `CR-NN` |
| As-built firmware / model image / OTA pair / device-identity / cloud / SBOM ≠ as-documented baseline | **PCA** → new `CR-NN` |

## B.6 Tooling & repositories

Per Part A §A.7 — Jira (`SE-CR`) for CRs, Git + signed tags for firmware/cloud/IaC/OTA-config and the safety case, the **model registry + MLOps store** for model images and training-data lineage (CI-06/CI-07), the **OTA service + signing PKI/HSM** for CI-08, the **SBOM pipeline** for CI-11, `ccb-minutes/` + `status-accounting.md` in-repo, and the **HIL regression fleet + CI gate** as the model/OTA/safety release gate. Regulator/audit-required immutable exports (IEC 61508 safety-case evidence, EMC/radio + RoHS/WEEE conformity, SBOMs, sanitization records per REQ-SEC-04, and model-validation reports) are retained with the CR (retention ≥ REQ-O-04 audit window).

## B.7 Standards anchor

| Concern | Canonical citation (Conventions §9) |
|---|---|
| Configuration management | **ISO 10007:2017** (+ EIA-649 / **IEEE 828**) |
| SE lifecycle (CM & Information Mgmt processes) | **ISO/IEC/IEEE 15288:2023** |
| Impact-analysis risk scoring | **ISO 31000:2018** |
| Quality / audit basis (FCA/PCA) | **ISO 9001:2015** |
| Functional safety (class-A IA Q4 hazard/safety re-analysis) | **IEC 61508** (SIL-rated advisory function, HAZ-01) |
| Security posture (class-A IA Q4 threat-model review) | **ISO/IEC 27001:2022** · **NIST SP 800-53 Rev. 5** · **NIST SP 800-160** · SBOM (SPDX/CycloneDX) |
| Secure sanitization (decommission CR — REQ-SEC-04) | **NIST SP 800-88 Rev. 1** |
| Battery / e-waste conformity (hardware-touching CR — REQ-D-02) | **RoHS / WEEE** + battery transport/disposal |

Unlike the SaaS sibling (information system, safety class tailored out), SentinelEdge carries a **LIVE IEC 61508 functional-safety obligation** (advisory-only SIL-rated function, HAZ-01) — so the mandatory class-A re-analysis here is the **hazard re-analysis + IEC 61508 safety-case re-assessment** (CI-13), *in addition to* the threat-model review (CI-12). DO-178C / ISO 26262 / IEC 62304 do **not** apply (not airborne, automotive, or medical software).

---

## CR Log (ledger — `CR_Log` view)

| CR | Title | Class | Sev | IA | CCB decision | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| **CR-01** | OTA retrained INT8 model v2.0.0 to suppress VSD-pump FP storm (resolves DM-02 for this asset class) | A | S2-driver | IA-01 | Approved (w/ conditions) | CI-01, CI-06, CI-07, CI-08, CI-12, CI-13 | model image v2.0.0 (MAJOR); SysRS v1.1; OTA campaign + dataset bumped | Closed |

*(Subsequent CRs append here; IDs are stable for project life — never renumbered, retired with a `(deprecated)` note.)*

---

## Exit-gate checklist — "Baselines current" (Conventions §1)

- [x] **CI register** established — CI-01…CI-14 with item, type, owner, controlling baseline, version scheme (post-PDR/CDR versions marked `TODO`/owed); model image, training data, OTA, identity, SBOM, and safety case are first-class CIs.
- [x] **Three baselines** identified (Functional @ SRR · Allocated @ PDR · Product @ CDR) with current version + `Baseline (...)` status (allocated/product owed by Phase 04/06).
- [x] **Change classes A/B/C/D** calibrated to SentinelEdge, each mapped to `S1–S4`; SentinelEdge-specific class-A triggers (actuation/fail-passive, model-TPM, OTA trust chain) hard-wired.
- [x] **6-step process** documented **including** the Initial-Review feasibility gate (Step 2).
- [x] **5-question impact-analysis** template included; risk scored per Conventions §5.3; TPM-01/-02/-03/-04/-05 erosion check + LIVE hazard/IEC 61508 re-analysis built in.
- [x] **CCB** composition + quorum (Safety/EHS **+ Security** mandatory for class A; Data-Science mandatory for model/OTA) + cadence (per-sprint + V-Model HIL milestones, from Phase-01 governance) captured; minutes location set.
- [x] **Re-baselining rules** defined as breaking/feature/fix semver, explicitly **not** keyed to A/B/C/D; the firmware↔model compatibility pair and version-bump are CCB exit criteria.
- [x] **Status-accounting ledger** defined with cadence (per-CCB + per-sprint + HIL milestone) + owner (CM); answers "which version is current?"; feeds `TPM_Tracker.md`.
- [x] **FCA + PCA** planned at PRR with owner (+ independent-V&V witness), entry criteria, discrepancy→CR path; trust-measure pass criteria (MOP-01/-02/-10, MOE-07, IEC 61508 safety case) named.
- [x] **CR/CM tool** selected (Jira `SE-CR` + Git + model registry + OTA/signing PKI + SBOM pipeline + HIL gate); first CR (`CR-01`) filed and walked end-to-end.
- [x] Both plans carry Conventions §6 frontmatter; worked example walked through all six steps.
- [ ] **Open TODOs:** PDR/CDR baseline versions (Phase 04/06); CCB cadence + CM authority (Phase 00 SEMP); TC-VER/TC-VAL IDs (Phase 07/08); DM-02 Decision-Register entry confirmed (Phase 05); HAZ-01 SIL target finalised (gates REQ-D-01).

**Recommendation:** governance is in place — a baselined SentinelEdge can now evolve without losing coherence, including controlled evolution of the embedded model and OTA channel. Next phase: `se-phase-10-operations` for SLOs (`SLO-*`), runbooks (`RB-*`), fleet drift/false-positive observability, the HIL/canary regression gate, and the rollback automation that this phase's changes feed.
