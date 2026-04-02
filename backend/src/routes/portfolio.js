const express = require('express');

const { pool } = require('../db/pool');
const { getErrorMessage } = require('../utils/error');

const portfolioRouter = express.Router();

function techStackToArray(techStack) {
  if (!techStack) return [];
  return String(techStack)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

portfolioRouter.get('/', async (req, res, next) => {
  try {
    const [aboutResult, contactResult, skillsResult, projectsResult] = await Promise.all([
      pool.query('SELECT headline, about_text FROM portfolio_about ORDER BY id LIMIT 1;'),
      pool.query('SELECT email, github_url, linkedin_url, location, phone FROM contact_info ORDER BY id LIMIT 1;'),
      pool.query('SELECT id, name, category, level FROM skills ORDER BY name ASC;'),
      pool.query(
        'SELECT id, title, description, github_url, live_url, tech_stack, created_at FROM projects ORDER BY created_at DESC;'
      ),
    ]);

    res.json({
      about: aboutResult.rows[0] || null,
      contact: contactResult.rows[0] || null,
      skills: skillsResult.rows,
      projects: projectsResult.rows.map((p) => ({
        id: p.id,
        name: p.title,
        description: p.description,
        repo_url: p.github_url,
        live_url: p.live_url,
        technologies: techStackToArray(p.tech_stack),
        created_at: p.created_at,
      })),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('portfolioRouter.get /api/portfolio failed:', err);
    const e = new Error(`Failed to load portfolio: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

module.exports = { portfolioRouter };

