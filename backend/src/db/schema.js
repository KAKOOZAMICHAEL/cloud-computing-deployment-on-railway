const { pool } = require('./pool');
const { getErrorMessage } = require('../utils/error');

async function ensureSchema() {
  // Create tables if they don't exist yet.
  const queries = [
    `CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL DEFAULT '',
      level TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL DEFAULT '',
      github_url TEXT,
      live_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS portfolio_about (
      id SERIAL PRIMARY KEY,
      headline TEXT NOT NULL,
      about_text TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS contact_info (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      github_url TEXT,
      linkedin_url TEXT,
      location TEXT,
      phone TEXT
    );`,
  ];

  try {
    for (let i = 0; i < queries.length; i++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await pool.query(queries[i]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`DB schema init failed (query ${i + 1}/${queries.length})`, err);
        throw new Error(`Failed to initialize database schema: ${getErrorMessage(err)}`);
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ensureSchema error:', err);
    throw err;
  }
}

module.exports = { ensureSchema };

