# Change Management Plan — EVCN

**Document ID:** CM-EVCN-v1.0
**Owner:** Program Management Office
**Reviewers:** Engineering, Compliance, Security, Operations, Finance.

---

## 1. Purpose

Define a controlled, auditable process to evaluate, approve, implement, and verify changes to the EVCN baseline (SysRS, ICDs, BDD, firmware, cloud services, mobile/web clients) without compromising safety, compliance, or driver trust.

## 2. Scope

Applies to any change that affects:
- Requirements (`Phase_02_Requirements/SysRS.md`)
- Architecture / interfaces (`Phase_04_Architecture/`)
- Critical-path firmware (charge control, OCPP, ISO 15118, payment)
- Customer-visible API contracts
- Compliance posture (UL, FCC, CE, PCI, GDPR)

Routine sprint backlog work that does **not** touch the items above flows through normal Agile sprint review (no CCB).

## 3. Change Classes

| Class | Examples | Approval Path | Re-test Scope |
|---|---|---|---|
| **A — Critical** | Power electronics topology, OCPP/15118 conformance, GFCI logic, payment data flow | CCB **+** Compliance + Safety officer | Full system regression + recertification (UL/PCI as applicable) |
| **B — Major** | Tariff engine logic, OCPI module, dashboard RBAC roles, cellular vendor swap | CCB | Full integration regression |
| **C — Minor** | UI copy, telemetry tags, non-critical bugfixes | Engineering Lead | Sprint-level test |
| **D — Emergency Hotfix** | Active security or safety incident | On-call + CCB chair (post-hoc full review within 5 days) | Targeted patch + smoke; full regression within 2 sprints |

## 4. Process

```
[CR submitted] → [Triage & Classify] → [Impact Analysis] → [CCB Review]
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                        [Approved]                       [Rejected / Deferred]
                              │
                              ▼
                  [Implement + V&V evidence] → [Baseline Update] → [Notify Stakeholders]
```

### 4.1 Submit Change Request
Submitted in Jira project `EVCN-CR` with template:
- Title, requester, classification proposal
- Problem statement / driver
- Proposed change
- Affected REQs / ICDs / blocks
- Proposed verification & evidence plan

### 4.2 Triage & Classify
Engineering Lead + PMO triage within 2 business days; assigns Class A–D.

### 4.3 Impact Analysis (5 questions)
Authored by the change owner; reviewed at CCB:
1. **Scope** — what artifacts (REQs, blocks, ICDs, code paths)?
2. **Risk & Dependencies** — regression candidates? safety/compliance exposure?
3. **Cost & Schedule** — engineer-weeks; site downtime; recertification time/cost.
4. **Compliance & Safety** — UL/FCC/CE/PCI/GDPR re-test required?
5. **Stakeholder input** — drivers/operators/utility/regulator notification needs?

### 4.4 Change Control Board (CCB)
- **Membership:** PMO chair, Engineering Lead, Firmware Lead, Cloud Lead, Compliance, Security, Operations, Customer Success.
- **Cadence:** Weekly during Q3–Q4; biweekly otherwise; emergency channel for Class D.
- **Quorum:** PMO + 4 of the 7 functional leads.
- **Decisions:** Approve / Reject / Defer / Request more analysis.

### 4.5 Implement & V&V
- Branch off `main`, gated by feature flag where possible.
- All Class A/B changes require updated entries in:
  - `Phase_02_Requirements/SysRS.md` (REQ change history)
  - `Phase_04_Architecture/ICD.md` (version bump)
  - `Phase_07_Verification/Verification_Matrix.md` (added/updated TC-VER-*)
- Class A: re-run conformance suites (OCPP, ISO 15118) and apply for incremental certification where required.

### 4.6 Baseline Update
After successful V&V, PMO:
- Tags repository (`baseline-vX.Y`)
- Re-baselines SysRS to next minor/major version
- Updates Decision Register if a prior trade-off is reopened

### 4.7 Notify Stakeholders
- Internal: Slack + release notes.
- Operators: dashboard release banner + PDF release notes.
- Drivers: in-app release notes for user-visible changes; mandatory disclosures via email for privacy/payment changes.
- Regulators: notification per PCI/GDPR/UL obligation timelines.

## 5. Tools

| Tool | Purpose |
|---|---|
| **Jira (project EVCN-CR)** | CR lifecycle, audit trail |
| **GitHub** | Code, firmware, IaC; protected branches; signed commits |
| **Confluence** | CCB minutes, impact-analysis reports |
| **Argo CD + Argo Rollouts** | Staged cloud rollouts with auto-rollback |
| **Argo CD ApplicationSet** | Per-cohort station OTA |
| **Markdown SysRS** | Single source of truth for requirements baseline |

## 6. Worked Example — CR-2026-014: Migrate to ISO 15118-20

**Change Class:** A (Critical)

**Problem:** ISO 15118-2 supports unidirectional PnC. New OEM models require ISO 15118-20 for bidirectional charging (V2G), and roaming partners are scheduling 15118-20 conformance.

**Proposed change:**
- Upgrade SECC stack to switch-ev/iso15118 v0.20.x.
- Add bidirectional power flow APIs to Power Electronics firmware (fed by SiC-vendor update).
- Add new state `Discharging` to State Machine.
- Add new OCPP 2.0.1 variables (`V2G.Connector`, etc.).

**Impact analysis:**

| Question | Answer |
|---|---|
| Scope | SysRS (new REQ-F-13, REQ-P-08), ICD-01, ICD-03, State Machine, BDD `Power Electronics`. |
| Risk | New code in safety path; bidirectional contactor logic must be re-verified. |
| Cost / Schedule | ~6 engineer-months (firmware + cloud + test); ~6 weeks for re-verification + UL incremental. |
| Compliance | UL 2594 incremental cert needed for V2G; FCC EMC re-test for bidirectional emissions. |
| Stakeholders | Engineering, Compliance, Operations, Utility (V2G market participation), select fleet customers. |

**CCB Decision:** Approved with conditions:
1. Roll out to a 5-station V2G pilot first; mainstream stations remain unidirectional until pilot passes.
2. Add **TC-VER-36 (V2G state machine)** and **TC-VAL-13 (V2G end-to-end with fleet pilot)**.
3. New state `Discharging` requires red-team review before enablement.

**Documentation updates:**
- `SysRS.md` → bumped to v1.1 with REQ-F-13, REQ-P-08.
- `ICD.md` → ICD-01 / ICD-03 to v1.1 with bidirectional fields.
- `Phase_03_Modeling/State_Machine.puml` → adds `Discharging` state.
- Verification Matrix → +2 cases.

**Tools used:** Jira CR EVCN-CR-014; GitHub PR #4421 (firmware), #4428 (cloud); Confluence CCB minutes 2026-Q2-W7.

## 7. Audit & Retention

- All CRs retained for ≥ 7 years (matches REQ-O-05).
- CCB minutes retained alongside CRs.
- Quarterly internal audit samples 5% of CRs to verify process compliance.

## 8. Continuous Improvement

- After each CR closure, the requester rates: "Was the impact analysis adequate?" (1–5).
- Quarterly PMO review of mean lead-time, % rework, % rollbacks.
- Annual review of change-class definitions; tune thresholds based on incident data.
