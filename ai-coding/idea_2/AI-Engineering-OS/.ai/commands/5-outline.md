---
description: "Turn the approved design into a ~2-page vertical-slice phase outline, each phase with a TEST line. Writes .ai/plans/<slug>/outline.md. Vertical slices only — reject horizontal layers."
argument-hint: "[slug]"
arguments: slug
---

# Outline — vertical slices with a test per phase

Read `.ai/plans/$slug/design.md`. Break the work into an ordered set of **vertical slices** — "the C header files of the work", ~2 pages, no code.

- Each slice crosses **every layer end-to-end** and is testable on its own. **Reject** any phase that is a single horizontal layer (e.g. "all the models", "all the routes") with nothing testable at the end — restructure it.
- Order the phases so **slice 1 is a working tracer bullet**; each later slice adds one thin, shippable increment.
- For **every** phase give:
  - a one-line **goal**,
  - a **`TEST:`** line naming the exact check that proves it — the verification target,
  - a tag: `afk` (agent can run it unattended) or `human-in-the-loop`,
  - `blocked_by:` — the phases it depends on (the dependency DAG).

Write `.ai/plans/$slug/outline.md`. Then tell me: approve the slicing, then run `/6-plan $slug` for the first slice.

*Implements the CRISPY `/4-outline` stage; enforces spine item #1 (a verification target per slice). See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md).*
