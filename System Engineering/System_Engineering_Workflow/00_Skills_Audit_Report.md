# Systems Engineering Skills — Audit Report

**Audited:** the 10 phase skills in `5-sytem-eng/skills/`, the `Full_Process_Playbook.md`, the `Systems_Engineering_Comprehensive_Guide.md`, and the `work_example/` (EV Charging Station Network), validated against the 19‑topic `Systems-Engineering-KB/`.
**Method:** 14 parallel auditor agents — one per skill cross‑checked against its mapped KB topics + the worked example, plus four cross‑cutting agents (duplication/cohesion, doc‑consistency with arithmetic recomputation, KB→skill coverage, and standards/best‑practice completeness). All numeric claims in the worked example were independently recomputed.
**Date:** 2026‑06‑25.

---

## Executive summary

The skill set is **strong and structurally sound**. Every one of the 10 skills earned a **keep‑and‑improve** verdict; **none** warranted removal, and the phase boundaries map cleanly onto the ISO/IEC/IEEE 15288 technical processes. The end‑to‑end traceability spine (`REQ → satisfy/verify → TC‑VER/TC‑VAL → CR → SLO`) is the chain's biggest strength.

Three classes of problem need fixing:

1. **Correctness (P0).** The worked example's Phase‑5 numbers are wrong. **Every** Basic‑COCOMO development‑time and team‑size value is miscalculated, the aggregate effort and critical path are wrong, and three of the decision‑matrix sensitivity analyses are arithmetically incorrect (two even reverse which option leads). This is the exact "silent propagation" failure the KB's own executive summary warned against — and because the README markets the example as the canonical shape to copy, the errors propagate to every user.
2. **Coherence (P1).** Cross‑cutting conventions (REQ/TC ID grammar, the SRR→…→GA gate table, T/I/A/D method definitions, the S1–S4 severity taxonomy, scan/tool tables) are restated in 2–9 places with **no single home**, and drift has already begun. There are also **two competing canonical worked examples** (EV Charging Station Network vs. the Guide's Smart Home Security System) sharing one tree without cross‑labeling.
3. **Completeness (P1/P2).** The chain faithfully covers the *technical* processes but omits recognized SE practice the brief explicitly asks for: a continuous **risk** thread, **configuration management** as a discipline, the **stakeholder‑needs (StRS/OpsCon) vs system‑requirements** distinction, **feasibility study**, **TPM/MOE/MOP** measurement, **safety/RAMS** and **security‑engineering** threads, **Human Systems Integration**, a **Disposal/Retirement** phase, and explicit anchoring to **ISO/IEC/IEEE 15288, INCOSE SE Handbook v5, NASA SP‑2016‑6105, IEEE 1012**.

The remediation plan (Part E) folds all of this into the new `System_Engineering_Workflow/` and into targeted edits of the existing skills.

---

## Verdict on improve / merge / split / remove

| Action | Finding |
|---|---|
| **Remove** | **None.** All 10 phases carry distinct, gate‑bearing deliverables that correspond to real ISO 15288 process outputs. |
| **Merge** | **Optional, not required.** Strongest candidate: **Phase 7 Verification + Phase 8 Validation** (paired ISO 15288 processes; the V‑vs‑V table and severity taxonomy are duplicated across both). Secondary: **Phase 4 Architecture + Phase 5 Trade‑off** (both Architecture/Design Definition; Phase 5 draws all alternatives from Phase 4). Both are *defensible as separate* for teaching clarity. **Recommendation: keep separate, but make each shared concept live in exactly one place.** |
| **Split** | **Optional.** **Phase 5** carries two jobs (always‑on weighted decision matrices vs. conditional COCOMO effort estimation). **Phase 10** is the widest‑scoped skill and bundles day‑2 ops with **Disposal/Retirement** — which is a distinct 15288 lifecycle stage. **Recommendation: carve Disposal into its own Phase 11** (addresses both a split and a coverage gap); leave Phase 5 intact but cross‑reference estimation. |
| **Improve** | **All 10.** See Part A. |

---

## Part A — Per‑skill findings

Severity legend: 🔴 high · 🟠 medium · 🟡 low.

### Phase 1 — Concept → **IMPROVE**
*Sound interview flow and two‑file output; but it omits the two artifacts that the KB says **define** the Concept stage.*
- 🔴 **No feasibility study.** The KB calls the feasibility study the gate of the Concept stage ("can and should we build this?"). The skill never asks about technical/market/regulatory feasibility.
- 🔴 **No Concept of Operations (ConOps/OpsCon).** Usage scenarios are captured only as one‑line "Top Use Case" cells, not a ConOps — the document every later decision is checked against.
- 🟠 **Spiral silently dropped** from the interactive lifecycle selector (offered only in the static table) — a high‑risk project is never offered the model the KB says fits.
- 🟠 No anchor to ISO 29148 **BRS/StRS** (the mission/stakeholder content *is* BRS/StRS but is never named) or to 15288 Business/Mission Analysis + Stakeholder Needs.
- 🟡 Internal drift: stakeholder table is "4 columns" in Step 13 but 5 columns in supporting‑info and the example; CDR anchored to Q2 in the skill but Q3 in the example's schedule table; schedule claims it's keyed to TRR/PRR which the example never uses; "Agile / SAFe" conflates a base model with a scaling framework.

### Phase 2 — Requirements → **IMPROVE**
*Faithful SMART/EARS/class/traceability core; but it skips the front half of requirements engineering and diverges from its own example.*
- 🔴 **Elicitation methods missing** (interviews/workshops/surveys/observation/document review) — Phase 2 jumps straight to writing requirements.
- 🔴 **Prioritization missing** (High/Med/Low/N/A), **peer review/walkthrough missing**, **Constraint & Domain classes missing**.
- 🔴 **StRS/OpsCon → SyRS distinction blurred** — no problem‑space needs baseline before the solution‑space spec.
- 🟠 **Standard mis‑citation.** "SysRS … §9.4" — the 29148 system‑requirements document is the **SyRS**, and the clause label should be verified; reconcile the SRR‑vs‑PDR baseline claim with the example.
- 🟠 Skeleton (10 sections) doesn't match the canonical 13‑section worked example (Security/Operational are top‑level in the example, subsections in the skill); the INT class is prescribed but has zero instances in the example; EARS/`TC-VER-TBD` prescribed but unused in the example.

### Phase 3 — Modeling → **IMPROVE**
*Practical 7‑diagram PlantUML generator; under‑represents the KB's typing schemes and the MBSE analytical layer.*
- 🔴 **Only 5 of 7 SysML relationships** (drops composite/containment and copy); the worked example mislabels a parent→child link as `<<refine>>` (should be `<<derive>>`/containment).
- 🔴 **MBSE analytical layer absent** — dependency **matrices**, "negative‑space" orphan detection, coverage **metrics over time**, packages, stereotypes (KB topic 09). The static coverage table is thin.
- 🔴 Requirement typing not anchored to the KB's 8 SysML subtypes / 3 MBSE levels; no mapping from the F/U/P/O/SEC/INT codes.
- 🟡 The `o--` connector is described inconsistently (association / aggregation / "composes") across skill + example; **FFBD** not mentioned. (README's "7 PlantUML diagrams" claim *does* verify — exactly 7 `.puml` in the example.)

### Phase 4 — Architecture → **IMPROVE**
*The strongest interface/ICD operationalization in the set; drifts from the architecture‑theory KB.*
- 🔴 **Draft‑vs‑Baseline contradiction.** The skill says the ICD is Draft at PDR, but `work_example/ICD.md` is already "Baseline (CDR‑approved)" — the canonical example violates the skill's own gate.
- 🟠 **TOGAF ADM described wrong** — needs 9 phases (add Preliminary) plus the central Requirements Management process.
- 🟠 Missing **ISO/IEC 42010** scaffold (stakeholders→concerns→viewpoints→views), an architecture‑**principles** step, and any **FFBD** pointer.
- 🟠 Single‑select framework picker contradicts the KB's (and the example's) "frameworks are complementary" reality; no anchor to 15288 Architecture/Design Definition or NASA/INCOSE PDR criteria.

### Phase 5 — Trade‑off → **IMPROVE** (and the worked example is **P0‑broken**)
*Method and COCOMO body‑math are sound; the canonical example numbers are not.*
- 🔴 **COCOMO recomputation (work_example):** every development‑time **T** and team‑size **N** is wrong, understated by ~3–5 months. Correct values from the doc's own constants:
  - Embedded (100 KLOC): E≈**904.3**, T≈**22.08 mo**, N≈**40.96** (doc said T=19.0, N=47.6)
  - Semi‑Detached (105 KLOC): E≈**550.6** (doc said 522), T≈**22.76 mo** (doc said 17.6), N≈**24.19** (doc said 29.7)
  - Organic (100 KLOC): E≈**302.1**, T≈**21.90 mo** (doc said 17.5), N≈**13.80** (doc said 17.0)
  - Aggregate: ΣE ≈ **1,757 PM** (doc said 1,723); **critical path = 22.76 mo on the Semi‑Detached branch**, not "19 mo, Embedded drives schedule." Intermediate: 1,757 × 0.78 = **1,370 PM** (doc said 1,344).
- 🔴 **Decision‑matrix recomputation (work_example):**
  - §5.2 Sensor base totals wrong: PIR = **7.75** (not 7.65), Dual‑Tech = **7.80** (not 8.10) → the winning margin is **0.05**, not 0.45; this matrix has **no sensitivity check** despite the exit gate requiring one.
  - Sensitivity arithmetic wrong in §5.1, §5.2‑protocol, §5.3; two cases (**Hosting Cost@40%**, **OCPP Cost@40%**) **reverse which option leads**. *Reassuringly, no case actually flips the stated base‑case winner* — so the decisions stand once recomputed.
- 🔴 KB cost taxonomy under‑surfaced (7 cost types, NPV/DCF, TCO/LCA/CBA/ROI); **Scalability & Maintainability** missing as criteria; KLOC mode buckets fall outside the KB's own size ranges.
- 🟠 Convention drift skill‑vs‑example: D‑NN vs DM‑NN IDs, 4‑ vs 5‑column register, 1–5 vs 1–10 scale, "four" decisions labelled over five.

### Phase 6 — Integration → **IMPROVE**
*One of the stronger skills; CI/CD‑per‑tier and HIL templates exceed the KB.*
- 🔴 **Factual error:** cites "5 increments"; the worked example has **9**, and the example doesn't conform to the skill's own increment template or the "every ICD‑NN appears in the stubs/drivers/mocks table" rule.
- 🟠 Two KB teaching points under‑represented: **order increments by dependency weight** (the KB's top heuristic), and the **interface‑type taxonomy + dependency‑vs‑interface distinction**.
- 🟠 No anchor to 15288 Integration, IEEE 828 (CM/ICD freeze), or ISO 26262/IEC 61508 for safety‑relevant HIL.

### Phase 7 — Verification → **IMPROVE**
*Strong T/I/A/D operationalization; output shape contradicts the example.*
- 🔴 The skill mandates **Status + Evidence‑path columns** and an `evidence/TC-VER-NN/` tree the canonical example doesn't contain (it's 5 columns, uses `verification-evidence/`). Make them agree.
- 🟠 Reviews/gate table drift (GA row, PRR wording/artifacts) across skill, example, README.
- 🟠 Missing KB bridges: "**Review**" as a method family distinct from Inspection; acceptance/UAT as the **verification→validation hinge** (owned by Phase 8); the caveat that a 100%‑verified matrix is **necessary but not sufficient**.

### Phase 8 — Validation → **IMPROVE**
*Well‑templated; drops several named KB constructs.*
- 🔴 **FAT/SAT** acceptance types missing from the catalog/checklist (notable given the installed‑hardware example).
- 🔴 TC‑VAL template missing the two post‑execution fields **Actual Result** and **Pass/Fail Status** (KB topic 17); no explicit **test‑case independence** rule (the example violates it).
- 🟠 Standard citation should be **ISO/IEC/IEEE 29119‑3:2021**; mark **IEEE 829 superseded**; the prescribed Type enum contradicts the example's "Validation (\<facet\>)" convention.

### Phase 9 — Change Management → **IMPROVE**
*Strong governance loop; delivers only half of KB topic 18.*
- 🔴 **Continuous‑validation half barely present** (one sentence) — no shift‑left / per‑commit pipeline / test‑type ladder.
- 🟠 Missing the **Initial‑Review feasibility gate** and the **configuration‑management/CMS** framing; D‑class SLA contradicts the example (48 h vs 5 day); a semver‑by‑class error.
- 🟠 No anchor to 15288 CM process, ISO 10007, ISO 31000.

### Phase 10 — Operations → **IMPROVE**
*Modern SRE skill (SLOs, error budgets, observability, chaos, OTA); under‑connected to its KB topics and unanchored to standards.*
- 🔴 **Runbooks contradiction** — mandated in step 9, the output doc, and the exit gate, but the example produces none.
- 🔴 Barely shares vocabulary with KB topic 18 (shift‑left, fail‑fast, service virtualization, test‑type ladder) and topic 19 (unified‑ID traceability, Minimum‑Viable‑vs‑Formal scaling).
- 🟠 No standards anchor (15288 Operation/Maintenance/Disposal, IEEE 1012, **NIST SP 800‑88** for secure wipe); SLO/error‑budget core needs an explicit "OUTSIDE‑MATERIAL / Google‑SRE" marker (not in the KB); severity labels drift (S1–S4 vs SEV‑1‑4).

---

## Part B — Cross‑cutting findings

### B1. Duplication / cohesion
Cohesion is strong (consistent skill skeleton, named handoffs, explicit gates). The weakness is **cross‑cutting conventions with no single home**, restated in 2–9 places and already drifting (e.g., HIL coverage "**>90%**" in Phase 7 vs "**≥ target**" in Phase 6). Items to centralize into one shared `Conventions.md`:

| Convention | Restated in | Single owner should be |
|---|---|---|
| REQ‑ID grammar + class letters; TC‑VER/TC‑VAL | Phase 2 + README + 7 downstream phases | `Conventions.md`; Phase 2 authoritative |
| Gate sequence SRR→PDR→CDR→TRR→PRR→GA + artifacts + pass criteria | Phases 1/4/6/7 + README | `Conventions.md` / Playbook |
| T/I/A/D method definitions | Phases 2 + 7 | Phase 7 (Phase 2 only seeds a default) |
| S1–S4 severity taxonomy | Phases 8 + 10 (+9) | `Conventions.md` |
| Static‑scan / CI tool tables | Phases 6 + 7 (+10) | Phase 6 (Phase 7 references) |
| ICD baseline‑status strings | Phases 4 + 6 + 9 | `Conventions.md` |
| PlantUML/SysML drawing conventions | Phases 3 + 4 | Phase 3 |

### B2. Consistency & the two worked examples
- **Numeric errors** concentrated entirely in `work_example/Phase_05_Tradeoff/` (see Phase 5 above). Process/convention consistency across the four docs is otherwise good.
- **Two competing canonical examples**: the Playbook + skills point to **EV Charging Station Network** (`work_example/`); the Comprehensive Guide §10 walks through a **Smart Home Security System** (citing a `Deliverables/` folder). They co‑exist with no cross‑label, and cross‑references like "Matches SHSS's local‑first pattern" assume the reader knows which is which. **Pick one canonical example; clearly mark the other as secondary/illustrative.**
- **Version‑citation drift**: Guide cites "IEEE 830‑1998 / ISO 29148" (830 is superseded by/rolled into 29148); Playbook/skills cite only "29148:2018 §9.4." **7‑vs‑9 SysML diagram drift**: the "7" is a deliberate working subset of SysML's 9 (drops Package + Parametric) but this is never stated.

### B3. KB → skill coverage
**Strong/near‑1:1 (13 of 19 topics):** 02 process‑stages, 04 tools, 05 elicitation, 06 verifying, 07 req‑management, 08 SysML, 12 trade‑offs, 13 decision‑matrix, 14 documenting‑arch, 15 integration, 16 V&V, 17 test‑plans, 18 change/continuous, 19 Agile playbook.
**Thin (assumed, not taught/produced):** 01 SE‑fundamentals (definition, systems‑thinking vs holistic view, integrator role), 03 lifecycle‑models (model *literacy* vs just selection), 09 MBSE (matrices/metrics/stereotypes), 10 design‑vs‑architecture (definitions, 42010), 11 frameworks (apply‑each depth: 9 ADM phases, Zachman 6×6, NIST 5 layers).
**Absent:** none — but see Part D for practice/standards beyond the course KB.

---

## Part D — Standards & cross‑cutting‑discipline gaps

These go beyond the course KB and are what the brief asks for (ISO 15288, INCOSE, MBSE, V‑Model, V&V, risk). Priority in brackets.

**Lifecycle‑coverage gaps**
- **[high] Disposal/Retirement** — named as the endpoint ("concept‑to‑disposal") but has no phase. Add **Phase 11** (Disposal_Plan: decommissioning sequence, data sanitization per **NIST 800‑88**, environmental/RoHS‑WEEE, obsolescence/spares, knowledge archival) with a **Decommissioning Readiness Review (DRR)** gate.
- **[med] Production/Manufacturing** and **[med] Transition/Deployment (ORR)** — collapsed; absent for hardware/hybrid systems. Add production‑readiness + a discrete transition/fielding step with an **Operational Readiness Review**.
- **[high] Pre‑concept / Agreement** — no Acquisition/Supply (RFP/SOW, supplier selection, acceptance). Add a **Phase 0** framing.

**Process‑framework anchoring**
- **[high] ISO/IEC/IEEE 15288 four process groups** (Agreement; Organizational Project‑Enabling; Technical Management; Technical). The 10 phases map only to *Technical* (+ partly Technical Management). Add a framing table and flag the out‑of‑scope groups so users source them elsewhere.
- **[med] Name the authorities**: **INCOSE SE Handbook v5 (2023)**, **NASA SP‑2016‑6105 Rev 2**, **IEEE 1012** (V&V), **ISO/IEC 42010** (architecture), **ISO 31000** (risk), **ISO 10007** (CM). Cross‑reference the 10 phases to INCOSE technical processes / NASA's 17 common technical processes + life‑cycle reviews.
- **[low] SysML v2 / digital thread** — modeling is pinned to v1.x via PlantUML; add a forward‑note and a "when a real MBSE tool beats PlantUML diagrams" guide.

**Cross‑cutting disciplines to promote to first‑class threads**
- **[high] Risk & Opportunity Management** (ISO 31000) — currently a one‑shot Phase‑1 register. Make it a **living register reviewed at every gate**, feeding Phase‑5 trade‑offs and Phase‑9 impact analysis; add opportunity management.
- **[high] Configuration Management** — collapsed into change control. Add identification, baseline management (requirements@SRR, allocated@PDR, product@CDR), status accounting, **FCA/PCA** audits at PRR.
- **[high] Stakeholder needs vs system requirements** — produce **StRS + OpsCon** (problem space) and trace **StRS→SyRS**.
- **[high] Measurement: MOEs / MOPs / TPMs** — define MOEs from needs and MOPs from the SyRS in Phase 2; track **TPM margins** through Phases 6–10 and tie them to gate readiness and trade‑off scoring.
- **[high] Safety / RAMS** — FMEA/FTA named once; add a hazard‑analysis thread (FHA → PHA/SHA), hazard log, reliability/availability allocation, FRACAS, safety case (for DO‑178C / ISO 26262 / IEC 62304 domains already named in the KB).
- **[high] Security Engineering** — exists only as a REQ class + scans; add threat modeling (STRIDE), trust‑boundary analysis, control selection (**ISO/IEC 27001, NIST 800‑53/‑160**), and **SBOM/supply‑chain** security.
- **[med] Human Systems Integration** — beyond a Usability REQ class: human factors, training, staffing, ergonomics, human error.
- **[med] Cost/Schedule/EVM** — WBS, LCC/TCO, CPI/SPI; COCOMO is the only cost element today and it's optional.
- **[med] Quality Assurance** (ISO 9001 / 15288 QM) and **[med] Integrated Logistics Support / supportability**, **[low] Knowledge Management / lessons‑learned** feeding disposal.

---

## Part E — Prioritized remediation plan

**P0 — correctness (do first, regardless of anything else)**
1. Recompute and rewrite `work_example/Phase_05_Tradeoff/COCOMO_Estimate.md` (T, N, aggregate, critical path, Intermediate) with the corrected values in Part A.
2. Correct `work_example/Phase_05_Tradeoff/Decision_Matrices.md` base totals (§5.2 sensor) and all sensitivity numbers; add the two missing sensitivity blocks (§5.2 sensor, §5.4 mobile) the exit gate requires.
3. Fix the factual "5 increments" (→9) in Phase 6 and the Phase‑4 ICD Draft‑vs‑Baseline and Phase‑7 column/evidence‑path contradictions.

**P1 — coherence**
4. Create a single **`Conventions.md`** (IDs, gate table + pass criteria, T/I/A/D, S1–S4 severity, baseline‑status strings, scan/tool tables); have README/Playbook/skills cite it instead of re‑listing.
5. Resolve the **two‑examples** problem: designate one canonical example; cross‑label the other; state the 7‑of‑9 SysML subset and the 830→29148 supersession explicitly.
6. Fix per‑skill internal drift (column counts, CDR Q2/Q3, severity label styles, ID conventions, standard citations: SyRS, 29119‑3, IEEE 829 superseded).

**P1 — completeness (mostly delivered through the new `System_Engineering_Workflow/`)**
7. Add **StRS + OpsCon + feasibility study** to Phase 1/2; add **elicitation/prioritization/peer‑review/Constraint+Domain** to Phase 2; restore **Spiral** in Phase 1's selector.
8. Add the **MBSE analytical layer** (matrices, negative space, coverage metrics) and the **full 7 SysML relationships** to Phase 3; add **42010 + architecture principles + correct 9‑phase TOGAF** to Phase 4.
9. Add **FAT/SAT + Actual‑Result/Pass‑Fail fields + independence** to Phase 8; add the **continuous‑testing half + CM framing** to Phase 9; reconnect Phase 10 to KB‑18/19 vocabulary and standards.
10. Stand up the **cross‑cutting threads** (Risk, CM, Safety/RAMS, Security, HSI, Measurement/TPM, Cost/EVM, QA) as living artifacts reviewed at gates.

**P1 — new lifecycle coverage**
11. Add **Phase 0 (Agreement/Enabling framing)**, **Phase 11 (Disposal & Retirement + DRR)**, and a **Transition/ORR** step; add the **15288 four‑process‑group** framing table.

**P2 — modernization & anchoring**
12. Cite **INCOSE v5, NASA SP‑2016‑6105, IEEE 1012, ISO 42010/31000/10007, NIST 800‑88/‑53** in references; add a **SysML v2 / digital‑thread** forward‑note; add a **tailoring guide** so the full workflow scales down for small projects.

---

*This report is the provenance for the consolidated, corrected, standards‑anchored workflow in this folder. Each item above is addressed either by the workflow's stage guides and cross‑cutting threads or by a targeted edit to the corresponding skill in `5-sytem-eng/skills/`.*
