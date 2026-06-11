---
name: feature-census
description: |-
  Brownfield-only feature inventory — the /feature-map twin for an existing codebase. Instead of decomposing a new idea, it catalogs the features already shipping in the code: reads recon.md (Section B components, Section C journeys) and comprehend's understanding.md (behaviors), maps them into a roster of atomic vertical features marked status shipped and traced to their component, then captures any new desired work as status planned and prioritizes it. Writes the same .ai/features.md as /feature-map (so /prd is unchanged) plus a .human dashboard. Use when the user says "/feature-census", "what features does this app have", "inventory the features", "catalog the existing features", "map the shipped features", or after /comprehend on a brownfield project. Do NOT use for: greenfield idea decomposition (/feature-map), code recon (/explore), domain modeling (/comprehend), per-feature scope (/prd), or a code health audit (/health-audit).
---

<what-to-do>

You build the **roster of features for an existing codebase** — the same `.ai/features.md` every downstream skill works on, but sourced from the **code that already ships** rather than decomposed from a fresh idea. You catalog what's there (each existing capability → one atomic vertical feature, `status: shipped`, traced to a real component), then capture any **new work the user wants** (`status: planned`, prioritized). You are the brownfield twin of `/feature-map`.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/features.md` schema) before writing.

## The two populations (read this first)

A brownfield roster holds **two kinds of feature**, and they're sourced and handled differently:

- **Shipped features = the inventory.** Sourced from `recon.md` Section B (components) cross-checked with `understanding.md` behaviors. Each is `status: shipped`, traced to its component. These are *facts about the code* — you catalog them, you don't prioritize or invent them.
- **Planned features = the new work.** Things the user wants to add or change, named in conversation. These are `status: planned`, prioritized 1–N, and are what `/prd` picks next. The tier cap and priority ranking apply **here only** — not to the shipped inventory.

The shipped inventory tells you (and `/prd`, `/design`) what already exists to build on or modify; the planned rows are the actual build queue.

## Critical rules

1. **Vertical slices, not technical layers** — even for shipped features. A feature is a user-visible capability (`invoice-send`, `client-portal`), never a concern inside one (`auth-service`, `db-layer`). Test: *"what can a user DO with this?"* No answer → it's a component, not a feature (it belongs in the trace, not as a row).
2. **Atomic.** One shippable, value-delivering capability per row. Split only when each half stands alone.
3. **Catalog reality, don't invent.** Every shipped feature must trace to a real `recon.md` Section B **component** AND, where possible, an `understanding.md` **behavior**. A "feature" the code doesn't have is not shipped — drop it or move it to planned. No uncited shipped features.
4. **Two populations (above).** `shipped` = inventoried from code; `planned` = new work the user names. Prioritize and tier-cap **planned only**. Don't rank shipped features against planned ones. A row already `deprecated` or `removed` (written by /sunset) is preserved verbatim and never listed as live — it is neither re-cataloged as shipped inventory nor counted against the planned cap.
5. **Preconditions / brownfield gate.** `recon.md` **required** → missing `BLOCKED-ON-RECON → /explore`. `understanding.md` (behaviors for tracing): at **mvp/production** effectively required → `BLOCKED-ON-COMPREHEND → /comprehend`; at **prototype**, proceed tentative off recon components alone (`trace_status: tentative`), note it. `project_type: greenfield` → `GREENFIELD → /feature-map`.
6. **No discovery envelope — the app *is* the envelope.** Brownfield skips `/discovery`; scope is "what the code does today" + the new work the user names. A new feature the user proposes is a `planned` row (record it); don't push back on scope the way greenfield does — there's no discovery to honor.
7. **Tier cap on planned work.** prototype ≤4 · mvp 5–8 · production ≤10 *planned* features (the build queue). `uplift_signals` in `.ai/intake.md` may bump the tier — surface it. The shipped inventory is whatever exists; it isn't capped.
8. **Don't overwrite — update mode.** If `.ai/features.md` exists, touch only the rows the user names; preserve every other row, its `status`, and its `prd` link.
9. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommendation, no jargon, adapt to `technical_user`. Confirm the shipped inventory ("here's what I see the app already does — right?"), then ask what they want to add/change.
10. **Read back before writing.** Paste the assembled roster (shipped + planned); ask *"is this what the app does, and what you want next?"* Edit for fidelity.
11. **Two registers.** `.ai/features.md` is structured (no diagrams). `.human/summaries/features.md` is prose + **one validated diagram** via the **mermaid skill** (shipped vs planned, dependency edges). Diagrams live in `.human/` only.
12. **The gate is advisory.** Issue the real verdict with reasons; the user may override (`verdict_overridden: true` + reason).

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before writing.

## Procedure

Copy this checklist:

```
feature-census progress:
- [ ] Phase 0: Load intake (tier+project_type) + tracker top 5; brownfield gate; detect existing features.md (update mode)
- [ ] Phase 1: Load recon.md (REQUIRED — components + journeys) + understanding.md/context.md (behaviors + entities, tier-aware); restate
- [ ] Phase 2: Catalog SHIPPED features — recon Section B components × behaviors → atomic vertical features (status: shipped)
- [ ] Phase 3: Slug each (kebab-case, ≤30, user-outcome); dedupe
- [ ] Phase 4: Capture DESIRED new work (status: planned); prioritize 1–N
- [ ] Phase 5: Trace + coverage — shipped → component (recon) + behavior; flag uncovered components / behaviors
- [ ] Phase 6: Read back; scan anti-patterns; collect corrections
- [ ] Phase 7: Enforce tier cap (planned); write .ai/features.md + .human/summaries/features.md (validated diagram)
- [ ] Phase 8: Append progress-tracker (success verdict only); issue verdict
```

### Phase 0 — Session context + brownfield gate
Read `.ai/intake.md` for `predicted_tier`, `uplift_signals`, `technical_user`, and `project_type`. Greenfield → `GREENFIELD → /feature-map`. Read `.ai/progress-tracker.md` top 5. Read `.ai/features.md` — if present, restate the roster (shipped vs planned counts) and switch to **update mode** (rule 8).

### Phase 1 — Load inputs
Read frontmatter-first:
- `.ai/recon.md` — **required.** Section B (components — the shipped-feature source), Section C (inferred journeys). Missing → `BLOCKED-ON-RECON → /explore`. Stop.
- `.ai/understanding/<slug>.md` — `behaviors` (trace target) + entities. Missing: mvp/production → `BLOCKED-ON-COMPREHEND`; prototype → proceed tentative (rule 5).
- `.ai/context.md` — entities/glossary for naming + coverage.

Restate: *"Recon found [N] components; understanding has [M] behaviors. I'll catalog the shipped features from these, then ask what you want to add. Tier = [tier] (planned cap [N]). Right?"*

### Phase 2 — Catalog shipped features
Walk `recon.md` Section B components, cross-referenced with `understanding.md` behaviors. For each user-visible capability the code already delivers, write one atomic vertical feature, `status: shipped`. Apply the vertical + atomic tests (rules 1–2). A component that's pure infrastructure (no user-visible capability) is **not** a feature — it stays in the trace, not as a row. See [references/anti-patterns.md](references/anti-patterns.md).

### Phase 3 — Slug
kebab-case, ≤30 chars, names the user outcome (`invoice-send`, not `invoice-service`). Reuse names already in the domain (`context.md`). Force differentiation on near-collisions.

### Phase 4 — Capture desired new work
Ask what the user wants to add or change. Each becomes a `planned` row. Prioritize 1–N (force ranking; ≤4 P0; a P0 is what they most need next). If there's no new work yet, that's fine — the inventory alone is a valid census.

### Phase 5 — Trace + coverage
Each **shipped** feature → its `recon.md` component (cite) + a behavior (`satisfies`). Surface gaps both ways: a component with no feature (pure infra, or a missing capability?), a behavior with no feature (an unmodeled capability — note for `/comprehend`). Prototype with no understanding → `trace_status: tentative`, trace to components only.

### Phase 6 — Read back
Assemble the draft. Scan against [references/anti-patterns.md](references/anti-patterns.md). Read back: *"Is this what the app does today, and is the new work right and in the right order?"* Edit for fidelity.

### Phase 7 — Write the artifacts
Enforce the tier cap on **planned** features (rule 7). Then write both:
1. **`.ai/features.md`** — per [`../_shared/ai-schema.md`](../_shared/ai-schema.md): frontmatter index (verdict, tier, `source_recon`, `source_understanding`, `features`, `p0`, links) + In scope (shipped + planned rows; shipped trace a component, planned carry priority) / Deferred / Never / Priority key / Trace status / Notes. No diagrams.
2. **`.human/summaries/features.md`** — lead with the verdict; plain bullets (what the app already does, what's next); **one validated diagram** via the **mermaid skill** — a feature map grouping **shipped vs planned** with dependency edges. Link back.

### Phase 8 — Verdict
Append a tracker entry on `READY-FOR-PRD` only. Issue exactly one:

- **`READY-FOR-PRD → /prd <feature>`** — inventory cataloged (and new work captured + prioritized, if any). *"Next: `/prd` on the highest-priority `planned` feature — or name a `shipped` feature to modify and `/prd` it."*
- **`BLOCKED-ON-RECON → /explore`** — no `recon.md` to catalog from. Nothing written.
- **`BLOCKED-ON-COMPREHEND → /comprehend`** — mvp/production with no behaviors to trace against. Roster written tentative (shipped, component-only trace).
- **`GREENFIELD → /feature-map`** — `project_type` is greenfield; use the greenfield decomposition door.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/features.md`** — MACHINE-facing roster, **same schema** as `/feature-map`'s. Shipped rows (`status: shipped`, component-traced) = the inventory; planned rows = the build queue `/prd` reads. Frontmatter carries `source_recon` + `source_understanding` (not `source_discovery`). Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md).
- **`.human/summaries/features.md`** — HUMAN-facing dashboard: shipped-vs-planned feature map (one validated mermaid diagram).

## How `/feature-census` differs from `/feature-map`
| | `/feature-map` (greenfield) | `/feature-census` (brownfield) |
| :-- | :-- | :-- |
| Job | decompose a new idea into features to build | inventory features already shipping + capture new work |
| Source | understanding `behaviors` + discovery `scope` | `recon.md` components + understanding `behaviors` |
| Precondition | `.ai/discovery/<slug>.md` | `.ai/recon.md` |
| Default status | `planned` | `shipped` (inventory) + `planned` (new work) |
| Priority/cap | all in-scope features | the `planned` work only |
| Next skill | `/anchor` | `/prd` (anchor/architect already done upstream) |

Both write the **same `.ai/features.md`**, so `/prd`, `/design`, `/plan` never know which produced it.

## Slugging
Reuse the project `slug` for the artifact path.

</supporting-info>
