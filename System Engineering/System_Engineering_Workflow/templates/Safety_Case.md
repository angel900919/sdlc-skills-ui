<!-- TEMPLATE — Safety Case. Owning thread: ../cross-cutting/Safety_RAMS_Engineering.md. Fill the <placeholders>; delete (example — delete) rows; never invent evidence (use TODO: <owed, by whom>). Cite ../05_Conventions.md; do not redefine IDs/gates. Use only when a safety thread is active (see ../04_Tailoring_Guide.md). -->
---
Document: Safety Case — <Project Name>
Document ID: SAFE-<PROJECT_SLUG>-v0.1
Standard: <IEC 61508 / ISO 26262 / DO-178C / IEC 62304 — pick the applicable>; ISO 14971 (risk)
Status: Draft
Owner: <Safety / RAMS lead>
---

# Safety Case — <Project Name>

> A **structured argument**, supported by evidence, that the system is acceptably safe for its defined operating context. Claim → Argument → Evidence. See [`../cross-cutting/Safety_RAMS_Engineering.md`](../cross-cutting/Safety_RAMS_Engineering.md).

## 1. Scope & operating context
- System / configuration under argument: <what, version/baseline>
- Operating environment & boundaries: <where, with whom, assumptions>
- Applicable safety standard & integrity level: <e.g. SIL-2 / ASIL-B / DAL-C / IEC 62304 Class B>

## 2. Top-level safety claim
> **Claim:** <The \<system\> is acceptably safe to operate in \<context\>, with all identified hazards mitigated to \<target risk level\>.>

## 3. Argument structure (claim → sub-claims → evidence)
| Sub-claim | Argument (why this supports the claim) | Evidence (ref) | Status |
|---|---|---|---|
| All credible hazards identified | FHA + PHA/SHA performed and reviewed | Hazard Log (HAZ-*), [`../cross-cutting/`](../cross-cutting/Safety_RAMS_Engineering.md) | <open/closed> |
| Each hazard mitigated to target | Mitigations allocated to REQ-SAF-* and verified | Verification Matrix (TC-VER-*) | <open/closed> |
| Mitigations verified & validated | T/I/A/D evidence per safety requirement | Phase 07/08 evidence | <open/closed> |
| Residual risk accepted | Risk acceptance by authority | CCB / safety board minutes | <open/closed> |
<!-- (example — delete) | No single failure causes loss of charge-control | FTA shows no single-point failure; contactor weld detection | FTA-01, TC-VER-12 | open -->

## 4. Hazard summary (from the Hazard Log)
| HAZ-ID | Hazard | Severity | Likelihood | Risk (pre) | Mitigation → REQ-SAF | Risk (post) |
|---|---|---|---|---|---|---|
| HAZ-<nn> | <hazard> | <Catastrophic/Critical/Marginal/Negligible> | <freq> | <band> | REQ-SAF-<nn> | <band> |

## 5. Residual risk & acceptance
- Residual risks above target: <list, or "none">
- Acceptance authority & decision: <role> — <Accept / Reject / Conditions> — TODO: <date>

## 6. Assumptions, limitations & open items
- Assumptions the argument depends on: <list>
- TODO: <evidence still owed, by whom, by when>

> **Gate linkage:** the safety case is reviewed at PDR (preliminary), CDR (interfaces), and is a PRR exit condition. Reopened by any safety-relevant CR (Phase 09).
