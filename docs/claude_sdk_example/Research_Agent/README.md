# Research agent

Personal **research agent** built on the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk) (TypeScript), authenticated with your **Claude subscription** (OAuth) — no Anthropic API key.

Give it a topic; it plans sub-questions, searches the web, cross-checks sources, and writes a cited Markdown report to `reports/`.

> Setup and authentication are shared with the SDLC orchestrator — see the [repo README](../../README.md).

## Usage

Run from the repo root:

```bash
# New research run
npm run research -- "State of WebGPU adoption in 2026"

# Follow-up in the same session (full context retained)
npm run research -- --resume <sessionId> "Expand the Safari section"
```

The session id is printed at the start and end of every run. Reports land in `reports/`, and every file the agent writes is recorded in `logs/audit.log`.

## Design

| File | Responsibility |
|---|---|
| `config.ts` | SDK options: tool allowlist, permission mode, system prompt, hooks |
| `agent.ts` | `runResearch()` — streams progress, captures session/result/cost |
| `cli.ts` | Entrypoint: args, auth preflight, summary output |
| `../hooks.ts` | Shared `PostToolUse` audit hook logging all file writes |

Safety posture:

- **No `Bash` tool** — the agent can search, read, and write files, but cannot run commands.
- `permissionMode: "acceptEdits"` — report writes are auto-approved; everything else stays within the allowlist.
- `settingSources: []` — runs ignore your `~/.claude` / `.claude/` settings, so behavior is reproducible.
- `maxTurns: 60` — hard stop against runaway loops.
- Audit log of every file write in `logs/audit.log`.
