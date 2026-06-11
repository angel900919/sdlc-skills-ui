# `.ai/specs/<feature>/research.md` skeleton

Assemble research from this. Fill a section only if its tier set covers the inherited tier.
**Facts only, every claim cited `path:line`. No diagrams, no `.human` mirror.** Frontmatter is
the index — schema in [`../../_shared/ai-schema.md`](../../_shared/ai-schema.md).

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: research
status: draft | complete | blocked
tier: prototype | mvp | production        # INHERITED from prd.md — never recomputed
verdict: READY-FOR-DESIGN | RESCOPE-NEEDED | BLOCKED-ON-PRD | BLOCKED-ON-ANCHOR
verdict_overridden: false
citation_count: <N>
open_question_count: <N>
scanned_by: explore-subagent
source_prd: .ai/specs/<feature>/prd.md
source_anchor: .ai/anchor.md
consumed_by: [design, plan]
created: YYYY-MM-DD
---

# Research — <feature>

<!-- TIER MARKERS: [P] prototype (cap 90) · [M] mvp (cap 185) · [Pr] production (cap 250).
     Over cap → the scan was too broad; re-scope to the feature. -->

## Existing tooling  [P][M][Pr]
Libraries / SDKs already in deps that this feature would touch (versions included).
- <lib@version> — <path/to/file.ts:L42> — <one-line role>

## Comparable patterns in repo  [P][M][Pr]
Adjacent files / modules whose pattern this feature can follow.
- <path/to/file.ts:L12-30> — <why it's relevant>

## Conventions discovered  [M][Pr]
- naming: <e.g. verb-noun service files; PascalCase types; snake_case DB columns>
- error handling: <e.g. AppError class — src/errors/index.ts:L1>
- logging: <e.g. logger.info with trace_id + feature + entity_id — src/log/index.ts:L1>
- testing: <e.g. colocated __tests__/, vitest, fixtures in src/__fixtures__/>

## Constraints discovered  [M][Pr]
- <e.g. CI requires green tests before merge — .github/workflows/ci.yml:L18>
- <e.g. no bare catch — eslint.config.js:L88>

## Library choices considered (NOT decided)  [M][Pr]
Options /design might pick from — NOT a recommendation.
- <option A> — <pros> / <cons> — already in package.json:L24
- <option B> — <pros> / <cons> — not yet in deps

## Prior art  [P][M][Pr]
Similar features already shipped (one-liners).
- <feature name> at <src/path:L1> — <what it does that's similar>

## Open questions for design  [P][M][Pr]
<!-- Numbered, ≤5. Answerable HOW unknowns /design must close. NOT scope changes (those → /prd as RESCOPE-NEEDED). -->
1. <e.g. "Stripe supports sync and async webhooks for invoice events; which does /design pick?">

## Notes  [P][M][Pr]
- glossary terms used: <from .ai/context.md — confirm none drift>
- stale citations flagged: <e.g. src/payments/legacy.ts last touched 8 months ago; verify still relevant>
- supersedes: <prior research version, if a v2 — or none>

## Verdict  [P][M][Pr]
**<VERDICT>** — <one paragraph: if READY-FOR-DESIGN, restate the inputs /design will use
(placement hint, prior-art files, conventions, library options, open questions). If blocked /
rescope, name what's needed. If verdict_overridden: the user's recorded reason.>
```
