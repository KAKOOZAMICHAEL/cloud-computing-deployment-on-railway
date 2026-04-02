const path = require('path');
const dotenv = require('dotenv');

// Load only from the .env file in the backend folder.
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Only require variables that are needed for the backend to function.
// In production, the frontend is served by Express from the same origin, so CORS is optional.
const requiredEnv = ['DATABASE_URL', 'PORT', 'APP_SECRET'];
for (const k of requiredEnv) requireEnv(k);

const PORT_NUMBER = Number(process.env.PORT);
if (!Number.isFinite(PORT_NUMBER) || PORT_NUMBER <= 0) {
  throw new Error(`Invalid PORT value. Must be a positive number. Received: ${process.env.PORT}`);
}

module.exports = {
  port: PORT_NUMBER,
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || undefined,
  appSecret: process.env.APP_SECRET,
  pgSslMode: process.env.PGSSLMODE || 'disable',
  nodeEnv: process.env.NODE_ENV || 'development',
};

