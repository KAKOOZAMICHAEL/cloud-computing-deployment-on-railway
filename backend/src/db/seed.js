const { pool } = require('./pool');
const { getErrorMessage } = require('../utils/error');

function normalizeTechInputToStack(technologies) {
  if (!technologies) return '';
  if (Array.isArray(technologies)) {
    return technologies.map((t) => String(t).trim()).filter(Boolean).join(', ');
  }
  // Allow comma-separated input.
  return String(technologies)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .join(', ');
}

async function seedIfEmpty() {
  try {
    const { rows: aboutRows } = await pool.query('SELECT id FROM portfolio_about LIMIT 1;');
    if (aboutRows.length === 0) {
      try {
        await pool.query(
          'INSERT INTO portfolio_about (headline, about_text) VALUES ($1, $2);',
          [
            'Software Developer',
            'I build full-stack web applications using modern JavaScript, React, Node.js, and PostgreSQL.',
          ]
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Seed: failed to insert portfolio_about', err);
        throw new Error(`Failed to seed portfolio_about: ${getErrorMessage(err)}`);
      }
    }

    const { rows: contactRows } = await pool.query('SELECT id FROM contact_info LIMIT 1;');
    if (contactRows.length === 0) {
      try {
        await pool.query(
          'INSERT INTO contact_info (email, github_url, linkedin_url, location, phone) VALUES ($1, $2, $3, $4, $5);',
          ['you@example.com', 'https://github.com/your-github', 'https://linkedin.com/in/your-linkedin', 'Your City, Country', '']
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Seed: failed to insert contact_info', err);
        throw new Error(`Failed to seed contact_info: ${getErrorMessage(err)}`);
      }
    }

    const { rows: skillRows } = await pool.query('SELECT id FROM skills LIMIT 1;');
    if (skillRows.length === 0) {
      const skills = [
        { name: 'JavaScript', category: 'Frontend', level: 'Advanced' },
        { name: 'React', category: 'Frontend', level: 'Advanced' },
        { name: 'Node.js', category: 'Backend', level: 'Advanced' },
        { name: 'Express', category: 'Backend', level: 'Advanced' },
        { name: 'PostgreSQL', category: 'Database', level: 'Intermediate' },
      ];

      for (let i = 0; i < skills.length; i++) {
        const s = skills[i];
        try {
          await pool.query(
            'INSERT INTO skills (name, category, level) VALUES ($1, $2, $3);',
            [s.name, s.category, s.level]
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`Seed: failed to insert skill (${i + 1}/${skills.length})`, err);
          throw new Error(`Failed to seed skills: ${getErrorMessage(err)}`);
        }
      }
    }

    const { rows: projectRows } = await pool.query('SELECT id FROM projects LIMIT 1;');
    if (projectRows.length === 0) {
      const projects = [
        {
          title: 'Portfolio Management Dashboard',
          description: 'A full-stack portfolio app with REST API + PostgreSQL-backed CRUD for projects.',
          github_url: 'https://github.com/your-github/portfolio-dashboard',
          live_url: 'https://example.com',
          tech_stack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
        },
        {
          title: 'Task Management API',
          description: 'RESTful task API with validation and database persistence.',
          github_url: 'https://github.com/your-github/task-api',
          live_url: 'https://example.com',
          tech_stack: ['Node.js', 'Express', 'PostgreSQL'],
        },
        {
          title: 'Machine Learning Experiments',
          description: 'Experiment tracking and reproducible ML pipelines with simple service APIs.',
          github_url: 'https://github.com/your-github/ml-experiments',
          live_url: 'https://example.com',
          tech_stack: ['Python', 'scikit-learn', 'FastAPI'],
        },
      ];

      for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        try {
          await pool.query(
            `INSERT INTO projects
              (title, description, github_url, live_url, tech_stack)
             VALUES ($1, $2, $3, $4, $5);`,
            [p.title, p.description, p.github_url, p.live_url, normalizeTechInputToStack(p.tech_stack)]
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`Seed: failed to insert project (${i + 1}/${projects.length})`, err);
          throw new Error(`Failed to seed projects: ${getErrorMessage(err)}`);
        }
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('seedIfEmpty error:', err);
    throw err;
  }
}

module.exports = { seedIfEmpty };

