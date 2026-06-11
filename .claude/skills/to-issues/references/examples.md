# /to-issues examples — good vs bad

Reference samples for the per-slice classification decisions. Referenced from `SKILL.md` Phase 5.

## AFK / HITL classification
- ❌ Bad: *"Slice 4 (Stripe webhook handler): `type: afk`"* — touches payments, uplift territory.
- ❌ Bad: *"Slice 1 (button label string): `type: hitl, hitl_reason: 'risky'`"* — cosmetic; over-cautious + the reason is a vibe, not a rule.
- ✅ Good: *"Slice 4: `type: hitl, hitl_reason: 'touches payment flow — PRD tier uplifted to production for money handling'`"*.
- ✅ Good: *"Slice 1: `type: afk, tests: skip-tests, skip_tests_reason: 'static string change, no branching logic'`"*.

## Traceability
- ❌ Bad: *"`satisfies_f_ids: [F-2, F-3, F-4, F-5, F-6]`"* — a slice satisfying 5 F-IDs is mega; bounce to `/plan`.
- ❌ Bad: *"`satisfies_f_ids: []`"* at production — no anchor; the plan is broken.
- ✅ Good: *"`satisfies_f_ids: [F-2]`"* with the F-2 EARS clause quoted in the Traceability section.

## Schema fidelity
- ❌ Bad: extending frontmatter with `assignee:`, `epic:`, `sprint:` — tracker concerns leaking into the canonical schema.
- ✅ Good: those populated under `backend_refs` after `/publish-issues` runs.

## Faithful transformation
- ❌ Bad: PRD says "p95 ≤ 200 ms"; issue says "p95 ≤ 250 ms" — drift; breaks `/qa` later.
- ❌ Bad: plan's Slice 3 has 4 acceptance criteria; issue body has 6 — invented two.
- ✅ Good: every acceptance line in the issue body appears verbatim in `plan.md`'s Slice N.

## Language
- ❌ Bad: a `.py` ETL slice in a TS repo left at `language: typescript` (anchor default) — wrong toolchain downstream.
- ✅ Good: that slice set to `language: python`; a slice mixing `.ts` + `.py` bounced to `/plan` to split.
