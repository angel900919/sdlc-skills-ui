# Eliciting & Analyzing Requirements — Examples

## Simple example

**Goal: turn a vague stakeholder statement into a clear, measurable requirement.** Source statement for a communication satellite system: *"We need to ensure that users in remote locations can access high-speed internet without interruption."* (source: m2-intro).

1. **Identify the vague terms** — "high-speed" and "without interruption" have no measurable value. *Reason: you cannot test against undefined words.*
2. **Attach a number to throughput** — "shall provide a minimum data throughput of 100 Mbps for users within the service area." *Reason: makes "high-speed" measurable.*
3. **Attach a number to capacity** — "shall support a minimum of 1,000 simultaneous users." *Reason: bounds "for users" so capacity is testable.*
4. **Attach a number to availability** — "shall ensure communication links are maintained for at least 99.9% of the time." *Reason: turns "without interruption" into a verifiable availability target.*
5. **Classify each** — throughput and capacity are *functional* (what it does); 99.9% availability is *non-functional* (how well it performs) (source: m2-elicit).

Result: three testable requirements that replace one vague need (source: m2-intro).

## Intermediate example

**Completion problem — classify and refine. Fill the blanks (solutions at the bottom).**

A satellite stakeholder says *"The satellite should provide good coverage"* and there is a $10M budget cap.

| # | Statement | Refined / classified |
|---|---|---|
| 1 | "should provide good coverage" | "The satellite shall provide continuous coverage for 99% of the time over the service area." → type: **(A) ___** |
| 2 | "process telemetry data fast" | "The satellite system shall process telemetry data at speeds of at least 100 Mbps." → type: **(B) ___** |
| 3 | "stay within budget" | "The system shall not exceed a budget of $10 million." → type: **(C) ___** |

Refinement model and types come from (source: m2-elicit).

## Advanced example

**Mostly blanked — gather and attribute requirements. Strategy hint only.** You are eliciting requirements for the smart home thermostat (Wi-Fi, mobile-app and voice control, learns user behavior). Gather **five** requirements from three stakeholder types (End User / Regulatory Body / Engineer), make each clear and specific, and name the source stakeholder for each (source: m2-ex-elicit).

Fill this table (a complete reference answer is in the Solutions section):

| # | Requirement (your wording) | Stakeholder |
|---|---|---|
| 1 | ___ | End User |
| 2 | ___ | Regulatory Body |
| 3 | ___ | End User |
| 4 | ___ | Engineer |
| 5 | ___ | Engineer |

Strategy hint: users supply most requirements (use interviews/observation); investigate which regulator applies (document review → energy efficiency standard); engineers know technical/operational needs (logging, voltage range) (source: m2-ex-elicit).

## Real-world case study

**Smart home thermostat elicitation** (source: m2-ex-elicit).

- **Situation:** a team is developing a smart home thermostat that optimizes comfort and energy efficiency, connects to Wi-Fi, is controlled via mobile app or voice assistant, and learns user behavior. The task: gather ≥5 requirements across stakeholder types (End users / Regulatory bodies / Engineers).
- **Approach:** interview users (they want control from anywhere → remote app control; they like voice control → assistant integration); document review for the regulator (electrical devices comply with ENERGY STAR); engineers contribute technical needs (logging for ML/optimization; safe voltage range for homes and companies).
- **Outcome:** five clear, attributed requirements (source: m2-ex-elicit):

| Requirement | Stakeholder | Description |
|---|---|---|
| 1. The thermostat shall allow users to remotely adjust the temperature using a mobile app. | End User (Homeowner) | Enhances convenience and control. |
| 2. The device shall comply with ENERGY STAR energy efficiency standards. | Regulatory Body | Ensures compliance with environmental regulations. |
| 3. The thermostat shall support integration with popular voice assistants (e.g., Alexa, Google Assistant). | End User (Homeowner) | Improves accessibility and usability. |
| 4. The system shall log temperature data every 10 minutes for analysis. | Engineer | Required for machine learning and optimization features. |
| 5. The thermostat shall operate safely within a voltage range of 100V–240V. | Engineer | Ensures compatibility with international power standards. |

- **Lesson:** some requirement types are inherently harder to elicit — **non-functional** ones (performance, reliability, security) because users don't know what they want; **implicit** ones (the device should still work without internet) because stakeholders assume them; and **interoperability** ones (voice-assistant control of an AC that isn't compatible) because the assumed integration may not exist (source: m2-ex-elicit).

## Guided walkthrough

**Narrated end to end: from need to prioritized, traceable requirement (satellite).**

1. **Elicit.** A workshop with stakeholders from different fields discusses parameters, data types, and quality of service for the satellite (source: m2-elicit). One stakeholder states: "We need good coverage."
2. **Analyze for clarity.** "Good coverage" is vague, so refine to "The satellite shall provide continuous coverage for 99% of the time over the service area" — now measurable (source: m2-elicit).
3. **Classify.** Availability over time is a *non-functional* requirement (how well it performs) (source: m2-elicit).
4. **Detect a conflict.** Another stakeholder wants 100 Mbps performance; a third wants lower cost. These conflict, so prioritize and balance (source: m2-elicit).
5. **Prioritize.** "Continuous coverage 99% of the time" is rated **High** (must-have); "real-time video monitoring" is **Low** (nice-to-have) (source: m2-elicit).
6. **Trace.** Link the coverage requirement back to the stakeholder need and the system goal it supports, and forward to design, implementation, and testing (source: m2-elicit).

---

## Solutions

**Intermediate example:** (A) **non-functional** — availability over time is a performance quality; (B) **functional** — processing telemetry data is something the system does; (C) **constraint** — the budget cap is a limitation imposed on the design (source: m2-elicit).

**Advanced example — reference answer** (your wording may differ; check stakeholder attribution and that each is clear and measurable) (source: m2-ex-elicit):

| # | Requirement | Stakeholder |
|---|---|---|
| 1 | The thermostat shall allow users to remotely adjust the temperature using a mobile app. | End User (Homeowner) |
| 2 | The device shall comply with ENERGY STAR energy efficiency standards. | Regulatory Body |
| 3 | The thermostat shall support integration with popular voice assistants (Alexa, Google Assistant). | End User (Homeowner) |
| 4 | The system shall log temperature data every 10 minutes for analysis. | Engineer |
| 5 | The thermostat shall operate safely within a voltage range of 100V–240V. | Engineer |
