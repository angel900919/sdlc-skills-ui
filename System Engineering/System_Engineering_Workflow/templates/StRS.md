---
Document: Stakeholder Requirements Specification — <Project Name>
Document ID: STRS-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 29148:2018
Status: Draft
Owner: Lead Systems Engineer
---

<!--
TEMPLATE — Phase 01 (Concept). Owning skill: se-phase-01-concept.
ISO/IEC/IEEE 29148:2018 Stakeholder Requirements Specification — PROBLEM space.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO.
Every need (SN-*) is an OUTCOME, solution-free: say WHAT is required, never HOW to build it.
If a stakeholder states a technology, record it as a candidate C-/D- constraint (§4) and
re-derive the underlying need. Priority is High/Med/Low/N-A (Conventions §5.2).
The candidate MOE is a note here; it is numbered MOE-* in Phase 02.
Rows marked "(example — delete)" are illustrative only.
-->

## 1. Purpose & scope

This StRS captures the stakeholder needs (`SN-*`) for <Project Name> in the problem space.
It conforms to [`../05_Conventions.md`](../05_Conventions.md) and ISO/IEC/IEEE 29148:2018.
Solution-space requirements (`REQ-*`) are derived from these needs in Phase 02.

- **In scope (problem space):** <what needs this document covers>
- **Out of scope:** <solution / architecture / test design — deferred to later phases>

## 2. Stakeholders

References `STK-*` from `Stakeholder_Mission.md` — do not re-list the full table here.

- <STK-01: short label>, <STK-02: short label>, … (see `Stakeholder_Mission.md` §2)

## 3. Stakeholder needs

Each `SN-*` is an outcome, solution-free, prioritised, and traced to an originating `STK-*`.

| ID | Need (outcome, solution-free) | Originating STK | Priority | Candidate MOE |
|---|---|---|---|---|
| SN-01 | The system shall enable <outcome> | STK-01 | <High/Med/Low/N-A> | <effectiveness measure> |
| SN-02 | The system shall enable <outcome> | STK-02 | <High/Med/Low/N-A> | <effectiveness measure> |
| SN-03 | The system shall enable <outcome> | STK-0x | <High/Med/Low/N-A> | <effectiveness measure> |
| SN-04 | The system shall enable <outcome> | STK-0x | <High/Med/Low/N-A> | <effectiveness measure> |
| SN-01 | The system shall enable a user to complete a core task without assistance | STK-01 | High | Task completion rate | <!-- (example — delete) -->

## 4. Constraints & assumptions

Candidate `C-` (Constraint) and `D-` (Domain) constraints that feed Phase 02 — **no REQ IDs assigned here**.
Includes any technology a stakeholder mandated (re-derived as a need above, recorded as a constraint here).

| Type | Constraint / assumption | Origin | → Phase 02 candidate |
|---|---|---|---|
| Constraint | <imposed limit — budget / tech / date> | <STK / agreement> | REQ-C |
| Domain | <mandated standard / regulation> | <agreement / regulator> | REQ-D |
| Assumption | <assumed condition; revisit if false> | <source> | — |
| Constraint | Must run on existing on-prem hardware | Agreement | REQ-C | <!-- (example — delete) -->

## 5. Needs-to-scenario trace

`SN-*` ↔ `SCN-*` (scenarios live in `OpsCon.md`). Every high-priority `SN-*` must be exercised by ≥ 1 scenario.

| SN-ID | Exercised by scenario(s) |
|---|---|
| SN-01 | SCN-01, SCN-0x |
| SN-02 | SCN-0x |
| SN-01 | SCN-01 | <!-- (example — delete) -->
