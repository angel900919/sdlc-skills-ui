---
Document: Test Plan — <PROJECT NAME>
Document ID: TP-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 29119-3:2021
Status: Draft            # Draft → In Review → Baseline (PRR-approved YYYY-MM-DD) → Superseded by vX.Y
Owner: Validation Lead
---

# Test Plan — <PROJECT NAME>

> **Phase 08 deliverable.** Validation asks: "Did we build the **right** thing?" — that the integrated system meets stakeholder, operator, and regulator needs in real-world conditions. Plan ID `TP-<PROJECT_SLUG>-01`, traced to `../Phase_02_Requirements/SysRS.md`. Exit gate: **PRR (Production Readiness Review)**.
> A 100%-verified Phase 07 matrix is **necessary but not sufficient** for validation. Conforms to [`../05_Conventions.md`](../05_Conventions.md) for IDs (`TC-VAL-<nn>`), the PRR gate, T/I/A/D, severity (`S1`–`S4`), status strings, and citations — never re-defines them.

<!-- HOW TO USE: Replace every <placeholder>. Resolve every TODO. Delete rows marked "(example — delete)". Pass criteria are NUMERIC and derived from THIS project's MOE/MOP set — never copy a worked example's numbers; mark missing numbers TODO. -->

---

## 1. Objective

<1–3 sentences. Shape: "Validate that the integrated system meets `<primary stakeholders>` needs in real conditions, evidencing the SysRS at system level against the MOE/MOP targets." References the MOE/MOP set.>

---

## 2. Scope

| In scope | Out of scope (explicit carve-outs) |
|---|---|
| <primary OpsCon scenarios / SCN-* validated> | <e.g. "cardholder-data lifecycle, PSP-managed"> |
| <primary stakeholder journeys> | <anything deferred → TODO: owed by phase NN> |

---

## 3. Test Approach

> Reuse the CI/CD + HIL rows and the tool table from Phase 06 — do not re-invent them.

| Layer | Manual | Automated | Tool |
|---|---|---|---|
| <Unit (context only — owned by Phase 07)> | <…> | <…> | <…> |
| <System / E2E> | <…> | <…> | <Playwright / Cypress / Maestro> |
| <Field / pilot> | <real users> | <telemetry> | <analytics> |
| <HIL / simulation> | <…> | <Python sim / HIL rig> | <from Phase 06 §7> |

---

## 4. Test Environment

> A staging-cloud run is *integration*, not validation — validation needs real users in a real environment.

| Env | Composition |
|---|---|
| <lab / HIL> | <rigs, DUTs> |
| <staging> | <prod-like services> |
| <pre-prod> | <…> |
| <FAT rig> | <manufacturer-site test bench> |
| <pilot site> | <one site / cohort / geography, real users> |
| <public pilot> | <limited live rollout> |

---

## 5. Acceptance Types

> Mark each applicable or "tailored out: `<reason>`". FAT/SAT are mandatory to **consider** for any installed-hardware or hybrid system. See the validation method catalog in the Phase 08 SKILL.

| Type | Who / where / what | Applies? |
|---|---|---|
| **UAT** — User Acceptance | End-users confirm business needs in their real workflow. | <yes / tailored out: reason> |
| **OAT** — Operational Acceptance | Ops run / monitor / incident-respond in the final environment. | <yes / tailored out: reason> |
| **FAT** — Factory Acceptance | Manufacturer's site, **before** delivery. | <yes / tailored out: reason> |
| **SAT** — Site Acceptance | Customer's site, **after** installation. | <yes / tailored out: reason> |
| **Regulatory / Compliance** | External auditor / notified body (UL/CE/FCC/PCI/GDPR — adapt). | <yes / tailored out: reason> |
| **Pilot / Beta** | Limited real-world deployment with real users before full rollout. | <yes / tailored out: reason> |
| **Simulation / Prototyping** | Model / twin / HIL for rare/dangerous scenarios. | <yes / tailored out: reason> |
| **A/B testing** | Production comparison of two versions on a real cohort. | <yes / tailored out: reason> |

---

## 6. Risk Assessment

> 4–8 test-specific risks seeded from the Risk Register. Score `Likelihood × Impact` per Conventions §5.3 — do not invent a local scale.

| Risk | L×I (Conv §5.3) | Mitigation |
|---|---|---|
| <test-specific risk> | <L×I> | <mitigation> |
| `<Pilot site loses connectivity mid-session>` | 3×4 | `<pre-stage offline mode; schedule buffer>` *(example — delete)* |

---

## 7. Pass/Fail Criteria

> **Numeric only**, tied to MOE/MOP/TPM, documented in advance. Never "users are happy".

| Criterion | Target (from MOE/MOP) | Source |
|---|---|---|
| <task completion rate> | <≥ 95% complete task in ≤ X s> | <MOP-NN> |
| <satisfaction> | <NPS > 30> | <MOE-NN> |
| <availability over pilot> | <uptime ≥ 99.5%> | <MOP-NN> |

**PRR gate floor** (Conventions §3): validation ≥ targets · **zero S1 defects** · FCA/PCA done. Defect severity uses the single `S1`–`S4` taxonomy (Conventions §5.1) — cross-referenced, not re-defined. A deferred S2 needs an explicit CCB waiver recorded as a `TODO:`/CR reference.

---

## 8. Roles & Responsibilities

| Role | Responsibility |
|---|---|
| Validation Lead | <owns this plan; reports PRR readiness> |
| UAT participants | <recruited end-users> |
| Ops team (OAT) | <run / monitor / incident drill> |
| Regulator / auditor | <regulatory acceptance sign-off> |
| <…> | <…> |

---

## 9. Schedule

> Anchored to Phase 06 increments and the gate ladder: **TRR → pilot / FAT / SAT → PRR**. Leave any unknown date as `TODO:`.

| Activity | Anchored to (INC-NN / gate) | Date |
|---|---|---|
| <UAT round 1> | <INC-NN done> | <YYYY-MM-DD / TODO> |
| <FAT> | <before delivery> | <YYYY-MM-DD / TODO> |
| <SAT> | <after install> | <YYYY-MM-DD / TODO> |
| <Pilot> | <post-TRR> | <YYYY-MM-DD / TODO> |
| **PRR** | <exit gate> | <YYYY-MM-DD / TODO> |

---

## 10. Test Cases

| Set | Count | Location |
|---|---|---|
| TC-VER-* (verification) | <n> | `→ ../Phase_07_Verification/Verification_Matrix.md` |
| TC-VAL-* (validation) | <n — aim 8–15> | `→ Test_Cases.md` |

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs (`TC-VAL-<nn>`, `TP-<SLUG>-01`), PRR gate (§3), T/I/A/D (§4), severity (§5), status strings (§6), citations (§9). **The contract.**
- [`../skills/se-phase-08-validation/SKILL.md`](../skills/se-phase-08-validation/SKILL.md) — full method, validation method catalog, exit-gate checklist.
- Companion deliverable: [`Test_Cases.md`](Test_Cases.md) (TC-VAL-* cases).
- Inputs: `Phase_02_Requirements/SysRS.md` (MOE/MOP pass targets) · `Phase_01_Concept/StRS.md` + `OpsCon.md` (SN-* / SCN-*) · `Phase_07_Verification/Verification_Matrix.md` (do not duplicate TC-VER-*) · `Phase_06_Integration/Integration_Plan.md` (increment timing, HIL).
