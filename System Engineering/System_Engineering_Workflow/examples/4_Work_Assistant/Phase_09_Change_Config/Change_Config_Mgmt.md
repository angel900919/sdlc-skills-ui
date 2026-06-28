---
Document: Aria — Change Management & Configuration Management Plan
Document ID: CMP-ARIA-v1.0
Standard: ISO 10007:2017 (+ IEEE 828) · ISO/IEC/IEEE 15288:2023 · ISO 31000:2018
Status: Draft
Owner: Configuration Manager (CM) — chairs the CCB with the Lead Systems Engineer
---

# Phase 09 — Change & Configuration Management: Aria

> Two plans in one file (per the example layout): **Part A — Change Management** (the governance loop that lets a baselined Aria evolve) and **Part B — Configuration Management** (the four ISO 10007 functions that keep every baseline identified, accounted, and audited). All shared conventions — IDs, gates, T/I/A/D, severity, baselines, status strings, semver, citations — come from **Conventions** and are cited, never redefined. Exit gate: **Baselines current** (per Conventions §1). Continuous testing / shift-left / eval-regression lives in **Phase 10** — this phase references it and stays on governance + CM.

This phase is the **home of the Configuration Management thread** and the change-governance engine the other threads route through. Aria's tailoring is **Standard+** (Concept §4): Agile everywhere, with a **Formal change-control overlay on the identity, privacy/security, and AI-action-safety tracks** — the trust boundaries and write-action gates cannot regress between sprints. That overlay is the reason this phase exists.

---

# Part A — Change Management Plan

## A.1 Purpose & Scope

Define a controlled, auditable process to evaluate, approve, implement, and verify changes to the **Aria baseline** without letting AI-action-safety, per-user isolation, privacy, or grounding quality regress.

**A change is anything that alters a baselined CI** (Part B §B.2). Edits to never-baselined drafts are ordinary sprint work, not CRs (per Conventions §6: a `Baseline (...)`-status artifact changes *only* through a `CR-NN`).

**In scope — a CR is required when the change touches:**
- A baselined requirement in `Phase_02_Requirements/SysRS.md` (any `REQ-*`, `MOE-*`, `MOP-*`, `TPM-*`).
- The allocated/product baseline — the eight blocks of SysRS §12 or any interface `ICD-01…ICD-06` (the four connectors + LLM/model API + SSO/IdP).
- **The agent's behavioural surface** — the LLM model/tier routing (`DM-01`), the system/tool prompts, the tool allow-list (REQ-F-08), the RAG grounding/citation config (`DM-02`), or the guardrail/injection-defense rules (`DM-05`). *In Aria these are first-class configuration items, not "just config" — a silent prompt edit can regress REQ-SEC-07 or REQ-P-05 as surely as a code change.*
- The Action-Confirmation Gate or any control implementing REQ-SAF-01 / REQ-SAF-02 / REQ-F-09 (HITL write safety).
- Identity/token handling (REQ-SEC-02 / REQ-SEC-04) or the security/privacy posture (`Threat_Model.md` `THR-*`, DPIA, residency REQ-C-01).

**Out of scope (normal Agile sprint flow, no CCB):** UI work, bug fixes, and content that touches **no** baselined CI and **none** of the agent's behavioural surface above. *Decision aid (per the skill's "is this a change at all?"): if losing track of the item's version would cause a defect, an isolation/injection regression, or an audit finding, it is a CI and its change needs a CR.*

## A.2 Change Classes (A/B/C/D — calibrated to Aria)

The class label is a **governance routing** label, not a version key. Priority maps to the `S1–S4` severity and High/Med/Low/N-A priority of Conventions §5 (S1 ≈ class-A driver). **When torn between two classes, take the higher.**

| Class | Sev | Aria examples | CCB review / quorum | SLA (calibrated to Aria) |
|---|---|---|---|---|
| **A — Critical** | S1 | Change to an AI-action-safety control (REQ-SAF-01/-02, REQ-F-09 Action-Confirmation Gate); change to per-user isolation / least-privilege scopes (REQ-SEC-02/-03/-04); injection-defense / guardrail / sandbox change (REQ-SEC-07, mitigating RSK-01/THR-*); a **breaking** connector or model-API interface change (ICD-01…ICD-06); anything that triggers GDPR re-assessment of the DPIA (REQ-D-01) or moves data residency (REQ-C-01). | **Full CCB + Security (STK-04) + DPO (STK-05) + AI/ML Lead (STK-08) mandatory** (Aria's "Safety" is AI-action safety, so the AI Lead substitutes for a classic safety officer in quorum). | **Decision within 5 business days.** |
| **B — Major** | S2 | New feature / new tool added to the allow-list; **non-breaking** new connector capability; **LLM provider or model-tier swap** (re-decide `DM-01`); RAG architecture change (`DM-02`); agent-framework / connector build-vs-buy reversal (`DM-03`); token-store approach change (`DM-04`). | Standing CCB. | **Decision within 10 business days.** |
| **C — Minor** | S3 | Isolated bug fix; dashboard/UI copy (subject to REQ-U-04 transparency wording review); non-breaking, behaviour-preserving config tweak; a prompt edit proven by eval **not** to move TPM-01/-03 margin. | Engineering-lead approval; CCB **notified**, batched weekly. | **CR-batched weekly.** |
| **D — Emergency** | S1/S2 live | Production-outage hotfix; **active prompt-injection / data-exfiltration incident** response (RSK-01); urgent connector/LLM-provider CVE patch; emergency token revocation rollout. | **Async CCB-chair + Security approval**; **post-hoc full CCB minutes within 5 business days.** | **Act within hours; CR filed retroactively.** |

> **D-class is a real path, not a CCB bypass.** If it can wait for the next standing CCB, it is not D. All D-class CRs are audited quarterly (Part B §B.5).
> **Aria-specific class-A trigger:** any change that could let a write execute without confirmation, or let one employee's data reach another, is class A *by definition* regardless of code size — because it puts MOE-04 (trust-critical incidents target **0**) and MOP-05 (unconfirmed writes target **0**) at risk.

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
5. Implement & V&V ── update every affected CI; regenerate regression evidence (TC-VER-* / TC-VAL-*) + eval suite
        │
6. Document & Communicate ── re-baseline affected CIs; record in status accounting; notify stakeholders
```

1. **Submit.** Requester opens `CR-NN` in the CR tool (Part A §A.6) with: title, problem/driver, proposed change (which CI/layer), requester, priority hint, acceptance criteria, linked `REQ-*`/`ICD-*`/`DM-*`/CIs.
2. **Initial Review (feasibility gate).** The CM (change owner) screens for gross feasibility — possible? in scope per §A.1? not a duplicate? Infeasible/duplicate CRs are returned or closed here, **no impact analysis spent**.
3. **Impact Analysis.** The analyst answers the 5 questions (§A.4), produces `IA-NN`, and proposes class A/B/C/D plus a version bump (breaking/feature/fix).
4. **CCB Decision.** The board makes the **final** Approve / Reject / Defer / Rework call, logged in CCB minutes. Class A requires the §A.5 quorum.
5. **Implement & V&V.** The implementer codes the change and updates **every** affected CI — `SysRS.md` REQ history, `ICD.md` version, the agent prompt/model/guardrail CIs, the eval-set definition — then regenerates regression evidence. **No Aria change closes until the eval harness re-runs** (groundedness, task-success, injection, action-safety; Phase 06/10) and the candidate **meets or beats the current baseline** (this is exactly SCN-07's model/prompt-rollout gate, made mandatory for *every* behavioural change).
6. **Document & Communicate.** Re-baseline the affected CIs (§A.6), record the change in status accounting (Part B §B.4), and notify stakeholders per the IA's stakeholder list. Privacy/residency-affecting changes additionally notify the DPO (STK-05) and, where the workforce is affected, the Works Council (STK-09) per the transparency commitment (REQ-U-04, SN-14).

## A.4 Impact Analysis — the 5 questions (IA-NN template)

Risk is scored `Likelihood × Impact` per Conventions §5.3 and ISO 31000; new risks feed the living `Risk_Opportunity_Register.md`.

1. **Scope** — Which CIs, blocks (SysRS §12), `REQ-*`, `ICD-*`, `DM-*`, and baselines are affected? *Walk the Phase-02 trace links (SysRS §14) forward **and** backward* — e.g. a touch on REQ-SEC-07 pulls in SN-03, REQ-F-08, MOP-12, TPM-03, and the injection red-team eval set.
2. **Risk & dependencies** — Regression risks (score a new/updated `RSK-NN`), coupled CRs, and **TPM-margin erosion** against `TPM-01` (grounding ≥95%), `TPM-02` (availability ≥99.5%), `TPM-03` (injection defense ≥99%). Does the change move any TPM toward its threshold? Consult `Threat_Model.md` (`THR-*`) for security-surface changes.
3. **Cost & schedule** — Delta in engineer-effort and sprints; re-test scope (which `TC-VER-*`/`TC-VAL-*` re-run); incremental per-task **model spend** impact (DM-01 routing, MOP-10).
4. **Compliance & safety (AI-action safety)** — Does it trigger a **DPIA re-assessment** (REQ-D-01, Art. 35), a residency re-check (REQ-C-01), a no-training-term re-confirmation (REQ-C-02), or a **hazard re-analysis** in `Hazard_Log.md` (HAZ-01 wrong/irreversible action, HAZ-02 destructive action)? Any change to a SAF requirement forces a hazard re-analysis.
5. **Stakeholders** — Who must **approve** vs. be **notified**? Map to: Engineering, Security (STK-04), DPO (STK-05), AI/ML Lead (STK-08), SRE/On-call (STK-07), App owners (STK-06, for interface changes), Works Council (STK-09, for transparency/monitoring-perception changes), Manager/Sponsor (STK-02).

**IA-NN closes with a recommendation:** proposed class, decision (Approve/Reject/Defer/Rework), version bump (breaking/feature/fix), and any conditions.

## A.5 CCB — composition, quorum, cadence

| Role | Member (Aria stakeholder) | Standing? |
|---|---|---|
| **Chair** | Configuration Manager (with Lead Systems Engineer) | Yes |
| Security & Compliance | STK-04 | Yes |
| Data Protection Officer | STK-05 | Yes |
| AI/ML Engineering Lead | STK-08 | Yes |
| Platform / SRE & On-call | STK-07 | Yes |
| Engineering Lead (connectors/dashboard) | Engineering | Yes |
| Product / Sponsor | STK-02 | Standing (decision authority on B-feature scope) |
| App-owner liaison | STK-06 | Consulted for ICD-01…04 interface changes |
| Works Council liaison | STK-09 | Consulted for transparency/monitoring-perception changes (SN-14) |

- **Quorum (general):** Chair + Engineering + 3 of {Security, DPO, AI Lead, SRE, Product}.
- **Class-A quorum (hard-wired):** Chair **+ Security (STK-04) + DPO (STK-05) + AI/ML Lead (STK-08) all present.** No class-A decision without all three — these are Aria's safety/security/compliance trinity (AI-action safety substitutes for a classic safety officer).
- **Cadence:** tie to the Phase-01 governance rhythm (Agile, 2-week sprints) — **standing CCB once per sprint**, plus an **async emergency channel for class D**. (Specific recurring dates are owed by Phase-00 `SEMP.md` — `TODO: confirm CCB day-of-sprint with PMO.`)
- **Minutes** live at `Phase_09_Change_Config/ccb-minutes/YYYY-MM-DD.md` (chair, attendees, quorum y/n, CRs-reviewed table, decisions, conditions, action items, next meeting).

## A.6 Re-baselining rules (semver — fixed by ISO 10007, **not** keyed to class)

Bump by the **nature** of the change, never by class letter (per Conventions §6 and the skill's hard rule):

- **Documents `vMAJOR.MINOR`** (SysRS, this CMP, ICD, Architecture): **MINOR** for tracked edits/additions; **MAJOR** at each re-baseline (breaking removal/restructure). A re-baselined doc's status becomes exactly `Baseline (<GATE>-approved YYYY-MM-DD)`.
- **Build/config recipe semver `MAJOR.MINOR.PATCH`:** **MAJOR = breaking** (an existing consumer/connector contract breaks), **MINOR = backward-compatible feature**, **PATCH = fix**. A class-B feature is *usually* a MINOR bump and a class-A breaking ICD change a MAJOR bump — but it is the **breaking-ness**, not the class, that decides.
- **Aria agent-CI versions** (prompt set, model-routing config, guardrail ruleset, eval-set) carry their own semver under the same breaking/feature/fix rule. A prompt change that alters tool-call behaviour an existing flow relied on is MAJOR even if its diff is two lines.
- **Version-bump is a CCB exit criterion** — no approved change closes until every affected CI's version is bumped and recorded in status accounting (Part B §B.4). No silent baseline drift.

## A.7 Tooling

| Tool | Purpose |
|---|---|
| **Jira (project `ARIA-CR`)** | CR lifecycle, IA records, audit trail, class/severity fields (the system under management already integrates JIRA — REQ-INT-03). |
| **Git + signed tags (`baseline-vX.Y`)** | Code, IaC, prompt/guardrail/eval CIs under version control; protected `main`; signed commits. |
| **Confluence / repo `ccb-minutes/`** | CCB minutes and `IA-NN` reports. |
| **Eval harness (Phase 06/10)** | The release gate every behavioural CR must pass (groundedness/task-success/injection/action-safety); regulator-/audit-required immutable eval exports retained with the CR. |
| **Secrets vault** | Token-store config CI (DM-04) under controlled change (REQ-SEC-04). |

"We'll decide later" means no record — the tools above are selected now so the first CR can be filed today.

## A.8 Worked Example — `CR-01`: Add a destructive-action tool (delete JIRA issue) — end-to-end

> One realistic mid-life CR walked through all six steps. **Numbers here are illustrative for this example — calibrate to real measurement before adopting.**

**1 — Submit.** `CR-01` "Add a `jira.deleteIssue` tool so employees can ask Aria to delete a stray duplicate issue." Requester: Product (STK-02). Priority hint: Medium. Driver: top user request from SCN-02-style workflows; today Aria can create/transition issues (REQ-INT-03) but not delete.

**2 — Initial Review (feasibility gate).** CM screens: feasible (JIRA Cloud REST supports delete), in scope (a new allow-listed tool), not a duplicate. **But** it adds a **destructive, irreversible** capability — flag forward to IA. Passes the gate.

**3 — Impact Analysis (`IA-01`).**

| # | Question | Finding |
|---|---|---|
| 1 | **Scope** | New tool on the per-tenant allow-list ⇒ touches **REQ-F-08** (allow-list), **REQ-SAF-02** (destructive-action confirmation + undo reference), **REQ-F-09 / REQ-SAF-01** (HITL gate), **REQ-U-03** (confirmation surface must make reversibility unambiguous), **ICD-03** (JIRA connector — adds a write verb), the **Agent Orchestrator** + **Untrusted-Content Sandbox** blocks (SysRS §12), the **tool-prompt CI** and **guardrail CI**. Trace pulls in **SN-04** (no write without OK) and **SN-03** (content can't hijack). |
| 2 | **Risk & dependencies** | New `RSK-08` "a delete is confirmed on the wrong issue / coaxed by injected content," L2×I4 = **High**. Erodes margin on **TPM-03** (injection defense) — a delete is a high-value injection target (RSK-01). No TPM-01/-02 impact. Coupled to no other open CR. |
| 3 | **Cost & schedule** | ~1.5 engineer-weeks (connector verb + confirmation surface + guardrail rule + evals). Re-test scope: **TC-VER-TBD** action-safety + injection suites must add delete cases; **TC-VAL-TBD** destructive-action human-acceptance case. |
| 4 | **Compliance & safety (AI-action)** | Triggers **hazard re-analysis** — extends **HAZ-02** (destructive action). No DPIA change (no new PII category). Must satisfy REQ-SAF-02's **distinct irreversibility acknowledgement** + **undo reference where upstream supports it** (JIRA delete is *not* trivially undoable ⇒ record the pre-delete snapshot as the undo reference). |
| 5 | **Stakeholders** | **Approve:** Security (STK-04), AI Lead (STK-08), DPO not required (no new PII) but **notified**. **Notify:** App-owner liaison (STK-06, JIRA), SRE (STK-07). |

**Recommendation:** **Class A** (touches a SAF control + adds an irreversible action — class-A by Aria's §A.2 trigger). Version bump: **MINOR** to the build recipe (backward-compatible new capability — *note the class is A but the bump is MINOR; breaking-ness, not class, decides*); **doc MINOR** to SysRS and ICD.

**4 — CCB Decision.** Class-A quorum present (Chair + STK-04 + STK-05 + STK-08). **Approved with conditions:**
1. Ship behind a per-tenant feature flag, **off by default**; tenant admin opt-in.
2. Confirmation surface must show the **exact issue key + summary** and require a **typed/explicit irreversibility acknowledgement** (REQ-SAF-02, REQ-U-03).
3. Add **TC-VER-TBD** delete-action-safety case (assert 0 unconfirmed deletes) and a delete-specific **injection red-team** case (assert injected "delete this" never reaches execution); add **TC-VAL-TBD** human-acceptance case. Candidate must **meet/beat** TPM-03 baseline on the eval suite before enable.
4. Record the pre-delete snapshot as the REQ-SAF-02 undo reference.

**5 — Implement & V&V.** New verb added to the JIRA connector; allow-list entry added (REQ-F-08); guardrail CI updated; confirmation surface built; tool-prompt CI updated. Eval harness re-run — injection suite stays **≥99%** (TPM-03 threshold ≥95% held), action-safety suite shows **0** unconfirmed executes (MOP-05 = 0 held). Regression evidence linked to the new `TC-VER-TBD`/`TC-VAL-TBD` (IDs resolved by Phase 07/08).

**6 — Document & Communicate.** Re-baseline: **`SyRS-ARIA` v1.0 → v1.1** (REQ-F-08 history note + new destructive-tool wording), **`ICD-03` → next MINOR** (delete verb), build recipe **MINOR** bump, agent tool-prompt/guardrail/eval CIs bumped. Status-accounting ledger (Part B §B.4) updated; stakeholders notified; CCB minutes filed. **`CR-01` → Closed.**

**CR-01 ledger row** (see `CR_Log` below):

| CR | Title | Class | Sev | IA | CCB | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| **CR-01** | Add `jira.deleteIssue` destructive tool | A | S1-driver | IA-01 | Approved (w/ conditions) | CI-01 (SysRS), CI-04 (ICD), CI-06 (agent prompts), CI-08 (guardrails), CI-05 (build recipe) | SysRS v1.1; ICD next-MINOR; recipe MINOR | Closed |

## A.9 Cross-reference — continuous validation → Phase 10

The **eval-regression gate** that every behavioural CR must pass, post-deploy **drift monitoring**, AI-action observability, and staged rollout/rollback are owned by **Phase 10** (Operations & Continuous Validation) and the SLOs/`SLO-*` defined there. This phase **invokes** that gate (Step 5) but does not re-author the CI/CD or shift-left pipeline. SCN-07 (model/prompt rollout) is the operational instance of that gate.

---

# Part B — Configuration Management Plan (the 4 ISO 10007 functions)

## B.1 Purpose & Scope

Establish CM discipline so every Aria baseline is **identified, controlled, status-accounted, and audited** (ISO 10007:2017 + IEEE 828; realising the ISO/IEC/IEEE 15288:2023 Configuration & Information Management processes). CM authority is held by the **Configuration Manager**, chartered by Phase-00 `SEMP.md` (`TODO: confirm CM authority + document-control rules — owed by Phase 00`).

## B.2 Configuration Identification (CM function 1) — the CI register

The controlled units. Naming: documents use `vMAJOR.MINOR`; the build/config recipe and agent CIs use **semver `MAJOR.MINOR.PATCH`** (per Conventions §6). CR series: `CR-NN`. CI series: `CI-NN`.

| CI | Item | Type | Owner | Controlling baseline | Version |
|---|---|---|---|---|---|
| **CI-01** | `SysRS.md` — System Requirements Spec (REQ-*, MOE/MOP/TPM) | doc | Lead Systems Engineer | Functional @ SRR | v1.0 |
| **CI-02** | `Concept.md` — Mission/StRS/OpsCon (STK-*, SN-*, SCN-*) | doc | Lead Systems Engineer | Functional @ SRR | v1.0 |
| **CI-03** | `Architecture_Description.md` — 8 blocks (SysRS §12), trust boundaries | doc | Architect | Allocated @ PDR | `TODO` (owed Phase 04) |
| **CI-04** | `ICD.md` — ICD-01…ICD-06 (4 connectors + LLM API + SSO/IdP) | doc | Architect | Allocated @ PDR → frozen @ CDR | `TODO` (owed Phase 04) |
| **CI-05** | Build / deploy recipe (IaC, container manifests, connector config) | sw build | SRE (STK-07) | Product @ CDR | semver `TODO` (owed Phase 06) |
| **CI-06** | **Agent prompt set** (system + tool prompts) | model-config | AI/ML Lead (STK-08) | Product @ CDR | semver `TODO` |
| **CI-07** | **LLM model + tier-routing config** (DM-01) | model-config | AI/ML Lead (STK-08) | Product @ CDR | semver `TODO` |
| **CI-08** | **Guardrail / injection-defense ruleset + tool allow-list** (REQ-F-08, REQ-SEC-07) | model-config | AI/ML Lead + Security | Product @ CDR | semver `TODO` |
| **CI-09** | **RAG index + grounding/citation config** (DM-02) | model-config / dataset | AI/ML Lead (STK-08) | Product @ CDR | semver `TODO` |
| **CI-10** | **Evaluation set** (groundedness · task-success · injection · action-safety) | dataset | AI/ML Lead (STK-08) | Product @ CDR | semver `TODO` |
| **CI-11** | `Threat_Model.md` (THR-*) + DPIA record | doc | Security (STK-04) / DPO (STK-05) | Functional → maintained | `TODO` |
| **CI-12** | Token-store / secrets-vault config (DM-04, REQ-SEC-04) | sw build / config | Security (STK-04) | Product @ CDR | semver `TODO` |
| **CI-13** | This `Change_Config_Mgmt.md` plan | doc | Configuration Manager | n/a (governance) | v1.0 |

> *Why so many model-config CIs?* In a software+LLM system the **prompts, model routing, guardrails, RAG config, and eval set are exactly the artifacts whose silent drift causes a defect or an audit finding** (skill's CI test). Putting them under `CI-NN` control is the direct mitigation for **RSK-07** (model/prompt update silently regresses safety/quality).

## B.3 Baseline Management (CM function 2)

Aria reuses the three canonical baselines (Conventions §3); a baselined artifact's status string is exactly `Baseline (<GATE>-approved YYYY-MM-DD)`. Changes only via a `CR-NN`.

| Baseline | Established at | Contains | Current status |
|---|---|---|---|
| **Functional / Requirements** | **SRR** | `Concept.md` (CI-02), `SysRS.md` (CI-01) — REQ-*, MOE/MOP/TPM set; `Threat_Model.md`/DPIA (CI-11) maintained alongside | `Draft` — SysRS pending peer-review walkthrough + MCR conditions (SysRS §16). On sign-off → `Baseline (SRR-approved <date>)`. |
| **Allocated** | **PDR** | `Architecture_Description.md` (CI-03), `ICD.md` draft (CI-04) — 8 blocks + requirement-to-block allocation + ICD-01…06 draft | `TODO` — owed by Phase 04 (PDR). |
| **Product** | **CDR** | **Frozen ICDs** (CI-04), detailed design, build/config recipe (CI-05), and the agent CIs (CI-06…CI-10, CI-12) | `TODO` — owed by Phase 06 (CDR). ICDs **freeze at CDR**. |

> Aria's Formal overlay means CI-06…CI-10 and CI-12 (agent behaviour, guardrails, eval set, token store) roll into the **Product baseline at CDR** and thereafter move **only** through a CR — this is what stops the write-action gates and trust boundaries from regressing between sprints (Concept §4).

## B.4 Configuration Status Accounting (CM function 3)

The **CM ledger** answers "which version of every CI is current, and what changed since SRR?" Maintained at `Phase_09_Change_Config/status-accounting.md`.

Per-CI columns: **CI · current version · controlling baseline · open CRs · closed CRs · status (`Draft`/`In Review`/`Baseline (...)`/`Superseded`)**. Example rows after `CR-01`:

| CI | Version | Baseline | Open CRs | Closed CRs | Status |
|---|---|---|---|---|---|
| CI-01 SysRS | v1.1 | Functional @ SRR | — | CR-01 | Baseline (SRR-approved `TODO`) |
| CI-04 ICD | next-MINOR | Allocated @ PDR | — | CR-01 | `TODO` (pre-PDR) |
| CI-06 Agent prompts | semver MINOR | Product @ CDR | — | CR-01 | `TODO` (pre-CDR) |
| CI-08 Guardrails | unchanged-this-CR | Product @ CDR | — | CR-01 | `TODO` |

- **Cadence:** ledger updated at **each CCB** (Step 6 exit) and snapshotted **once per sprint**.
- **Owner:** Configuration Manager.
- **Report:** a per-sprint "baseline status" summary to STK-02/STK-04/STK-07/STK-08 — current versions, CRs opened/closed, any TPM-margin movement (TPM-01/-02/-03) flagged from IA question 2.

## B.5 Configuration Audits — FCA & PCA (CM function 4)

Both audits run at **PRR** (Conventions §3). Owner: Configuration Manager + QA; entry criterion: all in-flight CRs closed and re-baselined. Every discrepancy becomes a new `CR-NN`.

- **FCA (Functional Configuration Audit) — *did we build it to spec?*** Verifies Aria's *achieved* performance meets the functional baseline: **every `REQ-*` has closed V&V evidence** (the SysRS §11 seed matured into Phase-07 `TC-VER-*` / Phase-08 `TC-VAL-*`), and the trust-critical measures are met — **MOP-05 = 0** unconfirmed writes (REQ-F-09/REQ-SAF-01), **MOP-06 = 100%** cross-user/out-of-policy blocked (REQ-SEC-03/REQ-F-08), **TPM-01 ≥95%** grounding (REQ-P-05), **TPM-03 ≥99%** injection defense (REQ-SEC-07), and the independent isolation+injection pen-test shows **zero S1/S2 open** (REQ-SEC-08, a PRR exit per Conventions §3).
- **PCA (Physical Configuration Audit) — *does the as-built match the as-documented?*** Verifies the as-deployed product matches the product-baseline docs: the deployed **build recipe (CI-05)** matches the tagged baseline; the running **model + tier-routing (CI-07)**, **prompt set (CI-06)**, **guardrail ruleset (CI-08)**, and **eval set (CI-10)** versions match what the Product baseline records; the live **ICDs (CI-04)** match the frozen-at-CDR versions; token-store config (CI-12) matches REQ-SEC-04. *An undocumented prompt or model-tier drift is a PCA finding* — the most likely Aria PCA failure mode (RSK-07), which is why CI-06…CI-10 are first-class CIs.

| Finding type | Goes to |
|---|---|
| A `REQ-*` lacks closed V&V evidence / a trust-measure misses target | **FCA** → new `CR-NN` |
| As-built prompt/model/guardrail/ICD ≠ as-documented baseline | **PCA** → new `CR-NN` |

## B.6 Tooling & repositories

Per Part A §A.7 — Jira (`ARIA-CR`) for CRs, Git + signed tags for all CIs (including prompt/guardrail/eval CIs), `ccb-minutes/` + `status-accounting.md` in-repo, the eval harness as the behavioural release gate, the secrets vault for CI-12. Regulator/audit-required immutable exports (eval results, audit logs per REQ-SEC-06) retained with the CR (retention ≤ REQ-O-05 policy, set at DPIA).

## B.7 Standards anchor

| Concern | Canonical citation (Conventions §9) |
|---|---|
| Configuration management | **ISO 10007:2017** (+ EIA-649 / **IEEE 828**) |
| SE lifecycle (CM & Information Mgmt processes) | **ISO/IEC/IEEE 15288:2023** |
| Impact-analysis risk scoring | **ISO 31000:2018** |
| Quality / audit basis (FCA/PCA) | **ISO 9001:2015** |
| Privacy re-assessment trigger (class-A IA Q4) | **GDPR** Arts. 25, 30, 35 |
| Security posture (class-A IA Q4) | **ISO/IEC 27001:2022** · **NIST SP 800-53 Rev. 5** |

Aria carries **no** DO-178C / ISO 26262 / IEC 62304 obligation (not safety-of-life, per README) — so the domain change/config clauses of those standards do **not** apply; "safety" re-analysis here is **AI-action-safety** via the `Hazard_Log.md` (HAZ-01/HAZ-02).

---

## CR Log (ledger — `CR_Log` view)

| CR | Title | Class | Sev | IA | CCB decision | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| **CR-01** | Add `jira.deleteIssue` destructive tool | A | S1-driver | IA-01 | Approved (w/ conditions) | CI-01, CI-04, CI-06, CI-08, CI-05 | SysRS v1.1; ICD next-MINOR; recipe MINOR | Closed |

*(Subsequent CRs append here; IDs are stable for project life — never renumbered, retired with a `(deprecated)` note.)*

---

## Exit-gate checklist — "Baselines current" (Conventions §1)

- [x] **CI register** established — CI-01…CI-13 with item, type, owner, controlling baseline, version scheme (post-PDR/CDR versions marked `TODO`/owed).
- [x] **Three baselines** identified (Functional @ SRR · Allocated @ PDR · Product @ CDR) with current version + `Baseline (...)` status (allocated/product owed by Phase 04/06).
- [x] **Change classes A/B/C/D** calibrated to Aria, each mapped to `S1–S4`; Aria-specific class-A triggers (action-safety / isolation / injection) hard-wired.
- [x] **6-step process** documented **including** the Initial-Review feasibility gate (Step 2).
- [x] **5-question impact-analysis** template included; risk scored per Conventions §5.3; TPM-01/-02/-03 erosion check built in.
- [x] **CCB** composition + quorum (Security **+ DPO + AI Lead** mandatory for class A) + cadence (per-sprint, from Phase-01 governance) captured; minutes location set.
- [x] **Re-baselining rules** defined as breaking/feature/fix semver, explicitly **not** keyed to A/B/C/D; version-bump is a CCB exit criterion.
- [x] **Status-accounting ledger** defined with cadence (per-CCB + per-sprint) + owner (CM); answers "which version is current?".
- [x] **FCA + PCA** planned at PRR with owner, entry criteria, discrepancy→CR path; trust-measure pass criteria (MOP-05/-06, TPM-01/-03) named.
- [x] **CR/CM tool** selected (Jira `ARIA-CR` + Git); first CR (`CR-01`) filed and walked end-to-end.
- [x] Both plans carry Conventions §6 frontmatter; worked example walked through all six steps.
- [ ] **Open TODOs:** PDR/CDR baseline versions (Phase 04/06); CCB day-of-sprint (Phase 00 SEMP); retention period (DPIA, REQ-O-05); TC-VER/TC-VAL IDs (Phase 07/08).

**Recommendation:** governance is in place — a baselined Aria can now evolve without losing coherence. Next phase: `se-phase-10-operations` for SLOs (`SLO-*`), AI-action observability, the eval-regression gate, and drift monitoring that this phase's changes feed.
