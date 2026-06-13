---
slug: sdlc-command-center
feature: observability-data-pruning
slice: 2
stage: issue
title: Prune engine and endpoints (API-complete cleanup)
status: open
category: enhancement
type: hitl
priority: P0
tier: mvp
tests: required
language: typescript
depends_on: [1]
satisfies_f_ids: []
satisfies_user_stories: [story-2, story-5, story-6]
satisfies_nfrs: [N1, N3, N4]
satisfies_unwanted: []
files:
  - { path: apps/server/src/db.ts, op: modify }
  - { path: apps/server/src/state/storagePrune.ts, op: new }
  - { path: apps/server/src/state/storagePrune.test.ts, op: new }
  - { path: apps/server/src/routes/api.ts, op: modify }
hitl_reason: "data-management.md § Migration policy review rule: slice touches the db.ts schema block (boot auto_vacuum conversion); also invariant-1-adjacent (chunked vacuum, feature ADR-0001)"
skip_tests_reason: ""
backend_refs:
  beads: null
  jira: null
  md: null
source_plan: .ai/specs/observability-data-pruning/plan.md
source_prd: .ai/specs/observability-data-pruning/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: 2026-06-13
---

## What to build
The cleanup capability, API-complete: a preview that counts what a cutoff would delete,
and a prune that transactionally deletes records older than the cutoff across all four
kinds — never touching live sessions — then reclaims pages in bounded chunks (feature
ADR-0001) and emits the `storage.prune` audit event (the success-metric source). Boot
gains the idempotent auto_vacuum=INCREMENTAL conversion. Curl-able end to end.

## Acceptance criteria
- [ ] Integration tests (tmp-dir SQLite): per-kind deletes at cutoff; live-session rows survive any cutoff; FTS rows die with their transcripts; re-run with same cutoff deletes 0
- [ ] Failed transaction leaves all counts unchanged (the "unchanged" promise)
- [ ] Audit row `storage.prune` written with the result payload
- [ ] bytesReclaimed within 10% of actual file delta (N3)
- [ ] Preview on the seeded store <2s (N4)
- [ ] Vacuum runs in bounded chunks — no single chunk exceeds the page budget (N1 mechanical proxy)
- [ ] typecheck passes
- [ ] tests pass

## Traceability
- PRD: stories 2, 5, 6 · N1, N3, N4 (quoted in plan Slice 2)
- Plan: Slice 2 — Prune engine + endpoints (API-complete cleanup)
- Architecture: PersistAndBroadcast · ServeApiAndWs · design ADR-0001 (chunked incremental vacuum)

## Blocked by
- Slice 1
