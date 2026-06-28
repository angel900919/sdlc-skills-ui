---
Document: Risk Register — <PRODUCT_NAME>
Document ID: RISK-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 10 · Risk Register (delivery risks RSK-* + dependencies DEP-*). Owning skill:
pm-phase-10-delivery. Conforms to ../05_Conventions.md (§3 IDs RSK-*/DEP-*/ISS-*, §5.3 risk
scoring Likelihood × Impact, §6 frontmatter/Living). This file MIRRORS the cross-cutting
_threads/Risk_Register.md — keep them in sync; the thread is the lifecycle-wide source of truth.
Companions: Delivery_Plan.md · Sprint_Plan.md · Release_Readiness.md (reviews this at G8).
Discovery risk (the four big risks + ethics) is scored separately in Phase 07 — not here.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Status: Living — risks open and close continuously; reviewed at every gate.
-->

# Risk Register — <PRODUCT_NAME>

## How to score (Conventions §5.3)
**Score = Likelihood × Impact**, each rated **1–5** → a 5×5 matrix banded Low / Medium / High / Critical.
<!-- Tune the band thresholds with the team if needed; keep them consistent across the register. -->

- **Likelihood 1–5:** 1 Rare · 2 Unlikely · 3 Possible · 4 Likely · 5 Almost certain.
- **Impact 1–5:** 1 Negligible · 2 Minor · 3 Moderate · 4 Major · 5 Severe (outcome/release-threatening).
- **Bands (L×I):** **Low** 1–4 · **Medium** 5–9 · **High** 10–15 · **Critical** 16–25.

| L \ I | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **5** | Med 5 | High 10 | High 15 | Crit 20 | Crit 25 |
| **4** | Low 4 | Med 8 | High 12 | High 16→Crit | Crit 20 |
| **3** | Low 3 | Med 6 | Med 9 | High 12 | High 15 |
| **2** | Low 2 | Low 4 | Med 6 | Med 8 | High 10 |
| **1** | Low 1 | Low 2 | Low 3 | Low 4 | Med 5 |

- **Response strategy:** `Avoid` · `Reduce/Mitigate` · `Transfer` · `Accept` (record which, and the residual band).
- **Gate rule:** no **unmitigated High/Critical** `RSK-*` may pass **G8** (`Release_Readiness.md`).

## Risk register — `RSK-*`
<!-- One row per risk. "Trace" links the at-risk thing (RMI-/OPP-/US-/MET-). Keep mitigations actionable. -->

| RSK- | Risk (cause → effect) | Category | L (1–5) | I (1–5) | Score | Band | Strategy | Mitigation / trigger | Owner | Status | Trace |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RSK-<nn> | <if … then …> | <Delivery/Tech/Dependency/People/Security/Compliance/Market> | <> | <> | <L×I> | <Low/Med/High/Crit> | <Reduce> | <action + early-warning trigger> | <name> | <Open/Mitigating/Closed> | RMI-<nn>/US-<nn>/MET-<nn> |
| RSK-<nn> | <…> | <> | <> | <> | <> | <> | <> | <> | <name> | Open | <> |
| RSK-<nn> | <carried-forward open ASM-<nn> from Phase 07> | Delivery | <> | <> | <> | <> | <> | <> | <name> | Open | ASM-<nn> |

## Dependencies — `DEP-*`
<!-- Cross-team / external / technical blockers. A slipped dependency is a live risk — link it to a RSK- if material. -->

| DEP- | Dependency (what we need, from whom) | Type | Needed by | Owner | Status | Blocks | Linked RSK- |
|---|---|---|---|---|---|---|---|
| DEP-<nn> | <…> | <Cross-team/External/Tech/Vendor> | <YYYY-MM-DD> | <name> | <Open/Confirmed/Resolved> | RMI-<nn>/US-<nn> | RSK-<nn> / — |
| DEP-<nn> | <…> | <> | <YYYY-MM-DD> | <name> | Open | <> | — |

## Review cadence & change log
<!-- Living artifact — review at standups for High/Critical, and at every gate for the full set. -->
- Cadence: `<High/Critical reviewed each iteration; full register reviewed at each gate>`.
- Escalation: any new **Critical** → flag to `<accountable role>` + log `DEC-<nn>` in `_threads/Decision_Log.md`.

| Date | vX.Y | Change (RSK-/DEP- opened, re-scored, closed) | By |
|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial register | <name> |

---
*Owning skill:* **pm-phase-10-delivery** · *Mirrors:* **../_threads/Risk_Register.md** (lifecycle source of truth) ·
*Companions:* **Delivery_Plan.md** · **Sprint_Plan.md** · **Release_Readiness.md** · *Conventions:* ../05_Conventions.md (§5.3)
