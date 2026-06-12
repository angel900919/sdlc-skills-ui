import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Git worktree isolation for parallel sessions. Each opted-in session gets
 * its own checkout under <root>/.worktrees/<id8> on branch session/<id8>,
 * so concurrent slices can't trample each other's working tree. Worktrees
 * outlive their session (the work is the point); removal is explicit.
 */

const WORKTREES_DIR = '.worktrees';

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf-8', timeout: 15_000 });
}

export function isGitRepo(root: string): boolean {
  try {
    return git(root, ['rev-parse', '--is-inside-work-tree']).trim() === 'true';
  } catch {
    return false;
  }
}

export function worktreePathFor(projectRoot: string, sessionId: string): string {
  return path.join(projectRoot, WORKTREES_DIR, sessionId.slice(0, 8));
}

export function worktreeBranchFor(sessionId: string): string {
  return `session/${sessionId.slice(0, 8)}`;
}

/** Create (or reuse) the session's worktree; returns its absolute path. */
export function createSessionWorktree(projectRoot: string, sessionId: string): string {
  if (!isGitRepo(projectRoot)) {
    throw new Error('worktree isolation requires a git repository');
  }
  const wtPath = worktreePathFor(projectRoot, sessionId);
  if (fs.existsSync(path.join(wtPath, '.git'))) return wtPath; // resume reuses it
  fs.mkdirSync(path.dirname(wtPath), { recursive: true });
  ensureWorktreesIgnored(projectRoot);
  git(projectRoot, ['worktree', 'add', '-b', worktreeBranchFor(sessionId), wtPath, 'HEAD']);
  return wtPath;
}

/** Remove a session's worktree (keeps the branch — work stays reachable). */
export function removeSessionWorktree(projectRoot: string, worktreePath: string): void {
  git(projectRoot, ['worktree', 'remove', '--force', worktreePath]);
}

/**
 * .worktrees must never be tracked (nested checkouts confuse tooling).
 * Append it to .git/info/exclude — local-only, no working-tree churn.
 */
function ensureWorktreesIgnored(projectRoot: string): void {
  try {
    const exclude = path.join(git(projectRoot, ['rev-parse', '--git-dir']).trim(), 'info', 'exclude');
    const abs = path.isAbsolute(exclude) ? exclude : path.join(projectRoot, exclude);
    const current = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf-8') : '';
    if (!current.includes(`${WORKTREES_DIR}/`)) {
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.appendFileSync(abs, `\n${WORKTREES_DIR}/\n`);
    }
  } catch {
    // Best-effort; a tracked .worktrees dir is annoying, not fatal.
  }
}
