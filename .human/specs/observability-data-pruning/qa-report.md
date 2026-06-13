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

Machine evidence: [.ai/specs/observability-data-pruning/qa-report.md](../../../.ai/specs/observability-data-pruning/qa-report.md)
