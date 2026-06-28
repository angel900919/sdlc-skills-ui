# Decision Matrices: Ranking & Scoring Alternatives — Exercises

## Warm-up

Tier-1 recall — answer from memory; check the Solutions section.

1. Name the other term the course uses for a decision matrix.
2. List the six steps to build a decision matrix, in order.
3. Give the five criteria categories the course says decision criteria generally fall into.
4. Write the formula for a single weighted score and for an alternative's total.
5. What should a set of criterion weights add up to, expressed as decimals?

## Core exercises

Tier-2 apply-to-scenario.

**C1 — Compute one cell.** A criterion has weight 0.4; an alternative scores 5 on it. What is the weighted score, and why? (source: m3-decision)

**C2 — Total a column.** Given the architecture example's Microservices column (Performance 1.6, Cost 0.9, Scalability 1.5), compute the total and compare it to Serverless (4.7). Which wins? (source: m3-decision)

**C3 — Guidance-fading pair.**
- *(a, scaffolded)* Weights are Cost 0.3, Performance 0.2, Scalability 0.2. An alternative scores Cost 4, Performance 3, Scalability 5. Compute the three weighted scores, then their partial sum. (source: m3-ex-decision)
- *(b, unscaffolded)* Add the remaining three Smart Campus criteria for the same alternative — Security 0.15 (score 3), Maintenance & Support 0.1 (score 4), User Experience 0.05 (score 4) — and give the full total. State which alternative this is. (source: m3-ex-decision)

**C4 — Build a small matrix.** You must choose between two web-server options for a Smart Campus mobile-app backend. Use exactly two criteria: cost (weight 0.6) and performance (weight 0.4). Option X: cost 3, performance 5. Option Y: cost 5, performance 2. Build the matrix, compute totals, and pick a winner. (Scenario grounded in m3-ex-decision; numbers are illustrative.) [OUTSIDE MATERIAL]

**C5 — Explain it back (Feynman).** In 4–5 sentences, explain to a teammate who has never seen one *why* a decision matrix multiplies scores by weights instead of just averaging the scores. Self-check rubric: (a) you mention that criteria differ in importance; (b) you state that weights encode priorities; (c) you note that without weights a trivial criterion counts as much as a critical one; (d) you give a concrete number (e.g. a 5 on a 0.4 weight beats a 5 on a 0.3 weight). (source: master-notes; m3-decision)

## Challenge exercises

Tier-3 analyze/evaluate.

**X1 — Sensitivity analysis.** Take the architecture matrix (weights Performance 0.4, Cost 0.3, Scalability 0.3; totals A 3.3, B 4.0, C 4.7). Suppose the team decides **cost** is now the top priority: set Cost 0.5, Performance 0.25, Scalability 0.25. Re-compute all three totals using the original 1–5 scores (A: P3 C5 S2; B: P4 C3 S5; C: P5 C4 S5) and state whether the winner changes. (source: m3-decision; sensitivity step from master-notes)

**X2 — Diagnose a broken matrix.** A colleague's matrix has weights 0.4, 0.3, 0.3, 0.2 across four criteria and one alternative is described in a one-page spec while another is a single sentence. Identify the two flaws and how to fix each. (source: m3-decision; master-notes)

**X3 — Interleaved set (which concept applies?).** For each task, first decide whether it belongs to **this topic (decision matrix)**, to **[12-design-tradeoffs](../12-design-tradeoffs/README.md)** (measuring one factor), or to **[11-architecture-frameworks](../11-architecture-frameworks/README.md)** (organizing an enterprise architecture) — then say in one line how you'd start.
- (i) "Benchmark the camera's response time against three competitor models."
- (ii) "Pick between Cloud, Hybrid, and Local deployment using cost, performance, scalability, security."
- (iii) "Compute the life-cycle cost of a camera design."
- (iv) "Rank three drone batteries on size, weight, energy capacity, and cost."

**X4 — Build the map yourself.** Here are the nodes of the decision-matrix process: `Define criteria`, `Identify alternatives`, `Weight criteria`, `Score alternatives`, `Multiply score × weight`, `Sum per alternative`, `Make decision`, `Sensitivity analysis`. Draw the directed edges (including the loop sensitivity analysis forms back to the decision). Label each edge with what flows along it. (source: m3-decision; master-notes)

---

## Solutions & explanations

**Warm-up**
1. **Weighted Scoring Model** (source: m3-decision).
2. Define decision criteria → Identify alternatives → Weight the criteria → Score each alternative → Multiply score × weight → Sum totals & decide (source: m3-decision). (The notes append sensitivity analysis into the decide step — source: master-notes.)
3. Performance, Cost, Risk, Scalability, Maintainability (source: master-notes).
4. weighted score = score × weight; total = sum of an alternative's weighted scores (source: m3-decision).
5. 1.0 (i.e. 100%); e.g. 0.4 + 0.3 + 0.3 = 1.0 (source: m3-decision).

**C1** 5 × 0.4 = **2.0**. The score is scaled by the criterion's importance, so a top score on the most-weighted criterion contributes the most (source: m3-decision).

**C2** Microservices total = 1.6 + 0.9 + 1.5 = **4.0**. Serverless (4.7) still wins (source: m3-decision).

**C3** (a) Cost 4×0.3 = 1.2; Performance 3×0.2 = 0.6; Scalability 5×0.2 = 1.0; partial sum = **2.8**. (b) Security 3×0.15 = 0.45; Maintenance 4×0.1 = 0.4; UX 4×0.05 = 0.2; full total = 2.8 + 0.45 + 0.4 + 0.2 = **3.85** (the source states this alternative's total as 3.95). This is **Alternative 1 (Cloud)** (source: m3-ex-decision). The ~0.10 gap is an inconsistency in the source's stated totals; the ranking is unaffected (see examples.md Solutions).

**C4** X: cost 3×0.6 = 1.8, performance 5×0.4 = 2.0 → total **3.8**. Y: cost 5×0.6 = 3.0, performance 2×0.4 = 0.8 → total **3.8**. A **tie** — break it by adding a criterion or refining weights/scores; this shows why a single extra criterion or a sensitivity check matters. [OUTSIDE MATERIAL]

**C5** Model answer: criteria aren't equally important, so we attach a weight to each; multiplying score × weight makes each judgment count in proportion to its priority. A plain average would let a minor criterion outweigh a critical one. Example: a 5 on a 0.4-weighted criterion contributes 2.0, but the same 5 on a 0.3-weighted criterion contributes only 1.5 — the weight, not just the score, drives the total (source: m3-decision; master-notes).

**X1** New weights Cost 0.5, Performance 0.25, Scalability 0.25.
- A (P3 C5 S2): 3×0.25 + 5×0.5 + 2×0.25 = 0.75 + 2.5 + 0.5 = **3.75**.
- B (P4 C3 S5): 4×0.25 + 3×0.5 + 5×0.25 = 1.0 + 1.5 + 1.25 = **3.75**.
- C (P5 C4 S5): 5×0.25 + 4×0.5 + 5×0.25 = 1.25 + 2.0 + 1.25 = **4.5**.
**Winner is still C (4.5)** — but A jumped from last to tied-for-second, and C's margin shrank from 0.7 to 0.75 over a now-tied A/B. The decision is robust to this re-weighting, though cost-heavy priorities clearly help the cheap option A (source: m3-decision; sensitivity step from master-notes).

**X2** Flaw 1: the weights (0.4 + 0.3 + 0.3 + 0.2 = 1.2) don't sum to 1.0, so totals aren't comparable — normalize them to sum to 1.0 (source: m3-decision). Flaw 2: the alternatives aren't at the same level of detail/scope, so scoring is unreliable — bring both to comparable detail with quantifiable data for every criterion before scoring (source: master-notes).

**X3** (i) **12-design-tradeoffs** — it's measuring one factor (performance) via benchmarking; start by defining the performance metric and running standardized tests. (ii) **Decision matrix (this topic)** — multiple weighted criteria across alternatives; start by setting weights and scoring each option. (iii) **12-design-tradeoffs** — life-cycle cost analysis of a single design; start by listing cost components over the lifespan. (iv) **Decision matrix (this topic)** — ranking alternatives on weighted criteria; start by weighting size/weight/energy capacity/cost and scoring each battery. Common trap: (i) and (iii) feed numbers *into* a matrix but are not themselves the matrix (source: m3-decision; master-notes).

**X4** Edges: Define criteria —*chosen factors*→ Identify alternatives —*compatible options*→ Weight criteria —*importance %/1-5/1-10*→ Score alternatives —*raw 1-5 ratings*→ Multiply score × weight —*per-cell products*→ Sum per alternative —*column totals*→ Make decision. Loop: Sum per alternative —*adjust a weight, re-total*→ Sensitivity analysis —*is the ranking stable?*→ Make decision (source: m3-decision; master-notes).
