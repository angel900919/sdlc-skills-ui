---
name: qa
disable-model-invocation: true
description: |-
  Feature-boundary quality gate. After every slice of a feature is built and closed, runs a tier-aware evidence pass — slice closure, PRD coverage (F-IDs, user stories, NFRs, Unwanted-EARS), a full regression test run, security review and accessibility at production, fitness functions, architecture invariants, and a lightweight spec-drift check — delegating mechanical runs to the read-only verifier subagent, the rest to built-ins. Writes a structured evidence record plus a human-run acceptance and exploratory script, then a human approves before the feature flips building to qa-approved. Reads the canonical specs and backend runtime state; never edits specs or ships. Use when the user says "/qa", "qa this feature", "verify the feature", "evidence pack for X", "ready for ship review", or after /build emits READY-FOR-QA. Do NOT use for: per-slice work (the mtdd loop), bug root-causing (/diagnose), spec authoring (/prd, /design, /plan), release and deploy (/ship), or whole-repo health audits (/health-audit).
---

# QA — feature-boundary quality gate

Automation produces the evidence; the human runs the acceptance script and signs; only then does `features.md` flip `building → qa-approved`. It sits between execution (the slices reach terminal state) and `/ship`, and it is the deterministic destination of `/build`'s `READY-FOR-QA`.

Real release-readiness QA = functional/acceptance + **regression** + **security** + **accessibility** + exploratory + a human Definition-of-Done sign-off. This skill keeps the chain's spec-traceability strengths (coverage matrix, fitness functions, invariants) **and** delegates the mechanical runs to built-ins.

<what-to-do>

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `qa-report.md` schema) before writing. The per-check method, tier matrix, and built-in delegation + fallbacks live in [references/checks.md](references/checks.md).

## Critical rules

1. **Status gate.** The `.ai/features.md` row must be `status: building`. Otherwise `BLOCKED-ON-STATUS` (with the reason: `planned` → build first; `qa-approved` → already gated; `shipped` → out of scope; `blocked`/`cut` → resolve in `/feature-map`). Never auto-promote.
2. **Canonical = contract; backend = runtime state.** Read each slice's *definition* (acceptance criteria text+count, `satisfies_*`, `files`) from `.ai/specs/<feature>/issues/SLICE-N.md`. Read each slice's *done state* from the **backend** (bead closed / Jira done / materialized-md `## Completion`) — the **same done-detection `/build` uses**, so this stays correct regardless of how the execute loop writes closure. A built canonical slice stays `status: published` with `- [ ]` boxes by design; that is not incompleteness.
3. **Delegate execution; degrade gracefully.** The mechanical evidence checks (**a–c, e–h**) run inside ONE **`verifier` subagent** — a fresh, read-only context (no Edit/Write; seeded at `.claude/agents/verifier.md` by `/mtdd-init --write`) that runs the commands and returns per-check evidence unbiased by this conversation. **`/run`** (bring the app up for the human script) and **`/security-review`** (production) stay with built-ins. Verifier agent type unknown → say so and run those checks in-context this run (degraded — same-context grading); diagnose which case: **not seeded** (`.claude/agents/verifier.md` absent → `/mtdd-init --write`) vs **seeded but not registered this session** (file present; the registry snapshots at session start, so a seed written this session needs a **session restart**, not another `/mtdd-init`). A built-in absent (older CC / the Windows checkout) → **emit the manual command for the human and WARN** — never silently skip a gate. Version floors + fallbacks: [references/checks.md](references/checks.md).
4. **Regression is a first-class gate.** Don't test only the feature's own files. At mvp+ run the **full suite** ("did we break anything else?"); at prototype, feature-scoped tests + smoke. A regression failure is FAIL.
5. **FAIL stops approval.** Any FAIL → end at Phase 4 with the non-approval verdict; don't request approval. WARN/SKIP don't block — surface them for human judgment.
6. **Human approval at every tier — even prototype.** The human runs the acceptance **and exploratory** script (Phase 3) and signs. No write-back without an explicit yes.
7. **Read-only on specs; no release.** Never edit PRD/plan/design/issues. Drift → route to the owning skill. `qa-approved` is terminal here; deploy + the `qa-approved → shipped` flip are `/ship`.
8. **Tier-aware depth** against the **effective `tier` inherited from `prd.md`** (never recomputed) — a prototype project shipping a PII-uplifted feature runs the production column for that feature. Matrix: [references/checks.md](references/checks.md).
9. **Talk to the human in plain English** at the gate per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — present evidence plainly, name what needs their judgment, ask one clear y/n.
10. **Two registers.** `.ai/specs/<feature>/qa-report.md` = structured evidence (check table, citations, coverage matrix). `.human/specs/<feature>/qa-report.md` = the gate summary + the **human-run acceptance + exploratory script**. No diagrams in either (none needed).
11. **Tracker.** Read top 5 at Phase 0; append one entry **only on `READY-FOR-SHIP`** (after the `features.md` flip). Skip on every other verdict.
12. **Fresh evidence only.** A PASS cites a command that ran **during this `/qa` run** with its observed output (exit code, counts, test names) — a command run inside this run's verifier subagent counts; its report carries the output. Not evidence: a prior session's run, the execute loop's "tests passed" note, a partial run, or any claim wearing *should / probably / seems to*. A check you believe passes but did not run this run is **not a PASS** — re-run it, or degrade per rule 3 (manual command + WARN). Never let confidence stand in for output.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan before requesting approval.

## Procedure

```
qa progress:
- [ ] Phase 0: Tracker top 5; validate arg + files + status gate + tier + tracker auth; announce
- [ ] Phase 1: Load PRD / design / plan / issues / features-row / architecture (+ fitness presence at prod)
- [ ] Phase 2: Run the tier-aware checks (delegate to built-ins; degrade gracefully) — PASS/FAIL/WARN/SKIP + citations
- [ ] Phase 3: Write .ai qa-report (evidence) + .human qa-report (gate summary + acceptance/exploratory script)
- [ ] Phase 4: Present; any FAIL → stop with the verdict; else human runs the script + approves
- [ ] Phase 5: On yes → flip features.md building→qa-approved + sign report + tracker; verdict
```

### Phase 0 — Validate
Read `.ai/progress-tracker.md` top 5. Then: **arg** (feature slug; else refuse) · **files** (`prd.md`, `design.md`, `plan.md`, non-empty `issues/SLICE-*.md`; missing → name the file + upstream skill) · **tier** (inherited `tier:` from `prd.md` frontmatter; no anchor → `BLOCKED-ON-ANCHOR`) · **status gate** (rule 1) · **tracker auth** (every distinct `backend_refs.<backend>` reachable; else `BLOCKED-ON-AUTH`) · **architecture** (warn-if-missing). Announce the feature, tier, slice/backend summary, and the checks that will run.

### Phase 1 — Load artifacts
Pull everything before running checks (so the report generates even if a check errors): PRD (F-IDs, stories `[mvp+]`, NFRs+targets `[mvp+]`, Unwanted-EARS `[prod]`, fitness fns `[prod]`) · plan (slice deps) · design (components, test plan, observability) · each `SLICE-N.md` (`status`, `satisfies_*`, `files`, `backend_refs`, acceptance) · `features.md` row · architecture invariants for touched components · `.ai/specs/<feature>/ux.md` screens + states (if present — UI surfaces).

### Phase 2 — Run the checks
Run the checks applicable to the effective tier, in order, recording PASS/FAIL/WARN/SKIP + a one-line reason with concrete citations (paths, test names, tracker IDs). Full method + delegation per check: [references/checks.md](references/checks.md).

Launch the **verifier subagent** (rule 3) ONCE for checks **a–c, e–h**: the delegation prompt names the feature slug, the artifact paths loaded in Phase 1, the applicable checks for the effective tier, and the path to [references/checks.md](references/checks.md) — it reads the per-check methods itself and returns the PASS/FAIL/WARN/SKIP rows with citations (evidence only, never a chain verdict). Checks **d, i, j, k** run here in the parent (doc reasoning, built-in delegation, human-facing judgment).

- **a. Slice closure** (all) — backend terminal (rule 2) + acceptance satisfied + `files` exist. Cross-backend disagreement → `BLOCKED-ON-CONFLICT`.
- **b. Coverage matrix** (all; depth by tier) — F-IDs (all) · stories + NFRs (mvp+) · Unwanted-EARS (prod) each map to ≥1 slice `satisfies_*`; inverse: no stale `satisfies_*`.
- **c. Regression** (rule 4) — `/verify` or the test command; mvp+ full suite, prototype feature+smoke. At mvp+, when `.ai/test-strategy.md` exists, also read its `## E2E journey suite` table and run the spec files mapped to this feature — a mapped spec missing on disk is WARN; a failing one is FAIL. When `.ai/pipeline.md` exists, cite its blocking pre-merge gates as evidence context — a gate the contract marks blocking that never ran for this feature's slices is a WARN naming the gate.
- **d. Spec-drift** (mvp+) — lightweight inline (slice `files` vs design; `satisfies_*` vs PRD); ≥1 contradiction → `SPEC-DRIFT` (deeper `/coherence-check` when built).
- **e. NFR existence + staleness** (mvp+) — every measurable NFR referenced by ≥1 test; PRD newer than the test → WARN.
- **f. Architecture invariants** (mvp+) — grep-checkable → PASS/FAIL; else list for the human.
- **g. Fitness functions** (prod) — run `fitness/` + `fitness/<feature>/`; absent/empty → `BLOCKED-ON-FITNESS → /to-fitness`.
- **h. Unwanted-behavior defenses** (prod) — each `U-N` claimed by a slice is referenced by a test.
- **i. Security review** (prod; mvp WARN) — delegate to **`/security-review`** on the feature diff; degrade to a flagged manual step if absent. Also cite the threat register: read `.ai/architecture/threat-model.md` — any `status: open` T-N whose boundary or routed candidate touches this feature's components is a WARN naming the T-N id; a missing threat model at production is itself a WARN ("run /threat-model").
- **j. Accessibility** (prod for a UI surface; mvp WARN) — WCAG basics (keyboard, labels, contrast, error/empty/loading states); no UI surface → SKIP "n/a — no UI".
- **k. Runbook existence** (prod; informational) — note whether `.ai/runbooks/<feature>.md` exists; absent → WARN recommending `/runbook <feature>` after approval (never FAIL — the runbook is written at ship time).

### Phase 3 — Write the artifacts
1. **`.ai/specs/<feature>/qa-report.md`** — structured evidence per [`../_shared/ai-schema.md`](../_shared/ai-schema.md): frontmatter index (tier, check counts, verdict), the check table (status + citation per check), the coverage matrix, the approval block (append-only, most-recent first).
2. **`.human/specs/<feature>/qa-report.md`** — plain-English gate summary (one-line verdict + WARN/SKIP items needing judgment) **and the human-run script**: an **acceptance scenario** per user story (mvp+) or per F-ID (prototype) — `Setup` → numbered `action → expected result` → `Result: ☐ pass ☐ fail`, tagged to its story/F-ID — plus an **exploratory prompt** (poke the edges the Unwanted-EARS name: bad input, error/empty/loading states, boundaries). If `.ai/specs/<feature>/ux.md` exists, the acceptance script also walks every screen it lists through its four specified interaction states (loading/empty/error/disabled) and checks the validation/error copy verbatim against the spec — a screen or state missing from the running app is a FAIL-grade finding, not exploratory color. No invention — only steps grounded in PRD/acceptance; internal-only behavior → "covered by automated tests." Generate on every run (even on FAIL, so it's ready). Link the two reports to each other.

### Phase 4 — Present + gate
Print the Phase-2 summary table + the "needs human judgment" (WARN/SKIP) list + a pointer to the `.human` script. Optionally note whether `docs/<feature>.md` exists (written by `/docs`) under the items needing human judgment — informational only, never a gating check. **Any FAIL / SPEC-DRIFT / BLOCKED-ON-FITNESS → stop here**, go to Phase 5 with that verdict, don't request approval. Otherwise ask plainly: *"Evidence complete (N WARN, M SKIP, 0 FAIL). Run the acceptance + exploratory script in `.human/specs/<feature>/qa-report.md`; when it passes, approve `<feature>` for ship and flip it to `qa-approved`? (y/n)"* Capture a one-line reason on yes or no.

### Phase 5 — Write-back + verdict
**On yes:** flip the `features.md` row `building → qa-approved` (atomic) · append the signed approval (`Approved: Yes` · `By: <git user.name>` · `At: <ISO>` · `Reason:`) to the `.ai` report · append a `qa landed (<feature>)` tracker entry · **`READY-FOR-SHIP → /ship`**.
**On no:** `features.md` unchanged · record the rejection (reason names the next action) · **`REJECTED → <next>`**.
**Stepped away:** **`AWAITING-APPROVAL`** (report on disk; re-running re-runs checks + re-asks).
**Any FAIL:** **`EVIDENCE-INCOMPLETE → <most-upstream failing concern>`** (open slice → finish execution; missing coverage → `/plan`; failing test → fix the slice; failing fitness → `/diagnose`). **SPEC-DRIFT** / **BLOCKED-ON-FITNESS → /to-fitness** / **BLOCKED-ON-STATUS|AUTH|CONFLICT** per their checks.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/qa-report.md`** — MACHINE/auditor-facing evidence: check table, citations, coverage matrix, append-only approval log. Durable, regenerated each run. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Read by `/ship`.
- **`.human/specs/<feature>/qa-report.md`** — HUMAN-facing: the gate summary + the acceptance + exploratory script the human runs before signing.

## Position in the SDLC
```
… → /build (READY-FOR-QA) → /qa <feature> (HERE) → human gate → features.md: qa-approved → /ship → shipped
```
`/qa` is the closing verifier of the build phase: it produces evidence and captures the human's Definition-of-Done decision. It doesn't ship.

## Origin-agnostic
Shared back-half skill — by the time a feature reaches `/qa` it has gone through `/prd → /design → /plan → /to-issues → /build`, identically for greenfield and brownfield. Brownfield's only twist (some slices `op: modify`) is already handled by slice closure + regression.

## What this skill refuses to do
- Edit PRD/plan/design/issues/backend_refs → the owning skills. Read-only on specs.
- Per-slice review → the `mtdd-*` execute loop. `/qa` is feature-granularity.
- Bug root-causing → `/diagnose`. Release/deploy → `/ship`.
- Auto-approve → human y/n at every tier, including prototype.
- Whole-repo health audit → `/health-audit`.
- Re-run benchmarks → NFR check is existence + staleness; load/perf infra lives in CI.

## Tier matrix + delegation
The full PASS-applicability matrix (a–k × prototype/mvp/production), the per-check method, and the built-in version floors + manual fallbacks: [references/checks.md](references/checks.md). The `tier` column means the **effective** tier from `prd.md` (after uplift), not `project_tier`.

</supporting-info>
