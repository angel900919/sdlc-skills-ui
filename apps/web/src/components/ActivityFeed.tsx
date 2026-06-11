import { useMemo } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import type { AuditEvent } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useEvents } from '../api/hooks.js';

const KIND_COLOR: [RegExp, string][] = [
  [/^hook_PreToolUse|^hook_PostToolUse/, palette.blue],
  [/^hook_UserPromptSubmit|^prompt/, palette.violet],
  [/^session_started|^session_resumed|^hook_SessionStart/, palette.green],
  [/^session_exited|^hook_SessionEnd|^session_interrupted/, palette.amber],
  [/^artifact_changed/, palette.amber],
  [/error|fail/i, palette.red],
];

function colorFor(kind: string): string {
  for (const [re, color] of KIND_COLOR) if (re.test(kind)) return color;
  return palette.muted;
}

function shortKind(kind: string): string {
  return kind.replace(/^hook_/, '').replace(/_/g, ' ').toUpperCase();
}

function Row({ e }: { e: AuditEvent }) {
  const time = e.at.slice(11, 19);
  return (
    <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1.25, py: 0.4, px: 1, '&:hover': { background: palette.raised } }}>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.faint, flexShrink: 0 }}>
        {time}
      </Typography>
      <Tooltip title={e.kind}>
        <Typography
          sx={{
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.06em',
            color: colorFor(e.kind), flexShrink: 0, width: 118, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {shortKind(e.kind)}
        </Typography>
      </Tooltip>
      <Typography noWrap sx={{ fontSize: 12, color: palette.text, minWidth: 0 }}>
        {e.summary}
      </Typography>
    </Stack>
  );
}

/**
 * Flight-recorder log: merges the REST snapshot with live WebSocket events.
 */
export function ActivityFeed({
  projectId,
  sessionId,
  maxRows = 80,
  height,
}: {
  projectId?: string;
  sessionId?: string;
  maxRows?: number;
  height?: number | string;
}) {
  const live = useAppStore((s) => s.liveEvents);
  const { data: snapshot } = useEvents({ projectId, sessionId, limit: maxRows });

  const rows = useMemo(() => {
    const filteredLive = live.filter(
      (e) => (!projectId || e.projectId === projectId) && (!sessionId || e.sessionId === sessionId),
    );
    const seen = new Set<number>();
    const merged: AuditEvent[] = [];
    for (const e of [...filteredLive, ...(snapshot ?? [])]) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      merged.push(e);
    }
    return merged.sort((a, b) => b.id - a.id).slice(0, maxRows);
  }, [live, snapshot, projectId, sessionId, maxRows]);

  return (
    <Box sx={{ height: height ?? '100%', overflow: 'auto', minHeight: 0 }}>
      {rows.length === 0 ? (
        <Typography sx={{ ...microLabel, p: 2 }}>No activity yet</Typography>
      ) : (
        rows.map((e) => <Row key={e.id} e={e} />)
      )}
    </Box>
  );
}
