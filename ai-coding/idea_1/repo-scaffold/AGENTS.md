# AGENTS.md

[One-sentence description of the project, e.g. "REST API and web client for managing customer subscriptions."]

## Commands
- Install: `[cmd]`
- Test: `[cmd]` (single test: `[cmd] path/to/test]`)
- Build: `[cmd]`
- After any change: `[lint --fix && typecheck cmd]`
- Full check (same as CI): `scripts/check`

## Structure
- `src/` — product code
- `.ai/` — agent knowledge & state (read this before starting)
- `.human/` — human documentation
- `tests/` — tests (do NOT edit during the green phase; see coding-standards)

## IMPORTANT: read before starting any task
1. `.ai/project-state.md` — what's done, in progress, and next.
2. `.ai/architecture.md` — components, boundaries, invariants.
3. `.ai/coding-standards.md` — conventions and enforced rules.
4. `.ai/workflow-rules.md` — how we work here (plan first, verify, etc.).

Then, only the deeper doc relevant to your task:
| Task type | Read |
|---|---|
| New feature / change | the matching `.ai/plans/` file, or write one first |
| Architectural choice | `.ai/decisions/` (never contradict an accepted one; propose a new one first) |
| Debugging | `.human/troubleshooting.md` |
| Anything unfamiliar | `.ai/memory/MEMORY.md` (index of learned facts) |

## Ground rules
- Give every change a runnable check and show its output. Never claim success without evidence.
- Prefer editing existing code over adding parallel implementations. YAGNI.
- Never edit files under protected paths (see coding-standards) without explicit human approval.
- Update `.ai/project-state.md` when you finish a unit of work. Record decisions in `.ai/decisions/`.
