# Flashcards — Agile Systems Engineering Playbook (Capstone)

| ID | Front | Back | Tags |
|---|---|---|---|
| q-19-001 | What single mechanism gives end-to-end traceability across all tools in the playbook? | A unified ID system: the requirement ID is reused inside the JIRA story, GitLab branch/commit, and test-case name.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-002 | Requirement naming convention (cloze): the pattern is {{c1::[Project]-[Type]-[Number]}}, e.g. {{c2::AI-SYS-001}}. | [Project]-[Type]-[Number]; AI-SYS-001<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, cloze |
| q-19-003 | Test-case naming convention? | `TC-[Requirement-ID]-[Action]`, e.g. `TC-AI-SYS-001-IngestionTest`.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-004 | GitLab branch naming convention? | `feature/[JIRA-ID]-[Short-Description]`, e.g. `feature/PROJ-101-data-ingest`.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-005 | The five GitLab repo folders and their contents? | `/docs` specs+ICD; `/models` SysML (BDD/IBD); `/src` code; `/tests` test plans+scripts; `/mgmt` change logs+decision matrices.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-006 | What is produced in **Sprint 0**? | The StRS, a high-level BDD, and the initial SyRS (the foundation/runway).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-007 | What does a **delivery sprint** cycle through? | Analysis → Detailed Design → Build → Unit/Integration Test, for specific requirements.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-008 | What is the focus of a **hardening sprint**? | System Validation and final UAT.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-009 | Phase 1 deliverables? | Business Requirements (BRS) and Stakeholder Requirements (StRS).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-010 | Phase 2 deliverables and the key criterion applied? | SyRS and OpsCon; apply SMART (Specific, Measurable, Achievable, Relevant, Testable).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-011 | Phase 3 deliverables? | A high-level Architecture Model and an ICD overview (built from BDD/FFBD + trade-off analysis).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-012 | Phase 5 deliverables and success gate? | Test Cases, Test Reports, Verification Matrix; gate = 100% requirement coverage in the matrix.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-013 | What does the **verification matrix** prove? | That every requirement maps to a test — its success gate is 100% requirement coverage.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, apply |
| q-19-014 | Verification vs validation in Phase 5? | Verification = built right (meets the spec, e.g. `TC-AI-SYS-101`); Validation = right system (users find it useful, low false positives).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, compare |
| q-19-015 | Minimum-Viable vs Formal: what does Minimum-Viable do with StRS/SyRS? | Combines StRS and SyRS into one document; uses JIRA for traceability; focuses on unit and UAT.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, compare |
| q-19-016 | What does the **Formal** process level add? | Full ISO 29148 suite, MBSE (Cameo/Visual Paradigm), formal Change Control Board (CCB), and bidirectional traceability.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, compare |
| q-19-017 | The three SMART checklist items the playbook lists? | Specific (no "fast/responsive"); Measurable (units/quantities); Testable (a pass/fail case).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-018 | The three Change-Management (impact analysis) checklist items? | Scope (which requirements/modules affected?); Risk (regression?); Traceability (design, code, tests updated?).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-019 | In the Smart Home example, requirement AI-SYS-101 states what? | The system shall detect human presence within 5 meters and send a notification within 2 seconds.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, apply |
| q-19-020 | What is the ICD's role (document-purpose summary)? | The "contract" for how subsystems talk to each other.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-021 | BRS/StRS vs SyRS/SRS purpose? | BRS/StRS capture the "Why" / stakeholder vision; SyRS/SRS are the technical "What" for systems and software.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, compare |
| q-19-022 | What does OpsCon describe? | Real-world usage scenarios of the system.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-023 | Traceability rule for JIRA Stories? | Every JIRA Story must link back to a requirement ID in the SyRS; commit messages must reference the Requirement/JIRA ID.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, apply |
| q-19-024 | Phase 6 migration technique and what is monitored? | Migration via Blue-Green deployment; monitor resource utilization and uptime (GitLab CI/CD).<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, recall |
| q-19-025 | Given Phase 3 needs to pick between components, which technique chooses? | Trade-off Analysis using a Decision Matrix.<br><sub>(source: playbook)</sub> | topic::agile-se-playbook, apply |
