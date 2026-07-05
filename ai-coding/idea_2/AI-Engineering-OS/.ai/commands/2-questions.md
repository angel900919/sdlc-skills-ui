---
description: Turn an aligned spec into 4–8 objective, goal-blind codebase research questions. Writes .ai/plans/<slug>/questions.md. Run after /1-align, before /3-research.
argument-hint: "[slug]"
arguments: slug
---

# Questions — generate the research targets

Read `.ai/plans/$slug/spec.md`, then produce **4–8 research questions** about how the system works **today**.

- Phrase every question as *"how does X work today"* — **never** *"how should we build Z"*. The goal is to understand reality, not to smuggle in a solution.
- Each question must be **objective** and answerable from the code with `file:line` citations.
- Between them, the questions should cover: where the relevant behaviour currently lives and how it flows · the patterns/conventions this area already follows · what the change will touch and the **invariants that must not break** · what is genuinely unknown and needs a human.
- No solutions, no recommendations, no *"we should"*.

Write the questions as a numbered list to `.ai/plans/$slug/questions.md`. **Do NOT answer them here.**

Then tell me: run `/3-research $slug` **in a fresh, ticket-blind session** so the answers aren't bent to fit a solution.

*Implements the CRISPY `/1-questions` stage. See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md).*
