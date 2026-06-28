---
Document: Portfolio View — <PORTFOLIO_OR_ORG_NAME>
Document ID: PORTVIEW-<PORTFOLIO_SLUG>-v1.0
Status: Living
Owner: Head of Product / Portfolio Owner
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Cross-cutting thread: Product Portfolio & Lifecycle Management (Conventions §10.6 — multi-product / optional).
Lives in _threads/Portfolio_View.md. Owning thread method: cross-cutting/Portfolio_Management.md.
A thread is scaled, never removed (Tailoring Guide §3) — a single-product team keeps a one-row version.
Reviewed continuously, not once a year. Feeds pm-phase-16-sunset for retirement candidates.
Conforms to ../05_Conventions.md (§3 IDs RMI-*/MET-*/DEC-*/RSK-*/DEP-*, §6 frontmatter/Living status,
§7 outcomes-over-outputs). Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example rows.
-->

# Portfolio View — <PORTFOLIO_OR_ORG_NAME>

## How to read this
*Continuous resource allocation, not an annual review.* This is the one place that answers
*"across everything we run, what do we start / scale / sustain / fix / sunset — and where does
capacity go?"* Allocation follows **strategic value and lifecycle stage**, not who lobbies hardest.
Measured by **outcomes**, not feature counts or product count.

## Principles
<!-- The guardrails that keep allocation honest. -->
- Allocate to **outcomes and strategic role**, not to the loudest sponsor (anti-HiPPO).
- Every product carries an **explicit lifecycle stage** and a **North Star (MET-*)**.
- Decisions are **continuous & reversible where possible**; guard against escalation-of-commitment (sunk cost).
- "Strategy first" — anchor to business outcomes, not AI-adoption or activity rates.

## Lifecycle stages (vocabulary)
<!-- Product Life Cycle. Each product sits in exactly one stage; re-confirm each review. -->
`Development` (pre-launch / 0→1) · `Introduction` (launched, finding traction) ·
`Growth` (scaling, retention proven) · `Maturity` (stable, optimise/defend) · `Decline` (sunset candidate → Phase 16).

---

## Portfolio register
<!-- One row per product/line. Allocation column MUST reconcile to 100% (see summary below).
"Trend" = direction of the North Star, not a vanity count. "Decision" is this cycle's allocation call. -->

| Product | Slug | Lifecycle stage | Strategic role | North Star (MET) | Trend | Allocation (% capacity) | Decision this cycle | Owner | Decision date |
|---|---|---|---|---|---|---|---|---|---|
| <Product A> | <slug-a> | Growth | Core | MET-<nn> <name> | ↑ / → / ↓ | <nn>% | <Scale> | <PM> | <YYYY-MM-DD> |
| <Product B> | <slug-b> | Introduction | Growth bet | MET-<nn> | ↑ | <nn>% | <Sustain> | <PM> | <YYYY-MM-DD> |
| <Product C> | <slug-c> | Maturity | Cash / defend | MET-<nn> | → | <nn>% | <Fix> | <PM> | <YYYY-MM-DD> |
| <Product D> | <slug-d> | Decline | — | MET-<nn> | ↓ | <nn>% | <Sunset → Phase 16> | <PM> | <YYYY-MM-DD> |
| TODO: <product> | <slug> | <stage> | <role> | MET-TBD | <↑/→/↓> | <nn>% | <Start/Scale/Sustain/Fix/Sunset> | <PM> | <YYYY-MM-DD> |

<!-- Decision vocabulary: Start · Scale · Sustain · Fix · Sunset. Strategic role examples:
Core · Growth bet · Cash/Defend · Explore/Option. A Sunset decision is recorded AND handed to Phase 16. -->

## Allocation summary
<!-- The capacity must add up. Make the trade-off visible: funding one product de-funds another. -->
- **Total capacity:** <teams / FTEs / $> — **must reconcile to 100%** across the register above.
- **By lifecycle stage:** Development <nn>% · Introduction <nn>% · Growth <nn>% · Maturity <nn>% · Decline <nn>%.
- **By bet horizon (mirrors roadmap):** Now (committed) <nn>% · Next (directional) <nn>% · Later/Explore <nn>%.
- **Reserved for keep-the-lights-on / tech debt:** <nn>% — *(don't plan to 100% of capacity).*
- TODO: confirm totals sum to 100% and reflect real, not aspirational, staffing.

## Screening view *(optional — a lens, not the strategy)*
<!-- BCG Growth-Share and GE-McKinsey 9-box are SCREENING tools only. Never reflexively dump "Dogs";
diagnose discoverability/usability/strategic-fit before a kill. -->
- **BCG quadrant (screen only):** Stars <…> · Cash Cows <…> · Question Marks <…> · Dogs <…> *(investigate before acting)*.
- **GE-McKinsey 9-box (market attractiveness × competitive strength):** <place products if used>.

## Lifecycle / allocation detail *(optional — per product needing a narrative)*
### <Product> — <slug>
- **Stage & why:** <stage> — <evidence: retention curve / NRR / usage trend>.
- **Strategic role & fit:** <how it serves company strategy> · North Star MET-<nn> = <value vs target>.
- **Allocation rationale:** <why this % — start/scale/sustain/fix/sunset> · changed from <prior %>.
- **Cannibalisation / overlap:** <does it compete with another portfolio product?> · DEP-<nn>.

## Sunset candidates → Phase 16
<!-- Decline-stage or low-leverage products. Set exit criteria up front to beat sunk-cost momentum. -->
- <Product/slug> — trigger: <usage/NRR/strategic-fit signal> · exit criteria: <…> · hand to `pm-phase-16-sunset` (`16_Sunset/Sunset_Decision.md`).
- TODO: <other candidate> — *(diagnose context before killing on a single low-usage number).*

## Cross-product dependencies & conflicts
<!-- Shared platform/teams/data create contention; surface it so allocation is real. -->
- DEP-<nn> — <shared platform / team / data> · couples <slug-a> ↔ <slug-b>.
- RSK-<nn> — <portfolio-level risk: key-person, concentration, conflicting roadmaps> (→ `_threads/Risk_Register.md`).

## Review cadence & change log
<!-- Living artifact, continuous cadence. Decisions recorded as DEC-* in _threads/Decision_Log.md. -->
- Cadence: <e.g. monthly portfolio review · quarterly re-allocation> (continuous, not annual lock).
- Decisions logged as: `DEC-<nn>` in `_threads/Decision_Log.md`.
- | Date | vX.Y | Change (product added / re-staged / re-allocated / sunset) | Why | By |
  |---|---|---|---|---|
  | <YYYY-MM-DD> | v1.0 | Portfolio opened | <reason> | <name> |

---
*Owning thread:* **Product Portfolio & Lifecycle Management** (`cross-cutting/Portfolio_Management.md`) ·
*Kept alive by:* every phase skill at loop step 7 (`02_AI_Product_Manager_Protocol.md` §7) ·
*Feeds:* **pm-phase-16-sunset** (retirement candidates) ·
*Companion threads:* **Decision_Log.md**, **Risk_Register.md**, **Responsible_Product_Review.md** ·
*Related templates:* **Roadmap.md** (per-product Now/Next/Later), **Sunset_Decision.md** ·
*Conventions:* ../05_Conventions.md
