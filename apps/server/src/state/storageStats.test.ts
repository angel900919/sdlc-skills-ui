import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The db module binds to SDLC_DATA_DIR at import time, so the env override must
// precede the dynamic imports — this is the test-strategy tmp-dir rule in action.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scc-storage-stats-'));
process.env.SDLC_DATA_DIR = tmpDir;

const { reportStorageStats } = await import('./storageStats.js');

describe('reportStorageStats', () => {
  it('reports zero rows and null oldest dates on an empty store, with a real file size', () => {
    const stats = reportStorageStats();
    expect(stats.fileSizeBytes).toBeGreaterThan(0);
    expect(stats.kinds.map((k) => k.kind)).toEqual([
      'audit-events',
      'hook-events',
      'transcript-copies',
      'usage-samples',
    ]);
    for (const kind of stats.kinds) {
      expect(kind.rows).toBe(0);
      expect(kind.oldestAt).toBeNull();
    }
  });
});
