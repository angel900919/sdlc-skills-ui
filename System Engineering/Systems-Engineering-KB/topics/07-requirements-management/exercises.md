# Requirements Management, Traceability & Change Management — Exercises

## Warm-up (Tier-1 recall — answer from memory)

1. From memory, define **requirement management tools** in one sentence.
2. List the **three types of traceability** and the direction of each.
3. List the **five phases** of the change management process in order.
4. From memory, name what a **baseline** locks and why.
5. What does the **CCB** do, and in which phase?

## Core exercises (Tier-2 — apply to scenario)

**C1 — Build a traceability matrix.** Given the requirement "The system shall control smart locks based on user authentication," build a four-column matrix (Req ID, Design, Code, Test) using the artifacts from the course. Then add the one extra check that makes the trace bidirectional. (source: m2-reqtools)

**C2 — Classify the links (guidance-fading pair).**
- *2a (guided):* A requirement points to the design that implements it. Forward or backward? Why?
- *2b (independent):* A developer adds a logging module no requirement asked for. Which traceability type would have flagged it, and what would the flag look like?

**C3 — Run a change request through the process.** A stakeholder asks to change REQ-2 from "alarm within two seconds" to "alarm within one second." Write one line for each of the five phases naming who acts and what they produce. (source: m2-reqtools)

**C4 — Map ReqView features to tasks.** For each task, name the ReqView feature that supports it: (a) comparing two document versions to see what changed; (b) recording that test T1 verifies requirement R1; (c) assigning "test" as the verification method for a requirement; (d) producing a PDF for an audit. (source: m2-reqtools)

**C5 — Explain it back (Feynman).** In ~5 sentences, explain to a new teammate why traceability makes change management cheaper. Self-check rubric: you must (i) name at least two of the four artifact types (requirement/design/code/test), (ii) connect traceability links to impact analysis, and (iii) say what would happen without the links.

## Challenge exercises (Tier-3 — analyze / evaluate / build)

**Ch1 — Choose the traceability strategy (evaluate).** Project A is a hobby weather widget; Project B is an automotive braking controller under ISO 26262. For each, choose forward-only, backward-only, or bidirectional traceability and justify in one sentence. (source: m2-reqtools)

**Ch2 — Interleaved set (pick the concept first).** For each item, first decide which concept applies — **verifying a requirement** (topic 06), **eliciting/classifying** a requirement (topic 05), or **managing/tracing/changing** a requirement (this topic) — then answer:
- (i) Deciding whether "the system shall respond fast" is acceptable.
- (ii) Linking requirement R3 to the test case that proves it.
- (iii) Interviewing farmers to find what a smart-irrigation system must do.
- (iv) Locking the requirement set at design review so future changes can be measured.
- (v) Getting the CCB to approve dropping a feature.

**Ch3 — Build the map yourself.** Nodes: `Requirement`, `Design`, `Code`, `Test case`, `Change request`, `CCB`, `Baseline`. Draw the directed edges and label each (use forward/backward traceability and the relevant change phases). Compare against the diagram in [fundamentals.md](fundamentals.md).

---

## Solutions & explanations

**Warm-up**
1. Tools that help teams document, track, and trace requirements systematically, enhancing collaboration, traceability, and change management (source: m2-reqtools).
2. Forward (requirement→design→code→test), backward/reverse (test/design→source requirement), bidirectional (both) (source: m2-reqtools).
3. Request for Change → Analyze impact → Review & Approve/Reject → Implement → Communicate & Track (source: m2-reqtools).
4. A baseline locks a set of requirements at a specific stage, giving a fixed, version-controlled reference to compare future changes against (source: master-notes §2).
5. The Change Control Board reviews and approves (or rejects) a change request — phase 3 (source: m2-reqtools).

**C1.** | Req ID | Design | Code | Test |
|---|---|---|---|
| REQ-1 | System architecture diagram | Code block controlling API requests | Confirm smart lock API device connection |
Bidirectional check: confirm the test case also traces back to REQ-1 (source: m2-reqtools).

**C2.** 2a: **Forward** — it goes requirement → design, the direction that proves requirements are implemented (source: m2-reqtools). 2b: **Backward (reverse)** — the logging module is an orphan with no source requirement to trace back to; backward traceability ensures no unnecessary elements are added (source: m2-reqtools). *Common wrong answer:* "forward would catch it" — forward catches *missing* implementations, not extra ones.

**C3.** (1) Stakeholder files the request; (2) team analyzes impact by following REQ-2's links to alarm logic, sensor spec, and test, plus time/cost; (3) CCB reviews and approves/rejects; (4) team updates requirement, design, code, and test; (5) team notifies everyone and updates the baseline in version control (source: m2-reqtools).

**C4.** (a) Change Management (compare document versions); (b) Traceability Links; (c) Verification Planning; (d) Export & Reporting (source: m2-reqtools).

**C5.** Model answer: A requirement is linked to its design, code, and test. When a change comes, you follow those links to see exactly what's affected — that is impact analysis. So the blast radius is a quick lookup instead of a hunt. Without the links you'd have to manually search the whole system and would likely miss something, causing defects and rework. That's why teams record traceability before they need it (source: m2-reqtools; master-notes §2).

**Ch1.** Project A (low stakes): forward-only is acceptable — you mainly need to confirm requirements are implemented. Project B (safety-critical, ISO 26262): bidirectional is required, because safety-critical/compliance work must follow links in both directions for audit (source: m2-reqtools).

**Ch2.** (i) verifying — topic 06 (SMART check); (ii) managing/tracing — this topic (traceability link); (iii) eliciting — topic 05 (interviews); (iv) managing — this topic (baseline); (v) managing — this topic (CCB approval) (source: m2-reqtools; m2-review).

**Ch3.** Expected edges: `Requirement --forward--> Design --forward--> Code --forward--> Test`; `Test --backward--> Requirement`; `Change request --analyze impact--> Requirement`; `CCB --approve/reject--> Change request`; `Test/implementation --update baseline--> Baseline`. Matches [fundamentals.md](fundamentals.md) (source: m2-reqtools; master-notes §2).
