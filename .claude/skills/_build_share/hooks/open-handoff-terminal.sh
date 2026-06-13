#!/usr/bin/env bash
#
# Open a new macOS Terminal.app window running a fresh `claude` session seeded to
# read a handoff document.
#
# Design: the handoff content stays in a file; the seed prompt is a short, static
# instruction that references only the file path — never user content. This avoids
# AppleScript/shell escaping hazards and the argv length limit entirely, regardless
# of how large or weird (quotes, $, backticks, newlines) the handoff document is.
#
# Usage: open-handoff-terminal.sh <handoff-file> [workdir] [model]
#   workdir defaults to the current directory; model is optional (e.g. opus, sonnet).

set -uo pipefail

handoff="${1:?usage: open-handoff-terminal.sh <handoff-file> [workdir] [model]}"
workdir="${2:-$PWD}"
model="${3:-}"

[[ -f "$handoff" ]] || { echo "handoff file not found: $handoff" >&2; exit 1; }

seed="Read the handoff document at ${handoff} and follow its instructions to continue the work. Do not start coding until you have acknowledged the context and the user gives the go-ahead."

# Build the command the new window runs in its FOREGROUND TTY. claude needs a real
# TTY for an interactive session — never background, pipe, or redirect it.
# printf %q makes each piece safe for the inner login shell.
#
# --dangerously-skip-permissions: the handoff session starts with no permission
# prompts so it can pick up the work uninterrupted. This trusts the spawned session
# fully; it is intentional for this single-user local handoff flow.
model_arg=""
[[ -n "$model" ]] && model_arg=" --model $(printf '%q' "$model")"
launch="cd $(printf '%q' "$workdir") && claude --dangerously-skip-permissions --add-dir $(printf '%q' "$workdir")${model_arg} $(printf '%q' "$seed")"

# Escape the whole command for an AppleScript double-quoted string literal:
# backslash first, then double-quote.
esc="${launch//\\/\\\\}"
esc="${esc//\"/\\\"}"

osascript \
  -e "tell application \"Terminal\" to do script \"${esc}\"" \
  -e 'tell application "Terminal" to activate'
