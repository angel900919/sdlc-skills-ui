# ADR-0001: Drive interactive Claude CLI via PTY instead of headless `claude -p`

Date: 2026-06-11 · Status: accepted

## Context

The platform must wrap Claude Code without consuming a separate credit pool.
Anthropic announced that from **2026-06-15**, Agent SDK and `claude -p`
(headless) usage on Pro/Max/Team/Enterprise plans draws from a new monthly
**Agent SDK credit** (separate from interactive limits; $20/Pro, $100/Max 5x,
$200/Max 20x at API rates, no rollover). Interactive Claude Code is explicitly
unaffected. Sources: code.claude.com/docs/en/authentication (note in
"Generate a long-lived token"), support.claude.com article 15036540.

## Decision

Spawn the **interactive** `claude` TUI in a pseudo-terminal (node-pty), one
process per session, with `--session-id <uuid>` (or `--resume <uuid>`), and a
generated `--settings` file carrying observability hooks. Structured data
comes from hooks + transcript tailing; the raw TUI is embedded in the UI via
xterm.js.

## Consequences

- ✅ All usage stays on the existing subscription's interactive limits.
- ✅ Permission prompts surface in the embedded terminal — no security bypass.
- ✅ Resume/crash-recovery maps 1:1 onto `--resume`.
- ⚠️ Structured output is reconstructed from transcripts rather than
  stream-json; transcript format is an internal Claude Code format and may
  change between versions (tailer is tolerant: unknown lines are skipped).
- ⚠️ One PTY + one claude process per concurrent session (acceptable for a
  single-user local tool).
- The SessionManager is the seam: a headless stream-json runner could be added
  later if billing rules change, without touching the UI.

## Alternatives considered

1. **`claude -p --output-format stream-json` per run** — cleanest events;
   rejected: bills to the Agent SDK pool from 2026-06-15.
2. **Agent SDK** — same billing problem, plus replaces the user's CLI workflow.
3. **Parsing the PTY's ANSI output** — brittle; rejected in favor of
   hooks + transcripts which are structured at the source.
