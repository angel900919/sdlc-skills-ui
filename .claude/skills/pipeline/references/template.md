# `.ai/pipeline.md` skeleton + table shapes

Frontmatter per the schema block in `_shared/ai-schema.md` (§ `.ai/pipeline.md`). Body
sections in this fixed order; fill only what the tier requires. Line caps 90/185/250.

````markdown
## Quality gates
| gate | trigger | tool / suite | source | blocking |
| :-- | :-- | :-- | :-- | :-- |
| unit + typecheck | pre-merge | <from .ai/test-strategy.md> | test-strategy.md § Pyramid | yes |
| lint | pre-merge | <linter> | anchor.md § Stack | yes |
| secrets scan | pre-merge | <tool or provider-native> | gate-matrix L1 | yes |
| dependency audit | pre-merge | <tool> | gate-matrix L3 | [Pr] yes / [M] advisory |
| E2E journeys | post-merge | <from test-strategy E2E suite> | test-strategy.md § E2E | [Pr] yes |
| fitness functions | pre-merge | <command from /to-fitness> | fitness/ | [Pr] yes |
| SBOM + provenance | release | <tools> | gate-matrix L3 | [Pr] yes |

## Deploy & release
| env | trigger | pipeline | smoke | rollback mechanism |
| :-- | :-- | :-- | :-- | :-- |
| <env> | <merge to trunk / tag per anchor.release_policy> | <workflow file or `gap`> | <command from environments.md> | <previous-artifact / revert+redeploy / platform> |

- deploy_vs_release: <flags from environments.md `flag_system`, or "deploy = release (no flags)">
- branch_protection: <required checks on trunk, by gate name; or `gap`>

## Supply chain
- secrets_scanning: <how enforced>                 # all tiers
- pinning: <lockfile + install discipline; workflow refs>   # all tiers
- dependency_audit: <tool + blocking? + suppression path [Pr]>
- sbom: <tool + release wiring>                    # [Pr]
- provenance: <attestation/signing approach>       # [Pr]

## Dependency updates                              # [M+]
- tool: <renovate | dependabot | ...>  cadence: <e.g. weekly>
- automerge: <e.g. patch-level automerge; minor+ reviewed>

## Monitoring as code                              # [Pr]
- path: <where alert rules/dashboards live, or `none`>
- apply: <what ships them, or `gap`>

## Gap table
| # | contract requirement | detected | status | route |
| :-- | :-- | :-- | :-- | :-- |
| G1 | <mandatory control from gate-matrix> | <file:line or `missing`> | open \| waived \| routed | <slice through the loop / bootstrap step / waiver reason> |

## Open questions
- [ ] <org-level fact nobody could confirm>

## Notes
<contradictions surfaced (e.g. a deploy to an env the roster doesn't name), waiver
rationales, anything tentative.>

## Verdict
<VERDICT> — <one-line reason>. Open gaps: <N> (routed: <M>, waived: <K>).
````

## `.human/summaries/pipeline.md` shape (mvp+)

One plain sentence — *"here is what stands between a code change and your users"* —
then 3–6 jargon-free bullets (what gets checked before merge, how a deploy happens,
how we'd undo one, the biggest open gap), ONE validated Mermaid flowchart of
merge → gates → deploy → release (happy path solid; a blocked gate dotted) generated
via the **mermaid skill**, and a link back to `.ai/pipeline.md`.
