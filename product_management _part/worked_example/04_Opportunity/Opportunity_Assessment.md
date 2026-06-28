---
Document: Opportunity Assessment — Cadence / OPP-01
Document ID: OPPA-cadence-v1.0
Status: Approved (G3-approved 2026-03-12)
Owner: Product Manager
Updated: 2026-03-12
---

# Opportunity Assessment — OPP-01 (async standup)

> Example artifact. Structure per [`templates/Opportunity_Assessment.md`](../../templates/Opportunity_Assessment.md); skill [`pm-phase-04-opportunity`](../../skills/pm-phase-04-opportunity/). Assesses the **selected** opportunity from the [OST](Opportunity_Solution_Tree.md).

## 1. The opportunity (Cagan 10-questions, condensed)
- **Problem / who:** distributed team leads (PER-01) learn about blockers a day late and can't align without forcing someone off-hours (INS-01, INS-04, INS-05).
- **How big / how do we measure:** the daily-alignment pain hits ~every distributed team; success = North Star **MET-01** (Weekly Active Teams) and **MET-03** activation.
- **Why us / why now:** AI-cheap build era + Slack distribution; we win on *lowest-friction habit* (Strategy §2). Status quo is an improvised Slack thread (INS-06) — beatable.
- **Go-to-market:** PLG via Slack directory + invite loop; sales-assist past ~3 active teams.

## 2. Sizing (illustrative — not a forecast)
- Reach ≈ waitlist-derived 2,000 reachable distributed teams/quarter. SAM/SOM: *TODO confirm via P02 (`Business_Case.md`)*. TAM is a ceiling, not a target.

## 3. The four big risks + ethics
| Risk | Verdict | Evidence / mitigation |
|---|---|---|
| **Value / desirability** | ✅ strong | INS-01/04/05 (12–11 of 14); validated in EXP-01 |
| **Usability** | ⚠ → ✅ | ASM-02 "submit <90s, no training" — tested in EXP-02 (passed) |
| **Feasibility** | ✅ | Slack API + timezone scheduling confirmed with eng (DEP-01) |
| **Business viability** | ✅ | PLG + sales-assist; standup is also the activation + growth event |
| **Ethics (5th risk)** | ⚠ → ✅ | stores meeting content (PII-adjacent) → privacy-by-design (ASM-05), retention/erasure, WCAG 2.2 — handled in PRD NFRs + [Responsible Product](../../cross-cutting/Responsible_Product.md) |

## 4. Recommendation & decision
**Persevere** with OPP-01 as the lead bet (→ SOL-01 → RMI-01/04). OPP-02 to Next pending a discovery spike; OPP-03 to Later. Logged as **DEC-03** (G3, 2026-03-12). What would change the call: EXP-01 reversing (it didn't).
