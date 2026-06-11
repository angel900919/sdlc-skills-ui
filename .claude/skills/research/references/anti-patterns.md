# /research anti-patterns

Patterns to reject. Scanned at Phase 6 (read back) — strip any rejection-class symptom before
writing.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Decisions in research | "We should use Redis here" | Move to `/design`. Research is facts only. |
| Uncited claims | "The codebase uses X" with no `file:line` | Force `path/to/file.ts:L42`. Without provenance the claim doesn't survive across sessions. |
| Scope sprawl | A 400-line research doc | Tier cap (90/185/250). Re-scope to the feature, not the project. |
| Parent-context scanning | Reading 50 files into the parent context | Use the Explore sub-agent. The parent reads ≤5 files, only for citation spot-checks. |
| Library-list bloat | Every `package.json` dep listed | Only the deps the feature actually touches. |
| Stack rediscovery | "Project uses Next.js 14" | That's anchor-level. Research is finer-grained — files, conventions, prior art. |
| Open questions = open scope | Listing capabilities the feature might add | Open questions are *answerable HOW unknowns*. New capabilities → `RESCOPE-NEEDED → /prd`. |
| Sub-agent prompt missing scope | Sub-agent returns half-relevant findings | Always paste the PRD Scope verbatim + the anchor stack + the `placement` hint into the prompt. |
| Stale facts | A cited file was rewritten months ago | `git log path/to/file.ts` on key citations; flag stale ones in Notes. |
| Inventing synonyms | Research uses terms the repo/glossary doesn't | Use the `.ai/context.md` glossary terms verbatim. |
| Writing a `.human` mirror | Emits a `.human/specs/<feature>/research.md` or a diagram | Research never mirrors — facts-only machine artifact; the read-back is the checkpoint. |
| Running on greenfield | Scanning a project with no existing code | Brownfield-only. Greenfield → skip, route to `/design`; write nothing. |
