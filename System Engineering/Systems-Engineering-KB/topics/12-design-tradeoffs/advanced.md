# Evaluating Design Trade-offs: Performance, Cost & Scalability — Advanced concepts

## Advanced concepts

**Intermediate COCOMO — cost drivers and the EAF.** Basic COCOMO assumes effort depends only on size and the mode constants, but no real schedule rests on lines of code alone (source: m3-cocomo). Intermediate COCOMO refines the estimate with **15 cost drivers** (multipliers) grouped into four categories (source: m3-cocomo):

- **Product attributes:** required software reliability; size of the application database; complexity of the product.
- **Hardware attributes:** run-time performance constraints; memory constraints; volatility of the virtual-machine environment; required turnaround time.
- **Personnel attributes:** analyst capability; software-engineering capability; application experience; virtual-machine experience; programming-language experience.
- **Project attributes:** use of software tools; application of software-engineering methods; required development schedule.

Each driver is rated on a six-point scale from "very low" to "extra high," and each rating maps to a fixed effort multiplier (source: m3-cocomo). The **Effort Adjustment Factor (EAF)** is the **product of all 15 effort multipliers** (source: m3-cocomo). The Intermediate equation inserts EAF into the basic effort formula (source: m3-cocomo):

```
E      = a · (KLOC)^b · EAF   [person-months]
T_dev  = c · (E)^d            [months]
```

Intermediate-model constants differ from Basic for organic and embedded (source: m3-cocomo):

| Project type | a | b | c | d |
|---|---|---|---|---|
| Organic | 3.2 | 1.05 | 2.5 | 0.38 |
| Semi-detached | 3.0 | 1.12 | 2.5 | 0.35 |
| Embedded | 2.8 | 1.20 | 2.5 | 0.32 |

When all drivers are nominal, EAF = 1 and the Intermediate effort reduces to the basic shape (with the Intermediate `a`). [OUTSIDE MATERIAL]

**Detailed COCOMO — phase-by-phase.** Detailed COCOMO incorporates everything in the Intermediate version plus an assessment of each cost driver's impact at **each step** of the software-engineering process; the software is split into modules, COCOMO is applied per module, and the efforts are summed (source: m3-cocomo). Its six phases (source: m3-cocomo):

1. Planning and requirements — scope, objectives, constraints, project plan (schedule, resources, milestones).
2. System design — high-level architecture: major components, interactions, data flow.
3. Detailed design — per-component specs: data structures, algorithms, interfaces.
4. Module code and test — write and test source for each module.
5. Integration and test — combine modules into a complete system, verify they work together.
6. Cost constructive model — apply COCOMO cost/effort estimation.

The point of the phase decomposition is that a cost driver (e.g. reliability) weighs differently in design than in integration, so applying multipliers per phase yields the most accurate estimate of the three levels (source: m3-cocomo).

**Discounted cash flow inside cost methods.** LCA and any multi-year comparison use DCF / NPV so future costs and benefits are expressed in present value, respecting the time value of money — this is what makes a high-upfront/low-running design comparable to a low-upfront/high-running one (source: master-notes, m3-cost).

## Edge cases & gotchas

- **Mode ≠ size band alone.** The size bands (organic 2–50, semi-detached 50–300, embedded 300+ KLOC) overlap with complexity/environment judgement; the source's *code* picks mode purely by size, but the *definitions* hinge on complexity, team experience, and constraints — a small but flight-control-grade system is still embedded (source: m3-cocomo).
- **The Basic-model worked example is internally inconsistent.** Its narrative solves 400 KLOC, but the bundled C++ program hardcodes `size = 4` and emits Effort = 10.289 PM, Time = 6.062 months, Staff = 2 — a *different* problem. The "all three modes ≈ 38 months" line is a rounding artifact (true values 38.08 / 38.45 / 37.60). Treat the prose example, the printed equations (exponents stripped), and the code output as three separately garbled fragments; recompute from `E = a·KLOC^b`, `T_dev = c·E^d` (source: m3-cocomo).
- **Intermediate constants differ from Basic.** Organic `a` rises 2.4 → 3.2 and embedded `a` falls 3.6 → 2.8 between the Basic and Intermediate tables; using the wrong table silently shifts effort (source: m3-cocomo).
- **ROI vs net benefit sign conventions.** CBA's go/no-go test is `net benefit > 0` (absolute), while ROI is a ratio scaled to 100%; a positive but tiny ROI still passes CBA yet may lose to a higher-ROI alternative (source: master-notes).

## Performance, production & security considerations

- **Security and reliability as first-class criteria.** Beyond the three core axes, evaluations weigh reliability, security, usability, and risk by domain; the decision-matrix criteria include technical, financial, and **security risk** (source: m3-tradeoffs, master-notes). The sources name these but do not give security-specific measurement techniques here.
- **Production performance tooling.** Real-time monitoring (e.g. New Relic) and load generation (e.g. JMeter), plus baseline/load/stress tests, are the production means of collecting the metric data; simulation/digital-twin modeling substitutes when physical testing is impractical (source: m3-perf, master-notes).

## Where to go deeper

- **Boehm, *Software Engineering Economics* (1981)** — the origin of COCOMO and its 63-project basis; the authoritative source behind the garbled reference (source: m3-cocomo).
- **m3-cocomo (GeeksforGeeks COCOMO article)** — Intermediate cost-driver tables and Detailed phase model, but note its OCR errors flagged above (source: m3-cocomo).
- **[13-decision-matrix](../13-decision-matrix/README.md)** — how the per-criterion numbers produced here are weighted and combined into a single ranked choice; one level up the analysis chain.
- **Estimation tools — SEER, COCOMO** — named by the cost lesson as alternatives to spreadsheet cost models (source: m3-cost).
