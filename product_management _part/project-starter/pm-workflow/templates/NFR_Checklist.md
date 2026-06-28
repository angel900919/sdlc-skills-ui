---
Document: NFR Checklist — <FEATURE / INITIATIVE>
Document ID: NFR-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role / name>
Updated: <YYYY-MM-DD>
---

<!--
NON-FUNCTIONAL REQUIREMENTS CHECKLIST — blank, reusable template.
Owning skill: pm-phase-08-prd (Phase 08 — Requirements & PRD). Companion to PRD.md §6.
Conforms to ../05_Conventions.md §3.4 (REQ classes U/P/O/SEC/C) and §6 (frontmatter/status).
Quality model: ISO/IEC 25010.

THE ONE RULE
- Every class gets a line — even "N/A — because…". A BLANK is not allowed (this is where launches die).
- Requirements are numeric/testable: replace "fast / reliable / secure" with a number + condition.
- "Answered?" legend:  [x] specified & owned   ·   [ ] open (carry a TODO + owner + date).
- Each row should map to a REQ-<class>-<nn> in the PRD so trace runs both ways (§4 spine).

COMPLIANCE FLOOR (2026 — verify the binding date for your market via web research before sign-off):
- WCAG 2.2 AA is the default accessibility bar (POUR: Perceivable, Operable, Understandable, Robust).
- European Accessibility Act enforceable since 2025-06-28 (firms 10+ staff / >€2M turnover); EN 301 549.
- GDPR Art. 25 — data protection by design & by default.
- EU AI Act Art. 50 transparency (disclose AI interaction / label AI-generated content) from 2026-08-02.
The privacy/accessibility/safety floor is non-negotiable even for the smallest product (Conventions §10).
-->

## Usability / Accessibility — `REQ-U-*`
| REQ ID | Requirement (numeric / testable threshold) | Answered? | Notes / "N/A — because…" |
|--------|--------------------------------------------|-----------|--------------------------|
| REQ-U-01 | WCAG 2.2 AA on all new flows (EN 301 549 / EAA) | [ ] | <TODO: which flows; audit tool e.g. axe/Lighthouse> |
| REQ-U-02 | <TODO: task completion time / learnability / error rate> | [ ] | |
| REQ-U-03 | <TODO: content/readability; localization; keyboard + screen-reader> | [ ] | |

## Performance — `REQ-P-*`
| REQ ID | Requirement (numeric / testable threshold) | Answered? | Notes / "N/A — because…" |
|--------|--------------------------------------------|-----------|--------------------------|
| REQ-P-01 | <TODO: e.g. p95 latency < N ms> | [ ] | <TODO: confirm budget vs. comparable system> |
| REQ-P-02 | <TODO: throughput / concurrency / capacity at scale> | [ ] | |

## Reliability / Operational — `REQ-O-*`
| REQ ID | Requirement (numeric / testable threshold) | Answered? | Notes / "N/A — because…" |
|--------|--------------------------------------------|-----------|--------------------------|
| REQ-O-01 | <TODO: SLO / uptime %; error budget> | [ ] | |
| REQ-O-02 | Rollback / kill-switch via feature flag | [ ] | <TODO: owner; mechanism> |
| REQ-O-03 | <TODO: error handling; offline behaviour; data retention/backup> | [ ] | |

## Security / Privacy — `REQ-SEC-*`
| REQ ID | Requirement (numeric / testable threshold) | Answered? | Notes / "N/A — because…" |
|--------|--------------------------------------------|-----------|--------------------------|
| REQ-SEC-01 | AuthN/Z model; least privilege | [ ] | |
| REQ-SEC-02 | GDPR Art. 25 — privacy by design/default; data minimization; consent | [ ] | <TODO: DPIA owed? who/when> |
| REQ-SEC-03 | EU AI Act Art. 50 transparency (disclose AI / label AI output) | [ ] | <TODO: applies? from 2026-08-02> |
| REQ-SEC-04 | <TODO: encryption in transit/at rest; secrets; logging/audit trail> | [ ] | |

## Constraint — `REQ-C-*`
| REQ ID | Requirement (imposed limit) | Answered? | Notes / "N/A — because…" |
|--------|-----------------------------|-----------|--------------------------|
| REQ-C-01 | <TODO: budget / cost ceiling> | [ ] | |
| REQ-C-02 | <TODO: platform / mandated tech / legal / contractual> | [ ] | |

## Coverage gate (block "done" if any class is unanswered)
- [ ] Every class above has ≥1 row with an answer (a threshold or "N/A — because…").
- [ ] Each row traces to a `REQ-<class>-<nn>` in **PRD.md** §6 (forward + backward, §4 spine).
- [ ] Compliance rows confirmed against the *current* binding obligation (recommend web research).
- [ ] New risks logged as `RSK-<nn>` (severity per §5); DPIA/accessibility sign-off owners named.

---

### Related templates & owner
- **PRD.md** — §6 mirrors this checklist; this file is the source of truth for NFR sign-off at **G6**.
- Cross-cutting: `../cross-cutting/Responsible_Product.md` (the non-negotiable floor).
- _Owning skill: **pm-phase-08-prd**. Conventions: ../05_Conventions.md (§3.4 classes, §6 frontmatter)._
