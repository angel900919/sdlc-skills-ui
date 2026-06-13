# QA gate — oldest-record-age (the evidence, in plain words)

**Where it stands:** 6 checks pass, 0 fail, 2 warnings, 3 skipped (production-only). The
automated evidence is complete and clean. What's left is you running the short script
below and deciding whether to approve.

**The two warnings — your judgment:**
1. **Security (mvp warning, low concern):** the feature is a pure text formatter over a
   date that already comes from our own database — no new network/database calls, no
   untrusted input. A full security pass wasn't run; the surface is negligible.
2. **Accessibility (worth a real look):** the *age* shows as normal cell text (good), but
   the **exact date is only in a hover tooltip** (`title`). That means it's reachable with
   a mouse but not by keyboard or a screen reader. For a single-user local tool that's
   probably fine — but it's your call whether "reachable" should mean visible text.

**One housekeeping note:** the slice's acceptance checkboxes weren't auto-ticked when the
bead closed (a tracker quirk) — the work is done and tested; the boxes just didn't mirror.

---

## Acceptance script (run this, then approve)

**Setup:** start the app (`npm run dev` — check `lsof -nP -iTCP:4317 -sTCP:LISTEN` first;
a server may already be running). Open the dashboard and find the **Storage** panel. You
need some recorded observability data (the panel shows the per-kind table when rows exist).

### Story 1 — age in whole days (no mental math)
1. Look at the **Oldest** column. → Expected: each non-empty row shows an age like
   `today`, `1 day ago`, or `N days ago` — **not** a bare `2026-04-12` date.
- Result: ☑ **pass** ☐ fail — *verified live 2026-06-13 (see Outcome below)*

### Story 2 — natural phrasing
1. Compare a few kinds with different oldest records. → Expected: `today` for same-day,
   `1 day ago` (singular) for one day, `N days ago` (plural) for older. No `0 days ago`,
   no `1 days ago`.
- Result: ☑ **pass** ☐ fail — *singular branch verified live; `today`/plural unit-tested (see Outcome below)*

### Story 3 — exact date still reachable
1. Hover the mouse over an Oldest cell. → Expected: a tooltip shows the exact date
   (`YYYY-MM-DD`). (Known limit: hover-only — see the accessibility warning above.)
- Result: ☑ **pass** ☐ fail — *verified live 2026-06-13 (see Outcome below)*

## Exploratory prompt (poke the edges)
- A kind with **no records** should still read `—` in the Oldest column (unchanged).
- The age and the tooltip date should describe the **same** record (no mismatch).
- A very old record (months back) should read a large `N days ago`, not roll up to months.

## Outcome — smoke run 2026-06-13 (agent-driven, at owner instruction)

Run against the live app (`localhost:5180/dashboard`, server `:4317`), browser clock
`2026-06-13T08:58:24Z`. Evidence read directly from the rendered DOM — cell text plus the
`title` attribute.

**Storage table, Oldest column — all four kinds rendered:** text `1 day ago`, `title="2026-06-11"`.

- **Story 1 — pass (live).** Each row shows `1 day ago`, not the bare `2026-06-11` date.
- **Story 3 — pass (live).** Exact date reachable: every Oldest cell carries `title="2026-06-11"`
  (`YYYY-MM-DD`).
- **Story 2 — pass (partial live).** Live data is uniformly ~46h old, so only the singular
  `1 day ago` branch is observable — and it renders correctly (no `1 days ago`). The `today` and
  plural `N days ago` branches are covered by the five `relativeAge.test.ts` unit specs, not
  live-exercisable with current data.
- **Exploratory.** Age and tooltip describe the **same** record (both `2026-06-11`). Empty-kind
  `—` and a months-old `N days ago` have no live data — unit-tested only.

**Correctness check:** `1 day ago` for a `2026-06-11` record is correct, not an off-by-one —
`formatRelativeAge` floors *elapsed* 24h periods (relativeAge.ts:14); the record is 46.22h old →
`floor(46.22 / 24) = 1`. Calendar-date intuition does not apply.

**Console:** only `favicon.ico` 404s (benign). No feature errors. **No data was modified.**

Machine evidence: [.ai/specs/oldest-record-age/qa-report.md](../../../.ai/specs/oldest-record-age/qa-report.md)
