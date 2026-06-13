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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatBytes, formatPruneResultLine, summarizeStorageBreakdown, type PruneResultLike } from '@sdlc/shared';
import { api, post } from '../api/client.js';
import { microLabel, palette } from '../theme.js';
import { PruneConfirmDialog, type PrunePreviewData } from './PruneConfirmDialog.js';

interface StorageKindStats {
  kind: 'audit-events' | 'hook-events' | 'transcript-copies' | 'usage-samples';
  rows: number;
  oldestAt: string | null;
}
interface StorageStats {
  fileSizeBytes: number;
  kinds: StorageKindStats[];
}
type PruneResult = PruneResultLike & { deleted: { kind: string; rows: number }[] };

const KIND_LABELS: Record<StorageKindStats['kind'], string> = {
  'audit-events': 'Audit events',
  'hook-events': 'Hook events',
  'transcript-copies': 'Transcript copies',
  'usage-samples': 'Usage samples',
};

export function StoragePanel() {
  const qc = useQueryClient();
  const [cutoffDays, setCutoffDays] = useState(30);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<PruneResult | null>(null);

  const stats = useQuery({
    queryKey: ['storage-stats'],
    queryFn: () => api<StorageStats>('/api/storage/stats'),
  });

  const preview = useQuery({
    queryKey: ['storage-prune-preview', cutoffDays],
    queryFn: () => api<PrunePreviewData>(`/api/storage/prune-preview?cutoffDays=${cutoffDays}`),
    enabled: dialogOpen,
  });

  const prune = useMutation({
    mutationFn: () => post<PruneResult>('/api/storage/prune', { cutoffDays }),
    onSuccess: (r) => {
      setResult(r);
      setDialogOpen(false);
      void qc.invalidateQueries({ queryKey: ['storage-stats'] });
    },
  });

  const breakdown = stats.data ? summarizeStorageBreakdown(stats.data.kinds) : null;
  const totalRows = breakdown?.totalRows ?? 0;
  const kindByName = new Map((stats.data?.kinds ?? []).map((k) => [k.kind as string, k] as const));

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

      {stats.data && totalRows === 0 && !result && (
        <Typography sx={{ fontSize: 12.5, color: palette.faint }}>Nothing recorded yet.</Typography>
      )}

      {breakdown && totalRows > 0 && (
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...microLabel }}>Kind</TableCell>
                <TableCell sx={{ ...microLabel }} align="right">Rows</TableCell>
                <TableCell sx={{ ...microLabel }} align="right">Share</TableCell>
                <TableCell sx={{ ...microLabel }} align="right">Oldest</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breakdown.rows.map((r) => {
                const full = kindByName.get(r.kind);
                return (
                  <TableRow key={r.kind}>
                    <TableCell sx={{ fontSize: 12.5 }}>{full ? KIND_LABELS[full.kind] : r.kind}</TableCell>
                    <TableCell sx={{ fontSize: 12.5, fontFamily: '"IBM Plex Mono", monospace' }} align="right">
                      {r.rows.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: palette.faint, fontFamily: '"IBM Plex Mono", monospace' }} align="right">
                      {r.pctOfTotal}%
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: palette.faint }} align="right">
                      {full?.oldestAt ? full.oldestAt.slice(0, 10) : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
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
            <Button size="small" variant="outlined" onClick={() => { setResult(null); setDialogOpen(true); }}>
              Preview cleanup…
            </Button>
          </Stack>
        </Box>
      )}

      {/* S3 — result readout (success) or the database-unchanged failure copy. */}
      {result && (
        <Typography sx={{ fontSize: 12.5, color: palette.green, mt: 1.5, fontFamily: '"IBM Plex Mono", monospace' }}>
          {formatPruneResultLine(result)} · recorded to the audit trail.
        </Typography>
      )}
      {prune.isError && (
        <Typography sx={{ fontSize: 12.5, color: palette.red, mt: 1.5 }}>
          Cleanup failed — nothing was deleted. The database is unchanged. ({prune.error.message})
        </Typography>
      )}

      <PruneConfirmDialog
        open={dialogOpen}
        preview={preview.data}
        isLoading={preview.isPending}
        isError={preview.isError}
        errorMessage={preview.error?.message}
        isPruning={prune.isPending}
        onConfirm={() => prune.mutate()}
        onCancel={() => setDialogOpen(false)}
      />
    </Paper>
  );
}
