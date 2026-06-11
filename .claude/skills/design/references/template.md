# Design skeleton — `.ai/specs/<feature>/design.md`

Fill only the sections the inherited tier requires (markers `[P]` prototype · `[M]` mvp · `[Pr]` production). Hard cap 90 / 185 / 250 — over → split the feature. **No diagrams in `.ai/`** — the call flow is a step list here; the `sequenceDiagram` lives only in the `.human` mirror. Tables/YAML over prose for every contract.

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: design
status: draft | complete | blocked
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: READY-FOR-PLAN | NEEDS-PROTOTYPE | NEEDS-RESEARCH | NEEDS-ARCHITECTURE-UPDATE | BLOCKED-ON-PRD | BLOCKED-ON-ANCHOR
verdict_overridden: false
maps_to_component: <component from architecture 02-components.md>   # finalizes prd's proposed placement
surface: backend-service | web-ui | mobile | ai-llm | data-pipeline | cli-lib | infra | composite
dep_adds: []                               # new vetted packages, flagged for anchor.approved_dependencies
adr_count: <N>                             # per-feature ADRs in .ai/specs/<feature>/adr/
human_summary: .human/specs/<feature>/design.md    # ALWAYS present — design always mirrors
sources: [.ai/specs/<feature>/prd.md, .ai/architecture, .ai/anchor.md, .ai/understanding/<slug>.md]
consumed_by: [plan, to-fitness, qa]
created: YYYY-MM-DD
---

# Design — <feature>

## Status  [P][M][Pr]
`Draft`   <!-- Draft | Validating | Building | Shipped | Blocked | Superseded -->

## Architectural placement  [P][M][Pr]
<!-- NON-NEGOTIABLE, all tiers. Every feature traces to a component. No match → NEEDS-ARCHITECTURE-UPDATE. -->
- **Lives in component:** `<ComponentName>` (`02-components.md` row N, or inline at prototype)
- **Cross-component coupling:** none   <!-- or: list components this spans + the per-feature ADR justifying it -->
- **Invariants honored:** <list every invariant from understanding + architecture that touches this scope — design respects all>

## Surface  [P][M][Pr]
- **Surface(s):** `backend-service`   <!-- detected from maps_to_component + anchor stack; see references/surfaces.md -->
- **Checklist applied:** <which surface checklist(s) — or "default (backend-service)"; AI/LLM mandatory if ai_in_core_path>
- **Cross-surface contracts produced:** none   <!-- e.g. "POST /api/… (owned here, consumed by web-ui)" -->

## Module decomposition  [P][M][Pr]
<!-- Additive — NEW or MODIFIED for this feature. Verb-noun (Entity Trap rejected). ≤500 LoC each → split. -->
| module | new/mod | role (one present-tense sentence, no and/also) | ~LoC | inbound | outbound |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `ValidateDiscount` | new | Validates a discount code + amount against business rules. | 80 | DiscountApi | (pure) |
| `ApplyDiscount` | new | Writes the discount to the order and emits DiscountApplied. | 150 | DiscountApi | OrdersDb, EventBus |

## File / folder layout  [P][M][Pr]
<!-- Concrete paths matching anchor's stack convention. No abstract placeholders. -->
```
src/orders/discount/validate.ts        # ValidateDiscount
src/orders/discount/apply.ts           # ApplyDiscount
app/api/orders/[id]/discount/route.ts  # endpoint handler
src/orders/discount/__tests__/         # unit + integration
db/migrations/20260601_add_order_discount.sql
```

## External dependencies  [P][M][Pr]
<!-- NON-NEGOTIABLE, all tiers. Skip the table only if every candidate is `reuse` → write the one-liner below.
     Trust judgment is judgment-based, never numeric gates. New rows go to frontmatter dep_adds[].
     License: SPDX id from registry metadata, checked against anchor's license policy;
     no policy → "<SPDX id> — compatibility unreviewed" (copyleft like GPL/AGPL → human decision). -->
| package (ecosystem) | used by | status | exists? | maintained? | adoption | provenance / approved-alt | license | security boundary? |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `stripe (npm)` | `ApplyDiscount` | new | yes | yes — 2024+ | high | publisher Stripe Inc.; no alt | MIT — ok | yes — payment → HITL |
<!-- or: _no new external deps — all in anchor allowlist_ -->

## Schema deltas  [M][Pr]
<!-- Omit at prototype. Skip if no schema change. Every delta: migration name + forward + rollback + backfill + indexes. -->
### Migration: `20260601_add_order_discount.sql`
- **forward:** `ALTER TABLE orders ADD COLUMN discount_cents int NOT NULL DEFAULT 0;`
- **rollback:** `ALTER TABLE orders DROP COLUMN discount_cents;`
- **backfill:** not needed (default 0 correct for existing rows)
- **indexes:** none new; none invalidated

## API contracts  [M][Pr]
<!-- Omit at prototype. Skip if no API surface. One table per endpoint. Every 4xx/5xx shape. See references/api-contracts.md.
     If .ai/architecture/api-governance.md exists, every table conforms to it; a deviation needs a per-feature ADR. -->
### `POST /api/orders/:id/discount` (v1)
| attribute | value |
| :-- | :-- |
| auth | required — `AuthenticateUser` |
| request | `{ code: string, amount_cents: int }` |
| response 200 | `{ applied: true, new_total_cents: int }` |
| response 400 invalid_code | `{ error: "invalid_code", message: string }` |
| response 409 conflict | `{ error: "order_already_paid" }` |
| response 500 | `{ error: "internal", trace_id: string }` |
| idempotency [M][Pr] | `Idempotency-Key` header; dedupe 24h |
| versioning [Pr] | URI `/v1/…`; deprecation 90d post-v2 |

## Call flow — <key flow>  [P][M][Pr]
<!-- A STEP LIST, not a diagram. Source of truth the .human sequenceDiagram renders from. Mark async hops. -->
| # | from | to | message | sync/async |
| :-- | :-- | :-- | :-- | :-- |
| 1 | User | DiscountApi | POST /api/orders/123/discount | sync |
| 2 | DiscountApi | ApplyDiscount | apply(orderId, amount) | sync |
| 3 | ApplyDiscount | EventBus | emit DiscountApplied | async |

## Failure modes & resilience  [M][Pr]
| hop / boundary | what breaks | detection | response | user-visible effect |
| :-- | :-- | :-- | :-- | :-- |
| `ApplyDiscount` → OrdersDb | row-lock timeout | 5s tx timeout | retry once w/ jitter; else 409 | 409 + retry-after |
| `ApplyDiscount` → EventBus | bus unreachable | 2s publish timeout | dual-write outbox; relay replays | 200; email may be late |
<!-- [Pr] add: SLO impact · runbook ref · on-call paging policy -->

## Observability hooks  [M][Pr]
- **logs:** entry/success/error fields incl. `trace_id`, `order_id`; PII rule: `user_id` hashed
- **metrics:** `discount.apply.total{result}` (counter), `discount.apply.duration_ms{result}` (histogram)
- **spans:** `discount.apply` (root) → `discount.validate`, `discount.db.update`; `trace_id` propagated end-to-end
<!-- [Pr] add: alert thresholds (error rate, p95) + dashboard -->

## Characteristics check  [Pr]
<!-- Production only. Each `Characteristics honored:` line from PRD Notes → the design element supporting it.
     Unsupported claim → BLOCK WRITE: extend the design or drop the claim. -->
| characteristic (from PRD Notes) | supported by |
| :-- | :-- |
| scalability | `ApplyDiscount` stateless; idempotent write; `discount.apply.total` throughput metric |

## Test plan  [M][Pr]
<!-- Omit at prototype. Each layer: concrete path + one-line coverage + prior art (or "first of this kind"). -->
- **unit** — `src/orders/discount/__tests__/validate.test.ts` — code-format + amount-ceiling rules. Prior art: `src/orders/__tests__/place.test.ts`.
- **integration** — `…/apply.integration.test.ts` — DB write + event emission. Prior art: `…/place.integration.test.ts`.
- **e2e** — `e2e/discount.spec.ts` — UI → API → DB → confirmation. Prior art: `e2e/checkout.spec.ts`.

## Per-feature ADRs  [M][Pr]
<!-- Only when the 3-trigger test passes (hard to reverse + surprising + real trade-off). Files: .ai/specs/<feature>/adr/NNNN-*.md -->
- `adr/0001-discount-applied-event-shape.md` — event-based notification over sync email; trade-off: eventual consistency vs blocking on SMTP.
<!-- or: none -->

## Non-obvious dependencies  [Pr]
<!-- Production only. Implicit assumptions a future change could break. -->
- `NotifyDiscountApplied` assumes `EventBus` is wired to subscribers — confirm via integration test before ship.
<!-- or: none -->

## Notes  [P][M][Pr]
- Glossary terms used: <from understanding/context — confirm no drift>
- Open questions resolved here: <PRD Qs answered in this design + their section>
- Surface: <one line if a non-default surface checklist applied>

## Verdict  [P][M][Pr]
**<VERDICT>** — <one paragraph. If READY-FOR-PLAN, restate the contract the builder must satisfy (modules + paths + key flow + invariants honored); production routes to /to-fitness first. If blocked, name what unblocks it. If overridden, the user's recorded reason.>
```
