# <Product Name> — Tracker

> **The one file that holds your product's state.** Copy this into `products/<slug>/` first, update it after every gate, and you can stop and resume across weeks without losing the thread. Time budget: 5 minutes after every gate. An unrecorded gate is a failed gate. Everything else links from here.
>
> Status key: `☐` not started · `▶` in progress · `✅` gate passed · `⏸` on hold · `⏭` tailored out (row in the tailoring log below)

## You are here

| | |
|---|---|
| **Product** | <name> (`<slug>`) |
| **Owner** | <who owns this end-to-end — an idea nobody owns is Parked> |
| **One-line problem** | <from the charter — technology-free> |
| **Product type** | <sw / AI / HW / hybrid — this switch decides which conditional templates apply: AI → copy `03`; HW → copy `04`; hybrid → both; sw → neither> |
| **[AI] Archetype** | <chatbot·RAG / extraction / recommendation / forecasting / generation / agent / n-a> |
| **[HW] Platform** | <e.g. Pi 5 / ESP32 / custom PCB / n-a> |
| **Risk check** | <lean OK / escalation trigger fired: which — see the PM_SE README → Right-sizing> |
| **Current phase** | <P0–P6> |
| **Last gate passed** | <G_ · date> |

## Phases

| ✓ | # | Phase | Key artifacts | Exit gate · verdicts | Verdict · date |
|---|---|---|---|---|---|
| ☐ | P0 | Frame | `01_charter` | **G0 Frame Check** — Proceed / Park | |
| ☐ | P1 | Discover | `02_validation_log` · `03_ai_feasibility`* · `04_hw_feasibility`* · `05_opportunity_gate` | **G1 Opportunity Gate ★** — GO / GO-with-de-risk / PIVOT / KILL | |
| ☐ | P2 | Design | `06_spec` · `07_ship_bar` · `08_architecture` | **G2 Design Freeze ★** — Approve-&-Freeze / Revise (freezes ship-bar + spec + interfaces) | |
| ☐ | P3 | Build & Prove | `09_build_plan`* · `10_verification_matrix` · `17_trial_brief`* · `11_launch_checklist` (§1 go/no-go) | **G3 Ship-Ready ★** — GO / Iterate / KILL (VERIFIED + VALIDATED, both blocks) | |
| ☐ | P4 | Launch | `11_launch_checklist` · `12_runbook` | **G4 Launch** — Advance / Hold / Rollback per ramp stage; exits "Landed" | |
| ☐ | P5 | Operate & Evolve | `13_ops_review` · `14_incident_postmortem`* · `17_trial_brief`* | **G5 Health Check** (recurring) — Continue / Iterate / Re-open / Sunset | |
| ☐ | P6 | Sunset | `18_sunset_checklist` | **G6 Clean Exit** — Complete / Blocked | |

★ = never skip. \* = conditional — copy only when the product-type row or the named trigger says so; skipping gets a tailoring-log row, never silence. Running artifacts, alive in every phase: `15_decision_log` · `16_risk_register`.

## Gate log

> A gate is a decision, not a status. It doesn't convene until its input artifacts exist, and the red-team prompt (PM_SE `AI_PROMPTS.md` #1) runs first — at n=1 that prompt IS your review board. Log every verdict, including Hold and KILL, with evidence.

| Date | Gate | Verdict | Evidence / conditions (owner · due) | Notes |
|---|---|---|---|---|
| | | | | |

## What's deployed — the release tuple

> Every release tag pins ALL six rows. Deployed must match tagged — drift found at a gate blocks the gate until reconciled. Anything frozen changes only via a change note in `15_decision_log.md` + version bump. Rows that don't apply stay here marked `n-a`, with a tailoring-log line.

| Item | Current version | Where it runs | Last changed (date · DEC / change note) |
|---|---|---|---|
| Code (git tag) | | | |
| Prompt set | | | |
| Model ID (pinned) | | | |
| Eval-set hash | | | |
| Firmware (semver) | | | |
| Hardware rev | | | |

## Open TODOs

> Unknowns live here, never as invented facts. Format: `TODO: <what's owed> — <who> — <by when>`

- [ ] TODO:

## Tailoring log

> Nothing in PM_SE is skipped silently. One row per skipped template, section, or thread — "we decided," never "we forgot."

| Item skipped | `tailored out: <reason>` | Date |
|---|---|---|
| `04_hw_feasibility` *(example — delete)* | tailored out: pure software, no hardware | |

## Kill memo (only if killed — and that's a win)

| | |
|---|---|
| **Problem we were solving** | |
| **Which filter/gate failed** | |
| **Evidence** | |
| **What we salvaged** (learnings, assets, contacts) | |
