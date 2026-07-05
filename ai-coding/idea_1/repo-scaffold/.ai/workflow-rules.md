# Workflow Rules — How Agents Work in This Repo

_The operating contract. Loaded when an agent needs to know "how," not "what."_

## The loop (every unit of work)
1. **Orient:** read `project-state.md` → the routed docs for your task.
2. **Explore** in plan mode (read-only), or delegate exploration to a subagent that returns a summary.
3. **Plan at the right rigor** (see rubric below). Write/edit the plan file; a human edits it — that edit is the review gate.
4. **Code against a target:** never "implement X" without a check. TDD where testable.
5. **Verify with evidence:** run the check, show the output. A default-FAIL verifier subagent for anything non-trivial.
6. **Commit + update state:** descriptive commit, update `project-state.md`, record any decision.
7. **Fold back:** drift → a rule; third explanation → a doc; good session → a skill.

## Rigor rubric (match effort to blast radius)
| Change | Process |
|---|---|
| Throwaway script / prototype | Just prompt. No ceremony. |
| Small, scoped, well-understood | Plan-file: 1–2 page `plans/` doc, human-edited, then implement. |
| Complex / multi-session / multi-dev / regulated | Full spec pipeline: requirements (EARS) → design → tasks, human gate per phase. |

## When blocked
- Missing a decision? Add it to `project-state.md` "Open questions for humans" and stop — don't guess on anything with real blast radius.
- Ambiguous requirement? Ask, or interview-to-spec; don't build all interpretations.
- Failing twice on the same fix? `/clear` and restart with a better prompt; don't argue with a polluted context.

## Autonomy & safety
- Reversible + low blast radius → proceed. Irreversible or protected-path → propose and wait for approval.
- Never combine private data access + untrusted content + open network egress in one context.
- Escalation is a valid outcome, not a failure.

## Verification ladder (escalate with autonomy)
prompt-level check → `/goal` condition → Stop hook gate → fresh-context verifier subagent.
