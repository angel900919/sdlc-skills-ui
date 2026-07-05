---
description: Interview me to pin down a feature spec before any code — one question at a time, always with your recommendation. Writes .ai/plans/<slug>/spec.md. Use at the very start of a task, before research or planning.
argument-hint: "[slug]"
arguments: slug
---

# Align — spec red-team ("grill me")

You are red-teaming my spec, **not** building it. Do NOT write code or a plan yet.

- Interview me to pin down the change for `$slug`. **One question at a time.** With each question, offer your own recommended answer and say why.
- Cover, in roughly this order: the actual **user problem** (not the solution) · **success criteria** (how we'll know it works) · **scope + explicit out-of-scope** · the **failure / edge behaviour** · which existing **modules/files** this touches · the **verification target** (the test, build, or screenshot that will prove it done).
- **Refute, don't reassure.** If my framing is confused or the solution is bigger than the problem, say so.
- When I don't know, record `TODO: <what's owed, by whom, by when>`. Never invent domain facts to fill the gap.

When we're aligned, **stop and confirm before writing.** Then write `.ai/plans/$slug/spec.md` with these sections:
**Problem** / **Solution** / **User stories** / **Success criteria** (name the verification target) / **Implementation decisions** / **Testing decisions** / **Out-of-scope** / **Open questions** (the TODOs).

Then tell me: review `spec.md`, and when it's right run `/2-questions $slug`.

*Implements spine item #7 (upstream alignment). See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md).*
