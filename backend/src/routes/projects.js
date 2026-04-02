const express = require('express');

const { pool } = require('../db/pool');
const { getErrorMessage } = require('../utils/error');

const projectsRouter = express.Router();

function techStackToArray(techStack) {
  if (!techStack) return [];
  return String(techStack)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function technologiesToTechStack(input) {
  if (!input) return '';
  if (Array.isArray(input)) {
    return input.map((t) => String(t).trim()).filter(Boolean).join(', ');
  }
  // Accept comma-separated input from clients.
  return String(input)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .join(', ');
}

function toFrontendProject(row) {
  return {
    id: row.id,
    name: row.title,
    description: row.description,
    repo_url: row.github_url,
    live_url: row.live_url,
    technologies: techStackToArray(row.tech_stack),
    created_at: row.created_at,
  };
}

projectsRouter.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, github_url, live_url, tech_stack, created_at FROM projects ORDER BY created_at DESC;'
    );
    res.json(result.rows.map(toFrontendProject));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('projectsRouter.get /api/projects failed:', err);
    const e = new Error(`Failed to list projects: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

projectsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, description, github_url, live_url, tech_stack, created_at FROM projects WHERE id = $1;',
      [id]
    );
    const project = result.rows[0];
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(toFrontendProject(project));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('projectsRouter.get /api/projects/:id failed:', err);
    const e = new Error(`Failed to fetch project: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

projectsRouter.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      repoUrl,
      repo_url,
      liveUrl,
      live_url,
      technologies,
      tech_stack,
    } = req.body || {};

    if (!name || !description) {
      return res.status(400).json({ error: '`name` and `description` are required.' });
    }

    const techStack = technologiesToTechStack(technologies ?? tech_stack);

    const result = await pool.query(
      `INSERT INTO projects
        (title, description, github_url, live_url, tech_stack)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, github_url, live_url, tech_stack, created_at;`,
      [name, description, repoUrl ?? repo_url ?? null, liveUrl ?? live_url ?? null, techStack]
    );

    res.status(201).json(toFrontendProject(result.rows[0]));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('projectsRouter.post /api/projects failed:', err);
    const e = new Error(`Failed to create project: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

projectsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      repoUrl,
      repo_url,
      liveUrl,
      live_url,
      technologies,
      tech_stack,
    } = req.body || {};

    if (!name || !description) {
      return res.status(400).json({ error: '`name` and `description` are required.' });
    }

    // Keep existing behavior: frontend sends all fields on update; if a field is missing,
    // we store empty values for safety.
    const techStack = technologiesToTechStack(technologies ?? tech_stack);

    const result = await pool.query(
      `UPDATE projects
       SET
         title = $1,
         description = $2,
         github_url = $3,
         live_url = $4,
         tech_stack = $5
       WHERE id = $6
       RETURNING id, title, description, github_url, live_url, tech_stack, created_at;`,
      [name, description, repoUrl ?? repo_url ?? null, liveUrl ?? live_url ?? null, techStack, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(toFrontendProject(result.rows[0]));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('projectsRouter.put /api/projects/:id failed:', err);
    const e = new Error(`Failed to update project: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

projectsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id;', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ deleted: true, id: result.rows[0].id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('projectsRouter.delete /api/projects/:id failed:', err);
    const e = new Error(`Failed to delete project: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

module.exports = { projectsRouter };

