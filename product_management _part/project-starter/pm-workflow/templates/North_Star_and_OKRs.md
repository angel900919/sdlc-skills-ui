---
Document: North Star & OKRs — <Product>
Document ID: NSOKR-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — blank & reusable. Owned by skill: pm-phase-01-strategy (Phase 01 — Product Strategy & Vision).
Siblings: Vision.md (the future) · Product_Strategy.md (the choices this measures).
Conforms to ../05_Conventions.md — §3 IDs (MET-*, OBJ-*, KR-*), §4 traceability spine, §6 frontmatter, §7 outcomes-over-outputs.
RULES: pick ONE value-exchange North Star (it rises only when a customer got REAL value AND it LEADS revenue) — never a
vanity metric (DAU, registered users, raw revenue). Hang 3–5 INPUT metrics beneath it (the levers you can actually move).
OKRs MEASURE the strategy; they are not the strategy. Every KR is an OUTCOME (a moved metric), never a shipped feature.
Never invent a baseline — write "baseline: TODO (owner·date)". Mandatory at every tailoring profile: the North Star + ≥1 OKR.
-->

# North Star & OKRs — <Product>

## 1. North Star Metric — `MET-01`
<!-- The single headline value-exchange metric. Reject it if it can rise while customers churn (vanity test). -->
- **`MET-01` — <North Star name>:** TODO: <one value-exchange metric, e.g. "weekly active <job> completed">
- **Why it's value-exchange (not vanity):** <how this only goes up when a customer realised value AND why it leads revenue>
- **Baseline:** TODO: <current value — owner·date>   →   **Target / direction:** TODO: <where & by when>
- **Guardrails (so growth isn't bought with harm):** TODO: <2–3 metrics that must NOT degrade — privacy, trust, quality, cost, churn>
- **Owner / cadence:** <role> · reviewed <weekly | monthly>

## 2. Input-metric tree (3–5 levers under the star)
<!-- The few inputs you can directly move that COMPOUND into the North Star. Cover the dimensions that fit your model,
     e.g. breadth (how many) · depth (how much each) · frequency (how often) · efficiency/quality. Tag each MET-*. -->
```
                         MET-01 <North Star>
                                │
   ┌───────────────┬───────────┼───────────────┬───────────────┐
 MET-02          MET-03      MET-04          MET-05          MET-06
 <input:        <input:     <input:         <input:         <input:
  breadth>       depth>      frequency>      efficiency>     quality>
```
| ID | Input metric | What it measures | Leading/Lagging | Baseline (TODO) | Moves the star by… |
|----|--------------|------------------|-----------------|-----------------|--------------------|
| `MET-02` | TODO: <name> | TODO: <…> | Leading | TODO | TODO: <mechanism> |
| `MET-03` | TODO: <name> | TODO: <…> | Leading | TODO | TODO |
| `MET-04` | TODO: <name> | TODO: <…> | Leading | TODO | TODO |
<!-- Add MET-05 / MET-06 only if they're genuinely distinct levers (3–5 total; resist a sprawling tree). -->

## 3. Objectives & Key Results
<!-- 1–3 Objectives (qualitative, inspiring, time-boxed). Each KR is measurable and an OUTCOME (from X to Y by date).
     Every KR should move MET-01 or an input metric above — that line back to the star IS the traceability spine (§4).
     If a "KR" names a feature or a ship date, it's output — rewrite it as the metric that feature is meant to move. -->

### `OBJ-01`: TODO: <qualitative outcome we want this horizon>
- **`KR-01`:** TODO: <move MET-0x from X to Y by YYYY-MM-DD> — *moves: `MET-0x`*
- **`KR-02`:** TODO: <…> — *moves: `MET-0x`*
- **`KR-03`:** TODO: <…> — *moves: `MET-0x`*

### `OBJ-02`: TODO: <second objective — optional>
- **`KR-04`:** TODO: <outcome, from X to Y by date> — *moves: `MET-0x`*
- **`KR-05`:** TODO: <…> — *moves: `MET-0x`*

<!-- ### OBJ-03: add only if it earns its place; 1–3 objectives keep focus (Conventions §7). -->

## 4. Traceability & instrumentation handoff
<!-- Forward: strategy → outcome → bet. Backward: any KR should answer "why are we doing this?" up to Product_Strategy.md. -->
- **Derived from strategy:** these OKRs measure the coherent actions in [Product_Strategy.md](Product_Strategy.md) §3.
- **To be instrumented in:** pm-phase-12-analytics (`Tracking_Plan.md`, `KPI_Scorecard.md`) — each `MET-*` gets an event/source there.
- **Placeholders:** unresolved links use `MET-TBD` (never a blank cell); resolve in the owning phase (Conventions §3.4).

---
**Related (Phase 01):** [Vision.md](Vision.md) · [Product_Strategy.md](Product_Strategy.md)
**Owning skill:** pm-phase-01-strategy · **Exit gate:** G1 · Strategy Sign-off (verdicts: Persevere / Persevere-with-actions / Pivot / Hold / Kill)
**Log on sign-off:** `MET-*` seeds → _threads/Metrics (cross-cutting/Metrics_and_Experimentation.md) · `DEC-*` → _threads/Decision_Log.md
**Next:** pm-phase-12-analytics (instrument these) · pm-phase-05-roadmap (outcomes derive from these OKRs)
