# ADR-0008 — We will model project knowledge as one unified, graph-based domain model

- Status: accepted (2026-06-13)
- Context: the dashboard renders several views over project knowledge — chain/stage state, the
  architecture component model, the board — and each is a bespoke shape today (stageModel, the
  `02-components.md` table, FeatureState/SliceState). The planned Architecture & Progress tab
  (`.ai/specs/architecture-tab/`) adds more views (agent activity, data flow, dependency
  analysis, requirements traceability, deployment). Building each as its own model multiplies
  code and lets the views drift from each other.
- Decision: We will define one typed, graph-based domain model in ShareDomainModel — nodes
  {requirement, feature, slice/task, component, api, datastore, workflow, source-file, test,
  deployment, issue, agent-session, person}, edges {depends-on, maps-to, implements, traces-to,
  calls, emits, owns, touches} — and render every view as a projection/query over it.
  DeriveProjectState materializes it; today's "project state" becomes one projection. The MVP
  (architecture-tab v1) materializes only the {component, edge, feature, slice, issue, stage}
  subset; the schema must not preclude the rest. ServeApiAndWs exposes it (`/api/architecture`
  now, a broader graph endpoint later). Governed by ADR-0009.
- Consequences: views compose instead of multiply; traceability (requirement→…→deployment) and
  drift detection become queries, not new subsystems. The trade is one upfront schema-design
  cost and the standing discipline that a new view must be a projection, not a bespoke model.
  Generalizes the existing stageModel + `02-components` edge table as the first node/edge sets;
  supersedes neither.
