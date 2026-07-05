# Project State

_The single source of truth for "where are we." A fresh agent reads this first and resumes cold.
Agents update it at the end of every unit of work. Keep it short — archive old "Done" entries._

_Last updated: [YYYY-MM-DD] by [human name | agent]_

## Now — in progress
<!-- What is actively being worked. One line each. Link the plan and branch. -->
- [ ] [Task title] — owner: [name/agent] — plan: `.ai/plans/[file].md` — branch: `[branch]` — blocked by: [none | what]

## Next — ready and prioritized
<!-- Ordered. Top item is what a free agent should pick up. -->
1. [Task] — why now: [reason] — est. size: [S/M/L]
2. [Task] — why now: [reason]

## Done — recent (newest first)
<!-- Keep ~the last 10; move older to git history or a CHANGELOG. -->
- [YYYY-MM-DD] [Task] — [PR/commit] — [one-line outcome]

## Known issues / tech debt
- [Issue] — severity: [P0–P4] — [link/context] — [proposed fix or "needs triage"]

## Open questions for humans
<!-- Anything an agent should NOT decide alone. Blocks work until answered. -->
- [Question] — needs decision by: [when] — context: [link]

## Milestones (optional)
- [ ] [Milestone] — target: [date] — status: [on track / at risk]

---
### Example (delete when populating)
> ## Now — in progress
> - [ ] Add rate limiting to the public API — owner: agent — plan: `.ai/plans/002-rate-limiting.md` — branch: `feat/rate-limit` — blocked by: none
>
> ## Next — ready and prioritized
> 1. Migrate auth to short-lived tokens — why now: current tokens never expire (P1 security) — est. size: M
>
> ## Open questions for humans
> - Do we rate-limit by IP or by API key? — needs decision by: before implementation — context: `.ai/plans/002-rate-limiting.md`
