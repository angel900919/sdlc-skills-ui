# AI-First Repository Scaffold

A copyable starter tree for a repository where humans and AI agents stay synchronized. Drop `.ai/`, `.human/`, `AGENTS.md`, and `CLAUDE.md` into any repo and fill in the `[bracketed placeholders]`. Companion to `../00-MASTER-PLAYBOOK.md`.

## The four layers

```
repo/
├── AGENTS.md          Entry point — tiny, vendor-neutral, routes into .ai/
├── CLAUDE.md          Imports AGENTS.md + Claude-specific notes
├── .ai/               Knowledge + state (human- and agent-readable, portable)
│   ├── README.md
│   ├── project-state.md      [Required] done / in progress / next
│   ├── architecture.md       [Required] agent-facing architecture
│   ├── coding-standards.md   [Required] conventions + enforcement
│   ├── workflow-rules.md
│   ├── decisions/            decision log (ADR-lite for agents)
│   ├── plans/                implementation plans
│   ├── memory/               learned durable facts (index + topics)
│   ├── checklists/           pre-PR, code-review gates
│   ├── prompts/              reusable prompt templates
│   ├── skills/               skill authoring source (→ .claude/skills/)
│   ├── agents/               subagent authoring source (→ .claude/agents/)
│   └── hooks/                enforcement hooks + settings snippet
├── .claude/           Execution layer — harness reads settings/skills/agents here
│   ├── README.md             how to symlink skills/agents from .ai/
│   └── settings.json         wired hooks + permission denies (edit commands to fit)
└── .human/            Human docs: architecture (Mermaid), onboarding, ADRs, runbooks
```

## How to adopt (in order)

1. Copy `AGENTS.md` + `CLAUDE.md` to the repo root; fill in the project one-liner and commands.
2. Fill the three required `.ai/` files. `project-state.md` is the one you keep current every session.
3. Edit `.claude/settings.json` (already wired) so `scripts/check` and the test/lint commands match your project; symlink skills/agents from `.ai/` per `.claude/README.md`.
4. Add optional `.ai/` and `.human/` pieces as the project grows — don't build them all on day one.

## The rule that makes it work

The **repository is the memory, not the chat session.** A fresh agent should read `AGENTS.md` → `.ai/project-state.md` → the routed docs and resume cold, without you re-explaining anything.
