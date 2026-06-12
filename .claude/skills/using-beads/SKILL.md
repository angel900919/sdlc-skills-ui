---
name: using-beads
description: Tracks work in beads (the bd CLI) — create tickets, find and claim ready work, link dependencies, close issues. Use when a .beads directory exists or the user mentions beads, bd, or filing a ticket.
---

<what-to-do>

Use the `bd` CLI as the task system for this project. Follow this loop; do not invent your own tracking.

**0. Load current context first.** In a beads workspace (a `.beads/` directory exists), run `bd prime` once per session before other bd work. It prints bd's own up-to-date workflow rules and the session-close protocol. Treat its output as authoritative when it conflicts with this skill. If `bd` is not installed or no `.beads/` exists and the user wants to start tracking, run `bd init` (auto-detects an issue prefix from the directory name).

**1. Find work.** `bd ready` shows open issues with no active blockers — the claimable queue. `bd show <id>` for full detail before starting. Use `bd list --status=in_progress` to see active work, `bd blocked` to see what's stuck.

**2. Claim before coding.** `bd update <id> --claim` (sets it to in_progress, assigns it to you). Create the bead *before* writing code for new work, not after.

**3. Do the work, then close.** `bd close <id> --reason="what changed / PR ref"`. Close several at once: `bd close <id1> <id2>`. Use `bd close <id> --suggest-next` to surface newly unblocked work.

**4. Capture discovered work immediately.** When you find a bug or follow-up while working an issue, file it right away and link it to its origin instead of expanding the current ticket's scope:
`bd create "Title" -t bug -p 2 --deps discovered-from:<current-id>`

**5. Session-close protocol.** Before you tell the user a task is "done" or "complete": close every finished bead, and if a git remote is configured, push beads with `bd dolt push`. Run `bd prime` again after a compaction or context clear to re-load this protocol.

## Creating a well-formed ticket

A good bead is claimable by someone with no prior context. Always set type and priority; give a description that says *why it exists and what done looks like*:

```bash
bd create --title="Login fails on expired token" \
  --type=bug --priority=1 \
  --description="Expired JWTs return 500 instead of 401; users get a blank page." \
  --acceptance="Expired token returns 401 + redirect to /login; unit test covers it."
```

- **Priority is numeric 0–4** (0=critical, 1=high, 2=medium/default, 3=low, 4=backlog). Never pass "high"/"medium"/"low".
- **Type** is one of `bug | feature | task | epic | chore | decision` (default `task`).
- Add `--acceptance` for testable done-criteria, `--design` for decisions, `--notes` for context. Run `bd create --validate` (or `bd lint` on existing issues) to check required sections are present.
- Batch many issues with parallel subagents rather than one slow loop.

</what-to-do>

<supporting-info>

## Dependencies

- `bd dep add <issue> <depends-on>` — `<issue>` now depends on (is blocked by) `<depends-on>`.
- `bd dep <blocker> --blocks <blocked>` — same relationship, stated the other direction.
- At create time: `--deps blocks:<id>` or `--deps discovered-from:<id>` (comma-separate multiple).
- Dependency types: **blocks** (hard order), **parent-child** (epic/subtask, set via `--parent <id>`), **related** (soft link), **discovered-from** (work found while doing other work). `bd dep tree <id>` visualizes; `bd dep cycles` detects loops.

## Agent gotchas

- **Never run `bd edit`** — it opens `$EDITOR` (vim/nano) and blocks the agent. Update fields inline with `bd update <id> --title/--description/--notes/--priority/--status` instead.
- In a beads project, **do not use TodoWrite, TaskCreate, or markdown to-do files** for task tracking — beads is the single source of truth.
- Add `--json` to any read command (`bd ready --json`, `bd show <id> --json`, `bd list --json`) when you need to parse output programmatically.
- `bd update <id> --claim` is idempotent; re-claiming your own issue is a no-op.

## Command quick reference

| Goal | Command |
| :--- | :--- |
| Load workflow rules | `bd prime` |
| Initialize tracking | `bd init` |
| Ready / claimable work | `bd ready` |
| Issue detail | `bd show <id>` |
| Create | `bd create --title="..." --type=bug --priority=2 --description="..."` |
| Claim | `bd update <id> --claim` |
| Update a field | `bd update <id> --priority=1` |
| Close | `bd close <id> --reason="..."` |
| Search | `bd search "<query>"` |
| Health / overview | `bd status`, `bd doctor` |
| Push to remote | `bd dolt push` |

Anything not covered here: run `bd <command> --help`, or `bd prime` for the full current workflow. Do not guess flags.

</supporting-info>
