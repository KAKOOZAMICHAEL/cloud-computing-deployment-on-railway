-- Portfolio app schema
-- Includes:
-- - projects
-- - skills
-- plus small supporting tables for About + Contact used by the frontend.

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '',
  level TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT NOT NULL DEFAULT '',
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supporting tables for the About Me and Contact sections
CREATE TABLE IF NOT EXISTS portfolio_about (
  id SERIAL PRIMARY KEY,
  headline TEXT NOT NULL,
  about_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  github_url TEXT,
  linkedin_url TEXT,
  location TEXT,
  phone TEXT
);

