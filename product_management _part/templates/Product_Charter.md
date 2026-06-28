---
Document: Product Charter — <PRODUCT_NAME>
Document ID: CHARTER-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <Product Manager — name/role>
Updated: <YYYY-MM-DD>
---

# Product Charter — <PRODUCT_NAME>

<!-- Owning skill: pm-phase-00-charter (Phase 00 — Product Charter & Operating Setup). -->
<!-- Sibling templates (fill all three together): Operating_Model.md, Stakeholder_Map.md. -->
<!-- Conforms to ../05_Conventions.md (frontmatter §6, IDs §3, status strings §6, outcomes-over-outputs §7). -->
<!-- Exit gate: G0 — Kickoff. This file holds the MANDATE; the WAY OF WORKING lives in Operating_Model.md. -->
<!-- Blank template: replace every <…>, resolve or OWN every "TODO:". Never invent a sponsor/segment/metric/tool. -->

> **One-line purpose:** agree the mandate and authorise the team *before* any strategy or discovery work begins.

---

## 1. Identity

| Field | Value |
|---|---|
| Product / initiative name | `<PRODUCT_NAME>` |
| Slug (kebab-case) | `<product-slug>` <!-- drives the folder name AND every Document ID per Conventions §3/§6 --> |
| One-liner | `<what we're building and for whom — one sentence>` |
| Stage | `<idea / 0→1 / growth / mature / sunset>` |
| Tailoring profile | `<Solo-Lean / Standard / Enterprise-Formal>` <!-- picker in ../04_Tailoring_Guide.md §5; record the per-phase log in Operating_Model.md --> |

---

## 2. Mandate & problem space
*Problem, not solution. If you reach for a feature, park it in "Solution seeds" and steer back — solutioning is P03/P04/P07.*

- **Problem space:** `<the problem in the customer's world we are chartered to address>`
- **Target segment:** `<who has this problem — be specific>`
- **Sponsor:** `<who wants this and will fund/unblock it>` <!-- no funding sponsor → this is a self-initiated bet; mark TODO and consider Hold at G0 -->
- **Why now:** `<the trigger / window — market, regulatory, technical, strategic>`
- **Inherited strategy (if any):** `<link>` *(Source: company/portfolio strategy — cite, don't re-author; coherence is a G1 check)*
- **Solution seeds (parked):** `<early ideas captured but NOT committed>` → owned by P04 (`OPP-*`) / P07 (`SOL-*`).

---

## 3. Outcome-level success
*An outcome (a moved metric), never an output (features shipped) — Conventions §7. Seeds `OBJ-*`/`KR-*` in pm-phase-01-strategy.*

- **Outcome:** `<what measurably changes for the customer and/or the business if this works>`
- **Signal / metric:** `TODO: success metric owed — by <owner>, <YYYY-MM-DD>` <!-- name the metric if known; never invent a target. → becomes MET-* (P12), tied to OBJ/KR (P01) -->
- **What "not worth doing" looks like:** `<the threshold below which we would Kill/Pivot>`

---

## 4. Team & trio
*Empowered product trio that owns the outcome — not a feature-taking project team (SVPG product operating model).*

| Role | Name | Notes |
|---|---|---|
| Product Manager | `<name>` | owns the mandate & the trade-offs |
| Design | `<name>` | trio |
| Engineering | `<name>` | trio |
| Sponsor | `<name / TODO:>` | funds & unblocks (also `STK-*` in Stakeholder_Map.md) |
| Partners | `<PMM, Data, Legal/Privacy, Support, …>` | pulled in as needed |

> Full influence/RACI mapping lives in **Stakeholder_Map.md** (`STK-*` + RACI).

---

## 5. Scope of mandate

- **In scope:** `<what this charter authorises>`
- **Out of scope:** `<explicitly excluded — protects focus>`
- **Explicitly later:** `<deferred, not denied — note the trigger to revisit>`
- **Tailored out:** `tailored out: <phase/artifact> — <reason>` <!-- never skip a phase silently (Conventions §1); mirror in the Operating_Model.md tailoring log -->

---

## 6. Responsible-product floor
*Non-negotiable floor set NOW, not at launch. Open `RSK-*` in `_threads/Risk_Register.md`. See ../cross-cutting/Responsible_Product.md.*

| Dimension | Commitment | Opening risk |
|---|---|---|
| Privacy-by-design | `<GDPR Art. 25 — data minimisation, consent, retention>` | `RSK-<nn>` |
| Accessibility | `<WCAG 2.2 AA / EAA intent>` | `RSK-<nn>` |
| AI transparency *(if AI in product)* | `<EU AI Act Art. 50 disclosure + human-in-the-loop for consequential decisions>` | `RSK-<nn>` |
| Security | `<authN/Z, data protection baseline>` | `RSK-<nn>` |

<!-- If the product can harm/exclude someone or touches personal data, you are AT LEAST Standard on this thread regardless of size (Tailoring Guide §3). -->

---

## 7. Assumptions, constraints & open items

**Constraints (imposed limits):**

| Type | Constraint |
|---|---|
| Budget | `<…>` |
| Deadline | `<absolute date, YYYY-MM-DD — never "next quarter">` |
| Platform / mandated tech | `<…>` |
| Regulation / legal | `<…>` |

**Key assumptions:** `<load-bearing beliefs we're acting on — riskiest become ASM-* in P07>`

**Open items (TODO register):**

| TODO | Owner | Due |
|---|---|---|
| `TODO: <what's owed>` | `<name>` | `<YYYY-MM-DD>` |

---

## 8. G0 — Kickoff verdict
*A gate is a real decision, not a rubber stamp (Conventions §2). Criteria in pm-phase-00-charter (Exit-gate checklist).*

- [ ] Named; slug + folder created; stage & tailoring profile set
- [ ] Mandate clear: problem space, target segment, sponsor, product trio
- [ ] Success defined at outcome level (§3)
- [ ] Operating cadence + tooling/source-of-truth set (→ Operating_Model.md)
- [ ] Initial stakeholder map + decision rights (→ Stakeholder_Map.md)

**Verdict:** `<Persevere / Persevere-with-actions / Pivot / Hold / Kill>` — `<one-line rationale + evidence>`
**Decision logged as:** `DEC-<nn>` in `_threads/Decision_Log.md`
**Next step:** invoke **pm-phase-01-strategy** (vision, strategy, North Star + OKRs → G1).

---
*Related: Operating_Model.md · Stakeholder_Map.md · ../05_Conventions.md · ../04_Tailoring_Guide.md · skill pm-phase-00-charter*
