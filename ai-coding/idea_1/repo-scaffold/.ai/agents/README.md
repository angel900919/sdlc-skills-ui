# Subagents (authoring source)

Subagents run in a **fresh, isolated context** and return only a summary — the cheapest fix for context
rot and the right tool for independent verification. **Execution:** Claude Code discovers subagents under
`.claude/agents/*.md`; keep the real file there or symlink from here.

## When to use a subagent (vs. a skill or the main loop)
- **Isolation:** heavy exploration or verification that would pollute the main context.
- **Independence:** a reviewer that must NOT be biased toward code it just wrote → give it a fresh context and read-only tools.
- Not for sequential judgment work the main agent should hold — that's a skill or just the loop.

## Authoring notes
- Restrict `tools:` to the minimum (read-only for reviewers/verifiers).
- Set `model:` deliberately — a cheaper model for research/review workers.
- Give it one job and a structured return format.

See `verifier.md` — a default-FAIL verification subagent.
