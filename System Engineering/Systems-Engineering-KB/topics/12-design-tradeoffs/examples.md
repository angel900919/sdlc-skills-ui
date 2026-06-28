# Evaluating Design Trade-offs: Performance, Cost & Scalability — Examples

## Simple example

**Basic COCOMO for a 400 KLOC project across all three modes — fully worked.**

The COCOMO source poses exactly this: "Suppose a project was estimated to be 400 KLOC. Calculate effort and time for each of the three modes" (source: m3-cocomo). We use the corrected formulas and the Basic-model constants.

Formulas (source: m3-cocomo):
```
E      = a · (KLOC)^b   [person-months]
T_dev  = c · (E)^d      [months]
```

Constants (source: m3-cocomo):

| Mode | a | b | c | d |
|---|---|---|---|---|
| Organic | 2.4 | 1.05 | 2.5 | 0.38 |
| Semi-detached | 3.0 | 1.12 | 2.5 | 0.35 |
| Embedded | 3.6 | 1.20 | 2.5 | 0.32 |

**Organic**, KLOC = 400:
1. `E = 2.4 · 400^1.05` — apply the exponent to size. `400^1.05 ≈ 539.7`, so `E ≈ 2.4 · 539.7 ≈ 1295.3` person-months *(matches the source's 1295)*.
2. `T_dev = 2.5 · 1295.3^0.38` — apply the schedule exponent to effort. `1295.3^0.38 ≈ 15.23`, so `T_dev ≈ 2.5 · 15.23 ≈ 38.08` months.
3. Average staff = `E / T_dev = 1295.3 / 38.08 ≈ 34.0` persons. *(Sanity check: ~1295 PM over ~38 months needs ~34 people working in parallel — plausible for a large project.)*

**Semi-detached**, KLOC = 400:
1. `E = 3.0 · 400^1.12 ≈ 3.0 · 820.9 ≈ 2462.8` PM *(matches the source's 2462)*.
2. `T_dev = 2.5 · 2462.8^0.35 ≈ 2.5 · 15.38 ≈ 38.45` months.
3. Staff ≈ `2462.8 / 38.45 ≈ 64.1` persons.

**Embedded**, KLOC = 400:
1. `E = 3.6 · 400^1.20 ≈ 3.6 · 1325.8 ≈ 4772.8` PM *(matches the source's 4772)*.
2. `T_dev = 2.5 · 4772.8^0.32 ≈ 2.5 · 15.04 ≈ 37.60` months.
3. Staff ≈ `4772.8 / 37.60 ≈ 127.0` persons.

**Result & sanity check.** Effort rises sharply organic → semi-detached → embedded (1295 → 2463 → 4773 PM) because both the multiplier `a` and the exponent `b` grow — same size, far more effort when complexity rises. Units carry through cleanly: person-months for E, months for T_dev, persons for staff.

> **Flag — the source's example is garbled/inconsistent.** m3-cocomo prints the effort equation with the exponents stripped off (`effort = 2.4 × (400) ≈ 1295`, the `^1.05` floating on a separate line) and reports the development time as **"≈ 38 months" for all three modes**. Our clean recomputation gives 38.08, 38.45, and **37.60** months — the three are *close* but not identical; the "all 38" is a rounding artifact, not a real result. The effort figures (1295 / 2462 / 4772) are correct. (source: m3-cocomo)

## Intermediate example

**Completion problem — Basic COCOMO for a 10 KLOC organic project.** A small, well-understood payroll-style tool is estimated at 10 KLOC (organic, since 2–50 KLOC) (source: m3-cocomo). Fill the last two steps; completed steps appear in Solutions.

1. Pick constants: organic → a = 2.4, b = 1.05, c = 2.5, d = 0.38.
2. `E = 2.4 · 10^1.05`. Note `10^1.05 ≈ 11.22`, so `E ≈ 26.9` person-months.
3. `T_dev = 2.5 · E^0.38 = ?`  ← **complete this**
4. Average staff = `E / T_dev = ?`  ← **complete this**

## Advanced example

**Fresh case, strategy hint only — full trade-off read on the monolith-vs-microservices table.** A web application has two candidate designs measured on four metrics (source: m3-perf):

| Metric | Design A (Monolith) | Design B (Microservices) |
|---|---|---|
| Avg response time | 800 ms | 400 ms |
| Throughput | 500 req/sec | 1200 req/sec |
| CPU utilization | 85% | 60% |
| Scalability | Poor | High |

Strategy hint: for each metric decide the *direction of "better"* (lower is better for response time and CPU utilization; higher is better for throughput; High beats Poor for scalability), tally which design wins each, and state the conclusion the source reaches. Then name one criterion *not* in this table that could still flip the final decision. (Work it yourself; the source's conclusion is in Solutions.)

## Real-world case study

**Smart-home security platform — capacity planning (scalability analysis).**

- **Situation:** A smart-home security platform monitors thousands of cameras and expects growing customer demand (source: m3-scalability).
- **Approach:** Engineers apply **capacity planning** — measure current usage (CPU, memory, disk I/O, network bandwidth), then analyze historical trends to predict future demand (source: m3-scalability).
- **Outcome:** They forecast *when* server capacity will need to increase, so expansion is planned ahead of demand rather than reacting to overload (source: m3-scalability).
- **Lesson:** Scalability analysis is proactive — capacity planning trades a little forecasting effort now for avoiding crashes and rushed, costly rework later (source: m3-scalability).

**Companion case — cloud traffic-monitoring elasticity.** A cloud-based traffic-monitoring system must scale up at peak hours but scale down at night to cut cost. Engineers use **elasticity testing**, simulating high-traffic events to confirm the system scales automatically up and down with demand (source: m3-scalability). Lesson: elasticity ties scalability directly to cost — releasing unused resources at night is a cost trade-off, not just a performance one (source: m3-scalability, m3-cost).

## Guided walkthrough

**A complete cost-method walkthrough: choosing between two camera designs with LCA, then justifying with ROI.**

1. **Frame the decision.** A smart-home security manufacturer compares two camera designs: design 1 has a *higher upfront cost but lower maintenance*; design 2 has a *cheaper build but higher long-term service expenses* (source: master-notes).
2. **Pick the method.** Because the difference is spread across the lifecycle, use **LCA**: identify all cost components (development, production, operation, maintenance, decommissioning), estimate them over the expected lifespan, and apply **discounted cash flow** to respect the time value of money (source: master-notes). This is the cost-model step (step 4) of the five-step cost analysis (source: m3-cost).
3. **Reason about the trade-off.** A higher upfront cost can mean lower operational cost later — exactly the case here — so comparing sticker prices alone would mislead; LCA over the lifespan is what reveals the true cheaper option (source: m3-cost).
4. **Justify the chosen investment with ROI.** Once a design is selected, quantify the gain. For an AI-surveillance investment, a company computes `ROI = (net gain − cost of investment)/cost of investment × 100%`, where the net gain comes from fewer false alarms, faster response, higher client satisfaction, and more contracts; a higher ROI signals a better financial return (source: master-notes).
5. **Feed forward.** The LCA cost figure and ROI become the *cost* and *risk/benefit* inputs to a [decision matrix](../13-decision-matrix/README.md) alongside the performance and scalability scores (source: m3-cost, m3-tradeoffs).

---

## Solutions

**Intermediate example (10 KLOC organic):**
3. `T_dev = 2.5 · 26.9^0.38`. `26.9^0.38 ≈ 3.49`, so `T_dev ≈ 2.5 · 3.49 ≈ 8.74` months.
4. Average staff = `26.9 / 8.74 ≈ 3.1`, i.e. ~3 persons. *(Sanity check: a 27 PM, ~9-month project run by ~3 people is reasonable for a small organic tool.)* (source: m3-cocomo)

**Advanced example (monolith vs microservices):** Design B (microservices) wins every metric — lower response time (400 vs 800 ms), higher throughput (1200 vs 500 req/sec), lower CPU utilization (60% vs 85%), and higher scalability (High vs Poor). The source concludes design B is better-performing and more scalable (source: m3-perf). A criterion not in the table that could still flip the decision: **cost** (microservices often raise operational/maintenance cost) or **risk/complexity** — which is why performance results feed into a multi-criteria decision matrix rather than deciding alone (source: m3-tradeoffs, master-notes).
