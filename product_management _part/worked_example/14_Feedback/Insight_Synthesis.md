---
Document: Insight Synthesis — Cadence (post-launch)
Document ID: FBSYN-cadence-v1.0
Status: Living
Owner: Product Manager
Updated: 2026-07-10
---

# Insight Synthesis — Cadence (post-launch feedback)

> Example artifact. Per [`templates/Insight_Synthesis.md`](../../templates/Insight_Synthesis.md); skill [`pm-phase-14-feedback`](../../skills/pm-phase-14-feedback/). Feedback is **raw material for discovery, not a backlog of orders** — themes, not transcripts. Synthesised from in-product microsurveys + support tickets + sales calls (AI-clustered, human-reviewed against raw quotes).

| ID | Theme (FB) | Channels | Frequency / weight | Maps to |
|---|---|---|---|---|
| **FB-01** | "I want blockers separated from general updates / a 'still blocked' nudge" | in-app survey + 6 tickets | High (and 2 Pro accounts) | strengthens FEAT-02 → fast-follow |
| **FB-02** | "Let me find what we decided weeks ago" | tickets + 1 sales call | Medium-High | confirms **OPP-02** (Next) → discovery spike |
| **FB-03** | "The video-summary thing — I didn't know it existed / never use it" | support + usage data | Low usage, recurring confusion | → **sunset** signal ([DEC-07](../16_Sunset/Sunset_Decision.md)) |

## Loop closed
- **Inner loop:** replied to the 6 FB-01 reporters within 48h; shipped the "still blocked" nudge; told them.
- **Outer loop:** FB-02 → a new `OPP` on the [opportunity solution tree](../04_Opportunity/Opportunity_Solution_Tree.md) (validates OPP-02 demand before building); FB-03 → sunset assessment.
- **Discipline:** frequency ≠ importance — one Pro renewal voice (FB-01) weighed against volume; NPS/CSAT used as relationship signals, paired with verbatims, never as the product KPI.
