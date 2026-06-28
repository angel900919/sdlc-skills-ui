---
Document: TPM Tracker (MOE / MOP / TPM) — <PROJECT NAME>
Document ID: TPM-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Measurement process); INCOSE SE Handbook v5 (2023); NASA/SP-2016-6105 Rev 2
Status: Draft
Owner: <Measurement Lead / Perf Lead>
---

# TPM Tracker — MOEs, MOPs & TPMs

> The one place MOEs, MOPs, TPMs, their planned profiles, current values, and margins live — so "are we still on course to succeed?" is answerable with **numbers, not adjectives**.
>
> Chain (Conventions §2.2, §8): `SN → MOE` (effectiveness of the need) and `SN → derive → REQ → MOP` (performance of the spec); **selected critical MOPs are promoted to TPMs**. Keep the sets **small** — a measure for everything is a metric for nothing.
> The **MOE/MOP set baselines at SRR**; **TPM planned profiles baseline at PDR** (allocated baseline); changes thereafter only via a `CR-<nn>` (Stage 09).
>
> Conventions: `MOE`/`MOP`/`TPM` IDs §2.2 · gates & baselines §3 · T/I/A/D (a TPM ⇒ method **T**) §4 · frontmatter §6 · traceability spine §8 · folder layout §10. Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. Measures of Effectiveness (`MOE-*`) — problem space

> "Does the system let the **stakeholder** succeed in the mission?" — **solution-independent**, derived from `SN-<nn>`. Write MOEs *before any architecture exists*. "CPU < 60%" is a MOP masquerading as an MOE; the MOE is the *mission* outcome ("operator completes task in ≤ 3 min"). MOEs are the **acceptance/validation** bar (Stage 08).

| `MOE-<nn>` | Name | Traces to `SN-<nn>` | Target range (unit + condition) | Covered by MOP(s) | Validation `TC-VAL-<nn>` |
|---|---|---|---|---|---|
| MOE-01 | _(example — delete)_ `<mission outcome>` | `SN-01` | `<operator completes task ≤ 3 min>` | `MOP-01`, `MOP-04` | `TC-VAL-01` |
| MOE-`<nn>` | `<TODO>` | `SN-<nn>` | `<TODO — no design baked in>` | `<MOP-…>` | TC-VAL-TBD |

---

## 2. Measures of Performance (`MOP-*`) — solution space

> "Does the **system** exhibit the performance the design must deliver?" — derived from `REQ-<nn>`. Every MOP traces to a requirement and rolls up to ≥1 MOE. No measure without a parent need/requirement.

| `MOP-<nn>` | Name | Traces to `REQ-<nn>` | Rolls up to `MOE-<nn>` | Threshold (unit + condition) | Promoted to TPM? |
|---|---|---|---|---|---|
| MOP-01 | _(example — delete)_ `<p95 latency>` | `REQ-P-04` | `MOE-01` | `<≤ 200 ms p95 over 24 h @ 500 rps>` | `TPM-01` |
| MOP-`<nn>` | `<TODO>` | `REQ-<nn>` | `MOE-<nn>` | `<TODO — SMART, no adjectives>` | `<TPM-nn / no>` |

---

## 3. Technical Performance Measures (`TPM-*`) — margin-tracked

> A MOP becomes a TPM only if it is **critical** to an MOE/mission, **at risk** (uncertain/contested/historically hard), and **trackable early**. Aim for a handful, not dozens.
> *Threshold* = must-not-cross (verification limit). *Target* = planned final (better than threshold — never set target = threshold, that leaves zero margin by design). *Planned profile* = the value expected **at each milestone**; add a **tolerance band**. Avoid hockey-stick profiles (flat then a miracle jump at the last milestone).
> `Margin = (threshold − current) / threshold` (signed so **positive = good**). Margin is a **managed budget**: name an owner and a rule for who may spend reserve.

| `TPM-<nn>` | Name | Traces to (`MOP←REQ←SN←MOE`) | Threshold (must-not-cross) | Target (planned final) | Planned profile (PDR · CDR · TRR · PRR) | Tolerance band | Current value (source / date) | Margin (signed, %) | Status / trend | Owner |
|---|---|---|---|---|---|---|---|---|---|---|
| TPM-01 | _(example — delete)_ `<charge-session p95 latency>` | `MOP-01 ← REQ-P-04 ← SN-05 ← MOE-01` | `≤ 200 ms` | `≤ 120 ms` | `400 · 250 · 160 · 120` | `± 20 ms` | `178 ms (TC-VER-12, 2026-06-20)` | `+22 ms (11%)` | 🟡 within tol, improving | Perf lead |
| TPM-`<nn>` | `<TODO>` | `<MOP-nn ← REQ-nn ← SN-nn ← MOE-nn>` | `<TODO>` | `<TODO>` | `<… · … · … · …>` | `<±…>` | `<TODO — cite evidence>` | `<TODO>` | 🟢/🟡/🔴 `<trend>` | `<role>` |

---

## 4. Margin policy

| Field | Value |
|---|---|
| Margin formula | `Margin = (threshold − current) / threshold` (positive = good) |
| Who may spend margin | `<role — TODO>` |
| Reserve-release rule (as uncertainty retires) | `<TODO>` |
| Breach response | TPM 🔴 below threshold ⇒ gate is **not Proceed** (Proceed-with-actions / Hold) |

---

## 5. Margin status per gate

> Report margin at each gate; feed margin deltas into Phase 05 trade matrices ("spends 30 ms of latency margin" is an explicit cost in `DM-<nn>`).

| Gate | Date | TPM | Planned profile point | Achieved-to-date | Within tolerance? | Margin | 🟢/🟡/🔴 | Recovery plan / owner |
|---|---|---|---|---|---|---|---|---|
| PDR (04) | `<date>` | `<TPM-nn>` | `<value>` | `<value/analysis>` | `<Y/N>` | `<±…>` | 🟡 | `<TODO>` |
| CDR (06) | | | | `<measured on INC-nn>` | | | | |
| TRR (07) | | | | `<from TC-VER-nn>` | | | | `<any TPM < threshold ⇒ not Proceed>` |
| PRR (08) | | | | `<MOE verdict from TC-VAL-nn>` | | | | `<met spec but unmet MOE = validation failure>` |
| ORR / GA (10) | | | | `<live SLO-nn>` | | | | |

---

## 6. Measure → SLO handoff (Stage 10)

> MOEs/MOPs become live **SLOs** in operations; an in-service breach opens a `CR-<nn>`.

| `MOE-*` / `MOP-*` | Becomes `SLO-<nn>` | Live threshold | Alert + CR path |
|---|---|---|---|
| `<MOP-nn>` | `SLO-<nn>` | `<TODO>` | `<TODO>` |

---

## 7. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<MOE/MOP set baselined at SRR; TPM profiles baselined at PDR; cite CR-nn for any post-baseline change>`
- `TODO:` `<flag every unknown benchmark as "TODO: research benchmark" — never invent a number>`

---

### References
- `05_Conventions.md` — §2.2 (MOE/MOP/TPM grammar), §3 (gates & baselines), §4 (T/I/A/D — TPM ⇒ T), §6 (status/versioning), §8 (traceability spine), §9 (citations), §10 (folder layout — `_cross_cutting/TPM_Tracker.md`).
- `cross-cutting/Measurement_MOE_MOP_TPM.md` — owning thread (derive-don't-invent, promotion criteria, margin policy, gate questions).
- Sibling threads: `Risk_and_Opportunity_Management.md` (a slipping TPM → `RSK-*`), `Cost_Schedule_EVM.md` (keep TPM technical-margin distinct from CPI/SPI cost/schedule).
- Standards: **ISO/IEC/IEEE 15288:2023** (Measurement process), **INCOSE SE Handbook v5 (2023)**, **NASA/SP-2016-6105 Rev 2**, **ISO/IEC/IEEE 29148:2018**.
