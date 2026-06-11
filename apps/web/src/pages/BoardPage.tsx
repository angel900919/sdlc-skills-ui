import { useMemo, useState } from 'react';
import { Box, Chip, MenuItem, Paper, Select, Stack, Tooltip, Typography } from '@mui/material';
import type { FeatureSliceState } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useProjectState } from '../api/hooks.js';

/**
 * Kanban columns mirror the canonical slice lifecycle derived by
 * .claude/skills/_build_share/project-state.py (derive_slice_status):
 * planned → published → blocked → in-progress → merged (+ removed).
 */
const COLUMNS: { status: string; label: string; color: string; hint: string }[] = [
  { status: 'planned', label: 'Planned', color: palette.blue, hint: 'Issue drafted by /to-issues, not yet published' },
  { status: 'published', label: 'Published', color: palette.violet, hint: 'In the tracker, ready to pick up' },
  { status: 'blocked', label: 'Blocked', color: palette.red, hint: 'Waiting on an unmerged dependency' },
  { status: 'in-progress', label: 'In Progress', color: palette.amber, hint: 'MTDD loop running on this slice' },
  { status: 'merged', label: 'Merged', color: palette.green, hint: 'Slice landed on the target branch' },
];

const REMOVED_COLUMN = { status: 'removed', label: 'Removed', color: palette.faint, hint: 'Cut from the plan' };

function sliceNumber(id: string): number {
  const m = /(\d+)/.exec(id);
  return m ? Number(m[1]) : 0;
}

function SliceCard({ slice, color, showFeature }: { slice: FeatureSliceState; color: string; showFeature: boolean }) {
  const refs = Object.entries(slice.backendRefs);
  return (
    <Box
      sx={{
        background: palette.surface,
        border: `1px solid ${palette.hairline}`,
        borderLeft: `2px solid ${color}`,
        borderRadius: 1.5,
        px: 1.5,
        py: 1.25,
        '&:hover': { borderColor: color, borderLeftColor: color },
        transition: 'border-color 120ms',
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <Tooltip title={slice.file} placement="top-start">
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color, fontWeight: 600 }}>
            {slice.id}
          </Typography>
        </Tooltip>
        <Box sx={{ flex: 1 }} />
        {slice.type && slice.type !== '?' && (
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.faint }}>
            {slice.type}
          </Typography>
        )}
        <Chip size="small" label={slice.priority} sx={{ height: 18, fontSize: 9.5, color: palette.muted, background: palette.raised }} />
      </Stack>
      <Typography sx={{ fontSize: 12.5, fontWeight: 500, mt: 0.5, lineHeight: 1.35 }}>
        {slice.title}
      </Typography>
      {showFeature && (
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.muted, mt: 0.5 }} noWrap>
          {slice.feature}
        </Typography>
      )}
      {slice.dependsOn.length > 0 && (
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: palette.faint, mt: 0.5 }} noWrap>
          deps: {slice.dependsOn.join(', ')}
        </Typography>
      )}
      {refs.length > 0 && (
        <Stack direction="row" sx={{ gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
          {refs.map(([backend, ref]) => (
            <Chip
              key={backend}
              size="small"
              label={`${backend}: ${ref}`}
              sx={{ height: 18, fontSize: 9.5, color: palette.blue, background: `${palette.blue}14` }}
            />
          ))}
        </Stack>
      )}
      {slice.lastActivity && (
        <Typography sx={{ fontSize: 10.5, color: palette.faint, mt: 0.75 }} noWrap>
          {slice.lastActivity.replace(/^##\s*/, '').slice(0, 90)}
        </Typography>
      )}
    </Box>
  );
}

export function BoardPage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data } = useProjectState(projectId);
  const state = data?.state ?? null;

  const features = state?.features ?? [];
  const [featureSlug, setFeatureSlug] = useState<string>('');
  const showAll = !featureSlug || !features.some((f) => f.slug === featureSlug);

  const slices = useMemo(() => {
    const visible = showAll ? features : features.filter((f) => f.slug === featureSlug);
    return visible
      .flatMap((f) => f.slices)
      .sort((a, b) => a.feature.localeCompare(b.feature) || sliceNumber(a.id) - sliceNumber(b.id));
  }, [features, featureSlug, showAll]);

  const buckets = useMemo(() => {
    const out = new Map<string, FeatureSliceState[]>();
    for (const col of [...COLUMNS, REMOVED_COLUMN]) out.set(col.status, []);
    for (const s of slices) {
      const bucket = out.get(s.status);
      if (bucket) bucket.push(s);
      else out.set(s.status, [s]); // unknown status from a newer generator — still surface it
    }
    return out;
  }, [slices]);

  // Always show the five lifecycle columns; removed (and any unknown status) only when populated.
  const columns = useMemo(() => {
    const extra = [...buckets.keys()]
      .filter((status) => !COLUMNS.some((c) => c.status === status))
      .filter((status) => (buckets.get(status)?.length ?? 0) > 0)
      .map((status) =>
        status === REMOVED_COLUMN.status
          ? REMOVED_COLUMN
          : { status, label: status, color: palette.muted, hint: 'Unrecognized slice status' },
      );
    return [...COLUMNS, ...extra];
  }, [buckets]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, px: 2.5, py: 1.5, borderBottom: `1px solid ${palette.hairline}`, flexShrink: 0 }}>
        <Typography sx={{ ...microLabel }}>
          Slice board · read-only view over .ai/specs/&lt;feature&gt;/issues
        </Typography>
        <Box sx={{ flex: 1 }} />
        {features.length > 0 && (
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Typography sx={{ ...microLabel }}>Feature lens</Typography>
            <Select
              size="small"
              value={showAll ? '' : featureSlug}
              onChange={(e) => setFeatureSlug(e.target.value)}
              displayEmpty
              sx={{ fontSize: 12.5, minWidth: 180 }}
            >
              <MenuItem value="" sx={{ fontSize: 12.5 }}>
                All features
              </MenuItem>
              {features.map((f) => (
                <MenuItem key={f.slug} value={f.slug} sx={{ fontSize: 12.5 }}>
                  {f.slug} — {f.status}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        )}
        <Chip
          size="small"
          label={`${slices.filter((s) => s.status !== 'removed').length} slices`}
          sx={{ color: palette.muted, background: palette.raised }}
        />
      </Stack>

      {slices.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ px: 3, py: 2 }}>
            <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
              No slices yet — run /plan then /to-issues on a feature to populate the board.
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 1.5, p: 2, overflowX: 'auto' }}>
          {columns.map((col) => {
            const cards = buckets.get(col.status) ?? [];
            return (
              <Box
                key={col.status}
                sx={{
                  width: 272,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                  background: `${palette.surface}66`,
                  border: `1px solid ${palette.hairline}`,
                  borderTop: `2px solid ${cards.length ? col.color : palette.hairline}`,
                  borderRadius: 1.5,
                  opacity: col.status === 'removed' ? 0.6 : 1,
                }}
              >
                <Tooltip title={col.hint} placement="top">
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 1.5, py: 1.25, borderBottom: `1px solid ${palette.hairline}`, flexShrink: 0 }}>
                    <Box
                      sx={{
                        width: 8, height: 8, borderRadius: '50%', background: col.color,
                        boxShadow: cards.length && (col.status === 'in-progress' || col.status === 'merged') ? `0 0 6px ${col.color}` : 'none',
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ ...microLabel, color: cards.length ? palette.text : palette.muted }}>
                      {col.label}
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: cards.length ? col.color : palette.faint }}>
                      {cards.length}
                    </Typography>
                  </Stack>
                </Tooltip>
                <Stack sx={{ gap: 1, p: 1.25, overflowY: 'auto', flex: 1, minHeight: 0 }}>
                  {cards.map((s) => (
                    <SliceCard key={`${s.feature}/${s.id}`} slice={s} color={col.color} showFeature={showAll} />
                  ))}
                  {cards.length === 0 && (
                    <Typography sx={{ fontSize: 11.5, color: palette.faint, textAlign: 'center', py: 2 }}>
                      —
                    </Typography>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
