---
name: mtdd-init
disable-model-invocation: true
description: |-
  One-time setup for the MTDD bundle in a repo. Detects the default branch, the typecheck and test commands, the language, and the task source, then writes them to a .mtdd/config file so the mtdd-* phases read settled values instead of re-sniffing the environment and re-asking every run. Runs a git-only POSIX detection script, confirms the findings with the user in plain English, and writes the config (safe to commit; re-run anytime to update). Use for "/mtdd-init", "mtdd init", "mtdd setup", "set up mtdd", or right after copying the mtdd bundle into a new project. Do NOT use to run a TDD phase (use mtdd-implement, mtdd-review, mtdd-verify, or mtdd-merge) or to orchestrate the cycle (that is mtdd-cycle).
allowed-tools:
  - Read
  - Bash
  - Write
  - Glob
  - Grep
---

# mtdd-init — one-time MTDD setup for this repo

You are running the **setup phase** for the MTDD bundle. Detect this repo's
environment once and record it in `.mtdd/config` so the four TDD phases
(`implement → review → verify → merge`) and `mtdd-cycle` read settled values instead
of re-sniffing and re-asking every run. When `.mtdd/config` is absent, the phases fall
back to their own runtime detection.

## What gets recorded

`.mtdd/config` is a tiny, sh-sourceable `key=value` file (so the POSIX gates can
read it too). Five keys:

| Key | Read by | Meaning |
|---|---|---|
| `mtdd_target_branch` | implement, review, verify, merge | the branch features are cut from and merged back into |
| `mtdd_language` | implement, review (style packs), verify | drives style-pack classification + toolchain |
| `mtdd_typecheck_cmd` | verify | the project's typecheck command |
| `mtdd_test_cmd` | verify | the project's test command |
| `mtdd_task_source` | all | `free-form` (core) · `beads` · `canonical` — see [`../_build_share/task-sources.md`](../_build_share/task-sources.md) |

`/mtdd-cycle` writes a sibling runtime file, `.mtdd/cycle-state` (schema in
[`../_build_share/cycle-state.md`](../_build_share/cycle-state.md)); it is per-run state
that must NOT be committed, so this skill git-ignores it (step 4).

## Procedure

### 1. Run detection

From the repo root, run the git-only detector and capture **both** streams — the
clean `key=value` block on stdout, and any `WARN:`/`SETUP:` lines on stderr:

```sh
sh .claude/skills/_build_share/mtdd-init.sh
```

If it exits `2` (`SETUP: not inside a git work tree`), stop and tell the user MTDD
needs a git repo — offer to `git init` if appropriate. If a `WARN:` line says the
bundle isn't laid out at `.claude/skills/_build_share/`, surface it: the gates and
relative links depend on that layout.

### 2. Read the existing config (update mode)

If `.mtdd/config` already exists, read it. You're updating, not replacing blind —
show the user which detected values **differ** from what's on file, and preserve any
value they've hand-tuned unless they ask to re-detect it.

### 3. Confirm with the user — plain English

Present the detected settings as a short plain-English summary (not raw keys), and
surface any `WARN` lines as things they may need to fix by hand. Follow
[`../_build_share/coding-standards.md`](../_build_share/coding-standards.md) house
style for talking to the human: plain words, propose the detected value as the
recommended answer, and let them correct any line. For example:

> Here's what I detected for this repo:
> - **Branch** features merge into: `main`
> - **Language**: `python`
> - **Typecheck**: `mypy .`  ·  **Tests**: `pytest`
> - **Task source**: `free-form` (one-off `tasks/<slug>.md` files)
>
> Look right? Reply `go` to save it, or correct any line.

If the detector returned `unknown`/empty for a command (no recognized manifest),
**ask** for the right command rather than guessing — that's exactly the value this
step adds. Don't write an empty command and let verify break later.

### 4. Write the config

On confirmation, write `.mtdd/config` (create the `.mtdd/` directory if needed) with
the confirmed values:

```
# .mtdd/config — written by mtdd-init. Edit by hand or re-run /mtdd-init.
# Read by the mtdd-* phases; sh-sourceable (key=value) so the gates can read it too.
mtdd_target_branch=<branch>
mtdd_language=<language>
mtdd_typecheck_cmd="<cmd or empty>"
mtdd_test_cmd="<cmd or empty>"
mtdd_task_source=<free-form | beads | canonical>
```

Use the **Write** tool with the user's confirmed values (don't just re-run the
script with `--write` if they corrected anything — their edits win).

**Git-ignore the runtime cycle-state file.** Ensure the repo's `.gitignore` contains
a `.mtdd/cycle-state` entry (append it if absent; never duplicate an existing line).
`.mtdd/config` stays committed — only `.mtdd/cycle-state` is ignored, so a future
`/mtdd-cycle` run's state never lands in a commit. If there is no `.gitignore`,
create one with that single line.

### 5. Hand off

Tell the user, in one short paragraph:

- That the config is written and the phases now read it (with runtime detection as
  the fallback if it's ever removed).
- That `.mtdd/config` is **safe to commit** — it's project-level, not machine-level,
  so the team shares one settled setup.
- The next step: `/mtdd-implement <task>` (or `/mtdd-cycle <task>`). For a brand-new
  free-form task, point them at
  [`../_build_share/task-template.md`](../_build_share/task-template.md) → copy to
  `tasks/<slug>.md`.

## Rules

- **Detect, confirm, write — in that order.** Never write `.mtdd/config` without the
  user confirming the values; this is the one human touchpoint that makes every later
  phase hands-off. Re-running updates the file in place; never append duplicates.
- **Don't invent commands.** An empty `mtdd_typecheck_cmd`/`mtdd_test_cmd` is better
  than a wrong one — ask the user when detection can't tell.
- **This skill only writes `.mtdd/config` and the one `.gitignore` line.** It does not
  touch source, branches, or task files, and it does not run a TDD phase.
