import { describe, expect, it } from 'vitest';
import { searchableText, toFtsQuery } from './search.js';
import type { TranscriptMessage } from '@sdlc/shared';

describe('toFtsQuery', () => {
  it('quotes terms and prefix-matches the last one', () => {
    expect(toFtsQuery('pipeline redesign')).toBe('"pipeline" "redesign"*');
  });

  it('neutralizes FTS5 syntax characters in user input', () => {
    expect(toFtsQuery('foo* OR "bar(baz)')).toBe('"foo" "OR" "bar" "baz"*');
  });

  it('returns null when nothing searchable remains', () => {
    expect(toFtsQuery('   ')).toBeNull();
    expect(toFtsQuery('"*()')).toBeNull();
  });

  it('keeps word-internal hyphens and underscores (skill names, slugs)', () => {
    expect(toFtsQuery('mtdd-implement')).toBe('"mtdd-implement"*');
  });
});

describe('searchableText', () => {
  it('joins text blocks and ignores tool noise', () => {
    const msg = {
      blocks: [
        { type: 'text', text: 'hello' },
        { type: 'tool_use', name: 'Bash', input: {} },
        { type: 'text', text: 'world' },
      ],
    } as TranscriptMessage;
    expect(searchableText(msg)).toBe('hello\nworld');
  });
});
