---
Document: TalentFlow — Operations & Continuous Validation
Document ID: OPS-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Transition · Operation · Maintenance); IEEE 1012-2016
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# TalentFlow — Phase 10 Operations & Continuous Validation

Fields the validated system and keeps it meeting the [SysRS](../Phase_02_Requirements/SysRS.md) over its operational life. Owns the **ORR** (one-time) and **GA** (continuous) gates per Conventions §3, then runs the continuous loop: SLOs + error budgets, observability, the continuous-testing/continuous-regression pipeline, chaos engineering, security/compliance cadence, OTA/release governance with rollback, runbooks, and incident management — closing every SysRS-affecting finding back through a Phase 09 `CR-<nn>`.

This document conforms to [`../../../05_Conventions.md`](../../../05_Conventions.md) for all shared conventions (IDs `SLO-<nn>`/`RB-<nn>`/`CR-<nn>`, gates ORR/GA, T/I/A/D methods, S1–S4 severity, baselines, status strings, §9 citations) — cited, never redefined.

> **OUTSIDE-MATERIAL / Google-SRE marker.** §3 (SLOs · SLIs · error budgets · burn-rate) and the §3.3 burn policy use the **Google SRE** model (Beyer et al., *Site Reliability Engineering*, 2016; *The SRE Workbook*, 2018) — **not** course-KB canon. It is industry-standard and complements IEEE 1012-2016 continuous V&V, but it is tailored here, not presented as canon.

---

## 1. Purpose & Scope

Keep deployed TalentFlow meeting the SysRS for the rest of its life, with strict per-tenant isolation (SN-04 → REQ-SEC-01) and provable privacy (SN-05 → REQ-SEC-08) never regressing in service. This phase realises the ISO/IEC/IEEE 15288:2023 **Transition**, **Operation**, and **Maintenance** processes; **Disposal** (tenant offboarding + NIST SP 800-88 crypto-erase) is owned by [Phase 11](../Phase_11_Disposal/) and only cross-referenced here (§12).

**Inputs consumed (per stage skill):**

| Source phase | Consumed here | Status in this example |
|---|---|---|
| [Phase 02 SysRS](../Phase_02_Requirements/SysRS.md) | every `REQ-P-*` / `REQ-O-*` + `MOP-*` / `TPM-*` — the source of all SLOs | **Baseline (pending SRR sign-off)** — used directly |
| Phase 06 Integration_Plan | CI/CD pipeline + environments the continuous-testing pipeline runs on; load profile for `REQ-P-03` | `TODO: owed by Phase 06` — placeholders below |
| Phase 07 Verification_Matrix | `TC-VER-*`; method-**A** REQs (REQ-O-02) become operational dashboards; regression seed | `TODO: owed by Phase 07` — `TC-VER-TBD` per SysRS §11 |
| Phase 08 Test_Plan / Test_Cases | `TC-VAL-*`; the load baseline re-run for drift; S1–S4 defect taxonomy reused for incidents | `TODO: owed by Phase 08` |
| Phase 09 Change/Config Mgmt | the CCB/CR loop + semver every deploy routes through; `CI-*` register | `TODO: owed by Phase 09` — `CR-TBD` placeholders; loop-back target named |

> Where a prior artifact is not yet written, this doc carries a `TODO: <owed by Phase NN>` and a convention-grammar placeholder rather than inventing a number (per stage skill rule).

---

## 2. Transition & ORR Readiness

Realises 15288 **Transition**: get validated TalentFlow into service and accepted into operations without breaking isolation or losing data.

### 2.1 Operating model (who runs it)

| Function | Responsibility | Stakeholder |
|---|---|---|
| **SRE / Platform (on-call)** | Own SLOs, error budgets, observability, OTA, failover, incident command. | STK-07 |
| **Privacy & Compliance Ops** | Erasure/DSAR queue (REQ-SEC-07/08), DPA evidence, audit-log production (REQ-SEC-04), SOC 2/ISO 27001 control evidence (REQ-D-02). | STK-05, STK-09 |
| **Security Ops** | Threat hunt, vuln management, OTA artifact signing, pen-test cadence. | STK-05 |
| **Customer Success / Support** | Tenant onboarding (SSO/SCIM), recruiter support, status comms. | STK-04, STK-01 |
| **Product / Release Owner** | Release approval, error-budget trade-offs, roadmap re-plan. | STK-06 |

### 2.2 Transition / fielding plan

| Item | Plan |
|---|---|
| **Deployment strategy** | Cohort canary → wave rollout on a multi-tenant shared platform (see §8); zero-downtime staged deploy with auto-rollback on failed health checks — **satisfies REQ-O-03**. |
| **Tenant cutover / onboarding** | Per-tenant onboarding via SSO (REQ-INT-01) + SCIM provisioning (REQ-INT-02) — exercises **SCN-02**; enters **Maintenance** mode (SysRS §9) per tenant, no fleet-wide downtime. |
| **Data migration** | Per-tenant import tooling (RSK-05 time-to-value mitigation); import writes are tenant-scoped through the Tenant Isolation Layer (REQ-SEC-01) — no cross-tenant leakage during import. |
| **Environment provisioning** | Infrastructure-as-code, per-region; multi-AZ datastore + KMS for per-tenant key separation (REQ-SEC-03) provisioned before first tenant. `TODO: IaC repo ref owed by Phase 06`. |
| **Back-out plan** | Auto-rollback to previous signed artifact (§8); on a severe data-integrity incident the platform enters **Read-Only / Safe** mode (SysRS §9) to protect tenant data before rollback. |
| **Operator handover (HSI)** | Runbooks RB-01…RB-08 (§9) + on-call training + dashboard walkthrough signed off before ORR. `TODO: training completion date owed`. |
| **Acceptance into operations** | ORR sign-off (§11) by SRE + Security + Privacy + Product. |

### 2.3 ORR decision

ORR is a gate, not a formality (Proceed · Proceed-with-actions · Hold · Stop). The five ORR pillars (Conventions §3: deployment, runbooks, SLOs, on-call, rollback) are walked in §11. **Recommendation:** `TODO` until §11 checklist closes; current blocking items are the unwritten Phase 06–09 inputs (CI/CD pipeline, TC-VER/TC-VAL IDs, CCB/CR loop) — until those exist, the standing recommendation is **Hold → Proceed-with-actions**.

---

## 3. SLOs & Error Budgets — `SLO-<nn>` *(OUTSIDE-MATERIAL / Google-SRE — tailored)*

Every `REQ-P-*` and `REQ-O-*` maps to ≥ 1 `SLO-<nn>` (Conventions §2.4). Targets are **read from the REQ threshold / linked MOP**, not gut-felt. SLIs follow the SLO-derivation cheatsheet (Appendix A).

### 3.1 SLO register

| SLO | SLI (Service Level Indicator) | Target | Window | Linked REQ | MOP/TPM |
|---|---|---|---|---|---|
| **SLO-01** | API availability = successful requests / total, at the gateway | ≥ 99.95% | 30 d (calendar month) | REQ-O-01 | MOP-09 → **TPM-01** |
| **SLO-02** | Candidate-record read latency p95 / p99 at the API boundary | p95 ≤ 300 ms / p99 ≤ 600 ms | 28 d rolling | REQ-P-01 | MOP-05 → **TPM-02** |
| **SLO-03** | Stage-transition write latency p95 | ≤ 500 ms | 28 d rolling | REQ-F-01, REQ-P-02 | MOP-01 |
| **SLO-04** | Tenant-scoped search response p95 | ≤ 500 ms | 28 d rolling | REQ-F-02 | MOP-02 |
| **SLO-05** | Sustained throughput at SLO + noisy-neighbor isolation (no tenant pushes another's p95 past target) | `TODO: req/s — load profile owed by Phase 06` | 28 d rolling | REQ-P-03, REQ-P-04 | MOP-06 → **TPM-03** |
| **SLO-06** | Failover RTO / RPO during single-AZ loss | RTO ≤ 15 min / RPO ≤ 5 min | per-event (verified by REQ-O-02 method **A** + chaos GD-02) | REQ-O-02 | MOP-10 |
| **SLO-07** | Application-to-record creation time (careers portal) | ≤ 3 s (threshold ≤ 5 s) | 28 d rolling | REQ-F-04 | MOP-03 |
| **SLO-08** | SCIM provisioning propagation time | ≤ 60 s (threshold ≤ 300 s) | 7 d rolling | REQ-INT-02 | MOP-07 |
| **SLO-09** | Integration retry success without data loss (queue-and-retry) | ≥ 99.9% | 7 d rolling | REQ-INT-04 | MOP-08 |
| **SLO-10** | Cross-tenant access attempts that **succeed** (isolation integrity) | **0** (hard) | continuous | REQ-SEC-01 | MOP-11 (MOE-02) |
| **SLO-11** | PII-access events captured in the tamper-evident audit log | 100% | continuous | REQ-SEC-04 | MOP-12 |
| **SLO-12** | Erasure / export completed within the legal window | 100% (≤ 30 d for erasure; access within legal window) | per-request | REQ-SEC-07, REQ-SEC-08 | MOP-13 → **TPM-04** |

**REQ→SLO coverage:** every Performance REQ (REQ-P-01…04) and every Operational REQ (REQ-O-01…03) maps to an SLO above. **REQ-O-04** (retention) is a binary retention-check SLI rolled into compliance monitoring (§7); **REQ-U-01** task-time (MOP-04) is tracked via RUM (§4) as a UX indicator, not an availability SLO. The security-/privacy-thread SLOs (SLO-10/11/12) are added beyond the strict P/O set because their REQs are S1-severity-on-breach and must be monitored continuously (RSK-01, RSK-02). *No Performance/Operational REQ is left without an SLO.*

### 3.2 Error budgets

Error budget = `1 − target` over the window (OUTSIDE-MATERIAL / Google-SRE).

| SLO | Budget (per window) | Notes |
|---|---|---|
| SLO-01 | 0.05% of requests / month (≈ 21.6 min full-outage equivalent) | headline reliability; ties to TPM-01. |
| SLO-02 / 03 / 04 / 07 | fraction of requests allowed to exceed the p95 threshold (= `1 − 0.95` budget on the tail) | latency budgets. |
| SLO-06 | `TODO` — RTO/RPO are per-event objectives, not a rate budget; tracked as breach count. |
| **SLO-10 / SLO-11 / SLO-12** | **Zero-tolerance — no error budget.** Any breach is an immediate S1 incident + Phase-09 loop-back CR. | isolation, audit completeness, erasure completeness are legal/trust hard limits — not traded against velocity. |

### 3.3 Burn-rate & freeze policy *(OUTSIDE-MATERIAL / Google-SRE — tailor; routes through Phase-09 CCB)*

```
0–50% budget used .... ship freely
50–100% used ......... ship with caution; non-critical changes need SRE sign-off
>100% (exhausted) .... freeze non-critical changes via the Phase-09 CCB; S1/S2 fixes only; daily review
Burn-rate alerts:  2%/1h → page on-call · 5%/6h → page + manager · 10%/3d → CCB-gated change-freeze
```

The change-freeze is **not** an independent ops decision — it routes through the **Phase 09 CCB** (a freeze with no governance is theatre). SLO-10/11/12 bypass the budget ladder: a single breach triggers freeze + incident directly.

---

## 4. Observability

Four pillars; tools are defaults (the team may swap — KB-18 "no single tool fits all"). Per pillar: what's instrumented, retention, dashboard owner, alert route. **RED** for request-driven services, **USE** for resources (Appendix A).

| Pillar | What's instrumented | Default tool | Retention | Owner / alert route |
|---|---|---|---|---|
| **Metrics** | RED per service (gateway, Pipeline, Search, Privacy/Erasure, Identity); USE on datastore/queue/index; **tenant-id label** on every series for noisy-neighbor (REQ-P-04) and isolation (REQ-SEC-01) views | Prometheus + Grafana | `TODO` (e.g. 15 mo) | SRE → PagerDuty |
| **Logs** | Structured events with **correlation ID + tenant ID**; the tamper-evident **audit log** (REQ-SEC-04) on a separate write-once path with restricted access | Loki + Grafana | audit log ≥ legal/SOC 2 window (REQ-O-04); app logs `TODO` | SRE + Compliance |
| **Traces** | Distributed request flow app → gateway → service → datastore; trace carries tenant context to prove no cross-tenant hop | OpenTelemetry + Tempo | `TODO` | SRE |
| **RUM** | Recruiter web app + careers portal: task-time (MOP-04/REQ-U-01), JS errors, web vitals; accessibility signal feed for REQ-U-02 | Sentry / Datadog RUM | `TODO` | Product + SRE |
| **Synthetic** | k6 / Playwright probes: auth+SSO flow, pipeline advance, erasure submit, search — alert on SLO miss | k6 + Playwright | n/a | SRE |

**Curated dashboards:**
- **Recruiter Experience** — SLO-02/03/04/07, RUM task-time (MOP-04), error rate.
- **Tenant Isolation & Privacy** — SLO-10 (cross-tenant=0), SLO-11 (audit completeness), SLO-12 (erasure SLA), per-tenant resource view. *Reviewed in every gate (RSK-01, RSK-02).*
- **Reliability** — SLO-01 availability + error budget burn, SLO-06 failover, dependency health (Nominal/Degraded mode, SysRS §9).
- **Compliance** — REQ-O-04 retention checks, audit-evidence production time (MOE-06), SCIM (SLO-08), Stripe SAQ-A boundary (REQ-INT-03).

---

## 5. Continuous-Testing Pipeline

The KB-18 continuous-validation loop that Phase 09 defers here. Two layers.

### 5.1 Per-commit / CI (shift-left, fail-fast)

The 5 KB-18 principles, applied to TalentFlow:

| Principle | Applied |
|---|---|
| **Shift-left** | Tests defined alongside code, BDD-first; **isolation test** (a request authenticated as tenant A is denied tenant B's data — REQ-SEC-01/SLO-10) is written before the data-access path and runs on every PR. |
| **Test automation in CI/CD** | Full suite on every commit/PR + nightly; `TODO: pipeline ref owed by Phase 06`. |
| **Fail-fast feedback** | PR blocked on any unit/integration failure; **any cross-tenant test failure is a hard block** (no override). |
| **Environment consistency** | Containers/IaC, ephemeral per-PR env seeded with ≥ 2 tenants to exercise isolation realistically. |
| **Service virtualization** | Mocks/simulators for the IdP (SAML), SCIM, calendar, email, job-board, HRIS, and Stripe so partner outages don't block CI (reuses Phase-06 stubs); contract tests (RSK-04) run against recorded partner contracts. |

**Test-type ladder (KB-18, smallest→largest scope):** unit → integration → system → regression → UAT, automated by layer (unit *very fast*; system/e2e *slower*; perf/security *varies*). Maps to `TC-VER-*` (Phase 07) and `TC-VAL-*` (Phase 08) — IDs `TBD` until those phases assign them (SysRS §11).

### 5.2 Post-GA continuous regression (runs forever, not just in CI)

| Activity | Cadence | Linked |
|---|---|---|
| Conformance regression (functional REQ-F-*, isolation REQ-SEC-01) | nightly | TC-VER-TBD, SLO-10 |
| k6 / Playwright SLO synthetic probes | continuous / hourly | SLO-01..04, SLO-07, SLO-12 |
| Per-deploy smoke gate (promotion blocker) | every deploy | §8 cohorts |
| Re-run Phase-08 load test vs. staging (catch **drift**) | weekly | REQ-P-03, SLO-05, TPM-03 |
| Erasure-completeness audit (PII absent across primary, index, object store, backups) | nightly + per-request | REQ-SEC-08, SLO-12, TPM-04 |
| Chaos game day (§6) | quarterly (first ≤ 30 d post-GA) | REQ-O-02, REQ-INT-04 |
| External penetration test | annual + on major release | §7, RSK-01 |

---

## 6. Chaos Engineering

Game-day catalog; each states hypothesis, injected failure, **blast-radius limit**, abort criteria, linked REQ, and the runbook it feeds. First game day scheduled **within 30 days of GA**. Minimum starter set ≥ 4.

| ID | Hypothesis | Failure injected | Blast radius | Abort if | Linked REQ → RB |
|---|---|---|---|---|---|
| **GD-01** | Single-AZ loss keeps core pipeline read/write within RTO ≤ 15 / RPO ≤ 5 min | Kill one AZ / DB primary | 1 AZ, staging-mirrored tenants only | SLO-01 burn > 10%/3d or data-integrity check fails | REQ-O-02, SLO-06 → RB-04 |
| **GD-02** | Region/dependency degradation → graceful **Degraded** mode (queue+retry), no data loss | Partition calendar/email/job-board partner API | non-critical integrations only; core untouched | core pipeline write fails | REQ-INT-04, REQ-O-02, SLO-09 → RB-05 |
| **GD-03** | A noisy tenant cannot push another tenant's p95 past target | Flood tenant A with load | 2 synthetic tenants, capped | tenant B p95 breaches SLO-02 (that **is** the finding) | REQ-P-04, SLO-05 → RB-03 |
| **GD-04** | A bad release auto-rolls-back before it reaches Wave 1 | Deploy artifact that fails health checks to canary | canary cohort (1–5%) only | rollback does not trigger in `TODO` min | REQ-O-03 → RB-06 |
| **GD-05** | Isolation holds under fault — no cross-tenant read appears when a service is degraded | Degrade Tenant Isolation Layer dependency | synthetic tenants only | **any** cross-tenant read observed → immediate S1 | REQ-SEC-01, SLO-10 → RB-01 |

Outcomes feed runbooks and the §5.2 regression suite. *(Chaos engineering itself is industry practice, complementary to IEEE 1012 continuous V&V.)*

---

## 7. Security & Compliance Cadence

| Activity | Cadence | Linked |
|---|---|---|
| External penetration test | annual + on major release (pre-GA pen-test is a Concept Conditional-Go condition, RSK-01) | REQ-SEC-01, REQ-D-02 |
| Internal security review / threat-model refresh (`THR-*`) | quarterly | REQ-SEC-*; Threat thread |
| SOC 2 Type II evidence collection + ISO 27001 control review | continuous evidence; annual audit | REQ-D-02, MOE-06 |
| Privacy DPIA review | annual + on any candidate-PII data-flow change | REQ-D-01, RSK-02 |
| Erasure / DSAR queue review (REQ-SEC-07/08) | weekly + per-request SLA | SLO-12, TPM-04 |
| Crypto-suite review (deprecate weak algorithms, confirm AES-256 at-rest + per-tenant key separation) | quarterly | REQ-SEC-03 |
| Stripe SAQ-A boundary attestation (no PAN reaches TalentFlow) | annual | REQ-INT-03, REQ-C-02 |

**Vulnerability-response SLA** (CVSS → S1–S4, Conventions §5.1): S1 Critical (CVSS ≥ 9.0) < 7 d · S2 Major (7.0–8.9) < 30 d · S3 Minor (4.0–6.9) < 90 d · S4 (< 4.0) next planned release. New regulation or vendor deprecation → loop-back `CR-<nn>` (§10).

---

## 8. OTA / Release Governance

Every deployed change is a **Phase-09 `CR-<nn>`** against a baselined `CI-<nn>` — **no out-of-band pushes**; the error-budget freeze (§3.3) routes through the **Phase-09 CCB**.

**Cohorts (per-tenant cohorting; defaults — calibrate):**
```
Canary 1–5%  (24 h bake) → Wave 1 10–25% (48 h) → Wave 2 50% (72 h) → Full 100%
```
- **Gating metrics per cohort:** SLO-01 burn, error/crash rate, SLO-02/03 latency regression, ticket spike, **and SLO-10 cross-tenant=0** (a single cross-tenant hit blocks promotion outright).
- **Auto-rollback:** automatic to the previous signed artifact on any hard gate breach — **satisfies REQ-O-03** (auto-rollback on failed health checks). Ambiguous/partial signals → manual rollback via RB-06. Isolation/privacy breach (SLO-10/11/12) → always-auto rollback.
- **Audit log (per push):** `CR-<nn>` ref · signed artifact hash · cohort progression log · gating outcome · rollback (if any). Retained per REQ-O-04 / SOC 2. Satisfies the §8 OTA-governance ORR pillar and feeds REQ-D-02 control evidence.

> Schema migrations run in **Maintenance** mode (SysRS §9), expand-then-contract, so a rollback never strands data.

---

## 9. Runbooks — `RB-<nn>` index

Real files under [`runbooks/`](runbooks/). Structure: **Symptom → Triage → Mitigation → Resolution → Post-incident trigger**, with linked `SLO-<nn>` / `REQ-*` / `CR-<nn>`. ≥ 1 runbook seeded per SLO alert before ORR (the gate is not met by an empty folder).

| RB | Alert / failure mode | Linked SLO → REQ |
|---|---|---|
| [**RB-01**](runbooks/RB-01-cross-tenant-access.md) | Cross-tenant access attempt succeeded (isolation breach) | SLO-10 → REQ-SEC-01 |
| [**RB-02**](runbooks/RB-02-erasure-sla-breach.md) | Erasure / DSAR approaching or past legal window | SLO-12 → REQ-SEC-07/08 |
| [**RB-03**](runbooks/RB-03-latency-slo-burn.md) | Read/transition/search latency SLO burn (incl. noisy-neighbor) | SLO-02/03/04/05 → REQ-P-01..04 |
| [**RB-04**](runbooks/RB-04-availability-failover.md) | Availability SLO burn / AZ failover | SLO-01/06 → REQ-O-01/02 |
| [**RB-05**](runbooks/RB-05-integration-degraded.md) | Integration partner down → Degraded mode | SLO-09 → REQ-INT-04 |
| [**RB-06**](runbooks/RB-06-bad-release-rollback.md) | Bad release / auto-rollback | — → REQ-O-03 |
| [**RB-07**](runbooks/RB-07-audit-log-gap.md) | Audit-log capture gap (PII access not logged) | SLO-11 → REQ-SEC-04 |
| [**RB-08**](runbooks/RB-08-sso-scim-failure.md) | SSO auth failure / SCIM provisioning stall | SLO-08 → REQ-INT-01/02 |

---

## 10. Incident Management & Loop-Back to the SysRS

- **Severity:** `S1–S4` (Conventions §5.1; `SEV-n` is the accepted ops alias — **this doc uses `S1–S4` consistently**), reusing the Phase-08 defect taxonomy. S1 = isolation breach (REQ-SEC-01), data loss, PII breach/erasure failure (REQ-SEC-08), or total loss of pipeline; S2 = major degradation / one core service impaired; S3 = minor; S4 = cosmetic.
- **On-call rotation:** SRE primary + secondary, 24×7 across customer time zones (SN-06); Security and Privacy on-call for SLO-10/11/12 alerts.
- **Incident commander (IC):** single accountable role per incident; declares severity, owns comms (tenant status page), authorises Read-Only/Safe mode (SysRS §9) and rollback.
- **PIR:** blameless post-incident review within 5 business days — timeline, **5-whys** root cause, what worked / didn't, action items (owner / due / linked CR), and **SysRS impact** (REQs to revisit + `CR-<nn>` filed).

**Loop closure (non-optional):** any **S1/S2** incident exposing a missing or weak REQ files a **`CR-<nn>` via Phase 09 (`se-phase-09-change-config`)** to update the SysRS — then re-baseline. Examples: a cross-tenant read (RSK-01) → CR strengthening REQ-SEC-01; surviving PII after erasure (RSK-02) → CR strengthening REQ-SEC-08. SLO breaches also update margins in the `TPM_Tracker.md` (TPM-01..04).

```
SysRS ◀── CR (Phase 09) ◀── PIR ◀── Incident ◀── Alert ◀── SLO/Observability
  │                                                              ▲
  └────── REQ → SLO derivation (§3) ─────────────────────────────┘
```

---

## 11. Gates — ORR (one-time) + GA (continuous)

### 11.1 ORR checklist (Conventions §3 — owned by this phase)

- [x] Transition/deploy + cutover + back-out plan defined; operator handover via RB-01…RB-08 (§2.2). *Training completion date `TODO`.*
- [x] Every `REQ-P-*` and `REQ-O-*` maps to an `SLO-<nn>` — no uncovered Performance/Operational REQ (§3.1).
- [x] Observability stack chosen; dashboard owners + alert routes assigned; RED + USE instrumented (§4). *Retentions `TODO`.*
- [x] On-call rotation + incident-commander role defined (§10).
- [x] Rollback defined — auto on hard SLO/crash breach, manual (RB-06) for ambiguous, always-auto on isolation/privacy paths (§8).
- [x] ≥ 1 real `RB-<nn>` file per SLO alert exists (§9, [`runbooks/`](runbooks/) — 8 files).
- [ ] **Blocking:** Phase 06 CI/CD pipeline, Phase 07 `TC-VER-*`, Phase 08 `TC-VAL-*` + load baseline, Phase 09 CCB/CR loop — **`TODO: owed by Phases 06–09`**. Until these exist, ORR is **Proceed-with-actions** at best, **Hold** for the formal gate.

### 11.2 GA condition (continuous, after ORR)

- [x] Error budgets per SLO **with** a burn policy routing the freeze through the Phase-09 CCB (§3.2–3.3).
- [x] Continuous-testing pipeline documented — per-commit (shift-left/fail-fast/env-as-code/service-virtualization/ladder) + post-GA regression cadence (§5).
- [x] ≥ 4 chaos game days defined (5: GD-01…GD-05); first scheduled within 30 d of GA (§6).
- [x] Vulnerability-response SLA mapped to S1–S4 (§7).
- [x] OTA cohorts + gating metrics + auto-rollback + `CR-<nn>` audit log defined (§8).
- [x] PIR template defined; S1/S2 → loop-back `CR-<nn>` via Phase 09 rule stated (§10).
- [x] Disposal explicitly handed to **Phase 11** (§12) — not authored here.
- [x] Conventions §6 frontmatter present; SRE core (§3, §3.3) marked **OUTSIDE-MATERIAL**.

**GA means:** live to all tenants with error budgets honoured continuously thereafter (Conventions §3). Recommend: first quarterly SLO + observability review scheduled; first chaos game day (GD-05 isolation) within 30 days of GA given RSK-01 priority.

---

## 12. Cross-References

- **Disposal / end-of-life** → [Phase 11](../Phase_11_Disposal/): tenant offboarding (SCN-05), retention windows (REQ-O-04), and **NIST SP 800-88 Rev. 1** crypto-erase + certificate of destruction. *Not authored here.*
- **Change governance** → Phase 09 (`se-phase-09-change-config`): every OTA push, every loop-back, and the error-budget freeze route through the CCB/CR loop against a baselined `CI-<nn>`. `TODO: Phase 09 not yet written` — `CR-TBD` placeholders resolve there.
- **Measurement** → SLOs operationalise `MOP-*`/`TPM-*` as live SLIs (SysRS §10); breaches update `TPM_Tracker.md` margins (TPM-01..04).
- **Requirements** → [SysRS](../Phase_02_Requirements/SysRS.md) is the source of every SLO; the SN→REQ→SLO thread (Conventions §8) is maintained bidirectionally on the privacy/security path.

---

## Appendix A — Embedded templates

**SLO-derivation cheatsheet** *(OUTSIDE-MATERIAL / Google-SRE)*

| REQ pattern | SLI | Target |
|---|---|---|
| "shall achieve N% availability" (REQ-O-01) | up/scheduled or success/total | N% over the REQ window |
| "shall respond within N ms p95" (REQ-P-01/02, REQ-F-01) | latency p95 at the boundary | ≤ N ms |
| "shall sustain N concurrent X" (REQ-P-03) | concurrent gauge + saturation alert | ≤ N (soft cap 0.8N) |
| "shall recover within RTO/RPO ≤ N" (REQ-O-02) | detected→resolved duration | p95 ≤ N |
| "shall not retain PII beyond policy" (REQ-O-04) | retention check on store | 100% (binary) |
| "0 cross-tenant access" (REQ-SEC-01) | successful cross-tenant attempts | 0 (hard, zero budget) |

**RED + USE**

| Method | For | Three metrics |
|---|---|---|
| **RED** | request-driven services (gateway, Pipeline, Search, Privacy, Identity) | Rate, Errors, Duration (p50/p95/p99) |
| **USE** | resources (datastore, queue, search index, KMS) | Utilization, Saturation, Errors |

**Error-budget burn policy** — see §3.3. **Vulnerability SLA** — see §7. **OTA cohorts** — see §8.

**PIR template:** date/duration · severity (S1–S4) · incident commander · summary · timeline table · 5-whys root cause · what worked / didn't · action items (owner/due/linked CR) · **SysRS impact (REQs to revisit + `CR-<nn>` filed)**.
