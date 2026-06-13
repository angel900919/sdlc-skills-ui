#!/usr/bin/env bash
#
# Stop hook — context-handoff watchdog.
#
# Fires after every assistant turn. Reads the live context size from the session
# transcript (the most recent turn's input + cached-input tokens). Once that crosses
# CLAUDE_HANDOFF_TOKEN_THRESHOLD, it blocks the stop ONCE per session and feeds Claude
# an instruction to ask the user whether to generate a handoff and open a fresh,
# seeded Claude terminal.
#
# Why Stop and not PreCompact: PreCompact fires at ~95% (already too late to capture
# clean state), cannot be blocked, and its output is not fed back to Claude. The Stop
# hook can both interrupt and instruct Claude, at a threshold you choose.
#
# A watchdog must never break the session: every failure path exits 0 (do nothing).

set -uo pipefail

# Threshold in tokens. Default ≈20% of a 1,000,000-token window (this session is
# opus-4-8[1m]). Lower it (e.g. 150000) if you run 200k-window models.
THRESHOLD="${CLAUDE_HANDOFF_TOKEN_THRESHOLD:-200000}"

input="$(cat)"

jqr() { printf '%s' "$input" | jq -r "$1" 2>/dev/null; }

# Re-entry guard: if a prior Stop block is already active, do nothing (avoids loops).
[[ "$(jqr '.stop_hook_active // false')" == "true" ]] && exit 0

transcript="$(jqr '.transcript_path // empty')"
session="$(jqr '.session_id // "unknown"')"
[[ -z "$transcript" || ! -f "$transcript" ]] && exit 0

# One nudge per session — a stamp file means we've already asked.
# Delete it (or run the handoff) to re-arm: rm "$stamp"
stamp="${TMPDIR:-/tmp}/claude_handoff_nudged_${session}"
[[ -f "$stamp" ]] && exit 0

# Live context size = newest turn's input_tokens + both cache token counts.
# (output_tokens are not part of the next turn's context.) Scan only the tail.
used="$(tail -n 200 "$transcript" 2>/dev/null | jq -s '
  map((.message.usage // .usage // empty)
      | (.input_tokens // 0)
        + (.cache_read_input_tokens // 0)
        + (.cache_creation_input_tokens // 0))
  | (last // 0)' 2>/dev/null)"

[[ "$used" =~ ^[0-9]+$ ]] || exit 0
(( used < THRESHOLD )) && exit 0

touch "$stamp" 2>/dev/null || true

reason="⚠️ Context watchdog: the live context window is ~${used} tokens (threshold ${THRESHOLD}). STOP coding now. Ask the user this verbatim and WAIT for their answer — do not assume: \"Context is getting large (~${used} tokens). Want me to write a handoff doc and open a fresh, seeded Claude terminal so we can continue cleanly?\" If they say YES: follow .claude/skills/handoff-session/SKILL.md to write the handoff document to the OS temp dir, then run '\"\$CLAUDE_PROJECT_DIR\"/.claude/hooks/open-handoff-terminal.sh <that-file>' to launch the new session. If they say NO, simply continue."

jq -nc --arg reason "$reason" '{decision:"block", reason:$reason}'
exit 0
