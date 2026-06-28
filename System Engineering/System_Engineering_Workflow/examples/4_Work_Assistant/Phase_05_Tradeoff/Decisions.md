---
Document: Aria — Trade-off & Decision (Decision Matrices · Register · COCOMO)
Document ID: DEC-ARIA-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Decision Management) · INCOSE SE Handbook v5 (2023)
Status: Draft
Owner: Lead Systems Engineer
---

# Phase 05 — Trade-off & Decision: Aria

> This file consolidates the Phase-05 deliverables (`Decision_Matrices`, `Decision_Register`, `COCOMO_Estimate`) for the flagship example. It makes every strategic choice left open by the SysRS §12 design preview **auditable**: each is a weighted decision matrix (1–10) with a mandatory sensitivity check (each criterion → 40%), recorded as a numbered decision (`DEC-*`) traced to the REQ(s) it serves. IDs are stable for the project life (Conventions §2). All weights, scores, and COCOMO figures were computed for *this* project — none copied from any other example. Exit gate: **Decisions traced** (Conventions §1, §3). This phase conforms to Conventions for all IDs, gates, the 1–10 scale, S1–S4 severity, and standard citations — it never redefines them.

The five strategic decisions are named (names only) in `Phase_02_Requirements/SysRS.md` §12 — `DEC-01/DM-01` (LLM choice & routing), `DEC-02/DM-02` (RAG architecture), `DEC-03/DM-03` (build-vs-buy agent/connectors), `DEC-04/DM-04` (token/secrets storage), `DEC-05/DM-05` (AI-action-safety pattern). Each earns a full matrix because reversing it later is expensive (provider contract, data-migration, re-architecture, or a frozen trust boundary) **and** it drives a top MOE/MOP/TPM. Because Aria is software-heavy + LLM-agentic, a COCOMO estimate (§7) is produced and recomputed from the constants.

---

## 1. Criteria & weights (this trade study)

The six-criterion default set (Conventions / Phase-05 stage skill). Weights are negotiated **per decision** against the stakeholder priority that dominates it, and each weight ties to a real REQ/stakeholder so the matrix is defensible — not taste. Trust-critical decisions (`DM-04`, `DM-05`) up-weight **Risk** because the governing needs (SN-02/-03/-04) are zero-tolerance (`MOE-04 = 0`); the LLM/RAG decisions (`DM-01`, `DM-02`) up-weight **Performance** because grounding/latency are the product (TPM-01, MOP-02/-04).

| Criterion | Definition (KB-anchored) | How its score is *derived* here |
|---|---|---|
| **Cost** | 5-yr TCO: build (COCOMO §7) + run (per-task model spend, hosting, managed-service fees) + lifecycle. | TCO line items; per-task model-tier price ($/MTok); managed-vs-self-host OpEx. |
| **Performance** | Chat latency, groundedness/accuracy, throughput. | MOP-02 (≤10 s p95), MOP-04/TPM-01 (≥95% grounded), eval-set scores. |
| **Reliability** | Availability, graceful degradation, fault tolerance. | MOP-07 (≥99.5%), MOP-08, provider/managed-service SLA. |
| **Risk** | Injection/exfiltration surface, vendor lock-in, data-residency/compliance, supply chain. | Pull from `RSK-*` (Concept §8) + `THR-*` threat thread; GDPR/ISO-27001 posture. |
| **Scalability** | Headroom to 5,000 concurrent users + per-user data growth. | MOP-03; elasticity of the chosen tier/store. |
| **Maintainability** | Ease of model/prompt change-control, connector upkeep, operability. | Change-impact surface; SN-13/SCN-07 eval-gated rollout fit. |

| Decision | Cost | Performance | Reliability | Risk | Scalability | Maintainability | Weight driver |
|---|---|---|---|---|---|---|---|
| **DM-01** LLM choice & routing | 20% | 25% | 10% | 20% | 10% | 15% | Perf=TPM-01/MOP-02; Risk=RSK-07/REQ-C-02 |
| **DM-02** RAG architecture | 15% | 25% | 15% | 20% | 15% | 10% | Perf=TPM-01; Risk=RSK-02 isolation |
| **DM-03** Build-vs-buy agent/connectors | 20% | 15% | 15% | 20% | 15% | 15% | Cost=Phase-05 COCOMO; Risk=lock-in |
| **DM-04** Token/secrets storage | 15% | 10% | 20% | 30% | 10% | 15% | Risk=RSK-04 (S1 token theft) |
| **DM-05** AI-action-safety pattern | 10% | 15% | 20% | 30% | 10% | 15% | Risk=RSK-01/-03, HAZ-01/-02 |

Each row sums to 100%. **Reliability** is kept (not tailored out) — Aria's multi-source dependency makes it material (MOP-07/-08). Score justifications are parenthetical and cite the method that produced them; no `10` appears without verifiable evidence (none is asserted here — top scores cap at 9 pending measured eval/SLA data, with TODO where a real project would measure).

---

## 2. DM-01 — LLM choice & task-tier routing  (→ DEC-01)

**Decision:** Which model(s) power the agent, and how tasks are routed across cost/quality tiers (serves REQ-P-04 routing, REQ-P-05/TPM-01 groundedness, REQ-P-02 latency, REQ-INT-05 model API, REQ-C-02 no-train term, SN-13). Same-level alternatives = **hosted-frontier-provider routing strategies vs a single-model baseline** (vendor-vs-vendor, one abstraction level).

- **A — Claude tiered routing** (Opus 4.8 hardest-reasoning + Sonnet 4.6 everyday + Haiku 4.5 cheap/fast, routed by task class). Reference prices/limits: `claude-opus-4-8` $5/$25 per MTok, 1M context, 128K output; `claude-sonnet-4-6` $3/$15, 1M context, 64K output; `claude-haiku-4-5` $1/$5, 200K context, 64K output.
- **B — GPT-class tiered routing** (a frontier flagship + mid + small tier from a second hosted provider).
- **C — Open-weight self-host** (run an open-weight model family on-prem/VPC GPUs for full data-residency control).
- **D — Single top-model only** (Opus-class for every task, no routing).

| Criterion (W) | A: Claude tiered | B: GPT-class tiered | C: Open-weight self-host | D: Single top-model |
|---|---|---|---|---|
| Cost (20%) | 6 (tiered spend: ~90% routine on Sonnet/Haiku per REQ-P-04 keeps $/task low; Opus only for hard reasoning) | 6 (comparable tiered $/MTok) | 8 (no per-token fee, but GPU CapEx/OpEx + MLOps — net cheaper at very high volume only) | 3 (Opus-on-everything ~3–5× the per-task cost; fails REQ-P-04 economics) |
| Performance (25%) | 9 (frontier reasoning for hard tasks + adaptive thinking; best fit for TPM-01 groundedness & MOP-02 latency at the right tier) | 8 (frontier-competitive; tool-calling mature) | 6 (open-weight trails frontier on grounded multi-tool agentic tasks; quality risk to TPM-01) | 9 (top model every task — same ceiling as A's top tier) |
| Reliability (10%) | 8 (provider SLA + multi-tier fallback; refusal-fallback to a peer model in-call) | 8 (provider SLA) | 6 (self-run availability = our SRE burden; no vendor SLA) | 8 (single provider SLA) |
| Risk (20%) | 9 (contractual no-train/no-retain term per REQ-C-02; region pinning per REQ-C-01; tier routing limits blast radius; provider lock-in is the residual → OPP/RSK) | 7 (equivalent terms, but two-provider sprawl if mixed; comparable lock-in) | 6 (max data-residency control, but **we** own model-safety/jailbreak hardening for RSK-01 — larger security-eng surface) | 8 (one provider; same terms as A but no cheap-tier exposure) |
| Scalability (10%) | 8 (hosted elasticity to MOP-03's 5,000 users; 1M context headroom) | 8 (hosted elasticity) | 7 (scales only as fast as we provision GPUs) | 7 (hosted, but cost scales punishingly) |
| Maintainability (15%) | 8 (one SDK/tool-calling surface across tiers; eval-gated model/prompt change-control per SCN-07 is clean) | 7 (mature SDK; second-provider ops if mixed) | 5 (model upgrades, quantization, GPU drivers — heaviest upkeep) | 8 (one model, simplest) |
| **Weighted total** | **8.05** | **7.25** | **6.35** | **7.15** |

**Sensitivity (each criterion → 40%, remaining 60% split equally at 12% each):**
- Cost@40% → **A** (A 7.44, B 6.96, C 6.80, D 6.00) — no flip.
- Performance@40% → **A** (A 8.28, B 7.52, C 6.24, D 7.68) — no flip.
- Reliability@40% → **A** (8.00, 7.52, 6.24, 7.40) — no flip.
- Risk@40% → **A** (8.28, 7.24, 6.24, 7.40) — no flip.
- Scalability@40% → **A** (8.00, 7.52, 6.52, 7.12) — no flip.
- Maintainability@40% → **A** (8.00, 7.24, 5.96, 7.40) — no flip.

**Robust:** A wins under every re-weight. Even up-weighting Cost (C's strength) does not flip — C's GPU TCO advantage materializes only above Aria's projected volume, and it loses on the Performance/Risk criteria that carry the product.

**Decision:** **A — Claude tiered routing** (Opus 4.8 / Sonnet 4.6 / Haiku 4.5, routed by task class per REQ-P-04, defaulting routine work off the highest-cost tier ≥90% of the time → MOP-10). This serves TPM-01/MOP-04 (frontier grounding), MOP-02 (latency at the right tier), REQ-C-02 (contractual no-train term), and SN-13 (steer cost/quality). **Residual risk → `RSK-08` (single-LLM-provider lock-in)**, mitigated by keeping the model behind the `Agent Orchestrator` tool-calling abstraction (a model-API ICD seam, ICD-05) so a second provider can be added without re-architecture. The cheaper-than-expected tiered-routing run cost is logged as **`OPP-02`** (cost differentiator feeding MOE-01). `task_budget` per agentic loop is set as a `TPM`-style control to cap runaway spend (tracked in Phase 10).

---

## 3. DM-02 — RAG retrieval & grounding architecture  (→ DEC-02)

**Decision:** How the agent grounds answers in the employee's own data with per-user isolation and citations (serves REQ-F-06 grounding+citation, REQ-P-05/TPM-01, REQ-SEC-03 per-user isolation, REQ-F-04 cited summaries, RSK-02/-03). Same-level alternatives = **retrieval/index strategies**.

- **A — Managed vector DB + hybrid retrieval** (managed embedding store, per-user namespace/partition, hybrid dense+lexical retrieval + citation layer).
- **B — Self-hosted OSS vector DB** (run an open-source vector store ourselves, same hybrid retrieval).
- **C — Keyword/metadata-only** (no embeddings; rely on each connector's native search + filters).

| Criterion (W) | A: Managed + hybrid | B: Self-host OSS | C: Keyword/metadata-only |
|---|---|---|---|
| Cost (15%) | 7 (managed fee, but near-zero index ops; pay-per-use scales with adoption) | 6 (no license fee, but we run/scale/patch the store — SRE OpEx) | 8 (cheapest — reuses connector search, no index to host) |
| Performance (25%) | 8 (hybrid dense+lexical maximizes recall→groundedness for TPM-01; sub-second retrieval supports MOP-02) | 8 (same retrieval quality if we operate it well) | 6 (lexical-only misses paraphrase/semantic matches → lower grounded-answer rate; quality risk to TPM-01) |
| Reliability (15%) | 8 (managed SLA + replication) | 7 (our HA burden) | 7 (rides connector availability — degrades exactly when an upstream does, RSK-06) |
| Risk (20%) | 8 (per-user namespace enforces REQ-SEC-03 isolation; encryption + residency controls per REQ-C-01; managed surface is smaller) | 7 (we own isolation correctness & patching — larger pen-test surface for RSK-02) | 6 (no index to leak, but every query re-hits source APIs live → harder to bound least-privilege; weaker citation provenance) |
| Scalability (15%) | 7 (managed elastic to MOP-03; per-user partitions shard cleanly) | 8 (full control of sharding if we invest) | 6 (bounded by connector rate limits, REQ-C-03/REQ-INT-06) |
| Maintainability (10%) | 8 (no index plumbing; embedding-model swaps are config) | 6 (store upgrades, reindexing, backups on us) | 7 (nothing to maintain, but citation/grounding logic is bespoke) |
| **Weighted total** | **7.70** | **7.15** | **6.55** |

**Sensitivity (each criterion → 40%, rest 12% each):**
- Cost@40% → **A** (7.48 / 6.72 / 7.04) — no flip (C closes the gap but stays behind).
- Performance@40% → **A** (7.76 / 7.28 / 6.48) — no flip.
- Reliability@40% → **A** (7.76 / 7.00 / 6.76) — no flip.
- Risk@40% → **A** (7.76 / 7.00 / 6.48) — no flip.
- Scalability@40% → **A** (7.48 / 7.28 / 6.48) — no flip (B's strength narrows but doesn't overtake).
- Maintainability@40% → **A** (7.76 / 6.72 / 6.76) — no flip.

**Robust:** A wins under every re-weight. B's only edge (scalability control) is insufficient to flip given A's grounding/isolation/maintainability lead.

**Decision:** **A — Managed vector DB + hybrid retrieval with per-user namespacing and a citation layer.** This satisfies REQ-F-06 (grounding + per-fact citation), REQ-P-05/TPM-01 (≥95% grounded), and is the cleanest enforcement point for REQ-SEC-03 (per-user isolation via hard namespace partition — a cache/retrieval that cannot return another user's data). Retrieval feeds the **RAG Retrieval Service** block (SysRS §12 #4). Residual: managed-store residency must be region-pinned (REQ-C-01) and covered by the DPIA (REQ-D-01) — no new top risk; tracked under RSK-05.

---

## 4. DM-03 — Build-vs-buy: agent/tool-calling framework + the four connectors  (→ DEC-03)

**Decision:** How much of the agent/tool-calling layer and the four connectors we build vs buy (serves REQ-F-07 cross-system workflows, REQ-F-08 allow-list tools, REQ-INT-01..04 connectors, REQ-O-03 circuit breakers; Cost feeds the COCOMO scope §7). Same-level alternatives = **sourcing strategies at the same system scope**.

- **A — Buy framework + build connectors** (use the LLM provider's tool-calling/agent SDK; build the four connectors + Connector Gateway + guardrails in-house).
- **B — Full custom** (hand-roll the agent loop, tool dispatch, and all four connectors).
- **C — Turnkey iPaaS suite** (adopt a commercial integration-platform/agent suite that bundles connectors + orchestration).

| Criterion (W) | A: Framework + build | B: Full custom | C: Turnkey iPaaS |
|---|---|---|---|
| Cost (20%) | 6 (SDK removes agent-loop/tool-runner work — see §7 COCOMO scope; connectors are the bulk we still build) | 4 (highest build — reinvents tool-runner, streaming, retries → largest KLOC) | 8 (lowest build, but recurring per-seat license + connector fees long-term) |
| Performance (15%) | 8 (provider tool-runner is tuned for the chosen models; native parallel tool-use; supports MOP-02) | 8 (full control, if we get it right) | 6 (generic suite adds an abstraction hop; tool-calling not co-designed with our models) |
| Reliability (15%) | 8 (battle-tested SDK loop; we own connector circuit-breakers REQ-O-03) | 7 (every reliability behavior is our bug to find) | 6 (suite is a single shared dependency — its outage is ours, weakens RSK-06 posture) |
| Risk (20%) | 8 (thin, swappable SDK seam keeps lock-in low — ICD-05; we control the trust boundary & allow-list REQ-F-08) | 6 (no vendor lock-in, but **we** own all security-critical agent code → larger RSK-01 surface to red-team) | 5 (deepest lock-in; the suite sits inside the trust boundary and sees PII — expands GDPR/THR surface) |
| Scalability (15%) | 8 (SDK + our stateless connectors scale to MOP-03) | 7 (scales if we engineer it) | 6 (scales to the suite's tier limits/pricing) |
| Maintainability (15%) | 8 (SDK absorbs model/protocol churn; connectors are isolated modules) | 6 (we maintain everything, incl. provider-API drift) | 5 (captive to suite roadmap & breaking changes) |
| **Weighted total** | **7.60** | **6.20** | **6.05** |

**Sensitivity (each criterion → 40%, rest 12% each):**
- Cost@40% → **A** (7.20 / 5.68 / 6.56) — no flip (C's cheaper build can't overcome its risk/maintainability deficit).
- Performance@40% → **A** (7.76 / 6.80 / 6.00) — no flip.
- Reliability@40% → **A** (7.76 / 6.52 / 6.00) — no flip.
- Risk@40% → **A** (7.76 / 6.24 / 5.72) — no flip.
- Scalability@40% → **A** (7.76 / 6.52 / 6.00) — no flip.
- Maintainability@40% → **A** (7.76 / 6.24 / 5.72) — no flip.

**Robust:** A wins under every re-weight — including Cost@40%, the only criterion where C leads, because C's licence-cost tail and lock-in dominate the 5-yr TCO.

**Decision:** **A — Buy the agent/tool-calling framework (provider SDK), build the four connectors + Connector Gateway + guardrails in-house.** This realizes REQ-F-07/-08 and REQ-INT-01..04 while keeping the trust boundary and allow-list under our control (REQ-SEC-07). It also sets the **COCOMO build scope** in §7 (connectors + agent integration + RAG + eval harness, *not* a from-scratch agent loop). Residual lock-in is the same `RSK-08` seam from DM-01 (one SDK), held swappable via ICD-05.

---

## 5. DM-04 — Token / secrets storage & rotation  (→ DEC-04)

**Decision:** Where per-user OAuth tokens and secrets live and how they rotate (serves REQ-SEC-04 encrypted/rotated/revocable tokens, REQ-SEC-05 encryption-at-rest, REQ-SEC-02 delegated scopes, SCN-06 revocation; mitigates RSK-04 token theft — **S1**). **Risk is up-weighted to 30%** because a single token store exposes all four systems at once. Same-level alternatives = **secrets-management approaches**.

- **A — Managed cloud KMS + secrets vault** (managed key-management + secrets service, envelope encryption, automated rotation, fine-grained IAM).
- **B — Self-hosted vault** (run an open-source secrets manager ourselves).
- **C — App-level encrypted DB column** (encrypt tokens in an application column with an app-managed key).

| Criterion (W) | A: Managed KMS/vault | B: Self-host vault | C: App DB column |
|---|---|---|---|
| Cost (15%) | 6 (per-secret/per-op fee, but no infra to run) | 5 (no fee, but HA cluster + patching + audit on us) | 8 (cheapest — reuses existing DB) |
| Performance (10%) | 8 (low-latency cached fetch; envelope decrypt is fast) | 7 (similar, if well-tuned) | 7 (in-DB read is fast, but key-mgmt in app adds hops) |
| Reliability (20%) | 9 (managed multi-AZ SLA; rotation without downtime) | 8 (our HA burden — quorum/unseal ops) | 5 (no rotation primitives; key-rollover is a manual migration) |
| Risk (30%) | 9 (HSM-backed keys, automated rotation per RFC 9700, per-user IAM scoping, immutable access audit feeds REQ-SEC-06; revocation within 5 min per REQ-SEC-04 — directly retires RSK-04) | 8 (strong if hardened, but **we** own the unseal-key custody & patch cadence — a self-inflicted S1 surface) | 4 (app-held key = single point of compromise; weak rotation; **does not** meet RFC 9700 BCP — leaves RSK-04 open) |
| Scalability (10%) | 8 (managed scale to all users/tokens) | 7 (scales as we provision) | 6 (column scales, key-mgmt doesn't) |
| Maintainability (15%) | 8 (rotation/policy as config; provider patches the engine) | 6 (engine upgrades, unseal drills, backups) | 6 (bespoke crypto code is ours to audit forever) |
| **Weighted total** | **8.20** | **7.05** | **5.60** |

**Sensitivity (each criterion → 40%, rest 12% each):**
- Cost@40% → **A** (7.44 / 6.32 / 6.56) — no flip (even where C is strongest).
- Performance@40% → **A** (8.00 / 6.88 / 6.28) — no flip.
- Reliability@40% → **A** (8.28 / 7.16 / 5.72) — no flip.
- Risk@40% → **A** (8.28 / 7.16 / 5.44) — no flip.
- Scalability@40% → **A** (8.00 / 6.88 / 6.00) — no flip.
- Maintainability@40% → **A** (8.00 / 6.60 / 6.00) — no flip.

**Robust:** A wins under every re-weight; C never approaches it because its weakest dimension (Risk) is the heaviest.

**Decision:** **A — Managed cloud KMS + secrets vault, envelope-encrypted, auto-rotated per RFC 9700, region-pinned.** Realizes REQ-SEC-04/-05, mitigates **RSK-04 (S1)**, and supplies the **Identity/Token Broker** block (SysRS §12 #6). Per-user IAM scoping reinforces REQ-SEC-02 least-privilege. The vault's access log feeds the immutable audit (REQ-SEC-06). Residency of the key material is part of the DPIA (REQ-C-01/REQ-D-01).

---

## 6. DM-05 — AI-action-safety pattern  (→ DEC-05)

**Decision:** The control pattern that guarantees no irreversible/externally-visible action without human approval and neutralizes injection (serves REQ-SAF-01/-02 HITL/destructive-action gates, REQ-F-09/-10 confirm/diff/cancel, REQ-F-08 allow-list, REQ-SEC-07/TPM-03 injection defense, REQ-SEC-06 audit; mitigates RSK-01/-03, HAZ-01/-02). **Risk up-weighted to 30%** — this is the system's defining trust property (MOE-04 = 0, MOE-05 = 100%). Same-level alternatives = **action-governance patterns**.

- **A — HITL confirmation-gate + allow-listed-tool guardrails + eval-gated releases** (the SysRS §12 #3/#7 design preview: every write proposed with a diff for explicit confirmation; untrusted content sandboxed; releases pass the injection/action-safety eval set).
- **B — Policy-LLM judge (semi-autonomous)** (a second "judge" model approves/denies each proposed write against a policy; human only sees flagged ones).
- **C — Autonomous writes with post-hoc audit only** (agent executes writes directly; an audit log enables after-the-fact review).

| Criterion (W) | A: HITL gate + guardrails + eval-gate | B: Policy-LLM judge | C: Autonomous + post-hoc audit |
|---|---|---|---|
| Cost (10%) | 7 (confirmation UI + sandbox + eval harness to build, but no per-write second-model spend) | 6 (every write pays a judge-model call → recurring cost; plus the policy to maintain) | 9 (cheapest — no gate, no judge, no eval harness) |
| Performance (15%) | 8 (one extra confirm step; agent prep work is parallelized; meets MOP-02) | 7 (judge call adds latency per write) | 9 (fastest — nothing in the write path) |
| Reliability (20%) | 9 (deterministic gate: a write *cannot* execute unconfirmed → MOP-05 = 0 by construction) | 8 (judge is probabilistic — a wrong approval is possible; weakens the guarantee) | 5 (no guard; an erroneous/hijacked write executes → fails MOE-04) |
| Risk (30%) | 9 (sandboxed untrusted content + allow-list refuses out-of-policy calls REQ-F-08; HITL stops every unconfirmed write REQ-SAF-01; eval-gate holds the line release-to-release REQ-SEC-07/TPM-03 — directly retires RSK-01/-03, HAZ-01/-02) | 7 (judge raises the bar but is itself injectable; a single mis-classify breaches SN-04 — non-zero residual on a zero-tolerance need) | 3 (post-hoc audit detects harm *after* it happens — unacceptable against MOE-04=0; injection → direct exfiltration) |
| Scalability (10%) | 8 (gate is stateless per action; scales with users) | 7 (judge call scales with write volume + cost) | 8 (no gate to scale) |
| Maintainability (15%) | 8 (policy = allow-list + eval set, versioned & change-controlled per SCN-07) | 6 (two prompts/models to keep aligned; judge drift) | 7 (less code, but every incident is a forensic + remediation cost) |
| **Weighted total** | **8.40** | **6.95** | **6.00** |

**Sensitivity (each criterion → 40%, rest 12% each):**
- Cost@40% → **A** (7.84 / 6.60 / 7.44) — no flip (C's cheapness can't overcome its Risk/Reliability collapse).
- Performance@40% → **A** (8.12 / 6.88 / 7.44) — no flip.
- Reliability@40% → **A** (8.40 / 7.16 / 6.32) — no flip.
- Risk@40% → **A** (8.40 / 6.88 / 5.76) — no flip.
- Scalability@40% → **A** (8.12 / 6.88 / 7.16) — no flip.
- Maintainability@40% → **A** (8.12 / 6.60 / 6.88) — no flip.

**Robust:** A wins under every re-weight. Notably, even Cost@40% and Performance@40% — where C (autonomy) is strongest — do not flip, because A's dominance on the two heaviest criteria (Risk 30%, Reliability 20%) is decisive. Choosing C would violate the project's non-waivable trust constraint (SN-04, MOE-04=0); it is rejected on principle, and the matrix confirms it.

**Decision:** **A — HITL confirmation-gate + allow-listed-tool guardrails + eval-gated releases.** This is the architecture's keystone trust control: it realizes REQ-SAF-01/-02, REQ-F-08/-09/-10, REQ-SEC-07, instantiates the **Agent Orchestrator / Action-Confirmation Gate** and **Untrusted-Content Sandbox + Tool Guardrails** blocks (SysRS §12 #3/#7), and retires RSK-01 (injection) and RSK-03 (hallucinated write) and mitigates HAZ-01/-02. It makes `MOP-05 = 0` a structural property rather than a hope. It introduces no new top risk; the eval-gate's own regression risk is RSK-07 (model/prompt drift), already logged.

---

## 7. COCOMO software-effort estimate

> Aria is **software-heavy + LLM-agentic** → COCOMO runs (Basic + Intermediate). Every value is computed from the constants — `E = a·KLOC^b`, `T = c·E^d`, `N = E/T` — and **back-checked** for self-consistency (`T = c·E^d`, `N = E/T` hold). Nothing is copied from any other example. The estimate scopes the **DM-03 = build** decision (buy the agent SDK; build connectors + gateway + RAG + guardrails + eval harness). It is a planning ROM; KLOC is an engineering estimate (TODO: refine post-PDR against actual module skeletons).

### 7.1 Assumptions & size basis
- **Type = Semi-Detached** (`a=3.0, b=1.12, c=2.5, d=0.35`): total ≈ **58 KLOC** sits in the 50–300 KLOC band; the team mixes strong systems engineers with a domain (LLM-agent/connector) that is still maturing — the textbook Semi-Detached profile. (Organic would under-model the security/agent complexity; Embedded over-models a system with no hard real-time/HW constraints.)
- The agent loop / tool-runner / streaming is **bought** (DM-03 = A) and excluded from KLOC; only our integration glue to the SDK is counted.
- Glue/config and IaC counted at a discount; test code excluded from the delivered-KLOC count (estimated separately).

### 7.2 Per-module KLOC breakdown (estimate)

| Module | KLOC | Note |
|---|---:|---|
| 4 connectors (Outlook/Graph, HubSpot, JIRA, Therefore) + Connector Gateway, circuit breakers | 18 | bulk of build; REQ-INT-01..04, REQ-O-03 |
| Agent Orchestrator integration (SDK glue, model-tier router, Action-Confirmation Gate) | 8 | DM-01/DM-05; REQ-P-04, REQ-SAF-01 |
| RAG Retrieval Service (indexing, hybrid retrieval, per-user namespacing, citation layer) | 7 | DM-02; REQ-F-06, REQ-SEC-03 |
| Untrusted-Content Sandbox + Tool Guardrails (allow-list, injection defense) | 5 | DM-05; REQ-SEC-07 |
| Identity / Token Broker (SSO/OIDC, delegated OAuth, KMS/vault integration) | 6 | DM-04; REQ-SEC-01..04 |
| Dashboard Aggregation Service (fan-out, eventual-consistency reconciliation) | 5 | REQ-F-01/-02, REQ-O-04 |
| Web Client (dashboard + AI chat UI) | 6 | REQ-F-01/-03, REQ-U-* |
| Audit Log Service (immutable, tamper-evident) | 3 | REQ-SEC-06 |
| **Total** | **58** | |

### 7.3 Basic COCOMO

`E = 3.0 · 58^1.12 = ` **283.24 PM** · `T = 2.5 · 283.24^0.35 = ` **18.04 mo** · `N = 283.24 / 18.04 = ` **15.70 → ≈16 engineers (avg)**.
Back-check: `c·E^d = 2.5·283.24^0.35 = 18.04` ✓ ; `E/T = 283.24/18.04 = 15.70` ✓.

### 7.4 Intermediate COCOMO (15 cost drivers → EAF)

| Driver | Rating | Multiplier | Why |
|---|---|---:|---|
| RELY required reliability | Very High | 1.40 | trust-critical writes, S1 token theft, zero-tolerance MOE-04 |
| DATA database size | High | 1.08 | per-user RAG indices + multi-source aggregation |
| CPLX product complexity | Very High | 1.30 | agent orchestration, tool-calling, injection defense, 4 protocols |
| TIME exec-time constraint | Nominal | 1.00 | latency budget is generous (≤10 s p95) |
| STOR storage constraint | Nominal | 1.00 | no tight storage limit |
| VIRT VM volatility | Nominal | 1.00 | stable cloud platform |
| TURN turnaround time | Nominal | 1.00 | interactive CD pipeline |
| ACAP analyst capability | High | 0.86 | strong SE/analyst team |
| AEXP applications experience | Nominal | 1.00 | LLM-agent domain is new to most teams |
| PCAP programmer capability | High | 0.86 | strong engineers |
| VEXP virtual-machine experience | Nominal | 1.00 | — |
| LEXP language experience | Nominal | 1.00 | — |
| MODP modern practices | High | 0.91 | agile + CD + eval-gated release |
| TOOL software tools | High | 0.91 | mature SDKs, CI, IaC |
| SCED required schedule | Nominal | 1.00 | no compression |

**EAF = Π(multipliers) = 1.2039.**
`E_int = EAF · a·KLOC^b = 1.2039 · 283.24 = ` **340.99 PM** · `T_int = 2.5 · 340.99^0.35 = ` **19.25 mo** · `N_int = 340.99 / 19.25 = ` **17.71 → ≈18 engineers (avg)**.
Back-check: `2.5·340.99^0.35 = 19.25` ✓ ; `340.99/19.25 = 17.71` ✓. The EAF > 1 is driven almost entirely by RELY+CPLX (the trust/agent complexity that defines Aria), partly offset by strong personnel (ACAP/PCAP) and modern tooling — a faithful reflection of the four hard problems in the README.

### 7.5 Sensitivity (±20% KLOC, Intermediate, EAF held)

| KLOC | E_int (PM) | T_int (mo) | N_int |
|---|---:|---:|---:|
| 46.4 (−20%) | 265.6 | 17.6 | 15.06 → ≈15 |
| 58.0 (nominal) | 340.99 | 19.25 | 17.71 → ≈18 |
| 69.6 (+20%) | 418.2 | 20.7 | 20.23 → ≈20 |

A ±20% size swing moves effort by roughly −22% / +23% and schedule by ~±1.2 mo — schedule is far less elastic than effort (the `T = c·E^d` exponent compresses it), so adding people past ~18 buys diminishing schedule compression. **Critical path** = the connector module (largest KLOC + external-API/rate-limit dependency) and the eval-harness, which gates every release (SCN-07).

### 7.6 Team-plan implication & modern complements
- ROM staffing ≈ **18 engineers** over ≈**19 months** at Intermediate nominal; phase the connector build and the agent/RAG/eval tracks in parallel (Phase 06 increments).
- **Complements** (note, not substitutes): COCOMO II (17 multipliers + 5 scale factors, agile-friendly) for re-estimation post-PDR; story-points + velocity for sprint-level planning; a Monte-Carlo wrap on the KLOC/EAF inputs to convert the point estimate into a probability band before committing the budget. These feed the Cost/Schedule/EVM cross-cutting thread.

---

## 8. Decision Register (`DEC-*` → choice → linked REQ)

Each row is an **ADR stub**: Context → Decision → Status → Consequences. Status per Conventions §6 (`Proposed` until PDR-baselined, then frozen; a later change goes through a `CR-*` in Stage 09). All five are `Accepted (pending PDR baseline)`.

| DEC-NN | Decision (→ DM-NN) | Choice | Sensitivity-robust? | Linked REQ / RSK / TPM |
|---|---|---|---|---|
| **DEC-01** | LLM choice & task-tier routing (DM-01) | Claude tiered routing — Opus 4.8 / Sonnet 4.6 / Haiku 4.5 by task class | **Yes** (no flip on any criterion) | REQ-P-04, REQ-P-05/**TPM-01**, REQ-P-02, REQ-INT-05, REQ-C-02; SN-13 · **RSK-08** (new, lock-in) · **OPP-02** (new) |
| **DEC-02** | RAG retrieval & grounding (DM-02) | Managed vector DB + hybrid retrieval, per-user namespacing + citation layer | **Yes** | REQ-F-06, REQ-F-04, REQ-P-05/**TPM-01**, REQ-SEC-03; SN-05 · RSK-02/-03/-05 |
| **DEC-03** | Build-vs-buy agent/connectors (DM-03) | Buy agent SDK; build 4 connectors + gateway + guardrails | **Yes** | REQ-F-07, REQ-F-08, REQ-INT-01..04, REQ-O-03; sets §7 COCOMO scope · **RSK-08** (shared seam) |
| **DEC-04** | Token / secrets storage (DM-04) | Managed cloud KMS + secrets vault, RFC 9700 rotation, region-pinned | **Yes** | REQ-SEC-02, REQ-SEC-04, REQ-SEC-05; SN-02/SN-12 · mitigates **RSK-04 (S1)** |
| **DEC-05** | AI-action-safety pattern (DM-05) | HITL confirmation-gate + allow-list guardrails + eval-gated releases | **Yes** | REQ-SAF-01/-02, REQ-F-08/-09/-10, REQ-SEC-07/**TPM-03**, REQ-SEC-06; SN-03/SN-04 · retires RSK-01/-03, mitigates HAZ-01/-02 |

### ADR bodies (condensed)
- **DEC-01 — Context:** four problem classes (hard reasoning vs cheap replies) and a contractual no-train requirement. **Decision:** tiered Claude routing behind the orchestrator tool-calling seam (ICD-05). **Consequences:** ≥90% of routine tasks off the top tier (MOP-10); single-provider lock-in held swappable; per-loop `task_budget` cap added to the TPM tracker.
- **DEC-02 — Context:** grounding is the core anti-hallucination control and the per-user isolation enforcement point. **Decision:** managed hybrid-retrieval vector store with hard per-user namespaces + citations. **Consequences:** clean REQ-SEC-03 boundary; store residency enters the DPIA.
- **DEC-03 — Context:** building the agent loop from scratch is wasted, security-sensitive effort. **Decision:** buy the SDK, build the connectors/gateway/guardrails. **Consequences:** sets the 58-KLOC COCOMO scope; trust boundary and allow-list stay in-house.
- **DEC-04 — Context:** one token store fronts all four systems → S1 if breached. **Decision:** managed KMS/vault, HSM-backed keys, auto-rotation, per-user IAM. **Consequences:** RSK-04 mitigated; vault access feeds the audit log; supplies the Identity/Token Broker.
- **DEC-05 — Context:** SN-04 (no unconfirmed write) and SN-03 (no hijack) are zero-tolerance. **Decision:** deterministic HITL gate + sandbox/allow-list + eval-gate. **Consequences:** `MOP-05 = 0` by construction; injection defense ≥99% target gated release-to-release (TPM-03); RSK-01/-03 retired.

### New risks/opportunities pushed to the Risk thread (Concept §8 register)

| ID | Description | L | I | Band | Source | Mitigation |
|---|---|---|---|---|---|---|
| **RSK-08** | Single-LLM-provider lock-in (DEC-01/DEC-03 share one SDK). | 2 | 3 | Medium | DM-01, DM-03 | Keep the model behind the ICD-05 tool-calling seam so a second provider can be added without re-architecture; periodic portability spike. |
| **OPP-02** | Tiered routing drives per-task cost well below a single-top-model baseline, strengthening the productivity-ROI case. | — | — | upside | DM-01 | Track realized $/task vs MOE-01; surface savings to STK-02. |

---

## 9. Exit gate — Decisions traced

| Gate item (Conventions §3 / stage skill) | Status |
|---|---|
| 3–5 strategic decisions, each from the SysRS §12 open-choice set | Met — DM-01…DM-05 / DEC-01…DEC-05 |
| Every decision has a `DM-NN` matrix with 2–4 same-level, compatible alternatives | Met (DM-01 has 4; DM-02..05 have 3 each) |
| Criteria = Cost/Performance/Reliability/Risk/Scalability/Maintainability; weights sum 100%, each tied to a REQ/stakeholder | Met (none tailored out) |
| Every cell scored 1–10 with a *derivable* justification (method named) | Met (parenthetical, method-cited; no asserted 10s) |
| Sensitivity analysis present for every decision (each criterion → 40%) | Met — all five robust, no flips; flips would carry a plausibility note |
| `Decision_Register` is 5-column, uses `DEC-NN`, links each to ≥1 REQ, each row an ADR stub | Met (§8) |
| COCOMO produced for software ≥ ~10 KLOC, recomputed, self-consistent (`T=c·E^d`, `N=E/T`) | Met (§7, back-checked) |
| No score/total/COCOMO number copied from another example | Met (all recomputed for Aria) |
| New risks/opportunities pushed to the Risk register | Met — RSK-08, OPP-02 |

**Recommendation:** **Decisions traced — proceed.** Baseline DEC-01…DEC-05 at **PDR** (Conventions §3); thereafter any change to a baselined decision goes through a `CR-*` (Stage 09). Next phase: `Phase_06_Integration` (increments, connector mocks, eval harness in CI — gate **CDR**). Carry **TPM-01/-02/-03** and the new `task_budget` cap into the TPM tracker (Phases 06–10).
