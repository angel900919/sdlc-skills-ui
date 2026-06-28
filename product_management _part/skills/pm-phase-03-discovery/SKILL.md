---
name: pm-phase-03-discovery
description: Runs Phase 03 (Customer Discovery & User Research) of the framework-agnostic product-management workflow — the problem-space "Discover" diamond. It plans continuous discovery, writes a story-based interview guide, runs/synthesises customer interviews and external feedback streams, captures research insights (INS-*), builds evidence-grounded personas (PER-*) and Jobs-to-be-Done (JOB-*), seeds candidate opportunities (OPP-*) for Phase 04, and red-teams the conclusion for confirmation bias — producing Discovery_Plan.md, Interview_Guide.md, Personas.md, JTBD.md, and Research_Insights.md, then runs the G2 Problem Validated gate. Conforms to ../../05_Conventions.md. Use when the user wants to validate a problem, learn the customer/job, plan or run customer interviews, write an interview guide, build personas or JTBD, synthesise research, or stand up continuous discovery before committing to a solution. Triggers on "customer discovery", "validate the problem", "user research", "interview customers", "write an interview guide", "build personas", "jobs to be done", "JTBD", "continuous discovery", "synthesise interviews", "prep for G2", "phase 3 discovery".
disable-model-invocation: true
user-invocable: true
---

# Phase 03 — Customer Discovery & User Research

<what-to-do>
This phase learns the customer, the problem, and the **jobs** — *before* any solution — and produces evidence (not opinion) that a real, valuable problem exists for a defined segment. Its exit gate is **G2 Problem Validated**. It is the first "Discover" diamond of the double diamond and the place the continuous-discovery thread is born. It conforms in full to [../../05_Conventions.md](../../05_Conventions.md) — all IDs (`INS`/`PER`/`JOB`, seeds `OPP`/`ASM`), gates, status strings, severity, the traceability spine, and folder layout come from there; this skill never redefines them. **No solution is committed in this phase** (that is P04→P07).

## Inputs (from prior phases)
- **`01_Strategy/North_Star_and_OKRs.md`** — `OBJ-*`/`KR-*` and the North Star. Discovery is scoped to a **desired outcome**, not "go learn about users"; every insight should ladder toward an objective (the OST link in P04).
- **`01_Strategy/Product_Strategy.md` · `Vision.md`** — the chosen segment, the strategic bet, and the "what we're NOT doing".
- **`02_Market/Market_Analysis.md` · `Competitive_Analysis.md` · `Positioning_Brief.md`** — market context and the **status-quo / "do nothing"** alternative customers actually compare against.
- **`00_Charter/Stakeholder_Map.md`** — `STK-*` (reuse as research sponsors/recruiting channels; never re-ask who they are). `Operating_Model.md` — cadence + tailoring profile (Solo/Lean → Standard → Enterprise).
- **`_threads/Decision_Log.md` · `Risk_Register.md`** — open `DEC-*`/`RSK-*` a discovery finding must inform.
- **Graceful fallback:** if strategy/market artifacts are absent, do **not** invent a segment or a need. Offer to run `pm-phase-01-strategy` / `pm-phase-02-market-research` first, or proceed against a thin context supplied inline and record `TODO: strategy/segment owed; outcome link provisional` in the `Discovery_Plan.md` frontmatter.

## Step-by-step
Interview-driven. Ask **one topic at a time** (one assistant message per topic), convert answers into deliverables, then check the exit gate. Use `AskUserQuestion` for finite choices (segment, JTBD school, interview cadence). **Show-back** every synthesised insight to the user before you ID it. Reuse prior-phase facts; never re-ask them.

1. **Locate the project root & confirm output paths.** Read the inputs above. Default outputs: `<product-slug>/03_Discovery/{Discovery_Plan.md, Interview_Guide.md, Personas.md, JTBD.md, Research_Insights.md}`.
2. **Frame the discovery question (topic 1).** Pin the **outcome** discovery serves (the `OBJ/KR`), the target **segment**, the riskiest belief, and the decision the research will change. Research that won't change a decision is theatre — cut it. Set the **continuous-discovery cadence** (Torres minimum: ≥1 interview/week by the trio). → `Discovery_Plan.md`.
3. **Choose methods by question, not habit (topic 2).** Story-based **interviews** for the causal "why"; **behavioural/product analytics** for "how many / what they actually do"; **surveys** to quantify across many; **observation/ethnography** for the gap between said and done; **feedback streams** (tickets, reviews, NPS, sales calls) merged in. Triangulate qual (why) + quant (how many) — neither alone validates a problem.
4. **Write the interview guide (topic 3).** Story-based, past-behaviour questions ("tell me about the **last time** you faced <situation>"). **Never** ask "would you use this?" or pitch. Probe the job, the struggling moment, current workarounds, and what "better" means. Add a consent/recording line (Responsible Product floor). → `Interview_Guide.md`.
5. **Run/ingest research & synthesise each session fresh (topic 4).** For each interview/feedback item, capture an **interview snapshot**; extract findings as `INS-<nn>` in the customer's own words, tagged to the segment and the `OBJ/KR`. AI may transcribe/tag/cluster — **a human reviews every theme against raw quotes** (97% use AI; ~74% say output needs review). Never let an AI-generated or synthetic "insight" stand in for a real one.
6. **Build personas from evidence only (topic 5).** Write `PER-<nn>` that summarise *real* discovery (goals, motivations, context, behaviours) — **not** demographic fiction. Each persona cites the `INS-*` behind it. If there's no research, there's no persona — record `TODO: recruit + interview`.
7. **Map the Jobs-to-be-Done (topic 6).** Pick the school via `AskUserQuestion`: **Switch/Forces** (Moesta/Christensen) to *find* the job qualitatively; **ODI** (Ulwick) to *quantify and prioritise* desired outcomes (importance × satisfaction). Write **job stories** — "When [situation], I want to [motivation], so I can [outcome]". Assign `JOB-<nn>`, trace each to its `INS-*`. → `JTBD.md`.
8. **Seed opportunities (topic 7).** Convert validated needs/pains/desires into **candidate** `OPP-<nn>` (needs, not solutions) for the Opportunity Solution Tree — but the OST and sizing are **owned by P04**; here you only seed. Note any solution-shaped belief as an `ASM-*` for P07 to test later.
9. **Red-team for bias (topic 8).** Actively seek **disconfirming** evidence; have the AI run the adversarial-reviewer prompt. Frequency beats sample size, but representativeness and rapport are human-owned. Flag any conclusion resting on <5 conversations or one loud voice.
10. **Write the artifacts & check coverage.** Emit all five files with Conventions §6 frontmatter. Print: # conversations this cycle, INS/PER/JOB counts, the segment, and the outcome each traces to. **Block "done" if any persona/JOB has no `INS-*` parent, or any conclusion rests on hypotheticals.**
11. **G2 exit gate.** Run the Exit-gate checklist below as a real review → decide **Persevere · Persevere-with-actions · Pivot · Hold · Kill**. On pass, set `Research_Insights.md` status to `Approved (G2-approved <date>)`; the OST/personas/insights are `Living`. Log the decision in `WORKFLOW.md` + `_threads/Decision_Log.md` (`DEC-*`).
12. **Handoff.** Print the artifact paths + the candidate `OPP-*` list, and recommend `pm-phase-04-opportunity` to place them on the Opportunity Solution Tree, size them, and run G3.

## Decision points
- **Which research method?** Causal "why they switch" → **interview (Switch)**; quantify under-served outcomes → **ODI survey**; "what do they actually do" → **behavioural analytics**; said-vs-done gap → **observation**; broad trends → **survey**. *How to decide:* match the method to the question and the decision it changes — never default to "do some interviews".
- **Which JTBD school?** *How to decide:* qualitative discovery to **find** the job → Switch/Forces; need to **prioritise** competing jobs with numbers → ODI. 2026 consensus: use both — qual to find, ODI to quantify.
- **Persona, or cut it?** *How to decide:* if it's backed by `INS-*` and carries goals/motivations → keep; if it's a workshop invention or demographic portrait → cut it (persona fiction fails G2).
- **AI-moderated vs human-led interview?** *How to decide:* routine/high-volume long tail → AI-moderated is fine; high-stakes, sensitive, or foundational ethnography → human-led. Keep ~80/20.
- **Enough evidence to pass G2?** *How to decide:* ≥5 conversations in-segment this cycle, the problem in customers' words grounded in **past behaviour**, disconfirming evidence sought. If not → **Hold** and book more interviews; if evidence says the segment/problem is wrong → **Pivot**.

## Rules
- **Conform to [../../05_Conventions.md](../../05_Conventions.md)** for every ID, gate, status string, severity, the spine, and folder layout. Cross-reference sibling phases; don't redefine shared conventions.
- **Outcomes over outputs.** Discovery serves a desired outcome (`OBJ/KR`); "we did 10 interviews" is output, not success — a *validated, traceable problem* is.
- **Evidence over opinion.** Interview for **stories and past behaviour**, never hypotheticals; the loudest stakeholder doesn't win, the evidence does. Nothing enters the OST without an `INS-*`.
- **Problem space only.** Don't pitch, design, or commit a solution. Solution-shaped beliefs become `ASM-*` for P07.
- **AI accelerates, the human decides.** AI drafts guides, transcribes, tags, clusters, and red-teams; a human owns bias control, representativeness, rapport, interpretation, and the gate call. **Never invent quotes, needs, or numbers** — unknowns become `TODO: <owed>`.
- **Responsible-product floor is non-negotiable** even in research: informed consent, recording disclosure, privacy-by-design on participant data (GDPR Art. 25), inclusive/representative recruiting.
- **Continuous, not a project.** The cadence and the OST start here and never close — they feed P12–P15 and loop back forever.
- **Pivot and Kill are valid outcomes.** A discovery that kills a bad bet cheaply is the most valuable result of all.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [../../templates/](../../templates/) (`Discovery_Plan.md`, `Interview_Guide.md`, `Personas.md`, `JTBD.md`, `Research_Insights.md`). The two most load-bearing for G2:

### 1. `Research_Insights.md` — the evidence base (`INS-*`; the heart of G2)
```markdown
---
Document: Research Insights — <Product Name>
Document ID: INS-<PRODUCT_SLUG>-v1.0
Status: Draft
Owner: Product Manager (the trio)
Updated: <YYYY-MM-DD>
---

## 1. Discovery question & outcome     (the OBJ/KR + decision this research changes)
## 2. Method & cadence                 (methods used; # conversations this cycle; recruiting channel)
## 3. Insights                         | INS-<nn> | Finding (customer's words) | Evidence (snapshot/quote ref) | Segment | Frequency | Traces to OBJ/KR | Candidate OPP |
## 4. Disconfirming evidence           (what we sought that would falsify the conclusion; what we found)
## 5. Interview snapshots              (one per session: who, situation, job, struggle, workaround, quotes)
## 6. Open questions / TODO            (TODO: <owed> — never a guessed need)
```
> Every `INS-*` is grounded in a real snapshot/quote. `Living` after G2 — it accretes weekly under continuous discovery.

### 2. `JTBD.md` — Jobs-to-be-Done (`JOB-*`)
```markdown
---
Document: Jobs-to-be-Done — <Product Name>
Document ID: JTBD-<PRODUCT_SLUG>-v1.0
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

## 1. School & rationale        (Switch/Forces to find · ODI to quantify — and why)
## 2. Job map / job stories     | JOB-<nn> | Job story: When [situation], I want to [motivation], so I can [outcome] | Type (functional/emotional/social) | Traces to INS |
## 3. Desired outcomes (ODI)    | outcome statement | Importance | Satisfaction | Opportunity = Imp + max(Imp−Sat,0) |   (only if ODI used)
## 4. Forces of progress        (push / pull vs. habit / anxiety — only if Switch used)
## 5. Under-served outcomes     (the prioritised gaps → seed OPP-* for P04)
```

Also produced: `Discovery_Plan.md` (outcome, segment, methods, cadence, recruiting), `Interview_Guide.md` (story-based, non-leading), `Personas.md` (`PER-*`, each citing its `INS-*`).

## AI prompt pack
**ELICIT (probe one belief, story-based).**
> "Acting as a discovery interviewer, here is the belief `<ASM/INS>: customers in <segment> struggle with X>`. Generate 6 open, **past-behaviour** interview questions ('tell me about the last time…') and 3 follow-up probes that surface the job, the struggling moment, current workarounds, and what 'better' means. No leading or hypothetical questions; do not propose a solution."

**GENERATE (synthesise a session into insights + JTBD).**
> "From these interview notes, produce an interview snapshot, then extract findings as `INS-NN` in the customer's own words (one observable behaviour each, tagged to segment + the OBJ/KR). Draft 1-3 job stories ('When… I want… so I can…') and link each to its INS. Flag any theme supported by <3 sources as weak. Use real quotes only — never invent one; mark gaps `TODO`."

**CRITIQUE (red-team for confirmation bias).**
> "Red-team this discovery. Find: (1) conclusions resting on hypotheticals not past behaviour, (2) personas/JOBs with no INS parent, (3) leading questions in the guide, (4) confirmation bias / disconfirming evidence not sought, (5) any insight that is AI-generated or synthetic standing in for a real customer, (6) conclusions on <5 conversations or one loud voice. Return: finding | severity (S1-S4) | location | fix."

**GATE (run G2 as a real review).**
> "Act as the G2 reviewer. Walk the Problem-Validated checklist and the six-thread review against this discovery. For each: pass / TODO(owner+date) / fail with evidence. Recommend Persevere · Persevere-with-actions · Pivot · Hold · Kill, with the one piece of evidence that would change the call."

## Research & specialised-agent triggers
Reference [../../prompts/research-and-agents.md](../../prompts/research-and-agents.md).
- **TALK TO A CUSTOMER (Part A) — the default move of this phase.** Any belief about what customers need/do/struggle with fires a **weekly** discovery touch (3-5 interviews), not a search or a meeting. The AI proposes the recruit + invocation; **you run the interviews**; every finding lands as `INS-*` → candidate `OPP-*`.
- **WEB RESEARCH (Part B) when** you need behavioural benchmarks to sanity-check a stated frequency/severity, or a regulated/sensitive segment (children, health, finance) changes how you may recruit/consent — confirm the binding obligation, hold the artifact at `TODO: confirm via research`.
- **Spawn a SPECIALISED AGENT when:** a large pile of interviews/feedback/tickets needs theming → **research-synthesis agent** (returns themes + frequency + real quotes + candidate `OPP-*`; **you verify against raw data** before acting); a conclusion needs a skeptical second opinion → **adversarial-reviewer agent**; a regulated vertical changes research ethics → **domain-expert agent** (verify output). Outputs are **input to verify, not truth** — never let an agent's "customer insight" replace a real one.

## Cross-cutting hooks
Links to [../../cross-cutting/](../../cross-cutting/).
- **Continuous Discovery & Customer Insight** — *this phase is the source.* It starts the weekly cadence and the never-closing opportunity solution tree; P12–P15 feed new `OPP-*` back here. → [`Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Responsible Product** — *seeds* the floor: informed consent, recording disclosure, participant-data privacy (GDPR Art. 25), representative/inclusive recruiting; log research `RSK-*`. → [`Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholders** — share insights to build alignment via evidence (not persuasion theater); log discovery decisions as `DEC-*`. → [`Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Metrics & Experimentation** — *feeds* — validated jobs/outcomes inform the North Star's input metrics and the HEART task-success view; under-served outcomes become candidate `MET-*` targets in P12. → [`Metrics_Analytics_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Product Ops** — *seeds* ResearchOps: a findable, reusable insight repository (research debt is the new tech debt); automatic recruiting. → [`Product_Operations.md`](../../cross-cutting/Product_Operations.md).
- **Portfolio** *(multi-product)* — insights may re-rank where this bet sits across the portfolio. → [`Portfolio_Lifecycle.md`](../../cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Cards in [../../frameworks/](../../frameworks/); pinned in [../../03_Frameworks_Map.md](../../03_Frameworks_Map.md) (P03 row).
- **Continuous Discovery Habits + Interview Snapshot** (Torres) — weekly cadence; small/frequent over big/rare; OST as a living weekly layer.
- **JTBD — Switch/Forces** (Moesta/Christensen) — the causal struggle that makes people switch.
- **JTBD — ODI / outcome-driven** (Ulwick) — quantify & prioritise under-served outcomes (Opportunity = Importance + max(Importance − Satisfaction, 0)).
- **Job Stories** (Intercom) — "When… I want… so I can…" (drops the persona).
- **Design Thinking / Double Diamond** — empathise→define; the first "Discover" diamond.
- **Story-based interviewing / The Mom Test** (Fitzpatrick) — past behaviour, never "would you?".
- **Customer Development** (Blank) — get out of the building; search before scale.

## Exit-gate checklist (G2 — Problem Validated)
Copied verbatim from [../../checklists/gate-reviews.md](../../checklists/gate-reviews.md); if they ever disagree, that file wins. Run the **six-thread review** first (stakeholders, discovery, metrics, product ops, responsible product, portfolio), then:
- [ ] ≥5 customer conversations in the target segment this cycle (continuous-discovery cadence live).
- [ ] The problem/job is described in customers' words and grounded in **past behaviour**, not hypotheticals.
- [ ] Insights captured as `INS-*`; personas (`PER-*`) and/or JTBD (`JOB-*`) traced to real research, not invented.
- [ ] Evidence that the problem is **real, frequent/painful, and valuable** to solve — for a defined segment.
- [ ] Confirmation bias checked: disconfirming evidence sought; the AI red-teamed the conclusion.
- [ ] No solution committed yet (problem space only).

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Persona invented in a workshop. | No research behind it (persona fiction). | Cut it, or rebuild from `INS-*`; demographic portraits don't count. |
| "We talked to 12 users" reported as success. | Output-counting instead of outcome. | Report the *validated, traced problem*; frequency beats sample size but isn't the metric. |
| Asked "would you use this?" / pitched. | Speculative, leading, solution-first. | Story-based past-behaviour questions; no pitching in discovery. |
| Conclusion rests on one loud voice / <5 talks. | Convenient sampling, no rigor. | Hold the gate; book more in-segment interviews; seek disconfirming evidence. |
| Big-bang upfront study then build. | Treating discovery as a project, not a cadence. | Switch to weekly continuous discovery; keep the OST living. |
| AI/synthetic "insight" used as fact. | Trusting AI output without review. | Human reviews every theme vs. raw quotes; synthetic users disqualified for demand/PMF. |
| Discovery outsourced to a separate team. | Trio not doing its own research. | PM+design+eng own discovery; insights die in handoff otherwise. |
| Solution sneaks into the insights. | Problem/solution space conflated. | Move it to `ASM-*` for P07; keep P03 problem-space only. |
| Insights lost / un-findable next quarter. | No ResearchOps repository (research debt). | Store INS in a searchable, reusable repo from day one. |
| No consent / participant data unmanaged. | Responsible-product floor skipped. | Consent + recording disclosure + GDPR-Art.25 handling before any interview. |

## References
- [../../05_Conventions.md](../../05_Conventions.md) — IDs (§3.1: `INS`/`PER`/`JOB`, seeds `OPP`/`ASM`), gate ladder & decisions (§2), traceability spine (§4), status/versioning (§6), outcomes-over-outputs (§7), citations (§8), folder layout (§9), threads (§10), AI-assisted/human-led (§11).
- [../../01_Workflow_Overview.md](../../01_Workflow_Overview.md) — double diamond & dual-track (§2), problem-vs-solution space (§3), the continuous loop (§4).
- [../../checklists/gate-reviews.md](../../checklists/gate-reviews.md) — G2 block (authoritative) + the six-thread every-gate review.
- 2026 research (Customer Discovery & User Research/JTBD): https://www.producttalk.org/2024/02/interview-snapshot/ · https://www.lennysnewsletter.com/p/teresa-torres-on-how-to-interview · https://www.nngroup.com/articles/personas-jobs-be-done/ · https://anthonyulwick.com/jobs-to-be-done/ · https://www.intercom.com/blog/accidentally-invented-job-stories/ · https://www.nngroup.com/articles/research-with-ai/ · https://www.userinterviews.com/state-of-synthetic-users-report
- Curriculum: [../../../PM_Final_WF/02-product-design-playbook.md](../../../PM_Final_WF/02-product-design-playbook.md) — Design-Sprint-style understand/interview/validate playbook (empathy interviews, HMW, user-study validation).
- Related phases: pm-phase-01-strategy (outcome/segment inputs) · pm-phase-02-market-research (market/"do nothing" context) · pm-phase-04-opportunity (places `OPP-*` on the OST, sizes, runs G3) · pm-phase-07-solution-design (tests the `ASM-*` this phase seeded) · pm-phase-14-feedback (the always-on voice-of-customer that feeds new `OPP-*` back here).

</supporting-info>
