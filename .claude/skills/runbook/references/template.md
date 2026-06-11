# Runbook templates — `.ai/runbooks/<feature>.md` + `.human/runbooks/<feature>.md`

The feature-scope output pair. The `.ai` file is the structured source of truth; the
`.human` file is the **mandatory** derived prose runbook a person follows mid-incident.
`.ai` wins on disagreement; regenerate the `.human` file from it on every update.

## `.ai/runbooks/<feature>.md` skeleton

Line caps: ≤90 prototype (if run) · ≤185 mvp · ≤250 production. Fill only what the
tier's sources supply; never pad. Every cell traces to a source line or a recorded
user confirmation — anything else goes to `## Open questions`.

````markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: runbook
status: draft | complete
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: RUNBOOK-WRITTEN | SKIPPED-TIER | BLOCKED-ON-DESIGN | BLOCKED-ON-QA
verdict_overridden: false
alert_count: <N>                            # rows in the alert/symptom table
rollback_arms: [deploy, migration, flag]    # which of the three arms apply (flag omitted when flag_system: none)
open_question_count: <N>                    # unconfirmable steps — loud, never silently zero
flag_system: <from environments.md, or none>
escalation_confirmed: true | false          # a real contact/channel was confirmed by the user
sources: [.ai/specs/<feature>/design.md, .ai/specs/<feature>/prd.md, .ai/environments.md, .ai/data-management.md, .ai/architecture/threat-model.md, .ai/specs/<feature>/qa-report.md, .ai/anchor.md]
human_runbook: .human/runbooks/<feature>.md   # MANDATORY — the mirror a human reads mid-incident
consumed_by: [diagnose, ship, qa]
created: YYYY-MM-DD
---

# Runbook — <feature>

> Compiled YYYY-MM-DD against design.md + prd.md at that date. Re-run `/runbook <feature>` after the feature changes.

## Alert & symptom table
One row per design failure mode, production alert threshold, open T-N threat, and
accepted qa-report WARN/SKIP edge. `source` cites where the row came from.

| alert / symptom | meaning | first diagnostic steps | mitigation | escalate to / when | source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| <alert name or observable symptom> | <what is actually wrong> | <numbered: smoke command, log field, metric, dashboard panel> | <the response from design: retry/fallback/flag-off/...> | <name/channel · criterion> | <design.md § Failure modes / threat-model T-3 / qa-report WARN d / ...> |

## Rollback procedure
The detailed, numbered procedure `/ship`'s one-line rollback note expands into.

### 1 — Deploy rollback
1. <exact step for this project's deploy mechanism, from environments.md roster>
2. <...>
3. Verify: run `<smoke command for the affected env>` — expect <observable pass>.

### 2 — Migration down
- reversibility: <reversible (down exists) | IRREVERSIBLE — argued flag quoted from data-management.md + the restore fallback>
1. <down command + ordering, per data-management.md tool/convention>

### 3 — Flag-off
- flag_system: <system, from environments.md — or "none: rollback is the only off switch">
1. <which flag · where it is flipped · what users see after>

## Dependencies & integration points
What can break this feature from outside. One row per design external dependency +
architecture edge touching its component.

| dependency / edge | symptom when it's down | where to check its health |
| :-- | :-- | :-- |
| <service/lib/edge> | <what the on-call sees> | <status page / dashboard / log query> |

## Links
- dashboard: <url or path — from anchor observability / environments, never invented>
- logs: <where + the query/fields to start from>
- traces: <where, or none-yet>
- specs: .ai/specs/<feature>/design.md · .ai/specs/<feature>/prd.md · .ai/specs/<feature>/qa-report.md

## Open questions
Unconfirmable steps — each one is a gap the on-call must know exists.
- <step that could not be confirmed> — asked YYYY-MM-DD; owner: <who can answer>

## Notes
- escalation contact confirmed by: <user, YYYY-MM-DD>
- known accepted weak spots carried from qa-report.md: <list or none>

## Verdict
**<VERDICT>** — <one-line rationale>. <override note if any>
````

## `.human/runbooks/<feature>.md` — the prose runbook (MANDATORY)

This is the file a stressed human opens at 2am. It is a derived projection of the
`.ai` file, but unlike other mirrors it carries the **full procedure** — its reader is
the incident responder, not a reviewer.

**Writing-for-stress rules (non-negotiable):**
1. **Short sentences.** One instruction per line. No subordinate clauses.
2. **Numbered steps**, never paragraphs of procedure. Each step = one action + one
   observable expected result.
3. **No jargon.** No "SLI", "idempotent", "mitigation vector". Exact commands in code
   fences; everything else in everyday words.
4. **Most likely / most dangerous first.** Order the symptom sections by how often the
   on-call will need them, not by source artifact.
5. **State gaps loudly.** An Open question appears inline where the missing step would
   be: `⚠ UNKNOWN: we never confirmed X — escalate rather than guess.`
6. **Every section answers three questions in order:** what you're seeing → what to
   check first → what to do about it.

Shape:

````markdown
# <feature> — incident runbook

**If you're reading this, something is wrong with <feature in plain words>.**
Escalate to **<name/channel>** when <criterion in plain words>.

## Quick links
- Dashboard: <url> · Logs: <where + starting query> · Smoke check: `<command>`

## <Symptom 1 in the on-call's words> (e.g. "Invoices aren't sending")
What's happening: <one plain sentence>.
1. Run `<smoke command>`. Expect: <result>.
2. Check <log field / dashboard panel>. If you see <X>, the cause is <Y>.
3. Do: <mitigation step>.
4. Still broken? Escalate to <contact>.

## <Symptom 2> ...

## Rolling back <feature>
Do this when <criterion — e.g. the smoke check fails after a deploy>.
1. <deploy rollback step>
2. <migration down step — or "⚠ The database change CANNOT be undone. <fallback>.">
3. <flag-off step — or "There is no off switch besides rollback.">
4. Run `<smoke command>` to confirm. Expect: <result>.

## Things we already know are weak
- <accepted qa WARN edges + open threats, one plain line each>

(Compiled from `.ai/runbooks/<feature>.md` — do not hand-edit; re-run `/runbook <feature>`.)
````
