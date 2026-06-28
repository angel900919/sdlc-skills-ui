---
name: pm-phase-14-feedback
description: Runs Phase 14 (Customer Feedback Management) of the framework-agnostic PM operating system — stands up a closed-loop voice-of-customer system that turns raw signal into product change. Centralizes solicited + unsolicited feedback in one searchable repository under a governed taxonomy, triangulates CSAT/CES/NPS (each paired with open-text "why"), runs the inner loop (resolve the individual fast) and the outer loop (aggregate to root-cause themes), AI-clusters the full corpus into FB-* themes with sourced verbatims, maps them onto the Opportunity Solution Tree as candidate OPP-*, and closes the loop by telling customers what changed. Produces Feedback_Ops_Plan.md, Feedback_Log.md (Living), and Insight_Synthesis.md. It is a continuous phase — it owns no lifecycle gate; its "gate" is a recurring health check. Conforms to ../../05_Conventions.md. Use when you need to set up or run a feedback program, mine support tickets/calls/reviews at scale, define a feedback taxonomy, pick or fix CSAT/CES/NPS, synthesize feedback into opportunities, or close the loop with customers. Triggers on phrasings like "customer feedback", "voice of customer", "VoC", "close the loop", "inner/outer loop", "NPS", "CSAT", "CES", "feedback taxonomy", "feedback ops", "synthesize feedback", "support ticket mining", "feature requests", "what are customers saying", "phase 14".
disable-model-invocation: true
user-invocable: true
---

# Phase 14 — Customer Feedback Management

<what-to-do>

Stand up and run a **closed-loop voice-of-customer system**: collect signal from every channel, centralize it in one searchable repository under a governed taxonomy, **triangulate** CSAT/CES/NPS (never a lone score, always with an open-text "why"), run an **inner loop** (resolve the individual fast and tell them) and an **outer loop** (aggregate to root-cause themes that change the product), synthesize themes into candidate opportunities, and **close the loop** by showing customers what changed. **This is a continuous phase: it owns no lifecycle gate (`continuous — health check`).** It switches on at launch (after **G9**) and never switches off; its "gate" is a recurring health check, not a one-time pass. Conform to [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) for IDs (`FB-`), gate ladder, severity, status/frontmatter, the traceability spine, and folder layout — **cite the section, never redefine it**.

> **Prime directive (Conventions §7):** outcomes over outputs. **Feedback is raw material for discovery, not a backlog of orders.** Collecting feedback that never closes a loop, never changes the product, and never tells the customer is theatre — refuse it or mark the gap `TODO:`. Building whatever is requested most is a feature factory by request, not a strategy.

## Inputs (from prior phases)
Read these from the project tree ([Conventions §9](../../../pm-workflow/05_Conventions.md)) first; if one is missing, elicit + flag the source, and route a **gating** absence back. **Cross-reference by ID — never re-describe** (Conventions §4).
- **Launched product** (`G9`) — from `pm-phase-11-launch-gtm`. The loop turns on *at launch*. **If nothing is live yet → there is no feedback to manage; route back** (run the program design, but the loop is dormant until GA).
- **Analytics + KPI scorecard** (`MET-`, `Measurement_Plan.md`, `KPI_Scorecard.md`) — from `pm-phase-12-analytics`. Quant *behaviour* pairs with qual *feedback*; CSAT/CES/NPS are tagged `MET-`. Fallback: if instrumentation is thin, mark `TODO: pair feedback with usage data`.
- **Personas / JTBD / insights** (`PER-`, `JOB-`, `INS-`) — from `pm-phase-03-discovery`. The lens to interpret feedback; new themes route *back* here as discovery input.
- **Opportunity Solution Tree** (`OPP-`) — from `pm-phase-04-opportunity`. Outer-loop themes attach as candidate `OPP-` nodes under a desired outcome. Fallback: if no OST, flag `TODO: build OST`, capture themes anyway.
- **Segment / ARR / account data** (`STK-`, charter segments) — from `pm-phase-00-charter` / CRM. Needed to weight feedback by value (frequency ≠ importance). Never invent an ARR figure.
- **Continuous-discovery cadence** — the weekly-touch habit ([`../../cross-cutting/Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md)); feedback is this thread operationalised at scale.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, never a wall of questions). Use `AskUserQuestion` for finite choices. **Show back** every drafted taxonomy / theme / loop SLA for confirmation before writing. Reuse every fact already in the tree; never re-ask. Mark anything unknown as `TODO: <what is owed — by whom — by when>` — **never invent a verbatim, a quote, a CSAT/NPS score, a theme, or a request count** as if it were real.

1. **Identity & output location** (one message, related): confirm the project **slug**, which product/segment(s) this program covers, and the live channels. Default `<output-dir>` = `<product-slug>/14_Feedback/`.
2. **Map the channels & centralize** (topic 2). Inventory **solicited** (in-product microsurveys, CSAT/CES/NPS, interviews) *and* **unsolicited** signal — most signal is unstructured (~80%): support tickets, sales/CS call notes, reviews, social, community. Centralize all of it in **one searchable repository** linked to customer / segment / ARR — not scattered across inboxes, Slack, and spreadsheets.
3. **Design a governed taxonomy** (topic 3). `type × area × source × segment`. Keep it **governed** — prefer an **adaptive / AI-learned** taxonomy over a hand-maintained tag tree that sprawls. A consistent taxonomy is what makes feedback analyzable; over-tagging kills it.
4. **Choose the metric triangle** (topic 4). Use `AskUserQuestion`: **CSAT** (touchpoint satisfaction), **CES** (effort), **NPS** (relationship). No single metric tells the story — triangulate, and **always pair each score with an open-text "why."** Tag each as `MET-`. Capture in context (in-product) where possible.
5. **Stand up the two loops** (topic 5). **Inner loop** — resolve the individual customer fast (24–48h follow-up drives retention) and *tell them*. **Outer loop** — aggregate to root-cause `FB-` themes that drive product change. Set an explicit **closed-loop SLA** for each.
6. **Synthesize — AI at scale, human-validated** (topic 6). AI auto-clusters the *full corpus* (not a sample) into `FB-` themes with **sourced verbatims**; you validate each against the raw quotes. Weight by **importance, not raw frequency** — one enterprise renewal can outweigh hundreds of free-tier asks. Map surviving themes onto the **OST** as candidate `OPP-` (JTBD lens), not as features to build.
7. **Close the loop** (topic 7). Show customers what changed ("you said → we did"). AI drafts personalized replies and routes themes; **the human owns the conversation**. Collect-only with no "we shipped this" message is the classic failure.
8. **Responsible-product + AI red-team pass** (topic 8). Source-ground every AI theme to catch hallucination (human-in-the-loop is structural, not optional). Check consent/privacy on feedback data (PII in tickets/recordings); log `RSK-`.
9. **Write artifacts** to `<output-dir>` with Conventions §6 frontmatter: `Feedback_Ops_Plan.md`, `Feedback_Log.md` (`Living`, the `FB-` repository), `Insight_Synthesis.md`. Update `_threads/Decision_Log.md` (`DEC-` for loop/taxonomy/kill calls) and route candidate `OPP-` into discovery.
10. **Health check (continuous).** Walk the every-gate six-thread review + the health-check list below. This phase **never finishes** — re-run on a cadence; bump the minor version each cycle.
11. **Done.** Print all output paths; route themes: `pm-phase-03-discovery` / `pm-phase-04-opportunity` (new `OPP-`), `pm-phase-06-prioritization` (`FB-` volume + segment as Reach/Impact evidence), `pm-phase-13-experimentation` (qual themes → testable hypotheses).

## Decision points
- **Inner loop or outer loop?** *How to decide:* an individual unhappy customer who can be recovered → **inner** (resolve + reply within SLA). A recurring pattern that implies a product change → **outer** (theme it, root-cause, route to OST). Most programs over-invest in one and starve the other — run both.
- **Build the request, or treat it as inspiration?** *How to decide:* a feature *request* is a clue to a `JOB-`/`OPP-`, not an order. Translate to the underlying job, attach to the OST, and prioritize against an `OBJ/KR` (P06) — never build by request count.
- **Trust the AI theme, or verify?** *How to decide:* every AI cluster must be **source-grounded** to real verbatims before it informs a decision; spot-check against raw quotes. An ungrounded theme is a hypothesis, not evidence.
- **Frequency vs. importance.** *How to decide:* weight by segment, ARR, and strategic fit — not loudest/most-counted. Surface the count *and* the value; let the human make the trade-off.
- **Which metric to lead with?** *How to decide:* transactional moment → **CSAT/CES**; relationship/loyalty trend → **NPS** (as a *relationship* signal, never "the one number you need to grow"). Always with open-text.
- **Health-check verdict.** *How to decide:* both loops live + SLA met + taxonomy governed + themes traced to `OPP-`/`MET-` + customers told what changed → healthy. A drifting loop with no closed feedback or unverified AI themes → **Hold** the cadence and fix it; a theme that invalidates a live bet → **Pivot/Kill** that bet.

## Rules
- **Conform to Conventions, never redefine.** Gate ladder + continuous-phase status §2, IDs (`FB-`/`MET-`/`OPP-`/`DEC-`/`RSK-`) §3, traceability spine §4, severity §5, frontmatter/status §6 — cite the section.
- **Outcomes over outputs.** A `FB-` theme is "done" only when it closed a loop — changed the product (traced to an `OPP-`/`MET-`) *and/or* the customer was told ([Conventions §7](../../../pm-workflow/05_Conventions.md)).
- **Feedback is discovery input, not a build queue.** Translate requests to jobs/opportunities; never run a feature factory by request.
- **Close both loops.** Collect-without-acting and act-without-telling are the two canonical failures. Speed of follow-up (24–48h) drives retention.
- **Triangulate; pair every score with "why."** CSAT + CES + NPS, each with open-text. No bare satisfaction number; **NPS is a relationship signal, not a product metric.**
- **AI accelerates, the human decides.** AI clusters at full-corpus scale, auto-tags, answers NL queries, and drafts replies; the human owns prioritization/trade-offs, the **hallucination/source-grounding check**, context (frequency ≠ importance), and the conversation itself ([Conventions §11](../../../pm-workflow/05_Conventions.md)).
- **Governed taxonomy.** Adaptive/AI-learned over hand-maintained; prevent tag sprawl.
- **Never invent.** Unknown quote, score, or count = `TODO:` + a recommendation to pull from source or interview.
- **Pivot & Kill are valid.** Feedback that invalidates a bet should stop it — set sunk cost aside.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
All files carry the [Conventions §6](../../../pm-workflow/05_Conventions.md) frontmatter block. Blank templates live in [`../../templates/`](../../../pm-workflow/templates/).

- **`Feedback_Ops_Plan.md`** — the program design: channels & sources, the governed taxonomy, the metric triangle, the inner/outer loop SLAs, tooling/source-of-truth, ownership and cadence.
- **`Feedback_Log.md`** ★ (`Living`) — the searchable repository of `FB-` themes with sourced verbatims, taxonomy tags, segment/ARR weight, status, and trace to `OPP-`/`MET-`.
- **`Insight_Synthesis.md`** ★ — the outer-loop readout: root-cause themes mapped onto the OST as candidate `OPP-`, ranked by importance not frequency, with the loop-closing "you said → we did."

### `Feedback_Log.md` skeleton (copy, then replace every value)
```markdown
---
Document: Feedback Log — <Product>
Document ID: FBLOG-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager / Feedback Ops
Updated: <YYYY-MM-DD>
---
## Taxonomy (governed): type × area × source × segment
## Themes
| ID | Theme | Type | Area | Source(s) | Segment / ARR | Count | Sentiment | Linked MET / metric | → OPP | Loop status |
|---|---|---|---|---|---|---|---|---|---|---|
| FB-01 | <root-cause theme> | Bug/Request/Praise | <area> | tickets, NPS-why | Enterprise / $__ | 42 | neg | MET-03 (CES) | OPP-07 | Outer: routed |
| FB-02 | <theme> | Request | <area> | reviews, calls | SMB | 311 | mixed | MET-05 (CSAT) | TODO: triage | Inner: resolved+told |
```
> Every row cites a real source; an unsourced theme is `TODO:`, never a guess. `Count` is raw volume — read it next to `Segment/ARR`, not instead of it.

### `Insight_Synthesis.md` skeleton
```markdown
---
Document: Insight Synthesis — <Product> — <cycle YYYY-Qn>
Document ID: INSYN-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## Top themes this cycle (by importance, not raw count)
- FB-01 → OPP-07 (under OBJ-02/KR-03) — verbatim: "<sourced quote>" — recommendation: discovery / EXP-__.
## Frequency vs. importance call
<why a low-count enterprise theme outranks a high-count free-tier ask>
## Loop closed — "you said → we did"
| Theme | Change shipped | Customers told (channel · date) |
|---|---|---|
| FB-09 | <change> | in-app + email · <YYYY-MM-DD> |
```

## AI prompt pack
Copy-paste and fill the `<>` slots. Pair with [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md).
- **ELICIT —** "You are my AI-PM partner running Phase 14 for `<product>`. Interview me **one topic at a time** to design a closed-loop VoC system: channels (solicited + unsolicited), a governed `type × area × source × segment` taxonomy, the CSAT/CES/NPS triangle, and inner/outer loop SLAs. Reflect each answer back, trace themes to `OPP-`/`MET-`, mark gaps `TODO:`, and invent no scores or verbatims."
- **GENERATE —** "Cluster this raw feedback `<paste tickets / reviews / NPS-why>` into root-cause `FB-` themes. For each: a one-line theme, `type × area × source × segment` tags, count, sentiment, **2–3 sourced verbatims (quote the input — do not paraphrase into a new claim)**, and a candidate `OPP-` under an outcome. Rank by importance (weight enterprise/ARR), not raw frequency. Flag any theme you cannot ground in a quote."
- **CRITIQUE / RED-TEAM —** "Act as a hostile reviewer of this feedback program `<paste>`: (1) which themes are AI hallucinations with no source verbatim? (2) where is raw count masquerading as importance? (3) is any metric a bare NPS with no 'why'? (4) which loops are open (collected but never acted on or never told back)? (5) is the taxonomy sprawling/ungoverned? (6) are we about to build a request instead of solving the underlying job? Return a table: finding | severity (S1–S4) | why it matters | fix."
- **GATE —** "Run the Phase 14 health check below against this program. For each item: Pass / Gap (owner+date) / Waived. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill on the loop's health, with the evidence."

## Research & specialised-agent triggers
Per [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md): the AI proposes, you approve, findings are cited and traced.
- **Talk to a customer (Part A)** when a theme's *meaning* is ambiguous, when a request needs its underlying job surfaced, or to validate an AI cluster — feedback synthesis at scale **does not replace** the weekly discovery conversation. Capture `INS-`/`OPP-`; trace to the `FB-`.
- **Web research / Context7 (Part B)** when choosing/benchmarking a metric (CSAT vs. CES vs. NPS) or a feedback tool, or when a regulated vertical constrains how feedback (recordings, PII) may be stored — cite the source, never assert from memory.
- **Spawn an agent (Part C):** a **research-synthesis** agent to cluster the full corpus into `FB-` themes with sourced verbatims (you verify against raw quotes — outputs are inputs, not truth); an **adversarial-reviewer** agent to hunt hallucinated themes and frequency-as-importance errors; a **calc-verification** agent for any segment/ARR-weighting math.

## Cross-cutting hooks
Phase 14 seeds/feeds these threads (reviewed at every gate the loop spans):
- **Continuous Discovery** — feedback *is* continuous discovery at scale; outer-loop themes feed new `INS-`/`OPP-` back into P03/P04 → [`../../cross-cutting/Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md).
- **Metrics & Experimentation** — CSAT/CES/NPS are `MET-`; qual themes pair with quant behaviour and seed `EXP-` hypotheses → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../../pm-workflow/cross-cutting/Metrics_and_Experimentation.md).
- **Product Ops** — "**feedback ops**" lives here: the repository, the governed taxonomy, the loop SLAs, the tool stack, the cadence → [`../../cross-cutting/Product_Operations.md`](../../../pm-workflow/cross-cutting/Product_Operations.md).
- **Responsible Product (floor)** — consent/PII in tickets & call recordings; source-grounding AI themes; no dark-pattern "feedback" → [`../../cross-cutting/Responsible_Product.md`](../../../pm-workflow/cross-cutting/Responsible_Product.md).
- **Stakeholders** — closing the loop *with customers* and reporting themes to leadership (BLUF); loop/kill calls logged as `DEC-` → [`../../cross-cutting/Stakeholder_Management.md`](../../../pm-workflow/cross-cutting/Stakeholder_Management.md).
- **Portfolio** *(multi-product)* — cross-product theme patterns inform allocation → [`../../cross-cutting/Portfolio_Management.md`](../../../pm-workflow/cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md); cards in [`../../frameworks/`](../../../pm-workflow/frameworks/) (Conventions §8):
- **Inner Loop / Outer Loop** — resolve the individual fast vs. aggregate to product-changing themes.
- **CSAT / CES / NPS** — triangulated touchpoint / effort / relationship signals, each with open-text "why" (NPS as relationship, not product, metric).
- **Feedback taxonomy** — `type × area × source × segment`, governed (adaptive/AI-learned).
- **Opportunity Solution Tree** (Torres) — feedback as inspiration mapped to opportunities, not orders.
- **JTBD lens** (Switch/Forces, Moesta/Christensen) — translate a request to the causal job behind it.
- **Continuous discovery** + **support-ticket/call mining** (full-corpus, not sampling) + **closed-loop SLA** (24–48h).

## Exit-gate checklist
**P14 owns no lifecycle gate — it is a continuous phase.** There is no P14 block in [`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md); this is a **health check / done-when** list, run on a cadence (and the loop is reviewed inside the every-gate six-thread review while it spans the lifecycle). First run the **every-gate six-thread review** ([`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md)). Then the health check:
- [ ] All channels (solicited **and** unsolicited ~80%) flow into **one searchable repository** linked to customer/segment/ARR.
- [ ] Taxonomy is **governed** (`type × area × source × segment`); no sprawl; adaptive/AI-learned where possible.
- [ ] Metric triangle live — **CSAT/CES/NPS as `MET-`**, each paired with open-text "why"; no bare NPS-as-the-one-number.
- [ ] **Inner loop** live with a follow-up SLA (24–48h); **outer loop** themes root-caused into `FB-`.
- [ ] AI themes are **source-grounded** to real verbatims; human validated; frequency weighed against segment/ARR.
- [ ] Themes traced onto the **OST** as candidate `OPP-` and to a `MET-`; requests translated to jobs, not built by count.
- [ ] **Loop closed with customers** — "you said → we did" shipped; no collected-but-never-told gap.
- [ ] No fabricated quotes/scores/counts; gaps are `TODO:`; loop/kill calls logged as `DEC-`; consent/PII checked (`RSK-`).

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Collect a lot, act on little, tell customers nothing | Open loops; collection treated as the goal | Close **both** loops; ship "you said → we did"; 24–48h inner-loop SLA. |
| Building whatever is requested most | Feature factory by request; count = priority | Feedback is discovery input — translate to `JOB-`/`OPP-`, prioritize against `OBJ/KR` (P06). |
| NPS treated as "the one number you need to grow" | Over-reliance on one relationship metric | Triangulate CSAT/CES/NPS; use NPS as a relationship, not product, signal. |
| A satisfaction score with no "why" | Closed-ended survey only | Always pair every score with open-text; capture in context (microsurvey). |
| Feedback scattered across inboxes/Slack/sheets | No central repository | One searchable repo linked to customer/segment/ARR. |
| Reading a hand-picked sample of tickets | Manual, low-coverage analysis | Full-corpus AI mining of tickets/calls/reviews; spot-check, don't sample. |
| Tag tree sprawls; nothing is analyzable | Ungoverned, hand-maintained taxonomy | Govern it; prefer adaptive/AI-learned tags. |
| Blindly trusting AI-generated themes | Treating AI clusters as truth | Source-ground every theme to verbatims; human-in-the-loop is structural. |
| Loud free-tier ask outranks a quiet renewal | Frequency mistaken for importance | Weight by segment/ARR/strategy; show count *and* value. |
| Annual relationship survey as the primary listening | Point-in-time, lagging signal | Continuous in-context capture + always-on unsolicited mining. |

## References
- [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) — the contract (continuous-phase status + gate vocabulary §2, IDs `FB-` §3, traceability spine §4, severity §5, frontmatter/`Living` §6, outcomes-over-outputs §7).
- [`../../01_Workflow_Overview.md`](../../../pm-workflow/01_Workflow_Overview.md) — the continuous measure→learn→grow loop (§4); P14 feeds new `OPP-` back into P03/P04 discovery.
- [`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md) — the every-gate six-thread review (P14 has no dedicated gate block).
- **2026 research sources:** https://getthematic.com/insights/close-the-customer-feedback-loop · https://www.resonate.cx/blog/inner-loop-vs-outer-loop-in-voice-of-customer-programs/ · https://www.enterpret.com/guides/customer-intelligence-ai-for-product-managers-5-platforms-evaluated-for-2026 · https://measuringu.com/nps-discredited/ · https://www.producttalk.org/opportunity-solution-trees/ · https://www.productboard.com/blog/how-to-organize-customer-feedback/ · https://suprmind.ai/hub/insights/ai-hallucination-statistics-research-report-2026/
- **Related phases (by name):** `pm-phase-11-launch-gtm` (upstream — the loop turns on at G9) · `pm-phase-12-analytics` (quant behaviour to pair with qual feedback; CSAT/CES/NPS as `MET-`) · `pm-phase-13-experimentation` (qual themes → testable hypotheses) · `pm-phase-03-discovery` / `pm-phase-04-opportunity` (downstream — themes become new `OPP-`) · `pm-phase-06-prioritization` (`FB-` volume + segment as Reach/Impact evidence) · `pm-phase-15-growth` (retention signal feeds the growth model).
- **Curriculum:** [`../../../PM_Final_WF/04-product-launch-playbook.md`](../../../PM_Final_WF/04-product-launch-playbook.md) — post-launch feedback / iteration treatment; superseded by this skill where they disagree.

</supporting-info>
