---
Document: Runbook RB-03 — Model Drift Alarm — SentinelEdge
Document ID: RB-03-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation/Maintenance) · IEEE 1012-2016
Status: Draft
Owner: SRE / Fleet Operations Lead
---

# RB-03 — Model Drift Alarm

**Trigger:** SLO-05 drift-detection alarm (field accuracy drifts beyond `TODO: drift_target` relative to the deployment baseline).  **Linked:** SLO-05 · REQ-P-04 · RSK-03 · CR-TBD

Drift degrades accuracy silently as machine/data distribution shifts (RSK-03). Owned by Data-Science (STK-05) as primary; Fleet Ops supports. Also fed by chaos GD-05.

- **Symptom** — Drift telemetry vs the deployment baseline crosses `drift_target`; a drift alarm is raised to STK-05 (REQ-P-04). May coincide with a slow rise in either missed faults (recall, SLO-01) or false positives (SLO-02) on affected cohorts.

- **Triage** —
  1. Open the **drift-score-by-cohort/asset-class** dashboard; identify whether drift is global, per asset class, or per site (seasonal/process change vs true model decay).
  2. Cross-check SLO-01 (recall) and SLO-02 (FPR) trends for the same cohort — is drift already translating into outcome degradation?
  3. Inspect `model_version` / `lineage_id` to confirm which deployed model is drifting and against which training-data lineage (REQ-F-07).
  4. **Severity call:** drift alarm without outcome degradation yet → **S3** (scheduled remediation); drift already breaching SLO-01/02 → **S2**.

- **Mitigation** —
  - If outcomes (SLO-01/02) are degrading now → apply the cohort-level interim mitigation from RB-02 (confidence-gate / re-baseline) to protect trust while a retrain is prepared.
  - Hand the drifting lineage to STK-05 to scope a retraining cycle (SCN-03); flag the cohort in the model registry so a corrective model is prioritized.
  - Hold non-corrective model OTA promotion if the budget policy (§3.1) indicates an SLO-01/02 burn.

- **Resolution** — A retrained/drift-corrected model is built, passes the model-eval gate (§5.1: recall/FPR + footprint + latency), is signed, and rolled out via governed OTA canary→waves (§8, SCN-03) with auto-rollback armed. Confirm SLO-05 returns within budget and SLO-01/02 recover on the affected cohort.

- **Post-incident trigger** — Open a PIR for any S2. If the drift mode was one REQ-P-04's `drift_target` or detection method **does not adequately catch** (detected too late, or missed a distribution shift class), file a **CR-* via Phase 09** to tighten `drift_target` or extend drift-detection scope. Update RSK-03 in the risk register and the relevant TPM margins.
