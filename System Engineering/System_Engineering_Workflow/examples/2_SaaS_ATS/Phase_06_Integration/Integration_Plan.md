---
Document: Integration Plan — TalentFlow
Document ID: INTPLAN-TALENTFLOW-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Implementation, Integration); IEEE 828 (interface/configuration mgmt); ISO/IEC 27001:2022 + NIST SP 800-53 Rev. 5 (security-relevant integration evidence)
Status: Draft
Owner: Integration Lead
---

# TalentFlow — Phase 06 Integration Plan

Plans how the implemented TalentFlow components are combined and proven into a working whole, so any break is traceable to the piece just added, and **freezes the interfaces**. Realises the ISO/IEC/IEEE 15288:2023 **Implementation** and **Integration** processes. Exit gate: **CDR** (Conventions §3) — ICDs frozen, **product baseline** set.

Conforms in all IDs, gates, T/I/A/D methods, S1–S4 severity, and frontmatter to [`../../../05_Conventions.md`](../../../05_Conventions.md); cross-referenced, never restated. Source of truth for what is integrated: [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) (REQ-*, blocks §12.1, decisions §12.2, modes §9) and [`../Phase_01_Concept/Concept.md`](../Phase_01_Concept/Concept.md) (SN-*, SCN-*, RSK-*, MOE-*).

> **Domain tailoring (per README + SysRS §1.2).** TalentFlow is **pure software, cloud-native, multi-tenant SaaS**. Therefore **HIL is tailored out — reason: no hardware, no actuation, no physical measurement** (Conventions §1 tailoring note). §7 replaces HIL with the software equivalents the SysRS performance/reliability/isolation REQs actually need: load rigs, chaos/failover rigs, and a **tenant-isolation assurance rig**. The heaviest integration threads are **tenant isolation, privacy/erasure, identity (SSO/SCIM), and SLO/throughput** — matching RSK-01..RSK-05.

> **Upstream-artifact status (skill input check).** Phase 04 `ICD.md` and Phase 05 `Decision_Register.md` are **not yet authored** (`TODO: owed by Phase 04 / Phase 05`). This plan therefore **defines the ICD-NN interface inventory** (§5) from the SysRS interface seams (§2, §6) and the named blocks (§12.1), each traced to a `REQ-INT-*`/`REQ-SEC-*`. These ICD-NN IDs are **proposed here and adopted by Phase 04**; they are the seams frozen at this CDR. The five strategic decisions are referenced by their SysRS §12.2 names (`DEC-01..DEC-05`); where a decision drives real-vs-stub it is called out as `TODO: confirm at Phase 05`.

---

## 1. Strategy

**Chosen: Incremental + Continuous Integration/Delivery** (Conventions §1; the recommended default — lowest risk, easiest fault isolation). One component group is brought online end-to-end at a time, automated on every commit against a contract-test harness, with **selective top-down stubs** for partner/IdP edges that are slow or external to lab control.

**Rationale (decided on the dominant risk).** TalentFlow's dominant risks are *interaction* risks, not control-logic or hardware-long-pole risks: cross-tenant leakage (RSK-01), incomplete erasure across stores (RSK-02), noisy-neighbor SLO breach (RSK-03), and partner-API breakage (RSK-04). Incremental + CI surfaces each interaction the moment its component is added, with a machine-decidable gate — exactly the fault isolation those risks need. **Big Bang is rejected** (destroys fault isolation — the Boeing-787 failure mode; §8). **Bottom-Up** is unnecessary (no hardware/infra long pole). **Top-Down stubs are used only at the external seams** (tenant IdP, calendar/email/job-board/HRIS, Stripe) where the real counterpart is owned by a third party.

**Lifecycle alignment.** Agile (2-week sprints) with the **Formal overlay on the Privacy/Security/Tenant-isolation track** (Concept §4): the isolation and erasure increments (INC-02, INC-07) carry mandatory threat-model and DPIA evidence and a two-reviewer merge rule. Increment durations below are anchored to the sprint cadence; the absolute schedule horizon is `TODO: owed by Phase 00 Agreement` (Concept §1, §10).

**Tiers integrated** (from the intended stack; full list `TODO: owed by Phase 04 Tech_Stack_Rationale`): **(a) Cloud services** (API gateway + application services), **(b) Web/SPA** (Recruiter Web App, Hiring-Manager views), **(c) Public Careers Portal**, **(d) Data tier** (primary store, search index, object storage, backups, KMS). No firmware/mobile tier (Conventions: do not force the worked example's tiers).

---

## 2. Increment Order — Dependency-Weight Ranking

Out-degree = how many other component groups depend on this one. **Most-depended-upon integrated earliest** (skill step 3) so the highest-risk interactions surface while schedule remains to fix them. Components from SysRS §12.1.

| Component group (SysRS §12.1 block) | # dependents (out-degree) | Rank | Integrated in |
|---|---|---|---|
| **Tenant Isolation Layer** (REQ-SEC-01, REQ-C-01) | 9 — every data-touching service routes through it | 1 | INC-02 |
| **Identity & SSO Gateway** (REQ-INT-01/02, REQ-SEC-05) | 8 — every authenticated request and provisioning flow | 2 | INC-03 |
| **Data tier + Audit Service** (REQ-SEC-03/04, REQ-O-02) | 7 — persistence + tamper-evident logging under every write | 3 | INC-01 (data tier), INC-06 (audit) |
| **Candidate Pipeline Service** (REQ-F-01/03, REQ-P-02) | 5 — search, scheduling, audit, careers feed off pipeline state | 4 | INC-04 |
| **Search & Indexing Service** (REQ-F-02, REQ-P-01) | 3 — recruiter UI + pipeline + erasure cascade | 5 | INC-04 |
| **Privacy & Erasure Service** (REQ-SEC-06/07/08, REQ-O-04) | 3 — cascades into primary store, index, object store, backups | 6 | INC-07 |
| **Scheduling & Email / Job-board & HRIS Integration** (REQ-F-05..08, REQ-INT-04) | 2 — pipeline + recruiter UI | 7 | INC-08 |
| **Billing Service** (REQ-INT-03, REQ-C-02) | 1 — tenant lifecycle only | 8 | INC-09 |
| **Recruiter Web App / Careers Portal** (REQ-U-01/02/03, REQ-F-04) | 0 — leaf UI consumers | 9 | INC-05 (portal), INC-10 (recruiter UI) |

**Order rationale.** The Tenant Isolation Layer (RSK-01, the catastrophic-impact risk) and Identity Gateway are the highest out-degree and the highest blast radius, so they integrate first (INC-02, INC-03) on top of a thin data-tier baseline (INC-01) — never last. UI leaves integrate last (zero out-degree).

**Constraint-driven override (recorded per skill step 3).** The **data tier (INC-01)** is integrated *before* the Tenant Isolation Layer (INC-02) despite lower out-degree, because the isolation layer cannot be exercised without a persistence substrate to isolate. This is the only override; it does **not** weaken fault isolation (INC-01 ships with no tenant-facing path until INC-02 wraps it).

---

## 3. Increments (INC-NN)

Eleven increments, derived from *this* project's component graph (Conventions: count is project-specific — not forced to the worked example's 9). Each exit criterion is machine-decidable (CI job, dashboard, or isolation/load rig). Verifying test cases are `TC-VER-TBD` until Phase 07 assigns IDs (SysRS §11) — referenced here by the REQ they will prove. "Zero S1" uses Conventions §5.1 severity.

### INC-01 — Data-tier baseline (persistence substrate)
| Field | Value |
|---|---|
| Goal | A tenant-partitioned write reaches the primary store, search index, object storage, and a backup, with at-rest encryption + per-tenant key separation provable. |
| Components added | Data tier (primary store, search index, object storage, backups, KMS). |
| Entry criteria | Schemas migrated in a Maintenance-mode env (SysRS §9); KMS per-tenant keys provisioned; `ICD-09` (Object Storage) + `ICD-10` (KMS) contracts agreed. |
| Exit criteria | REQ-SEC-03 verified (TLS 1.2+ in transit, AES-256 at rest, per-tenant key separation) via I-record; backup/restore round-trips a synthetic tenant with zero data loss; **zero S1**. |
| Pass/Fail signal | Encryption/KMS inspection record green + restore-integrity check pass. |
| Duration | 2 sprints (4 weeks), anchored to Concept §1 cadence (`TODO: absolute dates — Phase 00`). |
| Tools | Testcontainers (DB+index+object-store), Terraform IaC, KMS inspection job. |

### INC-02 — Tenant Isolation Layer (highest blast radius — RSK-01)
| Field | Value |
|---|---|
| Goal | No request can read or write data outside the authenticated user's tenant on **any** data path. |
| Components added | Tenant Isolation Layer wrapping INC-01. |
| Entry criteria | INC-01 passed; `ICD-08` (Tenant Isolation context) frozen-candidate; threat model for cross-tenant access reviewed (Formal overlay). |
| Exit criteria | REQ-SEC-01 verified — **0** successful cross-tenant accesses (MOP-11 = 0) across the isolation rig's negative-test corpus; REQ-C-01 (cloud-only) inspected; **zero S1**; two-reviewer merge satisfied. |
| Pass/Fail signal | MOP-11 cross-tenant success count = 0 on the isolation rig (§7, HIL-equivalent ISO-RIG). |
| Duration | 3 sprints (6 weeks). |
| Tools | Tenant-isolation assurance rig (ISO-RIG), Semgrep tenant-scope ruleset, contract tests. |

### INC-03 — Identity & SSO Gateway (SSO + SCIM)
| Field | Value |
|---|---|
| Goal | A tenant user authenticates via SAML 2.0 against their IdP and is provisioned/deprovisioned via SCIM 2.0; assertions failing signature/audience/time are rejected. |
| Components added | Identity & SSO Gateway (SAML/SCIM/OIDC, MFA enforcement). |
| Entry criteria | INC-02 passed (identities resolve into an isolated tenant); `ICD-01` (SAML) + `ICD-02` (SCIM) contracts agreed; IdP stub stood up. |
| Exit criteria | REQ-INT-01 verified (valid assertion accepted, tampered/expired/wrong-audience rejected); REQ-INT-02 verified (provision→update→deprovision propagate, MOP-07 ≤ 60 s target / ≤ 300 s threshold); REQ-SEC-05 MFA-step-up demonstrated; **zero S1**. |
| Pass/Fail signal | SCIM propagation p95 ≤ MOP-07 threshold + SAML negative-suite 100% reject. |
| Duration | 3 sprints (6 weeks). |
| Tools | SAML/SCIM IdP simulator (SimpleSAMLphp / Microsoft365 SCIM validator), Pact contract tests. |

### INC-04 — Candidate Pipeline + Search (core recruiter loop)
| Field | Value |
|---|---|
| Goal | A recruiter transitions a candidate to an adjacent stage (actor/timestamp/prior+new recorded) and retrieves tenant-scoped search results — SCN-01 core. |
| Components added | Candidate Pipeline Service, Search & Indexing Service. |
| Entry criteria | INC-02 + INC-03 passed; `ICD-05` (Search index) agreed; isolation wraps both services. |
| Exit criteria | REQ-F-01 verified (atomic transition persisted in-request); REQ-F-02 verified (results tenant-scoped only); REQ-P-02 (stage-write p95 ≤ 600 ms, MOP-01) and REQ-P-01 (read p95 ≤ 400 ms, MOP-05 → TPM-02) met on the load rig at nominal load; **zero S1**. |
| Pass/Fail signal | MOP-01 + MOP-05 within threshold on load rig; cross-tenant search leakage = 0. |
| Duration | 3 sprints (6 weeks). |
| Tools | k6 load rig, Testcontainers, ISO-RIG regression. |

### INC-05 — Careers Portal (public application capture)
| Field | Value |
|---|---|
| Goal | A public applicant submits an application; a candidate record is created in the **target tenant only** within 5 s, accessibly. |
| Components added | Public Careers Portal. |
| Entry criteria | INC-04 passed; `ICD-11` (Careers Portal → Pipeline ingest) agreed. |
| Exit criteria | REQ-F-04 verified (record created ≤ 5 s, MOP-03); REQ-U-02 WCAG 2.2 AA inspected (keyboard-only + screen-reader labelling); **zero S1**. |
| Pass/Fail signal | MOP-03 ≤ threshold + axe/WCAG inspection record green. |
| Duration | 2 sprints (4 weeks). |
| Tools | k6, axe-core + Playwright a11y checks. |

### INC-06 — Audit Service (tamper-evident PII logging)
| Field | Value |
|---|---|
| Goal | Every access to and modification of candidate PII is recorded tamper-evidently (actor, tenant, action, target, timestamp). |
| Components added | Audit Service spanning all prior services. |
| Entry criteria | INC-04 passed; `ICD-06` (Audit event bus) agreed. |
| Exit criteria | REQ-SEC-04 verified (100% PII-access events captured, MOP-12 = 100%); REQ-D-02 control evidence retrievable (SOC 2 / ISO 27001 inspection); **zero S1**. |
| Pass/Fail signal | MOP-12 = 100% over the PII-touch test corpus + tamper-evidence check pass. |
| Duration | 2 sprints (4 weeks). |
| Tools | Append-only log (hash-chained), contract tests, evidence-export job. |

### INC-07 — Privacy & Erasure Service (RSK-02 — top privacy risk, SCN-03)
| Field | Value |
|---|---|
| Goal | An authorized erasure removes/crypto-erases a candidate's PII across primary store, search index, object storage, **and backups** within 30 days, with auditable proof; export (Art. 15) and consent (Art. 6/30) honored. |
| Components added | Privacy & Erasure Service cascading into INC-01 stores + INC-05 + INC-06. |
| Entry criteria | INC-01, INC-04, INC-06 passed; DPIA complete (Formal overlay); `ICD-07` (Erasure cascade) agreed; erasure-across-backups strategy `TODO: confirm DEC-02` (SysRS §12.2). |
| Exit criteria | REQ-SEC-08 verified — PII irrecoverable across all four stores ≤ 30 d (MOP-13 = 100% → TPM-04), proof artifact produced; REQ-SEC-07 export within legal window; REQ-SEC-06 consent/lawful-basis recorded; REQ-O-04 retention enforced; **zero S1**; two-reviewer merge. |
| Pass/Fail signal | TPM-04 = 100% erased ≤ legal limit, verified by a residual-PII scan across all stores incl. a restored backup = 0 hits. |
| Duration | 3 sprints (6 weeks). |
| Tools | Residual-PII scanner across stores, crypto-erase verifier, ISO-RIG (no cross-tenant over-erase). |

### INC-08 — External Integrations (calendar/email/job-board/HRIS — SCN-01, SCN-04)
| Field | Value |
|---|---|
| Goal | Scheduling, candidate email, job posting, and hired-candidate HRIS handoff happen over authenticated TLS channels and **fail safe (queue-and-retry)** on partner unavailability — surfaced to the user, never silent. |
| Components added | Scheduling & Email Integration Service; Job-board & HRIS Integration Service. |
| Entry criteria | INC-04 passed; `ICD-03` (Calendar), `ICD-04` (Email), `ICD-12` (Job-board), `ICD-13` (HRIS) contracts agreed; partner sandboxes available. |
| Exit criteria | REQ-F-05/06/07/08 demonstrated against partner sandboxes; REQ-INT-04 verified (TLS 1.2+, queue-and-retry, MOP-08 = 100% retry success, **no data loss**); REQ-U-03 degraded-state surfaced (Degraded mode, SysRS §9); REQ-F-08 HRIS handoff exposes no other tenant's data; **zero S1**. |
| Pass/Fail signal | Chaos rig drops each partner → MOP-08 retry success = 100%, 0 lost events; degraded banner shown. |
| Duration | 3 sprints (6 weeks). |
| Tools | Partner sandboxes + WireMock/Prism mocks, chaos rig (partner-outage injection), Pact. |

### INC-09 — Billing Service (tokenized Stripe — SCN-02)
| Field | Value |
|---|---|
| Goal | A tenant subscribes / changes plan / is billed with **no PAN** entering TalentFlow (PCI-DSS SAQ-A boundary held). |
| Components added | Billing Service. |
| Entry criteria | INC-03 passed (tenant lifecycle exists); `ICD-14` (Stripe) contract agreed; Stripe test keys loaded. |
| Exit criteria | REQ-INT-03 inspected (tokenized; no PAN transmitted/stored); REQ-C-02 inspected (PCI scope = SAQ-A); subscribe/change/bill demonstrated against Stripe sandbox; **zero S1**. |
| Pass/Fail signal | PAN-leak static+traffic inspection = 0 + Stripe sandbox flows green. |
| Duration | 2 sprints (4 weeks). |
| Tools | Stripe test mode, Semgrep PAN-pattern scan, traffic inspection. |

### INC-10 — Recruiter Web App (primary UI, end-to-end SCN-01)
| Field | Value |
|---|---|
| Goal | A trained recruiter completes a single-stage advancement in ≤ 3 interactions and ≤ 10 s p95 — full SCN-01 across real services. |
| Components added | Recruiter Web App + Hiring-Manager views (REQ-F-03 scorecards). |
| Entry criteria | INC-04, INC-06, INC-08 passed; `ICD-15` (Web App → API gateway) agreed. |
| Exit criteria | REQ-U-01 verified (≤ 3 interactions, task time p95 ≤ 10 s, MOP-04); REQ-F-03 scorecard persisted before ack; REQ-U-03 degraded-integration surfaced; full SCN-01 green; **zero S1**. |
| Pass/Fail signal | MOP-04 ≤ threshold via Playwright timing + SCN-01 E2E pass. |
| Duration | 3 sprints (6 weeks). |
| Tools | Playwright E2E, k6 (UI-driven), axe-core. |

### INC-11 — Multi-region availability, scale & offboarding hardening (SCN-04, SCN-05; RSK-03)
| Field | Value |
|---|---|
| Goal | The integrated system holds SLO under load and a single-AZ failure, enforces noisy-neighbor isolation, and offboards a tenant with crypto-erase — the degraded and EOL modes proven. |
| Components added | Cross-cutting: autoscaling, per-tenant rate-limit/quota, failover, staged-deploy + rollback, tenant offboarding. |
| Entry criteria | INC-01..INC-10 passed; load profile (REQ-P-03 concurrency/throughput targets) set — `TODO: owed numbers, Phase 06 capacity model` (SysRS §5, MOP-06, TPM-03). |
| Exit criteria | REQ-O-01 ≥ 99.9% availability sustained on the load rig (MOP-09 → TPM-01); REQ-O-02 single-AZ failover within RTO ≤ 15 min / RPO ≤ 5 min (MOP-10) on the failover rig (analysis + demo); REQ-P-03/REQ-P-04 noisy-neighbor isolation held (one tenant's load does not push another's p95 past §5.1, MOP-06 → TPM-03); REQ-O-03 zero-downtime deploy + auto-rollback demonstrated; SCN-05 offboarding crypto-erase (feeds Phase 11); **zero S1**. |
| Pass/Fail signal | TPM-01 ≥ 99.9% + MOP-10 within RTO/RPO + noisy-neighbor cross-tenant p95 impact within target on the chaos/load rigs. |
| Duration | 4 sprints (8 weeks). |
| Tools | k6/Locust load rig, chaos/failover rig, Argo CD staged-cohort + rollback, residual-PII scanner (offboarding). |

> **Per-increment exit invariant (all INC-NN):** entry = all dependent increments passed + the increment's `ICD-NN` agreed; exit = its REQ verified to the stated MOP/TPM threshold, **zero open S1** (Conventions §5.1), and for the Formal-overlay increments (INC-02, INC-07) the threat-model/DPIA evidence and two-reviewer merge recorded.

---

## 4. Dependency Map (Data / Control / Temporal / Resource)

Out-degree drives §2 ordering; here each **edge** is classified by the four reliance types (Conventions/skill step 5). This is distinct from the **interface taxonomy** in §5 — a dependency is a reliance between *components*; an interface is a *boundary contract*.

```
                INC-01 Data tier
                      │ (Temporal: must exist before isolation can wrap it)
                      ▼
        INC-02 Tenant Isolation Layer ───────────────┐
                      │ (Control: gates every data path)
                      ▼                               │
        INC-03 Identity & SSO Gateway                 │
                      │ (Control: authN/role gates requests)
        ┌─────────────┼───────────────┐               │
        ▼             ▼               ▼               ▼
   INC-04 Pipeline  INC-09 Billing  INC-06 Audit   (all data-touching
   + Search           (tenant         (Data: events    services route
        │              lifecycle)      from every       through INC-02)
        │                              write)
        ├──────────────┬───────────────┬───────────────┐
        ▼              ▼               ▼               ▼
   INC-05 Careers   INC-07 Erasure  INC-08 Ext.    INC-10 Recruiter
     Portal           (Data: cascade  Integrations    Web App
                       into stores)    (Data + Resource)   │
        └──────────────┴───────────────┴───────────────┘
                              │
                              ▼
        INC-11 Availability / Scale / Offboarding (Resource + Temporal)
```

| Edge (depends-on) | Type | Why |
|---|---|---|
| Every data-touching service → **Tenant Isolation Layer** (INC-02) | **Control** | The isolation layer's tenant-scope decision gates whether any read/write is allowed (REQ-SEC-01). No service may bypass it. |
| Every authenticated request → **Identity Gateway** (INC-03) | **Control** | AuthN result + role gates request handling (REQ-INT-01, REQ-SEC-02). |
| Pipeline / Search / Erasure / Audit → **Data tier** (INC-01) | **Temporal** | Stores, index, KMS keys must be provisioned/migrated before dependents can run (REQ-SEC-03). |
| Audit Service ← every write-path service | **Data** | Each service emits PII-access events the Audit Service consumes (REQ-SEC-04, MOP-12). |
| Search & Indexing ← Pipeline events | **Data** | Index is populated from pipeline candidate changes (REQ-F-02). |
| Erasure Service → primary store + index + object store + backups | **Data** | Cascade consumes/rewrites each store's records (REQ-SEC-08). |
| External Integrations ↔ partner APIs | **Data + Resource** | Data mapping to/from partners **and** a shared finite resource — partner **rate limits** (RSK-04, REQ-INT-04). |
| Noisy-neighbor: tenant A load ↔ tenant B latency | **Resource** | Shared compute/DB/connection pool; one tenant's load must not exhaust another's share (REQ-P-04, MOP-06). |
| Failover (INC-11) → healthy AZ + replicated data | **Temporal + Resource** | Standby must be warm/replicated before cutover; shares the cross-AZ replication channel (REQ-O-02). |
| Deploy/rollback (INC-11) → health checks | **Control** | Health-check state gates promote-vs-rollback (REQ-O-03). |

---

## 5. Interfaces & Stubs / Drivers / Mocks Coverage

**Every interface seam mapped once.** Each row is tagged by **interface type** — **SW-API** (APIs, data formats, protocols) or **HMI** (human-facing UI); there is **no HW** type (pure software). The placeholder is a **stub** (top-down, simulates what's *below/external*) or **mock** (peer-to-peer), with the tool and the increment that replaces it with the real counterpart. Mocks are **generated from / contract-tested against** the ICD where a schema exists (OpenAPI/SCIM/SAML metadata) and run in CI (skill step 6).

> **ICD provenance.** These `ICD-NN` are **defined here** and adopted by Phase 04 `ICD.md` (`TODO: Phase 04 to author and freeze`). Each traces to a SysRS REQ and a §12.1 block. They are the seams frozen at this CDR (§9).

| ICD-NN | Type | Seam (A ↔ B) | Traces to | Placeholder | Tool | Replaced in |
|---|---|---|---|---|---|---|
| **ICD-01** | SW-API | Identity Gateway ↔ Tenant IdP (SAML 2.0 SSO) | REQ-INT-01, SN-03 | **Stub** (IdP) | SimpleSAMLphp IdP simulator | INC-03 (real per-tenant IdP at onboarding) |
| **ICD-02** | SW-API | Identity Gateway ↔ Tenant IdP (SCIM 2.0 / RFC 7644) | REQ-INT-02, SN-03 | **Stub** (SCIM client) | Microsoft365/Okta SCIM validator | INC-03 (real IdP SCIM) |
| **ICD-03** | SW-API | Scheduling Service ↔ Calendar partner | REQ-F-06, REQ-INT-04, SN-09 | **Stub** | Partner sandbox + WireMock | INC-08 → prod partner |
| **ICD-04** | SW-API | Email Service ↔ Email partner | REQ-F-05, REQ-INT-04, SN-09 | **Stub** | Mailpit / partner sandbox | INC-08 → prod partner |
| **ICD-05** | SW-API | Pipeline ↔ Search & Indexing Service | REQ-F-02, REQ-P-01 | **Mock** (peer) | Testcontainers index + contract test | INC-04 (real index) |
| **ICD-06** | SW-API | Application services ↔ Audit Service (event bus) | REQ-SEC-04, REQ-D-02, SN-10 | **Mock** (peer) | In-broker testcontainer + Pact | INC-06 (real Audit) |
| **ICD-07** | SW-API | Privacy & Erasure ↔ all data stores (cascade) | REQ-SEC-08, REQ-O-04, SN-05 | **Mock** (peer) | Store testcontainers + residual-PII scanner | INC-07 (real cascade) |
| **ICD-08** | SW-API | Application services ↔ Tenant Isolation Layer (tenant-scope context) | REQ-SEC-01, REQ-C-01, SN-04 | **Mock** (peer) | Semgrep tenant-scope rules + ISO-RIG | INC-02 (real isolation enforcement) |
| **ICD-09** | SW-API | Data tier ↔ Object storage (attachments) | REQ-F-04, REQ-SEC-03 | **Mock** (peer) | MinIO / S3-compatible testcontainer | INC-01 (real object store) |
| **ICD-10** | SW-API | Data tier ↔ KMS (per-tenant keys) | REQ-SEC-03, SN-04 | **Mock** (peer) | KMS emulator / LocalStack KMS | INC-01 (real managed KMS) |
| **ICD-11** | SW-API | Careers Portal ↔ Pipeline ingest API | REQ-F-04, SN-01 | **Mock** (peer) | Prism from OpenAPI + Pact | INC-05 (real portal→pipeline) |
| **ICD-12** | SW-API | Job-board Integration ↔ Job-board partner | REQ-F-07, REQ-INT-04, SN-09 | **Stub** | Partner sandbox + WireMock | INC-08 → prod partner |
| **ICD-13** | SW-API | HRIS Integration ↔ Tenant HRIS (hired-candidate handoff) | REQ-F-08, REQ-INT-04, SN-09 | **Stub** | HRIS sandbox + WireMock | INC-08 → prod partner |
| **ICD-14** | SW-API | Billing Service ↔ Stripe (tokenized) | REQ-INT-03, REQ-C-02, SN-11 | **Stub** | Stripe test mode | INC-09 → prod (test→live keys) |
| **ICD-15** | HMI | Recruiter Web App ↔ API gateway (REST + WebSocket) | REQ-U-01, REQ-U-03, REQ-F-01 | **Mock** (peer) | Mock Service Worker + Playwright | INC-10 (real services) |
| **ICD-16** | HMI | Public Careers Portal ↔ applicant (browser) | REQ-F-04, REQ-U-02, SN-12 | **Mock** (peer) | axe-core + Playwright a11y harness | INC-05 (real portal UI) |

**Coverage self-check.** 16 seams defined ⇒ 16 rows; every row tags type (SW-API/HMI), names a stub/mock + tool, and a replacement increment. No seam unmapped. *When Phase 04 authors `ICD.md`, re-run the skill's coverage-check prompt against the frozen inventory and reconcile any added/removed seam by a `CR-NN`.*

---

## 6. CI/CD Pipelines (per tier)

Split **per tier** (cloud/web/portal/data each have their own cadence — not one mega-pipeline). Every tier pins **categories** from the canonical CI/CD + static-scan tool table owned by the Phase 06 stage skill (`se-phase-06-integration/SKILL.md` → "Canonical CI/CD + static-scan tool table"); specific tools confirmed below. Phase 07 references that table rather than re-listing it. Trunk-based with protected `main`; green checks required; **two reviewers on the Formal-overlay paths** (Tenant Isolation, Identity, Privacy/Erasure — INC-02/03/07).

| Tier | Source / branch | Artifact | Ordered stages (gate at each) | Deploy target | Rollout / rollback |
|---|---|---|---|---|---|
| **Cloud services** (API gateway + app services) | trunk / `main` | container image | build → unit (PyTest/JUnit) → integration+contract (Testcontainers, Pact, Schemathesis) → **SAST** (Semgrep + CodeQL; tenant-scope ruleset) → **SCA/SBOM** (Trivy + Grype, `syft` SBOM) → publish | dev → staging → pre-prod → prod | Argo CD staged cohorts; auto-rollback on metric regression |
| **Web / SPA** (Recruiter + Hiring-Manager) | trunk / `main` | static bundle | build → unit (Vitest) → a11y (axe-core) → **E2E** (Playwright) → SAST (Semgrep) → SCA (Dependabot) → preview deploy | preview → staging → prod | blue-green; auto-revert on health-check fail |
| **Careers Portal** (public) | trunk / `main` | static bundle + edge fn | build → unit → **a11y WCAG 2.2 AA** (axe-core, REQ-U-02) → E2E (Playwright) → SAST → SCA | preview → staging → prod | blue-green |
| **Data tier** (schema/migrations/IaC) | trunk / `main` | migration set + Terraform plan | lint (sqlfluff) → migration test (Testcontainers) → IaC plan/policy (Terraform + tfsec/Checkov) → SCA → encryption/KMS inspection | dev → staging → prod (gated) | expand-contract migrations; rollback via down-migration + IaC revert |

**Cross-tier scheduled gates:**

| Gate | Trigger | Tool | Failure action |
|---|---|---|---|
| **Tenant-isolation regression** | every commit + nightly | ISO-RIG negative-test corpus (MOP-11 = 0) | Block PR on any cross-tenant success; page on nightly regression. |
| **Contract conformance** (SAML/SCIM/partner) | nightly | Pact broker + SCIM/SAML validators | Page on partner-contract regression (RSK-04 early warning). |
| **Load / performance** | pre-release | k6 / Locust (MOP-01, MOP-05, MOP-06 → TPM-02/03) | Block release if any TPM/SLO regressed. |
| **Residual-PII / erasure** | nightly + pre-release | residual-PII scanner across all stores incl. restored backup (TPM-04) | Block release on any residual PII after erasure. |
| **SBOM / supply-chain** | every commit | Trivy + Grype + `syft` | Block on critical CVE; emit SBOM (feeds Security thread, ISO 27001 / NIST 800-53). |

> **Static-scan stack (SAST + SCA + IaC + secrets), pinned:** Semgrep (incl. custom tenant-scope + PAN-pattern rules) + CodeQL (SAST); Trivy + Grype + `syft` (SCA/SBOM); tfsec + Checkov (IaC policy); gitleaks (secret scanning). Critical findings **block the PR** (Conventions: SAST/SCA stages mandatory at CDR).

---

## 7. Test Rigs (HIL tailored out — software equivalents)

**HIL is tailored out** — TalentFlow has no hardware/actuation/physical measurement (README; SysRS §1.2). Per Conventions §1, the tailored-out artifact is recorded with reason, and the rigs the **performance/reliability/isolation/privacy** REQs actually require are stood up instead. Each runs on a CI agent tagged `rig-*` so pipeline jobs target it. **Stood up in INC-01/INC-02, not near launch** (avoids the "HIL only used near launch" pitfall).

### ISO-RIG — Tenant-Isolation Assurance Rig (the analogue of a safety HIL — RSK-01)
| Field | Value |
|---|---|
| Purpose | Inject crafted cross-tenant requests on every data path; assert zero leakage. |
| DUT | Tenant Isolation Layer + every data-touching service. |
| Stimuli | Negative-test corpus: forged tenant IDs, manipulated tokens, IDOR probes, search-scope evasion. |
| Measurement | MOP-11 cross-tenant success count (target 0). |
| Automation | Python rig + Semgrep tenant-scope ruleset, gated in CI (every commit + nightly). |
| REQs covered | REQ-SEC-01, REQ-C-01; guards REQ-F-02, REQ-SEC-08 over-erase. |
| Stood up in | INC-02 (regressed every increment thereafter). |

### LOAD-RIG — Performance & Noisy-Neighbor Rig (RSK-03)
| Field | Value |
|---|---|
| Purpose | Drive nominal + peak multi-tenant load; prove SLO and noisy-neighbor isolation. |
| DUT | API gateway + Pipeline + Search + Data tier. |
| Stimuli | k6/Locust profiles (`TODO: concurrency/throughput numbers — REQ-P-03/MOP-06, Phase 06 capacity model`); one-tenant-spike profile for REQ-P-04. |
| Measurement | MOP-01, MOP-05 (→ TPM-02), MOP-06 (→ TPM-03), MOP-09 (→ TPM-01). |
| Automation | k6/Locust in CI (pre-release); dashboards on TPM margins. |
| REQs covered | REQ-P-01, REQ-P-02, REQ-P-03, REQ-P-04, REQ-O-01. |
| Stood up in | INC-04 (load) / INC-11 (peak + noisy-neighbor). |

### CHAOS-RIG — Failover & Partner-Outage Rig (RSK-03, RSK-04)
| Field | Value |
|---|---|
| Purpose | Inject AZ loss, dependency latency, and partner-API outages; prove failover + graceful degradation. |
| DUT | Full integrated stack + external integrations. |
| Stimuli | AZ kill, network attenuation, partner 5xx/timeout injection (WireMock fault rules). |
| Measurement | MOP-10 (RTO ≤ 15 min / RPO ≤ 5 min); MOP-08 retry success = 100%, 0 lost events. |
| Automation | Chaos harness + Argo CD failover; degraded-banner E2E (REQ-U-03). |
| REQs covered | REQ-O-02, REQ-O-03, REQ-INT-04, REQ-U-03. |
| Stood up in | INC-08 (partner outage) / INC-11 (AZ failover). |

### PRIV-RIG — Erasure & Residual-PII Rig (RSK-02 — top privacy risk)
| Field | Value |
|---|---|
| Purpose | After an erasure, scan every store (primary, index, object, **restored backup**) for residual PII. |
| DUT | Privacy & Erasure Service + all data stores. |
| Stimuli | Seeded synthetic candidate PII → erasure request → restore a backup taken pre-erasure. |
| Measurement | TPM-04 (residual-PII hits = 0; 100% erased ≤ legal limit). |
| Automation | Residual-PII scanner + crypto-erase verifier in CI (nightly + pre-release). |
| REQs covered | REQ-SEC-07, REQ-SEC-08, REQ-O-04. |
| Stood up in | INC-07. |

**Coverage target:** every `REQ-P-*` and `REQ-O-*` requiring measurement is bound to LOAD-RIG/CHAOS-RIG; every `REQ-SEC-01/07/08` to ISO-RIG/PRIV-RIG. Target = 100% of measurement-bearing performance/reliability/isolation/privacy REQs covered by a rig (`TODO: confirm % once Phase 07 finalises methods`).

---

## 8. Integration Risks & Mitigations

Pre-empting the **Boeing-787 late-integration failure mode** (skill §8; cited in the SE guide) and carrying the Concept §9 risks into integration. Logged/reviewed at CDR; full register `TODO: owed by _cross_cutting/Risk_Opportunity_Register.md`.

| Risk | Integration failure it would cause | Pre-emptive action | ICD/INC |
|---|---|---|---|
| **RSK-01** Cross-tenant leakage | A late-added service bypasses tenant scope | ISO-RIG gates **every commit** from INC-02 on; Semgrep tenant-scope rule blocks PRs; Control-dependency on isolation layer is mandatory, not optional. | ICD-08 / INC-02 |
| **RSK-02** Incomplete erasure | PII survives in index/backups after "delete" | PRIV-RIG scans a **restored backup** (TPM-04); erasure cascade contract-tested across all four stores; DPIA gate on INC-07. | ICD-07 / INC-07 |
| **RSK-03** Noisy-neighbor SLO breach | One tenant's load degrades others at peak | LOAD-RIG one-tenant-spike profile (REQ-P-04); per-tenant rate-limit/quota integrated in INC-11; TPM-01/02/03 margins reviewed at CDR. | INC-11 |
| **RSK-04** Partner-API breakage | A calendar/email/job-board/HRIS change breaks recruiter flow late | Nightly Pact/contract conformance against partner sandboxes (early-warning); queue-and-retry (REQ-INT-04) proven on CHAOS-RIG; partner-change monitoring. | ICD-03/04/12/13 / INC-08 |
| **RSK-05** Slow time-to-value | SSO/SCIM/import setup stalls onboarding | SAML/SCIM connectors contract-tested in INC-03; guided-onboarding path exercised in SCN-02; measure MOE-07. | ICD-01/02 / INC-03 |
| **INT-mismatch** (generic Boeing-787) | Two services agree on incompatible data formats | **Single ICD baseline frozen at CDR** (§9); post-CDR changes only via `CR-NN`; mocks generated from the ICD schema and contract-tested in CI — no hand-rolled drift. | all ICD-NN |
| **Env drift** | dev/staging/prod diverge → "works in staging" | All tiers via Terraform + Argo CD; identical IaC across environments; IaC policy-scanned (tfsec/Checkov). | §6 |

---

## 9. CDR Readiness

Freezing the ICDs here establishes the **product baseline** (Conventions §3). After CDR, any interface change routes through a `CR-NN` (Phase 09).

### 9.1 ICDs to freeze at this CDR
All 16 seams from §5, each set to `Status: Baseline (CDR-approved YYYY-MM-DD)` in Phase 04 `ICD.md`:

`ICD-01` (SAML) · `ICD-02` (SCIM) · `ICD-03` (Calendar) · `ICD-04` (Email) · `ICD-05` (Pipeline↔Search) · `ICD-06` (Audit bus) · `ICD-07` (Erasure cascade) · `ICD-08` (Tenant Isolation context) · `ICD-09` (Object storage) · `ICD-10` (KMS) · `ICD-11` (Portal→Pipeline) · `ICD-12` (Job-board) · `ICD-13` (HRIS) · `ICD-14` (Stripe) · `ICD-15` (Web App↔API) · `ICD-16` (Careers Portal UI).

> **CDR blocker (must clear first):** Phase 04 `ICD.md` and Phase 05 `Decision_Register.md` are not yet authored. `TODO:` Phase 04 must author + freeze these 16 ICDs and Phase 05 must close `DEC-01..DEC-05` (esp. DEC-01 isolation model and DEC-02 erasure-across-backups, which gate INC-02/INC-07) **before CDR can pass**.

### 9.2 Rig coverage vs target

| Rig | Target | Status |
|---|---|---|
| ISO-RIG (isolation) | 100% of data paths in negative corpus | `TODO: measure` |
| LOAD-RIG (perf/noisy-neighbor) | TPM-01/02/03 within threshold at agreed load | `TODO: capacity numbers owed (REQ-P-03)` |
| CHAOS-RIG (failover/partner) | MOP-10 RTO/RPO + MOP-08 = 100% | `TODO: measure` |
| PRIV-RIG (erasure) | TPM-04 residual-PII = 0 | `TODO: measure` |

### 9.3 Open risks / TPM margins at CDR

| Item | At CDR |
|---|---|
| Critical/High open RSK | RSK-01, RSK-02 must be **mitigation-in-place + evidence green on ISO-RIG/PRIV-RIG** before CDR clears; RSK-03/04 gated by LOAD/CHAOS rigs. |
| Open S1 defects | Must be **zero** (Conventions §5.1) — each increment's exit enforces it. |
| Hazards (HAZ-NN) | **None** — Safety/RAMS thread tailored out (SysRS §8: no hazard log). |
| TPM margins | TPM-01 (avail), TPM-02 (latency), TPM-03 (throughput), TPM-04 (erasure) — current values `TODO` (SysRS §10.2); margins reported at CDR from rig results. |

### 9.4 CDR exit-gate checklist (Conventions §3; skill exit gate)

- [x] Integration strategy chosen and justified against the dominant risk (Incremental + CI; §1).
- [x] Increments ordered by **dependency weight** (ranking recorded; one override explained — §2).
- [x] Increments (`INC-01..INC-11`) defined — count derived from this project — each with observable entry/exit, Pass/Fail signal, duration (§3).
- [x] Every dependency edge classified **Data / Control / Temporal / Resource** (§4).
- [x] **Every `ICD-NN` (16) appears exactly once** in the stubs/drivers/mocks table, tagged **SW-API / HMI**, with a replacement increment (§5).
- [x] CI/CD defined **per tier**, referencing the canonical tool table; **SAST + SCA/SBOM** stages present (§6).
- [x] HIL **tailored out with reason**; software rigs (ISO/LOAD/CHAOS/PRIV) cover every measurement-bearing `REQ-P-*/O-*/SEC-*` (§7).
- [ ] All 16 `ICD-NN` frozen → `Baseline (CDR-approved <date>)`; **product baseline** set — **TODO: blocked on Phase 04 `ICD.md`** (§9.1).
- [ ] `DEC-01..DEC-05` closed (DEC-01/DEC-02 gate INC-02/INC-07) — **TODO: blocked on Phase 05 `Decision_Register.md`**.
- [ ] No open **S1**, critical `RSK-NN`, or critical `HAZ-NN`; `TPM-*` margins reported — **TODO: measure on rigs** (§9.2–9.3).

**CDR recommendation:** **Proceed-with-actions** — the integration plan, increment order, dependency classification, ICD inventory, and rig design are complete and convention-compliant. CDR sign-off is **held** on two named upstream actions: (1) Phase 04 authors and freezes the 16 `ICD-NN`; (2) Phase 05 closes `DEC-01`/`DEC-02`. Once those land and ISO-RIG/PRIV-RIG evidence is green with zero open S1, the product baseline is freezable.

---

## 10. Cross-cutting hooks

- **Configuration Mgmt** *(feeds)* — freezing the 16 ICDs at CDR sets the product baseline; post-CDR interface changes route through `CR-NN` (Phase 09; IEEE 828).
- **Security** *(feeds)* — the SAST + SCA/SBOM stages (§6) and ISO-RIG evidence feed the threat model / supply-chain controls (ISO 27001 / NIST 800-53).
- **Privacy** *(feeds)* — PRIV-RIG erasure evidence and the DPIA on INC-07 feed the GDPR/CCPA processor obligation (REQ-D-01).
- **Risk & Opportunity** *(feeds/consumes)* — RSK-01..RSK-05 reviewed at CDR (§8); OPP-01 (provable isolation/privacy as differentiator) evidenced by ISO-RIG/PRIV-RIG results.
- **Measurement (MOE/MOP/TPM)** *(feeds)* — increment exit criteria and rig results update TPM-01..TPM-04 margins reported at CDR.
- **Quality** *(feeds)* — CI pass-rate, static-scan, and contract-test results are the quality evidence reviewed at CDR.
- **Safety / RAMS** — **tailored out** (no hazards; SysRS §8).

> Next phase: `se-phase-07-verification` — turn each REQ into a T/I/A/D verification (assign `TC-VER-NN` to the `TC-VER-TBD` placeholders), referencing the CI/CD + static-scan tool table owned by this phase.
