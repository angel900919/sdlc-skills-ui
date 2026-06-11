import fs from 'node:fs';
import Fastify, { type FastifyBaseLogger } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import { config, REPO_ROOT } from './config.js';
import { logger } from './logger.js';
import { bus } from './bus.js';
import { registerApiRoutes } from './routes/api.js';
import { registerHookRoutes } from './routes/hooks.js';
import { registerWebSocket } from './ws.js';
import { recoverOrphanedSessions, shutdownAllSessions } from './claude/sessionManager.js';
import { addProject, listProjects, watchAllProjects } from './state/projects.js';

async function main() {
  const app = Fastify({ loggerInstance: logger as unknown as FastifyBaseLogger });

  await app.register(cors, { origin: true });
  await app.register(websocket, { options: { maxPayload: 1_048_576 } });

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
  if (listProjects().length === 0) {
    addProject(REPO_ROOT, 'SDLC Command Center');
  }
  watchAllProjects();

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'shutting down');
    shutdownAllSessions();
    void app.close().then(() => process.exit(0));
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
