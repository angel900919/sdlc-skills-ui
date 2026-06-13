# Claude Code hooks — context-handoff automation

When a coding session's context window grows large, this setup **asks you** whether
to hand off to a fresh session, and on *yes* writes a handoff document and opens a
new, pre-seeded `claude` terminal so you continue cleanly instead of suffering a
lossy auto-compaction.

## Files

| File | Role |
|---|---|
| `../settings.json` → `hooks.Stop` | Registers the watchdog. This is the only wiring; Claude Code reads it at **startup**. |
| `handoff-watchdog.sh` | **Detector.** A `Stop` hook that runs after every turn, estimates live context size, and nudges once per session when it's large. |
| `open-handoff-terminal.sh` | **Spawner.** Opens a new macOS Terminal.app window running an interactive `claude` session seeded to read a handoff file. |
| `../skills/handoff-session/SKILL.md` | **Handoff generator.** Writes the handoff doc to the OS temp dir; on macOS, auto-calls the spawner. |

> The existing `PreCompact` / `SessionStart` → `bd prime` hooks are unrelated and
> left intact. This feature only adds a `Stop` hook.

## How it works

```
turn ends
  └─ Stop hook → handoff-watchdog.sh
       ├─ reads live token count from the session transcript
       ├─ under threshold?  → silent, you never notice
       └─ over threshold, first time this session?
            └─ blocks the stop and instructs Claude to ASK you: hand off? (y/n)
                 ├─ NO  → Claude just continues
                 └─ YES → Claude writes the handoff to /tmp via handoff-session,
                          then runs open-handoff-terminal.sh
                             └─ new Terminal window → fresh claude, seeded to
                                "Read the handoff at /tmp/…" and continue
```

### Why `Stop` and not `PreCompact`

`PreCompact` looks like the obvious hook but is the wrong one: it fires at ~95%
context (too late to capture clean state), **cannot be blocked**, and its output is
**not fed back to Claude** — so it can't ask you anything. The `Stop` hook fires
after every turn, can read the transcript, and can both interrupt and instruct
Claude, at a threshold you choose.

### How context size is measured

There is no Claude Code API for "context % used", so the watchdog reads the **most
recent turn's token usage** from the transcript JSONL (`message.usage`):
`input_tokens + cache_read_input_tokens + cache_creation_input_tokens` ≈ the live
context occupancy. It scans only the tail of the file, so it's cheap.

## Is it automatic?

**Automatic (no action from you):**
- Runs on every turn — you never invoke it.
- Measures context and decides on its own.
- When you cross the threshold it interrupts and **asks** you.

**Not automatic (by design — you wanted to be asked):**
- It never hands off silently. It asks **yes/no** first; only *yes* triggers the
  handoff + new terminal.
- It nudges **once per session** (a stamp file), so it won't nag.

**Caveats:**
- The `Stop` hook is **active only in sessions started after** it was added — Claude
  Code snapshots hooks at startup. Run `/hooks` to reload in a running session.
- The nudge is the automatic part; the actual handoff is Claude **carrying out the
  injected instruction** once you say yes (model-driven). You can also trigger the
  whole thing manually by typing `/handoff-session` — that path auto-opens the
  terminal too.

## Configuration

| Knob | How |
|---|---|
| **When it fires** | `CLAUDE_HANDOFF_TOKEN_THRESHOLD` (tokens). **Default `200000`.** Raise it for a 1M-window model; lower it for 200k-window models. Set it in your shell profile or in the hook's `env`. |
| **Re-ask after dismissing** | `rm /tmp/claude_handoff_nudged_<session-id>` (or just start a new session). |
| **Turn it off** | Remove the `Stop` block from `../settings.json`. |
| **Spawned-session model** | `open-handoff-terminal.sh <file> <workdir> <model>` (e.g. `opus`). |

### Security note: `--dangerously-skip-permissions`

`open-handoff-terminal.sh` launches the spawned session with
`--dangerously-skip-permissions` so the handoff picks up uninterrupted. This means
**every auto-spawned handoff session runs with no permission prompts.** That's
intentional for this single-user local flow; remove the flag in the spawner if you
want the new session to prompt normally.

## Platform

The terminal spawn targets **macOS Terminal.app** via `osascript`. First run may show
a one-time Automation/TCC prompt to allow controlling Terminal — accept it. On other
platforms the skill skips the auto-open and just prints the manual resume command.

## Testing

- Logic (threshold, once-per-session, loop guard, missing-transcript safety):
  feed crafted JSON on stdin to `handoff-watchdog.sh` with a fake `transcript_path`.
- Escaping (no window): build the launch string and run it through `osacompile`.
- Live: run `open-handoff-terminal.sh <handoff.md> <workdir>` — opens a real window.
