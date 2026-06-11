# /comprehend anti-patterns

Patterns to reject. Referenced from `SKILL.md` Phase 8 (read back) — scan the draft before writing.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Re-deriving from scratch | Interviewing the user for the glossary as if there were no code | Start from recon Section C's cited candidates; confirm/correct, don't regenerate. The code wrote the first draft. |
| Every code constraint becomes an invariant | "Invariant: `email` column is NOT NULL" / "Invariant: returns 200ms" | Triage: keep domain rules, drop implementation details. Storage/transport/perf is evidence, not a domain invariant. |
| Missing the gaps | Only listing what the code enforces; ignoring rules the user relies on but code doesn't check | Surface unenforced domain rules as Open-assumption gaps (future fitness-function candidates). The divergence is the point of brownfield. |
| Asking in code jargon | "Is this aggregate's invariant correct?" | Translate to product terms: "the system only lets one person own an account — rule, or just how it's built?" Jargon stays in the artifact. |
| Inventing synonyms | Renaming the code's `Session` to `Engagement` because it reads nicer | Use the repo's own terms. Renames cause drift between the model and the code. |
| Guessing mystery zones | Classifying a Section E folder the code couldn't explain, without asking | Walk each with the user. Resolve to a fact or log as an Open assumption — never guess. |
| Silently overwriting context.md | Replacing an existing glossary term with the code-derived one | Run the conflict probe; surface the clash and let the user decide. |
| Uncited code claims | "The code enforces single-ownership" with no `file:line` | Carry recon's `file:line` provenance into the artifact for every code-backed invariant. |
| Leaking into the HOW | Recording stack/framework/component decisions as understanding | Those are `/architect`. Understanding is the WHAT — domain language, rules, journeys. |
| Batching context.md writes | Holding all terms to the end, then writing once | Write each term/entity to context.md as it resolves — batching loses terms. |
| Skipping the read-back | Writing the artifacts without confirming fidelity | Phase 8 read-back ("where did I misread what this app does?") is the checkpoint — there's no human sign-off gate before it. |
| Running on greenfield | No recon.md, no code — modeling a fresh idea | Refuse: `GREENFIELD → /understand` or `BLOCKED-ON-RECON → /explore`. |
