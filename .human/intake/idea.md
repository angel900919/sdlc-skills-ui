# SDLC Command Center — what it is

**In one line:** A local web app that lets one developer drive Claude Code and the AI-assisted SDLC skill chain from a browser instead of a raw terminal.

## Who uses it
Andres — a solo developer who runs an AI-assisted software lifecycle (the 55-skill SDLC chain) across his projects. He works with Claude Code in the terminal all day and wants the project's state and the agent sessions visible in one place instead of scattered across terminal scrollback and markdown files.

## What it does
The main things it lets him do today:
1. Drive Claude Code sessions from the browser — real terminals (PTYs) rendered in the page, so the agent runs exactly as it would in a shell.
2. See the project's SDLC state at a glance — features, slices, verdicts, and progress pulled from the chain's artifact files and shown as a dashboard.
3. Read the chain's documents comfortably — markdown artifacts, diagrams, and flow views rendered instead of read raw.

## How we'll know it's working
Driving a project through the chain feels faster and clearer than the raw terminal — he can tell where any feature stands without opening files.

## Edges & rules
Local-first by design: it runs on his machine, drives his own CLI, and never needs API credits or external services. No money, personal data, uptime promises, or outside parties involved.

## The stack at a glance
A TypeScript monorepo: a React web app (Vite, Material UI, xterm.js for the terminals) talking to a small local server (Fastify with WebSockets) that spawns the CLI in pseudo-terminals and keeps a small SQLite database. A shared types package sits between them. `/anchor` will lock the details.

## What we want to do now
Run the SDLC chain itself on this repo (dogfooding): understand the app through the chain's own recon steps, then add new features off the existing roadmap through the per-feature loop.

## A picture of it
*(skipped — the stack-at-a-glance paragraph covers the shape; recon diagrams come later in the chain)*

## What I assumed
- This run is autonomous: answers were taken from the project's session records rather than a live conversation, under the owner's standing instruction to assume defaults.
- Predicted tier **mvp**, not prototype: the app already ships to its (one) user and is relied on daily with a maintained test suite — but nothing pushes it to production rigor (no money, PII, SLA, or external dependants).
- The read-back step was auto-confirmed (no live human in the loop).

## Still open
- Whether the SQLite database holds anything that needs a data policy beyond "local cache" — `/explore` and `/data-management` will establish that.
- Which roadmap feature goes through the per-feature loop first — decided at `/feature-census`.

---
*Machine details for the AI workflow live in `.ai/intake.md`. Next step: `/anchor` to confirm and lock the stack, then `/explore` to map the code.*
