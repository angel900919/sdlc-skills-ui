import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, InputBase, Link, Stack, Typography,
} from '@mui/material';
import CallMergeRoundedIcon from '@mui/icons-material/CallMergeRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { palette, microLabel } from '../theme.js';
import { useCreatePr, usePrContext } from '../api/hooks.js';

/**
 * Human-gated PR creation: shows a generated, fully editable draft and only
 * pushes the branch + runs `gh pr create` when the user clicks the explicit
 * confirm button. Blockers (no commits, no remote, no gh…) disable it.
 */
export function PrDialog({
  sessionId, base, open, onClose,
}: { sessionId: string; base: string; open: boolean; onClose: () => void }) {
  const { data: context, isLoading, error } = usePrContext(sessionId, base, open);
  const createPr = useCreatePr(sessionId);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [draft, setDraft] = useState(false);

  // Seed the editable fields whenever a fresh draft arrives.
  useEffect(() => {
    if (context) {
      setTitle(context.draft.title);
      setBody(context.draft.body);
    }
  }, [context]);

  const existing = context?.existing ?? null;
  const created = createPr.data ?? null;
  const pr = created ?? existing;
  const blockers = context?.blockers ?? [];
  const canCreate = !!context && blockers.length === 0 && !pr && title.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CallMergeRoundedIcon sx={{ fontSize: 18, color: palette.violet }} />
        Pull request
        {context && (
          <Typography component="span" sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: palette.muted }}>
            {context.branch} → {context.base}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {isLoading && <Typography sx={{ fontSize: 13, color: palette.muted }}>Assembling draft…</Typography>}
        {error && <Alert severity="error" sx={{ fontSize: 12.5 }}>{(error as Error).message}</Alert>}

        {pr && (
          <Alert severity="success" sx={{ fontSize: 12.5, mb: 1.5 }}>
            PR {pr.number ? `#${pr.number}` : ''} already exists for this session:{' '}
            <Link href={pr.url} target="_blank" rel="noreferrer" sx={{ fontWeight: 600 }}>
              {pr.url} <OpenInNewRoundedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />
            </Link>
          </Alert>
        )}

        {!pr && blockers.map((b) => (
          <Alert key={b} severity="warning" sx={{ fontSize: 12.5, mb: 1 }}>{b}</Alert>
        ))}

        {context && !pr && (
          <Stack sx={{ gap: 1.5, mt: 0.5 }}>
            <Box>
              <Typography sx={{ ...microLabel, mb: 0.5 }}>Title</Typography>
              <InputBase
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ fontSize: 13, background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1, px: 1.25, py: 0.6 }}
              />
            </Box>
            <Box>
              <Typography sx={{ ...microLabel, mb: 0.5 }}>
                Description — {context.commits.length} commit{context.commits.length === 1 ? '' : 's'}, {context.files.length} file{context.files.length === 1 ? '' : 's'}
              </Typography>
              <InputBase
                fullWidth
                multiline
                minRows={10}
                maxRows={18}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                sx={{ fontSize: 12, fontFamily: '"IBM Plex Mono", monospace', background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1, px: 1.25, py: 0.75 }}
              />
            </Box>
            <FormControlLabel
              sx={{ '& .MuiFormControlLabel-label': { fontSize: 12, color: palette.muted } }}
              control={<Checkbox size="small" checked={draft} onChange={(e) => setDraft(e.target.checked)} />}
              label="Open as draft PR"
            />
            {createPr.error && <Alert severity="error" sx={{ fontSize: 12.5 }}>{(createPr.error as Error).message}</Alert>}
            <Typography sx={{ fontSize: 11.5, color: palette.faint }}>
              Confirming runs <code>git push -u origin {context.branch}</code> then <code>gh pr create</code>. Nothing
              is pushed until you click.
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button size="small" onClick={onClose}>Close</Button>
        {!pr && (
          <Button
            size="small"
            variant="contained"
            disabled={!canCreate || createPr.isPending}
            onClick={() => createPr.mutate({ base, title: title.trim(), body, draft })}
            sx={{ background: palette.violet, color: palette.bg, '&:hover': { background: palette.violet, filter: 'brightness(1.1)' } }}
          >
            {createPr.isPending ? 'Pushing & creating…' : 'Push branch & create PR'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
