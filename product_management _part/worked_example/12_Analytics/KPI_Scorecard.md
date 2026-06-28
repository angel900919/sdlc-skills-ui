---
Document: KPI Scorecard — Cadence
Document ID: KPI-cadence-v1.0
Status: Living
Owner: Product Manager
Updated: 2026-06-15
---

# KPI Scorecard — Cadence

> Example artifact. Per [`templates/KPI_Scorecard.md`](../../templates/KPI_Scorecard.md); skill [`pm-phase-12-analytics`](../../skills/pm-phase-12-analytics/). Lean by design — the North Star + its input tree + guardrails. *Data-informed, not data-driven.* Values illustrative, post-GA (GA 2026-05-28).

| ID | Metric | Type | Formula | Cadence | Owner | Target | Current | Counter/guardrail |
|---|---|---|---|---|---|---|---|---|
| **MET-01** | **Weekly Active Teams (North Star)** | Outcome | teams with ≥3 standups in 7d | Weekly | PM | 120 by 09-30 | 41 | paired w/ MET-06/07 |
| MET-02 | Invite-loop | Input (leading) | invites sent / activated team / wk | Weekly | PM | ≥3.5 (KR-04) | 2.1 | spam → MET-06 |
| MET-03 | Activation | Input (leading) | % new teams 1st standup <48h | Weekly | PM | ≥40% (KR-02) | 34% | — |
| MET-04 | Completion rate | Input (leading) | % invited members who submit | Weekly | PM | ≥70% (KR-03) | 63% | quality not just volume |
| MET-05 | Frequency | Input | standups / active team / wk | Weekly | PM | ≥3 | 3.4 | MET-07 (don't nag) |
| MET-06 | Notification opt-out | **Guardrail** | % members opting out of prompts | Weekly | PM | **< 8%** | 4% | guards MET-02 growth |
| MET-07 | Time-to-submit | **Guardrail** | median seconds to submit | Weekly | PM | **< 90s** | 71s | guards the 20-sec promise |

## Reading & actions
- **MET-03 (activation 34% < 40% target)** is the binding input → the focus of [EXP-03](../13_Experiments/Experiment_Readout.md) (reminder timing) and the growth backlog (GX-01).
- Vanity check (Cutler): every metric here changes a decision; raw signup count is **not** on the scorecard.
- Guardrails green (opt-out 4%, submit 71s) → growth isn't being bought with spam or friction.
- Instrumentation per `Tracking_Plan.md` (events + taxonomy); North Star tree defined in [North_Star_and_OKRs](../01_Strategy/North_Star_and_OKRs.md).
