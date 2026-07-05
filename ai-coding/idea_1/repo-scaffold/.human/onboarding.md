# Onboarding

_Zero to productive. If any step here is wrong or missing, fix it in your first PR — onboarding docs
rot fastest._

## 1. Get it running (target: <15 minutes)
```bash
git clone [repo] && cd [repo]
[install cmd]        # e.g. pnpm install
cp .env.example .env # then fill in [which values, from where]
[dev cmd]            # e.g. pnpm dev  → http://localhost:3000
scripts/check        # confirm a clean checkout is green
```

## 2. Understand the shape (target: 30 minutes)
- Read [architecture.md](architecture.md) — components and request lifecycle.
- Skim [adr/](adr/) — the *why* behind the big choices.
- Make your first change: [a concrete good-first-task, e.g. "add a field to the /health endpoint"].

## 3. How we work with AI agents here
This repo is AI-first. The agent's knowledge lives in `.ai/` and it reads `AGENTS.md` first.
- Give every task a runnable check; the Stop hook won't let a turn end until `scripts/check` passes.
- Plan before non-trivial work (`.ai/plans/`, or the `/grill-me` prompt); a human edits the plan — that's the review gate.
- Record decisions in `.ai/decisions/`; keep `.ai/project-state.md` current.
- Protected paths (auth, payments, migrations, tests) need explicit approval — a hook enforces it.

## 4. Who to ask
- Codebase questions: ask the agent ("how does X work? cite files") — it's faster than a human and reads the whole repo.
- Product/decision questions: [person/channel].

## Conventions cheat-sheet
See `.ai/coding-standards.md` for the enforced rules. The short version: small diffs, tests first, no premature abstraction, evidence over claims.
