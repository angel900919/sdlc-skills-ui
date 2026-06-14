import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { ArchEdge, ArchNodeStatus, ComponentNode } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';

const STATUS_COLOR: Record<ArchNodeStatus, string> = {
  done: palette.green,
  'in-progress': palette.amber,
  planned: palette.blue,
  blocked: palette.red,
  unknown: palette.faint,
};

interface ComponentInspectorProps {
  readonly component: ComponentNode;
  /** Edges incoming to this component (its inputs / upstream dependencies). */
  readonly inputs: readonly ArchEdge[];
  /** Edges outgoing from this component (its outputs / downstream calls). */
  readonly outputs: readonly ArchEdge[];
  readonly onClose: () => void;
}

/**
 * The side panel that opens when a component node is clicked — the jump from
 * "this box" to the real work. Shows the component's role, where it lives, its
 * inputs/outputs/dependencies (from the edges), and the work join: the feature
 * it maps to plus that feature's slices and tracker refs. A component with no
 * resolvable feature renders an honest "unlinked" rather than a fabricated link.
 */
export function ComponentInspector({ component, inputs, outputs, onClose }: ComponentInspectorProps) {
  const color = STATUS_COLOR[component.status] ?? palette.faint;
  return (
    <Box
      role="complementary"
      aria-label={`${component.id} inspector`}
      sx={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 360, zIndex: 5,
        background: `${palette.raised}F2`, borderLeft: `1px solid ${palette.hairline}`,
        backdropFilter: 'blur(6px)', overflowY: 'auto', px: 2.5, py: 2,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 15, fontWeight: 700, flex: 1, minWidth: 0 }} noWrap>{component.id}</Typography>
        <Typography
          component="button"
          onClick={onClose}
          aria-label="Close inspector"
          sx={{
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: palette.muted,
            background: 'none', border: 'none', cursor: 'pointer', px: 0.5, '&:hover': { color: palette.text },
          }}
        >
          ✕
        </Typography>
      </Stack>

      <Section label="status">
        <Typography sx={{ fontSize: 12.5, color }}>{component.status}</Typography>
      </Section>

      <Section label="role">
        <Typography sx={{ fontSize: 12.5, color: palette.text }}>{component.role}</Typography>
      </Section>

      <Section label="files">
        <Mono>{component.livesAt}</Mono>
      </Section>

      <Section label="inputs">
        <EdgeList edges={inputs} endpoint={(e) => e.from} empty="no inbound dependencies" />
      </Section>

      <Section label="outputs / dependencies">
        <EdgeList edges={outputs} endpoint={(e) => e.to} empty="no outbound dependencies" />
      </Section>

      <Section label="work">
        {component.feature ? (
          <Stack sx={{ gap: 0.75 }}>
            <Mono>{component.feature}</Mono>
            {component.slices.map((slice) => (
              <Stack key={slice.id} direction="row" sx={{ alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ fontSize: 11.5, color: palette.muted, minWidth: 56 }}>{slice.id}</Typography>
                <Typography sx={{ fontSize: 11.5, color: palette.text, flex: 1, minWidth: 0 }} noWrap>{slice.title}</Typography>
                <Typography sx={{ fontSize: 10.5, color: STATUS_COLOR[normalizeStatus(slice.status)] ?? palette.faint }}>
                  {slice.status}
                </Typography>
                {issueRef(slice.issueRefs) && <Mono>{issueRef(slice.issueRefs)}</Mono>}
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: 12, color: palette.faint, fontStyle: 'italic' }}>
            unlinked — no feature maps to this component yet
          </Typography>
        )}
      </Section>
    </Box>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Typography sx={{ ...microLabel, mb: 0.5 }}>{label}</Typography>
      {children}
    </Box>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.muted, wordBreak: 'break-all' }}>
      {children}
    </Typography>
  );
}

function EdgeList({
  edges, endpoint, empty,
}: {
  edges: readonly ArchEdge[];
  endpoint: (edge: ArchEdge) => string;
  empty: string;
}) {
  if (edges.length === 0) {
    return <Typography sx={{ fontSize: 11.5, color: palette.faint, fontStyle: 'italic' }}>{empty}</Typography>;
  }
  return (
    <Stack sx={{ gap: 0.4 }}>
      {edges.map((edge, i) => (
        <Stack key={`${endpoint(edge)}#${i}`} direction="row" sx={{ alignItems: 'baseline', gap: 0.75 }}>
          <Typography sx={{ fontSize: 12, color: palette.text, flex: 1, minWidth: 0 }} noWrap>{endpoint(edge)}</Typography>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, color: palette.faint }}>{edge.mode}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

/** The first tracker ref on a slice (e.g. `beads: scc-byg` → `scc-byg`), if any. */
function issueRef(refs: Record<string, string>): string | null {
  const first = Object.values(refs)[0];
  return first ?? null;
}

/** Slice statuses use the FeatureSliceState vocabulary; map onto arch-node colors. */
function normalizeStatus(status: string): ArchNodeStatus {
  switch (status) {
    case 'blocked':
      return 'blocked';
    case 'in-progress':
      return 'in-progress';
    case 'merged':
      return 'done';
    case 'planned':
    case 'published':
      return 'planned';
    default:
      return 'unknown';
  }
}
