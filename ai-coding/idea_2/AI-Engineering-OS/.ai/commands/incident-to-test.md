---
description: Turn a production failure into a permanent regression check before the incident is closed — root-cause, classify, write the failing-then-passing check, name the guardrail. Pass the trace/logs.
argument-hint: "[trace/log path or incident description]"
---

# Incident → regression test — close the loop for good

The failure to close: **$ARGUMENTS** (a trace, logs, or an incident description) — read and reason from it.

1. **Root-cause** it at a specific **node boundary**: which call, what input, what wrong output.
2. **Classify** it: prompt/model issue · tool issue · data issue · or harness/logic bug.
3. **Write the check that FAILS pre-fix and PASSES post-fix** — an **eval case** OR a **deterministic spec.** Stub the probabilistic nodes; **assert on the node that changed, never on a stubbed one.** Show it failing, then passing.
4. **Name the guardrail** — in code, **OUTSIDE the model** (a classifier, a schema check, a refusal) — that makes this class of failure **loud** next time.

The incident is **not closed until (3) exists and is in the suite.** Add it, then append the one-line lesson to `.ai/lessons.md`.

*Implements spine item #5 (guardrails outside the model) and "every failure becomes a permanent check". See [`guides/05_quality-and-operations.md`](../../guides/05_quality-and-operations.md).*
