# Incident Postmortem — <INC-nn: short title>

> **Copy only when an incident fires (outage, data issue, harmful/wrong AI output at scale, cost blowout, device field failure). Skipping? One line in the tracker's tailoring log.**
>
> **Phase 5 · within 48h of any incident — feeds the next G5 Health Check.** Budget: ~1 hour. Blameless: the question is *"why did our gates let this through?"*, never *"who shipped it?"*. The anti-pattern this file prevents: traffic recovers, everyone moves on, the same failure ships again next month. Delete sections that don't apply.

| Incident ID | Date | Severity | Owner |
|---|---|---|---|
| INC- | | S1 / S2 / S3 / S4 | |

## 1. What happened

- **User impact:** <who, how many, what they experienced, for how long>
- **Detected by:** <alert / user report / luck — "luck" is itself a finding>

## 2. Timeline

| Time | Event |
|---|---|
| | first bad output / failure |
| | detected |
| | mitigated (rollback? kill switch? power-cycle?) |
| | resolved |

## 3. Root cause (keep asking "why" past the first answer)

- **Immediate cause:** <…>
- **Underlying cause:** <the gate / guardrail / assumption that let it through>

## 4. Fixes (each with an owner and a date, or it's a wish)

| # | Action | Type | Owner | Due | Done |
|---|---|---|---|---|---|
| 1 | <stop recurrence of the **category**, not just this instance> | prevent | | | ☐ |
| 2 | <detect it faster next time> | detect | | | ☐ |
| 3 | <mitigate faster next time> | respond | | | ☐ |

## 5. LOOP-CLOSURE — the incident is closed only when the failure can't silently recur

At least one of these changed, or the postmortem isn't done:

- [ ] A requirement changed in `06_spec.md` (via change note in `15_decision_log.md`)
- [ ] A test/eval case added — **fails on the pre-fix version, passes on the fix** (otherwise it tests nothing)
- [ ] A runbook (`12_runbook.md`) created or updated

**[AI]** — delete if no AI:
- [ ] Failing case(s) in the **next** eval-set version: <n> cases
- [ ] Guardrail added/tuned: <which, threshold>
- [ ] Full eval + injection tests re-run on the fix before ship: <result>

**[HW]** — delete if no hardware:
- [ ] Reproduced on the bench (not just observed in the field)
- [ ] HW rev + firmware version recorded: <rev / semver>
- [ ] Failure case added to the soak suite
- [ ] Recovered by: <watchdog / power-cycle / OTA rollback / RMA — "RMA" means the fleet can't self-heal: name the fix>

## 6. Disclosure check

- Anyone's data exposed, or users materially misled? <no / yes → check your jurisdictions' breach-notification duties **now** (clocks start at awareness — verify current) and notify affected users honestly>

## 7. Lesson

**One sentence we'd tell a future maintainer:** <…>
