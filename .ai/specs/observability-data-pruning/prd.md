---
slug: sdlc-command-center
feature: observability-data-pruning
stage: prd
status: complete
tier: mvp
verdict: READY-FOR-DESIGN
verdict_overridden: false
placement: PersistAndBroadcast + ServeApiAndWs + RenderFlightDeck (proposed)
satisfies: session-observability lifecycle (data-management § retention follow-up)
beyond_roster: false
nfr_count: 4
ai_card: false
sources: [.ai/anchor.md, .ai/architecture/index.md, .ai/understanding/sdlc-command-center.md, .ai/features.md, .ai/data-management.md]
human_summary: .human/specs/observability-data-pruning/prd.md
consumed_by: [design, plan, to-fitness]
created: 2026-06-13
---

# PRD — observability-data-pruning

## Problem & JTBD
The watch-everything design means the local SQLite store only ever grows: every hook
event, transcript copy, usage sample, and audit record is kept forever. **When my
Command Center has been my daily driver for months, I want to clear out old
observability records on my terms, so the app stays fast and my disk doesn't fill with
data I'll never look at again.** Whose problem: the owner (the app's one user).

## Scope
- in:
  - Storage visibility: per-record-kind row counts + total database file size, on demand.
  - Age-based pruning of **derived observability records** — audit events, hook events,
    transcript copies (incl. their search index), usage samples — older than a cutoff
    the owner picks (default proposal: 30 days).
  - A confirmation step that shows exactly what will be deleted (counts per kind) before
    anything is deleted.
  - A result readout: rows deleted per kind + bytes actually reclaimed.
  - The prune itself is recorded in the audit trail (cleanup is observable too).
  - Records belonging to **live sessions are never pruned**, regardless of cutoff.
- out (revisit only if asked):
  - Deleting Claude Code's own transcript files on disk (`~/.claude/projects` is not ours).
  - Scheduled/automatic pruning — v1 is a deliberate human act.
  - Pruning `sessions`/`projects` rows themselves (session history survives; only their
    bulky derived records age out).

## Success metric
- The feature's own result payload (app-emitted, shown in the UI and recorded to the
  audit trail) reports rows deleted + bytes reclaimed. Success: **the first real prune
  on the owner's months-old store reclaims ≥20% of the database file size, within 2
  weeks of shipping.**

## Kill criterion
- If by **2026-09-13** no prune has ever been run on the owner's real database, remove
  the UI affordance and record "keep everything forever" as the deliberate policy.

## User stories
1. As the owner, I want to see how much space each kind of record takes, so that I can decide whether cleanup is worth it.
2. As the owner, I want to prune records older than a cutoff I choose, so that the database stays small without losing recent context.
3. As the owner, I want a confirmation showing exactly what will be deleted before it happens, so that I never lose data by accident.
4. As the owner, I want the prune to report rows deleted and bytes reclaimed, so that I can see it worked.
5. As the owner, I want the prune itself to appear in the audit trail, so that even cleanup is observable.
6. As the owner, I want records of live sessions left untouched regardless of cutoff, so that a long-running session never loses its in-flight context.

## NFRs (number + measurement)
| # | requirement | number | measured by |
| :-- | :-- | :-- | :-- |
| N1 | Pruning never interferes with live observation (invariant 1) | a prune of ≥100k rows drops zero WS frames / blocks no hook ingest | run a prune during an active streaming session; hook POSTs keep returning within their 3s budget |
| N2 | Storage stats are cheap | stats respond in <500ms on a 1GB database | timed endpoint call against a seeded large store |
| N3 | Reclaim is real, not cosmetic | reported bytes reclaimed within 10% of the actual file-size delta | before/after file size in the result payload |
| N4 | Confirmation is current | the to-be-deleted counts compute in <2s | timed dry-run call |

## Risks & assumptions (each with a ≤1-week falsifying test)
- Assumption: space can be reclaimed safely while the server is live (WAL mode).
  Test: prune + reclaim under an active session in dev; watch for errors/frame drops.
- Risk: pruning transcript copies silently breaks old search results the owner expected.
  Test: search for a known old term after a dry-run prune preview — the confirm step
  must make the loss explicit (counts per kind include the search index).
- Assumption: 30 days is a sane default retention. Test: the cutoff is a picker, not a
  constant; the default is challenged at the confirm step.

## Invariant check (mvp: warn + accept in Notes)
- Honors invariant 1 (observation never interferes) via N1; invariant 10 (never observe
  its own output) untouched; invariant 2 (cascade delete) unaffected — pruning never
  removes sessions, only their aged derived records. New rule this feature introduces:
  **live-session records are unprunable** (story 6) — `/design` must carry it into the
  delete predicate.

## Open questions
1. Should hook events share the one cutoff with audit/transcript/usage records in v1, or
   need their own? (Proposal: one cutoff for all four kinds; revisit on real use.)

## Notes
- Component placement (proposed; `/design` finalizes): PersistAndBroadcast (delete +
  reclaim), ServeApiAndWs (stats/dry-run/prune endpoints), RenderFlightDeck (the UI).
- Soft SMART pass: all stories verifiable; metric/kill dated and falsifiable. ✓

## Verdict
**READY-FOR-DESIGN** — scope sharp (3 explicit outs), 4 numeric NFRs, dated kill
criterion, invariants honored with one new rule named for `/design`. Autonomous-run
note: interview answers derived from the project's own records (db schema,
data-management policy, recon), not a live conversation.
