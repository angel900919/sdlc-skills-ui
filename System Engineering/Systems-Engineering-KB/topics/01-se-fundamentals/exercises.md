# Systems Engineering & Core Principles — Exercises

Attempt each from memory before checking the **Solutions & explanations** at the bottom.

## Warm-up (Tier 1 — production recall)

1. From memory, define **systems engineering** in one sentence.
2. List the **lifecycle phases** systems engineering covers (aim for at least five).
3. From memory, state the **core principle** called *systems thinking*.
4. Name the **role** a systems engineer plays across disciplines (one word) and what it means.
5. List **three modern domains** (beyond aerospace/defense) where SE is now applied.

## Core exercises (Tier 2 — apply to scenario, Bloom: Understand)

**C1 — The traffic-light contrast.** A city deploys a smart traffic-light system with separate hardware, software, and networking teams that never coordinate. Explain *two specific failures* that result and *which one SE practice* would have prevented each (source: m1-intro).

**C2 — Classify the concern (guidance-fading pair).**
- *(a, guided)* A smart-home security system must keep working during a power outage or cyberattack. Is this an instance of **systems thinking** (interaction lens) or **holistic view** (whole-system lens)? Give the one-line reason. *Hint: ask whether it's about how parts interact, or about balancing all concerns of the whole.*
- *(b, faded)* A public-transit system is judged on passenger needs, vehicle design, scheduling, ticketing, *and* environmental impact together. Systems thinking or holistic view? Reason in one line. *(No hint.)*

**C3 — Identify what the integrator coordinates.** In spacecraft development, list the three disciplines a systems engineer brings together and the single thing all subsystems must align with (source: m1-core).

**C4 — Explain it back (Feynman).** In 3–4 sentences, explain to a non-engineer *why systems engineering matters*, using the with/without contrast. Self-check rubric: (1) you mention parts must work together; (2) you give at least one concrete failure of the no-SE case; (3) you name at least one SE practice (e.g. defining interfaces, V&V) that fixes it; (4) no jargon left undefined.

## Challenge exercises (Tier 3 — analyze)

**X1 — Interleaved set (decide which concept applies first).** For each item, first decide which of these the item is really about — **systems engineering (definition/scope)**, **systems thinking**, **holistic view**, or **the integrator role** — then justify in one line. (Items deliberately mix the confusable siblings.)
- (i) "Changing the motion sensor might affect alarm timing, so check the whole chain."
- (ii) "Balance passenger convenience against cost and sustainability before deciding."
- (iii) "Coordinate the mechanical, software, and science teams toward the mission goal."
- (iv) "An interdisciplinary approach addressing the system's entire lifecycle."

**X2 — Build the map yourself.** You are given these nodes: `Systems thinking`, `Holistic view`, `Lifecycle thinking`, `Systems engineer (integrator)`, `Hardware / Software / People & processes`, `Successful system`, `Trade-offs`. Draw the directed edges (with labels) showing how they connect. Then compare with the diagram in [fundamentals.md](fundamentals.md).

**X3 — History to principle.** Apollo "demanded the integration of spacecraft, mission control, and ground support systems" (source: m1-core). Which *core principle* and which *role* does that statement most directly illustrate? Justify.

---

## Solutions & explanations

**Warm-up 1.** Systems engineering is an interdisciplinary approach to designing, integrating, and managing complex systems across their lifecycle so the parts (hardware, software, people, processes) work together to meet requirements and deliver value (source: m1-intro / m1-core).

**Warm-up 2.** Requirements analysis; system design and architecture; implementation and integration; verification and validation; operation and maintenance; retirement/decommissioning (source: m1-intro).

**Warm-up 3.** Systems thinking = understanding a system as a collection of interconnected components that work together toward a common goal, considering how components interact, how a change in one affects the whole, and how external factors influence the system (source: m1-core).

**Warm-up 4.** **Integrator** — bringing together expertise from multiple disciplines and bridging engineering, management, and stakeholders to align everything with the overall objectives (source: m1-core).

**Warm-up 5.** Any three: healthcare, transportation, artificial intelligence, cybersecurity, sustainability (source: m1-core).

**C1.** Any two of: emergency-vehicle priority fails; intersections don't synchronize; maintenance teams can't troubleshoot (source: m1-intro). Preventions (match one to each): explicitly **defining interfaces and integration points** (prevents the sync/priority failures); **verification and validation before deployment** (catches the override failure); **planning maintenance from the start** (prevents the troubleshooting gap) (source: m1-intro). Common wrong answer: blaming "bad code" — the source's point is lack of *coordination/integration*, not faulty individual parts.

**C2(a).** **Systems thinking** — resilience to outages/cyberattacks is about how the interconnected components (sensors, cameras, alarms, control unit) keep working under external factors (source: m1-core).
**C2(b).** **Holistic view** — judging the complete system on many concerns at once (needs, design, scheduling, ticketing, environment) so trade-offs are balanced (source: m1-core).

**C3.** Mechanical engineers (structure, astronaut suits), software engineers (control algorithms), and scientists (mission objectives); all subsystems must align with the **mission's goals** (source: m1-core).

**C4.** Model answer: "Big systems are built by many teams. If each only minds its own part, the parts won't fit — like smart traffic lights where emergency overrides fail because nobody aligned the interfaces. Systems engineering makes the teams gather needs, define how parts connect, and test the whole against requirements before launch, so the finished system actually works and can be maintained." (source: m1-intro)

**X1.** (i) **Systems thinking** — ripple effect across interconnected parts. (ii) **Holistic view** — balancing all concerns of the whole. (iii) **Integrator role** — coordinating disciplines toward the goal. (iv) **Systems engineering definition/scope** — the formal definition (source: m1-core / m1-intro). The interleaving point: (i) and (ii) are the most-confused pair — distinguish *interaction lens* (i) from *whole-system balancing* (ii).

**X2.** Expected edges (labels may vary): `Systems thinking` --informs--> `Systems engineer`; `Holistic view` --guides--> `Systems engineer`; `Lifecycle thinking` --spans--> `Systems engineer`; `Systems engineer` --integrates--> `Hardware / Software / People & processes`; those --combine into--> `Successful system`; `Systems engineer` --manages--> `Trade-offs` --shape--> `Successful system`. Matches [fundamentals.md](fundamentals.md) (source: m1-core, m1-intro).

**X3.** **Interdisciplinary integration** (and lifecycle/systems thinking underneath it), via the **integrator role** — Apollo required combining separately built systems into one mission, the defining act of the systems engineer as integrator (source: m1-core).
