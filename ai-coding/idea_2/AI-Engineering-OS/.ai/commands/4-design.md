---
description: Write the ~200-line design doc from the research — Current state / Desired end state / Patterns to follow / Open questions. Writes .ai/plans/<slug>/design.md. The cheapest place to re-steer.
argument-hint: "[slug]"
arguments: slug
---

# Design — the ~200-line destination doc

Read `.ai/plans/$slug/spec.md` and `.ai/plans/$slug/research.md`. Write a **~200-line design doc — no code yet.**

Sections:
- **Current state** — from the research, every claim cited `file:line`.
- **Desired end state** — what "done" looks like, tied to the spec's success criteria.
- **Patterns to follow** — the existing seams/conventions to imitate, cited `file:line`.
- **Key decisions & trade-offs** — the choices and why; note the ones that are one-way doors.
- **Open questions** — each `[needs human]` or a `TODO: <owed, by whom>`. Never invent.

Constraints:
- Prefer the **smallest change** that satisfies the spec. Call out anything you're tempted to over-build and **defer it** with a one-line reason.
- If the research left a load-bearing question open, stop and flag it rather than designing over a guess.

Write `.ai/plans/$slug/design.md`, then **stop.** This is the cheapest place for me to change my mind — ask me to approve before `/5-outline $slug`.

*Implements the CRISPY `/3-design` stage. See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md).*
