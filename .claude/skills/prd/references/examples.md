# PRD examples — good vs bad

Shape examples per major section. Use as templates when drafting.

## Success metric
- Bad: *"Better invoice flow."* · *"1000 active users."* (no baseline, no timeframe)
- Good: *"Median time-from-session-close to invoice-sent drops from 6 days (n=8 self-reported baseline) to under 2 days within 30 days of launch, measured via `sessions.invoiced_at - sessions.closed_at`."*

## NFR
- Bad: *"The API should be fast."* · *"Latency: 200ms"* (no percentile, no measurement)
- Good: `Latency | p95 ≤ 200 ms at 100 RPS sustained | APM dashboard, 7-day rolling`

## Functional req (production, EARS)
- Bad: *"Users will be able to send invoices."* · *"The system should support invoice sending."*
- Good (event-driven): *"When a freelancer taps `Bill now` on a closed session, the system shall create an invoice in Stripe and email it to the linked client within 30 seconds."*
- Good (unwanted): *"If the Stripe API returns a 5xx, then the system shall queue the invoice for retry with exponential backoff and surface a `Pending` status to the user within 1 second."*

## Risk / assumption
- Bad: *"Users will love it."* (not falsifiable) · *"Stripe might be slow."* (no test)
- Good: *"Assuming Stripe invoice webhooks deliver within 30s 99% of the time. Source: published SLA. Falsifying test: run 100 sandbox invoices, measure webhook latency; reject if p99 > 60s."*

## User story
- Bad: *"Users can send invoices."* (no actor structure, no benefit) · *"As a developer, I want to add a Stripe integration, so I can deploy it."* (developer is not the user)
- Good: *"As a freelancer who just closed a working session, I want to convert it to a sendable invoice in under 30 seconds, so I can bill the client same-day instead of batching at month-end."*

## AI transparency card
- Bad: *"Uses GPT-4o-mini for summarization, temperature 0.3."* (engineer language)
- Good: *"What the AI does: writes a 2-sentence summary of each new contact's recent emails so you can prep before a call. What it does NOT do: send messages, change details, share data. Data it sees: the contact's last-30-day emails to you. Data it never sees: your other contacts, calendar, billing, password. Where it runs: OpenAI us-east, no retention. Opt-out: Settings → AI features → Off."*

## Prototype-snippet exception
- Bad (prose where prose isn't enough): *"The reducer transitions through states based on payment events."* (what states? what events?)
- Bad (snippet dump): a 60-line file with imports, types, helpers pasted in.
- Bad (invented code): *"`POST /api/invoices/send`"* with no prototype behind it — that's design leakage.
- Good — trimmed state machine, tagged:
  > **F-3:** When a Stripe webhook arrives, the system shall update the invoice state per the machine below. *(from prototype — `apps/spike/payment-fsm.ts`)*
  > ```
  > draft → sent → (paid | overdue) → archived
  >         ↓
  >         voided
  > ```
