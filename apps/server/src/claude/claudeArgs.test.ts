import { describe, expect, it } from 'vitest';
import { buildClaudeArgs, resolvePermissionMode } from './claudeArgs.js';

describe('buildClaudeArgs', () => {
  const base = { settingsFile: '/data/hooks.json', sessionId: 'abc', resume: false } as const;

  it('default mode adds no permission flag', () => {
    expect(buildClaudeArgs({ ...base, permissionMode: 'default' })).toEqual([
      '--settings', '/data/hooks.json', '--session-id', 'abc',
    ]);
  });

  it('bypassPermissions uses the dedicated dangerous flag', () => {
    expect(buildClaudeArgs({ ...base, permissionMode: 'bypassPermissions' })).toContain(
      '--dangerously-skip-permissions',
    );
  });

  it('other modes use --permission-mode', () => {
    const args = buildClaudeArgs({ ...base, permissionMode: 'auto' });
    expect(args).toContain('--permission-mode');
    expect(args[args.indexOf('--permission-mode') + 1]).toBe('auto');
  });

  it('resume swaps --session-id for --resume', () => {
    const args = buildClaudeArgs({ ...base, resume: true, permissionMode: 'plan' });
    expect(args).toContain('--resume');
    expect(args).not.toContain('--session-id');
  });
});

describe('resolvePermissionMode', () => {
  it('accepts known modes and rejects garbage', () => {
    expect(resolvePermissionMode('auto', undefined)).toBe('auto');
    expect(resolvePermissionMode('rm -rf /', undefined)).toBe('default');
    expect(resolvePermissionMode(undefined, undefined)).toBe('default');
  });

  it('maps the legacy skipPermissions flag', () => {
    expect(resolvePermissionMode(undefined, true)).toBe('bypassPermissions');
    expect(resolvePermissionMode('plan', true)).toBe('plan'); // explicit mode wins
  });
});
