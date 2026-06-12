import { describe, expect, it } from 'vitest';
import { attentionTransitionFor } from './attention.js';

describe('attentionTransitionFor', () => {
  it('Notification sets attention', () => {
    expect(attentionTransitionFor('Notification')).toBe('set');
  });

  it('forward progress clears attention', () => {
    for (const ev of ['UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd']) {
      expect(attentionTransitionFor(ev)).toBe('clear');
    }
  });

  it('unrelated hooks leave attention untouched', () => {
    expect(attentionTransitionFor('SessionStart')).toBe('none');
    expect(attentionTransitionFor('SubagentStop')).toBe('none');
    expect(attentionTransitionFor('SomethingNew')).toBe('none');
  });
});
