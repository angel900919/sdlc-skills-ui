# Test Plan — EVCN

**Plan ID:** TP-EVCN-01
**Standard:** Aligned with IEEE 829 / ISO 29119; tightly traced to `Phase_02_Requirements/SysRS.md`.

---

## 1. Objective

Validate that the EVCN, integrated end-to-end, meets driver, operator, site host, utility, and regulator needs in real-world conditions, and pass-with-evidence the SysRS at the system level.

## 2. Scope

| In scope | Out of scope |
|---|---|
| Station hardware (Level 2 + DCFC) | Grid-side equipment |
| Station Controller firmware | EV onboard hardware |
| OCPP 2.0.1 + ISO 15118 stacks | Insurance / warranty programs |
| CSMS, Session, Billing, Tariff, DR, OCPI | Manufacturing tooling |
| Driver mobile app, web portal, operator dashboard | Third-party emergency dispatch |
| Payment via Stripe Terminal P2PE | Cardholder-data lifecycle (PSP-managed) |
| OpenADR DR signaling (with VTN simulator + utility cutover) | Utility VTN itself |

## 3. Approach

| Layer | Manual | Automated | Tool |
|---|---|---|---|
| Unit | — | 100% | PyTest, Cargo test, JUnit, Vitest |
| Integration / API | — | 100% | Postman + Newman, Schemathesis, REST Assured |
| OCPP conformance | — | 100% | OCA OCPP Conformance Tool (OCTT) |
| ISO 15118 conformance | — | 100% | switch-ev / iso15118-ev test suite |
| UI E2E | 30% | 70% | Playwright, Maestro for mobile |
| Load | — | 100% | k6, Locust |
| Security | 30% | 70% | OWASP ZAP, Burp Suite, CodeQL |
| HIL hardware | 70% | 30% | Lab rig + Python harness |
| UAT pilot | 100% | — | Driver surveys, ops dashboard analytics |

## 4. Test Environment

| Env | Composition |
|---|---|
| **Lab HIL** | 2 DCFC + 2 L2 stations, 350 kW load bank, EVCC simulator, OCPP test tool, attenuated cellular |
| **Staging cloud** | Identical IaC to prod; isolated VPC; synthetic data; OCPI partner sandbox |
| **Pre-prod cloud** | Prod-like, with limited driver beta; payment in test mode |
| **Pilot site** | 5 real stations at one site host location for 2 weeks |
| **Public pilot** | 50 stations across 10 sites for 30 days |

## 5. Risks (Test-Specific)

| Risk | Mitigation |
|---|---|
| EV diversity (we cannot test every model) | Tier-1 list of 12 EVs covering CCS/NACS/CHAdeMO/PnC; community beta for long-tail. |
| Cellular variability at sites | Cellular-attenuator HIL; pilot includes one weak-signal site. |
| Payment certification slip | Engage QSA in Q1; weekly compliance status. |
| Severe weather (winter testing) | 2-week pilot extension at cold-climate site; add condensation/heating tests. |
| Vendor firmware regressions | Pin firmware versions per release; CR required to update. |

## 6. Pass / Fail Criteria

- ≥ 95% of test cases pass on the targeted release.
- **Zero severity-1 defects** (safety, payment, fire/electrical risk).
- All requirements with verification method = T have an executed, archived run.
- All UL 2594, IEC 61851, FCC Part 15, CE EMC tests pass on certified DUTs.
- Pilot NPS > 30; pilot uptime > 95%.

## 7. Roles & Responsibilities

| Role | Responsibility |
|---|---|
| Test Lead | Owns this plan; chairs TRR; approves release. |
| Firmware QA | Lab HIL, OCPP/15118 conformance. |
| Cloud QA | API tests, k6, security scans. |
| Mobile QA | App regression, store-track builds. |
| Compliance | UL/CE/FCC/PCI/GDPR audits. |
| Ops | Pilot deployment, monitoring, incident drills. |

## 8. Deliverables

- Executed test cases with evidence (logs, scope captures, k6 reports).
- Defect log (Jira) with status at release.
- Verification & Validation traceability report (REQ → TC → result).
- Pilot post-mortem document.
- Compliance audit letters.

## 9. Schedule (aligned to Project Plan)

| Period | Test Activity |
|---|---|
| Q1 | Unit + integration begin; SRR; PDR. |
| Q2 | Lab HIL stand-up; CDR; OCPP & 15118 conformance. |
| Q3 | Full system test; payment & UL certification; **TRR**; private beta. |
| Q4 | Pilot site; public pilot; UL 2594 cert; **PRR**; v1.0 GA. |

## 10. Test Cases

Detailed test cases live in `Test_Cases.md` (this folder), structured as required by the rubric:
- **Verification cases** (TC-VER-*): 35 cases mapped 1:1 to REQs.
- **Validation cases** (TC-VAL-*): 12 cases covering driver journeys, multi-actor scenarios, and pilot operations.
