import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations(): Promise<void> {
  console.log('🔄 Checking database connectivity...');
  const healthy = await db.isHealthy();
  if (!healthy) {
    console.warn('⚠️ Warning: Could not connect to PostgreSQL. Please ensure PostgreSQL is running (e.g. docker-compose up -d postgres or local service).');
    return;
  }

  console.log('✅ Connected to PostgreSQL. Applying migrations...');
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Executing migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    await db.query(sql);
  }

  console.log('🎉 Migrations applied successfully!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
