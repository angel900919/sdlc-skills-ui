import { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { microLabel, palette } from '../theme.js';

// Local response types: the slice boundary keeps @sdlc/shared untouched (slice 3
// owns the api/hooks.ts wiring; until then the shape lives with its one consumer).
interface StorageKindStats {
  kind: 'audit-events' | 'hook-events' | 'transcript-copies' | 'usage-samples';
  rows: number;
  oldestAt: string | null;
}
interface StorageStats {
  fileSizeBytes: number;
  kinds: StorageKindStats[];
}

const KIND_LABELS: Record<StorageKindStats['kind'], string> = {
  'audit-events': 'Audit events',
  'hook-events': 'Hook events',
  'transcript-copies': 'Transcript copies',
  'usage-samples': 'Usage samples',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StoragePanel() {
  const [cutoffDays, setCutoffDays] = useState(30);
  const stats = useQuery({
    queryKey: ['storage-stats'],
    queryFn: () => api<StorageStats>('/api/storage/stats'),
  });

  const totalRows = stats.data?.kinds.reduce((sum, k) => sum + k.rows, 0) ?? 0;

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ ...microLabel }}>Storage</Typography>
        {stats.data && (
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: palette.faint }}>
            {formatBytes(stats.data.fileSizeBytes)}
          </Typography>
        )}
      </Stack>

      {stats.isPending && (
        <Stack sx={{ gap: 0.75 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={22} variant="rounded" />
          ))}
        </Stack>
      )}

      {stats.isError && (
        <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
          <Typography sx={{ fontSize: 12.5, color: palette.red }}>
            Couldn&apos;t read storage stats — {stats.error.message}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => void stats.refetch()}>
            Retry
          </Button>
        </Stack>
      )}

      {stats.data && totalRows === 0 && (
        <Typography sx={{ fontSize: 12.5, color: palette.faint }}>Nothing recorded yet.</Typography>
      )}

      {stats.data && totalRows > 0 && (
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...microLabel }}>Kind</TableCell>
                <TableCell sx={{ ...microLabel }} align="right">Rows</TableCell>
                <TableCell sx={{ ...microLabel }} align="right">Oldest</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.data.kinds.map((k) => (
                <TableRow key={k.kind}>
                  <TableCell sx={{ fontSize: 12.5 }}>{KIND_LABELS[k.kind]}</TableCell>
                  <TableCell sx={{ fontSize: 12.5, fontFamily: '"IBM Plex Mono", monospace' }} align="right">
                    {k.rows.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: palette.faint }} align="right">
                    {k.oldestAt ? k.oldestAt.slice(0, 10) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 1.5 }}>
            <Typography sx={{ fontSize: 12.5, color: palette.faint }}>Delete records older than</Typography>
            <Select
              size="small"
              value={cutoffDays}
              onChange={(e) => setCutoffDays(Number(e.target.value))}
              sx={{ fontSize: 12.5 }}
              inputProps={{ 'aria-label': 'Delete records older than' }}
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
              <MenuItem value={90}>90 days</MenuItem>
            </Select>
            {/* Inert until slice 2 wires the preview endpoint. */}
            <Button size="small" variant="outlined" disabled>
              Preview cleanup…
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
