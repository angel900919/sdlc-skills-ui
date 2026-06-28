---
Document: Operational Concept (OpsCon / ConOps) — <Project Name>
Document ID: OPSCON-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 29148:2018
Status: Draft
Owner: Lead Systems Engineer
---

<!--
TEMPLATE — Phase 01 (Concept). Owning skill: se-phase-01-concept.
ISO/IEC/IEEE 29148:2018 Operational Concept / ConOps — PROBLEM space.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO.
Capture how the system is USED in its environment: nominal threads, degraded/off-nominal
modes, maintenance, and the operational environment. Write each SCN-* as a real flow
(actors / trigger / main flow / success outcome) — not a one-line table cell.
Trace every SCN-* to the SN-* it exercises. IDs (SCN-*) are defined in ../05_Conventions.md.
The "(example — delete)" scenario is illustrative only.
-->

## 1. Operational overview

- **Mission (recap):** <one line — see `Stakeholder_Mission.md` §1>
- **Primary users / operators:** <who uses it>
- **Operational environment:** <where, when, under what conditions the system operates>

## 2. Operational scenarios

Assign `SCN-01`, `SCN-02`, … Cover nominal mission threads plus at least one off-nominal
and one maintenance thread. Trace each to the `SN-*` it exercises.

### SCN-01 — <scenario name>
- **Actors:** <who/what participates>
- **Trigger:** <what starts it>
- **Main flow:** <step → step → step → result>
- **Success outcome:** <observable success condition>
- **Exercises needs:** SN-0x, SN-0y

### SCN-02 — <scenario name (degraded / off-nominal)>
- **Actors:** <…>
- **Trigger:** <…>
- **Main flow:** <…>
- **Success outcome:** <…>
- **Exercises needs:** SN-0x

### SCN-03 — <scenario name (maintenance)>
- **Actors:** <…>
- **Trigger:** <…>
- **Main flow:** <…>
- **Success outcome:** <…>
- **Exercises needs:** SN-0x

<!-- (example — delete)
### SCN-01 — First-time user completes a core task
- Actors: End User, System
- Trigger: User opens the system for the first time
- Main flow: User authenticates → selects task → system guides → task completes
- Success outcome: Task completed in < 30 s with no external help
- Exercises needs: SN-01
-->

## 3. Modes & conditions

| Mode | Description | Entry condition | Exit condition |
|---|---|---|---|
| Nominal | <normal operation> | <…> | <…> |
| Degraded / off-nominal | <reduced capability> | <fault / loss of X> | <recovery> |
| Maintenance | <service / update> | <scheduled / triggered> | <return to nominal> |

## 4. Operational environment & constraints

- **Physical / deployment environment:** <on-prem / cloud / field / vehicle / etc.>
- **Connectivity / power / climate assumptions:** <…>
- **Operational constraints:** <imposed limits on use → candidate C-/D- for Phase 02>
- **Users & skill assumptions:** <operator/maintainer skill level, training assumptions>
