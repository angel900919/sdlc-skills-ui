# /to-issues verdict hand-off + recovery paths

For each verdict: the user-facing hand-off prose + (for non-success) the recovery path.
Referenced from `SKILL.md` Phase 7.

## `READY-TO-PUBLISH → /publish-issues`
> *"Issue files at `.ai/specs/<feature>/issues/` — plain markdown + YAML frontmatter; inspect them in your editor. features.md status is now `building`. Next: `/publish-issues <feature> --backend=beads` to mint a bead per slice for the build loop (the bead ID is what you feed `/mtdd-implement`); `--backend=jira` or `--backend=md` for human visibility. Re-runs on both sides are idempotent."*

Recovery: none — proceed to `/publish-issues`.

## `NEEDS-STATUS-RESOLUTION → /feature-map`
Issue files are valid, but `features.md` status was `qa-approved`/`shipped`/`deferred`/`never` and the `planned → building` flip was refused.
> *"Feature `<slug>` is `<status>` in features.md — issues were (re)written but status NOT changed. Run `/feature-map` in update mode to either re-open it (flip status back, if this is intentional rework) or rename the slug (if this is a name collision). Then re-run `/to-issues`."*

Recovery: 1) decide rework vs collision; 2) rework → `/feature-map` update mode flips status back; 3) collision → rename the slug in `plan.md`/`prd.md`/`design.md`; 4) never hand-edit features.md status here — `/feature-map`/`/qa`/`/ship` own transitions.

## `NEEDS-RESLICE`
> *"Slice 3's issue exceeds the line cap — the slice is doing three things. Bounce to `/plan <feature>` update mode, split it, then re-run `/to-issues`."*

Recovery: 1) read the named slice + reason; 2) `/plan` update mode to split (or merge a too-narrow slice); 3) re-run `/to-issues` — numbering is stable, so unchanged slices keep their numbers.

## `BLOCKED-ON-PLAN → /plan`
> *"`.ai/specs/<feature>/plan.md` is missing or not at a build-ready verdict. Run `/plan <feature>` until it lands `READY-FOR-BUILD`, then re-run `/to-issues`."*

## `BLOCKED-ON-PRD → /prd`
> *"`.ai/specs/<feature>/prd.md` is missing or blocked. Walk `/prd → /design → /plan` forward, then re-run `/to-issues`."*

## `BLOCKED-ON-ANCHOR → /anchor`
> *"No `.ai/anchor.md` — the default `language:` and the AFK-eligibility path conventions live there. Run `/anchor` first."*
