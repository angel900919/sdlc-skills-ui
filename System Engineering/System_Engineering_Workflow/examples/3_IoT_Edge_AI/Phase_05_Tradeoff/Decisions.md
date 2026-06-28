---
Document: SentinelEdge — Trade-off & Decision (Decision Matrices · Register · COCOMO)
Document ID: DEC-SENTINELEDGE-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Decision Management) · INCOSE SE Handbook v5 (2023)
Status: Draft
Owner: Lead Systems Engineer
---

# SentinelEdge — Phase 05 Trade-off & Decision

Makes the five strategic choices left open in [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) §13 **auditable**: each is reduced to a weighted decision matrix (`DM-01…DM-05`), sensitivity-tested at 40% per criterion, recorded as a numbered decision (`DEC-01…DEC-05`, ADR stubs), and traced to the `REQ-*` it serves. Exit gate: **Decisions traced** (per Conventions §1). This document conforms to `../../../05_Conventions.md` for all IDs (`DM-NN`/`DEC-NN`/`REQ-*`/`RSK-*`), the 1–10 scale, the gate ladder, S1–S4 severity, T/I/A/D methods, and standard citations (§9); it never redefines them.

> **Inputs.** Phase 02 `SysRS.md` (REQ-*, MOP-*/TPM-*, the §13 named decisions), Phase 01 `Concept.md` (SN-*, MOE-*, the `RSK-*` register §9, feasibility horizon §5). Phase 04 `Architecture_Description.md` / `Tech_Stack_Rationale.md` are **TODO** (not yet authored in this backbone); the five decisions are taken from SysRS §13, which pre-named them by design (`DEC-01…DEC-05`) so Phases 03–05 align to stable IDs. When Phase 04 is written, its "alternatives considered" must reconcile with the shortlists below or raise a `CR-NN` (Phase 09).
>
> **Cost / scalability horizon.** A **5-year per-asset TCO** window is used for the Cost criterion (the asset-monitoring lifecycle horizon; Concept §5 "Economic — Conditional-Go (ROM owed)"; full LCC is `TODO`). All absolute dollar, latency, accuracy, and battery figures are `TODO: pilot-measured` per SysRS §10 — **no numbers are invented here.** Scores are derived from *relative* posture (BoM density, compute headroom, power draw, ops toil, certification surface), not from absolute measurements that this project has not yet taken. The `TODO` thresholds these scores reason against are the named ones in SysRS §5/§7/§10 (`recall_target`, `fpr_target`, `lat_target`, `mem_target`/`ram_target`, `life_target`, `rollback_target`, `SIL_target`).

---

## 1. Criteria & weights (this trade study)

The six-criterion default set per the Phase 05 method. Weights are **re-weighted per decision** against the dominant stakeholder priority / REQ for that choice — a single global flat weighting would bury the fact that, e.g., DM-04 (OTA governance) is Risk-dominated while DM-02 (model family) is Performance-dominated. Each decision states its weight row, what drives it, and that it sums to 100%. **No criterion is tailored out**: Safety *is* in scope (a `SAF` thread exists — REQ-SAF-01/02, HAZ-01), and Safety-relevant concerns are carried inside the **Risk** criterion (certification surface, fail-passive integrity) rather than as a seventh column, with DM-05 dedicated to the safety-partitioning decision itself.

| Criterion | Definition (KB-anchored) | Primary trace for SentinelEdge |
|---|---|---|
| **Cost** | 5-yr per-asset TCO — node BoM (REQ-C-01) + cloud OpEx + integration + lifecycle/field-service effort. | `REQ-C-01`, Concept §5 (economic), `STK-08` (margin), `STK-01` (ROI) |
| **Performance** | On-device inference latency/accuracy, sensing fidelity, throughput of the fleet/OTA pipeline. | `REQ-P-01`, `REQ-P-02`, `REQ-P-03`, `MOP-01/02/03/04`, `TPM-01/02/03/05` |
| **Reliability** | Service-free battery life, offline autonomy, OTA recoverability, graceful degradation. | `REQ-O-01`, `REQ-O-02`, `REQ-O-03`, `MOP-10`, `TPM-04` |
| **Risk** | Security/supply-chain, **functional-safety certification surface (IEC 61508)**, vendor lock-in, drift. | `RSK-01/02/03/04/05/06`, `REQ-SEC-01/02/03/04`, `REQ-D-01/03`, `REQ-SAF-01` |
| **Scalability** | Headroom for fleet growth (device count), model growth (accuracy/size), and OTA reach. | `SN-04`, `REQ-F-06`, `MOP-07`, fleet-count growth (`STK-08`) |
| **Maintainability** | Field-service toil (battery swaps, commissioning), updateability, model-lifecycle operability. | `REQ-U-01`, `REQ-O-03`, `REQ-P-04` (drift), `STK-02`, `STK-05` |

**Scoring scale (Conventions §5 / 1–10):** 1 = unacceptable / disqualifying · 4 = below target · 6 = meets target with effort · 8 = comfortably meets target · 10 = best-in-class with verifiable evidence. **No 10 is awarded** in this study — every alternative carries at least one named drawback, and each cell's evidence is *relative engineering posture*, not a measured pilot benchmark (those are `TODO` for Phase 07/10 against the SysRS §10 TPMs).

---

## 2. Decision matrices

Weighted total = Σ(score × weight), weights as decimals. Sensitivity = each criterion in turn set to **0.40**, the remaining **0.60** split equally (0.12 each) across the other five, totals recomputed; a winner that survives every re-weight is **robust**, one that changes is **sensitive (FLIP)** with a plausibility judgement. All totals and 40%-cases below were recomputed and back-checked.

### DM-01 — Node compute platform & ML runtime  (→ DEC-01)

Decision: what processor class and embedded ML runtime hosts the edge model on the node? Serves `REQ-F-01`/`REQ-F-02` (on-device sensing + inference), `REQ-P-02` (inference ≤ `lat_target` ms), `REQ-P-03` (model ≤ `mem_target`/`ram_target`), `REQ-C-01` (BoM ceiling), `SN-03`; concentrates **`RSK-01`** (model cannot meet accuracy within compute/memory budget, **Critical**) and sets `TPM-03`/`TPM-05`. **Weights:** Cost 15 · **Perf 25** · Reliab 15 · Risk 15 · Scal 15 · Maint 15 (Performance up-weighted: on-device latency/accuracy headroom is the `RSK-01` quadrilemma's pivot).

| Criterion (W) | MCU-only (Cortex-M, TFLite-Micro) | MCU + integrated NPU | MPU / Linux SoC (richer runtime) |
|---|---|---|---|
| Cost (15%) | 8 (lowest BoM, fits `REQ-C-01`; single die, no NPU premium) | 5 (NPU-class MCU adds BoM cost, still within reach) | 3 (SoC + DRAM + PMIC blows the node BoM ceiling) |
| Performance (25%) | 5 (CPU-only inference risks the `lat_target` budget for richer models) | 9 (NPU gives latency headroom for tiny-NN at low clock — best `TPM-03`) | 8 (ample compute, but power/latency-per-inference worse than a tuned NPU) |
| Reliability (15%) | 8 (simplest stack; fewest failure modes; deterministic bare-metal/RTOS) | 7 (NPU driver/firmware adds a fault surface) | 6 (Linux stack = larger attack/fault surface, longer boot, watchdog complexity) |
| Risk (15%) | 7 (mature TFLite-Micro; smallest security/cert surface for `REQ-D-01`) | 6 (NPU toolchain/vendor lock-in; quantization-correctness risk) | 5 (full Linux supply chain enlarges `REQ-SEC-02/03` + IEC 61508 cert surface) |
| Scalability (15%) | 6 (compute ceiling caps future model growth) | 8 (NPU headroom lets the fleet adopt larger models via OTA) | 7 (most raw headroom, but power/cost cap fleet rollout) |
| Maintainability (15%) | 7 (one toolchain; constrained debugging) | 7 (NPU SDK + model toolchain to maintain) | 6 (full OS patching/CVE cadence is perpetual toil) |
| **Weighted total** | **6.65** | **7.20** | **6.05** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → MCU-only **7.16** / MCU+NPU 6.44 / MPU 5.04 — **FLIP to MCU-only**
- Perf@40% → 6.32 / **MCU+NPU 7.56** / 6.44 — no flip
- Reliab@40% → MCU-only **7.16** / MCU+NPU 7.00 / 5.88 — **FLIP to MCU-only**
- Risk@40% → MCU-only **6.88** / MCU+NPU 6.72 / 5.60 — **FLIP to MCU-only**
- Scalability@40% → 6.60 / **MCU+NPU 7.28** / 6.16 — no flip
- Maintainability@40% → 6.88 / **MCU+NPU 7.00** / 5.88 — no flip (margin 0.12)

**Decision:** **MCU + integrated NPU**, with **TFLite-Micro / vendor NN runtime** on the NPU. **Sensitive** — the base winner flips to **MCU-only** under Cost@40, Reliability@40, and Risk@40. Those three up-weights are *plausible* (a cost-led or cert-led program could rationally pick MCU-only), so the decision is **conditional, not robust**: the NPU is selected **only because `RSK-01` (accuracy vs. footprint/latency) is the Critical mission risk** and the NPU is the single lever that buys inference headroom without exceeding `REQ-C-01`. The choice is **gated on the SRR-condition pilot** (Concept §5/§10) measuring `TPM-03` (latency) and `TPM-05` (footprint) against the chosen MCU+NPU part — if the pilot shows MCU-only already meets `lat_target`/`recall_target`, the Cost/Reliab/Risk flips become decisive and the program reverts to MCU-only via a `CR-NN`. Residual risk: NPU toolchain/vendor lock-in is raised as new **`RSK-08`** (L=3/I=3 → Medium) for the Risk thread, bounded by keeping the model exportable to a portable runtime.

### DM-02 — Embedded model family  (→ DEC-02)

Decision: what model family runs on-device — a classical signal-feature classifier or a tiny neural net — trading accuracy ↔ footprint ↔ explainability? Serves `REQ-P-01` (recall ≥ `recall_target`, FPR ≤ `fpr_target`), `REQ-P-03` (footprint), `REQ-F-07` (per-alert explanation + lineage), `REQ-P-04` (drift), `SN-01`/`SN-02`/`SN-09`; concentrates **`RSK-01`** (accuracy/footprint), **`RSK-02`** (false-positive/alert-fatigue, **Critical**), **`RSK-03`** (drift). Sets `TPM-01`/`TPM-02`/`TPM-05`. **Weights:** Cost 10 · **Perf 30** · Reliab 15 · Risk 15 · Scal 10 · **Maint 20** (Performance dominates — recall/FPR is the felt mission value; Maintainability up because explainability/lineage and drift-retraining run for the asset's life).

| Criterion (W) | Classical feature classifier (RF/GBM on DSP features) | Tiny neural net (quantized 1D-CNN) | Hybrid (DSP features → tiny-NN head) |
|---|---|---|---|
| Cost (10%) | 8 (cheap to train; runs on CPU; smallest engineering spend) | 6 (NN training + quantization tooling + NPU per DM-01) | 6 (both pipelines to build) |
| Performance (30%) | 6 (strong on separable bearing/imbalance features; ceiling on subtle/coupled faults vs `recall_target`) | 8 (learns subtle multi-channel signatures; best recall headroom, NPU-accelerated) | 8 (DSP priors + NN flexibility; best expected recall/FPR balance) |
| Reliability (15%) | 8 (deterministic, well-characterised failure modes; stable across firmware) | 7 (sensitive to input-distribution shift → drift `RSK-03`) | 7 (DSP front-end stabilises inputs, but two stages to keep in sync) |
| Risk (15%) | 8 (white-box features satisfy `REQ-F-07` explainability natively; smallest cert/audit risk) | 6 (black-box → explainability via post-hoc attribution; harder IEC 61508 argument) | 7 (DSP features give partial intrinsic explanation; NN head still needs attribution) |
| Scalability (10%) | 6 (feature engineering per new fault class doesn't transfer well across machine types) | 8 (retrain/transfer across machine classes via OTA; scales with fleet data) | 7 (NN head retrains; DSP features may need per-class tuning) |
| Maintainability (20%) | 8 (simple to retrain/explain; low MLOps toil) | 6 (quantization-aware retraining + drift management = ongoing MLOps) | 6 (two-stage pipeline = most moving parts to maintain) |
| **Weighted total** | **7.20** | **6.95** | **7.00** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → **Classical 7.52** / Tiny-NN 6.60 / Hybrid 6.60 — no flip
- Perf@40% → Classical 6.96 / **Tiny-NN 7.16** / **Hybrid 7.16** — **FLIP to Tiny-NN/Hybrid (tie)**
- Reliab@40% → **Classical 7.52** / Tiny-NN 6.88 / Hybrid 6.88 — no flip
- Risk@40% → **Classical 7.52** / Tiny-NN 6.60 / Hybrid 6.88 — no flip
- Scalability@40% → Classical 6.96 / **Tiny-NN 7.16** / Hybrid 6.88 — **FLIP to Tiny-NN**
- Maintainability@40% → **Classical 7.52** / Tiny-NN 6.60 / Hybrid 6.60 — no flip

**Decision:** **Classical feature classifier as the v1 baseline, with the Hybrid (DSP→tiny-NN head) as the funded v1.x evolution path.** **Sensitive** — the base winner (Classical) flips to Tiny-NN/Hybrid under Perf@40 and Scalability@40. Those flips are **plausible and acknowledged**, not dismissed: Performance and Scalability are genuinely the long-run dominant criteria for detection, *but at v1 the explainability (`REQ-F-07`), drift-stability, and IEC 61508 (`REQ-D-01`) certification arguments are far cheaper to make with a white-box classifier*, and `RSK-02` (alert fatigue) is best retired first with an interpretable, precision-tunable model. The decision therefore **adopts the flip as a roadmap, not a rejection**: ship Classical to clear `recall_target`/`fpr_target` on the SRR-condition pilot, then promote the Hybrid head over OTA (DM-04 channel) once drift telemetry (`REQ-P-04`, `TPM` margins) and an explainability story are in place. This binds tightly to **DM-01** (the NPU is provisioned *for* the Hybrid head even though v1 ships Classical) — recorded so the DM-01 NPU isn't stranded. New opportunity **`OPP-02`** (fleet-trained Hybrid model as a premium accuracy tier) is raised for `STK-08`.

### DM-03 — Node power strategy & node↔gateway link  (→ DEC-03)

Decision: how is the node powered, and what physical link carries node↔gateway traffic? Serves `REQ-O-01` (≥ `life_target` years service-free), `REQ-O-02` (offline autonomy), `REQ-INT-01` (mutually-authenticated link), `REQ-C-02` (license-exempt radio), `SN-05`; concentrates **`RSK-05`** (battery-life shortfall, **High**) and sets `TPM-04`. **Weights:** Cost 20 · Perf 10 · **Reliab 20** · Risk 10 · **Scal 20** · **Maint 20** (battery/service-free life is a Reliability + Maintainability concern; fleet rollout cost/scale dominate because power+link choice repeats across every node).

| Criterion (W) | Primary Li-SOCl₂ + BLE wake-on-event | Li-ion rechargeable + sub-GHz (802.15.4 / Thread) | Wired / PoE + wired fieldbus (RS-485) |
|---|---|---|---|
| Cost (20%) | 7 (low BoM cell; battery is a recurring field cost, no cabling) | 5 (rechargeable + charge circuit + larger cell raises node BoM) | 6 (no battery, but cabling/PoE install labour per asset) |
| Performance (10%) | 6 (duty-cycled BLE throughput limits evidence-upload size) | 7 (sub-GHz range/penetration good in plant; moderate rate) | 8 (wired = highest, deterministic bandwidth, no RF contention) |
| Reliability (20%) | 8 (very low self-discharge, multi-year `life_target` achievable; no charge cycles to fail) | 6 (charge cycles + temperature derating threaten `life_target` in −20…+70 °C) | 9 (mains/PoE-powered = effectively unlimited runtime; no battery `RSK-05`) |
| Risk (10%) | 7 (BLE mature; Li-SOCl₂ is a battery-transport/disposal item — REQ-D-02) | 6 (Li-ion transport/thermal-runaway risk; sub-GHz regional band variance — REQ-C-02) | 8 (no battery hazard; wired link smallest RF/regulatory surface) |
| Scalability (20%) | 7 (battery-only install scales fast across many assets, no cabling) | 8 (mesh/Thread scales node density; rechargeable avoids battery-swap logistics at scale) | 5 (every wired node needs an install/cabling run — slow fleet scaling) |
| Maintainability (20%) | 7 (periodic battery swap is the toil, but install is trivial) | 6 (recharge/swap logistics + charge-health monitoring) | 8 (no battery service ever; but cable faults to diagnose) |
| **Weighted total** | **7.10** | **6.30** | **7.20** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → **Primary-Li 7.00** / Li-ion 5.96 / Wired 6.96 — **FLIP to Primary-Li**
- Perf@40% → Primary-Li 6.72 / Li-ion 6.52 / **Wired 7.52** — no flip
- Reliab@40% → Primary-Li 7.28 / Li-ion 6.24 / **Wired 7.80** — no flip
- Risk@40% → Primary-Li 7.00 / Li-ion 6.24 / **Wired 7.52** — no flip
- Scalability@40% → **Primary-Li 7.00** / Li-ion 6.80 / Wired 6.68 — **FLIP to Primary-Li**
- Maintainability@40% → Primary-Li 7.00 / Li-ion 6.24 / **Wired 7.52** — no flip

**Decision:** **Dual-form-factor offering — Wired/PoE as the default where power is reachable, Primary Li-SOCl₂ + BLE as the battery variant where it is not** (the README and Concept §3 already commit to "wired **and** battery-powered"). **Sensitive** — Wired wins the base case (7.20) but flips to Primary-Li under Cost@40 and Scalability@40. Both flips are **plausible and decisive for the battery variant**: where cabling is impractical or fleet rollout speed dominates (`SN-04` reach, `STK-08` scale), battery is the right answer, and that is exactly the variant the product carries. So the matrix is **not "pick one"** — it confirms the two-SKU strategy and tells us *which criterion selects which SKU*: Reliability/Maintainability (wired, 7.80/7.52 at 40%) for fixed plant assets, Cost/Scalability (battery, 7.00 at 40%) for distributed/retrofit assets. **Li-ion rechargeable is eliminated** — it loses every re-weight (max 6.80), penalised by temperature derating against `life_target` (`RSK-05`) and added BoM. The battery SKU keeps `RSK-05` open against `TPM-04`; the wired SKU effectively *retires* `RSK-05` but adds install-cost. Node↔gateway security (`REQ-INT-01` mTLS) is identical across both links and unaffected by this choice.

### DM-04 — OTA + model-governance architecture  (→ DEC-04)

Decision: how are signed firmware/model updates staged, health-checked, and rolled back across the fleet, and where does model lineage live? Serves `REQ-F-06` (signed staged OTA + auto-rollback), `REQ-O-03` (cohort rollback ≤ `rollback_target`, no device bricked), `REQ-SEC-02` (verified boot / signed images), `REQ-P-04` (drift→retrain loop), `REQ-F-07` (lineage), `SN-04`/`SN-10`; concentrates **`RSK-03`** (silent drift), **`RSK-06`** (compromised/unsigned image, **High**). Sets `MOP-07`. **Weights:** Cost 10 · Perf 10 · **Reliab 25** · **Risk 30** · Scal 15 · Maint 10 (Risk + Reliability dominate — a bad/forged update that bricks the fleet or persists is the highest-impact operational+security event; signing + non-bricking rollback are non-negotiable).

| Criterion (W) | A/B dual-bank + signed + canary + auto-rollback (managed model registry) | Single-bank in-place + signed (manual rollback) | Delta-only OTA + signed + canary (no dual-bank) |
|---|---|---|---|
| Cost (10%) | 6 (2× flash bank + registry/canary infra) | 8 (cheapest — one bank, minimal cloud) | 7 (small payloads cut bandwidth; no second bank but delta-apply tooling) |
| Performance (10%) | 7 (canary adds rollout latency, but parallel cohorts) | 6 (all-or-nothing; slow safe rollout) | 7 (small deltas = fast transfer over BLE/sub-GHz) |
| Reliability (25%) | 9 (failed image never overwrites the running one; guaranteed non-bricking rollback per `REQ-O-03`) | 5 (in-place flash failure mid-write can brick a node — violates "no device left non-functional") | 7 (delta apply can fail/desync; rollback needs a recovery image) |
| Risk (30%) | 9 (signed + verified boot + canary catches a bad/forged model before fleet-wide; strongest `RSK-06`/`RSK-03` posture) | 6 (signed, but manual rollback is slow and human-error-prone under attack) | 7 (signed + canary, but delta integrity adds an attack/corruption surface) |
| Scalability (15%) | 8 (cohort canaries scale fleet rollout safely; registry tracks model versions/lineage) | 6 (manual staging doesn't scale to a large fleet) | 7 (bandwidth-efficient at scale, but recovery orchestration grows) |
| Maintainability (10%) | 8 (one governed pipeline; lineage + drift in the registry, `REQ-F-07`/`REQ-P-04`) | 6 (bespoke manual rollback runbooks) | 6 (delta-chain bookkeeping per device) |
| **Weighted total** | **8.25** | **5.95** | **6.90** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → **A/B 7.32** / Single 6.68 / Delta 6.88 — no flip
- Perf@40% → **A/B 7.60** / Single 6.12 / Delta 6.88 — no flip
- Reliab@40% → **A/B 8.16** / Single 5.84 / Delta 6.88 — no flip
- Risk@40% → **A/B 8.16** / Single 6.12 / Delta 6.88 — no flip
- Scalability@40% → **A/B 7.88** / Single 6.12 / Delta 6.88 — no flip
- Maintainability@40% → **A/B 7.88** / Single 6.12 / Delta 6.60 — no flip

**Decision:** **A/B dual-bank, signed, canary-staged OTA with automatic rollback, fronted by a managed model registry** (lineage + drift). **Robust** — wins every re-weight by a wide margin (lowest 40%-case 7.32 vs. next-best 6.88). This is the direct mitigation that retires the worst of **`RSK-06`** (verified boot + signing on every image, `REQ-SEC-02`) and **`RSK-03`** (registry-side drift detection + governed retrain/rollout, `REQ-P-04`), and it is the only alternative that *guarantees* `REQ-O-03`'s "no device left non-functional" because the running bank is never overwritten. The 2× flash cost is accepted and folds back into the DM-01 footprint budget (`REQ-P-03`) — recorded as a constraint on part selection. The canary→rollout→rollback flow is a new interface seam (`ICD-TBD`, OTA channel gateway↔cloud, `REQ-INT-02`) to freeze at CDR; `MOP-07` (fleet reach incl. rollback) is the tracked metric. Residual: a flawed canary *health check* could pass a bad model — raised as new **`RSK-09`** (canary blind-spot, L=2/I=4 → Medium) for the Risk thread, mitigated by tying the health check to the live `TPM-02` (FPR) telemetry.

### DM-05 — Safety partitioning (advisory-only / fail-passive)  (→ DEC-05)

Decision: how is the **advisory-only, fail-passive** guarantee architecturally enforced so SentinelEdge can never command the machine, satisfying IEC 61508? Serves `REQ-SAF-01` (no actuation path; fail-passive), `REQ-F-04` (advisory-only, no control interface), `REQ-D-01` (IEC 61508 SIL `TODO: SIL_target` from HAZ-01), `SN-06`; concentrates **`RSK-04`** (a prediction is mis-used to actuate → hazard, **High**). **Weights:** Cost 10 · Perf 5 · **Reliab 25** · **Risk 35** · Scal 5 · **Maint 20** (Risk dominates — this is the functional-safety decision; Reliability/Maintainability matter because the safety argument must hold over the asset life and through OTA).

| Criterion (W) | Physical no-actuation + MCU-internal SW partition | Dedicated safety MCU (HW-partitioned supervisor) | Single MCU + certified RTOS partitioning (SIL-capable RTOS) |
|---|---|---|---|
| Cost (10%) | 8 (no extra silicon; cheapest BoM, supports `REQ-C-01`) | 4 (second MCU + its own toolchain/certification) | 6 (one MCU, but SIL-RTOS licence + certification effort) |
| Performance (5%) | 7 (no partition overhead) | 7 (supervisor runs independently; no main-path penalty) | 7 (RTOS partition scheduling overhead is small) |
| Reliability (25%) | 7 (correctness rests on SW partitioning on a shared MCU — common-cause failure risk) | 9 (independent HW supervisor; freedom-from-interference by construction) | 8 (RTOS-enforced spatial/temporal isolation; weaker than separate silicon) |
| Risk (35%) | 6 (hardest IEC 61508 argument — must prove no SW fault breaches advisory-only on one MCU) | 9 (cleanest `REQ-SAF-01` case: there is *physically* no actuation path the safety MCU can be made to drive; strongest `RSK-04` retirement) | 7 (certifiable, but the safety case leans on RTOS partition evidence and tool qualification) |
| Scalability (5%) | 6 (fine across fleet, but every new feature re-opens the partition argument) | 6 (supervisor scales, but BoM cost repeats per node) | 6 (RTOS scales; re-cert on RTOS/version change) |
| Maintainability (20%) | 7 (one MCU to maintain, but any change re-triggers the SW-partition safety review) | 7 (supervisor is small/stable; main app evolves without touching it — good change isolation) | 6 (RTOS upgrades/CVE-driven changes can force partial re-certification) |
| **Weighted total** | **6.70** | **7.85** | **6.90** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → **Physical 7.16** / Safety-MCU 6.16 / RTOS 6.48 — **FLIP to Physical-only**
- Perf@40% → Physical 6.88 / **Safety-MCU 7.00** / RTOS 6.76 — no flip
- Reliab@40% → Physical 6.88 / **Safety-MCU 7.56** / RTOS 7.04 — no flip
- Risk@40% → Physical 6.60 / **Safety-MCU 7.56** / RTOS 6.76 — no flip
- Scalability@40% → Physical 6.60 / **Safety-MCU 6.72** / RTOS 6.48 — no flip (margin 0.12)
- Maintainability@40% → Physical 6.88 / **Safety-MCU 7.00** / RTOS 6.48 — no flip

**Decision:** **Dedicated safety MCU (hardware-partitioned supervisor)** enforcing fail-passive, advisory-only behaviour. **Sensitive** — flips to **Physical-only + SW partition** under Cost@40%. That flip is **explicitly rejected**: the Cost advantage is real but this is a **functional-safety decision (`REQ-D-01`, IEC 61508)** where a 40% Cost weighting contradicts the requirement priority — `RSK-04` is a High-band hazard (I=5) and `REQ-SAF-01` demands provable freedom-from-interference, which a hardware-independent supervisor delivers by construction and a shared-MCU SW partition only argues. The decision is therefore **Risk-dominated by design**, and on its dominant criterion (Risk@40, Reliability@40) the dedicated safety MCU wins decisively (7.56). The final SIL target (`TODO: SIL_target`) comes from HAZ-01; the supervisor's scope is "verify the device exposes no actuation interface and forces a passive/fault state on any fault" (`REQ-F-04`, Fault state in SysRS §9). This binds back to **DM-01** (the safety MCU is *additional* to the compute MCU/NPU — recorded against the BoM in `REQ-C-01`) and to **DM-04** (OTA must never be able to push code to the safety supervisor without a separate, more-restricted signing path — raised as new **`RSK-10`**, L=2/I=5 → High, OTA-to-safety-partition isolation, for the Safety/RAMS + Security threads).

---

## 3. Decision Register (DEC-01…DEC-05)

Five-column register per Conventions §2.3; each row is an ADR stub (Context → Decision → Status → Consequences). `DM-NN` ↔ `DEC-NN` share the two-digit sequence. Status `Proposed` until accepted at **PDR**, then baselined into the **allocated baseline** (Conventions §3); thereafter changed only via a `CR-NN` (Phase 09).

| DEC-NN | Decision (→ DM-NN) | Choice | Sensitivity-robust? | Linked REQs / RSK / OPP |
|---|---|---|---|---|
| **DEC-01** | Node compute platform & ML runtime (DM-01) | MCU + integrated NPU, TFLite-Micro/vendor runtime | **No** — flips to MCU-only under Cost/Reliab/Risk@40; **conditional on the SRR pilot** (`TPM-03`/`TPM-05`) | REQ-F-01/02, REQ-P-02, REQ-P-03, REQ-C-01; RSK-01 (open), RSK-08 (new, NPU lock-in) |
| **DEC-02** | Embedded model family (DM-02) | Classical classifier v1; Hybrid (DSP→tiny-NN) as funded v1.x over OTA | **No** — flips to Tiny-NN/Hybrid under Perf/Scal@40; flip **adopted as roadmap** | REQ-P-01, REQ-P-03, REQ-F-07, REQ-P-04; TPM-01/02/05, RSK-01/02/03, OPP-02 (new) |
| **DEC-03** | Node power & node↔gateway link (DM-03) | Two SKUs: Wired/PoE default + Primary Li-SOCl₂/BLE battery variant; Li-ion eliminated | **No** — flips Wired↔battery under Cost/Scal@40; flip **confirms the two-SKU split** | REQ-O-01, REQ-O-02, REQ-INT-01, REQ-C-02; MOP-10, TPM-04, RSK-05 (open on battery SKU) |
| **DEC-04** | OTA + model-governance architecture (DM-04) | A/B dual-bank, signed, canary + auto-rollback, managed registry | **Yes** (robust — wins every re-weight, wide margin) | REQ-F-06, REQ-O-03, REQ-SEC-02, REQ-P-04, REQ-F-07; MOP-07, RSK-03/06 (mitigated), RSK-09 (new), ICD-TBD |
| **DEC-05** | Safety partitioning, advisory-only (DM-05) | Dedicated safety MCU (HW-partitioned fail-passive supervisor) | **No** — flips to Physical-only under Cost@40 (rejected: safety-dominated) | REQ-SAF-01, REQ-F-04, REQ-D-01; SN-06, HAZ-01, RSK-04 (mitigated), RSK-10 (new) |

### ADR bodies (stubs)

- **DEC-01 — Compute = MCU + integrated NPU.** *Context:* `RSK-01` (accuracy vs. footprint/latency) is the Critical mission risk; the NPU is the lever that buys inference headroom inside `REQ-C-01`. *Decision:* MCU+NPU with TFLite-Micro/vendor runtime; baseline part `TODO` (Phase 04). *Status:* **Proposed** (→ PDR), **conditional** on the SRR-entry pilot measuring `TPM-03`/`TPM-05`. *Consequences:* meets `REQ-P-02/03` with headroom for the DM-02 Hybrid; if the pilot shows MCU-only suffices, revert via `CR-NN` (the Cost/Reliab/Risk flips become decisive); NPU lock-in tracked as `RSK-08`, bounded by a portable model export.
- **DEC-02 — Model = Classical v1 → Hybrid v1.x.** *Context:* search/detection is Perf/Scal-dominated long-run, but v1 must clear `recall_target`/`fpr_target`, explainability (`REQ-F-07`), and the IEC 61508 argument (`REQ-D-01`) cheaply; `RSK-02` (alert fatigue) needs an interpretable, precision-tunable model first. *Decision:* ship white-box Classical, promote the DSP→tiny-NN Hybrid head over the DM-04 OTA channel once drift telemetry + explainability are in place. *Status:* **Proposed** (→ PDR). *Consequences:* the Perf/Scal sensitivity flip is *adopted as the roadmap*, not ignored; provisions the DM-01 NPU so it isn't stranded; `OPP-02` (premium accuracy tier).
- **DEC-03 — Power/link = Wired default + battery (Li-SOCl₂/BLE) variant.** *Context:* product commits to wired **and** battery (Concept §3); `RSK-05` (battery-life) is the High risk on the battery path. *Decision:* two SKUs; Wired/PoE where power is reachable (retires `RSK-05`, best Reliab/Maint), Primary Li-SOCl₂+BLE where it isn't (best Cost/Scal for retrofit). Li-ion rechargeable eliminated (temperature-derated `life_target`, added BoM). *Status:* **Proposed** (→ PDR). *Consequences:* the Cost/Scal flip *confirms* which criterion selects which SKU; battery SKU keeps `RSK-05`/`TPM-04` open; identical `REQ-INT-01` mTLS on both links.
- **DEC-04 — OTA = A/B dual-bank + signed + canary + auto-rollback.** *Context:* a forged or bad update that bricks/persists across the fleet is the top combined security+reliability event (`RSK-06`/`RSK-03`); `REQ-O-03` forbids any bricked device. *Decision:* dual-bank (running image never overwritten), verified boot + signing (`REQ-SEC-02`), cohort canary tied to live `TPM-02`, automatic rollback, managed model registry for lineage/drift (`REQ-F-07`/`REQ-P-04`). *Status:* **Proposed** (→ PDR; freeze OTA `ICD-TBD` at CDR). *Consequences:* robust; 2× flash cost folded into the `REQ-P-03` budget; `MOP-07` tracked; canary blind-spot raised as `RSK-09`.
- **DEC-05 — Safety = dedicated safety MCU (HW-partitioned, fail-passive).** *Context:* `REQ-SAF-01`/`REQ-F-04` demand provable advisory-only; `RSK-04` (mis-actuation) is a High hazard; IEC 61508 (`REQ-D-01`) wants freedom-from-interference, not an argument about shared-MCU SW partitions. *Decision:* an independent safety supervisor with no actuation path, that forces a passive Fault state on any fault. *Status:* **Proposed** (→ PDR; SIL `TODO: SIL_target` from HAZ-01). *Consequences:* strongest safety case at a real BoM cost (logged against `REQ-C-01`); Cost@40 flip rejected as anti-priority; OTA must not reach the safety partition via the normal signing path → `RSK-10`.

---

## 4. COCOMO software-effort estimate

SentinelEdge is **hybrid hardware/firmware/edge-AI/cloud** (README; Concept §4), so COCOMO is run on the **software scope only** (firmware + edge-AI runtime + cloud/gateway/apps) — the hardware/BoM cost lives in the Cost criterion above and the Phase-04 BoM, not here. Constants are the Boehm Basic set from the Phase 05 method; **every value is computed from the constants** (`E = a·KLOC^b`, `T = c·E^d`, `N = E/T`) — none copied from any worked example. The three numbers in each row are back-checked for self-consistency.

### 4.1 Size basis (KLOC by module → COCOMO mode)

Estimated against the SysRS §13 intended blocks (new code; **excludes** bought components — the NPU vendor runtime per DEC-01 and any managed-registry SaaS per DEC-04 count only their integration glue). Each figure is an engineering estimate, `TODO`-refinable once Phase 04 detailed design exists. Mode is assigned by the COCOMO size/characteristic bands, not by guess.

| Module (SysRS §13 block) | KLOC | Mode | Why this mode |
|---|---|---|---|
| Node firmware: RTOS/bare-metal, sensor front-end, ADC, duty-cycle scheduler | 11 | **Embedded** | Hardware-coupled, real-time, power-critical |
| Edge-AI inference runtime + on-device feature DSP (DEC-01/02) | 8 | **Embedded** | Tight latency/footprint budget on MCU/NPU (`REQ-P-02/03`) |
| Secure boot / identity / verified-image loader (REQ-SEC-01/02) | 6 | **Embedded** | Crypto + boot chain, safety/security-critical |
| Safety supervisor firmware on the dedicated safety MCU (DEC-05) | 5 | **Embedded** | IEC 61508 fail-passive, independently certified |
| Node comms / link adapter (BLE + RS-485, mTLS) (REQ-INT-01) | 8 | **Embedded** | Real-time link, constrained, dual-PHY |
| *Subtotal — node firmware (Embedded)* | **38** | | |
| Cloud fleet backend: device/model registry, alert routing, analytics | 28 | **Semi-Detached** | Distributed services; integrates CMMS, registry |
| OTA + model-governance service: signing, canary, rollback (DEC-04) | 18 | **Semi-Detached** | Orchestration across fleet; standards-bound but server-side |
| Model lifecycle: drift detection, lineage, explainability (REQ-P-04/F-07) | 14 | **Semi-Detached** | MLOps pipeline; novel-but-server-side |
| Gateway software: aggregation, buffering, WAN bridge (REQ-INT-02) | 12 | **Semi-Detached** | Middleware, integrates node↔cloud |
| *Subtotal — cloud + gateway (Semi-Detached)* | **72** | | |
| Operator dashboard (alerts, explanations) (REQ-U-02) | 12 | **Organic** | Standard SPA |
| Technician commissioning mobile/handheld app (REQ-U-01) | 8 | **Organic** | Standard guided-flow mobile app |
| Web portal / fleet admin (CRUD) | 4 | **Organic** | CRUD-style |
| *Subtotal — apps (Organic)* | **24** | | |
| **Total** | **134 KLOC** | | |

Mode constants (Conventions / Phase 05 method): Embedded a=3.6, b=1.20, c=2.5, d=0.32 · Semi-Detached a=3.0, b=1.12, c=2.5, d=0.35 · Organic a=2.4, b=1.05, c=2.5, d=0.38.

### 4.2 Basic COCOMO — per mode

`E = a·KLOC^b` (person-months) · `T = c·E^d` (months) · `N = E/T` (avg staff). Computed per mode (a hybrid system is *not* one mode), then aggregated (Σ effort, max duration on the driving branch).

| Mode | KLOC | a | b | c | d | E (PM) | T (mo) | N (eng) |
|---|---|---|---|---|---|---|---|---|
| Embedded | 38 | 3.6 | 1.20 | 2.5 | 0.32 | 283.2 | 15.23 | 18.60 → 19 |
| Semi-Detached | 72 | 3.0 | 1.12 | 2.5 | 0.35 | 360.9 | 19.63 | 18.38 → 19 |
| Organic | 24 | 2.4 | 1.05 | 2.5 | 0.38 | 67.5 | 12.39 | 5.45 → 6 |

Back-check (each row satisfies the identities): Embedded `2.5·283.2^0.32 = 15.23` ✓, `283.2/15.23 = 18.60` ✓ · Semi-Detached `2.5·360.9^0.35 = 19.63` ✓, `360.9/19.63 = 18.38` ✓ · Organic `2.5·67.5^0.38 = 12.39` ✓, `67.5/12.39 = 5.45` ✓.

**Aggregate (Basic, gross):**
- Total effort = 283.2 + 360.9 + 67.5 ≈ **711.5 person-months** (sum of effort).
- Critical-path duration ≈ **19.6 months** — the **Semi-Detached** (cloud/OTA/MLOps) branch has the longest `T` and drives the schedule, *not* the Embedded firmware branch.
- Fully-parallel team ≈ 711.5 / 19.6 ≈ **36 engineers** (gross; intentionally pessimistic for Basic).

### 4.3 Intermediate COCOMO — 15 cost drivers → EAF

| Category | Driver | Rating | Mult. | Why |
|---|---|---|---|---|
| Product | RELY required reliability | Very High | 1.40 | IEC 61508 advisory-safety + fleet (`REQ-D-01`, S1 hazards) |
| | DATA database size | High | 1.08 | Fleet telemetry + labelled training datasets |
| | CPLX product complexity | Very High | 1.30 | RT DSP + on-device ML + 3-tier + OTA governance |
| Hardware | TIME exec-time constraint | High | 1.11 | On-device inference latency budget (`REQ-P-02`) |
| | STOR storage constraint | High | 1.06 | Tight flash/RAM footprint (`REQ-P-03`, A/B dual-bank) |
| | VIRT VM volatility | Nominal | 1.00 | Stable MCU/cloud platforms |
| | TURN turnaround | Nominal | 1.00 | Interactive CI/CD + HIL |
| Personnel | ACAP analyst capability | High | 0.86 | Strong systems/RAMS analysts |
| | AEXP applications exp. | High | 0.91 | Team knows predictive-maintenance / IoT |
| | PCAP programmer capability | High | 0.86 | Strong embedded + cloud engineers |
| | VEXP VM experience | High | 0.90 | Embedded toolchain + cloud experience |
| | LEXP language experience | High | 0.95 | C/Rust + Go/Python experienced |
| Project | MODP modern practices | High | 0.91 | Agile cloud + formal V&V (Concept §4) |
| | TOOL software tools | High | 0.91 | Modern toolchain / CI/CD / HIL |
| | SCED required schedule | Nominal | 1.00 | Nominal schedule |

```
EAF   = 1.40·1.08·1.30·1.11·1.06·1.00·1.00·0.86·0.91·0.86·0.90·0.95·0.91·0.91·1.00 = 1.1021
E_int = EAF · E_gross = 1.1021 · 711.5 ≈ 784.2 person-months
```

> **The EAF is > 1.0 (≈ 1.10) — effort goes *up*, not down.** The safety-critical drivers (RELY 1.40, CPLX 1.30, TIME 1.11, STOR 1.06) dominate and are only *partly* offset by the strong, experienced team (ACAP/PCAP 0.86, AEXP/VEXP/MODP/TOOL 0.9-ish). *Lesson (same as the SaaS example): a Very-High-reliability, footprint-constrained edge-AI system does **not** get cheaper because the team is good — verify the EAF arithmetically; don't assume it shrinks.*

**Adjusted aggregate (driving branch = Semi-Detached):**
- Semi-Detached effort with EAF: 360.9 × 1.1021 ≈ **397.7 PM** → `T = 2.5·397.7^0.35 ≈ 20.31 months` (critical path).
- Sustained team ≈ E_int / T_adj ≈ 784.2 / 20.31 ≈ **38.6 → 39 engineers** (gross, fully parallel).

### 4.4 Sensitivity (±20% KLOC, Intermediate)

| Scenario | KLOC | E_gross (PM) | E_int (PM) | T_adj (mo) | N (eng) |
|---|---|---|---|---|---|
| −20% | 107.2 | 551.1 | 607.4 | 18.61 | 32.6 → 33 |
| **Nominal** | **134** | **711.5** | **784.2** | **20.31** | **38.6 → 39** |
| +20% | 160.8 | 876.8 | 966.3 | 21.82 | 44.3 → 45 |

A ±20% size swing moves Intermediate effort from ≈ 607 to ≈ 966 PM (≈ ±23%) but schedule only from ≈ 18.6 to ≈ 21.8 months — **schedule is far less elastic than effort** because `T` scales as `E^0.35` on the driving Semi-Detached branch. Adding scope buys months slowly; it buys headcount quickly.

### 4.5 Team-plan implication & critical path

≈ **39 average engineers over ≈ 20 months** at nominal (gross, fully parallel — real planning would phase-stagger, so sustained headcount is lower across a longer calendar). The **critical path is the cloud/OTA/MLOps Semi-Detached spine** (registry + OTA governance + drift/lineage, DEC-04), *not* the firmware — a counter-intuitive but important finding: the embedded edge-AI work is effort-dense but the server-side governance/MLOps work is the schedule driver. The **risk-retiring spine** that must clear PDR first is: the DM-01/DM-02 pilot (retire `RSK-01`/`RSK-02`), the DM-05 safety supervisor + IEC 61508 case (retire `RSK-04`), and the DM-04 OTA governance (retire `RSK-06`/`RSK-03`). Front-load senior embedded/ML engineers onto the pilot and senior cloud/security engineers onto the OTA spine; parallelise the Organic dashboard/mobile streams behind them.

### 4.6 Modern complements

COCOMO Basic/Intermediate here is a calibration sanity-check, not the plan of record. Complement with **COCOMO II** (17 effort multipliers + 5 scale factors, Agile-friendly — a better fit for the Concept §4 Agile cloud/edge-AI tracks), **story-points + team velocity** for sprint-level forecasting of the Agile tracks, and a **Monte-Carlo schedule simulation** to wrap the ≈ 20-month point estimate in a probability band rather than a single number. The V-Model firmware/safety tracks (Concept §4) stay milestone-planned. All inputs (KLOC, driver ratings) are `TODO`-refinable once Phase 04 detailed design firms the size basis.

---

## 5. Exit gate — Decisions traced

Gate: **Decisions traced** (per Conventions §1).

- [x] 3–5 strategic decisions identified — DM-01…DM-05, taken from SysRS §13 (Phase 04 `Tech_Stack_Rationale.md` is `TODO`; reconcile or raise a `CR-NN` when authored).
- [x] Every decision has a `DM-NN` matrix with 2–4 *same-level*, compatible alternatives (vendor-class vs vendor-class / architecture vs architecture — no mixed abstraction levels).
- [x] Criteria cover Cost, Performance, Reliability, Risk, Scalability, Maintainability; weights sum to 100% per decision and each ties to a REQ/stakeholder (§1). Safety carried inside Risk (DM-05 is the dedicated safety decision) — not tailored out.
- [x] Every cell scored 1–10 with a *derivable* justification (relative engineering posture / method named); no 10 awarded — all absolute benchmarks are `TODO` for Phase 07/10 against SysRS §10 TPMs.
- [x] **Sensitivity analysis present for every decision** (each criterion → 40%); flips flagged with a plausibility judgement: DM-04 robust; DM-01/02/03/05 sensitive — flips either rejected (DM-05 Cost@40), overridden by mission/safety priority, or **adopted as roadmap/multi-SKU** (DM-02, DM-03).
- [x] `Decision_Register.md` content present as §3 — 5-column, `DEC-NN`, each links ≥ 1 REQ, each row an ADR stub.
- [x] COCOMO produced (software scope 134 KLOC ≥ 10 KLOC): Basic per-mode + Intermediate, **recomputed and self-consistent** (`T=c·E^d`, `N=E/T` back-checked each row; EAF arithmetic shown).
- [x] No score, total, or COCOMO number copied from a worked example; all recomputed for SentinelEdge.
- [x] New risks/opportunities pushed to the Risk thread: **RSK-08** (NPU lock-in), **RSK-09** (canary blind-spot), **RSK-10** (OTA-to-safety-partition isolation); **OPP-02** (premium Hybrid-model accuracy tier); existing **RSK-01/02/03/04/05/06** updated (open vs. mitigated as noted). **OPP-01** (fleet-data analytics product, Concept §9) reinforced by the DM-04 managed registry.

**On PDR sign-off:** status → `Baseline (PDR-approved YYYY-MM-DD)`; `DM-*`/`DEC-*` become part of the **allocated baseline** (Conventions §3); thereafter changes only via a `CR-NN` (Phase 09). **Handoff:** `se-phase-06-integration` plans how the chosen parts come together (increments `INC-*`, CI/CD, HIL), gate **CDR** — where the DM-04 OTA `ICD-TBD` and the node↔gateway / gateway↔cloud ICDs are frozen.
