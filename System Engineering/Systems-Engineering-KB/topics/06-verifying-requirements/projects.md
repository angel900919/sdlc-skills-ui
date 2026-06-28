# Verifying Requirements — Projects

## Guided project: make a draft requirement set SMART + build a peer-review checklist

**Scenario.** You inherit a set of draft requirements for an autonomous delivery robot (or smart home system) and must get them ready for design (source: m2-ex-verify, m2-verify).

**Goal.** Produce (1) a verification table judging each requirement, (2) SMART rewrites of every non-SMART requirement, and (3) a reusable peer-review checklist.

**Requirements (inputs).** Start from these five drafts (source: m2-ex-verify): "fast and responsive"; "detect obstacles within 1 meter and stop within 2 seconds"; "intuitive"; "battery shall last at least 8 hours under continuous operation"; "sleek and modern design." Add two of your own loose requirements to verify.

**Suggested steps & checkpoints:**

1. **Verification table** — columns: Requirement | Verifiable? | Why | Revised. *Done when:* every row has a yes/no with a one-line reason (source: m2-ex-verify).
2. **SMART rewrites** — for each "No," rewrite to satisfy Specific, Measurable, Achievable, Relevant, Testable. *Done when:* each rewrite has a measured value AND an operating condition (source: m2-verify).
3. **Template pass** — re-express at least two rewrites with the `[system] shall [function] [measurable condition] [under conditions]` template. *Done when:* both have all four slots filled (source: m2-verify).
4. **Peer-review checklist** — build a checklist a reviewer ticks per requirement (template below). *Done when:* it covers clarity, completeness, consistency, and verifiability (source: m2-verify).
5. **Walkthrough dry-run** — narrate walking a teammate through three requirements; record which they flag as hard to verify. *Done when:* at least one flagged item is revised (source: m2-verify).

**Peer-review checklist (starter — extend it):**

- [ ] Specific — clear and unambiguous? (source: m2-verify)
- [ ] Measurable — has a quantity you can assess objectively? (source: m2-verify)
- [ ] Achievable — technically/practically feasible? (source: m2-verify)
- [ ] Relevant — aligned with system goals & stakeholder needs? (source: m2-verify)
- [ ] Testable — a named verification method (inspection/test/analysis/demonstration)? (source: m2-verify)
- [ ] Operating conditions/context stated? (source: m2-verify)
- [ ] Free of subjective adjectives ("fast," "intuitive," "sleek")? (source: m2-ex-verify)
- [ ] Complete & consistent with the rest of the set? (source: m2-verify)

## Independent (challenge) project

Take a draft requirement set for a system of your choice (e.g., the communication satellite from m2-verify, or a smart home security system from master-notes). Constraints only: (1) at least 8 requirements, with a deliberate mix of verifiable and non-verifiable; (2) deliver a full verification table, SMART rewrites, template-formatted versions, and a peer-review checklist with at least 8 items; (3) include one requirement that is *measurable but not yet testable* and fix it by adding operating conditions; (4) add a one-paragraph note distinguishing what you did (requirement verification) from system validation done later (cross-ref [16-verification-validation-methods](../16-verification-validation-methods/README.md)). Goal: a review-ready, fully verifiable requirement set.

## Build notes & solution sketch

- **Architecture:** one table is the spine — drive rewrites, template versions, and the checklist from it so nothing drifts out of sync.
- **Key decision — which SMART phrasing?** Use the m2-verify version (Achievable/Testable) as primary; if a stakeholder or standard imposes deadlines, fold in the master-notes Time-bound dimension (source: m2-verify, master-notes).
- **Hard part — "measurable but not testable":** a number alone (e.g., "50 packets per second") is not reproducibly checkable until you add context ("under nominal operating conditions"); that operating-condition slot is what turns measurable into testable (source: m2-verify).
- **Hard part — keeping verification distinct from validation:** everything in this project is about the *statements*; the field/acceptance testing of the built robot belongs to topic 16 (source: m2-verify; cross-ref [16-verification-validation-methods](../16-verification-validation-methods/README.md)).
- **Optional traceability:** if you want to visualize requirement relationships and links to verification activities, sketch a SysML requirement diagram — see [08-sysml-modeling](../08-sysml-modeling/README.md) (source: m2-verify).
