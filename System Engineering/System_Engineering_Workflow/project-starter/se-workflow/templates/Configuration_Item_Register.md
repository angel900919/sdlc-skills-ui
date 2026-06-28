---
Document: Configuration Item Register & CSA Ledger — <PROJECT NAME>
Document ID: CIR-<PROJECT_SLUG>-v0.1
Standard: ISO 10007:2017 (+ IEEE 828; EIA-649)
Status: Draft
Owner: <Configuration Manager / CCB Chair>
---

# Configuration Item Register & Status-Accounting Ledger

> The continuously-updated record that lets you say, at any moment, exactly *what the system is*, *which version is current*, and *that the as-built matches the as-documented*. It operates the **identification** and **status-accounting** halves of the four CM functions (ISO 10007:2017 / EIA-649); the CM **plan** (control rules, FCA/PCA procedure) lives in `Configuration_Management_Plan.md` and the change-control loop in `Change_Management_Plan.md` — this register **points to** them, it does not duplicate them.
>
> **CM is not change control.** Change control decides *whether* an item changes (the `CR-*` / CCB loop). CM **knows** *what* the item is, *which baseline* holds it, and *what version* it became. A `Baseline (...)`-status CI changes **only** through a `CR-<nn>`.
>
> Conventions: `CI-<nn>`/`CR-<nn>` IDs §2.3–2.4 · the three baselines §3 · status strings & semver rule §6 · folder layout §10. Cross-cutting registers (Risk, TPM, QA, Threat Model, Cost/Schedule) are themselves CIs. Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. The four CM functions (where each lives)

| # | CM function | Question | Where operated |
|---|---|---|---|
| 1 | **Configuration Identification** | *What* is under control? | **This register (§3)** |
| 2 | **Configuration Control** | *How* does a CI change? | `Change_Management_Plan.md` (`CR-*`/CCB) — baselines set here at §4 |
| 3 | **Configuration Status Accounting (CSA)** | *What state* is everything in now? | **This ledger (§5)** |
| 4 | **Configuration Audits (FCA / PCA)** | *Does reality match the record?* | **§6 (planned & run at PRR)**; procedure in `Configuration_Management_Plan.md` |

**Version grammar** (§6): documents carry `vMAJOR.MINOR` (minor = tracked edit, major = re-baseline); the build/config recipe carries **semver `MAJOR.MINOR.PATCH`** (breaking / feature / fix). *Never key the version bump to a change class A/B/C/D — class is a routing label only.*
**Status strings** (§6): `Draft` → `In Review` → `Baseline (<GATE>-approved YYYY-MM-DD)` → `Superseded`.

---

## 2. CM authority & repository (set at Stage 00)

| Field | Value |
|---|---|
| Configuration Manager | `<name/role — TODO>` |
| CCB chair | `<name/role — TODO>` |
| Repository / VCS tool | `<Git+tags / GitLab / Polarion / DOORS / Windchill … — TODO>` |
| `CI-*` / `CR-*` ID series | `CI-01…`, `CR-01…` |
| Immutable-export location (if regulated) | `<TODO>` |

---

## 3. CI register (Function 1 — Identification)

> *Heuristic:* if losing track of its version would cause a defect, an integration break, or an audit finding, it is a CI. Every `Baseline (...)`-status artifact **must** be in this register — reconcile register against baselines at each gate. Placeholders use `…-TBD`, never a blank cell.

| `CI-<nn>` | Item name | Type | Owner | Controlling baseline | Version (`vX.Y` / semver) | Status |
|---|---|---|---|---|---|---|
| CI-01 | _(example — delete)_ SysRS | doc | `<role>` | Functional | `v1.0` | `Baseline (SRR-approved 2026-06-15)` |
| CI-02 | `<ICD>` | doc | `<role>` | Product | `v0.3` | In Review |
| CI-03 | `<build/config recipe>` | sw build | `<role>` | Product | `2.1.0` | Draft |
| CI-`<nn>` | `<TODO>` | `<doc / sw build / hw assembly / model / dataset>` | `<role>` | `<Functional / Allocated / Product>` | `<vX.Y / semver>` | `<status>` |

*Type values:* `doc` · `sw build` · `hw assembly` · `model` · `dataset`.

---

## 4. Baselines (Function 2 — Control)

> Established at their gates and **frozen** thereafter; changes only via a `CR-<nn>` (Stage 09). Record which CIs roll up into each baseline.

| Baseline | Established at | Status / date | Member CIs |
|---|---|---|---|
| **Functional / Requirements** | SRR | `<Baseline (SRR-approved <date>) / TODO>` | `<CI-01, … — SysRS, Traceability_Matrix, MOE/MOP set>` |
| **Allocated** | PDR | `<TODO>` | `<Architecture_Description, ICD (draft), Tech_Stack_Rationale, req-to-block allocation>` |
| **Product** | CDR | `<TODO>` | `<frozen ICDs, detailed design, build/config recipe (semver)>` |

---

## 5. CSA ledger (Function 3 — Status Accounting)

> The report that answers "which version is current, and what changed since the last gate?" Publish on a defined cadence with a named owner. **Highlight any CI whose version moved without a linked `CR-*`** — possible silent baseline drift.

| `CI-<nn>` | Current version | Controlling baseline | Open `CR-*` | `CR-*` closed since last gate | Status string | Drift? (version moved w/o `CR-*`) |
|---|---|---|---|---|---|---|
| CI-01 | _(example — delete)_ `v1.0` | Functional | — | `CR-04` | `Baseline (SRR-approved 2026-06-15)` | No |
| CI-`<nn>` | `<vX.Y / semver>` | `<baseline>` | `<CR-nn / none>` | `<CR-nn / none>` | `<status>` | `<Yes/No — flag at gate>` |

**CSA publication cadence:** `<e.g. per-gate + monthly — TODO>` · **Owner:** `<role>`

---

## 6. Configuration audits — FCA & PCA at PRR (Function 4)

> Two audits at **PRR**. Each discrepancy becomes a `CR-<nn>`. (Distinct from QA's process-compliance audit — FCA/PCA audit *configuration consistency*, not *process*.)

| Audit | Question | Entry criteria | Owner | Date | Discrepancies → `CR-<nn>` | Result |
|---|---|---|---|---|---|---|
| **FCA** (Functional) | Does *achieved* performance meet the requirements baseline? (every `REQ-*` has closed V&V evidence) — *built it to spec?* | `<V&V evidence under control — TODO>` | `<role>` | `<date>` | `<CR-nn / none>` | `<Pass/Fail>` |
| **PCA** (Physical) | Does *as-built* match the product-baseline docs (build recipe, ICDs, BOM, design)? — *as-built = as-documented?* | `<product baseline frozen — TODO>` | `<role>` | `<date>` | `<CR-nn / none>` | `<Pass/Fail>` |

---

## 7. Per-gate CM check

| Gate | Date | Baseline set / current? | CSA ledger current? | Any baseline changed outside a `CR-*`? | Every baselined artifact in the register? | Notes |
|---|---|---|---|---|---|---|
| ATP (00) | `<date>` | CM authority + repo + series set? | n/a | n/a | n/a | `<example — delete>` |
| SRR (02) | | Functional baseline set | `<Y/N>` | `<Y/N>` | `<Y/N>` | |
| PDR (04) | | Allocated baseline set | | | | |
| CDR (06) | | Product baseline set (**ICDs frozen, semver**) | | | | |
| TRR (07) | | V&V evidence version-pinned (FCA inputs)? | | | | |
| PRR (08) | | **FCA + PCA done** | | | | `<each discrepancy → CR-nn>` |
| ORR / GA (10) | | Deployed config = released baseline (no drift)? | | | | |
| DRR (11) | | As-disposed config captured & archived? | | | | |

---

## 8. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<new CIs identified; baseline set/updated at SRR/PDR/CDR; cite CR-nn for every version move>`
- `TODO:` `<this register points to Change_Management_Plan.md for the change-control steps and Configuration_Management_Plan.md for the FCA/PCA procedure — do not duplicate them>`

---

### References
- `05_Conventions.md` — **the contract**: `CI-*`/`CR-*` IDs (§2.3–2.4), gates & the three baselines (§3), status strings & semver rule (§6), canonical CM citations (§9), folder layout (§10).
- `cross-cutting/Configuration_Management.md` — owning thread (the four CM functions, baselines, CSA, FCA/PCA, CM≠change-control).
- `skills/se-phase-09-change-config/SKILL.md` — **operates** this thread and the distinct change-control loop.
- Sibling thread: `Quality_Assurance.md` (FCA/PCA audit *configuration*; QA audits *process* — keep distinct).
- Standards: **ISO 10007:2017**, **IEEE 828**, **EIA-649**, **ISO/IEC/IEEE 15288:2023**, **ISO 9001:2015** (FCA/PCA basis).
