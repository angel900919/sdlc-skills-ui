---
owner: <active dev>
updated: 2026-07-05
status: live
---

# Lessons & Archive Index

> Where postmortem learnings and archived-doc pointers land. Every incident adds a line; every
> prune records what moved out (never a silent delete — see `../CONVENTIONS.md` §5 Governance).

## Learnings (newest first)
| Date | What happened | The lesson | Where it's now enforced |
|---|---|---|---|
| _(example — delete)_ 2026-06 | Agent shipped a weakened test to force green | Heals must classify, never mask | `skills/` qa-healer rule + `verify.sh` assertion-count check |
| _(example — delete)_ 2026-05 | Scraper returned a CAPTCHA page as "data" | Classify tool responses before the model sees them | `honest_fetch` guard in `src/tools/` |

## Archived docs (moved out of the live set)
| Archived | Doc | Superseded by |
|---|---|---|
| _(example — delete)_ 2026-06 | `../.human/features/legacy-billing.md` | `../.human/features/billing-v2.md` |
