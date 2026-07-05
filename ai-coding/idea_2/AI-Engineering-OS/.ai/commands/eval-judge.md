---
description: Build a five-part LLM-as-judge prompt to grade model output on ONE dimension at scale, plus a validation plan. Pass the dimension and role context as arguments. Use before trusting any judge.
argument-hint: "[dimension + role context]"
---

# Eval judge — build a five-part judge for one dimension

The dimension and domain context to grade: **$ARGUMENTS**

First, a gate: **if a deterministic check** (exact match, schema validation, a unit assertion) **could grade this dimension, tell me to use that instead.** Only build an LLM judge for genuinely subjective dimensions.

If a judge is warranted, build it as a **five-part prompt**:
1. **Role with domain context** — e.g. *"a senior credit-risk analyst"*, never *"a helpful assistant"*.
2. **Exactly one dimension** — name it. A judge that grades many things grades none of them well.
3. **Explicit, testable PASS criteria and FAIL criteria** — no vibes.
4. **Two labelled few-shot examples** — one real PASS, one real FAIL. **Ask me for these** — do not invent domain examples.
5. **Output contract** — reason briefly, THEN strict JSON `{"label":"PASS"|"FAIL"|"UNKNOWN","explanation":"..."}`; return `UNKNOWN` rather than guess.

Ask me for any criteria or examples you need; then output the finished judge prompt in a fenced block.

Finally, a **validation plan**: hand-label ~50 real outputs, run the judge, and report **precision AND recall** (prioritize recall — a missed failure is worse than a false alarm). Trust the judge only if it clears that bar; re-validate when the prompt or model changes.

*Implements spine item #4 (layered evals). See [`guides/05_quality-and-operations.md`](../../guides/05_quality-and-operations.md).*
