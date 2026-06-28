---
name: pm-phase-08-prd
description: Runs Phase 08 (Requirements & PRD) of the framework-agnostic product-management workflow — specify what to build, just enough and just in time. It memorialises validated discovery (it does not replace it), states the problem/target-user/outcome up top, sets explicit in/out/later scope (MoSCoW), writes testable requirements (`REQ-<class>-<nn>`) and features (`FEAT-<nn>`) with fit criteria, forces a one-line answer for every non-functional requirement (performance, reliability, accessibility/WCAG 2.2 AA, privacy/security, EU AI Act / EAA compliance, plus GenAI behaviour/eval/guardrail/fallback classes), ties scope to a success metric (`MET-*`) and the parent `OPP-*`/`OBJ`, and produces a `PRD.md` (or PR-FAQ / Shape-Up pitch) plus an `NFR_Checklist.md`. Conforms to ../../05_Conventions.md. Use when the user wants to write a PRD, a one-pager, a PR-FAQ, or a Shape-Up pitch, define MVP scope, list requirements and NFRs, spec a GenAI feature, or prepare for G6 build entry. Triggers on "write the PRD", "draft a spec", "PR-FAQ", "Shape Up pitch", "define MVP scope", "NFR checklist", "list requirements", "spec this feature", "prep for G6", "phase 8 PRD".
disable-model-invocation: true
user-invocable: true
---

# Phase 08 — Requirements & PRD

<what-to-do>
This phase turns a **validated solution** (from Phase 07) into a lean, signed-off specification of *what to build and why* — a `PRD.md` (or PR-FAQ / Shape-Up pitch) plus an `NFR_Checklist.md` — at the smallest weight that lets the team build the right thing. Its exit gate is **G6 — PRD Approved / Build Entry**. It conforms in full to [../../05_Conventions.md](../../05_Conventions.md) — all IDs, gates, requirement classes, severity/priority, status strings, the traceability spine, and framework citations come from there; this skill never redefines them. The PM is the **editor**, not the author: AI drafts from real evidence, the human owns scope, trade-offs, NFR thresholds, and the sign-off.

## Inputs (from prior phases)
- **`07_Solution/Solution_Validation.md`** — the validated bet `SOL-<nn>` and tested assumptions `ASM-<nn>`. The spine `SOL ──spec──▶ REQ/FEAT` starts here; a PRD with no parent `SOL`/`OPP` is a feature-factory artifact — stop and run discovery.
- **`07_Solution/Prototype_Plan.md` / prototype** — *prototype-as-spec* (Cagan): a hi-fi prototype often *is* the spec; reference it, don't re-describe pixels in prose.
- **`04_Opportunity/Opportunity_Assessment.md`** — `OPP-<nn>` and the four big risks; every PRD problem statement traces back to an `OPP`.
- **`01_Strategy/North_Star_and_OKRs.md`** — `OBJ-*`/`KR-*` and the `MET-*` this build must move (reuse; never invent a success metric).
- **`05_Roadmap/Roadmap.md`** — the `RMI-<nn>` this PRD delivers and its Now/Next/Later horizon.
- **`06_Prioritization/Prioritization_Matrix.md`** — RICE/Kano/MoSCoW output to justify in/out scope (P06 is a supporting decision aid — invoke `pm-phase-06-prioritization` inline if scope is contested).
- **Graceful fallback:** if `Solution_Validation.md` is absent, do **not** invent requirements. Offer to run `pm-phase-07-solution-design` first, or proceed against a thin validated concept supplied inline — and record `TODO: SOL/ASM validation owed; OPP traceability provisional` in the PRD frontmatter. For a small, already-validated change you may enter here directly (per [Workflow Overview §6](../../01_Workflow_Overview.md)).

## Step-by-step
Interview-driven. Ask **one topic at a time** (one assistant message per topic), convert answers into the deliverable, show it back, then check the gate. Use `AskUserQuestion` for finite choices. Reuse prior-phase facts; never re-ask them.

1. **Locate the project root & pick the spec format (topic 1).** Read the inputs above. Choose the artifact with `AskUserQuestion`: **Lean PRD / one-pager** (default; most changes), **modern full PRD** (~10–14 sections; cross-team or regulated), **PR-FAQ / Working Backwards** (Amazon; force clarity on customer value first), or **Shape-Up pitch** (fixed appetite, variable scope). Match weight to decision weight — shorter docs get read. Default output: `<product-slug>/08_PRD/PRD.md` + `NFR_Checklist.md`.
2. **Problem, user & outcome up top (topic 2).** State, in one block: the problem in the customer's words, the target user/persona (`PER-*`), the parent `OPP-*`, and the **success metric** (`MET-*` from P12 or `MET-TBD`) with its target and guardrails. This is the BLUF for executives — outcome first, not a feature list. If any is missing → `TODO`, not a guess.
3. **Scope — in / out / later (topic 3).** Make scope explicit *both ways*. Use **MoSCoW** (Must→P0, Should→P1, Could→P2, Won't→record it). Hold the **MVP line**: the smallest slice that delivers the outcome and produces learning. The "Won't / no-gos" list is mandatory — unbounded scope is where launches die.
4. **Functional requirements & features (topic 4).** Decompose the slice into `FEAT-<nn>` epics, each with `REQ-F-<nn>` functional requirements written **testable** (fit criteria or Given/When/Then) — replace "fast/intuitive/secure" with a number + condition. Each REQ cites its parent `SOL`/`OPP` and priority. Reference the prototype for UI rather than spec'ing pixels.
5. **Non-functional requirements — force a line for each (topic 5).** Walk the §3.4 NFR classes; **every class gets a one-liner, even "N/A — because…"**: Usability/accessibility `REQ-U-*` (WCAG 2.2 AA default), Performance `REQ-P-*`, Reliability/Operational `REQ-O-*`, Security/Privacy `REQ-SEC-*` (GDPR Art. 25 by-design; EU AI Act Art. 50 transparency from Aug 2026; EAA enforceable since June 2025), Constraint `REQ-C-*`. NFRs are first-class with numeric thresholds — this is the content the `NFR_Checklist.md` mirrors.
6. **GenAI requirement classes (topic 6 — only if the feature uses a model).** Add explicit requirements for **model behaviour**, **eval/quality criteria** (acceptance thresholds), **hallucination/bias guardrails**, **fallback UX**, and **human-in-the-loop / oversight**. File these under `REQ-F-*` (behaviour) and `REQ-SEC-*`/`REQ-O-*` (guardrails, reliability). Skip the topic entirely for non-AI features — don't pad.
7. **Open questions, dependencies & assumptions (topic 7).** List open questions with owners, dependencies (`DEP-*`), and the carried-forward `ASM-*`. Each open item is a `TODO: <owed>` with an owner + date — never a silent gap.
8. **Critique / red-team (topic 8).** Run the CRITIQUE prompt: untestable verbs, output-list bloat, missing NFRs, requirements with no parent `SOL`/`OPP`, invented "commitments" (AI hallucination), scope that violates the MVP line, missing GenAI guardrails.
9. **Write the PRD + NFR checklist.** Emit `PRD.md` (skeleton below) and `NFR_Checklist.md`, each with Conventions §6 frontmatter (`Document ID: PRD-<SLUG>-v1.0`, `Status: Draft`). Keep one living source of truth with a changelog + owner.
10. **Coverage check.** Confirm: problem→`OPP`→`MET` stated; scope in/out/later explicit; every NFR class answered; every `REQ`/`FEAT` traces to a `SOL`/`OPP`. **Block "done" if any NFR class is blank or any requirement is orphaned.**
11. **G6 exit gate.** Run the checklist below with eng + design + key stakeholders. On sign-off set status `Approved (G6-approved <date>)`; if not yet reviewed leave `Draft` + `TODO: G6 review scheduled <date>`. A gate is a **decision** — Pivot/Hold/Kill are valid outcomes.
12. **Handoff.** Print the PRD + NFR paths, the coverage summary, and recommend `pm-phase-09-stories` to slice the PRD into a ready, testable backlog.

## Decision points
- **Which spec format?** Most changes → **Lean PRD/one-pager**. Customer-value clarity needed / 0→1 → **PR-FAQ**. Fixed time-box, appetite-driven team → **Shape-Up pitch**. Cross-functional or regulated → **modern full PRD**. *How to decide:* pick the lightest format the decision and audience tolerate; culture and decision weight win, not completeness.
- **MVP vs. "complete"?** Smallest slice that moves the `MET` and produces learning → MVP (Must only). *How to decide:* if a requirement doesn't change the outcome metric or de-risk a tested assumption, it's Should/Could/Won't, not Must.
- **Functional vs non-functional class?** Names a capability the product performs → `REQ-F`. Qualifies *how well* it runs → `REQ-U/P/O/SEC`. *How to decide:* don't file a quality attribute as functional; if users won't volunteer the number, it's an NFR you must pin.
- **Spec it, or prototype it?** Interaction/UX detail → **prototype-as-spec** (link it). Behaviour, thresholds, edge cases, NFRs → **write it**. *How to decide:* prose for what a prototype can't show; never both.
- **Accept the AI draft?** Only after verification against real customer context. *How to decide:* if a "commitment" or number can't be traced to evidence, it's a hallucination — cut it or `TODO` it.

## Rules
- **Conform to [../../05_Conventions.md](../../05_Conventions.md)** for every ID, requirement class, gate, priority, status string, and citation. Cross-reference sibling phases; never re-define shared conventions.
- **A PRD documents decisions; it does not make them.** It memorialises validated discovery — it is not a substitute for talking to customers ([SVPG](https://www.svpg.com/discovery-vs-documentation/)).
- **Outcomes over outputs.** The PRD leads with the `MET`/`OPP`, not a feature list; an exhaustive output-requirement catalogue is an anti-pattern ([Conventions §7](../../05_Conventions.md)).
- **One topic at a time.** Never dump all classes/topics in one volley. Show each section back before moving on.
- **NFRs are first-class.** Every §3.4 class gets a one-line answer with a number — "N/A — because…" is allowed; blank is not.
- **AI accelerates, the human decides.** AI drafts the PRD, stories, edge cases, and FAQ from real calls/tickets; the human owns scope, "won't-do", NFR thresholds, GenAI guardrails, and the sign-off. **Never invent** evidence, metrics, or commitments — unknowns become `TODO: <owed>`.
- **Pivot & Kill are valid G6 outcomes.** If scope work reveals the bet is wrong, loop back — don't rubber-stamp a build.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [../../templates/](../../templates/) (`PRD.md`, `PR_FAQ.md`, `Shape_Up_Pitch.md`, `NFR_Checklist.md`). Land in `<product-slug>/08_PRD/` per [Conventions §9](../../05_Conventions.md).

### 1. `PRD.md` — lean by default (scale up to full only when the decision warrants)
```markdown
---
Document: PRD — <Feature / Initiative>
Document ID: PRD-<SLUG>-v1.0
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

## 1. Problem, user & outcome (BLUF)   problem (customer's words) · target PER-* · parent OPP-* · success MET-* (target + guardrails)
## 2. Why now / context               evidence links (INS-*, validated ASM-*), strategic tie (OBJ/KR, RMI-*)
## 3. Scope                           In (Must/P0) · Out (Won't — explicit no-gos) · Later (Could/P2)
## 4. Solution overview               link the prototype (prototype-as-spec); narrative, not pixels
## 5. Functional requirements         | FEAT | REQ-F-* | Statement (testable / Given-When-Then) | Priority | SOL/OPP |
## 6. Non-functional requirements     U (WCAG 2.2 AA) · P · O · SEC (GDPR/EU AI Act/EAA) · C — one line each (see NFR_Checklist.md)
## 7. GenAI requirements (if model)   model behaviour · eval/quality thresholds · guardrails · fallback UX · human-in-the-loop
## 8. Success metrics & guardrails    MET-* + EXP-TBD for risky requirements (seeds P12/P13)
## 9. Open questions & dependencies    TODO + owner + date · DEP-* · carried ASM-*
## 10. Changelog & approvals          version history; G6 sign-off (eng · design · stakeholders + date)
```
> Lean = §1–§3 + §6 + §8 on one page. Add §4–§5, §7, §9–§10 as the audience/decision weight grows. Record any fold as "tailored: <reason>". PR-FAQ swaps §1–§4 for *press release + FAQ*; Shape-Up swaps for *problem / appetite / solution / rabbit holes / no-gos*.

### 2. `NFR_Checklist.md` — forces a line per class (ISO/IEC 25010)
```markdown
---
Document: NFR Checklist — <Feature>
Document ID: NFR-<SLUG>-v1.0
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
| Class | REQ ID | Requirement (numeric threshold) | Answered? | Notes / "N/A — because…" |
|-------|--------|---------------------------------|-----------|--------------------------|
| Usability/Accessibility (U) | REQ-U-01 | WCAG 2.2 AA on all new flows | ✅ | EN 301 549 / EAA |
| Performance (P) | REQ-P-01 | p95 < <n> ms | ☐ | TODO: confirm budget |
| Reliability/Operational (O) | REQ-O-01 | <SLO>; rollback via flag | ☐ | |
| Security/Privacy (SEC) | REQ-SEC-01 | GDPR Art. 25; EU AI Act Art. 50 label | ☐ | DPIA owed |
| Constraint (C) | REQ-C-01 | <budget / platform / mandated tech> | ☐ | |
```

## AI prompt pack
**ELICIT (draft the PRD spine from evidence, not generic prose).**
> "Acting as a senior PM, here are the validated solution `SOL-<nn>`, opportunity `OPP-<nn>`, and these real customer calls/tickets. Draft the PRD §1–§3: problem in the customer's words, target persona, parent OPP, the success metric to move, and in/out/later scope (MoSCoW). Ground every claim in the supplied evidence — flag anything you cannot source as `TODO`, never invent it."

**GENERATE (functional + NFR + GenAI requirements for one feature).**
> "Convert this feature into `FEAT-NN` with testable `REQ-F-NN` requirements (Given/When/Then or fit criteria; replace vague verbs with a number + condition). Then walk every NFR class (U/P/O/SEC/C) and force one line each — propose a numeric threshold or write 'N/A — because…'. If the feature uses a model, add model-behaviour, eval-threshold, guardrail, fallback-UX, and human-in-the-loop requirements. Cite the parent SOL/OPP per REQ."

**CRITIQUE (red-team before G6).**
> "Red-team this PRD. Find: (1) untestable verbs/adjectives, (2) output-list bloat that isn't tied to the outcome metric, (3) any NFR class with no answer, (4) requirements with no parent SOL/OPP, (5) invented 'commitments'/metrics not in the evidence, (6) scope that breaks the MVP line, (7) missing GenAI guardrails. Return: finding | severity | which REQ/section | fix."

**GATE (run G6 as a real review).**
> "Run the G6 checklist against this PRD and the six-thread review. For each item: pass / `TODO` (owner+date) / waived (rationale). Recommend one of Persevere · Persevere-with-actions · Pivot · Hold · Kill, with the evidence. Name the next command."

## Research & specialised-agent triggers
Reference [../../prompts/research-and-agents.md](../../prompts/research-and-agents.md).
- **Talk to a CUSTOMER when:** scope hinges on a need/behaviour you're asserting from the conference room, or a "Must" can't be traced to validated discovery — a PRD must memorialise discovery, not manufacture it. Loop back to `pm-phase-03-discovery`.
- **Recommend WEB RESEARCH when:** an NFR cites a regulation/standard (WCAG 2.2, EU AI Act Art. 50, European Accessibility Act, GDPR, ISO/IEC 25010) — confirm the current binding obligation and date; or you need a comparable-system benchmark to sanity-check a performance/SLO threshold. For any library/SDK/API/cloud-service requirement, use the **Context7 docs MCP first**.
- **Spawn a SPECIALISED AGENT when:** drafting from a large evidence corpus (an evidence-synthesis agent over calls/tickets/Slack → grounded requirements); or the requirement set is large (a testability-and-traceability audit agent to run the CRITIQUE prompt at scale and return a coverage report).

## Cross-cutting hooks
Links to [../../cross-cutting/](../../cross-cutting/).
- **Responsible Product** — *this phase is a primary gate for the floor.* NFRs encode privacy-by-design, WCAG 2.2 AA accessibility, security, and AI-Act/EAA compliance; GenAI guardrails + human-in-the-loop are specified here; new `RSK-*` logged. **The floor is non-negotiable.** → [`Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Metrics, Analytics & Experimentation** — *seeds.* Every PRD states the success `MET-*` + guardrails and seeds `EXP-TBD` for risky requirements; feeds `pm-phase-12-analytics` (tracking plan) and `pm-phase-13-experimentation`. → [`Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Stakeholder Management & Communication** — the PRD is the alignment artifact; G6 sign-off and scope trade-offs are logged as `DEC-*`; lead exec sections BLUF (outcome → trade-off → ask). → [`Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Continuous Discovery** — *consumes.* Links `INS-*`/`OPP-*` as evidence; if scope work surfaces an unknown, reopen discovery rather than guess. → [`Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Product Ops** — one living source of truth with changelog + owner; the PRD/PR-FAQ/Shape-Up template is the ops standard. → [`Product_Operations.md`](../../cross-cutting/Product_Operations.md).
- **Portfolio** *(multi-product)* — confirm this build's place and lifecycle stage in the portfolio. → [`Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Pinned in [../../03_Frameworks_Map.md](../../03_Frameworks_Map.md); cards in [../../frameworks/](../../frameworks/). For P08 specifying & slicing: **Lean PRD / one-pager**, **modern full PRD (~10–14 sections)**, **Working Backwards / PR-FAQ** (Amazon), **Shape Up pitch** (Basecamp: problem/appetite/solution/rabbit-holes/no-gos), **Prototype-as-Spec** (Cagan), **ISO/IEC 25010 quality model** (NFR checklist), **MoSCoW** (MVP scope), **RICE** & **Kano** (justify in/out scope; invoke `pm-phase-06-prioritization`). Pick the spec framework by culture; pick the prioritization framework by the decision (per [Frameworks Map §"specifying & slicing"](../../03_Frameworks_Map.md)).

## Exit-gate checklist (G6 — PRD Approved / Build Entry)
*(Copied verbatim from [../../checklists/gate-reviews.md](../../checklists/gate-reviews.md); if they ever disagree, that file wins. Run the six-thread review first.)*
- [ ] Problem, target user, and the **outcome/success metric** are stated up top and trace to an `OPP-*`/`OBJ`.
- [ ] Scope is explicit: in / out / later (MoSCoW); the MVP line is held.
- [ ] **Non-functional requirements** answered (performance, reliability, accessibility/WCAG, privacy/security, compliance) — one line each, even if "N/A, because…".
- [ ] Open questions and dependencies listed; eng + design + key stakeholders have reviewed and approved.
- [ ] On sign-off, frontmatter status → `Approved (G6-approved <date>)`.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Wrote the PRD instead of doing discovery. | Treated the doc as a substitute for evidence. | A PRD *documents* validated discovery; loop to `pm-phase-03-discovery` for any unsourced "Must". |
| Exhaustive feature/output list. | Output-thinking, not outcome-thinking. | Lead with the `MET`/`OPP`; cut anything that doesn't move the metric or de-risk an `ASM`. |
| NFRs omitted or vague. | Users don't volunteer numbers; class skipped. | Force a one-liner per §3.4 class with a threshold; "N/A — because…" allowed, blank is not. |
| Untestable requirement ("fast/intuitive/secure"). | No fit criteria. | Replace with number + condition or Given/When/Then. |
| Requirement with no parent `SOL`/`OPP`. | Solution invented ahead of validation. | Trace to a `SOL`/`OPP`; if none, `TODO: validate` or drop it. |
| Heavyweight frozen hand-off PRD. | One-time waterfall spec. | Keep it living (changelog + owner); right-size weight to the decision. |
| Accepted the AI draft as final. | Over-reliance; no verification. | Edit, verify against customer context, cut hallucinated "commitments"/numbers. |
| GenAI feature spec'd like a deterministic one. | No model-behaviour/guardrail classes. | Add eval thresholds, hallucination/bias guardrails, fallback UX, human-in-the-loop. |
| Discovery treated as a one-time pre-delivery phase. | Dual-track ignored. | Keep discovery running in parallel ([Overview §2](../../01_Workflow_Overview.md)); the PRD is a checkpoint, not a wall. |

## References
- [../../05_Conventions.md](../../05_Conventions.md) — IDs (§3, incl. REQ classes §3.4), gate ladder (§2), traceability spine (§4), severity/priority (§5), status/frontmatter (§6), outcomes-over-outputs (§7), citations (§8), folder layout (§9).
- [../../01_Workflow_Overview.md](../../01_Workflow_Overview.md) — double-diamond/dual-track (§2), problem-vs-solution space (§3), re-entry at P08 for validated changes (§6).
- [../../checklists/gate-reviews.md](../../checklists/gate-reviews.md) — G6 block + the six-thread review.
- 2026 research (ground the shifts/anti-patterns): [PRD documents, doesn't make, decisions](https://www.svpg.com/discovery-vs-documentation/) · [Working Backwards / PR-FAQ](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/) · [Shape Up — the pitch](https://basecamp.com/shapeup/1.5-chapter-06) · [PRD for a GenAI feature](https://www.reforge.com/guides/write-a-prd-for-a-generative-ai-feature) · [NFR checklist 2026](https://www.forasoft.com/blog/article/non-functional-requirements-checklist-2026) · [Outputs → outcomes](https://amplitude.com/blog/move-from-outputs-to-outcomes).
- Curriculum: [../../../PM_Final_WF/03-product-development-playbook.md](../../../PM_Final_WF/03-product-development-playbook.md) — PRD as the build-entry artifact; functional vs non-functional test coverage.
- Related phases: pm-phase-07-solution-design (validated `SOL`/`ASM` inputs) · pm-phase-06-prioritization (MoSCoW/RICE/Kano scope aid) · pm-phase-09-stories (slices the PRD into a ready backlog) · pm-phase-12-analytics (instruments the `MET`) · pm-phase-13-experimentation (tests risky requirements).

</supporting-info>
