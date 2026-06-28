# Frameworks Map — what to use, where, and when

> This workflow is **framework-agnostic**: the phases tell you *what to produce and when to decide*; the frameworks tell you *how*. This map pins every recognised framework to the phase(s) and thread(s) where it earns its keep, and says when to reach for it vs. when it's the wrong tool. One-page cards for each live in [`frameworks/`](frameworks/). Canonical attributions are fixed in [`05_Conventions.md` §8](05_Conventions.md).
>
> **The meta-rule:** a framework is a thinking aid, not a decision. Don't run a framework to *make* the call — run it to *pressure-test* the call you can defend. If two frameworks disagree, the disagreement is the insight.

---

## 1. Framework → phase map

| Framework | Primary phase(s) | Also used in | One-line: what it's for |
|---|---|---|---|
| **Lean Startup** (Build-Measure-Learn, pivot/persevere) | P04, P07 | whole loop (P12–P15), every gate | Maximise validated learning per dollar before scaling. |
| **Design Thinking / Double Diamond** | P03, P07 | P01 | Empathise→define→ideate→prototype→test; diverge then converge. |
| **Jobs-to-be-Done — ODI (outcome-driven)** (Ulwick) | P03, P04 | P02, P06 (opportunity scoring) | Find under-served *outcomes* customers are trying to achieve. |
| **Jobs-to-be-Done — Switch/Forces** (Moesta/Christensen) | P03 | P11 (positioning), P14 | Understand the *causal struggle* that makes people switch. |
| **Continuous Discovery Habits** (Torres) | P03 | thread (always), P12–P15 | Weekly customer touch; small, frequent research over big studies. |
| **Opportunity Solution Tree** (Torres) | P04 | P05, P06, P07 | Connect an outcome → opportunities → solutions → experiments. |
| **Product Strategy Stack** (Ravi Mehta) | P01 | P05 | Vision → strategy → roadmap → goals, each deriving from the one above. |
| **Good Strategy / Bad Strategy** (Rumelt) | P01 | P04 | Diagnosis → guiding policy → coherent action; kill "fluff" strategy. |
| **OKRs** (Doerr/Grove) | P01 | P05, P10, P12 | Set measurable outcomes; align teams; review quarterly. |
| **North Star Metric + metric tree** | P01, P12 | P15 | One headline value metric with input levers underneath. |
| **AARRR "Pirate Metrics"** (McClure) | P12, P15 | P11 | Map the lifecycle funnel: acquisition→activation→retention→referral→revenue. |
| **HEART** (Google) | P12 | P07 (usability), P03 | UX quality metrics: Happiness, Engagement, Adoption, Retention, Task success. |
| **RICE** (Intercom) | P06 | P05, P15 | Score initiatives by Reach × Impact × Confidence ÷ Effort. |
| **Kano model** (Kano) | P06 | P03, P08 | Classify features: basic / performance / delighter / indifferent. |
| **MoSCoW** | P06 | P08 (MVP scope), P09 | Must / Should / Could / Won't — scope a release. |
| **WSJF / Cost of Delay** (Reinertsen/SAFe) | P06 | P05, P10 | Sequence by value-of-time: cost of delay ÷ job size. |
| **ICE** | P06 | P13, P15 | Quick triage: Impact × Confidence × Ease (lighter than RICE). |
| **Business Model Canvas** (Osterwalder) | P04 | P01, P11 | Map how the business creates/delivers/captures value. |
| **Positioning (Obviously Awesome)** (Dunford) | P11 | P02, P01 | Define the competitive context that makes your value obvious. |
| **TAM/SAM/SOM** | P02 | P04 (business case) | Size the opportunity ceiling top-down/bottom-up/value-theory. |
| **Working Backwards / PR-FAQ** (Amazon) | P08 | P01, P11 | Write the press release + FAQ first to force clarity on value. |
| **Shape Up** (Basecamp) | P08 | P10 | Fixed-time/variable-scope appetite-based bets and pitches. |
| **Story Mapping** (Patton) | P09 | P05, P08 | Arrange stories by user journey to find a coherent slice. |
| **INVEST + Gherkin** | P09 | P10 | Well-formed stories; Given/When/Then acceptance criteria. |
| **Scrum** (Schwaber/Sutherland) | P10 | P09 | Time-boxed sprints with planning/standup/review/retro. |
| **Kanban** (Anderson) | P10 | P14 (support flow) | Continuous flow, WIP limits, pull-based work. |
| **Dual-track Agile** (Cagan/Patton) | P10 | P03–P07 | Run discovery and delivery as parallel, continuous tracks. |
| **DORA + Flow metrics** | P10 | thread (Product Ops) | Measure delivery health: lead time, deploy freq, change-fail, MTTR. |
| **Product-Led Growth (PLG)** | P15 | P11, P12 | Let the product drive acquisition, conversion, and expansion. |
| **Growth Loops** (Reforge/Balfour) | P15 | P12 | Self-reinforcing loops that compound, vs. linear funnels. |
| **RACI** | thread (Stakeholders) | P00, P10, P11 | Clarify who is Responsible/Accountable/Consulted/Informed. |
| **Assumption Mapping / 4 Big Risks** (Cagan) | P07 | P04 | Surface value/usability/feasibility/viability risks to test first. |

---

## 2. Which framework when — fast chooser

**Setting direction (P01)** → Product Strategy Stack to structure it; Rumelt to pressure-test it isn't fluff; OKRs + North Star to make it measurable.

**Sizing the market (P02)** → TAM/SAM/SOM for the ceiling; Porter/competitive grid for structure; Dunford for positioning context. *Remember: TAM is an opportunity ceiling, never a revenue forecast.*

**Understanding customers (P03)** → Continuous Discovery for cadence; JTBD (Switch interviews) for the causal "why they switch"; JTBD (ODI) when you need to *quantify* under-served outcomes; personas only as a communication artifact, never as the primary evidence.

**Choosing what to solve (P04)** → Opportunity Solution Tree to map options against an outcome; Lean Startup + Assumption Mapping to find the riskiest assumption; Business Model Canvas / business case for viability.

**Planning (P05–P06)** → Now/Next/Later for the roadmap shape; RICE for general initiative ranking; WSJF when *timing/cost-of-delay* dominates; Kano to balance must-haves vs. delighters; MoSCoW to cut an MVP; ICE for quick triage.

**Specifying & slicing (P08–P09)** → PR-FAQ or Shape Up pitch or lean PRD (pick by culture); Story Mapping to slice; INVEST + Gherkin for stories/AC.

**Building & shipping (P10–P11)** → Scrum or Kanban (or dual-track) for cadence; DORA/flow metrics for delivery health; launch tiers + PLG/sales-led GTM motion for landing.

**Measuring & growing (P12–P15)** → North Star + metric tree for the system; AARRR to find the leaky stage; HEART for UX quality; experimentation for causal proof; Growth Loops/PLG to compound.

---

## 3. Framework anti-patterns (read before you reach for one)

- **Framework theatre.** Running RICE/Kano to launder a decision already made politically. If you'll ignore the score, don't compute it.
- **One framework for everything.** RICE is bad at sequencing time-sensitive work (use WSJF); Kano is bad at effort (pair with value/effort); NPS is bad as a product metric (use it as relationship, not product, signal).
- **Roadmap-as-Gantt.** A timeline of dated features is the build trap, not a roadmap. Use Now/Next/Later tied to outcomes ([Phase 05](../.claude/skills/pm-phase-05-roadmap/)).
- **Persona fiction.** A persona invented in a workshop with no research is decoration. Personas summarise *real* discovery, or they're cut.
- **Vanity North Star.** A North Star that goes up while customers churn is the wrong star. It must be a *value-exchange* metric with guardrails ([Phase 12](../.claude/skills/pm-phase-12-analytics/)).
- **TAM as forecast.** Big TAM doesn't guarantee a business; small TAM can still be great. It sizes opportunity, not revenue.
- **Cargo-cult SAFe/Scrum.** Adopting ceremonies without the empowerment/feedback they exist to enable. Process serves outcomes, not the reverse.

---

## 4. Where the cards live

One-page reference card per framework in [`frameworks/`](frameworks/): definition, the steps, a worked micro-example, when to use, when *not* to, common mistakes, and the primary source. Phase skills link to the relevant card rather than re-deriving the framework — so the definition lives in exactly one place.
