const express = require('express');

const { pool } = require('../db/pool');
const { getErrorMessage } = require('../utils/error');

const skillsRouter = express.Router();

skillsRouter.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, category, level FROM skills ORDER BY name ASC;'
    );
    res.json(result.rows);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('skillsRouter.get /api/skills failed:', err);
    const e = new Error(`Failed to load skills: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

skillsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, category, level FROM skills WHERE id = $1;', [id]);
    const skill = result.rows[0];
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('skillsRouter.get /api/skills/:id failed:', err);
    const e = new Error(`Failed to fetch skill: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

skillsRouter.post('/', async (req, res, next) => {
  try {
    const { name, category, level } = req.body || {};
    if (!name) return res.status(400).json({ error: '`name` is required.' });

    const result = await pool.query(
      'INSERT INTO skills (name, category, level) VALUES ($1, $2, $3) RETURNING id, name, category, level;',
      [name, category || '', level || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('skillsRouter.post /api/skills failed:', err);
    const e = new Error(`Failed to create skill: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

skillsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, level } = req.body || {};
    if (!name) return res.status(400).json({ error: '`name` is required.' });

    const result = await pool.query(
      `UPDATE skills
       SET name = $1, category = $2, level = $3
       WHERE id = $4
       RETURNING id, name, category, level;`,
      [name, category || '', level || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json(result.rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('skillsRouter.put /api/skills/:id failed:', err);
    const e = new Error(`Failed to update skill: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

skillsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING id;', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json({ deleted: true, id: result.rows[0].id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('skillsRouter.delete /api/skills/:id failed:', err);
    const e = new Error(`Failed to delete skill: ${getErrorMessage(err)}`);
    e.statusCode = 500;
    next(e);
  }
});

module.exports = { skillsRouter };

