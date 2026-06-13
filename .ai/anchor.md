---
slug: sdlc-command-center
stage: anchor
status: complete
project_type: brownfield
project_tier: mvp
lifecycle_stage: mvp
ai_in_core_path: false
uplift_signals: []
approved_dependencies: [fastify, "@fastify/cors", "@fastify/static", "@fastify/websocket",
  "@opentelemetry/api", "@opentelemetry/exporter-trace-otlp-http", "@opentelemetry/resources",
  "@opentelemetry/sdk-trace-node", "@opentelemetry/semantic-conventions", better-sqlite3,
  chokidar, gray-matter, node-pty, pino, tsx, "@sdlc/shared", react, react-dom,
  react-router-dom, "@emotion/react", "@emotion/styled", "@mui/material", "@mui/icons-material",
  "@fontsource/ibm-plex-mono", "@fontsource/ibm-plex-sans", "@tanstack/react-query",
  "@xterm/xterm", "@xterm/addon-fit", "@xyflow/react", mermaid, react-markdown, remark-gfm, zustand]
tentative_fields: [nfr_ceiling_latency_p95_ms, release_policy_versioning, approved_dependencies]
nfr_ceiling_latency_p95_ms_tentative: yes
release_policy_versioning_tentative: yes
approved_dependencies_tentative: yes
verdict: READY-FOR-ARCHITECT
verdict_overridden: false
source_intake: .ai/intake.md
source_features: .ai/features.md
human_summary: .human/summaries/anchor.md
consumed_by: [promote, architect, prd, design, bootstrap, pipeline, ship, diagnose]
created: 2026-06-13
---

# Anchor — sdlc-command-center

> Tier: `mvp` · Locked 2026-06-13 · Read this before every session.

## Lifecycle
- current: mvp, since 2026-06-13.
- advance with `/promote` only; never hand-edit the tier, and an `/anchor` re-run never bumps it.
- stage_history:
  - { from: none, to: mvp, date: 2026-06-13, by: /anchor, rationale: initial stage set by /anchor, overridden: false }
- promotion_criteria:
    to_mvp: []
    to_production: []

## Stack
- language: typescript               # why: detected — whole monorepo is TS (apps + shared package)
- framework: react-vite (web) + fastify (server)   # why: detected — React/Vite SPA, Fastify API/WS server, npm workspaces
- hosting: local-only                # why: detected — no deploy configs; runs on the owner's machine via npm scripts
- db: sqlite (better-sqlite3)        # [mvp+] why: detected — local-first persistence, apps/server/src/db.ts
- auth: none                         # [mvp+] why: detected — no auth dep; single local user, server serves localhost only
- deployment_target: single-env-local   # [mvp+] why: dev machine is the only environment
- nfr_ceiling_latency_p95_ms: 1000   # [mvp+] why: default — no measured target yet (tentative)

## Approved dependencies    # [mvp+] — direct runtime deps detected from the two app manifests (tentative: auto-seeded, not human-pruned)
- server: fastify + @fastify/{cors,static,websocket}   why: HTTP/WS API surface
- server: node-pty                                     why: spawns the Claude Code CLI in real PTYs — the app's core mechanism
- server: better-sqlite3                               why: local persistence
- server: chokidar · gray-matter                       why: watch + parse the chain's .ai/dashboard artifact files
- server: pino · @opentelemetry/* (5 pkgs)             why: logging + local tracing
- server: tsx                                          why: TS runtime for dev/start
- web: react · react-dom · react-router-dom            why: SPA core
- web: @mui/* + @emotion/* + @fontsource/* (6 pkgs)    why: design system
- web: @tanstack/react-query · zustand                 why: server-state + UI-state
- web: @xterm/xterm + @xterm/addon-fit                 why: terminal rendering for the PTY sessions
- web: @xyflow/react · mermaid · react-markdown + remark-gfm   why: artifact/diagram/flow rendering
- shared: @sdlc/shared                                 why: internal workspace types package

## Release policy           # read by /ship and /diagnose
- versioning: semver                 # why: mvp default — no tags exist yet; unconfirmed (tentative)
- tag_pattern: v{version}
- branching: git-flow                # why: detected — long-lived develop + main, work merges develop → main
- hotfix_path: "branch from the production ref; fix via /diagnose with a regression test; /mtdd-review + /mtdd-verify still mandatory; merge + deploy; backfill the chain artifacts (issue file + qa-report note) within a day"

## Uplift look-ahead
- signals: []               # none fired at intake; nothing for /architect to pre-size.

## TODO (tentative fields)
- [ ] nfr_ceiling_latency_p95_ms — default 1000ms; measure real PTY-echo + dashboard-load latency and tighten.
- [ ] release_policy.versioning — defaulted semver with no tags in repo; confirm or flip to none before first /ship.
- [ ] approved_dependencies — auto-seeded from manifests; prune deliberately (autonomous run, never human-reviewed).
