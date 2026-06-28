# Product Management — Audit & Migration Report

**Audited:** the existing Udacity-course-derived knowledge base in `PM_Final_WF/` — four phase playbooks + four summaries (Strategy → Design → Development → Launch) and seven course-shaped skills — against **2026 product-management best practice**.
**Method:** a multi-agent web-research sweep across 18 lifecycle areas (→ a consolidated, citation-rich [`reference/2026_Research_Pack.md`](reference/2026_Research_Pack.md) + a legacy-vs-2026 [`reference/2026_vs_Legacy_Diff.md`](reference/2026_vs_Legacy_Diff.md)), adversarially fact-checked (3 claims corrected before use); then a contract-first build of a new, framework-agnostic **Product Management operating system** in this folder, plus targeted, structure-preserving updates to `PM_Final_WF/`.
**Date:** 2026-06-26.

> **Why this report exists.** The brief asked, for every change, to (1) explain why it was required, (2) reference the best practice or source that motivated it, and (3) produce a migration report of all additions, removals, modifications, and new assets. This is that report.

---

## Executive summary

The legacy `PM_Final_WF/` is **strong and worth keeping** — its playbooks are well-written, opinionated, and already 2026-aware in places (gradual rollout, counter-metrics, Goodhart's Law, PMF discipline). But it is shaped by a **2018-era "intro to PM" mental model**: write a big PRD → rank a feature backlog → big-bang launch → track DAU/NPS. Ten through-lines of modern practice break that model, and the course material under-covers large parts of the lifecycle the brief requires (continuous discovery, JTBD, opportunity assessment, roadmapping-as-outcomes, prioritization depth, story mapping, analytics/metric-trees, experimentation rigor, feedback ops, growth/PLG, product ops, portfolio, sunset, stakeholder management, AI-assisted PM, responsible product).

**Verdict:** **keep-and-refresh** the legacy KB (it remains the *curriculum* layer); **build** a new general-purpose *operating system* alongside it (this folder) that covers the full modern lifecycle end-to-end with 2026 best practice, mirrors the house pattern of `System_Engineering_Workflow/`, and is run as **manual-invocation skills** (`disable-model-invocation: true`) so the human stays in control of when each one fires.

Nothing was removed. All changes are additive or in-place refreshes.

---

## Part A — The 10 highest-leverage 2026 corrections

The spine of the audit (full evidence in [`reference/2026_vs_Legacy_Diff.md`](reference/2026_vs_Legacy_Diff.md)). Each is *why* the new workflow is shaped as it is.

| # | Legacy mental model | 2026 best practice | Primary source |
|---|---|---|---|
| 1 | Output/velocity = success | **Outcomes over outputs** (product operating model) | [SVPG](https://www.svpg.com/the-product-operating-model-an-introduction/) |
| 2 | Big upfront research, then build | **Continuous discovery** — ≥1 interview/week by the product trio | [Torres / User Interviews](https://www.userinterviews.com/blog/how-to-interview-customers-continuously-with-teresa-torres-of-product-talk) |
| 3 | Feature/demographic markets | **Jobs-to-be-Done** (two schools; personas a complement) | [NN/g](https://www.nngroup.com/articles/personas-jobs-be-done/) |
| 4 | Funnel; acquisition-first | **Growth loops; retention/NRR core; track activation** | [Reforge](https://www.reforge.com/blog/growth-loops) |
| 5 | A/B "peeking" at p<0.05 | **Sequential/always-valid testing + power analysis + guardrails** | [Statsig](https://www.statsig.com/updates/update/sequential-testing-capabilities) |
| 6 | Vanity KPIs / a lone North Star | **North Star + input-metric tree; data-informed not -driven** | [Mixpanel](https://mixpanel.com/blog/metric-tree/) · [Amplitude](https://amplitude.com/books/north-star/about-north-star-framework) |
| 7 | (No AI in the workflow) | **AI-assisted PM — "amplify your thinking, don't abdicate it"** | [Product School](https://productschool.com/blog/artificial-intelligence/guide-ai-product-manager) |
| 8 | Ethics/accessibility optional | **Responsible product is law** (GDPR Art.25 · EAA Jun 2025 · EU AI Act Art.50 Aug 2026) | [Level Access](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) |
| 9 | Big-bang launch on a date | **Continuous rollout behind flags; release ≠ launch** | [SVPG](https://www.svpg.com/big-bang-releases/) |
| 10 | NPS = "the one number" | **NPS = one humble signal with CSAT/CES + verbatims** | [MeasuringU](https://measuringu.com/nps-discredited/) |

Two more the brief explicitly required and the legacy KB lacked entirely: **roadmaps as Now/Next/Later decision systems, not Gantts** ([ProdPad](https://www.prodpad.com/blog/invented-now-next-later-roadmap/)) and **strategy as Rumelt's diagnosis→guiding-policy→coherent-action, with OKRs measuring (not being) the strategy** ([Ant Murphy](https://www.antmurphy.me/newsletter/okrs-strategy)).

---

## Part B — What was created (the new operating system)

A complete `Product_Management_Workflow/` mirroring the structure of the repo's `System_Engineering_Workflow/` (the house pattern), applied to product management.

**Backbone (the contract + manuals) — authored directly for coherence:**
- [`README.md`](README.md) — entry point + the 17-phase table.
- [`01_Workflow_Overview.md`](01_Workflow_Overview.md) — the spine: 17 phases, double-diamond/dual-track, the continuous loop, gates.
- [`02_AI_Product_Manager_Protocol.md`](02_AI_Product_Manager_Protocol.md) — how the AI runs each phase (interview→draft→red-team→advise→gate); AI-accelerated, human-led.
- [`03_Frameworks_Map.md`](03_Frameworks_Map.md) — every framework pinned to a phase + a fast chooser + anti-patterns.
- [`04_Tailoring_Guide.md`](04_Tailoring_Guide.md) — Solo/Lean · Standard · Enterprise/Formal, with a non-negotiable responsible-product floor.
- [`05_Conventions.md`](05_Conventions.md) — **the contract**: 17 phases, the G0–G10 gate ladder, PM ID grammar, the traceability spine, severity/priority, status strings, folder layout, framework citations.

**17 phase skills** (`skills/pm-phase-NN-*/SKILL.md`) — one focused, **manual-invocation** skill per lifecycle phase (`disable-model-invocation: true` + `user-invocable: true`). Each carries: objective, inputs, a one-topic-at-a-time interview, decision points, deliverables + output shapes, an AI prompt pack (ELICIT/GENERATE/CRITIQUE/GATE), research/agent triggers, cross-cutting hooks, a frameworks anchor, the exit-gate checklist, a pitfalls table, and references with real 2026 sources. Covers: 00 Charter · 01 Strategy · 02 Market Research · 03 Discovery · 04 Opportunity · 05 Roadmap · 06 Prioritization · 07 Solution Design · 08 PRD · 09 Stories · 10 Delivery · 11 Launch/GTM · 12 Analytics · 13 Experimentation · 14 Feedback · 15 Growth · 16 Sunset.

**6 cross-cutting threads** (`cross-cutting/`) — the always-on disciplines reviewed at every gate: Stakeholder Management · Continuous Discovery · Metrics & Experimentation · Product Operations · Responsible Product · Portfolio Management.

**55 templates** (`templates/`) — a blank, frontmatter-carrying fill-in template for every deliverable across all phases + the `_threads/` living artifacts + a per-product `PRODUCT.md` home page.

**27 framework cards** (`frameworks/`) — one-page reference per framework (definition, steps, micro-example, when-not-to-use, mistakes, source): Lean Startup, Design Thinking/Double Diamond, JTBD (both schools), Continuous Discovery, Opportunity Solution Tree, Product Strategy Stack, Good/Bad Strategy, OKRs, North Star + metric tree, AARRR, HEART, RICE, Kano, MoSCoW, WSJF/Cost of Delay, ICE, Business Model Canvas, Positioning (Dunford), PLG/Growth Loops, Story Mapping, INVEST/Gherkin, Scrum/Kanban/Dual-track, Working Backwards/PR-FAQ, Shape Up, DORA/flow, Assumption Mapping/4 risks, A/B testing.

**Prompts** (`prompts/`) — `README.md` (the 4 intents) · `ai-prompt-library.md` (phase-by-phase) · `reusable-prompt-patterns.md` (cross-phase) · `research-and-agents.md` (when to interview a customer / web-research / spawn an agent). The research guide defines a **research-execution ladder** — inline `WebSearch` → the **`/research-report`** skill (cited reports/decision briefs to `reports/`, cross-checked ≥2 sources; **bundled into `project-starter/.claude/skills/`** so it travels) → the `researc_agent` CLI or `/deep-research` for heavy sweeps — with Context7-first for tooling and plain `WebSearch` as the always-valid fallback. The research-heavy phases (02 Market, 04 Opportunity, 11 Launch/GTM, 12 Analytics) and the Responsible Product thread point their web-research triggers at `/research-report` as the executor.

**Checklists** (`checklists/`) — `gate-reviews.md` (the G0–G10 decision criteria, single source of truth) · `quality-checklists.md` (per-artifact quality bars).

**Reference** (`reference/`) — `Comprehensive_Guide.md` (deep theory / training curriculum) · `Full_Process_Playbook.md` (two-page) · `2026_Research_Pack.md` + `2026_vs_Legacy_Diff.md` (the cited evidence base).

**Worked example** (`worked_example/`) — a coherent end-to-end instance ("Cadence", a B2B SaaS async-standups product) demonstrating the traceability spine from insight → opportunity → outcome → bet → spec → ship → measure → sunset.

**Project starter** (`project-starter/`) — the drop-in, copy-me kit: `CLAUDE.md` (auto-loaded each session — orients the AI to the workflow, states the standing rules, and reinforces manual-invocation/human-control; merge-safe via an `@import` of the Protocol), `WORKFLOW.md` (the front-of-me dashboard, grouped into the 6 macro-stages), `.claude/skills/` (the 17 manual skills + the bundled `research-report` executor, path-rewired for the bundle), and a lean `pm-workflow/` reference copy. This is the "operating system" the brief describes: open it, see where you are, what's done, what's missing, which skill to run next, and what the deliverable looks like.

---

## Part C — What was modified in `PM_Final_WF/` (kept + refreshed)

Structure preserved; changes are additive callouts + frontmatter flags. Each "2026 refresh" callout states what's still valid, the shifts (with sources), and a cross-link to the new operating system.

| File | Change | Why / source |
|---|---|---|
| `01-product-strategy-playbook.md` + `-summary.md` | Added "2026 refresh" callouts | Strategy = Rumelt kernel; North Star + input metrics; outcomes over outputs; continuous discovery — [Rumelt](https://www.productbookshelf.com/2020/11/good-strategy-bad-strategy/), [Amplitude](https://amplitude.com/books/north-star/about-north-star-framework), [SVPG](https://www.svpg.com/the-product-operating-model-an-introduction/) |
| `02-product-design-playbook.md` + `-summary.md` | Added "2026 refresh" callouts | Continuous discovery (not just sprints); JTBD; 4-big-risks before prototyping; accessibility by design — [Torres](https://www.producttalk.org/2024/02/interview-snapshot/), [NN/g](https://www.nngroup.com/articles/personas-jobs-be-done/), [SVPG](https://www.svpg.com/four-big-risks/) |
| `03-product-development-playbook.md` + `-summary.md` | Added "2026 refresh" callouts | Dual-track agile; flow/DORA over velocity; DoR-gate & velocity-as-KPI anti-patterns; SAFe criticism — [DORA](https://dora.dev/research/2024/dora-report/), [LogRocket](https://blog.logrocket.com/product-management/dual-track-agile-continuous-discovery/) |
| `04-product-launch-playbook.md` + `-summary.md` | Added "2026 refresh" callouts | Release≠launch (big-bang dead); hybrid PLG+SLG + usage pricing; growth loops; sequential experimentation; NPS demoted; responsible product as law — [SVPG](https://www.svpg.com/big-bang-releases/), [Reforge](https://www.reforge.com/blog/growth-loops), [MeasuringU](https://measuringu.com/nps-discredited/) |
| `skills/*` (all 7) | Added `disable-model-invocation: true` + `user-invocable: true` | The brief requires every skill be manual-invocation, not auto-firing. |
| `skills/README.md` | Added banner: manual-invocation note + pointer to the new operating system + the old→new mapping | Orientation; preserves the curriculum role while directing real work to the new workflow. |

**Removals:** none.

---

## Part D — Mapping: the 7 legacy skills → the new phases

The legacy skills remain usable as the course-shaped curriculum layer. Their jobs are superseded for general work by these phases:

| Legacy skill (`PM_Final_WF/skills/`) | Superseded/extended by (new) |
|---|---|
| `product-strategy-interview` (11 strategy artifacts) | `pm-phase-01-strategy` + `pm-phase-02-market-research` + `pm-phase-04-opportunity` (+ `pm-phase-12-analytics` for KPIs) |
| `design-sprint-interview` (~28 sprint artifacts) | `pm-phase-03-discovery` + `pm-phase-07-solution-design` (Design Sprint is one tool within continuous discovery) |
| `product-development-interview` (16 build artifacts) | `pm-phase-09-stories` + `pm-phase-10-delivery` |
| `product-launch-interview` (21 launch artifacts) | `pm-phase-11-launch-gtm` (+ `12 analytics`, `13 experimentation`, `14 feedback`, `15 growth` for post-launch) |
| `pitch-deck-builder` (packager) | retained — packages strategy artifacts; complements `pm-phase-01-strategy` |
| `build-phase-packager` (packager) | retained — packages build-phase status; complements `pm-phase-10-delivery` |
| `launch-prd-builder` (packager) | retained — packages a launch PRD bundle; complements `pm-phase-08-prd`/`11-launch-gtm` |

The three **packager** skills have no direct equivalent in the new set (which is interview/playbook-shaped) and are kept as-is for turning canonical artifacts into audience-shaped deliverables.

---

## Part E — New lifecycle coverage the legacy KB lacked

The brief's required lifecycle areas, and where each now lives (✚ = net-new vs. the legacy KB):

Vision/strategy (01) · Market & competitive (02) · ✚Customer discovery (03) · ✚User research & JTBD (03) · ✚Opportunity assessment (04) · ✚Roadmap/Now-Next-Later (05) · ✚Prioritization RICE/Kano/MoSCoW/WSJF (06) · Product/solution discovery (03/07) · PRD (08) · ✚User stories & acceptance criteria (09) · Agile delivery & backlog (10) · Launch & GTM (11) · ✚Analytics/KPIs/North-Star (12) · ✚Experimentation & A/B (13) · ✚Feedback management/VoC (14) · ✚Growth/PLG (15) · ✚Stakeholder management (thread) · ✚UX collaboration (07) · ✚Product operations (thread) · ✚Portfolio management (thread) · ✚Product sunset/retirement (16) · ✚Continuous improvement (the P12–P15 loop) · ✚Responsible product (thread) · ✚AI-assisted PM (woven through every phase + Protocol).

Frameworks the brief named are all present as cards and pinned to phases ([`03_Frameworks_Map.md`](03_Frameworks_Map.md)): Lean Startup, Design Thinking, JTBD, Product Discovery, Agile/Scrum/Kanban, OKRs, North Star, PLG, RICE, Kano, Opportunity Solution Tree, HEART, AARRR, continuous discovery.

---

## Part F — Provenance, verification & how to keep it current

- **Evidence base:** [`reference/2026_Research_Pack.md`](reference/2026_Research_Pack.md) (18 cited lifecycle briefs consolidated) and [`reference/2026_vs_Legacy_Diff.md`](reference/2026_vs_Legacy_Diff.md).
- **Adversarial verification:** high-stakes claims were re-checked; three were corrected before shipping — the Netlify agent-signup figure (reworded; the absolute "80%" claim was unsupported), the Eppo acquisition price (marked "terms undisclosed; ~$220M per reports"), and the SAFe "adoption declining" framing (reworded to "criticism mainstream + shift to hybrid/homegrown scaling; raw-adoption data mixed"). Self-flagged `UNVERIFIED` figures (AI-PM comp/role counts; some feedback-loop percentages) keep their caveats.
- **House rule honoured:** every library/framework/SDK/tool question routes through Context7 docs first; web research is reserved for market/competitive/regulatory/benchmark facts.
- **Keeping current:** the laws cited (EU AI Act phasing, EAA, WCAG version) and tool/market facts move — re-run the research sweep periodically and update the framework cards (one home per framework) rather than editing definitions inside phase skills.

---

*This report is the provenance for the consolidated, 2026-anchored Product Management operating system in this folder, and for the targeted refresh of `PM_Final_WF/`.*
