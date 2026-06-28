---
Document: Runbook RB-08 — Bad OTA Push / Rollback — SentinelEdge
Document ID: RB-08-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation/Maintenance) · IEEE 1012-2016
Status: Draft
Owner: SRE / Fleet Operations Lead
---

# RB-08 — Bad OTA Push / Rollback

**Trigger:** SLO-10 (fleet-update reach) or SLO-11 (auto-rollback completion) breach during an OTA rollout; cohort health-check failure; chaos GD-02.  **Linked:** SLO-10 · SLO-11 · REQ-F-06 · REQ-O-03 · DEC-04/DM-04 · RSK-06 · CR-TBD

A degraded or wrong firmware/model OTA must never persist or brick a node (SN-10, REQ-O-03). Auto-rollback is the primary control; this runbook covers ambiguous cases and rollback that doesn't complete. Owned by Fleet Ops; Data-Science secondary for model OTAs, OT/Security for signing/identity.

- **Symptom** — A cohort fails its gating metrics (accuracy/FPR regression, node Fault-state spike, battery-drain spike, or signed-boot/identity failure — §8); SLO-10 stalls (update not reaching the cohort) or SLO-11 shows auto-rollback not completing within `TODO: rollback_target`. Field reports of nodes stuck in Updating/Rollback (SyRS §9 states).

- **Triage** —
  1. Open the **OTA rollout** dashboard / Tempo trace for the active `CR-*`; identify the failing cohort and the gating metric that breached.
  2. Read the OTA audit log (§8): `CR-*` ref, signed artifact hash, SBOM ref, `model_version`/`lineage_id`, cohort progression.
  3. Confirm whether **auto-rollback already fired** (SLO-11). If it fired and completed → incident is contained, proceed to Resolution. If it stalled → this is the manual-rollback path.
  4. **Severity call:** any node left non-functional or unable to roll back → **S1** (violates REQ-O-03 "no device left non-functional"); contained auto-rollback with no field impact → **S3**.

- **Mitigation** —
  - If auto-rollback stalled → execute **manual rollback** to last known-good firmware/model for the cohort via the OTA service; halt promotion to all further cohorts.
  - Freeze the offending OTA (error-budget policy → Phase-09 CCB); quarantine the bad artifact in the registry so it cannot be re-promoted.
  - For any **signed-boot / identity** failure in the cohort → escalate to RB-06 (treat as potential RSK-06) before any further push.
  - Offline nodes that haven't taken the bad image keep detecting and buffering normally (REQ-O-02) — no action needed beyond confirming they are not targeted next.

- **Resolution** — All affected nodes confirmed on a known-good, signed, attesting image; SLO-10/11 recover; the bad artifact remains quarantined. File the rollback as a **retrospective `CR-*`** if the push/rollback bypassed a pre-filed CR (e.g. emergency CVE OTA). Re-run the failed image through the model-eval / integration / HIL gates (§5.1) before any re-attempt.

- **Post-incident trigger** — Open a PIR for any S1/S2. If the failure mode (a regression class, a rollback edge case, a cohort-health gap) **is not covered by REQ-F-06 / REQ-O-03**, file a **CR-* via Phase 09** to strengthen the OTA-governance requirement or the gating-metric set. Feed outcomes to RSK-06 and to GD-02's chaos hypothesis for the next game day.
