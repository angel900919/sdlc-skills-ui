---
Document: Gate-Review Checklists — the single home for gate criteria
Document ID: CHK-GATES-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (review gates); INCOSE SE Handbook v5 (2023); NASA/SP-2016-6105 Rev 2
Status: Baseline
Owner: Lead Systems Engineer
---

# Gate-Review Checklists

> **This is the single home for gate criteria.** Each stage `SKILL.md` carries its *own* exit-gate checklist for the work it produces; this file is the **review-board view** — entry criteria, the consolidated exit bar, the cross-cutting thread questions asked at every gate, and the decision outcome. When a stage skill and this file describe the same gate, they agree by construction; both defer to [`../05_Conventions.md`](../05_Conventions.md) for IDs, gates, T/I/A/D, severity, baselines, status strings, and citations — **the contract wins** over anything restated anywhere.

This file conforms to:
- **Gate ladder & baselines** — [`05_Conventions.md` §3](../05_Conventions.md).
- **Identifier grammar** — [`05_Conventions.md` §2](../05_Conventions.md).
- **T/I/A/D methods** — [`05_Conventions.md` §4](../05_Conventions.md).
- **Severity `S1`–`S4`** — [`05_Conventions.md` §5.1](../05_Conventions.md); **risk scoring** §5.3.
- **The gate decision is real, not a rubber stamp** — [`01_Workflow_Overview.md` §6](../01_Workflow_Overview.md).

---

## How to run any gate

A gate is a **decision point**, not a formality. Run it in four passes:

1. **Entry pass** — confirm the gate's *entry criteria* are met (the inputs exist, the prior baseline is current, the prior gate's actions are closed). If entry fails, the gate is **not convened** — fix inputs first.
2. **Exit pass** — confirm the gate's *exit criteria* (the consolidated bar below; the producing-stage `SKILL.md` exit-gate checklist is the detailed source).
3. **Cross-cutting pass** — ask the **8 thread questions** (one block, every gate; see *Cross-cutting thread review — asked at every gate*). The threads are never "done"; a thread can recommend **Hold**.
4. **Decision pass** — record one of the **5 decision outcomes** with named actions and owners. A blank "pass" is forbidden.

```
ATP ─ MCR ─ SRR ─ PDR ─ CDR ─ TRR ─ PRR ─ ORR ─ GA ┄┄(ops loop: change ⇄ validate)┄┄ DRR
00    01    02    04    06    07    08    10   10                                       11
```

### Baselines established at gates (frozen thereafter; change only via a `CR-<nn>`, Stage 09)

| Baseline | Established at | Contains |
|---|---|---|
| Functional / Requirements baseline | **SRR** | StRS, SysRS, MOE/MOP set |
| Allocated baseline | **PDR** | Architecture, requirement-to-block allocation, ICD **draft** |
| Product baseline | **CDR** | **Frozen ICDs**, detailed design, build/config recipe |

---

## The 5 decision outcomes

Every gate ends with exactly one verdict ([Overview §6](../01_Workflow_Overview.md)). Record it with the evidence and actions that drive it.

| Outcome | Meaning | Use it when… | What it produces |
|---|---|---|---|
| **Proceed** | Clean pass; advance to the next stage. | All exit criteria met; no open blocker; cross-cutting threads green. | Sign-off; next baseline established if this gate sets one. |
| **Proceed-with-actions** | Advance, but carry named, owned, dated actions. | Minor gaps that don't threaten the baseline; each gap is an owned `TODO:` with a due date. | Sign-off **conditional** on an action list (owner + date each); tracked to closure before the next gate. |
| **Hold** | Do **not** advance; pause and remediate, then re-convene. | A blocking gap (e.g. a critical open `RSK-*`, missing review evidence, a stale register, an unverifiable REQ). | A remediation plan with owners; gate re-runs when the blocker clears. No baseline is set. |
| **Re-baseline** | Reset a prior baseline because scope/requirements/architecture moved materially. | The current baseline no longer reflects reality; proceeding on it would compound error. | A `CR-<nn>` against the affected baseline (Stage 09), a version **major** bump, and re-entry at the appropriate earlier gate. |
| **Stop** | Cancel or suspend the project/option. | Feasibility, funding, safety, or business case is no longer viable. | A documented termination/suspension decision; capture lessons-learned (→ Quality/Knowledge thread, Phase 11). |

> **Mapping note.** *Proceed-with-actions* is the default for real projects (something is almost always owed). A clean *Proceed* requires the action list to be empty. *Hold* and *Re-baseline* differ in scope: Hold fixes a gap on the **current** baseline; Re-baseline **changes** the baseline.

---

## Cross-cutting thread review — asked at every gate

The **8 always-on threads** ([Overview §1](../01_Workflow_Overview.md)) are reviewed at **every** gate ATP→DRR. Each thread can recommend **Hold**. The per-gate specifics live in each thread file; this is the consolidated block to walk at every gate. The gate-specific sharpenings are folded into each gate's section below.

| # | Thread | The always-ask question | Thread file |
|---|---|---|---|
| 1 | **Risk & Opportunity** | Reviewed *this* cycle? Top-5 `RSK-*` by score + each owner's next action? Is Critical/High exposure trending **down** vs last gate? Any `OPP-*` window closing? Reserves still cover accepted residual risk? *(A stale register is a Hold.)* | [`Risk_and_Opportunity_Management.md`](../cross-cutting/Risk_and_Opportunity_Management.md) |
| 2 | **Configuration Mgmt** | Is the **CSA ledger** current — can we name the current version of every `CI-*` and what changed since last gate? Did any baseline change **outside a `CR-*`** (silent drift)? Is the gate's baseline set with the right `Baseline (<GATE>-approved <date>)` status? | [`Configuration_Management.md`](../cross-cutting/Configuration_Management.md) |
| 3 | **Safety / RAMS** | Are this stage's hazards in `Hazard_Log.md`, each `HAZ-*`→`REQ-SAF-*` traced? Reliability/availability budget within margin? Any open `S1` hazard? Is the Safety Case progressing toward PRR? | [`Safety_RAMS_Engineering.md`](../cross-cutting/Safety_RAMS_Engineering.md) |
| 4 | **Security** | Is the threat model current over all trust boundaries/ICD seams? Every Critical/High `THR-*` mapped to a selected, allocated control? Any critical open security risk? SBOM/CVE posture acceptable? | [`Security_Engineering.md`](../cross-cutting/Security_Engineering.md) |
| 5 | **Human-Systems Integration** | Does every HSI domain have a requirement (or a justified "N-A: tailored out")? Operator/maintainer needs covered? Any open HSI issue at critical severity? Human `MOE/MOP/TPM` on track? | [`Human_Systems_Integration.md`](../cross-cutting/Human_Systems_Integration.md) |
| 6 | **Measurement (MOE/MOP/TPM)** | Which TPMs are 🔴/🟡 right now? Recovery plan + owner per breach? Is any breach changing the gate outcome? Are MOE/MOP/TPM traced (MOE←need, MOP←REQ, TPM has threshold+target+margin)? | [`Measurement_MOE_MOP_TPM.md`](../cross-cutting/Measurement_MOE_MOP_TPM.md) |
| 7 | **Cost / Schedule / EVM** | What are CPI/SPI and EAC-vs-BAC (VAC)? Any control account below threshold with a funded corrective action? Did a `CR` re-plan the PMB without an approved cost impact? *(If yes → Hold — baseline integrity is broken.)* | [`Cost_Schedule_EVM.md`](../cross-cutting/Cost_Schedule_EVM.md) |
| 8 | **Quality** | Is there a **recorded QA sign-off**? Any artifact at `Baseline (...)` status **without** review evidence? Any `QA-*` finding overdue or silently closed without corrective action? Defect trends within bounds? *(QA audits the* process*; V&V tests the* product*.)* | [`Quality_Assurance.md`](../cross-cutting/Quality_Assurance.md) |

> **Stop-rule.** If **any** thread is stale, unreviewed, or carrying an un-owned critical item, the cross-cutting pass is a **Hold** regardless of how green the stage exit criteria look.

---

## ATP — Authority to Proceed *(Stage 00 · Agreement & Enablement)*

**Passes when** (Conventions §3): *Agreement signed; SEMP approved; funding & team authorised.*

**Entry criteria**
- [ ] An acquirer/supplier engagement exists with an identified scope to author against.
- [ ] An acquisition vehicle (contract / SOW / charter) is available to record.
- [ ] No prior gate (this is the first gate); the cross-cutting register *stubs* are about to be opened.

**Exit criteria** *(detailed source: [`se-phase-00-agreement/SKILL.md` Exit-gate checklist](../skills/se-phase-00-agreement/SKILL.md))*
- [ ] Acquirer and supplier identified, with authorised POCs and decision authority.
- [ ] Acquisition vehicle recorded (contract/SOW/charter) with name/number/date.
- [ ] Scope of agreement (in/out) and supplier deliverable list captured.
- [ ] Acceptance criteria written, each with a T/I/A/D accept method and an authority; unknown thresholds explicitly `TODO:`.
- [ ] Constraint seeds (budget/tech/standard/date) recorded for Phase 02 (→ candidate `REQ-C-*`/`REQ-D-*`).
- [ ] **SEMP approved** — organization/roles, tailoring (Min-Viable/Formal), gate & baseline plan, thread plan present.
- [ ] **Project Enablement Plan** — infrastructure/tools, QA/QMS, knowledge mgmt, lifecycle-model mgmt covered; org-sourced items flagged.
- [ ] **Funding and team authorised** (or a dated `TODO:` owned by a named party).

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** Agreement-level `RSK-*`/`OPP-*` captured; register stub opened.
- **CM:** CM authority assigned, CCB chartered, repository + `CI-*`/`CR-*` series chosen, document-control rules written.
- **Safety · Security · HSI:** If the domain is safety-critical / security-sensitive / human-intensive, the obligation and a named owner are in the SEMP so the thread starts **now**, with mandated standards captured as constraints.
- **Measurement:** Any acquirer-level success measures noted to seed MOEs in Phase 02.
- **Cost/Schedule:** Funding envelope and BAC ceiling recorded; the contract type's cost-risk understood.
- **Quality:** QMS named, QA assigned with **independence**, audit calendar + review cadence defined, `QA-*` series opened.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* Record the verdict; if funding/team is unconfirmed, record **Proceed-with-actions** with owned `TODO:`s — never a blank pass.

---

## MCR — Mission Concept Review → SRR-entry *(Stage 01 · Concept)*

**Passes when** (Conventions §3): *Mission, ConOps, feasibility accepted; lifecycle model chosen.*

**Entry criteria**
- [ ] ATP passed (or its actions closed); the agreement/SEMP/enablement set is current.
- [ ] Constraint seeds and acceptance criteria from Phase 00 are available to the concept work.

**Exit criteria** *(detailed source: [`se-phase-01-concept/SKILL.md` Exit-gate checklist](../skills/se-phase-01-concept/SKILL.md))*
- [ ] Mission statement reviewed and approved by stakeholders.
- [ ] ≥ 5 stakeholders captured with `STK-*`, influence, and interest.
- [ ] `StRS.md` complete — every `SN-*` is solution-free, prioritised, and traced to an originating `STK-*`.
- [ ] `OpsCon.md` complete — every high-priority `SN-*` exercised by ≥ 1 `SCN-*`; top off-nominal/maintenance threads covered.
- [ ] `Feasibility_Study.md` complete — all four dimensions verdicted; **no non-waivable No-Go**.
- [ ] Lifecycle model chosen and justified per track (Spiral available; SAFe only as a Hybrid note).
- [ ] Top 4+ risks logged as `RSK-*` with likelihood/impact/band, handed to the Risk thread.
- [ ] Schedule anchored to MCR→SRR (no invented TRR/PRR dates).

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** Top concept risks scored and owned; feasibility No-Gos surfaced.
- **Safety:** FHA done; safety goals defined; certifiability under the named regime reflected in feasibility.
- **Security:** Threat environment characterized in the OpsCon; ≥ 1 abuse/misuse `SCN-*`; any crypto/regulatory feasibility blocker named.
- **HSI:** Operator *and* maintainer stakeholders + needs identified; OpsCon describes human roles, crew concept, and use environment.
- **Measurement:** Every top mission need has an MOE with a target range; MOEs are solution-*independent*.
- **Cost/Schedule:** ROM LCC closes the business case (NPV > 0 / acceptable CBA); milestone schedule credible.
- **Quality:** Problem-space artifacts peer-reviewed before sign-off; lifecycle-model choice recorded with rationale.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* A missing feasibility verdict or a non-waivable No-Go is a **Hold** or **Stop**, not a Proceed.

---

## SRR — System Requirements Review *(Stage 02 · Requirements)* → **Functional/Requirements baseline**

**Passes when** (Conventions §3): *Every REQ passes SMART; StRS→SyRS traced; requirements baselined.*

**Entry criteria**
- [ ] MCR passed (or its actions closed); StRS + OpsCon are signed off (problem space frozen before solution space).
- [ ] The MOE set and constraint seeds are available to derive REQs and MOPs.

**Exit criteria** *(detailed source: [`se-phase-02-requirements/SKILL.md` Exit-gate checklist (SRR)](../skills/se-phase-02-requirements/SKILL.md))*
- [ ] Every REQ passes all five **SMART** letters (no non-SMART REQ remains).
- [ ] Every REQ uses a Conventions §2.1 class code and a stable, zero-padded `REQ-<class>-<nn>` ID.
- [ ] Every REQ derives from an `SN-<nn>` (no orphan REQs); every `SN-<nn>` covered by ≥ 1 REQ (no uncovered needs).
- [ ] Every REQ has a **priority** (High/Med/Low/N-A) and a **seeded** T/I/A/D method with a `TC-VER-TBD` placeholder.
- [ ] **MOE/MOP/TPM** set defined: MOEs from SN, MOPs from REQ, TPMs promoted with threshold + margin.
- [ ] All identified **conflicts resolved or recorded** (rationale + priority tie-break).
- [ ] **Peer review / walkthrough** completed; reviewers + date recorded.
- [ ] **Constraint (`C`) and Domain (`D`)** requirements captured; each `D` cites a verified standard edition/clause.
- [ ] Forward **and** backward traceability present (**bidirectional** if safety-critical/regulated).
- [ ] On sign-off: status → `Baseline (SRR-approved <date>)`; **Functional/Requirements baseline** established.

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** New interface/requirement risks generated this stage are logged.
- **CM:** Functional/Requirements baseline set with `Baseline (SRR-approved <date>)`; `SysRS`, `Traceability_Matrix`, MOE/MOP set identified as `CI-*`.
- **Safety:** Every `HAZ-*` traces to ≥ 1 `REQ-SAF-*`; availability/MTBF/MTTR allocated as testable `REQ-P-*/O-*` (no adjectives).
- **Security:** Every security `SN-*` derives to a `REQ-SEC-*`; `REQ-SEC-*` SMART, with T/I/A/D seeded and a security MOE/MOP.
- **HSI:** Every HSI domain has ≥ 1 requirement (or a justified "N-A: tailored out"); human `MOE/MOP/TPM` defined; `HTASK-*`/`HERR-*` logged.
- **Measurement:** Every MOE covered by ≥ 1 MOP; every MOP traced to a `REQ-*`; critical MOPs promoted to TPMs; set baselined.
- **Cost/Schedule:** WBS covers 100% of baselined scope; budget-ceiling constraint is a tracked requirement.
- **Quality:** Every `REQ-*` passed a recorded SMART **review**; QA Plan baselined; review-effectiveness measured from here.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* Any non-SMART REQ or uncovered `SN` blocks **Proceed**.

---

## PDR — Preliminary Design Review *(Stage 04 · Architecture & Design)* → **Allocated baseline**

**Passes when** (Conventions §3): *Architecture approved; framework chosen; no critical open risks; allocated baseline set.*

**Entry criteria**
- [ ] SRR passed; the Functional/Requirements baseline is current.
- [ ] The Phase-03 MBSE model has cleared the Model-Coverage gate (every `REQ-*` satisfied by ≥ 1 block, verified by ≥ 1 placeholder TC) — architecture builds on a covered model.

**Exit criteria** *(detailed source: [`se-phase-04-architecture/SKILL.md` Exit-gate checklist](../skills/se-phase-04-architecture/SKILL.md))*
- [ ] **42010 description complete** — every stakeholder concern addressed by ≥ 1 view.
- [ ] **Architecture principles** stated (5–10), each with rationale.
- [ ] **Frameworks** chosen and their complementary roles justified.
- [ ] **Every Phase-03 BDD block** appears in the Logical/Physical views (no phantom blocks).
- [ ] **Allocation matrix complete** — every relevant `REQ-*` allocated to ≥ 1 block; no orphan blocks.
- [ ] **Every `REQ-INT-*`** and every external dependency has an `ICD-<nn>` entry.
- [ ] **Every ICD row** names a standard, an auth mechanism, and a REQ-sourced (or `TODO:`-marked) latency budget; trust-boundary and safety flags set.
- [ ] **ICD status = `Draft`** (not baselined — frozen at CDR).
- [ ] **Tech_Stack_Rationale** references ≥ 1 REQ/principle per major choice; "NOT using" list has ≥ 4 specific rejections.
- [ ] **Trust boundaries drawn**; each crossing seam linked to a `THR-*` (or `TODO:`).
- [ ] **No open `RSK-*` of High/Critical severity** blocking PDR.

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** **Any critical open risk fails the gate.** New interface risks logged.
- **CM:** Allocated baseline set; architecture, ICD (draft), and requirement-to-block allocation under version control.
- **Safety:** PHA/SHA run on *this* architecture; no unmitigated single point of failure / common-cause path; reliability budget allocated within margin.
- **Security:** Threat model complete over **all** trust boundaries and ICD seams; every Critical/High `THR-*` mapped to a selected, allocated control.
- **HSI:** Operator station / UI designed; HSI REQs allocated to an HMI block; human-facing ICD seams defined; error modes mistake-proofed.
- **Measurement:** Each TPM has threshold, target, and a **planned profile** allocated to a block; the PDR profile point met or a credible recovery plan exists.
- **Cost/Schedule:** Architecture's cost structure fits the BAC; PMB proposed; no work package without a basis-of-estimate.
- **Quality:** A structured **design review** held with evidence; every `DEC-*` has a documented basis; no open `QA-*` nonconformity blocking sign-off.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* A High/Critical open `RSK-*` is a **Hold**. If allocation reveals the requirements no longer fit, **Re-baseline** via Stage 09.

---

## CDR — Critical Design Review *(Stage 06 · Integration)* → **Product baseline · ICDs frozen**

**Passes when** (Conventions §3): *Detailed design complete; **ICDs frozen**; integration plan ready; product baseline set.*

**Entry criteria**
- [ ] PDR passed; the Allocated baseline is current; PDR actions closed.
- [ ] Strategic decisions are traced (Stage 05 *Decisions-traced* gate clear) — each has a `DM-NN` matrix, sensitivity block, and `DEC-NN`→REQ link.
- [ ] Components are built/buildable enough to define observable increment exit criteria.

**Exit criteria** *(detailed source: [`se-phase-06-integration/SKILL.md` Exit-gate checklist](../skills/se-phase-06-integration/SKILL.md))*
- [ ] Integration strategy chosen and justified against the dominant risk.
- [ ] Increments ordered by **dependency weight** (ranking recorded; overrides explained).
- [ ] Increments (`INC-NN`) defined — count derived from *this* project — each with observable entry/exit criteria, a Pass/Fail signal, and a duration.
- [ ] Every dependency edge classified **Data / Control / Temporal / Resource**.
- [ ] **Every `ICD-NN`** appears exactly once in the stubs/drivers/mocks coverage table, each tagged **HW / SW-API / HMI** with a replacement increment.
- [ ] CI/CD pipeline defined **per tier**; static-scan/SAST and SCA/SBOM stages present.
- [ ] HIL rig exists for every `REQ-P/O/SAF-*` needing physical measurement; safety rigor anchored to the applicable standard.
- [ ] All `ICD-NN` **frozen** → `Status: Baseline (CDR-approved <date>)`; **product baseline** set.
- [ ] No open **S1** defect, critical `RSK-NN`, or critical `HAZ-NN` blocks CDR; `TPM-*` margins reported.

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** No critical `RSK-*` open; integration-seam risks logged and owned.
- **CM:** **Product baseline** set with **ICDs frozen**; build/config recipe under **semver**; every `CI-*` rolls up to a declared baseline.
- **Safety:** Safety-relevant ICDs frozen; integration increments test safety functions **early**; HIL/fault-injection planned for every safety interface.
- **Security:** Security-relevant ICD fields frozen; SBOM produced and provenance verified per build; CI/CD security gates wired into each `INC-*`.
- **HSI:** Human-facing ICDs frozen; training devices/sims and operator procedures in the plan; HIL increments planned.
- **Measurement:** TPMs measured on **real increments**; achieved-to-date within tolerance band; margin not spent faster than planned.
- **Cost/Schedule:** **PMB frozen with the product baseline;** critical path identified and resourced; EVM data collection live.
- **Quality:** CI/CD quality gates running; supplier-delivered items passed incoming inspection; increment review cadence honoured.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* An unfrozen ICD or an open S1/critical `HAZ-*` is a **Hold**.

---

## TRR — Test Readiness Review *(Stage 07 · Verification)*

**Passes when** (Conventions §3): *100% requirement coverage by method; test env & data ready.*

**Entry criteria**
- [ ] CDR passed; the Product baseline (frozen ICDs) is current — verification tests the baselined configuration.
- [ ] The verification environment (Phase-06 CI/CD + HIL) is stood up enough to dry-run.

**Exit criteria** *(detailed source: [`se-phase-07-verification/SKILL.md` Exit-gate checklist — TRR](../skills/se-phase-07-verification/SKILL.md))*
- [ ] **100%** of REQs have a finalised T/I/A/D method (zero unassigned).
- [ ] **100%** of REQs have ≥ 1 `TC-VER-<nn>` (zero `TC-VER-TBD`).
- [ ] Every method choice justified against the requirement's verifiability; overrides of the Phase-02 seed noted.
- [ ] Every tool named (no bare "Manual"); unknowns flagged `TODO`.
- [ ] `VnV_Plan.md` exists; integrity level set; IV&V decision recorded.
- [ ] Test environment + data ready (per Phase-06 CI/CD + HIL); a tool dry-run done, not just naming.
- [ ] Continuous scans (Phase-06 stack) configured and passing their stated criteria.
- [ ] `verification-evidence/` structure created; per-TC `result.md` stubbed.
- [ ] Acceptance/UAT/FAT/SAT explicitly **deferred to Phase 08** (not counted here).
- [ ] All blocking defects fixed; test team trained.

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** Any `REQ` with no credible verification method is a gate risk.
- **CM:** V&V evidence under control and version-pinned to the configuration being tested (FCA inputs identified).
- **Safety:** Safety Case assembled with evidence; `HAZ→REQ-SAF→TC-VER` traceability 100% and **bidirectional**; no safety REQ without a verification method.
- **Security:** Every `THR-*` control covered by a `TC-VER-*`; pen-test/abuse-case scope agreed; environment representative.
- **HSI:** Every HSI REQ has a method and `TC-VER-<nn>`; representative-user UAT plans and operator population ready.
- **Measurement:** Each TPM read from verification evidence (`TC-VER-<nn>`, method **T**); any TPM below threshold ⇒ **not** Proceed.
- **Cost/Schedule:** Current CPI/SPI; EAC vs BAC (VAC); any control account below threshold has a funded corrective action.
- **Quality:** QA confirms the V&V **process** was followed — each `TC-VER-*` run per procedure, evidence logged, method matched, no hidden coverage gap.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* State the **necessary-but-not-sufficient** caveat (100% coverage ≠ sufficient). A TPM below threshold is **not** a Proceed.

---

## PRR — Production Readiness Review *(Stage 08 · Validation)*

**Passes when** (Conventions §3): *Validation ≥ targets; zero sev-1; FCA/PCA done; ready to produce/release.*

**Entry criteria**
- [ ] TRR passed; verification evidence shows the system meets the spec; TRR actions closed.
- [ ] Pilot/FAT/SAT environment and representative operators are available.

**Exit criteria** *(detailed source: [`se-phase-08-validation/SKILL.md` Exit-gate checklist — PRR](../skills/se-phase-08-validation/SKILL.md))*
- [ ] `Test_Plan.md` complete (all 10 KB-topic-17 sections); Standard = ISO/IEC/IEEE 29119-3:2021.
- [ ] ≥ 8 `TC-VAL-*` written; each has per-step `*Expected:*` **and** Actual Result + Pass/Fail Status fields.
- [ ] **Acceptance catalog covers UAT, OAT, FAT, SAT, regulatory** as applicable (tailored-out ones recorded with reason).
- [ ] **Every `TC-VAL` is independent** — no case depends on another's result (state re-established in Preconditions).
- [ ] Every `REQ-U-*` and every primary stakeholder scenario → ≥ 1 `TC-VAL`; every behavioural `HAZ-*` validated.
- [ ] Pass criteria numeric, derived from this project's MOE/MOP set, set in advance.
- [ ] **Validation ≥ targets · zero S1 defects · FCA/PCA done** (Conventions §3 PRR floor).
- [ ] Pilot is real-users-in-real-environment; pilot/FAT/SAT scheduled with buffer before GA.
- [ ] Evidence archived per case (`validation-evidence/TC-VAL-NN/`); V&V traceability report (REQ → TC → result) produced.

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** Zero critical open risk and zero open `S1`.
- **CM:** **FCA and PCA done** — every `REQ-*` verified (FCA) and as-built matching as-documented (PCA); each discrepancy a `CR-*`.
- **Safety:** Zero open S1 hazards; residual risk accepted **by name**; reliability/availability demonstrated ≥ target; Safety Case signed by the independent assessor.
- **Security:** Validation ≥ targets with **zero sev-1 security defects**; red-team / compliance-audit evidence on file; residual risks formally accepted.
- **HSI:** Human-in-the-loop UAT passed with **representative** operators; zero `S1` human-induced failures; time-to-proficiency + crew workload within threshold; training materials accepted.
- **Measurement:** **MOEs** meet stakeholder targets in validation (`TC-VAL-<nn>`); no met-spec-but-unmet-MOE; final margins acceptable.
- **Cost/Schedule:** Over-run, if any, explicitly accepted; CPI/SPI and VAC reported.
- **Quality:** Defect trends within bounds (density, escape rate, rework); test independence audited; Actual-Result/Pass-Fail recorded; **zero open `S1`**; all `QA-*` actions closed or risk-accepted.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* Any open `S1`, missing FCA/PCA, or unmet MOE blocks **Proceed**.

---

## ORR — Operational Readiness Review *(Stage 10 · Operations)*

**Passes when** (Conventions §3): *Deployment, runbooks, SLOs, on-call, rollback all in place.*

**Entry criteria**
- [ ] PRR passed; the system is validated ≥ targets with zero S1; PRR actions closed.
- [ ] The change/configuration governance (Stage 09 CCB + CR loop) is stood up so post-GA changes route through it.

**Exit criteria** *(detailed source: [`se-phase-10-operations/SKILL.md` Exit-gate checklist — ORR](../skills/se-phase-10-operations/SKILL.md))*
- [ ] Transition/deployment + cutover + back-out plan defined; operator handover/training done.
- [ ] Every `REQ-P-*` and `REQ-O-*` maps to an `SLO-NN` (no uncovered Performance/Operational REQ).
- [ ] Observability stack chosen; dashboard owners + alert routes assigned; RED + USE instrumented.
- [ ] On-call rotation + incident-commander role defined.
- [ ] Rollback defined — auto-rollback wired for hard breaches; manual runbook for ambiguous; mandatory-auto on safety-critical paths.
- [ ] ≥ 1 real `RB-NN` runbook file exists per SLO alert (folder is **not** empty).

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** Field-failure re-open path defined; operational risks logged.
- **CM:** **Deployed configuration matches the released baseline** (no drift); runbooks/SLOs under control.
- **Safety:** FRACAS live; availability SLOs and safety runbooks in place; a path to re-open a hazard on a field failure exists.
- **Security:** SBOM/CVE watch, secret rotation, IDS/SIEM SLOs, and incident runbooks live; re-threat-modeling cadence defined.
- **HSI:** Operators/maintainers trained and certified; human-performance SLOs in place; an HSI feedback loop wired into Stage 09.
- **Measurement:** MOEs/MOPs wired to live `SLO-<nn>`; drift monitored with an alert + CR path.
- **Cost/Schedule:** Run-cost (OpEx) within the LCC model; SLO/on-call costs tracked against the operate budget.
- **Quality:** Operational defect/incident trend acceptable; runbook/SLO responses follow procedure; QMS surveillance audit current.

**Decision** — *Proceed (to GA) · Proceed-with-actions · Hold · Re-baseline · Stop.* An empty `runbooks/` folder or an uncovered Performance/Operational REQ is a **Hold**.

---

## GA — General Availability *(Stage 10 · Operations — continuous)*

**Passes when** (Conventions §3): *Live to all users; error budgets honoured (continuous thereafter).*

**Entry criteria**
- [ ] ORR passed; deployment/cutover executed (or staged); SLO instrumentation is live and reporting.
- [ ] The error-budget policy and the freeze→CCB route are defined before go-live, not after.

**Exit criteria** *(detailed source: [`se-phase-10-operations/SKILL.md` Exit-gate checklist — GA](../skills/se-phase-10-operations/SKILL.md))*
- [ ] Error budgets defined per SLO **with** a burn policy that routes a freeze through the Phase-09 CCB.
- [ ] Continuous-testing pipeline documented — per-commit (shift-left/fail-fast/env-as-code/service-virtualization/test-type ladder) **and** post-GA continuous-regression cadence scheduled.
- [ ] ≥ 4 chaos game days defined; first scheduled within 30 days of GA.
- [ ] Vulnerability-response SLA documented and mapped to `S1–S4`.
- [ ] OTA cohorts + gating metrics + auto-rollback + `CR-NN` audit log defined.
- [ ] PIR template defined; S1/S2-incident → loop-back `CR-NN` via Phase 09 rule stated.
- [ ] Disposal explicitly handed to **Phase 11** (not authored here).

> **GA is continuous.** After the one-time go-live decision, GA is re-evaluated every cycle: error budgets must stay honoured, and any SysRS-affecting incident files a `CR-<nn>` (Stage 09). The thread review below runs at each periodic ops review.

**Cross-cutting thread review (gate-specific, then continuous)**
- **Risk/Opp:** Live-risk burndown maintained; new operational `RSK-*`/`OPP-*` from incidents logged.
- **CM:** No configuration drift between deployed and released baseline; OTA changes carry `CR-NN`.
- **Safety:** Error budgets and safety runbooks honoured; FRACAS feeding hazard re-opens.
- **Security:** SBOM/CVE watch and incident response operating within SLA; vuln-response mapped to `S1–S4`.
- **HSI:** Human-performance SLOs honoured; operator feedback routed to Stage 09.
- **Measurement:** SLO/error-budget burn within target; MOE/MOP drift alerts wired to a CR path.
- **Cost/Schedule:** OpEx tracked against the operate budget; run-cost within the LCC model.
- **Quality:** Operational defect/incident trend acceptable; PIRs produced and corrective actions closed.

**Decision** — *Proceed (go live / stay live) · Proceed-with-actions · Hold (freeze) · Re-baseline · Stop (roll back).* An error-budget burn that breaches policy routes a **freeze (Hold)** through the CCB.

---

## DRR — Decommissioning Readiness Review *(Stage 11 · Disposal)*

**Passes when** (Conventions §3): *Retirement plan, data sanitization, environmental & archival approved.*

**Entry criteria**
- [ ] A retirement trigger exists (EOL, obsolescence, successor go-live, business decision) and retirement is opened as a `CR-*` against the product baseline.
- [ ] The product baseline and operational record are available to plan a reversible-enough teardown.

**Exit criteria** *(detailed source: [`se-phase-11-disposal/SKILL.md` Exit-gate checklist](../skills/se-phase-11-disposal/SKILL.md))*
- [ ] Retirement trigger, target end-state, and disposal mode documented; retirement opened as a `CR-*`.
- [ ] Decommissioning sequence is the **reverse** of Phase-06 integration; each step has owner, rollback point, verification; **points of no return** flagged.
- [ ] Sanitization table complete — every data store/medium has a Clear/Purge/Destroy action chosen by **data categorization**, a method, a verification step, and a Certificate-of-Sanitization reference (**NIST SP 800-88 Rev. 1**).
- [ ] Retention / legal-hold data identified and **migrated to the archive before any wipe**; customer-owned data return path defined.
- [ ] Key/secret/credential destruction planned (incl. backups, caches, logs, secrets stores).
- [ ] Environmental plan complete — RoHS/WEEE/e-waste routing, hazardous materials, certified recycler + chain-of-custody per asset class; site restoration defined. (Cloud teardown + carbon for pure software.)
- [ ] Obsolescence & spares disposition decided per asset class with owner + date.
- [ ] License/contract/service wind-down sequenced **after** export and end-of-support, with notice periods honoured.
- [ ] EOL communications scheduled backward from the sunset date; migration path + data-export deadline published.
- [ ] **Knowledge archive package staged** (contents, location, retention, integrity controls) **and lessons-learned retrospective written and routed to the Quality/Knowledge thread.**

**Cross-cutting thread review (gate-specific sharpenings)**
- **Risk/Opp:** Disposal `RSK-*` scored; no irreversible step proceeds before its precondition clears.
- **CM:** Final/as-disposed configuration captured and archived per retention policy.
- **Safety:** Decommissioning hazards analysed and mitigated (de-energize/lockout-tagout, hazardous materials); Safety Case covers safe disposal.
- **Security:** Sanitization per NIST 800-88 planned; all keys/certs/credentials revoked; audit logs archived per retention; data-at-rest exposure in `Threat_Model.md`.
- **HSI:** Human decommissioning tasks safe and staffed; HSI lessons-learned archived.
- **Measurement:** Final MOE/MOP/TPM actuals captured in the lessons-learned package.
- **Cost/Schedule:** Decommissioning-cost line realised; final cost/schedule actuals captured as lessons-learned.
- **Quality:** Disposal followed plan; lessons-learned and QMS-improvement actions captured and routed to the Quality/Knowledge thread.

**Decision** — *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop.* This is the **terminal** gate; on DRR approval the lifecycle closes. The lessons-learned package flows **forward** — to the Quality/Knowledge thread and the next project's Phase 01. Block every irreversible teardown step until its precondition clears.

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — the contract: gates & baselines (§3), IDs (§2), T/I/A/D (§4), severity (§5), status strings (§6), citations (§9).
- [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) — the 12-stage spine, the 8 cross-cutting threads (§1), the gate flow + 5-outcome decision (§6).
- Producing-stage exit-gate checklists (detailed source per gate): [`../skills/se-phase-00-agreement/SKILL.md`](../skills/se-phase-00-agreement/SKILL.md) · [`01`](../skills/se-phase-01-concept/SKILL.md) · [`02`](../skills/se-phase-02-requirements/SKILL.md) · [`04`](../skills/se-phase-04-architecture/SKILL.md) · [`06`](../skills/se-phase-06-integration/SKILL.md) · [`07`](../skills/se-phase-07-verification/SKILL.md) · [`08`](../skills/se-phase-08-validation/SKILL.md) · [`10`](../skills/se-phase-10-operations/SKILL.md) · [`11`](../skills/se-phase-11-disposal/SKILL.md).
- The 8 cross-cutting thread files (gate-review questions home): [`../cross-cutting/`](../cross-cutting/).
- [`quality-checklists.md`](quality-checklists.md) — the reusable artifact-quality checklists (SMART, INCOSE, ICD row, test-case anatomy, decision-matrix soundness, bidirectional traceability, SysML coverage) used inside the exit criteria above.
