---
Document: <Project> Decision Matrices
Document ID: DM-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Decision Management); INCOSE SE Handbook v5 (2023) trade-study method
Status: Draft
Owner: <Lead Systems Engineer>
---

<!--
HOW TO USE THIS TEMPLATE
- This is the Phase 05 (Trade-off & Decision) weighted decision-matrix set. One `DM-NN` per strategic
  decision (same two-digit sequence as its `DEC-NN` in Decision_Register.md — Conventions §2.3).
- Pull alternatives from Phase 04 `Tech_Stack_Rationale.md` / `Architecture_Description.md`
  ("alternatives considered" + DEC-TBD seeds). Do NOT invent a fresh shortlist.
- Compare 2–4 SAME-LEVEL alternatives (vendor-vs-vendor OR build-vs-build — never mix levels); each
  must be quantifiable on every criterion.
- Score 1–10 with a DERIVABLE one-line justification per cell ("why a 6 and not an 8?") citing the
  method that produced it (benchmark figure, vendor SLA, TCO line, capacity test). No 10 without
  verifiable evidence. A matrix of bare numbers is theatre.
- SENSITIVITY IS MANDATORY for every decision: set each criterion to 40% in turn, split the other 60%
  equally, recompute, and record whether the winner FLIPS.
- RECOMPUTE every weighted total yourself — Weighted total = Σ(score × weight as decimal). NEVER copy
  a number from the worked example.
- All IDs (DM-NN, DEC-NN, REQ-*, RSK-NN), the 1–10 scale, gates, and citations come from
  ../05_Conventions.md — cite, do not redefine.
-->

# <Project> — Decision Matrices (Trade-off Analysis)

## Criteria & weights (this trade study)

> Default 6-criterion set below; weights must sum to 100%. Tie each weight to a stakeholder priority / REQ so it is defensible. Drop a criterion only with a recorded reason ("tailored out: <reason>"). If stakeholders can't agree on flat weights, use AHP (record the derived weights and the consistency ratio; reject if CR > 0.1).

| Criterion | Weight | Tied to (REQ / stakeholder / MOE) |
|---|---|---|
| Cost | <20%> | <REQ-C-NN, STK-NN — TCO over the feasibility horizon> |
| Performance | <20%> | <MOP-NN — latency/throughput/capacity/accuracy/energy> |
| Reliability | <15%> | <REQ-O-NN — uptime/MTBF/fault tolerance/offline> |
| Risk | <15%> | <RSK-NN — security/compliance/lock-in/supply chain> |
| Scalability | <15%> | <REQ-P-NN — headroom for load/data/users> |
| Maintainability | <15%> | <ease of update/repair/operability> |
| **Total** | **100%** | — |

> Weighting method: <flat / AHP (CR = <value>)>. Sensitivity convention: each criterion → 40%, remaining 60% split equally across the others.

---

## DM-01 — <Decision name>  (→ DEC-01)

> Alternatives (2–4, same level): <Alt A>, <Alt B>, <Alt C>. Source: Phase 04 `<artifact>`. REQ/MOE served: <REQ-NN>.

| Criterion (W) | <Alt A> | <Alt B> | <Alt C> |
|---|---|---|---|
| Cost (<20%>)           | <s> (<TCO/NPV basis>) | <s> (<…>) | <s> (<…>) |
| Performance (<20%>)    | <s> (<benchmark figure>) | <s> (<…>) | <s> (<…>) |
| Reliability (<15%>)    | <s> (<SLA/availability>) | <s> (<…>) | <s> (<…>) |
| Risk (<15%>)           | <s> (<see RSK-NN>) | <s> (<…>) | <s> (<…>) |
| Scalability (<15%>)    | <s> (<capacity/elasticity test>) | <s> (<…>) | <s> (<…>) |
| Maintainability (<15%>)| <s> (<change-impact surface>) | <s> (<…>) | <s> (<…>) |
| **Weighted total**     | **<Σ>** | **<Σ>** | **<Σ>** |

**Sensitivity** (each criterion → 40%, rest split 60% equally — recompute, do not copy):
- Cost@40% → winner = <X> (A=<…>, B=<…>, C=<…>) — <no flip / **FLIP**>
- Performance@40% → winner = <…> — <no flip / **FLIP** (plausible? <judgement>)>
- Reliability@40% → winner = <…> — <…>
- Risk@40% → winner = <…> — <…>
- Scalability@40% → winner = <…> — <…>
- Maintainability@40% → winner = <…> — <…>

**Decision:** **<choice>** — <2–3 sentences citing the REQ-*/MOE-* it satisfies and any residual risk; raise an `RSK-NN`/`OPP-NN` if the choice introduces one. State whether the winner is sensitivity-**robust** or **sensitive** (and if sensitive, why the flipping re-weight is/ isn't plausible).>

---

## DM-02 — Comms protocol (example — delete this whole worked block)

> Alternatives: Protocol A (open standard), Protocol B (older standard), Proprietary REST. *(Illustrative shapes; scores below are NOT data — delete and write your own.)*

| Criterion (W) | Protocol A | Protocol B | Proprietary |
|---|---|---|---|
| Cost (20%)            | 7 (open-source stack, no licence) | 8 (mature, free) | 5 (build + maintain in-house) |
| Performance (20%)     | 8 (persistent socket, low overhead) | 7 (older, less efficient) | 7 (HTTP polling default) |
| Reliability (15%)     | 8 (conformance-tested) | 9 (battle-tested at scale) | 5 (no peer review) |
| Risk (15%)            | 9 (industry standard, future-proof) | 5 (deprecation path) | 3 (lock-in, no interop) |
| Scalability (15%)     | 8 (horizontal-friendly) | 7 | 6 |
| Maintainability (15%) | 8 (community + docs) | 7 | 5 (bus factor) |
| **Weighted total**    | **7.95** | **7.20** | **5.20** |

> The totals above are illustrative arithmetic only — recompute Σ(score × weight) for your own scores; never reuse these.

**Sensitivity** (example — delete):
- Risk@40% → Protocol A dominant (no flip).
- Cost@40% → Protocol A still leads; Protocol B closes the gap but loses on long-term risk.

**Decision (example — delete):** **Protocol A** — required for interop/roaming (REQ-INT-01); proprietary REST would orphan the system from partners. Robust across all re-weights.

---

## DM-NN — <Decision name>  (→ DEC-NN)

> Copy the `DM-01` block above for each remaining strategic decision (aim for 3–5 total).

---

## Summary

| DM-ID | Decision | Recommended choice | Sensitivity-robust? | Linked REQ |
|---|---|---|---|---|
| DM-01 | <decision> | <choice> | <Yes / Flips if … (plausible?)> | <REQ-NN> |
| DM-NN | <decision> | <choice> | <…> | <REQ-NN> |

> Each decision is carried forward to `Decision_Register.md` as a `DEC-NN` row and traced back into `SysRS.md` by REQ ID. Any future revisit goes through change management (`Phase_09_Change_Config/`).

---

### Exit-gate self-check (gate: "Decisions traced" — delete once green)

- [ ] 3–5 strategic decisions, each sourced from Phase 04 alternatives (or a recorded reason).
- [ ] Each decision has a `DM-NN` matrix with 2–4 *same-level*, compatible alternatives.
- [ ] Criteria include Cost, Performance, Reliability, Risk, Scalability, Maintainability (drops recorded as "tailored out: <reason>"); weights sum to 100% and each ties to a REQ/stakeholder.
- [ ] Every cell scored 1–10 with a *derivable* justification (method named); no 10 without evidence.
- [ ] Sensitivity block present for every decision; flips flagged with a plausibility judgement.
- [ ] Every weighted total recomputed — none copied from the worked example.
- [ ] New risks/opportunities pushed to the Risk register (`RSK-NN` / `OPP-NN`).
