# Decision Matrices — EVCN Trade-off Analysis

Five strategic decisions evaluated against a uniform criteria set. All matrices use weighted scoring (1–10 scale), and each is followed by a brief sensitivity discussion. *(All weighted totals and sensitivity figures below were recomputed and verified; no sensitivity re-weighting flips a base-case decision.)*

**Common criteria & weights** (negotiated with stakeholders at PDR):

| Criterion | Weight | Definition |
|---|---|---|
| Cost | 25% | TCO over 7 years (CapEx + OpEx). |
| Performance | 25% | Latency, throughput, charging-rate capability. |
| Reliability | 25% | Uptime, fault tolerance, offline operation. |
| Risk | 25% | Security, compliance, vendor lock-in, supply chain. |

> Sensitivity is checked by re-weighting each criterion to 40% (others equalized at 20%).

---

## 5.1 Charger Type Mix (the most strategic — drives the entire BoM)

| Criterion (W) | Level 2 Only (7–22 kW) | DCFC Only (50–350 kW) | Mixed (L2 + DCFC) |
|---|---|---|---|
| Cost (25%) | 9 (low CapEx, ~$3k/unit) | 4 (DCFC ~$50k/unit) | 6 |
| Performance (25%) | 4 (slow, dwell-time only) | 9 (highway-grade) | 9 |
| Reliability (25%) | 9 (simple BOM, fewer faults) | 6 (complex SiC, cooling) | 7 |
| Risk (25%) | 9 (mature standards) | 6 (CCS/NACS uncertainty) | 7 |
| **Weighted Total** | **7.75** | **6.25** | **7.25** |

**Constraint veto:** L2 scores highest on raw points (7.75) but is **eliminated by a mission constraint** — the network must serve *both* highway (REQ-P-01) and dwell-time (REQ-P-02) use cases, which L2-only cannot. The real trade is therefore DCFC (6.25) vs Mixed (7.25) → **Mixed**. *(A decision matrix never overrides a hard must-have; the score ranks only the feasible alternatives.)*

**Sensitivity** (each criterion re-weighted to 40%, others 20%):
- Performance @40% → Mixed leads (7.6 vs DCFC 6.8; L2 7.0 but constraint-vetoed).
- Cost @40% → L2 leads on cost alone (8.0), but among feasible options Mixed (7.0) still beats DCFC (5.8).

**Decision:** **Mixed** — L2 for destination/dwell sites (offices, hotels), DCFC for highway corridors. Pure L2 would violate the mission; pure DCFC overshoots and triples cost.

---

## 5.2 Station ↔ Backend Communication Protocol

| Criterion (W) | OCPP 2.0.1 (WSS) | OCPP 1.6J | Proprietary REST |
|---|---|---|---|
| Cost (25%) | 7 (open source stacks available) | 8 (very mature, free) | 5 (build + maintain in-house) |
| Performance (25%) | 8 (WebSocket persistent, low overhead) | 7 (older spec, less efficient) | 7 (HTTP polling default) |
| Reliability (25%) | 8 (well-tested, OCA conformance) | 9 (battle-tested at scale) | 5 (no peer review) |
| Risk (25%) | 9 (industry standard, future-proof, ISO 15118 native) | 5 (will be deprecated) | 3 (lock-in, no roaming) |
| **Weighted Total** | **8.00** | **7.25** | **5.00** |

**Sensitivity** (each criterion re-weighted to 40%, others 20%):
- Risk @40% → 2.0.1 dominant (8.2 vs 1.6J 6.8 vs REST 4.6).
- Cost @40% → 2.0.1 still leads (7.8 vs 1.6J 7.4); 1.6J closes the gap on cost but loses on long-term risk and roaming.

**Decision:** **OCPP 2.0.1** — required for ISO 15118 PnC support and OCPI 2.2.1 roaming. Industry direction is unambiguous; building proprietary REST would orphan the network from roaming partners.

---

## 5.3 Backend Hosting (Cloud, On-Prem, or Hybrid Edge-Cloud)

| Criterion (W) | Public Cloud (AWS) | On-Prem Data Center | Hybrid (Cloud + Edge) |
|---|---|---|---|
| Cost (25%) | 7 (OpEx, scales with usage) | 4 (high CapEx, idle capacity) | 6 (cloud OpEx + edge CapEx) |
| Performance (25%) | 7 (WAN latency from station) | 6 (regional only) | 9 (edge handles real-time) |
| Reliability (25%) | 8 (multi-AZ, 99.95% SLA) | 6 (single site risk) | 9 (offline-capable per REQ-O-04) |
| Risk (25%) | 6 (vendor lock-in, data residency) | 8 (full control, regulated) | 7 (moderate complexity) |
| **Weighted Total** | **7.00** | **6.00** | **7.75** |

**Sensitivity** (each criterion re-weighted to 40%, others 20%):
- Reliability @40% → Hybrid widens its lead (8.0 vs Cloud 7.2 vs On-Prem 6.0).
- Cost @40% → Hybrid still leads (7.4 vs Cloud 7.0); the gap narrows but does not flip.

**Decision:** **Hybrid** — Station Controller is the local-first edge that can charge offline (REQ-O-04). Cloud handles billing, fleet ops, OCPP coordination. (This local-first edge+cloud pattern mirrors the Smart Home Security System reference example in `../reference/Comprehensive_Guide.md` §10.)

---

## 5.4 Mobile Framework

| Criterion (W) | Native (Swift + Kotlin) | Flutter | React Native |
|---|---|---|---|
| Cost (25%) | 4 (two teams) | 9 (single codebase) | 8 (single codebase + JS pool) |
| Performance (25%) | 10 (best-in-class) | 8 (Skia/Impeller, ~60fps) | 7 (bridge overhead) |
| Reliability (25%) | 9 (platform parity guaranteed) | 8 (some native quirks) | 7 (native modules drift) |
| Risk (25%) | 6 (resourcing) | 8 (Google-backed, growing) | 7 (Meta-backed, churn) |
| **Weighted Total** | **7.25** | **8.25** | **7.25** |

**Sensitivity** (each criterion re-weighted to 40%, others 20%):
- Cost @40% → Flutter widens its lead (8.4 vs RN 7.4 vs Native 6.6).
- Performance @40% → Flutter still leads (8.2 vs Native 7.8); Native closes on raw performance but stays behind on total.

**Decision:** **Flutter** — best balance for our team size; native is too expensive at this stage; React Native loses on bridge performance for live session updates.

---

## 5.5 Payment Approach

| Criterion (W) | Bring-Your-Own (custom EMV) | Stripe Terminal (P2PE) | Adyen Tap to Pay |
|---|---|---|---|
| Cost (25%) | 3 (PCI-DSS Level 1 audit cost) | 8 (managed PCI scope) | 7 (managed, slightly higher fee) |
| Performance (25%) | 7 | 8 | 8 |
| Reliability (25%) | 6 (we own the bug) | 9 (vendor SLA) | 9 |
| Risk (25%) | 3 (full PCI exposure, breach risk) | 9 (P2PE keeps cardholder data out of scope) | 8 |
| **Weighted Total** | **4.75** | **8.50** | **8.00** |

**Sensitivity** (each criterion re-weighted to 40%, others 20%):
- Risk @40% → Stripe leads (8.6 vs Adyen 8.0 vs BYO 4.4).
- Cost @40% → Stripe leads (8.4 vs Adyen 7.8). Decision is robust across all re-weightings.

**Decision:** **Stripe Terminal (P2PE)** — cuts PCI-DSS scope to SAQ P2PE (vs SAQ-D for custom), eliminates a major class of breach risk (REQ-SEC-03), and delivers fastest time to certification.

---

## 5.6 Summary Decision Register

| ID | Decision | Choice | Linked REQ |
|---|---|---|---|
| DM-01 | Charger type mix | L2 + DCFC | REQ-P-01, REQ-P-02 |
| DM-02 | OCPP version | 2.0.1 | REQ-F-06, REQ-INT-01 |
| DM-03 | Hosting | Hybrid edge + cloud | REQ-O-04 (offline charging) |
| DM-04 | Mobile framework | Flutter | REQ-U-04 |
| DM-05 | Payment | Stripe Terminal P2PE | REQ-SEC-03, REQ-F-07 |

Each decision is linked back into the SysRS by REQ ID and is in scope for change-management review on any future revisit (`Phase_09_Change_Config/`).
