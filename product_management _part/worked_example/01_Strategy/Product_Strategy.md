---
Document: Product Strategy — Cadence
Document ID: STRAT-cadence-v1.0
Status: Approved (G1-approved 2026-01-29)
Owner: Product Manager
Updated: 2026-01-29
---

# Product Strategy — Cadence

> Cadence is B2B SaaS for distributed software teams: lightweight **async standups** + **searchable meeting/decision notes**. This doc is the Rumelt kernel that the North Star, OKRs, and roadmap measure and enact.

## 1. Diagnosis — the single most important obstacle/insight
Distributed software teams are forced into a false choice: hold a **live standup** that someone always attends off-hours and that shreds maker focus time, or **skip alignment** and let blockers surface days late buried in Slack noise. The crux is that the daily-alignment job is real and frequent, but every tool treats it as a *meeting* (synchronous, ephemeral) instead of a *written, searchable artifact*. Whoever makes async alignment feel as low-effort as posting in Slack — but structured, complete, and findable — wins the habit.
<!-- Evidence: INS-01, INS-04, INS-05 (03_Discovery/Research_Insights.md) | Where it's a bet: ASM-01, see §7 -->

## 2. Guiding policy — our overall approach to the diagnosis
Win the **daily habit**, then own the **record**. Be the lowest-friction way a distributed team does a standup (under 90 seconds, at each person's local time, no meeting), and turn the exhaust of that habit — the standups and decisions — into a searchable team memory competitors who only do "status updates" can't match. Distribute via the team itself: every standup invites the rest of the team. Our leverage is the **value-exchange loop** (a completed standup is both the value and the growth event) that a meeting tool or a generic Slack bot cannot copy without becoming us.

## 3. Coherent actions — the few mutually-reinforcing moves
- **Ship the async-standup core first** (timezone-aware prompt → 90-second structured submit → auto-compiled team digest) — this *is* the habit and the activation event. (enacts §2 "win the daily habit")
- **Make every completed standup a growth event** — teammate-invite loop built into the core flow, so adoption compounds team-by-team. (reinforces action 1: more members = a more complete digest = more value)
- **Turn the habit's exhaust into searchable team memory** — standups and decisions become findable notes (Next horizon). (enacts §2 "own the record"; raises retention/switching cost)
- **Privacy-by-design from day one** — because we store meeting content, retention/erasure + WCAG 2.2 are table-stakes that also become a sales-assist trust wedge with the VP buyer. (de-risks §2 and §7 ASM-05)

## 4. Strategy Stack alignment (Mehta)
Mission → Company strategy → **This product strategy** → Roadmap → Goals (OKRs)
- **Mission / company strategy above us:** "Help distributed teams do their best work without more meetings." (single-product company; PM is the de facto product strategy owner)
- **This product strategy (this doc):** win the daily async-alignment *habit* (low-friction standup), then own the searchable *record*; grow team-by-team via the invite loop.
- **Cascades down into:** Roadmap ([../05_Roadmap/Roadmap.md](../05_Roadmap/Roadmap.md)) and OKRs ([North_Star_and_OKRs.md](North_Star_and_OKRs.md))

## 5. Non-goals — what we are explicitly NOT doing
- **Not building a video/live-meeting tool** — the whole bet is *removing* the live sync; a meeting feature would contradict the diagnosis. (a later "video summary" experiment is sunset in 16_Sunset for exactly this reason)
- **Not chasing enterprise IT/SSO/admin depth this year** — we win bottom-up via team leads (champion), not top-down procurement; depth comes after the habit lands.
- **Not a general project-management / task tracker** — we integrate with Jira/Linear, we don't replace them; competing there dilutes the standup habit.
- **Not paid-acquisition-led** — distribution is the invite loop + PLG, not ad spend (see §6).

## 6. Distribution — how customers will find & adopt this
**PLG + sales-assist hybrid.** Free for small teams; primary loop is the **teammate-invite** built into the standup flow (a lead activates, invites the team, members invite adjacent teams). Champion = team lead, who self-serves; sales-assist engages when an account shows expansion signals (PQL) for the VP/budget-holder. Secondary channel: integrations marketplace (Slack/Teams) once the core habit is proven.
<!-- TODO: confirm invite-loop channel economics (k-factor, cycle time) via pm-phase-02-market-research + post-launch MET-02 — owner PM, by 2026-07-31. -->

## 7. Strategic risks & assumptions
- **RSK-01:** Teams keep the live sync *and* adopt Cadence → no focus-time win, weak retention. — Likelihood 3 × Impact 4 = High; mitigation: measure focus-time/meeting-reduction in discovery + post-launch; owner PM. (→ `_threads/Risk_Register.md`)
- **RSK-02:** Storing meeting content (PII-adjacent) creates privacy/compliance exposure. — L2 × I5 = High; mitigation: privacy-by-design, retention/erasure, DPIA; owner Privacy/Legal.
- **ASM-01** (most load-bearing): Distributed teams will *replace* their live standup with an async one (not run both). — test via concept/prototype EXP-01 (pm-phase-07) + post-launch retention.
- **ASM-02:** A member can complete a standup in <90s without training. — test via usability EXP-02 (pm-phase-07).
- **ASM-05:** We can store standup/decision content privacy-by-design with retention/erasure and no viability blocker. — legal/DPIA review (pm-phase-07).

## 8. Responsible-product floor (non-negotiable)
- We store meeting/decision content (PII-adjacent): **privacy-by-design** (GDPR Art. 25, data minimization), explicit **retention windows + self-serve erasure**, **WCAG 2.2 AA** on all flows, and consent before behavioral tracking. North Star **guardrails** (notification opt-out rate, time-to-submit) live in [North_Star_and_OKRs.md](North_Star_and_OKRs.md) so growth is never bought with spam or friction.

---
**Related (Phase 01):** Vision.md (TODO) · [North_Star_and_OKRs.md](North_Star_and_OKRs.md)
**Owning skill:** pm-phase-01-strategy · **Exit gate:** G1 · Strategy Sign-off → **Persevere** (DEC-01, 2026-01-29)
**Log on sign-off:** `DEC-01` → _threads/Decision_Log.md · `RSK-01`, `RSK-02` → _threads/Risk_Register.md
**Next:** pm-phase-03-discovery (validate ASM-01/02/05) · pm-phase-05-roadmap (turn §3 into outcomes)
