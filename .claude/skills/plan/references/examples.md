# /plan examples — good vs bad

Shape examples for the tracer bullet (Slice 1), per-slice PRD trace, and per-slice
acceptance. Referenced from `SKILL.md` Phase 2 (tracer bullet) and Phase 5 (per-slice details).

## Tracer bullet (Slice 1)

- ❌ Bad: *"Slice 1: add the `orders` table migration."* — horizontal, no end-to-end behavior.
- ❌ Bad: *"Slice 1: scaffold the API route."* — no DB, no UI; doesn't prove wiring.
- ✅ Good: *"Slice 1: user clicks `Bill now` on a closed session → API receives the request → creates a draft invoice in `orders.invoices` → returns the invoice id → UI shows a confirmation banner. Satisfies F-1 only (no email send yet). Proves: route handler, auth, DB write, UI roundtrip."*

## Slice trace to the PRD

- ❌ Bad: *"Satisfies: invoice flow."* — vague.
- ❌ Bad: *"Satisfies: looks good."* — not a requirement.
- ✅ Good: *"Satisfies: PRD §F-3 (When a Stripe webhook arrives for `invoice.paid`, the system shall update the invoice state within 1 s); PRD §NFR-2 (p95 ≤ 200 ms at 100 RPS, measured via Datadog APM)."*

## Acceptance

- ❌ Bad: *"Code review passes."*
- ❌ Bad: *"All tests pass."* — which tests?
- ✅ Good (mvp): *"`src/orders/discount/__tests__/apply.integration.test.ts` passes; manual smoke confirms the UI banner; NFR-2 measurement on staging shows p95 ≤ 220 ms (within 10% of target)."*
- ✅ Good (production): *"Integration test passes; fitness function `fitness/invoice-send/p95-latency` reports ≤ 200 ms on the 7-day rolling Datadog metric; SLO error budget unchanged."*

## New dependencies (per slice)

- ❌ Bad: *"New dependencies: the Stripe SDK."* — not the exact package; not traceable to design.
- ❌ Bad: *"New dependencies: redis (added by plan because we'll probably need caching)."* — invented; design never declared it.
- ✅ Good: *"New dependencies: `stripe (npm)` — inherited from design § External dependencies (Status: new). Acceptance adds: resolves on registry against the frozen lockfile; `pnpm audit` clean in CI."*
