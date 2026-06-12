import { execFileSync } from 'node:child_process';
import type { ClaudeSession, PrCommit, PrContext, SessionPr } from '@sdlc/shared';
import { buildPrDraft, parseNumstat } from '@sdlc/shared';
import { db } from '../db.js';

/**
 * Session branch → GitHub pull request, human-gated: GET assembles an
 * editable draft plus the blockers; POST (the user's explicit confirm)
 * pushes the branch (never force) and runs `gh pr create`. The chain's
 * /ship philosophy stands — nothing leaves the machine without a click.
 */

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf-8', timeout: 15_000, maxBuffer: 16 * 1024 * 1024 });
}

function gh(cwd: string, args: string[], input?: string): string {
  return execFileSync('gh', args, { cwd, encoding: 'utf-8', timeout: 60_000, input });
}

function currentBranch(cwd: string): string {
  return git(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
}

function commitsAhead(cwd: string, base: string, branch: string): PrCommit[] {
  git(cwd, ['rev-parse', '--verify', '--quiet', `${base}^{commit}`]);
  const mergeBase = git(cwd, ['merge-base', base, branch]).trim();
  const log = git(cwd, ['log', '--format=%H%x09%s', `${mergeBase}..${branch}`]);
  return log
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, ...subject] = line.split('\t');
      return { sha, subject: subject.join('\t') };
    })
    .reverse(); // oldest first, the order a reviewer reads them
}

function getStoredPr(sessionId: string): SessionPr | null {
  const row = db.prepare('SELECT * FROM session_prs WHERE session_id = ?').get(sessionId) as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;
  return {
    sessionId: row.session_id as string,
    branch: row.branch as string,
    base: row.base as string,
    number: (row.number as number) ?? null,
    url: row.url as string,
    title: row.title as string,
    createdAt: row.created_at as string,
  };
}

export function getPrContext(session: ClaudeSession, base: string): PrContext {
  const cwd = session.cwd;
  const blockers: string[] = [];

  const branch = currentBranch(cwd);
  if (branch === 'HEAD') blockers.push('Checkout is detached — create a branch first.');
  if (branch === base) blockers.push(`Checkout is on the base branch (${base}) — create a feature branch first.`);

  let commits: PrCommit[] = [];
  let files: ReturnType<typeof parseNumstat> = [];
  if (!blockers.length) {
    try {
      commits = commitsAhead(cwd, base, branch);
      const mergeBase = git(cwd, ['merge-base', base, branch]).trim();
      files = parseNumstat(git(cwd, ['diff', '--numstat', mergeBase, branch]));
    } catch {
      blockers.push(`Cannot diff against “${base}” — pick another base branch.`);
    }
    if (!blockers.length && commits.length === 0) blockers.push(`No commits ahead of ${base} — commit the work first.`);
  }

  try {
    git(cwd, ['remote', 'get-url', 'origin']);
  } catch {
    blockers.push('No “origin” remote configured.');
  }
  try {
    gh(cwd, ['--version']);
  } catch {
    blockers.push('GitHub CLI (gh) not found on PATH.');
  }

  return {
    branch,
    base,
    commits,
    files,
    draft: buildPrDraft({
      branch,
      base,
      commits,
      files,
      session: { id: session.id, title: session.title, launchPrompt: session.launchPrompt },
    }),
    existing: getStoredPr(session.id),
    blockers,
  };
}

export function createPr(
  session: ClaudeSession,
  input: { base: string; title: string; body: string; draft?: boolean },
): SessionPr {
  const context = getPrContext(session, input.base);
  if (context.blockers.length) throw new Error(context.blockers.join(' '));
  const cwd = session.cwd;

  git(cwd, ['push', '-u', 'origin', context.branch]);

  const args = ['pr', 'create', '--base', input.base, '--head', context.branch, '--title', input.title, '--body-file', '-'];
  if (input.draft) args.push('--draft');
  const out = gh(cwd, args, input.body);
  const url = out.split('\n').reverse().find((l) => l.trim().startsWith('https://'))?.trim();
  if (!url) throw new Error(`gh pr create returned no URL: ${out.slice(0, 200)}`);
  const number = Number(url.match(/\/pull\/(\d+)/)?.[1]) || null;

  const pr: SessionPr = {
    sessionId: session.id,
    branch: context.branch,
    base: input.base,
    number,
    url,
    title: input.title,
    createdAt: new Date().toISOString(),
  };
  db.prepare(
    `INSERT INTO session_prs (session_id, branch, base, number, url, title, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET branch=excluded.branch, base=excluded.base,
       number=excluded.number, url=excluded.url, title=excluded.title, created_at=excluded.created_at`,
  ).run(pr.sessionId, pr.branch, pr.base, pr.number, pr.url, pr.title, pr.createdAt);
  return pr;
}
