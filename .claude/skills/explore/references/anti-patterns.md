# /explore anti-patterns

Patterns to reject. Referenced from `SKILL.md` Phase 6 (read back) — scan the draft before pasting.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Recommendations in recon | "We should split the billing service" / "consider switching ORM" | Move to `/architect` (high-level) or `/design` (per-feature). Recon is facts only. |
| Uncited claims | "The codebase uses repository pattern" with no `file:line` | Force `path/to/file.ts:L42`. Without provenance the claim doesn't survive across sessions. |
| Whole-file dumps | Pasting 200 lines of a file into Section B | Cite `path:line` ranges. Recon is a map, not a transcript. |
| Parent context scanning | Reading 100 files into the parent context | Use the sub-agent. Parent context reads ≤5 files (only for citation spot-checks). |
| Exhaustive dep list | Every entry from `package.json` listed in Section A | Only the integrations the code actually uses (cite the import site). Anchor already owns the stack-level summary. |
| Style label without evidence | "This is a hex architecture" with one citation | Report signals, not labels. Multiple cites or none — let `/architect` pick the label. |
| Stack rediscovery | "Project uses Next.js 14" in Section A | That's anchor-level. Recon is finer-grained — files, conventions, components, decisions. |
| Component count sprawl | 25 components in Section B | Cap 3–10. If more, you're listing files, not components. Re-cluster. |
| Glossary noise | Section C lists `User`, `Request`, `Service`, `Handler` | Skip generic tech terms. Domain nouns only. |
| Invariants as wishes | "Code should validate emails" | Phrase as enforced ("Email format must match regex — `src/users/validate.ts:L8`") or move to Section E gaps. |
| Section drop instead of prune | Whole section missing because over cap | Prune lowest-signal items per section. Sections are mandatory; depth is tier-aware. |
| Mystery zones with answers | "Mystery: `src/auth/` — does authentication" | If you can classify it, classify it. Mystery zones are genuinely unclassifiable folders for `/comprehend` to ask about. |
| Stale facts | Cited file was rewritten 6 months ago | Spot-check with `git log path/to/file.ts` on key citations; flag stale ones in Section E. |
| Greenfield false positive | Running on a fresh `npm create` skeleton | Refuse with `SKIPPED-GREENFIELD`. Look for actual application code, not framework boilerplate. |
| Sub-agent without scope | Sub-agent returns wandering generalities | Always paste the anchor stack + tier + cap. The Phase 3 prompt template is the floor, not the ceiling. |
