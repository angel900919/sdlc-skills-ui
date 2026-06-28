---
Document: PRD — <FEATURE / INITIATIVE>
Document ID: PRD-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role / name>
Updated: <YYYY-MM-DD>
---

<!--
LEAN PRD — blank, reusable template. Owning skill: pm-phase-08-prd (Phase 08 — Requirements & PRD).
Conforms to ../05_Conventions.md: §6 frontmatter · §3 IDs (REQ-<class>-<nn>, FEAT-<nn>) ·
§3.4 NFR classes · §4 traceability spine · §5 severity/priority · §7 outcomes-over-outputs.

HOW TO USE THIS FILE
- A PRD *documents* validated discovery; it does not replace it. No "Must" without a parent SOL/OPP.
- Lean = §1–§3 + §6 + §8 on one page. Add §4–§5, §7, §9–§10 as audience/decision weight grows.
  Record any fold as "tailored: <reason>".
- Match weight to decision weight — shorter docs get read.
- Alternates (pick ONE format per build): PR_FAQ.md (customer-value-first / 0→1) ·
  Shape_Up_Pitch.md (fixed appetite, variable scope). NFRs always live in NFR_Checklist.md.
- AI drafts from real evidence; the human owns scope, trade-offs, NFR thresholds, GenAI
  guardrails, and sign-off. Never invent evidence/metrics/commitments → write "TODO: <owed>".
- Status flow (§6): Draft → In Review → Approved (G6-approved YYYY-MM-DD) → Superseded.
-->

## 1. Problem, user & outcome (BLUF)
<!-- The executive block. Outcome first, never a feature list. If any field is unknown → TODO, not a guess. -->

- **Problem (in the customer's words):** <TODO: the pain/job, quoted from evidence — not a solution>
- **Target user / persona:** `PER-<nn>` — <who; the segment that feels this most>
- **Parent opportunity:** `OPP-<nn>` <!-- traces to 04_Opportunity/Opportunity_Assessment.md; no PRD without one -->
- **Success metric (the outcome we move):** `MET-<nn>` <!-- reuse from 01_Strategy/North_Star_and_OKRs.md or 12_Analytics; never invent --> — target <TODO: from X → Y by DATE>; **guardrails** <TODO: what must NOT regress>
- **Strategic tie:** `OBJ-<nn>` / `KR-<nn>` · roadmap item `RMI-<nn>` (Now / Next / Later: <which>)

## 2. Why now / context
<!-- The evidence that earns this build a slot. Link, don't re-summarize. -->

- **Evidence:** `INS-<nn>`, `INS-<nn>` · validated assumptions `ASM-<nn>` <!-- from 03_Discovery & 07_Solution -->
- **Validated bet (input):** `SOL-<nn>` <!-- from 07_Solution/Solution_Validation.md; the spine SOL ──spec──▶ REQ/FEAT starts here -->
- **Why now:** <TODO: the trigger — window, risk, dependency, strategic shift>

## 3. Scope — in / out / later
<!-- Make scope explicit BOTH ways. MoSCoW → Must=P0, Should=P1, Could=P2, Won't=record it. Hold the MVP line. -->

| Bucket | What | MoSCoW / Priority |
|--------|------|-------------------|
| **In (MVP)** | <TODO: smallest slice that moves the MET + produces learning> | Must / P0 |
| **In (MVP)** | <TODO> | Must / P0 |
| **Later** | <TODO: deferred, directional> | Could / P2 |
| **Out (no-gos)** | <TODO: explicit "Won't do" — mandatory, this is where launches die> | Won't |

> _MVP test: if a requirement doesn't move the `MET-*` or de-risk a tested `ASM-*`, it is Should/Could/Won't — not Must._

## 4. Solution overview
<!-- Narrative of intent, not pixels. Prototype-as-spec (Cagan): link the hi-fi prototype rather than describing UI in prose. -->

- **Prototype (the spec for UX/interaction):** <TODO: link to 07_Solution/Prototype_Plan.md or Figma>
- **Approach (one paragraph):** <TODO: how the slice delivers the outcome — intent, not implementation>

## 5. Functional requirements
<!-- Decompose the slice into FEAT-<nn> epics; each REQ-F-<nn> is TESTABLE (fit criteria or Given/When/Then).
     Replace "fast / intuitive / secure" with a number + condition. Every REQ cites a parent SOL/OPP. -->

| FEAT | REQ ID | Statement (testable — fit criteria or Given/When/Then) | Priority | Parent SOL/OPP |
|------|--------|--------------------------------------------------------|----------|----------------|
| FEAT-<nn> <NAME> | REQ-F-<nn> | Given <context>, when <action>, then <observable result> | P0 | SOL-<nn> / OPP-<nn> |
| FEAT-<nn> | REQ-F-<nn> | <TODO: number + condition, not an adjective> | P1 | SOL-<nn> / OPP-<nn> |

## 6. Non-functional requirements
<!-- Every §3.4 class gets ONE line — even "N/A — because…". Blank is not allowed. Numeric thresholds.
     Mirror the full table in NFR_Checklist.md (the source of truth for NFR sign-off). -->

- **Usability / Accessibility (`REQ-U-*`):** WCAG 2.2 AA on all new flows (EN 301 549 / EAA) · <TODO: task-time / learnability target>
- **Performance (`REQ-P-*`):** <TODO: e.g. p95 < N ms; throughput; capacity>
- **Reliability / Operational (`REQ-O-*`):** <TODO: SLO/uptime; error handling; rollback via flag; data retention>
- **Security / Privacy (`REQ-SEC-*`):** GDPR Art. 25 (by-design) · EU AI Act Art. 50 transparency (if AI-facing, from 2026-08-02) · <TODO: authN/Z, consent, DPIA owed?>
- **Constraint (`REQ-C-*`):** <TODO: budget / platform / mandated tech / legal — or "N/A — because…">

> Full per-class table with "Answered?" status → **NFR_Checklist.md**.

## 7. GenAI requirements
<!-- ONLY if the feature uses a model. Delete this section for non-AI features — don't pad.
     File behaviour under REQ-F-*, guardrails/reliability under REQ-SEC-*/REQ-O-*. -->

- **Model behaviour (`REQ-F-*`):** <TODO: what the model does / must not do; tone; scope boundaries>
- **Eval / quality thresholds (`REQ-F-*`):** <TODO: acceptance metric + bar, e.g. ≥ X% on eval set; offline + online>
- **Hallucination / bias guardrails (`REQ-SEC-*`):** <TODO: grounding, refusal, content filters, fairness check>
- **Fallback UX (`REQ-O-*`):** <TODO: behaviour on low confidence / model outage / refusal>
- **Human-in-the-loop / oversight (`REQ-SEC-*`):** <TODO: who reviews consequential outputs; override; audit trail>

## 8. Success metrics & guardrails
<!-- Restate the outcome and seed measurement. Every risky requirement gets an EXP-TBD (seeds P12/P13). -->

| Metric | ID | Tier (success / guardrail / diagnostic) | Target | Test |
|--------|----|-----------------------------------------|--------|------|
| <primary outcome> | MET-<nn> | success | <from X → Y by DATE> | EXP-<nn> / EXP-TBD |
| <must-not-regress> | MET-<nn> | guardrail | <threshold> | — |

## 9. Open questions & dependencies
<!-- Every open item = TODO: <owed> + owner + date. Never a silent gap. -->

- **Open questions:** TODO: <question> — owner <name>, due <YYYY-MM-DD>
- **Dependencies:** `DEP-<nn>` — <what / who / when>
- **Carried assumptions:** `ASM-<nn>` — <still-untested; how it will be validated>
- **Risks:** `RSK-<nn>` (severity per §5) — <impact + mitigation>

## 10. Changelog & approvals
<!-- One living source of truth (Product Ops standard). On G6 sign-off set status → Approved (G6-approved YYYY-MM-DD). -->

| Version | Date | Author | Change |
|---------|------|--------|--------|
| v0.1 | <YYYY-MM-DD> | <name> | Initial draft |

**G6 — PRD Approved / Build Entry sign-off:** Eng <name/date> · Design <name/date> · Key stakeholders <name/date>
<!-- A gate is a DECISION: Persevere · Persevere-with-actions · Pivot · Hold · Kill (§2). Pivot/Kill are valid. -->

---

### Related templates & next step
- **NFR_Checklist.md** — the per-class NFR table this PRD's §6 mirrors (required for G6).
- **PR_FAQ.md** / **Shape_Up_Pitch.md** — alternate spec formats (use one *instead of* this PRD).
- **Upstream:** `07_Solution/Solution_Validation.md` (validated `SOL`/`ASM`) — owning skill **pm-phase-07-solution-design**.
- **Next:** slice this PRD into a ready, testable backlog → **pm-phase-09-stories** (`Story_Map.md`, `User_Stories.md`).
- _Owning skill: **pm-phase-08-prd**. Conventions: ../05_Conventions.md._
