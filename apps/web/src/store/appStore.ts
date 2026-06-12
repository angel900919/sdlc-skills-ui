import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuditEvent, HookEvent, ServerEvent, SessionAttention, SessionUsage } from '@sdlc/shared';
import { notifyDesktop } from '../lib/notify.js';

const LIVE_BUFFER = 400;
const VERDICT_BUFFER = 50;

export type VerdictEvent = Extract<ServerEvent, { type: 'verdict' }>;

interface AppState {
  selectedProjectId: string | null;
  selectProject: (id: string | null) => void;
  /** Live audit feed (newest first), fed by the WebSocket. */
  liveEvents: AuditEvent[];
  pushAudit: (e: AuditEvent) => void;
  /** Live hook events per session (newest first). */
  hookEvents: HookEvent[];
  pushHook: (e: HookEvent) => void;
  /** Live per-session usage rollups (fresher than the sessions query). */
  liveUsage: Record<string, SessionUsage>;
  setUsage: (sessionId: string, usage: SessionUsage) => void;
  /** Sessions currently blocked on the human. */
  attention: Record<string, SessionAttention>;
  setAttention: (sessionId: string, attention: SessionAttention | null) => void;
  /** Chain verdicts (newest first). */
  verdicts: VerdictEvent[];
  pushVerdict: (v: VerdictEvent) => void;
  /** Preview-pane URL per project (persisted). */
  previewUrls: Record<string, string>;
  setPreviewUrl: (projectId: string, url: string) => void;
  wsConnected: boolean;
  setWsConnected: (v: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedProjectId: null,
      selectProject: (id) => set({ selectedProjectId: id }),
      liveEvents: [],
      pushAudit: (e) => set((s) => ({ liveEvents: [e, ...s.liveEvents].slice(0, LIVE_BUFFER) })),
      hookEvents: [],
      pushHook: (e) => set((s) => ({ hookEvents: [e, ...s.hookEvents].slice(0, LIVE_BUFFER) })),
      liveUsage: {},
      setUsage: (sessionId, usage) => set((s) => ({ liveUsage: { ...s.liveUsage, [sessionId]: usage } })),
      attention: {},
      setAttention: (sessionId, attention) =>
        set((s) => {
          const next = { ...s.attention };
          if (attention) next[sessionId] = attention;
          else delete next[sessionId];
          return { attention: next };
        }),
      verdicts: [],
      pushVerdict: (v) => set((s) => ({ verdicts: [v, ...s.verdicts].slice(0, VERDICT_BUFFER) })),
      previewUrls: {},
      setPreviewUrl: (projectId, url) => set((s) => ({ previewUrls: { ...s.previewUrls, [projectId]: url } })),
      wsConnected: false,
      setWsConnected: (v) => set({ wsConnected: v }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
    }),
    {
      name: 'sdlc-command-center',
      partialize: (s) => ({ selectedProjectId: s.selectedProjectId, previewUrls: s.previewUrls }),
    },
  ),
);

/** Route a server event into the store (called once from App). */
export function dispatchServerEvent(event: ServerEvent) {
  const s = useAppStore.getState();
  switch (event.type) {
    case 'audit-event':
      s.pushAudit(event.event);
      break;
    case 'hook-event':
      s.pushHook(event.event);
      break;
    case 'session-usage':
      s.setUsage(event.sessionId, event.usage);
      break;
    case 'session-attention':
      s.setAttention(event.sessionId, event.attention);
      if (event.attention) {
        notifyDesktop('Claude is waiting for you', event.attention.message);
      }
      break;
    case 'verdict':
      s.pushVerdict(event);
      if (event.token === 'BLOCKED-ON') {
        notifyDesktop('Chain blocked', event.blockedReason ?? 'A chain run reported BLOCKED-ON');
      }
      break;
    default:
      break;
  }
}
