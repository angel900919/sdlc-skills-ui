# ADR-0002: Reuse the chain's `project-state.py` as the state engine

Date: 2026-06-11 · Status: accepted

## Context

The dashboard needs project state: foundation progress, feature roster, slice
statuses, next actions. The skill chain already ships a read-only generator —
`.claude/skills/_build_share/project-state.py` → `dashboard/state.json` — which
is the exact spine `/status`, `/next`, and `/coherence-check` read.

## Decision

The backend shells out to that script (project's own copy first, this repo's
copy as fallback), debounced behind a chokidar watcher on `.ai/`, `.human/`,
`docs/`, `tickets/`, `fitness/`. The dashboard renders the same state the
skills see; a typed stage model in `packages/shared` layers the pipeline
visualization on top.

## Consequences

- ✅ Zero drift between dashboard and chain tooling; upgrades to the chain's
  state model are picked up for free.
- ✅ Python stdlib only — no extra dependency weight.
- ⚠️ Python 3 required at runtime (documented).
- ⚠️ State freshness is poll/event-driven (~1 s after artifact writes), which
  is ample for human-paced workflows.
