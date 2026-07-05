# Troubleshooting

_Symptom → likely cause → fix, for the failures people (and agents) actually hit. Add a row every time
you debug something that wasn't obvious. Cross-reference `.ai/memory/` for agent-facing gotchas._

## Setup & local dev
| Symptom | Likely cause | Fix |
|---|---|---|
| `[error on install]` | [cause] | [fix] |
| Dev server won't start on :3000 | Port in use | `[kill/port cmd]` |
| `scripts/check` fails on a clean clone | [missing env / wrong node version] | [fix; pin the version] |

## Tests
| Symptom | Likely cause | Fix |
|---|---|---|
| Flaky test | Ordering/timing/randomness dependence | Seed randomness; remove wall-clock asserts; auto-quarantine at the merge queue |
| Test passes but shouldn't | Tautology / mocked subject / asserts implementation not spec | Run the 6-point review in `.ai/checklists/code-review.md`; prove it can fail |

## Runtime / production
| Symptom | Likely cause | Fix |
|---|---|---|
| Agent "did X" but X didn't happen | Success gated on `attempted`, not `verified` | Read-after-write against the system of record; see AIOps guide |
| "I searched the web" but data is wrong | Silent fetch failure (CAPTCHA/decoy) | Classify responses OK/EMPTY/BLOCKED/DECOY before trusting |
| `[500 on endpoint]` | [cause] | [fix] — see runbook `[runbooks/...]` |

## When you can't reproduce it
Production agent failures are often non-deterministic. If record/replay is set up (AIOps guide), replay the
recorded trace; otherwise capture the full envelope (model version, params, inputs) next time — you can't
retroactively record a run that already finished.
