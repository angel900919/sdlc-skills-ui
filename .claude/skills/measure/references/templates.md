# Measure — artifact skeletons, tier matrix, decision routing

Loaded on demand from [SKILL.md](../SKILL.md). The canonical schema blocks live in
[`../../_shared/ai-schema.md`](../../_shared/ai-schema.md); these are the fill-in skeletons.

## `.ai/specs/<feature>/outcome.md` skeleton (FEATURE mode)

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: outcome
status: complete
tier: prototype | mvp | production          # INHERITED from prd.md — never recomputed
verdict: METRIC-MET | METRIC-MISSED | METRIC-PARTIAL | NO-MEASUREMENT-SOURCE
verdict_overridden: false
decision: keep | iterate | remove | fix-metric
routed_to: none | feature-map | prd | discovery | sunset
ship_date: YYYY-MM-DD                        # from tracker `ship landed` entry / git log / human
measured_due: YYYY-MM-DD                     # ship_date + timeframe
measurement_source: <where the number lives — dashboard / query / spreadsheet / manual count>
measurement_count: <N>                       # rows in ## Measurements
source_prd: .ai/specs/<feature>/prd.md
source_discovery: .ai/discovery/<slug>.md    # or: none (warned)
human_summary: .human/summaries/outcomes.md
consumed_by: [measure, next, status]
created: YYYY-MM-DD
---

# Outcome — <feature>

## Metric (verbatim from prd.md — never edited here)
| field | value |
| :-- | :-- |
| metric | <what is counted> |
| baseline | <today's number + source, as the PRD recorded it> |
| target | <winning number> |
| timeframe | <window, starting at ship_date> |
| source | <how the PRD said it would be measured> |

## Measurements (append-only — re-runs add a row, never overwrite)
| date | actual | source | recorded_by |
| :-- | :-- | :-- | :-- |
| YYYY-MM-DD | <number, verbatim from the human> | <measurement_source as stated> | <git user.name> |

## Verdict
**<VERDICT>** — actual <n> vs target <n> (baseline <n>). <One-line honest read; a partial states the fraction of the gap closed. If verdict_overridden: "User chose <…> because <reason>.">

## Decision
- decision: keep | iterate | remove | fix-metric
- routed_to: <skill + what it should change, or "none">
- by: <git user.name> · at: <ISO date>
- reason: <one line, the human's words>

## Lessons (optional, 1–3 bullets max)
- <what the gap between expectation and actual taught — only if the human offers it>
```

**Line caps** (tier-scaled like every per-feature artifact): prototype ≤90 · mvp ≤120 · production ≤150. The Measurements table grows over time; prune nothing — the time series IS the artifact.

## `.ai/outcomes.md` skeleton (PROJECT mode)

```markdown
---
slug: <project-slug>
stage: outcomes
status: complete
verdict: ON-TRACK | KILL-CRITERIA-MET
verdict_overridden: false
features_shipped: <N>
features_measured: <N>                       # shipped rows with an outcome.md
kill_criteria_fired: <N>
measurement_source: <project-level source, recorded for the next run>
source_discovery: .ai/discovery/<slug>.md
source_features: .ai/features.md
sources_outcomes: [.ai/specs/<feature>/outcome.md, ...]
human_summary: .human/summaries/outcomes.md
consumed_by: [measure, next, status, discovery]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Outcomes — <slug>

## Feature outcomes (one row per shipped feature)
| feature | metric | target | latest actual | verdict | decision | measured |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| <feature-slug> | <metric> | <n> | <n> (YYYY-MM-DD) | METRIC-MET | keep | YYYY-MM-DD |
| <feature-slug> | <metric> | <n> | — | not measured | — | due YYYY-MM-DD |

## Project metric (verbatim from discovery — never edited here)
| field | value |
| :-- | :-- |
| metric | <…> |
| baseline | <…> |
| target | <…> |
| timeframe | <…> |

### Actuals (append-only time series)
| date | actual | source | recorded_by |
| :-- | :-- | :-- | :-- |
| YYYY-MM-DD | <number> | <source> | <git user.name> |

## Kill-criteria evaluation (verbatim criteria from discovery)
| # | criterion (falsifiable condition) | due | actual observed | fired? |
| :-- | :-- | :-- | :-- | :-- |
| 1 | If <condition> by <date/milestone> | <date> | <number/fact + date> | yes / no / not-yet-evaluable |

## Decision log (append-only, most-recent first — same discipline as qa's approval block)
### YYYY-MM-DD — <VERDICT>
- Decision: continue | kill | pivot | override
- By: <git user.name> · At: <ISO>
- Reason: <one line, the human's words; an override quotes the fired criterion it overrides>
```

**Re-run behavior:** update the feature-outcomes table rows in place (they summarize the latest `outcome.md` state), **append** to Actuals and to the Decision log, re-evaluate the kill-criteria table. Never delete a prior actual or decision block.

## `.human/summaries/outcomes.md` mirror shape

Derived projection of the `.ai` files (per conventions § Human summaries — never hand-authored; `.ai` wins on disagreement). Regenerated on every `/measure` run (both modes):

1. **One plain sentence** leading with the latest verdict ("The signup metric came in at 31 against a target of 50 — missed; we're iterating on onboarding." / "A kill criterion fired: …").
2. **Target vs actual in prose or a small table** — feature rows + the project metric. Honest numbers, no spin.
3. **3–6 jargon-free bullets** — what was measured, where the numbers came from, what was decided, what happens next.
4. **ONE validated Mermaid diagram via the mermaid skill** — a simple status flowchart (features → met/missed/partial/not-yet, project node → on-track/kill-fired). No gauges, no chartjunk; the table carries the numbers, the diagram carries the shape.
5. **Links back** to `.ai/outcomes.md` and each `.ai/specs/<feature>/outcome.md`.

## Tier matrix

| | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| Interview | 1 metric, 1 collection question | full (per-number source + date) | full + qa-report WARN/SKIP cross-check |
| outcome.md cap | ≤90 lines | ≤120 | ≤150 |
| Lessons | only if offered | 1–3 bullets | 1–3 bullets |
| Kill-criteria rigor | **FULL — never scaled down** | full | full |

A prototype exists to be killed cheaply; its kill criterion is the most valuable line it has. The tier dial scales the paperwork, never the honesty.

## Decision routing

| Verdict | Human decision | Route |
| :-- | :-- | :-- |
| METRIC-MET | keep | none — done; suggest bare `/measure` for the project reckoning |
| METRIC-MISSED / METRIC-PARTIAL | iterate (scope/priority) | `/feature-map` update mode — re-scope or re-prioritize the row |
| METRIC-MISSED / METRIC-PARTIAL | iterate (requirements) | `/prd <feature>` update mode — revise the contract, on the record |
| METRIC-MISSED | remove | record `decision: remove` in outcome.md, then `/sunset <feature>` — the deprecate phase owns the status flip |
| NO-MEASUREMENT-SOURCE | fix-metric | `/discovery` (project framing) or `/prd <feature>` update mode (feature metric) — make it measurable, on the record |
| KILL-CRITERIA-MET | kill | record in the Decision log; stop work (roster changes via `/feature-map`, not here) |
| KILL-CRITERIA-MET | pivot | `/discovery` re-run — new bet, new metric, new kill criteria |
| KILL-CRITERIA-MET | override | `verdict_overridden: true` + reason in the Decision log; continue, on the record |

## Collection question shapes (plain English, one at a time)

- Source known: *"Last time this number came from <measurement_source>. What does <metric> read there today?"*
- Source from anchor: *"Your project notes say you use <observability tool>. Can you pull <metric> from it — what's the number as of today?"*
- No source on record: *"Where do you currently see <metric> — a dashboard, a database query, a spreadsheet, or do you count it by hand?"* (record the answer as `measurement_source` before asking for the value)
- Can't produce a number: *"No problem — that means the metric isn't measurable as written, and the honest record says so. Want to fix the metric definition (via /discovery or /prd) so next time there IS a number?"* → `NO-MEASUREMENT-SOURCE`. Never *"roughly how many would you say?"* — an estimate is a guess wearing a number.
