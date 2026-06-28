---
Document: Competitive Analysis — <PRODUCT_NAME>
Document ID: CMP-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM / PMM>
Updated: <YYYY-MM-DD>
---

<!-- Phase 02 · Market & Competitive Research. Owning skill: pm-phase-02-market-research.
     Sibling templates: Market_Analysis.md · Positioning_Brief.md.
     Status is LIVING (Conventions §6): battlecards are CRM-triggered and continuously updated — never a quarterly website scrape.
     IDs (INS/OPP/RSK/DEC) follow ../05_Conventions.md §3.
     2026 RULE: GenAI commoditizes scraped public CI. The durable edge is PROPRIETARY BUYER INSIGHT (win/loss, churn) an LLM can't scrape.
     RULE: separate FACTS from INFERENCE; triangulate ≥2 sources per claim; never invent a competitor capability or a win/loss quote. -->

# Competitive Analysis — <PRODUCT_NAME>

> _BLUF: who the buyer actually evaluates, where we win/lose, and the decision this should change._
> TODO: <e.g. "Status quo wins ~40% of losses on 'no urgency'; our wedge vs <Competitor> is <…>.">

**CI exists to change a decision, not to fill a deck.** A battlecard nobody acts on is theatre (Conventions §7).

---

## 1. Alternatives landscape (start with "do nothing")

<!-- List the alternatives a real buyer weighs — in this order. ~40% of B2B deals are lost to NO DECISION, so the status quo
     is competitor #1. No phantom competitors (ones no buyer actually evaluates). -->

| Type | Alternative | Why the buyer picks it | How often we hit it | Card below |
|---|---|---|---|---|
| **Status quo / do-nothing** | <"keep using <spreadsheet/manual process/incumbent>", "do nothing"> | <inertia, no budget, no urgency, switching cost> | <freq / % of losses> | §2.0 |
| **Direct** | <competitor in our category> | <…> | <…> | §2.1 |
| **Indirect** | <adjacent tool solving the job differently> | <…> | <…> | §2.x |
| **Non-consumption** | <segment not solving the job at all yet> | <…> | <…> | <…> |

---

## 2. Battlecards _(one per real alternative — keep each Living)_

<!-- Triangulate ≥2 sources per claim. Tag each line [FACT: source] or [INFERENCE]. Sources: win/loss INS-*, customer calls,
     analyst, public docs, hands-on. Update on a CRM trigger (deal lost/won, competitor launch), not a calendar. -->

### 2.0 Status quo / "do nothing" card  ← _your first competitor_
- **The buyer's status quo:** <what they do today instead of buying anything>
- **Why they stay (forces of inertia):** <no perceived cost of inaction, switching effort, risk aversion> [FACT/INFERENCE: <source>]
- **Where it "wins":** <good-enough, free, familiar, no procurement>
- **Where we win — the cost of inaction:** <quantify the pain of not acting; "why now"> (→ feeds `Positioning_Brief.md` value)
- **Trap / objection → handling:** <"we'll build it ourselves" / "not a priority"> → <buyer-validated response>
- **Decision this card informs:** `DEC-<nn>` — <e.g. messaging leads with cost-of-inaction, not feature parity>

### 2.1 Competitor: <NAME>
- **What they do · target buyer · pricing/packaging:** <one line each> [FACT: <source>]
- **Where they win (be honest):** <strengths buyers cite> [FACT: <win/loss INS-<nn>>]
- **Where we win:** <our genuine edge vs them — capability, not adjective> [FACT/INFERENCE: <source>]
- **Buyer-validated traps (don't assert — quote):** <…> (← `INS-<nn>`)
- **Objection → handling:** <"<their objection>"> → <our response>
- **Watch / weak signals:** <recent launches, pricing moves, hiring> · source: <…>
- **Decision this card informs:** `DEC-<nn>` — <what changes in sales/product/positioning>

### 2.x Competitor: <NAME>
<!-- Duplicate the 2.1 block per real competitor. Cut any card that informs no decision. -->

---

## 3. Win/Loss — the backbone of CI

<!-- THE highest-value, least-scrapable input. Interview won/LOST buyers within ~14 days of the decision. ~85% of CRM-logged
     loss reasons are wrong; buyer vs. seller explanations align only ~15% — so reconcile both columns, don't trust the CRM field. -->

| Deal / segment | Outcome | CRM-logged reason | Buyer's actual reason (interview) | Source `INS-*` | Action |
|---|---|---|---|---|---|
| <deal> | Won / Lost / No-decision | <field value> | <what the buyer said> | `INS-<nn>` | <card/decision updated> |

**Tiered CI model:** live interviews for strategic deals · AI-moderated for the long tail · surveys for trends.
<!-- AI synthesizes transcripts/tickets/reviews and runs long-tail interviews; the HUMAN owns strategic interviews + the call.
     MCP connectors can make this CI queryable by the LLM as a live source. -->

---

## 4. Pattern synthesis & surfaced nodes

- **Where rivals cluster / common gaps:** <…> → candidate `OPP-<nn>` for P04.
- **Underserved segment / wedge:** <…> → `OPP-<nn>`.
- **Durable findings:** `INS-<nn>` — <finding> · ≥2 sources: <…>.
- **Competitive risks:** `RSK-<nn>` — <e.g. incumbent bundles our feature> (Conventions §5.3).
- **Decisions:** `DEC-<nn>` — <positioning / GTM / roadmap response>.

---

## 5. Sources & freshness log

<!-- Living artifact: log each update so the card's age is visible. Honor truthful, non-deceptive claims and lawful sourcing
     (no improper scraping / ToS breach). If AI generated any content here, label it — EU AI Act Art. 50 (from Aug 2026). -->

| Date | What changed | Trigger (deal/launch) | Source(s) | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | <e.g. added <Competitor> card> | <…> | <…> | <…> |

---

## Health check _(done-when — supporting phase, no hard gate)_

- [ ] Alternatives **start with the status quo / do-nothing**; no phantom competitors.
- [ ] CI is **buyer-grounded** (win/loss-led); facts separated from inference; **≥2 sources per claim**.
- [ ] Loss reasons reconciled buyer-vs-seller (not taken from the CRM field).
- [ ] Every card **ties to a decision** (`DEC-*`); cards that change nothing are cut.
- [ ] Candidate `OPP-*` / `RSK-*` / `INS-*` surfaced for P04; freshness log current.
- [ ] Responsible-product floor: truthful claims, lawful sourcing, AI content labeled.

---

_Related: `Market_Analysis.md` (sizes the alternatives) · `Positioning_Brief.md` (component 1 = these alternatives) · downstream `04_Opportunity/Business_Case.md`, `11_Launch/GTM_Plan.md`. Conforms to `../05_Conventions.md`. Run via `pm-phase-02-market-research`._
