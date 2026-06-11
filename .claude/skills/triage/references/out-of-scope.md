# The `.out-of-scope/` knowledge base

`.out-of-scope/` stores persistent records of **rejected enhancement requests**. It serves
two purposes:

1. **Institutional memory** — why a feature was rejected, so the reasoning survives the
   issue being closed.
2. **Deduplication** — when a new request matches a prior rejection, surface the earlier
   decision instead of re-litigating it.

Only **enhancements** rejected as `wontfix` go here — never bugs.

## Directory structure

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

One file per **concept**, not per issue. Multiple issues requesting the same thing are
grouped under one file.

## File format

Write it as a short design note — paragraphs, examples — not a database row.

```markdown
# Dark mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single palette defined in `ThemeConfig`. Supporting
multiple themes would need a theme context across the whole tree, per-component theme-aware
style resolution, and a persistence layer for preferences — a significant architectural
change that doesn't align with the project's focus on content authoring.

## Prior requests

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
```

**Naming:** short kebab-case for the concept (`dark-mode.md`), recognizable from the
directory listing alone.

**The reason must be substantive** — not "we don't want this" but *why*: project scope or
philosophy, a technical constraint, or a strategic decision. Keep it durable; avoid
temporary circumstances ("too busy right now") — those are deferrals, not rejections.

## When to check `.out-of-scope/`

During Phase 2 (gather context), read the files. When evaluating a new request, match by
**concept similarity, not keyword** — "night theme" matches `dark-mode.md`. On a match,
surface it to the maintainer: *"This is similar to `.out-of-scope/dark-mode.md` — we
rejected it before because [reason]. Still feel the same way?"* The maintainer may:

- **Confirm** → append the new issue to the file's "Prior requests" and close it.
- **Reconsider** → delete or update the file; the issue proceeds through normal triage.
- **Disagree** → related but distinct; proceed with normal triage.

## When to write to `.out-of-scope/`

Only when an **enhancement** is rejected `wontfix` (Phase 3). The flow:

1. The maintainer decides the request is out of scope.
2. Check for an existing matching file.
3. Match → append the issue to "Prior requests". No match → create a new file with the
   concept name, the reason, and the first prior request.
4. Post a comment (opening with the AI-during-triage disclaimer) explaining the decision and
   naming the `.out-of-scope/` file.
5. Close with `wontfix`.

If the maintainer later changes their mind, delete the file — old issues stay closed as
historical records; the new request that triggered the reconsideration proceeds through
normal triage.
