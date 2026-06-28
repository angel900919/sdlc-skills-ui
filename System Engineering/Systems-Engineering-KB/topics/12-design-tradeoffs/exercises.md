# Evaluating Design Trade-offs: Performance, Cost & Scalability — Exercises

## Warm-up

From memory:

1. List the three core trade-off criteria and one thing each measures.
2. Define **latency** and **throughput** in one sentence each, and say how they differ.
3. List the seven cost types.
4. Write the two Basic COCOMO formulas and label every symbol.
5. Name the five scalability types.

## Core exercises

**C1 — Compute COCOMO (apply).** A new control system that interfaces with several existing systems is estimated at **200 KLOC**. Classify its mode, then compute effort, development time, and average staff with Basic COCOMO. Show units.

**C2 — Classify scalability type (apply).** For each scenario, name the scalability type (vertical / horizontal / data / functional / administrative):
(a) Upgrade a server's CPU and RAM. (b) Add servers behind a load balancer. (c) Add database indexing to handle a larger dataset. (d) Add a plug-in alarm module without touching motion detection. (e) Give one admin console control over 10,000 user accounts.

**C3 — Pick the cost method (apply).** Choose the best method (LCA / TCO / CBA / ROI / NPV) and say why:
(a) Compare a high-upfront/low-maintenance camera against a cheap-build/high-service camera over its full life. (b) Decide whether smart traffic lights are worth installing, given congestion and accident reductions. (c) Report the financial return of an AI-surveillance purchase that cut false alarms.

**C4 — Guidance-fading pair (apply).**
- *4a (scaffolded):* Organic, 50 KLOC. a=2.4, b=1.05, c=2.5, d=0.38. Compute `E = 2.4 · 50^1.05` then `T_dev = 2.5 · E^0.38`. (Hint: `50^1.05 ≈ 59.0`.)
- *4b (independent):* Embedded, 300 KLOC. Find the constants yourself, then compute E and T_dev with units.

**C5 — Which design wins? (analyze).** Two designs, four metrics:

| Metric | Design X | Design Y |
|---|---|---|
| Avg response time | 250 ms | 600 ms |
| Throughput | 900 req/sec | 1500 req/sec |
| CPU utilization | 55% | 80% |
| Availability | 99.9% | 99.5% |

State the "better" direction for each metric, tally the wins, and say which design is the stronger performer. Note any metric where there's a trade-off rather than a clean win.

**C6 — Explain it back (Feynman).** In ~5 sentences, explain to a non-engineer why a cheaper system can end up costing more than an expensive one. Self-check rubric: (1) mentions cost types beyond purchase (maintenance/operational); (2) mentions lifecycle horizon; (3) names a method (TCO or LCA); (4) uses the "higher upfront vs lower operational" trade-off; (5) avoids jargon without defining it.

## Challenge exercises

**X1 — Diagnose the scalability method (analyze).** For each symptom, choose the analysis method (capacity planning / elasticity testing / bottleneck analysis / modular design) and justify:
(a) "Response times spike whenever video-stream count grows; profiling points at database queries." (b) "We need to add a facial-recognition feature without redesigning the whole platform." (c) "We must scale up at peak and down at night to control cost." (d) "We want to know how many more cameras the current servers can take before they choke."

**X2 — Flag the garble (evaluate).** The COCOMO source reports development time as "≈ 38 months" for organic, semi-detached, *and* embedded at 400 KLOC. Recompute T_dev for each mode and decide: is the "all 38" claim exactly right, approximately right, or wrong? Explain what OCR error produced the confusion.

**X3 — Interleaved set (analyze — decide which concept applies first).** For each item, first decide whether it belongs to **trade-off evaluation (topic 12)** or to the **decision-matrix method (topic 13)**, then answer:
(a) "Multiply each criterion's score by its weight and sum to rank alternatives."
(b) "Measure end-to-end response time and throughput under load to find the latency source."
(c) "Assign importance weights — size 20%, weight 25%, capacity 35%, cost 20%."
(d) "Compute `E = a·KLOC^b` to estimate development effort."

**X4 — Build the map yourself (analyze).** Given these nodes — *Performance analysis, Cost analysis, Scalability analysis, Additional criteria, Decision matrix, Chosen design* — draw the edges (as an arrow list) showing what feeds what, and label each edge with what flows along it. Then state which node lives in topic 13, not topic 12.

**X5 — Full mini trade-off (analyze).** You must choose between **Monolith** and **Microservices** for the web app in [examples.md](examples.md). Using the m3-perf table (B wins all four performance metrics), add a one-line *cost* and *scalability* judgement for each, then state which you'd recommend and the single criterion that most influenced you. There is no single "correct" pick — your justification is graded.

---

## Solutions & explanations

**Warm-up.**
1. Performance (speed/responsiveness/throughput), cost (development/deployment/maintenance), scalability (handling growth) (source: m3-tradeoffs).
2. Latency = delay between input and start of processing; throughput = tasks/transactions per unit time. Latency is "how fast for one"; throughput is "how many at once" (source: m3-perf, master-notes).
3. Development, deployment, operational, maintenance, training, decommissioning, opportunity (source: m3-cost).
4. `E = a·(KLOC)^b` (E = effort in person-months, KLOC = estimated size in kilo-lines of code, a & b = mode constants); `T_dev = c·(E)^d` (T_dev = development time in months, c & d = mode constants) (source: m3-cocomo).
5. Vertical, horizontal, data, functional, administrative (source: m3-scalability).

**C1.** 200 KLOC falls in 50–300 KLOC → **semi-detached** (a=3.0, b=1.12, c=2.5, d=0.35). `E = 3.0·200^1.12 ≈ 3.0·377.6 ≈ 1132.7` PM; `T_dev = 2.5·1132.7^0.35 ≈ 2.5·11.83 ≈ 29.6` months; staff ≈ 1132.7/29.6 ≈ 38 persons (source: m3-cocomo).

**C2.** (a) vertical, (b) horizontal, (c) data, (d) functional, (e) administrative (source: m3-scalability).

**C3.** (a) **LCA** — full-lifecycle cost from design to disposal with DCF; (b) **CBA** — weighs societal benefits (less congestion, fewer accidents) against installation cost; (c) **ROI** — profitability of an investment from realized gains (source: master-notes). Common wrong answer for (a): ROI — but ROI needs a gain term; the comparison here is cost-only over time.

**C4.** 4a: `E = 2.4·59.0 ≈ 141.6` PM; `T_dev = 2.5·141.6^0.38 ≈ 2.5·6.65 ≈ 16.6` months. 4b (embedded, 300 KLOC; a=3.6, b=1.20, c=2.5, d=0.32): `E = 3.6·300^1.20 ≈ 3.6·943.9 ≈ 3398` PM; `T_dev = 2.5·3398^0.32 ≈ 2.5·13.46 ≈ 33.6` months (source: m3-cocomo).

**C5.** Lower is better for response time and CPU utilization; higher is better for throughput and availability. Wins: response time → X (250<600); CPU → X (55<80); availability → X (99.9>99.5); throughput → Y (1500>900). Design X wins 3 of 4 and is the stronger overall performer; throughput is Y's lone advantage — a genuine trade-off (higher capacity at the cost of higher latency and CPU) (source: m3-perf).

**C6.** Model answer: A system's price tag is only its *development/purchase* cost; running it adds operational, maintenance, training, and eventual decommissioning costs. A cheaply built option often needs more service and patching, so over a multi-year lifecycle its **total cost of ownership** can exceed a pricier-but-sturdier option. That's why engineers compare designs with **TCO** or **LCA** over the whole lifespan, not by sticker price — a higher upfront cost can buy lower operational cost later (source: m3-cost, master-notes).

**X1.** (a) **bottleneck analysis** — profiling found the constraint (DB queries); (b) **modular design** — add an independent module without overhauling; (c) **elasticity testing** — dynamic up/down scaling with demand to manage cost; (d) **capacity planning** — how much workload before degradation (source: m3-scalability).

**X2.** Recomputed: organic 38.08, semi-detached 38.45, embedded 37.60 months. The claim is **approximately right but not exact** — the three are close by coincidence, not identical. The OCR error detached the schedule exponents (0.38/0.35/0.32) from `T_dev = c·E^d` and the size exponents (1.05/1.12/1.20) from `E = a·KLOC^b`, so the printed equations look like plain multiplications and the rounded "38" hides the real spread (source: m3-cocomo).

**X3.** (a) topic 13 — weighted scoring is the decision-matrix step. (b) topic 12 — performance (latency/throughput) analysis. (c) topic 13 — weighting criteria. (d) topic 12 — COCOMO effort estimation. The principle: topic 12 *produces per-criterion numbers*; topic 13 *combines them* (source: m3-perf, m3-cocomo, master-notes; decision-matrix steps live in [13-decision-matrix](../13-decision-matrix/fundamentals.md)).

**X4.** Edges: Performance analysis → Decision matrix (metric scores); Cost analysis → Decision matrix (cost figures); Scalability analysis → Decision matrix (scalability rating); Additional criteria → Decision matrix (reliability/security/usability/risk scores); Decision matrix → Chosen design (ranked selection). **Decision matrix** lives in topic 13; everything feeding it lives in topic 12 (source: m3-tradeoffs, m3-perf, m3-cost, m3-scalability).

**X5.** Sample: Microservices win all four performance metrics and rate "High" scalability vs Monolith's "Poor" (source: m3-perf); cost-wise microservices typically raise operational/maintenance cost while the monolith is cheaper to run early. A defensible recommendation is **Microservices** if growth and responsiveness dominate (scalability + response time the deciding criteria), or **Monolith** if budget and simplicity dominate — either is fine when the criterion driving it is named (source: m3-perf, m3-tradeoffs).
