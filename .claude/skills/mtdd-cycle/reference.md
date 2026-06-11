# mtdd-cycle — reference (rationale & troubleshooting)

Background and failure-recovery for the orchestrator. The driving procedure is
in `SKILL.md`; read this when a sub-agent misbehaves or you need the "why"
behind a report shape.

## Why each report shape matters

- **Implement → BRANCH + SHA**: the review and verify sub-agents need to confirm they are on the right branch; the branch persists on disk between spawns.
- **Review → verbatim `<criteria>` + `<promise>`**: this is the decision gate. The skill's output contract forbids writing those blocks to a file, so the verdict lives in the report — read it there.
- **Verify → verbatim smoke checklist**: the cycle deliberately ends before merge so a human can drive the slice; the checklist is the hand-off and must reach the user unchanged.

## Common errors

### Phase reported `BLOCKED: cycle-state unreadable`
**Symptom**: implement returns `STATUS: BLOCKED` with reason "cycle-state unreadable", or review returns `<promise>REJECT</promise>` whose single concern is "BLOCKED: cycle-state unreadable" — caught at Gate A / Gate B.
**Cause**: the phase was told it was running autonomously but could not confirm it from `.mtdd/cycle-state` — the file was missing, garbled, had `mtdd_cycle_mode` not set to `autonomous`, or its `mtdd_cycle_id` didn't match the identifier the phase was invoked with. This is the **fail-loud** replacement for the old silent stall: the phase refuses to wait forever for a `go` no one will type.
**Fix**: confirm `.mtdd/cycle-state` exists, is well-formed `key=value` (sh-sourceable), and that `mtdd_cycle_id` matches the `IDENTIFIER` you launched the cycle with — see [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md). You write this file at Step 0, so a mismatch usually means a typo in the identifier or a leftover state file from a different task. Correct the file (or delete it and re-run `/mtdd-cycle IDENTIFIER` to recreate it fresh), then re-run — the resume logic picks up from the recorded phase.

### Resuming a halted or interrupted cycle
**Symptom**: a cycle stopped (REJECT/FAIL/BLOCKED, or the run was interrupted) and you want to continue, not restart.
**Fix**: there **is** a resume primitive now — re-run `/mtdd-cycle IDENTIFIER`. Step 0 reads `.mtdd/cycle-state`, matches the id, and jumps to the recorded `mtdd_cycle_phase` (re-spawning the same phase fresh — safe: implement detects the existing branch, review/verify re-read the recorded `mtdd_cycle_branch`). A `halted` state restarts at implement, on the assumption a human fixed the cause. A `done` state reports the cycle already finished. See the resume table in [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md).

### Sub-agent reports it cannot find the skill
**Cause**: the named skill was not discoverable in the sub-agent's environment.
**Fix**: the prompts already include the file fallback (`.claude/skills/mtdd-<phase>/SKILL.md`). If that path is wrong for this repo, pass the correct absolute path to the SKILL.md in the prompt.

### Review sub-agent "approved" but emitted no `<promise>` tag
**Cause**: it summarized instead of following the output contract.
**Fix**: do not infer COMPLETE from prose. Re-spawn the review sub-agent and require the verbatim `<promise>COMPLETE</promise>` or `<promise>REJECT</promise>` line; treat a missing tag as not-COMPLETE and halt.

### Verify ran on a rejected diff
**Cause**: Gate B was skipped.
**Fix**: never spawn verify unless review returned `<promise>COMPLETE</promise>`. A REJECT halts the cycle.

### Tempted to also merge
**Cause**: muscle memory from the full chain.
**Fix**: this cycle is implement-review-verify only. Stop after surfacing the smoke checklist. Merging is `/mtdd-merge`, run by the human after the smoke pass.
