# Sunset — artifact skeletons, dependant check, tier matrix

Loaded on demand from [SKILL.md](../SKILL.md). The canonical schema block lives in
[`../../_shared/ai-schema.md`](../../_shared/ai-schema.md); these are the fill-in skeletons.

## `.ai/specs/<feature>/sunset.md` skeleton

```markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: sunset
status: planned | deprecated | removal-routed | removed   # mirrors the latest verdict
tier: prototype | mvp | production           # INHERITED from prd.md — never recomputed (fallback anchor.project_tier + WARN)
verdict: SUNSET-PLANNED | DEPRECATED | REMOVAL-ROUTED | REMOVED
verdict_overridden: false
deprecation_window: <YYYY-MM-DD or condition>   # prototype: immediate
window_verified: false                        # set true by the remove phase (R1)
comms_done: false                             # set true by the remove phase (R1)
flag_off: <flag name + system, or none>       # from environments.md flag_system
data_handling: keep | delete | export-then-delete | per-entity | none
removal_route: none-yet | prd-update | tasks/remove-<feature>.md
removal_merged: false                         # set true only on the human's R3 confirmation
dependants_at_plan: []                        # MUST be empty to proceed (the D1/R1 gate result)
source_features: .ai/features.md
source_outcome: .ai/specs/<feature>/outcome.md        # or: none (warned)
source_asbuilt: .ai/specs/<feature>/as-built.md       # or: none (warned)
source_data_management: .ai/data-management.md        # or: none (warned)
source_environments: .ai/environments.md              # or: none (warned)
consumed_by: [sunset, next, status, feature-census]
created: YYYY-MM-DD
---

# Sunset — <feature>

## Why
<One or two lines. Quote outcome.md verbatim when it exists: "METRIC-MISSED — actual 12 vs target 50; decision: remove (YYYY-MM-DD)." Else the human's stated reason.>

## Deprecation window
- window: <date or condition, verbatim from the human>
- starts: <deprecation date — the DEPRECATED flip date>
- verified: <no | yes (YYYY-MM-DD, by whom)>           # the remove phase records this

## User communication
- message: <what users are told, in their words — or the location of the canonical text>
- channel: <release note | email | in-app banner | …>
- sent: <no | yes (YYYY-MM-DD)>                        # the remove phase records this
<!-- prototype: section omitted (no external users to tell) -->

## Flag-off
- flag: <name> · system: <environments.md flag_system>
- who flips: <human/role> · when: <point in the window>
<!-- flag_system: none → "flag_off: none — section omitted" -->

## Data handling
Cites `.ai/data-management.md` § Retention & PII lifecycle — recorded decisions, never legal interpretation.
| entity | retention rule cited | action on removal | when | legal review? |
| :-- | :-- | :-- | :-- | :-- |
| <Entity> | <quoted row, or "no policy row — open question"> | keep | delete | export-then-delete | <at removal / after N days> | <no | FLAGGED> |

## Removal work
- route: <none-yet | /prd <feature> update mode + the normal loop | tasks/remove-<feature>.md>
- file list source: <as-built.md module map + issues/SLICE-*.md files manifests | "to be scouted">
- acceptance summary: code removed · flag removed · data handled per the table above

## Open questions
- <retention/legal/consumer unknowns — each flagged for human review>

## Decision log (append-only, most-recent first — same discipline as qa's approval block)
### YYYY-MM-DD — <DEPRECATED | REMOVAL-ROUTED | REMOVED | SUNSET-PLANNED | override>
- Decision: deprecate | route-removal | confirm-merged | remove | defer | override
- By: <git user.name> · At: <ISO>
- Reason: <one line, the human's words; an override quotes what it overrides>
- Evidence: <R3 only — the PR / merge commit / closed slices the human named>
```

**Line caps** (tier-scaled): prototype ≤90 · mvp ≤185 · production ≤250. The Decision log
grows over time; prune nothing — re-runs append, never rewrite history.

## `tasks/remove-<feature>.md` — the small-route removal task

Free-form mtdd task per [`../../_build_share/task-template.md`](../../_build_share/task-template.md)
(the portable core source all four `mtdd-*` skills accept). Fill it from the sunset plan:

```markdown
# Remove <feature>

## Context

<feature> was deprecated on <date> per `.ai/specs/<feature>/sunset.md` (why: <one line
from ## Why>). The deprecation window (<window>) has passed and user communication is
done. This task removes the code, the flag, and handles the data per that plan. Do not
re-litigate the decision here — the sunset record carries it.

## Goal

All code, flags, and data for <feature> are removed/handled per the sunset plan, with the
test suite green.

## Acceptance criteria

- [ ] Code: the following files are deleted (or the <feature> paths inside them removed):
      <union of as-built.md module map + non-removed issues/SLICE-*.md files manifests;
      when neither exists: "scout the feature's files first and list them in the PR">
- [ ] No remaining references: project-wide search for <feature's entry points / route /
      module names> returns no live hits (dead imports, routes, nav links all gone)
- [ ] Flag: <flag name> removed from <flag_system> and from code — or "no flag (n/a)"
- [ ] Data: <per the sunset.md Data handling table — e.g. "migration drops table X with a
      down per data-management.md reversibility rule" / "export job run + verified" / "data
      kept (n/a)">
- [ ] <project typecheck command> exits 0
- [ ] <project test command> exits 0 (full suite — removal is where regressions hide)

## Out of scope

- Any other feature's code (especially former dependants — their re-pointing was done via
  /feature-map before this task existed)
- Editing `.ai/specs/<feature>/sunset.md` or `features.md` (the `removed` flip is /sunset's,
  after this merges)

## Target branch

`<project target branch>`

## Skip tests?

`false`

---

## Status log

## Completion
```

## The dependant check (D1 / R1)

Mechanical, against `.ai/features.md` only:

1. Read every row of `## In scope` (plus Deferred rows that carry `depends_on`).
2. A **dependant** = any row whose `depends_on` contains this feature's id AND whose
   `status` is not `removed` (a `cut` row's dep is moot but name it as a note, not a block;
   `deprecated` dependants DO block — they still exist until removed).
3. Any dependant → `BLOCKED-ON-DEPENDANTS`. Output one line per dependant:
   `<slug> (status: <status>) — sunset it first, or re-point its depends_on via /feature-map update mode`.
4. Empty → record `dependants_at_plan: []` and proceed. The remove phase re-runs the same
   scan (the roster may have grown a dependant since the plan).

## Tier matrix

| | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| Deprecate interview | 1 question (why) | why + window + comms | full (+ flag-off + per-entity data table) |
| Window / comms | skipped (window `immediate`) | required | required |
| Data handling | one line (keep/delete) | per-entity if data-management exists | per-entity, MANDATORY; legal flags |
| sunset.md cap | ≤90 lines | ≤185 | ≤250 |
| Dependants gate | **FULL — never scaled down** | full | full |
| Human gates (both flips) | **FULL — never scaled down** | full | full |

The tier dial scales the paperwork, never the safety: the dependant gate and the two
human approvals are identical at every tier.

## Verdict → routing recap

| Verdict | Next |
| :-- | :-- |
| `SUNSET-PLANNED` | wait out the window / get the approval; re-run `/sunset <feature>` |
| `DEPRECATED` | comms go out; re-run `/sunset <feature>` after the window for the remove phase |
| `REMOVAL-ROUTED` | run the routed work (`/prd` update + loop, or the mtdd loop on `tasks/remove-<feature>.md`); re-run `/sunset <feature>` once merged |
| `REMOVED` | done — terminal |
| `BLOCKED-ON-DEPENDANTS` | `/sunset <dependant>` first, or `/feature-map` update mode to re-point the dep |
| `NOT-SHIPPED` | `planned`/`building`/`qa-approved` → finish the loop or cut via `/feature-map` update mode; `removed` → no-op |
