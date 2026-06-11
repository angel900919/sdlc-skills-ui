---
name: mtdd-review
description: |-
  Manual-TDD-loop review phase validator. Accepts a bd-tracked bead ID, a canonical chain ticket file, or a free-form task markdown file. Diffs the feature branch against the target branch and ticks every acceptance criterion against that diff. Emits a structured criteria evaluation block alongside a single COMPLETE or REJECT promise verdict. For beads, logs the verdict via bd note and updates ticked criteria via bd update --acceptance upon a COMPLETE verdict. Runs strictly through manual user execution. Use for "/mtdd-review", "manual tdd review", "review this branch", or after /mtdd-implement lands commits.
allowed-tools:
  - Read
  - Edit
  - Bash
  - Glob
  - Grep
---

# mtdd-review — manual TDD review phase

You are running the **review phase** of a manual TDD loop. The implement phase has landed commits on a feature branch; your job is to judge whether the diff actually delivers what the task asked for, criterion by criterion.

**Write scope.** You are primarily a judge — your output is a criteria verdict, not code. You may make **small refinements only**, capped at **3 files OR 50 lines total**, committed as `review:` (Step 6). Anything larger → do **not** edit; emit `REJECT` and let the next implement cycle land it. Never edit the task's acceptance-criteria checkboxes by hand here.

## OUTPUT CONTRACT (mandatory — read this first)

Your final output to the user MUST contain **two** structured blocks, in this order:

1. A `<criteria>` block listing every acceptance criterion from the task file with a per-criterion verdict (`[x]` if satisfied by the diff, `[ ]` if not).
2. **Exactly one** verdict tag on its own line:
   - `<promise>COMPLETE</promise>` — every criterion is `[x]` AND there are no other blocking concerns.
   - `<promise>REJECT</promise>` — at least one criterion is `[ ]`, OR you have a non-criterion blocking concern (security, intent mismatch, etc.).

**Hard rule: any `[ ]` in the `<criteria>` block → you MUST emit `REJECT`.** Partial completion is not an approval; criteria are commitments.

If the code is already perfect, your output may be as short as:

```
Reviewed. All acceptance criteria satisfied by the diff.

<criteria>
- [x] File src/foo.ts exists
- [x] Exports function foo(x: number): number
- [x] foo(2) returns 4
- [x] npm run typecheck passes
- [x] npm run test passes
</criteria>

<promise>COMPLETE</promise>
```

You MUST NOT write these blocks to a file, echo them via shell, or use any tool to "deliver" the verdict — type them as plain text in your reply.

## Inputs

- A task identifier — resolve its mode (free-form core, or the beads/canonical adapters) per [`../_build_share/task-sources.md`](../_build_share/task-sources.md). The bead's implement-phase note names the feature branch.
- The current git state — implement should have left you on the computed feature branch (`feature/<bead-id>--<slug>` in beads; `feature/<feature>-slice-<N>` in canonical; `feature/<slug>` in free-form) with commits ahead of the target branch.

If no task identifier was provided, ask the user.

## Procedure

### 1. Gather the context

**Resolve the task source and read the task** per [`../_build_share/task-sources.md` § Picking the source](../_build_share/task-sources.md#picking-the-source):

- Beads mode (arg has no `/`, doesn't end `.md`) → `bd show <bead-id> --json` (fall back to `bd show <bead-id>`).
- Canonical / free-form → read the task file end-to-end.

Extract:

- `target_branch` — **prefer the branch's stamp**: `git config branch.$(git rev-parse --abbrev-ref HEAD).mtdd-target` (set by `/mtdd-implement` at branch creation — the single source of truth for this branch). If empty, fall back to beads / canonical `target_branch:` OR free-form `## Target branch`, then `develop`. The diff range below depends on this being right.
- `skip_tests` — beads / canonical `tests == "skip-tests"` OR free-form `## Skip tests?: true`.
- `acceptance_criteria` — `## Acceptance criteria` body section (same shape across all three modes).
- **Beads / canonical:** `satisfies_f_ids`, `satisfies_user_stories`, `satisfies_nfrs`, `satisfies_unwanted` arrays and the `## Traceability` body section. These feed step 4.5 below.
- **Beads only:** `bead_id` = the argument; confirm `status: in_progress` (else error — implement should have claimed it).

Then, in order:

- `git rev-parse --abbrev-ref HEAD` — confirm you're on the feature branch the task implies.
- `git log <target_branch>..HEAD --oneline` — list the commits introduced on this branch.
- `git log <target_branch>..HEAD --reverse --oneline` — chronological order for the TDD spot-check.
- `git diff <target_branch>...HEAD` — the actual diff to review.

### 1.5. Brief yourself — classify and load enforcement packs

Before opening the diff, brief yourself on the rules you'll judge against.

**a) Classify.** Classification mirrors `/mtdd-implement` step 1.7a (same `typescript-style` / `python-style` / `react` / `architecture` buckets) so the review enforces what implement promised. If none bucket, say so in one line and skip to step 2. (Language default resolves as in implement: `.mtdd/config` `mtdd_language` → repo manifest → task `language:` — don't assume TypeScript.)

**b) Load.** Open ONLY the matching packs:

- `typescript-style` → [`../_build_share/ts-styleguide.md`](../_build_share/ts-styleguide.md)
- `python-style` → [`../_build_share/py-styleguide.md`](../_build_share/py-styleguide.md)
- `react` → [`../_build_share/react-rules.md`](../_build_share/react-rules.md) — only the sub-packs matching the task.
- `architecture` → [`../_build_share/architecture-rules.md`](../_build_share/architecture-rules.md)

**c) Brief.** Print a ≤20-bullet **enforcement** briefing under `## mtdd review briefing — <slice title>`:

```
## mtdd review briefing — <slice title>

### Rules I'll enforce
- <rule from a loaded pack> — what the diff must satisfy

### Pitfalls I'll flag
- <pitfall> — what would trigger a REJECT
```

**d) Pause.** End with:

```
Stop me here if any rule above is wrong for this task. Reply 'go' to proceed.
```

Wait for the user's `go` before opening the diff in step 2.

**Autonomous-mode bypass — read it from `.mtdd/cycle-state`, not a magic word.** The `/mtdd-cycle` orchestrator records the run mode in `.mtdd/cycle-state` (schema + read snippet in [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md)). At this pause, read that file and check `mtdd_cycle_mode=autonomous` **and** `mtdd_cycle_id` equals the identifier you were invoked with:

- **Confirmed autonomous (id matches)** → do **not** wait: print the briefing for the record, then proceed straight into step 2 as if the user had replied `go`.
- **No file, wrong mode, or id mismatch** → ordinary interactive run (a human invoking `/mtdd-review` directly never has a matching autonomous state): the pause is **mandatory** — wait for `go`.
- **Fail loud, never stall** → if your invocation says you are running under an autonomous `/mtdd-cycle` for this id but you cannot confirm it from `.mtdd/cycle-state` (file missing, unreadable, mode not autonomous, or id mismatch), do **not** wait: emit `<promise>REJECT</promise>` with the single concern "BLOCKED: cycle-state unreadable" so the orchestrator halts at its Gate B.

This bypass covers only this confirmation pause — it never softens the verdict: emit an honest `COMPLETE` or `REJECT` per the rubric.

Once briefed, **violations of these rules promote to REJECT only when blocking** — security, type-system holes (`any`, non-null assertion on user input, etc.), dependency-rule breaches, missing test coverage on a behavioural criterion. Style nits, naming, and other non-load-bearing findings appear as commentary above the `<criteria>` block but do not flip the verdict. Use Step 7's verdict mechanism, not the briefing, to fail a slice.

### 2. Verify each acceptance criterion

Open the task file's `## Acceptance criteria` checklist. For **each** criterion, walk the diff and decide whether it's satisfied. Base your tick on the diff content, not the bead title, commit messages, or vibes.

Criterion-type rubric:

- **Structural** ("File X exists", "Imports Y from Z") → `[x]` if you see it in the diff.
- **Signature** ("Exports `foo(x: number): number`") → `[x]` if the export and types match.
- **Behavioural / value** ("foo(2) returns 4") → `[x]` if the implementation logic produces the claimed result. Read the function body.
- **Edge case** ("foo(0) throws X", "empty input returns Y") → `[x]` only if explicitly handled. If silently mishandled, leave `[ ]`.
- **Test coverage** ("test file with at least 2 cases") → count cases in the diff.
- **Build gates** (the project's typecheck / test passing — e.g. `npm run typecheck` / `npm test`, `mypy .` / `pytest`) → `[x]` **optimistically** based on the diff (test files exist + look reasonable). The verify phase will actually run these one phase later and reject if they fail — you don't have to second-guess that gate.

The `<criteria>` block in your output MUST contain one line per criterion in the task file, **in the same order**, with your verdict. Do not add, drop, rename, or reorder criteria.

### 3. TDD-discipline gate (if `Skip tests?` is `false`)

Run the **authoritative structural gate** — not a trust-based spot-read. It's a git-only shell script (no Node), so it runs anywhere `git` does. From the repo root:

```sh
sh .claude/skills/_build_share/gates/tdd-check.sh <target_branch> HEAD
```

Map the exit code:

- **Exit 0** (`PASS: …`) → cycle order is fine; continue.
- **Exit 1** (`FAIL: …`, mis-ordered) → **hard REJECT**. Emit `<promise>REJECT</promise>` and paste the gate's reason verbatim into your concerns. Do not paper over it or re-judge by eye.
- **Exit 3** (`FAIL: No TDD cycle commits …`) → **hard REJECT** as well, unless `Skip tests?` is true (in which case this gate is skipped entirely — see the step heading). Paste the reason.
- **Exit 2** (`SETUP: …`, the gate could not run — e.g. `git` missing, bad ref) → the gate did **not** execute. Do **NOT** silently fall back to eyeballing. You MUST surface a visible warning line in your output:
  > ⚠️ TDD-order gate did NOT run (exit 2: `<the SETUP message>`). Verdict downgraded to a manual log inspection — treat with lower confidence and tell the user the gate could not run.
  Then read the chronological `git log` yourself against the three rules below and proceed, but keep that warning in the final output so the downgrade is never invisible.

The gate ships at `_build_share/gates/tdd-check.sh` (its commit-ordering rules live there). Since it needs only `git` + `sh`, exit 2 is genuinely rare — but when it happens, the loud-warning rule above is mandatory.

### 4. Quality / safety review

In addition to the per-criterion check, scan the diff for:

- Unsafe casts, `any` types, unchecked assumptions.
- Injection risks, credential leaks, other security issues.
- Tests that mock internal collaborators or assert on private state (TDD smell).
- Dead code, commented-out blocks, TODO markers.
- Unrelated changes that shouldn't be on this branch.

Any of these is a non-criterion blocking concern. If found, emit `<promise>REJECT</promise>` with a numbered list of concerns.

### 4.5. Traceability surface (beads + canonical; skip in free-form)

The acceptance-criteria tick covers the **immediate** contract. For canonical slices, the frontmatter also declares **upstream** traceability — what PRD F-IDs / user stories / NFRs / Unwanted-EARS clauses this slice is supposed to honor. Surface them as a short prose block above the `<criteria>` block:

```
Traceability declared by this slice:
- F-IDs: F-2, F-3
- NFRs: NFR-2
- Unwanted-EARS: U-1 (defense slice)
```

For each, **glance at the diff** and note whether the change appears to honor or weaken the declared satisfaction. This is a smell-check, not a strict gate: only emit `<promise>REJECT</promise>` if the diff visibly violates a declared NFR or Unwanted-EARS clause (e.g., the slice claims to satisfy NFR-2 latency ≤200ms but introduces a synchronous loop over an unbounded list). Routine cases pass through as commentary.

Skip this entire step in free-form mode — there's no upstream contract to verify against.

### 5. Design review — only for non-trivial changes

**If the diff touches ≥3 modules OR introduces a new module/class**, also do a design-level pass (deep modules / SOLID / cohesion & coupling / 4Cs), using the severity tiers and finding format in [`reference.md` § Design review](reference.md#design-review--for-non-trivial-changes). Design findings are commentary above the `<criteria>` block and do **NOT** auto-promote to REJECT — **except** a Blocker-tier finding (cyclic dep, runtime-breaking LSP violation, cross-boundary dependency inversion), which is a blocking concern and warrants REJECT.

Skip this step entirely on single-file edits, trivial helpers, or doc-only changes.

### 6. Optional: small refinements (size-capped)

If you find improvements within **3 files OR 50 lines total**:

- Make the edits directly on the feature branch.
- Re-run the project's typecheck (and tests unless `Skip tests?` is true) — `.mtdd/config` `mtdd_typecheck_cmd` / `mtdd_test_cmd` if set, else the project's commands (e.g. `npm run typecheck` / `npm test`, `mypy .` / `pytest`).
- Commit with the prefix `review: <description>` to distinguish from implement commits.

If the issues require larger changes than the cap, **do NOT edit**. List them in your output and emit `<promise>REJECT</promise>` so the next implement cycle picks them up.

### 7. Emit the verdict

Conclude your message with (in this order):

1. (Optional) Design-review findings, if any.
2. (If REJECT) A numbered list of concrete, actionable concerns. Vague rejection wastes the next cycle.
3. The `<criteria>` block — one line per criterion, in original order, ticked according to the diff.
4. Exactly one `<promise>COMPLETE</promise>` or `<promise>REJECT</promise>` on its own line.

**Beads-mode acceptance writeback (recommended on COMPLETE).** After emitting the verdict in chat, mirror the ticked list back to the bead:

```sh
bd update <bead-id> --acceptance "$(cat <<'EOF'
<the ticked criteria, one per line, exactly as in the <criteria> block>
EOF
)"
```

This keeps the bead's acceptance section in sync with the review. Skip in canonical / free-form modes — the criteria stay in chat; the merge phase copies them into `## Completion`.

### 8. Progress entry

Line shape (all modes):
```
- review: <COMPLETE | REJECT> — <one-line reason or "all criteria satisfied">
```

Where to write it (per [`../_build_share/task-sources.md`](../_build_share/task-sources.md) (your source's runtime mutations)):

- **Beads mode:** `bd note <bead-id> -- "<the line above>"`.
- **Canonical mode:** append to the task file's `## Status log`; create the section at the end of the file if missing.
- **Free-form mode:** append to the existing `## Status log`.

## Hand-off

After emitting the verdict:

- If **COMPLETE**: tell the user "review approved — run `/mtdd-verify @<task-file>` next."
- If **REJECT**: tell the user "review rejected — re-run `/mtdd-implement @<task-file>` and paste this review's bullets so the next cycle addresses them."

Do not implement the rejection yourself — the implement phase owns that.

## Coding standards & AI-code audit

Judge the diff against two packs:

1. **Write-time standards** — [`../_build_share/coding-standards.md`](../_build_share/coding-standards.md). The same rules implement coded against; flag violations.
2. **Review-time AI-code audit** — [`../_build_share/ai-code-audit.md`](../_build_share/ai-code-audit.md). Walk it explicitly: (1) Context Gap — list every deleted line and classify side effects; (2) Phantom Dependencies — verify unfamiliar imports against npm / PyPI; (3) Over-Engineering — apply YAGNI to new abstractions; (4) Test Theater — run the mutation check on at least one business-logic line; (5) Risk matrix — score Security / Ethics / Reliability. Apply the compounding rule and the audit verdict before emitting your own `COMPLETE` / `REJECT`.
