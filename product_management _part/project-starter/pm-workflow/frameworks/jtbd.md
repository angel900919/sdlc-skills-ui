# Jobs-to-be-Done (JTBD)

A lens that frames demand around the *job* a customer is trying to get done — the progress they seek — rather than around the product, demographic, or feature.

**Primary source / attribution (two distinct schools):** **ODI / outcome-driven** (Tony Ulwick / Strategyn) and **Switch / Forces of Progress** (Bob Moesta, Chris Spiek; Clayton Christensen). Canon: [`05_Conventions.md` §8](../05_Conventions.md), pinned in [`03_Frameworks_Map.md`](../03_Frameworks_Map.md).

## What it's for / when to use
- Separating the stable problem (the job) from any one solution.
- Finding under-served outcomes and the causal reason people switch.
- Pick the school by goal: **Switch / Forces** to *find and frame* the job (qualitative); **ODI** to *quantify and prioritize* outcomes (quantitative). 2026 consensus: they are complementary, not rivals.

## The steps
**ODI / outcome-driven (Ulwick):**
1. Define the core functional job and its steps.
2. Capture **desired-outcome statements** (direction + metric + object of control).
3. Survey customers: rate each outcome on **importance × satisfaction**.
4. Score opportunity = `Importance + max(Importance − Satisfaction, 0)`; target high-importance / low-satisfaction (under-served) outcomes.

**Switch / Forces (Moesta / Christensen):**
1. Run **switch interviews** to reconstruct the timeline of a real purchase/switch.
2. Map the four **Forces of Progress**: push (of the old) + pull (of the new) vs. habit + anxiety.
3. Write **Job Stories**: "When [situation], I want to [motivation], so I can [outcome]."

## Worked micro-example
*Milkshake (Christensen):* morning commuters "hire" a thick shake to make a dull drive less boring and stay full till lunch — its real competitors are bananas and bagels, not other shakes. *ODI version:* for the job "make the commute less boring," survey outcomes like "minimize how soon the snack is gone before arrival" — high importance, low satisfaction → an opportunity to make it thicker / last longer.

## When NOT to use it
- Don't treat qualitative switch interviews or job stories as *quantitatively validated* demand — that's ODI's job.
- Not a replacement for personas: well-made personas (goals/motivations) are complements; only demographic-portrait personas are obsolete.
- When you need delivery cadence or UX-quality metrics, not demand theory.

## Common mistakes / anti-patterns
- "JTBD killed personas" / "personas replace JTBD" — a false rivalry.
- Demographic-only personas presented as the job.
- Counting feature requests instead of outcomes.
- Trusting AI / synthetic-user output without human review.

## Used in phases
- **ODI:** [pm-phase-03-discovery](../../.claude/skills/pm-phase-03-discovery/), [pm-phase-04-opportunity](../../.claude/skills/pm-phase-04-opportunity/) — also [pm-phase-02-market-research](../../.claude/skills/pm-phase-02-market-research/), [pm-phase-06-prioritization](../../.claude/skills/pm-phase-06-prioritization/).
- **Switch / Forces:** [pm-phase-03-discovery](../../.claude/skills/pm-phase-03-discovery/) — also [pm-phase-11-launch-gtm](../../.claude/skills/pm-phase-11-launch-gtm/) (positioning), [pm-phase-14-feedback](../../.claude/skills/pm-phase-14-feedback/).

## Source
- https://anthonyulwick.com/jobs-to-be-done/
- https://www.intercom.com/blog/accidentally-invented-job-stories/
- https://jobs-to-be-done.com/debunking-klements-attack-on-odi-70e86617f4d8
