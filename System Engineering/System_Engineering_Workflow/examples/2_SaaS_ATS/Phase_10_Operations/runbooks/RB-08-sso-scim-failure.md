---
Document: TalentFlow — Runbook RB-08 (SSO Auth Failure / SCIM Stall)
Document ID: RB-08-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation); SAML 2.0; SCIM 2.0 (RFC 7644)
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# RB-08 — SSO Authentication Failure / SCIM Provisioning Stall

**Trigger:** `SLO-08` alert — SCIM provisioning propagation > 60 s (threshold 300 s); or a spike in SAML SSO authentication failures for a tenant.
**Linked:** SLO-08 · REQ-INT-01 (SAML SSO), REQ-INT-02 (SCIM) · SN-03 · MOP-07 · RSK-05 · SCN-02 · CR-TBD

- **Symptom** — Tenant users cannot sign in (SAML assertions rejected), or joiners/leavers are not provisioned/deprovisioned in time (SCIM lag) on the *Compliance* dashboard. Deprovisioning lag is a **security** concern (a leaver retains access).
- **Triage** —
  1. **S2** if a tenant cannot sign in at all; **S3** for SCIM lag without an access-revocation gap, **S2** if a leaver still has access.
  2. Determine scope: one tenant (IdP-side: cert rotation, clock skew, audience/signature — REQ-INT-01 validation) or platform-wide (Identity Gateway fault).
  3. For SAML failures, inspect the rejected assertion: signature, audience, or time-validation failure (REQ-INT-01).
- **Mitigation** — Tenant-scoped IdP issue: coordinate with the Customer Admin (STK-04) to fix cert/clock/metadata; do **not** weaken assertion validation. Platform-wide: fail over the Identity Gateway; for a leaver-access gap, manually revoke sessions/tokens immediately.
- **Resolution** — Restore SSO sign-in and SCIM sync within SLO (MOP-07); reconcile provisioning state with the tenant's IdP.
- **Post-incident trigger** — PIR if a deprovisioning gap left a leaver with access (security finding → possible **loop-back `CR-<nn>`** on REQ-INT-02 timeliness). Feed onboarding hardening (RSK-05, MOE-07 time-to-value).
