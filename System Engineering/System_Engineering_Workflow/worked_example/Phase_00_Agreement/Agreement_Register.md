---
Document: Agreement Register — EV Charging Station Network (EVCN)
Document ID: AGR-EVCN-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer (VoltVantage SE)
---

> Worked example. This register frames the ISO/IEC/IEEE 15288:2023 **Agreement** processes (Acquisition + Supply) for the EVCN engagement. It conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gate names (ATP), T/I/A/D codes, severities, status strings, and standard citations — it does not redefine them. Procurement-heavy detail is intentionally light and tagged `Source: acquiring org / contracts team`.

## 1. Engagement summary

- **What is being acquired/built:** A 24/7 public **EV Charging Station Network (EVCN)** — Level 2 AC (7–22 kW) and DC Fast (50–350 kW) charging stations with edge Station Controllers, a cloud CSMS/billing/monitoring backend, driver mobile/web apps, an operator dashboard, grid-aware demand-response control, and OCPI roaming.
- **For whom (acquirer):** **MetroCharge Networks Inc.** — a regional **Charge-Point Operator (CPO)** building out a 500-station public network across three metro markets.
- **Domain:** EV infrastructure / energy IoT (regulated payment + electrical safety).
- **System type:** **Hybrid** (power-electronics + firmware hardware tracks; cloud/mobile software tracks).
- **Engagement type:** External contract — distinct paying acquirer (CPO) and delivery supplier (systems integrator), so acquirer ≠ supplier.

## 2. Acquisition vehicle

- **Type:** Formal contract (against an RFP/SOW response).
- **Document name / number:** Master Services Agreement **MSA-MCN-2026-014**, executing **SOW-EVCN-01** (System Design, Build & Deploy — Phase 1, 50-station pilot, options to 500).
- **Date:** Contract executed **2026-05-18**; SOW-EVCN-01 effective **2026-06-01**.
- **Source documents read:** MetroCharge RFP "Public Fast-Charge Network — Design & Build" (RFP-MCN-EVCN-2026); supplier proposal & SOW-EVCN-01; draft MSA red-lines; MetroCharge IT security policy (MCN-SEC-POL-v4, `Source: acquiring org`).

## 3. Parties & roles

| Party | Role (Acquirer / Supplier / Sub-tier) | Authorised POC | Decision authority |
|---|---|---|---|
| **MetroCharge Networks Inc.** (CPO) | Acquirer | Priya Nair, VP Network Programs | Accepts deliverables, releases milestone funding, owns ATP/PRR sign-off |
| **VoltVantage Systems LLC** | Supplier (prime / systems integrator) | Marco Ruiz, Program Director | Delivers system + SE artifacts; owns technical baselines & gate readiness |
| **NordPower Electronics AB** | Sub-tier supplier — EVSE power modules (SiC rectifier, contactor stack) | Lena Holm, Account Eng. | Delivers UL 2594 / IEC 61851-1 compliant power hardware; FAI evidence |
| **StripePay-EV (PSP)** | Sub-tier supplier — tokenized payment service provider | TODO: name owed by VoltVantage contracts | Provides PCI-DSS 4.0 SAQ-D scope reduction; settlement |
| **GridLink Utility Services** | Sub-tier partner — OpenADR 2.0b DR aggregator | TODO: name owed by MetroCharge | Provides DR signaling endpoint + interconnection liaison |
| **Bureau Veritas / UL** (NRTL) | Independent certification body (acceptance witness) | Assigned at test booking | Issues UL 2594 listing; witnesses safety acceptance |

## 4. Scope of agreement

**In scope (supplier deliverables)** — each mapped to a future-phase artifact:

| Obligation | Maps to future-phase deliverable |
|---|---|
| Baselined system requirements specification (ISO/IEC/IEEE 29148) | `SysRS.md` at **SRR** (Phase 02) |
| SysML model set (7-of-9 diagrams) + coverage matrices | Phase 03 model coverage gate |
| Architecture description (ISO 42010) + frozen ICDs + tech-stack rationale | `Architecture_Description.md` / `ICD.md` at **PDR→CDR** (Phase 04/06) |
| EVSE hardware + Station Controller firmware (L2 AC + DCFC) | Product baseline at **CDR**; engineering samples Phase 06 |
| Cloud CSMS (OCPP 2.0.1), billing, identity, monitoring; mobile/web apps; operator dashboard | Integration increments (Phase 06); released system at **PRR** (Phase 08) |
| OCPI 2.2.1 roaming integration + OpenADR 2.0b grid integration | Interface verification at **TRR** (Phase 07) |
| Verification matrix + V&V evidence (100% coverage by method) | `Verification_Matrix.md` at **TRR** (Phase 07) |
| 50-station pilot deployment, runbooks, SLOs, on-call setup | `Operations_Continuous_Validation.md` at **ORR→GA** (Phase 10) |
| UL 2594 listing + PCI-DSS 4.0 attestation (AoC) | Acceptance evidence at **PRR** (Phase 08) |

**Out of scope** (explicit exclusions):

- Grid-side hardware (utility transformers, switchgear, service upgrades) and the interconnection approval itself — `Source: acquiring org / utility`.
- Site civil works (trenching, foundations, mounting, signage, ADA stall striping).
- EV onboard hardware / vehicle-side ISO 15118 conformance (vehicle OEM responsibility).
- Real-estate acquisition, site-host lease negotiation, and revenue-share contracts.
- Ongoing electricity supply contracts and utility tariff negotiation.
- Insurance, warranty-claims administration, and field maintenance staffing beyond the pilot stabilization window.

## 5. Acceptance criteria

Conditions under which **MetroCharge** will accept the delivered system. Accept method uses the four codes from Conventions §4 (T/I/A/D). These execute as a **validation** activity in Phase 08 at PRR (the code is assigned now; the test runs later).

| ID | Criterion | Threshold | Accept method (T/I/A/D) | Acceptance authority | Status |
|---|---|---|---|---|---|
| **AC-01** | Public station availability across the pilot fleet | ≥ 95% monthly availability per station, measured over a 60-day acceptance window | T | MetroCharge VP Network Programs | Open |
| **AC-02** | Driver time from arrival to energy delivery (RFID/app/contactless auth) | ≤ 30 s p95 from plug-in to charge start | T | MetroCharge Product Lead | Open |
| **AC-03** | Emergency stop response (E-Stop / fault) cuts energy delivery | ≤ 100 ms, witnessed against UL 2594 / IEC 61851-1 | T | NRTL (UL/BV) witness + Safety Lead | Open |
| **AC-04** | OCPP 2.0.1 interoperability against the OCA-certified test suite | 100% of mandatory conformance cases pass | T | MetroCharge Integration Lead | Open |
| **AC-05** | OpenADR 2.0b demand-response curtailment applied network-wide | ≤ 60 s from signal receipt to throttled output | T | GridLink + MetroCharge Ops | Open |
| **AC-06** | Payment path is PCI-DSS 4.0 compliant (tokenized PSP, SAQ-D scope) | Valid Attestation of Compliance (AoC) issued by QSA | I | MetroCharge Compliance Officer | Open |
| **AC-07** | Electrical safety listing for all EVSE variants | UL 2594 listing certificate issued | I | NRTL (UL/BV) | Open |
| **AC-08** | OCPI 2.2.1 roaming session settles end-to-end with a partner network | Successful authorize → session → CDR settlement demonstrated with ≥ 1 roaming partner | D | MetroCharge Roaming Manager | Open |
| **AC-09** | Tamper-evident session/audit log retention for regulatory audit | 7-year retention; any session reconstructable on demand | A | MetroCharge Compliance Officer | Open |
| **AC-10** | First-time-fix rate on field service during stabilization | TODO: threshold owed by MetroCharge Ops (target ≈ 80%, not yet contractually fixed) | T | MetroCharge Field Ops Manager | Open |

> AC-10 threshold is **not** yet committed by the acquirer — recorded as `TODO:` rather than invented.

## 6. Commercial frame (light)

> Shallow on purpose. Procurement-heavy rows are tagged `Source: acquiring org / contracts team` and stop here.

- **Contract type:** Firm-fixed-price for the 50-station pilot (scope well understood); time-&-materials option line for the 500-station rollout (scope to be re-baselined). `Source: acquiring org / contracts team`.
- **Payment / funding milestones:**
  | Milestone | Triggers payment / funding release |
  |---|---|
  | ATP (this phase) | Mobilization payment — `Source: acquiring org / contracts team` |
  | SRR (requirements baseline) | Milestone 1 release — `Source: acquiring org / contracts team` |
  | PDR / CDR (design baselines) | Milestone 2/3 release — `Source: acquiring org / contracts team` |
  | PRR (acceptance, UL + PCI evidence) | Milestone 4 release — `Source: acquiring org / contracts team` |
  | GA (pilot live + 60-day acceptance window) | Retention release — `Source: acquiring org / contracts team` |
- **Warranty / support period:** 12-month workmanship warranty on EVSE hardware + 90-day software stabilization support post-GA. `Source: acquiring org / contracts team`.
- **IP / licensing stance:** MetroCharge owns deliverable artifacts and deployment configuration; VoltVantage retains background IP and reusable framework code under a perpetual license. `Source: acquiring org`.
- **Penalties / liquidated damages:** Availability LD if AC-01 (95%) is missed over the acceptance window; schedule LD on GA slip. Terms — `Source: acquiring org / contracts team`.

## 7. Constraint seeds (→ Phase 02)

Imposed limits the agreement fixes. These become candidate `REQ-C-*` (Constraint) and `REQ-D-*` (Domain) in Phase 02 — **no REQ IDs are assigned here**.

- **Budget ceiling:** Firm-fixed-price pilot envelope — TODO: figure owed by MetroCharge contracts → candidate REQ-C.
- **Delivery date:** Pilot GA required by **end of Q4 (12-month build)**; UL listing + PCI AoC must precede public go-live → candidate REQ-C.
- **Mandated technology / interoperability:** OCPP 2.0.1 (charger↔backend), ISO 15118 (Plug & Charge, vehicle↔charger), OCPI 2.2.1 (roaming), OpenADR 2.0b (grid DR) → candidate REQ-C / REQ-INT.
- **Mandated standards / regulation (domain):** UL 2594 + IEC 61851-1 (EVSE electrical safety), PCI-DSS 4.0 (payment), GDPR/CCPA (driver PII), ADA accessibility, FCC Part 15 (EMC) → candidate REQ-D / REQ-SEC.
- **Mandated security policy:** MetroCharge IT security policy MCN-SEC-POL-v4 (MFA on operator access, key management) — `Source: acquiring org` → candidate REQ-SEC.

## 8. Open items / TODO register

| Item owed | Owner | Due |
|---|---|---|
| Confirm PSP (StripePay-EV) authorised POC + signed BAA/DPA | VoltVantage contracts | TODO: before SRR |
| Confirm GridLink DR aggregator POC + OpenADR endpoint sandbox | MetroCharge | TODO: before PDR |
| Fix firm-fixed-price pilot budget ceiling (REQ-C seed) | MetroCharge contracts | TODO: before SRR |
| Commit AC-10 first-time-fix threshold | MetroCharge Field Ops | TODO: before TRR |
| Book NRTL (UL/BV) witness slots for AC-03 / AC-07 | VoltVantage Compliance Lead | TODO: before TRR |
| Confirm utility interconnection timeline per pilot site | MetroCharge / utility | TODO: rolling, before each site go-live |
