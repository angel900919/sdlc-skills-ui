---
Document: TalentFlow — Runbook RB-02 (Erasure / DSAR SLA Breach)
Document ID: RB-02-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation); GDPR Arts. 15, 17
Status: Draft
Owner: Privacy & Compliance Ops (STK-05)
---

# RB-02 — Erasure / DSAR Approaching or Past Legal Window

**Trigger:** `SLO-12` alert — an erasure (REQ-SEC-08, ≤ 30 d) or access/export (REQ-SEC-07) request is within `TODO` days of, or past, its legal window; or the nightly erasure-completeness audit finds residual PII.
**Linked:** SLO-12 · REQ-SEC-07, REQ-SEC-08, REQ-O-04 · RSK-02 · MOP-13 / TPM-04 · SCN-03 · CR-TBD

- **Symptom** — DSAR/erasure queue item aging past threshold on the *Compliance* dashboard, or `pii_residual_found` non-zero from the §5.2 nightly erasure-completeness check across primary store, search index, object storage, or backups.
- **Triage** —
  1. Declare **S1** if a legal window is breached or PII confirmed residual after a completed erasure; else **S2**.
  2. Identify which store still holds PII (primary / index / object / backup) from the audit trail.
  3. Confirm the request was authorized and identity-verified (SCN-03) before acting.
- **Mitigation** — Manually trigger the Privacy & Erasure Service cascade for the affected stores; for backups, confirm **crypto-erase** (per-tenant/per-record key destruction) rather than waiting for backup rotation.
- **Resolution** — Verify PII is irrecoverable across all stores; produce the auditable proof-of-completion (REQ-SEC-08) and certificate where required; clear the queue item; update MOP-13/TPM-04.
- **Post-incident trigger** — PIR; if a store or integrated copy was missed by the cascade, **loop-back `CR-<nn>` via Phase 09** to extend REQ-SEC-08 coverage. Feed into the annual DPIA review (§7) and notify the controller (tenant) per the DPA.
