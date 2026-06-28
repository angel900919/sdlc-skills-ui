---
Document: Project Enablement Plan — EV Charging Station Network (EVCN)
Document ID: PEP-EVCN-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer (VoltVantage Systems LLC)
---

> Worked example. Frames the ISO/IEC/IEEE 15288:2023 **Organizational Project-Enabling** processes for EVCN (Infrastructure, Quality, Knowledge, Lifecycle-Model Management). Portfolio & HR depth are org-level and explicitly out of scope — tagged `Source: acquiring org`. Conforms to [`../../05_Conventions.md`](../../05_Conventions.md) §6 for naming/versioning.

## 1. Infrastructure & tools

| Capability | Tool / Standard | Status (org-standard / TBD) | Source |
|---|---|---|---|
| Requirements management | Markdown SysRS to ISO/IEC/IEEE 29148:2018 (this repo) | org-standard (VoltVantage) | supplier |
| Modeling / MBSE | PlantUML (7-of-9 SysML working set; Conventions §7) | org-standard | supplier |
| Code — firmware | Rust + C (Station Controller, charge-control) | org-standard | supplier |
| Code — backend / apps | Go (CSMS/billing) · Flutter (mobile) · TypeScript (web/dashboard) | org-standard | supplier |
| CI / CD | GitHub Actions; container builds; Argo CD (cloud GitOps) | org-standard | supplier |
| Test | PyTest · Postman · Playwright · k6 · OCA-certified OCPP test tool · ISO 15118 conformance suite | org-standard | supplier |
| Hardware-in-the-loop (HIL) | EVSE HIL rig + grid/DR simulator (OpenADR 2.0b VTN sim) | TBD — rig procurement | supplier (NordPower assist) |
| Observability | Prometheus + Grafana + OpenTelemetry; Loki (logs) | org-standard | supplier |
| Document / CM repository | Git + GitHub (artifacts, baselines); Jira (CR-* tracking) | org-standard | supplier |
| Payment / PCI environment | Tokenized PSP (StripePay-EV), segmented PCI-DSS 4.0 scope | TBD — PSP onboarding | acquiring org + PSP |

## 2. Quality management / QA

- **Applicable QMS:** **ISO 9001:2015** (VoltVantage QMS); MetroCharge supplier-quality requirements apply per MSA-MCN-2026-014. `Source: acquiring org` for acquirer-side audit rights.
- **QA cadence:** QA review at **every gate** (Conventions §3); STRIDE security review at each architecture change; GDPR Article 35 DPIA at each driver-PII data-flow change.
- **Audit / FCA-PCA pointers:** Functional & Physical Configuration Audits (FCA/PCA) occur at **PRR** (owned by Phase 08) — named here only. UL 2594 NRTL audit and PCI-DSS 4.0 QSA assessment are independent acceptance gates feeding AC-06 / AC-07.
- → QA thread: [cross-cutting/Quality_Assurance.md](../../cross-cutting/Quality_Assurance.md)

## 3. Knowledge management

- **Repository / where artifacts live:** project Git monorepo (`evcn/`), folder layout per Conventions §10 (`Phase_00_Agreement/` … `_cross_cutting/`).
- **Naming & versioning:** per [`../../05_Conventions.md`](../../05_Conventions.md) §6 — `<TYPE>-EVCN-vX.Y`; status strings Draft → In Review → Baseline (`<GATE>`-approved) → Superseded; baselined artifacts change only via `CR-*` (Phase 09).
- **Lessons-learned capture:** per-sprint retro notes + per-gate review minutes logged in the repo; consolidated into a lessons-learned register that **feeds Phase 11 (Disposal)** and the next rollout phase (50→500 stations).

## 4. Lifecycle-model management

- **Owner of the chosen lifecycle model:** Lead SE / Chief Engineer (Dr. Amara Okafor).
- **Tailoring governance:** the Hybrid Formal/Agile split (SEMP §6) is governed by the Technical Review Authority; any change to a track's tailoring level is a `CR-*` against the SEMP (Phase 09) and is reviewed at the next gate. The Safety & Compliance Lead must concur on any tailoring change touching the Formal power/charge-control track.
- **Binding decision point:** the lifecycle model is **provisional** in the SEMP and **bound in Phase 01 at MCR** (Conventions §3, Overview §7).

## 5. Human-resource & funding enablement (light)

ATP precondition: confirm the team is **authorised and funded**. Portfolio / HR staffing depth is org-level and out of scope.

- **Team authorised:** Yes — the 25-person delivery org (power electronics, firmware, cloud, mobile/web, systems & V&V, compliance, PM) is staffed and assigned to SOW-EVCN-01.
- **Funding authorised:** Conditional — pilot mobilization funding released at ATP; subsequent milestone releases tied to SRR/PDR/CDR/PRR/GA. TODO: confirm firm-fixed-price pilot ceiling owed by MetroCharge contracts (also a REQ-C seed in the Agreement Register §7).
- **Portfolio / HR staffing depth:** `Source: acquiring org` (MetroCharge program portfolio) and supplier HR.

## 6. Enablement gaps / TODO

| Gap | Owner | Due |
|---|---|---|
| Procure & stand up EVSE HIL rig + OpenADR VTN simulator | VoltVantage Embedded Lead | TODO: before Phase 06 integration |
| Onboard tokenized PSP and segment the PCI-DSS 4.0 environment | VoltVantage Cloud Lead + MetroCharge Compliance | TODO: before payment integration (Phase 06) |
| Confirm firm-fixed-price pilot budget ceiling | MetroCharge contracts | TODO: before SRR |
| Book UL 2594 NRTL test capacity and PCI-DSS QSA engagement | VoltVantage Safety & Compliance Lead | TODO: Q1 (engage QSA early per risk R-03) |
| Confirm acquirer-side QA audit rights & cadence | MetroCharge supplier quality | TODO: before SRR |
