---
description: Mine a transcript or PR-review thread for the gotchas the model got wrong, and draft a SKILL.md of only the load-bearing lines. Pass the transcript path or area. Capture gotchas, not coverage.
argument-hint: "[transcript/PR path or area]"
---

# Extract skill — turn corrections into a Skill

Source to mine: **$ARGUMENTS** (a session transcript, or a set of PR review comments) — read it.

- Find **every point where the model's default behaviour was WRONG and a human corrected it** — the landmines its training data doesn't know about. **Ignore everything it already got right.**
- For each gotcha: state it in **one imperative line**, and classify where it belongs — **(a)** a Skill body, **(b)** an enforced rule/lint, or **(c)** `coding-standards.md`.
- Output the **smallest set of load-bearing lines.** No coverage of what the model already knows — a skill of landmines beats a wiki of the obvious.

Then draft a `SKILL.md`:
- A **third-person "what + when" description** — route-testable (check it with `/skill-router-test`).
- A **body of only the must-not-miss rules.** Prefer a **deterministic script** over prose wherever the step is mechanical.

Ship nothing until an **eval shows the skill beats the no-skill baseline.** If it doesn't, delete it — a skill that doesn't move the number is context you pay for every load.

*Implements spine item #6 (capture gotchas as Skills). See [`guides/03_agent-skills.md`](../../guides/03_agent-skills.md).*
