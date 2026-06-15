---
slug: sdlc-command-center
stage: threat-model
status: complete
tier: mvp
mode: lite
boundary_count: 3
asset_count: 5
threat_count: 6
open_count: 0
accepted_count: 1
routed_invariants: 1
routed_unwanted: 1
scored_against:
  components: [RunClaudeSessions, IngestObservability, ServeApiAndWs, DeriveProjectState, PersistAndBroadcast, RenderFlightDeck, ShareDomainModel]
  edges: ["RenderFlightDeck -> ServeApiAndWs (fetch + WS)", "claude CLI -> IngestObservability (hook POSTs)", "ServeApiAndWs -> RunClaudeSessions", "DeriveProjectState -> project-state.py (exec)"]
verdict: THREAT-MODEL-LOCKED
verdict_overridden: false
sources: [.ai/architecture, .ai/anchor.md, .ai/environments.md, .ai/context.md, .ai/features.md]
human_summary: .human/summaries/threat-model.md
consumed_by: [prd, architect, qa, promote]
created: 2026-06-15
updated: 2026-06-15
---

# Threat model — sdlc-command-center (lite)

> mvp tier, no uplift signals — a lite pass run past SKIPPED-TIER because the
> `/security-review` of `system-map` found the "loopback bind IS the boundary"
> assumption is porous. Scoring 1–9 (impact × likelihood); ≥6 ⇒ mitigated, accepted, or routed.

## Trust boundaries
| id | boundary | crosses | entry points | inside / outside |
| :-- | :-- | :-- | :-- | :-- |
| B-1 | the owner's browser ↔ the loopback server | network/process | REST API, the `/ws` socket, static UI | ServeApiAndWs, RunClaudeSessions, PersistAndBroadcast / the browser **and any page running in it** |
| B-2 | spawned claude CLI ↔ hook-ingest endpoint | process | `POST` hook events (curl, no auth) | IngestObservability / the spawned CLI processes |
| B-3 | an opened project's content ↔ the app | trust (data) | `.ai/*` files, bd issues, git refs — rendered in the UI + passed to git/bd/python/claude argv | DeriveProjectState, RenderFlightDeck / the opened repo |

## Assets
| asset | lives in | why attacked |
| :-- | :-- | :-- |
| session-spawn / terminal-input | ServeApiAndWs, RunClaudeSessions, `/ws` | = arbitrary command execution on the owner's machine |
| transcript + audit store | SQLite (PersistAndBroadcast) | the owner's session contents — code, pasted secrets, file bodies |
| global hook settings | `~/.claude/settings.json` (global-hooks route) | persistence — rewrite the owner's Claude hooks |
| the PR egress gate | ServeApiAndWs (pr route → `gh`) | push branches / open PRs as the owner |
| local files | fs, via project root + session ids | read arbitrary files into the transcript DB |

## Threat register
> Each: STRIDE letter · boundary · score · scenario (impact × likelihood) · mitigation status.

### T-1 · S/E · B-1 · score 9 · a cross-site request forges a session spawn → RCE
- a page in the owner's browser cross-origin POSTs `/sessions {skipPermissions:true}` → `claude --dangerously-skip-permissions` in the repo cwd = arbitrary command execution; 3 × 3
- status: mitigated-by: invariant RC-1 (originGuard rejects foreign-Origin writes — scc-7ru, tested + live-verified)

### T-2 · S · B-1 · score 6 · DNS-rebinding defeats the loopback bind
- a remote page rebinds `attacker.com` → 127.0.0.1, so requests land on the loopback server with CORS bypassed, driving the T-1 chain; 3 × 2
- status: mitigated-by: invariant RC-1 (originGuard rejects any non-loopback `Host` — scc-7ru)

### T-3 · I/T · B-1 · score 6 · cross-site WebSocket hijack → exfil + keystroke injection
- a foreign page opens `/ws` (handshakes bypass CORS), subscribes to `all` → streams every terminal/transcript, and sends `terminal-input` → injects keystrokes into a live PTY; 3 × 2
- status: mitigated-by: invariant RC-1 (the `/ws` upgrade rejects a foreign Origin — scc-7ru)

### T-4 · T · B-1 · score 4 · CSRF-reachable path traversal via `resumeSessionId`
- a foreign page POSTs `/sessions {resumeSessionId:"../../x"}` → an out-of-tree `*.jsonl` is read into the transcript DB and served back; 2 × 2
- status: mitigated-by: UUID validation in spawnSession (scc-7ru)

### T-5 · E · B-3 · score 3 · malicious project content injects a subprocess argument
- a hostile repo's crafted features.md slug / bd id / git ref becomes a flag in a git/bd/python/claude argv; 3 × 1
- status: mitigated-by: existing argument-shape guards (`git rev-parse --verify`, list-form args, `path.resolve`'d roots, sha-prefixed refs) — verified clean by `/security-review`

### T-6 · S · B-2 · score 2 · a local process forges hook events
- another process on the owner's machine POSTs forged hook/audit events to the unauthenticated ingest endpoint, polluting telemetry; 1 × 2
- status: accepted — single-user local; the endpoint stays unauthenticated for the claude CLI curl, and the loopback bind + Host guard bound it to local processes (owner, 2026-06-15)

## Routed candidates

### RC-1 · invariant · from T-1/T-2/T-3 · → /architect · status: proposed
> ServeApiAndWs rejects any state-changing request carrying a foreign Origin or a non-loopback Host, and rejects a `/ws` upgrade from a foreign Origin. (Implemented in scc-7ru; pending adoption into `02-components.md § Invariants`.)

### RC-2 · unwanted-ears · from T-1 · → /prd system-map · status: proposed
> If a state-changing request arrives whose Origin is not the dashboard's own (or whose Host is not the loopback server), then the system shall reject it with 403 and make no state change.

## Out of scope
- Remote network attackers — the server is loopback-bound (the bind stops the socket; B-1 covers the in-browser path).
- Code-level vuln scanning — owned by `/security-review` (subprocess surface verified clean).
- Web XSS via rendered content — `/security-review`'s web-render pass found no reachable sink; revisit if untrusted-HTML rendering is added.

## Verdict
**THREAT-MODEL-LOCKED** — 6 threats, 0 open: the three high (≥6) browser-boundary threats (T-1/T-2/T-3) are mitigated in code (scc-7ru, tested + live-verified), T-4/T-5 mitigated, T-6 accepted with reason. RC-1 (invariant) + RC-2 (unwanted-EARS) routed to formalize the fix.
