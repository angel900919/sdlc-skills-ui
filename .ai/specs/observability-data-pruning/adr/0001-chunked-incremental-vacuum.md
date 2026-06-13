# ADR-0001 (feature) — We will reclaim space via chunked incremental auto-vacuum, never a monolithic VACUUM

- Status: accepted 2026-06-13
- Context: better-sqlite3 is synchronous — a full `VACUUM` on a multi-hundred-MB store
  stalls the Node event loop for seconds. During the stall, WS terminal frames freeze and
  hook POSTs exceed their 3s curl budget and are LOST — a direct violation of project
  invariant 1 (observation never interferes). But without any vacuum, DELETE frees pages
  internally and the file never shrinks — violating PRD N3 (reclaim is real).
- Decision: We will convert the database once at boot to `auto_vacuum = INCREMENTAL`
  (idempotent pragma check; the one required full VACUUM happens before the server
  serves traffic, when nothing can be interfered with). Each prune then reclaims via
  `PRAGMA incremental_vacuum(N)` in bounded chunks, yielding to the event loop between
  chunks, so stalls stay within frame budgets.
- Consequences: bytes are actually returned to the OS and N1 holds under load; the trade
  is a one-time slower first boot after upgrade and slightly slower steady-state page
  management (acceptable: single local user). If a chunk fails midway, deletions stand
  and the remaining reclaim happens on the next prune — reported honestly in the result.
