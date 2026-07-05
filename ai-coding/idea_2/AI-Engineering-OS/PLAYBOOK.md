# AI-Engineering-OS — Master Playbook

> **The one ordered set of daily practices for building software with AI agents, plus the repository structure that makes it durable.** The five guides in [`guides/`](guides/) are the "why"; this is the "what to do, in what order." Every practice here is drawn from a guide's Folder Playbook, de-duplicated and ranked by leverage. When anything here disagrees with [`CONVENTIONS.md`](CONVENTIONS.md), that file wins.

---

## Operating principles

Ten rules are the whole philosophy; everything below is their application.

1. **Move effort upstream and downstream, not to the middle.** Your leverage is in alignment (before the agent) and verification (after it) — never in watching it type.
2. **No verification target, no autonomy.** An agent that can't check its own work will confidently drift. Every task starts with the test/build/screenshot that will prove it.
3. **The doer is never the grader.** A fresh, adversarial context reviews the work and shows evidence, not claims.
4. **The context window is a budget.** Curate the smallest high-signal set each turn; externalize everything durable to files.
5. **Memory beats a bigger prompt.** A fresh session that reads `.ai/` must resume cold — that is the whole point of the memory system.
6. **Capture gotchas, not coverage.** Document only where the model's prior is wrong; a Skill of landmines beats a wiki of what-it-already-knows.
7. **Enforce, don't instruct.** Hooks, lint, strict types, and diff caps turn advice into guardrails; put guardrails *outside* the probabilistic layer.
8. **Every failure becomes a permanent check.** An incident isn't closed when it stops — it's closed when it can't silently recur.
9. **Prose appreciates; code depreciates.** Invest in specs, decision docs, and pattern files — a better model tomorrow extracts more from the same prose.
10. **No autonomy without accountability.** Report what was verified and what wasn't; LOC and hours-unattended are vanity metrics.

---

## The prioritized daily practices

The distilled 20% that delivers 80%. Work top to bottom; the order is the priority.

### A · Foundations — set up once per repo
1. **Stand up the memory system** — `.ai/project-state.md`, `.ai/architecture.md`, `.ai/coding-standards.md`, plus an `AGENTS.md` operating contract at the root that tells the agent to read `.ai/` first.
2. **Wire a `verify.sh` gate** — tests + lint + a ~150-line diff cap + a forbidden-marker scan (`TODO`/`FIXME`/`console.log`) — installed as a Stop hook or pre-commit so "looks done" can't ship.
3. **Prune always-on rules; move workflows to Skills** — keep the always-loaded rules tiny; push sometimes-relevant procedures into on-demand [Skills](guides/03_agent-skills.md).

### B · The task loop — every task
4. **Give the task a verification target before you prompt.**
5. **Stage the work into focused steps** — goal-blind research (answers with `file:line`, no recommendations) → a ~200-line design doc → a vertical-slice outline with a `TEST:` per phase → a file-by-file plan. Re-steer at the *design doc*, where it's cheap.
6. **Force vertical slices** — reject any issue that's one horizontal layer with nothing testable; tag issues `afk` / `human-in-the-loop` with a `blocked_by` DAG.
7. **Implement one slice per turn; run `verify.sh` each step** — only a green step gets its box checked in `project-state.md`.
8. **Review in a fresh context** — an adversarial subagent (or new session) grades the diff against the spec; you read the critical code and own the merge.
9. **Update the memory system** — write status + a handoff note to `.ai/project-state.md` before you stop, so the next session starts warm.

### C · Context discipline — every session
10. **Treat the window as a budget** — `/clear` between tasks over compaction; read `.ai/project-state.md` first, not the whole history.
11. **Escalate compaction in stages** — clear stale tool results before you ever summarize; never drop the system prompt or the latest tool result.
12. **Route tools just-in-time past ~50, and prefer grep over a vector index for code navigation.**

### D · Quality gates — before merge
13. **Score with a deterministic check first** — add an LLM-as-judge only for subjective dimensions, and validate the judge against human labels with **precision/recall** (prioritize recall).
14. **Generate tests two-phase** — run the scenario through Playwright MCP, *then* transcribe the spec from captured snapshots; use semantic locators; **never trust a green test.**
15. **Report `pass@k` *and* `pass^k` plus cost** — never ship on a lone accuracy number; reliability ≠ capability.

### E · Operations — in production
16. **Make failure loud** — classify tool/web responses before the model sees them and refuse rather than guess.
17. **Instrument at your own node boundaries** — emit OTel GenAI spans (content in span events, off by default) and add the **behavioral eval layer** (duplicate-call + loop detection).
18. **Keep guardrails outside the model, turn every incident into a replay test, and shadow-mode new autonomy** (~2 weeks + a kill-switch) before granting execute authority.

### F · Weekly maintenance
19. **Read the transcripts** — turn recurring friction and corrections into the next Skill or an enforced rule.
20. **Grow the eval set from production, close every incident loop upstream, and prune stale docs** — the framework itself must iterate.

---

## The never-skip spine (7 non-negotiables)

Everything above is tailorable with a recorded reason — except these:

1. **A verification target on every task.** *(01)*
2. **Fresh-context review — the doer is never the grader.** *(01, 04, 05)*
3. **State externalized to the memory system — a fresh session resumes cold.** *(02, 04)*
4. **Every failure becomes a permanent check (an eval case or a deterministic spec).** *(05)*
5. **Guardrails live outside the probabilistic layer — the tool, not the prompt.** *(04, 05)*
6. **Recurring expertise captured as a Skill; the *why* captured as a decision trace.** *(02, 03)*
7. **Read the transcripts — tune by reading, not guessing.** *(04)*

---

## The repository structure

```
your-repo/
├── AGENTS.md                 # the operating contract — the agent reads this first
├── verify.sh                 # the deterministic gate (tests + lint + diff cap)
├── .ai/                      # MEMORY SYSTEM — machine-first, terse, high-signal
│   ├── project-state.md      # ★ REQUIRED — done / in-progress / next + handoff notes
│   ├── architecture.md       # ★ REQUIRED — system map, key decisions, invariants
│   ├── coding-standards.md   # ★ REQUIRED — conventions the agent must follow
│   ├── rules/  skills/  hooks/  commands/  mcp.json   # optional: the harness
│   └── prompts/  decisions/  plans/  checklists/  lessons.md   # optional: knowledge
└── .human/                   # HUMAN DOCS — narrative-first, plain English
    ├── architecture.md       # the same system, drawn with Mermaid
    ├── onboarding.md         # get a new dev productive in a day
    ├── features/             # one doc per feature
    ├── adr/                  # architecture decision records
    ├── troubleshooting.md    # symptom → cause → fix
    └── runbooks/             # one page per operational task
```

The three **★ REQUIRED** files are the memory system: together they let any fresh session grasp status, architecture, active work, decisions, and known issues without re-prompting. Everything else is added as the project earns it. Full purposes + starter templates for every file live in [`.ai/`](.ai/), [`.human/`](.human/), and [`templates/`](templates/); the update and ownership rules live in [`CONVENTIONS.md`](CONVENTIONS.md).

---

## Cadence

| Rhythm | Ritual |
|---|---|
| **Per task** | RPI loop → `verify.sh` green → fresh-context review → update `project-state.md` |
| **Per session** | Read `project-state.md` first; `/clear` at task boundaries; leave a handoff note |
| **Weekly** | Read transcripts → Skills/rules; grow the eval set; close incident loops; prune stale docs |
| **Per incident** | Replay-test + a guardrail *before* the loop is closed |
| **Per release** | Pin the **AI release tuple** (code + prompt-set + model ID + eval-set hash + skill versions) |

---

## If you only do five things

The 20% of this playbook that prevents 80% of AI-build failures:

1. **Give every task a verification target and review it in a fresh context** — the two cheapest sources of truth.
2. **Run the memory system (`.ai/`)** so no session ever starts cold and you stop re-prompting.
3. **Stage research → plan → implement on cheap upstream artifacts, in vertical slices** — align before you generate.
4. **Make every failure a permanent check and re-run it on every change** — the flywheel that compounds quality.
5. **Read the transcripts weekly and turn friction into Skills and rules** — the framework iterates itself.

---

*Practices distilled from the five Folder Playbooks in [`guides/`](guides/). The contract and governance that keep this alive: [`CONVENTIONS.md`](CONVENTIONS.md). Reusable prompts: [`AI_PROMPTS.md`](AI_PROMPTS.md).*
