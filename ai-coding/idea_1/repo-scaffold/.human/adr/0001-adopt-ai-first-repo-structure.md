# 0001 — Adopt an AI-first repository structure

- **Status:** accepted
- **Date:** [YYYY-MM-DD]
- **Deciders:** [team] · **Decided by agent?** no

## Context
Coding agents do most implementation here, but they are stateless between sessions and can't hold the whole
codebase. Without a durable place for state, standards, and decisions, every session re-explains context and
agents re-propose rejected designs. We also need humans and agents to stay synchronized.

## Decision
We will keep durable knowledge and state in a versioned `.ai/` tree (read via a tiny `AGENTS.md` entry point),
execute harness-native pieces from `.claude/`, and maintain human documentation in `.human/`. The repository —
not the chat session — is the source of truth for "where are we" and "why is it built this way."

## Alternatives considered
- **Keep everything in one big CLAUDE.md** — rejected: it loads whole every request, crowds out working context, and mixes state, standards, and docs.
- **Rely on external tools (issue tracker, wiki, chat history)** — rejected: not in the agent's context, not versioned with the code, drifts from reality.
- **No structure; re-explain each session** — rejected: this is the status quo we're fixing.

## Consequences
- Positive: fresh sessions resume cold; consistent standards without re-instruction; decisions become retrievable precedent.
- Trade-offs: the docs are load-bearing infrastructure with a real maintenance cost (~1–2h/week) and need a doc-drift check.
- Constraints created: agents must read `AGENTS.md` → `.ai/project-state.md` first, keep state current, and record decisions. Enforced by: `AGENTS.md` routing + doc-drift CI.
