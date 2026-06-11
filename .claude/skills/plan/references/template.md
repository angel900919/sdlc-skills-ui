# `.ai/specs/<feature>/plan.md` skeleton

Assemble the plan from this. Fill only what the inherited tier requires (matrix:
[tier-matrix.md](tier-matrix.md)). **No diagrams, no `.human` mirror.** Frontmatter is the
index — schema in [`../../_shared/ai-schema.md`](../../_shared/ai-schema.md).

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: plan
status: draft | complete | blocked
tier: prototype | mvp | production        # INHERITED from prd.md — never recomputed
verdict: READY-FOR-ISSUES | NEEDS-RESLICE | BLOCKED-ON-DESIGN | BLOCKED-ON-PRD | BLOCKED-ON-ANCHOR
verdict_overridden: false
slice_count: <N>
tracer_slice: 1                            # Slice 1 is always the tracer bullet
source_design: .ai/specs/<feature>/design.md
source_prd: .ai/specs/<feature>/prd.md
source_anchor: .ai/anchor.md
consumed_by: [build, to-issues, qa]
created: YYYY-MM-DD
---

# Plan — <feature>

<!-- TIER MARKERS: [P] prototype (cap 90) · [M] mvp (cap 185) · [Pr] production (cap 250)
     Slice count: prototype 1–2 · mvp 3–5 · production 4–8. No slice section > ~30 lines.
     Slice numbering is STABLE across update-mode runs — dropped → `Slice N (removed)`. -->

## Slice 1 — <name> (TRACER BULLET)  [P][M][Pr]
`Status: pending`   <!-- pending | in-progress | done | blocked -->
- **Depends on:** nothing.
- **Goal:** <one sentence — what works end-to-end after this slice; touches every layer the feature crosses>
- **Files:**
  - <path/to/file.ts> — new | modify     <!-- verbatim from design's file layout -->
  - <path/to/file.test.ts> — new
- **Signatures `[Pr]`:** <typed signature, production only>
- **Satisfies:**
  - `[Pr]` PRD §F-1 — <one-line restatement>
  - `[M]` PRD §US-1 — <one-line restatement>
  - `[M][Pr]` PRD §NFR-1 — <capability target>
- **New dependencies:** <package (ecosystem), inherited verbatim from design § External deps; or `none`>
- **Acceptance:**
  - All named tests pass: <test path>.
  - `[M][Pr]` NFR-1 target met: <measurable threshold + how measured>.
  - `[Pr]` Fitness function `fitness/<feature>/<name>` passes.   <!-- real path from /to-fitness, or name the rule + flag -->
  - <!-- required only when New dependencies non-empty --> New deps resolve on registry against frozen lockfile; <pnpm audit | pip-audit | osv-scanner> clean in CI.

## Slice 2 — <name>  [M][Pr]
`Status: pending`
- **Depends on:** Slice 1.
- **Goal:** <one sentence>
- **Files:** <...>
- **Satisfies:** `[Pr]` PRD §F-2 · `[M]` PRD §US-2 · `[M][Pr]` PRD §NFR-2
- **New dependencies:** <... | none>
- **Acceptance:** <...>

<!-- Repeat per slice. Prototype: 1–2 total. MVP: 3–5. Production: 4–8. -->

## Slice N (removed)  [P][M][Pr]
<!-- Kept so downstream branches/PRs referencing the number don't break. Numbering stays stable. -->
<one-line reason, e.g. "rolled into Slice 3 after rescope">

## Invariant defense (production)  [Pr]
<!-- Every PRD Unwanted-behavior EARS clause defending an invariant maps to a slice.
     An empty Implementing-slice cell means the plan ships code without the defense — STOP, add the slice. -->
| PRD Unwanted clause | Invariant defended | Implementing slice |
| :-- | :-- | :-- |
| <F-N from PRD> | <invariant from architecture> | Slice N |

## Notes  [P][M][Pr]
- placement: <component from design's maps_to_component>
- research_open_questions_resolved: <list, or n/a>
- refactors_deferred: <these get ADRs, NOT plan slices — or none>
- supersedes: <prior plan version, if a v2 — or none>

## Verdict  [P][M][Pr]
**<VERDICT>** — <one paragraph: if READY-FOR-ISSUES, restate the build contract (slice count,
ordering, first-slice goal, prod invariant-defense coverage). If blocked/reslice, name what's needed.
If verdict_overridden: "User chose to continue past <verdict> because <reason>.">
```
