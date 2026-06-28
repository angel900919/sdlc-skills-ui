# Operations & Continuous Validation — EVCN

> Verification & Validation do not stop at GA. Operations continuously validates that the deployed system keeps meeting the SysRS in the field.

---

## 1. Operating Model

| Function | Responsibility |
|---|---|
| **NOC (24/7)** | Monitor station + cloud SLOs; triage alarms; coordinate technicians. |
| **Cloud SRE** | CSMS, billing, OCPI, DR; on-call rotation. |
| **Field Service** | Truck-rolls; first-time-fix; spares logistics. |
| **Customer Success** | Driver app support; refund issuance; pilot relationships. |
| **Compliance Ops** | Audit prep, PCI quarterly scans, GDPR DSAR queue. |
| **Security** | SOC, threat hunt, vulnerability mgmt. |

## 2. Service Level Objectives (SLOs)

| Metric | Target | Window | Linked REQ |
|---|---|---|---|
| Station availability (heartbeat / total) | ≥ 98% | 30-day rolling | REQ-O-01 |
| CSMS availability | ≥ 99.95% | 30-day rolling | REQ-O-02 |
| Session start success rate | ≥ 97% | weekly | REQ-F-03 |
| Auth → energy p95 | ≤ 10 s | weekly | REQ-F-03 |
| OCPP boot RTT p95 | ≤ 2 s | weekly | REQ-P-03 |
| Push notify p95 | ≤ 5 s | weekly | REQ-P-04 |
| Energy meter accuracy | ≤ 1% | quarterly | REQ-P-07 |
| MTTR | ≤ 24 h | rolling 90 days | REQ-O-06 |
| Driver NPS | ≥ 30 | quarterly | UAT acceptance |
| Payment failure rate | ≤ 0.5% | weekly | REQ-F-07 |

Error budgets derived from SLOs feed sprint planning: when an error budget is burned, feature freeze + reliability sprint kicks in.

## 3. Observability Stack

| Layer | Tool | Signals |
|---|---|---|
| Metrics | **Prometheus** + **Grafana** | RED metrics per service, OCPP frame rates, DR throttle response time |
| Logs | **Loki** + **Grafana** | Structured station logs, OCPP transcripts, audit log |
| Traces | **OpenTelemetry** + **Tempo** | Cross-service trace from app → CSMS → station log |
| Synthetic | **k6 cloud** + **Pingdom** | Public API uptime, auth flow probe |
| Real-User Monitoring | **Sentry** + **Datadog RUM** | Mobile crash, web vitals |
| Hardware | **Modbus telemetry** + **per-station fleet view** | Junction temp, contactor cycles, AC harmonics |

Dashboards (curated):
- **Driver Experience** — session success, push latency, NPS.
- **Fleet Health** — per-site availability heatmap, top failing stations.
- **Grid Integration** — DR signal lifecycle, throttle adherence.
- **Compliance** — PCI scan status, GDPR DSAR queue, log retention.

## 4. Continuous Validation Activities

| Activity | Cadence | Owner |
|---|---|---|
| **OCPP / 15118 conformance regression** | nightly | QA Automation |
| **k6 SLO probe** | continuous | SRE |
| **Synthetic charge session** (canary station) | hourly | SRE |
| **Chaos engineering** (network latency, station kill, region failover) | monthly | SRE + Platform |
| **STRIDE threat-model review** | quarterly | Security |
| **Penetration test** | annual + on major release | External vendor |
| **PCI scan + ASV** | quarterly | Compliance |
| **GDPR DPIA review** | annual + on data-flow change | Privacy Officer |
| **A/B tariff experiments** | continuous | Product |
| **Driver NPS survey** | every charge or weekly | Customer Success |

## 5. OTA Governance

- **Cohort-based rollout:** canary (1%) → 5% → 25% → 100% with health gates.
- **Health gates:** automatic rollback if cohort error rate > 0.5% or session success < 95% for 30 min.
- **Approval:** Class A firmware OTA requires CCB approval (`Phase_09_Change_Config/`).
- **Rollback:** previous image always retained; rollback automated via bootloader A/B partitions.
- **Audit:** every OTA produces a release record with REQ regression evidence.

## 6. Incident Response

| Severity | Definition | Response |
|---|---|---|
| **SEV-1** | Safety event, outage > 5 min, payment fraud, data breach | Page on-call + exec; war room within 15 min; status page within 30 min |
| **SEV-2** | Major degradation; one site offline | On-call within 30 min; resolution target 4 h |
| **SEV-3** | Minor degradation; single station fault | Ticket to field service; SLA 24 h |
| **SEV-4** | Cosmetic | Backlog |

Post-incident: blameless postmortem within 5 business days; action items tracked in Jira; learnings folded into runbooks and chaos tests.

## 7. Disposal & End-of-Life

| Item | Policy |
|---|---|
| Stations | 10-year design life; refurbishment program at year 7. |
| Lithium UPS batteries | Recycled via certified e-waste vendor (R2v3). |
| Personal data | Erasable on driver request (REQ-SEC-06); retained per legal basis only. |
| Logs | Retained 7 years (REQ-O-05); pseudonymized after 90 days. |
| Firmware images | Indefinite retention for forensic / regulatory purposes. |

## 8. Continuous Improvement Loop

```
SysRS  ←─────┐
   │         │
   ▼         │
 Build ──► Verify ──► Validate ──► Operate ──► Measure ──► CCB
                                                  │
                                                  └────► Update SysRS / Architecture / V&V
```

The same artifacts that defined the system at PDR/CDR are the ones updated as the system evolves. Continuous validation closes the loop back to the requirements baseline so that the deployed reality and the engineering record never drift apart.
