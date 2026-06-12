---
name: runbook
disable-model-invocation: true
description: |-
  Compiles the operational knowledge already in a feature's specs into a per-feature incident runbook under .ai/runbooks/ plus a mandatory plain-prose .human mirror for a person mid-incident. Runs at ship time on a qa-approved or shipped feature; compiles and confirms, never invents a procedure. Project scope at production tier (/runbook --slo) interviews and locks .ai/slo.md — SLIs, SLO targets, error budgets, paging thresholds, and the severity ladder. Use when the user says "/runbook", "runbook", "incident response", "on-call guide", "what do I do when the alert fires", "rollback procedure", "SLO", or "/runbook --slo". Do NOT use for: root-causing a live bug (/diagnose), deploying or rolling back (human plus CI/CD), defining NFRs (/prd), or monitoring setup (the build phase).
---

# Runbook — incident runbooks + project SLOs

<what-to-do>

You are a **compiler, not an author**. Feature scope (`/runbook <feature>`) assembles
the operational knowledge already written across the specs into `.ai/runbooks/<feature>.md`
plus the `.human/runbooks/<feature>.md` prose runbook a human actually follows mid-incident.
Project scope (`/runbook --slo`, production tier) interviews and locks `.ai/slo.md` —
the service-level objectives and the incident severity ladder.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory
gates, tier dial, tracker, Talking to the human) before writing. Artifact skeletons:
[references/template.md](references/template.md) (runbook) and
[references/slo-template.md](references/slo-template.md) (SLO + severity-ladder defaults).

## Critical rules

1. **Compile, never invent.** Every alert row, diagnostic step, and rollback step traces
   to a named spec line (design failure modes / observability hooks, PRD NFRs,
   environments, data-management, threat-model, qa-report) **or** an explicit user
   confirmation. Where the specs are silent, ask the user — one plain-English question
   at a time. An unconfirmable step is recorded under `## Open questions`, loudly named
   in the read-back and the verdict — **never a fabricated procedure** (a wrong runbook
   step is worse mid-incident than a stated gap).
2. **Before incidents, not during.** Refuse live root-causing — a firing alert or a
   reproducing bug routes to `/diagnose` (which reads these runbooks first). Runbooks
   are written calm, read stressed.
3. **Document, never act.** No deploys, rollbacks, flag flips, or migrations — the
   runbook documents the procedure; CI/CD or a human executes it (`/ship` gates the
   release boundary).
4. **Author nothing upstream.** NFRs are `/prd`'s, characteristics `/architect`'s,
   monitoring infrastructure the build phase's. The runbook and the SLOs **cite what
   exists** (anchor's observability block, environments' roster); a missing dashboard
   or metric is an Open question routed upstream, not something you set up.
5. **Feature-scope gates.** `.ai/specs/<feature>/design.md` **and** `prd.md` are
   required (no failure modes / NFRs to compile) → `BLOCKED-ON-DESIGN → /design`.
   The `.ai/features.md` row must read `qa-approved` or `shipped` (the code the runbook
   describes must exist and be verified) → else `BLOCKED-ON-QA → /qa`.
6. **Tier gate.** Effective `tier` is INHERITED from `prd.md` (never recomputed):
   **production** — expected; `/ship`'s production checklist asks for this runbook or a
   recorded skip. **mvp** — optional; run when the user asks (they did, by invoking).
   **prototype** — offer the skip plainly: *"At prototype tier there's usually no
   on-call to hand this to. Skip until promote, or write it anyway?"* Skip →
   `SKIPPED-TIER`, nothing written. `--slo` runs at production `project_tier` only;
   below → the same `SKIPPED-TIER` offer.
7. **The `.human` runbook is MANDATORY at every tier this skill runs at.** Runbooks
   exist for humans under stress: `.human/runbooks/<feature>.md` uses short sentences,
   numbered steps, exact commands, no jargon. It is still a derived projection of the
   `.ai` file (`.ai` wins on disagreement) — but unlike other mirrors it carries the
   **full procedure**, because its reader is the incident responder, not a reviewer.
   Prose rules + skeleton: [references/template.md](references/template.md).
8. **`--slo` requirements.** `.ai/architecture/characteristics.yaml` (or the prototype
   architecture's characteristics section) is the SLO source → absent →
   `BLOCKED-ON-ARCHITECT → /architect`. PRD NFR ceilings and `anchor.nfr_ceiling_*`
   seed the targets. Mirror: `.human/summaries/slo.md` with **ONE** validated Mermaid
   severity-ladder flowchart via the [mermaid skill](../mermaid/SKILL.md).
9. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to
   the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions)
   — one question at a time, always with a proposed answer, adapted to `technical_user`
   from `.ai/intake.md`. Say "who gets woken up when this breaks at 2am?", not
   "escalation criterion". Jargon (SLI, error budget, SEV) lives in the `.ai` artifact.
10. **Frontmatter-first reads + line caps.** Read each input's frontmatter to decide
    whether you need the body; load only the sections named in Phase 1. Caps:
    runbook ≤185 (mvp) / ≤250 (production); `slo.md` ≤150. Over → prune detail,
    never drop a section.
11. **Update mode.** If the target artifact exists, restate it (alert rows, rollback
    arms, open questions / SLO count), ask what changed (usually "the feature changed"
    or "we got paged and the runbook was wrong"), refresh only that in place. Preserve
    confirmed escalation contacts, accepted answers, and Open questions still open.
12. **Advisory gate + tracker + one verdict.** Issue the real verdict with reasons; an
    override sets `verdict_overridden: true` + the recorded reason. Read
    `.ai/progress-tracker.md` top 5 at Phase 0; append one entry **only** on
    `RUNBOOK-WRITTEN` or `SLO-LOCKED`. Exactly one verdict per run.

## Procedure

Copy this checklist:

```
runbook progress:
- [ ] Phase 0: Tracker top 5; parse scope (feature vs --slo); detect existing artifact (update mode)
- [ ] Phase 1: Load inputs frontmatter-first; gates (design+prd, status, tier); announce
- [ ] Phase 2: FEATURE — compile the alert/symptom table (gaps → one question at a time)
- [ ] Phase 3: FEATURE — detailed rollback procedure (deploy + migration down + flag-off)
- [ ] Phase 4: FEATURE — dependencies/integration points + links (dashboard, logs)
- [ ] Phase 5: SLO — per-characteristic SLI/SLO/budget/paging + severity ladder
- [ ] Phase 6: Read back; write .ai artifact + the mandatory .human mirror
- [ ] Phase 7: Append tracker (success only); issue exactly one verdict
```

### Phase 0 — Tracker + scope + mode
Read `.ai/progress-tracker.md` top 5 (expect `qa landed (<feature>)` or `ship landed`).
Parse the argument: a feature slug → **feature scope**; `--slo` → **project scope**;
neither → ask which qa-approved/shipped feature (propose the most recent). If the
target artifact (`.ai/runbooks/<feature>.md` / `.ai/slo.md`) exists → **update mode**
(rule 11).

### Phase 1 — Load inputs + gates
Frontmatter-first, feature scope:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/specs/<feature>/design.md` | `## Failure modes & resilience` (per hop: what breaks · detection · response) + `## Observability hooks` (alert thresholds, log fields, metrics) | **BLOCKED-ON-DESIGN** |
| `.ai/specs/<feature>/prd.md` | NFR table (the numbers behind every threshold) + effective `tier` (INHERIT) | **BLOCKED-ON-DESIGN** |
| `.ai/features.md` | status gate: row is `qa-approved` or `shipped` | **BLOCKED-ON-QA** (row missing or earlier status) |
| `.ai/environments.md` | env roster, per-env deploy mechanism + smoke command, `flag_system` | warn |
| `.ai/data-management.md` | reversibility rule, migration tool + down convention | warn |
| `.ai/architecture/threat-model.md` | open T-N threats touching this feature's component | warn |
| `.ai/specs/<feature>/qa-report.md` | WARN/SKIP edges the human accepted (known weak spots) | warn |
| `.ai/anchor.md` | `## Observability` (logs · metrics · tracing) → the Links section | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Project scope (`--slo`): `.ai/anchor.md` (`project_tier` gate + observability + NFR
ceilings) · `.ai/architecture/characteristics.yaml` (**REQUIRED** →
`BLOCKED-ON-ARCHITECT`) · every `.ai/specs/*/prd.md` NFR table (warn) ·
`.ai/environments.md` (where each SLI is measured; warn). Apply the tier gate (rule 6),
then **announce** one line: scope, tier, mode (new/update), what this run will write.

### Phase 2 — Compile the alert/symptom table *(feature scope)*
One row per source item — **alert or symptom → meaning → first diagnostic steps →
mitigation → escalation contact/criterion**:
- each design **failure mode** (detection column → the symptom; response column → the
  mitigation seed),
- each production **alert threshold** from the observability hooks,
- each **open T-N threat** touching the feature ("if this fires, you may be under attack — " + the threat scenario),
- each accepted **qa-report WARN/SKIP edge** (known weak spots get a row, so the
  on-call doesn't rediscover them).

First diagnostic steps cite real things: the env's smoke command, a named log field /
metric, a dashboard. Gaps the specs don't answer — above all the **escalation
contact** (a real name/handle/channel) and its criterion ("escalate when X") — are
asked one at a time with a proposed answer. Unanswered → `## Open questions` (rule 1).

### Phase 3 — Rollback procedure *(feature scope)*
Expand `/ship`'s one-line rollback note into the numbered procedure, three arms:
1. **Deploy rollback** — exact steps for this project's deploy mechanism
   (environments' roster: re-deploy previous tag / pipeline revert / platform rollback
   command), ending with the smoke command that proves it worked.
2. **Migration down** — per data-management's reversibility rule: the down command +
   ordering. An **irreversible** migration in this feature is called out loudly with
   its argued flag and the fallback (restore path) — never papered over.
3. **Flag-off** — per environments' `flag_system`: which flag, where it's flipped, what
   users see after. `flag_system: none` → state "no flag — rollback is the only off
   switch."
Each arm the specs can't fully supply is confirmed with the user or recorded as an
Open question.

### Phase 4 — Dependencies + links *(feature scope)*
- **Dependencies/integration points that can break it**: design's external
  dependencies + the architecture edges touching its `maps_to_component` — per item:
  what depends on what, the symptom when it's down, where to check its health.
- **Links**: dashboard, logs location, traces (from anchor's observability block +
  environments' URLs). A missing link is an Open question, not an invented URL.

### Phase 5 — SLOs + severity ladder *(project scope)*
For each characteristic in `characteristics.yaml` (plus any project-wide PRD NFR
ceiling worth an objective): interview one at a time — **SLI definition** (what is
measured, where — a real source from anchor's observability), **SLO target** (seed
from the characteristic's `measurement` + PRD/anchor ceilings), **error budget note**
(what happens when it's spent), **alerting threshold + who is paged**. Then propose
the **severity ladder** from the defaults in
[references/slo-template.md](references/slo-template.md) (SEV1/2/3 definition +
response expectation each) and adjust to the user's answers.

### Phase 6 — Read back + write
Read the draft back in plain English; corrections win. Then write:
- **Feature scope:** `.ai/runbooks/<feature>.md` (structured, per
  [references/template.md](references/template.md); tier line cap) **+**
  `.human/runbooks/<feature>.md` (the mandatory prose runbook — rule 7).
- **Project scope:** `.ai/slo.md` (≤150 lines, per
  [references/slo-template.md](references/slo-template.md)) **+**
  `.human/summaries/slo.md` (one plain sentence, 3–6 bullets, ONE validated
  severity-ladder flowchart via the **mermaid skill**, link back).
Update mode preserves untouched rows/sections; recompute frontmatter counts;
regenerate the `.human` mirror from the updated `.ai` file.

### Phase 7 — Tracker + verdict
Append a tracker entry on success only. Issue exactly one:

| Verdict | When | Hand-off |
|---|---|---|
| `RUNBOOK-WRITTEN` | feature runbook + `.human` mirror written | not yet shipped → *"Runbook written — `/ship <feature>`'s production checklist can now cite it."* · already shipped → *"Done. Re-run `/runbook <feature>` whenever the feature changes; `/diagnose` reads it first in an incident."* |
| `SLO-LOCKED` | `.ai/slo.md` + mirror written | *"SLOs locked: N objectives, severity ladder set. `/promote`'s to-production gate and `/qa` can now cite them."* |
| `SKIPPED-TIER` | prototype feature / sub-production `--slo`, skip taken | nothing written; *"Re-run after `/promote`, or on request."* |
| `BLOCKED-ON-DESIGN → /design` | `design.md` or `prd.md` missing — no failure modes / NFRs to compile | nothing written |
| `BLOCKED-ON-QA → /qa` | feature row not `qa-approved`/`shipped` | nothing written |
| `BLOCKED-ON-ARCHITECT → /architect` | `--slo` with no characteristics | nothing written |

If the user overrides a negative verdict, set `verdict_overridden: true`, record the
reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/runbooks/<feature>.md`** — MACHINE-facing runbook. Read by `/diagnose`, `/ship`,
  `/qa`. Skeleton: [references/template.md](references/template.md).
- **`.human/runbooks/<feature>.md`** — MANDATORY prose mirror: what a person follows
  mid-incident. Short sentences, numbered steps, exact commands, no jargon.
- **`.ai/slo.md`** (project scope) — SLO register + severity ladder. Read by `/promote`,
  `/qa`, and feature-scope `/runbook` runs. Skeleton + ladder defaults:
  [references/slo-template.md](references/slo-template.md).
- **`.human/summaries/slo.md`** — plain-English mirror + ONE validated severity-ladder
  diagram via the mermaid skill.

</supporting-info>
