# ADR-0001: Drive interactive Claude CLI via PTY instead of headless `claude -p`

Date: 2026-06-11 · Status: accepted (billing premise paused 2026-06-15 — see "Update — 2026-06-20" below)

## Update — 2026-06-20 (billing premise paused; decision unchanged)

The decision below stands, but its justification now **leads with the durable,
non-billing benefits** rather than billing:

1. **Real permission prompts** — the embedded interactive TUI surfaces Claude
   Code's trust/permission dialogs exactly as a terminal does; no
   permission-bypass flags are passed by default. A headless runner would have
   to re-implement or suppress this.
2. **Crash recovery via `--resume`** — interactive sessions map 1:1 onto
   `--resume <uuid>`, so a killed backend reattaches to a live session.
3. **Subscription, not a separate pool** — interactive usage stays on the
   plan's normal limits regardless of how the Agent SDK billing question
   resolves.

**Billing is now a contingent, currently-paused risk, not the load-bearing
reason.** A recheck on 2026-06-20 against the primary source the original
Context cites (Help Center #15036540) plus The New Stack found: the 2026-06-15
Agent SDK credit change was announced with the exact terms recorded below, **but
Anthropic paused it on 2026-06-15, the day it was due to take effect.** As of
2026-06-20 the notice reads "For now, nothing has changed" — `claude -p` /
Agent SDK usage still draws from the normal subscription pool. Anthropic intends
to revise and re-introduce the change with notice, so the risk is **deferred,
not cancelled**.

The **SessionManager seam** (see Consequences) is unchanged: if the billing
change is reinstated, the interactive PTY path already avoids it, and a headless
stream-json runner can still be added without touching the UI. Re-verification
of #15036540 when Anthropic republishes is tracked in beads (`scc-mz0`).

Sources: support.claude.com/en/articles/15036540 (now carries the pause
notice) · thenewstack.io/anthropic-pauses-claude-agent-sdk-subscription-change
· thenewstack.io/anthropic-agent-sdk-credits.

## Context

*The following records the understanding as of the 2026-06-11 decision date; the
billing premise was later paused — see "Update — 2026-06-20" above.*

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
