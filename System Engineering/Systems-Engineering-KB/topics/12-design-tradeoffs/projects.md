# Evaluating Design Trade-offs: Performance, Cost & Scalability — Projects

## Guided project

**Full trade-off analysis for a smart-home security platform.**

**Goal:** Produce a written trade-off analysis covering performance, cost, and scalability for one system, ending in a justified recommendation between two candidate architectures (Monolith vs Microservices). Ground every figure in a method from this topic. The scenario is the source's smart-home security domain (source: m3-scalability, m3-perf).

**Requirements:**
- Cover all three core criteria — performance, cost, scalability (source: m3-tradeoffs).
- Use the m3-perf monolith-vs-microservices metric table as your performance evidence (source: m3-perf).
- Include at least one COCOMO effort estimate for one candidate (source: m3-cocomo).
- Apply at least one cost method (LCA, TCO, CBA, or ROI) (source: master-notes).
- Classify the platform's growth path by scalability type and name the analysis method you'd use (source: m3-scalability).

**Suggested steps & "done" criteria:**

1. **Scope & criteria.** State the system, the two alternatives, and the criteria you'll score (performance, cost, scalability, plus any of reliability/security/usability/risk). *Done:* criteria list with a one-line "why it matters" each (source: m3-tradeoffs).
2. **Performance.** Define a threshold (e.g. "< 1 s for 95% of requests"), pick metrics, and read the four-metric table for both designs; state which design wins each metric. *Done:* a filled metric table and a one-line performance verdict (source: m3-perf).
3. **Cost — COCOMO.** Estimate one candidate's size in KLOC, classify its mode, and compute E and T_dev. *Done:* effort (PM) and dev-time (months) with units and a sanity check on staff size (source: m3-cocomo).
4. **Cost — method.** Pick LCA/TCO/CBA/ROI for comparing the two designs and list the cost components it pulls in. *Done:* method named with justification and the cost types it covers (source: m3-cost, master-notes).
5. **Scalability.** Classify the platform's growth (vertical vs horizontal etc.) and choose an analysis method (capacity planning / elasticity / bottleneck / modular). *Done:* type + method named with a one-line reason (source: m3-scalability).
6. **Recommend.** State which design you'd pick and the single criterion that drove it; note that the formal combination happens in a [decision matrix](../13-decision-matrix/README.md). *Done:* one-paragraph recommendation tied to your numbers (source: m3-tradeoffs).

## Independent (challenge) project

**Cumulative trade-off study for a cloud traffic-monitoring system.**

**Goal:** Choose any non-trivial system you understand (or the source's cloud-based traffic-monitoring system) and deliver a complete, defensible design trade-off study from scratch.

**Constraints:**
- Evaluate at least three candidate designs, not two.
- Score every design on performance, cost, and scalability, and at least one additional criterion (reliability, security, usability, or risk) (source: m3-tradeoffs).
- Include a COCOMO estimate per design and at least two cost methods, one of which discounts over time (NPV or LCA with DCF) (source: m3-cocomo, m3-cost, master-notes).
- Address elasticity explicitly — the system must scale up at peak and down off-peak to control cost (source: m3-scalability).
- Hand off your per-criterion numbers in a form ready to drop into a [decision matrix](../13-decision-matrix/README.md); do not build the matrix here (that's topic 13).

## Build notes & solution sketch

- **Architecture of the analysis:** one section per criterion, each ending in a single comparable number or rating, then a short synthesis. Keep the *production* of numbers (topic 12) separate from their *combination* (topic 13) — that boundary is the whole point of this topic (source: m3-tradeoffs).
- **Key decision — COCOMO mode:** choose mode by both size band *and* complexity/environment, not size alone; a 60 KLOC flight-control component is embedded, not semi-detached, because of its rigor and complexity (source: m3-cocomo).
- **Key decision — cost method:** if alternatives differ mainly in *when* money is spent (high upfront vs high running), use LCA/NPV with discounting; if you must justify spend against benefits, use CBA (net benefit) or ROI (source: m3-cost, master-notes).
- **The hard part — elasticity vs capacity planning:** capacity planning answers "how much can we take before degrading?"; elasticity testing answers "how smoothly do we scale up and down with real-time demand?" The traffic-monitoring scenario needs *elasticity* because of its day/night swing, even though capacity planning also applies (source: m3-scalability).
- **Sanity checks:** carry units everywhere (PM, months, persons, $); confirm COCOMO staff ≈ E/T_dev is a plausible team size; verify "better" direction per metric before tallying (lower is better for latency/CPU, higher for throughput/availability) (source: m3-cocomo, m3-perf).
- **Don't:** rank designs holistically by eye, or compare upfront cost only — both are the headline pitfalls of this topic (source: m3-cost).
