# Pre-PR Checklist

_Run before opening any PR. An agent should paste this, check each item with evidence, and
report what it could NOT verify._

- [ ] `scripts/check` is green (tests + lint + typecheck + import contracts) — paste the output
- [ ] Every acceptance criterion in the plan has a passing test
- [ ] New tests were committed before the implementation and are unchanged since (TDD tamper check)
- [ ] Mutation score on changed files meets the bar (not just line coverage)
- [ ] No protected paths modified without recorded human approval
- [ ] No invented APIs — every external symbol verified to exist
- [ ] Smallest change that works; no unrequested abstractions or features (YAGNI)
- [ ] `.ai/project-state.md` updated; decision recorded in `.ai/decisions/` if one was made
- [ ] Docs updated if a boundary changed (`.ai/architecture.md` and `.human/architecture.md`)
- [ ] Commit messages state which requirement/failure each change addresses
- [ ] **Stated explicitly: what was NOT verified and why**
