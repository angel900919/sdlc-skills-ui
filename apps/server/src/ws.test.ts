import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

import Fastify, { type FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import { WebSocket } from 'ws';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { config } from './config.js';

let app: FastifyInstance;
let port: number;
let dataDir: string;

beforeAll(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-ws-'));
  process.env.SDLC_DATA_DIR = dataDir;
  const { registerWebSocket } = await import('./ws.js');
  app = Fastify();
  await app.register(websocket, { options: { maxPayload: 1_048_576 } });
  registerWebSocket(app);
  await app.listen({ port: 0, host: '127.0.0.1' });
  port = (app.server.address() as AddressInfo).port;
});

afterAll(async () => {
  await app?.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

/** Open a /ws connection with the given Origin and report whether it opened
 *  and the close code (a policy reject closes with 1008). */
function attempt(origin?: string): Promise<{ opened: boolean; closeCode: number }> {
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`, origin ? { origin } : undefined);
    let opened = false;
    const timer = setTimeout(() => {
      // A permitted socket stays open — close it ourselves to settle the promise.
      if (ws.readyState === ws.OPEN) ws.close(1000);
    }, 200);
    ws.on('open', () => {
      opened = true;
    });
    ws.on('close', (code: number) => {
      clearTimeout(timer);
      resolve({ opened, closeCode: code });
    });
    ws.on('error', () => {
      /* a policy close surfaces via the 'close' event; swallow the reset */
    });
  });
}

describe('registerWebSocket — cross-site WebSocket hijacking guard (scc-7ru / V3)', () => {
  it('policy-closes (1008) a connection from a foreign Origin', async () => {
    const { closeCode } = await attempt('http://evil.com');
    expect(closeCode).toBe(1008);
  });

  it('keeps a connection from a dashboard origin open', async () => {
    const { opened, closeCode } = await attempt(`http://127.0.0.1:${config.webDevPort}`);
    expect(opened).toBe(true);
    expect(closeCode).not.toBe(1008);
  });
});
