---
Document: Systems Engineering Management Plan — <Project Name>
Document ID: SEMP-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer / Chief Engineer
---

<!--
TEMPLATE — Phase 00 (Agreement & Enablement). Owning skill: se-phase-00-agreement.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO.
This SEMP governs HOW the engagement is run. It conforms to ../05_Conventions.md
and ISO/IEC/IEEE 15288:2023 — it cites IDs/gates/severities/citations, never redefines them.
The lifecycle model here is PROVISIONAL; it is bound in Phase 01 at MCR.
Rows marked "(example — delete)" are illustrative only.
-->

## 1. Purpose & scope

This SEMP governs the systems-engineering management of <Project Name>. It conforms to
[`../05_Conventions.md`](../05_Conventions.md) for all IDs, gates, T/I/A/D methods,
S1–S4 severities, baselines, status strings, and standard citations, and realises the
ISO/IEC/IEEE 15288:2023 Technical-Management processes for the engagement.

- **Governs:** <which deliverables / tracks this SEMP applies to>
- **Tailoring level:** <Minimum-Viable | Formal> (see §6)

## 2. SE process model

How the 12 workflow stages apply to this project, and which technical and
technical-management processes are used.

- **Technical processes used:** <Mission Analysis → Stakeholder Needs → System Requirements → Architecture → … → Disposal>
- **Stages tailored out:** <none | list with reason — see §6>
- **Stage iteration / sequencing:** <follows the chosen lifecycle model in §5>

## 3. Organization & roles

| Role | Person | Gate-decision authority (RACI) |
|---|---|---|
| Lead SE / Chief Engineer | TODO: name | A on technical gates |
| Technical Review Authority | TODO: name | A/R at gate reviews |
| <Discipline lead — e.g. Software> | TODO: name | C |
| <Discipline lead — e.g. Hardware> | TODO: name | C |
| <Discipline lead — e.g. Safety/Security> | TODO: name | C |
| Program / Project Manager | TODO: name | A on cost/schedule |
| Jane Roe | Lead SE / Chief Engineer | A on technical gates | <!-- (example — delete) -->

## 4. Technical effort planning

How the technical processes are planned, assessed, and controlled, and how the
8 cross-cutting threads are run and reviewed at every gate. Cross-reference the threads;
do not re-author them here.

- **Planning, assessment & control:** <cadence; how progress and TPM margins are tracked>
- **Decision management:** Trade studies recorded as `DEC-*` / `DM-*` in Phase 05. → [`../cross-cutting/`](../cross-cutting/)
- **Risk management:** living `RSK-*` / `OPP-*` register, reviewed every gate. → [`../cross-cutting/Risk_and_Opportunity_Management.md`](../cross-cutting/Risk_and_Opportunity_Management.md)
- **Configuration management:** baselines & CRs owned by Phase 09. → [`../cross-cutting/Configuration_Management.md`](../cross-cutting/Configuration_Management.md)
- **Information management:** <repository & naming per Conventions §6>
- **Measurement:** MOE/MOP/TPM tracked from Phase 02. → [`../cross-cutting/Measurement_MOE_MOP_TPM.md`](../cross-cutting/Measurement_MOE_MOP_TPM.md)
- **Quality assurance:** see the Project Enablement Plan and the QA thread. → [`../cross-cutting/Quality_Assurance.md`](../cross-cutting/Quality_Assurance.md)

## 5. Provisional lifecycle model

<Hybrid | V-Model | Waterfall | Spiral | Agile> — **PROVISIONAL**; the binding choice
is made in Phase 01 at MCR (Conventions §3, Overview §7). Do not treat as final here.

- **Likely model & why (one line):** <rationale>

## 6. Tailoring — <Minimum-Viable | Formal>

Per the [Tailoring Guide](../04_Tailoring_Guide.md). Every tailored-out artifact is
recorded — Conventions §1 forbids silent skipping.

- tailored out: <artifact> — <reason>
- tailored out: <artifact> — <reason>
- tailored out: COCOMO_Estimate.md — low-cost prototype; ROM estimate sufficient <!-- (example — delete) -->

> Safety-critical / regulated work (DO-178C, ISO 26262, IEC 62304, IEC 61508) → use the
> **Formal** set with bidirectional traceability.

## 7. Gate & baseline plan

Gate ladder (Conventions §3):

```
ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA → DRR
```

Baselines this project will set (frozen at gate, changed only via `CR-*` in Phase 09):

| Baseline | Established at | Contains |
|---|---|---|
| Requirements / Functional | SRR | StRS, SysRS, MOE/MOP set |
| Allocated | PDR | Architecture, requirement-to-block allocation, ICD draft |
| Product | CDR | Frozen ICDs, detailed design, build/config recipe |

## 8. Cross-cutting thread plan

One line per thread, naming its register and review cadence.

| Thread | Register | Review cadence |
|---|---|---|
| Risk & Opportunity | _cross_cutting/Risk_Opportunity_Register.md | every gate |
| Configuration Mgmt | _cross_cutting/<CM register> | every gate |
| Safety / RAMS | _cross_cutting/Hazard_Log.md | <cadence — or "N/A: not safety-critical"> |
| Security | _cross_cutting/Threat_Model.md | <cadence — or "N/A"> |
| HSI (Human Systems Integration) | _cross_cutting/<HSI register> | <cadence> |
| Measurement (MOE/MOP/TPM) | _cross_cutting/TPM_Tracker.md | every gate |
| Cost / Schedule / EVM | _cross_cutting/<cost register> | <cadence> |
| Quality | _cross_cutting/QA_Plan.md | every gate |

## 9. References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs, gates, T/I/A/D, severities, baselines, status strings, §9 citations.
- [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) — 12-stage spine, V-model, 15288 process-group mapping.
- Standards: ISO/IEC/IEEE 15288:2023 · INCOSE SE Handbook v5 (2023) · NASA/SP-2016-6105 Rev 2 · ISO 9001:2015 · ISO 31000:2018 · ISO 10007:2017.
- Cross-cutting threads: [`../cross-cutting/`](../cross-cutting/).
