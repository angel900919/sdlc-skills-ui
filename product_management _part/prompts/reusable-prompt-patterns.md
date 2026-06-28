# Reusable Prompt Patterns — cross-phase, domain-agnostic

> Copy-paste prompt patterns that work in **any** phase (00 → 16) and **any** product domain. Replace every `<placeholder>` with your specifics. These are the *cross-phase* layer — when you're inside a specific phase, prefer that phase's tailored `## AI prompt pack` (see the [README table](README.md) and `ai-prompt-library.md`). Everything below emits IDs, gates, decision vocabulary, and citations in the grammar of [`../05_Conventions.md`](../05_Conventions.md) — the patterns **cite the contract, they never redefine it**. They also honour the standing rules of the [AI Product Manager Protocol](../02_AI_Product_Manager_Protocol.md): never invent customer evidence, market numbers, metrics, or quotes (emit `TODO:` + a research/interview recommendation instead); one topic at a time; show-back-and-confirm; outcomes over outputs; and challenge solutions-without-evidence. **AI accelerates the work; the human owns the judgment and is accountable** ([Conventions §11](../05_Conventions.md)).

**How to read each pattern:** *When to use* → *The prompt* (copy this) → *What it returns* (so you can tell whether the model actually did the job) → *Guardrail* (the line you do not let the AI cross).

**The four intents.** Each pattern is one of the four standing moves named in the [README](README.md): **ELICIT** (interview me), **GENERATE** (draft an artifact), **CRITIQUE** (red-team my draft), **GATE** (challenge readiness). Name the intent when you prompt so the AI picks the right mode.

**Universal placeholders** used throughout: `<product>` (the product or feature under work), `<segment>` (the target customer/persona), `<product-slug>` (kebab-case), `<tailoring-level>` (Solo-Lean | Standard | Enterprise — see the [Tailoring Guide](../04_Tailoring_Guide.md)). Paste the relevant prior-phase artifact (or its path under [Conventions §9](../05_Conventions.md)) wherever a prompt references one.

---

## 1. The one-topic-at-a-time Interviewer (ELICIT)

**When to use.** The opening of any phase, or whenever you have context in your head that isn't on the page yet. This is the default way to *start* a phase — it runs step 2 of the per-phase loop ([Protocol §2](../02_AI_Product_Manager_Protocol.md)): ask this phase's questions **one topic at a time**, never a wall of questions, and show back what was captured before moving on.

**The prompt.**
> ```
> Act as a senior product manager running an ELICIT session for <product> (<segment>),
> tailoring level <tailoring-level>. We are working on <phase/artifact, e.g. Phase 03
> Discovery → Personas.md>.
>
> Context you already have (read, don't re-ask): <paste prior-phase artifacts or their paths>.
>
> Rules:
> 1. Interview me ONE TOPIC AT A TIME. Ask the single most decision-relevant question first;
>    wait for my answer before the next. Never dump a list of questions.
> 2. Group sub-questions only when tightly coupled (e.g. product name + slug + segment together).
>    For finite choices (cadence, framework, launch tier, gate decision), offer me options to pick
>    from rather than asking me to free-type.
> 3. After each answer, SHOW BACK what you captured in the shape of the target artifact's section,
>    and ask me to confirm or edit before you advance.
> 4. Ask about NEEDS, jobs, pains, and outcomes — not solutions. If I answer with a solution,
>    reflect the underlying need back and ask me to confirm it.
> 5. If I say "I don't know," record it as TODO: <what's owed> and either propose a sensible
>    default for me to confirm or tell me which research/interview would answer it (§5, §7 below).
>    Do NOT invent the answer and do NOT stall.
> 6. Re-use known facts verbatim (slug, segment, personas, North Star, OKRs, opportunities) —
>    re-asking something I already told you is a defect.
> Begin with topic 1.
> ```

**What it returns.** A single first question (not a questionnaire); after each of your answers, a show-back of the captured content in the artifact's shape with a confirm/edit prompt; needs-shaped questions, not solution-leading ones; `TODO:` markers (with a default-to-confirm or a research route) for anything you don't know; and zero re-asking of facts already in the pasted context.

**Guardrail.** The AI interviews and drafts the capture; **you** supply the truth and confirm each block. It never fabricates a need, a quote, or a number to fill a silence — an unknown is `TODO:` + a recommendation, per [Protocol §10](../02_AI_Product_Manager_Protocol.md).

---

## 2. The artifact Drafter (GENERATE — template-shaped, TODO-honest)

**When to use.** Once you have raw inputs (interview notes, prior artifacts, a rough brief) and want a first draft of any deliverable in its template shape — a Charter, Vision, PRD, Roadmap, Measurement Plan, Launch Plan, anything. It runs step 4 of the loop: convert answers into the phase's deliverable **with IDs and traceability**, honestly flagging every gap.

**The prompt.**
> ```
> GENERATE a draft of <artifact, e.g. 08_PRD/PRD.md> for <product> (<segment>) in the template
> shape. Use the blank template at <templates/ path> if I paste it; otherwise follow the
> Conventions §9 layout.
>
> Source inputs:
> <paste interview notes / prior-phase artifacts / brief>
>
> Rules:
> 1. Fill the template section by section. Keep it lean and just-in-time — no padding, no invented
>    detail to look complete.
> 2. Add the document frontmatter per Conventions §6 (Document, Document ID <TYPE>-<product-slug>-vX.Y,
>    Status: Draft, Owner, Updated <YYYY-MM-DD>). Dates absolute, never relative.
> 3. Assign IDs in the correct grammar (Conventions §3): e.g. OPP-<nn>, OBJ/KR-<nn>, SOL-<nn>,
>    ASM-<nn>, REQ-<class>-<nn>, US-<nn> + AC-<nn>, MET-<nn>. Zero-pad to two digits.
> 4. TRACE every item back along the golden thread (Conventions §4): each requirement/bet links to
>    an opportunity, each opportunity to an insight, each "done" to a metric. Show the link IDs.
> 5. For NFRs (REQ-U/P/O/SEC/C), force a one-line answer for each class even if it is
>    "N/A — because <reason>".
> 6. Anything the inputs do NOT support becomes "TODO: <what's owed>" with a note on how to close it
>    (interview, web research, or a default to confirm). NEVER fabricate a customer quote, market
>    number, metric value, or test result.
> 7. End with a "Gaps & open questions" list: every TODO collected, plus the 2-3 weakest spots you'd
>    want me to verify first.
> Return the drafted artifact, then the gaps list.
> ```

**What it returns.** The artifact in template shape with correct frontmatter and `vX.Y` ID; every item carrying its grammar-correct ID and an explicit trace link (no orphan requirements, no metric-less "done"); one line per NFR class; `TODO:` markers wherever the inputs ran out, each with a close-the-gap note; and a collected gaps list naming the weakest spots to verify.

**Guardrail.** The AI drafts; **you** verify before anything is baselined. A drafted artifact is `Status: Draft` until a human reviews it — an AI-written "insight," metric, or market figure never enters a baseline un-verified ([Protocol §1, §10](../02_AI_Product_Manager_Protocol.md)). Invented detail to "look finished" is the failure mode; `TODO:` is the correct behaviour.

---

## 3. The Red-Teamer / skeptic (CRITIQUE)

**When to use.** Loop step 5 of *every* phase — run it on any draft before you take it to a gate (a strategy, a PRD, a roadmap, a launch plan, an experiment design). The point is to attack the work the way a hostile reviewer at the gate would, so weaknesses surface now, not there.

**The prompt.**
> ```
> Red-team this <artifact type> for <product> as a hostile reviewer at the <gate, e.g. G6> gate
> would. Be adversarial and specific; your job is to REFUTE, not to reassure.
>
> Artifact:
> <paste the draft>
>
> Find and tabulate:
> 1. The weakest-evidence claim — which statement rests on opinion, anecdote, or a single data
>    point dressed up as a trend? Name it.
> 2. The riskiest UNTESTED assumption — what must be true for this to work that we have not validated?
> 3. Outputs masquerading as outcomes — any feature/release/ticket presented as success with no
>    moved metric behind it (Conventions §7).
> 4. Vanity metrics — any number that only goes up; name the missing counter/guardrail metric.
> 5. Missing-but-expected content a skeptical exec / frustrated customer / Legal would demand:
>    NFRs (perf/accessibility/privacy/reliability), rollback, GTM landing, missing stakeholders.
> 6. Traceability breaks — orphans with no parent and "done" with no metric (Conventions §4).
> 7. Any market number, benchmark, quote, or result ASSERTED without a citation.
>
> Return a table: finding | severity (S1-S4 per Conventions §5.1) | location/ID | why it matters | fix.
> End with the single question you'd ask at the <gate> gate that this draft cannot currently answer.
> ```

**What it returns.** A findings table that names *specific* lines/IDs (not "consider edge cases" filler), each rated `S1`–`S4` so the worst items are obvious; at least one genuine untested assumption and one output-posing-as-outcome surfaced; vanity metrics paired with the missing guardrail; asserted-without-citation numbers flagged for research; and a killer gate question the draft can't yet answer.

**Guardrail.** The AI is the skeptic, not the decider. It surfaces and ranks weaknesses; **you** judge which to fix before the gate and own that call. A flagged "asserted without evidence" item becomes a research/interview trigger (see [`research-and-agents.md`](research-and-agents.md)) — the AI does not quietly supply the missing number to make its own critique go away.

---

## 4. The "is this an outcome or an output?" check

**When to use.** Any time a roadmap, OKR, PRD goal, or "definition of done" describes *what we'll ship* instead of *what will change for the customer or business*. This enforces the prime directive ([Conventions §7](../05_Conventions.md)): we are measured by outcomes, not outputs. Run it on roadmap items, key results, and success criteria especially.

**The prompt.**
> ```
> Act as a product coach enforcing outcomes-over-outputs (Conventions §7) for <product>.
>
> Classify each item below as OUTCOME (a change in customer behaviour or a business result) or
> OUTPUT (a feature, release, or activity we control).
>
> Items:
> <paste roadmap items / OKR key results / "success criteria" / done definitions>
>
> For each item:
> 1. Verdict: OUTCOME or OUTPUT.
> 2. If OUTPUT: rewrite it as the outcome it is meant to produce — "so that <customer/business
>    result>" — and name the metric (MET-<nn>) that would prove the outcome moved. If you don't
>    know the right metric or baseline, write "TODO: metric/baseline owed" — do NOT invent a target.
> 3. Note what we'd lose by leaving it as an output (we'd celebrate shipping even if nothing improved).
> 4. If an item is genuinely an enabling output with a real downstream outcome, keep it but require
>    the outcome + metric it ladders up to (Conventions §4 golden thread).
>
> Return a table: item | verdict | rewritten outcome | metric (MET-<nn>) | what we'd lose if left as output.
> Then tell me the one or two items most likely to make us a "feature factory" if left unfixed.
> ```

**What it returns.** A verdict table where shipped-features ("launch the dashboard," "add SSO") are caught as outputs and rewritten as the behaviour/result they should drive, each tied to a `MET-<nn>` (or a `TODO:` for an unknown metric/baseline); a note on the risk of leaving each as output; enabling-outputs kept but laddered to an outcome; and a pointed call-out of the most feature-factory-prone items.

**Guardrail.** The AI reframes and proposes the metric; it **never invents the target or baseline** — an unknown number is `TODO: metric/baseline owed`, routed to analytics or research. You decide which outcomes the team commits to; the AI only refuses to let an output stand in for one.

---

## 5. The riskiest-assumption finder (four big risks + ethics)

**When to use.** Phase 07 solution discovery especially, but reusable on any bet, feature, or business-case before you invest in building it. It maps a solution against the **four big product risks** — value/desirability, usability, feasibility, business-viability — **plus ethics**, and finds the one assumption whose failure would sink the bet, so you test *that* first ([Conventions §5.3](../05_Conventions.md), [Phase 07](../skills/pm-phase-07-solution-design/)).

**The prompt.**
> ```
> Act as a discovery coach (Cagan four-risks + ethics) de-risking this bet for <product> (<segment>).
>
> The bet/solution: <paste SOL-<nn> and the opportunity OPP-<nn> it serves>.
>
> 1. List the assumptions this bet depends on, bucketed by the FOUR BIG RISKS plus ETHICS:
>    - VALUE / DESIRABILITY: will <segment> want this / does it solve a real OPP?
>    - USABILITY: can they figure out how to use it?
>    - FEASIBILITY: can we build it with our tech, data, time, skills?
>    - BUSINESS VIABILITY: does it work for our business (cost, GTM, legal, brand, channel)?
>    - ETHICS / RESPONSIBLE PRODUCT: who could be harmed, excluded, or surveilled? privacy,
>      accessibility, bias, safety (cross-cutting Responsible Product thread).
> 2. For each assumption: give an ID ASM-<nn>, rate likelihood it's FALSE (1-5) and impact if FALSE
>    (1-5), and compute likelihood x impact to a Low/Med/High/Critical band (Conventions §5.3).
> 3. Identify the SINGLE riskiest assumption — high impact AND high uncertainty — that we should
>    test before anything else.
> 4. For the top 3 assumptions, propose the CHEAPEST test that could invalidate each (interview,
>    prototype, fake door, concierge, data pull) and seed an EXP-<nn> + the metric (MET-<nn>) that
>    would settle it. Do NOT assert what the test result will be.
> 5. Flag any assumption where we're guessing about real customers — route it to a customer interview.
>
> Return a table: ASM-<nn> | risk bucket | assumption | L | I | band | cheapest test (EXP-<nn>) | metric.
> Then state the one assumption to test this week and why.
> ```

**What it returns.** An assumption map covering all four risk buckets **and** ethics (not just feasibility), each `ASM-<nn>` scored `L×I` to a risk band; the single riskiest assumption called out; the cheapest invalidating test per top assumption with a seeded `EXP-<nn>` and `MET-<nn>`; and explicit routing of customer-need guesses to interviews.

**Guardrail.** The AI finds and ranks assumptions and proposes tests — it **does not predict the test result or declare the bet validated**. Validation comes from running the test with real customers/data; an untested riskiest assumption keeps the gate at *Persevere-with-actions* or *Hold*, never *Persevere* ([Protocol §4](../02_AI_Product_Manager_Protocol.md)). The ethics row is non-negotiable even for the smallest product.

---

## 6. The metric-tree / North-Star builder

**When to use.** Phase 01 (set the North Star + OKRs) and Phase 12 (measurement plan), or any time a goal lacks a single headline metric with honest inputs and guardrails. Builds a **North Star Metric** with its **input metrics / metric tree** and a **counter-metric** for each, so the team optimises a real outcome, not a vanity number ([Conventions §8](../05_Conventions.md): Amplitude / Sean Ellis; AARRR; HEART).

**The prompt.**
> ```
> Help me build a metric tree for <product> (<segment>), tailoring level <tailoring-level>.
>
> Context: <paste Vision / Product_Strategy / target outcome / current OKRs if any>.
>
> 1. Propose 2-3 candidate NORTH STAR metrics that capture the value customers get (a leading
>    indicator of retained value, not lagging revenue alone). For each, state the customer value it
>    proxies and its main failure mode if gamed.
> 2. Recommend ONE, with the trade-off, and tag it MET-<nn> (the North Star is a tagged MET,
>    Conventions §3.3).
> 3. Decompose it into 3-5 INPUT metrics the team can actually influence (the metric tree). For each
>    input, tag MET-<nn> and map it to an AARRR stage (Acquisition/Activation/Retention/Referral/
>    Revenue) or a HEART dimension where UX-relevant.
> 4. For EVERY metric, name a COUNTER / GUARDRAIL metric (what could get worse while this goes up).
> 5. Mark each metric's source: instrumented already / needs a tracking event (route to Phase 12
>    Tracking_Plan.md) / not yet measurable. Where I haven't given a baseline or target, write
>    "TODO: baseline/target owed" — do NOT invent the number.
> 6. Tie the tree back to the OKRs (OBJ-<nn>/KR-<nn>) and forward to bets (which SOL/RMI moves which input).
>
> Return: the recommended North Star (MET-<nn>) + rationale, the metric tree table
> (MET-<nn> | input | AARRR/HEART | guardrail | source | baseline/target or TODO), and the OKR linkage.
> ```

**What it returns.** A recommended North Star (`MET-<nn>`) that proxies customer value with its gaming failure mode named; a 3–5 input metric tree, each input tagged and mapped to AARRR/HEART; a guardrail/counter-metric for every metric; an instrumentation-status flag routing un-instrumented metrics to the Tracking Plan; `TODO:` for any missing baseline/target; and explicit links up to OKRs and down to bets.

**Guardrail.** The AI proposes the structure and candidates; **you** choose the North Star and own the targets. It **never invents a baseline, target, or current value** — those come from instrumentation/analytics (`TODO: baseline/target owed`). Every metric must have a guardrail, or the AI flags it as a vanity-metric risk per [Protocol §4](../02_AI_Product_Manager_Protocol.md).

---

## 7. The research / feedback Synthesiser (verify against raw)

**When to use.** After a round of interviews, a pile of support tickets, survey responses, or app-store reviews — Phase 03 (research insights) and Phase 14 (feedback synthesis) especially. It clusters raw input into themes with evidence, **but its output is input to verify, not ground truth**: you check every theme against the raw quotes before it becomes an `INS-*` or `FB-*` ([Protocol §5, §9](../02_AI_Product_Manager_Protocol.md)).

**The prompt.**
> ```
> Synthesise this raw <interview notes / support tickets / survey responses / reviews> for <product>
> into themes. You are summarising MY data, not adding your own knowledge.
>
> Raw input:
> <paste raw notes / quotes / tickets — keep them verbatim>
>
> Rules:
> 1. Cluster into 4-8 themes. For EACH theme: a one-line statement, the count/strength of evidence,
>    and 2-3 VERBATIM supporting quotes copied from the raw input (with a source tag) — do NOT
>    paraphrase a quote into existence or merge two speakers into one.
> 2. Frame each theme as a candidate insight INS-<nn> (Phase 03) or feedback theme FB-<nn> (Phase 14),
>    and where it implies a job/pain, link a JOB-<nn> or OPP-<nn>.
> 3. Separate SIGNAL from NOISE: note which themes are well-evidenced vs. single-mention, and flag
>    any theme that rests on one person so I don't over-weight it.
> 4. List DISCONFIRMING evidence too — quotes that cut against the headline theme. Do not hide them.
> 5. If you're inferring something the quotes don't directly say, label it "INFERENCE (verify)" — never
>    present an inference as a customer statement. Invent NO quotes, counts, or sentiment.
> 6. End with: the 2-3 themes worth acting on, and what to ask/observe next to confirm the weak ones.
>
> Return a table: theme | INS-/FB-<nn> | evidence strength | verbatim quotes (+source) | linked JOB/OPP |
> signal vs noise | disconfirming evidence.
> ```

**What it returns.** 4–8 themes each tagged `INS-<nn>`/`FB-<nn>` with **verbatim** quotes copied from your raw input (traceable to source), evidence strength, signal-vs-noise calls so single-mention themes aren't over-weighted, disconfirming evidence surfaced, clearly-labelled inferences, and a short act-on shortlist with next steps to confirm the weak themes.

**Guardrail.** The AI accelerates clustering; **you** verify every theme and quote against the raw before it enters a baseline. AI-generated "insights" are input to check, not truth ([Protocol §5](../02_AI_Product_Manager_Protocol.md)) — fabricated quotes, invented counts, or paraphrase-as-quote is the failure mode. If you can't trace a theme to a real quote, it doesn't become an `INS-*`.

---

## 8. The Gate-challenger (Persevere / Pivot / Kill)

**When to use.** At every exit gate (G0 → G10). Treats the gate as a real go/no-go **decision with evidence** ([Protocol §6](../02_AI_Product_Manager_Protocol.md)), not a rubber stamp — and returns exactly one of the five canonical outcomes from [Conventions §2](../05_Conventions.md). A PM who never says Pivot or Kill is running theatre.

**The prompt.**
> ```
> Run a gate-readiness review for the <GATE, e.g. G3 Opportunity Go/No-Go> gate of <product>
> (tailoring level <tailoring-level>). Be a tough but fair board member, not a cheerleader.
>
> Gate criteria (from the owning phase's SKILL.md + ../checklists/gate-reviews.md):
> <paste the checklist items for this gate>
>
> Evidence to assess:
> <paste the relevant artifacts / their status / open items / risks / metrics>
>
> 1. Score EACH criterion: Met / Partially-met / Not-met / N-A (tailored out: <reason>), each with
>    the SPECIFIC evidence (or its absence) that justifies the score. No "looks fine" — cite the line/ID.
> 2. Check the six cross-cutting threads at this gate (Protocol §7): open S1/S2 risks (RSK-<nn>),
>    untested riskiest assumptions, vanity metrics without guardrails, missing stakeholders/decisions
>    (DEC-<nn>), Responsible Product (privacy/accessibility/ethics). A baselined artifact's status
>    must read "Approved (<GATE>-approved <date>)" per Conventions §6.
> 3. Recommend EXACTLY ONE outcome with justification (Conventions §2):
>    Persevere | Persevere-with-actions | Pivot | Hold | Kill.
>    - Persevere only if all criteria Met, no open S1/S2, riskiest assumption tested, every "done"
>      tied to a metric.
>    - Persevere-with-actions => list each open item with a named owner + due date; risk accepted.
>    - Pivot => name WHAT changes (segment / problem / solution / model / channel) and which phase to
>      loop back to.
>    - Hold/Kill => state the blocking gap or failed risk (desirability/usability/feasibility/
>      viability) and the consequence.
> Do NOT declare the gate "passed" while any criterion is unmet — name the unmet item. Treat Pivot
> and Kill as wins when the evidence supports them.
> Return: criteria scorecard | thread check | outcome + rationale | action list (owner, due date).
> ```

**What it returns.** A per-criterion scorecard with concrete evidence cited for each Met/Not-met (no rubber-stamping); the cross-cutting threads actually checked (an open `S1`/`S2` or an untested riskiest assumption blocks Persevere); **exactly one** of the five outcomes, justified; named owners + due dates for every action under *Persevere-with-actions*; and, for *Pivot*, what changes and where to loop back.

**Guardrail.** The AI recommends with evidence; **the human makes the go/no-go decision and is accountable** ([Conventions §11](../05_Conventions.md), [Protocol §6](../02_AI_Product_Manager_Protocol.md)). The AI will not call a gate "passed" with an unmet criterion, and it does not soften a Pivot/Kill the evidence supports — but it never invents the evidence that would force a decision either way; a missing artifact is named, not imagined.

---

## Composing patterns

These chain naturally along the workflow's golden thread ([Conventions §4](../05_Conventions.md)):

1. **#1 Interviewer** → captures `STK`/`INS`/`JOB` and the phase's raw answers.
2. **#7 Synthesiser** → turns interview/feedback piles into evidenced `INS`/`FB` themes (you verify against raw).
3. **#4 Outcome-or-output check** → makes sure goals and roadmap items are outcomes, each with a `MET`.
4. **#6 Metric-tree builder** → sets the North Star + input metrics + guardrails those outcomes need.
5. **#5 Riskiest-assumption finder** → de-risks each bet (four risks + ethics) and seeds the `EXP` to test it first.
6. **#2 Drafter** → drafts the phase artifact (PRD, Roadmap, Launch Plan) in template shape, TODO-honest.
7. **#3 Red-teamer** → attacks the draft before the gate, ranking findings `S1`–`S4`.
8. **#8 Gate-challenger** → makes the Persevere / Pivot / Kill call with evidence.

When any pattern surfaces an unknown (a `TODO:` for a customer need, market number, benchmark, metric baseline, or regulation), hand off to [`research-and-agents.md`](research-and-agents.md) for the matching research / interview / agent trigger — and remember the house rule: **library / framework / SDK / API / CLI / cloud questions go through the Context7 docs MCP first**, before a general web search ([Protocol §5](../02_AI_Product_Manager_Protocol.md)). Above all: **AI accelerates; the human decides, and never lets an un-verified AI artifact enter a baseline.**
