import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { pruneWarningCopy } from '@sdlc/shared';
import { palette } from '../theme.js';

export interface PrunePreviewData {
  cutoffDate: string;
  totalRows: number;
  kinds: { kind: string; rows: number }[];
}

const KIND_LABELS: Record<string, string> = {
  'audit-events': 'Audit events',
  'hook-events': 'Hook events',
  'transcript-copies': 'Transcript copies',
  'usage-samples': 'Usage samples',
};

interface Props {
  open: boolean;
  preview: PrunePreviewData | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isPruning: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** S2 — the no-accidents confirm gate. Escape cancels; confirm is never autofocused. */
export function PruneConfirmDialog({
  open,
  preview,
  isLoading,
  isError,
  errorMessage,
  isPruning,
  onConfirm,
  onCancel,
}: Props) {
  const nothingToDelete = !!preview && preview.totalRows === 0;
  const canConfirm = !!preview && preview.totalRows > 0 && !isPruning;

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="prune-confirm-title">
      <DialogTitle id="prune-confirm-title">Delete old records?</DialogTitle>
      <DialogContent>
        {isLoading && <DialogContentText>Counting…</DialogContentText>}
        {isError && (
          <DialogContentText sx={{ color: palette.red }}>
            Couldn&apos;t count — {errorMessage}
          </DialogContentText>
        )}
        {nothingToDelete && (
          <DialogContentText>
            Nothing older than {preview!.cutoffDate.slice(0, 10)}. No cleanup needed.
          </DialogContentText>
        )}
        {preview && preview.totalRows > 0 && (
          <>
            <DialogContentText sx={{ mb: 1.5 }}>{pruneWarningCopy(preview.cutoffDate)}</DialogContentText>
            <Stack sx={{ gap: 0.5 }}>
              {preview.kinds
                .filter((k) => k.rows > 0)
                .map((k) => (
                  <Typography key={k.kind} sx={{ fontSize: 12.5, fontFamily: '"IBM Plex Mono", monospace' }}>
                    {KIND_LABELS[k.kind] ?? k.kind}: {k.rows.toLocaleString()}
                  </Typography>
                ))}
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Keep everything</Button>
        <Button color="error" variant="contained" disabled={!canConfirm} onClick={onConfirm}>
          {preview && preview.totalRows > 0 ? `Delete ${preview.totalRows.toLocaleString()} records` : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
