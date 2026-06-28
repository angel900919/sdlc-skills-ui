---
Document: TalentFlow — Runbook RB-01 (Cross-Tenant Access Breach)
Document ID: RB-01-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation); IEEE 1012-2016
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# RB-01 — Cross-Tenant Access Attempt Succeeded (Isolation Breach)

**Trigger:** `SLO-10` alert — successful cross-tenant data access count > 0 (any non-zero), or GD-05 chaos detection.
**Linked:** SLO-10 · REQ-SEC-01, REQ-C-01 · RSK-01 · MOE-02 / MOP-11 · CR-TBD (Phase 09 loop-back)

> **Highest-severity runbook.** A single confirmed cross-tenant read/write is an automatic **S1** and a trust/legal failure. There is **no error budget** for SLO-10.

- **Symptom** — `cross_tenant_access_success` series non-zero on the *Tenant Isolation & Privacy* dashboard; a request authenticated for tenant A returned or wrote tenant B's data; possible auditor/customer report.
- **Triage** —
  1. Declare **S1**; page IC + Security + Privacy on-call.
  2. Confirm real vs. false-positive: pull the offending trace (OpenTelemetry/Tempo) and audit-log (REQ-SEC-04) entries — does the `tenant_id` on the data differ from the authenticated principal's tenant?
  3. Scope blast radius: which tenants, how many records, read vs. write, time window (from audit log).
- **Mitigation** — Enter **Read-Only / Safe** mode (SysRS §9) for the affected data path to stop further writes; if a specific deploy introduced it, **auto-rollback** the offending `CR-<nn>` artifact (§8); revoke/rotate any session or key implicated.
- **Resolution** — Patch the authorization gap in the Tenant Isolation Layer; add a regression test (REQ-SEC-01 isolation test) to the per-commit hard-block suite (§5.1); restore Nominal mode after the isolation test passes in staging with ≥ 2 tenants.
- **Post-incident trigger** — **Mandatory PIR within 5 business days** + **mandatory loop-back `CR-<nn>` via Phase 09** to strengthen REQ-SEC-01 and add the missed case to the SysRS. Notify affected tenants/DPA per breach obligations (REQ-D-01, GDPR Art. 33). Add the failure mode to GD-05 chaos catalog.
