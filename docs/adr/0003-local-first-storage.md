# ADR-0003: SQLite (WAL) for local-first persistence

Date: 2026-06-11 · Status: accepted

## Context

The platform is single-user and local-first, but must survive crashes and keep
a queryable audit trail (sessions, hook events, transcripts, audit events).

## Decision

`better-sqlite3` with WAL mode in `data/command-center.sqlite`. Synchronous API
keeps the write path trivial and transactional; the data directory also holds
structured JSON logs (`server.log`) and the generated hook settings file.

## Consequences

- ✅ Zero-ops durability; the whole observability store is one file.
- ✅ WAL allows the UI's read queries to run while events stream in.
- PostgreSQL remains the documented path for a future multi-user/cloud mode —
  the schema is deliberately portable (no SQLite-specific types).
