# Strategy — question bank

Plain-English prompts per phase. Ask one or two at a time, always with a recommended answer the
user can react to. The framework terms in parentheses are for *you* — never push them into the
question. Adapt depth to `predicted_tier` and `technical_user`.

## Phase 1 — Vision (the better future)
- "Picture someone who uses this for a year. What's better in their life that wasn't before?"
- "If this works, what do they stop having to do?"
- Recommended-answer style: "I'd say the win is *they never lose track of X again* — close, or different?"
- Reject: a feature list ("it has reminders and a dashboard"). Push to the *outcome* the features serve.

## Phase 2 — Diagnosis (the one obstacle)
- "What's the single biggest reason this is hard today — the thing that, if you cracked it, makes the rest possible?"
- "Why hasn't an existing tool already solved this for them?"
- If the answer is a market/customer claim ("people will pay because X"): "How sure are we — is that something we know, or something we'd need to check?" → log an assumption, flag for `/market-research` or `/discovery`.
- Reject: a goal dressed as a diagnosis ("we need more users"). A diagnosis names an obstacle, not a wish.

## Phase 3 — Guiding policy + coherent actions
- "Given that obstacle, what's our one overall approach to beating it?"
- "What are the 2–3 moves that all push in that same direction?"
- Check the cascade in plain words: does each move serve the approach, and the approach the vision?
- Reject: a grab-bag of unrelated initiatives. Coherent actions reinforce each other.

## Phase 4 — Non-goals (the trade-offs)
- "What are we deliberately NOT doing — a type of user, a problem, or a channel we're choosing to skip?"
- Offer 2–3 candidates from the conversation so far if they stall.
- Reject: "we'll do everything eventually." Force at least one real decline; strategy is choice.

## Phase 5 — North Star (the one number)
- "What's the one number that goes up only when someone actually got value from this?"
- Offer candidates; for each, ask the killer question: "Could this number rise while customers are unhappy or leaving?" If yes, it's vanity — drop it.
- "What are 2–4 smaller numbers that move the big one?" (input metrics)
- "What must NOT get worse while we chase it?" (guardrail — ties to the responsible-product floor)
- Reject: DAU, sign-ups, raw revenue, page views.

## Phase 6 — OKRs (measure the strategy)
- "Over the next quarter or two, what 1–3 outcomes would tell us the strategy is working?"
- For each: "How would we measure that — from what to what, by when?"
- Reject: output-counting ("ship 5 features"). A key result is an outcome that moved, not work that happened.

## Phase 7 — Floor + risks
- "Could this harm someone, exclude a group, or leak/misuse personal data?" (always ask, even for a toy)
- "What's the biggest bet we're making that could be wrong?" → assumption, with where it gets tested.
