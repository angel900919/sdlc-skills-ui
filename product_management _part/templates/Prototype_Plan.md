---
Document: Prototype Plan — <SOLUTION / FLOW NAME>
Document ID: PROTO-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role/name — default: Product Manager>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 07 · Solution Discovery & Design (skill: pm-phase-07-solution-design).
Prototyping is the cheapest way to learn AND (2026) to align stakeholders — "prototype as spec"
increasingly IS the spec. Build the LOWEST fidelity that answers the open question; go hi-fi
ONLY for the final desirability/usability proof. A hi-fi prototype ≠ a shipped product (SVPG).
Conforms to ../05_Conventions.md: IDs §3, traceability spine §4, frontmatter §6.
Replace every <ANGLE_BRACKET>; leave unknowns as `TODO:`. Delete example rows before sharing.
Related: Assumption_Map.md (the ASM-* this de-risks) · Usability_Test_Plan.md · Solution_Validation.md.
-->

## 1. What we're prototyping & why

- **Solution:** `SOL-<nn>` — <one line> <!-- from Assumption_Map.md §2 -->
- **Assumption(s) under test:** `ASM-<nn>`, `ASM-<nn>` <!-- the riskiest, high-importance × low-evidence -->
- **Experiment(s):** `EXP-<nn>` <!-- the Test Card this prototype executes -->
- **Outcome at stake:** `OBJ-<nn>`/`KR-<nn>` → moves `MET-<nn>`
- **Decision this unblocks:** <Persevere on SOL / pick between SOL-A vs SOL-B / spec the MVP> <!-- name the decision the prototype lets us make -->

## 2. Fidelity by question (the core table — fidelity follows the question, not taste)

<!-- For EACH open question, choose the LOWEST fidelity that answers it.
Fidelity ladder: Sketch/Paper → Wireframe (lo-fi) → Clickable (mid-fi, Figma) →
High-fidelity (interactive, real content) → Live-data / Wizard-of-Oz / Fake-door.
Rule of thumb: flow & desirability → lo-fi; usability or FINAL desirability → hi-fi. -->

| # | Open question (what we don't know) | ASM | Fidelity chosen | Why this fidelity (not higher) | Method/tool | Metric & pass/fail threshold |
|---|------------------------------------|-----|-----------------|--------------------------------|-------------|------------------------------|
| 1 | TODO: <will users grasp the core flow?> | ASM-<nn> | Lo-fi clickable | Flow comprehension needs no real data | <Figma/paper> | <≥ 4/5 complete unaided> |
| 2 | TODO: <is the value compelling enough to act?> | ASM-<nn> | Fake-door / landing | Desirability ≠ build; measure intent first | <fake-door> | <≥ X% click / sign-up> |
| 3 | TODO: <can users actually complete task X?> | ASM-<nn> | Hi-fi interactive | Usability needs real interaction | <Figma/coded> | <task success ≥ X%, time ≤ Ys> |
| 4 | TODO: <is the AI/edge behavior acceptable?> | ASM-<nn> | Wizard-of-Oz | Test behavior before building the engine | <concierge> | <acceptable in ≥ X/n cases> |

> *If a row's fidelity is "hi-fi" but the question is about flow or appetite, drop it down — hi-fi build masquerading as a prototype = sunk effort, slow learning.*

## 3. Scope of the prototype

- **In (screens/flows/states built):** <…>
- **Faked / hard-coded (not real):** <data, integrations, logic stubbed> <!-- be explicit so testers/stakeholders aren't misled -->
- **Out (not in this prototype):** <…>
- **Realistic content:** <use real-sounding copy/data from calls/tickets, not lorem ipsum>

## 4. Build plan

| Item | Owner | Tool | Est. effort | Ready by |
|------|-------|------|-------------|----------|
| <screens / clickable flow> | <name> | <Figma/Lovable/v0/code> | <hrs/days> | <YYYY-MM-DD> |
| <test data / script> | <name> | <…> | <…> | <YYYY-MM-DD> |

## 5. How it will be tested

- **Method:** <moderated usability / unmoderated / fake-door analytics / interview-with-prototype>
- **Plan reference:** desirability + flow here; structured usability tasks → `Usability_Test_Plan.md` (`UTP-<PRODUCT_SLUG>`).
- **Participants:** <n, in-segment per `PER-<nn>`> <!-- ~5 is fine for qualitative iteration; NOT for quantitative claims -->
- **Accessibility note:** if this prototype is the usability proof, the WCAG 2.2 AA floor applies — see `Usability_Test_Plan.md` §6.

## 6. Success / kill criteria (decide before you run — avoid post-hoc rationalizing)

- **Persevere if:** <thresholds in §2 met>
- **Pivot if:** <core desirability/usability assumption disconfirmed> → back to `Assumption_Map.md` §2 (new `SOL-*`) or pm-phase-04-opportunity.
- **Results recorded in:** `Solution_Validation.md` (`VAL-<PRODUCT_SLUG>`).

## 7. Open items / TODO

- TODO: <unresolved build/test question — who — by when>

---
*Owning skill: **pm-phase-07-solution-design**. Executes the Test Cards from `Assumption_Map.md`; results land in `Solution_Validation.md` toward **G5 · Solution Validated**. Cross-cutting: Metrics & Experimentation, Stakeholder Management (a working prototype beats a spec for buy-in).*
