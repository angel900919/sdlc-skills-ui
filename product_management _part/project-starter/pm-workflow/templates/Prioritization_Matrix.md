---
Document: Prioritization Matrix — <PRODUCT_NAME>
Document ID: PRIOR-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <PM name / role>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 06 Prioritization. Owning skill: pm-phase-06-prioritization.
This is a BLANK, reusable fill-in. Replace every <ANGLE_BRACKET> placeholder and resolve every "TODO:".
Conforms to ../05_Conventions.md (IDs §3, priority labels P0–P3 / MoSCoW §5.2, status §6, outcomes-over-outputs §7, framework citations §8).
P06 owns NO lifecycle gate — it is a SUPPORTING decision aid. Its output is reviewed inside G4 Roadmap Commit (P05) and G6 PRD Approved (P08).
STATUS: starts as `Draft`; once you maintain it on a re-prioritization cadence, flip to `Living` and bump the minor version each re-run.
"TABS": this file is one model run. Pick ONE primary scoring model via the chooser, fill only that tab, leave the rest blank/illustrative.
       Pairing a categorical model (Kano OR MoSCoW) WITH a scoring model is encouraged. When ported to a spreadsheet/Notion, each tab below is a literal sheet.
GOLDEN RULES: rank against an OUTCOME (OBJ/KR), not "good ideas" · compare at ONE level (OPP vs OPP, or SOL vs SOL) · FILTER then rank ·
       Confidence is explicit · every score cites a source (MET-/FB-/INS-) or a TODO · never invent a reach/impact number · the score informs, the human decides.
-->

# Prioritization Matrix — <PRODUCT_NAME>

*One-line decision this run answers:* TODO: e.g. "what to discover next" / "what to build next" / "how to sequence the committed bets" / "where to cut the MVP line".

**Owning skill:** `pm-phase-06-prioritization` · **Conventions:** `../05_Conventions.md`
**Decision type:** <what-to-discover | what-to-build | what-to-sequence | MVP-scope-cut>
**Candidate level (pick ONE — never mix):** <OPP-* opportunities | SOL-* solutions/bets | RMI-* roadmap items>

---

## 1. Outcome we are prioritizing against
<!-- You prioritize AGAINST an outcome, never against a wish-list. If no OBJ/KR is named, STOP and resolve it first (un-anchored prioritization is theatre). -->

- **Objective:** `OBJ-<nn>` — <the outcome we are pursuing>
- **Key Result:** `KR-<nn>` — <measurable target, e.g. "metric X from A → B by date">
- **North Star / guiding metric:** `MET-<nn>` — <name>
- **Strategic context (1–2 lines):** TODO: which strategy bet / segment does this serve? <…>

> If un-anchored: `OBJ-TBD` + TODO: confirm with strategy owner which Objective this ranking serves *before* scoring.

---

## 2. Candidate set
<!-- Pull from the source of truth and compare at ONE abstraction level. Confirm the list with stakeholders; don't silently add or drop. Sources: Opportunity_Solution_Tree (P04), Roadmap (P05), Assumption_Map (P07), Feedback_Log (P14). -->

| ID | Candidate (problem/opportunity or bet) | Source artifact | Tied to OPP/OBJ | Notes |
|---|---|---|---|---|
| `OPP-<nn>` | <candidate> | <Opportunity_Solution_Tree.md> | `OBJ-<nn>` | <…> |
| `OPP-<nn>` | <candidate> | <…> | `OBJ-<nn>` | <…> |
| `SOL-<nn>` | <bet, only once the opportunity is committed> | <…> | `OPP-<nn>` | <…> |

<!-- Reminder: rank the OPPORTUNITY space first; only rank SOL-* under a chosen, committed opportunity. Mixing OPP and SOL in one table is the most common error. -->

---

## 3. Framework chooser
<!-- Match the model to the decision and team maturity. Default = RICE. If two frameworks disagree, that disagreement IS the insight — investigate, don't average. -->

| If your situation is… | Use this model | Jump to |
|---|---|---|
| General initiative ranking; you have reach data + many comparable bets | **RICE** | Tab A |
| Early/fast, little data, need a quick gut-checked score | **ICE** | Tab B |
| Timing / cost-of-delay dominates; sequencing time-critical work | **WSJF / Cost of Delay** *(gameable; biased against platform work — not the house default)* | Tab C |
| Many stakeholders; need an auditable, weighted trail (defuse a HiPPO fight) | **Weighted Scoring** | Tab D |
| Shaping a satisfaction strategy (what delights vs. what's table-stakes) | **Kano** *(categorical — pair with a scoring model)* | Tab E |
| Cutting an MVP scope line against a fixed deadline | **MoSCoW** *(categorical — the Label column IS the deliverable)* | Tab F |
| Fast triage of a small set | **Value-vs-Effort 2×2** *(see Tab F note / other models)* | — |
| Finding under-served outcomes (importance vs. satisfaction) | **Opportunity Scoring** (Ulwick/ODI) | — |

**Model chosen for THIS run:** TODO: `<RICE | ICE | WSJF | Weighted | Kano | MoSCoW>`  · **paired categorical (optional):** `<none | Kano | MoSCoW>`
**Why this model (1 line):** TODO: <…>

---

## 4. Filter (categorical — applied BEFORE scoring)
<!-- Filter-then-rank beats one mega-formula. Drop anything that fails strategy fit OR the non-negotiable Responsible-Product floor (privacy / accessibility / security / ethics). Filtered-out items are RECORDED with a reason, never deleted. A high score must never launder an item that shouldn't ship at all — raise an RSK-<nn> instead. -->

| Candidate | Strategy fit? | Responsible-Product floor (privacy/a11y/security/ethics)? | Kept? / Reason dropped |
|---|---|---|---|
| `OPP-<nn>` | <Yes / No — why> | <Pass / Fail — which dimension> | <Kept> |
| `OPP-<nn>` | <No (off-strategy)> | <—> | <Dropped: not in this OBJ> |
| `OPP-<nn>` | <Yes> | <Fail — privacy> | <Dropped → raised `RSK-<nn>`> |

> Only survivors are scored below.

---

## 5. Scoring tabs
<!-- Fill ONLY the tab for the model you chose in §3 (optionally one categorical tab too). Leave the others as blank reference. Invest in the ESTIMATES, not decimal places — false precision (e.g. 3247.8) is an anti-pattern. -->

### Tab A — RICE
<!-- RICE = (Reach × Impact × Confidence) ÷ Effort. Intercom. A structuring tool, not a hard rule. -->
*Scales:* Reach = # of <users/events> per <time window> (cite source). Impact = `3` massive · `2` high · `1` medium · `0.5` low · `0.25` minimal. Confidence = `100% / 80% / 50%` (high/med/low). Effort = person-<weeks/months>.

| ID | Candidate | Reach (src) | Impact (src) | Confidence (basis) | Effort | **RICE** | Label |
|---|---|---|---|---|---|---|---|
| `OPP-<nn>` | <candidate> | <8k/qtr> (`MET-<nn>`) | <2.0> (`INS-<nn>`) | <80%> (<basis>) | <4> | **<= R×I×C÷E>** | <P0 / Must> |
| `OPP-<nn>` | <candidate> | <1k/qtr> (`MET-<nn>`) | <1.5> (est.) | <50%> (TODO: validate) | <2> | **<…>** | <P2 / Could> |

<!-- Every Reach/Impact cell cites MET-/FB-/INS- or carries a TODO. Never fabricate a reach number — mark `TODO: pull reach from analytics`. A low-confidence row is a flag to run discovery (P03) or an EXP-<nn>, not to guess louder. -->

### Tab B — ICE
<!-- ICE = Impact × Confidence × Ease. Lightweight/fast triage for early teams with little data. Each 1–10. -->
*Scales:* Impact, Confidence, Ease each `1–10`.

| ID | Candidate | Impact (1–10) | Confidence (1–10) | Ease (1–10) | **ICE** | Label |
|---|---|---|---|---|---|---|
| `OPP-<nn>` | <candidate> | <…> | <…> | <…> | **<= I×C×E>** | <P1 / Should> |

### Tab C — WSJF / Cost of Delay
<!-- WSJF = Cost of Delay ÷ Job Size. SAFe / Reinertsen. CoD = User-Business Value + Time Criticality + Risk-Reduction/Opportunity-Enablement. Use relative scoring (e.g. Fibonacci 1,2,3,5,8,13,20). USE ONLY for genuinely time-critical sequencing — it is gameable and biased against platform/enablement work; protect those bets. -->
*Scales:* each component relative (1–20). Job Size = relative effort/duration.

| ID | Candidate | User-Business Value | Time Criticality | Risk Red. / Opp. Enablement | **CoD** (sum) | Job Size | **WSJF** | Label |
|---|---|---|---|---|---|---|---|---|
| `SOL-<nn>` | <bet> | <…> | <…> | <…> | **<sum>** | <…> | **<= CoD÷Size>** | <P0 / Must> |

### Tab D — Weighted Scoring
<!-- Many stakeholders, auditable trail. Define criteria + weights (weights sum to 100%), score each candidate per criterion, take the weighted sum. This is the antidote to HiPPO: transparent, shared, named criteria. -->
*Define criteria & weights first (edit columns to taste):*

| Criterion | Weight (%) | Direction | Scale |
|---|---|---|---|
| <Outcome impact> | <30> | higher better | <1–5> |
| <Strategic fit> | <20> | higher better | <1–5> |
| <Reach / # affected> | <20> | higher better | <1–5> |
| <Confidence / evidence> | <15> | higher better | <1–5> |
| <Effort / cost> | <15> | lower better (invert) | <1–5> |
| **Total** | **100** | | |

*Score the candidates:*

| ID | Candidate | <C1> | <C2> | <C3> | <C4> | <C5> | **Weighted total** | Label |
|---|---|---|---|---|---|---|---|---|
| `OPP-<nn>` | <candidate> | <…> | <…> | <…> | <…> | <…> | **<Σ wᵢ·sᵢ>** | <P1 / Should> |

### Tab E — Kano (categorical — pair with a scoring model)
<!-- Noriaki Kano. Classify each candidate by how its presence/absence affects satisfaction. Gather via the functional/dysfunctional question pair; optionally compute satisfaction (CS+) and dissatisfaction (CS−) coefficients. DATE THIS PASS — delighters decay to table-stakes; re-run every ~12–18 months. -->
*Categories:* `Basic/Must-be` · `Performance/One-dimensional` · `Delighter/Attractive` · `Indifferent` · `Reverse` · `Questionable`.

| ID | Candidate | Functional response | Dysfunctional response | **Kano category** | CS+ / CS− (opt.) | Strategy implication |
|---|---|---|---|---|---|---|
| `OPP-<nn>` | <candidate> | <…> | <…> | <Delighter> | <…> | <invest to differentiate> |
| `OPP-<nn>` | <candidate> | <…> | <…> | <Basic> | <…> | <must-have, no delight ROI> |

*Kano pass dated:* <YYYY-MM-DD> · *next re-run due:* <YYYY-MM-DD>

### Tab F — MoSCoW (categorical — for fixed-deadline MVP scoping)
<!-- The Label column IS the deliverable. Map per Conventions §5.2: Must→P0 · Should→P1 · Could→P2 · Won't→out-of-scope (RECORD it, don't silently drop). Keep "Must" lean — if everything is Must, nothing is. -->

| ID | Candidate | **MoSCoW** | Priority (§5.2) | Rationale | In MVP? |
|---|---|---|---|---|---|
| `SOL-<nn>` | <bet> | <Must> | <P0> | <without this the outcome can't move> | <Yes> |
| `SOL-<nn>` | <bet> | <Should> | <P1> | <…> | <Yes/No> |
| `SOL-<nn>` | <bet> | <Could> | <P2> | <…> | <No> |
| `SOL-<nn>` | <bet> | <Won't (this cycle)> | <out-of-scope> | <recorded, revisit <date>> | <No> |

<!-- Other models (no dedicated tab): Value-vs-Effort 2×2 = plot value (y) vs effort (x); quick-wins = high-value/low-effort. Opportunity Scoring (Ulwick/ODI) = score Importance + max(Importance − Satisfaction, 0) to surface under-served outcomes. -->

---

## 6. Sensitivity check (MANDATORY)
<!-- Re-run with the MOST UNCERTAIN input swung ±1 band (or re-weight the heaviest criterion). Record whether the TOP of the list FLIPS. A ranking that survives is robust; one that flips on a single soft estimate is FRAGILE — say so, and tighten that estimate (discovery / EXP-) before deciding. -->

| Input swung | From → To | Top of ranking holds? | Verdict |
|---|---|---|---|
| <`OPP-<nn>` Confidence> | <80% → 50%> | <holds> | **Robust** |
| <`OPP-<nn>` Impact> | <1.5 → 3.0> | <`OPP-<nn>` jumps to P1> | **Fragile** — tighten estimate first |

---

## 7. Ranking & labels (result)
<!-- Stack-rank by PRIORITY (Top-N), then assign P0–P3 / MoSCoW per §5.2. Top-N priority stack-ranking is endorsed; people stack-ranking is not. -->

| Rank | ID | Candidate | Score | **Label (P0–P3 / MoSCoW)** | Carries metric |
|---|---|---|---|---|---|
| 1 | `OPP-<nn>` | <candidate> | <…> | <P0 / Must> | `MET-<nn>` |
| 2 | `OPP-<nn>` | <candidate> | <…> | <P1 / Should> | `MET-<nn>` / `MET-TBD` |
| 3 | `OPP-<nn>` | <candidate> | <…> | <P2 / Could> | `MET-TBD` |

---

## 8. Recommendation, decision & rationale (BLUF)
<!-- State the call in plain language: what to do, the trade-off (what we are NOT doing), and the ask (decision + from whom). The output of this phase is a DECISION, not a longer backlog. Pivot and Kill are valid outcomes. The score INFORMS; you decide and own it. -->

**Recommendation:** TODO: e.g. "Do `OPP-<nn>` now (P0); defer `OPP-<nn>` pending an experiment; kill `OPP-<nn>` (off-strategy)."

- **Trade-off (what we are NOT doing):** <…>
- **Why (the rationale, not the arithmetic):** <strategy + evidence that drove the call> — cite `INS-<nn>` / `FB-<nn>` / `MET-<nn>`.
- **Confidence in this call:** <high / med / low> — <what would change it>
- **Ask / decision needed:** <decision> from <role/stakeholder> by <YYYY-MM-DD>.
- **Low-confidence items routed to validation:** `EXP-<nn>` / discovery (P03) — TODO: <which>.
- **Outcome of this decision (Conventions §2 vocab):** <Persevere | Persevere-with-actions | Pivot | Hold | Kill>

**Logged as:** `DEC-<nn>` in `_threads/Decision_Log.md` (see `Decision_Log.md` template).
**Chosen bet(s) carry:** `MET-<nn>` (the metric that defines "done" per §7 outcomes-over-outputs).
**Re-prioritization cadence:** <e.g. every quarter / blank-slate re-run / Kano every 12–18 months> — next run due <YYYY-MM-DD>.

---

## 9. Done-when (health check — no gate)
<!-- P06 owns no gate; this is a done-when list. The result is carried into G4 (Roadmap) and G6 (PRD scope), where it is reviewed. -->

- [ ] Anchored to a named `OBJ-<nn>` / `KR-<nn>` (not "good ideas").
- [ ] Candidates compared at ONE level (OPP vs OPP, or SOL vs SOL).
- [ ] Categorical filter applied before scoring; dropped items recorded with a reason; Responsible-Product floor enforced (fails → `RSK-<nn>`).
- [ ] A model chosen *with* stakeholders and matched to the decision; every score has a derivable, cited basis (or a `TODO`).
- [ ] Confidence explicit on every row; low-confidence items flagged for discovery / `EXP-<nn>`.
- [ ] Sensitivity run; fragile (flipping) rankings called out and tightened.
- [ ] Priority labels (P0–P3 / MoSCoW) assigned; recommendation states the trade-off (BLUF) and is logged as `DEC-<nn>`.
- [ ] Chosen bet carries a `MET-<nn>`; re-prioritization cadence noted; no fabricated reach/impact numbers.

---

## Related templates & skill
- **Owning skill:** `pm-phase-06-prioritization` (its "Deliverables & output shapes" is the structural source).
- **Feeds →** `Roadmap.md` (P05, Now/Next/Later) · `PRD.md` (P08, MVP scope line).
- **Consumes ←** `North_Star_and_OKRs.md` (P01, `OBJ`/`KR`/`MET`) · `Opportunity_Solution_Tree.md` & `Opportunity_Assessment.md` (P04, `OPP-*`) · `Assumption_Map.md` (P07, `SOL`/`ASM`) · `Feedback_Log.md` (P14, `FB-*`).
- **Logs to →** `Decision_Log.md` (`DEC-*`) · `Risk_Register.md` (`RSK-*`).
- **Conventions:** `../05_Conventions.md` · **Frameworks map:** `../03_Frameworks_Map.md`.
