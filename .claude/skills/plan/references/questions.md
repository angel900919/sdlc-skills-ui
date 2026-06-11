# Plan question bank

Pull 5–10 when stuck — never all. **One question at a time. Propose a recommended answer**
(defaults from design's modules + PRD's F-IDs/stories + anchor's stack), then wait. Adapt
depth to `technical_user` from `.ai/intake.md`. Keep the jargon (tracer bullet, vertical
slice, EARS, idempotency) out of the question — it belongs in the artifact.

Tags: `[P]` prototype · `[M]` mvp · `[Pr]` production. Ask only those whose tier set covers
the PRD's inherited `tier:`.

## Phase 2 — the tracer bullet (Slice 1)
- What's the **smallest end-to-end** thing this feature can do? (Touches every layer it crosses; ships ≥1 requirement; merges without breaking.)
- What does *end-to-end* mean here? Walk me through every layer it touches (web-ui → DB→service→API→UI; pipeline → queue→worker→DB; AI → client→API→LLM→DB).
- Does the tracer return any hardcoded data? If yes, a layer isn't really wired — re-design it.
- Which single PRD requirement does the tracer satisfy? `[Pr]` an F-ID · `[M]` a user story.

## Phase 3 — remaining slices
- What's the next-most-important capability after the tracer? Trace it to ≥1 requirement.
- Can each slice ship to main alone without breaking anything? (Feature flag fine; broken stub not.)
- Is any slice user-invisible (refactor only)? If yes it's an ADR, not a slice.
- Are we over the tier's slice count (prototype 1–2 · mvp 3–5 · production 4–8)? If you're near 12, it's two features — split.

## Phase 4 — dependency ordering
- For each slice, what does it depend on? (Only prior slices.)
- Does any slice depend on a later one? Re-order.
- Are two slices independent of each other? Mark both `Depends on:` the common prior so they parallelize.

## Phase 5 — per-slice details
- Name (verb-noun behavior) and one-sentence goal — what works end-to-end after this slice?
- Which files? (Verbatim from design's layout — `new`/`modify`. Don't re-derive.)
- `[Pr]` Typed signatures for the slice's new functions?
- Satisfies which F-IDs / user stories + which NFR?
- New dependencies — which `Status: new` rows from `design.md § External dependencies` do this slice's files touch? (Verbatim — don't re-judge or invent.)
- Acceptance — which named test? `[M][Pr]` which NFR target + how measured? `[Pr]` which `fitness/<feature>/…` file (real path)?

## Phase 6 — invariants + Unwanted-behavior coverage
- For each invariant (architecture `## Invariants` at prototype, `02-components.md` at mvp+, or `.ai/understanding/<slug>.md`): does any slice introduce code that violates it?
- `[Pr]` Does every Unwanted-behavior EARS clause from the PRD ([`../../prd/references/ears.md`](../../prd/references/ears.md)) have a slice satisfying it? An empty Invariant-defense row ships code without the defense — add the slice.

## Phase 7 — read back
- Any slice that's actually two? Any horizontal layer disguised as vertical?
- Can Slice 1 merge to main without breaking?
- Every PRD F-ID `[Pr]` / user story `[M]` claimed by ≥1 slice? Every NFR covered?
- Every `New dependencies` row inherited verbatim from design — no inventions, no re-judging? Audit-clean acceptance on every dep-introducing slice?
- Within the tier line cap (90 / 185 / 250)? Any slice section > ~30 lines?

## Probing follow-ups (when an answer is vague)
- *"Could this slice ship alone and be reviewed in isolation? If no, split or merge."*
- *"What requirement does it satisfy — an F-ID/story, or it doesn't trace."*
- *"What test or fitness function proves it's done? Mechanical pass criteria, not 'looks good'."*
- *"Is this a refactor? Then it's an ADR, not a slice."*

## Questions to refuse (these belong elsewhere)
- *"What's the feature scope / the NFRs?"* → `/prd`
- *"What modules / schemas / API contracts?"* → `/design`
- *"What's the architecture style / components?"* → `/architect`
- *"What stack?"* → `/anchor`  ·  *"Advance the tier?"* → `/promote`
- *"Write the code for this slice."* → the build phase
- *"How long will Slice 3 take?"* → not here; a plan is a build contract, not a Gantt chart
- *"Should we open tickets?"* → `/to-issues` (expands slices into issue files) → `/publish-issues`
- *"Refactor while we're in there."* → out of scope; refactors get ADRs, not slices

All valid — just not in `/plan`.
