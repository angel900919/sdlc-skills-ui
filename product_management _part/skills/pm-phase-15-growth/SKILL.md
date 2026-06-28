---
name: pm-phase-15-growth
description: Runs Phase 15 (Product Growth & Optimization) of the framework-agnostic PM operating system — the continuous post-launch loop that compounds activation, retention, and monetization instead of leaking through a funnel. Maps the growth system as self-reinforcing loops (Reforge/Balfour) under one North Star + input metric tree, pins the activation aha-moment and the retention curve as the core, and runs a disciplined growth-experiment backlog (GX-*) proven by causal experiments (P13), not correlation. Produces Growth_Model.md and Growth_Experiment_Backlog.md. It owns no lifecycle gate — it is a continuous phase whose "gate" is a recurring growth health check. Conforms to ../../05_Conventions.md. Use when a product is live and you need to lift activation/retention/monetization, define or fix the activation event, build a growth model or growth loops, design onboarding/time-to-value, choose a monetization model (freemium / free trial / reverse trial / usage-based), stand up a PQL / product-led-sales motion, prioritize a growth-experiment backlog, or diagnose a leaking metric. Triggers on phrasings like "grow the product", "growth model", "growth loops", "PLG", "product-led growth", "activation", "aha moment", "retention curve", "NRR / net revenue retention", "onboarding / time-to-value", "monetization / freemium / reverse trial / usage-based pricing", "PQL", "growth experiment", "growth backlog", "phase 15".
disable-model-invocation: true
user-invocable: true
---

# Phase 15 — Product Growth & Optimization

<what-to-do>

This phase compounds the value a *launched* product already delivers — turning more of its users into activated, retained, paying, referring customers — by treating growth as a **system of loops, not a funnel**, and proving every change with a **causal experiment, not a correlation**. It is a **continuous phase: it owns no lifecycle gate** (`continuous — health check`); its "gate" is a recurring **growth health check** (the six-thread review + the done-when list below), run on a cadence, not a one-time pass. It is the engine of the post-launch measure→learn→grow loop ([Overview §4](../../01_Workflow_Overview.md)) and feeds new `OPP-*` back into discovery. Conform to [`../../05_Conventions.md`](../../05_Conventions.md) for IDs (`GX-*`, `MET-*`, `EXP-*`), the decision vocabulary, severity, status/frontmatter, the traceability spine, and folder layout — **cite the section, never redefine it**.

> **Prime directive (Conventions §7):** outcomes over outputs. A "growth" win that moves a vanity number (signups, pageviews, downloads) while the **retention curve keeps falling** is theatre — refuse it. Growth is `(Acquisition + Retention + Monetization) × Defensibility`, and **retention is the core**: a flattening retention curve is the real signal of value. **2026 shift: retention/NRR has overtaken acquisition** as the growth lever (top performers at NRR 120%+ grow ~2.5x faster).

## Inputs (from prior phases)
Read these from the project tree ([Conventions §9](../../05_Conventions.md)) first; if one is missing, elicit + flag the source, and **never invent a metric, a benchmark, or a reach number**. Cross-reference by ID — never re-describe (Conventions §4).
- **North Star + input metric tree, OKRs** (`MET-*`, `OBJ/KR-*`) — from `pm-phase-01-strategy` / `pm-phase-12-analytics`. Growth optimizes *against the North Star value-exchange metric*, never a vanity metric. **If no North Star → STOP, route to `pm-phase-12-analytics`/`pm-phase-01-strategy`.** You cannot tune a system with no headline value metric.
- **Instrumentation + lifecycle metrics** (`MET-*`, tracking plan, AARRR/HEART stages) — from `pm-phase-12-analytics`. The **measurement gap is the defining 2026 problem** (≈58% run PLG, only ≈34% track activation). If activation isn't instrumented → `TODO: instrument activation event`, route to `pm-phase-12-analytics`. No event data = no growth model.
- **Experiment engine** (`EXP-*` plan, guardrails, stat method) — from `pm-phase-13-experimentation`. Every `GX-*` graduates into an `EXP-*` for causal proof; correlation is not a result.
- **Feedback themes** (`FB-*`) — from `pm-phase-14-feedback`. Friction, churn reasons, and unmet jobs that seed growth bets; the qualitative "why" behind a leaking stage.
- **Validated opportunities** (`OPP-*`, `OBJ/KR-*`) — from `pm-phase-04-opportunity`; large growth bets re-enter discovery, they don't skip it.
- If a prior artifact is missing, proceed with what exists, mark the gap `TODO: <owed artifact>`, and never fabricate a conversion rate or benchmark to fill a cell — cite a sourced range or mark it `TODO: pull from analytics`.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, never a wall of questions). Use `AskUserQuestion` for finite choices. **Show back** the model / backlog after each round and have the human confirm before writing. Reuse every fact already in the tree; never re-ask what P01/P12 settled. Mark anything unknown as `TODO: <what is owed — by whom — by when>` — never invent an activation rate, an NRR figure, or a benchmark as if it were measured.

1. **Identity & output location** (one message, related): confirm the project **slug**, the North Star (`MET-*`) and `OBJ/KR-*` growth serves, and the product's growth stage. Default `<output-dir>` = `<product-slug>/15_Growth/`.
2. **Diagnose the system, find the leak** (topic 2): walk the lifecycle metrics (acquisition → **activation** → retention → referral → revenue) and the **retention curve**. AARRR is *vocabulary for finding the leaky stage*, not the model. Name the single highest-leverage stage; almost always activation (the aha moment) or retention before acquisition.
3. **Define the activation event** (topic 3): separate the *felt aha moment* from the **measurable activation event** (the instrumented proxy). State the value hypothesis ("a user who does X within N days retains"). If unmeasured → `TODO`, route to `pm-phase-12-analytics`. Benchmark directionally (activation ≈25–40% in 7–14 days; <20% is a problem) — **cite the source, never assert from memory**.
4. **Model growth as loops, not a funnel** (topic 4): draw the self-reinforcing loop(s) — e.g. engagement→retention→monetization, or content/UGC/viral output-sharing — where output reinvests as input and compounds. Map each loop to its bottleneck step (Balfour: AI changes the *bottlenecks* of loops, not the fundamentals). Write the **growth equation** for this product.
5. **Choose the monetization & GTM motion** (topic 5): use `AskUserQuestion` — freemium / free trial / **reverse trial** / usage-based, and **PLG vs hybrid product-led-sales (PQL)**. Match to traffic, time-to-value, and pricing architecture. Cite sourced benchmarks where they inform the call (e.g. free-trial ≈2–3x freemium conversion; opt-out trials convert higher than opt-in) — directional, not gospel.
6. **Build the growth-experiment backlog** (topic 6): turn each leak into testable `GX-*` bets with a hypothesis, the loop/stage it targets, a single `MET-*`, expected effect, and **guardrail metrics**. Prioritize with **ICE/RICE** (Conventions §8) and explicit Confidence; a low-confidence bet is a flag to run discovery, not to guess louder.
7. **Run, prove, decide** (topic 7): graduate top `GX-*` into `EXP-*` via `pm-phase-13-experimentation`; require causal evidence + guardrails held. Ship winners into the loop, kill losers, and **iterate the model** (retention/activation definitions decay). Log the call as a `DEC-*`.
8. **Responsible-product + dark-pattern red-team** (topic 8): every growth mechanic passes the **non-negotiable floor** — no manipulative dark patterns dressed as "retention", consent for tracking (GDPR), and AI-personalized onboarding discloses AI per **EU AI Act Art. 50 (from 2 Aug 2026)**. Genuine habit, not novelty churn. Log new `RSK-*`.
9. **Write artifacts** to `<output-dir>` with Conventions §6 frontmatter: `Growth_Model.md` (`Living`), `Growth_Experiment_Backlog.md` (`Living`). Update `_threads/Decision_Log.md` (`DEC-`) and `Risk_Register.md` (`RSK-`); route winning bets that imply new problems back as `OPP-*` to `pm-phase-04-opportunity`.
10. **Health check.** Run the every-gate six-thread review + the done-when list. Record the review + cadence in `WORKFLOW.md`.
11. **Done.** Print all output paths; recommend next: `pm-phase-13-experimentation` (prove a `GX-`), `pm-phase-12-analytics` (instrument a gap), or `pm-phase-16-sunset` if growth has structurally stalled and the curve won't flatten.

## Decision points
- **Loops or funnel?** *How to decide:* model the system as **growth loops** (compounding); use the AARRR funnel only as *vocabulary* to locate the leaking stage. Funnel-only thinking silos channel/product/monetization — it's the default anti-pattern.
- **Which lever first?** *How to decide:* fix **retention/activation before acquisition** — pouring acquisition into a leaking bucket compounds the leak. If the retention curve never flattens, you have a PMF/value problem, not a growth problem → back to `pm-phase-04-opportunity`/`pm-phase-03-discovery`.
- **Monetization model?** *How to decide:* short time-to-value + self-serve aha → free trial / reverse trial; long TTV or breadth-of-value → freemium; consumption-shaped value (esp. AI features) → usage-based. Don't default to freemium with no value model.
- **Pure PLG or hybrid?** *How to decide:* "pure PLG, no sales ever" is dogma — most products >$10M ARR run **hybrid**; introduce **PQL / product-led sales** when product signals (not lead forms) identify expansion-ready accounts.
- **Ship it or run a GX?** *How to decide:* if the change rests on a low-confidence effect, run a causal `EXP-*` first; ship directly only for low-risk, high-confidence, reversible changes. Correlation is never the result.
- **Growth or sunset?** *How to decide:* if the curve structurally won't flatten and the loop can't be made to compound, **Kill/Pivot is the honest call** — route to `pm-phase-16-sunset`. Set sunk cost aside.

## Rules
- **Conform to Conventions, never redefine.** IDs (`GX-`/`MET-`/`EXP-`/`OPP-`/`OBJ/KR-`/`DEC-`/`RSK-`) §3, decision vocabulary §2, severity §5, frontmatter/status §6, traceability spine §4 — cite the section.
- **Outcomes over outputs (§7).** Growth is judged by retention/NRR and realized value, not by signups or features shipped. Every `GX-` ties to a `MET-` and traces up to an `OBJ/KR-`.
- **Retention is the core; vanity is the enemy.** A rising North Star with falling retention is the wrong star — guardrail it.
- **Evidence over opinion.** Validate with causal experiments, not correlation; make Confidence explicit; never fabricate a benchmark — cite a sourced range or `TODO:`.
- **AI accelerates, the human decides (§11).** AI personalizes onboarding, removes loop bottlenecks, and drafts/runs more experiments; the human owns the **activation event + value hypothesis**, strategy/channel-fit/defensibility, statistical rigor, building *genuine* habit, and refusing dark patterns.
- **Responsible-product floor is non-negotiable.** No manipulative engagement as "retention"; consent + AI-disclosure are floors, not trade-offs — raise an `RSK-` instead of shipping.
- **Pivot & Kill are valid.** A loop that won't compound should be re-cut or retired, not force-grown.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
All files carry the [Conventions §6](../../05_Conventions.md) frontmatter block and are **`Living`** (re-run on a cadence, bump the minor version). Blank templates live in [`../../templates/`](../../templates/).

- **`Growth_Model.md`** ★ — the growth equation, the loop diagram(s) + bottlenecks, the North Star/input metric tree, the activation event + retention curve, and the monetization/GTM motion.
- **`Growth_Experiment_Backlog.md`** ★ — the prioritized `GX-*` bets (hypothesis · loop/stage · `MET-` · guardrails · ICE/RICE · status), graduating into `EXP-*`.

### `Growth_Model.md` skeleton (copy, then replace every value)
```markdown
---
Document: Growth Model — <Product>
Document ID: GROWTH-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM / Growth lead>
Updated: <YYYY-MM-DD>
---
## North Star & equation
North Star: MET-01 — <value-exchange metric> · Equation: (Acquisition + Retention + Monetization) × Defensibility
Input metric tree: MET-02 activation · MET-03 retention · MET-04 expansion (NRR) — TODO: confirm current values from analytics
## Activation
Felt aha: <moment> · **Measurable activation event:** <instrumented event within N days> (MET-02)
Value hypothesis: "a user who <X> within <N days> retains." Current rate: <__%> (src: MET-02) — benchmark ~25–40% / 7–14d [cite]
## Retention (the core)
Curve: <does it flatten? where?> (MET-03) · NRR: <__%> (MET-04) — TODO if unmeasured
## Growth loop(s)
Loop 1: <action> → <output> → <reinvested as input> → compounds · Bottleneck: <step> · Owner bet: GX-01
## Monetization & motion
Model: <freemium | free trial | reverse trial | usage-based> · Motion: <PLG | hybrid + PQL> · Rationale + cited benchmark
## Responsible-product floor
No dark patterns (RSK-__) · Tracking consent (GDPR) · AI-onboarding disclosure (EU AI Act Art.50, 2026-08-02)
```
> Skeleton values are **placeholders** — replace or mark `TODO:`; never ship them.

### `Growth_Experiment_Backlog.md` skeleton
```markdown
---
Document: Growth Experiment Backlog — <Product>
Document ID: GXBACKLOG-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM / Growth lead>
Updated: <YYYY-MM-DD>
---
| ID | Hypothesis (if/then/because) | Loop · stage | Metric (MET-) | Guardrail | ICE/RICE · Conf | Status → EXP- | Result |
|---|---|---|---|---|---|---|---|
| GX-01 | If <change> then <MET-02 ↑> because <FB-/INS-> | Activation | MET-02 | retention MET-03 not ↓ | 7.5 · med | EXP-12 running | — |
| GX-02 | If <reverse trial> then <conversion ↑> because <benchmark> | Monetization | MET-04 | refund/churn | 6.0 · low | TODO: discovery | — |
```

## AI prompt pack
Copy-paste and fill the `<>` slots. Pair with [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md).
- **ELICIT —** "You are my AI-PM partner running Phase 15 for `<product>`. Interview me **one topic at a time** toward a growth model + GX backlog. Start from `<paste North Star MET-/OKRs + lifecycle metrics>`. Find the leaking stage, separate the felt aha from a measurable activation event, and reflect each answer back. Do **not** invent any activation rate, NRR, or benchmark — flag unsourced numbers as `TODO: pull from analytics`."
- **GENERATE —** "From `<paste metrics + FB- themes>`, model this product as **growth loops** (not a funnel): draw each loop, its compounding output→input step, and its bottleneck. Write the growth equation, propose a measurable activation event + value hypothesis, and draft a prioritized `GX-` backlog (hypothesis · loop/stage · single `MET-` · guardrail · ICE). Cite a sourced benchmark range for any rate you reference."
- **CRITIQUE / RED-TEAM —** "Act as a hostile growth reviewer. Attack this model `<paste>`: (1) is the North Star a vanity metric that could rise while retention falls? (2) is anything modeled as a funnel that should be a loop? (3) which `GX-` lack a guardrail or rest on correlation, not a causal `EXP-`? (4) is any mechanic a **dark pattern** dressed as retention, or missing consent / AI-disclosure? (5) is acquisition being poured into a leaking bucket? Return: finding | severity (S1–S4) | why it matters | fix."
- **GATE (health check) —** "Run the Phase 15 done-when list + the six-thread review against this model + backlog. For each item: Pass / Gap (owner+date) / Waived. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence, and name the next review date."

## Research & specialised-agent triggers
Per [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md): the AI proposes, you approve, findings are cited and traced.
- **Talk to a customer (Part A)** when a leak's *why* is unknown — churn-reason and activation-friction interviews beat a louder guess; log `INS-`/`FB-`, trace to the `GX-` you're shaping. Continuous-discovery weekly touch; **AI-drafted onboarding never substitutes for talking to churned users**.
- **Web research / Context7 (Part B)** when you need a benchmark to sanity-check an activation/conversion/NRR assumption, or to confirm an obligation (GDPR consent, **EU AI Act Art. 50** disclosure) — never adopt a single fabricated figure; cite a sourced range / the obligation + date.
- **Spawn an agent (Part C):** a **research-synthesis** agent to cluster a large `FB-` pile into candidate leaks/`OPP-` (verify themes against raw quotes); a **calc/verification** agent to recompute ICE/RICE and check experiment power/guardrails; an **adversarial-reviewer** agent to red-team the model and hunt dark patterns before the growth review. Outputs are inputs to verify, not truth.

## Cross-cutting hooks
Phase 15 seeds/feeds these threads (reviewed at the growth health check):
- **Metrics & Experimentation** — *consumes* `MET-` lifecycle data; every `GX-` carries a `MET-` + guardrail and graduates to an `EXP-` for causal proof → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Continuous Discovery** — winning/losing bets and churn reasons spin out new `INS-`/`OPP-` back into P03/P04; the loop never closes → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Responsible Product (floor)** — dark-pattern ban, tracking consent, AI-onboarding disclosure (EU AI Act Art. 50) are written *into* the model, not bolted on → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholders** — growth bets compete for capacity; readouts are BLUF (outcome · trade-off · ask) and logged as `DEC-` → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Product Ops** — owns the growth-review cadence, the single-source model/backlog, and the experiment tooling → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md).
- **Portfolio** *(multi-product)* — where this product sits on its growth/maturity curve; a structurally stalled curve is a sunset signal → [`../../cross-cutting/Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Pinned to P15 (Conventions §8; full cards in [`../../frameworks/`](../../frameworks/), map in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md)):
- **Growth Loops** (Reforge / Balfour) — self-reinforcing, compounding loops; AI changes the *bottlenecks*, not the fundamentals.
- **Product-Led Growth (PLG)** (OpenView) — the product as the primary acquisition/conversion/expansion engine; minimize time-to-value.
- **North Star + input metric tree** (Amplitude) — one value-exchange headline metric with input levers.
- **AARRR "Pirate Metrics"** (McClure) — *vocabulary* to find the leaking stage, paired with loops (never used as the model).
- **Activation event + aha moment + TTV; Setup→Aha→Habit** (Balfour) · **The Four Fits** growth framework · **RICE/ICE** (prioritizing the `GX-` backlog) · monetization models (Freemium / Free Trial / **Reverse Trial** / Usage-based) · **PQL / Product-Led Sales**.

## Exit-gate checklist
**P15 owns no lifecycle gate — it is a continuous phase.** There is no P15 block in [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md); this is a **health check / done-when** list, run on a recurring cadence (e.g. monthly/quarterly growth review). First run the **every-gate six-thread review** ([`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md)), then:
- [ ] Growth modeled as **loops** (compounding), with bottlenecks named — not a funnel-only view.
- [ ] North Star is a **value-exchange** metric with input tree; **guardrailed** so it can't rise while retention falls.
- [ ] A **measurable activation event** + value hypothesis defined and instrumented (or `TODO:` routed to P12).
- [ ] Retention curve / NRR tracked; **retention prioritized over acquisition** where the bucket leaks.
- [ ] `GX-*` backlog prioritized (ICE/RICE) with explicit Confidence; each bet has a single `MET-` + **guardrail metric**.
- [ ] Top bets proven via **causal `EXP-`** (P13), not correlation; winners shipped into the loop, losers killed.
- [ ] **Responsible-product floor** passed: no dark patterns, tracking consent, AI-onboarding disclosure (EU AI Act Art. 50); new `RSK-` logged.
- [ ] No fabricated benchmark/rate; every number cites `MET-`/a sourced range or is `TODO:`. Recommendation logged as `DEC-`; next review date set.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Funnel-only thinking; channels/product/monetization siloed | Funnel mistaken for the model | Model **growth loops**; use AARRR only as vocabulary to find the leak. |
| Acquisition-first; "build it and they will come" | Pouring spend into a leaking bucket | Fix **retention/activation first**; flatten the curve before scaling acquisition. |
| Vanity metrics (signups, pageviews, downloads) celebrated | Output thinking; no value metric | Pick a **value-exchange North Star**; guardrail retention; trace `GX-`→`MET-`. |
| Activation never measured (the 2026 gap) | PLG run without instrumenting activation | Define a **measurable activation event**; route gaps to `pm-phase-12-analytics`. |
| Generic one-size onboarding tour | Product tour instead of one action to value | One action toward the aha moment; minimize time-to-value. |
| Default freemium with no value model | Copying others; no monetization architecture | Match model to TTV/traffic/pricing; consider reverse trial / usage-based. |
| "Pure PLG, no sales ever" dogma | Treating PLG as identity, not strategy | Go **hybrid**; add PQL / product-led sales where product signals warrant. |
| Growth "hacking" as a bag of tricks | No system; tactics over loops | Anchor in a growth model + equation; experiments serve loops. |
| Manipulative engagement / dark patterns as "retention" | Confusing addiction with value | Build **genuine habit**; Responsible-Product floor; raise `RSK-`, not the metric. |
| Correlation reported as a growth win | No causal test | Graduate `GX-`→`EXP-` (P13) with guardrails before claiming a result. |
| AI-personalized onboarding ships without disclosure | EU AI Act treated as "future" | Art. 50 transparency bites **2026-08-02** — disclose AI interaction/content. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (IDs `GX-`/`MET-`/`EXP-` §3, decision vocabulary §2, traceability spine §4, severity §5, frontmatter §6, outcomes-over-outputs §7).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the continuous post-launch measure→learn→grow loop (§4); P15 never ends.
- [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md) — Growth Loops / PLG / North Star / AARRR pinned to P15; the vanity-North-Star anti-pattern.
- **2026 research sources:** https://www.reforge.com/blog/growth-loops · https://blog.brianbalfour.com/p/ai-growth-course · https://blog.brianbalfour.com/p/the-four-fits-a-growth-framework · https://www.statsig.com/perspectives/plg-metrics-activation-retention · https://www.growthunhinged.com/p/your-guide-to-reverse-trials · https://mixpanel.com/blog/product-led-growth/ · https://www.digitalapplied.com/blog/product-led-growth-2026-plg-strategy-playbook
- **Related phases (by name):** `pm-phase-12-analytics` (instruments the `MET-`/activation) · `pm-phase-13-experimentation` (proves each `GX-` causally) · `pm-phase-14-feedback` (`FB-` themes → growth leaks) · `pm-phase-04-opportunity` (large growth bets re-enter discovery) · `pm-phase-01-strategy` (the North Star) · `pm-phase-11-launch-gtm` (the GTM motion this compounds) · `pm-phase-16-sunset` (a structurally stalled curve).
- **Curriculum:** [`../../../PM_Final_WF/04-product-launch-playbook.md`](../../../PM_Final_WF/04-product-launch-playbook.md) — post-launch growth (loops over funnels, retention/NRR as the core), superseded by this skill where they disagree.

</supporting-info>
