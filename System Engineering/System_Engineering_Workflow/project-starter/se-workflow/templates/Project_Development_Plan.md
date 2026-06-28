---
Document: Project Development Plan — <Project Name>
Document ID: PDP-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

<!--
TEMPLATE — Phase 01 (Concept). Owning skill: se-phase-01-concept.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO.
Lifecycle model is BOUND here at MCR — offer all four base models + Hybrid.
SAFe is a scaling framework recorded only as a NOTE inside Hybrid for large orgs;
never list it as a peer base model (Conventions / Overview §7).
Schedule anchors to MCR then SRR only; PDR/CDR are forward markers; DO NOT invent TRR/PRR.
Risks seed the LIVING register reviewed at every gate. Likelihood/Impact are 1–5; band per
Conventions §5.3. Use TODO: for unstaffed roles / unknown dates. Invent no numbers.
Rows marked "(example — delete)" are illustrative only.
-->

## 1. Lifecycle Model

Chosen per track. Different tracks may use different models.

| Track | Model | Rationale |
|---|---|---|
| <track 1> | <Waterfall | V-Model | Spiral | Agile | Hybrid> | <why this model fits this track> |
| <track 2> | <…> | <…> |
| Safety-critical firmware | V-Model | Traceable verification at each design level for certification | <!-- (example — delete) -->

> SAFe (if used) is a scaling note inside Hybrid for large orgs — not a base model.

## 2. Schedule

Anchored to **MCR then SRR**; PDR/CDR shown only as forward markers. Do not key to TRR/PRR.

| Milestone | Target | Gate |
|---|---|---|
| Concept lock | TODO: <date> | MCR |
| Requirements baselined | TODO: <date> | SRR |
| (forward marker) Architecture review | TODO: <date> | PDR |
| (forward marker) Detailed design complete | TODO: <date> | CDR |
| Concept lock | <date> | MCR | <!-- (example — delete) -->

## 3. Team Structure

| Group | Headcount | Responsibility |
|---|---|---|
| <discipline group> | <n> | <responsibility> |
| <discipline group> | TODO: <not yet staffed> | <responsibility> |
| Systems & V&V | <n> | Requirements, test, integration |
| **Total** | **<N>** | |
| Embedded / Firmware | 5 | Controller + protocol stacks | <!-- (example — delete) -->

## 4. Risks & Opportunities

Seeds the living `RSK-*` / `OPP-*` register, handed to and reviewed at every gate (Conventions §5.3).
Aim for 4–6 concept-stage risks.

| ID | Description | Likelihood (1–5) | Impact (1–5) | Band | Mitigation |
|---|---|---|---|---|---|
| RSK-01 | <risk> | <1–5> | <1–5> | <Low/Med/High/Critical> | <mitigation> |
| RSK-02 | <risk> | <1–5> | <1–5> | <…> | <mitigation> |
| RSK-03 | <risk> | <1–5> | <1–5> | <…> | <mitigation> |
| RSK-04 | <risk> | <1–5> | <1–5> | <…> | <mitigation> |
| OPP-01 | <upside opportunity> | <1–5> | <1–5> | <…> | <action to capture> |
| RSK-01 | Key technology immature (low TRL) | 4 | 4 | High | Spike + fallback design | <!-- (example — delete) -->

## 5. Governance

- **Gate owned by this phase:** MCR → next gate **SRR** (Conventions §3).
- **Review / CCB cadence:** <e.g. weekly during build; biweekly otherwise> (full CM/CCB mechanics deferred to Phase 09).
- **Safety review trigger:** <when — or "N/A: not safety-critical">
- **Security review trigger:** <when — e.g. each architecture change>
- **Privacy review trigger:** <when — e.g. each data-flow change>
