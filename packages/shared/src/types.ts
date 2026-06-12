/** Shared domain types for the SDLC Command Center. */

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  /** Absolute path to the project root on disk. */
  rootPath: string;
  createdAt: string;
  /** Last time any session/state activity was observed. */
  lastActivityAt: string | null;
}

// ---------------------------------------------------------------------------
// Claude sessions (interactive CLI driven through a PTY)
// ---------------------------------------------------------------------------

export type SessionStatus = 'starting' | 'running' | 'exited' | 'interrupted';

/** Mirrors the claude CLI's --permission-mode choices (bypassPermissions == --dangerously-skip-permissions). */
export type PermissionMode = 'default' | 'acceptEdits' | 'plan' | 'auto' | 'dontAsk' | 'bypassPermissions';

export interface ClaudeSession {
  id: string; // our internal id == the --session-id we pass to claude
  projectId: string;
  /** cwd the claude process runs in. */
  cwd: string;
  title: string;
  status: SessionStatus;
  pid: number | null;
  exitCode: number | null;
  /** The skill/prompt that launched the session, if any. */
  launchPrompt: string | null;
  createdAt: string;
  endedAt: string | null;
  /** Set when this session resumed an earlier one. */
  resumedFromSessionId: string | null;
  /** Permission mode the session was launched with; resume reuses it. */
  permissionMode: PermissionMode;
  /** Set when the session runs in an isolated git worktree. */
  worktreePath: string | null;
  /** Recap cursor: when the user last viewed this session in the UI. */
  lastSeenAt: string | null;
}

/** "Blocked on you" state — set by Notification hooks, cleared by activity. */
export interface SessionAttention {
  sessionId: string;
  message: string;
  since: string;
}

// ---------------------------------------------------------------------------
// Transcript messages (parsed from ~/.claude/projects/<dir>/<session>.jsonl)
// ---------------------------------------------------------------------------

export type TranscriptRole = 'user' | 'assistant' | 'system';

export interface TranscriptContentBlock {
  type: 'text' | 'tool_use' | 'tool_result' | 'thinking' | string;
  text?: string;
  /** tool_use */
  id?: string;
  name?: string;
  input?: unknown;
  /** tool_result */
  tool_use_id?: string;
  content?: unknown;
  is_error?: boolean;
}

export interface TranscriptMessage {
  uuid: string;
  sessionId: string;
  role: TranscriptRole;
  timestamp: string;
  blocks: TranscriptContentBlock[];
  /** Raw entry type from the jsonl line (user | assistant | system | summary…). */
  entryType: string;
}

// ---------------------------------------------------------------------------
// Hook events (Claude Code hooks POSTed to the backend)
// ---------------------------------------------------------------------------

export type HookEventName =
  | 'SessionStart'
  | 'SessionEnd'
  | 'UserPromptSubmit'
  | 'PreToolUse'
  | 'PostToolUse'
  | 'Stop'
  | 'SubagentStop'
  | 'Notification'
  | string;

export interface HookEvent {
  id: number;
  receivedAt: string;
  hookEventName: HookEventName;
  sessionId: string | null;
  cwd: string | null;
  toolName: string | null;
  /** Full original payload as received from the hook. */
  payload: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Global hook install (opt-in observation of sessions started outside the
// dashboard, via the user's ~/.claude/settings.json)
// ---------------------------------------------------------------------------

export type GlobalHooksInstallState =
  | 'installed'
  | 'partially-installed'
  | 'not-installed'
  | 'file-missing';

export interface GlobalHooksStatus {
  state: GlobalHooksInstallState;
  /** Absolute path of the user settings file we read/write. */
  settingsPath: string;
  installedEvents: string[];
  missingEvents: string[];
  /** Most recent settings.json.bak-<ISO> backup, if any. */
  lastBackupPath: string | null;
  /** Set when the settings file exists but could not be parsed. */
  error?: string;
}

export interface GlobalHooksMutationResult {
  status: GlobalHooksStatus;
  /** Whether the settings file was actually modified. */
  changed: boolean;
  /** Backup written before the first-ever modification (or the existing one). */
  backupPath: string | null;
  /** True when this call created the backup. */
  backupCreated: boolean;
}

// ---------------------------------------------------------------------------
// Audit / activity events (unified observability stream)
// ---------------------------------------------------------------------------

export type AuditSource = 'hook' | 'transcript' | 'server' | 'user' | 'fs';

export interface AuditEvent {
  id: number;
  at: string;
  source: AuditSource;
  kind: string; // e.g. tool_use, prompt, session_started, artifact_changed, api_request
  projectId: string | null;
  sessionId: string | null;
  summary: string;
  detail: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Skills catalog
// ---------------------------------------------------------------------------

export interface SkillInfo {
  /** Directory name == slash command name. */
  name: string;
  description: string;
  /** SDLC phase assigned by the stage model (or 'utility'). */
  phase: string;
  path: string;
  argumentHint: string | null;
  hasReferences: boolean;
}

// ---------------------------------------------------------------------------
// Project state (superset of dashboard/state.json from project-state.py)
// ---------------------------------------------------------------------------

export interface FoundationStepState {
  present: boolean;
  [k: string]: unknown;
}

export interface FeatureSliceState {
  id: string;
  feature: string;
  title: string;
  status: 'planned' | 'published' | 'blocked' | 'in-progress' | 'merged' | 'removed' | string;
  rawStatus: string;
  type: string;
  priority: string;
  dependsOn: string[];
  backendRefs: Record<string, string>;
  file: string;
  lastActivity: string | null;
}

export interface FeatureState {
  slug: string;
  status: 'Planned' | 'Building' | 'QA-Approved' | 'Shipped' | 'Blocked' | 'Cut' | 'Unknown' | string;
  priority: string;
  prdLink: string | null;
  specs: Record<string, boolean>;
  slices: FeatureSliceState[];
  lastActivity: string | null;
  lastActivityDate: string | null;
}

export interface ProgressEntry {
  date: string;
  skill: string;
  scope: string;
}

export interface ProjectState {
  root: string;
  projectName: string;
  generatedAt: string;
  generatedAtSha: string | null;
  foundation: {
    discover: FoundationStepState & { files: string[] };
    understand: FoundationStepState & { files: string[]; hasContext: boolean };
    eventStorm: FoundationStepState;
    featureMap: FoundationStepState;
    anchor: FoundationStepState & { tier: string; projectType: string; language: string };
    dddStrategy: FoundationStepState;
    architect: FoundationStepState & { bundled: boolean; adrCount: number };
    bootstrap: FoundationStepState & { complete: boolean };
    explore: FoundationStepState;
    [k: string]: FoundationStepState;
  };
  features: FeatureState[];
  fitness: { projectScope: string[]; perFeature: Record<string, string[]>; hasCodeowners: boolean };
  progressTail: ProgressEntry[];
  recentCommits: { sha: string; date: string; subject: string }[];
  recentlyModified: { path: string; mtime: string }[];
  nextActions: string[];
}

// ---------------------------------------------------------------------------
// Docs browser
// ---------------------------------------------------------------------------

export interface DocNode {
  name: string;
  /** Path relative to project root. */
  relPath: string;
  type: 'dir' | 'file';
  children?: DocNode[];
}

// ---------------------------------------------------------------------------
// WebSocket protocol (server -> client)
// ---------------------------------------------------------------------------

export type ServerEvent =
  | { type: 'terminal-data'; sessionId: string; data: string }
  | { type: 'session-update'; session: ClaudeSession }
  | { type: 'transcript-message'; message: TranscriptMessage }
  | { type: 'hook-event'; event: HookEvent }
  | { type: 'audit-event'; event: AuditEvent }
  | { type: 'state-changed'; projectId: string }
  | { type: 'fs-changed'; projectId: string; paths: string[] }
  | { type: 'session-usage'; sessionId: string; usage: import('./usage.js').SessionUsage }
  | { type: 'session-attention'; sessionId: string; attention: SessionAttention | null }
  | { type: 'verdict'; projectId: string | null; sessionId: string; token: string; nextSkill: string | null; blockedReason: string | null };

/** Client -> server over the same socket. */
export type ClientEvent =
  | { type: 'subscribe'; topics: string[] }
  | { type: 'terminal-input'; sessionId: string; data: string }
  | { type: 'terminal-resize'; sessionId: string; cols: number; rows: number };

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export interface MetricsSummary {
  sessionsTotal: number;
  sessionsActive: number;
  hookEventsTotal: number;
  toolCallsTotal: number;
  toolCallsByName: Record<string, number>;
  promptsTotal: number;
  sessionsByDay: { day: string; count: number }[];
  avgSessionMinutes: number | null;
  /** Skill launches (slash commands) ranked by frequency. */
  skillLeaderboard: { skill: string; count: number }[];
  /** 90-day activity heatmap: sessions + prompts per day. */
  activityByDay: { day: string; sessions: number; prompts: number }[];
  /** File mutations observed via PostToolUse Edit/Write/NotebookEdit hooks. */
  fileEditsTotal: number;
  /** Sum of per-session token usage (main transcripts). */
  tokens: { input: number; output: number; cacheRead: number; cacheWrite: number };
  /** API-equivalent value of all tracked sessions; null if any model is unpriced. */
  estCostUsd: number | null;
}

// ---------------------------------------------------------------------------
// Subagents (parsed from <transcriptDir>/<sessionId>/subagents/agent-*.jsonl)
// ---------------------------------------------------------------------------

export interface SubagentInfo {
  agentId: string;
  /** First user message of the agent transcript — the task prompt. */
  task: string;
  model: string | null;
  messages: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  estCostUsd: number | null;
  startedAt: string | null;
}

// ---------------------------------------------------------------------------
// Diff review
// ---------------------------------------------------------------------------

export interface SessionDiff {
  base: string;
  /** Unified diff text (may be large; capped server-side). */
  diff: string;
  files: import('./diffStat.js').DiffFileStat[];
  truncated: boolean;
}

// ---------------------------------------------------------------------------
// PR flow (session branch → GitHub pull request, human-gated)
// ---------------------------------------------------------------------------

/** A pull request created from a session's branch. */
export interface SessionPr {
  sessionId: string;
  branch: string;
  base: string;
  number: number | null;
  url: string;
  title: string;
  createdAt: string;
}

/** Everything the PR dialog needs to render the draft-and-confirm flow. */
export interface PrContext {
  branch: string;
  base: string;
  commits: import('./prDraft.js').PrCommit[];
  files: import('./diffStat.js').DiffFileStat[];
  draft: import('./prDraft.js').PrDraft;
  /** PR already created from this session, if any. */
  existing: SessionPr | null;
  /** Human-readable reasons creation is currently impossible (empty = go). */
  blockers: string[];
}

// ---------------------------------------------------------------------------
// Transcript full-text search
// ---------------------------------------------------------------------------

export interface SearchHit {
  sessionId: string;
  sessionTitle: string;
  projectId: string | null;
  uuid: string;
  role: string;
  timestamp: string;
  /** Match snippet with [match] … markers already applied. */
  snippet: string;
}
