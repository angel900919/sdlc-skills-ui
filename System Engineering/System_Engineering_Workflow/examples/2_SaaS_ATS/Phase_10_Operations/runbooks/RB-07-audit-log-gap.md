---
Document: TalentFlow — Runbook RB-07 (Audit-Log Capture Gap)
Document ID: RB-07-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation); ISO/IEC 27001:2022
Status: Draft
Owner: Privacy & Compliance Ops (STK-05)
---

# RB-07 — Audit-Log Capture Gap (PII Access Not Logged)

**Trigger:** `SLO-11` alert — PII-access events captured in the tamper-evident audit log < 100%; integrity-check / hash-chain anomaly on the audit log.
**Linked:** SLO-11 · REQ-SEC-04, REQ-D-02 · SN-10 · MOP-12 · CR-TBD

- **Symptom** — Reconciliation shows PII-access events without matching audit-log entries, or the audit log's tamper-evidence (hash chain / write-once integrity) check fails on the *Compliance* dashboard.
- **Triage** —
  1. **S2** (or **S1** if tamper/deletion of existing audit records is suspected — possible breach indicator).
  2. Determine scope: which service/path stopped emitting audit events, since when (the gap window).
  3. Confirm whether records are *missing* (capture gap) vs. *altered* (integrity failure) — the latter escalates.
- **Mitigation** — Restore audit emission on the affected path; if integrity is compromised, isolate the audit store write path and preserve forensic copies; do not let unaudited PII-access continue (consider Read-Only/Safe on that path).
- **Resolution** — Backfill audit entries where reconstructable from traces/logs; restore 100% capture (MOP-12); verify integrity chain intact.
- **Post-incident trigger** — PIR; report to Compliance for SOC 2 / ISO 27001 evidence impact (REQ-D-02) and notify the controller if PII handling lacked audit coverage. If a path was never instrumented, **loop-back `CR-<nn>`** on REQ-SEC-04 coverage.
