# Workflow Overview — the spine

> A reusable, **framework-agnostic** product-management workflow that takes any product — B2B or B2C, software or hardware-enabled, 0→1 or scale — from a first idea to responsible retirement. It is grounded in the modern **product operating model** (Cagan/SVPG), **Lean Startup** (Ries), **Continuous Discovery** (Torres), **Jobs-to-be-Done**, **OKRs/North Star**, **Agile/Scrum/Kanban**, **PLG**, and the prioritization/measurement frameworks listed in [`03_Frameworks_Map.md`](03_Frameworks_Map.md). It is built to be **AI-powered**: each phase carries interview questions, generation prompts, and explicit triggers for web research and specialised agents — see the [AI Product Manager Protocol](02_AI_Product_Manager_Protocol.md).

**New here?** Read this file (10 minutes), skim [`05_Conventions.md`](05_Conventions.md) (the contract), then open the [`project-starter/WORKFLOW.md`](../WORKFLOW.md) map and start at the phase you're in.

---

## 1. The shape of the work

Two things run at once for the whole life of a product:

- **17 phases** (P00 → P16) — the lifecycle backbone from charter to sunset, each with inputs, activities, deliverables, and an **exit gate**.
- **6 cross-cutting threads** — horizontal disciplines (stakeholders, discovery, metrics, product ops, responsible product, portfolio) that are **alive in every phase**, reviewed at every gate, and never "done."

```
                                  THE LIFECYCLE BACKBONE
00 Charter ─▶ 01 Strategy ─▶ 02 Market ─▶ 03 Discovery ─▶ 04 Opportunity ─▶ 05 Roadmap ─▶ 06 Prioritize
   ─▶ 07 Solution ─▶ 08 PRD ─▶ 09 Stories ─▶ 10 Delivery ─▶ 11 Launch/GTM ─▶ [12 Analytics · 13 Experiments
   · 14 Feedback · 15 Growth  ← continuous loop] ─▶ 16 Sunset

                          6 CROSS-CUTTING THREADS (always on)
   Stakeholders · Continuous Discovery · Metrics & Experimentation · Product Ops · Responsible Product · Portfolio
```

> **It is not a waterfall.** The numbering is a *default reading order and dependency spine*, not a sequence of locked doors. Real product work is **dual-track** (see §2) and the measure-learn loop (§4) runs forever.

---

## 2. The double diamond & dual-track view

The phases map onto two well-known mental models that explain *why* the order matters.

**Double Diamond** — diverge then converge, twice: first on the *problem*, then on the *solution*.

```
   PROBLEM SPACE (discovery)                 SOLUTION SPACE (delivery)
   ◇ Discover ──▶ ◇ Define          │        ◇ Develop ──▶ ◇ Deliver
   03 Discovery     04 Opportunity   │        07 Solution    08 PRD ▸ 09 Stories ▸ 10 Delivery ▸ 11 Launch
   (diverge on      (converge on the │        (diverge on    (converge on the thing you ship)
    needs/jobs)      problem to solve)│        solutions)
```

**Dual-track** — discovery and delivery are **continuous and parallel**, not sequential. The product trio (PM + design + eng) runs a discovery track (P02–P07, never-ending) that continuously feeds a delivery track (P08–P11). You are *always* discovering the next bet while building the current one.

```
  Discovery track  ──○──○──○──○──○──○──▶   (P02-P07 continuous; feeds the backlog)
                       │   │   │
  Delivery track   ────▼───▼───▼──────▶    (P08-P11 continuous; ships validated bets)
```

> The single biggest guard against "built it right, but it was the wrong thing" is **signing off the problem space (G2 Problem Validated, G3 Opportunity Go/No-Go) before committing the solution space.** Discovery is cheap; delivery is expensive.

---

## 3. Problem space vs. solution space

A discipline the workflow enforces: **separate the problem from the solution, and trace between them** (the §4 spine in [Conventions](05_Conventions.md)).

```
PROBLEM SPACE (P03-P04)                       SOLUTION SPACE (P05-P11)
  Insights      (INS-*)   ──evidence──▶   Opportunities sized & chosen
  Jobs          (JOB-*)                   Solutions / bets (SOL-*)
  Opportunities (OPP-*)   ──outcome───▶   Roadmap items (RMI-*) ▸ PRD ▸ stories ▸ ship
  Outcomes / KRs(OBJ/KR)  ──measured──▶   Metrics (MET-*)
```

Sign off the **problem** (a validated opportunity worth solving) before committing to the **solution**. Everything in the solution space must trace back to an opportunity, and every opportunity to evidence.

---

## 4. The continuous loop (why P12–P15 never end)

After launch (G9), the product enters a permanent **measure → learn → grow** loop. These four phases are *continuous*, not one-time:

```
        ┌───────────────────────────────────────────────┐
        ▼                                                 │
  12 Analytics ──▶ 13 Experiments ──▶ 15 Growth ──▶ outcomes ──┐
        ▲                                                       │
        └────────── 14 Feedback (voice of customer) ◀───────────┘
                         │
                         └──▶ feeds new OPP-* back into 03/04 Discovery
```

This loop *is* continuous discovery operationalised: launched product → instrumented (12) → experiments (13) → feedback (14) → growth bets (15) → new opportunities (back to 03/04). **Continuous improvement is not a phase; it is this loop running.**

---

## 5. The gate ladder

Each phase ends at a gate; the 6 cross-cutting threads are reviewed at every gate (open risks, decisions, discovery cadence, metric health, responsible-product checks). Full criteria: [`checklists/gate-reviews.md`](checklists/gate-reviews.md).

```
G0 ── G1 ── G2 ── G3 ── G4 ── G5 ── G6 ── G7 ── G8 ── G9 ┄┄(grow/measure loop)┄┄ G10
00    01    03    04    05    07    08    09    10    11                            16
Kickoff Strategy Problem Opp   Roadmap Solution PRD  Backlog Release Launch          EOL
        Sign-off Valid'd Go/NoGo Commit Valid'd Appr'd Ready  Ready   Decision
```

A gate is a **decision**: *Persevere · Persevere-with-actions · Pivot · Hold · Kill* ([Conventions §2](05_Conventions.md)). The [AI Product Manager Protocol](02_AI_Product_Manager_Protocol.md) makes the AI challenge readiness at each one rather than rubber-stamp it.

---

## 6. Mapping to the 6 macro-stages (and the classic PM lifecycle)

The 17 phases group into **6 macro-stages** — the same grouping used in the README and the `project-starter/WORKFLOW.md` dashboard. Each macro-stage also corresponds, loosely, to a stage of the familiar textbook product lifecycle:

| Macro-stage | Workflow phases | Classic lifecycle term |
|---|---|---|
| **1 · Product Strategy** | 00–04 | Conceive → Strategy → Discover |
| **2 · Product Design** | 05–09 | Define / Plan / Design |
| **3 · Product Development** | 10 | Build / Deliver |
| **4 · Product Launch** | 11 | Launch |
| **5 · Grow & Iterate** (continuous) | 12–15 | Grow / Mature |
| **6 · Sunset** | 16 | Decline / Retire |

> A feature inside an existing product doesn't restart at P00. Re-enter at the phase that fits — usually **P03 Discovery** or **P04 Opportunity** for a new bet, or straight to **P08 PRD** for a well-understood, already-validated change. Each skill detects what prior artifacts exist and flags what's missing.

---

## 7. Choosing how you sequence the phases (lifecycle model)

The 17 phases describe **what** to produce; the **operating cadence** decides **how** you sequence and iterate them. Chosen in P00 and recorded in `Operating_Model.md`:

| Model | Sequences the phases as… | Best for |
|---|---|---|
| **Continuous / Dual-track (default)** | discovery + delivery always running in parallel | most modern software product teams |
| **Lean Startup loop** | tight build-measure-learn cycles, pivot-or-persevere | 0→1, high-uncertainty, pre-PMF |
| **Scrum** | fixed-length sprints with planning/standup/review/retro | teams that want a steady delivery heartbeat |
| **Kanban** | continuous flow with WIP limits, no fixed sprints | support/ops-heavy, unpredictable arrival of work |
| **Stage-Gate** | phase-by-phase with formal gates | hardware, regulated, or large capital-commitment products |

> **SAFe** is a *scaling* framework applied on top of these for large orgs — not a base cadence. Use it only when org size genuinely demands it, and read the criticism first ([Phase 10](../.claude/skills/pm-phase-10-delivery/)).

---

## 8. How to read the rest of this workflow

| If you want… | Go to |
|---|---|
| Your front-of-me runbook (phases, gates, `/commands`, thread tracker, gate log) | [`project-starter/WORKFLOW.md`](../WORKFLOW.md) |
| The operating manual (how the AI runs each phase, interviews you, challenges, recommends research) | [`02_AI_Product_Manager_Protocol.md`](02_AI_Product_Manager_Protocol.md) |
| Where each framework lives in the flow | [`03_Frameworks_Map.md`](03_Frameworks_Map.md) · cards in [`frameworks/`](frameworks/) |
| How to scale this up or down for your product | [`04_Tailoring_Guide.md`](04_Tailoring_Guide.md) |
| The contract (phases, gates, IDs, status, severity, layout) | [`05_Conventions.md`](05_Conventions.md) |
| A specific phase (objective, activities, questions, prompts, deliverables, gate, pitfalls) | [`skills/pm-phase-NN-*/SKILL.md`](../.claude/skills/) |
| A cross-cutting discipline | [`cross-cutting/`](cross-cutting/) |
| Blank templates · AI prompts · checklists | [`templates/`](templates/) · [`prompts/`](prompts/) · [`checklists/`](checklists/) |
| The deep theory + a two-page playbook | [`reference/`](reference/) |
| A fully worked end-to-end example | [`worked_example/`](worked_example/) |
| What changed vs. the older course material and why | [`00_Audit_Migration_Report.md`](00_Audit_Migration_Report.md) |

---

## 9. Principles this workflow enforces

- **Outcomes over outputs.** We're measured by customer & business outcomes, not features shipped ([Conventions §7](05_Conventions.md)).
- **Problem before solution.** Validate the problem (G2/G3) before committing to build.
- **Continuous discovery.** Talk to customers weekly; the opportunity solution tree never closes.
- **Evidence over opinion.** Every bet has an assumption, a test, and a metric. The loudest voice doesn't win — the evidence does.
- **Gates are decisions.** Persevere / with-actions / Pivot / Hold / Kill — never a rubber stamp.
- **Right-size the rigour.** Tailor the phase and thread depth to the product; record every tailoring decision.
- **Responsible by default.** Privacy, accessibility, ethics, and safety are a non-negotiable floor.
- **AI-accelerated, human-led.** AI drafts and challenges; humans decide and are accountable.
- **Never invent.** Unknowns become `TODO:` + a recommendation to research or interview.
