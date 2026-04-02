# Portfolio Database Schema

This document describes the PostgreSQL tables used by the portfolio app.

## Tables

### `projects`
Stores portfolio projects. Used for displaying and managing projects via the REST API.

Columns:
- `id` : `SERIAL` (Primary Key)
- `title` : `TEXT NOT NULL`
- `description` : `TEXT NOT NULL`
- `tech_stack` : `TEXT NOT NULL DEFAULT ''`
- `github_url` : `TEXT` (nullable)
- `live_url` : `TEXT` (nullable)
- `created_at` : `TIMESTAMPTZ NOT NULL DEFAULT NOW()`

### `skills`
Stores skills shown on the portfolio. Skills include a category and proficiency level.

Columns:
- `id` : `SERIAL` (Primary Key)
- `name` : `TEXT NOT NULL UNIQUE`
- `category` : `TEXT NOT NULL DEFAULT ''`
- `level` : `TEXT` (nullable)

### `portfolio_about`
Used for the About section.

Columns:
- `id` : `SERIAL` (Primary Key)
- `headline` : `TEXT NOT NULL`
- `about_text` : `TEXT NOT NULL`

### `contact_info`
Used for the Contact section.

Columns:
- `id` : `SERIAL` (Primary Key)
- `email` : `TEXT NOT NULL`
- `github_url` : `TEXT` (nullable)
- `linkedin_url` : `TEXT` (nullable)
- `location` : `TEXT` (nullable)
- `phone` : `TEXT` (nullable)

## Notes

- The backend creates the required tables automatically on startup (idempotent).
- Sample data is seeded automatically when tables are empty.

