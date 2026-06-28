---
Document: TalentFlow — Runbook RB-03 (Latency SLO Burn / Noisy Neighbor)
Document ID: RB-03-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation)
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# RB-03 — Read / Transition / Search Latency SLO Burn (incl. Noisy Neighbor)

**Trigger:** burn-rate alert on `SLO-02` (read p95 ≤ 300 ms), `SLO-03` (transition p95 ≤ 500 ms), `SLO-04` (search p95 ≤ 500 ms), or `SLO-05` (one tenant pushing another past target).
**Linked:** SLO-02/03/04/05 · REQ-P-01, REQ-P-02, REQ-P-03, REQ-P-04 · RSK-03 · MOP-01/02/05/06 · TPM-02/03 · CR-TBD

- **Symptom** — p95/p99 latency over threshold on the *Recruiter Experience* dashboard; error budget burning (2%/1h page). Per-tenant view may show one tenant's load correlating with another's latency rise.
- **Triage** —
  1. Severity by user impact: widespread → **S2**; single tenant → **S3**.
  2. RED metrics: is it Rate (load spike), Errors (cascading failure), or Duration (slow dependency)?
  3. USE metrics: datastore/index/queue saturation? Check the per-`tenant_id` series — is this **noisy-neighbor** (REQ-P-04)?
- **Mitigation** — If noisy-neighbor: tighten the offending tenant's **rate limit / quota** (REQ-P-04) to protect others; if capacity: scale out the saturated service/datastore read replicas; shed non-critical load.
- **Resolution** — Restore p95 within SLO; if a query/index regression, fix and ship via §8 cohorts; right-size the per-tenant quota.
- **Post-incident trigger** — PIR if budget exhausted; update TPM-02/03 margins in `TPM_Tracker.md`. If the load profile (REQ-P-03, `TODO` from Phase 06) proves wrong, **loop-back `CR-<nn>`** to revise the capacity requirement.
