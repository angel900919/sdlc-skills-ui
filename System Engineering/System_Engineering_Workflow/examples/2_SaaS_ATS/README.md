---
Document: TalentFlow — System at a Glance
Document ID: README-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

# TalentFlow — Multi-Tenant B2B SaaS Applicant Tracking System

A worked example applying the reusable SE workflow (Phases 00–11, per Conventions §1) to a **pure-software, cloud-native, multi-tenant SaaS** product. This example demonstrates the **software-leaning tailoring path**: Production collapses to release/deploy (no manufacturing, no HIL), Disposal is software end-of-life (tenant offboarding + secure data destruction), and the heaviest engineering threads are **Security, Privacy, Measurement (SLOs), and Quality**.

> **Mission.** Give recruiting teams a single, trustworthy system to source, track, evaluate, and hire candidates faster — with strict per-tenant data isolation, provable privacy (GDPR/CCPA right-to-erasure), and the availability and latency a hiring team depends on every working day.

## Standards it must meet (per Conventions §9)

| Thread | Standards / obligations |
|---|---|
| SE lifecycle | ISO/IEC/IEEE 15288:2023; INCOSE SE Handbook v5 (2023) |
| Requirements | ISO/IEC/IEEE 29148:2018 (BRS · StRS · SyRS · OpsCon) |
| Security | ISO/IEC 27001:2022; NIST SP 800-53 Rev. 5; NIST SP 800-160; SOC 2 Type II (audit obligation) |
| Privacy | GDPR (Arts. 5, 17, 28, 30, 32, 35), CCPA/CPRA — controller/processor split, DPA, right-to-erasure |
| Identity | SAML 2.0 SSO, SCIM 2.0 provisioning, OAuth 2.0 / OIDC |
| Payments | PCI-DSS via tokenized Stripe (SAQ-A scope — no PAN touches TalentFlow) |
| Accessibility | WCAG 2.2 AA |
| Test / V&V | IEEE 1012-2016; ISO/IEC/IEEE 29119-3:2021 |
| Data destruction | NIST SP 800-88 Rev. 1 (crypto-erase of tenant data at EOL) |

## Lifecycle model

**Agile / SAFe** (Conventions §1 tailoring; SAFe recorded only as a Hybrid scaling note). All tracks are software, so a single Agile lifecycle governs delivery, with a **Formal overlay on the Privacy, Security, and multi-tenant-isolation tracks** (threat modeling, DPIA, isolation proofs, and signed gate evidence are mandatory there). Gate ladder per Conventions §3: ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA → DRR.

## Phase index

| Phase | Folder | Gate | Key deliverables | Status |
|---|---|---|---|---|
| 00 — Agreement & Enablement | `Phase_00_Agreement/` | ATP | Agreement_Register, SEMP, Enablement Plan | TODO |
| 01 — Concept | `Phase_01_Concept/` | **MCR** | [`Concept.md`](Phase_01_Concept/Concept.md) (mission, STK-*, SN-*, SCN-*, MOE-*, feasibility, RSK-*) | Draft |
| 02 — Requirements | `Phase_02_Requirements/` | **SRR** | [`SysRS.md`](Phase_02_Requirements/SysRS.md) (REQ-*, MOP-*/TPM-*, modes, trace) | Draft |
| 03 — Modeling (MBSE) | `Phase_03_Modeling/` | Model coverage | 7-of-9 SysML `.puml` + coverage | TODO |
| 04 — Architecture & Design | `Phase_04_Architecture/` | **PDR** | Architecture_Description (42010), ICD-*, Tech_Stack_Rationale | TODO |
| 05 — Trade-off & Decision | `Phase_05_Tradeoff/` | Decisions traced | DM-*, DEC-*, COCOMO II est. | TODO |
| 06 — Integration | `Phase_06_Integration/` | **CDR** | Integration_Plan (INC-*, CI/CD) | TODO |
| 07 — Verification | `Phase_07_Verification/` | **TRR** | Verification_Matrix (TC-VER-*) | TODO |
| 08 — Validation | `Phase_08_Validation/` | **PRR** | [`Validation.md`](Phase_08_Validation/Validation.md) (Test Plan + TC-VAL-*) | Draft |
| 09 — Change & Config Mgmt | `Phase_09_Change_Config/` | Baselines current | CM/Change plans, CR log, CI-* | TODO |
| 10 — Operations & Cont. Validation | `Phase_10_Operations/` | **ORR** → GA | Ops & Cont. Validation, SLO-*, RB-* | TODO |
| 11 — Disposal & Retirement | `Phase_11_Disposal/` | **DRR** | Disposal_Plan (offboarding, crypto-erase) | TODO |

## Traceability spine (representative threads)

The golden thread `SN → REQ → design block → TC` (Conventions §8). A few illustrative threads carried from Concept into Requirements and forward:

| Stakeholder need | derives → Requirement | satisfied by block | verified by |
|---|---|---|---|
| **SN-04** Per-tenant data isolation guaranteed | **REQ-SEC-01** (tenant-scoped authZ on every data access) | Tenant Isolation Layer | TC-VER-TBD |
| **SN-05** Candidate right-to-erasure honored | **REQ-SEC-08** (erasure ≤ 30 days, cascade + crypto-erase) | Privacy & Erasure Service | TC-VER-TBD |
| **SN-01** Recruiters move candidates through the pipeline fast | **REQ-F-01** / **REQ-P-01** (pipeline transition; p95 read ≤ 400 ms) | Candidate Pipeline Service | TC-VER-TBD |
| **SN-06** The product is reliably available during the workday | **REQ-O-01** (≥ 99.9% monthly availability) → **TPM-01** | Platform / SRE | TC-VER-TBD |
| **SN-03** Identity flows through the customer's IdP | **REQ-INT-01** (SAML 2.0 SSO) / **REQ-INT-02** (SCIM 2.0) | Identity & SSO Gateway | TC-VER-TBD |

Full forward/backward matrix: [`Phase_02_Requirements/SysRS.md`](Phase_02_Requirements/SysRS.md) §11. Measurement set (MOE/MOP/TPM) is defined in SysRS §10 and tracked through Phases 06–10.

## Conventions

This example conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, T/I/A/D methods, S1–S4 severity, baselines, document frontmatter (§6), and standard citations (§9). Internal links are relative within this folder; no external file links are added.
