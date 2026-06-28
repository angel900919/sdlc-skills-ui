# Common SE Tools & Techniques — Examples

All examples trace to the communications-satellite antenna case and the wearable-fitness-tracker stage mapping in the sources.

## Simple example — trade-off analysis (fully worked)

**Task:** A company designing a communications satellite must choose between a **high-gain directional antenna** and an **omnidirectional antenna** (source: m1-tools).

| Step | Action | Reason |
| :--- | :--- | :--- |
| 1 | List the alternatives. | You can only trade off options you have named: high-gain directional vs. omnidirectional (source: m1-tools). |
| 2 | List the criteria: cost, performance, complexity, power consumption, risk. | Trade-off analysis balances cost, performance, and risk — name every factor that matters (source: m1-tools). |
| 3 | Score each option. High-gain: stronger, focused signal, faster data, but needs precise orientation control and costs more. Omnidirectional: cheaper, easier to operate, but lower signal strength and slower data (source: m1-tools). | Make the strengths and weaknesses explicit so the comparison is honest. |
| 4 | Check against project constraints. High-gain meets the performance goal but its cost and control complexity **exceed** the project's constraints (source: m1-tools). | The best technical option loses if it violates a constraint. |
| 5 | Decide. Select the **omnidirectional** antenna — sufficient capability for the mission, lower cost, reduced operational risk (source: m1-tools). | Trade-off optimises the *balance* (cost-effectiveness while meeting mission requirements), not raw performance. |

**Result:** omnidirectional antenna selected (source: m1-tools).

## Intermediate example — risk management (completion problem)

Same satellite. The team initially considers the **high-gain directional antenna** for its superior data transmission. Risk analysis surfaces concerns:

1. It requires precise attitude control → risk of misalignment in orbit (source: m1-tools).
2. Its mechanical complexity → higher likelihood of deployment failure (source: m1-tools).
3. If the satellite can't point accurately → communication could be completely lost (source: m1-tools).

The team evaluates mitigations: adding backup orientation sensors, running more thorough simulations, or including a secondary low-gain antenna (source: m1-tools).

**Your turn — complete the last two steps:**
- Step A: After applying those mitigations, what does the team conclude about the overall risk profile? `____`
- Step B: What decision follows? `____`

(Solutions at the bottom.)

## Advanced example — V&V and interface management (mostly blanked)

The team selects the **high-gain directional antenna** and must prove it works, then integrate it. Using only the strategy hints, write the answers, then check below.

- **Verification (hint: "build the thing right" — against specs):** name two verification activities the team performs. `____`
- **Validation (hint: "build the right thing" — against the operational need):** what does the team check, and what real-world failure would mean it fails validation even after passing lab specs? `____`
- **Interface management (hint: subsystems that must connect):** which three subsystems must the antenna coordinate with, and which artefact manages those interfaces? `____`

(Solutions at the bottom.)

## Real-world case study — the satellite antenna decision

- **Situation:** A communications satellite needs an antenna; two candidates differ sharply on performance, cost, complexity, and risk (source: m1-tools).
- **Approach:** Apply all four techniques in sequence — trade-off analysis (compare cost/performance/complexity/power/risk), risk management (FMEA/FTA-style assessment of misalignment and deployment failure), V&V (lab tests + simulations + end-to-end test mission), and interface management (ICDs across attitude control, power supply, communication module) (source: m1-tools).
- **Outcome:** Despite the high-gain antenna's superior performance, both the trade-off (cost/complexity exceed constraints) and the risk analysis (residual risk stays high) point to the **omnidirectional** antenna; it simplifies the system, lowers mechanical-failure risk, and makes basic communication more reliable (source: m1-tools).
- **Lesson:** A technically superior component can be the wrong engineering choice once constraints and risk tolerance are weighed; techniques exist to make that judgement explicit and defensible (source: m1-tools).

## Guided walkthrough — mapping tools/techniques to lifecycle stages (wearable fitness tracker)

Narrated start to finish, this is the source's stage→tool mapping (source: m1-exercise):

1. **Concept** → use **Stakeholder Needs Analysis** to gather user expectations for comfort and features such as heart rate and steps. *Why:* the concept stage is about capturing what users want before any design exists.
2. **Development** → use **SysML Modeling** to model the system structure: sensors, display, battery, communication modules. *Why:* MBSE models the structure so the design is consistent before build.
3. **Production** → use an **Interface Control Document (ICD)** to define how hardware components and software interact during manufacturing. *Why:* interfaces must be unambiguous when many parts are assembled.
4. **Operations & Maintenance** → use a **Risk Management Matrix** to monitor risks like battery failure or sensor inaccuracy in real-world use. *Why:* risks shift once the device is in the field.
5. **Disposal** → use **Configuration Management** so retired devices are handled properly and software/firmware is archived. *Why:* end-of-life still needs traceable control of versions.

(source: m1-exercise)

---

## Solutions

**Intermediate example (risk management):**
- Step A: Despite the mitigation options, the **overall risk profile remains high** (source: m1-tools).
- Step B: The team **chooses a lower-risk alternative — the omnidirectional antenna**; it reduces performance but simplifies the system, lowers mechanical-failure risk, and makes basic communication more reliable, aligning better with the project's risk tolerance (source: m1-tools).

**Advanced example (V&V and interface management):**
- **Verification:** lab-test the antenna to confirm it meets design specs (signal strength, power consumption, mechanical deployment accuracy); run simulations to confirm the attitude-control system can consistently point the antenna toward Earth under various orbital conditions (source: m1-tools).
- **Validation:** check whether the antenna actually meets the stakeholder's operational need — fast, reliable data transmission from orbit — e.g. end-to-end testing with a prototype or a test mission with ground stations. If it **can't maintain a stable link due to pointing issues even though it met lab specs**, it fails validation (source: m1-tools).
- **Interface management:** the antenna must coordinate with the **attitude control system, power supply, and communication module**; **interface control documents (ICDs)** manage the mechanical mounts, electrical connectors, data buses, and control signals so the interfaces are compatible and clearly defined (source: m1-tools).
