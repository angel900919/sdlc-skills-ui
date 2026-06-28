---
name: pm-phase-13-experimentation
description: Runs Phase 13 (Experimentation & A/B Testing) of the framework-agnostic PM operating system — prove a change with evidence, not opinion. It starts from a falsifiable hypothesis tied to a riskiest assumption (`ASM-*`) and an opportunity (`OPP-*`), pre-registers the design (one primary OEC `MET-*`, 2-3 guardrails, diagnostics, MDE, alpha, power, sample size, runtime) before launch, picks the right method (frequentist fixed-horizon / sequential mSPRT / Bayesian / multi-armed bandit), runs trustworthiness checks (A/A, SRM, multiple-comparison correction), and emits `Experiment_Plan.md` (pre-registration) plus an `Experiment_Readout.md` per experiment (`EXP-<nn>`) that separates statistical from business significance and lands a Ship / Iterate / Kill / Inconclusive call. It is a continuous phase — it owns no lifecycle gate; each experiment passes a per-experiment health check, not a one-time gate. Conforms to ../../05_Conventions.md. Use when you want to design or run an A/B test, write a hypothesis, do a power/sample-size analysis, choose a test method, decide whether something is even A/B-testable, read out a result, or set guardrails. Triggers on "run an A/B test", "design an experiment", "write a hypothesis", "power analysis", "sample size", "MDE", "is this result significant", "experiment readout", "sequential testing", "guardrail metric", "should we A/B test this", "CUPED", "multi-armed bandit", "holdout", "phase 13".
disable-model-invocation: true
user-invocable: true
---

# Phase 13 — Experimentation & A/B Testing

<what-to-do>
This phase turns a belief about a change into **causal evidence** — a pre-registered `Experiment_Plan.md` and a per-experiment `Experiment_Readout.md` (`EXP-<nn>`) that says, with discipline, whether the change moved the metric. It is **continuous — per experiment**: it switches on after launch and never turns off, and it owns **no lifecycle gate** (per [Conventions §1–§2](../../../pm-workflow/05_Conventions.md)); each experiment instead passes a **per-experiment health check / done-when**, not a one-time pass. It conforms in full to [../../05_Conventions.md](../../../pm-workflow/05_Conventions.md) — IDs (`EXP-*`/`MET-*`/`ASM-*`/`OPP-*`/`DEC-*`/`RSK-*`), the traceability spine, status strings, severity, and framework citations come from there; this skill never redefines them. The hard part is **which experiment is worth running** — that is human judgment; AI accelerates everything around it.

## Inputs (from prior phases)
- **`12_Analytics/Measurement_Plan.md` + `KPI_Scorecard.md`** — the `MET-*`, the North Star, and the guardrail set. The primary **OEC** metric is *chosen from here, never invented*. **Instrumentation must be live (G8)** — if the metric isn't measurable, the experiment is theatre.
- **`07_Solution/Assumption_Map.md` / `Solution_Validation.md`** — the riskiest assumptions `ASM-*`. An experiment tests an `ASM`, not a whim. The spine is `SOL ──▶ ASM ──tested by──▶ EXP ──▶ MET`.
- **`08_PRD/PRD.md`** — the `EXP-TBD` seeds left on risky requirements, plus the success `MET-*` and its guardrails.
- **`04_Opportunity/` + `01_Strategy/North_Star_and_OKRs.md`** — the `OPP-*` and `OBJ/KR` the experiment's metric must ladder up to (outcome, not output).
- **`14_Feedback/Feedback_Log.md`** — `FB-*` themes that spawn hypotheses worth testing.
- **Graceful fallback:** if `Measurement_Plan.md` is absent or instrumentation isn't live, do **not** fabricate results — run `pm-phase-12-analytics` first, or proceed and record `TODO: instrumentation owed; results provisional`. If traffic is too low for power or there's no clean metric, **do not run an underpowered A/B** — recommend an alternative (qual test, painted-door, before/after with caveats) and say so.

## Step-by-step
Interview-driven. Ask **one topic at a time** (one assistant message per topic), convert answers into the deliverable, show it back, then check the per-experiment health list. Use `AskUserQuestion` for finite choices. Reuse prior-phase facts; never re-ask them.

1. **Locate the project root & frame the decision (topic 1).** Read the inputs. First question with `AskUserQuestion`: *is this even A/B-testable?* — enough traffic for power, a **reversible (two-way-door)** decision, a clean primary metric, and **not** a compliance/obvious/one-way-door change. If any is "no", recommend the right alternative and stop — don't default to A/B. Default output: `<product-slug>/13_Experiments/Experiment_Plan.md`.
2. **Write a falsifiable hypothesis (topic 2).** Template: *"We believe [change] causes [effect] for [segment], measured by [primary `MET-*`], because [insight `INS-*` / assumption `ASM-*`]."* Tie it to the `ASM-*` it de-risks and the `OPP-*`/`OBJ` it serves. No falsifiable hypothesis → no experiment.
3. **Choose the OEC + guardrails + diagnostics (topic 3).** One primary decision metric (Kohavi's **OEC**), reused from the Measurement Plan; **2-3 guardrails** (the metrics you refuse to harm); diagnostics to explain *why*. State the decision rule up front: **ship iff primary wins AND no guardrail breached**.
4. **Pre-register the design (topic 4).** **Power analysis up front:** MDE, alpha, power (≥0.8) → required sample size and runtime (**full business cycles, ≥1 week**). Pick the method with `AskUserQuestion`: frequentist fixed-horizon / **sequential** (mSPRT / group-sequential — the 2026 default for continuous monitoring) / Bayesian / multi-armed bandit. Apply **CUPED** if pre-period data exists (~30-40% fewer users). **Lock the analysis plan before launch** — this is the anti-peeking commitment.
5. **Trustworthiness checks (topic 5).** Define the randomization unit; plan an **A/A** and a live **SRM** (sample-ratio-mismatch) check; **correct for multiple comparisons** if >1 metric/variant. Set the stop rule (sequential boundary or fixed horizon) — *no naive peeking*.
6. **AI-feature special handling (topic 6 — only if testing a GenAI/model feature).** Classic A/B breaks (dynamic variants, self-contaminating loops, proxy-metric blindness, novelty inflation). Switch to **permanent holdouts**, **interleaving**, and **response-quality metrics**. Skip this topic entirely for non-AI features — don't pad.
7. **Run & monitor (topic 7).** Launch behind a flag; monitor guardrails + SRM live; let AI flag anomalies. Do **not** stop at the first `p<0.05` unless the pre-registered sequential boundary is crossed.
8. **Readout (topic 8).** Write `Experiment_Readout.md`: result vs. the decision rule, **statistical *and* business significance separated**, guardrail status, and *only pre-registered* segment cuts (don't fish). Land the call: **Ship / Iterate / Kill / Inconclusive-extend**. Most experiments lose or are flat — that is learning; log it.
9. **Decide & loop.** Log `DEC-*`; update the `MET-*`; failed hypotheses feed `OPP-*`/discovery; winners roll out (`pm-phase-11-launch-gtm`) or seed growth experiments `GX-*` (`pm-phase-15-growth`). 
10. **Per-experiment health check.** Run the done-when list below before declaring the experiment closed.
11. **Handoff.** Print the plan + readout paths, the decision, and the next command.

## Decision points
- **A/B test, or not?** *How to decide:* only when traffic gives **power**, the decision is **reversible** (two-way door), and there's a **clean metric**. Low traffic, one-way-door, compliance, or obviously-correct changes → use alternatives (qual, painted-door, before/after, expert review, ship-with-holdout). A/B testing *everything* is an anti-pattern.
- **Which method?** *How to decide:* need to watch results and stop early safely → **sequential (mSPRT)** (the 2026 default). Exploit-while-learning across many short-lived variants (promos) → **bandit/Thompson**. One-shot, fixed sample, simple → **frequentist fixed-horizon**. "Bayesian" is *not* a license to peek without a sequential-valid rule.
- **Ship on a win?** *How to decide:* ship iff the primary OEC wins, **no guardrail is breached, and the effect is business-significant** — not merely statistically significant. A stat-sig 0.1% lift that costs more than it earns is a no-ship.
- **Borderline / tiny effect?** *How to decide:* if underpowered or below the MDE, it's **Inconclusive** — extend or stop. Never narrate noise as a win.
- **`EXP-*` here vs. `GX-*` in Growth?** *How to decide:* feature/product causal proof → `EXP-*` (this phase). An acquisition / activation / retention / monetization growth-loop lever → `GX-*` in `pm-phase-15-growth`, run on this same engine.

## Rules
- **Conform to [../../05_Conventions.md](../../../pm-workflow/05_Conventions.md)** for every ID, status string, the spine, severity/priority, and citation. Cross-reference sibling phases; never redefine shared conventions.
- **Pre-register before you peek.** Power analysis up front; lock the analysis plan; correct for multiple comparisons; no naive peeking in fixed-horizon tests.
- **Outcomes over outputs.** An experiment proves a *moved metric*, not that a feature shipped ([Conventions §7](../../../pm-workflow/05_Conventions.md)).
- **Statistical ≠ business significance.** Always report both, separately.
- **Expect most experiments to lose.** A flat/Kill result is valid validated learning, not failure.
- **AI accelerates, the human decides.** AI drafts and ranks hypotheses, generates variants, writes readouts, and flags SRM/anomalies; the human owns *which experiments matter* (the real bottleneck), the OEC, the guardrails/ethics, and the ship call. **Never invent results, lifts, or p-values** — unknowns become `TODO: <owed>`.
- **Responsible floor is non-negotiable.** Don't optimize a metric that harms users; no dark-pattern variants; guardrails protect trust + accessibility; EU AI Act Art. 50 transparency holds for AI variants under test.
- **Pivot & Kill are valid.** An experiment that stops a bad build is the cheapest win on the board.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [../../templates/](../../../pm-workflow/templates/) (`Experiment_Plan.md`, `Experiment_Readout.md`). Land in `<product-slug>/13_Experiments/` per [Conventions §9](../../../pm-workflow/05_Conventions.md) — one readout per `EXP-<nn>`.

### 1. `Experiment_Plan.md` — pre-registration (written *before* launch, then frozen)
```markdown
---
Document: Experiment Plan — EXP-<nn> <short name>
Document ID: EXP-<SLUG>-<nn>-v1.0
Status: Draft        # → In Review (pre-reg locked) → Living (running) → Superseded by Readout
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## 1. Hypothesis        "We believe [change] causes [effect] for [segment], by [primary MET-*], because [INS-*/ASM-*]."
## 2. Traceability      ASM-* de-risked · OPP-* / OBJ-KR served · parent SOL-* / FEAT-*
## 3. Metrics           Primary OEC (MET-*) · Guardrails (2-3 MET-*) · Diagnostics · **Decision rule**
## 4. Design            Method (fixed/sequential/Bayesian/bandit) · variants · randomization unit · CUPED y/n
## 5. Power             MDE · alpha · power (≥0.8) · sample size · runtime (≥1 full business cycle)
## 6. Trustworthiness   A/A plan · SRM check · multiple-comparison correction · stop rule (no naive peeking)
## 7. AI-feature notes  (if model) holdout / interleaving / response-quality metric · novelty handling
## 8. Risks & ethics    RSK-* · guardrail = harm/trust/accessibility floor · Art. 50 transparency if AI
```

### 2. `Experiment_Readout.md` — one per experiment (the decision artifact)
```markdown
---
Document: Experiment Readout — EXP-<nn> <short name>
Document ID: EXPR-<SLUG>-<nn>-v1.0
Status: Approved (readout <YYYY-MM-DD>)
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## 1. Result vs decision rule   primary OEC effect (CI) · guardrail status (pass/breach) · SRM clean?
## 2. Significance              statistical (p / posterior / CI) **AND** business (€/impact) — separated
## 3. Segments                  pre-registered cuts only (no fishing) · novelty/primacy check
## 4. Call                      Ship · Iterate · Kill · Inconclusive-extend — with rationale
## 5. Learning & loop           what we now believe (updates ASM-*/OPP-*) · DEC-* · next EXP / GX-* / rollout
```

## AI prompt pack
**ELICIT (draft a falsifiable hypothesis + pre-registration from evidence).**
> "Acting as a senior PM/experimenter, here is the riskiest assumption `ASM-<nn>`, the opportunity `OPP-<nn>`, and the available metrics. Draft a falsifiable hypothesis (We-believe-causes-because), pick the primary OEC + 2-3 guardrails from the supplied metrics only, and state the decision rule. Flag anything you cannot source as `TODO` — never invent a metric or a number."

**GENERATE (design + power the test).**
> "For this hypothesis and metric, recommend a method (fixed-horizon / sequential mSPRT / Bayesian / bandit) with the trade-off, compute the sample size for MDE `<x>` at alpha 0.05 / power 0.8 and the runtime in business cycles, and note whether CUPED applies. Add the A/A, SRM, and multiple-comparison checks. Show every calculation step; do not trust a printed number."

**CRITIQUE (red-team before launch).**
> "Red-team this experiment plan. Find: (1) peeking / no sequential rule, (2) underpowered / no power analysis, (3) statistical-vs-business significance conflation, (4) sub-weekly or arbitrary duration, (5) uncorrected multiple comparisons or post-hoc segment fishing, (6) dropped guardrails, (7) AI-feature measured with classic A/B, (8) a one-way-door/compliance change that shouldn't be A/B tested. Return: finding | severity | section | fix."

**GATE (run the per-experiment health check).**
> "Run the per-experiment done-when list and the six-thread review against this plan + readout. For each item: pass / `TODO` (owner+date) / waived (rationale). Recommend Ship · Iterate · Kill · Inconclusive-extend (the experiment-level analogue of Persevere/Pivot/Kill), with the evidence. Name the next command."

## Research & specialised-agent triggers
Reference [../../prompts/research-and-agents.md](../../../pm-workflow/prompts/research-and-agents.md).
- **Recommend WEB RESEARCH when:** you're about to set an **MDE / target lift** with no basis — pull a sourced benchmark range, never a single fabricated number (Trigger 3, P12/P13); or you're choosing/relying on an **experimentation vendor** whose ownership is in flux (Datadog↔Eppo, Statsig→Amplitude, VWO+AB Tasty) — weigh roadmap/ownership risk (Trigger 5). For any platform SDK/API, use the **Context7 docs MCP first**.
- **Talk to a CUSTOMER when:** a result is statistically clear but you don't understand *why*, or the change is low-traffic/qualitative — pair the quant with discovery (`pm-phase-03-discovery`); triangulate, don't data-worship.
- **Spawn a SPECIALISED AGENT when:** numbers must be re-derived — a **calc-verification agent** to independently recompute sample size / power / lift / CI with steps and ±20% sensitivity (don't trust the printed numbers); or an **experiment-backlog agent** to ICE/PIE-rank a large hypothesis list against evidence.

## Cross-cutting hooks
Links to [../../cross-cutting/](../../../pm-workflow/cross-cutting/).
- **Metrics, Analytics & Experimentation** — *this phase is the engine of the thread.* Every bet gets an `EXP-*` (or a stated reason it can't); guardrails and OEC come from the Measurement Plan; instrumentation hygiene from P12 is the precondition. → [`Metrics_and_Experimentation.md`](../../../pm-workflow/cross-cutting/Metrics_and_Experimentation.md).
- **Responsible Product** — *floor.* No metric optimized at users' expense; no dark-pattern variants; guardrails encode trust/accessibility; EU AI Act Art. 50 transparency for AI variants under test; new `RSK-*` logged. **Non-negotiable.** → [`Responsible_Product.md`](../../../pm-workflow/cross-cutting/Responsible_Product.md).
- **Continuous Discovery** — *feeds & is fed.* `FB-*`/`INS-*` spawn hypotheses; losing/flat experiments update `ASM-*`/`OPP-*` and reopen discovery. → [`Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md).
- **Stakeholder Management & Communication** — pre-registration kills HiPPO cherry-picking; the readout is the alignment artifact (lead with the decision, BLUF); ship/kill calls logged as `DEC-*`. → [`Stakeholder_Management.md`](../../../pm-workflow/cross-cutting/Stakeholder_Management.md).
- **Product Ops** — one living experiment registry, naming, and a standard pre-reg/readout template; an experiment review cadence. → [`Product_Operations.md`](../../../pm-workflow/cross-cutting/Product_Operations.md).

## Frameworks anchor
Pinned in [../../03_Frameworks_Map.md](../../../pm-workflow/03_Frameworks_Map.md) (measuring & growing, P12–P15); cards in [../../frameworks/](../../../pm-workflow/frameworks/). For P13: **hypothesis template**; **OEC** (Kohavi, *Trustworthy Online Controlled Experiments*); **primary / guardrail / diagnostic** metric taxonomy; **power analysis & MDE**; **frequentist fixed-horizon**; **sequential** (mSPRT / group-sequential); **Bayesian**; **CUPED** variance reduction; **multi-armed bandits / Thompson sampling**; **interleaving & holdouts** (AI features); **one-way vs two-way door**; **SRM / A-A** trustworthiness checks; **ICE / PIE** for the experiment backlog. Match the method to the question and the traffic, per the [Frameworks Map](../../../pm-workflow/03_Frameworks_Map.md).

## Exit-gate checklist
**P13 owns no lifecycle gate — it is a *continuous* phase (`continuous — per experiment`).** There is no P13 block in [../../checklists/gate-reviews.md](../../../pm-workflow/checklists/gate-reviews.md); this is a **per-experiment health check / done-when** list. The six-thread review still applies wherever an experiment's result feeds a real gate (e.g. G9 launch, G4 roadmap).
- [ ] Falsifiable hypothesis written; traces to an `ASM-*` and an `OPP-*`/`OBJ`.
- [ ] One primary **OEC** + 2-3 guardrails + diagnostics chosen from the Measurement Plan; **decision rule stated**.
- [ ] **Pre-registered before launch:** MDE, alpha, power ≥0.8, sample size, runtime (≥1 full business cycle); method chosen; analysis plan locked.
- [ ] Trustworthiness covered: A/A + **SRM** check, randomization unit, multiple-comparison correction, **no-naive-peeking** stop rule.
- [ ] **Responsible floor:** no harmful/dark-pattern variant; guardrails protect trust/accessibility; Art. 50 transparency if an AI feature; `RSK-*` logged.
- [ ] Readout separates **statistical from business significance**; only pre-registered segments cut; call is Ship/Iterate/Kill/Inconclusive with a `DEC-*` and the loop-back.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Stopped at the first `p<0.05`. | Naive peeking on a fixed-horizon test. | Pre-register a fixed horizon, or use a **sequential** (mSPRT) always-valid rule. |
| "Significant" on a tiny sample. | No power analysis up front. | Compute MDE/power/sample size first; if underpowered, don't run it. |
| Shipped a stat-sig but worthless lift. | Conflated statistical with business significance. | Report both separately; require business significance + no guardrail breach to ship. |
| Test ran 2 days / odd window. | Arbitrary, sub-cycle duration. | Run ≥1 full business cycle (weekly seasonality); set runtime from the power calc. |
| Found a "winning segment" after the fact. | Post-hoc fishing / uncorrected comparisons. | Pre-register segments; correct for multiple comparisons; treat the rest as hypotheses. |
| "We're Bayesian, so we peek freely." | Misuse of Bayesian as a peeking license. | Use a sequential-valid stop rule; posteriors still need a disciplined decision rule. |
| A/B tested a compliance / one-way-door change. | A/B-testing everything reflexively. | Reserve A/B for reversible, powered, clean-metric decisions; else ship + monitor or test qual. |
| AI feature measured with classic A/B. | Dynamic variants / novelty / proxy blindness. | Use permanent holdouts, interleaving, response-quality metrics; watch novelty decay. |
| Dropped guardrails to "move faster." | Velocity over trust. | Guardrails are mandatory; a velocity gain that breaches one is a no-ship. |
| Trusted the dashboard's verdict blindly. | Data-worship; ignored qual / SRM. | Run A/A + SRM; triangulate with discovery; have AI flag anomalies, human interprets. |

## References
- [../../05_Conventions.md](../../../pm-workflow/05_Conventions.md) — IDs (`EXP-*`/`MET-*`/`ASM-*`/`OPP-*`/`DEC-*`/`RSK-*`, §3), continuous-phase status (§1), traceability spine (§4), severity/priority (§5), status/frontmatter (§6), outcomes-over-outputs (§7), citations (§8), folder layout (§9).
- [../../01_Workflow_Overview.md](../../../pm-workflow/01_Workflow_Overview.md) — the continuous measure→learn→grow loop (§4); P13 inside it.
- [../../checklists/gate-reviews.md](../../../pm-workflow/checklists/gate-reviews.md) — the six-thread review (P13 has no own gate block).
- 2026 research (ground the shifts/anti-patterns): [Power analysis for A/B tests](https://www.statsig.com/perspectives/power-analysis-ab-testing) · [Sequential testing / always-valid](https://www.statsig.com/updates/update/sequential-testing-capabilities) · [Frequentist vs Bayesian](https://www.geteppo.com/blog/comparing-frequentist-vs-bayesian-approaches) · [Bandits vs A/B](https://www.statsig.com/perspectives/bandit-algorithms-vs-ab-testing) · [Experimentation in the age of AI](https://prepvector.substack.com/p/experimentation-in-the-age-of-ai) · [Guardrail metrics](https://mixpanel.com/blog/guardrail-metrics/) · [Trustworthy Online Controlled Experiments (Kohavi, OEC)](https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59) · [Datadog acquires Eppo — platform consolidation](https://www.statsig.com/blog/datadog-acquires-eppo).
- Curriculum: [../../../PM_Final_WF/04-product-launch-playbook.md](../../../PM_Final_WF/04-product-launch-playbook.md) — A/B testing & experimentation in the launch/optimization stage.
- Related phases: pm-phase-12-analytics (instruments the `MET-*`, supplies OEC + guardrails) · pm-phase-08-prd (seeds `EXP-TBD` on risky requirements) · pm-phase-07-solution-design (the `ASM-*` an experiment tests) · pm-phase-14-feedback (`FB-*` themes spawn hypotheses) · pm-phase-15-growth (`GX-*` growth experiments on this engine) · pm-phase-11-launch-gtm (rolls out a winner).

</supporting-info>
