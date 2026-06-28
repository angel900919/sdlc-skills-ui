---
name: pm-phase-00-charter
description: Runs Phase 00 (Product Charter & Operating Setup) — the pre-Strategy wrapper that agrees the mandate and the way of working before any product thinking starts. It interviews the user one topic at a time about product identity, the tailoring profile (Solo-Lean / Standard / Enterprise), the mandate (problem space, target segment, sponsor, why-now), the outcome-level success definition, the team and product trio, the stakeholder map (Mendelow power/interest + RACI), the operating cadence (continuous/dual-track, Lean Startup, Scrum, Kanban, Stage-Gate), tooling/source-of-truth, and the responsible-product floor — then produces Product_Charter.md, Operating_Model.md, and Stakeholder_Map.md and opens the six cross-cutting thread registers. Its exit gate is G0 Kickoff. Conforms to ../../05_Conventions.md. Use it when the user wants to kick off a product or initiative, write a product charter, set the operating model/cadence, build a stakeholder map, define decision rights (RACI), set the tailoring profile, or run phase 0 / charter / kickoff. Triggers on phrasings like "be my AI product manager for <product>", "start a new product/initiative", "write a product charter", "phase 0 / kickoff / G0", "set up the operating model", "build a stakeholder map", "who's the sponsor and the product trio", "what cadence should we run", "set decision rights / RACI".
disable-model-invocation: true
user-invocable: true
---

# Phase 00 — Product Charter & Operating Setup

<what-to-do>

Agree the **mandate** (problem space, target segment, sponsor, outcome-level success) and the **way of working** (operating cadence, decision rights, tooling, responsible-product floor) so the team is authorised and aligned *before* any strategy or discovery work begins; produce `Product_Charter.md`, `Operating_Model.md`, and `Stakeholder_Map.md`, and open the six cross-cutting thread registers. The exit gate is **G0 — Kickoff** (charter agreed; team, mandate, success definition, and operating cadence set). This phase conforms in full to [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) for all IDs, gates, severities, status strings, the traceability spine, and the canonical framework citations — it does not redefine them.

**When this phase applies.** Run it for *any* new product or major initiative that needs an aligned, authorised start. A **feature inside an existing product does not restart at P00** — re-enter at the phase that fits (usually `pm-phase-03-discovery` or `pm-phase-08-prd`); Overview §6. For a Solo/Lean 0→1 effort, **tailor to a one-page charter** (mandate + one outcome + the trio + a cadence), but never skip it silently: an unowned, outcome-less, "managed-up" kickoff is the root of the feature factory. It always precedes `pm-phase-01-strategy`.

## Inputs (from prior phases)
Phase 00 is the **first** phase, so there are no prior-phase artifacts. Read these if they exist; otherwise elicit and flag the source:
- **Sponsor brief / mandate** — a one-line "we want to build X for segment Y," an exec ask, an OKR handed down, or a problem statement. If none exists, this is a self-initiated bet: record it and name the would-be sponsor as a `TODO:`.
- **Company / portfolio strategy** — if a parent strategy or portfolio exists, this product *inherits* it; cite it (`Source: company strategy`) rather than re-authoring it. Coherence with it is a G1 (not G0) check, but capture the link now.
- **Org assets** — existing tool standards, a research repository, a decision-log/risk-register convention, a privacy/accessibility policy. Reuse and cite them; do not re-invent.
- If absolutely nothing is provided, proceed from a blank slate and mark every unknown as `TODO: <what's owed, by whom>`.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, not a wall of questions). Use `AskUserQuestion` for finite choices. **Show back** each answer before advancing. Reuse every fact already given; never re-ask. Mark anything the user cannot answer as `TODO: <owed, by whom>` — never invent a sponsor, segment, metric, date, or tool name.

1. **Product identity & output location** (one message — these are clearly related): product name (long form) + kebab-case **slug** (drives the folder and every `Document ID` per Conventions §6); one-line "what we're building and for whom"; product **stage** (idea / 0→1 / growth / mature / sunset). Default `<output-dir>` = `./<slug>/00_Charter/`. Confirm once; reuse for every later phase.
2. **Tailoring profile** (`AskUserQuestion`, single-select on the triplet → one profile): *Solo / Lean* · *Standard* · *Enterprise / Formal* — drive it from stage, team size, and risk/regulation (Tailoring Guide). Record the profile; every later phase right-sizes to it. A tailored-out phase/artifact is logged as `tailored out: <reason>` (Conventions §1) — never dropped silently.
3. **Mandate & problem space** (free text, **problem not solution**): the problem space we're chartered to address, the **target segment**, the **sponsor** (who wants this and will fund/unblock it), and **why now**. If the user jumps to a solution, capture it as a *seed* and steer back — solution discovery is P03/P04/P07.
4. **Success definition (outcome-level).** Elicit the customer/business **outcome** that would make this worth doing — the seed for `OBJ-*`/`KR-*` in `pm-phase-01-strategy`. Push for an outcome (a moved metric), not an output (features shipped); Conventions §7. If no metric is nameable yet, write `TODO: success metric owed` plus a recommendation — do not invent a target.
5. **Team & the product trio.** Name the PM, the **product trio** (PM + design + eng), the sponsor, and key delivery/partner roles (PMM, data, legal/privacy, support). Empowered-team default: a trio that owns the outcome, not a feature-taking project team.
6. **Stakeholder map** (`STK-<nn>`). Map *before* managing: for each `STK-<nn>` capture name/role, **power** and **interest** (Mendelow grid), stance/disposition, what they need, and a comms cadence. Frame this as **collaboration and shared problems, not control** — colleagues are co-owners, not people to "manage up." This is a **Living** artifact.
7. **Decision rights (RACI).** For the big calls (strategy sign-off, gate decisions, scope, go/no-go) set a RACI with **exactly one Accountable** each. Record the decision-log convention: every consequential call is a `DEC-<nn>` in `_threads/Decision_Log.md`.
8. **Operating cadence** (`AskUserQuestion`, single-select): *Continuous / Dual-track (default)* · *Lean Startup loop* · *Scrum* · *Kanban* · *Stage-Gate* (Overview §7). Capture the review/planning rhythm (weekly discovery touch → product reviews → planning). **SAFe is a scaling overlay, not a base cadence** — only if org size truly demands it.
9. **Tooling & source of truth.** Name the small **connected stack (3–5 tools)** for discovery repo, analytics, delivery, and docs, and the **single source of truth** for product artifacts. Default to `TODO: confirm org standard` rather than inventing tool names. Resist tool sprawl; standardise the *how*, not the *what*.
10. **Responsible-product floor.** Set the **non-negotiable floor** now, not at launch: privacy-by-design (GDPR Art. 25), accessibility (WCAG 2.2 AA / EAA — enforceable EU law), and — **if AI is in the product** — AI-transparency duties (EU AI Act Art. 50) and human-in-the-loop for consequential automated decisions. Log any opening risk as `RSK-<nn>`.
11. **Write `<output-dir>/Product_Charter.md`** — frontmatter per Conventions §6 (`Document ID: CHARTER-<SLUG>-v0.1`, `Status: Draft`), then the sections in *Deliverables & output shapes* below.
12. **Write `<output-dir>/Operating_Model.md`** — frontmatter (`Document ID: OPMODEL-<SLUG>-v0.1`, `Status: Draft`), cadence + decision rights + tooling + thread cadence.
13. **Write `<output-dir>/Stakeholder_Map.md`** — frontmatter (`Document ID: STKMAP-<SLUG>-v0.1`, `Status: Living`), the `STK-*` table.
14. **Open the six thread stubs (stubs only).** Create `<output-dir>/../_threads/` stubs so threads are alive from gate one: `Decision_Log.md` (`DEC-*`), `Risk_Register.md` (`RSK-*`), `Responsible_Product_Review.md`. Don't populate fully — just open them.
15. **Exit-gate (G0) check.** Print the Exit-gate checklist below and confirm each item. G0 is a real decision (*Persevere · Persevere-with-actions · Pivot · Hold · Kill*) — if mandate/sponsor/success is unconfirmed, record **Persevere-with-actions** with owned `TODO:`s rather than a blank pass.
16. **Done.** Print all three output paths and recommend the next step: invoke `pm-phase-01-strategy` to turn the mandate into vision, strategy, North Star, and OKRs (toward G1).

## Decision points
- **New product vs. feature in an existing one.** *How to decide:* is there an existing product with a strategy and trio? If yes, **don't run P00** — re-enter at `pm-phase-03-discovery` (new bet) or `pm-phase-08-prd` (validated change). P00 is for a new product/initiative or a re-charter.
- **Tailoring profile — Solo-Lean vs Standard vs Enterprise.** *How to decide:* small/low-risk 0→1 → Solo-Lean (one-page charter, threads as checklists); most commercial products → Standard; large/regulated/high-stakes → Enterprise (full artifact set, formal gates, full responsible-product evidence).
- **Operating cadence.** *How to decide:* default to **Continuous/Dual-track** for modern software teams; Lean Startup loop pre-PMF/high-uncertainty; Scrum for a steady delivery heartbeat; Kanban for unpredictable, support/ops-heavy flow; Stage-Gate for hardware/regulated/capital-heavy. Record the choice and *why* in `Operating_Model.md`.
- **What to set now vs. defer.** *How to decide:* if a fact binds the *mandate or the way of working* (sponsor, segment, outcome, cadence, decision rights, the responsible floor), capture it here; if it belongs to *strategy/discovery/solution* (vision, OKRs, personas, requirements), record only a "seed" and cross-reference the owning phase.
- **G0 verdict.** *How to decide:* mandate + team + success-definition + cadence all set → Persevere. Any in flight → Persevere-with-actions with owned `TODO:`s. No sponsor / no fundable mandate → Hold/Kill. A vague problem that's really the wrong problem → Pivot the mandate. Record the verdict explicitly; an unrecorded gate is a failed gate.

## Rules
- **Conform to Conventions for everything shared** — IDs (`STK-*` and `DEC-*` here; `OBJ/KR`, `OPP/INS`, `RSK` are *seeded*, assigned by their owning phase), gate names, status strings, document frontmatter, and §8 framework citations. Never restate or redefine them; cite the section.
- **Outcomes over outputs.** The charter's success definition is an outcome (a moved metric), never a feature list (Conventions §7). A charter that lists deliverables but no outcome has failed its own gate.
- **AI accelerates; the human decides.** AI drafts the charter, the stakeholder map, and tailored comms; the human owns the mandate, the bet, the trade-offs, the ethics, and accountability. *Amplify your thinking, don't abdicate it.*
- **One topic at a time; reuse prior facts; never re-ask.** Carry slug, stage, tailoring profile, sponsor, and trio into every later phase.
- **Mark unknowns, don't invent.** Every missing sponsor/segment/metric/date/tool is `TODO: <owed, by whom>`.
- **Pivot and Kill are valid at G0.** Chartering the wrong problem, or one with no sponsor or no fundable outcome, should Hold/Pivot/Kill — not get a rubber-stamp. The cheapest failed product is the one a kickoff stopped.
- **Cross-reference, don't re-define.** Vision/OKRs → P01; opportunities/evidence → P03/P04; metrics instrumentation → P12. P00 only *frames* and *seeds* them.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../../pm-workflow/templates/) (`Product_Charter.md`, `Operating_Model.md`, `Stakeholder_Map.md`). Each carries the Conventions §6 frontmatter block.

### `Product_Charter.md` — required sections
1. **Identity** — name, slug, one-liner, stage, tailoring profile.
2. **Mandate & problem space** — the problem we're chartered to address; target segment; **why now**. (Problem, not solution.)
3. **Outcome-level success** — the customer/business outcome that makes this worth doing → seeds `OBJ-*`/`KR-*` in P01. Unknown = `TODO:`.
4. **Team & trio** — PM, product trio (PM/design/eng), sponsor, key partners.
5. **Scope of mandate** — in scope / out of scope / explicitly later; `tailored out: <reason>` for any dropped phase/artifact.
6. **Responsible-product floor** — privacy / accessibility / AI-transparency / security commitments; opening `RSK-*`.
7. **Assumptions, constraints & open items** — imposed limits (budget, platform, deadline, mandated tech/regulation) + the `TODO:` register with owner + due.

### `Stakeholder_Map.md` — required sections
1. **Stakeholder register** — `STK-<nn>` table (below).
2. **Power/Interest grid** — Mendelow placement (Manage closely / Keep satisfied / Keep informed / Monitor).
3. **Decision rights (RACI)** — the big calls, **exactly one Accountable** each.
4. **Comms plan** — per quadrant: channel, cadence, message style (BLUF for execs: decision + trade-off + ask up front).

### Compact charter + stakeholder skeleton (copy, then replace every value)
```markdown
---
Document: Product Charter — <Product>
Document ID: CHARTER-<SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## 2. Mandate & problem space
Problem: <problem in the customer's world> · Segment: <target> · Why now: <trigger>
## 3. Outcome-level success
Outcome: <what changes for customer/business> · Signal: TODO: success metric owed (→ OBJ/KR in P01)
## 4. Team & trio
PM: <name> · Design: <name> · Eng: <name> · Sponsor: <name/TODO> · Partners: <PMM, data, legal>
## 6. Responsible-product floor
Privacy-by-design (GDPR Art.25) · Accessibility WCAG 2.2 AA / EAA · AI transparency (Act Art.50, if AI) → RSK-01
```
```markdown
## Stakeholder register
| ID | Stakeholder / role | Power | Interest | Stance | Needs | Cadence |
|---|---|---|---|---|---|---|
| STK-01 | <Sponsor / VP> | High | High | Champion | Outcome + risk view | Weekly 1:1 (BLUF) |
| STK-02 | <Eng lead> | Med | High | Supportive | Context + constraints | Trio sync |
## Decision rights (RACI — one A each)
| Decision | R | A | C | I |
|---|---|---|---|---|
| Gate go/no-go | PM | Sponsor | Trio | Org |
```
> The names/cadences above are **placeholders** — do not ship them; replace or mark `TODO:`.

## AI prompt pack
Copy-paste and fill the `<>` slots. (Pair with [`../../prompts/`](../../../pm-workflow/prompts/).)

- **ELICIT —** "You are my AI product manager running Phase 00. Ask me, **one topic at a time**, the questions needed to fill a Product Charter, an Operating Model, and a Stakeholder Map for `<product>` (stage `<idea/0→1/growth>`). Start with product identity and the tailoring profile. After each answer, reflect it back, mark anything I can't answer as `TODO:`, and move on. Do not invent a sponsor, segment, metric, or tool."
- **GENERATE —** "Using my answers above and the section shapes in this skill, draft `Product_Charter.md` with Conventions §6 frontmatter (`Document ID: CHARTER-<SLUG>-v0.1`, `Status: Draft`). Make the success definition an **outcome (a moved metric)**, not a feature list. List any dropped phase as `tailored out: <reason>`. Seed — do not author — vision/OKRs (→ P01)."
- **CRITIQUE / RED-TEAM —** "Act as a skeptical sponsor challenging G0 Kickoff. Attack this charter + stakeholder map: Is success an outcome or a disguised feature list? Is there a real, funding sponsor or just a wish? Is the problem space confused with a solution? Does the RACI have exactly one Accountable? Is 'stakeholder management' here collaboration or managing-up theater? Is the responsible-product floor set now or deferred to legal/launch? List blocking gaps that should Hold or Pivot the gate."
- **GATE —** "Run G0 as a real decision, not a rubber stamp. Walk the Exit-gate checklist + the six-thread review; for each item mark Met / `TODO:` (owner+date) / Waived. Then recommend one of *Persevere · Persevere-with-actions · Pivot · Hold · Kill* with the evidence, and name the next command."

## Research & specialised-agent triggers
See [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md) for the standing playbook.
- **Customer interview — recommend when:** the mandate's *problem* or *segment* rests on assumption, not evidence. P00 doesn't validate the problem (that's G2), but if the charter is built on a guessed need, flag it and recommend `pm-phase-03-discovery` rather than chartering on air.
- **Web research — recommend when:** a **regulation/standard** is implied (GDPR, EU AI Act, EAA/WCAG, HIPAA, sector rules) and you must confirm its current edition and obligations for the responsible floor; a **competitor/market context** is needed to frame "why now" (defer real sizing to `pm-phase-02-market-research`); an **operating-cadence or product-ops practice** is unfamiliar. Confirm editions; never trust memory on compliance dates.
- **Specialised agent — spawn when:** a **stakeholder/comms agent** to parse an org chart into a power/interest map and draft per-audience BLUF updates; a **compliance-mapping agent** to enumerate which regulations a regulated/AI product pulls in and seed `RSK-*`; a **market-context agent** for a quick "why now" scan. Hand each agent the slug, stage, segment, and tailoring profile so its output threads into later phases.

## Cross-cutting hooks
Phase 00 **opens** all six threads (Conventions §10) that the rest of the workflow keeps alive and reviews at every gate:
- **Stakeholders & Communication** *(this is P00's home thread)* — build the `STK-*` map, set RACI, open the `DEC-*` log; collaboration, not control. → [`../../cross-cutting/Stakeholder_Management.md`](../../../pm-workflow/cross-cutting/Stakeholder_Management.md).
- **Continuous Discovery** — set the weekly customer-touch cadence in the operating model so discovery is live from day one. → [`../../cross-cutting/Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md).
- **Metrics & Experimentation** — name the *intent* to measure the outcome; the North Star + instrumentation are P01/P12, seeded here. → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../../pm-workflow/cross-cutting/Metrics_and_Experimentation.md).
- **Product Ops** — choose the cadence, the 3–5-tool connected stack, and the single source of truth; ops *enables*, it doesn't decide. → [`../../cross-cutting/Product_Operations.md`](../../../pm-workflow/cross-cutting/Product_Operations.md).
- **Responsible Product** — set the privacy/accessibility/AI-transparency/security **floor** now; open `Responsible_Product_Review.md`. The floor is non-negotiable. → [`../../cross-cutting/Responsible_Product.md`](../../../pm-workflow/cross-cutting/Responsible_Product.md).
- **Portfolio** *(multi-product)* — record this product's place and lifecycle stage in the portfolio. → [`../../cross-cutting/Portfolio_Management.md`](../../../pm-workflow/cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Pinned to P00 in [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md); full cards in [`../../frameworks/`](../../../pm-workflow/frameworks/):
- **RACI** — decision rights for the big calls; exactly one Accountable.
- **Mendelow Power/Interest grid** — stakeholder mapping and comms quadrants.
- **Product Operating Model + product trio** (Cagan/SVPG) — empowered, outcome-owning team vs. feature/project team.
- **Operating-cadence menu** — Continuous/Dual-track · Lean Startup · Scrum · Kanban · Stage-Gate (Overview §7); SAFe is a scaling overlay, not a base cadence.
- **Tailoring profiles** — Solo-Lean / Standard / Enterprise (Tailoring Guide).
- **BLUF executive comms** — decision + trade-off + ask up front.

## Exit-gate checklist
G0 — Kickoff (copied verbatim from [`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md); if they ever disagree, that file wins):
- [ ] Product/initiative named; slug + folder created; stage and tailoring profile set ([Tailoring Guide](../../../pm-workflow/04_Tailoring_Guide.md)).
- [ ] Mandate clear: problem space, target segment, sponsor, and the team (esp. the product trio).
- [ ] Success defined at the mandate level (what outcome would make this worth doing?).
- [ ] Operating cadence chosen (continuous/dual-track, Scrum, Kanban, Stage-Gate) and tooling/source-of-truth set.
- [ ] Initial stakeholder map (`STK-*`) with influence/interest; decision rights named (RACI for the big calls).

> Plus the **every-gate six-thread review** (gate-reviews.md): stakeholders/decisions logged · discovery cadence set · metric intent named · ops artifacts in the source of truth · responsible-product floor set · portfolio placement (multi-product). Record the verdict: *Persevere · Persevere-with-actions · Pivot · Hold · Kill*.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Success defined as a feature list ("ship X, Y, Z") | Output thinking, not outcome thinking | State the customer/business **outcome** (a moved metric); seed `OBJ/KR` for P01; Conventions §7. |
| "Stakeholder management" = managing-up persuasion theater | Treating colleagues as people to control | Reframe as **collaboration / shared problems / co-ownership** (SVPG); map power/interest, then partner. |
| RACI with multiple "A"s (or none) | Decision rights left fuzzy | Exactly **one Accountable** per decision; log calls as `DEC-*`. |
| Heavy process / product-ops stood up day one | Over-engineering a small product | Right-size to the tailoring profile; process serves outcomes, not the reverse; record `tailored out:`. |
| Tool sprawl (8 loosely-related tools) | No deliberate stack choice | Pick a **connected 3–5-tool stack** + one source of truth; standardise the *how*, not the *what*. |
| Responsible-product deferred to legal / to launch | "Compliance is future, not now" | Set the **floor at kickoff** — privacy by design, WCAG/EAA (enforceable EU law), AI Act Art.50 transparency (bites Aug 2026). |
| Cadence chosen by default or cargo-cult (SAFe everywhere) | Picked a process without fit | Choose deliberately per Overview §7; SAFe only when scale truly demands it. |
| Charter invents a sponsor / segment / metric | Filling blanks to look complete | Replace with `TODO: <owed, by whom>` + a recommendation to confirm or research. |
| Feature work restarts the whole lifecycle at P00 | Misreading the phase backbone | Re-enter at `pm-phase-03-discovery` or `pm-phase-08-prd`; P00 is for a new product/re-charter only. |

## References
- [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) — the contract (IDs incl. `STK-*`/`DEC-*`, the G0–G10 ladder, status strings, frontmatter, §8 citations, the traceability spine).
- [`../../01_Workflow_Overview.md`](../../../pm-workflow/01_Workflow_Overview.md) — the dual-track/double-diamond spine, the cadence menu (§7), and feature re-entry (§6).
- [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md) · [`../../04_Tailoring_Guide.md`](../../../pm-workflow/04_Tailoring_Guide.md) — frameworks pinned to P00 and the Solo-Lean/Standard/Enterprise profiles.
- 2026 research (Product Ops): SVPG product ops overview — https://www.svpg.com/product-ops-overview/ · Productboard *State of Product Ops 2025* — https://www.productboard.com/blog/the-state-of-product-ops-in-2025/ · Reforge operating cadence — https://www.reforge.com/blog/operating-cadence
- 2026 research (Stakeholders / AI-native / Responsible): SVPG *product vs. feature teams* (collaboration not control) — https://www.svpg.com/product-vs-feature-teams/ · Lenny Rachitsky, *how AI will impact PM* — https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management · GDPR Art. 25 (privacy by design) — https://gdpr-info.eu/art-25-gdpr/ · OneTrust EAA + WCAG 2.2 — https://www.onetrust.com/blog/understanding-the-european-accessibility-act-and-wcag-22/
- Curriculum: [`../../../PM_Final_WF/01-product-strategy-playbook.md`](../../../PM_Final_WF/01-product-strategy-playbook.md) — strategy/charter foundations feeding P01.
- Related phases: `pm-phase-01-strategy` (next — vision, strategy, North Star + OKRs at G1); `pm-phase-03-discovery` / `pm-phase-08-prd` (feature re-entry points); `pm-phase-05-roadmap` (consumes the outcome + cadence); `pm-phase-12-analytics` (instruments the outcome seeded here).

</supporting-info>
