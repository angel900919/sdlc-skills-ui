# Enforcing the gate — from advice to a wall

"Instruction without enforcement is a soft constraint." Escalate until the agent *cannot* stop on red.

| Tier | Mechanism | What it buys |
|---|---|---|
| 1 | In-prompt: "run `./verify.sh` after every step" | Advisory; the agent usually complies |
| 2 | A `/goal` condition re-checked after **every turn** | A separate evaluator, not the doer |
| 3 | **Stop hook** blocks turn-end until the script passes | The agent literally cannot stop on red |
| 4 | Adversarial **review subagent** on the final diff | Fresh-context red team before merge (see `/7-review`) |

## Wire it (pick one, ideally both)

**Stop hook** — the agent can't end a turn until the gate is green:
```json
{ "hooks": { "Stop": [ { "command": "bash verify.sh && bash .ai/skills/verify-gate/scripts/slop_check.sh" } ] } }
```

**Pre-commit** — the same gate on the git boundary, so `githooks == CI`:
```bash
# .git/hooks/pre-commit  (chmod +x)
#!/usr/bin/env bash
bash verify.sh && bash .ai/skills/verify-gate/scripts/slop_check.sh
```

Run the identical script in CI so local green == CI green. A gate that only runs in CI is a gate the agent learns to ignore.

## The anti-slop rubric (what `slop_check.sh` can't see)
The script catches mechanical slop (removed assertions, skipped/commented tests). These need a human or an LLM-judge on the diff:
- **Invented APIs / config** — calls to functions or flags that don't exist. Grep the symbol; if it's not defined, it's a hallucination.
- **Narration & filler** — comments restating obvious lines; a plan that says "write a thorough, well-reasoned solution".
- **Volume bragging** — any headline about lines-of-code or hours-unattended. Ban it; report what was *verified* and what was **not**.
- **Tautological tests** — assertions that pass even if the feature is broken. Read the test, not just the checkmark.

## Rules that keep the gate honest
- Keep the **diff cap** and the **forbidden-marker scan** in `verify.sh` regardless of stack — they are language-independent.
- Add each new check **after** you catch the drift it would have prevented, and log *why* it exists.
- If a check is wrong, change it **deliberately and visibly** in its own commit — never silently loosen it to get to green.
