# Writing agent briefs

When a non-chain issue moves to `ready-for-agent` (or `ready-for-human`), it needs a
**durable, behavioral specification** an executor can work from — the original issue body
and discussion are context; the brief is the contract. This is the part chain tickets get
for free (the canonical `SLICE-N.md` body *is* their brief); a loose issue does not, so
triage writes one.

The brief is **also the body of the routed task** — drop it into the free-form
`tasks/<slug>.md` (bare repo) or the `/to-issues` slice (chain repo) described in
`SKILL.md § Routing into the build path`. A confirmed bug repro becomes **acceptance
criterion #1** there, the same convention `/diagnose` uses.

## Principles

### Durability over precision

The issue may sit in `ready-for-agent` for days; the codebase will move under it. Write so
the brief stays useful as files are renamed or refactored.

- **Do** describe interfaces, types, and behavioral contracts.
- **Do** name specific types, function signatures, or config shapes to look for or change.
- **Don't** reference file paths or line numbers — they go stale.
- **Don't** assume the current implementation structure survives.

### Behavioral, not procedural

Describe **what** the system should do, not **how** to implement it. The agent explores the
codebase fresh and makes its own implementation calls.

- **Good:** "When a user runs `/triage` with no arguments, they should see a summary of
  issues needing attention."
- **Bad:** "Add a switch statement in the main handler function."

### Complete, testable acceptance criteria

The agent needs to know when it's done. Every brief carries concrete, independently
verifiable criteria. For a bug, the **reproduction is criterion #1** — the agent lands it
as the opening failing test that proves the bug.

- **Good:** "Running `bd list --label needs-triage` returns only issues past initial
  classification."
- **Bad:** "Triage should work correctly."

### Explicit scope boundaries

State what is out of scope, so the agent doesn't gold-plate or touch adjacent features.

## Template

```markdown
## Agent brief

**Category:** bug | enhancement
**Summary:** one-line description of what needs to happen

**Current behavior:**
What happens now. For a bug, the broken behavior (with the repro if confirmed).
For an enhancement, the status quo the feature builds on.

**Desired behavior:**
What should happen when the work is complete. Be specific about edge cases and errors.

**Key interfaces:**
- `TypeName` — what needs to change and why
- `functionName()` return type — what it returns now vs. what it should
- Config shape — any new options

**Acceptance criteria:**
- [ ] For a bug: the reproduction now passes (criterion #1)
- [ ] Specific, testable criterion 2
- [ ] Specific, testable criterion 3

**Out of scope:**
- Thing that should NOT change in this issue
- Adjacent feature that seems related but is separate
```

## A good brief (bug)

```markdown
## Agent brief

**Category:** bug
**Summary:** Skill description truncation drops mid-word, producing broken output

**Current behavior:**
When a skill description exceeds 1024 characters it is cut at exactly 1024 regardless of
word boundaries, ending mid-word (e.g. "Use when the user wants to confi"). Repro: feed a
1100-char description through the frontmatter loader; observe the mid-word cut.

**Desired behavior:**
Truncation breaks at the last word boundary before 1024 chars and appends "..." — total
length including "..." stays within 1024.

**Key interfaces:**
- The metadata `description` field — no type change; the validation/processing logic that
  populates it must respect word boundaries.

**Acceptance criteria:**
- [ ] The 1100-char repro is truncated at a word boundary and ends with "..." (criterion #1)
- [ ] Descriptions under 1024 chars are unchanged
- [ ] Total length including "..." never exceeds 1024

**Out of scope:**
- Changing the 1024-char limit itself
- Multi-line description support
```

## A bad brief

```markdown
## Agent brief
**Summary:** Fix the triage bug
**What to do:** The triage thing is broken. Look at the main file around line 150 and fix it.
**Files to change:** src/triage/handler.ts (line 150)
```

Bad because: no category, vague description, references paths and line numbers that go
stale, no acceptance criteria, no scope boundaries, no current-vs-desired contrast.
