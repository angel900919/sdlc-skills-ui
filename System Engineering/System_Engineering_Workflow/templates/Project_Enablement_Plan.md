---
Document: Project Enablement Plan — <Project Name>
Document ID: PEP-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

<!--
TEMPLATE — Phase 00 (Agreement & Enablement). Owning skill: se-phase-00-agreement.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO.
Frames the ISO/IEC/IEEE 15288:2023 Organizational Project-Enabling processes
(Infrastructure, Quality, Knowledge, Lifecycle-Model Management). Portfolio & HR are
org-level and explicitly out of scope — tag them `Source: acquiring org`.
Default tool entries to "TODO: confirm org standard" rather than inventing tool names.
Rows marked "(example — delete)" are illustrative only.
-->

## 1. Infrastructure & tools

| Capability | Tool / Standard | Status (org-standard / TBD) | Source |
|---|---|---|---|
| Requirements management | TODO: confirm org standard | TBD | <acquiring org / supplier> |
| Modeling / MBSE | <PlantUML | Cameo | Capella> | TBD | <…> |
| Code / CI-CD | TODO: confirm org standard | TBD | <…> |
| Test | TODO: confirm org standard | TBD | <…> |
| Observability | TODO: confirm org standard | TBD | <…> |
| Document / CM repository | TODO: confirm org standard | TBD | <…> |
| Requirements management | Markdown (this repo) | org-standard | supplier | <!-- (example — delete) -->

## 2. Quality management / QA

- **Applicable QMS:** <ISO 9001:2015 | other | none — Source: acquiring org>
- **QA cadence:** <e.g. review at each gate; periodic audit>
- **Audit / FCA-PCA pointers:** FCA/PCA occur at PRR (owned by Phase 08); named here only.
- → QA thread: [`../cross-cutting/Quality_Assurance.md`](../cross-cutting/Quality_Assurance.md)

## 3. Knowledge management

- **Repository / where artifacts live:** <repo path / system>
- **Naming & versioning:** per [`../05_Conventions.md`](../05_Conventions.md) §6 (`<TYPE>-<SLUG>-vX.Y`; status strings Draft → In Review → Baseline → Superseded).
- **Lessons-learned capture:** <mechanism> — feeds Phase 11 (Disposal).

## 4. Lifecycle-model management

- **Owner of the chosen lifecycle model:** TODO: <role/name>
- **Tailoring governance:** <how tailoring decisions are made and recorded — cross-ref SEMP §6>
- **Binding decision point:** lifecycle model is provisional in the SEMP, bound in Phase 01 at MCR.

## 5. Human-resource & funding enablement (light)

ATP precondition: confirm the team is **authorised and funded**. Portfolio/HR depth is
org-level and out of scope.

- **Team authorised:** <yes | TODO: confirmation owed by <party>>
- **Funding authorised:** <yes | TODO: confirmation owed by <party>>
- **Portfolio / HR staffing depth:** Source: acquiring org

## 6. Enablement gaps / TODO

| Gap | Owner | Due |
|---|---|---|
| <missing infrastructure / standard> | <named party> | TODO: <date> |
| Confirm requirements-mgmt tool standard | <PM> | TODO: <date> | <!-- (example — delete) -->
