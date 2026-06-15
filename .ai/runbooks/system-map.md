---
slug: sdlc-command-center
feature: system-map
stage: runbook
status: complete
tier: mvp
verdict: RUNBOOK-WRITTEN
verdict_overridden: false
alert_count: 7
rollback_arms: [deploy]
open_question_count: 0
flag_system: none
escalation_confirmed: true
sources: [.ai/specs/system-map/design.md, .ai/specs/system-map/prd.md, .ai/environments.md, .ai/data-management.md, .ai/architecture/threat-model.md, .ai/specs/system-map/qa-report.md, .ai/anchor.md]
human_runbook: .human/runbooks/system-map.md
consumed_by: [diagnose, ship, qa]
created: 2026-06-15
---

# Runbook — system-map

> Compiled 2026-06-15 against design.md + prd.md at that date. Local-first,
> single-user, mvp: "incidents" are degraded views, not outages. Re-run
> `/runbook system-map` after the feature changes.

## Alert & symptom table

| alert / symptom | meaning | first diagnostic steps | mitigation | escalate to / when | source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Empty graph ("No model yet — run /architect") | `02-components.md` missing or malformed | 1. `architecture.parse` log — `ok` vs `warn`; 2. confirm `.ai/architecture/02-components.md` exists and parses | by design (serve 200 empty); fix the model file or run `/architect` | owner, only if the file is valid yet the graph stays empty | design.md §Failure modes r1 |
| Graph renders but all nodes muted / status `unknown` | project state stale or unavailable (15 s cache miss/timeout) | 1. `architecture.serve` log; 2. regenerate: `python3 .claude/skills/_build_share/project-state.py` | declared model still renders; status recovers when state refreshes | owner, if status stays unknown after a regen | design.md §Failure modes r2 |
| Tab doesn't auto-refresh after a model change | the `/ws` socket dropped | 1. browser devtools → `/ws` connection state; 2. confirm the watcher logged `architecture-changed` | react-query refetches on reconnect; reload the tab | — (self-heals on reconnect) | design.md §Failure modes r3 |
| Adoption metric undercounts | `POST /events` is fire-and-forget; a swallow means the server was briefly unreachable | check `audit_events` for `kind:nav` rows | none — never blocks the tab (NFR-4); the metric only undercounts | — | design.md §Failure modes r4 |
| `architecture.serve` p95 > 300 ms | NFR-1 latency regression | `architecture.serve` span `duration_ms` + `cache_hit` — a cold/missed cache is the usual cause | the parse is cached on watch; investigate repeated cache misses | owner, if sustained on a ≤50-component model | prd.md NFR-1 |
| `403 forbidden origin` / `forbidden host` in request logs | the request-boundary guard rejected a non-dashboard Origin or a non-loopback Host | check the `req.host` / `origin` in the log line | legitimate if the dev web port changed → set `SDLC_WEB_DEV_PORT`; otherwise it's the guard working as designed | owner, if a real dashboard request is being blocked | threat-model T-1/2/3 (scc-7ru) |
| Architecture tab a11y (known weak spot) | no formal WCAG pass — keyboard nav, node/inspector labels, status-color contrast | n/a (not an incident) | accepted weak spot carried from QA; an a11y pass is open follow-up | — | qa-report.md WARN j |

## Rollback procedure

### 1 — Deploy rollback
system-map is additive (one Architecture tab + `GET /api/projects/:id/architecture` + `POST /api/projects/:id/events`).
1. On `v2-prototype-architecture-tab`, `git revert` the system-map commits (or check out the prior ref).
2. Restart: `npm run dev` (dev) or `npm start` (built).
3. Verify: `curl -s http://127.0.0.1:4317/api/health` — expect `{"ok":true}`-shaped 200.

### 2 — Migration down
- reversibility: **none required** — system-map added no schema; its nav beacon reuses the existing `audit_events` table. Project schema is additive boot DDL in `db.ts` (`CREATE TABLE IF NOT EXISTS` + `ensureColumn`), `reversibility: argued-irreversible-allowed` (data-management.md) — nothing to reverse here.

### 3 — Flag-off
- flag_system: **none** — revert + restart is the only off switch.

## Dependencies & integration points

| dependency / edge | symptom when it's down | where to check its health |
| :-- | :-- | :-- |
| `project-state.py` (exec, edge 9) | node statuses fall to `unknown` | `SDLC_PYTHON_BIN`; run `python3 .claude/skills/_build_share/project-state.py` by hand |
| chokidar watcher (edge 8) | no live refresh on model change | server logs for `architecture-changed`; restart the server |
| ShareDomainModel types (compile-time, edge 10) | build/typecheck failure, not a runtime fault | `npm run typecheck` |

## Links
- dashboard: `http://127.0.0.1:4317` (Architecture tab) · dev `http://127.0.0.1:5180`
- logs: server stdout (pino) — start from `architecture.parse` / `architecture.serve`
- traces: OTel `architecture.serve` span (opt-in via `OTEL_EXPORTER_OTLP_ENDPOINT`)
- smoke: `curl -s http://127.0.0.1:4317/api/health`
- specs: .ai/specs/system-map/design.md · prd.md · qa-report.md

## Notes
- escalation contact confirmed by: owner (Andres Rambal), 2026-06-15 — single-user local tool; the owner is the only responder.
- known accepted weak spots carried from qa-report.md: a11y (WARN j, open follow-up). Security (WARN i) is now closed (scc-7ru + threat-model).

## Verdict
**RUNBOOK-WRITTEN** — compiled from design failure modes, observability hooks, NFR-1, the threat-model boundary fix, and the QA-accepted a11y weak spot. Single deploy-rollback arm (no migrations, no flags). `/diagnose` reads this first in an incident.
