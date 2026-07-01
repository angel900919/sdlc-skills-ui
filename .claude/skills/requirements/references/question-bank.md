# Requirements — question bank

Plain-English prompts per phase. Ask one or two at a time, always with a recommended answer the
user can react to. The framework terms in parentheses are for *you* — never push them into the
question. Adapt depth to `predicted_tier` and `technical_user`.

## Phase 1 — Elicit & surface
- "Understanding already found the system needs to [behaviour X] — is that a hard requirement, and what would 'done right' look like?" (reuse needs; don't re-derive)
- Probe the classes people skip: "How fast / how reliable / how secure does this have to be — with a number?" (quality), "Does it have to work offline, or talk to another system?" (implicit), "Any regulation or standard it must meet?" (domain/constraint)
- Reject: a solution stated as a need ("it needs a Postgres table"). Capture the need behind it ("it must keep records for N years").

## Phase 2 — Write it SMART
- "Let me word that so we could test it: 'The system shall [action] [measurable threshold] [under what conditions].' — does that number sound right?"
- If a plain sentence is hard, fall back to an EARS pattern (When/While/If … the system shall …), then SMART-check it.
- Reject: two requirements jammed into one ("…and…") — split them; vague verbs ("support/handle/fast/robust") — replace with a number + condition.

## Phase 3 — Trace & seed a check
- "Which need does this come from — a discovery job, an understanding behaviour, or a strategy goal?" (no orphan requirements)
- "How would we confirm it's met — run a test, inspect a document/the code, analyse a model, or watch it behave?" (seed test / inspect / analyze / demo — a seed only; /qa decides)
- Sweep the other way: "Is every need we found covered by at least one requirement?" (flag uncovered needs)

## Phase 4 — Prioritise & resolve conflicts
- "Must-have, should-have, or could-have? (Must = the system can't function without it.)"
- "These two pull against each other (e.g. fast vs cheap, secure vs simple) — which wins, and why?" Flag the pair, decide by priority, record the rationale — don't silently pick one.

## Phase 5 — Measures
- "What handful of numbers would tell you the system is actually working — and do they ladder up to the North Star / success metric?" (mission-level measures feed /measure)
- "For the risky requirements, what's the target and the threshold?" (per-requirement measurable threshold)

## Phase 6 — Floor + modes
- Responsible-product floor: "What must this never do — leak data, exclude someone, cause harm?" Capture it as a security/privacy/safety requirement.
- If the system has operating modes (off / idle / active / fault / maintenance), enumerate them and the transitions.
