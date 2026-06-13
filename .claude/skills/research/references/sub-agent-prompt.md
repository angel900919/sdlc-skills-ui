# Scan sub-agent prompt skeleton

Base template for spawning the scan sub-agent in Phase 3. Fill the brackets with concrete
values from the loaded inputs (the PRD **Scope** verbatim, the anchor stack, the `placement`
hint from `prd.md` frontmatter). Spawn `subagent_type=general-purpose` — NOT `Explore`:
that agent type cannot write files and compresses its final message to a conclusion, so a
full cited report never reaches the parent (observed live 2026-06-13, /explore dogfood).
The sub-agent scans READ-ONLY and writes its full report to the draft path the parent
names (`/tmp/research-draft-<feature>.md`); its final chat message is just that path +
per-section bullet counts. The parent reads the draft and slots it.

```
You are scouting the codebase for feature `<feature>`. Output a vertical slice of what
ALREADY EXISTS. Do not propose changes or recommend anything.

PRD scope (verbatim): <paste the Scope section from prd.md>
Stack from anchor: <language, framework, db, hosting, auth>
Architectural placement (from prd.md frontmatter `placement:`): <component, e.g. PlaceOrder>

Find and report, with a `path:line` citation on EVERY claim:

  1. Existing files / modules in the placed component or adjacent areas — one-line role each.
  2. Libraries already in package.json / pyproject.toml / go.mod that this feature would
     touch — include versions.
  3. Conventions in adjacent code: naming, error handling, logging shape, testing patterns.
  4. Prior art: similar features already shipped (one line each).
  5. Constraints: lint rules, CI gates, code-style enforcement, conventional-commit policy.

Facts only. No "we should…" lines — those belong to /design.
Use the project's own terms (glossary supplied below); don't invent synonyms.
Glossary: <paste key terms from .ai/context.md, if available>

Cap: <90 / 185 / 250 per the PRD tier> lines total. If you'd exceed it, the scan is too
broad — narrow to the placed component.

End with a section titled "Open questions for design" — ≤5 items. These are answerable HOW
unknowns design must close, NOT new scope.

Report shape: the section order in research/references/template.md.
```

## Search breadth (pass to the Explore agent)
- `quick` — a narrow feature touching one folder.
- `medium` — typical feature (default).
- `very thorough` — only if scope genuinely spans multiple subsystems.

## After the sub-agent returns
The parent verifies (Phase 4): every claim cited; vague stack-level claims rejected; 2–3 cited
lines spot-checked with `Read` (≤3 lookups — parent budget); any "we should…" stripped to
Open questions or dropped.
