# SLO templates — `.ai/slo.md` + severity-ladder defaults + `.human/summaries/slo.md`

The project-scope (`/runbook --slo`) output pair. Production `project_tier` only.
Hard cap **150 lines** on the `.ai` file — an SLO register longer than that is
tracking vanity metrics; keep the objectives that would actually page someone.

## `.ai/slo.md` skeleton

````markdown
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

# Service-level objectives — <slug>

> Locked YYYY-MM-DD. Targets seeded from characteristics.yaml measurements + PRD NFR
> ceilings; confirmed by the user. Re-run `/runbook --slo` when a characteristic or
> ceiling changes.

## Objectives
One block per characteristic / project-wide NFR worth an objective.

- name: <characteristic or NFR name, e.g. availability>
  sli: <what is measured + where — a real source from anchor observability, e.g. "ratio of 2xx/5xx on the LB, from <metrics tool>">
  slo: <target with a number + window, e.g. "99.5% over 30 days">
  error_budget: <what the budget is + what happens when it's spent, e.g. "0.5% ≈ 3.6h/30d; spent → feature freezes, reliability work only">
  alert_threshold: <the number that fires BEFORE the SLO is breached, e.g. "burn rate > 2x for 1h">
  pages: <who — name/rotation/channel — confirmed by the user>
  source: <characteristics.yaml top_3[n] / prd <feature> NFR-N / anchor nfr_ceiling_*>

## Severity ladder
| level | definition | response expectation |
| :-- | :-- | :-- |
| SEV1 | <…> | <…> |
| SEV2 | <…> | <…> |
| SEV3 | <…> | <…> |

## Open questions
- <SLI with no existing measurement source, paging rotation not yet decided, …>

## Notes
- characteristics not given an SLO + why: <list or none>

## Verdict
**<VERDICT>** — <one-line rationale>. <override note if any>
````

## Severity-ladder defaults (propose, then adjust)

Propose this table in plain English ("how bad does it have to be before someone gets
woken up?"); the user confirms or reshapes it. Small teams often merge SEV2/SEV3 —
that's fine; record what they actually run.

| level | default definition | default response expectation |
| :-- | :-- | :-- |
| **SEV1** | The service is down or unusable for most users, data is being lost or corrupted, or money/PII is actively exposed | Page immediately, any hour. All-hands until mitigated. Status update to stakeholders within 30 min. Rollback first, root-cause later. |
| **SEV2** | A core feature is broken or badly degraded for many users; a workaround may exist; error budget burning fast | Page during waking hours; otherwise first thing next morning. One owner assigned; mitigation same day. |
| **SEV3** | Minor degradation, an edge case, or a single non-core feature affected; SLO not at risk | No page. Ticket into the normal flow (`/triage`); fix scheduled like regular work. |

Pair each level with the alert thresholds: an SLO breach in progress (burn-rate alert)
is at least SEV2; a hard down signal (smoke failing in prod) is SEV1.

## `.human/summaries/slo.md` — the mirror

Standard mirror rules ([conventions.md § Human summaries](../../_shared/conventions.md)):

- **One plain sentence** lead: "Here's what we promise this service does, and who gets
  called when it doesn't."
- **3–6 jargon-free bullets**: each objective as "we promise X; if it drops below Y,
  Z gets paged" — no "SLI"/"error budget" without a parenthetical everyday gloss.
- **ONE validated Mermaid diagram** via the [mermaid skill](../../mermaid/SKILL.md):
  the **severity-ladder flowchart** — alert fires → "is the service down / data at
  risk?" → SEV1 page now / SEV2 page in hours / SEV3 ticket. Render it FROM the
  `## Severity ladder` table; diagrams never go in `.ai/`.
- **Link back** to `.ai/slo.md`.
