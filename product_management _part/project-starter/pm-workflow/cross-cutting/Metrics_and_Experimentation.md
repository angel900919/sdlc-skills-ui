# Cross-cutting thread — Metrics, Analytics & Experimentation

> **The discipline of knowing whether the product is working** — defining the *one outcome* that matters, the *inputs* you can actually move toward it, the *guardrails* that stop you gaming it, and the *experiments* that prove a change caused the result rather than coincided with it. It is how "done" gets redefined from *shipped* to *moved a metric* ([Conventions §7](../05_Conventions.md)).

This is thread **3 of 6** ([Conventions §10](../05_Conventions.md)). It is the operational backbone of the traceability spine's last link — *…→ ship → **measure** → learn → loop* — and the reason no bet is "done" without a `MET` and, where the question is causal and the traffic exists, an `EXP`.

---

## Why it's a thread, not a phase

P12 (Analytics) and P13 (Experimentation) *own* the deliverables, but measurement is **alive in every phase**, not parked at the end:

- **P01** sets the North Star and OKRs — a metric decision made before a line of code.
- **P04–P07** attach a target `MET` and a riskiest-assumption `EXP`/`ASM` to every opportunity and bet *before* committing to build.
- **P08–P10** wire instrumentation into the PRD and Definition of Done so "done" points at a metric, and bake success + guardrail + rollback thresholds into release readiness (G8).
- **P11–P15** run the live loop: success/guardrail metrics gate the launch decision (G9), then the measure → experiment → grow cycle never switches off.

> If measurement only shows up at P12, you have built blind for eleven phases and instrumented a corpse. The thread starts at P01 and is **reviewed at every gate** — instrumentation designed late is instrumentation that's wrong.

---

## The method

**1 — North Star + input metric tree.** One **output** metric (the North Star — a tagged `MET` that proxies delivered customer value) decomposed into **3–5 input metrics you can actually move**, typically along breadth / depth / frequency / efficiency. Below each input sit **leading indicators**. Build it as a *metric tree* — distinguish **component links** (mathematically sum to the parent) from **influence links** (causally push it). You optimize the *inputs*; the North Star is the scoreboard, never the dial you turn directly.

**2 — Leading vs lagging.** Instrument both and label which is which. **Leading** indicators (activation rate, first-week usage) let you act early; **lagging** indicators (retention, revenue, NRR) confirm but arrive too late to steer. A dashboard of only lagging metrics is a rear-view mirror.

**3 — Guardrails.** Every metric you push gets **2–3 guardrails** that must *not* move the wrong way — latency, error rate, support contacts, unsubscribes, a counter-metric for the thing you might be cannibalizing. The vanity test (Cutler): *if this number changed, would we do anything differently?* If no, it's not a metric, it's decoration.

**4 — AARRR + HEART, matched to the question.** They are complementary, not rivals. **AARRR / "Pirate Metrics"** (Acquisition, Activation, Retention, Referral, Revenue — McClure) frames the *business/lifecycle funnel*. **HEART** (Happiness, Engagement, Adoption, Retention, Task-success — Rodden/Google), run through **Goals → Signals → Metrics**, frames *UX quality of a feature or flow*. Pick by the question; apply HEART's honesty patch for mandatory/internal software where "engagement" can mean "trapped."

**5 — Tracking-plan hygiene.** Instrument *deliberately from a tracking plan*, not by reflex. A governed **event taxonomy** (consistent object–action naming), one source of truth, and an owner. Be explicit about the proxy; **prefer rates over cumulative totals**; always show context (comparison / ratio / caveat). Audit for taxonomy drift. The rule is **not** "track everything now."

**6 — Experiment rigor.** Write a **falsifiable hypothesis first** — *"We believe [change] causes [effect] for [segment], measured by [metric], because [insight]."* **Pre-register** the design before launch: one primary decision metric (Kohavi's **OEC**) + 2–3 guardrails + diagnostics, plus **MDE, alpha, and a power analysis** that yields the sample size and run length (full business cycles). Verify trustworthiness with **A/A and SRM checks**. **Don't peek naively** in fixed-horizon tests — use **sequential / always-valid p-values** (mSPRT / group-sequential) if you need to monitor live, and correct for multiple comparisons. Use **CUPED** for variance reduction where available. **Decision rule = primary metric wins AND no guardrail breached.** Expect most experiments to lose or be flat — that *is* the learning. Know **when not to A/B test**: low traffic, one-way-door/strategic/compliance changes, or no clean metric/power → use qualitative validation or a reversible rollout instead.

**7 — Data-informed, not data-driven.** Triangulate **quant + qual** — the number tells you *what*, the customer tells you *why*. AI can query in natural language, surface anomalies, draft hypotheses, and audit the tracking plan; **humans own** defining what "value" means, causal interpretation (LLMs conflate correlation and causation), and the guardrail/ethics/rollback thresholds ([AI PM Protocol §4–5](../02_AI_Product_Manager_Protocol.md)).

---

## Living artifacts it maintains (+ IDs)

All carry `Status: Living` ([Conventions §6](../05_Conventions.md)) and use the measurement IDs from [Conventions §3.3](../05_Conventions.md):

| Artifact | Phase | IDs it issues / maintains |
|---|---|---|
| `Measurement_Plan.md` | P12 | `MET-<nn>` (North Star tagged; inputs, leading/lagging, guardrails) |
| `Tracking_Plan.md` | P12 | event taxonomy + owner; the proxy definition behind each `MET` |
| `KPI_Scorecard.md` | P12 | the live scoreboard — North Star + inputs + guardrails, with context |
| `Experiment_Plan.md` / `Experiment_Readout.md` | P13 | `EXP-<nn>` (one readout per experiment), linked to its `ASM`/`SOL` |
| `Growth_Model.md` / `Growth_Experiment_Backlog.md` | P15 | `GX-<nn>` (growth experiments), feeding the same metric tree |

Every `MET` traces backward to the `OBJ/KR` and `OPP` it serves and forward to the `FEAT`/`US` measured by it ([Conventions §4](../05_Conventions.md)). Unassigned links are `MET-TBD` / `EXP-TBD`, never a blank cell.

---

## Reviewed at every gate

At each gate (G0→G10) this thread asks:

- **Does every committed bet have a `MET`?** And where the question is causal *and* there's traffic, an `EXP` — or an explicit "why not" if there isn't.
- **Is the North Star moving via its inputs**, or are we optimizing the headline number directly (and likely gaming it)?
- **What's the guardrail for this change, and is it green?** Name the counter-metric we might be harming.
- **Is this an input/outcome metric or a vanity metric?** Would a change in it change a decision?
- **Is the instrumentation in place *before* we ship** — events in the tracking plan, taxonomy clean, dashboard live? (Hard stop at G8.)
- **For any experiment cited as evidence:** pre-registered hypothesis? powered? guardrails intact? primary metric won without peeking? Or is this a correlation wearing a lab coat?
- **Have we triangulated with qual** before calling a result, or are we worshipping a dashboard?

A gate where a bet is "done" but no metric moved is **Persevere-with-actions** at best ([Conventions §2](../05_Conventions.md)).

---

## Tailoring

Scales but is **never removed** ([Tailoring Guide §3](../04_Tailoring_Guide.md)):

- **Solo / Lean** — track the **2–3 numbers that matter plus a North Star** in a spreadsheet scorecard. Experiments are qualitative or before/after; if there isn't traffic for significance, *say so* and use a fake-door or 5 interviews instead of a p-value theatre.
- **Standard** — full metric tree with leading/lagging + guardrails; a product-analytics tool (Amplitude/Mixpanel/PostHog) and an experimentation/flag platform; tracking plan governed; gates review the scorecard.
- **Enterprise / Formal** — warehouse-native/composable stack; formal taxonomy governance (Avo/Lexicon) with an owner; experimentation platform with sequential testing, CUPED, A/A + SRM monitoring; permanent holdouts and response-quality metrics for AI features; metrics tied into OKR governance and portfolio review.

Record the choice in the tailoring log (e.g. *"P13 — Solo: qualitative + before/after; reason: not enough traffic for significance yet"*).

---

## Anti-patterns

1. **A lone North Star with no inputs** — or, worse, "optimize the North Star directly." The headline is a scoreboard; you move it through the input tree, not by staring at it.
2. **Raw counts as success** — views, downloads, sign-ups, cumulative-up-and-to-the-right charts. Prefer rates over totals; if it only goes up, it's probably vanity.
3. **Optimizing one metric with no guardrail** — every push needs a counter-metric. Activation that tanks retention or floods support is a regression dressed as a win.
4. **Peeking** — stopping a fixed-horizon test at the first p<0.05 (and the myth that "Bayesian = free license to peek"). Use sequential methods or hold to the pre-registered horizon.
5. **Underpowered + business-blind** — significance on a tiny sample with no power analysis, or conflating statistical with business significance. Run full business cycles.
6. **"Track everything now"** — an ungoverned event firehose that drifts into taxonomy chaos no one trusts. Instrument deliberately from the plan; NPS or any survey score as the *primary* KPI without behavioral grounding is the same disease.

---

## References

- Amplitude — *North Star Framework* (1 output + 3–5 inputs): https://amplitude.com/books/north-star/about-north-star-framework
- Amplitude — *Vanity metrics* (Cutler's test): https://amplitude.com/blog/vanity-metrics
- Mixpanel — *Metric trees* (component vs influence links): https://mixpanel.com/blog/metric-tree/
- Statsig — *Leading vs lagging indicators*: https://www.statsig.com/perspectives/leading-vs-lagging-indicators-in-product-metrics
- Statsig — *Power analysis for A/B testing*: https://www.statsig.com/perspectives/power-analysis-ab-testing · *Sequential testing*: https://www.statsig.com/updates/update/sequential-testing-capabilities
- Kohavi, Tang & Xu — *Trustworthy Online Controlled Experiments* (OEC, SRM, A/A): https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59
- Product Focus — *Why PMs should not be data-driven*: https://www.productfocus.com/why-product-managers-should-not-be-data-driven/
- Canonical frameworks & IDs: [`../05_Conventions.md`](../05_Conventions.md) (§3.3 IDs, §4 traceability, §8 citations, §10 threads)
