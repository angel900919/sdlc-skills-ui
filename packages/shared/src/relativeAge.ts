/** Pure relative-age formatter for the Storage panel (no DOM, no fetch). */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Formats an ISO timestamp as a whole-day relative age — `today`, `1 day ago`,
 * `N days ago`. The age is floored to whole days and clamped at zero, so a
 * future `iso` (clock skew) and an unparseable `iso` both read `today` rather
 * than a negative or `NaN days ago`. `nowMs` is passed in (not read from the
 * clock here) so the rule is deterministic and unit-testable.
 */
export function formatRelativeAge(iso: string, nowMs: number): string {
  const parsedMs = Date.parse(iso);
  const days = Number.isNaN(parsedMs) ? 0 : Math.floor((nowMs - parsedMs) / MS_PER_DAY);
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}
