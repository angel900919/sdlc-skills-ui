import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import {
  ReactFlow, Background, Controls, MiniMap,
  type Edge, type Node, type NodeProps,
  Position, Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { ArchNodeStatus, ComponentNode } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { recordNavEvent, useArchitecture, useProjectState } from '../api/hooks.js';
import { ComponentInspector } from '../components/ComponentInspector.js';
import { SdlcProgress } from '../components/SdlcProgress.js';

type ArchView = 'graph' | 'sdlc';

const NODE_W = 188;
const NODE_H = 58;

/**
 * Static positions for the known components, laid out left-to-right by
 * dependency layer (web → api → workers → sinks, shared model beneath). Any
 * component not in this map falls back to a deterministic grid row, so the page
 * still renders if the declared model grows.
 */
const COMPONENT_POSITIONS: Record<string, { x: number; y: number }> = {
  RenderFlightDeck: { x: 40, y: 240 },
  ServeApiAndWs: { x: 320, y: 240 },
  RunClaudeSessions: { x: 600, y: 80 },
  DeriveProjectState: { x: 600, y: 400 },
  IngestObservability: { x: 880, y: 80 },
  PersistAndBroadcast: { x: 1160, y: 240 },
  ShareDomainModel: { x: 600, y: 640 },
};

// Arch-node statuses mapped onto the shared palette tokens (theme.statusColor
// doesn't carry the lowercase planned/unknown keys this vocabulary uses).
const STATUS_COLOR: Record<ArchNodeStatus, string> = {
  done: palette.green,
  'in-progress': palette.amber,
  planned: palette.blue,
  blocked: palette.red,
  unknown: palette.faint,
};

// A shape per status so status survives without colour (WCAG 1.4.1): the glyph
// distinguishes done/in-progress/planned/blocked for colour-blind users, while
// the colour stays as a redundant cue. Status is also in each node's ariaLabel.
const STATUS_GLYPH: Record<ArchNodeStatus, string> = {
  done: '✓',
  'in-progress': '◐',
  planned: '○',
  blocked: '✕',
  unknown: '·',
};

/**
 * react-flow types a node's `data` as a loose `Record<string, unknown>`, so the
 * render sites narrow it back to this shape with `data as ArchNodeData` — the
 * `extends Record<string, unknown>` keeps that assertion sound.
 */
interface ArchNodeData extends Record<string, unknown> {
  label: string;
  sub: string;
  status: ArchNodeStatus;
  external: boolean;
}

const handleStyle = { background: palette.hairlineBright, border: 'none', width: 6, height: 6 };

function ComponentGraphNode({ data }: NodeProps) {
  // see ArchNodeData: react-flow's NodeProps.data is untyped; narrow to our shape.
  const { label, sub, status, external } = data as ArchNodeData;
  const color = STATUS_COLOR[status] ?? palette.faint;
  return (
    <Box
      sx={{
        width: NODE_W,
        background: external ? 'transparent' : palette.surface,
        border: `1px ${external ? 'dashed' : 'solid'} ${external ? palette.hairlineBright : palette.hairline}`,
        borderLeft: external ? `1px dashed ${palette.hairlineBright}` : `3px solid ${color}`,
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
        opacity: external ? 0.7 : 1,
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        {!external && (
          <Typography
            aria-hidden
            sx={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, fontWeight: 700, lineHeight: 1,
              width: 12, textAlign: 'center', flexShrink: 0, color, textShadow: `0 0 6px ${color}`,
            }}
          >
            {STATUS_GLYPH[status] ?? '·'}
          </Typography>
        )}
        <Typography sx={{ fontSize: 12.5, fontWeight: 600, flex: 1, minWidth: 0 }} noWrap>{label}</Typography>
      </Stack>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.muted, mt: 0.4 }} noWrap>
        {sub}
      </Typography>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </Box>
  );
}

const nodeTypes = { component: ComponentGraphNode };

export function ArchitecturePage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data: model, isLoading, error } = useArchitecture(projectId);
  const { data: projectStateData } = useProjectState(projectId);
  const [view, setView] = useState<ArchView>('graph');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Record an adoption beacon when the tab opens for a project (the metric
  // numerator). Fire-and-forget — never blocks the render (NFR-4).
  useEffect(() => {
    if (projectId) recordNavEvent(projectId, '/architecture');
  }, [projectId]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedId((current) => (current === node.id ? null : node.id));
  }, []);

  // Keyboard activation: react-flow makes nodes focusable but only fires
  // onNodeClick on a mouse click, so Enter/Space on a focused node opened
  // nothing. Capture the key before react-flow and toggle the same inspector.
  const onGraphKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
    const nodeEl = (event.target as HTMLElement | null)?.closest?.('.react-flow__node[data-id]');
    const id = nodeEl?.getAttribute('data-id');
    if (!id) return;
    event.preventDefault();
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const selected: ComponentNode | null =
    (selectedId && model?.components.find((c) => c.id === selectedId)) || null;
  const inEdges = useMemo(
    () => (selected && model ? model.edges.filter((e) => e.to === selected.id) : []),
    [selected, model],
  );
  const outEdges = useMemo(
    () => (selected && model ? model.edges.filter((e) => e.from === selected.id) : []),
    [selected, model],
  );

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (!model) return { nodes, edges };

    const declared = new Set(model.components.map((c) => c.id));
    model.components.forEach((c, i) => {
      nodes.push({
        id: c.id,
        type: 'component',
        position: COMPONENT_POSITIONS[c.id] ?? { x: 40 + (i % 5) * 280, y: 820 },
        initialWidth: NODE_W,
        initialHeight: NODE_H,
        // Status in the accessible name — the glyph is aria-hidden, so this is
        // how assistive tech hears a node's status.
        ariaLabel: `${c.id}, status ${c.status}`,
        data: { label: c.id, sub: c.livesAt, status: c.status, external: false } satisfies ArchNodeData,
      });
    });

    // Edge endpoints that aren't declared components (external systems, the
    // "all components" aggregate) get faint anchor nodes so every edge draws —
    // the served model keeps them verbatim (NFR-3).
    const externals = new Set<string>();
    for (const edge of model.edges) {
      if (!declared.has(edge.from)) externals.add(edge.from);
      if (!declared.has(edge.to)) externals.add(edge.to);
    }
    [...externals].forEach((id, i) => {
      nodes.push({
        id,
        type: 'component',
        position: { x: 40 + i * 360, y: 860 },
        initialWidth: NODE_W,
        initialHeight: NODE_H,
        ariaLabel: `${id}, external system`,
        data: { label: id, sub: 'external', status: 'unknown', external: true } satisfies ArchNodeData,
      });
    });

    model.edges.forEach((edge, i) => {
      edges.push({
        id: `${edge.from}->${edge.to}#${i}`,
        source: edge.from,
        target: edge.to,
        label: edge.mode,
        style: { stroke: palette.hairlineBright, strokeWidth: 1.25 },
        labelStyle: { fill: palette.muted, fontSize: 9 },
        labelBgStyle: { fill: palette.bg, fillOpacity: 0.7 },
      });
    });

    return { nodes, edges };
  }, [model]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, px: 2.5, py: 1.25, borderBottom: `1px solid ${palette.hairline}`, flexShrink: 0 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, v: ArchView | null) => v && setView(v)}
          sx={{ '& .MuiToggleButton-root': { py: 0.3, px: 1, fontSize: 11, textTransform: 'none', fontFamily: '"IBM Plex Mono", monospace' } }}
        >
          <ToggleButton value="graph">System graph</ToggleButton>
          <ToggleButton value="sdlc">SDLC progress</ToggleButton>
        </ToggleButtonGroup>
        <Typography sx={{ ...microLabel }}>
          {view === 'graph'
            ? 'components and their dependencies, from the declared architecture model'
            : 'chain stages by phase, colored by status, next stage marked'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {view === 'graph' && model && (
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: palette.muted }}>
            {model.components.length} components · {model.edges.length} edges
          </Typography>
        )}
      </Stack>

      {view === 'sdlc' ? (
        <SdlcProgress projectId={projectId} state={projectStateData?.state ?? null} />
      ) : (
      <Box
        role="region"
        aria-label="System architecture graph"
        aria-busy={isLoading || undefined}
        onKeyDownCapture={onGraphKeyDown}
        sx={{
          flex: 1, minHeight: 0, position: 'relative',
          // react-flow zeroes the node outline and its focus box-shadow rule
          // doesn't cover our custom `component` node type; restore a visible
          // keyboard focus ring (double class beats react-flow's specificity).
          '& .react-flow__node.react-flow__node-component:focus-visible': {
            outline: `2px solid ${palette.blue}`,
            outlineOffset: '2px',
            borderRadius: '8px',
          },
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
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
            nodeColor={(n) => STATUS_COLOR[(n.data as ArchNodeData).status] ?? palette.faint}
            maskColor="#0A0E1499"
            style={{ background: palette.surface, border: `1px solid ${palette.hairline}` }}
          />
        </ReactFlow>

        <EmptyState projectId={projectId} isLoading={isLoading} error={error} hasModel={!!model} />

        {selected && (
          <ComponentInspector
            component={selected}
            inputs={inEdges}
            outputs={outEdges}
            onClose={() => setSelectedId(null)}
          />
        )}

        <Stack
          direction="row"
          sx={{
            position: 'absolute', left: 12, bottom: 12, gap: 0.75, px: 1, py: 0.75,
            background: `${palette.surface}DD`, border: `1px solid ${palette.hairline}`, borderRadius: 1.5,
            backdropFilter: 'blur(4px)',
          }}
        >
          {(['done', 'in-progress', 'planned', 'blocked'] as const).map((s) => (
            <Stack key={s} direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
              <Typography
                aria-hidden
                sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 700, lineHeight: 1, width: 12, textAlign: 'center', color: STATUS_COLOR[s] }}
              >
                {STATUS_GLYPH[s]}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.muted }}>{s}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
      )}
    </Box>
  );
}

function EmptyState({
  projectId, isLoading, error, hasModel,
}: {
  projectId: string | null;
  isLoading: boolean;
  error: unknown;
  hasModel: boolean;
}) {
  let message: string | null = null;
  if (!projectId) message = 'Select a project to see its system map.';
  else if (isLoading) message = 'Loading the architecture model…';
  else if (error) message = 'No declared architecture model — run /architect to generate one.';
  else if (!hasModel) message = 'No components declared yet.';
  if (!message) return null;
  return (
    <Box
      role="status"
      sx={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        px: 2, py: 1, background: `${palette.raised}EE`, border: `1px solid ${palette.hairline}`, borderRadius: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 12.5, color: palette.muted }}>{message}</Typography>
    </Box>
  );
}
