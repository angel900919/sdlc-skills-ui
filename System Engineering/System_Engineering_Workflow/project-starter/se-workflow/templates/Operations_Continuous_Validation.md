---
Document: Operations & Continuous Validation Plan — <PROJECT NAME>
Document ID: OPS-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Transition / Operation / Maintenance); IEEE 1012-2016 (continuous V&V); ISO/IEC 27001:2022 + NIST SP 800-53 Rev. 5 (ops security)
Status: Draft
Owner: <role — e.g. SRE Lead / Operations Manager>
---

# Operations & Continuous Validation Plan — <PROJECT NAME>

> Blank template. Replace every `<ANGLE-BRACKET>` placeholder, resolve every `TODO:`, and delete every row marked `(example — delete)`. Conforms to [`../05_Conventions.md`](../05_Conventions.md) — cite shared conventions (IDs `SLO-NN`/`RB-NN`/`CR-NN`, gates ORR/GA, severity `S1–S4`, citations); do not redefine them.
>
> **OUTSIDE-MATERIAL / Google-SRE marker.** The **SLO · SLI · error-budget · burn-rate** model (§3) is from Google SRE practice (*Site Reliability Engineering*, 2016; *The SRE Workbook*, 2018) — **not** course canon. It complements IEEE 1012 continuous V&V; treat it as an outside, optional convention and **tailor** it.
>
> This phase **owns** continuous testing (the shift-left half Phase 09 defers, §5). Change governance (CCB/CR loop, semver) is **not** re-authored here — cite [`../Phase_09_Change_Config/Change_Management_Plan.md`]. End-of-life is **not** here — cite [`../Phase_11_Disposal/Disposal_Plan.md`].

---

## 1. Purpose & Scope

Keep the deployed system meeting the SysRS over its operational life: own the **ORR** (one-time, cleared to go live) and **GA** (live to all users; error budgets honoured continuously) gates, then run the continuous loop — SLOs, observability, continuous testing, chaos, security cadence, OTA governance, runbooks, incidents — feeding every SysRS-affecting finding back through a Phase-09 `CR-NN`.

**Scope:** <which deployed services / fleet / environments this plan governs>.

## 2. Transition & ORR Readiness

> Do **not** declare GA before ORR passes. ORR is met when all of {deployment, runbooks, SLOs, on-call, rollback} are in place ([`Conventions §3`](../05_Conventions.md)).

| Item | Plan | Status |
|---|---|---|
| **Deployment / migration strategy** | <blue-green / canary / phased install / big-bang> | TODO |
| **Data migration + cutover** | <approach; dry-run date> | TODO |
| **Environment provisioning (as-code)** | <IaC tool / repo> | TODO |
| **Back-out plan** | <how to revert the go-live> | TODO |
| **Operator handover / training (HSI)** | <materials; sign-off owner> | TODO |
| **Acceptance-into-operations sign-off** | <approver / date> | TODO |

**ORR vote (record at the gate):** <Proceed / Proceed-with-actions / Hold / Stop> — blocking items: <…>.

## 3. SLOs & Error Budgets  *(OUTSIDE-MATERIAL / Google-SRE — tailor; do not present as course canon)*

Every `REQ-P-*` (Performance) and `REQ-O-*` (Operational/Reliability) maps to ≥ 1 `SLO-NN`. Read each **target from the REQ threshold** — never gut-feel it. A REQ with no SLO is a gap: add the SLO or file a `CR-NN` to retire the REQ.

| SLO | SLI (Service Level Indicator) | Target | Window | Linked REQ |
|---|---|---|---|---|
| `SLO-01` | <successful sessions / total> | <≥ N%> | <28 d> | <REQ-F-NN> |
| `SLO-02` | <latency p95 at the boundary> | <≤ N ms> | <28 d> | <REQ-P-NN> |
| `SLO-03` | <up minutes / scheduled minutes> | <≥ N%> | <30 d> | <REQ-O-NN> |
| `SLO-04` | session-start success rate | ≥ 97% | weekly | REQ-F-03 | *(example — delete)* |

**SLO derivation cheatsheet** *(map the REQ pattern → SLI; don't copy targets)*

| REQ pattern | SLI | Target |
|---|---|---|
| "shall achieve N% availability" | up minutes / scheduled minutes | N% over the REQ's window |
| "shall respond within N ms p95" | latency p95 at the boundary | ≤ N ms |
| "shall sustain N concurrent X" | concurrent gauge + saturation alert | ≤ N (soft cap 0.8N) |
| "shall recover within MTTR ≤ N" | (detected → resolved) duration | p95 ≤ N |
| "shall retain logs N years" | retention check on object store | 100% (binary) |

**Error budget** = 1 − target over the window, per SLO. **Burn policy** *(tailor — the freeze routes through the Phase-09 CCB, not an independent ops call):*
```
0–50% budget used .... ship freely
50–100% used ......... ship with caution; non-critical changes need <SRE> sign-off
>100% (exhausted) .... freeze non-critical changes via the Phase-09 CCB; S1/S2 fixes only; daily review
Burn-rate alerts:  <2%/1h> → page on-call · <5%/6h> → page + manager · <10%/3d> → CCB-gated freeze
```
TODO: confirm burn-rate thresholds against this project's release cadence and risk appetite.

## 4. Observability

Four pillars; defaults below may be swapped ("no single tool fits all"). Instrument **RED** for request-driven services and **USE** for resources.

| Pillar | What | Tool (default → chosen) | Instrumented | Retention | Dashboard owner | Alert route |
|---|---|---|---|---|---|---|
| **Metrics** | numeric time-series (RED + USE) | Prometheus + Grafana → <chosen> | <what> | <N d> | <role> | <route> |
| **Logs** | structured event records (correlation IDs) | Loki + Grafana → <chosen> | <what> | <N d> | <role> | <route> |
| **Traces** | distributed request flow | OpenTelemetry + Tempo → <chosen> | <what> | <N d> | <role> | <route> |
| **RUM** | real-user web/mobile telemetry | Sentry / Firebase → <chosen> | <what> | <N d> | <role> | <route> |

**RED + USE**

| Method | For | Three metrics |
|---|---|---|
| **RED** | request-driven services | Rate, Errors, Duration (p50/p95/p99) |
| **USE** | resources (CPU, disk, queue) | Utilization, Saturation, Errors |

**Curated dashboards:** <e.g. User Experience · Fleet Health · Compliance · …>. TODO.

## 5. Continuous-Testing Pipeline  *(the shift-left half — owned here, deferred from Phase 09)*

**Per-commit / CI (shift-left, fail-fast).** The 5 principles + the test-type ladder:
- **Shift-left** — define/automate tests before/alongside code (BDD-first).
- **Test automation in CI/CD** — suite runs on every commit / PR / nightly.
- **Fail-fast feedback** — break the build early on the cheapest failing test.
- **Environment consistency** — containers/VMs as-code.
- **Service virtualization** — mocks/simulators when a dependency or hardware isn't available (reuses Phase-06 stubs/drivers).

Test-type ladder (smallest → largest scope, automated by layer):
`unit (very fast) → integration → system → regression → UAT`.

**Post-GA continuous regression (runs after release, not just in CI).**

| Activity | Cadence | Owner | Notes |
|---|---|---|---|
| Conformance / regression suite | <nightly> | <QA> | <…> |
| Synthetic probes (k6 / Playwright) alerting on SLO miss | <hourly> | <SRE> | links `SLO-NN` |
| Per-deploy smoke gating promotion | <per deploy> | <SRE> | |
| Re-run Phase-08 load test against staging (drift) | <weekly> | <perf> | |
| Chaos game day | <quarterly> | <SRE> | see §6 |
| External pen test | <annual> | <Security> | see §7 |

## 6. Chaos Engineering

Define ≥ 4 game days (tool: <Gremlin / Litmus / Chaos Toolkit / in-house>). **First game day within 30 days of GA.** Each states a hypothesis, the failure injected, a **blast-radius limit**, abort criteria, the linked REQ, and the runbook it feeds.

| Game day | Hypothesis | Failure injected | Blast-radius limit | Abort criteria | Linked REQ | Feeds RB |
|---|---|---|---|---|---|---|
| <GD-01> | <…> | <network partition> | <1 AZ> | <…> | `REQ-O-NN` | `RB-NN` |
| <GD-02> | <…> | <region/AZ failover> | <…> | <…> | `REQ-O-NN` | `RB-NN` |
| <GD-03> | <…> | <bad OTA push> | <canary only> | <…> | `REQ-O-NN` | `RB-NN` |
| <GD-04> | <…> | <cert expiry / DB primary kill> | <…> | <…> | `REQ-SEC-NN` | `RB-NN` |

## 7. Security & Compliance Cadence

| Activity | Cadence | Owner |
|---|---|---|
| External penetration test | <annual> | <Security / vendor> |
| Internal penetration test | <quarterly> | <Security> |
| Compliance audit (<domain certs>) | <re-cert cadence> | <Compliance> |
| Privacy DPIA | <per significant change> | <Privacy Officer> |
| Crypto-suite review | <quarterly> | <Security> |

**Vulnerability-response SLA** (map CVSS → `S1–S4`): S1 Critical (CVSS ≥ 9.0) `< <7 d>` · S2 Major (7.0–8.9) `< <30 d>` · S3 Minor (4.0–6.9) `< <90 d>` · S4 Cosmetic (< 4.0) next planned release. New regulation / vendor deprecation → loop-back `CR-NN` (§10).

## 8. OTA / Deployment Governance

Every deployed change is a **Phase-09 `CR-NN`** — no out-of-band pushes.

| Cohort | Size | Bake time | Gating metrics (promote only if no regression) |
|---|---|---|---|
| Canary | <1–5%> | <24 h> | SLO burn, crash rate, ticket spike |
| Wave 1 | <10–25%> | <48 h> | same |
| Wave 2 | <50%> | <72 h> | same |
| Full | 100% | — | — |

- **Auto-rollback:** automatic on any hard gate breach; manual runbook (`RB-NN`) for ambiguous cases. **Mandatory-auto on safety-critical paths.**
- **Audit log per push:** `CR-NN` ref · signed artifact hash · cohort log · outcome. Failed promotion auto-rolls back and files a retrospective `CR-NN`.

## 9. Runbooks — RB-NN Index

> A runbook is a **real file**, not a promise. Seed ≥ 1 `RB-NN` under `runbooks/RB-NN-<slug>.md` per SLO alert **before ORR** — an empty `runbooks/` folder fails the gate. Use [`Runbook.md`](Runbook.md) as the per-file template.

| RB | Alert / failure mode | Trigger | Linked SLO / REQ | File |
|---|---|---|---|---|
| `RB-01` | <…> | <alert name + condition> | `SLO-NN` / `REQ-*` | `runbooks/RB-01-<slug>.md` |
| `RB-NN` | <one per SLO alert + per chaos failure mode> | <…> | <…> | `runbooks/RB-NN-<slug>.md` |

## 10. Incident Management & Loop-back to the SysRS

- **Severity:** `S1–S4` ([`Conventions §5.1`](../05_Conventions.md)); `SEV-n` is an accepted ops alias — **pick one label and stay consistent** across runbooks/PIRs.

| Severity | Definition (tailor) | Response |
|---|---|---|
| `S1` | <safety event / outage / data breach> | <page on-call + exec; war room; status page> |
| `S2` | <major degradation> | <on-call within N; resolution target> |
| `S3` | <minor degradation> | <ticket; SLA> |
| `S4` | <cosmetic> | <backlog> |

- **On-call rotation:** <schedule / tool>. **Incident commander:** <role>.
- **Post-incident review (PIR) template:** date/duration · severity · incident commander · summary · timeline table · 5-whys root cause · what worked/didn't · action items (owner / due / linked `CR-NN`) · **SysRS impact (REQs to revisit + `CR-NN` filed)**.
- **Loop closure is non-optional:** any S1/S2 incident exposing a missing/weak REQ files a `CR-NN` via Phase 09 to update the SysRS.

## 11. Gates

**ORR (one-time, before GA):**
- [ ] Transition / cutover / back-out defined; operator handover done.
- [ ] Every `REQ-P-*` / `REQ-O-*` maps to an `SLO-NN`.
- [ ] Observability chosen; dashboard owners + alert routes assigned; RED + USE instrumented.
- [ ] On-call rotation + incident-commander defined.
- [ ] Rollback wired (auto for hard breaches; mandatory-auto on safety-critical).
- [ ] ≥ 1 real `RB-NN` file per SLO alert (folder not empty).

**GA (continuous, after ORR):**
- [ ] Error budgets defined per SLO **with** a freeze policy routing through the Phase-09 CCB.
- [ ] Continuous-testing pipeline documented (per-commit **and** post-GA regression cadence).
- [ ] ≥ 4 chaos game days defined; first within 30 days of GA.
- [ ] Vuln-response SLA mapped to `S1–S4`.
- [ ] OTA cohorts + gating + auto-rollback + `CR-NN` audit log defined.
- [ ] PIR template defined; S1/S2 → loop-back `CR-NN` rule stated.
- [ ] Disposal explicitly handed to Phase 11.

## 12. Cross-References

- **Change governance (CCB / CR loop / semver):** [`../Phase_09_Change_Config/Change_Management_Plan.md`].
- **End-of-life / decommissioning / NIST SP 800-88 sanitization:** [`../Phase_11_Disposal/Disposal_Plan.md`] (Phase 11 owns it — not authored here).
- **SLOs source:** Phase-02 `SysRS.md` (`REQ-P-*` / `REQ-O-*`). **Regression seed:** Phase-06/07 pipeline + Phase-08 load baseline.
- **Gates / severity / citations:** [`Conventions`](../05_Conventions.md).

---

*Gates this plan supports:* **ORR → GA** ([`Conventions §1`](../05_Conventions.md)). All open items are named `TODO`s with an owner and due date. SRE core marked OUTSIDE-MATERIAL.
