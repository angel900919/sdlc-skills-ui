# PRD skeleton — `.ai/specs/<feature>/prd.md`

Fill only the sections the computed tier requires (markers `[P]` prototype · `[M]` mvp · `[Pr]` production). Hard cap 90 / 185 / 250 — over → split the feature. No diagrams (the journey diagram, if any, lives only in the mvp+ `.human` mirror).

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: prd
status: draft | complete | blocked
tier: prototype | mvp | production        # effective = max(project_tier, feature_uplift)
uplifted_from: <project_tier>              # omit if no uplift
verdict: READY-FOR-DESIGN | NEEDS-MORE-CLARITY | BLOCKED-ON-ARCHITECTURE | BLOCKED-ON-DISCOVERY | BLOCKED-ON-ANCHOR
verdict_overridden: false
placement: <component from 02-components.md, proposed>   # or: none — likely needs architect update
satisfies: <behavior-name from understanding>            # the journey/behavior this serves
beyond_roster: false                       # true if <feature> is not a row in features.md
nfr_count: <N>                             # mvp+
ai_card: false                             # true if the feature ships AI to end users
sources: [.ai/anchor.md, .ai/architecture, .ai/discovery/<slug>.md, .ai/understanding/<slug>.md, .ai/features.md]
human_summary: .human/specs/<feature>/prd.md   # present only when written (mvp+)
consumed_by: [design, plan, to-fitness]
created: YYYY-MM-DD
---

# PRD — <feature>

## Status  [P][M][Pr]
`Draft`   <!-- Draft | Validating | Building | Shipped | Blocked | Superseded -->

## Problem  [P][M][Pr]
<1–3 sentences. What hurts, whose pain. Use understanding's glossary verbatim — no invented synonyms.>

## Target user  [P][M][Pr]
<Specific named person (real or composite); role, context, the constraint that makes them feel the pain. From discovery.>

## Job to be Done  [P][M][Pr]
> When <situation>, I want to <motivation>, so I can <expected outcome>.

## Scope  [P][M][Pr]
**In:** <capability>, <capability>, <capability>
**Out:** <deliberately excluded>, <excluded>

## Success metric  [P][M][Pr]
| field | value |
| :-- | :-- |
| metric | <what is counted> |
| baseline | <today's number + source> |
| target | <winning number> |
| timeframe | <by when> |
| source | <how measured — query / log / event> |

## Kill criteria  [P][M][Pr]
- If <observable condition> by <date/milestone>, stop — because <reason>.

## User stories  [M][Pr]
1. As a <specific actor>, I want <capability>, so that <benefit>.   <!-- all three parts; actor = end user -->

## Risks / Assumptions  [M][Pr]
| id | assumption | falsifying test (≤1 week) |
| :-- | :-- | :-- |
| R-1 | <belief> | <cheap test> |

## Non-functional requirements  [M][Pr]
<!-- mvp: 3–5 light rows. production: full table. Number + measurement, never adjectives. -->
| id | category | target | measurement |
| :-- | :-- | :-- | :-- |
| NFR-1 | Latency | p95 ≤ 200 ms at 100 RPS | APM, 7-day rolling |

## Functional requirements
### mvp — prose form  [M]
- <"When the user does X, they see Y within Z." User-outcome framing.>

### production — EARS + verification  [Pr]
<!-- see references/ears.md. One behavior per clause. -->
| id | requirement (EARS) | verify |
| :-- | :-- | :-- |
| F-1 | When <trigger>, the system shall <response> within <time>. | T |
| F-2 | If <invariant-violating condition>, then the system shall <recovery>. | T |
<!-- every in-scope architecture invariant → ≥1 Unwanted-behavior (If/Then) clause -->

## AI transparency card  [M][Pr]   <!-- only if ai_card: true; see references/ai-transparency-card.md -->
- What the AI does / does NOT do / data it sees / data it never sees / where it runs / opt-out.

## Open questions  [M][Pr]
1. <answerable unknown blocking design>

## Notes  [P][M][Pr]
- Glossary terms used: <from understanding — confirm no drift>
- Invariants honored: <from architecture>
- Characteristics honored:  [Pr] <which of architect's top-3 the NFRs align with; flag exceptions with a per-feature ADR>
- Architectural placement: <component, proposed here, finalized by /design>
- Tech leakage captured (deferred to /design): <stack/path/schema asks the user raised>
- Supersedes: <prior PRD slug, if v2>

## Verdict  [P][M][Pr]
**<VERDICT>** — <one paragraph. If READY-FOR-DESIGN, restate the contract design must satisfy. If blocked, name what unblocks it. If overridden, the user's recorded reason.>
```
