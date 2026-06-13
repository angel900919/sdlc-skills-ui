# Style — modular monolith with an in-process event bus

Status: as-is (recovered, not chosen fresh). Style ADR: [adr/0004](adr/0004-modular-monolith-event-bus.md).

## The three determinations
1. **Monolith vs distributed → monolith.** One deployable Fastify process; the SPA is a
   static artifact it serves in prod (apps/server/src/index.ts:32-41). Distribution would
   buy nothing for a single local user and would break the loopback security boundary.
2. **Where data lives → single local SQLite.** One WAL-mode file under `data/`
   (apps/server/src/db.ts:8-10); docs/adr/0003 names Postgres as the future multi-user path.
3. **Sync vs async → sync API surface, async event spine.** REST + request/response for
   commands; one in-process EventEmitter bus fans every observable event out to the SQLite
   audit trail and the multiplexed WS (apps/server/src/bus.ts:6-9, ws.ts:8-12).

## Score against the job
- JTBD (drive Claude + see chain state, locally, one user): monolith scores highest on
  simplicity and correctness; no candidate distributed style adds capability this job needs.
- The event-bus spine is the one structural embellishment, and it pays for the product's
  core characteristic (observability) directly.

## Constraints inherited
- Loopback bind is the security boundary (anchor: auth none, host 127.0.0.1).
- PTY-only LLM access (docs/adr/0001) shapes RunClaudeSessions' process model.
