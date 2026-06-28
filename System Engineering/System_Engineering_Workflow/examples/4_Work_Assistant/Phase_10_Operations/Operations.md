---
Document: Operations & Continuous Validation — Aria AI-Powered Personal Work Assistant
Document ID: OPS-ARIA-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Transition · Operation · Maintenance) · IEEE 1012-2016
Status: Draft
Owner: Platform / SRE Lead (STK-07)
---

# Phase 10 — Operations & Continuous Validation: Aria

> **Purpose.** Field Aria and keep it meeting the SysRS (`SyRS-ARIA-v1.0`) for the rest of its operational life. This phase owns the **Operational Readiness Review (ORR)** and **General Availability (GA)** gates (Conventions §3), then runs the continuous loop: SLOs + error budgets traced to `REQ-P-*`/`REQ-O-*`, observability of every AI action, the continuous-testing / continuous-regression pipeline (the shift-left half Phase 09 defers here), eval-regression + drift control on model/prompt, chaos game days, OTA/release governance with rollback, runbooks `RB-*`, and incident management — every SysRS-affecting finding looping back through a **Phase-09 `CR-*`**. Conforms to Conventions §6 frontmatter and cites Conventions for all shared IDs, gates, methods, and severities rather than redefining them.

> **OUTSIDE-MATERIAL / Google-SRE marker.** The **SLO · SLI · error-budget · burn-rate** model in §3 (and the burn-rate alert thresholds) is from Google SRE practice (Beyer et al., *Site Reliability Engineering*, 2016; *The SRE Workbook*, 2018) — **not** course canon. It complements IEEE 1012-2016 continuous V&V; treat it as an outside, optional convention and tailor it. Targets here are read from the SysRS thresholds (Conventions §4 method **A**/**T**), not gut-felt.

**Inputs consumed.** Phase 01 `Concept.md` (SCN-05, SCN-07, RSK-01/-02/-03/-07, MOE set); Phase 02 `SysRS.md` (REQ-P/REQ-O, MOP-01…-12, TPM-01/-02/-03, modes §9); Phase 06 `Integration_Plan.md` (CI/CD + eval harness — **TODO: owed by Phase 06**); Phase 07 `Verification_Matrix.md` (TC-VER-* — **TODO: owed by Phase 07**, resolves the `TC-VER-TBD` seeds); Phase 08 `Test_Plan.md` / `Test_Cases.md` (TC-VAL-* red-team + load baseline — **TODO: owed by Phase 08**); Phase 09 `Change_Management_Plan.md` + `Configuration_Management_Plan.md` + `CR_Log.md` (CCB/CR loop, `CI-*` register — **TODO: owed by Phase 09**). Where an input is not yet drafted, this doc references it by its canonical name (Conventions §10) and marks the owed number `TODO`.

---

## 1. Purpose & Scope — and Operating Model

Aria is **read-first, write-confirmed**: every byte of email/document/CRM content is untrusted input, and no write reaches an upstream without the employee's explicit confirmation (REQ-SAF-01, REQ-F-09). Operations therefore validates two classes of "good service" continuously: **conventional service health** (availability, latency, isolation — REQ-O-*, REQ-P-*, REQ-SEC-*) **and AI-action health** (groundedness, injection-defense efficacy, zero-unconfirmed-writes — REQ-P-05, REQ-SEC-07, REQ-F-09). The second class is what makes Aria's ops plan unusual: the SLO set below has *AI-safety SLOs* (`SLO-09…SLO-12`) alongside the classic latency/availability SLOs.

| Function | Responsibility | Lead STK |
|---|---|---|
| **Platform / SRE & on-call (24×7)** | Service SLOs (`SLO-01…-08`), incident command, rollback, observability, chaos. | STK-07 |
| **AI/ML Operations** | AI-safety SLOs (`SLO-09…-12`), eval-regression gate, model/prompt drift, model-tier routing health. | STK-08 |
| **Security Operations** | Injection red-team cadence, isolation pen-test, vuln-response SLA, audit-completeness, threat-model review (THR thread). | STK-04 |
| **Privacy / DPO Ops** | Erasure/access SLA (Art. 15/17), residency conformance, assistant-memory retention, DPIA re-review. | STK-05 |
| **IT / Identity Admin** | Token-vault health, SSO/IdP, per-user revocation within 5 min (REQ-SEC-04). | STK-03 |
| **Connected-app liaison** | Upstream rate-limit/terms changes for the four connectors (REQ-C-03). | STK-06 |

Disposal / end-of-life (token revocation, memory & history sanitization, GDPR erasure) is **owned by Phase 11 `Disposal_Plan.md`** (DRR; NIST SP 800-88 Rev. 1) and is **not** authored here — see §12. Operations *operates* the per-user revoke/erase controls (SCN-06); it does not own decommissioning.

---

## 2. Transition & ORR Readiness

15288 **Transition** plan for fielding Aria (a multi-tenant SaaS + agentic system):

| Transition item | Plan |
|---|---|
| **Deployment strategy** | Blue-green for the stateless app tier (Web Client, Dashboard Aggregation, Agent Orchestrator, RAG, Connector Gateway); **cohort canary** for any model/prompt change (§8, SCN-07). Infra is environment-as-code (containers, IaC) for environment consistency (KB-18). |
| **Tenant onboarding / cutover** | Per-tenant OAuth app registration + SSO/OIDC wiring (STK-03); employees grant delegated scopes (REQ-SEC-02). No big-bang — tenants onboard in waves; first wave is the pilot cohort that ran Phase-08 acceptance. |
| **Data migration** | None of record — Aria stores no system-of-record data (Concept §3). Migrated state = per-user RAG index + assistant memory, rebuilt from source on first sign-in; residency-pinned per REQ-C-01. |
| **Back-out plan** | Blue-green instant cutback to the prior green stack; model/prompt rollback via §8 auto-rollback; token-vault and audit log are append-only and survive a cutback. |
| **Operator handover / training (HSI)** | On-call runbooks (`RB-01…RB-10`, §9) handed to STK-07/-08; incident-commander training; DPO + Security briefed on the erasure and injection runbooks. **TODO: handover sign-off date — owed at ORR.** |
| **Acceptance into operations** | Phase 08 PRR cleared (validation ≥ targets, zero S1, isolation+injection pen-test zero S1/S2 — REQ-SEC-08) is the precondition to ORR. **TODO: PRR sign-off ref — owed by Phase 08.** |

**ORR verdict (Conventions §3 — five-item definition):** see the §11 checklist. Recommendation today: **Hold → Proceed-with-actions** once the five `TODO`-owed items (handover sign-off, eval-harness wired in CI, on-call rota staffed, auto-rollback wired for model/prompt, pen-test sign-off) are closed. Do **not** declare GA before ORR passes.

---

## 3. SLOs & Error Budgets `SLO-*`  *(OUTSIDE-MATERIAL / Google-SRE — tailor)*

Every Performance (`REQ-P-*`) and Operational/Reliability (`REQ-O-*`) requirement maps to ≥ 1 `SLO-*`; targets are read from the REQ threshold and its `MOP-*`/`TPM-*` (SysRS §10), never invented. AI-safety SLOs (`SLO-09…-12`) extend the model to the security/grounding REQs that carry the project's top risks (RSK-01/-02/-03) — these are tracked as SLOs because a regression in them is a *trust-critical* event (MOE-04 target = 0).

| SLO | SLI (Service Level Indicator) | Target | Threshold | Window | Linked REQ | MOP/TPM |
|---|---|---|---|---|---|---|
| **SLO-01** | Dashboard first-complete-view render, p95 at the client boundary | ≤ 3 s | ≤ 5 s | 28 d | REQ-P-01, REQ-F-02 | MOP-01 |
| **SLO-02** | Chat grounded-answer completion, p95 (and first-token ≤ 3 s p95) | ≤ 10 s | ≤ 15 s | 28 d | REQ-P-02 | MOP-02 |
| **SLO-03** | Concurrent active users sustained at SLA (chat p95 ≤ 10 s, dash p95 ≤ 3 s) | ≥ 5,000 | ≥ 3,000 | live gauge | REQ-P-03 | MOP-03 |
| **SLO-04** | Aria service availability (dashboard + chat; excludes upstream outages) | ≥ 99.5 % | ≥ 99.0 % | 30 d | REQ-O-01 | MOP-07 · **TPM-02** |
| **SLO-05** | Non-dependent functions available while exactly one upstream is down | ≥ 99 % | ≥ 95 % | per outage | REQ-O-02, REQ-F-12 | MOP-08 |
| **SLO-06** | Circuit-breaker isolates a failing upstream within | ≤ 30 s | ≤ 30 s | per event | REQ-O-03 | — |
| **SLO-07** | Write→dashboard reconciliation after upstream ack | ≤ 60 s | ≤ 60 s | 28 d | REQ-O-04, REQ-F-02 | MOP-01 |
| **SLO-08** | Routine tasks routed off the highest-cost model tier | ≥ 90 % | ≥ 75 % | 28 d | REQ-P-04 | MOP-10 |
| **SLO-09** | Grounded-answer rate (asserted facts all cited; no fabricated entity) on the live-sampled eval set | ≥ 95 % | ≥ 90 % | 7 d rolling | REQ-P-05, REQ-F-06, REQ-F-04 | MOP-04 · **TPM-01** |
| **SLO-10** | Writes executed without explicit confirmation | 0 | 0 | continuous | REQ-F-09, REQ-SAF-01 | MOP-05 |
| **SLO-11** | Out-of-policy tool / cross-user access attempts blocked | 100 % | 100 % | continuous | REQ-F-08, REQ-SEC-03 | MOP-06 |
| **SLO-12** | Injection-defense efficacy on the red-team eval suite | ≥ 99 % | ≥ 95 % | per release + weekly | REQ-SEC-07 | MOP-12 · **TPM-03** |
| **SLO-13** | Actions with a complete, tamper-evident audit record | 100 % | 100 % | continuous | REQ-SEC-06 | MOP-11 |
| **SLO-14** | Per-user token revocation propagated after IdP revoke | ≤ 5 min | ≤ 5 min | per event | REQ-SEC-04 | — |
| **SLO-15** | GDPR access/erasure request completed within agreed SLA | per DPIA SLA | per DPIA SLA | per request | REQ-D-01, REQ-O-05 | — |

> **Coverage check (ORR gate):** all `REQ-P-*` (P-01→SLO-01, P-02→SLO-02, P-03→SLO-03, P-04→SLO-08, P-05→SLO-09) and all `REQ-O-*` (O-01→SLO-04, O-02→SLO-05, O-03→SLO-06, O-04→SLO-07, O-05→SLO-15) map to ≥ 1 SLO. No uncovered Performance/Operational REQ. Security/safety REQs that carry top risks are additionally covered (SEC-03→SLO-11, SEC-04→SLO-14, SEC-06→SLO-13, SEC-07→SLO-12, SAF-01/F-09→SLO-10). `SLO-09/-12` baselines are owed by Phase 07/08 evals (`TODO`).

**Error budget** per SLO = 1 − target over the window. **Zero-tolerance SLOs** (`SLO-10`, `SLO-11`, `SLO-13`) have **no error budget** — any single breach is a trust-critical S1 incident (MOE-04 = 0) and arms an immediate change-freeze + PIR, *not* a budget burn-down. **`SLO-12`** (injection) and **`SLO-09`** (grounding) carry a small budget but a breach below threshold blocks the next model/prompt release (eval gate, §5/§8).

**Budget-burn policy** *(OUTSIDE-MATERIAL — tailor; freeze routes through the Phase-09 CCB, never an independent ops call):*
```
0–50% budget used .... ship freely.
50–100% used ......... ship with caution; non-critical changes need SRE (STK-07) sign-off.
>100% (exhausted) .... freeze non-critical changes via the Phase-09 CCB; S1/S2 fixes only; daily review.
Burn-rate alerts:  2%/1h → page on-call · 5%/6h → page + manager · 10%/3d → CCB-gated freeze.
Zero-tolerance (SLO-10/-11/-13): any breach → immediate S1, freeze, PIR, loop-back CR — not a burn-down.
```

---

## 4. Observability — four pillars + AI-action telemetry

The four classic pillars, each instrumented **RED** for request-driven services (Rate · Errors · Duration p50/p95/p99) and **USE** for resources (Utilization · Saturation · Errors). Aria adds a fifth concern — **AI-action telemetry** — because the audit log (REQ-SEC-06) and the eval stream are first-class operational signals, not just compliance artifacts.

| Pillar | What is instrumented | Default tool | Alternatives | Retention | Dashboard owner |
|---|---|---|---|---|---|
| **Metrics** | RED per service (Web, Dashboard-Agg, Agent Orchestrator, RAG, Connector Gateway, Identity Broker, Audit); USE on model-call queue, token-vault, RAG index. SLI gauges for all `SLO-*`. | Prometheus + Grafana | Datadog, CloudWatch / Cloud Monitoring | TODO (DPIA-bounded) | STK-07 |
| **Logs** | Structured events with a per-request **correlation ID** + per-user **isolation tag** (so a query can never join two users — REQ-SEC-03); connector error logs; guardrail-refusal events (REQ-F-08). | Loki + Grafana | ELK / OpenSearch, Splunk | TODO (DPIA-bounded; PII-minimized, residency-pinned REQ-C-01) | STK-07 |
| **Traces** | Distributed trace: Web → Agent Orchestrator → (RAG retrieval ‖ tool call → Connector → upstream) → Action-Confirmation Gate → Audit. Trace shows *which tools were proposed vs. confirmed vs. executed*. | OpenTelemetry + Tempo | Jaeger, Honeycomb | TODO | STK-08 |
| **RUM** | Web dashboard/chat real-user vitals, client errors, confirm-surface interaction (did the user actually see the diff before confirming — REQ-U-03). | Sentry | Datadog RUM, New Relic Browser | TODO | STK-07 |
| **AI-action telemetry** | The **audit stream** (REQ-SEC-06: actor, tool, target system, params, confirmation status, outcome) **and** the **live eval stream** (sampled groundedness `SLO-09`, injection probes `SLO-12`, model-tier routing `SLO-08`). | Audit Log Service + eval pipeline (Grafana panels) | — | Immutable/tamper-evident; retention per DPIA (REQ-O-05) | STK-08 + STK-04 |

**Curated dashboards:** (1) **Trust** — `SLO-09…-13` (grounding, zero-unconfirmed-writes, isolation, injection, audit completeness); the trust-critical incident counter (MOE-04). (2) **Service Health** — `SLO-01…-08` RED/USE per service. (3) **Connector Health** — per-upstream availability, circuit-breaker state, rate-limit headroom, eventual-consistency lag (REQ-INT-06, SCN-05). (4) **Privacy & Identity** — token-vault health, revocation latency `SLO-14`, erasure-queue `SLO-15`, residency conformance.

**Alert routes:** zero-tolerance SLO breach (`SLO-10/-11/-13`) and `SLO-12 < 95%` → page on-call **+** Security (STK-04) **+** AI Lead (STK-08) immediately; `SLO-09 < 90%` → page AI Ops; service-health burn → page SRE per the burn policy (§3); erasure SLA at-risk → page DPO (STK-05).

---

## 5. Continuous-Testing Pipeline (shift-left + post-GA continuous regression)

This phase owns the KB-18 continuous-validation loop Phase 09 defers here. Two layers:

### 5.1 Per-commit / CI (shift-left, fail-fast)
The five KB-18 principles applied to Aria, on the Phase-06 CI/CD (**TODO: pipeline ref owed by Phase 06**):
- **Shift-left / BDD-first** — every REQ has its acceptance criteria authored as executable specs *before* code; the eval sets (groundedness, action-safety, injection) are version-controlled fixtures.
- **Test automation in CI/CD** — full suite on every commit/PR + nightly; promotion is gated on green.
- **Fail-fast feedback** — unit/contract failures block the PR in minutes.
- **Environment consistency** — containers + IaC; ephemeral per-PR environments identical to staging.
- **Service virtualization** — the four upstreams (Graph, HubSpot, JIRA, Therefore) and the LLM provider are mocked/recorded (re-using Phase-06 connector stubs) so the agent and connectors are testable without live tenants or model spend.

**Test-type ladder (KB-18, smallest→largest scope), with Aria's AI-specific gates layered on the system/regression rungs:**

| Rung | Scope | Aria content | Gate |
|---|---|---|---|
| **Unit** | Function | Connector adapters, scope-filter, diff renderer, citation extractor. | Per-commit, very fast. |
| **Integration** | Service pair | Agent↔RAG grounding, Agent↔Connector tool-calls (virtualized), Action-Confirmation Gate↔Audit. | Per-commit. |
| **System** | End-to-end | SCN-01/-02/-03 flows; **eval gates**: groundedness (REQ-P-05), action-safety "attempt unconfirmed write ⇒ 0 execute" (REQ-F-09/SAF-01), tool allow-list (REQ-F-08). | Per-PR + nightly. |
| **Regression** | Whole system | Re-run all of the above + the **injection red-team suite** (REQ-SEC-07) + **isolation suite** (REQ-SEC-03) on every release candidate. | Release gate (no regression below threshold). |
| **UAT** | Acceptance | Phase-08 human-acceptance + productivity (TC-VAL-*) on the pilot cohort. | Pre-GA / per major. |

### 5.2 Post-GA continuous regression (runs after release, not just in CI)

| Activity | Cadence | Linked | Owner |
|---|---|---|---|
| **Groundedness eval** on live-sampled traffic (alerts on `SLO-09` miss) | continuous (sampled) | REQ-P-05, RSK-03 | STK-08 |
| **Injection red-team regression** (`SLO-12`) | weekly + per release | REQ-SEC-07, RSK-01 | STK-04 |
| **Per-user isolation probe** (synthetic two-user cross-access; assert 0 leak) | hourly synthetic | REQ-SEC-03, RSK-02 | STK-04 |
| **Action-safety probe** (synthetic "would this write without confirm?" ⇒ assert blocked) | hourly synthetic | REQ-F-09, REQ-SAF-01 | STK-07 |
| **Synthetic dashboard + chat probe** (k6 / Playwright; SLO-01/-02) | hourly | REQ-P-01/-02 | STK-07 |
| **Audit-completeness sweep** (sample actions; assert complete record `SLO-13`) | daily | REQ-SEC-06 | STK-04 |
| **Per-deploy smoke** gating promotion | per deploy | all SLO | STK-07 |
| **Load test re-run** vs staging (drift on p95/concurrency) | weekly | REQ-P-01/-02/-03 | STK-07 |
| **Chaos game day** (§6) | quarterly | REQ-O-* | STK-07 |
| **External pen test** (isolation + injection) | annual + on major release | REQ-SEC-08 | STK-04 |

> **Eval-regression = the release gate.** Per SCN-07, a model/prompt candidate must **meet or beat the current baseline** on groundedness (`SLO-09`/TPM-01), action-safety (`SLO-10`), injection (`SLO-12`/TPM-03) and task-success before any cohort sees it. A below-baseline candidate is rejected by CI — it never reaches §8 rollout. Drift is monitored post-deploy on the same SLIs (RSK-07).

---

## 6. Chaos Engineering (≥ 4 game days; first within 30 days of GA)

Each game day states a hypothesis, the injected failure, a **blast-radius limit**, abort criteria, the linked REQ, and the runbook it feeds. Tooling: Gremlin / Litmus / in-house fault-injection (TODO: select in Phase 06).

| Game day | Hypothesis | Inject | Blast radius | Abort if | Linked REQ | Feeds |
|---|---|---|---|---|---|---|
| **GD-1 — single upstream down** | One upstream down keeps ≥ 99 % non-dependent functions up; panel shows degraded state. | Block HubSpot API (errors/429) | 1 connector, staging then 1 % canary | `SLO-05` < 95 % or `SLO-04` impacted | REQ-O-02, REQ-O-03, REQ-F-12 (SCN-05) | RB-04 |
| **GD-2 — LLM provider degraded** | Model-tier router fails over / sheds to a lower tier; chat degrades gracefully, no auto-writes. | Inject latency/5xx on ICD-05 (model API) | Chat path only, canary | first-token p95 > 15 s sustained | REQ-P-02, REQ-P-04, REQ-INT-05 | RB-05 |
| **GD-3 — bad model/prompt push** | Eval gate + auto-rollback catch a below-baseline candidate before Wave 1. | Deploy a deliberately-regressed prompt to canary | Canary cohort ≤ 5 % | `SLO-09/-12` below threshold not auto-rolled-back | REQ-P-05, REQ-SEC-07 (SCN-07, RSK-07) | RB-06 |
| **GD-4 — token-vault / IdP outage** | Vault failover preserves isolation; no fallback to a tenant-wide credential (REQ-SEC-02). | Kill token-vault primary; force IdP timeout | Auth path, staging | any request served with non-delegated creds | REQ-SEC-02, REQ-SEC-04 | RB-07 |
| **GD-5 — injection storm** | Allow-list + sandbox hold under a burst of injected-instruction content; 0 unconfirmed writes. | Replay red-team corpus through ingestion | Sandbox only | any out-of-policy tool call executes | REQ-SEC-07, REQ-F-08 (SCN-04, RSK-01) | RB-08 |

---

## 7. Security & Compliance Cadence

| Activity | Cadence | Linked | Owner |
|---|---|---|---|
| **External penetration test** (per-user isolation + prompt-injection) | annual + on major release | REQ-SEC-08, RSK-02/-01 | STK-04 |
| **Internal pen / red-team** | quarterly | REQ-SEC-07 | STK-04 |
| **Injection red-team eval regression** | weekly + per release (`SLO-12`) | REQ-SEC-07 | STK-04 |
| **Threat-model (THR-*) review** | quarterly + on architecture change | RSK-01/-02 | STK-04 |
| **DPIA re-review** (Art. 35) | annual + on any data-flow change | REQ-D-01, RSK-05 | STK-05 |
| **Residency + retention conformance audit** | quarterly | REQ-C-01, REQ-O-05 | STK-05 |
| **Crypto-suite review** (TLS 1.3, AES-256, token rotation per RFC 9700) | quarterly | REQ-SEC-04, REQ-SEC-05 | STK-04 |
| **Connected-app terms / rate-limit watch** | continuous | REQ-C-03, REQ-INT-06 | STK-06 |

**Vulnerability-response SLA** (map CVSS v4 → `S1–S4`, Conventions §5.1): S1 Critical (CVSS ≥ 9.0) < 7 d · S2 Major (7.0–8.9) < 30 d · S3 Minor (4.0–6.9) < 90 d · S4 Cosmetic (< 4.0) next planned release. New regulation or LLM/connector deprecation → loop-back CR (§10).

---

## 8. OTA / Deployment & Release Governance

Every production change — code, **connector config, model selection, system prompt, tool allow-list, eval set** — is a **Phase-09 `CR-*`** against a baselined `CI-*` (no out-of-band pushes; the model and the system prompt are configuration items under change control — Concept §4 Formal overlay). The error-budget freeze (§3) routes through the Phase-09 CCB.

**Cohorts & gating** (defaults — **TODO: calibrate cohort sizes/bake times to tenant base; owed at ORR**):

| Cohort | Size | Bake | Hard gate (auto-rollback on breach) |
|---|---|---|---|
| **Canary** | 1–5 % | 24 h | `SLO-09` grounding ↓, `SLO-12` injection ↓, any `SLO-10/-11/-13` breach, chat crash-rate spike, ticket spike |
| **Wave 1** | 10–25 % | 48 h | same + `SLO-01/-02` latency regression |
| **Wave 2** | 50 % | 72 h | same |
| **Full** | 100 % | — | continuous SLO watch |

- **Eval-gate precondition (SCN-07):** a model/prompt CR must pass the §5 eval-regression (groundedness, action-safety, injection, task-success ≥ baseline) **before** even the canary. This is the single most important release control for Aria (RSK-07).
- **Auto-rollback** — **mandatory and automatic** on any zero-tolerance breach (`SLO-10/-11/-13`) or injection/grounding gate breach; these are the AI-action-safety paths (Concept's "Safety" = irreversible-action prevention) and are treated like a safety-critical path → always auto. Ambiguous/partial signals → manual rollback runbook (RB-06).
- **Rollback mechanism** — blue-green cutback for app tier; previous model+prompt+allow-list bundle always retained and re-pinnable in one step.
- **Audit** — each push records `CR-*` ref, signed artifact hash (model id + prompt hash + allow-list hash), cohort log, gate outcome; retained in the audit log (REQ-SEC-06).

---

## 9. Runbooks `RB-*` (seeded files — index)

One runbook per SLO alert and per chaos failure mode, structured **Symptom → Triage → Mitigation → Resolution → Post-incident trigger** (files under `runbooks/`). Severity uses `S1–S4` (Conventions §5.1; `SEV-n` is the accepted alias — this project uses `S1–S4` consistently).

| RB | Title | Trigger / SLO | Linked REQ |
|---|---|---|---|
| [**RB-01**](runbooks/RB-01-unconfirmed-write.md) | Unconfirmed write detected (zero-tolerance) | `SLO-10` ≠ 0 | REQ-F-09, REQ-SAF-01 |
| [**RB-02**](runbooks/RB-02-cross-user-isolation.md) | Cross-user access / isolation breach | `SLO-11` < 100 % | REQ-SEC-03, REQ-SEC-02 |
| [**RB-03**](runbooks/RB-03-groundedness-drop.md) | Groundedness / hallucination regression | `SLO-09` < 90 % | REQ-P-05, REQ-F-06 |
| [**RB-04**](runbooks/RB-04-upstream-down.md) | Upstream connector down / degraded | `SLO-04/-05/-06` | REQ-O-02, REQ-O-03, REQ-F-12 |
| RB-05 | LLM provider degraded / failover | `SLO-02` p95, GD-2 | REQ-P-02, REQ-INT-05 | *(seed: TODO)* |
| RB-06 | Bad model/prompt push — rollback | §8 gate / GD-3 | REQ-P-05, REQ-SEC-07 | *(seed: TODO)* |
| RB-07 | Token-vault / IdP outage; revocation | `SLO-14`, GD-4 | REQ-SEC-04, REQ-SEC-02 | *(seed: TODO)* |
| RB-08 | Prompt-injection alert | `SLO-12` < 95 % | REQ-SEC-07, REQ-F-08 | *(seed: TODO)* |
| RB-09 | Audit-record incompleteness | `SLO-13` < 100 % | REQ-SEC-06 | *(seed: TODO)* |
| RB-10 | GDPR erasure/access SLA at risk | `SLO-15` | REQ-D-01, REQ-O-05 | *(seed: TODO)* |

> **Gate note:** four runbooks are seeded as real files (RB-01…RB-04, covering the three zero-tolerance/trust-critical SLOs plus the headline reliability scenario SCN-05). RB-05…RB-10 are indexed with structure owed before ORR — **TODO: author remaining seeds; ORR not met by an empty promise.**

---

## 10. Incident Management & Loop-Back to the SysRS

- **Severity** — `S1–S4` (Conventions §5.1), reusing the Phase-08 defect taxonomy. For Aria, **any breach of a zero-tolerance SLO (`SLO-10` unconfirmed write, `SLO-11` cross-user leak, `SLO-13` audit gap) or a confirmed prompt-injection success (`SLO-12`) is an automatic S1** — these are the MOE-04 trust-critical events (target 0).
- **On-call** — STK-07 primary rota (24×7); STK-08 (AI Ops) and STK-04 (Security) secondary, paged automatically on any trust/AI-safety alert; STK-05 (DPO) paged on privacy/erasure incidents.
- **Incident commander** — single IC per incident; war room + status update within 30 min for S1.
- **PIR** — blameless post-incident review within 5 business days: timeline, **5-whys** root cause, what worked/didn't, action items (owner/due/linked CR), and **SysRS impact** (REQs to revisit + `CR-*` filed). Learnings fold into runbooks and the §5/§6 regression + chaos suites.
- **Loop closure (non-optional).** Any **S1/S2** incident that exposes a missing or weak REQ files a **`CR-*` via `se-phase-09-change-config`** to update the SysRS — e.g. an injection success not covered by REQ-SEC-07's red-team set ⇒ CR to strengthen the requirement + eval; an isolation gap ⇒ CR against REQ-SEC-03. The CR re-enters at the appropriate phase and re-baselines (Conventions §3/§8). **`CR-*` numbers are assigned in Phase 09 (`TODO: owed by Phase 09 CR_Log.md`).**

```
SysRS (REQ) ──► design ──► verify (TC-VER) ──► validate (TC-VAL) ──► OPERATE
     ▲                                                                  │
     │                                                                  ▼
     └──── CR-* (Phase 09 CCB) ◀──── PIR / eval-regression / chaos ◀── SLO breach / incident
```

---

## 11. Gates — ORR (one-time) + GA (continuous)

**ORR checklist** (Conventions §3 — the five-item definition):

| ORR item | Status |
|---|---|
| Transition/deployment + cutover + back-out defined; operator handover/training done | §2 defined; **TODO: handover sign-off (STK-07/-08)** |
| Every `REQ-P-*` & `REQ-O-*` maps to an `SLO-*` (no uncovered Perf/Op REQ) | **Met** (§3 coverage check) |
| Observability chosen; dashboard owners + alert routes assigned; RED + USE instrumented | **Met** (§4); retentions **TODO (DPIA-bounded)** |
| On-call rotation + incident-commander role defined | §10 defined; **TODO: rota staffed** |
| Rollback — auto for hard/AI-safety breaches; manual for ambiguous; always-auto on safety paths | §8 defined; **TODO: auto-rollback wired for model/prompt** |
| ≥ 1 real `RB-*` file per SLO alert (folder not empty) | **Partly met** — RB-01…RB-04 seeded; **TODO: RB-05…RB-10** |

**GA (continuous, after ORR):**

| GA condition | Status |
|---|---|
| Error budget per SLO **with** burn policy routing freeze via Phase-09 CCB | **Met** (§3); zero-tolerance SLOs carry no budget |
| Continuous-testing pipeline documented — per-commit + post-GA regression cadence | **Met** (§5); CI ref **TODO (Phase 06)** |
| ≥ 4 chaos game days defined; first within 30 days of GA | **Met** (§6 — 5 defined); **TODO: schedule GD-1** |
| Vuln-response SLA mapped to `S1–S4` | **Met** (§7) |
| OTA cohorts + gating + auto-rollback + `CR-*` audit log | **Met** (§8); cohort sizes **TODO calibrate** |
| PIR template + S1/S2 → loop-back `CR-*` via Phase 09 | **Met** (§10) |
| Disposal handed to **Phase 11** (not authored here) | **Met** (§1, §12) |
| Frontmatter present; SRE core marked OUTSIDE-MATERIAL | **Met** (header + §3) |

**Recommendation:** **Hold → Proceed-with-actions to GA** once the ORR `TODO`s above are closed. GA is then continuous: error budgets honoured, eval gate green per release, trust-critical incidents = 0 (MOE-04).

---

## 12. Cross-refs

- **Change governance & CR loop** → Phase 09 `Change_Management_Plan.md` + `Configuration_Management_Plan.md` + `CR_Log.md` (CCB owns every push and the error-budget freeze; model/prompt/allow-list are `CI-*`). All `CR-*` here are owed by Phase 09.
- **Verification matrix / TC-VER** → Phase 07 `Verification_Matrix.md` (resolves the SysRS §11 `TC-VER-TBD` seeds the SLO evals operationalise).
- **Validation / load + red-team baseline** → Phase 08 `Test_Plan.md` / `Test_Cases.md` (TC-VAL-*; the regression and load re-runs in §5 re-use these).
- **Disposal / end-of-life** → **Phase 11 `Disposal_Plan.md`** (DRR; token revocation at scale, assistant-memory/history sanitization, GDPR erasure, NIST SP 800-88 Rev. 1). Operations runs the per-user revoke/erase controls (SCN-06, `SLO-14/-15`); it does **not** own decommissioning.
- **Measurement** → SLOs operationalise `MOP-*`/`TPM-*`; `SLO-04→TPM-02`, `SLO-09→TPM-01`, `SLO-12→TPM-03` breaches update `TPM_Tracker.md`.

---

### Standards anchor (Conventions §9)

ISO/IEC/IEEE 15288:2023 (Transition · Operation · Maintenance) · IEEE 1012-2016 (continuous V&V) · ISO/IEC 27001:2022 + NIST SP 800-53 Rev. 5 (ops security/vuln mgmt) · ISO 9001:2015 (operational conformance) · GDPR Arts. 5/15/17/25/30/32/35 (privacy ops) · OAuth 2.0 / OIDC / RFC 9700 (token rotation/revocation). **SLO/error-budget/burn-rate model: OUTSIDE-MATERIAL — Google SRE (2016 / 2018), not course KB.** NIST SP 800-88 Rev. 1 (sanitization) is anchored in **Phase 11**, not here.
