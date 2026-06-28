# Comprehensive Guide — the *why* behind the workflow

> This is the deep-theory companion to the workflow: a training-curriculum chapter that explains
> **why** the [17 phases](../01_Workflow_Overview.md), [10 gates](../05_Conventions.md),
> [6 threads](../05_Conventions.md), and [framework cards](../03_Frameworks_Map.md) are shaped the
> way they are. The runbook tells you *what to do next*; this tells you *what you are actually
> doing and why it works*. Read it once end to end, then return to a section when a phase asks you
> to make a hard call.
>
> Every external claim cites a real 2026 source from the [Research Pack](2026_Research_Pack.md);
> framework attributions follow [Conventions §8](../05_Conventions.md). Nothing here is invented;
> where the field is genuinely unsettled, the text says so. **AI accelerates this work; a human
> owns every judgment** ([Conventions §11](../05_Conventions.md)).

**How to read this chapter**

| If you want the theory behind… | Section | Phase(s) / Thread / Card |
|---|---|---|
| Why we measure outcomes, not features | §1 | [P00](../skills/pm-phase-00-charter/) · [Build Trap](../frameworks/good-strategy-bad-strategy.md) |
| Why problem precedes solution | §2 | [Double Diamond](../frameworks/design-thinking-double-diamond.md) |
| Why discovery never stops | §3 | [Continuous Discovery](../cross-cutting/Continuous_Discovery.md) |
| Why a gate is a *decision*, not a checkpoint | §4 | [Lean Startup](../frameworks/lean-startup.md) |
| How to study what customers are *hiring* | §5 | [JTBD](../frameworks/jtbd.md) |
| The single artifact that connects it all | §6 | [Opportunity Solution Tree](../frameworks/opportunity-solution-tree.md) |
| Where direction comes from | §7 | [P01](../skills/pm-phase-01-strategy/) · [Rumelt](../frameworks/good-strategy-bad-strategy.md) · [North Star](../frameworks/north-star-metric-tree.md) · [OKRs](../frameworks/okrs.md) |
| Why the framework never makes the call | §8 | [P06](../skills/pm-phase-06-prioritization/) · [RICE](../frameworks/rice.md) |
| What "evidence" actually requires | §9 | [P13](../skills/pm-phase-13-experimentation/) · [A/B card](../frameworks/ab-testing-experimentation.md) |
| Why growth compounds (or leaks) | §10 | [P15](../skills/pm-phase-15-growth/) · [PLG / Growth Loops](../frameworks/plg-growth-loops.md) |
| Why responsible product is non-negotiable | §11 | [Responsible Product](../cross-cutting/Responsible_Product.md) |
| How to work *with* AI without abdicating | §12 | [AI PM Protocol](../02_AI_Product_Manager_Protocol.md) |
| How the whole machine fits together | §13 | [Conventions §4 — the spine](../05_Conventions.md) |

---

## 1. The product operating model & outcomes over outputs

Start with the deepest idea, because every other idea in this workflow is downstream of it.
A **feature factory** measures itself by the *output* it produces — features shipped, tickets
closed, story points burned. A **product operating model** measures itself by the *outcomes*
it produces — customer and business problems actually solved. The shift from the first to the
second is the single most important transition in modern product management, and it is the
reason this workflow exists.

Marty Cagan's product operating model is now the reference standard precisely because the
feature factory has a fatal flaw: a team can be maximally busy and minimally valuable. Melissa
Perri named this the **build trap** — being stuck measuring success by what you ship rather
than the value you create. The escape is to give empowered teams *problems to solve and
strategic context*, not a feature backlog, and to hold them accountable for a **moved metric**,
not a closed ticket (https://www.svpg.com/the-product-operating-model-an-introduction/ ·
https://www.oreilly.com/library/view/escaping-the-build/9781491973783/ ·
https://amplitude.com/blog/move-from-outputs-to-outcomes).

This is why [Conventions §7](../05_Conventions.md) makes *outcomes over outputs* the **prime
directive**: roadmaps express outcomes, OKRs express outcomes, and "done" is a metric that moved.
The discipline is hard to hold — as of 2026, surveys still find ~54% of PMs primarily tracking
features and releases rather than outcomes
(https://www.lennysnewsletter.com/p/building-better-roadmaps-janna-bastow). The workflow fights
that gravity structurally: a phase that produces output with no traceable line back to an outcome
([the spine, §13](../05_Conventions.md)) has failed its own gate.

**Why this matters more in 2026, not less.** When building was expensive, output *was* a rough
proxy for value — you couldn't afford to build much that was useless. AI has collapsed the cost
of building, which breaks that proxy: "AI can make a team look productive while building the
wrong things." Cagan's 2026 reframing separates **build-to-learn** (cheap, AI-accelerated
discovery) from **build-to-earn** (the thing you commit to and stand behind), and declares
**distribution the new bottleneck** now that creation is cheap
(https://visitmy.website/2026/04/24/marty-cagans-new-standard-for-product-in-the-age-of-ai/).
The scarce resources become product judgment, taste, deep customer understanding, and the
ability to get a product in front of people — exactly the parts AI assists but cannot own.

---

## 2. Problem space vs. solution space & the double diamond

If outcomes-over-outputs is the *what*, the **problem/solution split** is the core *discipline*
that makes it achievable. The most expensive mistake in product is building the wrong thing
well — being precise about a solution to a problem nobody has. The defense is to treat the
**problem space** (needs, jobs, pains, opportunities — *what* and *why*) and the **solution
space** (features, designs, bets — *how*) as separate territories, and to refuse to commit to a
solution until the problem is validated.

The **Double Diamond** (UK Design Council) is the canonical picture: you *diverge then converge
twice* — first to discover and define the right **problem**, then to develop and deliver the
right **solution** (see the [card](../frameworks/design-thinking-double-diamond.md)). The
workflow maps the first diamond to [P03 Discovery](../skills/pm-phase-03-discovery/) →
[P04 Opportunity](../skills/pm-phase-04-opportunity/) and the second to
[P07 Solution](../skills/pm-phase-07-solution-design/) → [P08–P11](../skills/pm-phase-08-prd/).

The two diamonds are separated by gates on purpose. **G2 Problem Validated** asks for *evidence,
not opinion*, that a real, valuable problem exists for a defined segment; **G3 Opportunity
Go/No-Go** sizes it and names the risks before a single line of production code is committed
([Conventions §2](../05_Conventions.md)). The rule from [the Overview](../01_Workflow_Overview.md)
is blunt and worth memorizing: *discovery is cheap; delivery is expensive* — so sign off the
problem space before you commit the solution space. Everything in the solution space must trace
back to an opportunity, and every opportunity back to evidence.

---

## 3. Dual-track & continuous discovery

A naïve reading of §2 — "first do all the problem work, then do all the solution work" — would
recreate waterfall. The correction is **dual-track**: discovery and delivery are **continuous
and parallel**, not sequential phases. The [product trio](../cross-cutting/Continuous_Discovery.md)
(PM + design + engineering) runs a never-ending discovery track that continuously feeds a
delivery track. You are *always* discovering the next bet while building the current one
(https://blog.logrocket.com/product-management/dual-track-agile-continuous-discovery/).

Teresa Torres operationalized this as **Continuous Discovery Habits**, whose minimum bar is
deceptively concrete: **at least one customer interview per week, conducted by the team building
the product.** Discovery is a *cadence, not a project* — frequency beats sample size, and the
team that builds must be the team that learns. Critically, you interview for **stories, not
opinions**: "tell me about the *last time* you…" surfaces real behavior, where "would you use
this?" only invites a polite, useless yes
(https://www.userinterviews.com/blog/how-to-interview-customers-continuously-with-teresa-torres-of-product-talk
· https://www.shortform.com/blog/teresa-torres-customer-interviews/). *Continuous Discovery
Habits* turns five in 2026 and is now mainstream canon
(https://www.producttalk.org/lets-read-continuous-discovery-habits-together-january-2026/).

This is why [continuous discovery is a **thread**](../cross-cutting/Continuous_Discovery.md),
alive in every phase rather than a one-time P03 step, and why the
[post-launch loop](../01_Workflow_Overview.md) (P12 → P13 → P14 → P15) *is* continuous discovery
operationalized on a live product. The 2026 shift: AI-moderated interviews and auto-synthesis let
a team scale conversations dramatically, moving the human's job from *running* every interview to
*designing the study and judging the synthesis* — but human review of that synthesis is
non-negotiable (~97% of researchers use AI, ~74% say its output still needs review:
https://www.nngroup.com/articles/research-with-ai/).

---

## 4. The Lean Startup loop & pivot/persevere

Discovery and delivery both run on the same engine: **Build-Measure-Learn** (Eric Ries, 2011).
You build the smallest thing that produces *validated learning*, measure what happens, and learn
whether your assumption held — then decide. The unit of progress is not a feature; it is a
*learning* that de-risks a bet (see the [card](../frameworks/lean-startup.md)). The whole
post-launch loop in [the Overview §4](../01_Workflow_Overview.md) is this engine running forever.

The loop's most important output is a **decision**, and Lean Startup gives us its vocabulary:
**pivot or persevere.** This workflow makes that the native language of every gate. A gate is a
*decision point, not a formality*, and its outcome is exactly one of **Persevere /
Persevere-with-actions / Pivot / Hold / Kill** ([Conventions §2](../05_Conventions.md)). The
hardest and most valuable of these is the one that *stops* wasted build — "A PM who never says
Pivot or Kill is running theatre, not gates." Cagan's discipline for killing gracefully and
without ego is required reading for anyone who finds Kill hard to say
(https://www.svpg.com/how-to-kill-innovation/ · https://asana.com/resources/sunk-cost-fallacy).

To know *what* to learn first, [P07 Solution Design](../skills/pm-phase-07-solution-design/)
uses Cagan's **four big risks** — Value, Usability, Feasibility, Business viability — extended
by Torres's fifth, **Ethical** ([card](../frameworks/assumption-mapping-4-risks.md)). You make
assumptions explicit, score them by *importance × evidence*, and test the riskiest first with
the cheapest experiment that could disprove it. This is why **G5 Solution Validated** asks
whether the riskiest assumptions have been *tested*, not whether the team feels confident
(https://www.svpg.com/four-big-risks/ · https://www.producttalk.org/2023/10/five-types-of-assumptions/).

---

## 5. Jobs-to-be-Done — the two schools

To populate the problem space with something durable, you need a theory of *why people act*.
JTBD supplies it: people don't buy products, they **hire** them to make progress in a situation.
A job is stable even as solutions churn — "get from A to B" outlives the horse, the car, and the
ride-share app. Framing the problem space around the *job* (not your product category) is what
keeps strategy from being quietly defined by your current feature set.

There are **two schools**, and a mature PM uses both ([Conventions §8](../05_Conventions.md);
[card](../frameworks/jtbd.md)):

- **ODI / outcome-driven (Tony Ulwick, Strategyn)** treats jobs as *activities* and is
  **quantitative**. Customers rate **desired-outcome statements** on *importance × satisfaction*;
  the **Opportunity Algorithm** — `Importance + max(Importance − Satisfaction, 0)` — ranks the
  under-served outcomes worth attacking. Use it to *quantify and prioritize*
  (https://anthonyulwick.com/jobs-to-be-done/ · https://en.wikipedia.org/wiki/Outcome-Driven_Innovation).
- **Switch / Forces (Bob Moesta; Clayton Christensen; Alan Klement)** treats jobs as
  *progress* and is **qualitative**. The **switch interview** reconstructs the causal story of a
  real purchase, and the **Forces of Progress** (push + pull vs. habit + anxiety) explain why
  people do or don't change. Use it to *find and understand* the job
  (https://yukaichou.com/gamification-analysis/jobs-to-be-done-christensen-consumer-hiring/ ·
  https://jobs-to-be-done.com/debunking-klements-attack-on-odi-70e86617f4d8).

The 2026 consensus is not "pick a side" but a **sequence**: qualitative switch/forces work to
*discover* the job, ODI to *quantify and rank* it. **Job stories** ("When [situation], I want to
[motivation], so I can [outcome]") capture this without inventing a persona
(https://www.intercom.com/blog/accidentally-invented-job-stories/). And the tired "JTBD killed
personas" debate is settled: **personas and JTBD are complements** — demographic-portrait
personas (`PER-<nn>`) are decoration, but motivation-and-behavior-rich personas built from real
research carry their weight (https://www.nngroup.com/articles/personas-jobs-be-done/).

---

## 6. The Opportunity Solution Tree as the spine

Discovery generates a flood — insights, jobs, pains, ideas. Without structure it becomes a wish
list, and the loudest voice wins. Teresa Torres's **Opportunity Solution Tree (OST)** is the
structure: a single desired **outcome** at the root, branching into **opportunities** (the
needs, pains, and desires from discovery), each branching into candidate **solutions**, each
branching into **experiments / assumption tests**. It makes your thinking *visible and
falsifiable*, and it forces the habit of comparing **2–3 solutions per opportunity** instead of
marrying the first idea (https://www.producttalk.org/opportunity-solution-trees/).

The OST is more than a P04 deliverable — it is the **conceptual spine of the entire workflow.**
[Conventions §4](../05_Conventions.md) makes the tree operational across the whole lifecycle as
the **traceability golden thread**:

```
Insight (INS) ─┐
Job (JOB) ─────┼─▶ Opportunity (OPP) ─▶ Objective/KR (OBJ/KR) ─▶ Roadmap item (RMI)
Persona (PER) ─┘            │                                          │
                           ▼                                          ▼
                    Solution / bet (SOL) ─▶ Assumption (ASM) ─▶ Experiment (EXP)
                           │                                          │
                           ▼                                          ▼
                  Requirement (REQ) / Feature (FEAT) ─▶ User story (US) ─▶ Acceptance criterion (AC)
                           └────────────── measured by ─▶ Metric (MET) ◀── Feedback (FB)
```

Read it as *evidence → opportunity → outcome → bet → spec → ship → measure → learn → loop.* The
non-negotiable rule: **nothing enters the roadmap without an opportunity, no opportunity without
evidence, no "done" without a metric.** Forward trace answers "what should we build?"; backward
trace (`MET → … → INS`) answers the question that kills feature factories: *"why are we building
this?"* In 2026 the OST is treated as a **living weekly layer**, kept fresh as AI compresses the
evidence cycle from weeks to days — not a diagram you draw once and frame
(https://getperspective.ai/blog/opportunity-solution-tree-2026-practical-guide-continuous-discovery).

---

## 7. Strategy (Rumelt) → North Star → OKRs

The OST's root is an *outcome*, and outcomes must descend from a real **strategy** — otherwise
you are optimizing locally toward nowhere. The most common failure is **bad strategy**: a
word-soup of vision, values, and aspirations with no actual choices. Richard Rumelt's **kernel**
is the antidote and the test: a real strategy is **Diagnosis → Guiding Policy → Coherent
Action** — name the single most important obstacle, decide how you'll confront it, and commit to
mutually-reinforcing moves. Strategy *is* choice; deciding what **not** to do is the core act
(https://www.productbookshelf.com/2020/11/good-strategy-bad-strategy/).

[P01](../skills/pm-phase-01-strategy/) cascades this with Ravi Mehta's **Product Strategy
Stack** — vision → strategy → roadmap → goals, each *deriving from* the one above so there are
no orphan initiatives ([card](../frameworks/product-strategy-stack.md);
https://www.reforge.com/blog/the-product-strategy-stack). The strategy then gets a measurable
spine in two complementary artifacts:

- A **North Star Metric** + 3–5 **input metrics** ([card](../frameworks/north-star-metric-tree.md)):
  one headline measure of *realized customer value* (a leading indicator of revenue, within your
  sphere of influence), with the levers underneath it that teams can actually move. The failure
  mode is the **vanity North Star** — DAU, registered users, raw revenue — that rises while
  customers churn (https://amplitude.com/books/north-star/about-north-star-framework ·
  https://amplitude.com/blog/good-bad-north-star-metric).
- **OKRs** ([card](../frameworks/okrs.md)) to *measure and align* execution quarter by quarter.
  The most important thing to understand about OKRs is what they are **not**: OKRs **measure**
  strategy, they are not the strategy. Confusing the two is the canonical mistake — a set of
  number-targets with no diagnosis underneath is just a wish list with KPIs
  (https://www.antmurphy.me/newsletter/okrs-strategy · https://www.romanpichler.com/blog/product-strategy-okrs-and-kpis).

This is the chain **G1 Strategy Sign-off** checks: a real diagnosis, a focused guiding policy,
a North Star that captures value, and OKRs that make it measurable — coherent and *focused*, not
a list of everything.

---

## 8. Prioritization philosophy — the framework structures the conversation

Most prioritization advice argues about *which* framework. That debate is second-order and
largely settled. The first-order truths are about *how* any framework should be used:

1. **A framework structures the conversation; it does not make the decision.** Intercom, who
   created RICE, are explicit: "RICE scores shouldn't be used as a hard and fast rule." The
   number is an input to judgment, not a verdict
   (https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/).
2. **Garbage in, garbage out.** A precise-looking score built on guessed inputs is *false
   precision* — invest in the estimates and make **Confidence** explicit, don't polish the
   formula (https://www.productlift.dev/blog/product-prioritization-framework/).
3. **Filter, then rank.** Pair a categorical filter (MoSCoW, Kano table-stakes) with a scoring
   model (RICE/WSJF/ICE); no single framework does both well.
4. **Prioritize the *opportunity* space before solutions.** The highest-leverage prioritization
   is choosing which *problem* to solve — Cagan's opportunity backlog — not ranking a feature
   list (https://www.svpg.com/the-opportunity-backlog/ ·
   https://www.svpg.com/changing-how-you-decide-which-problems-to-solve/).

This is why [P06](../skills/pm-phase-06-prioritization/) is a **supporting** phase, not a gated
one — it's a *decision aid* you invoke inside roadmap and PRD work, never the decision itself.
Match the tool to the question: **RICE** when you have reach data and many comparable bets;
**WSJF / Cost of Delay** when timing dominates (but beware its 2026 backlash for being gamed and
biased against platform work); **Kano** for satisfaction strategy (re-run every ~12–18 months,
because delighters decay into table-stakes); **ICE** for fast triage; **MoSCoW** to scope a
fixed deadline (https://productschool.com/blog/product-fundamentals/kano-model). The anti-pattern
that ties them together is **framework theatre** — running a score to launder a decision already
made politically ([Frameworks Map §3](../03_Frameworks_Map.md)). If you'll ignore the score,
don't compute it. If two frameworks disagree, *the disagreement is the insight*.

---

## 9. Experimentation rigor — what "evidence over opinion" actually demands

"Evidence over opinion" is easy to say and easy to fake. Real experimentation has a method,
and [P13](../skills/pm-phase-13-experimentation/) enforces it ([card](../frameworks/ab-testing-experimentation.md)):

- **A falsifiable hypothesis first:** "We believe [change] causes [effect] for [segment],
  measured by [metric], because [insight]." If it can't be wrong, it isn't a hypothesis.
- **Pre-register the design** — primary metric (Kohavi's single **OEC**), 2–3 guardrails, the
  minimum detectable effect, alpha, and a **power analysis** that fixes sample size — *before*
  launch. This is what prevents the most common sin: **peeking**, stopping the moment p < 0.05,
  which manufactures false wins (https://www.statsig.com/perspectives/power-analysis-ab-testing ·
  https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59).
- **Verify trustworthiness** (A/A and sample-ratio-mismatch checks), run full business cycles,
  and decide by the rule *primary wins **and** no guardrail breached*. Expect most experiments to
  lose or be flat — that is the system working, not failing.

Three 2026 shifts matter. **Sequential testing / always-valid p-values** are now the mainstream
default, letting you monitor continuously without the peeking penalty — Booking.com runs 1,000+
simultaneous tests, ~30% shorter (https://www.statsig.com/updates/update/sequential-testing-capabilities).
**CUPED** variance reduction is standard, cutting required users ~30–40%. And **measuring AI
features breaks classic A/B** — dynamic variants, self-contaminating feedback loops, and novelty
inflation push teams toward permanent holdouts, interleaving, and response-quality metrics
(https://prepvector.substack.com/p/experimentation-in-the-age-of-ai). Finally, know **when not
to A/B test**: low traffic, irreversible one-way-door decisions, obvious compliance changes, or
when there's no clean metric or power. Rigor includes knowing when the tool doesn't apply.

---

## 10. Growth loops — why growth compounds or leaks

After launch the product enters the [continuous loop](../01_Workflow_Overview.md), and the
mental model you choose there determines whether growth *compounds* or *leaks*. The classic
**funnel** (AARRR — acquisition → activation → retention → referral → revenue) is still useful
as a *diagnostic vocabulary* for finding the leaky stage ([card](../frameworks/aarrr-pirate-metrics.md);
https://www.productplan.com/glossary/aarrr-framework). But a funnel is linear: every cohort
starts from zero. The 2026 default model is the **growth loop** — a self-reinforcing system
where the *output* of one cycle becomes the *input* to the next, so growth compounds
(https://www.reforge.com/blog/growth-loops · https://www.teknicks.com/blog/growth-loops-not-funnels-product-led-growth/).

The fundamentals underneath ([P15 card](../frameworks/plg-growth-loops.md)):

- **Retention is the core of the model.** A *flattening* retention curve is the real signal of
  product-market fit; without it, acquisition just fills a leaky bucket. Net revenue retention has
  overtaken acquisition as the headline — top performers at NRR 120%+ grow ~2.5× faster
  (https://blog.brianbalfour.com/p/the-four-fits-a-growth-framework ·
  https://www.statsig.com/perspectives/plg-metrics-activation-retention).
- **Activation — the "aha moment" — is the highest-leverage step.** Distinguish the *felt* aha
  from the *measurable* activation event. Directional 2026 benchmark: activation ~25–40% within
  7–14 days, with <20% signaling a problem (https://mixpanel.com/blog/product-led-growth/).
- **PLG matured into hybrid GTM.** Pure-PLG dogma gave way to product-led *plus* sales-led:
  ~67% of teams above $10M ARR run hybrid, and product-qualified leads convert ~25–30% vs ~5–10%
  for marketing-qualified leads (https://www.digitalapplied.com/blog/product-led-growth-2026-plg-strategy-playbook).

Brian Balfour's 2026 framing is the one to hold: **AI changes the *bottlenecks* of a loop, not
the fundamentals.** It can automate the content, copy, and personalization steps — but retention
still has to be earned, and AI-native products are especially prone to churning on novelty
(https://blog.brianbalfour.com/p/ai-growth-course). Beware the ethical line: a "retention" loop
built on manipulative dark patterns is borrowing against trust, which brings us to §11.

---

## 11. Responsible product — now law, not a values slide

For most of product history, "responsible product" was a values statement. In 2026 it is, in
large part, **enforceable law** — which is why it is a [non-negotiable thread](../cross-cutting/Responsible_Product.md)
with a floor that even the smallest product must clear, not an optional QA pass.

The durable principle is *by design and by default*: privacy is a legal obligation baked in from
the start (GDPR Art. 25), and accessibility is designed in, not retrofitted, against WCAG 2.2's
**POUR** — Perceivable, Operable, Understandable, Robust (https://gdpr-info.eu/art-25-gdpr/ ·
https://www.w3.org/TR/WCAG22/). What changed is enforcement:

- **The European Accessibility Act has been enforceable since 28 June 2025** for firms with 10+
  employees and >€2M turnover — accessibility is now hard law, not a courtesy
  (https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/ ·
  https://www.onetrust.com/blog/understanding-the-european-accessibility-act-and-wcag-22/).
- **The EU AI Act is live and being re-sequenced.** The "Digital Omnibus" postponed most
  high-risk obligations (Annex III → 2 Dec 2027; Annex I → 2 Aug 2028) **but kept Article 50
  transparency duties** — disclose AI interaction and label AI-generated content — **from 2 Aug
  2026.** "It's future, not now" is no longer true
  (https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ ·
  https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai).
- Responsible AI moved from a one-time pre-launch check to **continuous monitoring** of bias and
  drift, structured by the **NIST AI Risk Management Framework** (Govern / Map / Measure / Manage)
  (https://www.nist.gov/itl/ai-risk-management-framework · https://www.microsoft.com/en-us/ai/responsible-ai).

The deeper reason this is a thread and not a phase: **trust is a feature that compounds, and a
single breach, biased output, or inaccessible flow erodes it faster than features build it.**
This is also why "Ethical" is the fifth big risk in [P07](../skills/pm-phase-07-solution-design/)
and a standing item at every gate review. AI can *draft* DPIAs, accessibility checklists, and
risk classifications — but it can never be the *accountable party* for the sign-off (§12).

---

## 12. AI-assisted, accelerated — human-led, accountable

The thread running through every section above is this workflow's defining stance, fixed in
[Conventions §11](../05_Conventions.md) and detailed in the
[AI PM Protocol](../02_AI_Product_Manager_Protocol.md): **AI accelerates the work; humans own the
judgment.** The recurring rule from the field is "**amplify your thinking, don't abdicate it**"
([Research Pack §19](2026_Research_Pack.md)). AI changes the *inputs* to a decision, never the
*logic* of the decision or accountability for it.

By 2026 AI is operational across the whole lifecycle, not experimental — synthesizing research,
drafting PRDs and stories, scoring and de-duping backlogs, querying analytics in natural
language, and (increasingly) **prototyping for buy-in faster than a spec can be written**
(https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management ·
https://productside.com/the-ai-product-management-workflows-2026/). The clean division of labor:

| AI drafts / accelerates | Humans own / are accountable for |
|---|---|
| Research synthesis, transcripts, clustering | The diagnosis, the bet, the non-goals |
| PRDs, user stories, AC, release notes | Strategy, prioritization trade-offs, ethics |
| Backlog scoring, theme detection | Validating estimates aren't hallucinated |
| NL analytics queries, anomaly flags | Causal interpretation (AI conflates correlation/causation) |
| Prototypes for stakeholder alignment | Customer trust, the go/no-go, the consequences |

Three guardrails make this safe and recur as anti-patterns throughout the [Research Pack](2026_Research_Pack.md):
**never treat AI output as truth** (it's a draft to be checked); **never auto-prioritize by
counting requests** (frequency ≠ importance — one enterprise renewal can outweigh hundreds of
free-tier asks); and **never let AI crowd out real customer conversations**. The standing rule
across the workflow: AI never invents customer evidence, metrics, market data, or quotes —
unknowns become `TODO: <what's owed>` plus a recommendation to research or interview, never a
fabricated number.

---

## 13. How it all composes across the lifecycle

The pieces are not a menu; they **compose** into one machine. Walk the
[gate ladder](../05_Conventions.md) and watch each idea above carry its weight:

```
G0 ── G1 ── G2 ── G3 ── G4 ── G5 ── G6 ── G7 ── G8 ── G9 ┄┄(grow/measure loop: P12-P15)┄┄ G10
00    01    03    04    05    07    08    09    10    11                                      16
```

- **G0 → G1 (P00–P01):** A charter sets the mandate and the [operating cadence](../01_Workflow_Overview.md)
  (continuous, Lean, Scrum, Kanban, or Stage-Gate); strategy is forged with **Rumelt's kernel**
  and made measurable with a **North Star + OKRs** (§7). *Outcomes-over-outputs* (§1) is locked in
  here or never.
- **G2 → G3 (P03–P04):** The first diamond (§2). **Continuous discovery** (§3) and **JTBD** (§5)
  fill the problem space; the **OST** (§6) structures it; **G2** demands evidence and **G3** sizes
  the opportunity and names the four-plus-one risks (§4) before any commitment.
- **G4 → G7 (P05–P09):** The roadmap commits to *outcomes* on a Now/Next/Later horizon, swimlaned
  by objective — never a Gantt of dated features
  (https://www.producttalk.org/2023/10/roadmaps-with-timelines/) — with **prioritization** (§8)
  structuring the conversation. Then the second diamond: riskiest assumptions tested (**Lean
  loop**, §4) before the PRD *documents* (not makes) the decision, and stories slice vertically
  toward releasable value.
- **G8 → G9 (P10–P11):** Delivery optimizes **flow over utilization** (Little's Law; flow metrics
  and DORA displace velocity — and in the AI era throughput rises but *stability* degrades without
  safety nets: https://dora.dev/dora-report-2025/). Launch separates the reversible **release**
  from the marketed **launch**, tiered by impact — the big-bang launch is dying
  (https://www.svpg.com/big-bang-releases/ · https://www.productmarketingalliance.com/launch-tier-framework/).
- **The loop (P12–P15):** The **Build-Measure-Learn** engine (§4) now runs forever on a live
  product — analytics (value, not vanity: https://amplitude.com/blog/vanity-metrics),
  **experimentation rigor** (§9), closed-loop feedback
  (https://www.resonate.cx/blog/inner-loop-vs-outer-loop-in-voice-of-customer-programs/), and
  **growth loops** (§10) — feeding new `OPP-*` back into discovery.
- **G10 (P16):** Responsible retirement — a deliberate, well-communicated sunset that beats the
  sunk-cost fallacy and handles data deletion as the audited legal duty it now is (§11).

Underneath all of it, the **six [threads](../05_Conventions.md)** — stakeholders, continuous
discovery, metrics & experimentation, product ops, **responsible product** (§11), and portfolio —
run horizontally and are reviewed at *every* gate. And the **[traceability spine](../05_Conventions.md)**
(§6) is what makes the composition real rather than aspirational: every artifact links forward to
a metric and backward to an insight, so at any moment you can answer both *"what next?"* and
*"why this?"*

---

## The durable through-lines (what to remember if you forget everything else)

1. **Outcomes over outputs.** Measured by value created, not features shipped.
2. **Problem before solution.** Validate the problem (G2/G3) before you commit to build.
3. **Discovery never stops.** Weekly customer contact; the OST is a living layer.
4. **Gates are decisions.** Persevere / with-actions / Pivot / Hold / Kill — Kill is a win.
5. **Evidence over opinion.** Every bet has an assumption, a test, and a metric.
6. **The framework structures the conversation; the human makes the call.**
7. **Growth compounds in loops, leaks in funnels — and retention is the core.**
8. **Responsible product is a legal floor, not a values slide.**
9. **AI accelerates; the human decides and is accountable.**
10. **Trace everything.** Forward to a metric, backward to an insight — or it doesn't belong.

> **Further reading.** The one-page [framework cards](../03_Frameworks_Map.md) for the *how*;
> the [phase skills](../skills/) for the operational runbook; the
> [2026 Research Pack](2026_Research_Pack.md) for the full source base; and the
> [2026 vs. Legacy diff](2026_vs_Legacy_Diff.md) for what changed since a 2018-era curriculum
> and why. This chapter is the *why* that holds them together.
