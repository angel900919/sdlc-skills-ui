---
Document: TalentFlow — Trade-off & Decision (Decision Matrices · Register · COCOMO)
Document ID: DEC-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Decision Management) · INCOSE SE Handbook v5 (2023)
Status: Draft
Owner: Lead Systems Engineer
---

# TalentFlow — Phase 05 Trade-off & Decision

Makes the five strategic choices left open in [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) §12.2 **auditable**: each is reduced to a weighted decision matrix (`DM-01…DM-05`), sensitivity-tested at 40% per criterion, recorded as a numbered decision (`DEC-01…DEC-05`, ADR stubs), and traced to the `REQ-*` it serves. Exit gate: **Decisions traced** (Conventions §1). This document conforms to [`../../../05_Conventions.md`](../../../05_Conventions.md) for all IDs, the 1–10 scale, S1–S4 severity, the gate ladder, and standard citations; it never redefines them.

> **Inputs.** Phase 02 `SysRS.md` (REQ-*, MOP-*/TPM-*, §12.2 named decisions), Phase 01 `Concept.md` (SN-*, MOE-*, RSK-* register, feasibility horizon). Phase 04 `Architecture_Description.md` / `Tech_Stack_Rationale.md` are **TODO** (not yet authored); the five decisions are taken from SysRS §12.2, which pre-named them by design so Phases 03–05 align to stable IDs. When Phase 04 is written, its "alternatives considered" must reconcile with the shortlists below or raise a `CR-NN`.
>
> **Cost/scalability horizon.** A **5-year TCO** window is used for the Cost criterion (SaaS unit-economics horizon; Concept §5 "Economic — Go (ROM)", full LCC deferred here). All dollar figures are `TODO` — a real project measures them from cloud pricing and load tests; scores below are derived from *relative* cost posture (managed-vs-self-managed, per-tenant fan-out), not invented absolutes.

---

## 1. Criteria & weights (this trade study)

The six-criterion default set (per the Phase 05 method). Weights are **re-weighted per decision** against the dominant stakeholder priority / REQ for that choice — a global flat weighting would bury the fact that, e.g., isolation is Risk-dominated while search is Performance-dominated. Each decision's weight row states what drives it and sums to 100%. No criterion is tailored out (Safety is already tailored out project-wide per SysRS §8 — no `REQ-SAF-*`, so it is not a criterion).

| Criterion | Definition (KB-anchored) | Primary trace for TalentFlow |
|---|---|---|
| **Cost** | 5-yr TCO — infra OpEx that scales per tenant + integration + lifecycle effort. | Concept §5 (economic), `STK-06`/`STK-07`, `MOE` (cost per active tenant) |
| **Performance** | Latency / throughput / search relevance under nominal + peak load. | `REQ-P-01`, `REQ-P-02`, `REQ-P-03`, `MOP-05`, `MOP-02`, `TPM-02` |
| **Reliability** | Availability, failover RTO/RPO, graceful degradation. | `REQ-O-01`, `REQ-O-02`, `MOP-09`, `MOP-10`, `TPM-01` |
| **Risk** | Security/isolation/privacy compliance, vendor lock-in, certification timing. | `RSK-01`, `RSK-02`, `RSK-03`, `REQ-SEC-01`, `REQ-SEC-08`, `REQ-D-01/02` |
| **Scalability** | Headroom for tenant-count and per-tenant-volume growth. | `REQ-P-03`, `REQ-P-04`, `SN-07`, `MOP-06`, `TPM-03` |
| **Maintainability** | Operational toil, change-impact surface, on-call blast radius. | `STK-07`, `REQ-O-03`, `SN-07` |

**Scoring scale (Conventions, 1–10):** 1 = unacceptable / disqualifying · 4 = below target · 6 = meets target with effort · 8 = comfortably meets target · 10 = best-in-class with verifiable evidence. **No 10 is awarded** in this study — every alternative carries at least one named drawback, and the evidence behind each cell is relative posture, not a measured GA benchmark (those are `TODO` for Phase 07/10).

---

## 2. Decision matrices

Weighted total = Σ(score × weight), weights as decimals. Sensitivity = each criterion in turn set to **0.40**, the remaining **0.60** split equally (0.12 each) across the other five, totals recomputed; a winner that survives every re-weight is **robust**, one that changes is **sensitive (FLIP)** with a plausibility judgement.

### DM-01 — Tenant isolation model  (→ DEC-01)

Decision: how is per-tenant data isolation enforced in the data tier? Serves `REQ-SEC-01` (tenant-scoped authZ on every path), `REQ-SEC-03` (per-tenant key separation), `REQ-C-01` (cloud multi-tenant), `SN-04`; retires/concentrates `RSK-01` (cross-tenant breach, I=5). **Weights:** Cost 15 · Perf 15 · Reliab 15 · **Risk 25** · Scal 15 · Maint 15 (Risk up-weighted: `RSK-01` is the catastrophic-impact item, and `MOP-11` target is **0** successful cross-tenant accesses).

| Criterion (W) | Shared-schema + row-level (RLS) | Schema-per-tenant | Database-per-tenant |
|---|---|---|---|
| Cost (15%) | 9 (one cluster, highest density; lowest 5-yr infra TCO/tenant) | 6 (schema fan-out raises connection/migration overhead) | 3 (one DB+key per tenant; OpEx scales worst at N tenants) |
| Performance (15%) | 7 (shared buffer pool; RLS predicate adds minor cost — meets `REQ-P-01` p95≤400 ms) | 7 (per-schema, similar hot-path latency) | 8 (no neighbor contention; best p95 but smallest pools) |
| Reliability (15%) | 7 (blast radius = all tenants on a bad migration) | 7 (per-schema migration isolation) | 8 (failure contained to one tenant) |
| Risk (25%) | 6 (isolation rests on RLS correctness — one missing predicate = `RSK-01`; mitigated by `REQ-SEC-01` authZ + CI isolation tests) | 7 (DB-enforced schema boundary, weaker than separate DBs) | 9 (strongest physical-ish boundary + per-tenant keys, `REQ-SEC-03`) |
| Scalability (15%) | 8 (proven path to thousands of tenants on one fleet) | 5 (schema count becomes a catalog/connection bottleneck) | 4 (per-tenant DB sprawl caps tenant density) |
| Maintainability (15%) | 8 (single migration, single backup pipeline) | 5 (N schemas to migrate/observe) | 4 (N databases, keys, backups to operate) |
| **Weighted total** | **7.35** | **6.25** | **6.30** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → Shared-schema 7.92 / Schema 6.12 / DB-per 5.16 — **no flip**
- Perf@40% → 7.36 / 6.40 / 6.56 — **no flip**
- Reliab@40% → 7.36 / 6.40 / 6.56 — **no flip**
- Risk@40% → 7.08 / 6.40 / 6.84 — **no flip** (Shared-schema still leads even when Risk dominates, because its Cost/Scal/Maint lead offsets the isolation gap)
- Scalability@40% → 7.64 / 5.84 / 5.44 — **no flip**
- Maintainability@40% → 7.64 / 5.84 / 5.44 — **no flip**

**Decision:** **Shared-schema + row-level isolation**, with `REQ-SEC-01` tenant-scoped authZ enforced in the Tenant Isolation Layer on *every* data path and `REQ-SEC-03` per-tenant at-rest key separation layered on top. **Robust** — survives all six re-weights, including Risk@40%. Residual risk **`RSK-01` stays open** (a missing RLS predicate is an `S1` cross-tenant breach): mitigation is mandatory CI isolation tests (`TC-VER-TBD` for `REQ-SEC-01`, `MOP-11` target 0) plus a pre-GA pen-test (Concept §9). New opportunity **`OPP-01`** (provable isolation as a sales differentiator) is reinforced. Premium-tier customers needing a hard boundary can be offered DB-per-tenant later without re-architecting the authZ layer — captured as new **`OPP-02`** (isolation-tier upsell).

### DM-02 — Erasure strategy across backups  (→ DEC-02)

Decision: how is candidate PII erased across primary store, search index, object storage, **and backups** within 30 days? Serves `REQ-SEC-08` (erase ≤30 d + auditable proof), `REQ-O-04` (retention limits), `REQ-D-01` (GDPR Art. 17), `SN-05`; concentrates `RSK-02` (incomplete erasure, **Critical** band, I=5) and `TPM-04`. **Weights:** Cost 15 · Perf 10 · Reliab 15 · **Risk 30** · Scal 10 · Maint 20 (Risk dominates — this is the top legal/privacy exposure; Maint up because erasure runs forever as live operational toil).

| Criterion (W) | Hard-delete + backup rewrite | Per-record crypto-erase (per-tenant/per-subject keys) | Tombstone + TTL purge |
|---|---|---|---|
| Cost (15%) | 4 (rewriting/re-encrypting full backup sets on each request is expensive at scale) | 7 (destroy the key, not the ciphertext; cheap per request) | 8 (cheapest — defer to natural backup expiry) |
| Performance (10%) | 5 (heavy I/O; erasure jobs contend with live traffic) | 8 (key destruction is O(1); no bulk rewrite on hot path) | 7 (purge deferred, but live index must still tombstone fast) |
| Reliability (15%) | 6 (rewrite jobs can fail/partial mid-set, leaving PII) | 8 (deterministic — key gone = ciphertext unrecoverable, provable) | 6 (PII lingers in unexpired backups → window > legal limit) |
| Risk (30%) | 5 (high chance of missed copy = `RSK-02` breach) | 9 (crypto-erase per NIST SP 800-88; strongest auditable proof for `REQ-SEC-08`) | 6 (TTL > 30 d in long-retention backups breaches `REQ-SEC-08`) |
| Scalability (10%) | 5 (cost/time grows with backup volume) | 8 (scales with key count, not data volume) | 7 (scales, but bounded by retention policy) |
| Maintainability (20%) | 5 (bespoke rewrite tooling per store) | 8 (uniform "revoke key + record proof" across all stores) | 6 (must reconcile TTL vs legal window per tenant) |
| **Weighted total** | **5.00** | **8.15** | **6.50** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → 4.72 / 7.72 / 7.04 — **no flip**
- Perf@40% → 5.00 / 8.00 / 6.76 — **no flip**
- Reliab@40% → 5.28 / 8.00 / 6.48 — **no flip**
- Risk@40% → 5.00 / 8.28 / 6.48 — **no flip**
- Scalability@40% → 5.00 / 8.00 / 6.76 — **no flip**
- Maintainability@40% → 5.00 / 8.00 / 6.48 — **no flip**

**Decision:** **Per-record crypto-erase** — candidate PII is encrypted under a per-tenant/per-subject key; erasure (`REQ-SEC-08`) destroys the key, rendering ciphertext in primary, index, object storage, and backups irrecoverable per **NIST SP 800-88 Rev. 1**, and writes a tamper-evident completion record (`REQ-SEC-04`). **Robust** — wins every re-weight by a wide margin. This is the direct mitigation that moves **`RSK-02`** toward retirement and sets **`TPM-04`** (100% erasure ≤ 30 d). Requires key-management discipline (KMS per-tenant separation, also satisfies `REQ-SEC-03`); residual risk that a key is reused or backed up in cleartext is raised as new **`RSK-07`** (key-lifecycle defect undermines crypto-erase, L=2/I=5 → High) for the Security thread.

### DM-03 — Multi-region availability topology  (→ DEC-03)

Decision: what regional topology meets the availability + failover commitments? Serves `REQ-O-01` (≥99.9%/mo, `MOP-09`, `TPM-01`), `REQ-O-02` (zone-failure failover, RTO≤15 m/RPO≤5 m, `MOP-10`), `SN-06`/`SN-07`; concentrates `RSK-03` (SLO miss under load). **Weights:** Cost 20 · Perf 15 · **Reliab 25** · Risk 10 · Scal 20 · Maint 10 (Reliability dominates — it is the headline `TPM-01` commitment; Cost and Scalability matter because infra cost scales per region).

| Criterion (W) | Active-passive (warm standby, 2-region) | Active-active multi-region | Single-region multi-AZ |
|---|---|---|---|
| Cost (20%) | 7 (standby capacity idle but < full duplicate) | 4 (full duplicate fleet + cross-region data egress) | 9 (one region; lowest infra TCO) |
| Performance (15%) | 6 (passive region cold-ish; cross-region writes on failover) | 8 (serve from nearest region; best global p95 for `REQ-P-01`) | 7 (good in-region; no geo-proximity benefit) |
| Reliability (25%) | 7 (regional failover meets `REQ-O-02`; RTO bounded by promote time) | 9 (no single-region SPOF; best `REQ-O-01`/`TPM-01`) | 5 (survives AZ loss per `REQ-O-02` but a region outage breaches `REQ-O-01`) |
| Risk (10%) | 7 (well-understood DR pattern; modest data-sync risk) | 6 (active-active write-conflict / multi-master complexity raises defect risk) | 6 (region-outage exposure is a known residual `RSK-03`) |
| Scalability (20%) | 6 (scale the active region; standby must track) | 9 (add regions horizontally as tenant base globalizes) | 5 (vertical/AZ scaling ceiling in one region) |
| Maintainability (10%) | 7 (one active control plane; periodic failover drills) | 5 (two live control planes, conflict resolution to operate) | 8 (simplest — one region to run) |
| **Weighted total** | **6.65** | **7.15** | **6.50** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → A-passive 6.76 / **A-active 6.04** / Single-region **7.32** — **FLIP to Single-region** (plausible if budget is hard-capped; **overridden** here because `REQ-O-01`/`TPM-01` is a contractual SLO, not a nice-to-have — a region outage breaching 99.9% is an `S1` SLA event).
- Perf@40% → 6.48 / 7.16 / 6.76 — **no flip** (Active-active)
- Reliab@40% → 6.76 / 7.44 / 6.20 — **no flip** (Active-active; reinforces the choice on its dominant criterion)
- Risk@40% → **A-passive 6.76** / A-active 6.60 / 6.48 — **FLIP to Active-passive** (plausible: active-active multi-master conflict risk is real; **mitigated** by phasing — start active-passive, evolve to active-active, see decision below)
- Scalability@40% → 6.48 / 7.44 / 6.20 — **no flip** (Active-active)
- Maintainability@40% → 6.76 / 6.32 / **Single-region 7.04** — **FLIP to Single-region** (plausible for a lean SRE team; **overridden** by the same SLO argument as Cost@40%).

**Decision:** **Active-active multi-region as the target topology**, **phased** — **launch active-passive (warm 2-region)** to meet `REQ-O-02` (RTO≤15 m/RPO≤5 m, `MOP-10`) at GA, then promote to active-active as tenant geography and volume justify the Cost/Maint premium. **Sensitive** (flips under Cost@40%, Risk@40%, Maint@40%). All three flips are *plausible* up-weights but each is **overridden or absorbed by the phasing**: the Cost/Maint flips to single-region are rejected because single-region cannot meet the `REQ-O-01` 99.9% SLO through a region outage (`S1` SLA breach); the Risk flip to active-passive is exactly the launch posture, so the phasing *adopts* that finding rather than ignoring it. The active-active multi-master conflict concern is logged as new **`RSK-08`** (write-conflict/replication-lag defect, L=2/I=4 → Medium) to be retired before the active-active promotion. The launch-vs-target split itself is the residual that ties to `RSK-03`.

### DM-04 — Identity build vs. buy  (→ DEC-04)

Decision: build SAML 2.0 / SCIM 2.0 in-house, or buy a managed IdP-broker SDK/service? Serves `REQ-INT-01` (SAML SSO), `REQ-INT-02` (SCIM provisioning, `MOP-07`), `REQ-SEC-05` (MFA), `SN-03`; affects time-to-value (`MOE-07`, `RSK-05`). **Weights:** **Cost 25** · Perf 10 · Reliab 10 · **Risk 25** · Scal 10 · Maint 20 (Cost + Risk + Maint dominate — identity is a non-differentiating commodity where a security defect is severe and in-house maintenance is perpetual). *Two same-level alternatives (a buy and a build); comparing at the capability level, both must deliver `REQ-INT-01/02` and `REQ-SEC-05`.*

| Criterion (W) | Managed IdP broker (buy) | In-house SAML/SCIM (build) |
|---|---|---|
| Cost (25%) | 7 (per-MAU/connection fee, but no build/maintain payroll) | 5 (no license fee, but heavy build + perpetual spec-tracking effort = higher 5-yr TCO) |
| Performance (10%) | 7 (broker adds a hop; ample for an auth flow, not on `REQ-P-01` hot path) | 7 (in-process, comparable) |
| Reliability (10%) | 8 (vendor SLA + battle-tested connectors across many IdPs) | 6 (our own uptime + edge-case coverage across Okta/Entra/Google) |
| Risk (25%) | 8 (vendor carries SAML signature-validation/SCIM CVE surface; lock-in is the trade — mitigated by standard protocols) | 4 (we own every SAML assertion-validation defect — a class of `S1` auth-bypass vulns; raises `RSK` surface) |
| Scalability (10%) | 8 (scales with the SaaS; new IdP connectors are vendor-supplied) | 6 (every new IdP quirk is our backlog) |
| Maintainability (10%→20%) | 9 (vendor maintains connectors/protocol drift) | 4 (we chase SAML/SCIM spec + IdP-vendor changes forever, `RSK-04`-adjacent) |
| **Weighted total** | **7.85** | **4.95** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → buy 7.60 / build 5.24 — **no flip**
- Perf@40% → 7.60 / 5.80 — **no flip**
- Reliab@40% → 7.88 / 5.52 — **no flip**
- Risk@40% → 7.88 / 4.96 — **no flip**
- Scalability@40% → 7.88 / 5.52 — **no flip**
- Maintainability@40% → 8.16 / 4.96 — **no flip**

**Decision:** **Buy — managed IdP broker** for SAML 2.0 SSO (`REQ-INT-01`), SCIM 2.0 provisioning (`REQ-INT-02`, `MOP-07`), and MFA enforcement (`REQ-SEC-05`), exposed behind TalentFlow's own Identity & SSO Gateway block (SysRS §12.1). **Robust** — wins every re-weight decisively; identity is commodity and the security-defect cost of owning assertion validation is the dominant argument. Residual risk **`RSK-09`** (IdP-broker vendor lock-in / pricing power, L=3/I=2 → Low) is accepted and bounded by using standard SAML/SCIM/OIDC so the broker is replaceable; this lock-in is recorded against `REQ-INT-01/02` for the Risk thread. Buying accelerates `MOE-07` time-to-value and helps retire `RSK-05`.

### DM-05 — Search / indexing platform  (→ DEC-05)

Decision: what backs tenant-partitioned candidate search at the latency target? Serves `REQ-F-02` (tenant-scoped search), `REQ-P-01` (read p95≤400 ms, `MOP-05`, `TPM-02`), `MOP-02`, `SN-01`/`SN-07`; must preserve tenant isolation (DM-01). **Weights:** Cost 15 · **Perf 30** · Reliab 10 · Risk 15 · **Scal 20** · Maint 10 (Performance + Scalability dominate — search relevance/latency is the felt UX, and the index must grow with the whole tenant base).

| Criterion (W) | OpenSearch (self-managed cluster) | Managed Elasticsearch/OpenSearch service | Postgres full-text search (FTS) |
|---|---|---|---|
| Cost (15%) | 6 (cluster infra + our ops time) | 5 (managed premium per node/hour) | 9 (reuses the primary datastore; no new system) |
| Performance (30%) | 8 (purpose-built inverted index; meets `REQ-P-01` with relevance ranking) | 8 (same engine, managed; comparable p95) | 5 (FTS workable for small corpora; relevance/latency degrade with volume → misses `REQ-P-01` at scale) |
| Reliability (10%) | 7 (we own cluster health, shard recovery) | 8 (managed multi-AZ, vendor-operated recovery) | 6 (search load competes with transactional load on the primary store) |
| Risk (15%) | 6 (we operate isolation-correct indexing; cluster-ops defect surface) | 8 (managed isolation primitives + per-index ACLs; supports DM-01 partitioning) | 7 (stays inside the already-audited Postgres trust boundary) |
| Scalability (20%) | 8 (horizontal shard scaling for index growth) | 8 (elastic managed scaling) | 4 (FTS does not scale to large multi-tenant index volume) |
| Maintainability (10%) | 6 (cluster upgrades, shard rebalancing = SRE toil) | 8 (vendor handles upgrades/patching) | 8 (one fewer system to operate) |
| **Weighted total** | **7.10** | **7.55** | **6.10** |

**Sensitivity (each criterion → 40%):**
- Cost@40% → OpenSearch 6.60 / Managed 6.80 / **Postgres FTS 7.20** — **FLIP to Postgres FTS** (plausible *only* if Cost is the overriding driver; **rejected** — Performance/Scalability are the stakeholder-stated dominant criteria for search (`SN-07`, `REQ-P-01`), and FTS demonstrably misses `REQ-P-01` at multi-tenant volume, so a 40% Cost weighting contradicts the requirement priority).
- Perf@40% → 7.16 / 7.64 / 6.08 — **no flip** (Managed)
- Reliab@40% → 6.88 / 7.64 / 6.36 — **no flip** (Managed)
- Risk@40% → 6.60 / 7.64 / 6.64 — **no flip** (Managed)
- Scalability@40% → 7.16 / 7.64 / 5.80 — **no flip** (Managed)
- Maintainability@40% → 6.60 / 7.64 / 6.92 — **no flip** (Managed)

**Decision:** **Managed Elasticsearch/OpenSearch service** for tenant-partitioned candidate search, with per-tenant index partitioning that honors the DM-01 isolation contract (`REQ-SEC-01`) and meets `REQ-F-02` / `REQ-P-01` (`MOP-05`, `TPM-02`). **Sensitive only under Cost@40%**, where it flips to Postgres FTS; that flip is **rejected** because search is explicitly Performance/Scalability-dominated (`SN-07`) and FTS misses the `REQ-P-01` latency target at scale — a 40% Cost weighting is implausible for this specific decision. Managed (vs. self-managed OpenSearch) wins on Maintainability/Reliability for the SRE team (`STK-07`) at an acceptable cost premium. Per-tenant index partitioning is a new interface seam — raise **`ICD-TBD`** (Search service ↔ Tenant Isolation Layer index-scoping contract) for Phase 04 to freeze at CDR.

---

## 3. Decision Register (DEC-01…DEC-05)

Five-column register per Conventions §2.3; each row is an ADR stub (Context → Decision → Status → Consequences). `DM-NN` ↔ `DEC-NN` share the two-digit sequence. Status `Proposed` until accepted at **PDR**, then baselined; thereafter changed only via a `CR-NN` (Phase 09).

| DEC-NN | Decision (→ DM-NN) | Choice | Sensitivity-robust? | Linked REQs / RSK / OPP |
|---|---|---|---|---|
| **DEC-01** | Tenant isolation model (DM-01) | Shared-schema + row-level isolation, authZ on every path | **Yes** (survives all re-weights, incl. Risk@40%) | REQ-SEC-01, REQ-SEC-03, REQ-C-01; RSK-01 (open), OPP-01, OPP-02 |
| **DEC-02** | Erasure across backups (DM-02) | Per-record crypto-erase (per-tenant/subject keys) | **Yes** (robust, wide margin) | REQ-SEC-08, REQ-O-04, REQ-D-01, REQ-SEC-04; TPM-04, RSK-02 (mitigated), RSK-07 (new) |
| **DEC-03** | Availability topology (DM-03) | Active-active **target**, launch active-passive (phased) | **No** — flips under Cost/Risk/Maint@40%; flips overridden by SLO or absorbed by phasing | REQ-O-01, REQ-O-02; MOP-09/10, TPM-01, RSK-03, RSK-08 (new) |
| **DEC-04** | Identity build vs. buy (DM-04) | Buy — managed IdP broker behind own SSO Gateway | **Yes** (robust, every re-weight) | REQ-INT-01, REQ-INT-02, REQ-SEC-05; MOP-07, MOE-07, RSK-05, RSK-09 (new, accepted) |
| **DEC-05** | Search platform (DM-05) | Managed Elasticsearch/OpenSearch, per-tenant partitioned | Mostly — flips only under Cost@40% (rejected as implausible for this decision) | REQ-F-02, REQ-P-01; MOP-05/02, TPM-02, ICD-TBD |

### ADR bodies (stubs)

- **DEC-01 — Tenant isolation = shared-schema + RLS.** *Context:* `RSK-01` cross-tenant breach is the catastrophic-impact item; density/cost favors a shared fleet. *Decision:* shared-schema + row-level isolation, with `REQ-SEC-01` tenant-scoped authZ enforced in the Tenant Isolation Layer and `REQ-SEC-03` per-tenant at-rest keys. *Status:* **Proposed** (→ PDR). *Consequences:* lowest TCO and best scalability; isolation correctness now depends on every query carrying its tenant predicate → mandatory CI isolation tests (`TC-VER-TBD`, `MOP-11`=0) + pre-GA pen-test; DB-per-tenant remains an upsell path (`OPP-02`).
- **DEC-02 — Erasure = per-record crypto-erase.** *Context:* `RSK-02` (incomplete erasure) is the top legal exposure; backups make hard-delete impractical within 30 d. *Decision:* encrypt PII under per-tenant/subject keys; erase = destroy key + record proof, per NIST SP 800-88. *Status:* **Proposed** (→ PDR; DPIA evidence). *Consequences:* deterministic, auditable erasure across all stores (`REQ-SEC-08`, `TPM-04`); creates a hard dependency on key-lifecycle correctness → `RSK-07`.
- **DEC-03 — Availability = phased active-passive → active-active.** *Context:* `REQ-O-01` 99.9% is contractual; active-active is costly/complex to operate from day one. *Decision:* launch active-passive (warm 2-region) meeting `REQ-O-02` RTO/RPO; evolve to active-active. *Status:* **Proposed** (→ PDR). *Consequences:* meets the SLO at GA without paying full active-active Cost/Maint immediately; the matrix is *sensitive* and the single-region flips are explicitly overridden by the SLO; multi-master promotion gated on retiring `RSK-08`.
- **DEC-04 — Identity = buy (managed IdP broker).** *Context:* SAML/SCIM are commodity; assertion-validation defects are `S1` auth-bypass risks; in-house carries perpetual maintenance. *Decision:* buy a managed broker behind TalentFlow's own SSO Gateway, on standard SAML/SCIM/OIDC. *Status:* **Proposed** (→ PDR). *Consequences:* fastest time-to-value (`MOE-07`), vendor carries protocol drift; accepted lock-in `RSK-09` bounded by protocol portability.
- **DEC-05 — Search = managed Elasticsearch/OpenSearch.** *Context:* search is Performance/Scalability-dominated (`SN-07`, `REQ-P-01`); FTS misses latency at scale; self-managed adds SRE toil. *Decision:* managed search with per-tenant index partitioning honoring DM-01. *Status:* **Proposed** (→ PDR). *Consequences:* meets `REQ-P-01`/`REQ-F-02` with vendor-operated scaling; Cost@40% flip rejected; new index-scoping interface → `ICD-TBD` (freeze at CDR).

---

## 4. COCOMO software-effort estimate

TalentFlow is **software-only** (Concept §3, SysRS §1.2), so COCOMO runs on the *whole* scope. Constants are the Boehm Basic set from the Phase 05 method; **every value is computed from the constants** (`E=a·KLOC^b`, `T=c·E^d`, `N=E/T`) — none copied from any worked example. Numbers are recomputed and back-checked for self-consistency (`T=c·E^d`, `N=E/T`).

### 4.1 Size basis (KLOC by module)

Estimate per SysRS §12.1 blocks (new code; excludes the bought IdP broker per DEC-04 and managed search engine per DEC-05 — only our integration glue is counted there). Each figure is an engineering estimate, marked `TODO`-refinable once Phase 04 detailed design exists.

| Module (SysRS §12.1) | KLOC |
|---|---|
| Identity & SSO Gateway (broker integration, MFA, role mapping) | 14 |
| Tenant Isolation Layer (authZ-on-every-path, RLS enforcement) | 9 |
| Candidate Pipeline Service (stages, transitions, scorecards) | 16 |
| Search & Indexing Service (partitioning, query glue to managed search) | 11 |
| Scheduling & Email Integration Service | 10 |
| Job-board & HRIS Integration Service | 9 |
| Privacy & Erasure Service (consent, export, cascade + crypto-erase) | 13 |
| Audit Service (tamper-evident PII logging) | 7 |
| Billing Service (tokenized Stripe) | 6 |
| Careers Portal (public application capture) | 8 |
| Recruiter Web App (primary UI) | 22 |
| Platform / API gateway, rate-limit & quota, observability | 17 |
| **Total** | **142 KLOC** |

**Project type = Semi-Detached** — 142 KLOC sits in the Semi-Detached band (50–300 KLOC), and the team mixes deep experience (SaaS, identity, cloud) with novel constraints (provable multi-tenant isolation, crypto-erase). Constants: a=3.0, b=1.12, c=2.5, d=0.35.

### 4.2 Basic COCOMO

```
E = a·KLOC^b = 3.0 · 142^1.12      = 772.1 person-months
T = c·E^d    = 2.5 · 772.1^0.35    = 25.62 months
N = E / T    = 772.1 / 25.62       = 30.1 → 31 engineers (avg staff)
```
Back-check: `c·E^d = 2.5·772.1^0.35 = 25.62` ✓ ; `E/T = 772.1/25.62 = 30.13` ✓.

### 4.3 Intermediate COCOMO (15 cost drivers → EAF)

| Category | Driver | Rating | Multiplier | Why |
|---|---|---|---|---|
| Product | RELY | High | 1.15 | Privacy/isolation defects are `S1`; SLA + SOC 2 obligations |
| | DATA | High | 1.08 | Large multi-tenant data + search index |
| | CPLX | High | 1.15 | Tenant isolation, crypto-erase cascade, multi-region |
| Hardware | TIME | Nom | 1.00 | No exec-time constraint (managed cloud) |
| | STOR | Nom | 1.00 | Elastic managed storage |
| | VIRT | Nom | 1.00 | Stable managed platform |
| | TURN | Nom | 1.00 | Interactive CI/CD |
| Personnel | ACAP | High | 0.86 | Strong analysts |
| | AEXP | High | 0.91 | Team knows SaaS/ATS domain |
| | PCAP | High | 0.86 | Strong programmers |
| | VEXP | High | 0.90 | Cloud-experienced |
| | LEXP | High | 0.95 | Language-experienced |
| Project | MODP | High | 0.91 | Modern Agile practices (Concept §4) |
| | TOOL | High | 0.91 | Modern toolchain / CI/CD |
| | SCED | Nom | 1.00 | Nominal schedule |

```
EAF   = 1.15·1.08·1.15·1.00·1.00·1.00·1.00·0.86·0.91·0.86·0.90·0.95·0.91·0.91·1.00 = 0.681
E_int = EAF · a·KLOC^b = 0.681 · 772.1   = 525.5 person-months
T     = c·E_int^d      = 2.5 · 525.5^0.35 = 22.39 months
N     = E_int / T      = 525.5 / 22.39    = 23.5 → 24 engineers
```
Back-check: `c·E_int^d = 2.5·525.5^0.35 = 22.39` ✓ ; `E_int/T = 525.5/22.39 = 23.47` ✓. The capable, experienced team (EAF 0.681 < 1) pulls effort down ~32% from Basic — the realistic planning figure.

### 4.4 Sensitivity (±20% KLOC, Intermediate)

| Scenario | KLOC | E_int (PM) | T (mo) | N (eng) |
|---|---|---|---|---|
| −20% | 113.6 | 409.3 | 20.52 | 19.95 → 20 |
| **Nominal** | **142** | **525.5** | **22.39** | **23.47 → 24** |
| +20% | 170.4 | 644.6 | 24.05 | 26.80 → 27 |

A ±20% size swing moves effort from ~409 to ~645 PM (≈ ±22%) and schedule from ~20.5 to ~24 months — schedule is far less elastic than effort because `T` scales as `E^0.35`, so adding scope buys months slowly.

### 4.5 Team-plan implication & critical path

~24 average engineers over ~22 months. The **critical path** is the privacy/security/isolation spine — Tenant Isolation Layer (DEC-01), Privacy & Erasure Service (DEC-02), and Identity Gateway (DEC-04) — because these gate the Conditional-Go conditions (Concept §5) and the `RSK-01`/`RSK-02` mitigations that must clear PDR before broad feature build. Staffing should front-load senior security/SRE engineers onto that spine and parallelize the Recruiter Web App / Careers Portal feature streams behind it.

### 4.6 Modern complements

COCOMO Basic/Intermediate is a calibration sanity-check, not the plan of record. Complement with **COCOMO II** (17 effort multipliers + 5 scale factors, Agile-friendly — better fit for the Concept §4 Agile lifecycle), **story-points + team velocity** for sprint-level forecasting, and a **Monte-Carlo schedule simulation** to wrap the 22-month point estimate in a probability band rather than a single number. All inputs (KLOC, driver ratings) are `TODO`-refinable once Phase 04 detailed design firms the size basis.

---

## 5. Exit gate — Decisions traced

Gate: **Decisions traced** (Conventions §1).

- [x] 3–5 strategic decisions identified — DM-01…DM-05, taken from SysRS §12.2 (Phase 04 `Tech_Stack_Rationale.md` is `TODO`; reconcile or raise a `CR-NN` when authored).
- [x] Every decision has a `DM-NN` matrix with 2–4 same-level, compatible alternatives (DM-04 is a same-capability buy-vs-build pair).
- [x] Criteria cover Cost, Performance, Reliability, Risk, Scalability, Maintainability; weights sum to 100% per decision and each ties to a REQ/stakeholder (§1). Safety not a criterion — tailored out project-wide (SysRS §8).
- [x] Every cell scored 1–10 with a derivable justification; no 10 awarded without GA evidence (all `TODO` for Phase 07/10).
- [x] Sensitivity analysis present for every decision (each criterion → 40%); flips flagged with plausibility judgement (DM-03 sensitive/overridden, DM-05 one rejected flip, DM-01/02/04 robust).
- [x] `Decision_Register.md` content present as §3 — 5-column, `DEC-NN`, each links ≥ 1 REQ, each row an ADR stub.
- [x] COCOMO produced (software-only, 142 KLOC ≥ 10 KLOC): Basic + Intermediate, recomputed and self-consistent (`T=c·E^d`, `N=E/T` back-checked).
- [x] No score, total, or COCOMO number copied from a worked example; all recomputed for TalentFlow.
- [x] New risks/opportunities pushed to the Risk thread: **RSK-07** (key-lifecycle), **RSK-08** (active-active write-conflict), **RSK-09** (IdP lock-in, accepted), **OPP-02** (isolation-tier upsell); existing **RSK-01/02/03/05** updated; **OPP-01** reinforced.

**On PDR sign-off:** status → `Baseline (PDR-approved YYYY-MM-DD)`; DM/DEC become part of the **allocated baseline** (Conventions §3); thereafter changes only via a `CR-NN` (Phase 09).
