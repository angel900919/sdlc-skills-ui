# Research, Interviews & Specialised Agents — the consolidated guide

> This is the cross-phase playbook for the three moves the [AI Product Manager Protocol §5](../02_AI_Product_Manager_Protocol.md) calls for but that no single phase owns: **when to talk to a customer** (the answer is about real needs/behaviour), **when to recommend web research** (the answer is external and current), and **when to spawn a specialised agent** (a sub-task is deep enough to delegate). It conforms to [`05_Conventions.md`](../05_Conventions.md): findings carry IDs and traces, unknowns become `TODO:` (never invented numbers/quotes/results), and the AI **accelerates while the human decides**.

> **House rule first.** Any question about a **library, framework, SDK, API, CLI tool, or cloud service** — even well-known ones — goes through the **Context7 docs MCP first** (`resolve-library-id` → `query-docs`), *before* a general web search. Use a general web search for things that aren't library docs: market size, competitive/pricing intel, regulations, benchmarks, vendor capabilities. Do **not** use Context7 for refactoring, business-logic debugging, or general concepts.

---

## Part A — When to talk to a CUSTOMER (the most-skipped move)

The single most common PM failure is answering a customer question from the conference room. **If the question is about what customers need, want, do, or struggle with — the answer is a customer, not a search engine and not a meeting.**

**Fires when:** you're asserting a need/pain/job; you're sizing demand from gut; a stakeholder says "customers want X"; you're choosing between solutions; you're writing personas or a JTBD; a metric moved and you don't know *why*.

> **The continuous-discovery default ([Phase 03](../../.claude/skills/pm-phase-03-discovery/), [thread](../cross-cutting/Continuous_Discovery.md)):** maintain a **weekly** customer touch. Small and frequent beats big and rare. You don't need a study — you need 3–5 conversations this week.

> **Invocation (the AI proposes this, you run the interviews).**
> ```
> We're about to commit to <decision>. The load-bearing assumption is <ASM-nn: customers experience X>.
> Recruit 5 people in <segment> and run a 30-min discovery interview this week. Ask about the LAST TIME
> they faced <situation> (story-based, past behaviour — not "would you?"). Capture: the job they were
> trying to do, the struggle, current workarounds, and what "better" would mean. Do NOT pitch a solution.
> Log each as INS-nn and tag the OPP-nn it informs. We hold <decision> at TODO until 5 interviews are in.
> ```
> **Must produce:** ≥3–5 interview notes → `INS-*` insights → `OPP-*` on the opportunity solution tree. Never let a guessed need enter a roadmap.

When raw interview/feedback volume is large, delegate **synthesis** (not judgment) to a **research-synthesis agent** (Part C) — then verify its themes against the raw quotes yourself.

---

## Part B — When to recommend WEB RESEARCH

The rule: **the AI never silently guesses on something knowable and external.** It states *what* to look up and *why it matters to this decision*, and keeps the dependent artifact at `TODO: confirm via research` until you approve the finding. The standing triggers are below; first, *how* to execute one.

### How to execute a web-research trigger — the ladder

Match the executor to the weight of the question. Each rung produces something more durable than the last; **every rung still cites sources and never invents figures.**

| Rung | Use it for | How |
|---|---|---|
| **1. Inline `WebSearch` / `WebFetch`** | a quick, in-the-moment fact (one number, one date, "is X released?") | the AI searches and fetches the primary source, cites it inline, moves on |
| **2. `/research-report` skill** *(the workhorse)* | a *substantive* research step that should leave a **durable cited artifact** — market sizing, competitive landscape, a benchmark set, a regulation deep-dive, or a **decision brief** (build-vs-buy, tool/vendor choice, positioning options) | run `/research-report`; it plans sub-questions, reads primary sources, **cross-checks every claim against ≥2 sources**, and writes a cited report (or decision brief) to `reports/`. Feed that report in as the evidence behind the phase artifact (e.g. `Market_Analysis.md`, `Business_Case.md`). |
| **3. `researc_agent` CLI** or built-in **`/deep-research`** | a *heavy*, standalone sweep too big for inline work — a full market/regulatory landscape | `researc_agent` is an out-of-session terminal run: `npm run research -- "<question>"` (cited report → `reports/`, audited). `/deep-research` does heavier fan-out + adversarial verification in-session. Pull the resulting `reports/*.md` back in as a cited source. |

> **Preferred for the workflow's substantive research steps: rung 2 (`/research-report`).** It matches this guide's posture exactly — primary sources over summaries, mandatory cross-checking, a Caveats section for the unverified, and a durable artifact on disk. Its **Decision-brief** mode is the right tool for P02 positioning, P04 build-vs-buy, and any tooling choice.
>
> **Portability / graceful fallback.** The `/research-report` skill ships in this workflow's `project-starter/.claude/skills/` (so it travels with the bundle). The `researc_agent` CLI lives in the master repo, not the bundle (it needs the Agent-SDK/OAuth setup). If neither is present in a given repo, **rung 1 (plain `WebSearch`) is always valid** — you just don't get the saved cited report.

### Trigger 1 — Market size, growth & trends (P02, P04)
**Fires when:** you need TAM/SAM/SOM, market growth, adoption curves, or category trends for the business case.
> ```
> Size the market for <product> serving <segment> in <geography>. Return: (a) a top-down estimate from
> published market reports (cite each: report, figure, year) AND (b) a bottom-up estimate from
> #target-users × ARPU; reconcile the two. Give SAM and a realistic SOM with assumptions stated. Note
> growth rate and 2-3 trends shaping demand. TAM is an opportunity CEILING, not a forecast — label it so.
> Cite every figure with source + year. Mark anything unsourced as "TODO: get a quote/primary source".
> ```
> **Must return:** reconciled top-down + bottom-up sizing, SAM/SOM, growth + trends, every figure cited — feeding the `Business_Case.md` and `Market_Analysis.md`.

### Trigger 2 — Competitive & positioning intel (P02, P11)
**Fires when:** you're building a competitive grid, choosing positioning, or pricing.
> ```
> Map the competitive landscape for <product> in <category>. For each of the top 5-7 competitors
> (direct + 1-2 indirect/"do nothing"): offering, target segment, differentiators, pricing & packaging,
> recent moves, and where they're vulnerable. Then identify the positioning white-space we could own
> (per April Dunford's framing: competitive alternative → unique value → who cares most). Cite sources
> with dates. Flag rumored/unconfirmed items as such.
> ```
> **Must return:** a competitor table + a white-space/positioning recommendation with dated citations — feeding `Competitive_Analysis.md` and `Positioning_Brief.md`.

### Trigger 3 — Benchmarks to sanity-check a target (P12, P13, P15)
**Fires when:** you're about to set a target (activation %, retention curve shape, conversion, NPS/CSAT norm, experiment MDE) with no basis.
> ```
> Find published benchmarks for <metric, e.g. D30 retention / free-to-paid conversion / activation rate>
> for products comparable to <product> in <category> at <stage>. Return a small table: source | comparable
> | figure | conditions | year. Then give a defensible target RANGE for us with the assumptions. Do NOT
> collapse to one number to adopt blindly — show the spread so I set the target deliberately. Cite each.
> ```
> **Must return:** a sourced benchmark table + a defensible range (not a single fabricated number) — feeding a `MET-*` target or an experiment's minimum detectable effect.

### Trigger 4 — Regulation / compliance that gates the product (Responsible Product thread, P08, P16)
**Fires when:** a feature touches personal data, AI-driven decisions, children, health, finance, accessibility, or a regulated vertical.
> ```
> Research the current, binding obligations of <regulation, e.g. GDPR / EU AI Act / CCPA / HIPAA / WCAG>
> as they apply to <product feature> for users in <jurisdiction>. Return: the current version/year, the
> specific obligations that gate our design, the concrete acceptance criterion for each, what evidence
> is expected, and mandatory-vs-recommended. Cite the source for every point. Flag anything ambiguous as
> "confirm with Legal/Privacy" rather than asserting it.
> ```
> **Must return:** version + obligations + per-obligation acceptance criteria + evidence, each cited — feeding the `Responsible_Product_Review.md` and PRD `SEC`/`C` requirements. **Never assert a regulation from memory.**

### Trigger 5 — Tool / vendor capabilities & pricing (any stack decision)
**Fires when:** choosing an analytics/experimentation/feedback/PLG tool or any vendor. *Library/API specifics → Context7 first.*
> ```
> For the decision "<choose X for <product>>", compare <candidates> on: capability fit for our use case,
> pricing at our scale, data/privacy posture, integration effort, lock-in/exit cost, and known limits.
> Return a comparison table + a one-line recommendation per candidate with evidence. Cite with dates.
> For exact API/config/SDK usage I'll confirm via Context7, not here.
> ```
> **Must return:** a comparison table with dated citations — feeding the stack decision in `Operating_Model.md` / `Tracking_Plan.md`.

> **In all five:** the AI states the trigger, runs (or recommends) the lookup, and holds the dependent artifact at `TODO: confirm via research` until you approve. It records the source. It does **not** proceed on a guessed market, competitor, benchmark, regulation, or price.

---

## Part C — When to spawn a SPECIALISED AGENT

A sub-task earns its own agent when it's **deep, self-contained, and either parallelisable or in need of an independent check.** The AI proposes the agent, the prompt, and the expected return — **you approve before it fans out** (Protocol §5). Outputs of research/synthesis/domain agents are **input to verify, not truth.**

| Agent | Spawn it when… | Example invocation | Must return |
|---|---|---|---|
| **Deep-research** | Broad market/competitive/regulatory fact-finding spans many sources. | "Act as a deep-research analyst. Question: `<scoped question>`. Fan out across primary + reputable secondary sources, verify each claim against ≥2 independent sources, synthesise a **cited brief** with claim / evidence / source+date / confidence. List what you could NOT verify. Don't state unverified claims as fact." | A cited brief; contradictions surfaced; an explicit "could not verify" list. Feeds `TODO:` resolution. |
| **Research-synthesis** | A pile of interviews/feedback/tickets needs theming. | "Act as a research synthesiser. From these <N> interview notes / feedback items, cluster into themes. For each theme: the pattern, frequency, 2-3 verbatim quotes, and the candidate `OPP-*` it implies. Flag any theme supported by <3 sources as weak. Do not invent quotes." | Themes with frequency + real quotes + candidate opportunities — **you verify against raw data** before acting. |
| **Adversarial reviewer** | A skeptical second opinion on a strategy, prioritization, PRD, or launch plan. | "Act as a hostile reviewer at the `<gate>` gate. Refute this `<artifact>`: unstated assumptions, weakest evidence, the riskiest untested assumption, missing NFRs/stakeholders, vanity metrics, anything asserted without a source. Return a table: finding | severity (S1-S4) | location | why it matters | fix. End with the question this draft can't answer." | A severity-ranked findings table + the killer gate question — surfaces weakness before the real review. |
| **Calculation / verification** | Numbers must be re-derived and checked: RICE/ICE/WSJF scores, TAM build-up, unit economics, experiment power/sample size. | "Act as a calc-verification agent. Independently recompute `<RICE for these items / TAM / sample size for MDE x at power 0.8>` from these inputs. Show every step, verify identities, flag arithmetic/logic errors, give ±20% sensitivity. Don't trust the printed numbers — derive your own and compare." | A recomputation with steps, pass/fail per check, flagged discrepancies, sensitivity — checked *independently*. |
| **Domain-expert persona** | Depth the generalist lacks: a regulated vertical, pricing science, growth modelling, a technical constraint. | "Act as a `<domain>` expert. For `<product>`, advise on `<question>`: governing principles, the standard approach, common failure modes, what a non-specialist gets wrong. Cite where applicable. Mark anything I MUST validate with a credentialed specialist before committing." | Domain guidance with principles, failure modes, citations, and explicit "validate with a specialist" flags. |

### Standing rules for agents
1. **Propose, then approve.** The AI shows you the agent, its prompt, and the expected return *before* fan-out.
2. **Verify, don't trust.** Research/synthesis/domain/calc outputs are inputs to check — re-verify load-bearing numbers and themes independently.
3. **Trace the result.** Every finding lands as a `TODO:` resolution, a cited input to an `OPP`/`MET`/`REQ`, or a logged `RSK-*` / `DEC-*` — with its source. Nothing enters a baseline un-sourced.
4. **No invention.** An agent that can't find/verify returns a "could not verify" gap, not a plausible fabrication. **Especially: never let an AI-generated "customer insight" stand in for a real one.**
5. **Right-size.** Don't spawn an agent for a one-line lookup; don't inline a 30-source market study.

---

## Quick decision aid — which move?

```
Is the question about what customers NEED / WANT / DO / STRUGGLE with?
   └─ YES → TALK TO A CUSTOMER (Part A). Continuous discovery, weekly. Synthesise large volume via an agent.
   └─ NO  → Is it about a library / framework / SDK / API / CLI / cloud service?
              └─ YES → Context7 docs MCP first. Web search only if no coverage.
              └─ NO  → Is the answer external + current (market, competitor, benchmark, regulation, price)?
                         └─ YES, quick fact       → inline WEB RESEARCH (Part B trigger 1-5).
                         └─ YES, want a cited doc → run /research-report (durable report or decision brief → reports/).
                         └─ YES, heavy sweep      → researc_agent CLI (npm run research) or /deep-research agent.
   Need a pile of qual data themed?       → RESEARCH-SYNTHESIS agent (you verify themes).
   Need a skeptical refutation of a draft? → ADVERSARIAL-REVIEWER agent.
   Must numbers be re-derived & checked?   → CALCULATION/VERIFICATION agent.
   Need depth a generalist lacks?          → DOMAIN-EXPERT agent (verify output).
```

Every path ends the same way: the finding is **cited, traced, and treated as input to verify** — the human makes the call, and any remaining unknown stays a `TODO:` until evidence closes it.

## See also
- [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md) — cross-phase prompt patterns; many emit the `TODO:`s that fire these triggers.
- [`ai-prompt-library.md`](ai-prompt-library.md) — the phase-by-phase ready-to-paste prompt library.
- [`../02_AI_Product_Manager_Protocol.md`](../02_AI_Product_Manager_Protocol.md) §5 — the source this guide expands.
