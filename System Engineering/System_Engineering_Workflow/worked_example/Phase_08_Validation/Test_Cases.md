# Test Cases — EVCN

> Verification (built right) cases are summarized in `Phase_07_Verification/Verification_Matrix.md`. This file expands selected critical cases and the validation suite (built the right thing).

---

## 1. Verification Cases (selected)

### TC-VER-03 — Energy Start ≤ 10 s After Auth

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-03 |
| **Priority** | High |
| **Type** | Functional / Performance |
| **Preconditions** | Lab DCFC station online, OCPP `BootNotification` accepted; load bank connected; Stripe sandbox ready. |
| **Steps** | 1. Plug load bank into station (CP state B). *Expected:* state goes Idle → Authenticating in ≤ 200 ms. <br> 2. Tap RFID. *Expected:* Authorize.req sent within 200 ms. <br> 3. Receive Authorize.conf=Accepted. *Expected:* state moves to Negotiating. <br> 4. Observe contactor close + meter start. *Expected:* energy delivery within 10 s of step 2. |
| **Final Expected Outcome** | Total elapsed time from RFID tap to first non-zero meter reading ≤ 10 000 ms (REQ-F-03). |
| **Evidence** | OCPP transcript, logic-analyzer capture, station log timestamps. |

### TC-VER-04 — E-Stop Opens Contactors ≤ 100 ms

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-04, REQ-P-06 |
| **Priority** | Critical (Safety) |
| **Type** | Functional / Safety |
| **Preconditions** | Station charging at 100 kW into load bank; oscilloscope on contactor coil + DC bus. |
| **Steps** | 1. Press red E-Stop button on dispenser. *Expected:* coil current drops within 100 ms; DC bus collapses within 200 ms. <br> 2. Observe `StatusNotification(Faulted)` to CSMS within 5 s. <br> 3. Verify station does not auto-recover; requires technician unlock. |
| **Final Expected Outcome** | Contactor open time ≤ 100 ms; fault logged; manual reset required. |
| **Evidence** | Oscilloscope screenshot with cursor measurements; CSMS event log. |

### TC-VER-21 — CSMS Sustained Load p99 ≤ 500 ms

| Field | Value |
|---|---|
| **Linked REQ** | REQ-P-05 |
| **Priority** | High |
| **Type** | Performance |
| **Preconditions** | Staging cluster prod-sized; k6 cluster with 5k concurrent virtual users; Grafana dashboards open. |
| **Steps** | 1. Run k6 script `csms_mixed.js` for 30 min: 5,000 RPS mixed (Authorize, MeterValues, TransactionEvent, REST `/stations`). 2. Capture p50/p95/p99 latency, error rate, CPU, memory, Postgres connections. |
| **Final Expected Outcome** | p99 ≤ 500 ms over the 30-min window; error rate ≤ 0.1%; no OOM, no Postgres connection saturation. |
| **Evidence** | k6 HTML report; Grafana export. |

### TC-VER-30 — TLS 1.3 + Cert Pinning

| Field | Value |
|---|---|
| **Linked REQ** | REQ-SEC-01 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Lab station; mitmproxy with rogue cert; testssl.sh installed. |
| **Steps** | 1. Run `testssl.sh wss://csms.evcn-test.example`. *Expected:* TLS 1.3 only; no TLS 1.0/1.1/1.2; HSTS present. <br> 2. Configure station to route via mitmproxy with rogue cert. *Expected:* station refuses to connect; logs `cert pin mismatch`. |
| **Final Expected Outcome** | Only TLS 1.3 negotiated; rogue-cert MITM blocked. |
| **Evidence** | testssl.sh report; station log entry. |

---

## 2. Validation Cases (Did we build the **right** system?)

### TC-VAL-01 — Driver First-Time Charge in < 30 s

| Field | Value |
|---|---|
| **Linked REQ** | REQ-U-01, REQ-U-04 |
| **Priority** | High |
| **Type** | Validation (Driver UX) |
| **Preconditions** | Pilot site live; 30 first-time drivers recruited; mobile app installed. |
| **Steps** | 1. Driver arrives at unfamiliar station and opens the app. <br> 2. Driver locates nearest available station, taps "Start". <br> 3. Plug in. <br> 4. Observe time from app open to first kWh delivered. |
| **Final Expected Outcome** | ≥ 95% (i.e., ≥ 28 of 30) drivers reach energy delivery within 30 s. |
| **Evidence** | App analytics; CSMS event timestamps. |

### TC-VAL-02 — Plug & Charge Across 3 OEMs

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-02, REQ-F-03 |
| **Priority** | High |
| **Type** | Validation (Interoperability) |
| **Preconditions** | DCFC station with PnC enabled; 3 EVs (Ford F-150 Lightning, Hyundai Ioniq 5, Mercedes EQS) with valid contract certificates. |
| **Steps** | For each EV: 1. Plug in (no app, no card). 2. Observe automatic authorization and start. 3. Drive cycle: charge 5 minutes, stop, unplug. |
| **Final Expected Outcome** | All 3 EVs: PnC handshake succeeds, charge starts ≤ 10 s, settlement reaches contract holder. |
| **Evidence** | OCPP + ISO 15118 transcripts; settlement record. |

### TC-VAL-03 — Multi-Connector Concurrent Charging

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-05 |
| **Priority** | High |
| **Type** | Validation (Reliability) |
| **Preconditions** | Site with 4-connector dispenser; 4 different drivers (or 3 drivers + 1 load bank). |
| **Steps** | 1. Start session on connector A (50 kW). <br> 2. Start session on connector B (100 kW). <br> 3. Start session on connector C (150 kW). <br> 4. Start session on connector D (50 kW). <br> 5. SEM enforces site cap (250 kW). *Expected:* sessions throttle proportionally; no fault. <br> 6. Stop sessions in random order. |
| **Final Expected Outcome** | All 4 sessions complete; no error; site cap respected; per-session billing accurate to 1%. |
| **Evidence** | CSMS log; meter readings vs reference. |

### TC-VAL-04 — DR Throttling Network-Wide

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-10 |
| **Priority** | High |
| **Type** | Validation (Grid Integration) |
| **Preconditions** | 50 stations charging in pilot; OpenADR VTN simulator authorized for the cohort. |
| **Steps** | 1. Send `LOAD_DISPATCH` event with 50% setpoint reduction for 30 min. <br> 2. Measure aggregate site power at t+0, t+30s, t+60s, t+5min. *Expected:* network-aggregate power reduced ≥ 50% within 60 s. <br> 3. End event; verify resume. |
| **Final Expected Outcome** | Aggregate throttle within 60 s, return to nominal within 60 s of event end, audit log entries for every station. |
| **Evidence** | DR Orchestrator log; per-station MeterValues; Grafana time-series. |

### TC-VAL-05 — 24-h Offline Operation

| Field | Value |
|---|---|
| **Linked REQ** | REQ-O-04 |
| **Priority** | High |
| **Type** | Validation (Reliability) |
| **Preconditions** | Lab station with fully populated offline allow-list (last 24 h tokens). |
| **Steps** | 1. Drop cellular link via iptables. <br> 2. Drivers from allow-list charge: 10 sessions over 20 h. *Expected:* all complete. <br> 3. Restore link. <br> 4. Observe buffered events drain to CSMS within 5 s of reconnect (REQ-F-12). |
| **Final Expected Outcome** | All 10 sessions complete; events drain in correct chronological order; settlement matches local meters. |
| **Evidence** | iptables logs; OCPP buffered transcript. |

### TC-VAL-06 — OCPI Roaming Session

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-07, ICD-07 |
| **Priority** | Medium |
| **Type** | Validation (Roaming) |
| **Preconditions** | OCPI partner sandbox token; partner CDR endpoint configured. |
| **Steps** | 1. Driver presents partner-issued RFID. <br> 2. CSMS forwards Authorize via OCPI to partner. *Expected:* accepted within 3 s. <br> 3. Charge 10 min. <br> 4. CDR posts to partner at session end. |
| **Final Expected Outcome** | Session authorized via roaming; CDR settlement matches partner reconciliation within 0.5%. |
| **Evidence** | OCPI message logs; partner reconciliation report. |

### TC-VAL-07 — ADA Operability

| Field | Value |
|---|---|
| **Linked REQ** | REQ-U-02 |
| **Priority** | High |
| **Type** | Validation (Accessibility) |
| **Preconditions** | Pilot dispenser; tester in wheelchair (simulated or real); ADA reach templates. |
| **Steps** | 1. Approach station; reach all interactive elements (display, RFID, EMV reader, E-Stop) from a seated position 15"–48" reach range. <br> 2. Complete a full session start-to-finish. |
| **Final Expected Outcome** | All controls reachable; full session completed without assistance. |
| **Evidence** | Photo + measurement record; tester acceptance. |

### TC-VAL-08 — Operator Dashboard SLA Drill

| Field | Value |
|---|---|
| **Linked REQ** | REQ-O-01, REQ-O-06 |
| **Priority** | Medium |
| **Type** | Validation (Operations) |
| **Preconditions** | Pilot site; one technician on call; one synthetic fault scheduled. |
| **Steps** | 1. Inject GFCI fault remotely. <br> 2. Operator dashboard alerts within 1 min. <br> 3. Technician dispatched; reaches site, clears fault, returns to service. <br> 4. Measure end-to-end MTTR. |
| **Final Expected Outcome** | Fault detected ≤ 1 min, MTTR ≤ 24 h (target ≤ 4 h for active sites). |
| **Evidence** | Pager log; ops timeline. |

### TC-VAL-09 — Tariff Update Propagation

| Field | Value |
|---|---|
| **Linked REQ** | REQ-F-09, §7.1 Operator Procedures |
| **Priority** | Medium |
| **Type** | Validation (Operator) |
| **Preconditions** | Operator with tariff-edit role; 5 stations at one site. |
| **Steps** | 1. Operator changes off-peak rate. <br> 2. Confirm new rate visible on station HMI within 60 s on all 5 stations. <br> 3. Start a session and verify final invoice uses new rate. |
| **Final Expected Outcome** | Rate propagated within 60 s; billing reflects new rate; audit log captures change. |
| **Evidence** | Dashboard screenshots; HMI photos with timestamps; invoice. |

### TC-VAL-10 — GDPR Right to Erasure

| Field | Value |
|---|---|
| **Linked REQ** | REQ-SEC-06 |
| **Priority** | High |
| **Type** | Validation (Compliance) |
| **Preconditions** | Driver account with 6 months of session history. |
| **Steps** | 1. Driver submits DSAR via app. <br> 2. Cloud queues erasure job. <br> 3. Within 30 days, all PII purged from primary stores; billing records retained per legal basis. <br> 4. Driver receives confirmation. |
| **Final Expected Outcome** | PII removed; legal-basis records retained per policy with redaction; SLA ≤ 30 days. |
| **Evidence** | Erasure ticket; data-store query showing absence; legal sign-off. |

### TC-VAL-11 — Severe-Weather Pilot

| Field | Value |
|---|---|
| **Linked REQ** | REQ-O-01, REQ-O-04 |
| **Priority** | Medium |
| **Type** | Validation (Environment) |
| **Preconditions** | Cold-climate pilot site; instrumented temperature sensors. |
| **Steps** | 1. Operate continuously through 7-day cold snap (≤ −20 °C). <br> 2. Track session success rate, fault rate, condensation events. |
| **Final Expected Outcome** | Success rate ≥ 95%; no fire/safety event; condensation events documented and resolved without manual intervention > 1× per station. |
| **Evidence** | Telemetry; weather log; ops report. |

### TC-VAL-12 — Pilot User Acceptance

| Field | Value |
|---|---|
| **Linked REQ** | All driver-facing REQs |
| **Priority** | High |
| **Type** | Validation (UAT) |
| **Preconditions** | Pilot deployed; 200+ drivers complete in-app survey; analytics live. |
| **Steps** | 1. Track NPS, session success rate, payment failure rate, support tickets per 100 sessions. <br> 2. Hold weekly pilot review. <br> 3. Fix top defects per cycle; re-measure. |
| **Final Expected Outcome** | NPS > 30; success rate > 95%; payment failures < 0.5%; tickets < 2 per 100 sessions by end of pilot. |
| **Evidence** | Survey report; analytics export; defect log. |

---

## 3. Coverage Summary

| Suite | Cases | Maps to |
|---|---|---|
| **Verification (TC-VER-*)** | 35 (full list in `Phase_07_Verification/Verification_Matrix.md`) | 1:1 to all REQs in SysRS |
| **Validation (TC-VAL-*)** | 12 | Driver/operator/utility journeys, compliance, environment, UAT |
| **Pilot acceptance** | Continuous (TC-VAL-12 + analytics) | NPS, uptime, support load |
