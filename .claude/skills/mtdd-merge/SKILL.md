---
name: mtdd-merge
description: |-
  Manual-TDD-loop merge phase closer. Accepts a bd-tracked bead ID, a canonical chain ticket file, or a free-form task markdown file. Merges the current feature branch into the target branch (default develop) and verifies a clean tree. For beads, writes a completion summary via multi-line bd note and runs bd close ID. For canonical/free-form markdown tasks, appends a Completion section to the file. Never pushes changes to remote; human pushes manually downstream. Use for "/mtdd-merge", "manual tdd merge", "merge this branch", or immediately after /mtdd-verify passes.
allowed-tools:
  - Read
  - Edit
  - Bash
  - Glob
  - Grep
hooks:
  # One-time, NON-BLOCKING preflight: this phase runs `bd close`, and a close
  # silently reverts after a later `git checkout` if beads state is git-tracked.
  # Warn once per session on the first `bd` call if the repo is in that exposed
  # config; never block (it's a one-time setup property — see
  # _build_share/BEADS-SETUP.md).
  PreToolUse:
    - matcher: Bash
      hooks:
        - type: command
          if: "Bash(bd *)"
          once: true
          command: "sh .claude/skills/_build_share/gates/beads-safety-guard.sh"
          statusMessage: "Checking beads is safely configured…"
---

# mtdd-merge — manual TDD merge phase

You are running the **merge phase** of a manual TDD loop. Verify passed; your job is to merge the feature branch into the target, confirm the tree is clean, and write the completion summary onto the task file. You do **NOT** push — that's a user decision.

## ABSOLUTE PROHIBITIONS

- **NEVER** `git push` (any form). Tell the user how, but they push.
- **NEVER** `git push --force`. Even if they ask. Tell them to call it themselves and double-check.
- **NEVER** delete the feature branch in this phase. The user may want to keep it around for reference.
- **NEVER** edit the task's `## Acceptance criteria` checkboxes. Those are the review phase's record; tampering them rewrites history.

## Inputs

- A task identifier — a `tasks/<slug>.md` file (free-form core), a bead ID, or a canonical ticket. **Resolve the task source** — see [`../_build_share/task-sources.md`](../_build_share/task-sources.md).
- The current git state — you should be on the feature branch, working tree clean, verify passed.

If no task identifier was provided, ask the user.

## Procedure

### 1. Read the task

Resolve the task source per [`../_build_share/task-sources.md` § Picking the source](../_build_share/task-sources.md#picking-the-source). For beads read via `bd show <id>` (prefer `--json`); for file sources read the file. Extract:

- `target_branch` — **prefer the branch's stamp**: `git config branch.$(git rev-parse --abbrev-ref HEAD).mtdd-target` (set by `/mtdd-implement` — the branch you'll merge back into). If empty, fall back to beads / canonical `target_branch:` OR free-form `## Target branch`, then `develop`. This is the branch you merge into — getting it wrong merges into the wrong place, so prefer the stamp.
- `feature_branch` — find the branch name. In **beads mode**, parse the most recent implement-phase note from the bead (it names the branch). In **file modes**, parse the last `## Status log` entry. Fallback in any mode: `git rev-parse --abbrev-ref HEAD` after confirming it starts with `feature/`.
- `acceptance_criteria` — the full `## Acceptance criteria` list (used in the completion summary).
- **Beads / canonical:** the traceability arrays (`satisfies_f_ids`, `satisfies_user_stories`, `satisfies_nfrs`, `satisfies_unwanted`) — embedded into the Completion summary for the audit trail.
- **Beads only:** `bead_id` = the argument.

### 2. Pre-merge checks

- `git rev-parse --abbrev-ref HEAD` — note the current (feature) branch name.
- `git status --porcelain` — must be empty. If dirty, **stop and ask**.
- `git log <target>..HEAD --oneline` — must be non-empty (there are commits to merge).

### 3. Snapshot pre-merge data for the summary

Run these **before** the merge so the branch range is still meaningful:

- `git log <target>..HEAD --oneline` → keep as `commit_summary`.
- `git diff <target>...HEAD --name-only` → keep as `changed_files`.

### 4. Switch to target and fast-forward from remote (best-effort)

```
git checkout <target>
git fetch          # ok to fail (no remote)
git status -sb
```

If `git status -sb` reports `behind`:

- Try `git pull --ff-only`.
- If fast-forward fails, **stop**. Tell the user: "local `<target>` is behind remote and cannot be fast-forwarded. Pull or rebase manually, then re-run `/mtdd-merge @<task-file>`." Do NOT proceed.

If there's no remote (fetch errored), continue — nothing to do.

### 5. Merge

```
git merge <feature-branch> --no-edit
```

- If the merge succeeds with a clean tree, continue.
- If there are merge conflicts, **stop**. Tell the user: "merge conflicts in `<file list>`. Resolve manually, commit, then re-run `/mtdd-merge` to finish the summary step." Do NOT try to auto-resolve.

### 6. Confirm clean tree

```
git status --porcelain
```

Must be empty. If not, surface the unexpected paths to the user and stop.

### 7. Write the completion summary

Build the summary content first (mode-independent), then write it to the right place:

```markdown
**Merged:** <ISO 8601 date> into `<target>` from `<feature-branch>` at <short SHA>

**Commits on the branch:**

<commit_summary contents — full output of git log <target>..HEAD --oneline at step 3>

**Files changed:**

<one bullet per file from changed_files>

**Acceptance criteria (final state, copied from the review phase):**

<the criteria checklist, ticked according to the review-phase verdict>

**Traceability** (omit if all arrays empty):

- F-IDs: <list from `satisfies_f_ids`>
- User stories: <list from `satisfies_user_stories`>
- NFRs: <list from `satisfies_nfrs`>
- Unwanted-EARS: <list from `satisfies_unwanted`>

**Notes:**

<one paragraph: anything the user should know — deferred work, follow-up tickets to file, surprises along the way. If there's nothing, write "Nothing notable.">
```

Where to write it:

- **Beads mode:** pipe the whole summary into `bd note` via stdin:
  ```sh
  bd note <bead-id> --stdin <<'EOF'
  <the summary content above, verbatim>
  EOF
  ```
  `bd note` appends to the bead's notes field with a newline separator (it's the canonical shorthand for `bd update <id> --append-notes`). No file is touched. The summary lives in the bead's notes stream.
- **Canonical mode:** prepend `## Completion\n\n` and append at the end of the task file (after `## Blocked by` and any `## Status log` you may have created). Use Edit, not Write — preserve the rest of the task file.
- **Free-form mode:** prepend `## Completion\n\n` and replace the empty `## Completion` section already in the template. Use Edit.

### 8. Per-task progress entry + close the bead

Line shape (all modes):
```
- merge: COMPLETED — merged into `<target>` at <short SHA of the merge commit>
```

Where to write it (per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations)):

- **Beads mode:** `bd note <bead-id> -- "<the line above>"`, **then close the bead with a reason:**
  ```sh
  bd close <bead-id> --reason "merged into <target> at <short SHA>"
  ```
  `bd close` is idempotent (re-running merge after a partial failure is safe — already-closed beads don't error). The `--reason` is recorded as the close event and shows up in `bd show`.

  **Close guard — verify the write actually landed.** Immediately read the bead back and confirm its status:
  ```sh
  bd show <bead-id> --json
  ```
  The `status` field must read `closed`. If it does NOT, **stop** — do not report a successful merge in the hand-off; tell the user the close did not take effect (likely a wrong ID, a locked DB, or a no-op) so they can investigate. Confirm in the hand-off that the bead was verified closed. (This guard confirms the close *now*; it can't prevent a *later* silent revert from a git-tracked-`issues.jsonl` setup — that's a config property, see [`../_build_share/BEADS-SETUP.md`](../_build_share/BEADS-SETUP.md).)
- **Canonical mode:** append the line to the task file's `## Status log`; create the section (before `## Completion`) if missing.
- **Free-form mode:** append the line to the existing `## Status log`.

### 9. Append a session breadcrumb to `.ai/progress-tracker.md` (chain convention — optional standalone)

**Only if this repo keeps an `.ai/progress-tracker.md` session log** (the full chain does; a standalone MTDD repo usually does not). If there's no `.ai/progress-tracker.md` and no `.ai/` convention in the repo, **skip this step entirely** — the per-task record from step 8 (the bead note / `## Status log`) is sufficient. Do not create `.ai/` just to write a breadcrumb.

When the file does exist, append a new entry to its top per [`../_build_share/PROGRESS-TRACKER.md` § Entry format](../_build_share/PROGRESS-TRACKER.md#entry-format) — the session-resumption breadcrumb that lets the next session see what landed without trawling every slice file or `bd show`.

**Also skip when:**

- Idempotent re-run (the rule at the bottom of this file detected the branch already merged — no new merge commit) → do NOT append; an entry already exists from the original run.
- Merge stopped (dirty tree, conflicts, behind-remote) → do NOT append; nothing crystallized.

**Entry shape — mode-aware scope:**

- **Beads mode:** `<scope>` = bead ID. `Artifact:` = the bead (no `.ai/` path).
- **Canonical mode:** `<scope>` = `<feature>/slice-<N>`. `Artifact:` = the materialized ticket path.
- **Free-form mode:** `<scope>` = task slug. `Artifact:` = the task file path.

Example (canonical mode):

```markdown
## 2026-05-23 — mtdd-merge landed (invoice-send/slice-3)
- Artifact: `tickets/invoice-send/SLICE-3-async-relay.md` — merged into `develop` at `a1b2c3d`; 4 commits, 7 files changed.
- Key decision(s): all 5 acceptance criteria satisfied; OutboxRelay wired end-to-end behind feature flag.
- Next: pick the next ready task. (Full chain: `/build invoice-send`, which routes to `/qa` once no slices remain.)
```

The `Next:` line should reflect the operator's likely next action — `bd ready` (beads) or the next task file. If you're running the full chain, that's `/build <feature>` (which flips to `READY-FOR-QA` and routes to `/qa` at the feature boundary); standalone, it's just the next task.

## Hand-off

A short paragraph to the user:

- Confirm the merge landed (target branch + merge SHA).
- Remind them what's **not** done: push, branch deletion, deploy. They handle those.
- **Beads + tracked-export warning (conditional — beads mode only).** Check whether the export is git-tracked: `git ls-files --error-unmatch .beads/issues.jsonl` (exit 0 = tracked). If tracked, `bd close` just modified `.beads/issues.jsonl` and this skill did **not** commit it. Print this note **verbatim**:

  > ⚠️ WARNING: this repo git-tracks `.beads/issues.jsonl` and re-imports it on branch switch. The close is saved in the Dolt DB but the export is **uncommitted** — please commit it manually **before going ahead** (any further branch switch), or the close will be silently reverted:
  > `git add .beads/issues.jsonl && git commit -m "chore(beads): sync issues.jsonl after close"`

  If the export is gitignored (or not beads mode), **skip this** — there's nothing to commit and the warning would only confuse. Background: [`../_build_share/BEADS-SETUP.md`](../_build_share/BEADS-SETUP.md).
- Suggested next commands (do not run):
  - `git push origin <target>` to publish.
  - `git branch -d <feature-branch>` to clean up locally once they've confirmed the push.

Example (beads mode):

> Merged `feature/bd-1234--add-oauth-refresh` into `develop` at `a1b2c3d`. Bead `bd-1234` closed.
>
> Not done by this phase (you handle):
> - `git push origin develop`
> - `git branch -d feature/bd-1234--add-oauth-refresh` once you've confirmed the push

Example (file mode):

> Merged `feature/foo-bar` into `develop` at `a1b2c3d`. Task file updated.
>
> Not done by this phase (you handle):
> - `git push origin develop`
> - `git branch -d feature/foo-bar` once you've confirmed the push

## Rules

- This phase is **idempotent on resume**: if the feature branch is already fully merged into `<target>` (i.e., `git log <target>..<feature>` is empty), skip the fetch/pull/merge steps and go straight to step 6. The user re-running this after a partial failure must not re-attempt the merge. Step 9 (progress-tracker append) also skips on resume — the original run's entry stands.
- Do **NOT** stash. If the tree is dirty, that's a stop condition, not something to paper over.
- Do **NOT** invoke any other `/mtdd-*` skill from inside this one. The user drives the loop.
- This skill does **NOT** commit or push the beads export (`issues.jsonl`) — by design it's "human commits / human pushes." See [`../_build_share/BEADS-SETUP.md`](../_build_share/BEADS-SETUP.md) for the safe configuration and the tracked-export revert hazard (warned verbatim in the hand-off above).
