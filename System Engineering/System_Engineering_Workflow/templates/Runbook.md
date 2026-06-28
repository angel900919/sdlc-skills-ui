---
Document: Runbook RB-NN — <Alert / failure mode>
Document ID: RB-<PROJECT_SLUG>-NN-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Operation / Maintenance); IEEE 1012-2016 (continuous V&V)
Status: Draft
Owner: <role — e.g. on-call team / service owner>
---

# RB-NN — <Alert / failure mode>

> Blank per-runbook template (one file per `RB-NN`, stored as `runbooks/RB-NN-<slug>.md`). Replace every `<ANGLE-BRACKET>` placeholder and resolve every `TODO:`. Seed ≥ 1 runbook per SLO alert **before ORR** — an empty `runbooks/` folder fails the gate. Index every runbook in [`Operations_Continuous_Validation.md` §9](Operations_Continuous_Validation.md). Conforms to [`../05_Conventions.md`](../05_Conventions.md) (IDs `RB-NN` / `SLO-NN` / `CR-NN`, severity `S1–S4`).

---

**Trigger:** `<alert name>` — `<condition, e.g. SLO-02 burn-rate > 5%/6h>`
**Linked:** `SLO-NN` · `REQ-*` · `CR-NN` *(placeholder until one is filed)*
**Severity call:** `<S1–S4>` *(consistent label — `SEV-n` is an accepted alias; pick one)*
**Owner / escalation:** `<on-call role → escalation path>`

---

## Symptom
<What on-call actually sees — the alert text, the dashboard panel, the user-facing impact.>

## Triage
<First checks, in order. Be concrete — name the dashboard, the panel, the query/command.>
1. <Open dashboard `<name>` → check `<panel/metric>`.>
2. <Run `<command / query>` to confirm `<hypothesis>`.>
3. <Confirm blast radius: how many users / cohorts / regions affected?>
4. <Set / confirm severity `<S1–S4>` and declare an incident if `<threshold>`.>

## Mitigation
<Stop-the-bleeding steps — restore service before root-causing. Reversible where possible.>
1. <e.g. trigger auto/manual rollback of the offending `CR-NN` cohort.>
2. <e.g. fail over to `<standby>` / enable read-only mode / shed load.>
3. <Verify the SLI recovers on dashboard `<name>`.>

## Resolution
<Steps to return to steady state and close the incident.>
1. <Apply the durable fix / confirm the rollback held.>
2. <Re-enable `<feature/cohort>` once `<gating metric>` is healthy.>
3. <Confirm `SLO-NN` is back inside its error budget over `<window>`.>

## Post-incident trigger
<When to open a PIR and/or a loop-back CR.>
- Open a **PIR** if: `<severity ≥ S2 / customer-visible / repeat occurrence>`.
- File a **`CR-NN` via Phase 09** if this incident exposed a missing or weak REQ (mandatory for any S1/S2 that does).
- Feed outcomes back into: `<this runbook's updates / a new chaos game day / the regression suite>`.

---

*Maintenance:* review this runbook after every firing and after each related chaos game day. Keep `Linked` IDs current; bump the version on edits.
