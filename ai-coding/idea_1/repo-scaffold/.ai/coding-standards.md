# Coding Standards & Conventions

_Every rule names how it is enforced. Prose-only rules are advisory and decay as context fills —
prefer a hook or CI gate. This file is the "what"; `.claude/settings.json` and `scripts/check`
are the "enforce."_

## Commands (the ground truth)
- Test: `[cmd]` — prefer running single tests during development
- Lint + fix: `[cmd]`
- Typecheck: `[cmd]`
- One check to rule them all (hooks and CI both call this): `scripts/check`

## Language & style
- [Use ES modules / named exports / 2-space indent — one line per real convention.] — enforced by: [eslint + prettier, PostToolUse hook]
- [No `any` / no non-null assertions.] — enforced by: [eslint rule + CI]
- Delegate all formatting to tooling; do not hand-police style in prose.

## Architecture rules
- **Prefer repetition over premature abstraction.** Do NOT extract a shared helper/component until the same shape appears 3+ times AND a human asks. Good enough beats clever. — enforced by: review
- Respect the layer invariants in `.ai/architecture.md`. — enforced by: [import-linter, named after the ADR it implements]
- Follow existing patterns: read 2–3 nearby files first and match them; your code should be indistinguishable from the team's. — enforced by: review

## Testing
- **TDD, tamper-proof:** write the failing test → **commit it** → implement without modifying tests. If a test seems wrong, stop and ask. — enforced by: [tdd hook + CI check that tests are unchanged between the test commit and the fix]
- Gate on **mutation score**, not line coverage. — enforced by: [CI mutation run on changed files]
- No dependence on iteration order, no wall-clock assertions, seed all randomness. — enforced by: review + lint

## Anti-slop rules
- Solve only the asked problem. No "just in case" abstractions, config options, or features not requested (YAGNI).
- No filler/narrating comments; comment only to state a constraint the code can't show.
- State what you did NOT verify. Smallest change that works.
- No invented APIs — verify a symbol exists before calling it. — enforced by: [typecheck + review]

## Protected paths (never edit without explicit human approval)
- `[auth/, payments/, migrations/, tests/** (during green phase)]` — enforced by: **PreToolUse hook** (deny with explanatory message)

## Commit & PR conventions
- Commit messages state which failure/requirement the change addresses, not "fixed stuff."
- One logical change per commit; keep diffs small and reviewable (~<150 lines/step for agents).
