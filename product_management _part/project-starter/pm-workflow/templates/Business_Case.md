---
Document: Business Case — <OPPORTUNITY>
Document ID: BIZCASE-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
WHAT THIS IS — A LEAN, assumption-driven viability case for the selected opportunity. It answers
"does this work for the business?" with RANGES and SENSITIVITY — not a single false-precision
multi-year ROI number. It is the viability evidence behind the G3 Go/No-Go in Opportunity_Assessment.md.

HOW TO USE — Replace every <ANGLE_BRACKET>; resolve every "TODO: <owed — by whom — by when>".
State the assumption behind every figure. Never invent a cost, price, or market number — an
unknowable value is an ASM-* with a research/interview action, not a fabricated number.
Right-size rigour to the tailoring profile and reversibility: two-way door → this one-pager,
decide fast; one-way door / large capital → add sensitivity depth + sponsor sign-off.

STATUS LIFECYCLE — Draft → In Review → Approved (G3-approved <YYYY-MM-DD>). Revisit per increment
(Conventions §6). Owning skill: pm-phase-04-opportunity. Conforms to ../05_Conventions.md (§6, §7).
-->

# Business Case

> *Lean and revisited per increment — not a heavy single-shot forecast.*
> *AI drafts; the human owns the assumptions, the sensitivity ranges, and the go/no-go.*

---

## 0. Framing

- **Opportunity:** `OPP-<nn>` — <need / pain / desire> *(full assessment: Opportunity_Assessment.md)*
- **Outcome served:** `OBJ-<nn>` / `KR-<nn>`
- **Value metric (how the win is measured):** `MET-<nn>` (or `MET-TBD`, owed to pm-phase-12-analytics) — <metric: current → target>
- **Door type:** <Two-way (reversible — lean case, decide fast) | One-way (irreversible — fuller case + sign-off)>
- **Time horizon for this case:** <e.g. 12 months> *(state it; don't model further than you can defend)*
- **Tailoring profile:** <Solo/Lean · Standard · Enterprise/Formal>

---

## 1. The case at a glance (ranges, not a point estimate)

<!-- Low / Expected / High are scenarios, NOT padding. State the assumption that drives each lever.
"Value/benefit" can be revenue, cost saved, retention/time saved — whatever MET captures. Keep
costs as build (one-off) AND run (ongoing) so payback is honest. -->

| Lever | Low | Expected | High | Driving assumption (`ASM-nn`) |
|---|---|---|---|---|
| **Value / benefit** (per <period>) | <…> | <…> | <…> | <e.g. adoption %, price, time saved> |
| **Cost to build** (one-off) | <…> | <…> | <…> | <eng weeks × rate, vendor, etc.> |
| **Cost to run** (per <period>) | <…> | <…> | <…> | <infra, support, COGS, licences> |
| **Net** (value − run cost) | <…> | <…> | <…> | — |
| **Payback / break-even** | <…> | <…> | <…> | <build cost ÷ net> |

<!-- TODO: confirm any market/price/cost figure via research or finance — cite source + year. -->

---

## 2. Value logic (where the benefit comes from)

<!-- Make the mechanism explicit: which input metric moves, by how much, for how many users.
This is the bottom-up reach × value from Opportunity_Assessment.md §2 — keep them consistent. -->

- **Benefit driver:** <reach (#users) × value per user × frequency> = <…>
- **Confidence in the driver:** <High / Medium / Low> — <why>
- **Leading indicator we'll watch early:** `MET-<nn>` — <what tells us it's working in weeks, not quarters>

---

## 3. Viability (business model fit)

<!-- The "business viability" risk from Opportunity_Assessment.md, made concrete: can we charge/
fund it, sell it, support it, and stay compliant? Use Business Model Canvas / Lean Canvas lens. -->

- **Pricing / packaging / funding model:** <how value is captured or funded>
- **Go-to-market & sales motion fit:** <PLG / sales-led / channel — consistent with pm-phase-11-launch>
- **Cost structure & unit economics:** <key drivers; gross-margin sanity check if applicable>
- **Legal / compliance / brand fit:** <GDPR, EU AI Act, contractual, reputational — link `RSK-nn`>
- **Dependencies & constraints:** `DEP-<nn>` / `C`-class constraints — <platform, capacity, partner>

---

## 4. Sensitivity — what breaks the case

<!-- The most important section of a lean case. Name the 2-3 assumptions the result is MOST
sensitive to: vary each across its Low/High and show whether the case survives. This is where a
weak opportunity gets caught. -->

| Sensitive assumption (`ASM-nn`) | Swing (Low ↔ High) | Effect on net / payback | Case still holds? |
|---|---|---|---|
| <e.g. adoption rate> | <x% ↔ y%> | <…> | <Yes / No / Marginal> |
| <e.g. run cost / COGS> | <…> | <…> | <…> |
| <e.g. price / willingness to pay> | <…> | <…> | <…> |

- **Break-the-case threshold:** <the single number that, if worse than X, makes this a No-Go>
- **Riskiest assumption to validate first:** `ASM-<nn>` → test via `EXP-<nn>` (pm-phase-07 / pm-phase-13)

---

## 5. Cost of NOT doing it (the do-nothing baseline)

<!-- Status quo is a real option (≈40% of B2B deals are lost to "no decision"). Quantify the cost
of inaction so "do nothing" is compared fairly against the bet. -->

- **Opportunity cost / risk if we pass:** <churn, competitive loss, compounding pain, missed window>
- **Reversibility note:** <what it costs to undo if we proceed and we're wrong>

---

## 6. Recommendation (feeds the G3 decision)

<!-- One line; the formal verdict + sign-off live in Opportunity_Assessment.md §5 / Decision_Log. -->

- **Viability verdict:** <Viable — proceed | Viable with conditions | Not viable at current assumptions>
- **Conditions / what would change it:** <…>
- **Logged as:** `DEC-<nn>` in `../_threads/Decision_Log.md` *(decision recorded in Opportunity_Assessment.md)*

---

### Links
- **Owning skill:** pm-phase-04-opportunity — `../skills/pm-phase-04-opportunity/SKILL.md`
- **Sibling deliverables:** [Opportunity_Assessment.md](Opportunity_Assessment.md) (primary G3 call) · [Opportunity_Solution_Tree.md](Opportunity_Solution_Tree.md)
- **Upstream:** `../02_Market/Market_Analysis.md` (TAM/SAM/SOM) · `../01_Strategy/North_Star_and_OKRs.md` (`OBJ/KR/MET`)
- **Downstream:** `../07_Solution/Assumption_Map.md` (tests `ASM-*`) · `../12_Analytics/Measurement_Plan.md` (`MET-*`)
- **Threads:** `../_threads/Decision_Log.md` · `../_threads/Risk_Register.md` · `../cross-cutting/Responsible_Product.md`
- **Convention contract:** `../05_Conventions.md` · **Framework cards:** `../frameworks/` (Lean Business Case — SAFe · Business Model / Lean Canvas)
