# Product Management Workflow

**A reusable, AI-powered, framework-agnostic product-management operating system** — from a first idea to responsible retirement. Grounded in the modern **product operating model** (Cagan/SVPG), **Lean Startup** (Ries), **Continuous Discovery** (Torres), **Jobs-to-be-Done**, **OKRs / North Star**, **Agile / Scrum / Kanban**, **PLG**, and the prioritization & measurement frameworks every PM is expected to know. Built to be run *with* an AI that interviews you at each phase, challenges assumptions, drafts the artifacts, and tells you when to research or talk to a customer — while **you stay in control of every decision**.

> Apply it to **any** product — B2B or B2C, 0→1 or scale, software or hardware-enabled — by tailoring the rigour up or down. This is your operational playbook: at any moment you can open [`project-starter/WORKFLOW.md`](project-starter/WORKFLOW.md), see where you are, know what's done, what's missing, which skill to run next, and what the final deliverable looks like.

---

## Two ways to use it

1. **As a guided operating system (recommended).** Copy [`project-starter/`](project-starter/) into your product repo. Open `WORKFLOW.md`, work top to bottom, and at each phase **type the `/command`** (e.g. `/pm-phase-03-discovery`). Skills are `disable-model-invocation: true` — **nothing auto-fires; you invoke it.** The skill interviews you, writes the deliverables, checks the gate, and names the next command.
2. **As a learning curriculum.** Read [`01_Workflow_Overview.md`](01_Workflow_Overview.md) → the [`frameworks/`](frameworks/) cards → walk the [`worked_example/`](worked_example/). Each phase skill doubles as a teaching playbook for that part of the craft.

**New here?** Read [`01_Workflow_Overview.md`](01_Workflow_Overview.md) first (10 min), then skim [`05_Conventions.md`](05_Conventions.md).

---

## The 17 phases — grouped into 6 macro-stages

The 17 phases group into **6 macro-stages** — stages 1–4 mirror the classic **Strategy → Design → Development → Launch** arc; **5 Grow** and **6 Sunset** are the modern additions. The grouping is a *navigation scaffold, not a waterfall*: discovery and the grow-loop run continuously (see [`01_Workflow_Overview.md`](01_Workflow_Overview.md) §2/§4).

**Stage 1 · Product Strategy** — *signed-off strategy + vision pitch · gates G0–G3*

| # | Phase | Run this | Produces | Gate |
|---|---|---|---|---|
| 00 | [Product Charter & Operating Setup](skills/pm-phase-00-charter/) | `/pm-phase-00-charter` | Charter · Operating Model · Stakeholder Map | **G0 Kickoff** |
| 01 | [Product Strategy & Vision](skills/pm-phase-01-strategy/) | `/pm-phase-01-strategy` | Vision · Strategy · North Star + OKRs | **G1 Strategy Sign-off** |
| 02 | [Market & Competitive Research](skills/pm-phase-02-market-research/) | `/pm-phase-02-market-research` | Market Analysis · Competitive Analysis · Positioning | *supporting* |
| 03 | [Customer Discovery & User Research](skills/pm-phase-03-discovery/) | `/pm-phase-03-discovery` | Discovery Plan · Interview Guide · Personas · JTBD · Insights | **G2 Problem Validated** |
| 04 | [Opportunity Assessment & Business Case](skills/pm-phase-04-opportunity/) | `/pm-phase-04-opportunity` | Opportunity Solution Tree · Assessment · Business Case | **G3 Opportunity Go/No-Go** |

**Stage 2 · Product Design** — *validated, spec'd, sliced solution · gates G4–G7* (the design sprint lives in P07)

| # | Phase | Run this | Produces | Gate |
|---|---|---|---|---|
| 05 | [Product Roadmap](skills/pm-phase-05-roadmap/) | `/pm-phase-05-roadmap` | Roadmap (Now/Next/Later) · Release Plan | **G4 Roadmap Commit** |
| 06 | [Prioritization](skills/pm-phase-06-prioritization/) | `/pm-phase-06-prioritization` | Prioritization Matrix (RICE/Kano/WSJF…) | *supporting* |
| 07 | [Solution Discovery & Design](skills/pm-phase-07-solution-design/) | `/pm-phase-07-solution-design` | Assumption Map · Prototype Plan · Usability Test · Validation | **G5 Solution Validated** |
| 08 | [Requirements & PRD](skills/pm-phase-08-prd/) | `/pm-phase-08-prd` | PRD (or PR-FAQ / Shape-Up pitch) · NFR Checklist | **G6 PRD Approved** |
| 09 | [User Stories & Acceptance Criteria](skills/pm-phase-09-stories/) | `/pm-phase-09-stories` | Story Map · User Stories + AC · DoR/DoD | **G7 Backlog Ready** |

**Stage 3 · Product Development** — *release-ready build · gate G8*

| # | Phase | Run this | Produces | Gate |
|---|---|---|---|---|
| 10 | [Agile Delivery & Backlog Mgmt](skills/pm-phase-10-delivery/) | `/pm-phase-10-delivery` | Delivery Plan · Sprint Plan · Risk Register · Release Readiness | **G8 Release Readiness** |

**Stage 4 · Product Launch** — *landed launch (GA) · gate G9*

| # | Phase | Run this | Produces | Gate |
|---|---|---|---|---|
| 11 | [Launch & Go-to-Market](skills/pm-phase-11-launch-gtm/) | `/pm-phase-11-launch-gtm` | Launch Plan · GTM Plan · Rollout Plan · Comms | **G9 Launch Decision (GA)** |

**Stage 5 · Grow & Iterate** — *continuous; the loop runs until sunset (modern addition)*

| # | Phase | Run this | Produces | Gate |
|---|---|---|---|---|
| 12 | [Analytics, KPIs & Instrumentation](skills/pm-phase-12-analytics/) | `/pm-phase-12-analytics` | Measurement Plan · Tracking Plan · KPI Scorecard | *continuous* |
| 13 | [Experimentation & A/B Testing](skills/pm-phase-13-experimentation/) | `/pm-phase-13-experimentation` | Experiment Plan · Readout | *continuous* |
| 14 | [Customer Feedback Management](skills/pm-phase-14-feedback/) | `/pm-phase-14-feedback` | Feedback Ops Plan · Feedback Log · Insight Synthesis | *continuous* |
| 15 | [Product Growth & Optimization](skills/pm-phase-15-growth/) | `/pm-phase-15-growth` | Growth Model · Growth Experiment Backlog | *continuous* |

**Stage 6 · Sunset** — *responsible retirement · gate G10 (modern addition)*

| # | Phase | Run this | Produces | Gate |
|---|---|---|---|---|
| 16 | [Product Sunset & Retirement](skills/pm-phase-16-sunset/) | `/pm-phase-16-sunset` | Sunset Decision · Deprecation Plan · Migration Comms | **G10 End-of-Life** |

**6 cross-cutting threads** run through every phase (see [`cross-cutting/`](cross-cutting/)): Stakeholder Management · Continuous Discovery · Metrics & Experimentation · Product Operations · Responsible Product · Portfolio & Lifecycle.

> Gate ladder: **G0 → G1 → G2 → G3 → G4 → G5 → G6 → G7 → G8 → G9 … G10.** A gate is a decision — *Persevere · Persevere-with-actions · Pivot · Hold · Kill.*

---

## What's in this folder

| Path | What it is |
|---|---|
| [`01_Workflow_Overview.md`](01_Workflow_Overview.md) | The spine — 17 phases, double-diamond/dual-track, the continuous loop, gates |
| [`02_AI_Product_Manager_Protocol.md`](02_AI_Product_Manager_Protocol.md) | How the AI runs each phase: interview, challenge, red-team, advise, gate |
| [`03_Frameworks_Map.md`](03_Frameworks_Map.md) | Every framework pinned to a phase + a fast chooser + anti-patterns |
| [`04_Tailoring_Guide.md`](04_Tailoring_Guide.md) | Scale up/down — Solo/Lean vs Standard vs Enterprise/Formal |
| [`05_Conventions.md`](05_Conventions.md) | **The contract** — phases, gates, IDs, status, severity, naming, layout |
| [`skills/`](skills/) | The 17 phase guides (objective, activities, questions, prompts, deliverables, gate, pitfalls) |
| [`cross-cutting/`](cross-cutting/) | The 6 living discipline threads |
| [`frameworks/`](frameworks/) | One-page reference card per framework (definition, steps, when-to-use, mistakes, source) |
| [`templates/`](templates/) | Blank fill-in template for every deliverable |
| [`prompts/`](prompts/) | Reusable AI prompt library + when to research / spawn agents |
| [`checklists/`](checklists/) | Gate-review criteria + quality checklists |
| [`reference/`](reference/) | Deep theory ([Comprehensive Guide](reference/Comprehensive_Guide.md)) + [two-page Playbook](reference/Full_Process_Playbook.md) |
| [`worked_example/`](worked_example/) | A fully worked end-to-end instance |
| [`project-starter/`](project-starter/) | Drop-in **manual-invocation** kit — 17 skills (`disable-model-invocation`), a lean `pm-workflow/` reference, and a `WORKFLOW.md` map |
| [`00_Audit_Migration_Report.md`](00_Audit_Migration_Report.md) | Why this exists + every change vs. the older course material, with sources |

---

## Quickstart

- **Run a product:** copy `project-starter/` into your repo, open `WORKFLOW.md`, and say *"be my AI product manager for \<product\>"* → kickoff (identity → tailoring → first phase) per the [Protocol](02_AI_Product_Manager_Protocol.md#9-starting-a-session-kickoff-script).
- **Jump to a phase:** *"run /pm-phase-05-roadmap"* → loads that skill (it reads prior-phase outputs or flags what's missing).
- **Just learn the method:** read [`01_Workflow_Overview.md`](01_Workflow_Overview.md) → [`reference/Comprehensive_Guide.md`](reference/Comprehensive_Guide.md) → walk the [`worked_example/`](worked_example/).

---

## Principles this workflow enforces

- **Outcomes over outputs** — measured by customer & business outcomes, not features shipped.
- **Problem before solution** — validate the problem (G2/G3) before committing the build.
- **Continuous discovery** — weekly customer contact; the opportunity tree never closes.
- **Evidence over opinion** — every bet has an assumption, a test, and a metric.
- **Gates are decisions** — Persevere / with-actions / Pivot / Hold / Kill.
- **Right-size the rigour** — and record every tailoring decision.
- **Responsible by default** — privacy, accessibility, ethics, and safety are a non-negotiable floor.
- **AI-accelerated, human-led** — AI drafts and challenges; you decide and are accountable.
- **Never invent** — unknowns become `TODO:` + a research or interview recommendation.

---

## Relationship to the rest of this repo

- **`PM_Final_WF/`** (sibling folder) is the Udacity-course-derived knowledge base — four phase playbooks/summaries (Strategy → Design → Development → Launch) and seven course-shaped skills. It's been refreshed to 2026 standards and remains the *curriculum* layer. **This `Product_Management_Workflow/` is the general-purpose operating system** that supersedes it for running real product work end-to-end. See [`00_Audit_Migration_Report.md`](00_Audit_Migration_Report.md).
- **Pattern sibling:** this mirrors the structure of `../System Engineering/System_Engineering_Workflow/` — same operating-system shape, applied to product instead of systems engineering.
