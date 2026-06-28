---
Document: Verification Matrix — TalentFlow
Document ID: VM-TALENTFLOW-v1.0
Standard: IEEE 1012-2016
Status: Draft
Owner: Verification Lead
---

# Verification Matrix — TalentFlow

> **Verification question:** *Did we build the system **right**?* — i.e. does the built system conform to the [`SysRS`](../Phase_02_Requirements/SysRS.md) spec. This is the AUTHORITATIVE T/I/A/D method-assignment pass (Phase 02 only *seeded* a default; this phase *settles* it — overrides are noted in §1). Exit gate: **TRR** (Conventions §3).
>
> **Necessary-but-not-sufficient caveat.** 100% method coverage proves the spec is *covered by a verification activity* — it does **not** prove the spec was *right* (that is [Phase 08 Validation](../Phase_08_Validation/)) and does **not** prove every test has *passed*. **Coverage ≠ correctness ≠ validity ≠ pass.** Red-team the worst-case cells before relying on green coverage.
>
> **Method legend (Conventions §4):** **T** Test (measurable threshold, exercise the system) · **I** Inspection (examine artifact/doc/code without executing — this is where structured **Review** lives, code `I`) · **A** Analysis (calculation / model / simulation / similarity) · **D** Demonstration (operate-and-observe, no instrumentation). Combinations (`I + T`) allowed where two genuinely apply.

Scope: all **35** SysRS REQs (F:8 · U:3 · P:4 · O:4 · SEC:8 · INT:4 · C:2 · D:2). Companion plan: `VnV_Plan.md` (IEEE 1012-2016 integrity level + IV&V decision). Evidence convention: [`verification-evidence/`](verification-evidence/) (§6).

---

## 1. Per-Requirement Verification

5 columns exactly (Conventions / Phase-07 skill): **Req ID · Statement (abbrev.) · Method · Verifying Test/Activity (TC-VER) · Tool**. *Status* and *evidence path* are **not** columns — Status rolls up in §5; evidence lands under `verification-evidence/TC-VER-<nn>/`. Tools named per Phase 06's scan/CI stack (§3); a `TODO` tool is allowed but flagged at TRR.

### 1.1 Functional (REQ-F-*)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-F-01 | Pipeline stage transition persisted in-request w/ actor·ts·prior/new stage | T | TC-VER-01 — stage-transition integration test asserts persisted record + fields | Vitest + Testcontainers (Postgres) |
| REQ-F-02 | Tenant-scoped candidate search (stage/role/keyword/tags), tenant-limited | T | TC-VER-02 — search API test asserts result set ⊆ requesting tenant | Playwright API + k6 (seeded multi-tenant fixtures) |
| REQ-F-03 | Hiring-manager structured scorecard persisted before success ack | T | TC-VER-03 — scorecard submit test asserts persist-before-200 ordering | Vitest + Testcontainers |
| REQ-F-04 | Careers-portal application → candidate record ≤ 5 s | T | TC-VER-04 — submission timing test (declared PII + attachment) vs MOP-03 | k6 + S3-compatible object-store stub |
| REQ-F-05 | Candidate comms via tenant template, send-status on timeline | D | TC-VER-05 — operate email send against email sandbox, observe timeline status | Mailtrap sandbox + Manual + TC-VER-05 demo checklist |
| REQ-F-06 | Schedule interview → calendar events + accept/decline reflected | D | TC-VER-06 — operate scheduling against calendar sandbox, observe events/RSVP | Google Calendar API sandbox + Manual + scheduling demo checklist |
| REQ-F-07 | Publish approved opening to job board(s) + record external ref | D | TC-VER-07 — operate posting against job-board sandbox, observe external ref | Job-board partner sandbox + Manual + posting demo checklist |
| REQ-F-08 | Hired-candidate field set → HRIS w/ receipt, no cross-tenant exposure | T | TC-VER-08 — HRIS handoff contract test asserts receipt + tenant-scoped payload | Pact (consumer-driven contract) + HRIS sandbox |

### 1.2 Usability (REQ-U-*)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-U-01 | Single-stage advancement ≤ 3 interactions, ≤ 10 s task time (p95) | T | TC-VER-09 — instrumented task-time test (RUM p95) vs MOP-04 | Playwright (scripted task) + RUM (task-time percentile) |
| REQ-U-02 | WCAG 2.2 AA — keyboard-only + screen-reader labelling | I + T | TC-VER-10 — automated a11y scan (T) + manual AT/keyboard audit (I) | axe-core + Pa11y + Manual + WCAG 2.2 AA checklist (NVDA/VoiceOver) |
| REQ-U-03 | Surface degraded-integration state in workflow (no silent core fail) | D | TC-VER-11 — inject integration outage, operate workflow, observe surfaced state | Toxiproxy (fault inject) + Manual + degraded-state demo checklist |

> **Override (REQ-U-02):** seeded `I` → finalised **`I + T`**. WCAG keyboard/SR labelling is partly machine-checkable (axe-core/Pa11y = `T`) and partly only provable by AT walkthrough (`I`). Combination chosen so the automated scan is a CI gate and the manual audit catches what scanners miss.

### 1.3 Performance (REQ-P-*)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-P-01 | Candidate read p95 ≤ 400 ms / p99 ≤ 800 ms (nominal) | T | TC-VER-12 — read-latency load test, p95/p99 vs MOP-05 / TPM-02 | k6 (latency profile) + Grafana/Prometheus |
| REQ-P-02 | Stage-transition write p95 ≤ 600 ms (nominal) | T | TC-VER-13 — write-latency load test, p95 vs MOP-01 | k6 + Grafana/Prometheus |
| REQ-P-03 | Sustain TODO concurrent sessions / TODO RPS at §5 latency, no SLO breach | T | TC-VER-14 — sustained soak/throughput test at the Phase-06 load profile (TPM-03) | k6 (distributed) + Grafana/Prometheus — **load profile: TODO (owed by Phase 06)** |
| REQ-P-04 | Per-tenant rate limit/quota — noisy-neighbor isolation holds §5.1 p95 | T | TC-VER-15 — noisy-neighbor test: one tenant floods, assert victim-tenant p95 (MOP-06) | k6 (multi-tenant load mix) + Grafana/Prometheus |

### 1.4 Operational / Reliability (REQ-O-*)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-O-01 | ≥ 99.9% monthly successful-request availability at API gateway | A | TC-VER-16 — rolling availability analysis over SLO window (MOP-09 / TPM-01) | Prometheus + SLO query (error-budget burn) |
| REQ-O-02 | AZ-failure failover, core read/write, RTO ≤ 15 min / RPO ≤ 5 min | A | TC-VER-17 — game-day failover drill + RTO/RPO timing analysis (MOP-10) | Chaos-engineering (AWS FIS) + restore-timing analysis |
| REQ-O-03 | Zero-downtime staged deploy w/ auto-rollback on failed health check | D | TC-VER-18 — operate a canary deploy with injected failed health check, observe rollback | Argo Rollouts (canary) + Manual + rollback demo checklist |
| REQ-O-04 | Retain data per tenant policy; no PII beyond limit except where law requires | I | TC-VER-19 — inspect retention-job config + schema TTLs vs documented policy | Manual + retention-policy inspection checklist (cron/TTL config review) |

> **Override (REQ-O-01, REQ-O-02):** seeded `T` (O-01) and `A` (O-02). O-01 finalised **`A`** — a monthly-availability SLA is a long-window statistical claim that direct test cannot establish in a test run (method cheatsheet: "≥ N% availability → A"); it is *analysed* from the SLO query over the window. O-02 confirmed **`A`**: failover is *exercised* in a game-day drill but the RTO/RPO claim is established by *analysis* of the recovery timings, not a single pass/fail measurement.

### 1.5 Security (REQ-SEC-*) — Formal overlay; bidirectional trace mandatory (Concept §4)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-SEC-01 | Tenant-scoped authZ on every data path — no cross-tenant read/write | I + T | TC-VER-20 — inspect isolation-layer authZ design/code (I) + cross-tenant attack test asserting 0 leaks (T) vs MOP-11 | Manual + isolation design review (DEC-01) + custom cross-tenant fuzz harness + OWASP ZAP (authz) |
| REQ-SEC-02 | RBAC least-privilege; admin-assignable role restrictions | T | TC-VER-21 — role-matrix authorization test: each role can do only its allowed actions | Vitest (authz matrix) + Playwright API |
| REQ-SEC-03 | Encrypt in transit (TLS 1.2+) & at rest (AES-256+), per-tenant key separation | I + T | TC-VER-22 — inspect KMS per-tenant key config + TLS policy (I) + TLS handshake/cipher test (T) | Manual + KMS key-separation inspection checklist + testssl.sh (TLS enforcement) |
| REQ-SEC-04 | Tamper-evident audit log of all PII access/modify (actor·tenant·action·target·ts) | T | TC-VER-23 — exercise PII access paths, assert 100% logged + tamper-evidence (hash-chain) intact (MOP-12) | Vitest + audit-log integrity verifier (hash-chain check) |
| REQ-SEC-05 | MFA for tenant-admin actions when IdP does not already assert MFA | D | TC-VER-24 — operate admin action w/ and w/o IdP-asserted MFA, observe step-up challenge | Manual + MFA step-up demo checklist (IdP w/ & w/o amr=mfa) |
| REQ-SEC-06 | Capture consent + record lawful basis per processing purpose (GDPR Art. 6/30) | I | TC-VER-25 — inspect consent capture + RoPA lawful-basis records vs Art. 30 template | Manual + GDPR Art. 6/30 RoPA inspection checklist |
| REQ-SEC-07 | Complete personal-data export within legal access window (GDPR Art. 15) | T | TC-VER-26 — DSAR export test: assert export completeness + within-window timing (MOP-13) | Vitest + export-completeness diff harness (vs seeded PII fixture) |
| REQ-SEC-08 | Erase PII across primary/index/object/backups (delete or crypto-erase) ≤ 30 d + auditable proof | T | TC-VER-27 — end-to-end erasure test: assert PII irrecoverable in every store incl. backups + proof artifact (MOP-13 / TPM-04) | Custom erasure-verifier (queries primary + OpenSearch index + S3 + restored backup) + crypto-erase key-destruction check |

> **Note (REQ-SEC-04, seeded `T`):** confirmed **`T`** — log *completeness* and *tamper-evidence* are measurable by exercising PII paths and verifying the hash-chain; no override. **Override (REQ-SEC-01, REQ-SEC-03):** seeded `T` (SEC-01) and `I` (SEC-03) → both finalised **`I + T`**. Isolation and crypto are the two highest-risk REQs (RSK-01, → IV&V): inspect the design/config (catches what a test cannot reach) *and* test the runtime enforcement. SEC-03 must not be `I`-only — a correct-looking config can still be bypassed at runtime.

### 1.6 Interfaces (REQ-INT-*)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-INT-01 | SAML 2.0 SSO authN; reject bad signature/audience/time | T | TC-VER-28 — SAML test asserting accept-valid + reject (bad sig / wrong audience / expired) | python3-saml test harness + crafted SAML assertions (ICD-TBD, Phase 04) |
| REQ-INT-02 | SCIM 2.0 provision/update/deprovision users + roles (RFC 7644) | T | TC-VER-29 — SCIM conformance test: CRUD + deprovision propagation ≤ MOP-07 | SCIM 2.0 conformance suite + Postman/Newman |
| REQ-INT-03 | Tokenized Stripe billing; no PAN transmitted/stored (PCI SAQ-A) | I | TC-VER-30 — inspect Stripe integration + network egress for PAN; confirm SAQ-A boundary | Manual + PCI SAQ-A boundary inspection checklist + egress/code scan (no PAN) |
| REQ-INT-04 | All integration calls TLS 1.2+, fail-safe queue-and-retry, no data loss | T | TC-VER-31 — inject partner outage, assert queue+retry recovers w/ 0 loss (MOP-08) | Toxiproxy (partner fault) + queue-replay assertion harness |

### 1.7 Constraints & Domain (REQ-C-*, REQ-D-*)

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-C-01 | Cloud-only multi-tenant SaaS; no on-prem/self-host in scope | I | TC-VER-32 — inspect deployment architecture + delivery model vs cloud-only constraint | Manual + architecture inspection checklist (Architecture_Description, Phase 04) |
| REQ-C-02 | Payment confined to tokenized Stripe — PCI scope stays SAQ-A | I | TC-VER-30 — (shared) PCI SAQ-A boundary inspection confirms no PAN storage/transmit | Manual + PCI SAQ-A boundary inspection checklist |
| REQ-D-01 | GDPR/CCPA processor obligations (Arts. 15/17/30/32) under DPA per tenant | I | TC-VER-33 — inspect DPA template + Art. 30 RoPA + erasure/breach procedures vs obligations | Manual + GDPR processor-obligation audit checklist (DPA + RoPA) |
| REQ-D-02 | ISMS meeting SOC 2 Type II + ISO/IEC 27001:2022; evidence retrievable | I | TC-VER-34 — inspect ISMS control set + SOC 2 / 27001 evidence retrievability | Manual + SOC 2 / ISO 27001 control-evidence inspection checklist |

> **Shared TC note (REQ-C-02 ↔ REQ-INT-03):** both confine payment to the tokenized-Stripe SAQ-A boundary; one inspection (**TC-VER-30**) verifies both — the constraint (C-02) and its interface expression (INT-03). Grouping a coherent inspection set under one TC is permitted (Phase-07 skill, Decision points). Recorded once, traced to both REQs.

---

## 2. Verification Levels (Unit → Integration → System) + the Validation Hinge

Per the V-model pairing (Phase 02 ↔ Phase 07). Software classes are placed on the ladder; the **Acceptance** column is the **verification → validation HINGE** — owned by [Phase 08](../Phase_08_Validation/), **not** a verification method and **not** counted in §5 coverage.

| Class | Unit | Integration | System | Acceptance |
|---|---|---|---|---|
| **F** (functional) | Service-level unit tests (persist/order logic) | TC-VER-01/03/08 service+DB+partner contract | TC-VER-02/04 end-to-end pipeline | → Phase 08 (validation hinge) — recruiter UAT on SCN-01 |
| **U** (usability) | Component a11y unit (axe) | TC-VER-10 page-level a11y | TC-VER-09/11 instrumented task flow | → Phase 08 — recruiter task-success UAT |
| **P** (performance) | n/a (no meaningful unit) | TC-VER-13 single-service latency | TC-VER-12/14/15 full-stack load / soak / noisy-neighbor | → Phase 08 — pilot-load validation vs MOE-05 |
| **O** (operational) | Health-check unit | TC-VER-18 deploy/rollback in staging | TC-VER-16/17 SLO analysis + game-day failover | → Phase 08 — ops-readiness rehearsal |
| **SEC** (security) | AuthZ unit (role matrix) | TC-VER-20/23 isolation+audit in integration | TC-VER-27 cross-store erasure; ZAP DAST on system | → Phase 08 — pen-test sign-off (3rd-party) + privacy UAT |
| **INT** (interface) | Connector unit (mock partner) | TC-VER-28/29/31 contract + conformance | TC-VER full SSO/SCIM/HRIS round-trip | → Phase 08 — partner-environment acceptance |
| **C / D** (constraint/domain) | — | — | TC-VER-30/32/33/34 inspection at system/program level | → Phase 08 — SOC 2 / DPA audit acceptance |

> **Hinge rule (Conventions §4):** Acceptance / UAT / pen-test sign-off are *validation* activities. They reuse T/D mechanics but are **not** assigned a TC-VER here and **not** in §5 coverage. Named here only so the ladder is complete.

---

## 3. Continuous Scans (referenced, not duplicated)

The continuous SAST/DAST/dependency/secrets/IaC/conformance **scan & tool stack is owned by [Phase 06 Integration](../Phase_06_Integration/Integration_Plan.md)** (per the Phase-07 skill: cite, do not re-author). Phase 07 states only the **verification pass-criteria** each scan must meet to support TRR. *(Phase 06 Integration_Plan.md is not yet authored — the table reference and exact tool/version pins are `TODO: owed by Phase 06`; criteria below are the verification gates that table must satisfy.)*

| Scan class | Verifies (REQ thread) | Pass-criteria for TRR | Owning table |
|---|---|---|---|
| **SAST** (static analysis) | REQ-SEC-01/02/04 code paths | Zero new criticals/highs; no suppressions without waiver | Phase 06 scan table (TODO) |
| **DAST** (dynamic, running app) | REQ-SEC-01/03, REQ-INT-01 | Zero criticals; authZ/authN findings = 0 | Phase 06 scan table (TODO) |
| **Dependency / SCA** | supply-chain (REQ-D-02) | Zero critical CVEs in shipped deps; SBOM generated | Phase 06 scan table (TODO) |
| **Secrets scan** | REQ-SEC-03, REQ-INT-03 (no PAN/keys in code) | Zero verified secrets in repo/history | Phase 06 scan table (TODO) |
| **IaC scan** | REQ-SEC-03, REQ-C-01 (cloud config) | Zero high misconfigs on tenant-data resources | Phase 06 scan table (TODO) |
| **Conformance** | REQ-INT-02 (SCIM 2.0 RFC 7644) | SCIM conformance suite passes 100% | Phase 06 scan table (TODO) |

A scan failing its pass-criteria is a **TRR blocker** and raises/updates an `RSK-<nn>` (Risk thread).

---

## 4. Reviews & Inspections (gate ladder)

Gate criteria are **not** restated here — cited from Conventions §3. This phase owns **TRR**.

| Gate | Owning phase | This phase's relation | Date |
|---|---|---|---|
| SRR | 02 | Inbound — requirements baseline verified as the spec under test | TODO (Phase 02 peer review owed) |
| PDR | 04 | Inbound — isolation/erasure design accepted (RSK-01/02) feeds TC-VER-20/27 method | TODO |
| CDR | 06 | Inbound — **product baseline + frozen ICDs**; verification runs against this baseline | TODO |
| **TRR** | **07** | **Owned** — 100% method coverage, env + data ready (§7) | TODO |
| PRR | 08 | Outbound — validation ≥ targets, zero S1; acceptance hinge from §2 | TODO |

Structured reviews (isolation design review, RoPA inspection, PCI-boundary inspection) are **Inspections** (code `I`, Conventions §4) — their minutes/checklists are the evidence, archived per §6.

---

## 5. Coverage Summary (the TRR rollup)

| Metric | Value |
|---|---|
| REQs total | **35** |
| Verified by **T** (only) | 17 — REQ-F-01/02/03/04/08, REQ-U-01, REQ-P-01/02/03/04, REQ-SEC-02/04/07/08, REQ-INT-01/02/04 |
| Verified by **I** (only) | 7 — REQ-O-04, REQ-SEC-06, REQ-INT-03, REQ-C-01/02, REQ-D-01/02 |
| Verified by **A** (only) | 2 — REQ-O-01, REQ-O-02 |
| Verified by **D** (only) | 6 — REQ-F-05/06/07, REQ-U-03, REQ-O-03, REQ-SEC-05 |
| Verified by combination **I + T** | 3 — REQ-U-02, REQ-SEC-01, REQ-SEC-03 |
| **Sum** | 17 + 7 + 2 + 6 + 3 = **35** ✅ (every REQ has ≥ 1 method) |
| REQs with **no method** | **0** ✅ (stop-the-line if > 0) |
| REQs with **no TC-VER** | **0** ✅ (zero `TC-VER-TBD` survive — stop-the-line if > 0) |
| REQs whose **tool is TODO** | 1 flagged — REQ-P-03 (load profile owed by Phase 06); plus Phase-06 scan table tools `TODO` |
| Distinct TC-VER assigned | **34** (TC-VER-01 … TC-VER-34); TC-VER-30 shared by REQ-INT-03 + REQ-C-02 → all 35 REQ rows covered |

> **By-class check:** F:8 ✅ · U:3 ✅ · P:4 ✅ · O:4 ✅ · SEC:8 ✅ · INT:4 ✅ · C:2 ✅ · D:2 ✅ = **35/35**. Every SN-01…SN-12 thread (SysRS §11) remains covered backward (test → REQ → SN); bidirectional trace intact on the SEC privacy/isolation thread.
>
> **Caveat repeated:** coverage is 100% **by method**, not by *pass*. No TC-VER has been *executed* yet (all `result.md` stubbed, §6). 100% green here is necessary, **not sufficient**, for TRR — the worst-case cells (TC-VER-15 noisy-neighbor, TC-VER-27 backup erasure, TC-VER-20 cross-tenant) must be red-teamed to confirm the tests would actually exercise the failure mode.

---

## 6. Evidence Archive

The single convention (Phase-07 skill):

```
Phase_07_Verification/
├── Verification_Matrix.md   (this file)
├── VnV_Plan.md
└── verification-evidence/
    ├── TC-VER-01/  ├─ <logs / load report / capture>  └─ result.md
    ├── TC-VER-02/  └─ ...
    └── TC-VER-34/
```

Each `verification-evidence/TC-VER-<nn>/result.md` is a 1-pager: **setup · observation · measured value vs threshold · pass/fail · evidence-file list · executor sign-off**. Anomalies route to Phase 08 severity `S1`–`S4` (Conventions §5.1) and to Phase 09 change control. *(All 34 `result.md` are stubbed at Draft; population is the body of test execution post-TRR.)*

---

## 7. TRR Readiness (exit-gate checklist)

Gate: **TRR (Test Readiness Review)** — criteria cited from Conventions §3 (not restated).

- [x] **100%** of REQs (35/35) have a finalised T/I/A/D method — zero unassigned (§5).
- [x] **100%** of REQs have ≥ 1 `TC-VER-<nn>` — zero `TC-VER-TBD` survive (§5).
- [x] Every method justified against verifiability; Phase-02 seed overrides noted (REQ-U-02, REQ-O-01, REQ-SEC-01, REQ-SEC-03).
- [x] Every tool named (no bare "Manual"); the one unknown flagged `TODO` (REQ-P-03 load profile).
- [ ] `VnV_Plan.md` finalised; IEEE 1012 integrity level set; IV&V decision recorded — **TODO** (companion deliverable; isolation/privacy thread is high-criticality → IV&V expected).
- [ ] Test environment + data ready per Phase 06 CI/CD; a tool **dry-run** done (not just naming) — **TODO: owed by Phase 06** (Integration_Plan.md not yet authored).
- [ ] Continuous scans (§3) configured and passing pass-criteria — **TODO: owed by Phase 06**.
- [x] `verification-evidence/` structure created; per-TC `result.md` to be stubbed.
- [x] Acceptance/UAT/pen-test explicitly deferred to Phase 08 (§2 hinge) — not counted here.
- [ ] All blocking defects fixed; test team trained — **TODO** (pre-execution).
- [x] Necessary-but-not-sufficient caveat stated (banner + §5).

**TRR gate decision:** **Hold (Proceed-with-actions pending)** — method/TC coverage is 100% (the matrix is complete), but TRR cannot pass until the Phase-06 environment/scan stack and the `VnV_Plan.md` IV&V decision land. Clear the four open `TODO`s, then re-run TRR. *(Decision recorded per Conventions §3; coverage ≠ readiness.)*

---

## 8. Traceability back to the spine

Forward `REQ → TC-VER`; backward `TC-VER → REQ → SN` (Conventions §8). Representative threads (full SN→REQ map in [SysRS §11](../Phase_02_Requirements/SysRS.md#11-traceability-sn--req--method--verifying-activity); MOP/TPM in §10):

| SN (StRS) | REQ | Verifying TC-VER | MOP/TPM |
|---|---|---|---|
| SN-04 isolation | REQ-SEC-01, REQ-C-01 | TC-VER-20, TC-VER-32 | MOP-11 |
| SN-05 erasure | REQ-SEC-07, REQ-SEC-08, REQ-O-04, REQ-D-01 | TC-VER-26, TC-VER-27, TC-VER-19, TC-VER-33 | MOP-13 → TPM-04 |
| SN-01 pipeline | REQ-F-01, REQ-P-02, REQ-U-01 | TC-VER-01, TC-VER-13, TC-VER-09 | MOP-01, MOP-04 |
| SN-06 availability | REQ-O-01, REQ-O-02, REQ-O-03 | TC-VER-16, TC-VER-17, TC-VER-18 | MOP-09 → TPM-01 |
| SN-03 identity | REQ-INT-01, REQ-INT-02 | TC-VER-28, TC-VER-29 | MOP-07 |
| SN-07 scale | REQ-P-01, REQ-P-03, REQ-P-04 | TC-VER-12, TC-VER-14, TC-VER-15 | MOP-05/06 → TPM-02/03 |

Model back-link (Phase 03 `Requirements_Diagram.puml`): replace `TC-VER-TBD` `<<verify>>` edges with these real `TC-VER-<nn>` ids — **TODO** (Phase 03 diagram not yet authored).

---

*Conforms to [`../../../05_Conventions.md`](../../../05_Conventions.md): IDs (§2), gates incl. TRR (§3), T/I/A/D (§4), severity (§5), baselines (§3), citations (§9). This phase realises the ISO/IEC/IEEE 15288:2023 Verification process, governed by IEEE 1012-2016; test documentation follows ISO/IEC/IEEE 29119-3:2021.*
