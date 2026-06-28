---
Document: Solution Validation — Cadence / SOL-01
Document ID: SOLVAL-cadence-v1.0
Status: Approved (G5-approved 2026-04-09)
Owner: Product Manager
Updated: 2026-04-09
---

# Solution Validation — SOL-01 (scheduled async standup)

> Example artifact. Structure per [`templates/Solution_Validation.md`](../../templates/Solution_Validation.md); skill [`pm-phase-07-solution-design`](../../skills/pm-phase-07-solution-design/). De-risks the bet **before** build by testing the most dangerous assumptions first.

## Assumptions tested (riskiest first)
| ID | Assumption | Risk type | Test | Result |
|---|---|---|---|---|
| **ASM-01** | Distributed teams will **drop the daily live standup** and trust async | Value | EXP-01 — 1-week prototype run, n=8 teams | **Pass** — 6/8 dropped or shrank the daily sync (≥60% threshold met) |
| **ASM-02** | A member can submit a standup in **<90s with no training** | Usability | EXP-02 — moderated usability, n=5 | **Pass** — median 71s, 5/5 task success |
| **ASM-05** | We can store meeting content **privately & compliantly** | Ethics/Viability | privacy-by-design review + DPIA | **Pass-with-actions** — retention 90d default + erasure path (→ PRD NFRs) |

## Prototype
Figma click-through + a Slack sandbox bot (fidelity matched to the question — desirability + usability, not scale). Storyboard: prompt fires at member-local time → 90s structured submit (Done / Doing / Blockers) → lead gets an auto-compiled digest.

## Outcome
The solution is **desirable, usable, feasible, viable, and ethical**. MVP first-slice = SOL-01 core (FEAT-01) + auto-digest (FEAT-02) + invite (FEAT-03) — the smallest thing that delivers the outcome and produces learning. **Persevere** to PRD (DEC-05). No assumption failed → no pivot. Reminder-timing (a completion driver, not a go/no-go) deferred to a post-launch experiment ([EXP-03](../13_Experiments/Experiment_Readout.md)).
