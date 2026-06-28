---
Document: Positioning Brief — <PRODUCT_NAME>
Document ID: POS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <PM / PMM>
Updated: <YYYY-MM-DD>
---

<!-- Phase 02 · Market & Competitive Research. Owning skill: pm-phase-02-market-research.
     Sibling templates: Market_Analysis.md · Competitive_Analysis.md.
     Framework: April Dunford, *Obviously Awesome* — fill the FIVE components IN ORDER (1→5). Positioning is deliberate
     context, NOT a tagline. Work bottom-up from real alternatives; the category is the LAST thing you decide, not the first.
     IDs (DEC/MET/INS/OPP) follow ../05_Conventions.md §3. Never invent a buyer-value claim — tie it to evidence or mark TODO. -->

# Positioning Brief — <PRODUCT_NAME>

> _BLUF: for <best-fit segment>, the value we make obvious is <value>, because only we <unique attribute>._

**Anti-pattern guard:** if you started from the category or tagline you *want*, you did it backwards. Run components 1→5 in order.

---

## 1. Competitive alternatives
<!-- What the buyer would use if we didn't exist. PULL FROM Competitive_Analysis.md — and INCLUDE the status quo / do-nothing
     (it's the most common alternative). This anchors everything below: value only exists relative to an alternative. -->

- Status quo / do-nothing: <…> (← `Competitive_Analysis.md` §2.0)
- <Alternative / competitor>: <…>
- <Alternative / competitor>: <…>

## 2. Unique attributes
<!-- What we have that the alternatives don't — CAPABILITIES and features, not adjectives. "Real-time X", not "powerful/intuitive".
     If an alternative also has it, it isn't unique — cut it. -->

- <attribute — a thing we have/do that they don't>
- <attribute>
- <attribute>

## 3. Value (that those attributes enable)
<!-- For each unique attribute, the VALUE it unlocks, in the BUYER'S terms (outcome/$/time/risk). Map attribute → value → who cares.
     Where the value is measurable, tag a MET-* so P12 can instrument it. -->

| Unique attribute (§2) | Enables this value | In the buyer's terms | Measurable? |
|---|---|---|---|
| <attribute> | <value> | <"saves <X> hrs / cuts <Y>% / removes <risk>"> | `MET-<nn>` / n/a |
| <attribute> | <value> | <…> | `MET-<nn>` / n/a |

## 4. Best-fit customers
<!-- The segment that cares MOST about the §3 value (and will pay / adopt fastest). Name the characteristics that predict fit,
     not a demographic. This sharpens — it's who you win with, not everyone you could sell to. -->

- **Best-fit segment:** <who> (← `Market_Analysis.md` SAM/SOM logic, `PER-<nn>`)
- **Trigger / "why now":** <the event that makes them act — pairs with status-quo cost-of-inaction>
- **Disqualifiers (who this is NOT for):** <…>

## 5. Market category
<!-- The frame that makes the §3 value OBVIOUS — the context the buyer uses to understand you. Decide LAST.
     Sequencing choice below: position within an existing category (default) vs design a new one (rare). -->

- **Category frame:** <"the <category> for <best-fit segment>">
- **Why this frame makes the value obvious:** <…>

### Sequencing decision: positioning-first vs category design
<!-- Category design only for genuine reframers inventing a new category with budget to evangelize it. For most $5M–$75M firms,
     position within an existing category first. Record the choice and the why as a DEC-*. -->

- **Choice:** <positioning-first | category design>
- `DEC-<nn>` — rationale: <why; budget/reframe reality check>

---

## Positioning statement & sales-pitch frame _(derived, not authored first)_

<!-- Only AFTER 1→5. Keep it internal-facing; messaging/campaigns derive from this, not the reverse. -->

> For **<best-fit customers>** who **<have this job / trigger>**, **<PRODUCT_NAME>** is a **<market category>** that **<value>**. Unlike **<top alternative incl. status quo>**, we **<unique attribute>**.

- **Lead with (the buyer hears this first):** <"why now" + value>, then "what's new".

---

## Surfaced for downstream

- **Decisions:** `DEC-<nn>` — positioning choice · `DEC-<nn>` — category sequencing.
- **Measurable value claims → P12:** `MET-<nn>` <…>.
- **Insights / gaps feeding strategy & opportunity:** `INS-<nn>` / `OPP-<nn>` <…>.
- **Open items:** TODO: <unvalidated value claim> — owner: <name> — due: <YYYY-MM-DD>.

---

## Health check _(done-when — supporting phase, no hard gate)_

- [ ] Components filled **in Dunford order** (alternatives → attributes → value → segment → category); not tagline-first.
- [ ] Alternatives include the **status quo / do-nothing**.
- [ ] Attributes are **capabilities**, not adjectives; each maps to a buyer **value**.
- [ ] Best-fit segment is sharp (with disqualifiers); value claims are **evidence-backed**, not invented.
- [ ] Positioning-first vs category design recorded as `DEC-*` with rationale.
- [ ] `DEC-*` / `MET-*` surfaced for P01/P12; aligns exec + GTM + sales.

---

_Related: `Competitive_Analysis.md` (feeds component 1) · `Market_Analysis.md` (feeds the segment/value) · downstream `01_Strategy/Product_Strategy.md`, `11_Launch/GTM_Plan.md` (reuses this for messaging). Conforms to `../05_Conventions.md`. Run via `pm-phase-02-market-research`._
