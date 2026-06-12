import { useEffect, useRef, useState } from 'react';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import type { SessionRecap } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { fetchSessionRecap, useMarkSessionSeen } from '../api/hooks.js';

/**
 * "While you were away" strip. Fetches the recap accumulated since the
 * session was last viewed, then rolls the seen-cursor forward — on mount
 * (you just opened it) and on unmount (you watched it live until now).
 */
export function RecapBanner({ sessionId }: { sessionId: string }) {
  const [recap, setRecap] = useState<SessionRecap | null>(null);
  const markSeen = useMarkSessionSeen();
  const markSeenRef = useRef(markSeen.mutate);
  markSeenRef.current = markSeen.mutate;

  useEffect(() => {
    let cancelled = false;
    setRecap(null);
    fetchSessionRecap(sessionId)
      .then((r) => {
        if (!cancelled && r.activityCount > 0) setRecap(r);
        markSeenRef.current(sessionId);
      })
      .catch(() => {
        /* recap is decoration — never block the workspace on it */
      });
    return () => {
      cancelled = true;
      markSeenRef.current(sessionId);
    };
  }, [sessionId]);

  if (!recap) return null;

  const counts = [
    recap.prompts > 0 && `${recap.prompts} prompt${recap.prompts > 1 ? 's' : ''}`,
    recap.assistantTurns > 0 && `${recap.assistantTurns} repl${recap.assistantTurns > 1 ? 'ies' : 'y'}`,
    recap.toolCalls > 0 && `${recap.toolCalls} tool call${recap.toolCalls > 1 ? 's' : ''}`,
    recap.commandsRun > 0 && `${recap.commandsRun} command${recap.commandsRun > 1 ? 's' : ''}`,
    recap.filesEdited.length > 0 && `${recap.filesEdited.length} file${recap.filesEdited.length > 1 ? 's' : ''} edited`,
  ].filter(Boolean) as string[];

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center', gap: 1.25, px: 2, py: 0.75,
        borderBottom: `1px solid ${palette.hairline}`,
        background: `${palette.blue}0D`,
      }}
    >
      <UpdateRoundedIcon sx={{ fontSize: 15, color: palette.blue }} />
      <Typography sx={{ ...microLabel, color: palette.blue }}>While you were away</Typography>
      <Typography sx={{ fontSize: 12, color: palette.text }}>{counts.join(' · ') || 'activity recorded'}</Typography>
      {recap.verdicts.map((v) => (
        <Chip
          key={v.token}
          size="small"
          label={v.token === 'BLOCKED-ON' ? `BLOCKED-ON ${v.blockedReason ?? ''}`.trim() : v.token}
          sx={{
            height: 18, fontSize: 10, fontFamily: '"IBM Plex Mono", monospace',
            color: v.token === 'BLOCKED-ON' ? palette.red : palette.green,
            background: v.token === 'BLOCKED-ON' ? `${palette.red}18` : `${palette.green}18`,
          }}
        />
      ))}
      {recap.lastAssistantText && (
        <Tooltip title={recap.lastAssistantText}>
          <Typography sx={{ fontSize: 11.5, color: palette.muted, flex: 1, minWidth: 0, fontStyle: 'italic' }} noWrap>
            “{recap.lastAssistantText}”
          </Typography>
        </Tooltip>
      )}
      {!recap.lastAssistantText && <Box sx={{ flex: 1 }} />}
      <IconButton size="small" onClick={() => setRecap(null)} sx={{ p: 0.25 }}>
        <CloseRoundedIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Stack>
  );
}
