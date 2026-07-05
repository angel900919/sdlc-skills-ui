---
name: skill-authoring
description: >-
  Guides writing and reviewing an Agent Skill the right way — description-as-router,
  capture-gotchas-not-coverage, the progressive-disclosure budget, degrees of freedom,
  deterministic-to-script, and evals-first with the sentence-deletion test. Use when
  creating a new Skill, reviewing or pruning an existing SKILL.md, or turning repeated
  corrections into reusable expertise. Ships a copyable SKILL.md template.
---

# Skill Authoring

<!-- Guide 03. The meta-skill: how to build a skill that actually moves the number. -->

## ⚠️ Must-not-miss (stays in the body)
- **Capture gotchas, not coverage.** Document ONLY where the model's prior is wrong — its landmines, your conventions. Re-explaining what it already knows adds tokens and *lowers* accuracy (WorkOS: 10k→553 lines, 77%→97%).
- **Ship nothing that doesn't beat the no-skill baseline.** A plausible skill can be net-negative and invisible without an eval. Baseline first; delete anything that doesn't clear it.
- **Load-bearing content stays in the BODY.** Progressive disclosure is a budget, not a guarantee — agents skip reference files, so any always-needed or safety-critical rule lives in SKILL.md, not `references/`.

## Workflow (build in this order)
1. **Write the `description` first** — third person, *what* + *when* + the trigger terms users actually type. Route-test it with [`/skill-router-test`](../../commands/skill-router-test.md) before writing a line of body.
2. **Set degrees of freedom to the task** — narrow bridge (fragile, one right way) → an exact script or strict checklist; open field (many valid ways) → prose principles + constraints. A rigid script on an open task regressed accuracy ~30%.
3. **Keep the body ≤500 lines**; push genuinely-optional bulk to `references/` (one level deep, with a ToC if >100 lines).
4. **Push deterministic work into `scripts/`** — the agent *executes* it, not re-derives it. Handle errors inside; no magic constants.
5. **Develop against evals** — write ≥3 scenarios from real failures, baseline without the skill, add the minimal instructions that close the gap, test across Haiku/Sonnet/Opus.
6. **Prune with the deletion test** — delete a sentence; if behavior doesn't change, it wasn't load-bearing. Cut no-ops, persona sediment, duplication.
7. **Gate un-fakeable steps** — for a must-happen step, make honesty cheaper than faking (hash the real test output; a `touch`-ed empty file can't satisfy the gate).

## Start from the template
Copy `assets/SKILL.template.md` and delete what you don't need. Mine repeated corrections into skills with [`/extract-skill`](../../commands/extract-skill.md).

## Deeper material (loaded on demand)
- The full authoring + review checklist, the three failure modes, trigger states, and MCP-pairing → `references/authoring-checklist.md`

*Source: [`guides/03_agent-skills.md`](../../../guides/03_agent-skills.md).*
