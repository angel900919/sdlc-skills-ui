---
name: se-phase-10-operations
description: Runs Phase 10 (Operations & Continuous Validation) of the SE workflow: turns SysRS requirements into SLOs, stands up observability (metrics/logs/traces), continuous regression and shift-left testing, runbooks, and OTA/release governance with rollback; gates at ORR then GA. Use for operations plans, SLOs and error budgets, observability, continuous validation, runbooks, OTA/release rollback, on-call/incident response, and the Operational Readiness Review. Triggers: "operations plan", "define SLOs / error budget", "observability", "continuous validation", "runbook", "OTA / release rollback", "ORR", "phase 10 operations".
disable-model-invocation: true
user-invocable: true
---

# Phase 10 — Operations & Continuous Validation

<what-to-do>

This phase transitions the validated system into service and keeps it meeting the SysRS over its operational life: it owns the **Operational Readiness Review (ORR)** and **General Availability (GA)** gates, then runs the *continuous* loop — SLOs + error budgets, observability, the continuous-testing / continuous-regression pipeline (the shift-left half of KB topic 18 that Phase 09 defers here), chaos engineering, security/compliance cadences, OTA/deployment governance, runbooks, and incident management — feeding every SysRS-affecting finding back through a Phase-09 CR. Its exit gates are **ORR** (one-time: cleared to go live) then **GA** (live to all users; **error budgets honoured continuously thereafter**). This skill conforms to [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md); it cites that file for every shared convention (IDs, gates, T/I/A/D, severity, baselines, citations) rather than redefining them.

> **OUTSIDE-MATERIAL / Google-SRE marker.** The **SLO · SLI · error-budget · burn-rate** model used below is from Google SRE practice (Beyer et al., *Site Reliability Engineering*, 2016; *The SRE Workbook*, 2018) — **not** from the course KB. It is industry-standard and complements IEEE 1012 continuous V&V, but treat it as an outside, optional convention and tailor it (do not present it as course canon).

## Inputs (from prior phases)

Read these first; if one is absent, note `TODO: <owed by phase NN>` and proceed with a placeholder rather than inventing numbers.

- **Phase 02 `SysRS.md` + `Traceability_Matrix.md`** — every `REQ-P-*` (Performance) and `REQ-O-*` (Operational/Reliability) plus the `MOP-*` / `TPM-*` set; these are the source of SLOs. *Fallback:* if no SysRS, ask which measurable performance/availability targets exist and tag the resulting SLOs `TODO: trace to REQ`.
- **Phase 07 `Verification_Matrix.md` + V&V Plan** — `TC-VER-*`; method-**A** (Analysis) requirements typically become operational SLO dashboards, and the regression suite is the seed of post-GA continuous regression. *Fallback:* note re-test scope TBD.
- **Phase 06 `Integration_Plan.md`** — the CI/CD pipeline, environments, and HIL rigs that the continuous-testing pipeline runs on; the increment/deployment topology. *Fallback:* ask for the deploy mechanism.
- **Phase 08 `Test_Plan.md` + `Test_Cases.md`** — `TC-VAL-*`, the load/performance baseline to re-run for drift, FAT/SAT results, the S1–S4 defect taxonomy reused for incidents. *Fallback:* note the validation baseline TBD.
- **Phase 09 `Change_Management_Plan.md` + `Configuration_Management_Plan.md`** — the CCB/CR loop and semver that govern every deployed change and OTA push; the `CI-NN` register the deployment ships. *Fallback:* if Phase 09 is absent, flag that loop-back CRs have nowhere to go yet.
- **Cross-cutting registers** — `Risk_Opportunity_Register.md`, `Hazard_Log.md`, `Threat_Model.md`, `TPM_Tracker.md`, `QA_Plan.md`. *Fallback:* create stubs as you go.

## Step-by-step

Interview the user **one topic at a time** — never dump every question at once. Convert each answer into the deliverable, reuse prior-phase facts, and never re-ask what a prior artifact already states. Use **AskUserQuestion** for finite choices. Mark unknowns `TODO: <owed>`; never invent SLO targets, burn rates, cohort sizes, or SLAs.

1. **Read prior artifacts & confirm output paths.** Pull the Performance/Operational REQs and `MOP/TPM` set from Phase 02, the regression suite from Phase 06/07, the validation/load baseline from Phase 08, and the CCB/CR loop from Phase 09. Default outputs: `<project>/Phase_10_Operations/Operations_Continuous_Validation.md` and the seed runbooks under `<project>/Phase_10_Operations/runbooks/RB-NN-<slug>.md`. State assumptions you carry forward.

2. **ORR readiness & Transition (own this gate).** *Topic: "Are we actually ready to go live?"* Walk the ORR checklist (Conventions §3: deployment, runbooks, SLOs, on-call, rollback all in place). Capture the **transition/fielding plan** (15288 Transition): deployment/migration strategy (blue-green / canary / phased install / big-bang), data migration + cutover, environment provisioning ("as-code", per KB-18 environment-consistency), back-out plan, training/handover to operators (HSI), and acceptance-into-operations sign-off. Do **not** declare GA before ORR passes.

3. **SLOs & error budgets (SLO-NN).** *Topic: "What 'good service' looks like, per requirement."* For each user-facing function, derive one or more **`SLO-NN`** (Conventions §2.4) from its linked `REQ-P-*`/`REQ-O-*`. Use the 5-column table; every SLO names its SLI, target, window, and the REQ it traces to (use the *SLO derivation cheatsheet* in Supporting info — don't copy the example's numbers blindly):

   | SLO | SLI (Service Level Indicator) | Target | Window | Linked REQ |
   |---|---|---|---|---|
   | `SLO-01` | (successful sessions / total) | ≥ 99.0% | 28 d | `REQ-F-03` |
   | `SLO-02` | latency p95 at the boundary | ≤ N ms | 28 d | `REQ-P-04` |
   | `SLO-03` | (up minutes / scheduled minutes) | ≥ N% | 30 d | `REQ-O-01` |

   Define an **error budget** per SLO (= 1 − target over the window) and the **budget-burn policy** (see template) tying burn-rate alerts to a change-freeze that routes through the **Phase-09 CCB** — not an independent ops decision. *If a Performance/Operational REQ has no SLO, that's a gap: add the SLO or file a CR to retire the REQ.*

4. **Observability stack.** *Topic: "How do we see what the system is doing?"* Capture the four pillars, the chosen tools (defaults below; user may swap — KB-18 "no single tool fits all"), and per pillar: what's instrumented, retention, dashboard owner, alert routes. Instrument **RED** for request-driven services and **USE** for resources (see Supporting info).

   | Pillar | What | Default tool | Alternatives |
   |---|---|---|---|
   | **Metrics** | Numeric time-series (RED + USE). | Prometheus + Grafana | Datadog, New Relic, CloudWatch / Cloud Monitoring. |
   | **Logs** | Structured event records (correlation IDs). | Loki + Grafana | ELK / OpenSearch, Splunk, cloud-native. |
   | **Traces** | Distributed request flow. | OpenTelemetry + Tempo | Jaeger, Honeycomb, Datadog APM. |
   | **RUM** | Real-user web/mobile telemetry. | Sentry / Firebase Perf | Datadog RUM, New Relic Browser. |

5. **Continuous-testing pipeline (the shift-left half — owned here).** *Topic: "What runs on every commit, and what runs forever after GA?"* This is the KB-18 continuous-validation loop Phase 09 defers to this phase. Document both layers:
   - **Per-commit / CI (shift-left, fail-fast):** the 5 KB-18 principles — **shift-left** (define/automate tests before or alongside code, BDD-first), **test automation in CI/CD** (suite runs on every commit/PR/nightly), **fail-fast feedback**, **environment consistency** (containers/VMs as-code), **service virtualization** (mocks/simulators when a dependency or hardware isn't available — re-uses Phase-06 stubs/drivers). Per the **test-type ladder** (KB-18, smallest→largest scope): **unit → integration → system → regression → UAT**, automated by layer (unit *very fast* → e2e *slower* → perf/security *varies*).
   - **Post-GA continuous regression (runs after release, not just in CI):** nightly conformance suites, hourly synthetic probes (k6/Playwright) alerting on SLO miss, per-deploy smoke gating promotion, weekly re-run of the Phase-08 load test against staging to catch **drift**, quarterly chaos (step 6), annual external pen test (step 7).

6. **Chaos engineering.** *Topic: "How do we prove resilience before reality tests it?"* Define the chaos catalog (Gremlin / Litmus / Chaos Toolkit / in-house). Each game day states a hypothesis, the failure injected, **blast-radius limit**, abort criteria, linked `REQ-O-*`/`REQ-SEC-*`, and the runbook it feeds. Minimum starter set ≥ 4 game days (e.g. network partition, region/AZ failover, bad OTA push, cert expiry, DB primary kill). Schedule the **first game day within 30 days of GA**; outcomes feed runbooks and the regression suite.

7. **Security & compliance cadence.** *Topic: "What recurring security/compliance work keeps us safe and legal?"* Capture: **pen tests** (annual external, quarterly internal), **compliance audits** (domain certs at re-cert cadence; privacy DPIA per significant change), the **vulnerability-response SLA** mapped to `S1–S4` (see template), and a **crypto-suite review** (quarterly; deprecate weak algorithms before they're banned). New regulation or vendor deprecation → loop-back CR (step 10).

8. **OTA / deployment governance.** *Topic: "How does a change reach production safely?"* Every deployed change is a **Phase-09 CR** (no out-of-band pushes). Define: **cohorts** (Canary 1–5% → Wave 1 10–25% → Wave 2 50% → Full 100%, with bake times), **gating metrics** per cohort (SLO burn, crash rate, ticket spike), **auto-rollback** (automatic on any hard gate breach; manual runbook for ambiguous cases), and the **audit log** (each push: `CR-NN` ref, signed artifact hash, cohort log, outcome). Auto-rollback is mandatory for safety-critical paths.

9. **Runbooks (RB-NN) — a real deliverable, not a promise.** *Topic: "What does on-call do when an alert fires?"* For **every SLO alert and every chaos failure mode**, seed a runbook `RB-NN` (Conventions §2.4) as an actual file under `runbooks/RB-NN-<slug>.md`. Required structure: **Symptom → Triage → Mitigation → Resolution → Post-incident trigger**, plus linked `SLO-NN` / `REQ-*` / `CR-NN`. Maintain the **runbook index** in the operations doc. *Seed at least one runbook per SLO alert before ORR — the gate is not met by an empty `runbooks/` folder.*

10. **Incident management & loop-back to the SysRS.** *Topic: "How do we run an incident and learn from it?"* Document: **severity `S1–S4`** (reuse the Phase-08 defect taxonomy; `SEV-n` is the accepted ops alias per Conventions §5.1 — pick one label and stay consistent), **on-call rotation**, the **incident-commander** role, and the **post-incident review (PIR)** template (timeline, 5-whys root cause, action items, runbook updates, chaos additions). **Loop closure is non-optional:** any S1/S2 incident exposing a missing or weak REQ files a **`CR-NN` via `se-phase-09-change-config`** to update the SysRS.

11. **Write `Operations_Continuous_Validation.md`** using the section list in *Deliverables*, and write the seed `RB-NN` runbook files. Apply the Conventions §6 frontmatter. Mark every unknown `TODO: <owed by>`; invent no targets or SLAs.

12. **Check the gates** (see *Exit-gate checklist*) — **ORR** (one-time, before GA) then the **continuous GA** condition. If anything is `TODO`, name who owes it and by when. Recommend ongoing: first chaos game day within 30 days of GA; first quarterly SLO + observability review scheduled; remind the user that any SysRS-affecting incident triggers a CR via `se-phase-09-change-config`, and that **Phase 11 (Disposal)** owns end-of-life — point there for decommissioning and secure data sanitization (this phase no longer carries disposal).

## Decision points

- **ORR pass / hold / go-live?** A gate decision, not a formality (Proceed · Proceed-with-actions · Hold · Stop). *Aid:* if any of {deployment, runbooks, SLOs, on-call, rollback} is missing, **Hold** — those five are the ORR definition (Conventions §3).
- **Does this REQ get an SLO?** *Aid:* every `REQ-P-*` and `REQ-O-*` must map to ≥ 1 `SLO-NN`. No SLO ⇒ either write one or file a CR to retire the REQ — never leave the REQ unmonitored.
- **What's the SLO target?** *Aid:* read it from the REQ's threshold; don't gut-feel it. If the REQ is vague ("fast"), that's a Phase-02 defect — file a CR, don't invent a number.
- **Auto-rollback or manual?** *Aid:* hard, unambiguous SLO/crash breach ⇒ **auto**-rollback within minutes; ambiguous/partial signals ⇒ manual rollback runbook. Safety-critical paths are always auto.
- **Minimum-Viable vs Formal ops (KB-19 scaling)?** *Aid:* small/low-criticality → a thin SLO set, CI smoke + UAT, lightweight runbooks, combined on-call. Large/safety-critical → full SLO suite, the complete test-type ladder, chaos program, formal PIR + CCB-gated freeze, bidirectional loop-back.
- **Is this a change at all?** *Aid:* any production push alters a baselined CI ⇒ it's a Phase-09 `CR-NN`. Ops does not bypass the CCB; the error-budget freeze *routes through* it.

## Rules

- **Conform to Conventions for everything shared.** IDs (`SLO-NN`, `RB-NN`, `CR-NN`), gates (ORR, GA), severity (`S1–S4`/`SEV-n` alias), baselines, status strings, and citations come from [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) — cite, never redefine.
- **One topic at a time.** Interview conversationally; convert answers into the deliverable; reuse prior-phase facts; never re-ask.
- **SLOs come from REQs, not gut feel.** Every Performance/Operational REQ maps to an SLO; a missing SLO is a gap, not a default.
- **Error budgets must have a policy** that routes a freeze through the **Phase-09 CCB** — a budget with no "what we do when we breach it" is theatre.
- **Runbooks are a deliverable.** Seed real `RB-NN` files (≥ 1 per SLO alert) before ORR — resolves the prior "runbooks promised but never produced" contradiction.
- **Continuous testing lives here.** This phase owns the shift-left / per-commit / service-virtualization / test-type-ladder pipeline that Phase 09 defers; don't re-author governance — cite Phase 09 for the CCB/CR loop.
- **Mark the SRE core as OUTSIDE-MATERIAL.** The SLO/error-budget/burn-rate model is Google-SRE, not the course KB — tailor it; don't present it as canon.
- **Loop closure to the SysRS is non-optional.** Any S1/S2 incident exposing a missing/weak REQ files a `CR-NN` via `se-phase-09-change-config`.
- **Disposal is Phase 11, not here.** Point to `se-phase-11-disposal` (DRR, NIST SP 800-88 sanitization); do not author EoL in this phase.
- **Don't copy the worked example's numbers blindly.** Calibrate SLO targets, burn rates, cohort sizes, and SLAs to the actual project.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

Blank versions live in [`../../../se-workflow/templates/`](../../../se-workflow/templates/). Each deliverable carries the [`Conventions §6`](../../../se-workflow/05_Conventions.md) frontmatter.

### 1. `Operations_Continuous_Validation.md`

```markdown
1.  Purpose & Scope — keep the deployed system meeting the SysRS over its life
2.  Transition & ORR Readiness — deploy/migration strategy, cutover, back-out, operator handover, ORR sign-off
3.  SLOs & Error Budgets — SLO-NN table (SLI · target · window · REQ) + burn policy (freeze routes via Phase-09 CCB)
4.  Observability — 4 pillars × tools × instrumentation (RED/USE) × dashboards × alert routes
5.  Continuous-Testing Pipeline — per-commit (shift-left, fail-fast, env-as-code, service virtualization, test-type ladder) + post-GA continuous regression cadence
6.  Chaos Engineering — game-day catalog (≥ 4), each with hypothesis · blast radius · abort · linked REQ/RB
7.  Security & Compliance Cadence — pen tests, audits, vuln-response SLA (S1–S4), crypto review
8.  OTA / Deployment Governance — cohorts, gating metrics, auto-rollback, CR-NN audit log
9.  Runbooks — RB-NN index (Symptom→Triage→Mitigation→Resolution→Post-incident trigger)
10. Incident Management — S1–S4 severity, on-call, incident commander, PIR template, loop-back CR rule
11. Gates — ORR checklist (one-time) + GA continuous condition (error budgets honoured)
12. Cross-refs — disposal → Phase 11; change governance → Phase 09
```

### 2. `runbooks/RB-NN-<slug>.md` (seed ≥ 1 per SLO alert)

```markdown
# RB-NN — <Alert / failure mode>
**Trigger:** <alert name + condition>   **Linked:** SLO-NN · REQ-* · CR-NN
- **Symptom** — <what on-call sees>
- **Triage** — <first checks; dashboards/links; severity call S1–S4>
- **Mitigation** — <stop-the-bleeding steps>
- **Resolution** — <fix to steady state>
- **Post-incident trigger** — <when to open a PIR / loop-back CR>
```

### Embedded templates (in the ops doc)

**SLO derivation cheatsheet**

| REQ pattern | SLI | Target |
|---|---|---|
| "shall achieve N% availability" | (up minutes / scheduled minutes) | N% over the REQ's window |
| "shall respond within N ms p95" | latency p95 at the boundary | ≤ N ms |
| "shall sustain N concurrent X" | concurrent gauge + saturation alert | ≤ N (soft cap 0.8N) |
| "shall recover within MTTR ≤ N" | (detected → resolved) duration | p95 ≤ N |
| "shall retain logs N years" | retention check on object store | 100% (binary) |

**Error-budget burn policy** *(OUTSIDE-MATERIAL / Google-SRE — tailor)*
```
0–50% budget used .... ship freely
50–100% used ......... ship with caution; non-critical changes need SRE sign-off
>100% (exhausted) .... freeze non-critical changes via the Phase-09 CCB; S1/S2 fixes only; daily review
Burn-rate alerts:  2%/1h → page on-call · 5%/6h → page + manager · 10%/3d → CCB-gated freeze
```

**RED + USE**

| Method | For | Three metrics |
|---|---|---|
| **RED** | Request-driven services | Rate, Errors, Duration (p50/p95/p99) |
| **USE** | Resources (CPU, disk, queue) | Utilization, Saturation, Errors |

**Vulnerability-response SLA** (map CVSS → `S1–S4`): S1 Critical (CVSS ≥ 9.0) < 7 d · S2 Major (CVSS 7.0–8.9) < 30 d · S3 Minor (CVSS 4.0–6.9) < 90 d · S4 Cosmetic (CVSS < 4.0) next planned release.

**OTA cohort defaults:** Canary 1–5% (24 h bake) → Wave 1 10–25% (48 h) → Wave 2 50% (72 h) → Full 100%; promote only on no-SLO-regression + no-crash-spike + no-ticket-spike; else auto-rollback, CR-NN filed retrospectively.

**PIR template:** date/duration · severity (S1–S4) · incident commander · summary · timeline table · 5-whys root cause · what worked / didn't · action items (owner/due/linked CR) · **SysRS impact (REQs to revisit + CR-NN filed)**.

## AI prompt pack

**Elicitation (SLOs from REQs):**
> "Interview me one topic at a time to turn my Performance and Operational requirements into SLOs. For each `REQ-P-*`/`REQ-O-*` in the SysRS, propose an `SLO-NN` row — SLI, target (read from the REQ threshold, never gut-feel), window, and linked REQ. Flag any REQ that's too vague to measure as a `TODO`/CR candidate. Don't propose burn-rate alerts until you've asked about our release cadence and risk appetite."

**Elicitation (ORR readiness):**
> "Walk me through the ORR checklist one item at a time — deployment plan, runbooks, SLOs, on-call, rollback. For each, ask what's in place vs. `TODO`, and tell me at the end whether you'd vote Proceed / Proceed-with-actions / Hold, with the blocking items."

**Generation (draft the ops plan):**
> "Draft `Operations_Continuous_Validation.md` with the 12 sections in this skill. Pull SLOs from the SysRS REQs, the regression suite from the Phase-06/07 pipeline, and the CCB/CR loop from Phase 09. Mark the SLO/error-budget content as OUTSIDE-MATERIAL/Google-SRE. Seed at least one `RB-NN` runbook file per SLO alert. Use the Conventions frontmatter; invent no targets, cohort sizes, or SLAs — mark them `TODO: <owed by>`."

**Generation (seed a runbook):**
> "Generate `runbooks/RB-NN-<slug>.md` for the `<alert>` alert using Symptom → Triage → Mitigation → Resolution → Post-incident trigger, linking `SLO-NN`, `REQ-*`, and a `CR-NN` placeholder. Keep triage steps concrete (which dashboard, which command) and assign a severity call."

**Critique / red-team:**
> "Red-team this operations plan. Which Performance/Operational REQ has no SLO? Is any error budget defined with no freeze policy, or a freeze that bypasses the Phase-09 CCB? Is the SRE core marked OUTSIDE-MATERIAL? Are runbooks real files or an empty promise? Is auto-rollback actually wired, or manual-only on a safety-critical path? Does any S1/S2 incident path fail to loop back to the SysRS via a CR? Is disposal wrongly authored here instead of Phase 11? List each gap with a fix."

## Research & specialised-agent triggers

- **Web research — SRE & continuous-testing practice:** look up the current Google SRE SLO/error-budget and multi-window burn-rate alerting guidance (*SRE Workbook* ch. 5–6), OpenTelemetry semantic conventions, and the live capability matrices for the observability/chaos tools you're choosing (Prometheus, Grafana, OTel, k6, Gremlin, Litmus). Use **Context7 MCP** for any tool/CLI/SDK config (e.g. Prometheus recording rules, OTel collector config, k6 scripting, GitHub Actions pipeline syntax).
- **Web research — standards & domain regs:** confirm IEEE 1012-2016 continuous-V&V expectations and the 15288 Transition/Operation/Maintenance process activities; for regulated domains, look up the operations/maintenance and post-market clauses (DO-178C in-service, ISO 26262 Part 7 production-operation-service, IEC 62304 §6 maintenance + §9 problem resolution, FDA post-market). For the vuln-response SLA, check current CVSS v4 banding.
- **Specialised agent — SLO-coverage agent:** spawn one to crawl the Phase-02 traceability matrix and assert every `REQ-P-*`/`REQ-O-*` has a covering `SLO-NN`; output uncovered REQs as draft CRs. Valuable on large requirement sets where manual mapping misses some.
- **Specialised agent — incident/loop-back agent:** during an active S1/S2, spawn an agent to assemble the PIR timeline from logs/traces, run a first-pass 5-whys, and draft the loop-back `CR-NN` against the implicated REQs.
- **Specialised agent — chaos-scenario agent:** generate a candidate game-day catalog from the architecture's single points of failure (read Phase-04 IBD + Phase-06 topology), each with hypothesis, blast-radius limit, and linked reliability REQ.

## Cross-cutting hooks

This phase is the **home of the continuous-validation / continuous-testing thread** (the shift-left half Phase 09 defers) and the steady-state owner of several threads ([`../../../se-workflow/01_Workflow_Overview.md §1`](../../../se-workflow/01_Workflow_Overview.md)).

- **Measurement (MOE/MOP/TPM)** *(consumes/feeds)* — SLOs operationalise `MOP-*`/`TPM-*` as live SLIs; SLO breaches update the `TPM_Tracker.md` margins. → [`../../../se-workflow/cross-cutting/Measurement_MOE_MOP_TPM.md`](../../../se-workflow/cross-cutting/Measurement_MOE_MOP_TPM.md).
- **Configuration Mgmt** *(consumes)* — every deployment/OTA push is a Phase-09 `CR-NN` against a baselined `CI-NN`; the error-budget freeze routes through the CCB. → [`../../../se-workflow/cross-cutting/Configuration_Management.md`](../../../se-workflow/cross-cutting/Configuration_Management.md).
- **Risk & Opportunity** *(feeds)* — chaos outcomes, incidents, and burn-rate trends raise/retire `RSK-NN`; the living register is reviewed at the GA loop. → [`../../../se-workflow/cross-cutting/Risk_and_Opportunity_Management.md`](../../../se-workflow/cross-cutting/Risk_and_Opportunity_Management.md).
- **Safety/RAMS** *(consumes/feeds)* — reliability/availability SLOs verify the RAMS allocation in service; incidents feed FRACAS; safety-critical paths force auto-rollback. → [`../../../se-workflow/cross-cutting/Safety_RAMS_Engineering.md`](../../../se-workflow/cross-cutting/Safety_RAMS_Engineering.md).
- **Security** *(consumes/feeds)* — pen-test/vuln cadence, crypto review, OTA signing, and CVE-driven loop-back CRs; `Threat_Model.md` informs chaos-security game days. → [`../../../se-workflow/cross-cutting/Security_Engineering.md`](../../../se-workflow/cross-cutting/Security_Engineering.md).
- **HSI** *(consumes)* — operator handover/training at transition, on-call ergonomics, and runbook usability for the humans who run the system. → [`../../../se-workflow/cross-cutting/Human_Systems_Integration.md`](../../../se-workflow/cross-cutting/Human_Systems_Integration.md).
- **Quality** *(feeds)* — SLO conformance, PIR closure, and CR-loop discipline are auditable operational-quality evidence (ISO 9001). → [`../../../se-workflow/cross-cutting/Quality_Assurance.md`](../../../se-workflow/cross-cutting/Quality_Assurance.md).
- **Cost/Schedule** *(feeds)* — operating cost (cloud spend, on-call, re-cert) feeds LCC/TCO; SLO-driven scaling decisions feed EVM re-planning. → [`../../../se-workflow/cross-cutting/Cost_Schedule_EVM.md`](../../../se-workflow/cross-cutting/Cost_Schedule_EVM.md).

## Standards anchor

This phase realises the ISO/IEC/IEEE 15288:2023 **Transition**, **Operation**, and **Maintenance** technical processes (see [`../../../se-workflow/01_Workflow_Overview.md §3`](../../../se-workflow/01_Workflow_Overview.md); Disposal is owned by Phase 11). It invokes the canonical citations from [`Conventions §9`](../../../se-workflow/05_Conventions.md):

| Concern | Canonical citation |
|---|---|
| SE lifecycle (Transition / Operation / Maintenance) | **ISO/IEC/IEEE 15288:2023** |
| Continuous verification & validation | **IEEE 1012-2016** |
| Security controls (ops, vuln mgmt) | **ISO/IEC 27001:2022**, **NIST SP 800-53 Rev. 5** |
| Quality (operational conformance) | **ISO 9001:2015** |
| Domain ops/maintenance clauses (as applicable) | DO-178C (in-service) · ISO 26262 Part 7 · IEC 62304 §6/§9 |
| SLO / error-budget model | **OUTSIDE-MATERIAL** — Google SRE (*SRE*, 2016; *SRE Workbook*, 2018) — not course KB |

> Secure media sanitization (**NIST SP 800-88 Rev. 1**) and end-of-life are anchored in **Phase 11 (Disposal)**, not here.

## Exit-gate checklist

**ORR (one-time, before GA)** — Gate owned by this phase ([`Conventions §3`](../../../se-workflow/05_Conventions.md)):

- [ ] Transition/deployment + cutover + back-out plan defined; operator handover/training done.
- [ ] Every `REQ-P-*` and `REQ-O-*` maps to an `SLO-NN` (no uncovered Performance/Operational REQ).
- [ ] Observability stack chosen; dashboard owners + alert routes assigned; RED + USE instrumented.
- [ ] On-call rotation + incident-commander role defined.
- [ ] Rollback defined — auto-rollback wired for hard breaches; manual runbook for ambiguous; mandatory-auto on safety-critical paths.
- [ ] ≥ 1 real `RB-NN` runbook file exists per SLO alert (folder is **not** empty).

**GA (continuous, after ORR):**

- [ ] Error budgets defined per SLO **with** a burn policy that routes a freeze through the Phase-09 CCB.
- [ ] Continuous-testing pipeline documented — per-commit (shift-left/fail-fast/env-as-code/service-virtualization/test-type ladder) **and** post-GA continuous regression cadence scheduled.
- [ ] ≥ 4 chaos game days defined; first one scheduled within 30 days of GA.
- [ ] Vulnerability-response SLA documented and mapped to `S1–S4`.
- [ ] OTA cohorts + gating metrics + auto-rollback + CR-NN audit log defined.
- [ ] PIR template defined; S1/S2-incident → loop-back `CR-NN` via Phase 09 rule stated.
- [ ] Disposal explicitly handed to **Phase 11** (not authored here).
- [ ] Ops doc carries Conventions frontmatter; SRE core marked OUTSIDE-MATERIAL.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| SLOs not derived from REQs. | Ops team writes SLOs independently. | Mandatory SLO→REQ trace column; any uncovered Performance/Operational REQ = a gap or CR. |
| Error budget never enforced. | Policy missing or freeze bypasses governance. | Tie burn-rate alerts to a freeze that routes through the Phase-09 CCB. |
| `runbooks/` folder is empty at ORR. | Runbooks "promised" but never written. | Seed ≥ 1 real `RB-NN` file per SLO alert before ORR; index them in the ops doc. |
| Continuous testing = "we have some tests". | Shift-left half left in Phase 09 or never built. | Own the per-commit pipeline here: shift-left, fail-fast, service virtualization, the unit→…→UAT ladder, post-GA regression. |
| Chaos game days deferred forever. | "We'll do it later." | First game day scheduled within 30 days of GA in this plan. |
| OTA rollback is manual-only. | Auto-rollback "too risky". | Auto-rollback on hard SLO/crash breach; manual only for ambiguous; always-auto on safety-critical. |
| S1 incident reveals a missing REQ but nothing changes. | Loop-back not enforced. | Every S1/S2 incident exposing a weak/missing REQ files a `CR-NN` via Phase 09. |
| SLO/error-budget presented as course canon. | No OUTSIDE-MATERIAL marker. | Mark the SRE core as outside material; tailor targets and burn rates. |
| Severity drifts (SEV-1 vs S1) across runbooks/PIRs. | Two label styles. | Use `S1–S4`; `SEV-n` is an accepted alias — pick one and stay consistent (Conventions §5.1). |
| EoL/data-wipe shoehorned into this phase. | Disposal not yet split out. | Author decommissioning + NIST SP 800-88 sanitization in **Phase 11 (Disposal)**; cross-reference only. |

## References

- [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) — IDs (`SLO-NN`, `RB-NN`, `CR-NN`), gates (ORR, GA), severity `S1–S4`/`SEV-n` alias, baselines, status strings, standard citations. **The contract.**
- [`../../../se-workflow/01_Workflow_Overview.md`](../../../se-workflow/01_Workflow_Overview.md) — the 12-stage spine; 15288 Transition/Operation/Maintenance mapping; the V-model right side closing into operations; the 8 threads.
- KB: [`Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md`](../../../Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md) — the continuous-testing half owned here: shift-left, fail-fast, environment consistency, service virtualization, the unit→integration→system→regression→UAT test-type ladder, per-commit pipeline.
- KB: [`Systems-Engineering-KB/topics/19-agile-se-playbook/fundamentals.md`](../../../Systems-Engineering-KB/topics/19-agile-se-playbook/fundamentals.md) — unified-ID end-to-end traceability (REQ ID spine through `TC-`/CR/SLO); Minimum-Viable vs Formal scaling; Phase-6 Deployment & Operations (blue-green, monitoring, change-feedback to requirements).
- [`../../worked_example/Phase_10_Operations/`](../../worked_example/Phase_10_Operations/) — fully worked operations plan + seed runbooks (EV Charging Station Network).
- Related phases: `se-phase-02-requirements` (REQ-P/REQ-O source of SLOs), `se-phase-06-integration` (CI/CD + HIL the pipeline runs on), `se-phase-07-verification` / `se-phase-08-validation` (regression + load baselines), `se-phase-09-change-config` (CCB/CR loop every change + loop-back uses), `se-phase-11-disposal` (DRR, NIST SP 800-88 — owns end-of-life).

</supporting-info>
