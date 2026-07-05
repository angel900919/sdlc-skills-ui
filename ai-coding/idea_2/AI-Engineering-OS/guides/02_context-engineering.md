# 02 · Context Engineering — The Substrate

> **The practice of curating the smallest set of high-signal tokens the model sees each turn, and externalizing what must survive into durable memory.** If Agentic Coding ([01](01_agentic-coding.md)) is the workflow, Context Engineering is the physics beneath it — every skill ([03](03_agent-skills.md)), agent ([04](04_ai-agents.md)), and eval loop ([05](05_quality-and-operations.md)) is applied context engineering. One-sentence thesis: **"Context is the new code" — the context window is a finite budget, so stop shoving in everything that fits and start engineering what belongs.**

---

## Why this guide exists

An agent's behavior is a function of exactly one thing: the tokens in its context at inference time. Get those tokens right and a cheap model succeeds; get them wrong and the best model fails. Two hard facts drive everything here:

1. **The window is a budget, not a bucket.** More tokens is not more capability. Padding actively degrades output — the "context rot" effect, where even information that *fits* dilutes the signal and quality falls. Anthropic's framing: aim for *"the smallest possible set of high-signal tokens that maximize the likelihood of the desired outcome."*
2. **Context ≠ memory.** Context is *what the model sees this turn*; memory is *what survives across turns and sessions*. Conflating them is the root cause of both bloated windows and amnesiac agents. Engineer them separately.

---

## The two disciplines

| | **Context** (per-turn) | **Memory** (durable) |
|---|---|---|
| Question it answers | "What does the model see *right now*?" | "What must survive this session?" |
| Where it lives | The active window | Files, an ID-keyed store, a vector index, weights |
| Failure mode | Bloat, context rot, tool-schema overload | Amnesia, re-deriving the same facts, lost decisions |
| Core move | Curate + just-in-time load | Externalize + retrieve + forget |

The dominant 2026 pattern across memory frameworks (Letta, Mem0, Zep, LangMem) is the same shape: **a small always-in-context core + vector-backed retrieval + an explicit forgetting policy**, spanning four memory types — *working, episodic, semantic, procedural*. "Retrieval strategy matters more than storage."

---

## Principles in plain English

- **Memory beats a bigger context.** Durability and reuse beat prompt size every time; "the filesystem is the database."
- **Curate the smallest high-signal set each turn.** Write system prompts at the "right altitude" — neither brittle hardcoded scripts nor vague hand-waving.
- **Separate what the model sees from what survives.** Evict to a retrievable store keyed by stable ID; hand the agent a retrieval tool to rehydrate on demand.
- **Escalate compaction in stages.** Clearing stale tool results is cheap and cache-friendly; LLM summarization is lossy — do it last, and never reset the system prompt or drop the latest tool result.
- **Retrieval must be sound *before* it is agentic.** "An agent that loops over a weak retriever just spends more money to be wrong more elaborately."
- **Load tools and context just-in-time.** Fat catalogs collapse accuracy (78% at 10 tools → 13.6% at 741) and inflate latency.
- **Structure the source before it reaches a model.** Bad extraction compounds downstream; clean Markdown beats a bigger model on messy input.
- **Failure is the highest-value signal for what to document.** Let the agent fail, let it name the gap, then fill it.
- **Capture the WHY, not just the WHAT.** Decision traces turn precedent into a searchable, explainable asset — an agent that can *decide*, not just answer.
- **Never cache answers; re-reason.** A stored answer goes stale like a doc, and feeding prior answers back regresses you to the mean.

---

## Step-by-step: engineering your context

### 1. Treat the window as a budget

Before adding anything to context, ask: *does this token change the next action?* If not, it is noise. Set a working target (many practitioners keep coding agents in a ~100k "smart zone" well under the hard limit) and defend it. This is the mindset shift that makes every technique below matter.

### 2. Evict with middle-out truncation to an ID-keyed store

When the window fills, don't blindly drop the oldest turns. Keep the **system prompt and the latest tool result whole**, and evict the *middle* to a store the agent can query. The reference implementation (Arize, *how-we-solved-context-management*):

```python
# context_manager.py — keep the ends, evict the middle to a retrievable store
HEAD, TAIL = 100, 100                      # tokens kept verbatim at each end
def compact(messages, store):
    keep_head = messages[:HEAD]
    keep_tail = messages[-TAIL:]
    for m in messages[HEAD:-TAIL]:
        ref = store.put(m)                 # returns a stable ID
    return keep_head + [index(store)] + keep_tail   # index() = [{ref, position, preview}]
```

The agent sees a compact `index` of `{ref, position, preview}` and calls a `fetch(ref)` tool to rehydrate anything it needs. This is exactly the shape Anthropic's file-based **memory tool** productizes.

### 3. Escalate compaction in stages, not in one lossy leap

Claude Code's three-tier cascade is the model to copy: **Session Memory → Microcompact (clears stale tool results *without* an LLM call, preserving the prompt cache) → full LLM compaction only near ~95% of the limit.** Philosophy: "defer as long as possible, keep it cheap, escalate in stages." Summarization is the last resort because it silently loses subtle context.

### 4. Turn on persistent memory

Enable a memory layer so project state and learnings survive across sessions. On the Claude Developer Platform this is the **memory tool** (file-based, client-side, persists across conversations) plus **context editing** (auto-clears stale tool calls near the limit). Measured impact: **84% token reduction** on a 100-turn eval, **+39% performance** when combined with memory. If you're not on that platform, replicate it with a plain file store the agent reads on every call (the "AI Research OS": immutable `raw/` → an `index.yaml` catalog → an LLM-built `wiki/`, read cheapest-layer-first).

### 5. Route tools just-in-time past ~50 tools

Don't inject 100 tool schemas every turn. Build a semantic router — "RAG for tools":

```python
# router.py — inject only the top-K tool schemas relevant to this query
def select_tools(query, tool_index, k=5):
    hits = tool_index.search(embed(query), k=k)     # descriptions embedded offline
    return [t.schema for t in hits]                 # ~5 schemas, not 741
```

This maps 1:1 onto Anthropic's **Tool Search Tool** (`defer_loading: true`, 60-char descriptions) and **Code execution with MCP**, which report **85–98.7% token reduction**. Write each tool description in the words users actually type.

### 6. Retrieve hybrid — but reach for grep first on code

For documents, fuse keyword (exact) and vector (semantic) search; each alone misses ~1 in 4 results. Reciprocal Rank Fusion is the workhorse:

```python
# hybrid_search.py — fuse BM25 + vector by RRF
RRF_K = 60
def fuse(bm25_ranks, vec_ranks):
    scores = {}
    for ranks in (bm25_ranks, vec_ranks):
        for rank, doc_id in enumerate(ranks):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (RRF_K + rank)
    return sorted(scores, key=scores.get, reverse=True)
```

**But for code navigation, prefer agentic grep/filesystem search over a vector index.** Anthropic removed vector search from Claude Code (May 2025) because grep "outperformed everything, by a lot"; the top SWE-bench agents don't vector-index the repo. Keep a code index only as a *shared cache* or for docs — not as the default retriever.

### 7. Make retrieval learn

Rank memories by *utility*, not similarity alone, and update the signal from outcomes (StarlightSearch, *user-signal-dies-at-the-retrieval-boundary*):

```python
# reflect_lite.py — similarity + a learned q-value, updated online
score   = (1 - λ) * similarity + λ * q_value        # λ = 0.5
q_new   = q_old + α * (reward - q_old)              # α = 0.1, reward from outcome
```

Retrieve topically-relevant candidates first, *then* rerank by utility; distill the ~10 most-useful recurring memories into a standing Skill.

### 8. Structure sources before they reach the model

Convert documents to Markdown (Docling), chunk deliberately (outline-aware, not blind fixed-size), and keep an immutable `raw/` copy. One corpus case: a single mis-merged word propagated through 20 papers because extraction happened once, badly. Data quality — not model size — is the usual retrieval bottleneck.

### 9. Find undocumented knowledge by letting the agent fail

Treat knowledge-base construction as TDD (IKEA, *demand-driven-context*): run the agent on a real ticket, let it fail, have it *name* the gap, route that to an expert, curate the answer back into Git. Automate the hunt with a Context Gap Scanner:

```python
# context_gap_scanner.py — probe the docs, classify the gaps, prioritize
# 1. generate probes from the backlog  2. run against docs  3. classify:
#    clean | stale | missing | tribal   →  priority = f(severity, frequency)
# emits a Kanban of critical/high/medium gaps + a stub for the top one
```

### 10. Record decision traces, and assemble prompts in layers

Capture the *reasoning and precedent* behind decisions (not just an audit log) so agents decide from precedent with a trail by construction (Neo4j, *context-graphs-decision-traces*). And assemble every system prompt through one entry point, in a fixed order (Martin-Dye, *stop-writing-tone-instructions-layer-them*): **immutable identity → situation → voice → deterministic post-generation veto**, failing loud if the identity layer is missing.

### 11. Eval your context like code

Context is an engineered artifact with a lifecycle — **Generate → Evaluate → Distribute → Observe → regenerate** (Tessl, *context-is-the-new-code*). Lint it (required frontmatter, description length), add an LLM-as-judge for team conventions, and run N times against an error budget. Plant a canary convention (e.g. a made-up team rule) so the eval proves it's testing *your context*, not the base model's priors.

---

## Templates, prompts & examples to lift

- **`context_manager.py`** — middle-out truncation + ID-keyed store + `fetch(ref)` tool. The cleanest memory-tool reference.
- **`router.py`** — the semantic tool router; start at K=5.
- **`context_gap_scanner.py`** — runnable gap finder (mock + `--live`) that emits a prioritized Kanban.
- **`assembler.py`** — the four-layer prompt assembler with a fail-loud identity check and a deterministic Layer-4 veto (a regex vetoing a classifier where correctness matters).
- **`expert_graph.py`** — build a collaboration graph from `git log` (co-author trailers, file co-ownership) to find *who* to ask; the social graph is the jump-off into bottled-expert knowledge (always bound with `--since/--limit`).

---

## Common pitfalls

- **Stuffing the window because it fits.** Bigger context ≠ better; context rot degrades even information the model technically has room for.
- **One-shot LLM compaction.** Summarizing the whole history in one lossy pass throws away subtle context. Clear stale tool results first; summarize last.
- **Vector-indexing your codebase by reflex.** For code *navigation*, grep and agentic filesystem search beat embeddings — and cost nothing to maintain.
- **A fat tool catalog.** Past ~50 tools, accuracy and latency fall off a cliff. Route just-in-time.
- **Agentic loops over a weak retriever.** Fix retrieval soundness *before* adding agent loops, or you just fail more expensively.
- **Caching answers.** Answers rot like docs; re-reason from sources, and never feed prior answers back as ground truth.
- **A graph database you don't need.** Files + grep win for general memory; reserve a graph DB for genuine precedent/decision-provenance retrieval.

---

## Modern vs. historical — where to override older advice

| Question | Older take (in the corpus) | Do this instead (mid-2026) |
|---|---|---|
| Code retrieval | Build a local **vector+keyword index** over AST chunks | **grep / agentic filesystem search** for code nav; index only as a shared cache or for docs |
| Fitting a domain | Stuff the whole ~96k curated context in the window | Curate **and** minimize + load JIT; a small clean domain stuffed is fine, relying on window growth is not |
| Memory store | Reach for **Neo4j + graph embeddings** | Start with files + grep; add a graph **only** for precedent/decision-provenance |
| Long conversations | Truncate-to-store *or* LLM-summarize (camps split) | **Converged**: clear stale tool results first, summarize last — layered, never one lossy leap |

---

## Folder Playbook — habits to apply immediately

1. **Treat the context window as a finite budget** — before adding a token, ask whether it changes the next action; stop shoving in "as much as fits."
2. **Evict with middle-out truncation to an ID-keyed store**, and give the agent a `fetch(ref)` retrieval tool to rehydrate any evicted chunk on demand.
3. **Escalate compaction in stages** — clear stale tool results first, summarize only as a last resort, and never drop the system prompt or the latest tool result.
4. **Turn on a persistent memory layer** (memory tool + context editing, or an equivalent file store) so project state and learnings survive across sessions.
5. **Route tools just-in-time past ~50 tools** — index descriptions, inject only top-K (start K=5), use `defer_loading`.
6. **Retrieve hybrid (BM25 + vector, RRF at k=60) and return a pointer to the source** — but reach for **grep/agentic search before a vector index** on code.
7. **Make retrieval learn** — log each run's outcome, rank memories by utility (similarity + q-value), and distill the ~10 recurring ones into a Skill.
8. **Structure sources before modeling** — Docling → Markdown, deliberate chunking, an immutable `raw/` copy.
9. **Find undocumented knowledge by letting the agent fail** on real tickets and naming its gaps; run a Context Gap Scanner over your backlog; store curated blocks in Git with PR review.
10. **Record decision traces** (reasoning and precedent, not just facts) and make them retrievable so agents decide from precedent.
11. **Assemble prompts from ordered layers through one entry point** (identity → situation → voice → deterministic veto); fail loud on missing identity.
12. **Eval your context like code** — lint structure, add LLM-as-judge convention checks with a canary, and mine every PR comment and prod failure as a context bug to feed back.

---

*Sources: the `AI_CODING/Context-Engineering` corpus (~13 distinct talks incl. Iusztin, DeLucia/Arize, Raj/Tesco, Shaikh/Rastogi, Navakoti/IKEA, Chin & Blumenfeld/Neo4j, Werry/Unblocked, Debois/Tessl, Martin-Dye, Morris) cross-checked against Anthropic's "Effective context engineering" and memory-tool/context-editing docs, the Claude Code compaction cascade, and agent-memory frameworks (Letta, Mem0, Zep, LangMem), mid-2026.*
