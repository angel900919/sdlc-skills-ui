# Memory — Index

_The always-loaded index of durable, learned facts. Keep this lean — it points to topic files
that load only when needed. This is the "index + on-demand bodies" pattern every major harness
converged on. Prune monthly; a stale fact poisons an agent that trusts it._

## How to use
- Add a fact here only if a future agent would plausibly act better because of it (the signal gate).
- Facts about file paths, APIs, or commands carry drift risk — re-verify against the repo before acting.
- When ~10 related notes accumulate on one topic, compact them into a topic file (or a skill) and link it here.

## Topics
- [example-topic.md](example-topic.md) — [gotchas the model gets wrong about this stack]
- [`[build-and-deploy].md`] — [non-obvious build/deploy facts]
- [`[domain-glossary].md`] — [project-specific terms and what they mean]

## Loose facts (promote to a topic file when a cluster forms)
- [YYYY-MM-DD] [A single durable fact. e.g. "The staging DB resets nightly at 02:00 UTC."]
