# Runbook: <operational task>

> One page per operational task (deploy, rotate a key, restore a backup, drain the queue).
> Copy to `runbooks/<verb-noun>.md`. Write it so a tired human at 3 a.m. can follow it exactly.

- **When to use:** <the trigger / alert that sends you here>
- **Owner:** <name>   **Est. time:** <n min>   **Reversible?:** yes / no — point of no return at step <n>

## Preconditions
- [ ] <access / credential / flag you need before starting>

## Steps
1. <exact command or click, with the expected output>
2. <…>
3. **Verify:** <how you confirm it worked — a concrete signal, not "looks fine">

## Rollback
<the exact way to undo this, rehearsed once. If there's no rollback, say so loudly and name the point of no return.>

## If it goes wrong
<who to call / what to disable / where the logs are>
