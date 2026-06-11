import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Chip, Divider, IconButton, InputBase, Stack, Tab, Tabs, Tooltip, Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import {
  type LiveSession, useKillSession, useResumeSession, useSessions, useSpawnSession,
} from '../api/hooks.js';
import { TerminalView } from '../components/Terminal.js';
import { ChatView } from '../components/ChatView.js';
import { ActivityFeed } from '../components/ActivityFeed.js';

function SessionRow({ s, active, onClick }: { s: LiveSession; active: boolean; onClick: () => void }) {
  const color = statusColor[s.status] ?? palette.muted;
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1.5, py: 1, cursor: 'pointer', borderRadius: 1,
        background: active ? palette.raised : 'transparent',
        borderLeft: `2px solid ${active ? palette.green : 'transparent'}`,
        '&:hover': { background: palette.raised },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: s.status === 'running' ? `0 0 5px ${color}` : 'none' }} />
        <Typography sx={{ fontSize: 12.5, fontWeight: active ? 600 : 400, flex: 1, minWidth: 0 }} noWrap>
          {s.title}
        </Typography>
      </Stack>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.faint, mt: 0.25 }}>
        {s.createdAt.slice(5, 16).replace('T', ' ')} · {s.status}
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
  const [tab, setTab] = useState<'chat' | 'terminal' | 'activity'>('terminal');
  const [launchDraft, setLaunchDraft] = useState('');

  const current = useMemo(
    () => (sessions ?? []).find((s) => s.id === sessionId) ?? null,
    [sessions, sessionId],
  );

  // Auto-select the most recent session if none chosen.
  useEffect(() => {
    if (!sessionId && sessions?.length) navigate(`/workspace/${sessions[0].id}`, { replace: true });
  }, [sessionId, sessions, navigate]);

  const startSession = (prompt?: string) => {
    spawn.mutate(
      { prompt: prompt || undefined, title: prompt || undefined },
      { onSuccess: (sess) => navigate(`/workspace/${sess.id}`) },
    );
  };

  const live = !!current && (current.status === 'running' || current.status === 'starting');

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Session list */}
      <Box sx={{ width: 240, flexShrink: 0, borderRight: `1px solid ${palette.hairline}`, display: 'flex', flexDirection: 'column', background: palette.surface }}>
        <Stack direction="row" sx={{ alignItems: 'center', px: 1.5, py: 1.25 }}>
          <Typography sx={{ ...microLabel, flex: 1 }}>Sessions</Typography>
          <Tooltip title="New Claude session">
            <IconButton size="small" onClick={() => startSession()} disabled={spawn.isPending}>
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" sx={{ gap: 0.5, px: 1.5, pb: 1 }}>
          <InputBase
            placeholder="/skill or prompt…"
            value={launchDraft}
            onChange={(e) => setLaunchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && launchDraft.trim()) {
                startSession(launchDraft.trim());
                setLaunchDraft('');
              }
            }}
            sx={{
              flex: 1, fontSize: 12, fontFamily: '"IBM Plex Mono", monospace',
              background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1, px: 1, py: 0.4,
            }}
          />
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
              <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab value="terminal" label="Terminal" />
                <Tab value="chat" label="Chat" />
                <Tab value="activity" label="Activity" />
              </Tabs>
              <Box sx={{ flex: 1 }} />
              <Chip
                size="small"
                label={current.status}
                sx={{ color: statusColor[current.status], background: `${statusColor[current.status]}18`, mr: 1.5 }}
              />
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
          </>
        ) : (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 15, color: palette.muted }}>No session selected</Typography>
            <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => startSession()}>
              Start a Claude session
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
