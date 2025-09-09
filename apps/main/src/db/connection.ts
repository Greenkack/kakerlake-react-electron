import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

let db: Database.Database | null = null;

export function getDb() {
  if (db) return db;
  
  try {
    const userData = process.env.PORTABLE_EXECUTABLE_DIR
      ? process.env.PORTABLE_EXECUTABLE_DIR
      : (process.env.APPDATA || process.env.LOCALAPPDATA || process.cwd());

    const dbDir = path.join(userData, 'kakerlake', 'data');
    fs.mkdirSync(dbDir, { recursive: true });
    const dbPath = path.join(dbDir, 'app.sqlite');

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    return db;
  } catch (error) {
    console.warn('SQLite not available, running without database:', error);
    // Return a mock database object for development
    return {
      prepare: () => ({ all: () => [], get: () => null, run: () => ({ changes: 0 }) }),
      pragma: () => {},
      close: () => {}
    } as any;
  }
}
