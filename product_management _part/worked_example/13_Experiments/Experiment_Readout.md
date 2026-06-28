---
Document: Experiment Readout — EXP-03 Reminder Timing
Document ID: EXP-cadence-03-v1.0
Status: Approved (decision logged 2026-06-22)
Owner: Product Manager
Updated: 2026-06-22
---

# Experiment Readout — EXP-03 (reminder timing → activation/completion)

> Example artifact. Per [`templates/Experiment_Readout.md`](../../templates/Experiment_Readout.md); skill [`pm-phase-13-experimentation`](../../skills/pm-phase-13-experimentation/).

## Hypothesis
*We believe* prompting members at **member-local 9:00** (vs a fixed team-UTC time) *will increase* standup completion (**MET-04**) and activation (**MET-03**) *for distributed teams* *because* INS-04 says fixed times punish someone's timezone. (Tests the completion driver flagged in the [OST](../04_Opportunity/Opportunity_Solution_Tree.md).)

## Design
- **Unit / arms:** randomized by team. A = fixed team-UTC prompt (control); B = member-local prompt.
- **Primary metric (OEC):** MET-04 completion rate. **Guardrails:** MET-06 opt-out (must not rise), MET-07 time-to-submit.
- **Power:** MDE +5pp at 80% power, α=0.05 → ~140 teams/arm; ran 3 weeks (≥1 full business cycle). **Sequential / always-valid** monitoring (no naive peeking). A/A pre-check + SRM check passed.

## Result
| Metric | Control (A) | Variant (B) | Lift | Decision-relevant |
|---|---|---|---|---|
| MET-04 completion | 61% | 69% | **+8pp** (CI +4 to +12, significant) | ✅ primary win |
| MET-03 activation | 33% | 38% | +5pp | ✅ secondary |
| MET-06 opt-out (guardrail) | 4.1% | 4.3% | +0.2pp | ✅ within guardrail |
| MET-07 time-to-submit | 72s | 70s | −2s | ✅ |

## Decision
**Ship variant B** (member-local prompts) to 100%. Primary metric won and **no guardrail breached** — the decision rule. Effect size (not just p) reported. Rolled out behind the existing flag. Feeds the activation push toward KR-02. *When NOT to test reminder copy next: low traffic on a sub-segment → use qualitative discovery instead.*
