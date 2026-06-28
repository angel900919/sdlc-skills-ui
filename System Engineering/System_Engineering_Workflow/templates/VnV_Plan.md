---
Document: Verification & Validation Plan — <PROJECT NAME>
Document ID: VVP-<PROJECT_SLUG>-v0.1
Standard: IEEE 1012-2016
Status: Draft            # Draft → In Review → Baseline (TRR-approved YYYY-MM-DD) → Superseded by vX.Y
Owner: V&V Lead
---

# Verification & Validation Plan — <PROJECT NAME>

> **Phase 07 deliverable (governs Phases 07–08).** An integrity-level-driven V&V plan per **IEEE 1012-2016**. The integrity level scales the whole plan: depth of V&V tasks, evidence rigour, independence, and whether **IV&V** is required. Conforms to [`../05_Conventions.md`](../05_Conventions.md) for IDs, gates, T/I/A/D, severity, and citations — never redefines them.

<!-- HOW TO USE: Replace every <placeholder>. Resolve every TODO. Delete blocks/rows marked "(example — delete)". Set the integrity level FIRST (§1) — it drives everything else. Tie environments to Phase 06's CI/CD + HIL. -->

---

## 1. Integrity / Criticality Level

| Field | Value |
|---|---|
| IEEE 1012 integrity level | <1 (lowest) … 4 (highest) — TODO confirm> |
| Domain scheme it maps to | <DO-178C DAL A–E · ISO 26262 ASIL A–D · IEC 61508 SIL 1–4 · IEC 62304 Class A/B/C · n-a> |
| Assigned level (domain) | <DAL-x / ASIL-y / SIL-z / Class-C / n-a> |
| Rationale | <consequence of failure: safety / data loss / financial / regulatory; reuse the criticality recorded in Phase 00/02 if present> |

> `<Example — delete:>` *IEEE 1012 level 4 ↔ ISO 26262 ASIL D, because an unmitigated failure of the contactor-control function can cause an electric-shock hazard (HAZ-02).*

---

## 2. V&V Tasks (scaled to the integrity level)

> Higher integrity level ⇒ more tasks, deeper analysis, formal evidence. Tailor the rows to §1.

| V&V activity | In scope? | Tasks at this level | Owner |
|---|---|---|---|
| Planning V&V | <yes> | <V&V plan review; SVP/SVVP> | <V&V Lead> |
| Requirements V&V | <yes> | <traceability check; SMART/verifiability review of every REQ> | <…> |
| Design V&V | <yes / tailored out: reason> | <architecture/design review against allocated baseline> | <…> |
| Implementation / Test V&V | <yes> | <code review; unit/integration/system test review; coverage analysis> | <…> |
| Acceptance support | <yes> | <support Phase 08 acceptance — UAT/OAT/FAT/SAT/regulatory> | <…> |

---

## 3. Independence / IV&V Decision

| Field | Value |
|---|---|
| IV&V required? | <Yes / No — TODO> |
| Trigger basis | <high criticality: IEEE 1012 high integrity level · DAL A/B · ASIL C/D · SIL 3/4 · IEC 62304 Class C · any safety/regulated system in the Hazard Log → IV&V required; lower → in-team verification + peer review sufficient> |
| Independence basis (if required) | <organisational: verifier reports outside the implementing team · technical: separate tools · financial: separate budget line> |
| Separate evidence trail? | <Yes / No> |

> Per [`../05_Conventions.md`](../05_Conventions.md) §4, a structured **Review** is a form of **Inspection** (code `I`) — never an `R` code.

---

## 4. Roles, Environments & Entry/Exit Criteria

**Roles:**

| Role | Responsibility |
|---|---|
| V&V Lead | <owns this plan; reports the coverage rollup at TRR> |
| Verifier(s) | <execute TC-VER-*; record result.md> |
| IV&V (if required) | <independent verification + separate evidence trail> |
| <…> | <…> |

**Environments** (tie each to Phase 06's CI/CD + HIL — do not re-invent):

| Environment | Composition | Used for |
|---|---|---|
| <lab / HIL> | <rigs, DUTs from Phase 06 §7> | <hardware/physical-measurement REQs> |
| <CI / staging> | <pipeline from Phase 06 §6> | <unit/integration/contract verification> |
| <pre-prod> | <prod-like> | <system-level verification> |

**Entry / exit criteria per V&V activity:**

| Activity | Entry criteria | Exit criteria |
|---|---|---|
| <Requirements V&V> | <SysRS baselined> | <every REQ has a method + TC-VER> |
| <Implementation/Test V&V> | <build green; env ready> | <100% method coverage; evidence archived> |

---

## 5. Method Summary (how each T/I/A/D class is executed)

| Method | How it is executed here | Evidence lands at |
|---|---|---|
| **T** Test | <exercise system against threshold via CI/HIL> | verification-evidence/TC-VER-NN/result.md |
| **I** Inspection | <examine artifact/doc/code/config; structured review> | verification-evidence/TC-VER-NN/ + review minutes |
| **A** Analysis | <calculation / model / simulation / similarity> | verification-evidence/TC-VER-NN/ + analysis report |
| **D** Demonstration | <operate-and-observe; witness sign-off> | verification-evidence/TC-VER-NN/ + demo record |

---

## 6. Anomaly Handling

> Defects route to the single severity taxonomy and to change control — do not re-define them here.

| Field | Value |
|---|---|
| Defect severity scheme | `S1`–`S4` per [`../05_Conventions.md`](../05_Conventions.md) §5.1 |
| Triage / routing | <failed verification → log defect → severity-classify → fix or route to Phase 09 change control (CR-NN)> |
| Re-verification | <fixed defect re-runs its TC-VER before TRR sign-off> |
| Escalation to risk | <any REQ unverifiable before TRR, or a failed verification, raises/updates an RSK-NN> |

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs (§2), gates incl. TRR (§3), T/I/A/D (§4), severity (§5), citations (§9). **The contract.**
- [`../skills/se-phase-07-verification/SKILL.md`](../skills/se-phase-07-verification/SKILL.md) — full method, IV&V trigger, exit-gate checklist.
- Companion deliverable: [`Verification_Matrix.md`](Verification_Matrix.md) (5-column per-REQ matrix).
- Inputs: `Phase_00_Agreement/SEMP.md` (mandated integrity level) · `Phase_02_Requirements/SysRS.md` · `Phase_06_Integration/Integration_Plan.md` (environments) · cross-cutting `Hazard_Log.md`, `Threat_Model.md`, `TPM_Tracker.md`.
