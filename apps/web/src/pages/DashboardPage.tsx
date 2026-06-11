import { useMemo } from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useNavigate } from 'react-router-dom';
import type { FeatureState } from '@sdlc/shared';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useMetrics, useProjectState, useSessions, useSpawnSession } from '../api/hooks.js';
import { ActivityFeed } from '../components/ActivityFeed.js';
import { post } from '../api/client.js';

function Card({ title, children, action, span }: { title: string; children: React.ReactNode; action?: React.ReactNode; span?: object }) {
  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, ...span }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ ...microLabel }}>{title}</Typography>
        {action}
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}

function Big({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 28, fontWeight: 500, color: color ?? palette.text, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography sx={{ ...microLabel }}>{label}</Typography>
    </Box>
  );
}

function FeatureRow({ f }: { f: FeatureState }) {
  const merged = f.slices.filter((s) => s.status === 'merged').length;
  const total = f.slices.filter((s) => s.status !== 'removed').length;
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: `1px solid ${palette.hairline}` }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: statusColor[f.status] ?? palette.faint }} />
      <Typography sx={{ fontSize: 13, fontWeight: 500, flex: 1, minWidth: 0 }} noWrap>
        {f.slug}
      </Typography>
      {total > 0 && (
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.muted }}>
          {merged}/{total}
        </Typography>
      )}
      <Chip size="small" label={f.status} sx={{ color: statusColor[f.status] ?? palette.muted, background: `${statusColor[f.status] ?? palette.faint}18` }} />
    </Stack>
  );
}

export function DashboardPage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const navigate = useNavigate();
  const { data, refetch, isFetching } = useProjectState(projectId);
  const { data: metrics } = useMetrics(projectId);
  const { data: sessions } = useSessions(projectId);
  const spawn = useSpawnSession(projectId);

  const state = data?.state ?? null;

  const foundationDone = useMemo(() => {
    if (!state) return { done: 0, total: 0 };
    const f = state.foundation;
    const checks = [f.discover.present, f.understand.present, f.featureMap.present, f.anchor.present, f.architect.present];
    return { done: checks.filter(Boolean).length, total: checks.length };
  }, [state]);

  const counts = useMemo(() => {
    const features = state?.features ?? [];
    return {
      features: features.length,
      building: features.filter((f) => f.status === 'Building').length,
      shipped: features.filter((f) => f.status === 'Shipped').length,
      blocked: features.filter((f) => f.status === 'Blocked').length,
    };
  }, [state]);

  const activeSessions = (sessions ?? []).filter((s) => s.status === 'running' || s.status === 'starting');
  const interrupted = (sessions ?? []).filter((s) => s.status === 'interrupted');

  const launchNext = (action: string) => {
    const cmd = action.split('—')[0].trim().split('  ')[0].trim();
    spawn.mutate({ prompt: cmd, title: cmd }, { onSuccess: (sess) => navigate(`/workspace/${sess.id}`) });
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h1">{state?.projectName ?? data?.project.name ?? '—'}</Typography>
          <Typography sx={{ ...microLabel, mt: 0.5 }}>
            {state ? `tier ${state.foundation.anchor.tier} · ${state.foundation.anchor.projectType} · ${state.foundation.anchor.language}` : 'no chain state yet — run /intake or /onboard'}
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshRoundedIcon />}
          onClick={async () => {
            if (projectId) await post(`/api/projects/${projectId}/state/refresh`);
            void refetch();
          }}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Refresh state'}
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 5 }}>
                  <Big value={`${foundationDone.done}/${foundationDone.total}`} label="Foundation" color={foundationDone.done === foundationDone.total ? palette.green : palette.amber} />
                  <Big value={counts.features} label="Features" />
                  <Big value={counts.building} label="Building" color={counts.building ? palette.amber : undefined} />
                  <Big value={counts.shipped} label="Shipped" color={counts.shipped ? palette.green : undefined} />
                  <Big value={counts.blocked} label="Blocked" color={counts.blocked ? palette.red : undefined} />
                  <Big value={activeSessions.length} label="Live sessions" color={activeSessions.length ? palette.green : undefined} />
                  <Big value={metrics?.toolCallsTotal ?? 0} label="Tool calls" />
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card title="Next actions">
                {state?.nextActions?.length ? (
                  <Stack sx={{ gap: 0.75 }}>
                    {state.nextActions.slice(0, 7).map((a) => (
                      <Stack key={a} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PlayArrowRoundedIcon sx={{ fontSize: 14 }} />}
                          onClick={() => launchNext(a)}
                          sx={{ flexShrink: 0, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11 }}
                        >
                          run
                        </Button>
                        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: palette.text }} noWrap>
                          {a}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
                    No recommendations — refresh state or run /next in the workspace.
                  </Typography>
                )}
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card title={`Features (${counts.features})`}>
                <Box sx={{ overflow: 'auto', maxHeight: 260 }}>
                  {(state?.features ?? []).map((f) => (
                    <FeatureRow key={f.slug} f={f} />
                  ))}
                  {!state?.features?.length && (
                    <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
                      No features yet — run /feature-map after the foundation.
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card title="Progress tracker">
                <Stack sx={{ gap: 0.5, overflow: 'auto', maxHeight: 220 }}>
                  {(state?.progressTail ?? []).slice(0, 8).map((p, i) => (
                    <Stack key={i} direction="row" sx={{ alignItems: 'baseline', gap: 1 }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.faint, flexShrink: 0 }}>
                        {p.date}
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: palette.green }}>/{p.skill}</Typography>
                      <Typography sx={{ fontSize: 12, color: palette.muted }} noWrap>
                        ({p.scope})
                      </Typography>
                    </Stack>
                  ))}
                  {!state?.progressTail?.length && (
                    <Typography sx={{ fontSize: 12.5, color: palette.muted }}>No chain entries yet.</Typography>
                  )}
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card title="Recent commits">
                <Stack sx={{ gap: 0.5, overflow: 'auto', maxHeight: 220 }}>
                  {(state?.recentCommits ?? []).slice(0, 8).map((c) => (
                    <Stack key={c.sha} direction="row" sx={{ alignItems: 'baseline', gap: 1 }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.blue, flexShrink: 0 }}>
                        {c.sha}
                      </Typography>
                      <Typography sx={{ fontSize: 12 }} noWrap>
                        {c.subject}
                      </Typography>
                    </Stack>
                  ))}
                  {!state?.recentCommits?.length && (
                    <Typography sx={{ fontSize: 12.5, color: palette.muted }}>No git history.</Typography>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack sx={{ gap: 2, height: '100%' }}>
            {interrupted.length > 0 && (
              <Paper sx={{ p: 2, borderColor: `${palette.red}55` }}>
                <Typography sx={{ ...microLabel, color: palette.red, mb: 1 }}>
                  Interrupted sessions — resume where you left off
                </Typography>
                <Stack sx={{ gap: 0.75 }}>
                  {interrupted.slice(0, 3).map((s) => (
                    <Stack key={s.id} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 12.5, flex: 1 }} noWrap>
                        {s.title}
                      </Typography>
                      <Button size="small" variant="outlined" color="error" onClick={() => navigate(`/workspace/${s.id}`)}>
                        Open
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            )}
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 380 }}>
              <Typography sx={{ ...microLabel, p: 2, pb: 1 }}>Live activity</Typography>
              <ActivityFeed projectId={projectId ?? undefined} />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
