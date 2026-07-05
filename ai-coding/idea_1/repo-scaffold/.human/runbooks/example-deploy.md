# Runbook: Deploy to production

- **When:** [merge to main / release tag / manual]
- **Who can run it:** [role]  ·  **Blast radius:** production traffic  ·  **Reversible?** yes, via Rollback below

## Pre-flight
- [ ] `scripts/check` green on the commit being deployed
- [ ] Migrations reviewed and backward-compatible (see `.human/adr/` on DB changes)
- [ ] `.ai/project-state.md` reflects what's shipping

## Deploy
1. [`[deploy cmd]`] — [what it does]
2. Watch [dashboard/link] for [error rate, p99 latency, refusal/guardrail rates].
3. Smoke test: [`[cmd or URL]`] returns [expected].

## Verify (gate on observed state, not the deploy tool's exit code)
- [ ] Health endpoint returns 200 with the new version
- [ ] Key user flow works end-to-end
- [ ] No spike in error/guardrail signals over [N] minutes

## Rollback (if any verify step fails)
1. [`[rollback cmd]`] — reverts to [previous version].
2. Confirm health + key flow restored.
3. File an incident; capture the trace; add a regression test so it can't silently return.

## Auto-rollback thresholds (if automated)
- p99 latency > [1.3×] baseline for [10] min → rollback
- error/refusal rate up > [5%] → rollback
- guardrail trip rate > [1.5×] trailing baseline → rollback
