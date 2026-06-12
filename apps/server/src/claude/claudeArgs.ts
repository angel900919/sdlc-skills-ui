import type { PermissionMode } from '@sdlc/shared';

/**
 * CLI argument assembly for spawning `claude`. Kept pure and separate from
 * the PTY machinery so the permission-mode → flag mapping is testable.
 * bypassPermissions uses the dedicated --dangerously-skip-permissions flag
 * (equivalent to --permission-mode bypassPermissions, but the dedicated
 * flag predates it and is what the CLI documents for this mode).
 */
export function buildClaudeArgs(input: {
  settingsFile: string;
  permissionMode: PermissionMode;
  sessionId: string;
  resume: boolean;
}): string[] {
  const args: string[] = ['--settings', input.settingsFile];
  if (input.permissionMode === 'bypassPermissions') {
    args.push('--dangerously-skip-permissions');
  } else if (input.permissionMode !== 'default') {
    args.push('--permission-mode', input.permissionMode);
  }
  if (input.resume) args.push('--resume', input.sessionId);
  else args.push('--session-id', input.sessionId);
  return args;
}

const PERMISSION_MODES: PermissionMode[] = [
  'default', 'acceptEdits', 'plan', 'auto', 'dontAsk', 'bypassPermissions',
];

/** Normalize untrusted API input (incl. the legacy skipPermissions flag). */
export function resolvePermissionMode(
  mode: unknown,
  legacySkipPermissions: boolean | undefined,
): PermissionMode {
  if (typeof mode === 'string' && (PERMISSION_MODES as string[]).includes(mode)) {
    return mode as PermissionMode;
  }
  return legacySkipPermissions ? 'bypassPermissions' : 'default';
}
