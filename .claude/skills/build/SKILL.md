---
name: build
disable-model-invocation: true
description: |-
  Per-feature execute-phase queue-brain and router. Reads the canonical issue files under .ai/specs (written by /to-issues, published by /publish-issues), detects which slices are already done across the beads, jira, or md backends, gates on dependency order, and picks the next unblocked slice to work — then routes it to /mtdd-implement. A pure read-and-route skill — it writes no .ai artifact and no .human mirror and never mutates the frozen canonical files (its only side effect is a progress-tracker append when a feature is fully built). Emits next-skill verdict tokens — READY-FOR-MTDD, READY-FOR-QA, or a BLOCKED-ON reason. Use when the user says "/build", "build the next slice", "execute the feature", "what should I work on next", or after /publish-issues emits READY-FOR-BUILD. Do NOT use for: writing or testing code (the mtdd-* atoms), publishing tickets (/publish-issues), generating issue content (/to-issues), planning slices (/plan), or feature-boundary verification (/qa).
---

# Build

The per-feature execute-phase **queue-brain + router**. It answers one question deterministically — *"what is the next slice to work, and is it unblocked?"* — and routes that slice to the executor. It sits between `/publish-issues` (the `READY-FOR-BUILD` source) and `/qa`.

It does **not** write, review, verify, or merge code (those are the `mtdd-*` atoms), and it does **not** announce or load rule packs (that is wholly `/mtdd-implement`'s concern). Read-and-route only.

<what-to-do>

## Critical rules (read before starting)

1. **Inputs are the canonical issue files** at `.ai/specs/<feature>/issues/SLICE-*.md` — written by `/to-issues`, flipped to `status: published` + `backend_refs` written by `/publish-issues`. The relevant fields: `status`, `type`, `depends_on`, `backend_refs`.
2. **No new artifact · no `.human` mirror.** This is a read-and-route skill. It authors no `.ai/<stage>.md` and no `.human/summaries/*` (like `/publish-issues`). Its only side effect is one `progress-tracker.md` append on `READY-FOR-QA`.
3. **The canonical file is frozen.** Never mutate `SLICE-N.md`. "Done" is a **runtime fact** read from the bead / Jira / materialized md — never a canonical `status:` value (which only ever moves `open → published → removed`). Runtime status is the `mtdd-*` atoms' job.
4. **Tier-agnostic.** Identical across prototype / mvp / production — tier shaping already happened upstream (see Tier matrix).
5. **Advisory gate.** Issue the real verdict with reasons; the user may override → record the reason in the run output (this skill writes no frontmatter of its own).
6. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — `/build` barely interrogates; keep any question jargon-free and propose the recommended answer.
7. **Verdict tokens name the next skill** — `READY-FOR-MTDD → /mtdd-implement`, `READY-FOR-QA → /qa`, `BLOCKED-ON-* → /<skill>`. The `mtdd-*` atoms are built; the autonomous `ralph-loop-afk` runner is **not built yet** (Phase 2) — `/build` hands off honestly, exactly as `/publish-issues` emitted `READY-FOR-BUILD` before `/build` existed.

## Procedure

```
build progress:
- [ ] Phase 0: Read tracker top 5; load every .ai/specs/<feature>/issues/SLICE-*.md
- [ ] Phase 1: Classify each slice done / not-done (done-detection below)
- [ ] Phase 2: Dependency-gate; pick the next ready slice (the TARGET)
- [ ] Phase 3: Append tracker (READY-FOR-QA only); issue exactly one verdict
```

### Phase 0 — Load
Read `.ai/progress-tracker.md` top 5 for context (expect a `publish-issues landed (<feature>)` entry as the upstream signal). Load all `SLICE-*.md` for the feature, sorted by slice number. No files at all → `BLOCKED-ON-ISSUES → /to-issues <feature>`.

### Phase 1 — Done-detection (per backend, tracker-agnostic)

A slice is **DONE** when **either**:
- canonical `status: removed` (dropped in a re-slice — skip it), **OR**
- its runtime backend is terminal:
  - **beads** ref → `bd show <id>` status is `closed`
  - **jira** ref → status category is `done` (`getJiraIssue` → `.fields.status.statusCategory.key`)
  - **md** ref → the materialized `tickets/<feature>/SLICE-N-<slug>.md` has a `## Completion` section (or has been archived)

Otherwise the slice is **not done**. A `published`/`open` slice with no terminal ref is not done. "Done/merged" is never a canonical `status:` — the `.ai` file is frozen.

### Phase 2 — Dependency-gate + pick
Scan slices in numeric order. Skip done slices. Skip any slice whose `depends_on` contains a not-yet-done slice. The **first** slice that is not done **and** has all dependencies done is the next to work:
- if its `status: published` (a routable bead/md exists) → it is the **TARGET** → `READY-FOR-MTDD`.
- if its `status: open` (publish never ran, or a partial publish left it behind — nothing to attach runtime status to) → `BLOCKED-ON-PUBLISH → /publish-issues <feature>`.

If no such slice exists: all slices done → `READY-FOR-QA`; else (not-done slices remain but every one is blocked on an unmet dependency) → `BLOCKED-ON-DEPENDENCY`.

### Phase 3 — Verdict
Append a tracker entry on `READY-FOR-QA` only (per [`../_shared/conventions.md` § Progress tracker](../_shared/conventions.md) format). Then issue exactly one:

- **`READY-FOR-MTDD → /mtdd-implement <feature> SLICE-N`** — next ready slice found and published. Hand off the slice path + bead id (if any). *"Next: `/mtdd-implement <feature> SLICE-N` — or `/mtdd-cycle-i-r-v <feature> SLICE-N` to run implement → review → verify hands-free, then merge manually after the smoke check."* If the slice is `type: afk`, still route here in Phase 1 (the human runs every slice through the manual mtdd loop) — note it is AFK-eligible and will route to `ralph-loop-afk` in Phase 2 (`type` is advisory until then).
- **`READY-FOR-QA → /qa <feature>`** — every slice is done. Append the tracker entry.
- **`BLOCKED-ON-DEPENDENCY`** — not-done slices remain but all are blocked. Name the earliest not-done slice and its unmet dependency: *"SLICE-N waits on SLICE-M — re-run `/build <feature>` after SLICE-M is done."*
- **`BLOCKED-ON-PUBLISH → /publish-issues <feature>`** — the next ready slice is still `open` (unpublished). Run `/publish-issues` first so a bead/md exists to attach runtime status to.
- **`BLOCKED-ON-ISSUES → /to-issues <feature>`** — no `SLICE-*.md` files exist.

</what-to-do>

<supporting-info>

## Position in SDLC

```
... /plan → /to-issues → /publish-issues (READY-FOR-BUILD) → /build (HERE)
    → /mtdd-implement · /mtdd-review · /mtdd-verify · /mtdd-merge  (the cycle, per slice)
    → (loop until every slice done) → /qa → /ship
```

`/build` is the loop's traffic controller: each invocation routes exactly one slice into the cycle; once the cycle merges it, re-run `/build` for the next. When the queue empties, `/build` flips the feature toward `/qa`.

## What this skill refuses to do

- **Writing / reviewing / verifying / merging code** → the `mtdd-*` atoms
- **Announcing or loading rule packs** → `/mtdd-implement` (it briefs the `_build_share` packs for the slice it implements)
- **Mutating any canonical `SLICE-N.md`** → frozen after `/to-issues`; runtime status lives on the bead / materialized md
- **Publishing to a tracker** → `/publish-issues`
- **Feature-boundary verification** → `/qa`

## Tier matrix

Purely mechanical — **identical across prototype / mvp / production**. The canonical issue files already carry the tier-shaped fields; nothing here is tier-specific. Canonical cross-skill rules: [`../_shared/conventions.md`](../_shared/conventions.md).

## Cross-cutting notes

- **Idempotent / stateless** — `/build` derives the next slice fresh each run from the issue files + tracker state; re-running after no change yields the same verdict.
- **`backend_refs` is read-only here** — `/publish-issues` is its only writer; `/build` queries the referenced bead/issue/md for terminal state but never edits the ref.

</supporting-info>
