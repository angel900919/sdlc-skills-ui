import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';

/**
 * Shared construction of the Claude Code observability hooks.
 *
 * Two consumers:
 *  - ensureHookSettingsFile(): the per-session `--settings` file handed to
 *    sessions the dashboard spawns (user settings are never mutated).
 *  - globalHooks.ts: the opt-in install into the user's ~/.claude/settings.json
 *    so sessions started OUTSIDE the dashboard are observed too.
 *
 * Each hook pipes its stdin JSON to the local backend. `--max-time 3` and
 * the trailing `|| true` guarantee a dead dashboard can never block Claude.
 */
export const HOOK_EVENTS = [
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'Notification',
] as const;

export interface HookCommandEntry {
  type: 'command';
  command: string;
}

export interface HookMatcherGroup {
  hooks: HookCommandEntry[];
  [k: string]: unknown;
}

/**
 * The failure-proof shell command for one hook event. When `marker` is given
 * it is appended as a trailing shell comment so the entry is unmistakably
 * ours (used by the global install so uninstall can find exactly our hooks).
 */
export function buildHookCommand(event: string, marker?: string): string {
  const url = `http://${config.host}:${config.port}/api/hooks`;
  const base = `curl -s --max-time 3 -X POST '${url}/${event}' -H 'Content-Type: application/json' --data-binary @- > /dev/null 2>&1 || true`;
  return marker ? `${base} ${marker}` : base;
}

/** Full `hooks` object covering every observed lifecycle event. */
export function buildHooksConfig(marker?: string): Record<string, HookMatcherGroup[]> {
  const hooks: Record<string, HookMatcherGroup[]> = {};
  for (const event of HOOK_EVENTS) {
    hooks[event] = [{ hooks: [{ type: 'command', command: buildHookCommand(event, marker) }] }];
  }
  return hooks;
}

/**
 * Generates the per-session Claude Code settings file containing the
 * observability hooks. Passed to spawned sessions via `--settings <file>`,
 * so the user's own project/global settings are never mutated and sessions
 * started outside the dashboard are unaffected.
 */
export function ensureHookSettingsFile(): string {
  const file = path.join(config.dataDir, 'claude-hook-settings.json');
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ hooks: buildHooksConfig() }, null, 2));
  return file;
}
