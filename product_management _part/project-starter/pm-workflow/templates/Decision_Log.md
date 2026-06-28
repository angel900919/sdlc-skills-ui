---
Document: Decision Log — <PRODUCT_NAME>
Document ID: DECLOG-<PRODUCT_SLUG>-v1.0
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Cross-cutting thread: Stakeholder Management & Communication (Conventions §10.1).
Lives in _threads/Decision_Log.md. Owning thread method: cross-cutting/Stakeholder_Management.md.
Every phase skill (pm-phase-00 … pm-phase-16) appends to this at loop step 7 (Protocol §7) —
it is not "phase output"; it accretes across the whole lifecycle and is reviewed at every gate.
Conforms to ../05_Conventions.md (§2 gate vocabulary, §3 IDs DEC-*, §4 traceability spine,
§5 severity/priority, §6 frontmatter/Living status, §7 outcomes-over-outputs).
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Status stays LIVING for the life of the product — a decision log is never "Approved-and-frozen".
-->

# Decision Log — <PRODUCT_NAME>

## How to read this
*The product's institutional memory.* Every **material, hard-to-reverse, or contested** decision
is recorded here with its **context, options, owner, and rationale** — so anyone can answer
*"why did we decide this?"* later, and so we never silently re-litigate a settled call.
Documenting the why is a 2026 **regulatory expectation**, not just hygiene.

<!-- Log a decision when: it changes scope/strategy/priority, spends real money/capacity,
trades off a risk, resolves a stakeholder conflict, or is a gate outcome. Don't log trivia. -->

## What goes in a decision (the fields)
<!-- BLUF: lead with the decision, then the trade-off and the ask. One Accountable owner (RACI). -->
- **DEC-<nn>** — stable ID, never renumbered (retire with a `(superseded by DEC-<nn>)` note).
- **Decision (BLUF):** one sentence — *what was decided*.
- **Door type:** `two-way` (reversible — decide fast) · `one-way` (hard to reverse — decide carefully). *(Bezos reversibility test.)*
- **Owner (Accountable):** exactly **one** name (RACI — never two "A"s).
- **Trace:** the IDs this decision touches (`OPP-* / RMI-* / SOL-* / REQ-* / MET-* / RSK-*`) — keeps the golden thread (§4) intact.

---

## Decision register
<!-- The living table. Newest at top. Every committed roadmap bet, gate outcome, scope cut,
prioritization call, pricing/positioning choice, and ethics/privacy call lands here. -->

| DEC | Date | Decision (BLUF) | Door | Driver / context | Options considered | Chosen + why | Owner (A) | Consulted | Gate | Trace | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DEC-01 | <YYYY-MM-DD> | <what was decided> | two-way | <what forced the call> | <A / B / C> | <choice — 1-line why> | <name> | <STK-*/roles> | <G4 or —> | OPP-<nn>, RMI-<nn> | Decided |
| DEC-02 | <YYYY-MM-DD> | <e.g. cut <scope> from MVP> | one-way | <constraint / evidence> | <ship / cut / defer> | <why> | <name> | <STK-*> | <G6 or —> | REQ-<nn>, MET-<nn> | Decided |
| DEC-<nn> | <YYYY-MM-DD> | TODO: <decision> | <two/one-way> | TODO: | TODO: | TODO: | <name> | <STK-*> | <gate/—> | <IDs> | Proposed |

<!-- Status vocabulary: Proposed → Decided → Revisited (re-confirmed) → Reversed → Superseded by DEC-<nn>.
A reversed/superseded row is never deleted — that history is the point. -->

## Gate decisions (cross-index)
<!-- Every gate G0–G10 produces a DEC-* with one of the five outcomes (Conventions §2 / Protocol §6).
An unrecorded gate is a failed gate. Mirror the recommendation here. -->

| Gate | Owning phase | DEC | Outcome | Conditions / actions (owner · due) | Date |
|---|---|---|---|---|---|
| G<n> | pm-phase-<nn>-<name> | DEC-<nn> | <Persevere · Persevere-with-actions · Pivot · Hold · Kill> | <action — owner — YYYY-MM-DD> | <YYYY-MM-DD> |

<!-- Persevere-with-actions REQUIRES named owners + due dates. Pivot names the phase looped back to.
Kill is a valid, valuable outcome — record what stopped and why. -->

## Decision detail *(optional — only for one-way-door / high-stakes / contested calls)*
<!-- Heavyweight decisions earn a narrative block. Reversible two-way doors stay one table row. -->

### DEC-<nn> — <title>
- **Context / diagnosis:** <the real problem or pressure driving this>
- **Options & trade-offs:** <A: …> · <B: …> · <C: …> — *(state the non-goals too)*
- **Decision:** <what we chose> — **Door:** <one-way / two-way>
- **Rationale (evidence):** <link INS-*/MET-*/OPP-*; what tipped it — not "the loudest voice">
- **Consequences / what this commits us to:** <downstream effects, cost, risk accepted (RSK-<nn>)>
- **Reversal trigger:** <the signal/metric that would make us revisit or reverse this>
- **Accountable:** <name> · **Consulted:** <STK-*/roles> · **Informed:** <who needs to hear it>

## Open / pending decisions
<!-- Decisions owed but not yet made — surface them so they don't rot as silent blockers. -->
- DEC-<nn> (Proposed) — <decision owed> · blocks <RMI-*/gate> · owner <name> · needs <evidence/research/interview> by <YYYY-MM-DD>.
- TODO: <other pending call>

## Review cadence & change log
<!-- Living artifact — reviewed at every gate and on the stakeholder cadence. Minor edit = vMINOR;
a materially restructured log re-confirmed at a gate = vMAJOR (§6). -->
- Cadence: <e.g. reviewed at each gate · skimmed weekly in the product sync>.
- | Date | vX.Y | Change (DEC added / reversed / superseded) | By |
  |---|---|---|---|
  | <YYYY-MM-DD> | v1.0 | Log opened | <name> |

---
*Owning thread:* **Stakeholder Management & Communication** (`cross-cutting/Stakeholder_Management.md`) ·
*Kept alive by:* every phase skill at loop step 7 (`02_AI_Product_Manager_Protocol.md` §7) ·
*Companion threads:* **Risk_Register.md**, **Responsible_Product_Review.md**, **Portfolio_View.md** ·
*Related templates:* **Stakeholder_Map.md**, **Roadmap.md** · *Gate criteria:* `checklists/gate-reviews.md` ·
*Conventions:* ../05_Conventions.md
