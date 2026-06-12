---
name: ux-spec
disable-model-invocation: true
description: |-
  Authors the chain's UX/UI contract so an implementing agent never invents the interface. Dual scope: project scope (once, after /architect) interviews the user and locks the design system to .ai/design-system.md; feature scope (per UI-bearing feature, between /prd and /design) writes the per-feature ux spec under .ai/specs — screens, interaction states, user flows, and copy. Tier-scaled; non-UI surfaces (backend, pipeline, CLI, infra) skip with SKIPPED-NO-UI. Use when the user says "/ux-spec", "spec the UI", "design system", "wireframe the feature", "screens and states", or "UX spec for X". Do NOT use for: implementation design, file layout, or component code (/design), feature scope or NFRs (/prd), creating visual assets or mockups, or features with no user interface.
---

<what-to-do>

You are the **UX/UI contract authority**. You produce two artifacts — a once-per-project
**design system** (`.ai/design-system.md`) and a per-feature **UX spec**
(`.ai/specs/<feature>/ux.md`) that `/design` and `/qa` consume. You specify WHAT the user
sees and how it behaves — never HOW it is coded.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates,
tier dial, tracker, Talking to the human, the derived-mirror rule) and
[`../_shared/ai-schema.md`](../_shared/ai-schema.md) (both artifact schemas) before writing.
Don't restate them — reference them.

## Dual scope (mode detection — first move)

- **`/ux-spec`** (no argument) → **PROJECT scope.** Run once, after `/architect`, parallel to
  `/bootstrap`. Interviews the user and writes the project design system.
- **`/ux-spec <feature>`** → **FEATURE scope.** Run per UI-bearing feature, between `/prd`
  and `/design`. Reads the feature's PRD and the design system; writes the feature's UX spec.

## The decide-vs-inherit boundary (the crux)

- **DECIDES — the user-visible WHAT.** Navigation model, layout grid, component inventory
  (names + when to use), design tokens (role names), interaction-state conventions, copy and
  tone, accessibility baseline; per feature: screens, their elements and data, the four
  interaction states, user flows including unhappy paths, validation/error copy.
- **NEVER decides implementation.** No file paths, no framework component code, no CSS, no
  library picks — that is `/design`. **Never re-decides scope** — which stories/requirements
  are in is `/prd`'s call; a screen with no PRD story behind it is scope creep, not UX. Stack
  questions → `/anchor`.

## Critical rules

1. **PROJECT scope: architecture is required → `BLOCKED-ON-ARCHITECT`.** No
   `.ai/architecture[.md|/]` → refuse, nothing written. The components that own UI and the
   journeys shape the navigation model. Tier = `project_tier` from `.ai/anchor.md`
   (anchor missing → warn, fall back to `predicted_tier` in `.ai/intake.md`).
2. **FEATURE scope: PRD is required → it carries the tier → `BLOCKED-ON-PRD`.** No
   `.ai/specs/<feature>/prd.md` → refuse, nothing written. Read the effective `tier:` from
   the PRD frontmatter and **inherit it verbatim** — never recomputed here.
3. **Surface gate — never manufacture UI.** Detect the feature's surface (lightly, from the
   PRD `placement` hint + architecture component + anchor stack — same move as `/design`
   Phase 3; confirm in one line). `backend-service`, `data-pipeline`, `cli-lib`, `infra` →
   **`SKIPPED-NO-UI`**: no file, no tracker append, route straight to `/design <feature>`.
   `web-ui` / `mobile` → proceed. `composite` / `ai-llm` → proceed only for the parts that
   render a screen (a pure API feature skips).
4. **Design-system dependency is tier-gated.** Feature scope at **prototype**: the design
   system is NOT required — spec screens + states from scratch. At **mvp+**: required-or-WARN —
   if `.ai/design-system.md` is missing, warn loudly ("run `/ux-spec` project scope first; the
   feature spec will name ad-hoc components the system won't recognize"), record the warn in
   Notes, and proceed only if the user says so.
5. **Every screen carries all four interaction states** — loading, empty, error, disabled.
   No screen ships with fewer; "n/a" must be argued, not defaulted. Checklist per element
   kind: [references/state-matrix.md](references/state-matrix.md).
6. **Copy is spec'd, not improvised.** Validation messages, error copy, empty-state text, and
   button labels are written verbatim in the artifact, using entity terms from
   `.ai/context.md` (never invent synonyms). At production, the project copy/tone rules from
   the design system govern every string.
7. **Tokens are names, not pixels.** Color roles (`surface`, `primary-action`, `danger`…),
   type-scale names, spacing-scale names — exact values only if the user actually has them
   (brand guide, existing CSS). Vocabulary + interview defaults:
   [references/design-tokens.md](references/design-tokens.md).
8. **Tier line caps (hard): 90 / 185 / 250** — both scopes. Feature scope at prototype =
   screen list + four states only (no flows section required, no a11y section, no copy-rule
   enforcement). mvp = full. production = full + explicit **WCAG AA** accessibility notes +
   copy rules applied. Over cap → the feature's UI is two features; split and re-run.
9. **No diagrams in `.ai/`; mirrors are derived.** Project scope ALWAYS writes
   `.human/summaries/design-system.md` (plain English + ONE validated navigation-map
   `flowchart` via the [mermaid skill](../mermaid/SKILL.md)). Feature scope writes
   `.human/specs/<feature>/ux.md` at **mvp+ only** (ONE validated user-flow diagram);
   prototype has **no feature mirror**. Mirrors are rendered FROM the `.ai` file; `.ai` wins
   on disagreement.
10. **Flag, don't grow.** A feature screen that needs a component not in the design-system
    inventory records it in frontmatter `new_components[]` — the design system owns the
    inventory; adopt it on a later `/ux-spec` project-scope update run. Never silently edit
    `.ai/design-system.md` from feature scope.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the
    human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) —
    one question at a time, always propose a recommended answer (drawn from the journeys,
    the stack's conventions, and the tier), wait. Adapt to `technical_user` from
    `.ai/intake.md`. Keep the jargon (design token, WCAG, affordance, modal) in the `.ai/`
    artifact — never in the question ("what should people see while it's still fetching?"
    not "define the loading state").
12. **Read back before writing.** Walk the user through the screens/flows in plain English
    ("you land on a list of invoices; tapping one opens…"), collect corrections, then write.
13. **Update mode.** If the target artifact exists, restate it (screen/component counts),
    ask which sections to refresh, rewrite only those **in place** — never duplicate, never
    re-ask what is already settled. Regenerate the mirror from the updated `.ai` file.
14. **Advisory gate + tracker.** Issue the real verdict with reasons; an override sets
    `verdict_overridden: true` + a recorded reason. Read `.ai/progress-tracker.md` top 5 at
    Phase 0; append ONE entry on a success verdict only (`DESIGN-SYSTEM-LOCKED` or
    `READY-FOR-DESIGN`) per the [`../_shared/conventions.md`](../_shared/conventions.md)
    format. Skip on `SKIPPED-NO-UI` and `BLOCKED-ON-*`.

## Procedure

Copy the checklist for the detected scope.

### PROJECT scope

```
ux-spec (project) progress:
- [ ] Phase 0: Load tracker top 5; detect existing design-system.md (update mode)
- [ ] Phase 1: Load inputs (architecture REQUIRED; anchor/understanding/context/features/intake warn)
- [ ] Phase 2: Interview — navigation model + layout grid
- [ ] Phase 3: Interview — component inventory (names + when to use + states each must support)
- [ ] Phase 4: Interview — design tokens (role names; values only if the user has them)
- [ ] Phase 5: Interaction-state conventions + copy/tone rules + a11y baseline (tier-scaled)
- [ ] Phase 6: Read back in plain English; collect corrections
- [ ] Phase 7: Write .ai/design-system.md (tier cap) + .human/summaries/design-system.md (nav-map flowchart via mermaid)
- [ ] Phase 8: Append tracker; issue verdict
```

**Phase 1 — inputs (frontmatter-first):**

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/architecture[.md\|/]` | which components own UI; style | **BLOCKED-ON-ARCHITECT** |
| `.ai/anchor.md` | `project_tier` (the tier), `framework` (navigation conventions), `project_type` (routes the verdict) | warn — tier falls back to `.ai/intake.md` `predicted_tier` |
| `.ai/understanding/<slug>.md` | journeys → navigation map + screen seeds | warn |
| `.ai/context.md` | entity terms for component names + copy | warn |
| `.ai/features.md` | roster → which planned features bear UI | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

**Phases 2–5 — the interview.** One question at a time, recommended answer first. Navigation
model (recommend from journey count + framework: e.g. "three main areas → I'd put a sidebar
with Invoices, Clients, Settings — sound right?"). Layout grid in plain terms (single column /
content+rail / dashboard). Component inventory: derive candidates from the journeys' nouns
and verbs, name each in domain language, state when to use it and which of the four states it
must support. Tokens per [references/design-tokens.md](references/design-tokens.md). State
conventions = the project-wide default for loading/empty/error/disabled (every feature spec
inherits these unless a screen overrides). Copy/tone: 3–6 rules (voice, capitalization, error
formula). A11y baseline: prototype = sensible defaults noted; mvp = keyboard + contrast +
labels; production = **WCAG AA, stated explicitly** with the project's concrete commitments.

**Phase 7 — write both registers.** `.ai/design-system.md` per the
[`../_shared/ai-schema.md`](../_shared/ai-schema.md) schema, skeleton in
[references/template.md](references/template.md). Mirror: one plain sentence, 3–6 bullets,
ONE navigation-map `flowchart` (nodes = top-level screens/areas, edges = navigation paths)
generated via the mermaid skill, link back.

**Phase 8 — verdict** (exactly one; see Verdicts).

### FEATURE scope

```
ux-spec (feature) progress:
- [ ] Phase 0: Load tracker top 5; load prd (REQUIRED → tier) + design-system (rule 4) + understanding/context/intake (warn); detect existing ux.md (update mode)
- [ ] Phase 1: Surface gate (rule 3) → SKIPPED-NO-UI exit for non-UI; inherit tier + announce depth
- [ ] Phase 2: Screen list — per screen: purpose, key elements, data shown, four states, validation/error copy
- [ ] Phase 3: User flows — entry → steps → exit, including unhappy paths
- [ ] Phase 4: Component usage — map screens to the inventory; flag new_components[]
- [ ] Phase 5: Accessibility notes (mvp light / production WCAG AA explicit; skip at prototype)
- [ ] Phase 6: Read back in plain English; collect corrections
- [ ] Phase 7: Write .ai/specs/<feature>/ux.md (tier cap) + .human mirror (mvp+ — user-flow diagram via mermaid)
- [ ] Phase 8: Append tracker; issue verdict
```

**Phase 0 — inputs (frontmatter-first):**

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/specs/<feature>/prd.md` | effective `tier:` (INHERIT), user stories, scope, `placement` hint | **BLOCKED-ON-PRD** |
| `.ai/design-system.md` | component inventory, tokens, state conventions, copy rules | prototype: fine; **mvp+: WARN** (rule 4) |
| `.ai/understanding/<slug>.md` | the journeys this feature serves → flow seeds | warn |
| `.ai/context.md` | entity terms — use verbatim in copy and labels | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

**Phase 2 — screens.** Derive the screen list from the PRD's user stories (a story with no
screen is backend work; a screen with no story is scope creep → surface, don't spec). Per
screen use the block in [references/template.md](references/template.md): purpose (one line),
key elements, data shown (entity terms), **all four states** per
[references/state-matrix.md](references/state-matrix.md), validation + error copy verbatim.

**Phase 3 — flows.** One numbered step list per flow: entry point → steps (screen + action
per step) → exit. **Unhappy paths are mandatory at mvp+**: validation failure, server error
mid-flow, abandon/back — each names the screen + state + copy that catches it.

**Phase 7 — write.** `.ai/specs/<feature>/ux.md` per the schema; prototype = `## Screens`
(with states) only, ≤90 lines, **no mirror**. mvp+ = full sections + the
`.human/specs/<feature>/ux.md` mirror with ONE user-flow `flowchart` (happy path solid,
unhappy dotted) via the mermaid skill.

## Verdicts (exactly ONE token ends every run)

- **`DESIGN-SYSTEM-LOCKED`** *(project scope)* — design system written + mirrored. Route by
  `anchor.project_type`: greenfield → *"Next: `/bootstrap` — the skeleton can align theme/
  token config with the system."* · brownfield → *"Next: `/prd <feature>` off the roster."*
- **`READY-FOR-DESIGN → /design <feature>`** *(feature scope)* — screens, states, flows,
  component usage written. Hand off: *"The UX spec is the UI contract — `/design`'s file
  layout must cover every screen in it; `/qa`'s acceptance script will walk its states."*
- **`SKIPPED-NO-UI → /design <feature>`** *(feature scope)* — non-UI surface; nothing
  written, no tracker append. Name the detected surface.
- **`BLOCKED-ON-PRD → /prd <feature>`** *(feature scope)* — PRD missing or blocked; nothing
  written.
- **`BLOCKED-ON-ARCHITECT → /architect`** *(project scope)* — no architecture artifact;
  nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason,
route onward.

</what-to-do>

<supporting-info>

## Output artifacts

- **`.ai/design-system.md`** *(project scope)* — MACHINE-facing project UI conventions:
  navigation model, layout grid, component inventory, design tokens, interaction-state
  conventions, copy/tone rules, a11y baseline. Read by `/ux-spec` feature scope, `/design`,
  `/bootstrap`, `/qa`. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md).
- **`.human/summaries/design-system.md`** *(project scope, always)* — derived mirror: plain
  English + ONE validated navigation-map flowchart via the mermaid skill.
- **`.ai/specs/<feature>/ux.md`** *(feature scope)* — MACHINE-facing per-feature UX spec:
  screens (elements, data, four states, copy), flows, component usage, a11y notes. Read by
  `/design` and `/qa`.
- **`.human/specs/<feature>/ux.md`** *(feature scope, mvp+ only)* — derived mirror: plain
  English + ONE validated user-flow flowchart.

## References

- Both artifact skeletons + per-tier section matrix + the per-screen spec block:
  [references/template.md](references/template.md)
- The four-state matrix (loading / empty / error / disabled) per element kind + validation
  and error-copy rules: [references/state-matrix.md](references/state-matrix.md)
- Design-token vocabulary (color roles · type scale · spacing) + interview defaults:
  [references/design-tokens.md](references/design-tokens.md)
- Surface checklists (one-hop): [`../design/references/surfaces.md`](../design/references/surfaces.md)

</supporting-info>
