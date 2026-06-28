---
Document: Product Roadmap — <PRODUCT_NAME>
Document ID: ROADMAP-<PRODUCT_SLUG>-v1.0
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 05 · Product Roadmap. Owning skill: pm-phase-05-roadmap.
Conforms to ../05_Conventions.md (§2 gate G4, §3 IDs RMI-*, §4 traceability spine,
§6 frontmatter/Living status, §7 outcomes-over-outputs). Companion: Release_Plan.md.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Status note: keep DRAFT while building; flip to LIVING once committed at G4 — a roadmap
is never "Approved-and-frozen" (§6). Re-review monthly/quarterly, never annually.
-->

# Product Roadmap — <PRODUCT_NAME>

## How to read this
*Outcomes, not a feature calendar.* Confidence and specificity **decrease left→right**:
**Now** = committed and capacity-checked · **Next** = directional, prioritised, not promised ·
**Later** = themes/outcomes only (do **not** over-specify like Now). This is a statement of
**intent and outcomes — NOT a contract of dates.** Skimmable in ~10 seconds.

<!-- A roadmap is a decision system: each bet names a problem, segment, confidence,
riskiest assumption, and a decision date (when we commit or drop it). -->

## Traceability (inputs — §4 spine)
<!-- Nothing enters this roadmap without an OPP-* (evidence) AND an OBJ/KR (outcome).
No opportunity behind an item ⇒ it's a feature wish, not a roadmap entry — re-route to discovery. -->
- Outcomes from: `01_Strategy/North_Star_and_OKRs.md` — Objectives `OBJ-*` / Key Results `KR-*`, North Star `MET-*`.
- Opportunities from: `04_Opportunity/Opportunity_Solution_Tree.md` + `Opportunity_Assessment.md` — `OPP-*` (sized, four-risks-rated).
- Sequencing informed by: `06_Prioritization/Prioritization_Matrix.md` (RICE/WSJF/ICE — *informs*, never launders a HiPPO call).
- Guardrails (in/out of scope): `01_Strategy/Product_Strategy.md` · `02_Market/Positioning_Brief.md`.

## Confidence legend
<!-- Set per horizon; confidence MUST visibly decay Now→Later. -->
- **High** — validated `OPP-*`, capacity reserved, `MET-*` named. (Expected in *Now*.)
- **Medium** — opportunity validated, solution/capacity not yet locked. (Typical in *Next*.)
- **Low** — problem we care about, no solution committed. (All of *Later*.)

---

## Outcome: <OBJ-01 / KR-01 — e.g. "Cut time-to-first-value to <1 day">
<!-- One swimlane PER outcome (OBJ/KR), never per team or feature. Add one ## block per active outcome.
Confirm coverage: every active OBJ/KR has a lane here OR an explicit entry under "Deliberately NOT now". -->

| Horizon | RMI | Bet (problem it solves, for which segment) | OPP | Confidence | Decision date | Moves (MET) |
|---|---|---|---|---|---|---|
| Now   | RMI-01 | <bet> for <segment> | OPP-<nn> | High   | committed    | MET-<nn> |
| Next  | RMI-02 | <bet> for <segment> | OPP-<nn> | Medium | <YYYY-MM-DD> | MET-TBD  |
| Later | RMI-03 | <theme / outcome only — no solution> | OPP-<nn> | Low | — | — |

<!-- "Decision date" = when we'll commit or drop this bet (Now bets read "committed"; Later reads "—").
"Moves (MET)" is mandatory for every Now bet — no committed bet without a metric it moves (§7). -->

## Outcome: <OBJ-02 / KR-02 — TODO: next outcome lane>
| Horizon | RMI | Bet (problem it solves, for which segment) | OPP | Confidence | Decision date | Moves (MET) |
|---|---|---|---|---|---|---|
| Now   | RMI-<nn> | <bet> for <segment> | OPP-<nn> | <High/Med/Low> | committed | MET-<nn> |
| Next  | RMI-<nn> | <bet> for <segment> | OPP-<nn> | <Med/Low> | <YYYY-MM-DD> | MET-TBD |
| Later | RMI-<nn> | <theme / outcome only> | OPP-<nn> | Low | — | — |

---

## Agent / API user lane *(if the product serves agents/automations, not only humans)*
<!-- 2026 two-stream shift: give the agent user class its own lane and its own metrics —
don't leave it invisible. Delete this section if not applicable. -->
| Horizon | RMI | Bet | Confidence | Moves (MET: task-success rate · human-intervention rate · API reliability) |
|---|---|---|---|---|
| Now  | RMI-<nn> | <bet for agent/API consumer> | <conf> | MET-<nn> <which agent metric> |
| Next | RMI-<nn> | <bet> | <conf> | MET-TBD |

## Deliberately NOT now
<!-- Saying "no/not yet" out loud is the roadmap doing its job. Name the trigger that would revisit it. -->
- <theme / opportunity> — <why parked> (revisit when <trigger / signal>).
- TODO: <other parked item>

## Dependencies & open risks
<!-- Surface cross-team / tech dependencies now so they're visible; DEP-* owned by pm-phase-10-delivery,
RSK-* tracked in _threads/Risk_Register.md. -->
- DEP-<nn> — <cross-team / external / tech dependency> · blocks RMI-<nn>.
- RSK-<nn> — <risk to a Now bet> (→ `_threads/Risk_Register.md`).

## Per-audience views
<!-- One source of truth, multiple lenses — "one roadmap, one audience" is an anti-pattern. -->
- **Exec** — outcomes + bets, BLUF; lead with the OBJ/KR each lane moves.
- **Team** — release slices + dependencies (see `Release_Plan.md`).
- **Customer / Sales** — themes only, **NO dates** (intent, not a commitment).

## Review cadence & change log
<!-- Living artifact — record material changes; minor edit = vMINOR bump, gate re-approval of a
materially changed roadmap = vMAJOR bump (§6). -->
- Cadence: <e.g. monthly review · quarterly re-plan> (adaptive multi-cadence, not annual lock).
- | Date | vX.Y | Change (RMI added/moved/dropped) | Why | By |
  |---|---|---|---|---|
  | <YYYY-MM-DD> | v1.0 | Initial commit | G4 | <name> |

## Gate — G4 · Roadmap Commit
<!-- Decision recorded as DEC-* in _threads/Decision_Log.md — an unrecorded gate is a failed gate. -->
- Decision: <Persevere | Persevere-with-actions | Pivot | Hold | Kill> — see `_threads/Decision_Log.md` DEC-<nn>.
- Checklist (must all pass): Now/Next/Later not a dated Gantt · every Now item ties to an `OBJ/KR` + `OPP-*` ·
  confidence decays Now→Later · capacity sanity-checked (not 100%) · `DEP-*` surfaced ·
  stakeholders read it as intent, not a date contract.

---
*Owning skill:* **pm-phase-05-roadmap** · *Companion template:* **Release_Plan.md** (committed-Now delivery view) ·
*Conventions:* ../05_Conventions.md
