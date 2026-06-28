---
Document: Experiment Plan — EXP-<nn> <SHORT NAME>
Document ID: EXP-<PRODUCT_SLUG>-<nn>-v0.1
Status: Draft
Owner: <role/name — default: Product Manager>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 13 · Experimentation & A/B Testing (skill: pm-phase-13-experimentation).
This is the PRE-REGISTRATION. Written and LOCKED *before* launch — that lock is the whole point;
it kills peeking and HiPPO cherry-picking. Status arc: Draft → In Review (pre-reg locked) →
Living (running) → Superseded by Experiment_Readout.md. One plan per experiment (EXP-<nn>).
P13 is a CONTINUOUS phase — it owns NO lifecycle gate; each experiment passes a per-experiment
health check (see §10), not a one-time gate.
Conforms to ../05_Conventions.md: IDs §3 (EXP/MET/ASM/OPP/OBJ/KR/SOL/FEAT/DEC/RSK), spine §4,
status/frontmatter §6, outcomes-over-outputs §7, citations §8.
Frameworks: Hypothesis template · OEC (Kohavi, Trustworthy Online Controlled Experiments) ·
primary/guardrail/diagnostic taxonomy · power analysis & MDE · frequentist fixed-horizon ·
sequential mSPRT / group-sequential (2026 default) · Bayesian · CUPED · multi-armed bandits ·
SRM / A-A · one-way vs two-way door · interleaving & holdouts (AI features).
Replace every <ANGLE_BRACKET>; leave unknowns as `TODO: <what — who — by when>`. NEVER invent a
metric, lift, p-value, or sample size — show the calc or mark it TODO. Delete example rows first.
Related templates: Experiment_Readout.md (the decision artifact this becomes) ·
Measurement_Plan.md / KPI_Scorecard.md (source of every MET-*) · Assumption_Map.md (the ASM-*).
-->

## 0. Is this even A/B-testable? (gate this BEFORE anything else)

<!-- A/B testing everything is an anti-pattern. ALL four must be "yes" to proceed. If any is
"no", recommend the right alternative and STOP — do not default to A/B. -->

| Check | Yes/No | Note |
|-------|--------|------|
| Enough traffic for statistical **power**? | <y/n> | <est. eligible units/week> |
| **Reversible** (two-way door) decision? | <y/n> | <one-way-door/compliance → don't A/B> |
| Clean, instrumented **primary metric**? | <y/n> | <MET-<nn>; instrumentation live per G8?> |
| **Not** an obvious / compliance / legally-mandated change? | <y/n> | <if obvious → just ship> |

> **If any answer is "no":** alternative chosen = `<qual test / painted-door / before-after w/ caveats / expert review / ship-with-holdout>`. Rationale logged as `DEC-<nn>`. **Stop here.**

## 1. Hypothesis (falsifiable — no hypothesis, no experiment)

<!-- Template is load-bearing. Must be disconfirmable: state the effect AND its direction. -->

> **We believe `<change>` causes `<effect + direction>` for `<segment>`, measured by `<primary MET-<nn>>`, because `<INS-<nn> insight / ASM-<nn> assumption>`.**

- **Plain-English prediction:** <what we expect to see, and roughly how much>
- **We are WRONG if:** <the disconfirming result — write it now, before launch>

## 2. Traceability (cross-reference by ID — never re-describe; spine §4)

- **Assumption de-risked:** `ASM-<nn>` — <one line> <!-- from 07_Solution/Assumption_Map.md; an EXP tests an ASM, not a whim -->
- **Opportunity served:** `OPP-<nn>` — <one line> <!-- from 04_Opportunity -->
- **Outcome / OKR:** `OBJ-<nn>` / `KR-<nn>` — <the outcome this ladders to> <!-- outcomes over outputs §7 -->
- **Parent solution / feature:** `SOL-<nn>` / `FEAT-<nn>`
- **Origin (optional):** `FB-<nn>` feedback theme / `PRD` `EXP-TBD` seed this resolves

> Spine for this phase: `SOL ──▶ ASM ──tested by──▶ EXP ──▶ MET`.

## 3. Metrics & decision rule (OEC + guardrails + diagnostics)

<!-- One — and only one — primary decision metric (Kohavi's OEC). 2-3 guardrails = the metrics
you REFUSE to harm. Diagnostics explain *why* but never decide. ALL chosen from the Measurement
Plan — reused, never invented. -->

| Role | Metric | Direction wanted | Source | Why it / threshold |
|------|--------|------------------|--------|--------------------|
| **Primary OEC** | `MET-<nn>` <name> | ↑ / ↓ | Measurement_Plan | the single ship decider |
| **Guardrail 1** | `MET-<nn>` <name> | must not worsen > X% | Measurement_Plan | trust/revenue/latency floor |
| **Guardrail 2** | `MET-<nn>` <name> | must not worsen > X% | Measurement_Plan | <…> |
| **Guardrail 3** *(opt)* | `MET-<nn>` <name> | must not worsen > X% | Measurement_Plan | <…> |
| Diagnostic | `MET-<nn>` <name> | — (explains why) | Measurement_Plan | not a decider |

> **DECISION RULE (state up front, freeze it):** Ship **iff** the primary OEC wins by ≥ the MDE (§5) at the pre-set significance **AND** no guardrail is breached **AND** the effect is **business-significant** (§ readout). A stat-sig lift below business significance, or any guardrail breach, is a **no-ship**.

## 4. Design

- **Method:** `<frequentist fixed-horizon | sequential (mSPRT / group-sequential) | Bayesian | multi-armed bandit>` <!-- 2026 default for continuous monitoring = sequential. Bandit for exploit-while-learning across many short-lived variants. "Bayesian" is NOT a license to peek. -->
- **Why this method:** <one line trade-off vs. the alternatives>
- **Variants:** Control = `<…>` · Treatment(s) = `<…>` · split = `<50/50 / …>`
- **Randomization unit:** `<user / session / account / cluster>` <!-- must match the metric's grain to avoid leakage -->
- **CUPED / variance reduction:** `<yes — pre-period covariate <…> | no — why>` <!-- ~30-40% fewer users if pre-period data exists -->
- **Targeting / eligibility:** <who is in the experiment; exclusions>
- **Delivery:** behind feature flag `<flag-name>` <!-- launch dark; flag off = control -->

## 5. Power analysis (compute UP FRONT — never run an underpowered test)

<!-- Show the calculation or its source; do not paste an unverified number. If traffic can't
reach the sample size in a reasonable runtime, DO NOT RUN — recommend an alternative. -->

| Parameter | Value | Note |
|-----------|-------|------|
| Baseline (primary metric) | <x%> | from Measurement_Plan / KPI_Scorecard |
| **MDE** (min. detectable effect) | <rel. % / abs.> | smallest *business-worthwhile* lift, not the smallest detectable |
| **Alpha** (significance) | 0.05 | two-sided unless justified |
| **Power** (1−β) | ≥ 0.80 | 0.80–0.90 typical |
| **Required sample size** | <n per arm> | TODO: show calc — `<formula/calculator/source>` |
| Eligible traffic | <units/week> | |
| **Runtime** | <≥ 1 full business cycle, ≥ 1 week> | full weekly seasonality; round UP to whole cycles |

> MDE basis: `<sourced benchmark range / prior EXP-<nn> / TODO: research — never a single fabricated number>`.

## 6. Trustworthiness (the anti-peeking + anti-noise commitments)

- **A/A test:** `<planned y/n — when>` <!-- confirms the pipeline is unbiased before trusting an A/B -->
- **SRM (sample-ratio-mismatch) check:** monitored live; if the observed split deviates from `<expected>` at p < 0.001, **the result is void** — debug, don't interpret.
- **Multiple-comparison correction:** `<n/a — single metric+variant | Bonferroni / BH-FDR — because >1 metric or variant>`
- **Stop rule (no naive peeking):** `<sequential boundary (mSPRT/O'Brien-Fleming) | fixed horizon: do NOT look until n/runtime reached>`
- **Pre-registered segments (the ONLY cuts allowed at readout):** `<segment 1>`, `<segment 2>` <!-- anything else post-hoc = fishing; treat as a new hypothesis -->

## 7. AI-feature notes (ONLY if testing a GenAI / model feature — else DELETE this section)

<!-- Classic A/B breaks on AI: dynamic variants, self-contaminating loops, proxy-metric
blindness, novelty inflation. Switch methods. -->

- **Measurement approach:** `<permanent holdout | interleaving | response-quality eval>` instead of a one-shot classic A/B.
- **Response-quality metric:** `<MET-<nn> — e.g. task success / human-intervention rate / eval score>`
- **Novelty / primacy handling:** <plan to watch for decay over the run window>
- **EU AI Act Art. 50 transparency:** AI variant disclosed to users under test? `<y/n — how>` <!-- non-negotiable floor -->

## 8. Risks & ethics (Responsible floor — non-negotiable)

| `RSK-<nn>` | Risk | L×I (§5.3) | Mitigation / guardrail |
|-----------|------|------------|------------------------|
| RSK-<nn> | <e.g. guardrail metric harmed> | <1-5×1-5> | <the guardrail above> |
| RSK-<nn> | <e.g. dark-pattern / harm to a segment> | <…> | <no dark-pattern variant; accessibility held> |

- **No metric is optimized at users' expense; no dark-pattern variant; guardrails encode trust + accessibility.** A velocity gain that breaches a guardrail is a no-ship.

## 9. Logistics

- **Owner:** <name> · **Analyst / DS:** <name> · **Eng:** <name>
- **Start:** <YYYY-MM-DD> · **Planned end:** <YYYY-MM-DD> (from §5 runtime) · **Platform:** `<Statsig / Datadog Experiments / GrowthBook / PostHog / …>`
- **Pre-reg LOCK confirmed by:** <name> on <YYYY-MM-DD> — `DEC-<nn>` <!-- after this, the plan is frozen; changes require a new version -->

## 10. Per-experiment health check (the done-when list — not a lifecycle gate)

- [ ] §0 passed — this *should* be an A/B test (else alternative chosen + logged).
- [ ] Falsifiable hypothesis; traces to an `ASM-<nn>` and an `OPP-<nn>`/`OBJ-<nn>`.
- [ ] One primary **OEC** + 2-3 guardrails + diagnostics, all from the Measurement Plan; **decision rule frozen**.
- [ ] **Pre-registered before launch:** MDE, alpha, power ≥ 0.8, sample size, runtime ≥ 1 full cycle; method chosen; analysis plan locked.
- [ ] Trustworthiness: A/A + SRM, randomization unit, multiple-comparison correction, no-naive-peeking stop rule.
- [ ] Responsible floor: no harmful/dark-pattern variant; guardrails protect trust/accessibility; Art. 50 if AI; `RSK-<nn>` logged.

## 11. Open items / TODO

- TODO: <missing metric, unconfirmed power, instrumentation owed — who — by when>

---
*Owning skill: **pm-phase-13-experimentation**. Upstream: pm-phase-12-analytics (supplies the OEC + guardrail `MET-*`) · pm-phase-07-solution-design (the `ASM-*` tested). On completion this plan is **Superseded by `Experiment_Readout.md`**. Winners → pm-phase-11-launch-gtm rollout or `GX-*` in pm-phase-15-growth. Cross-cutting: Metrics & Experimentation (engine), Responsible Product (floor), Continuous Discovery, Stakeholder Management.*
