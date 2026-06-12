/**
 * Token-usage telemetry parsed from Claude Code transcript JSONL.
 * Display-only economics: sessions run through the interactive CLI on the
 * user's subscription, so estCostUsd is the API-equivalent value of the
 * work, not a bill. Pricing per MTok mirrors platform.claude.com (2026-06).
 */

export interface UsageSample {
  uuid: string;
  timestamp: string;
  model: string;
  isSidechain: boolean;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWrite5mTokens: number;
  cacheWrite1hTokens: number;
}

export interface SessionUsage {
  messages: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  /** Null when any sample's model has no known pricing. */
  estCostUsd: number | null;
  /** Model of the most recent sample. */
  model: string | null;
  /** Prompt size of the most recent request: input + cache read + cache write. */
  contextTokens: number;
  contextWindow: number;
  lastSampleAt: string | null;
}

interface ModelPricing {
  /** USD per million tokens. */
  inputPerMTok: number;
  outputPerMTok: number;
}

const CACHE_READ_MULTIPLIER = 0.1;
const CACHE_WRITE_5M_MULTIPLIER = 1.25;
const CACHE_WRITE_1H_MULTIPLIER = 2;

/** Longest-prefix match against transcript model ids (which may carry date suffixes). */
const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-fable-5': { inputPerMTok: 10, outputPerMTok: 50 },
  'claude-mythos-5': { inputPerMTok: 10, outputPerMTok: 50 },
  'claude-opus-4-8': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-7': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-6': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-opus-4-5': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-sonnet-4-6': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-sonnet-4-5': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-haiku-4-5': { inputPerMTok: 1, outputPerMTok: 5 },
};

function pricingFor(model: string): ModelPricing | null {
  for (const [prefix, pricing] of Object.entries(MODEL_PRICING)) {
    if (model.startsWith(prefix)) return pricing;
  }
  return null;
}

/**
 * Claude Code sessions run against a 200K window by default; some plans
 * enable the 1M window. We can't see the plan, so assume 200K and stretch
 * to 1M once the observed prompt provably exceeds it.
 */
export function contextWindowFor(_model: string, observedContextTokens: number): number {
  return observedContextTokens > 200_000 ? 1_000_000 : 200_000;
}

/** Parse one raw transcript JSONL entry into a usage sample, or null. */
export function extractUsageSample(entry: Record<string, unknown>): UsageSample | null {
  if (entry.type !== 'assistant') return null;
  const message = entry.message as Record<string, unknown> | undefined;
  const usage = message?.usage as Record<string, unknown> | undefined;
  if (!usage) return null;

  const n = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const breakdown = usage.cache_creation as Record<string, unknown> | undefined;
  const totalWrite = n(usage.cache_creation_input_tokens);

  return {
    uuid: String(entry.uuid ?? ''),
    timestamp: String(entry.timestamp ?? ''),
    model: String(message?.model ?? 'unknown'),
    isSidechain: entry.isSidechain === true,
    inputTokens: n(usage.input_tokens),
    outputTokens: n(usage.output_tokens),
    cacheReadTokens: n(usage.cache_read_input_tokens),
    // Without the TTL breakdown, attribute all writes to the cheaper 5m tier.
    cacheWrite5mTokens: breakdown ? n(breakdown.ephemeral_5m_input_tokens) : totalWrite,
    cacheWrite1hTokens: breakdown ? n(breakdown.ephemeral_1h_input_tokens) : 0,
  };
}

/** API-equivalent cost of one sample in USD, or null when pricing is unknown. */
export function estimateCostUsd(sample: UsageSample): number | null {
  // Claude Code writes placeholder entries (model "<synthetic>") for
  // non-API messages — they cost nothing by definition.
  if (sample.model.startsWith('<')) return 0;
  const pricing = pricingFor(sample.model);
  if (!pricing) return null;
  const perTokIn = pricing.inputPerMTok / 1_000_000;
  const perTokOut = pricing.outputPerMTok / 1_000_000;
  return (
    sample.inputTokens * perTokIn +
    sample.outputTokens * perTokOut +
    sample.cacheReadTokens * perTokIn * CACHE_READ_MULTIPLIER +
    sample.cacheWrite5mTokens * perTokIn * CACHE_WRITE_5M_MULTIPLIER +
    sample.cacheWrite1hTokens * perTokIn * CACHE_WRITE_1H_MULTIPLIER
  );
}

/** Roll samples up into a session-level summary. */
export function aggregateUsage(samples: UsageSample[]): SessionUsage {
  let inputTokens = 0;
  let outputTokens = 0;
  let cacheReadTokens = 0;
  let cacheWriteTokens = 0;
  let estCostUsd: number | null = 0;
  let last: UsageSample | null = null;

  for (const s of samples) {
    inputTokens += s.inputTokens;
    outputTokens += s.outputTokens;
    cacheReadTokens += s.cacheReadTokens;
    cacheWriteTokens += s.cacheWrite5mTokens + s.cacheWrite1hTokens;
    const cost = estimateCostUsd(s);
    estCostUsd = estCostUsd === null || cost === null ? null : estCostUsd + cost;
    if (!last || s.timestamp >= last.timestamp) last = s;
  }

  const contextTokens = last
    ? last.inputTokens + last.cacheReadTokens + last.cacheWrite5mTokens + last.cacheWrite1hTokens
    : 0;

  return {
    messages: samples.length,
    inputTokens,
    outputTokens,
    cacheReadTokens,
    cacheWriteTokens,
    estCostUsd: samples.length === 0 ? null : estCostUsd,
    model: last?.model ?? null,
    contextTokens,
    contextWindow: contextWindowFor(last?.model ?? '', contextTokens),
    lastSampleAt: last?.timestamp ?? null,
  };
}
