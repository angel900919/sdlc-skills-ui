# Skill authoring — deeper guidance

Reference material for the write-a-skill skill. SKILL.md covers the workflow, description formula, frontmatter fields, structure rules, and pitfalls. This file holds only the deltas — read the section you need:

## Contents

- [Concise is key](#concise-is-key)
- [Set appropriate degrees of freedom](#set-appropriate-degrees-of-freedom)
- [String substitutions and dynamic context](#string-substitutions-and-dynamic-context)
- [Test with all models you plan to use](#test-with-all-models-you-plan-to-use)
- [Structure longer reference files with a table of contents](#structure-longer-reference-files-with-a-table-of-contents)
- [Common body patterns](#common-body-patterns)
- [Evaluation-driven development](#evaluation-driven-development)
- [Pressure-testing discipline skills](#pressure-testing-discipline-skills)
- [Develop skills iteratively with Claude](#develop-skills-iteratively-with-claude)
- [Observe how Claude navigates skills](#observe-how-claude-navigates-skills)
- [Executable scripts: solve, don't punt](#executable-scripts-solve-dont-punt)
- [Provide utility scripts](#provide-utility-scripts)
- [Use visual analysis](#use-visual-analysis)
- [Create verifiable intermediate outputs](#create-verifiable-intermediate-outputs)
- [Package dependencies](#package-dependencies)
- [MCP tool references](#mcp-tool-references)
- [Anthropic checklist (verbatim)](#anthropic-checklist-verbatim)

---

## Concise is key

The context window is a public good. Once a skill loads, every token competes with conversation history and other context — and an invoked skill's body stays in context for the rest of the session.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information:

- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

A concise instruction ("Use pdfplumber for text extraction" + a 4-line snippet) beats a paragraph explaining what PDFs are, why libraries exist, and how pip works.

---

## Set appropriate degrees of freedom

Match the level of specificity to the task's fragility and variability.

**High freedom** (text-based instructions) — use when multiple approaches are valid, decisions depend on context, heuristics guide the approach:

```markdown
## Code review process

1. Analyze the code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability and maintainability
4. Verify adherence to project conventions
```

**Medium freedom** (pseudocode or scripts with parameters) — use when a preferred pattern exists, some variation is acceptable, configuration affects behavior:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data
    # Generate output in specified format
    # Optionally include visualizations
```

**Low freedom** (specific scripts, few or no parameters) — use when operations are fragile and error-prone, consistency is critical, a specific sequence must be followed:

```markdown
## Database migration

Run exactly this script:
python scripts/migrate.py --verify --backup

Do not modify the command or add additional flags.
```

**Analogy:** Think of Claude as a robot exploring a path. A narrow bridge with cliffs on both sides has only one safe way forward — provide exact instructions (low freedom). An open field with no hazards has many paths to success — give general direction and trust Claude to find the route (high freedom).

---

## String substitutions and dynamic context

The literal syntax lives here rather than in SKILL.md because placeholders in a SKILL.md body are **expanded when the skill is invoked** — documenting them there would mangle the skill.

### Substitution placeholders

| Placeholder | Expands to |
| :--- | :--- |
| `$ARGUMENTS` | All arguments passed when invoking the skill. If absent from the body, arguments are appended as `ARGUMENTS: <value>`. |
| `$ARGUMENTS[N]` | A specific argument by 0-based index. |
| `$N` | Shorthand for `$ARGUMENTS[N]` — `$0` is the first argument. |
| `$name` | Named argument declared in the `arguments` frontmatter list; names map to positions in order. |
| `${CLAUDE_SKILL_DIR}` | The directory containing the skill's SKILL.md. Use in commands that run bundled scripts so they resolve from any working directory: `python ${CLAUDE_SKILL_DIR}/scripts/validate.py`. |
| `${CLAUDE_SESSION_ID}` | The current session ID — useful for logs and session-specific files. |
| `${CLAUDE_EFFORT}` | The active effort level (`low` … `max`). |

Indexed arguments use shell-style quoting: `/my-skill "hello world" second` makes `$0` expand to `hello world` and `$1` to `second`.

### Dynamic context injection

The `` !`<command>` `` syntax runs a shell command **before** the skill content is sent to Claude; the output replaces the placeholder, so Claude receives actual data, not the command:

```markdown
## Current changes

!`git diff HEAD`
```

Rules:

- This is preprocessing — Claude only sees the final rendered result.
- Substitution runs **once** over the original file; emitted output is not re-scanned.
- The inline form is only recognized when `!` is at the start of a line or immediately after whitespace.
- For multi-line commands, use a fenced code block opened with ` ```! `.
- The `shell` frontmatter field selects `bash` (default) or `powershell` for these commands.
- Admins can disable this with the `disableSkillShellExecution` setting; each command is then replaced with a policy notice instead of running.

---

## Test with all models you plan to use

Skills act as additions to models, so effectiveness depends on the underlying model:

- **Claude Haiku** (fast, economical): Does the skill provide enough guidance?
- **Claude Sonnet** (balanced): Is the skill clear and efficient?
- **Claude Opus** (powerful reasoning): Does the skill avoid over-explaining?

What works perfectly for Opus might need more detail for Haiku. If a skill targets multiple models, aim for instructions that work well with all of them.

---

## Structure longer reference files with a table of contents

For reference files longer than 100 lines, include a table of contents at the top. Claude may preview long files with partial reads (`head -100`); a TOC ensures the full scope of available information is visible even then.

---

## Common body patterns

### Template pattern

Provide templates for output format, matching strictness to need:

- **Strict** (API responses, data formats): "ALWAYS use this exact template structure" + the full template.
- **Flexible**: "Here is a sensible default format, but use your best judgment" + a skeleton with `[adapt as needed]` slots.

### Examples pattern

When output quality depends on style, provide 2-3 input/output pairs (e.g. commit-message examples showing `type(scope): description` format). Examples convey style and level of detail better than descriptions alone.

### Conditional workflow pattern

Guide Claude through decision points with an explicit branch at the top:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below
```

If branches grow large, push each into its own reference file and tell Claude which to read.

### Feedback-loop pattern

Run validator → fix errors → repeat, with an explicit gate: "Only proceed when validation passes." The validator can be a script or a checklist/style-guide document Claude reads and compares against.

---

## Evaluation-driven development

**Create evaluations BEFORE writing extensive documentation.** This ensures the skill solves real problems rather than documenting imagined ones.

1. **Identify gaps:** Run Claude on representative tasks without a skill. Document specific failures or missing context.
2. **Create evaluations:** Build three scenarios that test these gaps.
3. **Establish baseline:** Measure Claude's performance without the skill.
4. **Write minimal instructions:** Just enough content to address the gaps and pass evaluations.
5. **Iterate:** Execute evaluations, compare against baseline, refine.

Evaluation structure:

```json
{
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF file and save it to output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Reads the PDF using an appropriate library or command-line tool",
    "Extracts text from all pages without missing any",
    "Saves the extracted text to output.txt in a readable format"
  ]
}
```

There is no built-in runner for these — they are a rubric you execute manually or with your own harness. Evaluations are the source of truth for measuring skill effectiveness.

---

## Pressure-testing discipline skills

The trigger test verifies discovery; evaluations verify capability. Neither verifies **compliance** — whether Claude follows a rule when it has an incentive not to. Pressure-test skills that enforce discipline (TDD, "always validate before committing", verification gates): rules with a compliance cost that an agent could rationalize away "just this once". Skip this for pure reference skills — there's nothing to violate.

### Baseline first (watch it fail)

Before writing or editing the rule, run the scenario WITHOUT the skill in a fresh subagent and capture the rationalizations **verbatim** ("I already manually tested it", "tests after achieve the same goals", "deleting is wasteful"). Those exact excuses are the spec for what the skill must counter. A skill written without a baseline addresses what you *think* needs preventing, not what actually does.

### Writing pressure scenarios

Academic prompts ("What does the skill say?") only test recitation. Make the agent *want* to break the rule:

- Force a concrete A/B/C choice — no open-ended outs, no deferring to "I'd ask the user"
- Use real constraints: specific times, real file paths, named consequences
- Frame as real work: "This is a real scenario. Choose and act."
- Combine 3+ pressures — agents resist a single pressure but break under several

| Pressure | Example |
| :--- | :--- |
| Time | Deploy window closing, production down at $10k/min |
| Sunk cost | 3 hours and 200 working lines already written |
| Authority | Senior engineer / manager says skip it |
| Exhaustion | End of day, dinner in 30 minutes |
| Social | Looking dogmatic or inflexible |
| Pragmatism | "Being pragmatic, not dogmatic" |

### Close loopholes

Run the same scenario WITH the skill. Every new rationalization the agent produces gets an explicit counter:

1. **Negate the specific workaround** in the rule — "Delete it" becomes "Delete it. Don't keep it as 'reference'. Don't 'adapt' it while writing tests. Delete means delete."
2. **Add a rationalization-table row** the agent can self-check against: `| "Keep as reference, write tests first" | You'll adapt it. That's testing after. |`
3. **Add a red-flags list entry** — short phrases that mean STOP: `"This case is different because..."`, `"spirit not letter"`
4. **Add about-to-violate symptoms to the description** so the skill fires at the moment of temptation ("Use when tempted to write tests after the code").

Re-test until a full pass produces no new rationalizations. A "spirit vs letter" argument is cut off by stating early: **violating the letter of the rule is violating its spirit.**

### Meta-testing

When an agent reads the skill and still violates it, ask it directly: "How could this skill have been written so the right choice was unambiguous?" Three diagnoses: the skill was clear but ignored (add a foundational principle, strengthen the register), the skill should have said X (add X verbatim), or the agent never saw section Y (move it up — critical rules go at the top).

### Language register

Match persuasion register to skill type (empirically, imperative framing roughly doubles compliance):

- **Discipline skills**: absolute, imperative language — "YOU MUST", "No exceptions". Absolutes remove the "is this an exception?" question that rationalization feeds on. Pair with commitment devices: copy-and-check-off checklists, "announce you are using this skill".
- **Technique/reference skills**: plain clarity. Heavy authority language on a lookup table is noise.
- **Never** use flattery or we're-friends framing to drive compliance — it trains sycophancy, not discipline.

---

## Develop skills iteratively with Claude

Work with one Claude instance ("Claude A") to author the skill, and test it with fresh instances ("Claude B"):

1. **Complete a task without a skill** using normal prompting with Claude A. Notice what context you repeatedly provide.
2. **Ask Claude A to create a skill** capturing that pattern, then **review for conciseness** — strip explanations Claude already knows.
3. **Test with Claude B** (a fresh instance with the skill loaded) on real tasks, not test scenarios.
4. **Bring observations back to Claude A**: "Claude B forgot to filter test accounts on a regional report — the rule is in the skill but maybe not prominent enough?"
5. **Apply, re-test, repeat.** Iterate on observed behavior, not assumptions.

Share skills with teammates and ask: does it activate when expected? Are instructions clear? What's missing?

---

## Observe how Claude navigates skills

Watch for these signals during real usage:

- **Unexpected exploration paths** — the structure isn't as intuitive as you thought.
- **Missed connections** — links to important files need to be more explicit or prominent.
- **Overreliance on one file** — repeatedly-read content probably belongs in SKILL.md itself.
- **Ignored content** — a never-read bundled file is unnecessary or poorly signaled.

---

## Executable scripts: solve, don't punt

Handle error conditions in bundled scripts rather than punting to Claude:

```python
def process_file(path):
    """Process a file, creating it if it doesn't exist."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"File {path} not found, creating default")
        with open(path, "w") as f:
            f.write("")
        return ""
    except PermissionError:
        print(f"Cannot access {path}, using default")
        return ""
```

Justify every constant — no "voodoo constants" (Ousterhout's law). If you don't know the right value, how will Claude determine it?

```python
# HTTP requests typically complete within 30 seconds;
# longer timeout accounts for slow connections
REQUEST_TIMEOUT = 30

# Three retries balances reliability vs speed;
# most intermittent failures resolve by the second retry
MAX_RETRIES = 3
```

---

## Provide utility scripts

Pre-made scripts beat generated code: more reliable, consistent across uses, and they cost no context tokens (only their output does).

**Make execution intent explicit** in instructions:

- **Execute** (most common): "Run `analyze_form.py` to extract fields"
- **Read as reference** (complex logic): "See `analyze_form.py` for the field extraction algorithm"

Document each script with its invocation and output format:

```markdown
**analyze_form.py**: Extract all form fields from PDF

python ${CLAUDE_SKILL_DIR}/scripts/analyze_form.py input.pdf > fields.json
```

---

## Use visual analysis

When inputs can be rendered as images, have Claude analyze them visually: convert PDFs/designs to images with a bundled script, then let Claude identify layout, fields, and structure from the rendered pages.

---

## Create verifiable intermediate outputs

For complex open-ended tasks, use the **plan-validate-execute** pattern: Claude writes a plan in a structured format (e.g. `changes.json`), a script validates the plan, and only then is it executed. The workflow becomes: analyze → create plan file → validate plan → execute → verify.

- **Catches errors early** before changes are applied
- **Machine-verifiable** — scripts provide objective verification
- **Reversible planning** — Claude iterates on the plan without touching originals

**When to use:** batch operations, destructive changes, complex validation rules, high-stakes operations.

**Implementation tip:** make validation errors verbose and specific — "Field 'signature_date' not found. Available fields: customer_name, order_total, signature_date_signed" — so Claude can fix issues without guessing.

---

## Package dependencies

Don't assume packages are installed. List required packages in SKILL.md with the install command ("Install required package: `pip install pypdf`") before showing usage. Note platform limits: claude.ai's code execution can install from npm/PyPI; the Claude API code-execution environment has no network access or runtime installation.

---

## MCP tool references

Always use fully qualified tool names — `ServerName:tool_name` — to avoid "tool not found" errors:

```markdown
Use the BigQuery:bigquery_schema tool to retrieve table schemas.
Use the GitHub:create_issue tool to create issues.
```

Without the server prefix, Claude may fail to locate the tool when multiple MCP servers are available.

---

## Anthropic checklist (verbatim)

Before sharing a skill, verify:

### Core quality
- [ ] Description is specific and includes key terms
- [ ] Description includes both what the Skill does and when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

### Code and scripts
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants" (all values justified)
- [ ] Required packages listed in instructions and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks

### Testing
- [ ] At least three evaluations created
- [ ] Tested with Haiku, Sonnet, and Opus
- [ ] Tested with real usage scenarios
- [ ] Team feedback incorporated (if applicable)
