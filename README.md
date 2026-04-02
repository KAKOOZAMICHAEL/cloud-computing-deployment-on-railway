# Fullstack Developer Portfolio (Express + React + PostgreSQL)

This repository contains:
- `backend/`: Node.js (Express) REST API + PostgreSQL
- `frontend/`: React UI that fetches portfolio data and manages projects (full CRUD)

In production, the Express server serves the built React files from `frontend/build`.

---

## Prerequisites

- Node.js (20+ recommended)
- PostgreSQL running locally (or a cloud Postgres instance)

---

## Local development

### 1. Configure environment variables

Copy the backend env template:

- `backend/.env.example` -> `backend/.env`

Update at minimum:
- `DATABASE_URL` (required)
- `PORT` (required)
- `APP_SECRET` (required)
- (optional) `PGSSLMODE`

Copy frontend env template:

- `frontend/.env.example` -> `frontend/.env`

Update (if needed):
- `VITE_API_BASE_URL` (defaults to `/api`)

Local dev uses the Vite dev-server proxy to forward `/api/*` requests to the Express backend.

### 2. Create your PostgreSQL database

Make sure the database in `DATABASE_URL` exists.

### 3. Start the backend

```sh
cd "backend"
npm start
```

The server will:
- create required tables (if missing)
- seed sample data (if tables are empty)

### 4. Start the frontend

Open a new terminal:

```sh
cd "frontend"
npm start
```

You can access:
- Portfolio page: `/`
- Admin panel (project management): `/admin`

---

## Deployment to Railway

This deployment is configured to run the backend and serve the React production build using:
- `Procfile` (starts the backend)
- `nixpacks.toml` (installs deps for both apps and runs `frontend` build so `frontend/build` exists)
- `railway.json` (sets the Railway start command)

### Railway setup steps
1. Create a new Railway project from this repository.
2. Add a PostgreSQL database in Railway (or attach an existing one).
3. Configure environment variables on the Railway service:
   - `DATABASE_URL` = Postgres connection string from Railway (required)
   - `PORT` = Railway sets this automatically, but it must be present for the backend to start (required)
   - `APP_SECRET` = any random string (required)
   - `PGSSLMODE` = optional (set to `require` only if your Postgres requires SSL)
4. Deploy.

After deployment:
- Express serves the built React app from `frontend/build`
- The API is available under `/api`
- Portfolio admin page is available at `/admin`

---

## API endpoints (REST)

- `GET /api/portfolio` (About, Skills, Projects)
- `GET /api/skills`
- `GET /api/skills/:id`
- `POST /api/skills`
- `PUT /api/skills/:id`
- `DELETE /api/skills/:id`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

