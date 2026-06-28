---
name: se-phase-09-change-config
description: Runs Phase 09 (Change & Configuration Management) of the AI-powered systems-engineering workflow. Sets up the governance that lets a baselined system evolve without losing coherence: the canonical 6-step change-control process (Submit → Initial-Review feasibility gate → Impact Analysis → CCB → Implement & V&V → Document/Notify), change classes A/B/C/D with calibrated SLAs, the 5-question impact analysis, CCB composition and cadence, and re-baselining rules. It also stands up configuration-management discipline per ISO 10007 / IEEE 828 — the four CM functions (configuration identification of CI-NN, baseline management at SRR/PDR/CDR, status accounting, and FCA/PCA configuration audits at PRR). Produces Change_Management_Plan.md, Configuration_Management_Plan.md, and a CR log. Use this phase when the user wants to set up change control, define a CCB (Change Control Board), draft a CR (change request) process, run impact analysis on a proposed change, write a configuration-management plan, identify configuration items, manage baselines, do configuration status accounting, plan FCA/PCA audits, version-bump a SysRS / ICD / architecture document, or do "phase 9 change and configuration management". Triggers on phrasings like "change management plan", "configuration management plan", "CCB", "change request / CR process", "impact analysis", "baseline management", "configuration item", "status accounting", "FCA PCA audit", "re-baseline", "version bump the SysRS / ICD".
---

# Phase 09 — Change & Configuration Management

<what-to-do>

This phase builds the governance that lets a baselined system evolve without losing coherence: a controlled **change** process (CR → impact analysis → CCB → re-baseline) and the **configuration-management** discipline that keeps every baseline identified, accounted for, and audited (ISO 10007 / IEEE 828). Its exit gate is **Baselines current** — every approved change has a CR with impact analysis, and every baseline is identified, status-accounted, and auditable. This skill conforms to [`../../05_Conventions.md`](../../05_Conventions.md); it cites that file for every shared convention (IDs, gates, T/I/A/D, severity, baselines, citations) rather than redefining them. The continuous-testing / shift-left half of the source material is owned by **Phase 10** — this phase cross-references it and stays on governance + CM.

## Inputs (from prior phases)

Read these first; if one is absent, note `TODO: <owed by phase NN>` and proceed with a placeholder rather than inventing content.

- **Phase 00 `SEMP.md`** — governance/authority, CCB chartering, document-control rules. *Fallback:* ask who holds change authority.
- **Phase 01 `Project_Development_Plan.md`** §Governance — gate dates and review cadence that set CCB cadence. *Fallback:* ask the project's review rhythm.
- **Phase 02 `SysRS.md` + `Traceability_Matrix.md`** — the requirements baseline (`REQ-*`, `MOE/MOP/TPM`) and the trace links impact analysis walks. *Fallback:* CM still works; flag that impact analysis will be shallow until trace links exist.
- **Phase 04 `Architecture_Description.md` + `ICD.md`** — the allocated baseline (blocks, `ICD-*`) that gets re-versioned. *Fallback:* note allocated baseline TBD.
- **Phase 06 `Integration_Plan.md`** — the product baseline ingredients (frozen ICDs at CDR, build/config recipe). *Fallback:* note product baseline TBD.
- **Phase 07/08 `Verification_Matrix.md` / `Test_Plan.md`** — the regression/V&V evidence a change must regenerate (`TC-VER-*`, `TC-VAL-*`). *Fallback:* note re-test scope TBD.
- **Cross-cutting registers** — `Risk_Opportunity_Register.md` (impact-analysis risk), `Hazard_Log.md`, `Threat_Model.md`, `TPM_Tracker.md`, `QA_Plan.md`. *Fallback:* create stubs as you go.

## Step-by-step

Interview the user **one topic at a time** — never dump every question at once. Convert each answer into the deliverables, reuse prior-phase facts, and never re-ask what a prior artifact already states. Use **AskUserQuestion** for finite choices. Mark unknowns `TODO: <owed>`; never invent numbers, SLAs, or board members.

1. **Read prior artifacts & confirm output paths.** Pull governance from the SEMP and Project Development Plan; pull the baselined docs (SysRS, ICD, architecture, build recipe) that will be version-controlled. Default outputs: `<project>/Phase_09_Change_Config/Change_Management_Plan.md`, `Configuration_Management_Plan.md`, and `CR_Log.md`. State assumptions you carry forward.

2. **Configuration identification (CM function 1).** *Topic: "What are we putting under configuration control?"* Ask the user to list the **configuration items** (`CI-NN`, per [`Conventions §2.3`](../../05_Conventions.md)) — the controlled units (documents, software builds, hardware assemblies, models, datasets) with an owner and a controlling baseline each. Establish the **naming + version scheme**: doc version `vMAJOR.MINOR` for documents; **semver `MAJOR.MINOR.PATCH`** for the build/config recipe. Record the CR ID series (`CR-NN`).

3. **Baseline management (CM function 2).** *Topic: "Which baselines exist and what's in each?"* Reuse the three baselines from [`Conventions §3`](../../05_Conventions.md) — **Functional/Requirements @ SRR**, **Allocated @ PDR**, **Product @ CDR** — and confirm which gate established each and its current version/status. A baselined artifact's status string is exactly `Baseline (<GATE>-approved YYYY-MM-DD)` ([`Conventions §6`](../../05_Conventions.md)). Record which CIs roll up into each baseline.

4. **Change classes.** *Topic: "How do we triage a change by severity?"* Use the 4-class taxonomy and **calibrate thresholds to this domain** with the user. SLAs below are defaults — confirm or override them; do not copy them blindly.

| Class | Name | Typical examples | CCB review | Default SLA (override per domain) |
|---|---|---|---|---|
| **A** | Critical | Safety REQ affected, regulatory non-compliance, security incident response, breaking external interface. | Full CCB + Safety + Security + Compliance. | Decision within 5 business days. |
| **B** | Major | New feature, new external interface, vendor swap, architecture refactor. | Standing CCB. | Decision within 10 business days. |
| **C** | Minor | Isolated bug fix, copy/UI text, dashboard tweak, non-breaking API addition. | Engineering-lead approval; CCB notified, batched. | CR-batched weekly. |
| **D** | Emergency | Production-outage hotfix, urgent security patch. | Async CCB approval; **post-hoc minutes within 5 business days**. | Act within hours; CR filed retroactively. |

> **Map change priority to severity, don't invent a scale.** Use the `S1–S4` severity and High/Med/Low/N-A priority from [`Conventions §5`](../../05_Conventions.md) (S1 ≈ class A driver). The class label (A/B/C/D) is a *governance routing* label, **not** a version key.

5. **The canonical 6-step change-control process.** *Topic: "Walk a change from request to closure."* Document these six steps (ISO 10007 / KB topic 18) — note step 2, the **Initial-Review feasibility gate**, is the cheap "is this even possible — yes/no?" screen that kills non-starters before any analyst time is spent:
   1. **Change Request Submission** — requester opens a `CR-NN` in the CR tool (required fields: title, problem, proposed change, requester, priority hint).
   2. **Initial Review (feasibility gate)** — change owner screens for gross feasibility (possible? in scope? not a duplicate?). Infeasible/duplicate CRs are returned/closed here — *no impact analysis spent.*
   3. **Impact Analysis** — analyst answers the 5 questions (Step 6) and produces `IA-NN`; assigns class A/B/C/D.
   4. **Approval (CCB)** — the board makes the **final** Approve / Reject / Defer / Rework decision; logged in CCB minutes. (No lone approver — the CCB decides.)
   5. **Implementation & V&V** — implementer codes the change, updates every affected CI (SysRS / ICD / model / tests), and regenerates regression evidence linking `TC-VER-*` / `TC-VAL-*`.
   6. **Documentation & Communication** — re-baseline the affected CIs, record the change in status accounting, and notify stakeholders.

6. **Impact Analysis — the 5 questions.** *Topic: "What does this change touch?"* Lock the required IA shape (KB topic 18; risk scored per [`Conventions §5.3`](../../05_Conventions.md) and ISO 31000):
   1. **Scope** — which CIs, components, `REQ-*`, `ICD-*`, baselines are affected (walk the Phase-02 trace links)?
   2. **Risk & dependencies** — regression risks (score `RSK-NN` Likelihood×Impact), coupled CRs, TPM-margin erosion.
   3. **Cost & schedule** — delta in person-effort and weeks; re-test scope.
   4. **Compliance & safety** — does it trigger re-certification or a hazard re-analysis (consult `Hazard_Log.md`, `Threat_Model.md`)?
   5. **Stakeholders** — who must approve vs. be notified (Engineering / Safety / Security / Compliance / Legal / Ops / Customers)?

7. **CCB composition & cadence.** *Topic: "Who sits on the board and how often?"* Capture standing members (Engineering lead, SE lead, QA, Security, Compliance, Ops, Product, optional customer/partner reps), **quorum rules** (e.g. Security + Safety mandatory for class A), **cadence** (tie to the Phase-01 governance rhythm — don't invent dates), and where minutes live (`.../ccb-minutes/YYYY-MM-DD.md`). Use AskUserQuestion if the user is unsure of board roles.

8. **Re-baselining rules (semver, fixed by ISO 10007).** *Topic: "How do versions move on a change?"* Bump versions by the **nature of the change**, never by change class:
   - **Doc `vMAJOR.MINOR`:** MINOR for tracked edits/additions; MAJOR at each re-baseline (breaking removal/restructure).
   - **Build/config recipe semver `MAJOR.MINOR.PATCH`** ([`Conventions §6`](../../05_Conventions.md)): **MAJOR = breaking**, **MINOR = backward-compatible feature**, **PATCH = fix** — *MAJOR/MINOR/PATCH map to breaking/feature/fix, not to class A/B/C/D.* A class-B feature is usually a MINOR bump; a class-A breaking interface change is a MAJOR bump — but it is the *breaking-ness*, not the class, that decides.

9. **Status accounting (CM function 3).** *Topic: "How do we report what state every CI is in?"* Define the **CM status ledger**: for each CI, its current version, controlling baseline, open/closed CRs against it, and approval status. This is the report answering "which SysRS is current, and what changed since SRR?" Define the cadence and owner of the status-accounting report.

10. **Configuration audits — FCA & PCA (CM function 4).** *Topic: "How do we prove the product matches its baselines?"* Plan the two audits, both run at **PRR** ([`Conventions §3`](../../05_Conventions.md)):
    - **FCA (Functional Configuration Audit)** — verifies the CI's *achieved* performance meets the requirements/functional baseline (V&V evidence is complete; every `REQ-*` is verified). *Did we build it to spec?*
    - **PCA (Physical Configuration Audit)** — verifies the *as-built* product matches its product-baseline documentation (build recipe, ICDs, BOM, design docs). *Does the as-built match the as-documented?*
    Record audit owner, entry criteria, and the discrepancy-handling path (each finding becomes a `CR-NN`).

11. **Tooling.** *Topic: "Where do CRs and configs live?"* Capture the **CR/CM tool** (per KB topic 18 "no single tool fits all" — Jira/GitHub/GitLab for software; ServiceNow/BMC for enterprise IT; IBM EWM/Windchill/Helix ALM/Polarion for regulated complex systems; DOORS for requirements traceability). Capture version control (Git + tags) and where regulator-required immutable exports live. Pick now — "we'll decide later" means no record.

12. **Worked example.** Walk one realistic mid-life CR end-to-end (e.g. chipset EOL, dependency CVE, new regulation) through the 6 steps to make both plans concrete. Do **not** copy any numbers from the worked example blindly — calibrate to this project.

13. **Write the deliverables** (`Change_Management_Plan.md`, `Configuration_Management_Plan.md`, `CR_Log.md`) using the shapes in *Deliverables*. Apply Conventions frontmatter ([`§6`](../../05_Conventions.md)).

14. **Check the exit gate** (see *Exit-gate checklist*). If anything is `TODO`, name who owes it and by when. Recommend next: `se-phase-10-operations` for SLOs, observability, continuous regression, and the shift-left/continuous-validation pipeline that this phase's changes feed.

## Decision points

- **Is this a change at all, or routine work?** A change is anything that alters a **baselined** CI. Edits to never-baselined drafts are not CRs. *Decision aid:* if it touches a `Baseline (...)`-status artifact, it needs a CR.
- **Which change class?** Use the calibration cheatsheet (Supporting info). *Aid:* safety/compliance/breaking-interface → A; net-new capability → B; isolated/cosmetic → C; live emergency → D. When torn between two, take the higher class.
- **What version bump?** Decide by **breaking / feature / fix**, never by class letter. *Aid:* "Would an existing consumer break?" → MAJOR. "New capability, old behaviour intact?" → MINOR. "Corrects without changing behaviour?" → PATCH.
- **Full CCB or async?** Only class D may use async approval, and only with post-hoc minutes within 5 business days. *Aid:* if it can wait for the next standing CCB, it is not D.
- **Which CIs go under control?** A CI is anything whose change must be tracked and audited. *Aid:* if losing track of its version would cause a defect, integration break, or audit finding, make it a CI.
- **FCA vs PCA — which finding goes where?** Functional shortfall (doesn't meet a REQ) → FCA. As-built ≠ as-documented (wrong part, stale ICD) → PCA.

## Rules

- **Conform to Conventions for everything shared.** IDs, gates, T/I/A/D, severity, baselines, status strings, and standard citations come from [`../../05_Conventions.md`](../../05_Conventions.md) — cite, never redefine.
- **One topic at a time.** Ask this phase's questions conversationally; convert answers into the plans; reuse prior-phase facts; never re-ask.
- **No silent baseline drift.** Every approved change bumps the version on every affected CI and is recorded in status accounting; make the version-bump a CCB exit criterion.
- **Semver is breaking/feature/fix — not keyed to A/B/C/D.** Reject any rule that says "class B ⇒ MINOR" as a *definition*; the change's nature decides.
- **D-class is a real path, not a CCB bypass.** Async approval + post-hoc minutes within **5 business days** (aligned to the worked example — *not* 48 h).
- **Initial-Review before Impact Analysis.** Screen feasibility (step 2) before spending analyst effort (step 3).
- **Continuous testing lives in Phase 10.** Reference it; do not re-author the shift-left/CI-CD pipeline here.
- **Don't copy the worked example's numbers blindly.** Calibrate SLAs, CI lists, and board membership to the actual project.
- **Cross-reference, don't re-define.** For risk scoring → Risk thread; for gates/baselines → Conventions; for V&V evidence → Phases 07/08.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

Blank versions live in [`../../templates/`](../../templates/). Each deliverable carries the [`Conventions §6`](../../05_Conventions.md) frontmatter.

### 1. `Change_Management_Plan.md` (governance loop)

```markdown
1. Purpose & Scope
2. Change Classes — A/B/C/D, domain-calibrated thresholds + SLAs (priority mapped to S1–S4)
3. The 6-Step Change-Control Process — Submit → Initial-Review (feasibility gate) → Impact Analysis → CCB → Implement & V&V → Document/Notify
4. Impact Analysis — the 5 questions + IA-NN template (risk scored per Conventions §5.3 / ISO 31000)
5. CCB — composition, quorum (Security+Safety for A), cadence (from Phase-01 governance), minutes location
6. Re-baselining rules — doc vMAJOR.MINOR + build semver MAJOR.MINOR.PATCH (breaking/feature/fix)
7. Tooling — CR tool, VCS, regulator exports
8. Templates — CR / IA / CCB minutes
9. Worked example — one CR end-to-end
10. Cross-ref — continuous validation → Phase 10
```

### 2. `Configuration_Management_Plan.md` (the 4 CM functions — ISO 10007 / IEEE 828)

```markdown
1. Purpose & Scope — CM policy, authority (from SEMP)
2. Configuration Identification — CI-NN register (item · owner · type · controlling baseline · version scheme)
3. Baseline Management — the 3 baselines (Functional@SRR · Allocated@PDR · Product@CDR), current version + status each
4. Configuration Change Control — pointer to Change_Management_Plan.md (don't duplicate the 6 steps)
5. Configuration Status Accounting — the CM ledger: per-CI version, baseline, open/closed CRs, status; report cadence + owner
6. Configuration Audits — FCA + PCA at PRR (owner, entry criteria, discrepancy → CR path)
7. Tooling & repositories
8. Standards anchor — ISO 10007:2017, IEEE 828, EIA-649, 15288 Configuration/Information Mgmt
```

CI register row:

```markdown
| CI-NN | <item name> | <doc / sw build / hw asm / model / dataset> | <owner> | <Functional/Allocated/Product> | <vX.Y or semver> |
```

### 3. `CR_Log.md` (the change-request ledger)

```markdown
| CR-NN | Title | Class (A/B/C/D) | Sev (S1–S4) | IA link | CCB decision | Affected CIs | Re-baselined to | Status |
```

### Templates embedded in the plan

**CR**: id, submitter, date, priority hint, problem, proposed change (which CI/layer), acceptance criteria, initial impact, linked `REQ-*`/`ICD-*`/CIs/CRs.
**IA-NN**: the 5 questions + recommendation (class, decision, conditions).
**CCB minutes**: chair, attendees, quorum met (y/n), CRs reviewed table (CR · class · IA · decision · conditions), action items, next meeting.

## AI prompt pack

**Elicitation (configuration identification):**
> "Help me build the CI register for this project. From the SysRS, ICD, architecture, and build recipe, propose the configuration items as `CI-NN` rows — name, type (doc / sw build / hw assembly / model / dataset), likely owner, and which baseline (Functional@SRR / Allocated@PDR / Product@CDR) controls each. Flag anything ambiguous as `TODO` and ask me before assuming."

**Elicitation (change classes):**
> "Interview me one question at a time to calibrate the A/B/C/D change-class thresholds and SLAs for **this** domain. Map each class to an `S1–S4` severity. Don't propose final SLAs until you've asked about our regulatory exposure and release cadence."

**Generation (draft the CM plan):**
> "Draft `Configuration_Management_Plan.md` covering the four ISO 10007 functions — identification (CI-NN register), baseline management (Functional@SRR, Allocated@PDR, Product@CDR), status accounting (the CM ledger), and FCA/PCA audits at PRR. Use the Conventions frontmatter. Mark every unknown as `TODO: <owed by>`; invent no versions or dates."

**Generation (run an impact analysis):**
> "Run the 5-question impact analysis for this CR. Walk the Phase-02 traceability links to list affected `CI-NN`/`REQ-*`/`ICD-*`/baselines, score regression risk as `RSK-NN` Likelihood×Impact, identify re-test scope (`TC-VER-*`/`TC-VAL-*`), check compliance/hazard re-analysis, and recommend a class + version bump (breaking/feature/fix)."

**Critique / red-team:**
> "Red-team this change-control plan. Where can baseline drift slip through? Is `D-class` an escape hatch around the CCB? Is semver wrongly keyed to change class anywhere? Is the Initial-Review feasibility gate actually gating, or rubber-stamping? Are FCA and PCA confused or missing their PRR tie? List every gap as a finding with a fix."

## Research & specialised-agent triggers

- **Web research — standards & tooling:** look up ISO 10007:2017 and IEEE 828 current clause structure; EIA-649 baseline definitions; the FCA/PCA criteria in MIL-STD-973 / DI-CMAN data-item descriptions or the INCOSE Handbook v5 CM section; and current CM-tool capability matrices (DOORS Next, Polarion, Windchill, EWM, GitLab) when selecting a tool. Use **Context7 MCP** for any tool/CLI/SDK config questions (e.g. GitLab CI versioning, Jira automation).
- **Web research — domain regulation:** for the compliance/safety IA question, look up the change-control and configuration clauses of the governing domain standard (DO-178C §SCM, ISO 26262 Part 8 config/change mgmt, IEC 62304 §8 software config/problem resolution, FDA 21 CFR 820 / Part 11) so re-certification triggers are accurate.
- **Specialised agent — impact-analysis agent:** spawn one to crawl the traceability matrix and compute the full blast radius of a proposed change (forward + backward) and the exact re-test set; valuable on large or safety-critical systems where manual link-walking misses couplings.
- **Specialised agent — config-audit (FCA/PCA) agent:** at PRR, spawn an agent to diff the as-built manifest against the product baseline (build recipe, ICDs, BOM) and verify every `REQ-*` has closed V&V evidence; output discrepancies as draft `CR-NN`s.

## Cross-cutting hooks

This phase is the **home** of the **Configuration Management** thread and the change-governance engine the other threads route through ([`../../01_Workflow_Overview.md §1`](../../01_Workflow_Overview.md)).

- **Configuration Mgmt** *(owns)* — identification, baselines, status accounting, audits. → [`../../cross-cutting/Configuration_Management.md`](../../cross-cutting/Configuration_Management.md).
- **Risk & Opportunity** *(consumes)* — impact analysis scores `RSK-NN` per ISO 31000; new risks/opportunities feed the living register at every CCB. → [`../../cross-cutting/Risk_and_Opportunity_Management.md`](../../cross-cutting/Risk_and_Opportunity_Management.md).
- **Safety/RAMS** *(consumes/feeds)* — class-A changes trigger hazard re-analysis; the `Hazard_Log.md` is an IA input and Safety is mandatory CCB quorum for A. → [`../../cross-cutting/Safety_RAMS_Engineering.md`](../../cross-cutting/Safety_RAMS_Engineering.md).
- **Security** *(consumes/feeds)* — CVE/incident changes route here; Security is mandatory A-class quorum; `Threat_Model.md` is an IA input. → [`../../cross-cutting/Security_Engineering.md`](../../cross-cutting/Security_Engineering.md).
- **Measurement (MOE/MOP/TPM)** *(consumes)* — IA checks TPM-margin erosion; re-baselining updates the `TPM_Tracker.md`. → [`../../cross-cutting/Measurement_MOE_MOP_TPM.md`](../../cross-cutting/Measurement_MOE_MOP_TPM.md).
- **Cost/Schedule** *(feeds)* — IA cost/schedule delta feeds EVM/re-planning. → [`../../cross-cutting/Cost_Schedule_EVM.md`](../../cross-cutting/Cost_Schedule_EVM.md).
- **Quality** *(feeds)* — FCA/PCA are quality gates; CR-handling conformance is auditable evidence (ISO 9001). → [`../../cross-cutting/Quality_Assurance.md`](../../cross-cutting/Quality_Assurance.md).
- **HSI** *(consumes)* — usability/training-affecting changes flag HSI stakeholders in the IA. → [`../../cross-cutting/Human_Systems_Integration.md`](../../cross-cutting/Human_Systems_Integration.md).

## Standards anchor

This phase realises the ISO/IEC/IEEE 15288:2023 **Configuration Management** and **Information Management** processes (Technical-Management group; see [`../../01_Workflow_Overview.md §3`](../../01_Workflow_Overview.md)). It invokes the canonical citations from [`Conventions §9`](../../05_Conventions.md):

| Concern | Canonical citation |
|---|---|
| Configuration management | **ISO 10007:2017** (+ EIA-649 / **IEEE 828**) |
| SE lifecycle (CM & Information Mgmt processes) | **ISO/IEC/IEEE 15288:2023** |
| Impact-analysis risk scoring | **ISO 31000:2018** |
| Quality / audit basis (FCA/PCA) | **ISO 9001:2015** |
| Domain change/config clauses (as applicable) | DO-178C §SCM · ISO 26262 Part 8 · IEC 62304 §8 |

## Exit-gate checklist

Gate: **Baselines current** ([`Conventions §1`](../../05_Conventions.md)).

- [ ] CI register established — every controlled item has a `CI-NN`, owner, type, controlling baseline, version scheme.
- [ ] Three baselines (Functional@SRR · Allocated@PDR · Product@CDR) identified with current version + `Baseline (...)` status.
- [ ] Change classes A/B/C/D calibrated to this domain, each mapped to `S1–S4`.
- [ ] The 6-step process documented **including** the Initial-Review feasibility gate.
- [ ] 5-question impact-analysis template included; risk scored per Conventions §5.3.
- [ ] CCB composition + quorum (Security+Safety for A) + cadence (from Phase-01 governance) captured.
- [ ] Re-baselining rules defined as **breaking/feature/fix semver**, explicitly *not* keyed to A/B/C/D.
- [ ] Status-accounting ledger defined with cadence + owner; answers "which version is current?".
- [ ] FCA + PCA planned at PRR with owner, entry criteria, discrepancy→CR path.
- [ ] CR/CM tool selected; first CR can be filed today.
- [ ] Both plans carry Conventions frontmatter; worked example walked end-to-end.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| No one knows which SysRS/ICD is current. | Version bumps skipped; no status accounting. | Make the version-bump a CCB exit criterion; run the status-accounting ledger. |
| Semver bumped by change class (B⇒MINOR as a rule). | Class confused with version semantics. | Bump by breaking/feature/fix per Conventions §6; class is a routing label only. |
| D-class abused to skip the CCB. | "Emergency" becomes the default path. | Async approval + post-hoc minutes within 5 business days; audit D-class CRs quarterly. |
| Analyst time wasted on non-starter CRs. | No Initial-Review feasibility gate. | Insert step 2 — screen feasibility/duplicates before impact analysis. |
| Compliance/Safety absent from an A-class decision. | Quorum rules too loose. | Hard-wire Security + Safety + Compliance into A-class quorum. |
| As-built doesn't match the docs at delivery. | No PCA. | Plan FCA + PCA at PRR; route every discrepancy to a `CR-NN`. |
| Impact analysis misses coupled changes. | Trace links not walked. | Drive IA scope from the Phase-02 traceability matrix (forward + backward). |
| Change-control and CM duplicated/contradictory across two plans. | Both plans restate the 6 steps. | CM plan *points to* the Change Management Plan for change control; defines only the 4 CM functions. |

## References

- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (`CI-NN`, `CR-NN`), gates, baselines, severity, status strings, semver rule, standard citations. **The contract.**
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the 12-stage spine; 15288 Configuration/Information Management mapping; the 8 threads.
- KB: [`Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md`](../../../Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md) — 6-phase change control, Initial-Review gate, CCB, CMS, impact analysis (continuous-testing half → Phase 10).
- KB: [`Systems-Engineering-KB/topics/07-requirements-management/fundamentals.md`](../../../Systems-Engineering-KB/topics/07-requirements-management/fundamentals.md) — 5-phase requirement-level change process, traceability types, baseline management.
- [`../../worked_example/Phase_09_Change_Config/`](../../worked_example/Phase_09_Change_Config/) — fully worked Change & Configuration Management plans (EV Charging Station Network).
- Related phases: `se-phase-02-requirements` (baseline + trace links), `se-phase-04-architecture` (ICD/allocated baseline), `se-phase-06-integration` (product baseline), `se-phase-07/08` (V&V evidence for FCA), `se-phase-10-operations` (continuous validation the change feeds).

</supporting-info>
