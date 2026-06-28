# Systems Engineering — Full Process Playbook (12‑stage)

A reusable, domain‑agnostic, top‑to‑bottom guide. Apply to any system — hardware, software, hybrid — by working each stage in order: do the activities, produce the deliverables, clear the gate, move on. **12 stages, an 8‑thread horizontal, one gate ladder.** ~3 screens.

> **This is the quick‑reference summary.** The detailed home for each stage (activities, interview questions, AI prompts, checklists, exit criteria) is [`skills/se-phase-NN-*/SKILL.md`](../skills/). A fully filled instance lives in [`worked_example/`](../worked_example/) (EV Charging Station Network). The binding contract for IDs, gates, methods, and naming is [`05_Conventions.md`](../05_Conventions.md) — **when this file disagrees with Conventions, Conventions wins.**

---

## The shape of the work

- **12 sequential stages** (00 → 11): the vertical progression from *agreement* to *disposal*.
- **8 cross‑cutting threads**: horizontal disciplines alive in **every** stage, reviewed at **every** gate, never "done."
- **One gate ladder** (each gate owned by exactly one stage):

```
ATP ─ MCR ─ SRR ─ PDR ─ CDR ─ TRR ─ PRR ─ ORR ─ GA ┄┄(ops loop: change ⇄ validate)┄┄ DRR
 00    01    02    04    06    07    08    10   10                                      11
```

A gate is a **decision point**, not a rubber stamp: *Proceed · Proceed‑with‑actions · Hold · Re‑baseline · Stop.*

---

## The 12 stages

### Stage 00 — Agreement & Enablement   → **ATP**

| | |
|---|---|
| **Goal** | Establish the deal and the means to execute it. |
| **Activities** | Capture the agreement (RFP/SOW/contract, acceptance terms) → write the SE Management Plan → stand up the project enablement (funding, team, infrastructure, lifecycle‑model commitment, tooling). |
| **Outputs** | `Agreement_Register.md` · `SEMP.md` · `Project_Enablement_Plan.md` |
| **Exit gate** | **ATP** — agreement signed; SEMP approved; funding & team authorised. |

### Stage 01 — Concept   → **MCR**

| | |
|---|---|
| **Goal** | Decide *what*, *for whom*, *why* — and whether it's feasible. Sign off the **problem space**. |
| **Activities** | Identify stakeholders (`STK-`) → mission statement → elicit needs (`SN-`, StRS) → operational concept (`SCN-`, OpsCon) → feasibility study → select lifecycle model (Waterfall / V / Spiral / Agile / Hybrid) → seed top risks. |
| **Outputs** | `Stakeholder_Mission.md` · `StRS.md` · `OpsCon.md` · `Feasibility_Study.md` · `Project_Development_Plan.md` |
| **Exit gate** | **MCR** — mission, ConOps, feasibility accepted; lifecycle model chosen. |

### Stage 02 — Requirements   → **SRR**

| | |
|---|---|
| **Goal** | Turn needs into a baselined, testable system spec. |
| **Activities** | Derive `SN → REQ` → classify (`F U P O SEC INT C D SAF`) → write each in **SMART** form → assign IDs `REQ-<class>-<nn>` → define `MOE`/`MOP` (promote selected to `TPM`) → seed a T/I/A/D method per REQ → trace forward **and** backward. |
| **Outputs** | `SysRS.md` (ISO/IEC/IEEE 29148:2018) · `Traceability_Matrix.md` · MOE/MOP set |
| **Exit gate** | **SRR** — every REQ passes SMART; StRS→SyRS traced; **requirements baseline** set. |

### Stage 03 — Modeling (MBSE)   → *model‑coverage gate*

| | |
|---|---|
| **Goal** | Build the SysML single source of truth. |
| **Activities** | Draw the **7‑of‑9** diagram working set; link via *derive / refine / satisfy / verify*. (Add Package/Parametric when size or physical constraints warrant.) |
| **Outputs** | Use Case · BDD · IBD · State Machine · Activity · Sequence · `Requirements_Diagram.puml` + coverage matrices (PlantUML). |
| **Exit gate** | Every REQ *satisfied* by ≥1 block and *verified* by ≥1 test case. |

### Stage 04 — Architecture & Design   → **PDR**

| | |
|---|---|
| **Goal** | Choose the framework, freeze interfaces, justify the stack. |
| **Activities** | Pick framework (TOGAF‑lite ADM / Zachman / NIST / C4) → logical + physical architecture → draft **ICD** per seam (`ICD-`: sender/receiver, protocol, format, rate, security, failure mode) → tech‑stack rationale (incl. "what we are NOT using and why") → stakeholder‑tailored views. |
| **Outputs** | `Architecture_Description.md` (ISO/IEC/IEEE 42010:2022) · `ICD.md` · `Tech_Stack_Rationale.md` |
| **Exit gate** | **PDR** — architecture approved; no critical open risks; **allocated baseline** set. |

### Stage 05 — Trade‑off & Decision   → *decisions traced*

| | |
|---|---|
| **Goal** | Make every strategic decision auditable and defensible. |
| **Activities** | Per strategic choice (3–5 typical): 2–4 alternatives → criteria (Cost/Performance/Reliability/Risk default) → score 1–10 → weighted total → **sensitivity** (re‑weight each criterion to 40%) → record `DEC-`/`DM-`. Optional **COCOMO** (Basic + Intermediate w/ EAF) for software effort. |
| **Outputs** | `Decision_Matrices.md` (+ sensitivity) · `Decision_Register.md` · optional `COCOMO_Estimate.md` |
| **Exit gate** | All top‑level decisions traceable to a matrix; sensitivity documented. |

> **COCOMO worked numbers corrected.** The worked example was recomputed directly from `E = a·KLOC^b`, `T = c·E^d`: EAF ≈ **1.06** (it *raises* effort — a strong team does not make a high‑reliability system cheaper), adjusted effort ≈ **1,859 PM** vs a 300‑PM plan (≈ **6×** short). The earlier "EAF ≈ 0.78 / achievable but tight" read was an arithmetic error. **Always recompute T and N from the formulas — never copy a table.**

### Stage 06 — Integration   → **CDR**

| | |
|---|---|
| **Goal** | Plan how parts come together without late surprises. |
| **Activities** | Choose strategy (**Incremental + CI** default) → define increments (`INC-`) with entry/exit criteria → map dependencies (Data/Control/Temporal/Resource) → enumerate stubs/drivers/mocks → CI/CD pipelines → HIL rigs if hardware. |
| **Outputs** | `Integration_Plan.md` (numbered increments, dependency map, CI/CD, HIL, pass/fail per increment) |
| **Exit gate** | **CDR** — detailed design complete; **ICDs frozen**; **product baseline** set. |

### Stage 07 — Verification *(built it right?)*   → **TRR**

| | |
|---|---|
| **Goal** | Prove the system meets the spec. |
| **Activities** | Finalise the **T/I/A/D** method per REQ → execute Unit → Integration → System tests → static (SAST) / dynamic (DAST) / conformance scans → archive evidence. |
| **Outputs** | `Verification_Matrix.md` (REQ → method → `TC-VER-` → evidence) · `VnV_Plan.md` (IEEE 1012‑2016) · scan/review records |
| **Exit gate** | **TRR** — 100% requirement coverage by method; test env & data ready. |

### Stage 08 — Validation *(built the right thing?)*   → **PRR**

| | |
|---|---|
| **Goal** | Prove the system meets user/stakeholder needs in real conditions. |
| **Activities** | `Test_Plan.md` (objective, scope, approach %, environment, risks, pass/fail, schedule) → `Test_Cases.md` (`TC-VAL-`: ID, REQ link, priority, preconditions, steps w/ per‑step expected, outcome, evidence) → UAT, pilot/beta, OAT, regulatory acceptance. |
| **Outputs** | `Test_Plan.md` · `Test_Cases.md` (ISO/IEC/IEEE 29119‑3:2021) · UAT/pilot/regulatory evidence |
| **Exit gate** | **PRR** — validation ≥ targets; zero **S1**; FCA/PCA done; ready to release/produce. |

### Stage 09 — Change & Configuration Mgmt   → *baselines current*

| | |
|---|---|
| **Goal** | Evolve the system without losing coherence. |
| **Activities** | Define change classes (A Critical / B Major / C Minor / D Emergency) → process: Submit `CR-` → Triage → **Impact Analysis (Scope · Risk · Cost/Schedule · Compliance · Stakeholders)** → CCB → implement + V&V evidence → re‑baseline (version bump) → notify. Manage config items (`CI-`). |
| **Outputs** | `Change_Management_Plan.md` · `Configuration_Management_Plan.md` (ISO 10007:2017) · `CR_Log.md` |
| **Exit gate** | Every change has a CR + impact analysis; baselines current. |

### Stage 10 — Operations & Continuous Validation   → **ORR → GA**

| | |
|---|---|
| **Goal** | Keep the deployed system meeting the spec over its life. |
| **Activities** | Define **SLOs** (`SLO-`) linked to REQs → observability (metrics + logs + traces + RUM) → continuous regression (nightly conformance, synthetic) → chaos, pen‑test, compliance audits on cadence → govern OTA (cohort rollout + auto‑rollback) → close loop to SysRS. Author runbooks (`RB-`). |
| **Outputs** | `Operations_Continuous_Validation.md` · SLO dashboards · `runbooks/` · post‑incident reviews |
| **Exit gate** | **ORR** (deployment, runbooks, SLOs, on‑call, rollback ready) → **GA** (live; error budgets honoured — continuous thereafter). |

### Stage 11 — Disposal & Retirement   → **DRR**

| | |
|---|---|
| **Goal** | Retire the system safely and capture knowledge. |
| **Activities** | Plan decommission sequence → data **sanitization** (NIST SP 800‑88 Rev.1) → environmental/e‑waste handling → archival & knowledge capture → stakeholder & regulatory sign‑off. |
| **Outputs** | `Disposal_Plan.md` (decommission, sanitization, environmental, archival) |
| **Exit gate** | **DRR** — retirement plan, data sanitization, environmental & archival approved. |

---

## The gate ladder (one row per gate)

| Gate | Name | Owner | Passes when… | Baseline set |
|---|---|---|---|---|
| **ATP** | Authority to Proceed | 00 | Agreement signed; SEMP approved; funding & team authorised. | — |
| **MCR** | Mission Concept Review | 01 | Mission, ConOps, feasibility accepted; lifecycle model chosen. | — |
| **SRR** | System Requirements Review | 02 | Every REQ passes SMART; StRS→SyRS traced; reqs baselined. | Requirements |
| **PDR** | Preliminary Design Review | 04 | Architecture approved; framework chosen; no critical open risks. | Allocated |
| **CDR** | Critical Design Review | 06 | Detailed design complete; **ICDs frozen**; integration plan ready. | Product |
| **TRR** | Test Readiness Review | 07 | 100% requirement coverage by method; test env & data ready. | — |
| **PRR** | Production Readiness Review | 08 | Validation ≥ targets; zero S1; FCA/PCA done; ready to release. | — |
| **ORR** | Operational Readiness Review | 10 | Deployment, runbooks, SLOs, on‑call, rollback all in place. | — |
| **GA** | General Availability | 10 | Live to all users; error budgets honoured (continuous). | — |
| **DRR** | Decommissioning Readiness Review | 11 | Retirement, sanitization, environmental & archival approved. | — |

---

## The 8 cross‑cutting threads (always on, reviewed at every gate)

| Thread | One line | Key IDs / artifacts |
|---|---|---|
| **Risk & Opportunity** | Identify, score (`L×I`, 1–5 → 5×5 band), and retire top risks; track opportunities. | `RSK-` · `OPP-` · Risk register |
| **Configuration Mgmt** | Baselines, config items, version control; nothing changes a baseline except a CR. | `CI-` · CM Plan (ISO 10007) |
| **Safety / RAMS** | Hazard analysis, reliability/availability/maintainability; safety‑critical traceability. | `HAZ-` · `SAF` reqs · Hazard log |
| **Security** | Threat model, AuthN/AuthZ, crypto, supply‑chain, controls & compliance. | `THR-` · `SEC` reqs · Threat model (ISO 27001 / NIST 800‑53) |
| **HSI (Human‑Systems Integration)** | Usability, workload, human error, accessibility designed in, not bolted on. | `U` reqs · HSI plan |
| **Measurement (MOE/MOP/TPM)** | Effectiveness, performance, and tracked technical margins from concept to ops. | `MOE-` · `MOP-` · `TPM-` tracker |
| **Cost / Schedule / EVM** | Estimate, budget, and track effort/schedule; COCOMO + earned‑value. | `COCOMO_Estimate.md` · EVM |
| **Quality** | QA plan, reviews, standards conformance, audit readiness across all stages. | QA Plan (ISO 9001) |

---

## Cross‑cutting checklists

**SMART requirement** — Specific · Measurable · Achievable · Relevant · Time‑bound/Testable.

**Verification methods (T/I/A/D)** — **T**est (measurable threshold) · **I**nspection (examine, incl. review/walkthrough) · **A**nalysis (calc/model/sim/similarity) · **D**emonstration (operate & observe). *"Review" is a form of Inspection, not a 5th method. UAT is validation (08), not a verification method.*

**Severity (S1–S4)** — S1 Critical (safety/data‑loss/total loss, no workaround) · S2 Major · S3 Minor · S4 Cosmetic. (`SEV‑n` = ops alias.)

**Decision matrix** — criteria × alternatives, weighted total, then re‑run each criterion at 40% to confirm robustness.

```
| Criterion (Weight) | Alt A | Alt B | Alt C |
| Cost (25%)         |       |       |       |
| Performance (25%)  |       |       |       |
| Reliability (25%)  |       |       |       |
| Risk (25%)         |       |       |       |
| Weighted Total     |       |       |       |
```

**ICD row** — `| Sender → Receiver | Layer | Standard | Format | Rate | Security | Failure mode |`

**Document frontmatter** — `Document · Document ID (<TYPE>-<SLUG>-vX.Y) · Standard · Status · Owner`. Status: `Draft → In Review → Baseline (<GATE>-approved YYYY-MM-DD) → Superseded`. A baselined doc changes **only** via a `CR-` (Stage 09).

**ID grammar** — uppercase, hyphenated, zero‑padded `‑01`; stable for project life (retire with `(deprecated)`, never renumber). The traceability spine: `SN → REQ → design block → ICD → INC → TC‑VER/TC‑VAL → CR → SLO`, forward **and** backward.

---

## Project folder layout (per instance — matches Conventions §10)

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

Blank, fill‑in versions of every file live in [`templates/`](../templates/). The detailed per‑stage guides live in [`skills/`](../skills/); a complete filled instance (EV Charging Station Network) lives in [`worked_example/`](../worked_example/).

> **Tailoring.** Not every project produces every artifact. Stages are never skipped silently — a tailored‑out artifact is recorded as "tailored out: \<reason\>". See [`04_Tailoring_Guide.md`](../04_Tailoring_Guide.md) for Minimum‑Viable vs Formal artifact sets.
