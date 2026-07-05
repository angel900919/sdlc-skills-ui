# 0001 — Record decisions as you go

- **Date:** [YYYY-MM-DD]
- **Status:** accepted
- **Deciders:** [team]

## Chose
Every non-trivial or irreversible decision made during a session is recorded here before or as the code lands — not reconstructed later.

## Why
Agents and humans share one failure mode: limited context. A rejected approach with no record gets re-proposed by the next fresh session, wasting a full round-trip. Capturing the *why* turns each decision into retrievable precedent.

## Rejected
- Rely on git history / PR descriptions — rejected because they capture the *what*, not the *why*, and aren't loaded into an agent's context.
- One giant DECISIONS.md — rejected because it always loads whole; one file per decision loads on demand.

## Consequences / constraints this creates
- Agents must add a decision entry when they make a choice with real blast radius, and cite existing decisions before choosing.
- A doc-drift check should flag architecture changes that lack a corresponding decision entry.
