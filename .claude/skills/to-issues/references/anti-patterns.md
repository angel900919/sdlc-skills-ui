# /to-issues anti-patterns

Patterns to reject. Scan before writing files (Phase 6) and before the verdict.

| Anti-pattern | Symptom | Fix |
|---|---|---|
| Re-authoring plan content | Issue acceptance differs from `plan.md`'s slice | Faithful transformer. If the plan is wrong, fix `/plan` first; never drift here. |
| AFK on auth / PII / payment | A slice touching Stripe marked `type: afk` | HITL. Money / PII / auth fired the PRD's tier uplift for a reason; name the rule in `hitl_reason`. |
| Skip-tests on branching logic | A slice with `if/else` marked `tests: skip-tests` | Default to full TDD. `skip-tests` is for one-liners with no branching only. |
| Renumbering on update | Old Slice 3 became new Slice 2 after Slice 2 was dropped | Stable numbering. Mark the dropped one `status: removed`. PRs referencing "Slice 4" don't break. |
| Inline file paths in prose | "Edit `src/foo/bar.ts` to add…" in the body | Paths live in `files` frontmatter. Prose goes stale; structured data round-trips. |
| Publishing inside this skill | Tracker SDK / `bd` / `gh` calls here | This skill writes files only. Publishing is `/publish-issues`. |
| Issue without traceability | `satisfies_*` all empty at mvp+ | The plan is broken — bounce. No untraceable work ships. |
| Issue file over cap | A multi-page issue body | The slice is too big. Bounce to `/plan` to split. Don't summarize-to-fit. |
| Tracker fields in canonical frontmatter | `jira_epic:`, `bd_label:`, `assignee:`, `sprint:` | Tracker concerns live only in `backend_refs`, written by adapters. The schema stays tracker-agnostic. |
| Missing `language` | Slice frontmatter has no `language:` | Required. If unsure, copy anchor's `language:` (the documented default). Without it a downstream run can pick the wrong toolchain. |
| Mixed-extension slice, one language | `files: [..foo.ts, ..bar.py]`, `language: typescript` | Smell — the slice does two things. Bounce to `/plan` to split. |
| Deleting `status: removed` files | Tidy-up impulse | Keep them — the adapter needs `backend_refs` to close upstream tickets idempotently. |
| Overwriting `backend_refs` on update | `beads: null` after re-running on an already-published feature | Update mode preserves `backend_refs` verbatim. |
| Inventing an HITL reason | `hitl_reason: "looks risky"` | Name the firing AFK-eligibility rule verbatim — not a vibe. |
| Writing a `.human` mirror | A `.human/specs/<feature>/issues/…` file or a diagram | No mirror. The human view of issues is the Jira/md projection `/publish-issues` writes. |
