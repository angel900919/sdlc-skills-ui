---
name: write-a-skill
description: Authors, reviews, and refactors agent skills (SKILL.md + bundled resources). Use when the user asks to create, audit, fix, or improve a skill, or mentions SKILL.md, frontmatter, or trigger phrases.
---

# Writing Skills

A skill is a folder with a `SKILL.md` that teaches Claude a repeatable workflow. The frontmatter description is **always in context** (unless `disable-model-invocation: true`); the body is loaded **only when the skill activates**; bundled files are loaded **only when referenced**. Optimize for this three-level disclosure.

## Workflow

Copy this checklist into your response and check items off as you go.

```
Skill build progress:
- [ ] Step 1: Identify 2-3 concrete use cases (do NOT skip — this is the spec)
- [ ] Step 2: Decide category and choose folder name (kebab-case)
- [ ] Step 3: Draft the description first (it gates discovery)
- [ ] Step 4: Write SKILL.md body (under 500 lines)
- [ ] Step 5: Decide if scripts or reference files are needed
- [ ] Step 6: Run the trigger test (does the description fire on real phrasings?)
- [ ] Step 7: Validate frontmatter (run scripts/validate_frontmatter.py — mechanical gate)
- [ ] Step 8: Run the quality checklist
```

### Step 1: Identify use cases (do this before writing anything)

Ask the user for 2-3 concrete use cases in this format:

```
Use Case: <name>
Trigger: User says "<actual phrasing they would use>"
Steps:
  1. <action>
  2. <action>
Result: <observable outcome>
```

If the user can't supply concrete phrasings, the skill is not ready to write. Push back and collect them.

Also confirm a skill is warranted. Don't create one for: one-off tasks, standard practices already well-documented elsewhere, project-specific conventions (those belong in CLAUDE.md), or rules enforceable with a script or linter — automate those and save skills for judgment calls.

### Step 2: Pick a category

Match the skill to one of three categories — each implies a different structure:

| Category | Use for | Key techniques |
| :--- | :--- | :--- |
| **Document/asset creation** | Consistent high-quality output (docs, slides, code) | Style guides, templates, quality checklists |
| **Workflow automation** | Multi-step processes with consistent methodology | Sequential steps, validation gates, refinement loops |
| **MCP enhancement** | Workflow guidance on top of an MCP server | Multi-call coordination, embedded domain expertise, error handling |

Folder-name conventions: lowercase kebab-case, verb-based names preferred (`processing-pdfs`, `write-a-skill`); avoid vague names (`helper`, `utils`, `docs`).

### Step 3: Draft the description (most important step)

The description (plus `when_to_use`, if set) is **all** Claude sees when deciding whether to load the skill. Get this wrong and nothing else matters. See [Description formula](#description-formula) below.

### Step 4: Write SKILL.md

Choose the body structure (see [Choose your body structure](#choose-your-body-structure)), then use the matching template. Keep the body **under 500 lines** — move anything longer into `references/`. Match degrees of freedom to task fragility (see [reference.md](reference.md#set-appropriate-degrees-of-freedom)).

### Step 5: Decide what to bundle

```
Add a script when:        — operation is deterministic (validation, format conversion)
                          — same code would be regenerated each time
                          — errors need explicit, helpful handling

Add a references/*.md when: — content exceeds 500 lines in SKILL.md
                          — content is domain-specific and loaded selectively
                          — content is rarely needed (advanced features, edge cases)

Add an asset when:        — templates, fonts, icons, or sample outputs are needed
```

### Step 6: Trigger test

Before declaring done, simulate the discovery decision: read just the description and ask "would this fire on the user's real phrasings?" Then test 3 paraphrases + 1 unrelated query that should NOT trigger. If overtriggering, set `disable-model-invocation: true` when the skill should only run via `/skill-name`, or add negative triggers ("Do NOT use for ..."). If undertriggering, add the keywords users actually say.

The trigger test verifies *discovery*; it does not verify *compliance*. If the skill enforces a rule Claude has an incentive to bypass (a discipline skill — "always validate first", "never commit without tests"), also pressure-test it with subagents: see [reference.md](reference.md#pressure-testing-discipline-skills).

### Step 7: Validate frontmatter

Run the mechanical gate before the quality checklist:

```bash
python ${CLAUDE_SKILL_DIR}/scripts/validate_frontmatter.py path/to/SKILL.md
```

The CLAUDE_SKILL_DIR variable in that command expands to this skill's directory at invocation time, so it works regardless of the current working directory.

It hard-fails (`FAIL`, exit 1) on the blocking rules — length, angle brackets, reserved words, malformed name, empty fields — and warns (`WARN`) on heuristics: non-third-person phrasing, a missing trigger clause, unrecognized frontmatter keys (typo catch), or `description` + `when_to_use` exceeding the 1,536-char listing cap. Fix every `FAIL` before continuing. These are the same rules the Skills runtime enforces at load time, so catching them here prevents shipping a skill that silently won't load. The blocking rules are too easy to miss by eye — especially the 1024-char count — so do not rely on prose alone.

---

## Description formula

```
[What it does in third person] + [Key capabilities/file types] + [Use when <specific triggers in user's words>]
```

**Rules** (these are blocking, not stylistic):

- Max 1024 characters
- Third person only — never "I can help" / "you can use"
- No XML angle brackets (`<` `>`) anywhere in frontmatter — security restriction
- No "claude" or "anthropic" in the skill name — reserved
- Must include both WHAT and WHEN — descriptions without triggers don't fire
- WHAT means the outcome, **never the internal step-by-step workflow**. A description that summarizes the process becomes a shortcut: Claude follows the summary and skips the body (observed failure: "review between tasks" in a description made Claude do one review when the body required two)
- Cover the words users actually type: error messages, symptoms ("flaky", "hanging"), file types, tool names, and synonyms — not just polished phrasings
- Put the key use case in the **first sentence** — skill listings truncate the combined `description` + `when_to_use` text at 1,536 characters, and sessions with many skills shorten descriptions further to fit a context budget

Enforce the bracket, length, reserved-word, and name-format rules mechanically with `scripts/validate_frontmatter.py` (see [Step 7](#step-7-validate-frontmatter)) — prose alone is easy to miss.

**Good** (specific, has triggers, names file types):
```yaml
description: Extracts text and tables from PDFs, fills forms, merges documents. Use when working with .pdf files or when the user mentions PDFs, forms, document extraction, or signature fields.
```

**Bad** (vague, no triggers, first person):
```yaml
description: I can help with documents.
```

**Add negative triggers when overtriggering**:
```yaml
description: Advanced statistical analysis for CSV files (regression, clustering). Use when the user asks for statistical modeling. Do NOT use for simple data exploration — use the data-viz skill instead.
```

---

## Claude Code frontmatter (beyond name + description)

`name` and `description` are the portable core (the agentskills.io open standard). Claude Code reads additional optional fields — use them instead of prose workarounds:

| Field | Use it for |
| :--- | :--- |
| `disable-model-invocation: true` | Side-effect workflows the user must trigger manually (`/deploy`, `/commit`). Removes the skill from Claude's listing entirely — the strongest fix for overtriggering. |
| `user-invocable: false` | Background knowledge that is not a meaningful `/` command (e.g. legacy-system context). |
| `when_to_use` | Extra trigger context appended to the description in the listing (shares the 1,536-char cap). |
| `argument-hint` | Autocomplete hint for expected arguments, e.g. `[issue-number]`. |
| `arguments` | Named positional arguments usable as placeholders in the body. |
| `allowed-tools` | Tools pre-approved (no permission prompt) while the skill is active, e.g. `Bash(git add *)`. |
| `disallowed-tools` | Tools removed from Claude's pool while the skill is active. |
| `context: fork` + `agent` | Run the skill body as the prompt of an isolated subagent (`Explore`, `Plan`, or custom). Only for bodies that are explicit tasks — reference material forked into a subagent returns nothing useful. |
| `model` / `effort` | Override the model or effort level for the turn the skill runs. |
| `paths` | Glob patterns; the skill auto-loads only when matching files are being worked on. |
| `hooks` | Hooks scoped to the skill's lifecycle. |

Authoring implications:

- **Skills are slash commands.** The directory name becomes `/skill-name`; the frontmatter `name` is only a display label. Claude Code treats `name` as optional, but keep it — the API and the agentskills.io standard require it, and the validator enforces it for portability.
- **Invocation matrix**: default = both user and Claude can invoke. `disable-model-invocation: true` = user only (description never enters context). `user-invocable: false` = Claude only (hidden from the `/` menu).
- **String substitutions and dynamic context injection** (ARGUMENTS placeholders, CLAUDE_SKILL_DIR, shell-command preprocessing) are documented with literal syntax in [reference.md](reference.md#string-substitutions-and-dynamic-context) — the syntax is kept out of this file because placeholders in a SKILL.md body are expanded when the skill is invoked.
- **Content lifecycle**: an invoked skill's body stays in context for the rest of the session and is only partially re-attached after compaction (first ~5,000 tokens, shared budget across skills). Front-load critical instructions and write standing guidance, not one-time steps.

---

## Choose your body structure

Skills can structure their body two ways. Both are valid — pick by **skill type**, not personal taste. XML is forbidden in **frontmatter** (security), but **fully allowed in the body** and Claude weights XML-tagged content strongly.

| Use **Markdown** structure when... | Use **XML** structure when... |
| :--- | :--- |
| Skill is reference/documentation (lookup, glossary, schema) | Skill is directive — tells Claude how to *behave* |
| Skill is long with bundled `references/` files | Skill is short-to-medium, no deep nesting needed |
| Many headers and progressive disclosure are useful | You want to scope distinct content *kinds* (directive vs context) |
| Examples: PDF processing, BigQuery schemas, style guides | Examples: interview workflows, code review, agent personas |

**The key XML benefit**: tags scope content *kinds*, not just sections. `<what-to-do>` reads as a directive mode; `<supporting-info>` reads as reference material to consult. Markdown headers can't convey that distinction as strongly.

Hybrid is fine: a Markdown-structured skill can embed XML tags for specific blocks (e.g., a `<critical>` block at the top).

---

## SKILL.md template — Markdown structure

Use for reference/documentation skills and long skills with `references/` files.

````markdown
---
name: my-skill
description: ONE_SENTENCE_WHAT plus ONE_SENTENCE_WHEN with trigger phrases — replace this text; no angle brackets in frontmatter
---

# My Skill

<One-line statement of what this skill enables.>

## Quick start

<Minimum viable invocation — the simplest case, runnable / actionable as-is.>

## Workflow

Copy this checklist:

```
Progress:
- [ ] Step 1: <action>
- [ ] Step 2: <action>
- [ ] Step 3: <action>
```

**Step 1: <action>**
<Specific, actionable instruction. Invoke bundled scripts via the CLAUDE_SKILL_DIR variable so they resolve from any working directory — literal syntax in reference.md.>

**Step 2: <action>**
<...>

## Common errors

### <Symptom>
**Cause**: <root cause>
**Fix**: <exact remedy>

## Advanced

**<Topic>**: See [references/<topic>.md](references/<topic>.md)
````

---

## SKILL.md template — XML structure

Use for directive/agentic skills where Claude needs to act in a specific mode. The two-block split (`<what-to-do>` for the directive, `<supporting-info>` for context) is the canonical pattern.

````markdown
---
name: my-skill
description: ONE_SENTENCE_WHAT plus ONE_SENTENCE_WHEN with trigger phrases — replace this text; no angle brackets in frontmatter
---

<what-to-do>

<The directive — what Claude should do, in imperative voice. Treat this block as the "system prompt" for the skill's mode of operation. Keep it tight; this is the part that drives behavior.>

<If the workflow has steps, list them here. Use "ask one question at a time" / "explore the codebase first" / "do X before Y" style instructions.>

</what-to-do>

<supporting-info>

## <Topic 1>

<Reference material Claude consults *while* executing the directive. Glossary, file layout, decision criteria, formats, escalation rules.>

## <Topic 2>

<More context. Subsections with `##` headers are fine inside the XML block.>

### Cross-references

For <specific topic>, see [references/<topic>.md](references/<topic>.md).

</supporting-info>
````

**Why this works**: Claude reads `<what-to-do>` as "this is my job" and `<supporting-info>` as "this is what to draw from while doing the job." That mode-switching is harder to convey with markdown headers alone.

---

## File layout

```
my-skill/
├── SKILL.md              # required — main instructions, under 500 lines
├── scripts/              # optional — executable utilities (Claude runs these)
│   └── validate.py
├── references/           # optional — documentation loaded on demand
│   └── advanced.md
└── assets/               # optional — templates, fonts, sample files
    └── template.docx
```

**Naming rules** (blocking):

- Folder: lowercase kebab-case (`pdf-processing` ✓, `PDF_Processing` ✗)
- Main file: exactly `SKILL.md` (case-sensitive — `skill.md` will not be found)
- No `README.md` inside the skill folder — confuses discovery
- Forward slashes in all paths (works on Unix and Windows; backslashes break on Unix)
- All `references/` links must be **one level deep from SKILL.md**. Nested references (SKILL.md → A.md → B.md) cause partial reads.

---

## The 5 skill patterns

Pick the pattern that matches your use case. For body-level patterns (output templates, input/output examples, conditional workflows, feedback loops), see [reference.md](reference.md#common-body-patterns).

| Pattern | Use when | Structure cue |
| :--- | :--- | :--- |
| **1. Sequential workflow** | Multi-step process in a fixed order | `### Step 1 / 2 / 3` with explicit dependencies |
| **2. Multi-MCP coordination** | Workflow spans services (Figma → Drive → Linear → Slack) | `### Phase 1 / 2 / 3` with data passing between phases |
| **3. Iterative refinement** | Quality improves via validate → fix → repeat | "Refinement loop" section with explicit stop criterion |
| **4. Context-aware selection** | Same outcome, different tool depending on input | Decision tree at the top, execution block underneath |
| **5. Domain-specific intelligence** | Skill adds expertise beyond raw tool access | Compliance/rules block runs *before* action block |

---

## Common pitfalls

| Pitfall | Symptom | Fix |
| :--- | :--- | :--- |
| Vague description | Skill never auto-loads | Add trigger phrases and file types users actually mention |
| Workflow summary in description | Claude follows the description's shortcut and skips the body | Describe outcome + triggers; keep the step-by-step process in the body only |
| Narrative storytelling | "In the session on X we found..." — too specific to reuse | Extract the general technique; drop the story |
| Rationale preamble | Body opens with "Closes the gap between /X and /Y…" — explains *why the skill exists*, not how to run it | Cut it; the description already states what + when. Open the body with the directive. |
| Redundant `<supporting-info>` tail | Trailing "Position in the SDLC", "What this skill refuses to do", "Tier matrix", "Related skills" that restate the description's Do-NOT list, the critical rules, and the verdict routing | `<supporting-info>` is for reference Claude *consults while acting* (schema pointers, disambiguation tables) — not a recap. Cut anything that re-states `<what-to-do>` or the routing tokens. |
| Overtriggering | Skill loads for unrelated queries | Set `disable-model-invocation: true` for manual-only workflows; otherwise add a `Do NOT use for ...` clause |
| Instructions buried | Skill loads but Claude ignores rules | Put critical instructions at the top with `## Critical` header |
| Ambiguous language | Inconsistent outputs | Replace "make sure to validate" with explicit `CRITICAL: Before X, verify Y, Z, W` |
| Voodoo constants in scripts | Hard to debug | Document why each constant exists (Ousterhout's law) |
| Time-sensitive info | Rots in months | Move legacy guidance into a collapsed "Old patterns" section |
| Inconsistent terminology | Claude follows the wrong path | Pick one term per concept and use it everywhere |
| Too many options | Decision paralysis | Provide one default + one escape hatch, not five alternatives |
| `<` `>` in frontmatter | Skill won't load | Strip XML brackets from frontmatter only — security restriction. XML is allowed in the body. |
| Markdown structure on directive skill | Claude follows steps but loses "mode" framing | Switch to XML body structure with `<what-to-do>` / `<supporting-info>` blocks |
| Nested references | Claude only reads a head-100 preview | Flatten: all references link from SKILL.md directly |

---

## Quality checklist (run before declaring done)

```
Discovery:
- [ ] Description is in third person, under 1024 chars, includes WHAT + WHEN
- [ ] Description does not summarize the body's step-by-step workflow
- [ ] Key use case appears in the first sentence of the description
- [ ] Description includes trigger phrases users would actually say
- [ ] Side-effect workflows set disable-model-invocation: true
- [ ] Description names relevant file types if applicable
- [ ] No XML angle brackets anywhere in frontmatter
- [ ] Name does not contain "claude" or "anthropic"
- [ ] scripts/validate_frontmatter.py passes (no FAIL lines)

Structure:
- [ ] Folder name is kebab-case
- [ ] Main file is exactly SKILL.md (case-sensitive)
- [ ] No README.md inside the skill folder
- [ ] SKILL.md body is under 500 lines
- [ ] All references are one level deep from SKILL.md
- [ ] All paths use forward slashes
- [ ] Body structure (Markdown vs XML) matches the skill type (reference vs directive)

Content:
- [ ] Examples are concrete and runnable, not abstract
- [ ] No time-sensitive language ("after August 2025")
- [ ] Consistent terminology throughout
- [ ] Critical instructions appear at the top, not buried
- [ ] Scripts handle errors instead of punting to Claude
- [ ] Magic numbers/constants are justified with a comment

Testing:
- [ ] Triggers on 2-3 paraphrased real-user requests
- [ ] Does NOT trigger on a similar-but-unrelated request
- [ ] Functional output verified for at least one use case
- [ ] Discipline skills only: pressure-tested with subagents (reference.md)
```

---

## Iterating on existing skills

When a user asks to **improve** or **fix** an existing skill rather than create one:

1. Read the current SKILL.md and any bundled files.
2. Ask the user for one concrete failure: "When did this skill fail to do what you wanted? Quote the prompt and what happened."
3. Diagnose against the [Common pitfalls](#common-pitfalls) table.
4. Make the minimum change that addresses the failure — do not rewrite working sections.
5. Re-run the trigger test and quality checklist.

If the user reports **undertriggering**, fix the description first — and have them run `/doctor`: with many skills installed, the listing budget truncates descriptions and can strip the trigger keywords. If they report **overtriggering**, set `disable-model-invocation: true` when the skill should be manual-only, otherwise add negative triggers. If they report **wrong output despite loading correctly**, the body needs sharper instructions (more specific verbs, critical block at top, less ambiguous language).

---

## Deeper guidance

For degrees of freedom, string substitution and dynamic context injection syntax, evaluation-driven development, pressure-testing discipline skills, multi-model testing, executable scripts, MCP tool references, and the verbatim Anthropic checklist, see [reference.md](reference.md).
