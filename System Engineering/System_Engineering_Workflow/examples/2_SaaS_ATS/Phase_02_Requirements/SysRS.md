---
Document: System Requirements Specification — TalentFlow
Document ID: SyRS-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (SyRS)
Status: Draft
Owner: Lead Systems Engineer
---

# System Requirements Specification — TalentFlow

The **source of truth** for all later phases. Derives the solution-space requirements (REQ-*) from the Phase 01 stakeholder needs (SN-*) in [`../Phase_01_Concept/Concept.md`](../Phase_01_Concept/Concept.md), seeds T/I/A/D verification methods (authoritative in Phase 07), defines the MOP/TPM measurement set, and carries the SN→REQ traceability spine (Conventions §8). Exit gate: **SRR**.

Method codes (Conventions §4): **T** Test · **I** Inspection · **A** Analysis · **D** Demonstration — seeded here, finalised in Phase 07. Verifying activities are `TC-VER-TBD` until Phase 07 assigns IDs.

---

## 1. Introduction

### 1.1 Purpose
Specify the system-level requirements for TalentFlow, a multi-tenant B2B SaaS Applicant Tracking System: recruiter web app, public careers portal, multi-tenant platform with strict per-tenant isolation, SSO/SCIM identity, integrations (calendar/email/job-board/HRIS), subscription billing, and a GDPR/CCPA privacy lifecycle.

### 1.2 Scope
Covers system behaviour, quality attributes, external interfaces, constraints, and domain/compliance obligations. Pure software — no hardware; "Production" is release/deploy; "Disposal" is tenant offboarding + secure data destruction. Detailed ICDs are produced in Phase 04; this section is high-level interface seams only.

### 1.3 Definitions
- **Tenant** — an isolated customer instance (one subscribing organization) within the shared multi-tenant platform.
- **Controller / Processor** — GDPR roles: the customer is the controller; TalentFlow is the processor.
- **Erasure** — irreversible removal of candidate PII across all stores (right-to-be-forgotten).
- **SSO / SCIM** — SAML 2.0 single sign-on / SCIM 2.0 user provisioning.
- **SLO** — Service Level Objective (Conventions §2.4; defined in Phase 10).

### 1.4 References
Per Conventions §9: ISO/IEC/IEEE 29148:2018; ISO/IEC 27001:2022; NIST SP 800-53 Rev. 5; NIST SP 800-88 Rev. 1; GDPR (Arts. 5, 17, 28, 30, 32, 35); CCPA/CPRA; SAML 2.0; SCIM 2.0 (RFC 7644); OAuth 2.0/OIDC; WCAG 2.2 AA; PCI-DSS (SAQ-A); SOC 2 Type II.

---

## 2. System Overview

TalentFlow is a cloud-native, multi-tenant SaaS comprising:

1. **Edge / API tier** — authenticated REST + WebSocket APIs behind a tenant-aware gateway.
2. **Application services** — Candidate Pipeline, Search/Indexing, Scheduling & Email, Job-board Posting, HRIS Handoff, Billing, Privacy & Erasure, Audit.
3. **Identity & SSO Gateway** — SAML/SCIM/OIDC, role-based access.
4. **Tenant Isolation Layer** — enforces tenant-scoped authorization on every data access.
5. **Data tier** — multi-tenant primary store, search index, object storage, backups — all tenant-partitioned.
6. **Clients** — recruiter web app, hiring-manager views, public careers portal.

The platform operates **multi-tenant shared with logical isolation**: a tenant's users only ever transit, read, and write that tenant's data.

---

## 3. Functional Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-F-01** | The Candidate Pipeline Service shall transition a candidate to an adjacent pipeline stage and persist the change within the same authenticated request, recording actor, timestamp, and prior/new stage. | STK-01 / SN-01 | SN-01 | High | T | MOP-01 |
| **REQ-F-02** | The system shall return tenant-scoped candidate search results matching recruiter-supplied filters (stage, role, keyword, tags) limited to the requesting user's tenant. | STK-01 / SN-01 | SN-01 | High | T | MOP-02 |
| **REQ-F-03** | The system shall allow a hiring manager to submit a structured scorecard (per-criterion rating + free-text) against an assigned candidate and persist it before acknowledging success. | STK-02 / SN-02 | SN-02 | High | T | — |
| **REQ-F-04** | The careers portal shall accept a candidate application, capture declared PII fields and attachments, and create a candidate record in the target tenant within 5 s of submission. | STK-03 / SN-01 | SN-01 | High | T | MOP-03 |
| **REQ-F-05** | The system shall send candidate communications using tenant-configured templates via the email integration and record send status against the candidate timeline. | STK-01 / SN-09 | SN-09 | Medium | D | — |
| **REQ-F-06** | The system shall let a recruiter schedule an interview that writes an event to the candidate's and interviewers' calendars via the calendar integration and reflect accept/decline status. | STK-01 / SN-09 | SN-09 | Medium | D | — |
| **REQ-F-07** | The system shall publish an approved job opening to each tenant-enabled external job board and record the external posting reference. | STK-01 / SN-09 | SN-09 | Medium | D | — |
| **REQ-F-08** | The system shall transmit a hired candidate's agreed field set to the tenant-configured HRIS and confirm receipt, without exposing data to any other tenant. | STK-08 / SN-09 | SN-09 | Medium | T | — |

---

## 4. Usability Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-U-01** | A trained recruiter shall complete a single-stage candidate advancement (open → advance → confirm) in ≤ 3 user-visible interactions and ≤ 10 s of task time at the 95th percentile. | STK-01 / SN-01 | SN-01 | High | T | MOP-04 |
| **REQ-U-02** | The recruiter web app and careers portal shall conform to WCAG 2.2 AA, including keyboard-only operation and screen-reader labelling of all interactive controls. | STK-03 / SN-12 | SN-12 | Medium | I | — |
| **REQ-U-03** | The system shall surface degraded-integration state (e.g. email/calendar queued) to the user within the affected workflow rather than failing the core action silently. | STK-01 / SN-06 | SN-06 | Medium | D | — |

---

## 5. Performance Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-P-01** | The system shall serve candidate-record read requests with a p95 server-side latency ≤ 400 ms and p99 ≤ 800 ms under nominal load. | STK-01 / SN-07 | SN-07 | High | T | MOP-05 (→ TPM-02) |
| **REQ-P-02** | The Candidate Pipeline Service shall commit a stage-transition write with a p95 latency ≤ 600 ms under nominal load. | STK-01 / SN-01 | SN-01 | High | T | MOP-01 |
| **REQ-P-03** | The platform shall sustain TODO concurrent active recruiter sessions and TODO API requests/second at the §5 latency targets without breaching SLO (load profile set in Phase 06). | STK-07 / SN-07 | SN-07 | High | T | MOP-06 (→ TPM-03) |
| **REQ-P-04** | The system shall enforce per-tenant request rate limits and resource quotas so that one tenant's load cannot push another tenant's p95 latency past §5.1 targets ("noisy-neighbor" isolation). | STK-07 / SN-07 | SN-07 | High | T | MOP-06 |

---

## 6. System Interfaces

High-level seams only; full ICD in Phase 04 (`Phase_04_Architecture/ICD.md`).

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-INT-01** | The Identity Gateway shall authenticate tenant users via SAML 2.0 SSO against the tenant's configured IdP and reject assertions failing signature/audience/time validation. | STK-04 / SN-03 | SN-03 | High | T | — |
| **REQ-INT-02** | The system shall provision, update, and deprovision tenant user accounts and role assignments via SCIM 2.0 (RFC 7644) initiated by the tenant's IdP. | STK-04 / SN-03 | SN-03 | High | T | MOP-07 |
| **REQ-INT-03** | The system shall integrate subscription billing via tokenized Stripe such that no cardholder PAN is transmitted to or stored by TalentFlow (PCI-DSS SAQ-A boundary). | STK-06 / SN-11 | SN-11 | Medium | I | — |
| **REQ-INT-04** | All external integration calls (calendar, email, job-board, HRIS) shall use authenticated, encrypted (TLS 1.2+) channels and shall fail safe — queue-and-retry — on partner unavailability without data loss. | STK-08 / SN-09 | SN-09 | Medium | T | MOP-08 |

---

## 7. System Operations

### 7.1 Operational / Reliability Requirements (REQ-O-*)

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-O-01** | The service shall achieve ≥ 99.9% successful-request availability per calendar month, measured at the API gateway. | STK-04 / SN-06 | SN-06 | High | T | MOP-09 (→ TPM-01) |
| **REQ-O-02** | The platform shall remain available for core pipeline read/write during a single availability-zone failure, with automatic failover (RTO ≤ 15 min, RPO ≤ 5 min). | STK-07 / SN-06 | SN-06 | High | A | MOP-10 |
| **REQ-O-03** | The system shall support zero-downtime, staged deployments with automatic rollback on failed health checks. | STK-07 / SN-06 | SN-06 | Medium | D | — |
| **REQ-O-04** | The system shall retain candidate and tenant data per the tenant-configured retention policy and shall not retain PII beyond the policy limit except where law requires. | STK-05 / SN-05 | SN-05 | High | I | — |

### 7.2 Security Requirements (REQ-SEC-*)

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-SEC-01** | The Tenant Isolation Layer shall enforce tenant-scoped authorization on every data-access path such that no request can read or write data outside the authenticated user's tenant. | STK-04, STK-05 / SN-04 | SN-04 | High | T | MOP-11 |
| **REQ-SEC-02** | The system shall enforce role-based access control with least privilege, allowing tenant admins to assign roles that restrict actions to those required by each role. | STK-04 / SN-08 | SN-08 | Medium | T | — |
| **REQ-SEC-03** | The system shall encrypt all candidate and tenant data in transit (TLS 1.2+) and at rest (AES-256 or stronger), with per-tenant key separation for at-rest data. | STK-05 / SN-04 | SN-04 | High | I | — |
| **REQ-SEC-04** | The system shall record a tamper-evident audit log of all access to and modification of candidate PII, including actor, tenant, action, target, and timestamp. | STK-05, STK-09 / SN-10 | SN-10 | High | T | MOP-12 |
| **REQ-SEC-05** | The system shall require multi-factor authentication for any tenant-admin action when the tenant's IdP does not already assert MFA. | STK-04 / SN-08 | SN-08 | Medium | D | — |
| **REQ-SEC-06** | The system shall capture and honor candidate consent for processing, and shall record the lawful basis for each processing purpose (GDPR Art. 6/30). | STK-05, STK-09 / SN-05 | SN-05 | High | I | — |
| **REQ-SEC-07** | The system shall produce, on authorized request, a complete export of a candidate's personal data within the legal access window (GDPR Art. 15). | STK-03, STK-09 / SN-05 | SN-05 | High | T | MOP-13 |
| **REQ-SEC-08** | The system shall erase a candidate's PII across the primary store, search index, object storage, and backups — by deletion or crypto-erase — within 30 days of an authorized erasure request, and produce auditable proof of completion. | STK-03, STK-05, STK-09 / SN-05 | SN-05 | High | T | MOP-13 (→ TPM-04) |

---

## 8. Constraints & Domain Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-C-01** | The system shall be delivered as a cloud-only, multi-tenant SaaS — no customer-managed hardware and no on-premise/self-hosted deployment in scope. | Concept §3 / SN-04 | SN-04 | High | I | — |
| **REQ-C-02** | The system shall confine payment handling to tokenized Stripe so that TalentFlow's PCI-DSS scope remains SAQ-A (no PAN storage/transmission). | Concept §6 / SN-11 | SN-11 | Medium | I | — |
| **REQ-D-01** | The system shall meet GDPR and CCPA/CPRA processor obligations — lawful processing, records of processing (Art. 30), access (Art. 15), erasure (Art. 17), and breach support (Art. 32) — under a Data Processing Agreement with each tenant. | STK-05, STK-09 / SN-05 | SN-05 | High | I | — |
| **REQ-D-02** | The system shall operate within an information-security management program meeting SOC 2 Type II and ISO/IEC 27001:2022, with control evidence retrievable for audit. | STK-05, STK-09 / SN-10 | SN-10 | High | I | — |

> No `REQ-SAF-*` are written: TalentFlow has no Safety/RAMS thread (no hazard log, no physical/safety hazards). Safety class tailored out — reason: pure information system with no actuation or human-safety impact.

---

## 9. Modes & States

Top-level system modes (seeds the Phase 03 State Machine). Reuses OpsCon SCN-01…SCN-05.

| Mode | Description | Entry / Exit |
|---|---|---|
| **Nominal** | All tenants and integrations healthy; full read/write and all integrations live. | Default; ← from Degraded when dependencies recover. |
| **Degraded** | A dependency, integration, or zone is impaired; core pipeline read/write preserved, ancillary integrations queue-and-retry. | ← health check failure (SCN-04); → Nominal on recovery. |
| **Read-Only / Safe** | Writes suspended to protect data integrity during a severe incident. | ← incident declaration; → Nominal after remediation. |
| **Maintenance** | Controlled deploys, schema migrations, tenant onboarding/offboarding. | ← scheduled change / onboarding (SCN-02); → Nominal. |
| **Offboarding / EOL** | Tenant export + retention window + crypto-erase. | ← subscription end / erasure (SCN-05); → tenant removed. |

### Transition rules (summary)
- Nominal ⇄ Degraded is automatic, driven by health checks (REQ-O-02, REQ-INT-04).
- Any mode → Read-Only/Safe on incident; only Read-Only/Safe → Nominal after sign-off.
- Offboarding/EOL is terminal for a tenant and feeds Phase 11 Disposal.

---

## 10. Measures of Effectiveness & Performance (MOE → MOP → TPM)

MOEs (mission-level, from SN) are defined in [Concept §8](../Phase_01_Concept/Concept.md#8-measures-of-effectiveness-moe). MOPs (system-level, from REQ) and promoted TPMs below. `TODO` = real project measures it.

### 10.1 Measures of Performance (from REQ)

| ID | Derived from | System-level metric | Target | Threshold | Unit |
|---|---|---|---|---|---|
| **MOP-01** | REQ-F-01, REQ-P-02 | Stage-transition write latency (p95) | ≤ 500 ms | ≤ 600 ms | ms |
| **MOP-02** | REQ-F-02 | Tenant-scoped search response (p95) | ≤ 500 ms | ≤ 800 ms | ms |
| **MOP-03** | REQ-F-04 | Application-to-record creation time | ≤ 3 s | ≤ 5 s | s |
| **MOP-04** | REQ-U-01 | Single-stage advancement task time (p95) | ≤ 8 s | ≤ 10 s | s |
| **MOP-05** | REQ-P-01 | Candidate read latency (p95 / p99) | 300 / 600 | 400 / 800 | ms |
| **MOP-06** | REQ-P-03, REQ-P-04 | Sustained throughput at SLO; noisy-neighbor isolation | TODO | TODO | req/s |
| **MOP-07** | REQ-INT-02 | SCIM provisioning propagation time | ≤ 60 s | ≤ 300 s | s |
| **MOP-08** | REQ-INT-04 | Integration retry success without data loss | 100% | ≥ 99.9% | % |
| **MOP-09** | REQ-O-01 | Monthly API availability | ≥ 99.95% | ≥ 99.9% | % |
| **MOP-10** | REQ-O-02 | Failover RTO / RPO | 10 / 2 | 15 / 5 | min |
| **MOP-11** | REQ-SEC-01 | Cross-tenant access attempts that succeed | 0 | 0 | count |
| **MOP-12** | REQ-SEC-04 | PII-access events captured in audit log | 100% | 100% | % |
| **MOP-13** | REQ-SEC-07, REQ-SEC-08 | Erasure/export completed within legal window | 100% | 100% | % |

### 10.2 Technical Performance Measures (promoted MOPs — tracked Phases 06–10)

| ID | Promoted from | Why tracked (risk) | Current | Target | Threshold | Margin |
|---|---|---|---|---|---|---|
| **TPM-01** | MOP-09 | Availability SLO is the headline reliability commitment (RSK-03). | TODO | ≥ 99.95% | ≥ 99.9% | TODO |
| **TPM-02** | MOP-05 | Latency under growth is the core scalability risk (RSK-03). | TODO | p95 ≤ 300 ms | p95 ≤ 400 ms | TODO |
| **TPM-03** | MOP-06 | Sustained-throughput target carries capacity/cost risk; profile set in Phase 06. | TODO | TODO | TODO | TODO |
| **TPM-04** | MOP-13 | Erasure completeness is the top privacy/legal risk (RSK-02). | TODO | 100% ≤ 30 d | 100% ≤ legal limit | n/a |

---

## 11. Traceability (SN → REQ → method → verifying activity)

Forward and backward maintained (Conventions §8). Bidirectional is mandatory for the privacy/security thread.

| SN (StRS) | REQ ID(s) | Class | Priority | MOP | Method | Verifying activity |
|---|---|---|---|---|---|---|
| SN-01 | REQ-F-01, REQ-F-02, REQ-F-04, REQ-U-01, REQ-P-02 | F/U/P | High | MOP-01..04 | T | TC-VER-TBD |
| SN-02 | REQ-F-03 | F | High | — | T | TC-VER-TBD |
| SN-03 | REQ-INT-01, REQ-INT-02 | INT | High | MOP-07 | T | TC-VER-TBD |
| SN-04 | REQ-SEC-01, REQ-SEC-03, REQ-C-01 | SEC/C | High | MOP-11 | T/I | TC-VER-TBD |
| SN-05 | REQ-SEC-06, REQ-SEC-07, REQ-SEC-08, REQ-O-04, REQ-D-01 | SEC/O/D | High | MOP-13 | T/I | TC-VER-TBD |
| SN-06 | REQ-O-01, REQ-O-02, REQ-O-03, REQ-U-03 | O/U | High | MOP-09, MOP-10 | T/A/D | TC-VER-TBD |
| SN-07 | REQ-P-01, REQ-P-03, REQ-P-04 | P | High | MOP-05, MOP-06 | T | TC-VER-TBD |
| SN-08 | REQ-SEC-02, REQ-SEC-05 | SEC | Medium | — | T/D | TC-VER-TBD |
| SN-09 | REQ-F-05, REQ-F-06, REQ-F-07, REQ-F-08, REQ-INT-04 | F/INT | Medium | MOP-08 | T/D | TC-VER-TBD |
| SN-10 | REQ-SEC-04, REQ-D-02 | SEC/D | High | MOP-12 | T/I | TC-VER-TBD |
| SN-11 | REQ-INT-03, REQ-C-02 | INT/C | Medium | — | I | TC-VER-TBD |
| SN-12 | REQ-U-02 | U | Medium | — | I | TC-VER-TBD |

**Coverage:** every SN-01…SN-12 has ≥ 1 covering REQ; every REQ traces to an SN. No orphans. Full method finalisation and TC-VER IDs assigned in Phase 07.

---

## 12. Design preview (for downstream alignment)

So Phases 03–05 align to stable names. (Definitions/justifications are owned by Phase 04/05 — listed by name only here.)

### 12.1 Intended top-level system blocks
- **Identity & SSO Gateway** — SAML/SCIM/OIDC, MFA enforcement. (satisfies REQ-INT-01/02, REQ-SEC-05)
- **Tenant Isolation Layer** — tenant-scoped authorization on every data path. (satisfies REQ-SEC-01, REQ-C-01)
- **Candidate Pipeline Service** — stages, transitions, scorecards. (satisfies REQ-F-01/03, REQ-P-02)
- **Search & Indexing Service** — tenant-partitioned search. (satisfies REQ-F-02, REQ-P-01)
- **Scheduling & Email Integration Service** — calendar/email connectors. (satisfies REQ-F-05/06)
- **Job-board & HRIS Integration Service** — posting + hired-candidate handoff. (satisfies REQ-F-07/08, REQ-INT-04)
- **Privacy & Erasure Service** — consent, export, cascade erasure, crypto-erase. (satisfies REQ-SEC-06/07/08, REQ-O-04)
- **Audit Service** — tamper-evident PII access logging. (satisfies REQ-SEC-04, REQ-D-02)
- **Billing Service** — tokenized Stripe subscription billing. (satisfies REQ-INT-03, REQ-C-02)
- **Careers Portal** — public application capture. (satisfies REQ-F-04, REQ-U-02)
- **Recruiter Web App** — primary UI. (satisfies REQ-U-01/03)

### 12.2 Strategic decisions to be made (names only; owned by Phase 05)
- **DM-01 / DEC-01** — Tenant isolation model (shared-schema + row-level vs. schema-per-tenant vs. database-per-tenant).
- **DM-02 / DEC-02** — Erasure strategy across backups (hard-delete-and-rewrite vs. per-tenant/per-record crypto-erase).
- **DM-03 / DEC-03** — Multi-region availability topology (active-active vs. active-passive) to meet REQ-O-01/02.
- **DM-04 / DEC-04** — Identity build-vs-buy (managed IdP broker vs. in-house SAML/SCIM).
- **DM-05 / DEC-05** — Search/indexing platform choice supporting strict tenant partitioning at REQ-P-01 latency.

---

## 13. Requirements Engineering Record

- **Elicitation methods:** stakeholder workshops (recruiters, hiring managers, customer admins); document review of GDPR/CCPA, SOC 2, ISO 27001, SAML/SCIM specs (surfaced implicit privacy/audit/isolation requirements); SRE interviews for SLO/scalability numbers; competitive ATS observation for usability baselines.
- **Conflicts surfaced & resolved:**
  - *Security ↔ Usability* — MFA on every admin action vs. low friction → resolved: MFA required only when the tenant IdP does not already assert it (REQ-SEC-05). Priority tie-break: security High.
  - *Performance ↔ Cost* — strict per-tenant isolation/quotas vs. infra cost → resolved: enforce noisy-neighbor isolation (REQ-P-04) and let DEC-01 trade isolation depth vs. cost in Phase 05.
  - *Privacy ↔ Retention/Audit* — erasure vs. 7-year audit retention → resolved: erase candidate PII (REQ-SEC-08) while retaining non-PII audit metadata (REQ-SEC-04) lawfully.
- **Peer review / walkthrough:** TODO — schedule structured peer review (Inspection) with architecture, security, privacy, and SRE before SRR; record reviewers + date here (SRR Inspection evidence).
- **SMART pass:** all 35 REQs (F:8 · U:3 · P:4 · O:4 · SEC:8 · INT:4 · C:2 · D:2) written to the 29148 template; no double-barrelled or vague-verb requirements; thresholds either set or marked `TODO` where a real project must measure (REQ-P-03, MOP-06, TPM-01..04).

---

## 14. Assumptions & Dependencies
- Each tenant operates its own IdP (Okta / Entra ID / Google Workspace) and HRIS.
- Stripe is the contracted, PCI-certified payment processor (tokenized; SAQ-A).
- Cloud provider supplies managed multi-AZ datastore, object storage, and KMS for per-tenant key separation.
- Calendar/email/job-board/HRIS partner APIs are stable and rate-limited per published contracts (RSK-04).
- DPA and SOC 2 program are funded and in place before enterprise GA (Conditional-Go condition from Concept §5).

---

## 15. SRR exit gate
- [x] Every REQ written SMART against the 29148 template; no non-SMART REQ remains.
- [x] Every REQ uses a Conventions §2.1 class code and a stable, zero-padded ID.
- [x] Every SN-01…SN-12 covered by ≥ 1 REQ; every REQ traces to an SN (no orphans — §11).
- [x] Every REQ has a priority and a seeded T/I/A/D method with a `TC-VER-TBD` placeholder.
- [x] MOE (Concept §8) / MOP / TPM set defined; 4 TPMs promoted with target + threshold (§10).
- [x] Conflicts resolved with rationale + priority tie-break (§13).
- [x] C and D requirements captured; each D cites a verified standard (§8).
- [x] Forward + backward traceability present; bidirectional on the privacy/security thread.
- [ ] Peer review / walkthrough completed — **TODO** (§13); on completion set status → `Baseline (SRR-approved <date>)` and establish the Functional/Requirements baseline.

**On SRR sign-off:** status → `Baseline (SRR-approved YYYY-MM-DD)`; thereafter changes only via `CR-<nn>` (Phase 09).
