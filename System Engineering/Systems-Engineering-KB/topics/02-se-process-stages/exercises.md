# Stages of the SE Process — Exercises

Attempt every item from memory before opening the solutions.

## Warm-up (Tier 1 — recall)

W1. From memory, list the five stages of the SE process in order.
W2. From memory, state the *goal* of the concept stage and its output.
W3. From memory, define "feasibility study" and name the stage it belongs to.
W4. From memory, name the stage in which factory acceptance testing happens.
W5. From memory, define "graveyard orbit".

## Core exercises (Tier 2 — Understand / classify)

C1. **Classify the activity.** Put each into its stage (Concept / Development / Production / O&M / Disposal):
   (a) drafting a concept of operations; (b) wind-tunnel testing of a prototype; (c) crash-testing prototype vehicles before full-scale production; (d) pushing cybersecurity patches to live IT infrastructure; (e) radiation containment when retiring a nuclear plant.

C2. **Guidance-fading pair.**
   (i) *Worked-style:* for a medical device, name the production-stage activities. (Use the source.)
   (ii) *Faded:* for a consumer-electronics product, name the disposal-stage activity the source describes — with no further hint.

C3. **Stage-to-output.** For each stage, state the deliverable it hands to the next stage (or, for disposal, what it concludes).

C4. **Explain it back (Feynman).** In 4–6 sentences, explain to a non-engineer the difference between the development and production stages, using one concrete example. *Self-check rubric:* (1) development = design + prototypes + validation; (2) production = manufacture the validated design with QC/V&V; (3) you used a source example; (4) you stated *why* the order matters.

## Challenge exercises (Tier 3 — analyze / interleave)

Ch1. **Interleaved set (stages vs models).** For each item, first decide whether it is a *stage* concept (this topic) or a *lifecycle model* concept ([03-lifecycle-models](../03-lifecycle-models/README.md)), then say which one:
   (a) "we manufacture the validated design with quality control"; (b) "we pair each design phase with a corresponding test phase"; (c) "we run short iterations delivering increments"; (d) "we draft a concept of operations"; (e) "we move the satellite to a graveyard orbit".

Ch2. **Build the map yourself.** You are given the five nodes — Concept, Development, Production, O&M, Disposal. Draw the edges (arrows) and *label each edge with the deliverable* that passes from one stage to the next.

Ch3. **Diagnose the plan.** A team says: "We'll skip prototyping, manufacture the first design directly, and decide how to retire the system later if we ever need to." Name two stage-level mistakes and the fix for each.

---

## Solutions & explanations

**W1.** Concept → Development → Production → Operations & maintenance → Disposal (source: m1-stages).

**W2.** Concept stage goal: establish the foundation of the system — identify stakeholder needs, define objectives, run feasibility studies, assess risks/constraints. Output: a well-defined system concept that is the roadmap for later stages (source: m1-stages).

**W3.** Feasibility study: studies in the concept stage determining whether the system can be built and meets the need; it belongs to the **concept stage** (source: m1-stages).

**W4.** Factory acceptance testing happens in the **production stage** (e.g. medical-device manufacturing) (source: m1-stages).

**W5.** Graveyard orbit: a satellite disposal option in which, at end of life, it is moved to an out-of-the-way orbit instead of a controlled re-entry, chosen by mission class and orbit (source: m1-stages).

**C1.** (a) Concept; (b) Development; (c) Production; (d) Operations & maintenance; (e) Disposal (source: m1-stages). *Common slip:* crash-testing sounds like "testing" so people guess development — but the source places prototype-vehicle crash tests in **production**, before full-scale production (source: m1-stages).

**C2.** (i) Manufacture components in compliance with stringent regulatory standards, conduct factory acceptance testing, perform stress tests for reliability (source: m1-stages). (ii) Consumer-electronics firms develop recycling programs to recover valuable materials and reduce environmental waste (source: m1-stages).

**C3.** Concept → system concept / roadmap; Development → validated design; Production → working product (delivered system); O&M → the system at end of useful life; Disposal → responsibly retired system, lessons learned documented (source: m1-stages).

**C4.** Model answer: Development is where you *design* the system — you write detailed specs, build prototypes, run simulations, and validate the design against requirements (e.g. an aerospace team builds blueprints and does wind-tunnel testing). Production is where you *make* the validated design — you manufacture and assemble it with quality control and verification/validation testing (e.g. a car factory assembles vehicles and runs crash tests). The order matters because fixing a flaw on a prototype is far cheaper than fixing it across a production run (source: m1-stages).

**Ch1.** (a) stage — production; (b) model — V-Model; (c) model — Agile/iterative; (d) stage — concept; (e) stage — disposal (source: m1-stages; models in m1-lifecycle / [03-lifecycle-models](../03-lifecycle-models/README.md)). *Point of the drill:* (b) and (c) describe *how* to sequence work (a model), while the rest name *what phase* the system is in (a stage).

**Ch2.** Expected map: `Concept --system concept/roadmap--> Development --validated design--> Production --working product--> O&M --end of useful life--> Disposal` (source: m1-stages). A correct answer labels each arrow with the deliverable, not just draws lines.

**Ch3.** (1) Skipping prototyping removes the development stage's iterative design/validation, so an unvalidated design goes straight to manufacture — fix: build and validate prototypes before production (source: m1-stages). (2) Deferring disposal ignores that retirement needs environmental, regulatory, and cost planning (and a decided end-of-life method for some systems) — fix: plan disposal from the start (source: m1-stages).
