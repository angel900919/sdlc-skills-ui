---
Document: Operating Model — <PRODUCT_NAME>
Document ID: OPMODEL-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <Product Manager — name/role>
Updated: <YYYY-MM-DD>
---

# Operating Model — <PRODUCT_NAME>

<!-- Owning skill: pm-phase-00-charter (Phase 00). Sibling templates: Product_Charter.md, Stakeholder_Map.md. -->
<!-- Conforms to ../05_Conventions.md. This file holds the WAY OF WORKING; the MANDATE lives in Product_Charter.md. -->
<!-- Blank template: replace every <…>; default unknown tools to "TODO: confirm org standard" — do not invent tool names. -->

> **One-line purpose:** how this team decides, builds, and reviews — cadence, decision rights, tooling, and thread rhythm.

---

## 1. Way-of-working summary

| Field | Value |
|---|---|
| Tailoring profile | `<Solo-Lean / Standard / Enterprise-Formal>` *(matches Product_Charter.md §1)* |
| Base operating cadence | `<Continuous-Dual-track (default) / Lean-Startup / Scrum / Kanban / Stage-Gate>` |
| Source of truth | `<the single home for product artifacts>` |

---

## 2. Tailoring log
*Tailoring is an auditable product decision (../04_Tailoring_Guide.md §6). Never silently skip a phase or thread — record it with a reason. A tailored-out item is also mirrored in Product_Charter.md §5.*

| Phase / thread | Profile applied | Tailored out? | Rationale |
|---|---|---|---|
| `<P02 Market Research>` | `<Lean — desk research only>` | `<formal market study>` | `<internal tool, no external market>` |
| `<P06 Prioritization>` | `<…>` | `<— / what was dropped>` | `<why>` |
| `<P13 Experimentation>` | `<Solo — qualitative + before/after>` | `<A/B platform>` | `<not enough traffic for significance yet>` |
| `<…add a row per tailored phase/thread…>` | `<…>` | `<…>` | `<…>` |

<!-- "Tailored out?" = the deeper rigour you chose NOT to run, not the work you kept. "—" means run in full. -->

---

## 3. Operating cadence
*Choose deliberately per ../01_Workflow_Overview.md §7. SAFe is a scaling overlay, not a base cadence.*

- **Chosen cadence + why:** `<choice>` — `<rationale: stage, uncertainty, flow type, regulation>`
- **Dual-track:** discovery (P02–P07) and delivery (P08–P11) run in parallel and continuously.

| Ritual | Frequency | Purpose | Who |
|---|---|---|---|
| Continuous discovery touch | `<weekly — ≥1 customer>` | keep the opportunity space live | trio |
| Iteration / sprint planning | `<e.g. 2-weekly>` | commit the next slice of work | delivery team |
| Product review | `<e.g. fortnightly>` | inspect outcomes vs. OKRs | trio + stakeholders |
| Ops review | `<monthly>` | health: metrics, flow, risks, feedback | PM + ops |
| Planning / QBR | `<quarterly>` | re-set outcomes & roadmap horizon | trio + sponsor |
| Gate reviews (G0–G10) | `<at each gate>` | go/no-go decision (Conventions §2) | named approvers |

---

## 4. Decision rights (summary)
*Exactly one Accountable per decision (Conventions §10). The full RACI for the big calls lives in Stakeholder_Map.md.*

- **Decision-log convention:** every consequential call is `DEC-<nn>` in `_threads/Decision_Log.md`.
- **Escalation path:** `<who breaks a tie / unblocks>`
- **Gate authority:** `<who owns the go/no-go verdict at each gate>` → see Stakeholder_Map.md RACI.

---

## 5. Tooling & source of truth
*A deliberate, connected 3–5-tool stack — standardise the* how*, not the* what*. Resist tool sprawl.*

| Capability | Tool | Notes |
|---|---|---|
| Discovery / research repo | `<TODO: confirm org standard>` | `<…>` |
| Analytics / instrumentation | `<TODO: confirm org standard>` | seeds `MET-*` (P12) |
| Delivery / backlog | `<TODO: confirm org standard>` | `US-*` / `FEAT-*` live here |
| Docs / source of truth | `<TODO: confirm org standard>` | the single home for artifacts |
| AI-assist | `<TODO:>` | AI accelerates; humans decide (Conventions §11) |

---

## 6. Cross-cutting thread cadence
*The six threads (Conventions §10) are never removed, only scaled — reviewed at every gate (Enterprise) or major gates (Standard).*

| Thread | Register / home | Review cadence |
|---|---|---|
| Stakeholder Mgmt & Comms | `_threads/Decision_Log.md` + Stakeholder_Map.md | `<every gate / weekly>` |
| Continuous Discovery | `<discovery repo>` | `<weekly touch>` |
| Metrics & Experimentation | `<KPI scorecard / EXP log>` | `<per release / continuous>` |
| Product Ops | this file + templates | `<monthly ops review>` |
| Responsible Product | `_threads/Responsible_Product_Review.md` | `<every gate — floor non-negotiable>` |
| Portfolio & Lifecycle *(multi-product)* | `_threads/Portfolio_View.md` | `<quarterly / n/a>` |

---

## 7. Open items

| TODO | Owner | Due |
|---|---|---|
| `TODO: <e.g. confirm tooling standard>` | `<name>` | `<YYYY-MM-DD>` |

---
*Related: Product_Charter.md · Stakeholder_Map.md · ../04_Tailoring_Guide.md · ../05_Conventions.md · skill pm-phase-00-charter*
