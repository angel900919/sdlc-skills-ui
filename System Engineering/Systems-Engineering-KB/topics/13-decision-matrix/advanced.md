# Decision Matrices: Ranking & Scoring Alternatives — Advanced concepts

## Advanced concepts

- **Sensitivity analysis as a first-class step.** The master notes embed sensitivity analysis directly into "make a decision": *what if priorities change? Adjust weights and see how rankings shift* (source: master-notes). Beyond confirming a winner, it tells you *which weight* the decision hinges on — the criterion whose small change flips the ranking is where you should spend the most effort getting the weight right.
- **Derived vs. direct criteria.** The drone-battery case scores **energy capacity**, but the thing stakeholders care about is **flight time**; capacity is the measurable proxy ("energy capacity, which transforms into flight time") (source: master-notes). Choosing a measurable proxy for a hard-to-measure goal is a recurring modeling decision in building criteria.
- **Mixed scoring scales.** The course explicitly allows different scoring methods — 1–10, low/medium/high, or percentage (source: master-notes). If you mix scales across criteria you must normalize before weighting, or a 1–10 criterion will silently dominate a 1–5 one regardless of weight. [OUTSIDE MATERIAL]

## Edge cases & gotchas

- **Ties.** Equal totals (see exercises C4) mean the criteria/weights don't yet discriminate; resolve by adding a criterion or refining weights rather than picking arbitrarily. [OUTSIDE MATERIAL]
- **Source arithmetic doesn't always foot.** In the Smart Campus solution the stated totals (3.95/3.65/3.15) are ~0.05–0.10 higher than the sum of the printed per-cell weighted values (3.85/3.55/3.10) (source: m3-ex-decision). The ranking is unaffected, but it's a reminder to recompute totals yourself rather than trust a printed total.
- **Best-on-one-criterion ≠ best overall.** Centralized wins on cost yet loses overall; Local Server wins on performance and security yet loses overall — both because they're weak on the heavily-weighted criteria (source: m3-decision; m3-ex-decision). The whole point of weighting is to override this single-criterion intuition.
- **Incompatible alternatives.** Options at different scope/detail, or with empty cells, invalidate the comparison (source: master-notes). The matrix can't flag this for you — it's a precondition you must enforce.

## Performance, production & security considerations

The source treats performance, cost, scalability, risk, and security as *criteria fed into* the matrix, not as properties of the matrix method itself. How to measure them lives in [12-design-tradeoffs](../12-design-tradeoffs/README.md); how to weight and combine them lives here. The method has no runtime performance or security profile of its own.

## Where to go deeper

- **master-notes, Section 3 (Evaluating Design Tradeoffs)** — the fullest treatment of criteria categories, weighting, scoring scales, the drone-battery example, and sensitivity analysis.
- **m3-decision** — the canonical three-architecture worked matrix; re-derive its totals to cement the procedure.
- **[12-design-tradeoffs](../12-design-tradeoffs/README.md)** — to source real numbers for the cells (benchmarking, life-cycle cost, COCOMO, scalability methods) rather than guessing scores.
- **[11-architecture-frameworks](../11-architecture-frameworks/README.md)** — for organizing the alternatives themselves before you rank them.
