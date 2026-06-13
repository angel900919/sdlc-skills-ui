# Anchor — the foundation we locked

We locked the SDLC Command Center as an **mvp-tier** TypeScript monorepo: a React/Vite web app and a Fastify server that drives the Claude Code CLI through real terminals, with a local SQLite database — everything runs on your own machine.

- **Stack (all detected from the repo, not chosen fresh):** TypeScript everywhere; React + Vite + Material UI on the web side; Fastify with WebSockets and node-pty on the server side; SQLite via better-sqlite3 for local persistence.
- **No sign-in, no cloud:** the app serves one local user on localhost — auth is deliberately `none`, hosting is `local-only`. If it ever serves anyone else, that's a re-anchor conversation.
- **AI is *not* in this app's core path:** it hosts the Claude CLI in a terminal but never calls a model itself, so there are no provider/model/cost decisions to lock here.
- **Releases:** work flows develop → main (git-flow style, detected from the branches). Versioning defaulted to semver but **no tags exist yet — tentative**, confirm before the first `/ship`.
- **Tentative (revisit before any tier bump):** the 1-second latency ceiling (never measured), the semver choice, and the dependency allowlist (auto-seeded from the manifests, not yet hand-pruned).
- **Lifecycle:** this project is at stage `mvp`; run `/promote` to advance — don't bump the tier by hand.

Machine source of truth: [.ai/anchor.md](../../.ai/anchor.md). Next: `/explore` maps the code, then `/comprehend` confirms the domain, then `/architect`.

*(Autonomous dogfood note: tier confirmation and the read-back were auto-accepted under the owner's standing instruction; nothing here was confirmed by a live human.)*
