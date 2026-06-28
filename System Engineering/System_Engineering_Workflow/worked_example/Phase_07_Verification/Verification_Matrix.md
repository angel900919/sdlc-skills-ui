# Verification Matrix — EVCN

> **Verification asks:** "Did we build the system **right**?" — i.e., does it conform to the SysRS?
> Validation (right-system question) is in `Phase_08_Validation/`.

**Method codes:** `T` = Test, `I` = Inspection, `A` = Analysis, `D` = Demonstration.

---

## 1. Per-Requirement Verification

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-F-01 | EV detect ≤ 200 ms | T | TC-VER-01 — logic analyzer on CP signal | Saleae Logic 16 |
| REQ-F-02 | Multi-method auth | T | TC-VER-02 — RFID, app, PnC, EMV each happy-path | OCA test tool + lab |
| REQ-F-03 | Energy start ≤ 10 s post-auth | T | TC-VER-03 — instrumented timing | k6 + station log |
| REQ-F-04 | E-Stop opens contactors ≤ 100 ms | T + A | TC-VER-04 — oscilloscope on contactor coil | Tektronix MSO + analysis |
| REQ-F-05 | 4 concurrent sessions | T | TC-VER-05 — load all 4 connectors simultaneously | HIL load bank |
| REQ-F-06 | OCPP MeterValues every 30 s | T | TC-VER-06 — OCPP transcript inspection | OCA test tool |
| REQ-F-07 | Multi-method payment | T | TC-VER-07 — each payment method tested | Stripe sandbox |
| REQ-F-08 | MFA for operator | T | TC-VER-08 — MFA enrollment + bypass attempt | Manual + Burp |
| REQ-F-09 | Public availability API | T | TC-VER-09 — OpenAPI conformance + map app load | Schemathesis |
| REQ-F-10 | DR throttle ≤ 60 s | T | TC-VER-10 — VTN simulator sends signal | EPRI VTN Tester |
| REQ-F-11 | Remote stop with audit | T + I | TC-VER-11 — remote stop + log review | Manual |
| REQ-F-12 | State transitions logged + sync | T | TC-VER-12 — disconnect cellular, reconnect, verify drain | iptables + log diff |
| REQ-U-01 | Auth → energy ≤ 30 s | T | TC-VAL-01 (validation also) — UAT with 30 drivers | Stopwatch + analytics |
| REQ-U-02 | ADA reach | I | TC-VER-13 — physical measure with templates | Tape measure + ADA spec |
| REQ-U-03 | HMI live data 1 Hz | T | TC-VER-14 — frame-grab analysis | Camera + OpenCV |
| REQ-U-04 | App locate ≤ 3 s p95 | T | TC-VER-15 — synthetic load on `/stations` | k6 |
| REQ-U-05 | EN/ES/FR | I | TC-VER-16 — language switch + UI review | Manual |
| REQ-P-01 | DCFC up to 350 kW | T | TC-VER-17 — full-power soak 60 min | 350 kW load bank |
| REQ-P-02 | L2 up to 19.2 kW | T | TC-VER-18 — full-power soak 60 min | 19.2 kW load bank |
| REQ-P-03 | OCPP boot RTT < 2 s p95 | T | TC-VER-19 — boot 100 stations in CI | k6 + OCPP CSMS |
| REQ-P-04 | Push notify ≤ 5 s | T | TC-VER-20 — instrumented end-to-end | APNs/FCM telemetry |
| REQ-P-05 | 50k sessions, 5k RPS, p99 ≤ 500 ms | T | TC-VER-21 — sustained load 30 min | k6 + Grafana |
| REQ-P-06 | GFCI trip ≤ 100 ms | T | TC-VER-22 — calibrated RCD injection | Megger MFT |
| REQ-P-07 | Energy meter accuracy ≤ 1% | T + A | TC-VER-23 — ref meter cross-check at 5 load points | Yokogawa WT5000 |
| REQ-O-01 | Station availability ≥ 98% | A | TC-VER-24 — 30-day rolling SLA report | Prometheus query |
| REQ-O-02 | CSMS availability ≥ 99.95% | A | TC-VER-25 — uptime SLO report | Pingdom + Prometheus |
| REQ-O-03 | Staged OTA + rollback | T | TC-VER-26 — push bad image, verify rollback | Argo Rollouts + firmware harness |
| REQ-O-04 | 24 h offline charging | T | TC-VER-27 — pull WAN; charge for 24 h | Lab + iptables |
| REQ-O-05 | 7-year retention | I | TC-VER-28 — storage policy review + retention test | Manual + S3 lifecycle |
| REQ-O-06 | MTTR ≤ 24 h | A | TC-VER-29 — incident drill timing | Ops runbook |
| REQ-SEC-01 | TLS 1.3 + cert pinning | I + T | TC-VER-30 — testssl.sh + pinning test with proxy | testssl.sh + mitmproxy |
| REQ-SEC-02 | TPM device cert | I | TC-VER-31 — secure-element attestation review | Manual + TPM tools |
| REQ-SEC-03 | PCI-DSS 4.0 | I | TC-VER-32 — QSA audit + SAQ P2PE | External QSA |
| REQ-SEC-04 | Signed firmware | T | TC-VER-33 — push unsigned image; bootloader rejects | Firmware harness |
| REQ-SEC-05 | RBAC ≥ 5 roles | I + T | TC-VER-34 — role matrix + access denial tests | Manual + Postman |
| REQ-SEC-06 | GDPR export/erase ≤ 30 d | T + I | TC-VER-35 — submit DSAR + measure SLA | Manual + Jira |

---

## 2. Reviews & Inspections

| Review | Phase | Required Artifacts | Pass Criteria |
|---|---|---|---|
| **System Requirements Review (SRR)** | End of Q1 | SysRS baselined, SMART-checked | Stakeholder sign-off on REQs |
| **Preliminary Design Review (PDR)** | End of Q1 | BDD, IBD, ICD draft, decision matrices | No open critical risks; CCB approves architecture |
| **Critical Design Review (CDR)** | End of Q2 | Final ICD, schematics, firmware design, CSMS API | All interfaces frozen; HIL coverage > 90% |
| **Test Readiness Review (TRR)** | Mid Q3 | Test plan, environment ready, traceability matrix | All blocking defects fixed; team trained |
| **Production Readiness Review (PRR)** | End of Q3 | UL/CE certs, FAT results, supply chain ready | Zero severity-1 open defects |

---

## 3. Coverage Summary

| Category | Total REQs | Verified by Test | Verified by Inspection | Verified by Analysis | Coverage |
|---|---|---|---|---|---|
| Functional | 12 | 12 | 1 | 1 | 100% |
| Usability | 5 | 4 | 2 | 0 | 100% |
| Performance | 7 | 7 | 0 | 2 | 100% |
| Operational | 6 | 4 | 2 | 3 | 100% |
| Security | 6 | 4 | 5 | 0 | 100% |

---

## 4. Tools Used

| Tool | Purpose |
|---|---|
| **OCA OCPP Conformance Tool** | Reference verification for ICD-02 |
| **switch-ev / iso15118-ev** | EVCC simulator for ICD-01 |
| **k6** | Load and synthetic timing tests |
| **Schemathesis** | OpenAPI fuzzing / contract verification |
| **testssl.sh** | TLS configuration scanning |
| **CodeQL + Semgrep** | Static analysis (SAST) |
| **OWASP ZAP** | DAST against staging APIs |
| **Yokogawa WT5000** | Revenue-grade meter reference |
| **Tektronix MSO** | Contactor-timing scope captures |
| **Prometheus + Grafana** | SLO/SLI dashboards for analysis-method REQs |

Verification artifacts (logs, oscilloscope captures, k6 reports, audit letters) archived in `verification-evidence/` per release tag.
