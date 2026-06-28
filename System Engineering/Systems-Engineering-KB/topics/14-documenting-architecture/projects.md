# Documenting System Architecture — Projects

## Guided project — architecture documentation package for a chosen system

**Goal.** Produce a complete architecture documentation package — **BDD + IBD + ICD outline + FFBD** — for a system of your choice (e.g., a smart thermostat, a warehouse pick robot, a home security hub). The package must match the structure of the course's autonomous-delivery-robot set (source: m3-document; source: m3-icd; source: master-notes).

**Requirements.**
- The system has at least 4 components.
- The ICD outline specifies at least one interface fully (format, message example, update frequency, protocol, one constraint).
- The FFBD has at least one branch/loop.
- The package is tailored: include a one-paragraph high-level overview for non-technical stakeholders.

**Suggested steps & "done" criteria per milestone.**

**Milestone 1 — BDD (structure).** Apply the five BDD steps: identify system + components, define blocks (properties + operations), establish relationships (composition/association/generalization), add properties, draw in a tool (source: master-notes).
*Done when:* every component is a block with ≥1 property; each relationship uses the correct connector (filled diamond / hollow triangle / plain line) and you can justify it.

**Milestone 2 — IBD (internal interaction).** Pick one block from your BDD and decompose it with the five IBD steps: choose block → internal parts → connections → ports (standard vs. flow) → tool (source: m3-document).
*Done when:* the chosen block shows ≥2 internal parts, their connections, and at least one standard port and one flow port, each correctly typed.

**Milestone 3 — ICD outline (interface contract).** Outline all six ICD sections (overview, interface description, data exchange details, communication protocols, constraints/assumptions, version control); fully specify at least one interface (source: m3-document; source: m3-icd).
*Done when:* the fully specified interface has a data format, a concrete message example, an update frequency, a protocol, and at least one constraint; a version-control row exists.

**Milestone 4 — FFBD (behavior).** Model the system's main function as an FFBD: blocks (steps), arrows (order), and at least one branch/loop for a conditional/iterative case (source: m3-document).
*Done when:* the flow reads as a coherent sequence and the branch is labeled (e.g., success vs. retry).

**Milestone 5 — Tailor for stakeholders.** Add a high-level overview (capabilities/benefits, no jargon) for customers/managers, and confirm engineers/QA can find interfaces and a functional breakdown (source: m3-document; source: m3-review).
*Done when:* a non-technical reader can describe what the system does from your overview alone, and a QA reader can trace functions to components.

## Independent (challenge) project — interface-driven integration package

**Goal.** Document the architecture of a *two-organization* system where each org owns half the components and they meet at one critical interface (e.g., a delivery-robot vendor and a cloud-platform vendor, mirroring the ADR Communication Module ↔ Cloud Server link).

**Constraints.**
- Produce BDD + IBDs (one per org's main subsystem) + a full ICD (all six sections, not just an outline) + FFBD.
- The ICD must specify *every* cross-org interface completely (format, message, frequency, protocol, error handling, constraints) and include a version-control/change-management section with ≥2 versions showing a documented change.
- Apply all five best practices (tailor, clear language, visuals, traceability, justification); include a short "decisions & justification" note explaining one trade-off (e.g., protocol or format choice) (source: m3-document).
- Cumulative tie-in: link at least one interface to a requirement (traceability — see [07-requirements-management](../07-requirements-management/README.md)).

## Build notes & solution sketch

**Architecture of the package.** Build in artifact order BDD → IBD → ICD → FFBD; this mirrors the lifecycle where the BDD is a living document refined through the IBD/ICD phases, so structure stabilizes before you commit to interface contracts (source: m3-document).

**Key decisions + why.**
- *Connector choice in the BDD:* default to composition for essential parts (whole-part); reserve association for looser "uses" links and generalization only for genuine is-a-kind-of inheritance — over-using association understates real dependencies (source: m3-document; source: master-notes).
- *Port choice in the IBD:* flow ports for anything physically/quantitatively flowing (energy, material, data streams); standard ports for interface/service interactions — getting this wrong misleads downstream integrators (source: m3-document).
- *ICD completeness:* the hard part is *not* the diagram but the data-exchange details — update frequency and constraints are the fields most often dropped and the ones integration depends on (use the ADR's 10 Hz / 100 Hz / 30 s and 20V–25V / 10 ms-latency constraints as a model) (source: m3-icd).

**The hard parts.** (1) Keeping the four artifacts *consistent* — a block added in the IBD must appear in the BDD; an interface in the IBD must have an ICD entry (source: m3-review). (2) Tailoring without duplicating effort — write the technical detail once, then derive the high-level overview from it. (3) Choosing where an FFBD branch belongs — only add a branch where there is genuinely conditional/iterative behavior, otherwise keep the flow linear like the ADR's six-step sequence (source: m3-document).
