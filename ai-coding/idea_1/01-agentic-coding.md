# Agentic Coding: The Consolidated Guide

> Synthesized from the 23 talk/note sets in `AI_CODING/Agentic-Coding/` (Boris Cherny, Matt Pocock, swyx, Jake Nations, Dexter Horthy, Kitze, Michael Arnaldi, Sarah Chieng, Eric Zakariasson, Chris Parsons, Michal Cichra, Erik Hanchett, and others), reconciled against current (July 2026) guidance: the living Claude Code best-practices docs at code.claude.com, Anthropic's engineering posts through March 2026, and the 2025–26 spec-driven and Ralph-loop literature. Where the notes and current guidance conflict, current guidance wins — changes are flagged inline and collected near the end.

---

## 1. The mindset shift: generation is free, understanding is not

Every strong talk in this folder lands on the same inversion. AI made *typing code* essentially free, but the hard part of software was never typing — it was understanding, deciding, and verifying (Jake Nations, Netflix: "generation now outruns comprehension"). Token costs fall 100–1000x per year while the cost of *refuting* bad output stays human-priced, so unreviewed output is a debt factory (swyx: "no autonomy without accountability").

The senior engineer's job therefore shifts from writing code to building the **harness** around a stateless, amnesiac, very fast worker:

- **You architect in prose**; the agent types — the "vibe engineering" stance Kitze presented (Simon Willison coined the term in Oct 2025; by his Feb 2026 follow-up it had settled as **agentic engineering**).
- **The repo is the prompt.** A navigable, consistent, "in-distribution" codebase — code that looks like what the model saw in training: conventional, modular, boring — makes every agent smarter; a tangled one makes every agent dumber (Zakariasson, Pocock: "bad codebases make bad agents").
- **Quality is capped by feedback loops**, not model IQ. The agent can only be as good as the checks it can run against its own work.

Everything below is implementation detail for those three sentences.

---

## 2. The core daily workflow: Explore → Plan → Code → Commit

This is the canonical interactive loop from Anthropic's guidance, unchanged in shape since 2025 but with better machinery now.

**Step by step:**

1. **Explore (plan mode).** Enter plan mode (`Shift+Tab`) so Claude reads code without editing. Ask it to investigate the relevant area, or say *"use subagents to investigate X"* so exploration burns a separate context window and only findings return (Pocock measured an explore subagent using ~94k tokens while his main session stayed at ~25k).
2. **Plan.** Ask for an implementation plan. Press `Ctrl+G` to open and *edit the plan in your editor* — the human edit is the review gate, not the approval click.
3. **Code with a target.** Exit plan mode and implement — but always give a verifiable target: a failing test, a build command, a screenshot to match. *"Write a validateEmail function; test cases: user@example.com → true, invalid → false; run the tests after implementing"* beats *"implement email validation."*
4. **Commit + PR.** Descriptive message; let Claude write it from the diff.

**Calibration rules (current docs):**

- **Skip planning for small tasks.** "If you could describe the diff in one sentence, skip the plan." Plan mode is for uncertain approaches, multi-file changes, unfamiliar code.
- **Context is the binding constraint.** `/clear` between unrelated tasks; prefer clearing over compacting (Pocock's "Memento" model: externalize state to files, issues, commits, then reset). After two failed corrections, `/clear` and rewrite the prompt with what you learned — don't argue with a polluted context.
- **Course-correct early.** `Esc` interrupts with context preserved; `Esc Esc`/`/rewind` restores checkpoints. Interrupting is steering, not failure.

**For bigger features, front-load alignment.** Pocock's "grill-me" pattern and the official interview-to-spec prompt are the same idea — make the agent extract your intent before it plans:

> *"I want to build [X]. Interview me in detail using the AskUserQuestion tool. Ask about technical implementation, UI/UX, edge cases, concerns, and tradeoffs. Don't ask obvious questions — dig into the hard parts I might not have considered. Then write a complete spec to SPEC.md."*

Then implement in a **fresh session** from the spec.

---

## 3. Files over sessions: externalize every kind of memory

The folder's most-repeated insight (Victor Savkin of Nx: agents are a "genius with amnesia"; Sarah Chieng's four-file system; Adrian Hajdin's context folder; every Ralph variant — the fresh-context loop pattern covered in §6): **anything that must survive a session must live in the repo.** Sessions die, compact, and drift; files are versioned, reviewable, and shared between humans and agents.

The convergent minimum set:

| File | Purpose | Notes |
|---|---|---|
| `CLAUDE.md` | Standing rules loaded every session | Keep **under ~200 lines**; for each line ask "would removing this cause mistakes?" Bloat makes Claude ignore all of it. |
| A plan/spec file per unit of work | What we're building and why | `SPEC.md`, `specs/NNN-feature/`, or a 1–2 page `plan.md` — see §4 |
| A progress/state file | Done / in progress / next, so a cold session resumes | Agent updates it after every change; verify it — it goes stale |
| Decision records (`docs/adr/`) | The *why* behind constraints | Pair each with mechanical enforcement (§5) |

**A minimal CLAUDE.md that works** (current official example, verbatim shape):

```markdown
# Commands
- pnpm test -- --runInBand   # CI flakes with parallel runs
- pnpm typecheck

# Code style
- ES modules (import/export), not CommonJS
- Prefer repetition over premature abstraction. Do NOT extract a shared
  hook/component until the same shape appears 3+ times AND I ask for it.

# Workflow
- Typecheck after any series of code edits
- Prefer running single tests, not the whole suite
```

That anti-abstraction line is Kitze's highest-leverage rule: LLMs don't need DRY, and premature abstraction is their favorite failure.

**Placement rules (current docs):**
- Occasional knowledge → **skills** (`.claude/skills/name/SKILL.md`, loaded on demand, zero context cost until used).
- Mandatory behavior → **hooks** (deterministic, can't be ignored).
- Path-specific rules → `.claude/rules/` with glob scoping.
- Only universal, every-session rules earn a CLAUDE.md line.
- Write rules **reactively**: add one only when you catch the agent drifting; never install rule packs (Zakariasson).

**Teach tools cheaply:** *"run `redis-cli --help`, learn how it works, add what you learned to CLAUDE.md"* (Cherny) — CLIs beat MCP servers for context efficiency in most cases.

---

## 4. Match rigor to the task

The 2026 consensus killed both extremes — "vibe code everything" and "full spec ceremony for every change." The settled rubric:

| Task | Process |
|---|---|
| Throwaway script, prototype, exploration | Just prompt. No ceremony, no guilt. |
| Small scoped change, solo, well understood | **Plan-file workflow**: plan mode → 1–2 page plan.md → you edit it → implement → verify. This is what most practitioners run daily. |
| Complex, multi-session, multi-dev, regulated, or agent-does-most-of-it | **Full spec pipeline**: requirements → design → tasks, with a human gate between each phase (per the spec-driven-development toolkits: GitHub's Spec Kit, AWS's Kiro). |

Route by **blast radius** (Kitze): will this be maintained or shipped? Then by ambiguity.

**When you do write specs:**

- **Use EARS notation** for acceptance criteria — unambiguous and directly testable: `WHEN <trigger> THE SYSTEM SHALL <response>`; `IF <error> THEN THE SYSTEM SHALL <response>`.
- **One spec directory per feature** (`specs/001-feature/spec.md`, `plan.md`, `tasks.md`), never a monolith. Spec says WHAT/WHY; plan says HOW; tasks are atomic checkboxes.
- **Write explicit out-of-scope lists.** Persisting negative decisions is what stops scope creep (Pocock, Hajdin).
- **Force vertical slices.** Agents default to horizontal plans (all models, then all services, then all UI) that can't be tested until the end. Demand tracer-bullet slices with a test per phase (Horthy: models "can't be prompted out of it" — restructure the outline yourself).
- **Review the research, not just the code.** In Research→Plan→Implement flows, the human checkpoint after *research* is the highest-leverage moment (Nations); killing a bad decision in a 200-line design doc is far cheaper than in a working PR (Horthy).
- **Keep specs alive or delete them.** "Spec-anchored" (updated alongside code) is the production sweet spot; stale markdown nobody reads ("SpecFall") is worse than none. Pocock's alternative is honest too: treat the PRD as disposable and delete it after shipping.

**One durable warning** (Apoorva Joshi): never let the agent choose your architecture. It can't see business constraints and optimizes for impressive-looking systems. Requirements, constraints, and eval criteria are human work — that's precisely what you hand the agent.

---

## 5. Verification is the ceiling

This is now the #1 practice in the official docs, and half the folder's talks are variations on it: **give the agent a check it can run**, and make the checks impossible to skip.

**The verification ladder** (escalate with autonomy):

1. **In the prompt**: "run the tests after implementing; show me the output."
2. **`/goal` condition**: re-checked every turn by a separate evaluator.
3. **Stop hook**: blocks the turn from ending until checks pass (Claude overrides after 8 consecutive blocks — it's a gate, not a cage).
4. **Fresh-context verification subagent**: reviews the diff against the plan before work counts as done.

**Demand evidence, not assertions.** Test output, exact commands run, screenshots. "Reviewing evidence is faster than re-running verification yourself."

**TDD is the strongest agent pattern** — with tamper protection:

> *"Write tests for [feature] based on these input/output pairs — TDD, no mock implementations. Run them and confirm they fail. **Commit the tests.** Then implement WITHOUT modifying the tests until all pass. If a test seems wrong, stop and tell me."*

The commit is the tamper detector: editing tests to make them pass is a documented agent failure mode. For high-stakes work, split roles — one context writes tests, another implements (a single context designs tests around the implementation it already plans).

**Stack deterministic gates under probabilistic ones** (Daniel Szoke, Sentry): compilers, typecheckers, and linters are the only *guaranteed* layer; tests and AI review are probabilistic layers above. Practical forms:

- **One `scripts/check` entry point** run identically by git hooks and CI, so an agent that skips hooks still gets caught (Cichra).
- **The back-pressure ratchet** (Arnaldi): strict TS/lint, ban `as`/`any`; every time you catch the agent taking a shortcut, encode it as a new lint rule. "Why does this rule exist? Because the model did that."
- **ADRs wired to enforcement** (Cichra): name the lint contract after the ADR so the failure message *cites the decision doc* — the agent reads the why, fixes, and self-corrects without you.
- **Hooks over prose**: a PostToolUse hook reporting "3 type errors in handler.ts at lines 42, 78, 103" lets the agent self-correct (current docs pattern); PreToolUse hooks that block writes to protected paths (auth, payments, migrations) with an explanatory message are Zakariasson's guardrail pattern. CLAUDE.md influences; hooks guarantee.
- **Anti-slop, instructed AND enforced** (swyx): put quality rules in the prompt (*"smallest change that works; no invented APIs; no filler comments; state what you did NOT verify"*) and back them with a diff gate in pre-commit/CI. SlopCodeBench (2026) measured agent code at ~2.3x human verbosity; explicit YAGNI guidance cuts initial verbosity by up to a third.
- **Cap adversarial reviewers**: a reviewer prompted to find gaps will always find some. Scope it: *"Report gaps affecting correctness or stated requirements, not style preferences."*

Use `/code-review` locally before pushing (note: renamed from `/simplify` in v2.1.147), and `anthropics/claude-code-action@v1` for agent-first PR triage in CI — with a repo-root `REVIEW.md` defining what "Important" means and capping nits. Agent review advises; humans keep architecture and judgment.

---

## 6. Scaling up: autonomous loops and parallel agents

### Ralph loops (unattended, sequential)

The Ralph pattern — `while :; do cat PROMPT.md | claude -p; done` — survives because it's context engineering, not orchestration: **fresh context every iteration forces durable knowledge into the repo**, and one-task-per-iteration keeps the agent in its smart zone (Chris Parsons, Arnaldi, Pocock; the technique originates with Geoffrey Huntley, July 2025).

Modern form:

1. **Backlog on disk**: `docs/tickets/NNN-name.md` with YAML `status: todo|doing|done` frontmatter and acceptance criteria (graduate to a real tracker later).
2. **Loop prompt**: *"You are one engineer in a relay team. Read the tickets and last 5 commits. Pick the single most important `todo` ticket, claim it, implement with TDD, verify actual behavior (green tests aren't proof), commit atomically, update status, stop."*
3. **Crash recovery states**: clean tree → pick ticket; dirty + tests pass → verify and commit; dirty + tests fail → reset.
4. **Convergence discipline**: machine-verifiable end state, iteration cap (~20), commit every iteration.
5. **Prefer packaged loops now**: the official `ralph-loop` plugin (`--completion-promise "DONE" --max-iterations 20`) or native `/goal`, `/loop`, `/batch` — they add completion detection and safety caps hand-rolled bash lacks.
6. **Sandbox it**: unattended runs go in the built-in OS sandbox (`/sandbox`, network allowlist, credential deny-listing) or a devcontainer — and `--permission-mode auto` (Mar 2026) is now the sanctioned way to skip prompts: a classifier reviews each action. Bare `--dangerously-skip-permissions` on a dev machine is firmly out.
7. **Improve the prompt, not the output**: after each run, have the agent update the loop skill with lessons learned; version it (Parsons).

Loops win when specs are clear and "done" is machine-checkable. Interactive sessions remain the default for ambiguous, judgment-heavy work. "Sit on the loop, not in it."

### Parallel agents (concurrent)

- **Native worktrees**: `claude --worktree feature-auth` per terminal — creation, branching, env-copying (`.worktreeinclude`), and cleanup are handled for you. (The notes' manual `git worktree add` scripts are superseded.)
- **Route by supervision needed** (Liam Hampton of Microsoft's three tiers): hands-on local session for tests and gnarly debugging; background worktree agent for medium-risk features; sandboxed cloud agent (PR-only) for docs and hygiene.
- **Writer/Reviewer split**: a fresh context reviewing code it didn't write has no self-bias — the cheapest quality win in multi-session work.
- **Your review bandwidth is the cap** (Chieng, swyx): 2–4 agents you actually read and steer beat a 10-agent swarm; Tyler Folkman's one-person-software-factory data found ~4x raw output but only ~12% more delivered value once review became the bottleneck. Decompose the backlog into *non-colliding* units before scaling (Zakariasson).

---

## 7. Where the folder's notes are superseded (one-liners)

- **"Safe YOLO mode" in a container** → replaced by OS-level sandboxing (Oct 2025) and classifier-reviewed `--permission-mode auto` (Mar 2026).
- **`.claude/commands/*.md` slash commands** → folded into skills (`.claude/skills/name/SKILL.md`, `disable-model-invocation: true` for manual workflows); old commands still work.
- **"think / think hard / ultrathink" keywords** → gone from current guidance; use plan mode, editable plans, and `/goal` conditions instead.
- **Coordinating multiple Claudes via a shared markdown scratchpad** (Cherny 2025) → native agent teams with a shared task list, plus agent view and dynamic workflows.
- **Mandatory fresh-context resets for long-running harnesses** (Anthropic Nov 2025) → relaxed in the Mar 2026 revision (no more "context anxiety"); fresh-per-iteration still applies to Ralph-style loops.
- **"Plan mode cripples tool access"** (Arnaldi) → no longer holds; plan mode is the recommended explore phase.
- **Mandatory evaluator agent on every task** → now conditional: worth it only when the task exceeds what the model does reliably solo.
- **"Vibe engineering"** → the label lost; "agentic engineering" won (Willison, Feb 2026). The practice is unchanged.
- **Docs at docs.anthropic.com / the April 2025 best-practices blog post** → both redirect to the living `code.claude.com/docs` pages; cite those.

---

## Folder Playbook — apply this week

1. **Give every task a check the agent can run.** Tests, typecheck, build, screenshot diff. If you can't name the check, you're the verification loop — fix that first.
2. **Run Explore → Plan → Code → Commit for anything non-trivial**; edit the plan with `Ctrl+G`; skip planning when the diff fits in one sentence.
3. **Prune CLAUDE.md to <200 lines** of only what prevents mistakes; add the anti-abstraction rule; move situational knowledge to skills and enforcement to hooks.
4. **Externalize state**: a spec/plan file per unit of work, a progress file agents update, ADRs for decisions. `/clear` freely — the repo, not the session, is the memory.
5. **Adopt the rigor rubric**: prompt-only for throwaways; plan-file for daily work; spec pipeline (EARS criteria, vertical-slice tasks, human gate per phase) for complex/multi-dev features.
6. **Make TDD tamper-proof**: failing tests → commit → implement without touching tests.
7. **Build the ratchet**: one `scripts/check` for hooks and CI; add a lint rule for every agent shortcut you catch; block protected paths with a PreToolUse hook.
8. **Review upstream**: kill bad designs at the 200-line design-doc stage; scope adversarial reviewers to correctness gaps only.
9. **Scale deliberately**: `claude --worktree` for parallel sessions, a packaged Ralph loop (sandboxed, iteration-capped, auto mode) for backlog-draining — but never run more agents than you can actually read.
10. **Fold every failure back into the system**: recurring review findings become spec/standards lines; agent drift becomes a rule; a good session becomes a skill. The harness, not any one session, is the asset.
