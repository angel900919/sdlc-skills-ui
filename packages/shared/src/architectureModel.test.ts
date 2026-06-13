import { describe, expect, it } from 'vitest';

import { rollupStatus } from './architectureModel.js';

describe('rollupStatus', () => {
  it('returns unknown for an empty set', () => {
    expect(rollupStatus([])).toBe('unknown');
  });

  it('returns done when every child is done', () => {
    expect(rollupStatus(['done', 'done'])).toBe('done');
  });

  it('surfaces blocked over every other status', () => {
    expect(rollupStatus(['done', 'in-progress', 'blocked'])).toBe('blocked');
  });

  it('surfaces in-progress over planned and done', () => {
    expect(rollupStatus(['done', 'planned', 'in-progress'])).toBe('in-progress');
  });

  it('surfaces planned over done', () => {
    expect(rollupStatus(['done', 'planned'])).toBe('planned');
  });

  it('returns unknown when no status is recognized', () => {
    expect(rollupStatus(['unknown', 'unknown'])).toBe('unknown');
  });
});
