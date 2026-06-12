import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton, InputBase,
  MenuItem, Select, Stack, Tab, Tabs, Tooltip, Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import ForkRightRoundedIcon from '@mui/icons-material/ForkRightRounded';
import type { PermissionMode } from '@sdlc/shared';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import {
  type LiveSession, useKillSession, useResumeSession, useSessions, useSpawnSession,
} from '../api/hooks.js';
import { TerminalView } from '../components/Terminal.js';
import { ChatView } from '../components/ChatView.js';
import { ActivityFeed } from '../components/ActivityFeed.js';
import { TraceView } from '../components/TraceView.js';
import { UsageStrip } from '../components/UsageStrip.js';
import { SubagentsView } from '../components/SubagentsView.js';
import { DiffView } from '../components/DiffView.js';
import { formatCostUsd } from '../lib/format.js';

const PERMISSION_MODE_LABELS: Record<PermissionMode, string> = {
  default: 'ask (default)',
  auto: 'auto mode',
  acceptEdits: 'accept edits',
  plan: 'plan mode',
  dontAsk: "don't ask",
  bypassPermissions: 'skip all (YOLO)',
};

function SessionRow({ s, active, onClick }: { s: LiveSession; active: boolean; onClick: () => void }) {
  const color = statusColor[s.status] ?? palette.muted;
  const attention = useAppStore((st) => st.attention[s.id]) ?? s.attention;
  const usage = useAppStore((st) => st.liveUsage[s.id]) ?? s.usage;
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1.5, py: 1, cursor: 'pointer', borderRadius: 1,
        background: active ? palette.raised : 'transparent',
        borderLeft: `2px solid ${attention ? palette.amber : active ? palette.green : 'transparent'}`,
        '&:hover': { background: palette.raised },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: s.status === 'running' ? `0 0 5px ${color}` : 'none' }} />
        <Typography sx={{ fontSize: 12.5, fontWeight: active ? 600 : 400, flex: 1, minWidth: 0 }} noWrap>
          {s.title}
        </Typography>
        {attention && (
          <Tooltip title={attention.message}>
            <PanToolRoundedIcon sx={{ fontSize: 13, color: palette.amber }} />
          </Tooltip>
        )}
        {s.worktreePath && (
          <Tooltip title={`Isolated worktree: ${s.worktreePath}`}>
            <ForkRightRoundedIcon sx={{ fontSize: 13, color: palette.violet }} />
          </Tooltip>
        )}
      </Stack>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.faint, mt: 0.25 }}>
        {s.createdAt.slice(5, 16).replace('T', ' ')} · {s.status}
        {usage && usage.messages > 0 ? ` · ${formatCostUsd(usage.estCostUsd)}` : ''}
      </Typography>
    </Box>
  );
}

export function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data: sessions, refetch } = useSessions(projectId);
  const spawn = useSpawnSession(projectId);
  const kill = useKillSession();
  const resume = useResumeSession();
  const [tab, setTab] = useState<'chat' | 'terminal' | 'activity' | 'trace' | 'agents' | 'diff'>('terminal');
  const [launchDraft, setLaunchDraft] = useState('');
  const [permissionMode, setPermissionMode] = useState<PermissionMode>('default');
  const [useWorktree, setUseWorktree] = useState(false);

  const current = useMemo(
    () => (sessions ?? []).find((s) => s.id === sessionId) ?? null,
    [sessions, sessionId],
  );
  const liveUsage = useAppStore((st) => (current ? st.liveUsage[current.id] : undefined));
  const usage = liveUsage ?? current?.usage ?? null;
  const attention = useAppStore((st) => (current ? st.attention[current.id] : undefined)) ?? current?.attention;

  // Auto-select the most recent session if none chosen.
  useEffect(() => {
    if (!sessionId && sessions?.length) navigate(`/workspace/${sessions[0].id}`, { replace: true });
  }, [sessionId, sessions, navigate]);

  const startSession = (prompt?: string, mode?: PermissionMode) => {
    spawn.mutate(
      {
        prompt: prompt || undefined,
        title: prompt || undefined,
        permissionMode: mode ?? permissionMode,
        useWorktree: useWorktree || undefined,
      },
      { onSuccess: (sess) => navigate(`/workspace/${sess.id}`) },
    );
  };

  // Start a session, consuming the launch draft as the initial prompt if present.
  const launchFromDraft = (mode?: PermissionMode) => {
    const prompt = launchDraft.trim();
    startSession(prompt || undefined, mode);
    if (prompt) setLaunchDraft('');
  };

  const live = !!current && (current.status === 'running' || current.status === 'starting');

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Session list */}
      <Box sx={{ width: 240, flexShrink: 0, borderRight: `1px solid ${palette.hairline}`, display: 'flex', flexDirection: 'column', background: palette.surface }}>
        <Stack direction="row" sx={{ alignItems: 'center', px: 1.5, py: 1.25 }}>
          <Typography sx={{ ...microLabel, flex: 1 }}>Sessions</Typography>
          <Tooltip title="New Claude session (uses the launch settings below)">
            <IconButton size="small" onClick={() => launchFromDraft()} disabled={spawn.isPending}>
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New session — skip ALL permissions (claude --dangerously-skip-permissions)">
            <IconButton size="small" onClick={() => launchFromDraft('bypassPermissions')} disabled={spawn.isPending} sx={{ color: palette.amber }}>
              <BoltRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack sx={{ gap: 0.75, px: 1.5, pb: 1 }}>
          <InputBase
            placeholder="/skill or prompt…"
            value={launchDraft}
            onChange={(e) => setLaunchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && launchDraft.trim()) {
                launchFromDraft(e.shiftKey ? 'bypassPermissions' : undefined);
              }
            }}
            sx={{
              fontSize: 12, fontFamily: '"IBM Plex Mono", monospace',
              background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1, px: 1, py: 0.4,
            }}
          />
          <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
            <Select
              size="small"
              value={permissionMode}
              onChange={(e) => setPermissionMode(e.target.value as PermissionMode)}
              sx={{ flex: 1, fontSize: 11, '& .MuiSelect-select': { py: 0.4 } }}
            >
              {(Object.keys(PERMISSION_MODE_LABELS) as PermissionMode[]).map((m) => (
                <MenuItem key={m} value={m} sx={{ fontSize: 11.5 }}>
                  {PERMISSION_MODE_LABELS[m]}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Run in an isolated git worktree (parallel slices don't collide)">
              <FormControlLabel
                sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 10.5, color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' } }}
                control={
                  <Checkbox
                    size="small"
                    checked={useWorktree}
                    onChange={(e) => setUseWorktree(e.target.checked)}
                    sx={{ p: 0.4, color: palette.faint, '&.Mui-checked': { color: palette.violet } }}
                  />
                }
                label="worktree"
              />
            </Tooltip>
          </Stack>
        </Stack>
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto', p: 0.75 }}>
          {(sessions ?? []).map((s) => (
            <SessionRow key={s.id} s={s} active={s.id === sessionId} onClick={() => navigate(`/workspace/${s.id}`)} />
          ))}
          {!sessions?.length && (
            <Typography sx={{ fontSize: 12, color: palette.muted, p: 1.5 }}>
              No sessions yet. Start one with ＋ or launch a skill from ⌘K.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Session detail */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {current ? (
          <>
            <Stack direction="row" sx={{ alignItems: 'center', px: 2, borderBottom: `1px solid ${palette.hairline}`, background: palette.surface }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons={false}>
                <Tab value="terminal" label="Terminal" />
                <Tab value="chat" label="Chat" />
                <Tab value="activity" label="Activity" />
                <Tab value="trace" label="Trace" />
                <Tab value="agents" label="Agents" />
                <Tab value="diff" label="Diff" />
              </Tabs>
              <Box sx={{ flex: 1 }} />
              {usage && <Box sx={{ mr: 1.5 }}><UsageStrip usage={usage} /></Box>}
              {attention && (
                <Tooltip title={attention.message}>
                  <Chip
                    size="small"
                    icon={<PanToolRoundedIcon sx={{ fontSize: 12 }} />}
                    label="needs you"
                    sx={{ color: palette.amber, background: `${palette.amber}18`, mr: 1, '& .MuiChip-icon': { color: palette.amber } }}
                  />
                </Tooltip>
              )}
              {current.permissionMode !== 'default' && (
                <Tooltip title={`Permission mode: ${PERMISSION_MODE_LABELS[current.permissionMode]}`}>
                  <Chip
                    size="small"
                    label={current.permissionMode === 'bypassPermissions' ? 'YOLO' : current.permissionMode}
                    sx={{ color: current.permissionMode === 'bypassPermissions' ? palette.amber : palette.blue, background: palette.raised, mr: 1 }}
                  />
                </Tooltip>
              )}
              <Chip
                size="small"
                label={current.status}
                sx={{ color: statusColor[current.status], background: `${statusColor[current.status]}18`, mr: 1.5 }}
              />
              <Tooltip title="Export transcript as Markdown">
                <IconButton size="small" component="a" href={`/api/sessions/${current.id}/export.md`} download>
                  <DownloadRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {live ? (
                <Tooltip title="Stop this session">
                  <IconButton size="small" color="error" onClick={() => kill.mutate(current.id, { onSuccess: () => void refetch() })}>
                    <StopRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ReplayRoundedIcon />}
                  onClick={() => resume.mutate(current.id, { onSuccess: () => void refetch() })}
                  disabled={resume.isPending}
                >
                  Resume
                </Button>
              )}
            </Stack>
            <Box sx={{ flex: 1, minHeight: 0, display: tab === 'terminal' ? 'block' : 'none' }}>
              {live ? (
                <TerminalView sessionId={current.id} />
              ) : (
                <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography sx={{ color: palette.muted, fontSize: 13 }}>
                    Session is {current.status}. Resume to reattach the live terminal.
                  </Typography>
                  <Typography sx={{ ...microLabel }}>
                    transcript stays available in the Chat tab
                  </Typography>
                </Stack>
              )}
            </Box>
            {tab === 'chat' && (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ChatView sessionId={current.id} live={live} />
              </Box>
            )}
            {tab === 'activity' && (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ActivityFeed sessionId={current.id} />
              </Box>
            )}
            {tab === 'trace' && (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <TraceView sessionId={current.id} live={live} />
              </Box>
            )}
            {tab === 'agents' && (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <SubagentsView sessionId={current.id} />
              </Box>
            )}
            {tab === 'diff' && (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <DiffView sessionId={current.id} live={live} />
              </Box>
            )}
          </>
        ) : (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 15, color: palette.muted }}>No session selected</Typography>
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => startSession()}>
                Start a Claude session
              </Button>
              <Tooltip title="claude --dangerously-skip-permissions">
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<BoltRoundedIcon />}
                  onClick={() => startSession(undefined, 'bypassPermissions')}
                >
                  Skip permissions
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
