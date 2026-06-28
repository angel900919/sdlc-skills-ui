# Integration Plan — EVCN

**Strategy:** **Incremental + Continuous Integration**, with selective top-down stubs early on. Aligns with the Hybrid V-Model + Agile lifecycle from `Phase_01_Concept/Project_Development_Plan.md`.

---

## 1. Increments

| # | Increment | Components Brought Online | Stubs / Drivers Used |
|---|---|---|---|
| **I1** | **Cloud + Mobile (top-down)** | CSMS + Session + Identity + Driver App | OCPP **simulator** stands in for stations; payment in **sandbox** mode. |
| **I2** | **Station Bring-up (bottom-up)** | Station Controller + OCPP stack against real PE | Cloud uses dev CSMS; Driver App not required. |
| **I3** | **Vehicle Communication** | ISO 15118 SECC against EVCC simulator (e.g., Vector Indigo, switch-ev) | Real EVs added in lab; conformance suite loaded. |
| **I4** | **End-to-End Lab Charge** | Increment 1 + 2 + 3 stitched: app starts session, station charges real EV. | Full real chain except pilot site. |
| **I5** | **Site Energy & DR** | Site Energy Mgmt (Modbus), DR Orchestrator (OpenADR VTN simulator). | Vendor VTN simulator until utility cutover. |
| **I6** | **OCPI Roaming** | OCPI Hub against partner sandbox. | Partner ack with their test tokens. |
| **I7** | **Operator Dashboard + Tariff** | Dashboard, Tariff Engine, RBAC. | None — full real. |
| **I8** | **Pilot Site (5 stations)** | Real installation, real users, monitored 2 weeks. | None. |
| **I9** | **Public Pilot (50 stations)** | Multi-site rollout with OTA. | Real production. |

Each increment has a documented **entry criteria** (prior increment passes its V&V) and **exit criteria** (pass rate ≥ 95% on its tied test cases plus zero severity-1 defects).

---

## 2. Dependency Map

```
I1 (Cloud + App) ─────────────┐
                              ▼
                            I4 (E2E Lab)
                              ▲
I2 (Station + PE) ──┐         │
                    ▼         │
                  I3 (15118)──┘
                              │
                              ▼
                            I5 (Site Energy + DR)
                              │
                              ▼
                            I6 (OCPI Roaming)
                              │
                              ▼
                            I7 (Operator Dashboard)
                              │
                              ▼
                            I8 (Pilot Site)
                              │
                              ▼
                            I9 (Public Pilot)
```

### Dependency Types
- **Data:** Driver App ← session events ← CSMS ← Station (OCPP TransactionEvent).
- **Control:** Station cannot deliver energy without CSMS `Authorize.conf=Accepted` (or offline allow-list).
- **Temporal:** Station boots → mTLS handshake → OCPP `BootNotification` → ready.
- **Resource:** Site shared 480 V supply must be sized to sum of station setpoints; SEM enforces.

### Stubs / Drivers / Mocks Inventory
| Item | Used Until | Tool |
|---|---|---|
| OCPP station simulator | I2 ready | OCA OCPP Conformance Tool (or `mock-charging-station`) |
| EVCC simulator | I3 ready | switch-ev `iso15118-ev` |
| OpenADR VTN simulator | I5 cutover to utility | EPRI VTN Tester |
| OCPI partner sandbox | I6 cutover to prod partner | `evcc-tools/ocpi-mock` |
| Payment sandbox | Pilot | Stripe test keys |

---

## 3. Continuous Integration

| Pipeline | Trigger | Stages |
|---|---|---|
| **Cloud services (Go)** | PR + main | lint → unit → integration (Postgres + Kafka in containers) → SAST (CodeQL) → image build → deploy to dev |
| **Mobile (Flutter)** | PR + main | lint → unit → widget tests → integration tests → store-track build for QA |
| **Web (React)** | PR + main | lint → unit → Playwright E2E → preview deploy |
| **Firmware (Rust)** | PR + main | clippy → unit → HIL smoke (lab rig) → signed nightly image |
| **OCPP conformance** | nightly | OCA test tool against latest CSMS image |
| **ISO 15118 conformance** | nightly | switch-ev test suite against latest firmware |

All pipelines fail-fast and gate merges; protected branches require green checks plus 1 reviewer (2 for safety-critical paths).

---

## 4. Hardware-in-the-Loop (HIL)

| Rig | Purpose |
|---|---|
| **Power-bench HIL** | Resistive + battery emulator load up to 350 kW; thermal soak. |
| **Protocol HIL** | OCPP test tool + EVCC simulator + utility VTN simulator on the same network. |
| **EMC chamber** | FCC / CE pre-compliance scans for DCFC dispenser. |
| **Field-replica rack** | Three pre-production stations + cellular modem in a Faraday cage with attenuator for poor-signal tests. |

Each HIL rig runs on a CI agent labeled `hil-*` so pipeline jobs can target hardware tests by tag.

---

## 5. Integration Lessons We Are Pre-Empting

Drawn from the Boeing 787 lesson cited in the Comprehensive Guide §7.3:

| Pitfall | Pre-emptive Action |
|---|---|
| Mismatched data standards across vendors | Single ICD baseline (`Phase_04_Architecture/ICD.md`); CR required to change. |
| Late hardware integration | I2 starts in Q1 with engineering samples; HIL rigs available before code. |
| Outsourced firmware that does not meet ICD | SiC-vendor firmware contractually adheres to our CAN-FD frame layout (ICD-03); we own conformance tests. |
| Cloud / station environment drift | All environments deployed via Terraform + Argo CD; identical IaC for dev/staging/prod. |

---

## 6. Pass / Fail Gate per Increment

| Increment | Pass Condition |
|---|---|
| I1 | App can authenticate, list sandbox stations, simulate a session end-to-end. |
| I2 | Station boots, registers with CSMS, charges resistive load to 350 kW for 60 min. |
| I3 | EVCC simulator and one real EV (Tesla, Ford) both complete PnC handshakes. |
| I4 | One real EV charged in lab via mobile app for 30 min; OCPP transcripts archived. |
| I5 | DR signal applied → station throttles within 60 s (REQ-F-10); SEM enforces site cap. |
| I6 | OCPI partner token charges successfully; CDR settles next day. |
| I7 | Operator can change a tariff; new price live on station within 60 s. |
| I8 | Pilot site: 100 sessions, > 95% success rate, zero severity-1 defects. |
| I9 | 50-station public pilot: 30-day uptime ≥ 98%, NPS > 30. |
