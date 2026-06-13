import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Chip, Divider, FormControl, IconButton, MenuItem, Select, Stack, Tooltip, Typography,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import KeyboardCommandKeyRoundedIcon from '@mui/icons-material/KeyboardCommandKeyRounded';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useAddProject, useProjects, useSessions } from '../api/hooks.js';
import { CommandPalette } from './CommandPalette.js';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: <GridViewRoundedIcon fontSize="small" /> },
  { path: '/pipeline', label: 'Pipeline', icon: <AccountTreeRoundedIcon fontSize="small" /> },
  { path: '/architecture', label: 'Architecture', icon: <SchemaRoundedIcon fontSize="small" /> },
  { path: '/board', label: 'Board', icon: <ViewKanbanRoundedIcon fontSize="small" /> },
  { path: '/workspace', label: 'Workspace', icon: <TerminalRoundedIcon fontSize="small" /> },
  { path: '/sessions', label: 'Sessions', icon: <HistoryRoundedIcon fontSize="small" /> },
  { path: '/docs', label: 'Docs', icon: <MenuBookRoundedIcon fontSize="small" /> },
  { path: '/skills', label: 'Skills', icon: <AutoAwesomeRoundedIcon fontSize="small" /> },
];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <Typography sx={{ ...microLabel, color: palette.faint }}>
      {now.toLocaleTimeString('en-GB')}
    </Typography>
  );
}

export function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const selectProject = useAppStore((s) => s.selectProject);
  const wsConnected = useAppStore((s) => s.wsConnected);
  const setPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const addProject = useAddProject();
  const { data: sessions } = useSessions();

  // Default project selection once projects load.
  useEffect(() => {
    if (projects?.length && (!selectedProjectId || !projects.some((p) => p.id === selectedProjectId))) {
      selectProject(projects[0].id);
    }
  }, [projects, selectedProjectId, selectProject]);

  // Cmd+K command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setPaletteOpen]);

  const activeSessions = useMemo(
    () => (sessions ?? []).filter((s) => s.status === 'running' || s.status === 'starting').length,
    [sessions],
  );
  const liveAttention = useAppStore((s) => s.attention);
  const attentionCount = useMemo(() => {
    const ids = new Set(Object.keys(liveAttention));
    for (const s of sessions ?? []) if (s.attention) ids.add(s.id);
    return ids.size;
  }, [liveAttention, sessions]);

  const onAddProject = () => {
    const rootPath = window.prompt('Absolute path of the project to manage:');
    if (rootPath?.trim()) addProject.mutate({ rootPath: rootPath.trim() });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left rail */}
      <Box
        sx={{
          width: 196, flexShrink: 0, borderRight: `1px solid ${palette.hairline}`,
          display: 'flex', flexDirection: 'column', background: palette.surface,
        }}
      >
        <Box sx={{ px: 2, py: 2 }}>
          <Typography sx={{ ...microLabel, color: palette.green }}>SDLC</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>
            Command Center
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 1.5, py: 1.5 }}>
          <Typography sx={{ ...microLabel, px: 0.5, pb: 0.75 }}>Project</Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <FormControl size="small" fullWidth>
              <Select
                value={selectedProjectId && projects?.some((p) => p.id === selectedProjectId) ? selectedProjectId : ''}
                onChange={(e) => selectProject(e.target.value)}
                displayEmpty
                sx={{ fontSize: 12.5 }}
              >
                {(projects ?? []).map((p) => (
                  <MenuItem key={p.id} value={p.id} sx={{ fontSize: 12.5 }}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Register a project directory">
              <IconButton size="small" onClick={onAddProject}>
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Stack sx={{ px: 1, gap: 0.25, flex: 1 }}>
          {NAV.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, py: 0.9,
                  borderRadius: 1, cursor: 'pointer', userSelect: 'none',
                  color: active ? palette.text : palette.muted,
                  background: active ? palette.raised : 'transparent',
                  borderLeft: `2px solid ${active ? palette.green : 'transparent'}`,
                  '&:hover': { background: palette.raised, color: palette.text },
                  transition: 'background 120ms, color 120ms',
                }}
              >
                {item.icon}
                <Typography sx={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1 }}>{item.label}</Typography>
                {item.path === '/workspace' && attentionCount > 0 && (
                  <Box
                    sx={{
                      minWidth: 16, height: 16, px: 0.5, borderRadius: 1,
                      background: palette.amber, color: palette.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, fontFamily: '"IBM Plex Mono", monospace',
                      boxShadow: `0 0 8px ${palette.amber}66`,
                    }}
                  >
                    {attentionCount}
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
        <Divider />
        <Stack sx={{ px: 2, py: 1.5, gap: 0.75 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 7, height: 7, borderRadius: '50%',
                background: wsConnected ? palette.green : palette.red,
                boxShadow: wsConnected ? `0 0 6px ${palette.green}` : 'none',
              }}
            />
            <Typography sx={{ ...microLabel }}>{wsConnected ? 'Link up' : 'Link down'}</Typography>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" sx={{ gap: 0.5 }}>
              <Chip
                size="small"
                label={`${activeSessions} active`}
                sx={{ color: activeSessions ? palette.green : palette.muted, background: palette.raised }}
              />
              {attentionCount > 0 && (
                <Tooltip title={`${attentionCount} session${attentionCount > 1 ? 's' : ''} waiting on you`}>
                  <Chip
                    size="small"
                    label={`${attentionCount} ✋`}
                    onClick={() => navigate('/workspace')}
                    sx={{ color: palette.bg, background: palette.amber, fontWeight: 700, cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
            </Stack>
            <Clock />
          </Stack>
        </Stack>
      </Box>

      {/* Main column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          sx={{
            height: 44, flexShrink: 0, borderBottom: `1px solid ${palette.hairline}`,
            display: 'flex', alignItems: 'center', px: 2, gap: 2, background: palette.surface,
          }}
        >
          <Typography sx={{ ...microLabel }}>
            {NAV.find((n) => location.pathname.startsWith(n.path))?.label ?? ''}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Command palette (⌘K)">
            <IconButton size="small" onClick={() => setPaletteOpen(true)}>
              <KeyboardCommandKeyRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <Outlet />
        </Box>
      </Box>
      <CommandPalette />
    </Box>
  );
}
