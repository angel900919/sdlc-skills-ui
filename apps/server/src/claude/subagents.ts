import fs from 'node:fs';
import path from 'node:path';
import type { SubagentInfo, UsageSample } from '@sdlc/shared';
import { aggregateUsage, extractUsageSample } from '@sdlc/shared';
import { transcriptDirFor } from '../config.js';

/**
 * Reads subagent transcripts on demand. Claude Code writes each spawned
 * agent to <transcriptDir>/<sessionId>/subagents/agent-<id>.jsonl; the
 * first user line carries the task prompt. Read-only — files are small
 * relative to main transcripts and this endpoint is fetched per-session.
 */

const MAX_TASK_CHARS = 280;

export function listSubagents(sessionId: string, cwd: string): SubagentInfo[] {
  const dir = path.join(transcriptDirFor(cwd), sessionId, 'subagents');
  let entries: string[];
  try {
    entries = fs.readdirSync(dir).filter((f) => f.startsWith('agent-') && f.endsWith('.jsonl'));
  } catch {
    return [];
  }

  const out: SubagentInfo[] = [];
  for (const file of entries.sort()) {
    const info = readAgentFile(path.join(dir, file));
    if (info) out.push(info);
  }
  out.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''));
  return out;
}

function readAgentFile(file: string): SubagentInfo | null {
  let raw: string;
  try {
    raw = fs.readFileSync(file, 'utf-8');
  } catch {
    return null;
  }

  let agentId = path.basename(file).replace(/^agent-|\.jsonl$/g, '');
  let task = '';
  let startedAt: string | null = null;
  const samples: UsageSample[] = [];

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    let entry: Record<string, unknown>;
    try {
      entry = JSON.parse(line) as Record<string, unknown>;
    } catch {
      continue;
    }
    if (typeof entry.agentId === 'string') agentId = entry.agentId;
    if (!startedAt && typeof entry.timestamp === 'string') startedAt = entry.timestamp;
    if (!task && entry.type === 'user') {
      task = firstUserText(entry);
    }
    const sample = extractUsageSample(entry);
    if (sample) samples.push(sample);
  }

  const usage = aggregateUsage(samples);
  return {
    agentId,
    task: task.slice(0, MAX_TASK_CHARS),
    model: usage.model,
    messages: usage.messages,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    cacheReadTokens: usage.cacheReadTokens,
    cacheWriteTokens: usage.cacheWriteTokens,
    estCostUsd: usage.estCostUsd,
    startedAt,
  };
}

function firstUserText(entry: Record<string, unknown>): string {
  const message = entry.message as Record<string, unknown> | undefined;
  const content = message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    for (const block of content as Record<string, unknown>[]) {
      if (block.type === 'text' && typeof block.text === 'string') return block.text;
    }
  }
  return '';
}
