import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import { useNavigate } from 'react-router-dom';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useMetrics, useSessions } from '../api/hooks.js';
import { GlobalHooksPanel } from '../components/GlobalHooksPanel.js';
import { formatCostUsd, formatTokens } from '../lib/format.js';

export function SessionsPage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data: sessions } = useSessions(projectId);
  const { data: metrics } = useMetrics(projectId);
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2.5 }}>
      <Typography variant="h1" sx={{ mb: 2 }}>Session history</Typography>

      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, mb: 2 }}>
        {[
          { label: 'Total sessions', value: metrics?.sessionsTotal ?? 0 },
          { label: 'Active now', value: metrics?.sessionsActive ?? 0, color: palette.green },
          { label: 'Prompts', value: metrics?.promptsTotal ?? 0 },
          { label: 'Tool calls', value: metrics?.toolCallsTotal ?? 0 },
          { label: 'Avg duration', value: metrics?.avgSessionMinutes != null ? `${metrics.avgSessionMinutes}m` : '—' },
          { label: 'Tokens out', value: formatTokens(metrics?.tokens.output ?? 0) },
          { label: 'API-equiv value', value: formatCostUsd(metrics?.estCostUsd ?? null), color: palette.green },
        ].map((m) => (
          <Paper key={m.label} sx={{ px: 2, py: 1.25, minWidth: 130 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 20, color: m.color ?? palette.text }}>
              {m.value}
            </Typography>
            <Typography sx={{ ...microLabel }}>{m.label}</Typography>
          </Paper>
        ))}
        {metrics && Object.keys(metrics.toolCallsByName).length > 0 && (
          <Paper sx={{ px: 2, py: 1.25, flex: 1, minWidth: 260 }}>
            <Typography sx={{ ...microLabel, mb: 0.75 }}>Top tools</Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
              {Object.entries(metrics.toolCallsByName).slice(0, 8).map(([name, count]) => (
                <Chip key={name} size="small" label={`${name} ×${count}`} sx={{ background: palette.raised }} />
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>

      <GlobalHooksPanel />

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Title', 'Status', 'Started', 'Ended', 'Tokens', 'Est. value', 'Launch prompt', ''].map((h) => (
                <TableCell key={h} sx={{ ...microLabel, borderColor: palette.hairline }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(sessions ?? []).map((s) => (
              <TableRow key={s.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/workspace/${s.id}`)}>
                <TableCell sx={{ fontSize: 12.5, borderColor: palette.hairline }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                    {s.attention && (
                      <Tooltip title={s.attention.message}>
                        <PanToolRoundedIcon sx={{ fontSize: 13, color: palette.amber }} />
                      </Tooltip>
                    )}
                    <span>{s.title}</span>
                    {(s.unseenCount ?? 0) > 0 && (
                      <Tooltip title={`${s.unseenCount} new transcript message${s.unseenCount! > 1 ? 's' : ''} since you last looked`}>
                        <Chip size="small" label={`${s.unseenCount! > 99 ? '99+' : s.unseenCount} new`} sx={{ height: 16, fontSize: 9, color: palette.bg, background: palette.blue, fontWeight: 700 }} />
                      </Tooltip>
                    )}
                    {s.permissionMode === 'bypassPermissions' && (
                      <Chip size="small" label="YOLO" sx={{ height: 16, fontSize: 9, color: palette.amber, background: `${palette.amber}18` }} />
                    )}
                    {s.worktreePath && (
                      <Chip size="small" label="worktree" sx={{ height: 16, fontSize: 9, color: palette.violet, background: `${palette.violet}18` }} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell sx={{ borderColor: palette.hairline }}>
                  <Chip size="small" label={s.status} sx={{ color: statusColor[s.status], background: `${statusColor[s.status]}18` }} />
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.muted, borderColor: palette.hairline }}>
                  {s.createdAt.slice(0, 16).replace('T', ' ')}
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.muted, borderColor: palette.hairline }}>
                  {s.endedAt ? s.endedAt.slice(0, 16).replace('T', ' ') : '—'}
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.muted, borderColor: palette.hairline }}>
                  {s.usage && s.usage.messages > 0
                    ? `${formatTokens(s.usage.inputTokens + s.usage.cacheReadTokens + s.usage.cacheWriteTokens)}→${formatTokens(s.usage.outputTokens)}`
                    : '—'}
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.green, borderColor: palette.hairline }}>
                  {s.usage && s.usage.messages > 0 ? formatCostUsd(s.usage.estCostUsd) : '—'}
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.green, borderColor: palette.hairline }}>
                  {s.launchPrompt ?? '—'}
                </TableCell>
                <TableCell sx={{ borderColor: palette.hairline }}>
                  <Button size="small">Open</Button>
                </TableCell>
              </TableRow>
            ))}
            {!sessions?.length && (
              <TableRow>
                <TableCell colSpan={8} sx={{ color: palette.muted, fontSize: 12.5 }}>
                  No sessions recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
