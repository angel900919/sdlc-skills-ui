---
name: update-project-state
description: Update .ai/project-state.md after finishing a unit of work — move the task to Done,
  refresh Now/Next, and note any new open question. Use when a task, feature, fix, or PR is
  completed, or when the user says "update state", "mark this done", or "wrap up".
disable-model-invocation: false
allowed-tools: Read Edit Bash(git log:*)
---

# Update project state

## Recent commits (auto-injected — do not re-derive)
!`git log --oneline -5`

## Steps
1. Read `.ai/project-state.md`.
2. Move the completed task from **Now** to **Done** (newest first) with today's date and the PR/commit.
3. If a follow-up emerged, add it to **Next** with a one-line "why now."
4. If a decision was made, ensure it's recorded in `.ai/decisions/` and reference it.
5. If anything needs a human call, add it under **Open questions for humans**.
6. Keep **Done** to ~10 entries; older ones live in git history.

## Rules
- Only edit `.ai/project-state.md` — do not touch code from this skill.
- Base the update on the actual commits above, not on memory of what you intended to do.

## Maintaining this skill
If the state format changes, update this skill and the `project-state.md` template together.
