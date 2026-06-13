# Anchor verdict hand-off

Verdict-specific hand-off prose. Referenced from SKILL.md Phase 8 (verdict). Always include the lifecycle line; append the uplift note when signals fired.

## READY-FOR-ARCHITECT — fully locked

Branch on `project_type`:

**Greenfield:**
> *"Anchored at `tier=<tier>`. Next: `/architect` to design the high-level architecture — it reads `project_tier` from `.ai/anchor.md` and scales (prototype = single file; mvp = bundle; production = full pass). After architect, run `/bootstrap` to scaffold the runnable skeleton (component roots, dev scripts) — required before `/prd`, or Slice 1 of your first feature has nothing to thread through. Then per feature: `/prd <feature>` → `/design <feature>` → `/plan <feature>`."*

**Brownfield:**
> *"Anchored at `tier=<tier>`. Next: `/explore` (recommended) — maps the existing codebase and writes `.ai/recon.md`. Then `/comprehend` → `/architect` (update mode if `architecture.md` exists) → `/prd <feature>` per feature. Brownfield skips `/bootstrap` (skeleton is already on disk); per-feature reconnaissance is `/research <feature>`. Skip `/explore` only if you know the codebase cold."*

## READY-FOR-ARCHITECT — partial lock (≥1 tentative required field)

> *"Anchored at `tier=<tier>`, but these fields are tentative: [list]. The verdict is still READY-FOR-ARCHITECT — `/architect` works fine — but plan to confirm the tentatives before bumping the tier or going to production."*

Then append the matching greenfield/brownfield next-step block above.

## Lifecycle line (always append)

> *"This project is at stage `<tier>`. When you've validated it and want more rigor, run `/promote` — it gates the prototype → mvp → production transition, records the approval, appends to `stage_history`, and tells you which rigor skills to re-run (including `/anchor` update mode for the new tier's fields). Don't bump the tier by hand."*

## Uplift append (when `uplift_signals` is non-empty)

> *"Heads-up: uplift signals are present ([list], carried from intake). `/architect` will read these and reserve room for the higher-tier subsystems; `/prd` applies per-feature uplift automatically when a feature touches one of these signals. The signals don't change `project_tier` — that's a `/promote` decision."*

## BLOCKED-ON-INTAKE → /onboard | /intake

> *"Can't anchor yet — there's no `.ai/intake.md` (or the project itself isn't defined enough to pick a tier and stack). Start at the front door: `/onboard` if this is an existing repo, `/intake` if it's a fresh idea — that writes the intake stub anchor reads. Then come back. Nothing was written."* (Don't send them to `/discovery`: brownfield skips it, and without the intake stub anchor can't tell which path they're on.)
