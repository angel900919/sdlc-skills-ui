# AI Prompt Library — phase by phase, ready to paste

> The consolidated, copy-paste prompt library for the PM operating system. One section per lifecycle phase (00 → 16); each gives you the four prompt **intents** as ready-to-run prompts. Every prompt here is curated from the matching phase skill's *AI prompt pack* (`../skills/pm-phase-NN-*/SKILL.md`) — this file is the single place to grab them all. It runs on the [AI Product Manager Protocol](../02_AI_Product_Manager_Protocol.md) and the conventions in [`../05_Conventions.md`](../05_Conventions.md) (gates G0–G10, PM ID grammar, outcomes-over-outputs, **AI accelerates — the human decides**).

## How to use this library

1. Find your phase below. Copy the prompt for the move you're making.
2. Fill every `<slot>`. Paste the relevant prior-phase artifacts inline when the prompt asks for them.
3. **Name the intent** at the top of your message so the AI knows the mode.
4. Verify before anything enters a baseline — especially a "customer insight," metric, or market number.

**Markers.** A prompt tagged **🔎** needs **live/external data** (market size, competitor moves, benchmarks, pricing, regulation) — pair it with [`research-and-agents.md`](research-and-agents.md), and **never** trust memory for those facts. **House rule:** any question about a library, framework, SDK, API, CLI tool, or cloud service goes through **Context7 docs MCP first** (`resolve-library-id` → `query-docs`) before a web search.

## The four intents (use them everywhere)

Every phase uses the same four moves — see [`README.md`](README.md) and [Protocol §2](../02_AI_Product_Manager_Protocol.md) for the operating loop behind them:

1. **ELICIT** — *the AI interviews you, one topic at a time, to produce an artifact.* "Don't dump every question at once; use AskUserQuestion for finite choices; show-back and confirm." You supply the truth.
2. **GENERATE** — *the AI drafts the artifact from your inputs, in the template shape.* "Flag every unsupported claim as `TODO:`; invent nothing." You verify.
3. **CRITIQUE** — *the AI red-teams the draft as a skeptic.* "Weakest evidence, riskiest untested assumption, vanity metrics, missing NFRs/stakeholders, outputs with no outcome — ranked S1–S4." You harden it.
4. **GATE** — *the AI plays the gate board, not a rubber stamp.* "Given the evidence, recommend Persevere / Persevere-with-actions / Pivot / Hold / Kill, and justify it." You decide and own it.

**Standing rules baked into every prompt** ([Protocol §10](../02_AI_Product_Manager_Protocol.md)): AI accelerates, the human decides; never invent customer evidence, numbers, or quotes (unknowns → `TODO: <what's owed>` + a research/interview recommendation); trace everything per [Conventions §4](../05_Conventions.md) — every bet links to an opportunity and a metric.

---

## Phase 00 — Product Charter & Operating Setup

> Gate: **G0 Kickoff** — agree the mandate, team, cadence, and decision rights. Source: [`pm-phase-00-charter`](../skills/pm-phase-00-charter/SKILL.md).

**ELICIT** — interview me to fill the charter, operating model, and stakeholder map
```
You are my AI product manager running Phase 00. Ask me, one topic at a time, the questions needed to fill a Product Charter, an Operating Model, and a Stakeholder Map for <product> (stage <idea/0→1/growth>). Start with product identity and the tailoring profile. After each answer, reflect it back, mark anything I can't answer as TODO:, and move on. Do not invent a sponsor, segment, metric, or tool.
```

**GENERATE** — draft `Product_Charter.md`
```
Using my answers above and the section shapes in this skill, draft Product_Charter.md with Conventions §6 frontmatter (Document ID: CHARTER-<SLUG>-v0.1, Status: Draft). Make the success definition an outcome (a moved metric), not a feature list. List any dropped phase as "tailored out: <reason>". Seed — do not author — vision/OKRs (→ P01).
```

**CRITIQUE** — red-team the charter as a skeptical sponsor
```
Act as a skeptical sponsor challenging G0 Kickoff. Attack this charter + stakeholder map: Is success an outcome or a disguised feature list? Is there a real, funding sponsor or just a wish? Is the problem space confused with a solution? Does the RACI have exactly one Accountable? Is "stakeholder management" here collaboration or managing-up theater? Is the responsible-product floor set now or deferred to legal/launch? List blocking gaps that should Hold or Pivot the gate.
```

**GATE** — run G0 as a real decision
```
Run G0 as a real decision, not a rubber stamp. Walk the Exit-gate checklist + the six-thread review; for each item mark Met / TODO: (owner+date) / Waived. Then recommend one of Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence, and name the next command.
```

---

## Phase 01 — Product Strategy & Vision

> Gate: **G1 Strategy Sign-off** — decide where we're going and why we'll win. Source: [`pm-phase-01-strategy`](../skills/pm-phase-01-strategy/SKILL.md).

**ELICIT** — interview me to fill vision, a Rumelt-kernel strategy, and North Star + OKRs
```
You are my principal PM running Phase 01 (Strategy). Interview me one topic at a time to fill a Vision, a Rumelt-kernel Product Strategy, and a North Star + OKRs for <product> serving <segment> (mandate from the charter: <…>). Start with the vision (the customer's better future), then the diagnosis (the one obstacle that decides whether we win). Reflect each answer back, mark unknowns TODO:, and never invent a market number or a customer claim.
```

**GENERATE** — draft strategy stack, candidate North Stars, and OKRs
```
Given my diagnosis <…>, guiding policy <…>, and segment <…>, draft (a) a Product Strategy Stack alignment, (b) 3 candidate North Star metrics with the input-metric tree under each, and (c) 1–3 Objectives with measurable Key Results that move those metrics. Flag any figure I haven't supplied as TODO: — do not fabricate baselines.
```

**CRITIQUE** — red-team the strategy as the leadership review board
```
Act as the leadership review board challenging G1. Attack this strategy: Is there a real diagnosis or just goals and adjectives (Rumelt fluff test)? Is the North Star a value-exchange metric or a vanity metric that can rise while customers churn? Are the OKRs outcomes or disguised output? Is there an explicit non-goals list, or does this try to do everything? Is distribution addressed? List the gaps that should force Persevere-with-actions, Pivot, or Kill.
```

**GATE** — run the G1 Strategy Sign-off
```
Run the G1 · Strategy Sign-off checklist against Vision.md, Product_Strategy.md, and North_Star_and_OKRs.md. For each criterion return Pass / TODO(owner·date) / Waived(rationale). Then recommend a verdict — Persevere / Persevere-with-actions / Pivot / Hold / Kill — with the evidence, and the next command.
```

---

## Phase 02 — Market & Competitive Research

> Supporting phase (no own gate) — feeds G1/G3. Source: [`pm-phase-02-market-research`](../skills/pm-phase-02-market-research/SKILL.md).

**ELICIT** — propose a demand-side market definition to confirm
```
From 00_Charter/Product_Charter.md and 03_Discovery/JTBD.md, propose a demand-side market definition (segment + functional job, not category). List the assumptions it rests on and ask me to confirm before we size anything.
```

**GENERATE 🔎** — build reconciled TAM/SAM/SOM and the alternatives list
```
Build TAM/SAM/SOM two ways: top-down from <analyst sources> and bottom-up from <accounts×ACV / users×ARPU>. Reconcile within 15%, flag each assumption as ASM-??, and refuse to produce a "capture 1% of $X B" number. Then draft the status-quo-first list of competitive alternatives.
```

**CRITIQUE** — challenge the market research
```
Challenge this market research: (1) is the market defined by a job or by our category? (2) is sizing single-method or unreconciled? (3) are any competitors "phantoms" no buyer evaluates, and is the status quo missing? (4) which CI claims are scraped/asserted vs buyer-validated? (5) does the positioning start from the category we want rather than the alternatives? (6) which AI-surfaced trend is unvalidated?
```

**GATE (handoff)** — check the done-when list and what to surface
```
Check P02 against its done-when list. Confirm SOM is defensible bottom-up, win/loss-grounded battlecards exist, positioning follows the Dunford order, and candidate OPP-*/RSK-*/DEC-* are surfaced for P01/P04. List what's still TODO with an owner before G1/G3.
```

---

## Phase 03 — Customer Discovery & User Research

> Gate: **G2 Problem Validated** — learn the customer, problem, and jobs before solutions. Source: [`pm-phase-03-discovery`](../skills/pm-phase-03-discovery/SKILL.md).

**ELICIT** — generate story-based interview questions for one belief
```
Acting as a discovery interviewer, here is the belief <ASM/INS: customers in <segment> struggle with X>. Generate 6 open, past-behaviour interview questions ("tell me about the last time…") and 3 follow-up probes that surface the job, the struggling moment, current workarounds, and what "better" means. No leading or hypothetical questions; do not propose a solution.
```

**GENERATE** — synthesise a session into insights + JTBD
```
From these interview notes, produce an interview snapshot, then extract findings as INS-NN in the customer's own words (one observable behaviour each, tagged to segment + the OBJ/KR). Draft 1-3 job stories ("When… I want… so I can…") and link each to its INS. Flag any theme supported by <3 sources as weak. Use real quotes only — never invent one; mark gaps TODO.
```

**CRITIQUE** — red-team for confirmation bias
```
Red-team this discovery. Find: (1) conclusions resting on hypotheticals not past behaviour, (2) personas/JOBs with no INS parent, (3) leading questions in the guide, (4) confirmation bias / disconfirming evidence not sought, (5) any insight that is AI-generated or synthetic standing in for a real customer, (6) conclusions on <5 conversations or one loud voice. Return: finding | severity (S1-S4) | location | fix.
```

**GATE** — run G2 as a real review
```
Act as the G2 reviewer. Walk the Problem-Validated checklist and the six-thread review against this discovery. For each: pass / TODO(owner+date) / fail with evidence. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill, with the one piece of evidence that would change the call.
```

---

## Phase 04 — Opportunity Assessment & Business Case

> Gate: **G3 Opportunity Go/No-Go** — decide which problem is worth solving now. Source: [`pm-phase-04-opportunity`](../skills/pm-phase-04-opportunity/SKILL.md).

**ELICIT** — interview me to place, size, and risk-rate the opportunity
```
You are my PM partner running the Phase 04 Opportunity Assessment for <product>. Ask me, one topic at a time, what's needed to place <opportunity> on an Opportunity Solution Tree, size it top-down and bottom-up, rate the four big risks plus ethics, and sketch a lean business case. After each answer, reflect it back, demand the evidence, mark unknowns TODO:, and move on. Never invent a market figure, cost, or quote.
```

**GENERATE 🔎** — draft the assessment and business case
```
Using my answers and this skill's skeletons, draft Opportunity_Assessment.md and Business_Case.md with Conventions §6 frontmatter. Assign OPP-nn, trace to INS/JOB and OBJ/KR, give both-or-nothing sizing with stated assumptions, the four-risk-plus-ethics table with ASM-nn, and a ranges-based case. Mark every unknown TODO:.
```

**CRITIQUE** — red-team as a skeptical review board
```
Act as a skeptical review board attacking this opportunity. Is it an opportunity or a disguised solution? Is the sizing top-down-only (red flag)? Is TAM being used as a forecast? Which of the four risks is unrated or evidence-free? Is ethics treated as a real assumption? Does it actually fit the strategy? If any answer has no defensible response, recommend Pivot or Kill, not a wave-through.
```

**GATE** — run G3 Opportunity Go/No-Go
```
Run G3 · Opportunity Go/No-Go as a real review using the exit-gate checklist. For each box: pass, TODO (owner+date), or waive (recorded). Then recommend one of Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence, and state what would change the call. An unrecorded gate is a failed gate.
```

---

## Phase 05 — Product Roadmap

> Gate: **G4 Roadmap Commit** — commit to outcomes over a horizon, not a feature calendar. Source: [`pm-phase-05-roadmap`](../skills/pm-phase-05-roadmap/SKILL.md).

**ELICIT** — interview me to build a Now/Next/Later outcome roadmap
```
You are my AI-PM partner running Phase 05. Ask me, one topic at a time, what I need to build a Now/Next/Later roadmap for <product>: the outcome swimlanes from my OKRs, which OPP-* each bet traces to, confidence + decision date per bet, capacity, and dependencies. Reflect each answer back, mark unknowns TODO:, and never invent a date or capacity number.
```

**GENERATE** — draft `Roadmap.md`
```
Using my answers and this skill's shape, draft Roadmap.md with Conventions §6 frontmatter (ROADMAP-<SLUG>-v1.0, Status: Living). Organise lanes by OBJ/KR; make every Now RMI-* trace to an OPP-* and a MET-*; decay specificity Now→Later; add a "Deliberately NOT now" section. Mark every gap TODO:.
```

**CRITIQUE** — red-team as a hostile reviewer at G4
```
Act as a hostile reviewer at G4. Attack this roadmap: which "Now" item has no OPP-* or OBJ/KR behind it? Where is this a dated feature Gantt wearing a Now/Next/Later costume? Is Later over-specified? Is capacity assumed at 100%? Is the agent/API user class missing? Return a table: finding | severity (S1–S4) | location | fix, then the one question this roadmap can't answer.
```

**GATE** — run the G4 Roadmap Commit
```
Run the G4 Roadmap Commit checklist as a real review, then the six-thread review. Recommend Persevere / Persevere-with-actions / Pivot / Hold / Kill with the evidence, and draft the DEC-* log row.
```

---

## Phase 06 — Prioritization

> Supporting phase (no own gate) — feeds G4/G6. Source: [`pm-phase-06-prioritization`](../skills/pm-phase-06-prioritization/SKILL.md).

**ELICIT** — list candidates and draft RICE inputs to confirm
```
From 04_Opportunity/Opportunity_Solution_Tree.md, list the OPP-* under outcome <OBJ-01>. For each, draft a Reach (cite a MET-*/FB-* source or mark TODO), an Impact band, an explicit Confidence, and a rough Effort. Do not invent a reach number — flag any unsourced cell as TODO: pull from analytics. Ask me to confirm the candidate list before scoring.
```

**GENERATE** — build the RICE matrix with sensitivity
```
Build a RICE matrix for these candidates at the inputs above. Compute (R×I×C)÷E, rank, and assign P0–P3 / MoSCoW labels. Then run sensitivity on the lowest-confidence input (±1 band) and tell me whether the top of the ranking flips.
```

**CRITIQUE** — challenge the scoring and recompute independently
```
Challenge this prioritization at the G4/G6 review: (1) is anything scored against gut instead of an OBJ/KR? (2) which Confidence values are optimism, not evidence? (3) recompute every RICE/WSJF score independently and flag arithmetic errors. (4) does the ranking flip under a plausible re-estimate I dismissed? (5) is a high-scoring item quietly failing the Responsible-Product floor? (6) is WSJF making everything "urgent" and starving platform work?
```

**GATE (handoff)** — confirm traceability and log the decision
```
Acting as the gate reviewer, confirm: each kept candidate ties to an OBJ/KR and an OPP-*; every score cites a source or a TODO; sensitivity is present; the recommendation names the trade-off and is logged as a DEC-*. List what's missing as TODO: <owner>.
```

---

## Phase 07 — Solution Discovery & Design

> Gate: **G5 Solution Validated** — find a desirable, usable, feasible, viable (and ethical) solution and de-risk it. Source: [`pm-phase-07-solution-design`](../skills/pm-phase-07-solution-design/SKILL.md).

**ELICIT** — interview me toward an assumption map + solution validation
```
You are my AI-PM partner running Phase 07 for <feature>. Interview me one topic at a time toward an Assumption_Map + Solution_Validation. Start from OPP-<n> and its outcome, generate 2–3 SOL-* options, then walk assumptions → riskiest → test design. Reflect each answer back, mark gaps TODO:, and refuse to de-risk a solution if the opportunity isn't validated. Invent nothing.
```

**GENERATE (options)** — propose distinct solution approaches
```
For OPP-<n> (outcome <OBJ/KR>, jobs <JOB-*>), propose 3 distinct solution approaches as SOL-nn | description | how it serves the outcome | biggest risk. No single "obvious" answer — give me genuinely different bets to compare.
```

**GENERATE (assumptions)** — surface and rank the load-bearing assumptions
```
List the load-bearing assumptions behind SOL-<n> as ASM-nn | risk type (Desirability/Usability/Feasibility/Viability/Ethical) | statement | importance | evidence. Force at least one Ethical and one Viability assumption. Then rank by importance×(1−evidence) and name the cheapest test for the top 3.
```

**CRITIQUE** — red-team as a skeptical product trio
```
Act as a skeptical product trio. Attack this assumption map: are we testing the riskiest assumptions or the easiest? Is there only one solution where there should be options? Any desirability claim resting on zero customer evidence? Any prototype hi-fi where lo-fi would do? Is the MVP actually minimal? List blocking gaps that should force a Pivot/Hold.
```

**GATE** — run the G5 Solution Validated review
```
Run the G5 Solution Validated review on this Solution_Validation. For each of the five risks, is there evidence (not opinion)? Did any failed assumption get quietly edited instead of triggering a Pivot? Is the MVP the smallest learning slice? Recommend Persevere / Persevere-with-actions / Pivot / Hold / Kill with the evidence.
```

---

## Phase 08 — Requirements & PRD

> Gate: **G6 PRD Approved / Build Entry** — specify what to build, just enough, just in time. Source: [`pm-phase-08-prd`](../skills/pm-phase-08-prd/SKILL.md).

**ELICIT** — draft the PRD spine from evidence
```
Acting as a senior PM, here are the validated solution SOL-<nn>, opportunity OPP-<nn>, and these real customer calls/tickets. Draft the PRD §1–§3: problem in the customer's words, target persona, parent OPP, the success metric to move, and in/out/later scope (MoSCoW). Ground every claim in the supplied evidence — flag anything you cannot source as TODO, never invent it.
```

**GENERATE** — functional + NFR + GenAI requirements for one feature
```
Convert this feature into FEAT-NN with testable REQ-F-NN requirements (Given/When/Then or fit criteria; replace vague verbs with a number + condition). Then walk every NFR class (U/P/O/SEC/C) and force one line each — propose a numeric threshold or write "N/A — because…". If the feature uses a model, add model-behaviour, eval-threshold, guardrail, fallback-UX, and human-in-the-loop requirements. Cite the parent SOL/OPP per REQ.
```

**CRITIQUE** — red-team the PRD before G6
```
Red-team this PRD. Find: (1) untestable verbs/adjectives, (2) output-list bloat that isn't tied to the outcome metric, (3) any NFR class with no answer, (4) requirements with no parent SOL/OPP, (5) invented "commitments"/metrics not in the evidence, (6) scope that breaks the MVP line, (7) missing GenAI guardrails. Return: finding | severity | which REQ/section | fix.
```

**GATE** — run G6 as a real review
```
Run the G6 checklist against this PRD and the six-thread review. For each item: pass / TODO (owner+date) / waived (rationale). Recommend one of Persevere · Persevere-with-actions · Pivot · Hold · Kill, with the evidence. Name the next command.
```

---

## Phase 09 — User Stories & Acceptance Criteria

> Gate: **G7 Backlog Ready** — turn the PRD into a ready, testable backlog. Source: [`pm-phase-09-stories`](../skills/pm-phase-09-stories/SKILL.md).

**ELICIT** — interview me toward a story map + INVEST stories + AC
```
You are my AI-PM partner running Phase 09 for <feature>. Interview me one topic at a time toward a story map + INVEST stories + acceptance criteria. Start from this PRD <paste FEAT-/REQ-/MET->. Reflect each answer back, trace every story to an OPP-/OBJ/KR-, mark gaps TODO:, and refuse any story with no outcome link. Invent no personas or edge cases.
```

**GENERATE** — draft vertically-sliced INVEST stories with Given/When/Then AC
```
From <paste PRD / FEAT->, draft vertically-sliced INVEST user stories with US-nn | As a PER-_ | I want | so that OBJ/KR-_ | traces. For each, draft acceptance criteria as AC-nn in Given/When/Then, covering happy path plus negative, boundary, error/empty, accessibility (WCAG 2.2) and privacy/security cases. Flag any story that isn't independently valuable or testable.
```

**CRITIQUE** — red-team as a hostile reviewer at G7
```
Act as a hostile reviewer at the G7 gate. Attack this backlog <paste>: which stories are horizontal/technical? Which AC are vague adjectives, not testable behavior? Which miss negative/boundary/WCAG/OWASP cases? Which lack an outcome MET- in DoD? Any persona invented without research? Return a table: finding | severity (S1–S4) | story | why it matters | fix. End with the question this backlog can't answer.
```

**GATE** — run the G7 Backlog Ready checklist
```
Run the G7 · Backlog Ready checklist against this map + stories. For each item: Pass / Gap (owner+date) / Waived. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence.
```

**SPLIT** *(utility)* — break a too-big story into vertical slices
```
This story is too big: <paste US->. Split it using SPIDR / Humanizing-Work patterns (workflow steps · business-rule variations · happy-vs-error · data variations · interface variations). Keep every slice vertical, valuable, and demoable. Do NOT split into frontend/backend tasks.
```

---

## Phase 10 — Agile Delivery & Backlog Management

> Gate: **G8 Release Readiness (Go/No-Go)** — build it, keep flow healthy, reach release readiness. Source: [`pm-phase-10-delivery`](../skills/pm-phase-10-delivery/SKILL.md).

**ELICIT** — interview me toward a delivery plan + readiness pack
```
You are my AI-PM partner running Phase 10 for <release/RMI->. Interview me one topic at a time toward a delivery plan, sprint plan, risk register, and release-readiness pack. Start from this backlog <paste US-/AC-/DoD MET-> and cadence <Scrum/Kanban>. Reflect each answer back, reuse facts in the tree, mark gaps TODO:, and refuse any "done" with no live MET-. Invent no capacity or flow numbers.
```

**GENERATE** — draft a forecasted sprint/iteration plan + risk register
```
From <paste ready stories + capacity>, draft a sprint/iteration plan: an outcome goal, the pulled US- (respecting WIP + slack, not 100% capacity), dependencies as DEP-, and a Monte Carlo / throughput forecast for the slice. Flag any over-commit. Then draft a Risk_Register.md of RSK- (Likelihood × Impact) from the open ASM- and the plan.
```

**CRITIQUE** — red-team as a hostile reviewer at G8
```
Act as a hostile reviewer at the G8 gate. Attack this release <paste Release_Readiness>: which AC are unverified? Which open ISS- are really S1/S2 mislabeled? Is the MET- actually instrumented or just claimed? Is there a real rollback? Any a11y/privacy/security gap? Any velocity-as-KPI or 100%-capacity smell? Return a table: finding | severity (S1–S4) | area | why it matters | fix. End with the one question this release can't answer.
```

**GATE** — run the G8 Release Readiness checklist
```
Run the G8 · Release Readiness checklist against this evidence. For each item: Pass / Gap (owner+date) / Waived (rationale). Recommend Go (Persevere) · Persevere-with-actions · Pivot · Hold · Kill with the evidence and a DEC-.
```

---

## Phase 11 — Launch & Go-to-Market

> Gate: **G9 Launch Decision (GA)** — land it in the market with GTM, not just ship it. Source: [`pm-phase-11-launch-gtm`](../skills/pm-phase-11-launch-gtm/SKILL.md).

**ELICIT** — draft a launch-plan starter from positioning + readiness
```
From 02_Market/Positioning_Brief.md, 01_Strategy/North_Star_and_OKRs.md, and 10_Delivery/Release_Readiness.md, draft a launch plan starter: propose a launch tier with rationale, the one outcome (OBJ/KR) this launch must move, and the open questions you need me to answer before we set the motion. Confirm the release is staged/reversible before anything else.
```

**GENERATE 🔎** — build the GTM plan (messaging, motion, pricing, rollout)
```
Build the GTM plan: turn the Dunford brief into messaging that leads with "why now" + value; recommend a motion (PLG/SLG/Hybrid/Community) and a pricing model (per-seat/usage/outcome/credit) for an ACV of <X> with a stated rationale and the assumptions (ASM-??); then draft a progressive Rollout_Plan.md (rings + % schedule + guardrail metrics with rollback thresholds) and a partner-enablement RACI. Refuse to produce vanity success metrics.
```

**CRITIQUE** — run a pre-mortem on the launch
```
Run a pre-mortem on this launch: it's 90 days later and it failed — list the most likely causes as RSK-??. Then challenge: (1) are release and launch conflated? (2) is this really a Tier-1, or is everything a Tier-1? (3) is the messaging customer-validated or internal consensus? (4) is the rollout big-bang with no rollback? (5) are success metrics vanity (press/signups) vs outcome-linked? (6) is pricing per-seat for an outcome-based product? (7) does Sales/Support learn this from customers?
```

**GATE** — run the G9 Launch Decision
```
Check P11 against the G9 block. Confirm the tier is set, rollout is staged with guardrails + rollback thresholds, GTM (positioning/messaging/pricing/enablement) is ready and internal-before-external, success + guardrail MET-* are defined, and legal/privacy + on-call are confirmed. List every open TODO with an owner+date and recommend Persevere / with-actions / Pivot / Hold / Kill.
```

---

## Phase 12 — Analytics, KPIs & Instrumentation

> Continuous (recurring health check) — switches on at launch, feeds G8/G9 lines. Source: [`pm-phase-12-analytics`](../skills/pm-phase-12-analytics/SKILL.md).

**ELICIT** — interview me toward a North Star metric tree + tracking plan
```
You are my AI-PM partner running Phase 12 for <product>. Interview me one topic at a time toward a North Star metric tree + tracking plan. Start from this strategy <paste North Star MET- / OBJ/KR->. Reflect each answer back, trace every metric to an outcome, mark unknown baselines/targets TODO:, and refuse any metric that fails Cutler's vanity test. Invent no numbers.
```

**GENERATE** — draft the metric tree + guardrails + events
```
From <paste North Star + OKRs + FEAT->, draft a metric tree: 1 North Star output + 3-5 movable input metrics (breadth/depth/frequency/efficiency). For each, tag tier (success/guardrail/diagnostic), leading vs lagging, component vs influence link, the proxy + caveat, and the events/properties needed. Propose 2-3 guardrails. Flag any metric that's an output/activity count.
```

**CRITIQUE** — red-team the measurement plan
```
Act as a hostile reviewer at the P12 health check. Attack this measurement plan <paste>: which metrics are vanity (output/cumulative/no-decision)? Where is the North Star being "optimized directly" with no inputs? Which wins have no guardrail? Where is retention reported without cohorts, or a lagging metric with no leading partner? Which causal claims are really correlation? Return a table: finding | severity (S1-S4) | metric | why it matters | fix. End with the decision this scorecard can't support.
```

**GATE (health check)** — run the P12 review
```
Run the P12 health-check against this plan + tracking plan + scorecard. For each item: Pass / Gap (owner+date) / Waived. Confirm the G8 "instrumentation live" and G9 "success + guardrail thresholds" lines are satisfiable. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence.
```

---

## Phase 13 — Experimentation & A/B Testing

> Continuous (per-experiment health check). Source: [`pm-phase-13-experimentation`](../skills/pm-phase-13-experimentation/SKILL.md).

**ELICIT** — draft a falsifiable hypothesis + pre-registration from evidence
```
Acting as a senior PM/experimenter, here is the riskiest assumption ASM-<nn>, the opportunity OPP-<nn>, and the available metrics. Draft a falsifiable hypothesis (We-believe-causes-because), pick the primary OEC + 2-3 guardrails from the supplied metrics only, and state the decision rule. Flag anything you cannot source as TODO — never invent a metric or a number.
```

**GENERATE** — design and power the test
```
For this hypothesis and metric, recommend a method (fixed-horizon / sequential mSPRT / Bayesian / bandit) with the trade-off, compute the sample size for MDE <x> at alpha 0.05 / power 0.8 and the runtime in business cycles, and note whether CUPED applies. Add the A/A, SRM, and multiple-comparison checks. Show every calculation step; do not trust a printed number.
```

**CRITIQUE** — red-team the plan before launch
```
Red-team this experiment plan. Find: (1) peeking / no sequential rule, (2) underpowered / no power analysis, (3) statistical-vs-business significance conflation, (4) sub-weekly or arbitrary duration, (5) uncorrected multiple comparisons or post-hoc segment fishing, (6) dropped guardrails, (7) AI-feature measured with classic A/B, (8) a one-way-door/compliance change that shouldn't be A/B tested. Return: finding | severity | section | fix.
```

**GATE (health check)** — run the per-experiment review
```
Run the per-experiment done-when list and the six-thread review against this plan + readout. For each item: pass / TODO (owner+date) / waived (rationale). Recommend Ship · Iterate · Kill · Inconclusive-extend (the experiment-level analogue of Persevere/Pivot/Kill), with the evidence. Name the next command.
```

---

## Phase 14 — Customer Feedback Management

> Continuous (recurring loop-health check). Source: [`pm-phase-14-feedback`](../skills/pm-phase-14-feedback/SKILL.md).

**ELICIT** — interview me to design a closed-loop VoC system
```
You are my AI-PM partner running Phase 14 for <product>. Interview me one topic at a time to design a closed-loop VoC system: channels (solicited + unsolicited), a governed type × area × source × segment taxonomy, the CSAT/CES/NPS triangle, and inner/outer loop SLAs. Reflect each answer back, trace themes to OPP-/MET-, mark gaps TODO:, and invent no scores or verbatims.
```

**GENERATE** — cluster raw feedback into sourced root-cause themes
```
Cluster this raw feedback <paste tickets / reviews / NPS-why> into root-cause FB- themes. For each: a one-line theme, type × area × source × segment tags, count, sentiment, 2–3 sourced verbatims (quote the input — do not paraphrase into a new claim), and a candidate OPP- under an outcome. Rank by importance (weight enterprise/ARR), not raw frequency. Flag any theme you cannot ground in a quote.
```

**CRITIQUE** — red-team the feedback program
```
Act as a hostile reviewer of this feedback program <paste>: (1) which themes are AI hallucinations with no source verbatim? (2) where is raw count masquerading as importance? (3) is any metric a bare NPS with no "why"? (4) which loops are open (collected but never acted on or never told back)? (5) is the taxonomy sprawling/ungoverned? (6) are we about to build a request instead of solving the underlying job? Return a table: finding | severity (S1–S4) | why it matters | fix.
```

**GATE (health check)** — run the Phase 14 review
```
Run the Phase 14 health check against this program. For each item: Pass / Gap (owner+date) / Waived. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill on the loop's health, with the evidence.
```

---

## Phase 15 — Product Growth & Optimization

> Continuous (recurring health check). Source: [`pm-phase-15-growth`](../skills/pm-phase-15-growth/SKILL.md).

**ELICIT 🔎** — interview me toward a growth model + GX backlog
```
You are my AI-PM partner running Phase 15 for <product>. Interview me one topic at a time toward a growth model + GX backlog. Start from <paste North Star MET-/OKRs + lifecycle metrics>. Find the leaking stage, separate the felt aha from a measurable activation event, and reflect each answer back. Do not invent any activation rate, NRR, or benchmark — flag unsourced numbers as TODO: pull from analytics.
```

**GENERATE 🔎** — model the product as growth loops + a prioritized GX backlog
```
From <paste metrics + FB- themes>, model this product as growth loops (not a funnel): draw each loop, its compounding output→input step, and its bottleneck. Write the growth equation, propose a measurable activation event + value hypothesis, and draft a prioritized GX- backlog (hypothesis · loop/stage · single MET- · guardrail · ICE). Cite a sourced benchmark range for any rate you reference.
```

**CRITIQUE** — red-team as a hostile growth reviewer
```
Act as a hostile growth reviewer. Attack this model <paste>: (1) is the North Star a vanity metric that could rise while retention falls? (2) is anything modeled as a funnel that should be a loop? (3) which GX- lack a guardrail or rest on correlation, not a causal EXP-? (4) is any mechanic a dark pattern dressed as retention, or missing consent / AI-disclosure? (5) is acquisition being poured into a leaking bucket? Return: finding | severity (S1–S4) | why it matters | fix.
```

**GATE (health check)** — run the Phase 15 review
```
Run the Phase 15 done-when list + the six-thread review against this model + backlog. For each item: Pass / Gap (owner+date) / Waived. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence, and name the next review date.
```

---

## Phase 16 — Product Sunset & Retirement

> Gate: **G10 End-of-Life** — retire a product/feature responsibly. Source: [`pm-phase-16-sunset`](../skills/pm-phase-16-sunset/SKILL.md).

**ELICIT** — interview me to decide and plan the sunset
```
You are my AI product manager running Phase 16. Ask me, one topic at a time, what's needed to decide and plan the sunset of <product/feature/API>: scope, usage/cost diagnosis, sunk-cost/exit criteria, retirement type, affected segments + destination, runway, comms, and the data/legal lifecycle. Reflect each answer back, mark gaps as TODO:, and don't invent usage, cost, or contract facts.
```

**GENERATE** — draft the decision, deprecation plan, and migration comms
```
Using my answers and the section shapes in this skill, draft Sunset_Decision.md, Deprecation_Plan.md, and a 5-7-touchpoint Migration_Comms.md with Conventions §6 frontmatter. Make the comms transparent (why / timeline / migration path), tailor per segment, give a viable destination (not just an exit), and include data export + automated-deletion steps. Log the call as a DEC-*.
```

**CRITIQUE** — red-team as a portfolio reviewer and privacy counsel
```
Act as a skeptical portfolio reviewer and a privacy counsel attacking G10. Is the kill diagnosed (or is low usage really a discoverability problem)? Is sunk cost driving this (escalation of commitment)? Is the runway realistic (did we double the estimate)? Are we cutting support the moment we announce? Is there a real migration destination? Are erasure obligations automated and is test/dev/backup data in scope (EDPB)? List blocking gaps that should Hold or Pivot the gate.
```

**GATE** — run G10 as a real decision
```
Run G10 as a real decision, not a rubber stamp. Walk the Exit-gate checklist + the six-thread review; mark each item Met / TODO: (owner+date) / Waived. Then recommend one of Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence, and name the next command.
```

---

## Cross-phase patterns → see [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md)

The eight reusable prompt shapes that apply in **any** phase — the interviewer, the drafter, the red-teamer, the "is this an outcome?" check, the assumption-finder, the metric-tree builder, the synthesiser, and the gate-challenger — live in [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md). When to leave the chat for a customer interview, web research, or a specialised agent: [`research-and-agents.md`](research-and-agents.md).
