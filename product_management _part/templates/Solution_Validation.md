---
Document: Solution Validation — <SOLUTION NAME>
Document ID: VAL-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role/name — default: Product Manager>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 07 · Solution Discovery & Design (skill: pm-phase-07-solution-design).
★ Gating artifact for G5 · Solution Validated. This is the EVIDENCE LEDGER: per risk type, what
was tested, the result, the decision it drove. A failed assumption is a FINDING that triggers a
Pivot — never a quiet edit to make the gate green.
Conforms to ../05_Conventions.md: gate ladder + decision vocab §2, IDs §3, traceability spine §4,
severity §5, frontmatter §6, outcomes-over-outputs §7, AI-assisted/human-led §11.
Replace every <ANGLE_BRACKET>; leave unknowns as `TODO:`. Delete example rows before sharing.
Related: Assumption_Map.md · Prototype_Plan.md · Usability_Test_Plan.md.
-->

## 1. Context

- **Solution validated:** `SOL-<nn>` — <one line>
- **Opportunity / outcome:** `OPP-<nn>` → `OBJ-<nn>`/`KR-<nn>` → moves `MET-<nn>`
- **Roadmap item:** `RMI-<nn>` (in *Now*)
- **Assumption map:** `Assumption_Map.md` (`ASM-<PRODUCT_SLUG>`)

## 2. Evidence ledger (per risk type — evidence, not opinion)

<!-- One row per riskiest ASM tested. "Result" must cite evidence (quote / metric / eng verdict),
never an assertion. Decision uses the Conventions §2 vocabulary: Persevere / Persevere-with-
actions / Pivot / Hold / Kill. Mark untested-but-needed items TODO: — don't fake a pass. -->

| Risk type | ASM tested | Method (EXP-) | Result (pass/fail + evidence) | Decision |
|-----------|-----------|---------------|-------------------------------|----------|
| Desirability/Value | ASM-<nn> | EXP-<nn> <prototype, n=5> | TODO: <quote/metric vs. threshold> | <Persevere> |
| Usability | ASM-<nn> | EXP-<nn> <usability test> | TODO: <task success % / time> | <Persevere-with-actions (DEC-<nn>)> |
| Feasibility | ASM-<nn> | EXP-<nn> <eng spike> | TODO: <eng verdict> | <Persevere> |
| Business-Viability | ASM-<nn> | EXP-<nn> <pricing/legal review> | TODO: <finding> | <Hold (DEC-<nn>)> |
| Ethical | ASM-<nn> | EXP-<nn> <DPIA / bias review> | TODO: legal sign-off | <Hold (DEC-<nn>)> |

> *Backward trace works too: any `MET-<nn>` or `INS-<nn>` cited here links to the `ASM-<nn>` it confirms/disconfirms.*

## 3. What failed → what we changed (pivots are wins, not setbacks)

<!-- Be explicit. A disconfirmed load-bearing assumption is the cheapest failed build G5 stopped.
Quietly editing a failed assumption to green the gate is the anti-pattern. -->

| Failed ASM | What the evidence showed | Pivot taken | Routed to |
|------------|--------------------------|-------------|-----------|
| ASM-<nn> | TODO: <…> | <new SOL-<nn> / new segment / killed> | <Assumption_Map.md §2 / pm-phase-04-opportunity> |

## 4. MVP / first slice (smallest scope that moves the outcome AND teaches us)

<!-- The MVP is the smallest thing that both moves OBJ/KR and produces learning. Everything else
is Next/Later (outcomes over outputs §7). Neither gold-plated nor a non-viable stub. -->

- **MVP (Now):** <smallest scope that moves `OBJ-<nn>`/`KR-<nn>` and teaches us `<X>`>
- **What it deliberately does NOT do:** <…>
- **Out of scope / later:**

| Item | Now / Next / Later | Why deferred |
|------|--------------------|--------------|
| <…> | Next | TODO: |
| <…> | Later | TODO: |

- **Success signal post-launch:** `MET-<nn>` — <target> <!-- "done" = a moved metric, not a shipped feature -->

## 5. Responsible-product check (the non-negotiable floor)

- [ ] Ethical assumption (`ASM-<nn>`) tested or explicitly `Hold` with owner + date.
- [ ] Privacy-by-design (GDPR Art. 25) considered; data minimized.
- [ ] Accessibility floor (WCAG 2.2 AA — verify current) signed off via `Usability_Test_Plan.md` §6.
- [ ] New risks logged as `RSK-<nn>` (severity §5.3) in `_threads/Risk_Register.md`.

## 6. G5 · Solution Validated — gate verdict

<!-- The six-thread every-gate review runs first (checklists/gate-reviews.md). Then decide. -->

- [ ] Riskiest `ASM-*` listed and the **most dangerous** ones tested (not the easiest).
- [ ] Evidence the solution is **desirable**, **usable**, **feasible**, **viable** — and **ethical**.
- [ ] Results recorded above; failed assumptions triggered a **Pivot**, not a cover-up.
- [ ] MVP is the smallest slice that delivers the outcome and produces learning.

**Verdict:** `<Persevere | Persevere-with-actions | Pivot | Hold | Kill>` <!-- §2 -->
**Rationale (evidence-based):** TODO:
**Decision log:** `DEC-<nn>` in `_threads/Decision_Log.md` · recorded in `WORKFLOW.md` gate log.

### Open actions (for Persevere-with-actions / Hold)

| Action | Owner | Due | Risk accepted? |
|--------|-------|-----|----------------|
| TODO: | <name> | <YYYY-MM-DD> | <yes/no> |

## 7. Next step

- **On Persevere →** **P08 · Requirements & PRD** (pm-phase-08-prd): the validated `SOL-<nn>` + MVP scope become its input.
- **On Pivot →** loop back to: <Assumption_Map.md §2 (new `SOL-*`) / pm-phase-04-opportunity>.

---
*Owning skill: **pm-phase-07-solution-design**. Consumes `Assumption_Map.md`, `Prototype_Plan.md`, `Usability_Test_Plan.md`. Gate G5 owner. Downstream: pm-phase-08-prd. Cross-cutting: all six threads reviewed at G5.*
