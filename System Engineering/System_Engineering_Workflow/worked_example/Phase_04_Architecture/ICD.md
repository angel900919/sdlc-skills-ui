# Interface Control Document — EVCN

**Document ID:** ICD-EVCN-v1.0
**Status:** Baseline (CDR-approved)
**Standard:** ISO/IEC/IEEE 29148:2018, complemented by OCPP 2.0.1, ISO 15118, OCPI 2.2.1, OpenADR 2.0b.

---

## 1. Scope

This ICD defines every interface where two independently developed components meet. It is the contract used by integration testing in `Phase_06_Integration/Integration_Plan.md`.

## 2. Interface Inventory

| ICD-ID | Sender | Receiver | Layer | Standard | Direction |
|---|---|---|---|---|---|
| **ICD-01** | EV (EVCC) | Station (SECC) | Physical + Protocol | IEC 61851 + ISO 15118-2/-20, HomePlug GP | Bidirectional |
| **ICD-02** | Station Controller | CSMS | Application | OCPP 2.0.1 over WSS (TLS 1.3) | Bidirectional |
| **ICD-03** | Station Controller | Power Electronics | Internal | CAN-FD (1 Mbit/s nominal) + GPIO | Bidirectional |
| **ICD-04** | HMI | Station Controller | Internal | Local UNIX socket / D-Bus | Bidirectional |
| **ICD-05** | Payment Terminal | Payment Processor | Application | EMVCo + P2PE (Stripe Terminal) | Bidirectional |
| **ICD-06** | CSMS | Driver Mobile App | Application | REST + WebSocket over HTTPS, OAuth 2.1 | Bidirectional |
| **ICD-07** | CSMS | OCPI Hub | Application | OCPI 2.2.1 over HTTPS | Bidirectional |
| **ICD-08** | Utility VTN | DR Orchestrator | Application | OpenADR 2.0b over HTTPS | Inbound |
| **ICD-09** | Site Energy Mgmt | Station Controller | Application | Modbus TCP | Bidirectional |
| **ICD-10** | Station | Site Gateway | Network | IPsec VPN over LTE/Ethernet | Bidirectional |
| **ICD-11** | CSMS | Contract Cert Authority | Application | OCSP / EST over HTTPS | Outbound |

---

## 3. Detailed Interface Specifications

### ICD-01 — EV ↔ Station (Vehicle Communication)

| Attribute | Value |
|---|---|
| Physical | SAE J1772 (AC), CCS Combo 1 (DC), NACS (J3400), CHAdeMO (legacy) |
| Pilot signal | ±12 V CP / PP per IEC 61851-1 |
| High-level | ISO 15118-2 (PnC v1) / ISO 15118-20 (PnC v2, bidirectional) |
| Carrier | HomePlug Green PHY over CP wire |
| Latency | EVCC handshake ≤ 2 s; PowerDelivery start ≤ 200 ms |
| Security | TLS 1.2/1.3 with V2G PKI, contract certificates per eMAID |

### ICD-02 — Station ↔ CSMS (OCPP)

| Attribute | Value |
|---|---|
| Transport | WebSocket Secure (WSS) over TLS 1.3 |
| Subprotocol | `ocpp2.0.1` |
| Auth | mutual TLS with device cert from TPM |
| Message set | `BootNotification`, `Authorize`, `TransactionEvent`, `MeterValues`, `StatusNotification`, `Heartbeat`, `UpdateFirmware`, `GetLog`, `SetVariables`, `RequestStartTransaction`, `RequestStopTransaction` |
| Cadence | Heartbeat every 240 s; MeterValues every 30 s during session |
| Buffer | Station offline buffer ≥ 24 h, drains FIFO on reconnect |
| Versioning | Charge Station capabilities advertised via `BootNotification.ChargingStation` |

### ICD-03 — Station Controller ↔ Power Electronics

| Attribute | Value |
|---|---|
| Bus | CAN-FD, 1 Mbit/s nominal, 5 Mbit/s data |
| Frame | Custom CAN ID layout (PE-XX); telemetry IDs 0x100–0x1FF; commands 0x200–0x2FF |
| Safety | Hard-wired E-Stop & GFCI lines parallel to CAN; logic-low = open contactors |
| Telemetry | I_DC, V_DC, I_AC per phase, contactor state, IGBT/SiC junction temp; 50 Hz |
| Commands | `SET_SETPOINT(kW)`, `OPEN_CONTACTORS`, `CLOSE_CONTACTORS`, `RESET_FAULT` |
| Watchdog | Power Electronics opens contactors if no setpoint in 500 ms |

### ICD-06 — Driver App ↔ CSMS

| Attribute | Value |
|---|---|
| Transport | HTTPS (TLS 1.3) for REST; WSS for live session updates |
| Auth | OAuth 2.1 + OIDC, refresh tokens, biometric unlock on device |
| Endpoints | `GET /stations`, `POST /sessions`, `WS /sessions/{id}`, `POST /payments`, `GET /receipts` |
| Push | APNs (iOS), FCM (Android) for "session started", "complete", "error" |
| Rate limits | 60 req/min/user, 600 req/min/IP, with 429 Retry-After |
| Schemas | OpenAPI 3.1 spec stored in repo; backwards-compatible breaking via `/v2/` |

### ICD-07 — CSMS ↔ OCPI Hub

| Attribute | Value |
|---|---|
| Standard | OCPI 2.2.1 |
| Modules | `Locations`, `Tokens`, `Sessions`, `CDRs`, `Tariffs`, `Commands` |
| Auth | API tokens; HTTPS only; mutual TLS optional |
| Cadence | Sessions pushed near-real-time; CDRs at session end |
| Settlement | Daily aggregation; reconciliation via `Credits` |

### ICD-08 — Utility VTN ↔ DR Orchestrator

| Attribute | Value |
|---|---|
| Standard | OpenADR 2.0b (Profile B, "VEN") |
| Transport | HTTPS push from VTN; XMPP optional |
| Signal types | `SIMPLE`, `ELECTRICITY_PRICE`, `LOAD_DISPATCH` |
| Response time | Acknowledgement < 5 s; throttle apply < 60 s (REQ-F-10) |
| Opt-out | Per-site override flag with audit log |

---

## 4. Power & Environmental Interfaces

| Interface | Spec |
|---|---|
| AC Mains (Level 2) | 240 V single phase, 80 A max, neutral + ground |
| AC Mains (DCFC) | 480 V 3-phase, up to 700 A, wye + ground |
| DC Output (DCFC) | 200–920 V, 0–500 A, current-limited per ISO 15118 setpoint |
| Operating Temp | −30 °C to +50 °C (NEMA 4X enclosure) |
| Ingress | IP54 (Level 2) / IP65 (DCFC dispenser) |
| Backup Power | UPS for Station Controller only (≥ 1 h); contactors fail-open |

---

## 5. Versioning & Change Tracking

- ICD versioned semantically (MAJOR.MINOR.PATCH).
- Any change to message set, schema, or physical interface requires a CR (`Phase_09_Change_Config/Change_Management_Plan.md`).
- Each ICD-ID has a row in the traceability matrix linking to satisfying block(s) and verifying test case(s).
