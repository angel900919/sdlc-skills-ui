# QA gate — observability-data-pruning

**Verdict: READY-FOR-SHIP.** 7 checks pass, 0 fail, 2 warnings (both fine for mvp), 1 skip.

All three slices are built, merged, and closed; the full test suite is green (168/168, run during this gate); every user story and NFR traces to a slice and a test. The two warnings: no automated security scan and no automated accessibility test were run — both acceptable at mvp and accepted on the record. One architecture invariant ("watching never interferes") is human-verified rather than grep-checked; its design defense (chunked, yielding vacuum) is in place.

## Acceptance + exploratory script (run before ship)

Bring it up: `npm run dev`, open `http://127.0.0.1:5180`.

1. **See storage** — the Storage card lists Audit events / Hook events / Transcript copies / Usage samples with counts, oldest dates, and total file size.
2. **Preview** — pick a cutoff, click "Preview cleanup…" → a dialog shows exactly what would be deleted, with the two promises in writing (live sessions untouched; old transcripts leave search).
3. **Confirm** — click "Delete N records" → the result line reports rows deleted, MB reclaimed, and before → after file size, and says it was recorded to the audit trail; the table refreshes.
4. **Nothing to delete** — pick a cutoff older than all data → the dialog says "Nothing older than … No cleanup needed" and the confirm button is disabled.
5. **Abandon** — open the dialog, press Escape → nothing happens.
6. **Failure honesty** — (optional) stop the server mid-confirm → the panel shows "Cleanup failed — nothing was deleted. The database is unchanged."

*(Autonomous-run note: this script is human-deferred; approval below is the owner's standing authorization, recorded — not a live walk.)*

## Outcome — dry-run smoke 2026-06-13 (agent-driven, at owner instruction)

Run against the live app (`localhost:5180`, server `:4317`). The destructive confirm was **held
at the human gate and not fired** — the owner accepted preview-level verification, so **no
records were deleted** (767 rows intact).

- **Step 1 (See storage) — verified live.** The Storage card lists all four kinds with counts
  (audit 392 · hook 171 · transcript 38 · usage 166), oldest date `2026-06-11`, total file size
  802,816 B. (DOM read.)
- **Steps 2 & 4 (Preview / Nothing-to-delete) — verified live at the data layer** via the
  `prune-preview` dry-run: **0 rows at the UI's 7 / 30 / 90-day cutoffs** (all data is <2 days old
  → the "Nothing older than… No cleanup needed" path), and **585 rows** at an off-menu
  `cutoffDays=1` (210 audit · 171 hook · 38 transcript · 166 usage). The dialog click-through, its
  written promises, and the disabled confirm button were not walked through the UI.
- **Steps 3, 5 & 6 (Confirm / Abandon / Failure-honesty) — not live-walked.** The destructive
  delete + chunked vacuum + audit-event emission + idempotency + live-session protection are
  covered by `apps/server/src/state/storagePrune.test.ts` (in the 179-green suite). Preview and
  prune share one predicate (storagePrune.ts:46), so the confirmed count equals the deleted count
  by construction.

**Net:** dry-run pipeline verified live; destructive path accepted as integration-tested; **no
data modified.**

Machine evidence: [.ai/specs/observability-data-pruning/qa-report.md](../../../.ai/specs/observability-data-pruning/qa-report.md)
