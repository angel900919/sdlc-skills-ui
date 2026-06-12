/**
 * Transcript → Markdown export. Produces a human-readable session record
 * (for docs, handoffs, or feeding back into a future session). Tool calls
 * are kept as one-line summaries; tool results and thinking are omitted —
 * they dominate raw transcripts but rarely matter in an export.
 */
import type { ClaudeSession, TranscriptContentBlock, TranscriptMessage } from './types.js';

export function transcriptToMarkdown(session: ClaudeSession, messages: TranscriptMessage[]): string {
  const lines: string[] = [
    `# ${session.title}`,
    '',
    `> Session \`${session.id.slice(0, 8)}\` · ${session.cwd} · started ${session.createdAt}` +
      (session.endedAt ? ` · ended ${session.endedAt}` : ''),
    '',
  ];

  let rendered = 0;
  for (const msg of messages) {
    const body = renderBlocks(msg.blocks);
    if (!body.trim()) continue;
    lines.push(`## ${msg.role === 'user' ? '👤 User' : msg.role === 'assistant' ? '🤖 Assistant' : 'ℹ️ System'}`);
    lines.push('');
    lines.push(body.trim());
    lines.push('');
    rendered++;
  }

  if (rendered === 0) lines.push('_No transcript messages._');
  return lines.join('\n');
}

function renderBlocks(blocks: TranscriptContentBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case 'text':
        if (block.text) parts.push(block.text);
        break;
      case 'tool_use':
        parts.push(`- 🔧 \`${block.name ?? 'tool'}\`${toolHint(block.input)}`);
        break;
      default:
        // tool_result, thinking, images… intentionally omitted from exports.
        break;
    }
  }
  return parts.join('\n\n');
}

function toolHint(input: unknown): string {
  if (!input || typeof input !== 'object') return '';
  const o = input as Record<string, unknown>;
  const hint =
    (typeof o.file_path === 'string' && o.file_path) ||
    (typeof o.command === 'string' && o.command.slice(0, 80)) ||
    (typeof o.pattern === 'string' && `pattern: ${o.pattern}`) ||
    (typeof o.url === 'string' && o.url) ||
    '';
  return hint ? ` — ${hint}` : '';
}
