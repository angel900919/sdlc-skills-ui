# ICE

A lightweight triage score — **Impact × Confidence × Ease** — for ranking many ideas fast, especially growth/experiment bets, with deliberately rough inputs.
**Primary source / attribution:** Popularised by Sean Ellis (GrowthHackers) for growth experiment prioritization. Canon: [`../05_Conventions.md`](../05_Conventions.md) §8 lists it as *"ICE"* (no single originator named).

## What it's for / when to use
- **Early/fast teams** and large idea backlogs where a full [RICE](rice.md) pass is overkill.
- Ranking **growth experiments** where speed of triage matters more than precision.
- A quick first cut before investing estimation effort on the survivors.

## The steps
1. List the ideas/experiments against a clear objective.
2. **Impact** — expected effect on the metric, scored 1–10.
3. **Confidence** — how sure you are it'll work (1–10); keeps optimism honest.
4. **Ease** — how cheap/quick to ship (1–10; higher = easier).
5. Score = **Impact × Confidence × Ease** (or the average). Sort, take the top few, then validate.

## Worked micro-example
- "Add onboarding tooltip": Impact 7 × Confidence 5 × Ease 9 = **315**.
- "Redesign dashboard": Impact 9 × Confidence 4 × Ease 2 = **72**.
- The cheap, high-confidence tooltip wins as the next quick experiment; the redesign needs more evidence before it's worth the size.

## When NOT to use it
- **High-stakes, irreversible** decisions — use evidence-weighted [RICE](rice.md) or [WSJF](wsjf-cost-of-delay.md).
- When you actually have reach data — RICE's Reach term is more defensible than ICE's gut Impact.
- Cross-team scoring without calibration — one person's "8" is another's "4."

## Common mistakes / anti-patterns
- **Subjectivity & inconsistency** — single-person gut scores with no calibration make ranks meaningless; score as a group or anchor the scales.
- **Gaming / score inflation** — easy to nudge a 7 to an 8 to float a pet idea.
- **False precision** — ICE is a *triage* signal, not a verdict; don't defend a 290-vs-300 gap.
- **"The spreadsheet decided" / AI score as truth** — ICE structures the conversation; the PM owns the call and validates AI-suggested scores.

## Used in phases
- **Phase 06 — Prioritization** (`../skills/pm-phase-06-prioritization/`) — primary.
- **Phase 13 — Experimentation** (`../skills/pm-phase-13-experimentation/`) — ranking experiment ideas.
- **Phase 15 — Growth** (`../skills/pm-phase-15-growth/`) — triaging the growth backlog.

## Source
- https://www.productlift.dev/blog/product-prioritization-framework/
- https://productschool.com/blog/product-fundamentals/ultimate-guide-product-prioritization
- https://www.atlassian.com/agile/product-management/prioritization-framework
