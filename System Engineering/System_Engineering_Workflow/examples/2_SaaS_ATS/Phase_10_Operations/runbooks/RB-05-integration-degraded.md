---
Document: TalentFlow — Runbook RB-05 (Integration Partner Down → Degraded Mode)
Document ID: RB-05-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation)
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# RB-05 — Integration Partner Down → Degraded Mode (Queue-and-Retry)

**Trigger:** `SLO-09` alert — integration retry success < 99.9% or a partner (calendar / email / job-board / HRIS) API/auth failing; contract-test break (RSK-04).
**Linked:** SLO-09 · REQ-INT-04, REQ-F-05/06/07/08, REQ-U-03 · RSK-04 · MOP-08 · SCN-04 · CR-TBD

- **Symptom** — Partner calls failing/timing out; queue depth rising; recruiters see the degraded-integration banner (REQ-U-03). Core pipeline read/write unaffected (Degraded mode, SysRS §9).
- **Triage** —
  1. Usually **S3** (single integration) — **S2** if it blocks a contracted workflow widely.
  2. Identify the partner and failure type: outage, rate-limit, auth/credential, or breaking API change.
  3. Confirm **fail-safe** held — items are queued, not dropped (REQ-INT-04, no data loss).
- **Mitigation** — Confirm queue-and-retry with backoff is draining; if a credential/token expired, rotate it; if a breaking API change (RSK-04), pin/adjust the connector. Keep the user-facing degraded banner accurate (REQ-U-03).
- **Resolution** — Partner restored; queue drains with 100% retry success (MOP-08); verify no candidate timeline gaps (REQ-F-05).
- **Post-incident trigger** — PIR if data loss occurred (would be a REQ-INT-04 violation → **loop-back `CR-<nn>`**). Update partner-change monitoring and the contract test; feed GD-02 chaos catalog.
