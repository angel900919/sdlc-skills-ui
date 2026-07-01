# Opportunity — question bank

Plain-English prompts per phase. Ask one or two at a time, always with a recommended answer the
user can react to. The framework terms in parentheses are for *you* — never push them into the
question. Adapt depth to `predicted_tier` and `technical_user`.

## Phase 1 — Anchor to the outcome (strategy-fit)
- "Which of your goals does solving this actually move — the North Star or one of the OKRs?"
- If nothing fits: "This doesn't seem to serve any goal you set — is the goal wrong, or is this the wrong problem to chase now?" (a no-fit is a real signal, not a thing to paper over)
- Reject: "it's just generally good." Force a named outcome, or record the gap as a strategy-fit risk.

## Phase 2 — Frame the opportunity, not a solution
- "In the customer's own words, what's the need or pain here — before we talk about how we'd solve it?"
- The litmus test (ask yourself, not them): is there only one way to address this? Then it's a solution in disguise — "Let me zoom out: the real need behind [the feature] is [X] — right?"
- "If you had to name 2–3 genuinely different ways to meet that need, what would they be?" (candidate solutions on the tree)
- Reject: "the opportunity is to build [feature]." Reframe up to the need the feature serves.

## Phase 3 — Sizing (rank, don't forecast)
- Top-down: "Roughly how many people/orgs have this problem, and what slice could we realistically reach?"
- Bottom-up: "Per customer, what's this worth — and how many could we plausibly serve in a year?"
- "These two estimates disagree — which is more defensible, and why?" (the gap is the insight)
- For any figure the user can't produce, offer to research it and mark it `TODO:`. Reject a size that's top-down only, and never let TAM stand in for revenue.

## Phase 4 — The four big risks + ethics
- "Where are we least sure this works — that people want it (value), can use it (usability), that we can build it (feasibility), or that it pays off (viability)?"
- "Could this harm someone, exclude a group, or leak/misuse personal data?" (ethics — always ask, even for a toy)
- For each risk: "What are we assuming that, if wrong, sinks it — and how strong is our evidence?" Mark the highest-importance, weakest-evidence one as *test first*.
- Reject: only four risks rated (ethics skipped), or every risk marked "low" with no evidence.

## Phase 5 — Lean business case
- "What does a win look like in money or saved time — a low, an expected, and a high figure?"
- "Roughly what does it cost to build and run?" → net / payback as ranges, not one precise number.
- "Is this easy to undo if we're wrong (two-way door), or hard/expensive (one-way)?" (reversible → decide fast on a lean case)
- "What's the cost of NOT doing this?" and "What single assumption, if wrong, breaks the case?" (sensitivity)
- Reject: one precise multi-year ROI number; false precision on a reversible bet.

## Phase 6 — Floor + the call
- Re-check the responsible-product floor against the scope you just sized.
- "Given all this — commit now (persevere), change something first (pivot), or park it (kill)? And what single thing would change that call?"
