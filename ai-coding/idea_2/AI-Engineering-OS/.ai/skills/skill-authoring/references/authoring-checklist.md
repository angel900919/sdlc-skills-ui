# Skill authoring & review checklist

## Anatomy — a skill is a folder, not a file
```
my-skill/
  SKILL.md            # required: frontmatter (router) + body (gotchas only)
  scripts/            # optional: deterministic ops, EXECUTED not loaded
  references/         # optional: bulk detail, loaded one level deep on demand
  assets/             # optional: templates, schemas, fixtures
```
Three-level progressive disclosure: **metadata** (name+description, always resident — the router) → **body** (loads on activation, ≤500 lines) → **resources** (load only on the branch that needs them).

## Description — it is a router, not documentation
- Third person ("Extracts…", never "I can help…" — first person breaks discovery).
- States **what** + **when** + the concrete trigger terms users type.
- Verify: ask a fresh model *"given this description, when would you load this skill?"* Fuzzy or over-broad answer ⇒ the description is wrong. Fix it before writing the body. (Automate with `/skill-router-test`.)

## Trigger — decide deliberately (three states)
- **Model-invoked** (default): pays a context-load + firing-unpredictability cost.
- **`disable-model-invocation: true`**: user invokes by hand; pays a human-cognitive cost.
- **`user-invocable: false`**: hidden from the menu but model-loadable — background knowledge.
Add a router skill once you have more than a couple of user-invoked skills.

## Degrees of freedom — match the leash to the terrain
- **Narrow bridge** (fragile, must-sequence, one right way) → low freedom: an exact script or strict numbered checklist.
- **Open field** (many valid approaches) → high freedom: prose principles + constraints. Over-prescribing a capable model regressed accuracy ~30%.

## Content rules
- **Capture gotchas, not coverage** — assume the model knows your framework; document only where its prior is wrong.
- **Constraints beat prescription** — close the bad paths, leave room for competence.
- **Deterministic → script; judgment → prose.** Scripts give consistency + token savings; "solve, don't punt" (handle errors inside, no magic constants).
- **Load-bearing content stays in the body** — references get skipped; disclosure is a budget.

## Evals-first (develop against evals, not vibes)
1. Run the target tasks **without** the skill; document the failures.
2. Write **≥3 eval scenarios** from those failures.
3. Baseline (no skill).
4. Write the **minimal** instructions that close the gap.
5. Iterate — **delete any skill that doesn't beat the no-skill baseline.**
Test across **Haiku / Sonnet / Opus** (a skill tuned for Opus underspecifies for Haiku). Use the Claude A/B loop: one model authors, a fresh model uses, you observe.

## Prune — the sentence-by-sentence deletion test
Delete a sentence; if behavior doesn't change, it was never load-bearing — cut the whole sentence, don't rewrite it. Hunt the three failure modes:
- **sediment** — persona/history that accreted.
- **duplication** — the same rule in two places, or docs copied instead of pointed to.
- **no-ops** — "write a thorough, well-reasoned plan" tells the model nothing.

## Enforce un-fakeable steps
For a step that *must* happen (a test ran, a screenshot was taken), make honesty cheaper than faking: hash the real piped output into an evidence file — a `touch`-ed empty file (zero bytes, no hash) can't satisfy the gate. Generalizes to Playwright videos, build logs, screenshots.

## Pair with MCP; never add a tool to fix a guidance gap
MCP gives reach (a database, an API); the skill gives judgment (how to use it safely). If the agent has the tool but keeps misusing it, the fix is a skill, not another tool.

## Naming (soft defaults)
Prefer the **gerund** (`processing-pdfs`); noun phrases (`repo-roast`) still acceptable. Never put "claude"/"anthropic" in the name.

## Maintain it
Skills are software. Mine your `*.jsonl` transcripts weekly (`/extract-skill`), write corrections back, and auto-archive agent-authored skills unused ~90 days.
