# Research & Specialised Agents — the consolidated guide

> This is the cross-phase playbook for the two moves the [AI Systems Engineer Protocol §5](../02_AI_Systems_Engineer_Protocol.md) calls for but that no single phase owns: **when to recommend web research** (the answer is external and current) and **when to spawn a specialised agent** (a sub-task is deep enough to delegate). It expands Protocol §5 into concrete triggers, ready-to-paste invocation prompts, and a definition of what each must return. It conforms to [`05_Conventions.md`](../05_Conventions.md): findings carry IDs and traces, unknowns become `TODO:` (never invented numbers/regs/results), and citations use the §9 canonical forms.

> **House rule first (read this before anything else).** Any question about a **library, framework, SDK, API, CLI tool, or cloud service** — even well-known ones (React, Next.js, Prisma, Django, Spring Boot, AWS/GCP/Azure services) — goes through the **Context7 docs MCP first**, *before* a general web search: `resolve-library-id` → `query-docs`. Context7 returns current, version-accurate docs your training data may not reflect. Use a general web search only when Context7 has no coverage, or for things that aren't library docs (regulations, market prices, comparables, vendor SLAs). Do **not** use Context7 for refactoring, business-logic debugging, code review, or general programming concepts — those aren't doc lookups.

---

## Part A — When to recommend WEB RESEARCH

The rule: **the AI never silently guesses on something knowable and external.** It states *what* to look up and *why it matters to this decision*, and marks the dependent artifact `TODO: confirm via research` until you supply or approve the finding. The four standing triggers:

### Trigger 1 — Domain regulations & standards that gate the design
**Fires when:** a `D` (domain) or `SEC`/`SAF` requirement cites a standard or a vertical regulation is in scope — medical (IEC 62304, FDA), automotive (ISO 26262), avionics (DO-178C), payments (PCI-DSS), privacy (GDPR/HIPAA), accessibility (WCAG), environmental (RoHS/WEEE), or a specific safety mark (UL/CE/FCC). You need the **current edition, the binding clause, and its acceptance criteria** — not a half-remembered version.

> **Invocation prompt.**
> ```
> Research the current, binding requirements of <standard/regulation, e.g. IEC 62304> as it applies
> to <system> in the <domain> domain and jurisdiction <region>. Return: the current edition/year;
> the specific clauses that gate our design; for each clause, the concrete acceptance criterion we'd
> have to meet; what evidence an auditor expects; and whether any clause is mandatory vs.
> recommended. Cite the source and edition for every point. Use the Conventions §9 canonical citation
> form. Flag anything ambiguous as "confirm with a regulatory specialist" rather than asserting it.
> ```
> **Must return:** edition + clause numbers, per-clause acceptance criteria and required evidence, mandatory-vs-recommended split, and a citation per claim — feeding `REQ-D-*`/`REQ-SAF-*` with a verified standard reference.

### Trigger 2 — Comparables & benchmarks to sanity-check a target
**Fires when:** you're about to commit a threshold (latency, throughput, MTBF, availability, accuracy, cost-per-unit) and have no basis for the number — a `P`/`O` requirement, an `MOP`/`TPM` target, or a decision-matrix score. Research what's *realistic for this class of system* so the target isn't plucked from air.

> **Invocation prompt.**
> ```
> Find published benchmarks / comparable-system figures for <metric, e.g. p95 API latency / MTBF /
> uptime / $ per transaction> for systems comparable to <system> in <domain> at <scale>. Return a
> small table: source | comparable system | the figure | conditions/caveats | year. Then give a
> defensible target RANGE for us and state the assumptions. Do NOT collapse to a single number I
> should adopt blindly — show the spread so I set the threshold deliberately. Cite every figure.
> ```
> **Must return:** a sourced table of real figures with conditions, a defensible *range* (not one fabricated number), and the assumptions — so a `P`/`O` `REQ` or a `TPM` threshold is set on evidence, not a guess.

### Trigger 3 — Tool / vendor / protocol capabilities & licensing
**Fires when:** a stack, vendor, protocol, or tool decision is imminent (Phase 04/05), or you need a protocol's current status ("is OCPP 2.1 released?", "SysML v2 tooling maturity"). **Library/framework/SDK/cloud specifics → Context7 first** (see house rule); use web research for licensing terms, vendor lock-in, roadmap/EoL, market positioning, and protocol ratification status that Context7's docs won't cover.

> **Invocation prompt (web-research portion — after Context7 for the API/config specifics).**
> ```
> For the decision "<choose X for <system>>", compare <candidate tools/vendors/protocols> on:
> licensing model and cost (note any AGPL/GPL/commercial restriction), current stable version and
> release/EoL status, protocol/spec ratification status if relevant, vendor lock-in and exit cost,
> ecosystem maturity, and known limitations at our scale. Return a comparison table + a one-line
> recommendation per candidate with the evidence. Cite sources with dates. For exact API/config/CLI
> usage, note that I will confirm those via the Context7 docs MCP, not here.
> ```
> **Must return:** a comparison table (license, version/EoL, lock-in, limitations) with dated citations — feeding a Phase-05 `DM-<nn>` and the `Tech_Stack_Rationale.md`, while API/config details are deferred to Context7.

### Trigger 4 — Cost inputs feeding a trade-off, COCOMO, or budget
**Fires when:** a `C` (budget) requirement, a decision-matrix Cost criterion, a TCO/NPV model, or a COCOMO estimate needs *real* numbers — component prices, cloud pricing, license fees, labour rates, energy cost.

> **Invocation prompt.**
> ```
> Gather current cost inputs for <system>'s <cost model: TCO / NPV / COCOMO calibration>. I need:
> <list the line items — e.g. cloud compute SKU $/hr, component unit price at <qty>, license $/seat/yr,
> energy $/kWh in <region>>. Return a table: line item | unit cost | source | date | assumptions
> (region, volume, commitment tier). Note volatility and whether a quote is needed for accuracy.
> Do NOT estimate a price you can't source — mark it "TODO: get vendor quote". Cite everything.
> ```
> **Must return:** a sourced, dated cost table with assumptions and volatility notes; unsourced items left as `TODO: get vendor quote` — feeding the Cost criterion / TCO / COCOMO without inventing prices.

> **In all four:** the AI states the trigger, runs (or recommends) the lookup, and keeps the dependent artifact at `TODO: confirm via research` until you approve the finding. It records the source per [Conventions §9](../05_Conventions.md). It does **not** proceed on a guessed regulation, benchmark, capability, or price.

---

## Part B — When to spawn a SPECIALISED AGENT

A sub-task earns its own agent when it's **deep, self-contained, and either parallelisable or in need of an independent check.** The AI proposes the agent, the prompt, and what it should return — **you approve before it fans out** (Protocol §5). Outputs of research/domain agents are treated as **input to verify, not truth.**

| Agent | Spawn it when… | Example invocation prompt | Must return |
|---|---|---|---|
| **Deep-research** | Broad fact-finding spans many sources — regs, comparables, vendor docs, market data — too much for an inline lookup. (Triggers 1–4 at scale.) | "Act as a deep-research analyst. Question: `<the scoped question>`. Fan out across primary and reputable secondary sources, verify each claim against ≥2 independent sources, and synthesise a **cited brief**. For each finding give: claim, evidence, source + date, and confidence. List open questions and anything you could NOT verify. Do not state an unverified claim as fact." | A cited brief: findings with sources/dates/confidence, contradictions surfaced, an explicit "could not verify" list. Feeds `TODO:` resolution. |
| **Builder / coding** | A self-contained build/diagram/pipeline task: generate the 7-of-9 PlantUML diagrams, scaffold a CI/CD pipeline, write a load test, produce a config recipe. | "Act as a builder. Deliverable: `<e.g. the 7 PlantUML diagrams for <system> from this BDD/IBD/Use-Case spec>`. Constraints: follow Conventions §7 file names (`Use_Case_Diagram.puml`, `BDD.puml`, …) and the SysML relationship vocabulary (derive/refine/satisfy/verify). Output runnable/renderable artifacts plus a short note on assumptions and any TODOs. For any library/tool/CLI specifics, consult the Context7 docs MCP first." | Runnable/renderable artifacts named per §7, an assumptions note, and listed TODOs — ready to drop into the project folder (§10). |
| **Adversarial reviewer** | A skeptical second opinion on a baseline, decision, safety case, or gate package — *prompted to refute, not reassure.* (Pairs with reusable pattern #5.) | "Act as a hostile reviewer at the `<gate>` gate. Refute this `<artifact>`: find unstated assumptions, the weakest element, internal contradictions, missing-but-expected content, and any number/reg/result asserted without evidence. Return a table: finding | severity (S1–S4 per Conventions §5.1) | location | why it matters | fix. End with the question this draft cannot answer." | A severity-ranked findings table (using `S1`–`S4`) and the killer gate question — surfacing weaknesses before the real review. |
| **Calculation / verification** | Numbers must be re-derived and **independently checked**: COCOMO (E=a·KLOC^b, T=c·E^d, N=E/T), decision-matrix weighted totals, reliability/availability allocation, sensitivity cases. | "Act as a calculation-verification agent. Independently recompute `<COCOMO / DM-<nn> totals / reliability allocation>` from these inputs and constants `<…>`. Show every step. Verify internal identities hold (e.g. `T=c·E^d`, `N=E/T`; weighted totals match the matrix). Flag any arithmetic error, dropped exponent, or copy-paste garble. Give ±20% sensitivity where relevant. Do not trust the printed numbers — derive your own and compare." | A recomputation with steps shown, a pass/fail on each internal identity, a flagged list of discrepancies, and sensitivity — checked *independently* of the original. |
| **Domain-expert persona** | Domain depth the generalist lacks: RF, power electronics, clinical workflow, tax/regulatory law, control theory. Its output is **input to verify, not ground truth.** | "Act as a `<domain>` expert (e.g. power-electronics engineer). For `<system>`, advise on `<the specific domain question>`: the governing principles, the standard approach, the common failure modes, and what a non-specialist would get wrong. Cite domain standards (Conventions §9 where applicable). Mark any point I MUST validate with a credentialed specialist before baselining." | Domain guidance with governing principles, failure modes, cited standards, and explicit "validate with a credentialed specialist" flags on anything load-bearing. |

### Standing rules for agents (all of the above)
1. **Propose, then approve.** The AI shows you the agent, its prompt, and the expected return *before* fan-out.
2. **Verify, don't trust.** Research/domain/calculation outputs are inputs to check — independently re-verify load-bearing numbers (a calculation agent's result still gets a second check).
3. **Trace the result.** Every finding lands as a `TODO:` resolution, a cited input to a `REQ`/`DM`/`ICD`, or a logged `RSK-<nn>` — with its source per [Conventions §9](../05_Conventions.md). Nothing enters a baseline un-sourced.
4. **No invention.** An agent that can't find/verify something returns a "could not verify" gap, not a plausible-looking fabrication.
5. **Right-size.** Don't spawn an agent for a one-line lookup; don't inline a 30-source regulatory sweep. Match the weight of the task.

---

## Quick decision aid — which move?

```
Is the question about a library / framework / SDK / API / CLI / cloud service?
   └─ YES → Context7 docs MCP first (resolve-library-id → query-docs). Web search only if no coverage.
   └─ NO  → Is the answer external + current (reg, benchmark, vendor licensing, price)?
              └─ YES, and small/inline  → WEB RESEARCH (Part A trigger 1–4).
              └─ YES, but broad/many-source → spawn a DEEP-RESEARCH agent.
   Is it a self-contained build (diagrams, pipeline, load test)?  → BUILDER agent.
   Need an independent skeptical refutation of a draft/decision?  → ADVERSARIAL-REVIEWER agent.
   Must numbers be re-derived and checked (COCOMO, DM totals)?    → CALCULATION/VERIFICATION agent.
   Need depth a generalist lacks (RF, clinical, tax law)?         → DOMAIN-EXPERT agent (verify output).
```

Every path ends the same way: the finding is **cited, traced, and treated as input to verify** — and any remaining unknown stays a `TODO:` until evidence closes it.

## See also
- [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md) — the cross-phase prompt patterns; many emit the `TODO:` items that fire these triggers.
- [`../02_AI_Systems_Engineer_Protocol.md`](../02_AI_Systems_Engineer_Protocol.md) §5 — the source this guide expands.
- [`../05_Conventions.md`](../05_Conventions.md) §9 — canonical citation forms for every regulation/standard a research finding references.
- Each phase's `## Research & specialised-agent triggers` section (in its `SKILL.md`) — the *phase-specific* version of these triggers; this guide is the cross-phase consolidation.
