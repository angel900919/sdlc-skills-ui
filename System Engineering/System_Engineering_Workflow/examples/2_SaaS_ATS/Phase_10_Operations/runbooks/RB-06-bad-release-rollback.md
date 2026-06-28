---
Document: TalentFlow — Runbook RB-06 (Bad Release / Auto-Rollback)
Document ID: RB-06-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation, Maintenance)
Status: Draft
Owner: SRE / Platform Lead (STK-07)
---

# RB-06 — Bad Release / Auto-Rollback

**Trigger:** cohort gating-metric breach during a §8 rollout (SLO-01 burn, error/crash spike, latency regression, ticket spike, or any SLO-10 cross-tenant hit); failed deployment health check.
**Linked:** REQ-O-03 (zero-downtime staged deploy + auto-rollback) · SLO-01/02/03/10 · GD-04 · CR-<nn> (the offending release)

- **Symptom** — A cohort (Canary / Wave 1) shows regression vs. baseline; auto-rollback fired or a health check failed during a staged deploy.
- **Triage** —
  1. Severity by what regressed: isolation/privacy (SLO-10/11/12) → **S1**, always-auto rollback; availability/latency → **S2**; minor → **S3**.
  2. Confirm which `CR-<nn>` artifact deployed and to which cohort (from the §8 OTA audit log: CR ref + signed hash + cohort log).
  3. Verify auto-rollback completed to the previous signed artifact (REQ-O-03); if ambiguous signal, decide manual rollback.
- **Mitigation** — Roll back to the last-good signed artifact (auto, or manual here for ambiguous cases); halt cohort promotion; confirm schema migrations are backward-compatible (expand-then-contract, §8) so rollback strands no data.
- **Resolution** — Restore Nominal on the good artifact; fix forward in a new `CR-<nn>`; re-enter the cohort pipeline from Canary.
- **Post-incident trigger** — PIR; if a gating metric was missing that would have caught it, add it (§8). File the retrospective `CR-<nn>` audit entry per Phase-09 governance; feed GD-04 chaos catalog.
