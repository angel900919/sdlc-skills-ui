# System Requirements Specification — EV Charging Station Network (EVCN)

**Standard:** ISO/IEC/IEEE 29148:2018 §9.4
**Document ID:** SysRS-EVCN-v1.0
**Status:** Baseline (PDR-approved)

---

## 1. Introduction

### 1.1 Purpose
Specify the system-level requirements for the EVCN — a public network of Level 2 (AC) and DC Fast Charging (DCFC) stations with cloud-based session management, billing, and grid integration.

### 1.2 Scope
Covers the EVSE hardware, Station Controller firmware, Backend Cloud Services, driver-facing apps, operator dashboard, and external interfaces (utility, payment, roaming).

### 1.3 Definitions
- **EVSE** — Electric Vehicle Supply Equipment.
- **CSMS** — Charging Station Management System (the OCPP server).
- **OCPP** — Open Charge Point Protocol 2.0.1.
- **ISO 15118** — V2G communication; enables Plug & Charge (PnC).
- **OCPI** — Open Charge Point Interface 2.2.1 (roaming).
- **DR** — Demand Response (grid-side load curtailment).

### 1.4 References
- IEC 61851-1:2017 — Conductive charging.
- IEEE 2030.5 — Smart energy profile.
- UL 2594 — EVSE safety.
- PCI-DSS 4.0 — Payment.
- GDPR Articles 5, 32, 35.

---

## 2. System Overview

EVCN comprises three tiers:

1. **Edge** — EVSE units with local Station Controllers, sensors, contactors, and HMI.
2. **Cloud** — CSMS (OCPP server), billing, identity, monitoring, analytics; deployed as microservices on Kubernetes.
3. **Client** — Driver mobile app (iOS/Android), web portal, operator dashboard, technician tool.

Stations operate **local-first**: a charging session can complete safely if the cloud link is briefly lost; payment and roaming require connectivity.

---

## 3. Functional Requirements

| ID | Statement | Source |
|---|---|---|
| **REQ-F-01** | The Station Controller shall detect EV connection (CP signal state B) within 200 ms of plug insertion per IEC 61851-1. | Charge UX |
| **REQ-F-02** | The system shall authenticate a driver via at least one of: RFID card, mobile app QR token, ISO 15118 Plug & Charge contract, or contactless credit card. | Stakeholder workshop |
| **REQ-F-03** | The Station Controller shall initiate energy delivery within 10 s of successful authentication and protocol handshake. | Driver UX |
| **REQ-F-04** | The Station Controller shall stop energy delivery within 100 ms of an emergency stop signal (E-Stop button, contactor fault, ground fault, over-temperature). | Safety / UL 2594 |
| **REQ-F-05** | The system shall support concurrent charging sessions on each connector of a multi-connector station (up to 4 connectors per station). | Hardware spec |
| **REQ-F-06** | The CSMS shall transmit OCPP 2.0.1 `MeterValues` to the cloud every 30 s during an active session. | OCPP spec |
| **REQ-F-07** | The system shall accept payment by EMV contactless card, mobile app wallet, RFID-linked account, and OCPI roaming token. | Business |
| **REQ-F-08** | The system shall require multi-factor authentication for all operator dashboard logins. | Security |
| **REQ-F-09** | The system shall publish station availability, real-time price, and connector type to a public API (consumed by mapping apps). | Driver UX |
| **REQ-F-10** | The system shall accept and apply OpenADR 2.0b demand response signals to throttle station output power within 60 s of receipt. | Utility |
| **REQ-F-11** | The system shall provide an authenticated remote stop command from the operator dashboard with audit log entry. | Operations |
| **REQ-F-12** | The Station Controller shall log every state transition with monotonic timestamp and sync to cloud within 5 s of connectivity restoration. | Audit |

---

## 4. Usability Requirements

| ID | Statement | Source |
|---|---|---|
| **REQ-U-01** | A driver shall complete authentication and start a charging session within 30 s of arrival at a station in 95% of attempts (measured from app launch or RFID tap to energy flow). | UX research |
| **REQ-U-02** | The HMI shall be operable by a person seated in a wheelchair (display & connector reach within ADA height limits 15"–48"). | ADA |
| **REQ-U-03** | The HMI shall present live session price, energy delivered (kWh), and elapsed time, refreshed at least once per second. | Driver UX |
| **REQ-U-04** | The mobile app shall locate the nearest available compatible station within 3 s of opening the "Find a charger" view (95th percentile). | Driver UX |
| **REQ-U-05** | The HMI shall support at least English, Spanish, and French; language selectable per session. | Market |

---

## 5. Performance Requirements

| ID | Statement | Source |
|---|---|---|
| **REQ-P-01** | DC Fast stations shall deliver up to 350 kW per dispenser at 920 V DC nominal output. | Hardware spec |
| **REQ-P-02** | Level 2 stations shall deliver up to 19.2 kW (80 A @ 240 V) per connector. | Hardware spec |
| **REQ-P-03** | OCPP `BootNotification` round-trip from station to CSMS shall complete in < 2 s (95th percentile) under nominal cellular link conditions. | Operations |
| **REQ-P-04** | Driver-app push notification of "session started" / "session complete" shall be delivered within 5 s of the event. | Driver UX |
| **REQ-P-05** | The cloud platform shall sustain 50,000 concurrent charging sessions and 5,000 OCPP requests/second with p99 latency ≤ 500 ms. | Capacity plan |
| **REQ-P-06** | The Station Controller shall maintain ground-fault detection at < 6 mA AC / < 30 mA DC residual current with trip time ≤ 100 ms. | UL 2594 |
| **REQ-P-07** | Energy meter accuracy shall be ≤ 1% per IEC 62053 (revenue grade). | Billing accuracy |

---

## 6. System Interfaces

### 6.1 External Interfaces (summary; full ICD in `Phase_04_Architecture/ICD.md`)

| Interface | Standard | Direction |
|---|---|---|
| Station ↔ CSMS | OCPP 2.0.1 over WebSocket Secure (WSS, TLS 1.3) | Bidirectional |
| Station ↔ EV | ISO 15118-2/-20 over PLC (HomePlug GP) for PnC; SAE J1772 / CCS / NACS / CHAdeMO physical | Bidirectional |
| Station ↔ Payment | EMVCo contactless via certified payment terminal (P2PE) | Inbound |
| CSMS ↔ Roaming | OCPI 2.2.1 over HTTPS | Bidirectional |
| CSMS ↔ Utility | OpenADR 2.0b over HTTPS | Inbound (DR signals) |
| App ↔ CSMS | REST + WebSocket over HTTPS (TLS 1.3) | Bidirectional |

---

## 7. System Operations

### 7.1 Operator Procedures
- **Provisioning:** A new station auto-enrolls via OCPP 2.0.1 BootNotification with device certificate; CSMS validates and assigns to a tenant.
- **Pricing:** Operator updates tariff via dashboard; new tariff propagates to stations within 60 s.
- **Diagnostics:** Operator triggers remote diagnostics via OCPP `GetLog`; firmware updates via `UpdateFirmware`.

### 7.2 User Procedures
- **Charge:** Plug → authenticate → confirm price → charge → unplug → receipt.
- **Reservation:** App reservation holds a connector for up to 10 minutes.

### 7.3 Backup / Recovery
- Station log buffer ≥ 24 h offline.
- CSMS in active-active across two regions (RTO ≤ 10 min, RPO ≤ 1 min).

---

## 8. System Modes & States

| Mode | Description |
|---|---|
| **Idle** | Station online, no EV connected. |
| **Authenticating** | EV plugged, awaiting credential. |
| **Negotiating** | ISO 15118 / OCPP transaction handshake. |
| **Charging** | Energy delivery active, metering live. |
| **Pausing** | DR throttling, target SoC reached, or utility curtailment. |
| **Ending** | Soft-stop sequence, contactor open, billing finalize. |
| **Fault** | Detected fault — open contactors, alert operator. |
| **Maintenance** | Locked out for service. |

---

## 9. Verification Methods

| Req | Method | Description |
|---|---|---|
| REQ-F-01 | T | Time CP-state-B detection with logic analyzer. |
| REQ-F-04 | T / A | Inject fault; measure contactor open time on oscilloscope. |
| REQ-F-06 | T | Capture OCPP traffic with protocol analyzer; verify cadence. |
| REQ-P-01 | T | Resistive load bank at 350 kW; thermal soak 60 min. |
| REQ-P-05 | T | k6 load test at 5,000 RPS for 30 min; measure p99. |
| REQ-P-06 | T | RCD calibrated injection; trip-time validation. |
| REQ-U-01 | T | UAT with 30 drivers; instrumented timing. |
| REQ-SEC-01 | I / T | Code review + TLS scanner (testssl.sh). |

(Method codes: T = Test, I = Inspection, A = Analysis, D = Demonstration.)

Full verification matrix in `Phase_07_Verification/Verification_Matrix.md`.

---

## 10. Security Requirements

| ID | Statement |
|---|---|
| **REQ-SEC-01** | All network communication shall use TLS 1.3 with certificate pinning between station and CSMS. |
| **REQ-SEC-02** | Stations shall hold a unique device certificate provisioned at manufacture; private keys stored in a secure element (TPM 2.0 or equivalent). |
| **REQ-SEC-03** | The system shall comply with PCI-DSS 4.0 for cardholder data; cardholder data shall never traverse the Station Controller in cleartext. |
| **REQ-SEC-04** | Firmware images shall be signed (RSA-3072 or ECDSA-P256); the bootloader shall reject unsigned images. |
| **REQ-SEC-05** | The system shall support the principle of least privilege via RBAC for the operator dashboard with ≥ 5 roles. |
| **REQ-SEC-06** | Personal data shall be exportable and erasable per GDPR Articles 15 & 17 within 30 days of request. |

---

## 11. Operational / Reliability Requirements

| ID | Statement |
|---|---|
| **REQ-O-01** | Station availability shall be ≥ 98% per month per station, measured by CSMS heartbeat. |
| **REQ-O-02** | The cloud CSMS shall maintain 99.95% availability monthly. |
| **REQ-O-03** | OTA firmware updates shall support staged rollout per cohort with automatic rollback on failure. |
| **REQ-O-04** | The system shall continue safe charging operations for at least 24 h with no cloud connectivity. |
| **REQ-O-05** | All session events shall be retained for ≥ 7 years for billing / regulatory audit. |
| **REQ-O-06** | Mean Time To Repair (MTTR) for a station shall be ≤ 24 h from fault detection. |

---

## 12. Assumptions & Dependencies

- Site civil works (concrete pad, conduit, breakers) are completed by site host before installation.
- Cellular LTE/5G coverage available at site (private APN preferred).
- Utility interconnection approved for site demand.
- Payment processor PCI-certified and contracted (Stripe Terminal / Adyen Tap to Pay).
- ISO 15118 PnC certificate authority hierarchy operational (V2G Root CA, OEM Sub-CAs).

---

## 13. Traceability Tags

Every REQ ID in this document is referenced in:
- `Phase_03_Modeling/Requirements_Diagram.puml` (satisfy / verify links)
- `Phase_07_Verification/Verification_Matrix.md`
- `Phase_08_Validation/Test_Cases.md`
