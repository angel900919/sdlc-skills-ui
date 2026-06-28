# Prompts — how to drive this workflow with AI

Three files, three jobs:

| File | What it's for |
|---|---|
| [`ai-prompt-library.md`](ai-prompt-library.md) | **The phase-by-phase prompt library.** Ready-to-paste prompts for each of the 17 phases, grouped by intent: ELICIT (interview me), GENERATE (draft an artifact), CRITIQUE (red-team my draft), and GATE (challenge readiness). Every phase skill's *AI prompt pack* is a curated subset of this. |
| [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md) | **The cross-phase patterns.** Eight reusable shapes (interviewer, drafter, red-teamer, the "is this an outcome?" check, the assumption-finder, the metric-tree builder, the synthesiser, the gate-challenger) you can apply in any phase. |
| [`research-and-agents.md`](research-and-agents.md) | **When to leave the chat.** When to talk to a customer, when to web-research, and when to spawn a specialised agent — with invocation prompts and what each must return. |

## The four prompt intents (use them everywhere)

Every phase uses the same four moves. Name the intent when you prompt so the AI knows the mode:

1. **ELICIT** — "Interview me one topic at a time to produce `<artifact>`. Use AskUserQuestion for finite choices. Don't dump every question at once." *(The AI is the interviewer; you supply the truth.)*
2. **GENERATE** — "From `<these inputs>`, draft `<artifact>` in the template shape. Flag every unsupported claim as `TODO:`; invent nothing." *(The AI drafts; you verify.)*
3. **CRITIQUE** — "Red-team this `<artifact>`: weakest evidence, riskiest untested assumption, vanity metrics, missing NFRs/stakeholders, outputs with no outcome. Rank findings S1–S4." *(The AI is the skeptic.)*
4. **GATE** — "Play the `<gate>` board. Given the evidence, recommend Persevere / with-actions / Pivot / Hold / Kill and justify it. Don't rubber-stamp." *(The AI challenges readiness; you decide.)*

## Standing rules for every prompt (from the [Protocol](../02_AI_Product_Manager_Protocol.md))

- **AI accelerates; the human decides.** Never let AI output enter a baseline un-verified — especially a fabricated "customer insight," metric, or market number.
- **One topic at a time** when eliciting; show-back and confirm before advancing.
- **Never invent.** Unknowns become `TODO: <what's owed>` + a research/interview recommendation.
- **Trace everything** per [Conventions §4](../05_Conventions.md): every bet links to an opportunity and a metric.
- **Context7 first** for any library/framework/SDK/API/CLI/cloud question.
