---
Document: Discovery Plan — <PRODUCT_NAME>
Document ID: DISC-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <Product Manager (the trio: PM + design + eng)>
Updated: <YYYY-MM-DD>
---

# Discovery Plan — <PRODUCT_NAME>

<!-- Owning skill: pm-phase-03-discovery (Phase 03 — Customer Discovery & User Research). -->
<!-- Sibling templates: Interview_Guide.md · Personas.md · JTBD.md · Research_Insights.md -->
<!-- This plan SCOPES continuous discovery to an outcome. It is not a one-off study. Conforms to ../05_Conventions.md. -->
<!-- Exit gate this phase serves: G2 Problem Validated. -->

## 1. Discovery question & outcome
<!-- Research that won't change a decision is theatre — cut it. Pin all four lines. -->
- **Outcome served (OBJ/KR):** <OBJ-NN / KR-NN — from 01_Strategy/North_Star_and_OKRs.md>
- **Discovery question:** TODO: <the one question this cycle must answer, in plain language>
- **Decision it will change:** TODO: <what we will do differently depending on the answer>
- **Riskiest belief / assumption:** <ASM-NN — the belief that, if false, sinks the bet>

## 2. Target segment & recruiting
<!-- Reuse STK-* from 00_Charter/Stakeholder_Map.md as sponsors/recruiting channels — never re-ask who they are. -->
- **Segment:** TODO: <who we are learning from this cycle; from Product_Strategy.md>
- **Screening criteria (in / out):** TODO: <must have / must not have>
- **Recruiting channels:** TODO: <make recruiting automatic — standing source, not a weekly scramble>
- **Sensitive/regulated segment?** <Yes/No — if children/health/finance, confirm consent obligations (see §6)>

## 3. Methods (match the method to the question, never default to "do some interviews")
| Question type | Method | Use this cycle? |
|---|---|---|
| Causal "why they switch / struggle" | Story-based interview (Switch/Mom Test) | <Yes/No> |
| "How many / what they actually do" | Behavioural / product analytics | <Yes/No> |
| Quantify under-served outcomes | ODI survey | <Yes/No> |
| Said-vs-done gap | Observation / ethnography | <Yes/No> |
| Broad trends across many | Survey | <Yes/No> |
| Always-on signal | Feedback streams (tickets, reviews, NPS, sales calls) | <Yes/No> |
<!-- Triangulate qual (why) + quant (how many). Neither alone validates a problem. -->

## 4. Cadence (continuous discovery — a habit, not a project)
<!-- Torres minimum bar: >=1 customer interview/week by the team building the product. Frequency beats sample size. -->
- **Interview cadence:** TODO: <e.g. 3-5 interviews/week, standing slot>
- **Synthesis cadence:** <synthesise each session fresh into an interview snapshot — see Research_Insights.md §5>
- **Who runs it (the trio):** <PM: __ · Design: __ · Eng: __ — discovery is not outsourced>
- **OST review cadence:** <the Opportunity Solution Tree is a living weekly layer; owned by P04, seeded here>

## 5. AI assist & the 80/20 split
<!-- AI accelerates; the human decides. ~97% use AI, ~74% say output needs review. Never let synthetic output stand in for a real customer. -->
- **AI does (routine/high-volume):** <transcribe · tag · cluster · draft guide · first-pass themes>
- **Human owns (always):** <bias control · representativeness · rapport · interpretation · the gate call>
- **AI-moderated vs human-led:** <~80/20 — high-stakes/sensitive/foundational ethnography stays human-led>

## 6. Responsible-product floor (non-negotiable, even in research)
<!-- Seeds cross-cutting/Responsible_Product.md. Log research risks as RSK-*. -->
- [ ] Informed consent + recording disclosure scripted (in Interview_Guide.md §3).
- [ ] Participant-data privacy by design (GDPR Art. 25) — storage, retention, access.
- [ ] Inclusive / representative recruiting (not just the easy-to-reach).
- [ ] Research risks logged: <RSK-NN …>

## 7. ResearchOps — the insight repository
<!-- Research debt is the new tech debt. Make insights findable and reusable from day one. -->
- **Where insights live:** TODO: <searchable repo / tool>
- **Tagging scheme:** <segment · outcome (OBJ/KR) · job (JOB) · candidate OPP>

## 8. Outputs & traceability
<!-- Outcomes over outputs: "we did N interviews" is output. A validated, traceable problem is the success. -->
- **This cycle produces:** Research_Insights.md (`INS-*`) · Personas.md (`PER-*`) · JTBD.md (`JOB-*`) · candidate `OPP-*` seeds for P04.
- **Traceability spine:** `INS / PER / JOB → OPP → OBJ/KR` (every persona & job cites an `INS-*`; nothing enters the OST without evidence).

## 9. Open questions / TODO
<!-- Unknowns become TODO + a recommendation to research/interview — never a guessed need. -->
- TODO: <owed item — owner + date>

---
*Next:* run the **pm-phase-03-discovery** skill to execute interviews → synthesise into `Research_Insights.md` → build `Personas.md` / `JTBD.md` → seed `OPP-*` → run the **G2 Problem Validated** gate.
