import fs from 'node:fs';
import Fastify, { type FastifyBaseLogger } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import { config, REPO_ROOT } from './config.js';
import { logger } from './logger.js';
import { allowedOrigins, originHostGuard } from './originGuard.js';
import { bus } from './bus.js';
import { registerApiRoutes } from './routes/api.js';
import { registerHookRoutes } from './routes/hooks.js';
import { registerWebSocket } from './ws.js';
import { recoverOrphanedSessions, shutdownAllSessions } from './claude/sessionManager.js';
import { addProject, listProjects, watchAllProjects } from './state/projects.js';
import { backfillSearchIndex } from './state/search.js';
import { backfillUsageSamples } from './state/usageTracker.js';
import { initTelemetry } from './otel.js';

async function main() {
  // Opt-in OpenTelemetry export: no-op (null) unless OTEL_EXPORTER_OTLP_ENDPOINT is set.
  const otel = await initTelemetry();

  const app = Fastify({ loggerInstance: logger as unknown as FastifyBaseLogger });

  // The loopback bind is not a sufficient boundary against a hostile browser
  // tab (CSRF / DNS-rebinding / cross-site WS hijack) — originHostGuard is.
  // CORS is tightened off `origin: true` to the dashboard's own origins so a
  // foreign page also can't read responses; the guard is the write-side defense.
  await app.register(cors, { origin: [...allowedOrigins] });
  await app.register(websocket, { options: { maxPayload: 1_048_576 } });
  app.addHook('onRequest', originHostGuard);

  registerApiRoutes(app);
  registerHookRoutes(app);
  registerWebSocket(app);

  // Serve the built dashboard in production (vite dev server is used in dev).
  if (fs.existsSync(config.webDistDir)) {
    await app.register(fastifyStatic, { root: config.webDistDir, prefix: '/' });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api') || req.url.startsWith('/ws')) {
        reply.code(404).send({ error: 'not found' });
      } else {
        reply.sendFile('index.html');
      }
    });
  }

  // Crash recovery: mark orphaned sessions interrupted (they can be resumed),
  // re-attach project watchers, self-register this repo on first boot.
  recoverOrphanedSessions();
  const indexed = backfillSearchIndex();
  if (indexed > 0) logger.info({ indexed }, 'backfilled transcript search index');
  const usageRows = backfillUsageSamples();
  if (usageRows > 0) logger.info({ usageRows }, 'backfilled usage telemetry');
  if (listProjects().length === 0) {
    addProject(REPO_ROOT, 'SDLC Command Center');
  }
  watchAllProjects();

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'shutting down');
    shutdownAllSessions();
    void Promise.allSettled([app.close(), otel ? otel.shutdown() : Promise.resolve()]).then(() =>
      process.exit(0),
    );
    setTimeout(() => process.exit(0), 3000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  await app.listen({ port: config.port, host: config.host });
  bus.audit({ source: 'server', kind: 'server_started', summary: `Command Center backend listening on ${config.host}:${config.port}` });
}

main().catch((err) => {
  logger.fatal({ err }, 'server failed to start');
  process.exit(1);
});
