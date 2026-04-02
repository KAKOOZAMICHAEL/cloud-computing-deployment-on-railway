const { Pool } = require('pg');
const config = require('./src/config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.pgSslMode === 'require' ? { rejectUnauthorized: false } : undefined,
});

module.exports = { pool };

