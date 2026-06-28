# Quality Checklists — the craft bar per artifact

> The companion to [`../checklists/gate-reviews.md`](../checklists/gate-reviews.md). **Gate reviews answer "may we advance?"** (the pass/fail criteria a gate owns). **This file answers "is the artifact any good?"** — the reusable quality bar for each key deliverable, so a doc that technically "checks the box" but is fluff, vanity, or output-theatre gets caught *before* it reaches a gate. When a quality bar and a gate ever disagree on what a gate *requires*, [`../checklists/gate-reviews.md`](../checklists/gate-reviews.md) wins; this file only raises the craft floor underneath it.
>
> Everything here conforms to [`../05_Conventions.md`](../05_Conventions.md) — the gate ladder (§2), the ID grammar (§3), the traceability spine (§4), severity (§5), frontmatter/status (§6), outcomes-over-outputs (§7), and AI-accelerates/human-decides (§11). These checklists **cite** those rules; they never redefine them.

## How to use this file

1. **Draft the artifact** with its phase skill, then **self-score it against the bar below** — each line is Pass / `TODO:` (owner+date) / Waived (recorded), exactly like a gate.
2. **Run the smell test** (the *Fails the bar if…* line). One smell present = the artifact is not done, regardless of how many boxes are ticked.
3. **Then** take it to its gate ([`../checklists/gate-reviews.md`](../checklists/gate-reviews.md)) with the six-thread review.
4. **AI drafts, the human owns the call** ([Conventions §11](../05_Conventions.md)). Have the AI red-team the artifact against its bar; never let the AI's "looks good" stand in for the judgment the bar is testing.

> A quality bar is not a word count. The best artifacts here are usually the *shortest* ones that survive their smell test — a one-page strategy with a real diagnosis beats ten pages of adjectives.

---

## 0. Universal artifact hygiene (applies to *every* deliverable)

Before any artifact-specific bar, every file must pass this:

- [ ] **Frontmatter complete** ([Conventions §6](../05_Conventions.md)): `Document`, `Document ID` (`<TYPE>-<SLUG>-vX.Y`), `Status`, `Owner`, `Updated` (absolute `YYYY-MM-DD`, never "next quarter").
- [ ] **Status string is legal**: `Draft` → `In Review` → `Approved (<Gate>-approved <date>)` → `Superseded`, or `Living` for never-done artifacts (roadmap, OST, KPI scorecard, feedback log, risk register, stakeholder map).
- [ ] **IDs conform** ([Conventions §3](../05_Conventions.md)): uppercase, hyphenated, zero-padded (`OPP-01`, not `opp-1`); stable for life (retire with `(deprecated)`, never renumber); placeholders are `EXP-TBD`/`MET-TBD`, never a blank cell.
- [ ] **Traceability intact** ([Conventions §4](../05_Conventions.md)): the artifact links *backward* (why does this exist? → an `OPP`/`OBJ`/`INS`) and *forward* (how will we know it worked? → a `MET`). An artifact with no line into the golden thread is orphaned — fix or cut it.
- [ ] **Outcomes over outputs** ([Conventions §7](../05_Conventions.md)): the artifact leads with a customer/business outcome, not a feature/activity count.
- [ ] **TODO-honesty** ([Conventions §11](../05_Conventions.md)): every unknown is `TODO: <what's owed — who — by when>` with a recommendation to research or interview. **No invented** market sizes, baselines, quotes, dates, or "commitments". A blank with an owner is honest; a fabricated figure is a defect that propagates into every downstream gate.
- [ ] **Single source of truth**: one living copy with a changelog/owner; no forked "final_v3_real" duplicates.
- [ ] **Right-sized to the tailoring profile** ([Tailoring Guide](../04_Tailoring_Guide.md)): a tailored-down section is recorded (`tailored: <reason>`), never silently dropped. The responsible-product floor is never tailored out.

> **Fails the bar if:** any ID is ad-hoc, any unknown is a confident guess, any "done" has no metric behind it, or the status/frontmatter is missing or illegal.

---

## 1. A good Vision *(P01 · `Vision.md` · feeds G1)*

A good vision describes **the customer's better world once you've won** — aspirational, outcome-driven, and durable (3–10 yrs) — not a feature list or a slogan.

- [ ] Written from the **customer's point of view** (work backwards from their better life), not the company's roadmap.
- [ ] **Outcome-driven and durable**: it would still be true if every current feature were replaced; it commits to a *destination*, not an implementation.
- [ ] **Steel-man passes**: a real customer would recognise the described world as materially better than today's status quo / "do nothing".
- [ ] **Distinct from strategy**: it inspires and aligns; it does *not* pretend to be the set of hard choices (that's §2). Optional PR-FAQ framing to force clarity on the value.
- [ ] **Addresses the 2026 distribution reality** at least implicitly: as building gets cheap, the vision's value must be something customers will actually find and adopt.

> **Fails the bar if:** it could sit on any competitor's wall unchanged, it's a list of features/dates, or it's a tagline with no customer in it.
> Sources: [Working Backwards / PR-FAQ](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/) · [Cagan — the new standard for product in the age of AI](https://visitmy.website/2026/04/24/marty-cagans-new-standard-for-product-in-the-age-of-ai/).

## 2. A non-fluff Strategy — the Rumelt test *(P01 · `Product_Strategy.md` · feeds G1)*

A good strategy is a **kernel**: an honest *diagnosis*, a *guiding policy*, and *coherent actions* — a real choice that forecloses options, not a list of goals dressed up as strategy.

- [ ] **Diagnosis**: names the *single most important obstacle/insight* — the crux that decides whether you win. Grounded in evidence, or the gap is logged as an `ASM-*` for P02/P03.
- [ ] **Guiding policy**: a clear overall approach to *that* diagnosis — what makes you able to win *here* specifically.
- [ ] **Coherent actions**: a few mutually-reinforcing moves that enact the policy (they point the same way; they're not a wish-list of unrelated initiatives).
- [ ] **Explicit non-goals**: the segments/problems/channels/business-models you decline. An empty non-goals list means no real choice was made.
- [ ] **Strategy Stack alignment**: mission → company strategy → *this product strategy* → roadmap → goals each derives from the one above (Mehta).
- [ ] **Distribution thesis present** (2026): how customers find and adopt this, not just what it does.
- [ ] **OKRs are not masquerading as the strategy**: if the "strategy" is a list of KRs, the diagnosis was skipped — send it back.

> **Fails the bar if:** it's a list of goals/values/aspirations · it has adjectives but no obstacle · it tries to do everything (no non-goals) · the actions don't reinforce each other (Rumelt's "fluff" / "failure to face the problem" tests).
> Sources: [Rumelt — Good Strategy/Bad Strategy](https://www.productbookshelf.com/2020/11/good-strategy-bad-strategy/) · [Product Strategy Stack](https://www.ravi-mehta.com/product-strategy-stack/) · [OKRs ≠ strategy](https://www.antmurphy.me/newsletter/okrs-strategy).

## 3. A good North Star + OKRs *(P01 · `North_Star_and_OKRs.md` · `MET`/`OBJ`/`KR` · feeds G1, instrumented at P12)*

A good North Star is **one value-exchange metric** that rises only when a customer got real value and that *leads* revenue, sitting atop a small tree of movable inputs; good OKRs *measure* the strategy in outcomes.

- [ ] **North Star is value-exchange**, not vanity: it cannot rise while customers churn or are harmed. (Reject DAU, registered users, raw revenue, page views as the star.)
- [ ] **In your sphere of influence** and **leading**, not purely lagging — you can act to move it before the lagging confirmation arrives.
- [ ] **2–4 input metrics** named as a tree (breadth · depth · frequency · efficiency); each is something the team can actually move.
- [ ] **Guardrails paired with the star** so growth isn't bought with harm (trust, quality, cost, churn).
- [ ] **1–3 Objectives**, each qualitative and outcome-framed; **Key Results are measurable and from-X-to-Y-by-when** — and express *outcomes, not shipped features*.
- [ ] **Each KR moves the North Star or an input**; no KR is "launch feature Z" (that's a task, not a result).
- [ ] **Baselines honest**: real baseline where it exists, `TODO:` where it doesn't — never an invented number.

> **Fails the bar if:** the star is a number you can game without delivering value · there are no input metrics ("optimize the North Star directly") · a KR counts output · there are no guardrails.
> Sources: [North Star framework](https://amplitude.com/books/north-star/about-north-star-framework) · [good vs bad North Star](https://amplitude.com/blog/good-bad-north-star-metric) · [OKRs for PM](https://monday.com/blog/rnd/okrs-for-product-management/).

## 4. A good Persona / JTBD *(P03 · `Personas.md` / `JTBD.md` · `PER`/`JOB`/`INS` · feeds G2)*

A good persona is a **research-grounded behavioural summary** (not demographic fiction); a good Job-to-be-Done is the **progress a customer is trying to make**, captured in their words from *past behaviour*.

- [ ] **Every persona/JOB cites its `INS-*`** — real interview/feedback evidence. No research, no persona (record `TODO: recruit + interview`).
- [ ] **Behaviour over demographics**: goals, motivations, context, current workarounds — not age/job-title portraiture.
- [ ] **Grounded in past behaviour, in the customer's words** ("tell me about the *last time*…"), never in hypotheticals or "would you use this?".
- [ ] **Job stories well-formed**: *When [situation], I want to [motivation], so I can [outcome]*; typed functional / emotional / social.
- [ ] **Right JTBD school for the question**: Switch/Forces to *find* the job; ODI (Importance × Satisfaction → under-served outcomes) to *quantify and prioritise* it — stated and justified.
- [ ] **The status-quo / "do nothing" alternative** the customer compares against is named.
- [ ] **Disconfirming evidence sought**; no conclusion rests on <5 conversations or one loud voice; AI/synthetic "insights" are not standing in for real ones.

> **Fails the bar if:** a persona was invented in a workshop · a JOB is solution-shaped ("wants our feature") rather than progress-shaped · it's built on a survey/hypothetical instead of past behaviour.
> Sources: [NN/g — personas & JTBD](https://www.nngroup.com/articles/personas-jobs-be-done/) · [Ulwick — ODI/JTBD](https://anthonyulwick.com/jobs-to-be-done/) · [Intercom — job stories](https://www.intercom.com/blog/accidentally-invented-job-stories/) · [Torres — interview snapshot](https://www.producttalk.org/2024/02/interview-snapshot/).

## 5. A good Opportunity — problem, not solution *(P04 · `Opportunity_Assessment.md` · `OPP` · feeds G3)*

A good opportunity is a **customer need/pain/desire** placed on the Opportunity Solution Tree under a desired outcome, sized to *rank* (not forecast), with its real risks named — never a solution in disguise.

- [ ] **It's a problem, not a solution**: the litmus test — if only one implementation could address it, it's a solution masquerading as an opportunity; reframe one level up. A real `OPP-*` admits **2–3 candidate solutions** on the OST.
- [ ] **On the OST under an `OBJ/KR`**, traced to `INS-*`/`JOB-*`; if it fits no outcome, that strategy-misfit is surfaced (not papered over).
- [ ] **Sized both ways**: top-down *and* bottom-up, reconciled, with stated assumptions. (Top-down-only is the #1 red flag; **TAM is a ceiling, never revenue**.)
- [ ] **The four big risks rated** by Importance × Evidence — value/desirability, usability, feasibility, business-viability — **plus ethics** as a first-class fifth assumption; the highest-importance/lowest-evidence one is what P07 tests *first*.
- [ ] **Lean business case** with ranges + sensitivity (not false-precision multi-year ROI), the value metric (`MET-TBD`), and the **cost of *not* doing it**.
- [ ] **A clear Go/No-Go/Pivot recommendation** with *what would change the call* and a named sponsor who will defend the funded outcome.

> **Fails the bar if:** "build feature X" is framed as the opportunity · sizing is top-down-only or TAM-as-forecast · ethics is a footnote · there's one solution, not a comparison · no sponsor owns it.
> Sources: [SVPG — assessing opportunities](https://www.svpg.com/assessing-product-opportunities/) · [SVPG — four big risks](https://www.svpg.com/four-big-risks/) · [Torres — OST](https://www.producttalk.org/opportunity-solution-trees/) · [Torres — five assumptions](https://www.producttalk.org/2023/10/five-types-of-assumptions/) · [TAM/SAM/SOM](https://waveup.com/blog/tam-sam-som/).

## 6. A good Now/Next/Later Roadmap *(P05 · `Roadmap.md` · `RMI` · feeds G4)*

A good roadmap is a **decision and communication system of outcomes over a horizon** — confidence decaying Now→Later — *not* a dated feature Gantt and *not* a contract of delivery dates.

- [ ] **Swimlanes are outcomes (`OBJ/KR`), not teams or features.** ("Cut time-to-first-value", not "Platform team Q3".)
- [ ] **Every Now item is an `RMI-*` tracing to an `OPP-*` (evidence) and an `OBJ/KR` (outcome) and carries a `MET-*`** it will move. No opportunity → no slot.
- [ ] **Confidence/specificity gradient visible**: Now = committed + capacity-checked; Next = directional, not promised; Later = themes/outcomes only (**don't over-specify Later like Now**).
- [ ] **A decision system, not a wish list**: each Now/Next bet records *problem · segment · confidence · riskiest assumption · decision date*.
- [ ] **Capacity sanity-checked** (never planned at 100%); cross-team/tech **dependencies surfaced as `DEP-*`**.
- [ ] **Per-audience views off one source of truth**: exec (outcomes, BLUF), team (slices + deps), customer/sales (themes only, **no dates**).
- [ ] **Read as intent + confidence, not a date promise**; a "Deliberately NOT now" section exists. Agent/API user class given a lane + its own metrics if applicable (2026).

> **Fails the bar if:** it's a Gantt of dated features in a Now/Next/Later costume · a Now item has no `OPP-*`/`MET-*` · Later is specified like Now · it was promised to sales by date · prioritised by HiPPO or raw request count.
> Sources: [ProdPad — Now/Next/Later](https://www.prodpad.com/blog/invented-now-next-later-roadmap/) · [outcome-based roadmaps](https://www.prodpad.com/blog/outcome-based-roadmaps/) · [Torres — roadmaps with timelines](https://www.producttalk.org/2023/10/roadmaps-with-timelines/) · [GIST planning](https://itamargilad.com/gist-framework/).

## 7. A good PRD (+ NFRs incl. WCAG/privacy) *(P08 · `PRD.md` + `NFR_Checklist.md` · `REQ`/`FEAT` · feeds G6)*

A good PRD **memorialises validated discovery** at the lightest weight the decision tolerates — outcome up top, scope explicit both ways, every requirement testable, and **every non-functional class forced to a one-line answer**.

- [ ] **BLUF**: problem (customer's words) · target `PER-*` · parent `OPP-*` · success `MET-*` (target + guardrails) — stated *first*, not buried under a feature list.
- [ ] **Scope explicit both ways** via MoSCoW: In (Must/P0) · **Out (Won't — explicit no-gos)** · Later (Could). The MVP line is held: smallest slice that moves the metric *and* produces learning.
- [ ] **Functional requirements testable**: `REQ-F-*` with fit criteria or Given/When/Then; vague verbs ("fast/intuitive/secure") replaced by *number + condition*. Each cites its parent `SOL`/`OPP`.
- [ ] **Every NFR class answered — one line each, "N/A — because…" allowed, blank is not** ([Conventions §3.4](../05_Conventions.md)): Usability/accessibility `REQ-U-*` (**WCAG 2.2 AA** default; EN 301 549 / EAA), Performance `REQ-P-*` (numeric, e.g. p95), Reliability/Operational `REQ-O-*` (SLO + rollback), **Security/Privacy `REQ-SEC-*` (GDPR Art. 25 by-design; EU AI Act Art. 50 transparency from Aug 2026)**, Constraint `REQ-C-*`.
- [ ] **GenAI classes present *iff* the feature uses a model**: model behaviour, eval/quality thresholds, hallucination/bias guardrails, fallback UX, human-in-the-loop. (Skip entirely for non-AI features — don't pad.)
- [ ] **Prototype-as-spec used for UI** (link it; don't re-describe pixels in prose); prose reserved for behaviour, thresholds, edge cases, NFRs.
- [ ] **Open questions + `DEP-*` + carried `ASM-*` listed**, each a `TODO:` with owner+date; eng + design + key stakeholders reviewed/approved (or `TODO: G6 review scheduled`).
- [ ] **No orphaned or invented requirements**: every `REQ`/`FEAT` traces to a `SOL`/`OPP`; no hallucinated "commitments" or numbers.

> **Fails the bar if:** the PRD was written *instead of* doing discovery · any NFR class is blank · a requirement is untestable or has no parent `SOL`/`OPP` · it's an exhaustive output catalogue with no `MET` · a GenAI feature is spec'd like a deterministic one.
> Sources: [SVPG — PRD documents, doesn't make, decisions](https://www.svpg.com/discovery-vs-documentation/) · [NFR checklist 2026](https://www.forasoft.com/blog/article/non-functional-requirements-checklist-2026) · [GenAI PRD](https://www.reforge.com/guides/write-a-prd-for-a-generative-ai-feature) · [one-pager PRD](https://plan.io/blog/one-pager-prd-product-requirements-document/) · responsible floor: [`../cross-cutting/Responsible_Product.md`](../cross-cutting/Responsible_Product.md).

## 8. A good User Story (INVEST) + Acceptance Criteria (Given/When/Then) *(P09 · `User_Stories.md` · `US`/`AC` · feeds G7)*

A good story is a **vertically-sliced, INVEST placeholder for a conversation** that traces to an outcome; good acceptance criteria are **testable, declarative, and cover the unhappy paths** — co-authored by the Three Amigos just-in-time.

- [ ] **INVEST**: Independent · Negotiable · Valuable · Estimable · Small · Testable. Written *As a `PER-*` I want `<capability>` so that `<OBJ/KR outcome>`* — a starter for a conversation (3 C's), not a frozen spec.
- [ ] **Sliced vertically, never horizontally**: each `US-*` is demoable end-to-end and delivers observable user/business value. **No "build the API"/"frontend for X" technical-layer stories.** Oversized stories split with SPIDR, kept vertical.
- [ ] **Traces up to a `FEAT-`/`REQ-`/`OPP-`/`OBJ/KR`**; the "so that…" is a real outcome, not a restatement of the capability.
- [ ] **AC are testable and declarative** (what, not how): `AC-*` scoped to its `US-*`, **Given/When/Then** where it adds clarity, checklist where it doesn't. Vague adjectives are not AC.
- [ ] **Unhappy paths forced**: negative · boundary · error/empty · **accessibility (WCAG 2.2)** · **privacy/security (consent/data-handling)** — not just the happy path.
- [ ] **Persona is real** (researched `PER-*`), not invented; AI-suggested edge cases are validated against real behaviour, not trusted as coverage.
- [ ] **DoR is a light readiness conversation, not a rigid gate**; **DoD includes instrumentation + the `MET-*` link** + the responsible-product floor.
- [ ] **Sizing honest**: estimates *or* explicit #NoEstimates flow; story points are never compared across teams or reported as a KPI; prefer Monte Carlo / flow metrics for "when".

> **Fails the bar if:** a story is a horizontal/technical task · AC are vague adjectives or only the happy path · the "so that…" is a feature restatement · DoD has no `MET-*` · a persona is invented · points are used as a KPI.
> Sources: [INVEST criteria](https://ones.com/blog/invest-criteria-scrum-user-stories-guide/) · [Humanizing Work — splitting stories](https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/) · [story mapping](https://www.nngroup.com/articles/user-story-mapping/) · [Gherkin / Given-When-Then](https://testquality.com/gherkin-user-stories-acceptance-criteria-guide/) · [DoR is an anti-pattern](https://medium.com/agileopedia/a-definition-of-ready-is-an-anti-pattern-463e84463537) · [Definition of Done](https://www.atlassian.com/agile/project-management/definition-of-done).

## 9. A trustworthy Experiment *(P13 · `Experiment_Plan.md` + `Experiment_Readout.md` · `EXP` · per-experiment health check)*

A trustworthy experiment is **pre-registered before launch**, tied to a falsifiable hypothesis and a riskiest assumption, powered, guarded, and read out with **statistical and business significance kept separate** — never narrated noise.

- [ ] **A/B is the right tool**: enough traffic for power, a **reversible (two-way-door)** decision, and a clean primary metric — and it's *not* a compliance/obvious/one-way-door change. If not, an alternative (qual, painted-door, before/after, ship-with-holdout) is chosen instead. (A/B-testing everything is an anti-pattern.)
- [ ] **Falsifiable hypothesis**: *We believe [change] causes [effect] for [segment], measured by [primary `MET-*`], because [`INS-*`/`ASM-*`]* — tied to the `ASM-*` it de-risks and the `OPP-*`/`OBJ` it serves.
- [ ] **One primary OEC + 2–3 guardrails + diagnostics, chosen from the Measurement Plan** (not invented); **decision rule stated up front**: ship iff primary wins AND no guardrail breached AND the effect is business-significant.
- [ ] **Pre-registered & powered before launch**: MDE, alpha, power ≥0.8 → sample size + runtime (**≥1 full business cycle**); method chosen deliberately (fixed-horizon / **sequential mSPRT** / Bayesian / bandit); CUPED if pre-period data exists; **analysis plan locked (anti-peeking)**.
- [ ] **Trustworthiness checks**: randomization unit defined, **A/A + SRM** planned, multiple-comparison correction if >1 metric/variant, an explicit stop rule (no naive peeking).
- [ ] **AI-feature handling if applicable**: classic A/B replaced by permanent holdouts / interleaving / response-quality metrics; novelty/primacy watched.
- [ ] **Readout separates statistical from business significance**, reports guardrail status + SRM-clean, cuts **only pre-registered** segments (no fishing), and lands a call: **Ship / Iterate / Kill / Inconclusive-extend** with a `DEC-*` and the loop-back.
- [ ] **Responsible floor**: no dark-pattern variant; guardrails protect trust/accessibility; EU AI Act Art. 50 transparency for AI variants under test.

> **Fails the bar if:** stopped at the first p<0.05 on a fixed-horizon test · "significant" on an underpowered sample · shipped a stat-sig but worthless/costly lift · ran <1 week / odd window · post-hoc segment fishing · "we're Bayesian so we peek freely" · dropped guardrails to move faster.
> Sources: [Kohavi — Trustworthy Online Controlled Experiments (OEC)](https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59) · [power analysis](https://www.statsig.com/perspectives/power-analysis-ab-testing) · [sequential testing](https://www.statsig.com/updates/update/sequential-testing-capabilities) · [frequentist vs Bayesian](https://www.geteppo.com/blog/comparing-frequentist-vs-bayesian-approaches) · [guardrail metrics](https://mixpanel.com/blog/guardrail-metrics/) · [experimentation in the age of AI](https://prepvector.substack.com/p/experimentation-in-the-age-of-ai).

## 10. A good KPI / Metric — vanity test + guardrail *(P12 · `Measurement_Plan.md` / `KPI_Scorecard.md` · `MET` · continuous health check; feeds G8/G9)*

A good metric **measures value exchanged**, passes Cutler's vanity test (it changes a decision), shows context (cohort/ratio/caveat), is tiered and leading/lagging-tagged, and travels with a guardrail.

- [ ] **Passes Cutler's vanity test**: "if this number moved, what decision changes?" No answer → it's vanity; demote to diagnostic or cut. (Reject raw views/downloads/cumulative totals/signups as KPIs.)
- [ ] **Value exchanged, not activity**; **rates over cumulative totals**; **retention reported by cohort**, never a single blended line.
- [ ] **Tiered**: success (did the bet work?) · **guardrail (what must *not* break — pick 2–3: latency, error rate, churn, complaint rate, unit economics)** · diagnostic (why).
- [ ] **Tagged leading vs lagging and instrumented both** — lagging-only is a rear-view mirror; pair every lagging metric with a leading partner you can act on.
- [ ] **Always shown with context** (comparison / ratio / cohort / caveat) and the **proxy it stands for** named with its honest limits; component vs influence links labelled (influence links are hypotheses → `EXP-TBD`).
- [ ] **Traces to an `OBJ/KR`/`OPP`**; sits in a **metric tree** under one value-exchange North Star with 3–5 movable inputs (no lone, uninstrumented North Star "optimized directly").
- [ ] **Guardrail rollback thresholds set** (feeds G9); baselines/targets are real or `TODO:` — never fabricated, benchmarks cited.
- [ ] **Data-informed, not data-driven**: quant = *what*, qual (`FB-*`/discovery) = *why*; causal claims are human-owned and proven by experiment, not asserted from correlation.

> **Fails the bar if:** a raw count is reported as success · the North Star has no inputs · a "win" has no guardrail · retention is one blended line · an NPS/survey score is the primary KPI with no behavioural grounding · tracking ships with no consent basis.
> Sources: [vanity metrics (Cutler's test)](https://amplitude.com/blog/vanity-metrics) · [North Star framework / metric tree](https://amplitude.com/books/north-star/about-north-star-framework) · [guardrail metrics](https://posthog.com/product-engineers/guardrail-metrics) · [leading vs lagging](https://www.statsig.com/perspectives/leading-vs-lagging-indicators-in-product-metrics) · [don't be data-driven](https://www.productfocus.com/why-product-managers-should-not-be-data-driven/) · [tracking plan](https://amplitude.com/blog/create-tracking-plan).

## 11. A clean Launch — release ≠ launch *(P11 · `Launch_Plan.md` / `GTM_Plan.md` / `Rollout_Plan.md` · feeds G9)*

A clean launch **lands the product in the market with GTM** — separating the reversible engineering *release* from the *launch* moment, rolling out progressively behind flags with guardrails + rollback, and enabling partner teams internal-before-external. Success is the outcome moved, not the press earned.

- [ ] **Release and launch are named separately**: the engineering release is staged/reversible (flags · canary · kill-switch, from P10); the launch is the distinct GTM moment. (Conflating them is the root of most launch risk.)
- [ ] **Launch tier (1/2/3) chosen** by reach × strategic impact × reversibility; **Tier 1 capped (~2–3/quarter)** — not every launch is Tier 1.
- [ ] **Positioning/messaging is customer-validated** (Dunford order: alternatives → unique attributes → value → best-fit segment → category), leads with **"why now" + customer value before "what's new"** — not internal consensus or "Mad-Libs".
- [ ] **GTM motion + pricing fit the value unit**: PLG / SLG / **Hybrid** / Community matched to complexity × ACV; pricing per-seat / usage / **outcome/credit** (never per-seat for an AI/agent product whose value is outcomes). Both logged as `DEC-*`.
- [ ] **Progressive rollout by default** (internal → canary → beta → GA, % behind flags) with **guardrail metrics + thresholds that trigger rollback** and a named kill-switch owner. Big-bang only with a recorded reason.
- [ ] **Partner teams enabled internal-before-external** via RACI (PMM-led; exactly one Accountable): Sales, Support, Success, Legal/PR with battlecards/FAQs/demos.
- [ ] **Success + guardrail `MET-*` defined and reviewed at 7/30/90 days**, tied to the `OBJ/KR` — **not** press/signups (vanity).
- [ ] **Pre-mortem run** ("90 days later it failed — why?") → `RSK-*`; legal/privacy sign-off and on-call confirmed for the launch window.

> **Fails the bar if:** it's a big-bang on a fixed date with no rollback · everything is Tier 1 · messaging is internal consensus · per-seat pricing on an outcome-value product · Sales/Support learn of it from customers · success is measured in press.
> Sources: [launch tier framework](https://www.productmarketingalliance.com/launch-tier-framework/) · [Dunford — positioning exercise](https://www.aprildunford.com/post/a-product-positioning-exercise) · [SVPG — against big-bang releases](https://www.svpg.com/big-bang-releases/) · [no more big-bang launches](https://abicox.medium.com/no-more-big-bang-launches-81f0ce5fdc91) · [progressive rollouts](https://launchdarkly.com/docs/home/releases/progressive-rollouts) · [2026 SaaS/AI/agentic pricing](https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models) · [PLG vs SLG](https://userpilot.com/blog/product-led-vs-sales-led/).

## 12. A responsible-product check *(cross-cutting thread #5 · `_threads/Responsible_Product_Review.md` · `RSK`/`ISS` · reviewed at every gate)*

A good responsible-product check designs **privacy, accessibility, fair AI behaviour, security, and safety *in* — with a named human accountable** — re-run against current scope at every gate, not patched before launch. The floor is **non-negotiable and mostly enforceable law**.

- [ ] **A · Privacy by design (GDPR Art. 25)**: lawful basis + withdrawable consent; **data minimised** (every field justified); retention + erasure paths defined; **DPIA** done where processing is high-risk. (`REQ-SEC-*`.)
- [ ] **B · Accessibility (WCAG 2.2 AA + EN 301 549 / EAA)**: target conformance stated; **POUR** self-check on in-scope flows; audited with a real tool/screen reader (axe/WAVE/Lighthouse + manual); open `ISS-*` carry owner + due date. (EAA enforceable since 28 Jun 2025.) (`REQ-U-*`.)
- [ ] **C · EU AI Act tier + Article 50**: if AI/automated decisioning, **Legal-confirmed** risk tier (prohibited = Kill candidate; never self-certify high-risk); **Article 50 transparency implemented from 2 Aug 2026** — disclose AI interaction + label AI-generated content; human oversight / override / kill-switch designed.
- [ ] **D · AI behaviour (continuous, not one-time)**: eval/quality thresholds (`MET-*`); **disaggregated bias/fairness review**; **drift + performance monitoring live before launch with an alert owner**; hallucination/error guardrails + fallback/human-in-the-loop (map to NIST AI RMF: Govern/Map/Measure/Manage).
- [ ] **E · Security, trust & safety**: threat model with a foreseeable-misuse/harms taxonomy; protections for vulnerable users; T&S controls (reporting, rate limits, moderation, escalation).
- [ ] **Accountability**: a **named human** has signed off each section; risks scored `RSK-*` (Likelihood × Impact, 1–5); **no Persevere over an open S1/S2 or unresolved privacy/accessibility/legal blocker** — Hold or Persevere-with-actions only. Every section has an explicit answer or a recorded `RSK-*`, **never a blank**.

> **Fails the bar if:** "we'll do accessibility later / it's a QA pass" · privacy treated as legal's end-of-line task · "the AI Act is future, not now" (Art. 50 bites Aug 2026) · a one-time pre-launch bias check · AI output pasted into a consequential decision with no accountable human.
> Sources & full method: [`../cross-cutting/Responsible_Product.md`](../cross-cutting/Responsible_Product.md) · [GDPR Art. 25](https://gdpr-info.eu/art-25-gdpr/) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [European Accessibility Act](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) · [EU AI Act framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) · [Art. 50 kept for Aug 2026 (Omnibus)](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/) · [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

## 13. A clean Sunset *(P16 · `Sunset_Decision.md` / `Deprecation_Plan.md` / `Migration_Comms.md` · `DEC`/`RSK` · feeds G10)*

A clean sunset is a **deliberate, multi-month, trust-preserving retirement** — diagnosed on forward value-vs-cost (sunk cost set aside), with a viable destination for every affected customer and the data/legal lifecycle handled — not an abrupt switch-flip.

- [ ] **Diagnosed, not reflexive**: usage (`MET-*`), cost, and strategic fit compared to the original `OPP-*`/`Business_Case`; **discoverability/onboarding/usability ruled out first** (a hidden feature isn't a worthless one — low usage may be a Pivot, not a kill).
- [ ] **Sunk cost explicitly set aside** (escalation of commitment); **exit criteria / pre-mortem** name what justifies retirement *or* a fix.
- [ ] **Retirement type chosen** (full EOL · feature removal · API/version deprecation · pricing-tier sunset · merge) with the right handling for each.
- [ ] **A viable destination, not just an exit**: an alternative, migration path, or export for every affected segment; **high-touch/high-value accounts triaged for hands-on help**.
- [ ] **Runway sized realistically — estimate, then double**; runway (supported, migration open) distinguished from the EOL date; **quality + support maintained *through* the runway** (cutting support at announcement is the classic trust-killer). APIs use `Sunset`/`Deprecation` headers + a dev-friendly window.
- [ ] **Comms plan: 5–7 multi-channel touchpoints**, transparent about *why / timeline / migration path*, tailored per segment, BLUF for execs/internal teams. (No abrupt 30-day notice.)
- [ ] **Data & legal lifecycle handled**: retention, **export**, and **automated deletion/erasure** (GDPR/CCPA storage-limitation; test/dev/backup data in scope); contracts/SLAs checked; Support, Sales, Finance, Legal briefed. Each obligation logged as `RSK-*`.
- [ ] **Capacity + outcome freed accounted for** (sunset is portfolio hygiene, not failure); the call logged as `DEC-*`; `Portfolio_View.md` updated; a **5D Debrief** feeds new `OPP-*`/`INS-*` back to discovery.

> **Fails the bar if:** killed on a single low-usage number with no diagnosis · driven by sunk cost · an abrupt notice (esp. developer-facing) · support cut at announcement · an exit with no destination · deletion plan manual-only or omitting backups/test/dev · no retrospective.
> Sources: [ProductPlan — EOL guide](https://www.productplan.com/learn/how-to-end-of-life-product) · [strategic deprecation](https://nextsprints.com/blog/sunset-product-feature-end-of-life-best-practices-strategic-deprecation) · [Product School — sunsetting a product](https://productschool.com/blog/product-fundamentals/sunsetting-product) · [sunk-cost fallacy](https://asana.com/resources/sunk-cost-fallacy) · [deprecate APIs (Sunset headers)](https://nordicapis.com/how-to-smartly-sunset-and-deprecate-apis/) · [GDPR storage limitation / erasure](https://www.legiscope.com/blog/storage-limitation.html).

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — the contract: gate ladder (§2), IDs (§3), traceability spine (§4), severity/priority (§5), frontmatter/status (§6), outcomes-over-outputs (§7), canonical citations (§8), threads (§10), AI-accelerates/human-decides (§11).
- [`../checklists/gate-reviews.md`](../checklists/gate-reviews.md) — the gate pass/fail criteria (G0–G10) + the every-gate six-thread review. **This file complements it: gates decide *advance?*, these bars decide *good?*.**
- [`../cross-cutting/Responsible_Product.md`](../cross-cutting/Responsible_Product.md) — the full responsible-product method behind §12.
- Phase skills (artifact shapes + AI prompt packs): [`../skills/`](../skills/). Blank templates: [`../templates/`](../templates/). Frameworks map: [`../03_Frameworks_Map.md`](../03_Frameworks_Map.md). Grounding evidence: [`../reference/2026_Research_Pack.md`](../reference/2026_Research_Pack.md) (all URLs above are drawn from it).
