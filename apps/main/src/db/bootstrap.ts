import { getDb } from './connection';
import fs from 'node:fs';
import path from 'node:path';

export function runMigrations() {
  const db = getDb();
  // Prefer compiled migrations under dist/db/migrations, else fall back to src/db/migrations
  let migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    // __dirname is apps/main/dist/db -> go back to src/db/migrations
    const fallback = path.resolve(__dirname, '../../src/db/migrations');
    if (fs.existsSync(fallback)) {
      migrationsDir = fallback;
    } else {
      // As last resort, try CWD-based path (when running from repo root)
      const cwdFallback = path.resolve(process.cwd(), 'apps/main/src/db/migrations');
      if (fs.existsSync(cwdFallback)) {
        migrationsDir = cwdFallback;
      } else {
        // No migrations found; nothing to run
        return;
      }
    }
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => /^\d+_.*\.sql$/.test(f))
    .sort();

  db.exec('BEGIN');
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      db.exec(sql);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
