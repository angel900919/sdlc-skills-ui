import { describe, expect, it } from 'vitest';
import { buildPrDraft, type PrDraftInput } from './prDraft.js';

function input(overrides: Partial<PrDraftInput> = {}): PrDraftInput {
  return {
    branch: 'feature/checkout-flow',
    base: 'develop',
    commits: [{ sha: 'a1b2c3d4e5', subject: 'Add checkout form validation' }],
    files: [
      { path: 'src/checkout.ts', additions: 40, deletions: 2, binary: false },
      { path: 'src/checkout.test.ts', additions: 80, deletions: 0, binary: false },
    ],
    session: { id: 'abc12345-0000-0000-0000-000000000000', title: '/mtdd-implement SLICE-2', launchPrompt: '/mtdd-implement SLICE-2' },
    ...overrides,
  };
}

describe('buildPrDraft', () => {
  it('uses the commit subject as title for a single-commit branch', () => {
    expect(buildPrDraft(input()).title).toBe('Add checkout form validation');
  });

  it('humanizes a meaningful branch name for multi-commit branches', () => {
    const draft = buildPrDraft(
      input({
        commits: [
          { sha: 'a1', subject: 'Add checkout form' },
          { sha: 'b2', subject: 'Validate card numbers' },
        ],
      }),
    );
    expect(draft.title).toBe('Checkout flow');
  });

  it('falls back to first subject (+N more) for opaque branch names', () => {
    const draft = buildPrDraft(
      input({
        branch: 'session/abc12345',
        commits: [
          { sha: 'a1', subject: 'Add checkout form' },
          { sha: 'b2', subject: 'Validate card numbers' },
          { sha: 'c3', subject: 'Wire totals' },
        ],
      }),
    );
    expect(draft.title).toBe('Add checkout form (+2 more)');
  });

  it('lists commit subjects and per-file stats in the body', () => {
    const body = buildPrDraft(input()).body;
    expect(body).toContain('## Summary');
    expect(body).toContain('- Add checkout form validation');
    expect(body).toContain('## Changes');
    expect(body).toContain('`src/checkout.ts` +40 −2');
    expect(body).toContain('2 files changed, +120 −2');
  });

  it('caps the file list and notes the remainder', () => {
    const files = Array.from({ length: 14 }, (_, i) => ({
      path: `src/f${i}.ts`,
      additions: 1,
      deletions: 0,
      binary: false,
    }));
    const body = buildPrDraft(input({ files })).body;
    expect(body).toContain('`src/f9.ts`');
    expect(body).not.toContain('`src/f10.ts`');
    expect(body).toContain('…and 4 more files');
  });

  it('records session provenance with the launch skill', () => {
    const body = buildPrDraft(input()).body;
    expect(body).toContain('session `abc12345`');
    expect(body).toContain('`/mtdd-implement SLICE-2`');
  });

  it('omits the launch clause when the session had no launch prompt', () => {
    const body = buildPrDraft(
      input({ session: { id: 'abc12345-0000', title: 'Session abc12345', launchPrompt: null } }),
    ).body;
    expect(body).toContain('session `abc12345`');
    expect(body).not.toContain('launched with');
  });

  it('includes a manual test-plan checklist', () => {
    expect(buildPrDraft(input()).body).toContain('## Test plan');
  });
});
