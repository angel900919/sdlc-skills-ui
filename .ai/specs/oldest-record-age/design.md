---
slug: sdlc-command-center
feature: oldest-record-age
stage: design
status: complete
tier: mvp
verdict: READY-FOR-PLAN
verdict_overridden: false
maps_to_component: ShareDomainModel + RenderFlightDeck
module_count: 2
dep_adds: []
schema_deltas: "none — read-only display over already-loaded stats"
api_endpoints: 0
sources: [.ai/specs/oldest-record-age/prd.md, .ai/architecture/02-components.md, .ai/anchor.md, .ai/test-strategy.md]
human_summary: .human/specs/oldest-record-age/design.md
consumed_by: [plan, qa]
created: 2026-06-13
---

# Design — oldest-record-age

## Placement
Spans two components, justified: a pure formatter in **ShareDomainModel** (the shared
package that already holds `pruneSummary.ts` / `storageBreakdown.ts`) consumed by
**RenderFlightDeck** (the `StoragePanel` Oldest column). No persistence, no API — the
`oldestAt` values are already loaded by the existing `/api/storage/stats` query.

## PRD Open questions (triage)
1. Roll up >365 days to months/years? → **design-resolved (a): no** — whole days match
   the cutoff domain (7/30/90). `N days ago` for any N is honest and unambiguous; a
   months/years scale would re-introduce mental math ("3 months — is that >90 days?").
   Declined-for-now; revisit only if the owner asks. → back-annotated to the PRD.

## Modules (additive)
| module | status | role (present tense) | in | out | ~LoC |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `formatRelativeAge` | NEW | Formats an ISO timestamp as a whole-day relative age — `today` / `1 day ago` / `N days ago` — clamped at zero so clock skew never yields a negative. | StoragePanel | (pure) | ~15 |
| `StoragePanel` (Oldest cell) | MODIFIED | Renders the age string as the Oldest column's primary text; keeps the exact date reachable via the cell `title`. | — | formatRelativeAge | ~6 Δ |

File layout (anchor conventions — one formatter per file, mirrors the existing shared modules):
- `packages/shared/src/relativeAge.ts` (NEW) — `formatRelativeAge(iso: string, nowMs: number): string`
- `packages/shared/src/relativeAge.test.ts` (NEW) — unit specs
- `packages/shared/src/index.ts` (MODIFIED) — re-export `formatRelativeAge`
- `apps/web/src/components/StoragePanel.tsx` (MODIFIED) — Oldest cell render

## External dependencies
No new external deps — all in the anchor allowlist (pure TS, no libraries; date math is
`Date.parse` + integer division, no date library).

## Schema deltas
None — read-only display over the already-loaded `StorageKindStats.oldestAt`.

## API contracts
None — no new endpoint. Consumes the existing `GET /api/storage/stats` payload unchanged.

## Call flow (the .human sequenceDiagram renders from this)
1. `StoragePanel` already holds `stats.data.kinds` (each `{ kind, rows, oldestAt }`) from the existing `/api/storage/stats` query.
2. For each breakdown row, the panel looks up `full = kindByName.get(r.kind)`.
3. `full.oldestAt == null` → render `—` (unchanged empty case).
4. Else `StoragePanel` calls `formatRelativeAge(full.oldestAt, Date.now())` → e.g. `"63 days ago"`.
5. `formatRelativeAge` parses the ISO, computes `floor((nowMs − parsedMs) / 86_400_000)`, clamps to ≥0, and maps `0 → "today"`, `1 → "1 day ago"`, `n → "${n} days ago"`.
6. The panel renders the age as the Oldest cell text and sets the cell `title` to the exact `oldestAt.slice(0,10)` date (story 3 — date stays reachable).

## Failure modes
- Unparseable/empty `oldestAt`: `oldestAt == null` is already guarded (step 3). A malformed non-null string would make `Date.parse` return `NaN` → `formatRelativeAge` falls back to `today` (clamp path treats `NaN` diff as ≤0). Honest degradation; never throws, never shows `NaN days ago`.
- Clock skew (`oldestAt` in the future): negative diff clamps to `0` → `today`. Covered by N3.

## Observability
None — pure render path, no new I/O, no event emitted (N1). The success metric is a soft
legibility check (visual inspection), not an app-emitted number, so no hook is needed.

## Test plan (cites .ai/test-strategy.md — unit tier, colocated `*.test.ts`)
- Unit `packages/shared/src/relativeAge.test.ts` (first of this kind — establishes the relative-age pattern): `today` at 0 days and sub-day diffs · `1 day ago` (singular) · `N days ago` (plural) · future `oldestAt` clamps to `today` (N3) · malformed string falls back to `today`. Pins N2 (whole-day rounding) + N3 (no negative).
- UI wiring (StoragePanel Oldest cell) — no new unit test; covered by the existing panel render smoke + the `/qa` acceptance script (the cell shows the age + date-in-title).

## Per-feature ADR
None — no decision passes the 3-trigger test (hard-to-reverse + surprising + real trade-off). The days-vs-months choice is reversible and recorded in the Open-questions triage.

## Verdict
**READY-FOR-PLAN** — placement valid (2 existing components), mvp sections present, no
invariant violations (read-only, no new I/O), modules sized (~15 + ~6Δ LoC), zero new
deps. Next: `/plan oldest-record-age` (single slice expected).
