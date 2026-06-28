# System Lifecycle Models — Examples

These examples fade guidance: the first is fully worked, the second blanks the last steps, the third gives only a strategy hint. Every example traces to m1-lifecycle.

## Simple example — Walking a build through Waterfall (fully worked)

**Task:** Sequence the work for a **commercial aircraft** using the Waterfall model.

| Step | Phase | What you do | Reason |
|---|---|---|---|
| 1 | Requirements | Define all aircraft requirements (range, payload, safety) before any design | Linear: nothing downstream proceeds until requirements are documented (source: m1-lifecycle) |
| 2 | Design | Plan the architecture and components from those requirements | Design depends entirely on fixed requirements (source: m1-lifecycle) |
| 3 | Implementation | Manufacture the components/parts | Build only what was designed (source: m1-lifecycle) |
| 4 | Verification | Combine all components and test the full system against requirements | Confirm it works as expected before delivery (source: m1-lifecycle) |
| 5 | Deployment | Deliver the aircraft to the customer | Put it into use (source: m1-lifecycle) |
| 6 | Maintenance | Fix issues, update, adapt post-deployment | Keep it running (source: m1-lifecycle) |

**Why Waterfall here:** aircraft requirements are clear and stable, verification is crucial, and *any design change late in the process is costly* — exactly Waterfall's sweet spot (source: m1-lifecycle).

## Intermediate example — V-Model for a smart door lock (completion problem)

The smart door lock must: unlock via smartphone app, use a keypad as backup, auto-lock after 30 seconds, and alert the owner if tampered (source: m1-lifecycle).

**Left side (design), with the artifact each produces:**

1. **User requirements** → *System Requirement Specification.* (source: m1-lifecycle)
2. **System analysis** → break into Mobile app, Lock hardware, Control unit (microcontroller), Network module → *System Architecture document.* (source: m1-lifecycle)
3. **Software design** → keypad-to-control-unit data flow, auto-lock timing logic, app interface flow → *Detailed component and interface specs.* (source: m1-lifecycle)
4. **Module design** → keypad firmware, Bluetooth handler, auto-lock timer logic, alert-sending logic → *code modules/functions ready for implementation.* (source: m1-lifecycle)
5. **Implementation** (bottom of the V) → write firmware, build app, assemble hardware, integrate sensors → *working prototype.* (source: m1-lifecycle)

**Now pair each design phase with its test phase. Fill the blanks (solutions below):**

- Module design needs **______ (a)** testing.
- Software design needs **______ (b)** testing.
- System analysis/design needs **______ (c)** testing.
- Requirements needs **______ (d)** testing.

## Advanced example — Spiral for a mobile banking app (strategy hint only)

**Strategy hint:** every spiral cycle runs four phases — **Planning → Risk Analysis → Engineering → Evaluation** — and ends with feedback that sets the next cycle's goal (source: m1-lifecycle).

**Your task:** reconstruct **Spiral 1** and **Spiral 2** for the mobile banking app, filling in each of the four phases for both cycles, then state what feedback links Spiral 1 to Spiral 2. (Solutions below.)

## Real-world case study — Mobile fitness tracker via Agile

**Situation:** Build a mobile fitness tracking app where requirements will evolve with user feedback (source: m1-lifecycle).

**Approach — three iterations, each a working increment shaped by feedback (source: m1-lifecycle):**

- **Iteration 1 – Basic Functionality:** *Planning* — focus on user registration and a dashboard of basic activity data. *Development* — sign-up/login plus a simple activity summary. *Testing* — unit testing and a small beta-user group on core functionality. *Review & Retrospective* — gather feedback on signup ease and dashboard clarity, then adjust design.
- **Iteration 2 – Enhanced Activity Tracking:** *Planning* — add step and calorie tracking. *Development* — expand dashboard for step count and caloric burn; integrate device-sensor data. *Testing* — integration tests with hardware sensors plus more user feedback. *Review & Retrospective* — identify data-accuracy and UI usability issues; prioritize improvements.
- **Iteration 3 – Social and Sharing Features:** *Planning* — add social-media achievement sharing. *Development* — social sharing options; improve overall performance. *Testing* — verify integration and test across multiple devices. *Review & Retrospective* — final feedback confirms the app is engaging and functional; make remaining adjustments.

**Outcome:** with each sprint the team delivers a functional increment that evolves from direct user feedback, continuing until the product is polished and ready for full release (source: m1-lifecycle).

**Lesson:** Agile is particularly effective where requirements evolve rapidly; feedback at each sprint review continuously realigns the product with what users actually want (source: m1-lifecycle).

## Guided walkthrough — Spiral 1 narrated start to finish

Building the mobile banking app's first spiral, narrated (source: m1-lifecycle):

1. **Planning.** Start from a basic idea — users want to view account balance and transfer money. Interview stakeholders to define high-level requirements.
2. **Risk Analysis.** Ask the early hard questions: *Can we integrate securely with banking APIs? What if users lose their phones?*
3. **Engineering.** Build a small prototype with dummy data — a simple login and an account-view screen.
4. **Evaluation.** Show the app to users. They like it but ask for two-factor authentication and transaction history.

The feedback is clear, so it becomes the goal of the next cycle — and Spiral 2 begins. This is the heartbeat of the model: each loop produces a more complete version and feedback marks the next goal until the final app is ready (source: m1-lifecycle).

---

## Solutions

**Intermediate (V-Model pairings) (source: m1-lifecycle):**
- (a) **Unit** testing — each component tested individually.
- (b) **Integration** testing — interactions between modules tested.
- (c) **System** testing — the entire system tested as a whole.
- (d) **Acceptance** testing — the system tested against the original requirements. At the end you have a lock tested by real users, confirmed to unlock via phone and keypad, auto-lock after 30 seconds, and alert the owner when tampered.

**Advanced (Spiral 1 & 2) (source: m1-lifecycle):**

*Spiral 1 — Basic prototype:*
- Planning: users want to view balance and transfer money; interview stakeholders for high-level requirements.
- Risk Analysis: Can we integrate securely with banking APIs? What if users lose their phones?
- Engineering: small prototype with dummy data — simple login and account view.
- Evaluation: users like it but ask for two-factor authentication and transaction history.

*Spiral 2 — First functional version:*
- Planning: add real user information, basic transfers and history, and two-factor authentication.
- Risk Analysis: Can we prevent fraud during transfers? What if the server goes down during a transaction?
- Engineering: connect the app to the real banking API; implement login, 2FA, and transfer functionality.
- Evaluation: users test the new version and leave more feedback — "Add notifications and a way to lock the account quickly."

*Link between cycles:* Spiral 1's evaluation feedback (2FA + transaction history) becomes Spiral 2's planning goal; feedback is what marks each new goal until the final app is ready.
