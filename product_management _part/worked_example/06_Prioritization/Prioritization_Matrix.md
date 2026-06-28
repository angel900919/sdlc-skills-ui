---
Document: Prioritization Matrix — Cadence
Document ID: PRIOR-cadence-v1.0
Status: Approved (informs G4-approved 2026-03-19)
Owner: Product Manager
Updated: 2026-03-17
---

# Prioritization Matrix — Cadence

*One-line decision this run answers:* which **opportunity** to build first for OBJ-01 (grow Weekly Active Teams).

**Owning skill:** `pm-phase-06-prioritization` · **Conventions:** ../../05_Conventions.md
**Decision type:** what-to-build
**Candidate level:** `OPP-*` opportunities (compared at one level — no SOL/OPP mixing)

---

## 1. Outcome we are prioritizing against
- **Objective:** `OBJ-01` — make async standups the default for distributed teams.
- **Key Result:** `KR-01` — Weekly Active Teams 0 → 120 by 2026-09-30.
- **North Star:** `MET-01` — Weekly Active Teams (≥3 standups/wk).
- **Strategic context:** win the daily habit first (Product_Strategy §2), then own the record.

---

## 2. Candidate set
| ID | Candidate (opportunity) | Source artifact | Tied to OBJ | Notes |
|---|---|---|---|---|
| `OPP-01` | Stay aligned across timezones w/o off-hours meeting | Opportunity_Solution_Tree.md | `OBJ-01` | the core switch |
| `OPP-02` | Find what we decided last week (searchable notes) | Opportunity_Solution_Tree.md | `OBJ-01` | strong, distinct |
| `OPP-03` | Stop compiling status to report up | Opportunity_Solution_Tree.md | `OBJ-01` | rides on the digest |

---

## 3. Framework chooser
**Model chosen for THIS run:** `RICE` · **paired categorical:** `none`
**Why this model (1 line):** three comparable opportunities, reach estimable from the target segment; RICE keeps the call auditable.

---

## 4. Filter (categorical — applied BEFORE scoring)
| Candidate | Strategy fit? | Responsible-Product floor? | Kept? / Reason |
|---|---|---|---|
| `OPP-01` | Yes — the core habit | Pass (privacy handled in P07 ASM-05) | Kept |
| `OPP-02` | Yes — owns the record | Pass | Kept |
| `OPP-03` | Yes — but downstream of the habit | Pass | Kept |

---

## 5. Scoring tabs

### Tab A — RICE
*Scales:* Reach = target distributed teams reachable / quarter (illustrative). Impact: 3 massive · 2 high · 1 medium · 0.5 low. Confidence: 100/80/50%. Effort = person-weeks.

| ID | Candidate | Reach (src) | Impact (src) | Confidence (basis) | Effort | **RICE** | Label |
|---|---|---|---|---|---|---|---|
| `OPP-01` | Async standup | 2,000/qtr (illustrative; waitlist) | 3.0 (INS-01/04/05; opp.score 7.3) | 80% (EXP-01 passed) | 8 | **(2000×3×0.8)/8 = 600** | P0 / Must |
| `OPP-02` | Searchable notes | 2,000/qtr | 2.0 (INS-02) | 50% (not yet validated) | 6 | **(2000×2×0.5)/6 = 333** | P1 / Should |
| `OPP-03` | Status roll-up | 1,400/qtr (leads only) | 1.0 (INS-03) | 50% | 4 | **(1400×1×0.5)/4 = 175** | P2 / Could |

<!-- Reach is illustrative (waitlist-derived); not a fabricated external market stat. OPP-02 confidence 50% → flagged for discovery before commit. -->

---

## 6. Sensitivity check (MANDATORY)
| Input swung | From → To | Top of ranking holds? | Verdict |
|---|---|---|---|
| `OPP-02` Confidence | 50% → 80% | OPP-02 → 533, still < OPP-01 (600) | **Robust** |
| `OPP-01` Impact | 3.0 → 2.0 | OPP-01 → 400, still #1 | **Robust** |

---

## 7. Ranking & labels (result)
| Rank | ID | Candidate | Score | **Label** | Carries metric |
|---|---|---|---|---|---|
| 1 | `OPP-01` | Async standup | 600 | P0 / Must | `MET-01` |
| 2 | `OPP-02` | Searchable notes | 333 | P1 / Should | `MET-TBD` |
| 3 | `OPP-03` | Status roll-up | 175 | P2 / Could | `MET-TBD` |

---

## 8. Recommendation, decision & rationale (BLUF)
**Recommendation:** Build `OPP-01` now (P0, → RMI-01/04); put `OPP-02` Next pending a discovery spike on search demand; defer `OPP-03` to Later.

- **Trade-off (what we are NOT doing):** no searchable-notes or status-roll-up build this cycle — the habit must land first.
- **Why:** OPP-01 has the highest opportunity score *and* the only validated desirability evidence (EXP-01); it is also the activation + growth event, so it compounds. Cite INS-01, INS-04, EXP-01.
- **Confidence:** high — would change only if EXP-01 reversed.
- **Ask / decision needed:** confirm Now scope at G4 — from PM + Eng lead, by 2026-03-19.
- **Low-confidence items routed to validation:** OPP-02 → discovery spike (P03) before its decision date 2026-06-30.
- **Outcome (Conventions §2):** **Persevere**.

**Logged as:** `DEC-04` in `_threads/Decision_Log.md` (the same call recorded at G4 Roadmap Commit).
**Chosen bet carries:** `MET-01`.
**Re-prioritization cadence:** quarterly — next run due 2026-06-30.

---

## 9. Done-when (health check)
- [x] Anchored to `OBJ-01` / `KR-01`.
- [x] Candidates compared at one level (OPP vs OPP).
- [x] Filter applied; Responsible-Product floor enforced.
- [x] RICE chosen with stakeholders; every score cites a source or illustrative basis.
- [x] Confidence explicit; OPP-02 routed to discovery.
- [x] Sensitivity run; ranking robust.
- [x] Labels assigned; logged as DEC-04; chosen bet carries MET-01.

---

## Related templates & skill
- **Feeds →** [../05_Roadmap/Roadmap.md](../05_Roadmap/Roadmap.md) · [../08_PRD/PRD.md](../08_PRD/PRD.md)
- **Consumes ←** [../01_Strategy/North_Star_and_OKRs.md](../01_Strategy/North_Star_and_OKRs.md) · [../04_Opportunity/Opportunity_Solution_Tree.md](../04_Opportunity/Opportunity_Solution_Tree.md)
- **Conventions:** ../../05_Conventions.md
