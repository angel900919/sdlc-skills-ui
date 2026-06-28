---
Document: TalentFlow — Change Management & Configuration Management Plan
Document ID: CMP-TALENTFLOW-v1.0
Standard: ISO 10007:2017 (+ IEEE 828) · ISO/IEC/IEEE 15288:2023 · ISO 31000:2018
Status: Draft
Owner: Configuration Manager (CM) — chairs the CCB with the Lead Systems Engineer
---

# Phase 09 — Change & Configuration Management: TalentFlow

> Two plans in one file (per the example layout): **Part A — Change Management** (the governance loop that lets a baselined TalentFlow evolve) and **Part B — Configuration Management** (the four ISO 10007 functions that keep every baseline identified, accounted, and audited). All shared conventions — IDs, gates, T/I/A/D, severity, baselines, status strings, semver, citations — come from **Conventions** and are cited (per Conventions §1–§9), never redefined. Exit gate: **Baselines current** (per Conventions §1). Continuous testing / shift-left / SLO-regression lives in **Phase 10** — this phase references it and stays on governance + CM.

This phase is the **home of the Configuration Management thread** and the change-governance engine the other threads route through. TalentFlow's tailoring is **Agile + Formal overlay** ([Concept §4](../Phase_01_Concept/Concept.md)): two-week sprints everywhere, with a **Formal change-control overlay on the Privacy, Security, and multi-tenant-isolation tracks** — tenant isolation and the privacy/erasure surface cannot regress between sprints (per Conventions §1 tailoring note). That overlay is the reason this phase exists.

---

# Part A — Change Management Plan

## A.1 Purpose & Scope

Define a controlled, auditable process to evaluate, approve, implement, and verify changes to the **TalentFlow baseline** without letting per-tenant isolation, privacy/erasure completeness, availability, or noisy-neighbor latency regress.

**A change is anything that alters a baselined CI** (Part B §B.2). Edits to never-baselined drafts are ordinary sprint work, not CRs (per Conventions §6: a `Baseline (...)`-status artifact changes *only* through a `CR-NN`).

**In scope — a CR is required when the change touches:**
- A baselined requirement in [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) (any `REQ-*`, `MOE-*`, `MOP-*`, `TPM-*`).
- The allocated/product baseline — the eleven top-level blocks of [SysRS §12.1](../Phase_02_Requirements/SysRS.md#121-intended-top-level-system-blocks) or any interface ICD seam (SAML/SCIM/OIDC at the Identity Gateway, Stripe billing, the calendar/email/job-board/HRIS connectors).
- **The tenant-isolation surface** — the Tenant Isolation Layer's tenant-scoping rules, per-tenant key separation (REQ-SEC-03), or per-tenant rate-limit/quota config (REQ-P-04). *In TalentFlow these are first-class configuration items, not "just config" — a silent change to a row-level-security policy or a quota table can regress REQ-SEC-01 or REQ-P-04 as surely as a code change.*
- **The privacy/erasure surface** — the cascade-erasure scope across primary store / search index / object storage / backups (REQ-SEC-08), consent/lawful-basis capture (REQ-SEC-06), data-access export (REQ-SEC-07), or the tenant-retention policy engine (REQ-O-04).
- The audit-logging pipeline (REQ-SEC-04) or the security/privacy posture (`Threat_Model.md` `THR-*`, DPIA, the SOC 2 / ISO 27001 control set in REQ-D-02).

**Out of scope (normal Agile sprint flow, no CCB):** recruiter-UI work, isolated bug fixes, and copy that touches **no** baselined CI and **none** of the isolation/privacy surface above. *Decision aid (per the skill's "is this a change at all?"): if losing track of the item's version would cause a defect, a cross-tenant/erasure regression, or an audit finding, it is a CI and its change needs a CR.*

## A.2 Change Classes (A/B/C/D — calibrated to TalentFlow)

The class label is a **governance routing** label, not a version key. Priority maps to the `S1–S4` severity and High/Med/Low/N-A priority of Conventions §5 (S1 ≈ class-A driver). **When torn between two classes, take the higher.**

| Class | Sev | TalentFlow examples | CCB review / quorum | SLA (calibrated to TalentFlow) |
|---|---|---|---|---|
| **A — Critical** | S1 | Change to the Tenant Isolation Layer or tenant-scoped authZ (REQ-SEC-01, mitigating RSK-01); change to the erasure cascade / crypto-erase scope (REQ-SEC-08, mitigating RSK-02); change to per-tenant key separation or encryption (REQ-SEC-03); a **breaking** identity/billing/connector interface change (SAML/SCIM, Stripe, HRIS); anything that triggers a GDPR DPIA re-assessment (REQ-D-01) or changes data residency; a live security incident response (`THR-*`). | **Full CCB + Security (STK-05/Sec) + Privacy/DPO (STK-05) + SRE (STK-07) mandatory** (TalentFlow has no human-safety thread, so the Privacy/Security trinity substitutes for a classic safety officer in quorum). | **Decision within 5 business days.** |
| **B — Major** | S2 | New feature; new external interface or connector capability; **search/indexing platform swap** (re-decide `DM-05`); multi-region topology change (`DM-03`); identity build-vs-buy reversal (`DM-04`); isolation-model change (`DM-01`); erasure-strategy change across backups (`DM-02`). | Standing CCB. | **Decision within 10 business days.** |
| **C — Minor** | S3 | Isolated bug fix; recruiter-UI copy (subject to REQ-U-02 WCAG review); a non-breaking, backward-compatible API addition; a config tweak proven by test **not** to move a TPM margin. | Engineering-lead approval; CCB **notified**, batched weekly. | **CR-batched weekly.** |
| **D — Emergency** | S1/S2 live | Production-outage hotfix; **active cross-tenant-access or data-exfiltration incident** response (RSK-01); urgent dependency/connector CVE patch; emergency tenant-credential or key rotation. | **Async CCB-chair + Security approval**; **post-hoc full CCB minutes within 5 business days.** | **Act within hours; CR filed retroactively.** |

> **D-class is a real path, not a CCB bypass.** If it can wait for the next standing CCB, it is not D. All D-class CRs are audited quarterly (Part B §B.5).
> **TalentFlow-specific class-A trigger:** any change that could let one tenant read or write another tenant's data, or let candidate PII survive an erasure, is class A *by definition* regardless of code size — because it puts **MOE-02** (confirmed cross-tenant incidents target **0**), **MOP-11** (cross-tenant access successes target **0**), and **MOE-03 / MOP-13** (erasure within the legal window target **100%**) at risk.

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

1. **Submit.** Requester opens `CR-NN` in the CR tool (Part A §A.7) with: title, problem/driver, proposed change (which CI/layer), requester, priority hint, acceptance criteria, linked `REQ-*`/ICD seam/`DM-*`/CIs.
2. **Initial Review (feasibility gate).** The CM (change owner) screens for gross feasibility — possible? in scope per §A.1? not a duplicate? Infeasible/duplicate CRs are returned or closed here, **no impact analysis spent**.
3. **Impact Analysis.** The analyst answers the 5 questions (§A.4), produces `IA-NN`, and proposes class A/B/C/D plus a version bump (breaking/feature/fix).
4. **CCB Decision.** The board makes the **final** Approve / Reject / Defer / Rework call, logged in CCB minutes. Class A requires the §A.5 quorum.
5. **Implement & V&V.** The implementer codes the change and updates **every** affected CI — `SysRS.md` REQ history, the ICD version, the isolation-policy / erasure-config / quota CIs — then regenerates regression evidence. **No TalentFlow change closes until the isolation + privacy regression suites re-run** (cross-tenant access attempts, erasure-completeness across all four stores, noisy-neighbor latency; Phases 07/08/10) and the candidate **meets or beats the current baseline** — MOP-11 must stay **0**, MOP-13 must stay **100%**.
6. **Document & Communicate.** Re-baseline the affected CIs (§A.6), record the change in status accounting (Part B §B.4), and notify stakeholders per the IA's stakeholder list. Privacy/residency-affecting changes additionally notify the Privacy Officer (STK-05) and, where a tenant's processing terms change, the affected Customer Admins (STK-04) per the DPA obligation (REQ-D-01, SN-05).

## A.4 Impact Analysis — the 5 questions (IA-NN template)

Risk is scored `Likelihood × Impact` per Conventions §5.3 and ISO 31000; new risks feed the living `Risk_Opportunity_Register.md`.

1. **Scope** — Which CIs, blocks ([SysRS §12.1](../Phase_02_Requirements/SysRS.md#121-intended-top-level-system-blocks)), `REQ-*`, ICD seams, `DM-*`, and baselines are affected? *Walk the Phase-02 trace links ([SysRS §11](../Phase_02_Requirements/SysRS.md#11-traceability-sn--req--method--verifying-activity)) forward **and** backward* — e.g. a touch on REQ-SEC-08 pulls in SN-05, REQ-SEC-07, REQ-O-04, MOP-13, TPM-04, SCN-03, and the erasure-completeness regression set.
2. **Risk & dependencies** — Regression risks (score a new/updated `RSK-NN`), coupled CRs, and **TPM-margin erosion** against `TPM-01` (availability ≥99.9% threshold), `TPM-02` (read p95 ≤400 ms threshold), `TPM-03` (sustained throughput — profile from Phase 06), `TPM-04` (erasure 100% ≤30 d). Does the change move any TPM toward its threshold? Consult `Threat_Model.md` (`THR-*`) for security-surface changes.
3. **Cost & schedule** — Delta in engineer-effort and sprints; re-test scope (which `TC-VER-*`/`TC-VAL-*` re-run — `TC-VER-TBD` until Phase 07 assigns IDs); incremental infra/cost-per-active-tenant impact (relevant to MOE-05 scalability headroom).
4. **Compliance & privacy** — Does it trigger a **DPIA re-assessment** (REQ-D-01, GDPR Art. 35), a residency re-check, a SOC 2 / ISO 27001 control re-evidence (REQ-D-02), or an erasure-completeness re-proof (REQ-SEC-08, SCN-03)? *TalentFlow has no `REQ-SAF-*` / `Hazard_Log.md`* (safety class tailored out — [SysRS §8](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements)); the equivalent mandatory re-analysis here is the **privacy/isolation DPIA + threat-model review**. Any change to a `REQ-SEC-*` on the isolation or erasure surface forces that re-analysis.
5. **Stakeholders** — Who must **approve** vs. be **notified**? Map to: Engineering, Security & Privacy Officer (STK-05), SRE/Platform (STK-07), Product (STK-06), Customer Admins (STK-04, for tenant-config/interface changes), Integration Partners (STK-08, for connector/ICD changes), Auditor/Regulator (STK-09, for evidence-affecting changes).

**IA-NN closes with a recommendation:** proposed class, decision (Approve/Reject/Defer/Rework), version bump (breaking/feature/fix), and any conditions.

## A.5 CCB — composition, quorum, cadence

| Role | Member (TalentFlow stakeholder) | Standing? |
|---|---|---|
| **Chair** | Configuration Manager (with Lead Systems Engineer) | Yes |
| Security & Privacy / DPO | STK-05 | Yes |
| Platform / SRE & On-call | STK-07 | Yes |
| Engineering Lead (services/connectors) | Engineering | Yes |
| Product / Business Owner | STK-06 | Standing (decision authority on B-feature scope) |
| Customer Admin liaison | STK-04 | Consulted for tenant-config / SSO / interface changes |
| Integration Partner liaison | STK-08 | Consulted for ICD connector changes (calendar/email/job-board/HRIS) |
| Auditor liaison | STK-09 | Consulted for changes that affect audit/erasure evidence |

- **Quorum (general):** Chair + Engineering + 3 of {Security/DPO, SRE, Product, Customer-Admin liaison}.
- **Class-A quorum (hard-wired):** Chair **+ Security & Privacy/DPO (STK-05) + SRE (STK-07) present, with Engineering**. No class-A decision without the Privacy/Security officer — TalentFlow's isolation+privacy posture is its trust-critical surface, and (with no human-safety thread) STK-05 substitutes for a classic safety officer in quorum.
- **Cadence:** tie to the Phase-01 governance rhythm (Agile, 2-week sprints) — **standing CCB once per sprint**, plus an **async emergency channel for class D**. (Specific recurring dates are owed by Phase-00 `SEMP.md` — `TODO: confirm CCB day-of-sprint with PMO.`)
- **Minutes** live at `Phase_09_Change_Config/ccb-minutes/YYYY-MM-DD.md` (chair, attendees, quorum y/n, CRs-reviewed table, decisions, conditions, action items, next meeting).

## A.6 Re-baselining rules (semver — fixed by ISO 10007, **not** keyed to class)

Bump by the **nature** of the change, never by class letter (per Conventions §6 and the skill's hard rule):

- **Documents `vMAJOR.MINOR`** (SysRS, this CMP, ICD, Architecture): **MINOR** for tracked edits/additions; **MAJOR** at each re-baseline (breaking removal/restructure). A re-baselined doc's status becomes exactly `Baseline (<GATE>-approved YYYY-MM-DD)`.
- **Build/config recipe semver `MAJOR.MINOR.PATCH`:** **MAJOR = breaking** (an existing tenant/connector/API contract breaks), **MINOR = backward-compatible feature**, **PATCH = fix**. A class-B feature is *usually* a MINOR bump and a class-A breaking ICD change a MAJOR bump — but it is the **breaking-ness**, not the class, that decides.
- **TalentFlow config CIs** (tenant-isolation policy set, erasure-cascade config, per-tenant quota/rate-limit table) carry their own semver under the same breaking/feature/fix rule. A row-level-security policy change that narrows what an existing role could read is **breaking** (MAJOR) even if its diff is two lines.
- **Version-bump is a CCB exit criterion** — no approved change closes until every affected CI's version is bumped and recorded in status accounting (Part B §B.4). No silent baseline drift.

## A.7 Tooling

| Tool | Purpose |
|---|---|
| **Jira (project `TF-CR`)** | CR lifecycle, IA records, audit trail, class/severity fields. |
| **Git + signed tags (`baseline-vX.Y`)** | Code, IaC, isolation-policy / erasure-config / quota CIs under version control; protected `main`; signed commits. |
| **Confluence / repo `ccb-minutes/`** | CCB minutes and `IA-NN` reports. |
| **CI regression gate (Phases 07/10)** | The release gate every isolation/privacy CR must pass (cross-tenant access attempts = 0, erasure completeness across all four stores = 100%, noisy-neighbor latency within §5.1); audit-required immutable test exports retained with the CR. |
| **Cloud KMS / secrets vault** | Per-tenant key-separation config CI (REQ-SEC-03) under controlled change. |

"We'll decide later" means no record — the tools above are selected now so the first CR can be filed today.

## A.8 Worked Example — `CR-01`: Switch the erasure strategy for backups to per-tenant crypto-erase — end-to-end

> One realistic mid-life CR walked through all six steps. **Numbers here are illustrative for this example — calibrate to real measurement before adopting.**

**1 — Submit.** `CR-01` "Replace hard-delete-and-restore-rewrite of backups with **per-tenant/per-record crypto-erase** so that an erasure request (REQ-SEC-08) can be satisfied within 30 days without rewriting entire backup sets." Requester: Security & Privacy Officer (STK-05). Priority hint: High. Driver: the current hard-delete approach cannot meet the 30-day window at scale once backup retention grows — it is the open design question `DM-02` and the top privacy risk **RSK-02**.

**2 — Initial Review (feasibility gate).** CM screens: feasible (the cloud KMS already supports per-tenant keys per REQ-SEC-03, so per-record key destruction is achievable), in scope (it changes the erasure cascade — a baselined privacy surface), not a duplicate. **But** it changes how PII becomes irrecoverable across backups — flag forward to IA as a privacy-critical change. Passes the gate.

**3 — Impact Analysis (`IA-01`).**

| # | Question | Finding |
|---|---|---|
| 1 | **Scope** | Changes the erasure cascade ⇒ touches **REQ-SEC-08** (erasure ≤30 d across primary/index/object/backups + auditable proof), **REQ-SEC-03** (per-tenant key separation — now the erasure mechanism), **REQ-O-04** (retention policy interaction), **REQ-SEC-04** (audit proof of completion), the **Privacy & Erasure Service** + **Data tier** blocks ([SysRS §12.1](../Phase_02_Requirements/SysRS.md#121-intended-top-level-system-blocks)), and the **erasure-cascade config CI**. Resolves design decision **`DM-02`**. Trace pulls in **SN-05** (erasure honored, provable), **SCN-03** (right-to-erasure scenario), and **SCN-05** (tenant offboarding crypto-erase). |
| 2 | **Risk & dependencies** | Directly retires **RSK-02** (erasure incomplete in backups). New `RSK-08` "a per-tenant key is destroyed for the wrong tenant/record, causing unintended data loss," L2×I5 = **High**. Erodes no availability/latency margin (TPM-01/-02/-03 unaffected); **improves** TPM-04 (erasure 100% ≤30 d) feasibility. Coupled to no other open CR. |
| 3 | **Cost & schedule** | ~2 engineer-weeks (per-record key wiring + crypto-erase job + audit-proof emission + evals). Re-test scope: **TC-VER-TBD** erasure-completeness suite must assert PII is unrecoverable from backups after key destruction; **TC-VAL-TBD** auditor-facing erasure-proof acceptance case. No measurable infra-cost delta (key ops are cheap). |
| 4 | **Compliance & privacy** | Triggers a **DPIA re-assessment** (REQ-D-01, GDPR Art. 35) and a **threat-model review** (`THR-*`) — the erasure mechanism is a regulated control. Must satisfy REQ-SEC-08's **auditable proof of completion** (the destroyed-key event becomes the erasure evidence) and preserve REQ-O-04 retention semantics. SOC 2 / ISO 27001 control evidence (REQ-D-02) updated. *No `Hazard_Log.md` re-analysis — safety class tailored out (SysRS §8).* |
| 5 | **Stakeholders** | **Approve:** Security & Privacy/DPO (STK-05), SRE (STK-07). **Notify:** Auditor liaison (STK-09, erasure-evidence change), Product (STK-06), Customer Admins (STK-04, DPA-affecting). |

**Recommendation:** **Class A** (changes a `REQ-SEC-*` erasure control + triggers DPIA — class-A by TalentFlow's §A.2 trigger). Version bump: **MAJOR** to the build recipe (the erasure mechanism is a breaking change to how backups become irrecoverable — existing restore-rewrite tooling no longer applies); **doc MINOR** to SysRS (REQ-SEC-08 history note) and to the ICD if the Data-tier seam changes.

**4 — CCB Decision.** Class-A quorum present (Chair + STK-05 + STK-07 + Engineering). **Approved with conditions:**
1. Roll out crypto-erase **shadowed alongside** the existing hard-delete for one retention cycle; compare erasure-proof outputs before cutover (no big-bang switch).
2. Add a **two-person / dual-control** check on per-tenant key destruction to mitigate the new `RSK-08` wrong-key loss.
3. Add **TC-VER-TBD** erasure-completeness-from-backups case (assert PII unrecoverable after key destruction) and a **TC-VAL-TBD** auditor-acceptance case for the erasure proof. Candidate must hold **MOP-13 = 100%** within the legal window on the regression suite before cutover.
4. Update the DPIA and the SOC 2 / ISO 27001 control evidence (REQ-D-02) before GA of the new mechanism.

**5 — Implement & V&V.** Per-record key destruction wired through the Privacy & Erasure Service and Data tier; erasure-cascade config CI updated; audit-proof emission added (REQ-SEC-04). Regression suite re-run — cross-tenant access attempts stay **0** (MOP-11 held), erasure completeness across all four stores reaches **100%** within window (MOP-13 / TPM-04 met), availability/latency TPMs unmoved. Regression evidence linked to the new `TC-VER-TBD`/`TC-VAL-TBD` (IDs resolved by Phases 07/08).

**6 — Document & Communicate.** Re-baseline: **`SyRS-TALENTFLOW` v1.0 → v1.1** (REQ-SEC-08 history note + crypto-erase wording), **ICD** next-MINOR if the Data-tier seam moved, build recipe **MAJOR** bump (breaking erasure mechanism), erasure-cascade config CI bumped. `DM-02` recorded as **decided** (feeds the Phase-05 Decision Register). Status-accounting ledger (Part B §B.4) updated; STK-09/STK-06/STK-04 notified; CCB minutes filed. **`CR-01` → Closed.**

**CR-01 ledger row** (see CR Log below):

| CR | Title | Class | Sev | IA | CCB | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| **CR-01** | Backup erasure → per-tenant crypto-erase (resolves DM-02) | A | S1-driver | IA-01 | Approved (w/ conditions) | CI-01 (SysRS), CI-04 (ICD), CI-08 (erasure-cascade config), CI-05 (build recipe), CI-11 (Threat model/DPIA) | SysRS v1.1; ICD next-MINOR; recipe MAJOR | Closed |

## A.9 Cross-reference — continuous validation → Phase 10

The **isolation/privacy regression gate** that every class-A CR must pass, post-deploy **drift/anomaly monitoring**, availability/latency observability, and staged rollout/rollback are owned by **Phase 10** (Operations & Continuous Validation) and the SLOs/`SLO-*` defined there. This phase **invokes** that gate (Step 5) but does not re-author the CI/CD or shift-left pipeline. SCN-04 (region/dependency degradation) and SCN-03 (erasure) are the operational instances those SLOs protect.

---

# Part B — Configuration Management Plan (the 4 ISO 10007 functions)

## B.1 Purpose & Scope

Establish CM discipline so every TalentFlow baseline is **identified, controlled, status-accounted, and audited** (ISO 10007:2017 + IEEE 828; realising the ISO/IEC/IEEE 15288:2023 Configuration & Information Management processes). CM authority is held by the **Configuration Manager**, chartered by Phase-00 `SEMP.md` (`TODO: confirm CM authority + document-control rules — owed by Phase 00`).

## B.2 Configuration Identification (CM function 1) — the CI register

The controlled units. Naming: documents use `vMAJOR.MINOR`; the build/config recipe and config CIs use **semver `MAJOR.MINOR.PATCH`** (per Conventions §6). CR series: `CR-NN`. CI series: `CI-NN`.

| CI | Item | Type | Owner | Controlling baseline | Version |
|---|---|---|---|---|---|
| **CI-01** | `SysRS.md` — System Requirements Spec (REQ-*, MOE/MOP/TPM) | doc | Lead Systems Engineer | Functional @ SRR | v1.0 |
| **CI-02** | `Concept.md` — Mission/StRS/OpsCon (STK-*, SN-*, SCN-*) | doc | Lead Systems Engineer | Functional @ SRR | v1.0 |
| **CI-03** | `Architecture_Description.md` — 11 blocks (SysRS §12.1), tenant trust boundaries | doc | Architect | Allocated @ PDR | `TODO` (owed Phase 04) |
| **CI-04** | `ICD.md` — identity (SAML/SCIM/OIDC), Stripe, calendar/email/job-board/HRIS seams | doc | Architect | Allocated @ PDR → frozen @ CDR | `TODO` (owed Phase 04) |
| **CI-05** | Build / deploy recipe (IaC, container manifests, connector config) | sw build | SRE (STK-07) | Product @ CDR | semver `TODO` (owed Phase 06) |
| **CI-06** | **Tenant-isolation policy set** (row-level-security / tenant-scoped authZ rules — REQ-SEC-01, REQ-C-01) | config | Security (STK-05) + SRE | Product @ CDR | semver `TODO` |
| **CI-07** | **Per-tenant rate-limit & quota table** (noisy-neighbor isolation — REQ-P-04) | config | SRE (STK-07) | Product @ CDR | semver `TODO` |
| **CI-08** | **Erasure-cascade + retention config** (REQ-SEC-08, REQ-O-04; resolves DM-02) | config | Security/Privacy (STK-05) | Product @ CDR | semver `TODO` |
| **CI-09** | **Per-tenant encryption-key config** (KMS key separation — REQ-SEC-03) | config | Security (STK-05) | Product @ CDR | semver `TODO` |
| **CI-10** | **Identity / SSO config** (SAML/SCIM/OIDC connectors, MFA policy — REQ-INT-01/02, REQ-SEC-05) | config | Security (STK-05) + Engineering | Product @ CDR | semver `TODO` |
| **CI-11** | `Threat_Model.md` (THR-*) + DPIA record | doc | Security/Privacy (STK-05) | Functional → maintained | `TODO` |
| **CI-12** | **Audit-log pipeline config** (tamper-evident PII access logging — REQ-SEC-04, REQ-D-02) | config | Security (STK-05) | Product @ CDR | semver `TODO` |
| **CI-13** | This `Change_Config_Mgmt.md` plan | doc | Configuration Manager | n/a (governance) | v1.0 |

> *Why so many isolation/privacy config CIs?* In a multi-tenant SaaS the **tenant-scoping policies, quota tables, erasure cascade, per-tenant keys, and audit pipeline are exactly the artifacts whose silent drift causes a cross-tenant breach, an incomplete erasure, or an audit finding** (skill's CI test). Putting them under `CI-NN` control is the direct mitigation for **RSK-01** (isolation defect) and **RSK-02** (erasure incomplete).

## B.3 Baseline Management (CM function 2)

TalentFlow reuses the three canonical baselines (Conventions §3); a baselined artifact's status string is exactly `Baseline (<GATE>-approved YYYY-MM-DD)`. Changes only via a `CR-NN`.

| Baseline | Established at | Contains | Current status |
|---|---|---|---|
| **Functional / Requirements** | **SRR** | `Concept.md` (CI-02), `SysRS.md` (CI-01) — REQ-*, MOE/MOP/TPM set; `Threat_Model.md`/DPIA (CI-11) maintained alongside | `Draft` — SysRS pending peer-review walkthrough + MCR conditions ([SysRS §13, §15](../Phase_02_Requirements/SysRS.md#15-srr-exit-gate)). On sign-off → `Baseline (SRR-approved <date>)`. |
| **Allocated** | **PDR** | `Architecture_Description.md` (CI-03), `ICD.md` draft (CI-04) — 11 blocks + requirement-to-block allocation + ICD draft | `TODO` — owed by Phase 04 (PDR). PDR also clears the Concept §5 Conditional-Go conditions (RSK-01 isolation design, RSK-02 erasure/DPIA). |
| **Product** | **CDR** | **Frozen ICDs** (CI-04), detailed design, build/config recipe (CI-05), and the isolation/privacy config CIs (CI-06…CI-10, CI-12) | `TODO` — owed by Phase 06 (CDR). ICDs **freeze at CDR**. |

> TalentFlow's Formal overlay means CI-06…CI-10 and CI-12 (tenant isolation, quotas, erasure cascade, per-tenant keys, identity config, audit pipeline) roll into the **Product baseline at CDR** and thereafter move **only** through a CR — this is what stops the isolation boundaries and the privacy/erasure surface from regressing between sprints (Concept §4).

## B.4 Configuration Status Accounting (CM function 3)

The **CM ledger** answers "which version of every CI is current, and what changed since SRR?" Maintained at `Phase_09_Change_Config/status-accounting.md`.

Per-CI columns: **CI · current version · controlling baseline · open CRs · closed CRs · status (`Draft`/`In Review`/`Baseline (...)`/`Superseded`)**. Example rows after `CR-01`:

| CI | Version | Baseline | Open CRs | Closed CRs | Status |
|---|---|---|---|---|---|
| CI-01 SysRS | v1.1 | Functional @ SRR | — | CR-01 | Baseline (SRR-approved `TODO`) |
| CI-04 ICD | next-MINOR | Allocated @ PDR | — | CR-01 | `TODO` (pre-PDR) |
| CI-05 Build recipe | semver MAJOR | Product @ CDR | — | CR-01 | `TODO` (pre-CDR) |
| CI-08 Erasure-cascade config | semver MINOR | Product @ CDR | — | CR-01 | `TODO` |
| CI-11 Threat model/DPIA | next-MINOR | Functional → maintained | — | CR-01 | `TODO` |

- **Cadence:** ledger updated at **each CCB** (Step 6 exit) and snapshotted **once per sprint**.
- **Owner:** Configuration Manager.
- **Report:** a per-sprint "baseline status" summary to STK-04/STK-05/STK-06/STK-07 — current versions, CRs opened/closed, and any TPM-margin movement (TPM-01 availability / TPM-02 latency / TPM-03 throughput / TPM-04 erasure) flagged from IA question 2.

## B.5 Configuration Audits — FCA & PCA (CM function 4)

Both audits run at **PRR** (Conventions §3). Owner: Configuration Manager + QA; entry criterion: all in-flight CRs closed and re-baselined. Every discrepancy becomes a new `CR-NN`.

- **FCA (Functional Configuration Audit) — *did we build it to spec?*** Verifies TalentFlow's *achieved* performance meets the functional baseline: **every `REQ-*` has closed V&V evidence** (the [SysRS §11](../Phase_02_Requirements/SysRS.md#11-traceability-sn--req--method--verifying-activity) seed matured into Phase-07 `TC-VER-*` / Phase-08 `TC-VAL-*`), and the trust-critical measures are met — **MOP-11 = 0** cross-tenant access successes (REQ-SEC-01), **MOP-13 = 100%** erasure/export within the legal window (REQ-SEC-07/08), **TPM-01 ≥99.9%** availability (REQ-O-01), **TPM-02 p95 ≤400 ms** read latency (REQ-P-01), and the independent isolation + privacy pen-test shows **zero S1/S2 open** (RSK-01/RSK-02, a PRR exit per Conventions §3).
- **PCA (Physical Configuration Audit) — *does the as-built match the as-documented?*** Verifies the as-deployed product matches the product-baseline docs: the deployed **build recipe (CI-05)** matches the tagged baseline; the running **tenant-isolation policy set (CI-06)**, **quota table (CI-07)**, **erasure-cascade config (CI-08)**, **per-tenant key config (CI-09)**, **identity config (CI-10)**, and **audit-log pipeline (CI-12)** versions match what the Product baseline records; the live **ICDs (CI-04)** match the frozen-at-CDR versions. *An undocumented row-level-security or quota-table drift is a PCA finding* — the most likely TalentFlow PCA failure mode (RSK-01), which is why CI-06…CI-10 and CI-12 are first-class CIs.

| Finding type | Goes to |
|---|---|
| A `REQ-*` lacks closed V&V evidence / a trust-measure misses target | **FCA** → new `CR-NN` |
| As-built isolation/quota/erasure/key/identity/audit config ≠ as-documented baseline | **PCA** → new `CR-NN` |

## B.6 Tooling & repositories

Per Part A §A.7 — Jira (`TF-CR`) for CRs, Git + signed tags for all CIs (including isolation-policy / erasure-config / quota CIs), `ccb-minutes/` + `status-accounting.md` in-repo, the CI regression gate as the isolation/privacy release gate, the cloud KMS / secrets vault for CI-09/CI-12. Regulator/audit-required immutable exports (erasure proofs, audit logs per REQ-SEC-04, SOC 2 evidence per REQ-D-02) retained with the CR (retention ≤ the tenant-configured REQ-O-04 policy).

## B.7 Standards anchor

| Concern | Canonical citation (Conventions §9) |
|---|---|
| Configuration management | **ISO 10007:2017** (+ EIA-649 / **IEEE 828**) |
| SE lifecycle (CM & Information Mgmt processes) | **ISO/IEC/IEEE 15288:2023** |
| Impact-analysis risk scoring | **ISO 31000:2018** |
| Quality / audit basis (FCA/PCA) | **ISO 9001:2015** |
| Privacy re-assessment trigger (class-A IA Q4) | **GDPR** Arts. 5, 17, 30, 35 |
| Security posture (class-A IA Q4) | **ISO/IEC 27001:2022** · **NIST SP 800-53 Rev. 5** · SOC 2 Type II |
| Secure backup destruction (erasure CR) | **NIST SP 800-88 Rev. 1** (crypto-erase) |

TalentFlow carries **no** DO-178C / ISO 26262 / IEC 62304 obligation (pure information system, no human-safety impact — safety class tailored out per [SysRS §8](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements)) — so the domain change/config clauses of those standards do **not** apply; the mandatory re-analysis here is the **privacy/isolation DPIA + threat-model review** (`Threat_Model.md` `THR-*`, CI-11), not a hazard re-analysis.

---

## CR Log (ledger — `CR_Log` view)

| CR | Title | Class | Sev | IA | CCB decision | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| **CR-01** | Backup erasure → per-tenant crypto-erase (resolves DM-02) | A | S1-driver | IA-01 | Approved (w/ conditions) | CI-01, CI-04, CI-08, CI-05, CI-11 | SysRS v1.1; ICD next-MINOR; recipe MAJOR | Closed |

*(Subsequent CRs append here; IDs are stable for project life — never renumbered, retired with a `(deprecated)` note.)*

---

## Exit-gate checklist — "Baselines current" (Conventions §1)

- [x] **CI register** established — CI-01…CI-13 with item, type, owner, controlling baseline, version scheme (post-PDR/CDR versions marked `TODO`/owed).
- [x] **Three baselines** identified (Functional @ SRR · Allocated @ PDR · Product @ CDR) with current version + `Baseline (...)` status (allocated/product owed by Phase 04/06).
- [x] **Change classes A/B/C/D** calibrated to TalentFlow, each mapped to `S1–S4`; TalentFlow-specific class-A triggers (cross-tenant isolation / erasure completeness) hard-wired.
- [x] **6-step process** documented **including** the Initial-Review feasibility gate (Step 2).
- [x] **5-question impact-analysis** template included; risk scored per Conventions §5.3; TPM-01/-02/-03/-04 erosion check built in.
- [x] **CCB** composition + quorum (Security/Privacy **+ SRE** mandatory for class A) + cadence (per-sprint, from Phase-01 governance) captured; minutes location set.
- [x] **Re-baselining rules** defined as breaking/feature/fix semver, explicitly **not** keyed to A/B/C/D; version-bump is a CCB exit criterion.
- [x] **Status-accounting ledger** defined with cadence (per-CCB + per-sprint) + owner (CM); answers "which version is current?".
- [x] **FCA + PCA** planned at PRR with owner, entry criteria, discrepancy→CR path; trust-measure pass criteria (MOP-11/-13, TPM-01/-02) named.
- [x] **CR/CM tool** selected (Jira `TF-CR` + Git); first CR (`CR-01`) filed and walked end-to-end.
- [x] Both plans carry Conventions §6 frontmatter; worked example walked through all six steps.
- [ ] **Open TODOs:** PDR/CDR baseline versions (Phase 04/06); CCB day-of-sprint + CM authority (Phase 00 SEMP); TC-VER/TC-VAL IDs (Phase 07/08); DM-02 Decision-Register entry confirmed (Phase 05).

**Recommendation:** governance is in place — a baselined TalentFlow can now evolve without losing coherence. Next phase: `se-phase-10-operations` for SLOs (`SLO-*`), tenant-isolation and availability observability, the isolation/privacy regression gate, and drift monitoring that this phase's changes feed.
