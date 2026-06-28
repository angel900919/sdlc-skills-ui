---
Document: Release Readiness — <PRODUCT_NAME> / <Release>
Document ID: REL-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 10 · Release Readiness (the G8 Go/No-Go evidence pack). Owning skill:
pm-phase-10-delivery. Conforms to ../05_Conventions.md (§2 gate G8 + decision vocabulary,
§3 IDs RMI-*/FEAT-*/US-*/AC-*/ISS-*/RSK-*/MET-*/DEC-*, §4 spine, §5 severity, §6 frontmatter,
§7 outcomes-over-outputs). Companions: Delivery_Plan.md · Sprint_Plan.md · Risk_Register.md.
The canonical G8 block lives in ../checklists/gate-reviews.md — if they disagree, that file wins.
RELEASE ≠ LAUNCH: this is reversible engineering readiness; the GTM launch moment (G9) is
pm-phase-11-launch-gtm. Fill every <ANGLE_BRACKET> / TODO:; never ship placeholder values.
-->

# Release Readiness — <PRODUCT_NAME> / <Release>

## 1. Scope
- **Release slice:** RMI-<nn> · FEAT-<nn> · stories US-<nn>..US-<nn>
- **Outcome it must move:** OBJ-<nn>/KR-<nn> measured by **MET-<nn>** *(no measurable outcome ⇒ not ready, §7)*
- **Release mechanism:** `<feature flag | % rollout / ramp | canary | ring>`

## 2. Readiness ledger
<!-- Mark each: Pass / Gap (owner + date) / Waived (rationale). A Gap with no owner+date is a No-Go. -->

| Check | Status (Pass/Gap/Waived) | Evidence / owner · date |
|---|---|---|
| AC met for the release scope (US-/AC-) | <> | <> |
| Open defects: **zero S1/S2** (else explicitly waived) | <> | ISS-<nn> (S_) — <rationale> |
| Quality verified — functional + NFR (REQ-P/O/SEC-*) | <> | <> |
| Accessibility (WCAG 2.2 AA) checked | <> | <> |
| Privacy / consent / data-retention honored | <> | <> |
| Security (authN/Z, relevant OWASP) — no new SEC gap | <> | <> |
| Instrumentation live; **MET-<nn> measurable**; dashboard ready | <> | <> |
| **Rollback / kill-switch** in place; on-call/support briefed | <> | <> |
| Risk register reviewed; **no unmitigated High/Critical RSK-** | <> | RSK-<nn> → Risk_Register.md |

## 3. Open-defect ledger *(severity ≠ priority — §5.1)*
<!-- An open S1/S2 ships ONLY with an explicit, logged waiver (rationale + owner + fix date). Default = Hold. -->

| ISS- | Defect (one line) | Severity (S1–S4) | Priority (P0–P3) | Status | Waiver (rationale · owner · fix-by) |
|---|---|---|---|---|---|
| ISS-<nn> | <…> | S<> | P<> | <Open/Fixed> | <none / rationale> |

## 4. Rollback / kill-switch plan *(reversibility = responsible-product floor)*
- **Mechanism:** `<feature flag | % rollout | canary>` — how to disable: `<one line>`.
- **Trigger conditions:** `<guardrail breach / error-rate / MET- regression>` → who can pull it: `<role>`.
- **Target rollback time:** `<>` · **Owner / on-call:** `<name>` · **Tested?** `<yes/no — when>`.

## 5. Instrumentation & measurability
- `MET-<nn>` wired and firing in production: `<verified / TODO>`; dashboard: `<link>`.
- Guardrail metrics watched during ramp: `<MET-<nn> … >`.

## 6. Gate review (pre-decision)
- **Six-thread review** (run first): `../checklists/gate-reviews.md` — Stakeholders · Discovery · Metrics · Product Ops · Responsible Product · Portfolio.
- **G8 checklist** (owner: P10 Delivery) — copied/verified against `../checklists/gate-reviews.md`.

## 7. Decision — G8 · Release Readiness (Go/No-Go)
<!-- A gate is a decision, not a formality. Pivot and Kill are valid — the cheapest failed release is the one G8 stopped. -->
- **Recommendation:** `<Persevere (Go) | Persevere-with-actions | Pivot | Hold | Kill>`
- **Rationale / evidence:** <one or two lines tied to the ledger above>
- **Open actions (if Persevere-with-actions):** <action — owner — due YYYY-MM-DD>
- **Logged as:** DEC-<nn> in `_threads/Decision_Log.md`; recorded in `WORKFLOW.md`.

## 8. Sign-off (RACI — exactly one Accountable)
| Role | Name | Decision | Date |
|---|---|---|---|
| Accountable (Go/No-Go) | <name> | <Go/No-Go> | <YYYY-MM-DD> |
| Eng / QA | <name> | <> | <> |
| Responsible-product (a11y/privacy/security) | <name> | <> | <> |

---
*Owning skill:* **pm-phase-10-delivery** · *Companions:* **Delivery_Plan.md** · **Sprint_Plan.md** · **Risk_Register.md** ·
*Next phase (G9):* **pm-phase-11-launch-gtm** (the launch moment) · *Gate:* **../checklists/gate-reviews.md** · *Conventions:* ../05_Conventions.md
