import { randomUUID } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { isValidSessionId } from './sessionId.js';

describe('isValidSessionId — the resume-id traversal/injection guard', () => {
  it('accepts a real randomUUID() session id (any case)', () => {
    expect(isValidSessionId(randomUUID())).toBe(true);
    expect(isValidSessionId('0F9C2A1B-1234-4ABC-89DE-0123456789AB')).toBe(true);
  });

  it('rejects a path-traversal id, a CLI-flag id, and other non-UUID shapes', () => {
    expect(isValidSessionId('../../../../etc/passwd')).toBe(false);
    expect(isValidSessionId('00000000-0000-0000-0000-000000000000/../x')).toBe(false);
    expect(isValidSessionId('-rf')).toBe(false);
    expect(isValidSessionId('not-a-uuid')).toBe(false);
    expect(isValidSessionId('')).toBe(false);
  });
});
