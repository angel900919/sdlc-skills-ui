# Feature: <name>

> One narrative doc per feature. Copy this file to `features/<slug>.md`. Purpose: let a human
> (or an agent's operator) understand what this feature is, how it works, and where its traps are.

- **Status:** live / building / deprecated   **Owner:** <name>   **Updated:** YYYY-MM-DD

## What & why
<What the user can now do, and the problem it solves — 2–3 sentences, outcome-first.>

## User-facing behaviour
<The happy path, and what the user sees when it fails.>

## How it works
<The mechanism, at a level a new dev can follow. Link the key modules.>

| Piece | Where |
|---|---|
| _(example — delete)_ entry point | `src/...` |
| _(example — delete)_ core logic | `src/...` |

## Gotchas / landmines
- <the non-obvious thing that will bite someone; mirror the load-bearing ones into `../../.ai/coding-standards.md`>

## Links
- Decision(s): `../adr/NNNN-*.md` · Trace: `../../.ai/decisions/NNNN-*.md`
- Tests: `<path>` · Runbook: `../runbooks/<name>.md`
