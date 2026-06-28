---
Document: Product Roadmap — Cadence
Document ID: ROADMAP-cadence-v1.0
Status: Living
Owner: Product Manager
Updated: 2026-03-19
---

# Product Roadmap — Cadence

## How to read this
*Outcomes, not a feature calendar.* Confidence and specificity decrease left→right: **Now** = committed and capacity-checked · **Next** = directional, prioritised, not promised · **Later** = themes/outcomes only. A statement of **intent and outcomes — NOT a contract of dates**.

## Traceability (inputs — §4 spine)
- Outcomes from: [../01_Strategy/North_Star_and_OKRs.md](../01_Strategy/North_Star_and_OKRs.md) — `OBJ-01`, `KR-01..05`, North Star `MET-01`.
- Opportunities from: [../04_Opportunity/Opportunity_Solution_Tree.md](../04_Opportunity/Opportunity_Solution_Tree.md) — `OPP-01` (selected), `OPP-02`, `OPP-03`.
- Sequencing informed by: [../06_Prioritization/Prioritization_Matrix.md](../06_Prioritization/Prioritization_Matrix.md) (RICE).
- Guardrails: [../01_Strategy/Product_Strategy.md](../01_Strategy/Product_Strategy.md) §5 non-goals.

## Confidence legend
- **High** — validated `OPP-*`, capacity reserved, `MET-*` named (expected in *Now*).
- **Medium** — opportunity validated, solution/capacity not yet locked (typical in *Next*).
- **Low** — problem we care about, no solution committed (all of *Later*).

---

## Outcome: OBJ-01 / KR-01 — Make async standups the default (grow Weekly Active Teams)

| Horizon | RMI | Bet (problem it solves, for which segment) | OPP | Confidence | Decision date | Moves (MET) |
|---|---|---|---|---|---|---|
| Now | RMI-01 | **Async standup core** (TZ-aware prompt → 90s submit → auto-digest) for distributed teams | OPP-01 | High | committed | MET-01, MET-03, MET-04 |
| Now | RMI-04 | **Teammate-invite loop** built into the standup flow (PLG growth) | OPP-01 | High | committed | MET-02 |
| Next | RMI-02 | **Searchable standup & decision notes** for leads + ICs | OPP-02 | Medium | 2026-06-30 | MET-05 / MET-TBD |
| Later | RMI-03 | **Status roll-up digest** for leads reporting to VP | OPP-03 | Low | — | — |

<!-- Every Now bet ties to OPP-01 (validated) + KR-01 and names the MET it moves. -->

## Outcome: OBJ-02 / KR-04 — Make the invite loop the primary growth engine

| Horizon | RMI | Bet (problem it solves, for which segment) | OPP | Confidence | Decision date | Moves (MET) |
|---|---|---|---|---|---|---|
| Now | RMI-04 | Teammate-invite loop (shared above; this is the growth lane view) | OPP-01 | High | committed | MET-02 |
| Later | RMI-05 | Slack/Teams integration as a secondary acquisition channel | OPP-01 | Low | — | MET-TBD |

## Deliberately NOT now
- **Live video / meeting feature** — contradicts the strategy (§5 non-goal). A "video summary" experiment shipped later is sunset in [../16_Sunset/Sunset_Decision.md](../16_Sunset/Sunset_Decision.md) (revisit: never — off-strategy).
- **Enterprise SSO/admin depth** — revisit when ≥10 accounts show expansion/PQL signals.
- **Task-tracker functionality** — integrate, don't replace (revisit: never as core).

## Dependencies & open risks
- DEP-01 — timezone/scheduling service must handle DST + per-member local time · blocks RMI-01.
- RSK-01 — teams keep the live sync (no focus-time win) · RSK-02 — storing PII-adjacent content (→ `_threads/Risk_Register.md`).

## Per-audience views
- **Exec** — OBJ-01/KR-01: the async-standup habit (RMI-01 + RMI-04) is the whole Now.
- **Team** — release slices + DEP-01 in `Release_Plan.md` (TODO).
- **Customer / Sales** — themes only, no dates: "async standups now; searchable notes next."

## Review cadence & change log
- Cadence: monthly review · quarterly re-plan.
- | Date | vX.Y | Change | Why | By |
  |---|---|---|---|---|
  | 2026-03-19 | v1.0 | Initial commit: RMI-01/04 Now; RMI-02 Next | G4 (DEC-04) | PM |

## Gate — G4 · Roadmap Commit
- Decision: **Persevere** — DEC-04 (2026-03-19).
- Checklist: Now/Next/Later not a Gantt ✓ · every Now item ties to OBJ-01 + OPP-01 ✓ · confidence decays Now→Later ✓ · capacity sanity-checked (Now ≈ 70% of one squad) ✓ · DEP-01 surfaced ✓ · read as intent not a date contract ✓.

---
*Owning skill:* **pm-phase-05-roadmap** · *Conventions:* ../../05_Conventions.md
