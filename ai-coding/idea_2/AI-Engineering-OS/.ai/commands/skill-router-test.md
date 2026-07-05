---
description: Stress-test a Skill's description as its router — does the WHAT/WHEN read clearly without the body? Pass the skill path, name, or the pasted description. Run before shipping any Skill.
argument-hint: "[skill path/name or pasted description]"
---

# Skill router test — does the description route?

The description under test: **$ARGUMENTS**
If that is a path or a skill name, read only that skill's **frontmatter description**. Otherwise treat the argument as the pasted description. **Do NOT read the skill body** — the whole point is whether the description alone routes correctly.

From the description alone, answer:
1. In your own words, **WHAT** does this skill do and **WHEN** would you load it?
2. Give **3 user messages that SHOULD trigger it**, and **3 near-misses that should NOT.**
3. Is the description **first-person or ambiguous** anywhere? Is it **missing trigger terms** users actually type?

If your answer to (1) is fuzzy or over-broad, the description is wrong. **Rewrite it** — third person, "what + when", concrete trigger terms — and show the **before / after.**

Remember: the description is a **router, not a summary.** The body can be perfect and the skill will still never load if this fails.

*Implements spine item #6 (recurring expertise as Skills). See [`guides/03_agent-skills.md`](../../guides/03_agent-skills.md).*
