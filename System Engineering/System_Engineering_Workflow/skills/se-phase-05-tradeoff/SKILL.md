---
name: se-phase-05-tradeoff
description: Runs Phase 05 (Trade-off & Decision) of the domain-agnostic systems-engineering workflow — the ISO/IEC/IEEE 15288 Decision Management process. It turns the strategic choices left open by the architecture into auditable, sensitivity-tested decisions: it identifies the 3–5 pivotal decisions, negotiates weighted criteria (Cost, Performance, Reliability, Risk, Scalability, Maintainability) against stakeholder priorities, scores 2–4 same-level alternatives 1–10 with derivable (not asserted) justifications grounded in the KB cost/performance/scalability methods, computes weighted totals, runs a mandatory sensitivity analysis (re-weight each criterion to 40%) on every top-level decision, and emits Decision_Matrices.md (DM-NN) + Decision_Register.md (DEC-NN, 5-column, ADR-linked) plus an optional COCOMO_Estimate.md for software-heavy work. Use this when the user wants to compare options, build a decision matrix or weighted scoring model, make an architecture choice defensible, run a trade study, do AHP/TOPSIS, run sensitivity analysis, write an ADR, estimate software effort with COCOMO, or "do phase 5 trade-off". Triggers on phrasings like "trade-off analysis", "trade study", "decision matrix", "weighted scoring", "compare alternatives", "which option should we pick", "sensitivity analysis", "AHP / TOPSIS", "ADR / architecture decision record", "COCOMO / effort estimate", "phase 5".
---

# Phase 05 — Trade-off & Decision

<what-to-do>
This phase makes every strategic decision left open by the architecture **auditable**: each is reduced to a weighted decision matrix with a sensitivity check, recorded as a numbered decision (ADR), and traced to the requirements it serves. **Exit gate: _Decisions traced_** — every top-level decision has a `DM-NN` matrix, a documented sensitivity analysis, and a `DEC-NN` register row linking ≥ 1 `REQ`. This phase conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, scales, severities, and standard citations; it never redefines them.

## Inputs (from prior phases)
- **Phase 04 — `Architecture_Description.md`, `Tech_Stack_Rationale.md`, `ICD.md`.** The "alternatives considered" content is the *source of truth* for what is on the table. Reuse those alternatives; do not invent a fresh shortlist. If `Tech_Stack_Rationale.md` is absent, fall back to the open choices in `Architecture_Description.md`; if that is missing, ask the user to name the decisions.
- **Phase 02 — `SysRS.md` (REQ-*), `Traceability_Matrix.md`, MOE/MOP set.** Decisions must link to the REQs / MOEs they serve, so the matrix weights are derived from real priorities, not taste. Fallback: ask which needs each decision affects and mark `REQ-TBD`.
- **Phase 01 — `OpsCon.md`, `Feasibility_Study.md`.** Operational scenarios and the feasibility horizon set the cost/scalability time-window (e.g. the 5-year TCO horizon).
- **Cross-cutting — `_cross_cutting/Risk_Opportunity_Register.md` (RSK-*).** Pull existing risks so "Risk" scores are grounded; push back any new risk this trade study surfaces.
- If a prior artifact is missing, proceed with what exists, mark the gap `TODO: <owed artifact>`, and never fabricate a number to fill it.

## Step-by-step
Interview-driven: ask **one topic at a time**, convert each answer into the deliverable, then move on. Reuse prior-phase facts; never re-ask what Phase 02/04 already settled. Use **AskUserQuestion** for finite choices.

1. **Confirm scope & output path.** Default output `<output-dir>/<slug>/Phase_05_Tradeoff/`. Confirm the project is software-heavy / hardware-dominated / hybrid (decides whether COCOMO runs later).
2. **Identify the 3–5 strategic decisions (topic 1).** Read Phase 04 alternatives first, then ask the user to confirm/rank the pivotal choices. If unsure, prompt: *"Where does the BoM, the lifetime operating cost, the scaling ceiling, or the lock-in risk hinge on a single choice?"* Typical clusters (domain-agnostic): hardware mix (sensor/processor/actuator family); comms protocol (e.g. MQTT vs gRPC, OCPP vs proprietary); hosting topology (cloud / on-prem / hybrid-edge); persistence (relational vs document vs distributed-SQL); framework/runtime; identity & payment approach. **Each decision gets a `DM-NN` (matrix) and a `DEC-NN` (register/ADR) — same two-digit sequence per Conventions §2.3.**
3. **Negotiate criteria + weights (topic 2).** Use the standard 6-criterion set below as the default; weights must sum to 100%. Tie each weight to a stakeholder priority / REQ so it is defensible.

   | Criterion | Default W | Definition (KB-anchored) | How its score is *derived* |
   |---|---|---|---|
   | **Cost** | 20% | TCO over the feasibility horizon (CapEx + OpEx + integration + lifecycle). | Cost analysis — 7 cost types; TCO/LCA, NPV/DCF for multi-year, CBA/ROI where a benefit exists; COCOMO/SEER for software effort (see KB 12). |
   | **Performance** | 20% | Latency, throughput, capacity, accuracy, energy. | Benchmarking, simulation/modelling, load & stress testing; latency-vs-throughput (KB 12). |
   | **Reliability** | 15% | Uptime, MTBF/MTTR, fault tolerance, offline/graceful degradation. | Availability target vs measured/SLA evidence. |
   | **Risk** | 15% | Security, compliance, vendor lock-in, supply chain, certification timing. | Pull from `RSK-*`; threat-model & supply-chain posture. |
   | **Scalability** | 15% | Headroom for growth in load/data/users. | Capacity planning, elasticity testing, bottleneck analysis; vertical vs horizontal (KB 12). |
   | **Maintainability** | 15% | Ease of update, repair, operability over life. | Modular-design assessment; change-impact surface. |

   Ask with **AskUserQuestion**: *"Use the default weights, or re-weight against your stakeholder priorities?"* If re-weighting, capture the new weights (sum = 100%) and **why** (which REQ/stakeholder drives each). Drop a criterion only with a recorded reason ("tailored out: <reason>").
4. **For each strategic decision, loop (one decision = one topic):**
   1. **Name the decision and 2–4 _same-level_ alternatives** (vendor-vs-vendor *or* build-vs-build — never mix abstraction levels). All alternatives must be *compatible*: same scope, with a quantifiable value available for every criterion (KB 13).
   2. **Score each alternative 1–10 per criterion** on the fixed **1–10 scale** (Conventions). Demand a one-line, *derivable* justification per cell ("why a 6 and not an 8?") citing the method that produced it (benchmark figure, vendor SLA, TCO line, capacity test). No 10 without verifiable evidence. Capture the justification inline as parenthetical text.
   3. **Compute weighted totals** = Σ(score × weight). Show the arithmetic; convert weights to decimals so totals land on a common scale.
   4. **Sensitivity analysis (mandatory, every decision):** for each criterion in turn, set its weight to **40%**, distribute the remaining **60%** equally across the others, recompute totals. Record whether the base-case winner **flips**. A winner that survives all re-weights is *robust*; one that flips is *sensitive* — say so explicitly.
   5. **Record the decision** + 2–3-sentence rationale referencing the REQ(s)/MOE(s) it satisfies and any residual risk (raise an `RSK-NN` if the choice introduces one).
5. **Write `Decision_Matrices.md`.** Common criteria + weights at the top, then one `DM-NN` section per decision (matrix → weighted totals → sensitivity block → decision narrative). See the deliverable skeleton below.
6. **Write `Decision_Register.md`** — the 5-column register (`DEC-NN`), each row an ADR stub linking back to its `DM-NN` and forward to the REQs. (`DEC-NN` *is* the ADR id per Conventions §2.3.)
7. **COCOMO estimate (conditional, topic N).** Ask with **AskUserQuestion**: *Skip (hardware-dominated) / Basic only / **Basic + Intermediate (recommended for software ≥ 10 KLOC)***. If running, gather size (KLOC, broken out per module), project type (Organic / Semi-Detached / Embedded — pick by the KB size bands, not by guess), and for Intermediate the 15 cost-driver ratings. **Compute every value from the constants — `E=a·KLOC^b`, `T=c·E^d`, `N=E/T` — never copy a number out of the worked example or this skill.** Write `COCOMO_Estimate.md` (assumptions, size breakdown, Basic, Intermediate w/ EAF, ±20% KLOC sensitivity, team-plan implication, modern complements).
8. **Check the exit gate** (checklist below). If any decision lacks a matrix, a sensitivity block, or a `DEC-NN`→REQ link, it is not done.
9. **Done.** Print all output paths and recommend the next phase: `se-phase-06-integration` (plan how the chosen parts come together via increments + CI/CD + HIL, gate **CDR**).

## Decision points
- **Which choices are "strategic" enough to merit a matrix?** Decision aid: a choice earns a `DM-NN` if reversing it later is expensive (BoM, contract, data migration, re-architecture) **or** it drives a top MOE/MOP. Trivial, easily-reversible choices go in the register as a one-liner without a full matrix.
- **Flat weights vs AHP?** If stakeholders can't agree on flat weights, use **AHP (Analytic Hierarchy Process)**: build the pairwise-comparison matrix of criteria (1=equal … 9=extreme), derive weights from the principal eigenvector, and **reject if the consistency ratio (CR) > 0.1** (inconsistent judgements). Record the AHP-derived weights and CR in the matrix header.
- **Weighted-sum vs TOPSIS?** If scores have outliers or you want a distance-to-ideal ranking, run **TOPSIS** (normalise the matrix, apply weights, find the ideal/anti-ideal points, rank by relative closeness) as a cross-check. If TOPSIS and the weighted sum disagree on the winner, that *is* a sensitivity finding — investigate before deciding rather than trusting either blindly.
- **Does a flip kill the decision?** No — a sensitive winner is still valid *if* the up-weight that flips it is implausible for this project. State the plausibility judgement; don't silently ignore the flip.
- **Run COCOMO or not?** Software ≥ ~10 KLOC → yes (Basic + Intermediate). Hardware-only → skip with a recorded reason. Hybrid → COCOMO the software scope only.

## Rules
- **Conform to [`../../05_Conventions.md`](../../05_Conventions.md)** for every ID (`DM-NN`, `DEC-NN`, `REQ-*`, `RSK-NN`), the gate ladder, the 1–10 scale, and S1–S4 severity. Cross-reference shared conventions; never restate or drift them.
- **One topic at a time.** Decisions → criteria/weights → each matrix → COCOMO. Never dump a wall of questions.
- **Never copy the worked example's numbers.** COCOMO and sensitivity values are *recomputed* from this project's constants and weights. The earlier worked example had miscalculated COCOMO `T`/`N` and three wrong sensitivity blocks — treat every printed number as illustrative method, not data.
- **Scores must be derivable, not asserted.** Each cell cites the KB method that produced it. A matrix of bare numbers is theatre.
- **Compare at one level of detail.** Same scope, quantifiable in every cell, no vendor-vs-DIY mixing.
- **Sensitivity is not optional.** A matrix without a sensitivity block has not cleared the gate.
- **Push risks/opportunities back to the Risk thread.** A choice that adds lock-in or supply risk creates an `RSK-NN`; a cheaper-than-expected path is an `OPP-NN`.
</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../templates/) (`Decision_Matrices.md`, `Decision_Register.md`, `COCOMO_Estimate.md`). All carry the standard frontmatter from Conventions §6.

### 1. `Decision_Matrices.md` — one `DM-NN` per decision
```markdown
## Criteria & weights (this trade study)
| Criterion | Weight | Tied to |
|---|---|---|
| Cost | 20% | REQ-C-01, stakeholder STK-03 |
| Performance | 20% | MOP-02 | …Scalability / Maintainability / Reliability / Risk…

## DM-01 — <Decision name>   (→ DEC-01)
| Criterion (W) | <Alt A> | <Alt B> | <Alt C> |
|---|---|---|---|
| Cost (20%)          | 7 (5-yr TCO $X, NPV @8%) | 5 (…) | 6 (…) |
| Performance (20%)   | 8 (bench: 1.2k tps)      | 6 (…) | 7 (…) |
| Reliability (15%)   | … | … | … |
| Risk (15%)          | … (see RSK-04) | … | … |
| Scalability (15%)   | … (elasticity test) | … | … |
| Maintainability (15%)| … | … | … |
| **Weighted total**  | **<Σ>** | **<Σ>** | **<Σ>** |

**Sensitivity (each criterion → 40%, rest split 60% equally):**
- Cost@40% → winner = <X> (A=…, B=…, C=…) — no flip
- Risk@40% → winner = <Y> — **FLIP** (plausible? <judgement>)
- …one line per criterion…

**Decision:** **<choice>** — <2–3 sentences citing REQ-*/MOE-*; note residual RSK-NN/OPP-NN>.
```

### 2. `Decision_Register.md` — 5 columns (ADR-linked)
| DEC-NN | Decision (→ DM-NN) | Choice | Sensitivity-robust? | Linked REQs / RSK |
|---|---|---|---|---|
| DEC-01 | Hosting topology (DM-01) | Hybrid edge-cloud | Yes | REQ-O-04, REQ-P-02 |
| DEC-02 | Comms protocol (DM-02) | gRPC | Flips if Risk→40% (implausible) | REQ-INT-01, RSK-07 |

Each row is the head of an **ADR**: Context → Decision → Status (`Proposed/Accepted/Superseded`) → Consequences. Keep the prose ADR body either inline under the register or as `adr/DEC-NN-*.md`.

### 3. `COCOMO_Estimate.md` (conditional)
Sections: assumptions & size basis · per-module KLOC breakdown · **Basic** (E, T, N — formulas shown) · **Intermediate** (15 driver ratings, EAF, E_int) · sensitivity (±20% KLOC) · team-plan implication & critical path · modern complements.

**Basic constants (KB-verified — recompute, don't copy):**

| Project type | a | b | c | d | KLOC band |
|---|---|---|---|---|---|
| Organic | 2.4 | 1.05 | 2.5 | 0.38 | 2–50 |
| Semi-Detached | 3.0 | 1.12 | 2.5 | 0.35 | 50–300 |
| Embedded | 3.6 | 1.20 | 2.5 | 0.32 | 300+ |

`E = a·KLOC^b` (person-months) · `T = c·E^d` (months) · `N = E/T`.

**Intermediate — 15 cost drivers → EAF (product of selected ratings):** `E_int = EAF · a·KLOC^b`.

| Category | Driver | V.Low | Low | Nom | High | V.High | X.High |
|---|---|---|---|---|---|---|---|
| Product | RELY required reliability | 0.75 | 0.88 | 1.00 | 1.15 | 1.40 | — |
| | DATA database size | — | 0.94 | 1.00 | 1.08 | 1.16 | — |
| | CPLX product complexity | 0.70 | 0.85 | 1.00 | 1.15 | 1.30 | 1.65 |
| Hardware | TIME exec-time constraint | — | — | 1.00 | 1.11 | 1.30 | 1.66 |
| | STOR storage constraint | — | — | 1.00 | 1.06 | 1.21 | 1.56 |
| | VIRT VM volatility | — | 0.87 | 1.00 | 1.15 | 1.30 | — |
| | TURN turnaround time | — | 0.87 | 1.00 | 1.07 | 1.15 | — |
| Personnel | ACAP analyst capability | 1.46 | 1.19 | 1.00 | 0.86 | 0.71 | — |
| | AEXP applications exp. | 1.29 | 1.13 | 1.00 | 0.91 | 0.82 | — |
| | PCAP programmer capability | 1.42 | 1.17 | 1.00 | 0.86 | 0.70 | — |
| | VEXP VM experience | 1.21 | 1.10 | 1.00 | 0.90 | — | — |
| | LEXP language experience | 1.14 | 1.07 | 1.00 | 0.95 | — | — |
| Project | MODP modern practices | 1.24 | 1.10 | 1.00 | 0.91 | 0.82 | — |
| | TOOL software tools | 1.24 | 1.10 | 1.00 | 0.91 | 0.83 | — |
| | SCED required schedule | 1.23 | 1.08 | 1.00 | 1.04 | 1.10 | — |

> **Worked illustration (method only — your numbers WILL differ):** Organic, 30 KLOC → `E = 2.4·30^1.05 ≈ 85.4 PM`; `T = 2.5·85.4^0.38 ≈ 13.6 mo`; `N = 85.4/13.6 ≈ 6.3 → 7 engineers`. Re-run on *your* KLOC. (The previous worked example reported `T`/`N` that did not satisfy `T=c·E^d` / `N=E/T` — always back-check that your three numbers are self-consistent.)

**Modern complements** (note in the rationale): COCOMO II (17 multipliers + 5 scale factors, agile-friendly); story-points + velocity; Monte-Carlo schedule simulation to wrap the point estimate in a probability band.

## AI prompt pack
- **ELICITATION —** "From `Phase_04/Tech_Stack_Rationale.md`, list every 'alternative considered'. Cluster them into the 3–5 decisions whose reversal would be most expensive (BoM, contract, migration, re-architecture). For each, name 2–4 *same-level* alternatives and the REQ/MOE it serves. Ask me to confirm before scoring."
- **GENERATION —** "Build `DM-01` for <decision> across Cost/Performance/Reliability/Risk/Scalability/Maintainability at weights <…>. Score each alternative 1–10 with a one-line justification citing the measurement method (benchmark, TCO line, SLA, capacity test). Compute weighted totals, then run sensitivity by setting each criterion to 40% (rest split 60%). Output the matrix + sensitivity block + decision narrative."
- **CRITIQUE / RED-TEAM —** "Challenge this trade study: (1) are any alternatives at mismatched abstraction levels? (2) which scores are *asserted* rather than derived from a method? (3) recompute every weighted total and every 40% sensitivity case independently and flag arithmetic errors. (4) does any decision flip under a *plausible* re-weight that I dismissed? (5) is a cheap criterion silently dominating?"
- **COCOMO CHECK —** "Given type=<…>, KLOC=<…>, recompute E=a·KLOC^b, T=c·E^d, N=E/T from the constants. Verify T=c·E^d and N=E/T hold for the printed E,T,N (catch copy-paste/garble errors). Then give ±20% KLOC sensitivity and the resulting critical path."
- **AHP WEIGHTS —** "I can't agree on flat weights for <criteria>. Run a pairwise AHP: ask me each pairwise importance, derive normalized weights, and report the consistency ratio (reject if > 0.1)."

## Research & specialised-agent triggers
- **Web research when:** you need current vendor pricing/SLAs/benchmarks to derive Cost/Performance/Reliability scores; a domain regulation gates an alternative (UL/IEC/DO/ISO/PCI — see Conventions §9 domain row); comparable-system trade studies exist for analogy-based calibration; or COCOMO needs calibration data (Boehm's bands are generic — prefer your org's historical actuals).
- **Spawn a specialised agent when:** a **cost-modelling/FinOps agent** for multi-year TCO/NPV across many SKUs; a **benchmarking/load-test agent** to produce real performance numbers instead of guessed scores; a **security/threat-model agent** to ground the Risk column (STRIDE, supply-chain/SBOM); a **reliability agent** for MTBF/availability allocation when Reliability is heavily weighted. Use agents to *produce the evidence behind a score*, not to invent the score.

## Cross-cutting hooks
This phase is the home of 15288 **Decision Management** and is the busiest consumer/producer of the cross-cutting threads:
- **Risk & Opportunity** — *consumes* `RSK-*` to score the Risk criterion; *produces* new `RSK-NN`/`OPP-NN` when a choice adds lock-in/supply risk or a saving. → [`../../cross-cutting/Risk_and_Opportunity_Management.md`](../../cross-cutting/Risk_and_Opportunity_Management.md)
- **Cost/Schedule/EVM** — *produces* the TCO/NPV figures and the COCOMO effort/schedule that feed the WBS and budget. → [`../../cross-cutting/Cost_Schedule_EVM.md`](../../cross-cutting/Cost_Schedule_EVM.md)
- **Measurement (MOE/MOP/TPM)** — *consumes* MOPs as Performance/Scalability evidence; a chosen alternative may set a `TPM` margin to track in 06–10. → [`../../cross-cutting/Measurement_MOE_MOP_TPM.md`](../../cross-cutting/Measurement_MOE_MOP_TPM.md)
- **Security** — *consumes* the threat model for the Risk column. → [`../../cross-cutting/Security_Engineering.md`](../../cross-cutting/Security_Engineering.md)
- **Safety/RAMS** — Reliability scores reuse hazard/availability allocations. → [`../../cross-cutting/Safety_RAMS_Engineering.md`](../../cross-cutting/Safety_RAMS_Engineering.md)
- **Configuration Mgmt** — `DM-NN`/`DEC-NN` are baselined at **PDR/CDR**; a change to a baselined decision goes through a `CR-NN` (Stage 09). → [`../../cross-cutting/Configuration_Management.md`](../../cross-cutting/Configuration_Management.md)
- **Quality** — the derivable-score rule is the QA check that the trade study is evidence-based. → [`../../cross-cutting/Quality_Assurance.md`](../../cross-cutting/Quality_Assurance.md)

## Standards anchor
Realises **ISO/IEC/IEEE 15288:2023 — Decision Management** (Technical Management) plus **System Analysis** (Conventions §9; Overview §3). Trade-study and decision-matrix practice follows the **INCOSE SE Handbook v5 (2023)** trade-study method and **NASA/SP-2016-6105 Rev 2** (trade studies, AoA). Cost methods (TCO/LCA/NPV/CBA/ROI/COCOMO) and performance/scalability methods are the KB 12 taxonomy; the weighted-scoring procedure is KB 13. AHP/TOPSIS are recognised MCDA alternatives to the weighted sum. Where a decision touches a regulated domain, cite the domain standard from Conventions §9 (DO-178C / ISO 26262 / IEC 62304 / IEC 61508 / PCI).

## Exit-gate checklist
Gate: **Decisions traced** (per Conventions §1).
- [ ] 3–5 strategic decisions identified, each from Phase-04 alternatives (or a recorded reason if not).
- [ ] Every decision has a `DM-NN` matrix with 2–4 *same-level*, compatible alternatives.
- [ ] Criteria include **Cost, Performance, Reliability, Risk, Scalability, Maintainability** (drops recorded as "tailored out: <reason>"); weights sum to 100% and each ties to a REQ/stakeholder.
- [ ] Every cell scored 1–10 with a *derivable* justification (method named).
- [ ] **Sensitivity analysis present for every decision** (each criterion → 40%), flips flagged with a plausibility judgement.
- [ ] `Decision_Register.md` is 5-column, uses `DEC-NN`, links each decision to ≥ 1 REQ, and each row is an ADR stub.
- [ ] COCOMO produced for software ≥ ~10 KLOC (recomputed, self-consistent `T=c·E^d`, `N=E/T`) **or** explicitly skipped with reason.
- [ ] No score, total, or COCOMO number copied from the worked example; all recomputed for this project.
- [ ] New risks/opportunities pushed to the Risk register.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| All alternatives tie. | Flat weights or uniform scores. | Sharpen score gaps ("which is a 3, which an 8?"); re-derive weights from priorities/AHP. |
| Winner flips under sensitivity, unaddressed. | Sensitivity skipped or ignored. | Run all 40% re-weights; flag flips with a plausibility judgement — don't bury them. |
| Scores have no justification. | Asserted, not derived. | Tie each cell to a KB method (benchmark/TCO/SLA/capacity test); no 10 without evidence. |
| Alternatives at mismatched levels. | Vendor pitted against DIY. | Pick one level; run a second matrix for the other tier if needed. |
| COCOMO `T`/`N` don't satisfy `T=c·E^d`/`N=E/T`. | Numbers copied/garbled, exponent dropped. | Recompute from constants; back-check the identity holds. |
| Cost criterion silently dominates. | Upfront price used instead of TCO; over-weighted. | Use TCO/NPV over the horizon; sanity-check weight against stakeholder priority. |
| Register & matrices drift (IDs/scale/columns). | Re-stating conventions locally. | Use `DM-NN`/`DEC-NN`, 1–10 scale, 5-col register per Conventions §2.3 — cite, don't restate. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (`DM-NN`/`DEC-NN`), gates, 1–10 scale, severity, standard citations.
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — V-model placement (left side, before build), 15288 Decision Management mapping.
- KB [`12-design-tradeoffs/fundamentals.md`](../../../Systems-Engineering-KB/topics/12-design-tradeoffs/fundamentals.md) — 7 cost types, TCO/LCA/NPV/CBA/ROI, COCOMO, performance & scalability methods.
- KB [`13-decision-matrix/fundamentals.md`](../../../Systems-Engineering-KB/topics/13-decision-matrix/fundamentals.md) — weighted scoring steps, criteria categories, sensitivity.
- [`../../worked_example/Phase_05_Tradeoff/`](../../worked_example/Phase_05_Tradeoff/) — fully worked trade study + Decision Register + COCOMO (numbers **corrected** per the audit; verify before reuse).
- Related phases: [`se-phase-04-architecture`](../se-phase-04-architecture/SKILL.md) (supplies alternatives), [`se-phase-06-integration`](../se-phase-06-integration/SKILL.md) (next), [`se-phase-09-change-config`](../se-phase-09-change-config/SKILL.md) (re-baselines a decision via `CR-NN`).

</supporting-info>
