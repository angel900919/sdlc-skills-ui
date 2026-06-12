import { useMemo, useState } from 'react';
import { Box, Dialog, InputBase, List, ListItemButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useSkills, useSpawnSession, useTranscriptSearch } from '../api/hooks.js';

interface Command {
  id: string;
  label: string;
  hint: string;
  group: 'navigate' | 'skill' | 'search';
  run: () => void;
}

export function CommandPalette() {
  const open = useAppStore((s) => s.commandPaletteOpen);
  const setOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const projectId = useAppStore((s) => s.selectedProjectId);
  const navigate = useNavigate();
  const { data: skills } = useSkills(projectId);
  const spawn = useSpawnSession(projectId);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  // "? terms" searches transcripts instead of matching commands.
  const searchMode = query.startsWith('?');
  const searchQuery = searchMode ? query.slice(1).trim() : '';
  const { data: hits } = useTranscriptSearch(open && searchMode ? searchQuery : '', projectId);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      ['dashboard', 'Go to Dashboard'], ['pipeline', 'Go to Pipeline'], ['board', 'Go to Board'], ['workspace', 'Go to Workspace'],
      ['sessions', 'Go to Sessions'], ['docs', 'Go to Docs'], ['skills', 'Go to Skills'],
    ].map(([path, label]) => ({
      id: `nav-${path}`,
      label,
      hint: `/${path}`,
      group: 'navigate' as const,
      run: () => navigate(`/${path}`),
    }));
    const skillCmds: Command[] = (skills ?? []).map((s) => ({
      id: `skill-${s.name}`,
      label: `/${s.name}`,
      hint: s.description.slice(0, 90),
      group: 'skill' as const,
      run: () => {
        spawn.mutate(
          { prompt: `/${s.name}`, title: `/${s.name}` },
          { onSuccess: (session) => navigate(`/workspace/${session.id}`) },
        );
      },
    }));
    return [...nav, ...skillCmds];
  }, [skills, navigate, spawn]);

  const searchResults = useMemo<Command[]>(
    () =>
      (hits ?? []).map((h) => ({
        id: `hit-${h.uuid}`,
        label: h.sessionTitle.slice(0, 38),
        hint: h.snippet,
        group: 'search' as const,
        run: () => navigate(`/workspace/${h.sessionId}`),
      })),
    [hits, navigate],
  );

  const filtered = useMemo(() => {
    if (searchMode) return searchResults.slice(0, 14);
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 14);
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)).slice(0, 14);
  }, [commands, query, searchMode, searchResults]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setCursor(0);
  };

  const exec = (cmd: Command | undefined) => {
    if (!cmd) return;
    close();
    cmd.run();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { background: palette.surface, mt: -20 } } }}
    >
      <Box sx={{ p: 1.5, borderBottom: `1px solid ${palette.hairline}` }}>
        <InputBase
          autoFocus
          fullWidth
          placeholder="Type a command or skill… (?text searches transcripts)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); exec(filtered[cursor]); }
            if (e.key === 'Escape') close();
          }}
          sx={{ fontSize: 14, px: 1, fontFamily: '"IBM Plex Mono", monospace' }}
        />
      </Box>
      <List dense sx={{ maxHeight: 380, overflow: 'auto', py: 0.5 }}>
        {filtered.map((cmd, i) => (
          <ListItemButton key={cmd.id} selected={i === cursor} onClick={() => exec(cmd)} sx={{ py: 0.75 }}>
            <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1.5, width: '100%', minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace', fontSize: 13,
                  color: cmd.group === 'skill' ? palette.green : cmd.group === 'search' ? palette.violet : palette.blue,
                  flexShrink: 0,
                }}
              >
                {cmd.label}
              </Typography>
              <Typography noWrap sx={{ fontSize: 12, color: palette.muted, flex: 1 }}>
                {cmd.hint}
              </Typography>
              <Typography sx={{ ...microLabel, flexShrink: 0 }}>
                {cmd.group === 'skill' ? 'launch' : cmd.group === 'search' ? 'open' : 'nav'}
              </Typography>
            </Stack>
          </ListItemButton>
        ))}
        {filtered.length === 0 && (
          <Typography sx={{ p: 2, color: palette.muted, fontSize: 13 }}>
            {searchMode
              ? searchQuery.length < 2
                ? 'Keep typing to search transcripts…'
                : 'No transcript matches.'
              : 'No matches. Tip: start with ? to search transcripts.'}
          </Typography>
        )}
      </List>
    </Dialog>
  );
}
