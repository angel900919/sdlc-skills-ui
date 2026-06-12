import { describe, expect, it } from 'vitest';
import type { ClaudeSession, TranscriptMessage } from './types.js';
import { transcriptToMarkdown } from './markdownExport.js';

const session: ClaudeSession = {
  id: 'abc12345-0000-0000-0000-000000000000',
  projectId: 'p1',
  cwd: '/work/repo',
  title: '/prd checkout',
  status: 'exited',
  pid: null,
  exitCode: 0,
  launchPrompt: '/prd checkout',
  createdAt: '2026-06-12T10:00:00.000Z',
  endedAt: '2026-06-12T10:30:00.000Z',
  resumedFromSessionId: null,
  permissionMode: 'default',
  worktreePath: null,
  lastSeenAt: null,
};

function msg(role: TranscriptMessage['role'], blocks: TranscriptMessage['blocks'], uuid = 'u'): TranscriptMessage {
  return { uuid, sessionId: session.id, role, timestamp: '2026-06-12T10:01:00.000Z', blocks, entryType: role };
}

describe('transcriptToMarkdown', () => {
  it('renders a header with session metadata and role sections', () => {
    const md = transcriptToMarkdown(session, [
      msg('user', [{ type: 'text', text: 'write the PRD' }], 'u1'),
      msg('assistant', [{ type: 'text', text: 'Here is the PRD…' }], 'u2'),
    ]);
    expect(md).toContain('# /prd checkout');
    expect(md).toContain('abc12345');
    expect(md).toContain('## 👤 User');
    expect(md).toContain('write the PRD');
    expect(md).toContain('## 🤖 Assistant');
    expect(md).toContain('Here is the PRD…');
  });

  it('renders tool calls compactly and skips tool results bodies', () => {
    const md = transcriptToMarkdown(session, [
      msg('assistant', [
        { type: 'tool_use', name: 'Edit', id: 't1', input: { file_path: '/work/repo/a.ts' } },
        { type: 'text', text: 'Edited the file.' },
      ], 'u3'),
      msg('user', [{ type: 'tool_result', tool_use_id: 't1', content: 'big output we do not export' }], 'u4'),
    ]);
    expect(md).toContain('`Edit`');
    expect(md).toContain('a.ts');
    expect(md).not.toContain('big output we do not export');
  });

  it('skips thinking blocks', () => {
    const md = transcriptToMarkdown(session, [
      msg('assistant', [
        { type: 'thinking', text: 'private reasoning' },
        { type: 'text', text: 'public answer' },
      ]),
    ]);
    expect(md).not.toContain('private reasoning');
    expect(md).toContain('public answer');
  });

  it('handles an empty transcript', () => {
    const md = transcriptToMarkdown(session, []);
    expect(md).toContain('# /prd checkout');
    expect(md).toContain('_No transcript messages._');
  });
});
