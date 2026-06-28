# Agile Systems Engineering Playbook (Capstone) — Advanced concepts

Terse, for someone who already holds the six-phase schema. Single source: `playbook`. Concepts owned elsewhere are linked, not re-derived.

## Advanced concepts

- **Tool-spanning traceability as a naming contract.** The playbook does not buy a traceability tool — it enforces traceability *by convention*: the requirement ID is embedded literally in JIRA titles, branch names, commit messages, and TC IDs, so the link is the string itself (source: playbook). This makes traceability greppable and tool-agnostic, but only as strong as discipline at commit time — hence the rules "every Story links to a SyRS ID" and "commits must reference the ID."
- **Bidirectional traceability is a Formal-level add-on, not the default.** Minimum-Viable relies on the forward ID chain in JIRA; only the Formal level mandates *bidirectional* traceability (need ↔ requirement ↔ design ↔ test) (source: playbook). Direction matters for impact analysis: backward links answer "what need justified this code?"; forward links answer "what tests cover this requirement?" → [topic 07](../07-requirements-management/fundamentals.md).
- **Two success gates, two different proofs.** Phase 1's gate is *human* (stakeholder sign-off on the Architecture Vision); Phase 5's gate is *quantitative* (100% requirement coverage in the verification matrix) (source: playbook). The capstone's integrity rests on both — one prevents building the wrong thing, the other proves the right thing was built.
- **MBSE as the Formal modeling backbone.** At Formal level the models are not just diagrams in `/models` — they are MBSE models in Cameo/Visual Paradigm (source: playbook). MBSE foundations → [topic 09](../09-mbse-requirements/fundamentals.md) is not in this brief's link set; the playbook only names the tool, so treat MBSE depth as owned by topic 08/09.

## Edge cases & gotchas

- **The naming table has internal collisions if `[Type]` codes aren't disjoint.** `AI-SYS-001` (system) and `AI-USR-012` (user) coexist because SYS≠USR; reusing a number across types or projects defeats the single-grep property (source: playbook).
- **JIRA-ID ≠ Requirement-ID.** The branch/commit conventions key off the **JIRA-ID** (`PROJ-101`), while the test case keys off the **Requirement-ID** (`AI-SYS-001`) (source: playbook). The Smart Home example even mixes them (`feature/AI-SYS-101-yolo` uses the requirement-style ID). The chain only stays traceable if the JIRA Story explicitly links back to the SyRS requirement ID, bridging the two namespaces (source: playbook).
- **Hardening-sprint validation can fail a fully-verified system.** Every `TC-` can pass (verification) yet UAT reveal the alerts are annoying with false positives (validation fails) (source: playbook, Smart Home step 8). Coverage ≠ acceptance.
- **Phase 6 feedback loop is implicit.** The source lists six forward phases; change requests from operations re-enter through change management, but the playbook documents this via the *checklist* and the Formal-level *CCB* rather than a drawn loop (source: playbook). Continuous validation → [topic 18](../18-change-management-continuous-validation/fundamentals.md).

## Performance, production & security considerations

The source's only production/operations guidance is in **Phase 6**: execute migration planning via **Blue-Green deployment**, and monitor **resource utilization and uptime** through GitLab CI/CD automated deployment (source: playbook). It does not cover security hardening, threat modeling, or capacity planning as distinct activities.

> Beyond Phase 6 monitoring and Blue-Green migration, the source material does not cover performance, production, or security engineering in depth.

## Where to go deeper

- **ISO 29148** — the requirements-engineering standard whose full document suite defines the Formal level; start at [topic 04](../04-se-tools-techniques/fundamentals.md) (source: playbook).
- **MBSE tooling (Cameo / Visual Paradigm)** — for the Formal-level modeling backbone; the SysML notation itself is in [topic 08](../08-sysml-modeling/fundamentals.md) (source: playbook).
- **Change Control Board & impact analysis** — the governance machinery behind the change checklist; [topic 18](../18-change-management-continuous-validation/fundamentals.md) (source: playbook).
- **Verification & validation methods** — to make the verification matrix rigorous; [topic 16](../16-verification-validation-methods/fundamentals.md) (source: playbook).
