import { useMemo, useState } from 'react';
import { Box, Chip, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { ReactFlow, Background, Controls, type Edge, type Node, Position, Handle, type NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  EXECUTION, FOUNDATION_BROWNFIELD, FOUNDATION_GREENFIELD, PER_FEATURE, QA_RELEASE,
  type StageDef, type StageStatus, featureStageStatus, foundationStageStatus,
} from '@sdlc/shared';
import { useNavigate } from 'react-router-dom';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useProjectState, useSpawnSession } from '../api/hooks.js';

interface StageNodeData extends Record<string, unknown> {
  stage: StageDef;
  status: StageStatus;
  onLaunch: (skill: string) => void;
}

function StageNode({ data }: NodeProps) {
  const { stage, status, onLaunch } = data as StageNodeData;
  const color = statusColor[status] ?? palette.faint;
  return (
    <Box
      onDoubleClick={() => onLaunch(stage.id)}
      sx={{
        background: palette.surface,
        border: `1px solid ${status === 'in-progress' ? color : palette.hairline}`,
        borderRadius: 1.5, px: 1.5, py: 1, width: 168, cursor: 'pointer',
        boxShadow: status === 'in-progress' ? `0 0 12px ${color}33` : 'none',
        '&:hover': { borderColor: color },
        transition: 'border-color 120ms, box-shadow 120ms',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: palette.hairlineBright, border: 'none' }} />
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: status === 'done' || status === 'in-progress' ? `0 0 6px ${color}` : 'none', flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12.5, fontWeight: 600 }} noWrap>
          {stage.title}
        </Typography>
      </Stack>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.muted, mt: 0.5 }} noWrap>
        /{stage.id}{stage.optional ? ' · opt' : ''}
      </Typography>
      <Handle type="source" position={Position.Right} style={{ background: palette.hairlineBright, border: 'none' }} />
    </Box>
  );
}

const nodeTypes = { stage: StageNode };

const LANES: { label: string; stages: StageDef[]; y: number }[] = [
  { label: 'FOUNDATION · GREENFIELD', stages: FOUNDATION_GREENFIELD, y: 0 },
  { label: 'FOUNDATION · BROWNFIELD', stages: FOUNDATION_BROWNFIELD, y: 150 },
  { label: 'PER FEATURE', stages: PER_FEATURE, y: 300 },
  { label: 'EXECUTION LOOP', stages: EXECUTION, y: 450 },
  { label: 'QA & RELEASE', stages: QA_RELEASE, y: 600 },
];

export function PipelinePage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data } = useProjectState(projectId);
  const navigate = useNavigate();
  const spawn = useSpawnSession(projectId);
  const state = data?.state ?? null;

  const features = state?.features ?? [];
  const [featureSlug, setFeatureSlug] = useState<string>('');
  const feature = features.find((f) => f.slug === featureSlug) ?? features.find((f) => f.status === 'Building') ?? features[0] ?? null;

  const onLaunch = (skill: string) => {
    const needsFeature = [...PER_FEATURE, ...QA_RELEASE].some((s) => s.id === skill);
    const prompt = needsFeature && feature ? `/${skill} ${feature.slug}` : `/${skill}`;
    spawn.mutate({ prompt, title: prompt }, { onSuccess: (sess) => navigate(`/workspace/${sess.id}`) });
  };

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const projectType = state?.foundation.anchor.projectType ?? 'unknown';

    for (const lane of LANES) {
      lane.stages.forEach((stage, i) => {
        let status: StageStatus = 'pending';
        if (state) {
          if (lane.y <= 150) status = foundationStageStatus(state, stage.id);
          else if (feature) status = featureStageStatus(feature, stage.id);
        }
        // Dim the branch that doesn't apply to this project.
        const offBranch =
          (projectType === 'greenfield' && lane.label.includes('BROWNFIELD')) ||
          (projectType === 'brownfield' && lane.label.includes('GREENFIELD'));
        nodes.push({
          id: stage.id,
          type: 'stage',
          position: { x: i * 196, y: lane.y },
          data: { stage, status: offBranch ? 'skipped' : status, onLaunch } satisfies StageNodeData,
        });
        const prev = lane.stages[i - 1];
        if (prev) {
          edges.push({
            id: `${prev.id}->${stage.id}`,
            source: prev.id,
            target: stage.id,
            style: { stroke: palette.hairlineBright, strokeWidth: 1.25 },
            animated: false,
          });
        }
      });
    }
    // Cross-lane connections (primary flow).
    const cross: [string, string][] = [
      ['pipeline', 'prd'],
      ['feature-census', 'test-strategy'],
      ['comprehend', 'architect'],
      ['onboard', 'anchor'],
      ['explore', 'environments'],
      ['publish-issues', 'build'],
      ['mtdd-merge', 'build'],
      ['build', 'qa'],
    ];
    for (const [a, b] of cross) {
      if (!edges.some((e) => e.id === `${a}->${b}`)) {
        edges.push({
          id: `${a}->${b}`,
          source: a,
          target: b,
          style: { stroke: palette.faint, strokeWidth: 1, strokeDasharray: '4 4' },
        });
      }
    }
    return { nodes, edges };
  }, [state, feature, onLaunch]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, px: 2.5, py: 1.5, borderBottom: `1px solid ${palette.hairline}` }}>
        <Typography sx={{ ...microLabel }}>SDLC pipeline · double-click a stage to launch its skill</Typography>
        <Box sx={{ flex: 1 }} />
        {features.length > 0 && (
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Typography sx={{ ...microLabel }}>Feature lens</Typography>
            <Select
              size="small"
              value={feature?.slug ?? ''}
              onChange={(e) => setFeatureSlug(e.target.value)}
              sx={{ fontSize: 12.5, minWidth: 180 }}
            >
              {features.map((f) => (
                <MenuItem key={f.slug} value={f.slug} sx={{ fontSize: 12.5 }}>
                  {f.slug} — {f.status}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        )}
        <Stack direction="row" sx={{ gap: 0.75 }}>
          {(['done', 'in-progress', 'pending', 'skipped'] as const).map((s) => (
            <Chip key={s} size="small" label={s} sx={{ color: statusColor[s], background: `${statusColor[s]}14` }} />
          ))}
        </Stack>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          colorMode="dark"
        >
          <Background color={palette.hairline} gap={28} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </Box>
      {!state && (
        <Paper sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', px: 2, py: 1 }}>
          <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
            No chain state yet — run /intake (new idea) or /onboard (existing code) from the Workspace.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
