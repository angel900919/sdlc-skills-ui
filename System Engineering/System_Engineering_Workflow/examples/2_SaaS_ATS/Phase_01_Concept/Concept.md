---
Document: TalentFlow — Concept (Stakeholder Mission · StRS · OpsCon · Feasibility)
Document ID: CONCEPT-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (BRS · StRS · OpsCon)
Status: Draft
Owner: Lead Systems Engineer
---

# TalentFlow — Phase 01 Concept

Problem-space backbone for the worked example. Decides **what / for whom / why** and **whether it is feasible**, ending at the **MCR** gate (Conventions §3). This document is **solution-free**: needs (SN-*) describe required outcomes, never mechanisms. The solution-space spec (REQ-*) is derived in [Phase 02](../Phase_02_Requirements/SysRS.md).

---

## 1. Mission

> TalentFlow gives recruiting teams at growing companies one trustworthy place to **source, track, evaluate, and hire** candidates — moving each candidate through the pipeline faster, while keeping every customer's data strictly isolated and every candidate's privacy provably protected under GDPR/CCPA.

Realises ISO/IEC/IEEE 15288:2023 **Business or Mission Analysis** and the 29148 **BRS**. Target initial release horizon: TODO (set in Phase 00 Agreement).

---

## 2. Stakeholders

| ID | Stakeholder | Role | Primary Concerns | Influence | Interest |
|---|---|---|---|---|---|
| **STK-01** | Recruiter / Hiring Coordinator | Primary daily user; sources, screens, schedules, advances candidates. | Speed, low-friction UX, no data loss, reliable scheduling/email. | Medium | High |
| **STK-02** | Hiring Manager / Interviewer | Reviews candidates, submits scorecards, makes decisions. | Clear candidate view, fast feedback capture, fairness. | Medium | High |
| **STK-03** | Candidate (data subject) | Applies via careers portal; PII held by the system. | Privacy, transparency, erasure rights, application status. | Low | Medium |
| **STK-04** | Customer Admin (tenant owner) | Configures the tenant: SSO, roles, integrations, billing. | Isolation, SSO/SCIM, role control, uptime, audit. | High | High |
| **STK-05** | Customer Security & Privacy Officer | Approves the vendor; owns DPA and audit posture. | SOC 2, ISO 27001, GDPR/CCPA, breach risk, data residency. | High | High |
| **STK-06** | TalentFlow Product / Business Owner | Owns roadmap, pricing, subscription growth. | Conversion, retention, time-to-value, margin. | High | High |
| **STK-07** | TalentFlow SRE / Platform Team | Operates the multi-tenant service. | Availability SLOs, scalability, cost, on-call load, blast radius. | High | High |
| **STK-08** | Integration Partner (Calendar / Email / Job-board / HRIS) | External systems TalentFlow connects to. | Stable APIs, rate limits, auth, data mapping. | Low | Medium |
| **STK-09** | Regulator / Auditor (DPA, SOC 2 auditor) | Enforces privacy law / certifies controls. | Lawful processing, records, erasure proof, control evidence. | High | Low |

### Influence / Interest matrix

```
            High Interest
                |
   Customer Admin (STK-04)      |   Recruiter (STK-01)
   Sec/Privacy Officer (STK-05) |   Hiring Manager (STK-02)
   Product Owner (STK-06)       |
   SRE/Platform (STK-07)        |
--------------------------------+--------------------------------
   Regulator/Auditor (STK-09)   |   Candidate (STK-03)
                                |   Integration Partner (STK-08)
                                |
            Low Interest
   High Influence  ←——————————————→  Low Influence
```

---

## 3. Scope

### In scope
- Recruiter web app: candidate sourcing, pipeline/stage management, search, bulk actions, scorecards, offer tracking.
- Public careers portal: job listings, application submission (candidate PII capture), application status.
- Multi-tenant platform with **strict per-tenant data isolation** and per-tenant configuration.
- Identity: SSO via SAML 2.0, user lifecycle via SCIM 2.0, role-based access.
- Integrations: calendar (interview scheduling), email (templated candidate comms), job-board posting, HRIS (hired-candidate handoff).
- Subscription billing via Stripe (tokenized; no PAN stored).
- Privacy lifecycle: consent capture, retention, GDPR/CCPA right-to-erasure, audit logging.

### Out of scope
- Custom hardware of any kind (pure software).
- Payroll, benefits administration, and post-hire HRIS-of-record functions (handed off to the customer's HRIS).
- AI/ML candidate ranking or automated hiring decisions (deferred; would trigger EEOC/bias-audit obligations — captured as RSK-06).
- On-premise / self-hosted deployment (cloud-only).
- Background-check execution (integration boundary only, if added later).

---

## 4. Chosen lifecycle model + rationale

| Track | Model | Rationale |
|---|---|---|
| Product features (web app, careers portal, integrations) | **Agile** (2-week sprints) | Rapidly evolving scope, frequent customer feedback, no safety-critical late-change cost. |
| Privacy / Security / Tenant-isolation | **Agile + Formal overlay** | Same cadence, but threat modeling, DPIA, isolation proofs, and signed gate evidence are mandatory and reviewed before each release. |
| Scaling | **SAFe (note only)** | Recorded only as a Hybrid scaling note for multi-team coordination — not a peer base model (Conventions / Overview §7). |

**Why not Waterfall/V/Spiral:** requirements evolve continuously with the market; there is no manufactured hardware or HIL forcing a V; risk is retired by continuous deployment and observability rather than Spiral prototyping rounds. The one place rigor is non-negotiable — privacy/security/isolation — is handled by the Formal overlay, not by changing the base model.

---

## 5. Feasibility verdict

Per Conventions / SKILL: Go = evidence exists; Conditional-Go = feasible if a named RSK-* is retired; No-Go = hard blocker.

| Dimension | Verdict | Basis |
|---|---|---|
| **Technical** | **Go** | All capabilities use mature, commodity cloud technology (managed Postgres, queues, object storage, SAML/SCIM libraries, Stripe). No low-TRL items. The hard problem — provable tenant isolation — is a known, solvable design problem (RSK-01). |
| **Market / operational** | **Go** | Large, validated ATS market with active switching; differentiator is provable privacy + isolation for security-conscious mid-market buyers. Adoption gated on time-to-value (RSK-05). Market sizing: TODO (Phase 00 business case). |
| **Regulatory / legal** | **Conditional-Go** | GDPR/CCPA processor obligations, SOC 2, and a Data Processing Agreement are mandatory before enterprise sales. Feasible but conditioned on retiring RSK-02 (privacy/erasure completeness) and standing up the audit program. |
| **Economic** | **Go (ROM)** | Standard SaaS unit economics; infra cost scales with tenants. ROM cost/benefit: TODO (full estimate deferred to Phase 05 COCOMO/LCC). |
| **Overall** | **Conditional-Go** | Proceed to SRR **conditioned on**: (1) tenant-isolation design accepted at PDR (RSK-01); (2) privacy/erasure design and DPIA complete (RSK-02); (3) SOC 2 / audit program funded. No non-waivable No-Go. |

---

## 6. Stakeholder needs — StRS (problem space, solution-free)

Each need states a required **outcome**. The `SN → derive → REQ` step happens in [Phase 02](../Phase_02_Requirements/SysRS.md).

| ID | Need (outcome, solution-free) | Originating STK | Priority | Candidate MOE |
|---|---|---|---|---|
| **SN-01** | Recruiters can move a candidate through every stage of the hiring pipeline with minimal friction and no lost data. | STK-01 | High | Time per pipeline action; data-loss incidents |
| **SN-02** | Hiring managers and interviewers can review candidates and capture structured feedback quickly. | STK-02 | High | Time from interview to recorded scorecard |
| **SN-03** | A customer's users sign in and are provisioned through the customer's own identity provider. | STK-04 | High | % of tenants on SSO; provisioning lead time |
| **SN-04** | Each customer's data is strictly isolated so no tenant can ever access another tenant's data. | STK-04, STK-05 | High | Cross-tenant access incidents (target 0) |
| **SN-05** | Candidates' privacy rights — including erasure — are honored within legal time limits and provably. | STK-03, STK-05, STK-09 | High | % erasure requests completed in time; audit findings |
| **SN-06** | The product is reliably available throughout the working day across customer time zones. | STK-01, STK-04, STK-07 | High | Monthly availability; user-facing downtime minutes |
| **SN-07** | The product stays fast and usable as a customer's recruiting volume and the total tenant base grow. | STK-06, STK-07 | High | p95 latency under load; cost per active tenant |
| **SN-08** | Customers can configure roles and permissions so people see only what their job requires. | STK-04 | Medium | % of actions covered by least-privilege roles |
| **SN-09** | Scheduling, candidate email, job posting, and hired-candidate handoff happen through the customer's existing tools without manual re-keying. | STK-01, STK-08 | Medium | % of scheduling/posting done without manual steps |
| **SN-10** | Customers and auditors can see a trustworthy record of who did what to candidate data and when. | STK-05, STK-09 | High | Audit-log completeness; time to produce evidence |
| **SN-11** | Customers can subscribe, change plan, and be billed accurately without payment-card risk to the vendor. | STK-04, STK-06 | Medium | Billing dispute rate; PCI scope |
| **SN-12** | Candidates and recruiters with disabilities can use the careers portal and app. | STK-03, STK-01 | Medium | WCAG conformance; assistive-tech task success |

### Constraints & assumptions (candidate C-/D- for Phase 02)
- **C:** Cloud-only, no customer-managed hardware; subscription pricing; budget ceiling TODO (Phase 00).
- **C:** Payment handling limited to tokenized Stripe so no cardholder PAN enters TalentFlow (keeps PCI to SAQ-A).
- **D:** GDPR & CCPA/CPRA (TalentFlow is a **processor**; customer is controller — DPA required).
- **D:** SOC 2 Type II and ISO/IEC 27001:2022 control obligations.
- **D:** SAML 2.0, SCIM 2.0, OAuth 2.0/OIDC for identity; WCAG 2.2 AA for accessibility.
- **Assumption:** Customers operate their own IdP (Okta / Entra ID / Google Workspace) and HRIS.

---

## 7. Operational scenarios — OpsCon

### SCN-01 — Recruiter advances a candidate through the pipeline (nominal)
- **Actors:** Recruiter (STK-01).
- **Trigger:** A new application arrives or a recruiter opens a candidate.
- **Main flow:** Recruiter searches/filters within their tenant → opens candidate → reviews profile and attachments → drags candidate to the next stage → triggers a templated email and/or interview scheduling → adds notes.
- **Success outcome:** Candidate is in the correct stage, comms sent, history recorded; no other tenant's data is ever visible.
- **Exercises needs:** SN-01, SN-04, SN-06, SN-09.

### SCN-02 — Customer onboards via SSO and SCIM (nominal)
- **Actors:** Customer Admin (STK-04), Integration Partner IdP (STK-08).
- **Trigger:** A new customer activates their subscription.
- **Main flow:** Admin connects their IdP (SAML) → users sign in via SSO → SCIM provisions/deprovisions users and roles automatically → Admin assigns least-privilege roles.
- **Success outcome:** All tenant users sign in through their IdP; joiners/leavers sync without manual user management.
- **Exercises needs:** SN-03, SN-08, SN-11.

### SCN-03 — Candidate exercises right-to-erasure (privacy thread)
- **Actors:** Candidate (STK-03), Customer Admin (STK-04), Privacy Officer (STK-05), Auditor (STK-09).
- **Trigger:** Candidate submits an erasure request (directly or via the customer).
- **Main flow:** Request captured → identity verified → erasure scheduled within legal window → PII removed/crypto-erased across primary store, search index, backups, and integrated copies → tamper-evident audit record produced.
- **Success outcome:** Candidate PII is irrecoverable within the legal time limit; an auditor can be shown proof.
- **Exercises needs:** SN-05, SN-10, SN-04.

### SCN-04 — Region/dependency degradation (degraded mode)
- **Actors:** SRE / Platform (STK-07), all users.
- **Trigger:** A cloud zone, the database, or an integration (calendar/email/job-board) degrades.
- **Main flow:** Health checks detect degradation → traffic shifts / failover engages → non-critical integrations degrade gracefully (queued, retried) → core pipeline actions remain available read/write → status surfaced to customers.
- **Success outcome:** Core recruiting work continues within SLO; degraded features recover without data loss when the dependency returns.
- **Exercises needs:** SN-06, SN-07, SN-01.

### SCN-05 — Tenant offboarding & data destruction (maintenance / EOL)
- **Actors:** Customer Admin (STK-04), Privacy Officer (STK-05), SRE (STK-07).
- **Trigger:** Subscription ends or customer requests export + deletion.
- **Main flow:** Customer exports their data → grace/retention window per contract → all tenant data (primary, index, backups) is crypto-erased per NIST SP 800-88 → certificate of destruction produced.
- **Success outcome:** Tenant fully offboarded; data provably destroyed; no residual cross-tenant artifacts. (Feeds [Phase 11 Disposal].)
- **Exercises needs:** SN-04, SN-05, SN-10.

### Modes & conditions (preview; enumerated formally in SysRS §9)
- **Nominal:** all tenants and integrations healthy.
- **Degraded:** a dependency or zone impaired; core read/write preserved, ancillary features queued.
- **Maintenance:** controlled deploys, schema migrations, tenant onboarding/offboarding.
- **Read-only / safe:** invoked during incidents to protect data integrity.

### Operational environment
Cloud-native, multi-region SaaS reached over HTTPS from recruiter browsers and candidate devices worldwide; multi-tenant shared platform with logical per-tenant isolation; continuous deployment; 24×7 availability expectation across customer time zones.

---

## 8. Measures of Effectiveness (MOE)

Mission-level, solution-independent (Conventions §2.2). Numbered here in Concept; MOPs/TPMs are derived from REQ in [SysRS §10](../Phase_02_Requirements/SysRS.md#10-measures-of-effectiveness--performance-moe--mop--tpm).

| ID | MOE (how well the mission is met) | Derived from | Target (TODO = measure in pilot) | Unit |
|---|---|---|---|---|
| **MOE-01** | Hiring-pipeline velocity — time for a recruiter to advance a candidate one stage end-to-end. | SN-01, SN-02 | TODO (baseline vs. incumbent ATS) | seconds / action |
| **MOE-02** | Tenant isolation integrity — confirmed cross-tenant data-access incidents. | SN-04 | 0 | incidents / period |
| **MOE-03** | Privacy-rights fulfillment — erasure requests completed within the legal window. | SN-05 | 100% | % |
| **MOE-04** | Service availability experienced by users during working hours. | SN-06 | ≥ 99.9% | % monthly |
| **MOE-05** | Scalability headroom — p95 latency held within target as tenant/volume grows. | SN-07 | within target at TODO× current load | ratio |
| **MOE-06** | Audit readiness — time to produce complete access/erasure evidence on request. | SN-10 | TODO | hours |
| **MOE-07** | Time-to-value — time from tenant signup to first candidate advanced via SSO. | SN-03, SN-01 | TODO | days |

---

## 9. Top risks (seed the living register)

`Likelihood × Impact` on 1–5; band per Conventions §5.3. Handed to the Risk thread and reviewed at every gate.

| ID | Description | L | I | Band | Mitigation |
|---|---|---|---|---|---|
| **RSK-01** | Tenant-isolation defect lets one tenant read/write another's data (catastrophic trust + legal failure). | 2 | 5 | High | Isolation design reviewed at PDR; tenant-scoped authZ on every access; isolation tests in CI; pen-test before GA. (→ SN-04, REQ-SEC-01) |
| **RSK-02** | Erasure is incomplete — PII survives in search index, backups, or integrated copies, breaching GDPR/CCPA. | 3 | 5 | Critical | Erasure design + DPIA in PDR; cascade across all stores; crypto-erase of backups; audit proof. (→ SN-05, REQ-SEC-08) |
| **RSK-03** | Availability/latency SLOs missed under peak multi-tenant load ("noisy neighbor"). | 3 | 4 | High | Capacity model + load tests as TPMs; per-tenant rate limits/quotas; autoscaling; error budgets. (→ SN-06/07) |
| **RSK-04** | Integration breakage (calendar/email/job-board/HRIS API or auth change) blocks recruiter workflows. | 4 | 3 | High | Contract tests against partner APIs; graceful degradation (queue + retry); partner-change monitoring. (→ SN-09) |
| **RSK-05** | Slow time-to-value (complex SSO/SCIM/import setup) stalls adoption and retention. | 3 | 3 | Medium | Guided onboarding; tested SAML/SCIM connectors; data-import tooling; measure MOE-07. (→ SN-03) |
| **RSK-06** | Future AI candidate-ranking (if added) triggers bias-audit / EEOC and new regulatory obligations. | 2 | 4 | Medium | Out of scope for v1; gate any ML feature through a fairness/DPIA review before commitment. (→ scope §3) |

Upside: **OPP-01** — provable isolation + privacy posture becomes a sales differentiator for security-conscious mid-market buyers (tie to MOE-02/03 evidence).

---

## 10. MCR gate

Gate: **MCR (Mission Concept Review) → SRR-entry** (Conventions §3).

- [x] Mission stated and ready for stakeholder approval.
- [x] ≥ 5 stakeholders captured (STK-01…STK-09) with influence/interest.
- [x] StRS complete — every SN-* solution-free, prioritised, traced to a STK-*.
- [x] OpsCon complete — every high-priority SN-* exercised by ≥ 1 SCN-*; degraded + maintenance/EOL threads covered (SCN-04, SCN-05).
- [x] Feasibility verdicted on all four dimensions — overall **Conditional-Go**, no non-waivable No-Go.
- [x] Lifecycle model chosen and justified per track (Agile + Formal overlay; SAFe note only).
- [x] ≥ 4 risks logged (RSK-01…RSK-06) with L/I/band and mitigation, handed to the Risk thread.
- [ ] Schedule anchored to MCR→SRR — **TODO** (owed from Phase 00 Agreement; horizon not yet set).

**MCR recommendation:** **Proceed-with-actions** — advance to Phase 02 (SRR) carrying the three Conditional-Go conditions (RSK-01 isolation design, RSK-02 erasure/DPIA, SOC 2 program) as explicit entry conditions to PDR.
