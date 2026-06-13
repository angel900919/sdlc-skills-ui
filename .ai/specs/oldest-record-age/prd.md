---
slug: sdlc-command-center
feature: oldest-record-age
stage: prd
status: complete
tier: mvp
verdict: READY-FOR-DESIGN
verdict_overridden: false
placement: RenderFlightDeck (StoragePanel) + ShareDomainModel (shared formatter) (proposed)
satisfies: observability-data-pruning legibility follow-up (storage-panel)
beyond_roster: false
nfr_count: 3
ai_card: false
sources: [.ai/anchor.md, .ai/architecture/index.md, .ai/features.md, .ai/specs/observability-data-pruning/prd.md]
human_summary: .human/specs/oldest-record-age/prd.md
consumed_by: [design, plan]
created: 2026-06-13
---

# PRD — oldest-record-age

## Problem & JTBD
The Storage panel (shipped with `observability-data-pruning`) shows each prunable
record kind's oldest record as a bare ISO date (`2026-04-12`). But the prune cutoff is
chosen in **days** (7 / 30 / 90). **When I'm deciding a prune cutoff, I want to see how
old my oldest data actually is in days, so I can pick a cutoff without subtracting dates
in my head.** Whose problem: the owner (the app's one user) at the moment of a prune
decision.

## Scope
- in:
  - Render the oldest record's age as a relative duration in whole days — `today`,
    `1 day ago`, `N days ago` — in the Storage panel's existing "Oldest" column.
  - Keep the exact date available (the precise timestamp is not lost).
  - A pure, DOM-free formatter in the shared package, so the rule is unit-testable.
- out (revisit only if asked):
  - Relative time for any other timestamp elsewhere in the app (this is scoped to the
    Storage panel's oldest-record column only).
  - Sub-day granularity (hours/minutes/seconds) — cutoffs are in days, so days suffice.
  - Live ticking (the age re-counting as the clock advances without a refetch).

## Success metric
- Legibility, not telemetry: at the **first prune decision after shipping**, the owner
  can state the oldest-data age in days directly from the panel without external date
  math. Source: visual inspection of the Storage panel's Oldest column (app-rendered).
  Soft metric (mvp) — no app-emitted number; this is a read-only display affordance.

## Kill criterion
- If by **2026-09-13** the owner reports the days-ago label adds noise rather than
  clarity at the prune decision, revert to the bare date and record "date-only is
  enough" as the deliberate choice.

## User stories
1. As the owner, I want each kind's oldest record shown as an age in whole days, so that I can judge a prune cutoff (7/30/90) without mental date math.
2. As the owner, I want natural phrasing — `today`, `1 day ago`, `N days ago` — so that the age reads at a glance.
3. As the owner, I want the exact date still reachable, so that I don't lose the precise oldest-record timestamp.

## NFRs (number + measurement)
| # | requirement | number | measured by |
| :-- | :-- | :-- | :-- |
| N1 | The age is free — no new I/O | zero new fetch/DB calls; computed from the already-loaded `oldestAt` | code inspection: the formatter takes `(iso, nowMs)` and the panel passes existing data |
| N2 | Whole-day rounding is correct | exact day boundaries: 0d → `today`, 1d → `1 day ago`, ≥2d → `N days ago` | unit tests over today / 1-day / N-day inputs |
| N3 | Never shows a negative age | a future `oldestAt` (clock skew) renders `today`, never `-N days ago` | unit test with `oldestAt` after `now` |

## Risks & assumptions (each with a ≤1-week falsifying test)
- Assumption: whole-day granularity is enough (every cutoff is in days). Test: confirm no
  cutoff option in the Storage panel is sub-day; revisit only if one is ever added.
- Risk: age (recomputed at render) and the shown date could disagree if derived from
  different inputs. Test: both render from the same `oldestAt` value; a unit test pins
  the formatter so age and date stay consistent.

## Invariant check (mvp: warn + accept in Notes)
- Read-only display over already-loaded stats. Honors invariant 1 (observation never
  interferes — no new I/O, N1); invariant 10 (never observe its own output — untouched);
  no delete predicate, no new persistence. No new project rule introduced.

## Open questions
1. Should very old data (e.g. >365 days) roll up to months/years? (Proposal: no — days
   matches the cutoff domain; revisit if the owner asks. → carried to design as a
   declined-for-now option.) → Resolved in design.md § PRD Open questions (declined: days only).

## Notes
- Component placement (proposed; `/design` finalizes): a pure formatter in
  `packages/shared` (ShareDomainModel) consumed by `StoragePanel` (RenderFlightDeck).
  Mirrors the existing `pruneSummary.ts` / `storageBreakdown.ts` pure-formatter pattern.
- Provenance: the gap was surfaced by the `verifier` subagent this session (the prune
  summary describes record "age" but no elapsed-age formatter existed).
- Soft SMART pass (mvp): all stories verifiable; metric is a soft legibility check, kill
  criterion dated. ✓ Autonomous-run note: answers derived from the project's own records
  (StoragePanel source, observability PRD, Storage cutoff options), not a live interview.

## Verdict
**READY-FOR-DESIGN** — scope sharp (3 explicit outs), 3 numeric NFRs, dated kill
criterion, invariants honored (read-only, no new I/O). Tier mvp (no uplift: read-only
UI, no PII/payments).
