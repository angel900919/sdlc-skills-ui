---
slug: sdlc-command-center
feature: observability-data-pruning
stage: plan
status: complete
tier: mvp
verdict: READY-FOR-ISSUES
verdict_overridden: false
slice_count: 3
sources: [.ai/specs/observability-data-pruning/design.md, .ai/specs/observability-data-pruning/prd.md, .ai/specs/observability-data-pruning/ux.md, .ai/anchor.md, .ai/test-strategy.md]
consumed_by: [to-issues, build, qa]
created: 2026-06-13
---

# Plan — observability-data-pruning

> Tier: mvp · 3 vertical slices, dependency-ordered, each one PR. No `.human` mirror
> (the one per-feature artifact that never mirrors).

## Slice 1 — Show storage stats end-to-end (TRACER BULLET)
- Depends on: nothing
- Goal: the Storage panel renders real per-kind counts, oldest-record dates, and the
  database file size from a live endpoint — every layer wired for real (SQLite →
  ReportStorageStats → GET /api/storage/stats → StoragePanel S1).
- Files: `apps/server/src/state/storageStats.ts` (new) ·
  `apps/server/src/state/storageStats.test.ts` (new) ·
  `apps/server/src/routes/api.ts` (modify: GET /api/storage/stats) ·
  `apps/web/src/components/StoragePanel.tsx` (new — S1 only: table + loading/empty/error states; cutoff picker rendered but inert) ·
  `apps/web/src/pages/DashboardPage.tsx` (modify: mount panel)
- Satisfies: story 1 · NFR N2.
- New dependencies: none.
- Acceptance: unit+integration tests pass (tmp-dir SQLite per test-strategy: seeded rows
  of all four kinds → exact counts + oldestAt; empty DB → empty shape; timed <500ms on
  the seeded store = N2 measured) · panel renders real data in the dev app (manual smoke).

## Slice 2 — Prune engine + endpoints (API-complete cleanup)
- Depends on: Slice 1
- Goal: a curl-able preview and prune work end-to-end against the real store —
  transactional delete with live-session exclusion, chunked reclaim, audit event — the
  whole capability minus the confirm UI.
- Files: `apps/server/src/db.ts` (modify: boot auto_vacuum=INCREMENTAL conversion, idempotent — design § Schema deltas, ADR-0001) ·
  `apps/server/src/state/storagePrune.ts` (new) ·
  `apps/server/src/state/storagePrune.test.ts` (new) ·
  `apps/server/src/routes/api.ts` (modify: GET /api/storage/prune-preview · POST /api/storage/prune)
- Satisfies: stories 2, 5, 6 · NFRs N1, N3, N4.
- New dependencies: none.
- Acceptance: integration tests pass (tmp-dir SQLite): per-kind deletes at cutoff ·
  live-session rows survive any cutoff (story 6) · FTS rows die with their transcripts ·
  re-run with same cutoff deletes 0 · failed tx leaves counts unchanged (the "unchanged"
  promise) · audit row `storage.prune` written with the result payload (story 5, the
  success-metric source) · bytesReclaimed within 10% of actual file delta (N3) · preview
  on the seeded store <2s (N4) · vacuum runs in bounded chunks (no single chunk exceeds
  the page budget — N1's mechanical proxy; full N1 streaming check is /qa's manual smoke).

## Slice 3 — Confirm dialog + result readout (the no-accidents UX)
- Depends on: Slice 2
- Goal: the full ux.md flow works in the browser — preview counts in the focus-trapped
  dialog (S2, all four states, verbatim copy), confirmed prune shows the S3 readout,
  stats refresh, failure shows the database-unchanged copy.
- Files: `apps/web/src/components/PruneConfirmDialog.tsx` (new) ·
  `apps/web/src/components/StoragePanel.tsx` (modify: wire picker → preview → dialog → result; S3 states) ·
  `apps/web/src/api/` (modify: prune hooks + stats invalidation)
- Satisfies: stories 3, 4 · NFR N4 (user-facing).
- New dependencies: none.
- Acceptance: server tests stay green · ux.md S1–S3 states walk clean in the dev app
  (manual: happy F1, empty F2, abandon F4; failure F3 verified by killing the server
  mid-flow) · dialog is focus-trapped, Escape cancels, confirm not default-focused (a11y).

## Invariant cross-check
- Invariant 1 (observation never interferes): Slice 2's chunked vacuum (ADR-0001) + N1
  acceptance. ✓
- Invariant 2 (cascade delete): untouched — prune never deletes sessions/projects rows. ✓
- Invariant 10 (never observe own output): untouched. ✓
- New rule from PRD (live-session records unprunable): Slice 2's exclusion predicate +
  explicit test. ✓
- E2E journey table: no mapped journey for this feature — no spec extended (deliberate,
  per design § Test plan); /qa walks ux.md states instead.

## Verdict
**READY-FOR-ISSUES** — 3 vertical slices (tracer = stats end-to-end), linear dependency
order, every slice PRD-traced with mechanical acceptance, zero new deps. Next:
`/to-issues observability-data-pruning`.
