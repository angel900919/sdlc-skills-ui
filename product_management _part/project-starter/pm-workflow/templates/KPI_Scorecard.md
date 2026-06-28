---
Document: KPI Scorecard — <Product / Feature>
Document ID: KPI-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — blank & reusable, kept deliberately LEAN. Owning skill: pm-phase-12-analytics (Phase 12 — Analytics, KPIs & Instrumentation).
Companions: Measurement_Plan.md (defines & traces every MET-*) · Tracking_Plan.md (how each is captured).
Conforms to ../05_Conventions.md — §3.3 IDs (MET-*), §4 traceability spine, §6 frontmatter/Living status, §7 outcomes-over-outputs.
RULES: the live read-out, not a second measurement plan — one row per MET-*, each with a COUNTER-METRIC so a "win" can't be gamed.
Always show CONTEXT (trend / cohort / ratio), never a lone number. NEVER invent a value/target — write "TODO: <owner · date>".
Lead exec readers with the outcome, not "we shipped X". Refresh on cadence; status stays Living.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example rows.
-->

# KPI Scorecard — <Product / Feature>

**As of:** <YYYY-MM-DD> · **Cadence:** <weekly | monthly> · **NL-query / dashboard:** TODO: <tool / MCP link>

## BLUF (exec read)
<!-- One line: the outcome + the trade-off + the ask. NOT a feature list. -->
TODO: <North Star is <up/flat/down> to <value> vs target <value>; <main driver>; ask: <decision needed>.

## Scorecard
<!-- One row per MET-*. Status: ● on track · ◐ at risk · ○ off track · ⬚ no baseline yet (TODO).
Counter-metric = the guardrail that this KPI must not be "won" at the expense of (anti-gaming). -->
| `MET-` | Metric | Formula / definition | Tier | Owner | Cadence | Baseline | Current (+ trend) | Target | Counter-metric (must not break) | Status |
|--------|--------|----------------------|------|-------|---------|----------|-------------------|--------|---------------------------------|--------|
| `MET-01` | <North Star> | TODO: <exact calc / window> | North Star | <role> | <weekly> | TODO | TODO: <val ▲/▼/▬> | TODO | `MET-0n` <guardrail> | ⬚ |
| `MET-02` | <input — breadth> | TODO | success | <role> | <weekly> | TODO | TODO | TODO | `MET-0n` | ⬚ |
| `MET-03` | <input — depth> | TODO | success | <role> | <weekly> | TODO | TODO | TODO | `MET-0n` | ⬚ |
| `MET-0n` | <guardrail — e.g. p95 latency / churn> | TODO | guardrail | <role> | <weekly> | TODO | TODO | <stay < X> | — | ⬚ |
<!-- Prefer rates over cumulative totals. Every row must pass Cutler's test (if it moved, a decision changes) — else cut it. -->

## Retention (by cohort — never one blended line)
<!-- Context is mandatory. A single blended retention number hides the truth. -->
| Cohort (signup week/month) | Period 1 | Period 2 | Period 3 | Notes |
|----------------------------|----------|----------|----------|-------|
| <YYYY-MM> | TODO % | TODO % | TODO % | TODO |
| <YYYY-MM> | TODO % | TODO % | TODO % | TODO |

## Guardrail watch
<!-- Quick status of the 2–3 guardrails + their rollback thresholds (full thresholds in Measurement_Plan.md §3). -->
- `MET-0n` <guardrail> — threshold <X> · current TODO · status <ok / breached → action `RSK-<nn>`>.

## What changed & what we'll do
<!-- Data-INFORMED, not data-driven: quant = what, qual (FB-*) = why, the human decides the action. -->
- **Reading (what):** TODO: <which MET-* moved, with cohort/ratio context>
- **Why (qual):** TODO: <triangulate with `FB-*` / insight `INS-*` — a number without a why is half a finding>
- **Decision / action:** TODO: <Persevere · Persevere-with-actions · Pivot · Hold · Kill> → log `DEC-*`. <!-- A flat North Star or a guardrail breach is evidence, not a reason for a prettier dashboard. -->

## Traceability
- **Defined & traced in:** [Measurement_Plan.md](Measurement_Plan.md) (each `MET-*` → `OBJ/KR-*` / `OPP-*`).
- **Captured via:** [Tracking_Plan.md](Tracking_Plan.md).
- **Open hypotheses → experiments:** influence-link `MET-*` rows → pm-phase-13-experimentation (`EXP-*`).

---
**Related (Phase 12):** [Measurement_Plan.md](Measurement_Plan.md) · [Tracking_Plan.md](Tracking_Plan.md)
**Owning skill:** pm-phase-12-analytics · **Status:** Living continuous read-out (informs G8 & G9)
**Log:** material reads/decisions → `_threads/Decision_Log.md` (`DEC-*`) · guardrail breaches → `_threads/Risk_Register.md` (`RSK-*`)
**Next:** pm-phase-13-experimentation (prove change) · pm-phase-14-feedback (the *why*, `FB-*`) · pm-phase-15-growth (act on the leaky stage, `GX-*`)
