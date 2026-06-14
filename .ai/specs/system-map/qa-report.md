---
slug: sdlc-command-center
feature: system-map
stage: qa
status: evidence-complete
tier: mvp
checks: { pass: 6, fail: 0, warn: 3, skip: 2 }
verdict: AWAITING-APPROVAL
sources: [.ai/specs/system-map/prd.md, .ai/specs/system-map/design.md, .ai/specs/system-map/plan.md, .ai/specs/system-map/issues, .ai/features.md, .ai/architecture]
human_summary: .human/specs/system-map/qa-report.md
consumed_by: [ship]
created: 2026-06-14
---

# QA report — system-map (tier: mvp)

Evidence gathered fresh on 2026-06-14 against `v2-prototype-architecture-tab` @ `f04fa67`.
Mechanical checks (a–c, e, f) ran in a read-only **verifier** subagent; d, i, j, k in the parent.

## Check table

| check | status | evidence / citation |
| :-- | :-- | :-- |
| a. Slice closure | PASS | 4/4 beads terminal: `scc-57s` (06093c5), `scc-byg` (42e5348), `scc-lv3` (846f382), `scc-4ra` (f69d784) all CLOSED; every `files:` path exists; acceptance satisfied per each slice's definition (review COMPLETE + verify PASSED; scc-lv3 per-criterion `- [x]`). |
| b. Coverage — F-IDs | PASS | PRD declares 0 numbered F-IDs (functional reqs are EARS bullets, prd.md:99–109); all slices `satisfies_f_ids: []` — consistent, nothing to map. |
| b. Coverage — user stories | PASS | US-1,US-2→SLICE-1; US-3→SLICE-2; US-5→SLICE-3; US-4→SLICE-4. 5/5 covered; no stale refs. |
| b. Coverage — NFRs | PASS | NFR-3,NFR-4→SLICE-1; NFR-4→SLICE-2,3; NFR-1,NFR-2,NFR-4→SLICE-4. 4/4 covered; inverse clean. |
| c. Regression (full suite, mvp) | PASS | `npm test` → 26 files / **217 tests pass**, exit 0. Isolated `npx vitest run watcher --testTimeout=20000` → 1/1 pass (1.13s). `npm run typecheck` → 3/3 workspaces clean. The known watcher flake (scc-yxt) did NOT recur this run. |
| d. Spec-drift (mvp+) | PASS | Inline: every slice `satisfies_*` resolves to a real PRD entry (verifier inverse check); all declared `files:` exist; no contradiction between slice file lists and design surfaces observed. Deeper audit = `/coherence-check`. |
| e. NFR existence + staleness | PASS | NFR-1→`architecture.test.ts:233,248`; NFR-2→`watcher.test.ts:56`; NFR-3→`parseComponentsModel.test.ts:51`; NFR-4→`architecture.test.ts:168,216`. All NFR tests post-date prd.md (git mtime) — no staleness WARN. |
| f. Architecture invariants | PASS | (1) parse off request path / cached on watch — `architecture.test.ts:168,216`; (2) excludes `dashboard/` — `watcher.ts:10`, `02-components.md:37` (see WARN-note on `prototypes/`); (3) status from real artifacts, never synthesized — `deriveComponentStatus.ts:11-14,29-30`. |
| g. Fitness functions | SKIP | Production-only; tier is mvp. |
| h. Unwanted-behavior defenses | SKIP | Production-only (no Unwanted-EARS at mvp). |
| i. Security review | WARN | mvp → non-gating. No `/security-review` run this pass; no `.ai/architecture/threat-model.md` present. Surface is small + local-first: read-only architecture render + a `nav` beacon `POST /events` with allow-listed kinds (400 on bad kind, tested `architecture.test.ts:149`). Recommend `/security-review` (and `/threat-model`) before/at `/ship`. |
| j. Accessibility | WARN | mvp → non-gating. UI surface present (Architecture tab: @xyflow graph, inspector, SDLC view); no `ux.md` and no formal WCAG pass (keyboard nav, node/inspector labels, status-color contrast, loading/empty/error states). Recommend an a11y pass on the tab. |
| k. Runbook existence | WARN | Informational. `.ai/runbooks/system-map.md` absent; recommend `/runbook system-map` after approval (never gating — runbook is written at ship time). |

## Coverage matrix

```
User stories:  US-1→S1  US-2→S1  US-3→S2  US-4→S4  US-5→S3        (5/5)
NFRs:          NFR-1→S4  NFR-2→S4  NFR-3→S1  NFR-4→S1,S2,S3,S4   (4/4)
F-IDs:         none declared (satisfies_f_ids: [] on all slices) (N/A)
Inverse:       every satisfies_* id resolves to a real PRD entry; no stale refs.
```

## Non-blocking observations
- **`prototypes/` exclusion** (invariant 2) is enforced by absence (the declared 7-component model in `02-components.md` lists no `prototypes/` node) rather than an explicit deny-list; `dashboard/` IS explicitly excluded from watching. Sound for the declared-model renderer; a human may confirm no future model edit introduces a `prototypes/` node.
- **NFR-1 OTel `trace_id` is all-zeros** in logs — global no-op tracer (OTel export off by default), by design per the scc-4ra verify note. The always-on signal is the `architecture.serve` structured log + the p95 test guard, both present and passing.
- **Pre-merge CI gate (G1)** in `pipeline.md` is open (no CI) — waivable by the solo owner; agent-time PreToolUse guards are the active controls. `test-strategy.md` maps no E2E journey to system-map (manual smoke by design).
- **Flake (scc-yxt):** `watcher.test.ts` can time out under parallel load; it ran green this session but the intermittency remains — fix tracked separately.

## Approval log
<!-- append-only, most-recent first -->
- Approved: Yes · By: Andres Rambal · At: 2026-06-14T09:52:15Z · Reason: acceptance run passed; 0 FAIL, 3 mvp-non-gating WARN (security/a11y/runbook) accepted on the record.
