# .ai/commands/ — Staged Slash-Commands

> **The executable form of [`AI_PROMPTS.md`](../../AI_PROMPTS.md).** Each pattern there is a prompt you paste; each command here is a slash-command you run. They are CRISPY-style ([Guide 01](../../guides/01_agentic-coding.md)): small, staged, **each under ~40 instructions**, with legible checkpoints where re-steering is cheap. This folder is the canonical source; you invoke them from `.claude/commands/` (see **Install**).

## The task-loop pipeline

Run top to bottom, one per task. Each stage reads the previous artifact and writes the next, all under `.ai/plans/<slug>/`. You review at the **bold** checkpoints — `spec`, `design`, `outline` — where changing your mind costs nothing.

| Command | Does | Reads | Writes | Next |
|---|---|---|---|---|
| `/1-align <slug>` | Interviews you to pin the spec (one Q at a time, always a recommendation) | — | **`spec.md`** | `/2-questions` |
| `/2-questions <slug>` | Ticket → 4–8 goal-blind research questions | `spec.md` | `questions.md` | `/3-research` |
| `/3-research <slug>` | Answers them **ticket-blind**, `file:line` only, no recommendations | `questions.md` | `research.md` | `/4-design` |
| `/4-design <slug>` | ~200-line design doc | `spec.md`, `research.md` | **`design.md`** | `/5-outline` |
| `/5-outline <slug>` | Vertical-slice phases, a `TEST:` per phase, a `blocked_by` DAG | `design.md` | **`outline.md`** | `/6-plan` |
| `/6-plan <slug> [phase]` | File-by-file tactical plan for one slice | `outline.md` | `plan.md` | implement → `/7-review` |
| `/7-review <slug>` | Hostile fresh-context review of the diff vs the spec | diff + `spec.md` | — | merge or fix |

**Two boundaries are load-bearing, not stylistic:** `/3-research` runs in a **fresh, ticket-blind session** (spine #1 — facts unbent by a chosen solution), and `/7-review` runs in a **fresh session** (spine #2 — the doer is never the grader).

## The quality utilities

Invoked when the situation arises, not once per task.

| Command | Does | When |
|---|---|---|
| `/eval-judge <dimension + role>` | Builds a five-part LLM-as-judge + a precision/recall validation plan | Grading model output at scale |
| `/skill-router-test <skill or description>` | Tests whether a Skill's description routes correctly, without reading the body | Before shipping a Skill |
| `/extract-skill <transcript/area>` | Mines corrections into a `SKILL.md` of load-bearing lines only | Turning a session into reusable expertise |
| `/incident-to-test <trace/logs>` | Root-causes a failure and writes the failing-then-passing check + a guardrail | Before closing any incident |

## Rules of engagement (every command)

- **Refute, don't reassure.** Praise is not evidence.
- **Cite `file:line`** or quote the exact line — no vague findings.
- **Never invent.** Unknowns become `TODO: <what's owed, by whom, by when>` or `[needs human]`; volatile facts get "verify current".
- **Show evidence, not claims of success.** "It works" without a run is not done.

## Install

These files are the canonical source in `.ai/commands/`. To make them invokable in Claude Code, copy or symlink them into `.claude/commands/` (run from the repo root):

```bash
mkdir -p .claude/commands
# symlink so edits to the canonical source propagate (recommended):
for f in .ai/commands/*.md; do
  [ "$(basename "$f")" = "README.md" ] && continue
  ln -sf "../../$f" ".claude/commands/$(basename "$f")"
done
# …or just copy: cp .ai/commands/[0-9]*-*.md .ai/commands/{eval-judge,skill-router-test,extract-skill,incident-to-test}.md .claude/commands/
```

Then `/1-align my-feature` in Claude Code starts the pipeline. (Legacy `.claude/commands/*.md` files still work; they've been folded into the Skills system, so you can also grow any of these into a full Skill folder later.)

**Arguments:** the pipeline uses a named `slug` argument (`arguments: slug` frontmatter → `$slug`); `/6-plan` also takes an optional `phase`. If a client predates named arguments, `$ARGUMENTS` (the full input string) is the fallback.

*See also: [`AI_PROMPTS.md`](../../AI_PROMPTS.md) (the paste-in originals) · [`PLAYBOOK.md`](../../PLAYBOOK.md) (the never-skip spine) · [`guides/`](../../guides/).*
