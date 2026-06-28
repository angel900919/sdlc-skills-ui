# Architecture Frameworks: TOGAF, Zachman, NIST — Projects

## Guided project — apply the TOGAF ADM end-to-end to a Smart Campus System

**Scenario (grounded in source).** A university wants a Smart Campus System integrating smart classroom scheduling, IoT-based energy management, a student mobile app, and campus-wide Wi-Fi/cloud services. Apply TOGAF's ADM to guide the architecture, aligning it with stakeholder needs, technology solutions, and business goals (source: m3-ex-togaf).

**Goal.** Produce a one-page-per-phase ADM document covering all 9 phases plus how Requirements Management threads through them.

**Requirements.**
- One short section per phase: Preliminary, A–H (source: m3-togaf for each phase's purpose).
- Each section states the *phase's purpose* (from the ADM table) and *its Smart Campus application*.
- Show how at least one requirement (e.g., "energy savings" or "student experience") is traced from Preliminary through to Phase H — that is your Requirements Management thread.

**Suggested steps & "done" criteria per checkpoint.**

| Checkpoint | Do | Done when |
|---|---|---|
| 1. Principles | Preliminary: define modularity, interoperability, sustainability; identify stakeholders (IT, facilities, academic depts, leadership) (source: m3-ex-togaf) | Principles + stakeholder list written |
| 2. Vision (A) | State scope (student experience, energy savings, integrated services) and the buy-in story | Vision distinguishes *why/what-for* from *how-it-works* (the A-vs-B trap, source: m3-ex-togaf) |
| 3. Domains (B–D) | B: map class scheduling/facilities/student support. C: data flows + apps (IoT dashboard, mobile app). D: Wi-Fi, IoT sensors, cloud, mobile backend (source: m3-ex-togaf) | Each of B, C, D has system-specific content |
| 4. Delivery (E–F) | E: vendors, existing assets (LMS), integration points, solution packages. F: phased rollout (e.g., energy mgmt in 5 buildings → full campus) (source: m3-ex-togaf) | E lists solution packages; F has a phased timeline |
| 5. Govern & evolve (G–H) | G: contractors follow architecture, validate vs requirements. H: process for future changes (new services/buildings) (source: m3-ex-togaf) | G has validation checkpoints; H has a change process |
| 6. Trace | Pick one requirement; show it surviving every phase | The requirement appears, unbroken, Preliminary→H |

A complete model answer (the per-phase summary table) is in [examples.md](examples.md) Solutions and in the source (source: m3-ex-togaf) — use it only to check, not to copy.

## Independent (challenge) project — apply the TOGAF ADM end-to-end to a system of your choice

**Brief.** Choose any non-trivial system *other than* the online banking or Smart Campus examples (e.g., a ride-hailing platform, a hospital records system, a logistics tracker). Apply the TOGAF ADM to it end-to-end.

**Goal + constraints only:**
- Cover all 9 ADM phases plus central Requirements Management (source: m3-togaf).
- Name at least three quality attributes up front (as the banking example did with performance/reliability/security/usability) and carry them through the phases (source: m3-applytogaf).
- Produce at least one of each **artifact type**: a catalog, a matrix, and a diagram for your system (source: m3-togaf).
- *Cumulative extension:* cross-check your produced artifacts with a partial **Zachman matrix** — confirm at least the "What" and "How" columns are answered for the Planner and Builder perspectives (source: m3-zachman). This forces you to combine a process framework (TOGAF) with a taxonomy framework (Zachman).

## Build notes & solution sketch

- **Architecture of the deliverable:** treat the 9 phases as the document's outline; the worked online-banking example (source: m3-applytogaf) is the gold template for *depth* — each phase pairs a generic purpose with concrete, system-specific outputs.
- **Key decision — which framework leads:** TOGAF leads because the deliverable is a *build-and-govern process*. Zachman is used only as a *coverage check* layered on top, never as the spine (source: master-notes §Architectural Frameworks). Choosing Zachman as the spine would give you a documentation grid with no delivery roadmap — the classic type confusion.
- **The hard part — Vision (A) vs Business Architecture (B):** keep A about *goals and buy-in* (what we aim to achieve and why) and B about *how the business works and what functions must be enabled*. Mixing them is the most common error (source: m3-ex-togaf).
- **Requirements thread:** the easiest way to demonstrate Requirements Management is a single traceability column added beside each phase — pick one attribute and show its phase-by-phase fate (source: m3-togaf).
- **Artifacts cheat:** a catalog is a *list* (e.g., Application Portfolio), a matrix maps *X against Y* (e.g., Role-to-Application), a diagram shows *flow/structure* (e.g., Application Communication Diagram) (source: m3-togaf).
- For *how to document* the resulting architecture in general, see [14-documenting-architecture](../14-documenting-architecture/README.md); for *evaluating trade-offs* between design options surfaced in Phase E, see [12-design-tradeoffs](../12-design-tradeoffs/README.md).
