# Worked Example — "Cadence"

> A coherent, end-to-end instance of the [Product Management Workflow](../README.md), demonstrating how the artifacts chain along the **traceability spine** ([Conventions §4](../05_Conventions.md)). It teaches by demonstration: every ID is reused consistently across files, so you can trace any bet back to evidence and forward to a metric.
>
> **Cadence** is a B2B SaaS for distributed software teams: lightweight **async standups + searchable decision notes** — "stay aligned without an off-hours meeting." PLG + sales-assist; free for small teams. *(All numbers are illustrative for teaching, not real market data.)*

This is a **representative subset** of the full artifact set (one per key phase) — enough to show the whole chain. A real product carries every deliverable in [Conventions §9](../05_Conventions.md). Tailoring: **Standard**, with the **Responsible Product** thread at **Full** (it stores customer meeting content).

---

## The traceability spine (this instance)

```
INS-01..06 (insights)  ──  JOB-01 (job-to-be-done)  ──  PER-01/PER-02
   └─ OPP-01 ★ (stay aligned across timezones without an off-hours meeting)
        └─ OBJ-01 / KR-01..03  ── measured by ──  MET-01 (North Star: Weekly Active Teams ≥3/wk)
             └─ RMI-01 + RMI-04 (Now)        inputs: MET-02 invite · MET-03 activation · MET-04 completion · MET-05 frequency
                  └─ SOL-01 (scheduled async standup: TZ-aware prompt → 90s submit → auto-digest)
                       └─ ASM-01 ── tested by ── EXP-01/EXP-02/EXP-03 (all passed)
                            └─ FEAT-01/02/03 (PRD) ── US-01/US-02 (+ AC-*) ── ships at GA 2026-05-28
   FB-01..03 (post-launch feedback) ──▶ new OPP back into discovery
   GX-01 (growth loop) ──▶ MET-02     ·     DEC-07 ──▶ sunset FEAT-09 (video summary, off-strategy)
```

## Artifacts in this example

| Phase | File | Key IDs |
|---|---|---|
| 01 Strategy | [Product_Strategy.md](01_Strategy/Product_Strategy.md) · [North_Star_and_OKRs.md](01_Strategy/North_Star_and_OKRs.md) | OBJ-01/02, KR-01..05, MET-01..07 |
| 03 Discovery | [Research_Insights.md](03_Discovery/Research_Insights.md) · [JTBD.md](03_Discovery/JTBD.md) | INS-01..06, JOB-01..03, PER-01/02 |
| 04 Opportunity | [Opportunity_Solution_Tree.md](04_Opportunity/Opportunity_Solution_Tree.md) · [Opportunity_Assessment.md](04_Opportunity/Opportunity_Assessment.md) | OPP-01..04, SOL-01..03 |
| 06 Prioritization | [Prioritization_Matrix.md](06_Prioritization/Prioritization_Matrix.md) | RICE on OPP-01..03 |
| 05 Roadmap | [Roadmap.md](05_Roadmap/Roadmap.md) | RMI-01..05 |
| 07 Solution | [Solution_Validation.md](07_Solution/Solution_Validation.md) | ASM-01/02/05, EXP-01/02 |
| 08 PRD | [PRD.md](08_PRD/PRD.md) | FEAT-01..03, REQ-* |
| 09 Backlog | [User_Stories.md](09_Backlog/User_Stories.md) | US-01/02, AC-* |
| 12 Analytics | [KPI_Scorecard.md](12_Analytics/KPI_Scorecard.md) | MET-01..07 |
| 13 Experiments | [Experiment_Readout.md](13_Experiments/Experiment_Readout.md) | EXP-03 |
| 11 Launch | [GTM_Plan.md](11_Launch/GTM_Plan.md) | launch tier · PLG+SLG |
| 14 Feedback | [Insight_Synthesis.md](14_Feedback/Insight_Synthesis.md) | FB-01..03 |
| 15 Growth | [Growth_Model.md](15_Growth/Growth_Model.md) | GX-01, MET-02/03 |
| 16 Sunset | [Sunset_Decision.md](16_Sunset/Sunset_Decision.md) | DEC-07, FEAT-09 |

## Gate decision log (this instance)

| Date | Gate | Decision | DEC | Notes |
|---|---|---|---|---|
| 2026-01-29 | G1 Strategy Sign-off | **Persevere** | DEC-01 | North Star MET-01 + OBJ-01/02 agreed |
| 2026-02-26 | G2 Problem Validated | **Persevere** | DEC-02 | 14 interviews; INS-01/04/05 strong |
| 2026-03-12 | G3 Opportunity Go/No-Go | **Persevere** | DEC-03 | OPP-01 selected; OPP-04 parked into OPP-01 |
| 2026-03-19 | G4 Roadmap Commit | **Persevere-with-actions** | DEC-04 | RMI-01/04 Now; size OPP-02 demand (owner PM) |
| 2026-04-?? | G5 Solution Validated | **Persevere** | DEC-05 | ASM-01/02 held in EXP-01/02 |
| 2026-04-?? | G6 PRD Approved | **Persevere** | DEC-06 | NFRs incl. WCAG 2.2 + PII retention/erasure |
| 2026-05-28 | G9 Launch Decision (GA) | **Persevere** | — | staged 5%→100%; PLG + sales-assist |
| 2026-09-30 | G10 End-of-Life (FEAT-09) | **Kill (feature)** | DEC-07 | video-summary deprecated — off-strategy |

> The full `_threads/Decision_Log.md`, `Business_Case.md`, `Tracking_Plan.md`, `Release_Plan.md`, and `Vision.md` are referenced by these artifacts but not all reproduced here (illustrative subset). The chain above is complete and consistent end-to-end.
