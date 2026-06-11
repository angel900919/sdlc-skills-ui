import { describe, expect, it } from 'vitest';
import type { HookEvent } from './types.js';
import { buildTrace, postToolUseFailed, summarizeToolInput, type TraceMarker, type TraceSpan } from './trace.js';

/** Deterministic clock: event id N is received at T0 + N seconds. */
const T0 = Date.parse('2026-06-11T10:00:00.000Z');
const at = (seconds: number) => new Date(T0 + seconds * 1000).toISOString();

function ev(id: number, hookEventName: string, overrides: Partial<HookEvent> = {}): HookEvent {
  return {
    id,
    receivedAt: at(id),
    hookEventName,
    sessionId: 'sess-1',
    cwd: null,
    toolName: null,
    payload: {},
    ...overrides,
  };
}

const spans = (entries: ReturnType<typeof buildTrace>['entries']) =>
  entries.filter((e): e is TraceSpan => e.kind === 'span');
const markers = (entries: ReturnType<typeof buildTrace>['entries']) =>
  entries.filter((e): e is TraceMarker => e.kind === 'marker');

describe('buildTrace pairing', () => {
  it('pairs PreToolUse/PostToolUse FIFO across interleaved calls of the same tool', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'PreToolUse', { toolName: 'Bash', payload: { tool_input: { command: 'echo first' } } }),
      ev(2, 'PreToolUse', { toolName: 'Bash', payload: { tool_input: { command: 'echo second' } } }),
      // First Post closes the EARLIEST open Bash span (id 1), not the latest.
      ev(3, 'PostToolUse', { toolName: 'Bash', payload: { tool_response: { is_error: true } } }),
      ev(4, 'PostToolUse', { toolName: 'Bash', payload: { tool_response: { success: true } } }),
    ]);

    const [first, second] = spans(trace.entries);
    expect(spans(trace.entries)).toHaveLength(2);

    expect(first.id).toBe(1);
    expect(first.inputSummary).toBe('echo first');
    expect(first.endedAt).toBe(at(3));
    expect(first.durationMs).toBe(2000);
    expect(first.status).toBe('error'); // proves id-3 closed the id-1 span

    expect(second.id).toBe(2);
    expect(second.inputSummary).toBe('echo second');
    expect(second.endedAt).toBe(at(4));
    expect(second.durationMs).toBe(2000);
    expect(second.status).toBe('ok');

    expect(trace.spanCount).toBe(2);
    expect(trace.openSpanCount).toBe(0);
  });

  it('never pairs across different tools', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'PreToolUse', { toolName: 'Bash' }),
      ev(2, 'PostToolUse', { toolName: 'Read' }),
    ]);

    const [bash] = spans(trace.entries);
    expect(bash.tool).toBe('Bash');
    expect(bash.status).toBe('open');
    expect(markers(trace.entries)).toHaveLength(1);
    expect(markers(trace.entries)[0].label).toBe('Read (unmatched PostToolUse)');
  });

  it('walks events in id order even when the input array is shuffled', () => {
    const trace = buildTrace('sess-1', [
      ev(4, 'PostToolUse', { toolName: 'Bash' }),
      ev(1, 'SessionStart', { payload: { source: 'startup' } }),
      ev(3, 'PreToolUse', { toolName: 'Bash' }),
      ev(2, 'UserPromptSubmit', { payload: { prompt: 'go' } }),
    ]);

    expect(trace.entries.map((e) => e.id)).toEqual([1, 2, 3]); // span sits at its Pre position
    const [span] = spans(trace.entries);
    expect(span.status).toBe('ok');
    expect(span.durationMs).toBe(1000);
    expect(trace.startedAt).toBe(at(1));
    expect(trace.endedAt).toBe(at(4));
    expect(trace.totalDurationMs).toBe(3000);
  });

  it('returns an empty trace for no events', () => {
    const trace = buildTrace('sess-1', []);
    expect(trace).toMatchObject({
      sessionId: 'sess-1',
      startedAt: null,
      endedAt: null,
      totalDurationMs: null,
      maxSpanDurationMs: 0,
      spanCount: 0,
      openSpanCount: 0,
      entries: [],
    });
  });
});

describe('buildTrace error status', () => {
  it.each([
    [{ tool_response: { is_error: true } }, 'error'],
    [{ tool_response: { success: false } }, 'error'],
    [{ tool_response: { success: true } }, 'ok'],
    [{ tool_response: { stdout: 'fine' } }, 'ok'],
    [{}, 'ok'], // no tool_response at all
  ] as const)('PostToolUse payload %j → span status %s', (payload, expected) => {
    const trace = buildTrace('sess-1', [
      ev(1, 'PreToolUse', { toolName: 'Write' }),
      ev(2, 'PostToolUse', { toolName: 'Write', payload: payload as Record<string, unknown> }),
    ]);
    expect(spans(trace.entries)[0].status).toBe(expected);
  });

  it('postToolUseFailed ignores non-object tool_response', () => {
    expect(postToolUseFailed({ tool_response: 'oops' })).toBe(false);
    expect(postToolUseFailed({ tool_response: { is_error: false } })).toBe(false);
    expect(postToolUseFailed({})).toBe(false);
  });
});

describe('buildTrace unmatched events', () => {
  it('keeps an unmatched PreToolUse as an open span', () => {
    const trace = buildTrace('sess-1', [ev(1, 'PreToolUse', { toolName: 'Bash' })]);
    const [span] = spans(trace.entries);
    expect(span.status).toBe('open');
    expect(span.endedAt).toBeNull();
    expect(span.durationMs).toBeNull();
    expect(trace.spanCount).toBe(1);
    expect(trace.openSpanCount).toBe(1);
  });

  it('degrades an unmatched PostToolUse to a marker so nothing is lost', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'PostToolUse', { toolName: 'Grep' }),
    ]);
    expect(spans(trace.entries)).toHaveLength(0);
    expect(trace.entries[0]).toMatchObject({
      kind: 'marker',
      id: 1,
      event: 'PostToolUse',
      at: at(1),
      label: 'Grep (unmatched PostToolUse)',
    });
  });

  it('a second Post for a tool with one open span degrades to a marker', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'PreToolUse', { toolName: 'Bash' }),
      ev(2, 'PostToolUse', { toolName: 'Bash' }),
      ev(3, 'PostToolUse', { toolName: 'Bash' }),
    ]);
    expect(spans(trace.entries)).toHaveLength(1);
    expect(spans(trace.entries)[0].status).toBe('ok');
    expect(markers(trace.entries)[0].label).toBe('Bash (unmatched PostToolUse)');
  });
});

describe('buildTrace markers and labels', () => {
  it('truncates long prompts to 140 chars ending in an ellipsis', () => {
    const prompt = 'p'.repeat(300);
    const trace = buildTrace('sess-1', [ev(1, 'UserPromptSubmit', { payload: { prompt } })]);
    const [marker] = markers(trace.entries);
    expect(marker.label).toHaveLength(140);
    expect(marker.label.endsWith('…')).toBe(true);
    expect(marker.label.startsWith('ppp')).toBe(true);
  });

  it('collapses whitespace in prompt labels', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'UserPromptSubmit', { payload: { prompt: '  fix\n\tthe   bug  ' } }),
    ]);
    expect(markers(trace.entries)[0].label).toBe('fix the bug');
  });

  it('labels lifecycle markers from their payloads', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'SessionStart', { payload: { source: 'resume' } }),
      ev(2, 'Stop'),
      ev(3, 'Notification', { payload: { message: 'needs permission' } }),
      ev(4, 'SessionEnd', { payload: { reason: 'logout' } }),
    ]);
    expect(markers(trace.entries).map((m) => m.label)).toEqual([
      'source: resume',
      'response complete',
      'needs permission',
      'reason: logout',
    ]);
  });
});

describe('buildTrace maxSpanDurationMs', () => {
  it('is the longest CLOSED span duration; open spans do not count', () => {
    const trace = buildTrace('sess-1', [
      ev(1, 'PreToolUse', { toolName: 'Read' }),
      ev(2, 'PreToolUse', { toolName: 'Bash' }),
      ev(3, 'PostToolUse', { toolName: 'Read' }), // 2s
      ev(9, 'PostToolUse', { toolName: 'Bash' }), // 7s
      ev(10, 'PreToolUse', { toolName: 'Task' }), // still open
    ]);
    expect(trace.maxSpanDurationMs).toBe(7000);
    expect(trace.openSpanCount).toBe(1);
  });
});

describe('summarizeToolInput', () => {
  it('prefers file_path over command', () => {
    expect(
      summarizeToolInput({ tool_input: { file_path: '/repo/src/app.ts', command: 'cat x' } }),
    ).toBe('/repo/src/app.ts');
  });

  it('summarizes a bash command', () => {
    expect(summarizeToolInput({ tool_input: { command: 'npm run build' } })).toBe('npm run build');
  });

  it('summarizes a url', () => {
    expect(summarizeToolInput({ tool_input: { url: 'https://example.com/docs' } })).toBe(
      'https://example.com/docs',
    );
  });

  it('returns null when there is nothing descriptive', () => {
    expect(summarizeToolInput({ tool_input: {} })).toBeNull();
    expect(summarizeToolInput({})).toBeNull();
    expect(summarizeToolInput({ tool_input: { command: '   ' } })).toBeNull();
  });

  it('truncates long values to 120 chars', () => {
    const summary = summarizeToolInput({ tool_input: { command: 'x'.repeat(500) } });
    expect(summary).toHaveLength(120);
    expect(summary!.endsWith('…')).toBe(true);
  });
});
