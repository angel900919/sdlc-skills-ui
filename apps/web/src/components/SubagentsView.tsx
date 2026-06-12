import { Box, Stack, Typography } from '@mui/material';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import { palette, microLabel } from '../theme.js';
import { useSubagents } from '../api/hooks.js';
import { formatCostUsd, formatTokens, shortModel } from '../lib/format.js';

/** Subagent breakdown for a session: task, model, tokens, est. cost. */
export function SubagentsView({ sessionId }: { sessionId: string }) {
  const { data: agents, isLoading } = useSubagents(sessionId);

  if (isLoading) {
    return <Typography sx={{ p: 3, color: palette.muted, fontSize: 13 }}>Loading subagents…</Typography>;
  }
  if (!agents?.length) {
    return (
      <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <AccountTreeRoundedIcon sx={{ color: palette.faint, fontSize: 28 }} />
        <Typography sx={{ color: palette.muted, fontSize: 13 }}>
          No subagents spawned in this session yet.
        </Typography>
      </Stack>
    );
  }

  const totalCost = agents.every((a) => a.estCostUsd !== null)
    ? agents.reduce((sum, a) => sum + (a.estCostUsd ?? 0), 0)
    : null;

  return (
    <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
        <Typography sx={{ ...microLabel }}>Subagents · {agents.length}</Typography>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.green }}>
          {formatCostUsd(totalCost)} total
        </Typography>
      </Stack>
      <Stack sx={{ gap: 1 }}>
        {agents.map((a) => (
          <Box
            key={a.agentId}
            sx={{ p: 1.5, background: palette.surface, border: `1px solid ${palette.hairline}`, borderRadius: 1.5 }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: palette.violet }} />
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: palette.muted }}>
                agent-{a.agentId.slice(0, 8)}
              </Typography>
              {a.model && (
                <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.faint, border: `1px solid ${palette.hairline}`, borderRadius: 0.5, px: 0.5 }}>
                  {shortModel(a.model)}
                </Typography>
              )}
              <Box sx={{ flex: 1 }} />
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: palette.muted }}>
                {formatTokens(a.inputTokens + a.cacheReadTokens + a.cacheWriteTokens)}→{formatTokens(a.outputTokens)}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: palette.green }}>
                {formatCostUsd(a.estCostUsd)}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 12.5, color: palette.text }}>
              {a.task || '(no task prompt found)'}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
