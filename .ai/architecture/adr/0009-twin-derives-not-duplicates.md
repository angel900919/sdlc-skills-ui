# ADR-0009 — We will build the project graph as a derived projection, never a duplicate store

- Status: accepted (2026-06-13)
- Context: framing the dashboard as a "single source of truth" digital twin invites a tempting
  wrong turn — a persistent store that copies requirements, code, issues, agent activity and
  deployments. That copy drifts from its sources and becomes the stale documentation the twin
  set out to replace. The app already has the right pattern: DeriveProjectState derives state
  from artifacts and owns none of them.
- Decision: We will materialize the project graph (ADR-0008) by **derivation from authoritative
  sources, referencing them, never re-storing them**: git → source-files/branches/PRs/authorship,
  beads → issues/tasks, the SQLite audit trail → agent-session activity, `.ai/` →
  requirements/architecture, CI → deployments. The twin is the single source of truth for the
  **declared architecture model only**; for everything else it is a single **pane of glass** (an
  index/projection), recomputed on watch/demand and cached, off the session-blocking path. The
  alternative — an event-sourced twin store that owns copies — is rejected.
- Consequences: the graph cannot go stale relative to its sources (it is recomputed, not synced);
  code↔model **drift detection** becomes a first-class capability (compare derived-from-code
  against declared) rather than a reconciliation chore. The trade is recomputation cost
  (mitigated by the existing watch+debounce + caching) and that cross-source joins live in the
  derivation layer. Extends the invariants "observation never interferes" and "the app never
  observes its own output" (the graph must exclude `dashboard/` + `prototypes/`).
