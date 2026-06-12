/** Compact human formatting for telemetry numbers. */

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

export function formatCostUsd(cost: number | null): string {
  if (cost === null) return '—';
  if (cost >= 10) return `$${cost.toFixed(0)}`;
  if (cost >= 0.1) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(3)}`;
}

/** "claude-opus-4-7" → "opus-4-7" for tight UI spots. */
export function shortModel(model: string | null): string {
  return model ? model.replace(/^claude-/, '').replace(/-\d{8}$/, '') : '';
}
