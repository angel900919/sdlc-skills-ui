# Eliciting & Analyzing Requirements — Exercises

## Warm-up

Produce these from memory (answers below).

1. Define **elicitation** in one sentence.
2. List all five elicitation methods from the material.
3. State the difference between a **functional** and a **non-functional** requirement.
4. List the four prioritization labels and what each means.
5. Name the chain a requirement should be **traceable** through.

## Core exercises

**C1 — Refine a vague need.** A stakeholder says "The satellite should provide good coverage." Rewrite it as a clear, measurable requirement and state its type.

**C2 — Classify.** Label each as functional / non-functional / constraint / domain:
(a) "The satellite system shall process telemetry data at speeds of at least 100 Mbps."
(b) "The system shall be available 99.9% of the time."
(c) "The system shall not exceed a budget of $10 million."
(d) "The home security system shall comply with the UL 1023 standard for intrusion detection alarm units."

**C3 — Method selection (guidance-fading pair).**
(a) *Worked-style:* You need quantifiable input from a large demographic on whether they prioritize delivery speed or app experience for a delivery robot. Which method, and why? (Hint: scalable + quantifiable.)
(b) *Independent:* You suspect a hospital system has unstated needs that nurses won't articulate in an interview. Which method, and name one advantage and one challenge.

**C4 — Resolve a conflict.** One stakeholder wants 100 Mbps performance; another wants lower cost. Describe how you resolve this and the priority you would assign each.

**C5 — Explain it back (Feynman).** In 4–6 sentences, explain to a non-engineer why gathering and analyzing requirements comes before designing anything. *Self-check rubric:* (1) names the "understand the problem first" principle; (2) gives a consequence of skipping it; (3) mentions making vague needs measurable; (4) mentions tracing requirements to a source.

**C6 — Elicit five (apply).** For the smart home thermostat (Wi-Fi, app + voice control, learns behavior), write five clear requirements drawn from End User / Regulatory Body / Engineer, attributing each. (This is the m2-ex-elicit task — do it before checking the solution.)

## Challenge exercises

**X1 — Hard-to-elicit (analyze).** For the smart thermostat, give one example each of a *non-functional*, an *implicit*, and an *interoperability* requirement that would be easy to miss, and say why each is hard to elicit.

**X2 — Interleaved set (decide which concept applies first).** For each item, first decide whether it concerns **this topic** (elicitation / classification / prioritization) or a **sibling topic**, then answer:
(a) "Is 'The system shall be available 99.9% of the time' a functional or non-functional requirement?"
(b) "Should this requirement be SMART and verifiable?"
(c) "How do I track a requirement's versions and link it to test cases in ReqView?"
(d) "Which stakeholder type does an ENERGY STAR compliance requirement come from?"

**X3 — Build the map yourself.** Given these nodes — *Stakeholders, Elicitation, Analyze, Classify, Validate & prioritize, Traceability* — draw the directed edges that form the requirements pipeline and label each edge.

**X4 — Evaluate a prioritization.** A team rates "real-time video monitoring" as **High** for the satellite. Argue whether that is justified and what label the material assigns it.

---

## Solutions & explanations

**Warm-up**

1. **Elicitation** is the process of gathering information from stakeholders to define the system's needs (source: m2-elicit).
2. Interviews; surveys/questionnaires; workshops/focus groups; document review; observation (source: m2-elicit).
3. Functional = what the system must do; non-functional = how well it performs (reliability, scalability, performance, etc.) (source: m2-elicit, master-notes).
4. **High** = must-have to function; **Medium** = important but not critical; **Low** = nice-to-have; **N/A** = not evaluated / document review (source: m2-elicit).
5. Stakeholder need → system goal → design → implementation → testing (source: m2-elicit).

**Core**

- **C1:** "The satellite shall provide continuous coverage for 99% of the time over the service area." Type: non-functional (availability/performance over time) (source: m2-elicit).
- **C2:** (a) functional; (b) non-functional; (c) constraint; (d) domain requirement (UL 1023 ties it to an industry-vertical standard) (source: m2-elicit, master-notes). *Common wrong answer:* calling (d) merely a constraint — the master-notes classify standard-specific items as domain requirements (source: master-notes).
- **C3:** (a) **Surveys/questionnaires** — scalable, cost-effective, and give quantifiable data ideal for prioritizing features across a large group (source: m2-elicit, master-notes). (b) **Observation** (or document analysis) — advantage: reveals actual user behavior, not just stated needs / surfaces overlooked needs; challenge: requires expertise to interpret and is time-consuming (source: master-notes).
- **C4:** Conflicts (high performance vs low cost) are resolved by **prioritizing and finding the right balance** between the competing requirements (source: m2-elicit). Plausible priorities: performance High if it's must-have for the system to function; cost handled as a constraint/balance. The material's point is that you negotiate a balance rather than satisfy both blindly (source: m2-elicit).
- **C5:** Rubric self-graded. Key content: "you can't engineer a solution until you understand the problem" (source: m2-intro); skipping it causes project failures, cost overruns, delays, and systems that miss needs (source: m2-intro); refine vague needs into measurable ones (source: m2-elicit); trace each requirement to its source (source: m2-elicit).
- **C6:** Reference answer (wording may vary; check attribution and clarity) (source: m2-ex-elicit):
  1. The thermostat shall allow users to remotely adjust the temperature using a mobile app. — End User (Homeowner)
  2. The device shall comply with ENERGY STAR energy efficiency standards. — Regulatory Body
  3. The thermostat shall support integration with popular voice assistants (Alexa, Google Assistant). — End User (Homeowner)
  4. The system shall log temperature data every 10 minutes for analysis. — Engineer
  5. The thermostat shall operate safely within a voltage range of 100V–240V. — Engineer

**Challenge**

- **X1:** *Non-functional* — e.g., "respond to a temperature command within N seconds" / reliability; hard because users don't know what performance they want. *Implicit* — "the device shall still operate when there is no internet connectivity"; hard because engineers assume constant connectivity while users assume offline operation. *Interoperability* — "voice command shall turn an AC on/off"; hard because the user assumes integration works even if the AC isn't compatible with the device (source: m2-ex-elicit).
- **X2:** (a) **This topic** — non-functional (source: m2-elicit). (b) **Sibling — [06-verifying-requirements](../06-verifying-requirements/README.md)** — SMART/verifiability live there. (c) **Sibling — [07-requirements-management](../07-requirements-management/README.md)** — version tracking, ReqView, linking to test cases. (d) **This topic** — Regulatory Body (source: m2-ex-elicit).
- **X3:** Stakeholders --elicit via methods--> Elicitation --raw needs--> Analyze --classify each--> Classify --resolve conflicts--> Validate & prioritize --link each--> Traceability (matches the diagram in [fundamentals.md](fundamentals.md)) (source: m2-elicit).
- **X4:** Not justified by the material: the satellite "real-time video monitoring" requirement is given as a **Low** (nice-to-have) example, whereas "continuous coverage 99% of the time" is the **High** must-have (source: m2-elicit).
