# `<PRODUCT NAME>` — Product Management Workflow Map

> **Your front-of-me runbook.** Work top to bottom. For each phase: skim the deliverables, **run the `/command`** (you invoke it — nothing auto-fires), answer the interview, produce the artifacts, **decide the gate**, then advance. The skill you run will also name the next command. Keep this file open and tick the boxes.
>
> Status key: `☐` not started · `▶` in progress · `✅` gate passed · `⏸` on hold · `⏭` tailored out (record why).
>
> Remember the prime directive: **outcomes over outputs**. A phase that produced output with no line back to a customer/business outcome hasn't really passed its gate.

---

## You are here

| | |
|---|---|
| **Product** | `<PRODUCT NAME>` (`<slug>`) |
| **Segment / market** | `<e.g. distributed software teams · B2B SaaS>` |
| **Stage** | `<idea / 0→1 / growth / mature / sunset>` |
| **Operating cadence** | `<Continuous-dual-track / Scrum / Kanban / Stage-Gate>` *(set in P00)* |
| **Tailoring profile** | `<Solo-Lean / Standard / Enterprise-Formal>` — `<note any Full-rigour threads, e.g. Responsible Product>` |
| **North Star metric** | `<set in P01>` |
| **Current phase** | `<—>` |
| **Last gate passed** | `<—>` |

---

## The 17 phases — grouped into 6 macro-stages

> **Six macro-stages give you the map; the 17 phases are the work.** Stages 1–4 mirror the classic **Strategy → Design → Development → Launch** arc; **5 Grow** and **6 Sunset** are the modern additions the old four-stage model omits.
>
> ⚠️ **This is a navigation scaffold, not a waterfall.** Discovery (P02–P04, P07) runs *continuously* alongside delivery (dual-track), and the Grow loop (P12–P15) runs from launch until retirement. A couple of phases straddle a boundary (Discovery spans Strategy↔Design; the PRD sits at Design↔Development). Work the phase you're actually in — the stages are for orientation, not locked doors.

### Stage 1 · Product Strategy — *produces a signed-off strategy + vision pitch · gates G0–G3*

| ✓ | # | Phase | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 00 | [Product Charter & Operating Setup](.claude/skills/pm-phase-00-charter/SKILL.md) | `/pm-phase-00-charter` | Charter · Operating Model · Stakeholder Map | **G0 Kickoff** |
| ☐ | 01 | [Product Strategy & Vision](.claude/skills/pm-phase-01-strategy/SKILL.md) | `/pm-phase-01-strategy` | Vision · Strategy (Rumelt) · North Star + OKRs | **G1 Strategy Sign-off** |
| ☐ | 02 | [Market & Competitive Research](.claude/skills/pm-phase-02-market-research/SKILL.md) | `/pm-phase-02-market-research` | Market Analysis · Competitive Analysis · Positioning | *supporting* |
| ☐ | 03 | [Customer Discovery & User Research](.claude/skills/pm-phase-03-discovery/SKILL.md) | `/pm-phase-03-discovery` | Discovery Plan · Interview Guide · Personas · JTBD · Insights | **G2 Problem Validated** |
| ☐ | 04 | [Opportunity Assessment & Business Case](.claude/skills/pm-phase-04-opportunity/SKILL.md) | `/pm-phase-04-opportunity` | Opportunity Solution Tree · Assessment · Business Case | **G3 Opportunity Go/No-Go** |

> **Stage-1 deliverable: the vision pitch.** Once G3 passes, package the strategy as a pitch (the classic "pitch a product vision" milestone) — see the `pitch-deck-builder` skill in the sibling `PM_Final_WF/`. A No-Go/Pivot here is a win: don't carry a weak strategy into Design.

### Stage 2 · Product Design — *produces a validated, spec'd, sliced solution · gates G4–G7*

| ✓ | # | Phase | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 05 | [Product Roadmap](.claude/skills/pm-phase-05-roadmap/SKILL.md) | `/pm-phase-05-roadmap` | Roadmap (Now/Next/Later) · Release Plan | **G4 Roadmap Commit** |
| ☐ | 06 | [Prioritization](.claude/skills/pm-phase-06-prioritization/SKILL.md) | `/pm-phase-06-prioritization` | Prioritization Matrix (RICE/Kano/WSJF…) | *supporting* |
| ☐ | 07 | [Solution Discovery & Design](.claude/skills/pm-phase-07-solution-design/SKILL.md) | `/pm-phase-07-solution-design` | Assumption Map · Prototype Plan · Usability Test · Validation | **G5 Solution Validated** |
| ☐ | 08 | [Requirements & PRD](.claude/skills/pm-phase-08-prd/SKILL.md) | `/pm-phase-08-prd` | PRD (or PR-FAQ / Shape-Up) · NFR Checklist | **G6 PRD Approved** |
| ☐ | 09 | [User Stories & Acceptance Criteria](.claude/skills/pm-phase-09-stories/SKILL.md) | `/pm-phase-09-stories` | Story Map · User Stories + AC · DoR/DoD | **G7 Backlog Ready** |

> **The design sprint** (understand → define → sketch → decide → prototype → validate) lives in **P07**; P05/P06 plan *what* to build, P08/P09 specify and slice it.

### Stage 3 · Product Development — *produces a release-ready build · gate G8*

| ✓ | # | Phase | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 10 | [Agile Delivery & Backlog Mgmt](.claude/skills/pm-phase-10-delivery/SKILL.md) | `/pm-phase-10-delivery` | Delivery Plan · Sprint Plan · Risk Register · Release Readiness | **G8 Release Readiness** |

> Methodologies, collaboration, tooling, testing, dogfood/feedback, and launch-prep all live in **P10** (it's the widest phase). The Metrics & Stakeholder threads run hot here.

### Stage 4 · Product Launch — *lands the product in market (GA) · gate G9*

| ✓ | # | Phase | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 11 | [Launch & Go-to-Market](.claude/skills/pm-phase-11-launch-gtm/SKILL.md) | `/pm-phase-11-launch-gtm` | Launch Plan · GTM Plan · Rollout Plan · Comms | **G9 Launch Decision (GA)** |

> Launch process, marketing/positioning, partner enablement, rollout, and post-launch comms — all **P11**. Remember: *release ≠ launch*, and launch isn't the finish line (Stage 5 begins).

### Stage 5 · Grow & Iterate — *continuous; the loop runs from launch until sunset* *(modern addition)*

| ✓ | # | Phase | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 12 | [Analytics, KPIs & Instrumentation](.claude/skills/pm-phase-12-analytics/SKILL.md) | `/pm-phase-12-analytics` | Measurement Plan · Tracking Plan · KPI Scorecard | *continuous* |
| ☐ | 13 | [Experimentation & A/B Testing](.claude/skills/pm-phase-13-experimentation/SKILL.md) | `/pm-phase-13-experimentation` | Experiment Plan · Readout | *continuous* |
| ☐ | 14 | [Customer Feedback Management](.claude/skills/pm-phase-14-feedback/SKILL.md) | `/pm-phase-14-feedback` | Feedback Ops Plan · Feedback Log · Insight Synthesis | *continuous* |
| ☐ | 15 | [Product Growth & Optimization](.claude/skills/pm-phase-15-growth/SKILL.md) | `/pm-phase-15-growth` | Growth Model · Growth Experiment Backlog | *continuous* |

> This loop *is* continuous improvement: measure (12) → experiment (13) → listen (14) → grow (15) → new opportunities feed back into Stage 1/Discovery. It never "completes."

### Stage 6 · Sunset — *responsible retirement · gate G10* *(modern addition)*

| ✓ | # | Phase | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 16 | [Product Sunset & Retirement](.claude/skills/pm-phase-16-sunset/SKILL.md) | `/pm-phase-16-sunset` | Sunset Decision · Deprecation Plan · Migration Comms | **G10 End-of-Life** |

> Gate ladder: **G0 → G1 → G2 → G3 → G4 → G5 → G6 → G7 → G8 → G9 … G10.** A gate is a decision — *Persevere · Persevere-with-actions · **Pivot** · Hold · **Kill*** — log it below.
> **Supporting** phases (02, 06) are invoked inside others, no gate. **Continuous** phases (12–15) switch on at launch and never turn off — their "gate" is a recurring health check.

---

## Cross-cutting threads (keep alive every phase · review at every gate)

| ✓ | Thread | Reference | Living artifact |
|---|---|---|---|
| ☐ | Stakeholder Management | [pm-workflow/cross-cutting/Stakeholder_Management.md](pm-workflow/cross-cutting/Stakeholder_Management.md) | `_threads/Decision_Log.md` (`DEC-*`) · `Stakeholder_Map.md` |
| ☐ | Continuous Discovery | [pm-workflow/cross-cutting/Continuous_Discovery.md](pm-workflow/cross-cutting/Continuous_Discovery.md) | `Opportunity_Solution_Tree.md` · `Research_Insights.md` (`INS-*`/`OPP-*`) |
| ☐ | Metrics & Experimentation | [pm-workflow/cross-cutting/Metrics_and_Experimentation.md](pm-workflow/cross-cutting/Metrics_and_Experimentation.md) | `KPI_Scorecard.md` (`MET-*`) · experiments (`EXP-*`) |
| ☐ | Product Operations | [pm-workflow/cross-cutting/Product_Operations.md](pm-workflow/cross-cutting/Product_Operations.md) | cadences · tooling · template hygiene |
| ☐ | Responsible Product *(floor — non-negotiable)* | [pm-workflow/cross-cutting/Responsible_Product.md](pm-workflow/cross-cutting/Responsible_Product.md) | `_threads/Responsible_Product_Review.md` (`RSK-*`) |
| ☐ | Portfolio & Lifecycle *(multi-product)* | [pm-workflow/cross-cutting/Portfolio_Management.md](pm-workflow/cross-cutting/Portfolio_Management.md) | `_threads/Portfolio_View.md` |

---

## Gate decision log

| Date | Gate | Decision | Open actions (owner · due) | Evidence / notes |
|---|---|---|---|---|
| `<YYYY-MM-DD>` | `<G1>` | `<Persevere / …>` | `<—>` | `<—>` |

---

## How to drive this

1. **You invoke; nothing auto-fires.** Each skill is `disable-model-invocation: true`. Type the `/command` for the phase you're ready to do (or pick it from the `/` menu).
2. **The skill runs the phase:** reads your prior-phase artifacts, interviews you one topic at a time, drafts the deliverables into `NN_<Phase>/`, checks the exit gate, and **names the next command**.
3. **You decide the gate** (Persevere / with-actions / Pivot / Hold / Kill), tick it here, log it in `_threads/Decision_Log.md`, and move on.
4. **Keep the six threads alive** every phase; review them at every gate.
5. **Reference, anytime:** the method lives in [`pm-workflow/`](pm-workflow/) — the [Conventions](pm-workflow/05_Conventions.md), the [AI PM Protocol](pm-workflow/02_AI_Product_Manager_Protocol.md), the [Tailoring Guide](pm-workflow/04_Tailoring_Guide.md), [Frameworks Map](pm-workflow/03_Frameworks_Map.md), [templates](pm-workflow/templates/), [prompts](pm-workflow/prompts/), [checklists](pm-workflow/checklists/), and [framework cards](pm-workflow/frameworks/).

> **You don't have to start at 00.** New product → start at **01 Strategy** (or 00 if the mandate isn't set). A new feature inside an existing product → start at **03 Discovery** or **04 Opportunity**; a well-validated change → straight to **08 PRD**. Each skill detects what prior artifacts exist and flags what's missing.
>
> **Reference examples & the deep theory KB are not bundled here** (kept lean) — see the master `Product_Management_Workflow/` (the `worked_example/`, `reference/Comprehensive_Guide.md`, and `reference/2026_Research_Pack.md`).
