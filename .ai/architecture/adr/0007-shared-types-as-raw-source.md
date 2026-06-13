# ADR-0007 — We will consume @sdlc/shared as raw TypeScript source, no build step

- Status: accepted (as-is, recovered 2026-06-13)
- Context: server (tsx) and web (Vite) can both consume TS directly; a compiled package
  adds a build order and stale-dist drift for zero runtime benefit here.
- Decision: We will point the workspace package's main at `src/index.ts`
  (packages/shared/package.json:6-10) and let each app's toolchain compile it in place.
- Consequences: edits propagate instantly and types never go stale; the trade is that the
  package is unconsumable outside this monorepo without adding a build — acceptable, it is
  internal by design.
