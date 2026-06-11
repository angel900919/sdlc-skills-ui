# Canonical issue file schema

Format for each `.ai/specs/<feature>/issues/SLICE-N.md` written in Phase 6. **Tracker-agnostic** —
`/publish-issues` adapters map this to backend-specific fields. Frontmatter is the index — full
schema in [`../../_shared/ai-schema.md`](../../_shared/ai-schema.md).

```yaml
---
slug: invoice-app                     # project slug
feature: invoice-send
slice: 3
stage: issue
title: Retry failed Stripe webhooks with exponential backoff
status: open                          # open | published | removed
category: enhancement                 # enhancement | bug — bug only for a slice that exists to fix a defect
type: afk                             # afk | hitl — advisory in Phase 1 (human runs all slices via the manual mtdd loop)
priority: P2                          # P0|P1|P2|P3 — chain-set; default P2, sharpened in /plan when a slice warrants it
tier: mvp                             # INHERITED from prd.md — never recomputed
tests: required                       # required | skip-tests
language: typescript                  # default = anchor's language:; override only on a cross-language slice. typescript/python first-class; others accepted + warned
depends_on: [1, 2]                    # slice numbers; stable across update mode
# Traceability — populated per PRD tier (see Phase 4 matrix); never invented here
satisfies_f_ids: [F-2, F-3]           # production
satisfies_user_stories: []            # mvp (empty at production)
satisfies_nfrs: [NFR-2]               # mvp+
satisfies_unwanted: []                # production — defense slices
# Build contract — mirror plan.md verbatim
files:
  - { path: src/orders/webhook.ts, op: modify }      # new | modify
  - { path: src/orders/__tests__/webhook.test.ts, op: new }
signatures:                           # production only; omit at mvp/prototype
  - "retryWebhook(payload: WebhookEvent, attempt: number): Promise<RetryResult>"
# Reasons — required when the field is not its default
hitl_reason: ""                       # filled when type: hitl — name the firing AFK-eligibility rule
skip_tests_reason: ""                 # filled when tests: skip-tests
# Adapter metadata — written by /publish-issues; this skill writes nulls and PRESERVES on update
backend_refs:
  beads: null                         # e.g. "rl-x8z"
  jira: null                          # e.g. "PROJ-1234"
  md: null                            # e.g. "tickets/invoice-send/SLICE-3-retry-webhooks.md"
source_plan: .ai/specs/invoice-send/plan.md
source_prd: .ai/specs/invoice-send/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: YYYY-MM-DD
---

## What to build
<Concise vertical-slice description — end-to-end behavior, not layer-by-layer. Use the domain
glossary from .ai/context.md. No file paths in prose (they go stale); the `files` frontmatter
is the source of truth.>

## Acceptance criteria
- [ ] <criterion 1 — mechanical, verifiable; mirror plan.md exactly>
- [ ] <criterion 2>
- [ ] typecheck passes                 # use the project's command per anchor.language
- [ ] tests pass                       # omit if tests: skip-tests

## Traceability
- PRD: F-2 (quote the EARS clause)
- PRD: NFR-2 (quote the target + measurement)
- Plan: Slice 3 — <slice name from plan.md>
- Architecture: component `<name>` (`.ai/architecture/02-components.md`)

## Blocked by
- Slice 1, Slice 2                      # or: None — can start immediately (when depends_on: [])
```

**Runtime note.** This `.ai` canonical file is the **immutable source**. Per-phase execution
status (`## Status log`) and final `## Completion` are written by the build loop to the **bead**
(`bd note`) or to the **materialized markdown copy** (`tickets/<feature>/SLICE-N-<slug>.md`,
written by `/publish-issues --backend=md`) — never back into this file. Line cap 80 (60 prototype).
