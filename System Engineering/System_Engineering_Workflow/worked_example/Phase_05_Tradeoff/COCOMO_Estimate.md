# COCOMO Effort Estimate — EVCN

Sizing the software components of EVCN using **Boehm's Constructive Cost Model** (Basic and Intermediate forms).

---

## 1. Component Sizing (KLOC)

| Component | KLOC | Mode | Rationale |
|---|---|---|---|
| Station Controller (Rust + C) | 60 | **Embedded** | Real-time, hardware-coupled, safety-critical (UL 2594). |
| OCPP / ISO 15118 stacks (Rust) | 40 | **Embedded** | Strict standards conformance; latency budgets. |
| CSMS + Session + Billing services (Go) | 80 | **Semi-Detached** | Distributed system; integrates with payment, OCPI, IAM. |
| DR Orchestrator + Tariff Engine (Go) | 25 | **Semi-Detached** | Domain-specific; integrates with utility VTN. |
| Operator Dashboard (React) | 35 | **Organic** | Standard SPA, well-understood. |
| Driver Mobile App (Flutter) | 45 | **Organic** | Standard mobile patterns. |
| Web Portal (React) | 20 | **Organic** | CRUD-style. |
| **Total** | **305 KLOC** | | |

---

## 2. Basic COCOMO — Per Mode

`E = a × KLOC^b`,  `T = c × E^d`

All values below are computed directly from the constants — `E = a × KLOC^b`, `T = c × E^d`, `N = E / T` — and verified. *(The earlier draft of this table had every T and N wrong; recompute from the formulas, never copy.)*

| Mode | KLOC | a | b | c | d | E (PM) | T (mo) | N (eng) |
|---|---|---|---|---|---|---|---|---|
| Embedded | 100 | 3.6 | 1.20 | 2.5 | 0.32 | 904 | 22.1 | 41 |
| Semi-Detached | 105 | 3.0 | 1.12 | 2.5 | 0.35 | 551 | 22.8 | 24 |
| Organic | 100 | 2.4 | 1.05 | 2.5 | 0.38 | 302 | 21.9 | 14 |

**Aggregate (sum of effort, max of duration):**
- Total effort: **≈ 1,757 person-months** (gross)
- Critical-path duration: **≈ 22.8 months** — the **Semi-Detached** branch drives the schedule (longest T), not Embedded.
- Team if fully parallel: **≈ 77 engineers** (1,757 ÷ 22.8) (gross)

> Gross numbers are intentionally pessimistic for Basic COCOMO. Real planning uses Intermediate with cost drivers (below).

---

## 3. Intermediate COCOMO — Effort Adjustment Factor (EAF)

15 cost drivers rated Very Low → Extra High; effort multiplier per row.

| Driver | Rating | Multiplier |
|---|---|---|
| **Product attributes** | | |
| Required reliability (RELY) | Very High (UL/IEC) | 1.40 |
| Database size (DATA) | High | 1.08 |
| Product complexity (CPLX) | Very High (RT + PE) | 1.30 |
| **Hardware attributes** | | |
| Execution time constraint (TIME) | High | 1.11 |
| Main storage constraint (STOR) | Nominal | 1.00 |
| Virtual machine volatility (VIRT) | Low | 0.87 |
| Computer turnaround (TURN) | Nominal | 1.00 |
| **Personnel attributes** | | |
| Analyst capability (ACAP) | High | 0.86 |
| Applications experience (AEXP) | High | 0.91 |
| Programmer capability (PCAP) | High | 0.86 |
| Virtual machine experience (VEXP) | Nominal | 1.00 |
| Language experience (LEXP) | Nominal | 1.00 |
| **Project attributes** | | |
| Modern programming practices (MODP) | High | 0.91 |
| Software tools (TOOL) | High | 0.91 |
| Required schedule (SCED) | Nominal | 1.00 |
| **EAF (product of the 15 multipliers above)** | | **≈ 1.06** |

> **The EAF is greater than 1.0** — the safety-critical drivers (required reliability 1.40, product complexity 1.30, time constraint 1.11) dominate and push effort *up*, only partly offset by the strong team (ACAP/PCAP 0.86) and modern tooling (MODP/TOOL 0.91). The earlier "≈0.78 compresses effort" claim was an arithmetic error; the listed multipliers multiply to ≈1.06. *Lesson: a Very-High-reliability system does not get cheaper because the team is good — verify the EAF, don't assume it shrinks.*

**Adjusted effort:**
- E_adj = 1,757 × 1.06 ≈ **1,859 person-months**
- T_adj ≈ 23.2 months (Semi-Detached driving branch, EAF applied: E_adj ≈ 583 PM → T = 2.5 × 583^0.35)
- Sustained team ≈ 1,859 / 23.2 ≈ **80 engineers**

---

## 4. Cross-Check Against Plan

The Project Development Plan headcount is **25 engineers** sustained over 12 months → **300 person-months** capacity. Adjusted COCOMO is **≈ 1,859 PM**, so the full-scope plan is short by **≈ 6×**.

**Reconciliation:**

| Lever | Effect |
|---|---|
| Reuse of OCA OCPP, switch-ev/v2g, Stripe Terminal SDK, Keycloak | Drops new-code KLOC by ~30% → ≈ 215 KLOC |
| Outsourced Power Electronics firmware via SiC vendor | Removes ~25 KLOC of internal scope |
| MVP scope cut: PnC v2 / V2G deferred to v1.1 | Removes ~15 KLOC |
| **Re-estimated new-code KLOC** | **≈ 175 KLOC** |
| Re-applied EAF (≈1.06) | E_adj ≈ **982 PM**, critical path ≈ **18.7 mo**, ≈ **53 eng** if fully parallel |

**Conclusion:** Even with aggressive reuse and MVP scoping, the reduced estimate (≈ 982 PM) is **still ~3.3× the 300 PM plan capacity** — the 25-engineer / 12-month plan is **not sufficient as stated**. The honest options are: (a) extend the schedule, (b) grow the team toward ~50 sustained engineers, and/or (c) cut deeper into v1 scope. Risk register R-02 (supply chain) and R-05 (PnC cert) compound the schedule risk. *This is exactly the kind of estimate a Phase-05 trade-off should surface before PDR, not after — the earlier "achievable but tight" read came from the arithmetic errors corrected above.*

---

## 5. Modern Complement — Story Points

For Agile tracks (cloud, mobile, dashboard), team uses **story points + velocity** rather than KLOC for sprint planning. COCOMO is used at portfolio level only; sprint commitments come from velocity charts in Jira.

> Reference: Boehm, *Software Engineering Economics* (1981); Boehm et al., *Software Cost Estimation with COCOMO II* (2000).
