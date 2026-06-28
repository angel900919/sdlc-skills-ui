---
Document: Validation Test Cases — <PROJECT NAME>
Document ID: TC-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 29119-3:2021
Status: Draft            # Draft → In Review → Baseline (PRR-approved YYYY-MM-DD) → Superseded by vX.Y
Owner: Validation Lead
---

# Validation Test Cases — <PROJECT NAME>

> **Phase 08 deliverable.** `TC-VAL-*` cases prove the system meets stakeholder / operator / regulator needs in real-world conditions. Each case is **independent and re-runnable**. Conforms to [`../05_Conventions.md`](../05_Conventions.md) for `TC-VAL-<nn>` IDs, Priority (§5.2), and `S1`–`S4` defect severity (§5.1).

<!-- HOW TO USE: Replace every <placeholder>. Resolve every TODO. Delete the block marked "(example — delete)". Aim for 8–15 cases. RULES:
  • INDEPENDENCE: re-establish ALL needed state in Preconditions — never "use the result of TC-VAL-05".
  • Per-step `*Expected:*` is mandatory.
  • Actual Result + Pass/Fail Status are POST-EXECUTION — leave blank until the case is run.
  • TC-VAL ≠ TC-VER: a TC-VAL proves a user/operator/regulator OUTCOME, not a spec measurement (that is a TC-VER, Phase 07).
  • Numeric pass criteria only; derive from THIS project's MOPs — do not copy a worked example's numbers.
  • Type uses `Validation (<facet>)` — e.g. Validation (UAT), not a free-standing Functional/Non-Functional list.
  • Include ≥ 1 case with ≥ 3 simultaneous actors/sources AND a mid-operation failure (network drop / payment retry / fault). -->

---

## TC-VAL-01 — <Short title>

| Field | Value |
|---|---|
| Objective | <user/operator/regulator-level outcome> |
| Linked REQs / SN | REQ-U-NN, REQ-F-NN, SN-NN |
| Priority | High / Medium / Low (Conv §5.2) |
| Type | Validation (UAT / OAT / FAT / SAT / Regulatory / Pilot / Simulation) |
| Preconditions | <self-contained state, role, env, data — establishes ALL needed state (independence); no prior case referenced> |
| Steps | 1. <action>. *Expected:* <observable>. <br> 2. <action>. *Expected:* <observable>. <br> 3. <action>. *Expected:* <observable>. |
| Final Expected Outcome | <single-sentence pass condition referencing the linked REQs/MOPs> |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed: Pass / Fail / Blocked)_ |
| Defect refs | <S1–S4 link if Fail; Conv §5.1> |
| Evidence path | validation-evidence/TC-VAL-01/ |
| Tools | <stopwatch / analytics / camera / Postman / survey> |

---

## TC-VAL-02 — <Short title>

| Field | Value |
|---|---|
| Objective | <…> |
| Linked REQs / SN | <…> |
| Priority | <…> |
| Type | Validation (<facet>) |
| Preconditions | <self-contained state — independence> |
| Steps | 1. <action>. *Expected:* <observable>. <br> 2. <action>. *Expected:* <observable>. |
| Final Expected Outcome | <…> |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed: Pass / Fail / Blocked)_ |
| Defect refs | <…> |
| Evidence path | validation-evidence/TC-VAL-02/ |
| Tools | <…> |

<!-- Copy the TC-VAL block per case. Aim for 8–15 total. -->

---

## TC-VAL-NN — <Multi-actor concurrency + mid-operation failure case>   <!-- mandatory: ≥1 such case -->

| Field | Value |
|---|---|
| Objective | <e.g. operator handles ≥ 3 simultaneous triggers, one failing mid-operation, without losing any> |
| Linked REQs / SN | <REQ-O-NN, REQ-U-NN, SN-NN> |
| Priority | High |
| Type | Validation (OAT) |
| Preconditions | <pre-prod seeded; ≥ 3 sources armed to trigger on cue; failure injectable mid-operation. Self-contained.> |
| Steps | 1. Trigger ≥ 3 sources within <N> s. *Expected:* all surface distinctly. <br> 2. Inject a failure mid-operation (<network drop / payment retry / fault>). *Expected:* system degrades gracefully + logs it. <br> 3. Complete the operation. *Expected:* none lost; audit trail complete. |
| Final Expected Outcome | <all handled ≤ MOP-NN target with a complete audit trail; no loss under the injected failure> |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | <S1–S4 if Fail> |
| Evidence path | validation-evidence/TC-VAL-NN/ |
| Tools | <…> |

---

### TC-VAL-03 — Operator clears 3 concurrent alarms (OAT)   *(example — delete)*

| Field | Value |
|---|---|
| Objective | An on-call operator resolves three simultaneous alarms without missing one. |
| Linked REQs / SN | REQ-U-04, REQ-O-02, SN-05 |
| Priority | High |
| Type | Validation (OAT) |
| Preconditions | Pre-prod env seeded; operator role provisioned; 3 sites armed to fault on cue. (Self-contained — no prior case needed.) |
| Steps | 1. Trigger faults at sites A, B, C within 5 s. *Expected:* 3 distinct alarms surface in the console. <br> 2. Operator acknowledges each. *Expected:* each ack logged with operator ID + timestamp. <br> 3. Operator resolves all 3. *Expected:* zero alarms remain; audit trail complete. |
| Final Expected Outcome | All 3 alarms acknowledged ≤ MOP-07 target and resolved with a complete audit trail (REQ-O-02). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | — |
| Evidence path | validation-evidence/TC-VAL-03/ |
| Tools | Console + log query |

---

## Coverage Check

> Confirm before PRR (do not leave gaps):

- [ ] Every `REQ-U-*` links to ≥ 1 TC-VAL.
- [ ] Every primary stakeholder's top scenario (`SCN-*`) links to ≥ 1 TC-VAL.
- [ ] Every `HAZ-*` with a behavioural mitigation has a validating TC-VAL (a failed safety TC-VAL is S1).
- [ ] ≥ 1 case exercises ≥ 3 simultaneous actors/sources + a mid-operation failure.
- [ ] Every case is independent (state re-established in Preconditions).
- [ ] Every case has per-step `*Expected:*` **and** blank Actual Result + Pass/Fail Status.

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs (`TC-VAL-<nn>`), Priority (§5.2), severity `S1`–`S4` (§5.1), status strings (§6), citations (§9). **The contract.**
- [`../skills/se-phase-08-validation/SKILL.md`](../skills/se-phase-08-validation/SKILL.md) — full method, TC-VAL template, validation method catalog, exit-gate checklist.
- Companion deliverable: [`Test_Plan.md`](Test_Plan.md) (`TP-<SLUG>-01`, the 10 plan sections).
- Inputs: `Phase_01_Concept/StRS.md` + `OpsCon.md` (SN-* / SCN-*) · `Phase_02_Requirements/SysRS.md` (MOE/MOP pass targets) · `Phase_07_Verification/Verification_Matrix.md` (do not duplicate TC-VER-*) · cross-cutting `Hazard_Log.md`.
