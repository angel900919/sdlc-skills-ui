# Agile Systems Engineering Playbook (Capstone) — Examples

Every example traces to the single source, `playbook`. Concepts owned by other topics are linked, not re-derived.

## Simple example

**Task:** build the traceable ID chain for one requirement, `AI-SYS-001` (System type, project `AI`).

| Step | Artifact name | Reason |
| :-- | :-- | :-- |
| 1. Requirement | `AI-SYS-001` | Pattern `[Project]-[Type]-[Number]` — System type for project AI (source: playbook) |
| 2. JIRA Story | `Story: AI-SYS-001 - Implement Data Ingestion` | Pattern `[Type]: [Requirement ID] - [Action]`; story links back to the SyRS ID (source: playbook) |
| 3. GitLab branch | `feature/PROJ-101-data-ingest` | Pattern `feature/[JIRA-ID]-[Short-Description]` (source: playbook) |
| 4. GitLab commit | `PROJ-101: added validation logic` | Pattern `[JIRA-ID]: [Brief Description]`; commit must reference the JIRA/Requirement ID (source: playbook) |
| 5. Test case | `TC-AI-SYS-001-IngestionTest` | Pattern `TC-[Requirement-ID]-[Action]` — closes the loop back to the requirement (source: playbook) |

**Result:** one grep on `AI-SYS-001` (or its JIRA ID) finds the story, the code, and the test — end-to-end traceability (source: playbook).

## Intermediate example (completion problem)

A small smart-thermostat team is at the **Minimum Viable** process level. Fill the two blanked cells; solution at the bottom.

| Phase | Deliverable | Tool / note |
| :-- | :-- | :-- |
| 1. Problem Definition | BRS / StRS | JIRA Epics; GitLab hosts Markdown |
| 2. Requirements Eng. | **______ (A)** | ReqView; JIRA Stories; apply SMART |
| 3. Architecture | BDD / FFBD + ICD overview | Visual Paradigm; store in `/models` |
| 5. Integration & V&V | Test Cases, **______ (B)** | Gate: 100% requirement coverage |

Hints: (A) is the pair of documents that define the technical "What" produced in Phase 2; (B) is the Phase-5 artifact whose success gate is full requirement coverage.

## Advanced example (mostly blanked)

**Strategy hint only:** A safety-critical avionics subsystem is starting. Decide the **process level**, then list the *governance* artifacts that level adds beyond the Minimum-Viable baseline. Produce your answer, then check the bottom.

(Think: criticality → process level → which standard suite, modeling approach, change body, and traceability direction the playbook prescribes.)

## Real-world case study — Smart Home AI Security

The source narrates this thread end to end (source: playbook):

- **Situation:** A homeowner states a need — *"I want to feel safe knowing my front door is monitored."*
- **Approach (need → verified system):**
  1. **Need** captured (above).
  2. **Requirement `AI-SYS-101`:** "The system shall detect human presence within 5 meters and send a notification within 2 seconds." (Note it is Specific, Measurable, Testable — passes SMART → [topic 06](../06-verifying-requirements/fundamentals.md).)
  3. **JIRA Story:** `AI-SYS-101: Implement YOLO human detection logic`.
  4. **Architecture (BDD):** `Camera Block` connects to `AI Processing Block` → [topic 08](../08-sysml-modeling/fundamentals.md).
  5. **Detailed Design (ICD):** Camera sends a 1080p stream to the AI block via RTSP protocol → ICD ownership in [topic 14](../14-documenting-architecture/fundamentals.md).
  6. **Implementation:** developer pushes to GitLab branch `feature/AI-SYS-101-yolo`.
  7. **Verification (`TC-AI-SYS-101`):** walk in front of the camera; verify the notification arrives in under 2 seconds.
  8. **Validation:** user confirms the notifications are helpful and not annoying (false positives).
- **Outcome:** a built, verified, and validated detection feature whose every artifact carries `AI-SYS-101`.
- **Lesson:** the requirement ID is the thread that ties a vague human need to a pass/fail test and a real user confirmation — and the verification step proves "built right" while the validation step proves "right system" (source: playbook).

## Guided walkthrough — one feature through the Agile workflow

Narrating a single delivery sprint for `AI-SYS-101` (source: playbook):

1. **Before the sprint (Sprint 0 output exists):** the StRS, a high-level BDD, and the initial SyRS already define the security system's shape (source: playbook).
2. **Sprint planning:** pull `AI-SYS-101` into the delivery sprint; its JIRA Story is `AI-SYS-101: Implement YOLO human detection logic`.
3. **Analysis:** confirm the requirement is SMART (5 m, 2 s — measurable and testable).
4. **Detailed Design:** add the IBD/Sequence detail and the ICD line (1080p over RTSP); store diagrams in `/models`, the ICD in `/docs`.
5. **Build:** branch `feature/AI-SYS-101-yolo`, commit `AI-SYS-101: add YOLO detection`; GitLab CI/CD runs unit tests automatically.
6. **Unit/Integration Test (in-sprint):** integrate Camera Block ↔ AI Processing Block; verify the data path.
7. **Hardening sprint (later):** run `TC-AI-SYS-101` end to end and the user-validation check; record the result in the verification matrix toward the 100%-coverage gate.

Every step reuses `AI-SYS-101`, so the verification matrix can list the requirement and point straight at `TC-AI-SYS-101` (source: playbook).

---

## Solutions

**Intermediate example:**
- **(A)** = **SyRS and OpsCon** — the System Requirements Specification and System Operational Concept are Phase 2's deliverables (source: playbook).
- **(B)** = **Verification Matrix** (alongside Test Reports) — the Phase-5 deliverable whose success gate is 100% requirement coverage (source: playbook).

**Advanced example:** A safety-critical avionics subsystem is **critical/large → Formal** process level. Beyond the Minimum-Viable baseline, the Formal level adds: the **full ISO 29148 suite** (instead of a merged StRS/SyRS) → [topic 04](../04-se-tools-techniques/fundamentals.md); **MBSE** with Cameo/Visual Paradigm; a formal **Change Control Board (CCB)**; and **bidirectional traceability** (source: playbook). CCB and traceability direction → [topic 18](../18-change-management-continuous-validation/fundamentals.md), [topic 07](../07-requirements-management/fundamentals.md).
