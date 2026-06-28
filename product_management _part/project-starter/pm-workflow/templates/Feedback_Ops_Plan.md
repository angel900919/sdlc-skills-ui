---
Document: Feedback Ops Plan — <PRODUCT_NAME>
Document ID: FBOPS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager / Feedback Ops
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 14 · Customer Feedback Management. Owning skill: pm-phase-14-feedback.
This is the PROGRAM DESIGN: where signal comes from, how it's tagged, how it's metered,
and the two loops + SLAs that turn it into product change. Companions: Feedback_Log.md
(the FB-* repository, Living) · Insight_Synthesis.md (outer-loop readout → OPP-*).
Conforms to ../05_Conventions.md (§2 continuous-phase status, §3 IDs FB-/MET-/OPP-/RSK-/DEC-,
§4 traceability spine, §6 frontmatter, §7 outcomes-over-outputs).
Fill every <ANGLE_BRACKET> / resolve every "TODO:" or delete the row. Don't ship example values.
NEVER invent a score, a quote, a count, or an ARR figure — unknown = TODO: <what — who — when>.
P14 owns NO lifecycle gate; this plan is reviewed on a cadence as a HEALTH CHECK, not at a gate.
-->

# Feedback Ops Plan — <PRODUCT_NAME>

> A **closed-loop voice-of-customer system**: collect every signal → centralize → tag →
> meter → run both loops → synthesize to opportunities → **tell customers what changed.**
> *Feedback is raw material for discovery, NOT a backlog of orders (Conventions §7).*

## Scope & switch-on
<!-- The loop turns on at launch (after G9). If nothing is live yet, design the program now
but mark it dormant — there is no feedback to manage pre-GA. -->
- **Product / segment(s) covered:** <product · segments — e.g. Enterprise, SMB, free-tier>
- **Live since (GA):** <YYYY-MM-DD | TODO: not yet GA — program dormant until launch>
- **Also serves:** <agent / API consumers? — if the product has non-human users, give them their own channel + metrics; delete if N/A>
- **Owner & contributors:** <PM · CS · Support · Research> — RACI in "Ownership & cadence" below.

---

## 1. Channels & sources (centralize ALL of them)
<!-- ~80% of signal is UNSOLICITED / unstructured. If you only list surveys you are missing
most of the truth. Everything below flows into ONE searchable repository (Feedback_Log.md),
linked to customer / segment / ARR — not scattered across inboxes, Slack, and spreadsheets. -->

| Source | Type (solicited / unsolicited) | Where it lives now | Pulled into repo? | Owner |
|---|---|---|---|---|
| In-product microsurveys (CSAT/CES/NPS + "why") | Solicited | <tool> | <auto / manual / TODO> | <name> |
| Customer interviews (weekly discovery touch) | Solicited | <repo> | <yes/TODO> | <name> |
| Support tickets | Unsolicited | <helpdesk> | <yes/TODO> | <name> |
| Sales / CS call notes + recordings | Unsolicited | <CRM / call tool> | <yes/TODO> | <name> |
| Public reviews (app stores, G2, …) | Unsolicited | <source> | <yes/TODO> | <name> |
| Social / community / forums | Unsolicited | <source> | <yes/TODO> | <name> |
| <other> | <type> | <where> | <TODO> | <name> |

- **Single source of truth (repository):** `14_Feedback/Feedback_Log.md` backed by <tool — e.g. Enterpret / Cycle / Dovetail / Productboard>.
- **Customer linkage:** every item links to customer / segment / **ARR** so frequency can be weighed against value.
<!-- Anti-pattern: reading a hand-picked SAMPLE of tickets. Mine the FULL CORPUS (AI), spot-check, don't sample. -->

---

## 2. Governed taxonomy — `type × area × source × segment`
<!-- A consistent, GOVERNED taxonomy is what makes feedback analyzable; over-tagging kills it.
Prefer an ADAPTIVE / AI-learned taxonomy over a hand-maintained tag tree that sprawls.
Keep this definition here; apply the tags in Feedback_Log.md. -->

| Dimension | Allowed values (governed list) | Notes |
|---|---|---|
| **type** | Bug · Request · Praise · Question · Churn-signal · <…> | What kind of signal. |
| **area** | <product area A> · <area B> · <onboarding> · <billing> · … | Map to product surface, not team. |
| **source** | tickets · NPS-why · CSAT-why · CES-why · reviews · calls · interviews · social | Where it came from. |
| **segment** | Enterprise · Mid-market · SMB · Free · <persona PER-nn> | Carries the value weight. |

- **Governance:** <who owns the tag list> reviews drift <cadence>; new tags require <approval>. AI-suggested tags are human-approved before they enter the governed list.
- **TODO:** confirm taxonomy is wired into the repo tool and back-applied to historical signal.

---

## 3. Metric triangle — CSAT · CES · NPS (each tagged `MET-`)
<!-- No single metric tells the story — TRIANGULATE. ALWAYS pair every score with an open-text
"why." NPS is a RELATIONSHIP signal, NOT a product metric and NOT "the one number you need to
grow." Capture in context (in-product) where possible. Each metric is a MET-* owned by P12. -->

| Metric | What it measures | When captured | `MET-` id | Open-text "why" paired? | Target / baseline |
|---|---|---|---|---|---|
| **CSAT** | Touchpoint satisfaction | <after key touchpoint> | MET-<nn> | Yes — required | <baseline → target | TODO> |
| **CES** | Effort to get the job done | <after task / resolution> | MET-<nn> | Yes — required | <… | TODO> |
| **NPS** | Relationship / loyalty trend | <relationship cadence> | MET-<nn> | Yes — required | <… | TODO> |

- **Lead-with rule:** transactional moment → CSAT/CES · relationship/loyalty trend → NPS. Never a bare score.
- **Pairs with quant behaviour** from `12_Analytics/KPI_Scorecard.md` (qual "why" × quant "what"). TODO if instrumentation thin: pair feedback with usage data.

---

## 4. The two loops + closed-loop SLAs
<!-- Most programs over-invest in one loop and starve the other. Run BOTH. The two canonical
failures are collect-without-acting and act-without-telling. -->

### Inner loop — resolve the individual fast, and TELL them
<!-- Speed of follow-up (24–48h) drives retention. -->
- **Trigger:** an individual unhappy/at-risk customer who can be recovered (e.g. detractor NPS, low CSAT, churn-signal ticket).
- **Owner:** <CS / Support>.
- **Follow-up SLA:** <≤ 24–48h> to first response; <X days> to resolution.
- **"Tell them" step:** <how the customer is told it's resolved> — required, not optional.

### Outer loop — aggregate to root-cause `FB-` themes that change the product
- **Trigger:** a recurring pattern implying a product change.
- **Owner:** <PM>.
- **Cadence:** themes synthesized <weekly/biweekly>; routed to OST as candidate `OPP-` <cadence>.
- **Routing SLA:** a validated theme reaches discovery/prioritization within <X days>.

| Loop | Decide by | SLA | Owner | "Done" when |
|---|---|---|---|---|
| Inner | recoverable individual | <24–48h follow-up> | <CS> | resolved **and** customer told |
| Outer | recurring product pattern | <route in X days> | <PM> | theme → `OPP-` **and** loop closed ("you said → we did") |

<!-- "Done" (Conventions §7): a FB-* theme is done only when it closed a loop — changed the
product (traced to OPP-/MET-) AND/OR the customer was told. Collect-only is theatre. -->

---

## 5. Synthesis — AI at scale, human-validated
<!-- AI clusters the FULL corpus into FB-* themes with SOURCED verbatims; the human validates
every theme against raw quotes (source-grounding is structural, not optional — hallucination
risk). Weight by IMPORTANCE (segment/ARR/strategy), not raw frequency. -->
- **Clustering:** <tool/agent> auto-clusters all channels into candidate `FB-` themes with 2–3 sourced verbatims each.
- **Validation rule:** an ungrounded theme is a hypothesis, not evidence → mark `TODO:`, never decide on it.
- **Weighting rule:** surface **count AND value** side by side; one enterprise renewal can outweigh hundreds of free-tier asks.
- **Output:** surviving themes land in `Feedback_Log.md`; the cycle readout goes to `Insight_Synthesis.md` (themes → candidate `OPP-` on the OST).

---

## 6. Responsible-product floor (consent · PII · AI red-team)
<!-- The privacy/accessibility/safety floor is non-negotiable (Conventions §10). -->
- **Consent / PII:** tickets, recordings, and reviews can contain PII — <consent basis · redaction · retention policy>. Log exposure as `RSK-<nn>` in `_threads/Risk_Register.md`.
- **AI source-grounding red-team:** every AI theme spot-checked against raw verbatims before it informs a decision.
- **No dark-pattern "feedback":** no coerced 5-star prompts; no survey that can't return a bad score.
- **TODO:** <regulated-vertical constraints on storing recordings/PII — research + cite>.

---

## 7. Ownership & cadence (RACI)
| Activity | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Channel intake & repo hygiene | <name> | <PM> | <Support/CS> | <team> |
| Taxonomy governance | <name> | <PM> | <Research> | <team> |
| Inner loop (resolve + tell) | <CS> | <Support lead> | <PM> | <customer> |
| Outer loop synthesis → `OPP-` | <PM> | <PM> | <Research/Design> | <leadership> |
| Loop-closing comms ("you said → we did") | <PM/Marketing> | <PM> | <CS> | <customers> |

- **Health-check cadence:** <weekly synthesis · monthly program review · quarterly metric re-baseline> — never annual-only.
- **Decision logging:** loop/taxonomy/kill calls recorded as `DEC-<nn>` in `_threads/Decision_Log.md`.

---

## 8. Health check (continuous — there is no gate)
<!-- P14 owns no lifecycle gate; run this on a cadence and bump the minor version each cycle.
Verdict vocabulary (Conventions §2): Persevere · Persevere-with-actions · Pivot · Hold · Kill. -->
- [ ] All channels (solicited **and** ~80% unsolicited) flow into one searchable repo linked to customer/segment/ARR.
- [ ] Taxonomy governed (`type × area × source × segment`); no sprawl; adaptive/AI-learned where possible.
- [ ] Metric triangle live — CSAT/CES/NPS as `MET-`, each with open-text "why"; no bare NPS-as-the-one-number.
- [ ] Inner loop live with 24–48h follow-up SLA; outer loop themes root-caused into `FB-`.
- [ ] AI themes source-grounded + human-validated; frequency weighed against segment/ARR.
- [ ] Themes traced onto the OST as candidate `OPP-` and to a `MET-`; requests translated to jobs, not built by count.
- [ ] Loop closed with customers ("you said → we did"); no collected-but-never-told gap.
- [ ] No fabricated quotes/scores/counts (`TODO:` instead); `DEC-` logged; consent/PII checked (`RSK-`).
- **Verdict:** <Persevere | Persevere-with-actions | Pivot | Hold | Kill> — recorded as `DEC-<nn>`.

---

## Change log (review on cadence — minor bump each cycle)
| Date | vX.Y | Change | By |
|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial program design | <name> |

---

### Links
- **Owning skill:** **pm-phase-14-feedback** — `../skills/pm-phase-14-feedback/SKILL.md`
- **Companion templates:** [Feedback_Log.md](Feedback_Log.md) (the `FB-` repository, Living) · [Insight_Synthesis.md](Insight_Synthesis.md) (outer-loop readout → `OPP-`)
- **Upstream:** `../11_Launch/` (loop turns on at G9) · `../12_Analytics/KPI_Scorecard.md` (`MET-`) · `../03_Discovery/Personas.md`+`JTBD.md` (`PER-`/`JOB-` lens) · `../04_Opportunity/Opportunity_Solution_Tree.md` (`OPP-`)
- **Downstream:** themes route to `../03_Discovery/` & `../04_Opportunity/` (new `OPP-`) · `../06_Prioritization/Prioritization_Matrix.md` (`FB-` volume + segment as Reach/Impact) · `../13_Experiments/Experiment_Plan.md` (qual themes → `EXP-`)
- **Cross-cutting threads:** `../cross-cutting/Continuous_Discovery.md` · `../cross-cutting/Metrics_and_Experimentation.md` · `../cross-cutting/Product_Operations.md` (feedback ops) · `../cross-cutting/Responsible_Product.md`
- **Convention contract:** `../05_Conventions.md` · **Framework cards:** `../frameworks/` (Inner/Outer Loop · CSAT/CES/NPS · feedback taxonomy · Opportunity Solution Tree · JTBD)
