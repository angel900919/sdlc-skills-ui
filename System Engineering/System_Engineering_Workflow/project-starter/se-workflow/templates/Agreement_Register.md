---
Document: Agreement Register — <Project Name>
Document ID: AGR-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

<!--
TEMPLATE — Phase 00 (Agreement & Enablement). Owning skill: se-phase-00-agreement.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO.
IDs, gate names (ATP), T/I/A/D codes, severities, status strings, and standard
citations are defined in ../05_Conventions.md — cite, do not redefine them.
Never invent thresholds, dates, names, or budgets — mark unknowns as
`TODO: <what is owed, by whom>`. Rows marked "(example — delete)" are illustrative only.
-->

## 1. Engagement summary

- **What is being acquired/built:** <one-line statement of the system>
- **For whom (acquirer):** <acquirer org / sponsor>
- **Domain:** <e.g. automotive | medical | fintech | IoT | defense>
- **System type:** <hardware | software | hybrid>
- **Engagement type:** <external contract | internal/self-funded charter>
  <!-- If internal/self-funded: acquirer = supplier; note it here. -->

## 2. Acquisition vehicle

- **Type:** <Formal contract | RFP/SOW response | Internal charter / self-funded | Grant / framework | Other>
- **Document name / number:** <name or "internal charter">
- **Date:** TODO: <date owed by contracts/sponsor>
- **Source documents read:** <RFP / RFQ / ITT / SOW / draft contract / MOU / none>

## 3. Parties & roles

| Party | Role (Acquirer / Supplier / Sub-tier) | Authorised POC | Decision authority |
|---|---|---|---|
| <Org A> | Acquirer | TODO: name | Accepts deliverables, releases funding |
| <Org B> | Supplier | TODO: name | Delivers system + SE artifacts |
| <Org C> | Sub-tier supplier / partner | TODO: name | <scope of authority> |
| ACME Buyer Co. | Acquirer | Jane Doe, Programs | Accepts deliverables, releases funding | <!-- (example — delete) -->

## 4. Scope of agreement

**In scope (supplier deliverables)** — map each to a future-phase artifact where known:

| Obligation | Maps to future-phase deliverable |
|---|---|
| <obligation 1> | <e.g. SysRS at SRR (Phase 02)> |
| <obligation 2> | <e.g. Verification evidence at TRR (Phase 07)> |
| <obligation 3> | <e.g. delivered system at PRR (Phase 08)> |
| <obligation 4> | <…> |
| Deliver baselined SysRS | SysRS at SRR (Phase 02) | <!-- (example — delete) -->

**Out of scope** (explicit exclusions):

- <excluded item 1>
- <excluded item 2>
- <excluded item 3>
- <excluded item 4>

## 5. Acceptance criteria

Conditions under which the acquirer will **accept** the system. Accept method uses the
four codes from Conventions §4 (T/I/A/D). These run as a validation activity in Phase 08 (PRR).

| ID | Criterion | Threshold | Accept method (T/I/A/D) | Acceptance authority | Status |
|---|---|---|---|---|---|
| AC-01 | <objective condition> | TODO: threshold owed by acquirer | T | <role> | Open |
| AC-02 | <objective condition> | <threshold> | A | <role> | Open |
| AC-03 | <objective condition> | <threshold> | I | <role> | Open |
| AC-04 | System completes a live end-to-end transaction | < 2 s p95 latency | T | Acquirer QA Lead | Open | <!-- (example — delete) -->

## 6. Commercial frame (light)

> Shallow on purpose. Procurement-heavy rows are tagged `Source: acquiring org / contracts team` and stop here.

- **Contract type:** <firm-fixed-price | cost-plus | T&M | internal budget>
- **Payment / funding milestones:**
  | Milestone | Triggers payment / funding release |
  |---|---|
  | <milestone> | TODO: <amount/percentage — Source: acquiring org / contracts team> |
- **Warranty / support period:** TODO: <period owed by contracts>
- **IP / licensing stance:** <ownership / license terms — Source: acquiring org>
- **Penalties / liquidated damages:** <terms — Source: acquiring org / contracts team>

## 7. Constraint seeds (→ Phase 02)

Imposed limits the agreement fixes. These become candidate `REQ-C-*` (Constraint) and
`REQ-D-*` (Domain) in Phase 02 — **do not assign REQ IDs here**.

- **Budget ceiling:** TODO: <ceiling owed by sponsor> → candidate REQ-C
- **Mandated technology:** <tech, if any> → candidate REQ-C
- **Mandated standard / regulation:** <e.g. ISO 26262 / IEC 62304 / DO-178C / GDPR> → candidate REQ-D
- **Delivery date:** TODO: <date owed by sponsor> → candidate REQ-C

## 8. Open items / TODO register

| Item owed | Owner | Due |
|---|---|---|
| <owed answer> | <named party> | TODO: <date> |
| Acceptance thresholds for AC-01 | Acquirer | TODO: <date> | <!-- (example — delete) -->
