---
slug: sdlc-command-center
feature: oldest-record-age
stage: plan
status: complete
tier: mvp
verdict: READY-FOR-ISSUES
verdict_overridden: false
slice_count: 1
sources: [.ai/specs/oldest-record-age/design.md, .ai/specs/oldest-record-age/prd.md, .ai/anchor.md, .ai/test-strategy.md]
consumed_by: [to-issues, build, qa]
created: 2026-06-13
---

# Plan — oldest-record-age

> Tier: mvp · 1 vertical slice (the feature is one PR — a pure formatter + its single
> render site). The tracer bullet IS the whole feature; splitting a ~20-line change into
> horizontal slices would be artificial fragmentation, not vertical slicing. No `.human`
> mirror (the one per-feature artifact that never mirrors).

## Slice 1 — Show oldest record as a relative age (TRACER BULLET)
- Depends on: nothing
- Goal: every non-empty kind in the Storage panel's Oldest column shows a whole-day
  relative age (`today` / `1 day ago` / `N days ago`) instead of a bare date, with the
  exact date kept reachable via the cell `title` — every layer wired for real
  (`formatRelativeAge` in @sdlc/shared → exported from index → consumed by StoragePanel).
- Files:
  - `packages/shared/src/relativeAge.ts` (new) — `formatRelativeAge(iso: string, nowMs: number): string`
  - `packages/shared/src/relativeAge.test.ts` (new) — unit specs
  - `packages/shared/src/index.ts` (modify) — re-export `formatRelativeAge`
  - `apps/web/src/components/StoragePanel.tsx` (modify) — Oldest cell renders the age; date moves to `title`
- Satisfies: stories 1, 2, 3 · NFRs N1 (no new I/O), N2 (whole-day rounding), N3 (never negative)
- New dependencies: none (all in the anchor allowlist — pure TS date math, no library)
- Acceptance:
  - Unit (`relativeAge.test.ts`) green: `today` at 0-day and sub-day diffs · `1 day ago`
    (singular boundary) · `N days ago` (plural) · future `oldestAt` clamps to `today`
    (N3) · malformed/`NaN` input falls back to `today`. These pin N2 + N3 with measured
    day boundaries.
  - N1 measured by inspection: `formatRelativeAge` signature is `(iso, nowMs)` — no
    fetch/db import; StoragePanel adds no new query (consumes existing `stats.data`).
  - Regression: full suite green (`npm test`) + typecheck clean (`npm run typecheck`).
  - UI smoke: the Oldest cell shows the age string and the exact date appears in the
    cell hover `title` (verified in the `/qa` acceptance script).

## Invariant cross-check
- Invariant 1 (observation never interferes): honored — no new I/O on the render path (N1).
- Invariant 10 (never observe its own output): untouched — no new persistence or event.
- No slice introduces violating code; no architecture update needed.

## Verdict
**READY-FOR-ISSUES** — one vertical, independently-mergeable slice; tracer bullet wires
the formatter end-to-end into the panel; traces to 3 stories + 3 NFRs; mechanical
acceptance defined (unit specs + regression + N1 inspection). Next: `/to-issues
oldest-record-age`.
