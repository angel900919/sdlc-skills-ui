---
name: diagnose
disable-model-invocation: true
description: |-
  Disciplined root-cause analysis for hard bugs, flaky tests, and performance regressions via a strict reproduce, hypothesise, instrument, fix-with-regression-test loop. The system's defect entry point and the one skill with near-zero preconditions — it runs on just a symptom and a repo, grounding mental models in .ai/context.md and nearby ADRs when present (never blocking on them). Insists on a deterministic feedback loop and rejects guess-and-check. Fixes trivial local bugs inline; hands larger ones forward as a repro-bearing task. Reached standalone or routed from /qa, /health-audit, /as-built, and the build loop. Use for "/diagnose", "debug this", "find the root cause", "flaky build", or "performance regression". Do NOT use for codebase exploration (use /research or /explore), or for optimizing healthy code (use /improve-codebase-architecture).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# diagnose — disciplined root-cause analysis

A discipline for hard bugs, flaky tests, and performance regressions. The product of
this skill is an **understood, minimised, reproducible failure** — plus a regression
test where a correct seam exists, and either a trivial inline fix or a repro-bearing
task handed forward. Skip phases only when you can explicitly justify it.

<what-to-do>

Copy this checklist and tick as you go:

```
diagnose progress:
- [ ] Phase 0: Ground the symptom + scope (near-zero preconditions)
- [ ] Phase 1: Build a deterministic feedback loop  ← THE skill
- [ ] Phase 2: Reproduce — watch the real bug appear
- [ ] Phase 3: Hypothesise — 3–5 ranked, falsifiable
- [ ] Phase 4: Instrument — one variable at a time, tagged logs
- [ ] Phase 5: Fix + regression test (test-first if a correct seam exists)
- [ ] Phase 6: Cleanup + post-mortem
- [ ] Hand-off: emit a verdict (FIXED-INLINE / ROUTED-AS-BUG / NO-SEAM / BLOCKED-NO-REPRO)
```

### Phase 0 — Ground the symptom and scope

`/diagnose` is the **opposite of every other skill**: it has near-zero preconditions
and must run on just a symptom + a repo (bugs predate `.ai/`). Do not block on missing
upstream artifacts.

1. **Capture the symptom precisely** — the exact error, wrong output, or slow timing,
   in the reporter's words. If you were **routed from a caller**, that caller named the
   symptom: a failing check in `.ai/specs/<feature>/qa-report.md` (`/qa`), an `H-NNN`
   finding in `.ai/health-report.md` (`/health-audit`), a drift in an as-built map
   (`/as-built`), or a failing slice (the build loop). Read that one item — it is your
   starting symptom.
2. **Ground the mental model — if the files exist.** If `.ai/runbooks/<feature>.md`
   exists for the symptomatic feature, read it FIRST — its alert/symptom table, known
   weak spots, and rollback procedure are pre-compiled hypotheses and mitigations;
   start the Phase 3 ranking from its rows instead of from scratch. Then skim
   `.ai/context.md` (domain glossary + entities) and any ADRs near the code you'll
   touch, to get the vocabulary and the decisions already made. **If they're absent,
   note it in one line and proceed** — never block, never create them.
3. **Detect the mode** (drives the hand-off in `<supporting-info>`): is this a **chain
   repo** (an `.ai/` tree exists) or a **bare repo** (standalone)? Tier is advisory
   here — a bug is a bug; at most it lightens the Phase 6 post-mortem.

### Phase 1 — Build a feedback loop  ← this is the skill

**Everything else is mechanical.** Given a fast, deterministic, agent-runnable
pass/fail signal for the bug, you will find the cause — bisection, hypothesis-testing,
and instrumentation all just consume that signal. Without one, no amount of staring at
code will save you. Spend disproportionate effort here. **Be aggressive, be creative,
refuse to give up.**

The full construction menu (ten loop types in priority order), how to iterate on the
loop, the non-deterministic-bug tactics, and the perf measure-first branch live in
[`references/feedback-loops.md`](references/feedback-loops.md). Pick the cheapest loop
that reaches the real bug; then make it faster, sharper, and more deterministic. **Do
not proceed to Phase 2 until you have a loop you believe in.** If you genuinely cannot
build one, stop and emit `BLOCKED-NO-REPRO` (see Hand-off).

### Phase 2 — Reproduce

Run the loop. Watch the bug appear. Confirm, before going further:

- [ ] The loop produces the **failure the reporter described** — not a different one
  nearby (wrong bug = wrong fix).
- [ ] It reproduces across runs (or, for flaky bugs, at a high-enough rate to debug
  against — raise the rate until it is).
- [ ] You captured the exact symptom (message / wrong value / timing) so Phase 5 can
  prove the fix addresses it.

### Phase 3 — Hypothesise

Generate **3–5 ranked hypotheses before testing any** (single-hypothesis generation
anchors on the first plausible idea). Each must be **falsifiable** — state the
prediction: *"If X is the cause, changing Y makes the bug disappear / changing Z makes
it worse."* If you can't state the prediction, it's a vibe — sharpen or discard it.

**Show the ranked list to the user before testing** — they often re-rank instantly
("we just shipped a change to #3"). Cheap checkpoint; don't block on it if they're AFK,
proceed with your ranking. (Plain-English questioning per
[`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions);
the audience here is usually technical, so the real choices are fair game.)

### Phase 4 — Instrument

Each probe maps to a specific Phase-3 prediction. **Change one variable at a time.**

1. **Debugger / REPL** if the env supports it — one breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses. Never "log
   everything and grep".
3. **Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`, so Phase 6
   cleanup is one `grep`. Untagged logs survive by accident; tagged logs die on purpose.

For **performance** regressions, logs are usually wrong — measure first (timing
harness / profiler / query plan), establish a baseline, then bisect. See the perf
branch in [`references/feedback-loops.md`](references/feedback-loops.md).

### Phase 5 — Fix + regression test

Write the regression test **before the fix** — but only if a **correct seam** exists.
A correct seam exercises the **real bug pattern at the call site**; a too-shallow seam
(a unit test that can't replicate the chain that triggered the bug) gives false
confidence.

- **Correct seam exists:** turn the minimised repro into a failing test at that seam →
  watch it fail → apply the fix → watch it pass → re-run the Phase 1 loop against the
  original (un-minimised) scenario.
- **No correct seam exists — that itself is the finding.** The architecture is
  preventing the bug from being locked down. Do not fake a shallow test; record it and
  carry it into the verdict as `NO-SEAM`.

**Bug discipline is non-negotiable:** `/diagnose` never lands a fix without a
reproducing test — inline, the failing test is the opening commit; handed-forward, the
repro is acceptance criterion #1. (See the write boundary in `<supporting-info>`.)

**Circuit breaker — three failed fixes = wrong architecture, not a wrong
hypothesis.** Count your fix attempts. One fix that didn't survive the loop →
return to Phase 3 with the new evidence. Two → fine, hypotheses die; that's the
method. **Three or more — STOP. Do not attempt fix #4.** The telltale pattern:
each fix reveals new coupling or shared state somewhere else, each fix needs
"just a bit of refactoring" to land, each fix moves the symptom instead of
killing it. That is not a diagnosis problem — the architecture is resisting the
fix. Name the pattern to the user and route the structural finding to
`/improve-codebase-architecture` **now**, not at the Phase 6 post-mortem.

### Phase 6 — Cleanup + post-mortem

Required before declaring done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop).
- [ ] Regression test passes (or the absence of a seam is documented).
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix).
- [ ] Throwaway harnesses deleted (or moved to a clearly-marked debug location).
- [ ] The hypothesis that proved correct is stated in the commit / hand-off — so the
  next debugger learns.

**Then ask: what would have prevented this bug?** If the answer is architectural (no
good seam, tangled callers, hidden coupling), hand the specifics to
`/improve-codebase-architecture` — it turns the friction into a designed, routed deepening.
Make this call **after** the fix is decided — you know more now than at the start.

### Hand-off

Choose the path by fix size and mode, then emit exactly one verdict. For a **P0 defect
in shipped code** (chain repo, mvp+), also offer the expedited hotfix route — see the
source-aware hand-forward. The full contract (write boundary, source-aware routing,
caller-return, progress breadcrumb) is in `<supporting-info>`.

</what-to-do>

<supporting-info>

## Critical rules

- **Hand off an artifact, not a skill call.** `/diagnose` produces a repro + test + (maybe)
  a fix or a task. It names `/to-issues` only (the chain adapter); the TDD/execute loop
  is referenced by capability, never by a hard skill dependency.
- **No `.ai/` artifact.** Like `/build` and `/ship`, `/diagnose` writes no new `.ai/`
  file — output is code (fix + test) and/or a routed task, plus an optional tracker line.

<!-- Behavioral guardrails below adapted from obra/superpowers (MIT), systematic-debugging. -->

## Red flags — STOP, the rationalization is pre-refuted, return to the named phase

Catch yourself thinking any of these and you have left the discipline:

| Rationalization | Reality | Go to |
|---|---|---|
| *"It's probably X, let me just fix that"* / proposing a fix before a loop exists / "I can see the problem from here" | Seeing a symptom ≠ understanding the cause; state the falsifiable prediction first. | **Phase 1** |
| *"Quick fix now, investigate later"* / "emergency — no time for the loop" | Guess-and-check thrashing is the slow path; the loop is the shortcut, especially under pressure. | **Phase 1** |
| *"Just try this first, then investigate"* | The first fix sets the pattern for the session. Do it right from attempt #1. | **Phase 1** |
| *"Skip the repro, I'll verify the fix manually"* | No loop = no proof. | **Phase 1** |
| *"Change a few things and re-run"* / "several fixes at once saves round-trips" | You can't isolate what worked, and you've created new unknowns. | **Phase 4**, one variable |
| *"I don't fully understand it, but this might work"* | A hypothesis you can't state a prediction for is a vibe — say so out loud, then sharpen it. | **Phase 3** |
| *"I'll write the regression test after the fix is confirmed"* | Untested fixes regress; failing-first is the proof the test guards anything. | **Phase 5** |
| *"One more fix attempt"* when two have already failed | 3+ failures is an architecture signal. Route it; don't fix it again. | **circuit breaker** (Phase 5) |
| The user says *"stop guessing"*, *"is that not happening?"*, or sounds frustrated that you're cycling | They are telling you you've skipped a phase. | **Phase 1** |

## Write boundary (the two tiers)

| Tier | Condition | Action | Verdict |
|---|---|---|---|
| **Trivial + local** | within one module / small file count · single repro seam · no API/schema/contract change | fix **inline** — Phase 5 already wrote the test first; re-run the loop to confirm green | `FIXED-INLINE` |
| **Non-trivial / cross-module** | anything larger, spans modules, or needs review | **hand forward** (below) — do not sprawl the fix here | `ROUTED-AS-BUG` |

## Source-aware hand-forward

The minimised repro travels as the **first behaviour** of the handed-forward work, so
whoever implements it lands it as the opening `red:` that proves the bug.

- **Bare repo (standalone, no `.ai/`)** → write a free-form `tasks/<slug>.md` from
  [`../_build_share/task-template.md`](../_build_share/task-template.md), with the repro
  as **acceptance criterion #1**. Tell the user to run it through their TDD/execute loop
  (e.g. `/mtdd-implement tasks/<slug>.md` if they use MTDD — an example, not a
  requirement). Emit `ROUTED-AS-BUG`.
- **Chain repo (`.ai/` present)** → route a `category: bug` slice via
  [`/to-issues`](../to-issues/SKILL.md), repro as the first acceptance criterion, with
  the usual traceability. Emit `ROUTED-AS-BUG`.
- **P0 defect in SHIPPED code (chain repo, mvp+)** → offer the **expedited hotfix
  route** per `anchor.release_policy.hotfix_path` (read it from `.ai/anchor.md`; absent
  → recommend defining it via an `/anchor` update-mode run): branch from the production
  ref and land the fix there instead of queueing behind the full chain. The discipline
  does not relax — **the regression test is non-negotiable even on the hotfix path**,
  review and verify still run, and the chain artifacts (the `category: bug` issue file +
  the `qa-report.md` note) are **backfilled after, not skipped**. Verdict stays
  `FIXED-INLINE` or `ROUTED-AS-BUG` per the write boundary.
- **No correct test seam** (Phase 5) → still route the fix as above, **and** hand the
  architectural finding to `/improve-codebase-architecture` (its `NO-SEAM` caller-return).
  Emit `NO-SEAM`.

## Caller-return (when routed, not standalone)

- **From `/qa`** → return the root cause in one line for the re-run.
- **From `/health-audit`** → name the resolved `H-NNN` so the audit can be re-graded.
- **From the build loop** → the repro + fix/route unblocks the slice.
- **From `/triage`** → the diagnosis flips a non-chain bug from needs-info to ready (or routes a `category: bug` task).

## Verdicts (advisory outcome labels)

These describe how the diagnosis **turned out** — they do not route to a fixed next
skill the way the chain's `READY-FOR-X` tokens do. Emit exactly one as the last line:

| Verdict | Meaning |
|---|---|
| `FIXED-INLINE` | trivial + local fix landed here; regression test green; original repro gone |
| `ROUTED-AS-BUG` | non-trivial — handed forward as a free-form task (bare repo) or a `category: bug` slice via `/to-issues` (chain), repro = criterion #1 |
| `NO-SEAM` | root cause found and routed, but no correct regression seam exists — architectural finding handed to `/improve-codebase-architecture` |
| `BLOCKED-NO-REPRO` | could not build a believable feedback loop — list what you tried and ask the user for an env, a captured artifact, or instrumentation permission |

## Progress breadcrumb (chain only)

If — and only if — `.ai/progress-tracker.md` exists (chain repos do; a bare repo
usually doesn't) and this run crystallised a non-obvious fact about the system (a hidden
invariant, a surprising coupling), append one line per
[`../_shared/conventions.md` § Progress tracker](../_shared/conventions.md#progress-tracker).
No `.ai/`, no breadcrumb — the fix + routed task is the record. Never create `.ai/` just
to log one.

</supporting-info>
