---
Document: Systems Engineering Management Plan — SentinelEdge
Document ID: SEMP-SENTINELEDGE-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer / Chief Engineer
---

# Systems Engineering Management Plan — SentinelEdge

This SEMP governs **how** SentinelEdge — an industrial predictive-maintenance IoT system (vibration/acoustic/temperature sensor node carrying an **embedded on-device AI model**, a local gateway, and a cloud fleet-management + analytics backend with signed OTA firmware/model updates and governed rollback) — is engineered from Agreement to Disposal. It is the **Phase 00** deliverable and exits at the **ATP (Authority to Proceed)** gate (Conventions §3). It folds in the agreement summary and project-enablement frame, defines the SE process and organization, records the tailoring decision, lays out the gate plan (ATP→DRR) and the 8-thread plan, and binds the lifecycle-model intent (provisional here; bound at MCR in [Phase 01](../Phase_01_Concept/Concept.md)).

This SEMP conforms in full to [`../../05_Conventions.md`](../../../05_Conventions.md) for all IDs, gates, T/I/A/D methods, S1–S4 severity, baselines, status strings, document frontmatter (§6), and standard citations (§9). It does **not** restate or redefine them — it cites the section. It realises the ISO/IEC/IEEE 15288:2023 **Technical-Management** (Project-Planning) processes.

> **Authoring note.** SentinelEdge is a worked example. It is treated as a **vendor product engagement**: the **supplier** is the SentinelEdge product organization; the **acquirer** is played by the internal **Product / Commercial Owner — CPO (STK-08)** acting on behalf of the launch-customer plants (primary buyer **STK-01**). Where a real contracted engagement would name an external acquirer, that role and its acceptance authority are held by STK-08. Every value a real project would measure is marked `TODO`; none are invented (the SysRS holds all thresholds as named `TODO`s — this SEMP inherits, never fills, them).

---

## 1. Purpose & scope

### 1.1 Purpose
Establish the **means to execute** the SentinelEdge build: the SE process model, the organization and decision authorities, the tailoring of the 12-stage artifact set, the gate-and-baseline plan, and the 8 cross-cutting threads — so that technical work (Phase 01 onward) starts authorised, planned, and coherent. This SEMP is the Technical-Management (Project-Planning) artifact of ISO/IEC/IEEE 15288:2023.

### 1.2 Scope
Governs all 12 stages (Conventions §1) for the system defined in [`Concept.md`](../Phase_01_Concept/Concept.md) and specified in [`SysRS.md`](../Phase_02_Requirements/SysRS.md). Because SentinelEdge is a **hybrid hardware / firmware / edge-AI / cloud** system:
- "Production" (Stage 08→PRR) covers **first-article inspection of the sensor node hardware** *and* release/deploy of the cloud backend and OTA pipeline — there *is* a manufactured product and **hardware-in-the-loop (HIL)** integration, unlike a pure-software build.
- "Disposal" (Stage 11→DRR) is **physical decommissioning** — identity revocation + secure sanitization per NIST SP 800-88 Rev. 1 (REQ-SEC-04) plus **battery/e-waste** handling under RoHS/WEEE (REQ-D-02), the path exercised by [SCN-05](../Phase_01_Concept/Concept.md#scn-05--end-of-life-decommissioning-of-a-fielded-device).
- The heaviest engineering threads are **Safety/RAMS** (IEC 61508 advisory-only function, HAZ-01), **Security** (device identity, signed OTA, SBOM), **Measurement** (the accuracy/footprint/battery/latency TPM set), and the **edge-AI model V&V** overlay (accuracy, drift, rollback) — see §6 and §8.

### 1.3 Out of scope of this SEMP
Org-level portfolio and human-resource management (`Source: acquiring org`, per the 15288 Organizational Project-Enabling scope note, Overview §3); procurement/legal depth (this is a product engagement framed light); solution detail (owned by Phases 02–05); the binding lifecycle-model choice (Phase 01 / MCR — §5 below records only the *intent*). Automatic machine actuation and the host machine's control/safety system are out of the **product** scope (advisory-only, [Concept §3](../Phase_01_Concept/Concept.md#3-scope)), not just this SEMP.

### 1.4 Agreement summary (folded in)
The companion `Agreement_Register.md` (`AGR-SENTINELEDGE-v0.1`, **TODO** — to be authored alongside this SEMP) records the full deal. Summary:

| Item | Value |
|---|---|
| Acquired thing | Industrial predictive-maintenance IoT: edge-AI sensor node (vibration/acoustic/temperature) + gateway + cloud fleet/analytics backend + signed OTA firmware/model pipeline with governed rollback. |
| For whom | Plant Reliability / Maintenance teams on rotating machinery (primary buyer **STK-01**); internal acquirer = Product / Commercial Owner **STK-08**. |
| Domain · type | Industrial IoT / edge-AI predictive maintenance · **hybrid** (hardware + firmware + edge-AI + cloud). |
| Acquisition vehicle | **Internal product charter / vendor engagement** (supplier = SentinelEdge product org; acquirer role held by STK-08). |
| Acceptance bar (preview) | The acceptance criteria `AC-*` are owned by `Agreement_Register.md` and are *measured* at **PRR** (Phase 08 Validation). They mirror the headline measures promoted to TPMs: detection accuracy/F-beta (**TPM-01** ← MOP-01 ← REQ-P-01), false-positive rate (**TPM-02** ← MOP-02 ← REQ-P-01), on-device inference latency (**TPM-03** ← MOP-03 ← REQ-P-02), service-free battery life (**TPM-04** ← MOP-10 ← REQ-O-01), model footprint (**TPM-05** ← MOP-04 ← REQ-P-03), plus the safety floor **MOE-07 = zero system-induced unsafe events** (REQ-SAF-01). Thresholds carried from [SysRS §10](../Phase_02_Requirements/SysRS.md#10-measures-of-effectiveness--performance); `TODO` items there remain `TODO` here — **no numbers are invented**. |

### 1.5 Enablement summary (folded in)
The companion `Project_Enablement_Plan.md` (`PEP-SENTINELEDGE-v0.1`, **TODO**) holds the full infrastructure/QA/KM frame; the SEMP-relevant pointers are in §6 (knowledge mgmt / CM repository) and §8 (Quality + Security threads). SentinelEdge enablement has hardware-specific facets a pure-software build lacks: a **bench/HIL rig** for firmware and OTA-rollback testing, a **signing PKI + SBOM toolchain** (SPDX/CycloneDX) for REQ-SEC-02/03, an **edge-AI training/eval/packaging pipeline** for the model lifecycle, and a **labelled fault dataset** supply (gating REQ-P-01, the open dependency in [SysRS §14](../Phase_02_Requirements/SysRS.md#14-assumptions--dependencies)). Tooling defaults to `TODO: confirm org standard` rather than inventing tool names.

---

## 2. SE process model

### 2.1 Process basis
SentinelEdge runs the ISO/IEC/IEEE 15288:2023 process groups, realised through the 12-stage spine of Conventions §1 and the V-relationship of Overview §3:
- **Agreement** processes (Acquisition / Supply) — framed here in Phase 00 (vendor engagement; acquirer role = STK-08).
- **Technical** processes — Stages 01–11 (Business/Mission Analysis → Disposal), including a manufactured-hardware Implementation/Production thread and physical Transition/Disposal.
- **Technical-Management** processes (planning, assessment & control, decision, risk, configuration, information, measurement, QA) — run as the **8 cross-cutting threads** (§8), reviewed at **every** gate.
- **Organizational Project-Enabling** — Lifecycle-Model Mgmt, Infrastructure, Quality Mgmt, Knowledge Mgmt are framed in the Enablement Plan; Portfolio & HR are `Source: acquiring org`.

### 2.2 How the 12 stages apply to SentinelEdge (hybrid tailoring)
Stages are never skipped silently; tailored-out artifacts are recorded in §6.2.

| # | Stage | SentinelEdge instantiation | Exit gate |
|---|---|---|---|
| 00 | Agreement & Enablement | This SEMP + `Agreement_Register` + `Project_Enablement_Plan`. | **ATP** |
| 01 | Concept | [`Concept.md`](../Phase_01_Concept/Concept.md) — mission, STK-01…09, SN-01…12, SCN-01…05, MOE-01…07, RSK-01…07 + OPP-01. **(Draft — exists.)** | **MCR** |
| 02 | Requirements | [`SysRS.md`](../Phase_02_Requirements/SysRS.md) — 30 REQ-* across F/U/P/O/SEC/INT/C/D/SAF, MOP-01…10, TPM-01…05, modes/states, SN→REQ trace. **(Draft — exists.)** | **SRR** |
| 03 | Modeling (MBSE) | 7-of-9 SysML `.puml` over the [SysRS §13](../Phase_02_Requirements/SysRS.md#13-design-preview--top-level-blocks--strategic-decisions) block set; State_Machine from §9 modes; Requirements_Diagram covering every REQ-*. | Model coverage |
| 04 | Architecture & Design | Architecture_Description (42010), `ICD-*` for the frozen seams (node↔gateway REQ-INT-01, gateway↔cloud REQ-INT-02, OTA channel REQ-F-06), Tech_Stack_Rationale. | **PDR** |
| 05 | Trade-off & Decision | `DM-01…05` / `DEC-01…05` — node compute/ML-runtime, model family, power/link, OTA+governance, safety partitioning (named in [SysRS §13](../Phase_02_Requirements/SysRS.md#13-design-preview--top-level-blocks--strategic-decisions)) + optional COCOMO/BOM est. | Decisions traced |
| 06 | Integration | Integration_Plan — `INC-*` increments, CI/CD, **HIL fleet rig**, OTA canary/rollback rehearsal (RSK-06). | **CDR** |
| 07 | Verification | Verification_Matrix — `TC-VER-*` resolving every `TC-VER-TBD` in [SysRS §11–12](../Phase_02_Requirements/SysRS.md#11-verification-seed--phase-07-authoritative); finalise T/I/A/D (Conventions §4). | **TRR** |
| 08 | Validation | Test_Plan, Test_Cases (`TC-VAL-*`); acceptance criteria `AC-*` executed here; **FCA/PCA + first-article inspection** of node hardware. | **PRR** |
| 09 | Change & Config Mgmt | Change/CM plans, `CR-*` log, `CI-*` register (hardware rev + firmware + **model version** + SBOM as configuration items); owns the three baselines after they are set. | Baselines current |
| 10 | Operations & Cont. Validation | Ops doc, `SLO-*` (from MOP/TPM), `RB-*` runbooks (incl. OTA-rollback runbook); continuous validation of TPM-01…05 + drift (MOP-09). | **ORR** → GA |
| 11 | Disposal & Retirement | Disposal_Plan — identity revocation + sanitization (NIST SP 800-88, REQ-SEC-04) + **battery/WEEE disposal** (REQ-D-02); lessons-learned capture. | **DRR** |

### 2.3 Technical effort planning, assessment & control
- **Planning** is **Hybrid** (§5): V-Model milestones (left/right paired, HIL-tested) on the node firmware / power / sensing / **safety-RAMS** tracks, tied to gates; rolling 2-week Agile sprints on the cloud backend, analytics, dashboards, and the **edge-AI model lifecycle** (train→eval→package→OTA). Each stage's deliverables are the Definition-of-Done for entry to its gate.
- **Assessment & control** is by **gate review** (§7) plus the cross-cutting review cadence (§8): every gate re-checks open `RSK-*`, baseline status, the five `TPM-*` margins, drift telemetry, and cost/schedule.
- **Decision management** is Stage 05 (`DM-01…05`/`DEC-01…05`); each strategic decision is auditable and traced to the REQ/SN/RSK it serves (e.g. **DEC-02** model family ↔ REQ-P-01/P-03 ↔ RSK-01).
- **Information & measurement** management is the Knowledge/CM frame (§6) and the Measurement thread (§8) — the MOE→MOP→TPM chain of [SysRS §10](../Phase_02_Requirements/SysRS.md#10-measures-of-effectiveness--performance) is the project's primary measurement instrument.

---

## 3. Organization & roles

Small RACI sufficient for gate decisions (Conventions §3). **A** = Accountable (single owner of the gate verdict), **R** = Responsible, **C** = Consulted, **I** = Informed. Named individuals are `TODO` (owed from staffing). Roles map to the Concept stakeholders (STK-*) where the same party plays an internal engineering role.

| Role | Person | Gate-decision authority (RACI) |
|---|---|---|
| Lead SE / Chief Engineer | TODO: name | **A** on all technical gates (SRR, PDR, CDR, TRR); chairs the technical review board. |
| Product / Commercial Owner (**STK-08**, internal acquirer) | TODO: name | **A** on ATP, MCR, PRR, GA (the deal/value gates); accepts deliverables, releases funding. |
| Safety / RAMS Lead (**STK-06** liaison) | TODO: name | **A** on the IEC 61508 safety-case evidence (HAZ-01, SIL determination) at PDR/CDR/PRR; **R** on REQ-SAF-01/02, REQ-D-01, REQ-F-04. |
| Edge-AI / Data Science Lead (**STK-05**) | TODO: name | **R** on the model lifecycle (REQ-P-01/04, REQ-F-07), accuracy/drift/lineage; **A** on edge-AI V&V gate evidence at TRR/PRR; owns TPM-01/02/05. |
| Firmware / Hardware Lead | TODO: name | **R** on the V-track (REQ-F-01/02/03, REQ-P-02/03, REQ-O-01/02, sensing/power); owns TPM-03/04; **C** at PDR/CDR. |
| Security Lead (**STK-04** liaison) | TODO: name | **A** on security gate evidence (threat model `THR-*`, signed-boot, SBOM) at PDR/CDR/PRR; **R** on REQ-SEC-01…04, REQ-INT-01/02, REQ-C-02. |
| QA / Verification & Validation Lead | TODO: name | **A** on TRR; **R** on Verification_Matrix (TC-VER-*) and Test_Cases (TC-VAL-*); runs FCA/PCA + first-article inspection at PRR. |
| Architecture Lead | TODO: name | **R** on Architecture_Description, ICD-*, DM-*/DEC-*; **C** at PDR/CDR. |
| CM / Release Manager | TODO: name | **R** on baselines, CR-* log, CI-* register (hardware rev + firmware + model version + SBOM); **C** at every gate (baseline status). |
| Sustainability / Compliance Lead (**STK-07** liaison) | TODO: name | **R** on REQ-D-02 (RoHS/WEEE/battery) + REQ-SEC-04 sanitization evidence; **C** at PRR/DRR. |

> The same role may be held by one person on a small team; the **A** column must always resolve to a single accountable owner per gate (no shared accountability). The Safety/RAMS Lead's **A** on the safety case reflects the Formal overlay (§6) and the IEC 61508 independence expectation.

---

## 4. Technical effort planning — cross-cutting integration

Each Technical-Management process maps to a cross-cutting thread (§8); none is re-authored here. How they are run and reviewed:

| Technical-Mgmt process | Run as thread | Cadence | Owning stage(s) |
|---|---|---|---|
| Project planning / assessment & control | This SEMP + gate reviews | Sprint/milestone + every gate | 00, all gates |
| Decision management | Decision thread → `DM-01…05`/`DEC-01…05` | At PDR-prep; ad hoc for strategic calls | 05 |
| Risk management | Risk & Opportunity register → `RSK-01…07`/`OPP-01` | Every gate + sprint/milestone risk review | cross-cutting (seeded 00) |
| Configuration management | CM thread → baselines, `CR-*`, `CI-*` | Every gate (baseline status); change on every CR | 09 |
| Information management | Knowledge/CM repository (§6) | Continuous | 00 frame → 09 |
| Measurement | Measurement thread → MOE/MOP/`TPM-01…05` tracker | Every gate (TPM margins) + drift telemetry; continuous in ops | 02 def → 06–10 track |
| Quality assurance | Quality thread → QA_Plan, FCA/PCA, first-article | Every gate; FCA/PCA at PRR | cross-cutting (seeded 00), 08 |

> **Independent V&V (IEEE 1012-2016).** Because the Safety/RAMS and edge-AI threads are Formal (§6), their verification evidence is reviewed by a party independent of the implementing lead — the QA/V&V Lead chairs TRR (**A**), and the Safety/RAMS Lead signs the IEC 61508 safety case independently of the Firmware Lead.

---

## 5. Provisional lifecycle model

**Hybrid (V-Model + Agile), with a Formal overlay on the Safety/RAMS thread and on edge-AI V&V — PROVISIONAL; bound in Phase 01 at MCR** (Conventions §3, Overview §7).

Rationale (mirrors [Concept §4](../Phase_01_Concept/Concept.md#4-lifecycle-model--rationale), recorded here as Phase 00 *intent* only — the binding decision is the MCR gate):

| Track | Model | Why |
|---|---|---|
| Node firmware, power, sensing | **V-Model** | Stable, hardware-coupled, safety-relevant; late change is costly; every design level pairs with a HIL/bench test. |
| Safety / RAMS functions | **V-Model + Formal overlay** | Rotating-machinery hazard mitigation + reliability allocation under **IEC 61508**; bidirectional traceability and independent V&V are mandatory (Conventions §8). Drives the advisory-only safety case (RSK-04, HAZ-01). |
| Cloud backend, dashboards, CMMS integration | **Agile** | Rapidly evolving, user-visible, frequent feedback; 2-week sprints. |
| Edge-AI model lifecycle (train→eval→package→OTA) | **Agile + Formal V&V overlay** | Data-driven and iterative, but accuracy/drift/rollback demand formal, gated evidence (accuracy on held-out data, drift sensitivity, canary + rollback) — drives RSK-01/02/03. |
| Scaling | **SAFe (note only)** | Recorded as a Hybrid scaling note if the org grows to multi-team; **not** a peer base model (Overview §7, Concept §4). |

**Why this and not pure Waterfall/V or pure Agile:** the manufactured sensor node, power budget, and rotating-machinery safety case force V-rigour with HIL — Agile alone cannot retire RSK-01/05 or carry an IEC 61508 case. But the cloud backend and the **edge-AI model** evolve continuously on data feedback and would be strangled by Waterfall. Tracks integrate at the **frozen seams** (node↔gateway, gateway↔cloud, OTA channel) governed by ICDs in Phase 04. Rigor is non-negotiable only where it must be — Safety/RAMS and edge-AI V&V — and is delivered by the Formal overlay, not by forcing one base model across all tracks.

---

## 6. Tailoring — Hybrid (Formal on Safety/RAMS + edge-AI V&V)

Per the [Tailoring Guide](../../../04_Tailoring_Guide.md). The engagement is **split-tailored**: the safety-critical and edge-AI threads use the **Formal** artifact set with **bidirectional** traceability (mandatory for the IEC 61508 safety thread and for regulated/safety-relevant edge-AI, Conventions §8); the cloud/app track uses a lighter Agile-aligned set. Every tailored-out artifact is recorded — Conventions §1 forbids silent skipping.

### 6.1 What stays Formal (overlay)
- **Bidirectional traceability is mandatory** on the safety and edge-AI threads (Conventions §8; already asserted in [SysRS §12](../Phase_02_Requirements/SysRS.md#12-traceability-sn--req--tc-ver-tbd)): SN-06 ⇄ REQ-F-04/REQ-SAF-01/REQ-SAF-02/REQ-D-01 ⇄ HAZ-01 ⇄ TC-VER-*; SN-01/02/03 ⇄ REQ-P-01/P-02/P-03/REQ-F-01/02 ⇄ TPM-01/02/03/05 ⇄ TC-VER-*; SN-04/SN-10 ⇄ REQ-F-06/REQ-O-03 ⇄ TC-VER-* (OTA + rollback).
- **IEC 61508 safety case** for the advisory-only function (REQ-D-01, REQ-SAF-01) with the SIL target from hazard analysis (HAZ-01, `TODO: SIL_target`) is gate evidence at PDR, re-checked at CDR/PRR; the Safety/RAMS Lead is **A** (§3). FMEA on the no-actuation claim (REQ-F-04) per [SysRS §11](../Phase_02_Requirements/SysRS.md#11-verification-seed--phase-07-authoritative).
- **Edge-AI V&V evidence** is gate evidence: model scored on a held-out labelled dataset (confusion matrix, REQ-P-01), on-target latency/footprint profiling (REQ-P-02/03), drift sensitivity (REQ-P-04/MOP-09), and a **forced-failure OTA rollback on a HIL fleet** (REQ-F-06/REQ-O-03) — with training-data **lineage** retained (REQ-F-07/REQ-O-04).
- **Security gate evidence**: device-identity attestation (REQ-SEC-01), signed/secure-boot negative test (REQ-SEC-02), SBOM review (REQ-SEC-03), and sanitization verification (REQ-SEC-04), under a STRIDE threat model (`THR-*`). Drives RSK-06.
- **Signed gate evidence** for every Safety, edge-AI, and Security gate item (the respective Lead is **A**, §3).

### 6.2 Tailored-out / tailored-down artifacts (never silently skipped — Conventions §1)
| Artifact / thread | Decision | Reason |
|---|---|---|
| Cloud/app per-sprint formal design review | **tailored down (cloud track only)** | Replaced by Agile sprint review + PR review (Inspection per Conventions §4), with a design-of-record captured at PDR/CDR. The node firmware / safety / edge-AI tracks keep full design reviews. |
| Parametric & Package SysML diagrams | **tailored down** | Default **7-of-9** working set (Conventions §7). **Parametric** is *kept on the table* for the node **power-budget/battery-life** analysis (REQ-O-01/TPM-04) and thermal margin — add it on the hardware track if the duty-cycle analysis warrants. **Package** added only if model size warrants. |
| COCOMO / full LCC depth (`COCOMO_Estimate.md`) | **tailored down (optional)** | ROM hardware-BOM + cloud-OPEX vs. avoided-downtime value suffices at Concept ([Concept §5](../Phase_01_Concept/Concept.md#5-feasibility-study-the-gate-of-this-phase)); full estimate deferred to Phase 05 unless a funding gate requires it. BOM ceiling (REQ-C-01) is `TODO`. |
| Procurement / legal depth | **tailored out (this phase)** | Vendor product engagement; `Source: acquiring org / contracts team` for any real-contract depth. |
| On-prem private-cloud deployment variant | **tailored out (initial release)** | Initial release is vendor-managed cloud ([Concept §3](../Phase_01_Concept/Concept.md#3-scope)); flagged `TODO: deployment variant`. |

> **No thread is tailored out.** Unlike a pure-software build, SentinelEdge keeps **all 8 threads alive**, including Safety/RAMS (HAZ-01) and a full hardware Production/first-article path — because the system is a manufactured, battery-powered, safety-relevant device. The §8 table makes every thread explicit.

---

## 7. Gate & baseline plan (ATP → DRR)

The canonical ladder (Conventions §3), each gate owned by exactly one stage. Gate criteria live in the owning stage and `checklists/gate-reviews.md` — not restated here.

```
ATP ─ MCR ─ SRR ─ PDR ─ CDR ─ TRR ─ PRR ─ ORR ─ GA ┄┄(operations loop)┄┄ DRR
00    01    02    04    06    07    08    10   10            10            11
```

| Gate | Owning stage | SentinelEdge "passes when…" | Status |
|---|---|---|---|
| **ATP** | 00 | This SEMP approved; `Agreement_Register` signed (vendor charter); team & funding authorised. | **This gate** (verdict §10) |
| **MCR** | 01 | Mission, OpsCon, feasibility accepted; lifecycle model **bound** (§5 → final at MCR). [Concept §10](../Phase_01_Concept/Concept.md#10-mcr-gate--mission-concept-review) records **Proceed-with-actions**: retire RSK-01/02/05 by a measured pilot; accept the advisory-only safety case (RSK-04). | Concept Draft → ready |
| **SRR** | 02 | Every REQ SMART; SN→REQ traced; **Requirements baseline** set. [SysRS §16](../Phase_02_Requirements/SysRS.md#16-srr-exit-gate) shows one open item: peer-review walkthrough + board sign-off (**TODO**). | SysRS Draft → pending peer review |
| **PDR** | 04 | Architecture approved; node compute/ML-runtime & model-family decisions (DEC-01/02) framed; ICD draft for the three seams; **Allocated baseline** set; **no critical open risk** — i.e. RSK-01 (accuracy/footprint) feasibility spike + RSK-04 advisory-only partitioning (DEC-05) accepted here. | TODO |
| **CDR** | 06 | Detailed design complete; **ICDs frozen** (node↔gateway, gateway↔cloud, OTA channel); integration plan + HIL rig ready; **Product baseline** set. | TODO |
| **TRR** | 07 | 100% requirement coverage by method; every `TC-VER-TBD` resolved; bench/HIL env + **labelled validation dataset** ready (the `TODO: dataset owed` dependency). | TODO |
| **PRR** | 08 | Validation ≥ targets; **zero S1**; FCA/PCA + first-article node inspection done; acceptance criteria `AC-*` met (incl. **MOE-07 = zero unsafe events**); ready to produce/release. | TODO |
| **ORR** | 10 | Deploy, runbooks (`RB-*` incl. OTA-rollback), `SLO-*`, on-call, fleet rollback all in place; TPM-01…05 + drift instrumented. | TODO |
| **GA** | 10 | Live across the managed fleet; error budgets honoured (continuous thereafter). | TODO |
| **DRR** | 11 | Per-device retirement plan, sanitization (NIST SP 800-88, REQ-SEC-04), battery/WEEE disposal (REQ-D-02), audit/archival approved. | TODO |

**Baselines** (established at gates, frozen thereafter; changes only via `CR-*` in Stage 09, Conventions §6):

| Baseline | Set at | Contains (SentinelEdge) |
|---|---|---|
| Functional / Requirements baseline | **SRR** | [Concept StRS](../Phase_01_Concept/Concept.md#6-stakeholder-needs--strs-problem-space-solution-free) (SN-01…12), [SysRS](../Phase_02_Requirements/SysRS.md) (REQ-* ×30), MOE-01…07 / MOP-01…10 / TPM-01…05 set. |
| Allocated baseline | **PDR** | Architecture, REQ→block allocation (per [SysRS §13](../Phase_02_Requirements/SysRS.md#13-design-preview--top-level-blocks--strategic-decisions)), ICD-* draft for the three seams. |
| Product baseline | **CDR** | Frozen ICD-*, detailed design, **hardware rev + firmware + model version + SBOM** recipe (semver `MAJOR.MINOR.PATCH`, Conventions §6). |

---

## 8. Cross-cutting thread plan (the 8 threads)

The 8 horizontal disciplines (Overview §1) — alive in every stage, reviewed at every gate, never "done." Each names its register and review cadence. Registers are **seeded as stubs in Phase 00** (Risk + QA per the stage skill) so the threads are alive from gate one.

| # | Thread | Register | Review cadence | SentinelEdge anchor |
|---|---|---|---|---|
| 1 | **Risk & Opportunity** | `_cross_cutting/Risk_Opportunity_Register.md` (stub seeded now) | Every gate + sprint/milestone | Carries RSK-01…07, OPP-01 from [Concept §9](../Phase_01_Concept/Concept.md#9-top-risks-rsk--seeds-the-living-register). **RSK-01** (accuracy vs. footprint, Critical) & **RSK-02** (false-positive/alert fatigue, Critical) are the MCR/PDR Conditional-Go gatekeepers; RSK-04 (unsafe actuation) gates the safety case. |
| 2 | **Configuration Mgmt** | `Configuration_Management_Plan.md` + `CR_Log.md` (Stage 09) | Every gate (baseline status); per `CR-*` | Owns the 3 baselines (§7); `CI-*` register treats **hardware rev, firmware image, model version, and SBOM** as distinct configuration items; document naming/versioning per Conventions §6. ISO 10007:2017. |
| 3 | **Safety / RAMS** | `_cross_cutting/Hazard_Log.md` → **HAZ-01** | **Every gate** — safety-critical | Rotating-machinery hazard mitigation; advisory-only/fail-passive (REQ-F-04, REQ-SAF-01/02), reliability allocation. **IEC 61508** safety case + SIL determination (REQ-D-01, `TODO: SIL_target`). Drives RSK-04. Independent V&V (§4). |
| 4 | **Security** | `_cross_cutting/Threat_Model.md` → `THR-*` | Every gate; **Formal** at PDR/CDR/PRR + signed-boot negative test | Device identity/secure element (REQ-SEC-01), verified/secure boot (REQ-SEC-02), SBOM/provenance (REQ-SEC-03), sanitization (REQ-SEC-04), mTLS/TLS-1.3 seams (REQ-INT-01/02). Drives RSK-06. STRIDE; ISO/IEC 27001:2022, NIST SP 800-53 Rev. 5, NIST SP 800-160. |
| 5 | **HSI / Human-System Integration** | (folded into Usability reqs + QA thread) | At PDR (UX), at SCN-04 install dry-run, TRR/PRR | Guided commissioning flow (REQ-U-01, MOP-08, SN-08); operator-comprehensible alerts with explanation (REQ-U-02, SN-09); **LOTO-compatible install/service clear of rotating parts** (REQ-SAF-02 — HSI ∩ Safety). |
| 6 | **Measurement (MOE/MOP/TPM)** | `_cross_cutting/TPM_Tracker.md` | Every gate (TPM margins) + drift telemetry; continuous in ops | MOE-01…07 ([Concept §8](../Phase_01_Concept/Concept.md#8-measures-of-effectiveness-moe)) → MOP-01…10 → **TPM-01…05** ([SysRS §10](../Phase_02_Requirements/SysRS.md#10-measures-of-effectiveness--performance)): TPM-01 accuracy/F-beta, TPM-02 false-positive rate, TPM-03 inference latency, TPM-04 battery life, TPM-05 model footprint. All thresholds `TODO: pilot-measured`. |
| 7 | **Cost / Schedule / EVM** | (Agreement + Phase 05 COCOMO/BOM) | Every gate | ROM hardware-BOM + cloud-OPEX vs. avoided-downtime value ([Concept §5](../Phase_01_Concept/Concept.md#5-feasibility-study-the-gate-of-this-phase)); per-unit BOM ceiling (REQ-C-01) is `TODO`; subscription analytics is the recurring-revenue lever (OPP-01). Full estimate deferred to Phase 05. |
| 8 | **Quality** | `_cross_cutting/QA_Plan.md` (stub seeded now) | Every gate; **FCA/PCA + first-article inspection** at PRR | ISO 9001:2015 frame; verification (IEEE 1012-2016) + test docs (ISO/IEC/IEEE 29119-3:2021); EMC/radio (REQ-D-03) and RoHS/WEEE (REQ-D-02) conformity evidence. |

> **Edge-AI model V&V** is not a 9th thread — under SentinelEdge's tailoring it runs as the **Formal overlay shared by thread 6 (Measurement)** (TPM-01/02/03/05 + drift MOP-09) **and thread 8 (Quality)** (held-out evaluation, lineage, rollback evidence). It is, alongside Safety/RAMS, the project's highest-rigor area (RSK-01/02 Critical, RSK-03 High).

---

## 9. References

- **Conventions:** [`../../05_Conventions.md`](../../../05_Conventions.md) — IDs, gates (incl. ATP, §3), T/I/A/D (§4), S1–S4 (§5), baselines/status (§6), §9 citations.
- **Prior/companion artifacts (this example):** [`Concept.md`](../Phase_01_Concept/Concept.md) (Phase 01), [`SysRS.md`](../Phase_02_Requirements/SysRS.md) (Phase 02), [`README.md`](../README.md); `Agreement_Register.md` and `Project_Enablement_Plan.md` (Phase 00 companions — **TODO**).
- **Cross-cutting registers (seeded as stubs in Phase 00):** `_cross_cutting/Risk_Opportunity_Register.md`, `_cross_cutting/QA_Plan.md` (+ later: `Hazard_Log.md` (HAZ-01), `Threat_Model.md`, `TPM_Tracker.md`).
- **Standards (Conventions §9):** SE lifecycle **ISO/IEC/IEEE 15288:2023**; requirements **ISO/IEC/IEEE 29148:2018**; architecture **ISO/IEC/IEEE 42010:2022**; V&V **IEEE 1012-2016**; test docs **ISO/IEC/IEEE 29119-3:2021**; risk **ISO 31000:2018**; CM **ISO 10007:2017**; quality **ISO 9001:2015**; sanitization **NIST SP 800-88 Rev. 1**; security **ISO/IEC 27001:2022 · NIST SP 800-53 Rev. 5 · NIST SP 800-160**; handbooks **INCOSE SE Handbook v5 (2023) · NASA/SP-2016-6105 Rev 2**. Domain: **IEC 61508** (functional safety, advisory function), **RoHS / WEEE** + battery transport/disposal, **CE/FCC** EMC & radio, **SBOM** (SPDX/CycloneDX).

---

## 10. ATP gate

Gate: **ATP — Authority to Proceed** (Conventions §3: "Agreement signed; SEMP approved; funding & team authorised").

- [x] Acquirer and supplier identified (vendor engagement: supplier = SentinelEdge product org; internal acquirer role = Product/Commercial Owner **STK-08**), with decision authority mapped (§3).
- [x] Acquisition vehicle recorded — **internal product charter / vendor engagement** (§1.4); full register `AGR-SENTINELEDGE-v0.1` is the companion artifact.
- [x] Scope of agreement (in/out) and deliverable list framed — supplier deliverables mapped to future-phase artifacts (§2.2); advisory-only and out-of-scope actuation carried from [Concept §3](../Phase_01_Concept/Concept.md#3-scope).
- [ ] Acceptance criteria `AC-*` written with method (T/I/A/D) + authority each — **TODO** (owned by `Agreement_Register.md`; thresholds mirror TPM-01…05 + MOE-07, with SysRS `TODO`s still `TODO`).
- [x] Constraint seeds recorded for Phase 02 — already realised as REQ-C-01/02, REQ-D-01/02/03 in [SysRS §8](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements); BOM-ceiling seed (REQ-C-01) remains **TODO**.
- [x] **SEMP approved (this document)** — organization/roles (§3), tailoring decision (§6), gate & baseline plan (§7), 8-thread plan (§8) all present.
- [ ] **Project Enablement Plan** complete — **TODO** (`PEP-SENTINELEDGE-v0.1` companion: bench/HIL rig, signing PKI + SBOM toolchain, edge-AI pipeline, labelled-dataset supply, QA/QMS, knowledge mgmt; tool names default to `TODO: confirm org standard`).
- [ ] **Funding and team authorised** — **TODO** (owed from internal acquirer **STK-08**; named individuals in §3 are `TODO`).
- [x] Risk/Opportunity and QA register stubs opened (§8 threads 1 and 8); Hazard Log stub (HAZ-01) opened for the Safety/RAMS thread (§8 thread 3).
- [ ] Schedule anchored ATP→MCR — **TODO** (MCR board not yet scheduled — the open item carried from [Concept §10](../Phase_01_Concept/Concept.md#10-mcr-gate--mission-concept-review)).

**ATP verdict: Proceed-with-actions.** The means-to-execute (SE process, organization, tailoring, gate plan, 8-thread plan) are defined and the SEMP is approvable; technical work (Phase 01→MCR) may proceed in parallel with closing the actions. Open actions before a clean ATP and into MCR:

| Action | Owner | Blocks |
|---|---|---|
| Author `Agreement_Register.md` with `AC-*` (methods + thresholds; `TODO` where un-set) | Product/Commercial Owner (STK-08) | clean ATP |
| Author `Project_Enablement_Plan.md`; confirm bench/HIL, signing-PKI/SBOM, edge-AI pipeline, dataset supply, and QMS org standards | Lead SE + QA Lead | clean ATP |
| Confirm funding + name the team (resolve §3 `TODO`s) | Product/Commercial Owner (STK-08) | clean ATP |
| Schedule MCR board; anchor ATP→MCR schedule | Lead SE | MCR |
| Bind the lifecycle model (§5 intent → final) | Lead SE + Product Owner | MCR (Phase 01) |
| Retire the accuracy/footprint/battery quadrilemma (RSK-01/05) by measured pilot; accept advisory-only safety case (RSK-04, HAZ-01) | Edge-AI Lead + Safety/RAMS Lead | MCR-actions / PDR |

No non-waivable blocker exists; ATP is **Proceed-with-actions**, not a clean Proceed, until funding/team and the two companion artifacts are confirmed.
