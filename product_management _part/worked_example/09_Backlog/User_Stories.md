---
Document: User Stories — Cadence Async Standup
Document ID: US-cadence-asyncstandup-v1.0
Status: Approved (G7-approved 2026-04-16)
Owner: Product Manager
Updated: 2026-04-16
---

# User Stories — Cadence Async Standup

> Example artifact. Per [`templates/User_Stories.md`](../../templates/User_Stories.md); skill [`pm-phase-09-stories`](../../skills/pm-phase-09-stories/). Vertical slices, INVEST, Given/When/Then. A story is a placeholder for a conversation, not a spec.

## US-01 — Submit a standup in under 90 seconds (FEAT-01)
*As an IC (PER-02), I want to be prompted at my local time and submit Done/Doing/Blockers fast, so I stay aligned without a meeting interrupting my focus.*
- **AC-01 (Given/When/Then):** *Given* a scheduled standup day, *when* my local time reaches the team's window, *then* I receive a prompt in Slack with three fields.
- **AC-02:** *Given* the prompt, *when* I submit, *then* it saves in < 2s and confirms; median completion < 90s (guardrail MET-07).
- **AC-03:** *Given* I'm on holiday/DND, *when* the prompt would fire, *then* I can snooze/skip without breaking my streak unfairly.
- **AC-04 (a11y):** fully keyboard- and screen-reader-operable (REQ-U-01).

## US-02 — See my team's blockers without reading everything (FEAT-02)
*As a team lead (PER-01), I want an auto-compiled digest with blockers surfaced first, so I can unblock people early without chasing updates.*
- **AC-01:** *Given* the standup window closed, *when* the digest generates (< 5s, REQ-P-01), *then* **blockers appear pinned at the top**, then Doing/Done.
- **AC-02:** *Given* a member didn't submit, *when* I view the digest, *then* missing members are clearly shown (solves INS-06 "no one knows who's missing").
- **AC-03:** *Given* a blocker, *when* I click it, *then* I can reply/assign in one step.

## Definition of Ready / Done
- **DoR:** problem + AC + design + dependencies (DEP-01) known; sized; no open blocker. (A light readiness check, not a rigid gate.)
- **DoD:** AC pass; a11y + privacy checks done; **instrumented for MET-03/MET-04/MET-07** (no DoD without the metric); released behind a flag.

**Gate G7 — Backlog Ready:** **Persevere**. Sequencing/estimation via flow (right-sizing, not points-as-commitment).
