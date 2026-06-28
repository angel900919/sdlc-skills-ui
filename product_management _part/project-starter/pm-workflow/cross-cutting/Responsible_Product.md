# Responsible Product — cross-cutting thread

> **Responsible Product is the discipline of designing privacy, accessibility, fair AI behaviour, security, and safety *into* the product from the first sketch — with a named human accountable — so that we ship things that are trustworthy by construction, not patched before launch.**

This is **thread #5 of the six** in [Conventions §10](../05_Conventions.md). It is the **non-negotiable floor**: even the smallest product must answer *can this harm someone, exclude someone, or leak/misuse personal data?* ([Tailoring §3](../04_Tailoring_Guide.md)). The other threads optimise the product; this one keeps it from causing harm — and most of the floor is now **enforceable law**, not best-practice aspiration.

---

## Why it's a thread, not a phase

Responsible Product is **alive in every phase and reviewed at every gate** — it can never be "Phase 7.5, done, ticked." Three reasons:

- **Cost asymmetry.** Privacy-by-design and accessibility cost ~1× when designed in and ~10× when retrofitted — and a breach, a biased output, or an inaccessible flow erodes trust faster than features build it. *Trust is a feature, and it compounds.*
- **It moves when scope moves.** A new data field, a new market, a model retrain, or a UI change can flip your privacy obligations, your accessibility conformance, or your EU AI Act risk tier. A one-time pre-launch check is structurally blind to this — 2026 responsible AI is **continuous monitoring across the lifecycle**, not a gate-day audit.
- **It's the 5th big risk.** Discovery scores four risks (value, usability, feasibility, viability); **ethics is the fifth** ([G5, Conventions §5.3](../05_Conventions.md); [Phase 07](../../.claude/skills/pm-phase-07-solution-design/)). You de-risk it the same way you de-risk the others: continuously, with evidence, before you over-build.

A skill that says "we'll handle privacy/accessibility later" gets the standing challenge: *those are a thread, not a phase — they start now or cost 10× and risk harm later* ([Protocol §4](../02_AI_Product_Manager_Protocol.md)).

---

## The method / practices

**1. Privacy by design & by default — GDPR Art. 25.** Data protection is a *legal obligation*, engineered in, not a legal-team task done at the end. Practise data minimisation (justify every field), a clear lawful basis / withdrawable consent, defined retention + erasure paths, and a **DPIA** for high-risk processing. Privacy requirements carry class `REQ-SEC-*` ([Conventions §3.4](../05_Conventions.md)).

**2. Accessibility — WCAG 2.2 AA + EN 301 549 / EU Accessibility Act.** The EAA has been **enforceable since 28 Jun 2025** (firms ≥10 staff or >€2M turnover); EN 301 549 maps to WCAG (2.1 AA today, 2.2 in progress). Design to **POUR** — Perceivable, Operable, Understandable, Robust — and test with real tools (axe DevTools, WAVE, Lighthouse, manual screen-reader). Accessibility requirements are `REQ-U-*`; defects are `ISS-*` scored by severity ([§5.1](../05_Conventions.md)).

**3. EU AI Act risk tiers + Article 50 transparency.** If the product uses AI / automated decisioning, classify it: **prohibited** (do not build — Kill candidate), **high-risk** (conformity, logging, human oversight, data governance), **limited-risk** (transparency), or **minimal**. High-risk deadlines were re-sequenced by the Digital Omnibus (standalone Annex III → 2 Dec 2027; embedded Annex I → 2 Aug 2028), **but Article 50 transparency duties bite from 2 Aug 2026** — disclose that users are interacting with AI, and label AI-generated content. Legal owns the classification; never self-certify high-risk.

**4. AI behaviour — bias, drift & quality, continuously.** Set eval/quality thresholds (`MET-*`), run **disaggregated fairness/bias review** (not one-time), and stand up **drift + performance monitoring with alert owners before launch** so it runs forever. Add hallucination/error guardrails (grounding, citations, refusal, confidence gating) and a fallback / human-in-the-loop path. Map to **NIST AI RMF** functions: Govern · Map · Measure · Manage.

**5. Security, trust & safety.** Threat-model beyond privacy: a foreseeable-misuse / harms taxonomy, protections for vulnerable users, and T&S controls (reporting, rate limits, moderation, escalation). Security/privacy requirements are `REQ-SEC-*`.

**6. Human-accountable, AI-assisted.** AI may *draft* DPIAs, accessibility checklists, risk classifications, and policy docs — but a **named human owns** every bias review, privacy/DPIA decision, accessibility sign-off, AI-Act classification, and human-oversight design. AI cannot be the accountable party ([Protocol §1, §10](../02_AI_Product_Manager_Protocol.md)).

> **Researching the law — never from memory.** Regulation editions and standard versions move (EU AI Act phasing, EAA, WCAG 2.1→2.2). Confirm the current binding obligation with a cited **`/research-report`** run (its Decision-brief/report mode), or web research per [`../prompts/research-and-agents.md`](../prompts/research-and-agents.md) trigger 4; hold the dependent `REQ-SEC-*`/`REQ-U-*` at `TODO: confirm via research` until sourced, and trace it to the cited edition. Flag anything ambiguous "confirm with Legal/Privacy."

### Risk scoring (Likelihood × Impact)

Score every responsible-product risk as `RSK-*` using the workflow's standard **Likelihood × Impact**, each rated **1–5**, on the 5×5 matrix → **Low / Medium / High / Critical** bands ([Conventions §5.3](../05_Conventions.md)). Distinguish *severity* of a live defect (`S1–S4`, §5.1) from the *risk score* of a possible future harm. A privacy breach or biased consequential decision is by definition **high impact** (cap impact at 4–5), so even a low-likelihood instance lands High/Critical and demands a named mitigation, owner, and status — never an empty cell. Open S1/S2 defects or unresolved privacy/accessibility/legal blockers **cannot pass a gate** (Hold or Persevere-with-actions, never Persevere).

---

## The living artifact(s) it maintains

| Artifact | ID form | Lives in | Status |
|---|---|---|---|
| **Responsible Product Review** | `RESPREV-<slug>-vX.Y` | `_threads/Responsible_Product_Review.md` | **Living** |
| Responsible-product risks | `RSK-<nn>` | extends `_threads/Risk_Register.md` | Living |
| Accessibility / safety defects | `ISS-<nn>` (sev `S1–S4`) | `10_Delivery/Risk_Register.md` → triage | tracked |
| Sign-off decisions | `DEC-<nn>` | `_threads/Decision_Log.md` | logged |

The **Responsible_Product_Review** ([template](../templates/Responsible_Product_Review.md)) is the single standing record that privacy, accessibility, AI behaviour, and safety were designed in. Its sections — **A** Privacy (GDPR Art. 25) · **B** Accessibility (WCAG 2.2 AA) · **C** EU AI Act tier + Article 50 · **D** AI bias/drift/quality · **E** Security, trust & safety — each force an explicit answer or a recorded `RSK-*`; **never a blank**. It is most heavily exercised by [Phase 07](../../.claude/skills/pm-phase-07-solution-design/) (ethics = 5th risk) and [Phase 08](../../.claude/skills/pm-phase-08-prd/) (NFRs: `REQ-SEC-*`/`REQ-U-*`), and kept alive at every phase's loop step 7 ([Protocol §7](../02_AI_Product_Manager_Protocol.md)).

---

## Reviewed at every gate: the questions

At **every** gate (G0–G10) the review re-runs against current scope; deep-review whenever data use, model/training data, a user-affecting automated decision, region, accessibility-affecting UI, or a relevant law/standard changes:

- **Privacy:** Do we process personal data? Lawful basis + withdrawable consent? Minimised to what's necessary? Retention + erasure paths defined? DPIA needed — and done?
- **Accessibility:** Target conformance (WCAG 2.2 AA)? POUR self-check passed on the in-scope flows? Any open `ISS-*`, with owner + due date? Audited with a real tool/screen reader?
- **AI Act:** If AI/automated decisioning — which risk tier, and who (Legal) confirmed it? If limited-risk, is **Article 50** transparency implemented (AI disclosure + AI-content labelling)? Is human oversight / override / kill-switch designed?
- **AI behaviour:** Eval thresholds met? Bias review run on protected groups? Is drift/performance monitoring **live before launch**, with an alert owner? Guardrails + fallback UX in place?
- **Safety & security:** Threat model done, no open S1/S2? Foreseeable-misuse taxonomy + T&S controls? Vulnerable users considered?
- **Accountability:** Is a **named human** signed off on each of the above — and is the gate recommendation honest (no Persevere over an open blocker)?

---

## Tailoring (Solo / Standard / Enterprise)

The thread is **never removed, only scaled** — and the floor holds at every size ([Tailoring §3](../04_Tailoring_Guide.md)). *If* the product can harm someone, exclude someone, or touch personal data / consequential AI, it is **at least Standard** on this thread regardless of product size.

- **Solo / Lean.** A lightweight checklist pass of the five sections — the gut-check: *harm? exclusion? data leak/misuse?* Privacy-by-design, basic accessibility (WCAG A/AA intent), and a security/ethics gut-check are **never** tailored out. Captured as a short `Responsible_Product_Review` filled inline.
- **Standard.** The full Responsible_Product_Review maintained as a living artifact; reviewed at major gates; DPIA where triggered; accessibility audited with a tool; AI tier classified; drift monitoring stood up.
- **Enterprise / Formal.** Formal evidence: approved DPIA, full WCAG 2.2 AA + EN 301 549 conformance record, Legal-confirmed AI-Act classification with conformity/logging, ISO/IEC 42001-aligned governance, continuous bias/drift monitoring with audit trails, and a documented human-oversight design. Mixed-track is normal — *Formal* on the PII/AI track, *Standard* elsewhere.

A tailored-down choice is **recorded** ("tailored: <reason>"), never silently dropped.

---

## Anti-patterns

- **"We'll do accessibility later / it's a QA pass."** It's enforceable EU law (EAA since Jun 2025), not an optional post-launch fix — and retrofits cost ~10×.
- **Privacy treated as a legal-team problem handled at the end.** GDPR Art. 25 requires it *by design and by default*; bolt-on consent and unminimised data are the failure mode.
- **"The EU AI Act is future, not now."** Prohibited-practice and GPAI rules already apply, and **Article 50 transparency bites 2 Aug 2026** — disclosure/labelling is a 2026 obligation, not a 2027 one.
- **One-time pre-launch fairness/bias check.** Responsible AI is **continuous monitoring**; models drift, data shifts, and a clean launch-day eval says nothing about month three.
- **Pasting AI output into a consequential decision with no verification or accountable human.** The AI drafts; a named human owns the bias call, the DPIA, and the sign-off — or the gate doesn't pass.

---

## References

- GDPR Art. 25 — data protection by design and by default: https://gdpr-info.eu/art-25-gdpr/
- WCAG 2.2 (W3C Recommendation): https://www.w3.org/TR/WCAG22/
- European Accessibility Act (enforceable 28 Jun 2025): https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/
- EU AI Act regulatory framework + implementation timeline: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai · https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act
- EU AI Act Omnibus re-sequencing (Article 50 kept for Aug 2026): https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- NIST AI Risk Management Framework (Govern/Map/Measure/Manage): https://www.nist.gov/itl/ai-risk-management-framework
- Workflow conventions (threads §10, IDs §3, severity §5.1, risk scoring §5.3): [../05_Conventions.md](../05_Conventions.md)

---
*Owning thread:* **Responsible Product** (Conventions §10.5) · *Living artifact:* [`_threads/Responsible_Product_Review.md`](../templates/Responsible_Product_Review.md) ·
*Companion threads:* Stakeholder Management · Metrics & Experimentation · Product Ops · Continuous Discovery · Portfolio ·
*Most exercised by:* [Phase 07 Solution Design](../../.claude/skills/pm-phase-07-solution-design/) (5th big risk) · [Phase 08 PRD](../../.claude/skills/pm-phase-08-prd/) (NFRs) ·
*Gate criteria:* [`../checklists/gate-reviews.md`](../checklists/gate-reviews.md) · *Grounding:* [`../reference/2026_Research_Pack.md`](../reference/2026_Research_Pack.md) §20
