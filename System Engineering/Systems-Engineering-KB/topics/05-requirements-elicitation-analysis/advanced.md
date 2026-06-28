# Eliciting & Analyzing Requirements — Advanced concepts

## Advanced concepts

- **Domain requirements cut across the functional/non-functional split.** A domain requirement is industry-vertical specific and *can be either functional or non-functional*; its job is to align the product with established standards for its category and ensure adherence to domain regulations (source: master-notes). So classification is not a clean three-way bucket — a single UL 1023 compliance item is simultaneously a domain requirement and (functionally) about how the alarm behaves (source: master-notes).
- **Compliance has commercial, not just technical, force.** Domain compliance (e.g., UL 1023 for intrusion detection alarm units) is "often necessary for insurance approvals and certifications," so a domain requirement can gate market access independently of whether the system works (source: master-notes).
- **Prioritization can be quantitative, not just labels.** Beyond High/Medium/Low/N/A, you can determine a set of factors, evaluate them on a weighted scale, and assign scores based on alignment to goals while keeping costs and risks low (source: m2-elicit). The label scheme is the simplified surface of that weighted method.

## Edge cases & gotchas

- **The "constraint vs domain" ambiguity is real in this material.** m2-elicit lists regulatory compliance as a *constraint*; master-notes treat a standard-specific item as a *domain requirement*. Expect both framings and disambiguate by intent: a generic limit (budget) is a constraint; a tie to a named industry standard is a domain requirement (source: m2-elicit, master-notes).
- **Hard-to-elicit categories cluster.** The riskiest requirements are exactly the ones methods miss: non-functional (users don't know what they want), implicit (assumed and unstated), and interoperability (assumed integrations that may not hold, e.g., voice control of an incompatible AC) (source: m2-ex-elicit).
- **Survey quality is fragile.** Poorly designed questions don't just lose depth — they produce *misleading or inaccurate* data, which is worse than no data because it looks authoritative (source: master-notes).
- **N/A is a real category, not a gap.** It means "not evaluated / document review," so a requirement sourced from document review may legitimately carry N/A rather than a High/Medium/Low score (source: m2-elicit).

## Performance, production & security considerations

The source material frames performance, scalability, reliability, and security as *non-functional requirement categories* to be elicited and analyzed — not as topics it develops here (source: m2-elicit, master-notes). Security expectations are explicitly called out as hard to elicit because users don't always know what they want (source: m2-ex-elicit). Deeper performance analysis methods (benchmarking, simulation, load testing, latency/throughput) live in the design-architecture material, not this topic.

## Where to go deeper

- **UL 1023** — safety standard for intrusion detection alarm units; the canonical domain-requirement example, useful for studying how named standards drive requirements (source: master-notes).
- **ENERGY STAR** — energy-efficiency standard cited as the regulatory-body source for a thermostat requirement; another concrete domain/regulatory anchor (source: m2-ex-elicit).
- **[06-verifying-requirements](../06-verifying-requirements/README.md)** — SMART criteria and verification: how to judge whether an elicited requirement is well-written. One step downstream of this topic.
- **[07-requirements-management](../07-requirements-management/README.md)** — traceability types (forward/backward/bidirectional), ReqView, and change management: how requirements are tracked once elicited.
- **[08-sysml-modeling](../08-sysml-modeling/README.md)** — modeling requirements and their relationships (derivation, satisfaction, verification, refinement) as the system grows complex.
