import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// config.ts reads SDLC_DATA_DIR at module-evaluation time, so point it at a
// temp dir BEFORE the module graph loads (dynamic import keeps this hermetic;
// vitest gives every test file its own module registry).
const tmpDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-hook-settings-'));
process.env.SDLC_DATA_DIR = tmpDataDir;

const { HOOK_EVENTS, buildHookCommand, buildHooksConfig, ensureHookSettingsFile } = await import(
  './hookSettings.js'
);
const { config } = await import('../config.js');

afterAll(() => {
  fs.rmSync(tmpDataDir, { recursive: true, force: true });
});

const EXPECTED_EVENTS = [
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'Notification',
];

describe('HOOK_EVENTS', () => {
  it('covers every observed lifecycle event exactly once', () => {
    expect([...HOOK_EVENTS]).toEqual(EXPECTED_EVENTS);
    expect(new Set(HOOK_EVENTS).size).toBe(HOOK_EVENTS.length);
  });
});

describe('buildHookCommand', () => {
  it('builds a failure-proof curl pipeline targeting the backend hooks route', () => {
    for (const event of HOOK_EVENTS) {
      const command = buildHookCommand(event);
      expect(command).toContain('curl');
      expect(command).toContain('--max-time 3');
      expect(command).toContain('|| true');
      expect(command).toContain(`http://${config.host}:${config.port}/api/hooks/${event}'`);
      expect(command).toContain('--data-binary @-'); // pipes hook stdin JSON through
    }
  });

  it('ends with || true when no marker is given so a dead backend never blocks Claude', () => {
    expect(buildHookCommand('Stop').endsWith('|| true')).toBe(true);
  });

  it('appends the marker as a trailing shell comment', () => {
    const command = buildHookCommand('Stop', '# sdlc-command-center');
    expect(command.endsWith('|| true # sdlc-command-center')).toBe(true);
  });
});

describe('buildHooksConfig', () => {
  it('emits one matcher group with one command entry per hook event', () => {
    const hooks = buildHooksConfig();
    expect(Object.keys(hooks)).toEqual(EXPECTED_EVENTS);
    for (const [event, groups] of Object.entries(hooks)) {
      expect(groups).toHaveLength(1);
      expect(groups[0].hooks).toHaveLength(1);
      expect(groups[0].hooks[0]).toEqual({
        type: 'command',
        command: buildHookCommand(event),
      });
    }
  });

  it('threads the marker into every command', () => {
    const hooks = buildHooksConfig('# marker');
    for (const groups of Object.values(hooks)) {
      expect(groups[0].hooks[0].command.endsWith('# marker')).toBe(true);
    }
  });
});

describe('ensureHookSettingsFile', () => {
  it('writes data/claude-hook-settings.json in the exact per-session settings shape', () => {
    const file = ensureHookSettingsFile();
    expect(file).toBe(path.join(tmpDataDir, 'claude-hook-settings.json'));

    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    // The whole file is a single top-level "hooks" object…
    expect(Object.keys(parsed)).toEqual(['hooks']);
    // …whose content is exactly what buildHooksConfig generates (the same
    // generator the global install reuses), with no marker on per-session hooks.
    expect(parsed.hooks).toEqual(buildHooksConfig());
    for (const groups of Object.values(parsed.hooks) as { hooks: { command: string }[] }[][]) {
      expect(groups[0].hooks[0].command).not.toContain('#');
    }
  });

  it('is idempotent and creates the data dir if missing', () => {
    fs.rmSync(tmpDataDir, { recursive: true, force: true });
    const file = ensureHookSettingsFile();
    const first = fs.readFileSync(file, 'utf8');
    expect(ensureHookSettingsFile()).toBe(file);
    expect(fs.readFileSync(file, 'utf8')).toBe(first);
  });
});
