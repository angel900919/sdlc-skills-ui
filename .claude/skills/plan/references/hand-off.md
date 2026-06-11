# /plan verdict hand-off

Verdict-specific hand-off prose. Referenced from `SKILL.md` Phase 9 (verdict).

## After `READY-FOR-ISSUES`

> *"Plan is the build contract — each slice is one PR. Start with Slice 1 (the tracer
> bullet); when a slice ships, mark it `Status: done` in `plan.md`. The builder uses the
> exact packages named in each slice's `New dependencies` — no substitutions, no additions.
> If reality diverges from a slice, re-run `/plan` in update mode (slice numbering stays
> stable). Next: `/to-issues <feature>` expands these slices into canonical issue files, then
> `/publish-issues` mints a bead per slice and emits `READY-FOR-BUILD` to open the build loop.
> (Shortcut: a quick prototype may skip the tracker and build straight from this plan.)"*

## After `NEEDS-RESLICE`

Name exactly what to fix:

> *"Slice 3 is horizontal (DB-only). Merge it with Slice 4 (API + UI) into one vertical
> slice that ships the discount-apply behavior end-to-end. Re-run `/plan` after."*

## After `BLOCKED-ON-DESIGN`

> *"Design at `.ai/specs/<feature>/design.md` is missing, `Status: blocked`, or has an
> unresolved `NEEDS-PROTOTYPE` / `NEEDS-ARCHITECTURE-UPDATE` (or a slice needs an import the
> design never declared in § External dependencies). Re-run `/design <feature>` to resolve.
> Nothing written."*

## After `BLOCKED-ON-PRD`

> *"No usable PRD at `.ai/specs/<feature>/prd.md` (missing or blocked). The PRD carries the
> tier and the requirements every slice traces to. Run `/prd <feature>` first. Nothing
> written."*

## After `BLOCKED-ON-ANCHOR`

> *"No `.ai/anchor.md`. The stack conventions there drive the file paths a plan verifies.
> Run `/anchor` first. Nothing written."*
