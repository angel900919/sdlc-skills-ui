---
Document: Feedback Log — <PRODUCT_NAME>
Document ID: FBLOG-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager / Feedback Ops
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 14 · Customer Feedback Management. Owning skill: pm-phase-14-feedback.
This is the searchable repository of FB-* THEMES — root-cause patterns with sourced
verbatims, NOT a dump of raw transcripts/tickets. One row = one theme, not one message.
Companions: Feedback_Ops_Plan.md (program design) · Insight_Synthesis.md (cycle readout → OPP-*).
Conforms to ../05_Conventions.md (§3 IDs FB-/MET-/OPP-, §4 traceability spine,
§6 frontmatter + LIVING status, §7 outcomes-over-outputs).

STATUS — This artifact is LIVING (Conventions §6): never "done", never frozen. Add/merge/retire
themes continuously; bump the minor version each cycle; log changes at the bottom. IDs are
stable for life — never renumber; retire with "(deprecated)".

DISCIPLINE — Every theme cites a REAL source verbatim. An unsourced theme is TODO:, never a
guess. NEVER invent a quote, a score, a count, or an ARR figure. `Count` is RAW volume — read
it next to `Segment/ARR`, not instead of it (frequency ≠ importance). A theme is "done" only
when it closed a loop (changed the product, traced to OPP-/MET-, AND/OR the customer was told).
Fill every <ANGLE_BRACKET> / resolve every "TODO:". Don't ship the example rows.
-->

# Feedback Log — <PRODUCT_NAME>

> The `FB-` repository: root-cause **themes**, source-grounded, weighted by importance,
> traced to the OST. *Themes, not transcripts. Discovery input, not a build queue.*

## Taxonomy (governed) — `type × area × source × segment`
<!-- Defined and governed in Feedback_Ops_Plan.md §2; applied here. Use only the allowed values. -->
- **type:** Bug · Request · Praise · Question · Churn-signal · <…>
- **area:** <product area A> · <area B> · <onboarding> · <billing> · …
- **source:** tickets · NPS-why · CSAT-why · CES-why · reviews · calls · interviews · social
- **segment:** Enterprise · Mid-market · SMB · Free · <persona PER-nn>

## Loop status legend
<!-- Inner = the individual; Outer = the product-changing theme. "Closed" requires both action
AND telling the customer. -->
- `Inner: open` · `Inner: resolved+told`
- `Outer: triage` · `Outer: routed` (→ `OPP-`) · `Outer: shipped` · `Outer: closed` (you-said→we-did sent)

---

## Themes (`FB-*`)
<!-- One row per ROOT-CAUSE theme. Keep 2–3 sourced verbatims per theme in the "Verbatims"
section below, keyed by FB id — don't paste raw transcripts into the table. -->

| ID | Theme (root cause, one line) | Type | Area | Source(s) | Segment / ARR | Count | Sentiment | Linked MET | → OPP | Loop status |
|---|---|---|---|---|---|---|---|---|---|---|
| FB-01 | <root-cause theme> | Bug | <area> | tickets, CES-why | Enterprise / $<TODO> | <n> | neg | MET-<nn> (CES) | OPP-<nn> | Outer: routed |
| FB-02 | <root-cause theme> | Request | <area> | reviews, calls | SMB | <n> | mixed | MET-<nn> (CSAT) | TODO: triage | Inner: resolved+told |
| FB-03 | <root-cause theme> | Praise | <area> | NPS-why | <segment> | <n> | pos | MET-<nn> (NPS) | — | Outer: closed |
| FB-<nn> | TODO: <theme> | <type> | <area> | TODO: source | <segment / ARR> | <n> | <pos/neg/mixed> | MET-TBD | TODO: | <status> |

> Every row cites a real source; an unsourced theme is `TODO:`, never a guess.
> A high `Count` from free-tier does **not** outrank a low-count enterprise renewal — see `Segment/ARR`.

---

## Sourced verbatims (the evidence behind each theme)
<!-- 2–3 REAL quotes per theme, quoted from the input — do NOT paraphrase into a new claim.
This is what source-grounds the theme against AI hallucination. Attribute by source + segment,
never invent attribution. Keep quotes short; link to the full ticket/call where it lives. -->

**FB-01 — <theme>**
- "<verbatim quote>" — <source · segment · date · link/ref>
- "<verbatim quote>" — <source · segment · date · link/ref>

**FB-02 — <theme>**
- "<verbatim quote>" — <source · segment · date · link/ref>
- TODO: pull 2nd verbatim from <source>

<!-- Add a block per FB-* row above. No block ⇒ the theme is ungrounded ⇒ mark its row TODO:. -->

---

## Requests → jobs (translation, not orders)
<!-- A feature REQUEST is a clue to a JOB-/OPP-, not an order. Translate before routing;
prioritize against an OBJ/KR in P06 — never build by request count. -->

| FB (request) | Underlying job (`JOB-`/customer's words) | Candidate `OPP-` | Routed to |
|---|---|---|---|
| FB-<nn> | <the job behind the ask> | OPP-<nn> | `../04_Opportunity/` |
| FB-<nn> | TODO: surface the job (interview) | TODO: | <…> |

---

## Triage queue (untriaged signal)
<!-- New unsourced/unclustered signal lands here until it becomes a sourced FB-* theme or is
merged into one. Don't let it become a parallel backlog. -->
- TODO: <raw cluster awaiting source-grounding — owner — by when>

---

## Change log (Living — minor bump each cycle)
| Date | vX.Y | Change (FB- added / merged / retired · loop closed) | By |
|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial repository stood up | <name> |

---

### Links
- **Owning skill:** **pm-phase-14-feedback** — `../skills/pm-phase-14-feedback/SKILL.md`
- **Companion templates:** [Feedback_Ops_Plan.md](Feedback_Ops_Plan.md) (program design, SLAs) · [Insight_Synthesis.md](Insight_Synthesis.md) (cycle readout → `OPP-`)
- **Trace targets:** `../04_Opportunity/Opportunity_Solution_Tree.md` (`OPP-`) · `../12_Analytics/KPI_Scorecard.md` (`MET-` — CSAT/CES/NPS) · `../03_Discovery/JTBD.md` (`JOB-`) · `../03_Discovery/Personas.md` (`PER-`)
- **Feeds:** `../06_Prioritization/Prioritization_Matrix.md` (`FB-` count + segment as Reach/Impact evidence) · `../13_Experiments/Experiment_Plan.md` (qual theme → `EXP-` hypothesis)
- **Cross-cutting:** `../cross-cutting/Continuous_Discovery.md` · `../cross-cutting/Responsible_Product.md` (consent/PII in quotes — `RSK-`)
- **Convention contract:** `../05_Conventions.md` (§3 `FB-` IDs · §4 spine · §6 `Living` · §7 outcomes)
