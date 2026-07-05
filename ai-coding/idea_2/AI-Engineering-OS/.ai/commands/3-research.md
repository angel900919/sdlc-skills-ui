---
description: Answer the research questions goal-blind, with file:line citations only — no recommendations. Writes .ai/plans/<slug>/research.md. Run in a FRESH session that has NOT seen the ticket.
argument-hint: "[slug]"
arguments: slug
---

# Research — goal-blind, facts only

You are **researching, not solving.** Do NOT propose a solution, a plan, or *"we should"*.

- Read **only** `.ai/plans/$slug/questions.md`. Do **not** read `spec.md` or the ticket — stay goal-blind so the facts aren't bent to a solution the agent already picked.
- Answer each question about how the system works **today**. Every factual claim carries a `file:line` citation. If you are inferring rather than reading the code, say so explicitly.
- Report **facts only**. Mark each genuine unknown `[needs human]` — never guess to look complete.

Write `.ai/plans/$slug/research.md` (~200 lines max) with sections:
**Current state** (how it works today, cited) / **Patterns to follow** (`file:line`) / **What this touches + invariants** / **Open questions** `[needs human]`.

Then tell me: review `research.md`, then run `/4-design $slug`.

*Implements spine item #1 (goal-blind research) + the CRISPY `/2-research` stage. See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md).*
