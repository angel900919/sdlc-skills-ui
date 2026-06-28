# Product Portfolio & Lifecycle Management — cross-cutting thread

> **Continuous resource allocation across everything you run** — deciding, under capacity constraints and inherited company strategy, what to **start / scale / sustain / fix / sunset**, with every product carried against an explicit lifecycle stage.

**Thread #6 of 6** ([Conventions §10](../05_Conventions.md)) · **OPTIONAL — multi-product only.** A single-product team keeps a one-row stub and skips the rest; this thread switches on the moment you own a *second* product, line, or platform that competes for the same teams, budget, or data.

---

## Why it's a thread, not a phase

There is no "portfolio phase" because allocation is never *finished*. The instant you commit capacity to one bet, you have de-funded another — that trade-off is alive in **every** phase and re-decided at **every** gate, not in an annual planning offsite. The 2024–2026 shift is decisive: portfolio decisioning is becoming **continuous and AI-augmented** (AI scores initiatives for value/risk/capacity and recommends start/pause/stop), and the annual or quarterly-only review run off a static spreadsheet is now a named anti-pattern. A phase ends at a gate; this thread accretes across the whole lifecycle and outlives any single product in it.

It also enforces the **prime directive at portfolio scale**: we allocate to **outcomes and strategic role**, not to product count, feature count, or who lobbied hardest ([Conventions §7](../05_Conventions.md)). "Strategy first, AI second" — anchor every allocation to a business outcome, never to AI-adoption or activity rates.

---

## The method / practices

**1. Stage every product (Product Life Cycle).** Each product sits in exactly one stage, re-confirmed each review:

`Development` (pre-launch / 0→1) → `Introduction` (launched, finding traction) → `Growth` (scaling, retention proven) → `Maturity` (stable, optimise/defend) → `Decline` (sunset candidate → P16).

The stage drives the *kind* of investment (Growth gets fuel; Maturity gets efficiency; Decline gets an exit plan), and it is set by **evidence** — retention curve, NRR, usage trend — not by a sponsor's optimism.

**2. Screen with portfolios, decide with judgment.** Use the **BCG Growth-Share Matrix** (Stars / Cash Cows / Question Marks / Dogs) as a *first-pass screen only* — never as a complete strategy and never as license to reflexively dump "Dogs." Augment it with the **GE-McKinsey 9-box** (market attractiveness × competitive strength) for a richer two-axis view, and pressure-test with ROIC / scenario planning where the stakes justify it. A low quadrant is a *question to investigate* (discoverability? usability? strategic fit?), not a kill order.

**3. Allocate continuously against constraints.** Run a rolling portfolio review (monthly or per-cycle, not an annual lock). Make the trade-off visible: total capacity reconciles to **100%**, split by lifecycle stage and by bet horizon (Now / Next / Later, mirroring the roadmap), with a reserve held for keep-the-lights-on and tech debt. Funding one product visibly de-funds another — that is the whole point.

**4. Outcome-over-output portfolio.** Each product carries a **North Star (`MET-*`)** and is judged on its *trend*, not its release log. The portfolio roadmap expresses outcomes and strategic roles (Core · Growth bet · Cash/Defend · Explore/Option), not a Gantt of features across products.

**5. Detect overlap and set exit criteria up front.** Surface cannibalization and shared-platform contention as explicit dependencies (`DEP-*`). For weak products, write **exit criteria *before* you're emotionally invested** — the documented antidote to escalation-of-commitment / sunk-cost (Staw, 1976). Decline-stage and low-leverage products are handed to **[P16 Sunset](../../.claude/skills/pm-phase-16-sunset/)** with their trigger and exit criteria attached.

**6. AI assists; humans own the call.** AI merges fragmented data (ERP/CRM/analytics/support) into a unified view, flags overlap and hidden cost, and runs natural-language "what-if" scenarios. Humans own strategy, weighting, ethics, the final start/scale/sunset decision, and accountability for kill decisions and customer trust. AI output is **input to verify, not ground truth**.

---

## The living artifact it maintains

| Artifact | ID | Status | Location |
|---|---|---|---|
| **Portfolio View** | `PORTVIEW-<portfolio-slug>-v1.0` | `Living` | `_threads/Portfolio_View.md` (template: [`../templates/Portfolio_View.md`](../templates/Portfolio_View.md)) |

It is the **one place** that answers *"across everything we run, where does capacity go, and what do we start/scale/sustain/fix/sunset?"* It reuses existing IDs rather than minting new ones: roadmap items `RMI-*` ([P05](../../.claude/skills/pm-phase-05-roadmap/)), North Stars `MET-*`, cross-product dependencies `DEP-*`, portfolio-level risks `RSK-*` (→ `_threads/Risk_Register.md`), and every allocation call logged as a `DEC-*` in `_threads/Decision_Log.md` ([Conventions §3](../05_Conventions.md)). Allocation decisions use a fixed vocabulary: **Start · Scale · Sustain · Fix · Sunset**.

---

## Reviewed at every gate

At each gate (G0→G10) the AI re-checks the bet's place in the portfolio ([Protocol §7](../02_AI_Product_Manager_Protocol.md)) and asks:

- **What does this de-fund?** If we commit here, which product loses capacity — and is that trade made on strategic value or on volume?
- **What lifecycle stage is each affected product in, and did this gate change it?** (Did a launch move it Introduction→Growth? Did flat retention move it toward Decline?)
- **Does this initiative overlap or cannibalize** another product in the portfolio? Is the `DEP-*` recorded?
- **Is allocation still following strategic role**, or has it drifted to the loudest sponsor since the last review?
- **Has any product crossed into Decline?** If so, has it been handed to [P16 Sunset](../../.claude/skills/pm-phase-16-sunset/) with exit criteria, rather than left to limp on by inertia?
- **Does total capacity still reconcile to 100%** against real (not aspirational) staffing?

A gate where the answer to "what does this de-fund?" is "nothing" is a gate that hasn't looked at the portfolio.

---

## Tailoring (see [`../04_Tailoring_Guide.md`](../04_Tailoring_Guide.md) §3)

| Profile | How this thread scales |
|---|---|
| **Solo / Lean** | **n/a — single product.** Keep at most a one-row stub recording the product's lifecycle stage and North Star. Do not run portfolio ceremony on one product. |
| **Standard** | Multi-product: a living `Portfolio_View.md` with allocation reconciled to 100%, BCG/9-box as a screening lens, a monthly or per-cycle review; lifecycle stage re-confirmed at major gates. |
| **Enterprise / Formal** | Portfolio **governance**: board-level allocation, SPM tooling (predictive/prescriptive AI with explainability), formal scenario planning, cannibalization analysis, dependency management across teams, and audited sunset/data-deletion accountability ([EU/EDPB erasure expectations](../05_Conventions.md)). |

A thread is **scaled, never removed** — but this is the one thread that is genuinely *n/a* for a single-product team. Record that as `tailored out: single product` in `00_Charter/Operating_Model.md`, and switch it on when the second product arrives.

---

## Anti-patterns

- **BCG matrix as the whole strategy.** Treating the 2×2 as the decision instead of a screen — especially reflexively killing "Dogs" without diagnosing discoverability, usability, or strategic fit first.
- **Annual / quarterly-only allocation via static spreadsheets.** Locking capacity once a year while the market moves weekly. Allocation is continuous and reversible-where-possible.
- **Output / feature-count roadmaps at the portfolio level.** Judging products by what they shipped or how many products exist, not by the outcomes (`MET-*` trends) they moved.
- **Sunk-cost / escalation of commitment.** Pouring capacity into a declining product because of what's already been spent. Exit criteria set *up front* are the antidote; "Kill" is a valid, often valuable, decision.
- **Allocation by lobbying (HiPPO).** Capacity flowing to the loudest sponsor rather than to strategic value and lifecycle fit — the portfolio-scale version of opinion-driven prioritization.
- **Killing on a single low-usage number** without investigating context (discoverability/onboarding), or treating shutdown as the finish line and ignoring data lifecycle obligations — both handed off and handled in [P16 Sunset](../../.claude/skills/pm-phase-16-sunset/).

---

## References

- Product portfolio optimization — Product School: https://productschool.com/blog/product-fundamentals/product-portfolio-optimization
- Product portfolio management 101 — Productboard: https://www.productboard.com/blog/product-portfolio-management-101/
- BCG Growth-Share Matrix (screen, not strategy) — airfocus: https://airfocus.com/glossary/boston-consulting-group-growth-share-matrix/
- AI strategic portfolio management platforms — Planisware: https://planisware.com/resources/strategic-planning-alignment/what-top-6-ai-strategic-portfolio-management-platforms
- Sunk-cost fallacy / escalation of commitment — Asana: https://asana.com/resources/sunk-cost-fallacy
- How to kill innovation (Kill decisions as a win) — SVPG: https://www.svpg.com/how-to-kill-innovation/
- Workflow conventions (IDs, gates, outcomes-over-outputs): [`../05_Conventions.md`](../05_Conventions.md)

---
*Owning artifact:* `_threads/Portfolio_View.md` · *Feeds:* [P16 Sunset](../../.claude/skills/pm-phase-16-sunset/) · *Companion threads:* [Stakeholder Management](Stakeholder_Management.md), [Responsible Product](Responsible_Product.md) · *Kept alive by:* every phase skill at loop step 7 ([Protocol §7](../02_AI_Product_Manager_Protocol.md)) · *Conforms to* [`../05_Conventions.md`](../05_Conventions.md).
