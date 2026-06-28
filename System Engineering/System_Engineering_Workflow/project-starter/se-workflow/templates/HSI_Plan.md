<!-- TEMPLATE — Human Systems Integration Plan. Owning thread: ../cross-cutting/Human_Systems_Integration.md. Fill the <placeholders>; delete (example — delete) rows; never invent numbers (use TODO: <owed, by whom>). Cite ../05_Conventions.md; do not redefine IDs/gates. -->
---
Document: Human Systems Integration (HSI) Plan — <Project Name>
Document ID: HSI-<PROJECT_SLUG>-v0.1
Standard: NASA/SP-2016-6105 Rev 2 (HSI); INCOSE SE Handbook v5
Status: Draft
Owner: <Human Factors / Systems Engineering lead>
---

# Human Systems Integration Plan — <Project Name>

> HSI ensures the people who **operate, maintain, and are affected by** the system are engineered for, not assumed. See the thread method in [`../cross-cutting/Human_Systems_Integration.md`](../cross-cutting/Human_Systems_Integration.md).

## 1. Human roles in the system
| Role | Stakeholder (STK-) | Tasks | Workload / criticality | Source phase |
|---|---|---|---|---|
| <operator> | STK-<nn> | <key tasks> | <H/M/L> | 01 |
| <maintainer> | STK-<nn> | <maintenance tasks> | <H/M/L> | 01 |
<!-- (example — delete) | Charging-site technician | STK-04 | swap power module, clear faults | M | 01 -->

## 2. HSI domain assessment (the 7 domains)
| Domain | Applies? | Key consideration | Requirement(s) raised | Validation (Phase 08) |
|---|---|---|---|---|
| Human factors / ergonomics | <Y/N> | <reach, display legibility, error-proofing> | REQ-U-<nn> | <UAT / usability test> |
| Training | <Y/N> | <what operators/maintainers must learn> | REQ-<nn> | <training eval> |
| Staffing / manpower | <Y/N> | <how many people, what shifts> | REQ-<nn> | TODO |
| Personnel | <Y/N> | <required skills/qualifications> | REQ-<nn> | TODO |
| Habitability | <Y/N> | <noise, lighting, space, comfort> | REQ-<nn> | TODO |
| Environment / occupational health & safety | <Y/N> | <hazards to people, PPE> | REQ-SAF-<nn> | <safety check> |
| Human error / safety | <Y/N> | <error-likely steps, mitigations> | REQ-<nn> | <human-in-the-loop test> |

## 3. Human-error analysis
| Task step | Error mode | Consequence | Mitigation (design / procedure / training) | Links |
|---|---|---|---|---|
| <step> | <slip/lapse/mistake> | <impact> | <mitigation> | HAZ-<nn> / REQ-<nn> |

## 4. Lifecycle touchpoints
- **Phase 01:** operator/maintainer stakeholders identified; usage scenarios (OpsCon SCN-*) include the human.
- **Phase 02:** human-factors + training + staffing requirements written (U/C/SAF classes).
- **Phase 04:** operator-station / UI / maintenance-access design reflects §2.
- **Phase 08:** human-in-the-loop UAT validates operability, training adequacy, error rates.

## 5. Open items
- TODO: <what's owed, by whom, by when>
