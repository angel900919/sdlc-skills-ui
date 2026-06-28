---
Document: Insight Synthesis — <PRODUCT_NAME> — <cycle YYYY-Qn>
Document ID: INSYN-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 14 · Customer Feedback Management. Owning skill: pm-phase-14-feedback.
This is the OUTER-LOOP READOUT for ONE cycle: the surviving FB-* themes mapped onto the
Opportunity Solution Tree as candidate OPP-*, ranked by IMPORTANCE (not raw frequency),
plus the loop-closing "you said → we did." One file PER cycle (date the title + the ID).
Companions: Feedback_Ops_Plan.md (program design) · Feedback_Log.md (the FB-* repository, Living).
Conforms to ../05_Conventions.md (§3 IDs FB-/OPP-/OBJ-/KR-/MET-/EXP-, §4 traceability spine,
§6 frontmatter, §7 outcomes-over-outputs).

DISCIPLINE — Themes are INSPIRATION mapped to opportunities, NOT a feature list to build.
Every theme cites a real sourced verbatim (from Feedback_Log.md) — never invent a quote, a
score, or a count. Rank by importance (segment/ARR/strategy), not loudness. A theme is "done"
only when a loop closed (product changed, traced to OPP-/MET-, AND/OR the customer was told).
Fill every <ANGLE_BRACKET> / resolve every "TODO:". Don't ship the example rows.
Status: Draft while synthesizing → flip to In Review for the cadence read-out.
-->

# Insight Synthesis — <PRODUCT_NAME> — <cycle YYYY-Qn>

> Outer-loop readout: *what the corpus is telling us this cycle, what it means for the
> opportunity space, and which loops we closed.* **Themes → opportunities, not orders.**

## BLUF
<!-- 2–3 sentences for leadership: the cycle's headline theme, the recommended move, the loop
status. Lead with the OBJ/KR it affects. -->
- <The headline this cycle, the recommended decision, what we told customers.>

## Cycle inputs
- **Corpus:** <channels + volume mined this cycle — full corpus, not a sample>.
- **Source repository:** `Feedback_Log.md` (`FB-` themes, sourced verbatims).
- **Outcome lens (OST root):** `OBJ-<nn>` / `KR-<nn>` — <the outcome these themes serve>.
- **Personas / jobs lens:** `PER-<nn>` · `JOB-<nn>` (`../03_Discovery/`).

---

## 1. Top themes this cycle — by importance, not raw count
<!-- Map each surviving FB-* onto the OST as a candidate OPP- under a desired outcome (JTBD lens).
Importance = segment/ARR/strategic fit, NOT the biggest number. Every theme carries a SOURCED
verbatim; an ungrounded theme is a hypothesis, not evidence — mark it TODO:. -->

| Rank | `FB-` | Theme (root cause) | → candidate `OPP-` | Under `OBJ/KR` | Importance basis (segment/ARR) | Count | Recommendation |
|---|---|---|---|---|---|---|---|
| 1 | FB-<nn> | <theme> | OPP-<nn> | OBJ-<nn>/KR-<nn> | <Enterprise · $<TODO>> | <n> | discovery interview / EXP-<nn> |
| 2 | FB-<nn> | <theme> | OPP-<nn> | OBJ-<nn> | <segment> | <n> | route to P06 prioritization |
| 3 | FB-<nn> | <theme> | TODO: frame OPP | <OBJ-nn> | <segment> | <n> | TODO: validate via interview |

**Sourced verbatims (one quote per ranked theme — quote the input, don't paraphrase):**
- FB-<nn> → OPP-<nn>: "<sourced quote>" — <source · segment · date>.
- FB-<nn> → OPP-<nn>: "<sourced quote>" — <source · segment · date>.

---

## 2. Frequency vs. importance — the explicit call
<!-- Make the trade-off visible: where a LOW-count high-value theme outranks a HIGH-count
low-value one. This is the human judgment AI cannot make. Show count AND value. -->
- <Why FB-<nn> (low count, enterprise/$<ARR>) outranks FB-<nn> (high count, free-tier).>
- TODO: <any contested ranking — owner — decide by>.

---

## 3. Map onto the Opportunity Solution Tree
<!-- Themes attach as candidate OPP- nodes under the desired outcome — the SAME OST from P04
(../04_Opportunity/Opportunity_Solution_Tree.md). Do not create a parallel tree. -->
```text
OUTCOME  OBJ-<nn> / MET-<nn>  <desired outcome>
  ├── OPP-<nn>  <opportunity from FB-<nn>>   ◀── evidence: FB-<nn> (verbatims)
  ├── OPP-<nn>  <opportunity from FB-<nn>>   ◀── evidence: FB-<nn>
  └── OPP-<nn>  TODO: <opportunity>          ◀── evidence: FB-<nn> (needs interview)
```
- **Routed to discovery/opportunity:** `../04_Opportunity/Opportunity_Solution_Tree.md` — candidate `OPP-` added <date>.
- **New discovery questions raised:** route to `../03_Discovery/` as `INS-`/interview targets.

---

## 4. Themes that should STOP a bet (Pivot / Kill)
<!-- Feedback that invalidates a live bet should stop it — set sunk cost aside (Conventions §2:
Pivot/Kill are valid outcomes). Don't bury an inconvenient signal. -->
| `FB-` | Bet it challenges (`RMI-`/`SOL-`) | Evidence | Recommended call |
|---|---|---|---|
| FB-<nn> | RMI-<nn> / SOL-<nn> | <verbatim + count + segment> | <Pivot / Kill> — log `DEC-<nn>` |
| — | — | <none this cycle> | — |

---

## 5. Loop closed — "you said → we did"
<!-- The classic failure is collect-without-telling. Show customers what changed. The human
owns the conversation; AI may draft/personalize replies. No "we shipped this" message ⇒ the
loop is NOT closed. -->

| `FB-` | Change shipped | Traced to | Customers told (channel · date) |
|---|---|---|---|
| FB-<nn> | <what changed> | OPP-<nn> / MET-<nn> | in-app + email · <YYYY-MM-DD> |
| FB-<nn> | <change> | <OPP-/MET-> | <channel · date> |
| FB-<nn> | TODO: not yet told | — | TODO: <owner — by when> |

---

## 6. Health-check verdict (continuous — no gate)
<!-- P14 owns no lifecycle gate; this is a recurring health check. Verdict vocabulary
(Conventions §2): Persevere · Persevere-with-actions · Pivot · Hold · Kill. -->
- Both loops live + SLA met + taxonomy governed + themes traced to `OPP-`/`MET-` + customers told ⇒ **healthy**.
- **Verdict:** <Persevere | Persevere-with-actions | Pivot | Hold | Kill> — recorded as `DEC-<nn>` in `_threads/Decision_Log.md`.
- **Owed before next cycle:** TODO: <gaps — owner — by when>.

---

## Change log
| Date | vX.Y | Change | By |
|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial synthesis for cycle <YYYY-Qn> | <name> |

---

### Links
- **Owning skill:** **pm-phase-14-feedback** — `../skills/pm-phase-14-feedback/SKILL.md`
- **Companion templates:** [Feedback_Ops_Plan.md](Feedback_Ops_Plan.md) (program design) · [Feedback_Log.md](Feedback_Log.md) (`FB-` repository, Living)
- **Routes to:** `../04_Opportunity/Opportunity_Solution_Tree.md` (candidate `OPP-`) · `../03_Discovery/Research_Insights.md` (`INS-`) · `../06_Prioritization/Prioritization_Matrix.md` (`FB-`+segment evidence) · `../13_Experiments/Experiment_Plan.md` (`EXP-` hypotheses)
- **Outcomes / metrics:** `../01_Strategy/North_Star_and_OKRs.md` (`OBJ-`/`KR-`) · `../12_Analytics/KPI_Scorecard.md` (`MET-`)
- **Decisions:** `../_threads/Decision_Log.md` (`DEC-` — Pivot/Kill/route calls)
- **Cross-cutting:** `../cross-cutting/Continuous_Discovery.md` · `../cross-cutting/Metrics_and_Experimentation.md`
- **Convention contract:** `../05_Conventions.md` · **Framework cards:** `../frameworks/` (Opportunity Solution Tree — Torres · JTBD)
