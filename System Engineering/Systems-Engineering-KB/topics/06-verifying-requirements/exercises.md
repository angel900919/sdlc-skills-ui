# Verifying Requirements — Exercises

## Warm-up (Tier 1 — recall from memory)

W1. From memory, list the five SMART letters and what each means for a requirement (m2-verify version).
W2. From memory, name the four methods by which a requirement can be verified.
W3. From memory, write the standardized requirement template (four bracketed slots).
W4. From memory, define "peer review" and "walkthrough" and state how they differ.
W5. From memory, state the difference between verifying a requirement and validating the system.

## Core exercises (Tier 2 — apply at Bloom: Apply)

**C1 — The core verification table (autonomous delivery robot).** You're reviewing draft requirements for a new autonomous delivery robot. For each, decide whether it is **verifiable** (testable by inspection, analysis, demonstration, or testing), give the reason, and rewrite any non-SMART one (source: m2-ex-verify).

| # | Requirement | Verifiable? | Why / Why not | Revised (if needed) |
| :-- | :-- | :-- | :-- | :-- |
| 1 | The robot shall be fast and responsive. | ? | ? | ? |
| 2 | The robot shall detect obstacles within 1 meter and stop within 2 seconds. | ? | ? | ? |
| 3 | The system should be intuitive. | ? | ? | ? |
| 4 | The battery shall last at least 8 hours under continuous operation. | ? | ? | ? |
| 5 | The robot shall have a sleek and modern design. | ? | ? | ? |

**C2 — Guidance-fading pair.** Make each requirement SMART.

- *C2a (scaffolded):* "The satellite system should offer high data rates." Steps are given — fill them: Specific? ___ Measurable? ___ Achievable? ___ Relevant? ___ Testable? ___ → final rewrite ___.
- *C2b (faded):* "The system should have a fast response time" (smart home security). No steps given — produce the SMART rewrite and name the operating condition you added.

**C3 — Template application.** Rewrite this loose requirement using the `[system] shall [function] [measurable condition] [under conditions]` template: "The processor needs to handle telemetry quickly."

**C4 — Feynman ("explain it back").** In ≤120 words, explain SMART to a teammate who has never heard of it, using one concrete before/after example. *Self-check rubric:* (a) all five letters named and defined; (b) you state SMART's purpose is verifiability; (c) the example shows a measurable value + a condition; (d) no jargon left unexplained. Score 4/4 to pass.

## Challenge exercises (Tier 3 — analyze / evaluate)

**X1 — Interleaved set (decide which concept applies first).** For each item, first decide whether the task is *verifying a requirement statement* (this topic) or *validating the built system* ([16-verification-validation-methods](../16-verification-validation-methods/README.md)) or *eliciting/classifying* ([05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/README.md)) — then act:

- (a) "Run SMART on 'the app should be secure' and rewrite it."
- (b) "Run the finished robot through a field test to confirm it satisfies stakeholders' delivery needs."
- (c) "Interview the warehouse manager to discover what 'on time' means to them."
- (d) "Hold a walkthrough of the requirements document with testers before design."

**X2 — Critique a SMART rewrite.** A teammate rewrites "The robot shall be fast" as "The robot shall move quickly at all times." Is this now SMART? Diagnose which letters still fail and fix it.

**X3 — Build the map yourself.** Given these nodes — *Drafted requirements*, *SMART check*, *Rewrite*, *Standardized template*, *Peer review/walkthrough*, *Verifiable requirement*, *System validation (topic 16)* — draw the directed edges showing how a draft becomes a verifiable requirement, including the loop a failing requirement takes. (Compare against the diagram in [fundamentals.md](fundamentals.md).)

---

## Solutions & explanations

**W1.** Specific (clear, unambiguous), Measurable (quantify/assess objectively), Achievable (technically/practically feasible), Relevant (aligns with goals & stakeholder needs), Testable (verifiable via inspection, test, analysis, or demonstration) (source: m2-verify).

**W2.** Inspection, test, analysis, demonstration (source: m2-verify, m2-ex-verify).

**W3.** The `[system/subsystem/component]` shall `[perform a function or exhibit a property]` `[with a measurable condition or constraint]` `[under defined conditions or context]` (source: m2-verify).

**W4.** Peer review = structured review by peers (engineers, analysts, designers) for clarity, completeness, consistency, verifiability; walkthrough = more informal, author-led, encouraging discussion and collective ownership (source: m2-verify).

**W5.** Verifying a requirement checks the written statement is well-formed ("did we build the requirement right?"); validating the system checks the finished product meets real needs ("did we build the right system?") — covered in topic 16 (source: m2-verify; cross-ref [16-verification-validation-methods](../16-verification-validation-methods/README.md)).

**C1 (full answer key, from m2-ex-verify):**

| # | Verifiable? | Why / Why not | Revised |
| :-- | :-- | :-- | :-- |
| 1 | **No** | "Fast" and "responsive" are subjective. | The robot shall reach a speed of 5 km/h within 3 seconds of receiving a movement command. |
| 2 | **Yes** | Measurable and testable. | – |
| 3 | **No** | "Intuitive" is vague and not measurable. | The system shall allow a user to complete a delivery task within 5 minutes without prior training. |
| 4 | **Yes** | Measurable and testable through timed operation. | – |
| 5 | **No** | Aesthetic terms are subjective. | The robot's exterior shall use materials and colors consistent with the brand's 2025 design guidelines. |

*Common wrong answer:* marking #5 "Yes" because it's a clear sentence — clarity ≠ verifiability; "sleek/modern" cannot be tested (source: m2-ex-verify).

**C2a.** Fails Specific ("high" undefined), Measurable (no quantity), Achievable (no target to judge), Relevant (unstated), Testable (nothing to test) → *"The satellite system shall provide a downlink data rate of at least 10 Mbps to ground terminals under standard operating conditions."* (source: m2-verify)

**C2b.** *"The security system shall trigger an alarm within two seconds of detecting unauthorized motion."* Added condition: the triggering event (detecting unauthorized motion) and the 2-second deadline make it time-bound and testable (source: master-notes).

**C3.** E.g., *"The onboard processor shall process telemetry data at a minimum rate of 50 packets per second under nominal operating conditions."* Each template slot is filled: component, function, measurable condition, operating context (source: m2-verify).

**C4.** Rubric self-scored; a strong answer names all five letters, states the purpose is to make requirements verifiable, and shows a before ("high data rates") → after ("≥10 Mbps under standard operating conditions") pair (source: m2-verify).

**X1.** (a) verifying a requirement — run SMART, rewrite to e.g. a named security control with a testable criterion (this topic). (b) validating the system — field test of the finished product ([16](../16-verification-validation-methods/README.md)). (c) eliciting — discovering stakeholder meaning ([05](../05-requirements-elicitation-analysis/README.md)). (d) verifying requirements — walkthrough is a requirement-verification technique done before design (source: m2-verify).

**X2.** Still **not SMART**: "quickly" and "at all times" remain non-Specific and non-Measurable, so not Testable. Fix with a measured value + condition, e.g. *"The robot shall reach 5 km/h within 3 seconds of receiving a movement command."* (source: m2-ex-verify)

**X3.** Expected edges: Drafted requirements → SMART check; SMART check —fails→ Rewrite → (back to) SMART check; SMART check —passes→ Verifiable requirement; Standardized template → Verifiable requirement; Peer review/walkthrough → Verifiable requirement (catches issues); Verifiable requirement → System validation (topic 16). Matches [fundamentals.md](fundamentals.md) (source: m2-verify, master-notes).
