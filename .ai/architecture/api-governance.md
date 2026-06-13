# API governance — sdlc-command-center (mvp, detected conventions)

Brownfield: every rule below is the dominant convention already shipping, cited.
Per-feature `/design` API contracts conform to this page.

## Error envelope
- Shape: `{ "error": "<human-readable message>" }` — exactly one key (api.ts:55,63,70).
- Status usage: 400 = malformed/missing input (api.ts:55) · 404 = unknown resource
  (api.ts:63) · 409 = valid request, wrong state (input to non-live session, api.ts:163-164;
  worktree removal while live, api.ts:317). No 422 in use — don't introduce it.

## Pagination
- Convention: `limit` query param, server-capped (`Math.min(limit, cap)`; search cap 100
  at api.ts:342, audit cap 1000 at api.ts:415) + `before` cursor for time-ordered feeds
  (api.ts:414). No offset/page params — don't introduce them.

## Auth
- None — loopback bind (127.0.0.1) is the boundary (config.ts:12; ADR-0005). New
  endpoints must not assume an identity exists.

## Naming
- Paths: `/api/<plural-resource>` with nested ownership — `/api/projects/:id/sessions`
  (api.ts:124); actions as POST sub-resources — `/api/sessions/:id/resume` (api.ts:182).
- JSON bodies and queries: camelCase (`rootPath`, `projectId`).

## Versioning
- None — unversioned `/api/*`; single local consumer ships in lockstep with the server.
  Breaking changes are coordinated edits to `@sdlc/shared` types (the compile-time contract).
