# QA checks — tier matrix, method, and built-in delegation

The `tier` throughout is the **effective tier inherited from `prd.md`** (after uplift), not `project_tier`. A prototype project shipping a PII-uplifted feature runs the production column for that feature.

## Tier matrix (which checks run, and how deep)

```
                                   prototype   mvp        production
──────────────────────────────────────────────────────────────────────
a. Slice closure                   ✓           ✓          ✓
b. Coverage — F-IDs                ✓           ✓          ✓
b. Coverage — user stories         —           ✓          ✓
b. Coverage — NFRs                 —           ✓          ✓
b. Coverage — Unwanted-EARS        —           —          ✓
c. Regression (test run)           feature+smoke  full    full
d. Spec-drift (inline)             —           ✓          ✓
e. NFR existence + staleness       —           ✓          ✓
f. Architecture invariants         —           ✓          ✓
g. Fitness functions               —           —          ✓ (BLOCK if absent)
h. Unwanted-behavior defenses      —           —          ✓
i. Security review                 —           WARN       ✓
j. Accessibility (UI features)     —           WARN       ✓
k. Runbook existence               —           —          informational (WARN)
Human acceptance + exploratory     ✓           ✓          ✓
```

`—` = skip at that tier. `WARN` = run if cheap, but a gap is a warning, not a FAIL.

## Built-in delegation + graceful degradation

`/qa` owns the *bespoke* part (read the contract, trace coverage, gate, write the report). Checks **a–c, e–h** execute inside the read-only **verifier subagent** (SKILL.md rule 3 — it reads this file's per-check methods itself); the table below covers the runs that stay in the parent, plus the fallbacks when the verifier or a built-in is unavailable. **Degrade gracefully** — if a built-in is missing (older Claude Code, or the Windows checkout), emit the manual command for the human and **WARN**; never silently skip.

| Run | Built-in | Version floor | Manual fallback (WARN) |
| :-- | :-- | :-- | :-- |
| Regression test run (check c) | the **verifier subagent** running `anchor.test_command` / the project test command | — | **`/verify`** (CC ≥ 2.1.145), else the manual test command; acceptance *behavior* stays with the human following the `.human` script |
| Bring the app up for the human script | **`/run`** | CC ≥ 2.1.145 | emit the run command from `anchor` for the human |
| Security review (production) | **`/security-review`** | — | spawn a read-only security sub-agent on the feature diff, or flag "run a manual security pass" |
| Fitness functions (production) | the `fitness/` test command | — | n/a — fitness files are runnable; if the runner is missing that's an env problem, FAIL with the command |

Confirm each referenced built-in actually exists in the target CC version before relying on it; when unsure, fall back and WARN.

## Per-check method

### a. Slice closure (all tiers)
For each slice with `status: published`:
- **Backend terminal** — query every `backend_refs.<backend>`: `bd show <id>` closed · Jira `statusCategory.key == done` · materialized `tickets/<feature>/SLICE-N-*.md` has `## Completion`. This is the **same done-detection `/build` uses**. Disagreement across backends → `BLOCKED-ON-CONFLICT` (list the refs + states).
- **Acceptance satisfied** — the criteria *text + count* come from the canonical `## Acceptance criteria`; *where the ticks live* depends on the backend: tracker-backed → read ticked acceptance from the bead/issue (no writeback exposed → fall back to terminal closure + WARN that per-criterion ticks weren't mirrored); `md`-only → the canonical `- [ ]` must be `- [x]`.
- **Files exist** — every `files:` entry present on disk. Missing → FAIL.
- `status: removed` slices → SKIP (retired).

### b. Coverage matrix (all; depth by tier)
Every PRD **F-ID** (all), **user story** + **NFR** (mvp+), **Unwanted-EARS clause** (prod) maps to ≥1 slice `satisfies_*`. A missing mapping → FAIL (route: F-ID/coverage → `/plan`; stale `satisfies_*` → `/to-issues`). **Inverse check:** every slice's `satisfies_*` resolves to a real PRD entry.

### c. Regression (all; scope by tier)
The "did we break anything *else*?" gate — not just the feature's own tests. Prototype: feature-scoped tests + the smoke script (`npm run smoke` / `make smoke` / `anchor.smoke_command`; none → WARN). mvp+: the **full test suite** — the verifier subagent runs `anchor.test_command` (fallbacks: `/verify`, else the manual command + WARN). Any failure → FAIL with the failing test names + stderr tail.

### d. Spec-drift (mvp+)
Lightweight inline: does each slice's `files`/intent still match `design.md`, and do `satisfies_*` still resolve to current PRD entries? ≥1 contradiction → `SPEC-DRIFT` (write the report capturing it; skip the gate). The deeper doc-vs-doc audit is `/coherence-check` (not built yet) — route there when it exists.

### e. NFR existence + staleness (mvp+)
Each measurable NFR: grep tests/benchmarks for its ID (`NFR-2`) — found → PASS-with-citation; not found → FAIL ("no test references NFR-2"). Staleness: `git log -1 --format=%ct` of the test vs `prd.md`; PRD newer → WARN. `Analysis`/`Demo`-tagged NFRs → SKIP "human verifies" (surface at the gate).

### f. Architecture invariants (mvp+)
List each invariant for the touched components (from `.ai/architecture`). Grep-checkable (e.g. "no SQL outside `repository/`") → run it, PASS/FAIL. Not automatable → SKIP "human verifies". Listing them is the value; don't invent automation for ambiguous ones.

### g. Fitness functions (production)
Run the generated `fitness/` (project scope) + `fitness/<feature>/` (feature scope) via `anchor.test_command` (5-min timeout/function). 0 exit → PASS; non-zero → FAIL. **Absent/empty → `BLOCKED-ON-FITNESS → /to-fitness`** (the bar was never mechanized; nothing to be incomplete against). One scope present, the other empty → run what exists, FAIL the missing scope with the routing note.

### h. Unwanted-behavior defenses (production)
For each Unwanted-EARS `U-N`: the slices with `satisfies_unwanted: [U-N]` must have a test referencing `U-N`. Found → PASS; not → FAIL ("`U-N` claimed satisfied but no test references it").

### i. Security review (production; mvp WARN)
Delegate to **`/security-review`** on the feature diff (or branch). Interpret: high/critical findings → FAIL with the finding + location; medium/low → WARN. Absent built-in → spawn a read-only security sub-agent or flag a manual pass (WARN). mvp: run if cheap, gaps are WARN. Production with `uplift_signals` including `pii`/`money`/`regulatory`: a clean security pass is required (FAIL on high/critical). Also cite the threat register: read `.ai/architecture/threat-model.md` — any `status: open` T-N whose boundary or routed candidate touches this feature's components is a WARN naming the T-N id; a missing threat model at production is itself a WARN ("run /threat-model").

### j. Accessibility (production for a UI surface; mvp WARN)
For a feature with a UI surface: WCAG basics — keyboard navigability, form labels/alt text, colour-contrast, and the error/empty/loading states. Automatable (axe-style lint in the test suite) → run it; else flag the manual checklist for the human script. No UI surface → SKIP "n/a — no UI". Gaps at production → FAIL; at mvp → WARN.

### k. Runbook existence (production; informational)
At production tier, note whether `.ai/runbooks/<feature>.md` exists. Absent → WARN "no incident runbook — `/ship`'s production checklist will ask for one; run `/runbook <feature>` after approval" (never FAIL — the runbook is written at ship time, after this gate). Present → PASS citing the path and its `open_question_count`.
