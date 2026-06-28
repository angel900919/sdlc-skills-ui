# Architecture Frameworks: TOGAF, Zachman, NIST — Exercises

Attempt each from memory first. All answers and rubrics are in Solutions at the bottom.

## Warm-up (Tier 1 — production recall)

1. From memory, spell out what **TOGAF** stands for and say which *kind* of framework it is (process, taxonomy, or layered model).
2. From memory, list the **9 ADM phases** in order (Preliminary, A–H) and name the central process that spans all of them.
3. From memory, list the **six Zachman interrogatives** and the aspect each maps to (What→?, How→?, Where→?, Who→?, When→?, Why→?).
4. From memory, list the **five NIST EA layers**.
5. From memory, name the **three TOGAF artifact types** and give one example of each.

## Core exercises (Tier 2 — apply to scenario)

6. **(Apply)** For the online banking system, assign each fact to its correct ADM phase: (a) "transactions process in < 2 seconds" principle; (b) "Blue-Green deployment"; (c) "microservices + API Gateway"; (d) "PCI DSS / ISO 27001 / GDPR compliance enforcement"; (e) "millions of concurrent users" goal + stakeholder list (source: m3-applytogaf).

7. **(Apply — guidance-fading pair, part 1 of 2 / worked)** Place this fact in the right Zachman cell for the digital banking system: *"essential capabilities: transfers, account management, fraud detection,"* identified at the highest-level scope. Give the row and the column. *(This one is worked in Solutions as the model.)* (source: master-notes §Architectural Frameworks)

8. **(Apply — guidance-fading pair, part 2 of 2 / you do it)** Now place this fact yourself: *"physical data structures such as database tables and JSON formats."* Give the Zachman row and column for the digital banking system (source: master-notes §Architectural Frameworks).

9. **(Apply)** A team says: "We finished Phase A, so requirements are locked." What is wrong with that statement in TOGAF terms (source: m3-togaf)?

10. **(Apply)** Fill the **"How" (Function)** column of a Zachman matrix for the *airline reservation system* for the Planner and the Functioning System rows only. (Hint: mirror the structure of the worked "What" column in [examples.md](examples.md).)

11. **(Apply — Feynman / explain it back)** In 4–6 sentences, explain to a non-architect *why* Requirements Management is drawn at the centre of the ADM rather than as a final phase. Self-check rubric below.

## Challenge exercises (Tier 3 — analyze / evaluate)

12. **(Analyze — interleaved set)** For each need, first decide *which framework applies* (TOGAF, Zachman, or NIST), then justify in one line:
    - (a) "We need a repeatable step-by-step process to develop and govern our architecture."
    - (b) "We need to verify that every stakeholder viewpoint has answered every architectural question."
    - (c) "We need to slice our enterprise into business, information, systems, data, and technology layers."
    - (d) "We want to know which phase produces the migration roadmap."
    - (e) "We want a classification grid with no prescribed order."
    (source: m3-togaf; m3-zachman; m3-nist; master-notes §Architectural Frameworks)

13. **(Analyze)** A colleague claims "NIST and TOGAF both have a Data Architecture, so they're basically the same." Diagnose what is right and what is wrong with this (source: m3-togaf; m3-nist).

14. **(Evaluate)** A startup must produce architecture documentation for a small system in two weeks with no EA team. Argue whether they should adopt the full TOGAF ADM, just a Zachman coverage check, or NIST layering — and justify your choice against the frameworks' *types* (source: master-notes §Architectural Frameworks).

15. **(Build the map yourself)** You are given these nodes: `Preliminary, A, B, C, D, E, F, G, H, Requirements Management`. Draw the ADM as a directed graph: which node points to which, where does H feed back, and how does Requirements Management connect? (Check your edges against the diagram in [fundamentals.md](fundamentals.md).) (source: m3-togaf)

---

## Solutions & explanations

1. **The Open Group Architecture Framework**; it is a **process/method** (the ADM is a step-by-step cyclical process) (source: m3-togaf).

2. **Preliminary, A – Architecture Vision, B – Business Architecture, C – Information Systems Architecture, D – Technology Architecture, E – Opportunities & Solutions, F – Migration Planning, G – Implementation Governance, H – Architecture Change Management.** Central spanning process = **Requirements Management** (source: m3-togaf). *Common wrong answer:* listing Requirements Management as a 10th sequential phase — it is central, not sequential.

3. **What→Data, How→Function, Where→Network, Who→People, When→Time, Why→Motivation** (source: m3-zachman).

4. **Business Architecture, Information Architecture, Information Systems Architecture, Data Architecture, Technology Infrastructure Architecture** (source: m3-nist).

5. **Catalogs** (e.g., Application Portfolio / Technology Standards / Business Service Catalog), **Matrices** (e.g., Role-to-Application / Data Entity-to-Business Function), **Diagrams** (e.g., Business Process Models / Application Communication Diagrams) (source: m3-togaf).

6. (a) **Preliminary** (principles); (b) **F – Migration Planning** (deployment strategy); (c) **C – Information Systems Architecture** (application architecture); (d) **G – Implementation Governance** (compliance); (e) **A – Architecture Vision** (goals + stakeholders) (source: m3-applytogaf).

7. **Row = Planner (Scope), Column = How (Function).** Reasoning: it states *essential capabilities* (How = function) at the *highest-level scope* (Planner) (source: master-notes §Architectural Frameworks — "Planner · How: transfers, account management, fraud detection").

8. **Row = Builder (Tech), Column = What (Data).** Reasoning: physical data structures = the **What/Data** aspect at the **Builder/technology** perspective (source: master-notes §Architectural Frameworks — "Builder · What: database tables, JSON formats"). *Common wrong answer:* placing it under Designer — Designer holds *logical* models, Builder holds *physical* ones.

9. Requirements Management is the **central process that traces requirements across all phases**, not a one-time step that ends after Phase A. Requirements continue to be elaborated, traced, and validated through every phase to H, so they are never "locked" by finishing Vision (source: m3-togaf).

10. Model answer (mirroring the worked "What" column structure) — Planner · How: high-level capabilities such as *search flights, book a ticket, cancel/refund*; Functioning System · How: the *running reservation software executing live booking transactions*. (Graded on: Planner = abstract capabilities, Functioning System = actual running behavior; structure parallel to the "What" column in [examples.md](examples.md), source: m3-zachman.)

11. **Rubric — award a point for each:** (1) requirements arise and change in *every* phase, not just at the start; (2) the centre position shows it *touches/links* all phases; (3) it provides **traceability** so a need raised anywhere stays visible; (4) drawing it at the end would imply requirements are handled once and frozen, which is false. A solid answer hits at least 3 of 4 (source: m3-togaf).

12. (a) **TOGAF** — it is the process/method. (b) **Zachman** — its 6×6 matrix forces viewpoint × question coverage. (c) **NIST** — it is the five-layer model. (d) **TOGAF** — Phase F (Migration Planning) produces the roadmap. (e) **Zachman** — a classification taxonomy with no prescribed order (source: m3-togaf; m3-zachman; m3-nist; master-notes §Architectural Frameworks).

13. **Right:** both frameworks do address data architecture. **Wrong:** they are different *types* of framework. In TOGAF, Data Architecture is folded into Phase C (Information Systems Architecture) alongside Application Architecture within a *process* (source: m3-togaf); in NIST, Data Architecture is its own distinct *layer*, separate from Information Systems Architecture (source: m3-nist). Same term, different role and granularity — they are not "basically the same."

14. Sample strong answer: adopt a **lightweight Zachman coverage check** (or a trimmed ADM), not the full ADM. Justification: the full TOGAF ADM is a heavyweight nine-phase *process* designed for large-scale enterprise architecture and governance (source: m3-togaf), which a two-week, no-EA-team effort cannot sustain. A Zachman matrix is a *taxonomy* that quickly verifies the small system's artifacts cover the key questions/viewpoints without imposing a process (source: m3-zachman). NIST layering could organize documentation but adds little for a tiny system. (Graded on: correctly invoking the *type* of each framework, not just naming a preference.)

15. Edges: `Preliminary→A→B→C→D→E→F→G→H`, and **H→A** (feedback closing the cycle, continuous evolution). **Requirements Management** connects (bidirectionally / as a hub) to *every* node — Preliminary and A through H — because it traces requirements across all phases (source: m3-togaf). Compare to the Mermaid diagram in [fundamentals.md](fundamentals.md).
