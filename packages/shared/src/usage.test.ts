import { describe, expect, it } from 'vitest';
import {
  aggregateUsage,
  contextWindowFor,
  estimateCostUsd,
  extractUsageSample,
} from './usage.js';

/** A realistic transcript line shape (subset) as Claude Code writes it. */
function assistantEntry(over: Partial<Record<string, unknown>> = {}, usage: Record<string, unknown> = {}) {
  return {
    type: 'assistant',
    uuid: 'u1',
    timestamp: '2026-06-12T10:00:00.000Z',
    isSidechain: false,
    message: {
      role: 'assistant',
      model: 'claude-opus-4-7',
      usage: {
        input_tokens: 6,
        output_tokens: 183,
        cache_read_input_tokens: 17257,
        cache_creation_input_tokens: 10563,
        cache_creation: { ephemeral_1h_input_tokens: 10563, ephemeral_5m_input_tokens: 0 },
        ...usage,
      },
    },
    ...over,
  };
}

describe('extractUsageSample', () => {
  it('extracts model and token counts from an assistant entry', () => {
    const s = extractUsageSample(assistantEntry());
    expect(s).toEqual({
      uuid: 'u1',
      timestamp: '2026-06-12T10:00:00.000Z',
      model: 'claude-opus-4-7',
      isSidechain: false,
      inputTokens: 6,
      outputTokens: 183,
      cacheReadTokens: 17257,
      cacheWrite5mTokens: 0,
      cacheWrite1hTokens: 10563,
    });
  });

  it('falls back to cache_creation_input_tokens when the TTL breakdown is missing', () => {
    const s = extractUsageSample(
      assistantEntry({}, { cache_creation: undefined, cache_creation_input_tokens: 500 }),
    );
    expect(s?.cacheWrite5mTokens).toBe(500);
    expect(s?.cacheWrite1hTokens).toBe(0);
  });

  it('returns null for non-assistant entries and entries without usage', () => {
    expect(extractUsageSample({ type: 'user', message: { role: 'user' } })).toBeNull();
    expect(extractUsageSample({ type: 'assistant', message: { role: 'assistant' } })).toBeNull();
    expect(extractUsageSample({ type: 'file-history-snapshot' })).toBeNull();
  });
});

describe('estimateCostUsd', () => {
  it('prices input, output, cache reads and cache writes for a known model', () => {
    // opus-4-7: $5/MTok in, $25/MTok out; reads 0.1x, 5m writes 1.25x, 1h writes 2x
    const cost = estimateCostUsd({
      uuid: 'u',
      timestamp: '',
      model: 'claude-opus-4-7',
      isSidechain: false,
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
      cacheReadTokens: 1_000_000,
      cacheWrite5mTokens: 1_000_000,
      cacheWrite1hTokens: 1_000_000,
    });
    expect(cost).toBeCloseTo(5 + 25 + 0.5 + 6.25 + 10, 5);
  });

  it('matches date-suffixed model ids by prefix', () => {
    const cost = estimateCostUsd({
      uuid: 'u',
      timestamp: '',
      model: 'claude-haiku-4-5-20251001',
      isSidechain: false,
      inputTokens: 1_000_000,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWrite5mTokens: 0,
      cacheWrite1hTokens: 0,
    });
    expect(cost).toBeCloseTo(1, 5);
  });

  it('returns null for unknown models instead of guessing', () => {
    expect(
      estimateCostUsd({
        uuid: 'u',
        timestamp: '',
        model: 'claude-something-new',
        isSidechain: false,
        inputTokens: 10,
        outputTokens: 10,
        cacheReadTokens: 0,
        cacheWrite5mTokens: 0,
        cacheWrite1hTokens: 0,
      }),
    ).toBeNull();
  });

  it('prices synthetic placeholder entries at zero (not an API call)', () => {
    expect(
      estimateCostUsd({
        uuid: 'u',
        timestamp: '',
        model: '<synthetic>',
        isSidechain: false,
        inputTokens: 10,
        outputTokens: 10,
        cacheReadTokens: 0,
        cacheWrite5mTokens: 0,
        cacheWrite1hTokens: 0,
      }),
    ).toBe(0);
  });
});

describe('aggregateUsage', () => {
  const samples = [
    extractUsageSample(assistantEntry({ uuid: 'a', timestamp: '2026-06-12T10:00:00Z' }))!,
    extractUsageSample(
      assistantEntry(
        { uuid: 'b', timestamp: '2026-06-12T10:01:00Z' },
        { input_tokens: 12, output_tokens: 400, cache_read_input_tokens: 28000 },
      ),
    )!,
  ];

  it('sums tokens, estimates cost, and derives context from the latest sample', () => {
    const agg = aggregateUsage(samples);
    expect(agg.inputTokens).toBe(18);
    expect(agg.outputTokens).toBe(583);
    expect(agg.cacheReadTokens).toBe(17257 + 28000);
    expect(agg.messages).toBe(2);
    expect(agg.model).toBe('claude-opus-4-7');
    // context = input + cacheRead + cacheWrite of the LAST sample
    expect(agg.contextTokens).toBe(12 + 28000 + 10563);
    expect(agg.contextWindow).toBe(200_000);
    expect(agg.estCostUsd).not.toBeNull();
    expect(agg.estCostUsd!).toBeGreaterThan(0);
  });

  it('handles empty input', () => {
    const agg = aggregateUsage([]);
    expect(agg.messages).toBe(0);
    expect(agg.estCostUsd).toBeNull();
    expect(agg.contextTokens).toBe(0);
  });

  it('reports null cost when any sample has unknown pricing', () => {
    const unknown = { ...samples[0], uuid: 'c', model: 'mystery-model' };
    expect(aggregateUsage([...samples, unknown]).estCostUsd).toBeNull();
  });
});

describe('contextWindowFor', () => {
  it('defaults to 200k and stretches to 1M when observed usage exceeds it', () => {
    expect(contextWindowFor('claude-opus-4-8', 50_000)).toBe(200_000);
    expect(contextWindowFor('claude-opus-4-8', 350_000)).toBe(1_000_000);
    expect(contextWindowFor('claude-haiku-4-5-20251001', 50_000)).toBe(200_000);
  });
});
