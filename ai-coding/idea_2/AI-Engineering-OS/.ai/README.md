# .ai/ — The Agent Memory System

**Machine-first, terse, high-signal.** A fresh agent session reads this directory and immediately knows current status, architecture, conventions, active work, and known issues — so you never re-prompt the same context. Keep it scannable: tables and bullets over prose; the narrative version for people lives in [`../.human/`](../.human/). Ownership and update rules: [`../CONVENTIONS.md`](../CONVENTIONS.md).

## What an agent reads first
Root `AGENTS.md` → `project-state.md` (where are we?) → `architecture.md` (how is it built?) → `coding-standards.md` (how do I write here?). Then it starts work.

## Artifacts

| Artifact | Purpose | Required? |
|---|---|---|
| `project-state.md` | Done / in-progress / next + session hand-off notes | ★ required |
| `architecture.md` | System map, key technical decisions, invariants | ★ required |
| `coding-standards.md` | Conventions, patterns, banned constructs (gotchas only) | ★ required |
| `skills/` | Reusable expertise as folders (Guide 03) — **3 starters shipped** | optional |
| `decisions/` | Decision traces — the *why* behind one-way doors | optional |
| `lessons.md` | Postmortem learnings + archived-doc pointers | optional |
| `rules/` | Always-on guardrails (keep tiny; prune ruthlessly) | optional |
| `hooks/` | Enforcement hooks (the verify Stop hook, etc.) | optional |
| `commands/` | Staged slash-commands (research/plan/…) | optional |
| `mcp.json` | MCP server integrations | optional |
| `plans/` | Implementation plans per feature | optional |
| `checklists/` | Reusable pre-merge / pre-launch checklists | optional |

> Add optional artifacts **as the project earns them** — don't scaffold empty folders. Starter templates for the lighter ones follow.

### `skills/` — shipped starter skills (Guide 03)
**Populated** — three auto-loadable skills, each a folder (`SKILL.md` + `references/` + `scripts/`):
- [`context-gap-scanner/`](skills/context-gap-scanner/) — surface what's missing from context before acting (Guide 02).
- [`verify-gate/`](skills/verify-gate/) — run + enforce the deterministic gate, plus an anti-slop check for weakened/disabled tests (Guide 01).
- [`skill-authoring/`](skills/skill-authoring/) — how to write and eval a good skill; ships a copyable `SKILL.md` template (Guide 03).

Symlink into `.claude/skills/` to make them model- and user-invocable; `example-skill/` shows the skeleton and can be deleted.

### `rules/` — an always-on guardrail (one rule, one reason)
```markdown
<!-- .ai/rules/00-no-raw-sql.md -->
- NEVER build SQL by string concatenation; use the builder in `db/`. (Why: injection — caught 2026-05.)
```

### `hooks/` — enforce, don't instruct (point the Stop hook at the gate)
```json
{ "hooks": { "Stop": [ { "command": "bash verify.sh" } ] } }
```

### `commands/` — staged slash-commands (Guide 01 CRISPY)
**Shipped and populated** — see [`commands/README.md`](commands/README.md). The task-loop pipeline (`/1-align → /2-questions → /3-research → /4-design → /5-outline → /6-plan → /7-review`) chains through `.ai/plans/<slug>/`; four utilities (`/eval-judge`, `/skill-router-test`, `/extract-skill`, `/incident-to-test`) cover the quality loop. Each is the executable form of a pattern in [`../AI_PROMPTS.md`](../AI_PROMPTS.md). Symlink them into `.claude/commands/` to invoke.

### `mcp.json` — MCP integrations
```json
{ "mcpServers": { "example": { "command": "npx", "args": ["-y", "@scope/mcp-server"] } } }
```

### `plans/` & `checklists/`
- `plans/<feature>.md` — the file-by-file tactical plan (the human reads the *code*, not this).
- `checklists/pre-merge.md` — `[ ] verify.sh green` · `[ ] fresh-context review` · `[ ] project-state updated` · `[ ] failure→check added`.
