# Integration Strategies & Managing Interfaces — Examples

Each example makes you **choose and apply** an integration strategy, then justify stubs vs. drivers. All trace to the selection table and definitions in (source: m4-integration).

## Simple example — pick a strategy and place the placeholder

**Scenario:** You are integrating a web service. The top-level **request-router** (control logic) is finished, but the **database layer** beneath it is not yet built. You must start testing now.

Worked solution (every step has a reason):

1. **Identify what exists and what's missing.** Top exists (router/control logic), bottom missing (database). → Reason: strategy follows from which end is ready (source: m4-integration).
2. **Choose top-down integration.** It starts from top-level control logic and proceeds down, and lets you validate the architecture/control flow early — exactly what's ready (source: m4-integration).
3. **Identify the placeholder needed.** The *lower* module is missing, so you need a **stub** — a temporary module that simulates lower-level behaviour (source: m4-integration).
4. **Write the stub** to return canned data in the agreed format so the router can be exercised. → Reason: a mock component allows early testing when the real one isn't ready (source: m4-integration).
5. **Note the trade-off.** The real database layer is tested *later* — accept this, since validating control logic early was the goal (source: m4-integration).

**Answer:** Top-down + a **stub** for the database.

## Intermediate example — completion problem

**Scenario:** A robotics team has finished its low-level **motor drivers and sensor utilities** but the high-level **mission-planning logic** does not exist yet. Reliable infrastructure (the drivers/utilities) is the critical, must-work-first part.

Fill the blanks (worked steps shown, last two blanked):

1. What exists = low-level modules (drivers/utilities); what's missing = high-level logic. (given)
2. Because the *low* level is ready and is critical, the matching strategy starts from low-level modules. (given)
3. **Strategy = `______`.** (blank A)
4. The missing modules are *above*, so the placeholder needed is a **`______`**, which simulates higher-level behaviour. (blank B)

(Answers in Solutions.)

## Advanced example — fresh case, strategy hint only

**Scenario:** A payments platform is built by three teams shipping continuously. Management wants the *easiest fault isolation and lowest integration risk*, and the CI pipeline already runs an automated test harness on every commit.

Strategy hint: match the requirement words ("easiest fault isolation", "lowest risk", "continuous", "test harness") against the selection table, then state the strategy, whether stubs/drivers are needed, and the one challenge to budget for.

(Answer in Solutions.)

## Real-world case study — Boeing 787 Dreamliner

**Situation.** The Boeing 787 Dreamliner faced major integration challenges from its global supply chain and the complexity of integrating advanced avionics, electrical, and mechanical systems. Boeing **outsourced 70% of the aircraft's components** to suppliers across the world; critical systems (avionics, flight control, power distribution) were each designed independently by different companies (source: m4-integration).

**Approach (what went wrong, classified).** Combining the independently built subsystems exposed two distinct failure classes (source: m4-integration):

- **Dependency issues** — some suppliers delivered incomplete or incompatible components, delaying system testing.
- **Interface issues** — mismatched data communication standards across subsystems caused integration failures in avionics.

The biggest integration issue was the **electrical power distribution system**. The 787 replaced traditional hydraulic controls with an **all-electric architecture** to reduce weight. Early integration tests revealed power-system failures causing onboard fires from unexpected electrical surges. Split again into both classes (source: m4-integration):

- **Dependency issue** — the power system relied on software-controlled generators, but incorrect software integration led to unexpected power losses.
- **Interface issue** — the **battery management system (BMS) did not properly communicate** with other systems, causing overheating of lithium-ion batteries.

**Outcome & lessons learned.** Boeing revised its integration strategy: bring **more development in-house** instead of excessive outsourcing; **improve interface documentation using Interface Control Documents (ICDs)** to prevent miscommunications; and conduct **subsystem testing earlier** rather than testing full systems only at the final stage. These lessons made the 787 one of the most technologically advanced aircraft, known for fuel efficiency and passenger comfort (source: m4-integration).

**Lesson for you:** every lesson maps to a best practice in this topic — earlier subsystem testing = integrate/test increments early; ICDs = define interfaces early via ICDs; in-house = reduce uncontrolled cross-supplier dependencies (source: m4-integration).

## Guided walkthrough — choosing and justifying a strategy end to end

A home thermostat system has: a **temperature-sensor driver** (built), a **control algorithm** (built), and a **cloud-sync module** (not built). You need a defensible integration plan.

1. **List components and readiness.** Sensor driver ✓, control algorithm ✓, cloud-sync ✗. → readiness drives the plan (source: m4-integration).
2. **Find the dependencies and order by weight.** The control algorithm depends on sensor *data* (data dependency) and on cloud-sync for remote setpoints. The control algorithm has the most dependencies → integrate it earliest (source: m4-integration).
3. **Choose the strategy.** Two built layers (low sensor + mid control) and one missing upper layer (cloud) point to **bottom-up**, validating the foundational sensor/control path first (source: m4-integration).
4. **Place the placeholder.** Cloud-sync (higher level) is missing → use a **driver** that injects test setpoints as if from the cloud (source: m4-integration).
5. **Manage the interface.** Define the control↔cloud interface early in an ICD, pick a standard data format, and automate a test that feeds setpoints through the driver to catch mismatches early (source: m4-integration).
6. **State the residual risk.** System-level (cloud) behaviour is validated late — the known bottom-up trade-off; schedule a dedicated end-to-end test once cloud-sync lands (source: m4-integration).

---

## Solutions

**Intermediate — blank A:** Bottom-up integration (starts from the lowest-level modules and proceeds upward; the ready, critical layer here) (source: m4-integration). **Blank B:** Driver — it simulates higher-level behaviour to exercise the lower modules that are ready (source: m4-integration). *Common wrong answer:* "stub" — but stubs simulate *lower* behaviour and belong to top-down.

**Advanced:** **Incremental integration.** The table gives incremental "Easy" fault isolation, "Low" risk, and "Any level (by plan)", recommended for continuous integration testing (source: m4-integration). Stubs/drivers = *maybe* (only as needed for whatever increment is missing a neighbour). Challenge to budget for: it requires a well-planned test harness and can be time-consuming without automation — already mitigated here by the CI pipeline (source: m4-integration).
