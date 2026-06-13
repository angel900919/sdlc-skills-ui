import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

import {
  type ParsedComponentsModel,
  parseComponentsModel,
  serializeComponentsModel,
} from './parseComponentsModel.js';

// The real, declared model this twin renders — apps/server/src/state → repo root.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const realModel = fs.readFileSync(path.join(repoRoot, '.ai/architecture/02-components.md'), 'utf8');

describe('parseComponentsModel — against the real declared model', () => {
  let model: ParsedComponentsModel;
  beforeAll(() => {
    model = parseComponentsModel(realModel);
  });

  it('parses all 7 declared components', () => {
    expect(model.components).toHaveLength(7);
    expect(model.components.map((c) => c.id)).toEqual(
      expect.arrayContaining(['RunClaudeSessions', 'ServeApiAndWs', 'ShareDomainModel']),
    );
  });

  it('captures each component role and home path', () => {
    const share = model.components.find((c) => c.id === 'ShareDomainModel');
    expect(share?.livesAt).toBe('packages/shared/src/');
    expect(share?.role).toContain('domain types');
  });

  it('marks API-bearing components from the API-bearing column', () => {
    expect(model.components.find((c) => c.id === 'IngestObservability')?.apiBearing).toBe(true);
    expect(model.components.find((c) => c.id === 'DeriveProjectState')?.apiBearing).toBe(false);
  });

  it('parses all 10 edges, including the external and aggregate endpoints', () => {
    expect(model.edges).toHaveLength(10);
    expect(model.edges).toContainEqual(
      expect.objectContaining({ from: 'claude CLI (external)', to: 'IngestObservability' }),
    );
    expect(model.edges).toContainEqual(
      expect.objectContaining({ from: 'all server components + web', to: 'ShareDomainModel' }),
    );
  });

  it('round-trips through serialize with zero dropped or invented (NFR-3)', () => {
    const reparsed = parseComponentsModel(serializeComponentsModel(model));
    expect(reparsed).toEqual(model);
  });
});

describe('parseComponentsModel — table mechanics', () => {
  it('skips the separator row and trims every cell', () => {
    const md = [
      '| Component | Role | Lives at | API-bearing |',
      '| :-- | :-- | :-- | :-- |',
      '|  Foo  |  does foo  |  src/foo  |  yes  |',
    ].join('\n');
    expect(parseComponentsModel(md).components).toEqual([
      { id: 'Foo', role: 'does foo', livesAt: 'src/foo', apiBearing: true },
    ]);
  });
});
