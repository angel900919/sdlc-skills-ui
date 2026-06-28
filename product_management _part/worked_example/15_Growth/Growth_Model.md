---
Document: Growth Model — Cadence
Document ID: GROWTH-cadence-v1.0
Status: Living
Owner: Product Manager
Updated: 2026-07-20
---

# Growth Model — Cadence

> Example artifact. Per [`templates/Growth_Model.md`](../../templates/Growth_Model.md); skill [`pm-phase-15-growth`](../../skills/pm-phase-15-growth/). A **loop, not a funnel**.

## The growth loop (collaboration loop)
```
new team activates (1st standup, MET-03)
      │
      ▼
invites teammates in the standup flow (MET-02)  ──┐
      │                                            │ compounds
      ▼                                            │
teammates join → completion rises (MET-04)         │
      │                                            │
      ▼                                            │
team hits ≥3 standups/wk = Weekly Active (MET-01) ─┘ → some invite *other* teams in the org (land-and-expand)
```
Retention is the engine: a team only stays in MET-01 if it keeps getting value weekly. **AARRR read:** Activation (MET-03) is the leaky stage (34% < 40%) → highest-leverage.

## Levers & current focus
- **Activation (aha = first useful digest):** reduce time-to-first-standup; member-local prompts already lifted it ([EXP-03](../13_Experiments/Experiment_Readout.md)).
- **Invite loop (MET-02 2.1 → target 3.5):** the compounding lever.
- **Retention/expansion:** Pro conversion at the 3-active-teams PQL (sales-assist).

## Growth experiment backlog (ICE-ranked) — see Growth_Experiment_Backlog.md
| ID | Experiment | Lever | ICE | Status |
|---|---|---|---|---|
| **GX-01** | Prompt the inviter to add 2 teammates at activation (vs 1) | MET-02 invite-loop | High | Running |
| GX-02 | "Still blocked?" nudge in the digest (from FB-01) | MET-04/retention | Med | Queued |
| GX-03 | Reverse-trial of Pro for teams hitting the PQL | monetization | Med | Queued |

> No dark patterns: the opt-out guardrail (MET-06 < 8%) gates every invite/notification experiment — growth not bought with spam.
