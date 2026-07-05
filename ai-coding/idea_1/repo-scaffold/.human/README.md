# .human/ — Documentation for Developers

Plain-English documentation for the people who build and maintain this project. Where `.ai/` is optimized
for an agent orienting fast (terse, structural), `.human/` is optimized for a person understanding *why*
and *how* (narrative, diagrams, examples).

## Start here
- **New to the project?** → [onboarding.md](onboarding.md)
- **Understanding the system?** → [architecture.md](architecture.md) (with diagrams)
- **Why is it built this way?** → [adr/](adr/) (Architecture Decision Records)
- **A specific feature?** → [features/](features/)
- **Something's broken?** → [troubleshooting.md](troubleshooting.md)
- **Operating in production?** → [runbooks/](runbooks/)

## Keeping it honest
`.human/architecture.md` and `.ai/architecture.md` describe the same system at different altitudes.
When a boundary changes, update both — a doc-drift CI check should flag code changes whose docs went stale.
Stale documentation is worse than none: people and agents both trust it.
