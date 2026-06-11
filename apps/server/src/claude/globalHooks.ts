import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { GlobalHooksMutationResult, GlobalHooksStatus } from '@sdlc/shared';
import { HOOK_EVENTS, buildHookCommand, type HookMatcherGroup } from './hookSettings.js';

/**
 * Opt-in install of the observation hooks into the USER settings file
 * (~/.claude/settings.json, or $CLAUDE_CONFIG_DIR/settings.json), so Claude
 * Code sessions started OUTSIDE the dashboard also POST their lifecycle
 * events to the backend.
 *
 * Safety contract:
 *  - Every command we install carries GLOBAL_HOOK_MARKER as a trailing shell
 *    comment, so uninstall removes exactly ours and nothing else.
 *  - Merge is additive: all existing keys and hook entries are preserved
 *    byte-for-byte semantically; we only append entries not already present.
 *  - Before the first write ever, a timestamped backup copy is created next
 *    to the file (settings.json.bak-<ISO>).
 *  - All writes are atomic (temp file + rename in the same directory).
 *  - The file is only ever touched by an explicit install()/uninstall() call
 *    (i.e. a user clicking Install/Uninstall) — never on boot.
 */

export const GLOBAL_HOOK_MARKER = '# sdlc-command-center';

const BACKUP_PREFIX = 'settings.json.bak-';

function configDir(): string {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

export function settingsFilePath(): string {
  return path.join(configDir(), 'settings.json');
}

function isOurEntry(entry: unknown): boolean {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    typeof (entry as { command?: unknown }).command === 'string' &&
    ((entry as { command: string }).command.includes(GLOBAL_HOOK_MARKER))
  );
}

function groupHasOurEntry(group: unknown): boolean {
  if (typeof group !== 'object' || group === null) return false;
  const hooks = (group as { hooks?: unknown }).hooks;
  return Array.isArray(hooks) && hooks.some(isOurEntry);
}

function readSettings(file: string): { settings: Record<string, unknown> | null; parseError: string | null } {
  let raw: string;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    return { settings: null, parseError: null }; // file missing
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { settings: null, parseError: 'settings.json is not a JSON object' };
    }
    return { settings: parsed as Record<string, unknown>, parseError: null };
  } catch (err) {
    return { settings: null, parseError: `settings.json is not valid JSON: ${(err as Error).message}` };
  }
}

/** Atomic write: temp file in the same directory, then rename. */
function writeSettingsAtomic(file: string, settings: Record<string, unknown>) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = path.join(dir, `.settings.json.tmp-${process.pid}-${Date.now()}`);
  fs.writeFileSync(tmp, JSON.stringify(settings, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

function listBackups(): string[] {
  const dir = configDir();
  let names: string[];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.startsWith(BACKUP_PREFIX))
    .sort()
    .map((n) => path.join(dir, n));
}

function latestBackup(): string | null {
  const backups = listBackups();
  return backups.length ? backups[backups.length - 1] : null;
}

export function getStatus(): GlobalHooksStatus {
  const file = settingsFilePath();
  const base = {
    settingsPath: file,
    lastBackupPath: latestBackup(),
  };
  if (!fs.existsSync(file)) {
    return { ...base, state: 'file-missing', installedEvents: [], missingEvents: [...HOOK_EVENTS] };
  }
  const { settings, parseError } = readSettings(file);
  if (!settings) {
    return {
      ...base,
      state: 'not-installed',
      installedEvents: [],
      missingEvents: [...HOOK_EVENTS],
      error: parseError ?? undefined,
    };
  }
  const hooks = settings.hooks;
  const installedEvents: string[] = [];
  if (typeof hooks === 'object' && hooks !== null && !Array.isArray(hooks)) {
    for (const event of HOOK_EVENTS) {
      const groups = (hooks as Record<string, unknown>)[event];
      if (Array.isArray(groups) && groups.some(groupHasOurEntry)) installedEvents.push(event);
    }
  }
  const missingEvents = HOOK_EVENTS.filter((e) => !installedEvents.includes(e));
  const state =
    installedEvents.length === 0
      ? 'not-installed'
      : missingEvents.length === 0
        ? 'installed'
        : 'partially-installed';
  return { ...base, state, installedEvents, missingEvents };
}

/**
 * Merge our hooks into the user settings file. Preserves everything already
 * there; appends one matcher group per event that doesn't yet carry our
 * marker. Creates a timestamped backup before the first write ever.
 */
export function install(): GlobalHooksMutationResult {
  const file = settingsFilePath();
  const exists = fs.existsSync(file);
  const { settings: parsed, parseError } = exists ? readSettings(file) : { settings: null, parseError: null };
  if (exists && !parsed) {
    // Never write over a file we cannot faithfully re-serialize.
    throw Object.assign(new Error(`Refusing to modify ${file}: ${parseError}`), { statusCode: 409 });
  }
  const settings: Record<string, unknown> = parsed ?? {};

  if (typeof settings.hooks !== 'object' || settings.hooks === null || Array.isArray(settings.hooks)) {
    if (settings.hooks !== undefined) {
      throw Object.assign(
        new Error(`Refusing to modify ${file}: existing "hooks" key is not an object`),
        { statusCode: 409 },
      );
    }
    settings.hooks = {};
  }
  const hooks = settings.hooks as Record<string, unknown>;

  let changed = false;
  for (const event of HOOK_EVENTS) {
    const existing = hooks[event];
    if (existing !== undefined && !Array.isArray(existing)) {
      throw Object.assign(
        new Error(`Refusing to modify ${file}: hooks.${event} is not an array`),
        { statusCode: 409 },
      );
    }
    const groups: unknown[] = Array.isArray(existing) ? existing : [];
    if (!groups.some(groupHasOurEntry)) {
      const group: HookMatcherGroup = {
        hooks: [{ type: 'command', command: buildHookCommand(event, GLOBAL_HOOK_MARKER) }],
      };
      hooks[event] = [...groups, group];
      changed = true;
    }
  }

  let backupPath: string | null = latestBackup();
  let backupCreated = false;
  if (changed && exists && !backupPath) {
    // First write ever: keep an untouched copy of the user's file beside it.
    const stamp = new Date().toISOString().replace(/:/g, '-');
    backupPath = path.join(configDir(), `${BACKUP_PREFIX}${stamp}`);
    fs.copyFileSync(file, backupPath);
    backupCreated = true;
  }

  if (changed) writeSettingsAtomic(file, settings);

  return { status: getStatus(), changed, backupPath, backupCreated };
}

/**
 * Remove exactly our entries (identified by GLOBAL_HOOK_MARKER) and clean up
 * any hooks arrays / the hooks object that our removal leaves empty.
 * Everything else in the file is preserved.
 */
export function uninstall(): GlobalHooksMutationResult {
  const file = settingsFilePath();
  if (!fs.existsSync(file)) {
    return { status: getStatus(), changed: false, backupPath: latestBackup(), backupCreated: false };
  }
  const { settings, parseError } = readSettings(file);
  if (!settings) {
    throw Object.assign(new Error(`Refusing to modify ${file}: ${parseError}`), { statusCode: 409 });
  }

  let changed = false;
  const hooks = settings.hooks;
  if (typeof hooks === 'object' && hooks !== null && !Array.isArray(hooks)) {
    const hooksObj = hooks as Record<string, unknown>;
    for (const [event, value] of Object.entries(hooksObj)) {
      if (!Array.isArray(value)) continue;
      let eventChanged = false;
      const nextGroups: unknown[] = [];
      for (const group of value) {
        if (!groupHasOurEntry(group)) {
          nextGroups.push(group);
          continue;
        }
        const g = group as Record<string, unknown>;
        const kept = (g.hooks as unknown[]).filter((h) => !isOurEntry(h));
        eventChanged = true;
        // Drop the whole matcher group if removing our command emptied it.
        if (kept.length > 0) nextGroups.push({ ...g, hooks: kept });
      }
      if (eventChanged) {
        changed = true;
        if (nextGroups.length === 0) delete hooksObj[event];
        else hooksObj[event] = nextGroups;
      }
    }
    // Remove the hooks object itself only if our removal emptied it.
    if (changed && Object.keys(hooksObj).length === 0) delete settings.hooks;
  }

  if (changed) writeSettingsAtomic(file, settings);

  return { status: getStatus(), changed, backupPath: latestBackup(), backupCreated: false };
}
