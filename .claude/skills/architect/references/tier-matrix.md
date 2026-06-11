# Tier matrix — output shape, line caps, the `.ai`/`.human` split

`/architect` inherits `project_tier` from `.ai/anchor.md` (LOCKED — never re-ask). Everything below scales with it.

## What goes where (the crux — memorize this table)

| Content | Home |
| :-- | :-- |
| Style decision + 3 determinations | `.ai` (structured) |
| Architectural characteristics (top-3 -ilities + fitness fns) | `.ai` — YAML |
| Component definitions (verb-noun, role statement, interface) | `.ai` — the source of truth `/prd` + `/design` read |
| **Dependency edges (sync/async)** as table / adjacency list | `.ai` — this is the structure the C4 diagrams render |
| Invariants honored | `.ai` |
| API governance (error envelope, pagination, auth, naming, versioning) | `.ai/architecture/api-governance.md` (mvp+, API-bearing components only) |
| ADRs (Nygard "We will…") | `.ai/architecture/adr/NNNN-*.md` |
| Risk storming register | `.ai` (production) |
| **C4 Context / Container / Component diagrams (Mermaid)** | `.human` via the mermaid skill |
| Plain-English walkthrough | `.human` |

**No Mermaid, no ASCII art, anywhere in `.ai/`.** The `.human` diagrams are rendered FROM the `.ai` dependency table — same knowledge, two registers.

## Output shape per tier

### prototype — single file, ≤100 lines
```
.ai/architecture.md            frontmatter index + Style + Components table (3–5) + dependency edges
                               + invariants + 0–1 inline ADR.   NO diagrams.
.human/summaries/architecture.md   one container-level Mermaid (via mermaid skill) + plain prose.
```

### mvp — bundle, ≤150 lines/file
```
.ai/architecture/
├── index.md            frontmatter index + bundle map + components[] + edges
├── characteristics.yaml LIGHT: top-3 -ilities, one fitness fn each (no risk storming, no cut register)
├── 01-style.md          style + 3 determinations
├── 02-components.md      component defs + DEPENDENCY TABLE (source of truth) + feature trace + invariants
├── api-governance.md     ~40 ln, ONLY if any component is API-bearing (exposes HTTP/RPC): error envelope
│                         + status-code rules, pagination, auth convention, naming rules, versioning scheme
└── adr/NNNN-*.md         3–5 ADRs
.human/summaries/architecture.md   C4 Context + Container (via mermaid skill) + walkthrough.
```

### production — full bundle, ≤200 lines/file
```
.ai/architecture/
├── index.md
├── characteristics.yaml  FULL: 3-criteria test, top-3, fitness fns, considered-but-cut register
├── 01-style.md           + scoring table against top-3 characteristics
├── 02-components.md       + component-level decomposition
├── api-governance.md      ~60 ln (mvp shape + the deprecation rule); same API-bearing condition
├── 03-risk-storming.md    top-3 chars, 1–9 scoring, unknown-tech rule, mitigations
└── adr/NNNN-*.md          3–7 ADRs, cite [Fundamentals chNN]
.human/summaries/architecture/
├── context.md            C4 Context (via mermaid skill)
├── container.md          C4 Container
└── component.md          C4 Component per significant container
```

## Line caps (hard)

| Tier | Cap | Over cap means |
| :-- | :-- | :-- |
| prototype | 100 ln (single file) | bump to mvp, or cut detail |
| mvp | 150 ln / file | cut to essentials, or split |
| production | 200 ln / file | split the file |

## The production 7-phase method (heritage)

Source: Ford & Richards, *Fundamentals of Software Architecture 2e*. Each phase is tier-gated — prototype skips most of it.

1. **Characteristics** — top-3 -ilities via the 3-criteria test `[ch04–07]`. `[Pr]` full · `[M]` light · `[P]` skip.
2. **Style** — the 3 style-defining determinations + scoring `[ch19]`. All tiers.
3. **Components** — verb-noun, role statements, dependency edges `[ch08]`. All tiers.
4. **C4 diagrams** — Context/Container/(Component at Pr) `[ch23]` → rendered into `.human`. `[M][Pr]`.
5. **ADRs** — Nygard significance filter + 7-section `[ch21]`. All tiers.
6. **Risk storming** — 1–9 scoring, unknown-tech rule `[ch22]`. `[Pr]` only.
7. **Materialize** — write `.ai` structure + `.human` mirror per the shapes above.

## index.md frontmatter (mvp/production bundle)

```yaml
---
slug: <slug>
stage: architecture
status: draft | complete
project_tier: prototype | mvp | production
style: <style name>
components: [<verb-noun>, <verb-noun>]
edges: <N>                       # count of dependency edges
adr_count: <N>
verdict: READY-FOR-BOOTSTRAP | READY-FOR-PRD | NEEDS-STRATEGIC-DESIGN | BLOCKED-ON-ANCHOR | BLOCKED-ON-DISCOVERY  # success: greenfield->BOOTSTRAP, brownfield->PRD
verdict_overridden: false
sources: [.ai/anchor.md, .ai/discovery/<slug>.md, .ai/understanding/<slug>.md, .ai/features.md]
human_summary: .human/summaries/architecture.md
consumed_by: [prd, design]
created: YYYY-MM-DD
---
```
(Prototype's single `.ai/architecture.md` carries the same frontmatter inline.)
