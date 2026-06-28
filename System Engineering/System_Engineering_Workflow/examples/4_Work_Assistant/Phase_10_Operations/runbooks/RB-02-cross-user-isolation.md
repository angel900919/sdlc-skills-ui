---
Document: Runbook RB-02 — Cross-User Access / Isolation Breach
Document ID: RB-ARIA-02-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation) · ISO/IEC 27001:2022
Status: Draft
Owner: Security Operations (STK-04)
---

# RB-02 — Cross-user access / isolation breach (zero-tolerance)

**Trigger:** `SLO-11` < 100 % — an out-of-policy or cross-user access attempt was *not* blocked, or the hourly two-user isolation probe (§5.2) detects user-A data in a user-B context.
**Linked:** SLO-11 · REQ-SEC-03 · REQ-SEC-02 · MOP-06 · MOE-04 (trust-critical, target 0) · RSK-02 · CR-TBD (Phase 09)
**Default severity:** **S1** (Conventions §5.1) — automatic; no error budget (§3).

- **Symptom** — Isolation probe alert; or a log query returns a record whose per-user **isolation tag** does not match the request's authenticated user; or a guardrail log shows a cross-user retrieval/cache/model-context hit that was served rather than denied (REQ-SEC-03).
- **Triage** — Open **Trust** dashboard → `SLO-11`. From logs (correlation ID + isolation tag) identify the two users and the seam where isolation failed: RAG index, cache, model context window, or a connector using a non-delegated credential (would also breach REQ-SEC-02). Determine whether data was *exposed to a human* (response rendered) or only mishandled internally — both are S1, but exposure drives notification scope. Page DPO (STK-05) — a confirmed exposure of email/CRM PII is a potential GDPR personal-data breach (Art. 33 timeline).
- **Mitigation** — Isolate the offending path: disable the implicated cache/index shard or pin the connector to deny mode; if a single tenant/user is affected, suspend that session. If a tenant-wide/app-only credential is found in use (REQ-SEC-02 violation), revoke it at the token vault immediately (links RB-07).
- **Resolution** — Fix the isolation enforcement (scope filter / index partitioning / context construction). Re-run the isolation regression + a targeted pen-probe (§5.2, §7) and assert 0 cross-user leakage before reopening the path. Complete any GDPR breach-notification workflow with the DPO.
- **Post-incident trigger** — Always S1 → PIR within 5 business days. **Loop-back mandatory:** `CR-*` via Phase 09 to harden REQ-SEC-03 (and REQ-SEC-02 if a non-delegated credential was implicated) and add the leak vector to the isolation eval + pen-test scope (REQ-SEC-08). Re-confirm before next GA-cohort promotion.
