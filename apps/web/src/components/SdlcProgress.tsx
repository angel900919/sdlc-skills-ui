import { useMemo, useState } from 'react';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import {
  EXECUTION, FOUNDATION_BROWNFIELD, FOUNDATION_GREENFIELD, PER_FEATURE, QA_RELEASE,
  type FeatureState, type ProjectState, type StageDef, type StagePhase, type StageStatus,
  featureStageStatus, foundationStageStatus,
} from '@sdlc/shared';
import { microLabel, palette, statusColor } from '../theme.js';

/**
 * SDLC progress — a render-only projection of the chain stages grouped by
 * phase, colored by status, with the single "next" stage marked. It draws over
 * the same derivation the Pipeline view uses ({@link foundationStageStatus} /
 * {@link featureStageStatus}), so the statuses it shows match the Pipeline view
 * exactly — same source of truth, different projection. No new derivation logic
 * lives here, and it reads only the already-fetched ProjectState (NFR-4).
 */

const phaseAccent: Record<StagePhase, string> = {
  foundation: palette.blue,
  'per-feature': palette.violet,
  execution: palette.amber,
  'qa-release': palette.green,
  'post-delivery': palette.muted,
  'cross-cutting': palette.muted,
  utility: palette.muted,
};

interface PhaseGroup {
  key: string;
  label: string;
  accent: string;
  stages: StageDef[];
}

/**
 * The phase rails, ordered as the chain runs. Foundation collapses to the
 * branch the project is on (greenfield vs brownfield) so a stage only shows on
 * the path it belongs to — mirroring the Pipeline view's lane selection.
 */
function phaseGroups(branch: 'greenfield' | 'brownfield'): PhaseGroup[] {
  const foundation = branch === 'greenfield' ? FOUNDATION_GREENFIELD : FOUNDATION_BROWNFIELD;
  return [
    { key: 'foundation', label: `Foundation · ${branch}`, accent: phaseAccent.foundation, stages: foundation },
    { key: 'per-feature', label: 'Per Feature', accent: phaseAccent['per-feature'], stages: PER_FEATURE },
    { key: 'execution', label: 'Execution Loop', accent: phaseAccent.execution, stages: EXECUTION },
    { key: 'qa-release', label: 'QA & Release', accent: phaseAccent['qa-release'], stages: QA_RELEASE },
  ];
}

/**
 * Status for a single stage — foundation stages read foundation flags,
 * per-feature/QA stages read the selected feature, the rest are pending. This
 * is the same resolution the Pipeline view applies; the shared helpers are the
 * only place derivation happens.
 */
function statusFor(
  state: ProjectState | null,
  feature: FeatureState | null,
  stage: StageDef,
): StageStatus {
  if (!state) return 'pending';
  if (stage.phase === 'foundation') return foundationStageStatus(state, stage.id);
  if (feature) return featureStageStatus(feature, stage.id);
  return 'pending';
}

/**
 * The "you are here" stage: the first stage along the active path that is
 * neither done nor skipped. Same algorithm as the Pipeline view's focus, so the
 * single marked stage agrees across both views.
 */
function nextStageId(
  state: ProjectState | null,
  feature: FeatureState | null,
  branch: 'greenfield' | 'brownfield',
): string | null {
  const path = [
    ...(branch === 'greenfield' ? FOUNDATION_GREENFIELD : FOUNDATION_BROWNFIELD),
    ...PER_FEATURE, ...EXECUTION, ...QA_RELEASE,
  ];
  for (const stage of path) {
    const status = statusFor(state, feature, stage);
    if (status !== 'done' && status !== 'skipped') return stage.id;
  }
  return null;
}

export function SdlcProgress({ projectId: _projectId, state }: { projectId: string | null; state: ProjectState | null }) {
  const features = state?.features ?? [];
  const [featureSlug, setFeatureSlug] = useState<string>('');
  const feature = features.find((f) => f.slug === featureSlug)
    ?? features.find((f) => f.status === 'Building')
    ?? features[0]
    ?? null;

  // Branch follows the project's detected type, defaulting to greenfield —
  // matching the Pipeline view's default when the type is unknown.
  const branch: 'greenfield' | 'brownfield' =
    state?.foundation.anchor.projectType === 'brownfield' ? 'brownfield' : 'greenfield';

  const groups = useMemo(() => phaseGroups(branch), [branch]);
  const nextId = useMemo(() => nextStageId(state, feature, branch), [state, feature, branch]);

  if (!state) {
    return (
      <Box role="status" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
          No chain state yet — start with /intake (new idea) or /onboard (existing code).
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, px: 2.5, py: 1.25, borderBottom: `1px solid ${palette.hairline}`, flexShrink: 0 }}>
        <Typography sx={{ ...microLabel }}>
          SDLC progress · chain stages by phase, colored by status · next stage marked
        </Typography>
        <Box sx={{ flex: 1 }} />
        {features.length > 0 && (
          <Select
            size="small"
            value={feature?.slug ?? ''}
            onChange={(e) => setFeatureSlug(e.target.value)}
            SelectDisplayProps={{ 'aria-label': 'Select feature' }}
            sx={{ fontSize: 12.5, minWidth: 168 }}
          >
            {features.map((f) => (
              <MenuItem key={f.slug} value={f.slug} sx={{ fontSize: 12.5 }}>
                {f.slug} — {f.status}
              </MenuItem>
            ))}
          </Select>
        )}
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 2.5, py: 2 }}>
        <Stack sx={{ gap: 2.5 }}>
          {groups.map((group) => (
            <PhaseRow key={group.key} group={group} state={state} feature={feature} nextId={nextId} />
          ))}
        </Stack>
      </Box>

      <Legend />
    </Box>
  );
}

function PhaseRow({
  group, state, feature, nextId,
}: {
  group: PhaseGroup;
  state: ProjectState | null;
  feature: FeatureState | null;
  nextId: string | null;
}) {
  const statuses = group.stages.map((stage) => statusFor(state, feature, stage));
  const done = statuses.filter((s) => s === 'done').length;
  const total = statuses.filter((s) => s !== 'skipped').length;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: group.accent }} />
        <Typography sx={{ ...microLabel, color: palette.muted }}>{group.label}</Typography>
        <Box sx={{ flex: 1, height: '1px', background: palette.hairline }} />
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: done === total && total > 0 ? palette.green : palette.muted }}>
          {done}/{total}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {group.stages.map((stage, i) => (
          <StageChip key={stage.id} stage={stage} status={statuses[i]} accent={group.accent} isNext={stage.id === nextId} />
        ))}
      </Stack>
    </Box>
  );
}

function StageChip({
  stage, status, accent, isNext,
}: {
  stage: StageDef;
  status: StageStatus;
  accent: string;
  isNext: boolean;
}) {
  const dot = statusColor[status] ?? palette.faint;
  return (
    <Stack
      data-stage-id={stage.id}
      data-status={status}
      data-next={isNext ? 'true' : undefined}
      direction="row"
      sx={{
        alignItems: 'center', gap: 0.9, minWidth: 150,
        px: 1.25, py: 0.85,
        background: palette.surface,
        borderRadius: 1.5,
        border: `1px solid ${isNext ? palette.blue : palette.hairline}`,
        borderLeft: `3px solid ${accent}`,
        boxShadow: isNext ? `0 0 0 1px ${palette.blue}, 0 0 14px ${palette.blue}33` : 'none',
        opacity: status === 'skipped' ? 0.45 : 1,
      }}
    >
      <Box
        sx={{
          width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
          background: status === 'done' || status === 'in-progress' ? dot : 'transparent',
          border: status === 'done' || status === 'in-progress' ? 'none' : `1.5px solid ${dot}`,
          boxShadow: status === 'done' || status === 'in-progress' ? `0 0 6px ${dot}` : 'none',
        }}
      />
      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600 }} noWrap>{stage.title}</Typography>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: palette.muted }} noWrap>/{stage.id}</Typography>
      </Stack>
      {isNext && (
        <Box sx={{ px: 0.6, py: 0.1, borderRadius: 0.75, background: `${palette.blue}22`, border: `1px solid ${palette.blue}55`, flexShrink: 0 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 8, letterSpacing: '0.08em', color: palette.blue }}>
            NEXT
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

function Legend() {
  return (
    <Stack
      direction="row"
      sx={{
        flexShrink: 0, gap: 1.25, px: 2.5, py: 1,
        borderTop: `1px solid ${palette.hairline}`,
      }}
    >
      {(['done', 'in-progress', 'pending', 'skipped'] as const).map((s) => (
        <Stack key={s} direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: statusColor[s] }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.muted }}>{s}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
