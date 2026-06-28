# Working Backwards / PR-FAQ

Write the customer-facing **press release plus FAQ first** — before building — to force clarity on the value, the customer, and the problem. If you can't write a compelling PR-FAQ, you don't yet understand the opportunity. **Primary source:** Amazon (the "Working Backwards" process) (canon: [`../05_Conventions.md` §8](../05_Conventions.md)).

## What it's for / when to use
- Pressure-testing an idea's *desirability and clarity* at the spec stage (P08), as an alternative to a heavyweight PRD.
- Aligning leadership and the team on the **outcome and the "why now"** before committing build effort.
- Cultures that value narrative memos over slide decks and want a single, reviewable artifact.
- Remember: a PR-FAQ (like any PRD) **documents validated decisions — it does not replace discovery** (Cagan).

## The steps
1. **Press release (1 page)** — written in the future tense as if the product just launched: headline, sub-head, the customer problem, the solution, a customer quote, how to get started.
2. **Lead with the customer and "why now"**, not the feature list.
3. **FAQ — customer questions:** what is it, what does it cost, how is it different, what are the limits.
4. **FAQ — internal/stakeholder questions:** the hard ones — economics, dependencies, risks, what could make this fail, the four big risks (value/usability/feasibility/viability).
5. **Review and iterate** — circulate the memo, read it silently in the room, debate the substance. Revise until the narrative is honest and compelling.
6. **Only then design and build** — the PR-FAQ becomes the north star the spec serves.

## Worked micro-example
PR headline: *"Acme launches Instant Refunds — shoppers get money back in seconds, not days."* Sub-head names the segment (online shoppers who abandon carts over refund anxiety). Customer quote articulates relief. Customer FAQ: "Is there a fee? No." Internal FAQ: "What's the fraud exposure?" forces an honest risk answer and a guardrail metric (`MET-TBD`) *before* a line of code — surfacing that fraud, not UX, is the riskiest assumption.

## When NOT to use it
- Small, reversible, two-way-door changes where a one-pager or a prototype-as-spec is enough.
- When the team would write a polished PR-FAQ to *sell* a decision already made (theater).
- As a substitute for discovery — a beautiful narrative about an unvalidated problem is fiction.

## Common mistakes / anti-patterns
- Writing the memo **instead of doing discovery**; treating it as a one-time pre-delivery phase.
- Hallucinated or invented "commitments," metrics, or customer quotes (especially AI-drafted) — humans own strategic intent and validate against real customer context.
- Leading with features and what's new instead of customer value and "why now."
- A heavyweight, frozen hand-off doc; the PR-FAQ should stay a living source of truth with an owner and changelog.

## Used in phases
- **Primary:** [pm-phase-08-prd](../../.claude/skills/pm-phase-08-prd/)
- **Also:** [pm-phase-01-strategy](../../.claude/skills/pm-phase-01-strategy/), [pm-phase-11-launch-gtm](../../.claude/skills/pm-phase-11-launch-gtm/)

## Source
- https://workingbackwards.com/concepts/working-backwards-pr-faq-process/
- https://www.svpg.com/discovery-vs-documentation/
- https://amplitude.com/blog/move-from-outputs-to-outcomes
