# Verification & Validation Methods — Exercises

## Warm-up (Tier 1 — recall from memory)

W1. From memory, state the question verification answers and the question validation answers.
W2. From memory, name the three types of inspection and the four types of review.
W3. From memory, list the four testing levels in order from smallest to largest scope.
W4. From memory, expand UAT, OAT, FAT, SAT and say who/where each is performed.
W5. From memory, list the four validation best practices.

## Core exercises (Tier 2 — apply at Bloom: Apply)

**C1 — The V/V + method table.** For each activity, decide **verification or validation**, name the **single best method**, and give a one-line reason (source: m4-vv).

| # | Activity | V/V? | Method | Reason |
| :-- | :-- | :-- | :-- | :-- |
| 1 | Crash-testing a car against safety requirements | ? | ? | ? |
| 2 | Hospital staff trialing the patient system before go-live | ? | ? | ? |
| 3 | Reading source code for bugs without running it | ? | ? | ? |
| 4 | Installing the traffic system in one district first | ? | ? | ? |
| 5 | NASA modeling rover navigation before launch | ? | ? | ? |
| 6 | Experts evaluating the design's interfaces before build | ? | ? | ? |

**C2 — Guidance-fading pair (acceptance types).**

- *C2a (scaffolded):* A vendor builds equipment at its plant and the customer installs it on-site. Which acceptance test happens at the manufacturer's site before delivery (___), and which at the customer's location after installation (___)?
- *C2b (faded):* A bank's compliance team must confirm a new system meets financial regulations before launch; separately the ops team checks its performance, security, and maintainability in the live environment. Name both acceptance-testing types — no scaffolding.

**C3 — Choose and sequence.** For a new e-voting machine, list the V&V methods you would apply **in order**, and mark where verification ends and validation begins. (At least one inspection/review, the testing levels, and at least one validation method.)

**C4 — Feynman ("explain it back").** In ≤120 words, explain the difference between verification and validation to a teammate, using one concrete before/after example each. *Self-check rubric:* (a) both questions stated correctly; (b) verification-before-validation noted; (c) one verification example + one validation example, each with a named method; (d) no method mislabeled. Score 4/4 to pass.

## Challenge exercises (Tier 3 — analyze / evaluate)

**X1 — Interleaved set (decide which concept applies first).** For each item, first decide whether the task is *verifying a built system / validating it* (this topic), *verifying a requirement statement is SMART* ([06-verifying-requirements](../06-verifying-requirements/README.md)), or *choosing an integration strategy* ([15-integration-strategies](../15-integration-strategies/README.md)) — then name the specific method:

- (a) "Confirm hospital staff find the patient system fits their workflow before go-live."
- (b) "Check that 'the system should be fast' is testable and rewrite it."
- (c) "Decide whether to integrate top-down or bottom-up for the subsystems."
- (d) "Crash-test the car against the documented safety requirement."
- (e) "Run a one-district pilot of the traffic system before citywide rollout."

**X2 — Critique a V&V plan.** A team writes: "We'll run UAT first with real users, then once that passes we'll do unit and integration testing, then ship." Diagnose what's wrong with the ordering and the role of UAT, and give the corrected sequence.

**X3 — Build the map yourself.** Given these nodes — *Specified requirements*, *Inspection*, *Reviews*, *Unit/Integration/System testing*, *Verification*, *Validation*, *Acceptance testing (UAT/OAT/FAT/SAT)*, *Pilot testing*, *Simulation*, *Validated system* — draw the directed edges showing the V&V flow, putting verification before validation. (Compare against the diagram in [fundamentals.md](fundamentals.md).)

---

## Solutions & explanations

**W1.** Verification: *"Did we build the system right?"* (meets specified requirements). Validation: *"Did we build the right system?"* (meets user needs/intended use in a real-world environment) (source: m4-vv).

**W2.** Inspections: visual, document, code. Reviews: requirements, design, code, test case (source: m4-vv).

**W3.** Unit → integration → system → acceptance (source: m4-vv).

**W4.** UAT = User Acceptance Testing, by end-users (business needs); OAT = Operational Acceptance Testing (performance/security/maintainability in the final environment); FAT = Factory Acceptance Testing, manufacturer's site before delivery; SAT = Site Acceptance Testing, customer's location after installation (source: m4-vv).

**W5.** Engage users early; test in real environments; use iterative validation; document validation criteria (source: m4-vv).

**C1 (answer key, from m4-vv):**

| # | V/V? | Method | Reason |
| :-- | :-- | :-- | :-- |
| 1 | Verification | Testing against requirements | Executes the system vs defined safety requirements |
| 2 | Validation | UAT (acceptance testing) | End-users confirm it meets business needs |
| 3 | Verification | Code inspection | Detects defects without execution |
| 4 | Validation | Pilot testing | Limited live deployment with real users before full rollout |
| 5 | Validation | Simulation / prototyping | Models behavior to reduce risk before full deployment |
| 6 | Verification | Design review | Structured expert evaluation before build |

*Common wrong answer:* marking #2 as "system testing" (verification). It involves end-users confirming real-world fit, so it is validation/UAT (source: m4-vv).

**C2a.** Manufacturer's site before delivery = **FAT**; customer's location after installation = **SAT** (source: m4-vv).

**C2b.** Regulations before launch = **Regulatory/Compliance testing**; performance/security/maintainability in the live environment = **OAT** (source: m4-vv).

**C3.** A valid order (verification first): (1) document & code **inspection**; (2) **reviews** (requirements/design/code/test-case); (3) **unit testing**; (4) **integration testing**; (5) **system testing** — verification ends here; then **validation**: (6) **regulatory/compliance testing** (legal requirements for voting), (7) **UAT**/**pilot** with real voters in a limited setting, then full deployment (source: m4-vv). Any order that keeps all verification before validation and includes ≥1 inspection/review, the testing levels, and ≥1 validation method is acceptable.

**C4.** Rubric self-scored; a strong answer states both questions, notes verification precedes validation, and gives e.g. crash-test (verification, testing) vs hospital UAT (validation, acceptance) (source: m4-vv).

**X1.** (a) **validation** — UAT of the built system (this topic) (source: m4-vv). (b) **verifying a requirement statement** — SMART check ([06](../06-verifying-requirements/README.md)). (c) **integration strategy** — top-down vs bottom-up ([15](../15-integration-strategies/README.md)). (d) **verification** — testing against requirements / crash test (this topic) (source: m4-vv). (e) **validation** — pilot testing (this topic) (source: m4-vv).

**X2.** Wrong on two counts: **ordering** — verification (unit, integration testing) must come *before* validation, not after; and **UAT's role** — UAT is a *validation* (acceptance) activity, not a first step. Corrected sequence: inspections/reviews → unit → integration → system testing (verification) → then UAT/pilot (validation) → ship (source: m4-vv).

**X3.** Expected edges: Specified requirements → Verification; Verification → Inspection; Verification → Reviews; Verification → Unit/Integration/System testing; Verification → Validation (verification before validation); Validation → Acceptance testing (UAT/OAT/FAT/SAT); Validation → Pilot testing; Validation → Simulation; Acceptance/Pilot/Simulation → Validated system. Matches [fundamentals.md](fundamentals.md) (source: m4-vv).
