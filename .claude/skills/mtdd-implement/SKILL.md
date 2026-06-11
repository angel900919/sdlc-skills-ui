---
name: mtdd-implement
description: |-
  Manual-TDD-loop implement phase executor. Accepts three task identifier shapes: a bd-tracked bead ID (claims bead and writes phase notes via bd note), a canonical chain ticket markdown file (tickets/feature/SLICE-N-slug.md with YAML frontmatter), or a free-form one-off task file (tasks/slug.md). Creates/checks out a feature branch, then drives red → green → refactor cycles using structured commit prefixes (red:, green:, refactor:). Runs strictly via manual user execution with human-in-the-loop control and no autonomous self-healing. Use for "/mtdd-implement", "manual tdd implement", "start the implement phase", or when a bead ID or task file is provided for coding.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
hooks:
  # All gates are git-only POSIX shell (no Node/tsx). They no-op in interactive
  # runs and activate only inside an autonomous sub-agent (/mtdd-cycle).
  # See _build_share/gates/ for the scripts and their inline contracts.
  PreToolUse:
    - matcher: Bash
      hooks:
        # Deny branch setup on a dirty inherited tree (autonomous only) so the
        # inherited changes can't ride onto the feature branch / into the commit.
        - type: command
          if: "Bash(git checkout *)"
          command: "sh .claude/skills/_build_share/gates/clean-tree-guard.sh"
          statusMessage: "Checking the working tree is clean…"
        - type: command
          if: "Bash(git switch *)"
          command: "sh .claude/skills/_build_share/gates/clean-tree-guard.sh"
          statusMessage: "Checking the working tree is clean…"
        # One-time, NON-BLOCKING warning if beads state is git-tracked (a close
        # can silently revert after a checkout). See _build_share/BEADS-SETUP.md.
        - type: command
          if: "Bash(bd *)"
          once: true
          command: "sh .claude/skills/_build_share/gates/beads-safety-guard.sh"
          statusMessage: "Checking beads is safely configured…"
  # Enforce TDD commit order as the autonomous implement sub-agent finishes
  # (SubagentStop), before review spawns — a mis-ordered branch is blocked here
  # instead of one expensive review cycle later. Same check /mtdd-review runs.
  Stop:
    - hooks:
        - type: command
          command: "sh .claude/skills/_build_share/gates/stop-guard.sh"
          statusMessage: "Checking TDD commit order…"
---

# mtdd-implement — manual TDD implement phase

You are running the **implement phase** of a manual TDD loop. The user has handed you a single task description as a markdown file. Your job is one cycle of implement work — TDD discipline, structured commits, no merging, no closing.

## ABSOLUTE PROHIBITIONS

Violating any of these breaks the manual loop. The user runs subsequent phases themselves; never pre-empt them.

- **NEVER** `git push` (any form). The user pushes manually after the merge phase, if at all.
- **NEVER** `git merge`. That's the dedicated merge phase (`/mtdd-merge`).
- **NEVER** `git checkout <other-branch>` after the initial feature-branch checkout. Stay on the branch this skill puts you on.
- **NEVER** `git rebase`, `git reset --hard`, `git push --force`. Destructive — never.
- **NEVER** edit the task's `## Acceptance criteria` checkboxes. The review phase ticks them; you only satisfy them.
- **NEVER** write the `<criteria>` or `<promise>` blocks — that's the review phase's contract.

Anything else (read, edit, write, `npm run *`, `git add`, `git commit`, `git status`, `git diff`, `git log`) is allowed and expected.

## Inputs

- A task identifier — a free-form task file (core), a beads ID, or a canonical chain ticket (adapters). Source detection + per-mode fields: [`../_build_share/task-sources.md`](../_build_share/task-sources.md); resolved concretely in step 1 below.
- The current working tree, on whatever branch the user is on.

If no task identifier was provided, ask the user. Do not invent the task from context.

## Procedure

### 1. Read the task — detect mode and extract fields

Resolve the task source per [`../_build_share/task-sources.md` § Picking the source](../_build_share/task-sources.md#picking-the-source):

- File path, no frontmatter (or frontmatter without `slice:`) → **free-form** (the core source).
- Argument has no `/` and doesn't end with `.md` → run `bd show <arg>` to confirm → **beads** adapter.
- File path + YAML frontmatter with `slice:` → **canonical** adapter.

**Beads mode** — run `bd show <id> --json` (fall back to `bd show <id>` if `--json` isn't supported on this `bd` version). Extract the same logical fields as canonical mode (the bead body matches the canonical schema), plus from the JSON: `status` (open/in_progress/blocked/closed), `labels`, `dependencies`. The `<bead-id>` itself is the argument.

**Canonical mode** — extract from frontmatter: `title`, `slice`, `feature`, `type`, `status`, `tests`, `language`, `depends_on`, `files`, `signatures`, `category` (`enhancement` | `bug`, default `enhancement`), `hitl_reason`, `skip_tests_reason`, optional `target_branch` (default `develop`). Extract from body: `## What to build`, `## Acceptance criteria`, `## Blocked by`.

**Free-form mode** — extract from body: `# <title>`, `## Context`, `## Goal`, `## Acceptance criteria`, `## Out of scope`, `## Target branch` (default `develop`), `## Skip tests?`.

**Unify** into a small mental model:
- `skip_tests` = canonical `tests == "skip-tests"` OR free-form `Skip tests? == true` OR (beads) body `tests: skip-tests` AND both `skip-tests` + `force-skip-tests` labels present.
- `target_branch` = the branch this slice integrates into (the feature branch is cut **from** it; `/mtdd-merge` merges **back into** it). It is **never** silently assumed — resolve in this order:
  1. **Provided by the invocation/orchestrator** — if the invocation explicitly names a target branch (autonomous `/mtdd-cycle` passes one it confirmed with the user at its Step 0), use it as-is. No detection, no confirmation.
  2. **Configured or declared** — `.mtdd/config` `mtdd_target_branch` (written by `/mtdd-init`, if present), else the task's declared value (canonical / beads `target_branch:` or free-form `## Target branch`). Use it (still echoed for confirmation at the briefing pause, step 1.7d).
  3. **Neither** — do **not** assume `develop`. Detect a default to *propose*: `git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null` (strip the `origin/`), else `develop` if `git rev-parse --verify develop` succeeds, else the branch you're currently on (`git rev-parse --abbrev-ref HEAD`). You will **confirm this proposed default with the user** at the briefing pause before cutting any branch.
- `acceptance_criteria` = the `## Acceptance criteria` checkbox list (same shape across all three modes).
- `is_bug` = canonical `category == "bug"` OR (beads) a `bug` label / body `category: bug` OR a free-form task whose `## Context` describes a defect to fix (something currently broken), not new behaviour. Default `false`. Drives the bug-fix discipline in step 5.
- `bead_id` (beads only) = the argument.

If `skip_tests` is true, follow the **skip-tests** branch (step 5 alternate). Otherwise full TDD.

**Sanity-check the acceptance criteria before proceeding.** If any criterion reads like the left column of the deterministic-vs-vague table in [`../_build_share/task-template.md`](../_build_share/task-template.md) ("tests pass", "code is clean", "works correctly", "no regressions", "looks good") — STOP and ask the user to rewrite it as a shell command that exits 0 / non-0 or a precise behavioural assertion. A vague criterion will produce vague work and an ambiguous review; fix it at the task file, then resume.

### 1.5. Refusals (beads + canonical; skip in free-form)

Before touching any branch, refuse on any of these.

**Beads mode:**

1. `status: closed` → *"Bead already closed. Aborting."* STOP.
2. `status: in_progress` AND the matching feature branch is not currently checked out → *"Bead is claimed by another run. Run `bd update <id> --status open` to release the claim if you're sure no other agent is working on it, then retry."* STOP. (Current `bd` has no `--unclaim` flag — `--status open` is the supported way to release.)
3. `status: blocked` → *"bd reports this bead is blocked by an open dependency. Resolve the upstream beads first."* STOP.
4. `afk` label present OR body frontmatter `type: afk` → *"This bead is marked AFK (autonomous) — `mtdd` is human-in-the-loop only and won't run it."* STOP. (In the full chain, AFK work is handled by `ralph-loop-afk`; standalone, just refuse.)
5. Exactly ONE of `skip-tests` / `force-skip-tests` labels present (not both) → log a warning to the user, proceed with **full TDD** (do not skip tests). Both labels are required to actually skip — defense-in-depth against accidental mislabels.

**Canonical mode:**

1. **`type: afk`** → *"This slice is `type: afk` (autonomous) — `mtdd` is HITL-only and won't run it."* STOP. (Chain: `ralph-loop-afk` owns AFK slices.)
2. **`status: removed`** → *"Slice was retired upstream. Aborting."* STOP.
3. **Unmet `depends_on`** — for each slice number `M` in `depends_on`:
   - Glob for `tickets/<feature>/SLICE-M-*.md` (the sibling materialized ticket).
   - Read it; check for a `## Completion` section containing a `**Merged:**` line.
   - If absent → *"Slice M (in `depends_on`) is not yet merged. Run `/mtdd-implement` on that slice first, then come back."* STOP.

Surface `hitl_reason` (one sentence) to the user before starting: *"This is HITL because: <hitl_reason>. Proceeding under that constraint."* If `skip_tests` is true, also surface `skip_tests_reason`.

### 1.6. Claim the bead (beads mode only — skip in canonical / free-form)

Once refusals pass and the bead is `open`, claim it before doing anything else:

```
bd update <bead-id> --claim
```

`--claim` is atomic — it sets `assignee` to you and `status: in_progress` in one transaction, and is idempotent if you already hold the claim. **Skip this step on resume** — if the bead is already `in_progress` and the matching feature branch already exists, we're resuming, not starting fresh. (Clearing a stuck claim after a crash: [`reference.md` § Releasing a stuck bead claim](reference.md#releasing-a-stuck-bead-claim-beads-mode).)

### 1.7. Brief yourself — classify and load matching style packs

Before touching any branch, brief yourself on the rules you'll follow so the code is born clean. The pause at the end is mandatory — never start coding before the user confirms (the sole exception is autonomous mode; see the bypass in step d).

**a) Classify.** Scan the task's title, `## Acceptance criteria`, and the `files:` array (canonical) or body file mentions (free-form). Assign zero or more buckets:

- `typescript-style` — slice touches `.ts` or `.tsx` files.
- `python-style` — slice touches `.py` files.
- `react` — slice touches `.tsx` or mentions React / Next.js / hooks / components / Server Components.
- `architecture` — slice introduces a new module boundary, integrates a third-party SDK, splits or merges components, or makes a deferrable tech decision.

**Language default.** When the file set doesn't pin a language, take it from `.mtdd/config` `mtdd_language` (written by `/mtdd-init`), else the repo's root manifest (`package.json` → typescript, `pyproject.toml` → python, `go.mod` → go, `Cargo.toml` → rust), else the task's `language:` field. Don't assume TypeScript.

If none bucket (config-only edit, doc tweak, typo fix), say so in one line and skip to step 2 — no briefing.

**b) Load.** Open ONLY the matching packs:

- `typescript-style` → [`../_build_share/ts-styleguide.md`](../_build_share/ts-styleguide.md)
- `python-style` → [`../_build_share/py-styleguide.md`](../_build_share/py-styleguide.md)
- `react` → [`../_build_share/react-rules.md`](../_build_share/react-rules.md) — inside it, read ONLY the sub-packs matching the task (`component`, `form`, `page`, etc., per that file's pack-selection map at the bottom)
- `architecture` → [`../_build_share/architecture-rules.md`](../_build_share/architecture-rules.md)
- any slice with `tests: required` → also open the project's `.ai/test-strategy.md` (when it exists) and brief its fixture/factory conventions plus the canonical entity-acquisition rows for the entities the slice touches — red-phase tests obtain data the strategy's one canonical way, never via ad-hoc scaffolding.

Loading packs you didn't bucket wastes context for no benefit.

**c) Brief.** Print a ≤25-bullet briefing under the heading `## mtdd briefing — <slice title>` with four short sections:

```
## mtdd briefing — <slice title>

### Defaults (apply throughout)
- <rule from a loaded pack>

### Patterns to use
- <pattern> — <one-line why>

### APIs / types to prefer
- <api or type> — <when>

### Pitfalls to avoid
- <pitfall> → <fix>
```

Quote rules from the loaded packs — do not paraphrase past recognition. If you need more than 25 bullets, you over-loaded the packs; drop the least-relevant ones and re-brief.

**d) Pause + confirm the target branch.** Echo the resolved `target_branch` (and, when it came from resolution case 3, say it's a detected default you're proposing), then end with these two lines on their own:

```
Target branch: <target_branch> — I'll cut the feature branch from it and merge back into it.
Stop me here if any rule above is wrong, or name a different target branch. Reply 'go' to proceed.
```

Wait for the user's `go` (or a correction / a different branch) before running any further tool calls. Do not edit files, check out branches, or call git in between. If the user names a different branch, that becomes `target_branch`.

**Confirm the target even when there's no style briefing.** If step (a) bucketed nothing (config-only / doc / typo) you skip the briefing — but you must **still** surface the `Target branch:` + `Reply 'go'` lines above and wait, unless the target was provided by the orchestrator (case 1) or you're in autonomous mode. The branch choice is load-bearing regardless of whether style packs loaded.

**Autonomous-mode bypass — read it from `.mtdd/cycle-state`, not a magic word.** The `/mtdd-cycle` orchestrator records the run mode in `.mtdd/cycle-state` (schema + read snippet in [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md)). At this pause, read that file and check `mtdd_cycle_mode=autonomous` **and** `mtdd_cycle_id` equals the identifier you were invoked with:

- **Confirmed autonomous (id matches)** → do **not** wait: print the briefing for the record, then proceed straight into branch setup (step 2) and coding as if the user had replied `go`. The target arrives via resolution case 1 (the orchestrator confirmed it at its Step 0) or case 2 (declared on the task); if somehow neither is present, log the detected default loudly and proceed with it rather than pausing.
- **No file, wrong mode, or id mismatch** → you are an ordinary interactive run (a human invoking `/mtdd-implement` directly never has a matching autonomous state): the pause is **mandatory** — surface the `Target branch:` + `Reply 'go'` lines and wait.
- **Fail loud, never stall** → if your invocation explicitly says you are running under an autonomous `/mtdd-cycle` for this id but you cannot confirm it from `.mtdd/cycle-state` (file missing, unreadable/garbled, mode not autonomous, or id mismatch), do **not** wait for a `go` that will never come: report `BLOCKED: cycle-state unreadable` so the orchestrator halts at its Gate A.

This bypass covers only this confirmation pause — every genuine refusal/blocker in steps 1, 1.5, and 2 (closed/claimed/blocked bead, dirty tree, vague criteria, file-boundary breach) still stops the run.

If the user corrects a rule, follow their guidance — they know the codebase. Don't relitigate. The correction (and your acknowledgement) is the new briefing for this slice.

**Tiny-task escape hatch.** If the entire task is a one-line tweak (rename a prop, fix a typo, bump a string literal), say so in one sentence and proceed without a pause — but **name the target branch in that sentence** (e.g. "Fixing the typo on a branch off `develop`.") so the choice is still visible and the user can interject. Don't ceremonialize trivial work.

### 2. Set up the branch

- Run `git status` and `git rev-parse --abbrev-ref HEAD`.
- **Compute branch name:**
  - **Beads mode:** `feature/<bead-id>--<short-slug-of-title>` (e.g., `feature/ralph-x8z--add-oauth-refresh`). ([Why the double-dash](reference.md#branch-naming-rationale).)
  - **Canonical mode:** `feature/<feature>-slice-<N>` (e.g., `feature/invoice-send-slice-3`).
  - **Free-form mode:** `feature/<slug>` where `<slug>` is the slugified title (lowercase, alphanumeric + hyphens, ≤50 chars).
- If currently on that exact branch, stay on it (resume).
- Otherwise:
  - Confirm working tree is clean (`git status --porcelain` empty). If dirty, **stop** — never blow away their work. Interactive run: **ask** the user. **Autonomous mode (confirmed via `.mtdd/cycle-state`): a dirty inherited tree is a hard BLOCKED stop, not something to bootstrap over** — do **NOT** `git stash` / `git reset` / `git checkout -- .` it (that destroys their work) and do **NOT** proceed; report `BLOCKED: dirty inherited tree` so the orchestrator halts. The inherited changes must be committed or cleaned by a human first. (A `PreToolUse` hook enforces this — it denies the branch-setup `git checkout`/`git switch` while the tree is dirty.)
  - `git checkout <target_branch>` then `git checkout -b <computed-branch-name>`.
  - **Stamp the target on the branch** (single source of truth for every later phase and the autonomous gate):
    ```
    git config branch.<computed-branch-name>.mtdd-target <target_branch>
    ```
    `/mtdd-review`, `/mtdd-verify`, `/mtdd-merge`, and the `stop-guard.sh` hook all read this stamp back, so the target you (or the user) resolved here is the one they use — none of them re-guess or fall back to a hardcoded `develop`. On **resume** (you stayed on an existing branch), re-stamp it if `git config branch.<branch>.mtdd-target` is empty, so an older branch made before this convention still gets the value.

### 3. Mirror the recent commit style

Run `git log -n 10 --oneline` (and a couple of full bodies if useful). Mirror prefix style and verbosity in your own commit messages so the branch looks coherent.

### 4. Plan

In one short paragraph (state to the user before coding): which acceptance criterion you tackle first, what the smallest behaviour-bearing test will be, and what tools/files you expect to touch. No more than 5 file reads before your first edit.

### 5. Execute — TDD discipline (vertical slicing, non-negotiable)

**File boundary (canonical mode):** the `files: [...]` array in the frontmatter is the **positive** boundary. Only create/modify paths listed there. If you find yourself needing to touch a file not in the list, STOP and tell the user — the slice scope is wrong, not your judgment. (Free-form mode uses `## Out of scope` as a negative boundary instead.)

> **Vertical not horizontal.** Wrong: write all tests → write all impl. Right: test1 → impl1 → refactor → test2 → impl2 → refactor → …

<!-- Behavioral guardrails below adapted from obra/superpowers (MIT), test-driven-development. -->

**The Iron Law:** `NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.` The only
sanctioned exception is the explicit skip-tests branch below — which the task
declared up front, with a reason, visible to the user. There is no implicit
exception. Wrote implementation before its `red:` commit? **Delete it and start
over from the test.** Don't keep it as "reference", don't "adapt" it while
writing the test, don't look at it. Delete means delete — code you reconstruct
from a failing test is code you can trust; code you back-fill a test onto is not.

**Red flags — STOP, delete the untested code, restart the cycle.** If you catch
yourself in any of these, the cycle is already broken:

- The test **passes on its first run** (you're testing existing behaviour — fix the test).
- You can't say **why** the test failed (assertion vs import error vs typo).
- Implementation exists before its `red:` commit, or you're about to commit red+green together.
- Writing all tests up front, then all implementation (horizontal — see above).
- Thinking *"too simple to test"*, *"I'll add the test after"*, *"I already manually tested it"*, *"keep it as reference"*, *"skip TDD just this once"*, or *"this is different because…"*.

**Rationalizations, pre-refuted:**

| Excuse | Reality |
|---|---|
| "Too simple to test" | Simple code breaks too. The test takes 30 seconds; the `red:` commit proves it tests something. |
| "I'll test after — same outcome" | Tests-after answer *what does this do*; tests-first answer *what should this do*. A test that never failed proves nothing. |
| "I already manually tested it" | Ad-hoc ≠ systematic: no record, can't re-run, gone on the next change. |
| "Deleting X minutes of work is wasteful" | Sunk cost. Keeping unverified code is the real debt — and the review gate will reject the mis-ordered branch anyway. |
| "Keep it as reference while I write the test" | You'll adapt it. That's testing after with extra steps. Delete means delete. |
| "TDD is slowing me down" | The `tdd-check.sh` gate and `/mtdd-review` run regardless. Slower now beats a REJECT later. |

**Bug-fix discipline (when `is_bug`).** A bug slice is a regression-test-first job, not a feature job. The opening `red:` commit MUST be a test that **reproduces the defect** — it fails because the bug is present, asserting on the *actual* wrong behaviour (the reported symptom), not on missing functionality. Watch it fail for the bug's reason, commit it `red:`, then make it green with the fix. If the task arrived with a minimised repro already attached (e.g. from a `/diagnose` step in the full chain), that repro is your first test — port it verbatim rather than inventing a new one. If you can't write a test that reproduces the defect (no correct seam — see [coding-standards.md](../_build_share/coding-standards.md)), STOP and tell the user: a fix with no failing-first test gives false confidence and needs a diagnosis pass first.

For each behaviour:

1. **RED** — write ONE failing test for ONE behaviour. Run it. Confirm it fails for the **right reason** (assertion, not import error). Commit:
   ```
   red: <one-line description of the behaviour the test pins down>

   <optional body: which file, why this behaviour, any non-obvious setup>
   ```
2. **GREEN** — write the **minimal** code to pass. Run the test. Confirm it passes. Commit:
   ```
   green: <one-line description of what you implemented>
   ```
3. **REFACTOR** — clean up while green. Apply the deletion test on any abstraction you create (see [coding-standards.md](../_build_share/coding-standards.md)). Re-run tests. If you refactor, commit:
   ```
   refactor: <one-line description>
   ```
   If there's nothing to clean up, **skip this commit** — do not invent refactors to fill the slot.
4. Repeat for the next acceptance criterion.

The prefixes (`red:` / `green:` / `refactor:`) make the TDD cycle visible in `git log --oneline`. Before handing off you can self-check the order with the same structural gate `/mtdd-review` enforces — from the project root: `sh .claude/skills/_build_share/gates/tdd-check.sh <target_branch> HEAD` (exit 0 = order OK, exit 1 = mis-ordered with a reason, exit 3 = no cycle commits). It's a git-only shell script (no Node), so it runs anywhere `git` does. Review runs this as a hard gate, so fixing a `FAIL` now saves a reject later.

> **Autonomous runs enforce this automatically** via a `SubagentStop` hook; interactive runs are not gated. Background: [`reference.md` § Why the autonomous Stop hook exists](reference.md#why-the-autonomous-stop-hook-exists).

### Skip-tests branch

If the task file's `Skip tests?` field is `true`:

- Make the smallest direct change that satisfies the acceptance criteria.
- Do **NOT** write tests. Do **NOT** run the test command. Do **NOT** add a test file.
- Use a single commit prefixed `chore: <description>` (or whatever matches recent log style).
- If you believe tests ARE warranted (the change touches non-trivial logic), stop and tell the user. Don't write tests anyway.

### 6. Verify acceptance, locally

For each acceptance criterion in the task file, point to the test (or behaviour) that demonstrates it. State this to the user in plain prose — do **NOT** edit the task file's checkboxes.

### 7. Stop conditions

Stop and hand back to the user when **any** of these is true:

- All acceptance criteria appear satisfied. Tell the user: "implement phase done — run `/mtdd-review @<task-file>` next."
- You hit a blocker you can't resolve in one cycle (missing context, ambiguous criterion, external dependency). Append a single line to the task file's `## Status log` section: `- implement (stopped): <reason>` and tell the user.
- You tried a tool 2× without progress. Stop and ask.

### 8. Progress entry

Before handing back, record the phase outcome per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations).

Line shape (all modes):
```
- implement: <one-line summary of what landed> — branch `<computed-branch-name>` at <short SHA>
```

Where to write it:

- **Beads mode:** `bd note <bead-id> -- "<the line above>"`.
- **Canonical mode:** append the line to the task file's `## Status log`. Section may not exist — create it at the end of the file (above any trailing whitespace) if missing.
- **Free-form mode:** append the line to the existing `## Status log`.

## Tool-usage rules (strict)

1. Always read relevant files BEFORE editing.
2. Prefer minimal edits (replace over rewrite).
3. Do NOT call tools repeatedly on the same file.
4. After writing code, STOP and verify (run the test) before continuing.
5. Only install libraries if absolutely required. Ask before adding a dep.
6. Never loop tool calls without making progress. If a tool fails, adjust and retry ONCE.
7. **Stage explicit paths.** Commit with `git add <files you created/edited this slice>`, never `git add -A` / `git add -u` / `git add .` — a broad add can sweep unrelated working-tree changes (e.g. pre-existing deletions) into your commit. One slice's commit should contain only that slice's files.

## Recovery from a previous failed cycle

If re-invoked after a failed review/verify, read the pasted rejection or test output first and address each concrete concern — don't restart from scratch unless the commits were structurally wrong. For the `git reset --soft` recovery when the commit order itself was wrong, see [`reference.md` § Recovery from a previous failed cycle](reference.md#recovery-from-a-previous-failed-cycle).

## Coding standards

See [`../_build_share/coding-standards.md`](../_build_share/coding-standards.md). Apply every rule. The review phase will check.

## Hand-off

When you're done with this cycle, your last user-facing message is one short paragraph:

- What landed (1 line).
- Branch name + latest SHA.
- Next step: `/mtdd-review @<task-file>`.

Do not summarise the diff. The user reads `git log` and `git diff` themselves.
