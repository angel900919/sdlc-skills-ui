# Requirements Management, Traceability & Change Management — Examples

## Simple example — build a one-row traceability matrix (fully worked)

**Goal:** trace one requirement to its design, code, and test artifacts, then add the backward link.

Requirement from the course (source: m2-reqtools):
> "The system shall control smart locks based on user authentication."

Steps, each with its reason:

1. **Give the requirement an ID.** Call it `REQ-1`. *Reason:* links and impact analysis need a stable identifier; consistent naming/numbering is a best practice (source: master-notes §2).
2. **Find the design artifact.** The course links it to the *System architecture diagram* (source: m2-reqtools). *Reason:* forward traceability starts requirement → design.
3. **Find the code artifact.** The *Code block controlling API requests* (source: m2-reqtools). *Reason:* forward traceability continues design → code.
4. **Find the test artifact.** The test case *"Confirm smart lock API device connection"* (source: m2-reqtools). *Reason:* forward traceability ends code → test, proving the requirement is verified.
5. **Record the backward link.** Note that the test traces back to `REQ-1`. *Reason:* recording both directions makes the link bidirectional — needed for safety-critical/compliance work (source: m2-reqtools).

Resulting matrix:

| Req ID | Requirement | Design | Code | Test case |
| :--- | :--- | :--- | :--- | :--- |
| REQ-1 | The system shall control smart locks based on user authentication. | System architecture diagram | Code block controlling API requests | Confirm smart lock API device connection |

Reading it forward (left→right) proves coverage; reading the test column back to REQ-1 is the backward check (source: m2-reqtools).

## Intermediate example — completion problem (last steps blanked)

A second smart-home requirement (source: master-notes §2):
> "The system shall detect unauthorized movement within a five-meter range and trigger an alarm within two seconds."

Partly built matrix — fill the two blanks (answers in Solutions):

| Req ID | Requirement | Design / spec link | Test case |
| :--- | :--- | :--- | :--- |
| REQ-2 | Detect movement in 5 m and alarm within 2 s | Motion-sensor specification; alarm-activation logic | __(A)__ |

- **(A)** Write the test case this requirement should trace to.
- **(B)** A teammate proposes *replacing the motion sensor*. Using the matrix, which row/artifacts does that change flag for update, and which traceability direction made that visible?

## Advanced example — walk a change request through the five phases (strategy hint only)

A stakeholder requests: *"Tighten REQ-2's alarm time from 2 seconds to 1 second."*

Map this onto the five-phase change management process (source: m2-reqtools). For each phase write one line — who acts and what they produce. Strategy hint: phases are Request → Analyze impact → Review/Approve → Implement → Communicate/Track, and the approval body is the CCB. Full answer in Solutions.

## Real-world case study — smart-home traceability (from the source)

**Situation.** A smart-home system has the requirement "The system shall control smart locks based on user authentication" (source: m2-reqtools).

**Approach.** The team uses traceability to link the requirement to a design (system architecture diagram), to code (the block controlling API requests), and to a test case ("Confirm smart lock API device connection") (source: m2-reqtools). The same pattern is applied to the motion-detection requirement, linking it to the motion-sensor spec and alarm-activation logic, with a test verifying the alarm fires within the required time (source: master-notes §2).

**Outcome.** All parts are aligned, and if the requirement changes the team immediately knows what is impacted — e.g. replacing the motion sensor flags the linked requirement and test for update (source: m2-reqtools; master-notes §2).

**Lesson.** Traceability's payoff is *change*: links recorded up front turn an unknowable blast radius into an instant impact list. Without the links, the five-meter/two-second change would be a guessing game (source: m2-reqtools).

## Guided walkthrough — from requirement to baseline, narrated

Follow REQ-1 end to end (source: m2-reqtools; master-notes §2).

1. The verified requirement REQ-1 enters the requirement management tool (e.g. ReqView), authored with a stable ID and rich text (source: m2-reqtools).
2. The engineer creates **traceability links** in the tool from REQ-1 to the architecture diagram, then to the API-request code, then to the verification test case (source: m2-reqtools).
3. With links in place, the team **locks a baseline** of the requirement set at design review — a fixed reference for future comparison (source: master-notes §2).
4. Later a change request arrives. The team runs **impact analysis** by following REQ-1's links to see affected design, code, and tests (source: m2-reqtools).
5. The **CCB** reviews the analysis and approves the change (source: m2-reqtools).
6. The team implements the change across documents, models, code, and tests, then **communicates and updates the baseline** under version control to a new revision (source: m2-reqtools).

The narration shows the two halves working together: traceability (steps 1–3) is what makes change management (steps 4–6) cheap.

---

## Solutions

**Intermediate (A):** A test case such as *"Verify that detected movement within five meters triggers the alarm within two seconds"* — the course states a test case is created to verify that movement detection triggers the alarm within the required time (source: master-notes §2).

**Intermediate (B):** Replacing the motion sensor flags REQ-2 and its linked motion-sensor specification and the verifying test case for update (source: master-notes §2). It was made visible by **forward traceability** from the requirement out to its design/spec and test artifacts, which lets you see everything downstream of the change (source: m2-reqtools).

**Advanced — five-phase walkthrough for "2 s → 1 s":**
1. **Request for Change** — the stakeholder files the request to tighten the alarm time (source: m2-reqtools).
2. **Analyze impact** — follow REQ-2's links: affected items are the alarm-activation logic, the motion-sensor spec (can it still respond in time?), and the verifying test (its threshold drops to 1 s); estimate time and cost (source: m2-reqtools).
3. **Review and Approve (or Reject)** — the **CCB** weighs feasibility vs cost and decides (source: m2-reqtools).
4. **Implement** — update the requirement text, design/logic, code, and the test's expected timing (source: m2-reqtools).
5. **Communicate and Track** — notify the team and update the baseline in version control to the new revision (source: m2-reqtools).
