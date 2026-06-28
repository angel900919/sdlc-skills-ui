---
Document: Systems Engineering Management Plan — EV Charging Station Network (EVCN)
Document ID: SEMP-EVCN-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer / Chief Engineer (VoltVantage Systems LLC)
---

> Worked example. This SEMP governs **how** the EVCN engagement is run. It conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, T/I/A/D methods, S1–S4 severities, baselines, status strings, and the §9 standard citations, and realises the ISO/IEC/IEEE 15288:2023 Technical-Management processes. The lifecycle model here is **provisional**; it is bound in Phase 01 at MCR.

## 1. Purpose & scope

This SEMP governs the systems-engineering management of the EVCN for acquirer **MetroCharge Networks Inc.**, delivered by **VoltVantage Systems LLC** under SOW-EVCN-01 (see [`Agreement_Register.md`](Agreement_Register.md)). It conforms to [`../../05_Conventions.md`](../../05_Conventions.md) and operationalises the ISO/IEC/IEEE 15288:2023 Technical and Technical-Management processes.

- **Governs:** all four delivery tracks — (1) power electronics & charge-control firmware, (2) OCPP/ISO 15118 interoperability stack, (3) cloud platform + apps + dashboard, (4) hardware/firmware/cloud integration.
- **Tailoring level:** **Hybrid** — **Formal** artifact set on the safety-critical power/charge-control track; **Minimum-Viable-leaning Agile** on the cloud/app track (see §6).

## 2. SE process model

How the 12 workflow stages apply to EVCN, and which technical / technical-management processes are used.

- **Technical processes used:** Mission Analysis → Stakeholder Needs → System Requirements → System Analysis (MBSE) → Architecture → Design → Implementation → Integration → Verification → Transition → Validation → Operation → Maintenance → Disposal (full 12-stage spine; none silently skipped).
- **Stages tailored out:** none. (Production is treated as an explicit first-article-inspection checklist at PRR for the EVSE hardware — see §6 — because EVCN is a hardware/hybrid system per Overview §4.)
- **Stage iteration / sequencing:** follows the Hybrid lifecycle model in §5 — V-rigour (once-through, left/right paired) on the power/charge-control and OCPP/ISO 15118 tracks; 2-week Agile sprints on cloud/app; integration increments with hardware-in-the-loop bridge the two.

## 3. Organization & roles

| Role | Person | Gate-decision authority (RACI) |
|---|---|---|
| Lead SE / Chief Engineer | Dr. Amara Okafor (VoltVantage) | **A** on technical gates (SRR→PRR) |
| Technical Review Authority (chair) | Marco Ruiz, Program Director | A/R at each gate review |
| Acquirer review authority | Priya Nair, VP Network Programs (MetroCharge) | **A** on ATP / acceptance (PRR) |
| Power Electronics & Charge-Control Lead | Lena Holm (NordPower liaison) | **C** — owns Formal V-track readiness |
| Firmware / Protocol Lead (OCPP, ISO 15118, OCPI) | Sven Patel | C |
| Cloud / Backend Lead | Wei Zhang | C |
| Mobile / Web Lead | Rosa Klein | C |
| Systems & V&V Lead | TODO: name owed by VoltVantage | R on Verification/Validation matrices |
| Safety & Compliance Lead (UL 2594, PCI-DSS, GDPR) | Daniel Mbeki | C — owns Hazard Log + Threat Model gate inputs |
| Program / Project Manager | Marco Ruiz | A on cost/schedule |

> RACI legend: **A** accountable (one per decision), **R** responsible, **C** consulted. The chief engineer is accountable for technical gate verdicts; the acquirer is accountable for ATP and final acceptance.

## 4. Technical effort planning

How the technical processes are planned, assessed, and controlled, and how the 8 cross-cutting threads run and are reviewed at **every gate**. The threads are cross-referenced, not re-authored here.

- **Planning, assessment & control:** Agile cadence (2-week sprints) on cloud/app with a sprint review; V-track milestones tied to gates. TPM margins (availability, charge-start latency, DR-response time, OCPP conformance %) tracked sprint-over-sprint and reported at every gate. Earned-value reported monthly.
- **Decision management:** strategic trade studies recorded as `DEC-*` / `DM-*` in Phase 05 (e.g., SiC vs IGBT modules, edge-vs-cloud charge authorization). → [`../../05_Conventions.md`](../../05_Conventions.md) §2.3
- **Risk management:** living `RSK-*` / `OPP-*` register, scored Likelihood×Impact (Conventions §5.3), reviewed every gate. Seeded at Phase 00 (see §8). → `_cross_cutting/Risk_Opportunity_Register.md`
- **Configuration management:** document/code baselines & `CR-*` changes owned by Phase 09; repository, naming, and versioning set in the Project Enablement Plan. → Conventions §6.
- **Information management:** all artifacts in the project Git repo; naming `<TYPE>-EVCN-vX.Y`; status strings Draft → In Review → Baseline → Superseded per Conventions §6.
- **Measurement:** MOE/MOP/TPM defined from Phase 02; acquirer success measures (95% availability, ≤30 s charge start, ≤60 s DR response, 7-year log retention) seed the MOE set. → `_cross_cutting/TPM_Tracker.md`
- **Quality assurance:** ISO 9001:2015 QMS; QA cadence and FCA/PCA pointers in the Project Enablement Plan. → `_cross_cutting/QA_Plan.md`

## 5. Provisional lifecycle model

**Hybrid (V-Model + Agile)** — **PROVISIONAL**; the binding choice is made in Phase 01 at MCR (Conventions §3, Overview §7).

- **Likely model & why:** V-Model rigour is required on the **power-electronics & charge-control firmware** and **OCPP/ISO 15118** tracks — safety-critical (UL 2594 / IEC 61851-1) and conformance-tested interoperability demand traceable verification at each design level. Agile (2-week sprints) fits the cloud, billing, mobile, web, and dashboard tracks where fast user feedback dominates. The two tracks integrate at defined seams (OCPP 2.0.1 WebSocket, REST/OCPI APIs) covered by ICDs in Phase 04. SAFe-style scaling is applied *inside* the Hybrid for cross-team coordination, not as a peer base model (Overview §7).

## 6. Tailoring — Hybrid (Formal on the power/charge-control track)

Per the [Tailoring Guide](../../04_Tailoring_Guide.md). The engagement is **split-tailored**: the safety-critical track uses the **Formal** artifact set with **bidirectional** traceability (mandatory for UL 2594 / IEC 61851-1 safety threads); the cloud/app track uses a lighter Agile-aligned set. Every tailored-out artifact is recorded — Conventions §1 forbids silent skipping.

**Formal (power/charge-control + OCPP/ISO 15118 tracks):** full SysRS, SysML model set, frozen ICDs, Hazard Log, bidirectional Traceability Matrix, V&V evidence per requirement, first-article inspection at PRR.

**Lighter (cloud/app track):**
- tailored out (cloud/app only): formal per-sprint design review — replaced by Agile sprint review + PR review (Inspection per Conventions §4), with a design-of-record captured at PDR/CDR.
- tailored out (cloud/app only): standalone Parametric and Package SysML diagrams — model stays at the **7-of-9** working set (Conventions §7); Parametric added only if a charge-power/thermal constraint analysis warrants it on the hardware track.

> The Formal/Hybrid split satisfies the safety-critical traceability obligation (Conventions §8) on the power track while keeping the software track fast.

## 7. Gate & baseline plan

Gate ladder (Conventions §3):

```
ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA → DRR
00    01    02    04    06    07    08    10   10   11
```

Baselines this project will set (frozen at gate, changed only via `CR-*` in Phase 09):

| Baseline | Established at | Contains |
|---|---|---|
| Requirements / Functional | **SRR** | StRS, SysRS (29148), MOE/MOP set |
| Allocated | **PDR** | Architecture (42010), requirement-to-block allocation, ICD draft |
| Product | **CDR** | Frozen ICDs (OCPP/OCPI/OpenADR/payment), detailed design, build/config recipe |

EVCN is currently at **ATP** — Authority to Proceed (this phase). See the ATP exit-gate result in the Phase 00 set.

## 8. Cross-cutting thread plan

One line per thread, naming its register and review cadence. Stubs opened at Phase 00 so every thread is alive from gate one (Overview §1).

| Thread | Register | Review cadence |
|---|---|---|
| Risk & Opportunity | `_cross_cutting/Risk_Opportunity_Register.md` | every gate + monthly |
| Configuration Mgmt | `_cross_cutting/Configuration_Item_Register.md` | every gate (baselines at SRR/PDR/CDR) |
| Safety / RAMS | `_cross_cutting/Hazard_Log.md` | **every gate** — safety-critical (UL 2594 / IEC 61851-1); shock, thermal runaway, ground-fault hazards |
| Security | `_cross_cutting/Threat_Model.md` | every gate + at each data-flow change (STRIDE; PCI-DSS 4.0, GDPR) |
| HSI (Human Systems Integration) | `_cross_cutting/QA_Plan.md` (HSI section) | at PDR/CDR — driver UX, ADA accessibility, technician lockout/tagout |
| Measurement (MOE/MOP/TPM) | `_cross_cutting/TPM_Tracker.md` | every gate |
| Cost / Schedule / EVM | `_cross_cutting/Cost_Schedule_EVM_Tracker.md` | monthly + every gate |
| Quality | `_cross_cutting/QA_Plan.md` | every gate (FCA/PCA at PRR) |

## 9. References

- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs, gates (incl. ATP), T/I/A/D, S1–S4 severities, baselines, status strings, §9 citations.
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — 12-stage spine, V-model, 15288 four-process-group mapping (§3).
- [`Agreement_Register.md`](Agreement_Register.md) · [`Project_Enablement_Plan.md`](Project_Enablement_Plan.md).
- Standards: ISO/IEC/IEEE 15288:2023 · ISO/IEC/IEEE 29148:2018 · ISO/IEC/IEEE 42010:2022 · INCOSE SE Handbook v5 (2023) · NASA/SP-2016-6105 Rev 2 · ISO 9001:2015 · ISO 31000:2018 · ISO 10007:2017. Domain: UL 2594, IEC 61851-1, OCPP 2.0.1, ISO 15118, OCPI 2.2.1, OpenADR 2.0b, PCI-DSS 4.0, GDPR/CCPA.
- Cross-cutting threads: [cross-cutting threads](../../cross-cutting/).
