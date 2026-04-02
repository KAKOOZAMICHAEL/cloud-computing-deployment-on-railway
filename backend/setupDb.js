const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function setupDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }

  const sslMode = process.env.PGSSLMODE || 'disable';
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslMode === 'require' ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL DEFAULT '',
        level TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech_stack TEXT NOT NULL DEFAULT '',
        github_url TEXT,
        live_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      INSERT INTO skills (name, category, level) VALUES
        ('JavaScript', 'Frontend', 'Advanced'),
        ('React', 'Frontend', 'Advanced'),
        ('Node.js', 'Backend', 'Advanced'),
        ('Express', 'Backend', 'Advanced'),
        ('PostgreSQL', 'Database', 'Intermediate')
      ON CONFLICT (name) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO projects (title, description, tech_stack, github_url, live_url) VALUES
        (
          'Portfolio Management Dashboard',
          'Fullstack portfolio app with CRUD project management and PostgreSQL persistence.',
          'React, Node.js, Express, PostgreSQL',
          'https://github.com/KAKOOZAMICHAEL/cloud-computing-deployment-on-railway',
          'https://railway.com/project/135a19a8-19a7-44fc-b17a-44aa10e91259'
        ),
        (
          'Railway Deployment Pipeline',
          'Single-service deployment setup that serves React static assets from Express.',
          'Railway, Nixpacks, Node.js, Express',
          'https://github.com/KAKOOZAMICHAEL/cloud-computing-deployment-on-railway',
          'https://railway.com/project/135a19a8-19a7-44fc-b17a-44aa10e91259'
        ),
        (
          'Portfolio Admin Panel',
          'Admin page for creating, editing, and deleting portfolio projects through REST APIs.',
          'React Router, REST API, PostgreSQL',
          'https://github.com/KAKOOZAMICHAEL/cloud-computing-deployment-on-railway',
          'https://railway.com/project/135a19a8-19a7-44fc-b17a-44aa10e91259'
        );
    `);

    // Required success log message
    // eslint-disable-next-line no-console
    console.log('Tables created and data seeded successfully');
  } finally {
    await pool.end();
  }
}

setupDb().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('setupDb failed:', err);
  process.exit(1);
});

