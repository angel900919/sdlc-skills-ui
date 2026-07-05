---
owner: <tech lead>
updated: 2026-07-05
status: live
---

# Coding Standards — agent-enforced

> **Only what the model's default gets WRONG for THIS repo** — gotchas, not a style-guide reprint
> (Guide 03: *capture gotchas, not coverage*). If a rule can be enforced, move it to a hook/lint and link it here.

## Conventions
- _(example — delete)_ Errors: return `Result<T,E>`; never throw across a module boundary.
- _(example — delete)_ Tests co-locate as `*.spec.ts` beside the source.

## Patterns to follow (copy a reference, don't invent)
- _(example — delete)_ New API route → match the shape of `src/api/projects.ts`.
- _(example — delete)_ New migration → `scripts/new_migration.sh` (never hand-write the header).

## Banned constructs
- _(example — delete)_ No `any` under `src/types/**`.
- _(example — delete)_ No `console.log` / `TODO` / `FIXME` in committed code — **`verify.sh` blocks these.**

## Verification (the gate)
- `verify.sh` = tests + lint + a ~150-line diff cap + a forbidden-marker scan.
- A step is `done` only when `verify.sh` is green. "Wrote the code" is not done.
- Wire it as a Stop hook or pre-commit so it can't be skipped.
