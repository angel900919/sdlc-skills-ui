# Agile Systems Engineering Playbook (Capstone) — Exercises

All items trace to `playbook`. Solutions and a brief why are at the bottom.

## Warm-up (Tier 1 — production recall)

1. From memory, list the **five rows** of the unified naming table (artifact → convention).
2. From memory, name the **five GitLab folders** and what each holds.
3. From memory, list the **three sprint types** and what each one's focus is.
4. From memory, state the **deliverables of each of the six lifecycle phases**.
5. From memory, give the **three SMART checklist items** the playbook lists.

## Core exercises (Tier 2 — apply to scenario)

**C1. Build the ID chain.** A delivery-robot project (`DR`) has user requirement number 7. Write its requirement ID, JIRA Story title (action: "Add obstacle avoidance"), GitLab branch (JIRA-ID `DR-208`), commit message, and test-case ID.

**C2. Map phase → artifacts/tools (guidance-fading pair).**
- *(a, worked-style)* For **Phase 2**, name the two deliverables and the formal-management tool.
- *(b, faded)* For **Phase 5**, name the three deliverables, the success gate, and the test-management tool — with no hints.

**C3. SMART triage.** A backlog item reads: *"The app should feel fast and responsive."* Run the SMART checklist against it and rewrite it as a SMART requirement (invent a measurable threshold and state your assumption).

**C4. Impact analysis.** A change request swaps the camera in the Smart Home system from 1080p to 4K. Run the three-item Change Management checklist and say which artifacts (and which folder) must be updated.

**C5. Feynman.** Explain to a junior engineer, in plain language, *how the unified ID system produces end-to-end traceability*. Self-check rubric: (i) names the requirement ID as the spine; (ii) shows it reappearing in JIRA + branch/commit + test case; (iii) states the payoff (grep one ID, find story/code/test).

## Challenge exercises (Tier 3 — analyze / evaluate / build)

**X1. Open build (Create).** Choose any small system (e.g., a smart doorbell). Produce the **full traceable artifact thread** for one feature: need → requirement ID → JIRA Story → BDD node pair → ICD interface line → branch name → test-case ID → validation check. Keep IDs consistent throughout. (This is the projects.md deliverable in miniature.)

**X2. Interleaved set — pick the concept first.** For each scenario, first decide *which concept/topic applies*, then answer. The siblings in play are: lifecycle *model* choice (topic 03), governance *level* (this topic), and verification *vs* validation (topic 16).
- (a) A 3-person team building a non-critical internal tool must decide how much SE rigor to apply. Which decision is this, and what does the playbook recommend?
- (b) A regulated medical device team must decide whether to run rigid up-front phases or iterative sprints. Which decision is this, and where is it owned?
- (c) The team must prove the door-detection feature meets its 2-second requirement, then separately confirm users find the alerts useful. Which two activities are these, and how do they differ?

**X3. Build the map yourself.** Given these nodes — `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Phase 5`, `Phase 6`, and `Unified ID` — draw the edges (label each with the artifact handed forward, and show where the ID threads in and where Phase 6 feeds back).

**X4. Governance evaluation.** A company has two new projects: (i) a one-month internal dashboard; (ii) a multi-year air-traffic component. For each, choose Minimum-Viable vs Formal and justify with the specific artifacts/bodies that level adds or drops.

---

## Solutions & explanations

**Warm-up**
1. Requirements `[Project]-[Type]-[Number]`; JIRA `[Type]: [Requirement ID] - [Action]`; GitLab Branch `feature/[JIRA-ID]-[Short-Description]`; GitLab Commit `[JIRA-ID]: [Brief Description]`; Test Cases `TC-[Requirement-ID]-[Action]` (source: playbook).
2. `/docs` specs (StRS, SyRS, SRS) + ICD; `/models` SysML (BDD, IBD); `/src` code; `/tests` test plans + scripts; `/mgmt` change logs + decision matrices (source: playbook).
3. Sprint 0 = concept/foundation (StRS, high-level BDD, initial SyRS); Delivery = Analysis→Detailed Design→Build→Unit/Integration Test; Hardening = System Validation + UAT (source: playbook).
4. P1 BRS/StRS; P2 SyRS/OpsCon; P3 architecture model + ICD overview; P4 SRS + schematics + source code; P5 Test Cases + Test Reports + Verification Matrix; P6 User Manuals + Training Material + Maintenance Logs (source: playbook).
5. Specific (no "fast/responsive"); Measurable (units, quantities); Testable (pass/fail case) (source: playbook).

**Core**
- **C1.** Requirement `DR-USR-007`; Story `DR-USR-007: Add obstacle avoidance`; branch `feature/DR-208-obstacle-avoidance`; commit `DR-208: add obstacle avoidance logic`; test case `TC-DR-USR-007-ObstacleAvoidanceTest`. *Why:* each name embeds the upstream ID per the naming table (source: playbook).
- **C2(a).** Deliverables SyRS and OpsCon; formal-management tool ReqView (source: playbook). **C2(b).** Deliverables Test Cases, Test Reports, Verification Matrix; gate = 100% requirement coverage; tool Testomat (source: playbook).
- **C3.** Fails Specific (vague "fast"), Measurable (no units), Testable (no pass/fail). Rewrite e.g. *"The app shall load the home screen within 1.5 seconds on a 4G connection."* (assumption: 4G baseline) — now measurable and testable (source: playbook).
- **C4.** *Scope:* the ICD interface line (1080p→4K stream), `AI-SYS-101` and any bandwidth/processing requirements; *Risk:* regression — does the AI block still meet the 2-second budget at 4K?; *Traceability:* update design (ICD in `/docs`, BDD/IBD in `/models`), code (`/src`), and tests (`/tests`, re-run `TC-AI-SYS-101`) (source: playbook). Common wrong answer: updating only the code and forgetting the ICD and test re-run.
- **C5.** Strong answer: the requirement ID (e.g. `AI-SYS-101`) is reused verbatim inside the JIRA Story, the GitLab branch/commit, and the `TC-` test-case name, so searching that one ID returns the story, the code, and the test — that linkage *is* end-to-end traceability (source: playbook).

**Challenge**
- **X1.** Any consistent thread is correct if a single ID appears in every artifact and the verification/validation steps are distinct. Model thread (smart doorbell, project `SD`): need "know who's at the door" → `SD-SYS-003` "shall identify a visitor and notify within 3 s" → Story `SD-SYS-003: Implement face-match notification` → BDD `Doorbell Cam Block`↔`Notify Block` → ICD "cam streams 720p over RTSP to Notify Block" → branch `feature/SD-310-face-match` → `TC-SD-SYS-003-NotifyTest` (notify < 3 s) → validation: user confirms alerts are useful, low false positives (source: playbook).
- **X2.** (a) **Governance level** (this topic) → Minimum Viable: merge StRS/SyRS, JIRA traceability, unit + UAT (source: playbook). (b) **Lifecycle-model choice** — owned by [topic 03](../03-lifecycle-models/fundamentals.md); the playbook itself runs Agile sprints (source: playbook). (c) **Verification vs Validation** — verification = built right (does it meet the 2 s requirement, `TC-AI-SYS-101`); validation = right system (do users find alerts useful) (source: playbook); methods in [topic 16](../16-verification-validation-methods/fundamentals.md). *Why interleave:* learners often answer "Agile" for (a) — but rigor *level* and iteration *model* are different decisions.
- **X3.** Edges: P1 →(BRS/StRS)→ P2 →(SyRS/OpsCon)→ P3 →(BDD/FFBD/ICD)→ P4 →(SRS/IBD/code)→ P5 →(Test Cases/Verification Matrix)→ P6; `Unified ID` threads into P2, P4, P5 (names story/branch/commit/test); P6 →(change requests)→ P2 (source: playbook). Compare with the diagram in [fundamentals.md](fundamentals.md).
- **X4.** (i) Internal dashboard → **Minimum Viable**: combine StRS/SyRS, JIRA traceability, unit + UAT — proportionate to low criticality (source: playbook). (ii) Air-traffic component → **Formal**: full ISO 29148 suite, MBSE (Cameo/Visual Paradigm), formal CCB, bidirectional traceability — justified by safety-criticality (source: playbook). *Why:* the playbook explicitly ties Formal to "Critical/Large Projects."
