import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuditEvent, HookEvent, ServerEvent } from '@sdlc/shared';

const LIVE_BUFFER = 400;

interface AppState {
  selectedProjectId: string | null;
  selectProject: (id: string | null) => void;
  /** Live audit feed (newest first), fed by the WebSocket. */
  liveEvents: AuditEvent[];
  pushAudit: (e: AuditEvent) => void;
  /** Live hook events per session (newest first). */
  hookEvents: HookEvent[];
  pushHook: (e: HookEvent) => void;
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
      wsConnected: false,
      setWsConnected: (v) => set({ wsConnected: v }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
    }),
    {
      name: 'sdlc-command-center',
      partialize: (s) => ({ selectedProjectId: s.selectedProjectId }),
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
    default:
      break;
  }
}
