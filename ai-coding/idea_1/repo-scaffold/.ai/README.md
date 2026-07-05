# .ai/ — Knowledge & State for AI Agents

This folder is the project's durable brain: everything an agent must know or remember that isn't obvious from the code. It is **portable** (works with any harness — Claude Code, Codex, Cursor) and **versioned** (every change is reviewable in git).

## The routing rule
Agents read, in order: the root `AGENTS.md` → `project-state.md` → `architecture.md` → `coding-standards.md`, then only the deeper file their task needs. Don't load everything; load on demand.

## What's here
| Path | Purpose | Who updates it |
|---|---|---|
| `project-state.md` | **[Required]** Done / in progress / next — cold-start resume. | Agents, every session |
| `architecture.md` | **[Required]** Agent-facing components, boundaries, invariants. | Whoever changes a boundary |
| `coding-standards.md` | **[Required]** Conventions, each tied to enforcement. | Humans (agents propose) |
| `workflow-rules.md` | How agents work here: the loop, rigor rubric, escalation. | Humans |
| `decisions/` | Decision log: dated Chose / Why / Rejected. | Agents propose, humans accept |
| `plans/` | One implementation plan per unit of work. | Whoever starts the work |
| `memory/` | `MEMORY.md` index + on-demand topic files of learned facts. | Agents (pruned monthly) |
| `checklists/` | Reusable gates (pre-PR, code-review). | Humans |
| `prompts/` | Reusable prompt templates. | Anyone |
| `skills/`, `agents/`, `hooks/` | Authoring source for harness-executable pieces. | See each folder's README |

## The one discipline that keeps this useful
**Codify on the third explanation.** Anything you've told the agent twice becomes a file here. Anything an agent gets wrong twice becomes a rule or a hook. Prune what stops being true — stale docs actively mislead agents, which trust documentation absolutely.
