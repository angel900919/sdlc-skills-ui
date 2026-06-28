---
Document: PRD — Cadence Async Standup (MVP)
Document ID: PRD-cadence-asyncstandup-v1.0
Status: Approved (G6-approved 2026-04-14)
Owner: Product Manager
Updated: 2026-04-14
---

# PRD — Cadence Async Standup (MVP)

> Example artifact. Lean PRD per [`templates/PRD.md`](../../templates/PRD.md); skill [`pm-phase-08-prd`](../../skills/pm-phase-08-prd/). A PRD **documents validated decisions** — it doesn't replace discovery.

## 1. Problem, user & outcome (the why)
- **Problem:** distributed teams can't align daily without an off-hours meeting; blockers surface late (OPP-01; INS-01/04/05).
- **Target user:** distributed eng/product team leads (PER-01) + ICs (PER-02).
- **Outcome / success metric:** grow **MET-01** (Weekly Active Teams) via **MET-03** activation ≥40% (KR-02). Ties to OBJ-01.
- **Validated by:** [Solution_Validation](../07_Solution/Solution_Validation.md) (ASM-01/02/05 passed).

## 2. Scope (MoSCoW — hold the MVP line)
- **Must (P0):** FEAT-01 timezone-aware standup prompt + 90s structured submit; FEAT-02 auto-compiled team digest with blockers surfaced; FEAT-03 teammate-invite in the flow.
- **Should (P1, fast-follow):** edit a submitted standup; per-member schedule.
- **Could (P2):** weekly summary email.
- **Won't / out-of-scope:** live video, task tracking, searchable notes (that's OPP-02, Next). Recorded — not forgotten.

## 3. Requirements
| ID | Class | Requirement |
|---|---|---|
| REQ-F-01 | Functional | Prompt each member at their local time on scheduled days; accept Done/Doing/Blockers. |
| REQ-F-02 | Functional | Auto-compile submissions into a team digest; **blockers pinned at top**. |
| REQ-F-03 | Functional | One-click teammate invite from the standup flow; track acceptance (MET-02). |

## 4. Non-functional requirements (where launches die)
| ID | Class | Requirement |
|---|---|---|
| REQ-U-01 | Usability/Access | **WCAG 2.2 AA**: keyboard + screen-reader for submit & digest; tested with axe. |
| REQ-P-01 | Performance | Digest generated < 5s after the standup window closes. |
| REQ-O-01 | Reliability | Prompt delivery ≥ 99% on schedule; retries on Slack API failure. |
| REQ-SEC-01 | Security/Privacy | Meeting content encrypted at rest; **retention 90d default; erasure on request** (GDPR Art. 25); least-privilege Slack scopes. |
| REQ-C-01 | Constraint | Slack-native MVP; web fallback is Later (RMI-05). EU AI Act: no automated decisioning in MVP → minimal-risk; revisit if AI summaries added. |

## 5. Open questions & dependencies
- DEP-01 timezone/scheduling service (DST + per-member local). - Open Q: digest delivery channel (DM vs channel)? → resolve in design.

## 6. Sign-off
Eng + Design + PM reviewed; **Persevere** (DEC-06, G6 2026-04-14). → slice into stories: [User_Stories](../09_Backlog/User_Stories.md).
