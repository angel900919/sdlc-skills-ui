---
name: test-strategy
description: |-
  Locks the project-wide test strategy — the test pyramid, fixture and factory conventions, seed data, test database approach, and the cross-feature E2E journey suite — so every red-first MTDD slice obtains test data the same canonical way and journey coverage survives across features. Runs once after /architect, before the per-feature loop: greenfield alongside /bootstrap; brownfield after /explore, where it recovers the repo's existing test conventions (framework, fixture patterns, test db setup) and confirms them with file:line citations instead of inventing new ones. Governs fixture libraries against anchor's approved dependencies and writes .ai/test-strategy.md plus a plain-English mirror at mvp and above. Use when the user says "/test-strategy", "test strategy", "fixtures", "test data", "seed data", "how should tests get data", "E2E suite", or "journey tests". Do NOT use for: running tests (/qa, /mtdd-verify), writing tests or fixtures (the build phase), or authoring NFRs (/prd).
---

<what-to-do>

You lock the **project-wide test strategy** — the one-time contract for *how tests get data* and *how user journeys stay covered across features* — at `.ai/test-strategy.md`. You run **once per project**, after `/architect` (you need its component list and understanding's journeys), before the per-feature loop.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) before writing. Don't restate them — reference them.

## The decide-vs-inherit boundary (read this first)

- **INHERITS, never re-decides.** The stack, `project_tier`, and `approved_dependencies` are LOCKED in `.ai/anchor.md`; components and characteristics live in `.ai/architecture[.md|/]`; journeys live in `.ai/understanding/<slug>.md` behaviors; entities live in `.ai/context.md`. This skill is **project-scope** — it reads `anchor.project_tier` directly (there is no per-feature uplift here; a PII-uplifted *feature* still uses these project conventions, and its extra rigor lives in its PRD).
- **DECIDES — the testing HOW.** Which pyramid levels exist, naming + location conventions, factory vs fixture and the library, the one canonical way a test obtains an entity, seed data, the test-db approach, the brownfield data rule, the journey→E2E-spec mapping, and (production) where perf tests live.

## Critical rules

1. **Anchor is required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`; nothing written. It carries the stack (which determines the framework menu), the locked tier, `approved_dependencies`, `project_type`, and `uplift_signals`.
2. **Architecture is required.** No `.ai/architecture[.md|/]` → `BLOCKED-ON-ARCHITECT → /architect`; nothing written. The pyramid's integration level is shaped by the component/dependency-edge structure, and (production) the perf note reads `characteristics.yaml`.
3. **Tier inherited from `anchor.project_tier`** — never recomputed, never asked. prototype = skip offer (rule 4); mvp = required, full minus perf; production = full. Hard line caps **90 / 185 / 250**.
4. **Prototype may skip — on the record.** At prototype, *offer* `SKIPPED-PROTOTYPE` as the recommendation (a throwaway doesn't need a strategy doc). If the user wants one anyway, write the ≤90-line minimal version: framework + one fixture convention + naming/location. Never silently skip at mvp+.
5. **Brownfield: RECOVER, don't invent.** When `project_type: brownfield`, the repo already votes. Read `.ai/recon.md`'s test facts, then detect from disk: the test framework, existing fixture/factory patterns, test-db setup, seed scripts. **Confirm rather than invent**, citing `file:line` for every recovered claim — the same discipline as `/comprehend`. Propose the detected conventions as defaults; only fill genuine gaps with new conventions. Checklist: [references/brownfield-recovery.md](references/brownfield-recovery.md).
6. **Govern the fixture/factory library.** Read `anchor.approved_dependencies`; bias hard toward reuse (the framework's built-in fixtures often suffice). A new library is named exactly, trust-judged per [`../design/references/deps-governance.md`](../design/references/deps-governance.md), and recorded in frontmatter `dep_adds[]` flagged for anchor — **anchor owns the list; never silently add**.
7. **One canonical way to obtain an entity.** For every entity in `.ai/context.md`'s entity list, the strategy names exactly one acquisition pattern (one factory/fixture per entity, with the override convention). Two ways to make a User is how suites rot. Menu + pattern: [references/fixture-conventions.md](references/fixture-conventions.md).
8. **The E2E journey suite is append-only across features (mvp+).** Every journey in `.ai/understanding/<slug>.md` behaviors maps to **one named E2E spec file** with its owning feature(s). The standing rule downstream: each feature's tracer-bullet slice **extends** the mapped journey spec — never creates a parallel suite. Table template: [references/e2e-mapping.md](references/e2e-mapping.md). Missing understanding → warn, write the section as a TODO stub, and say so in the hand-off.
9. **PII makes the brownfield data rule mandatory.** If `pii` (or `regulatory`) is in `anchor.uplift_signals` on a brownfield project, the `## Brownfield data rule` section (anonymization/synthesis policy — production data never enters tests verbatim) is required, not optional. Greenfield or no real data → state `n/a` explicitly.
10. **This skill writes conventions, never code.** No test files, no fixtures, no factories, no seed scripts (build phase); no test runs (`/qa`, `/mtdd-verify`); no NFRs (`/prd`); no stack lock (`/anchor`); no slicing (`/plan`). It names paths and patterns; the build phase materializes them.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer (from the stack's idiomatic default or the brownfield detection), wait. Adapt to `technical_user` from `.ai/intake.md`; non-technical users get outcomes ("every test starts from the same clean example data"), not the words fixture/factory/truncation.
12. **Read back before writing.** Assemble the draft from [references/template.md](references/template.md), then read it back: *"where did I misrepresent you? Any convention that contradicts what's already in the repo? Any journey missing from the E2E table?"* Edit for fidelity.
13. **Two registers.** `.ai/test-strategy.md` is structured (frontmatter index + fixed-order sections, no diagrams). At **mvp+** also write the derived `.human/summaries/test-strategy.md` mirror: 3–6 plain bullets + **ONE** validated Mermaid diagram via the [mermaid skill](../mermaid/SKILL.md) (test-pyramid flowchart or journey→suite map). Prototype writes no mirror.
14. **The gate is advisory; tracker on success only.** Issue the real verdict with reasons; the user may override on the record (`verdict_overridden: true` + reason). Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry only on `TEST-STRATEGY-LOCKED` (or a user-requested prototype write). Update mode refreshes named sections in place.

## Procedure

Copy this checklist:

```
test-strategy progress:
- [ ] Phase 0: Tracker top 5; load anchor (REQUIRED → tier/stack/deps/type) + architecture (REQUIRED) + understanding/context (warn) + recon (brownfield) + intake; detect existing test-strategy.md (update mode)
- [ ] Phase 1: Announce tier + scope; prototype → offer SKIPPED-PROTOTYPE
- [ ] Phase 2: Brownfield recovery — detect framework/fixtures/test-db from recon + disk; confirm with file:line
- [ ] Phase 3: Test pyramid contract — levels, what belongs at each, naming + location
- [ ] Phase 4: Fixture & factory strategy — choice, governed library, canonical entity acquisition (context.md entities)
- [ ] Phase 5: Seed data + test database/services approach [mvp+]; brownfield data rule (pii → mandatory)
- [ ] Phase 6: E2E journey suite [mvp+] — journeys → named spec files → owning features; extension rule
- [ ] Phase 7: Performance-test infrastructure note [production] — from architecture characteristics
- [ ] Phase 8: Read back; write .ai/test-strategy.md (tier cap) + .human mirror [mvp+] via mermaid
- [ ] Phase 9: Append tracker (success only); issue exactly one verdict
```

### Phase 0 — Session context + inputs + mode
Read `.ai/progress-tracker.md` top 5 (expect `architect landed`). Then load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (INHERIT), stack, `approved_dependencies`, `project_type`, `uplift_signals` | **BLOCKED-ON-ANCHOR** |
| `.ai/architecture[.md\|/]` | components + dependency edges (integration seams), `characteristics.yaml` (prod) | **BLOCKED-ON-ARCHITECT** |
| `.ai/understanding/<slug>.md` | `## Behaviors` journeys → the E2E table | warn (E2E section becomes a TODO stub) |
| `.ai/context.md` | entity list → the factory/fixture roster | warn (entity roster deferred) |
| `.ai/recon.md` | brownfield: existing test facts (Section A/E citations) | warn (brownfield only — detect from disk) |
| `.ai/intake.md` | `technical_user` → question depth | warn |

If `.ai/test-strategy.md` exists: restate it (framework, fixture choice, journey count), ask which sections to refresh, and switch to **update mode** — rewrite only the named sections, preserve the rest (especially the E2E table's existing spec-file names — features already extend them; a rename is recorded as old→new with a migration note, never a silent replace — plus confirmed brownfield citations and adopted `dep_adds[]`), regenerate the mirror from the updated `.ai` file.

### Phase 1 — Announce tier + scope (or skip)
Announce: *"Anchor tier: mvp. Locking the project test strategy: pyramid + fixtures + seed data + test db + the cross-feature E2E journey suite. Cap 185 lines."* At **prototype**, recommend the skip in plain words: *"For a throwaway prototype I'd skip the test-strategy doc and let slices test ad hoc — want me to skip it, or write a minimal one (framework + one fixture convention)?"* Skip accepted → `SKIPPED-PROTOTYPE` (Phase 9 directly; no artifact, no tracker append). Minimal wanted → run Phases 2–4 only, ≤90 lines.

### Phase 2 — Brownfield recovery (skip for greenfield)
Per rule 5 and [references/brownfield-recovery.md](references/brownfield-recovery.md): harvest recon's test facts, then detect from disk — framework + runner config, existing fixture/factory/helper patterns, test-db setup (transaction/truncate/container), seed scripts, existing E2E tooling. Read back the recovered picture with `file:line` citations: *"You already test with pytest + factory_boy; factories in tests/factories/ (tests/factories/user.py:12). Keep these as the locked conventions?"* The user confirms or corrects per item; only uncovered gaps get newly proposed conventions (marked `(new)` in the artifact).

### Phase 3 — Test pyramid contract
Decide which levels exist at this tier (prototype: unit + maybe one smoke; mvp: unit / integration / e2e; production: all + perf note later), **what belongs at each** (one line per level — e.g. "integration = anything crossing a dependency edge in architecture's component table"), and the naming + location conventions, mirroring anchor's stack conventions (e.g. `tests/unit/test_<module>.py` for pytest, `src/**/*.test.ts` co-located for vitest). One recommended convention per question, not a menu.

### Phase 4 — Fixture & factory strategy
Per rules 6–7 and [references/fixture-conventions.md](references/fixture-conventions.md): pick factory vs fixture (recommend by stack idiom), the library (reuse-first, governed; `new` → `dep_adds[]`), naming/location, and — the heart of the artifact — the **canonical entity-acquisition table**: one row per entity in `.ai/context.md` (entity → factory/fixture name → location → override convention). Entities missing from context.md are not invented here — note the gap for `/understand`.

### Phase 5 — Seed data + test db [mvp+]
**Seed data:** the seed script location, what the canonical dev dataset contains (a handful of named, recognizable rows per entity — enough to click around), and the sync rule (the seed runs in CI after migrations, so a schema migration that breaks the seed fails the build — name the mechanism). **Test database/services:** per-test transaction-rollback vs truncation vs containers (recommend by stack + db from anchor); how integration tests obtain a db (and any other real service); what is faked vs real at each pyramid level. **Brownfield data rule** per rule 9: anonymization/synthesis policy, or an explicit `n/a`.

### Phase 6 — Cross-feature E2E journey suite [mvp+]
Per rule 8 and [references/e2e-mapping.md](references/e2e-mapping.md): one table row per journey from `.ai/understanding/<slug>.md` behaviors — journey → **one named spec file** (e.g. `e2e/journeys/book-a-run.spec.ts`) → owning feature(s) from `.ai/features.md`. Record the standing **extension rule** verbatim in the artifact: *"a feature's tracer-bullet slice extends the mapped journey spec; new parallel journey suites are rejected at `/plan` and `/qa`."* Name the E2E tool (governed like any dependency).

### Phase 7 — Performance-test note [production only]
Read `top_3` from architecture's `characteristics.yaml`. For each characteristic with a load-shaped `measurement` (latency, throughput, concurrency), note: where load tests live (e.g. `tests/perf/`), the tool (governed), and **which NFR/characteristic each exercises** (name + the number). This is a *location + tool + trace* note — the NFRs themselves are `/prd`'s, the fitness functions `/to-fitness`'s.

### Phase 8 — Read back + write
Assemble from [references/template.md](references/template.md); read back per rule 12; enforce the tier line cap (90/185/250 — over cap means the tier is being asked for more than it supports: cut optional sections, never the canonical-acquisition table). Write **`.ai/test-strategy.md`** (schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). At **mvp+** write the derived **`.human/summaries/test-strategy.md`**: one-sentence "here's how tests get data and how journeys stay covered," 3–6 plain bullets, ONE validated diagram via the [mermaid skill](../mermaid/SKILL.md), link back.

### Phase 9 — Tracker + verdict
Append a tracker entry on success per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Issue **exactly one** verdict:

- **`TEST-STRATEGY-LOCKED`** — artifact written; conventions confirmed (brownfield: recovered + cited). Hand-off branches on `anchor.project_type`: **greenfield → `/bootstrap`** (*"bootstrap wires the test runner, seed script, and e2e folder this strategy names"*); **brownfield → `/prd`** (*"the per-feature loop starts; every design's test plan and every tracer bullet now cites these conventions"*). If understanding was missing, add: *"the E2E table is a stub — re-run `/test-strategy` after `/understand` or `/comprehend`."*
- **`SKIPPED-PROTOTYPE`** — prototype tier, user accepted the skip. Nothing written; note that `/promote` to mvp should trigger a real `/test-strategy` run.
- **`BLOCKED-ON-ARCHITECT → /architect`** — no architecture artifact. Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no anchor. Nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/test-strategy.md`** — MACHINE-facing project test contract. Frontmatter index + fixed-order sections (pyramid · fixtures/factories · seed data · test db · brownfield data rule · E2E journey table · perf note). Read by `/design` (test plan), `/plan` (tracer acceptance), `mtdd-implement` (red-phase briefing), `/qa` (journey regression), `/bootstrap` (skeleton wiring). Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams.**
- **`.human/summaries/test-strategy.md`** *(mvp+ only)* — HUMAN-facing derived mirror; 3–6 plain bullets + one validated Mermaid diagram (test pyramid or journey→suite map) via the mermaid skill. Never hand-authored; `.ai` wins on disagreement.

## Position in the SDLC
```
greenfield:  /architect → /test-strategy (HERE) + /bootstrap → /prd → per-feature loop
brownfield:  /explore → /comprehend → /architect → /test-strategy (HERE) → [/health-audit] → /feature-census → /prd
```

## References
- Per-tier artifact skeleton + line caps 90/185/250: [references/template.md](references/template.md)
- Factory-vs-fixture decision, per-ecosystem library menu, canonical entity-acquisition pattern: [references/fixture-conventions.md](references/fixture-conventions.md)
- E2E journey→suite mapping table + naming + the extension rule: [references/e2e-mapping.md](references/e2e-mapping.md)
- Brownfield recovery checklist (framework / fixtures / test db / seeds, with citation discipline): [references/brownfield-recovery.md](references/brownfield-recovery.md)
- Dependency governance for fixture/E2E/load libraries — one-hop: [`../design/references/deps-governance.md`](../design/references/deps-governance.md)

</supporting-info>
