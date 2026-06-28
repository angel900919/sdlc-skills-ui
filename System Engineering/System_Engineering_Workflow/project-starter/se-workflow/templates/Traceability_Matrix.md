---
Document: Traceability Matrix (StRS → SyRS) — <Project Name>
Document ID: TRACE-<PROJECT_SLUG>-v1.0
Standard: ISO/IEC/IEEE 29148:2018
Status: Draft
Owner: Lead Systems Engineer
---

# Traceability Matrix — <Project Name>

> **How to use this template.** Replace every `<ANGLE-BRACKET placeholder>`, resolve every
> `TODO:` marker, and delete the rows marked `(example — delete)`. This carries the **golden
> thread** (Conventions §8): `SN ──derive──▶ REQ ──▶ MOP ──▶ method ──▶ TC-VER`. All IDs,
> classes, T/I/A/D codes, and priority follow [../05_Conventions.md](../05_Conventions.md).
>
> **Forward and backward traceability are both maintained continuously.** Bidirectional
> traceability is **mandatory** for safety-critical / regulated work (DO-178C, ISO 26262,
> IEC 62304). Promote this to a standalone document once the spec exceeds ~30 REQs.

---

## 1. Forward thread — Stakeholder Need → Requirement → Verification

> One row per REQ. **Every REQ must have a parent SN** (no orphan REQs) and **every SN must
> appear in ≥1 row** (no uncovered needs). `Verifying Activity` stays `TC-VER-TBD` until Phase 07.

| SN (StRS) | REQ ID | Statement (abbrev.) | Class | Priority | MOP | Method (seed) | Verifying Activity |
|-----------|--------|---------------------|-------|----------|-----|---------------|--------------------|
| SN-<nn> | REQ-<class>-<nn> | <short statement> | <F/U/P/O/SEC/INT/C/D/SAF> | <High/Medium/Low/N-A> | MOP-<nn> | <T/I/A/D> | TC-VER-TBD |
| _SN-01_ | _REQ-F-01_ | _<do X> within <N> <units> (example — delete)_ | _F_ | _High_ | _MOP-01_ | _T_ | _TC-VER-TBD_ |
| _SN-02_ | _REQ-P-01_ | _p95 latency ≤ <N> ms (example — delete)_ | _P_ | _Medium_ | _MOP-02_ | _T_ | _TC-VER-TBD_ |

---

## 2. Backward thread — Need coverage roll-up

> One row per stakeholder need. Confirms each `SN-<nn>` is covered by at least one REQ; an
> uncovered need fails the SRR gate (add a REQ or record it out-of-scope with rationale).

| SN (StRS) | Need (abbrev.) | Covering REQ(s) | Covered? |
|-----------|----------------|-----------------|----------|
| SN-<nn> | <need in stakeholder words> | REQ-<id>, REQ-<id> | <Yes / No — TODO> |
| _SN-01_ | _<need text> (example — delete)_ | _REQ-F-01_ | _Yes_ |

---

## 3. Measurement thread — MOE / MOP / TPM links

> Mirrors SyRS §10. MOE derives from a need; MOP derives from a REQ; TPM is a promoted MOP.

| Measure | Derived from | Type | Promoted to TPM? |
|---------|--------------|------|------------------|
| MOE-<nn> | SN-<nn> | Effectiveness (mission-level) | — |
| MOP-<nn> | REQ-<id> | Performance (system-level) | <TPM-<nn> / No> |

---

## 4. Coverage summary (fill at gate)

- Total REQs: <n>  ·  Total SNs: <n>
- REQs with a parent SN: <n> / <n>  → **orphan REQs must be zero**
- SNs with ≥1 covering REQ: <n> / <n>  → **uncovered SNs must be zero**
- REQs with a seeded method + `TC-VER-TBD`: <n> / <n>
- Bidirectional traceability required? <Yes (safety-critical/regulated) / No>

> **TODO:** resolve all `TC-VER-TBD` placeholders in Phase 07; re-baseline via `CR-<nn>` thereafter.
