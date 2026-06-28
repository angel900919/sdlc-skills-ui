---
name: pm-phase-10-delivery
description: Runs Phase 10 (Agile Delivery & Backlog Management) — builds a G7-ready backlog into a releasable, instrumented increment while keeping flow healthy, then drives a real Release Readiness Go/No-Go. Picks the cadence (Scrum/Kanban/Scrumban/dual-track) without redefining it, plans sprints/iterations against capacity, refines the backlog just-in-time, runs WIP limits and flow/DORA metrics (not velocity-as-KPI), manages dependencies (DEP-) and risks (RSK-), triages defects by severity (ISS-, S1–S4), confirms instrumentation + rollback are live, and runs the G8 gate. Produces Delivery_Plan.md, Sprint_Plan.md, Risk_Register.md, and Release_Readiness.md. Conforms to ../../05_Conventions.md. Use when you have a G7-approved backlog and need to plan/execute delivery, set up flow metrics, build a risk register, triage defects, prove release readiness, or run a Go/No-Go. Triggers on phrasings like "sprint planning", "delivery plan", "WIP limits", "flow metrics", "DORA", "velocity", "release readiness", "go/no-go", "rollback / feature flag", "risk register", "dependency", "defect triage", "Scrum vs Kanban", "phase 10 delivery", "G8 release".
disable-model-invocation: true
user-invocable: true
---

# Phase 10 — Agile Delivery & Backlog Management

<what-to-do>

Turn the **G7-ready backlog** into a **releasable, instrumented, reversible increment** — without re-litigating scope, without becoming an output factory, and without burning the team. You run the chosen delivery cadence (set in P00, not here), keep **flow** healthy (start less, finish more), manage dependencies (`DEP-`) and risk (`RSK-`), triage defects by severity (`ISS-`, S1–S4), and confirm the release can be measured (instrumentation) and undone (rollback). The exit gate is **G8 · Release Readiness (Go/No-Go)** — decision **Persevere · Persevere-with-actions · Pivot · Hold · Kill** ([Conventions §2](../../05_Conventions.md)). Conform to [`../../05_Conventions.md`](../../05_Conventions.md) for IDs (`DEP-`/`ISS-`/`RSK-`), the gate ladder, severity (§5), status/frontmatter, the traceability spine, and folder layout — **cite the section, never redefine it**.

> **Prime directive (Conventions §7):** outcomes over outputs. "Done" is a moved `MET-`, not a closed ticket; a release with no live instrumentation cannot prove its outcome and is not ready. **Release ≠ launch** — releasing (engineering, staged, reversible) is this phase; the launch *moment* (GTM) is `pm-phase-11-launch-gtm`. Velocity is a planning aid, never a KPI or a cross-team comparison.

## Inputs (from prior phases)
Read these from the project tree ([Conventions §9](../../05_Conventions.md)) first; if one is missing, elicit + flag the source, and if a **gating** input is absent, route back. **Cross-reference by ID — never re-describe** (Conventions §4).
- **Story map + INVEST stories + AC + DoR/DoD** (`US-`, `AC-`, the `MET-` link in DoD) — from `pm-phase-09-stories` (G7). **If absent → STOP, route to `pm-phase-09-stories`.** No ready backlog = nothing to pull.
- **PRD + NFR checklist** (`FEAT-`, `REQ-<class>-`, MoSCoW/MVP line) — from `pm-phase-08-prd` (G6); the quality bar (performance/reliability/accessibility/security) you must verify before G8.
- **Operating model / cadence** (Scrum/Kanban/Scrumban, WIP policy, source-of-truth tool) — from `pm-phase-00-charter`. **Reuse it; do not re-choose** unless evidence says the method doesn't fit the work.
- **Roadmap Now item + release plan** (`RMI-`) — from `pm-phase-05-roadmap`; the slice in flight and its sequencing.
- **Outcome metric + instrumentation plan** (`MET-`, tracking plan) — from `pm-phase-12-analytics` (or `MET-TBD`); what must be *live* at G8. **If only `MET-TBD` → flag and route to `pm-phase-12-analytics` before release.**
- **Validated solution + open assumptions** (`SOL-`, `ASM-`) — from `pm-phase-07-solution-design`; assumptions still open become `RSK-` to monitor in delivery.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, never a wall of questions). Use `AskUserQuestion` for finite choices (cadence, estimate-vs-#NoEstimates, scaling approach, defect waivers). **Show back** every plan/risk/readiness call for confirmation before writing. Reuse every fact already in the tree; never re-ask. Mark anything unknown as `TODO: <what is owed — by whom — by when>` — never invent a capacity number, a flow stat, a defect count, or a "tested" claim.

1. **Identity & output location** (one message, related): confirm the project **slug**, the `RMI-`/`FEAT-` this delivery serves, the target outcome (`OBJ/KR-` + `MET-`), and the inherited cadence. Default `<output-dir>` = `<product-slug>/10_Delivery/`.
2. **Delivery plan + cadence fit.** Confirm Scrum / Kanban / Scrumban / continuous-flow from `Operating_Model.md`; re-choose only with a reason (see Decision points). Set **WIP limits**, the team's **DoD** (from `pm-phase-09-stories`), and the dual-track stance (discovery feeds the backlog continuously — *no* discovery→delivery handoff team).
3. **Plan the iteration — to flow, not to 100%.** Pull the top-priority sliced stories; plan against real **capacity with slack** (planning to ~100% utilization kills flow — Little's Law: cycle time = WIP ÷ throughput). Make the sprint/iteration goal an **outcome**, not a story count. Confirm each pulled `US-` meets DoR.
4. **Forecast probabilistically — not velocity theater.** Prefer **Monte Carlo over throughput / flow metrics** (WIP, cycle time, work-item age, throughput) for "when". Use story points only for shared understanding; **never** as a commitment, a KPI, or a cross-team yardstick. #NoEstimates / right-sizing is valid.
5. **Map dependencies & risk.** Log cross-team/technical dependencies as `DEP-` with owner + date; log delivery risks as `RSK-` scored `Likelihood × Impact` (Conventions §5.3). Carry forward still-open `ASM-` as `RSK-` to monitor.
6. **Run flow + delivery health (DORA).** Track the four/five **DORA** dimensions (deploy frequency, lead time, change-fail/rework rate, failed-deployment recovery time) as *team learning*, never to rank people or teams. Surface bottlenecks (rising work-item age, WIP breaches) and adapt.
7. **Triage defects by severity.** Log defects as `ISS-` with severity `S1`–`S4` (Conventions §5.1); separate **severity (impact)** from **priority (when we fix)**. Hold the gate on any open `S1`/`S2` unless explicitly waived with rationale.
8. **Instrumentation + reversibility (responsible-product floor).** Confirm the `MET-` is actually wired and dashboards exist (so the outcome is measurable), and that a **rollback / kill-switch** (feature flag, % rollout, canary) is in place. Verify non-functional + **accessibility (WCAG 2.2) + privacy/consent + security** for the release scope — these are an enforceable floor, not optional QA.
9. **AI-assist with a safety net.** Have the AI draft the sprint plan, refine/de-dup the backlog, predict dependencies/bottlenecks, and surface missing risks — *you* verify. AI lifts throughput but correlates with *worse* stability without guardrails (DORA): keep tests, review, and rollback as the net.
10. **Write artifacts** to `<output-dir>` with Conventions §6 frontmatter: `Delivery_Plan.md`, `Sprint_Plan.md` (`Living`), `Risk_Register.md` (`Living`), `Release_Readiness.md`. Update `_threads/Decision_Log.md` (`DEC-` for cadence/scaling/waiver calls) and `_threads/Risk_Register.md` (`RSK-`/`DEP-`).
11. **Exit-gate (G8) check.** Walk the every-gate six-thread review, then the G8 block. Record the decision in `WORKFLOW.md` + `_threads/Decision_Log.md` (`DEC-`).
12. **Done.** Print all output paths; recommend next: `pm-phase-11-launch-gtm` (the launch moment → G9) and the continuous loop (`pm-phase-12-analytics` to watch the `MET-`, `pm-phase-14-feedback`).

## Decision points
- **Is the backlog G7-ready?** *How to decide:* G7 passed, story map sliced, top stories INVEST with testable AC, DoD links a `MET-`. If not → **STOP**, route to `pm-phase-09-stories`; don't build against an unready backlog.
- **Scrum vs Kanban vs Scrumban.** *How to decide:* predictable, plannable batches with a review heartbeat → Scrum; unpredictable arrival / support-heavy / continuous flow → Kanban; a blend → Scrumban. Fit method to the *work*; don't cargo-cult ceremonies (zombie scrum).
- **Estimate vs #NoEstimates / probabilistic.** *How to decide:* if right-sizing + throughput gives a credible Monte Carlo forecast, skip points. Estimate only for shared understanding — never to commit, compare teams, or feed a KPI.
- **Scaling approach.** *How to decide:* default to homegrown/hybrid lightweight scaling; reach for **SAFe only** when org size genuinely demands it, and read the criticism first (SAFe ≠ agile by default). Process serves outcomes.
- **Defect waiver (open S1/S2).** *How to decide:* a known S1/S2 only ships with an explicit, logged rationale + owner + fix date (Persevere-with-actions). Default for an unwaived S1/S2 is **Hold**.
- **G8 verdict.** *How to decide:* AC met for scope + zero open S1/S2 (or waived) + quality verified (incl. a11y/privacy) + instrumentation live + rollback in place + no unmitigated high/critical `RSK-` → **Persevere (Go)**. Minor gaps with owners+dates → **Persevere-with-actions**. Evidence the increment doesn't move the `MET-` or solves the wrong slice → **Pivot** back to `pm-phase-09-stories`/`pm-phase-07-solution-design`. Quality/viability failed → **Hold/Kill**.

## Rules
- **Conform to Conventions, never redefine.** Gate ladder + G8 §2, IDs (`DEP-`/`ISS-`/`RSK-`/`DEC-`) §3, traceability spine §4, severity §5, frontmatter/status §6 — cite the section.
- **Outcomes over outputs.** Every increment traces up to a `RMI-`/`OPP-`/`OBJ/KR-`; "done" is a moving `MET-`, not a closed ticket ([Conventions §7](../../05_Conventions.md)).
- **AI accelerates, the human decides.** AI drafts plans, refines backlog, predicts bottlenecks; the human owns prioritization, trade-offs, the quality/stability bar, and the Go/No-Go ([Conventions §11](../../05_Conventions.md)). Never let AI throughput erode stability — keep the safety net.
- **Optimize flow, not utilization.** Start less, finish more; respect WIP limits; plan with slack. **Measure to learn, never to judge** (no velocity-as-KPI, no ranking individuals/teams).
- **Release ≠ launch.** Releasing is reversible engineering (flags, staged rollout); the GTM launch moment is `pm-phase-11-launch-gtm`.
- **Responsible-product floor is non-negotiable.** No release without a11y/privacy/security checks, live instrumentation, and a rollback.
- **Never invent.** Unknown capacity, flow number, or "tested" status = `TODO:` + a recommendation.
- **Pivot & Kill are valid outcomes.** The cheapest failed release is the one G8 stopped.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
All files carry the [Conventions §6](../../05_Conventions.md) frontmatter block. Blank templates live in [`../../templates/`](../../templates/).

- **`Delivery_Plan.md`** ★ — cadence, WIP policy, DoD reference, dual-track stance, flow/DORA metrics tracked, release strategy (flag/% rollout/canary + rollback).
- **`Sprint_Plan.md`** (`Living`) — the current iteration: outcome goal, pulled `US-`, capacity-with-slack, dependencies, forecast.
- **`Risk_Register.md`** (`Living`) — `RSK-`/`DEP-` with `Likelihood × Impact`, owner, mitigation, status (mirrors `_threads/Risk_Register.md`).
- **`Release_Readiness.md`** ★ gating — the G8 evidence pack: AC coverage, open-defect ledger (`ISS-`/severity), quality/a11y/privacy verification, instrumentation + rollback status, the Go/No-Go decision.

### `Release_Readiness.md` skeleton (copy, then replace every value)
```markdown
---
Document: Release Readiness — <Product / Release>
Document ID: REL-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## Scope
Release slice: RMI-__ · FEAT-__ · stories US-__..__  ·  Outcome: OBJ/KR-__ measured by MET-__
## Readiness ledger
| Check | Status (Pass/Gap/Waived) | Evidence / owner · date |
|---|---|---|
| AC met for release scope (US-/AC-) | <> | <> |
| Open defects: zero S1/S2 (else waived) | <> | ISS-__ (S_) — <rationale> |
| Quality verified — functional + NFR (REQ-P/O/SEC) | <> | <> |
| Accessibility (WCAG 2.2) + privacy/consent checked | <> | <> |
| Instrumentation live; MET-__ measurable; dashboard ready | <> | <> |
| Rollback / kill-switch in place (flag / % rollout) | <> | <> |
| Risk register reviewed; no unmitigated high/critical RSK- | <> | <> |
## Decision
Go / No-Go: <Persevere | Persevere-with-actions | Pivot | Hold | Kill> — DEC-__ · <evidence>
```
> Skeleton values are **placeholders** — replace or mark `TODO:`; never ship them.

### `Delivery_Plan.md` skeleton
```markdown
---
Document: Delivery Plan — <Product>
Document ID: DEL-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## Cadence
Method: <Scrum | Kanban | Scrumban>  ·  WIP limit: <>  ·  Iteration length: <or continuous>
Dual-track: discovery (P03–P07) feeds this backlog continuously — no handoff team.
## Flow & delivery health (learn, don't judge)
Flow metrics: WIP · cycle time · work-item age · throughput   |   DORA: deploy freq · lead time · change-fail/rework · recovery time
Forecasting: <Monte Carlo / throughput>  ·  Estimation: <points-for-understanding | #NoEstimates>
## Release strategy
Mechanism: <feature flag | % rollout | canary>  ·  Rollback: <kill-switch / owner>  ·  Instrumentation: MET-__
```

## AI prompt pack
Copy-paste and fill the `<>` slots. Pair with [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md).
- **ELICIT —** "You are my AI-PM partner running Phase 10 for `<release/RMI->`. Interview me **one topic at a time** toward a delivery plan, sprint plan, risk register, and release-readiness pack. Start from this backlog `<paste US-/AC-/DoD MET->` and cadence `<Scrum/Kanban>`. Reflect each answer back, reuse facts in the tree, mark gaps `TODO:`, and refuse any 'done' with no live `MET-`. Invent no capacity or flow numbers."
- **GENERATE —** "From `<paste ready stories + capacity>`, draft a sprint/iteration plan: an **outcome goal**, the pulled `US-` (respecting WIP + slack, not 100% capacity), dependencies as `DEP-`, and a **Monte Carlo / throughput** forecast for the slice. Flag any over-commit. Then draft a `Risk_Register.md` of `RSK-` (Likelihood × Impact) from the open `ASM-` and the plan."
- **CRITIQUE / RED-TEAM —** "Act as a hostile reviewer at the G8 gate. Attack this release `<paste Release_Readiness>`: which AC are unverified? Which open `ISS-` are really S1/S2 mislabeled? Is the `MET-` actually instrumented or just claimed? Is there a real rollback? Any a11y/privacy/security gap? Any velocity-as-KPI or 100%-capacity smell? Return a table: finding | severity (S1–S4) | area | why it matters | fix. End with the one question this release can't answer."
- **GATE —** "Run the G8 · Release Readiness checklist below against this evidence. For each item: Pass / Gap (owner+date) / Waived (rationale). Recommend Go (Persevere) · Persevere-with-actions · Pivot · Hold · Kill with the evidence and a `DEC-`."

## Research & specialised-agent triggers
Per [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md):
- **Talk to a customer (Part A)** — dual-track never stops: while building, keep the weekly discovery touch feeding the *next* `OPP-`; and validate any in-flight assumption a release depends on. Capture `INS-`/`OPP-`; AI-drafted plans never substitute for user contact.
- **Web research / Context7 (Part B)** when a release check binds to a standard or current data — **WCAG 2.2 AA / EN 301 549**, GDPR/consent, **EU AI Act Article 50** transparency (live Aug 2026), OWASP, or the latest **DORA** dimensions. Never assert a standard or stat from memory; cite version + obligation, hold the check at `TODO: confirm`.
- **Spawn an agent (Part C):** a **calc-verification** agent for Monte Carlo / flow forecasts; an **adversarial-reviewer** agent for the G8 red-team; a **research-synthesis** agent to theme defect/incident logs into `RSK-`/candidate `OPP-` (you verify against raw data). Outputs are inputs to verify, not truth.

## Cross-cutting hooks
Phase 10 seeds/feeds these threads (reviewed at G8):
- **Product Ops** — owns cadence, WIP policy, flow/**DORA** health, tooling, backlog hygiene → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md).
- **Metrics & Experimentation** — instrumentation must be *live* at G8 so the `MET-` is measurable; feature flags enable in-release experiments → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Responsible Product (floor)** — a11y (WCAG 2.2), privacy/consent, security verified pre-release; rollback/kill-switch as the human-oversight net → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholders** — release RACI (exactly one Accountable), Go/No-Go logged as `DEC-`, BLUF readiness updates (outcome + trade-off + ask) → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Continuous Discovery** — dual-track: delivery and discovery run in parallel; no handoff team → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); cards in [`../../frameworks/`](../../frameworks/):
- **Scrum** (Schwaber/Sutherland) — time-boxed sprints; empirical process control.
- **Kanban + flow metrics** (Anderson) — continuous flow, WIP limits, pull; WIP/cycle time/work-item age/throughput.
- **Scrumban / Dual-track Agile** (Cagan/Patton) — blend cadence; run discovery + delivery in parallel.
- **WIP limits + Little's Law** — cycle time = WIP ÷ throughput; start less, finish more.
- **DORA** (2024/2025) + Flow Framework (Kersten) — delivery-health signals, learn-not-judge.
- **Monte Carlo / probabilistic forecasting** — "when" without velocity theater; **SAFe** (with caveats — scaling only when warranted).

## Exit-gate checklist
First run the **every-gate six-thread review** ([`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md)). Then **G8 — Release Readiness (Go/No-Go)** *(owner: P10 Delivery)* — copied verbatim from the gate file (if they disagree, that file wins):
- [ ] Acceptance criteria met for the release scope; **zero open S1/S2** (or explicitly waived with rationale).
- [ ] Quality verified (functional + non-functional); accessibility + privacy checks done.
- [ ] **Instrumentation live** (the `MET-*` will actually be measurable) and dashboards ready.
- [ ] **Rollback / kill-switch** in place (feature flag or equivalent); on-call/support briefed.
- [ ] Risk register (`RSK-*`) reviewed; no unmitigated high/critical risk.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Velocity tracked as productivity / used to compare teams | Output thinking; KPI misuse | Measure flow (cycle time, throughput, DORA) **to learn, not judge**; never rank by velocity. |
| Story points treated as a commitment / hours | Estimation-as-contract | Points for shared understanding only; forecast with Monte Carlo / throughput; #NoEstimates is valid. |
| Sprint is a feature checklist with no outcome | Feature-factory reflex | Make the goal an outcome; trace the increment to `RMI-`/`OPP-`; DoD links a live `MET-`. |
| Agile theater / zombie scrum / rote SAFe | Ceremonies without empowerment | Fit method to work; cut cargo-cult ritual; reach for SAFe only when org size demands it. |
| Planning to ~100% capacity; flow stalls | No slack, WIP unbounded | Plan with slack; set WIP limits; start less, finish more (Little's Law). |
| Refining the entire backlog up front | Big-design-up-front habit | Refine just-in-time (top ~10–20 items); the backlog is living. |
| Separate discovery→delivery handoff team | Sequential thinking | Dual-track: one team runs discovery + delivery in parallel. |
| AI lifts throughput but stability drops | No safety net for AI-assisted code | Keep tests, review, flags, rollback (DORA AI guidance); validate AI output. |
| Measuring individual dev output (LOC/commits) | Surveillance metrics | Team-level flow/DORA only; outcomes over activity. |
| "Empowered team" as a slogan | Structure not changed | Give the team a problem + outcome to own, not a feature list to execute. |
| Release conflated with launch | One "ship" moment | Separate reversible release (flags/staged) from the GTM launch (`pm-phase-11-launch-gtm`). |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (gate ladder + G8 §2, IDs `DEP-`/`ISS-`/`RSK-` §3, traceability spine §4, severity §5, frontmatter §6, outcomes-over-outputs §7).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — dual-track / double-diamond context (P10 is the *deliver* converge step of the solution diamond).
- [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md) — the canonical G8 block + six-thread review.
- **2026 research sources:** https://dora.dev/dora-report-2025/ · https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report · https://www.svpg.com/product-vs-feature-teams/ · https://www.atlassian.com/agile/kanban/wip-limits · https://www.atlassian.com/agile/scrum/backlog-refinement · https://blog.logrocket.com/product-management/dual-track-agile-continuous-discovery/ · https://jeffgothelf.com/blog/safe-is-not-agile/
- **Related phases (by name):** `pm-phase-09-stories` (upstream — supplies the G7-ready backlog `US-`/`AC-`/DoD) · `pm-phase-08-prd` (the NFR quality bar) · `pm-phase-05-roadmap` (the `RMI-` in flight) · `pm-phase-12-analytics` (instruments the `MET-` that "done" depends on) · `pm-phase-11-launch-gtm` (downstream — the launch moment → G9) · `pm-phase-14-feedback` (post-release voice of customer).
- **Curriculum:** [`../../../PM_Final_WF/03-product-development-playbook.md`](../../../PM_Final_WF/03-product-development-playbook.md) — product-development playbook (build → ship).

</supporting-info>
