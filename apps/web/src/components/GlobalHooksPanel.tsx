import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { palette, microLabel } from '../theme.js';
import {
  useGlobalHooks,
  useInstallGlobalHooks,
  useUninstallGlobalHooks,
} from '../api/hooks.js';

const mono = '"IBM Plex Mono", monospace';

const STATE_META: Record<string, { color: string; label: string }> = {
  installed: { color: palette.green, label: 'Installed' },
  'partially-installed': { color: palette.amber, label: 'Partially installed' },
  'not-installed': { color: palette.faint, label: 'Not installed' },
  'file-missing': { color: palette.faint, label: 'Not installed' },
};

/**
 * Settings-style panel for the opt-in global hook install: observe Claude
 * sessions started OUTSIDE the dashboard by adding our observation hooks to
 * the user's ~/.claude/settings.json. Both actions mutate a user file, so
 * each is gated behind an explicit confirmation dialog.
 */
export function GlobalHooksPanel() {
  const { data: status } = useGlobalHooks();
  const install = useInstallGlobalHooks();
  const uninstall = useUninstallGlobalHooks();
  const [confirm, setConfirm] = useState<'install' | 'uninstall' | null>(null);

  const meta = STATE_META[status?.state ?? 'not-installed'] ?? STATE_META['not-installed'];
  const totalEvents = (status?.installedEvents.length ?? 0) + (status?.missingEvents.length ?? 0);
  const backupPath = install.data?.backupPath ?? status?.lastBackupPath ?? null;
  const mutationError = install.error?.message ?? uninstall.error?.message ?? null;
  const busy = install.isPending || uninstall.isPending;

  const onConfirm = () => {
    if (confirm === 'install') install.mutate();
    if (confirm === 'uninstall') uninstall.mutate();
    setConfirm(null);
  };

  return (
    <Paper sx={{ px: 2, py: 1.5, mb: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: meta.color,
            boxShadow: status?.state === 'installed' ? `0 0 6px ${meta.color}` : 'none',
            flexShrink: 0,
          }}
        />
        <Typography sx={{ ...microLabel }}>Global observation</Typography>
        <Chip size="small" label={meta.label} sx={{ color: meta.color, background: `${meta.color}18` }} />
        {status?.state === 'partially-installed' && (
          <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.amber }}>
            {status.installedEvents.length}/{totalEvents} events hooked
          </Typography>
        )}
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          variant="outlined"
          disabled={busy || status?.state === 'installed'}
          onClick={() => setConfirm('install')}
        >
          Install
        </Button>
        <Button
          size="small"
          color="error"
          disabled={busy || !status || status.installedEvents.length === 0}
          onClick={() => setConfirm('uninstall')}
        >
          Uninstall
        </Button>
      </Stack>

      <Typography sx={{ fontSize: 12.5, color: palette.muted, mt: 0.75 }}>
        Observe Claude sessions started outside the dashboard — adds observation hooks to{' '}
        <Box component="span" sx={{ fontFamily: mono, fontSize: 11.5, color: palette.text }}>
          {status?.settingsPath ?? '~/.claude/settings.json'}
        </Box>
        .
      </Typography>

      {backupPath && (
        <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.faint, mt: 0.5 }}>
          Backup: {backupPath}
        </Typography>
      )}
      {(status?.error || mutationError) && (
        <Typography sx={{ fontFamily: mono, fontSize: 11.5, color: palette.red, mt: 0.5 }}>
          {status?.error ?? mutationError}
        </Typography>
      )}

      <Dialog open={confirm !== null} onClose={() => setConfirm(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 15 }}>
          {confirm === 'install' ? 'Install global observation hooks?' : 'Remove global observation hooks?'}
        </DialogTitle>
        <DialogContent>
          {confirm === 'install' ? (
            <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
              This merges the Command Center observation hooks into{' '}
              <Box component="span" sx={{ fontFamily: mono, fontSize: 11.5, color: palette.text }}>
                {status?.settingsPath}
              </Box>
              {' '}so every Claude Code session on this machine reports its lifecycle events to this
              dashboard. Your existing settings and hooks are preserved; a timestamped backup is
              written before the first change. The hooks fail silently (curl --max-time 3, || true),
              so a stopped dashboard never blocks your sessions.
            </Typography>
          ) : (
            <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
              This removes only the entries marked{' '}
              <Box component="span" sx={{ fontFamily: mono, fontSize: 11.5, color: palette.text }}>
                # sdlc-command-center
              </Box>
              {' '}from{' '}
              <Box component="span" sx={{ fontFamily: mono, fontSize: 11.5, color: palette.text }}>
                {status?.settingsPath}
              </Box>
              . Everything else in the file is left untouched. Sessions started outside the
              dashboard will no longer be observed.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            color={confirm === 'uninstall' ? 'error' : 'primary'}
            onClick={onConfirm}
          >
            {confirm === 'install' ? 'Install hooks' : 'Remove hooks'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
