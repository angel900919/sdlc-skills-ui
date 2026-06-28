# What a 2018-era Udacity-style PM curriculum likely teaches vs 2026 best practice

A focused, lifecycle-by-lifecycle diff. For each area: what is **still valid**, what is
**outdated / now an anti-pattern**, the **2026 replacement**, and a source. A 2018-era
"intro to PM" course was built around the waterfall-ish funnel: write a big PRD → rank a
feature backlog → big-bang launch → track DAU/NPS. The through-lines that break that model in
2026 are: **outcome over output, continuous discovery, JTBD, PLG/growth loops, modern
experimentation rigor, North Star/metric trees over vanity KPIs, AI-assisted PM, responsible
product, the death of the big-bang launch, and the NPS critique.**

---

## 1. Strategy & Vision

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Vision matters; strategy means choices/focus; a clear mission orients teams. | **OKRs taught AS the strategy** → OKRs are the execution/measurement layer; strategy = diagnosis + guiding policy + coherent action (Rumelt). Source: https://www.antmurphy.me/newsletter/okrs-strategy |
| Tie work to company goals. | **Vision/values word-soup presented as "strategy"; no diagnosis** → name the core obstacle first. Source: https://www.productbookshelf.com/2020/11/good-strategy-bad-strategy/ |
| | **Output/velocity as success (the build trap)** → outcomes over outputs; Product Operating Model. Source: https://www.svpg.com/the-product-operating-model-an-introduction/ |

---

## 2. Market & Competitive

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| TAM/SAM/SOM and competitive analysis still matter; positioning is foundational. | **"Capture 1% of a $X B TAM" / top-down-only sizing** → bottom-up + top-down reconciled within ~15%. Source: https://www.icanpitch.com/blog/tam-sam-som-market-sizing-guide |
| Porter's Five Forces as one input. | **Porter as the whole toolkit; product/demographic-defined markets** → demand-side/JTBD market definition; update Porter for ecosystems. Source: https://www.thrv.com/blog/how-to-size-a-market |
| Track competitors. | **Battlecards scraped from competitor sites, refreshed quarterly; CRM "loss reasons"** → continuous win/loss from buyer interviews (~85% of CRM loss reasons are wrong). Source: https://www.clozd.com/guides/win-loss-analysis |

---

## 3. Customer Discovery

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Talk to customers; get out of the building (Blank). | **Big upfront research project, then build** → continuous discovery, ≥1 interview/week by the product trio. Source: https://www.userinterviews.com/blog/how-to-interview-customers-continuously-with-teresa-torres-of-product-talk |
| Interviews are valuable. | **Asking "Would you use this?" / counting how many users you talked to** → story-based "tell me about the last time…"; cadence over sample size. Source: https://www.shortform.com/blog/teresa-torres-customer-interviews/ |
| | **Outsourcing discovery to a research team while the trio never talks to customers** → trio-owned discovery on an OST. Source: https://www.producttalk.org/opportunity-solution-trees/ |

---

## 4. User Research & JTBD

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Personas and user research are useful; ~5 users for usability iterations. | **Demographic-only personas (name/age/photo)** → motivation/behavior-rich personas + JTBD; they are complements, not rivals. Source: https://www.nngroup.com/articles/personas-jobs-be-done/ |
| Frame around the user's goal. | **JTBD taught as one vague thing** → know the two schools (Ulwick/ODI quantitative vs Christensen/Klement qualitative). Source: https://anthonyulwick.com/jobs-to-be-done/ |
| | **"5 users is enough" applied to quantitative/segmentation claims; AI/synthetic output trusted without review** → mixed methods; human review non-negotiable. Source: https://www.nngroup.com/articles/research-with-ai/ |

---

## 5. Opportunity Assessment

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Assess opportunities before building; size the prize; business case discipline. | **Heavy single-shot business case with precise multi-year ROI** → lean, assumption-driven case with sensitivity ranges + learning gates, revisited per increment. Source: https://deeprojectmanager.com/safe-lean-business-case/ |
| Identify risks. | **Only Cagan's four risks (ignoring ethics); one solution per opportunity** → add an ethical/harm assumption; compare 2-3 solutions. Source: https://www.producttalk.org/2023/10/five-types-of-assumptions/ |
| | **Surveys / HiPPO as primary evidence; frozen OST** → direct conversations, evidence traceable to quotes, living weekly OST. Source: https://getperspective.ai/blog/2026-product-discovery-trends-what-300-teams-changed |

---

## 6. Roadmap

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Roadmaps communicate direction and priorities. | **Timeline/Gantt feature-date roadmap as the default; roadmap-as-contract** → outcome-based Now/Next/Later; commitments live in OKRs, not far-horizon dates. Source: https://www.prodpad.com/blog/invented-now-next-later-roadmap/ |
| Sequence work; prioritize. | **Output as success (features shipped, on-time)** → roadmap as a "decision system"; product judgment is the scarce resource in the AI era. Source: https://userpilot.com/blog/product-roadmap/ |
| | **One roadmap/one audience; ignoring the agent/API user class** → tailor by horizon; add agent-user metrics. Source: https://www.aakashg.com/product-roadmap-best-practices/ |

---

## 7. Prioritization

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| RICE/Kano/MoSCoW/value-vs-effort are useful structuring tools. | **Feature-backlog prioritization as the core PM job** → prioritize opportunities/problems; strategy-first, not framework-first. Source: https://www.svpg.com/the-opportunity-backlog/ |
| Make confidence explicit. | **Treating a framework score as the decision ("the spreadsheet decided")** → scores are inputs to judgment. Source: https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/ |
| | **One-and-done Kano; dogmatic WSJF making everything "urgent"; people stack-ranking** → re-run Kano periodically; watch WSJF gaming; top-N priority ranking only. Sources: https://productschool.com/blog/product-fundamentals/kano-model · https://www.peoplebox.ai/blog/stack-ranking/ |

---

## 8. PRD & Requirements

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Document requirements; specify scope; address risks. | **Writing the PRD INSTEAD of doing discovery; "PM writes PRD → eng builds"** → PRD memorializes validated decisions; discovery is continuous. Source: https://www.svpg.com/discovery-vs-documentation/ |
| Be clear and testable. | **Vague requirements ("fast/intuitive/secure"); omitting NFRs** → fit criteria / Given-When-Then; NFRs first-class (incl. WCAG 2.2, EU AI Act). Source: https://www.forasoft.com/blog/article/non-functional-requirements-checklist-2026 |
| | **Heavyweight frozen hand-off PRDs** → lean PRD / prototype-as-spec; AI drafts, PM decides (and verifies). Source: https://www.chatprd.ai/learn/prd-template |

---

## 9. User Stories & Acceptance Criteria

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| INVEST; "As a… I want… so that…" as a starter; AC matter. | **Template treated as the rigid deliverable/spec** → a story is a placeholder for a conversation (3 C's). Source: https://ones.com/blog/invest-criteria-scrum-user-stories-guide/ |
| Confirm with acceptance criteria. | **Exhaustive upfront AC by a BA/PO in isolation; horizontal/technical splitting** → Three Amigos; vertical slices; AC as executable Gherkin. Source: https://testquality.com/gherkin-user-stories-acceptance-criteria-guide/ |
| | **Story points/velocity as a KPI or cross-team comparison; strict gated Definition of Ready** → right-sizing + Monte Carlo forecasting; DoR is an anti-pattern as a hard gate. Sources: https://agility-at-scale.com/principles/agile-planning-story-points/ · https://medium.com/agileopedia/a-definition-of-ready-is-an-anti-pattern-463e84463537 |

---

## 10. Agile Delivery & Backlog

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Scrum/Kanban; sprints; backlog refinement; estimation for shared understanding. | **Velocity as a productivity/comparison metric or target** → flow metrics + DORA (team-level, to learn not judge). Source: https://dora.dev/research/2024/dora-report/ |
| Iterate in short cycles. | **Separate "discovery team" → "delivery team" handoff; refining the whole backlog up front** → dual-track agile with a trio; just-in-time refinement. Source: https://blog.logrocket.com/product-management/dual-track-agile-continuous-discovery/ |
| Scale coordination for big orgs. | **Heavyweight SAFe by default; agile theater; planning to ~100% capacity** → SAFe criticism mainstream and a shift to hybrid/homegrown scaling (~74%); adopt lighter scaling selectively; limit WIP (Little's Law). Sources: https://jeffgothelf.com/blog/safe-is-not-agile/ · https://www.atlassian.com/agile/kanban/wip-limits |

---

## 11. Launch & GTM

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Plan launches; positioning + enablement; success metrics. | **Big-bang launch on a fixed date; conflating release with launch** → continuous incremental rollout behind feature flags; separate release from launch. Sources: https://www.svpg.com/big-bang-releases/ · https://abicox.medium.com/no-more-big-bang-launches-81f0ce5fdc91 |
| Match GTM to the buyer. | **Pure PLG or pure SLG; per-seat pricing for AI/agent products** → hybrid PLG+SLG default; usage/outcome/credit pricing. Sources: https://userpilot.com/blog/product-led-vs-sales-led/ · https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models |
| Measure launch impact. | **Vanity launch metrics (press hits, signups); "Mad-Libs" positioning templates** → adoption/activation/revenue outcomes; Dunford positioning as a living framework. Source: https://www.aprildunford.com/post/a-product-positioning-exercise |

---

## 12. Analytics & KPIs

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Instrument the product; track funnels; AARRR/HEART. | **Raw counts (DAU, page views, downloads, "up-and-to-the-right") as success** → value-capturing metrics; Cutler's vanity test. Source: https://amplitude.com/blog/vanity-metrics |
| Have a "north star." | **A lone North Star with no inputs / "optimize it directly"** → North Star + 3-5 input metrics in a **metric tree**. Sources: https://amplitude.com/books/north-star/about-north-star-framework · https://mixpanel.com/blog/metric-tree/ |
| Use data. | **Pure data-driven decisions; lagging-only dashboards; no guardrails** → data-*informed*; leading + lagging; guardrail metrics. Source: https://www.productfocus.com/why-product-managers-should-not-be-data-driven/ |

---

## 13. Experimentation

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| A/B testing to decide; hypotheses; significance. | **Peeking — stopping at first p<0.05 with no correction; significance on tiny samples** → power analysis up front; **sequential / always-valid testing** is the default. Sources: https://www.statsig.com/perspectives/power-analysis-ab-testing · https://www.statsig.com/updates/update/sequential-testing-capabilities |
| Pick a primary metric. | **Conflating statistical with business significance; uncorrected multiple comparisons** → OEC + guardrails + diagnostics; correct for multiplicity. Source: https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59 |
| Test changes. | **A/B testing everything (incl. one-way-door/compliance); classic A/B for AI features** → know when NOT to test; holdouts/interleaving/response-quality for AI. Source: https://prepvector.substack.com/p/experimentation-in-the-age-of-ai |

---

## 14. Feedback Management

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Collect feedback; surveys; respond to customers. | **NPS as "the one number you need to grow"** → NPS is one humble signal alongside CSAT/CES + verbatims (academia qualifies, not discredits, it). Source: https://measuringu.com/nps-discredited/ |
| Listen to requests. | **Building whatever is requested most (feature factory by request); manually reading a sample of tickets** → feedback as discovery input on an OST; full-corpus AI synthesis. Sources: https://www.producttalk.org/opportunity-solution-trees/ · https://www.enterpret.com/guides/customer-intelligence-ai-for-product-managers-5-platforms-evaluated-for-2026 |
| Survey periodically. | **Annual relationship survey as primary listening; collecting then going silent; scattered feedback** → continuous in-product listening; close the loop; central governed repository. Sources: https://sprig.com/blog/top-product-feedback-tools · https://getthematic.com/insights/close-the-customer-feedback-loop |

---

## 15. Growth / PLG

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| AARRR pirate metrics; acquisition/activation/retention vocabulary. | **Funnel-only thinking as the whole growth model** → compounding **growth loops** (output reinvested as input). Source: https://www.reforge.com/blog/growth-loops |
| Grow the user base. | **Acquisition-first / "build it and they will come"; vanity metrics (signups)** → retention/NRR is the core; track activation (the aha moment). Sources: https://www.digitalapplied.com/blog/product-led-growth-2026-plg-strategy-playbook · https://mixpanel.com/blog/product-led-growth/ |
| Onboard users. | **Generic one-size product tours; "pure PLG, no sales"; growth "hacking" tricks** → friction-light onboarding to first value; hybrid PLG+SLG with PQLs; systematic loop-and-experiment discipline. Source: https://userpilot.com/blog/user-onboarding/ |

---

## 16. Product Ops (likely absent in a 2018 curriculum)

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| (Often not taught at all in 2018.) Process and tooling support help teams. | **If present, framed as a PMO / status-reporting / project-management function** → product ops as **strategic enablement** (data/insights, process, tooling) so empowered teams scale. Source: https://www.productboard.com/blog/the-state-of-product-ops-in-2025/ |
| Standardize templates. | **Process for process's sake; letting ops make product decisions; tool sprawl** → standardize the "how" not the "what"; PMs own decisions; 3-5 integrated tools. Source: https://www.svpg.com/product-ops-overview/ |

---

## 17. Portfolio & Sunset

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Product life cycle; BCG matrix; manage a portfolio. | **BCG matrix as a complete strategy (dump every "Dog"); annual/quarterly static-spreadsheet reviews** → screen with BCG, augment with GE-McKinsey/ROIC/scenarios; continuous AI-augmented reallocation. Source: https://airfocus.com/glossary/boston-consulting-group-growth-share-matrix/ |
| Retire weak products. | **Short abrupt deprecation (30-day kill); cutting support at announcement; sunk-cost continuation** → multi-month sunset (5D), 5-7 comms touchpoints, migration paths, pre-set exit criteria. Source: https://nextsprints.com/blog/sunset-product-feature-end-of-life-best-practices-strategic-deprecation |
| | **Treating shutdown as the finish line; manual-only data deletion** → automated deletion + data classification at EOL (now audited). Source: https://www.legiscope.com/blog/storage-limitation.html |

---

## 18. Stakeholder Management

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Influence without authority; RACI; stakeholder mapping; tailor comms. | **"Stakeholder management" as managing up via persuasion theater** → collaboration / shared context / co-ownership (managing colleagues as "stakeholders" is a feature-factory symptom). Source: https://www.svpg.com/product-vs-feature-teams/ |
| Keep stakeholders informed. | **RACI with multiple Accountables; output-only updates ("we shipped X")** → exactly one Accountable; BLUF (decision + trade-off + ask). Source: https://medium.com/the-symmetry/stakeholder-management-for-product-managers-raci-model-c4864d984267 |
| Write specs to align. | **Spec-writing as the cheapest alignment tool** → working prototypes (Claude Code/Cursor/Lovable/Figma Make) for buy-in. Source: https://productside.com/the-ai-product-management-workflows-2026/ |

---

## 19. AI-Assisted PM (did not exist in 2018)

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Human judgment and product sense are central. | **No AI in the workflow** → AI operational across the lifecycle (synthesis, PRDs/stories, scoring, NL analytics, prototyping); "AI PM" is now a distinct role. Source: https://productschool.com/blog/artificial-intelligence/guide-ai-product-manager |
| Verify your inputs. | **(New risk) pasting AI output into a PRD/decision unchecked; AI auto-prioritizing by counting requests; treating "use AI" as strategy** → AI drafts, PM decides and verifies; "amplify your thinking, don't abdicate it." Source: https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management |

---

## 20. Responsible Product

| Still valid | Outdated / anti-pattern → 2026 replacement |
|---|---|
| Privacy and accessibility matter; consider ethics. | **Accessibility as an optional QA checklist / post-launch fix** → enforceable EU law (EAA since 28 June 2025); WCAG 2.2 AA designed in. Source: https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/ |
| Protect user data. | **Privacy as a legal-team problem handled at the end** → privacy by design & default (GDPR Art. 25). Source: https://gdpr-info.eu/art-25-gdpr/ |
| | **(New) assuming the EU AI Act is "future, not now"; one-time pre-launch fairness review** → Article 50 transparency from Aug 2026; continuous bias/drift monitoring; human accountable. Sources: https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ · https://www.ey.com/en_us/insights/emerging-technologies/addressing-ai-risks-preventing-bias-and-achieving-ethical-ai-use |

---

### The 10 highest-leverage corrections (the spine of the diff)

1. **Output → Outcome.** Stop counting features/velocity; measure customer + business value. (https://www.svpg.com/the-product-operating-model-an-introduction/)
2. **Big upfront research → Continuous discovery** (≥1 interview/week by the trio). (https://www.userinterviews.com/blog/how-to-interview-customers-continuously-with-teresa-torres-of-product-talk)
3. **Feature/demographic markets → JTBD.** (https://www.nngroup.com/articles/personas-jobs-be-done/)
4. **Funnel → Growth loops; acquisition → retention/NRR; track activation.** (https://www.reforge.com/blog/growth-loops)
5. **Peeking → Sequential/always-valid experimentation with power analysis + guardrails.** (https://www.statsig.com/updates/update/sequential-testing-capabilities)
6. **Vanity KPIs / lone North Star → North Star + input-metric trees; data-informed.** (https://mixpanel.com/blog/metric-tree/)
7. **No AI → AI-assisted PM** ("amplify, don't abdicate"). (https://productschool.com/blog/artificial-intelligence/guide-ai-product-manager)
8. **Ethics/accessibility optional → Responsible product as law** (GDPR/EU AI Act/EAA). (https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
9. **Big-bang launch → Continuous rollout behind flags; release ≠ launch.** (https://www.svpg.com/big-bang-releases/)
10. **NPS as the one number → NPS as one humble signal with CSAT/CES + verbatims.** (https://measuringu.com/nps-discredited/)
