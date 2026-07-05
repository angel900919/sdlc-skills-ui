# AI Agents: The Consolidated Guide

> Synthesized from the 26 talk/note sets in `AI_CODING/AI-Agents/` — including both Anthropic workshops (Agent SDK, long-running agents), Replit's autonomy talk, and Factory's multi-agent architecture. Everything is reconciled against current (July 2026) guidance: the Claude Agent SDK docs, Anthropic's harness posts through March 2026, the settled multi-agent literature, and the sandbox/lifecycle ecosystem. Where notes and current guidance conflict, current guidance wins — changes are flagged inline and collected near the end.

---

## 1. The agent equation: a simple loop plus a deliberate harness

Strip away the framework marketing and every production agent is the same thing: **a while-loop that gathers context, takes an action through a tool, verifies, and repeats** — wrapped in a *harness* that handles what the model can't: tool execution, context management, permissions, termination, logging. Reliability is an engineering property of that deterministic wrapper, not something you prompt for (Tejas Kumar, IBM: a weak model plus verification and guardrails beats a frontier model alone on verifiable tasks).

Two disciplines govern harness design in 2026:

- **Minimalism with a paper trail.** Anthropic's rule: *"every component in a harness encodes an assumption about what the model can't do on its own."* If you can't name the observed failure a component exists for, delete it. Re-run this audit at every model release — Anthropic halved the cost of its own long-running harness by deleting scaffolding a newer model no longer needed. Corollaries: ~10 well-designed tools, not 50; AGENTS.md under ~60 lines, every rule traceable to a real failure.
- **The harness dominates outcomes.** On the CORE benchmark, the *same* Opus-class model scored 78% in the Claude Code harness versus 42% in the minimal Smolagents harness — the wrapper, not the model, was the variable.

Treat the agent explicitly as a **state machine** you own (Cline's Ara Khan): named states, bounded end states, capped iterations. A human owns the architecture; agents may write the code, but you read it.

---

## 2. The substrate: bash, a filesystem, and code

The strongest convergent finding across the folder: **give the agent a computer, not a tool zoo.**

- Vercel reports its d0 agent went from ~80% to ~100% task success after *deleting* ~80% of its bespoke tools and leaving one bash tool over a persistent sandbox. Anthropic's SDK workshop teaches the same: "bash is all you need" — the model is post-trained on exactly this interface.
- **Sort actions with a three-way rule** (Thariq Shihipar, Anthropic): *tools* for atomic, irreversible, or approval-gated operations; *bash* for composable operations; *code generation* for dynamic logic and API composition.
- **Keep results out of context**: save tool output to files and return paths; the agent greps and re-reads what it needs. Translate data *in-distribution* first (into formats the model saw heavily in training) — CSV → SQLite, spreadsheets → XML — because grep over familiar formats beats semantic search over exotic ones.
- **For wide API surfaces, use code mode.** JSON tool-calling breaks at scale; expose the system as a typed code API and let the model write a script executed once in a sandbox. Cloudflare collapsed 2,594 endpoints (~1.17M tokens of schemas) to ~1,000 tokens behind two tools — `search` and `execute`; Anthropic's equivalent measured 98.7% token reduction. Intermediate data stays in the executor; only distilled results return.
- **Match the medium to the training distribution** (Amol Kapoor): when an agent "can't do" something — graphics, decks, diagrams — check the output format first. Agents fail at coordinates (SVG paths, PPTX shapes) but excel at semantic HTML/CSS rendered by a headless browser. Diagnose interface before blaming the model.

---

## 3. Verification: split the generator from the evaluator

The single most repeated production lesson: **self-evaluation is a trap.** Models praise their own work, declare features complete without running them, and "talk themselves into approving mediocre output." Every serious harness now separates the roles:

1. **Builder and critic get separate contexts.** Anthropic's long-running-agents architecture (Mar 2026) is Planner → Generator ⇄ Evaluator: the planner writes a high-level spec once; generator and evaluator loop, communicating only through files. Never fork the working context for review — a fork inherits sympathy for the work. Fresh context, framed adversarially: *"this output was made by a junior analyst — critique it."*
2. **Negotiate a testable contract before code.** Generator and evaluator agree on dozens of concrete acceptance criteria (Factory calls this a *validation contract*: finite behavioral assertions, each owned by a feature, written before any code). Grade against the contract, not vibes.
3. **Default-FAIL with evidence.** The evaluator may not pass anything without *observed* evidence per criterion — and it verifies as a user, driving the running app via a Playwright/browser MCP server (MCP — Model Context Protocol, the standard tool-connection layer). Replit's internal data explains why: only browser-level tests catch "painted doors" (features that render but don't work — over 30% of first-pass features, by their measure). Prefer written Playwright code over screenshot-driven computer use: ~10x cheaper, and the tests become a regression suite.
4. **Climb the verification spectrum**: static analysis → execution → unit tests → API tests → browser tests. Treat every "task complete" claim as an unverified hypothesis (Catasta, Replit).
5. **Guard against reward hacking.** When an agent optimizes against an eval, hard-forbid it from editing the golden dataset or scorers (a `JOB.md` forbidden-files list — Nearform's AutoAgent), hold out tests it never sees, and detect test-file edits in diffs.

One calibration note: the evaluator is *conditional* overhead. Anthropic measured $9/20-minutes solo versus $200/6-hours with the full harness — reserve the heavy machinery for work beyond what the current model does reliably alone.

---

## 4. Multi-agent: the debate is settled, the rules are strict

The 2025 war — Cognition's "Don't Build Multi-Agents" versus Anthropic's "+90.2% with multi-agent research" — collapsed into a consensus both sides now ship:

**Default to a single agent.** Escalate only when one of three triggers holds: **context pollution** (the window fills with irrelevant subtask output), **parallelization** (independent, read-heavy, breadth-first subtasks), or **specialization** (one agent would need 15–20+ tools or conflicting instructions).

When you do go multi-agent:

- **Orchestrator + context-isolated workers** is the only topology that consistently ships. Split by *context boundaries*, never by workflow phases — plan→code→test across separate agents is measurably harmful. Role-persona pipelines (PM-agent → engineer-agent → QA-agent) are dead.
- **The read/write rule**: read-heavy work parallelizes; write-heavy work stays single-threaded (Factory runs implementation features *serially*, parallelizing only research and review — serial correctness compounds over multi-day runs).
- **Scoped delegation, structured returns.** Each subagent gets a task package — objective, exact output format, tool guidance, boundaries, effort budget — never the parent's full context. It returns a structured summary, not a transcript.
- **Bound all collaboration.** Free-form agent meshes and debate/consensus loops failed structurally in production (uncoordinated agents amplify errors ~17x; centralized coordination contains it to ~4x). No direct agent-to-agent chat; a supervisor gates quality.
- **Apply distributed-systems discipline** (Databricks): a data contract at every handoff with quality gates, append-only immutable state snapshots (never shared mutable state), a circuit breaker around every agent call, and compensating actions (sagas) for multi-step side effects. Complexity scales with connections (~n²/2), not agent count.
- **Budget first**: multi-agent runs at roughly 3–10x a single agent's token cost (~15x a plain chat), and token usage explains ~80% of performance variance. If the task value can't absorb that, don't ship the pattern.

A delegation package worth templating — every subagent task should carry:

```yaml
objective:  the one question this subagent must answer
output:     exact structure of the report back
tools:      which tools, with usage heuristics
boundaries: explicit non-goals; don't duplicate other agents' areas
budget:     max tool calls / tokens
```

In Claude Code terms: subagents (`.claude/agents/*.md` — frontmatter for `tools`, `model`, `memory`, `isolation: worktree`, background-by-default since v2.1.198) are the shipped form of context isolation; agent teams (still experimental) add a shared task list and inter-agent messaging for the rare cases workers must talk.

---

## 5. Durability and state: the log is the agent

For anything that runs longer than one sitting, the folder converges on event-sourcing thinking:

- **An agent's identity is its append-only event log**, not the running process (Omnara). Every state transition — inputs, tool calls, results, permission requests, errors — is an immutable event; current state is a deterministic fold over the log; workers are stateless and disposable. Resume, forking, sharing, and cross-model migration all fall out structurally. The one split that matters (iterate workshop): **pure state derivation with no I/O, side effects gated separately** — that's what makes any loop replayable and restart-safe.
- **Use durable execution instead of hand-wiring queues.** Vercel's Workflow DevKit (GA Apr 2026) makes it a two-directive refactor: `"use workflow"` on the deterministic loop, `"use step"` on each LLM/tool call — persistence, retries, resumable streams, `sleep('3d')` suspension, and webhook-based human-approval gates for free. Temporal-style engines work too but require deterministic orchestration code.
- **Practical file-state rules for long runs** (Anthropic's harness posts): persist checklists as **JSON, not markdown** — models overwrite markdown but respect JSON structure; keep a progress file and a learnings log; use git as memory and revert mechanism; ship an `init.sh` so no session wastes context rediscovering the environment.
- **The session-start ritual** for any fresh context: verify working directory → read git log + progress file → pick ONE item from the feature list → run init.sh and a smoke test *before* new work → implement → verify end-to-end → commit and update progress.

---

## 6. Sandboxing and security

Autonomy is an isolation problem. The 2026 stack, outside-in:

- **Match isolation to workload**: lightweight JavaScript isolates (V8, millisecond start) for code-mode snippets; micro virtual machines (gVisor/Firecracker — E2B ~78ms, Daytona ~90ms cold start, Vercel Sandbox, Modal for GPUs) for full untrusted workloads; OS-level sandboxing (Seatbelt/bubblewrap — Claude Code's `/sandbox`) for local dev agents, cutting permission prompts ~84%.
- **Network egress is the enforceable control point**: default-deny, explicit domain allowlist enforced by a proxy *outside* the sandbox. Audit the allowlist — one attacker-postable domain is an exfiltration channel.
- **Credentials never enter the sandbox.** An egress proxy validates each request semantically (right repo, right branch) and injects scoped short-lived tokens; the model never sees secrets. Same pattern at the harness level: handlers fill credentials from env vars programmatically (Kumar), or a `check_key`-style tool reports presence without values.
- **Design around the lethal trifecta** (Willison): never combine private-data access, untrusted content, and unrestricted egress in one agent context.
- **Computer use is production-grade but a fallback** (~85% on OSWorld-Verified mid-2026, above the human baseline): prefer APIs, code, and CLIs; reserve GUI automation for interfaces with no programmatic path.

Layer these — "Swiss-cheese security": model alignment, then harness permissions and hooks, then OS/network sandboxing. Scope credentials, not curiosity.

---

## 7. Running agents in production: the lifecycle

The Agent Development Lifecycle (build → test → deploy → monitor) is now standard vocabulary. The load-bearing practices:

- **Version the whole agent definition** — system prompt, tool schemas, model + params, skills — in git; every change flows through eval gates. Treat the eval suite as the gate in *both* directions: offline before ship, online against production traces.
- **Pair every fix with a regression artifact.** A production failure isn't fixed until it's also a dataset case or online evaluator — the cure for prompt whack-a-mole (LangChain, Mutagent). Grow suites from real failures; you cannot pre-author them. Prefer binary pass/fail criteria; evaluate the *trajectory* (tool calls, context), not just the final answer.
- **Trace on OpenTelemetry's GenAI conventions** (the vendor-neutral observability standard) so instrumentation is portable — Langfuse, Braintrust, and Phoenix all accept it. Tag every call with feature/user metadata from day one; retrofitting attribution is a quarter-long migration.
- **Plug the five default token leaks** (Erik Hanchett): resent system prompts (cache them — order the prompt most-stable-first; anything after a variable element never caches), one-model-for-everything (route small-model-first with eval-gated fallback; tuned routing layers report 40–85% bill cuts), tool results replayed every turn (offload/truncate), uncapped tool loops, and unbounded history. Verify each fix with cache/usage metrics — a silent cache no-op looks identical to a hit.
- **Roll out agent changes like infrastructure**: shadow → canary → percentage → full, with automated statistical rollback thresholds armed. "Automated rollback is not optional" is the consensus; LLM run-to-run variance means you gate on distributions, not single runs.
- **Steal the UX patterns of the best agents** (Flinn): focus modes with per-mode toolsets and evals, a faithful live trace with mid-run stop/steer, persisted playbooks of *how* the user works, and reversibility (checkpoint → diff → restore) paired with confirmation gates for irreversible actions.

---

## 8. Building on the Claude stack

The mid-2026 default for a solo senior engineer:

1. **Prototype in Claude Code first.** Vibe-code the typed API wrapper, CLAUDE.md, and `scripts/` directory interactively; read every transcript (the #1 meta-skill — fixes go into CLAUDE.md/scripts/skills, not framework code).
2. **Graduate to the Claude Agent SDK** (renamed from "Claude Code SDK") when you need it programmatic — it's Claude Code as a library: the same loop, tools, skills, subagents, hooks, compaction (automatic context summarization when the window fills), and sessions behind an async `query()`:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix bugs in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"], permissionMode: "acceptEdits" }
})) {
  if ("result" in message) console.log(message.result);
}
```

3. **Production checklist** the tutorials skip: custom tools as in-process MCP servers; PreToolUse hooks that block dangerous commands; structured output via JSON Schema; per-session cost tracking.
4. **Keep the durable asset portable.** The "micro-agent architecture" — a folder with AGENTS.md, `tools/` scripts, `context/` docs, `workspace/` — runs on any harness (Claude Code, Codex, Amp as interchangeable runtimes). Your markdown and scripts are the moat; the harness is rented.
5. **Reach for other frameworks only with cause**: LangGraph for auditable multi-model orchestration graphs; Mastra for TypeScript products; Vercel AI SDK for chat UIs; smolagents for minimal auditable Python. "Pick a framework first" is dead advice — pick the harness closest to your model, and hand-roll nothing the SDK already hardened.
6. **Let the agent extend itself, bounded.** Meta-skills (Anthropic's skill-creator, subagent-creator) make the agent write its own skills and subagents; Pi's hot-reloaded extensions are the same idea. Golden rule from the recursive-agents talk: capture a great run and deconstruct it into a replayable workflow — reliability by replay, not luck.

---

## 9. Where the folder's notes are superseded (one-liners)

These are corrections to specific claims in the `AI_CODING/AI-Agents/` source notes — useful when rereading them; skim otherwise.

- **Two-agent initializer/coder with hard context resets per session** (Anthropic Nov 2025) → three-agent Plan-Generate-Evaluate in one continuous session with auto-compaction (Mar 2026); sprints removed once Opus 4.6-class models sustained hours of coherence.
- **Mandatory evaluator on every run** → conditional: worth it only at the edge of model capability.
- **"Claude Code SDK"** → renamed **Claude Agent SDK** (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`); old imports deprecated.
- **The Cognition-vs-Anthropic multi-agent war** → resolved; even Cognition's Managed Devins ships orchestrator + ephemeral context-isolated subagents.
- **AutoGen as a multi-agent default** → maintenance-only; OpenAI Swarm → replaced by the OpenAI Agents SDK.
- **Loading all MCP tool schemas upfront** → deferred tool search, code mode, and filesystem-based progressive disclosure.
- **Containers as the one-size sandbox** → an isolation spectrum from V8 isolates to microVMs, chosen per workload.
- **OpenAI Operator** → folded into ChatGPT agent (Jul 2025); computer use went from demo (14% OSWorld, 2024) to production category (~85%, mid-2026) — but still the fallback, not the default.
- **Pi's Claude Code critiques (shallow hooks, no model choice, TUI churn)** → early-2026 snapshots; the harness has iterated since. The durable point — own and audit your context — stands.
- **"8–10 minutes per agent turn" / inference-bound parallelism caps** → stale figures; human review bandwidth (a small handful of supervised agents) is the durable constraint.
- **Vercel Workflow DevKit "public beta, GA targeted Jan 2026"** → GA April 2026, open source, Python SDK in beta.

---

## Folder Playbook — apply this week

1. **Audit your harness for unnamed assumptions**: for each prompt rule, tool, and scaffold component, name the observed failure it prevents — or delete it. Re-run at every model release.
2. **Collapse your tool zoo**: one bash tool + filesystem + a typed API wrapper covers most of what bespoke tools do; keep dedicated tools only for irreversible or approval-gated actions.
3. **Stand up a default-FAIL evaluator**: a fresh-context subagent (read-only tools, harsh prompt, evidence required per criterion) that verifies by *using* the artifact — Playwright for anything with a UI.
4. **Write the contract before the code**: testable acceptance criteria negotiated up front; grade against the contract; forbid the agent from editing tests, scorers, or golden data.
5. **Stay single-agent until a trigger fires** (context pollution, parallel read-heavy work, or tool/instruction overload) — then orchestrator + scoped subagents with structured returns, writes kept serial.
6. **Make state durable**: JSON checklists, a progress file, git commits every iteration, an init.sh, and the session-start ritual — any fresh context resumes cold in one read.
7. **Sandbox by default**: OS sandbox locally, microVM for untrusted work, egress allowlist, credentials injected outside the boundary. Never combine private data + untrusted content + open egress.
8. **Ship every fix with a regression artifact** and version the full agent definition in git behind eval gates.
9. **Plug the five token leaks** (caching, routing, result offload, loop caps, history trims) and verify with metrics, not vibes.
10. **Prototype in Claude Code, productionize on the Agent SDK**, and keep your instructions/skills/scripts as portable markdown — the harness is rented, the context layer is yours.
