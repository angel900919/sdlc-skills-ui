# Onboarding — productive in a day

> Goal: a new developer (or a new agent's human operator) ships a small PR on day one.

## 0 · Read these first (15 min)
- [`../PLAYBOOK.md`](../PLAYBOOK.md) — how we work with agents here.
- [`../.ai/project-state.md`](../.ai/project-state.md) — what's happening right now.
- [`architecture.md`](architecture.md) — the big picture.

## 1 · Set up (target: &lt;30 min)
```bash
<clone / install / env — the exact commands, kept working>
<how to run the app locally>
<how to run the tests: bash verify.sh>
```
If any step is stale, that's a bug — fix it in this file as your first contribution.

## 2 · Make your first change
1. Grab a `[ ]` item from `../.ai/project-state.md` (Next) tagged small / good-first.
2. Follow the loop in [`../guides/01_agentic-coding.md`](../guides/01_agentic-coding.md): research → plan → implement → `verify.sh` → fresh-context review.
3. Update `../.ai/project-state.md` and open a PR.

## 3 · How we work (the short version)
- The agent reads `.ai/` first and does one vertical slice per turn.
- Nothing is "done" until `verify.sh` is green and a fresh context reviewed it.
- Every failure becomes a permanent check.

## Who owns what
| Area | Owner |
|---|---|
| _(example — delete)_ architecture / conventions | <tech lead> |
| _(example — delete)_ this doc | <whoever onboarded last> |
