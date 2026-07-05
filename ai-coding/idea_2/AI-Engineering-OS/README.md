# AI-Engineering-OS — The AI Engineering Operating System

**One repository operating system that lets AI agents and human developers work the same codebase with shared knowledge and minimal context loss — across the whole build lifecycle.** Where [`PM_SE`](../PM_SE/) governs *what to build and whether it's any good* (lifecycle, gates, ship-bar), AI-Engineering-OS governs *how to build it with agents*: the daily workflow, the context substrate, reusable skills, agent architecture, and the quality/operations loop.

The design rule, inherited from PM_SE: **keep every artifact an agent or a human must read to act correctly; drop everything that only informs.**

## The five disciplines

Five consolidated guides, each ending in a Folder Playbook. Read them in order — they build on each other.

| # | Guide | The one thing it teaches |
|---|---|---|
| 01 | [Agentic Coding](guides/01_agentic-coding.md) | The daily loop research → plan → implement → verify → review — **always give a verification target** |
| 02 | [Context Engineering](guides/02_context-engineering.md) | The window is a **budget** — curate what the model sees, externalize what must survive |
| 03 | [Agent Skills](guides/03_agent-skills.md) | Package expertise as folders — **capture gotchas, not coverage** |
| 04 | [AI Agents](guides/04_ai-agents.md) | **Engineer the harness, not the prompt** — single-agent-first |
| 05 | [Quality & Operations](guides/05_quality-and-operations.md) | Quality is a **loop** — every failure becomes a permanent check |

## The two audiences

The repo carries two parallel doc trees, deliberately separated by altitude:

- **[`.ai/`](.ai/) — the memory system for agents.** Terse, high-signal, machine-first. A fresh agent session reads it and immediately knows current status, architecture, conventions, active work, and known issues. *This is what stops you re-prompting the same context every session.*
- **[`.human/`](.human/) — docs for people.** Architecture with Mermaid diagrams, onboarding, feature docs, ADRs, troubleshooting, runbooks. Narrative-first, plain English.

Same facts, two altitudes. The [governance model](CONVENTIONS.md) keeps them in sync.

## Quick start (adopt in 5 steps)

1. **Copy the scaffold** — `.ai/`, `.human/`, and the four spine files (this README, `PLAYBOOK.md`, `CONVENTIONS.md`, `AI_PROMPTS.md`) into your repo; drop `AGENTS.md` + `verify.sh` at the root.
2. **Fill the memory system** — populate the three required files: `.ai/project-state.md`, `.ai/architecture.md`, `.ai/coding-standards.md`. A fresh session must be able to read these and start.
3. **Adopt the daily practices** — open [`PLAYBOOK.md`](PLAYBOOK.md) and work the prioritized practice list top to bottom.
4. **Wire the verification gate** — a `verify.sh` (tests + lint + diff cap + forbidden-marker scan) installed as a Stop hook or pre-commit (Guide 01).
5. **Run the loop, and feed it back** — every task updates `project-state.md`; every failure becomes a permanent check; every recurring correction becomes a Skill or a rule.

## What's inside

| Path | What it is |
|---|---|
| [`guides/`](guides/) | The five consolidated discipline guides — the "why" and "how" |
| [`PLAYBOOK.md`](PLAYBOOK.md) | The **Master Playbook** — prioritized daily practices + the repo-structure definition |
| [`CONVENTIONS.md`](CONVENTIONS.md) | The **contract** — file conventions, the memory-system rules, versioning, and **governance** |
| [`AI_PROMPTS.md`](AI_PROMPTS.md) | Reusable prompt patterns distilled from the guides |
| [`.ai/`](.ai/) | The agent **memory system** (required: project-state, architecture, coding-standards; optional harness + knowledge) |
| [`.human/`](.human/) | Human documentation (architecture, onboarding, ADRs, runbooks) |
| [`templates/`](templates/) | Copy-paste starters for every file above |

## How this relates to PM_SE

PM_SE and AI-Engineering-OS are **sibling operating systems** sharing one house style. PM_SE answers *should we build this, and is it good?* AI-Engineering-OS answers *how do we build it with agents?* A real product run uses both at once: **PM_SE gates the product; AI-Engineering-OS runs the build.** When the two disagree on a rule, PM_SE's `CONVENTIONS.md` wins for product/lifecycle questions; this repo's `CONVENTIONS.md` wins for build/agent questions.

---

*Start any adoption by copying [`templates/`](templates/) into your repo and opening [`PLAYBOOK.md`](PLAYBOOK.md).*
