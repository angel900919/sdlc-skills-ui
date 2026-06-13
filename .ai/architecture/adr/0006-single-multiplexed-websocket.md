# ADR-0006 — We will multiplex all live updates over one WS with topic subscriptions

- Status: accepted (as-is, recovered 2026-06-13)
- Context: many views need live data (terminals, board, audit feed); per-view sockets or
  SSE-per-resource multiply connection state and reconnect logic. Alternatives: SSE,
  socket-per-session.
- Decision: We will run one `/ws` endpoint with topic subscriptions (`all`,
  `project:<id>`, `session:<id>` — ws.ts:8-12); the client keeps a single reconnecting
  socket (web/src/ws/socket.ts).
- Consequences: one reconnect path and cheap fan-out from the bus; the trade is in-band
  topic bookkeeping and that one slow consumer shares the pipe (acceptable: one local user).
