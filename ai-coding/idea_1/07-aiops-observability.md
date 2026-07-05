# AIOps & Observability: The Consolidated Guide

> Synthesized from the 6 conference talks/note sets in `AI_CODING/AIOps-and-Observability/`: an RL ETL-remediation talk, Databricks' enterprise production playbook, Microsoft's "good luck reproducing it" talk on replaying agent failures, Bright Data's talk on the "I searched the web" lie, Granola's feedback-loops talk, and Raindrop's agent-observability deep-dive. Everything is reconciled against current (July 2026) guidance — OpenTelemetry's GenAI semantic conventions, the production feedback-loop / data-flywheel literature, runtime hallucination-detection research, and the AI-SRE deployment playbooks. Where notes and current guidance conflict, current guidance wins; changes are flagged inline and collected near the end.

This folder has two halves, and the guide keeps them separate: **observing agents** (making a production agent's behavior legible, reproducible, and trustworthy) and **agents for ops** (letting agents run your operations safely). They share one principle — verification beats trust — but the failure modes and controls differ.

---

## Part A — Observing agents in production

### 1. Why production monitoring, not just evals

Evals catch the failures you can imagine; production catches the ones you can't. Agents fail in an unbounded, non-deterministic, tool-mutating space no finite golden set covers (Raindrop's framing), so once you have more than a few hundred events you can no longer read by hand, **continuous production monitoring becomes the reliability layer, not a nice-to-have.** The three sub-problems, in order: make every step legible (tracing), make failures reproducible (record/replay), and make the agent's claims verifiable (lie detection). Feedback loops close it back to a fix.

### 2. Trace every step on OpenTelemetry GenAI conventions

The wire standard converged: emit **OpenTelemetry GenAI semantic conventions** (`gen_ai.*` spans and metrics) so any backend — Datadog, Langfuse, Phoenix, Braintrust — ingests without re-instrumentation. Model an agent run as a trace tree:

```
invoke_agent support-router          (INTERNAL span)
  chat claude-sonnet                  (CLIENT span)
  execute_tool web_search             (INTERNAL / tools/call for MCP)
  chat claude-sonnet
  execute_tool summarize
```

Naming and attributes that matter:
- Inference spans named `{operation} {model}`; tool spans `execute_tool {gen_ai.tool.name}`.
- Low-cardinality (few distinct values, so dashboards stay cheap), high-signal attributes always on: `gen_ai.operation.name`, `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.agent.name`, `gen_ai.tool.name`, `error.type`, plus `gen_ai.conversation.id` on every span to group multi-turn sessions.
- Prompts, tool arguments/results, and system instructions are **opt-in, never captured by default** — in production prefer external object storage referenced by a span URL over inlining `gen_ai.input.messages`.
- Emit the required `gen_ai.client.operation.duration` histogram and the recommended `gen_ai.client.token.usage` histogram; **derive cost downstream from token counts, not in-span.**
- Set `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` — otherwise instrumentations still emit the pre-v1.36 legacy attribute names (`gen_ai.system` is now `gen_ai.provider.name`). The conventions are still "Development" status, so pin versions.

Minimal exporter setup (env vars, plus your language's OTel GenAI instrumentation package):

```bash
OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental
OTEL_SERVICE_NAME=my-agent
OTEL_RESOURCE_ATTRIBUTES=service.version=1.4.0,deployment.environment=prod
OTEL_EXPORTER_OTLP_ENDPOINT=https://collector:4317
OTEL_TRACES_SAMPLER=parentbased_always_on   # never sample if you need full replay (§3)
```

**Evaluate at two levels**: span/trace-level ("was each tool call and reasoning step correct") and session-level ("did the agent achieve the user's goal"). And **build the trace UI for non-engineers** (Granola's lesson — the founder walks the full agent loop front-to-back to locate failures); nobody should spelunk CloudWatch to find what broke. Flag slow tool calls (>500ms) and empty/oversized results so the broken step jumps out.

**Watch cost from telemetry itself**: metered platforms bill per span (Datadog ~$8/10k LLM requests), so a looping agent multiplies billable spans. Add loop/step caps and monitor spans-per-run as a cost guardrail.

### 3. Make failures reproducible: record/replay, not temperature=0

The Microsoft talk's core correction: **stop chasing bitwise determinism from hosted LLMs.** `temperature=0` and seeds don't deliver it — floating-point non-associativity and GPU batch/hardware variance reportedly produce up to ~15% accuracy variance across identical runs. Engineer *replayability* instead:

- **Record at your own code boundary, not the network layer** — half the agent (local tools, memory, in-process retrieval) never touches the network. Wrap each node with a `@boundary` decorator that captures `{node, kind, input, output, meta}` to append-only JSONL with monotonic step IDs.
- **Capture the full envelope**: model version, sampling params, build/code version, RAG chunk IDs, RNG seed, clock — not just the prompt.
- **Replay** by serving recorded responses via stubs for probabilistic nodes while the patched node runs live; substitute recorded clock/RNG; **fail loudly on any un-recorded call.**
- **Assert on the node you changed, never on a stubbed node** — a stub returns a frozen fact about the old run. Assert *structural* equivalence (same tool calls, same conclusions), not exact tokens, since outputs drift.
- **Capture full, unsampled traces** for runs you may need to replay — a 10-step agent is ~100–200KB, so complete capture is cheap and sampling breaks replay.

The payoff: every production incident becomes a **free, permanent regression test** that never calls a model, so it's rerunnable forever and independent of live model availability. The incident artifact *is* the test — there's no separate "write a test" step.

### 4. Catch the agent's lies: verify claims against ground truth

LLM agents are trained to please, so they narrate success the system never achieved. Two named failure modes from this folder:

- **The web-layer lie** ("I searched the web"): a silent fetch failure — CAPTCHA, empty page, or a 200-OK decoy — leads the model to fabricate facts, prices, and citations. Fix at the tool boundary: **classify every response OK / EMPTY / BLOCKED / DECOY *before the model sees it***, return an explicit failure object on any non-OK verdict, and escalate to a stronger access layer rather than letting the model improvise. Tag every fetch with its verdict as a telemetry dimension and alert on BLOCKED/DECOY rates. Add a citation-resolves check (every cited URL actually returns 200).
- **The action lie** ("done — sold 1000 shares") when the tool never committed. The controlling principle: **a log entry proves code ran, not that a side effect happened.** Instrument every mutating action with four separate flags and gate any success message on `verified`, never `attempted`:

```python
log('attempted')                      # code reached the mutation
result = do_mutation()
log('committed', ok=result.ack)       # downstream acknowledged
state = read_from_system_of_record()  # read-after-write against the authoritative store
log('verified', ok=state.changed)     # state actually changed
status = 'success' if state.changed else 'failed'
# user-facing message may assert success ONLY when verified is True
```

Beyond that, the 2026 verification stack, cheapest first:

- **Tool receipts** — the tool returns an HMAC-signed record (a tamper-proof stamp of name/args/result) that the response layer checks, so the model can't fabricate a tool result it never called. A claimed tool use with no matching `execute_tool` span is itself a fabrication signal.
- **Contextual grounding checks** — score whether a RAG answer's facts actually appear in the retrieved source, and block the ones that don't (e.g. Bedrock Guardrails thresholds ~0.75).
- **Trajectory ground-truth checks** — zero-LLM-cost evaluators that catch skipped, extra, or mis-ordered tool calls against an expected sequence.
- **Uncertainty signals** — semantic entropy (does the agent give semantically different answers when re-sampled?) and self-consistency, to flag guesses when you have no ground truth.

Layer these by cost: deterministic checks on 100% of traffic in the hot path, distilled (cheap) faithfulness evaluators on 100% asynchronously, and an agent-as-judge only on the 5–10% that get flagged.

One cheap, high-leverage pattern (Raindrop): **a self-diagnostics `report` tool.** Register one benign tool — `report(note)` described as "notes to your creators" — plus a system-prompt line nudging the agent to surface anything notable (a tool failed, a workaround, a missing capability). The framing matters: `report` gets confessions ("I created the file via bash because write_file failed"); a scary name like `unsafe_bash_use` produces silence because the agent "got the job done." The body can just POST to Slack.

### 5. Close the loop: from signal to shipped fix

Monitoring only pays off if signals route back into the product:

- **Lead with binary issue detectors, not 1–10 quality grades**: is-refusal, is-frustrated, task-failure, jailbreak, task-success. Keep the detection layer an order of magnitude cheaper than inference — never run an LLM-as-judge on every event (it ~doubles AI spend at scale). Layer a near-free regex keyword signal on top (Claude Code's own leaked `userPromptKeywords.ts` tracks a per-release frustration rate by sweeping for "wtf", "this sucks").
- **Instrument implicit signals on 100% of traffic** (edits, retries, rephrases, copies, abandonment, escalation-to-human) — explicit thumbs cover only 1–3% of interactions and are biased, so behavior is the primary signal.
- **Turn every meaningful production failure into a permanent golden-dataset regression row** with behavioral assertions (tool sequences, grounding, forbidden-action absence, schema conformance), and gate CI on it so the same failure can't silently ship twice. Enforce **bidirectional traceability**: each fix traces backward to the failure it addresses and forward to proof the pattern disappeared. "Guess and redeploy" without that link is an anti-pattern.
- **Run production experiments**: ship a change to a % of users vs. a control arm, tag every change with an experiment/version flag, and compare *signal rates* — a few hundred events catches a 1–2% regression (validate the significance before treating it as policy). Treat a moving signal as an investigation prompt, not an automatic verdict.
- **Run the closed loop in order**: observability → evaluation → improvement — never fix before you can see and measure. Shreya Shankar's *data flywheel* is the improvement engine inside that loop (evaluation → monitoring → continual improvement): a timestamped DB of labeled production examples that also serves dynamic few-shot retrieval and, eventually, distillation of smaller cheaper models from curated traffic. Fine-tuning is now reframed as the *last* lever — after prompt/few-shot/retrieval — and often used to cut cost/latency rather than raise quality.

---

## Part B — Agents for operations

The other half of the folder: using agents to run ops (incident response, ETL remediation). The RL ETL talk and the AI-SRE playbooks converge on the same architecture, and it's the inverse of "bigger model = better."

### 6. Structure and guardrails beat autonomy

The ETL-remediation talk's ablation is the load-bearing result: a learned RL policy merely *tied* a hand-coded one, while **structure and guardrails** produced the reliability. The transferable design:

- **Three auditable layers**: deterministic rules for observable facts, a learned/LLM policy for bounded choice, and a **safety override that sits outside the policy's update loop** so retraining can never silently redefine what the agent is allowed to do. "Rules for facts, learning for bounded choices, guardrails for authority."
- **A small, named action space** (retry / coerce / rollback / quarantine / escalate / log) so the safety layer can reason about every possible proposal in advance — and **escalation is a first-class outcome, not a failure.** Report non-escalation rate alongside success rate; scoring success only by non-escalation trains the agent to hide uncertainty.
- **Reward the proposal, not the rescue**: if you reward the safety layer's corrected action, you teach the policy that unsafe proposals are free because "the net always cleans up." Keep reward and override strictly separate.
- **Log proposal, override, execution result, and validation as separate fields** so post-incident review can tell *which* thing failed — and record "safe in principle" versus "executable in this environment" as two distinct facts (the same distinction as the action-lie in §4).
- **Validate before granting write authority**: shadow-mode against real human decisions, then seed-based ablation with confidence intervals — "a single favorable run is a demo, not evidence."

### 7. The enterprise deployment playbook

For ops agents with real blast radius, the 2026 consensus is strict:

- **GitOps foundation first** — "no GitOps, no agentic AIOps." Agents propose changes as pull requests against version-controlled, immutable infra state; **direct agent write-access to production is an anti-pattern.**
- **The 4-stage autonomy maturity model** (Rootly): Read-only → Advised → Approved (human sign-off) → bounded Autonomous. Rarely skip stages; promote only when logs show stable precision and low false-positive rates.
- **Gate auto-remediation on two factors**: fire autonomously only when **confidence is HIGH *and* blast radius is LOW/reversible**; any other combination escalates to a human with evidence attached. Match autonomy to blast radius, not to raw capability.
- **Contain blast radius structurally**: namespace isolation, network policies, per-namespace scoped credentials, egress filtering, ephemeral/mirrored-prod sandboxes, and policy-as-code admission control (Kyverno/OPA) that auto-rejects non-compliant proposals. Treat each agent as a first-class security principal with its own identity so every action is attributable and a compromised agent can be isolated (mind the lethal trifecta — the dangerous combination of private-data access, untrusted input, and an external exfiltration path in one agent).
- **Assign every agent a business owner and a technical owner**, and define decision rights per action: autonomous, human-in-the-loop (pre-approval — required for anything touching prod data, communications, or money), or human-on-the-loop (post-execution review).
- **Automate low-risk, reversible actions first** (autoscaling, cache clearing, feature-flag flips, retry/backoff) before agents go near stateful or regulated operations. Deploy on-call agents *into* existing schedules and ChatOps, and give them persistent memory of past incidents and the diagnostic steps human responders took, so recurring incidents self-resolve. Track **MTTR-A** (automated mean-time-to-resolve — the machine-executed slice of MTTR) as a distinct metric.

---

## 8. Where the folder's notes are superseded (one-liners)

Corrections to the source notes in `AI_CODING/AIOps-and-Observability/` — skim if you haven't read them.

- **"MCP didn't exist during the case study" / generic "open-source tracing"** (Databricks playbook) → MCP is the standard tool-connection layer, and OpenTelemetry GenAI conventions are the standard trace schema.
- **`temperature=0` for reproducibility** → a no-op on hosted LLMs; record/replay at the code boundary is the reproducibility mechanism.
- **Explicit thumbs as the primary quality signal** → implicit behavioral signals on 100% of traffic; thumbs cover only 1–3%.
- **Holistic 1–5 quality scores; APM-only monitoring; exact-string regression tests** → binary/decomposed metrics, decision-level tracing plus online evals, and behavioral assertions respectively.
- **"RL policy is the win"** (ETL talk) → the ablation showed structure + guardrails carried the reliability; RL merely tied a hand-coded policy.
- **Helicone / Langfuse as independent OSS** → Helicone entered maintenance mode after the Mintlify acquisition (~Mar 2026); Langfuse is now ClickHouse-owned (self-host licensing unchanged). Pin your data, not your vendor.
- **Vendor demo figures** (99.85% MTTR reduction, ~99% token savings, "60% of ChatGPT citations don't work", ~10p/chat) → speaker-reported existence proofs, not benchmarks; verify against your own stack.
- **Model IDs in examples** (`claude-opus-4-8`, `gpt-4o-mini`) → rotate; check current model IDs at publish time.
- **OTel attribute keys** (`gen_ai.tool.call.arguments/result`, invoke_agent span kind) → still "Development" status and shifting (span kind split CLIENT/INTERNAL ~v1.41); pin the semconv version.

---

## Folder Playbook — apply this week

1. **Emit OpenTelemetry GenAI spans** for every agent run (`invoke_agent` root, `execute_tool` children), with the stability opt-in set and content attributes kept opt-in — one instrumentation, any backend.
2. **Derive cheap binary signals** (is-refusal, is-frustrated, task-failure, tool-error-rate) plus a near-free regex frustration signal; alert on rate deltas, and keep detection an order of magnitude cheaper than inference.
3. **Add a `report` self-diagnostics tool** with a benign name and a one-line system-prompt nudge — the cheapest way to hear about workarounds and silent failures.
4. **Record at the code boundary**, not the network, capturing the full envelope (model version, params, RAG chunk IDs, seed) so any incident replays deterministically.
5. **Convert every production incident into a free regression test** that stubs the model node and asserts on the node you changed — behavioral assertions, not string matches.
6. **Gate success on `verified`, never `attempted`**: read-after-write against the system of record for every mutating action; add tool receipts and a web-response OK/EMPTY/BLOCKED/DECOY classifier so the agent can't lie about tools or searches.
7. **Instrument implicit feedback on 100% of traffic** and route low-confidence / judge-disagreement / matched-failure traces to a human review queue whose corrections become golden rows.
8. **Run tagged production experiments** (treatment vs control, compare signal rates) before rolling a prompt/model change to everyone.
9. **For ops agents, adopt the three-layer architecture** (rules → policy → external safety override) with a small named action space, escalation as a first-class outcome, and reward separated from the guardrail.
10. **Deploy ops agents up the autonomy ladder** (read-only → advised → approved → bounded-autonomous) on a GitOps + policy-as-code foundation, firing autonomously only when confidence is high *and* blast radius is reversible.
