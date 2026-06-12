import { execFileSync } from 'node:child_process';
import type { SessionDiff } from '@sdlc/shared';
import { parseNumstat } from '@sdlc/shared';

/**
 * Diff review data for a session's checkout: everything that differs from
 * the merge-base with `base` (committed on the session branch + uncommitted),
 * which is exactly what a reviewer of the session's work wants to see.
 */

const MAX_DIFF_CHARS = 400_000;

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf-8',
    timeout: 15_000,
    maxBuffer: 16 * 1024 * 1024,
  });
}

export function getSessionDiff(cwd: string, base: string): SessionDiff {
  // Validate the base ref (also guards the args below against injection).
  git(cwd, ['rev-parse', '--verify', '--quiet', `${base}^{commit}`]);
  const mergeBase = git(cwd, ['merge-base', base, 'HEAD']).trim();

  const files = parseNumstat(git(cwd, ['diff', '--numstat', mergeBase]));
  let diff = git(cwd, ['diff', mergeBase]);
  const truncated = diff.length > MAX_DIFF_CHARS;
  if (truncated) diff = diff.slice(0, MAX_DIFF_CHARS);

  return { base, diff, files, truncated };
}

/** Candidate base branches, current first. */
export function listBranches(cwd: string): string[] {
  const out = git(cwd, ['branch', '--format=%(refname:short)', '--sort=-committerdate']);
  return out
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 30);
}
