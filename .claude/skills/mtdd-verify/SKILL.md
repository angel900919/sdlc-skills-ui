---
name: mtdd-verify
description: |-
  Manual-TDD verify phase — runs typecheck and tests via the read-only verifier subagent, then emits the manual smoke checklist. Invoked by name (/mtdd-verify) or by the mtdd-cycle orchestrator.
allowed-tools:
  - Read
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
---

# mtdd-verify — manual TDD verify phase

You are running the **verify phase** of a manual TDD loop. The review phase approved the diff; your job is to confirm the build is green before merging.

## Inputs

- A task identifier — a `tasks/<slug>.md` file (free-form core), a bead ID, or a canonical ticket. **Resolve the task source** — see [`../_build_share/task-sources.md`](../_build_share/task-sources.md).
- The current git state — you should already be on the feature branch.

If no task identifier was provided, ask the user.

## Procedure

### 1. Read the task

Resolve the task source per [`../_build_share/task-sources.md` § Picking the source](../_build_share/task-sources.md#picking-the-source). For beads read via `bd show <id>` (prefer `--json`); for file sources read the file. Extract:

- `skip_tests` — beads / canonical `tests == "skip-tests"` OR free-form `## Skip tests?: true`. Default `false`.
- `target_branch` — **prefer the branch's stamp**: `git config branch.$(git rev-parse --abbrev-ref HEAD).mtdd-target` (set by `/mtdd-implement`). If empty, fall back to beads / canonical `target_branch:` OR free-form `## Target branch`, then `develop`. Used for log entries; verify itself runs on the current branch.
- **Beads / canonical only:** `language:` field — used in step 3 to pick the toolchain when the project's command isn't obvious.
- **Beads only:** `bead_id` = the argument.
- `acceptance_criteria` — the task's `## Acceptance criteria` checkbox list (same shape across all three modes). Used in step 6 to build the manual smoke list.

### 2. Confirm branch state

- `git rev-parse --abbrev-ref HEAD` — must be on a `feature/*` branch.
- `git status --porcelain` — must be clean (no uncommitted changes). If dirty, **stop and ask** the user — verifying a dirty tree is meaningless.

### 2.5. Delegate the runs to the verifier subagent

The commands of steps 3–4 are **run by the `verifier` subagent**, not by you — a
fresh, read-only context (no Edit/Write) cannot fix-and-pass or rationalize a
failure it half-remembers causing. Resolve the commands per steps 3–4's precedence
rules first (asking the user where those rules say to), then launch ONE `verifier`
agent (seeded at `.claude/agents/verifier.md`; `/mtdd-init --write` copies it from
`_build_share/agents/verifier.md`). The delegation prompt names: the task source
(file path or bead id), `skip_tests`, and the resolved typecheck + test commands.
It returns exit codes, counts, and failure output — the **On failure** blocks in
steps 3–4 are yours to act on from that report.

**Fallback (degraded).** If the launch fails because the `verifier` agent type is
unknown, say so and run steps 3–4 in-context this run — same commands, same rules,
but same-context grading; name the degradation in your hand-off. Diagnose first:
**not seeded** (`.claude/agents/verifier.md` absent) → point the user at
`/mtdd-init --write`; **seeded but not registered** (file present, type still
unknown) → the registry snapshots at session start, so a seed written this session
takes effect only next session — tell them to **restart** (re-running
`/mtdd-init --write` won't help this run). Under `/mtdd-cycle` the phase already runs inside a subagent and the
Agent tool is unavailable there (agents can't nest) — that phase context is itself
fresh, so run steps 3–4 directly and name the degradation as "phase-isolated,
tool-unrestricted" instead.

### 3. Run typecheck

Determine the project's typecheck command (the verifier runs it — step 2.5). Pick by precedence:

0. **Project config** — if `.mtdd/config` (written by `/mtdd-init`) defines a non-empty `mtdd_typecheck_cmd`, use it verbatim. This is the settled answer; the steps below are the fallback when no config exists.
1. **Project script** — if `package.json` defines `typecheck`, use `npm run typecheck` (or pnpm/yarn analog). Same for `pyproject.toml` / `Makefile` targets.
2. **`language` hint** — when no project script exists, default to the toolchain for the declared language (`.mtdd/config` `mtdd_language`, else canonical frontmatter `language:`):
   - `typescript` → `tsc --noEmit`
   - `python` → `mypy .` (fall back to `pyright` if mypy not installed)
   - `go` → `go vet ./...`
   - `rust` → `cargo check`
3. **Fallback** — sniff the project (manifest files at root). Same table as above.

If you still can't determine the command, **ask the user** which to run. Don't guess silently.

**On failure:**

- Surface the full typecheck output to the user.
- Record per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations):
  - Beads: `bd note <bead-id> -- "verify: FAILED (typecheck) — <one-line summary of the first error>"`
  - Canonical / free-form: append `- verify: FAILED (typecheck) — <summary>` to the task file's `## Status log` (create the section in canonical mode if missing).
- Tell the user: "verify failed on typecheck — re-run `/mtdd-implement <task>` to fix. Paste the typecheck output so the next cycle addresses it."
- **STOP.** Do not run the test command.

### 4. Run tests (skip if `skip_tests` is true)

If `skip_tests` is true (canonical `tests: skip-tests` OR free-form `Skip tests?: true`), log `"skipping test command (skip_tests=true)"` — and in canonical mode also surface `skip_tests_reason` for the user's record — then proceed to step 5.

Otherwise, determine the project's test command (the verifier runs it — step 2.5). Prefer `.mtdd/config` `mtdd_test_cmd` (written by `/mtdd-init`) when it's set and non-empty; otherwise pick by common shape:

- TypeScript / Node: `npm run test` (or `npx vitest run` / `npx jest`)
- Python: `pytest`
- Go: `go test ./...`
- Rust: `cargo test`

**On failure:**

- Surface the failing test output to the user (the failing assertions are the source of truth).
- Record per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations):
  - Beads: `bd note <bead-id> -- "verify: FAILED (tests) — <N failed of M, one-line summary of first failure>"`
  - Canonical / free-form: append `- verify: FAILED (tests) — <summary>` to the task file's `## Status log`.
- Tell the user: "verify failed on tests — re-run `/mtdd-implement <task>` to fix. Paste the failing test output."
- **STOP.** Do not proceed to merge.

### 5. On success

Both commands passed (or test was skipped per `Skip tests?`).

Record per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations):

- **Beads:** `bd note <bead-id> -- "verify: PASSED (typecheck + tests | typecheck-only)"`
- **Canonical / free-form:** append `- verify: PASSED (typecheck + tests | typecheck-only)` to the task file's `## Status log`.

Then continue to step 6 (don't tell the user to merge yet — the smoke list comes first).

### 6. Emit the manual smoke checklist (on success only)

A green build proves the code *compiles and the automated tests pass* — it does **not** prove a human can drive the slice and watch it behave. Before handing off to merge, give the user a short manual smoke list to run against the slice on this branch. (Generate it even when `skip_tests` is true — manual smoke is independent of the automated test gate.)

**Derive it from the behavioural acceptance criteria only.** Walk the task's `## Acceptance criteria` and keep the criteria a person can *observe by exercising the running system*:

- **Keep** — behavioural ("does X when Y"), value ("returns 4 for input 2", when reachable from a UI / CLI / endpoint), edge cases ("rejects empty input").
- **Drop** — the criteria the automated phases already own and a human can't usefully eyeball: structural ("file X exists"), signature ("exports `foo(x: number)`"), and build gates ("typecheck / test passes").

If, after that filter, the slice has **no human-observable surface** (a pure internal refactor, a tracer-bullet wiring slice with no UI / endpoint yet, a config-only change), say exactly that in one line and skip the list — don't invent steps. That itself is useful information.

Otherwise print, in chat, under `## Manual smoke — slice <N> (run before merge)`:

- **Setup** — one line on how to bring the slice up on this branch (the run / launch command, the endpoint, the screen). Pull it from the task's `## What to build` / `files:` context; if you genuinely can't tell, say so and ask.
- A numbered list, one line per kept criterion: `<action the user takes> → <expected observable result>`. Phrase the action as something they *do* (click, curl, run, type) and the expectation as something they *see*.

Keep it to the criteria — this is a smoke pass ("does the thing this slice promised visibly work"), not an exhaustive QA script. **You do not run it** — you have no running system; it's for the human.

Log a one-line marker per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations):

- **Beads:** `bd note <bead-id> -- "verify: smoke checklist emitted (<K> steps | no observable surface)"`
- **Canonical / free-form:** append `- verify: smoke checklist emitted (<K> steps | no observable surface)` to `## Status log`.

Then tell the user: "verify passed — run the smoke list above, then `/mtdd-merge <task>`."

## Hand-off

One short paragraph:

- What ran (typecheck, tests-or-skipped).
- Pass/fail result.
- On pass: the manual smoke checklist (step 6) to run before merging.
- Next step (`/mtdd-merge @<task-file>` if pass, `/mtdd-implement @<task-file>` if fail).

Do not summarise the test *output* if everything passed — silence is fine there. The smoke checklist is the one thing you always surface on a pass.

<!-- Behavioral guardrails below adapted from obra/superpowers (MIT), verification-before-completion. -->

## The verification Iron Law

`NO PASSED VERDICT WITHOUT FRESH OUTPUT FROM THIS RUN.`

Before writing any `verify: PASSED` line or telling the user the build is green:

1. **Identify** the command that proves the claim (steps 3–4 above).
2. **Have the verifier run it now** (step 2.5) — or run it yourself only in the
   degraded fallback — in full, in the foreground. This run, not a remembered one.
3. **Read** the verifier's report: complete output and exit code, failures counted.
4. Only then state the verdict — **with** the evidence (exit code, N passed / M failed).

What is **not** evidence: a previous session's run · the implement phase's claim
that "tests pass" · a green partial run ("the file I touched passes") · linter or
typecheck output standing in for the test suite · any sentence containing
*should*, *probably*, or *seems to*. If you catch yourself about to write one of
those words next to a verdict — stop, run the command, read the output. A claim
you didn't verify in this run is a **FAILED** verify with extra steps: it sends
the user into `/mtdd-merge` on faith.

## Rules

- Run each command directly (foreground). Do **NOT** background them — you need exit codes.
- If a command needs an obvious arg the user didn't mention (e.g., test pattern), prefer the unfiltered form (`npm run test`, not `npm run test -- --grep …`).
- Do **NOT** edit code on this phase. Verify only runs commands; fixes belong to the implement phase.
- Do **NOT** re-run a failing command to "see if it's flaky" without telling the user first.
- When appending to `## Status log`: in canonical mode the section may not exist — create it at the end of the file (above any trailing whitespace) if missing.
