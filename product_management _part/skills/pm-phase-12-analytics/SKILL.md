---
name: pm-phase-12-analytics
description: Runs Phase 12 (Analytics, KPIs & Instrumentation) — the continuous measurement system that tells you whether a launched product is actually working. Turns the North Star + OKRs and the Definition-of-Done metric links into a defensible measurement model: one outcome metric with 3-5 movable input metrics arranged as a metric tree, tiered success/guardrail/diagnostic metrics, leading-vs-lagging instrumentation, and a tracking plan with an event taxonomy + governance — every metric earning its place via Cutler's vanity test. Produces Measurement_Plan.md, Tracking_Plan.md, and KPI_Scorecard.md, and owns the MET-* IDs. Conforms to ../../05_Conventions.md. Use when you need to define KPIs, build a North Star metric tree, write a tracking/event plan before a build ships, set guardrail thresholds for a launch, stand up a KPI scorecard, or audit instrumentation hygiene. Triggers on phrasings like "define our KPIs", "what's our North Star", "build a metric tree", "tracking plan", "event taxonomy", "guardrail metrics", "success metrics for launch", "is this a vanity metric", "instrument this feature", "KPI dashboard/scorecard", "data-informed", "phase 12 analytics", "MET-".
disable-model-invocation: true
user-invocable: true
---

# Phase 12 — Analytics, KPIs & Instrumentation

<what-to-do>

Build the **measurement system** that answers one question for the life of the product: *is it working?* Turn the strategy's North Star + OKRs and each story's Definition-of-Done metric link into an instrumented, governed model — **one outcome metric paired with 3-5 input metrics you can actually move**, arranged as a **metric tree**, **tiered** into success/guardrail/diagnostic, split into **leading** (act early) and **lagging** (confirm) indicators, and wired up from a deliberate **tracking plan** with a clean event taxonomy. P12 is **continuous, not a one-time pass** — it switches on before launch and never turns off; its "gate" is a recurring **health check**, not a hard G-gate ([Conventions §1](../../05_Conventions.md)). But it *feeds* two hard gates owned by other phases: **G8 Release Readiness** (instrumentation live, dashboards ready) and **G9 Launch Decision** (success + guardrail metrics with rollback thresholds). Conform to [`../../05_Conventions.md`](../../05_Conventions.md) for IDs (`MET-`), the gate ladder, severity, status/frontmatter, the traceability spine, and folder layout — **cite the section, never redefine it**.

> **Prime directive (Conventions §7):** outcomes over outputs. A metric that counts *output* (views, downloads, features shipped, cumulative totals) is a **vanity metric** — if a number can't change a decision (Cutler's test), it doesn't go on the scorecard. Measure the **value exchanged**, not the activity. Every `MET-` traces back to an `OBJ/KR-`/`OPP-`; a KPI with no decision attached is `TODO:` or deleted.

## Inputs (from prior phases)
Read these from the project tree ([Conventions §9](../../05_Conventions.md)) first; if one is missing, elicit + flag the source, and route back when a gating input is absent. **Cross-reference by ID — never re-describe** (Conventions §4).
- **North Star + OKRs** (`MET-` North Star tag, `OBJ-`/`KR-`) — from `pm-phase-01-strategy` (G1). The headline value metric and the outcomes this system must prove. **If absent → STOP, route to `pm-phase-01-strategy`.** No North Star = no tree to build.
- **Definition-of-Done metric links** (`MET-` per slice) — from `pm-phase-09-stories` (G7); "done" already points at an outcome, so the instrumentation must exist to read it.
- **Features / requirements** (`FEAT-`, `REQ-O-` operational, `REQ-SEC-` privacy) — from `pm-phase-08-prd` (G6); what to instrument and the data-handling constraints on it.
- **Release readiness / instrumentation hooks** (`RSK-`, dashboards) — from `pm-phase-10-delivery` (G8); P12 supplies the "instrumentation live" line that gate checks.
- **Launch success + guardrail metrics** (`MET-`, thresholds) — co-owned with `pm-phase-11-launch-gtm` (G9); P12 defines them, P11 sets the rollback trigger.
- **Personas / JTBD + opportunities** (`PER-`, `JOB-`, `OPP-`) — from `pm-phase-03-discovery` / `pm-phase-04-opportunity`; the proxy each metric stands in for, and the qual to triangulate against.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, never a wall of questions). Use `AskUserQuestion` for finite choices (framework pick, tier of a metric, tool of record). **Show back** every drafted metric/event for confirmation before writing. Reuse every fact already in the tree; never re-ask. Mark anything unknown as `TODO: <what is owed — by whom — by when>` — **never invent a baseline, a benchmark, a threshold, or a target** as if it were real data.

1. **Identity & output location** (one message, related): confirm the project **slug**, the `FEAT-`/`RMI-` this measures, and the North Star (`MET-` tag) + `OBJ/KR-` it serves. Default `<output-dir>` = `<product-slug>/12_Analytics/`.
2. **Anchor on value, then the question.** Restate the North Star as a *value-exchange* metric (value the customer gets, that the business captures). Pick the framework to the **question**, not by fashion: **North Star + metric tree** for the system, **AARRR** to find the leaky lifecycle stage, **HEART** (via Goals→Signals→Metrics) for UX quality. They're complementary, not rivals.
3. **Build the metric tree.** Decompose the North Star into 3-5 **input metrics you can move** (breadth · depth · frequency · efficiency). Be explicit whether each link is **component** (math) or **influence** (hypothesis). For each input name the **proxy** it stands for and its honest limits. Reject any input you can't actually act on.
4. **Tier every metric** — **success** (did the bet work?) · **guardrail** (what must *not* break: latency, error rate, churn, complaint rate, unit economics — pick 2-3) · **diagnostic** (explains *why*). Tag each **leading vs lagging** and instrument **both** — lagging-only is a rear-view mirror.
5. **Apply Cutler's vanity test to each `MET-`.** "If this number moved, what decision changes?" No answer → cut it or mark `TODO:`. Always pair the number with **context** (comparison / ratio / cohort / caveat); prefer **rates over cumulative totals**; report **retention by cohort**, never as a single blended line.
6. **Write the tracking plan.** Define the **event taxonomy** (consistent naming, typed properties, who/what/when), the events/properties each `MET-` needs, the source of truth, identity model, and an **owner + governance** rule (no new event without a spec). Instrument **deliberately from the plan** — not "track everything now."
7. **Set baselines, targets & thresholds.** Where real data exists, record the baseline; where it doesn't, mark `TODO:` and recommend a benchmark web-search or a measurement window — **never fabricate a number**. Set guardrail **rollback thresholds** with `pm-phase-11-launch-gtm` (feeds G9). North Star is set *as a system to influence*, never "optimized directly."
8. **Responsible-data + AI pass.** Confirm consent/lawful basis for analytics tracking (GDPR Art. 25, ePrivacy), PII minimisation, and AI-interaction transparency where relevant (EU AI Act Art. 50). Use AI to **draft the tree, audit the tracking plan, and flag taxonomy drift** — but the human owns what "value" means and any **causal** claim (LLMs conflate correlation with causation). Log new `RSK-`.
9. **Stand up the KPI scorecard** (`Living`): the tiered tree with current value · trend · cohort context per `MET-`, plus the NL-query / conversational-analytics entry point if the stack supports it.
10. **Write artifacts** to `<output-dir>` with Conventions §6 frontmatter: `Measurement_Plan.md`, `Tracking_Plan.md`, `KPI_Scorecard.md` (all `Living`). Update `_threads/Decision_Log.md` (`DEC-` for metric/threshold calls) and `Risk_Register.md` (`RSK-`).
11. **Health-check + handoffs.** Run the every-gate six-thread review and the P12 health check (below). Feed `MET-`/thresholds to `pm-phase-10-delivery` (G8) and `pm-phase-11-launch-gtm` (G9).
12. **Done.** Print all output paths; recommend next: `pm-phase-13-experimentation` (prove causal change on a `MET-` via `EXP-`), `pm-phase-14-feedback` (qual triangulation, `FB-`), `pm-phase-15-growth` (turn leaky-stage diagnosis into `GX-`).

## Decision points
- **Is there a real North Star?** *How to decide:* a value-exchange `MET-` tagged at G1 must exist. If not → **STOP**, route to `pm-phase-01-strategy`; don't bolt a headline metric on after the fact.
- **Which framework?** *How to decide:* match to the question — system view → North Star tree; funnel leak → AARRR; UX quality of a mandatory flow → HEART (with the honesty patch — "adoption/retention" is meaningless for software users are *forced* to use). Usually you compose two, not pick one.
- **Component vs influence link.** *How to decide:* if the child mathematically rolls up into the parent it's component; if it's a believed driver it's influence — and influence links are **hypotheses to test in `pm-phase-13-experimentation`**, label them as such.
- **Is it a vanity metric?** *How to decide:* run Cutler's test. No decision changes when it moves → it's vanity; demote to diagnostic or cut.
- **How many guardrails?** *How to decide:* 2-3 that protect the things a "win" could quietly break (quality, trust, cost, churn). One optimized metric with no guardrail is how you ship a local maximum that harms the business.
- **Data-driven or data-informed?** *How to decide:* default **data-informed** — quant tells you *what*, qual (`pm-phase-14-feedback`/discovery) tells you *why*; the human makes the call. Pure "data-driven" autopilot is an anti-pattern.

## Rules
- **Conform to Conventions, never redefine.** Continuous health-check status §1, IDs (`MET-`/`DEC-`/`RSK-`) §3, traceability spine §4, severity §5, frontmatter/`Living` status §6 — cite the section.
- **Outcomes over outputs.** Every `MET-` traces to an `OBJ/KR-`/`OPP-`; raw activity counts are not KPIs ([Conventions §7](../../05_Conventions.md)).
- **AI accelerates, the human decides.** AI drafts trees, audits taxonomy, queries in natural language, surfaces anomalies; the human owns the definition of value, causal interpretation, guardrail/rollback thresholds, and the data-ethics call ([Conventions §11](../../05_Conventions.md)).
- **Never invent.** Unknown baseline, benchmark, or target = `TODO:` + a recommendation to research or run a measurement window — never a made-up number.
- **Triangulate.** A number without qual context is half a finding; pair quant with `FB-`/insight.
- **Pivot & Kill are valid outcomes.** A guardrail breach or a flat North Star is *evidence* — recommend Pivot/Kill, not a prettier dashboard.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
All files carry the [Conventions §6](../../05_Conventions.md) frontmatter block and are `Living`. Blank templates live in [`../../templates/`](../../templates/).

- **`Measurement_Plan.md`** ★ gating — the North Star, the metric tree (tiered, leading/lagging, component/influence), each `MET-` with definition · proxy · owner · trace.
- **`Tracking_Plan.md`** ★ — the event taxonomy, events/properties per `MET-`, source of truth, identity model, consent/privacy basis, governance rule.
- **`KPI_Scorecard.md`** — the live read-out: value · trend · cohort context · tier per `MET-`, with NL-query entry point.

### `Measurement_Plan.md` skeleton (copy, then replace every value)
```markdown
---
Document: Measurement Plan — <Product / Feature>
Document ID: MET-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## North Star
**MET-01 (North Star)** — <value-exchange metric> · traces: OBJ-__ / OPP-__ · baseline: <value | TODO> · target: <value | TODO>
## Metric tree (inputs — 3-5 you can move)
| ID | Metric | Tier (success/guardrail/diagnostic) | Lead/Lag | Link to parent (component/influence) | Proxy & caveat | Trace |
|----|--------|-------------------------------------|----------|--------------------------------------|----------------|-------|
| MET-02 | <input: breadth> | success | leading | influence (hypothesis → EXP-TBD) | <what it stands for> | OBJ/KR-__ |
| MET-03 | <guardrail: e.g. p95 latency / churn> | guardrail | leading | component | <limit> | RSK-__ |
## Guardrails & rollback thresholds (feeds G9)
- MET-03 breaches at <threshold> → <rollback action> (owner: __)
## Vanity check (Cutler): every MET above answers "if this moved, what decision changes?"
```
> Skeleton values are **placeholders** — replace or mark `TODO:`; never ship them.

### `Tracking_Plan.md` skeleton
```markdown
---
Document: Tracking Plan — <Product / Feature>
Document ID: TRK-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager / Data
Updated: <YYYY-MM-DD>
---
| Event (verb_noun) | Trigger | Properties (typed) | Feeds MET- | Owner | Consent basis (GDPR) |
|-------------------|---------|--------------------|-----------|-------|----------------------|
| <activation_completed> | <when> | <id, plan, source> | MET-02 | __ | <lawful basis / consent> |
**Governance:** no new event ships without a row here. Taxonomy: <naming convention>. Identity: <model>. Source of truth: <tool>.
```

## AI prompt pack
Copy-paste and fill the `<>` slots. Pair with [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md).
- **ELICIT —** "You are my AI-PM partner running Phase 12 for `<product>`. Interview me **one topic at a time** toward a North Star metric tree + tracking plan. Start from this strategy `<paste North Star MET- / OBJ/KR->`. Reflect each answer back, trace every metric to an outcome, mark unknown baselines/targets `TODO:`, and refuse any metric that fails Cutler's vanity test. Invent no numbers."
- **GENERATE —** "From `<paste North Star + OKRs + FEAT->`, draft a metric tree: 1 North Star output + 3-5 movable input metrics (breadth/depth/frequency/efficiency). For each, tag tier (success/guardrail/diagnostic), leading vs lagging, component vs influence link, the proxy + caveat, and the events/properties needed. Propose 2-3 guardrails. Flag any metric that's an output/activity count."
- **CRITIQUE / RED-TEAM —** "Act as a hostile reviewer at the P12 health check. Attack this measurement plan `<paste>`: which metrics are vanity (output/cumulative/no-decision)? Where is the North Star being 'optimized directly' with no inputs? Which wins have no guardrail? Where is retention reported without cohorts, or a lagging metric with no leading partner? Which causal claims are really correlation? Return a table: finding | severity (S1-S4) | metric | why it matters | fix. End with the decision this scorecard can't support."
- **GATE —** "Run the P12 health-check below against this plan + tracking plan + scorecard. For each item: Pass / Gap (owner+date) / Waived. Confirm the G8 'instrumentation live' and G9 'success + guardrail thresholds' lines are satisfiable. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence."

## Research & specialised-agent triggers
Per [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md) and its **research-execution ladder**:
- **Execute with `/research-report`**: when setting a metric target with no basis (activation %, retention-curve shape, conversion, NPS/CSAT category norms), run `/research-report` for a cited benchmark set, then pick a defensible *range* — never a single fabricated number. Cite it in `Measurement_Plan.md`.
- **Talk to a customer (Part A)** when a proxy metric's *meaning* is assumed — interview to confirm the number reflects real value (triangulate quant + qual); capture `INS-`/`FB-`, hold the metric's interpretation at `TODO:` until grounded. **A dashboard never substitutes for asking why.**
- **Web research / Context7 (Part B, trigger 3)** for **benchmarks to sanity-check a target** — never assert "good retention is X%" from memory; cite the source + segment, hold the target at `TODO: confirm`. Also trigger 4 for analytics-consent / EU AI Act Art. 50 obligations.
- **Spawn an agent (Part C):** a **research-synthesis** agent to theme large feedback/usage volume into candidate inputs (you verify against raw data); a **calc-verification** agent for any rate/cohort/metric-tree math; an **always-on anomaly/autonomous-analytics** agent to surface guardrail breaches (it flags, the human interprets causality). Outputs are inputs to verify, not truth.

## Cross-cutting hooks
Phase 12 is the operational **home** of the Metrics thread; it seeds/feeds (reviewed at every gate):
- **Metrics & Experimentation** — P12 *is* this thread's instrumentation core; every `MET-` becomes an experiment hypothesis for `pm-phase-13-experimentation` → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Continuous Discovery** — quant flags the *what*; discovery/qual supplies the *why* (data-informed, not data-driven) → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Responsible Product (floor)** — analytics consent/lawful basis (GDPR Art. 25), PII minimisation, AI-interaction transparency (EU AI Act Art. 50) are designed *into* the tracking plan → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholders** — the KPI scorecard is the outcome-first exec read-out (BLUF: outcome/trade-off/ask, not "we shipped X"); metric/threshold calls logged as `DEC-` → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Product Ops** — tracking-plan governance, event taxonomy, instrumentation hygiene, tool of record → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md).

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); cards in [`../../frameworks/`](../../frameworks/):
- **North Star Framework + metric tree** (Amplitude; Sean Ellis) — 1 output + 3-5 inputs; component vs influence links.
- **AARRR "Pirate Metrics"** (Dave McClure) — map the lifecycle funnel; find the leaky stage.
- **HEART** (Kerry Rodden et al., Google) — UX quality via Goals→Signals→Metrics (with the honesty patch for mandatory software).
- **Leading vs lagging indicators**; **guardrail metrics**; **success/guardrail/diagnostic tiering**; **Cutler's vanity-metric test**; **tracking plan + event taxonomy + governance**; **OKRs** (the outcomes the tree proves).

## Exit-gate checklist
P12 is **continuous — it owns no hard G-gate**; this is a recurring **health check / done-when**, run at every cross-cutting review and before any gate it feeds (G8, G9). First run the **every-gate six-thread review** ([`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md)); its Metrics line is copied verbatim:
- [ ] **Metrics & Experimentation** — North Star + inputs current; every new bet has a `MET-*`; guardrails defined.

**P12 done-when (health check):**
- [ ] One **North Star** (value-exchange `MET-`) with **3-5 movable input metrics** as a metric tree; no lone/uninstrumented North Star.
- [ ] Metrics **tiered** (success/guardrail/diagnostic) and tagged **leading/lagging**; 2-3 **guardrails** with rollback thresholds (feeds G9).
- [ ] Every `MET-` passes **Cutler's vanity test**, shows context (cohort/ratio/caveat), and traces to an `OBJ/KR-`/`OPP-`.
- [ ] **Tracking plan** exists with event taxonomy + governance; **instrumentation live & dashboards ready** (feeds G8); consent/privacy basis recorded.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Raw counts as success (views, downloads, cumulative charts) | Output-counting reflex | Measure value exchanged; rates over totals; apply Cutler's test. |
| A lone North Star with no inputs / "optimize the North Star directly" | No metric tree | Decompose into 3-5 movable inputs; the North Star is influenced, not pulled. |
| Optimizing one metric, something else breaks | No guardrails | Define 2-3 guardrails with rollback thresholds before the bet ships. |
| Lagging-only dashboards | Confirmatory metrics only | Pair every lagging metric with a leading partner you can act on. |
| "Track everything now" | No tracking plan | Instrument deliberately from a plan; enforce taxonomy + governance. |
| Retention reported as one blended line | No cohorts | Report retention by cohort; always show comparison/context. |
| NPS / a survey score as the primary KPI | Score with no behavioral grounding | Demote to diagnostic; ground in behavior + qual (triangulate). |
| Pure "data-driven" autopilot | Number worship, no judgment | Data-**informed**: quant=what, qual=why, human decides. |
| AI reads correlation as causation | Over-trusting AI analysis | Human owns causal claims; prove with `pm-phase-13-experimentation`. |
| Output/feature-count roadmap metrics | Feature-factory measurement | Tie every `MET-` to an `OBJ/KR-`/`OPP-`; kill activity KPIs. |
| Tracking ships with no consent basis | Privacy treated as legal's job | Bake consent/lawful basis + PII minimisation into the tracking plan. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (continuous health-check §1, IDs `MET-` §3.3, traceability spine §4, severity §5, `Living` frontmatter §6, outcomes-over-outputs §7).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the continuous measure→learn→grow loop (§4: why P12-P15 never end).
- [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md) — the six-thread review; the G8/G9 blocks P12 feeds.
- **2026 research sources:** https://amplitude.com/books/north-star/about-north-star-framework · https://amplitude.com/blog/vanity-metrics · https://amplitude.com/blog/create-tracking-plan · https://mixpanel.com/blog/metric-tree/ · https://www.statsig.com/perspectives/leading-vs-lagging-indicators-in-product-metrics · https://posthog.com/product-engineers/guardrail-metrics · https://www.productfocus.com/why-product-managers-should-not-be-data-driven/
- **Related phases (by name):** `pm-phase-01-strategy` (upstream — supplies the North Star + OKRs) · `pm-phase-09-stories` (DoD `MET-` links) · `pm-phase-10-delivery` (instrumentation live → G8) · `pm-phase-11-launch-gtm` (success/guardrail thresholds → G9) · `pm-phase-13-experimentation` (proves causal change on a `MET-`) · `pm-phase-14-feedback` (qual triangulation) · `pm-phase-15-growth` (acts on the leaky-stage diagnosis).
- **Curriculum:** [`../../../PM_Final_WF/04-product-launch-playbook.md`](../../../PM_Final_WF/04-product-launch-playbook.md) — launch & measurement playbook (KPIs, instrumentation, success metrics).

</supporting-info>
