---
name: pm-phase-04-opportunity
description: Runs Phase 04 (Opportunity Assessment & Business Case) — the converge-on-the-problem gate that turns a validated problem (Phase 03) into a sized, de-risked, strategy-fit opportunity worth solving NOW, or kills/parks it cheaply before the roadmap. It interviews the user one topic at a time to place the opportunity on an Opportunity Solution Tree under a desired outcome, size it (reach × value, top-down AND bottom-up), name and rate the four big risks plus ethics (Torres's five assumption types), sketch a lean assumption-driven business case, and make a defensible Go / No-Go / Pivot call. It produces a living Opportunity_Solution_Tree.md, an Opportunity_Assessment.md (SVPG 10-question), and a lean Business_Case.md — each with Conventions §6 frontmatter — and seeds OPP-* into the traceability spine. Conforms to ../../05_Conventions.md. Use when a problem is validated and you must decide whether it's the right one to commit to. Triggers on "assess this opportunity", "is this worth building", "should we solve this problem", "size the opportunity", "TAM/SAM/SOM for this", "build the business case", "opportunity solution tree / OST", "name the four big risks", "run the opportunity assessment", "go/no-go on this", "which problem should we solve next", "phase 4", "G3".
disable-model-invocation: true
user-invocable: true
---

# Phase 04 — Opportunity Assessment & Business Case

<what-to-do>

Turn a *validated problem* (from [pm-phase-03-discovery]) into a **sized, de-risked, strategy-fit opportunity worth committing to now** — or **No-Go / Pivot / park it cheaply** and keep the learning. This is the Double Diamond's *converge-on-the-problem* point: discovery is cheap, delivery is expensive, so this gate exists to stop the wrong build *before* it enters the roadmap. You leave with a living **Opportunity Solution Tree**, an **Opportunity Assessment**, and a **lean Business Case**, plus an `OPP-*` node wired into the traceability spine ([Conventions §4](../../05_Conventions.md)). The exit gate is **G3 · Opportunity Go/No-Go** — decisions **Persevere · Persevere-with-actions · Pivot · Hold · Kill** ([Conventions §2](../../05_Conventions.md)). This phase conforms in full to **Conventions** — phases **§1**, gate ladder **§2**, IDs **§3**, traceability spine **§4**, status/frontmatter **§6**, outcomes-over-outputs **§7** — and never redefines them.

**When this phase applies.** Run it for any **new bet** the moment a problem survives G2 — a fresh 0→1 idea, a major feature, or a new `OPP-*` thrown up by the P12–P15 loop ([Overview §4](../../01_Workflow_Overview.md)). A well-understood, already-validated change can re-enter at [pm-phase-08-prd] instead. Right-size the rigour to the tailoring profile (Solo/Lean → a one-page assessment + back-of-envelope case; Enterprise/Formal → full sizing, sensitivity ranges, sponsor sign-off) — see [`../../04_Tailoring_Guide.md`](../../04_Tailoring_Guide.md). The opportunity space is a **living layer**, not a one-time doc: the OST is `Living` and revisited every discovery cycle.

## Inputs (from prior phases)
Read these from the product folder if present; otherwise elicit and **flag the source**. Never fabricate to fill a blank → mark `TODO: <owed — by whom — by when>`.
- **Validated problem evidence** — `Research_Insights.md` (`INS-*`), `Personas.md` (`PER-*`), `JTBD.md` (`JOB-*`) from [pm-phase-03-discovery]. **If the problem isn't validated (G2 not passed) → send it back**; you cannot assess an opportunity built on zero evidence.
- **Strategy & outcomes** — `North_Star_and_OKRs.md` (`OBJ-*`/`KR-*`) and `Product_Strategy.md` from [pm-phase-01-strategy]. Every opportunity must hang under a desired outcome; if none fits, that's a strategy-fit signal, not a reason to invent one.
- **Market sizing inputs** — `Market_Analysis.md` (TAM/SAM/SOM), `Competitive_Analysis.md`, `Positioning_Brief.md` from [pm-phase-02-market-research]. If absent, trigger web research (below) and keep the case at `TODO` until sized.
- **Stakeholders & sponsor** — `Stakeholder_Map.md` (`STK-*`) from [pm-phase-00-charter]; you need a named sponsor who will defend the funded outcome.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic — never a wall of questions). Use `AskUserQuestion` for finite choices. **Show back** each answer in your words and get confirmation before moving on. Reuse every fact already captured; never re-ask. Mark unknowns `TODO:`; never invent a number, date, quote, or market figure.

1. **Anchor to the outcome** (one message). Confirm which `OBJ/KR` this opportunity serves. If it serves none, surface the strategy-fit gap now — a no-fit opportunity is a likely No-Go regardless of size.
2. **Frame the opportunity, not a solution.** State it as a customer need/pain/desire in their words, traced to `INS-*`/`JOB-*`. The litmus test: *if there's only one way to address it, it's a solution masquerading as an opportunity* — reframe one level up. Assign `OPP-nn`.
3. **Place it on the Opportunity Solution Tree.** Outcome → opportunity → 2–3 candidate solutions (seed `SOL-*`, owned by [pm-phase-07-solution-design]) → experiments. **Compare 2–3 solutions** — one-solution-per-opportunity is an anti-pattern. Write `Opportunity_Solution_Tree.md` (`Living`).
4. **Size it — both-or-nothing.** Reach × value, **top-down AND bottom-up**, reconciled, with assumptions stated. Top-down-only is the #1 red flag. Sizing is to *rank/prioritise*, **not** to lock a multi-year forecast (TAM is a ceiling, never revenue). Trigger market web research if inputs are missing.
5. **Run the four big risks (+ ethics).** Name and rate each: **value/desirability · usability · feasibility · business-viability**, plus **ethics** (Torres's 5th assumption type — now first-class). For each, capture the load-bearing assumption (`ASM-*`, owned by P07) and its importance × evidence; the riskiest get tested first in P07.
6. **Sketch the lean business case.** Costs, the value/ROI logic, and viability at the right rigour for the tailoring profile. Use **ranges and sensitivity**, not false-precision multi-year ROI. State the value metric and how the win will be measured (`MET-TBD`, owned by [pm-phase-12-analytics]). Write `Business_Case.md`.
7. **Write the assessment & recommend.** Fill `Opportunity_Assessment.md` (SVPG 10-question). Recommend a call **and what would change it** (two-way door bias: prefer reversible bets). The AI drafts and red-teams; the **human decides**.
8. **Record the G3 decision & sign-off.** `AskUserQuestion`: **Persevere · Persevere-with-actions · Pivot · Hold · Kill**. Log it in `WORKFLOW.md`'s gate log and `_threads/Decision_Log.md` (`DEC-nn`), with evidence and the OST node. Run the six-thread review ([gate-reviews.md](../../checklists/gate-reviews.md)).
9. **Done.** Print every output path and the verdict, then name the next command: on **Persevere** → [pm-phase-05-roadmap] to commit the outcome (with [pm-phase-06-prioritization] as the ranking aid); on **Pivot** → loop back to the phase that owns the changed decision ([pm-phase-03-discovery] for segment/problem, [pm-phase-01-strategy] for strategy fit); on **Kill** → log the learning and salvage the reusable evidence.

## Decision points
- **Is it an opportunity or a disguised solution?** *How to decide:* if only one implementation could address it, it's a solution — reframe to the underlying need/job. A real opportunity admits 2–3 candidate solutions on the OST.
- **Top-down vs bottom-up sizing.** *How to decide:* compute **both**; reconcile the gap (the gap *is* an insight). Use the smaller, defensible SOM with stated assumptions. Reject a case sized top-down only.
- **Which risk to worry about.** *How to decide:* rate all four risks (+ ethics) by importance × evidence; the **highest-importance, lowest-evidence** assumption is what P07 tests first — not the easiest one. An untested ethics assumption is a Hold, not a footnote.
- **Business-case rigour.** *How to decide:* match the tailoring profile and reversibility. Two-way-door bet → lean one-pager, decide fast. One-way-door / large capital → fuller case with sensitivity. Never demand multi-year precise ROI for a reversible bet.
- **G3 verdict.** *How to decide:* sized + four risks named + viability addressed + strategy-fit + a clear call → **Persevere**. Minor gaps with owners+dates → **Persevere-with-actions**. Evidence says change segment/problem/solution/model/channel → **Pivot** (loop to the owning phase). Blocking gap → **Hold**. Viability/desirability/strategy-fit fails → **Kill or park** (and say what would reopen it).

## Rules
- **Conform to Conventions, never redefine** — phases §1, gate ladder & the five verdict words §2, IDs (`OPP-`/`OBJ`/`KR`/`SOL`/`ASM`/`MET`/`RSK`/`DEC`/`STK`) §3, the traceability spine §4, status/frontmatter §6.
- **Outcomes over outputs** ([Conventions §7](../../05_Conventions.md)). An opportunity that doesn't trace to an `OBJ/KR` and a `MET` has failed this gate. Nothing enters the roadmap without an opportunity; no opportunity without evidence.
- **It is a gate, not a doc-filling exercise.** **Pivot and Kill are valid, valuable outcomes** — the cheapest failed build is the one this gate stopped. If nothing here is ever parked or killed, you're rubber-stamping.
- **AI accelerates; the human decides.** AI drafts the assessment, sizing, and case and red-teams them; a human owns sizing assumptions, the four-risk ratings, ethics, strategy fit, and the go/no-go — and is accountable.
- **Never invent** ([Conventions §11](../../05_Conventions.md)). Every missing market figure, cost, quote, or score is `TODO:` + a recommendation to research or interview. A genuinely unknowable value is an `ASM-*`, not a fabricated number.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank templates live in [`../../templates/`](../../templates/). Each file carries the **Conventions §6** frontmatter block and is written under `04_Opportunity/`.

- **`Opportunity_Solution_Tree.md`** (`Living`) — outcome (`OBJ/KR`) → opportunities (`OPP-*`, traced to `INS/JOB`) → 2–3 candidate solutions (`SOL-*` seed) → experiments. Never frozen; revisited each discovery cycle.
- **`Opportunity_Assessment.md`** (★ primary; `Draft`→`Approved (G3…)`) — the SVPG 10-question assessment + four-big-risks-plus-ethics ratings + sizing summary.
- **`Business_Case.md`** (★ primary; `Draft`→`Approved (G3…)`) — lean, assumption-driven viability case with ranges and sensitivity.

### `Opportunity_Assessment.md` skeleton (copy, then replace every value or mark `TODO:`)
```markdown
---
Document: Opportunity Assessment — <Opportunity>
Document ID: OPPASSESS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: TODO: YYYY-MM-DD
---
## Opportunity
OPP-nn · <need/pain/desire in customer words> · traces: INS-nn, JOB-nn · serves: OBJ-nn / KR-nn
## SVPG 10 questions (one-line each; "N/A — why" never blank)
1. Problem? 2. For whom (segment)? 3. How big (size, below)? 4. Competing alternatives?
5. Why us / why now? 6. Go-to-market? 7. Critical to success? 8. What would stop us?
9. Recommendation? 10. Risk if we DON'T do it?
## Sizing (rank, not forecast)
| Method | Figure | Key assumptions | Source/TODO |
|---|---|---|---|
| Top-down (SAM) | <…> | <…> | TODO: research |
| Bottom-up (SOM) | #users × value | <…> | <…> |
> Reconcile the gap. TAM is a ceiling, not revenue.
## Four big risks (+ ethics) — rate Importance × Evidence
| Risk | Load-bearing assumption (ASM-nn) | Importance | Evidence | Test first? |
|---|---|---|---|---|
| Value / desirability | <ASM-nn> | H/M/L | strong/weak | <…> |
| Usability | … | … | … | … |
| Feasibility | … | … | … | … |
| Business-viability | … | … | … | … |
| Ethics | <privacy/fairness/safety> | … | … | … |
## Strategy fit
<which OBJ/KR; coherent with Product_Strategy.md? Rumelt diagnosis fit?>
## Recommendation
<Persevere | with-actions | Pivot | Hold | Kill> · what would change the call: <…> → DEC-nn
```

### `Business_Case.md` skeleton (lean — ranges, not false precision)
```markdown
---
Document: Business Case — <Opportunity>
Document ID: BIZCASE-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: TODO: YYYY-MM-DD
---
Outcome (OBJ/KR) · Value metric (MET-TBD) · Two-way or one-way door?
| Lever | Low | Expected | High | Assumption |
|---|---|---|---|---|
| Value / benefit | <…> | <…> | <…> | <…> |
| Cost to build+run | <…> | <…> | <…> | <…> |
| Net / payback | <…> | <…> | <…> | <…> |
Viability: <pricing/packaging, BMC fit> · Sensitivity: <what breaks the case> · Cost of NOT doing it: <…>
```
> Placeholders are **shape, not content** — replace them or mark `TODO:`. Do not ship example numbers.

## AI prompt pack
Copy-paste and fill the `<>` slots. (🔎 = needs current web research — see [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md).)
- **ELICIT —** "You are my PM partner running the Phase 04 Opportunity Assessment for `<product>`. Ask me, **one topic at a time**, what's needed to place `<opportunity>` on an Opportunity Solution Tree, size it top-down and bottom-up, rate the four big risks plus ethics, and sketch a lean business case. After each answer, reflect it back, demand the evidence, mark unknowns `TODO:`, and move on. Never invent a market figure, cost, or quote."
- **GENERATE —** "Using my answers and this skill's skeletons, draft `Opportunity_Assessment.md` and `Business_Case.md` with Conventions §6 frontmatter. Assign `OPP-nn`, trace to `INS/JOB` and `OBJ/KR`, give both-or-nothing sizing with stated assumptions, the four-risk-plus-ethics table with `ASM-nn`, and a ranges-based case. Mark every unknown `TODO:`."
- **CRITIQUE (red-team) —** "Act as a skeptical review board attacking this opportunity. Is it an opportunity or a disguised solution? Is the sizing top-down-only (red flag)? Is TAM being used as a forecast? Which of the four risks is unrated or evidence-free? Is ethics treated as a real assumption? Does it actually fit the strategy? If any answer has no defensible response, recommend **Pivot or Kill**, not a wave-through."
- **GATE (G3) —** "Run G3 · Opportunity Go/No-Go as a real review using the exit-gate checklist. For each box: pass, `TODO` (owner+date), or waive (recorded). Then recommend one of **Persevere · Persevere-with-actions · Pivot · Hold · Kill** with the evidence, and state what would change the call. An unrecorded gate is a failed gate."

## Research & specialised-agent triggers
Consolidated playbook + the **research-execution ladder**: [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md). For this phase:
- **Execute with `/research-report`**: size the opportunity and stand up the business case with a cited `/research-report` run (its **Decision-brief** mode fits a go/no-go or build-vs-buy input); pull the `reports/*.md` in as the evidence behind `Business_Case.md` and the OST sizing. Never lock a forecast on a guess — keep the case at `TODO` until sized.
- **Talk to a customer** when a sizing input, a value/desirability assumption, or a "customers want X" claim is gut-driven — the answer is a person, not a meeting. Maintain the weekly continuous-discovery touch; new findings become `INS-*`/`OPP-*`.
- **Web research 🔎** for market size/growth (TAM/SAM/SOM reconciliation), competitive/pricing intel, and regulatory exposure that feeds the business case and ethics risk. Keep the dependent figure at `TODO: confirm via research` until approved; cite report/figure/year.
- **Spawn a research-synthesis agent** when interview/feedback volume is large — delegate synthesis (not judgment), then verify themes against raw quotes yourself.

## Cross-cutting hooks
This phase seeds/feeds these threads (cite the file, don't re-author) — see [`../../cross-cutting/`](../../cross-cutting/):
- **Continuous Discovery & Customer Insight** — *primary*. The OST is `Living`; the opportunity space never closes. → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Metrics & Experimentation** — every `OPP-*` ties to an `OBJ/KR` and a `MET-TBD`; the riskiest assumptions become experiments in P07/P13. → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Stakeholder Management** — the sponsor defends the funded outcome; the go/no-go is logged as `DEC-*`. Prototyping can beat spec-writing for buy-in. → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Responsible Product** — ethics is a first-class assumption here (privacy/fairness/safety/EU AI Act exposure); new `RSK-*` logged. The floor is non-negotiable. → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Portfolio & Lifecycle** *(multi-product)* — confirm this bet's place and lifecycle stage in the portfolio. → [`../../cross-cutting/Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Pin, don't re-derive — cards in [`../../frameworks/`](../../frameworks/), pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md) (P04 row). Realised here: **Opportunity Solution Tree** (Torres); **Cagan/SVPG Opportunity Assessment** (10 questions) + **The Four Big Risks**; **Five Types of Assumptions** (Desirability/Viability/Feasibility/Usability/**Ethical**, Torres); **Assumptions Mapping + Test Cards** (Strategyzer); **TAM/SAM/SOM (+PAM)**; **Lean Business Case** (SAFe); **Business Model Canvas** (Osterwalder) for viability; **Lean Startup** (validated learning, two-way doors); **JTBD-ODI** for under-served outcomes; **Good Strategy/Bad Strategy** (Rumelt) for strategy-fit.

## Exit-gate checklist
**G3 · Opportunity Go/No-Go** *(owner: P04)* — copied verbatim from [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md); if they ever disagree, that file wins. Run the six-thread review first; record the verdict in `WORKFLOW.md` and `_threads/Decision_Log.md` (`DEC-*`) — an unrecorded gate is a failed gate.
- [ ] Opportunity placed on the **Opportunity Solution Tree** under a desired outcome (`OPP-*` → `OBJ/KR`).
- [ ] Opportunity sized (reach × value) with stated assumptions; not a TAM-as-forecast error.
- [ ] The **four big risks** named and rated: value/desirability, usability, feasibility, business-viability (+ ethics).
- [ ] Business case / ROI sketched at the right rigour for the tailoring profile; viability addressed.
- [ ] A clear **Go / No-Go / Pivot** decision, with what would change the call.
> **Pivot or Kill even if boxes "pass" when:** the opportunity is a disguised solution · sizing is top-down-only or TAM-as-forecast · no `OBJ/KR` fit (strategy drift) · an ethics/viability risk has no mitigation · no sponsor owns the outcome. The kill/park memo is the cheapest, most valuable artifact in this phase.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| "Build feature X" framed as the opportunity | A solution masquerading as an opportunity | Reframe to the need/job; require 2–3 solutions on the OST |
| One precise multi-year ROI number | Heavy single-shot business case, false precision | Lean case with ranges + sensitivity; revisit per increment |
| TAM cited as the win | TAM-as-forecast; top-down-only sizing (#1 red flag) | Size **both** top-down and bottom-up; use defensible SOM |
| Only four risks rated | Ethics omitted (Torres's 5th assumption) | Make ethics a first-class assumption with an `ASM-*`/`RSK-*` |
| OST written once and frozen | Treating the opportunity space as one-time | Keep it `Living`; revisit every discovery cycle |
| Loudest stakeholder picks the opportunity | Opinion/HiPPO-driven prioritisation | Decide on evidence; the OST + sizing pressure-test the call |
| Opportunity with no metric/outcome | Output thinking; no trace to `OBJ/KR`/`MET` | Wire `OPP-*` → `OBJ/KR` → `MET-TBD` before exit (§4/§7) |
| Surveys quoted as proof of demand | Survey credibility collapsing; volume up, response down | Ground in past behaviour from interviews; surveys are secondary |
| Gate always says "Persevere" | Rubber-stamping; Pivot/Kill seen as failure | Treat the gate as a decision; park/kill weak bets cheaply |
| AI's sizing/case pasted in as truth | Synthetic confidence, no verification | Human owns assumptions + go/no-go; verify every figure |

## References
- **Contract** — [`../../05_Conventions.md`](../../05_Conventions.md) (§1 phases, §2 gate ladder & verdicts, §3 IDs, §4 traceability spine, §6 frontmatter/status, §7 outcomes-over-outputs, §11 AI-led/human-decides). **Overview** — [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) (Double Diamond / dual-track; problem vs solution space). **Gate criteria** — [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md). **Tailoring** — [`../../04_Tailoring_Guide.md`](../../04_Tailoring_Guide.md).
- **2026 research (verify currency)** — SVPG Assessing Product Opportunities https://www.svpg.com/assessing-product-opportunities/ · SVPG Four Big Risks https://www.svpg.com/four-big-risks/ · Torres Opportunity Solution Trees https://www.producttalk.org/opportunity-solution-trees/ · Torres Five Types of Assumptions https://www.producttalk.org/2023/10/five-types-of-assumptions/ · Strategyzer Assumptions Mapping https://www.strategyzer.com/library/how-assumptions-mapping-can-focus-your-teams-on-running-experiments-that-matter · SAFe Lean Business Case https://deeprojectmanager.com/safe-lean-business-case/ · TAM/SAM/SOM https://waveup.com/blog/tam-sam-som/
- **Related phases** — [pm-phase-01-strategy] (outcomes this serves) · [pm-phase-02-market-research] (sizing inputs) · [pm-phase-03-discovery] (validated problem, prior) · [pm-phase-05-roadmap] (next on Persevere) · [pm-phase-06-prioritization] (ranking aid) · [pm-phase-07-solution-design] (tests the riskiest `ASM-*`).
- **Curriculum** — [`../../../PM_Final_WF/01-product-strategy-playbook.md`](../../../PM_Final_WF/01-product-strategy-playbook.md) (opportunity sizing & business-case background).

</supporting-info>
