const { app } = require('./app');
const { ensureSchema } = require('./db/schema');
const { seedIfEmpty } = require('./db/seed');

// Ensure Railway logs show startup failures clearly.
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

let config;

try {
  config = require('./config');
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(`Startup configuration error: ${err.message}`);
  process.exit(1);
}

async function start() {
  try {
    // Boot-time DB setup (idempotent).
    await ensureSchema();
    await seedIfEmpty();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Startup database initialization failed: ${err.message}`);
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

