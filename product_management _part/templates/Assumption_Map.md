---
Document: Assumption Map — <OPPORTUNITY / SOLUTION NAME>
Document ID: ASM-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role/name — default: Product Manager>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 07 · Solution Discovery & Design (skill: pm-phase-07-solution-design).
★ Gating artifact for G5 · Solution Validated. This is a LIVING artifact — bump Status to
`Living` once the OST is wired up; keep testing as the bet evolves.
Conforms to ../05_Conventions.md: IDs §3, traceability spine §4, severity §5.3, frontmatter §6.
Frameworks: Four Big Risks (SVPG) · Five Types of Assumptions (Torres) · Assumptions Mapping +
Test Cards (Strategyzer) · Opportunity Solution Tree (Torres).
Replace every <ANGLE_BRACKET>; leave unknowns as `TODO: <what — who — by when>`. NEVER invent
evidence, quotes, metrics, or feasibility verdicts. Delete example rows before sharing.
Related templates: Prototype_Plan.md · Usability_Test_Plan.md · Solution_Validation.md.
-->

## 1. Context (traceability — cross-reference by ID, never re-describe)

- **Opportunity solved:** `OPP-<nn>` — <one line> <!-- from P04/G3; if missing → STOP, route to pm-phase-04-opportunity -->
- **Desired outcome:** `OBJ-<nn>` / `KR-<nn>` — <the metric this bet must move> <!-- outcomes over outputs §7 -->
- **Roadmap commitment:** `RMI-<nn>` (in *Now*) <!-- from P05/G4; confirm it's actually committed -->
- **Evidence base:** `INS-<nn>`, `JOB-<nn>`, `PER-<nn>` <!-- every desirability claim traces to one of these -->
- **North Star / metric moved:** `MET-<nn>` <!-- the bet names a metric; MET-TBD if not yet assigned -->

## 2. Solutions under test (diverge — carry 2–3, never 1)

<!-- Each SOL-* is a leaf on the OST under its OPP-*. One solution per opportunity is an
anti-pattern — if only one approach exists, it's a solution masquerading as an opportunity. -->

| SOL | Description (one line) | OPP served | Outcome (OBJ/KR) | Biggest risk | Carried fwd? |
|-----|------------------------|------------|------------------|--------------|--------------|
| SOL-01 | TODO: | OPP-<nn> | OBJ-<nn>/KR-<nn> | <risk type> | <yes/no — DEC-<nn>> |
| SOL-02 | TODO: | OPP-<nn> | OBJ-<nn>/KR-<nn> | <risk type> | <yes/no> |
| SOL-03 | TODO: | OPP-<nn> | OBJ-<nn>/KR-<nn> | <risk type> | <yes/no> |

> Converge choice logged as `DEC-<nn>` in `_threads/Decision_Log.md`. *Falling in love with one option before evidence is the anti-pattern; comparing 2–3 on evidence is the discipline.*

## 3. Assumption inventory (importance × evidence — all FIVE risk types)

<!-- Risk types: Desirability/Value · Usability · Feasibility · Business-Viability · Ethical.
FORCE at least one Ethical and one Viability assumption — ethics is a first-class assumption
(Torres's 5th), not a launch-day checkbox. Importance & Evidence each H/M/L. -->

| ASM | Risk type | Statement ("we assume that…") | SOL | Importance | Evidence | Riskiest? | Test |
|-----|-----------|-------------------------------|-----|------------|----------|-----------|------|
| ASM-01 | Desirability | TODO: <customers will…> | SOL-01 | H | L | ✅ | EXP-<nn> |
| ASM-02 | Usability | TODO: <users can…> | SOL-01 | H | M | | EXP-<nn> |
| ASM-03 | Feasibility | TODO: confirm with eng — by <date> | SOL-01 | H | L | ✅ | EXP-<nn> |
| ASM-04 | Business-Viability | TODO: <the business/legal works because…> | SOL-01 | M | L | | EXP-<nn> |
| ASM-05 | Ethical | TODO: <no harm/bias/privacy issue because…> | SOL-01 | H | L | ✅ | EXP-<nn> |

## 4. Assumptions map (the 2×2 — plot every ASM)

<!-- Strategyzer Assumptions Mapping. The test zone is HIGH importance × LOW evidence
(top-left): the most DANGEROUS assumptions, not the easiest or most fun. Place each ASM-id
in the cell that matches its row above. -->

```
 IMPORTANT
   ▲
 H │  ⚑ TEST THESE FIRST          │  Known / supported
   │  (high importance · low      │  (high importance ·
   │   evidence — riskiest)       │   high evidence)
   │  e.g. ASM-01, ASM-03, ASM-05 │  e.g. ASM-__
   ├──────────────────────────────┼──────────────────────────
   │  Park / monitor              │  Footnotes
 L │  (low importance ·           │  (low importance ·
   │   low evidence)              │   high evidence)
   │  e.g. ASM-__                 │  e.g. ASM-__
   └──────────────────────────────┴────────────────────────▶
     LOW EVIDENCE                   HIGH EVIDENCE
```

## 5. Riskiest assumptions — ranked & test cards

<!-- Rank by importance × (1 − evidence). Test the riskiest first. For each, write a Test Card
(hypothesis · test · metric · pass/fail threshold). Pick the CHEAPEST method that yields the
learning — interview, fake-door, concierge/Wizard-of-Oz, prototype. Two-way door → run cheap
test now; one-way door → demand stronger evidence first. -->

### Rank 1 — `ASM-<nn>` (`<risk type>`)
- **Hypothesis:** We believe `<…>`.
- **Test (`EXP-<nn>`):** <method — cheapest that yields the learning>
- **Metric:** `MET-<nn>` / <what we'll observe>
- **Pass/fail threshold:** We're right if `<≥ X / quote pattern>`; wrong if `<…>`.
- **Owner · by when:** <name> · <YYYY-MM-DD>
- **If it fails:** <Pivot to step 2 (new SOL) / route to pm-phase-04-opportunity / Kill> — a disconfirmed load-bearing assumption is a **finding**, not a setback.

### Rank 2 — `ASM-<nn>` (`<risk type>`)
<!-- copy the block above -->

### Rank 3 — `ASM-<nn>` (`<risk type>`)
<!-- copy the block above -->

## 6. Test plan links

- **Prototype tests →** see `Prototype_Plan.md` (`PROTO-<PRODUCT_SLUG>`).
- **Usability tests →** see `Usability_Test_Plan.md` (`UTP-<PRODUCT_SLUG>`).
- **Results & decisions →** recorded in `Solution_Validation.md` (`VAL-<PRODUCT_SLUG>`).

## 7. Open items / TODO

- TODO: <missing evidence or unconfirmed feasibility — who — by when>

---
*Owning skill: **pm-phase-07-solution-design**. Upstream: pm-phase-04-opportunity (`OPP-*`). Next: feeds `Prototype_Plan.md` → `Solution_Validation.md` → G5. Cross-cutting: Continuous Discovery, Metrics & Experimentation, Responsible Product.*
