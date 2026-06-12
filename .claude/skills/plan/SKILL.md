---
name: plan
disable-model-invocation: true
description: |-
  Decomposes a per-feature design into vertical, dependency-ordered, independently-mergeable slices under .ai/specs (one plan per feature). Slice 1 is always a tracer bullet — the thinnest end-to-end path. Inherits the effective tier from the feature's PRD and never recomputes it; each slice traces to PRD functional requirements or user stories and carries mechanical acceptance (tests, NFR targets, and at production a named fitness function). Inherits external dependencies verbatim from the design — propagation, not re-judgment. Pairs 1:1 with /design; each slice is one PR. Use when the user says "/plan", "plan the build", "break this into slices", "slice order", "tracer-bullet plan", or after /design. Do NOT use for: feature scope or NFRs (/prd), implementation design, modules, or schemas (/design), high-level architecture or components (/architect), stack and tier lock (/anchor), writing code (the build phase), or ticket creation (/to-issues).
---

<what-to-do>

You produce the **per-feature build plan** — the order, the slices, and the acceptance — at `.ai/specs/<feature>/plan.md`. It pairs 1:1 with `/design`: design is *"what gets built and where"*, plan is *"in what order, in what slices, with what mechanical pass criteria."* You run once per feature, after `/design` (production routes through `/to-fitness` first). The plan is the build contract — **each slice is one PR**.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/specs/<feature>/plan.md` schema) before writing. Don't restate them — reference them.

## Vertical, not layered (the crux)

Each slice ships **end-to-end behavior** — it cuts through every layer the feature crosses, not one horizontal layer. *"The DB-schema slice"* / *"the API slice"* / *"the UI slice"* are rejected: merge them into vertical slices. **Slice 1 is always the tracer bullet** — the thinnest path from request to response with every layer wired up *for real* (no hardcoded stubs).

## No `.human` mirror — the read-back is the gate

`/plan` is the **one per-feature artifact that never mirrors** (per [`../_shared/conventions.md` § Human summaries](../_shared/conventions.md) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). A plan is a mechanical slice list the agent executes — there is no diagram and no separate human sign-off doc. The Phase-7 read-back *is* the human checkpoint. Do not set `human_summary`; do not write under `.human/`.

## Critical rules

1. **Design required → it pairs 1:1 with the plan.** No `.ai/specs/<feature>/design.md` → `BLOCKED-ON-DESIGN → /design <feature>`; nothing written. The design's modules + file layout become the plan's files — use them verbatim, don't re-derive.
2. **PRD required → it carries the tier + the trace anchors.** No `.ai/specs/<feature>/prd.md` → `BLOCKED-ON-PRD → /prd <feature>`. Read the effective `tier:` from the PRD frontmatter and **inherit it** (rule 9). Slices trace to its F-IDs / user stories / NFRs.
3. **Anchor required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`. Stack conventions drive file paths (design already concretized them; plan verifies).
4. **Slices are vertical, not horizontal.** Each cuts through every layer the feature crosses with working end-to-end behavior. Reject *"DB migrations first"*, *"API scaffolding first"* — re-propose end-to-end.
5. **Slices are independently mergeable.** Each ships working behavior to main without breaking anything (feature flag fine; broken stub not). **Slice 1 MUST be the tracer bullet** — thinnest end-to-end path, every layer wired for real. No effort estimates in time units (hours/days) — slices ship *"when done"*, not on a clock; a refactor with no user-visible behavior is not a slice → write an ADR.
6. **Each slice has mechanical acceptance.** Tests pass + (mvp+) ≥1 NFR target met *with measurement* + (production) ≥1 named fitness function under `fitness/<feature>/` passes. The fitness path must be a **real file on disk** written by [`/to-fitness`](../to-fitness/SKILL.md) — never invent one. If `/to-fitness` hasn't run, name the *rule* the slice must satisfy and flag it (`fitness function not yet generated — run /to-fitness <feature>`). Reject *"code review passes"* / bare *"all tests pass"*.
7. **Each slice traces to the PRD.** Production: ≥1 F-ID (EARS clause, see [`../prd/references/ears.md`](../prd/references/ears.md)). MVP: ≥1 user story. mvp+: ≥1 NFR. A slice that satisfies nothing is speculation — drop it, or if the PRD is missing the requirement, bounce to `/prd` update mode.
8. **Honor invariants.** No slice may introduce code that violates an invariant from architecture (`## Invariants` inline at prototype, `02-components.md` at mvp+) or `.ai/understanding/<slug>.md`. Cross-check in Phase 6 before writing.
9. **Tier inherited from `prd.md`, never recomputed.** Plan does not re-scan uplift signals — that was the PRD's job (`max(project_tier, feature_uplift)`). Match slice count, depth, and line cap to the inherited tier. Tier disputes go upstream (`/prd` re-run or `/promote`).
10. **Dependencies: propagation, not judgment.** Read `design.md § External dependencies` + frontmatter `dep_adds[]`. Record which slice introduces each `new` package — **inherited verbatim**: never re-judge a trust decision, never substitute, never invent a package design didn't list. A slice whose files clearly need an undeclared import is a design gap → `BLOCKED-ON-DESIGN`. Every slice with a non-empty `New dependencies` carries a mechanical-verification acceptance line (registry-resolve clean + `audit` clean in CI). Detail: [`../design/references/deps-governance.md`](../design/references/deps-governance.md).
11. **Update mode preserves slice numbering.** Slice 3 stays Slice 3 even if Slice 2 is dropped — downstream PRs/branches reference numbers. Mark removed slices `Slice N (removed)` with a one-line reason; never renumber.
12. **Tier line caps (hard): 90 / 185 / 250.** No single slice section exceeds ~30 lines. Over cap → the feature is two features or the slices are too big — cut to the JTBD-critical path, split, run `/plan` again for the second set. Per-tier matrix: [references/tier-matrix.md](references/tier-matrix.md).
13. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer (defaults from design's modules + PRD's F-IDs + anchor's stack), wait. Adapt to `technical_user` from `.ai/intake.md`. Keep the jargon (tracer bullet, vertical slice, EARS, idempotency) in the `.ai/` artifact — never in the question.
14. **Read back before writing.** Assemble from [references/template.md](references/template.md), scan against [references/anti-patterns.md](references/anti-patterns.md), strip symptoms, then read it back: *"any slice that's actually two? Any horizontal layer disguised as vertical? Can Slice 1 merge without breaking? Every requirement claimed by ≥1 slice?"* Edit for fidelity.
15. **The gate is advisory.** Issue the real verdict with reasons; the user may override a negative verdict → `verdict_overridden: true` + recorded reason, still write the artifact. Never water down.
16. **Tracker.** Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on `READY-FOR-ISSUES` per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
plan progress:
- [ ] Phase 0: Load tracker top 5; detect existing plan.md (update mode if present)
- [ ] Phase 1: Load design (REQUIRED) + prd (REQUIRED → tier) + anchor (REQUIRED); research/architecture warn; inherit tier; announce
- [ ] Phase 2: Identify the tracer bullet (Slice 1)
- [ ] Phase 3: Decompose remaining work into vertical slices
- [ ] Phase 4: Order slices by dependency
- [ ] Phase 5: Per-slice details (files, signatures [Pr], satisfies, new deps, acceptance)
- [ ] Phase 6: Invariant cross-check + Unwanted-behavior coverage [Pr]
- [ ] Phase 7: Read back; scan anti-patterns; collect corrections
- [ ] Phase 8: Write .ai/specs/<feature>/plan.md (tier cap)
- [ ] Phase 9: Append tracker (success only); issue verdict
```

### Phase 0 — Session context + mode
Read `.ai/progress-tracker.md` top 5 (expect a `design landed (<feature>)` entry, maybe `to-fitness landed`). Then look for `.ai/specs/<feature>/plan.md`. If it exists: restate current slice count + which slices are `Status: done`, ask which slices to update or whether to rebuild (**update mode** — preserve unnamed slices; keep numbering stable; dropped → `Slice N (removed)`).

### Phase 1 — Inputs + tier + announce
Load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/specs/<feature>/design.md` | module list, file layout, call flow, failure modes, **External dependencies** | **BLOCKED-ON-DESIGN** |
| `.ai/specs/<feature>/prd.md` | effective `tier:` (INHERIT), scope, F-IDs (production EARS), user stories (mvp), NFR table (mvp+), Unwanted-EARS (prod) | **BLOCKED-ON-PRD** |
| `.ai/anchor.md` | stack conventions (verify file paths) | **BLOCKED-ON-ANCHOR** |
| `.ai/specs/<feature>/research.md` | prior-art patterns so slice ordering can lean on existing code | warn |
| `.ai/architecture[.md\|/]` | invariants for the Phase-6 cross-check | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Inherit the PRD's `tier:` verbatim (rule 9). **Announce:** *"PRD tier: mvp. Feature: `invoice-send`. 4 modules in design, 6 F-IDs / 3 user stories in PRD, 5 NFRs. Running mvp-tier plan: 3–5 vertical, dependency-ordered slices, ≤185 lines. Proceed?"*

### Phase 2 — The tracer bullet (Slice 1)
The thinnest end-to-end path that (a) touches **every layer the feature crosses** (DB→service→API→UI for web-ui; queue→worker→DB for a pipeline; client→API→LLM→DB for AI), (b) ships ≥1 requirement worth of behavior (the smallest), (c) merges to main without breaking anything. Reject *"all migrations first"* (layered) and *"endpoint with hardcoded data"* (doesn't prove DB wiring). At mvp+, when `.ai/test-strategy.md` maps this feature's journey to an E2E spec file, the tracer bullet's Acceptance includes extending that named spec — the journey suite is extended, never paralleled. Shapes: [references/examples.md](references/examples.md).

### Phase 3 — Decompose remaining work
After the tracer, each remaining slice adds **one capability**, is independently mergeable, and traces to ≥1 requirement. Slice count by tier: prototype 1–2 · mvp 3–5 · production 4–8. Proposing 12 → the feature is two features; split and recommend a follow-up `/plan` for the second set.

### Phase 4 — Order by dependency
Slice N may depend only on Slices 1..N-1. If Slice 3 needs Slice 5, re-order. Two slices that depend only on a common prior are parallelizable — mark both `Depends on: Slice X` (two devs, two PRs).

### Phase 5 — Per-slice details
For each slice capture: **Name** (verb-noun behavior) · **Depends on** (`nothing` or prior slices) · **Goal** (one sentence; what works end-to-end after) · **Files** (concrete paths from design's layout, `new`/`modify` — verbatim, don't re-derive) · **Signatures** `[Pr]` (typed) · **Satisfies** (F-IDs/stories + ≥1 NFR per rule 7) · **New dependencies** (per rule 10 — verbatim from design, or `none`) · **Acceptance** (per rule 6). Question bank when stuck: [references/questions.md](references/questions.md).

### Phase 6 — Invariant cross-check + Unwanted-behavior coverage
**Invariants** (when architecture/understanding loaded): for each, check no slice introduces violating code; rework the slice or (rare) update the invariant via `/architect`. **Unwanted-behavior coverage** `[Pr]`: every PRD Unwanted-behavior EARS clause that defends an invariant MUST be satisfied by ≥1 slice — build the Invariant-defense table (template). An empty row means the plan ships code without the defense → STOP, add the slice, re-run Phase 5 for it.

### Phase 7 — Read back
Scan the assembled plan against [references/anti-patterns.md](references/anti-patterns.md), strip symptoms, then read it back (rule 14). Edit for fidelity.

### Phase 8 — Write the file
Write `.ai/specs/<feature>/plan.md` from [references/template.md](references/template.md), enforcing the tier line cap (90/185/250); over → split (rule 12). **Update mode** — preserve slice numbering; dropped → `Slice N (removed)`. No `.human` mirror.

### Phase 9 — Tracker + verdict
Append a tracker entry on `READY-FOR-ISSUES` only. Issue exactly one verdict:

- **`READY-FOR-ISSUES → /to-issues`** — slices vertical + ordered + traceable + mechanical acceptance defined + (prod) invariant defenses covered. Hand off (full prose: [references/hand-off.md](references/hand-off.md)): *"Plan is the build contract — each slice is a PR. Next: `/to-issues <feature>` expands the slices into canonical issue files; `/publish-issues` then mints a bead per slice and `READY-FOR-BUILD` opens the build loop. (Shortcut: a quick prototype may skip the tracker and build straight from `plan.md`.) The builder uses the exact packages named in `New dependencies` — no substitutions."*
- **`NEEDS-RESLICE`** — at least one slice is horizontal, mega, not independently mergeable, or missing a PRD trace. Name which and what to fix.
- **`BLOCKED-ON-DESIGN → /design`** — design missing, blocked, or has an unresolved `NEEDS-PROTOTYPE` / `NEEDS-ARCHITECTURE-UPDATE` (or a slice needs an import design never declared). Nothing written.
- **`BLOCKED-ON-PRD → /prd`** — PRD missing or blocked. Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no `anchor.md`. Nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/plan.md`** — MACHINE-facing per-feature build plan. Frontmatter index + fixed-order slices (each with files, satisfies, new deps, acceptance) + production invariant-defense table. Read by the build phase, `/to-issues`, `/qa`. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams, no `.human` mirror** — the one per-feature artifact that never mirrors.

## References
- Per-tier slice counts, depth matrix, line caps 90/185/250: [references/tier-matrix.md](references/tier-matrix.md)
- The `plan.md` skeleton to assemble from: [references/template.md](references/template.md)
- Question bank — pull 5–10 when stuck, never all: [references/questions.md](references/questions.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Tracer-bullet / PRD-trace / acceptance shape examples: [references/examples.md](references/examples.md)
- Verdict-specific hand-off prose: [references/hand-off.md](references/hand-off.md)
- EARS clauses production slices trace to (one-hop): [`../prd/references/ears.md`](../prd/references/ears.md)
- Dependency governance the plan propagates (one-hop): [`../design/references/deps-governance.md`](../design/references/deps-governance.md)

</supporting-info>
