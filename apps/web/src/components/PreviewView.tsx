import { useState } from 'react';
import { Box, Chip, IconButton, InputBase, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';
import WebRoundedIcon from '@mui/icons-material/WebRounded';
import { normalizePreviewUrl } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { api } from '../api/client.js';

interface DevServerCandidate {
  port: number;
  url: string;
  status: number;
}

const VIEWPORTS = {
  desktop: { label: 'Desktop', width: '100%' },
  tablet: { label: 'Tablet · 768', width: 768 },
  mobile: { label: 'Mobile · 390', width: 390 },
} as const;
type ViewportKey = keyof typeof VIEWPORTS;

/**
 * Embedded app preview: an iframe onto the dev server of whatever this
 * project is building. URL is per-project and persisted; "detect" asks the
 * server to probe the usual local dev ports.
 */
export function PreviewView({ projectId }: { projectId: string }) {
  const url = useAppStore((s) => s.previewUrls[projectId]) ?? '';
  const setPreviewUrl = useAppStore((s) => s.setPreviewUrl);
  const [draft, setDraft] = useState(url);
  const [invalid, setInvalid] = useState(false);
  const [candidates, setCandidates] = useState<DevServerCandidate[] | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [viewport, setViewport] = useState<ViewportKey>('desktop');

  const apply = (value: string) => {
    const normalized = normalizePreviewUrl(value);
    setInvalid(value.trim().length > 0 && !normalized);
    if (!normalized) return;
    setPreviewUrl(projectId, normalized);
    setDraft(normalized);
    setReloadKey((k) => k + 1);
  };

  const detect = async () => {
    setDetecting(true);
    try {
      setCandidates(await api<DevServerCandidate[]>('/api/preview/detect'));
    } catch {
      setCandidates([]);
    } finally {
      setDetecting(false);
    }
  };

  const width = VIEWPORTS[viewport].width;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderBottom: `1px solid ${palette.hairline}`, background: palette.surface, flexWrap: 'wrap' }}>
        <InputBase
          placeholder="Dev server URL or port — e.g. 5173 or http://localhost:3000"
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setInvalid(false); }}
          onKeyDown={(e) => e.key === 'Enter' && apply(draft)}
          onBlur={() => draft.trim() && draft !== url && apply(draft)}
          sx={{
            flex: 1, minWidth: 240, fontSize: 12, fontFamily: '"IBM Plex Mono", monospace',
            background: palette.bg, border: `1px solid ${invalid ? palette.red : palette.hairline}`, borderRadius: 1, px: 1, py: 0.4,
          }}
        />
        <Tooltip title="Probe common local dev ports">
          <IconButton size="small" onClick={detect} disabled={detecting}>
            <RadarRoundedIcon sx={{ fontSize: 16, color: detecting ? palette.faint : palette.blue }} />
          </IconButton>
        </Tooltip>
        <Select size="small" value={viewport} onChange={(e) => setViewport(e.target.value as ViewportKey)} sx={{ fontSize: 11.5, '& .MuiSelect-select': { py: 0.4 } }}>
          {(Object.keys(VIEWPORTS) as ViewportKey[]).map((k) => (
            <MenuItem key={k} value={k} sx={{ fontSize: 11.5 }}>{VIEWPORTS[k].label}</MenuItem>
          ))}
        </Select>
        <Tooltip title="Reload preview">
          <span>
            <IconButton size="small" onClick={() => setReloadKey((k) => k + 1)} disabled={!url}>
              <RefreshRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Open in a new tab">
          <span>
            <IconButton size="small" component="a" href={url || undefined} target="_blank" rel="noreferrer" disabled={!url}>
              <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {candidates !== null && (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, px: 1.5, py: 0.6, borderBottom: `1px solid ${palette.hairline}`, flexWrap: 'wrap' }}>
          <Typography sx={{ ...microLabel }}>{candidates.length ? 'Responding' : 'No dev servers found on the usual ports'}</Typography>
          {candidates.map((c) => (
            <Chip
              key={c.port}
              size="small"
              label={`:${c.port}`}
              onClick={() => { apply(c.url); setCandidates(null); }}
              sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.green, background: `${palette.green}18`, cursor: 'pointer' }}
            />
          ))}
        </Stack>
      )}

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center', background: palette.bg, overflow: 'auto' }}>
        {url ? (
          <Box sx={{ width, maxWidth: '100%', height: '100%', borderLeft: width !== '100%' ? `1px solid ${palette.hairline}` : 'none', borderRight: width !== '100%' ? `1px solid ${palette.hairline}` : 'none' }}>
            <iframe
              key={reloadKey}
              src={url}
              title="App preview"
              style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
            />
          </Box>
        ) : (
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1, height: '100%' }}>
            <WebRoundedIcon sx={{ fontSize: 28, color: palette.faint }} />
            <Typography sx={{ color: palette.muted, fontSize: 13 }}>
              Enter your dev server URL (or a port) above, or hit the radar to detect one.
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: palette.faint, maxWidth: 420, textAlign: 'center' }}>
              If the preview stays blank after loading, the dev server is probably sending
              X-Frame-Options or a CSP frame-ancestors directive that blocks embedding — use “open in a new tab”.
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
