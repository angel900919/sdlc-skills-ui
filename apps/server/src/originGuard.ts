import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

import { config } from './config.js';

/**
 * Request-boundary guard for the loopback dashboard (scc-7ru).
 *
 * The `127.0.0.1` bind stops a remote socket but NOT a malicious page open in
 * the owner's own browser, which bridges the loopback boundary. So the bind is
 * necessary but not sufficient; this guard is the actual boundary against:
 *   - CSRF — a foreign page POSTing to a state-changing route (spawn a session,
 *     inject input, push a PR). Browsers always attach `Origin` to a cross-origin
 *     write, so a present-and-foreign Origin on a write is rejected. A non-browser
 *     caller (the hook-ingest `curl`) sends no Origin and is unaffected.
 *   - DNS rebinding — a rebound `attacker.com` resolves to 127.0.0.1, defeating
 *     CORS (the request is same-origin to attacker.com). The `Host` header then
 *     names the attacker's domain, never the loopback server, so every request
 *     (read or write) is rejected unless its Host is the loopback server itself.
 *
 * Dev note: the vite dev server (:5180) proxies `/api` with `changeOrigin:true`
 * (so the backend sees Host `127.0.0.1:<server port>`) but proxies `/ws` without
 * it (so dev WS arrives with Host `127.0.0.1:<web port>`); both proxy paths
 * forward the page's `Origin: http://127.0.0.1:<web port>`. Hence loopback names
 * are allow-listed on BOTH ports — an attacker cannot make a rebound domain send
 * a loopback Host, so this stays safe.
 */

const LOOPBACK_HOSTNAMES = ['127.0.0.1', 'localhost'] as const;
const ALLOWED_PORTS = [config.port, config.webDevPort] as const;

export const allowedHosts: ReadonlySet<string> = new Set(
  LOOPBACK_HOSTNAMES.flatMap((name) => ALLOWED_PORTS.map((p) => `${name}:${p}`)),
);

export const allowedOrigins: ReadonlySet<string> = new Set(
  LOOPBACK_HOSTNAMES.flatMap((name) => ALLOWED_PORTS.map((p) => `http://${name}:${p}`)),
);

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** A write method whose cross-origin invocation is a CSRF concern. */
export function isStateChangingMethod(method: string): boolean {
  return STATE_CHANGING_METHODS.has(method.toUpperCase());
}

/** The Host must name the loopback server itself (the DNS-rebinding guard). */
export function isAllowedHost(host: string | undefined): boolean {
  return host !== undefined && allowedHosts.has(host);
}

/** A present Origin must be the dashboard's own; an absent Origin (a non-browser
 *  caller) passes — it is not a cross-site-request-forgery vector. */
export function isAllowedOrigin(origin: string | undefined): boolean {
  return origin === undefined || allowedOrigins.has(origin);
}

/**
 * Fastify `onRequest` hook: reject any request whose Host is not the loopback
 * server, and any state-changing request carrying a foreign Origin. Reads with a
 * foreign Origin are left to CORS (which gates whether the response is readable),
 * not blocked here — a cross-origin read that the browser can't read is harmless.
 */
export function originHostGuard(
  req: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
): void {
  if (!isAllowedHost(req.headers.host)) {
    reply.code(403).send({ error: 'forbidden host' });
    return;
  }
  if (isStateChangingMethod(req.method) && !isAllowedOrigin(req.headers.origin)) {
    reply.code(403).send({ error: 'forbidden origin' });
    return;
  }
  done();
}
