---
Document: Hazard Log — <PROJECT NAME>
Document ID: HAZ-<PROJECT_SLUG>-v0.1
Standard: IEC 61508 (+ domain: DO-178C / ISO 26262 / IEC 62304 as applicable)
Status: Draft
Owner: <Safety / RAMS Lead>
---

# Hazard Log

> The continuously-maintained safety register — the safety equivalent of the Risk Register. Hazards (`HAZ-*`) are found, scored, mitigated by a `REQ-SAF-*`, and traced **forward** (`HAZ→REQ-SAF→TC-VER`) and **backward** (mandatory for DO-178C / ISO 26262 / IEC 62304, Conventions §8) from concept to disposal. Reliability / availability / maintainability are **allocated as requirements**, not hoped for.
>
> **Activate this thread in full** when the system is **safety-critical** (a failure can injure, kill, or cause environmental/major property damage) **or regulated** under a functional-safety regime. Otherwise tailor down to a reliability/availability allocation plus a lightweight hazard checklist — and **record the tailoring** ("tailored out: not safety-critical, no regulatory regime"), never drop it silently.
>
> Conventions: `HAZ-*`/`REQ-SAF-*` IDs §2.1, §2.4 · severity & 5×5 scoring §5 · satisfy-vs-verify §7 · bidirectional traceability §8 · folder layout §10. Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. Tailoring & applicability

| Field | Value |
|---|---|
| Safety-critical? (can a failure hurt someone?) | `<Yes / No>` |
| Regulated regime(s) | `<DO-178C / ISO 26262 / IEC 62304 / IEC 61508 / none — TODO confirm>` |
| Who certifies / assesses | `<regulator / independent assessor — TODO>` |
| Integrity-level scheme | `<SIL 1–4 / DAL A–E / ASIL A–D / class A-B-C — regulator-set, do not invent>` |
| Tailoring decision (if not full) | `<"tailored out: …" — TODO>` |

> **Never invent the integrity level** (SIL/DAL/ASIL/class). It is domain- and regulator-set: route to research / regulator confirmation and mark `TODO: confirm integrity level`.

---

## 2. Hazard log

> Each row: the unsafe **state** (not the cause alone), its cause(s) (links FMEA/FTA), worst-credible harm, pre-mitigation `Severity × Likelihood` band (Conventions §5.3), the mitigating `REQ-SAF-*`, the verifying `TC-VER-*` (method T/I/A/D), and residual band + status.

| `HAZ-<nn>` | Hazard / hazardous event | Cause(s) (FMEA/FTA) | Effect / harm (worst credible) | Sev (S1–S4) | L (1–5) | Pre-mit band | Integrity level | Mitigation → `REQ-SAF-*` | Verification → `TC-VER-*` (T/I/A/D) | Residual band | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HAZ-01 | _(example — delete)_ `<unsafe state, e.g. uncommanded actuation>` | `<failure mode(s)>` | `<harm>` | `<S1>` | `<4>` | `<Critical>` | `<TODO confirm>` | `REQ-SAF-01` | `TC-VER-01` (T) | `<Low>` | Open |
| HAZ-02 | `<TODO>` | `<TODO>` | `<TODO>` | | | | `<TODO>` | REQ-SAF-TBD | TC-VER-TBD | | Open |
| HAZ-`<nn>` | … | | | | | | | | | | |

*Status values:* `Open` · `Mitigated` · `Verified` · `Closed` · `Accepted-by <name/role>` (residual risk accepted explicitly, by name).

---

## 3. Reliability / Availability / Maintainability (RAM) allocation

> Set a top **availability** target, then allocate **MTBF** (reliability) and **MTTR** (maintainability) budgets across blocks so `A = MTBF / (MTBF + MTTR)` meets it. Each allocation becomes a `REQ-P-*` / `REQ-O-*` with a MOP and — if gate-critical — a TPM tracked 06→10. Allocating availability **without** maintainability is a common failure: a high-MTBF design with a 3-day MTTR can still miss the target.

| Top-level availability target | `<e.g. 99.9% — TODO>` | Configuration | `<series / parallel / redundant — TODO>` |
|---|---|---|---|

| Block | MTBF budget | MTTR budget | Computed A = MTBF/(MTBF+MTTR) | Requirement | MOP / TPM |
|---|---|---|---|---|---|
| `<block>` | `<value + unit>` | `<value + unit>` | `<%>` | `REQ-O-<nn>` | `MOP-<nn>` / `TPM-<nn>` |
| `<TODO>` | | | | REQ-O-TBD | `<TODO>` |

---

## 4. Hazard-analysis worksheets (FMEA / FTA references)

> Use **both**: FTA (top-down: undesired top event → AND/OR gates → minimal cut sets, finds common-cause) **and** FMEA (bottom-up: component failure mode → local → system effect, finds single-point coverage gaps). FMEA alone misses multi-failure cut sets; FTA alone misses single-point coverage.

| Analysis | Type | Covers `HAZ-*` | Worksheet location | Key finding (cut set / SPOF) |
|---|---|---|---|---|
| `<FTA-01>` | FTA (top-down) | `<HAZ-nn>` | `<path/FTA_<haz>.md — TODO>` | `<minimal cut set / common-cause path>` |
| `<FMEA-01>` | FMEA (bottom-up) | `<HAZ-nn>` | `<path/FMEA_<comp>.md — TODO>` | `<single point of failure>` |

---

## 5. Bidirectional traceability check (`HAZ → REQ-SAF → TC-VER`)

> **Forward and backward** traceability is mandatory for DO-178C / ISO 26262 / IEC 62304 (Conventions §8). A design *claiming* to mitigate a hazard is a `satisfy` **assertion**, not proof — every `REQ-SAF-*` needs a `TC-VER-*` (`verify`). Backward direction is what proves no hazard was forgotten.

| `HAZ-<nn>` | →derive→ `REQ-SAF-<nn>` | →satisfy→ design block | →verify→ `TC-VER-<nn>` | Backward complete? |
|---|---|---|---|---|
| `<HAZ-nn>` | `<REQ-SAF-nn>` | `<block>` | `<TC-VER-nn>` | `<Y/N — TODO>` |

---

## 6. FRACAS — field feedback (Stage 10)

> Failure Reporting, Analysis & Corrective Action System: field failures feed back, update λ/MTBF/MTTR vs allocation, and **reopen hazards** on new failure modes. Without a closed loop the log goes stale and the safety case decays.

| FRACAS ID | Field failure / near-miss | Reopens `HAZ-*`? | Updated λ/MTBF/MTTR | Corrective action → `CR-*` | Status |
|---|---|---|---|---|---|
| `<FR-01>` | `<TODO>` | `<HAZ-nn / none>` | `<TODO>` | `CR-<nn>` | Open |

---

## 7. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<FHA at Concept · PHA/SHA at Architecture · safety-case roll-up at Verification; cite CR-nn for any change to a baselined hazard>`
- `TODO:` `<the Safety Case (claim→argument→evidence) lands in Phase_07_Verification/ and is accepted at PRR>`

---

### References
- `05_Conventions.md` — §2.1 (`SAF`/`P`/`O` classes), §2.4 (`HAZ-<nn>`), §5 (severity & 5×5), §7 (satisfy vs verify), §8 (bidirectional traceability), §9 (citations), §10 (folder layout).
- `cross-cutting/Safety_RAMS_Engineering.md` — owning thread (FHA→PHA/SHA, RAM allocation, FRACAS, safety case, gate questions).
- Sibling threads: `Risk_and_Opportunity_Management.md` (a `HAZ-*` may spawn a `RSK-*`), `Security_Engineering.md` (`THR-*` ≠ `HAZ-*`).
- Standards: **IEC 61508**, **DO-178C**, **ISO 26262**, **IEC 62304**, **ISO/IEC/IEEE 15288:2023**, **IEEE 1012-2016**, FMEA/FTA.
