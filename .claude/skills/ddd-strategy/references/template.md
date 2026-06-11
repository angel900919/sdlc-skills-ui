# `strategic-design.md` template

The skeleton for `.ai/architecture/strategic-design.md`. **Structure only — no diagrams** (the context map is the `.human/summaries/strategic-design.md` mirror). Hard cap **200 lines**. Frontmatter is the index; fill only the sections the domain needs.

```markdown
---
slug: <project-slug>
stage: strategic-design
status: draft | complete
subdomain_count: <N>
context_count: <N>
integration_edge_count: <N>
verdict: READY-FOR-ARCHITECT | NEEDS-EVENT-STORM | BLOCKED-ON-UNDERSTANDING
verdict_overridden: false
contexts: [<ContextName>, <ContextName>]      # all bounded-context names
source_understanding: .ai/understanding/<slug>.md
source_domain_model: .ai/architecture/domain-model.md   # or: none
context_file: .ai/context.md
human_summary: .human/summaries/strategic-design.md
adr_refs: [NNNN, ...]                          # shared counter with /architect
consumed_by: [event-storm, architect]
created: YYYY-MM-DD
---

# Strategic design — <project>

## Business context
<2–4 sentences: what the business does, who the users are, the competitive landscape.>

## Subdomains
| subdomain | type | reasoning | owning team |
| :-- | :-- | :-- | :-- |
| <name> | core / supporting / generic | <why this type — evidence for any core> | <team or TBD> |

## Bounded contexts
### <ContextName>
- subdomain: <name from the table above>
- responsibility: <one sentence — what this context owns>
- local_language: <key terms that differ from other contexts; "—" if none>
- suggested_logic_pattern: transaction-script | active-record | domain-model | event-sourced   # advisory; /architect decides
- suggested_arch_pattern: layered | hexagonal | cqrs                                          # advisory
- owning_team: <team or TBD>

## Ubiquitous-language seams
Terms that mean different things in different contexts — each is a boundary.
- <term>: means <X> in <ContextA>, <Y> in <ContextB>

## Integration matrix
Every context pair that exchanges data. Pattern picker: `references/integration-patterns.md`.
| upstream → downstream | pattern | rationale | ACL needed? |
| :-- | :-- | :-- | :-- |
| <CtxA> → <CtxB> | OHS / ACL / Shared-Kernel / Conformist / Partnership / Separate-Ways | <why> | <yes/no> |

## Strategic decisions
ADRs (shared counter with /architect; format in `architect/references/adr.md`):
- ADR-NNNN: <title>

## Open questions
- <question the team must resolve before implementation starts>

## References
Source: *Learning Domain-Driven Design* by Vlad Khononov — subdomains chs 1 & 10, bounded contexts ch 3, integration ch 4, ubiquitous language ch 2.
```

## Field notes

- **The integration matrix is the structure the `.human` context map renders** — each row becomes one labeled edge (pattern + U/D direction) in the Mermaid `flowchart`.
- **`suggested_*_pattern` fields are advisory** — they record the DDD heuristic's recommendation per context; `/architect` makes the binding system-wide style decision and reconciles.
- **`consumed_by` lists `event-storm`** because a `NEEDS-EVENT-STORM` round models one of these contexts in tactical detail; `architect` consumes the whole file verbatim.
- **Per-context `local_language` does not replace `.ai/context.md`** — it refines root terms within a context; a contradiction with the root glossary is an open question, not a silent override.
