import type { TranscriptMessage } from '@sdlc/shared';
import { extractVerdicts, nextSkillFor } from '@sdlc/shared';
import { bus } from '../bus.js';

/**
 * Watches assistant transcript text for chain verdict tokens
 * (READY-FOR-QA, BLOCKED-ON…) and turns them into audit events + live
 * broadcasts so the Pipeline can advance and offer the next launch.
 * Deduped per (session, token) — skills often restate their verdict.
 */

const seen = new Set<string>();

export function watchForVerdicts(msg: TranscriptMessage, projectId: string | null): void {
  if (msg.role !== 'assistant') return;
  const text = msg.blocks
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text)
    .join('\n');
  if (!text) return;

  for (const verdict of extractVerdicts(text)) {
    const key = `${msg.sessionId}:${verdict.token}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const nextSkill = nextSkillFor(verdict.token);
    bus.audit({
      source: 'transcript',
      kind: 'verdict',
      projectId,
      sessionId: msg.sessionId,
      summary:
        verdict.token === 'BLOCKED-ON'
          ? `Chain verdict: BLOCKED-ON ${verdict.blockedReason ?? ''}`.trim()
          : `Chain verdict: ${verdict.token}${nextSkill ? ` → /${nextSkill}` : ''}`,
      detail: { token: verdict.token, nextSkill, blockedReason: verdict.blockedReason },
    });
    bus.broadcast({
      type: 'verdict',
      projectId,
      sessionId: msg.sessionId,
      token: verdict.token,
      nextSkill,
      blockedReason: verdict.blockedReason,
    });
  }
}
