---
Document: Market Analysis — <PRODUCT_NAME>
Document ID: MKT-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <PM>
Updated: <YYYY-MM-DD>
---

<!-- Phase 02 · Market & Competitive Research. Owning skill: pm-phase-02-market-research.
     Sibling templates: Competitive_Analysis.md · Positioning_Brief.md.
     Supporting phase — no gate of its own; this feeds G1 (Strategy Sign-off, P01) and G3 (Opportunity Go/No-Go, P04).
     IDs (OPP/INS/ASM/RSK/DEC/MET/JOB) follow ../05_Conventions.md §3 — never redefine them here.
     RULE: never fabricate a market number, source, or quote. Unknown → "TODO: <what's owed>" + how to get it. -->

# Market Analysis — <PRODUCT_NAME>

> _One-line BLUF: how big the defensible opportunity is and why it's worth our strategy._
> TODO: <e.g. "SOM ~$<X>M in <horizon>; underserved segment is <…>; bet rests on ASM-01.">

---

## 1. Market definition (demand-side)

<!-- Define by PEOPLE + the functional JOB, never by your product category or a demographic.
     Reuse the job from 03_Discovery/JTBD.md if it exists; do not re-derive it. A wrong definition poisons every number below. -->

- **People (segment / buyer):** <who has the job; the economic buyer if B2B>
- **Functional job (in the customer's words):** <"When ___, I want to ___, so I can ___"> (← `JOB-<nn>` / P03)
- **In scope:** <use cases, geos, channels we count>
- **Out of scope:** <explicitly excluded — guards against TAM inflation>
- **Type:** <B2B | B2C | B2B2C> · **Stage:** <0→1 | scaling>

_If you can't name the job in the customer's words, stop and loop to `pm-phase-03-discovery` first._

---

## 2. Sizing — two methods, reconciled

<!-- Top-down = the outer BOUND (analyst $ ÷ slices). Bottom-up = the number you DEFEND (accounts×ACV or users×ARPU).
     Reconcile within ~15%; explain any larger gap. NEVER write "capture 1% of $X B". SOM is the bottom-up number. -->

| Layer | Top-down (source) | Bottom-up (math) | Reconciled (within ±15%?) | Riskiest assumptions |
|---|---|---|---|---|
| **TAM** — total demand for the job | <$<X>; analyst/source> | <total accounts × ACV  /  total users × ARPU> | <$<X> · gap: <±%>> | `ASM-<nn>` <…> |
| **SAM** — what we can serve today | <$<X>; serviceable slice logic> | <reachable accounts × ACV> | <$<X> · gap: <±%>> | `ASM-<nn>` <…> |
| **SOM** — what we can win near-term | <n/a or share-based> | <reach × realistic win-rate × ACV> | **<$<X> — the number we defend>** | `ASM-<nn>` <…> |

**Sizing assumptions (full list — every number above rests on these):**
- `ASM-<nn>` — <assumption, e.g. "ACV holds at $<X>">; evidence: <source / TODO: validate>; → test in P07.
- `ASM-<nn>` — <assumption>; evidence: <…>.

<!-- Flag the 1–2 riskiest assumptions for P07 (Solution Discovery) and P04's Business_Case.md.
     Data sources to cite: analyst (Gartner/Forrester/IDC/Statista), CRM, product usage, public filings. -->

---

## 3. Macro & weak-signal scan (PESTEL)

<!-- For each force, note only what changes THE BET. AI-surfaced trends are ~70-85% precision near-term and DEGRADE with
     horizon — a human validates each; record the precision/horizon caveat and the source. -->

| Force | Trend / signal | Source | Precision/horizon caveat | So-what for the bet |
|---|---|---|---|---|
| Political/regulatory | <…> | <…> | <…> | <…> |
| Economic | <…> | <…> | <…> | <…> |
| Social | <…> | <…> | <…> | <…> |
| Technological | <…> | <…> | <…> | <…> |
| Environmental | <…> | <…> | <…> | <…> |
| Legal/compliance | <e.g. EU AI Act, WCAG, GDPR> | <…> | <…> | <…> |

---

## 4. Structural forces — Porter's Five Forces _(conditional)_

<!-- Run ONLY for structural / capital-intensive / regulated industries. For most software, the real alternatives are the
     status quo + non-consumption (see Competitive_Analysis.md) — skip this and write "N/A — software; alternatives covered in CMP". -->

- **Rivalry among incumbents:** <…>
- **Threat of new entrants:** <…>
- **Buyer power:** <…>
- **Supplier power:** <…>
- **Substitutes / non-consumption:** <…>
- **(Update for ecosystems / co-opetition):** <platform & complementor dynamics>

---

## 5. Surfaced for downstream (wire the traceability spine)

<!-- This is how P02 earns its keep: every finding becomes a typed node another phase consumes. See §4 of Conventions. -->

- **Candidate opportunities → P04 Opportunity Solution Tree:** `OPP-<nn>` — <underserved segment / unmet need>.
- **Durable findings (shared with P03 insight repo):** `INS-<nn>` — <finding> · source: <…>.
- **Market / competitive risks:** `RSK-<nn>` — <risk>; likelihood×impact: <L×I> (Conventions §5.3).
- **Decisions logged:** `DEC-<nn>` — <market-definition / sizing-method decision> · rationale: <…>.
- **Measurable market signals → P12:** `MET-<nn>` — <market-share / category metric> _(if tracked)_.

---

## 6. Open items (`TODO` with owners — clear before G1 / G3)

- [ ] TODO: <owed artifact or validation> — owner: <name> — due: <YYYY-MM-DD>.

---

## Health check _(done-when — supporting phase, no hard gate)_

- [ ] Market defined **demand-side** (segment + functional job), not category/demographic.
- [ ] TAM/SAM/SOM sized **two ways and reconciled** (~15%); **SOM is the defensible bottom-up number**; no "1% of $X B".
- [ ] Every sizing assumption stated; riskiest flagged `ASM-*` for P04/P07.
- [ ] AI-surfaced trends **human-validated**; precision/horizon caveats recorded.
- [ ] Candidate `OPP-*` / `RSK-*` / `INS-*` / `DEC-*` surfaced; no claim rests on zero evidence.

---

_Related: `Competitive_Analysis.md` (alternatives incl. do-nothing) · `Positioning_Brief.md` (turns this into positioning) · upstream `01_Strategy/Product_Strategy.md`, `03_Discovery/JTBD.md` · downstream `04_Opportunity/Business_Case.md`. Conforms to `../05_Conventions.md`. Run via `pm-phase-02-market-research`._
