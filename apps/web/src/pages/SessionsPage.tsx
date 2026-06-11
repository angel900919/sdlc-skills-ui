import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useMetrics, useSessions } from '../api/hooks.js';

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

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Title', 'Status', 'Started', 'Ended', 'Launch prompt', ''].map((h) => (
                <TableCell key={h} sx={{ ...microLabel, borderColor: palette.hairline }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(sessions ?? []).map((s) => (
              <TableRow key={s.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/workspace/${s.id}`)}>
                <TableCell sx={{ fontSize: 12.5, borderColor: palette.hairline }}>{s.title}</TableCell>
                <TableCell sx={{ borderColor: palette.hairline }}>
                  <Chip size="small" label={s.status} sx={{ color: statusColor[s.status], background: `${statusColor[s.status]}18` }} />
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.muted, borderColor: palette.hairline }}>
                  {s.createdAt.slice(0, 16).replace('T', ' ')}
                </TableCell>
                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.muted, borderColor: palette.hairline }}>
                  {s.endedAt ? s.endedAt.slice(0, 16).replace('T', ' ') : '—'}
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
                <TableCell colSpan={6} sx={{ color: palette.muted, fontSize: 12.5 }}>
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
