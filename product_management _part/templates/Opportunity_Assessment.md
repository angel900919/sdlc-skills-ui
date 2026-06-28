---
Document: Opportunity Assessment — <OPPORTUNITY>
Document ID: OPPASSESS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
WHAT THIS IS — The Phase 04 primary deliverable: a Cagan/SVPG 10-question opportunity
assessment + the four big risks (+ ethics) + both-or-nothing sizing, ending in a defensible
G3 Go/No-Go. It decides whether a *validated problem* (G2) is the right one to commit to NOW.

HOW TO USE — One assessment per SELECTED opportunity (OPP-* from Opportunity_Solution_Tree.md).
Answer every question in one line; "N/A — why" is allowed, a blank is not. Replace every
<ANGLE_BRACKET> or resolve "TODO: <owed — by whom — by when>". Never invent a market figure,
cost, score, or quote — a genuinely unknowable value is an ASM-*, not a fabricated number.

STATUS LIFECYCLE — Draft → In Review → Approved (G3-approved <YYYY-MM-DD>). Bump version on
material change (Conventions §6). Owning skill: pm-phase-04-opportunity.
Conforms to ../05_Conventions.md (§2 gate ladder + verdicts, §3 IDs, §4 spine, §6, §7).
-->

# Opportunity Assessment

> *AI drafts and red-teams this; a human owns the sizing assumptions, the risk ratings,
> ethics, strategy fit, and the go/no-go — and is accountable for it.*

---

## 0. The opportunity (anchor to the spine)

<!-- An opportunity is a customer NEED/PAIN/DESIRE, not a feature. If only one implementation
could address it, reframe one level up (Conventions §4). It MUST trace to evidence and an outcome. -->

- **Opportunity:** `OPP-<nn>` — <need / pain / desire in the customer's words>
- **Traces to evidence:** `INS-<nn>`, `JOB-<nn>`, `PER-<nn>` *(no opportunity without evidence)*
- **Serves outcome:** `OBJ-<nn>` / `KR-<nn>` → measured by `MET-<nn>` (or `MET-TBD`, owed to pm-phase-12-analytics)
- **Sponsor (defends the funded outcome):** `STK-<nn>` — <name / role>
- **Tailoring profile:** <Solo/Lean · Standard · Enterprise/Formal> *(sets the rigour below — see ../04_Tailoring_Guide.md)*

---

## 1. The 10 questions (Cagan / SVPG)

<!-- One line each. Terse and concrete. Tie claims to evidence IDs where they exist; mark gut
calls "TODO: validate". Q3 (size) is summarised here and detailed in §2. -->

| # | Question | Answer (one line) |
|---|---|---|
| 1 | **What problem** does this solve? *(the customer's problem, not ours)* | <…> |
| 2 | **For whom** — which segment / persona? | `PER-nn` — <segment> |
| 3 | **How big** is the opportunity? *(see §2 — both top-down AND bottom-up)* | <SOM range> |
| 4 | **Competing alternatives** — including status quo / "do nothing"? | <…> |
| 5 | **Why us** — why are we best placed to win it? | <unfair advantage / right to win> |
| 6 | **Why now** — what changed (tech, market, regulation, behaviour)? | <…> |
| 7 | **Go-to-market** — how will it reach the customer? | <channel> *(detailed later in pm-phase-11-launch)* |
| 8 | **How will we measure success** — what metric moves? | `MET-nn` — <metric: current → target> |
| 9 | **What factors are critical** to success (must-be-true)? | <…> |
| 10 | **Recommendation** — given all the above? | <see §5> |
| + | **Cost of NOT doing it** — risk if we pass? | <…> |

---

## 2. Sizing (to rank, NOT to forecast)

<!-- Compute BOTH top-down and bottom-up, then reconcile — the gap IS an insight. Top-down-only
is the #1 red flag. TAM is a CEILING, never revenue. State every assumption; mark missing market
figures "TODO: confirm via research" (cite report/figure/year). Sizing prioritises; it does not
lock a multi-year forecast. -->

| Method | Figure (range) | Key assumptions | Source / TODO |
|---|---|---|---|
| **TAM** (total) | <…> | <…> | TODO: cite source + year |
| **SAM** (serviceable, top-down) | <…> | <…> | TODO: research |
| **SOM** (obtainable, bottom-up = reach × value) | <#users> × <value/user> = <…> | <adoption %, price, frequency> | <…> |

- **Reconciliation (top-down vs bottom-up):** <the gap and what it tells us; use the smaller, defensible SOM>
- **Confidence:** <High / Medium / Low> — <why>

---

## 3. The four big risks (+ ethics) — rate Importance × Evidence

<!-- Name the load-bearing assumption per risk (ASM-*, owned by pm-phase-07). Rate Importance
(H/M/L: how badly are we wrong if it's false?) and Evidence (Strong/Weak: how much do we know?).
The HIGHEST-importance, LOWEST-evidence assumption is tested FIRST in P07/P13 — not the easiest.
Ethics is a FIRST-CLASS assumption (Torres's 5th type), never a footnote. An untested ethics
risk is a Hold, not a wave-through. -->

| Risk | Load-bearing assumption (`ASM-nn`) | Importance | Evidence | Test first? |
|---|---|---|---|---|
| **Value / desirability** — will they want it / switch? | `ASM-nn` — <…> | H/M/L | Strong/Weak | <Y/N → `EXP-nn`> |
| **Usability** — can they figure out how to use it? | `ASM-nn` — <…> | | | |
| **Feasibility** — can we build & run it (tech, data, time)? | `ASM-nn` — <…> | | | |
| **Business viability** — does it work for the business (legal, sales, finance, brand, ethics)? | `ASM-nn` — <…> | | | |
| **Ethics** — privacy / fairness / safety / EU AI Act exposure? | `ASM-nn` — <…> + log `RSK-nn` | | | |

> Riskiest assumptions become experiments (`EXP-*`) on the Opportunity_Solution_Tree.md and are
> de-risked in pm-phase-07-solution-design. The privacy/accessibility/safety floor is non-negotiable.

---

## 4. Strategy fit

<!-- Coherence check, not a formality. If it serves no OBJ/KR, that's strategy drift — a likely
No-Go, not a reason to invent a fit. -->

- **Outcome alignment:** serves `OBJ-<nn>` / `KR-<nn>` — <how directly>
- **Coherence with `../01_Strategy/Product_Strategy.md` (Rumelt diagnosis):** <does it attack the named obstacle?>
- **Two-way or one-way door?** <Reversible (decide fast / lean) | Irreversible (fuller case + sponsor sign-off)>
- **Portfolio fit** *(multi-product):* <stage / where it sits — ../cross-cutting/Portfolio_Management.md>

---

## 5. Recommendation & G3 decision

<!-- Recommend a call AND state what would change it (two-way-door bias: prefer reversible bets).
The verdict words are EXACTLY these five (Conventions §2). The human decides and signs. -->

- **Recommendation:** <Persevere | Persevere-with-actions | Pivot | Hold | Kill>
- **Rationale (evidence, in one paragraph):** <…>
- **What would change this call:** <the signal/threshold that flips it>
- **If Persevere-with-actions:** open items + owners + due dates → <…>
- **If Pivot:** loop back to <pm-phase-03-discovery (segment/problem) | pm-phase-01-strategy (fit)> — <what changes>
- **If Kill / park:** the learning to salvage + what would reopen it → <…>

### G3 exit-gate checklist *(verbatim from ../checklists/gate-reviews.md — that file wins on conflict)*
- [ ] Opportunity placed on the Opportunity Solution Tree under a desired outcome (`OPP-*` → `OBJ/KR`).
- [ ] Sized (reach × value) with stated assumptions; not a TAM-as-forecast error.
- [ ] Four big risks named and rated (value/desirability, usability, feasibility, business-viability) + ethics.
- [ ] Business case / ROI sketched at the right rigour for the tailoring profile; viability addressed.
- [ ] A clear Go / No-Go / Pivot decision, with what would change the call.

- **Decision logged:** `DEC-<nn>` in `../_threads/Decision_Log.md` and `../WORKFLOW.md` gate log *(an unrecorded gate is a failed gate)*
- **Six-thread review run:** <Y/N — ../checklists/gate-reviews.md>

---

### Links
- **Owning skill:** pm-phase-04-opportunity — `../skills/pm-phase-04-opportunity/SKILL.md`
- **Sibling deliverables:** [Opportunity_Solution_Tree.md](Opportunity_Solution_Tree.md) · [Business_Case.md](Business_Case.md)
- **Upstream:** `../03_Discovery/Research_Insights.md` · `JTBD.md` · `Personas.md` · `../01_Strategy/North_Star_and_OKRs.md` · `../02_Market/Market_Analysis.md` · `../00_Charter/Stakeholder_Map.md`
- **Downstream:** `../07_Solution/Assumption_Map.md` (tests `ASM-*`) · `../05_Roadmap/Roadmap.md` (on Persevere)
- **Threads:** `../_threads/Decision_Log.md` · `../cross-cutting/Responsible_Product.md` (ethics/`RSK-*`)
- **Convention contract:** `../05_Conventions.md` · **Framework cards:** `../frameworks/` (SVPG Opportunity Assessment · Four Big Risks · Five Assumptions · TAM/SAM/SOM)
