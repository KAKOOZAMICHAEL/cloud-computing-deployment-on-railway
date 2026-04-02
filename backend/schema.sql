-- schema.sql (Railway-ready)
-- Copy/paste this entire file into Railway's Postgres query editor to create tables + seed data.

BEGIN;

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT NOT NULL DEFAULT '',
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '',
  level TEXT
);

-- Seed skills (at least 5)
INSERT INTO skills (name, category, level) VALUES
  ('JavaScript', 'Frontend', 'Advanced'),
  ('React', 'Frontend', 'Advanced'),
  ('Node.js', 'Backend', 'Advanced'),
  ('Express', 'Backend', 'Advanced'),
  ('PostgreSQL', 'Database', 'Intermediate')
ON CONFLICT (name) DO NOTHING;

-- Seed projects (at least 3)
INSERT INTO projects (title, description, tech_stack, github_url, live_url) VALUES
(
  'Portfolio Management Dashboard',
  'A full-stack portfolio app with a REST API and PostgreSQL-backed project CRUD.',
  'React, Node.js, Express, PostgreSQL',
  'https://github.com/your-github/portfolio-dashboard',
  'https://example.com'
),
(
  'Task Management API',
  'RESTful task API with validation and database persistence.',
  'Node.js, Express, PostgreSQL',
  'https://github.com/your-github/task-api',
  'https://example.com'
),
(
  'Machine Learning Experiments',
  'Experiment tracking and reproducible pipelines with simple service APIs.',
  'Python, scikit-learn, FastAPI',
  'https://github.com/your-github/ml-experiments',
  'https://example.com'
);

COMMIT;

