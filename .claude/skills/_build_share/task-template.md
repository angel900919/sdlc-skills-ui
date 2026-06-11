# <task title>

> **Free-form mode template** — for **one-off, ad-hoc work outside the SDLC chain**. Copy this template, fill it out, save as `tasks/<slug>.md`, then drive the loop with the four `mtdd-*` skills.
>
> **For chain HITL slices, do NOT use this template.** Run `/publish-issues <feature> --backend=md` instead — it materializes canonical chain tickets at `tickets/<feature>/SLICE-N-<slug>.md` with full traceability (F-IDs, NFRs, files list, depends_on). The four `mtdd-*` skills accept that shape directly. See [`task-sources.md`](task-sources.md) for the task-source contract (this free-form template is the core source; beads and canonical are the adapters).

## Context

<1–3 paragraphs of background. Why does this work need to happen? What problem does it solve? Anything the agent must know that isn't visible in the code.>

## Goal

<One sentence: the outcome when this task is done.>

## Acceptance criteria

> One checkbox per criterion. Be **specific and verifiable** — vague criteria produce vague work. The review phase will tick each one against the diff, and the verify phase will run typecheck + tests.
>
> **Test for "specific enough":** can you write it as a shell command that exits 0 / non-0, or as a precise behavioural assertion (input → output)? If not, rewrite. If a criterion can't be expressed that way, it's not a pass criterion — it's a hope.
>
> | Vague (rewrite) | Deterministic (accept) |
> | :--- | :--- |
> | "Tests pass" | "`pytest tests/auth/test_oauth.py -v` exits 0 with `test_refresh_rotation` passing" |
> | "Code is clean" | "`ruff check src/auth/` exits 0; no new `# noqa` added" |
> | "Works correctly" | "`POST /auth/refresh` with expired access + valid refresh returns 200 + new pair; second use of same refresh returns 401" |
> | "No regressions" | "Full `pytest` exits 0; `test_login_flow` still passes" |
> | "Looks good" | "Manual: open `/dashboard`, click 'Export CSV', file downloads with header `id,name,score`" |

- [ ] <Structural: "File `src/foo.ts` exists and exports `foo(x: number): number`">
- [ ] <Behavioural: "`foo(2)` returns `4`">
- [ ] <Edge case: "`foo(0)` throws `InvalidInputError`">
- [ ] <Test coverage: "Test file `src/foo.test.ts` covers the three cases above">
- [ ] <your project's typecheck passes — e.g. `npm run typecheck`, `mypy .`, `go vet ./...`, `cargo check`>
- [ ] <your project's tests pass — e.g. `npm test`, `pytest`, `go test ./...`, `cargo test`>

## Out of scope

<Bullet list of things the agent must NOT touch on this task. Examples: "don't refactor the auth module", "don't bump dependencies", "no UI changes".>

## Target branch

`develop` <!-- or main / master / your default. The merge phase merges INTO this. -->

## Skip tests?

`false` <!-- set to `true` ONLY for trivial config/docs/one-line changes. When true, the implement phase skips TDD discipline and verify only runs typecheck. -->

---

## Status log

<!-- The implement / review / verify / merge skills append one line each. Don't pre-fill. -->

## Completion

<!-- The merge skill writes the final summary here. Don't pre-fill. -->
