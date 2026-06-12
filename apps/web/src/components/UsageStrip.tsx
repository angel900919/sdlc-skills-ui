import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import type { SessionUsage } from '@sdlc/shared';
import { palette } from '../theme.js';
import { formatCostUsd, formatTokens, shortModel } from '../lib/format.js';

/**
 * Compact session telemetry: context-window meter, token totals and the
 * API-equivalent cost. Cost is informational — interactive sessions bill
 * to the subscription, not per token.
 */
export function UsageStrip({ usage }: { usage: SessionUsage }) {
  if (usage.messages === 0) return null;
  const pct = Math.min(100, (usage.contextTokens / usage.contextWindow) * 100);
  const meterColor = pct > 85 ? palette.red : pct > 60 ? palette.amber : palette.blue;

  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      <Tooltip title={`Context: ${formatTokens(usage.contextTokens)} of ${formatTokens(usage.contextWindow)} tokens (${pct.toFixed(0)}%)`}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.muted }}>
            ctx
          </Typography>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              width: 56, height: 4, borderRadius: 2, background: palette.hairline,
              '& .MuiLinearProgress-bar': { background: meterColor, borderRadius: 2 },
            }}
          />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: meterColor }}>
            {pct.toFixed(0)}%
          </Typography>
        </Stack>
      </Tooltip>
      <Tooltip
        title={`in ${formatTokens(usage.inputTokens)} · out ${formatTokens(usage.outputTokens)} · cache read ${formatTokens(usage.cacheReadTokens)} · cache write ${formatTokens(usage.cacheWriteTokens)}`}
      >
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.muted }} noWrap>
          {formatTokens(usage.inputTokens + usage.cacheReadTokens + usage.cacheWriteTokens)}→{formatTokens(usage.outputTokens)}
        </Typography>
      </Tooltip>
      <Tooltip title="API-equivalent value (sessions bill to your subscription)">
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.green }}>
          {formatCostUsd(usage.estCostUsd)}
        </Typography>
      </Tooltip>
      {usage.model && (
        <Box sx={{ px: 0.6, py: 0.1, borderRadius: 0.75, border: `1px solid ${palette.hairline}` }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: palette.faint }}>
            {shortModel(usage.model)}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
