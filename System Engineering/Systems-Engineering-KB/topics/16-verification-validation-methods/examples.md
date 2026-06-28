# Verification & Validation Methods — Examples

## Simple example (fully worked): classify each activity as verification or validation

**Task:** for each activity from the source, decide verification ("built it right?") or validation ("built the right system?") and name the method.

| # | Activity | V or V? | Method | Reason |
| :-- | :-- | :-- | :-- | :-- |
| 1 | Crash-testing a new car against safety requirements | **Verification** | Testing against requirements | Executes the system to confirm it meets defined safety requirements (source: m4-vv) |
| 2 | Hospital staff trial the new patient-management system before go-live | **Validation** | UAT (acceptance testing) | End-users confirm it meets business needs / real workflows (source: m4-vv) |
| 3 | Installing the traffic-monitoring system in one district before citywide | **Validation** | Pilot testing | Limited live deployment with real users before full rollout (source: m4-vv) |
| 4 | NASA running rover-navigation models before launch | **Validation** | Simulation / prototyping | Models system behavior to reduce risk before full deployment (source: m4-vv) |
| 5 | Manually reading source code for bugs without running it | **Verification** | Code inspection | Detects defects without execution (source: m4-vv) |

**Why each step:** the discriminating question is always *which question does it answer?* If it confirms compliance with a spec, it's verification; if it confirms fitness for real users/use, it's validation (source: m4-vv).

## Intermediate example (completion problem): match the acceptance-testing type

A control-system vendor builds a system at its plant, ships it, and installs it at the customer's factory. Fill the two blanks.

| Stage | When/where | Acceptance type |
| :-- | :-- | :-- |
| Vendor tests the assembled system before shipping | Manufacturer's site, before delivery | **______ (blank 1)** |
| Customer tests it after it's installed on their floor | Customer's location, after installation | **______ (blank 2)** |
| Customer's operations team checks performance, security, maintainability in the live environment | Final environment | OAT |
| End-users confirm it supports their business workflows | Final environment | UAT |

*(Solution at bottom — from m4-vv.)*

## Advanced example (mostly blanked): pick the V&V method for each scenario

For each scenario, name the single best V&V method and say whether it is verification or validation. Strategy hint only: first ask "compliance with spec, or fitness for real use?"; for validation, ask "before any deployment (simulation), limited live (pilot), or stakeholder sign-off (acceptance type)?"

| # | Scenario | Method | V/V? |
| :-- | :-- | :-- | :-- |
| A | Reviewing the design document's architecture and interfaces with experts before build | ? | ? |
| B | Running each individual software module to confirm it works in isolation | ? | ? |
| C | Confirming the medical device meets the regulator's legal/industry requirements | ? | ? |
| D | Deploying a payments feature to 5% of users in one region before global launch | ? | ? |
| E | Confirming integrated subsystems exchange data correctly | ? | ? |

*(Solutions at bottom — from m4-vv.)*

## Real-world case study: healthcare patient-management system (UAT)

- **Situation:** A hospital is about to deploy a new patient-management system (source: m4-vv).
- **Approach:** Before deployment, the hospital conducts **User Acceptance Testing (UAT)** — end-users (clinical staff) exercise the system against their real-world workflows to confirm it meets business needs (source: m4-vv).
- **Outcome:** The system is confirmed to support real-world workflows before it goes live (source: m4-vv).
- **Lesson:** A verified system (passes its requirement tests) can still fail in practice; **validation** with the actual end-users is what confirms it is the *right* system for them — engaging users early and testing in a realistic context (source: m4-vv).

## Guided walkthrough: ordering V&V for a traffic-monitoring system

Narrate the full V&V flow the source implies for the traffic-monitoring example, in correct order (verification before validation) (source: m4-vv):

1. **Inspect & review (verification, no execution).** Inspect the design documents and code, and run requirements/design/code/test-case reviews to catch defects and confirm compliance before full build (source: m4-vv).
2. **Unit testing (verification).** Test each module — sensor reader, data aggregator — in isolation (source: m4-vv).
3. **Integration testing (verification).** Confirm the subsystems exchange data correctly once combined (source: m4-vv).
4. **System testing (verification).** Evaluate the full system against its requirements (source: m4-vv).
5. **Acceptance / pilot (validation).** Install in **one city district** as a pilot, with real users, to surface usability issues, performance gaps, or unexpected failures before citywide rollout (source: m4-vv).
6. **Full deployment.** Expand citywide once the pilot confirms proper functionality (source: m4-vv).

The key move: every step from 1–4 answers "did we build it right?"; only step 5 answers "did we build the right system?" — and it comes last (source: m4-vv).

---

## Solutions

**Intermediate (acceptance-type completion):** blank 1 = **FAT (Factory Acceptance Testing)** — performed at the manufacturer's site before delivery; blank 2 = **SAT (Site Acceptance Testing)** — conducted at the customer's location after installation (source: m4-vv).

**Advanced (method picker):**

| # | Method | V/V? | Why |
| :-- | :-- | :-- | :-- |
| A | Design review | Verification | Structured expert evaluation of design/architecture/interfaces before build (source: m4-vv) |
| B | Unit testing | Verification | Verifying individual modules/components (source: m4-vv) |
| C | Regulatory / Compliance testing | Validation (acceptance) | Ensures the system meets industry regulations and legal requirements (source: m4-vv) |
| D | Pilot testing | Validation | Limited deployment with real users before full-scale rollout (source: m4-vv) |
| E | Integration testing | Verification | Ensuring subsystems work together correctly (source: m4-vv) |

*Common wrong answer for C:* calling it "system testing." Regulatory/compliance testing is an acceptance-validation activity (does it meet legal/industry needs?), not a verification level (source: m4-vv).
