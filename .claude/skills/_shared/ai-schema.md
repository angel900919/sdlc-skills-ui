# `.ai` artifact schemas (machine-facing)

The structured source-of-truth formats for the `.ai` artifacts. Optimised for **agent consumption**: explicit frontmatter index, fixed section order, structured data over narrative. Folder model and handoff rules are in [conventions.md](conventions.md).

## Design rules (apply to every `.ai` artifact)

1. **Frontmatter is the index.** High-signal fields live in YAML frontmatter so a downstream agent reads ~15 lines to decide whether to load the body. Verdict, slug, tier, entities, and `consumed_by` always go here.
2. **Fixed section order.** Sections appear in the same order in every artifact of a kind, with stable `##` headings, so a skill can extract one section without reading the rest.
3. **Structure over prose.** Prefer YAML lists, tables, and `key: value` over paragraphs. A sentence is fine for a definition; a paragraph of narrative is a smell.
4. **No diagrams here.** Mermaid is for `.human/`. Use state lists, ER tables, and entity YAML instead.
5. **Explicit over implicit.** Name assumptions, open questions, and rationale rather than leaving them inferred.

---

## `.ai/intake.md` — handoff stub (written by /intake [greenfield] or /onboard [brownfield])

Tiny. It is an index + handoff, not a brief — the human prose lives in `.human/intake/idea.md`. `/intake` writes it for a fresh idea (`project_type: greenfield`) and routes to `/discovery`; `/onboard` writes the same stub for an existing codebase (`project_type: brownfield`) and routes to `/anchor`.

```markdown
---
slug: <kebab-case-idea-name>
project_type: greenfield | brownfield
predicted_tier: prototype | mvp | production
technical_user: non-technical | mixed | technical
stage: intake
status: complete
uplift_signals: []            # any of: money, pii, sla, external-dependants, regulatory
human_doc: .human/intake/idea.md
created: YYYY-MM-DD
---

# Intake handoff — <slug>

**One line:** <plain-English what + who, machine-terse>

## Captured
- who: <the first user>
- job: <what they're trying to get done>
- core_things: [<thing>, <thing>]

## Next
- ready_for: discovery        # or feature-map directly, if prototype skips deep stages
```

---

## `.ai/discovery/<slug>.md` — discovery artifact (written by /discovery)

```markdown
---
slug: <slug>
stage: discovery
status: draft | complete
verdict: PROCEED | INVESTIGATE | KILL
verdict_overridden: false
tier_signal: prototype | mvp | production
jtbd: "When <situation>, I want to <motivation>, so I can <outcome>"
entities: [<Noun>, <Noun>]            # candidate domain nouns -> understanding will model these
success_metric: "<metric> to <target> within <timeframe>"
reversibility: easy | moderate | hard
source: .human/intake/idea.md
human_summary: .human/summaries/discovery.md
consumed_by: [understand, feature-map, architect]
created: YYYY-MM-DD
---

# Discovery — <slug>

## Problem
- who_hurts: <specific person/role>
- when_it_shows_up: <trigger / frequency>
- why_unsolved: <gap in today's options>

## Target user
- name: <real or composite>
- role: <role/context>
- constraint: <what makes them feel the pain>
- todays_workaround: <tool/spreadsheet/none>

## Job to be done
> When <situation>, I want to <motivation>, so I can <outcome>.

## Success metric
| field | value |
| :-- | :-- |
| metric | <what is counted> |
| baseline | <today's number + source> |
| target | <winning number> |
| timeframe | <by when> |
| source | <how measured> |

## Kill criteria
- If <falsifiable condition> by <date/milestone>, stop — because <reason>.

## Scope
- v0_1: [<capability>, <capability>, <capability>]      # 3–5
- deferred:
  - { item: <capability>, revisit: YYYY-MM-DD }
- non_goals: [<never>, <never>]                          # 3–5

## Constraints
- time: <…>
- budget: <…>
- team: <…>
- regulatory: <HIPAA | GDPR | none | …>
- ethical: <…>

## Open questions
- <unknown that would most reduce uncertainty>

## Cost analysis
- cost_of_delay_3mo: <…>
- cost_of_being_wrong: <…>
- reversibility: easy | moderate | hard

## Decision
**<VERDICT>** — <one-line rationale>. <If verdict_overridden: "User chose to continue past <verdict> because <reason>.">

## References
- source: .human/intake/idea.md
- human_summary: .human/summaries/discovery.md
- research: <links/notes from sub-agent research, if any>
```

---

## `.ai/understanding/<slug>.md` — understanding artifact (written by /understand [greenfield] or /comprehend [brownfield])

The glossary and entity definitions live in `.ai/context.md` (shared). This file references them and adds invariants, behaviors, boundaries, and assumptions. `/understand` builds it by interview from `.ai/discovery/<slug>.md` (`source_discovery`, verdict `READY-FOR-FEATURE-MAP`); `/comprehend` builds the **same file** by confirming a code-derived draft from `.ai/recon.md` (`source_recon`, verdict `READY-FOR-ARCHITECT`). Downstream consumers don't care which produced it.

```markdown
---
slug: <slug>
stage: understanding
status: draft | complete
verdict: READY-FOR-FEATURE-MAP | READY-FOR-ARCHITECT | NEEDS-EVENT-STORM | BLOCKED-ON-DISCOVERY | BLOCKED-ON-RECON
verdict_overridden: false
entities: [<Name>, <Name>]            # in-scope entities; defined in context.md
invariant_count: <N>
source_discovery: .ai/discovery/<slug>.md   # greenfield (/understand); OR:
source_recon: .ai/recon.md                  # brownfield (/comprehend) — exactly one of the two
context_file: .ai/context.md
human_summary: .human/summaries/understanding.md
consumed_by: [feature-map, architect, prd]
created: YYYY-MM-DD
---

# Understanding — <slug>

## Glossary
Defined canonically in `.ai/context.md`. In scope here:
- <Term>, <Term>, <Term>
Scope-local notes (if a term means something narrower here):
- <Term>: <narrowing note>

## Invariants
Falsifiable domain rules that must always hold, regardless of implementation.
1. <rule>
2. <rule>

## Behaviors
Top 1–3 end-to-end journeys, structured.
- journey: <name>
  trigger: <real-world event>
  steps: [<user action>, <user action>, <user action>]
  outcome: <what is true at the end that wasn't before>
  failure_mode: <what happens if it goes wrong mid-flow>

## Boundaries
- in: [<behavior>, <behavior>]
- out:
  - { item: <behavior>, revisit: YYYY-MM-DD }
- never: [<behavior>, <behavior>]

## Open assumptions
- assumption: <specific belief>
  source: <user | brief | gut>
  falsification_test: <cheapest thing that would prove it wrong>

## Decisions
- <ADR link, or "none">

## Verdict
**<VERDICT>** — <one-paragraph rationale>. <override note if any>

## References
- source_discovery: .ai/discovery/<slug>.md
- context_file: .ai/context.md
- human_summary: .human/summaries/understanding.md
```

---

## `.ai/context.md` — shared glossary + entity models (written/updated by /understand [greenfield] or /comprehend [brownfield])

The cross-skill reuse hotspot. One file per repo (or `CONTEXT-MAP.md` + per-context files for multi-context repos). Pure domain language — no file paths, no class names, no DB columns.

```markdown
---
stage: context
updated: YYYY-MM-DD
sources: [.ai/understanding/<slug>.md]
---

# Domain context

## Glossary
- <Term>: <one-line definition in domain language>
- <Term>: <one-line definition>

## Entities
- name: <Entity>
  definition: <one line>
  key_attributes: [<attr>, <attr>]
  states: [<state>, <state>]            # if it has a lifecycle
  invariants: [<rule that always holds for this entity>]
- name: <Entity>
  definition: <one line>
  key_attributes: [<attr>]

## Relationships
| from | cardinality | to | verb |
| :-- | :-- | :-- | :-- |
| <Entity> | one-to-many | <Entity> | <verb, e.g. "books"> |
```

This is the machine entity model. Its human mirror — an `erDiagram` / `stateDiagram-v2` — goes in `.human/summaries/understanding.md`, generated via the mermaid skill.

---

## `.ai/features.md` — feature roster (written by /feature-map [greenfield] or /feature-census [brownfield])

The prioritized roster of atomic vertical features. **Greenfield (`/feature-map`):** decomposition source is understanding's `behaviors` (each journey → one or more independently-shippable slices); discovery's `scope` is the envelope and the P0 signal; all rows start `status: planned`. **Brownfield (`/feature-census`):** the roster is *inventoried from the code* — existing capabilities are `status: shipped`, sourced from `recon.md` Section B components (cited in `satisfies`/Notes) and cross-traced to behaviors; new work the user names is `status: planned`. Priority + tier cap apply to **planned** rows only; the shipped inventory is whatever exists. `context.md` entities keep names honest. The index `/prd` reads to pick the next feature; `/anchor` reads it to size tier-relevant choices.

```markdown
---
slug: <slug>
stage: feature-map                       # or: feature-census (brownfield)
status: draft | complete
verdict: READY-FOR-ANCHOR | READY-FOR-PRD | NEEDS-DECOMPOSITION | BLOCKED-ON-UNDERSTANDING | BLOCKED-ON-DISCOVERY | BLOCKED-ON-RECON | BLOCKED-ON-COMPREHEND
verdict_overridden: false
tier: prototype | mvp | production       # effective tier (intake predicted_tier, after uplift)
tier_cap: <N>                            # prototype 4 | mvp 8 | production 10 — applies to PLANNED rows
in_scope_count: <N>
trace_status: complete | tentative | partial   # tentative = decomposed/cataloged without understanding
features: [<feature-slug>, <feature-slug>]      # all in-scope ids, priority order
p0: [<feature-slug>]                            # the critical few (aim ≤4)
source_discovery: .ai/discovery/<slug>.md           # greenfield (/feature-map); OR:
source_recon: .ai/recon.md                          # brownfield (/feature-census) — components are the shipped-feature source
source_understanding: .ai/understanding/<slug>.md   # or: none
context_file: .ai/context.md
human_summary: .human/summaries/features.md
consumed_by: [anchor, prd, design, architect]
created: YYYY-MM-DD
---

# Features — <slug>

## In scope
Atomic vertical slices only. `satisfies` names the behavior(s) from understanding the feature serves; an empty `satisfies` is an orphan (drop or surface). `depends_on` lists only non-obvious feature deps (other ids); use `—` when none.

| id | title | priority | status | tier | depends_on | satisfies |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| <feature-slug> | <one-line user outcome> | P0 | planned | mvp | — | <behavior-name> |

<!-- priority: P0 | P1 | P2   ·   status: planned | building | qa-approved | shipped | deprecated | removed | blocked | cut
     tier: inherits the project tier unless the feature uplifts it (payments, PII, SLA, …)
     lifecycle: planned → building (/to-issues) → qa-approved (/qa) → shipped (/ship) → deprecated → removed (/sunset —
     the ONLY writer of deprecated and removed; deprecated/removed rows are retired, never listed as live) -->

## Deferred
| id | revisit | reason |
| :-- | :-- | :-- |
| <feature-slug> | YYYY-MM-DD | <carried from discovery's deferred> |

## Never
Hard non-goals, verbatim from discovery's `non_goals`.
- <feature-slug> — <reason>

## Priority key
- P0 — MVP-critical; the JTBD/success_metric fails without it. Aim ≤4.
- P1 — high value; the MVP can ship short-term without it. Builds on P0.
- P2 — nice-to-have; in scope but cuttable.
- Deferred — out of v0.1; revisit on the listed date.
- Never — hard non-goal; never in scope.

## Trace status
- status: complete | tentative | partial
- orphans: []                 # or: [{ feature: <slug>, missing_behavior: <desc for /understand> }]
- beyond_discovery: []         # features added past discovery's scope: [{ feature: <slug>, reason: <…> }]

## Notes
- owner: <single named human accountable for the roster>
- next: scan this file → highest-priority `planned` row → `/prd <feature>`
```

Human mirror: `.human/summaries/features.md` — prose roster + **one** validated feature-map diagram (priority-grouped flowchart with dependency edges) via the mermaid skill. Diagrams never go in `.ai/`.

**Update mode** (`/feature-map` re-run when this file exists): touch only the rows the user names; preserve every other row, its `status`, and its `prd` link. Re-number `features:`/priority order only if priorities shifted.

---

## `.ai/anchor.md` — project foundation (written by /anchor)

The locked stack + tier every downstream skill reads first (highest fan-out artifact in the chain). **Intake predicts the tier; anchor locks it** — `project_tier` is read by `/architect`, `/prd`, `/design`, `/bootstrap`. The body carries a one-line `why:` per decision; no diagrams.

**Two `stage`-like fields, kept distinct:**
- `stage: anchor` — the producer marker (every artifact carries one; never changes).
- `lifecycle_stage` — the prototype→mvp→production position. **Invariant: `lifecycle_stage == project_tier` at all times.** Seeded by `/anchor`; advanced ONLY by `/promote` (gated). Never hand-bump it, and an `/anchor` re-run never bumps it. Downstream skills read `project_tier`; `lifecycle_stage` carries the lifecycle history + promotion gate.

**`*_tentative` flags:** any field picked from `defaults.md` because the user said "I don't know" gets `<field>_tentative: yes` in frontmatter, a `(tentative)` note on its `why:` line, and a TODO entry — three paths to the same fact. Required-but-tentative fields do NOT block: the verdict stays `READY-FOR-ARCHITECT` with the tentatives listed.

```markdown
---
slug: <slug>
stage: anchor                                   # producer marker (schema convention)
status: draft | complete
project_type: greenfield | brownfield
project_tier: prototype | mvp | production      # LOCKED here — downstream reads THIS
lifecycle_stage: prototype | mvp | production   # mirrors project_tier; advanced ONLY by /promote
ai_in_core_path: true | false
uplift_signals: []            # carried verbatim from intake (+ any surfaced in conversation)
                              #   any of: money, pii, sla, external-dependants, regulatory
approved_dependencies: []     # mvp+ — package names only here; the why lives in the body
tentative_fields: []          # field names picked from defaults on "I don't know"
verdict: READY-FOR-ARCHITECT | BLOCKED-ON-DISCOVERY
verdict_overridden: false
source_intake: .ai/intake.md
source_features: .ai/features.md
human_summary: .human/summaries/anchor.md
consumed_by: [promote, architect, prd, design, bootstrap, pipeline, ship, diagnose]
created: YYYY-MM-DD
# tentative example (one per "I don't know"):
auth_tentative: yes
---

# Anchor — <slug>

> Tier: `<tier>` · Locked YYYY-MM-DD · Read this before every session.

## Lifecycle
- current: restates `lifecycle_stage` — the frontmatter is the single source of truth; this line never diverges from it. `<tier>`, since YYYY-MM-DD.
- advance with `/promote` only; never hand-edit the tier, and an `/anchor` re-run never bumps it.
- stage_history:                # oldest first; ONE entry shape for every row
  - { from: none, to: <tier>, date: YYYY-MM-DD, by: /anchor, rationale: initial stage set by /anchor, overridden: false }
  # /promote appends each transition in the SAME shape:
  #   { from: <prev>, to: <next>, date: YYYY-MM-DD, by: <human approver>, rationale: <why>, overridden: <true|false> }
- promotion_criteria:           # optional — /promote's gate checklist; empty = use /promote default
    to_mvp: []
    to_production: []

## Stack
Required at all tiers; `why:` is one line. Mark "I don't know" picks `(tentative)`.
- language: <v>            # why: <one line>
- framework: <v>           # why: ...
- hosting: <v>             # why: ...
- db: <v>                  # [mvp+]  why: ...
- auth: <v>                # [mvp+]  why: ...
- deployment_target: <v>           # [mvp+]
- nfr_ceiling_latency_p95_ms: <n>  # [mvp+]  the latency that'd be embarrassing if exceeded

## AI                       # section present only if ai_in_core_path: true
- provider: <v> · model: <v>                       # [proto+]
- cost_ceiling_per_request_usd: <n>                # [mvp+]
- drafter: <prov/model> · classifier: <prov/model> # [prod]
- judge: <prov/model>                              # [prod] — MUST differ from drafter
- eval_framework: <v> · trials_per_eval_run: <n> · transparency_policy: <short string>  # [prod]

## Approved dependencies    # [mvp+] — read by /design to bias toward reuse over hallucinated deps
- name: <pkg>   why: <what it's for + when vetted>   # ecosystem inferred from `language`
                                                     # direct deps only; transitive are inherited

## Release policy           # repo-level release rules — read by /ship and /diagnose
- versioning: semver | calver | none     # [proto: defaults `none`, silent]  why: <one line>
- tag_pattern: v{version}                # only when versioning != none; follows the versioning answer
- branching: trunk | git-flow | github-flow   # [proto: detected/`trunk`, silent]  brownfield: proposed from repo branches + .mtdd/config
- hotfix_path: "<expedited P0 route>"    # [mvp+] default: branch from the production ref; fix via /diagnose
                                         #   with a regression test; /mtdd-review + /mtdd-verify still
                                         #   mandatory; merge + deploy; backfill the chain artifacts
                                         #   (issue file + qa-report note) within a day

## Security gate            # [prod]
- auth_on_entry: <yes + how> · permissions_model: <e.g. jit-scoped>
- red_zone_gates: [db-migrations, permission-changes, dependency-adds]
- codebase_legibility_rules: { no_bare_catchalls: yes, no_dynamic_imports: yes, single_data_interface: yes, unique_greppable_names: yes }

## Observability            # [prod]
- logs: <v> · metrics: <v> · tracing: <v | none-yet>

## Uplift look-ahead
- signals: [...]            # from intake; what /architect should pre-size for. Empty = none fired.

## TODO (tentative fields)
- [ ] <field> — picked default `<x>`; confirm before <bumping tier / production>.
```

**Tier dial.** prototype ≈ 5 fields (language/framework/hosting + tier/type) → mvp ≈ 13 (adds db, auth, deployment_target, nfr ceiling, approved_dependencies) → production = full set (adds observability, security_gate, codebase_legibility_rules). Hard line caps: **40 / 100 / 200**. Over cap means the tier is being asked for more than it supports — cut non-required fields or bump the tier (via `/promote`, not by hand). The AI block is present only when LLMs are in the core path. Full field-by-tier matrix in `anchor/references/tier-matrix.md`.

Human mirror: `.human/summaries/anchor.md` — one-sentence "here's the stack we locked," 3–6 plain bullets (stack + why, what's tentative, the lifecycle line), an OPTIONAL simple stack/context diagram via the mermaid skill (anchor rarely needs one), and a link back. Diagrams never go in `.ai/`.

**Update mode** (`/anchor` re-run when this file exists): re-elicit only the fields the user names; preserve everything else, including `lifecycle_stage`/`project_tier` (only `/promote` moves those) and `stage_history`. Append an `anchor re-run` entry to the tracker naming which fields changed.

---

## `.ai/architecture[.md|/]` — high-level design (written by /architect)

The one-time HLD between `/anchor` and the per-feature `/prd` loop. **Structure only — no diagrams, no narrative prose.** The C4 diagrams + walkthrough are a `.human/summaries/architecture[.md|/]` mirror, rendered FROM the dependency-edge table here via the mermaid skill. Tier-shaped output: prototype = single `.ai/architecture.md`; mvp/production = the `.ai/architecture/` bundle (`index.md` is the index file; ADRs in `adr/NNNN-*.md`). Full output shapes, line caps, and the `.ai`/`.human` split table live in `architect/references/tier-matrix.md`.

Frontmatter index (inline at prototype; in `index.md` for the bundle):

```yaml
---
slug: <slug>
stage: architecture
status: draft | complete
project_tier: prototype | mvp | production    # inherited from anchor (LOCKED) — never re-asked
style: <style name>                            # e.g. modular-monolith
components: [<verb-noun>, <verb-noun>]          # all component names
edges: <N>                                      # count of dependency edges
adr_count: <N>
verdict: READY-FOR-BOOTSTRAP | READY-FOR-PRD | NEEDS-STRATEGIC-DESIGN | BLOCKED-ON-ANCHOR | BLOCKED-ON-DISCOVERY
                                               # success verdict branches on anchor.project_type:
                                               #   greenfield -> READY-FOR-BOOTSTRAP -> /bootstrap
                                               #   brownfield -> READY-FOR-PRD       -> /prd
verdict_overridden: false
sources: [.ai/anchor.md, .ai/discovery/<slug>.md, .ai/understanding/<slug>.md, .ai/features.md]
human_summary: .human/summaries/architecture.md
consumed_by: [prd, design]
created: YYYY-MM-DD
---
```

Structured body shapes (no prose paragraphs, no Mermaid):

- **Style + 3 determinations** — `01-style.md` (bundle) or a `## Style` section (prototype): the style name + a table of the three determinations (monolith vs distributed / where data lives / sync vs async) with a one-line why each; production adds a scoring table against the top-3 characteristics.
- **Characteristics** — `characteristics.yaml`: `top_3:` list, each `{ name, why, measurement (with a number), fitness_fn }`; production adds `considered_but_cut:`. mvp is the light form (top-3 + one fitness fn each, no cut register); prototype omits it. (Kept as `.yaml` rather than a numbered `00-characteristics.md` deliberately — the body is pure structured data with no prose or markdown sections, so a plain YAML file parses without fence-stripping; the `01/02/03` numbering applies only to the markdown bundle files.)
- **Components** — `02-components.md` (bundle) or a `## Components` table (prototype): one row per component `{ name (verb-noun), role (single present-tense sentence, no `and`/`also`), maps_to_feature[] }`, the **dependency-edge table** `{ from, to, kind: sync|async, via }` (this is the structure the `.human` C4 renders), a feature-trace table, and an `## Invariants` list carried from `/understand`.
- **ADRs** — `adr/NNNN-<kebab-title>.md`, Nygard 7-section, "We will…" voice. NNNN from a counter **shared with `/ddd-strategy`** — scan `adr/` for the highest before allocating. Counts: prototype 0–1 (inline) · mvp 3–5 · production 3–7.
- **Risk storming** — `03-risk-storming.md` (production only): a 1–9 impact×likelihood register, unknown-tech auto-9, a mitigation/acceptance per ≥6 risk.

Human mirror: `.human/summaries/architecture.md` (prototype/mvp) or `.human/summaries/architecture/` folder with `context.md`/`container.md`/`component.md` (production) — the C4 diagrams (Context/Container/Component, solid=sync, dotted=async) generated via the mermaid skill + a plain-English walkthrough. **Diagrams live in `.human/` only.**

**Update mode** (`/architect` re-run when the artifact exists): restate the existing style/component/ADR counts, re-elicit only the artifacts the user names, preserve every other file and the untouched `.human` mirror sections.

---

## `.ai/architecture/api-governance.md` — cross-feature API conventions (written by /architect)

The **mvp+, conditional** one-page conventions contract for the project's API surface — written into the `.ai/architecture/` bundle only when a component is **API-bearing** (exposes HTTP/RPC endpoints; no API-bearing components → the page is skipped and noted in `index.md`). It pins the dialect every per-feature `/design` API contract must conform to, so two agents designing two features don't produce two API dialects. **Structure only — no diagrams, no `.human` mirror** (a machine contract; design's mirrors carry the human view). Tier-scaled: ~40 lines mvp · ~60 production (production adds the deprecation rule). Brownfield: each convention is the dominant one detected in the code, cited `file:line` — never an invented conflicting one. A per-feature deviation is allowed only via a per-feature ADR in `.ai/specs/<feature>/adr/`.

```yaml
---
slug: <project-slug>
stage: api-governance
status: draft | complete
project_tier: mvp | production              # INHERITED from anchor.md — page exists at mvp+ only
api_bearing_components: [<verb-noun>, ...]  # from 02-components.md dependency edges
error_envelope: "<one-line canonical shape, e.g. { error, message, trace_id }>"
pagination: cursor | offset | none
auth_scheme: "<header + scheme, e.g. Authorization: Bearer JWT>"
versioning: url | header | none
origin: proposed | detected                  # detected = brownfield, conventions cited file:line
sources: [.ai/anchor.md, .ai/architecture/02-components.md, .ai/recon.md]   # recon brownfield only
consumed_by: [design, coherence-check]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Error envelope` (the one canonical error JSON shape + status-code usage rules — when 400 vs 409 vs 422) · `## Pagination` (the one convention + parameter names) · `## Auth` (header/scheme + where enforced) · `## Naming` (path casing, resource plurality, query-param casing) · `## Versioning` (URL vs header; `[Pr]` + the deprecation rule) · `## References` (brownfield: the `file:line` citations per detected convention).

- **One dialect, project-wide** — every `/design` API-contract table fills its error/auth/versioning rows from this page; a deliberate deviation needs a per-feature ADR, and silently diverging is rejected at design read-back.
- **Brownfield detects, never invents** — propose the dominant existing convention (cite `file:line`); a genuine convention split in the code is surfaced as an open question, not silently standardized.
- **Update mode** (`/architect` re-run): re-elicit only the conventions the user names; preserve the rest.

---

## `.ai/architecture/strategic-design.md` — DDD strategic design (written by /ddd-strategy)

The **optional, conditional** DDD pre-phase artifact — written *before* `/architect` only for a DDD-shaped multi-context domain (`/architect` or `/event-storm` emits `NEEDS-STRATEGIC-DESIGN`). Holds the **strategic** layer: subdomain classification (core/supporting/generic), bounded-context list, ubiquitous-language seams, and the **integration matrix** (the pattern + direction for every context pair). Lands in the `.ai/architecture/` bundle so `/architect` consumes it verbatim and its components respect the boundaries. **Structure only — no diagrams** (the context map is the `.human/summaries/strategic-design.md` mirror, a Mermaid `flowchart` rendered FROM the integration matrix). Tier-agnostic in shape (which contexts exist is the same question at any tier); in practice only `mvp`+ invokes it. Hard cap **200 lines**. ADRs use the **counter shared with `/architect`** (`.ai/architecture/adr/NNNN-*.md`). Full skeleton in `ddd-strategy/references/template.md`.

```yaml
---
slug: <project-slug>
stage: strategic-design
status: draft | complete
subdomain_count: <N>
context_count: <N>
integration_edge_count: <N>
verdict: READY-FOR-ARCHITECT | NEEDS-EVENT-STORM | BLOCKED-ON-UNDERSTANDING
verdict_overridden: false
contexts: [<ContextName>, ...]
source_understanding: .ai/understanding/<slug>.md
source_domain_model: .ai/architecture/domain-model.md   # or: none
context_file: .ai/context.md
human_summary: .human/summaries/strategic-design.md
adr_refs: [NNNN, ...]
consumed_by: [event-storm, architect]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Business context` · `## Subdomains` (table: subdomain · type · reasoning · team) · `## Bounded contexts` (per-context block: subdomain, responsibility, local_language, suggested logic/arch pattern — advisory) · `## Ubiquitous-language seams` · `## Integration matrix` (upstream→downstream · pattern · rationale · ACL?) · `## Strategic decisions` (ADR links) · `## Open questions` · `## References`.

- **Per-context `local_language` refines `.ai/context.md`, never replaces it** — a contradiction with the root glossary is an open question, not a silent override.
- **Carries a `.human/summaries/strategic-design.md` mirror** — the context-map diagram cannot live in `.ai/`.
- **Update mode** (`/ddd-strategy` re-run): refresh only the named sections; preserve the rest of the integration matrix and `adr_refs`.

---

## `.ai/architecture/domain-model.md` — DDD tactical model (written by /event-storm)

The **optional, conditional** tactical-modeling artifact — written when `/understand` or `/comprehend` emits `NEEDS-EVENT-STORM` for an event-heavy domain. Holds the **tactical** layer: aggregates (consistency boundaries), time-ordered past-tense **domain events**, commands, policies (event→command), read models, and the bounded-context relationships of any cross-boundary policy. Sits next to `strategic-design.md` in the `.ai/architecture/` bundle; `/architect` consumes it verbatim and `/feature-map` turns each event into a downstream EARS `When` clause. **Structure only — no diagrams** (the event-flow picture is the `.human/summaries/domain-model.md` mirror). Hard cap **200 lines**; multi-context projects keep each context as a `##` section in the one file. Full skeleton in `event-storm/references/template.md`.

```yaml
---
slug: <project-or-context-slug>
stage: domain-model
status: draft | complete
origin: greenfield | brownfield          # from understanding.md source field; branches the verdict
aggregate_count: <N>
event_count: <N>
hot_spot_count: <N>
verdict: READY-FOR-FEATURE-MAP | READY-FOR-ARCHITECT | NEEDS-STRATEGIC-DESIGN | NEEDS-MORE-MODELING | BLOCKED-ON-UNDERSTANDING | BLOCKED-ON-CONTEXT
verdict_overridden: false
source_understanding: .ai/understanding/<slug>.md
source_strategic: .ai/architecture/strategic-design.md   # or: none
context_file: .ai/context.md
human_summary: .human/summaries/domain-model.md
consumed_by: [ddd-strategy, architect, feature-map]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Aggregates` (per-aggregate: identity, invariants, commands, events_emitted) · `## Domain events (time-ordered)` (past-tense; 1:1 with EARS `When` clauses) · `## Commands` (table: command · actor · aggregate · pre-conditions) · `## Policies (event → command)` · `## Read models` · `## Bounded-context relationships` (cross-boundary policies only) · `## Hot spots / open questions`.

- **`origin`** is read from `understanding.md` (`source_discovery` = greenfield → `READY-FOR-FEATURE-MAP`; `source_recon` = brownfield → `READY-FOR-ARCHITECT`) and is the only thing that branches the success verdict.
- **Events are past-tense facts; commands are imperative.** Aggregates are transactional-consistency boundaries.
- **Updates `.ai/context.md` inline** with new ubiquitous-language terms (owned by `/understand`; this skill only appends).
- **Carries a `.human/summaries/domain-model.md` mirror** — the event-flow diagram cannot live in `.ai/`.

---

## `.ai/architecture/threat-model.md` — STRIDE-lite threat model (written by /threat-model)

The **conditional** security register over the locked architecture — written after `/architect`, gated to production tier OR an uplift signal (`pii`, `money`, `regulatory`, `external-dependants`); below the gate → `SKIPPED-TIER` (a user may insist on `mode: lite`). Derives trust boundaries from the dependency-edge table + entry points, names the assets worth attacking, and registers every credible threat scored 1–9 (impact × likelihood — the **same scale as `03-risk-storming.md`**, cross-referenced by `R-NN`) with a mitigation status. Unmitigated high scores become **routed candidates**: draft invariants for `/architect`, draft Unwanted-EARS clauses for `/prd` — drafted and routed, never adopted here. Refreshed at `/promote` and after architecture changes. **Structure only — no diagrams** (the boundary/data-flow diagram is the `.human/summaries/threat-model.md` mirror, via the mermaid skill). Caps: full ≤250 · lite ≤90. Full skeleton in `threat-model/references/template.md`.

```yaml
---
slug: <project-slug>
stage: threat-model
status: draft | complete
tier: prototype | mvp | production       # INHERITED from anchor.project_tier — never recomputed
mode: full | lite                         # lite = user insisted past SKIPPED-TIER
boundary_count: <N>
asset_count: <N>
threat_count: <N>
open_count: <N>                           # threats with status: open
accepted_count: <N>                       # threats with status: accepted
routed_invariants: <N>                    # RC entries of kind: invariant
routed_unwanted: <N>                      # RC entries of kind: unwanted-ears
scored_against:                           # staleness snapshot — diff vs architecture on every run
  components: [<verb-noun>, <verb-noun>]
  edges: ["<from> -> <to>", "<from> -> <to>"]
verdict: THREAT-MODEL-LOCKED | THREAT-MODEL-LOCKED-WITH-OPEN-THREATS | SKIPPED-TIER | NEEDS-ARCHITECTURE-UPDATE | BLOCKED-ON-ARCHITECT | BLOCKED-ON-ANCHOR
verdict_overridden: false
sources: [.ai/architecture, .ai/anchor.md, .ai/environments.md, .ai/context.md, .ai/understanding/<slug>.md, .ai/features.md]
human_summary: .human/summaries/threat-model.md
consumed_by: [prd, architect, qa, promote]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Body (fixed order): `## Trust boundaries` (table: `B-N` · boundary · crosses process|network|org · entry points · inside/outside) · `## Assets` (asset · lives in · why attacked) · `## Threat register` (one `### T-N · <STRIDE letter> · B-N · <title>` block each: actor · scenario · impact × likelihood → score 1–9 · status `open` | `mitigated-by: <named control>` | `accepted — <reason>` · ≤1 `cross-ref: R-NN`) · `## Routed candidates` (one `### RC-N · invariant|unwanted-ears · from T-N · → /architect | /prd <feature> · status` block each, the candidate rule as a quote) · `## Out of scope` · `## Verdict`.

- **T-N ids are stable across refreshes** — never renumber; a threat eliminated by an architecture change keeps its id with a `retired:` note, and `accepted` entries (with the recorded reason) survive every refresh.
- **`scored_against` is the staleness snapshot** — each run diffs it against the live component/edge names; a `/qa` or `/promote` read that finds a mismatch means the model is stale (`NEEDS-ARCHITECTURE-UPDATE` / refresh), never silently trusted.
- **Routes, never adopts** — an RC flips to `status: adopted` only when the target artifact verifiably contains the rule (the invariant in `02-components.md § Invariants`, the U-clause in the feature's `prd.md`).

**Carries a `.human/summaries/threat-model.md` mirror.** **Refresh** (`/threat-model` re-run): preserve T-N ids and accepted entries; re-derive boundaries from the current edge table; update `scored_against` + `updated`.

---

## `.ai/test-strategy.md` — project test contract (written by /test-strategy)

The **once-per-project** testing HOW — written after `/architect` (needs its components + characteristics), before the per-feature loop (greenfield alongside `/bootstrap`; brownfield after `/explore`, where conventions are **recovered from the repo and confirmed with `file:line` citations**, never invented). Closes two chain gaps: every red-first MTDD slice obtains test data **one canonical way** (per-entity acquisition table over `.ai/context.md`'s entities), and understanding's journeys map to a **cross-feature E2E suite** that features extend rather than duplicate. Fixture/E2E/load libraries are governed against `anchor.approved_dependencies` (`dep_adds[]` flagged; anchor owns the list). **Structure only — no diagrams.** Tier-scaled: prototype may skip (`SKIPPED-PROTOTYPE`; a requested minimal version ≤90) → mvp full minus perf (≤185) → production full (≤250). Carries a `.human/summaries/test-strategy.md` mirror at **mvp+ only** (3–6 bullets + ONE validated diagram — test pyramid or journey→suite map). Full skeleton in `test-strategy/references/template.md`.

```yaml
---
slug: <project-slug>
stage: test-strategy
status: draft | complete
tier: prototype | mvp | production         # INHERITED from anchor.project_tier — never recomputed
project_type: greenfield | brownfield
test_framework: <name + major version>
fixture_style: factory | fixture | hybrid
fixture_library: <pkg | built-in | none>
e2e_tool: <pkg | none>                      # mvp+
dep_adds: []                                # flagged for anchor.approved_dependencies (anchor owns the list)
recovered_from_repo: false                  # true when brownfield conventions were confirmed from code
entity_count: <N>                           # rows in the canonical-acquisition table
e2e_journey_count: <N>                      # rows in the E2E journey table (mvp+)
verdict: TEST-STRATEGY-LOCKED | SKIPPED-PROTOTYPE | BLOCKED-ON-ARCHITECT | BLOCKED-ON-ANCHOR
verdict_overridden: false
source_anchor: .ai/anchor.md
source_architecture: .ai/architecture.md    # or .ai/architecture/index.md
source_understanding: .ai/understanding/<slug>.md   # or: none (E2E table becomes a TODO stub)
source_recon: .ai/recon.md                  # brownfield, or: none
context_file: .ai/context.md
human_summary: .human/summaries/test-strategy.md    # present ONLY at mvp+
consumed_by: [design, plan, to-issues, mtdd-implement, qa, bootstrap, pipeline]
created: YYYY-MM-DD
---
```

Body (fixed order; fill only what the tier requires): `## Test pyramid` (table: level · belongs · naming · location) · `## Fixture & factory strategy` (+ `### Canonical entity acquisition` table: entity · acquire via · location · overrides — one row per `context.md` entity) · `## Seed data` `[M+]` (script · canonical dataset · migration-sync mechanism) · `## Test database & services` `[M+]` (isolation: transaction|truncation|container · db acquisition · real-vs-faked per level) · `## Brownfield data rule` `[brownfield]` (**mandatory** when `pii`/`regulatory` in `anchor.uplift_signals`; explicit `n/a` otherwise) · `## E2E journey suite` `[M+]` (table: journey · spec file · owning feature(s), + the extension rule verbatim) · `## Performance tests` `[Pr]` (location · tool · which characteristic/NFR each exercises) · `## Notes` · `## Verdict`.

- **One canonical way to obtain an entity** — two ways to make a User is how suites rot; an entity missing from `context.md` is a recorded gap, never an improvisation.
- **The E2E table is append-only across features** — a feature's tracer-bullet slice *extends* the mapped spec (`/plan` puts it in the tracer's acceptance; `/qa`'s regression runs the mapped specs); spec-file names are preserved on update (features already extend them).
- **Verdict branches on `anchor.project_type`:** greenfield → `TEST-STRATEGY-LOCKED → /bootstrap`; brownfield → `TEST-STRATEGY-LOCKED → /prd`.

**Update mode** (`/test-strategy` re-run when the file exists): refresh only the named sections; preserve existing E2E spec-file names (a rename is recorded old→new with a migration note), confirmed brownfield citations, and adopted `dep_adds[]`.

---

## `.ai/recon.md` — whole-repo reconnaissance (written by /explore)

The **brownfield-only, once-per-project** facts-only map of an existing codebase. An `Explore` sub-agent scans the whole repo; the artifact records what already exists — with a `path:line` citation on every claim — across five fixed sections, plus a `## Handoff` block routing each section to its consumer. **Facts, never recommendations** (a decision is `/architect` or `/design`); **structure over prose, no diagrams.** Tier-scaled line cap: prototype (≤150) → mvp (≤300) → production (≤450). **No `.human` mirror** — a facts-for-the-next-skill machine artifact; the read-back is the checkpoint. Greenfield projects skip the skill entirely (nothing to scan).

```yaml
---
slug: <project-slug>
stage: recon
status: draft | complete | blocked
tier: prototype | mvp | production         # INHERITED from anchor.md — never recomputed
project_type: brownfield
verdict: READY-FOR-COMPREHEND | READY-FOR-ARCHITECT | SKIPPED-GREENFIELD | BLOCKED-ON-ANCHOR
verdict_overridden: false
citation_count: <N>
component_count: <N>                         # Section B, 3–10
glossary_candidate_count: <N>                # Section C, 10–25
scanned_by: explore-subagent
source_anchor: .ai/anchor.md
consumed_by: [comprehend, architect]
created: YYYY-MM-DD
---
```

Fixed section order (fill only what the tier requires; full skeleton in `explore/references/template.md`): Status · Meta · Section A repo shape · Section B component decomposition (style signals `[M+]`) · Section C domain language + invariants (`[M+]` for invariants — feeds `/comprehend`) · Section D decisions already made `[M+]` (feeds `/architect`) · Section E gaps + warnings · Handoff · Notes · Verdict.

- **Facts only** — every claim carries a `path:line`; uncited claims are dropped; vague stack-level claims (that's `anchor`) rejected. A "we should…" becomes a visible fact in Section E, not an opinion.
- **The `## Handoff` block is the contract:** Sections A+B+D → `/architect`; Section C → `/comprehend`; Section E → `/comprehend` grilling questions.
- **Tier inherited** from `anchor.md`; over the line cap → prune lowest-signal items per section, never drop a section.

**No diagrams, no `.human` mirror. Brownfield only.** **Update mode** (`/explore` re-run when the file exists): re-scan only the sections the user names; preserve the rest.

---

## `.ai/environments.md` — environment spec + config inventory (written by /environments)

The **project-level** record of which environments exist, every config/env var's name + where it is SET, the secrets policy, config conventions, the feature-flag system, and the IaC location. Written after `/bootstrap` (greenfield — the skeleton defines the first env) or after `/explore` (brownfield — RECOVERY mode: detected from `.env.example`/CI/IaC/compose/config modules with a `file:line` citation per claim, confirmed with the user, never invented). Re-run in **update mode** whenever a slice adds config — the expected steady state. **CRITICAL: records variable NAMES and storage locations only — NEVER values**; a pasted secret value is refused (+ rotation recommended). Read by `/design` (conventions for new vars), `/to-issues` (secret-flagged vars + prod-only paths → HITL), `/ship` (per-env deploy + smoke commands). Tier-capped 90/185/250; optional at prototype (`SKIPPED-PROTOTYPE`). Carries a `.human/summaries/environments.md` mirror at **mvp+** (one validated promotion-flow diagram via the mermaid skill).

```yaml
---
slug: <project-slug>
stage: environments
status: draft | complete
tier: prototype | mvp | production         # INHERITED from anchor.project_tier — never recomputed
project_type: greenfield | brownfield
verdict: ENVIRONMENTS-LOCKED | SKIPPED-PROTOTYPE | BLOCKED-ON-ANCHOR | BLOCKED-ON-BOOTSTRAP
verdict_overridden: false
environments: [dev, staging, prod]          # the real roster, whatever it is
env_count: <N>
config_var_count: <N>
secret_count: <N>                            # inventory rows with secret: yes
secrets_store: <store name(s)>
flag_system: none | <system>
iac_path: none | <path>
source_anchor: .ai/anchor.md
source_bootstrap: .ai/bootstrap.md           # greenfield; or: none
source_recon: .ai/recon.md                   # brownfield; or: none
human_summary: .human/summaries/environments.md   # present ONLY when written (mvp+)
consumed_by: [design, to-issues, pipeline, ship]
created: YYYY-MM-DD
---
```

Body (fixed order; full skeleton in `environments/references/template.md`): `## Environment roster` (table: env · purpose · url_host · deploy_mechanism [command or CI trigger] · smoke_command [prod at mvp+, per env at production]) · `## Config inventory` (table: name · purpose · type · secret · required_in · set_in — **where the value lives per env, never the value**) · `## Secrets policy` (store per env · never_in_repo · rotation `[Pr]` · on_pasted_secret) · `## Config conventions` `[M+]` (naming pattern · where new config goes in code · validation-at-boot expectation) · `## Feature flags` (if any — system, naming, lifecycle; ties to `/ship`'s flag-exposure note) · `## IaC` `[Pr]` (path + apply mechanism) · `## Open questions` · `## Notes` · `## Verdict`.

- **Names + storage locations, never values** — the one rule with no tier exceptions; a value found committed in the repo is an Open-question finding (rotate + gitignore), never copied.
- **Brownfield = detected, never invented** — every proposed row cites `file:line` (scan checklist in `environments/references/brownfield-scan.md`); unfindable facts become direct questions, then Open questions.
- **Decide-vs-inherit:** hosting/`deployment_target` are anchor's lock (inherited); this artifact enumerates the envs and config on top of them. It never provisions, deploys, or writes config code.

**Update mode** (`/environments` re-run when the file exists): change only the rows/sections the user names; preserve every other row; recompute frontmatter counts; regenerate the `.human` mirror from the updated `.ai` file.

---

## `.ai/pipeline.md` — delivery contract (written by /pipeline)

The **project-level** delivery contract: the tier-gated quality-gate matrix (gate · trigger · tool/suite · blocking), the deploy-vs-release stance per environment, branch protection, the rollback mechanism, supply-chain controls, dependency-update automation, monitoring-as-code location (production), and the **gap table** comparing the contract against the CI that actually exists. **Contract only — never workflow files**: `/bootstrap` scaffolds CI once on greenfield; every later pipeline change is an ordinary slice (conventions.md § CI/CD changes are ordinary slices) that traces to this artifact. Written after `/environments` on greenfield, or after `/test-strategy` at the end of the brownfield on-ramp in RECOVERY mode (gates/deploy wiring **detected from workflow + config files with a `file:line` citation per claim, confirmed with the human, never invented**; scan checklist in `pipeline/references/brownfield-scan.md` — reuse `/environments` RECOVERY's citations rather than re-scanning the same files). Mandatory-for-tier controls come from `pipeline/references/gate-matrix.md` (grounded in the OSPS Baseline levels, Scorecard, SLSA, DORA); a missing mandatory control is a gap row — `open | waived (on the record) | routed` — never silently dropped. Tools named but absent from the repo/`anchor.approved_dependencies` are Context7-grounded and flagged in `dep_adds[]`. Read by `/design` (pipeline-touching slices trace here), `/qa` (which gates ran mechanically), `/ship` (deploy trigger + rollback mechanism), `/promote` (the to-production gate cites the gap table). Tier-capped 90/185/250; optional at prototype (`SKIPPED-PROTOTYPE` — secrets-out-of-VCS + committed lockfile stay non-negotiable). Carries a `.human/summaries/pipeline.md` mirror at **mvp+** (one validated merge→gates→deploy→release flowchart via the mermaid skill). Re-run in **update mode** after `/promote`, after `/to-fitness` lands, or when an environment or suite is added.

```yaml
---
slug: <project-slug>
stage: pipeline
status: draft | complete
tier: prototype | mvp | production         # INHERITED from anchor.project_tier — never recomputed
project_type: greenfield | brownfield
verdict: PIPELINE-LOCKED | SKIPPED-PROTOTYPE | BLOCKED-ON-ANCHOR | BLOCKED-ON-ENVIRONMENTS | BLOCKED-ON-BOOTSTRAP
verdict_overridden: false
ci_provider: github-actions | gitlab-ci | jenkins | circleci | azure | bitbucket | cloud-build | buildkite | none
gate_count: <N>
open_gaps: <N>                              # gap rows with status: open
waived_gaps: <N>
routed_gaps: <N>
dep_update_tool: none | <tool>
deploy_strategy: <e.g. trunk-flag-gated | promotion | manual>
monitoring_as_code: none | <path>           # [Pr]
dep_adds: []                                # tools not in anchor.approved_dependencies — flagged, never silently added
source_anchor: .ai/anchor.md
source_environments: .ai/environments.md    # or: none (prototype)
source_test_strategy: .ai/test-strategy.md  # or: none
source_recon: .ai/recon.md                  # brownfield; or: none
human_summary: .human/summaries/pipeline.md # present ONLY when written (mvp+)
consumed_by: [design, qa, ship, promote]
created: YYYY-MM-DD
---
```

Body (fixed order; full skeleton in `pipeline/references/template.md`): `## Quality gates` (table: gate · trigger [`pre-merge | post-merge | release | scheduled`] · tool/suite [cites `.ai/test-strategy.md` / `fitness/` — never an invented suite] · source · blocking) · `## Deploy & release` (per env: trigger → pipeline → smoke → rollback mechanism; deploy≠release flag note; branch protection) · `## Supply chain` (secrets scanning [all tiers] · pinning · dependency audit [`[M]` advisory → `[Pr]` blocking + suppression path] · SBOM `[Pr]` · provenance `[Pr]`) · `## Dependency updates` `[M+]` (tool · cadence · automerge policy) · `## Monitoring as code` `[Pr]` (path + apply step) · `## Gap table` (contract requirement · detected [`file:line` or `missing`] · status · route) · `## Open questions` · `## Notes` · `## Verdict`.

- **Decide-vs-inherit:** hosting, `deployment_target`, and `release_policy` (branching/versioning/hotfix) are anchor's locks; the env roster + smoke commands are environments'; the suites are test-strategy's. This artifact DECIDES only what runs where, what blocks, and what's missing.
- **The gap table routes, never fixes** — closing a gap is a slice through the normal loop (or a `/bootstrap` checklist extension before slice 1 on greenfield).
- **Brownfield = detected, never invented** — every gate/deploy row cites `file:line`; org-level facts (branch protection, provider-native scanning) are asked, then Open questions.

**Update mode** (`/pipeline` re-run when the file exists): change only the rows/sections the user names; preserve confirmed citations and waiver records; recompute frontmatter counts; regenerate the `.human` mirror.

---

## `.ai/data-management.md` — project data policy (written by /data-management)

The **project-level, skip-if-no-datastore** data policy — how schema changes happen, ship a down, and get reviewed, and (at production) how data is backed up, retained, and deleted. Written after `/architect` on greenfield (before `/bootstrap` scaffolds the migration dir); brownfield RECOVERY mode after `/explore` — the existing migration tool, directory, naming pattern, seed scripts, and backup wiring are **detected with `file:line` citations and confirmed with the human, never invented**. **Policy only — never writes or runs a migration** (that is build-phase work). Migration tooling is governed against `anchor.approved_dependencies` (`dep_adds[]` flagged; anchor owns the list). **Structure only — no diagrams.** Tier-scaled: prototype may skip (`SKIPPED-PROTOTYPE`; an insisted minimal version ≤90) → mvp (≤185) → production full (≤250). Carries a `.human/summaries/data-management.md` mirror at **production only** (one validated migration-lifecycle flowchart via the mermaid skill). Full skeleton in `data-management/references/template.md`.

```yaml
---
slug: <project-slug>
stage: data-management
status: draft | complete
tier: prototype | mvp | production         # INHERITED from anchor.project_tier — never recomputed
project_type: greenfield | brownfield
verdict: DATA-MANAGEMENT-LOCKED | SKIPPED-NO-DATASTORE | SKIPPED-PROTOTYPE | BLOCKED-ON-ARCHITECT | BLOCKED-ON-ANCHOR
verdict_overridden: false
db: <from anchor, e.g. postgres>            # INHERITED — /anchor owns the choice
migration_tool: <e.g. "prisma migrate" | "alembic" | "golang-migrate">
migrations_dir: <path, e.g. prisma/migrations/>
naming: <pattern, e.g. "YYYYMMDDHHMMSS_verb_noun">
reversibility: down-required | argued-irreversible-allowed
ordering: timestamps | sequential-ids
retention_entity_count: <N>                 # [Pr] rows in the retention table; 0 below production
backup_last_tested: YYYY-MM-DD | never | n-a   # [Pr]
production_seeds: none | <path>
dep_adds: []                                # migration tooling not in anchor.approved_dependencies — flagged, never silently added
source_anchor: .ai/anchor.md
source_architecture: .ai/architecture.md     # or .ai/architecture/index.md (bundle)
source_recon: .ai/recon.md                   # brownfield; or: none
source_test_strategy: .ai/test-strategy.md   # or: none
source_context: .ai/context.md               # or: none
human_summary: .human/summaries/data-management.md   # present ONLY when written (production)
consumed_by: [design, to-issues, pipeline, ship]
created: YYYY-MM-DD
---
```

Body (fixed order; full skeleton + retention-table authoring rules in `data-management/references/template.md`): `## Migration policy` (tool · directory · naming + example · reversibility rule · schema-vs-data split · ordering + merge-conflict policy · review rule) · `## Seed data` `[M+]` (dev/test seeds = ONE-line pointer to `.ai/test-strategy.md § Seed data`; production seeds owned here) · `## Backup & restore` `[Pr]` (what · frequency · where [location, never credentials] · restore procedure · last_tested — `never` is an Open question, not silence) · `## Retention & PII lifecycle` `[Pr]` (table: entity · retention · deletion_mechanism · legal_basis_note — **mandatory** when `pii`/`regulatory` in `anchor.uplift_signals`) · `## Zero-downtime rule` `[Pr]` (expand → migrate → contract; never a destructive change in one step) · `## Open questions` · `## Notes` · `## Verdict`.

- **Every schema migration ships a down** — or carries an argued `IRREVERSIBLE` flag in the file header AND a line in `## Migration policy`. Consumers enforce it: `/design`'s schema deltas follow the naming + down discipline verbatim, `/to-issues`' DB-migration HITL gate implements the review rule, `/ship`'s reversible-migrations checklist item reads this artifact.
- **Retention rows are recorded decisions, never legal interpretation** — the skill proposes common practice as a draft; `legal_basis_note` carries the user's decision plus the standing "confirm with legal counsel" flag.
- **Seeds aren't duplicated** — dev/test seeds live in `.ai/test-strategy.md`; this artifact points there and owns production seeds only.

**Update mode** (`/data-management` re-run): change only the rows/sections the user names; preserve confirmed brownfield citations and adopted `dep_adds[]`; regenerate the mirror (production).

---

## `.ai/health-report.md` — codebase health register (written by /health-audit)

The **brownfield-only** findings register + go/no-go gate. `/health-audit` fans out read-only lens sub-agents, adversarially verifies the P0/P1 findings, and consolidates the survivors here — one section per lens that ran, each finding a stable `H-NNN` block with `path:line` evidence, severity, fix, and (if published) a tracker ref. **Unlike most `.ai` artifacts it carries a `.human` mirror** (`.human/summaries/health-audit.md`) because the gate is a human-approved decision. Tier-capped 150/300/450. Greenfield projects skip the skill (nothing to audit).

```yaml
---
slug: <project-slug>
stage: health-audit
status: draft | complete
tier: prototype | mvp | production         # INHERITED from anchor.md
project_type: brownfield
gate: SAFE-TO-PROCEED | FIX-CRITICAL-FIRST | ARCHITECTURE-BLOCKS-FEATURE | AUDIT-COMPLETE
gated_feature: <feature-slug | general>     # the feature the gate judged, or "general"
verdict_overridden: false
backend: beads | jira | md | none           # where findings were published (none = report-only)
lenses_run: [critical, security, ...]
finding_counts: { P0: <n>, P1: <n>, P2: <n>, P3: <n> }
source_recon: .ai/recon.md                  # framed the architecture lens (warn-if-missing)
source_anchor: .ai/anchor.md
human_summary: .human/summaries/health-audit.md
consumed_by: [triage, diagnose, to-issues]
created: YYYY-MM-DD
---
```

Body (fixed order; full skeleton + the per-finding block in `health-audit/SKILL.md` Phase 4): `## Summary` (counts + top risks + the gate line) · one `## <Lens>` section per lens that ran, each with `### H-NNN · <title> · <severity> · <category> · <tracker-ref>` blocks (Impact · Evidence `path:line` · Fix · Status/needs-confirmation).

- **Verified only** — every P0/P1 passed the adversarial verify wave before landing here; every finding cites `path:line`.
- **Findings, not fixes** — the register routes work to `/diagnose` or a `category: bug` slice; it never edits source.
- **Dedupe** by `path:line` (one finding at the higher severity, secondary lens cross-referenced).

**Carries a `.human/summaries/health-audit.md` mirror.** **Update mode** (`/health-audit` re-run): re-grade and re-publish; preserve the `H-NNN` IDs of findings still present.

---

## `.ai/design-system.md` — project design system (written by /ux-spec, project scope)

The **once-per-project** UX/UI convention lock — the UI counterpart of `anchor.md`. Written after `/architect` (parallel to `/bootstrap`); read by `/ux-spec` feature scope, `/design` (UI surfaces), `/bootstrap` (theme/token alignment), and `/qa`. Holds the navigation model, layout grid, component inventory (domain-language names + when to use + states each must support), design tokens (**role names, not pixel values** unless user-supplied), project-wide interaction-state conventions (loading/empty/error/disabled defaults), copy/tone rules `[M+]`, and the accessibility baseline (production = **WCAG AA explicit**). **Structure only — no diagrams** (the navigation map is the `.human/summaries/design-system.md` mirror, a Mermaid `flowchart` rendered FROM `## Navigation model` `top_level` via the mermaid skill — always written). Tier-scaled line caps 90/185/250; tier from `anchor.project_tier` (fallback: intake `predicted_tier`).

```yaml
---
slug: <project-slug>
stage: design-system
status: draft | complete
tier: prototype | mvp | production         # anchor.project_tier (fallback: intake predicted_tier)
verdict: DESIGN-SYSTEM-LOCKED | BLOCKED-ON-ARCHITECT
verdict_overridden: false
navigation_model: <tab-bar | sidebar | top-nav | single-page | wizard | ...>
component_count: <N>
token_groups: [color, type, spacing]
a11y_baseline: defaults | basics | wcag-aa  # production = wcag-aa
source_architecture: .ai/architecture       # or .ai/architecture.md
source_anchor: .ai/anchor.md
source_understanding: .ai/understanding/<slug>.md
context_file: .ai/context.md
human_summary: .human/summaries/design-system.md
consumed_by: [ux-spec, design, bootstrap, qa]
created: YYYY-MM-DD
---
```

Body (fixed order; full skeleton in `ux-spec/references/template.md`): `## Navigation model` (model + `top_level` areas + entry screen) · `## Layout grid` · `## Component inventory` (table: component · use when · states it must support) · `## Design tokens` (color roles always; type scale + spacing `[M+]`) · `## Interaction-state conventions` (the four project-wide defaults) · `## Copy & tone` `[M+]` (+ error formula `[Pr]`) · `## Accessibility baseline` (tier-scaled; `[Pr]` = WCAG AA, commitments listed) · `## Notes` · `## Verdict`.

- **Tokens are names, not pixels** — values recorded only when the user supplied them; defaults marked `(tentative)` (anchor convention).
- **The inventory is owned here** — feature `ux.md` files flag `new_components[]`; a project-scope update run adopts them. Never grown from feature scope.
- Success verdict routes by `anchor.project_type`: greenfield → `/bootstrap`, brownfield → `/prd`.

**Carries a `.human/summaries/design-system.md` mirror (always).** **Update mode** (`/ux-spec` re-run when the file exists): refresh only the sections the user names; preserve the rest; regenerate the mirror.

---

## The `.ai/specs/<feature>/` per-feature folder (Batch C convention)

Everything in the per-feature loop nests under **`.ai/specs/<feature>/`** — one folder per feature, the `<feature>` slug minted by `/feature-map` (kebab-case, ≤30 chars; reused unchanged by every per-feature skill). The folder accumulates the per-feature artifacts in chain order:

```
.ai/specs/<feature>/
├── prd.md         per-feature WHAT (written by /prd)            consumed_by: [design, plan, to-fitness]
├── research.md    optional spike (written by /research)
├── design.md      per-feature HOW  (written by /design)         consumed_by: [plan, to-fitness, qa]
└── plan.md        implementation slices (written by /plan)
```

Human mirrors for this tree go to **`.human/specs/<feature>/<artifact>.md`** (per [conventions.md § Human summaries](conventions.md) — the "review OR diagram" test, derived from the `.ai` file, never hand-authored). Which per-feature skills write a mirror follows that test, not a blanket rule: **prd** mirrors at mvp+ only (the prototype PRD is a one-pager read directly); **design** always mirrors (its sequence diagram cannot live in `.ai/`); **plan** never (a mechanical slice list — the read-back is the gate).

Every per-feature artifact carries the effective **`tier`** = `max(project_tier, feature_uplift)`. Downstream feature-scoped skills read THIS field, never `project_tier` directly, so an uplifted feature in a lower-tier project gets the rigor it needs.

## `.ai/specs/<feature>/prd.md` — per-feature PRD (written by /prd)

The contract `/design`, `/plan`, and `/to-fitness` consume. Implementation-agnostic: references `anchor.md` (stack) and `architecture` (components/invariants/characteristics); decides neither. **Structure over prose, no diagrams.** Tier-scaled: prototype one-pager (≤90 ln) → mvp (≤185) → production EARS contract (≤250). At **mvp+** a derived `.human/specs/<feature>/prd.md` mirror is also written (scope + success + risks + verdict + optional journey diagram via the mermaid skill); at prototype, no mirror.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: prd
status: draft | complete | blocked
tier: prototype | mvp | production         # effective = max(project_tier, feature_uplift) — ONE field
uplifted_from: <project_tier>              # omit when no uplift fired (don't pair with a near-identical actual_tier)
verdict: READY-FOR-DESIGN | NEEDS-MORE-CLARITY | BLOCKED-ON-ARCHITECTURE | BLOCKED-ON-DISCOVERY | BLOCKED-ON-ANCHOR
verdict_overridden: false
placement: <component from architecture 02-components.md, proposed>   # finalized by /design
satisfies: <behavior-name from understanding>
beyond_roster: false                       # true if <feature> is not a row in features.md (surfaced, not invented)
nfr_count: <N>                             # mvp+
ai_card: false                             # true if the feature ships AI to end users
sources: [.ai/anchor.md, .ai/architecture, .ai/discovery/<slug>.md, .ai/understanding/<slug>.md, .ai/features.md]
human_summary: .human/specs/<feature>/prd.md   # present ONLY when written (mvp+)
consumed_by: [design, plan, to-fitness]
created: YYYY-MM-DD
---
```

Fixed section order (fill only what the tier requires; full skeleton in `prd/references/template.md`): Status · Problem · Target user · Job to be Done · Scope (in/out) · Success metric · Kill criteria · User stories `[M+]` · Risks/Assumptions `[M+]` · NFRs (light `[M]` / full `[Pr]`) · Functional requirements (prose `[M]` / EARS + T/I/A/D `[Pr]`) · AI transparency card (if `ai_card`) · Open questions `[M+]` · Notes (placement, invariants honored, tech-leakage deferred) · Verdict.

- **Functional reqs** are prose at mvp, **EARS** at production (one behavior per clause; templates in `prd/references/ears.md`, cross-linked by `/design` + `/to-fitness`). **Production:** every in-scope architecture invariant is defended by ≥1 EARS Unwanted-behavior clause.
- **NFRs** are always number + threshold + measurement — never adjectives.
- **Success metric** always fills its `source` row (query / log / event — how the number will actually be obtained). An app-emitted source must be implementable: `/design`'s observability hooks name the emitting step, and `/measure` reads it as the feature's `measurement_source` after ship.
- **Tier** is computed (`max(project_tier, feature_uplift)`), never asked; uplift list is define-once in `anchor/references/defaults.md`.
- **Architecture** is required at mvp+ (`BLOCKED-ON-ARCHITECTURE` if missing) and warn-only at prototype.

**Update mode** (`/prd` re-run when the file exists): rewrite only the sections the user names; preserve the rest; regenerate the `.human` mirror from the updated `.ai` file.

---

## `.ai/specs/<feature>/ux.md` — per-feature UX spec (written by /ux-spec, feature scope)

The **UI-bearing-features-only** UX/UI contract between `/prd` (the WHAT) and `/design` (the HOW) — the artifact that stops an implementing agent from inventing the interface. Screens derive from the PRD's user stories (a story with no screen is backend work; a screen with no story bounces to `/prd`). **Decide-vs-inherit:** INHERITS the effective `tier` from `prd.md` (never recomputed) and the inventory/tokens/state conventions from `design-system.md`; DECIDES screens, the four interaction states per screen, user flows incl. unhappy paths, component usage, verbatim validation/error copy, a11y notes. **Never decides implementation** — no file paths, no framework component code (that is `/design`). **Structure only — no diagrams** (the user-flow diagram is the `.human/specs/<feature>/ux.md` mirror, written at **mvp+ only**; prototype has no mirror). Tier-scaled: prototype = `## Screens` + states only (≤90, design-system not required) → mvp full (≤185, design-system required-or-WARN) → production full + explicit WCAG AA + copy rules (≤250). Non-UI surfaces (`backend-service`, `data-pipeline`, `cli-lib`, `infra`) → `SKIPPED-NO-UI`, **no file written**.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: ux
status: draft | complete | blocked
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: READY-FOR-DESIGN | BLOCKED-ON-PRD  # SKIPPED-NO-UI writes no file
verdict_overridden: false
surface: web-ui | mobile | composite | ai-llm
screen_count: <N>
flow_count: <N>                             # 0 at prototype
uses_components: [<Name>, ...]              # from the design-system inventory
new_components: [<Name>, ...]               # NOT in the inventory — flagged for design-system adoption
source_prd: .ai/specs/<feature>/prd.md
source_design_system: .ai/design-system.md  # or: none (prototype, or mvp+ WARN recorded in Notes)
source_understanding: .ai/understanding/<slug>.md
context_file: .ai/context.md
human_summary: .human/specs/<feature>/ux.md # present ONLY when written (mvp+)
consumed_by: [design, qa]
created: YYYY-MM-DD
---
```

Body (fixed order; per-screen block + full skeleton in `ux-spec/references/template.md`): `## Screens` (per screen: purpose · traces_to story/F-ID · key_elements · data_shown (context.md entity terms verbatim) · `states:` loading/empty/error/disabled (all four, or an argued n/a) · validation copy verbatim) · `## User flows` `[M+]` (entry → numbered steps → exit; unhappy paths mandatory, each landing on a specified screen + state + copy) · `## Component usage` `[M+]` (screen → inventory components; new flagged) · `## Accessibility notes` (`[M]` light / `[Pr]` WCAG AA explicit per screen) · `## Notes` · `## Verdict`.

- **Four states, every screen** — checklist in `ux-spec/references/state-matrix.md`; `/qa`'s human acceptance script walks them.
- **Copy is verbatim, quoted strings** — entity terms from `.ai/context.md`; project copy rules govern at production.
- **`/design`'s file layout must cover every screen** listed here (warn-if-missing input for UI surfaces).

**`.human` mirror at mvp+ only** (ONE validated user-flow `flowchart`, happy solid / unhappy dotted, via the mermaid skill). **Update mode** (`/ux-spec <feature>` re-run): refresh only the screens/flows the user names; preserve the rest; regenerate the mirror.

---

## `.ai/specs/<feature>/design.md` — per-feature LLD (written by /design)

The implementation contract `/plan`, `/to-fitness`, and `/qa` consume. Pairs 1:1 with `prd.md`. **Decide-vs-inherit:** design INHERITS the stack from `anchor.md`, the components/style/ADRs/invariants from `architecture`, and the effective **`tier` from `prd.md`** (never recomputed); it DECIDES the per-feature HOW (modules, file layout, schema deltas, API contracts, call flow, test plan, per-feature ADRs, governed libraries). Every design traces to a component in `02-components.md` — **orphan features are refused** (`NEEDS-ARCHITECTURE-UPDATE`). **Structure over prose, no diagrams** — API contracts + schemas as tables/YAML; the call flow is a step list (the diagram is the `.human` render). Tier-scaled: prototype (≤90) → mvp (≤185) → production (≤250). **`/design` ALWAYS writes a derived `.human/specs/<feature>/design.md` mirror** (plain-English walkthrough + a `sequenceDiagram` rendered from the call-flow step list via the mermaid skill) — it is the one Batch-C skill that mirrors at every tier, because the sequence diagram cannot live in `.ai/`.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: design
status: draft | complete | blocked
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: READY-FOR-PLAN | NEEDS-PROTOTYPE | NEEDS-RESEARCH | NEEDS-ARCHITECTURE-UPDATE | BLOCKED-ON-PRD | BLOCKED-ON-ANCHOR
verdict_overridden: false
maps_to_component: <component from architecture 02-components.md>   # finalizes prd's proposed placement
surface: backend-service | web-ui | mobile | ai-llm | data-pipeline | cli-lib | infra | composite
dep_adds: []                               # new vetted packages, flagged for anchor.approved_dependencies (anchor owns the list)
adr_count: <N>                             # per-feature ADRs in .ai/specs/<feature>/adr/
human_summary: .human/specs/<feature>/design.md    # ALWAYS present — design always mirrors
sources: [.ai/specs/<feature>/prd.md, .ai/architecture, .ai/anchor.md, .ai/understanding/<slug>.md]
consumed_by: [plan, to-fitness, qa]
created: YYYY-MM-DD
---
```

Fixed section order (fill only what the tier requires; full skeleton in `design/references/template.md`): Status · Architectural placement (`maps_to_component` + invariants honored) · Surface · Module decomposition · File/folder layout · External dependencies · Call-flow step list · Schema deltas `[M+]` · API contracts `[M+]` · Failure modes & resilience `[M+]` · Observability hooks `[M+]` · Characteristics check `[Pr]` · Test plan `[M+]` · Per-feature ADRs `[M+]` · Non-obvious dependencies `[Pr]` · Notes · Verdict.

- **Tier** is inherited from `prd.md`, never recomputed — design does not re-scan uplift signals. Tier disputes go upstream (`/prd` re-run or `/promote`).
- **Placement** is the orphan gate: every design's `maps_to_component` is a real component in `02-components.md`; no fit → `NEEDS-ARCHITECTURE-UPDATE → /architect` (don't invent a component).
- **Dependencies** are governed at all tiers — bias toward `anchor.approved_dependencies`; a new lib is trust-judged (exists/maintained/adopted/provenance), recorded, and flagged in `dep_adds[]` for anchor to adopt (full bar in `design/references/deps-governance.md`).
- **API contracts** carry every 4xx/5xx error shape + idempotency (state-changing, mvp+) + versioning (prod); **schema deltas** always carry a rollback. Production functional reqs trace to the PRD's EARS clauses (`prd/references/ears.md`).
- **Observability hooks** (`[M+]`) cover the PRD success metric whenever its `source` is app-emitted — the event/metric is named with its emitting call-flow step; a metric nothing emits is a design gap, not `/measure`'s problem.
- **AI rigor** does not drop between `/prd` and build: an `ai_in_core_path` feature (or a PRD with an AI transparency card) must carry the prompt/eval/model design and honor every AI-card field (`design/references/surfaces.md`).
- **Characteristics check** (production) blocks the write if any `Characteristics honored:` claim from PRD Notes has no supporting design element.

Human mirror: `.human/specs/<feature>/design.md` — plain-English walkthrough + one validated `sequenceDiagram` rendered FROM the call-flow step list via the mermaid skill. Written at **every tier**. Never hand-authored; `.ai` wins on disagreement.

**Update mode** (`/design` re-run when the file exists): cross-check the existing `maps_to_component` against the PRD's current `placement` hint (surface drift if they differ); rewrite only the sections the user names; preserve the rest; regenerate the `.human` mirror from the updated `.ai` file.

---

## `.ai/specs/<feature>/plan.md` — per-feature build plan (written by /plan)

The build contract `/plan` produces from `design.md` + `prd.md` — the design decomposed into **vertical, dependency-ordered, independently-mergeable slices**, each slice one PR. **Slice 1 is always a tracer bullet** (thinnest end-to-end path, every layer wired for real). **Decide-vs-inherit:** plan INHERITS the effective `tier` from `prd.md` (never recomputes), the file paths from `design.md` (verbatim, never re-derives), and the `New dependencies` from `design.md § External dependencies` + `dep_adds[]` (propagation, never re-judges or invents). It DECIDES the slice boundaries, ordering, and per-slice mechanical acceptance. **Structure over prose, no diagrams.** Tier-scaled: prototype (≤90) → mvp (≤185) → production (≤250); slice counts 1–2 / 3–5 / 4–8. **`/plan` is the one per-feature artifact that NEVER writes a `.human` mirror** — a plan is a mechanical slice list the agent executes; the read-back is the human checkpoint, so there is no `human_summary`.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: plan
status: draft | complete | blocked
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: READY-FOR-BUILD | NEEDS-RESLICE | BLOCKED-ON-DESIGN | BLOCKED-ON-PRD | BLOCKED-ON-ANCHOR
verdict_overridden: false
slice_count: <N>
tracer_slice: 1                            # Slice 1 is always the tracer bullet
source_design: .ai/specs/<feature>/design.md
source_prd: .ai/specs/<feature>/prd.md
source_anchor: .ai/anchor.md
consumed_by: [build, to-issues, qa]
created: YYYY-MM-DD
---
```

Fixed section order (fill only what the tier requires; full skeleton in `plan/references/template.md`): per-slice blocks `Slice 1..N` — each with **Depends on** · **Goal** · **Files** (verbatim from design's layout, `new`/`modify`) · **Signatures** `[Pr]` · **Satisfies** (F-IDs `[Pr]` / user stories `[M]` + ≥1 NFR `[M+]`) · **New dependencies** (verbatim from design, or `none`) · **Acceptance** (tests `[P+]` + NFR target `[M+]` + named fitness function `[Pr]`) · the `Slice N (removed)` convention · **Invariant defense** table `[Pr]` · **Notes** · **Verdict**.

- **Slices are vertical**, not layered — each cuts through every layer the feature crosses with working end-to-end behavior. Horizontal slices (a DB-only slice, an API-only slice) are refused.
- **Acceptance is mechanical** — named tests + (mvp+) NFR target with measurement + (production) a real `fitness/<feature>/…` path written by `/to-fitness` (never an invented path; if `/to-fitness` hasn't run, name the rule and flag it). A dep-introducing slice adds a registry-resolve + audit-clean line.
- **Trace is mandatory** — each slice satisfies ≥1 PRD F-ID (production EARS) / user story (mvp); an orphan slice is dropped or bounced to `/prd`.
- **Invariant defense** (production) — every PRD Unwanted-behavior EARS clause maps to an implementing slice; an empty row blocks the write.

**No diagrams, no `.human` mirror.** **Update mode** (`/plan` re-run when the file exists): preserve slice numbering (dropped → `Slice N (removed)`); rewrite only the slices the user names; preserve the rest and their `Status`.

---

## `.ai/specs/<feature>/research.md` — per-feature reconnaissance (written by /research)

The **optional, brownfield-only** facts-only scout `/design` and `/plan` read. An `Explore`
sub-agent scans the existing code touching a feature; the artifact records what already exists
— with a `path:line` citation on every claim — and the **Open questions for design** `/design`
must close. **Facts, never recommendations** (a decision is `/design`); **structure over prose,
no diagrams.** Tier-scaled: prototype (≤90) → mvp (≤185) → production (≤250). **No `.human`
mirror** — a facts-for-the-next-skill machine artifact; the read-back is the checkpoint.
Greenfield projects skip the skill entirely (nothing to scan).

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: research
status: draft | complete | blocked
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: READY-FOR-DESIGN | RESCOPE-NEEDED | BLOCKED-ON-PRD | BLOCKED-ON-ANCHOR
verdict_overridden: false
citation_count: <N>
open_question_count: <N>                    # ≤5
scanned_by: explore-subagent
source_prd: .ai/specs/<feature>/prd.md
source_anchor: .ai/anchor.md
consumed_by: [design, plan]
created: YYYY-MM-DD
---
```

Fixed section order (fill only what the tier requires; full skeleton in `research/references/template.md`): Status · Existing tooling · Comparable patterns · Conventions `[M+]` · Constraints `[M+]` · Library choices considered (NOT decided) `[M+]` · Prior art · Open questions for design · Notes · Verdict.

- **Facts only** — every claim carries a `path:line`; uncited claims are dropped; vague stack-level claims (that's `anchor`) rejected. A "we should…" is a `/design` decision, not research.
- **Open questions** are answerable *how* unknowns (≤5) `/design` must close; a wrong PRD assumption is `RESCOPE-NEEDED → /prd`, not an open question.
- **Tier inherited** from `prd.md`; over the line cap → the scan was too broad, re-scope to the feature.

**No diagrams, no `.human` mirror. Optional + brownfield-only.** **Update mode** (`/research` re-run when the file exists): re-scan only the sections the user names; preserve the rest.

---

## `.ai/specs/<feature>/issues/SLICE-N.md` — canonical issue file (written by /to-issues)

The **tracker-agnostic** per-slice work contract — one file per `plan.md` slice. `/to-issues` writes these (disk only, no tracker side effects); `/publish-issues` fans them out to **beads** (the machine build-loop backend), **Jira**, or **markdown** (human projections); the four `mtdd-*` skills and `/qa` read them. **`/to-issues` is a faithful transformer** — every field mirrors `plan.md`/`prd.md`; it invents nothing. **Structure over prose, no diagrams, no `.human` mirror** (the *human* view of issues is the Jira/md projection the publisher writes). Per-file line cap **80 (60 prototype)** — over → the slice is too big, bounce to `/plan`.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
slice: <N>
stage: issue
status: open | published | removed          # removed = dropped from plan; file kept (tracker refs may exist)
title: <one-line slice title>
category: enhancement | bug                  # bug only for a defect-fix slice (e.g. from /diagnose)
type: afk | hitl                             # advisory in Phase 1 (human runs all slices via the manual mtdd loop)
priority: P0 | P1 | P2 | P3                  # chain-set; default P2, sharpened in /plan when a slice warrants it
tier: prototype | mvp | production           # INHERITED from prd.md — never recomputed
tests: required | skip-tests
language: <typescript | python | ...>        # default = anchor.language; override only on a cross-language slice
depends_on: [<N>, ...]                        # slice numbers; stable across update mode
satisfies_f_ids: [<F-id>, ...]               # production
satisfies_user_stories: [<US-id>, ...]       # mvp
satisfies_nfrs: [<NFR-id>, ...]              # mvp+
satisfies_unwanted: [<U-id>, ...]            # production — defense slices
files: [{ path: <path>, op: new | modify }]   # mirror plan.md verbatim — the positive file boundary
signatures: [<typed signature>, ...]          # production only
hitl_reason: <one sentence>                   # required when type: hitl — name the firing AFK rule
skip_tests_reason: <one sentence>             # required when tests: skip-tests
backend_refs: { beads: null, jira: null, md: null }   # written by /publish-issues; PRESERVED on /to-issues update
source_plan: .ai/specs/<feature>/plan.md
source_prd: .ai/specs/<feature>/prd.md
consumed_by: [publish-issues, mtdd-implement, mtdd-review, mtdd-verify, mtdd-merge, qa]
created: YYYY-MM-DD
---
```

Body (fixed order): `## What to build` (vertical-slice prose, glossary from `.ai/context.md`, no inline file paths) · `## Acceptance criteria` (checkbox list, verbatim from `plan.md`) · `## Traceability` (PRD F-IDs/NFRs quoted, plan slice, architecture component) · `## Blocked by` (slice numbers, or "None").

- **`type: afk|hitl`** — `/to-issues` computes the real classification (forward-looking for the Phase-2 `ralph-loop-afk` runner), but Phase-1 execution is HITL for every slice (the human runs the manual `mtdd` loop). The four `mtdd-*` skills read this file (or the bead/md copy minted from it) — `mtdd-implement`'s primary input is a **bead ID** (`bd show`).
- **Immutable source.** Runtime status (`## Status log` / `## Completion`) is written by the build loop to the **bead** (`bd note`) or the materialized markdown copy — **never back into this `.ai` file**.
- **`backend_refs`** is null at write; `/publish-issues` populates it and `/to-issues` **preserves it** on update.

**Update mode** (`/to-issues` re-run on an updated plan): update files in place; **never renumber**; a slice dropped from the plan → `status: removed` + a one-line trailer (keep the file). `features.md` status flip `planned → building` is the only side effect outside the issues folder.

---

## `.ai/specs/<feature>/as-built.md` — feature code map (written by /as-built)

The **post-build, per-feature** reverse-engineered map of what the code *actually is* at HEAD — written after a feature's slices merge (origin-agnostic: greenfield, or a brownfield feature built through the loop). **Structured, no diagrams** (same discipline as `design.md`: the step list / tables live here; the Mermaid lives in the `.human` mirror). Read-only on everything else; commit-pinned; idempotent (overwritten each run). Scope is the **union of `files:` across non-removed `SLICE-*.md`** — never a repo crawl, so an untouched shipped feature (no slices) is out of scope (`/as-built` returns `NOT-LOOP-BUILT → /explore`).

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: as-built
status: complete
commit: <short-sha>
branch: <branch>
basis: HEAD | WIP                           # WIP = mapped before the last slice merged
module_count: <N>
entry_point: <route / command / handler>
drift_count: <N>                            # extra + missing + reordered (0 if no design sequence)
verdict: AS-BUILT-WRITTEN | AS-BUILT-WRITTEN-WITH-DRIFT
source_issues: .ai/specs/<feature>/issues/
source_design: .ai/specs/<feature>/design.md   # or: none
human_summary: .human/specs/<feature>/as-built.md
created: YYYY-MM-DD
---
```

Body (fixed order; full skeleton in `as-built/references/template.md`): `## Module map` (table: module · role · new/modified · imports→) · `## Import edges` (list, project-internal only, sync/async + `path:line`) · `## Main flow — <entry>` (ordered **step list**) · `## Drift vs design` (table or `N/A`) · `## Notes & omissions`.

- **No Mermaid here.** The module block diagram + main-flow flowchart go in `.human/specs/<feature>/as-built.md`, generated via the mermaid skill from this record (solid=sync, dotted=async).
- **As-built ≠ as-designed** — the drift table is the only place the two meet; `rename` (role→concrete name) is not drift, only `extra`/`missing`/`reordered` count toward `N`.
- **Read-only, commit-pinned, idempotent** — never edits code, `design.md`, slices, or `features.md`; re-running overwrites and re-pins the SHA.

---

## `.ai/specs/<feature>/qa-report.md` — feature-boundary QA evidence (written by /qa)

The **feature-boundary quality gate's** durable evidence record — written after every slice is built and closed, the destination of `/build`'s `READY-FOR-QA`. `/qa` runs a tier-aware evidence pass (slice closure, coverage matrix, regression, spec-drift, NFR/architecture/fitness/Unwanted, security review + accessibility at production), records each check PASS/FAIL/WARN/SKIP with citations here, and the human signs off. **Carries a `.human/specs/<feature>/qa-report.md` mirror** holding the human-run acceptance + exploratory script (the gate is a human decision). No diagrams. Read-only on specs; the only write outside this file is the `features.md` `building → qa-approved` flip on approval. Idempotent — regenerated each run; the approval block is append-only (most-recent first).

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: qa
status: draft | complete
tier: prototype | mvp | production         # effective tier INHERITED from prd.md — never recomputed
verdict: READY-FOR-SHIP | AWAITING-APPROVAL | EVIDENCE-INCOMPLETE | SPEC-DRIFT | REJECTED | BLOCKED-ON-STATUS | BLOCKED-ON-AUTH | BLOCKED-ON-CONFLICT | BLOCKED-ON-FITNESS
check_counts: { pass: <n>, fail: <n>, warn: <n>, skip: <n> }
approved: yes | no | pending
slices_total: <n>
source_prd: .ai/specs/<feature>/prd.md
source_design: .ai/specs/<feature>/design.md
source_plan: .ai/specs/<feature>/plan.md
human_summary: .human/specs/<feature>/qa-report.md
consumed_by: [ship, diagnose]
created: YYYY-MM-DD
---
```

Body (fixed order; method per check in `qa/references/checks.md`): `## Summary` (verdict + counts) · `## Checks` (table: check · status · citation, for the a–k checks the tier ran) · `## Coverage matrix` (F-ID/story/NFR/Unwanted → slice) · `## Items needing human judgment` (WARN/SKIP) · `## Approval` (append-only: Approved · By `git user.name` · At ISO · Reason).

- **Canonical = contract; backend = runtime state** — closure read from bead/jira/md (the same done-detection `/build` uses), criteria *text* from the canonical slice file.
- **FAIL stops approval** (no human gate); WARN/SKIP surface for judgment. **Human approval flips `features.md` at every tier.**
- **`READY-FOR-SHIP → /ship`** on a signed yes; `/ship` reads this report. Deploy + the `qa-approved → shipped` flip are `/ship`, never here.

---

## `.ai/runbooks/<feature>.md` — per-feature incident runbook (written by /runbook)

The **per-feature, pre-incident** operational compilation — written between `/qa` and `/ship` (expected at production; `/ship`'s checklist cites it), read FIRST by `/diagnose` during an incident. **Compiled, never authored**: every alert/symptom row, rollback arm, and link traces to a source already in the specs (design failure modes + alert thresholds, environments' deploy/smoke commands + flag system, data-management's reversibility rule, open threat-model T-Ns, accepted qa-report WARN/SKIPs) or to a recorded user confirmation; an unconfirmable step becomes a loud `## Open questions` entry, never a guess. **Documents, never acts** — it performs no rollback, no deploy, no flag flip. Lives under **`.ai/runbooks/`** (not `.ai/specs/<feature>/`) so `/diagnose` can find it from a symptom. Caps 90/185/250. **The `.human/runbooks/<feature>.md` prose mirror is MANDATORY at every tier the skill runs** — unlike other mirrors it carries the full procedure, because its reader is the 2am incident responder, not a reviewer. Full skeleton (both files) in `runbook/references/template.md`.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: runbook
status: draft | complete
tier: prototype | mvp | production         # INHERITED from prd.md — never recomputed
verdict: RUNBOOK-WRITTEN | SKIPPED-TIER | BLOCKED-ON-DESIGN | BLOCKED-ON-QA
verdict_overridden: false
alert_count: <N>                            # rows in the alert/symptom table
rollback_arms: [deploy, migration, flag]    # which of the three arms apply (flag omitted when flag_system: none)
open_question_count: <N>                    # unconfirmable steps — loud, never silently zero
flag_system: <from environments.md, or none>
escalation_confirmed: true | false          # a real contact/channel was confirmed by the user
sources: [.ai/specs/<feature>/design.md, .ai/specs/<feature>/prd.md, .ai/environments.md, .ai/data-management.md, .ai/architecture/threat-model.md, .ai/specs/<feature>/qa-report.md, .ai/anchor.md]
human_runbook: .human/runbooks/<feature>.md   # MANDATORY — the mirror a human reads mid-incident
consumed_by: [diagnose, ship, qa]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Alert & symptom table` (table: alert/symptom · meaning · first diagnostic steps · mitigation · escalate to/when · source) · `## Rollback procedure` (numbered, three arms: deploy rollback + smoke verify · migration down per `data-management.md` [or its argued irreversible flag quoted + the restore fallback] · flag-off per `environments.md`) · `## Dependencies & integration points` (table: dependency/edge · symptom when it's down · where to check its health) · `## Links` (dashboard · logs · traces · specs — from anchor observability / environments, **never invented**) · `## Open questions` · `## Notes` · `## Verdict`.

- **Compiled-not-authored** — every row's `source` column cites the artifact it came from; a row with no source is dropped or becomes an Open question.
- **Written before incidents** — `/diagnose` consumes its rows as pre-compiled hypotheses + mitigations mid-incident; `/qa` only notes its existence (informational), `/ship` surfaces its rollback procedure instead of a one-line note.
- **The `.human` runbook follows writing-for-stress rules** — short numbered steps, one action + one observable result each, no jargon, gaps marked inline (`⚠ UNKNOWN`), most-likely/most-dangerous first.

**Update mode** (`/runbook <feature>` re-run after the feature changes): recompile against the current specs; preserve recorded user confirmations + the escalation contact; regenerate the `.human` runbook.

---

## `.ai/slo.md` — service-level objectives (written by /runbook --slo)

The **project-scope, production-only** SLO register — `/runbook --slo` interviews and locks per-characteristic SLI/SLO/error-budget/alert-threshold/paging entries, **seeded from `/architect`'s `characteristics.yaml` measurements and PRD NFR ceilings — never invented numbers** — plus the SEV1/2/3 severity ladder. Read by `/runbook` (feature runbooks cite the severities), `/qa`, `/promote` (the to-production gate requires `SLO-LOCKED` or a recorded skip), and `/ship`. Hard cap **150 lines** — a longer register is tracking vanity metrics; keep the objectives that would actually page someone. Carries a `.human/summaries/slo.md` mirror (one validated severity-ladder flowchart via the mermaid skill). Full skeleton + severity-ladder defaults in `runbook/references/slo-template.md`.

```yaml
---
slug: <project-slug>
stage: slo
status: draft | complete
project_tier: production                   # SLOs are production rigor; INHERITED from anchor
verdict: SLO-LOCKED | SKIPPED-TIER | BLOCKED-ON-ARCHITECT
verdict_overridden: false
slo_count: <N>
sev_levels: [SEV1, SEV2, SEV3]
paging_confirmed: true | false             # a real on-call person/channel was confirmed per threshold
sources: [.ai/architecture/characteristics.yaml, .ai/anchor.md, .ai/environments.md]
prd_nfr_sources: [.ai/specs/<feature>/prd.md, ...]   # PRDs whose NFR ceilings seeded a target
human_summary: .human/summaries/slo.md
consumed_by: [runbook, qa, promote, ship]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Objectives` (one block per objective: name · sli [what is measured + where, a real source] · slo [number + window] · error_budget [+ what happens when spent] · alert_threshold [fires BEFORE the breach] · pages [who — name/rotation/channel] · source) · `## Severity ladder` (table: SEV1/2/3 · definition · response expectation) · `## Open questions` · `## Notes` (characteristics not given an SLO + why) · `## Verdict`.

- **Seeds, never defines** — every target's `source` cites a `characteristics.yaml` measurement, a PRD NFR, or an anchor ceiling; a number with no source is an Open question, not an invention.
- **`pages` is a real person/rotation/channel confirmed by the user** (`paging_confirmed`) — an SLO nobody is paged for is a wish, not an objective.

**Update mode** (`/runbook --slo` re-run when a characteristic or ceiling changes): refresh only the named objectives; preserve confirmed paging entries and the agreed severity ladder.

---

## `docs/` + root `README.md` — end-user documentation (written by /docs)

**Generated project files, not `.ai` artifacts** — same category as `/to-fitness`'s `fitness/` output: no schema, no frontmatter index, no `.human` mirror (the pages ARE the human-facing output). `/docs` is a **faithful assembler**: every claim traces to a spec artifact (prd user stories, ux screens, `design.md § API contracts`, bootstrap/environments/test-strategy setup facts, intake/discovery framing) or to a recorded user answer; it never invents capability claims, and a contract gap bounces upstream (`BLOCKED-ON-DESIGN` / `BLOCKED-ON-PRD`).

- **`README.md`** (root) — owned sections (`what-this-is` · `getting-started` · `project-layout` · `running-tests`) regenerated in place between `docs:begin:<id>` / `docs:end:<id>` HTML-comment markers; hand-written content outside markers is never touched (an unmarked README gets a proposed merge, never a rewrite).
- **`docs/<feature>.md`** — end-user feature guide (post-/qa, pre-/ship), voiced for discovery's target user; zero chain jargon in prose.
- **`docs/api.md`** — API reference rendered verbatim-in-substance from design's contract tables; per-feature marker-owned sections (`api-<feature-slug>`).

Every generated region ends with an HTML-comment source footer (`sources:` artifact paths + `user-confirmed:` dated answers) — the only place chain internals may appear. Tier: prototype = README only; mvp = + feature guides when external users exist; production = all three. Marker + footer conventions: `docs/references/templates.md`.

---

## `.ai/specs/<feature>/outcome.md` — post-ship outcome record (written by /measure, feature mode)

The chain's **feedback-loop closer** — written once the PRD metric's timeframe has elapsed after `ship_date`. Records the feature's ACTUAL metric value against the PRD's target — the human supplies the number from where they track it (`measurement_source`); **never estimated, a miss is written as a miss** — and the routed consequence: keep, iterate (`/feature-map` / `/prd` update mode), or remove (`/sunset <feature>`). The `## Measurements` table is an **append-only time series**: re-runs add a row, never overwrite; prune nothing — the time series IS the artifact. **Structure only — no diagrams** (the status picture lives in the shared `.human/summaries/outcomes.md` mirror). Caps: prototype ≤90 · mvp ≤120 · production ≤150. `TOO-EARLY` / `BLOCKED-ON-SHIP` write no file. Full skeleton in `measure/references/templates.md`.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: outcome
status: complete
tier: prototype | mvp | production          # INHERITED from prd.md — never recomputed
verdict: METRIC-MET | METRIC-MISSED | METRIC-PARTIAL | NO-MEASUREMENT-SOURCE
verdict_overridden: false
decision: keep | iterate | remove | fix-metric
routed_to: none | feature-map | prd | discovery | sunset
ship_date: YYYY-MM-DD                        # from tracker `ship landed` entry / git log / human
measured_due: YYYY-MM-DD                     # ship_date + timeframe
measurement_source: <where the number lives — dashboard / query / spreadsheet / manual count>
measurement_count: <N>                       # rows in ## Measurements
source_prd: .ai/specs/<feature>/prd.md
source_discovery: .ai/discovery/<slug>.md    # or: none (warned)
human_summary: .human/summaries/outcomes.md
consumed_by: [measure, next, status]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Metric` (the PRD's success-metric table **verbatim — never edited here**) · `## Measurements` (append-only table: date · actual · source · recorded_by) · `## Verdict` (actual vs target vs baseline, one honest line) · `## Decision` (decision · routed_to · by · reason) · `## Lessons` (≤3 bullets, only if the human offers them).

- **Actuals are verbatim from the human** — an estimate is a guess wearing a number; no number producible → `NO-MEASUREMENT-SOURCE` + `decision: fix-metric`, routed to `/discovery` or `/prd` update mode on the record.
- **The metric is quoted, never re-litigated** — a wrong or unmeasurable metric is fixed upstream, not edited here.
- **A `remove` decision routes to `/sunset <feature>`** — the deprecate phase owns the status flip; `/measure` never touches `features.md`.

**Re-run behavior**: append a Measurements row, update the Verdict/Decision; never overwrite or delete a prior measurement.

---

## `.ai/outcomes.md` — project outcome roster (written by /measure, project mode)

The **project-level reckoning** that settles the bet `/discovery` opened — bare `/measure` summarizes every shipped feature's outcome, collects project-metric actuals, and evaluates every discovery kill criterion honestly (advisory: kill / pivot via `/discovery` re-run / override on the record). The one artifact that keeps accumulating after features are `shipped`. **Structure only — no diagrams** (the status flowchart is the shared `.human/summaries/outcomes.md` mirror, via the mermaid skill). `NOTHING-SHIPPED` / `BLOCKED-ON-DISCOVERY` write no file. Full skeleton in `measure/references/templates.md`.

```yaml
---
slug: <project-slug>
stage: outcomes
status: complete
verdict: ON-TRACK | KILL-CRITERIA-MET
verdict_overridden: false
features_shipped: <N>
features_measured: <N>                       # shipped rows with an outcome.md
kill_criteria_fired: <N>
measurement_source: <project-level source, recorded for the next run>
source_discovery: .ai/discovery/<slug>.md
source_features: .ai/features.md
sources_outcomes: [.ai/specs/<feature>/outcome.md, ...]
human_summary: .human/summaries/outcomes.md
consumed_by: [measure, next, status, discovery]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Body (fixed order): `## Feature outcomes` (table, one row per shipped feature: metric · target · latest actual · verdict · decision · measured) · `## Project metric` (verbatim from discovery — never edited here; + `### Actuals` append-only time series) · `## Kill-criteria evaluation` (table: criterion [verbatim from discovery] · due · actual observed · fired? yes/no/not-yet-evaluable) · `## Decision log` (append-only, most-recent first — same discipline as qa's approval block: Decision · By · At · Reason).

- **Kill-criteria rigor never scales down** — full evaluation at every tier (a prototype's kill criterion is its most valuable line); a fired criterion is `KILL-CRITERIA-MET`, overridable only on the record, and the override quotes the criterion it overrides.
- **Feature rows summarize; `outcome.md` owns** — the table mirrors each feature's latest outcome state; the per-feature time series lives there.

**Re-run behavior**: update feature rows in place, **append** to Actuals and to the Decision log, re-evaluate the kill-criteria table; never delete a prior actual or decision block.

---

## `.ai/specs/<feature>/sunset.md` — feature retirement plan (written by /sunset)

The **post-shipped tail** of the feature lifecycle — `/sunset` extends `features.md` past `shipped` (`shipped → deprecated → removed`), is the **only writer of those two statuses**, and is **human-gated at BOTH flips** (like `/ship`'s one irreversible boundary, twice). Plans the deprecation window, user comms `[M+]`, flag-off (per environments' `flag_system`), and per-entity data handling (citing data-management's retention rows — recorded decisions, legal calls flagged for human review), then **routes the removal as ordinary build work** (a `/prd` update + the normal loop, or `tasks/remove-<feature>.md`) — it never deletes code, flags, or data itself. Blocks on live dependants: any `features.md` row whose `depends_on` names this feature and isn't `removed` → `BLOCKED-ON-DEPENDANTS` (`dependants_at_plan` MUST be empty to proceed; the remove phase re-runs the scan). The destination of `/measure`'s `decision: remove`. **No `.human` mirror** (like `/ship` — the conversation + read-back is the human view). Caps 90/185/250. `NOT-SHIPPED` writes no file. Full skeleton + the dependant check + tier matrix in `sunset/references/templates.md`.

```yaml
---
slug: <project-slug>
feature: <feature-slug>
stage: sunset
status: planned | deprecated | removal-routed | removed   # mirrors the latest verdict
tier: prototype | mvp | production           # INHERITED from prd.md — never recomputed (fallback anchor.project_tier + WARN)
verdict: SUNSET-PLANNED | DEPRECATED | REMOVAL-ROUTED | REMOVED
verdict_overridden: false
deprecation_window: <YYYY-MM-DD or condition>   # prototype: immediate
window_verified: false                        # set true by the remove phase
comms_done: false                             # set true by the remove phase
flag_off: <flag name + system, or none>       # from environments.md flag_system
data_handling: keep | delete | export-then-delete | per-entity | none
removal_route: none-yet | prd-update | tasks/remove-<feature>.md
removal_merged: false                         # set true only on the human's confirmation, with evidence
dependants_at_plan: []                        # MUST be empty to proceed (the dependant-gate result)
source_features: .ai/features.md
source_outcome: .ai/specs/<feature>/outcome.md        # or: none (warned)
source_asbuilt: .ai/specs/<feature>/as-built.md       # or: none (warned)
source_data_management: .ai/data-management.md        # or: none (warned)
source_environments: .ai/environments.md              # or: none (warned)
consumed_by: [sunset, next, status, feature-census]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Why` (quotes `outcome.md` verbatim when it exists, else the human's stated reason) · `## Deprecation window` · `## User communication` `[M+]` (message · channel · sent) · `## Flag-off` (flag · system · who flips · when) · `## Data handling` (per-entity table citing `data-management.md § Retention & PII lifecycle`: entity · retention rule cited · action on removal · when · legal review? — `[Pr]` mandatory) · `## Removal work` (route · file-list source [as-built module map + slice manifests] · acceptance summary) · `## Open questions` · `## Decision log` (append-only, most-recent first — same discipline as qa's approval block).

- **The dependant gate and the two human approvals never scale down** — identical at every tier; a blocking dependant is sunset first or re-pointed via `/feature-map` update mode.
- **Routes, never executes** — `removed` flips only after the human confirms the routed removal work merged (`removal_merged: true`, with the PR/commit evidence in the Decision log).
- **Retired rows stay retired** — `deprecated`/`removed` rows in `features.md` are never re-cataloged as live by census, status, or reporting skills.

**Re-run behavior**: each phase appends to the Decision log and advances `status`/`verdict`; prior entries are never rewritten — the log IS the history.

---

## `.ai/refactors/<target>.md` — deepening proposals + design (written by /improve-codebase-architecture)

The **brownfield, on-demand** record of an architectural-friction session — N-per-project, one per refactor target (`<target>` = kebab, names the friction area, e.g. `order-intake-deepening`). `/improve-codebase-architecture` walks existing code, ranks **deepening candidates** (shallow modules → deep), and — once the user picks one — persists the **designed deepening** (interface, seam, test strategy) so the analysis survives and the session is re-enterable. **Proposal-only**: the skill never writes the refactored code; the actual refactor routes forward as a slice (`/to-issues`) or a free-form task. **No `.human` mirror** (a working/analysis artifact, like `research.md`; an optional seam diagram goes to `.human` only if the user asks). `NO-FRICTION-FOUND` writes no file.

```yaml
---
slug: <project-slug>
target: <refactor-target-slug>
stage: refactor
status: proposed | designing | routed | recorded   # proposed=candidates listed; designing=one chosen; routed=handed forward; recorded=rejected→ADR
tier: prototype | mvp | production         # INHERITED from anchor.md (advisory — a smell is a smell)
source: standalone | diagnose | health-audit | explore
source_ref: <H-NNN | repro id | recon §B | ->      # the triggering finding, or "-"
candidates: <N>
chosen: <C-N | none>
verdict: PROPOSALS-READY | DEEPENING-ROUTED | RECORDED-AS-ADR | NO-FRICTION-FOUND
adr_refs: [NNNN, ...]                       # ADRs written during the design loop (shared counter)
routed_ref: <slice ref | tasks/<slug>.md | ->      # where the refactor went, or "-"
consumed_by: [to-issues]
created: YYYY-MM-DD
---
```

Body (fixed order): `## Summary` (friction landscape in 2–3 lines + the verdict line) · `## Candidates` (one `### C-N · <title>` block each — **Files** · **Problem** · **Solution** (plain English) · **Benefits** (locality/leverage/testability) · **Deletion test** (concentrates / moves) · **ADR conflict** if any) · `## Chosen deepening` (the settled interface, seam placement, dependency category from `deepening.md`, what hides behind the seam — present once `status: designing`) · `## Test strategy` (replace-don't-layer: tests deleted, tests added at the interface — becomes the routed slice's test plan) · `## Decisions` (ADR + `context.md` side-effects, rejections).

- **Architecture vocabulary is load-bearing** — module/interface/depth/seam/adapter/leverage/locality (`improve-codebase-architecture/references/language.md`); domain terms come from `.ai/context.md`.
- **ADRs use the shared counter** (`.ai/architecture/adr/NNNN-*.md`, format in `architect/references/adr.md`); the skill writes `context.md` glossary adds + ADRs, nothing else in `.ai/`.
- **Update mode** (re-run on the same `<target>`): update in place; preserve `adr_refs` and the `routed_ref` once set.

