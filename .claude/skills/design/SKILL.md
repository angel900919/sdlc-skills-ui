---
name: design
disable-model-invocation: true
description: |-
  Produces the per-feature low-level design (LLD) — the implementation contract that /plan, /to-fitness, and /qa consume — under .ai/specs per feature. Inherits the effective tier from the feature's PRD (never recomputes it), the stack from anchor, and the architecture from architect; traces every design to a component in architecture's 02-components and refuses orphan features. Decides the per-feature HOW: modules, file layout, schema deltas, API contracts, call flow, test plan, and per-feature ADRs. Governs new libraries against anchor's approved_dependencies and always writes a derived plain-English mirror with a validated sequence diagram. Use when the user says "/design", "design the feature", "implementation design", "LLD", "how should I build X", or after /prd. Do NOT use for: feature scope or NFRs (/prd), high-level architecture or components (/architect), stack and tier lock (/anchor), domain modeling (/understand), idea validation (/discovery), or writing code (the build phase).
---

<what-to-do>

You produce the **per-feature low-level design (LLD)** — the HOW a single feature will be built — at `.ai/specs/<feature>/design.md`. It pairs 1:1 with `/prd` and is the contract `/plan` (slices), `/to-fitness` (NFR→fitness functions), and `/qa` all read. You run once per feature, after `/prd`.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human, the derived-mirror rule) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/specs/<feature>/design.md` schema) before writing. Don't restate them — reference them.

## The decide-vs-inherit boundary (read this first — it is the crux)

- **INHERITS, never re-decides.** Language / framework / db / hosting are LOCKED in `.ai/anchor.md`; system components / style / ADRs / invariants / characteristics are in `.ai/architecture[.md|/]`. Design **traces to** a component in `02-components.md`; it does not re-pick the stack or the architecture. The effective **`tier` is inherited from `prd.md`** — never recomputed here.
- **DECIDES — the per-feature HOW.** Feature-level libraries (governed — rule 7), data model / schema deltas, API contracts (endpoints, request/response, error shapes), module & file structure, the call flow, the test plan, per-feature ADRs.

## The two-register model

- **`.ai/specs/<feature>/design.md` holds the CONTRACT** — frontmatter index + fixed-order sections + structured implementation detail (module table, file list, schema deltas, API-contract tables, the **call-flow step list**). API contracts + schemas as **tables/YAML, never prose**. **No diagrams.** This is what `/plan`, `/to-fitness`, `/qa` read.
- **`.human/specs/<feature>/design.md` is a DERIVED mirror, written at EVERY tier** — a plain-English walkthrough + a `sequenceDiagram` **rendered FROM the `.ai` call-flow step list** via the [mermaid skill](../mermaid/SKILL.md) (validated). Never hand-authored; if the two disagree, `.ai` wins. **Design is the one Batch-C skill that ALWAYS mirrors** — the sequence diagram cannot live in `.ai/`. Per [`../_shared/conventions.md` § Human summaries](../_shared/conventions.md).

## Critical rules

1. **PRD is required → it carries the tier.** No `.ai/specs/<feature>/prd.md` → `BLOCKED-ON-PRD → /prd <feature>`; nothing written. Read the effective `tier:` from the PRD frontmatter and **inherit it** — design never recomputes the tier (that was the PRD's job, `max(project_tier, feature_uplift)`).
2. **Architecture is required → placement is non-negotiable.** No `.ai/architecture[.md|/]` → refuse. Every design must trace to a component in `02-components.md` (or the inline component list at prototype). **No orphans** — if nothing fits → `NEEDS-ARCHITECTURE-UPDATE → /architect`; don't invent a component.
3. **Anchor is required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`; nothing written. It carries the stack (file-layout conventions), `approved_dependencies`, and (prod) the security gate.
4. **Inherit, don't re-decide** (the boundary above). Stack questions → `/anchor`; architecture/component/style questions → `/architect`. If the feature needs a decision in neither and in no per-feature HOW you own → `NEEDS-ARCHITECTURE-UPDATE`.
5. **Resolve PRD Open questions before substantive design.** The PRD's `## Open questions` are tagged *answerable, blocking design*. Triage each in Phase 1: (a) design-resolvable (a HOW-decision you own) → park for its natural phase; (b) needs upstream (architecture/discovery/understanding) or (c) needs a prototype → **early-exit** with the matching verdict, naming which question fired it. Don't draft modules on an unresolved blocker.
6. **Honor invariants.** Every invariant from `.ai/understanding/<slug>.md` and from architecture (`§ Invariants` inline at prototype, or `02-components.md` at mvp+) must hold. Never silently violate — flag and either rework or escalate to update the upstream invariant.
7. **Govern every new dependency — all tiers.** Read `anchor.approved_dependencies`; **bias hard toward reuse**. Any package the design introduces that isn't already approved/in the lockfile is a deliberate, vetted add: name it exactly (`stripe (npm)`, not "the Stripe SDK"), trust-judge it (exists / maintained / adopted / provenance / approved-alt), and record it in the External dependencies section **and** in frontmatter `dep_adds[]`, flagged to be added to `anchor.approved_dependencies` (**anchor owns the list** — you flag, you don't silently grow it). The slopsquatting fingerprint (new + low-adoption + name-adjacent + thin provenance) → REFUSE until proven real. Every `new` dep also gets a **license check** — identify its license from registry metadata and check it against the project's intended distribution (Phase 5). Judgment-based, never numeric gates; mechanical enforcement is downstream CI. Full detail: [references/deps-governance.md](references/deps-governance.md).
8. **Surface-aware, lightly.** Detect the feature's surface from `maps_to_component` + the anchor stack (no heavy picker round) and apply the matching checklist in [references/surfaces.md](references/surfaces.md). For an `ai_in_core_path` feature (or a PRD with an AI transparency card), the AI/LLM checklist is **mandatory** — design must carry the prompt / eval / model design and honor the PRD's AI card. Don't let AI rigor drop between `/prd` and build.
9. **No code in the design.** Modules, interfaces, schemas, contracts — yes; implementation code — no. Narrow exception — **prototype-snippet inlining** (same rule as `/prd`): a snippet from a *tested* prototype that encodes a decision more precisely than prose (state machine, reducer, schema type, prompt template) may be inlined inside the relevant section, trimmed, tagged `(from prototype — path)`. Never invent code to inline.
10. **Tier line caps (hard): 90 / 185 / 250.** Over cap → the feature is two features: cut to the JTBD-critical modules, split, run `/design` again for the second slice. Per-tier section matrix: [references/tier-matrix.md](references/tier-matrix.md).
11. **Reject the Entity Trap on module names.** Verb-noun, single responsibility — same rule as `/architect`: [`../architect/references/naming.md`](../architect/references/naming.md). A module whose role needs `and`/`also` is two modules — split it.
12. **Always write the `.human` mirror** (the two-register model above) — at every tier, derived, with the sequence diagram via the mermaid skill. Set `human_summary` in frontmatter (always present).
13. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer (from architect's component map + anchor's stack defaults), wait. Adapt to `technical_user` from `.ai/intake.md`. Keep the jargon (LLD, DDL, idempotency, schema delta) in the `.ai/` artifact — never in the question.
14. **Read back before writing.** Assemble the draft from [references/template.md](references/template.md), scan it against [references/anti-patterns.md](references/anti-patterns.md), strip symptoms, then read it back: *"where did I misrepresent you? Any module that's actually two? Any path that doesn't match the stack? Any invariant violated?"* Edit for fidelity.
15. **The gate is advisory.** Issue the real verdict with reasons; the user may override a negative verdict → `verdict_overridden: true` + recorded reason, still write the artifact. Never water down.
16. **Tracker.** Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on `READY-FOR-PLAN` per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
design progress:
- [ ] Phase 0: Load tracker top 5; load prd (REQUIRED → tier) + architecture (REQUIRED) + anchor (REQUIRED) + research/understanding/context (warn); detect existing design (update mode)
- [ ] Phase 1: Inherit tier from prd + announce; triage PRD Open questions — early-exit to upstream verdict if any is (b)/(c)
- [ ] Phase 2: Architectural placement — finalize prd's proposed component; REFUSE orphan → NEEDS-ARCHITECTURE-UPDATE
- [ ] Phase 3: Surface detect (light, from maps_to_component + anchor stack) → apply references/surfaces.md checklist (AI/LLM mandatory if ai_in_core_path)
- [ ] Phase 4: Module decomposition (verb-noun, additive) + file/folder layout (anchor conventions)
- [ ] Phase 5: External dependencies — govern all tiers; bias reuse; record dep_adds[]
- [ ] Phase 6: Schema deltas + API contracts (light [M] / full [Pr])
- [ ] Phase 7: Call-flow step list (the .ai structure); + failure modes & observability [M][Pr]; + characteristics check [Pr]
- [ ] Phase 8: Test plan [M][Pr]; per-feature ADR scan (3-trigger)
- [ ] Phase 9: Read back; scan anti-patterns; collect fidelity corrections
- [ ] Phase 10: Write .ai/specs/<feature>/design.md (tier cap) + ALWAYS the .human mirror (sequenceDiagram via mermaid); back-annotate PRD Open questions
- [ ] Phase 11: Append tracker (success only); issue verdict
```

### Phase 0 — Session context + inputs + mode
Read `.ai/progress-tracker.md` top 5 (expect a `prd landed (<feature>)` entry; maybe `research landed`). Then load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/specs/<feature>/prd.md` | effective `tier:` (INHERIT), functional reqs, NFRs, scope, `placement` hint, `ai_card`, `## Open questions` | **BLOCKED-ON-PRD** |
| `.ai/architecture[.md\|/]` | `02-components` (placement target), invariants, style, top-3 characteristics (prod) | **refuse** (no map to place into) |
| `.ai/architecture/api-governance.md` | cross-feature API conventions (error envelope, pagination, auth, naming, versioning) — Phase 6 conformance | warn (only when the feature has an API surface) |
| `.ai/anchor.md` | stack (file layout), `approved_dependencies`, `project_type`, security gate (prod) | **BLOCKED-ON-ANCHOR** |
| `.ai/test-strategy.md` | pyramid levels, fixture conventions, canonical entity acquisition, E2E journey table | warn |
| `.ai/data-management.md` | migration tool, directory, naming + reversibility rule for schema deltas | warn |
| `.ai/environments.md` | env roster, config-var naming conventions, secrets policy, flag system — for new config + observability sections | warn |
| `.ai/pipeline.md` | pipeline-touching features only (CI, deploy, release wiring): the gate/deploy contract the change traces to | warn (when the feature touches the pipeline) |
| `.ai/specs/<feature>/research.md` | brownfield prior-art / integration surfaces | warn (if present) |
| `.ai/specs/<feature>/ux.md` | UI surfaces: screens, four interaction states, flows, component usage — the UI contract | warn (UI-bearing surfaces only; recommend `/ux-spec <feature>` if absent) |
| `.ai/understanding/<slug>.md` + `.ai/context.md` | invariants, entity terms (use verbatim) | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

If `.ai/specs/<feature>/design.md` exists: restate it (placement, module count, ADR count), **cross-check its placement against the PRD's current `placement` hint** (surface drift if they differ), and ask which sections to update (**update mode** — preserve the rest).

### Phase 1 — Inherit tier, announce, triage Open questions
Read the PRD's `tier:` and **inherit it verbatim** (rule 1). Announce: *"PRD tier: production (uplifted from mvp for PII per `prd.md`). Running production-tier design: placement + modules + file layout + schema deltas + full API contracts (versioning + 4xx/5xx) + call flow + failure modes + observability + characteristics check + test plan + per-feature ADRs + governed deps. Cap 250 lines."* Then triage the PRD's `## Open questions` (rule 5) — early-exit if any is (b)/(c). Prototype PRDs carry no Open questions — skip.

### Phase 2 — Architectural placement (the orphan gate)
Start from the PRD's proposed `placement`. Read `02-components.md` (mvp/prod) or the inline component list (prototype). Finalize: single match → record as `maps_to_component`; spans multiple → allowed but justify (candidate per-feature ADR in Phase 8); **no match → REFUSE: `NEEDS-ARCHITECTURE-UPDATE → /architect`** (don't invent a component; the user updates architecture or rescopes the feature).

### Phase 3 — Surface detection (light)
Infer the surface from `maps_to_component` + the anchor stack (e.g. a component owning a browser view + a Next.js stack → web-ui; an `ai_in_core_path` feature → ai-llm). No picker round — recommend and confirm in one line. Apply the matching checklist from [references/surfaces.md](references/surfaces.md) (3–5 design concerns + a file-layout hint each). **AI/LLM is mandatory** when `ai_in_core_path` or the PRD has an AI transparency card (rule 8).

### Phase 4 — Modules + file layout
Within the placed component, decompose **additively** — modules NEW or MODIFIED for this feature, not the full component. Each: verb-noun name (rule 11), one present-tense role sentence, inbound/outbound, rough LoC ceiling (>500 → split). Counts: prototype 1–3 · mvp 2–5 · production 3–8. Then map to **concrete file paths** using anchor's stack conventions (the surface checklist may add a UI tree / pipeline DAG / IaC module). For a UI-bearing surface with `.ai/specs/<feature>/ux.md` present, the file layout must cover **every screen** in its `## Screens` list — an unmapped screen is a gap to surface to the user, never to silently drop; component references reuse the design-system inventory names from `.ai/design-system.md`.

### Phase 5 — External dependencies (governed, all tiers)
Per rule 7. List candidate packages per module; mark `reuse` (in `approved_dependencies`/lockfile) or `new`; trust-judge each `new`; record one row per candidate in the External dependencies section and add `new` ones to frontmatter `dep_adds[]` flagged for anchor. **License check (every `new` dep):** identify the license (SPDX id, from registry metadata) and check it against the project's intended distribution — read `anchor.md` for a license policy field; absent → flag the `dep_adds[]` entry `license: <SPDX id> — compatibility unreviewed` and tell the user copyleft licenses (GPL/AGPL) need a human decision for commercial/closed distribution. Surface and record only — never give legal advice. Skip the table only if every candidate is `reuse` (note *"no new external deps — all in anchor allowlist"*). Detail: [references/deps-governance.md](references/deps-governance.md).

### Phase 6 — Schema deltas + API contracts [M][Pr]
**Schema deltas** (skip if none): migration file name (date prefix), forward, **rollback (always)**, backfill plan, impacted indexes. If `.ai/data-management.md` exists, the migration file name, directory, and rollback discipline follow its `## Migration policy` verbatim — a delta that violates the naming convention or omits the required down (without that artifact's argued irreversible flag) is rejected here, not at review. Reject "add a column" without type/default/migration/rollback. **API contracts** (skip if no API surface): light table at mvp, full at production — method+path, auth, request/response shapes, **4xx/5xx error shapes** (one per case), **idempotency** for any state-changing endpoint (mvp+), versioning strategy (production). **When `.ai/architecture/api-governance.md` exists, every contract MUST conform to it** — error envelope, pagination, auth, naming, versioning; a deliberate deviation needs a per-feature ADR (Phase 8), and silently diverging is rejected. Missing on an API-bearing feature → warn (Phase 0) and design on the contract's own conventions. Format + error-shape conventions: [references/api-contracts.md](references/api-contracts.md). Production functional reqs trace to the PRD's EARS clauses ([`../prd/references/ears.md`](../prd/references/ears.md)).

### Phase 7 — Call flow + resilience + characteristics
Write the **call-flow step list** — a structured, numbered list of the most important flow (actor/component per step, async hops marked). This is the `.ai` structure the `.human` `sequenceDiagram` renders from in Phase 10 — author it as steps, not a diagram. At **[M][Pr]** add **failure modes** (per hop: what breaks · detection · response: retry/backoff/circuit/fallback/dead-letter · user-visible effect) and **observability hooks** (structured-log fields incl. `trace_id` + PII redaction rule, metrics, trace spans; prod adds alert thresholds). When the PRD success metric's `source` is app-emitted (an event/log/metric rather than an external query), the hooks MUST include it — name the event or metric and the call-flow step that emits it, so `/measure` has a real measurement source after ship; a metric whose source nothing in the design emits is a gap to close here, not at `/measure`. Any new config/env var the design introduces follows `.ai/environments.md`'s naming convention and names its per-env storage location (never a value) — and is flagged for an `/environments` update-mode re-run, the config counterpart of `dep_adds[]`. At **[Pr]** run the **characteristics check** — for each `Characteristics honored:` line in PRD Notes, point to the design element that supports it; **block the write** if any is unsupported (extend the design or drop the PRD claim). Skeleton: [references/sequence-diagram.md](references/sequence-diagram.md).

### Phase 8 — Test plan + per-feature ADRs [M][Pr]
**Test plan** (mvp+): unit / integration / e2e, each with concrete file path + one-line coverage + prior-art ref (or "first of this kind — establishes the pattern"). Reject "add unit tests". When `.ai/test-strategy.md` exists, every test-plan level, naming/location choice, and fixture use cites its conventions (the pyramid rows, the canonical entity-acquisition pattern, the feature's mapped E2E journey spec) — a test plan that contradicts the locked strategy is reworked or escalated to a `/test-strategy` update, never silently diverged. **ADR scan**: per-feature decisions only, 3-trigger test (hard to reverse + surprising without context + real trade-off — all three). Files in `.ai/specs/<feature>/adr/NNNN-<slug>.md` (per-feature, NOT project-level). Framework/db/event-bus choices are upstream — not ADRs here.

### Phase 9 — Read back
Assemble from [references/template.md](references/template.md), scan [references/anti-patterns.md](references/anti-patterns.md), strip symptoms, read back (rule 14). Edit for fidelity.

### Phase 10 — Write both registers
Enforce the tier line cap (90/185/250); over → split (rule 10). Write **`.ai/specs/<feature>/design.md`** (structured, per the [`../_shared/ai-schema.md`](../_shared/ai-schema.md) schema; create the folder + any `adr/`). Then **always** write the derived **`.human/specs/<feature>/design.md`** mirror — plain-English walkthrough + a `sequenceDiagram` generated FROM the call-flow step list via the [mermaid skill](../mermaid/SKILL.md) (validated). Then **back-annotate** the PRD's `## Open questions` — append `→ Resolved in design.md §<section>` to each (a)-class item resolved here. Update mode: rewrite only named sections; regenerate the mirror from the updated `.ai` file.

### Phase 11 — Tracker + verdict
Append a tracker entry on `READY-FOR-PLAN` (skip on refusals). Issue exactly one verdict:

- **`READY-FOR-PLAN → /plan <feature>`** — placement valid, tier sections present, no invariant violations, modules sized, every new dep declared + judged. **At production, route to `/to-fitness` first** (NFR→fitness functions), then `/plan`. Hand off: *"Design is the contract. Production → `/to-fitness <feature>` to bind NFRs to fitness functions, then `/plan <feature>`. `/plan` inherits the External dependencies verbatim; the builder uses the exact packages named here — no substitutions."*
- **`NEEDS-PROTOTYPE`** — design hinges on an unverified assumption (third-party API behavior, perf at load, novel library). State it; recommend a 1-day spike, then re-run.
- **`NEEDS-RESEARCH → /research`** *(brownfield only — gate on `project_type: brownfield`)* — design needs prior-art it doesn't have (existing module shape, current API surface, integration contract). State the specific unknown. Greenfield cannot emit this.
- **`NEEDS-ARCHITECTURE-UPDATE → /architect`** — no component fits (orphan, Phase 2) or the feature needs a cross-component contract architecture doesn't define. Name the missing component; don't invent it.
- **`BLOCKED-ON-PRD → /prd <feature>`** — PRD missing, blocked, or has unresolved `NEEDS-MORE-CLARITY`. Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no `anchor.md`; nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/design.md`** — MACHINE-facing per-feature LLD. Frontmatter index + structured sections (modules, file list, schema deltas, API-contract tables, call-flow step list); read by `/plan`, `/to-fitness`, `/qa`. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams.**
- **`.human/specs/<feature>/design.md`** *(every tier)* — HUMAN-facing derived mirror; plain-English walkthrough + a validated `sequenceDiagram` rendered from the call-flow step list via the mermaid skill. Never hand-authored.
- **`.ai/specs/<feature>/adr/NNNN-*.md`** *(if any per-feature decision passes the 3-trigger test)* — per-feature ADRs, separate from project-level `adr/`.

## References
- Per-tier section matrix + line caps 90/185/250 + what each tier adds: [references/tier-matrix.md](references/tier-matrix.md)
- API-contract table format · versioning · 4xx/5xx error shapes · idempotency · api-governance conformance: [references/api-contracts.md](references/api-contracts.md)
- Dependency governance — slopsquatting, plan-time trust bar, license check, CI hand-off: [references/deps-governance.md](references/deps-governance.md)
- Call-flow step list → `.human` sequenceDiagram skeleton + render rule: [references/sequence-diagram.md](references/sequence-diagram.md)
- Per-surface design checklist (web-ui · mobile · ai-llm · data-pipeline · cli/lib · infra) + file-layout hints: [references/surfaces.md](references/surfaces.md)
- Module naming (Entity Trap, verb-noun) — cross-linked one-hop: [`../architect/references/naming.md`](../architect/references/naming.md)
- EARS clauses the production design traces to — one-hop: [`../prd/references/ears.md`](../prd/references/ears.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Per-tier design skeleton: [references/template.md](references/template.md)

</supporting-info>
