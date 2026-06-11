# Feature-map shape examples — good vs bad

Referenced from SKILL.md Phases 2–6. Shapes, not rules — the rules live in the SKILL body.

## Vertical vs technical slicing
- **Bad:** `database-schema` · `api-layer` · `frontend-shell` · `auth-system`
  → Layers, not features. None of them, alone, lets a user DO anything.
- **Good:** `session-timer` · `invoice-send` · `client-portal` · `stripe-webhook`
  → Each one, alone, delivers a user-visible capability.

## Atomic vs mega
- **Bad:** `invoicing-system`
  → Hides four features: track time, draft invoice, send invoice, handle payment events. Each ships and delivers value alone.
- **Good:** `session-timer` · `invoice-create` · `invoice-send` · `stripe-webhook`
  → Could ship #1 alone (a useful timer). #1+#2 = timer + drafts. Each step adds value.

## Behaviors → features (the decomposition source)
Understanding behavior: *"Maya closes a session and bills the client within the day."*
- Slices into `session-timer` (close a session) + `invoice-send` (turn it into a sent invoice). Both `satisfies: close-and-bill`.
- Decomposing off discovery's bullet "invoicing" alone would have produced one coarse `invoicing` feature with no journey behind it — an orphan-in-waiting.

## Trace check
- **Bad:** behaviors are all about Maya billing clients; the roster includes `admin-dashboard` with no behavior behind it → orphan. Drop or surface to `/understand`.
- **Good:** `session-timer` → `track-billable-time`; `invoice-send` → `close-and-bill`. `satisfies` is a real pointer.

## Priority forcing
- **Bad:** all 8 features P0 → no real priority; usually means scope is too big.
- **Good:** 2 P0 (`session-timer`, `invoice-send`), 3 P1 (`invoice-create`, `stripe-webhook`, `client-portal`), 3 P2 → if pressed, ship the 2 P0s and call it MVP.

## Slugging
- **Bad:** `feature-1` · `IS` · `the-invoice-thing` · `invoice_send` · `api-v2-invoice-endpoint`
- **Good:** `invoice-send` · `session-timer` · `stripe-webhook`

## Dependencies (non-obvious only)
- **Skip (obvious):** `stripe-webhook` depends on `invoice-send` — no invoice, nothing to webhook.
- **Capture (non-obvious):** `client-portal` depends on `auth-flow` — and `auth-flow` isn't in the roster yet, so surface it as a missing feature.

## Human-mirror diagram (the dashboard)
The one diagram in `.human/summaries/features.md` is a priority-grouped feature map — features bucketed P0/P1/P2 with dependency edges between them — generated and validated via the mermaid skill. It's the view a human scans first to see "what's the critical few, and what hangs off what." The structured roster stays in `.ai/features.md`; the picture never goes there.
