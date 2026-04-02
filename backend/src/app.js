const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { portfolioRouter } = require('./routes/portfolio');
const { skillsRouter } = require('./routes/skills');
const { projectsRouter } = require('./routes/projects');
const config = require('./config');

const app = express();

// CORS is only required when frontend is on a different origin (local dev).
const corsOptions = config.corsOrigin ? { origin: config.corsOrigin } : { origin: true };
app.use(cors(corsOptions));
// HTTP request logging (Railway will capture stdout/stderr).
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/portfolio', portfolioRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/projects', projectsRouter);

// Serve the built React frontend in production.
// Vite is configured to output to `frontend/build/`.
{
  const buildDir = path.resolve(__dirname, '../../frontend/build');
  const indexFile = path.join(buildDir, 'index.html');
  const shouldServeFrontend = config.nodeEnv === 'production' || fs.existsSync(indexFile);

  if (shouldServeFrontend) {
    app.use(express.static(buildDir));
    // Express 5 path patterns don't reliably accept `*` as a route path,
    // so use a catch-all middleware instead.
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(indexFile);
    });
  }
}

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler so the frontend gets useful messages.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  // eslint-disable-next-line no-console
  console.error('Express error handler:', err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = { app };

