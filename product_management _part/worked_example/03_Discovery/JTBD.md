---
Document: Jobs-to-be-Done — Cadence
Document ID: JTBD-cadence-v1.0
Status: Approved (G2-approved 2026-02-26)
Owner: Product Manager (the trio)
Updated: 2026-02-26
---

# Jobs-to-be-Done — Cadence

<!-- Switch/Forces to FIND the job; ODI to QUANTIFY the under-served outcomes. Every JOB-* traces to a real INS-*. -->

## 1. School & rationale
- **School(s) used:** Switch/Forces (find the switch from live → async) · ODI (quantify which outcomes are under-served).
- **Why:** the core decision is whether teams will *switch away* from the live standup (forces), and which sub-outcomes to attack first (ODI opportunity scores).

## 2. Job map / job stories (`JOB-*`)
| Job | Job story | Type | Traces to | Carried by |
|---|---|---|---|---|
| JOB-01 | When my team is spread across timezones, I want to share and absorb daily progress without a live meeting, so I can protect focus time and still catch blockers early. | functional | INS-01, INS-04, INS-05 | PER-01, PER-02 |
| JOB-02 | When I need to recall what we decided, I want to search past standups and notes, so I can act without re-asking the team. | functional | INS-02 | PER-01, PER-02 |
| JOB-03 | When I report up to my VP, I want a ready digest of team status, so I look on top of it without chasing people. | social/emotional | INS-03 | PER-01 |

> Personas: **PER-01** Lead Layla (team lead, champion) · **PER-02** Maker Marco (IC engineer, user) · **PER-03** Budget-holder Bianca (VP Eng, economic buyer). Full cards: Personas.md (TODO).

## 3. Desired outcomes — ODI
| Outcome statement | Job | Importance | Satisfaction | Opportunity = Imp + max(Imp−Sat, 0) |
|---|---|---|---|---|
| Minimize the time to share my daily update when I'm in a different timezone from the team. | JOB-01 | 4.6 | 1.9 | **7.3** |
| Minimize the time to catch a teammate's blocker after they hit it. | JOB-01 | 4.4 | 2.1 | **6.7** |
| Minimize the time to find a past decision when I need it. | JOB-02 | 4.2 | 1.8 | **6.6** |
| Minimize the effort to compile team status for my own manager. | JOB-03 | 3.8 | 2.4 | **5.2** |
| Maximize uninterrupted focus/maker time in my morning. | JOB-01 | 4.5 | 2.0 | **7.0** |
<!-- 1–5 scale; n=14, illustrative. Opportunity > 7 = strongly under-served. -->

## 4. Forces of progress — Switch
| Force | What pushes/pulls/holds them | Evidence |
|---|---|---|
| **Push** (what's wrong with today) | Live standup punishes a timezone every day; blockers surface late; focus time is shredded. | INS-01, INS-04, INS-05 |
| **Pull** (the better outcome) | A 90-second async standup at my local time + a digest the team actually reads. | INS-04, INS-06 |
| **Habit** (inertia) | "We already do it in a Slack thread" — good-enough chaos; switching feels optional. | INS-06 |
| **Anxiety** (risk of the new) | "Will the team actually fill it in? Is our data safe if it stores what we write?" | INS-06, RSK-02 |

## 5. Under-served outcomes → seed opportunities
| Under-served outcome / job | Why it matters (evidence) | Candidate `OPP-*` |
|---|---|---|
| Share daily update across timezones fast (opp. 7.3) + reclaim focus time (7.0) + catch blockers fast (6.7) | Highest opportunity scores; 12 of 14; the core switch | **OPP-01** |
| Find a past decision fast (opp. 6.6) | Strong, distinct job (JOB-02) | OPP-02 |
| Compile status for manager (opp. 5.2) | Real but lower; ride on the digest | OPP-03 |

## 6. Open questions / TODO
- TODO: re-run ODI importance/satisfaction post-launch with a larger n to confirm OPP-01 dominance — owner PM, 2026-Q3.
- Anxiety force ("is our data safe") is load-bearing → routed to ASM-05 (privacy) for pm-phase-07.

---
*Built by* **pm-phase-03-discovery** from `Research_Insights.md` (`INS-*`). Candidate `OPP-*` → **pm-phase-04-opportunity** (OST, sizing, G3).
