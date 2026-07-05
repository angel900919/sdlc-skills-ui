# Context Engineering: The Consolidated Guide

> Synthesized from the 20 talk/note sets in `AI_CODING/Context-Engineering/` (Paul Iusztin, Raj Navakoti, Sally-Ann DeLucia, Leonie Monigatti, Patrick Debois, Jack Morris, the Neo4j context-graph talks, the Unblocked context-engine talks, and others), reconciled against current (July 2026) guidance: the Claude Code docs at code.claude.com, Anthropic's context-engineering and harness-design posts through April 2026, and the 2025–26 retrieval, memory, and tool-budget literature. Where notes and current guidance conflict, current guidance wins — changes are flagged inline and collected near the end.

---

## 1. The core principle: context is an attention budget

Anthropic's framing, now the field's consensus: the context window is a **finite attention budget with diminishing returns**. Chroma's "context rot" research showed every model tested degrades as input grows — visibly from ~50K tokens in a 200K window — even when the relevant facts haven't moved. Bigger windows did not fix this: the lost-in-the-middle U-shape (models attend best to the start and end of the window, worst to the middle) persists on 1M-token models; larger windows just moved the middle further out.

Three consequences drive everything in this guide:

- **Curation beats accumulation.** The goal is the *smallest set of high-signal tokens* that produces the behavior you want — not the fullest window.
- **You can't tune the model, so context is your only lever** (Patrick Debois). That makes context files — CLAUDE.md, rules, skills, specs — your primary shipped artifact, deserving engineering discipline: versioning, evals, and a maintenance budget.
- **Most agent failures are context failures.** Sally-Ann DeLucia (Arize), the Unblocked talks, and Navakoti's IKEA work all converge here: agents fail on missing organizational knowledge and polluted windows, not on reasoning. Suspect the context before you suspect the model.

A useful aphorism from the Arize talk: **"Context decides what the model sees; memory decides what survives."** The rest of this guide covers each side and the machinery between them.

---

## 2. Know your Claude Code context stack (and audit it)

Everything below loads into the same budget, so know what loads when:

| Layer | When it loads | Discipline |
|---|---|---|
| `CLAUDE.md` (managed → user → project) | Every session, re-injected after compaction (context summarization, §5) | Keep under ~200 lines; only every-session rules |
| `.claude/rules/*.md` with `paths:` frontmatter | Only when matching files are touched | The recommended home for language/domain rules — replaces the monolithic CLAUDE.md |
| Auto memory (`~/.claude/projects/<repo>/memory/`) | First 200 lines / 25KB of MEMORY.md per session | On by default since v2.1.59; agent-written; audit via `/memory` |
| Skills | Description (~100 tokens) always; body on demand | Progressive disclosure — the home for procedural knowledge |
| MCP tools | Names only at start; schemas deferred via tool search (default on) | ~3–6 servers per project; check `/mcp` for per-server cost |
| Conversation + tool results | Grows continuously | Your job to manage — see §5 |

**Audit workflow (do this once per project, then whenever things feel off):**

1. Run `/context` — see token usage by category (CLAUDE.md, skills, MCP, files, conversation).
2. Run `/memory` — see which instruction files loaded; open and prune the auto-memory folder.
3. Run `/mcp` — disable servers unused in recent sessions (each can cost up to ~18K tokens without deferral).
4. Move anything task-specific out of CLAUDE.md into a skill or a path-scoped rule.

A path-scoped rule looks like this:

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API Rules
- All endpoints must include input validation
- Use the standard error response format
```

**Session hygiene commands:** `/clear` between unrelated tasks (previous session stays resumable); `/compact focus on auth changes` to summarize with focus instructions; `/rewind` for checkpoints, including "summarize up to here" for partial cleanup. Prompt caching covers CLAUDE.md, memory, schemas, and skills — heavy mid-session config churn (model switches, MCP connects) invalidates it.

---

## 3. Retrieval: how the agent should find things

The source folder (`AI_CODING/Context-Engineering/`) holds both extremes — "build a local code index" (Tesco's 94%-savings talk) and "agentic search killed RAG" (RAG = retrieval-augmented generation: fetching text snippets by embedding similarity) — and 2026 practice settled in between. The decision rubric:

| Situation | Retrieval approach |
|---|---|
| Repo under ~1K files, symbols known | **Agentic search only** (glob/grep/read, follow imports, check tests) — Claude Code's default; no index, no staleness |
| Repo over ~1K files, fuzzy "where is the code that does X" | Add a **semantic index with code-trained embeddings** alongside grep (Cursor measured hybrid beating grep-only by ~12.5%) |
| "Who calls this?", refactor blast-radius | **Local tree-sitter/LSP code graph over MCP** (e.g. Serena) — structural queries drop from ~412K tokens of file-reading to ~3.4K |
| Enterprise multi-repo | **Deterministic exhaustive search** (Sourcegraph-style) — approximate retrieval misses cross-cutting impact |
| Docs, tickets, ADRs, wikis | **Classic vector RAG** — embeddings still win on fuzzy natural-language corpora |

Two durable principles behind the rubric:

- **Just-in-time beats pre-loading** (Anthropic): keep lightweight identifiers — file paths, queries, URLs — and fetch content when needed, the way humans use indexes. Claude Code's hybrid is the model: pre-load a small always-relevant core (CLAUDE.md), fetch everything else with tools.
- **Filter before injecting.** Distractors measurably hurt; prefer several short, focused reads over dumping a directory. Place load-bearing content at the context's *edges* (start and end), restate the question right before the answer slot, and never bury critical files mid-window.

Leonie Monigatti's tool-portfolio advice rounds this out: give the agent a few well-described **specialized search tools plus one general escape hatch** (bash/grep), log real usage, and promote recurring query shapes into dedicated tools. If a question routinely takes 4–5 tool calls, the tool is too hard for the model. And return tool errors as text, never exceptions — the error message is the self-correction loop.

---

## 4. Memory across sessions: files won, structure them

The clearest verdict in the source folder: for keeping a coding agent oriented in a repo, **plain files in git beat vector databases and heavyweight memory frameworks** — Manus, OpenClaw, and Claude Code all landed on file-based memory independently. And the tools that structure those files (Codex, Claude Code, and others) converged on the same layout:

**A concise always-loaded index pointing to lazy-loaded topic files.**

```
memory/  (or docs/, or ~/.claude/projects/<repo>/memory/)
├── MEMORY.md          # index — the only always-loaded piece
├── debugging.md       # topic files, read on demand
├── api-conventions.md
└── decision-log.md
```

Layer what goes where:

- **Human-authored rules** → CLAUDE.md / AGENTS.md (see §7).
- **Agent-learned facts** → auto memory (on by default; background consolidation merges and prunes notes). Apply a **signal gate** before writing: "will a future agent act better because of this note?" If not, don't write it.
- **Decisions with their *why*** → a committed `decision-log.md` per feature area with dated `Chose / Why / Rejected` entries. This is the cheapest version of what the Neo4j talks call **decision traces**: the insight that agents need precedent ("why did we decide this?"), not just facts, is durable — full graph databases with causal edges are the heavyweight variant, worth it only for judgment-heavy, audit-sensitive domains.
- **Task/work state** → a structured git-backed tracker (e.g. Steve Yegge's beads) rather than a swamp of session-note markdown files.

**Grow memory demand-driven, not upfront.** Navakoti's Demand-Driven Context methodology generalizes: don't document everything and hope — let the agent *fail* on real work items, treat each failure as a precise list of missing knowledge, fill only those gaps, and have the agent curate the answer into a versioned context block. The everyday form is a one-line rule: **codify anything you've explained to the agent more than twice.** The StarlightSearch talk adds the promotion rule at the other end: once ~10 related memory notes accumulate, compact them into a skill or rule and prune the notes.

Two boundaries to respect:

- **Memory files are advisory, not enforcement.** Rules that must *always* hold belong in hooks/CI (the previous guide's territory), not in markdown the model might not attend to.
- **Verify before acting on memory.** Code drifts faster than notes; stale paths and APIs in memory actively poison the agent, which trusts documentation absolutely.

For API-built agents (outside Claude Code), Anthropic's memory tool (`memory_20250818`, now GA) implements the same file pattern with view/create/edit commands — validate paths and strip secrets in your handler; memory became a recognized attack surface in 2026.

---

## 5. Compaction and overflow: never destroy — relocate

When the window fills, the source folder's strongest engineering pattern comes from Arize: **eviction with handles, not deletion**. Park overflowing content in a store behind a stable ID with a short preview, and give the agent a retrieval tool to pull it back — the keep/drop decision moves to retrieval time, under agent control.

The current toolbox, cheapest first:

1. **Tool-result clearing** — drop old tool outputs that can be re-fetched (Anthropic measured −84% tokens over 100 turns with *better* task performance). Free and lossless for re-fetchable data.
2. **Sub-agent isolation** — the single highest-leverage move in Claude Code: delegate heavy exploration to a subagent that burns tens of thousands of tokens in its own window and returns a 1–2K-token summary. "Not all context belongs in the same agent."
3. **Compaction (summarization)** — last resort, now well-productized (`/compact` with focus instructions, auto-compaction near the limit). Preserve architectural decisions, unresolved bugs, and open threads; discard redundant tool output.
4. **Durable state in files** — progress files, feature checklists, and git history make any session cold-resumable, which is what lets you `/clear` fearlessly.

Note the correction to the folder's notes: Arize's blanket "LLM summarization doesn't work" was about naive whole-history summarization — modern structured compaction with focus instructions is standard practice, and Anthropic's April 2026 managed-agents post adds the counterweight at platform scale: where infrastructure allows, keep a **durable re-readable event log** instead of irreversible in-window edits, because "it is difficult to know which tokens future turns will need."

**Make context quality a CI signal, not a vibe.** Arize's load-N/probe-N+1 eval is a template worth stealing: replay 10 real turns, then ask a turn-11 question whose answer lives in evicted/compacted content. If the agent can't answer, your compaction strategy fails before your users tell you.

---

## 6. Tool and instruction budgets

The "100-tool agent is a trap" talk named what Anthropic later productized: tool-selection accuracy collapses as the catalog grows (the reproduced RAG-MCP benchmark measured 13.6% baseline selection accuracy with large registries, more than tripling to 43.1% with retrieval-based pre-selection), and every schema competes with the task for attention.

Current practice in Claude Code:

- **Tool search is on by default** — only tool names load at session start; schemas are fetched on demand. This supersedes the DIY semantic tool routers the talk built. Pin genuinely hot tools with `"alwaysLoad": true` in `.mcp.json`; leave the rest deferred.
- **Keep ~3–6 MCP servers per project.** Before enabling one, ask: does this need live external state/auth? If it's procedural knowledge, **write a skill instead** — the pragmatic 2026 split is *MCP for live systems, skills + CLI for know-how*. Practitioners report replacing double-digit MCP servers with a handful of skills.
- **For big surfaces, use code-mode**: let the agent call tools from a code sandbox so intermediate results never enter context (Anthropic measured 150K → 2K tokens; Cloudflare reports ~99.9% reduction exposing its full 1.17M-token API surface in ~1K tokens).
- **Instructions share the same budget.** IFScale showed adherence degrading with instruction count (~68% at 500 simultaneous instructions) — every CLAUDE.md rule you add dilutes the others. This is the quantitative reason behind "keep it under 200 lines."

Write MCP server instructions like skill descriptions — what task category the tools serve and when to search for them — since that's what the model sees before deciding to load anything.

---

## 7. Docs as context, with a lifecycle

The folder's forward-looking thesis (Debois: "context is the new code") is now operational practice:

**Adopt AGENTS.md as the vendor-neutral entry point.** It's a Linux Foundation standard supported by 30+ tools; have CLAUDE.md import it (`@AGENTS.md`) or symlink it so every agent shares one source. Keep the root file minimal (~60 lines): one-liner, stack, commands, directory map, and *pointers* to deeper docs — with an explicit routing line, because agents don't follow links unprompted:

```markdown
# AGENTS.md
React component library for data visualization.

## Commands
- Test: `pnpm test` (single: `pnpm test path/to/file`)
- After changes: `pnpm lint:fix && pnpm typecheck`

## Deeper docs — IMPORTANT: read the relevant one BEFORE starting a task
- TypeScript conventions: docs/TYPESCRIPT.md
- Testing strategy: docs/testing-strategy.md
- Architecture decisions: docs/adr/
```

**Wire ADRs into the agent's workflow**, not just the humans': *check docs/adr/ before architectural choices; never contradict an accepted ADR; write a proposed ADR before implementing a new decision; mark superseded ones.* For agent-made decisions, record model version and human-review status.

**Prevent drift mechanically.** Stale docs actively poison agents. On merge to main, run a doc-drift check (an `anthropics/claude-code-action` job prompted to "determine whether any documentation needs updating as a result of these changes" and open a docs PR — or a dedicated tool like DeepDocs). Avoid exact file paths and exhaustive inventories in agent docs — they rot fastest; describe shape and capabilities instead.

**Give context files the code lifecycle (Debois's CDLC — Context Development Lifecycle):** Generate → Evaluate → Distribute → Observe. The evaluate step is the novel one: lint your SKILL.md files deterministically, then write LLM-judge evals *only for conventions the base model would never produce on its own* (that's precisely what your context is responsible for), run each ~5 times, and gate CI on a pass rate with an error budget. A two-line CLAUDE.md edit has unknown blast radius; evals catch rules-file regressions the way tests catch code regressions.

The payoff is measured: a controlled 124-PR study found AGENTS.md presence alone cut agent wall-clock time ~29% and output tokens ~17%.

---

## 8. Where the folder's notes are superseded (one-liners)

- **"Embed the whole repo in a vector DB"** (2023–24 default) → dead; agentic grep-based search is the default, with code-trained hybrid indexes only above ~1K files. The 94%-token-savings code-index headline measured against a full-file-read baseline no modern agent uses.
- **"Grep is all you need, never index"** (2025 counter-swing) → also outdated; Cursor's Nov 2025 eval showed hybrid beats grep-only, and local code-graph indexes returned for structural queries.
- **"Cross-session memory is unsolved"** (Arize, Iusztin) → largely closed: Claude Code auto memory is on by default (v2.1.59+), the API memory tool is GA, and Managed Agents ship hosted memory.
- **"LLM summarization doesn't work for compaction"** (Arize) → true only of naive whole-history summarization; structured, instruction-guided compaction is now standard, with re-readable event logs as the platform-scale alternative.
- **Character-count truncation heuristics (~100-char head/tail)** → replaced by token-based, cache-aware budgets.
- **DIY semantic tool routers** (the 100-tool talk) → superseded for Claude users by built-in tool search / deferred loading, on by default.
- **Monolithic CLAUDE.md wikis** → a <200-line core plus path-scoped `.claude/rules/` and on-demand skills.
- **Tool-specific rule files** (.cursorrules etc.) → converged on AGENTS.md, a Linux Foundation standard since Dec 2025.
- **llms.txt as AI SEO** (a proposed root-level index file telling AI crawlers where a site's docs live) → dead as a visibility play (97% of files get zero AI requests); it survives only as documentation-site infrastructure.
- **"Bigger context windows will make this obsolete"** → falsified twice: context rot and lost-in-the-middle persist on 1M-token models, and long prompts cost more than retrieval.
- **Fine-tuning knowledge into weights** (Jack Morris) → still research-stage for coding teams in mid-2026; production memory remains file-based. Keep it on the radar for dense, frequently-queried corpora.

---

## Folder Playbook — apply this week

1. **Audit your budget**: run `/context`, `/memory`, and `/mcp` on your main project; disable unused MCP servers and move task-specific CLAUDE.md content into skills or path-scoped rules.
2. **Adopt the index + topic-file memory layout**: a lean always-loaded index pointing at on-demand topic files; let auto memory do its job and prune it monthly.
3. **Start a decision log**: committed `decision-log.md` (or `docs/adr/`) with dated Chose/Why/Rejected entries — precedent, not just facts, is what keeps agents from re-proposing rejected designs.
4. **Codify on the third explanation**: anything you've told the agent twice becomes a rule, skill, or doc — the demand-driven alternative to documenting everything upfront.
5. **Use the retrieval rubric**: agentic search by default; add a code-trained semantic index past ~1K files; a code-graph MCP tool for "who calls this"; vector RAG only for prose corpora.
6. **Delegate heavy exploration to subagents** and let them return 1–2K-token summaries — the cheapest fix for context rot in long sessions.
7. **`/clear` freely, compact deliberately**: externalize state to files so fresh sessions resume cold; when compacting, pass focus instructions.
8. **Set up AGENTS.md** (~60 lines, with the explicit "read relevant docs before starting" routing line) and point CLAUDE.md at it.
9. **Add a doc-drift CI check** so merged code changes trigger a docs-update pass — stale docs are worse than no docs.
10. **Eval your context**: adopt the load-N/probe-N+1 test for long sessions and an error-budget LLM-judge eval for your rules/skills — context files are load-bearing infrastructure; test them like it.
