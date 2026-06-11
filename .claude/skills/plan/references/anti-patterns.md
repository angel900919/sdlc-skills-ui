# /plan anti-patterns

Patterns to reject. Referenced from `SKILL.md` Phase 7 (read back) — scan the assembled plan
before pasting and strip any rejection-class symptom.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Horizontal slice | "Slice 1: DB schema" / "Slice 2: API layer" / "Slice 3: UI" | Merge into one vertical slice that touches all three with working end-to-end behavior. |
| Mega-slice | One slice doing 5 unrelated things | Split. Each slice ships one capability. |
| Slice without PRD trace | Slice satisfies no F-ID / user story | Add the requirement (probably missing from the PRD — bounce to `/prd` update mode) or drop the slice. |
| No tracer bullet | Slice 1 isn't end-to-end | Re-design Slice 1 to wire the thinnest path through every layer. Otherwise integration risk stays high until very late. |
| Stub-only tracer | Slice 1 returns hardcoded data | Tracer must prove every layer for real. Hardcoded means a layer is untested — a bug waits. |
| Slice depends on a later slice | Slice 3 depends on Slice 5 | Re-order. Slice N depends on 1..N-1 only. |
| Acceptance is "code review passes" | Vague human gate, not mechanical | Force concrete pass criteria: named tests + named NFR targets + (production) named fitness functions. Without mechanical acceptance, "done" is opinion. |
| Effort in days | "Slice 1: 2 days, Slice 2: 5 days" | Drop. Plan is a build contract, not a Gantt chart. Effort estimates go in a tracker. |
| Slice = "refactor X" | Slice has no user-visible behavior | Refactors get ADRs, not plan slices. Plan slices ship behavior visible at a PRD requirement. |
| Slice file paths drift from design | `apply.ts` in plan, `apply-discount.ts` in design | Use design's paths verbatim. If they're wrong, fix `/design` first; don't drift in `/plan`. |
| Production plan ships code without invariant defense | Production feature, PRD has Unwanted-behavior EARS clauses, no slice implements them | Add a slice (or fold into a slice's acceptance) per Unwanted-behavior clause. The Invariant-defense table makes the gap visible. |
| Update-mode renumbering | Dropped Slice 2 → old Slice 3 became new Slice 2 | Stable numbering. Mark dropped slices `Slice 2 (removed)`. PRs referencing "Slice 4" don't break. |
| Re-judging design's dep trust | Plan's `New dependencies` row drops, adds, or substitutes a package design didn't list — or relabels a refused dep as approved | Plan is propagation, not judgment. Bounce to `/design` update mode to revisit External dependencies. |
| Inventing a dependency design didn't declare | A slice's files clearly imply an import (e.g. a Stripe handler) the design's External-dependencies section never named | A design gap, not a plan gap. `BLOCKED-ON-DESIGN → /design`; surface the missing dep. |
| Audit-clean acceptance missing on a dep-introducing slice | Slice has a non-empty `New dependencies` block but no `audit clean in CI` acceptance line | Add it. Without the mechanical gate, plan-time trust is theatrical — a ghost can still install. |
| `Slice 0 — dependency validation & guardrails` | A horizontal, no-user-visible-behavior slice dedicated to wiring dep gates | REJECTED — same rule as the no-tracer-bullet anti-pattern. Dep enforcement is CI/build config, not a slice. Slice 1 is always the tracer bullet. |
| Recomputing the tier | Plan re-scans uplift signals or picks its own tier | Tier is inherited from `prd.md` verbatim. Disputes go upstream (`/prd` re-run or `/promote`). |
| Writing a `.human` mirror | Plan emits a `.human/specs/<feature>/plan.md` or a diagram | Plan never mirrors — the Phase-7 read-back is the human checkpoint. Machine artifact only. |
