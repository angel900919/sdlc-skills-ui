---
Document: Verification Matrix — <PROJECT NAME>
Document ID: VM-<PROJECT_SLUG>-v0.1
Standard: IEEE 1012-2016
Status: Draft            # Draft → In Review → Baseline (TRR-approved YYYY-MM-DD) → Superseded by vX.Y
Owner: Verification Lead
---

# Verification Matrix — <PROJECT NAME>

> **Verification asks:** "Did we build the system **right**?" — i.e., does it conform to the SysRS spec?
> **Necessary but not sufficient:** a 100%-covered verification matrix proves the spec is *covered* — **not** that the spec was *right* (that is Phase 08 Validation) and **not** that every test has *passed*. Coverage ≠ correctness ≠ validity.
> **Method legend:** `T` = Test · `I` = Inspection (includes structured Review) · `A` = Analysis · `D` = Demonstration. See [`../05_Conventions.md`](../05_Conventions.md) §4. Phase 07 is **authoritative** for methods; Phase 02 only seeds.

<!-- HOW TO USE: Replace every <placeholder>. Resolve every TODO. Delete rows marked "(example — delete)". This matrix is EXACTLY 5 columns — do not add Status or Evidence columns (Status rolls up in §5; evidence lives under verification-evidence/). Name every tool — bare "Manual" is invalid; use "Manual + <named checklist>". Do not copy a worked example's REQ ids, tools, thresholds, or TC-VER numbers. -->

---

## 1. Per-Requirement Verification

> One row per `REQ-<class>-<nn>`, walked class-by-class (F · U · P · O · SEC · INT · C · D · SAF). Combinations allowed (`I + T`, `T + A`). Every REQ ends with at least one `TC-VER-<nn>` — no `TC-VER-TBD` may survive this phase.

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-F-01 | <abbrev measurable threshold> | T | TC-VER-01 — <short activity> | <named tool> |
| REQ-F-02 | <…> | T | TC-VER-02 — <…> | <named tool> |
| REQ-P-01 | <latency / throughput threshold> | T | TC-VER-NN — <load/timing test> | <named tool> |
| REQ-O-01 | <availability ≥ X% / MTBF / MTTR> | A | TC-VER-NN — <rolling SLA report> | <query/tool> |
| REQ-SEC-01 | <AES-256 / TLS 1.3 / signed firmware> | I + T | TC-VER-NN — inspect config + test enforcement | <tool> + <tool> |
| REQ-INT-01 | <protocol/port conformance> | T | TC-VER-NN — <conformance suite> | <named tool> |
| REQ-D-01 | <industry compliance / standard> | I | TC-VER-NN — <audit / SAQ inspection> | Manual + <named standard> |
| REQ-SAF-01 | <hazard-mitigating behaviour> | T + A | TC-VER-NN — <safety behaviour observed + analysis> | <named tool> + analysis |
| `REQ-F-04` | `<E-Stop ≤ 100 ms>` | T + A | `TC-VER-04 — scope on contactor coil` | `<Tektronix MSO + analysis>` *(example — delete)* |
| `REQ-O-02` | `<service availability ≥ 99.95%>` | A | `TC-VER-25 — uptime SLO report` | `<Prometheus query>` *(example — delete)* |

<!-- TODO: continue for EVERY REQ in the SysRS. 100% method coverage is mandatory before TRR. -->

---

## 2. Verification Levels (Unit → Integration → System)

> Place each TC on the ladder. Software-heavy classes (F, P, SEC, INT) span Unit→Integration→System; hardware REQs usually land at System with HIL. The **Acceptance** cell is the **verification → validation HINGE** — acceptance / UAT / FAT / SAT is a *validation* activity owned by **Phase 08**, not a verification method. Name the hinge here; do not execute or assign it a TC-VER.

| Class | Unit | Integration | System | Acceptance |
|---|---|---|---|---|
| F (Functional) | <TC-VER-NN…> | <TC-VER-NN…> | <TC-VER-NN…> | → Phase 08 (validation hinge) |
| P (Performance) | <…> | <…> | <…> | → Phase 08 (validation hinge) |
| SEC (Security) | <…> | <…> | <…> | → Phase 08 (validation hinge) |
| INT (Interface) | <…> | <…> | <…> | → Phase 08 (validation hinge) |
| O / SAF (HW-side) | n-a | <HIL> | <System + HIL> | → Phase 08 (validation hinge) |

---

## 3. Continuous Scans

> **Pointer, not a copy.** The SAST / DAST / dependency / secrets / IaC / conformance scan-and-tool table is owned by **Phase 06** ([`Phase_06_Integration/Integration_Plan.md`](../skills/se-phase-06-integration/SKILL.md)). State only each scan's verification **pass-criteria** here.

| Scan (from Phase 06 table) | Verification pass-criteria |
|---|---|
| Static analysis / SAST | <e.g. zero critical findings> |
| SCA / supply-chain (SBOM) | <zero critical CVEs; SBOM emitted> |
| DAST / secrets / IaC | <zero high findings — TODO confirm threshold> |
| Conformance (<named suite>) | <no regression vs baseline> |

---

## 4. Reviews & Inspections

> Gate rows this phase touches. Use the canonical gate names from [`../05_Conventions.md`](../05_Conventions.md) §3 — do **not** restate the pass-criteria text; cite §3. Pull dates from the project schedule; mark unknowns `TODO`.

| Gate | Owning phase | Scheduled date | Status |
|---|---|---|---|
| SRR | 02 | <YYYY-MM-DD / TODO> | <done / pending> |
| PDR | 04 | <YYYY-MM-DD / TODO> | <done / pending> |
| CDR | 06 | <YYYY-MM-DD / TODO> | <done / pending> |
| **TRR** | 07 | <YYYY-MM-DD / TODO> | <this phase's exit gate> |
| PRR | 08 | <YYYY-MM-DD / TODO> | <pending> |

---

## 5. Coverage Summary

> This rollup is what the TRR checks. The two zero-must-pass rows are stop-the-line conditions.

| Metric | Count |
|---|---|
| Total REQs | <n> |
| Verified by **T** | <n> |
| Verified by **I** | <n> |
| Verified by **A** | <n> |
| Verified by **D** | <n> |
| REQs with **no method** | **0** (must be 0 — else TRR fails) |
| REQs with **no TC-VER** | **0** (must be 0 — no `TC-VER-TBD` survives) |
| REQs whose tool is `TODO` | <n> (allowed but flagged) |

---

## 6. Evidence Archive

> One convention. Evidence lives under the fixed folder **`verification-evidence/`** — do **not** create an `evidence/` tree or add an evidence column to §1.

```
Phase_07_Verification/
├── Verification_Matrix.md
├── VnV_Plan.md
└── verification-evidence/
    ├── TC-VER-01/   ├─ <capture / log / report files>   └─ result.md
    ├── TC-VER-02/   └─ ...
```

Each `verification-evidence/TC-VER-<nn>/result.md` is a 1-pager: setup · observation · measured value vs threshold · pass/fail · evidence-file list · executor sign-off.

---

## 7. TRR Readiness

> Clear **TRR (Test Readiness Review)** only when the full exit-gate checklist in the Phase 07 SKILL passes. Summary below; record the gate decision.

- [ ] **100%** of REQs have a finalised T/I/A/D method (zero unassigned).
- [ ] **100%** of REQs have ≥ 1 `TC-VER-<nn>` (zero `TC-VER-TBD`).
- [ ] Every method justified against verifiability; Phase-02 seed overrides noted.
- [ ] Every tool named (no bare "Manual"); unknowns flagged `TODO`.
- [ ] `VnV_Plan.md` exists; integrity level set; IV&V decision recorded.
- [ ] Test environment + data ready (per Phase 06 CI/CD + HIL); tool dry-run done.
- [ ] Continuous scans configured and passing their stated criteria.
- [ ] `verification-evidence/` structure created; per-TC `result.md` stubbed.
- [ ] Acceptance / UAT / FAT / SAT explicitly deferred to Phase 08.
- [ ] Necessary-but-not-sufficient caveat stated.

**Gate decision:** <Proceed / Proceed-with-actions / Hold / Re-baseline / Stop> — <TODO: chair + date>

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs (§2), gates incl. TRR (§3), **T/I/A/D (§4)**, severity (§5), citations (§9). **The contract.**
- [`../skills/se-phase-07-verification/SKILL.md`](../skills/se-phase-07-verification/SKILL.md) — full method, method-choice cheatsheet, exit-gate checklist.
- Companion deliverable: [`VnV_Plan.md`](VnV_Plan.md) (IEEE 1012-2016 integrity-level-driven V&V plan).
- Inputs: `Phase_02_Requirements/SysRS.md` + `Traceability_Matrix.md` (seeded methods) · `Phase_06_Integration/Integration_Plan.md` (executors, scan table) · `Phase_04_Architecture/ICD.md` · `Phase_03_Modeling/Requirements_Diagram.puml`.
