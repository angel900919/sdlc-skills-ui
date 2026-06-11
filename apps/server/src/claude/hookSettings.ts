import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';

/**
 * Generates a Claude Code settings file containing observability hooks.
 * Passed to spawned sessions via `--settings <file>`, so the user's own
 * project/global settings are never mutated and sessions started outside
 * the dashboard are unaffected.
 *
 * Each hook pipes its stdin JSON to the local backend. `--max-time 3` and
 * the trailing `|| true` guarantee a dead dashboard can never block Claude.
 */
const HOOK_EVENTS = [
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'Notification',
] as const;

export function ensureHookSettingsFile(): string {
  const file = path.join(config.dataDir, 'claude-hook-settings.json');
  const url = `http://${config.host}:${config.port}/api/hooks`;
  const hooks: Record<string, unknown[]> = {};
  for (const event of HOOK_EVENTS) {
    hooks[event] = [
      {
        hooks: [
          {
            type: 'command',
            command: `curl -s --max-time 3 -X POST '${url}/${event}' -H 'Content-Type: application/json' --data-binary @- > /dev/null 2>&1 || true`,
          },
        ],
      },
    ];
  }
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ hooks }, null, 2));
  return file;
}
