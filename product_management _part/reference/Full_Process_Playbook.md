---
Document: Full Process Playbook — the two-page PM operating system
Document ID: PLAYBOOK-PM-WF-v1.0
Status: Living
Owner: Product (workflow maintainer)
Updated: 2026-06-26
---

# Full Process Playbook

> The whole operating system on two pages — keep it open. **17 phases** (lifecycle backbone) run **dual-track**: discovery (P02–P07) and delivery (P08–P11) in parallel, then the measure→learn→grow loop (P12–P15) runs forever. Numbering is a *default reading order + dependency spine*, **not a waterfall**. Conforms to [`../05_Conventions.md`](../05_Conventions.md) (the contract). Spine: [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) · Map: [`../README.md`](../README.md) · Phase skills: [`../skills/`](../skills/).

---

## The 17 phases in order

| # | Phase | Objective (1 line) | Key deliverables | Gate | The one do · don't |
|---|---|---|---|---|---|
| 00 | **Charter & Operating Setup** | Agree the mandate, team, cadence, and how decisions get made. | Product_Charter · Operating_Model · Stakeholder_Map | **G0** | **Do** name the decision-maker + record every tailoring choice. **Don't** start work with no agreed success definition or cadence. |
| 01 | **Strategy & Vision** | Decide where we're going and why we'll win. | Vision · Product_Strategy · North_Star_and_OKRs | **G1** | **Do** start from a *diagnosis* of the single biggest obstacle (Rumelt). **Don't** mistake OKRs for strategy or pick a vanity North Star (DAU/sign-ups). |
| 02 | **Market & Competitive** | Ground strategy in market reality. | Market_Analysis (TAM/SAM/SOM) · Competitive_Analysis · Positioning_Brief | *supporting* (→G1/G3) | **Do** size top-down **and** bottom-up and reconcile (~15%). **Don't** say "capture 1% of a $XB TAM" or ignore the status-quo / "do-nothing" competitor. |
| 03 | **Customer Discovery** | Learn the customer, problem, and jobs — before solutions. | Discovery_Plan · Interview_Guide · Personas · JTBD · Research_Insights | **G2** | **Do** interview for stories ("tell me about the last time…"), ≥1/week. **Don't** pitch your solution or ask "would you use this?". |
| 04 | **Opportunity & Business Case** | Decide which problem is worth solving now. | Opportunity_Solution_Tree · Opportunity_Assessment · Business_Case | **G3** | **Do** name the four big risks **+ ethics** and recommend reversibly. **Don't** dress a solution up as an opportunity (one way to solve = solution in disguise). |
| 05 | **Roadmap** | Commit to outcomes over a horizon, not a feature calendar. | Roadmap (Now/Next/Later) · Release_Plan | **G4** | **Do** organize swimlanes by outcome/objective tied to OKRs. **Don't** ship a dated Gantt or promise features to sales by date. |
| 06 | **Prioritization** | Rank opportunities/solutions defensibly. | Prioritization_Matrix (RICE/Kano/WSJF/…) | *supporting* (→P05/P08) | **Do** filter then rank, and make Confidence explicit. **Don't** let "the spreadsheet decide" — the framework structures the call, the human makes it. |
| 07 | **Solution Discovery & Design** | Find a desirable, usable, feasible, viable solution and de-risk it. | Assumption_Map · Prototype_Plan · Usability_Test_Plan · Solution_Validation | **G5** | **Do** test the riskiest assumption first with a prototype. **Don't** enter build before the four big risks (+ ethics) are addressed. |
| 08 | **Requirements & PRD** | Specify what to build — just enough, just in time. | PRD (or PR-FAQ / Shape-Up pitch) · NFR_Checklist | **G6** | **Do** write *testable* requirements (Given-When-Then / fit criteria) with first-class NFRs. **Don't** let the PRD replace discovery or accept AI prose as final. |
| 09 | **Stories & Acceptance Criteria** | Turn the PRD into a ready, testable backlog. | Story_Map · User_Stories (+ AC) · DoR_DoD | **G7** | **Do** slice **vertically** (end-to-end value); write AC with the Three Amigos. **Don't** split horizontally (FE/BE) or gate work behind a rigid DoR. |
| 10 | **Agile Delivery & Backlog** | Build it, keep flow healthy, reach release readiness. | Delivery_Plan · Sprint_Plan · Risk_Register · Release_Readiness | **G8** | **Do** optimize *flow* — limit WIP, start less/finish more; measure to learn. **Don't** use velocity as a target or rank individuals. |
| 11 | **Launch & Go-to-Market** | Land it in the market with GTM, not just ship it. | Launch_Plan · GTM_Plan · Rollout_Plan · Launch_Comms | **G9** | **Do** separate *release* (staged, flagged, reversible) from *launch* (the GTM moment); brief internal before external. **Don't** big-bang on a fixed date with no rollback. |
| 12 | **Analytics, KPIs & Instrumentation** | Know whether it's working. | Measurement_Plan · Tracking_Plan · KPI_Scorecard | *continuous* | **Do** pair one outcome metric with 3–5 movable inputs + 2–3 guardrails, instrumented from a tracking plan. **Don't** ship raw-count vanity metrics or one that won't change behavior. |
| 13 | **Experimentation & A/B** | Prove change with evidence, not opinion. | Experiment_Plan · Experiment_Readout | *continuous* | **Do** pre-register a falsifiable hypothesis + power analysis (one OEC + guardrails). **Don't** peek/stop at first p<0.05 (use sequential) or A/B a one-way-door decision. |
| 14 | **Customer Feedback** | Run a closed-loop voice-of-customer system. | Feedback_Ops_Plan · Feedback_Log · Insight_Synthesis | *continuous* | **Do** close the loop — synthesize themes into OPP-* fed back to P03/04. **Don't** let loud/measurable signals or raw request-counts drive the roadmap. |
| 15 | **Growth & Optimization** | Compound activation, retention, and monetization. | Growth_Model · Growth_Experiment_Backlog | *continuous* | **Do** build a growth loop; fix activation/retention before pouring in acquisition. **Don't** pour acquisition into a leaky bucket. |
| 16 | **Sunset & Retirement** | Retire a product/feature responsibly. | Sunset_Decision · Deprecation_Plan · Migration_Comms | **G10** | **Do** handle migration, comms, data, and legal before EOL. **Don't** sunset silently or strand customer data. |

> **Supporting** phases (P02, P06) are invoked *inside* other phases and own no gate. **Continuous** phases (P12–P15) switch on at launch and never turn off; their "gate" is a recurring health check.

---

## The gate ladder (G0 → G10)

```
G0 ─ G1 ─ G2 ─ G3 ─ G4 ─ G5 ─ G6 ─ G7 ─ G8 ─ G9 ┄┄(grow/measure loop: P12-P15)┄┄ G10
00   01   03   04   05   07   08   09   10   11                                     16
```

| Gate | Name | Phase | Passes when… |
|---|---|---|---|
| **G0** | Kickoff | 00 | Charter agreed; team, mandate, success definition, and operating cadence set. |
| **G1** | Strategy Sign-off | 01 | Vision, strategy, North Star + OKRs agreed by leadership; coherent and focused. |
| **G2** | Problem Validated | 03 | Evidence (not opinion) that a real, valuable problem exists for a defined segment. |
| **G3** | Opportunity Go/No-Go | 04 | Opportunity sized, four big risks named, go/no-go made with a business case. |
| **G4** | Roadmap Commit | 05 | Outcome-based roadmap tied to OKRs; Now committed, Next/Later directional. |
| **G5** | Solution Validated | 07 | Riskiest assumptions tested; solution is desirable, usable, feasible, viable (and ethical). |
| **G6** | PRD Approved / Build Entry | 08 | Problem, scope, success metrics, and NFRs signed off; ready to build. |
| **G7** | Backlog Ready | 09 | Story map sliced; top stories meet Definition of Ready with testable AC. |
| **G8** | Release Readiness | 10 | Quality bar met; no open S1/S2; instrumentation, support, rollback in place. |
| **G9** | Launch Decision (GA) | 11 | GTM ready; tier chosen; rollout + success/guardrail metrics + rollback agreed. |
| **G10** | End-of-Life | 16 | Retirement justified; migration, comms, data, and legal handled; sunset approved. |

**Verdicts (every gate is a decision, never a rubber stamp):** **Persevere** (all criteria met → proceed) · **Persevere-with-actions** (minor items, named owner + due date, risk accepted) · **Pivot** (evidence says change segment/problem/solution/model/channel → loop back to the owning phase) · **Hold** (blocking gap — do not advance) · **Kill** (desirability/feasibility/viability/business case failed → stop or shelve). *A PM who never says Pivot or Kill is running theatre.* Full criteria: [`../checklists/gate-reviews.md`](../checklists/gate-reviews.md).

---

## The 6 cross-cutting threads (alive in every phase, reviewed at every gate)

1. **Stakeholder Management & Communication** — alignment, influence without authority, the decision log.
2. **Continuous Discovery & Customer Insight** — the weekly-touch habit; the opportunity solution tree never closes.
3. **Metrics, Analytics & Experimentation** — instrumentation hygiene; every bet has a metric and (where possible) an experiment.
4. **Product Operations & Ways of Working** — cadences, tooling, templates, scaling the practice.
5. **Responsible Product** — privacy-by-design, accessibility, AI ethics, security, trust & safety, compliance (the **non-negotiable floor**).
6. **Product Portfolio & Lifecycle** *(multi-product / optional)* — resource allocation across the portfolio; lifecycle stage per product.

> A thread is never removed, only *scaled*. Detail: [`../cross-cutting/`](../cross-cutting/). Frameworks pinned to phases: [`../03_Frameworks_Map.md`](../03_Frameworks_Map.md).

---

## The traceability spine (the golden thread — one line)

`Insight (INS) / Job (JOB) / Persona (PER) → Opportunity (OPP) → Objective+KR (OBJ/KR) → Roadmap item (RMI) → Solution (SOL) → Assumption (ASM) → Experiment (EXP); Requirement (REQ)/Feature (FEAT) → User story (US) → Acceptance criterion (AC); all measured by Metric (MET) ◀ Feedback (FB).`

> Read it as *evidence → opportunity → outcome → bet → spec → ship → measure → learn → loop.* **Nothing enters the roadmap without an opportunity, no opportunity without evidence, no "done" without a metric** — forward and backward both matter.

---

## The 10 prime principles

1. **Outcomes over outputs** — measured by customer & business outcomes, not features shipped; "done" = a moved metric, not a closed ticket.
2. **Problem before solution** — validate the problem (G2/G3) before committing the build; discovery is cheap, delivery is expensive.
3. **Continuous discovery** — weekly customer contact; the opportunity solution tree never closes.
4. **Evidence over opinion** — every bet has an assumption, a test, and a metric; the loudest voice doesn't win, the evidence does.
5. **Gates are decisions** — Persevere / with-actions / Pivot / Hold / Kill; the most valuable outcome is often the one that stops wasted build.
6. **Trace the golden thread** — keep forward+backward traceability unbroken so you can always answer "why are we building this?".
7. **Right-size the rigour** — tailor phase and thread depth to the product; never skip silently — record every tailoring decision in the charter.
8. **Responsible by default** — privacy, accessibility, ethics, security, and safety are a non-negotiable floor, even for the smallest product.
9. **AI-accelerated, human-led** — AI drafts, researches, and challenges; the human owns every strategy/prioritization/ethics/go-no-go decision and is accountable. *Amplify your thinking, don't abdicate it.*
10. **Never invent** — AI never fabricates customer evidence, metrics, market data, or quotes; unknowns become `TODO: <what's owed>` + a recommendation to research or interview.

---

*If anything here disagrees with [`../05_Conventions.md`](../05_Conventions.md), the conventions win — fix this page.*
