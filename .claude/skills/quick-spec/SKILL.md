---
name: quick-spec
description: |-
  One-sitting express lane for prototype-tier features — merges the /prd, /design, and /plan interviews into a single conversation and writes the same three per-feature artifacts under .ai/specs (prd.md, design.md, plan.md, plus design's human mirror), schema-identical to the full chain so every downstream reader (/to-issues, /build, /qa, /as-built) is untouched. Computes the effective tier exactly as /prd does and refuses anything above prototype: a feature with money, PII, regulatory, or other uplift signals bounces to the full chain. Use when the user says "/quick-spec", "quick spec the next feature", "express spec", "spec this feature fast", "one-sitting spec", or wants prd plus design plus plan in one pass on a prototype project. Do NOT use for: mvp or production features (/prd then /design then /plan), the project feature roster (/feature-map), deepening a promoted feature (the source skills' update modes), ticket creation (/to-issues), or writing code (the build loop).
argument-hint: "[feature-slug]"
---

<what-to-do>

You are the **prototype-tier express lane** of the per-feature loop: one conversation that runs the prototype columns of `/prd`, `/design`, and `/plan` in a single sitting and writes the **same three artifacts** — `.ai/specs/<feature>/prd.md`, `design.md`, `plan.md` — schema-identical to what the source skills write at prototype tier. You merge the *conversations*, never the *artifacts*: downstream readers (`/to-issues`, `/build`, `/qa`, `/as-built`, the dashboard) must not be able to tell a quick-spec'd feature from a full-chain one.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and the three per-feature schema blocks in [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (`prd.md`, `design.md`, `plan.md`) before writing. Don't restate them — reference them.

## Composition by pointer (the crux — this skill owns NO contract)

quick-spec introduces no schema, no new artifact kind, and no new rules. Every rule it applies is the source skill's rule, loaded from the source skill's own files:

| Concern | Source of truth |
| :-- | :-- |
| Effective tier = max(project_tier, feature uplift); uplift signal list | `/prd` rule 3 semantics + the bump rule in [`../prd/references/tier-matrix.md`](../prd/references/tier-matrix.md) (prototype + signal → mvp) — **minus** `/prd`'s plain-language tier override, which is NOT available here (rule 1); signals defined once in [`../anchor/references/defaults.md`](../anchor/references/defaults.md) |
| PRD one-pager sections + SMART/EARS tier gating | [`../prd/references/template.md`](../prd/references/template.md) (prototype column — no SMART, no EARS, no Open questions) |
| Placement, orphan refusal, surface checklist, deps governance | `/design` rules 2, 7, 8, 11; [`../design/references/deps-governance.md`](../design/references/deps-governance.md), [`../design/references/surfaces.md`](../design/references/surfaces.md) |
| Design template + anti-patterns | [`../design/references/template.md`](../design/references/template.md), [`../design/references/anti-patterns.md`](../design/references/anti-patterns.md) |
| Vertical slices, tracer bullet, mechanical acceptance, numbering | `/plan` rules 4–6, 11; [`../plan/references/template.md`](../plan/references/template.md), [`../plan/references/anti-patterns.md`](../plan/references/anti-patterns.md) |

When `/prd`, `/design`, or `/plan` changes, quick-spec inherits the change through these pointers. Anything restated here instead of pointed at is a drift bug — fix by deleting the restatement.

## Critical rules

1. **Prototype only — the tier gate IS the contract.** Phase 1 computes the effective tier exactly as `/prd` does: `max(project_tier from anchor.md, feature uplift scan)`. Effective tier mvp or production → **`NEEDS-FULL-CHAIN → /prd <feature>`**, nothing written. The same exit fires **mid-conversation** if any signal from the canonical uplift list surfaces — stop, name the signal in plain English, route out with nothing written. Signals fire on what the feature is *about*, never on how thin its implementation sounds: a "just a redirect" checkout is still **money**. The user cannot argue a signal out of firing here; that conversation happens in `/prd`, on the record. Never proceed "lightly" on an uplifted feature.
2. **Anchor required.** No `.ai/anchor.md` or no `project_tier` → `BLOCKED-ON-ANCHOR → /anchor`; nothing written.
3. **Architecture required — placement is non-negotiable** (same as `/design` rule 2, which binds even at prototype). `maps_to_component` must be a real component from `.ai/architecture[.md|/]` (the inline component list at prototype). No architecture at all → `BLOCKED-ON-ARCHITECTURE → /architect`. Feature fits no component → `NEEDS-ARCHITECTURE-UPDATE → /architect`; never invent a component.
4. **Run only from zero or from a complete trio.** No specs for the feature → fresh run. All three files exist → **update mode**: ask which decisions changed, rewrite only the affected sections across the three files, preserve slice numbering (`Slice N (removed)`, never renumber). A **partial** set (e.g. `prd.md` without `design.md`) means the full chain is mid-flight on this feature → `RESUME-FULL-CHAIN` naming the next missing artifact's source skill; never produce a hybrid.
5. **Inherit, don't re-decide.** Stack questions → `/anchor`; component/style/invariant questions → `/architect`. Same decide-vs-inherit boundary as the source skills; honor invariants from architecture and `.ai/understanding/` (warn-level at prototype, never silent).
6. **Dependency governance never thins.** `/design` rule 7 applies verbatim: bias to `anchor.approved_dependencies`; any new package is trust-judged, recorded in design's External dependencies + frontmatter `dep_adds[]`, flagged for anchor; the slopsquatting fingerprint → REFUSE. Plan propagates deps verbatim, never re-judges.
7. **Slices are vertical; Slice 1 is the tracer bullet; prototype = 1–2 slices**, each independently mergeable with mechanical acceptance (named tests pass). Horizontal slices are refused, exactly per `/plan`.
8. **Prototype line caps: ≤90 per artifact.** Over cap → the feature is two features: split the roster row (`/feature-map` update) and quick-spec each half.
9. **Mirrors per the source contracts.** No PRD mirror (prototype), no plan mirror (never). `.human/specs/<feature>/design.md` is **always written** — plain-English walkthrough + a `sequenceDiagram` rendered FROM the call-flow step list via the [mermaid skill](../mermaid/SKILL.md), validated before it ships.
10. **One combined read-back replaces three.** Before writing, read the whole picture back in plain English: scope ("where did I misrepresent you?"), design ("any module that's actually two? any path that doesn't match the stack? any invariant violated?"), plan ("any slice that's actually two? can Slice 1 merge alone? every requirement claimed by a slice?"). Edit for fidelity, then write.
11. **Mark provenance in Notes only.** Each of the three artifacts carries one line in its Notes section: `authored via /quick-spec (one-sitting prototype pass)`. No new frontmatter field — the schemas stay untouched.
12. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer, adapt to `technical_user` from `.ai/intake.md`. Budget ~6–8 questions for the whole sitting; the jargon (EARS, LLD, tracer bullet, idempotency) stays in the `.ai/` artifacts, never in the questions.
13. **Advisory applies to judgments, not routing.** The structural verdicts of rules 1–4 (`NEEDS-FULL-CHAIN`, `BLOCKED-ON-ANCHOR`, `BLOCKED-ON-ARCHITECTURE`, `NEEDS-ARCHITECTURE-UPDATE`, `RESUME-FULL-CHAIN`) are routing decisions and are **never overridable inside quick-spec** — the tier override lives in `/prd`, placement in `/architect`, a partial trio in its source skill. What remains advisory and overridable on the record (`verdict_overridden: true` + recorded reason, still write): invariant warnings (rule 5), `beyond_roster` (Phase 0), and dependency concerns short of the slopsquatting REFUSE (rule 6). Never water down.
14. **Tracker: one entry, not three.** Read `.ai/progress-tracker.md` top 5 at Phase 0; on success append ONE entry naming all three artifacts and the verdict. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
quick-spec progress:
- [ ] Phase 0: Load tracker top 5; anchor (REQUIRED) + architecture (REQUIRED) + features.md (warn) + context/understanding (warn); probe .ai/specs/<feature>/ → fresh | update | RESUME-FULL-CHAIN
- [ ] Phase 1: Tier gate — effective tier = max(project_tier, uplift scan); mvp+ → NEEDS-FULL-CHAIN; announce the sitting
- [ ] Phase 2: Scope (≤3 questions: JTBD, in/out boundary, success metric + source) → PRD content
- [ ] Phase 3: How (≤3 questions: placement, new deps, schema delta) → propose modules + file layout from anchor conventions → design content
- [ ] Phase 4: Slices (usually 0 questions): tracer bullet + at most one more, acceptance per slice → plan content
- [ ] Phase 5: ONE combined read-back (rule 10); collect fidelity corrections
- [ ] Phase 6: Write prd.md + design.md + plan.md (≤90 each, prototype columns per ai-schema.md) + the .human design mirror (mermaid skill)
- [ ] Phase 7: Append ONE tracker entry; issue verdict
```

Phase notes:

- **Phase 0.** `<feature>` should be a row in `.ai/features.md`; if not, warn and set `beyond_roster: true` in the PRD frontmatter (surfaced, not invented). Missing features.md is a warn, not a block, at prototype.
- **Phase 1 announce** (plain English): *"This is a prototype-tier feature with no risk signals, so I'll run the express pass: what it does, how it's built, and the build order — one conversation, about six questions, then one read-back before I write anything."*
- **Phase 2** fills the PRD one-pager: Problem, JTBD, Scope in/out, Success metric (always with its `source` row — how the number is obtained). No user stories, NFR table, EARS, or Open questions at prototype.
- **Phase 3** finalizes `placement` (rule 3), detects the surface lightly (`/design` rule 8 — AI/LLM checklist mandatory if the feature ships AI), proposes verb-noun modules + file layout from anchor conventions, governs deps (rule 6), captures any schema delta with its rollback line.
- **Phase 4** derives slices straight from the modules just agreed — propose, don't interrogate. Acceptance is named tests passing; no NFR targets or fitness functions at prototype.
- **Phase 6** writes frontmatter exactly per the three ai-schema.md blocks: `stage: prd|design|plan`, `tier: prototype`, design's `verdict: READY-FOR-PLAN`, prd's `verdict: READY-FOR-DESIGN` (both `status: complete` — the sitting subsumed their gates), plan's verdict per below.

## Verdict (exactly one)

- **`READY-FOR-ISSUES → /to-issues <feature>`** — trio written, slices vertical + traceable, read-back confirmed. Hand off: *"Three specs are on disk; each slice is one PR. Next: `/to-issues <feature>` expands the slices into canonical issue files. (Prototype shortcut, per `/plan`'s hand-off: you may skip the tracker and build straight from `plan.md`, driving `/mtdd-implement` per slice — note `/build`'s queue needs the issue files, so the shortcut means you route slices yourself.)"*
- **`NEEDS-FULL-CHAIN → /prd <feature>`** — effective tier is mvp/production (at entry or mid-conversation). Nothing written; name the uplift signal so `/prd` records it.
- **`RESUME-FULL-CHAIN → /prd | /design | /plan <feature>`** — partial spec trio found; route to the first missing artifact in chain order prd → design → plan. Nothing written, no override.
- **`NEEDS-ARCHITECTURE-UPDATE → /architect`** — no component fits (rule 3). Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** / **`BLOCKED-ON-ARCHITECTURE → /architect`** — missing foundation. Nothing written.

</what-to-do>
