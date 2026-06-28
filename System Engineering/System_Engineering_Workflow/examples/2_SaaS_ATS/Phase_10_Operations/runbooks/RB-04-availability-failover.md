---
Document: TalentFlow — Runbook RB-04 (Availability SLO Burn / AZ Failover)
Document ID: RB-04-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation)
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# RB-04 — Availability SLO Burn / Availability-Zone Failover

**Trigger:** burn-rate alert on `SLO-01` (≥ 99.95% monthly availability) or `SLO-06` (failover RTO ≤ 15 min / RPO ≤ 5 min); AZ/datastore health-check failure.
**Linked:** SLO-01/06 · REQ-O-01, REQ-O-02 · RSK-03 · MOP-09/10 · TPM-01 · SCN-04 · CR-TBD

- **Symptom** — Availability dropping / 5xx spike at the gateway; one AZ or DB primary unhealthy; system transitioning Nominal → **Degraded** (SysRS §9). Burn-rate page (2%/1h → on-call; 10%/3d → CCB-gated freeze).
- **Triage** —
  1. Severity: full/partial outage → **S1**; single-AZ degradation with core preserved → **S2**.
  2. Confirm scope from the *Reliability* dashboard: which region/AZ, which services, read vs. write affected.
  3. Verify automatic failover engaged (REQ-O-02) — did traffic shift and the replica promote within RTO?
- **Mitigation** — If automatic failover did not engage, manually promote the standby and shift traffic; preserve core pipeline read/write (SCN-04); let non-critical integrations queue-and-retry (RB-05). If data integrity is at risk, enter **Read-Only / Safe** mode.
- **Resolution** — Recover the failed AZ/dependency; return to Nominal; confirm RPO (data-loss window ≤ 5 min) by reconciliation.
- **Post-incident trigger** — PIR; verify RTO/RPO against MOP-10; update TPM-01. If failover missed RTO/RPO, **loop-back `CR-<nn>`** on REQ-O-02 and add to GD-01 chaos catalog.
