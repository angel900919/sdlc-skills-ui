# System Engineering Workflow

**A reusable, AI‑powered, domain‑agnostic systems‑engineering workflow** — from a first stakeholder need to safe retirement. Grounded in **ISO/IEC/IEEE 15288**, **INCOSE SE Handbook v5**, **NASA/SP‑2016‑6105**, the V‑model, MBSE/SysML, requirements engineering, V&V, and risk management. Built to be run *with* an AI that interviews you at each stage, challenges assumptions, drafts the artifacts, and tells you when to research or call in a specialist.

> Apply it to **any** system — hardware, software, or hybrid — at **any** scale, by tailoring the rigour up or down. This folder is the single home; it supersedes the retired `5-sytem-eng/`.

---

## Two ways to use it

1. **As an AI Systems Engineer (recommended).** Say *"be my AI systems engineer for \<system\>"* or *"run Phase 1 concept for \<system\>"*. The AI follows the [AI Systems Engineer Protocol](02_AI_Systems_Engineer_Protocol.md): it captures project identity, picks a [tailoring profile](04_Tailoring_Guide.md), then runs each stage's interview → draft → red‑team → gate loop, keeping the 8 cross‑cutting threads alive.
2. **As a human playbook.** Work top‑to‑bottom through the [stage skills](skills/), using the [templates](templates/), [prompts](prompts/), and [checklists](checklists/) for each stage; copy the [worked example](worked_example/) for shape.

**New here?** Read [`01_Workflow_Overview.md`](01_Workflow_Overview.md) first (10 minutes), then skim [`05_Conventions.md`](05_Conventions.md).

---

## The 12 stages

| # | Stage | Produces | Gate |
|---|---|---|---|
| 00 | [Agreement & Enablement](skills/se-phase-00-agreement/) | Agreement Register, SEMP, Enablement Plan | ATP |
| 01 | [Concept](skills/se-phase-01-concept/) | Stakeholder Mission, **StRS**, **OpsCon**, **Feasibility**, Project Plan | MCR |
| 02 | [Requirements](skills/se-phase-02-requirements/) | SysRS (29148), Traceability, **MOE/MOP/TPM** | SRR |
| 03 | [Modeling (MBSE)](skills/se-phase-03-modeling/) | 7 SysML diagrams + coverage matrices | Model‑coverage |
| 04 | [Architecture & Design](skills/se-phase-04-architecture/) | Architecture Description (42010), ICD, Tech‑Stack Rationale | PDR |
| 05 | [Trade‑off & Decision](skills/se-phase-05-tradeoff/) | Decision Matrices (+sensitivity), Register, COCOMO | — |
| 06 | [Integration](skills/se-phase-06-integration/) | Integration Plan (increments, CI/CD, HIL) | CDR |
| 07 | [Verification](skills/se-phase-07-verification/) | Verification Matrix, V&V Plan | TRR |
| 08 | [Validation](skills/se-phase-08-validation/) | Test Plan, Test Cases | PRR |
| 09 | [Change & Configuration Mgmt](skills/se-phase-09-change-config/) | Change Plan, **CM Plan**, CR Log | Baselines current |
| 10 | [Operations & Continuous Validation](skills/se-phase-10-operations/) | Ops plan, SLOs, runbooks | ORR → GA |
| 11 | [Disposal & Retirement](skills/se-phase-11-disposal/) | Disposal Plan | DRR |

**8 cross‑cutting threads** run through every stage (see [`cross-cutting/`](cross-cutting/)): Risk & Opportunity · Configuration Management · Safety/RAMS · Security · Human Systems Integration · Measurement (MOE/MOP/TPM) · Cost/Schedule/EVM · Quality Assurance.

---

## What's in this folder

| Path | What it is |
|---|---|
| [`01_Workflow_Overview.md`](01_Workflow_Overview.md) | The spine — 12 stages, V‑model, ISO 15288 mapping, problem/solution space |
| [`02_AI_Systems_Engineer_Protocol.md`](02_AI_Systems_Engineer_Protocol.md) | How the AI runs each stage: interview, challenge, red‑team, advise, gate |
| [`03_Standards_Map.md`](03_Standards_Map.md) | Every standard/framework pinned to a stage or thread |
| [`04_Tailoring_Guide.md`](04_Tailoring_Guide.md) | Scale up/down — Minimum‑Viable vs Standard vs Formal |
| [`05_Conventions.md`](05_Conventions.md) | **The contract** — IDs, gates, methods, severity, naming, citations |
| [`skills/`](skills/) | The 12 stage guides (interview steps, decisions, prompts, deliverables, exit gates) |
| [`cross-cutting/`](cross-cutting/) | The 8 living discipline threads |
| [`templates/`](templates/) | Blank fill‑in template for every deliverable |
| [`prompts/`](prompts/) | Reusable AI prompt patterns + when to research / spawn agents |
| [`checklists/`](checklists/) | Gate‑review criteria + quality checklists |
| [`reference/`](reference/) | Deep theory ([Comprehensive Guide](reference/Comprehensive_Guide.md)) + [two‑page Playbook](reference/Full_Process_Playbook.md) |
| [`worked_example/`](worked_example/) | The canonical instance — EV Charging Station Network, Phase 00 → 11 |
| [`examples/`](examples/) | Three more end‑to‑end examples — [SaaS ATS](examples/2_SaaS_ATS/) · [IoT + edge‑AI](examples/3_IoT_Edge_AI/) · [AI work assistant](examples/4_Work_Assistant/) |
| [`project-starter/`](project-starter/) | Drop‑in **manual‑invocation** kit to copy into any new repo — 12 skills (`disable-model-invocation`), a lean `se-workflow/` reference, and a `WORKFLOW.md` map |
| [`00_Skills_Audit_Report.md`](00_Skills_Audit_Report.md) | Why this exists — the audit that drove the consolidation |

---

## Quickstart

- **Run a project:** *"Be my AI systems engineer for \<system\>."* → kickoff (identity → tailoring → stage 01) per the [Protocol](02_AI_Systems_Engineer_Protocol.md#9-starting-a-session-kickoff-script).
- **Jump to a stage:** *"Run Phase 4 architecture"* → loads [`skills/se-phase-04-architecture`](skills/se-phase-04-architecture/) (it reads prior‑phase outputs or flags what's missing).
- **Just learn the method:** read [`01_Workflow_Overview.md`](01_Workflow_Overview.md) → [`reference/Comprehensive_Guide.md`](reference/Comprehensive_Guide.md) → walk the [`worked_example/`](worked_example/).

---

## Principles this workflow enforces

- **Separate the problem from the solution** — sign off needs (StRS/OpsCon) before requirements.
- **Everything is traceable** — `need → requirement → design → test → change → SLO`, forward and backward.
- **No design is "best"** — decisions are auditable (weighted matrix + sensitivity).
- **Verification ≠ validation** — built it *right* (07) vs built the *right thing* (08).
- **Gates are decisions, not formalities** — Proceed / with‑actions / Hold / Re‑baseline / Stop.
- **Right‑size the rigour** — and record every tailoring decision.
- **Never invent** — unknowns become `TODO:` + a research recommendation.
