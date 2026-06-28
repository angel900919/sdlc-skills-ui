---
Document: Measurement Plan — <Product / Feature>
Document ID: MET-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — blank & reusable. Owning skill: pm-phase-12-analytics (Phase 12 — Analytics, KPIs & Instrumentation).
Companions: Tracking_Plan.md (how each MET-* is captured) · KPI_Scorecard.md (the live read-out).
Upstream input: North_Star_and_OKRs.md (Phase 01 — supplies MET-01 + OBJ-*/KR-*). If no North Star exists, STOP and route to pm-phase-01-strategy.
Conforms to ../05_Conventions.md — §3.3 IDs (MET-*), §4 traceability spine, §6 frontmatter/Living status, §7 outcomes-over-outputs.
RULES: one value-exchange North Star + 3–5 INPUT metrics you can actually MOVE. Tier every metric (success/guardrail/diagnostic),
tag leading/lagging, label each link component (math) or influence (hypothesis → EXP-*). Apply Cutler's vanity test to every MET-*.
NEVER invent a baseline/benchmark/target — write "TODO: <what is owed — owner · date>". Keep status Living; this never "finishes".
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
-->

# Measurement Plan — <Product / Feature>

## How to read this
*The system that answers one question for the life of the product: is it working?* One outcome
metric (North Star), 3–5 movable inputs as a tree, each tiered and tagged leading/lagging.
P12 is **continuous** (a recurring health check, not a hard gate), but it **feeds G8** (instrumentation
live) and **G9** (success + guardrail thresholds with rollback).

## 1. North Star — `MET-01`
<!-- The single headline VALUE-EXCHANGE metric (value the customer gets, that the business captures).
Reject it if it can rise while customers churn or while trust/quality degrades. Influence it via the tree below — never "optimize it directly". -->
- **`MET-01` (North Star) — <name>:** TODO: <one value-exchange metric, e.g. "weekly active <job> completed">
- **Definition / formula:** TODO: <exact calc — numerator / denominator, window, who counts>
- **Proxy for + caveat:** TODO: <the real value this stands in for — and where the proxy lies>
- **Traces to:** `OBJ-<nn>` / `KR-<nn>` · `OPP-<nn>`  <!-- no MET- without an outcome behind it (§4) -->
- **Baseline:** TODO: <value — owner · date>  →  **Target / direction:** TODO: <where & by when>
- **Owner / cadence:** <role> · reviewed <weekly | monthly>

## 2. Metric tree (3–5 inputs you can move)
<!-- The few levers that compound into MET-01. Cover the dimensions that fit your model: breadth (how many) ·
depth (how much each) · frequency (how often) · efficiency/quality. Resist a sprawling tree — 3–5 total. -->
```
                         MET-01  <North Star>
                                │
   ┌───────────────┬───────────┼───────────────┬───────────────┐
 MET-02          MET-03      MET-04          MET-05          MET-06
 <input:        <input:     <input:         <guardrail:     <diagnostic:
  breadth>       depth>      frequency>      e.g. p95 lat>    explains why>
```

| ID | Metric | Tier (success/guardrail/diagnostic) | Lead/Lag | Link to parent (component/influence) | Proxy & caveat | Baseline (TODO) | Trace |
|----|--------|-------------------------------------|----------|--------------------------------------|----------------|-----------------|-------|
| `MET-02` | TODO: <input — breadth> | success | leading | influence (hypothesis → `EXP-TBD`) | TODO: <what it stands for> | TODO | `OBJ/KR-<nn>` |
| `MET-03` | TODO: <input — depth> | success | leading | component (rolls up mathematically) | TODO | TODO | `OBJ/KR-<nn>` |
| `MET-04` | TODO: <input — frequency> | diagnostic | lagging | influence (→ `EXP-TBD`) | TODO | TODO | `OPP-<nn>` |
<!-- component = child mathematically sums into parent · influence = believed driver = a HYPOTHESIS to test in pm-phase-13-experimentation. -->
<!-- Pair every lagging metric with a leading partner you can ACT on — lagging-only is a rear-view mirror. -->

## 3. Guardrails & rollback thresholds (feeds G9)
<!-- 2–3 metrics that protect what a "win" could quietly break: latency, error rate, churn, complaint rate, unit economics, trust/safety.
Set the rollback threshold WITH pm-phase-11-launch-gtm — this is the line that the G9 launch decision and any rollback trigger reads. -->
| ID | Guardrail metric | Must stay… | Rollback threshold | Action if breached | Owner |
|----|------------------|-----------|--------------------|--------------------|-------|
| `MET-03` | TODO: <e.g. p95 latency> | <below X ms> | TODO: <breach value> | TODO: <halt rollout / revert flag> | <role> · `RSK-<nn>` |
| `MET-0n` | TODO: <e.g. weekly churn> | <below X%> | TODO | TODO | <role> · `RSK-<nn>` |
<!-- One optimized metric with no guardrail is how you ship a local maximum that harms the business. -->

## 4. Leading / lagging map
<!-- Quick reference: which metrics let you act EARLY (leading) vs CONFIRM after the fact (lagging). Instrument BOTH. -->
- **Leading (act early):** TODO: <MET-02, MET-03 — early signals you can intervene on this week>
- **Lagging (confirm):** TODO: <MET-01, MET-04 — outcomes that confirm weeks later>

## 5. Framework lenses (compose, don't pick one)
<!-- Match the framework to the QUESTION, not to fashion. Delete lenses you aren't using. -->
- **North Star + metric tree** — the system view (this doc's spine).
- **AARRR (Pirate Metrics)** — *use to find the leaky lifecycle stage:* TODO: <Acquisition→Activation→Retention→Referral→Revenue — where's the leak?>
- **HEART (Goals→Signals→Metrics)** — *UX quality of a key flow:* TODO: <Happiness/Engagement/Adoption/Retention/Task-success>. <!-- Honesty patch: "adoption/retention" is meaningless for software users are FORCED to use — demote to Task-success. -->

## 6. Vanity check (Cutler's test) — every `MET-` must pass
<!-- For each metric above: "If this number moved, what DECISION changes?" No answer ⇒ it's vanity ⇒ demote to diagnostic or cut. -->
- Raw counts (views, downloads, registered users, cumulative totals) are **not** KPIs — measure value exchanged; prefer **rates over totals**; report **retention by cohort**, never one blended line.
- TODO: <list any metric on watch / pending a decision-link, or mark resolved>

## 7. Agent / API user metrics *(if the product serves agents/automations, not only humans)*
<!-- 2026 two-stream shift: give the agent user class its own metrics — task-success rate, human-intervention rate, API reliability/latency.
Delete this section if not applicable. -->
- `MET-<nn>` — TODO: <agent task-success rate> · tier: success · trace: `OBJ/KR-<nn>`
- `MET-<nn>` — TODO: <human-intervention / fallback rate> · tier: guardrail

## 8. Responsible-data pass (the floor — non-negotiable)
<!-- Designed INTO the tracking plan, not bolted on. Detail lives in Tracking_Plan.md §consent. -->
- **Consent / lawful basis** for analytics tracking recorded (GDPR Art. 25, ePrivacy). TODO: <basis>
- **PII minimisation** — no metric requires more personal data than its decision needs. TODO: <confirm>
- **AI-interaction transparency** where relevant (EU AI Act Art. 50). TODO: <confirm / N/A — why>
- New risks logged as `RSK-*` → `_threads/Risk_Register.md`.

## 9. Conversational / autonomous analytics entry point *(2026)*
<!-- NL querying (MCP into Claude/ChatGPT) replaces dashboard hunting; always-on agents surface anomalies/guardrail breaches.
The agent FLAGS; the human owns causal interpretation (LLMs conflate correlation with causation). -->
- NL-query of record: TODO: <tool / MCP endpoint, or "N/A">
- Always-on anomaly watch on: TODO: <which MET-* / guardrails>

## 10. Traceability & handoffs
- **Derived from:** `01_Strategy/North_Star_and_OKRs.md` (`MET-01`, `OBJ-*`/`KR-*`) · opportunities `OPP-*` from `04_Opportunity/`.
- **Instrumented in:** [Tracking_Plan.md](Tracking_Plan.md) — every `MET-*` gets events/properties + a source of truth there.
- **Read out in:** [KPI_Scorecard.md](KPI_Scorecard.md) — value · trend · cohort context · tier per `MET-*`.
- **Influence links → experiments:** each `influence` row is a hypothesis for pm-phase-13-experimentation (`EXP-*`).
- **Placeholders:** unresolved links use `MET-TBD` / `EXP-TBD` (never a blank cell); resolve in the owning phase (Conventions §3.4).

---
**Related (Phase 12):** [Tracking_Plan.md](Tracking_Plan.md) · [KPI_Scorecard.md](KPI_Scorecard.md) · upstream [North_Star_and_OKRs.md](North_Star_and_OKRs.md)
**Owning skill:** pm-phase-12-analytics · **Status:** continuous health check (feeds G8 Release Readiness & G9 Launch Decision)
**Log:** metric/threshold calls → `_threads/Decision_Log.md` (`DEC-*`) · new risks → `_threads/Risk_Register.md` (`RSK-*`)
**Next:** pm-phase-13-experimentation (prove causal change on a `MET-*`) · pm-phase-14-feedback (qual *why*) · pm-phase-15-growth (act on the leaky stage)
