# `.ai/test-strategy.md` — per-tier skeleton

Line caps (hard): **prototype ≤90 · mvp ≤185 · production ≤250**. Over cap → cut optional
sections, never the canonical entity-acquisition table. Sections marked `[M+]` appear at
mvp and above; `[Pr]` at production only; `[B]` brownfield only. Fill only what the tier
requires — empty headings are noise, omit them (the brownfield data rule is the one
exception: write an explicit `n/a` so its absence is never ambiguous).

```markdown
---
slug: <project-slug>
stage: test-strategy
status: draft | complete
tier: prototype | mvp | production         # INHERITED from anchor.project_tier — never recomputed
project_type: greenfield | brownfield
test_framework: <name + major version>      # e.g. vitest 3, pytest 8
fixture_style: factory | fixture | hybrid
fixture_library: <pkg | built-in | none>
e2e_tool: <pkg | none>                      # mvp+ — none only at prototype
dep_adds: []                                # new packages flagged for anchor.approved_dependencies
recovered_from_repo: false                  # true when brownfield conventions were confirmed from code
entity_count: <N>                           # rows in the canonical-acquisition table
e2e_journey_count: <N>                      # rows in the E2E journey table (mvp+)
verdict: TEST-STRATEGY-LOCKED | SKIPPED-PROTOTYPE | BLOCKED-ON-ARCHITECT | BLOCKED-ON-ANCHOR
verdict_overridden: false
source_anchor: .ai/anchor.md
source_architecture: .ai/architecture.md    # or .ai/architecture/index.md
source_understanding: .ai/understanding/<slug>.md   # or: none
source_recon: .ai/recon.md                  # brownfield, or: none
context_file: .ai/context.md
human_summary: .human/summaries/test-strategy.md    # present ONLY at mvp+
consumed_by: [design, plan, to-issues, mtdd-implement, qa, bootstrap]
created: YYYY-MM-DD
---

# Test strategy — <slug>

## Test pyramid
One row per level that exists at this tier. `belongs` is one falsifiable line.
| level | belongs | naming | location |
| :-- | :-- | :-- | :-- |
| unit | pure logic, no I/O, no dependency-edge crossing | test_<module>.py | tests/unit/ |
| integration [M+] | anything crossing an architecture dependency edge | test_<flow>.py | tests/integration/ |
| e2e [M+] | one journey from the E2E table per spec | <journey>.spec.ts | e2e/journeys/ |

## Fixture & factory strategy
- style: factory | fixture | hybrid       # why: <one line — stack idiom or recovered convention>
- library: <pkg>                          # reuse (in anchor allowlist) | new → dep_adds  [B: cite file:line]
- location: <path>                        # e.g. tests/factories/
- naming: <convention>                    # e.g. <entity>_factory / make<Entity>()
- override convention: <one line>         # how a test customizes a field without a new factory

### Canonical entity acquisition
THE one way a test obtains each entity (entities verbatim from .ai/context.md).
| entity | acquire via | location | overrides |
| :-- | :-- | :-- | :-- |
| <Entity> | <factory/fixture name> | <path> | <kwargs / builder / trait> |

## Seed data [M+]
- script: <path>                          # e.g. scripts/seed.ts, manage.py seed
- canonical dataset: <one line per entity — named, recognizable rows>
- migration sync: <mechanism>             # e.g. CI runs migrate + seed; a breaking migration fails the build

## Test database & services [M+]
- isolation: per-test transaction | truncation | container-per-suite   # why: <one line>
- how integration tests get a db: <one line>                            # e.g. testcontainers postgres, sqlite file
- real vs faked per level: unit = all faked · integration = db real, externals faked · e2e = everything real but <X>

## Brownfield data rule [B — MANDATORY when pii/regulatory in anchor.uplift_signals]
- policy: anonymize | synthesize | n/a    # production data never enters tests verbatim
- mechanism: <one line>                   # e.g. seed from factories only; dump-scrubber script <path>

## E2E journey suite [M+]
Rule: a feature's tracer-bullet slice EXTENDS the mapped spec file — parallel journey suites are rejected at /plan and /qa.
| journey (understanding behavior) | spec file | owning feature(s) |
| :-- | :-- | :-- |
| <journey-name> | e2e/journeys/<journey>.spec.ts | <feature-slug> |

## Performance tests [Pr]
- location: <path>                        # e.g. tests/perf/
- tool: <pkg>                             # governed; new → dep_adds
- exercises: <characteristic name> — <measurement + number from characteristics.yaml> → <test file>

## Notes
- gaps deferred upstream: <entities missing from context.md, journeys missing from understanding — or none>
- follow-ups captured: <or none>

## Verdict
**<VERDICT>** — <one-line rationale>. <override note if any>
```

## Tier deltas

- **prototype (minimal, ≤90, only if the user declines the skip):** frontmatter + `## Test pyramid`
  (often a single unit row) + `## Fixture & factory strategy` with a short acquisition table +
  Notes + Verdict. No seed/db/E2E/perf sections, no `.human` mirror, `human_summary` omitted.
- **mvp (≤185):** everything except `## Performance tests`. `.human` mirror required.
- **production (≤250):** the full skeleton. `.human` mirror required.

## `.human/summaries/test-strategy.md` mirror (mvp+)

Derived projection, never hand-authored: one plain sentence ("here's how every test gets its
data and how user journeys stay covered as features land"), 3–6 jargon-free bullets (the
framework, the one-way-to-make-test-data rule, where example data comes from, how the big
user journeys are guarded, anything new being added to the toolbox), **ONE** validated Mermaid
diagram via the mermaid skill — either a test-pyramid `flowchart` (levels + what lives at each)
or a journey→spec `flowchart` rendered FROM the E2E table — and a link back to
`.ai/test-strategy.md`.
