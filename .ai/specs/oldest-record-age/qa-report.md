---
slug: sdlc-command-center
feature: oldest-record-age
stage: qa
status: complete
tier: mvp
verdict: READY-FOR-SHIP
check_counts: { pass: 6, fail: 0, warn: 2, skip: 3 }
approved: yes
slices_total: 1
source_prd: .ai/specs/oldest-record-age/prd.md
source_design: .ai/specs/oldest-record-age/design.md
source_plan: .ai/specs/oldest-record-age/plan.md
human_summary: .human/specs/oldest-record-age/qa-report.md
consumed_by: [ship, diagnose]
created: 2026-06-13
---

# QA evidence — oldest-record-age

Tier mvp · 1 slice (scc-sa4, CLOSED). Mechanical checks a/b/c/e/f delegated to the
read-only `verifier` subagent (fresh-context run: `bd show`, `npm test`, `npm run
typecheck`, `vitest --reporter=verbose`, greps — evidence returned, no chain verdict).
Checks d/i/j/k run in the parent. Spot-check of the verifier's citations: 3/3 accurate
(relativeAge.ts:12 signature; relativeAge.test.ts N2/N3 tags; StoragePanel title attr).

## Check results

| check | status | evidence (citation) |
| :-- | :-- | :-- |
| a. Slice closure | PASS | Bead `scc-sa4` = CLOSED (`bd show`); all 4 `files:` exist on disk. Sub-WARN: per-criterion acceptance ticks not mirrored (tracker-backed closure stands — check-a fall-back). |
| b. Coverage matrix | PASS | Forward: stories 1/2/3 + N1/N2/N3 → SLICE-1 `satisfies_*` (SLICE-1.md:16-17). Inverse: all resolve to real PRD entries (prd.md:54-56, 61-63). No F-IDs (mvp uses stories). |
| c. Regression (full) | PASS | `npm test` → 21 files / 179 tests pass, 0 fail; `npm run typecheck` exit 0 (3 workspaces). |
| d. Spec-drift | PASS | Slice `files` = design's 4-file layout; intent matches design call-flow; `satisfies_*` resolve to current PRD. No contradiction. |
| e. NFR existence + staleness | PASS | N2 → relativeAge.test.ts:12; N3 → relativeAge.test.ts:21; N1 = inspection NFR (relativeAge.ts:12 `(iso, nowMs)`, no fetch/db; panel adds no query). Test newer than PRD → no staleness WARN. |
| f. Architecture invariants | PASS | ShareDomainModel purity: relativeAge.ts 0 DOM/React/import (grep PASS); "observation never interferes / no new I/O": 0 emit/persist/insert in formatter (PASS). Inv-10 owned by DeriveProjectState (untouched) → listed/SKIP. |
| g. Fitness functions | SKIP | Production-only — n/a at mvp. |
| h. Unwanted-behavior defenses | SKIP | Production-only; `satisfies_unwanted: []` — n/a at mvp. |
| i. Security review | WARN | mvp = WARN. Pure string formatter + read-only render; no new I/O, no untrusted input (ISO comes from our own DB). Full `/security-review` not run — negligible surface. |
| j. Accessibility | WARN | mvp = WARN. Age renders as normal cell text (fine). But the exact date sits in a `title` tooltip → mouse-hover only, not keyboard/AT-reachable, so story 3 ("date stays reachable") is partially met for AT users. Human judgment. |
| k. Runbook existence | SKIP | Production-only — runbook written at ship time. |

## Coverage matrix

| PRD item | satisfied by | status |
| :-- | :-- | :-- |
| story 1 (age in whole days, no mental math) | SLICE-1 | ✓ |
| story 2 (today / 1 day ago / N days ago) | SLICE-1 | ✓ |
| story 3 (exact date stays reachable) | SLICE-1 (via cell `title`) | ✓ (see check j WARN — mouse-only) |
| N1 (no new I/O) | inspection | ✓ |
| N2 (whole-day rounding) | relativeAge.test.ts:12 | ✓ |
| N3 (never negative) | relativeAge.test.ts:21 | ✓ |

## Notes
- Verifier returned evidence only, no `<promise>`/verdict token — contract held. Read-only
  (no Edit/Write). Same delegation mechanism proven this session via `/mtdd-review` +
  `/mtdd-verify`; this run is the `/qa` path's first firing.
- The two WARNs (security, a11y) are mvp-acceptable but surfaced for the human gate; the
  a11y one is a genuine design choice (date-in-title vs. visible date) for the owner to judge.

## Verdict
**READY-FOR-SHIP** — 6 PASS / 0 FAIL / 2 WARN / 3 SKIP. Human approved as-is (both mvp
WARNs accepted on the record). `features.md` flipped `building → qa-approved`. Next:
`/ship oldest-record-age` (local-first: shipped = on develop + runs from source).

## Approval log (most-recent first)
- Approved: Yes · By: Andres Rambal · At: 2026-06-13T08:29:26Z · Reason: 6 PASS / 0 FAIL; both mvp WARNs (security negligible, a11y date-in-tooltip mouse-only) accepted as-is for a single-user local tool; verifier delegation fired clean.
