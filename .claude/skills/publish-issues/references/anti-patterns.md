# /publish-issues anti-patterns

Behavioral patterns to reject. Referenced from `SKILL.md` Critical rules — these backstop the numbered rules.

| Anti-pattern | Symptom | Fix |
|---|---|---|
| Multi-backend mode | `--backend=beads,jira` | Refuse. Two runs. |
| Writing `backend_refs` before upstream confirms | Canonical file references a tracker id that doesn't exist | Write-back is the LAST step per slice. On failure, `backend_refs` stays `null` and re-run picks it up. |
| Writing a new artifact or `.human` mirror | Creating `.ai/publish.md` or a `.human/summaries/*` | This skill mutates existing canonical files only — it authors no document. The `md` backend IS the human projection. |
| Skipping topo order | Child published before parent → dep link points at `null` | Sort by `depends_on` before executing. |
| Best-effort partial publish on schema error | One bad file → skip it, publish the rest | Refuse the whole run. Drift between canonical and tracker is worse than not publishing. |
| Closing in-progress upstream | `bd close` / Jira transition on a ticket someone (or the runner) is mid-task on | Refuse — surface CONFLICT. Closing under active work corrupts state. |
| Running beads adapter while another `bd` writer is active | Phase 0 didn't check `.ralph-state/` | The bd dolt lock deadlocks ~10 min. Honor the single-writer guard. |
| Re-deriving fields the canonical file already specifies | Re-computing AFK/HITL from architecture invariants here | Mechanical mapping only. If a canonical field is wrong, fix `/to-issues`. |
| Backwards-compat shims | Translating between old and new schema versions | No. If the schema changes, run `/to-issues` to regenerate; this skill reads only the current schema. |
| Manual edits to `backend_refs` outside this skill | User hand-edits `backend_refs.beads` to a different id | Don't — this skill is the only writer of `backend_refs`. To retarget, set `null` and re-run. |
| Tracker-specific frontmatter creep | Adding `jira_epic:` to the canonical schema for adapter convenience | Refuse. Tracker concerns stay under `backend_refs`; the canonical schema stays tracker-agnostic. |
| Treating `--dry-run` as "soft execute" | Dry-run writes anything anywhere | Dry-run is pure — read-only, prints the plan, exits. No bd / Jira / file writes. |
| Putting chain-internal labels in `tracker_label_map` | `anchor.md` contains `f-id-F-1: req-F-1` or `skip-tests: no-test` | Silently ignored — chain-internal keys are pass-through. `/qa` and the beads runner grep these by exact string; renaming breaks the contract. The map remaps **only** the display-label set. |
| Two-way sync from tracker → canonical | Reading a closed bead's state back into the `.ai` file | Out of scope. The canonical file owns the spec; the tracker owns workflow state; `/qa` reconciles at feature close. |
