# Progress tracker — append-only session log

## 2026-06-14 — qa landed (system-map) — APPROVED, building → qa-approved (READY-FOR-SHIP)
- Artifact: `.ai/specs/system-map/qa-report.md` (evidence) + `.human/specs/system-map/qa-report.md` (gate summary + acceptance/exploratory script). Mechanical checks (closure, coverage, regression, NFR existence, invariants) ran in a read-only `verifier` subagent.
- Key decision(s): 6 PASS / 0 FAIL / 3 WARN / 2 SKIP. Full suite 217/217 + typecheck clean this run (the scc-yxt watcher flake did not recur); 5/5 stories + 4/4 NFRs traced to closed slices with backing tests; 3 architecture invariants hold. WARNs are mvp-non-gating: no `/security-review` + no threat-model, no WCAG pass on the tab, no runbook — all accepted on the record by Andres Rambal. SKIPs are production-only (fitness, unwanted-EARS). `features.md` flipped building → qa-approved.
- Next: `/ship system-map` — deploy/release flip qa-approved → shipped (this is `/ship`'s job, not `/qa`'s). Recommended before/at ship: `/security-review`, `/threat-model`, `/runbook system-map`; the per-slice manual UI smoke. scc-yxt (watcher flake) remains open.

## 2026-06-14 — build landed (system-map) — queue empty: all 4 slices done → READY-FOR-QA
- Artifact: none (read-and-route skill — no `.ai` artifact, no `.human` mirror). Done-detection over the canonical issue files: all 4 `SLICE-*.md` are `status: published` with terminal beads — `scc-57s` / `scc-byg` / `scc-lv3` / `scc-4ra` all CLOSED. Dependency gate: SLICE-2/3/4 each `depends_on: [1]`; SLICE-1 done, so none blocked.
- Key decision(s): every slice DONE → no slice to route to `/mtdd-implement` → feature-boundary verdict **READY-FOR-QA**. `/build` mutated no canonical file; this single tracker append is its only side effect (per the skill contract). Feature status stays `building` in `features.md` until `/qa` flips it.
- Next: `/qa system-map` — feature-boundary verification. Chain hygiene (correcting the stale SLICE-4 breadcrumb): `v2-prototype-architecture-tab` IS pushed (the beads git hooks auto-push on every commit), so only the merged `feature/scc-4ra--live-auto-refresh-adoption-metric` branch remains to delete. The per-slice manual UI smoke checklists are still owed before `/ship`.

## 2026-06-14 — mtdd-merge landed (scc-4ra) — SLICE-4 live auto-refresh + adoption metric SHIPPED
- Artifact: bead `scc-4ra` (closed) — fast-forward merged into `v2-prototype-architecture-tab` at `f69d784`; 9 commits, 10 files. The Architecture tab is now live + self-measuring: the watcher broadcasts `architecture-changed` on debounced `.ai/architecture/` edits (800 ms) → routed over the WS → web refetches the architecture query (NFR-2, ≤ 2 s); the tab fires a fire-and-forget `nav` beacon to a new `POST /api/projects/:id/events` (allow-listed kinds → `user`/`nav` audit row, 400 on bad kind) as the self-adoption numerator; and `GET /architecture` is instrumented with an `architecture.serve` span (reuses the existing OTel tracer, no new infra) + a structured `{project_id, cache_hit, duration_ms, trace_id}` log, with `readArchitecture` reporting `cache_hit` and a p95 ≤ 300 ms test guard (NFR-1 — the SLICE-1 descope re-home, now genuinely landed).
- Key decision(s): all 8 ACs satisfied (review COMPLETE, verifier 8/8 + TDD-order gate PASS; verify green — typecheck exit 0 / 3 workspaces, 217/217 tests / 26 files). Full 5-step smoke exercised LIVE on :4317 (steps 1-2 browser auto-refresh by the user; steps 3-5 hands-on curl): nav POST → 201 + fresh audit row (`source=user`, `detail.path=/architecture`), bad kind → 400, `architecture.serve` structured log present per GET (`cache_hit` false→true), p95 far under budget (131 ms cold / ~0.7 ms warm), non-blocking under 40 concurrent reqs (health 0.8 ms). NFR-1 span emits an all-zero `trace_id` because OTel export is off (global no-op tracer) — by design; the always-on signal is the structured log + the p95 test guard. Non-blocking carry-forward: `loadArchitecture` is now an orphaned-but-tested back-compat wrapper (route moved to `readArchitecture`); `watcher.test.ts` added outside the canonical files list (in-scope under beads mode for the mandated fs-watch integration test); the verify-phase smoke checklist's step-3 payload should be top-level `{kind:'nav',path:'/architecture'}` not nested `{detail:{path}}` (route reads `body.path`, api.ts:159; client `recordNavEvent`, hooks.ts:79) — checklist text to fix, code is correct.
- Next: SLICE-4 was the last system-map slice — all 4 (scc-57s / scc-byg / scc-lv3 / scc-4ra) are now closed and merged on `v2-prototype-architecture-tab`. NOT pushed and the feature branch not deleted — the user pushes (`git push origin v2-prototype-architecture-tab`) and deletes `feature/scc-4ra--live-auto-refresh-adoption-metric`. With no slices remaining, the next chain step is the feature boundary: `/build system-map` flips it to READY-FOR-QA → `/qa`.

## 2026-06-14 — mtdd-merge landed (scc-lv3) — SLICE-3 SDLC progress view SHIPPED
- Artifact: bead `scc-lv3` (closed) — fast-forward merged into `v2-prototype-architecture-tab` at `846f382`; 1 commit, 2 files (`apps/web/src/components/SdlcProgress.tsx` new, `apps/web/src/pages/ArchitecturePage.tsx`). A "System graph / SDLC progress" toggle in the Architecture tab projects the chain stages grouped by phase, status-colored, with exactly one "next" marked — render-only over the shared `foundationStageStatus`/`featureStageStatus` + the cached `useProjectState` query (NFR-4, no new fetch; statuses match the Pipeline view exactly — same source of truth, different projection).
- Key decision(s): all 5 ACs satisfied (review COMPLETE; verify typecheck-only by policy — bead carries skip-tests + force-skip-tests — typecheck exit 0 / 3 workspaces, prior 209/209 suite green). Render-only verified byte-for-byte vs PipelinePage (statusFor + next-stage loop + feature fallback), no inline derivation; AI-audit ACCEPT. Clean fast-forward, no conflicts — diff is only the two boundary files, so the `dashboard/state.json` artifact churn that conflicted on the SLICE-1 merge did not recur. Non-blocking nits left unedited: dead `_projectId` prop (SdlcProgress.tsx); the SDLC view's feature-branch default matches Pipeline only in its "Auto" mode (deliberate scope reduction — shared helpers remain the single source). Spec/bead mismatch to reconcile: `.ai/specs/system-map/issues/SLICE-3.md` carries `type: afk` but the bead is `ready-for-agent` and not afk-labeled → implement proceeded under the bead (source of truth in beads mode).
- Next: `bd ready` — only SLICE-4 (scc-4ra) remains (auto-refresh + adoption metric; carries nfr-NFR-1 + the `architecture.serve` log/span + p95 gate). NOT pushed and feature branch not deleted — the user pushes (`git push origin v2-prototype-architecture-tab`) and deletes `feature/scc-lv3--sdlc-progress-view`. Manual UI smoke (4 steps, in the bead's verify note) still owed before this is exercised live.

## 2026-06-14 — mtdd-merge landed (scc-byg) — SLICE-2 inspector + work join SHIPPED
- Artifact: bead `scc-byg` (closed) — fast-forward merged into `v2-prototype-architecture-tab` at `42e5348`; 8 commits, 9 files. Component inspector opens on node click (role/files/inputs/outputs/deps) over the real component→feature→slice→issue work join: `parseComponentFeatureMap` inverts `features.md`'s `satisfies` column, `joinComponentWork` derives real status (blocked > in-progress > done; no-feature → done as-built, never fabricated), `loadArchitecture` threads ProjectState + the map through the per-TTL cache, and `/architecture` feeds cached `getProjectState` off the request path (NFR-4).
- Key decision(s): all 7 ACs satisfied (review COMPLETE; verify green — typecheck exit 0, 209/209 tests / 25 files). First review REJECTed on AC1/R-2 (no test proved majority-resolution across the 7 real components — existing tests used synthetic single-entry maps); the recovery `test:` commit added a makeState fixture proving 5/7 resolve a feature/slice/issue + 2/7 honest "unlinked". Before the re-run the boundary was widened 4→8 files (+ parseComponentsModel/architectureModel/api/architecture.test) and the mapping source decided (parse `features.md` `satisfies`, read-only input — no project-state.py change). AC5 "owner" has no data source (no owner column in features.md/02-components.md) → surfaced via the feature/slice link, honest "unlinked" when absent. `.beads/.gitignore` 2-line bd-tooling churn folded into the tip commit (benign). Follow-up: promote makeState/makeFeature/makeSlice builders to packages/shared/src/testing/builders.ts (now second-use, was out of boundary).
- Next: `bd ready` — SLICE-3 (scc-lv3) and SLICE-4 (scc-4ra) remain, parallelizable off the tracer. NOT pushed and feature branch not deleted — the user pushes (`git push origin v2-prototype-architecture-tab`) and deletes the branch. Manual UI smoke (3 steps) still owed before this is exercised live.

## 2026-06-14 — mtdd-merge landed (scc-57s) — SLICE-1 tracer SHIPPED
- Artifact: bead `scc-57s` (closed) — merged into `v2-prototype-architecture-tab` at `06093c5`; 11 commits, 19 files. Architecture tab renders the declared component graph end-to-end (shared types + rollupStatus → markdown parse + NFR-3 round-trip → coarse as-built derive → per-TTL cached `GET /api/projects/:id/architecture` → useArchitecture → @xyflow/react ArchitecturePage + route/nav).
- Key decision(s): all 8 acceptance criteria satisfied (review COMPLETE; verify green — typecheck exit 0, 194/194 tests / 24 files). NFR-1 latency descoped from the tracer after two prior REJECTs and moved coherently to SLICE-4 (scc-4ra now carries the nfr-NFR-1 label + the `architecture.serve` log/span + p95 gate) across PRD/design/plan/SLICE-1/2/4 — the "descope by wording" hole is genuinely closed. A `review:` refinement commit documented the react-flow `data as ArchNodeData` cast (twice-flagged nit). The ONLY merge conflict was `dashboard/state.json`, a continuously-regenerated artifact (live dashboard process timestamp/SHA churn) — user committed their side to unblock, resolved by taking the feature copy; recommend gitignoring it to stop the recurrence. Deferred non-blocking: deriveComponentStatus (constant 'done') + rollupStatus have no prod caller yet (SLICE-2 seams); 404-on-missing-model branch untested; manual smoke (5 steps) pending an operator run.
- Next: `bd ready` — closing scc-57s unblocks SLICE-2 (scc-byg), SLICE-3 (scc-lv3), SLICE-4 (scc-4ra), all parallelizable off the tracer. Not pushed — no remote on the target; the user pushes/deletes the branch.

## 2026-06-13 — publish-issues landed (system-map, backend=beads) — 4 beads minted
- Artifact: 4 task beads — `scc-57s` (S1 tracer, P1), `scc-byg` (S2, P2), `scc-lv3` (S3, P2), `scc-4ra` (S4, P2); refs written back to each `SLICE-N.md` (`backend_refs.beads` + `status: open → published`). Verdict: READY-FOR-BUILD.
- Key decisions: CREATE ×4 (all were open/null — fresh publish). One task bead per slice, NO feature-epic bead (observability/oldest-record-age precedent). Topo order 1→(2,3,4); deps `bd dep add <slice> scc-57s` so S2/S3/S4 are blocked behind the tracer — `bd ready` shows only scc-57s, `bd blocked` shows the other 3 (correct). Chain labels per slice (feature-system-map, category-enhancement, ready-for-agent, lang:typescript, us-US-N, nfr-NFR-N); S3 carries BOTH skip-tests + force-skip-tests (build loop requires both). bd 1.0.4 flag deltas from the v1.0.3 adapter doc handled: `--description`/`--body-file` (no `--body`), `--labels` comma-sep (no repeated `--label`), `--type task`. Body = AI-gen disclaimer + What-to-build prose (`--body-file`); acceptance block passed verbatim via `--acceptance "$(cat …)"` (command-substitution avoids re-scan of backticks/quotes — safe for S4's `source:'user'`). Single-writer guard clear; `.beads/issues.jsonl` git-add warning is the known-harmless gitignored-export (bead lives in Dolt). No two-way sync; no `.human` mirror (md backend would be the human projection — not run).
- Next: `/mtdd-implement scc-57s` — build the tracer first (red → green → refactor); S2/S3/S4 unblock when it closes (parallelizable, 3 PRs off the tracer).

## 2026-06-13 — to-issues landed (system-map) — 4 canonical slices, status → building
- Artifact: `.ai/specs/system-map/issues/SLICE-{1..4}.md` (73/62/55/66 lines, all ≤ cap 80). `.ai/features.md` flipped `system-map` planned → building (counts: 18 shipped / 0 planned / 1 building). Verdict: READY-TO-PUBLISH. No tracker-backend writes (pure content generation; `/publish-issues` mints beads).
- Key decisions: all 4 slices AFK / enhancement / typescript (confirmed with owner). No HITL trigger fired — no slice touches the `db.ts` schema block (Slice 4's `nav` is an INSERT into existing `audit_events`, no DDL per data-management review rule), 0 secrets / single local env (environments), no new deps (all in anchor allowlist), no auth/PII/money, no human-owned paths. Slice 4 (modifies `watcher.ts`, the non-interference / app-never-observes-own-output invariant locus) judged AFK: preservation is mechanical (800 ms debounce + fire-and-forget nav POST + parse off request path) and verified by its integration tests (NFR-4) — owner confirmed. Slice 3 = `tests: skip-tests` (render-only over already-tested stageModel, plan authors no new test file, UI-scaffolding TDD-exempt per CLAUDE.md) — existing suite still must stay green. Priority: S1 = P1 (tracer, unblocks S2/S3/S4), S2/S3/S4 = P2. Traceability mvp-tier: every slice ≥1 user story + ≥1 NFR, mirrored verbatim from plan/prd (US-1/2·NFR-1/3/4 → US-3·NFR-1/4 → US-5·NFR-4 → US-4·NFR-2/4). Fresh generation (no prior issues/). `backend_refs` written null (preserved on update).
- Next: `/publish-issues system-map --backend=beads` → mint a bead per slice → READY-FOR-BUILD; then `/mtdd-implement` the tracer (Slice 1) first (red → green → refactor).

## 2026-06-13 — feature-map landed (system-map) — BEYOND-ROSTER REGISTERED
- Artifact: `.ai/features.md` (update mode) — `system-map` added as a planned row (P0, mvp); counts now 18 shipped / 1 planned; `p0: [system-map]`. `.human/summaries/features.md` regenerated (was stale at "16 shipped") + 1 validated feature-map flowchart (mermaid skill, kroki PASS).
- Key decisions: registration, not decomposition — `system-map` was already specified end-to-end (prd→design→plan→adr) before it had a roster row (`beyond_roster: true`). Trace = 3 shipped components (DeriveProjectState, RenderFlightDeck, ShareDomainModel) + a NEW behavior `orient-on-system-shape` (declared in its prd `satisfies`, not yet in understanding.md) → recorded under `orphans` (backfill note: fold into /comprehend) + `beyond_discovery`; NOT a true orphan (traces to components). `depends_on: —` (everything it reuses is shipped → no build-ordering constraint). trace_status stays `complete` (mislabeling 18 solid rows for one new-but-specified behavior would be dishonest). Judgment call (owner default-yes): added `cross-project-orchestrator` as the first Deferred row (revisit 2026-12-31, from understanding § boundaries "autonomous multi-session fleet orchestration") — routed OUT of system-map's scope to its own feature; portfolio switcher left out (no spec/date). Brownfield roster (no /discovery) — trace source is understanding behaviors + architecture components, as existing rows do; `/feature-map` run in update mode (every existing row preserved).
- Next: `/to-issues system-map` (not `/prd` — done) → canonical `SLICE-N.md` files (flips planned → building) → `/publish-issues system-map --backend=beads` → `/mtdd-implement` the tracer (Slice 1).

## 2026-06-13 — plan landed (system-map) — 4 vertical slices
- Artifact: `.ai/specs/system-map/plan.md` (102 lines, mvp cap 185). Verdict: READY-FOR-ISSUES.
- Key decisions: 4 vertical, dependency-ordered, independently-mergeable slices (each one PR). S1 TRACER = thinnest real path (shared types → markdown parse → status derive → project-scoped serve → react-query fetch → @xyflow/react render → nav) ships US-1/US-2, proves NFR-1/3/4. S2 inspector+work-join (US-3, R-2), S3 SDLC view (US-5), S4 auto-refresh+adoption-metric (US-4, NFR-2) — S2/S3/S4 each depend only on S1 → parallelizable (3 PRs off the tracer). NO new deps (LikeC4 deferred, design adr/0001) → no dep-audit acceptance lines. mvp → no fitness/Unwanted-EARS table. All 5 architecture invariants cross-checked, none violated. File paths inherited verbatim from design's layout. No E2E spec extension (system-map maps to none in test-strategy → manual smoke).
- Next: `/to-issues system-map` → canonical SLICE-N.md files → `/publish-issues` (bead per slice) → `/mtdd-implement`. Still beyond_roster: register via `/feature-map` (P0, mvp) before /build.

## 2026-06-13 — design landed (system-map) — composite, 1 per-feature ADR
- Artifact: `.ai/specs/system-map/design.md` (160 lines, mvp cap 185) + `adr/0001-defer-likec4-render-our-own.md` + `.human` mirror (2 sequenceDiagrams validated via mermaid skill, kroki PASS). Verdict: READY-FOR-PLAN.
- Key decisions (4 open questions triaged with owner, all design-resolvable — no early-exit): Q1 success metric → keep self-adoption, wire the app-emitted `nav` audit event as the metric source (n=1 caveat on record); accuracy stays NFR-3. Q2 drift → OUT of v1, schema reserves it (`ArchEdge.type`), drift = a query later (ADR-0009). Q3 model source → parse `02-components.md` markdown (idiom ported from `project-state.py:203-233`, no new dep). Q4 LikeC4 → DEFER as renderer (adr/0001), adopt its metadata convention for forward-compat. Placement = DeriveProjectState + ServeApiAndWs + RenderFlightDeck + ShareDomainModel (ADR-0008/0009-sanctioned spread, NO new component). 6 new modules (composite 3-view feature: graph/inspector/SDLC-progress). NO new deps. Schema = none (derived, ADR-0009; nav reuses audit_events). PRD corrections baked in: endpoint project-scoped `GET /api/projects/:id/architecture`; `architecture-changed` reuses existing `.ai/` watch (no new watch path). Grounded by a 6-agent read-only scout of the real code (React Flow/PipelinePage, stageModel, watcher, api.ts/ws.ts, audit_events) + LikeC4 research.
- Next: `/plan system-map` — tracer slice = parse→serve→render the colored graph; then inspector+join, SDLC view, auto-refresh+nav metric. Still `beyond_roster: true` — register via `/feature-map` (P0, mvp) before `/build`.

## 2026-06-13 — architect update (unified graph domain model) — ADR-0008/0009 ADDED
- Artifacts (update mode, mvp): NEW `.ai/architecture/adr/0008-unified-graph-domain-model.md` + `adr/0009-twin-derives-not-duplicates.md`; EDITED `02-components.md` (new invariant + § Forward structure), `index.md` (adr_count 4→6 + bundle map + notes), `.human/summaries/architecture.md` (decisions paragraph). Verdict: READY-FOR-PRD.
- Key decisions: ratified the digital-twin backbone the system-map PRD/vision asked for. ADR-0008 = one typed graph (nodes req/feature/slice/component/api/datastore/workflow/source-file/test/deployment/issue/agent-session/person; edges depends-on/maps-to/implements/traces-to/calls/emits/owns/touches); every view is a projection; MVP renders the {component,edge,feature,slice,issue,stage} subset. ADR-0009 = derive-don't-duplicate (twin references git/beads/audit/.ai/CI, recomputed not synced; SoT for the declared architecture model only, pane-of-glass for the rest) — rejected the event-sourced twin-store alternative. Judgment call: NO new component — the graph spreads across ShareDomainModel (types) + DeriveProjectState (materialize) + ServeApiAndWs (serve); a new component would imply a non-existent service boundary. Components 7 / edges 10 / C4 unchanged.
- Next: /design system-map — design now traces to ADR-0008/0009 + DeriveProjectState/RenderFlightDeck; triage the PRD's 3 open questions at the top.

## 2026-06-13 — prd landed (system-map) — BEYOND-ROSTER (v2 dogfood)
- Artifact: `.ai/specs/system-map/prd.md` (151 lines, mvp cap 185) + `.human` mirror — verdict: READY-FOR-DESIGN.
- Key decisions: tier mvp (no uplift — local-first viz, ai_in_core_path stays false; the orchestrator is a SEPARATE feature, scoped OUT). beyond_roster: true — not in features.md; add via /feature-map (P0) before /build. Placement = DeriveProjectState (parse model + /api/architecture + architecture-changed + watch .ai/architecture/) + RenderFlightDeck (tab; @xyflow/react + stageModel already shipped) + ShareDomainModel (new types) — fits existing components, NOT blocked-on-architect. Scope = the DECLARED-model renderer; drift detection, extra views, portfolio, orchestrator all OUT. First slice (tracer): parse 02-components.md → /api/architecture → render 7 nodes/10 edges. 3 open questions for /design triage: success metric (provisional self-adoption ≥60%), drift-in-v1 (→ fast-follow), model source (→ markdown parser first). Came from the v2 UI-prototype exploration (branch v2-prototype-architecture-tab).
- Owner feedback (pushed back, partly adopted): expand to a living digital twin. ADDED `## Vision & forward design constraint` (PRD, 176 lines, still ≤185) + companion `.ai/specs/system-map/vision.md`. BINDING on /design: (1) one unified graph-based domain model — all views are projections over typed nodes/edges; MVP ships a strict subset {component,edge,feature,slice,issue,stage}; (2) derive-don't-duplicate — twin references git/beads/CI/audit, owns only the architecture model (corrected owner's "single source of truth for everything" → single pane of glass). Drift detection elevated to primary v1.1. Slice 1 UNCHANGED. The graph model = an architecture decision → route to /architect (ADR) so /design consumes it.
- Next: /architect (ADR: unified-graph domain model) → then /design system-map; or /design now with the constraint + ADR before /plan. Owner's call.

## 2026-06-13 — ship landed (oldest-record-age) — SHIPPED
- Artifact: `.ai/features.md` row flipped qa-approved → shipped (18 shipped / 0 planned).
- Key decisions: local-first → shipped = on develop + runs from source; no remote deploy/tag/CHANGELOG; release smoke = full suite (179/179) green; UI smoke human-deferred; flip authorized on the record. Full per-feature loop complete (prd→design→plan→to-issues→publish→build→qa→ship) — the vehicle that fired /qa's verifier delegation.
- Next: merge develop → main (local, no push — per user); success metric is a soft legibility check (no /measure window).

## 2026-06-13 — qa landed (oldest-record-age) — VERIFIER DELEGATION FIRED
- Artifact: `.ai/specs/oldest-record-age/qa-report.md` — verdict: READY-FOR-SHIP.
- Key decisions: 6 PASS / 0 FAIL / 2 WARN (security negligible + a11y date-in-tooltip mouse-only, both mvp-accepted) / 3 SKIP (g/h/k prod-only). **/qa's verifier delegation fired for the first time** — read-only verifier subagent ran bd show + npm test (179/179) + typecheck + greps itself, graded a/b/c/e/f with file:line citations, returned evidence only (no chain verdict / no <promise>). Closes the last unproven delegating-skill path. features.md flipped building → qa-approved; approved as-is on the record.
- Next: /ship oldest-record-age (local-first), or merge develop → main.

## 2026-06-13 — publish-issues landed (oldest-record-age, backend=beads)
- Artifact: bead scc-sa4 (the slice work item; ref written back to SLICE-1.md backend_refs). Canonical SLICE-1 status: published.
- Key decisions: one slice bead per the observability precedent (no feature-epic bead); chain labels applied (feature-oldest-record-age, ready-for-agent, lang:typescript, us-story-1..3, nfr-N1..3); pre-chain tracking bead scc-dni closed as superseded.
- Next: /mtdd-implement scc-sa4 (TDD: red → green → refactor).

## 2026-06-13 — to-issues landed (oldest-record-age)
- Artifact: `.ai/specs/oldest-record-age/issues/SLICE-1.md` — verdict: READY-TO-PUBLISH.
- Key decisions: 1 canonical slice; AFK (no HITL rule fires — read-only, no migration/secret/new-dep), enhancement, tests required, typescript; traces to 3 stories + 3 NFRs. features.md flipped planned → building.
- Next: /publish-issues oldest-record-age --backend=beads.

## 2026-06-13 — plan landed (oldest-record-age)
- Artifact: `.ai/specs/oldest-record-age/plan.md` — verdict: READY-FOR-ISSUES.
- Key decisions: 1 vertical slice (whole feature is one PR — pure formatter + single render site; refused artificial horizontal fragmentation of a ~20-line change). Tracer bullet wires formatRelativeAge end-to-end into StoragePanel. Acceptance: unit specs (N2/N3) + regression + N1 inspection.
- Next: /to-issues oldest-record-age (flips planned → building).

## 2026-06-13 — design landed (oldest-record-age)
- Artifact: `.ai/specs/oldest-record-age/design.md` (+ .human mirror, sequenceDiagram validated via mermaid skill) — verdict: READY-FOR-PLAN.
- Key decisions: 2 modules (NEW formatRelativeAge in @sdlc/shared + MODIFIED StoragePanel Oldest cell); no new deps, no schema, no API; date kept reachable via cell title; months/years rollup declined (days match cutoff domain). Single slice expected.
- Next: /plan oldest-record-age.

## 2026-06-13 — prd landed (oldest-record-age)
- Artifact: `.ai/specs/oldest-record-age/prd.md` — verdict: READY-FOR-DESIGN.
- Key decisions: tier mvp (no uplift — read-only UI); 3 stories, 3 NFRs, dated kill criterion; gap surfaced by the verifier subagent (prune summary says "age", no formatter existed). New planned features.md row (P1). Vehicle for firing /qa's verifier delegation.
- Next: /design oldest-record-age — pure formatter in @sdlc/shared + StoragePanel render.

## 2026-06-13 — ship landed (observability-data-pruning) — SHIPPED
- Artifact: `.ai/features.md` row flipped qa-approved → shipped. **Full per-feature loop complete end-to-end.**
- Key decisions: local-first → shipped = merged to develop + runs from source; no remote deploy/tag (hosting local-only); no CHANGELOG; smoke (curl /api/health) human-deferred; flip recorded under standing autonomous authorization.
- Next: success metric has a 2-week window — `/measure observability-data-pruning` due ~2026-06-27. Or pick the next feature.

## 2026-06-13 — qa landed (observability-data-pruning)
- Artifact: `.ai/specs/observability-data-pruning/qa-report.md` — verdict: READY-FOR-SHIP.
- Key decisions: 7 PASS / 0 FAIL / 2 WARN (security + a11y, mvp-accepted) / 1 SKIP; features.md flipped building → qa-approved; approval on the record (autonomous standing auth). I-11: tagged NFR ids in tests so check e traces.
- Next: /ship observability-data-pruning (release gate; runbook is production-only, skipped at mvp).

## 2026-06-13 — mtdd loop SLICE-3 merged; feature fully built (observability-data-pruning / scc-0bb)
- Artifact: bead scc-0bb (closed) — merged into `develop` at `6ea9e24`. All 3 slices done.
- Key decisions: confirm dialog + result readout; pure formatters TDD'd in @sdlc/shared (formatBytes/formatPruneResultLine/pruneWarningCopy); UI wiring smoke-verified. 168/168 tests.
- Next: /build → READY-FOR-QA → /qa observability-data-pruning.

## 2026-06-13 — mtdd loop SLICE-2 merged (observability-data-pruning / scc-b51)
- Artifact: bead scc-b51 (closed) — merged into `develop` at `e644a28`; prune engine API-complete.
- Key decisions: transactional delete + live-session protection + FTS cascade; boot auto_vacuum=INCREMENTAL; chunked incremental_vacuum (ADR-0001) with non-incremental-mode loop guard; storage.prune audit event = success-metric source. 164/164 tests.
- Next: /build → scc-0bb (slice 3, confirm-dialog UI), last slice before /qa.

## 2026-06-13 — mtdd loop SLICE-1 merged (observability-data-pruning / scc-m7w)
- Artifact: bead scc-m7w (closed) — merged into `develop` at `0327f3f`; 5 commits, 4 code files.
- Key decisions: tracer bullet — storage stats end-to-end (reportStorageStats + /api/storage/stats + Storage panel S1); 159/159 tests; new tmp-dir SQLite test pattern established. Review/verify degraded in-context (I-9).
- Next: /build observability-data-pruning → next ready slice (expect scc-b51, the HITL prune engine).

## 2026-06-13 — publish-issues landed (observability-data-pruning, backend=beads)
- Artifact: beads scc-m7w / scc-b51 / scc-0bb (+ 2 dep edges); canonical files flipped open → published with refs.
- Key decisions: bd init (prefix scc) ran as setup; frozen-spec guard ask fired live on the write-back (expected).
- Next: /build — pick the next unblocked slice (expect scc-m7w, the tracer) → READY-FOR-MTDD.

## 2026-06-13 — to-issues landed (observability-data-pruning)
- Artifact: `.ai/specs/observability-data-pruning/issues/SLICE-{1..3}.md` — verdict: READY-TO-PUBLISH.
- Key decisions: slices 1/3 AFK, slice 2 HITL (db.ts schema-block review rule + invariant-1 adjacency); all tests-required; feature flipped planned → building.
- Next: /publish-issues observability-data-pruning --backend=beads (bd CLI present).

## 2026-06-13 — plan landed (observability-data-pruning)
- Artifact: `.ai/specs/observability-data-pruning/plan.md` — verdict: READY-FOR-ISSUES.
- Key decisions: 3 slices — tracer = stats end-to-end; prune engine API-complete; confirm UX last. No mapped E2E journey (deliberate); N1 mechanical proxy = bounded vacuum chunks.
- Next: /to-issues observability-data-pruning — canonical SLICE-N.md files; flips feature planned → building.

## 2026-06-13 — design landed (observability-data-pruning)
- Artifact: `.ai/specs/observability-data-pruning/design.md` — verdict: READY-FOR-PLAN.
- Key decisions: 4 modules (CQS split stats/prune); zero new deps; chunked incremental_vacuum (feature ADR-0001 — monolithic VACUUM would stall the event loop and violate invariant 1); transactional delete backs the UI's "unchanged" promise; audit event storage.prune = success-metric source.
- Next: /plan observability-data-pruning — vertical slices, tracer bullet first.

## 2026-06-13 — prd landed (observability-data-pruning)
- Artifact: `.ai/specs/observability-data-pruning/prd.md` — verdict: READY-FOR-DESIGN.
- Key decisions: mvp tier (no uplift); 6 stories, 4 numeric NFRs; live-session records unprunable (new rule for /design); kill criterion 2026-09-13.
- Next: /research skipped candidate? No — brownfield optional scout: small feature, db.ts already recon'd; straight to /design observability-data-pruning.

## 2026-06-13 — pipeline landed (sdlc-command-center)
- Artifact: `.ai/pipeline.md` — verdict: PIPELINE-LOCKED. FOUNDATION COMPLETE.
- Key decisions: no CI exists; 5 gates recorded (2 agent-time enforced, 3 manual); gaps G1-G3 left open for the owner (route or waive) — autonomous run never waives.
- Next: /prd observability-data-pruning — the per-feature loop begins.

## 2026-06-13 — test-strategy landed (sdlc-command-center)
- Artifact: `.ai/test-strategy.md` — verdict: TEST-STRATEGY-LOCKED.
- Key decisions: recovered vitest workspace + make<Entity> builder idiom; (new) tmp-dir SQLite rule, builder growth rule, Playwright journey suite named-not-materialized (dep_adds flags @playwright/test for anchor).
- Next: /pipeline (RECOVERY — no CI exists; gap table will be honest), then /prd observability-data-pruning.

## 2026-06-13 — feature-census landed (sdlc-command-center)
- Artifact: `.ai/features.md` — verdict: READY-FOR-PRD.
- Key decisions: 16 shipped features inventoried (component+behavior traced); 1 planned P0 = observability-data-pruning (retention gap surfaced by this run's data-management stage).
- Next: /test-strategy (brownfield recovery of vitest conventions), then /pipeline, then /prd observability-data-pruning.

## 2026-06-13 — architect landed (sdlc-command-center)
- Artifact: `.ai/architecture/` bundle — verdict: READY-FOR-PRD (features.md absent → /feature-census first).
- Key decisions: as-is modular monolith + event bus; 7 verb-noun components, 10 edges; ADRs 0004-0007 (continuing docs/adr numbering); api-governance detected ({error} envelope, limit+before pagination, no auth/versioning).
- Next: /feature-census — inventory shipped features from recon §B, cross-trace to components; /health-audit skipped (optional gate, autonomous default).

## 2026-06-13 — comprehend landed (sdlc-command-center)
- Artifact: `.ai/understanding/sdlc-command-center.md` + `.ai/context.md` — verdict: READY-FOR-ARCHITECT.
- Key decisions: invariants triaged 24→12 (citations kept); 3 journeys; 6 mystery zones resolved or recorded as falsifiable assumptions; no new ADRs.
- Next: /architect — paste recon §A+§B+§D; as-is HLD over the existing code.

## 2026-06-13 — data-management landed (sdlc-command-center)
- Artifact: `.ai/data-management.md` — verdict: DATA-MANAGEMENT-LOCKED.
- Key decisions: RECOVERY — no migration tool (boot DDL + ensureColumn), additive-only with argued-irreversible rollback (local re-derivable store), data transforms = idempotent boot backfills, seeds none.
- Next: /comprehend — confirm recon §C glossary/invariants into .ai/context.md; §E mystery zones are the open questions.

## 2026-06-13 — environments landed (sdlc-command-center)
- Artifact: `.ai/environments.md` — verdict: ENVIRONMENTS-LOCKED.
- Key decisions: RECOVERY mode — 1 env (local, two run modes), 11 vars all optional-with-defaults, 0 secrets, no flags/IaC/CI; mirror + validated diagram written.
- Next: /data-management (RECOVERY — sqlite at apps/server/src/db.ts), then /comprehend.

## 2026-06-13 — explore landed (sdlc-command-center)
- Artifact: `.ai/recon.md` — verdict: READY-FOR-COMPREHEND.
- Key decisions: 161 citations, 7 components, 24 glossary candidates; 3 spot-checks verified; sub-agent mechanism repaired mid-run (draft-file contract — see DOGFOOD-LOG I-3).
- Next: /environments (RECOVERY) + /data-management (RECOVERY) per canonical order, then /comprehend with recon Section C/E.

## 2026-06-13 — anchor landed (sdlc-command-center)
- Artifact: `.ai/anchor.md` — verdict: READY-FOR-ARCHITECT.
- Key decisions: tier locked mvp; stack detected (TS monorepo, react-vite + fastify, sqlite, local-only, no auth); ai_in_core_path false (devtool); CLAUDE.md exists → seeded CLAUDE.md.suggested; tentatives: nfr ceiling, versioning, dep allowlist.
- Next: /explore — whole-repo recon (brownfield path), then /comprehend.

## 2026-06-13 — onboard landed (sdlc-command-center)
- Artifact: `.ai/intake.md` — verdict: READY-FOR-ANCHOR.
- Key decisions: brownfield, predicted_tier mvp (ships to its one user daily; no uplift signals), technical user.
- Next: /anchor — confirm the detected stack (TS monorepo: React/Vite web, Fastify+PTY server, SQLite) and lock the tier.
