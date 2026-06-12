import type { SessionAttention } from '@sdlc/shared';
import { bus } from '../bus.js';

/**
 * "Blocked on you" tracking. The Claude CLI fires the Notification hook
 * when it needs the human (permission prompt, idle waiting); any sign of
 * forward progress (a prompt, a tool call, session end, terminal input)
 * clears it. State is in-memory — it describes live sessions only.
 */

export type AttentionTransition = 'set' | 'clear' | 'none';

/** Pure mapping from a hook event name to an attention transition. */
export function attentionTransitionFor(hookEventName: string): AttentionTransition {
  switch (hookEventName) {
    case 'Notification':
      return 'set';
    case 'UserPromptSubmit':
    case 'PreToolUse':
    case 'PostToolUse':
    case 'SessionEnd':
    case 'Stop':
      return 'clear';
    default:
      return 'none';
  }
}

const attention = new Map<string, SessionAttention>();

export function applyHookToAttention(hookEventName: string, sessionId: string | null, message: string): void {
  if (!sessionId) return;
  const transition = attentionTransitionFor(hookEventName);
  if (transition === 'set') {
    const entry: SessionAttention = { sessionId, message: message || 'Claude needs your input', since: new Date().toISOString() };
    attention.set(sessionId, entry);
    bus.broadcast({ type: 'session-attention', sessionId, attention: entry });
  } else if (transition === 'clear') {
    clearAttention(sessionId);
  }
}

export function clearAttention(sessionId: string): void {
  if (attention.delete(sessionId)) {
    bus.broadcast({ type: 'session-attention', sessionId, attention: null });
  }
}

export function getAttention(sessionId: string): SessionAttention | null {
  return attention.get(sessionId) ?? null;
}

export function listAttention(): SessionAttention[] {
  return [...attention.values()];
}
