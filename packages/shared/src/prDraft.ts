import type { DiffFileStat } from './diffStat.js';

/**
 * PR draft generation: a title and Markdown body assembled from the branch's
 * commits, diffstat and the originating session — pure text assembly, so the
 * human can edit everything before anything touches GitHub.
 */

export interface PrCommit {
  sha: string;
  subject: string;
}

export interface PrDraftInput {
  branch: string;
  base: string;
  /** Commits ahead of the merge-base, oldest first. */
  commits: PrCommit[];
  files: DiffFileStat[];
  session: { id: string; title: string; launchPrompt: string | null };
}

export interface PrDraft {
  title: string;
  body: string;
}

const FILE_LIST_CAP = 10;

export function buildPrDraft(input: PrDraftInput): PrDraft {
  return { title: draftTitle(input), body: draftBody(input) };
}

function draftTitle({ branch, commits }: PrDraftInput): string {
  if (commits.length === 1) return commits[0].subject;
  const humanized = humanizeBranch(branch);
  if (humanized) return humanized;
  return `${commits[0]?.subject ?? branch} (+${commits.length - 1} more)`;
}

/** "feature/checkout-flow" → "Checkout flow"; opaque ids (session/abc123) → null. */
function humanizeBranch(branch: string): string | null {
  const segment = branch.split('/').pop() ?? branch;
  if (!/[a-z]/i.test(segment) || /^[0-9a-f]{6,}$/i.test(segment)) return null;
  const words = segment.replace(/[-_]+/g, ' ').trim();
  if (!words) return null;
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function draftBody({ base, commits, files, session }: PrDraftInput): string {
  const summary = commits.map((c) => `- ${c.subject}`).join('\n');

  const shown = files.slice(0, FILE_LIST_CAP);
  const fileLines = shown.map(
    (f) => `- \`${f.path}\` ${f.binary ? 'binary' : `+${f.additions} −${f.deletions}`}`,
  );
  if (files.length > shown.length) fileLines.push(`- …and ${files.length - shown.length} more files`);
  const totalAdds = files.reduce((n, f) => n + f.additions, 0);
  const totalDels = files.reduce((n, f) => n + f.deletions, 0);
  const totals = `${files.length} file${files.length === 1 ? '' : 's'} changed, +${totalAdds} −${totalDels}`;

  const id8 = session.id.slice(0, 8);
  const provenance = session.launchPrompt
    ? `Drafted by SDLC Command Center from Claude session \`${id8}\`, launched with \`${session.launchPrompt}\`.`
    : `Drafted by SDLC Command Center from Claude session \`${id8}\`.`;

  return [
    '## Summary',
    '',
    summary,
    '',
    '## Changes',
    '',
    ...fileLines,
    '',
    totals,
    '',
    '## Test plan',
    '',
    '- [ ] Automated tests pass',
    `- [ ] Manually exercised the change against \`${base}\``,
    '',
    '---',
    provenance,
  ].join('\n');
}
