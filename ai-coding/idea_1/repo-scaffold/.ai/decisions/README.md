# Decision Log (agent-facing)

Lightweight, dated records of decisions so agents don't re-propose designs already ruled out. This is the "precedent, not just facts" layer — a knowledge base tells an agent what's true; a decision log tells it *why* choices were made.

- One file per decision: `NNNN-short-title.md` (see `TEMPLATE.md`).
- Newest decisions win; mark superseded ones and link the replacement.
- Agents **propose** (status: proposed); humans **accept**. Agents must not contradict an accepted decision — propose a new one instead.
- This is the terse, agent-facing log. The human-facing, fuller ADRs live in `.human/adr/`. For small/reversible calls, a line here is enough; for significant/irreversible architecture, write a `.human/adr/` too.
