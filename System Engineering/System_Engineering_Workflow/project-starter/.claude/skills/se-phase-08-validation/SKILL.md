---
name: se-phase-08-validation
description: Runs Phase 08 (Validation) of the systems-engineering workflow — the "did we build the right thing?" half of V&V. It proves the integrated system meets stakeholder, operator, and regulator needs in real conditions, and produces Test_Plan.md plus Test_Cases.md (TC-VAL-* cases) covering acceptance testing (UAT, OAT, FAT, SAT, regulatory), pilot/beta, simulation/prototyping, and A/B testing. Each TC-VAL carries linked REQs, preconditions, steps with per-step expected results, a final expected outcome, and post-execution Actual Result + Pass/Fail Status fields, written to be independent and re-runnable. Use this phase when the user wants to write a test plan, build validation test cases, plan UAT/beta/pilot/simulation, prep operational acceptance (OAT), factory or site acceptance (FAT/SAT), regulatory acceptance, define pass/fail criteria, or clear the Production Readiness Review (PRR). It auto-loads on phrasings like "test plan", "validation test cases", "TC-VAL", "user acceptance testing / UAT", "FAT / SAT", "OAT", "pilot or beta test", "regulatory acceptance", "did we build the right thing", "PRR", or "phase 8 validation".
disable-model-invocation: true
user-invocable: true
---

# Phase 08 — Validation

<what-to-do>

Validation proves "did we build the **right** thing?" — that the integrated system meets stakeholder, operator, and regulator needs in real-world conditions — by producing `Test_Plan.md` and `Test_Cases.md` (TC-VAL-* cases) and executing them to evidence. Its exit gate is the **PRR (Production Readiness Review)**. This phase conforms to `../../../se-workflow/05_Conventions.md` for all IDs, gates, methods, severity, baselines, status strings, and standard citations; it never re-defines them.

## Inputs (from prior phases)

Read these first; if an artifact is absent, mark the dependency `TODO: <owed by phase NN>` and proceed — never invent its content.

- `Phase_02_Requirements/SysRS.md` — every REQ needing user-level validation; the **MOE/MOP** set is the source of numeric pass targets. (Fallback: ask the user for the top user-facing requirements.)
- `Phase_01_Concept/StRS.md` + `OpsCon.md` — stakeholder needs (`SN-*`) and operational scenarios (`SCN-*`) are the validation backbone; each primary scenario owes ≥ 1 TC-VAL. (Fallback: ask for the primary mission/use cases.)
- `Phase_07_Verification/Verification_Matrix.md` — TC-VER-* already prove "built it right"; do **not** duplicate them. Validation adds the user/operator/regulator perspective. A 100%-verified matrix is **necessary but not sufficient** for validation.
- `Phase_06_Integration/Integration_Plan.md` — increment (`INC-*`) timing sets pilot/FAT/SAT scheduling and HIL availability.
- `_cross_cutting/` — `Risk_Opportunity_Register.md` (test-risk seeds), `Hazard_Log.md` (`HAZ-*` → S1 candidates), `Threat_Model.md`, `TPM_Tracker.md` (margins to validate at PRR).

## Step-by-step

**Interview-driven: ask ONE topic at a time, convert each answer into the deliverable, then move on. Reuse prior-phase facts; never re-ask what the SysRS/StRS/OpsCon already states.**

1. **Read prior artifacts** (above) and confirm the output path. Default: `<output-dir>/<slug>/Phase_08_Validation/` → `Test_Plan.md` + `Test_Cases.md`.
2. **Frame the plan.** State the Plan ID `TP-<SLUG>-01` and objective in one screen, then confirm with the user. Objective shape: *"Validate that the integrated system meets `<primary stakeholders>` needs in real conditions, evidencing the SysRS at system level against the MOE/MOP targets."*
3. **Scope (one topic).** Ask for In-scope / Out-of-scope. Pull the in-scope frame from `OpsCon` scenarios; record explicit carve-outs (e.g., "Out of scope: cardholder-data lifecycle, PSP-managed"). Anything deferred is `TODO: <owed>`.
4. **Acceptance-test catalog (one topic, use `AskUserQuestion`).** Ask which acceptance types apply, offering the full catalog — UAT, OAT, **FAT**, **SAT**, regulatory, plus pilot/beta, simulation, and A/B (see *Validation method catalog*). FAT/SAT are mandatory to **consider** for any installed-hardware or hybrid system: FAT = manufacturer's site **before** delivery; SAT = customer's site **after** installation. Mark types that genuinely don't apply as "tailored out: `<reason>`".
5. **Approach (one topic).** Build the layer × manual/automated table; reuse the CI/CD + HIL rows from Phase 06 and the tool table rather than re-inventing them.
6. **Test environments (one topic).** List each environment and its composition (lab/HIL, staging, pre-prod, FAT rig, pilot site, public pilot). A staging-cloud run is *integration*, not validation — validation needs real users in a real environment.
7. **Test-specific risks (one topic).** 4–8 entries with mitigations; seed from the Risk Register. Score with `Likelihood × Impact` per Conventions §5.3 — do not invent a local scale.
8. **Pass/fail criteria (one topic).** Capture concrete numbers tied to MOE/MOP/TPM (never "users are happy"). The gate floor lives in Conventions §3 (PRR): validation ≥ targets, **zero S1** defects, FCA/PCA done. Defect severity uses the single `S1`–`S4` taxonomy in Conventions §5.1 — cross-reference it; do not re-define.
9. **Roles, deliverables, schedule (one topic each).** Anchor the schedule to Phase 06 increments and the gate ladder (TRR → pilot/FAT/SAT → PRR); leave any unknown date as `TODO:`.
10. **Author TC-VAL-* cases (one journey at a time).** For each `SN-*`/`SCN-*` and each primary use case, write a TC-VAL using the full template (below). Aim for 8–15. Each step carries an inline `*Expected:*`; the case carries post-execution `Actual Result` + `Pass/Fail Status` fields left blank until run (KB topic 17). **Write every case independent** (Step-by-step rule: re-establish all needed state in Preconditions; never "use the result of TC-VAL-05").
11. **Multi-actor / concurrency / failure case.** Include ≥ 1 TC-VAL exercising simultaneous triggers (≥ 3 sources), concurrent access (≥ 3 devices/sessions), and a failure mid-operation (network drop, payment retry, contactor fault).
12. **Coverage check.** Every `REQ-U-*` and every primary stakeholder's top scenario links to ≥ 1 TC-VAL; every `HAZ-*` with a behavioural mitigation has a validating TC-VAL.
13. **Write both files**, then **run the exit-gate checklist** below. Print both paths; recommend `se-phase-09-change-config` next (stand up the CCB/CR loop before GA).

## Decision points

- **Is this case a TC-VAL or a TC-VER?** If it proves a *spec measurement* (latency ≤ 200 ms on an instrumented timestamp, TLS pinned), it is a TC-VER and belongs to Phase 07. If it proves a *user/operator/regulator outcome* (a driver completes charging in their own workflow; an operator clears 3 concurrent alarms; an auditor signs off), it is a TC-VAL. Many REQs need both — that is expected.
- **Which acceptance type?** UAT = end-users vs business need · OAT = ops can run/monitor/incident-respond in the final environment · FAT = manufacturer site before delivery · SAT = customer site after installation · Regulatory = external auditor/notified body. Pick by *who signs off and where*.
- **Pilot vs simulation?** Use **simulation/prototyping** to validate behaviour *before any real deployment exists* (rare/dangerous scenarios, digital twin/HIL); use a **pilot/beta** for a *limited live deployment* with real users before full rollout.
- **What blocks PRR?** Any open S1, any unmet MOE/MOP target, or FCA/PCA not done. A deferred S2 needs an explicit CCB waiver recorded as a `TODO:`/CR reference.

## Rules

- **Conform to `../../../se-workflow/05_Conventions.md`** for every ID (`TC-VAL-<nn>`, `TP-<SLUG>-01`), gate (PRR), method code (T/I/A/D — note acceptance/UAT is a *validation activity*, not a 5th method), severity (`S1`–`S4`), baseline/status strings, and standard citation. Cross-reference — never restate — the severity table and the gate schedule.
- **One topic at a time.** Ask, convert to deliverable, move on. Reuse SysRS/StRS/OpsCon facts; do not re-elicit.
- **Don't copy the worked example's numbers.** The EVCN example's targets/counts are illustrative — derive this project's pass criteria from its own MOE/MOP set; mark missing numbers `TODO:`.
- **Per-step expected outcomes are mandatory**, plus blank `Actual Result` + `Pass/Fail Status` so a non-author can execute and record the verdict.
- **Independence is mandatory.** No TC-VAL may depend on another's result/output; re-establish state in Preconditions (KB topic 17).
- **Numeric pass criteria only** ("NPS > 30", "≥ 95% complete task in ≤ X s", "uptime ≥ 99.5% over pilot"). Validation criteria are documented *in advance*.
- **Pilot real-world, not lab.** Real users + real environment, or it is integration, not validation.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

Blank versions live in `../../../se-workflow/templates/` (`Test_Plan.md`, `Test_Cases.md`). Both carry the standard frontmatter from Conventions §6 (`Document ID: TP-<SLUG>-vX.Y`, `Standard: ISO/IEC/IEEE 29119-3:2021`, `Status:`).

### `Test_Plan.md` (sections per KB topic 17)

```markdown
# Test Plan — <Project>
Plan ID: TP-<SLUG>-01 · Standard: ISO/IEC/IEEE 29119-3:2021 · traced to ../Phase_02_Requirements/SysRS.md

1. Objective              — 1–3 sentences, references MOE/MOP targets
2. Scope                  — In scope | Out of scope (carve-outs explicit)
3. Test Approach          — | Layer | Manual | Automated | Tool |  (reuse Phase 06 CI/CD + HIL rows)
4. Test Environment       — | Env | Composition |  (lab/HIL · staging · pre-prod · FAT rig · pilot site · public pilot)
5. Acceptance types       — UAT · OAT · FAT · SAT · Regulatory · Pilot/Beta · Simulation · A/B (mark tailored-out ones)
6. Risk Assessment        — | Risk | L×I (Conv §5.3) | Mitigation |
7. Pass/Fail Criteria     — numeric; floor = PRR (Conv §3): validation ≥ targets, zero S1, FCA/PCA done
8. Roles & Responsibilities
9. Schedule               — anchored to Phase 06 increments + gate ladder (TRR → pilot/FAT/SAT → PRR)
10. Test Cases            — counts: TC-VER-N (→ Phase 07 matrix), TC-VAL-N (→ Test_Cases.md)
```

### `Test_Cases.md` — TC-VAL full template (pre- and post-execution fields)

```markdown
### TC-VAL-NN — <Short title>

| Field | Value |
|---|---|
| Objective | <user/operator/regulator-level outcome> |
| Linked REQs / SN | REQ-U-NN, REQ-F-NN, SN-NN |
| Priority | High / Medium / Low (Conv §5.2) |
| Type | Validation (UAT) / Validation (OAT) / Validation (FAT) / Validation (SAT) / Validation (Regulatory) / Validation (Pilot) / Validation (Simulation) |
| Preconditions | <self-contained state, role, env, data — establishes ALL needed state (independence)> |
| Steps | 1. <action>. *Expected:* <observable>. <br> 2. <action>. *Expected:* … |
| Final Expected Outcome | <single-sentence pass condition referencing the linked REQs/MOPs> |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed: Pass / Fail / Blocked)_ |
| Defect refs | <S1–S4 link if Fail; Conv §5.1> |
| Evidence path | validation-evidence/TC-VAL-NN/ |
| Tools | <stopwatch / analytics / camera / Postman / survey> |
```

> **Type enum is reconciled with the worked example:** use `Validation (<facet>)` — e.g. `Validation (UAT)`, `Validation (SAT)` — not a free-standing `Functional/Non-Functional/Mixed/Regulatory` list. Pre-execution vs post-execution split (KB topic 17): ID, Title, Preconditions, Steps, Expected Result, Traceability, Priority are written *before*; **Actual Result** and **Pass/Fail Status** are filled *after* the run.

**Filled example (shape only — derive your own numbers from the project's MOPs):**

```markdown
### TC-VAL-03 — Operator clears 3 concurrent alarms (OAT)

| Objective | An on-call operator resolves three simultaneous alarms without missing one. |
| Linked REQs / SN | REQ-U-04, REQ-O-02, SN-05 |
| Priority | High |
| Type | Validation (OAT) |
| Preconditions | Pre-prod env seeded; operator role provisioned; 3 sites armed to fault on cue. (Self-contained — no prior case needed.) |
| Steps | 1. Trigger faults at sites A, B, C within 5 s. *Expected:* 3 distinct alarms surface in the console. <br> 2. Operator acknowledges each. *Expected:* each ack logged with operator ID + timestamp. <br> 3. Operator resolves all 3. *Expected:* zero alarms remain; audit trail complete. |
| Final Expected Outcome | All 3 alarms acknowledged ≤ MOP-07 target and resolved with a complete audit trail (REQ-O-02). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Evidence path | validation-evidence/TC-VAL-03/ |
```

## Validation method catalog (acceptance types + field methods)

| Method | Who / where / what | Tool / format |
|---|---|---|
| **UAT** — User Acceptance | End-users confirm the system meets **business needs** in their real workflow. | In-app survey + ticket log + analytics. |
| **OAT** — Operational Acceptance | Ops team validates **performance, security, maintainability** in the final environment (run / monitor / incident-respond). | Runbook drill + on-call dry-run + pen-test. |
| **FAT** — Factory Acceptance | Performed at the **manufacturer's site BEFORE delivery**; catches build defects early. | Witnessed factory test + sign-off sheet. |
| **SAT** — Site Acceptance | Conducted at the **customer's location AFTER installation**; catches install/environment defects. | On-site commissioning checklist + witness. |
| **Regulatory / Compliance** | External auditor/notified body confirms **industry regs & legal** (UL/CE/FCC/PCI/GDPR — adapt to domain). | QSA / TÜV / notified-body letter. |
| **Pilot / Beta** | Limited real-world deployment (one site / cohort / geography) with real users before full rollout. | Live rollout + telemetry. |
| **Simulation / Prototyping** | Model/twin/HIL for scenarios too rare/dangerous to recreate (validate *before* a real deployment exists). | Python sim, Simulink, AnyLogic, Isaac Sim, HIL rig. |
| **A/B testing** *(modern complement)* | Production comparison of two versions on a real cohort for ambiguous UX choices. | Feature-flag platform. |

## AI prompt pack

- **Elicitation:** *"For stakeholder `<role>` and scenario `<SCN-NN>` from OpsCon, ask me one question at a time to capture: who signs off, in which environment, against which MOE/MOP, and the single observable that means 'accepted'. Stop after each answer and convert it into a TC-VAL skeleton."*
- **Generation (plan):** *"From this SysRS MOE/MOP set and OpsCon, draft `Test_Plan.md` with the 10 KB-topic-17 sections; mark every acceptance type (UAT/OAT/FAT/SAT/regulatory/pilot/simulation/A-B) as applicable or 'tailored out: reason'; pull pass criteria from the MOPs; leave unknown numbers as TODO."*
- **Generation (cases):** *"Generate TC-VAL cases for each primary scenario. Each must be independent (re-establish state in Preconditions), have per-step `*Expected:*`, blank Actual Result + Pass/Fail Status, a Type of `Validation (<facet>)`, and linked REQs. Add one ≥3-actor concurrency + mid-operation-failure case."*
- **Critique / red-team:** *"Red-team this Test_Plan + cases: (1) Which TC-VAL is really a TC-VER in disguise? (2) Which case secretly depends on another's output (independence break)? (3) Which pass criterion is qualitative not numeric? (4) Is any MOP / REQ-U / HAZ unvalidated? (5) Is FAT/SAT missing for an installed system? (6) Is any pilot actually just a staging run?"*
- **Severity triage:** *"Classify each open defect using Conventions §5.1 S1–S4. Flag any S1 (safety / data loss / total loss of primary function, no workaround) as a PRR blocker; propose a CCB waiver path for deferrable S2."*

## Research & specialised-agent triggers

- **Web research** when: a domain acceptance standard governs sign-off (UL/CE/FCC for hardware; PCI-DSS/GDPR/HIPAA for data; FDA/IEC 62304 for medical; DO-178C/ISO 26262 for avionics/automotive) — look up the *current* edition, the FAT/SAT witnessing protocol, and notified-body/QSA requirements; or to find comparable systems' pilot designs and realistic MOE/MOP targets; or to confirm a test-tool's capability (HIL rig, load generator, feature-flag platform).
- **Spawn a specialised agent** when: drafting a **regulatory acceptance dossier** (compliance-mapping agent against the named standard); designing a **high-fidelity simulation / digital-twin validation** (simulation agent); generating a large independent **TC-VAL suite** from many scenarios (test-authoring agent); or running **statistical A/B-test design** (experiment-design agent for power/sample-size). Hand each agent the SysRS MOPs + OpsCon scenarios so output traces back.

## Cross-cutting hooks

This phase **consumes and feeds** these of the 8 threads (`../../../se-workflow/cross-cutting/`):

| Thread | This phase… |
|---|---|
| **Risk & Opportunity** | Consumes the register for test-specific risks; raises validation findings as new `RSK-*`. → `Risk_and_Opportunity_Management.md` |
| **Safety / RAMS** | Every `HAZ-*` with a behavioural mitigation owes a validating TC-VAL; a failed safety TC-VAL is S1. → `Safety_RAMS_Engineering.md` |
| **Security** | OAT includes a security/pen-test pass; `THR-*` mitigations get validated. → `Security_Engineering.md` |
| **Measurement (MOE/MOP/TPM)** | MOE/MOP are the pass criteria; PRR confirms TPM margins met. → `Measurement_MOE_MOP_TPM.md` |
| **Config Mgmt** | Validates against the **product baseline** (CDR-frozen); FCA/PCA are CM audits cleared at PRR. → `Configuration_Management.md` |
| **HSI** | UAT validates the human-factors / usability REQs. → `Human_Systems_Integration.md` |
| **Quality** | Defect taxonomy + evidence archival feed the QA record. → `Quality_Assurance.md` |
| **Cost/Schedule** | Pilot/FAT/SAT scheduling and rework cost feed EVM. → `Cost_Schedule_EVM.md` |

## Standards anchor

This phase realises the **Validation** process and the acceptance portion of the **Transition** process of **ISO/IEC/IEEE 15288:2023** (Stage 08 → Validation · Transition per `../../../se-workflow/01_Workflow_Overview.md` §3). It is governed by **IEEE 1012-2016** (V&V) and documents tests per **ISO/IEC/IEEE 29119-3:2021** (the software-test-documentation standard that **supersedes IEEE 829** — cite 29119-3, mark 829 *superseded*). Pass targets trace to the **ISO/IEC/IEEE 29148:2018** MOE/MOP set. Domain acceptance (UL/CE/FCC/PCI/GDPR; DO-178C/ISO 26262/IEC 62304) is invoked as **regulatory acceptance** when a Domain (`D-*`) or Safety (`SAF-*`) requirement exists. All citations use the canonical forms in Conventions §9.

## Exit-gate checklist — PRR (Production Readiness Review)

- [ ] `Test_Plan.md` complete with all 10 KB-topic-17 sections; Standard = ISO/IEC/IEEE 29119-3:2021.
- [ ] ≥ 8 TC-VAL-* written; each has per-step `*Expected:*` **and** Actual Result + Pass/Fail Status fields.
- [ ] **Acceptance catalog covers UAT, OAT, FAT, SAT, regulatory** as applicable (tailored-out ones recorded with reason).
- [ ] **Every TC-VAL is independent** — no case depends on another's result (state re-established in Preconditions).
- [ ] Every `REQ-U-*` and every primary stakeholder scenario → ≥ 1 TC-VAL; every behavioural `HAZ-*` validated.
- [ ] Pass criteria numeric, derived from this project's MOE/MOP set, set in advance.
- [ ] **Validation ≥ targets · zero S1 defects · FCA/PCA done** (Conventions §3 PRR floor).
- [ ] Pilot is real-users-in-real-environment; pilot/FAT/SAT scheduled with buffer before GA.
- [ ] Evidence archived per case (`validation-evidence/TC-VAL-NN/`); V&V traceability report (REQ → TC → result) produced.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| TC-VAL steps say only "do X, expect pass." | Skipped per-step expected outcomes. | Add inline `*Expected:*` after each step. |
| No record of what actually happened. | Missing post-execution fields. | Add blank **Actual Result** + **Pass/Fail Status** to every case (KB topic 17). |
| A case can't be re-run or run in parallel. | It depends on another case's output (independence break). | Re-establish all state in Preconditions; remove "use TC-VAL-05's cart." |
| Installed-hardware system has no factory/site acceptance. | FAT/SAT omitted from the catalog. | Add **FAT** (manufacturer, before delivery) and **SAT** (site, after install). |
| FAT and SAT swapped. | Confusing which is before/after. | **F**actory-first (before delivery), then **S**ite (after installation). |
| "Pilot" is a staging-cloud run. | Lab mistaken for real-world. | Validate with real users in the real environment. |
| Compliance audits not on the plan. | Treated as separate from V&V. | List UL/CE/FCC/PCI/GDPR as **regulatory acceptance** test activities. |
| Severity / gate re-defined locally and drifting. | Restated instead of referenced. | Cross-reference Conventions §5.1 (S1–S4) and §3 (PRR) — don't restate. |
| Multi-actor concurrency missing. | Single-user thinking. | Add ≥ 1 case with ≥ 3 actors/sensors + a mid-operation failure. |

## References

- `../../../se-workflow/05_Conventions.md` — IDs (`TC-VAL-<nn>`), PRR gate, T/I/A/D, S1–S4 severity (§5.1), priority (§5.2), risk scoring (§5.3), status strings (§6), standard citations (§9).
- `../../../se-workflow/01_Workflow_Overview.md` — the V-model right side (08 Validation ↔ 01 Concept/needs), 15288 mapping, the 8 threads.
- KB `topics/16-verification-validation-methods/fundamentals.md` — V&V split, acceptance types (UAT/OAT/FAT/SAT/regulatory), pilot, simulation, best practices.
- KB `topics/17-test-plans-cases/fundamentals.md` — test-case anatomy (pre/post-execution fields), independence, test-plan sections, pass/fail.
- `../../worked_example/Phase_08_Validation/` — `Test_Plan.md` (TP-EVCN-01) + `Test_Cases.md` (illustrative TC-VAL set — copy the *shape*, not the numbers).
- Related phases: `../se-phase-07-verification/` (TC-VER, TRR), `../se-phase-06-integration/` (increments, HIL), `../se-phase-09-change-config/` (CCB/CR after GA), `../se-phase-10-operations/` (continuous validation, ORR).

</supporting-info>
