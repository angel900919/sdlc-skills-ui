---
Document: Stakeholder Map — <PRODUCT_NAME>
Document ID: STKMAP-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <Product Manager — name/role>
Updated: <YYYY-MM-DD>
---

# Stakeholder Map — <PRODUCT_NAME>

<!-- Owning skill: pm-phase-00-charter (Phase 00). Sibling templates: Product_Charter.md, Operating_Model.md. -->
<!-- Conforms to ../05_Conventions.md. STATUS = Living per §6/§10 (the stakeholder map is never "done"; minor bump on each edit). -->
<!-- Frame: collaboration & shared problems, NOT control. Colleagues are co-owners, not people to "manage up" (SVPG). -->
<!-- Blank template: replace every <…>; add/remove STK rows as needed. IDs are stable for life — never renumber (Conventions §3). -->

> **One-line purpose:** map influence and decision rights *before* managing — Mendelow grid + RACI, then partner.

---

## 1. Stakeholder register
*One `STK-<nn>` per stakeholder. Power & Interest feed the Mendelow grid (§2). Stance = disposition toward the work.*

| ID | Stakeholder / role | Power | Interest | Stance | What they need | Comms cadence |
|---|---|---|---|---|---|---|
| STK-01 | `<Sponsor / VP>` | `<High/Med/Low>` | `<High/Med/Low>` | `<Champion/Supportive/Neutral/Skeptic/Blocker>` | `<outcome + risk view>` | `<weekly 1:1 (BLUF)>` |
| STK-02 | `<Eng lead>` | `<Med>` | `<High>` | `<Supportive>` | `<context + constraints>` | `<trio sync>` |
| STK-03 | `<…>` | `<…>` | `<…>` | `<…>` | `<…>` | `<…>` |

<!-- Power = ability to help or block. Interest = how much the outcome affects them. Both drive quadrant + cadence. -->

---

## 2. Power / Interest grid (Mendelow)
*Place each `STK-*` by Power × Interest; the quadrant sets the engagement strategy.*

| | **High interest** | **Low interest** |
|---|---|---|
| **High power** | **Manage closely** — `<STK-…>` <!-- partner; co-own decisions --> | **Keep satisfied** — `<STK-…>` <!-- enough to keep onside; don't overload --> |
| **Low power** | **Keep informed** — `<STK-…>` <!-- consult; useful insight --> | **Monitor** — `<STK-…>` <!-- light touch --> |

---

## 3. Decision rights (RACI) — big decisions
*For the consequential calls only. Exactly **one Accountable** per row (Conventions §10). Each call is logged as `DEC-<nn>` in `_threads/Decision_Log.md`.*

<!-- R = does the work · A = answerable, the single owner · C = consulted (two-way) · I = informed (one-way). -->

| Decision | R | A | C | I |
|---|---|---|---|---|
| Strategy sign-off (G1) | `<PM>` | `<Sponsor>` | `<Trio, …>` | `<Org>` |
| Gate go/no-go (G0–G10) | `<PM>` | `<Sponsor>` | `<Trio>` | `<Org>` |
| Scope / prioritization | `<PM>` | `<PM>` | `<Trio, stakeholders>` | `<…>` |
| Launch / GA decision (G9) | `<PMM>` | `<Sponsor>` | `<Trio, Legal>` | `<Org>` |
| `<…add the calls that matter for this product…>` | `<…>` | `<…>` | `<…>` | `<…>` |

---

## 4. Comms plan
*Tailor the message to the quadrant. Execs get **BLUF** — decision + trade-off + ask up front; leading with outcome, not output.*

| Quadrant | Channel | Cadence | Message style |
|---|---|---|---|
| Manage closely | `<1:1 / review>` | `<weekly>` | `<BLUF: decision + trade-off + ask>` |
| Keep satisfied | `<digest / steering>` | `<fortnightly>` | `<outcome headline + risks>` |
| Keep informed | `<broadcast / demo>` | `<per release>` | `<context + what's shipping & why>` |
| Monitor | `<async / wiki>` | `<as-needed>` | `<lightweight FYI>` |

---

## 5. Open items

| TODO | Owner | Due |
|---|---|---|
| `TODO: <e.g. confirm sponsor / fill missing stances>` | `<name>` | `<YYYY-MM-DD>` |

---
*Related: Product_Charter.md · Operating_Model.md · ../05_Conventions.md · ../cross-cutting/Stakeholder_Management.md · skill pm-phase-00-charter*
