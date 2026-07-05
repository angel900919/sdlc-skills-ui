#!/usr/bin/env bash
# PreToolUse hook: deny edits to protected paths unless a human has approved.
# Reads the tool call JSON from stdin; emits an allow/deny decision on stdout.
# Wire via .ai/hooks/settings.snippet.json. Keep this list in sync with coding-standards.md.

set -euo pipefail

PROTECTED='(^|/)(auth|payments|migrations)/'   # adjust to your repo
# Note: test-file immutability during TDD's green phase is enforced separately by the
# TDD hook + a CI check (see coding-standards.md), NOT here — this guard must not block
# writing the initial failing test in the red phase.

path="$(jq -r '.tool_input.file_path // empty')"

if [[ -n "$path" && "$path" =~ $PROTECTED ]]; then
  jq -n --arg p "$path" '{
    decision: "deny",
    reason: ("Protected path: \($p). This area (auth/payments/migrations) requires explicit human approval. Propose the change and ask before editing.")
  }'
  exit 0
fi

# Not protected — allow.
exit 0
