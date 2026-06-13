import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ArchitectureModel,
  AuditEvent,
  ClaudeSession,
  DocNode,
  GlobalHooksMutationResult,
  GlobalHooksStatus,
  MetricsSummary,
  PermissionMode,
  PrContext,
  Project,
  ProjectState,
  SearchHit,
  SessionAttention,
  SessionDiff,
  SessionPr,
  SessionRecap,
  SessionTrace,
  SessionUsage,
  SkillInfo,
  SubagentInfo,
  TranscriptMessage,
} from '@sdlc/shared';
import { api, del, post } from './client.js';

export type LiveSession = ClaudeSession & {
  live?: boolean;
  usage?: SessionUsage | null;
  attention?: SessionAttention | null;
  unseenCount?: number;
};

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: () => api<Project[]>('/api/projects') });
}

export function useAddProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { rootPath: string; name?: string }) => post<Project>('/api/projects', input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useRemoveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => del<{ ok: boolean }>(`/api/projects/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useProjectState(projectId: string | null) {
  return useQuery({
    queryKey: ['project-state', projectId],
    queryFn: () => api<{ project: Project; state: ProjectState | null }>(`/api/projects/${projectId}/state`),
    enabled: !!projectId,
    staleTime: 5_000,
  });
}

export function useArchitecture(projectId: string | null) {
  return useQuery({
    queryKey: ['architecture', projectId],
    queryFn: () => api<ArchitectureModel>(`/api/projects/${projectId}/architecture`),
    enabled: !!projectId,
    staleTime: 10_000,
  });
}

export function useSkills(projectId: string | null) {
  return useQuery({
    queryKey: ['skills', projectId],
    queryFn: () => api<SkillInfo[]>(`/api/projects/${projectId}/skills`),
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useDocsTree(projectId: string | null) {
  return useQuery({
    queryKey: ['docs', projectId],
    queryFn: () => api<DocNode[]>(`/api/projects/${projectId}/docs`),
    enabled: !!projectId,
    staleTime: 15_000,
  });
}

export function useDocFile(projectId: string | null, relPath: string | null) {
  return useQuery({
    queryKey: ['doc-file', projectId, relPath],
    queryFn: () =>
      api<{ content: string; relPath: string }>(
        `/api/projects/${projectId}/docs/file?path=${encodeURIComponent(relPath!)}`,
      ),
    enabled: !!projectId && !!relPath,
  });
}

export function useSessions(projectId?: string | null) {
  return useQuery({
    queryKey: ['sessions', projectId ?? 'all'],
    queryFn: () => api<LiveSession[]>(`/api/sessions${projectId ? `?projectId=${projectId}` : ''}`),
    refetchInterval: 10_000,
  });
}

export function useSpawnSession(projectId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      prompt?: string;
      title?: string;
      resumeSessionId?: string;
      permissionMode?: PermissionMode;
      useWorktree?: boolean;
    }) => post<ClaudeSession>(`/api/projects/${projectId}/sessions`, input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['sessions'] }),
  });
}

export function useSubagents(sessionId: string | null) {
  return useQuery({
    queryKey: ['subagents', sessionId],
    queryFn: () => api<SubagentInfo[]>(`/api/sessions/${sessionId}/agents`),
    enabled: !!sessionId,
    refetchInterval: 20_000,
  });
}

export function useSessionDiff(sessionId: string | null, base: string) {
  return useQuery({
    queryKey: ['session-diff', sessionId, base],
    queryFn: () => api<SessionDiff>(`/api/sessions/${sessionId}/diff?base=${encodeURIComponent(base)}`),
    enabled: !!sessionId && !!base,
    retry: false,
  });
}

export function useBranches(sessionId: string | null) {
  return useQuery({
    queryKey: ['branches', sessionId],
    queryFn: () => api<string[]>(`/api/sessions/${sessionId}/branches`),
    enabled: !!sessionId,
    staleTime: 60_000,
  });
}

export function usePrContext(sessionId: string | null, base: string, enabled: boolean) {
  return useQuery({
    queryKey: ['pr-context', sessionId, base],
    queryFn: () => api<PrContext>(`/api/sessions/${sessionId}/pr?base=${encodeURIComponent(base)}`),
    enabled: enabled && !!sessionId && !!base,
    retry: false,
  });
}

export function useCreatePr(sessionId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { base: string; title: string; body: string; draft?: boolean }) =>
      post<SessionPr>(`/api/sessions/${sessionId}/pr`, input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['pr-context', sessionId] }),
  });
}

export function useTranscriptSearch(query: string, projectId: string | null) {
  const q = query.trim();
  return useQuery({
    queryKey: ['search', q, projectId],
    queryFn: () =>
      api<SearchHit[]>(`/api/search?q=${encodeURIComponent(q)}${projectId ? `&projectId=${projectId}` : ''}`),
    enabled: q.length >= 2,
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  });
}

export function fetchSessionRecap(sessionId: string): Promise<SessionRecap> {
  return api<SessionRecap>(`/api/sessions/${sessionId}/recap`);
}

export function useMarkSessionSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => post<{ ok: boolean; lastSeenAt: string }>(`/api/sessions/${sessionId}/seen`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['sessions'] }),
  });
}

export function useSessionInput() {
  return useMutation({
    mutationFn: (input: { sessionId: string; data: string; submit?: boolean }) =>
      post<{ ok: boolean }>(`/api/sessions/${input.sessionId}/input`, { data: input.data, submit: input.submit }),
  });
}

export function useKillSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => post<{ ok: boolean }>(`/api/sessions/${sessionId}/kill`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['sessions'] }),
  });
}

export function useResumeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => post<ClaudeSession>(`/api/sessions/${sessionId}/resume`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['sessions'] }),
  });
}

export function useTranscript(sessionId: string | null) {
  return useQuery({
    queryKey: ['transcript', sessionId],
    queryFn: () => api<TranscriptMessage[]>(`/api/sessions/${sessionId}/transcript`),
    enabled: !!sessionId,
  });
}

export function useSessionTrace(sessionId: string | null) {
  return useQuery({
    queryKey: ['trace', sessionId],
    queryFn: () => api<SessionTrace>(`/api/sessions/${sessionId}/trace`),
    enabled: !!sessionId,
    refetchInterval: 15_000,
  });
}

export function useEvents(filter: { projectId?: string; sessionId?: string; kind?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (filter.projectId) params.set('projectId', filter.projectId);
  if (filter.sessionId) params.set('sessionId', filter.sessionId);
  if (filter.kind) params.set('kind', filter.kind);
  params.set('limit', String(filter.limit ?? 200));
  return useQuery({
    queryKey: ['events', filter],
    queryFn: () => api<AuditEvent[]>(`/api/events?${params.toString()}`),
    refetchInterval: 15_000,
  });
}

export function useGlobalHooks() {
  return useQuery({
    queryKey: ['global-hooks'],
    queryFn: () => api<GlobalHooksStatus>('/api/global-hooks'),
    staleTime: 10_000,
  });
}

export function useInstallGlobalHooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => post<GlobalHooksMutationResult>('/api/global-hooks/install'),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['global-hooks'] }),
  });
}

export function useUninstallGlobalHooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => post<GlobalHooksMutationResult>('/api/global-hooks/uninstall'),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['global-hooks'] }),
  });
}

export function useMetrics(projectId?: string | null) {
  return useQuery({
    queryKey: ['metrics', projectId ?? 'all'],
    queryFn: () => api<MetricsSummary>(`/api/metrics${projectId ? `?projectId=${projectId}` : ''}`),
    refetchInterval: 30_000,
  });
}
