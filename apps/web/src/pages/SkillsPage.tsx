import { useMemo, useState } from 'react';
import { Box, Button, Chip, Grid, InputBase, Paper, Stack, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useNavigate } from 'react-router-dom';
import type { SkillInfo } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useSkills, useSpawnSession } from '../api/hooks.js';

const PHASE_ORDER = ['foundation', 'per-feature', 'execution', 'qa-release', 'post-delivery', 'cross-cutting', 'utility'];
const PHASE_LABEL: Record<string, string> = {
  foundation: 'Foundation',
  'per-feature': 'Per Feature',
  execution: 'Execution Loop',
  'qa-release': 'QA & Release',
  'post-delivery': 'Post-Delivery',
  'cross-cutting': 'Cross-Cutting',
  utility: 'Utilities',
};
const PHASE_COLOR: Record<string, string> = {
  foundation: palette.blue,
  'per-feature': palette.green,
  execution: palette.amber,
  'qa-release': palette.violet,
  'post-delivery': '#4FD6E0',
  'cross-cutting': palette.muted,
  utility: palette.faint,
};

function SkillCard({ skill, onLaunch }: { skill: SkillInfo; onLaunch: () => void }) {
  return (
    <Paper sx={{ p: 1.75, height: '100%', display: 'flex', flexDirection: 'column', gap: 0.75, '&:hover': { borderColor: palette.hairlineBright } }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13.5, color: palette.green, fontWeight: 500, flex: 1 }} noWrap>
          /{skill.name}
        </Typography>
        <Button size="small" startIcon={<PlayArrowRoundedIcon sx={{ fontSize: 14 }} />} onClick={onLaunch}>
          Launch
        </Button>
      </Stack>
      {skill.argumentHint && (
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.amber }}>
          {skill.argumentHint}
        </Typography>
      )}
      <Typography sx={{ fontSize: 12, color: palette.muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {skill.description}
      </Typography>
    </Paper>
  );
}

export function SkillsPage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data: skills } = useSkills(projectId);
  const spawn = useSpawnSession(projectId);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  const grouped = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = (skills ?? []).filter(
      (s) => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
    );
    const groups = new Map<string, SkillInfo[]>();
    for (const phase of PHASE_ORDER) groups.set(phase, []);
    for (const s of filtered) {
      if (!groups.has(s.phase)) groups.set(s.phase, []);
      groups.get(s.phase)!.push(s);
    }
    return [...groups.entries()].filter(([, list]) => list.length > 0);
  }, [skills, filter]);

  const launch = (skill: SkillInfo) => {
    const args = skill.argumentHint ? window.prompt(`Arguments for /${skill.name} (${skill.argumentHint}) — leave empty to skip:`) : '';
    const prompt = `/${skill.name}${args?.trim() ? ` ${args.trim()}` : ''}`;
    spawn.mutate({ prompt, title: prompt }, { onSuccess: (sess) => navigate(`/workspace/${sess.id}`) });
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 2.5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h1">Skills catalog</Typography>
          <Typography sx={{ ...microLabel, mt: 0.5 }}>{skills?.length ?? 0} skills · launching opens a live session in the workspace</Typography>
        </Box>
        <InputBase
          placeholder="Filter skills…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ fontSize: 13, px: 1.5, py: 0.6, background: palette.surface, border: `1px solid ${palette.hairline}`, borderRadius: 1, width: 260 }}
        />
      </Stack>

      {grouped.map(([phase, list]) => (
        <Box key={phase} sx={{ mb: 3 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25, mb: 1.25 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: PHASE_COLOR[phase] ?? palette.faint }} />
            <Typography sx={{ ...microLabel, color: palette.text }}>{PHASE_LABEL[phase] ?? phase}</Typography>
            <Chip size="small" label={list.length} sx={{ background: palette.raised, color: palette.muted }} />
            <Box sx={{ flex: 1, height: '1px', background: palette.hairline }} />
          </Stack>
          <Grid container spacing={1.5}>
            {list.map((s) => (
              <Grid key={s.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <SkillCard skill={s} onLaunch={() => launch(s)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
