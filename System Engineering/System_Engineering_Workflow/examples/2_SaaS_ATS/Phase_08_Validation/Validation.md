---
Document: TalentFlow — Validation (Test Plan + TC-VAL Cases)
Document ID: TP-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 29119-3:2021
Status: Draft
Owner: Validation / Test Lead
---

# TalentFlow — Phase 08 Validation

Proves **"did we build the right thing?"** — that the integrated TalentFlow service meets the needs of recruiters, hiring managers, customer admins, candidates, the security/privacy officer, the SRE/platform team, and the regulator/auditor **in real conditions**, evidencing the [`SysRS`](../Phase_02_Requirements/SysRS.md) at system level against the MOE/MOP/TPM targets. Exit gate: **PRR (Production Readiness Review)** (Conventions §3).

This document conforms to [`../../05_Conventions.md`](../../../05_Conventions.md) for all IDs (`TC-VAL-<nn>`, `TP-<SLUG>-01`), the PRR gate, T/I/A/D methods, S1–S4 severity (§5.1), priority (§5.2), risk scoring (§5.3), status strings (§6), and standard citations (§9). It **cross-references — never restates** — those definitions.

> **Validation ≠ Verification.** TC-VER-* cases (owed by [Phase 07](../Phase_07_Verification/), `TC-VER-TBD` until assigned) prove the spec is met on instrumented measurements ("built it right"). The TC-VAL-* cases here prove a **stakeholder/operator/regulator outcome** in the real environment ("built the right thing"). A 100%-verified matrix is *necessary but not sufficient* for PRR. Many REQs need both (e.g., REQ-P-01 is measured by a TC-VER and *experienced* by a recruiter in TC-VAL-02 / the pilot).

---

# Part A — Test Plan (TP-TALENTFLOW-01)

Plan ID: **TP-TALENTFLOW-01** · Standard: ISO/IEC/IEEE 29119-3:2021 (supersedes IEEE 829) · traced to [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md).

## 1. Objective

Validate that TalentFlow, integrated end-to-end and running on the **CDR-frozen product baseline**, meets the needs of its primary stakeholders (STK-01 Recruiter, STK-02 Hiring Manager, STK-03 Candidate, STK-04 Customer Admin, STK-05 Security/Privacy Officer, STK-07 SRE, STK-09 Regulator/Auditor) in real-world, multi-tenant conditions — evidencing the SysRS at system level against the **MOE** set ([Concept §8](../Phase_01_Concept/Concept.md#8-measures-of-effectiveness-moe)) and the **MOP/TPM** targets ([SysRS §10](../Phase_02_Requirements/SysRS.md#10-measures-of-effectiveness--performance-moe--mop--tpm)). The non-negotiable validation outcomes are **MOE-02 = 0 cross-tenant incidents** and **MOE-03 = 100% erasure within the legal window**.

## 2. Scope

| In scope | Out of scope |
|---|---|
| Recruiter web app: pipeline/stage management, search, scorecards, bulk actions (SCN-01) | AI/ML candidate ranking (out of scope per Concept §3; RSK-06) |
| Public careers portal: application capture, status, WCAG 2.2 AA (SCN-01) | On-premise / self-hosted deployment (REQ-C-01 — cloud-only) |
| Multi-tenant platform + Tenant Isolation Layer (SCN-01, SCN-03) | Customer's IdP, HRIS, calendar/email/job-board partner systems themselves (boundary only; STK-08) |
| Identity & SSO Gateway: SAML 2.0 SSO + SCIM 2.0 (SCN-02) | Cardholder-data lifecycle — PAN never touches TalentFlow (REQ-C-02, Stripe-managed, SAQ-A) |
| Integrations: calendar, email, job-board, HRIS — queue-and-retry degraded behaviour (SCN-01, SCN-04) | Payroll / benefits / HRIS-of-record functions (handed to customer HRIS) |
| Privacy lifecycle: consent, export (Art. 15), erasure (Art. 17), audit log (SCN-03, SCN-05) | Background-check execution (integration boundary only, if later added) |
| Subscription billing via tokenized Stripe (SCN-02) | TalentFlow-internal infra cost reporting (Phase 10 ops) |
| Degraded / failover behaviour during AZ or dependency loss (SCN-04) | Disposal-stage crypto-erase **certificate** issuance proper — validated here for tenant offboarding flow; archival/EOL formalised in [Phase 11](../) (`TODO: owed by Phase 11`) |
| Tenant offboarding + crypto-erase flow (SCN-05) | — |

Anything deferred is marked `TODO: <owed>`; nothing is silently dropped.

## 3. Test Approach

Layer × manual/automated. The unit→load rows reuse the Phase 06 CI/CD pipeline and the Phase 07 verification tooling — validation **adds the top two rows** (real-user UAT/pilot + regulatory/auditor sign-off) that cannot be automated.

| Layer | Manual | Automated | Tool |
|---|---|---|---|
| Unit | — | 100% | `TODO: owed by Phase 06/07` (e.g. Jest/Vitest, pytest) |
| Integration / API | — | 100% | Postman + Newman, Schemathesis (OpenAPI fuzz) `TODO: confirm Phase 06` |
| Identity conformance (SAML/SCIM) | 20% | 80% | SAML test IdP (e.g. SimpleSAMLphp / Okta dev), SCIM 2.0 compliance suite |
| Tenant-isolation assertions | — | 100% | Cross-tenant authZ test harness in CI (RSK-01 mitigation) |
| UI E2E | 30% | 70% | Playwright (recruiter app + careers portal) |
| Accessibility | 40% | 60% | axe-core automated + manual NVDA/VoiceOver + keyboard-only walkthrough |
| Load / noisy-neighbour | — | 100% | k6 / Locust, per-tenant load profiles |
| Security / pen-test (OAT) | 60% | 40% | OWASP ZAP, Burp Suite, CodeQL, manual pen-test (RSK-01) |
| **UAT (real recruiters/hiring managers)** | 100% | — | In-app survey, ticket log, product analytics, stopwatch |
| **OAT (SRE run/monitor/incident)** | 70% | 30% | Runbook drill, on-call dry-run, chaos/failover injection |
| **Regulatory acceptance** | 100% | — | DPA review, SOC 2 / ISO 27001 auditor evidence pack, DPIA sign-off |

## 4. Test Environment

A staging-cloud run is **integration, not validation** — validation needs **real users in a real environment**. The pilot/UAT rows below use real customer tenants.

| Env | Composition |
|---|---|
| **Staging cloud** | Identical IaC to prod; isolated VPC; ≥ 3 synthetic tenants with seeded candidates; partner sandboxes (SAML test IdP, Stripe test mode, calendar/email/job-board/HRIS sandboxes). Used for E2E, isolation, load, security automation — **not** an acceptance environment. |
| **Pre-prod cloud** | Prod-like, multi-AZ, real KMS per-tenant keys; limited closed beta tenants; Stripe test mode; chaos-engineering enabled for failover drills (SCN-04). |
| **Pilot tenants (real-world)** | **3–5 real customer tenants** (mid-market, security-conscious; ties to OPP-01) running live recruiting for **30 days** on the release candidate, with at least one tenant on a high-volume recruiting cycle and one on a constrained-bandwidth region. Real recruiters, real candidates, real IdP/HRIS. |
| **Auditor evidence environment** | Read-only audit-log + control-evidence access provisioned for the customer Security/Privacy Officer (STK-05) and external SOC 2 / DPA auditor (STK-09); DPIA artifacts attached. |

## 5. Acceptance Types

| Type | Applies? | How it is used in TalentFlow |
|---|---|---|
| **UAT** — User Acceptance | **Yes** | Real recruiters (STK-01) and hiring managers (STK-02) confirm the pipeline, search, scorecards, scheduling, and email meet the business need in their own workflow (SCN-01). → TC-VAL-01…04, 12. |
| **OAT** — Operational Acceptance | **Yes** | SRE/Platform (STK-07) validate run/monitor/incident-response and failover in pre-prod (SCN-04), plus a security pen-test pass. → TC-VAL-08, 09, 11. |
| **FAT** — Factory Acceptance | **Tailored out:** no manufacturer site and no installed hardware — pure SaaS. The closest analogue (release-candidate sign-off in staging/CI before promotion) is a Phase 07 verification + Phase 06 CI activity, not a witnessed factory test. |
| **SAT** — Site Acceptance | **Tailored out:** no on-site installation (REQ-C-01 cloud-only). The closest analogue — **per-tenant onboarding acceptance** at the customer's IdP/HRIS boundary (SSO + SCIM working against the customer's *own* identity provider) — **is** validated and carried as a UAT/OAT hybrid in TC-VAL-05 (tenant onboarding) so the install-environment risk is not lost. |
| **Regulatory / Compliance** | **Yes** | External auditor / DPA review confirms GDPR/CCPA processor obligations (REQ-D-01), SOC 2 Type II + ISO 27001 controls (REQ-D-02), erasure proof (REQ-SEC-08), and audit-log completeness (REQ-SEC-04). → TC-VAL-06, 07, 10. |
| **Pilot / Beta** | **Yes** | 3–5 real customer tenants, 30 days live, before GA — the validation backbone for MOE-01/04/05/07. → TC-VAL-12 plus continuous telemetry feeding all MOPs. |
| **Simulation / Prototyping** | **Yes (narrow)** | Used only where a real event is too rare/risky to stage on live tenants — namely **AZ failover** (chaos injection in pre-prod, TC-VAL-09) and a **backup-restore-then-verify-erasure** drill against restored backups (TC-VAL-07). |
| **A/B testing** | **Tailored out for PRR:** no ambiguous UX fork is on the v1 critical path; deferred to Phase 10 continuous-validation as an ops experiment (`TODO: owed by Phase 10` if an onboarding-flow A/B is later run for MOE-07). |

## 6. Risk Assessment (test-specific)

Scored `Likelihood × Impact`, 1–5 each, band per Conventions §5.3. Seeded from the [Concept §9](../Phase_01_Concept/Concept.md#9-top-risks-seed-the-living-register) register; validation findings raise new `RSK-*` back to the Risk thread.

| Risk | L×I | Band | Mitigation |
|---|---|---|---|
| Cross-tenant isolation defect not surfaced because test tenants share too little realistic data (RSK-01). | 2×5 | High | Adversarial isolation suite with ID-tampering, IDOR, and forged-JWT-tenant-claim cases (TC-VAL-08); ≥ 3 tenants with overlapping candidate emails/names; pen-test before GA. |
| Erasure looks complete in primary store but PII survives in search index / backups / integrated copies (RSK-02). | 3×5 | Critical | TC-VAL-06 cascades across all four stores; TC-VAL-07 restores a backup taken *before* erasure and proves the record is crypto-erased/unrecoverable; auditor witnesses (STK-09). |
| Pilot tenants too few / too similar to represent the tenant base (sampling bias). | 3×3 | Medium | Pilot cohort spans high-volume, constrained-bandwidth, and strict-privacy profiles; supplement with synthetic load (TC-VAL-11) for tenant counts no pilot can reach. |
| Noisy-neighbour effect invisible at pilot scale (RSK-03). | 3×4 | High | TC-VAL-11 generates abusive single-tenant load against a co-located victim tenant and asserts the victim's p95 stays within MOP-05 threshold. |
| Integration partner sandbox behaves differently from production (RSK-04). | 4×3 | High | Contract tests against partner APIs in CI; at least one pilot tenant exercises *production* calendar/email/HRIS; degraded-mode case TC-VAL-04 forces partner outage. |
| Real users withhold candid feedback / low UAT participation. | 3×3 | Medium | Recruit ≥ 20 recruiters across pilot tenants; incentivise survey; instrument analytics so MOE-01/07 are measured even with low survey return. |
| SCIM/SSO works against test IdP but fails against the customer's real Okta/Entra/Google config (the "SAT-gap"). | 3×4 | High | TC-VAL-05 runs against each pilot tenant's *own* IdP, not the test IdP; per-tenant onboarding checklist witnessed by STK-04. |

## 7. Pass / Fail Criteria

Numeric, set in advance, tied to the project's own MOE/MOP/TPM set. The **gate floor is PRR** (Conventions §3): *validation ≥ targets, **zero S1**, FCA/PCA done.* Defect severity uses the single `S1`–`S4` taxonomy in Conventions §5.1 (an S1 here = cross-tenant data exposure, candidate data loss, erasure failure, or total loss of the pipeline with no workaround).

| # | Criterion | Source target | Floor (threshold) |
|---|---|---|---|
| 1 | **Zero confirmed cross-tenant data-access incidents** across all isolation/UAT/pilot runs. | MOE-02 / MOP-11 (REQ-SEC-01) | **0** (any > 0 is **S1 → PRR blocker**) |
| 2 | **100% of erasure requests** complete across all four stores within the legal window, with auditable proof. | MOE-03 / MOP-13 / TPM-04 (REQ-SEC-08) | 100% ≤ legal limit (any miss is **S1**) |
| 3 | Single-stage candidate advancement: ≥ 95% of recruiters complete in ≤ 10 s (p95) task time. | MOP-04 (REQ-U-01) | p95 ≤ 10 s; ≥ 95% success |
| 4 | Pilot-experienced p95 candidate read latency within target; noisy-neighbour victim p95 within threshold. | MOP-05 / TPM-02 (REQ-P-01, REQ-P-04) | p95 ≤ 400 ms |
| 5 | Pilot availability over the 30-day window meets the SLO. | MOE-04 / MOP-09 / TPM-01 (REQ-O-01) | ≥ 99.9% monthly |
| 6 | Failover during AZ loss preserves core read/write; RTO/RPO met; no data loss. | MOP-10 (REQ-O-02) | RTO ≤ 15 min, RPO ≤ 5 min |
| 7 | SCIM provisioning propagation against the tenant's real IdP. | MOP-07 (REQ-INT-02) | ≤ 300 s |
| 8 | Integration degraded-mode retry: 100% of queued actions delivered, no data loss, user informed. | MOP-08 (REQ-INT-04, REQ-U-03) | ≥ 99.9% |
| 9 | Audit log captures 100% of PII-access events; auditor can produce evidence on request. | MOP-12 (REQ-SEC-04, REQ-D-02) | 100% |
| 10 | Careers portal + recruiter app pass WCAG 2.2 AA on the audited screens (keyboard + screen-reader). | REQ-U-02 (SN-12) | 0 AA-level blockers |
| 11 | Regulatory: DPA executable, DPIA signed, SOC 2 control evidence retrievable; auditor letter obtained. | REQ-D-01, REQ-D-02 | Auditor/Privacy-Officer sign-off |
| 12 | **FCA/PCA complete** against the CDR-frozen product baseline; defect log triaged. | Conventions §3 PRR | FCA + PCA signed; **zero S1** |
| 13 | Pilot user acceptance: recruiter time-to-value and satisfaction. | MOE-01, MOE-07 | `TODO: set baseline in pilot` (e.g. NPS > 30; ≥ 90% would re-adopt) |

**Defect handling:** any open **S1** blocks PRR. A deferrable **S2** requires an explicit CCB waiver recorded as a `CR-<nn>` (Phase 09) referenced here as `TODO: CR-TBD`. S3/S4 are scheduled into a post-GA release.

## 8. Roles & Responsibilities

| Role | Responsibility |
|---|---|
| **Validation / Test Lead** (this doc owner) | Owns TP-TALENTFLOW-01; chairs PRR; approves release-to-GA. |
| **QA Engineering** | E2E, isolation, load, accessibility, integration automation; defect triage to S1–S4. |
| **SRE / Platform (STK-07)** | OAT: failover drills, on-call dry-run, monitoring/alerting validation, capacity sign-off. |
| **Security Engineer** | Pen-test pass (OAT), THR-* mitigation validation, isolation red-team. |
| **Privacy Officer / DPO (TalentFlow)** | Erasure/export validation oversight, DPIA, GDPR/CCPA evidence; liaises with customer STK-05. |
| **Customer pilot champions (STK-01/02/04)** | Run real recruiting on pilot tenants; provide UAT feedback and sign onboarding acceptance. |
| **External auditor / DPA reviewer (STK-09)** | Regulatory acceptance: SOC 2 / ISO 27001 control evidence, DPA, erasure proof sign-off. |

## 9. Schedule

Anchored to the Phase 06 increments (INC-* `TODO: confirm in Phase 06`) and the gate ladder **TRR → pilot/UAT/OAT/regulatory → PRR** (Conventions §3). Calendar dates are `TODO:` until the Phase 00 Agreement sets the horizon.

| Period | Validation activity | Gate |
|---|---|---|
| After Phase 07 100% coverage | TRR sign-off; validation env stand-up; pilot tenants contracted; DPA/DPIA drafts circulated. | **TRR** |
| Validation window W1–W2 | Isolation red-team (TC-VAL-08), erasure cascade + backup-restore (TC-VAL-06/07), SSO/SCIM onboarding (TC-VAL-05), accessibility (TC-VAL-10), failover drill (TC-VAL-09), noisy-neighbour load (TC-VAL-11). | — |
| Validation window W3–W6 | **30-day pilot** on real tenants (TC-VAL-01…04, 12); UAT surveys + analytics; OAT on-call dry-run; regulatory evidence pack assembled. | — |
| Validation close | Defect triage to zero-S1; FCA/PCA; auditor letter; TPM margins confirmed; PRR. | **PRR** → GA (Phase 10) |

## 10. Test Cases (counts)

| Suite | Count | Location |
|---|---|---|
| **TC-VER-*** (built it right) | `TODO: N owed by Phase 07` — `TC-VER-TBD` until assigned | [`../Phase_07_Verification/`](../Phase_07_Verification/) |
| **TC-VAL-*** (built the right thing) | **12** (TC-VAL-01 … TC-VAL-12) | Part B below |

Coverage summary (full matrix at §C): every primary stakeholder scenario (SCN-01…SCN-05) and every `REQ-U-*` (REQ-U-01/02/03) links to ≥ 1 TC-VAL; the two non-negotiable MOEs (MOE-02 isolation, MOE-03 erasure) each have a dedicated case plus an adversarial/regulatory case. TalentFlow has **no `HAZ-*`** (Safety class tailored out per [SysRS §8](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements)), so no safety TC-VAL is owed.

---

# Part B — Validation Test Cases (TC-VAL-*)

Every case is **independent and re-runnable**: Preconditions re-establish all needed state (role, tenant, env, seed data); no case depends on another's output. `Actual Result` and `Pass/Fail Status` are **left blank until executed** (Conventions / 29119-3 pre- vs post-execution split). Priority per Conventions §5.2; Type uses the `Validation (<facet>)` enum.

---

### TC-VAL-01 — Recruiter advances a candidate one stage in the real workflow (UAT)

| Field | Value |
|---|---|
| Objective | A trained recruiter advances a candidate one pipeline stage end-to-end within their own daily workflow, with comms sent and history recorded, and never sees another tenant's data. |
| Linked REQs / SN | REQ-F-01, REQ-U-01, REQ-P-02, REQ-F-05, REQ-SEC-01, SN-01, SN-04 · SCN-01 · MOP-01, MOP-04 |
| Priority | High |
| Type | Validation (UAT) |
| Preconditions | Pilot tenant T-A live; ≥ 20 trained recruiters across pilot tenants; recruiter role provisioned via the tenant's IdP; tenant T-A seeded with ≥ 50 real candidates; email integration connected (production sandbox); stopwatch + analytics armed. Self-contained — no prior case needed. |
| Steps | 1. Recruiter opens the app and searches/filters within tenant T-A for a candidate. *Expected:* only T-A candidates appear; results return p95 ≤ 400 ms (felt as instant). <br> 2. Recruiter opens the candidate and reviews profile + attachments. *Expected:* full record loads; no other-tenant data anywhere on screen. <br> 3. Recruiter advances the candidate to the adjacent stage. *Expected:* stage change persists in the same request; actor, timestamp, prior/new stage recorded on the timeline (REQ-F-01). <br> 4. Recruiter triggers the tenant-templated email. *Expected:* send status recorded against the candidate timeline (REQ-F-05). <br> 5. Time the whole open→advance→confirm interaction across ≥ 20 recruiters. *Expected:* ≤ 3 user-visible interactions; p95 task time ≤ 10 s. |
| Final Expected Outcome | ≥ 95% of recruiters complete single-stage advancement in ≤ 10 s (p95, MOP-04); transition persisted with full history (REQ-F-01); zero cross-tenant visibility (REQ-SEC-01). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed: Pass / Fail / Blocked)_ |
| Defect refs | _(S1–S4 link if Fail; Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-01/ |
| Tools | Stopwatch, product analytics, candidate timeline export, in-app survey. |

---

### TC-VAL-02 — Hiring manager reviews and scores a candidate (UAT)

| Field | Value |
|---|---|
| Objective | A hiring manager reviews an assigned candidate and submits a structured scorecard quickly, capturing fair, structured feedback. |
| Linked REQs / SN | REQ-F-03, REQ-SEC-02, SN-02, SN-08 · SCN-01 |
| Priority | High |
| Type | Validation (UAT) |
| Preconditions | Pilot tenant T-A live; hiring-manager role (least-privilege) provisioned via IdP; ≥ 10 hiring managers recruited; a candidate assigned to each with an interview just completed; scorecard template configured for the tenant. Self-contained. |
| Steps | 1. Hiring manager opens the assigned candidate. *Expected:* sees only candidate review fields permitted by their role (REQ-SEC-02); cannot reach admin or billing screens. <br> 2. Manager enters per-criterion ratings + free-text. *Expected:* form validates; required criteria enforced. <br> 3. Manager submits. *Expected:* success is acknowledged only after the scorecard is persisted (REQ-F-03); it appears on the candidate timeline immediately. <br> 4. Measure interview-end → scorecard-recorded time across ≥ 10 managers. *Expected:* captured for MOE-02 (Concept) / time-to-scorecard baseline. |
| Final Expected Outcome | ≥ 90% of hiring managers submit a complete scorecard with no role-permission errors and no failed-but-acknowledged saves (REQ-F-03, REQ-SEC-02). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-02/ |
| Tools | Analytics, stopwatch, role-permission audit, in-app survey. |

---

### TC-VAL-03 — Candidate applies via the careers portal (UAT)

| Field | Value |
|---|---|
| Objective | A candidate (data subject) submits an application through the public careers portal and the record lands in the correct tenant promptly. |
| Linked REQs / SN | REQ-F-04, REQ-SEC-06, REQ-U-02, SN-01, SN-05, SN-12 · SCN-01 · MOP-03 |
| Priority | High |
| Type | Validation (UAT) |
| Preconditions | Pilot tenant T-A has ≥ 1 published job opening; public careers portal URL live; ≥ 15 real candidates (incl. ≥ 3 using assistive tech) recruited; consent text configured. Self-contained. |
| Steps | 1. Candidate opens the job listing on the public portal. *Expected:* listing renders; consent/lawful-basis notice presented (REQ-SEC-06). <br> 2. Candidate completes the application, attaches a résumé, and consents. *Expected:* declared PII fields + attachment accepted; consent + lawful basis recorded. <br> 3. Candidate submits. *Expected:* candidate record created in tenant T-A within 5 s; confirmation + status shown (REQ-F-04). <br> 4. Assistive-tech candidates complete the same flow keyboard-only / screen-reader. *Expected:* all controls labelled and reachable (REQ-U-02). |
| Final Expected Outcome | ≥ 95% of candidates create a record in ≤ 5 s (MOP-03) in the correct tenant with consent recorded (REQ-SEC-06); assistive-tech users complete with no AA blockers (REQ-U-02). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-03/ |
| Tools | Stopwatch, analytics, NVDA/VoiceOver session recording, consent-log export. |

---

### TC-VAL-04 — Recruiter works through an integration outage (UAT · degraded mode)

| Field | Value |
|---|---|
| Objective | A recruiter keeps doing core pipeline work while a calendar/email/job-board partner is down, is told the feature is queued, and queued actions complete with no data loss when the partner recovers. |
| Linked REQs / SN | REQ-F-05, REQ-F-06, REQ-U-03, REQ-INT-04, REQ-F-01, SN-09, SN-06, SN-01 · SCN-04 · MOP-08 |
| Priority | High |
| Type | Validation (UAT) |
| Preconditions | Pre-prod or pilot tenant with calendar + email integrations connected; ability to force a partner outage (sandbox kill-switch or production partner maintenance window); recruiter role provisioned; candidate seeded. Self-contained. |
| Steps | 1. Force the email + calendar partner endpoints to fail (outage injected). *Expected:* health checks flip the affected integrations to Degraded; core pipeline stays read/write (SCN-04). <br> 2. Recruiter advances a candidate and triggers a templated email + schedules an interview. *Expected:* the core advance succeeds; the email/calendar actions are queued, and the UI tells the recruiter they are queued — the core action does **not** fail silently (REQ-U-03). <br> 3. Restore the partner endpoints. *Expected:* queued email + calendar events are delivered via retry; statuses reconcile on the candidate timeline (REQ-INT-04, REQ-F-05/06). <br> 4. Reconcile counts. *Expected:* 100% of queued actions delivered; zero lost. |
| Final Expected Outcome | Core pipeline work continues during the outage; 100% of queued integration actions deliver on recovery with no data loss (MOP-08, REQ-INT-04) and the user was clearly informed of degraded state (REQ-U-03). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-04/ |
| Tools | Partner sandbox kill-switch, queue dashboard, candidate timeline export. |

---

### TC-VAL-05 — Customer onboards via their OWN IdP: SSO + SCIM (UAT/OAT · the SAT-gap case)

| Field | Value |
|---|---|
| Objective | A customer admin connects the tenant to the customer's **own** identity provider so users sign in via SSO and are provisioned/deprovisioned via SCIM, with least-privilege roles — validating the install-environment boundary that no test IdP can. |
| Linked REQs / SN | REQ-INT-01, REQ-INT-02, REQ-SEC-02, REQ-SEC-05, SN-03, SN-08 · SCN-02 · MOP-07 |
| Priority | High |
| Type | Validation (UAT/OAT) |
| Preconditions | A pilot tenant whose customer uses a real Okta / Entra ID / Google Workspace IdP (not the test IdP); customer admin (STK-04) available; SCIM token issued; onboarding checklist ready. Self-contained per tenant. |
| Steps | 1. Admin connects the tenant's real IdP via SAML 2.0. *Expected:* metadata exchange succeeds; a test SSO login is accepted; an assertion with bad signature/audience/expiry is **rejected** (REQ-INT-01). <br> 2. Admin enables SCIM provisioning from the IdP. *Expected:* creating a user in the IdP provisions a TalentFlow account ≤ 300 s; role mapping applied (REQ-INT-02, MOP-07). <br> 3. Admin assigns least-privilege roles; a recruiter and a hiring-manager are provisioned. *Expected:* each sees only role-permitted actions (REQ-SEC-02). <br> 4. Deactivate a user in the IdP. *Expected:* SCIM deprovisions the TalentFlow account ≤ 300 s; the user can no longer sign in. <br> 5. Perform a tenant-admin action where the IdP does not assert MFA. *Expected:* TalentFlow enforces step-up MFA (REQ-SEC-05). |
| Final Expected Outcome | Against the customer's real IdP, SSO accepts valid / rejects invalid assertions, SCIM provisions and deprovisions within MOP-07 (≤ 300 s), least-privilege holds, and admin MFA is enforced when not IdP-asserted (REQ-INT-01/02, REQ-SEC-02/05). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-05/ |
| Tools | Customer IdP admin console, SCIM logs, onboarding checklist, MFA challenge capture. |

---

### TC-VAL-06 — Candidate right-to-erasure cascades across ALL stores (Regulatory)

| Field | Value |
|---|---|
| Objective | An authorized erasure request removes a candidate's PII from the primary store, search index, object storage, and backups within the legal window, with auditable proof an auditor accepts. |
| Linked REQs / SN | REQ-SEC-08, REQ-SEC-04, REQ-O-04, REQ-D-01, SN-05, SN-10, SN-04 · SCN-03 · MOP-13, TPM-04 |
| Priority | High |
| Type | Validation (Regulatory) |
| Preconditions | Pilot/pre-prod tenant T-A; a candidate record with PII present in primary store, search index, object storage (résumé attachment), and at least one taken backup; Privacy Officer (STK-05) + external auditor (STK-09) witnessing; erasure request submitted and identity verified. Self-contained. |
| Steps | 1. Submit an authorized erasure request and verify the requester's identity. *Expected:* request captured with timestamp and lawful basis; audit event written (REQ-SEC-04). <br> 2. Trigger erasure execution. *Expected:* PII removed/crypto-erased in primary store AND search index AND object storage within the legal window (REQ-SEC-08). <br> 3. Search the index for the candidate's name/email across the tenant. *Expected:* zero PII results returned. <br> 4. Attempt to retrieve the candidate's attachment by its prior object key. *Expected:* not retrievable (deleted / key crypto-erased). <br> 5. Confirm non-PII audit metadata is retained lawfully (REQ-SEC-04 vs REQ-O-04). *Expected:* the *fact and proof* of erasure persists; the *PII* does not. <br> 6. Generate the completion proof and show the auditor. *Expected:* tamper-evident erasure certificate produced (REQ-SEC-08). |
| Final Expected Outcome | Candidate PII is irrecoverable across all four stores within the legal window (100%, MOP-13 / TPM-04), with auditable proof accepted by STK-09 (REQ-SEC-08, REQ-D-01). Any surviving PII is **S1**. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1 — surviving PII = S1)_ |
| Evidence path | validation-evidence/TC-VAL-06/ |
| Tools | Erasure-job logs, search-index query, object-store probe, erasure certificate, auditor sign-off sheet. |

---

### TC-VAL-07 — Erasure survives a backup restore (Regulatory · Simulation)

| Field | Value |
|---|---|
| Objective | Prove that a candidate erased before a backup was taken **cannot reappear** if that backup is later restored — closing the RSK-02 "PII survives in backups" gap that no live test exposes. |
| Linked REQs / SN | REQ-SEC-08, REQ-O-02, REQ-D-01, SN-05, SN-04 · SCN-03, SCN-05 · MOP-13, TPM-04 |
| Priority | High |
| Type | Validation (Simulation) |
| Preconditions | Isolated pre-prod restore environment; a candidate whose PII exists in a backup taken at time T0; an authorized erasure executed at time T1 > T0 (per TC-VAL-06 mechanism, re-established here, not reused); per-tenant crypto-erase key management in place. Self-contained. |
| Steps | 1. Confirm the candidate's PII is present in the T0 backup set (pre-condition check, not relying on any other case). *Expected:* PII present at T0. <br> 2. Execute an authorized erasure at T1. *Expected:* primary/index/object PII erased; per-record/per-tenant key crypto-erased (REQ-SEC-08). <br> 3. Restore the T0 backup into the isolated environment. *Expected:* restore completes (exercises REQ-O-02 restore path). <br> 4. Attempt to read the erased candidate's PII from the restored data. *Expected:* PII is unrecoverable — crypto-erased key means ciphertext cannot be decrypted (REQ-SEC-08). |
| Final Expected Outcome | After restoring a pre-erasure backup, the erased candidate's PII remains unrecoverable (MOP-13 / TPM-04), proving erasure is durable across backups (REQ-SEC-08). Recoverable PII is **S1**. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1 — recoverable PII = S1)_ |
| Evidence path | validation-evidence/TC-VAL-07/ |
| Tools | Backup/restore tooling, KMS key-state log, ciphertext decrypt-attempt harness, auditor sign-off. |

---

### TC-VAL-08 — Adversarial cross-tenant isolation red-team (OAT · security)

| Field | Value |
|---|---|
| Objective | A security tester attempting cross-tenant access by every known vector (IDOR, tampered tenant claim, forged token, mismatched object key) is blocked on every path. |
| Linked REQs / SN | REQ-SEC-01, REQ-SEC-03, REQ-C-01, REQ-SEC-04, SN-04 · SCN-01 · MOP-11 |
| Priority | High |
| Type | Validation (OAT) |
| Preconditions | Staging/pre-prod with ≥ 3 tenants (T-A, T-B, T-C) holding overlapping candidate names/emails; a valid session for T-A only; security tester with the threat-model (`THR-*` `TODO: owed by Security thread`); request-interception proxy. Self-contained. |
| Steps | 1. As T-A, request a T-B candidate by guessed/known ID (IDOR). *Expected:* denied; no T-B data; denial audited (REQ-SEC-01/04). <br> 2. Tamper the tenant claim in the token/header to T-B and replay. *Expected:* rejected at the Tenant Isolation Layer; no data leak (REQ-SEC-01). <br> 3. Forge a token asserting tenant T-C. *Expected:* signature/validation fails; access denied. <br> 4. Request a T-B object-storage attachment by its key while authenticated to T-A. *Expected:* denied (per-tenant key separation, REQ-SEC-03). <br> 5. Run automated cross-tenant fuzz across the API surface. *Expected:* zero successful cross-tenant reads/writes (MOP-11). |
| Final Expected Outcome | Across all vectors, cross-tenant successful accesses = **0** (MOP-11 / MOE-02); every attempt is denied and audited (REQ-SEC-01/03/04). Any success is **S1 → PRR blocker**. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1 — any cross-tenant success = S1)_ |
| Evidence path | validation-evidence/TC-VAL-08/ |
| Tools | Burp Suite / OWASP ZAP, custom IDOR + token-tamper harness, audit-log export. |

---

### TC-VAL-09 — SRE operates through an availability-zone failure (OAT · Simulation)

| Field | Value |
|---|---|
| Objective | The SRE team keeps core pipeline read/write available and recovers within RTO/RPO during a simulated AZ loss, with no data loss and customers informed. |
| Linked REQs / SN | REQ-O-01, REQ-O-02, REQ-O-03, SN-06, SN-07 · SCN-04 · MOP-09, MOP-10, TPM-01 |
| Priority | High |
| Type | Validation (OAT/Simulation) |
| Preconditions | Pre-prod multi-AZ environment with chaos injection; SRE on-call provisioned with runbooks (`RB-*` `TODO: owed by Phase 10`); synthetic recruiter load running; status-page wired. Self-contained. |
| Steps | 1. Inject an AZ failure (kill the primary AZ). *Expected:* health checks detect within seconds; automatic failover engages (REQ-O-02). <br> 2. Continue the synthetic recruiter load through the event. *Expected:* core pipeline read/write stays available; degraded integrations queue (SCN-04). <br> 3. Measure RTO and RPO. *Expected:* RTO ≤ 15 min, RPO ≤ 5 min (MOP-10). <br> 4. SRE confirms customer-facing status is surfaced. *Expected:* status reflects degradation, then recovery. <br> 5. After recovery, reconcile data. *Expected:* zero lost writes; availability over the drill within SLO (MOP-09). |
| Final Expected Outcome | Core pipeline survives AZ loss with RTO ≤ 15 min / RPO ≤ 5 min (MOP-10), no data loss, availability within SLO (MOP-09 / TPM-01), and operators ran it from the runbook (REQ-O-01/02/03). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-09/ |
| Tools | Chaos-engineering injector, k6 synthetic load, Grafana dashboards, status page, runbook drill log. |

---

### TC-VAL-10 — Auditor produces complete access + erasure evidence (Regulatory)

| Field | Value |
|---|---|
| Objective | An external auditor / Privacy Officer can be shown a trustworthy, complete record of who did what to candidate PII, plus erasure/export proof, within the audit window. |
| Linked REQs / SN | REQ-SEC-04, REQ-SEC-07, REQ-D-01, REQ-D-02, SN-10, SN-05 · SCN-03 · MOP-12, MOP-13 |
| Priority | High |
| Type | Validation (Regulatory) |
| Preconditions | Pilot tenant with a month of real PII-access activity (advances, scorecards, exports, an erasure); auditor (STK-09) + Privacy Officer (STK-05) with read-only evidence access; SOC 2 / ISO 27001 control list and DPA on hand. Self-contained. |
| Steps | 1. Auditor selects a candidate and requests the full PII-access history. *Expected:* every access/modification appears with actor, tenant, action, target, timestamp (REQ-SEC-04); completeness reconciles to 100% of logged events (MOP-12). <br> 2. Auditor requests a complete personal-data export for a candidate (Art. 15). *Expected:* export produced within the legal access window (REQ-SEC-07). <br> 3. Auditor requests proof of a completed erasure. *Expected:* tamper-evident erasure certificate retrievable (REQ-SEC-08 link via TC-VAL-06). <br> 4. Auditor maps controls to SOC 2 / ISO 27001 evidence. *Expected:* control evidence retrievable for audit (REQ-D-02); DPA terms satisfied (REQ-D-01). |
| Final Expected Outcome | Auditor obtains complete, tamper-evident access history (100%, MOP-12), a lawful data export (REQ-SEC-07), erasure proof, and retrievable SOC 2/ISO 27001 control evidence (REQ-D-01/02) — and signs off. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-10/ |
| Tools | Audit-log query/export, data-export package, erasure certificate, control-evidence pack, auditor letter. |

---

### TC-VAL-11 — Noisy-neighbour: concurrent multi-tenant load with a mid-run abuser (OAT · concurrency)

| Field | Value |
|---|---|
| Objective | Under ≥ 3 tenants driving concurrent load — including one tenant deliberately abusing the API mid-run — a co-located victim tenant's latency stays within target and no tenant starves another. |
| Linked REQs / SN | REQ-P-01, REQ-P-03, REQ-P-04, REQ-O-01, SN-07 · SCN-04 · MOP-05, MOP-06, TPM-02 |
| Priority | High |
| Type | Validation (OAT) |
| Preconditions | Staging/pre-prod prod-sized; ≥ 3 tenants (T-A victim, T-B and T-C normal, T-X abuser) seeded; k6/Locust cluster; per-tenant rate-limit/quota config active; Grafana per-tenant dashboards. Self-contained. |
| Steps | 1. Start steady nominal load on T-A, T-B, T-C concurrently (≥ 3 tenants, multiple sessions each). *Expected:* all p95 candidate reads ≤ 400 ms (MOP-05). <br> 2. **Mid-run**, T-X launches abusive burst load (far above its quota). *Expected:* T-X is rate-limited/quota-throttled (REQ-P-04). <br> 3. Hold the abuse for 10 minutes. *Expected:* victim T-A's p95 read latency stays ≤ 400 ms throughout — the abuser cannot push it past threshold (REQ-P-04, MOP-05). <br> 4. Stop abuse; observe recovery. *Expected:* no errors persisted; availability over the run within SLO (REQ-O-01). |
| Final Expected Outcome | With ≥ 3 concurrent tenants and a mid-run abuser, victim p95 read ≤ 400 ms (MOP-05 / TPM-02) and noisy-neighbour isolation holds (REQ-P-04, MOP-06). |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1)_ |
| Evidence path | validation-evidence/TC-VAL-11/ |
| Tools | k6 / Locust, per-tenant Grafana dashboards, rate-limit logs. |

---

### TC-VAL-12 — 30-day real-tenant pilot acceptance (Pilot/Beta)

| Field | Value |
|---|---|
| Objective | Over a 30-day live pilot on real tenants, recruiting teams adopt TalentFlow for daily work and the headline mission measures (velocity, availability, time-to-value, zero isolation/erasure incidents) meet target. |
| Linked REQs / SN | REQ-F-01, REQ-P-01, REQ-O-01, REQ-SEC-01, REQ-SEC-08, REQ-INT-02, SN-01, SN-04, SN-05, SN-06, SN-07, SN-03 · SCN-01…SCN-05 · MOE-01..07 · TPM-01..04 |
| Priority | High |
| Type | Validation (Pilot) |
| Preconditions | 3–5 real customer tenants live on the release candidate (CDR-frozen product baseline), spanning high-volume, constrained-bandwidth, and strict-privacy profiles; telemetry + analytics wired to all MOPs; pilot champions (STK-01/02/04) briefed; support + on-call staffed. Self-contained. |
| Steps | 1. Run live recruiting for 30 days on all pilot tenants. *Expected:* core pipeline used daily; telemetry flows to MOP-01..13. <br> 2. Track pipeline velocity (MOE-01) and time-to-value from signup to first SSO-driven advance (MOE-07). *Expected:* baselines captured; targets `TODO: set in pilot`. <br> 3. Track monthly availability (MOE-04 / MOP-09). *Expected:* ≥ 99.9% over the window. <br> 4. Monitor for cross-tenant incidents (MOE-02) and erasure-window compliance (MOE-03) across all live erasure requests. *Expected:* 0 cross-tenant incidents; 100% erasures in-window. <br> 5. Collect recruiter/hiring-manager UAT survey + would-re-adopt sentiment. *Expected:* satisfaction at target (`TODO: e.g. NPS > 30`). <br> 6. Confirm TPM margins (TPM-01..04) hold under real load. *Expected:* all within threshold. |
| Final Expected Outcome | Over 30 days on real tenants: availability ≥ 99.9% (MOP-09), **0 cross-tenant incidents** (MOE-02), **100% erasures in-window** (MOE-03), velocity/time-to-value baselined to target (MOE-01/07), and pilot satisfaction ≥ target — clearing the user-acceptance portion of PRR. |
| Actual Result | _(blank until executed)_ |
| Pass/Fail Status | _(blank until executed)_ |
| Defect refs | _(Conventions §5.1 — any cross-tenant or erasure miss = S1)_ |
| Evidence path | validation-evidence/TC-VAL-12/ |
| Tools | Product analytics, availability/SLO dashboards, audit-log monitor, UAT survey, pilot post-mortem. |

---

# Part C — Coverage & Traceability

## C.1 SCN / REQ-U / MOE coverage by TC-VAL

| Coverage target | Covered by |
|---|---|
| **SCN-01** Recruiter advances candidate (nominal) | TC-VAL-01, 02, 03, 04 |
| **SCN-02** Customer onboards via SSO + SCIM | TC-VAL-05 |
| **SCN-03** Candidate right-to-erasure | TC-VAL-06, 07, 10 |
| **SCN-04** Region/dependency degradation | TC-VAL-04, 09, 11 |
| **SCN-05** Tenant offboarding & data destruction | TC-VAL-06, 07 (cascade + backup), TC-VAL-12 (live erasure) · full EOL → [Phase 11](../) `TODO` |
| **REQ-U-01** advancement task time | TC-VAL-01 |
| **REQ-U-02** WCAG 2.2 AA | TC-VAL-03 (+ §7 criterion 10) |
| **REQ-U-03** degraded-state surfaced | TC-VAL-04 |
| **MOE-01** pipeline velocity | TC-VAL-01, 12 |
| **MOE-02** tenant isolation = 0 incidents | TC-VAL-08, 12 |
| **MOE-03** erasure 100% in-window | TC-VAL-06, 07, 12 |
| **MOE-04** availability ≥ 99.9% | TC-VAL-09, 12 |
| **MOE-05** scalability headroom | TC-VAL-11, 12 |
| **MOE-06** audit readiness | TC-VAL-10 |
| **MOE-07** time-to-value | TC-VAL-05, 12 |

## C.2 REQ → TC-VAL (validation thread; TC-VER owed by Phase 07)

| REQ | TC-VAL | Also verified by (Phase 07) |
|---|---|---|
| REQ-F-01 | TC-VAL-01, 12 | TC-VER-TBD |
| REQ-F-03 | TC-VAL-02 | TC-VER-TBD |
| REQ-F-04 | TC-VAL-03 | TC-VER-TBD |
| REQ-F-05 / F-06 | TC-VAL-01, 04 | TC-VER-TBD |
| REQ-U-01 | TC-VAL-01 | TC-VER-TBD |
| REQ-U-02 | TC-VAL-03 | TC-VER-TBD |
| REQ-U-03 | TC-VAL-04 | TC-VER-TBD |
| REQ-P-01 / P-02 | TC-VAL-01, 11 | TC-VER-TBD |
| REQ-P-03 / P-04 | TC-VAL-11 | TC-VER-TBD |
| REQ-INT-01 / INT-02 | TC-VAL-05 | TC-VER-TBD |
| REQ-INT-04 | TC-VAL-04 | TC-VER-TBD |
| REQ-O-01 / O-02 / O-03 | TC-VAL-09, 12 | TC-VER-TBD |
| REQ-O-04 | TC-VAL-06 | TC-VER-TBD |
| REQ-SEC-01 / SEC-03 | TC-VAL-08, 01 | TC-VER-TBD |
| REQ-SEC-02 / SEC-05 | TC-VAL-02, 05 | TC-VER-TBD |
| REQ-SEC-04 | TC-VAL-08, 10 | TC-VER-TBD |
| REQ-SEC-06 | TC-VAL-03 | TC-VER-TBD |
| REQ-SEC-07 | TC-VAL-10 | TC-VER-TBD |
| REQ-SEC-08 | TC-VAL-06, 07, 10, 12 | TC-VER-TBD |
| REQ-D-01 / D-02 | TC-VAL-06, 10 | TC-VER-TBD |
| REQ-C-01 / C-02 | TC-VAL-08 (cloud-only isolation); REQ-C-02 by Inspection (Phase 07) | TC-VER-TBD |

> **Gaps acknowledged:** REQ-F-02 (search), REQ-F-07/F-08 (job-board/HRIS), REQ-INT-03 (Stripe SAQ-A), and REQ-C-02 are exercised incidentally (search within TC-VAL-01; HRIS handoff and billing within the pilot TC-VAL-12) or are verified by Inspection in Phase 07; dedicated TC-VAL cases are `TODO:` candidates if the pilot surfaces user-acceptance risk. No `REQ-U-*` and no primary SCN is left unvalidated.

---

# Part D — PRR Exit Gate

Gate: **PRR (Production Readiness Review) → GA** (Conventions §3). Floor: *validation ≥ targets, **zero S1**, FCA/PCA done.*

- [x] `Validation.md` (Test Plan + TC-VAL) complete; Standard = ISO/IEC/IEEE 29119-3:2021 (IEEE 829 superseded).
- [x] **12 TC-VAL-*** written; each has per-step `*Expected:*` **and** blank `Actual Result` + `Pass/Fail Status` fields.
- [x] Acceptance catalog covers **UAT, OAT, Regulatory, Pilot, Simulation**; **FAT & SAT tailored out with reason** (no manufacturer/site; SAT-gap re-homed to TC-VAL-05 onboarding).
- [x] **Every TC-VAL is independent** — Preconditions re-establish all state; no case depends on another's result.
- [x] Every `REQ-U-*` (U-01/02/03) and every primary SCN (SCN-01…05) → ≥ 1 TC-VAL (Part C). No `HAZ-*` exist (Safety tailored out) so none owed.
- [x] Pass criteria numeric, derived from this project's MOE/MOP/TPM set, set in advance (§7).
- [x] Multi-actor concurrency + mid-operation failure covered (TC-VAL-11 ≥ 3 tenants + mid-run abuser; TC-VAL-04 partner outage; TC-VAL-09 AZ failover).
- [x] Pilot is **real users in a real environment** (3–5 real tenants, 30 days, TC-VAL-12), scheduled with buffer before GA.
- [x] Evidence archived per case under `validation-evidence/TC-VAL-NN/`; V&V traceability (REQ → TC-VAL → result) produced (Part C).
- [ ] **Validation results ≥ targets · zero S1 defects · FCA/PCA complete** — **TODO:** filled on execution; an open S1 (cross-tenant exposure or erasure miss) **blocks PRR**; a deferrable S2 needs a CCB waiver recorded as `CR-TBD` (Phase 09).
- [ ] TC-VER-* cross-reference resolved once Phase 07 assigns IDs — **TODO:** owed by [Phase 07](../Phase_07_Verification/).

**On PRR sign-off:** status → `Baseline (PRR-approved YYYY-MM-DD)`; thereafter changes only via `CR-<nn>` (Phase 09). Recommend `se-phase-09-change-config` next — stand up the CCB/CR loop before GA.
