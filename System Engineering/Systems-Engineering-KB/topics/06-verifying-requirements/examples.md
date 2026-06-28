# Verifying Requirements — Examples

## Simple example (fully worked): making "high data rates" SMART

**Requirement under review:** *"The satellite system should offer high data rates."* (source: m2-verify)

Step through each SMART letter, with a reason per step:

1. **Specific?** No — "high" is undefined. *Reason:* an unquantified adjective is ambiguous, so two engineers could read it differently (source: m2-verify).
2. **Measurable?** No — there is no number for how much data it will handle. *Reason:* without a quantity you cannot objectively assess it (source: m2-verify).
3. **Achievable?** Unclear — is the (unstated) target within current satellite capability? *Reason:* feasibility can't be judged with no target (source: m2-verify).
4. **Relevant?** Unstated — does it support the system's communication goals? *Reason:* relevance must be explicit, not assumed (source: m2-verify).
5. **Testable?** No — there is no way to verify it through a test. *Reason:* with no measurable condition there is nothing to test against (source: m2-verify).

**Diagnosis:** fails all five → rewrite.

**SMART rewrite:**

> *"The satellite system shall provide a downlink data rate of at least 10 Mbps to ground terminals under standard operating conditions."* (source: m2-verify)

**Why it now passes:** clear (Specific), quantified at ≥10 Mbps (Measurable), within feasible limits (Achievable), supports a key system function (Relevant), and testable through performance testing (Testable) (source: m2-verify).

## Intermediate example (completion problem): write it with the template

Use the standardized template to write a requirement for the satellite's onboard processor throughput.

**Template:** The `[system/subsystem/component]` shall `[perform a function or exhibit a property]` `[with a measurable condition or constraint]` `[under defined conditions or context]` (source: m2-verify).

Filled in so far:

- `[component]` = **the onboard processor**
- `[function]` = **shall process telemetry data**
- `[measurable condition]` = **______ (blank 1)**
- `[under conditions]` = **______ (blank 2)**

Fill blanks 1 and 2, then write the full sentence. *(Solution at bottom.)*

## Advanced example (mostly blanked): verify two robot requirements

For each draft requirement, decide verifiable yes/no, give the reason, and if "no" write a SMART rewrite. Strategy hint only: attack subjective adjectives; add a measured value plus a condition.

| # | Requirement | Verifiable? | Why | Rewrite if needed |
| :-- | :-- | :-- | :-- | :-- |
| A | The robot shall be fast and responsive. | ? | ? | ? |
| B | The battery shall last at least 8 hours under continuous operation. | ? | ? | ? |

*(Solutions at bottom — from m2-ex-verify.)*

## Real-world case study: smart home requirement walkthrough

- **Situation:** A team is finalizing a new requirement set for a smart home system before design begins (source: m2-verify).
- **Approach:** The product owner runs a **walkthrough** — walking through each section of the document with systems engineers, software architects, and testers, encouraging discussion and clarification (source: m2-verify).
- **Outcome:** The testers flag a few requirements that are hard to verify, prompting revisions to those statements (source: m2-verify).
- **Lesson:** A low-cost, informal review by fresh eyes before development catches unverifiable requirements when they are cheap to fix, and builds collective ownership (source: m2-verify, master-notes).

## Guided walkthrough: verify the "intuitive" robot requirement end to end

Take draft requirement 3 from the autonomous-delivery-robot set: *"The system should be intuitive."* (source: m2-ex-verify)

1. **Read it as a tester.** Ask: how would I prove "intuitive" with inspection, test, analysis, or demonstration? You can't pin it down — that's the warning sign (source: m2-ex-verify).
2. **Run SMART.** It fails **Specific** and **Measurable** — "intuitive" is vague and not measurable (source: m2-ex-verify).
3. **Find the testable intent.** What does "intuitive" mean operationally here? That a new user can succeed quickly without training.
4. **Quantify + add condition.** Choose a measurable outcome (task completion time) and a condition (no prior training).
5. **Rewrite to SMART:** *"The system shall allow a user to complete a delivery task within 5 minutes without prior training."* (source: m2-ex-verify)
6. **Re-check:** Specific (named task), Measurable (5 minutes), Achievable (reasonable target), Relevant (usability of a delivery robot), Testable (timed user trial) — passes (source: m2-ex-verify).

---

## Solutions

**Intermediate (template completion):** One valid completion (matching m2-verify): blank 1 = "at a minimum rate of 50 packets per second"; blank 2 = "under nominal operating conditions." Full sentence: *"The onboard processor shall process telemetry data at a minimum rate of 50 packets per second under nominal operating conditions."* (source: m2-verify)

**Advanced (robot verification):**

| # | Verifiable? | Why | Rewrite |
| :-- | :-- | :-- | :-- |
| A | **No** | "Fast" and "responsive" are subjective. | *The robot shall reach a speed of 5 km/h within 3 seconds of receiving a movement command.* |
| B | **Yes** | It is measurable and testable through timed operation. | – (already SMART) |

(source: m2-ex-verify)
