import { useEffect, useRef } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import type { TraceMarker, TraceSpan } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useSessionTrace } from '../api/hooks.js';

const mono = '"IBM Plex Mono", monospace';

const MARKER_COLOR: Record<string, string> = {
  SessionStart: palette.green,
  SessionEnd: palette.amber,
  UserPromptSubmit: palette.violet,
  Stop: palette.green,
  SubagentStop: palette.blue,
  Notification: palette.amber,
};

const MARKER_SHORT: Record<string, string> = {
  SessionStart: 'SESSION ▶',
  SessionEnd: 'SESSION ■',
  UserPromptSubmit: 'PROMPT',
  Stop: 'STOP',
  SubagentStop: 'SUBAGENT ■',
  Notification: 'NOTIFY',
};

function fmtMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 10_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

/** Fixed column widths so bars align like an instrument readout. */
const COL_TIME = 60;
const COL_NAME = 116;
const COL_SUMMARY = '24%';
const COL_DURATION = 64;

function SpanRow({ span, maxMs, live }: { span: TraceSpan; maxMs: number; live: boolean }) {
  const open = span.status === 'open';
  const color = span.status === 'error' ? palette.red : open ? palette.amber : palette.blue;
  const pct = open ? 100 : maxMs > 0 ? Math.max(2, ((span.durationMs ?? 0) / maxMs) * 100) : 100;
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25, px: 1.5, py: 0.45, '&:hover': { background: palette.raised } }}>
      <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.faint, width: COL_TIME, flexShrink: 0 }}>
        {span.startedAt.slice(11, 19)}
      </Typography>
      <Typography noWrap sx={{ fontFamily: mono, fontSize: 11.5, color, width: COL_NAME, flexShrink: 0 }}>
        {span.tool}
      </Typography>
      <Tooltip title={span.inputSummary ?? ''} placement="top-start">
        <Typography noWrap sx={{ fontFamily: mono, fontSize: 10.5, color: palette.faint, width: COL_SUMMARY, flexShrink: 0, minWidth: 0 }}>
          {span.inputSummary ?? ''}
        </Typography>
      </Tooltip>
      <Box sx={{ flex: 1, minWidth: 0, height: 10 }}>
        <Box
          sx={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 0.5,
            background: open ? `${color}26` : `linear-gradient(90deg, ${color}B3, ${color}4D)`,
            border: open ? `1px dashed ${color}` : `1px solid ${color}55`,
            boxShadow: open ? 'none' : `0 0 6px ${color}30`,
          }}
        />
      </Box>
      <Typography sx={{ fontFamily: mono, fontSize: 11, color: open ? palette.amber : palette.muted, width: COL_DURATION, flexShrink: 0, textAlign: 'right' }}>
        {open ? (live ? 'running…' : 'open') : fmtMs(span.durationMs ?? 0)}
      </Typography>
    </Stack>
  );
}

function MarkerRow({ marker }: { marker: TraceMarker }) {
  const color = MARKER_COLOR[marker.event] ?? palette.muted;
  const short =
    MARKER_SHORT[marker.event] ?? marker.event.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
  const isPrompt = marker.event === 'UserPromptSubmit';
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25, px: 1.5, py: 0.3, '&:hover': { background: palette.raised } }}>
      <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.faint, width: COL_TIME, flexShrink: 0 }}>
        {marker.at.slice(11, 19)}
      </Typography>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, width: COL_NAME, flexShrink: 0 }}>
        <Box sx={{ width: 5, height: 5, transform: 'rotate(45deg)', background: color, boxShadow: `0 0 4px ${color}`, flexShrink: 0 }} />
        <Typography noWrap sx={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.08em', color }}>
          {short}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: isPrompt ? 12 : 11.5, color: isPrompt ? palette.text : palette.muted, minWidth: 0, maxWidth: '70%' }}>
          {marker.label}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 8, height: 1, background: `${color}33` }} />
      </Stack>
    </Stack>
  );
}

/**
 * Per-session execution trace assembled from hook events: each
 * PreToolUse→PostToolUse pair is a duration span (bar width proportional to
 * the longest span), lifecycle hooks render as thin instant markers.
 * Live refresh: WsBridge invalidates ['trace', sessionId] on every incoming
 * hook-event for this session.
 */
export function TraceView({ sessionId, live }: { sessionId: string; live: boolean }) {
  const { data: trace, isLoading } = useSessionTrace(sessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const entryCount = trace?.entries.length ?? 0;

  // Follow the tail as new events stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entryCount]);

  if (isLoading) {
    return <Typography sx={{ ...microLabel, p: 2 }}>Loading trace…</Typography>;
  }
  if (!trace || trace.entries.length === 0) {
    return (
      <Typography sx={{ ...microLabel, p: 2 }}>
        No hook events captured for this session yet
      </Typography>
    );
  }

  const markerCount = trace.entries.length - trace.spanCount;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', gap: 2, px: 1.5, py: 0.75, borderBottom: `1px solid ${palette.hairline}`, background: palette.surface, flexShrink: 0 }}
      >
        <Typography sx={{ ...microLabel }}>Trace</Typography>
        <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.muted }}>
          {trace.spanCount} tool span{trace.spanCount === 1 ? '' : 's'}
          {trace.openSpanCount > 0 && (
            <Box component="span" sx={{ color: palette.amber }}> · {trace.openSpanCount} open</Box>
          )}
          {' · '}{markerCount} event{markerCount === 1 ? '' : 's'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {trace.maxSpanDurationMs > 0 && (
          <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.faint }}>
            longest {fmtMs(trace.maxSpanDurationMs)}
          </Typography>
        )}
        {trace.totalDurationMs !== null && (
          <Typography sx={{ fontFamily: mono, fontSize: 11, color: palette.faint }}>
            total {fmtMs(trace.totalDurationMs)}
          </Typography>
        )}
      </Stack>
      <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', minHeight: 0, py: 0.5 }}>
        {trace.entries.map((entry) =>
          entry.kind === 'span' ? (
            <SpanRow key={`s${entry.id}`} span={entry} maxMs={trace.maxSpanDurationMs} live={live} />
          ) : (
            <MarkerRow key={`m${entry.id}`} marker={entry} />
          ),
        )}
      </Box>
    </Box>
  );
}
