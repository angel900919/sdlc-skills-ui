---
Document: Runbook RB-02 — False-Positive (Nuisance-Alert) Surge — SentinelEdge
Document ID: RB-02-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation/Maintenance) · IEEE 1012-2016
Status: Draft
Owner: SRE / Fleet Operations Lead
---

# RB-02 — False-Positive (Nuisance-Alert) Surge

**Trigger:** SLO-02 burn-rate alert (false-positive rate above `TODO: fpr_target`, alerts/device-month).  **Linked:** SLO-02 · REQ-P-01 · TPM-02 · RSK-02 · CR-TBD

This is the adoption-killer runbook (RSK-02): nuisance alerts erode STK-01/STK-03 trust and the system stops being acted on. Owned by Fleet Ops; Data-Science (STK-05) is secondary.

- **Symptom** — Nuisance-alert rate climbs above the SLO-02 budget for one or more cohorts; STK-01 reports alerts not matching real machine condition; SLO-02 burn-rate page (2%/1h or 5%/6h) fires. May be fleet-wide (model regression) or asset/cohort-local (mis-baselining).

- **Triage** —
  1. Open the **FPR-by-cohort** Grafana dashboard; determine scope: single asset profile, one OTA cohort, or fleet-wide.
  2. Correlate by `model_version` / `lineage_id` (logs join key, REQ-F-07): did a recent model OTA (§8) precede the surge? Check the OTA audit log for the cohort.
  3. Pull a sample of the flagged alerts + their retained explanations (REQ-F-07) and confirm with STK-01 whether they are genuinely false.
  4. **Severity call:** sustained, trust-eroding, fleet-wide → **S2**; localized/cosmetic → **S3**.

- **Mitigation** (stop the bleeding) —
  - If the surge correlates with a recent model OTA cohort → **roll that cohort back** to last known-good (RB-08 / REQ-O-03); freeze further model-OTA promotion via the error-budget policy (routes through Phase-09 CCB).
  - If asset-local mis-baselining → re-trigger the per-asset baseline-learning window (SCN-04) for affected assets; raise the confidence gate on those assets' alerts.
  - Notify STK-01 that affected alerts are under review to protect trust.

- **Resolution** — Restore SLO-02 within budget: confirm the rolled-back / re-baselined cohort's FPR returns under target on the nightly conformance replay (§5.2). If the cause is a genuine model-quality regression, hold the new model in the model-eval gate (§5.1) until it passes recall/FPR before re-promotion.

- **Post-incident trigger** — Open a PIR for any S2. If the false positives stem from a **fault pattern not in REQ-P-01's qualified target fault classes** (the model is firing on conditions it was never specified to handle), file a **CR-* via Phase 09** to extend the qualified class set or tighten the FPR threshold — do not silently re-tune in ops. Feed the outcome to RSK-02 and TPM-02 margin in `TPM_Tracker.md`.
