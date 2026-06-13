# ADR-0004 — We will keep one modular-monolith process with an in-process event bus

- Status: accepted (as-is, recovered 2026-06-13)
- Context: one local user, one machine; the product's core job is observing sessions in
  real time. Splitting services would add network hops inside the loopback boundary and
  complicate the never-block-the-session invariant.
- Decision: We will run a single Fastify process; every observable event flows through one
  in-process EventEmitter bus that persists to SQLite and fans out to one multiplexed WS
  (bus.ts:6-9, ws.ts:8-12). Modules stay separated by directory contract (claude/, state/,
  routes/), not by process.
- Consequences: zero-latency event spine and one thing to operate; the trade is that a
  CPU-heavy module can stall the process (mitigated: PTY and python work happen in child
  processes), and multi-user requires re-architecting (named future path, docs/adr/0003).
