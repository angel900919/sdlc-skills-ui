import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GLOBAL_HOOK_MARKER, getStatus, install, settingsFilePath, uninstall } from './globalHooks.js';
import { HOOK_EVENTS, buildHookCommand } from './hookSettings.js';

/**
 * Hermetic harness: globalHooks resolves $CLAUDE_CONFIG_DIR at call time, so
 * every test runs against its own temp config dir. The real ~/.claude is
 * never touched.
 */
let dir: string;
let savedConfigDir: string | undefined;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-claude-config-'));
  savedConfigDir = process.env.CLAUDE_CONFIG_DIR;
  process.env.CLAUDE_CONFIG_DIR = dir;
});

afterEach(() => {
  if (savedConfigDir === undefined) delete process.env.CLAUDE_CONFIG_DIR;
  else process.env.CLAUDE_CONFIG_DIR = savedConfigDir;
  fs.rmSync(dir, { recursive: true, force: true });
});

const settingsFile = () => path.join(dir, 'settings.json');
const readRaw = () => fs.readFileSync(settingsFile(), 'utf8');
const readJson = () => JSON.parse(readRaw()) as Record<string, any>;
const writeJson = (value: unknown) =>
  fs.writeFileSync(settingsFile(), JSON.stringify(value, null, 2) + '\n');
const listBackups = () =>
  fs.readdirSync(dir).filter((name) => name.startsWith('settings.json.bak-'));

const ourGroupsIn = (groups: any[]) =>
  groups.filter(
    (g) =>
      Array.isArray(g?.hooks) &&
      g.hooks.some((h: any) => typeof h?.command === 'string' && h.command.includes(GLOBAL_HOOK_MARKER)),
  );

/** A realistic, busy user settings file we must never damage. */
const busySettings = () => ({
  model: 'opus',
  permissions: { allow: ['Bash(npm test:*)'], deny: [] },
  env: { FOO: 'bar' },
  statusLine: { type: 'command', command: 'my-statusline' },
  hooks: {
    PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'echo user-pre' }] }],
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: 'echo user-prompt' }] }],
  },
});

describe('settingsFilePath', () => {
  it('resolves inside CLAUDE_CONFIG_DIR at call time', () => {
    expect(settingsFilePath()).toBe(settingsFile());
  });
});

describe('install — fresh', () => {
  it('creates the settings file with one marked hook group per event, no backup', () => {
    expect(getStatus().state).toBe('file-missing');

    const result = install();

    expect(result.changed).toBe(true);
    expect(result.backupCreated).toBe(false); // nothing existed to back up
    expect(result.backupPath).toBeNull();
    expect(result.status.state).toBe('installed');
    expect(result.status.missingEvents).toEqual([]);
    expect([...result.status.installedEvents].sort()).toEqual([...HOOK_EVENTS].sort());

    const parsed = readJson();
    expect(Object.keys(parsed)).toEqual(['hooks']);
    for (const event of HOOK_EVENTS) {
      expect(parsed.hooks[event]).toEqual([
        { hooks: [{ type: 'command', command: buildHookCommand(event, GLOBAL_HOOK_MARKER) }] },
      ]);
    }
  });
});

describe('install — onto a busy user settings file', () => {
  it('preserves every user key and hook, appending only our marked groups', () => {
    const original = busySettings();
    writeJson(original);

    const result = install();
    expect(result.changed).toBe(true);

    const parsed = readJson();
    // Every non-hooks user key survives byte-for-byte semantically.
    expect(parsed.model).toEqual(original.model);
    expect(parsed.permissions).toEqual(original.permissions);
    expect(parsed.env).toEqual(original.env);
    expect(parsed.statusLine).toEqual(original.statusLine);

    // User hook groups stay first and untouched; ours is appended after.
    expect(parsed.hooks.PreToolUse[0]).toEqual(original.hooks.PreToolUse[0]);
    expect(parsed.hooks.PreToolUse).toHaveLength(2);
    expect(parsed.hooks.UserPromptSubmit[0]).toEqual(original.hooks.UserPromptSubmit[0]);
    expect(parsed.hooks.UserPromptSubmit).toHaveLength(2);

    for (const event of HOOK_EVENTS) {
      expect(ourGroupsIn(parsed.hooks[event])).toHaveLength(1);
    }
    expect(getStatus().state).toBe('installed');
  });

  it('is idempotent: a second install changes nothing', () => {
    writeJson(busySettings());
    install();
    const afterFirst = readRaw();

    const second = install();
    expect(second.changed).toBe(false);
    expect(readRaw()).toBe(afterFirst);
  });

  it('creates exactly one backup ever, even across reinstall cycles', () => {
    const original = busySettings();
    writeJson(original);

    const first = install();
    expect(first.backupCreated).toBe(true);
    expect(first.backupPath).not.toBeNull();
    expect(listBackups()).toHaveLength(1);
    // The backup is the user's file exactly as it was before we touched it.
    expect(JSON.parse(fs.readFileSync(first.backupPath!, 'utf8'))).toEqual(original);

    install(); // no-op
    uninstall();
    const reinstall = install(); // writes again, but a backup already exists

    expect(reinstall.changed).toBe(true);
    expect(reinstall.backupCreated).toBe(false);
    expect(reinstall.backupPath).toBe(first.backupPath);
    expect(listBackups()).toHaveLength(1);
  });

  it('repairs a partial install by appending only the missing events', () => {
    // Simulate a half-finished install: our marker hook on two events only.
    const partial: Record<string, any> = {
      hooks: {
        SessionStart: [
          { hooks: [{ type: 'command', command: buildHookCommand('SessionStart', GLOBAL_HOOK_MARKER) }] },
        ],
        Stop: [
          { hooks: [{ type: 'command', command: buildHookCommand('Stop', GLOBAL_HOOK_MARKER) }] },
        ],
      },
    };
    writeJson(partial);

    const before = getStatus();
    expect(before.state).toBe('partially-installed');
    expect([...before.installedEvents].sort()).toEqual(['SessionStart', 'Stop']);
    expect(before.missingEvents).toHaveLength(HOOK_EVENTS.length - 2);

    const result = install();
    expect(result.changed).toBe(true);
    expect(result.status.state).toBe('installed');

    const parsed = readJson();
    for (const event of HOOK_EVENTS) {
      // Each event ends up with exactly ONE of our groups — no duplicates.
      expect(ourGroupsIn(parsed.hooks[event])).toHaveLength(1);
      expect(parsed.hooks[event]).toHaveLength(1);
    }
  });
});

describe('uninstall', () => {
  it('restores the busy user settings file deep-equal to the original', () => {
    const original = busySettings();
    writeJson(original);
    install();

    const result = uninstall();
    expect(result.changed).toBe(true);
    expect(readJson()).toEqual(original);
    expect(getStatus().state).toBe('not-installed');
  });

  it('keeps a user hook that shares a matcher group with ours', () => {
    // A user (or an older tool) co-located their hook in OUR matcher group.
    const userEntry = { type: 'command', command: 'echo user-shared' };
    writeJson({
      model: 'opus',
      hooks: {
        PreToolUse: [
          {
            matcher: '*',
            hooks: [userEntry, { type: 'command', command: buildHookCommand('PreToolUse', GLOBAL_HOOK_MARKER) }],
          },
        ],
      },
    });

    const result = uninstall();
    expect(result.changed).toBe(true);
    expect(readJson()).toEqual({
      model: 'opus',
      hooks: { PreToolUse: [{ matcher: '*', hooks: [userEntry] }] },
    });
  });

  it('removes the hooks object entirely when ours were the only hooks', () => {
    install(); // fresh file containing only our hooks
    const result = uninstall();
    expect(result.changed).toBe(true);
    expect(readJson()).toEqual({});
    expect(getStatus().state).toBe('not-installed');
  });

  it('is a no-op when the settings file does not exist', () => {
    const result = uninstall();
    expect(result.changed).toBe(false);
    expect(fs.existsSync(settingsFile())).toBe(false);
  });
});

describe('refusal on files we cannot faithfully re-serialize', () => {
  it('install refuses corrupt JSON and leaves the file untouched', () => {
    fs.writeFileSync(settingsFile(), '{ this is not json');
    const before = readRaw();

    let caught: unknown;
    try {
      install();
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toMatch(/Refusing to modify/);
    expect((caught as { statusCode?: number }).statusCode).toBe(409);
    expect(readRaw()).toBe(before);
    expect(listBackups()).toHaveLength(0);

    const status = getStatus();
    expect(status.state).toBe('not-installed');
    expect(status.error).toMatch(/not valid JSON/);
  });

  it('uninstall refuses corrupt JSON and leaves the file untouched', () => {
    fs.writeFileSync(settingsFile(), '[1, 2'); // truncated
    const before = readRaw();
    expect(() => uninstall()).toThrowError(/Refusing to modify/);
    expect(readRaw()).toBe(before);
  });

  it('install refuses a top-level JSON array', () => {
    writeJson([{ hooks: {} }]);
    const before = readRaw();
    expect(() => install()).toThrowError(/Refusing to modify/);
    expect(readRaw()).toBe(before);
  });

  it('install refuses when "hooks" is not an object', () => {
    writeJson({ hooks: 'definitely-not-hooks' });
    const before = readRaw();
    expect(() => install()).toThrowError(/"hooks" key is not an object/);
    expect(readRaw()).toBe(before);
    expect(listBackups()).toHaveLength(0);
  });

  it('install refuses when an event entry is not an array', () => {
    writeJson({ hooks: { PreToolUse: { matcher: 'Bash' } } });
    const before = readRaw();
    expect(() => install()).toThrowError(/hooks\.PreToolUse is not an array/);
    expect(readRaw()).toBe(before);
    expect(listBackups()).toHaveLength(0);
  });
});
