---
Document: Experiment Readout — EXP-<nn> <SHORT NAME>
Document ID: EXPR-<PRODUCT_SLUG>-<nn>-v0.1
Status: Draft
Owner: <role/name — default: Product Manager>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 13 · Experimentation & A/B Testing (skill: pm-phase-13-experimentation).
The DECISION artifact — one per experiment (EXP-<nn>). Read against the FROZEN Experiment_Plan.md;
report only what was pre-registered. When finalized, set Status to:
`Approved (readout <YYYY-MM-DD>)`. This readout SUPERSEDES the matching Experiment_Plan.md.
Lead with the call (BLUF) — this is the alignment artifact that kills HiPPO cherry-picking.
Conforms to ../05_Conventions.md: IDs §3 (EXP/MET/ASM/OPP/DEC/RSK/GX), spine §4,
status/frontmatter §6, outcomes-over-outputs §7.
Frameworks: OEC (Kohavi) · statistical vs business significance (separated) · SRM / A-A ·
sequential vs fixed stop rule · novelty/primacy check · Ship/Iterate/Kill/Inconclusive call.
Replace every <ANGLE_BRACKET>; leave unknowns as `TODO:`. NEVER invent a lift, CI, or p-value —
report the measured number or mark it TODO. Most experiments lose or are flat — that IS learning.
Related templates: Experiment_Plan.md (the pre-registration this answers) · Measurement_Plan.md.
-->

## 0. BLUF — the call (one line, read this first)

> **`<Ship | Iterate | Kill | Inconclusive-extend>`** — `<the change>` `<did / did not>` move `<primary MET-<nn>>` (`<effect, CI>`); guardrails `<held / breached>`. Logged as `DEC-<nn>`.

## 1. What ran (link the frozen plan — do not restate it)

- **Plan:** `Experiment_Plan.md` (`EXP-<PRODUCT_SLUG>-<nn>`) · **method:** `<fixed / sequential / Bayesian / bandit>`
- **Hypothesis tested:** <one line, copied from the plan §1>
- **Window:** <YYYY-MM-DD> → <YYYY-MM-DD> (`<n>` full business cycles) · **units exposed:** <n per arm>
- **Decision rule (from plan §3, verbatim):** Ship iff primary wins ≥ MDE **AND** no guardrail breached **AND** business-significant.

## 2. Result vs. the decision rule

| Metric | Role | Control | Treatment | Effect (Δ) | 95% CI | Stat-sig? | Verdict |
|--------|------|---------|-----------|------------|--------|-----------|---------|
| `MET-<nn>` | **Primary OEC** | <x> | <y> | <rel/abs Δ> | [<lo>, <hi>] | <y/n> | <win/flat/loss> |
| `MET-<nn>` | Guardrail 1 | <x> | <y> | <Δ> | [..] | — | **<held / BREACHED>** |
| `MET-<nn>` | Guardrail 2 | <x> | <y> | <Δ> | [..] | — | **<held / BREACHED>** |
| `MET-<nn>` | Diagnostic | <x> | <y> | <Δ> | [..] | — | explains why, not a decider |

- **Decision-rule outcome:** primary `<met/not met>` MDE · guardrails `<all held / N breached>` → rule says **`<ship / no-ship>`**.

## 3. Trustworthiness (was the result valid at all?)

<!-- If SRM fails, the experiment is VOID — debug, do not interpret the lift. -->

- **SRM check:** observed split `<a/b>` vs expected `<a/b>` → `<CLEAN (p ≥ 0.001) | FAILED — result void, see §6>`
- **A/A / pipeline:** `<clean | issue: …>`
- **Stop rule honored:** `<yes — sequential boundary crossed on <date> | yes — ran full fixed horizon | NO — stopped early, flag it>`
- **Multiple-comparison correction applied:** `<n/a | Bonferroni / BH-FDR>`

## 4. Significance — statistical AND business (keep them SEPARATE)

<!-- A stat-sig 0.1% lift that costs more than it earns is a no-ship. Always report both. -->

- **Statistical:** <p = … / posterior P(better) = … / CI excludes 0 → yes/no>
- **Business:** <€/$ impact, annualized · cost to build+run · net> <!-- TODO if not yet sized; do not guess -->
- **Business-significant?** `<yes — clears the worthwhile bar | no — stat-sig but not worth shipping>`

## 5. Segments & novelty (pre-registered cuts ONLY — no fishing)

| Pre-registered segment (from plan §6) | Primary effect | CI | Note |
|---------------------------------------|----------------|-----|------|
| `<segment 1>` | <Δ> | [..] | |
| `<segment 2>` | <Δ> | [..] | |

- **Any other cut is a HYPOTHESIS, not a finding** — record it for a future `EXP-<nn>`, do not act on it.
- **Novelty / primacy:** <did the effect decay/stabilize over the window? for AI/UI changes especially>

## 6. The call (the experiment-level analogue of Persevere/Pivot/Kill)

> **Call: `<Ship | Iterate | Kill | Inconclusive-extend>`**

| Call | When it applies | Chosen? |
|------|-----------------|---------|
| **Ship** | Primary won ≥ MDE, no guardrail breach, business-significant. | <✓/✗> |
| **Iterate** | Signal present but short of the bar; a sharper variant is worth a re-test. | <✓/✗> |
| **Kill** | Flat/negative or guardrail breach. *Stopping a bad build is the cheapest win on the board.* | <✓/✗> |
| **Inconclusive-extend** | Underpowered / below MDE / SRM-void → extend or stop; never narrate noise as a win. | <✓/✗> |

- **Rationale:** <2-3 lines tying the call to §2-§4>
- **Decision logged:** `DEC-<nn>` in `_threads/Decision_Log.md` · **decided by:** <name> on <YYYY-MM-DD>

## 7. Learning & loop (what we now believe — outcomes over outputs)

- **Assumption updated:** `ASM-<nn>` now `<confirmed / disconfirmed / still open>` <!-- a disconfirmed ASM is a finding, not a failure -->
- **Opportunity / metric impact:** updates `OPP-<nn>` · `MET-<nn>` baseline moved to `<…>` (update Measurement_Plan / KPI_Scorecard).
- **Next move:**
  - Ship → rollout via **pm-phase-11-launch-gtm** (`<flag ramp plan>`), keep a holdout? `<y/n>`
  - Iterate → new `EXP-<nn>` (link the sharper hypothesis)
  - Kill → feed `OPP-<nn>` / reopen discovery (**pm-phase-03-discovery**)
  - Growth lever → seed `GX-<nn>` in **pm-phase-15-growth**
- **New risks surfaced:** `RSK-<nn>` <!-- e.g. a guardrail that nearly breached -->

## 8. Open items / TODO

- TODO: <business sizing owed, rollout owner, follow-up EXP — who — by when>

---
*Owning skill: **pm-phase-13-experimentation**. Supersedes the matching `Experiment_Plan.md`. P13 owns no lifecycle gate — but a readout feeding a real gate (G9 launch, G4 roadmap) still gets the six-thread review. Downstream: pm-phase-11-launch-gtm (rollout) · pm-phase-15-growth (`GX-*`) · pm-phase-03-discovery (losing/flat → reopen). Cross-cutting: Metrics & Experimentation (engine), Stakeholder Management (the readout is the alignment artifact, BLUF), Continuous Discovery, Responsible Product.*
