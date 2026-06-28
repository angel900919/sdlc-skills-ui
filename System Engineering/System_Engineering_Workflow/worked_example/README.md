# Worked Example — EV Charging Station Network (EVCN)

A complete systems engineering walkthrough applying every phase from `../reference/Comprehensive_Guide.md` to a networked public **EV Charging Station Network**: Level 2 (AC) and DC Fast (DCFC) chargers, cloud backend, mobile/web apps, and grid integration.

---

## Phase Index

| Phase | Folder | Key Deliverables |
|---|---|---|
| 1 — Concept | `Phase_01_Concept/` | `Project_Development_Plan.md`, `Stakeholder_Mission.md` |
| 2 — Requirements | `Phase_02_Requirements/` | `SysRS.md` (IEEE 29148:2018 §9.4) |
| 3 — System Modeling | `Phase_03_Modeling/` | Use Case, BDD, IBD, State Machine, Activity, Sequence, Requirements diagrams (`.puml`) |
| 4 — Architecture & Design | `Phase_04_Architecture/` | `Architecture_Diagram.puml`, `ICD.md`, `Tech_Stack_Rationale.md` |
| 5 — Trade-off Analysis | `Phase_05_Tradeoff/` | `Decision_Matrices.md`, `COCOMO_Estimate.md` |
| 6 — Integration | `Phase_06_Integration/` | `Integration_Plan.md` |
| 7 — Verification | `Phase_07_Verification/` | `Verification_Matrix.md` |
| 8 — Validation | `Phase_08_Validation/` | `Test_Plan.md`, `Test_Cases.md` |
| 9 — Change Management | `Phase_09_Change_Config/` | `Change_Management_Plan.md` |
| 10 — Operations | `Phase_10_Operations/` | `Operations_Continuous_Validation.md` |

---

## System At a Glance

- **Mission:** Deliver a reliable, interoperable, payment-enabled public EV charging network supporting Level 2 (7–22 kW AC) and DC Fast Charging (50–350 kW DC).
- **Standards:** OCPP 2.0.1 (charger ↔ backend), ISO 15118 (charger ↔ vehicle, Plug & Charge), OCPI 2.2.1 (roaming), UL 2594, PCI-DSS 4.0 (payment), GDPR/CCPA.
- **Lifecycle Model:** Hybrid V-Model (safety-critical power & charge control) + Agile (cloud, mobile, dashboards).
- **Architecture Style:** Local-first edge controller per station + cloud backend; OCPP-WebSocket bridge; microservices on Kubernetes.

## Conventions

- All diagrams are PlantUML (`.puml`). Render via `plantuml *.puml` or VS Code PlantUML extension.
- Requirement IDs follow `REQ-<class>-<nn>`: `F` (Functional), `P` (Performance), `U` (Usability), `O` (Operational/Reliability), `SEC` (Security), `INT` (Interface).
- All cross-references use relative paths; this folder is self-contained.
