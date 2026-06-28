# Systems Engineering & Core Principles — Projects

This is an **Understand**-level topic, so the projects are short applied-analysis tasks: you practise *seeing a system the way a systems engineer does*, not building one. (Hands-on builds appear later, e.g. modeling in [08-sysml-modeling](../08-sysml-modeling/projects.md).)

## Guided project — analyze a complex system you know

**Goal.** Take a complex system you genuinely know (e.g. a car, smartphone, home network, public-transit line) and analyze it with systems thinking and a holistic view (source: m1-core).

**Milestones & "done" criteria:**

1. **Pick & frame the system.** Write one sentence naming the system and its common goal. *Done when:* the goal is stated as something the whole system achieves, not one component's job (source: m1-core).
2. **List interconnected components.** Identify 4–6 components and group them as hardware / software / people-and-processes. *Done when:* every group has at least one entry and the list is the parts that must *work together* (source: m1-intro).
3. **Map one interaction (systems thinking).** Pick two components and describe how a change in one affects the other or the whole. *Done when:* you state a concrete ripple effect (source: m1-core).
4. **Name one external factor (resilience).** State an external factor (power loss, network outage, weather, cyberattack) and how it stresses the system. *Done when:* the factor is outside the system but affects its operation (source: m1-core).
5. **Identify one cross-component trade-off (holistic view).** Name two competing concerns (e.g. performance vs cost, convenience vs sustainability) that span more than one component, and state which you'd favour and why. *Done when:* the trade-off cannot be resolved by looking at a single component alone (source: m1-core).
6. **State the integrator's job.** In one sentence, say what a systems engineer would coordinate across the disciplines behind your system. *Done when:* it names ≥2 disciplines aligning to the common goal (source: m1-core).

**Deliverable:** a half-page write-up covering milestones 1–6.

## Independent (challenge) project — the with/without-SE briefing

**Goal.** Produce a one-page briefing that convinces a non-technical stakeholder to fund systems engineering for a new project of your choice (smart grid, autonomous delivery robot, hospital system, etc.).

**Constraints only:**
- Use the **with vs without SE contrast** structure from the traffic-light scenario (source: m1-intro).
- Cover at least **three** of the six lifecycle phases and show how skipping SE hurts each (source: m1-intro).
- Include at least **one historical precedent** (WWI/Manhattan Project/Apollo) to show the discipline's track record (source: m1-core).
- End with the integrator role and one concrete trade-off the engineer would manage (source: m1-core).

This is cumulative: it forces you to weave definition, history, principles, and role into one argument.

## Build notes & solution sketch

- **Architecture of a good analysis:** principles first (systems thinking → interactions; holistic view → trade-offs; lifecycle thinking → over time), then the integrator role on top — the same spine as the diagram in [fundamentals.md](fundamentals.md).
- **Key decision — granularity.** Choose components coarse enough that interactions are visible (e.g. "navigation system" not "one GPS chip"). The autonomous-vehicle breakdown in [examples.md](examples.md) (hardware = sensors/actuators, software = navigation/control, plus integration) is a good calibration (source: m1-core).
- **The hard part — the trade-off.** Most learners pick a within-component trade-off. Force it across components: the source's own examples are upfront cost vs long-term savings (green building) and performance vs cost when a material is too expensive (source: m1-core). A valid trade-off makes one component "worse" to make the whole better.
- **For the briefing:** lead with the failure story (it's concrete and memorable), then show SE practices as the fix, then close with credibility (Apollo) and the human role (integrator). Don't list SE generically — tie each practice to a specific avoided failure (source: m1-intro).
