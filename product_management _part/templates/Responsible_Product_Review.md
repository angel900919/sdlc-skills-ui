---
Document: Responsible Product Review — <PRODUCT_NAME>
Document ID: RESPREV-<PRODUCT_SLUG>-v1.0
Status: Living
Owner: Product Manager (accountable human) · with Legal/Privacy + Design/Accessibility
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Cross-cutting thread: Responsible Product (Conventions §10.5).
Lives in _threads/Responsible_Product_Review.md. Owning thread method: cross-cutting/Responsible_Product.md.
Reviewed at EVERY gate and whenever scope/data/model behaviour changes (Protocol §7).
Most heavily exercised by pm-phase-07-solution-design (ethics = the 5th big risk) and pm-phase-08-prd (NFRs).
Conforms to ../05_Conventions.md (§3 IDs REQ-SEC-*/REQ-U-*/RSK-*/ISS-*, §5.1 severity, §5.3 risk scoring,
§6 frontmatter/Living status). Fill every <ANGLE_BRACKET> / TODO: or answer "N/A — because <reason>".
NEVER leave a section blank — the privacy / accessibility / safety floor is NON-NEGOTIABLE even for the
smallest product (Conventions §10). AI may DRAFT this; a named human OWNS every sign-off and is accountable.
-->

# Responsible Product Review — <PRODUCT_NAME>

## How to read this
*Trust is a feature, and it compounds.* This is the standing record that privacy, accessibility,
AI behaviour, and safety were **designed in from the start** — not bolted on before launch.
One biased output, breach, or inaccessible flow erodes trust faster than features build it.
Each section forces an explicit answer; "we'll handle it later" is recorded as a **risk (RSK-*)**, not a blank.

## Review trigger & cadence
<!-- This thread is reviewed at every gate; deep-reviewed when any of these change. -->
- Re-review on: new personal-data use · new/changed model or training data · new user-affecting
  automated decision · new region/market · accessibility-affecting UI change · a relevant law/standard update.
- This review covers scope as of: <YYYY-MM-DD> · Next scheduled review: <gate / YYYY-MM-DD>.

---

## A. Privacy by design & by default *(GDPR Art. 25)*
<!-- Privacy is engineered in, not a legal-team task done at the end. Class: REQ-SEC-*. -->
- **Personal data processed?** <yes / no>. If yes, list categories: <e.g. account, usage, location, biometric, special-category>.
- **Lawful basis / consent model:** <consent · contract · legitimate interest · …> — <how captured & withdrawable>.
- **Data minimisation:** <what we collect and why each field is necessary> — TODO: drop anything not justified.
- **Retention & erasure:** <retention window per data type> · deletion path: <automated / manual> · *(automated deletion at EOL is an audited expectation — see Portfolio_View / Phase 16)*.
- **DPIA needed?** <yes/no — why>. If yes: status <not started / draft / approved> · owner <name>.
- **Sub-processors / data sharing / cross-border transfers:** <list + safeguard> or "none".
- **Sign-off (Privacy/Legal):** <name> · <date> · status <Pending / Approved>. RSK-<nn> for any open gap.

## B. Accessibility *(WCAG 2.2 AA + EN 301 549 / EU Accessibility Act)*
<!-- Accessibility is enforceable EU law (EAA in force since 2025-06-28 for firms 10+ staff / >€2M).
Build for POUR; don't treat as a post-launch QA pass. Class: REQ-U-*. Defects logged as ISS-* (§5.1). -->
- **Target conformance:** <WCAG 2.2 Level AA (default)> · scope: <which surfaces/flows>.
- **POUR self-check** *(one line each — note known gaps as ISS-*)*:
  - **Perceivable:** <text alternatives, contrast ≥4.5:1, captions, responsive/zoom> — <status / ISS-<nn>>.
  - **Operable:** <full keyboard nav, focus visible, target size ≥24px (2.2), no keyboard traps> — <status>.
  - **Understandable:** <readable language, predictable nav, clear errors & labels> — <status>.
  - **Robust:** <valid semantic HTML/ARIA, works with screen readers / assistive tech> — <status>.
- **Audit method/tool:** <axe DevTools · WAVE · Lighthouse · manual SR test · Level Access> · last run <YYYY-MM-DD>.
- **Open accessibility defects:** ISS-<nn> (<S1–S4>) — <summary> · owner <name> · due <YYYY-MM-DD>.
- **Sign-off (Design/Accessibility):** <name> · <date> · status <Pending / Approved>.

## C. EU AI Act risk-tier classification *(if the product uses AI/automated decisions)*
<!-- Delete this section ONLY if there is genuinely no AI/automated decisioning. Otherwise classify. -->
- **Does the product use AI / automated decision-making?** <yes / no>. If no, state why and skip C–D.
- **Risk tier (pick one):**
  - [ ] **Prohibited** — <e.g. social scoring, manipulative/exploitative use> → **do not build**; escalate (Kill candidate).
  - [ ] **High-risk** (Annex III standalone / Annex I product-embedded) → conformity, logging, human oversight, data governance required. Deadlines: standalone <2027-12-02>, embedded <2028-08-02>.
  - [ ] **Limited-risk (transparency, Art. 50)** — <chatbot / generative output / emotion / biometric categorisation>. **Article 50 duties apply from 2026-08-02**: disclose users are interacting with AI; label AI-generated content.
  - [ ] **Minimal risk** — <no specific obligations; follow voluntary best practice>.
- **Justification for the tier:** <why this classification> — TODO: confirm with Legal (do not self-certify high-risk).
- **Article 50 transparency implemented?** <how AI interaction is disclosed / AI content labelled> or "N/A — minimal".
- **Human oversight design:** <who can review / override / roll back the automated decision; the kill switch>.
- **Classification sign-off (accountable human):** <name> · <date>. *(AI can draft; it cannot be the accountable party.)*

## D. AI behaviour — bias, drift & quality *(continuous, not one-time)*
<!-- 2026: responsible AI is continuous monitoring across the lifecycle, not a pre-launch check.
Frame model-behaviour requirements explicitly (Class: REQ-SEC-* / REQ-O-*). Map to NIST AI RMF: Govern·Map·Measure·Manage. -->
- **Eval / quality criteria:** <accuracy / task-success threshold> measured by MET-<nn> · acceptance gate: <value>.
- **Fairness / bias review:** <protected groups considered> · method <disaggregated eval / red-team> · last run <YYYY-MM-DD> · finding <…> · RSK-<nn> if gap.
- **Drift & performance monitoring:** <metric watched + threshold + alert owner> · cadence <e.g. weekly> · *(set up BEFORE launch, runs forever)*.
- **Hallucination / error guardrails:** <grounding, citations, refusal behaviour, confidence gating>.
- **Fallback UX & human-in-the-loop:** <what happens on low confidence / failure; when a human is required>.
- **Standards followed:** <NIST AI RMF · ISO/IEC 42001 · internal Responsible-AI policy> or "TODO".

## E. Security, trust & safety
<!-- The harms layer: abuse, misuse, and security beyond privacy. Class: REQ-SEC-*. -->
- **Security review / threat model:** <status> · authN/Z model: <…> · open issues: ISS-<nn> (<S1–S4>).
- **Harms / misuse taxonomy:** <foreseeable abuse, harmful content, vulnerable users> · mitigation <…>.
- **Trust & safety controls:** <reporting, rate limits, moderation, escalation path> or "N/A — because <reason>".

---

## Responsible-product risk register *(extends _threads/Risk_Register.md)*
<!-- Score Likelihood × Impact (each 1–5 → Low/Med/High/Critical, Conventions §5.3). Owner + mitigation mandatory. -->
| RSK | Risk (privacy / a11y / AI / safety) | L (1-5) | I (1-5) | Band | Mitigation / control | Owner | Status |
|---|---|---|---|---|---|---|---|
| RSK-<nn> | <e.g. model bias against <group>> | <n> | <n> | <Low/Med/High/Critical> | <mitigation> | <name> | <Open/Mitigating/Accepted> |
| RSK-<nn> | TODO: | | | | | | |

## Overall sign-off & gate decision
<!-- Ethics is the 5th big risk (Phase 07). A gate does not pass on an open S1/S2 or an unresolved
privacy/accessibility/legal blocker — that's Hold or Persevere-with-actions, never Persevere. -->
- **Reviewed at gate:** G<n> · **Recommendation:** <Persevere · Persevere-with-actions · Pivot · Hold · Kill>.
- **Accountable human:** <name/role> · **Date:** <YYYY-MM-DD> · logged as `DEC-<nn>` in `_threads/Decision_Log.md`.
- **Conditions to clear (if with-actions):** <action — owner — YYYY-MM-DD>.

## Change log
- | Date | vX.Y | Change (section · what changed · why) | By |
  |---|---|---|---|
  | <YYYY-MM-DD> | v1.0 | Review opened | <name> |

---
*Owning thread:* **Responsible Product** (`cross-cutting/Responsible_Product.md`) ·
*Kept alive by:* every phase skill at loop step 7 (`02_AI_Product_Manager_Protocol.md` §7), esp.
**pm-phase-07-solution-design** (ethics risk) & **pm-phase-08-prd** (NFRs) ·
*Companion threads:* **Risk_Register.md**, **Decision_Log.md** ·
*Related templates:* **NFR_Checklist.md**, **PRD.md**, **Assumption_Map.md** · *Gate criteria:* `checklists/gate-reviews.md` ·
*Conventions:* ../05_Conventions.md
