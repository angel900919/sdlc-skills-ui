---
Document: PR-FAQ — <FEATURE / INITIATIVE>
Document ID: PRFAQ-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role / name>
Updated: <YYYY-MM-DD>
---

<!--
PR-FAQ (Amazon "Working Backwards") — blank, reusable template, and an ALTERNATE to PRD.md.
Use this instead of a PRD when you need customer-value clarity first (0→1, fuzzy/contested value).
Owning skill: pm-phase-08-prd (Phase 08 — Requirements & PRD).
Conforms to ../05_Conventions.md: §6 frontmatter · §3 IDs · §4 traceability · §7 outcomes-over-outputs.

HOW WORKING BACKWARDS WORKS
- Write the launch announcement BEFORE building. If the press release isn't exciting, the idea isn't ready.
- Keep the press release to ~1 page, plain language a customer would understand — no jargon, no roadmap.
- The FAQ does the hard thinking: it pre-answers the tough customer AND internal/stakeholder questions.
- This replaces PRD §1–§4 (problem/context/scope/solution narrative). The HARD requirements still live
  elsewhere: put NFRs in NFR_Checklist.md, and FEAT-*/REQ-* in PRD.md §5 (or an appendix) if/when you build.
- AI drafts; the human owns the value claim, scope, and sign-off. Never invent a customer quote, metric,
  date, or "commitment" → write "TODO: <owed>". (AI never fabricates evidence — Conventions §11.)
- Status flow (§6): Draft → In Review → Approved (G6-approved YYYY-MM-DD) → Superseded.
-->

# Press Release
<!-- Dated as if it were launch day. ~1 page. The reader is the customer, not the exec team. -->

**FOR IMMEDIATE RELEASE — <CITY>, <YYYY-MM-DD>**

## <Headline: the customer benefit in one line>
<!-- e.g. "<Product> now lets <persona> <achieve outcome> in <time/effort>." Outcome, not feature. -->

### <Sub-headline: who it's for and the payoff, one sentence>

**The problem (paragraph 1).** <TODO: the customer pain today, in their words. Ties to OPP-<nn> / PER-<nn>.>

**The solution (paragraph 2).** <TODO: what we're announcing and how it removes that pain — plain language.>

**Company quote (paragraph 3).** "<TODO: leader quote on why this matters / why now>," said <name, title>.

**How it works (paragraph 4).** <TODO: the customer's experience in 2–3 sentences. Link prototype if any.>

**Customer quote (paragraph 5).** "<TODO: a customer's reaction — mark as illustrative until validated>," said <persona/customer>. <!-- Do NOT present a fabricated quote as real evidence. -->

**Call to action (paragraph 6).** <TODO: how to get started / availability — keep it concrete.>

---

# Frequently Asked Questions

## A. Customer FAQ (external)
<!-- The questions a customer/press would ask. -->

1. **What exactly is this and who is it for?** <TODO> — persona `PER-<nn>`
2. **What can I do that I couldn't before?** <TODO: the job-to-be-done it serves, `JOB-<nn>`>
3. **How much does it cost / how do I get it?** <TODO: pricing, availability, eligibility>
4. **How is my data handled?** <TODO: privacy in plain terms — GDPR Art. 25 by-design; consent>
5. **<If AI-powered>** Is this AI, and how do I know when I'm interacting with it? <TODO: EU AI Act Art. 50 disclosure / labeling from 2026-08-02>
6. **What if it gets something wrong?** <TODO: fallback, support, human override>

## B. Internal / stakeholder FAQ (the hard thinking)
<!-- The questions leadership, eng, design, legal, finance will ask. This is where the bet is pressure-tested. -->

1. **What customer problem does this solve, and what's the evidence?** <TODO: `INS-<nn>`, validated `ASM-<nn>`; parent `OPP-<nn>`>
2. **What outcome will it move, and by how much?** Success metric `MET-<nn>` — target <from X → Y by DATE>; **guardrails** <TODO: must-not-regress>
3. **How does this tie to strategy?** `OBJ-<nn>` / `KR-<nn>` · roadmap item `RMI-<nn>` (Now / Next / Later)
4. **What's the validated bet behind it?** `SOL-<nn>` <!-- from 07_Solution/Solution_Validation.md --> 
5. **What's explicitly out of scope (no-gos)?** <TODO: the "won't do" list — mandatory>
6. **What's the smallest version that delivers the outcome (MVP)?** <TODO: Must-only slice>
7. **What are the biggest risks (value / usability / feasibility / viability + ethics)?** `RSK-<nn>` — <impact + mitigation>
8. **What does it cost to build & run?** <TODO: effort, infra/cost ceiling — constraint `REQ-C-*`>
9. **What are the non-functional & compliance requirements?** <TODO: see **NFR_Checklist.md** — WCAG 2.2 AA, performance, reliability, security/privacy>
10. **<If AI-powered>** What are the model behaviour, eval thresholds, guardrails, fallback, and human-in-the-loop requirements? <TODO: see PRD §7>
11. **What are the open questions & dependencies?** TODO: <owed> — owner <name>, due <YYYY-MM-DD> · `DEP-<nn>`
12. **How will we know it worked?** `MET-<nn>` + `EXP-<nn>`/EXP-TBD (seeds P12/P13)

---

## Approvals
<!-- On G6 sign-off set status → Approved (G6-approved YYYY-MM-DD). A gate is a DECISION:
     Persevere · Persevere-with-actions · Pivot · Hold · Kill (§2). -->

| Version | Date | Author | Change |
|---------|------|--------|--------|
| v0.1 | <YYYY-MM-DD> | <name> | Initial draft |

**G6 sign-off:** Eng <name/date> · Design <name/date> · Key stakeholders <name/date>

---

### Related templates & next step
- **PRD.md** — the default lean-spec alternate; use it (not this) for most changes. Holds FEAT-*/REQ-*.
- **Shape_Up_Pitch.md** — alternate for fixed-appetite, variable-scope teams.
- **NFR_Checklist.md** — required at G6 regardless of spec format (NFRs live here, not in the press release).
- **Upstream:** `07_Solution/Solution_Validation.md` — owning skill **pm-phase-07-solution-design**.
- **Next:** once approved, slice into a backlog → **pm-phase-09-stories**.
- _Owning skill: **pm-phase-08-prd**. Conventions: ../05_Conventions.md._
