# ux-spec templates — both artifact skeletons + per-tier matrix

Fill only what the tier requires. Hard line caps: prototype ≤90 · mvp ≤185 · production ≤250
(both scopes). Over cap → split (feature scope: the UI is two features; project scope: prune
the inventory to components real journeys touch).

## Per-tier section matrix

| Section | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| **design-system.md** | | | |
| Navigation model | ✓ | ✓ | ✓ |
| Layout grid | one line | ✓ | ✓ |
| Component inventory | 3–6 components | 5–12 | 5–15 |
| Design tokens | color roles only | + type scale + spacing | full |
| Interaction-state conventions | ✓ (the four defaults) | ✓ | ✓ |
| Copy & tone | — | 3–6 rules | full + error formula |
| Accessibility baseline | noted defaults | keyboard + contrast + labels | **WCAG AA explicit** |
| **ux.md (feature)** | | | |
| Screens (with four states) | ✓ (this is ALL prototype needs) | ✓ | ✓ |
| User flows (incl. unhappy paths) | — | ✓ | ✓ |
| Component usage | — | ✓ | ✓ |
| Accessibility notes | — | light (focus order, labels) | **WCAG AA explicit per screen** |
| `.human` mirror | — | ✓ (flow diagram) | ✓ |

---

## `.ai/design-system.md` skeleton (project scope)

```markdown
---
slug: <project-slug>
stage: design-system
status: draft | complete
tier: prototype | mvp | production        # anchor.project_tier (fallback: intake predicted_tier)
verdict: DESIGN-SYSTEM-LOCKED | BLOCKED-ON-ARCHITECT
verdict_overridden: false
navigation_model: <tab-bar | sidebar | top-nav | single-page | wizard | …>
component_count: <N>
token_groups: [color, type, spacing]      # which groups are defined
a11y_baseline: defaults | basics | wcag-aa  # production = wcag-aa
source_architecture: .ai/architecture     # or .ai/architecture.md
source_anchor: .ai/anchor.md
source_understanding: .ai/understanding/<slug>.md
context_file: .ai/context.md
human_summary: .human/summaries/design-system.md
consumed_by: [ux-spec, design, bootstrap, qa]
created: YYYY-MM-DD
---

# Design system — <slug>

## Navigation model
- model: <name>                # why: <one line, traced to journeys>
- top_level: [<Area>, <Area>, <Area>]      # the nav-map flowchart in .human renders from this
- entry_screen: <Area>

## Layout grid
- pattern: <single-column | content+rail | dashboard | …>
- breakpoints: <names only, e.g. compact / regular / wide>   # values only if the user has them

## Component inventory
| component | use when | states it must support |
| :-- | :-- | :-- |
| <Name (domain language)> | <one line> | loading, empty, error, disabled |

## Design tokens
Names, not pixels — values only where the user supplied them (see ux-spec design-tokens.md).
- color_roles: { surface: <…>, primary-action: <…>, danger: <…>, … }
- type_scale: [display, heading, body, caption]            # [M+]
- spacing_scale: [xs, sm, md, lg, xl]                      # [M+]

## Interaction-state conventions
Project-wide defaults every screen inherits (overrides live in the feature ux.md):
- loading: <e.g. skeleton rows in place, never a blank screen>
- empty: <one-line message + the single next action>
- error: <copy formula + retry affordance>
- disabled: <visual + the reason surfaced on focus/hover>

## Copy & tone                # [M+]
- voice: <e.g. plain, second person, no exclamation marks>
- error_formula: <what happened + what to do next, no codes>   # [Pr]
- capitalization: <sentence case | title case>

## Accessibility baseline     # tier-scaled
- <prototype: defaults noted · mvp: keyboard + contrast + labels · production: WCAG AA, each commitment listed>

## Notes
- <tentatives, deferred decisions, new_components adopted from feature specs>

## Verdict
**<VERDICT>** — <one line>. <override note if any>
```

---

## `.ai/specs/<feature>/ux.md` skeleton (feature scope)

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: ux
status: draft | complete | blocked
tier: prototype | mvp | production        # INHERITED from prd.md — never recomputed
verdict: READY-FOR-DESIGN | BLOCKED-ON-PRD    # SKIPPED-NO-UI writes no file
verdict_overridden: false
surface: web-ui | mobile | composite | ai-llm
screen_count: <N>
flow_count: <N>                            # 0 at prototype
uses_components: [<Name>, …]               # from the design-system inventory
new_components: [<Name>, …]                # NOT in the inventory — flagged for project-scope adoption
source_prd: .ai/specs/<feature>/prd.md
source_design_system: .ai/design-system.md   # or: none (prototype, or mvp+ WARN recorded in Notes)
source_understanding: .ai/understanding/<slug>.md
context_file: .ai/context.md
human_summary: .human/specs/<feature>/ux.md  # present ONLY when written (mvp+)
consumed_by: [design, qa]
created: YYYY-MM-DD
---

# UX spec — <feature>

## Screens
<one block per screen — see "Per-screen spec block" below>

## User flows                 # [M+]
- flow: <name>                # traced to: <user story / journey>
  entry: <where the user starts>
  steps:
    1. <screen> — <user action> → <result>
    2. <screen> — …
  exit: <what is true at the end>
  unhappy:
    - at_step: <n> — <failure: validation | server error | abandon> → <screen + state + copy that catches it>

## Component usage            # [M+]
| screen | design-system components | new (flagged) |
| :-- | :-- | :-- |
| <Screen> | <Name>, <Name> | <Name or —> |

## Accessibility notes        # [M light / Pr explicit WCAG AA]
- <per-screen: focus order, labels, contrast, keyboard path; production names the WCAG AA criterion>

## Notes
- <design-system WARN if it fired, deferred screens, open copy questions>

## Verdict
**<VERDICT>** — <one line>. <override note if any>
```

---

## Per-screen spec block (inside `## Screens`)

```markdown
### <Screen name (domain language)>
- purpose: <one line — what the user accomplishes here>
- traces_to: <user story / F-ID from prd.md>
- key_elements: [<element>, <element>, <element>]
- data_shown: [<Entity.attribute>, …]          # entity terms from .ai/context.md, verbatim
- states:
    loading: <what renders while data fetches>
    empty: <copy verbatim + the next action offered>
    error: <copy verbatim + recovery affordance>
    disabled: <which elements, when, and the surfaced reason>
- validation:                                   # only if the screen takes input
    - field: <name> · rule: <plain rule> · copy: "<exact message>"
```

Rules:
- **Four states, every screen** — argue an `n/a`, never default it (state-matrix.md).
- **Copy verbatim** — quoted strings, entity terms from context.md, project copy rules at production.
- **No implementation** — no file paths, no framework component names, no CSS classes. Component
  references use the design-system inventory's domain-language names.
