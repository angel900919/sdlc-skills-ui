# Decision Matrices: Ranking & Scoring Alternatives — Projects

## Guided project — Smart Campus deployment matrix

**Goal.** Run a complete decision matrix to recommend a deployment model for a university's Smart Campus System (IoT sensors, smart classrooms, mobile app), and defend the recommendation with a sensitivity analysis (source: m3-ex-decision).

**Scenario.** Three alternatives: **Cloud**, **Hybrid (edge + cloud)**, **Local Server (on-premises)** (source: m3-ex-decision).

**Requirements.**
- Use the six course criteria with their weights: Cost 0.3, Performance 0.2, Scalability 0.2, Security 0.15, Maintenance & Support 0.1, User Experience 0.05 (source: m3-ex-decision).
- Score each alternative 1–5 on each criterion (use the source's scores, or justify your own).
- Compute every weighted score (score × weight) and every column total.
- Recommend a winner and explain it in terms of which weighted criteria drove the result.

**Suggested steps & "done" criteria per checkpoint.**
1. **Set up the matrix.** Rows = six criteria + weights; columns = three alternatives. *Done:* weights are present and sum to 1.0.
2. **Enter scores.** *Done:* every cell has a 1–5 score with a one-line rationale.
3. **Compute weighted scores.** *Done:* every cell shows score × weight; row math checks out.
4. **Total and decide.** *Done:* three totals computed; winner stated. (Source's stated totals: Cloud 3.95, Hybrid 3.65, Local 3.15 → Cloud wins — source: m3-ex-decision.)
5. **Sensitivity analysis.** Raise Security to 0.3 and drop another weight to keep the sum at 1.0; re-total. *Done:* you report whether the winner changed and why.
6. **Write the recommendation.** *Done:* one paragraph naming the winner, the decisive criteria, and the runner-up's strengths (source: m3-ex-decision).

## Independent (challenge) project — full matrix for a real choice

**Goal.** Apply the whole method to a genuine decision of your own (a laptop, a cloud provider, a database, a drone battery — your call) and produce a defensible recommendation (source: master-notes).

**Constraints only.**
- At least four criteria spanning at least two of the course's categories (performance, cost, risk, scalability, maintainability) (source: master-notes).
- Weights must be elicited deliberately (justify each from goals/stakeholder priorities) and sum to a consistent total (source: master-notes; m3-decision).
- At least three compatible alternatives, each with real quantifiable data in every cell (source: master-notes).
- Include a sensitivity analysis that changes at least one weight and reports whether the winner flips (source: master-notes).
- Conclude by confirming the top choice is practical and aligns with the goal — not just the highest number (source: master-notes).

**Stretch (cumulative across the domain):** source your cost scores from a life-cycle/COCOMO estimate and performance scores from a benchmark, both per [12-design-tradeoffs](../12-design-tradeoffs/README.md), so the matrix is fed by real tradeoff analysis rather than guesses.

## Build notes & solution sketch

- **Architecture.** A decision matrix is just a table: criteria rows (each with a weight), alternative columns, score in each cell, and weighted score = score × weight; totals are column sums (source: m3-decision). A spreadsheet with a `=score*weight` formula per cell and a `SUM` per column makes recomputation and sensitivity analysis trivial.
- **Key decision — where weights come from.** Don't invent them; derive from "what is the most important goal? who are the stakeholders and what do they prioritize?" and optionally engineers/surveys (source: master-notes). This is the step that most affects the outcome.
- **Hard part — comparable alternatives.** Scoring only works if all alternatives are at the same level of detail with data for every criterion (source: master-notes). If a cell has no data, you can't score it — gather the data or drop the alternative.
- **Hard part — sensitivity.** Keep weights summing to a constant as you perturb them; otherwise totals stop being comparable. A robust winner survives reasonable weight changes; a fragile one flips, which is itself a finding worth reporting (source: master-notes).
- **Don't over-trust the number.** The matrix ranks; you still confirm the top choice is practical and aligned with project goals before committing (source: master-notes).
