# API contracts — table format, versioning, error shapes, idempotency

For `/design` Phase 6. API contracts live in `.ai/` as **tables**, never prose. One table per endpoint. Production functional reqs trace to the PRD's EARS clauses ([`../../prd/references/ears.md`](../../prd/references/ears.md)) — the design says HOW each clause is served on the wire.

**Tier behavior:** skip at prototype (no API surface in the contract yet) · light table at mvp · full table at production (versioning + every 4xx/5xx shape).

## Governance conformance (when `.ai/architecture/api-governance.md` exists)

`/architect` writes one cross-feature conventions page at mvp+ when any component is API-bearing. When it exists, **every contract here MUST conform to it** on all five axes — error envelope shape (+ status-code usage rules), pagination convention, auth convention (header/scheme), naming rules (path casing, resource plurality), versioning scheme. Two features designed by two agents must speak one API dialect; the governance page is the dialect.

- **Conform by default** — fill the table's error/auth/versioning rows from the governance page, not from scratch.
- **Deviate deliberately** — a real reason to diverge (e.g. a webhook receiver that must mirror a third party's envelope) is allowed only with a **per-feature ADR** (Phase 8) naming the axis and the reason. **Silently diverging is rejected** at read-back.
- **Page missing on an API-bearing feature** → warn (Phase 0 input row) and design on the contract's own conventions; suggest an `/architect` update-mode run to mint the page.

## The contract table (one per endpoint)

```markdown
### `POST /api/orders/:id/discount` (v1)

| attribute | value |
| :-- | :-- |
| auth | required — `AuthenticateUser` middleware |
| request | `{ code: string, amount_cents: int }` |
| response 200 | `{ applied: true, new_total_cents: int }` |
| response 400 invalid_code | `{ error: "invalid_code", message: string }` |
| response 404 not_found | `{ error: "order_not_found" }` |
| response 409 conflict | `{ error: "order_already_paid" }` |
| response 500 | `{ error: "internal", trace_id: string }` |
| idempotency [M][Pr] | `Idempotency-Key` header; server dedupes 24h |
| versioning [Pr] | URI-prefixed `/v1/…`; deprecation 90d post-v2 |
```

Request/response shapes are concrete types or JSON schemas — never "the usual fields".

## Error shapes — every 4xx/5xx, not just the happy path

Happy-path-only is the #1 API-contract anti-pattern — that's where the bugs hide. **One row per error case**, each with a stable machine-readable `error` code and the response body. At minimum cover:

- **400** — one row per distinct validation failure (`invalid_code`, `amount_too_large`, …). Don't collapse them into one "bad request".
- **401 / 403** — auth/permission failures, if the endpoint is gated.
- **404** — resource-not-found.
- **409** — state conflict (already-paid, duplicate, version mismatch).
- **422** — semantic validation distinct from 400, if the stack uses it.
- **429** — rate limit, if applicable.
- **500** — always carry `trace_id` so the failure is greppable end-to-end.

Every error body has a stable `error` string (machine-readable) plus a human `message` where useful. Map each to its source — a `409` that defends an architecture invariant should reference the invariant.

## Idempotency (mvp+, every state-changing endpoint)

Any endpoint that mutates state names its idempotency mechanism — typically an `Idempotency-Key` request header + a server-side dedupe window. Required from **mvp**, not deferred to production. GET/read-only endpoints skip it. A state-changing endpoint with no idempotency story is an incomplete contract — reject it.

## Versioning (production)

Name the strategy and the deprecation policy:

- **URI version** (`/v1/…`) — simplest, most visible; default.
- **Header version** (`Accept: application/vnd.api+json;version=1`) — cleaner URLs, less visible.
- **None + deprecation policy** — acceptable for internal-only APIs; still state the policy.

Whatever the choice, name the deprecation window (e.g. "90 days post-v2 release") so consumers know the contract's lifespan.

## Cross-surface ownership

Whichever surface **produces** a contract owns it; consumers reference it. The backend design owns the API contract; a web-ui or mobile surface references the same endpoint table — it does not redeclare it. Same for event schemas and prompt templates. See [surfaces.md](surfaces.md).
