---
name: measure
disable-model-invocation: true
description: |-
  Closes the chain's post-ship feedback loop — records a shipped feature's ACTUAL metric value against the target its PRD and discovery promised, then routes the consequence (keep, iterate, or remove). The human supplies every number from where they track it; the skill never estimates an actual, and a missed target is written as missed. Feature mode (/measure with a feature) waits out the metric's timeframe, then writes the outcome record under .ai/specs/; bare /measure is the project-level reckoning — it evaluates discovery's kill criteria honestly (advisory, override on the record) and writes .ai/outcomes.md plus a plain-English mirror. Use when the user says "/measure", "did it work", "check the success metric", "measure the feature", "are we hitting the target", "post-ship review", or "kill criteria". Do NOT use for: QA evidence (/qa), defining or changing metrics (/discovery, /prd), releasing (/ship), or project status (/status).
---

# Measure — the post-ship reckoning

The terminal-loop skill that records a shipped feature's **actual vs target** (the metric, baseline, target, timeframe, and kill criterion `/discovery` and `/prd` promised) and routes the consequence — keep, iterate, or remove.

<what-to-do>

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) before writing. The `outcome.md` / `outcomes.md` skeletons and the decision-routing table live in [references/templates.md](references/templates.md).

## Critical rules

1. **The integrity rule (the whole point).** Actuals are recorded **verbatim from the human, with their source and date**. A missed target is written as missed. Never estimate, infer, round toward the target, or invent a number — if the human cannot produce one, the verdict is `NO-MEASUREMENT-SOURCE` (the metric is unmeasurable as written) or `TOO-EARLY` (the number isn't due yet), never a guess. The skill's entire value is that the number is real.
2. **Two modes.** `/measure <feature>` = FEATURE mode (one shipped feature's metric → `.ai/specs/<feature>/outcome.md`). Bare `/measure` = PROJECT mode (discovery's success metric + kill criteria + every existing `outcome.md` → `.ai/outcomes.md`). Exactly one verdict per run.
3. **Shipped gate.** FEATURE mode: the `.ai/features.md` row must be `status: shipped` — anything else is `BLOCKED-ON-SHIP` (name the current status and the skill that advances it). PROJECT mode: no shipped rows at all → `NOTHING-SHIPPED` (nothing to reckon; keep building). Never measure unshipped work.
4. **Timeframe gate.** The metric's `timeframe` (PRD success-metric table; discovery framing as fallback) starts at the **ship date**. If now < ship_date + timeframe → emit **`TOO-EARLY`** with the computed due date and stop — no artifact, no partial numbers. Ship-date resolution order: progress-tracker `ship landed (<feature>)` entry → `git log`/`CHANGELOG.md` dated entry → ask the human.
5. **The human supplies every number.** The agent has no analytics access and never runs queries against dashboards. Point the user at where the number lives — `anchor.md` Observability tools if named, else ask where they track it — and record that location as `measurement_source` in the artifact so the next run asks a sharper question.
6. **Never redefine metrics or targets retroactively.** The metric, baseline, target, and timeframe are quoted **verbatim** from `prd.md` / discovery. If the metric is unmeasurable as written, the verdict is `NO-MEASUREMENT-SOURCE` and the fix routes to `/discovery` or `/prd` update mode, on the record — `/measure` measures, it does not move goalposts.
7. **Kill criteria are evaluated honestly (advisory gate).** PROJECT mode checks every discovery kill criterion against the recorded actuals. If one fires, say so plainly — **`KILL-CRITERIA-MET`** — and lay out the options: **kill** (stop, record it) · **pivot** (`/discovery` re-run) · **override on the record** (`verdict_overridden: true` + the user's stated reason in the Decision log). Per the advisory-gate rule in conventions: never water down the analysis or soften the verdict to avoid the hard conversation.
8. **Re-runs append, never overwrite.** A previous actual is history. Each run appends a new row to the Measurements time series (date · actual · source); the verdict and decision reflect the **latest** row. The `outcomes.md` Decision log is append-only, most-recent first (same discipline as `/qa`'s approval block).
9. **No status flips.** `/measure` writes outcome artifacts + the tracker entry, nothing else. A `remove` decision routes to `/sunset <feature>` (the deprecate phase); roster changes belong to `/feature-map`; it never edits `features.md`, specs, or the PRD.
10. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, always with a proposed answer ("Your PRD says you track this in PostHog — what does the signups-per-week number read today?"). The artifact carries the jargon; the question never does.
11. **Tier dial** (effective `tier` inherited from `prd.md`; project mode uses `anchor.project_tier`). **prototype** = lightweight: the one metric, one collection question, outcome ≤90 lines. **mvp+** = full interview + lessons. The rigor of the *verdict* never scales down — a prototype's kill criterion matters MOST (it is the cheap-to-kill tier).
12. **Tracker.** Read top 5 at Phase 0; append one entry only on a verdict that lands an artifact (`METRIC-MET` / `METRIC-MISSED` / `METRIC-PARTIAL` / `NO-MEASUREMENT-SOURCE` in FEATURE mode; `ON-TRACK` / `KILL-CRITERIA-MET` in PROJECT mode). Skip on `TOO-EARLY` / `BLOCKED-ON-*` / `NOTHING-SHIPPED`.

## Procedure

Copy this checklist:

```
measure progress:
- [ ] Phase 0: Detect mode (arg = feature, bare = project); tracker top 5; load + gate inputs
- [ ] Phase 1: Resolve ship date(s) + timeframe → TOO-EARLY check (feature mode stops here if early)
- [ ] Phase 2: Collect ACTUALs from the human — one question at a time, name the source per number
- [ ] Phase 3: Verdict vs target (+ project mode: evaluate every kill criterion honestly)
- [ ] Phase 4: Decision + routing (keep / iterate / remove · or kill / pivot / override)
- [ ] Phase 5: Write .ai artifact (append-only time series) + .human/summaries/outcomes.md mirror
- [ ] Phase 6: Tracker append (artifact verdicts only); issue exactly one verdict + hand-off
```

### Phase 0 — Mode + load + gates
Arg present → FEATURE mode; bare → PROJECT mode. Read `.ai/progress-tracker.md` top 5. Then load and gate:
- `.ai/features.md` — **REQUIRED** both modes (shipped statuses). Missing → refuse, point at `/feature-map`.
- `.ai/specs/<feature>/prd.md` — **REQUIRED** FEATURE mode (the Success metric table). Missing → refuse, point at `/prd`.
- `.ai/discovery/<slug>.md` — PROJECT mode: required to reckon a project-level bet (success_metric + Kill criteria). Missing splits on `project_type` (from `.ai/intake.md`/`.ai/anchor.md`): **greenfield** → `BLOCKED-ON-DISCOVERY → /discovery` (the bet should exist); **brownfield** → `NO-PROJECT-BET` (brownfield skips `/discovery` by design — the app was its own validation, so there is no project-level kill-criteria bet to settle; reckon per shipped feature with `/measure <feature>`, or run `/discovery` only to *retrofit* project goals). FEATURE mode: warn-if-missing (the discovery framing contextualizes the feature metric).
- `.ai/specs/<feature>/qa-report.md` — warn-if-missing (ship evidence; accepted WARN/SKIP items explain a partial).
- `.ai/anchor.md` — warn-if-missing (Observability section names where numbers likely live).
- Apply rule 3 (shipped gate). Announce: mode, feature/slug, tier, metric to be measured, ship date source.

### Phase 1 — Timeframe gate
Resolve ship date per rule 4; quote the metric (metric · baseline · target · timeframe · source) **verbatim** from the PRD (FEATURE) or discovery (PROJECT). Compute due = ship_date + timeframe. Now < due → **`TOO-EARLY`**: tell the user the due date ("the metric promised a 4-week window; shipped 2026-06-01, so measure on or after 2026-06-29"), suggest `/measure` again then, stop. PROJECT mode: a per-feature timeframe only gates that feature's row, never the project reckoning itself.

### Phase 2 — Collect actuals
One plain question at a time, per number. Each question names where to look: the recorded `measurement_source` from a prior outcome row if one exists, else `anchor.md` Observability, else ask "where do you track this?" first and record the answer as `measurement_source` for next time. For each actual capture: **value · source · as-of date**. "I don't know / we don't track that" is an answer — it routes to `NO-MEASUREMENT-SOURCE`, not to a guess (rule 1). PROJECT mode also pulls the latest row from every existing `.ai/specs/*/outcome.md` (no re-asking what's already recorded).

### Phase 3 — Verdict
**FEATURE:** compare latest actual vs target — met → `METRIC-MET` · clearly short → `METRIC-MISSED` · materially moved from baseline but short of target → `METRIC-PARTIAL` (state the fraction; never use "partial" to dodge a miss). No usable number → `NO-MEASUREMENT-SOURCE`.
**PROJECT:** evaluate each kill criterion's falsifiable condition against the recorded actuals — fired / not-fired / not-yet-evaluable, with the number cited. Any fired → `KILL-CRITERIA-MET` (rule 7). None fired and the metric trend is honest → `ON-TRACK` (which still states actual vs target plainly — on-track is not a participation trophy).

### Phase 4 — Decision + routing
Present the verdict with its numbers, then ask the human for the consequence (one question, with a recommendation):
- **FEATURE** — `keep` (it works; done) · `iterate` (route: scope/priority change → `/feature-map` update; requirement change → `/prd` update mode) · `remove` (route `/sunset <feature>` — the deprecate phase plans and flips `shipped → deprecated`). `NO-MEASUREMENT-SOURCE` → route the metric fix to `/discovery` or `/prd` update mode, on the record.
- **PROJECT on `KILL-CRITERIA-MET`** — `kill` (record; stop) · `pivot` (`/discovery` re-run) · `override` (`verdict_overridden: true` + reason in the Decision log). Full routing table: [references/templates.md](references/templates.md).

### Phase 5 — Write the artifacts
1. **FEATURE:** `.ai/specs/<feature>/outcome.md` per the schema — metric block verbatim, append a Measurements row, verdict, decision + routing, Lessons (1–3 bullets max, optional; skip at prototype unless offered). Existing file → append the row + update frontmatter/verdict/decision; never rewrite history.
2. **PROJECT:** `.ai/outcomes.md` per the schema — feature-outcomes table (one row per shipped feature, from each `outcome.md` or `not measured`), project-metric actuals (append-only time series), kill-criteria evaluation table, append a Decision-log block.
3. **Both:** regenerate `.human/summaries/outcomes.md` — the verdict in one plain sentence, target-vs-actual in prose/table, 3–6 jargon-free bullets, and **ONE validated Mermaid diagram via the mermaid skill** (a simple per-feature outcome status flowchart; honest, no chartjunk). Link back to the `.ai` artifacts. Shape: [references/templates.md](references/templates.md).

### Phase 6 — Tracker + verdict
Append the tracker entry per rule 12, then issue exactly one verdict with a hand-off:
- **`METRIC-MET`** — "metric met; decision: keep. Next: `/measure` (bare) for the project reckoning, or the next feature."
- **`METRIC-MISSED → <routed next>`** / **`METRIC-PARTIAL → <routed next>`** — name the decision and the routed skill (`/feature-map` update · `/prd` update · recorded remove).
- **`NO-MEASUREMENT-SOURCE → /discovery | /prd`** — the metric can't be measured as written; fix it upstream, on the record.
- **`TOO-EARLY`** (with the due date) · **`BLOCKED-ON-SHIP → /ship | /qa | /build`**.
- **`ON-TRACK`** — "no kill criterion fired; actuals recorded. Next: keep building; re-run `/measure` after the next ship."
- **`KILL-CRITERIA-MET → kill | /discovery | override`** — state which criterion fired and the number that fired it.
- **`NOTHING-SHIPPED → /build | /ship`** · **`BLOCKED-ON-DISCOVERY → /discovery`** (greenfield project, bet missing) · **`NO-PROJECT-BET → /measure <feature> | /discovery`** (brownfield project — no discovery bet by design; reckon per shipped feature, or retrofit goals with `/discovery`).

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/outcome.md`** — MACHINE-facing per-feature outcome record: verbatim metric block, append-only measurement time series, verdict, decision + routing, lessons. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md); skeleton in [references/templates.md](references/templates.md).
- **`.ai/outcomes.md`** — MACHINE-facing project roster: feature-outcomes table, project-metric actuals, kill-criteria evaluation, append-only decision log.
- **`.human/summaries/outcomes.md`** — HUMAN-facing mirror: plain-English verdict + actual-vs-target + one validated diagram. Regenerated from the `.ai` files each run; never hand-authored.

</supporting-info>
