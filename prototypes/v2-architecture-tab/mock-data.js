/*
 * Mock data for the v2.0 "Architecture & Progress" prototypes.
 * Real values sourced from .ai/architecture/02-components.md (components + edges),
 * packages/shared/src/stageModel.ts (SDLC stages), dashboard/state.json + .ai/features.md
 * (features), and .beads/issues.jsonl (slice→bead refs). A few PLANNED items
 * (OrchestrateChain, the architecture-tab + cross-project-orchestrator features) and
 * three sibling projects are invented so the "planned / building / blocked" states and
 * the portfolio view have something to render. Exposed as window.MOCK.
 */
window.MOCK = (() => {
  // ---- The system as a graph: 7 real components + 1 planned + 2 external ----
  const components = [
    {
      id: 'RenderFlightDeck', name: 'RenderFlightDeck', kind: 'ui', status: 'building',
      role: 'Renders the dashboard, terminals, board, pipeline and docs over the API/WS.',
      livesAt: 'apps/web/src/', apiBearing: false, layer: 5, order: 1,
      agent: 'session · /mtdd-implement architecture-tab', feature: 'architecture-tab',
      inputs: ['WS ServerEvent stream', 'REST ProjectState / Metrics'],
      outputs: ['User intent → REST mutations', 'Terminal input over WS'],
      dependsOn: ['ServeApiAndWs', 'ShareDomainModel', 'OrchestrateChain'],
      files: ['apps/web/src/pages/', 'apps/web/src/components/', 'apps/web/src/store/appStore.ts'],
      slices: ['scc-arc1', 'scc-arc2'],
      invariants: [],
    },
    {
      id: 'ServeApiAndWs', name: 'ServeApiAndWs', kind: 'service', status: 'done',
      role: 'Exposes the REST surface and the single multiplexed WS, translating client intent into component calls.',
      livesAt: 'apps/server/src/routes/api.ts + ws.ts', apiBearing: true, layer: 4, order: 1,
      agent: 'shipped · git@b54e2cd', feature: 'sdlc-command-center',
      inputs: ['HTTP requests', 'WS client events (subscribe, terminal-input)'],
      outputs: ['ServerEvent broadcasts', 'Session spawn calls', 'State queries'],
      dependsOn: ['RunClaudeSessions', 'DeriveProjectState', 'ShareDomainModel'],
      files: ['apps/server/src/routes/api.ts', 'apps/server/src/ws.ts'],
      slices: [],
      invariants: ['Work leaves the machine only through a human gate (owns the PR gate).'],
    },
    {
      id: 'RunClaudeSessions', name: 'RunClaudeSessions', kind: 'service', status: 'done',
      role: 'Spawns, resumes and supervises interactive Claude CLI processes in PTYs with safe env + worktree isolation.',
      livesAt: 'apps/server/src/claude/', apiBearing: false, layer: 1, order: 1,
      agent: 'shipped', feature: 'sdlc-command-center',
      inputs: ['Spawn / resume / kill commands', 'PTY stdin'],
      outputs: ['PTY stdout (terminal-data)', 'Tailed transcript lines'],
      dependsOn: ['IngestObservability', 'ShareDomainModel'],
      files: ['apps/server/src/claude/sessionManager.ts', 'apps/server/src/claude/worktrees.ts'],
      slices: [],
      invariants: ['Self-hosting never recurses (strips nested CLAUDE_* env).'],
    },
    {
      id: 'IngestObservability', name: 'IngestObservability', kind: 'service', status: 'done',
      role: 'Turns hook POSTs, tailed transcripts and usage samples into domain events without ever blocking the observed session.',
      livesAt: 'apps/server/src/routes/hooks.ts + claude/transcriptTailer.ts', apiBearing: true, layer: 1, order: 2,
      agent: 'shipped', feature: 'sdlc-command-center',
      inputs: ['Hook POSTs (curl from CLI)', 'Transcript jsonl tail', 'Usage samples'],
      outputs: ['HookEvent / AuditEvent / TranscriptMessage', 'Verdict tokens'],
      dependsOn: ['PersistAndBroadcast', 'ShareDomainModel'],
      files: ['apps/server/src/routes/hooks.ts', 'apps/server/src/claude/transcriptTailer.ts', 'apps/server/src/state/verdictWatcher.ts'],
      slices: [],
      invariants: ['Observation never interferes (must stay non-blocking end-to-end).'],
    },
    {
      id: 'DeriveProjectState', name: 'DeriveProjectState', kind: 'engine', status: 'building',
      role: 'Computes chain/project state (via project-state.py), watches artifacts, detects verdicts, raises attention, builds recaps.',
      livesAt: 'apps/server/src/state/', apiBearing: false, layer: 3, order: 1,
      agent: 'session · /mtdd-implement architecture-api', feature: 'architecture-tab',
      inputs: ['.ai / .human / docs / fitness / tickets file changes', 'project-state.py output'],
      outputs: ['ProjectState (state.json)', 'state-changed events', 'attention flags', 'ArchitectureModel (planned)'],
      dependsOn: ['PersistAndBroadcast', 'ShareDomainModel'],
      files: ['apps/server/src/state/projectState.ts', 'apps/server/src/state/watcher.ts', 'apps/server/src/state/verdictWatcher.ts'],
      slices: ['scc-arc3'],
      invariants: ['The app never observes its own output (excludes dashboard/).'],
    },
    {
      id: 'PersistAndBroadcast', name: 'PersistAndBroadcast', kind: 'store', status: 'done',
      role: 'Persists every observable event to the SQLite audit trail and fans it out to WS subscribers.',
      livesAt: 'apps/server/src/bus.ts + db.ts', apiBearing: false, layer: 2, order: 1,
      agent: 'shipped', feature: 'sdlc-command-center',
      inputs: ['Domain events from all server components'],
      outputs: ['SQLite rows (audit_events, hook_events, …)', 'server-event fan-out'],
      dependsOn: ['ShareDomainModel'],
      files: ['apps/server/src/bus.ts', 'apps/server/src/db.ts'],
      slices: [],
      invariants: [],
    },
    {
      id: 'ShareDomainModel', name: 'ShareDomainModel', kind: 'shared', status: 'done',
      role: 'Defines the domain types, stage graph, verdict vocabulary and pure transforms both apps consume.',
      livesAt: 'packages/shared/src/', apiBearing: false, layer: 2, order: 2,
      agent: 'shipped', feature: 'sdlc-command-center',
      inputs: ['(compile-time substrate)'],
      outputs: ['Types, stageModel, verdicts, pure transforms'],
      dependsOn: [],
      files: ['packages/shared/src/types.ts', 'packages/shared/src/stageModel.ts', 'packages/shared/src/verdicts.ts'],
      slices: [],
      invariants: ['The pipeline never shows false progress (verdict matching is the guard).'],
    },
    {
      id: 'OrchestrateChain', name: 'OrchestrateChain', kind: 'service', status: 'planned',
      role: 'v2 — Always-on conductor: reads cross-project state + verdicts, recommends the next move, runs it on confirm (gated autopilot).',
      livesAt: 'apps/server/src/orchestrator/ (planned)', apiBearing: true, layer: 4, order: 0,
      agent: 'unassigned', feature: 'cross-project-orchestrator',
      inputs: ['ProjectState (all projects)', 'verdict stream', 'attention flags', 'stage graph + verdict routing'],
      outputs: ['Next-move recommendation', 'Gated session spawns', 'Portfolio digest'],
      dependsOn: ['ServeApiAndWs', 'DeriveProjectState', 'ShareDomainModel'],
      files: ['(to be created)'],
      slices: ['scc-orc1', 'scc-orc2', 'scc-orc3'],
      invariants: ['Never advances a stage without a human gate (mirrors /next: suggest, don’t invoke).'],
    },
    {
      id: 'claudeCli', name: 'claude CLI', kind: 'external', status: 'done',
      role: 'The Claude Code CLI running inside each PTY; emits lifecycle hooks via curl.',
      livesAt: 'external process', apiBearing: false, layer: 0, order: 1,
      agent: 'external', feature: null,
      inputs: ['Prompts / slash commands'], outputs: ['Hook POSTs', 'transcript jsonl', 'tool calls'],
      dependsOn: ['IngestObservability'], files: [], slices: [], invariants: [],
    },
    {
      id: 'projectStatePy', name: 'project-state.py', kind: 'external', status: 'done',
      role: 'Read-only Python generator that walks .ai/ artifacts and writes dashboard/state.json.',
      livesAt: '.claude/skills/_build_share/project-state.py', apiBearing: false, layer: 2, order: 3,
      agent: 'external', feature: null,
      inputs: ['.ai / tickets / fitness / git'], outputs: ['dashboard/state.json'],
      dependsOn: [], files: ['.claude/skills/_build_share/project-state.py'], slices: [], invariants: [],
    },
  ];

  // mode vocabulary verbatim from the edge table
  const edges = [
    { from: 'RenderFlightDeck', to: 'ServeApiAndWs', mode: 'sync (fetch) + async (WS subscribe)', evidence: 'apps/web/src/api/client.ts:3-7 · ws/socket.ts:26', status: 'done' },
    { from: 'ServeApiAndWs', to: 'RunClaudeSessions', mode: 'sync', evidence: 'apps/server/src/routes/api.ts:16-22', status: 'done' },
    { from: 'ServeApiAndWs', to: 'DeriveProjectState', mode: 'sync', evidence: 'api.ts route handlers → state/*', status: 'done' },
    { from: 'RunClaudeSessions', to: 'IngestObservability', mode: 'async (PTY output, tailed files)', evidence: 'claude/transcriptTailer.ts:32-57', status: 'done' },
    { from: 'claudeCli', to: 'IngestObservability', mode: 'async (hook POSTs via curl)', evidence: 'claude/hookSettings.ts:44-46', status: 'done' },
    { from: 'IngestObservability', to: 'PersistAndBroadcast', mode: 'sync write → async fan-out', evidence: 'transcriptTailer.ts:8-10, bus.ts:6-9', status: 'done' },
    { from: 'DeriveProjectState', to: 'PersistAndBroadcast', mode: 'async (events)', evidence: 'state/watcher.ts:3', status: 'done' },
    { from: 'DeriveProjectState', to: 'projectStatePy', mode: 'sync (exec)', evidence: 'state/projectState.ts:39', status: 'done' },
    { from: 'ServeApiAndWs', to: 'ShareDomainModel', mode: 'compile-time', evidence: 'api.ts:2', status: 'done' },
    { from: 'RenderFlightDeck', to: 'ShareDomainModel', mode: 'compile-time', evidence: 'appStore.ts:3', status: 'done' },
    { from: 'DeriveProjectState', to: 'ShareDomainModel', mode: 'compile-time', evidence: 'stageModel.ts', status: 'done' },
    // planned (v2 orchestrator)
    { from: 'OrchestrateChain', to: 'ServeApiAndWs', mode: 'sync (read state, spawn sessions)', evidence: '(planned)', status: 'planned' },
    { from: 'OrchestrateChain', to: 'DeriveProjectState', mode: 'sync (read ProjectState)', evidence: '(planned)', status: 'planned' },
    { from: 'RenderFlightDeck', to: 'OrchestrateChain', mode: 'async (conductor UI)', evidence: '(planned)', status: 'planned' },
  ];

  // ---- SDLC stage progress (subset of stageModel.ts, with live status) ----
  const stages = [
    { id: 'onboard', title: 'Onboard', phase: 'foundation', status: 'done' },
    { id: 'anchor', title: 'Anchor', phase: 'foundation', status: 'done' },
    { id: 'explore', title: 'Explore', phase: 'foundation', status: 'done' },
    { id: 'comprehend', title: 'Comprehend', phase: 'foundation', status: 'done' },
    { id: 'architect', title: 'Architect', phase: 'foundation', status: 'done' },
    { id: 'feature-census', title: 'Feature Census', phase: 'foundation', status: 'done' },
    { id: 'test-strategy', title: 'Test Strategy', phase: 'foundation', status: 'done' },
    { id: 'pipeline', title: 'Pipeline', phase: 'foundation', status: 'done' },
    { id: 'prd', title: 'PRD', phase: 'per-feature', status: 'done' },
    { id: 'design', title: 'Design (LLD)', phase: 'per-feature', status: 'done' },
    { id: 'plan', title: 'Plan', phase: 'per-feature', status: 'done' },
    { id: 'to-issues', title: 'To Issues', phase: 'per-feature', status: 'done' },
    { id: 'publish-issues', title: 'Publish Issues', phase: 'per-feature', status: 'done' },
    { id: 'build', title: 'Build (queue)', phase: 'execution', status: 'in-progress' },
    { id: 'mtdd-implement', title: 'Implement', phase: 'execution', status: 'in-progress' },
    { id: 'mtdd-review', title: 'Review', phase: 'execution', status: 'pending' },
    { id: 'mtdd-verify', title: 'Verify', phase: 'execution', status: 'pending' },
    { id: 'mtdd-merge', title: 'Merge', phase: 'execution', status: 'pending' },
    { id: 'qa', title: 'QA Gate', phase: 'qa-release', status: 'pending' },
    { id: 'ship', title: 'Ship', phase: 'qa-release', status: 'pending' },
  ];

  // ---- Features (real shipped + planned/building for variety) ----
  const features = [
    {
      slug: 'observability-data-pruning', status: 'Shipped', tier: 'mvp', priority: 'P0',
      mapsToComponent: 'DeriveProjectState',
      slices: [
        { id: 'scc-m7w', title: 'storage-stats tracer', status: 'merged', mark: 'AFK' },
        { id: 'scc-b51', title: 'prune engine (chunked vacuum)', status: 'merged', mark: 'HITL' },
        { id: 'scc-0bb', title: 'prune-confirm UI', status: 'merged', mark: 'HITL' },
      ],
    },
    {
      slug: 'oldest-record-age', status: 'Shipped', tier: 'mvp', priority: 'P1',
      mapsToComponent: 'RenderFlightDeck',
      slices: [{ id: 'scc-sa4', title: 'formatRelativeAge + StoragePanel render', status: 'merged', mark: 'AFK' }],
    },
    {
      slug: 'architecture-tab', status: 'Building', tier: 'mvp', priority: 'P0',
      mapsToComponent: 'RenderFlightDeck',
      slices: [
        { id: 'scc-arc1', title: 'living-arch graph view', status: 'in-progress', mark: 'AFK' },
        { id: 'scc-arc2', title: 'component inspector panel', status: 'published', mark: 'AFK' },
        { id: 'scc-arc3', title: '/api/architecture endpoint + drift watch', status: 'planned', mark: 'HITL' },
      ],
    },
    {
      slug: 'cross-project-orchestrator', status: 'Planned', tier: 'mvp', priority: 'P0',
      mapsToComponent: 'OrchestrateChain',
      slices: [
        { id: 'scc-orc1', title: 'persistent verdict log', status: 'planned', mark: 'AFK' },
        { id: 'scc-orc2', title: 'portfolio next-move engine', status: 'planned', mark: 'AFK' },
        { id: 'scc-orc3', title: 'gated autopilot + hard stops', status: 'planned', mark: 'HITL' },
      ],
    },
    {
      slug: 'global-hooks-observe', status: 'Blocked', tier: 'mvp', priority: 'P2',
      mapsToComponent: 'IngestObservability',
      slices: [{ id: 'scc-gh2', title: 'observe sessions started outside the dashboard', status: 'blocked', mark: 'HITL' }],
    },
  ];

  // ---- Portfolio: this project + sibling projects (mock) ----
  const projects = [
    {
      id: 'scc', name: 'SDLC Command Center', type: 'brownfield', tier: 'mvp', current: true,
      foundationDone: 8, foundationTotal: 8, building: 1, shipped: 2, blocked: 1, planned: 1,
      liveSessions: 2, attention: 1, lastActivity: '2m ago',
      nextMove: '/mtdd-review architecture-tab', health: 'on-track',
    },
    {
      id: 'billing', name: 'acme-billing', type: 'greenfield', tier: 'production', current: false,
      foundationDone: 11, foundationTotal: 15, building: 2, shipped: 5, blocked: 0, planned: 4,
      liveSessions: 0, attention: 0, lastActivity: '3h ago',
      nextMove: '/threat-model late-fees', health: 'on-track',
    },
    {
      id: 'mktg', name: 'marketing-site', type: 'greenfield', tier: 'prototype', current: false,
      foundationDone: 4, foundationTotal: 6, building: 0, shipped: 9, blocked: 0, planned: 1,
      liveSessions: 1, attention: 0, lastActivity: '20m ago',
      nextMove: '/ship hero-redesign', health: 'on-track',
    },
    {
      id: 'telem', name: 'telemetry-pipeline', type: 'brownfield', tier: 'production', current: false,
      foundationDone: 5, foundationTotal: 5, building: 1, shipped: 3, blocked: 2, planned: 2,
      liveSessions: 0, attention: 2, lastActivity: '1d ago',
      nextMove: '/diagnose ingest-lag', health: 'at-risk',
    },
  ];

  // ---- Agent activity (live + recent sessions) ----
  const agents = [
    {
      id: 'sess-a1', skill: '/mtdd-implement', args: 'scc-arc1', status: 'running', component: 'RenderFlightDeck',
      model: 'opus-4.8', tokensIn: 184000, tokensOut: 22400, costUsd: 1.92, startedAt: '2m ago',
      subagents: [{ task: 'red: living-arch graph spec', model: 'opus-4.8', cost: 0.41 }],
    },
    {
      id: 'sess-a2', skill: '/qa', args: 'observability-data-pruning', status: 'running', component: 'DeriveProjectState',
      model: 'opus-4.8', tokensIn: 96000, tokensOut: 11200, costUsd: 0.88, startedAt: '6m ago',
      subagents: [{ task: 'verifier: grade qa-report vs criteria', model: 'opus-4.8', cost: 0.30 }],
    },
    {
      id: 'sess-a3', skill: '/ship', args: 'oldest-record-age', status: 'exited', component: 'RenderFlightDeck',
      model: 'opus-4.8', tokensIn: 42000, tokensOut: 5400, costUsd: 0.39, startedAt: '40m ago', verdict: 'SHIPPED',
      subagents: [],
    },
    {
      id: 'sess-a4', skill: '/mtdd-implement', args: 'scc-b51', status: 'attention', component: 'DeriveProjectState',
      model: 'opus-4.8', tokensIn: 120000, tokensOut: 14800, costUsd: 1.21, startedAt: '12m ago',
      attentionMsg: 'Confirm destructive VACUUM on live DB?', subagents: [],
    },
  ];

  // ---- Named data flows (for the Data Flow view) ----
  const dataflows = [
    { id: 'hook-ingest', label: 'Hook ingest', color: 'var(--blue)', path: ['claudeCli', 'IngestObservability', 'PersistAndBroadcast', 'ServeApiAndWs', 'RenderFlightDeck'], payload: 'PreToolUse → audit_event → WS' },
    { id: 'state-derive', label: 'State derivation', color: 'var(--green)', path: ['projectStatePy', 'DeriveProjectState', 'PersistAndBroadcast', 'ServeApiAndWs', 'RenderFlightDeck'], payload: 'fs-changed → state.json → state-changed' },
    { id: 'live-terminal', label: 'Live terminal', color: 'var(--amber)', path: ['RunClaudeSessions', 'ServeApiAndWs', 'RenderFlightDeck'], payload: 'PTY stdout → terminal-data' },
    { id: 'verdict-route', label: 'Verdict routing', color: 'var(--violet)', path: ['claudeCli', 'IngestObservability', 'DeriveProjectState', 'ServeApiAndWs', 'RenderFlightDeck'], payload: 'READY-FOR-QA → nextSkill=qa' },
  ];

  // ---- Orchestrator's current read (the conductor) ----
  const orchestrator = {
    projectId: 'scc',
    youAreHere: { phase: 'execution', stage: 'mtdd-implement', feature: 'architecture-tab', slice: 'scc-arc1' },
    confidence: 0.86,
    recommendation: {
      skill: 'mtdd-review', args: 'scc-arc1',
      rationale: 'Slice scc-arc1 last logged green: living-arch graph renders. Per-slice phase map routes green → /mtdd-review.',
      rule: 'next/SKILL.md §Phase 1 — per-slice phase: green → /mtdd-review',
    },
    alternative: { skill: 'mtdd-implement', args: 'scc-arc1', why: 'if review surfaces gaps, stay in implement' },
    blockers: [
      { feature: 'global-hooks-observe', reason: 'BLOCKED-ON: settings.json write needs human confirm', gate: 'HITL' },
      { feature: 'architecture-tab', reason: 'scc-arc3 (/api/architecture) waits on scc-arc1 merge', gate: 'dependency' },
    ],
    autopilot: { enabled: false, mode: 'suggest', gatesRespected: ['AFK-only', 'stop-at-HITL', 'stop-at-PR'] },
    digest: [
      'observability-data-pruning shipped ✓ (3/3 slices merged)',
      'oldest-record-age shipped ✓',
      'architecture-tab building — 1/3 slices in flight',
      'cross-project-orchestrator planned (P0) — awaiting /prd',
    ],
  };

  return { components, edges, stages, features, projects, agents, dataflows, orchestrator };
})();
