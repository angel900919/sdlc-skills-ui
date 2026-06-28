# Cost, Schedule & Earned Value Management — cross-cutting thread

> The thread that keeps the project **on budget and on time** — a Work Breakdown Structure, a critical-path schedule, a lifecycle-cost model, and Earned Value (BCWS/BCWP/ACWP → CPI/SPI) — refreshed at the end of every stage and presented as evidence at every gate.

**Why first-class.** "Built it right and the right thing" is necessary but not sufficient — a system delivered 40% over budget or a year late can still fail the business case. Cost and schedule are the two project-control variables every gate decision (Proceed · Hold · Re-baseline · Stop, per [`01_Workflow_Overview.md` §6](../01_Workflow_Overview.md)) trades against scope and risk. The audit (`00_Skills_Audit_Report.md` Part D) flagged that "COCOMO is the only cost element today and it's optional" — this thread promotes WBS, schedule/critical path, LCC/TCO, and EVM to a living discipline so cost/schedule is an **input to every gate** and to the Phase 09 change cost-impact, not an afterthought computed once.

---

## What it is & why it matters

Three intertwined questions, answered continuously rather than once:

- **How much will it cost — over the whole life?** Not just the build (CapEx) but operate, maintain, and retire (OpEx + decommissioning) — the **Lifecycle Cost (LCC)** / **Total Cost of Ownership (TCO)**. The KB's seven cost types (development, deployment, operational, maintenance, training, decommissioning, opportunity) and the LCA/TCO/NPV/CBA/ROI methods are the estimating toolkit (KB topic 12).
- **How long, and what drives the end date?** A **schedule** built from the WBS, with a **critical path** — the longest dependent chain whose slip slips the project. Float/slack on every other path tells you where you have room.
- **Are we tracking to the plan?** **Earned Value Management** fuses cost and schedule into one set of objective indices: are we getting a dollar of value for a dollar spent (CPI), and are we earning value as fast as we planned (SPI)? EVM is the early-warning system — a CPI of 0.85 at 30% complete predicts the overrun while there is still time to act.

The cost figures are not invented here: this thread **consumes** the TCO/NPV produced by the Phase 05 trade studies and the COCOMO software-effort estimate, rolls them into the WBS-based budget, and then **tracks variance** against that budget for the rest of the life.

---

## Standards anchor

Per the canonical citations in [`05_Conventions.md` §9](../05_Conventions.md):

- **ISO/IEC/IEEE 15288:2023** — *Project Planning* and *Project Assessment & Control* processes (Technical Management group; see the process-group map in [`01_Workflow_Overview.md` §3](../01_Workflow_Overview.md)). These two processes are this thread's home in 15288.
- **EVM — ANSI/EIA-748** — the Earned Value Management Systems standard (32 guidelines across organization, planning/budgeting, accounting, analysis, and revisions). The BCWS/BCWP/ACWP and CPI/SPI vocabulary below is EIA-748's.
- **INCOSE SE Handbook v5 (2023)** and **NASA/SP-2016-6105 Rev 2** — practitioner guidance on WBS, schedule, and EVM in the SE context.
- Cross-reference **Phase 05 — COCOMO** for the software-effort estimate (Basic/Intermediate constants in KB topic 12 §"The COCOMO model") that feeds the WBS work packages.

> EVM here is **OUTSIDE the course KB** (EIA-748 is industry practice, not in the 12 topics) — marked as such so it is not mistaken for course material. COCOMO **is** in the KB and is cross-referenced, not duplicated.

---

## The living artifact

- **Artifact:** `Cost_Schedule_EVM_Tracker.md` — the WBS + schedule + LCC model + the EVM time-series, updated every stage.
- **Lives in:** `<project-slug>/_cross_cutting/Cost_Schedule_EVM_Tracker.md` (the cross-cutting home defined in [`05_Conventions.md` §10](../05_Conventions.md)), alongside `Risk_Opportunity_Register.md`, `TPM_Tracker.md`, etc.
- **Template:** blank fill-in version at [`../templates/Cost_Schedule_EVM_Tracker.md`](../templates/Cost_Schedule_EVM_Tracker.md), carrying the [Conventions §6](../05_Conventions.md) frontmatter block (`Document`, `Document ID: CST-<PROJECT_SLUG>-vX.Y`, `Standard: ANSI/EIA-748; ISO/IEC/IEEE 15288:2023`, `Status`, `Owner`).

### ID grammar

This thread reuses the project-wide grammar from [`05_Conventions.md` §2](../05_Conventions.md) (uppercase, hyphen-separated, **zero-padded two-digit** sequence, stable for life — retire with `(deprecated)`, never renumber). It introduces three local IDs:

| Artifact | ID form | Notes |
|---|---|---|
| WBS element / work package | `WBS-<n.n.n>` | Hierarchical decimal (e.g. `WBS-3.2.1`), mirroring the WBS tree; the lowest level is the **work package** that earns value. |
| Control account | `CA-<nn>` | The point where scope, budget, schedule, and an owner meet — the unit EVM is measured at. |
| Schedule milestone | `MS-<nn>` | Maps each gate (ATP…DRR) to a dated milestone; `MS` rows are 0%-or-100% (no partial credit). |

Cost figures trace **back** to their source: a `WBS` budget cites the `DM-<nn>`/`DEC-<nn>` TCO or the `COCOMO_Estimate.md` it came from; a re-plan cites the `CR-<nn>` (Stage 09) that triggered it. Placeholders use the standard `…-TBD` form — never a blank cell.

### EVM vocabulary (EIA-748)

| Term | Symbol | Plain meaning |
|---|---|---|
| Budgeted Cost of Work **Scheduled** | **BCWS** (PV) | What you *planned* to have spent by now (the baseline S-curve). |
| Budgeted Cost of Work **Performed** | **BCWP** (EV) | The budgeted value of what you've *actually finished* — "earned value." |
| Actual Cost of Work Performed | **ACWP** (AC) | What you've *actually spent*. |
| Budget At Completion | **BAC** | Total budget for the baselined scope. |
| Cost Performance Index | **CPI** = BCWP/ACWP | < 1 = over budget. |
| Schedule Performance Index | **SPI** = BCWP/BCWS | < 1 = behind schedule. |
| Estimate At Completion | **EAC** = BAC/CPI | Forecast total cost at current efficiency. |
| Variance At Completion | **VAC** = BAC − EAC | Forecast over/under-run. |

---

## Lifecycle touchpoints

What this thread does at each of the 12 stages (00…11). It is **alive in every stage** and reviewed at every gate.

| Stage | Gate | What the Cost/Schedule/EVM thread does |
|---|---|---|
| **00 Agreement** | ATP | Capture the funding envelope, contract type (fixed-price vs cost-plus), and milestone-payment frame from the agreement; create `Cost_Schedule_EVM_Tracker.md`; set BAC ceiling as a `C`-class budget constraint (`REQ-C-*`). |
| **01 Concept** | MCR | ROM (rough-order-of-magnitude) lifecycle-cost estimate and a top-level milestone schedule feed the **Feasibility Study**'s economic-feasibility verdict; first NPV/CBA of the business case. |
| **02 Requirements** | SRR | Decompose scope into the first **WBS**; tie the budget-ceiling constraint to MOPs (cost-as-a-MOP); cost/schedule estimates mature from ROM to budgetary. |
| **03 Modeling** | (model coverage) | Size estimates firm up as the model reveals real component/interface count; re-estimate KLOC (→ COCOMO) and BoM from the BDD/IBD. |
| **04 Architecture** | PDR | Architecture sets the cost structure — `WBS` aligns to architecture blocks; the **Performance/Measurement Baseline (PMB)** is proposed; allocated-baseline cost is a PDR exit input. |
| **05 Trade-off** | (decisions traced) | **Source stage for the numbers**: each `DM-<nn>` produces a TCO/NPV figure and `COCOMO_Estimate.md` produces effort/schedule — these roll up into the WBS budget and the critical-path schedule. |
| **06 Integration** | CDR | Integration-increment plan (`INC-<nn>`) is sequenced against the schedule; the EVM **Performance Measurement Baseline is frozen at CDR** with the product baseline; CPI/SPI tracking begins in earnest. |
| **07 Verification** | TRR | Test-campaign cost/effort tracked as work packages; verification slips show up as SPI erosion before TRR. |
| **08 Validation** | PRR | Validation/acceptance (FAT/SAT) effort earned; EAC/VAC presented as a production-readiness input; cost of open defects estimated. |
| **09 Change/Config** | (baselines current) | **Every `CR-<nn>` carries a cost-and-schedule impact** (the IA's cost/schedule delta); approved changes **re-plan the PMB** and update EAC. This is the thread's tightest coupling — see the Phase 09 cross-reference. |
| **10 Operations** | ORR / GA | Shift to **OpEx/run-cost** tracking against the LCC model; SLO-breach and on-call costs feed actuals; CPI/SPI retired, lifecycle-cost actuals begin. |
| **11 Disposal** | DRR | Decommissioning-cost line of the LCC realised; capture final cost-at-completion and schedule actuals as lessons-learned for future estimates. |

---

## Method / activities

1. **Build the WBS (deliverable-oriented).** Decompose 100% of the scope into a tree of `WBS-n.n.n` elements down to work packages small enough to estimate and assign one owner. The **100% rule**: the children of any node sum to exactly the parent — no scope missing, none double-counted.
2. **Estimate each work package.** Reuse Phase 05 outputs — TCO from the trade studies, COCOMO effort for software packages (cross-reference, don't re-derive). Triangulate (analogy + parametric + bottom-up) per the KB best practice; record the basis-of-estimate.
3. **Schedule & find the critical path.** Sequence work packages by dependency, estimate durations, and compute the **critical path** (longest dependent chain → float = 0). Map each gate to an `MS-<nn>` milestone. Identify near-critical paths (low float) as schedule risks → feed the Risk thread.
4. **Roll up the lifecycle cost (LCC/TCO).** Sum the seven cost types across the life; discount multi-year flows with **NPV/DCF**; this is the figure the business case is judged on, refreshed each stage.
5. **Baseline (PMB).** Time-phase the budget into a **BCWS** S-curve. Propose the PMB at PDR; **freeze it at CDR** with the product baseline. Thereafter it changes only via a `CR-<nn>` (Stage 09).
6. **Measure earned value each stage.** At each stage-end (loop step 7 of the [AI Protocol §7](../02_AI_Systems_Engineer_Protocol.md)): record BCWP and ACWP, compute **CPI = BCWP/ACWP** and **SPI = BCWP/BCWS**, and forecast **EAC = BAC/CPI**, **VAC = BAC − EAC**.
7. **Analyse variance & act.** Flag any control account with CPI or SPI < 0.9 (or a project-set threshold); write a variance explanation and a corrective action; raise a `RSK-<nn>` if recovery is uncertain. Feed the verdict into the gate decision.
8. **Re-plan on change.** When a `CR-<nn>` is approved, recompute the affected work packages, re-time-phase the PMB, and re-publish EAC — the cost-impact loop closing back to Stage 09.

---

## Gate-review questions

Ask these about the cost/schedule thread at the matching gate (criteria home: [`checklists/gate-reviews.md`](../checklists/)):

- **ATP** — Is the funding envelope and BAC ceiling recorded? Is the contract type's cost-risk understood?
- **MCR** — Does the ROM LCC close the business case (NPV > 0 / acceptable CBA)? Is the milestone schedule credible?
- **SRR** — Is there a WBS covering 100% of the baselined scope? Is the budget-ceiling constraint a tracked requirement?
- **PDR** — Does the architecture's cost structure fit the BAC? Is the PMB proposed? Any work package with no basis-of-estimate?
- **CDR** — **Is the Performance Measurement Baseline frozen with the product baseline?** Is the critical path identified and resourced? Is EVM data collection live?
- **TRR / PRR** — What are current CPI/SPI? What is EAC vs BAC (VAC)? Are any control accounts below threshold, and is there a funded corrective action? Is the over-run, if any, explicitly accepted?
- **ORR / GA** — Is the run-cost (OpEx) within the LCC model? Are SLO/on-call costs tracked against the operate budget?
- **DRR** — Is the decommissioning-cost line realised? Are final cost/schedule actuals captured as lessons-learned?
- **Every gate** — Has a `CR` re-planned the PMB without an approved cost-impact? (If yes → **Hold**, baseline integrity is broken.)

---

## AI prompt pack

Copy-paste prompts (the AI is expected to *challenge*, not rubber-stamp — per the [AI Protocol](../02_AI_Systems_Engineer_Protocol.md)):

**1 — Build the WBS + first estimate**
```
Acting as the cost/schedule lead, decompose the scope in <SysRS.md + Architecture_Description.md>
into a deliverable-oriented WBS (WBS-n.n.n) down to work packages. For each, give a basis-of-estimate,
reusing the TCO from <Decision_Matrices.md> and the effort from <COCOMO_Estimate.md>. Verify the 100% rule
at every node and flag any work package lacking a basis-of-estimate. Output the WBS table + a roll-up BAC.
```

**2 — Compute and interpret EVM**
```
Given BCWS=<>, BCWP=<>, ACWP=<>, BAC=<> at <stage>, compute CPI, SPI, EAC, and VAC. State in one line
whether we are over/under budget and ahead/behind schedule, and forecast the completion cost. List every
control account with CPI or SPI < 0.9 and recommend a gate outcome (Proceed / Proceed-with-actions / Hold).
```

**3 — Lifecycle-cost / NPV comparison**
```
Build a <N>-year LCC/TCO model for <option A> vs <option B> using the 7 KB cost types
(development, deployment, operational, maintenance, training, decommissioning, opportunity). Apply NPV
at a <r>% discount rate. Show where a higher upfront cost is justified by lower operational cost, and feed
the winning figure to the WBS budget. Do not use ROI for this cost-only comparison.
```

**4 — Red-team / critique the cost & schedule baseline**
```
Adversarially review <Cost_Schedule_EVM_Tracker.md>. Find: scope missing from the WBS (100%-rule breaks);
work packages with optimistic or unsourced estimates; a critical path that ignores a real dependency or has
no schedule margin; a PMB changed without a CR; an EAC that assumes CPI will magically recover to 1.0;
and any cost figure that contradicts its source DM-NN/COCOMO. For each, state the consequence and the fix.
```

---

## Common pitfalls

- **EVM theatre.** Collecting BCWS/BCWP/ACWP but never acting on a sub-0.9 CPI. The index is an alarm, not a report — a variance with no corrective action is a finding, not a status.
- **Assuming CPI recovers.** Forecasting EAC = BAC (or with a hopeful recovery factor) when current CPI is 0.85. Research shows CPI stabilises early; **EAC = BAC/CPI** is the honest forecast.
- **WBS that isn't 100%.** Forgetting integration, V&V, training, or decommissioning work packages — the estimate looks lean because scope is missing, then the over-run "appears" later. Enforce the 100% rule and the seven cost types.
- **Confusing the WBS with the org chart or the schedule.** The WBS is *deliverable-oriented* (what, not who or when); the schedule sequences it. A task-list masquerading as a WBS hides scope.
- **Changing the PMB without a CR.** Silently re-baselining the budget to mask an over-run destroys EVM's meaning. The PMB freezes at CDR and moves only through Stage 09 ([`05_Conventions.md` §3](../05_Conventions.md)).
- **Upfront-cost-only comparison.** Picking the cheaper build that costs more over its life. Use LCC/TCO with NPV over the full horizon, including indirect and decommissioning costs (KB topic 12 pitfall).
- **ROI for a cost-only choice.** ROI needs a benefit/gain term; for two cost options use TCO or NPV (KB topic 12).
- **Treating COCOMO as precise.** It assumes size is the main driver and ignores team specifics — triangulate it and validate against actuals; never carry COCOMO's point value into the WBS as if it were measured.

---

## References

- **ISO/IEC/IEEE 15288:2023** — Project Planning; Project Assessment & Control processes. (Canonical per [`05_Conventions.md` §9](../05_Conventions.md).)
- **ANSI/EIA-748** — Earned Value Management Systems standard (BCWS/BCWP/ACWP, CPI/SPI, the 32 guidelines). [OUTSIDE the course KB.]
- **INCOSE SE Handbook v5 (2023)** — §Technical Management: planning, assessment & control, estimation.
- **NASA/SP-2016-6105 Rev 2** — WBS, schedule, and EVM in the NASA SE process.
- **Phase 05 — Trade-off & Decision** — source of the TCO/NPV and COCOMO numbers this thread consumes.
- **Phase 09 — Change & Configuration Management** — receives the change cost-impact; owns PMB re-planning via `CR-<nn>`.
- **KB topic 12 — Design Trade-offs** — seven cost types; LCA/TCO/NPV/CBA/ROI; COCOMO model, constants, and pitfalls.
- **[Conventions](../05_Conventions.md)** §2 (IDs), §3 (gates & baselines), §6 (frontmatter/versioning), §9 (citations), §10 (folder layout) — the contract this thread conforms to.
- **[Risk & Opportunity thread](Risk_and_Opportunity_Management.md)** · **[Measurement (MOE/MOP/TPM) thread](Measurement_MOE_MOP_TPM.md)** — schedule risks and cost-as-a-MOP cross-feed here.
