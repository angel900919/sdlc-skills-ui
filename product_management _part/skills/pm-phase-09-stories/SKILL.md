---
name: pm-phase-09-stories
description: Runs Phase 09 (User Stories & Acceptance Criteria) — turns an approved PRD and a validated solution into a ready, testable, vertically-sliced backlog. Builds a story map (Patton), writes INVEST user stories as conversation-starters traced to FEAT-/REQ-/OPP-, co-authors testable acceptance criteria (AC-, Given/When/Then) with the Three Amigos including negative/boundary/accessibility/privacy cases, and agrees a light Definition of Ready + a Definition of Done that links to the outcome metric. Produces Story_Map.md, User_Stories.md (with AC-*), and DoR_DoD.md. Conforms to ../../05_Conventions.md. Use when you have a G6-approved PRD and need a plannable backlog, want to slice an MVP into stories, write or critique acceptance criteria, build a story map, or set DoR/DoD before delivery. Triggers on phrasings like "write user stories", "slice the story map", "acceptance criteria", "Given/When/Then", "Gherkin", "INVEST", "Definition of Ready/Done", "split this story", "make the backlog ready", "phase 9 stories", "G7 backlog ready".
disable-model-invocation: true
user-invocable: true
---

# Phase 09 — User Stories & Acceptance Criteria

<what-to-do>

Turn the **G6-approved PRD** and the **G5-validated solution** into a backlog a delivery team can pull from without re-litigating scope — a sliced **story map**, **INVEST** user stories that are *placeholders for conversations* (not specs), **testable acceptance criteria** (`AC-*`), and a shared **Definition of Done** whose "done" points back to an outcome metric, not a closed ticket. The exit gate is **G7 · Backlog Ready** — decision **Persevere · Persevere-with-actions · Pivot · Hold · Kill** ([Conventions §2](../../05_Conventions.md)). Conform to [`../../05_Conventions.md`](../../05_Conventions.md) for IDs (`US-`/`AC-`), the gate ladder, severity, status/frontmatter, the traceability spine, and folder layout — **cite the section, never redefine it**.

> **Prime directive (Conventions §7):** outcomes over outputs. A story with no line back to an `OPP-`/`OBJ/KR` and no `MET-` in its Definition of Done is feature-factory output — refuse it or mark the gap `TODO:`. The backlog serves a validated bet, not a wish list.

## Inputs (from prior phases)
Read these from the project tree ([Conventions §9](../../05_Conventions.md)) first; if one is missing, elicit + flag the source, and if a **gating** input is absent, route back. **Cross-reference by ID — never re-describe** (Conventions §4).
- **PRD + NFR checklist** (`FEAT-`, `REQ-<class>-`, MoSCoW scope, the outcome/success `MET-`) — from `pm-phase-08-prd` (G6). **If absent → STOP, route to `pm-phase-08-prd`.** No approved spec = nothing to slice.
- **Validated solution + riskiest assumptions** (`SOL-`, `ASM-`) — from `pm-phase-07-solution-design` (G5). Stories implement a solution that passed desirability/usability/feasibility/viability — not an unvalidated idea.
- **Opportunity + outcomes** (`OPP-`, `OBJ/KR-`) — from `pm-phase-04-opportunity` / `pm-phase-01-strategy`; the "so that…" of every story.
- **Roadmap Now item** (`RMI-`) — from `pm-phase-05-roadmap`; the slice in flight.
- **Personas / JTBD** (`PER-`, `JOB-`) — from `pm-phase-03-discovery`; the real actor in "As a `<PER->`…". If a persona is invented (no research), flag it — `pm-phase-03-discovery` owns the fix.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, never a wall of questions). Use `AskUserQuestion` for finite choices. **Show back** every drafted story/AC for confirmation before writing. Reuse every fact already in the tree; never re-ask. Mark anything unknown as `TODO: <what is owed — by whom — by when>` — never invent a persona quote, a threshold, an estimate, or an edge case as if it were validated.

1. **Identity & output location** (one message, related): confirm the project **slug**, the `FEAT-`/`RMI-` this backlog serves, and the target outcome (`OBJ/KR-` + `MET-`). Default `<output-dir>` = `<product-slug>/09_Backlog/`.
2. **Story map first** (Patton). Lay the **backbone** left→right as user activities/steps in journey order; hang tasks/details top→bottom by priority. Identify one **coherent end-to-end slice** — the smallest walking skeleton that delivers the outcome (maps to the PRD's MVP/MoSCoW line). Slices are releases, not layers.
3. **Write stories — vertically sliced, INVEST.** "As a `<PER->` I want `<capability>` so that `<OBJ/KR- outcome>`" is a *starter for a conversation* (3 C's), not the deliverable. Each `US-` is Independent, Negotiable, Valuable, Estimable, Small, Testable, and traces to a `FEAT-`/`REQ-`/`OPP-`. **No horizontal/technical stories** (no "build the API" / "frontend for X").
4. **Co-author acceptance criteria — Three Amigos** (PM + design + eng/QA together, *before* dev). `AC-` is scoped to its `US-`; write **Given/When/Then declaratively** (what, not how) where it adds clarity, a checklist where it doesn't. Force the unhappy paths: **negative · boundary · error/empty · accessibility (WCAG) · privacy/security**. AC defines per-story behavior; DoD is the cross-story bar — keep them distinct.
5. **Split oversized stories** with proven patterns (SPIDR / Humanizing Work: workflow steps, business-rule variations, happy-vs-error path, data variations, interface variations) — keep each slice vertical and valuable. Never split into front/back-end tasks.
6. **Definition of Ready — light readiness, not a gate.** A short shared check (clear, valued, AC drafted, dependencies known), *not* a rigid hand-off contract. **Definition of Done** is the team's quality bar for the Increment and **must include instrumentation + the `MET-` link** and the responsible-product floor (accessibility/privacy/security checks).
7. **Right-size & forecast flow — not velocity theater.** Agree sizing or an explicit **#NoEstimates** right-sizing flow; prefer **Monte Carlo over throughput / flow metrics (Little's Law)** for "when". Never normalize story points across teams or report points as a KPI; don't equate points with hours.
8. **Responsible-product + AI red-team pass.** Have the AI surface *missing* negative/boundary/WCAG/OWASP cases as candidate `AC-`; you validate each against real behavior (AI-suggested edge cases are hypotheses, not coverage). Log new `RSK-`.
9. **Write artifacts** to `<output-dir>` with Conventions §6 frontmatter: `Story_Map.md` (`Living`), `User_Stories.md` (with `US-`/`AC-`), `DoR_DoD.md`. Update `_threads/Decision_Log.md` (`DEC-` for sizing-flow/slice calls) and `Risk_Register.md` (`RSK-`).
10. **Exit-gate (G7) check.** Walk the every-gate six-thread review, then the G7 block. Record the decision in `WORKFLOW.md` + `_threads/Decision_Log.md` (`DEC-`).
11. **Done.** Print all output paths; recommend next: `pm-phase-10-delivery` (build → G8). For a backlog read-out, the Stakeholder thread.

## Decision points
- **Is the PRD approved?** *How to decide:* G6 must be passed and the MoSCoW/MVP line held. If not → **STOP**, route to `pm-phase-08-prd`; don't write stories against a moving spec.
- **Vertical slice vs. layer.** *How to decide:* if a story delivers no observable user/business value on its own, it's a task or a horizontal split — re-slice with SPIDR until each slice is demoable end-to-end.
- **DoR depth.** *How to decide:* keep it a *conversation* unless the team is genuinely blocked by half-baked items; a strict gated DoR is an anti-pattern that stalls flow. Right-size to the tailoring profile.
- **Estimate or #NoEstimates.** *How to decide:* if right-sizing + throughput gives a credible forecast, skip points; estimate only where the team needs it to plan — never to compare teams or feed a KPI.
- **AC granularity.** *How to decide:* enough to make the story testable and unambiguous, no more. Exhaustive upfront AC authored by one person in isolation is waste — Three Amigos, just-in-time.
- **G7 verdict.** *How to decide:* map exists + slice identified + top stories INVEST with testable AC + DoD links a `MET-` + first sprint(s) plannable → **Persevere**. Minor gaps with owners+dates → **Persevere-with-actions**. Evidence that the slice solves the wrong thing → **Pivot** back to `pm-phase-07-solution-design`/`pm-phase-04-opportunity`.

## Rules
- **Conform to Conventions, never redefine.** Gate ladder + G7 §2, IDs (`US-`/`AC-`/`DEC-`/`RSK-`) §3, traceability spine §4, severity §5, frontmatter/status §6 — cite the section.
- **Outcomes over outputs.** Every `US-` traces up to an `OPP-`/`OBJ/KR-`; "done" (DoD) points to a `MET-` ([Conventions §7](../../05_Conventions.md)).
- **AI accelerates, the human decides.** AI drafts stories/AC/Gherkin and flags edge cases; the human owns slicing judgment, value claims, customer truth, and the gate ([Conventions §11](../../05_Conventions.md)). Never let an AI-generated story or AC stand in for talking to users.
- **Story = conversation, not contract.** The "As a…" template is a starter (3 C's: Card/Conversation/Confirmation); the shared understanding is the deliverable.
- **Slice vertically; never horizontally.** No frontend/backend/technical-layer stories.
- **Never invent.** Unknown persona, threshold, or edge case = `TODO:` + a recommendation to research or interview.
- **Pivot & Kill are valid outcomes.** A backlog built on a wrong slice should be re-cut, not shipped.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
All files carry the [Conventions §6](../../05_Conventions.md) frontmatter block. Blank templates live in [`../../templates/`](../../templates/).

- **`Story_Map.md`** ★ (`Living`) — backbone of user activities × prioritized detail, with release slices marked (the MVP walking skeleton first).
- **`User_Stories.md`** ★ gating — the `US-` list with per-story `AC-`, traces, sizing/flow tag.
- **`DoR_DoD.md`** — the light Definition of Ready check + the Definition of Done (incl. instrumentation + `MET-` link + responsible-product floor).

### `User_Stories.md` skeleton (copy, then replace every value)
```markdown
---
Document: User Stories — <Product / Feature>
Document ID: US-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## US-01 — <short title>
**As a** PER-__ **I want** <capability> **so that** <OBJ/KR-__ outcome>.
- Traces: FEAT-__ · REQ-<class>-__ · OPP-__ · MET-__ · slice: <release-1>
- Size: <S/M/L or #NoEstimates flow>  ·  MoSCoW: <Must/Should/Could>
**Acceptance criteria**
- AC-01 — **Given** <context> **When** <action> **Then** <observable outcome>.
- AC-02 — (negative) **Given** <invalid/empty> **When** <action> **Then** <safe failure + message>.
- AC-03 — (a11y/privacy) <WCAG 2.2 / consent / data-handling criterion> — TODO: confirm WCAG target.
```
> Skeleton values are **placeholders** — replace or mark `TODO:`; never ship them.

### `Story_Map.md` skeleton
```markdown
---
Document: Story Map — <Product / Feature>
Document ID: MAP-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
| Backbone (activity) → | <Activity A> | <Activity B> | <Activity C> |
|---|---|---|---|
| **Release 1 (MVP slice)** | US-01 | US-03 | US-05 |
| **Release 2 (Next)** | US-02 | US-04 | — |
```

## AI prompt pack
Copy-paste and fill the `<>` slots. Pair with [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md).
- **ELICIT —** "You are my AI-PM partner running Phase 09 for `<feature>`. Interview me **one topic at a time** toward a story map + INVEST stories + acceptance criteria. Start from this PRD `<paste FEAT-/REQ-/MET->`. Reflect each answer back, trace every story to an `OPP-`/`OBJ/KR-`, mark gaps `TODO:`, and refuse any story with no outcome link. Invent no personas or edge cases."
- **GENERATE —** "From `<paste PRD / FEAT->`, draft vertically-sliced INVEST user stories with `US-nn | As a PER-_ | I want | so that OBJ/KR-_ | traces`. For each, draft acceptance criteria as `AC-nn` in Given/When/Then, covering happy path **plus** negative, boundary, error/empty, **accessibility (WCAG 2.2)** and **privacy/security** cases. Flag any story that isn't independently valuable or testable."
- **SPLIT —** "This story is too big: `<paste US->`. Split it using SPIDR / Humanizing-Work patterns (workflow steps · business-rule variations · happy-vs-error · data variations · interface variations). Keep every slice vertical, valuable, and demoable. Do NOT split into frontend/backend tasks."
- **CRITIQUE / RED-TEAM —** "Act as a hostile reviewer at the G7 gate. Attack this backlog `<paste>`: which stories are horizontal/technical? Which AC are vague adjectives, not testable behavior? Which miss negative/boundary/WCAG/OWASP cases? Which lack an outcome `MET-` in DoD? Any persona invented without research? Return a table: finding | severity (S1–S4) | story | why it matters | fix. End with the question this backlog can't answer."
- **GATE —** "Run the G7 · Backlog Ready checklist below against this map + stories. For each item: Pass / Gap (owner+date) / Waived. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill with the evidence."

## Research & specialised-agent triggers
Per [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md):
- **Talk to a customer (Part A)** when a story's value claim or a persona's "so that…" rests on assumption, or when refinement surfaces a new need — continuous-discovery weekly touch; capture `INS-`/`OPP-`, hold the story at `TODO:` until evidence is in. **AI-drafted stories never substitute for user contact.**
- **Web research / Context7 (Part B)** when an AC depends on a binding standard — **WCAG 2.2 AA / EN 301 549**, GDPR consent, OWASP cases, or a regulated-vertical rule. Never assert a standard from memory; cite version + obligation, hold the AC at `TODO: confirm`.
- **Spawn an agent (Part C):** a **research-synthesis** agent to theme refinement notes into candidate `OPP-`/stories (you verify against raw notes); an **adversarial-reviewer** agent for the G7 red-team; a **calc-verification** agent for any Monte Carlo / throughput forecast. Outputs are inputs to verify, not truth.

## Cross-cutting hooks
Phase 09 seeds/feeds these threads (reviewed at G7):
- **Continuous Discovery** — stories *are* placeholders for conversations; refinement spins out new `INS-`/`OPP-` → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Metrics & Experimentation** — DoD links each slice to a `MET-`; instrumentation is part of "done" → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Responsible Product (floor)** — accessibility (WCAG 2.2), privacy/consent, and security AC are written *into* stories, not bolted on → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholders** — Three Amigos co-authoring; slicing/sizing calls logged as `DEC-` → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Product Ops** — backlog hygiene, refinement cadence, tool of record, flow metrics → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md).

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); cards in [`../../frameworks/`](../../frameworks/):
- **Story Mapping** (Patton) — arrange by journey to find a coherent slice.
- **INVEST** (Bill Wake) — the story refinement bar (a checklist, not a gate).
- **Gherkin / Given-When-Then** (BDD) — declarative AC; AC becoming executable test scaffolding.
- **SPIDR / Humanizing Work** — vertical splitting patterns.
- **Three C's + Three Amigos** — collaborative, just-in-time AC.
- **DoD / (optional) DoR**, **Epic→Feature→Story→Task**, **Monte Carlo / flow forecasting** (Little's Law), **MoSCoW** (scope).

## Exit-gate checklist
First run the **every-gate six-thread review** ([`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md)). Then **G7 — Backlog Ready** *(owner: P09 Stories)* — copied verbatim from the gate file (if they disagree, that file wins):
- [ ] Story map exists; a coherent end-to-end slice is identified.
- [ ] Top stories meet **Definition of Ready**; each is **INVEST** and has testable **acceptance criteria** (`AC-*`, Given/When/Then where useful).
- [ ] **Definition of Done** agreed and includes instrumentation + the outcome metric link.
- [ ] Estimates/sizing or explicit #NoEstimates flow agreed; first sprint(s) plannable.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| "As a… I want…" treated as a mandatory rigid spec | Template mistaken for the deliverable | Story = card for a conversation (3 C's); shared understanding is the goal. |
| Exhaustive AC written upfront by a BA/PO alone | Hand-off culture, no collaboration | Three Amigos, just-in-time AC before dev. |
| Horizontal/technical stories ("build the API") | Slicing by architecture layer | Slice **vertically** end-to-end; re-split with SPIDR. |
| A strict, gated Definition of Ready stalls flow | DoR turned into a contract | Keep DoR a light readiness *conversation*, not a gate. |
| Story points compared across teams / used as a KPI | Velocity theater; points=hours | Right-size + flow metrics; **Monte Carlo** forecasting; #NoEstimates is valid. |
| Backlog is a feature list with no outcomes | Feature-factory reflex | Trace every `US-` to `OPP-`/`OBJ/KR-`; DoD links a `MET-`. |
| Hallucinated AC / over-trusting AI test coverage | Treating AI output as truth | Human validates every AI edge case against real behavior. |
| Generic, interchangeable AI stories | No grounding in real users | Anchor in researched `PER-`/`JOB-`; talk to users (Part A). |
| Missing negative/boundary/a11y/privacy cases | Only the happy path written | Force unhappy paths + WCAG/OWASP AC; red-team prompt. |
| Assuming every item must be estimated | Estimation reflex | #NoEstimates / right-sizing where it adds nothing. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (gate ladder + G7 §2, IDs `US-`/`AC-` §3, traceability spine §4, severity §5, frontmatter §6, outcomes-over-outputs §7).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — dual-track / double-diamond context (P09 is the converge step of the solution diamond).
- [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md) — the canonical G7 block + six-thread review.
- **2026 research sources:** https://ones.com/blog/invest-criteria-scrum-user-stories-guide/ · https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/ · https://www.nngroup.com/articles/user-story-mapping/ · https://www.mountaingoatsoftware.com/blog/user-story-ai-prompt-pack · https://medium.com/agileopedia/a-definition-of-ready-is-an-anti-pattern-463e84463537 · https://www.55degrees.se/post/agile-forecasting-monte-carlo-simulations-and-flow-metrics
- **Related phases (by name):** `pm-phase-08-prd` (upstream — supplies the approved PRD/FEAT/REQ) · `pm-phase-07-solution-design` (validated SOL/ASM) · `pm-phase-05-roadmap` (the RMI in flight) · `pm-phase-10-delivery` (downstream — builds this backlog to G8) · `pm-phase-12-analytics` (instruments the DoD `MET-`).
- **Curriculum:** [`../../../PM_Final_WF/03-product-development-playbook.md`](../../../PM_Final_WF/03-product-development-playbook.md) — product-development playbook (stories → build).

</supporting-info>
