# Requirements Management, Traceability & Change Management — Advanced concepts

## Advanced concepts

- **Standards drive the rigor.** The course ties tool choice and traceability depth to specific standards: ReqView supports compliance with **ISO 26262** (automotive), **DO-178C** (airborne software), and **IEC 62304** (medical-device software) (source: m2-reqtools). Separately, **ISO/IEC/IEEE 29148** structures requirements engineering through five document templates — StRS, SyRS, SRS, BRS, OpsCon — so requirements are baselined per layer (stakeholder, system, software, business, operational concept) rather than in one undifferentiated list (source: master-notes §2).
- **Tool landscape beyond ReqView.** For larger or regulated programs the course names **IBM DOORS** (complex requirements, traceability, compliance), **Jama Connect** (collaboration, traceability, risk), and **Helix RM** (real-time collaboration, impact analysis, regulatory compliance). Most are not free, and free tiers (including ReqView's) are limited (source: master-notes §2).
- **Traceability as a layered structure.** The "ensure traceability between *different levels* of requirements" framing means links exist not only requirement→test but stakeholder→system→software requirement, mirroring the 29148 template layers (source: master-notes §2).

## Edge cases & gotchas

- **Backward traceability does not find missing implementations.** It finds *orphans* (artifacts with no source requirement). Coverage gaps are a forward-traceability concern. Conflating the two is the classic exam trap (source: m2-reqtools).
- **Impact analysis is only as good as the links.** Phase 2 follows recorded links; any requirement/design/code/test left unlinked is invisible to impact analysis and becomes a silent regression risk (source: m2-reqtools).
- **A baseline is not a backup.** A baseline is an approved, version-controlled reference for measuring change; locking it at the wrong moment (before requirements stabilize) forces churn, while never locking it makes "what changed?" unanswerable (source: master-notes §2).
- **Skipping the CCB causes scope creep.** The whole point of phase 3 approval is to stop informal changes; bypassing it for "small" changes is how scope creep and inconsistency enter (source: m2-reqtools; master-notes §2).

## Performance, production & security considerations

- **Security/offline.** ReqView is a **desktop application** storing data locally or on a shared drive, which the course frames as meeting *high security requirements* — relevant where requirements data can't sit in a cloud SaaS (source: m2-reqtools).
- The source material does not cover performance/scalability of requirement-management tooling itself.

## Where to go deeper

- **[18-change-management-continuous-validation](../18-change-management-continuous-validation/advanced.md)** — the system-wide impact-analysis workflow, continuous validation, and a worked impact-analysis example; this topic deliberately stops at the requirements-level five-phase process and CCB.
- **m2-reqtools** — ReqView quick-start tutorial link and the full feature/traceability tables.
- **master-notes §2** — ISO/IEC/IEEE 29148 templates, the broader tool list (DOORS, Jama, Helix RM), and the six requirements-management best practices.
- **Standards themselves** — ISO 26262, DO-178C, IEC 62304 for why bidirectional traceability is mandated in those domains (source: m2-reqtools).
- Glossary: [references.md#glossary](../../references.md#glossary).
