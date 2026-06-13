# ADR-0005 — We will treat the loopback bind as the security boundary (no auth)

- Status: accepted (as-is, recovered 2026-06-13)
- Context: single-owner local tool; the server can spawn shells (PTYs) and read transcripts
  — any network exposure would be severe. Alternatives: token auth, OS user auth.
- Decision: We will bind 127.0.0.1 by default (config.ts:12) and ship no auth layer; the
  hook-ingest endpoint accepts any local POST (hooks.ts:47-54).
- Consequences: zero auth friction locally; the hard rule it creates: anything that changes
  SDLC_HOST to a non-loopback address is a re-anchor + threat-model event, and new
  endpoints must never assume an authenticated identity exists.
