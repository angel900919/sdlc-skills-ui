# Claude Code hooks — context-handoff automation

When a coding session's context window grows large, this setup **asks you** whether
to hand off to a fresh session. On *yes* it writes a handoff document and copies a
ready-to-run resume command to your clipboard, so you open a new terminal tab **inside
your IDE** (e.g. IntelliJ) and paste — continuing cleanly instead of suffering a lossy
auto-compaction.

Cross-platform: works on **Windows and macOS** (and Linux). The hooks are Node scripts,
so they run identically under PowerShell or Git Bash on Windows and under bash/zsh on
macOS.

## Files

| File | Role |
|---|---|
| `../settings.json` → `hooks.Stop` | Registers the watchdog (Node exec-form). The only wiring; read at **startup**. |
| `handoff-watchdog.mjs` | **Detector.** A `Stop` hook that runs after every turn, estimates live context size, and nudges once per session when it's large. |
| `handoff-pickup.mjs` | **Pickup.** Copies the resume command to the clipboard and prints how to open a new in-IDE terminal tab and paste. |
| `../skills/handoff-session/SKILL.md` | **Handoff generator.** Writes the handoff doc to the OS temp dir, then calls the pickup. |

> The existing `PreCompact` / `SessionStart` → `bd prime` hooks are unrelated and
> left intact. This feature only adds a `Stop` hook.

## Requirements

- **Node.js on PATH** (`node`). The Stop hook is run as `node …handoff-watchdog.mjs`.
- On **Windows**, no Git Bash is required (Node is invoked directly via exec-form).

## How it works

```
turn ends
  └─ Stop hook → node handoff-watchdog.mjs
       ├─ reads live token count from the session transcript
       ├─ under threshold?  → silent, you never notice
       └─ over threshold, first time this session?
            └─ blocks the stop and instructs Claude to ASK you: hand off? (y/n)
                 ├─ NO  → Claude just continues
                 └─ YES → Claude writes the handoff to the temp dir via handoff-session,
                          then runs node handoff-pickup.mjs <file>
                             └─ resume command copied to clipboard +
                                "open a new IDE terminal tab and paste" instructions
```

### Why an external script can't open the IDE terminal for you

IntelliJ (and JetBrains IDEs generally) **cannot be driven from an outside process to
open a terminal tab**: the `idea` CLI only does open/diff/merge/format/inspect, the
`jetbrains://` URL protocol only navigates files, the built-in `localhost:63342` server
has no terminal/run endpoint, and there's no supported external automation. The only
way to open the IDE terminal programmatically is a plugin running *inside* the IDE. So
the pickup uses the clipboard + a one-keystroke manual paste — the reliable cross-IDE,
cross-OS path.

### Why `Stop` and not `PreCompact`

`PreCompact` fires at ~95% context (too late for a clean handoff), **cannot be
blocked**, and its output is **not fed back to Claude**. The `Stop` hook fires after
every turn, can read the transcript, and can both interrupt and instruct Claude, at a
threshold you choose.

### How context size is measured

There's no Claude Code API for "context % used", so the watchdog reads the **most
recent turn's token usage** from the transcript JSONL (`message.usage`):
`input_tokens + cache_read_input_tokens + cache_creation_input_tokens` ≈ live context
occupancy. It reads only the tail of the file, so it's cheap.

## Is it automatic?

**Automatic:** runs every turn, measures context, and asks you when you cross the
threshold — once per session (a stamp file prevents nagging).

**Not automatic (by design):** it never hands off silently — it asks **yes/no** first;
and the final step is **you** opening an IDE terminal tab and pasting (one keystroke).

**Caveat:** the `Stop` hook is active only in sessions started **after** it was added
(Claude Code snapshots hooks at startup). Run `/hooks` to reload in a running session.

## Configuration

| Knob | How |
|---|---|
| **When it fires** | `CLAUDE_HANDOFF_TOKEN_THRESHOLD` (tokens). **Default `200000`.** Raise for a 1M-window model; lower for 200k-window models. |
| **Re-ask after dismissing** | delete `claude_handoff_nudged_<session-id>` in the OS temp dir (or start a new session). |
| **Turn it off** | remove the `Stop` block from `../settings.json`. |

### Security note: `--dangerously-skip-permissions`

The resume command includes `--dangerously-skip-permissions` so the new session picks
up uninterrupted — it runs with **no permission prompts**. Intentional for this
single-user local flow; remove the flag in `handoff-pickup.mjs` if you want the new
session to prompt normally.

## Testing

- Logic (threshold, once-per-session, loop guard, missing-transcript safety): pipe
  crafted JSON into `node handoff-watchdog.mjs` with a fake `transcript_path`.
- Pickup: `node handoff-pickup.mjs <handoff.md>` — check the clipboard contents and the
  printed instructions.
