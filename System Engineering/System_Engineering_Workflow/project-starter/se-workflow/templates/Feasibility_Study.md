---
Document: Feasibility Study — <Project Name>
Document ID: FEAS-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

<!--
TEMPLATE — Phase 01 (Concept). Owning skill: se-phase-01-concept.
The feasibility study is the GATE of the Concept phase. Verdict all four dimensions
before declaring the phase done. Each verdict is Go / Conditional-Go / No-Go with
evidence or a TODO. A non-waivable No-Go on any dimension BLOCKS MCR.
Fill every <ANGLE-BRACKET> placeholder; resolve or delete every TODO. Invent no numbers.
Low-TRL items and unretired conditions become RSK-* in Project_Development_Plan.md.
Regulatory items become candidate C-/D- constraints for Phase 02.
The "(example — delete)" line is illustrative only.
-->

## 1. Technical feasibility

- **Verdict:** <Go | Conditional-Go | No-Go>
- **Evidence:** <can it be built with available/maturing technology?>
- **Low-TRL / immature items:** <list — log each as RSK-* in the PDP>
- **Conditions to retire (if Conditional-Go):** <named risk(s) → RSK-*>

## 2. Market / operational feasibility

- **Verdict:** <Go | Conditional-Go | No-Go>
- **Evidence:** <is there real demand/need? will it be adopted?>
- **Comparable systems / benchmarks:** TODO: <data owed>

## 3. Regulatory / legal feasibility

- **Verdict:** <Go | Conditional-Go | No-Go>
- **Applicable standards / certifications / laws:** <e.g. ISO 26262 | IEC 62304 | DO-178C | PCI-DSS | GDPR>
  → captured as candidate `C-` / `D-` constraints for Phase 02.
- **Open compliance questions:** TODO: <owed>
- Applicable: GDPR (data processing), ISO 27001 (security controls) → candidate REQ-D <!-- (example — delete) -->

## 4. Economic feasibility

- **Verdict:** <Go | Conditional-Go | No-Go>
- **ROM cost vs. benefit:** TODO: <rough order-of-magnitude — full estimate deferred to Phase 05>
- **Funding alignment:** <fits the agreement budget ceiling? cross-ref Agreement_Register §7>

## 5. Overall recommendation

- **Recommendation:** <Go | Conditional-Go | No-Go>
- **Conditions (if Conditional-Go):** <the named risks/actions that must be retired before/at MCR>
- **Blocking issues (if No-Go):** <the non-waivable blocker(s)>

> A No-Go on any non-waivable dimension stops the phase at MCR.
