# SDLC Command Center

A local-first **visual operating system for software development** built on top of the
Claude Code CLI and the 54-skill SDLC chain in `.claude/skills`. It replaces
terminal-only workflows with a dashboard that launches, observes, and recovers
Claude Code sessions — while **keeping Claude Code itself as the only execution
engine, on your existing subscription**.

![architecture](docs/architecture.md)

## Why it works the way it does

The Command Center drives **interactive** Claude CLI sessions through
pseudo-terminals (node-pty) rather than headless `claude -p`. The interactive
path keeps Claude Code's real permission/trust prompts in the loop (no
permission-bypass flags), maps crash recovery onto `--resume`, and stays on your
plan's normal subscription limits. It then gets structured observability from
three zero-cost side channels:

1. **Hooks** — every spawned session carries a generated `--settings` file whose
   hooks POST session/prompt/tool events to the local backend.
2. **Transcript tailing** — sessions are spawned with a known `--session-id`;
   the backend tails `~/.claude/projects/<dir>/<id>.jsonl` for the structured
   message stream that powers the Chat view.
3. **Filesystem watching** — `.ai/`, `.human/`, `docs/`, `tickets/`, `fitness/`
   are watched; project state is recomputed with the chain's own
   `project-state.py` so the dashboard sees exactly what `/status` and `/next` see.

> A *contingent* reason reinforced this choice: Anthropic announced that from
> **June 15, 2026** headless `claude -p` / Agent SDK usage would bill to a
> separate Agent SDK credit pool. That change was **paused on the day it took
> effect** (rechecked 2026-06-20) — for now nothing has changed — so it is a
> deferred risk, not the load-bearing reason. The SessionManager seam can adopt
> a headless runner if the change is reinstated.

See [docs/architecture.md](docs/architecture.md) and [docs/adr](docs/adr) for the full
decision record.

## Quickstart

```bash
npm install        # builds node-pty; postinstall fixes spawn-helper exec bit
npm run dev        # backend on :4317 + web on :5180
open http://localhost:5180
```

Requirements: Node ≥ 20, Python 3 (stdlib only, for the state generator),
the `claude` CLI on PATH and logged in.

> Start `npm run dev` from a **regular terminal**, not from inside a Claude
> Code session — nested `CLAUDE_*` env vars are stripped defensively, but the
> CLI behaves best from a clean environment.

## What you can do

| Page | Purpose |
|------|---------|
| **Dashboard** | Project health: foundation progress, features, next actions (one-click launch), progress tracker, commits, live activity feed, interrupted-session recovery |
| **Pipeline** | The full SDLC stage graph (greenfield + brownfield + per-feature + MTDD execution loop + QA/release) with live status; double-click a stage to launch its skill |
| **Workspace** | Live sessions: embedded terminal (the real Claude TUI — permission prompts work), structured Chat view, per-session activity |
| **Sessions** | History, metrics (tool calls, prompts, durations), resume any interrupted session |
| **Docs** | Browse and render `.ai/`, `.human/`, `docs/` — markdown + Mermaid |
| **Skills** | The 54-skill catalog grouped by SDLC phase, launchable with arguments |

`⌘K` opens the command palette (navigate anywhere, launch any skill).

## Reliability

- Every session, hook event, transcript message and audit event is persisted in
  SQLite (`data/command-center.sqlite`).
- If the backend dies, live sessions are marked **interrupted** on the next
  boot and can be resumed with one click (`claude --resume <session-id>`).
- Structured JSON logs: `data/server.log`.

## Layout

```
apps/server      Fastify backend: PTY sessions, hooks ingest, state engine, WS hub
apps/web         React 19 + Vite + MUI 9 dashboard ("Flight Deck" design)
packages/shared  Types + SDLC stage model shared by both
.claude/skills   The 54-skill SDLC chain (the thing being orchestrated)
docs/            Architecture, ADRs, assumptions
```
