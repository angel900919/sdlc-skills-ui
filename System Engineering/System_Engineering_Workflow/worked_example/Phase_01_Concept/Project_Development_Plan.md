# EVCN — Project Development Plan

## 1. Mission Statement

Deliver a **24/7 publicly accessible EV Charging Station Network (EVCN)** that enables drivers of any standards-compliant EV to authenticate, charge, and pay seamlessly across heterogeneous sites, while giving site hosts and network operators real-time visibility, billing, and grid-aware control.

## 2. Scope

**In scope**
- EVSE hardware (Level 2 AC + DC Fast Chargers)
- Edge Station Controller firmware
- Cloud backend (session, billing, monitoring, OCPP server)
- Driver-facing mobile app + web portal
- Operator dashboard
- Grid integration via OpenADR 2.0b
- Roaming integration via OCPI 2.2.1

**Out of scope**
- Grid-side hardware (utility transformers, switchgear)
- EV onboard hardware
- Insurance / warranty programs
- Site civil works (trenching, mounting)

## 3. Lifecycle Model — Hybrid V-Model + Agile

| Track | Model | Rationale |
|---|---|---|
| Power electronics & charge control firmware | **V-Model** | Safety-critical; UL 2594 / IEC 61851 compliance demands traceable verification at each design level. |
| OCPP/ISO 15118 stack | **V-Model** | Interoperability conformance testing against certified test suites. |
| Cloud platform, dashboards, mobile, billing | **Agile (2-week sprints)** | Fast iteration on user feedback; CI/CD friendly. |
| Hardware/firmware integration | **Incremental + CI** | Progressive integration with hardware-in-the-loop. |

## 4. Schedule (12-Month Build)

| Quarter | Milestones |
|---|---|
| **Q1** | Concept lock, SysRS baseline (M2 freeze), architecture review (PDR). |
| **Q2** | Hardware engineering samples, firmware bring-up, cloud MVP, OCPP integration sandbox. |
| **Q3** | CDR; pilot site (5 stations); private beta of mobile app; payment certification (PCI-DSS audit). |
| **Q4** | Public pilot (50 stations); OCPI roaming live; UL 2594 certification; v1.0 GA release. |

## 5. Team Structure

| Group | Headcount | Responsibility |
|---|---|---|
| Power Electronics | 4 | Rectifier, contactor design, thermal. |
| Embedded / Firmware | 5 | Station Controller, OCPP/ISO 15118 stacks. |
| Cloud Backend | 6 | OCPP-CSMS, billing, APIs. |
| Mobile / Web | 4 | Driver app, operator dashboard. |
| Systems & V&V | 3 | Requirements, test, integration. |
| Compliance & Safety | 2 | UL/CE/PCI/GDPR. |
| Program / PM | 1 | Roadmap, CCB, vendors. |
| **Total** | **25** | |

## 6. Risks & Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | OCPP 2.0.1 vendor interop drift | M | H | Use OCA-certified test tool every sprint. |
| R-02 | Power electronics supply chain | H | H | Dual-source SiC modules; 6-month buffer. |
| R-03 | Payment certification slip (PCI-DSS) | M | H | Engage QSA in Q1; tokenized PSP. |
| R-04 | Grid utility approvals delay site go-live | M | M | Begin interconnection in Q1; design for unsupervised charging fallback. |
| R-05 | ISO 15118 Plug & Charge cert timing | M | M | Ship with RFID/app auth; OTA enable PnC later. |

## 7. Tools & Environments

- **Requirements:** Markdown SysRS to IEEE 29148:2018 §9.4 (this repo).
- **Modeling:** PlantUML for SysML BDD/IBD/SM/Sequence/Activity.
- **Code:** Git + GitHub; firmware in Rust + C; backend in Go; mobile in Flutter.
- **CI/CD:** GitHub Actions; container builds; Argo CD for cloud.
- **Test:** PyTest, Postman, Playwright, k6, OCPP test tool, ISO 15118 conformance suite.
- **Observability:** Prometheus + Grafana + OpenTelemetry; Loki for logs.
- **Change Mgmt:** Jira (CRs), GitHub (code), Markdown SysRS (requirements baseline).

## 8. Governance

- **PDR** end-of-Q1, **CDR** end-of-Q2 — required for funding gates.
- **CCB** weekly during Q3–Q4; biweekly otherwise.
- **Security review** (STRIDE) at each architecture change.
- **Privacy review** at each data-flow change (GDPR Article 35 DPIA).
