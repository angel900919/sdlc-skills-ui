import { describe, expect, it } from 'vitest';
import { buildRecap, type RecapHookEvent } from './recap.js';
import type { TranscriptMessage } from './types.js';

function assistantMsg(timestamp: string, text: string, sessionId = 's1'): TranscriptMessage {
  return {
    uuid: `${sessionId}-${timestamp}`,
    sessionId,
    role: 'assistant',
    entryType: 'assistant',
    timestamp,
    blocks: [{ type: 'text', text }],
  };
}

function hook(
  hookEventName: string,
  receivedAt: string,
  toolName: string | null = null,
  payload: Record<string, unknown> = {},
): RecapHookEvent {
  return { hookEventName, receivedAt, toolName, payload };
}

describe('buildRecap', () => {
  const NOW = '2026-06-12T10:00:00.000Z';

  it('counts prompts, tool calls and commands from hook events after `since`', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: '2026-06-12T09:00:00.000Z',
      until: NOW,
      messages: [],
      hookEvents: [
        hook('UserPromptSubmit', '2026-06-12T08:59:00.000Z'), // before since — ignored
        hook('UserPromptSubmit', '2026-06-12T09:01:00.000Z'),
        hook('PreToolUse', '2026-06-12T09:02:00.000Z', 'Bash', { tool_input: { command: 'npm test' } }),
        hook('PreToolUse', '2026-06-12T09:03:00.000Z', 'Read'),
        hook('PostToolUse', '2026-06-12T09:03:30.000Z', 'Read'),
      ],
    });
    expect(recap.prompts).toBe(1);
    expect(recap.toolCalls).toBe(2);
    expect(recap.commandsRun).toBe(1);
  });

  it('counts assistant turns and surfaces the most recent assistant text', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: '2026-06-12T09:00:00.000Z',
      until: NOW,
      messages: [
        assistantMsg('2026-06-12T08:00:00.000Z', 'old turn — ignored'),
        assistantMsg('2026-06-12T09:10:00.000Z', 'first new turn'),
        assistantMsg('2026-06-12T09:20:00.000Z', '  All tests pass.  '),
      ],
      hookEvents: [],
    });
    expect(recap.assistantTurns).toBe(2);
    expect(recap.lastAssistantText).toBe('All tests pass.');
  });

  it('caps the assistant snippet length', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: null,
      until: NOW,
      messages: [assistantMsg('2026-06-12T09:20:00.000Z', 'x'.repeat(500))],
      hookEvents: [],
    });
    expect(recap.lastAssistantText).toHaveLength(280);
  });

  it('collects distinct edited files from PostToolUse mutation hooks', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: null,
      until: NOW,
      messages: [],
      hookEvents: [
        hook('PostToolUse', '2026-06-12T09:01:00.000Z', 'Edit', { tool_input: { file_path: '/a.ts' } }),
        hook('PostToolUse', '2026-06-12T09:02:00.000Z', 'Write', { tool_input: { file_path: '/b.ts' } }),
        hook('PostToolUse', '2026-06-12T09:03:00.000Z', 'Edit', { tool_input: { file_path: '/a.ts' } }),
        hook('PostToolUse', '2026-06-12T09:04:00.000Z', 'Read', { tool_input: { file_path: '/c.ts' } }),
      ],
    });
    expect(recap.filesEdited).toEqual(['/a.ts', '/b.ts']);
  });

  it('caps filesEdited at 20 entries', () => {
    const events = Array.from({ length: 30 }, (_, i) =>
      hook('PostToolUse', `2026-06-12T09:${String(i).padStart(2, '0')}:00.000Z`, 'Write', {
        tool_input: { file_path: `/f${i}.ts` },
      }),
    );
    const recap = buildRecap({ sessionId: 's1', since: null, until: NOW, messages: [], hookEvents: events });
    expect(recap.filesEdited).toHaveLength(20);
  });

  it('extracts chain verdicts from new assistant text only', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: '2026-06-12T09:00:00.000Z',
      until: NOW,
      messages: [
        assistantMsg('2026-06-12T08:00:00.000Z', 'READY-FOR-BUILD'), // old — ignored
        assistantMsg('2026-06-12T09:10:00.000Z', 'Slice merged. READY-FOR-QA'),
      ],
      hookEvents: [],
    });
    expect(recap.verdicts).toEqual([{ token: 'READY-FOR-QA', blockedReason: null }]);
  });

  it('treats a null `since` as everything unseen', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: null,
      until: NOW,
      messages: [assistantMsg('2020-01-01T00:00:00.000Z', 'ancient history')],
      hookEvents: [hook('UserPromptSubmit', '2020-01-01T00:00:00.000Z')],
    });
    expect(recap.assistantTurns).toBe(1);
    expect(recap.prompts).toBe(1);
  });

  it('sums activityCount from prompts, assistant turns and tool calls', () => {
    const recap = buildRecap({
      sessionId: 's1',
      since: null,
      until: NOW,
      messages: [assistantMsg('2026-06-12T09:10:00.000Z', 'done')],
      hookEvents: [
        hook('UserPromptSubmit', '2026-06-12T09:01:00.000Z'),
        hook('PreToolUse', '2026-06-12T09:02:00.000Z', 'Bash'),
      ],
    });
    expect(recap.activityCount).toBe(3);
  });

  it('returns a zeroed recap for no activity', () => {
    const recap = buildRecap({ sessionId: 's1', since: NOW, until: NOW, messages: [], hookEvents: [] });
    expect(recap).toEqual({
      sessionId: 's1',
      since: NOW,
      until: NOW,
      prompts: 0,
      assistantTurns: 0,
      toolCalls: 0,
      commandsRun: 0,
      filesEdited: [],
      verdicts: [],
      lastAssistantText: null,
      activityCount: 0,
    });
  });

  it('ignores non-text assistant blocks when building the snippet', () => {
    const msg: TranscriptMessage = {
      uuid: 'u1',
      sessionId: 's1',
      role: 'assistant',
      entryType: 'assistant',
      timestamp: '2026-06-12T09:10:00.000Z',
      blocks: [
        { type: 'tool_use', id: 't1', name: 'Bash', input: { command: 'ls' } },
        { type: 'text', text: 'Listing files now.' },
      ],
    };
    const recap = buildRecap({ sessionId: 's1', since: null, until: NOW, messages: [msg], hookEvents: [] });
    expect(recap.lastAssistantText).toBe('Listing files now.');
  });
});
