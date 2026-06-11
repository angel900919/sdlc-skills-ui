---
name: mtdd-cycle
description: |-
  Autonomous orchestrator for the manual-TDD cycle — runs mtdd-implement, then mtdd-review, then mtdd-verify on one task hands-free, each phase in its own fresh sub-agent for context isolation, resuming mid-cycle on a re-run. Accepts a bd bead ID, a canonical chain ticket file (tickets/feature/SLICE-N-slug.md), or a free-form task file (tasks/slug.md). Halts and reports on a review REJECT, an implement blocker, or a verify failure; stops after verify so the human runs the manual smoke checklist before merging. Use for "/mtdd-cycle", "run the mtdd implement-review-verify cycle", "auto-run the manual TDD loop", or when a bead ID or task file should go through implement, review, and verify hands-free. Do NOT use to merge (that is /mtdd-merge) or to run a single phase (use /mtdd-implement, /mtdd-review, or /mtdd-verify directly).
allowed-tools:
  - Agent
  - Read
  - Write
---

<what-to-do>

You are the **orchestrator** of the manual-TDD implement → review → verify cycle for **one** task. You do not write code, read diffs, or run tests yourself. You drive three phases, each in its **own fresh sub-agent**, and you decide whether to proceed at each boundary.

Copy this checklist and tick as you go:

```
mtdd cycle progress:
- [ ] Step 0: Capture identifier; resume-or-create .mtdd/cycle-state (mode=autonomous); confirm target branch
- [ ] Step 1: IMPLEMENT sub-agent → expect DONE + branch + SHA
- [ ] Gate A: DONE → record branch, set phase=review; BLOCKED → phase=halted + report
- [ ] Step 2: REVIEW sub-agent → expect a COMPLETE or REJECT verdict
- [ ] Gate B: COMPLETE → phase=verify; REJECT → phase=halted + report (do NOT verify)
- [ ] Step 3: VERIFY sub-agent → expect PASS/FAIL + smoke checklist
- [ ] Step 4: PASS → phase=done + surface smoke; FAIL → phase=halted; STOP (no merge)
```

The `.mtdd/cycle-state` file **is** this state machine — schema, run-mode read, and
transition table in [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md).
You are its **sole writer**; the phase sub-agents only read it.

### Step 0 — Capture the identifier, resume-or-create the cycle state, confirm the target branch

**Identifier.** Read the task identifier from the invocation (a bead ID, a `tickets/<feature>/SLICE-N-<slug>.md` file, or a `tasks/<slug>.md` file). **Do not detect its mode or read the task file** — the phase skills do that. If no identifier was given, ask the user for one; do not invent it from context. Call this value `IDENTIFIER` below.

**Resume-or-create `.mtdd/cycle-state`.** Read `.mtdd/cycle-state` (it may not exist). Follow the schema + transition + resume tables in [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md) — you are its **sole writer**.

- **No file** → this is a fresh cycle. Continue to the target-branch step; you write the file at the end of Step 0.
- **File exists and `mtdd_cycle_id` matches `IDENTIFIER`** → **resume.** Read `mtdd_cycle_phase` and jump per the resume table: `implement` → re-run Step 1; `review` → skip to Step 2 using the recorded `mtdd_cycle_branch` as `BRANCH`; `verify` → skip to Step 3 with that `BRANCH`; `done` → tell the user this cycle already finished (next is the manual smoke + `/mtdd-merge`) and stop; `halted` → a human has presumably fixed the cause, so restart at Step 1 (rewrite `phase=implement`). Skip the target-branch question on resume — it was settled on the first run.
- **File exists but `mtdd_cycle_id` does NOT match `IDENTIFIER`** → a *different* task's cycle is in flight. **Refuse**: tell the user `.mtdd/cycle-state` belongs to `<that id>` (phase `<phase>`) and to finish or delete it before starting a new cycle. Do not clobber it.

**Target branch — confirm once, here.** This is the **only** human touchpoint before the cycle goes hands-free: the implement sub-agent runs autonomously and will **not** pause to confirm a branch later, so the branch must be settled now. Resolve `TARGET`:

- If the invocation already names a target branch (e.g. "target `main`", "merge into `staging`"), use it — no question needed.
- Otherwise ask the user **one** plain question and wait for the answer: *"Which branch should this cycle build from and merge into? (commonly `develop` or `main`)"*. Do not guess it, and do not read the task file to find it — the user knows their repo.

Call the answer `TARGET`. You pass it into the IMPLEMENT prompt below; implement stamps it on the feature branch (`git config branch.<x>.mtdd-target`) and review/verify/merge read it back, so every phase and the TDD-order hook agree on one branch.

**Write the initial cycle state** (fresh cycle only — on resume the file already exists). Create `.mtdd/cycle-state` with the **Write** tool, in the `key=value` format from [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md):

```
# .mtdd/cycle-state — written by /mtdd-cycle. Runtime, git-ignored.
mtdd_cycle_id=<IDENTIFIER>
mtdd_cycle_branch=
mtdd_cycle_phase=implement
mtdd_cycle_mode=autonomous
mtdd_cycle_last_verdict=
```

This file — not a magic word in the prompt — is what tells each phase it's running autonomously. If `.mtdd/cycle-state` is not git-ignored yet (a repo where `/mtdd-init` never ran), say so in one line; it's runtime state that should not be committed.

### Step 1 — Spawn the IMPLEMENT sub-agent

Spawn **one** sub-agent (`subagent_type: "general-purpose"`; no `model` override — inherit the session model) with the **Implement prompt** from `<supporting-info>`. Wait for it to finish. Its final message is your only window into the phase — do not re-derive it.

### Gate A — after implement

- Report says **DONE** with a branch + SHA → record `BRANCH`, **rewrite `.mtdd/cycle-state`** with `mtdd_cycle_branch=<BRANCH>`, `mtdd_cycle_phase=review`, `mtdd_cycle_last_verdict=DONE`, and continue to Step 2.
- Report says **BLOCKED** (a real refusal or blocker — including `BLOCKED: cycle-state unreadable`, the fail-loud signal that the state file was missing or garbled in the spawn — not a confirmation pause) → **rewrite `.mtdd/cycle-state`** with `mtdd_cycle_phase=halted`, `mtdd_cycle_last_verdict=BLOCKED`, then **halt the cycle.** Surface the blocker reason verbatim and tell the user how to resolve it, then stop. Do not spawn review.

### Step 2 — Spawn the REVIEW sub-agent

Spawn a **fresh** sub-agent (`general-purpose`; no `model` override — inherit the session model) with the **Review prompt**, passing `IDENTIFIER` and `BRANCH`. Wait. Read the `<promise>` verdict from its report.

### Gate B — after review

- Verdict is **COMPLETE** → **rewrite `.mtdd/cycle-state`** with `mtdd_cycle_phase=verify`, `mtdd_cycle_last_verdict=COMPLETE`, and continue to Step 3.
- Verdict is **REJECT** → **rewrite `.mtdd/cycle-state`** with `mtdd_cycle_phase=halted`, `mtdd_cycle_last_verdict=REJECT`, then **halt the cycle.** Do **NOT** spawn verify — a rejected diff must not be verified or merged. Surface the reviewer's `<criteria>` block and its numbered concerns verbatim, then tell the user: *"Review rejected — re-run `/mtdd-implement IDENTIFIER` with these bullets, then re-run `/mtdd-cycle IDENTIFIER` to resume."* Stop.

### Step 3 — Spawn the VERIFY sub-agent

Spawn a **fresh** sub-agent (`general-purpose`; no `model` override — inherit the session model) with the **Verify prompt**, passing `IDENTIFIER` and `BRANCH`. Wait for its report.

### Step 4 — Surface and STOP

This is the end of the cycle — there is **no merge phase here** (that is `/mtdd-merge`, run by the human after manual smoke).

- **Finalize `.mtdd/cycle-state`**: on a **PASS**, rewrite it with `mtdd_cycle_phase=done`, `mtdd_cycle_last_verdict=PASS`; on a **FAIL**, rewrite it with `mtdd_cycle_phase=halted`, `mtdd_cycle_last_verdict=FAIL`.
- Print a compact cycle summary: branch, what landed, review verdict, verify result.
- Then surface the verify sub-agent's output **verbatim** — especially the `## Manual smoke — slice N` checklist (or its one-line "no observable surface" note). This is the whole reason the cycle stops at verify: the human runs that checklist by hand.
- If verify **PASSED**: next step is *"run the smoke list above, then `/mtdd-merge IDENTIFIER`."* (The state now reads `phase=done` — re-running `/mtdd-cycle IDENTIFIER` will report the cycle is already complete rather than redo it.)
- If verify **FAILED**: surface which gate failed and tell the user *"re-run `/mtdd-implement IDENTIFIER` to fix, then re-run `/mtdd-cycle IDENTIFIER` to resume."*

</what-to-do>

<supporting-info>

## Hard rules for the orchestrator

- **Sequential only.** Spawn one sub-agent, wait, read its report, decide, then spawn the next. Never in parallel — review needs implement's branch on disk; verify needs review's COMPLETE. The fresh sub-agent per phase *is* the context isolation (no literal `/clear` — you can't run it, and it would erase these instructions).
- **Stay lean.** Do not read the task file, run `git diff`, read source, or run tests in the main thread. The **only** file you read or write is `.mtdd/cycle-state` — a handful of `key=value` lines. The branch state and git history persist on the shared working tree, so each sub-agent picks up where the last left off. Your context holds only `IDENTIFIER`, `BRANCH`, and each sub-agent's short report.
- **"Accept by default" = auto-go, not force-pass.** Each phase skips its *"reply go"* briefing pause because it reads `mtdd_cycle_mode=autonomous` (id-matched) from the state file you wrote — not because you force anything. You do **not** force a COMPLETE review verdict or paper over a verify failure — those gates stay honest.
- **Honor genuine stops.** A confirmation pause is auto-continued; a real refusal/blocker/REJECT/test-failure halts the cycle and is reported.

## Phase sub-agent prompts

Substitute `IDENTIFIER`, `BRANCH`, and `TARGET` before spawning. Each prompt invokes the matching phase skill by name; the file fallback is the project-root-relative path if the skill is not discoverable in the sub-agent.

**The run mode lives in `.mtdd/cycle-state`, not in a magic word.** `mtdd-implement` (step 1.7d) and `mtdd-review` (step 1.5d) decide whether to skip their "Reply 'go'" pause by reading `.mtdd/cycle-state` and confirming `mtdd_cycle_mode=autonomous` **and** `mtdd_cycle_id=IDENTIFIER` (the id-match defends against a stale file auto-proceeding an unrelated human run). The prompt below just *points each phase at the file and names the id*; the deterministic, validated read in [`../_build_share/cycle-state.md`](../_build_share/cycle-state.md) is what trips the bypass. **Fail-loud, not stall:** if a phase is told it's autonomous but cannot confirm that from the file (missing / unreadable / mode wrong / id mismatch), it reports `BLOCKED: cycle-state unreadable` — which you catch at Gate A — instead of waiting forever for a `go`.

### Implement prompt

```
Run the IMPLEMENT phase of the manual TDD loop on this task: IDENTIFIER
Target branch: TARGET — cut the feature branch from it and use it as target_branch
(the skill's resolution case 1, "provided by the orchestrator"): do NOT re-detect
it, do NOT ask, do NOT fall back to develop. Stamp it on the branch as the skill says.

You are running under an AUTONOMOUS /mtdd-cycle for this task. The cycle state is
recorded in .mtdd/cycle-state (mtdd_cycle_mode=autonomous, mtdd_cycle_id=IDENTIFIER).

Use the Skill tool to invoke the skill named "mtdd-implement" with IDENTIFIER as
its argument, and follow it through to its hand-off. If that skill is not
available, read .claude/skills/mtdd-implement/SKILL.md and follow it exactly.

AUTONOMY — you have NO interactive user. At the skill's step-1.7(d) confirmation
pause, read .mtdd/cycle-state and confirm mtdd_cycle_mode=autonomous AND
mtdd_cycle_id=IDENTIFIER; that trips the skill's own autonomous-mode bypass, so the
briefing pause does not fire:
- Print the briefing for the record, then proceed straight into branch setup and
  coding as if the user had replied "go". The "Reply 'go'" line is NOT a handback
  point — never end your turn or return to your caller there.
- Never ask the user a question. Take the reasonable default the skill describes.
- FAIL LOUD, do not stall: if you cannot confirm autonomous mode for this id from
  .mtdd/cycle-state (file missing, unreadable, wrong mode, or id mismatch), do NOT
  wait for a human "go" — report STATUS: BLOCKED, reason "cycle-state unreadable".

GENUINE STOPS STILL APPLY — if the skill hits a real refusal or blocker (bead
closed / claimed / blocked / afk-labeled; a dirty working tree you must not
clobber; a vague acceptance criterion that needs rewriting; a file-boundary
violation; or any stop condition that is NOT merely a confirmation pause), STOP
and report it — do not work around it.

REPORT BACK as plain text (no diff dump):
- STATUS: DONE or BLOCKED
- BRANCH: the feature branch name
- SHA: latest commit SHA
- If DONE: one line on what landed and that all acceptance criteria appear satisfied.
- If BLOCKED: the exact blocker / refusal reason and what the human must do.
```

### Review prompt

```
Run the REVIEW phase of the manual TDD loop on this task: IDENTIFIER
You should already be on branch BRANCH — confirm with `git rev-parse --abbrev-ref HEAD`.

You are running under an AUTONOMOUS /mtdd-cycle for this task. The cycle state is
recorded in .mtdd/cycle-state (mtdd_cycle_mode=autonomous, mtdd_cycle_id=IDENTIFIER).

Use the Skill tool to invoke "mtdd-review" with IDENTIFIER. If unavailable, read
.claude/skills/mtdd-review/SKILL.md and follow it exactly.

AUTONOMY — you have NO interactive user. At the skill's step-1.5(d) confirmation
pause, read .mtdd/cycle-state and confirm mtdd_cycle_mode=autonomous AND
mtdd_cycle_id=IDENTIFIER; that trips the skill's own autonomous-mode bypass, so the
briefing pause does not fire:
- Print the briefing for the record, then proceed straight into the diff review
  as if the user had replied "go". The "Reply 'go'" line is NOT a handback point
  — never end your turn or return to your caller there.
- Never ask the user anything.
- FAIL LOUD, do not stall: if you cannot confirm autonomous mode for this id from
  .mtdd/cycle-state (file missing, unreadable, wrong mode, or id mismatch), do NOT
  wait for a human "go" — emit <promise>REJECT</promise> with the single concern
  "BLOCKED: cycle-state unreadable" so the orchestrator halts.

Your verdict MUST be honest — judge the diff per the skill's rubric. Do NOT force
COMPLETE. A genuine REJECT is the correct output when criteria are unmet or a
blocking concern exists.

REPORT BACK as plain text:
- The full <criteria> block, verbatim.
- The single verdict tag, verbatim: <promise>COMPLETE</promise> OR <promise>REJECT</promise>.
- If REJECT: the numbered list of concrete, actionable concerns the skill produced.
```

### Verify prompt

```
Run the VERIFY phase of the manual TDD loop on this task: IDENTIFIER
You should be on branch BRANCH — confirm with `git rev-parse --abbrev-ref HEAD`.

Use the Skill tool to invoke "mtdd-verify" with IDENTIFIER. If unavailable, read
.claude/skills/mtdd-verify/SKILL.md and follow it exactly.

Do not ask the user anything. Run typecheck and tests per the skill (it skips
tests only when the task declares skip-tests).

REPORT BACK as plain text:
- RESULT: PASS or FAIL
- If FAIL: which gate (typecheck / tests) and a one-line summary of the first error.
- If PASS: the full "## Manual smoke — slice N" checklist VERBATIM (or the
  one-line "no observable surface" note if that is what the skill produced).
```

## Why each report shape matters & common errors

The rationale behind each phase's report shape, plus a troubleshooting guide for the recurring failure modes (a `BLOCKED: cycle-state unreadable` fail-loud at Gate A, skill not found, review emitted no `<promise>` tag, verify ran on a rejected diff, tempted-to-merge), lives in [`reference.md`](reference.md). Consult it when a sub-agent misbehaves.

## Scope

This orchestrator is the autonomous counterpart to manually running `/mtdd-implement`, `/mtdd-review`, `/mtdd-verify` in sequence with `/clear` between each. It does not replace the per-phase skills' own logic — it invokes them. For merge, use `/mtdd-merge`. For a single phase, call that phase's skill directly.

</supporting-info>
