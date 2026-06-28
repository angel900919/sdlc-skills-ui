---
Document: Systems Engineering Management Plan — Aria AI-Powered Personal Work Assistant
Document ID: SEMP-ARIA-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer / Chief Engineer
---

> **Phase 00 — Agreement & Enablement.** This SEMP governs **how** the Aria engagement is run. It conforms to the Conventions (the single source of truth) for all IDs, gates, T/I/A/D methods, S1–S4 severities, baselines, status strings, and the §9 standard citations, and realises the ISO/IEC/IEEE 15288:2023 Technical-Management processes. It folds in an **agreement summary** (§1.1) and the **enablement frame** (§9.1) so this one file carries the Phase-00 deal-and-means picture; the full Agreement Register and Project Enablement Plan are companion files in this Phase-00 set. Exit gate: **ATP — Authority to Proceed** (Conventions §3). The lifecycle model recorded here is **provisional**; it is *bound* in Phase 01 at MCR — but note Concept.md has already drafted the binding choice (Agile + Formal overlay), so §5 simply forward-references it rather than re-deciding.

---

## 1. Purpose & scope

This SEMP governs the systems-engineering management of **Aria** — an AI-powered personal work assistant that unifies each employee's Microsoft Outlook (mail + calendar), HubSpot CRM, Atlassian JIRA, and Therefore document management into one dashboard plus an AI chat/agent, with human-in-the-loop (HITL) control of every write action. It conforms to the Conventions for all IDs, gates, methods, severities, baselines, status strings, and the §9 citations, and operationalises the ISO/IEC/IEEE 15288:2023 Technical and Technical-Management processes.

- **Governs:** all delivery tracks — (1) **dashboard + AI chat/agent + RAG** (the productivity surface, blocks 1–4 of SysRS §12); (2) **the four connectors + Connector Gateway** (Outlook/Graph, HubSpot, JIRA, Therefore — block 5; ICD-01…ICD-04); (3) **identity / token broker** (SSO/OIDC + delegated OAuth — block 6; ICD-06); (4) **the trust-and-safety spine** — Untrusted-Content Sandbox, Tool Guardrails, Action-Confirmation Gate, Audit Log (blocks 7–8). The four connected systems remain the systems of record; Aria does not replace them (Concept §3).
- **Tailoring level:** **Standard+ (Agile base + Formal overlay)** — Agile artifact cadence over the whole system, with the **Formal** artifact set overlaid on the identity, privacy/security, and AI-action-safety tracks (see §6). This realises the README "Agile (tailored Standard+)" lifecycle line.

### 1.1 Agreement summary (folded in from `Agreement_Register.md`)

| Item | Value |
|---|---|
| **What is acquired** | Aria — a software + LLM/agentic system: unified read-only dashboard + AI chat/agent across four work systems, with HITL-gated write actions and per-user least-privilege identity. |
| **For whom** | The employer's workforce (every provisioned employee — STK-01), sponsored by the Team Manager / Sponsor (STK-02). |
| **Domain** | Enterprise productivity / knowledge work, EU-regulated (GDPR). **Software + LLM/agentic** (no hardware element; not safety-of-life — see Concept §1 and README). |
| **Engagement type** | **Internal product charter / self-funded** — acquirer and supplier are the same organisation (the employer's product + platform org). No external SOW; acceptance is internal sign-off by STK-02 (sponsor) with STK-04 (Security/Compliance) and STK-05 (DPO) as co-acceptance authorities on their respective gates. |
| **Acquirer-side authority** | STK-02 (Team Manager / Sponsor) — accepts deliverables, releases funding; STK-04 + STK-05 co-accept the security/privacy acceptance criteria. |
| **Supplier-side authority** | Lead SE / Chief Engineer (this SEMP's owner) — delivers the system + SE artifacts. |
| **Acceptance bar (preview)** | The mission-level success measures MOE-01…MOE-07 (Concept §7) are the acceptance spine; the binding objective thresholds are the MOP/TPM set in SysRS §10 — notably **MOP-05 = 0 unconfirmed writes**, **MOP-06 = 100% out-of-policy/cross-user attempts blocked**, **MOP-11 = 100% actions audited**, **TPM-01 grounding ≥ 95%**, **TPM-03 injection-defense ≥ 99%**, **TPM-02 availability ≥ 99.5%**. Acceptance is executed in Phase 08 at PRR (Conventions §3). Several thresholds are still `TODO: validate` (MOE-01/-02/-03/-06) — owed before the PRR acceptance bar is frozen. |
| **Constraint seeds carried into requirements** | Already promoted to REQ in SysRS §8: data-residency region pinning → REQ-C-01; LLM no-training-on-data term → REQ-C-02; connected-app API terms & rate limits → REQ-C-03; GDPR Arts. 5/15/17/25/30/32/35 → REQ-D-01. Identity mandate (OAuth 2.0/OIDC + RFC 9700) → REQ-SEC-01/-02/-04. |

> Engagement-level risks/opportunities are **already logged** in Concept §8 (RSK-01…RSK-07, OPP-01); this SEMP inherits them rather than re-numbering, and opens the living register at §4 / §8.

---

## 2. SE process model

How the 12 workflow stages apply to Aria, and which technical / technical-management processes are used (ISO/IEC/IEEE 15288:2023).

- **Technical processes used (full 12-stage spine, none silently skipped):** Mission Analysis & Stakeholder Needs (Phase 01 — `Concept.md`, drafted) → System Requirements (Phase 02 — `SysRS.md`, drafted, 46 REQ) → System Analysis / MBSE (Phase 03 — 7-of-9 SysML) → Architecture & Design (Phase 04 — Architecture_Description, ICD, Tech_Stack_Rationale) → Trade-off & Decision (Phase 05 — DEC-01…DEC-05 / DM-01…DM-05) → Integration (Phase 06 — increments + eval harness in CI) → Verification (Phase 07) → Validation (Phase 08 — red-team + human-acceptance + productivity) → Operations & Continuous Validation (Phase 10 — SLOs, runbooks, eval-regression, drift) → Disposal (Phase 11 — token revocation, memory/history sanitization, GDPR erasure).
- **Stages tailored out:** **none.** Aria is pure software, so there is no hardware production line; Phase 08 (PRR / "Production Readiness") is realised as **release readiness** — eval-gated model/prompt promotion plus the isolation+injection pen-test sign-off (REQ-SEC-08) — not a first-article hardware inspection (see §6).
- **Stage iteration / sequencing:** follows the Agile-base lifecycle model in §5 — 2-week sprints with continuous delivery on the productivity surface; the identity, privacy/security, and AI-action-safety tracks ride the **same sprint cadence** but are **change-controlled** so their frozen artifacts (ICDs, threat model, eval baselines, model/prompt config) cannot regress between sprints. Releases are gated by the evaluation harness per SCN-07 (model/prompt update rollout).

---

## 3. Organization & roles

| Role | Person (maps to STK) | Gate-decision authority (RACI) |
|---|---|---|
| Lead SE / Chief Engineer | TODO: name owed by product org | **A** on technical gates (SRR→ORR) |
| Technical Review Authority (gate chair) | TODO: name | A/R at each gate review |
| Acquirer / Sponsor review authority | STK-02 (Team Manager / Sponsor) | **A** on ATP, funding release, and final acceptance (PRR) |
| AI/ML Engineering Lead | STK-08 | **A** on AI-action-safety + eval gates; owns agent, RAG, model routing (DEC-01/-02), eval baselines, drift |
| Security & Compliance Officer | STK-04 | **A**/co-accept on the security acceptance criteria; owns Threat Model (THR-*) + injection/isolation pen-test sign-off (REQ-SEC-08) |
| Data Protection Officer (DPO) | STK-05 | **A**/co-accept on privacy; owns DPIA (REQ-D-01, Art. 35) + retention/erasure controls (REQ-O-05, REQ-C-01) |
| IT / Identity & Access Admin | STK-03 | **C** — owns SSO/OIDC + OAuth app registration, delegated scopes, token revocation (REQ-SEC-01/-02/-04) |
| Platform / SRE & On-call Lead | STK-07 | **R** on availability/degradation (REQ-O-01…O-03) + operability; owns SLOs (Phase 10) |
| Dashboard / Connector Engineering Lead | TODO: name | **C** — owns blocks 2 & 5, ICD-01…ICD-04 |
| Systems & V&V Lead | TODO: name | **R** on Verification/Validation matrices (TC-VER-*, TC-VAL-*) |
| Works Council liaison | STK-09 | **C** — consulted on transparency (REQ-U-04) + works-council consultation before GA |
| Program / Project Manager | TODO: name | **A** on cost/schedule |

> RACI legend: **A** accountable (one per decision), **R** responsible, **C** consulted. Because Aria is an *internal* engagement, the acquirer authority (STK-02) and the supplier chief engineer sit in the same organisation; the AI Lead (STK-08), Security (STK-04), and DPO (STK-05) hold **co-accountability** on their gates so the trust-critical tracks cannot be waved through by the productivity-focused sponsor alone. This split directly serves MOE-04 (trust-critical incidents = 0).

---

## 4. Technical effort planning

How the technical processes are planned, assessed, and controlled, and how the 8 cross-cutting threads run and are reviewed at **every gate**. Threads are cross-referenced (§8), not re-authored here.

- **Planning, assessment & control:** Agile cadence (2-week sprints, continuous delivery) with a sprint review; the eval harness runs **in CI** (built in Phase 06) and **gates every release** (SCN-07). TPM margins — **TPM-01** grounding (from MOP-04), **TPM-02** availability (from MOP-07), **TPM-03** injection-defense (from MOP-12) — are tracked sprint-over-sprint and reported at **every gate**; all three currently read `Current: TODO` (SysRS §10) and are owed a first measurement by SRR-exit/PDR.
- **Decision management:** the five strategic trade studies are recorded as `DEC-01…DEC-05` / `DM-01…DM-05` in Phase 05 (SysRS §12): **DM-01** LLM choice & task-tier routing (recommend Claude Opus 4.8 hardest-reasoning · Sonnet 4.6 balanced · Haiku 4.5 fast, routed by task class — satisfies REQ-P-04); **DM-02** RAG architecture (satisfies REQ-F-06, REQ-P-05); **DM-03** build-vs-buy agent/connectors; **DM-04** token storage / secrets (satisfies REQ-SEC-04); **DM-05** AI-action-safety pattern (satisfies REQ-SAF-01/-02, REQ-F-09). Decision IDs are placeholders until Phase 05 owns them.
- **Risk management:** living `RSK-*` / `OPP-*` register, scored Likelihood×Impact (Conventions §5.3), reviewed **every gate + monthly**. Already seeded in Concept §8 — RSK-01 (injection, **Critical**), RSK-02 (cross-user leak, High), RSK-03 (hallucination-into-write, High), RSK-04 (token theft, High), RSK-05 (GDPR, High), RSK-06 (upstream outage cascade, Medium), RSK-07 (model/prompt drift, High), OPP-01 (cross-system workflow as differentiator). MCR conditions = retire RSK-01/-02/-03 via demonstrated eval gates (Concept §9).
- **Configuration management:** document/code baselines & `CR-*` changes owned by Phase 09; repository, naming, and versioning set in the Project Enablement Plan. A standing **CR class is reserved now for model/prompt change control** (each model-tier or system-prompt change is a `CR-*` that must clear the eval gate per SCN-07 and RSK-07) so the AI-action-safety baseline cannot drift silently. → Conventions §6, §9.
- **Information management:** all artifacts in the project Git repo; document IDs `<TYPE>-ARIA-vX.Y`; status strings Draft → In Review → Baseline (`<GATE>`-approved) → Superseded per Conventions §6. A baselined artifact changes **only** through a `CR-*`.
- **Measurement:** MOE/MOP/TPM defined in Phase 01/02 (Concept §7; SysRS §10). The acquirer-level success measures (≥ 30 min/user/day saved · ≥ 90% task success · ≥ 95% grounded · 0 trust-critical incidents · 100% injection neutralised · ≥ 99% availability under 1-upstream outage) seed MOE-01…MOE-07 and are tracked to the MOP/TPM set. → `_cross_cutting/TPM_Tracker.md`.
- **Quality assurance:** ISO 9001:2015 QMS; QA cadence + the FCA/PCA (release-readiness) pointers live in the Project Enablement Plan; for Aria the "physical-config audit" is the **eval-baseline + audit-completeness + pen-test** evidence pack (REQ-SEC-06/-08). → `_cross_cutting/QA_Plan.md`.

---

## 5. Provisional lifecycle model

**Agile (2-week sprints, continuous delivery) + Formal overlay on the trust tracks** — recorded here as **PROVISIONAL** per Conventions §3 / Phase-00 rules, but the **binding choice has already been drafted in Phase 01 (`Concept.md` §4)** and is repeated here only for the SEMP record; the gate that *binds* it is **MCR** (Concept exit), not this phase.

- **Likely model & why:** Agile fits because scope evolves rapidly with **model capability** and **connector APIs**, and trust/adoption (SN-10) needs a fast user-feedback loop. A **Formal overlay** is required on three tracks because their guarantees cannot regress between sprints: **identity** (per-user delegated least-privilege — REQ-SEC-02/-03/-04, SN-02), **privacy/security** (GDPR + injection defense — REQ-D-01, REQ-SEC-07, SN-03/SN-09), and **AI-action-safety** (HITL write-gate — REQ-SAF-01/-02, REQ-F-09, SN-04). On those tracks: **frozen ICDs**, a **change-controlled threat model**, **eval-gated releases**, and **change control on model/prompt config**. SAFe is noted only as a scaling option if the program grows beyond one team — not a base model (Concept §4).

---

## 6. Tailoring — Standard+ (Agile base + Formal overlay on identity / privacy-security / AI-action-safety)

Per the Tailoring Guide. The engagement is **split-tailored**: the productivity surface uses a **lighter Agile-aligned** artifact set; the three trust tracks use the **Formal** artifact set with **bidirectional traceability** (Conventions §8 — Aria is not DO-178C/26262/62304 safety-of-life, but the trust guarantees are treated with equivalent rigour because a single regression is a trust-critical incident, MOE-04). Every tailored-out artifact is recorded — Conventions §1 forbids silent skipping.

**Formal (identity · privacy/security · AI-action-safety tracks):** full SysRS coverage (done), SysML model set incl. `Requirements_Diagram.puml`, **frozen ICDs** (ICD-01…ICD-06), `Threat_Model.md` (THR-*), `Hazard_Log.md` (HAZ-01 wrong/irreversible action; HAZ-02 destructive action), bidirectional Traceability Matrix, V&V evidence per requirement (the eval sets: groundedness, action-safety, injection red-team, isolation pen-test), and an eval-baseline release gate at PRR.

**Lighter (dashboard / chat / connector productivity surface):**
- tailored out (productivity surface only): formal per-sprint design review — replaced by the **Agile sprint review + PR review** (Inspection per Conventions §4), with a design-of-record captured at PDR/CDR.
- tailored out (productivity surface only): standalone **Parametric** and **Package** SysML diagrams — the model stays at the **7-of-9** working set (Conventions §7); neither a physical/parametric constraint nor model-size pressure warrants them for a pure-software single-team build. Re-add only if a latency/cost-budget parametric analysis or a multi-team package split emerges.
- tailored out (whole project): `COCOMO_Estimate.md` is **optional** in Phase 05 — kept as a ROM only (Concept §9 economic verdict is ROM-level); a full COCOMO is added only if the sponsor requires a formal cost case. *(Recorded as a deferral, not a deletion.)*

> The Formal overlay satisfies the trust-critical traceability obligation (Conventions §8) on identity/security/AI-action-safety while keeping the productivity surface fast — the exact split the README and Concept §4 prescribe.

---

## 7. Gate & baseline plan

Gate ladder (Conventions §3):

```
ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA → DRR
00    01    02    04    06    07    08    10   10   11
```

Per-gate intent for Aria (owning stage in parentheses):

| Gate | Aria-specific "passes when…" |
|---|---|
| **ATP** (00) | Internal charter authorised; this SEMP approved; team + funding authorised; risk/QA stubs open. **This phase** — see §10. |
| **MCR** (01) | Mission/OpsCon/feasibility accepted (drafted); lifecycle model bound; MCR conditions = retire RSK-01/-02/-03 via demonstrated eval gates + complete DPIA + clear works-council & connected-app terms (Concept §9/§10). |
| **SRR** (02) | All 46 REQ pass SMART; SN→REQ traced (SysRS §14); requirements baselined. *(SysRS is Drafted; pending peer-review walkthrough — SysRS §15.)* |
| **PDR** (04) | Architecture approved (blocks 1–8); framework chosen (DEC-03); ICD-01…ICD-06 drafted; no critical open risk (RSK-01 mitigation demonstrated); **Allocated baseline** set. |
| **CDR** (06) | Detailed design complete; **ICD-01…ICD-06 frozen**; integration plan + eval harness in CI ready; **Product baseline** set. |
| **TRR** (07) | 100% REQ coverage by T/I/A/D method; eval sets + injection/isolation test env + data ready (SysRS §11 seeds). |
| **PRR** (08) | Validation ≥ targets (MOE/MOP/TPM); **zero S1/S2 open**; isolation+injection pen-test passed (REQ-SEC-08); human-acceptance + productivity validation done; ready to release. |
| **ORR** (10) | Deployment, runbooks (RB-*), SLOs (SLO-*), on-call, rollback, AI-action observability + eval-regression + drift monitoring all in place. |
| **GA** (10) | Live to all provisioned users; error budgets honoured (continuous). |
| **DRR** (11) | Token revocation, assistant-memory/history sanitization (REQ-O-05), GDPR erasure (REQ-D-01, Art. 17), and archival approved (SCN-06). |

Baselines this project will set (frozen at gate, changed only via `CR-*` in Phase 09):

| Baseline | Established at | Contains (Aria) |
|---|---|---|
| Requirements / Functional | **SRR** | StRS (Concept §5, SN-01…SN-14), SysRS (46 REQ), MOE-01…MOE-07 / MOP-01…MOP-12 / TPM-01…TPM-03 set |
| Allocated | **PDR** | Architecture (42010) + the 8 blocks, requirement-to-block allocation, ICD-01…ICD-06 draft |
| Product | **CDR** | **Frozen** ICD-01…ICD-06 (4 connectors + LLM API + SSO/IdP), detailed design, build/config recipe — **plus the change-controlled model/prompt + eval-baseline config** (the trust-track product baseline) |

Aria is currently at **ATP** (this phase). See the ATP exit-gate result in §10.

---

## 8. Cross-cutting thread plan

One line per thread, naming its register and review cadence. Stubs opened at Phase 00 so every thread is alive from gate one. (The 8 threads: Risk, Configuration Mgmt, Safety/RAMS, Security, HSI, Measurement, Cost/Schedule, Quality.)

| # | Thread | Register | Review cadence (Aria) |
|---|---|---|---|
| 1 | Risk & Opportunity | `_cross_cutting/Risk_Opportunity_Register.md` | every gate + monthly — seeded RSK-01…RSK-07, OPP-01 (Concept §8); RSK-01 injection is **Critical** |
| 2 | Configuration Mgmt | `_cross_cutting/Configuration_Item_Register.md` | every gate (baselines at SRR/PDR/CDR); **model/prompt config under CR-* change control** (RSK-07, SCN-07) |
| 3 | Safety / RAMS (here = **AI-action safety**) | `_cross_cutting/Hazard_Log.md` | every gate — HAZ-01 wrong/irreversible action (→ REQ-SAF-01), HAZ-02 destructive action (→ REQ-SAF-02); not safety-of-life, but trust-critical |
| 4 | Security | `_cross_cutting/Threat_Model.md` | every gate + at each data-flow change — THR-* incl. prompt-injection (RSK-01 → REQ-SEC-07) and cross-user leakage (RSK-02 → REQ-SEC-03); ISO 27001 / NIST 800-53; pen-test before GA (REQ-SEC-08) |
| 5 | HSI (Human Systems Integration) | `_cross_cutting/HSI_Plan.md` | at PDR/CDR — the HITL confirmation surface (REQ-F-09, REQ-U-03), WCAG 2.2 AA (REQ-U-02), first-task ≤ 3 min (REQ-U-01), transparency notice (REQ-U-04); HSI is load-bearing because trust = control perception (MOE-06) |
| 6 | Measurement (MOE/MOP/TPM) | `_cross_cutting/TPM_Tracker.md` | every gate — TPM-01 grounding, TPM-02 availability, TPM-03 injection-defense (all `Current: TODO`, owed by SRR/PDR) |
| 7 | Cost / Schedule / EVM | `_cross_cutting/Cost_Schedule_EVM_Tracker.md` | monthly + every gate — run-cost driven by per-task model spend, controlled via tiered routing (REQ-P-04 / DM-01 / MOP-10); ROM at Phase 00, fuller estimate Phase 05 |
| 8 | Quality | `_cross_cutting/QA_Plan.md` | every gate (release-readiness "FCA/PCA" = eval-baseline + audit-completeness REQ-SEC-06 + pen-test REQ-SEC-08 at PRR) |

> **Why HSI and Security/Safety are first-class here.** Aria's value is *trust* (SN-10, MOE-06); a hijacked agent (RSK-01) or an unconfirmed write (RSK-02→MOE-04) destroys it instantly. So the Security, Safety (AI-action), and HSI threads are reviewed at **every** gate, not just at PDR/CDR — the Formal overlay (§6) lives in these three threads.

---

## 9. References & enablement frame

### 9.1 Enablement frame (folded summary from `Project_Enablement_Plan.md`)

| Capability | Tool / Standard | Status | Source |
|---|---|---|---|
| Requirements mgmt | Markdown in Git (SysRS-ARIA, Traceability_Matrix) | Adopted | this project |
| Modeling / MBSE | PlantUML (7-of-9), Requirements_Diagram.puml | Adopted | Conventions §7 |
| Code / CI-CD | TODO: confirm org standard | TBD | Source: acquiring org |
| **Eval harness in CI** | groundedness · action-safety · injection red-team · isolation — gates releases (SCN-07) | **Required** (built Phase 06) | STK-08 |
| Test / observability | TODO: confirm; AI-action observability + drift monitoring required (Phase 10) | TBD | STK-07 |
| Secrets / token vault | encrypted store, short-lived + rotated tokens (REQ-SEC-04, DM-04) | Required | STK-03 |
| Identity | corporate SSO/OIDC + per-user delegated OAuth (REQ-SEC-01/-02) | Required | STK-03 |
| Doc / CM repository | Git; naming `<TYPE>-ARIA-vX.Y`; status per Conventions §6 | Adopted | this project |
| QMS / QA | ISO 9001:2015 (if org-adopted); DPIA per GDPR Art. 35 (REQ-D-01) before GA | Partly TBD | STK-04, STK-05 |
| Lifecycle-model mgmt | owned by Lead SE; tailoring governed per §6 | Adopted | this SEMP |
| Team + funding authorisation | **ATP precondition** | TODO: confirm | Source: acquiring org / STK-02 |

### 9.2 References

- **Conventions** (the single source of truth) — IDs, gates (incl. ATP), T/I/A/D, S1–S4 severities, baselines, status strings, and the §9 canonical citations. *(Cited by name per project rules; not linked across the folder boundary.)*
- Phase 01 — [`../Phase_01_Concept/Concept.md`](../Phase_01_Concept/Concept.md) (mission · STK-01…STK-10 · SN-01…SN-14 · SCN-01…SCN-07 · MOE-01…MOE-07 · RSK-01…RSK-07 · feasibility · lifecycle binding at MCR).
- Phase 02 — [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) (46 REQ · MOP-01…MOP-12 · TPM-01…TPM-03 · modes & states · trace).
- Companion Phase-00 files — `Agreement_Register.md`, `Project_Enablement_Plan.md` (this folder).
- Standards (Conventions §9): ISO/IEC/IEEE 15288:2023 · ISO/IEC/IEEE 29148:2018 · ISO/IEC/IEEE 42010:2022 · IEEE 1012-2016 · ISO/IEC/IEEE 29119-3:2021 · ISO 31000:2018 · ISO 10007:2017 (+ IEEE 828) · ISO 9001:2015 · ISO/IEC 27001:2022 · NIST SP 800-53 Rev. 5 · NIST SP 800-160 · NIST SP 800-88 Rev. 1 (disposal) · INCOSE SE Handbook v5 (2023) · NASA/SP-2016-6105 Rev 2. Domain/identity/privacy: GDPR (Reg. (EU) 2016/679) Arts. 5/15/17/25/30/32/35 · OAuth 2.0 (RFC 6749) · OIDC 1.0 · RFC 9700 (OAuth security BCP). **No DO-178C/ISO 26262/IEC 62304 obligation** — Aria is not safety-of-life (README; Concept §1).

---

## 10. ATP — Authority to Proceed (exit gate)

ATP passes when the agreement is authorised, this SEMP is approved, and funding + team are authorised (Conventions §3).

| Exit-gate item | Status |
|---|---|
| Acquirer & supplier identified, with authorised POCs and decision authority | Met — internal charter; STK-02 acquirer/sponsor, Lead SE supplier; co-accept STK-04 + STK-05 (§1.1, §3) |
| Acquisition vehicle recorded | Met — **internal product charter / self-funded** (§1.1) |
| Scope of agreement (in/out) + supplier deliverable list captured | Met — Concept §3 scope; deliverables mapped to phases (§2) |
| Acceptance criteria with method (T/I/A/D) + authority each | **Proceed-with-actions** — MOE/MOP/TPM acceptance spine defined (§1.1, SysRS §10), but MOE-01/-02/-03/-06 thresholds are `TODO: validate` (owed by STK-02/STK-08 before PRR) |
| Constraint seeds recorded for Phase 02 | Met — already promoted to REQ-C-01/-02/-03, REQ-D-01, REQ-SEC-* (§1.1) |
| **SEMP approved** — org/roles, tailoring, gate & baseline plan, thread plan | Drafted (this doc); awaiting Lead SE + STK-02 sign-off. Roles carry `TODO: name` placeholders (§3) |
| **Project Enablement Plan** — infra/tools, QA/QMS, knowledge mgmt, lifecycle-model mgmt | Drafted frame (§9.1); CI/CD + observability tool choices `TBD` (Source: acquiring org) |
| **Funding & team authorised** | **TODO: confirm — owed by STK-02 (sponsor).** Until confirmed, ATP cannot be a clean Proceed |
| Risk/Opportunity + QA register stubs opened | Stubs to open in `_cross_cutting/` (RSK-01…RSK-07/OPP-01 already enumerated in Concept §8) |

**ATP verdict: Proceed-with-actions.** The deal and the means are framed and the trust-critical risks are owned, but two items must close: **(1)** STK-02 confirms funding + team authorisation; **(2)** the open acceptance thresholds (MOE-01/-02/-03/-06) are committed by STK-02/STK-08 before the PRR acceptance bar is frozen. No blocking gap (no missing signed *external* contract, since this is an internal charter). On closure → re-status to `Baseline (ATP-approved <date>)` and proceed to **MCR** via Phase 01 (already drafted), carrying the MCR conditions in Concept §9 (retire RSK-01/-02/-03, complete DPIA, clear works-council + connected-app terms).
