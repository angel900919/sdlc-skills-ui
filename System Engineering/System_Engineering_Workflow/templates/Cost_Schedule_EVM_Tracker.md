---
Document: Cost, Schedule & EVM Tracker — <PROJECT NAME>
Document ID: CST-<PROJECT_SLUG>-v0.1
Standard: ANSI/EIA-748; ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: <Cost / Schedule Lead>
---

# Cost, Schedule & EVM Tracker

> The WBS + critical-path schedule + lifecycle-cost model + Earned-Value time-series that keeps the project **on budget and on time** — refreshed at the end of every stage, presented as evidence at every gate.
>
> This thread does **not** invent cost figures: it **consumes** the TCO/NPV from the Phase 05 trade studies and the COCOMO software-effort estimate, rolls them into the WBS budget, and then **tracks variance**. EVM (BCWS/BCWP/ACWP → CPI/SPI) is the early-warning system — a CPI of 0.85 at 30% complete predicts the overrun while there is still time to act.
> The **Performance Measurement Baseline (PMB) is proposed at PDR and frozen at CDR** with the product baseline; it changes thereafter only via a `CR-<nn>` (Stage 09).
>
> Conventions: project IDs §2 · gates & baselines §3 · frontmatter §6 (`Document ID: CST-…`, `Standard: ANSI/EIA-748; ISO/IEC/IEEE 15288:2023`) · folder layout §10. **EVM (EIA-748) is OUTSIDE the course KB** (industry practice). Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. Funding envelope & local IDs

| Field | Value |
|---|---|
| Funding envelope / BAC ceiling | `<currency + amount — recorded as a REQ-C-* constraint>` |
| Contract type | `<fixed-price / cost-plus — cost-risk note>` |
| Milestone-payment frame | `<TODO>` |
| Discount rate (for NPV/DCF) | `<r% — TODO>` |

**Local IDs** (reuse §2 grammar — uppercase, zero-padded, stable for life; placeholders use `…-TBD`):

| Artifact | ID form | Notes |
|---|---|---|
| WBS element / work package | `WBS-<n.n.n>` | hierarchical decimal; lowest level = the work package that earns value |
| Control account | `CA-<nn>` | where scope, budget, schedule & an owner meet — the unit EVM is measured at |
| Schedule milestone | `MS-<nn>` | maps each gate (ATP…DRR) to a dated milestone; 0%-or-100% (no partial credit) |

---

## 2. EVM vocabulary (EIA-748)

| Term | Symbol | Plain meaning |
|---|---|---|
| Budgeted Cost of Work **Scheduled** | **BCWS** (PV) | What you *planned* to have spent by now (the baseline S-curve). |
| Budgeted Cost of Work **Performed** | **BCWP** (EV) | Budgeted value of what you've *actually finished* — "earned value." |
| Actual Cost of Work Performed | **ACWP** (AC) | What you've *actually spent*. |
| Budget At Completion | **BAC** | Total budget for the baselined scope. |
| Cost Performance Index | **CPI = BCWP/ACWP** | < 1 = over budget. |
| Schedule Performance Index | **SPI = BCWP/BCWS** | < 1 = behind schedule. |
| Estimate At Completion | **EAC = BAC/CPI** | Forecast total cost at current efficiency. |
| Variance At Completion | **VAC = BAC − EAC** | Forecast over/under-run. |

---

## 3. Work Breakdown Structure (WBS) + budget

> Deliverable-oriented (what, not who or when). The **100% rule**: children of any node sum to exactly the parent — no scope missing, none double-counted. Reuse the seven cost types (development, deployment, operational, maintenance, training, decommissioning, opportunity) so V&V, integration, training, and decommissioning are not forgotten. Cite the source of each estimate (`DM-<nn>`/`DEC-<nn>` TCO or `COCOMO_Estimate.md`).

| `WBS-<n.n.n>` | Element / work package | Control account (`CA-<nn>`) | Owner | Budget | Basis-of-estimate (source `DM-<nn>` / COCOMO / analogy) | 100% rule checked? |
|---|---|---|---|---|---|---|
| WBS-1 | _(example — delete)_ `<system>` | — | `<PM>` | `<roll-up>` | — | `<Σ children = parent>` |
| WBS-1.1 | `<sub-deliverable>` | `CA-01` | `<role>` | `<amount>` | `<DM-03 TCO>` | `<Y>` |
| WBS-`<n.n.n>` | `<TODO>` | `CA-TBD` | `<role>` | `<amount>` | `<TODO — no unsourced estimate>` | `<Y/N>` |
| | **Roll-up BAC** | | | `<Σ = BAC>` | | |

---

## 4. Schedule & critical path

> Sequence work packages by dependency, estimate durations, compute the **critical path** (longest dependent chain → float = 0). Map each gate to an `MS-<nn>`. Near-critical (low-float) paths are schedule risks → feed the Risk thread.

| `MS-<nn>` | Milestone / gate | Planned date | Predecessors | Duration | Float / slack | On critical path? |
|---|---|---|---|---|---|---|
| MS-01 | _(example — delete)_ ATP | `<date>` | — | — | — | — |
| MS-02 | SRR | `<date>` | `<WBS-…>` | `<dur>` | `<0 / n days>` | `<Y/N>` |
| MS-`<nn>` | `<… DRR>` | `<date>` | `<TODO>` | | | |

---

## 5. Lifecycle Cost (LCC / TCO) model

> Sum the seven cost types across the life; discount multi-year flows with **NPV/DCF**. This is the figure the business case is judged on, refreshed each stage. Use TCO/NPV (not ROI) for a cost-only comparison.

| Cost type | Year 0 (CapEx) | Years 1–n (OpEx / annual) | Decommission | Notes |
|---|---|---|---|---|
| Development | `<amount>` | | | `<example — delete>` |
| Deployment | | | | |
| Operational | | `<annual>` | | |
| Maintenance | | `<annual>` | | |
| Training | | | | |
| Decommissioning | | | `<amount>` | |
| Opportunity | | | | |
| **LCC / TCO (NPV @ r%)** | | | | `<total — feeds the business case>` |

---

## 6. EVM time-series (per stage-end)

> Record BCWP and ACWP, compute CPI/SPI, forecast EAC/VAC. Flag any control account with CPI or SPI < 0.9, write a variance explanation + corrective action, and raise a `RSK-<nn>` if recovery is uncertain. **Do not** forecast EAC = BAC when CPI < 1 — CPI stabilises early; `EAC = BAC/CPI` is the honest forecast.

| Stage / Gate | Date | BCWS (PV) | BCWP (EV) | ACWP (AC) | CPI | SPI | EAC = BAC/CPI | VAC = BAC−EAC | Below-threshold CA(s) (CPI/SPI < 0.9) | Variance note / corrective action |
|---|---|---|---|---|---|---|---|---|---|---|
| PDR (04) | `<date>` | `<PMB proposed>` | | | | | | | | `<example — delete>` |
| CDR (06) | | `<PMB FROZEN>` | `<EV>` | `<AC>` | `<>` | `<>` | `<>` | `<>` | `<CA-nn>` | `<TODO>` |
| TRR (07) | | | | | | | | | | |
| PRR (08) | | | | | | | | | | |
| ORR / GA (10) | | `<shift to OpEx/run-cost>` | | | | | | | | |
| DRR (11) | | `<decommission line realised>` | | | | | | | | `<final cost-at-completion as lessons-learned>` |

---

## 7. Change re-plan log (PMB integrity)

> Every `CR-<nn>` carries a cost-and-schedule impact; approved changes **re-plan the PMB** and update EAC. A baseline changed **without** an approved cost impact → **Hold** (baseline integrity broken).

| `CR-<nn>` | Affected `WBS-*` / `CA-*` | Cost Δ | Schedule Δ | New PMB time-phasing? | New EAC | Approved? |
|---|---|---|---|---|---|---|
| `<CR-nn>` | `<WBS-… / CA-…>` | `<±amount>` | `<±days>` | `<Y/N>` | `<amount>` | `<Y/N>` |

---

## 8. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<PMB proposed at PDR, frozen at CDR; cite CR-nn for every re-plan>`
- `TODO:` `<triangulate every estimate (analogy + parametric + bottom-up); never carry a COCOMO point value into the WBS as if measured>`

---

### References
- `05_Conventions.md` — §2 (IDs), §3 (gates & baselines — PMB frozen at CDR with the product baseline), §6 (frontmatter/versioning), §9 (citations), §10 (folder layout).
- `cross-cutting/Cost_Schedule_EVM.md` — owning thread (WBS 100% rule, critical path, LCC/TCO/NPV, EVM, re-plan loop, gate questions).
- `skills/se-phase-05-tradeoff/SKILL.md` — source of the TCO/NPV and COCOMO numbers this thread consumes.
- `skills/se-phase-09-change-config/SKILL.md` — receives the change cost-impact; owns PMB re-planning via `CR-<nn>`.
- Sibling threads: `Risk_and_Opportunity_Management.md` (schedule risks; uncertain recovery → `RSK-*`), `Measurement_MOE_MOP_TPM.md` (cost-as-a-MOP; keep TPM technical-margin distinct from CPI/SPI).
- Standards: **ANSI/EIA-748** (EVM — *outside the course KB*), **ISO/IEC/IEEE 15288:2023** (Project Planning; Assessment & Control), **INCOSE SE Handbook v5 (2023)**, **NASA/SP-2016-6105 Rev 2**.
