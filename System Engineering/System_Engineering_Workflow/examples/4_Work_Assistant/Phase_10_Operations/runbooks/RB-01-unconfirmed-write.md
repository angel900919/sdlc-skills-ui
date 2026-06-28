---
Document: Runbook RB-01 — Unconfirmed Write Detected
Document ID: RB-ARIA-01-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation) · IEEE 1012-2016
Status: Draft
Owner: Platform / SRE Lead (STK-07)
---

# RB-01 — Unconfirmed write detected (zero-tolerance)

**Trigger:** `SLO-10` ≠ 0 — a write reached an upstream without a recorded explicit confirmation.
**Linked:** SLO-10 · REQ-F-09 · REQ-SAF-01 · MOP-05 · MOE-04 (trust-critical, target 0) · CR-TBD (Phase 09)
**Default severity:** **S1** (Conventions §5.1) — automatic; no error budget (§3).

- **Symptom** — Audit stream shows an `outcome=executed` write whose `confirmation_status` is absent/`pending`/`bypassed`; or the action-safety synthetic probe (§5.2) flips from "blocked" to "executed". On-call is paged together with AI Ops (STK-08) and Security (STK-04).
- **Triage** — Open the **Trust** dashboard → `SLO-10` panel. Pull the offending trace (Tempo): confirm whether the Action-Confirmation Gate was bypassed, mis-fired, or the audit `confirmation_status` was simply not written (latter = a `SLO-13` audit defect, re-triage to RB-09, still S1). Identify the affected user(s), tool, and target system from the audit record (REQ-SEC-06). Confirm blast radius: one user or systemic. Declare **S1**.
- **Mitigation** — **Freeze writes immediately**: flip the global write kill-switch (Action-Confirmation Gate → deny-all-writes), so Aria reverts to read-only while keeping dashboards/chat up. This routes through the Phase-09 emergency-change path (CCB notified). If the cause is a specific model/prompt/allow-list CR in a cohort, auto-rollback (§8) should already have fired — verify, and roll back manually if not.
- **Resolution** — Root-cause the gate bypass (code/config/CR). Where the upstream supports it, issue the undo reference recorded under REQ-SAF-02 to reverse the erroneous write; notify the affected employee. Restore writes only after a regression run of the action-safety eval (§5.1 system rung) passes "attempt unconfirmed write ⇒ 0 execute".
- **Post-incident trigger** — Always: this is S1 → blameless PIR within 5 business days (§10). **Loop-back is mandatory** — file a `CR-*` via `se-phase-09-change-config` to strengthen REQ-F-09/REQ-SAF-01 and/or add the missed case to the action-safety eval set; add a regression test and (if a new failure mode) a chaos injection. Update MOE-04 incident count.
