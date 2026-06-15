import Fastify, { type FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { config } from './config.js';
import {
  isAllowedHost,
  isAllowedOrigin,
  isStateChangingMethod,
  originHostGuard,
} from './originGuard.js';

const serverHost = `127.0.0.1:${config.port}`;
const serverOrigin = `http://127.0.0.1:${config.port}`;
const devWebOrigin = `http://127.0.0.1:${config.webDevPort}`;

describe('originGuard predicates', () => {
  describe('isAllowedHost — the DNS-rebinding guard', () => {
    it('accepts the loopback server on both the server and dev-web ports', () => {
      expect(isAllowedHost(`127.0.0.1:${config.port}`)).toBe(true);
      expect(isAllowedHost(`localhost:${config.port}`)).toBe(true);
      // the /ws vite proxy has no changeOrigin, so dev WS arrives with the :5180 Host
      expect(isAllowedHost(`127.0.0.1:${config.webDevPort}`)).toBe(true);
      expect(isAllowedHost(`localhost:${config.webDevPort}`)).toBe(true);
    });

    it('rejects a rebound attacker host, a wrong port, and an absent host', () => {
      expect(isAllowedHost(`evil.com:${config.port}`)).toBe(false);
      expect(isAllowedHost('127.0.0.1:9999')).toBe(false);
      expect(isAllowedHost(undefined)).toBe(false);
    });
  });

  describe('isAllowedOrigin — the CSRF guard', () => {
    it('accepts an absent origin (non-browser caller) and the dashboard origins', () => {
      expect(isAllowedOrigin(undefined)).toBe(true);
      expect(isAllowedOrigin(serverOrigin)).toBe(true);
      expect(isAllowedOrigin(devWebOrigin)).toBe(true);
      expect(isAllowedOrigin(`http://localhost:${config.webDevPort}`)).toBe(true);
    });

    it('rejects a foreign origin, a look-alike suffix, and a wrong scheme', () => {
      expect(isAllowedOrigin('http://evil.com')).toBe(false);
      expect(isAllowedOrigin(`http://127.0.0.1:${config.webDevPort}.evil.com`)).toBe(false);
      expect(isAllowedOrigin(`https://127.0.0.1:${config.port}`)).toBe(false);
    });
  });

  describe('isStateChangingMethod', () => {
    it('treats write methods as state-changing (case-insensitive)', () => {
      for (const m of ['POST', 'put', 'Patch', 'DELETE']) expect(isStateChangingMethod(m)).toBe(true);
    });
    it('treats read methods as not state-changing', () => {
      for (const m of ['GET', 'HEAD', 'OPTIONS']) expect(isStateChangingMethod(m)).toBe(false);
    });
  });
});

describe('originHostGuard — onRequest hook wired into Fastify', () => {
  let app: FastifyInstance;
  beforeAll(async () => {
    app = Fastify();
    app.addHook('onRequest', originHostGuard);
    app.post('/echo', async () => ({ ok: true }));
    app.get('/read', async () => ({ ok: true }));
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('allows a same-origin write (dev-web origin, loopback host)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/echo',
      headers: { host: serverHost, origin: devWebOrigin },
    });
    expect(res.statusCode).toBe(200);
  });

  it('allows a write with no Origin (the hook-ingest curl / non-browser caller)', async () => {
    const res = await app.inject({ method: 'POST', url: '/echo', headers: { host: serverHost } });
    expect(res.statusCode).toBe(200);
  });

  it('blocks a cross-origin write (CSRF) with 403 forbidden origin', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/echo',
      headers: { host: serverHost, origin: 'http://evil.com' },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json()).toMatchObject({ error: 'forbidden origin' });
  });

  it('blocks a rebound Host (DNS rebinding) with 403 on both reads and writes', async () => {
    const write = await app.inject({ method: 'POST', url: '/echo', headers: { host: `evil.com:${config.port}` } });
    const read = await app.inject({ method: 'GET', url: '/read', headers: { host: `evil.com:${config.port}` } });
    expect(write.statusCode).toBe(403);
    expect(write.json()).toMatchObject({ error: 'forbidden host' });
    expect(read.statusCode).toBe(403);
  });

  it('does not origin-block reads — CORS governs cross-origin reads, not this guard', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/read',
      headers: { host: serverHost, origin: 'http://evil.com' },
    });
    expect(res.statusCode).toBe(200);
  });
});
