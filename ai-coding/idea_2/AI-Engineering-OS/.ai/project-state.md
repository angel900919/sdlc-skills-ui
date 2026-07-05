---
owner: <name>
updated: 2026-07-05
status: live
---

# Project State

> **The first thing every session reads.** Keep it CURRENT — update at the end of every task.
> Terse; if a human needs the story, link to `../.human/`. Status grammar: `[ ] todo · [~] in-progress · [x] done (verify-green) · [!] blocked`.

## Now — this week's focus
- <the one outcome we're driving toward — not a feature name, an outcome>

## In progress
| Task | Owner | Status | Verify target | Notes |
|---|---|---|---|---|
| _(example — delete)_ Archive mutation | ai+me | `[~]` | `tests/projects.spec.ts::archive` | slice 2 of 3 |

## Next — ready & unblocked
- [ ] _(example — delete)_ Wire archive button in UI — `blocked_by: none`

## Blocked
- [!] _(example — delete)_ Billing webhook — waiting on vendor sandbox key

## Recently done (last ~10, newest first)
- [x] _(example — delete)_ 2026-07-05 · archive mutation slice 1 · `verify.sh` green

## Known issues / landmines
- _(example — delete)_ `auth/` session refresh is racy under load → `../.human/troubleshooting.md#auth-race`

## Session hand-off
> Written before you stop, so the next session starts warm — not cold.
- **Last did:** <what just landed>
- **Next do:** <the single next step>
- **Watch out:** <the trap the next session would otherwise hit>
- **Open first:** <files/dirs to load before anything else>
