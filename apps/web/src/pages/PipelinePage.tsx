import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Box, Button, Chip, IconButton, LinearProgress, MenuItem, Select, Stack,
  ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material';
import {
  ReactFlow, Background, Controls, MiniMap,
  type Edge, type Node, type NodeProps, type ReactFlowInstance,
  Position, Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  EXECUTION, FOUNDATION_BROWNFIELD, FOUNDATION_GREENFIELD, PER_FEATURE, QA_RELEASE,
  type StageDef, type StagePhase, type StageStatus, type FeatureState, type ProjectState,
  featureStageStatus, foundationStageStatus,
} from '@sdlc/shared';
import { useNavigate } from 'react-router-dom';
import { palette, microLabel, statusColor } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useProjectState, useSpawnSession } from '../api/hooks.js';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const NODE_W = 188;
const COL = 212; // horizontal step between stages in a lane
const PANEL_W = 332;

const phaseAccent: Record<StagePhase, string> = {
  foundation: palette.blue,
  'per-feature': palette.violet,
  execution: palette.amber,
  'qa-release': palette.green,
  'post-delivery': palette.muted,
  'cross-cutting': palette.muted,
  utility: palette.muted,
};

interface LaneDef {
  key: string;
  label: string;
  stages: StageDef[];
  y: number;
  branch: 'greenfield' | 'brownfield' | null;
}

const LANES: LaneDef[] = [
  { key: 'gf', label: 'Foundation · Greenfield', stages: FOUNDATION_GREENFIELD, y: 56, branch: 'greenfield' },
  { key: 'bf', label: 'Foundation · Brownfield', stages: FOUNDATION_BROWNFIELD, y: 226, branch: 'brownfield' },
  { key: 'pf', label: 'Per Feature', stages: PER_FEATURE, y: 396, branch: null },
  { key: 'ex', label: 'Execution Loop', stages: EXECUTION, y: 566, branch: null },
  { key: 'qa', label: 'QA & Release', stages: QA_RELEASE, y: 736, branch: null },
];

const STAGE_BY_ID = new Map(LANES.flatMap((l) => l.stages.map((s) => [s.id, s] as const)));

type BranchMode = 'auto' | 'greenfield' | 'brownfield';

// ---------------------------------------------------------------------------
// Custom nodes
// ---------------------------------------------------------------------------
interface StageNodeData extends Record<string, unknown> {
  stage: StageDef;
  status: StageStatus;
  focus: boolean;
  selected: boolean;
  dim: boolean;
}

function StageNode({ data }: NodeProps) {
  const { stage, status, focus, selected, dim } = data as StageNodeData;
  const dot = statusColor[status] ?? palette.faint;
  const accent = phaseAccent[stage.phase] ?? palette.muted;
  const ring = status === 'in-progress' ? palette.amber : status === 'blocked' ? palette.red : palette.blue;

  return (
    <Box
      sx={{
        position: 'relative',
        width: NODE_W,
        opacity: dim ? 0.32 : 1,
        background: selected ? palette.raised : palette.surface,
        border: `1px solid ${selected ? palette.blue : status === 'in-progress' ? palette.amber : palette.hairline}`,
        borderRadius: 1.5,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 120ms, box-shadow 120ms, transform 120ms',
        boxShadow: selected
          ? `0 0 0 1px ${palette.blue}, 0 0 16px ${palette.blue}33`
          : status === 'in-progress'
            ? `0 0 12px ${palette.amber}22`
            : 'none',
        '&:hover': { borderColor: accent, transform: 'translateY(-1px)' },
        '@keyframes focusPulse': {
          '0%': { boxShadow: `0 0 0 0 ${ring}55` },
          '70%': { boxShadow: `0 0 0 7px ${ring}00` },
          '100%': { boxShadow: `0 0 0 0 ${ring}00` },
        },
        animation: focus && !selected ? 'focusPulse 1.9s ease-out infinite' : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: palette.hairlineBright, border: 'none', width: 6, height: 6 }} />
      {/* phase accent bar */}
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
      <Box sx={{ pl: 1.75, pr: 1.25, py: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: status === 'done' ? dot : 'transparent',
              border: status === 'done' ? 'none' : `1.5px solid ${dot}`,
              boxShadow: status === 'done' || status === 'in-progress' ? `0 0 6px ${dot}` : 'none',
            }}
          >
            {status === 'done' && <CheckRoundedIcon sx={{ fontSize: 11, color: palette.bg }} />}
            {status === 'in-progress' && <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />}
          </Box>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, flex: 1, minWidth: 0 }} noWrap>
            {stage.title}
          </Typography>
          {focus && (
            <Box sx={{ px: 0.6, py: 0.1, borderRadius: 0.75, background: `${ring}22`, border: `1px solid ${ring}55` }}>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 8, letterSpacing: '0.08em', color: ring }}>
                NEXT
              </Typography>
            </Box>
          )}
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, mt: 0.6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.muted }} noWrap>
            /{stage.id}
          </Typography>
          {stage.optional && (
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: palette.faint, border: `1px dashed ${palette.hairlineBright}`, borderRadius: 0.5, px: 0.4 }}>
              opt
            </Typography>
          )}
        </Stack>
      </Box>
      <Handle type="source" position={Position.Right} style={{ background: palette.hairlineBright, border: 'none', width: 6, height: 6 }} />
    </Box>
  );
}

interface LaneNodeData extends Record<string, unknown> {
  label: string;
  width: number;
  done: number;
  total: number;
  accent: string;
  dim: boolean;
}

function LaneNode({ data }: NodeProps) {
  const { label, width, done, total, accent, dim } = data as LaneNodeData;
  return (
    <Box
      sx={{
        width, height: 150,
        borderRadius: 2,
        border: `1px solid ${palette.hairline}`,
        background: dim ? 'transparent' : `${palette.surface}55`,
        opacity: dim ? 0.5 : 1,
        pointerEvents: 'none',
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 1.5, pt: 1 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
        <Typography sx={{ ...microLabel, color: palette.muted }}>{label}</Typography>
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: done === total && total > 0 ? palette.green : palette.faint }}>
          {done}/{total}
        </Typography>
      </Stack>
    </Box>
  );
}

const nodeTypes = { stage: StageNode, lane: LaneNode };

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------
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

function statusReason(status: StageStatus): string {
  switch (status) {
    case 'done': return 'Artifact present — stage complete.';
    case 'in-progress': return 'Work is underway on this stage.';
    case 'blocked': return 'Blocked on an unmet dependency.';
    case 'skipped': return 'Optional or off-branch — not needed here.';
    default: return 'Not started yet.';
  }
}

const NEEDS_FEATURE = new Set([...PER_FEATURE, ...QA_RELEASE].map((s) => s.id));

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export function PipelinePage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data } = useProjectState(projectId);
  const navigate = useNavigate();
  const spawn = useSpawnSession(projectId);
  const state = data?.state ?? null;

  const features = state?.features ?? [];
  const [featureSlug, setFeatureSlug] = useState<string>('');
  const feature = features.find((f) => f.slug === featureSlug)
    ?? features.find((f) => f.status === 'Building')
    ?? features[0]
    ?? null;

  const [branchMode, setBranchMode] = useState<BranchMode>('auto');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rf = useRef<ReactFlowInstance<Node, Edge> | null>(null);

  const detected = state?.foundation.anchor.projectType;
  const activeBranch: 'greenfield' | 'brownfield' =
    branchMode !== 'auto' ? branchMode : detected === 'brownfield' ? 'brownfield' : 'greenfield';
  const branchKnown = branchMode !== 'auto' || detected === 'greenfield' || detected === 'brownfield';

  const promptFor = useCallback(
    (skill: string) => (NEEDS_FEATURE.has(skill) && feature ? `/${skill} ${feature.slug}` : `/${skill}`),
    [feature],
  );

  const launch = useCallback(
    (skill: string) => {
      const prompt = promptFor(skill);
      spawn.mutate({ prompt, title: prompt }, { onSuccess: (sess) => navigate(`/workspace/${sess.id}`) });
    },
    [promptFor, spawn, navigate],
  );

  // The "you are here" stage: first incomplete stage along the active path.
  const focusId = useMemo(() => {
    const path = [
      ...(activeBranch === 'greenfield' ? FOUNDATION_GREENFIELD : FOUNDATION_BROWNFIELD),
      ...PER_FEATURE, ...EXECUTION, ...QA_RELEASE,
    ];
    for (const s of path) {
      const st = statusFor(state, feature, s);
      if (st !== 'done' && st !== 'skipped') return s.id;
    }
    return null;
  }, [state, feature, activeBranch]);

  const { nodes, edges, foundationProgress, featureProgress, focusPos } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let focusPos: { x: number; y: number } | null = null;

    for (const lane of LANES) {
      const laneOff = lane.branch !== null && lane.branch !== activeBranch && branchKnown;
      const width = lane.stages.length * COL - (COL - NODE_W) + 24;
      let laneDone = 0;
      let laneTotal = 0;

      lane.stages.forEach((stage, i) => {
        const status: StageStatus = laneOff ? 'skipped' : statusFor(state, feature, stage);
        if (status !== 'skipped') laneTotal++;
        if (status === 'done') laneDone++;
        const x = 12 + i * COL;
        if (stage.id === focusId) focusPos = { x, y: lane.y + 70 };
        nodes.push({
          id: stage.id,
          type: 'stage',
          position: { x, y: lane.y + 38 },
          zIndex: 1,
          data: {
            stage, status,
            focus: stage.id === focusId,
            selected: stage.id === selectedId,
            dim: laneOff,
          } satisfies StageNodeData,
        });
        const prev = lane.stages[i - 1];
        if (prev) {
          edges.push({
            id: `${prev.id}->${stage.id}`,
            source: prev.id,
            target: stage.id,
            style: { stroke: palette.hairlineBright, strokeWidth: 1.25 },
          });
        }
      });

      nodes.push({
        id: `lane-${lane.key}`,
        type: 'lane',
        position: { x: 0, y: lane.y },
        zIndex: 0,
        selectable: false,
        draggable: false,
        data: { label: lane.label, width, done: laneDone, total: laneTotal, accent: phaseAccent[lane.stages[0].phase], dim: laneOff } satisfies LaneNodeData,
      });
    }

    // Cross-lane flow (dashed): the primary verdict routing between rails.
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
      if (edges.some((e) => e.id === `${a}->${b}`)) continue;
      edges.push({
        id: `${a}->${b}`, source: a, target: b,
        style: { stroke: palette.faint, strokeWidth: 1, strokeDasharray: '4 4' },
      });
    }

    // Light up the edge feeding the focus node.
    for (const e of edges) {
      if (e.target === focusId) {
        e.animated = true;
        e.style = { ...e.style, stroke: palette.blue, strokeWidth: 1.5, strokeDasharray: undefined };
      }
    }

    const foundationStages = activeBranch === 'greenfield' ? FOUNDATION_GREENFIELD : FOUNDATION_BROWNFIELD;
    const fdn = foundationStages.reduce(
      (acc, s) => {
        const st = statusFor(state, feature, s);
        if (st !== 'skipped') acc.total++;
        if (st === 'done') acc.done++;
        return acc;
      },
      { done: 0, total: 0 },
    );
    const feat = [...PER_FEATURE, ...EXECUTION, ...QA_RELEASE].reduce(
      (acc, s) => {
        const st = statusFor(state, feature, s);
        if (st !== 'skipped') acc.total++;
        if (st === 'done') acc.done++;
        return acc;
      },
      { done: 0, total: 0 },
    );

    return { nodes, edges, foundationProgress: fdn, featureProgress: feat, focusPos: focusPos as { x: number; y: number } | null };
  }, [state, feature, activeBranch, branchKnown, focusId, selectedId]);

  const selectedStage = selectedId ? STAGE_BY_ID.get(selectedId) ?? null : null;
  const selectedStatus = selectedStage ? statusFor(state, feature, selectedStage) : 'pending';

  const locate = useCallback(() => {
    if (rf.current && focusPos) rf.current.setCenter(focusPos.x + NODE_W / 2, focusPos.y, { zoom: 0.95, duration: 400 });
  }, [focusPos]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* ---- top control bar ---- */}
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, px: 2.5, py: 1.25, borderBottom: `1px solid ${palette.hairline}`, flexShrink: 0, flexWrap: 'wrap' }}>
        <Typography sx={{ ...microLabel }}>
          Pipeline · click a stage for detail · launch to run its skill
        </Typography>

        {/* progress meters */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, ml: 1 }}>
          <ProgressPill label="Foundation" done={foundationProgress.done} total={foundationProgress.total} color={palette.blue} />
          {feature && <ProgressPill label={feature.slug} done={featureProgress.done} total={featureProgress.total} color={palette.violet} />}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <ToggleButtonGroup
          size="small"
          exclusive
          value={branchMode}
          onChange={(_, v: BranchMode | null) => v && setBranchMode(v)}
          sx={{ '& .MuiToggleButton-root': { py: 0.3, px: 1, fontSize: 11, textTransform: 'none', fontFamily: '"IBM Plex Mono", monospace' } }}
        >
          <ToggleButton value="auto">Auto{detected && detected !== 'unknown' ? ` · ${detected}` : ''}</ToggleButton>
          <ToggleButton value="greenfield">Greenfield</ToggleButton>
          <ToggleButton value="brownfield">Brownfield</ToggleButton>
        </ToggleButtonGroup>

        <Tooltip title="Center on the current stage">
          <span>
            <IconButton size="small" onClick={locate} disabled={!focusPos}>
              <MyLocationRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {features.length > 0 && (
          <Select
            size="small"
            value={feature?.slug ?? ''}
            onChange={(e) => setFeatureSlug(e.target.value)}
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

      {/* ---- canvas ---- */}
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={(inst) => {
            rf.current = inst;
            inst.setViewport({ x: 28, y: 12, zoom: 0.82 });
          }}
          onNodeClick={(_, node) => node.type === 'stage' && setSelectedId(node.id)}
          onNodeDoubleClick={(_, node) => node.type === 'stage' && launch(node.id)}
          onPaneClick={() => setSelectedId(null)}
          minZoom={0.3}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          colorMode="dark"
        >
          <Background color={palette.hairline} gap={28} />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => (n.type === 'lane' ? 'transparent' : statusColor[(n.data as StageNodeData).status] ?? palette.faint)}
            nodeStrokeColor={() => palette.hairlineBright}
            maskColor="#0A0E1499"
            style={{ background: palette.surface, border: `1px solid ${palette.hairline}` }}
          />
        </ReactFlow>

        {/* ---- detail panel ---- */}
        {selectedStage && (
          <StageDetail
            stage={selectedStage}
            status={selectedStatus}
            prompt={promptFor(selectedStage.id)}
            launching={spawn.isPending}
            onLaunch={() => launch(selectedStage.id)}
            onSelect={setSelectedId}
            onClose={() => setSelectedId(null)}
          />
        )}

        {/* ---- legend ---- */}
        <Stack
          direction="row"
          sx={{
            position: 'absolute', left: 12, bottom: 12, gap: 0.75, px: 1, py: 0.75,
            background: `${palette.surface}DD`, border: `1px solid ${palette.hairline}`, borderRadius: 1.5,
            backdropFilter: 'blur(4px)',
          }}
        >
          {(['done', 'in-progress', 'pending', 'skipped'] as const).map((s) => (
            <Stack key={s} direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: statusColor[s] }} />
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.muted }}>{s}</Typography>
            </Stack>
          ))}
        </Stack>

        {!state && (
          <Box
            sx={{
              position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
              px: 2, py: 1, background: `${palette.raised}EE`, border: `1px solid ${palette.hairline}`, borderRadius: 1.5,
            }}
          >
            <Typography sx={{ fontSize: 12.5, color: palette.muted }}>
              No chain state yet — start with <code style={{ color: palette.blue }}>/intake</code> (new idea) or{' '}
              <code style={{ color: palette.blue }}>/onboard</code> (existing code) from the Workspace.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------
function ProgressPill({ label, done, total, color }: { label: string; done: number; total: number; color: string }) {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, minWidth: 0 }}>
      <Typography sx={{ ...microLabel, color: palette.muted, maxWidth: 120 }} noWrap>{label}</Typography>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          width: 64, height: 4, borderRadius: 2, background: palette.hairline,
          '& .MuiLinearProgress-bar': { background: color, borderRadius: 2 },
        }}
      />
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: done === total && total > 0 ? palette.green : palette.faint }}>
        {done}/{total}
      </Typography>
    </Stack>
  );
}

function StageDetail({
  stage, status, prompt, launching, onLaunch, onSelect, onClose,
}: {
  stage: StageDef;
  status: StageStatus;
  prompt: string;
  launching: boolean;
  onLaunch: () => void;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const accent = phaseAccent[stage.phase] ?? palette.muted;
  const color = statusColor[status] ?? palette.faint;
  return (
    <Box
      sx={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: PANEL_W,
        background: `${palette.surface}F2`, borderLeft: `1px solid ${palette.hairline}`,
        backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', zIndex: 5,
        boxShadow: `-12px 0 28px ${palette.bg}AA`,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: `1px solid ${palette.hairline}` }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: accent }} />
        <Typography sx={{ ...microLabel, color: accent, flex: 1 }}>{stage.phase.replace('-', ' ')}</Typography>
        <IconButton size="small" onClick={onClose}><CloseRoundedIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1.75 }}>
        <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{stage.title}</Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: palette.blue }}>/{stage.id}</Typography>
          <Chip size="small" label={status} sx={{ color, background: `${color}18` }} />
          {stage.optional && <Chip size="small" label="optional" sx={{ color: palette.muted, background: palette.raised }} />}
        </Stack>

        <Stack direction="row" sx={{ gap: 0.5, mt: 1 }}>
          {stage.branches.map((b) => (
            <Chip key={b} size="small" label={b} sx={{ height: 18, fontSize: 9.5, color: palette.muted, background: palette.raised }} />
          ))}
        </Stack>

        <Typography sx={{ ...microLabel, mt: 2.5, mb: 0.75 }}>Status</Typography>
        <Typography sx={{ fontSize: 12.5, color: palette.text }}>{statusReason(status)}</Typography>

        <Typography sx={{ ...microLabel, mt: 2.5, mb: 0.75 }}>Artifact</Typography>
        <Box sx={{ px: 1, py: 0.75, background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.text, wordBreak: 'break-all' }}>
            {stage.artifact}
          </Typography>
        </Box>

        {stage.next.length > 0 && (
          <>
            <Typography sx={{ ...microLabel, mt: 2.5, mb: 0.75 }}>Feeds into</Typography>
            <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
              {stage.next.map((n) => {
                const exists = STAGE_BY_ID.has(n);
                return (
                  <Chip
                    key={n}
                    size="small"
                    icon={<ArrowForwardRoundedIcon sx={{ fontSize: 12 }} />}
                    label={n}
                    onClick={exists ? () => onSelect(n) : undefined}
                    clickable={exists}
                    sx={{
                      height: 20, fontSize: 10,
                      color: exists ? palette.text : palette.faint,
                      background: palette.raised,
                      '& .MuiChip-icon': { color: palette.faint },
                    }}
                  />
                );
              })}
            </Stack>
          </>
        )}
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${palette.hairline}` }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<BoltRoundedIcon />}
          onClick={onLaunch}
          disabled={launching}
          sx={{ background: palette.green, color: palette.bg, '&:hover': { background: palette.green, filter: 'brightness(1.1)' } }}
        >
          Launch {prompt}
        </Button>
        <Typography sx={{ fontSize: 10.5, color: palette.faint, mt: 0.75, textAlign: 'center' }}>
          opens a new Claude session in the Workspace
        </Typography>
      </Box>
    </Box>
  );
}
