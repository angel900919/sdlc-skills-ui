# /health-audit anti-patterns

Patterns to reject. Scan findings against this before publishing (Phase 3–5).

| Anti-pattern | Refuse because |
|---|---|
| Editing source to "fix" a finding | This skill registers; fixing is `/diagnose` or a build slice. |
| A finding with no `path:line` | Unverifiable — it's a hypothesis. Route to `/diagnose` (`needs_confirmation`) or drop. |
| Re-implementing a security/arch checklist inline | The owning discipline already has it — brief the sub-agent with it (`references/lenses.md`). |
| Running all six lenses on a prototype | Tier-scale: prototype = critical + security only. |
| Spawning the lenses one at a time | They're independent and read-only — fan out in one message so they run concurrently. |
| Publishing P0/P1 without the verify wave | Unverified findings are hypotheses; an unconfirmed P0 wastes triage and erodes trust in the gate. |
| Letting the fan-out "auto-clear" the gate because it ran autonomously | Phase 6 is human-approved regardless of how the lenses ran; read-only parallelism never extends to the gate. |
| Auto-passing the gate without the user | The brownfield rule is a human-approved decision. |
| Two tickets for one `path:line` found by two lenses | Dedupe to one at the higher severity, cross-reference the secondary lens. |
| Publishing without writing refs back to the report | Register and tracker must stay linked. |
| Dropping a section to fit the line cap | Prune lowest-signal findings per lens; keep the section. |
| Greenfield run | Nothing to audit — that's `/intake`/`/onboard`. |

## Refused questions
- "Fix these for me." → `/diagnose` (a bug) or a build slice via `/to-issues`.
- "Just map the code." → `/explore` (facts only).
- "Root-cause this one crash." → `/diagnose`.
- "Propose the refactor in detail." → `/improve-codebase-architecture`.
- "Is my feature done / verified?" → `/qa <feature>`.
- "Prioritize these tickets." → `/triage` (it reads the labels this skill writes).
