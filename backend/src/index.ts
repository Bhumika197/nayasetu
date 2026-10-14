import { app } from './app.js';
import { env } from './config/env.js';
import { runMigrations } from './database/migrate.js';

async function startServer() {
  // Attempt migrations on startup if PostgreSQL is connected
  try {
    await runMigrations();
  } catch (err) {
    console.warn('Notice: Migrations skipped or deferred pending active database connection.');
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 NYAYASETU Backend running on http://localhost:${env.PORT}`);
    console.log(`   Health endpoint: http://localhost:${env.PORT}/api/v1/health`);
    console.log(`   Environment: ${env.NODE_ENV}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
