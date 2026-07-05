# Release Checklist

_Run before shipping a release. Complements `pre-pr.md` (per-change) with release-wide gates.
For the deploy mechanics, see `.human/runbooks/example-deploy.md`._

- [ ] All PRs in the release have passed `pre-pr.md`
- [ ] Full regression / golden-dataset suite green (not just changed-file checks)
- [ ] `.ai/project-state.md` "Done" reflects everything shipping; "Open questions" is empty or non-blocking
- [ ] Migrations are backward-compatible and reversible
- [ ] Docs updated: `.human/architecture.md`, relevant `.human/features/`, `.human/adr/` for any new decision
- [ ] Observability in place for new surfaces (spans, cost, error/guardrail signals)
- [ ] Rollback path verified and auto-rollback thresholds set (see the deploy runbook)
- [ ] Changelog / release notes generated from commits
- [ ] Version bumped where relevant (app, plugins/skills using semver)
