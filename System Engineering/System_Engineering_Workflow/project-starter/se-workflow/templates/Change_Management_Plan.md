---
Document: Change Management Plan — <PROJECT NAME>
Document ID: CM-<PROJECT_SLUG>-v0.1
Standard: ISO 10007:2017 (+ EIA-649 / IEEE 828); ISO/IEC/IEEE 15288:2023 (Configuration & Information Management); ISO 31000:2018 (impact-analysis risk)
Status: Draft
Owner: <role — e.g. Configuration Manager / PMO>
---

# Change Management Plan — <PROJECT NAME>

> Blank template. Replace every `<ANGLE-BRACKET>` placeholder, resolve every `TODO:`, and delete every row marked `(example — delete)`. Conforms to [`../05_Conventions.md`](../05_Conventions.md) — do not redefine shared conventions (IDs, gates, T/I/A/D, severity, baselines, status strings, citations); cite that file.
>
> This plan owns the **change-governance loop**. Configuration-management discipline (the 4 CM functions) lives in [`Configuration_Management_Plan.md`](Configuration_Management_Plan.md); the change-request ledger lives in [`CR_Log.md`](CR_Log.md). Continuous-testing / shift-left validation is owned by Phase 10 — cross-reference it; do not re-author it here.

---

## 1. Purpose & Scope

**Purpose.** <Why this plan exists — e.g. "Define a controlled, auditable process to evaluate, approve, implement, and verify changes to the <PROJECT> baselines without losing coherence, safety, or compliance.">

**In scope.** A *change* is anything that alters a **baselined** configuration item (`CI-NN`). This plan governs changes to:
- <e.g. Requirements baseline — `Phase_02_Requirements/SysRS.md` (`REQ-*`, `MOE/MOP/TPM`)>
- <e.g. Architecture / interfaces — `Phase_04_Architecture/` (`ICD-*`)>
- <e.g. Product baseline — frozen ICDs, detailed design, build/config recipe>
- <add the controlled domains for this project>

**Out of scope.** Edits to never-baselined drafts are **not** CRs. <e.g. "Routine sprint backlog work that does not touch a baselined CI flows through normal sprint review.">

> *Decision aid:* if it touches a `Baseline (...)`-status artifact, it needs a `CR-NN`.

## 2. Change Classes

Domain-calibrated triage. **SLAs below are defaults — confirm or override per this project's regulatory exposure and release cadence.** The class label (A/B/C/D) is a *governance routing* label, **not** a version key. Map class to the `S1–S4` severity and High/Med/Low/N-A priority from [`Conventions §5`](../05_Conventions.md).

| Class | Name | Typical examples (this domain) | Severity ([§5.1](../05_Conventions.md)) | CCB review | SLA — *confirm/override* |
|---|---|---|---|---|---|
| **A** | Critical | <safety REQ affected, regulatory non-compliance, security incident, breaking external interface> | <S1> | Full CCB + Safety + Security + Compliance | TODO: `<decision within N business days>` |
| **B** | Major | <new feature, new external interface, vendor swap, architecture refactor> | <S2> | Standing CCB | TODO: `<decision within N business days>` |
| **C** | Minor | <isolated bug fix, copy/UI text, non-breaking API addition> | <S3> | Eng-lead approval; CCB notified, batched | TODO: `<CR-batched weekly>` |
| **D** | Emergency | <production-outage hotfix, urgent security patch> | <S1> | Async CCB approval; **post-hoc minutes within 5 business days** | TODO: `<act within hours; CR filed retroactively>` |
| A | Critical | Breaking change to external `ICD-NN` payment interface | S1 | Full CCB + Compliance | Decision within 5 business days | *(example — delete)* |

> **D-class is a real path, not a CCB bypass:** async approval **plus** post-hoc minutes within 5 business days; audit D-class CRs <quarterly>.

## 3. The 6-Step Change-Control Process

Document and follow these six steps (ISO 10007). Step 2 (Initial Review) is the cheap feasibility screen that kills non-starters **before** any analyst time is spent.

```
1. Submit ─▶ 2. Initial Review ─▶ 3. Impact Analysis ─▶ 4. CCB ─▶ 5. Implement & V&V ─▶ 6. Document/Notify
   (CR-NN)    (feasibility gate)     (IA-NN, class)      (decision)   (update CIs + regression)   (re-baseline + notify)
                     │                                       │
                 infeasible/                            reject / defer /
                 duplicate → close                      rework → loop
```

1. **Change Request Submission.** Requester opens a `CR-NN` in <CR tool> with required fields (see §8 CR template): title, problem, proposed change, requester, priority hint.
2. **Initial Review (feasibility gate).** <Change owner / role> screens for gross feasibility — possible? in scope? not a duplicate? Infeasible/duplicate CRs are returned/closed here, **no impact analysis spent**.
3. **Impact Analysis.** Analyst answers the 5 questions (§4), produces `IA-NN`, and assigns class A/B/C/D.
4. **Approval (CCB).** The board makes the **final** Approve / Reject / Defer / Rework decision; logged in CCB minutes. No lone approver.
5. **Implementation & V&V.** Implementer codes the change, updates **every** affected CI (SysRS / ICD / model / tests), and regenerates regression evidence linking `TC-VER-*` / `TC-VAL-*`.
6. **Documentation & Communication.** Re-baseline the affected CIs (§6), record the change in status accounting ([CM plan §5](Configuration_Management_Plan.md)), update [`CR_Log.md`](CR_Log.md), and notify stakeholders.

## 4. Impact Analysis — the 5 Questions

Every CR that clears Initial Review gets an `IA-NN`. Risk is scored per [`Conventions §5.3`](../05_Conventions.md) (Likelihood × Impact, ISO 31000).

1. **Scope** — which `CI-NN`, components, `REQ-*`, `ICD-*`, baselines are affected? *(Walk the Phase-02 trace links forward + backward.)*
2. **Risk & dependencies** — regression risks (score `RSK-NN` = L×I), coupled CRs, `TPM`-margin erosion.
3. **Cost & schedule** — delta in person-effort and weeks; re-test scope.
4. **Compliance & safety** — does it trigger re-certification or hazard re-analysis? *(Consult `Hazard_Log.md`, `Threat_Model.md`.)*
5. **Stakeholders** — who must **approve** vs. be **notified** (Engineering / Safety / Security / Compliance / Legal / Ops / Customers)?

## 5. Change Control Board (CCB)

- **Standing members:** <Engineering lead · SE lead · QA · Security · Compliance · Ops · Product · optional customer/partner rep>. TODO: confirm names/roles.
- **Quorum:** <e.g. chair + N of M functional leads>. **Security + Safety are mandatory for any class-A decision** (and Compliance where regulated).
- **Cadence:** <tie to the Phase-01 governance rhythm — do NOT invent dates>. TODO: confirm cadence. Emergency channel for class D.
- **Decisions:** Approve / Reject / Defer / Rework (request more analysis).
- **Minutes location:** `<.../ccb-minutes/YYYY-MM-DD.md>`.

## 6. Re-baselining Rules

Bump versions by the **nature of the change**, never by change class.

| Artifact type | Scheme | Bump rule |
|---|---|---|
| Documents (SysRS, ICD, architecture, this plan) | doc `vMAJOR.MINOR` | MINOR for tracked edits/additions; MAJOR at each re-baseline (breaking removal/restructure) |
| Build / config recipe | semver `MAJOR.MINOR.PATCH` ([`Conventions §6`](../05_Conventions.md)) | **MAJOR = breaking** · **MINOR = backward-compatible feature** · **PATCH = fix** |

> Semver is keyed to **breaking / feature / fix**, *not* to class A/B/C/D. A class-B feature is usually a MINOR bump; a class-A breaking interface change is a MAJOR bump — but the *breaking-ness*, not the class, decides. The version-bump on every affected CI is a **CCB exit criterion** (no silent baseline drift).

## 7. Tooling

| Concern | Tool | Notes |
|---|---|---|
| CR lifecycle / audit trail | <Jira / GitHub Issues / ServiceNow / Polarion / DOORS> | TODO: select — "we'll decide later" means no record |
| Version control | <Git + signed tags `baseline-vX.Y`> | TODO |
| CCB minutes / IA reports | <Confluence / repo `/ccb-minutes/`> | TODO |
| Regulator-required immutable exports | <location / format> | TODO: if regulated |

## 8. Templates

**CR (Change Request) template**
```
CR-NN
  Submitter / role:        <name>
  Date:                    <YYYY-MM-DD>
  Priority hint:           <High | Medium | Low>    Proposed class: <A|B|C|D>
  Problem / driver:        <what is wrong / why change>
  Proposed change:         <which CI / layer changes, and how>
  Acceptance criteria:     <how we know it's done>
  Initial impact (rough):  <one-line first guess>
  Linked:                  REQ-* / ICD-* / CI-NN / related CR-NN
```

**IA-NN (Impact Analysis) template**
```
IA-NN  (for CR-NN)
  1. Scope:                 <CI-NN / REQ-* / ICD-* / baselines>
  2. Risk & dependencies:   <RSK-NN (L×I), coupled CRs, TPM erosion>
  3. Cost & schedule:       <person-effort, weeks, re-test scope>
  4. Compliance & safety:   <re-cert? hazard re-analysis? Hazard_Log/Threat_Model refs>
  5. Stakeholders:          <approve vs notify list>
  Recommendation:          class <A|B|C|D> · <Approve|Reject|Defer|Rework> · conditions: <...> · version bump: <breaking|feature|fix>
```

**CCB minutes template**
```
CCB minutes — <YYYY-MM-DD>
  Chair:        <name>
  Attendees:    <names/roles>      Quorum met: <Y/N>   (Security+Safety present for any A: <Y/N>)
  CRs reviewed:
    | CR-NN | Class | IA-NN | Decision | Conditions |
  Action items: <owner · due · linked CR>
  Next meeting: <YYYY-MM-DD>
```

## 9. Worked Example — <CR-NN: short title>

> Walk **one** realistic mid-life CR end-to-end through the 6 steps to make the plan concrete. Do **not** copy any numbers blindly — calibrate to this project. *(example block below — replace or delete)*

- **Driver / problem:** <e.g. a key dependency reaches end-of-life / a CVE is disclosed / a new regulation lands>.
- **Proposed change:** <which CIs change>.
- **Impact analysis (IA-NN):** scope <…>; risk `RSK-NN` <L×I>; cost <…>; compliance <…>; stakeholders <…>.
- **CCB decision:** <Approve with conditions: …>.
- **Implementation & V&V:** <CIs updated; `TC-VER-*` / `TC-VAL-*` re-run>.
- **Re-baseline:** <SysRS → vX.Y; ICD-NN → vX.Y; build → semver X.Y.Z>; logged in [`CR_Log.md`](CR_Log.md).

## 10. Cross-References

- **Configuration management (4 CM functions, CI register, baselines, status accounting, FCA/PCA):** [`Configuration_Management_Plan.md`](Configuration_Management_Plan.md).
- **Change-request ledger:** [`CR_Log.md`](CR_Log.md).
- **Continuous validation / shift-left / continuous-regression pipeline:** Phase 10 — `Operations_Continuous_Validation.md` (this plan does **not** re-author it).
- **Risk scoring:** Risk & Opportunity thread (ISO 31000). **Gates / baselines / status strings / citations:** [`Conventions`](../05_Conventions.md).

---

*Gate this plan supports:* **Baselines current** ([`Conventions §1`](../05_Conventions.md)). All open items are named `TODO`s with an owner and due date.
