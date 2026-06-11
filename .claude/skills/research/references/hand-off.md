# /research verdict hand-off

Verdict-specific hand-off prose. Referenced from `SKILL.md` Phase 8 (verdict).

## After `READY-FOR-DESIGN`

> *"Research is set. Next: `/design <feature>`. The 'Open questions for design' section is the
> contract — design must close each one. Library options stay options until `/design` picks.
> `/plan` will also read this file's prior-art citations for slice ordering."*

## After `RESCOPE-NEEDED`

Name the conflict:

> *"Research found `src/orders/invoice.ts:L42` already implements `sendInvoice()` — the PRD
> scope claims this is new capability. Run `/prd <feature>` in update mode to narrow the PRD
> (defer the parts that already exist) or kill it (already shipped). Saving partial research
> as `Status: blocked`."*

## After `BLOCKED-ON-PRD` / `BLOCKED-ON-ANCHOR`

> *"`<prd.md | anchor.md>` is missing. Run the upstream skill first (`/prd <feature>` or
> `/anchor`). Nothing written."*

## Greenfield skip (not a verdict — a pre-gate)

> *"This is a greenfield project — there's no existing code to scout. `/design` reads the
> stack from `anchor.md` directly. Go to `/design <feature>`."*
