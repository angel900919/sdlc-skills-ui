# Conventions — the single source of truth

> **This file is the contract.** Every phase skill, template, prompt, checklist, framework card, and worked-example artifact in this workflow conforms to the identifiers, gates, decision vocabulary, severities, status strings, and naming defined here. When anything elsewhere disagrees with this file, **this file wins** — fix the other place. Centralising these conventions is what keeps a 17-phase, 6-thread operating system coherent instead of drifting.

This workflow is **framework-agnostic**: it tells you *what* to produce and *when to decide*, then points you at the right framework (Lean Startup, JTBD, Continuous Discovery, OKRs, RICE, Kano, North Star, AARRR, HEART, PLG, Scrum/Kanban, …) for *how*. The frameworks are catalogued in [`03_Frameworks_Map.md`](03_Frameworks_Map.md) and carded in [`frameworks/`](frameworks/).

---

## 1. The 17 phases at a glance

Phases are a **lifecycle backbone**, not a strict waterfall. Modern product work is **dual-track** — discovery (P02–P07) and delivery (P08–P11) run continuously and in parallel, and the measurement/feedback/growth loop (P12–P15) runs for the life of the product. The numbering gives you a *default reading order and a dependency spine*, not permission to stop thinking.

| # | Phase | Purpose (one line) | Primary deliverables | Exit gate |
|---|---|---|---|---|
| 00 | **Product Charter & Operating Setup** | Agree the mandate, team, cadence, and how decisions get made. | `Product_Charter.md`, `Operating_Model.md`, `Stakeholder_Map.md` | **G0 Kickoff** |
| 01 | **Product Strategy & Vision** | Decide where we're going and why we'll win. | `Vision.md`, `Product_Strategy.md`, `North_Star_and_OKRs.md` | **G1 Strategy Sign-off** |
| 02 | **Market & Competitive Research** | Ground strategy in market reality. | `Market_Analysis.md` (TAM/SAM/SOM), `Competitive_Analysis.md`, `Positioning_Brief.md` | *(supporting — review point)* |
| 03 | **Customer Discovery & User Research** | Learn the customer, the problem, and the jobs — before solutions. | `Discovery_Plan.md`, `Interview_Guide.md`, `Personas.md`, `JTBD.md`, `Research_Insights.md` | **G2 Problem Validated** |
| 04 | **Opportunity Assessment & Business Case** | Decide which problem is worth solving now. | `Opportunity_Solution_Tree.md`, `Opportunity_Assessment.md`, `Business_Case.md` | **G3 Opportunity Go/No-Go** |
| 05 | **Product Roadmap** | Commit to outcomes over a horizon, not a feature calendar. | `Roadmap.md` (Now/Next/Later), `Release_Plan.md` | **G4 Roadmap Commit** |
| 06 | **Prioritization** | Rank opportunities/solutions defensibly. | `Prioritization_Matrix.md` (RICE/Kano/WSJF/…) | *(supporting — decision aid)* |
| 07 | **Solution Discovery & Design** | Find a desirable, usable, feasible, viable solution and de-risk it. | `Assumption_Map.md`, `Prototype_Plan.md`, `Usability_Test_Plan.md`, `Solution_Validation.md` | **G5 Solution Validated** |
| 08 | **Requirements & PRD** | Specify what to build, just enough, just in time. | `PRD.md` (or PR/FAQ / Shape-Up pitch), `NFR_Checklist.md` | **G6 PRD Approved / Build Entry** |
| 09 | **User Stories & Acceptance Criteria** | Turn the PRD into a ready, testable backlog. | `Story_Map.md`, `User_Stories.md` (with `AC-*`), `DoR_DoD.md` | **G7 Backlog Ready** |
| 10 | **Agile Delivery & Backlog Management** | Build it, keep flow healthy, reach release readiness. | `Delivery_Plan.md`, `Sprint_Plan.md`, `Risk_Register.md`, `Release_Readiness.md` | **G8 Release Readiness (Go/No-Go)** |
| 11 | **Launch & Go-to-Market** | Land it in the market with GTM, not just ship it. | `Launch_Plan.md`, `GTM_Plan.md`, `Rollout_Plan.md`, `Launch_Comms.md` | **G9 Launch Decision (GA)** |
| 12 | **Analytics, KPIs & Instrumentation** | Know whether it's working. | `Measurement_Plan.md`, `Tracking_Plan.md`, `KPI_Scorecard.md` | *(continuous — health check)* |
| 13 | **Experimentation & A/B Testing** | Prove change with evidence, not opinion. | `Experiment_Plan.md`, `Experiment_Readout.md` | *(continuous — per experiment)* |
| 14 | **Customer Feedback Management** | Run a closed-loop voice-of-customer system. | `Feedback_Ops_Plan.md`, `Feedback_Log.md`, `Insight_Synthesis.md` | *(continuous — health check)* |
| 15 | **Product Growth & Optimization** | Compound activation, retention, and monetization. | `Growth_Model.md`, `Growth_Experiment_Backlog.md` | *(continuous — health check)* |
| 16 | **Product Sunset & Retirement** | Retire a product/feature responsibly. | `Sunset_Decision.md`, `Deprecation_Plan.md`, `Migration_Comms.md` | **G10 End-of-Life** |

> **Supporting vs. gated phases.** P02 (market research) and P06 (prioritization) are **supporting skills** — you invoke them *inside* other phases (P02 feeds P01/P04; P06 feeds P05/P08) and they don't own a lifecycle gate. P12–P15 are **continuous** — they switch on at launch and never turn off; their "gate" is a recurring health check, not a one-time pass.

> **Tailoring note.** Not every product runs every phase. The [Tailoring Guide](04_Tailoring_Guide.md) defines *Solo/Lean* vs *Standard* vs *Enterprise/Formal* phase sets. A phase is never skipped silently — a tailored-out phase is recorded as `tailored out: <reason>` in the `Product_Charter.md`.

---

## 2. The gate ladder (G0 → G10)

Each gate is owned by exactly one phase. Gate criteria live in the owning phase's `SKILL.md` (its *Exit-gate checklist*) and in [`checklists/gate-reviews.md`](checklists/gate-reviews.md) — nowhere else.

```
G0 ── G1 ── G2 ── G3 ── G4 ── G5 ── G6 ── G7 ── G8 ── G9 ┄┄(grow/measure loop: P12-P15)┄┄ G10
00    01    03    04    05    07    08    09    10    11                                      16
```

| Gate | Name | Owning phase | "Passes when…" |
|---|---|---|---|
| **G0** | Kickoff | 00 | Charter agreed; team, mandate, success definition, and operating cadence set. |
| **G1** | Strategy Sign-off | 01 | Vision, strategy, North Star + OKRs agreed by leadership; coherent and focused. |
| **G2** | Problem Validated | 03 | Evidence (not opinion) that a real, valuable problem exists for a defined segment. |
| **G3** | Opportunity Go/No-Go | 04 | The opportunity is sized, the four big risks named, and a go/no-go made with a business case. |
| **G4** | Roadmap Commit | 05 | Outcome-based roadmap agreed and tied to OKRs; Now committed, Next/Later directional. |
| **G5** | Solution Validated | 07 | Riskiest assumptions tested; the solution is desirable, usable, feasible, viable (and ethical). |
| **G6** | PRD Approved / Build Entry | 08 | Problem, scope, success metrics, and NFRs signed off; ready to build. |
| **G7** | Backlog Ready | 09 | Story map sliced; top stories meet Definition of Ready with testable acceptance criteria. |
| **G8** | Release Readiness (Go/No-Go) | 10 | Quality bar met; no open S1/S2; instrumentation, support, rollback all in place. |
| **G9** | Launch Decision (GA) | 11 | GTM ready; launch tier chosen; rollout plan + success/guardrail metrics + rollback agreed. |
| **G10** | End-of-Life | 16 | Retirement justified; migration, comms, data, and legal handled; sunset approved. |

### Gate decisions (the vocabulary — Lean Startup native)

A gate is a **decision point, not a formality**. At each gate the recommendation is one of:

| Outcome | Meaning |
|---|---|
| **Persevere** | All criteria met; proceed to the next phase. |
| **Persevere-with-actions** | Minor open items with named owners + due dates; risk accepted explicitly. |
| **Pivot** | The evidence says change direction — segment, problem, solution, business model, or channel — and loop back to the phase that owns that decision. |
| **Hold** | A blocking gap; do not advance until it's closed. |
| **Kill** | Feasibility, desirability, viability, or the business case has failed; stop or shelve the initiative. |

> A PM who never says **Pivot** or **Kill** is running theatre, not gates. The most valuable gate outcome is often the one that stops wasted build.

---

## 3. Identifier grammar

All IDs are uppercase, hyphen-separated, with a **zero-padded two-digit** sequence (`-01`, not `-1`). They are **stable for the life of the product** — never renumber; retire with a `(deprecated)` note instead.

### 3.1 Problem-space IDs (discovery — what & why)

| Artifact | ID form | Owner phase |
|---|---|---|
| Stakeholder | `STK-<nn>` | 00 |
| Research insight / finding | `INS-<nn>` | 03 |
| Persona | `PER-<nn>` | 03 |
| Job-to-be-Done | `JOB-<nn>` | 03 |
| Opportunity (need/pain/desire; OST node) | `OPP-<nn>` | 04 |
| Objective (OKR) | `OBJ-<nn>` | 01 |
| Key Result (OKR) | `KR-<nn>` | 01 |

### 3.2 Solution-space IDs (delivery — how)

| Artifact | ID form | Owner phase |
|---|---|---|
| Roadmap item / initiative | `RMI-<nn>` | 05 |
| Solution / bet (OST leaf) | `SOL-<nn>` | 07 |
| Assumption / risk-to-test | `ASM-<nn>` | 07 |
| Requirement (in a PRD) | `REQ-<class>-<nn>` (see §3.4) | 08 |
| Epic / Feature | `FEAT-<nn>` | 08 |
| User story | `US-<nn>` | 09 |
| Acceptance criterion | `AC-<nn>` (scoped to its `US`) | 09 |

### 3.3 Measurement, evidence & lifecycle IDs

| Artifact | ID form | Owner |
|---|---|---|
| Metric / KPI (North Star is a tagged `MET`) | `MET-<nn>` | 12 |
| Experiment | `EXP-<nn>` | 13 |
| Feedback theme | `FB-<nn>` | 14 |
| Growth experiment | `GX-<nn>` | 15 |
| Decision (decision log) | `DEC-<nn>` | any (Stakeholder thread) |
| Risk | `RSK-<nn>` | Delivery / Risk thread |
| Dependency | `DEP-<nn>` | 10 |
| Defect / issue (severity per §5) | `ISS-<nn>` | 10 |

### 3.4 Requirement classes — `REQ-<class>-<nn>`

PRDs stay lean, but when a PRD lists discrete requirements, tag the class so non-functional needs aren't forgotten:

| Class | Code | Covers |
|---|---|---|
| Functional | `F` | What the product does — actions, flows, outputs. |
| Usability / UX | `U` | Task time, accessibility (WCAG), learnability, content. |
| Performance | `P` | Latency, throughput, capacity, scale. |
| Reliability / Operational | `O` | Uptime/SLO, error handling, offline, data retention. |
| Security / Privacy | `SEC` | AuthN/Z, data protection, consent, compliance (GDPR/EU AI Act). |
| Constraint | `C` | Imposed limits — budget, platform, mandated tech, legal. |

> Non-functional requirements (`U`/`P`/`O`/`SEC`/`C`) are where launches die. The PRD template forces a one-line answer for each, even if it's "N/A — why".

**Placeholder convention:** a not-yet-assigned link is `EXP-TBD` / `MET-TBD`, never a blank cell. Placeholders are resolved in their owning phase.

---

## 4. The traceability spine (the golden thread)

Every phase extends this thread and never breaks it. It *is* the Opportunity Solution Tree, made operational across the whole lifecycle:

```
Insight (INS) ─┐
Job (JOB) ─────┼─▶ Opportunity (OPP) ─▶ Objective/KR (OBJ/KR) ─▶ Roadmap item (RMI)
Persona (PER) ─┘            │                                          │
                            ▼                                          ▼
                     Solution / bet (SOL) ─▶ Assumption (ASM) ─▶ Experiment (EXP)
                            │                                          │
                            ▼                                          ▼
                   Requirement (REQ) / Feature (FEAT) ─▶ User story (US) ─▶ Acceptance criterion (AC)
                            │                                          │
                            └────────────── measured by ─▶ Metric (MET) ◀── Feedback (FB)
```

Read it as: *evidence → opportunity → outcome → bet → spec → ship → measure → learn → loop.* The discipline is that **nothing enters the roadmap without an opportunity, no opportunity without evidence, and no "done" without a metric** — forward (`INS→…→MET`) and backward (`MET→…→INS`) traceability both matter. Backward trace is what lets you answer "why are we building this?" at any point.

---

## 5. Severity & priority

### 5.1 Defect / incident severity — `S1`–`S4`

| Severity | Name | Meaning |
|---|---|---|
| **S1** | Critical | Data loss, security/privacy breach, or total loss of primary function; no workaround. |
| **S2** | Major | Major function impaired; awkward workaround only. |
| **S3** | Minor | Minor function affected; easy workaround. |
| **S4** | Cosmetic | Trivial / cosmetic; no functional impact. |

> **Severity ≠ priority.** Severity is *impact*; priority is *what we do about it and when*. An S4 can be P0 if it blocks a launch demo; an S1 can be P2 if it hits a tiny segment with a workaround. Score them separately.

### 5.2 Priority — P0–P3 and MoSCoW

`P0` (now/blocker) · `P1` (high) · `P2` (medium) · `P3` (low). **MoSCoW** (Must / Should / Could / Won't) is the accepted alias for scope decisions: map Must→P0, Should→P1, Could→P2, Won't→out-of-scope (record it).

### 5.3 Risk scoring

`Likelihood × Impact`, each 1–5 → a 5×5 matrix giving Low / Medium / High / Critical bands. See [`cross-cutting/Responsible_Product.md`](cross-cutting/Responsible_Product.md) and the `Risk_Register.md` template. Discovery risk is scored separately as the **four big risks** (value/desirability, usability, feasibility, business-viability) plus **ethics** — see [Phase 07](skills/pm-phase-07-solution-design/).

---

## 6. Document status & versioning

Every deliverable carries frontmatter:

```markdown
---
Document: <Title>
Document ID: <TYPE>-<PRODUCT_SLUG>-vX.Y
Status: <Draft | In Review | Approved (<Gate>-approved YYYY-MM-DD) | Living | Superseded by vX.Y>
Owner: <role/name>
Updated: <YYYY-MM-DD>
---
```

- **Status strings** are exactly: `Draft` → `In Review` → `Approved (<Gate>-approved <date>)` → `Superseded`. Use **`Living`** for artifacts that are never "done" — the roadmap, KPI scorecard, feedback log, risk register, opportunity solution tree, stakeholder map.
- **Version** is `vMAJOR.MINOR`: minor bump for tracked edits, major bump when a gate re-approves a materially changed artifact.
- Dates are absolute (`YYYY-MM-DD`), never relative ("next quarter").

---

## 7. Outcomes over outputs (the prime directive)

The single rule that overrides feature-counting everywhere in this workflow:

> **We are measured by the customer and business *outcomes* we produce, not the *output* (features, releases) we ship.** Roadmaps express outcomes; OKRs express outcomes; "done" is defined by a moved metric, not a closed ticket.

This is why P05 roadmaps are Now/Next/Later (not a Gantt of features), why P01 sets a North Star, and why P10's Definition of Done points back to a `MET`. A phase that produces output with no line back to an outcome (§4) has failed its own gate.

---

## 8. Canonical framework & source citations

Use these exact names and primary attributions (the audit found drifting/mis-attributed citations in the older material). Full cards in [`frameworks/`](frameworks/); each is pinned to a phase in [`03_Frameworks_Map.md`](03_Frameworks_Map.md).

| Area | Canonical framework + primary source |
|---|---|
| Build-the-right-thing loop | **Lean Startup** — Build-Measure-Learn, validated learning, pivot/persevere (Eric Ries, 2011) |
| Problem solving / empathy | **Design Thinking** (IDEO / Stanford d.school); **Double Diamond** (UK Design Council) |
| Customer/job theory | **Jobs-to-be-Done** — two schools: **ODI / outcome-driven** (Tony Ulwick / Strategyn) and **Switch / forces** (Bob Moesta, Chris Spiek; Clayton Christensen) |
| Continuous discovery | **Continuous Discovery Habits** + **Opportunity Solution Tree** (Teresa Torres) |
| Empowered product teams | **INSPIRED / EMPOWERED / TRANSFORMED** (Marty Cagan / SVPG); product trio |
| Escape the feature factory | **Escaping the Build Trap** (Melissa Perri); product operating model |
| Strategy | **Good Strategy / Bad Strategy** diagnosis-policy-action (Richard Rumelt); the **Product Strategy Stack** (Ravi Mehta) |
| Goals | **OKRs** (Andy Grove / John Doerr, *Measure What Matters*) |
| Headline metric | **North Star Metric** + input metrics / metric tree (Amplitude; Sean Ellis) |
| Lifecycle metrics | **AARRR "Pirate Metrics"** (Dave McClure, 500 Startups) |
| UX metrics | **HEART** (Kerry Rodden et al., Google) |
| Prioritization | **RICE** (Intercom); **Kano model** (Noriaki Kano); **MoSCoW**; **WSJF / Cost of Delay** (SAFe / Don Reinertsen); **ICE** |
| Positioning | **Obviously Awesome** positioning (April Dunford) |
| Growth | **Product-Led Growth** (OpenView); **Growth Loops** (Reforge / Brian Balfour) |
| Delivery | **Scrum** (Schwaber/Sutherland); **Kanban** (David Anderson); **Dual-track agile** (Marty Cagan / Jeff Patton); **Story Mapping** (Jeff Patton) |
| Spec alternatives | **Working Backwards / PR-FAQ** (Amazon); **Shape Up** (Basecamp / Ryan Singer) |
| Flow / delivery metrics | **DORA** (DevOps Research & Assessment); flow metrics (lead time, cycle time, throughput, WIP) |

> When a finding from web research updates one of these (e.g. a new edition, a superseded practice), update the card in [`frameworks/`](frameworks/) and cite the source there — don't fork the definition into a phase skill.

---

## 9. Project folder layout (per product instance)

When this workflow is *applied* to a real product, it produces this tree. Blank, fill-in versions of every file live in [`templates/`](templates/).

```
<product-slug>/
├── PRODUCT.md                      ← the home page: links WORKFLOW.md + current state
├── WORKFLOW.md                     ← your front-of-me map (copied from project-starter)
├── 00_Charter/                     Product_Charter.md · Operating_Model.md · Stakeholder_Map.md
├── 01_Strategy/                    Vision.md · Product_Strategy.md · North_Star_and_OKRs.md
├── 02_Market/                      Market_Analysis.md · Competitive_Analysis.md · Positioning_Brief.md
├── 03_Discovery/                   Discovery_Plan.md · Interview_Guide.md · Personas.md · JTBD.md · Research_Insights.md
├── 04_Opportunity/                 Opportunity_Solution_Tree.md · Opportunity_Assessment.md · Business_Case.md
├── 05_Roadmap/                     Roadmap.md · Release_Plan.md
├── 06_Prioritization/             Prioritization_Matrix.md
├── 07_Solution/                    Assumption_Map.md · Prototype_Plan.md · Usability_Test_Plan.md · Solution_Validation.md
├── 08_PRD/                         PRD.md (or PR_FAQ.md / Shape_Up_Pitch.md) · NFR_Checklist.md
├── 09_Backlog/                     Story_Map.md · User_Stories.md · DoR_DoD.md
├── 10_Delivery/                    Delivery_Plan.md · Sprint_Plan.md · Risk_Register.md · Release_Readiness.md
├── 11_Launch/                      Launch_Plan.md · GTM_Plan.md · Rollout_Plan.md · Launch_Comms.md
├── 12_Analytics/                   Measurement_Plan.md · Tracking_Plan.md · KPI_Scorecard.md
├── 13_Experiments/                 Experiment_Plan.md · Experiment_Readout.md (one per EXP)
├── 14_Feedback/                    Feedback_Ops_Plan.md · Feedback_Log.md · Insight_Synthesis.md
├── 15_Growth/                      Growth_Model.md · Growth_Experiment_Backlog.md
├── 16_Sunset/                      Sunset_Decision.md · Deprecation_Plan.md · Migration_Comms.md
└── _threads/                       Decision_Log.md · Risk_Register.md · Responsible_Product_Review.md · Portfolio_View.md
```

> The cross-cutting threads (`_threads/`) are **living artifacts** reviewed at every gate — see [`cross-cutting/`](cross-cutting/). They are never "phase output"; they accrete across the whole lifecycle.

---

## 10. The six cross-cutting threads

Horizontal disciplines that are alive in *every* phase and reviewed at *every* gate (full method in [`cross-cutting/`](cross-cutting/)):

1. **Stakeholder Management & Communication** — alignment, influence without authority, decision log.
2. **Continuous Discovery & Customer Insight** — the weekly-touch habit; the opportunity solution tree never closes.
3. **Metrics, Analytics & Experimentation** — instrumentation hygiene; every bet has a metric and (where possible) an experiment.
4. **Product Operations & Ways of Working** — cadences, tooling, templates, scaling the practice.
5. **Responsible Product** — privacy-by-design, accessibility, AI ethics, security, trust & safety, compliance.
6. **Product Portfolio & Lifecycle Management** *(multi-product / optional)* — resource allocation across the portfolio; lifecycle stage per product.

A thread is never *removed*, only *scaled* (see the [Tailoring Guide](04_Tailoring_Guide.md) §3). The **privacy/accessibility/safety floor is non-negotiable** even for the smallest product.

---

## 11. AI-assisted, human-led

This workflow is built to be run *with* an AI product partner (see [`02_AI_Product_Manager_Protocol.md`](02_AI_Product_Manager_Protocol.md)). The standing rule:

> **AI accelerates the work; humans own the judgment.** AI drafts, summarises, researches, critiques, and generates options. A human makes every strategy, prioritization, ethics, and go/no-go *decision* — and is accountable for it. The AI never invents customer evidence, metrics, market data, or quotes; unknowns become `TODO: <what's owed>` plus a recommendation to research or interview.

---

*This file is cited by every phase skill (`Conforms to ../../05_Conventions.md`). If you change a gate name, an ID form, or a status string, change it here first, then ripple it out.*
