import fs from 'node:fs';
import path from 'node:path';
import { pino, multistream } from 'pino';
import { config } from './config.js';

fs.mkdirSync(config.dataDir, { recursive: true });

const logFile = path.join(config.dataDir, 'server.log');

/**
 * Structured JSON logging: pretty stream for the terminal in dev, and an
 * append-only NDJSON file that doubles as the server-side audit log.
 */
export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    base: { service: 'sdlc-command-center' },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  multistream([
    { stream: process.stdout },
    { stream: fs.createWriteStream(logFile, { flags: 'a' }) },
  ]),
);
