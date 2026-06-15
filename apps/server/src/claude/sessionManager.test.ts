import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { spawnSession as SpawnSession } from './sessionManager.js';

let spawnSession: typeof SpawnSession;
let dataDir: string;

beforeAll(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-sm-'));
  process.env.SDLC_DATA_DIR = dataDir;
  ({ spawnSession } = await import('./sessionManager.js'));
});

afterAll(() => {
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('spawnSession — resumeSessionId guard (scc-7ru / V4)', () => {
  it('throws before spawning when resumeSessionId is a path-traversal value', () => {
    expect(() =>
      spawnSession({ projectId: 'p', cwd: os.tmpdir(), resumeSessionId: '../../../../etc/passwd' }),
    ).toThrow(/resumeSessionId/i);
  });
});
