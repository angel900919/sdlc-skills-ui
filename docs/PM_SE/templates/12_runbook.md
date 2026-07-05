# RB-<nn> — <Failure mode> — <Product Name>

> **Phase 4 / G4 · ~15 min each, written BEFORE launch, reviewed after every firing.** Copy one per plausible 3 a.m. failure into `runbooks/RB-<nn>-<slug>.md` — 2–5 per product covers it: site down · device offline/bricked · LLM provider outage or cost spike · data looks wrong · restore from backup. An empty `runbooks/` folder is a G4 Hold. 3 a.m.-you has no memory: exact commands and URLs, zero prose. Delete sections that don't apply.

**Trigger:** <alert name + condition, e.g. SLO-01 error rate > <x> % over 10 min>
**Linked:** SLO-<nn> · REQ-<class>-<nn> · **Severity:** S<1–4>

## Symptom

<What you actually see — the alert text, the dashboard panel, the user report.>

## Triage (exact commands — no thinking at 3 a.m.)

1. Open dashboard <URL> → check <panel / metric>.
2. Run `<command>` → confirms or rules out <hypothesis>.
3. Blast radius: how many users / devices? Confirm severity S1–S4.

## Mitigation (stop the bleeding — reversible steps first)

1. <Roll back to previous tag: `<command>` · flip flag `<name>` · fail over to <standby>.>
2. Verify recovery on <dashboard> · post the pre-written rollback note from [11_launch_checklist.md](11_launch_checklist.md) §3.

## Resolution + prevention

1. <Durable fix · re-enable once <gating metric> is healthy · confirm SLO-<nn> green over <window>.>
- Prevention note: <what changes so this can't silently recur — a REQ, a test/eval, or this runbook>.

**Post-incident:** S1/S2 or a repeat → [14_incident_postmortem.md](14_incident_postmortem.md) within 48 h. Update this file after every firing.
