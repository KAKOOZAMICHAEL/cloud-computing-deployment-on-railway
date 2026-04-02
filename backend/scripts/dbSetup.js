const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const databaseUrl = requireEnv('DATABASE_URL');
  const sslMode = process.env.PGSSLMODE || 'disable';

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslMode === 'require' ? { rejectUnauthorized: false } : undefined,
  });

  const schemaPath = path.resolve(__dirname, '..', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Running schema from ${schemaPath} ...`);

  try {
    await pool.query(sql);
    // eslint-disable-next-line no-console
    console.log('Database setup completed successfully.');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('db:setup failed:', err);
  process.exit(1);
});

