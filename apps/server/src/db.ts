import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { config } from './config.js';

fs.mkdirSync(config.dataDir, { recursive: true });

export const db: Database.Database = new Database(path.join(config.dataDir, 'command-center.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  root_path TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  last_activity_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  cwd TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  pid INTEGER,
  exit_code INTEGER,
  launch_prompt TEXT,
  created_at TEXT NOT NULL,
  ended_at TEXT,
  resumed_from TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS hook_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL,
  hook_event_name TEXT NOT NULL,
  session_id TEXT,
  cwd TEXT,
  tool_name TEXT,
  payload TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hook_events_session ON hook_events(session_id, id);

CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  source TEXT NOT NULL,
  kind TEXT NOT NULL,
  project_id TEXT,
  session_id TEXT,
  summary TEXT NOT NULL,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_events_project ON audit_events(project_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_session ON audit_events(session_id, id DESC);

CREATE TABLE IF NOT EXISTS transcript_messages (
  uuid TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  blocks TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_transcript_session ON transcript_messages(session_id, timestamp);
`);
