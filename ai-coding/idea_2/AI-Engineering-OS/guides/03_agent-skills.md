# 03 · Agent Skills — Reusable Expertise

> **A Skill is a folder of procedural knowledge that teaches an agent *how* to do something, loaded only when relevant.** It is the unit of reusable, versionable expertise in the AI Engineering OS — the thing you write once and every future session inherits. Where Agentic Coding ([01](01_agentic-coding.md)) is the workflow and Context Engineering ([02](02_context-engineering.md)) is the substrate, Skills are how an agent compounds: *"Claude on day 30 is better than Claude on day 1."* One-sentence thesis: **don't build a bespoke agent for a repeatable task — build a Skill, because MCP gives an agent *connectivity* while a Skill gives it *expertise*.**

---

## Why this guide exists

Frontier models already know how to code. What they *don't* know is your team's landmines: the RLS policy that must be bypassed a specific way, the migration that has to run before the advisor, the house convention a new hire would trip on. A Skill packages exactly that — the gotchas the model's training data gets wrong — into a folder the agent discovers and loads on demand.

The empirical case is stark. WorkOS's *deleting-95-percent-of-agent-skills* took **10,000 lines** of documentation-derived skills down to **553 lines of pure gotchas** — and accuracy went **from 77% to 97%**. More instruction made the agent *worse*; the win was subtraction. That result is the north star of this guide: **capture gotchas, not coverage.**

---

## Anatomy of a Skill

A Skill is a **folder, not a file** — the single-file form is just the minimum:

```
my-skill/
  SKILL.md            # required: frontmatter + body
  scripts/            # optional: deterministic operations, executed not loaded
  references/         # optional: bulk detail, loaded one level deep on demand
  assets/             # optional: templates, schemas, fixtures
```

It works through **three-level progressive disclosure**, the core economy of the whole mechanism:

| Level | What loads | When |
|---|---|---|
| 1 · Metadata | `name` + `description` (always resident) | Every turn — this is the router |
| 2 · Body | The SKILL.md body (≤500 lines) | When the skill activates |
| 3 · Resources | `references/*`, `scripts/*` | Only on the branch that needs them |

The rule that makes it safe: **progressive disclosure is a budget, not a guarantee.** Agents reliably skip reference files, so anything load-bearing (a safety rule, an always-needed step) stays in the *body*; only genuinely optional bulk goes to `references/`.

---

## The annotated SKILL.md skeleton

This is the single most valuable artifact in this guide — copy it and delete what you don't need:

```markdown
---
name: processing-pdfs            # gerund preferred; ≤64 chars; a–z 0–9 - only;
                                 #   never contains "claude" or "anthropic"
description: >-                  # THIRD PERSON; ≤1024 chars; states WHAT + WHEN + trigger terms
  Extracts text and tables from PDFs, fills forms, and merges documents.
  Use when the user mentions PDFs, forms, or document extraction.
---

# Processing PDFs

<!-- BODY ≤500 lines. Write ONLY what the model doesn't already know. -->

## ⚠️ Must-not-miss rules (stay in the BODY — agents skip reference files)
- <the one landmine the model's prior gets wrong; the reason it's here, not in references/>

## Workflow (do in THIS order)
1. ...   2. ...   3. ...          # opinionated sequence; a checklist for fragile flows

## Evidence (deterministic facts, auto-injected)
!`git log --oneline -10`          # Claude Code: backtick-command injection = real data, not guesses

## Deeper material (progressive disclosure — ONE level deep)
- Advanced tables → references/advanced-tables.md   # loaded only on that branch
```

Frontmatter rules that bite if ignored: the **`description` must be third person** ("Processes Excel files…", never "I can help…" — a first-person POV breaks discovery); reference any nested file **one level deep** (Claude only `head -100`-previews them); and give reference files over 100 lines a table of contents.

---

## Principles in plain English

- **A Skill is a folder, not a file** — versioned in git, portable across Claude/Codex/Cursor.
- **The description is a router, not documentation** — third person, *what* + *when* + trigger terms. Verify it by asking the model "when would you load this?"
- **Decide the trigger deliberately** — model-invoked pays a context-load + firing-unpredictability cost; user-invoked (`disable-model-invocation: true`) pays a human-cognitive cost; a third state hides a skill from the menu but keeps it model-loadable for background knowledge.
- **Guidance beats context; capture gotchas, not coverage** — the model can already code; document only where its prior is wrong.
- **Constraints beat prescription** — close the bad paths and leave room for competence; over-prescribing a capable model regressed accuracy ~30%.
- **Deterministic → script; judgment → prose** — scripts give consistency and token savings; prose handles the parts that need a brain.
- **Measure, don't assume** — a plausible skill can be net-*negative* and invisible without an eval; delete any skill that scores below the no-skill baseline.
- **Enforce must-happen steps with non-fakeable evidence, not sterner prompts** — agents will claim success they didn't earn.
- **Skills are maintained software** — mine transcripts, write corrections back, treat as continuous learning.

---

## Step-by-step: building a Skill that works

### 1. Write the description first — and test it as a router
Third person, `what` + `when`, with the concrete words users actually type. Then ask a fresh model: *"Given this description, when would you load this skill?"* If the answer is fuzzy or over-broad, the description is wrong — fix it before writing a line of the body.

### 2. Set the degrees of freedom to match the task ("robot on a path")
- **Narrow bridge** (fragile, must-sequence, one right way) → low freedom: an exact script or a strict numbered checklist.
- **Open field** (many valid approaches) → high freedom: prose principles and constraints.
Match the leash to the terrain; a rigid script on an open-field task wastes the model's competence, and loose prose on a narrow bridge invites a fall.

### 3. Keep the body lean; push bulk down a level
Body ≤500 lines. Use progressive disclosure aggressively — *"if information is needed 20% of the time, put it in a reference file"* — **except** load-bearing content, which stays in the body because agents skip references.

### 4. Push deterministic work into scripts
If an operation is deterministic (parse commits, run a linter, generate a migration), bundle a script and have the agent *execute* it, not re-derive it. "Solve, don't punt": handle errors inside the script; no magic constants. In Claude Code, `` !`cmd` `` injects real command output so the model starts from data, not speculation.

### 5. Develop against evals, not vibes
The evaluation-driven loop (matches Anthropic's official guidance):
1. Run the target tasks **without** the skill; document the failures.
2. Write **≥3 eval scenarios** from those failures.
3. Baseline (no skill).
4. Write the **minimal** instructions that close the gap.
5. Iterate — and **delete any skill that doesn't beat the no-skill baseline.**
Test across **Haiku, Sonnet, and Opus** (a skill tuned for Opus may underspecify for Haiku), and use the **Claude A / Claude B loop**: one model authors the skill, a fresh model uses it, you observe and refine.

### 6. Prune ruthlessly
Run the **no-op deletion test** sentence by sentence: delete a sentence; if behavior doesn't change, it was never load-bearing — cut the whole sentence, don't rewrite it. Hunt the three failure modes: **sediment** (persona/history that accreted), **duplication**, and **no-ops** ("write a thorough, well-reasoned plan" tells the model nothing). Point to one source of truth instead of copying docs that will rot.

### 7. Enforce the un-fakeable steps
For a step that *must* happen (a test actually ran, a screenshot was actually taken), make honesty cheaper than faking. WorkOS's evidence gate SHA-256-hashes the *real* piped test output into `.case/<task>/tested`; a `touch`-ed empty file (zero bytes, no hash) can't satisfy the gate. Generalizes to Playwright videos, build logs, screenshots.

### 8. Pair a Skill with MCP; never add tools to fix a guidance gap
MCP gives reach (a database, an API); the Skill gives judgment (how to use it safely). In the Supabase demo, **MCP + skill beat every other condition on every model** in a real 6×4×3 eval. If the agent has the tool but keeps misusing it, the fix is a skill, not another tool.

---

## Templates & examples to lift

- **The before/after `plan-feature` diptych** (*building-great-agent-skills*): the `before` violates every rule (kitchen-sink description, always-inlined template, prose instead of a leading word, a no-op "write a thorough plan"); the `after` splits into `clarify-feature` + `plan-feature`, both **≤20 lines**, with a leading word ("vertical slice"), a context pointer to a reference template used only on the new-feature branch, and a concrete completion criterion.
- **`release-notes/`** (*don't-build-agents-build-skills*): textbook scripts-as-tools — `scripts/collect_commits.py` does deterministic git→JSON; prose does the judgment; `references/style.md` loads only at writing time; a "Maintaining this skill" section writes corrections back (continuous learning at minimum scale).
- **`acme-db/`** (*combine-skills-and-mcp*): a must-not-miss security checklist **in the body** (with an inline comment explaining *why* it's not a reference file), plus `eval.py` + `scenarios.json` that behavior-grade the skill (0.5 for the safety rule, 0.25 for the linter, 0.25 for a clean migration) and prove `mcp_plus_skill = 1.00` vs `mcp_only = 0.00`.
- **`repo-roast/`** (*skills-at-scale*): the best `` !`cmd` `` reference — deterministic git injection with `|| echo none` fallbacks, a tight **Constraints** block ("never be vague; cite `path:line` or git data"), and a confidence-gate (5 dimensions × 0–20, won't proceed below 95).

---

## Common pitfalls

- **The kitchen-sink description.** Vague or over-broad routing means the skill fires at the wrong time or never. Third person, what + when, trigger terms.
- **Documenting coverage, not gotchas.** Re-explaining what the model already knows adds tokens and *lowers* accuracy. Subtract.
- **Trusting reference files with load-bearing content.** Agents skip them. Safety-critical/always-needed rules live in the body.
- **Over-prescription.** A rigid script where judgment is needed handcuffs a capable model (~30% regression).
- **Shipping on vibes.** Without an eval you can't see a net-negative skill. Baseline, then measure.
- **Sediment and no-ops.** Persona cruft and "be thorough" filler are pure cost. Run the deletion test.
- **Adding a tool to fix a guidance gap.** More tools ≠ better behavior; pair a skill.

---

## Modern vs. historical — where to override older advice

| Question | Older take (in the corpus) | Do this instead (mid-2026) |
|---|---|---|
| Reference-file reliability | "If it can be skipped, it will be — put must-not-miss content in the body" | **Both**: load-bearing content in the body; genuinely optional bulk progressively-discloses fine. Treat disclosure as a budget. |
| Pruning method | Manual deletion-test passes | Add **telemetry auto-archival** (skills unused ~90 days) for agent-authored skills at scale; keep the deletion test for hand-authored rigor. |
| Naming | `repo-roast`, `plan-feature` (noun / verb-noun) | Prefer the **gerund** (`processing-pdfs`); noun phrases still acceptable — a soft style default, not a hard rule. |
| Trigger framing | Binary (model-invoked vs. disabled) | Three states — add `user-invocable: false` for background knowledge that's model-loadable but hidden from the menu. |

Everything else — progressive disclosure, description-as-router, evaluation-driven development, scripts-as-tools — the corpus and current Anthropic docs agree on strikingly.

---

## Folder Playbook — habits to apply immediately

1. **Write the description in third person** (what + when + trigger terms), then ask a fresh model "when would you load this?" before trusting it.
2. **Decide the trigger per skill**; set `disable-model-invocation: true` for anything a human should invoke by hand, and add a router skill once you have more than a couple of user-invoked skills.
3. **Keep SKILL.md under 500 lines and references one level deep** — but keep every safety-critical or always-needed rule in the body.
4. **Capture gotchas, not coverage** — document only where the model's prior is wrong; assume it already knows your framework.
5. **Prefer constraints to step-by-step prescription**; reserve exact scripts for fragile, must-sequence operations.
6. **Push deterministic work into scripts** (or `` !`cmd` `` injection) and keep judgment in prose.
7. **Build 3+ evals before writing docs**, baseline without the skill, and **delete any skill that doesn't beat the no-skill baseline.**
8. **Run the deletion test sentence by sentence**; cut no-ops, sediment, and duplication; point to one source of truth.
9. **Gate must-happen steps with un-fakeable artifacts** (hashed output, Playwright video), not sterner prompts.
10. **Pair MCP with a skill**; never add a tool to fix a guidance gap.
11. **Mine your `*.jsonl` transcripts weekly** and turn friction and corrections into the next skill or a `references/` entry.
12. **Test across every model you'll run** (Haiku/Sonnet/Opus) — a skill tuned for the strongest model often underspecifies for the cheapest.

---

*Sources: the `AI_CODING/Agent-Skills` corpus (Pocock; Zhang & Murag/Anthropic; Rodrigues/Supabase; Nisi & Proser/WorkOS) cross-checked against Anthropic's Skill-authoring best-practices and Agent-Skills overview docs, OpenAI's "Testing Agent Skills with Evals," and the 2026 skill-marketplace landscape.*
