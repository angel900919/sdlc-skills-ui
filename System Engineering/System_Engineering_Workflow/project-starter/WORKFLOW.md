# <PROJECT NAME> — Systems Engineering Workflow Map

> **Your front‑of‑me runbook.** Work top to bottom. For each stage: skim the deliverables, **run the `/command`** (you invoke it — nothing auto‑fires), answer the interview, produce the artifacts, **decide the gate**, then advance. The skill you run will also tell you the next command. Keep this file open and tick the boxes.
>
> Status key: `☐` not started · `▶` in progress · `✅` gate passed · `⏸` on hold · `⏭` tailored out (record why).

---

## You are here

| | |
|---|---|
| **Project** | `<PROJECT NAME>` (`<slug>`) |
| **Domain / region** | `<e.g. SaaS · EU/AU — GDPR>` |
| **Lifecycle model** | `<Waterfall / V / Spiral / Agile / Hybrid>` *(set in Phase 01)* |
| **Tailoring profile** | `<Minimum‑Viable / Standard / Formal>` — `<note any per‑track Formal areas>` |
| **Current stage** | `<—>` |
| **Last gate passed** | `<—>` |

---

## The 12 stages

| ✓ | # | Stage | Run this | Key deliverables | Exit gate |
|---|---|---|---|---|---|
| ☐ | 00 | [Agreement & Enablement](.claude/skills/se-phase-00-agreement/SKILL.md) | `/se-phase-00-agreement` | SEMP · Agreement Register · Enablement Plan | **ATP** |
| ☐ | 01 | [Concept](.claude/skills/se-phase-01-concept/SKILL.md) | `/se-phase-01-concept` | Stakeholder Mission · StRS · OpsCon · Feasibility · Project Plan | **MCR** |
| ☐ | 02 | [Requirements](.claude/skills/se-phase-02-requirements/SKILL.md) | `/se-phase-02-requirements` | SysRS (29148) · Traceability · MOE/MOP/TPM | **SRR** |
| ☐ | 03 | [Modeling (MBSE)](.claude/skills/se-phase-03-modeling/SKILL.md) | `/se-phase-03-modeling` | 7 SysML diagrams + coverage matrices | Model‑coverage |
| ☐ | 04 | [Architecture & Design](.claude/skills/se-phase-04-architecture/SKILL.md) | `/se-phase-04-architecture` | Architecture Description (42010) · ICD · Tech‑Stack Rationale | **PDR** |
| ☐ | 05 | [Trade‑off & Decision](.claude/skills/se-phase-05-tradeoff/SKILL.md) | `/se-phase-05-tradeoff` | Decision Matrices (+sensitivity) · Register · COCOMO | Decisions traced |
| ☐ | 06 | [Integration](.claude/skills/se-phase-06-integration/SKILL.md) | `/se-phase-06-integration` | Integration Plan (increments · CI/CD · HIL) | **CDR** |
| ☐ | 07 | [Verification](.claude/skills/se-phase-07-verification/SKILL.md) | `/se-phase-07-verification` | Verification Matrix · V&V Plan | **TRR** |
| ☐ | 08 | [Validation](.claude/skills/se-phase-08-validation/SKILL.md) | `/se-phase-08-validation` | Test Plan · Test Cases (TC‑VAL) | **PRR** |
| ☐ | 09 | [Change & Configuration Mgmt](.claude/skills/se-phase-09-change-config/SKILL.md) | `/se-phase-09-change-config` | Change Plan · CM Plan · CR Log | Baselines current |
| ☐ | 10 | [Operations & Continuous Validation](.claude/skills/se-phase-10-operations/SKILL.md) | `/se-phase-10-operations` | Ops plan · SLOs · runbooks | **ORR → GA** |
| ☐ | 11 | [Disposal & Retirement](.claude/skills/se-phase-11-disposal/SKILL.md) | `/se-phase-11-disposal` | Disposal Plan | **DRR** |

> Gate ladder: **ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA … DRR**. A gate is a decision — *Proceed · Proceed‑with‑actions · Hold · Re‑baseline · Stop* — log it below.

---

## Cross‑cutting threads (keep alive every stage · review at every gate)

| ✓ | Thread | Reference | Living artifact |
|---|---|---|---|
| ☐ | Risk & Opportunity | [se-workflow/cross-cutting/Risk_and_Opportunity_Management.md](se-workflow/cross-cutting/Risk_and_Opportunity_Management.md) | `Risk_Opportunity_Register.md` (RSK/OPP) |
| ☐ | Configuration Mgmt | [se-workflow/cross-cutting/Configuration_Management.md](se-workflow/cross-cutting/Configuration_Management.md) | CI register · baselines |
| ☐ | Safety / RAMS | [se-workflow/cross-cutting/Safety_RAMS_Engineering.md](se-workflow/cross-cutting/Safety_RAMS_Engineering.md) | `Hazard_Log.md` (HAZ) · Safety Case |
| ☐ | Security | [se-workflow/cross-cutting/Security_Engineering.md](se-workflow/cross-cutting/Security_Engineering.md) | `Threat_Model.md` (THR) |
| ☐ | Human Systems Integration | [se-workflow/cross-cutting/Human_Systems_Integration.md](se-workflow/cross-cutting/Human_Systems_Integration.md) | `HSI_Plan.md` |
| ☐ | Measurement (MOE/MOP/TPM) | [se-workflow/cross-cutting/Measurement_MOE_MOP_TPM.md](se-workflow/cross-cutting/Measurement_MOE_MOP_TPM.md) | `TPM_Tracker.md` |
| ☐ | Cost / Schedule / EVM | [se-workflow/cross-cutting/Cost_Schedule_EVM.md](se-workflow/cross-cutting/Cost_Schedule_EVM.md) | WBS · EVM tracker |
| ☐ | Quality Assurance | [se-workflow/cross-cutting/Quality_Assurance.md](se-workflow/cross-cutting/Quality_Assurance.md) | `QA_Plan.md` |

---

## Gate decision log

| Date | Gate | Decision | Open actions (owner · due) | Notes |
|---|---|---|---|---|
| `<YYYY-MM-DD>` | `<ATP>` | `<Proceed / …>` | `<—>` | `<—>` |

---

## How to drive this

1. **You invoke; nothing auto‑fires.** Each skill is `disable-model-invocation: true`. Type the `/command` for the stage you're ready to do (or pick it from the `/` menu).
2. **The skill runs the stage:** reads your prior‑phase artifacts, interviews you one topic at a time, drafts the deliverables into `Phase_NN_*/`, checks the exit gate, and **names the next command**.
3. **You decide the gate**, then tick it here and move on. Hold or re‑baseline whenever the evidence says so.
4. **Reference, anytime:** the method lives in [`se-workflow/`](se-workflow/) — the [Conventions](se-workflow/05_Conventions.md) (IDs, gates, severity), the [AI Systems Engineer Protocol](se-workflow/02_AI_Systems_Engineer_Protocol.md), the [Tailoring Guide](se-workflow/04_Tailoring_Guide.md), [Standards Map](se-workflow/03_Standards_Map.md), [templates](se-workflow/templates/), [prompts](se-workflow/prompts/), and [checklists](se-workflow/checklists/).
5. **Worked examples & the theory KB** are not bundled here (kept lean) — see the master `System_Engineering_Workflow/` (EV Charging Network, SaaS ATS, IoT + edge‑AI, AI work assistant).

> Tip: you don't have to start at 00. Start at **01 Concept** for a new build; jump straight to any stage — each skill detects what prior artifacts exist and flags what's missing.
